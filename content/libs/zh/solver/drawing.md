---
title: 绘制结果
description: "用 @edubeam/plot 把求解后的 @edubeam/fem 模型画成内力图：在 Vue 组件中，用 Node 脚本生成独立的 SVG 文件，或导出为 JSON 以后再画。"
order: 11
source: site
---

# 绘制结果 {#drawing-the-results}

[@edubeam/plot](/zh/plot) 按本网站插图的样式绘制求解后的模型：杆件、支座、荷载、支反力、N 图、V 图、M 图和变形图，输出为 SVG。把求解器交给它，它会自己读取所需的一切。

```bash
npm install @edubeam/plot @edubeam/fem vue
```

## 在 Vue 组件中 {#in-a-vue-component}

```vue [BeamFigure.vue]
<script setup lang="ts">
import { markRaw } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot } from '@edubeam/plot'

// 6 m 简支梁，承受 12 kN/m，SI 单位：m、N、Pa
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // 固定铰支座
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // 滑动铰支座
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

// 只读取、不侦听：markRaw 防止 Vue 把求解器变成响应式对象
const beam = markRaw(solver)
</script>

<template>
  <StructurePlot
    :solver="beam"
    :layers="['members', 'supports', 'loads', 'reactions', 'M']"
  />
</template>
```

它画出 36 kN 的支反力和 54 kNm 的弯矩，与下面这张实时图一样：

::model-figure{caption="BeamFigure.vue 画出的图"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
---
::

`StructurePlot` 绘制荷载工况 0；用 `loadCase` 属性可以选择 `solver.loadCases` 中的其他工况。它不侦听求解器：修改模型并重新求解后，改变它的 `revision` 属性即可重绘。全部选项见 [StructurePlot](/zh/plot/structure-plot)。

## 不用浏览器 {#without-a-browser}

@edubeam/plot 0.2 新增的 `structureSvg` 把同样的图写成独立的 SVG 文件，使用 Word、Inkscape 和 LaTeX 工具链都能识别的普通颜色。不需要浏览器，也不需要 Vue 组件，一个 Node 脚本就够了：

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { modelFromSolver, structureSvg } from '@edubeam/plot'

// 与 BeamFigure.vue 中相同的梁
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

文件内容与上面的实时图相同，只是采用印刷用的颜色。由于没有可供测量的容器，用 `width` 以像素为单位设置图的大小。要生成一整页可打印的插图，把几个这样的文件放进一个 HTML 页面即可，@edubeam/plot 的[测验卷打印脚本](/zh/plot/exercises#print-a-test)就是这样做的，既不用 Vue，也不用浏览器。`structureSvg` 的选项见[函数](/zh/plot/functions#a-standalone-svg-file)。

## 提供图形数据，而非求解器 {#ship-the-drawing-not-the-solver}

`modelFromSolver` 把求解后的模型转换为可序列化为 JSON 的普通数据：几何、荷载、支反力，以及每根杆件以精确多项式表示的结果。在构建时求解，随页面发布 JSON，再用 `model` 属性代替 `solver` 来绘制：

```ts
import { modelFromSolver } from '@edubeam/plot'

// ……to-svg.ts 中求解好的梁
writeFileSync('beam.json', JSON.stringify(modelFromSolver(solver)))
```

这样，显示插图的页面完全不用求解：计算在构建时只做一次。组件这一侧的用法见[嵌入](/zh/plot/embedding#ship-the-drawing-not-the-solver)，数据格式见[绘图模型](/zh/plot/model)。

颜色、悬停读数、可拖动的荷载等其他一切，见 [@edubeam/plot 文档](/zh/plot/getting-started)。
