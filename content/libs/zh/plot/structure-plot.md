---
title: StructurePlot
description: "用 StructurePlot 绘制平面梁、刚架或桁架：图层、逐步呈现的插图、习题中带名称的未知支反力、缩略图、尺寸、单位和悬停读数。"
order: 2
group: 组件
source: site
---

# StructurePlot

`StructurePlot` 绘制整个结构，并按所在容器的宽度缩放：杆件、铰、支座、荷载、支反力、N 图、V 图、M 图和变形图。传给它一个求解器，或由求解器得到的[纯数据模型](/zh/plot/model)，再指定要画什么。

```vue
<StructurePlot :solver="solver" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

每个属性及其类型和默认值，见[组件 API](/zh/plot/components#structureplot)。

下图就是一个 `StructurePlot`：打开了 `nodeLabels` 和 `dimensions`，设置了 `hover`，并使用本站的数字格式（四位有效数字）。切换不同的结果，再把指针指向某根杆件，读取它的数值。

::model-figure{caption="门式刚架：两柱脚铰支，横梁上作用 10 kN/m，B 点作用 15 kN"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: pin, D: pin }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
  - { node: B, fx: 15 }
results: [M, V, N, w]
show: [nodeLabels, dimensions]
---
::

## 图层 {#layers}

一幅图由若干图层组成。不管你按什么顺序列出，图层总是按固定顺序绘制：

| 图层 | 绘制内容 |
| --- | --- |
| `members` | 杆件，铰画成小圆圈 |
| `supports` | 每个支座的符号，斜支座的符号随之旋转 |
| `loads` | 节点荷载和杆件荷载、温度变化和支座沉降，并标出数值 |
| `reactions` | 支反力，画成箭头和弧形箭头并标出数值；设置 `reactionLabels: 'names'` 时，画成习题中带名称的[未知量](#reactions-as-unknowns) |
| `nodes` | 每个节点画成小圆圈 |
| `nodeLabels` | 节点标签 |
| `dimensions` | 连续尺寸标注，和习题单上的标法一样：结构下方标出节点之间和集中荷载之间的每一段，右侧标出每一层的层高，第二道尺寸线标出总尺寸 |
| `N`、`V`、`M` | 轴力图、剪力图和弯矩图 |
| `w` | 变形图 |

省略 `layers` 时，图会画出杆件、支座、荷载和支反力，再加上一个按结构选择的结果：梁和刚架画 `M`，桁架画 `N`；如果没有任何杆件受力，就画 `w`，例如在温度荷载作用下可以自由伸长的梁。

内力图的画法和 EduBeam 应用一致：N 图和 V 图垂直于杆件画阴影线，M 图画在受拉侧，所以梁的正弯矩（下缘受拉）画在梁的下方。设置 `:moment-on-tension-side="false"` 则把 M 图画在受压侧。桁架的每根杆只沿杆标一次轴力，并按正负着色。

## 逐步呈现的插图 {#figures-that-build-up}

`reserve` 列出暂时隐藏、但要预留位置的图层。图从一开始就为所有预留图层安排好布局，所以某个图层打开时，会在它应在的位置淡入，其他内容都不会移动：

```vue
<script setup lang="ts">
import type { PlotLayer } from '@edubeam/plot'

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'],
  ['nodeLabels', 'members', 'supports'],
  ['nodeLabels', 'members', 'supports', 'loads'],
  ['members', 'supports', 'loads', 'reactions'],
  ['members', 'supports', 'reactions', 'M'],
]
const all = [...new Set(stages.flat())]
// `frame` 是已求解的求解器，`step` 是当前阶段：完整组件见“幻灯片与讲义”
</script>

<template>
  <StructurePlot :solver="frame" :layers="stages[step]" :reserve="all" />
