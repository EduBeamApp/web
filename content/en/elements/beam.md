---
description: "EduBeam's two-node Timoshenko beam element: exact stiffness matrix, shear deformation, end hinges by static condensation, fixed-end forces, transformation."
source: site
---

# Beam element

Every member in EduBeam, whether a beam, a column or a truss bar, is the same element: a straight two-node **Timoshenko beam** in the x–z plane with a constant cross section. This page gives its formulation exactly as the solver computes it, so you can rebuild any element matrix or load vector by hand and check it against the app. The signs are those of [Coordinate system & sign conventions](/elements/conventions), the code is `Beam2D.ts` in [@edubeam/fem](/solver), and [How EduBeam solves a model](/elements/analysis) shows how the elements come together into a solution.

## Degrees of freedom {#degrees-of-freedom}

Each node has three degrees of freedom (DOFs), so the element has six. In the element's [local axes](/elements/conventions#element-local-axes), each end displacement has a matching [end force](/elements/conventions#end-forces-element-results-table), the column of the *Element results* table:

::element-sketch{mode="dofs" caption="The beam element's six degrees of freedom, each drawn positive; the dashed line marks the bottom fibres (local +z)"}
::

| Direction | Start node (1) | End node (2) |
| --- | --- | --- |
| along local x | $u_1$ and `X12` | $u_2$ and `X21` |
| along local z, down for an element drawn left to right | $w_1$ and `Z12` | $w_2$ and `Z21` |
| rotation, counter-clockwise | $\varphi_1$ and `M12` | $\varphi_2$ and `M21` |

In this order they make up the element's displacement and force vectors:

$$
\begin{aligned}
\mathbf{d}_l &= \begin{bmatrix} u_1 & w_1 & \varphi_1 & u_2 & w_2 & \varphi_2 \end{bmatrix}^\mathsf{T}, \\
\mathbf{f} &= \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}.
\end{aligned}
$$

Because z points down and rotations are counter-clockwise, the axis of a beam without shear deformation turns by $\varphi = -\,\mathrm{d}w/\mathrm{d}x$.

## Local stiffness matrix {#local-stiffness-matrix}

The end forces of an element without element loads are $\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l$, with

$$
\mathbf{K}_l =
\begin{bmatrix}
 k_N & 0 & 0 & -k_N & 0 & 0 \\
 0 & k_1 & -k_2 & 0 & -k_1 & -k_2 \\
 0 & -k_2 & k_3 & 0 & k_2 & k_4 \\
 -k_N & 0 & 0 & k_N & 0 & 0 \\
 0 & -k_1 & k_2 & 0 & k_1 & k_2 \\
 0 & -k_2 & k_4 & 0 & k_2 & k_3
\end{bmatrix}
$$

and

$$
\begin{aligned}
k_N &= \frac{EA}{L}, & k_1 &= \frac{12\,EI_y}{(1+\Phi)\,L^3}, \\[1ex]
k_2 &= \frac{6\,EI_y}{(1+\Phi)\,L^2}, & k_3 &= \frac{(4+\Phi)\,EI_y}{(1+\Phi)\,L}, \\[1ex]
k_4 &= \frac{(2-\Phi)\,EI_y}{(1+\Phi)\,L}, & \Phi &= \frac{12\,EI_y}{k\,GA\,L^2}.
\end{aligned}
$$

$E$ and $G$ are the material's Young's and shear moduli, $A$ the area, $I_y$ the second moment of area about y, $k$ the cross section's **Shear coefficient** and $L$ the element's length. $\Phi$ is the **shear parameter**: it measures how flexible the member is in shear compared with bending, and grows as the member gets short and deep. With $\Phi = 0$ the terms are the familiar $12EI/L^3$, $6EI/L^2$, $4EI/L$ and $2EI/L$ of an Euler–Bernoulli beam. Axial and bending behaviour are uncoupled: $u_1$ and $u_2$ only meet $k_N$.

Textbooks with y up print $+6EI/L^2$ where this matrix has $-k_2$. Both describe the same stiffness; only the direction of the transverse displacement differs.

::callout{type="details" title="Where the matrix comes from: the exact shape functions"}
For a prismatic Timoshenko member without load, the equilibrium equations have an exact solution: $u$ linear in $x$, $w$ cubic and $\varphi$ quadratic. Written through the end displacements, with $\xi = x/L$, the deflection is

$$
w(\xi) = N_1\,w_1 + N_2\,\varphi_1 + N_3\,w_2 + N_4\,\varphi_2,
$$

