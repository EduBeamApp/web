---
description: "EduBeam's sign conventions: x right and z down, positive loads and displacements, local axes, N, V and M, end forces, reactions and the y-up option."
source: site
---

# Coordinate system & sign conventions

Every number EduBeam shows has a sign. This page sets out what *positive* means for coordinates, loads, displacements, internal forces, end forces and reactions, so you can compare the app with your own calculations. Most results that look wrong turn out to be a sign convention.

| Quantity | Positive |
| --- | --- |
| `x`, `Dx`, `Fx` | to the right |
| `z`, `Dz`, `Fz` | **down** |
| `Ry`, `My` | counter-clockwise on screen |
| $N$ | tension |
| $V$ | turns a short piece of the member clockwise |
| $M$ | sagging: tension in the bottom fibres, on the side of the dashed line |
| Reactions | the force the support puts on the structure, signed like a load |

## Global axes {#global-axes}

The model lies in the x–z plane:

- **x** is horizontal, positive to the **right**.
- **z** is vertical, positive **down**.
- **y** points out of the screen, toward you, which makes the system right-handed. Rotations and moments are about y, so **counter-clockwise is positive**.

The axis cross in the corner of the canvas shows x in red and z in green. Because z points down, a node at the top of a 3 m column standing at `Z = 0` has `Z = −3`. Angles, such as the angle of an inclined support, are measured from x toward z, which is clockwise on screen.