</template>
```

`animate` 默认开启：图层逐渐淡入，杆件从一端画到另一端。用户开启了 `prefers-reduced-motion`（减少动态效果）时，不播放任何动画。[幻灯片与讲义](/zh/plot/slides)把这幅图放进了幻灯片。

## 内力图上的数值 {#diagram-values}

每个数值写在所属纵坐标顶端稍外一点，和教材标注内力图的方式一样：每个非零的杆端值、杆件中间的极值、突变处的两侧数值都会标出，刚结点（角点）处只标一次。数值是显示单位下的纯数字（N 和 V 用 kN，M 用 kNm），支反力也是如此，与 EduBeam 应用相同；只有给定的量才带单位：荷载、支座沉降和温度变化。如果一个标注会与另一个标注、杆件或箭头重叠，它会在同一顶端换几个位置试试，都没有空位就省略，因此两个数字绝不会叠在一起。荷载和支反力的数值最先放置，所以内力图的数字不会把它们挤掉。桁架的杆件轴力从不省略：它们会沿杆滑动、换到另一侧，实在不行就缩小字号。

设置 `result-label-mode="axis"` 后，数值沿纵坐标方向书写，和 EduBeam 应用的写法一样。如果读者可以在两种方式之间切换，请设置 `:reserve-label-modes="['horizontal', 'axis']"`，这样切换时图就不会移动。

## 支反力作为未知量 {#reactions-as-unknowns}

习题单要求学生求支反力，所以图上应画出支反力，但不给出数值。设置 `reaction-labels="names"` 后，支座约束的每个方向都会画一个箭头，指向该支反力的正方向：沿节点的 x 轴（支座未旋转时向右）、向上，固定端反力矩则为逆时针。每个支反力以所在节点命名：*A<sub>x</sub>*、*A<sub>z</sub>*、*M<sub>A</sub>*，用斜体和真正的下标书写。这样每个答案的正负号都由图来规定：与箭头方向相反的支反力为负。

```vue
<StructurePlot
  :model="model"
  :layers="['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']"
  reaction-labels="names"
/>
```

![上图是作为习题单绘制的一端固定一端简支梁：A 端固定，B 处为滑动铰支座，跨中作用 40 kN，连续尺寸标注 3 m 和 3 m，总长 6 m，支反力画成带名称的箭头 A_x、A_z、M_A 和 B_z。下图是同一根梁的默认支反力标注：向上 27.5 和 12.5，固定端反力矩 45，弯矩从固定端的 −45 变到荷载下的 37.5](/screenshots/zh/p4-plot-reaction-names.webp){.shot-lg}

名称不需要计算结果，所以未求解的模型也能画成习题单。画参考答案时，让 `reactionLabels` 保持为 `'values'`。名称和数值占用的空间不同（为零的水平支反力在习题单上有名称，在参考答案中却没有箭头），所以在两者之间切换的图应该用 `:reserve-reaction-labels="['names', 'values']"` 为两者都留出位置：图保持不动，只有标注变化。[习题与测验](/zh/plot/exercises#the-exercise-in-a-page)中的题目卡片用 `answers` 属性在两者之间切换，本站的[结构力学练习题](/zh/practice)在学生查看答案时也是这样做的。

## 缩略图 {#thumbnails}

`compact` 用于约 400 × 200 px 的小卡片：符号更小，文字 11.5 px，每根杆件最多标两个数值，线荷载只标大小，不写 `q =`。

```vue
<StructurePlot v-for="t in tiles" :key="t.title" :solver="t.solver" compact :height="200" :title="t.title" />
```

本站的[示例](/zh/examples/)页面就是这样绘制的。

## 尺寸 {#size}

图会测量所在容器的宽度，并按这个宽度以实际像素布局。不设 `height` 时，高度随图而定，上限为 `maxHeight`，默认为 $\max(320, 0.75 \times \text{width})$。在能测量之前（例如在服务端），它使用 `width`，默认 640 px。

| 属性 | 默认值 | 设置 |
| --- | --- | --- |
| `width` | 640, compact 400 | 测量到容器宽度之前使用的布局宽度，px |
| `height` | follows the drawing | 固定高度，px |
| `maxHeight` | $\max(320, 0.75w)$, compact none | 自动高度的上限 |
| `padding` | 6 | 图周围的留白，px |
| `fontSize` | 13, compact 11.5 | 文字大小，px |
| `diagramSize` | 48, compact 26 | 最大纵坐标的长度，px |
| `deformedSize` | 30, compact 18 | 变形图中最大位移的长度，px |

### 多幅图使用同一比例 {#several-plots-at-one-scale}

每幅图都按自己的最大值缩放内力图，所以 20 kNm 的弯矩看上去和 80 kNm 的一样大。需要比较时，用 `diagramScale` 固定比例，即每个国际单位制单位对应多少像素：

```vue
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams' // 来自“快速入门”：(跨度 m, q kN/m) => 已求解的求解器

