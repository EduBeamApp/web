---
description: "EduBeam 采用的矩阵位移法，以一端固定一端简支梁为例逐步手算：自由度编号、集成、支座条件、支反力和杆件内力。"
source: site
---

# EduBeam 如何求解模型

每次修改模型，EduBeam 都会在浏览器中用**矩阵位移法**（直接刚度法）重新求解，只需几毫秒。本页用一个小例子，一步步跟着求解器 [@edubeam/fem](/zh/solver) 计算，你可以手算复现每一个数，也能明白结果为什么可信。

例题是一根一端固定一端简支梁：钢制 IPE 300，长 4 m，A 端固定，B 端为滑动铰支座，承受 10 kN/m 的均布荷载。其抗弯刚度为 $EI = 210 \text{ GPa} \times 8356 \text{ cm}^4 = 17\,548$ kNm²；不计剪切变形时，教材给出的答案是 $M_A = -qL^2/8 = -20$ kNm，$R_B = 3qL/8 = 15$ kN，$\varphi_B = qL^3/(48EI)$。

::model-figure{caption="一端固定一端简支梁，IPE 300，10 kN/m：A 处 M = −20 kNm，2.5 m 处 +11.25 kNm，支反力 25 kN 和 15 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
section: { a: 53.8e-4, iy: 8.356e-5, h: 0.3 }
results: [M, V, w]
show: [nodeLabels]
---
::

## 从模型到位移 {#from-model-to-displacements}

::div{.steps}
### 自由度编号 {#number-the-degrees-of-freedom}

每个节点具有与它相连的单元所需的自由度。本例中所有单元都是[梁单元](/zh/elements/beam)，所以每个节点都有 `Dx`、`Dz` 和 `Ry`。求解器先给所有**未约束**的自由度编号，再给**受约束**的自由度编号，两类都按节点逐个编排。这里 A 为固定端，B 只约束竖向位移，因此只有两个未约束的自由度：

$$
\begin{gathered}
\mathbf{r} = \begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix},
\qquad
\mathbf{r}_u = \begin{bmatrix} u_B \\ \varphi_B \end{bmatrix}, \\[1ex]
\mathbf{r}_p = \begin{bmatrix} u_A & w_A & \varphi_A & w_B \end{bmatrix}^\mathsf{T}.
\end{gathered}
$$