If you prefer y up, switch the [display convention](#y-up-axes): the model stays the same, only the numbers you read and type change.

## Degrees of freedom {#degrees-of-freedom}

Each node has three degrees of freedom (DOFs):

| DOF | Meaning | Positive | Unit |
| --- | --- | --- | --- |
| `Dx` | horizontal displacement | to the right | m |
| `Dz` | vertical displacement | down | m |
| `Ry` | rotation | counter-clockwise | rad |

The same signs apply to [prescribed displacements](/essentials/loads#prescribed-displacements-support-settlements), to the *Nodal results* table and to the values shown when you point at a node.

## Loads {#loads}

Loads are positive along the positive axes. **Fx**, **Fz** and **My** are the components of a nodal or concentrated load, **fx** and **fz** those of a uniform load, and **f₁x**, **f₂x**, **f₁z**, **f₂z** those of a trapezoidal load at the element's start and end.

| Load | Positive direction |
| --- | --- |
| `Fx`, `fx`, `f₁x`, `f₂x` | +x, to the right; along the element's local x when **LCS** is ticked |
| `Fz`, `fz`, `f₁z`, `f₂z` | +z, **down**; along the element's local z when **LCS** is ticked |
| `My` | counter-clockwise |
| `ΔTc` | heating of the member's axis, which lengthens it |
| `ΔTb − ΔTt` | bottom fibres warmer than the top ones |

So gravity is a **positive** `fz`, and wind pushing a left-hand column to the right is a positive `fx`. A line load always acts per metre of the member's own length, also when it is given in global axes on an inclined member. The [Loads page](/essentials/loads#element-loads) shows how to enter each type.

::model-figure{caption="Every load here is positive: fz = 5 kN/m on A–B, Fz = 10 kN at B, My = 10 kNm at C and Fx = 10 kN at D"}
---
nodes: { A: [0, 0], B: [3, 0], C: [4.5, 0], D: [6, 0] }
supports: { A: fixed }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 5 }
  - { node: B, fz: 10 }
  - { node: C, my: 10 }
  - { node: D, fx: 10 }
results: []
reactions: false
show: [nodeLabels]
---
::

## Element local axes {#element-local-axes}

Each element has its own axes:

- **local x** runs from the element's start node to its end node;
- **local z** is local x turned 90° **clockwise on screen**, the same turn that takes global x to global z. Walking from the start node to the end node, local z is on your right.

| Element drawn | Local z points |
| --- | --- |
| left to right | down: local and global axes coincide |
| right to left | up |
| bottom to top | right |
| top to bottom | left |

The element's direction is its angle $\theta$, measured from global x toward global z (clockwise on screen). The [transformation matrix](/elements/beam#transformation-matrix) turns end displacements between the two systems with $\cos\theta$ and $\sin\theta$.

In the viewer, a dashed line along each element marks its local +z side: its **bottom fibres**. Element loads with **LCS** ticked, the position of a concentrated load and the end forces all follow the local axes. To turn an element round, use **Swap nodes** in the *Elements* table (see [element direction](/essentials/elements#element-direction)).

## Internal forces {#internal-forces}

Cut a member at a distance $x$ from its start node. On the face of the part **before** the cut, whose outward normal points along local +x, the internal forces are positive when they point along local +x, along local +z and counter-clockwise. On the other face they act the opposite way.

::element-sketch{mode="internal-forces" caption="Positive N, V and M on a short piece of a member: tension, a clockwise pair of shear forces, sagging (tension on the dashed bottom fibres)"}
::

In words:

| Quantity | Positive means |
| --- | --- |
| $N$ | tension |
| $V$ | it turns a short piece of the member clockwise: for a member drawn left to right, up on the piece's left face and down on its right face |
| $M$ | **sagging**: tension in the bottom fibres, on the dashed side |

With $q_x$ and $q_z$ the line load in local axes, they obey

$$
\frac{\mathrm{d}N}{\mathrm{d}x} = -q_x, \qquad \frac{\mathrm{d}V}{\mathrm{d}x} = -q_z, \qquad \frac{\mathrm{d}M}{\mathrm{d}x} = V.
$$

At a concentrated load $F_x$, $F_z$ or $M_y$ (in local axes) they jump by $\Delta N = -F_x$, $\Delta V = -F_z$ and $\Delta M = -M_y$: a force along local +z lowers $V$, and a counter-clockwise moment lowers $M$.

A simply supported beam under gravity load therefore has a positive moment, a positive shear force at its left support and a negative one at its right support. The beam below is also pulled at the roller, so its normal force is positive.

::model-figure{caption="Simply supported beam, 10 kN/m and a 20 kN pull: M = +45 kNm at mid-span, V = +30 kN at the left support and −30 kN at the right, N = +20 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
  - { node: B, fx: 20 }
results: [M, V, N]
---
::

A cantilever turns the moment round: it hogs. A push along its axis compresses it.

::model-figure{caption="Cantilever with a 10 kN tip load and a 15 kN push: M = −40 kNm at the wall, V = +10 kN, N = −15 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 10 }
  - { member: 1, px: -15, at: 4 }
results: [M, V, N]
---
::

In a frame, the bottom of each member is its local +z side, so the order in which you draw a column decides which of its sides is the bottom. This frame is drawn A → B → C → D, which puts local z of every member on the inside: a positive moment means tension on the inside of the frame, and the negative corner moments mean tension on the outside.

::model-figure{caption="Portal frame drawn A → B → C → D: local z of all three members points into the frame"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: pin, D: pin }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

The diagrams are drawn as most European courses draw them: $M$ on the tension side, $N$ and $V$ positive on the side away from the dashed line. **Settings → Viewer settings → Internal force diagrams** can put $M$ on the compression side and $N$ or $V$ on the dashed side. That changes the drawing, never the values: read the sign from the label, not from the side.

## End forces (Element results table) {#end-forces-element-results-table}

The *Element results* table lists six **end forces** per element, in its **local** axes:

::element-sketch{mode="end-forces" caption="The six end forces, each drawn positive: along local x and z, and counter-clockwise"}
::

| Column | Acts on the element at | Positive along |
| --- | --- | --- |
| `X12`, `Z12`, `M12` | its start node | local +x, local +z, counter-clockwise |
| `X21`, `Z21`, `M21` | its end node | local +x, local +z, counter-clockwise |

They are the forces the nodes exert on the element: its stiffness matrix times its end displacements, plus the forces that would hold its element loads if both ends were clamped,

$$
\begin{gathered}
\mathbf{f} = \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}, \\[1ex]
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix} = \mathbf{K}_l\,\mathbf{d}_l - \mathbf{f}_\mathrm{eq},
\end{gathered}
$$

where $\mathbf{d}_l$ are the element's end displacements in local axes and $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$ the equivalent nodal loads of its [element loads](/elements/beam#element-loads).

End forces follow the axes, not the $N$–$V$–$M$ convention, so at the start node their signs are reversed:

$$
\begin{aligned}
N(0) &= -X_{12}, & N(L) &= X_{21}, \\
V(0) &= -Z_{12}, & V(L) &= Z_{21}, \\
M(0) &= -M_{12}, & M(L) &= M_{21}.
\end{aligned}
$$

For the simply supported beam above: `X12 = −20 kN` and `X21 = +20 kN` (tension), `Z12 = Z21 = −30 kN` (both supports push up, which is −z), and `M12 = M21 = 0`.

At every node, the end forces of the elements meeting there, turned into global axes, add up to the nodal load plus the reaction. That makes a quick equilibrium check of a joint.

## Reactions {#reactions}

A reaction is the force or moment a support exerts **on the structure**, one for each restrained DOF. It is signed like a load: positive along +x, along +z (down) and counter-clockwise. A support carrying gravity load therefore has a **negative** `Rz`.

Reactions are in global axes, or in the node's own axes when the node has a **Nodal LCS angle** (an [inclined support](/essentials/nodes-supports#inclined-skewed-supports)). In the viewer each reaction is an arrow pointing the way the support pushes, labelled with its magnitude. The signed values are in the CSV export, as `Rx`, `Rz` and `My`.

## Y-up axes {#y-up-axes}

**Settings → Language & Locale → Coordinate system → x right, y up** switches everything you type and read to the textbook system: **x** to the right, **y** up and **z** toward you. The model, saved files and drawings stay exactly the same; only the numbers and the letters change:

| Quantity | x right, z down (default) | x right, y up |
| --- | --- | --- |
| Vertical coordinate | `Z` | `Y`, opposite sign |
| Vertical loads, displacements, reactions, end forces | `Fz`, `fz`, `Dz`, `Rz`, `Z12`… | `Fy`, `fy`, `Dy`, `Ry`, `Y12`…, opposite sign |
| Rotations and moments | `Ry`, `My` | `Rz`, `Mz`, same sign (counter-clockwise positive) |
| Support angle | measured clockwise | measured counter-clockwise, opposite sign |
| Internal forces | $N$, $V$, $M$ | the same, with the same signs, drawn the same way |

So in y-up, gravity is a **negative** `fy`, and the top of a 3 m column has `Y = 3`.

## Units {#units}

The solver works in SI throughout: m, N, Pa, rad, and K for temperature changes. The display units in [Units & settings](/essentials/units-settings) only change what you type and read, never the model.
