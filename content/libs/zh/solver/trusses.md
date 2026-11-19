---
title: 桁架
description: "用 @edubeam/fem 求解铰接的华伦桁架，用截面法逐一核对杆件内力，再用循环生成任意节间数的桁架。"
order: 14
source: site
---

# 桁架 {#trusses}

桁架由两端铰接的杆组成，荷载作用在节点上，所以每根杆只承受轴力。本示例由两个列表建立一个华伦桁架，逐一手算核对杆件内力，然后在循环中生成任意规模的桁架。

::model-figure{caption="华伦桁架：跨度 9 m，高 1.8 m，上弦每个节点作用 8 kN"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members:
  - { nodes: [A, B], hinges: [true, true] }
  - { nodes: [B, C], hinges: [true, true] }
  - { nodes: [C, D], hinges: [true, true] }
  - { nodes: [E, F], hinges: [true, true] }
  - { nodes: [F, G], hinges: [true, true] }
  - { nodes: [A, E], hinges: [true, true] }
  - { nodes: [E, B], hinges: [true, true] }
  - { nodes: [B, F], hinges: [true, true] }
  - { nodes: [F, C], hinges: [true, true] }
  - { nodes: [C, G], hinges: [true, true] }
  - { nodes: [G, D], hinges: [true, true] }
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: [N, w]
show: [nodeLabels]
---
::

```ts [truss.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })

// 华伦桁架：跨度 9 m，高 1.8 m，下弦 A-B-C-D，上弦 E-F-G
const nodes: [string, number, number, DofID[]][] = [
  ['A', 0, 0, [DofID.Dx, DofID.Dz]],
  ['B', 3, 0, []],
  ['C', 6, 0, []],
  ['D', 9, 0, [DofID.Dz]],
  ['E', 1.5, -1.8, []],
  ['F', 4.5, -1.8, []],
  ['G', 7.5, -1.8, []],
]
for (const [label, x, z, support] of nodes) {
  domain.createNode(label, [x, 0, z], support)
}

// 每个标签由杆两端的节点名组成。两端铰接：只有轴力
const bars = ['AB', 'BC', 'CD', 'EF', 'FG', 'AE', 'EB', 'BF', 'FC', 'CG', 'GD']
const members = bars.map((bar) =>
  domain.createBeam2D(bar, [bar[0], bar[1]], 1, 1, [true, true])
)

const lc = solver.loadCases[0]
for (const top of ['E', 'F', 'G']) {
  lc.createNodalLoad(top, { [DofID.Dz]: 8e3 }) // 8 kN，向下
}
solver.solve()

for (const bar of members) {
  const n = bar.computeNormalForceAt(lc, 0) / 1e3
  console.log(bar.label, n.toFixed(2), n > 0 ? 'tension' : 'compression')
}
```

```text [输出]
AB 10.00 tension
BC 16.67 tension
CD 10.00 tension
EF -13.33 compression
FG -13.33 compression
AE -15.62 compression
EB 5.21 tension
BF -5.21 compression
FC -5.21 compression
CG 5.21 tension
GD -15.62 compression
```

杆的轴力沿杆长不变，所以在 `x = 0` 处读取就够了。两个字母的标签同时给出了两端节点：`bar[0]` 和 `bar[1]`。

## 手算核对 {#check-it-by-hand}

每个支座承担 24 kN 的一半，即 12 kN。按[截面法](/zh/tutorials/truss)把桁架截开，以被截杆件对面的节点为矩心取矩：

| 杆 | 截面 | 内力 |
| --- | --- | --- |
| BC，下弦杆 | 对 F 取矩：$(12 \cdot 4.5 - 8 \cdot 3)/1.8$ | 16.67 kN，受拉 |
| EF，上弦杆 | 对 B 取矩：$(12 \cdot 3 - 8 \cdot 1.5)/1.8$ | 13.33 kN，受压 |
| AE，端斜杆 | 节点 A：$12 \cdot \sqrt{1.5^2 + 1.8^2}/1.8$ | 15.62 kN，受压 |
| EB，斜杆 | 节间剪力 $12 - 8 = 4$ kN：$4 \cdot 2.343/1.8$ | 5.21 kN，受拉 |

截面不会改变静定桁架的杆件内力，只决定节点位移的大小。上图采用了另一种截面，即 EduBeam 应用中的截面，得到的内力相同。

## 任意节间数 {#any-number-of-panels}

要为习题或参数分析生成桁架，就在循环中逐个节间建立节点和杆件。`panels = 3` 时就是上面的桁架，打印出的内力也相同；修改 `panels`、`w` 和 `h` 可以得到其他桁架。

```ts [warren.ts]
import { type Beam2D, DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })
const lc = solver.loadCases[0]

const panels = 3 // 下弦节间数
const w = 3 // 节间长度，m
const h = 1.8 // 桁架高度，m

// 下弦节点 b0、b1……，两端为固定铰支座和滑动铰支座；上弦节点 t0、t1……位于其间
for (let i = 0; i <= panels; i++) {
  const ends = i === 0 ? [DofID.Dx, DofID.Dz] : i === panels ? [DofID.Dz] : []
  domain.createNode(`b${i}`, [i * w, 0, 0], ends)
}
for (let i = 0; i < panels; i++) {
  domain.createNode(`t${i}`, [(i + 0.5) * w, 0, -h])
  lc.createNodalLoad(`t${i}`, { [DofID.Dz]: 8e3 })
}

const members: Beam2D[] = []
const bar = (a: string, b: string) =>
  members.push(domain.createBeam2D(`${a}-${b}`, [a, b], 1, 1, [true, true]))
for (let i = 0; i < panels; i++) {
  bar(`b${i}`, `b${i + 1}`) // 下弦杆
  bar(`b${i}`, `t${i}`) // 上行斜杆
  bar(`t${i}`, `b${i + 1}`) // 下行斜杆
  if (i > 0) bar(`t${i - 1}`, `t${i}`) // 上弦杆
}
solver.solve()

for (const m of members) {
  console.log(m.label, (m.computeNormalForceAt(lc, 0) / 1e3).toFixed(2))
}
```

求解时间随模型规模增长很快：几十个节间没有问题，参见[模型规模](/zh/solver/solving#model-size)。要把生成的每个桁架画出来，无论带不带答案，参见 @edubeam/plot 的[习题与测验](/zh/plot/exercises)。

## 注意事项 {#things-to-notice}

- **每个杆端都设铰**。这样每个节点都可以自由转动，求解器给出的转角为 0。在这样的节点上施加力偶，就没有杆件能承担它，[求解会失败](/zh/solver/solving#when-solving-fails)。
- **荷载作用在节点上**。沿杆作用的荷载会使杆弯曲：这时它是梁而不是桁架杆，会有弯矩图。

[教程：平面桁架](/zh/tutorials/truss)在 EduBeam 应用中建立了一个桁架，[桁架单元](/zh/elements/truss)一页推导了杆的刚度。