$u$、$w$ 和 $\varphi$ 分别是沿 x 轴、沿 z 轴的位移和转角，与[自由度表](/zh/elements/conventions#degrees-of-freedom)中相同。每个单元都有一个**定位向量**，记录它的六个自由度在 $\mathbf{r}$ 中的位置。从 1 开始计数，梁的自由度 $(u_A, w_A, \varphi_A, u_B, w_B, \varphi_B)$ 依次位于第 $(3, 4, 5, 1, 6, 2)$ 位。

### 计算单元矩阵 {#compute-the-element-matrices}

求解器为每个单元建立[局部刚度矩阵](/zh/elements/beam#local-stiffness-matrix)，若有[端部铰接](/zh/elements/beam#end-hinges)则先进行静力凝聚，再转换到整体坐标系：$\mathbf{K}_g = \mathbf{T}^\mathsf{T}\mathbf{K}_l\,\mathbf{T}$。每个单元荷载都转换为[等效节点荷载](/zh/elements/beam#element-loads) $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$。本例的梁是水平的，$\mathbf{T}$ 为单位矩阵，均布荷载的等效节点荷载为（单位 kN 和 kNm）

$$
\mathbf{f}_\mathrm{eq} = \begin{bmatrix} 0 \\[0.5ex] qL/2 \\[0.5ex] -qL^2/12 \\[0.5ex] 0 \\[0.5ex] qL/2 \\[0.5ex] qL^2/12 \end{bmatrix}
= \begin{bmatrix} 0 \\[0.5ex] 20 \\[0.5ex] -13.33 \\[0.5ex] 0 \\[0.5ex] 20 \\[0.5ex] 13.33 \end{bmatrix}.
$$

### 集成 {#assemble}

整体刚度矩阵 $\mathbf{K}$ 的初值为零矩阵。每个单元把它的元素 $(i, j)$ 累加到定位向量为 $i$ 和 $j$ 指定的行和列上，因此几个单元交于同一节点时，它们在该节点自由度上的刚度相互叠加。荷载向量 $\mathbf{F}$ 以同样的方式汇集节点荷载和等效节点荷载。给定位移（支座沉降）放入 $\mathbf{r}_p$。按先未约束、后受约束的顺序排列，方程组可分块写成：

$$
\begin{bmatrix} \mathbf{K}_{uu} & \mathbf{K}_{up} \\ \mathbf{K}_{pu} & \mathbf{K}_{pp} \end{bmatrix}
\begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix}
=
\begin{bmatrix} \mathbf{F}_u \\ \mathbf{F}_p + \mathbf{R} \end{bmatrix},
$$

其中 $\mathbf{R}$ 是未知的支反力。本例中，只有梁 B 端对应的行和列进入 $\mathbf{K}_{uu}$：

$$
\begin{aligned}
\mathbf{K}_{uu} &= \begin{bmatrix} EA/L & 0 \\ 0 & 4EI/L \end{bmatrix} \\[1ex]
&= \begin{bmatrix} 282\,450 \text{ kN/m} & 0 \\ 0 & 17\,548 \text{ kNm} \end{bmatrix}, \\[1ex]
\mathbf{F}_u &= \begin{bmatrix} 0 \\ 13.33 \text{ kNm} \end{bmatrix}.
\end{aligned}
$$

### 引入支座条件并求解 {#apply-the-supports-and-solve}

支座既不用弹簧模拟，也不靠在对角线上置大数：受约束的自由度直接分离出去。未约束的位移由下式求得

$$
\mathbf{K}_{uu}\,\mathbf{r}_u = \mathbf{F}_u - \mathbf{K}_{up}\,\mathbf{r}_p,
$$

用 LU 分解求解。没有支座沉降时 $\mathbf{r}_p = \mathbf{0}$，本例中

$$
\varphi_B = \frac{13.33}{17\,548} = 7.598 \times 10^{-4} \text{ rad},
$$

正是教材中的 $qL^3/(48EI)$，且 $u_B = 0$。

### 计算支反力 {#compute-the-reactions}

所有位移求出后，由受约束自由度对应的各行求得支反力，即支座作用在结构上的力：

$$
\mathbf{R} = \mathbf{K}_{pu}\,\mathbf{r}_u + \mathbf{K}_{pp}\,\mathbf{r}_p - \mathbf{F}_p.
$$

对 $w_A$，$\mathbf{K}_{pu}$ 中相应行在 $\varphi_B$ 列的元素为 $-6EI/L^2$，$\mathbf{F}_p$ 中相应元素为 $qL/2$：

$$
\begin{aligned}
R_{wA} &= -\frac{6EI}{L^2}\,\varphi_B - \frac{qL}{2} \\
&= -5 - 20 = -25 \text{ kN},
\end{aligned}
$$

即向上 25 kN（z 轴向下）。同样可得 $R_{\varphi A} = +20$ kNm，$R_{wB} = -15$ kN，正是教材中的 $qL^2/8$ 和 $3qL/8$。
::

## 沿杆长的内力与挠度 {#results-along-the-members}

对每个单元，求解器从 $\mathbf{r}$ 中取出它的杆端位移，转换到局部坐标系 $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$，再计算[单元端力](/zh/elements/conventions#end-forces-element-results-table)

$$
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix}.
$$

本例中，$\mathbf{d}_l = [0,\ 0,\ 0,\ 0,\ 0,\ \varphi_B]^\mathsf{T}$，得 $Z_{12} = -25$ kN，$M_{12} = 20$ kNm，$Z_{21} = -15$ kN，$M_{21} = 0$。

任一截面 $x$ 处的内力，取单元起点到 $x$ 之间的一段为隔离体，由平衡求得：起点处的力，加上这一段上的荷载。

$$
\begin{aligned}
N(x) &= -X_{12} + N_q(x), \\
V(x) &= -Z_{12} + V_q(x), \\
M(x) &= -M_{12} - Z_{12}\,x + M_q(x),
\end{aligned}
$$

其中 $N_q$、$V_q$ 和 $M_q$ 来自这一段上的荷载。对均布荷载 $q_z$、从 $q_1$ 到 $q_2$ 的梯形分布荷载（$\Delta q = q_2 - q_1$），以及距起点 $a$ 处的集中力 $F_z$ 或集中力偶 $M_y$（只在 $x \ge a$ 时起作用）：

$$
\begin{array}{l|cc}
\text{荷载} & V_q(x) & M_q(x) \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -q_z\,x & -\dfrac{q_z\,x^2}{2} \\[3ex]
q_1 \to q_2 & -q_1 x - \dfrac{\Delta q\,x^2}{2L} & -\dfrac{q_1 x^2}{2} - \dfrac{\Delta q\,x^3}{6L} \\[3ex]
F_z,\ M_y & -F_z & -F_z\,(x-a) - M_y
\end{array}
$$

把 $V_q$ 中的 $q_z$ 和 $F_z$ 换成轴向分量 $q_x$ 和 $F_x$，就得到 $N_q$。

本例中，$M(x) = -20 + 25\,x - 5\,x^2$ kNm，在 $x = 2.5$ m 处最大，为 $11.25$ kNm $= 9qL^2/128$。温度荷载没有单独的项，它只通过单元端力起作用。

挠度等于[形函数](/zh/elements/beam#local-stiffness-matrix)乘以杆端位移，再加上单元两端固定时荷载引起的挠度。有铰的一端，先按[静力凝聚](/zh/elements/beam#end-hinges)的公式恢复该端自己的转角。内力图和变形图就是沿每根杆件逐点计算这些函数画出来的。

## 结果为什么是精确的 {#exact}

对于所求解的模型，上面每一步都是精确的：

- 单元刚度来自等截面 Timoshenko 杆件的**精确解**，而不是假定的多项式位移形状，因此它就是杆件真实的刚度。
- 固端力是每种荷载作用下两端固定杆件的精确解，因此等效节点荷载没有任何损失。
- 于是节点位移是精确的；节点之间的内力由实际荷载的平衡求得，所以也是精确的。

所以 EduBeam 从不要求你加密网格：每根杆件用一个单元，与用一百个单元结果相同。只有在杆件本身发生变化的地方才需要节点：支座、铰、转折处或截面变化处。节点之间的集中荷载可以作为单元荷载。剩下的只有浮点舍入误差；结果表格中，小于同类最大值 $10^{-12}$ 倍的数值显示为 0。

这里的“精确”是相对于模型而言的，而模型有它的适用范围：

::div{.limits}
- **线弹性材料**和**小位移**：平衡方程按未变形的形状建立，因此不考虑二阶（P–Δ）效应和屈曲。
- **等截面直杆**：每个单元只有一个截面。变截面杆件需要用多个单元近似。
- **只在 x–z 平面内弯曲**：不考虑扭转和平面外的变形。
::

## 当结构几何可变时 {#mechanisms}

不发生变形就能运动的结构，刚度矩阵是奇异的，没有唯一解。EduBeam 在求解前先检查这一点，求解后再核对结果：

1. **求解前**，EduBeam 只按几何组成检查结构的每个连通部分。各部分的支座必须阻止它在平面内的三种刚体运动：约束少于三个，说明模型还没有建完（*结构需要支座才能求解。*）；有三个或更多约束却仍能滑动或转动（例如几个相互平行的滑动铰支座），则报错。接着检查铰：如果各杆件在长度不变的情况下就能绕铰转动，结构就是机构，EduBeam 会圈出这些铰并显示它如何运动。
2. **求解中**，矩阵恰好奇异时 LU 分解会中止：*结构为机构：刚度矩阵奇异。*
3. **求解后**，若位移或转角大于 $10^6$ m 或 rad，说明矩阵除舍入误差外实际上是奇异的。EduBeam 会指出发生运动的节点和方向：*结构不稳定：以下自由度几乎没有抵抗即可运动：……。* 材料或截面参数输入为零，或单位用错，也会出现这种情况。

如果某节点处所有杆件都是铰接的，该节点的转角不与任何杆件相连，但这不算机构：求解器令它为零。[疑难解答](/zh/reference/troubleshooting#no-results-are-drawn)解释了每条提示信息及其解决办法。

## 自己运行求解器 {#library}

求解器是开源的：[@edubeam/fem](/zh/solver)，用 TypeScript 编写，可在浏览器和 Node 中运行。下面计算的是同一根一端固定一端简支梁：

```ts
import { DofID, LinearStaticSolver, type Beam2D } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]

// 国际单位制：m、N、Pa。钢，IPE 300；k = 1e32 表示不计剪切变形。
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // 固定端
domain.createNode('B', [4, 0, 0], [DofID.Dz]) // 滑动铰支座
domain.createBeam2D('1', ['A', 'B'], 1, 1)
lc.createBeamElementUniformEdgeLoad('1', [0, 10_000], true) // 10 kN/m，向下

solver.solve()

solver.neq // 2：B 的 Dx 和 Ry 未约束
lc.r.toArray() // [0, 0.0007598, 0, 0, 0, 0]：先未约束的自由度，后受约束的自由度
lc.R.toArray() // [0, -25000, 20000, -15000]：A（Dx、Dz、Ry），然后 B（Dz）

const beam = domain.getElement('1') as Beam2D
beam.computeEndForces(lc).toArray() // [0, -25000, 20000, 0, -15000, 0]
beam.computeBendingMomentAt(lc, 0) // -20000：N·m，固定端为负弯矩
beam.computeBendingMomentAt(lc, 2.5) // 11250：最大正弯矩
```

调用 `solve()` 之后，`solver.k` 中是集成后的矩阵 $\mathbf{K}$，`solver.f` 中是荷载向量 $\mathbf{F}$，可以与你自己集成的结果比较。本页各步骤的代码分别在 `Solver.ts`（自由度编号）、`LinearStaticSolver.ts`（集成、求解、支反力）和 `Beam2D.ts`（单元矩阵和结果）中。

::div{.actions}
[@edubeam/fem 快速入门](/zh/solver/getting-started) [API 参考](/zh/solver/reference) [GitHub 上的源代码 ↗](https://github.com/EduBeamApp/fem){target="_blank"}
::