const spans = [4, 6, 8].map((L) => ({ L, solver: simpleBeam(L, 10) }))
// 每 kNm 0.5 px（每 N·m 0.5e-3 px）：8 m 跨的 80 kNm 画成 40 px 深，4 m 跨的 20 kNm 画成 10 px
const scale = { M: 0.5e-3 }
</script>

<template>
  <figure v-for="s in spans" :key="s.L">
    <StructurePlot :solver="s.solver" :layers="['members', 'supports', 'M']" :diagram-scale="scale" />
    <figcaption>L = {{ s.L }} m</figcaption>
  </figure>
</template>
```

## 单位与数字 {#units-and-numbers}

内部数值一律采用国际单位制，只在显示时换算，默认显示单位为 kN、kNm、kN/m、m、mm、mrad 和 K。任何单位都可以用符号和换算系数覆盖，显示值 = 国际单位制数值 × 换算系数：

```vue
<StructurePlot :solver="solver" :units="{ force: { symbol: 'N', scale: 1 } }" />
```

数字由 `Intl.NumberFormat` 格式化，默认是英文格式，最多一位小数。传入你自己的格式，以匹配页面的语言：

```vue
<StructurePlot :solver="solver" :number-format="new Intl.NumberFormat('cs', { maximumFractionDigits: 2 })" />
```

负号是真正的负号（−），舍入为零的数值绝不会显示为 −0。单位名称为 `force`、`moment`、`distributed`、`length`、`displacement`、`rotation` 和 `temperature`；导出的 `KN_UNITS` 和 `SI_UNITS` 可以作为起点。

## 读取数值 {#reading-values}

设置 `hover` 后，图会读取指针所指杆件位置处正在显示的结果。它在每个数值的绘制位置做标记：在每幅显示中的内力图的纵坐标顶端放一个圆点（突变处两侧顶端各一个），或放在变形图上；并在一个小标签中列出数值，例如 `M = 54 kNm`，在突变处则列出两侧数值，如 `V = 13.3 → −6.7 kN`。指针在杆件的内力图上任何位置都能选中该杆件，不必正好指在杆件上。图还会触发 `readout` 事件，把这些数值作为数据传出：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { StructurePlot, type Readout } from '@edubeam/plot'
import { portalFrame } from './frame' // 来自“幻灯片与讲义”：() => 已求解的求解器

const frame = portalFrame()
const reading = ref<Readout | null>(null)
</script>

<template>
  <StructurePlot :solver="frame" :layers="['members', 'supports', 'M']" hover @readout="reading = $event" />
  <p v-if="reading">
    Member {{ reading.member }}, {{ reading.x.toFixed(2) }} m from its start:
    M = {{ (reading.values.M.left / 1e3).toFixed(1) }} kNm
  </p>
</template>
```

读数为 `{ member, x, px, py, values, u }`：杆件、沿杆件的位置（m）、屏幕上的点（px）、`N`、`V`、`M` 和 `w` 各自的 `{ left, right }`（国际单位制），以及轴向位移 `u`。指针离开时为 `null`。本站的交互插图都使用了 `hover`：指一下试试。

不设 `hover` 时，图完全不添加事件监听器，所以页面可以在图上正常滚动，在链接中的图上轻点也会打开链接。设置后，图只监听指针事件，在触摸屏上仍可竖向滚动和双指缩放。

## 无障碍 {#accessibility}

每幅图都是一个 `<svg role="img">`，它的名称来自 `title` 属性，或是对所显示内容的描述，例如“Structure with its loads, reactions, bending moment”（这是库默认的英文描述）。隐藏的预留图层带有 `aria-hidden`。
