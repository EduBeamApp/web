---
title: 温度荷载与支座沉降
description: "用 @edubeam/fem 给杆件施加均匀温度变化和温度梯度，用给定位移使支座移动，附经过核对的示例。"
order: 7
source: site
---

# 温度荷载与支座沉降 {#temperature-and-settlements}

有两种荷载不是力：一种是杆件要改变自身的长度或曲率，另一种是支座发生移动。两者只在结构阻止这种变形时才产生内力，因此很适合用来讲解超静定结构。两者的理论见理论手册中的[单元荷载](/zh/elements/beam#element-loads)。

## 温度荷载 {#temperature}

```ts
lc.createBeamTemperatureLoad(member, [dTc, dTb, dTt])
```

| 数值 | 含义 | 对自由杆件的作用 |
| --- | --- | --- |
| `dTc` | 形心处的温度变化，K | 伸长 $\alpha\,\Delta T_c\,L$ |
| `dTb` | 下缘纤维（局部 +z 一侧）的温度变化，K | 与 `dTt` 一起产生曲率 $\kappa = \alpha\,(\Delta T_b - \Delta T_t)/h$ |
| `dTt` | 上缘纤维的温度变化，K | |

只有温差 `dTb - dTt` 使杆件弯曲，所以 `[30, 20, 0]` 和 `[30, 10, -10]` 是同一个荷载。它需要材料的 `alpha` 和截面的 `h`；没有 `h`，弯矩就是 `NaN`。

两端固定梁既不能伸长也不能弯曲，于是转而受压、受弯：$N = -EA\,\alpha\,\Delta T_c$，$M = -EI\,\alpha\,(\Delta T_b - \Delta T_t)/h$。

```ts [temperature.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial(1, { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [6, 0, 0], fixed)
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

// 形心升温 30 K，下缘比上缘高 20 K
lc.createBeamTemperatureLoad(1, [30, 20, 0])
solver.solve()

beam.computeNormalForceAt(lc, 3) // -215460 N：EA · 12e-6 · 30
beam.computeBendingMomentAt(lc, 3) // -4896.4 N·m：EI · 12e-6 · 20 / 0.2
```

对 IPE 200，$EA = 598.5$ MN，$EI = 4.0803$ MNm²。下缘较热时，自由的梁两端会向上翘起，因此约束使它向相反方向弯曲：产生负弯矩，上缘受拉。

::model-figure{caption="两端固定梁，形心升温 30 K，下缘比上缘高 20 K"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 30, bottom: 20, top: 0 } }
results: [M, N]
show: [nodeLabels]
material: { e: 210e9, alpha: 12e-6 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

在简支梁上，同样的荷载完全不产生内力，只产生位移：滑动铰支座向外滑动 $\alpha\,\Delta T_c\,L = 2.16$ mm，跨中下垂 $\kappa L^2/8 = 5.4$ mm。

## 给定位移 {#prescribed-displacements}

```ts
lc.createPrescribedDisplacement(node, { [DofID.Dz]: 0.01 })
```

让支座产生给定的位移：`Dx` 和 `Dz` 以米计，`Ry` 以弧度计，均在节点自身的坐标系中。该自由度必须是节点支座所约束的；对未约束的自由度，给定值会被直接忽略，不会有任何警告。

以一端固定一端简支梁为例，滑动铰支座沉降 10 mm。新建一个求解器，材料和截面与温度荷载示例相同：

```ts
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // 固定端
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // 滑动铰支座
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

lc.createPrescribedDisplacement('B', { [DofID.Dz]: 0.01 }) // 向下 10 mm
solver.solve()

domain.getNode('B').getReactions(lc).values // [566.7] N：3EIw/L³
beam.computeBendingMomentAt(lc, 0) // A 处 -3400.2 N·m：3EIw/L²
```

滑动铰支座必须把梁往下拉，梁才能跟着它移动，所以支反力为正，沿 +z 方向：$3EIw/L^3 = 3 \cdot 4.0803 \times 10^6 \cdot 0.01 / 216 = 566.7$ N。

::model-figure{caption="一端固定一端简支梁的滑动铰支座沉降 10 mm：固定端弯矩为 −3.4 kNm"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

应用中如何绘制这两种荷载，见[荷载](/zh/essentials/loads)。
