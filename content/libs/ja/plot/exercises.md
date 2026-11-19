---
title: 演習問題と試験
description: "@edubeam/fem と @edubeam/plot で、シード値から学生ごとに異なる構造力学の演習問題を生成。常に正しい解答付きで、Web ページ、印刷した試験、LaTeX や Word 用の SVG にできます。"
order: 5
group: 活用例
source: site
---

# 演習問題と試験

構造物をシード値（乱数の種）の関数として一度書いておけば、毎週、学生 1 人ひとりに別々の演習問題を用意でき、どの問題にも常に正しい解答が付きます。@edubeam/fem が問題を解き、@edubeam/plot が同じモデルから問題図と解答図を描くからです。

下の**新しい問題**を押してください。押すたびに新しいシード値で問題が生成され、ブラウザの中で解かれて描かれます。

::exercise-generator
::

このデモは、このサイトの 2 つのページの問題を描いています。どちらも、ここで説明する部品で作られています。[構造力学の練習問題](/ja/practice)では、学生が反力と最大曲げモーメントまたは最大部材力を入力すると、その場で答え合わせができます。[試験問題作成ツール](/ja/exam)は、学生ごとに数値の異なるバージョンの試験を解答付きで印刷し、図を SVG ファイルとして、答えを CSV として保存します。自分で書く前に、まず試してみてください。

## しくみ {#how-it-works}

1. **シード値が数値を決める。** シード付きの乱数生成器は、同じシード値からは同じ問題を生成します。そのため、プリントに印刷したシード値から、いつでも解答にたどり着けます。
2. **ソルバーが解答を出す。** 各構造物を @edubeam/fem が解くので、反力やモーメントは、書き間違えるおそれのある公式ではなくソルバーから得られます。
3. **@edubeam/plot が両方を描く。** 問題図には節点ラベル、寸法線、記号で示した未知の反力を付けた構造物を描き、解答図には反力の値を書いて断面力図を加えます。

