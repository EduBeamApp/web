---
title: 杆件与铰
description: "用 Beam2D 杆件连接节点，用端部铰接释放弯矩，建立桁架杆，并从 @edubeam/fem 取得单元的刚度矩阵和坐标转换矩阵。"
order: 5
source: site
---

# 杆件与铰 {#members-and-hinges}

每根杆件都是一个 `Beam2D`：位于 x–z 平面内的两节点直杆 Timoshenko 梁单元，承受轴力、剪力和弯矩。杆端的铰释放该端的弯矩。代码片段沿用类似[快速入门](/zh/solver/getting-started)中那种程序的 `solver`、`domain` 和 `lc`，以及其中的材料 `'steel'` 和截面 `'IPE200'`。

## 创建杆件 {#create-a-member}

```ts
domain.createBeam2D(label, [startNode, endNode], material, crossSection, hinges)
```

| 参数 | 类型 | 含义 |
| --- | --- | --- |
| `label` | `string \| number` | 杆件名称，以字符串保存 |
| `nodes` | `[label, label]` | 第一个和第二个节点。局部 x 轴从第一个节点指向第二个节点，参见[杆件方向](/zh/solver/conventions#member-direction)。 |
| `mat`、`cs` | `string \| number` | 材料和截面的标签 |
| `hinges` | `[boolean, boolean]` | 第一个节点处、第二个节点处是否有铰。可选，默认为 `[false, false]`，即两端刚接。 |

返回值是 `Beam2D`：保存下来，用于读取结果。`domain.getElement(label)` 也能重新取得它，但类型是通用的 `Element`，所以在 TypeScript 中读取结果之前，要先用 `as Beam2D` 断言类型。

在节点处相交且没有铰的杆件是刚性连接的：它们一起转动。节点、材料和截面的创建顺序不限，只要求解时都已存在即可；缺少任何一个，`solve()` 都会抛出 `RangeError`，并指出缺少的是哪一个。

## 端部铰接 {#end-hinges}

铰属于杆端，而不属于节点。下面杆件 2 的起点在 C 处有铰，所以 C 只把 C–D 跨的剪力传给悬臂段 A–C，不传弯矩：

```ts [hinge.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry])
domain.createNode('C', [2, 0, 0])
domain.createNode('D', [6, 0, 0], [DofID.Dz])
const ac = domain.createBeam2D(1, ['A', 'C'], 'steel', 'IPE200')
const cd = domain.createBeam2D(2, ['C', 'D'], 'steel', 'IPE200', [true, false])

lc.createBeamElementUniformEdgeLoad(2, [0, 10e3], true)
solver.solve()

cd.computeBendingMomentAt(lc, 0) // 铰处为 0
cd.computeBendingMomentAt(lc, 2) // 20000 N·m：4 m 跨的 qL²/8
ac.computeBendingMomentAt(lc, 0) // -40000 N·m：来自 C–D 的 20 kN，力臂 2 m
```

::model-figure{caption="悬臂梁支承一跨带铰的梁：C 处弯矩为零"}
---
nodes: { A: [0, 0], C: [2, 0], D: [6, 0] }
supports: { A: fixed, D: roller }
members: [[A, C], { nodes: [C, D], hinges: [true, false] }]
loads:
  - { member: 2, qz: 10 }
results: [M, V]
show: [nodeLabels]
---
::

几根杆件在一个铰接节点处相交时，除一根以外，其余杆端都设铰就够了。每个杆端都设铰也可以：这时没有任何杆件约束节点的转动，求解器给出的转角为 0。但如果在这样的节点上施加力偶，就没有杆件能承担它，[求解会失败](/zh/solver/solving#when-solving-fails)。

## 桁架杆 {#truss-bars}

两端都设铰，只要荷载作用在节点上，杆件就只承受轴力：这就是桁架杆。

```ts
domain.createBeam2D('AE', ['A', 'E'], 'steel', 'bar', [true, true])
```

[桁架示例](/zh/solver/trusses)就是这样求解整个桁架的。EduBeam 应用中的桁架示例则采用刚性节点，并取很大的面积，使弯矩与轴力相比可以忽略。两种模型都成立，区别只在于这些很小的弯矩。理论手册的[桁架单元](/zh/elements/truss)一页推导了杆的刚度矩阵。

## 单元矩阵 {#the-element-s-matrices}

讲授矩阵位移法本身时，`Beam2D` 可以给出 [mathjs](https://mathjs.org) 矩阵形式的单元矩阵；`.toArray()` 把它们转为 `number[][]`：

| 方法 | 返回 |
| --- | --- |
| `computeGeo()` | `{ l, dx, dz }`：杆长和投影，单位 m |
| `computeLocalStiffnessMtrx().answer` | 局部坐标系中的 6 × 6 刚度矩阵，已凝聚掉铰端的转角 |
| `computeT()` | 从整体坐标到局部坐标的 6 × 6 坐标转换矩阵 |
| `computeStiffness()` | 整体坐标系中的 6 × 6 刚度矩阵，$T^T K_l T$ |
| `computeShearFactor()` | $\Phi = 12EI_y/kGAL^2$ |

```ts
ac.computeStiffness().toArray() // number[][]，单位 N/m、N 和 N·m
```

自由度的顺序为 $u_1, w_1, \varphi_1, u_2, w_2, \varphi_2$。理论手册的[梁单元](/zh/elements/beam)一页推导了这些矩阵，[EduBeam 如何求解模型](/zh/elements/analysis)一页说明了它们如何集成为整体刚度矩阵。
