---
title: スライドと講義資料
description: "@edubeam/plot で講義用の図を作成。Slidev、Vue、Beamer でクリックごとに組み上がり、講義中にその場で解け、SVG ファイルとして講義資料、PowerPoint、Word にも使えます。"
order: 6
source: site
---

# スライドと講義資料

構造物は、説明する順に見せましょう。まず形状、次に支点と荷重、そして反力、最後に曲げモーメントです。解析済みのモデルから描いた図は、その場で 1 クリックに 1 レイヤーずつ組み上がり、内容は常に正確です。同じモデルから、講義資料の図も作れます。

![Slidev のスライドの 0、2、4 回目のクリック：寸法線付きの門形ラーメンの節点、次に支点と荷重の付いたラーメン、最後に反力と曲げモーメント](/screenshots/ja/p2p-plot-slidev-steps.webp){.shot-md}

## 段階的に組み上がる図 {#a-figure-that-builds-up}

ファイルは 2 つです。`frame.ts` は構造物を組み立てて解きます。

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** 門形ラーメン：幅 6 m、高さ 4 m、柱脚はピン支点、梁に 10 kN/m、B に右向きの 15 kN。 */
export const portalFrame = (): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 }) // IPE 300
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [0, 0, -4]) // z は下向きなので、4 m 上
  domain.createNode('C', [6, 0, -4])
  domain.createNode('D', [6, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  domain.createBeam2D(2, ['B', 'C'], 1, 1)
  domain.createBeam2D(3, ['C', 'D'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(2, [0, 10e3], true)
  solver.loadCases[0].createNodalLoad('B', { [DofID.Dx]: 15e3 })
  solver.solve()
  return solver
}
```

`BuildUp.vue` は、これを段階的に描きます。各段階には表示するレイヤーを並べます。`reserve` が最初のクリックからすべてのレイヤーをレイアウトしておくので、各レイヤーは所定の位置にフェードインし、何も動きません。

```vue [BuildUp.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { StructurePlot, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame'

const props = defineProps<{ step: number }>()

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'], // 形状
  ['nodeLabels', 'members', 'supports'], // 構造物
  ['nodeLabels', 'members', 'supports', 'loads'], // 荷重
  ['members', 'supports', 'loads', 'reactions'], // 反力
  ['members', 'supports', 'reactions', 'M'], // そして曲げモーメント
]
const all = [...new Set(stages.flat())] // 最初の段階からレイアウトしておくので、後で何も動かない
const layers = computed(() => stages[Math.min(props.step, stages.length - 1)])

const frame = portalFrame()
</script>

<template>
  <StructurePlot :solver="frame" :layers="layers" :reserve="all" :height="360" />
</template>
```

レイヤーは消すこともできます。最後の段階では、曲げモーメントの場所を空けるために荷重を消しています。`:height="360"` で図をスライド内に収めます。部材は初めて現れるときに端から端へ描かれ、レイヤーは 0.5 秒かけてフェードインします。どちらも `prefers-reduced-motion` のときはオフになり、`:animate="false"` を指定すれば誰に対してもオフになります。講義室向けにゆっくりにするには、[アニメーションの調整](/ja/plot/theming#restyling-the-animation)を参照してください。

## Slidev で {#in-slidev}

[Slidev](https://sli.dev) は Vue を使って Markdown からスライドを作るので、コンポーネントはそのまま動きます。スライドのプロジェクトにライブラリをインストールします。

```bash
npm install @edubeam/plot @edubeam/fem
```

`frame.ts` と `BuildUp.vue` をプロジェクトの `components/` フォルダーに置き、`slides.md` でスライドのクリックに段階を連動させます。

```md [slides.md]
---
clicks: 4
---

# From geometry to bending moment

<BuildUp :step="$clicks" />
```

`clicks: 4` でスライドのクリック数を 4 にします。`$clicks` は 0 から数えます。矢印キーを押すたびに次の段階が表示され、戻ると再び隠れます。`slidev export` でスライドを PDF にでき、`--with-clicks` を付けるとクリックごとに 1 ページになります。

## ほかの Vue スライドで {#in-any-vue-slides}

それ以外の環境では、段階を自分で管理します。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import BuildUp from './BuildUp.vue'

const step = ref(0)
</script>

<template>
  <BuildUp :step="step" />
  <button type="button" @click="step = Math.max(0, step - 1)">Back</button>
  <button type="button" @click="step++">Next</button>
</template>
```

## 講義中にその場で解く {#solve-it-live}

この程度のラーメンなら、ソルバーは数ミリ秒で解きます。そのため、講義中に構造物を変えてその場で解けます。荷重をスライダーに結び付け、そのたびに新しい解析済みモデルを渡します。[モデルが変わったとき](/ja/plot/getting-started#when-the-model-changes)と同じです。

- **移動荷重。** [DiagramStack](/ja/plot/diagram-stack#a-load-the-reader-can-drag) を使うと、学生が集中荷重を梁に沿ってドラッグし、せん断力と曲げモーメントが追従する様子を見られます。
- **条件を変えて並べる。** [`diagramScale`](/ja/plot/structure-plot#several-plots-at-one-scale) を固定すると、2 つの図のモーメントが同じ縮尺で描かれ、大きいほうがきちんと大きく見えます。
- **値の読み取り。** `hover` を指定すると、部材にポインターを合わせたとき、各断面力図の縦距の先端に値の印が付きます。[値の読み取り](/ja/plot/structure-plot#reading-values)を参照してください。

## Beamer、PowerPoint、Word 用の図 {#figures-for-beamer-powerpoint-and-word}

LaTeX Beamer や PowerPoint で作るスライド、Word で書く講義資料には、図をファイルとして取り込みます。`structureSvg` は、`StructurePlot` と同じレイアウトで、固定色の単体の SVG として図を書き出します。`frame.ts` と同じフォルダーに置く Node スクリプト `frame-svg.ts` は次のとおりです。

```ts [frame-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![CairoSVG で描画した、単体の SVG ファイルとしての門形ラーメン：荷重、反力（上向きに 20 と 40、水平に 2.3 と 12.7）、曲げモーメントは C の −50.7 から梁の 29.3 まで](/screenshots/ja/p2p-plot-frame-svg.webp){.shot-lg}

PowerPoint と Word（2019 と Microsoft 365）は、SVG をそのまま挿入できます。LaTeX には PDF として取り込みます。`cairosvg frame.svg -o frame.pdf` か Inkscape で変換するか、`svg` パッケージの `\includesvg` に任せます。詳しくは [LaTeX と Word 用の図](/ja/plot/exercises#figures-for-latex-and-word)に、すべてのオプションは[単体の SVG ファイル](/ja/plot/functions#a-standalone-svg-file)にあります。

### Beamer での段階表示 {#a-build-up-in-beamer}

ファイルの大きさは描くレイヤーに合わせて決まるので、段階ごとに別々に書き出したファイルは位置が揃いません。`BuildUp.vue` と同じ `reserve`（全段階のすべてのレイヤー）を `structureSvg` に渡せば、どのファイルも同じ大きさになり、構造物も同じ位置に来ます。`frame-stages.ts` は、段階ごとに 1 つのファイルを書き出します。

```ts [frame-stages.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'],
  ['nodeLabels', 'members', 'supports'],
  ['nodeLabels', 'members', 'supports', 'loads'],
  ['members', 'supports', 'loads', 'reactions'],
  ['members', 'supports', 'reactions', 'M'],
]
const all = [...new Set(stages.flat())]
const frame = modelFromSolver(portalFrame())

stages.forEach((layers, i) => {
  writeFileSync(`frame-${i + 1}.svg`, structureSvg(frame, { layers, reserve: all }))
})
```

ファイルを PDF に変換し、

```bash
for i in 1 2 3 4 5; do cairosvg frame-$i.svg -o frame-$i.pdf; done
```

それぞれに別のオーバーレイを割り当てます。各ファイルは 1 つの段階全体を含むので、Beamer のフレームには一度に 1 つだけが表示されます。位置が揃っているので、クリックのたびにレイヤーが加わっていくように見えます。

```latex [lecture.tex]
\begin{frame}{From geometry to bending moment}
  \centering
  \includegraphics<1>[width=0.8\linewidth]{frame-1.pdf}%
  \includegraphics<2>[width=0.8\linewidth]{frame-2.pdf}%
  \includegraphics<3>[width=0.8\linewidth]{frame-3.pdf}%
  \includegraphics<4>[width=0.8\linewidth]{frame-4.pdf}%
  \includegraphics<5>[width=0.8\linewidth]{frame-5.pdf}
\end{frame}
```

PowerPoint では、5 つのファイルを画面切り替え効果なしで、連続する 5 枚のスライドに置きます。各段階は、講義でクリックしたときと同じように見えます。

## 講義資料と配布資料 {#notes-and-handouts}

- **Web 上の講義資料。** VitePress と Nuxt はビルド時に図をレンダリングするので、スクリプトが動く前から図が HTML に入っています。[埋め込み](/ja/plot/embedding)を参照してください。
- **印刷する講義資料。** [試験を印刷するスクリプト](/ja/plot/exercises#print-a-test)と同じように、`structureSvg` で図を HTML ページに書き出して印刷するか、ファイルを LaTeX や Word に取り込みます。
- **1 つのモデルからすべての図を。** 同じ `frame.ts` からスライド、講義資料、演習プリントの図を作るので、内容が食い違うことはありません。
