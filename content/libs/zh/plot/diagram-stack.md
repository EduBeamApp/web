---
title: DiagramStack
description: "用 DiagramStack 在同一根 x 轴上绘制梁及其下方的 V(x)、M(x)、w(x) 图，用游标同时读取各行数值，并让读者沿梁拖动集中荷载。"
order: 3
source: site
---

# DiagramStack

`DiagramStack` 绘制的正是每本结构力学教材里都有的那种图：一根直梁及其支座、荷载和支反力，下方在同一根 x 轴上依次画出剪力 V(x)、弯矩 M(x) 和挠度 w(x)。一条游标可同时读取各行的数值；还可以加一个能沿梁拖动的集中荷载。

```vue
<DiagramStack :solver="solver" />
```

![DiagramStack：跨度 6 m 的简支梁，作用一个读者可拖动的 20 kN 荷载，此时距左支座 4.3 m；支反力为 5.7 kN 和 14.3 kN，剪力在荷载处从 5.7 kN 突变为 −14.3 kN，弯矩在该处达到最大值 24.4 kNm，挠度最大值为 17 mm](/screenshots/zh/p2p-plot-diagram-stack.webp){.shot-lg}

各杆件必须位于同一条水平直线上，并且方向从左向右。其他情况，如倾斜或折线形的杆件，或方向从右向左的杆件，都会直接报错，而不会画出错误的图，因为这幅图的 x 轴就是梁的轴线。全部属性见[组件 API](/zh/plot/components#diagramstack)。

## 行 {#rows}

| 属性 | 默认值 | 设置 |
| --- | --- | --- |
| `rows` | `['V', 'M', 'w']` | 从上到下的各幅内力图；也可以用 `'N'` |
| `loadRow` | `true` | 在各行上方画出带支座、荷载和支反力的梁 |
| `members` | all members | 模型中还有其他杆件时，组成梁轴线的杆件 |
| `rowHeights` | N 100, V 116, M 128, w 76 px | 各行高度；宽度小于 560 px 时略小一些 |
| `maxHeight` | none | 各行缩小（最多缩到 60 %）以适应该高度；文字大小不变 |
| `ranges` | each row's own | 每行固定的数值范围，国际单位制 |

V 和 N 以向上为正，M 和 w 以向下为正，和大多数教材的画法一样：正弯矩（下缘受拉）和向下的挠度都画在轴线下方。每行都标出自己的极值。

## 读数游标 {#the-reading-cursor}

`hover` 默认开启。指针在图上移动时，会出现一条贯穿各行的竖直游标，每行的数值显示在一个小标签中。在突变处（集中荷载或支座处）8 px 范围内，游标会吸附到该处，V 显示两侧数值，例如上图荷载下的 `5.7 → −14.3 kN`。组件还会触发 `readout` 事件，把这些数值传出：

```vue
<DiagramStack :solver="solver" @readout="(r) => (reading = r)" />
```

读数为 `{ x, values }`：`x` 是沿梁的位置（m），每行一个 `{ left, right }`（国际单位制）；指针离开时为 `null`。

## 可拖动的荷载 {#a-load-the-reader-can-drag}

给 `v-model:load-at` 传入一个集中荷载的位置，这个荷载就会带上一个拖动手柄：读者可以用指针拖动它，也可以让它获得焦点后用方向键移动。组件只报告新的位置。你需要把荷载放到这个位置重新求解梁，再把新的求解器传回去，就像 `MovingLoad.vue` 这样：

```vue [MovingLoad.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { beamLine, DiagramStack, lineDiagram, modelFromSolver, rowRange, type StackRow } from '@edubeam/plot'

const L = 6 // m
const P = 20e3 // N

/** 集中荷载距 A 点 `at` m 时的梁，已求解。 */
const solveWithLoadAt = (at: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamConcentratedLoad(1, [0, P, 0, at], true)
  solver.solve()
  return solver
}

/** 每行在所有荷载位置下的数值范围，这样内力图会随之增大缩小，而不是重新缩放。 */
const rows: StackRow[] = ['V', 'M', 'w']
const envelope = (() => {
  const ranges: Partial<Record<StackRow, [number, number]>> = {}
  for (let at = 0.25; at < L; at += 0.25) {
    const model = modelFromSolver(solveWithLoadAt(at))
    const line = beamLine(model)
    for (const row of rows) {
      const [lo, hi] = rowRange(lineDiagram(model, line, row))
      const [min, max] = ranges[row] ?? [0, 0]
      ranges[row] = [Math.min(min, lo), Math.max(max, hi)]
    }
  }
  return ranges
})()

const at = ref(2)
const solver = computed(() => solveWithLoadAt(at.value))
</script>

<template>
  <DiagramStack v-model:load-at="at" :solver="solver" :rows="rows" :ranges="envelope" load-label="P = 20 kN" />
  <p>The load is {{ at.toFixed(2) }} m from A.</p>
</template>
```

荷载位于 4.3 m 处时，图中显示支反力 5.7 kN 和 14.3 kN，荷载下剪力从 5.7 kN 突变为 −14.3 kN，该处弯矩 $M = 5.67 \cdot 4.3 = 24.4$ kNm。如果不设 `ranges`，荷载移动时每行都会按自己的极值重新缩放，内力图看上去就好像根本没有变化。

| 属性 | 默认值 | 设置 |
| --- | --- | --- |
| `loadAt` | none | 荷载的位置，从梁轴线起点算起，m；与 `v-model:load-at` 一起使用 |
| `loadLabel` | `P = …` | 手柄旁的文字 |
| `loadStep` | 0.05 | 拖动时按此步长取整，m；方向键每次也移动这么多 |

手柄是一个可获得焦点的 `role="slider"` 元素，并向屏幕阅读器提供它的范围和位置。方向键每次移动 `loadStep`，Page Up 和 Page Down 每次移动 1 m，Home 和 End 移到梁的两端。在触摸屏上可以用手指拖动手柄，在图上竖向滚动也照常有效。

手柄代表已求解模型中位于 `loadAt` 处的集中力：这个力画成手柄，旁边标出它的大小，除非你设置了 `loadLabel`。请像 `solveWithLoadAt` 那样，把荷载放在模型中同样的位置。

## 尺寸与服务端渲染 {#size-and-server-rendering}

图会测量所在容器的宽度，并按这个宽度布局，最小 320 px。在能测量之前，它使用 `width`，默认 720 px。文字大小为 12.5 px（`fontSize`），不会随图缩小。
