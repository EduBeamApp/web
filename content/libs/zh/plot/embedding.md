---
title: 嵌入
description: "把 @edubeam/plot 的插图放进 Vite 应用、VitePress 课程讲义或 Nuxt 网站，在服务端渲染，以 JSON 形式提供预先求解的模型，或为不使用 Vue 的页面生成纯 SVG。"
order: 7
source: site
---

# 嵌入

这两个组件是普通的 Vue 3 组件，所以凡是能用 Vue 的地方都能用，而且既能在浏览器中渲染，也能在服务端渲染。图在挂载之前不会访问 `window`，每幅图都有自己独立的 id，所以一个页面上可以放任意多幅图。按你的情况选择做法：

| 你的情况 | 做法 |
| --- | --- |
| 用 Vite 构建的 Vue 应用 | 安装、导入，即可使用：[Vite 应用](#a-vite-app) |
| 用 Markdown 写的课程讲义 | 在 VitePress 中注册一次插件：[VitePress 课程讲义](#vitepress-course-notes) |
| Nuxt 网站 | 导入组件，或添加一个插件：[Nuxt](#nuxt) |
| 只展示插图的页面 | 在构建时求解，提供 JSON：[提供图形数据，而非求解器](#ship-the-drawing-not-the-solver) |
| 完全不用 Vue | 在 Node 中写出 SVG：[不使用 Vue](#plain-html-from-node) |

## Vite 应用 {#a-vite-app}

```bash
npm create vue@latest
npm install @edubeam/plot @edubeam/fem
```

在使用组件的地方导入它们，做法见[快速入门](/zh/plot/getting-started#draw-a-solved-model)，或者用 `app.use(EduBeamPlot)` 一次性注册这两个组件。不需要任何其他配置：既不需要样式表，也不需要打包工具插件。

## VitePress 课程讲义 {#vitepress-course-notes}

[VitePress](https://vitepress.dev) 用 Vue 构建 Markdown 页面，很适合用来写课程讲义。在主题文件 `.vitepress/theme/index.ts` 中注册组件：

```ts [.vitepress/theme/index.ts]
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { EduBeamPlot } from '@edubeam/plot'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(EduBeamPlot) // 每个页面中都可以使用 <StructurePlot> 和 <DiagramStack>
  },
} satisfies Theme
```

然后直接在页面中建立模型并绘图，页面放在 `frame.ts` 旁边：

```md [portal-frame.md]
<script setup lang="ts">
import { portalFrame } from './frame' // () => 已求解的 LinearStaticSolver

const frame = portalFrame()
</script>

# Portal frame

The bending moment under the design loads:

<StructurePlot :solver="frame" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

`vitepress build` 会求解这个刚架，并把画好的 SVG（包括所有标注）写进页面的 HTML。到了浏览器中，Vue 激活（hydrate）页面后接管它，图会调整到栏宽。`frame.ts` 见[幻灯片与讲义](/zh/plot/slides#a-figure-that-builds-up)页面。

## Nuxt {#nuxt}

Nuxt 同样支持服务端渲染，本站就是用它构建的。可以像平常一样在页面或组件中导入这两个组件，也可以在 `plugins/edubeam-plot.ts` 中用一个插件为整个应用注册它们：

```ts [plugins/edubeam-plot.ts]
import { EduBeamPlot } from '@edubeam/plot'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(EduBeamPlot)
})
```

在服务端没有可测量的容器，所以图按 `width` 属性布局：默认 640 px（设置 `compact` 时为 400 px），`DiagramStack` 为 720 px。挂载后，它会按实际宽度重新布局。如果你的栏宽与此相差很大，请给 `width` 一个更接近的估计值，这样页面加载时图的大小就不会变化。

## 提供图形数据，而非求解器 {#ship-the-drawing-not-the-solver}

只展示插图的页面不需要求解器。`modelFromSolver` 把求解后的模型读成纯数据：节点、杆件、荷载、支反力，以及每根杆件以精确多项式表示的 N、V、M 和位移。可以在构建时用 `build-figures.ts` 这样的脚本生成它：

```ts [build-figures.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

writeFileSync('portal-frame.json', JSON.stringify(modelFromSolver(portalFrame())))
```

再用 `model` 属性绘制它：

```vue
<script setup lang="ts">
import { StructurePlot, type PlotModel } from '@edubeam/plot'
import frame from './portal-frame.json'
</script>

<template>
  <StructurePlot :model="frame as PlotModel" />
</template>
```

这个门式刚架的 JSON 不到 2 kB，画出的图与直接使用求解器完全相同。所有功能对模型和对求解器一样有效；两者都提供时，以 `model` 为准。数据格式见[绘图模型](/zh/plot/model)。

## 不使用 Vue {#plain-html-from-node}

`structureSvg` 把模型转成 SVG 文件的文本，颜色固定，不含样式和脚本。可以把它粘贴到任何 HTML、静态网站生成器、Markdown 文件或内容管理系统中。下面的脚本写出一个只有一幅图的页面：

```ts [frame-html.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const svg = structureSvg(modelFromSolver(portalFrame()), { layers: ['members', 'supports', 'reactions', 'M'] })
writeFileSync('frame.html', `<!doctype html><meta charset="utf-8"><title>Portal frame</title>${svg}`)
```

这样的图保持写出时的大小，默认宽 640 px（`max-width: 100%; height: auto` 可以让它随栏宽缩小），并自带白色背景；`background: false` 则使背景透明。它不会跟随深色主题，也不能在指针下读取数值：需要这些功能时，请渲染组件。[测验卷打印脚本](/zh/plot/exercises#print-a-test)就是用这种方式打印整份测验卷的，全部选项见[独立的 SVG 文件](/zh/plot/functions#a-standalone-svg-file)。
