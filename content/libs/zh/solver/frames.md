---
title: 刚架
description: "三铰刚架的完整 @edubeam/fem 程序：柱、刚接角点和顶铰，结果经手算核对。"
order: 13
source: site
---

# 刚架 {#frames}

刚架由梁和柱在角点处刚性连接而成。本示例用代码建立[教程：三铰刚架](/zh/tutorials/three-hinged-frame)中的刚架：两根 4 m 高的柱，柱脚 A 和 E 为固定铰支座；一根 8 m 长的横梁，C 处有铰；横梁上作用 10 kN/m。教程中节点编号为 1 到 5，这里用 A 到 E。

::model-figure{caption="下面程序中的刚架：A、E 为固定铰支座，C 处有铰，10 kN/m"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, k: 1e32 }) // IPE 300

// z 轴朝下：4 m 高柱的柱顶位于 z = -4
const pin = [DofID.Dx, DofID.Dz]
domain.createNode('A', [0, 0, 0], pin)
domain.createNode('B', [0, 0, -4])
domain.createNode('C', [4, 0, -4]) // 顶铰
domain.createNode('D', [8, 0, -4])
domain.createNode('E', [8, 0, 0], pin)

const column = domain.createBeam2D(1, ['A', 'B'], 1, 1) // 从下向上
const left = domain.createBeam2D(2, ['B', 'C'], 1, 1, [false, true]) // C 处铰接
domain.createBeam2D(3, ['C', 'D'], 1, 1)
domain.createBeam2D(4, ['D', 'E'], 1, 1)

const lc = solver.loadCases[0]
for (const half of [2, 3]) {
  lc.createBeamElementUniformEdgeLoad(half, [0, 10e3], false)
}
solver.solve()

// getReactions 返回 mathjs Matrix 或数组：统一转为数组
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()
const kN = (v: number) => (v / 1e3).toFixed(2)

for (const label of ['A', 'E']) {
  const [rx, rz] = list(domain.getNode(label).getReactions(lc).values)
  console.log(`${label}: Rx = ${kN(rx)} kN, Rz = ${kN(rz)} kN`)
}
for (const x of [0, 2, 4]) {
  const m = left.computeBendingMomentAt(lc, x)
  console.log(`M at ${x} m from B = ${kN(m)} kNm`)
}
const top = column.computeBendingMomentAt(lc, 4)
console.log(`M at the top of column 1 = ${kN(top)} kNm`)
```

```text [输出]
A: Rx = 20.00 kN, Rz = -40.00 kN
E: Rx = -20.00 kN, Rz = -40.00 kN
M at 0 m from B = -80.00 kNm
M at 2 m from B = -20.00 kNm
M at 4 m from B = 0.00 kNm
M at the top of column 1 = -80.00 kNm
```

## 手算核对 {#check-it-by-hand}

| 物理量 | 手算 | 求解器 |
| --- | --- | --- |
| 竖向支反力 | $q \cdot 8/2 = 40$ kN，向上 | A 和 E 处 $R_z = -40$ kN |
| 水平支反力 | 由左半部分 $M_C = 0$：$(40 \cdot 4 - 10 \cdot 4 \cdot 2)/4 = 20$ kN，指向刚架内侧 | A 处 $R_x = +20$ kN，E 处 $-20$ kN |
| 角点弯矩 | $-20 \cdot 4 = -80$ kNm | 横梁和柱中均为 $-80$ kNm |
| 距 B 2 m 处的弯矩 | $-80 + 40 \cdot 2 - 10 \cdot 2^2/2 = -20$ kNm | $-20$ kNm |
| 铰处弯矩 | 0 | 0 |

## 注意事项 {#things-to-notice}

- **柱向上延伸，所以 z 为负**。柱顶位于 $z = -4$。
- **柱的局部坐标轴**。杆件 1 从 A 向上到 B，所以它的局部 z 轴朝右，指向刚架内侧。柱顶弯矩为 −80 kNm，与横梁在角点处的弯矩相同：外侧受拉。如果柱从 B 向下定义到 A，局部 z 轴就朝左：弯矩变号，`x` 也从柱顶算起。参见[杆件方向](/zh/solver/conventions#member-direction)。
- **一个铰，一个杆端**。铰设在杆件 2 位于 C 的一端；杆件 3 在 C 处的起始端为刚接。释放一个杆端就足以使 C 成为铰。
- **横梁上的整体坐标荷载**。`false` 表示荷载按整体坐标给出：无论杆件倾角如何都竖向作用。对从左向右画的水平梁，这与局部坐标相同。

## 超静定刚架 {#statically-indeterminate-frames}

去掉铰，即 `[false, false]`，刚架就成为具有一个多余约束的门式刚架。这时它的内力取决于横梁与柱的相对刚度：给杆件不同的截面就能看出来。教程的[动手试试](/zh/tutorials/three-hinged-frame#_7-experiment)一节把柱脚改为固定端，并施加侧向荷载，附有可供核对的数值。@edubeam/plot 的[幻灯片与讲义](/zh/plot/slides)一页逐步绘制了这样一个门式刚架。
