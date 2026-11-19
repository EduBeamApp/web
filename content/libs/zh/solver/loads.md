---
title: 节点荷载与杆件荷载
description: "用 @edubeam/fem 在节点上施加力和力矩，沿杆件施加均布、梯形分布和集中荷载，可用整体或局部坐标，并能修改或删除荷载。"
order: 6
group: 荷载
source: site
---

# 节点荷载与杆件荷载 {#nodal-and-member-loads}

荷载属于荷载工况。求解器一开始就带有一个荷载工况 `solver.loadCases[0]`，它的每个 `create…` 方法都会添加一个荷载，并返回这个荷载。多个荷载工况及其组合见[荷载工况](/zh/solver/load-cases)。

数值单位为 N、N/m 和 N·m，方向遵循[坐标轴](/zh/solver/conventions#axes)约定：+z 朝下，正的力矩为逆时针。

## 一根梁上的各种荷载 {#a-beam-with-every-kind}

一根 8 m 长的梁，一端为固定铰支座，另一端为滑动铰支座，承受从 4 kN/m 增大到 10 kN/m 的线荷载、一个 20 kN 的集中荷载、一个 10 kNm 的集中力偶，以及滑动铰支座处的一个水平力：

```ts [loads.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // 固定铰支座
domain.createNode('B', [8, 0, 0], [DofID.Dz]) // 滑动铰支座
domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
// A 处 4 kN/m，增大到 B 处 10 kN/m，向下
lc.createBeamElementTrapezoidalEdgeLoad(1, [0, 4e3], [0, 10e3], false)
// [fx, fz, my, a]：20 kN 向下，距 A 2 m
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], false)
// 10 kNm 逆时针集中力偶，距 A 6 m
lc.createBeamConcentratedLoad(1, [0, 0, 10e3, 6], false)
// B 处 5 kN，向右
lc.createNodalLoad('B', { [DofID.Dx]: 5e3 })
solver.solve()

// getReactions 返回 mathjs Matrix 或数组：统一转为数组
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

console.log(list(domain.getNode('A').getReactions(lc).values))
console.log(list(domain.getNode('B').getReactions(lc).values))
```

```text [输出]
[ -5000, -40250 ]
[ -35750 ]
```

手算：线荷载合力为 56 kN，作用在距 A 4.571 m 处，对 A 取矩得 $8R_B = 56 \cdot 4.571 + 20 \cdot 2 - 10 = 286$，$R_B = 35.75$ kN，向上；$R_A = 76 - 35.75 = 40.25$ kN，向上。固定铰支座还承担了那 5 kN 的水平力，使整根梁受 5 kN 的拉力。

::model-figure{caption="同样的荷载。图中把力偶放在 6 m 处的节点 C 上，结果相同。"}
---
nodes: { A: [0, 0], C: [6, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: [4, 8.5] }
  - { member: 2, qz: [8.5, 10] }
  - { member: 1, pz: 20, at: 2 }
  - { node: C, my: 10 }
  - { node: B, fx: 5 }
results: [M]
show: [nodeLabels]
labels: horizontal
---
::

## 节点荷载 {#nodal-loads}

```ts
lc.createNodalLoad(node, { [DofID.Dx]: fx, [DofID.Dz]: fz, [DofID.Ry]: my }, lcs)
```

只需给出需要的分量。数值按整体坐标给出；对用 [`updateLcs`](/zh/solver/nodes-supports#inclined-supports) 旋转过的节点，把 `lcs` 设为 `true`，数值就按节点自身的坐标轴给出。作用在支座约束的自由度上的力直接进入支反力，不会使任何杆件弯曲。

## 杆件荷载 {#member-loads}

| 方法 | 数值单位 | 荷载 |
| --- | --- | --- |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | N/m | 布满整根杆件的均布荷载 |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | N/m | 从第一个节点到第二个节点线性变化 |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | N、N·m、m | 一个集中力和一个集中力偶，作用在距第一个节点 `a` 米处 |

线荷载总是布满整根杆件。如果荷载只作用在一跨的一部分，在荷载起点处加一个节点把杆件分开即可：多加一个节点不会改变任何结果。集中力或集中力偶可以作用在杆件上的任意位置。

### 整体坐标或局部坐标 {#global-or-local-axes}

最后一个参数 `lcs` 指定分量所在的坐标轴：

- `false`：整体 x 和 z。无论杆件倾角如何，`fz` 都竖向作用。
- `true`：杆件的局部 x（沿杆轴）和局部 z（垂直杆轴）。`fz` 垂直于杆件作用。

对从左向右画的水平杆件，两者相同；从右向左画时，局部 `fz` 朝上。

::callout{type="info" title="线荷载按杆长每米计"}
两种线荷载都按杆件自身长度的每米计。一根长 5 m、水平跨度 4 m 的斜梁，按整体坐标给出 `[0, 10e3]`，合力为 50 kN。按水平投影长度计为 10 kN/m 的雪荷载，换算到沿斜梁为 $10 \cdot 4/5 = 8$ kN/m：应给出 `[0, 8e3]`。
::

## 修改或删除荷载 {#change-or-remove-a-load}

每个 `create…` 方法都返回所创建的荷载。修改它的数值，再求解一次：

```ts
const q = lc.createBeamElementUniformEdgeLoad(1, [0, 10e3], true)
solver.solve()
q.values = [0, 20e3] // 荷载加倍
solver.solve()
```

荷载保存在普通数组 `lc.nodalLoadList` 和 `lc.elementLoadList`（杆件荷载和温度荷载）中，所以 `lc.elementLoadList.splice(index, 1)` 就能删除其中一个。各类荷载的属性名见 [API 参考](/zh/solver/reference#loads)。

温度变化和支座沉降也是荷载，参见[温度荷载与支座沉降](/zh/solver/temperature-settlements)。
