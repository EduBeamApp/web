---
title: 快速入门
description: "安装 @edubeam/plot，在 Vue 3 应用中绘制由 @edubeam/fem 求解的梁及其荷载、支反力和弯矩图，模型改变时重新绘制，并保存为 SVG 文件。"
order: 1
group: 入门
source: site
---

# 快速入门

绘图库 @edubeam/plot 以 SVG 绘制平面梁、刚架或桁架及其计算结果：杆件、支座、荷载、支反力、N 图、V 图、M 图和变形图，样子和本站的插图完全一样。你只需把一个用 [@edubeam/fem](/zh/solver)（[EduBeam]{.edubeam} 背后的求解器）求解过的模型交给它，布局、比例以及每个数值写在哪里，都由它来决定。

教师用它按随机种子生成[习题与测验](/zh/plot/exercises)，制作随点击[逐步呈现的幻灯片](/zh/plot/slides)，绘制讲义插图，既可放在网页中，也可输出为 LaTeX 和 Word 用的文件。本站的[结构力学练习题](/zh/practice)和[试卷生成器](/zh/exam)就是用它做的。

::div{.actions}
[绘制第一幅图](#draw-a-solved-model) [生成习题](/zh/plot/exercises)
::

## 安装 {#install}

```bash
npm install @edubeam/plot @edubeam/fem vue
```

Vue 3.5 及以上版本和求解器是对等依赖（peer dependencies），因此你的应用中各自只有一份。这个包只提供 ESM，自带类型声明，不需要样式表。它在 Node 20.19 及以上版本中运行；若要用 `node script.ts` 直接运行 TypeScript 脚本，则需要 Node 22.18 及以上版本。

## 绘制已求解的模型 {#draw-a-solved-model}

一共两个文件。第一个是 `beams.ts`，用 @edubeam/fem 建立并求解一根梁。它只是一个普通函数，所以同一个模型可以同时用于网页、幻灯片和脚本：

```ts [beams.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** 跨度 `span` m、均布荷载 `q` kN/m 的简支梁，返回求解后的求解器。求解器使用国际单位制。 */
export const simpleBeam = (span: number, q: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 }) // 钢材，Pa
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 }) // IPE 200，不计剪切变形
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // 固定铰支座
  domain.createNode('B', [span, 0, 0], [DofID.Dz]) // 滑动铰支座
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true) // N/m，+z 向下
  solver.solve()
  return solver
}
```

第二个是 `BeamFigure.vue`，它把求解器交给 `StructurePlot`，并指定要画什么：

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

这样一幅图就完成了：支座上的梁、12 kN/m 的荷载、两个 36 kN 的支反力，以及画在受拉侧的弯矩图，跨中弯矩为 $qL^2/8 = 54$ kNm：

::model-figure{caption="BeamFigure.vue 画出的图：跨度 6 m，均布荷载 12 kN/m"}
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

图的宽度撑满所在容器，高度由图自己决定。无论结构多大，文字、符号和线宽都保持固定的像素大小，所以在手机上也看得清。省略 `layers` 时，图会自行选择要显示的结果：梁和刚架显示 M，桁架显示 N。全部[图层](/zh/plot/structure-plot#layers)见 `StructurePlot` 页面；如何建立模型见[求解器文档](/zh/solver/getting-started)。

## 模型改变时 {#when-the-model-changes}

图只读取传给它的求解器，并不监听它的变化。模型有改动时，重新求解，再传入新的求解器。`computed` 正好能做这件事：

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

这样一根梁大约 1 毫秒就能解完，所以拖动滑块时图会随之变化。如果你是直接修改了原有的求解器，就把 `revision` 属性的值加一，图会重新读取它。

::callout{type="tip" title="不要让求解器进入深层响应式"}
`computed`、属性（prop）或普通的 `const` 都会原样保存求解器。若要把求解器放在组件状态中，请使用 `shallowRef`，或用 `markRaw` 包裹它：普通的 `ref` 会让 Vue 遍历整个求解器，把它变成响应式，而这毫无必要。
::

## 保存为文件 {#save-it-as-a-file}

在 LaTeX、Word 或 Inkscape 中使用的插图，可以用 `structureSvg` 把同一幅图写成颜色固定的独立 SVG 文件。它既不需要 Vue，也不需要浏览器，只需要 Node。把下面的脚本保存为 `beam-svg.ts`，放在 `beams.ts` 旁边：

```ts [beam-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { simpleBeam } from './beams.ts'

const svg = structureSvg(modelFromSolver(simpleBeam(6, 12)), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
})
writeFileSync('beam.svg', svg)
```

用 `node beam-svg.ts` 运行它（需要 Node 22.18 及以上版本；旧版本用 `npx tsx beam-svg.ts`）。各个选项，以及如何把文件插入 LaTeX 和 Word，见[独立的 SVG 文件](/zh/plot/functions#a-standalone-svg-file)。

## 上下对齐的内力图 {#the-stacked-figure}

`DiagramStack` 绘制的正是每本结构力学教材里都有的那种图：一根直梁及其荷载，下方在同一根 x 轴上依次画出 V(x)、M(x) 和 w(x)。借助 `v-model:load-at`，读者可以沿梁拖动集中荷载，看着各图随之变化：

```vue
<DiagramStack v-model:load-at="at" :solver="solveWithLoadAt(at)" />
```

完整示例见 [DiagramStack](/zh/plot/diagram-stack) 页面。

## 全局使用 {#use-it-everywhere}

如果不想在每处使用时分别导入，可以全局注册这两个组件：

```ts [main.ts]
import { createApp } from 'vue'
import { EduBeamPlot } from '@edubeam/plot'
import App from './App.vue'

createApp(App).use(EduBeamPlot).mount('#app') // 所有模板中都可以使用 <StructurePlot> 和 <DiagramStack>
```

按名称导入能让打包结果更小：只导入 `StructurePlot` 的页面既不会包含 `DiagramStack`，也不会包含插件。两个组件在 Nuxt 或 VitePress 中也能在服务端渲染，见[嵌入](/zh/plot/embedding)。

## 下一步 {#next}

::card-grid{cols="2"}
:::card{title="习题与测验" icon="lucide:dices" to="/zh/plot/exercises"}
按随机种子为每名学生生成不同的习题，附参考答案，可打印，也可输出给 LaTeX 使用。
:::
:::card{title="幻灯片与讲义" icon="lucide:presentation" to="/zh/plot/slides"}
在 Slidev、Vue 或 Beamer 中随点击逐步呈现的插图，讲义中也用同样的图。
:::
:::card{title="StructurePlot" icon="lucide:frame" to="/zh/plot/structure-plot"}
图层、尺寸标注、缩略图、尺寸、单位，以及用指针读取数值。
:::
:::card{title="DiagramStack" icon="lucide:rows-3" to="/zh/plot/diagram-stack"}
梁及其下方的 V 图、M 图和 w 图，荷载可由读者拖动。
:::
::
