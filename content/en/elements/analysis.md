---
description: "The direct stiffness method as EduBeam runs it, worked by hand on a propped cantilever: DOF numbering, assembly, supports, reactions and member results."
source: site
---

# How EduBeam solves a model

Every time you change the model, EduBeam solves it again with the **direct stiffness method**, in your browser, in a few milliseconds. This page follows the solver [@edubeam/fem](/solver) step by step on a small example, so you can reproduce each number by hand and know why the results can be trusted.

The example is a propped cantilever: an IPE 300 in steel, 4 m long, fixed at A, on a roller at B, under 10 kN/m. Its stiffness is $EI = 210 \text{ GPa} \times 8356 \text{ cm}^4 = 17\,548$ kNm² and, without shear deformation, the textbook answers are $M_A = -qL^2/8 = -20$ kNm, $R_B = 3qL/8 = 15$ kN and $\varphi_B = qL^3/(48EI)$.

::model-figure{caption="Propped cantilever, IPE 300, 10 kN/m: M = −20 kNm at A and +11.25 kNm at 2.5 m, reactions 25 kN and 15 kN"}
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

## From model to displacements

::div{.steps}
### Number the degrees of freedom

Every node gets the DOFs its elements need. All elements are [beam elements](/elements/beam), so every node has `Dx`, `Dz` and `Ry`. The solver numbers the **free** DOFs first and the **supported** ones after them, node by node. Here A is fixed and B is held only vertically, so two DOFs are free:

$$
\begin{gathered}
\mathbf{r} = \begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix},
\qquad
\mathbf{r}_u = \begin{bmatrix} u_B \\ \varphi_B \end{bmatrix}, \\[1ex]
\mathbf{r}_p = \begin{bmatrix} u_A & w_A & \varphi_A & w_B \end{bmatrix}^\mathsf{T}.
\end{gathered}
$$

