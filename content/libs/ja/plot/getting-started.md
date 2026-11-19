---
title: クイックスタート
description: "@edubeam/plot をインストールし、@edubeam/fem で解いた梁を荷重、反力、曲げモーメントとともに Vue 3 で描画。モデルの変更に合わせた再描画と SVG ファイルへの保存も扱います。"
order: 1
group: 入門
source: site
---

# クイックスタート

描画ライブラリ @edubeam/plot は、平面の梁、ラーメン、トラスとその解析結果を SVG で描きます。部材、支点、荷重、反力、N 図・V 図・M 図、変位図まで、このサイトの図とまったく同じ見た目です。[EduBeam]{.edubeam} の中で動いているソルバー [@edubeam/fem](/ja/solver) で解いたモデルを渡すだけで、レイアウト、縮尺、それぞれの数値をどこに書くかはライブラリが決めます。

教員はこのライブラリを、シード値（乱数の種）から生成する[演習問題と試験](/ja/plot/exercises)、クリックごとに図が組み上がっていく[スライド](/ja/plot/slides)、講義資料の図に使っています。図は Web ページにも、LaTeX や Word 用のファイルにもできます。このサイトの[構造力学の練習問題](/ja/practice)と[試験問題作成ツール](/ja/exam)も、このライブラリで作られています。