$$
\begin{aligned}
N_1 &= \frac{(1-\xi)\,(1+\Phi+\xi-2\xi^2)}{1+\Phi}, \\[1ex]
N_2 &= -\frac{L\,\xi\,(1-\xi)\,(2+\Phi-2\xi)}{2\,(1+\Phi)}, \\[1ex]
N_3 &= \frac{\xi\,(\Phi+3\xi-2\xi^2)}{1+\Phi}, \\[1ex]
N_4 &= \frac{L\,\xi\,(1-\xi)\,(\Phi+2\xi)}{2\,(1+\Phi)}.
\end{aligned}
$$

For $\Phi = 0$ these are the cubic Hermite polynomials, $N_1 = 1 - 3\xi^2 + 2\xi^3$ and $N_2 = -L\,\xi(1-\xi)^2$, the minus sign coming from $\varphi = -w'$. The stiffness matrix holds the end forces these exact shapes need, so it is the exact stiffness of the member, not an approximation that improves with more elements. The solver draws the deformed shape with the same functions.
::

## Shear deformation: Timoshenko or Euler–Bernoulli? {#timoshenko-or-euler-bernoulli}

Whether the element deforms in shear depends only on $\Phi$, and so on the cross section's shear coefficient $k$: $kA$ is the area that carries shear. Each kind of section starts with its own $k$:

| Cross section | Shear coefficient $k$ |
| --- | --- |
| The starter model and the built-in examples | $10^{32}$, which makes $\Phi \approx 0$: Euler–Bernoulli |
| I-, H- and wide-flange sections from the library | $h\,t_w / A$: the web carries the shear |
| Rectangular hollow sections from the library | $2\,h\,t / A$: the two side walls |
| Rectangles and squares from the library | 0.833 |
| Circles from the library | 0.9 |
| Circular hollow sections from the library | 0.5 |
| Polygonal sections | 0.833 to start with |
| **Add cross section** dialog | 1 to start with |

For a slender member the difference is small. Under a uniform load, shear adds $0.8\,\Phi$ to the bending deflection at mid-span of a simply supported beam. With an IPE 200 in steel that is 1.2 % over 6 m but 11 % over 2 m. To switch shear deformation off, set $k$ to a very large number such as `1e32`. Unless they say otherwise, the live figures on this site use the shear-rigid example section, so they match hand calculations by Euler–Bernoulli theory. The one below does not:

