---
title: 幻灯片与讲义
description: "用 @edubeam/plot 制作课堂插图：在 Slidev、Vue 或 Beamer 中随点击逐步呈现，课上实时求解，并以 SVG 文件用于讲义、PowerPoint 和 Word。"
order: 6
source: site
---

# 幻灯片与讲义

按讲解的顺序展示结构：先是几何形状，然后是支座和荷载，接着是支反力，最后是弯矩。由求解后的模型绘制的图会在原位逐步呈现，每点击一次出现一个图层，而且结果总是正确的。同一个模型还能为讲义提供插图。

![Slidev 幻灯片在第 0、2、4 次点击时的样子：先是带尺寸标注的门式刚架节点，然后是带支座和荷载的刚架，最后是支反力和弯矩图](/screenshots/zh/p2p-plot-slidev-steps.webp){.shot-md}

## 逐步呈现的插图 {#a-figure-that-builds-up}

一共两个文件。`frame.ts` 建立并求解结构：

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** 门式刚架：宽 6 m、高 4 m，两柱脚铰支，横梁上作用 10 kN/m，B 点作用 15 kN 水平力。 */
export const portalFrame = (): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 }) // IPE 300
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [0, 0, -4]) // z 轴向下：即向上 4 m
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

`BuildUp.vue` 分阶段绘制它。每个阶段列出要显示的图层，`reserve` 从第一次点击起就为所有图层安排好布局，所以每个图层都在它应在的位置淡入，其他内容都不会移动：

```vue [BuildUp.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { StructurePlot, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame'

const props = defineProps<{ step: number }>()

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'], // 几何形状
  ['nodeLabels', 'members', 'supports'], // 结构
  ['nodeLabels', 'members', 'supports', 'loads'], // 荷载
  ['members', 'supports', 'loads', 'reactions'], // 支反力
  ['members', 'supports', 'reactions', 'M'], // 最后是弯矩
]
const all = [...new Set(stages.flat())] // 从第一步起就安排好布局，之后什么都不会移动
const layers = computed(() => stages[Math.min(props.step, stages.length - 1)])

const frame = portalFrame()
</script>

<template>
  <StructurePlot :solver="frame" :layers="layers" :reserve="all" :height="360" />
</template>
```

图层也可以退出：最后一个阶段去掉了荷载，给弯矩图腾出位置。`:height="360"` 让图保持在幻灯片之内。杆件第一次出现时从一端画到另一端，图层在半秒内淡入；用户开启 `prefers-reduced-motion` 时两者都关闭，`:animate="false"` 则对所有人关闭动画。若要在大教室里放慢动画，见[修改动画样式](/zh/plot/theming#restyling-the-animation)。

## 在 Slidev 中 {#in-slidev}

[Slidev](https://sli.dev) 用 Markdown 和 Vue 制作幻灯片，所以组件在其中可以直接使用。在幻灯片项目中安装这两个库：

```bash
npm install @edubeam/plot @edubeam/fem
```

把 `frame.ts` 和 `BuildUp.vue` 放进项目的 `components/` 文件夹，然后在 `slides.md` 中让幻灯片的点击次数驱动阶段：

```md [slides.md]
---
clicks: 4
---

# From geometry to bending moment

<BuildUp :step="$clicks" />
```

`clicks: 4` 让这页幻灯片有四次点击，`$clicks` 从 0 开始计数。每按一次方向键显示下一个阶段，后退时又会隐藏。`slidev export` 把幻灯片导出为 PDF，加上 `--with-clicks` 时每次点击一页。

## 在任何 Vue 幻灯片中 {#in-any-vue-slides}

在其他地方，由你自己保存当前阶段：

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

## 课上实时求解 {#solve-it-live}

求解这样一个刚架只需几毫秒，所以课上可以当场修改结构并求解。把荷载绑定到一个滑块上，每次传入新的求解后模型，做法见[模型改变时](/zh/plot/getting-started#when-the-model-changes)。

- **移动荷载**。[DiagramStack](/zh/plot/diagram-stack#a-load-the-reader-can-drag) 让学生沿梁拖动集中荷载，看着剪力图和弯矩图随之变化。
- **并排比较**。固定 [`diagramScale`](/zh/plot/structure-plot#several-plots-at-one-scale) 后，两幅图的弯矩按同一比例绘制，弯矩较大的那幅看上去也更大。
- **读取数值**。设置 `hover` 后，指向一根杆件，就会在每幅内力图的纵坐标顶端标出该处的数值：见[读取数值](/zh/plot/structure-plot#reading-values)。

## Beamer、PowerPoint 和 Word 用的插图 {#figures-for-beamer-powerpoint-and-word}

用 LaTeX Beamer 或 PowerPoint 制作的幻灯片，以及用 Word 写的讲义，都以文件形式插入插图。`structureSvg` 把图写成颜色固定的独立 SVG 文件，布局与 `StructurePlot` 完全相同。在 `frame.ts` 旁边写一个 Node 脚本 `frame-svg.ts`：

```ts [frame-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![门式刚架的独立 SVG 文件，由 CairoSVG 渲染：荷载、支反力（向上 20 和 40，水平 2.3 和 12.7），以及从 C 点 −50.7 到横梁上 29.3 的弯矩图](/screenshots/zh/p2p-plot-frame-svg.webp){.shot-lg}

PowerPoint 和 Word（2019 和 Microsoft 365）可以直接插入 SVG。LaTeX 需要 PDF：用 `cairosvg frame.svg -o frame.pdf` 或 Inkscape 转换，或者让 `svg` 宏包的 `\includesvg` 来完成。详见 [LaTeX 和 Word 用的插图](/zh/plot/exercises#figures-for-latex-and-word)，全部选项见[独立的 SVG 文件](/zh/plot/functions#a-standalone-svg-file)。

### 在 Beamer 中逐步呈现 {#a-build-up-in-beamer}

每个文件都按它所画的图层确定大小，所以为各阶段分别写出的文件不会对齐。给 `structureSvg` 传入与 `BuildUp.vue` 相同的 `reserve`，即所有阶段的所有图层，这样每个文件大小相同，结构也在同一位置。`frame-stages.ts` 为每个阶段写一个文件：

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

把这些文件转换为 PDF：

```bash
for i in 1 2 3 4 5; do cairosvg frame-$i.svg -o frame-$i.pdf; done
```

再给每个文件一个单独的覆盖层（overlay）。每个文件包含一个完整阶段，所以同一页幻灯片每次只显示其中一个；由于它们彼此对齐，每次点击看上去就像加上了一个图层：

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

在 PowerPoint 中，把五个文件放在五张连续的幻灯片上，彼此之间不加切换效果：课上看起来和点击一次加一层一模一样。

## 讲义与课堂资料 {#notes-and-handouts}

- **网上的课程讲义**。VitePress 和 Nuxt 在构建时渲染图，所以在任何脚本运行之前，插图就已在 HTML 中：见[嵌入](/zh/plot/embedding)。
- **打印的讲义**。用 `structureSvg` 把插图写进一个 HTML 页面再打印，就像[测验卷打印脚本](/zh/plot/exercises#print-a-test)那样；也可以把文件插入 LaTeX 或 Word。
- **一个模型，所有插图**。同一个 `frame.ts` 为幻灯片、讲义和习题单提供插图，所以它们永远不会互相矛盾。