::div{.actions}
[最初の図を描く](#draw-a-solved-model) [演習問題を生成する](/ja/plot/exercises)
::

## インストール {#install}

```bash
npm install @edubeam/plot @edubeam/fem vue
```

Vue 3.5 以降とソルバーは peer dependencies なので、アプリにはそれぞれ 1 つずつしか入りません。パッケージは ESM 専用で、型定義を同梱し、スタイルシートは不要です。Node 20.19 以降で動作します。TypeScript で書いたスクリプトを `node script.ts` でそのまま実行するには、Node 22.18 以降が必要です。

## 解析済みモデルの描画 {#draw-a-solved-model}

ファイルは 2 つです。1 つ目の `beams.ts` は、@edubeam/fem で梁を組み立てて解きます。ただの関数なので、同じモデルをページにもスライドにもスクリプトにも使えます。

```ts [beams.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** スパン `span` m、等分布荷重 `q` kN/m の単純梁を解いて返す。ソルバーは SI 単位で計算する。 */
export const simpleBeam = (span: number, q: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 }) // 鋼材、Pa
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 }) // IPE 200、せん断変形なし
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // ピン支点
  domain.createNode('B', [span, 0, 0], [DofID.Dz]) // ローラー支点
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true) // N/m、+z は下向き
  solver.solve()
  return solver
}
```

2 つ目の `BeamFigure.vue` は、ソルバーを `StructurePlot` に渡し、何を描くかを指定します。

```vue [BeamFigure.vue]
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams'

const beam = simpleBeam(6, 12)
</script>

<template>
  <StructurePlot :solver="beam" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
</template>
```

これで図は完成です。支点に載った梁、12 kN/m の荷重、36 kN の反力 2 つ、そして曲げモーメントが描かれます。曲げモーメントはスパン中央で $qL^2/8 = 54$ kNm となり、引張側に描かれます。

::model-figure{caption="BeamFigure.vue が描く図：スパン 6 m、12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
labels: horizontal
---
::

図はコンテナの幅いっぱいに広がり、高さは自動で決まります。文字、記号、線の太さは構造物の大きさにかかわらずピクセル単位で一定なので、スマートフォンでも図が読みやすいままです。`layers` を省略すると、表示する結果は自動で選ばれます。梁とラーメンでは M、トラスでは N です。[レイヤー](/ja/plot/structure-plot#layers)の一覧は `StructurePlot` のページに、モデルの組み立て方は[ソルバーのドキュメント](/ja/solver/getting-started)にあります。

## モデルが変わったとき {#when-the-model-changes}

図は渡されたソルバーを読むだけで、その変化を監視してはいません。何かが変わったら、もう一度解いて新しいソルバーを渡します。`computed` がちょうどその役目を果たします。

```vue [LoadSlider.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams'

const q = ref(12) // kN/m
const beam = computed(() => simpleBeam(6, q.value))
</script>

<template>
  <input v-model.number="q" type="range" min="1" max="30" />
  <StructurePlot :solver="beam" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
</template>
```

このくらいの梁なら約 1 ミリ秒で解けるので、スライダーを動かすと図がそのまま追従します。ソルバーを作り直さずにその場で変更した場合は、`revision` プロパティの値を増やすと、図がソルバーを読み直します。

::callout{type="tip" title="ソルバーを深いリアクティビティに入れない"}
`computed`、プロパティ、ただの `const` は、ソルバーをそのまま保持します。コンポーネントの状態にソルバーを持たせるときは、`shallowRef` を使うか `markRaw` で包んでください。通常の `ref` では、Vue がソルバー全体をたどってリアクティブにしようとするので、無駄な処理になります。
::

## ファイルとして保存する {#save-it-as-a-file}

LaTeX、Word、Inkscape で使う図には `structureSvg` を使います。同じ図を、固定色の単体の SVG ファイルとして書き出します。Vue もブラウザも不要で、Node だけで動きます。次のスクリプトを、`beams.ts` と同じフォルダーに `beam-svg.ts` として保存します。

```ts [beam-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { simpleBeam } from './beams.ts'

const svg = structureSvg(modelFromSolver(simpleBeam(6, 12)), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
})
writeFileSync('beam.svg', svg)
```

`node beam-svg.ts` で実行します（Node 22.18 以降。それより古いバージョンでは `npx tsx beam-svg.ts`）。オプションと、ファイルを LaTeX や Word に取り込む方法は[単体の SVG ファイル](/ja/plot/functions#a-standalone-svg-file)にあります。

## 断面力図を並べた図 {#the-stacked-figure}

`DiagramStack` は、構造力学の教科書でおなじみの図を描きます。荷重を受ける真っすぐな梁と、その下に共通の x 軸で並べた V(x)、M(x)、w(x) です。`v-model:load-at` を使うと、読者が集中荷重を梁に沿ってドラッグし、図が追従する様子を見られます。

```vue
<DiagramStack v-model:load-at="at" :solver="solveWithLoadAt(at)" />
```

完全な例は [DiagramStack](/ja/plot/diagram-stack) のページにあります。

## アプリ全体で使う {#use-it-everywhere}

使う場所ごとにインポートする代わりに、両方のコンポーネントをグローバルに登録するには次のようにします。

```ts [main.ts]
import { createApp } from 'vue'
import { EduBeamPlot } from '@edubeam/plot'
import App from './App.vue'

createApp(App).use(EduBeamPlot).mount('#app') // すべてのテンプレートで <StructurePlot> と <DiagramStack> が使える
```

名前付きインポートのほうがバンドルは小さくなります。`StructurePlot` だけをインポートするページには、`DiagramStack` もプラグインも含まれません。どちらのコンポーネントも、Nuxt や VitePress ではサーバーでもレンダリングされます。[埋め込み](/ja/plot/embedding)を参照してください。

## 次のステップ {#next}

::card-grid{cols="2"}
:::card{title="演習問題と試験" icon="lucide:dices" to="/ja/plot/exercises"}
シード値から学生ごとに異なる演習問題を解答付きで。印刷用にも LaTeX 用にも。
:::
:::card{title="スライドと講義資料" icon="lucide:presentation" to="/ja/plot/slides"}
Slidev、Vue、Beamer でクリックごとに組み上がる図と、講義資料用の同じ図。
:::
:::card{title="StructurePlot" icon="lucide:frame" to="/ja/plot/structure-plot"}
レイヤー、寸法線、サムネイル、サイズ、単位、ポインターでの値の読み取り。
:::
:::card{title="DiagramStack" icon="lucide:rows-3" to="/ja/plot/diagram-stack"}
梁の下に V 図、M 図、w 図。読者がドラッグできる荷重付き。
:::
::