::model-figure{caption="IPE 200 over 2 m with k = h·tw/A = 0.393: w = 0.5657 mm at mid-span, 11 % more than the 0.5106 mm of Euler–Bernoulli theory (Φ = 0.135)"}
---
nodes: { A: [0, 0], B: [2, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
material: { e: 210e9, g: 81e9 }
section: { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 }
results: [w, M]
---
::

## End hinges {#end-hinges}

A ticked [end hinge](/essentials/elements#end-hinges) makes the moment at that end of the element zero. The element's end rotation is then free, and the solver removes it by **static condensation**. Split the six DOFs into those kept, $a$, and the released end rotations, $b$:

$$
\begin{bmatrix} \mathbf{f}_a \\ \mathbf{0} \end{bmatrix}
=
\begin{bmatrix} \mathbf{K}_{aa} & \mathbf{K}_{ab} \\ \mathbf{K}_{ba} & \mathbf{K}_{bb} \end{bmatrix}
\begin{bmatrix} \mathbf{d}_a \\ \mathbf{d}_b \end{bmatrix}
+
\begin{bmatrix} \mathbf{f}_{\mathrm{fix},a} \\ \mathbf{f}_{\mathrm{fix},b} \end{bmatrix}.
$$

Here $\mathbf{f}_\mathrm{fix}$ are the fixed-end forces of the [element loads](#element-loads). The second row gives the rotation at the hinge,

$$
\mathbf{d}_b = -\mathbf{K}_{bb}^{-1}\left(\mathbf{K}_{ba}\,\mathbf{d}_a + \mathbf{f}_{\mathrm{fix},b}\right),
$$

and putting it into the first row leaves the condensed stiffness and fixed-end forces

$$
\begin{aligned}
\mathbf{K}^{*} &= \mathbf{K}_{aa} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}, \\
\mathbf{f}^{*}_\mathrm{fix} &= \mathbf{f}_{\mathrm{fix},a} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{f}_{\mathrm{fix},b}.
\end{aligned}
$$

The solver writes $\mathbf{K}^{*}$ back into a 6 × 6 matrix with zero rows and columns for the released rotations, so a hinged element is assembled exactly like any other. After the solution it recovers $\mathbf{d}_b$ from the formula above, and the deformed shape shows the kink at the hinge.

With a hinge at the end node, the bending part for $(w_1, \varphi_1, w_2)$ becomes

$$
\mathbf{K}^{*}_{w} = \frac{12\,EI_y}{(4+\Phi)\,L^3}
\begin{bmatrix} 1 & -L & -1 \\ -L & L^2 & L \\ -1 & L & 1 \end{bmatrix},
$$

which for $\Phi = 0$ is the classic $3EI/L^3$ stiffness of a propped member. With hinges at **both** ends nothing is left of the bending terms and only $EA/L$ remains: the element is a [truss bar](/elements/truss).

A hinge belongs to an element end, not to the node. If every element meeting at a node is hinged there, nothing is connected to the node's own rotation. The solver leaves it at zero, which is harmless, but a nodal moment applied at such a node has nothing to act on and makes the system singular.

## Element loads {#element-loads}

Loads along an element enter the solution as **equivalent nodal loads**, $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. The **fixed-end forces** $\mathbf{f}_\mathrm{fix}$ are the end forces that hold the loaded element with both ends clamped.

All formulas below are in local axes. A load entered in global axes (with **LCS** unticked) is first turned into local components with $c = \cos\theta$ and $s = \sin\theta$ of the element's [angle](#transformation-matrix),

$$
q_x = c\,\bar q_x + s\,\bar q_z, \qquad q_z = -s\,\bar q_x + c\,\bar q_z,
$$

where the bar marks the global components. Line loads act per metre of the element's own length. A rafter from $(0, 0)$ to $(3, -4)$, for example, has $L = 5$ m, $c = 0.6$ and $s = -0.8$ (it rises, so $z$ decreases). A gravity load $\bar q_z = 10$ kN/m on it has $q_x = -8$ kN/m, down the slope, and $q_z = 6$ kN/m across it, and the rafter carries $10 \times 5 = 50$ kN in all, not $10 \times 3$.

In the tables:

- $q_z$, $q_x$: a uniform load; $q_1 \to q_2$: a trapezoidal load, $q_1$ at the start node and $q_2$ at the end node.
- $F_z$, $F_x$, $M_y$: a force or moment at the distance $a$ from the start node, with $b = L - a$.
- $\Delta T = \Delta T_b - \Delta T_t$: the bottom fibres warmer than the top ones; $\Delta T_c$: the axis warmer. $\alpha$ is the material's coefficient of thermal expansion and $h$ the section's **Height**.

Across the axis (z components) and for $\Phi = 0$, at the start node:

$$
\begin{array}{l|cc}
\text{Load} & Z_{12} & M_{12} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & \dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(7q_1+3q_2)}{20} & \dfrac{L^2\,(3q_1+2q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,b^2\,(3a+b)}{L^3} & \dfrac{F_z\,a\,b^2}{L^2} \\[3ex]
M_y & -\dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,b\,(b-2a)}{L^2} \\[3ex]
\Delta T & 0 & \dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

At the end node:

$$
\begin{array}{l|cc}
\text{Load} & Z_{21} & M_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & -\dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(3q_1+7q_2)}{20} & -\dfrac{L^2\,(2q_1+3q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,a^2\,(a+3b)}{L^3} & -\dfrac{F_z\,a^2\,b}{L^2} \\[3ex]
M_y & \dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,a\,(a-2b)}{L^2} \\[3ex]
\Delta T & 0 & -\dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

Along the axis (x components), for any $\Phi$:

$$
\begin{array}{l|cc}
\text{Load} & X_{12} & X_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_x & -\dfrac{q_x L}{2} & -\dfrac{q_x L}{2} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(2q_1+q_2)}{6} & -\dfrac{L\,(q_1+2q_2)}{6} \\[3ex]
F_x & -\dfrac{F_x\,b}{L} & -\dfrac{F_x\,a}{L} \\[3ex]
\Delta T_c & EA\,\alpha\,\Delta T_c & -EA\,\alpha\,\Delta T_c
\end{array}
$$

::callout{type="details" title="Fixed-end forces with shear deformation"}
The uniform load and the temperature load give the same fixed-end forces for any $\Phi$. For the others, with $D = 1 + \Phi$ and $\Delta q = q_2 - q_1$ (the z components):