$u$, $w$ and $\varphi$ are the displacements along x and z and the rotation, as in the [DOF table](/elements/conventions#degrees-of-freedom). Each element keeps a **location array**: the positions of its six DOFs in $\mathbf{r}$. Counting from 1, the beam's DOFs $(u_A, w_A, \varphi_A, u_B, w_B, \varphi_B)$ sit at positions $(3, 4, 5, 1, 6, 2)$.

### Compute the element matrices

For each element the solver builds the [local stiffness matrix](/elements/beam#local-stiffness-matrix), condenses any [end hinges](/elements/beam#end-hinges) and turns it into global axes, $\mathbf{K}_g = \mathbf{T}^\mathsf{T}\mathbf{K}_l\,\mathbf{T}$. Each element load becomes [equivalent nodal loads](/elements/beam#element-loads), $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. Our beam is horizontal, so $\mathbf{T}$ is the identity, and the uniform load gives, in kN and kNm,

$$
\mathbf{f}_\mathrm{eq} = \begin{bmatrix} 0 \\[0.5ex] qL/2 \\[0.5ex] -qL^2/12 \\[0.5ex] 0 \\[0.5ex] qL/2 \\[0.5ex] qL^2/12 \end{bmatrix}
= \begin{bmatrix} 0 \\[0.5ex] 20 \\[0.5ex] -13.33 \\[0.5ex] 0 \\[0.5ex] 20 \\[0.5ex] 13.33 \end{bmatrix}.
$$

### Assemble

The global stiffness matrix $\mathbf{K}$ starts as zeros. Each element adds its entry $(i, j)$ to the row and column its location array gives for $i$ and $j$, so where several elements meet at a node, their stiffnesses for that node's DOFs add up. The load vector $\mathbf{F}$ collects the nodal loads and the equivalent nodal loads the same way. Prescribed displacements (settlements) go into $\mathbf{r}_p$. Ordered free-then-supported, the system splits into blocks:

$$
\begin{bmatrix} \mathbf{K}_{uu} & \mathbf{K}_{up} \\ \mathbf{K}_{pu} & \mathbf{K}_{pp} \end{bmatrix}
\begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix}
=
\begin{bmatrix} \mathbf{F}_u \\ \mathbf{F}_p + \mathbf{R} \end{bmatrix},
$$

where $\mathbf{R}$ are the unknown reactions. In the example only the end-B rows and columns of the beam fall into $\mathbf{K}_{uu}$:

$$
\begin{aligned}
\mathbf{K}_{uu} &= \begin{bmatrix} EA/L & 0 \\ 0 & 4EI/L \end{bmatrix} \\[1ex]
&= \begin{bmatrix} 282\,450 \text{ kN/m} & 0 \\ 0 & 17\,548 \text{ kNm} \end{bmatrix}, \\[1ex]
\mathbf{F}_u &= \begin{bmatrix} 0 \\ 13.33 \text{ kNm} \end{bmatrix}.
\end{aligned}
$$

### Apply the supports and solve

Supports are not springs or large numbers on the diagonal: the supported DOFs are simply split off. The free displacements follow from

$$
\mathbf{K}_{uu}\,\mathbf{r}_u = \mathbf{F}_u - \mathbf{K}_{up}\,\mathbf{r}_p,
$$

solved by LU decomposition. With no settlements $\mathbf{r}_p = \mathbf{0}$, and here

$$
\varphi_B = \frac{13.33}{17\,548} = 7.598 \times 10^{-4} \text{ rad},
$$

which is the textbook $qL^3/(48EI)$, and $u_B = 0$.

### Compute the reactions

With all displacements known, the supported rows give the reactions, the forces the supports exert on the structure:

$$
\mathbf{R} = \mathbf{K}_{pu}\,\mathbf{r}_u + \mathbf{K}_{pp}\,\mathbf{r}_p - \mathbf{F}_p.
$$

For $w_A$ the row of $\mathbf{K}_{pu}$ holds $-6EI/L^2$ under $\varphi_B$, and $\mathbf{F}_p$ holds $qL/2$:

$$
\begin{aligned}
R_{wA} &= -\frac{6EI}{L^2}\,\varphi_B - \frac{qL}{2} \\
&= -5 - 20 = -25 \text{ kN},
\end{aligned}
$$

which is 25 kN upward (z points down). In the same way $R_{\varphi A} = +20$ kNm and $R_{wB} = -15$ kN: the textbook $qL^2/8$ and $3qL/8$.
::

## Results along the members {#results-along-the-members}

For each element, the solver takes its end displacements out of $\mathbf{r}$, turns them into local axes, $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, and computes the [end forces](/elements/conventions#end-forces-element-results-table)

$$
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix}.
$$

For the example, $\mathbf{d}_l = [0,\ 0,\ 0,\ 0,\ 0,\ \varphi_B]^\mathsf{T}$ gives $Z_{12} = -25$ kN, $M_{12} = 20$ kNm, $Z_{21} = -15$ kN and $M_{21} = 0$.

The internal forces at any $x$ then follow from equilibrium of the piece of the element between its start and $x$: the forces at its start plus the load on that piece.

$$
\begin{aligned}
N(x) &= -X_{12} + N_q(x), \\
V(x) &= -Z_{12} + V_q(x), \\
M(x) &= -M_{12} - Z_{12}\,x + M_q(x),
\end{aligned}
$$

where $N_q$, $V_q$ and $M_q$ come from the loads on that piece. For a uniform load $q_z$, a trapezoidal load from $q_1$ to $q_2$ (with $\Delta q = q_2 - q_1$), and a force $F_z$ or moment $M_y$ at the distance $a$, which act only for $x \ge a$:

$$
\begin{array}{l|cc}
\text{Load} & V_q(x) & M_q(x) \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -q_z\,x & -\dfrac{q_z\,x^2}{2} \\[3ex]
q_1 \to q_2 & -q_1 x - \dfrac{\Delta q\,x^2}{2L} & -\dfrac{q_1 x^2}{2} - \dfrac{\Delta q\,x^3}{6L} \\[3ex]
F_z,\ M_y & -F_z & -F_z\,(x-a) - M_y
\end{array}
$$

$N_q$ is $V_q$ with the axial components $q_x$ and $F_x$ in place of $q_z$ and $F_z$.

For the example, $M(x) = -20 + 25\,x - 5\,x^2$ kNm, largest at $x = 2.5$ m with $11.25$ kNm $= 9qL^2/128$. A temperature load has no term of its own: it acts only through the end forces.

The deflection is the [shape functions](/elements/beam#local-stiffness-matrix) times the end displacements, plus the deflection of the load on the element with both ends clamped. A hinged end first gets its own rotation back from the [condensation](/elements/beam#end-hinges). The diagrams and the deformed shape are these functions, evaluated along each member.

## Why the results are exact {#exact}

Each step above is exact for the model it solves:

- The element stiffness comes from the **exact solution** of a prismatic Timoshenko member, not from assumed polynomial shapes, so it is the member's true stiffness.
- The fixed-end forces are the exact clamped solutions for each load type, so the equivalent nodal loads lose nothing.
- The nodal displacements are therefore exact, and the internal forces between the nodes come from equilibrium of the actual load, so they are exact too.

That is why EduBeam never asks you to refine a mesh: one element per member gives the same answer as a hundred. Nodes are needed only where the member itself changes: at a support, a hinge, a corner or a change of section. A point load between them can stay an element load. The only error left is floating-point round-off; the result tables show values below $10^{-12}$ of the largest value of their kind as 0.

"Exact" refers to the model, which has its limits:

::div{.limits}
- **Linear elastic material** and **small displacements**: equilibrium is written on the undeformed shape, so there are no second-order (P–Δ) effects or buckling.
- **Straight, prismatic members**: one cross section per element. A tapered member has to be approximated by several elements.
- **Bending in the x–z plane only**: no torsion and no out-of-plane behaviour.
::

## When the structure cannot stand {#mechanisms}

A structure that can move without deforming has a singular stiffness matrix and no unique solution. EduBeam looks for that before it solves, and checks the answer after:

1. **Before solving**, every connected part of the structure is checked on its geometry alone. Its supports must stop the three rigid-body motions of a plane body: fewer than three restraints means the model is simply not finished (*The structure needs supports before it can be solved.*), while three or more that still let it slide or turn, such as parallel rollers, are an error. Then the hinges are checked: if the members can turn about them while every member keeps its length, the structure is a mechanism, and EduBeam circles the hinges and shows the motion.
2. **While solving**, an exactly singular matrix stops the LU decomposition: *Structure is a mechanism: the stiffness matrix is singular.*
3. **After solving**, a displacement or rotation larger than $10^6$ m or rad means the matrix was singular in all but round-off. EduBeam names the nodes and directions that move: *Structure is unstable: … moves practically without resistance.* A material or cross section entered as zero, or in the wrong unit, ends up here too.

A rotation that nothing is connected to, at a node where every member is hinged, is not a mechanism: the solver leaves it at zero. [Troubleshooting](/reference/troubleshooting#no-results-are-drawn) explains every message and how to fix it.

## Run the solver yourself {#library}

The solver is open source: [@edubeam/fem](/solver), in TypeScript, for the browser and Node. The same propped cantilever:

```ts
import { DofID, LinearStaticSolver, type Beam2D } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]

// SI units: m, N, Pa. Steel, IPE 300; k = 1e32 makes it shear-rigid.
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // fixed
domain.createNode('B', [4, 0, 0], [DofID.Dz]) // roller
domain.createBeam2D('1', ['A', 'B'], 1, 1)
lc.createBeamElementUniformEdgeLoad('1', [0, 10_000], true) // 10 kN/m, down

solver.solve()

solver.neq // 2: Dx and Ry of B are free
lc.r.toArray() // [0, 0.0007598, 0, 0, 0, 0]: free DOFs, then supported
lc.R.toArray() // [0, -25000, 20000, -15000]: A (Dx, Dz, Ry), then B (Dz)

const beam = domain.getElement('1') as Beam2D
beam.computeEndForces(lc).toArray() // [0, -25000, 20000, 0, -15000, 0]
beam.computeBendingMomentAt(lc, 0) // -20000: N·m, hogging at the wall
beam.computeBendingMomentAt(lc, 2.5) // 11250: the largest sagging moment
```

After `solve()`, `solver.k` holds the assembled matrix $\mathbf{K}$ and `solver.f` the load vector $\mathbf{F}$, to compare with your own assembly. The steps on this page live in `Solver.ts` (numbering), `LinearStaticSolver.ts` (assembly, solution, reactions) and `Beam2D.ts` (element matrices and results).

::div{.actions}
[Get started with @edubeam/fem](/solver/getting-started) [What's in it](/solver/reference) [Source on GitHub ↗](https://github.com/EduBeamApp/fem){target="_blank"}
::
