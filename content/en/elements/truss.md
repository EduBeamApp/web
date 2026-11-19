---
description: "The truss bar in EduBeam: a beam element hinged at both ends, why that is exactly the classic truss element, its stiffness and transformation matrices."
source: site
---

# Truss element

A truss bar carries axial force only. EduBeam has no separate truss element: a truss bar is a [beam element](/elements/beam) with **both end hinges** ticked. This page shows why that is exactly the classic two-node truss element, gives its stiffness and transformation matrices, and explains what a hinged bar can do that a textbook truss bar cannot.

::model-figure{caption="Every bar hinged at both ends: the rafters carry N = −7.071 kN, the tie +5 kN, and no bar bends"}
---
nodes: { A: [0, 0], B: [6, 0], C: [3, -3] }
supports: { A: pin, B: roller }
members:
  - { nodes: [A, C], hinges: [true, true] }
  - { nodes: [C, B], hinges: [true, true] }
  - { nodes: [A, B], hinges: [true, true] }
loads:
  - { node: C, fz: 10 }
results: [N]
show: [nodeLabels]
---
::

To model a truss in the app, tick **Start hinge** and **End hinge** for every bar, or tick both in the banner before you draw the bars with the mouse ([end hinges](/essentials/elements#end-hinges)). The [plane truss tutorial](/tutorials/truss) builds one step by step.

## Degrees of freedom {#degrees-of-freedom}

A truss bar works with the two translations at each end, in its [local axes](/elements/conventions#element-local-axes):

::element-sketch{mode="dofs" :hinges='[true,true]' :rotations='false' caption="A truss bar: hinged at both ends, two translations at each"}
::

| Direction | Start node (1) | End node (2) |
| --- | --- | --- |
| along local x | $u_1$ and `X12` | $u_2$ and `X21` |
| along local z | $w_1$ and `Z12` | $w_2$ and `Z21` |

$$
\mathbf{d}_l = \begin{bmatrix} u_1 & w_1 & u_2 & w_2 \end{bmatrix}^\mathsf{T}.
$$

The nodes keep their rotation `Ry`, because every member is a beam element, but a bar hinged at both ends neither feels nor transmits it: its end moments `M12` and `M21` are always zero. At a joint where every bar is hinged, nothing holds that rotation. The solver leaves it at zero, but a nodal moment applied at such a joint has nothing to act on and stops the solution with *Structure is a mechanism: the stiffness matrix is singular.*

## Local stiffness matrix {#local-stiffness-matrix}

$$
\mathbf{K}_l = \frac{EA}{L}
\begin{bmatrix}
 1 & 0 & -1 & 0 \\
 0 & 0 & 0 & 0 \\
 -1 & 0 & 1 & 0 \\
 0 & 0 & 0 & 0
\end{bmatrix},
$$

with $E$ Young's modulus, $A$ the cross-sectional area and $L$ the length. Only stretching the bar costs energy, so the normal force of a bar without element loads is constant:

$$
N = \frac{EA}{L}\,(u_2 - u_1).
$$

### Why a beam with two hinges is a truss bar

Condense both end rotations out of the [beam stiffness matrix](/elements/beam#local-stiffness-matrix), as for any [end hinge](/elements/beam#end-hinges). The axial terms do not involve rotations and stay as they are. The bending terms vanish entirely: once both rotations are free, any pair of end displacements $w_1$, $w_2$ just turns the bar as a rigid body about its hinges, which costs no energy. The solver does this condensation numerically, for any shear coefficient, and gets the matrix above up to floating-point round-off.

::callout{type="details" title="The condensation, worked out"}
For the bending part, order the DOFs as kept, $a = (w_1, w_2)$, and released, $b = (\varphi_1, \varphi_2)$. From the beam matrix, with $k_1$ to $k_4$ and the shear parameter $\Phi$ as defined [there](/elements/beam#local-stiffness-matrix),

$$
\begin{aligned}
\mathbf{K}_{aa} &= k_1 \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{ab} &= k_2 \begin{bmatrix} -1 & -1 \\ 1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{bb} &= \begin{bmatrix} k_3 & k_4 \\ k_4 & k_3 \end{bmatrix}.
\end{aligned}
$$

Since $\mathbf{K}_{ab}$ has two equal columns, only the sum of the entries of $\mathbf{K}_{bb}^{-1}$ matters, which is $2/(k_3 + k_4)$:

$$
\mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}
= \frac{2\,k_2^2}{k_3 + k_4} \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}.
$$

With $k_3 + k_4 = 6EI_y / ((1+\Phi)L)$ the factor is $\dfrac{12\,EI_y}{(1+\Phi)L^3} = k_1$, so this is exactly $\mathbf{K}_{aa}$ and the condensed bending stiffness $\mathbf{K}_{aa} - \mathbf{K}_{ab}\mathbf{K}_{bb}^{-1}\mathbf{K}_{ba}$ is zero.
::

## Transformation matrix {#transformation-matrix}

For a bar at the angle $\theta$ from global x toward global z, with $c = \cos\theta = (x_2 - x_1)/L$ and $s = \sin\theta = (z_2 - z_1)/L$, the local displacements are $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$ with

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 \\
 -s & c & 0 & 0 \\
 0 & 0 & c & s \\
 0 & 0 & -s & c
\end{bmatrix}:
$$

the translation rows and columns of the [beam's transformation matrix](/elements/beam#transformation-matrix). Mind the sign of $s$ with z pointing down: the rafter A → C of the truss above rises, so $z_2 - z_1 = -3$ m, $c = 0.7071$ and $s = -0.7071$.

## Global stiffness matrix {#global-stiffness-matrix}

$\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T}$ multiplies out to

$$
\mathbf{K}_g = \frac{EA}{L}
\begin{bmatrix}
 c^2 & cs & -c^2 & -cs \\
 cs & s^2 & -cs & -s^2 \\
 -c^2 & -cs & c^2 & cs \\
 -cs & -s^2 & cs & s^2
\end{bmatrix}.
$$

The **Stiffness matrix** window of a hinged bar shows these numbers in its translation rows and columns, and zeros for the rotations.

## What a hinged beam does beyond a truss bar {#where-a-hinged-beam-does-more}

Because a truss bar in EduBeam is still a beam element, it can do two things a textbook truss bar cannot:

- **Carry loads along its length.** A line load on a bar, such as its self-weight, bends the bar between its joints like a simply supported beam and passes $qL/2$ to each joint. The other bars carry the normal forces of the truss under these joint loads. In the loaded bar itself, the component of the load along the bar makes $N$ vary linearly, and the truss force is its value at mid-length.
- **Mix with beams.** A frame can contain hinged bars, such as a tie or a bracing diagonal, with no special element type.

Add 5 kN/m to the tie of the truss above:

::model-figure{caption="The same truss with 5 kN/m on the tie: the normal forces do not change, and the tie bends with M = qL²/8 = 22.5 kNm"}
---
nodes: { A: [0, 0], B: [6, 0], C: [3, -3] }
supports: { A: pin, B: roller }
members:
  - { nodes: [A, C], hinges: [true, true] }
  - { nodes: [C, B], hinges: [true, true] }
  - { nodes: [A, B], hinges: [true, true] }
loads:
  - { node: C, fz: 10 }
  - { member: 3, qz: 5 }
results: [M, N]
show: [nodeLabels]
---
::

The hand check: at C, vertical equilibrium $2\,N \sin 45^\circ + 10 = 0$ gives $N = -7.071$ kN in each rafter. At A, the rafter's horizontal component, $7.071 \cos 45^\circ = 5$ kN, is balanced by the tie, which is in tension with $N = +5$ kN. The load on the tie goes straight into the supports at its ends: it adds $qL/2 = 15$ kN to each reaction but nothing to the normal forces.

A truss has to be stable as a pin-jointed structure. A square panel without a diagonal, for instance, is a mechanism: EduBeam names the hinges and shows the motion ([troubleshooting](/reference/troubleshooting#no-results-are-drawn)).