$$
\begin{aligned}
&\text{Trapezoidal:} \\
Z_{12} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(9+10\Phi)}{60\,D}, \\[1ex]
M_{12} &= \frac{q_1 L^2}{12} + \frac{\Delta q\,L^2\,(4+5\Phi)}{120\,D}, \\[1ex]
Z_{21} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(21+20\Phi)}{60\,D}, \\[1ex]
M_{21} &= -\frac{q_1 L^2}{12} - \frac{\Delta q\,L^2\,(6+5\Phi)}{120\,D}; \\[3ex]
&\text{Force } F_z\text{:} \\
Z_{12} &= -\frac{F_z\,b\,(\Phi L^2 + 3ab + b^2)}{D\,L^3}, \\[1ex]
M_{12} &= \frac{F_z\,a\,b\,(\Phi L + 2b)}{2\,D\,L^2}, \\[1ex]
Z_{21} &= -\frac{F_z\,a\,(\Phi L^2 + a^2 + 3ab)}{D\,L^3}, \\[1ex]
M_{21} &= -\frac{F_z\,a\,b\,(\Phi L + 2a)}{2\,D\,L^2}; \\[3ex]
&\text{Moment } M_y\text{:} \\
Z_{12} &= -\frac{6\,a\,b\,M_y}{D\,L^3}, \qquad Z_{21} = \frac{6\,a\,b\,M_y}{D\,L^3}, \\[1ex]
M_{12} &= -\frac{M_y\,b\,(\Phi L - 2a + b)}{D\,L^2}, \\[1ex]
M_{21} &= -\frac{M_y\,a\,(\Phi L + a - 2b)}{D\,L^2}.
\end{aligned}
$$

They are the exact solutions of a clamped Timoshenko member, and so is the deflection the solver adds between the nodes for each load.
::

On a hinged element the fixed-end forces are condensed to $\mathbf{f}^{*}_\mathrm{fix}$, as in [End hinges](#end-hinges). A uniform load on an element with a hinge at its end node, for example, gives $Z_{12} = -5q_zL/8$, $M_{12} = q_zL^2/8$, $Z_{21} = -3q_zL/8$ and $M_{21} = 0$ (for $\Phi = 0$): the fixed-end forces of a propped cantilever.

After the solution, the internal forces along the element follow from its end forces and the statics of the load on it, and the deflection from the shape functions plus the clamped deflection of the load: see [Results along the members](/elements/analysis#results-along-the-members).

## Transformation matrix {#transformation-matrix}

An element at the angle $\theta$, measured from global x toward global z (clockwise on screen), has

$$
c = \cos\theta = \frac{x_2 - x_1}{L}, \qquad s = \sin\theta = \frac{z_2 - z_1}{L},
$$

and its local end displacements follow from the global ones as $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, with

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 & 0 & 0 \\
 -s & c & 0 & 0 & 0 & 0 \\
 0 & 0 & 1 & 0 & 0 & 0 \\
 0 & 0 & 0 & c & s & 0 \\
 0 & 0 & 0 & -s & c & 0 \\
 0 & 0 & 0 & 0 & 0 & 1
\end{bmatrix}.
$$

Rotations are the same in both systems. If a node has a **Nodal LCS angle** $\beta$ (an [inclined support](/essentials/nodes-supports#inclined-skewed-supports)), its unknowns $\mathbf{d}_n$ are in its own axes, turned by $\beta$ from global x toward global z. Their global components are

$$
\mathbf{d}_g = \mathbf{T}_n\,\mathbf{d}_n, \qquad
\mathbf{T}_n = \begin{bmatrix} \cos\beta & -\sin\beta & 0 \\ \sin\beta & \cos\beta & 0 \\ 0 & 0 & 1 \end{bmatrix}
$$

for that node's three DOFs. The solver multiplies $\mathbf{T}$ on the right by the block-diagonal matrix of the two end nodes' $\mathbf{T}_n$ (the identity for a node without its own axes), so the element connects to each node in that node's axes.

## Global stiffness matrix {#global-stiffness-matrix}

In global axes, the element's stiffness matrix and equivalent nodal loads are

$$
\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T},
\qquad
\mathbf{f}_{\mathrm{eq},g} = \mathbf{T}^\mathsf{T}\,\mathbf{f}_\mathrm{eq},
$$

with $\mathbf{K}_l$ and $\mathbf{f}_\mathrm{eq}$ already condensed if the element has hinges. $\mathbf{K}_g$ is what the **Stiffness matrix** window shows for an element (open it from the *Elements* table or the element's context menu), in SI units: N/m, N and N·m. [How EduBeam solves a model](/elements/analysis) assembles these matrices and solves a small example by hand.
