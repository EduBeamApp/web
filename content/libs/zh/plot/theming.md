---
title: 主题与颜色
description: "通过 CSS 自定义属性或 colors 属性为 @edubeam/plot 的图设置颜色，适配浅色和深色主题，黑白打印，为 SVG 文件着色，设置字体并修改动画样式。"
order: 4
source: site
---

# 主题与颜色

图的颜色取自页面上的 CSS 自定义属性，因此网站的浅色和深色主题会原样生效。页面没有定义这些属性时，由 CSS 系统颜色代替，它们会跟随页面的 `color-scheme`。不做任何设置时，图在浅色页面中是白底黑图，在深色页面中是深底浅图。

## 自定义属性 {#custom-properties}

| 用于 | 自定义属性 | 后备值 |
| --- | --- | --- |
| 杆件、支座、文字 | `--figure-ink`，其次 `--ink` | `CanvasText` |
| 背景、标注的衬底 | `--paper` | `Canvas` |
| 尺寸线、坐标轴 | `--muted` | `GrayText` |
| 节点、可拖动的荷载 | `--brand` | `#4f46e5` |
| 轴力 | `--color-normal` | `#2222ff` |
| 剪力 | `--color-shear` | `#00af00` |
| 弯矩 | `--color-moment` | `#ff2222` |
| 变形图 | `--figure-ink`，其次 `--ink` | `CanvasText` |
| 荷载 | `--color-load` | `#ff8700` |
| 支反力 | `--color-reaction` | `#a020f0` |
| 受拉的桁架杆 | `--color-tension`，其次 `--color-moment` | `#ff2222` |
| 受压的桁架杆 | `--color-compression`，其次 `--color-normal` | `#2222ff` |
| 字体 | `--ebp-font`，其次 `--font-sans` | `inherit` |

这些属性可以设置在图的任何上层元素上；对整个网站，设置在 `:root` 上：

```css
:root {
  --ink: #1b1b3a;
  --paper: #ffffff;
  --color-moment: #d7263d;
}

.dark {
  --ink: #eeeeff;
  --paper: #0b0d1f;
}
```

标注下方有一层 `--paper` 颜色的衬底，使它们在阴影线上也清晰可读：请让它与图所在的背景颜色一致。

## `colors` 属性 {#the-colors-prop}

只为某一幅图设置颜色时，按名称传入任意色调：

```vue
<StructurePlot :solver="solver" :colors="{ moment: '#c00', paper: 'transparent' }" />
```

色调有 `ink`、`paper`、`muted`、`brand`、`normal`、`shear`、`moment`、`deformed`、`load`、`reaction`、`tension` 和 `compression`。可以使用任何 CSS 颜色，包括 `var(…)`。`DEFAULT_COLORS` 保存了每种色调的默认值。

## 黑白打印 {#black-and-white}

测验卷要复印或黑白打印时，把所有彩色色调都设为墨色：

```vue
<script setup lang="ts">
import type { PlotColors } from '@edubeam/plot'

const print: Partial<PlotColors> = {
  ink: '#000', paper: '#fff', muted: '#555', brand: '#000',
  normal: '#000', shear: '#000', moment: '#000', deformed: '#000',
  load: '#000', reaction: '#000', tension: '#000', compression: '#000',
}
</script>

<template>
  <StructurePlot :solver="solver" :colors="print" :animate="false" />
</template>
```

没有颜色，内力图照样看得清：它们带有阴影线，弯矩图画在受拉侧。

## SVG 文件中的颜色 {#colours-in-an-svg-file}

由 [`structureSvg`](/zh/plot/functions#a-standalone-svg-file) 写出的文件没有外围页面，所以它使用固定颜色：`PRINT_COLORS`，即 EduBeam 应用在白底上的配色。它的 `colors` 选项接受与属性相同的色调，所以上面的黑白配色在这里同样适用：

```ts
structureSvg(model, { colors: print }) // 白底黑图
structureSvg(model, { background: false }) // 无背景，用于彩色幻灯片
```

只能用具体的颜色值：Word 和 Inkscape 不认识 `var(…)`。

## 字体 {#fonts}

文字使用页面的字体（通过 `--ebp-font` 或 `--font-sans`），并使用等宽数字。`DiagramStack` 中的行名（如 V(x)）在页面加载了 KaTeX 字体时使用 KaTeX 字体，否则使用衬线字体。SVG 文件无法知道页面的字体，所以使用它的 `fontFamily` 选项，默认为 Helvetica 或 Arial。

## 修改动画样式 {#restyling-the-animation}

图所需的少量 CSS 规则内联在每个 SVG 中，所以不需要样式表。所有类名都以 `ebp-` 为前缀，页面可以覆盖它们。每个图层是一个 `<g class="ebp-layer ebp-layer-{name}">`，显示时会加上 `ebp-on`：

```css
/* 淡入更慢一些，适合大教室 */
.slides .ebp-animate .ebp-layer {
  transition-duration: 1s;
}
```

导出的 `PLOT_CSS` 就是这些内联规则，`toneVars(colors)` 返回图在根元素上设置的自定义属性，供你用[绘图函数](/zh/plot/functions#drawing)自己构建插图。
