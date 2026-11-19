---
title: 荷载工况
description: "一次求解 @edubeam/fem 模型的多个荷载工况，并按叠加原理把结果组合成荷载组合和包络图。"
order: 8
source: site
---

# 荷载工况 {#load-cases}

荷载工况是一组一起求解的荷载。求解器一开始带有一个荷载工况；再添加几个，一次 `solve()` 就会用同一个刚度矩阵把它们全部解出。分析是线性的，所以不同工况的结果可以乘以系数后相加：荷载组合无非如此。

## 添加荷载工况 {#add-a-load-case}

```ts [load-cases.ts]
import { DofID, LinearStaticSolver, LoadCase } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const dead = solver.loadCases[0] // 每个求解器自带的那个工况
const live = new LoadCase('live', domain)
solver.loadCases.push(live)

dead.createBeamElementUniformEdgeLoad(1, [0, 10e3], true) // 10 kN/m
live.createBeamConcentratedLoad(1, [0, 20e3, 0, 3], true) // 跨中 20 kN
solver.solve() // 求解所有荷载工况

console.log(beam.computeBendingMomentAt(dead, 3)) // qL²/8
console.log(beam.computeBendingMomentAt(live, 3)) // PL/4
```

```text [输出]
45000
30000
```

每个读取结果的方法都要传入荷载工况，指明读取哪一个。第一个工况的标签是 `'DefaultLC'`；标签只是名称，求解器靠对象本身区分工况。

## 组合工况 {#combine-them}

把每个工况的结果乘以各自的分项系数再相加。以欧洲规范（Eurocode）的承载能力极限状态组合 $1.35\,G + 1.5\,Q$ 为例，跨中弯矩为：

```ts
1.35 * beam.computeBendingMomentAt(dead, 3) +
  1.5 * beam.computeBendingMomentAt(live, 3) // 105750 N·m
```

支反力、位移和其他所有结果都一样。沿整根杆件组合时，逐点相加即可：对每个工况，`computeBendingMoment(lc, n)` 返回的数组使用相同的 `x`。

```ts
const n = 60
const g = beam.computeBendingMoment(dead, n).M
const q = beam.computeBendingMoment(live, n).M
const uls = g.map((m, i) => 1.35 * m + 1.5 * q[i])
Math.max(...uls) // 105750 N·m，位于 x = 3
```

包络图，即几种组合中的最大值和最小值，就是对这些数组逐点取 `Math.max` 和 `Math.min`。对移动荷载，则改为每个荷载位置求解一次：[影响线示例](/zh/solver/scripts#an-influence-line-as-csv)就是这样做的。

## 在 EduBeam 应用中 {#in-the-edubeam-app}

应用一次只求解一个荷载工况，所以在荷载组合上，库能做的比应用更多。有多个工况的模型仍然可以逐个工况[绘制](/zh/solver/drawing)：@edubeam/plot 的 `StructurePlot` 接受一个 `loadCase` 索引，指向 `solver.loadCases` 中的工况。
