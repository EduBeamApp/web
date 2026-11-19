---
title: 读取结果
description: "从求解后的 @edubeam/fem 模型读取支反力、节点位移、杆件上任意位置的内力、变形曲线和杆端力，并说明每个调用返回的数据结构。"
order: 10
source: site
---

# 读取结果 {#reading-results}

`solve()` 之后，针对指定的荷载工况，从节点和杆件读取结果。本页所有示例都读取同一个模型：一根 6 m 简支梁，截面为不计剪切变形的 IPE 200，距 A 2 m 处作用 20 kN 的集中荷载：

```ts [results.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 }) // 不计剪切变形

const A = domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
const B = domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
const lc = solver.loadCases[0]
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], true)
solver.solve()
```

::model-figure{caption="6 m 跨度，距左端 2 m 处作用 20 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M, w]
show: [nodeLabels]
---
::

## 结果的读取方法一览 {#what-to-read-where}

| 结果 | 调用 | 返回 |
| --- | --- | --- |
| 支反力 | `node.getReactions(lc)` | `{ dofs, values }`：N、N·m |
| 位移 | `node.getUnknowns(lc, dofs)` | m、rad |
| 某一点的 N、V 或 M | `beam.computeBendingMomentAt(lc, x)` | 一个数：N、N·m |
| 沿杆件的 N、V 或 M | `beam.computeBendingMoment(lc, n)` | `{ x, M }`，n + 1 个点 |
| 变形曲线 | `beam.computeLocalDefl(lc, n)` | `{ u, w }`，n + 1 个点，m |
| 杆端力 | `beam.computeEndForces(lc)` | 含 6 个元素的 mathjs 矩阵 |

对 N 和 V，对应的方法是 `computeNormalForceAt` 和 `computeShearForceAt`，以及 `computeNormalForce` 和 `computeShearForce`，分别返回 `{ x, N }` 和 `{ x, V }`。符号约定见[单位与符号](/zh/solver/conventions#signs-of-the-results)。

## 支反力 {#reactions}

`getReactions` 为支座约束的每个自由度给出一个支反力：`dofs` 按传给 `createNode` 的顺序列出这些自由度，`values` 按同样顺序保存支反力。有多个支反力时，`values` 是一个 **mathjs 矩阵**，只有一个时则是普通数组，所以用一个小的辅助函数把它统一转为数组：

```ts
/** 把 mathjs Matrix、数组或数字统一转为普通数组。 */
const list = (v: unknown): number[] =>
  typeof v === 'number'
    ? [v]
    : Array.isArray(v)
      ? v
      : (v as { toArray(): number[] }).toArray()

A.getReactions(lc).dofs // [0, 2]：DofID.Dx、DofID.Dz
list(A.getReactions(lc).values) // [0, -13333.3]
list(B.getReactions(lc).values) // [-6666.7]
```

要不依赖顺序取出某一个支反力，就查找它的自由度：`list(values)[dofs.indexOf(DofID.Dz)]`，[连续梁示例](/zh/solver/beams#a-continuous-beam)就是这样做的。

支反力是支座作用在结构上的力：z 向 −13 333 N 就是向上的 13.3 kN，等于 $P\,b/L = 20 \cdot 4/6$。在[旋转了坐标轴](/zh/solver/nodes-supports#inclined-supports)的节点上，支反力在旋转后的坐标系中给出；`getReactions(lc, true)` 把它们转到整体坐标，并返回全部三个自由度，未约束的自由度为 0。没有支座的节点返回 `{ dofs: [], values: [] }`。

## 位移 {#displacements}

`getUnknowns` 可以读取节点的任意自由度，无论是否受约束：

```ts
list(A.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])) // [0, 0, -0.0108924]
```

A 顺时针转动 0.010892 rad，即 $P\,b\,(L^2 - b^2)/6EIL$。只请求一个自由度时，`getUnknowns` 返回一个普通数字，尽管 TypeScript 声明的是矩阵：`list` 同样能处理这种情况。

## 沿杆件的内力 {#internal-forces-along-a-member}

`…At` 方法给出距杆件第一个节点 `x` 米处的值：

```ts
beam.computeShearForceAt(lc, 1) // 13333.3 N
beam.computeShearForceAt(lc, 2) // -6666.7 N：恰在荷载处，取荷载之后的值
beam.computeBendingMomentAt(lc, 2) // 26666.7 N·m：R_A · 2
```

集中荷载使内力突变时，恰在荷载处读到的是荷载之后（远离第一个节点一侧）的值。要读取荷载之前的值，就在荷载前面一点点取值，例如 `x - 1e-9`。

数组方法在杆件上等距取 n + 1 个点，包括两端：

```ts
beam.computeBendingMoment(lc, 3)
// { x: [0, 2, 4, 6], M: [0, 26666.7, 13333.3, 0] }，忽略舍入误差
```

在精确值为 0 的地方，会出现 `-3.6e-12` 这样的舍入误差：打印前先用 `toFixed` 格式化数字。要求杆件上的最大值，可以密集采样（例如 `computeBendingMoment(lc, 500)`），再取其中的最大值，[连续梁示例](/zh/solver/beams#a-continuous-beam)就是这样做的。在分布荷载作用下，M 是多项式，其精确极值位于 V 为零处；[@edubeam/plot](/zh/plot/model#reading-values-yourself) 能精确求出它。

## 变形曲线 {#deflected-shape}

```ts
beam.computeLocalDefl(lc, 3)
// { u: [0, 0, 0, 0], w: [0, 0.0174279, 0.0152494, 0] }
```

`computeLocalDefl` 给出杆件局部坐标系中沿杆轴和垂直杆轴的位移 `u` 和 `w`；`computeGlobalDefl` 给出同样的点在整体 x 和 z 方向的位移。荷载下方的挠度为 17.43 mm，即 $P\,a^2 b^2/3EIL$。节点之间的变形曲线是精确的，不是由杆端值插值得到的。要画出它，参见[绘制结果](/zh/solver/drawing)。

## 杆端力 {#end-forces}

```ts
beam.computeEndForces(lc).toArray()
// [0, -13333.3, 0, 0, -6666.7, 0]：X12、Z12、M12、X21、Z21、M21
```

两个节点作用在杆件上的力，在杆件局部坐标系中给出：也就是应用中*单元结果*表格里的数字，其含义见[单元端力](/zh/elements/conventions#end-forces-element-results-table)。

## 可供核对的结果 {#results-as-numbers-to-check}

以上每个值都与相应的闭合解公式一致。[手算校核结果](/zh/guide/verification)一页给出了更多教材算例，它们都由同一个求解器在你的浏览器中求解。
