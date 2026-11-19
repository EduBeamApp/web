---
title: 梁
description: "悬臂梁和两跨连续梁的完整 @edubeam/fem 程序及其输出，每个结果都与教材公式核对过。"
order: 12
group: 示例程序
source: site
---

# 梁 {#beams}

两个完整的程序，可以直接复制、修改。两者都采用不计剪切变形的截面（`k: 1e32`），所以数值与 Euler–Bernoulli 梁的公式完全一致。在按[安装](/zh/solver/getting-started#install)一节准备好的文件夹中，用 `node cantilever.ts`（Node 22.18 及以上版本）运行即可。

## 悬臂梁 {#a-cantilever}

长 4 m，A 端固定，自由端作用 18 kN 向下的集中力：

```ts [cantilever.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // 固定端
const tip = domain.createNode('B', [4, 0, 0]) // 自由端
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
lc.createNodalLoad('B', { [DofID.Dz]: 18e3 }) // 自由端 18 kN，向下
solver.solve()

console.log(beam.computeBendingMomentAt(lc, 0)) // 固定端弯矩，N·m
console.log(tip.getUnknowns(lc, [DofID.Dz])) // 自由端挠度，m
```

```text [输出]
-72000
0.09411072715241528
```

$M_A = -FL = -72$ kNm，为负弯矩（上缘受拉）；自由端挠度为 $FL^3/3EI = 94.11$ mm，其中 $EI = 4.0803$ MNm²。同样的悬臂梁也是 EduBeam 应用中的一个示例。

## 连续梁 {#a-continuous-beam}

两跨各 5 m，支承在三个支座上，两跨都承受 10 kN/m。求支反力、中间支座处的弯矩和跨内最大弯矩：

```ts [continuous.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [5, 0, 0], [DofID.Dz])
domain.createNode('C', [10, 0, 0], [DofID.Dz])
const span1 = domain.createBeam2D(1, ['A', 'B'], 1, 1)
domain.createBeam2D(2, ['B', 'C'], 1, 1)

const lc = solver.loadCases[0]
for (const span of [1, 2]) {
  lc.createBeamElementUniformEdgeLoad(span, [0, 10e3], true)
}
solver.solve()

// getReactions 返回 mathjs Matrix 或数组：统一转为数组
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

for (const label of ['A', 'B', 'C']) {
  const { dofs, values } = domain.getNode(label).getReactions(lc)
  const rz = list(values)[dofs.indexOf(DofID.Dz)]
  console.log(`R${label} = ${(-rz / 1e3).toFixed(2)} kN up`)
}
const mB = span1.computeBendingMomentAt(lc, 5)
console.log(`MB = ${(mB / 1e3).toFixed(2)} kNm`)

// 第 1 跨的最大正弯矩，取自沿杆长的 501 个点
const { x, M } = span1.computeBendingMoment(lc, 500)
const i = M.indexOf(Math.max(...M))
console.log(`max M = ${(M[i] / 1e3).toFixed(2)} kNm at x = ${x[i]} m`)
```

```text [输出]
RA = 18.75 kN up
RB = 62.50 kN up
RC = 18.75 kN up
MB = -31.25 kNm
max M = 17.58 kNm at x = 1.87 m
```

等跨两跨连续梁的教材值为：$R_A = R_C = 0.375\,qL$，$R_B = 1.25\,qL$，$M_B = -qL^2/8$；跨内最大弯矩为 $R_A^2/2q = 17.58$ kNm，位于 $x = R_A/q = 1.875$ m 处。采样在网格点 1.87 m 处找到它，与真值相差不到 0.0002 kNm。

::model-figure{caption="两跨各 5 m，承受 10 kN/m"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels]
---
::

图中采用的是应用示例的截面，而不是 IPE 200。全梁截面相同时，连续梁的内力与刚度无关，所以内力图上的数值相同，只有挠度不同。

## 改一改 {#change-it}

- **不等跨或不同荷载**：修改 C 的坐标或荷载列表。只在一跨上加载，就得到熟悉的最不利活荷载布置。
- **三跨**：增加节点 D 和杆件 `['C', 'D']`。
- **固定端**：把 A 的约束改为 `[DofID.Dx, DofID.Dz, DofID.Ry]`。
- **考虑实际的剪切变形**：矩形截面取 `k: 5 / 6`，或取你所用截面的剪切系数。
- **画成图**：把求解器交给 [@edubeam/plot](/zh/solver/drawing)。

[教程：连续梁与支座沉降](/zh/tutorials/continuous-beam)在 EduBeam 应用中建立了类似的梁，[手算校核结果](/zh/guide/verification)一页给出了更多附公式的教材算例。