ここから印刷した試験までは、短いファイルがいくつかあれば足ります。[ジェネレーター](#the-generator)、Web ページ用の[コンポーネント](#the-exercise-in-a-page)、そして試験を印刷したり、LaTeX や Word 用の[図を書き出したり](#figures-for-latex-and-word)する[スクリプト](#print-a-test)です。[ライブラリをインストールした](/ja/plot/getting-started#install)プロジェクトにコピーしてください。スクリプトは Node 22.18 以降なら `node` で、それより古いバージョンでは `npx tsx` で実行できます。

## ジェネレーター {#the-generator}

`exercise.ts` という 1 つのモジュールが、シード値を演習問題に変えます。問題は、ピン支点とローラー支点で支えた梁です。半分の確率で張り出し部があり、その先端に集中荷重が作用します。どちらの形も静定なので、どのシード値の問題も、ソルバーと同じように手計算でも解けます。

```ts [exercise.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { extremes, modelFromSolver, type PlotModel } from '@edubeam/plot'

export interface Exercise {
  readonly seed: number
  readonly statement: string
  /** 解析済みの構造物（プレーンなデータ）：問題図と解答図の両方をここから描く */
  readonly model: PlotModel
  /** 上向きを正とする支点反力、N、と曲げモーメントの最大値・最小値、N·m */
  readonly key: { RA: number; RB: number; mMax: number; mMin: number }
}

/** mulberry32：小さなシード付き乱数生成器。同じシード値はいつまでも同じ問題を指す */
const random = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), seed | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export const makeExercise = (seed: number): Exercise => {
  const r = random(seed)
  const pick = <T>(xs: readonly T[]): T => xs[Math.floor(r() * xs.length)]
  const int = (lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1))

  // ピン支点とローラー支点で支えたスパン。半分の確率で張り出し部付き。静定なので必ず解ける
  const L = pick([4, 5, 6]) // m
  const c = pick([0, 0, 1, 1.5, 2]) // 張り出し部の長さ、m
  const q = int(4, 12) // スパン上の kN/m
  const F = int(2, 6) * 5 // 先端の kN。張り出し部がなければ A から `a` の位置
  const a = int(1, L - 1) // m

  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  if (c > 0) {
    domain.createNode('C', [L + c, 0, 0])
    domain.createBeam2D(2, ['B', 'C'], 1, 1)
    lc.createNodalLoad('C', { [DofID.Dz]: F * 1e3 })
  } else {
    lc.createBeamConcentratedLoad(1, [0, F * 1e3, 0, a], true)
  }
  solver.solve()

  const statement =
    c > 0
      ? `Span L = ${L} m with an overhang c = ${c} m. q = ${q} kN/m on the span, F = ${F} kN at the tip C.`
      : `Span L = ${L} m. q = ${q} kN/m over the span, F = ${F} kN at ${a} m from A.`

  // 解析済みモデルから解答を得る：反力（z は下向きなので、上向きは負）と M の厳密な極値
  const model = modelFromSolver(solver)
  const { reactions, members } = model.results!
  const up = (node: string) => -(reactions.find((x) => x.node === node && x.dof === 'dz')?.value ?? 0)
  const m = Object.values(members).flatMap((member) => extremes(member.M) ?? [])
  const mMax = Math.max(...m.map((e) => e.max.value))
  const mMin = Math.min(...m.map((e) => e.min.value))

  return { seed, statement, model, key: { RA: up('A'), RB: up('B'), mMax, mMin } }
}
```

`modelFromSolver` は、解析済みの構造物を[描画モデル](/ja/plot/model)に読み出します。反力と各部材の結果を厳密な多項式として持つプレーンなデータなので、`extremes` はサンプリングせずに最大モーメントを求められます。演習問題はこのモデルだけを保持し、ソルバーはもう必要ありません。

シード値 5 からは「Span L = 6 m with an overhang c = 1.5 m. q = 5 kN/m on the span, F = 25 kN at the tip C.」という問題文が生成されます。解答は、$R_A = (5 \cdot 6 \cdot 3 - 25 \cdot 1.5)/6 = 8.75$ kN、$R_B = 5 \cdot 6 + 25 - 8.75 = 46.25$ kN、支点上で $M_B = -25 \cdot 1.5 = -37.5$ kNm、せん断力がゼロになるスパン内の位置で $M = 8.75^2/(2 \cdot 5) = 7.66$ kNm です。ソルバーの値は最後の桁まで一致します。

## Web ページで {#the-exercise-in-a-page}

`ExerciseCard.vue` というコンポーネントが問題を描き、`answers` を指定すると解答を描きます。

```vue [ExerciseCard.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { formatQuantity, KN_UNITS, StructurePlot, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise'

const props = defineProps<{ seed: number; answers?: boolean }>()
const exercise = computed(() => makeExercise(props.seed))

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']
const twoDecimals = new Intl.NumberFormat('en', { maximumFractionDigits: 2 })
const kN = (si: number) => formatQuantity(si, KN_UNITS.force, twoDecimals)
const kNm = (si: number) => formatQuantity(si, KN_UNITS.moment, twoDecimals)
</script>

<template>
  <article>
    <h3>Exercise {{ seed }}</h3>
    <p>{{ exercise.statement }} Find the reactions and draw the bending moment diagram.</p>
    <StructurePlot
      :model="exercise.model"
      :layers="answers ? key : sheet"
      :reserve="[...sheet, ...key]"
      :reaction-labels="answers ? 'values' : 'names'"
      :reserve-reaction-labels="['names', 'values']"
    />
    <p v-if="answers">
      R<sub>A</sub> = {{ kN(exercise.key.RA) }}, R<sub>B</sub> = {{ kN(exercise.key.RB) }},
      M from {{ kNm(exercise.key.mMin) }} to {{ kNm(exercise.key.mMax) }}
    </p>
  </article>
</template>
```

```vue
<ExerciseCard :seed="5" />
<ExerciseCard :seed="5" answers />
```

2 つ目のカードの最後は *R<sub>A</sub> = 8.75 kN, R<sub>B</sub> = 46.25 kN, M from −37.5 kNm to 7.66 kNm* となります。`formatQuantity` は、図と同じく単位と正式なマイナス記号（−）を付けて書きます。

問題図では、`reaction-labels="names"` が反力を未知数として描きます。支点が拘束する方向ごとに、正とする向き（右向き、上向き、反時計回り）の矢印を描き、大きさの代わりに *A<sub>x</sub>*、*A<sub>z</sub>*、*M<sub>A</sub>* という記号を付けます。これで、すべての答えの符号が図の上で定義されます。逆向きに作用する反力は負です。解答図には値が書かれます。

`reserve` は両方の表示のレイヤーを最初からレイアウトに含めます。そのため、自習用の*解答を表示*ボタンなどで `answers` をオンにすると、断面力図が所定の位置にフェードインします（[段階的に組み上がる図](/ja/plot/structure-plot#figures-that-build-up)）。`reserve-reaction-labels` は反力について同じことをするので、記号が値に変わっても梁は動きません。[未知数としての反力](/ja/plot/structure-plot#reactions-as-unknowns)を参照してください。

## 試験の印刷 {#print-a-test}

筆記試験には、Node のスクリプト `print-test.ts` を使います。学生ごとに 1 ページを書き出し、その後に解答を並べます。`structureSvg` が各モデルを SVG のテキストに変えるので、スクリプトには Vue もブラウザも要りません。

```ts [print-test.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const students = ['Ada', 'Ben', 'Cleo']
const exercises = students.map((_, i) => makeExercise(1000 + i)) // シード値 1000、1001、…

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']
const task = 'Find the reactions and draw the bending moment diagram.'

const pages = [
  ...exercises.map((e, i) => `<h2>${students[i]}, exercise ${e.seed}</h2>
    <p>${e.statement} ${task}</p>${structureSvg(e.model, { layers: sheet, reactionLabels: 'names' })}`),
  ...exercises.map((e) => `<h2>Key, exercise ${e.seed}</h2>
    ${structureSvg(e.model, { layers: key })}`),
]

const style = `body { font: 15px/1.5 system-ui, sans-serif; max-width: 640px; margin: 2rem auto }
  section { break-after: page }`
writeFileSync('test.html', `<!doctype html><meta charset="utf-8"><title>Test</title>
  <style>${style}</style>${pages.map((page) => `<section>${page}</section>`).join('\n')}`)
```

```bash
node print-test.ts
```

`test.html` をブラウザで開いて印刷するか、PDF として保存します。学生ごとの問題と各解答が、それぞれ 1 ページになります。Ada のページとその解答は次のとおりです。

![問題 1000：スパン 6 m と長さ 2 m の張り出し部、スパンに 10 kN/m、先端に 30 kN、記号 A_x、A_z、B_z の付いた未知の反力、6 m と 2 m の連続寸法と全長 8 m。その下は解答で、反力 20 と 70、曲げモーメントは支点上の −60 からスパン内の 20 まで](/screenshots/ja/p2p-plot-exercise-sheet.webp){.shot-lg}

`dimensions` レイヤーは、演習プリントと同じように各スパンと全長を示し、`reactionLabels: 'names'` は未知数に記号を付けます。各矢印は、その答えを正とする向きを指します。解答では、反力と断面力図の値は EduBeam アプリと同じく kN と kNm の数値だけです。学生に伝える必要があれば、解答の見出しに単位を書いておいてください。白黒のコピー機で刷るときは、すべてのトーンを黒にした `colors` を渡します。[白黒](/ja/plot/theming#black-and-white)を参照してください。

## LaTeX と Word 用の図 {#figures-for-latex-and-word}

試験を LaTeX や Word で作っているなら、図だけをファイルとして書き出し、自分のテンプレートをそのまま使ってください。`figures.ts` は、30 個のシード値について問題図と解答図を書き出します。

```ts [figures.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']

for (let seed = 1000; seed < 1030; seed++) {
  const { model } = makeExercise(seed)
  writeFileSync(`exercise-${seed}.svg`, structureSvg(model, { layers: sheet, reactionLabels: 'names' }))
  writeFileSync(`exercise-${seed}-key.svg`, structureSvg(model, { layers: key }))
}
```

`node figures.ts` で実行すると、学生 30 人分で 60 個のファイルができます。どれも固定色のプレーンな SVG で、CSS もスクリプトも含みません。

- **Word**（2019 と Microsoft 365）は、SVG をそのまま挿入できます（*挿入 › 画像*）。
- **LaTeX** は、SVG ではなく PDF を取り込みます。[CairoSVG](https://cairosvg.org)（`cairosvg exercise-1000.svg -o exercise-1000.pdf`）か Inkscape で一度変換し、`\includegraphics[width=\linewidth]{exercise-1000.pdf}` で取り込みます。Inkscape がインストールされていれば、`svg` パッケージの `\includesvg` が変換を代わりに行います。

図は幅 640 単位、文字は 13 単位なので、A4 の本文幅（約 16 cm）に合わせると、ラベルは 9 pt になります。`fontFamily` には文書で使っているフォントを指定してください。すべてのオプションは[単体の SVG ファイル](/ja/plot/functions#a-standalone-svg-file)にあります。

## 自分用に拡張する {#make-it-your-own}

- **構造物の種類を増やす。** 片持ち梁、2 径間連続梁、門形ラーメン、トラスなどを加えます。冒頭のライブデモは、単純梁から 3 ヒンジラーメン、ワーレントラス、門形ラーメンまで、8 種類から選んでいます。
- **不静定の演習問題。** ソルバーは不静定構造も同じように解きます。長くなるのは手計算の解答だけです。
- **きりのよい数値。** 上の例のように荷重や長さを短いリストから選べば、解答を望みどおりのきりのよい値にできます。数百個のシード値をループで回し、解答の小数桁が多すぎるものは除外します。
- **不安定構造への対策。** 支点を不適切に配置することがあるジェネレーターでは、`try` の中で解き、例外を投げたシード値は飛ばしてください。[解析に失敗するとき](/ja/solver/solving#when-solving-fails)を参照してください。
- **求めるものを増やす。** せん断力（`'V'`）、たわみ（`'w'`、値は [`getUnknowns`](/ja/solver/results#displacements) から）、傾斜した部材の軸力を描かせます。
