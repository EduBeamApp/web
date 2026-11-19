---
title: 组件 API
description: "@edubeam/plot 0.2.0 中 StructurePlot 和 DiagramStack 的全部属性和事件，含类型和默认值，以及 EduBeamPlot 插件和导出的属性类型。"
order: 8
group: API 参考
source: site
---

# 组件 API

两个组件的属性和事件，以 @edubeam/plot 0.2.0 中的声明为准。两者都没有插槽。采用国际单位制的数值已注明；尺寸均为 CSS 像素。

## StructurePlot {#structureplot}

```ts
import { StructurePlot } from '@edubeam/plot'
```

绘制平面结构及其计算结果。指南：[StructurePlot](/zh/plot/structure-plot)。

### 属性 {#props}

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | @edubeam/fem 求解器。荷载工况求解后才绘制结果。 |
| `model` | `PlotModel` | – | 或由 [`modelFromSolver`](/zh/plot/model) 生成的纯数据。优先于 `solver`。 |
| `loadCase` | `number` | `0` | `solver.loadCases` 中的索引 |
| `revision` | `number` | `0` | 直接修改了求解器后，改变它的值以重新绘制 |
| `layers` | `readonly PlotLayer[]` | members, supports, loads, reactions and one result | 要绘制的内容：`'nodes'`、`'nodeLabels'`、`'dimensions'`、`'members'`、`'supports'`、`'loads'`、`'reactions'`、`'N'`、`'V'`、`'M'`、`'w'` |
| `reserve` | `readonly PlotLayer[]` | `layers` | 隐藏时也要预留位置的图层 |
| `compact` | `boolean` | `false` | 缩略图画法：符号更小，每根杆件最多标两个数值 |
| `units` | `Partial<Units>` | `KN_UNITS` | 显示单位 |
| `numberFormat` | `Intl.NumberFormat` | English, at most 1 decimal | 格式化所有数字 |
| `colors` | `Partial<PlotColors>` | – | 按色调覆盖颜色：[主题与颜色](/zh/plot/theming#the-colors-prop) |
| `width` | `number` | `640`, compact `400` | 测量到容器宽度之前（如在服务端）使用的宽度 |
| `height` | `number` | – | 固定高度。不设置时，高度随图而定。 |
| `maxHeight` | `number` | `max(320, 0.75 × width)`, compact none | 自动高度的上限 |
| `padding` | `number` | `6` | 图周围的留白 |
| `fontSize` | `number` | `13`, compact `11.5` | 文字大小 |
| `diagramSize` | `number` | `48`, compact `26` | 内力图最大纵坐标的长度 |
| `deformedSize` | `number` | `30`, compact `18` | 变形图上的最大位移 |
| `diagramScale` | `Partial<Record<ResultLayer, number>>` | – | 某一结果的固定比例，每个国际单位对应的像素数，覆盖 `diagramSize` 或 `deformedSize` |
| `momentOnTensionSide` | `boolean` | `true` | M 图画在受拉侧；`false` 时画在受压侧 |
| `resultLabelMode` | `'horizontal' \| 'axis'` | `'horizontal'` | 数值水平书写，或沿纵坐标方向书写 |
| `reactionLabels` | `'values' \| 'names'` | `'values'` | 支反力按实际作用方向绘制并标出大小；或者用于习题时，每个受约束方向都标上名称（*A<sub>x</sub>*、*M<sub>A</sub>*），并指向其正方向。名称不需要计算结果：见[支反力作为未知量](/zh/plot/structure-plot#reactions-as-unknowns) |
| `reserveLabelModes` | `readonly ResultLabelMode[]` | – | 除当前方式外，还要预留位置的标注方式 |
| `reserveReactionLabels` | `readonly ReactionLabels[]` | – | 除 `reactionLabels` 外，还要预留位置的支反力标注方式，使题目切换为答案时图保持不动 |
| `animate` | `boolean` | `true` | 图层淡入，杆件从一端画到另一端。用户开启 `prefers-reduced-motion` 时始终关闭。 |
| `hover` | `boolean` | `false` | 读取指针下的数值，并在每幅内力图的纵坐标顶端做标记。关闭时，图完全不接收指针输入。 |
| `title` | `string` | a description of what is shown | 图的无障碍名称 |

不设 `layers` 时，结果图层为：梁和刚架用 `M`，桁架用 `N`，没有任何杆件受力时用 `w`（`defaultResultLayer`）。

### 事件 {#events}

| 事件 | 参数 | 触发时机 |
| --- | --- | --- |
| `readout` | `Readout \| null` | 设置 `hover` 时：指针下的杆件位置及该处的结果；指针离开时为 `null` |

```ts
interface Readout {
  readonly member: string
  readonly x: number // 距杆件起始节点的距离，m
  readonly px: number // 屏幕上的点，px
  readonly py: number
  readonly values: Readonly<Record<'N' | 'V' | 'M' | 'w', SidedValue>> // 国际单位制
  readonly u: number // 沿杆件局部 x 轴的位移，m
}
interface SidedValue {
  readonly left: number
  readonly right: number // 结果连续处与 left 相等
}
```

## DiagramStack {#diagramstack}

```ts
import { DiagramStack } from '@edubeam/plot'
```

在同一根 x 轴上绘制直梁及其下方的内力图。各杆件必须位于同一条水平直线上，并且方向从左向右；其他情况都会抛出异常。指南：[DiagramStack](/zh/plot/diagram-stack)。

### 属性 {#props-1}

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | 已求解的梁 |
| `model` | `PlotModel` | – | 或由 `modelFromSolver` 生成的纯数据；优先于 `solver` |
| `loadCase` | `number` | `0` | `solver.loadCases` 中的索引 |
| `revision` | `number` | `0` | 直接修改了求解器后，改变它的值以重新绘制 |
| `members` | `readonly string[]` | all members | 组成梁轴线的杆件 |
| `rows` | `readonly StackRow[]` | `['V', 'M', 'w']` | 从上到下的内力图行，取值为 `'N'`、`'V'`、`'M'`、`'w'` |
| `loadRow` | `boolean` | `true` | 在各行上方画出带支座、荷载和支反力的梁 |
| `ranges` | `Partial<Record<StackRow, readonly [number, number]>>` | each row's own | 每行的数值范围，国际单位制 |
| `rowHeights` | `Partial<Record<StackRow, number>>` | N 100, V 116, M 128, w 76; below 560 px wide 88, 96, 104, 64 | 按 `maxHeight` 缩放之前的各行高度 |
| `maxHeight` | `number` | – | 各行缩小（最多缩到 60 %）以适应该高度。文字大小不变。 |
| `units` | `Partial<Units>` | `KN_UNITS` | 显示单位 |
| `numberFormat` | `Intl.NumberFormat` | English, at most 1 decimal | 格式化所有数字 |
| `colors` | `Partial<PlotColors>` | – | 覆盖颜色 |
| `width` | `number` | `720` | 测量到容器宽度之前使用的宽度；最小取 320 |
| `fontSize` | `number` | `12.5` | 文字大小 |
| `hover` | `boolean` | `true` | 读数游标。关闭时，图不接收指针输入。 |
| `loadAt` | `number` | – | 读者可拖动的集中荷载的位置（沿梁轴线，m）；与 `v-model:load-at` 一起使用 |
| `loadLabel` | `string` | `P = …` with the load's magnitude | 可拖动荷载旁的文字 |
| `loadStep` | `number` | `0.05` | 拖动时按此步长取整，m；方向键每次也移动这么多 |
| `title` | `string` | a description of the rows | 图的无障碍名称 |

### 事件 {#events-1}

| 事件 | 参数 | 触发时机 |
| --- | --- | --- |
| `update:loadAt` | `number` | 读者移动了荷载：新的位置，m。驱动 `v-model:load-at`。 |
| `readout` | `StackReadout \| null` | 游标在各行的数值；指针离开时为 `null` |

```ts
interface StackReadout {
  readonly x: number // 沿梁轴线的位置，m
  readonly values: Partial<Record<'N' | 'V' | 'M' | 'w', { readonly left: number; readonly right: number }>> // 国际单位制
}
```

## 插件 {#the-plugin}

```ts
import { EduBeamPlot } from '@edubeam/plot'

app.use(EduBeamPlot) // 全局注册 <StructurePlot> 和 <DiagramStack>
```

插件是可选的：按名称导入组件更轻量，而且构建时如果没有用到插件，打包工具会把它去掉。

## 类型 {#types}

为了给组件编写带类型的封装，这个包导出了组件的属性和事件类型：

```ts
import type { PlotLayer, StructurePlotProps } from '@edubeam/plot'

const figure: StructurePlotProps = { layers: ['members', 'supports', 'M'] satisfies PlotLayer[], compact: true }
```

| 类型 | 含义 |
| --- | --- |
| `StructurePlotProps`, `StructurePlotEmits` | `StructurePlot` 的属性和事件 |
| `DiagramStackProps`, `DiagramStackEmits` | `DiagramStack` 的属性和事件 |
| `Readout`, `ReadoutQuantity`, `SidedValue`, `StackReadout` | 事件参数 |
| `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `StackRow` | 图层、结果、标注方式、支反力标注和行的名称 |
| `Units`, `Unit`, `UnitKind` | 显示单位：每种量一个 `{ symbol, scale }` |
| `PlotColors` | 按色调划分的颜色 |
| `PlotModel` | 纯数据模型：[绘图模型](/zh/plot/model) |

其余导出，包括生成 SVG 文件的 `structureSvg` 和绘图背后的各个函数，见[函数](/zh/plot/functions)。
