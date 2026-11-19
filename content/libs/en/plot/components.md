---
title: Component API
description: "Every prop and event of StructurePlot and DiagramStack in @edubeam/plot 0.2.0, with types and defaults, the EduBeamPlot plugin and the exported prop types."
order: 8
group: Reference
source: site
---

# Component API

The props and events of the two components, as declared in @edubeam/plot 0.2.0. Neither has slots. Values in SI units are marked as such; sizes are CSS pixels.

## StructurePlot

```ts
import { StructurePlot } from '@edubeam/plot'
```

Draws a plane structure and its results. Guide: [StructurePlot](/plot/structure-plot).

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | A @edubeam/fem solver. Results are drawn once its load case is solved. |
| `model` | `PlotModel` | – | Or the plain data [`modelFromSolver`](/plot/model) makes. Takes precedence over `solver`. |
| `loadCase` | `number` | `0` | Index into `solver.loadCases` |
| `revision` | `number` | `0` | Change it to redraw a solver changed in place |
| `layers` | `readonly PlotLayer[]` | members, supports, loads, reactions and one result | What to draw: `'nodes'`, `'nodeLabels'`, `'dimensions'`, `'members'`, `'supports'`, `'loads'`, `'reactions'`, `'N'`, `'V'`, `'M'`, `'w'` |
| `reserve` | `readonly PlotLayer[]` | `layers` | Layers to make room for while hidden |
| `compact` | `boolean` | `false` | Thumbnail drawing: smaller symbols, two values per member at most |
| `units` | `Partial<Units>` | `KN_UNITS` | Display units |
| `numberFormat` | `Intl.NumberFormat` | English, at most 1 decimal | Formats every number |
| `colors` | `Partial<PlotColors>` | – | Colour overrides by tone: [Theming](/plot/theming#the-colors-prop) |
| `width` | `number` | `640`, compact `400` | Width before the box is measured, as on the server |
| `height` | `number` | – | Fixed height. Without it, the height follows the drawing. |
| `maxHeight` | `number` | `max(320, 0.75 × width)`, compact none | Upper bound of the automatic height |
| `padding` | `number` | `6` | Space around the drawing |
| `fontSize` | `number` | `13`, compact `11.5` | Text size |
| `diagramSize` | `number` | `48`, compact `26` | Length of the largest diagram ordinate |
| `deformedSize` | `number` | `30`, compact `18` | Largest displacement on the deformed shape |
| `diagramScale` | `Partial<Record<ResultLayer, number>>` | – | Fixed px per SI unit for a result, overriding `diagramSize` or `deformedSize` |
| `momentOnTensionSide` | `boolean` | `true` | M on the tension side; `false` for the compression side |
| `resultLabelMode` | `'horizontal' \| 'axis'` | `'horizontal'` | Values upright, or turned along their ordinate |
| `reactionLabels` | `'values' \| 'names'` | `'values'` | Reactions as they act, with their size; or, for an exercise, every restrained direction named (*A<sub>x</sub>*, *M<sub>A</sub>*) and pointing the way it counts as positive. Names need no results: [Reactions as unknowns](/plot/structure-plot#reactions-as-unknowns) |
| `reserveLabelModes` | `readonly ResultLabelMode[]` | – | Label modes to make room for besides the current one |
| `reserveReactionLabels` | `readonly ReactionLabels[]` | – | Reaction label styles to make room for besides `reactionLabels`, so an exercise that turns into its solution keeps its drawing still |
| `animate` | `boolean` | `true` | Fade layers in and draw members on. Always off under `prefers-reduced-motion`. |
| `hover` | `boolean` | `false` | Read values under the pointer, marked at each diagram's ordinate tip. Off, the plot takes no pointer input at all. |
| `title` | `string` | a description of what is shown | Accessible name of the figure |

Without `layers`, the result is `M` for beams and frames, `N` for a truss, and `w` when nothing carries a force (`defaultResultLayer`).

### Events

| Event | Payload | When |
| --- | --- | --- |
| `readout` | `Readout \| null` | With `hover`: the member point under the pointer and its results; `null` when it leaves |

```ts
interface Readout {
  readonly member: string
  readonly x: number // m from the member's start node
  readonly px: number // the point on screen, px
  readonly py: number
  readonly values: Readonly<Record<'N' | 'V' | 'M' | 'w', SidedValue>> // SI units
  readonly u: number // displacement along the member's local x, m
}
interface SidedValue {
  readonly left: number
  readonly right: number // equal to left where the result is continuous
}
```

## DiagramStack

```ts
import { DiagramStack } from '@edubeam/plot'
```

Draws a straight beam over its diagrams on one x axis. The members must form one horizontal line, drawn left to right; anything else throws. Guide: [DiagramStack](/plot/diagram-stack).

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | The solved beam |
| `model` | `PlotModel` | – | Or plain data from `modelFromSolver`; takes precedence |
| `loadCase` | `number` | `0` | Index into `solver.loadCases` |
| `revision` | `number` | `0` | Change it to redraw a solver changed in place |
| `members` | `readonly string[]` | all members | The members of the beam line |
| `rows` | `readonly StackRow[]` | `['V', 'M', 'w']` | Diagram rows, top to bottom, of `'N'`, `'V'`, `'M'`, `'w'` |
| `loadRow` | `boolean` | `true` | The beam with its supports, loads and reactions above the rows |
| `ranges` | `Partial<Record<StackRow, readonly [number, number]>>` | each row's own | Value range per row, SI units |
| `rowHeights` | `Partial<Record<StackRow, number>>` | N 100, V 116, M 128, w 76; below 560 px wide 88, 96, 104, 64 | Row heights before `maxHeight` scales them |
| `maxHeight` | `number` | – | Rows shrink, to 60 % at most, so the figure fits. Text keeps its size. |
| `units` | `Partial<Units>` | `KN_UNITS` | Display units |
| `numberFormat` | `Intl.NumberFormat` | English, at most 1 decimal | Formats every number |
| `colors` | `Partial<PlotColors>` | – | Colour overrides |
| `width` | `number` | `720` | Width before the box is measured; at least 320 is used |
| `fontSize` | `number` | `12.5` | Text size |
| `hover` | `boolean` | `true` | The reading cursor. Off, the figure takes no pointer input. |
| `loadAt` | `number` | – | Position (m along the line) of a point load the reader may drag; use with `v-model:load-at` |
| `loadLabel` | `string` | `P = …` with the load's magnitude | Text beside the draggable load |
| `loadStep` | `number` | `0.05` | The drag rounds to this step, m; the arrow keys move by it |
| `title` | `string` | a description of the rows | Accessible name of the figure |

### Events

| Event | Payload | When |
| --- | --- | --- |
| `update:loadAt` | `number` | The reader moved the load: its new position, m. Drives `v-model:load-at`. |
| `readout` | `StackReadout \| null` | The cursor's values across the rows; `null` when the pointer leaves |

```ts
interface StackReadout {
  readonly x: number // m along the beam line
  readonly values: Partial<Record<'N' | 'V' | 'M' | 'w', { readonly left: number; readonly right: number }>> // SI
}
```

## The plugin

```ts
import { EduBeamPlot } from '@edubeam/plot'

app.use(EduBeamPlot) // registers <StructurePlot> and <DiagramStack> globally
```

It is optional: importing the components by name is lighter, and a bundler drops the plugin from a build that does not use it.

## Types

For typed wrappers around the components, the package exports their props and events:

```ts
import type { PlotLayer, StructurePlotProps } from '@edubeam/plot'

const figure: StructurePlotProps = { layers: ['members', 'supports', 'M'] satisfies PlotLayer[], compact: true }
```

| Type | Is |
| --- | --- |
| `StructurePlotProps`, `StructurePlotEmits` | The props and events of `StructurePlot` |
| `DiagramStackProps`, `DiagramStackEmits` | The props and events of `DiagramStack` |
| `Readout`, `ReadoutQuantity`, `SidedValue`, `StackReadout` | Event payloads |
| `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `StackRow` | Layer, result, label mode, reaction label and row names |
| `Units`, `Unit`, `UnitKind` | Display units: `{ symbol, scale }` per kind |
| `PlotColors` | Colours by tone |
| `PlotModel` | The plain model: [Plot model](/plot/model) |

The remaining exports, `structureSvg` for SVG files and the functions behind the drawing among them, are in [Functions](/plot/functions).
