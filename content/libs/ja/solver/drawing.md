---
title: 結果の描画
description: "解いた @edubeam/fem のモデルを @edubeam/plot で図にします。Vue コンポーネントで、Node スクリプトから単独の SVG ファイルとして、あるいは後で描くための JSON として。"
order: 11
source: site
---

# 結果の描画 {#drawing-the-results}

[@edubeam/plot](/ja/plot) は、解いたモデルをこのサイトの図と同じ見た目で SVG に描きます。部材、支点、荷重、反力、軸力図・せん断力図・曲げモーメント図、変位図を描けます。ソルバーを渡せば、必要な情報はすべてそこから読み取ります。

```bash
npm install @edubeam/plot @edubeam/fem vue
```

## Vue コンポーネントで描く {#in-a-vue-component}

```vue [BeamFigure.vue]
<script setup lang="ts">
import { markRaw } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot } from '@edubeam/plot'

// 12 kN/m を受けるスパン 6 m の単純梁。SI 単位（m、N、Pa）
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // ピン支点
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // ローラー支点
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

// 読み出すだけで監視はしない：markRaw で Vue がソルバーをリアクティブにしないようにする
const beam = markRaw(solver)
</script>

<template>
  <StructurePlot
    :solver="beam"
    :layers="['members', 'supports', 'loads', 'reactions', 'M']"
  />
</template>
```

36 kN の反力と 54 kNm の曲げモーメントが描かれます。次の図は、同じ梁をこのページ上でその場で解いたものです。

::model-figure{caption="BeamFigure.vue が描く図"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
---
::

`StructurePlot` は荷重ケース 0 を描きます。`solver.loadCases` のほかの荷重ケースを描くには、`loadCase` プロパティで指定します。ソルバーの変更は監視しないので、モデルを変更して解き直したら、`revision` プロパティの値を変えて再描画させてください。すべてのオプションは [StructurePlot](/ja/plot/structure-plot) にあります。

## ブラウザなしで描く {#without-a-browser}

@edubeam/plot 0.2 で追加された `structureSvg` は、同じ図を単独の SVG ファイルとして書き出します。色は、Word、Inkscape、LaTeX のツールチェーンが扱える単純な指定です。ブラウザも Vue コンポーネントも要らず、Node のスクリプトだけで動きます。

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { modelFromSolver, structureSvg } from '@edubeam/plot'

// BeamFigure.vue と同じ梁
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

const svg = structureSvg(modelFromSolver(solver), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
  width: 640,
})
writeFileSync('beam.svg', svg)
```

できたファイルには、上の図と同じ内容が印刷向けの色で描かれます。大きさを測る枠がないので、`width` で図の幅をピクセル単位で指定します。印刷用の図を 1 ページにまとめるには、こうしたファイルを 1 つの HTML ページに並べます。@edubeam/plot の[試験を印刷するスクリプト](/ja/plot/exercises#print-a-test)がこの方法をとっていて、Vue もブラウザも使いません。`structureSvg` のオプションは[関数](/ja/plot/functions#a-standalone-svg-file)のページにあります。

## ソルバーではなく図を配信する {#ship-the-drawing-not-the-solver}

`modelFromSolver` は、解いたモデルを JSON にシリアライズできる単純なデータに変換します。形状、荷重、反力、そして各部材の結果を厳密な多項式として含みます。ビルド時に解いて JSON を配信し、`solver` の代わりに `model` プロパティで描画します。

```ts
import { modelFromSolver } from '@edubeam/plot'

// ... to-svg.ts で解いた梁
writeFileSync('beam.json', JSON.stringify(modelFromSolver(solver)))
```

こうすると、図を表示するページでは何も解きません。計算はビルド時に 1 回行うだけです。コンポーネント側の使い方は[埋め込み](/ja/plot/embedding#ship-the-drawing-not-the-solver)に、データ形式は[描画モデル](/ja/plot/model)にあります。

色の設定から、マウスを重ねたときの値の表示、ドラッグできる荷重まで、ほかのすべては [@edubeam/plot のドキュメント](/ja/plot/getting-started)にあります。
