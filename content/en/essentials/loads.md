---
description: "Apply forces, moments, settlements, uniform, trapezoidal, point and temperature loads in EduBeam, with the sign convention of each: positive z is down, positive moments are counter-clockwise."
source: site
---

# Loads

Loads act on nodes or along elements. All of them belong to a **single load case** and act together; to compare scenarios, save each one as a [project file or share link](/essentials/import-export).

| Load | Acts on | Add it from |
| --- | --- | --- |
| [Force or moment](#nodal-loads) | a node | *Loads* tab → **Add nodal load**, or click the node → **Add load** |
| [Prescribed displacement](#prescribed-displacements-support-settlements) (settlement) | a supported node | the same dialog, or click the node → **Prescribe displacement** |
| [Uniformly distributed](#uniformly-distributed-load), [trapezoidal](#trapezoidal-load), [concentrated](#concentrated-load) or [temperature](#temperature-load) load | an element | *Loads* tab → **Add element load**, or click the element → **Add load** |

## Sign convention {#sign-convention-in-one-line}

x points **right**, z points **down**, and moments are positive **counter-clockwise**. So a positive `Fz` or `fz` is a downward, gravity-like load, and an upward load is negative.

::model-figure{caption="Every load here is positive: Fx = +10 kN to the right, Fz = +10 kN down, My = +10 kNm counter-clockwise"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0] }
supports: { A: pin, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: A, fx: 10 }
  - { node: B, fz: 10 }
  - { node: C, my: 10 }
results: []
---
::

| Positive | Default axes (z down) | [y-up axes](/elements/conventions#y-up-axes) |
| --- | --- | --- |
| Horizontal force `Fx`, `fx` | to the right | to the right |
| Vertical force | `Fz`, `fz`: **down** | `Fy`, `fy`: **up** |
| Moment | `My`: counter-clockwise | `Mz`: counter-clockwise |
| Vertical settlement | `Dz`: down | `Dy`: up |

Loads in an element's **local axes** (LCS ticked) follow the element instead: local x runs from its initial node to its end node, and local z is local x turned 90° clockwise, towards the dashed line drawn along the element. See [Element direction](/essentials/elements#element-direction). The full convention, including internal forces, is in [Coordinate system & sign conventions](/elements/conventions#loads).

## Nodal loads {#nodal-loads}

*Loads* tab → **Add nodal load**, or click a node → **Add load**, and keep **Force/Moment** selected. Enter the forces `Fx`, `Fz` (kN) and the moment `My` (kNm), with the signs [above](#sign-convention-in-one-line); the preview draws the load as you type.

![Add nodal load: the preview shows the direction as you type](/screenshots/loads-nodal.webp){.shot-md}

- The components are in **global** axes. On a node with turned axes (an [inclined support](/essentials/nodes-supports#inclined-skewed-supports)) the dialog adds a **Global axes** / **Node axes** switch. In node axes the components, shown as `Fx′` and `Fz′`, act along the node's own axes and turn with them if the angle changes later. Switching rewrites the numbers so the load stays where it is.
- A node can carry several nodal loads; they add up.

### Prescribed displacements (support settlements) {#prescribed-displacements-support-settlements}

To move a support by a given amount, choose **Prescribed displacement** in the same dialog, or click a supported node → **Prescribe displacement**. Enter the displacements `Dx`, `Dz` (positive right and down, in the [displacement unit](/essentials/units-settings#units), m by default) and the rotation `Ry` (rad, positive counter-clockwise).

- Only **restrained** DOFs can be prescribed: the other fields are greyed out, and a node with no support cannot have a settlement at all.
- A node has at most one prescribed displacement. To change it, edit it rather than adding a second.
- On an inclined support, the fields read `Dx′` and `Dz′`: the settlement acts along the support's own axes.

Whether a settlement causes internal forces depends on the structure. The same 10 mm settlement of support B, with no other load:

::div{.shots}

:::model-figure{caption="Simply supported: the beam just tilts; no reactions, M = 0"}
---
nodes: { A: [0, 0], B: [5, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

:::model-figure{caption="Continuous over B: the beam bends, M = 21.06 kNm over B"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

::

A statically determinate structure follows the support without resistance. The continuous beam has to bend: support B pulls it down by $\delta = 10\ \text{mm}$, like a point load at the middle of a simply supported 10 m span. With $L = 5\ \text{m}$ and the example steel's $EI = 17\,548\ \text{kNm}^2$, that load is $P = 6EI\delta/L^3 = 8.423\ \text{kN}$, the reaction at B, and $M_B = PL/2 = 3EI\delta/L^2 = 21.06\ \text{kNm}$. The [continuous beam tutorial](/tutorials/continuous-beam) combines a settlement with loads.

## Element loads {#element-loads}

*Loads* tab → **Add element load**, or click an element → **Add load**. Choose the **Load type**; the preview shows the load on the element as you type. Forces are in kN and line loads in kN/m, or whatever [units](/essentials/units-settings#units) you have chosen.

![Add element load, with a uniformly distributed load](/screenshots/loads-udl.webp){.shot-md}

### Uniformly distributed load {#uniformly-distributed-load}

A constant load per unit length, `fx` and `fz`, over the whole element. With **LCS** ticked (the default) they act along the element's local axes; unticked, along the global axes. On a horizontal element drawn left to right the two are the same; on an inclined member they are not:

| You want | Enter |
| --- | --- |
| a load **perpendicular** to the member (wind on a rafter) | `fz` with LCS **ticked** |
| a **vertical** load per metre of member (self-weight) | `fz` with LCS **unticked** |
| a **vertical** load per metre of horizontal projection (snow) | not available directly: multiply by $\cos\alpha$, the member's slope, and enter it as a vertical load |

The same 10 kN/m on a rafter 4 m across and 3 m up, 5 m long:

::div{.shots}

:::model-figure{caption="LCS unticked: vertical, 50 kN in total; M = 25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [M]
---
:::

:::model-figure{caption="LCS ticked: perpendicular to the member; M = 31.25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10, local: true }
results: [M]
---
:::

::

By hand: perpendicular, $M = qL^2/8 = 10 \cdot 5^2/8 = 31.25\ \text{kNm}$; vertical, the 50 kN spread over 4 m of span is 12.5 kN/m of projection, so $M = 12.5 \cdot 4^2/8 = 25\ \text{kNm}$.

### Trapezoidal load {#trapezoidal-load}

A load that varies linearly along the element: `f1x`, `f1z` at the **initial** node, `f2x`, `f2z` at the **end** node. Set one end to zero for a triangular load.

::model-figure{caption="Triangular load, 0 to 10 kN/m: reactions 10 and 20 kN, largest M = 23.09 kNm at 3.46 m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: [0, 10] }
results: [M, V]
show: [nodeLabels]
---
::

By hand: the total load $qL/2 = 30\ \text{kN}$ acts at $2L/3$, so $R_A = 10\ \text{kN}$ and $R_B = 20\ \text{kN}$; the shear is zero, and the moment largest, at $x = L/\sqrt{3} = 3.46\ \text{m}$, where $M = qL^2/(9\sqrt{3}) = 23.09\ \text{kNm}$.

Trapezoidal loads act along the element's **local axes** (the LCS box is locked). On a horizontal element drawn left to right, that is the same as global; on an inclined one, `f1z` and `f2z` are perpendicular to the member and `f1x`, `f2x` along it.

A varying **vertical** load on a member at slope $\alpha$ is still exact: enter its two local components at each end, $f_z = q\cos\alpha$ and $f_x = q\sin\alpha$ pointing down the slope, which is negative when the element runs uphill from its initial node. For the rafter above, 4 m across and 3 m up and drawn from the bottom, a vertical load growing from 0 to 10 kN/m of member is `f1x` = `f1z` = 0, `f2x` = −6 and `f2z` = 8 kN/m.

::model-figure{caption="Vertical load from 0 to 10 kN/m of member, entered as local components: reactions 8.333 and 16.67 kN, largest M = 12.83 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qx: [0, -6], qz: [0, 8], local: true }
results: [M]
show: [nodeLabels]
---
::

By hand: the 25 kN resultant acts two thirds of the way across, at 2.67 m, so $R_B = 25 \cdot 2.667/4 = 16.67\ \text{kN}$. Over the 4 m projection the load is a triangle rising to 12.5 kN/m, so, as above, $M = 12.5 \cdot 4^2/(9\sqrt{3}) = 12.83\ \text{kNm}$.

### Concentrated load {#concentrated-load}

A point force `Fx`, `Fz` or a moment `My` anywhere **along** an element, without an extra node. **Load position from start node** is its distance $a$ from the initial node, $0 \le a \le L$. It starts at half the length rounded down to whole metres, and at most 5 m (whole feet and at most 15 ft in US units), so set it to where your load is. **LCS** works as for uniform loads.

::model-figure{caption="20 kN at 2 m on a 6 m span: V jumps from 13.33 to −6.667 kN, M = 26.67 kNm under the load"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M]
show: [nodeLabels]
---
::

The shear diagram jumps by `Fz` at the load and the moment diagram has a kink there: $R_A = 20 \cdot 4/6 = 13.33\ \text{kN}$, $M = 13.33 \cdot 2 = 26.67\ \text{kNm}$. A concentrated `My` makes the moment diagram jump instead.

### Temperature load {#temperature-load}

| Field | Meaning | Effect |
| --- | --- | --- |
| **ΔT<sub>c</sub>**, axial temperature change | the same change over the whole section | elongation $\alpha\,\Delta T_c\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>** | change of the bottom fibres minus the top fibres | curvature $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

Both are temperature *changes* from the stress-free state, in °C by default; a change of 1 °C is 1 K. Temperature loads use the material's **α** and the section's **height h**. The **bottom** fibres are on the side of the dashed line. A positive ΔT<sub>b</sub> − ΔT<sub>t</sub> (warmer at the bottom) lengthens the bottom fibres, so the element sags like a beam under gravity load.

In a statically determinate structure, temperature only causes displacements. Restraint (fixed ends, continuity, redundant members) turns it into internal forces. The same 6 m steel beam, 0.3 m deep, 20 K warmer at the bottom than at the top:

::div{.shots}

:::model-figure{caption="Simply supported: it sags 3.6 mm at midspan, M = 0"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [w, M]
---
:::

:::model-figure{caption="Fixed at both ends: it stays straight, M = −14.04 kNm all along"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [M, w]
---
:::

::

By hand: the free curvature is $\kappa = \alpha\,\Delta T/h = 12 \times 10^{-6} \cdot 20/0.3 = 8 \times 10^{-4}\ \text{1/m}$. Simply supported, the beam takes it freely and sags $\kappa L^2/8 = 3.6\ \text{mm}$. With fixed ends, a constant moment must undo it: $M = -EI\kappa = -17\,548 \cdot 8 \times 10^{-4} = -14.04\ \text{kNm}$. [Checking results by hand](/guide/verification#temperature-gradient-on-a-simply-supported-beam) works through another case.

## Editing and removing loads {#editing-and-removing-loads}

| To | Do this |
| --- | --- |
| Change values quickly | Edit the components (and the LCS box) in place in the *Loads* tab. |
| Open the edit dialog | Double-click the load in the viewer, or click it → **Edit load**. The loads also appear as chips in the *Nodes* and *Elements* tables; click one to edit it. |
| Delete it | Select it and press <kbd>Delete</kbd>, click it → **Delete**, or use the × in the *Loads* tab. |

Loads belong to their node or element: deleting the node or element deletes them, and copying it with its loads selected copies them.

![The Loads tab: one row per load, with its components editable in place](/screenshots/loads-table.webp)

## What is not available {#what-is-not-available}

::div{.limits}
- **One load case.** No combinations: save each case as its own file or link.
- **No self-weight.** Add it as a uniform load, LCS unticked: $f_z = \rho\,g\,A$, e.g. $\approx 0.22\ \text{kN/m}$ for an IPE 200.
- **Trapezoidal loads in local axes only.** For a varying vertical load on a sloped member, enter its [local components](#trapezoidal-load).
- **No partial line loads.** A line load covers the whole element: add a node where it starts or ends.
::
