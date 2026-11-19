---
description: "EduBeam checked against textbook formulas: beams, a truss, temperature, a settlement, and where its Timoshenko beam differs from Euler–Bernoulli."
source: site
---

# Checking results by hand

Never trust a number you can't roughly reproduce. This page works the classic textbook cases by hand and compares them with [EduBeam]{.edubeam}, which agrees to every digit shown. The tables give five significant digits, as the app's *Results* tab does; the figure labels are rounded to four. Each figure is solved live in your browser; **Open in EduBeam** loads the same model into the app, where you can read the tables, change a value and watch what happens.

::div{.chips}
- [Simply supported beam](#simply-supported-beam-uniform-load)
- [Cantilever](#cantilever-tip-load)
- [Fixed–fixed beam](#fixed–fixed-beam-uniform-load)
- [Propped cantilever](#propped-cantilever-uniform-load)
- [Two-bar truss](#two-bar-truss)
- [Temperature](#temperature-gradient-on-a-simply-supported-beam)
- [Support settlement](#prescribed-displacement)
- [Shear deformation](#shear-deformation)
::

For whole structures worked from start to finish, see the [three-hinged frame](/tutorials/three-hinged-frame) and [plane truss](/tutorials/truss) tutorials. For new problems to work by hand, with the answers checked as you type them, try the [practice page](/practice).

## The section used here {#the-section-used-here}

Every case uses the steel beam of the app's examples, unless stated otherwise: $E = 210$ GPa and $I_y = 8356$ cm⁴ (an IPE 300), so

$$
EI = 210 \times 10^9 \cdot 8.356 \times 10^{-5} = 17\,547.6\ \text{kNm}^2
$$

Its area ($A = 1$ m²) and shear coefficient ($k = 10^{32}$) are so large that axial and shear deformation vanish, so the results follow the Euler–Bernoulli formulas of your textbook exactly.

::callout{type="info" title="EduBeam's beams are Timoshenko beams"}
With a real section, such as one from the section library, the members also deform in shear. Deflections then come out slightly larger than the Euler–Bernoulli formulas give, and in a statically indeterminate structure the forces shift slightly too. [Shear deformation](#shear-deformation) at the end of this page shows by how much, and how to switch it off.
::

In the *Results* tab, displacements and rotations follow the [global axes](/elements/conventions#global-axes): a positive D<sub>z</sub> is downward, a positive R<sub>y</sub> counter-clockwise, and displacements are in metres unless you change the unit in [Settings](/essentials/units-settings).

## Simply supported beam, uniform load {#simply-supported-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, pinned at A and on a roller at B. Node C at mid-span lets you read the deflection there; splitting a member at a node changes no result.

::model-figure{caption="Simply supported beam, 12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Quantity | Formula | Value |
| --- | --- | --- |
| Reactions | $qL/2$ | 36 kN |
| Shear force at the supports | $\pm qL/2$ | +36 kN at A, −36 kN at B |
| Mid-span moment | $qL^2/8$ | 54 kNm |
| Rotation at A | $qL^3/(24EI)$ | 0.0061547 rad, clockwise |
| Deflection at C | $5qL^4/(384EI)$ | 11.540 mm, down |

EduBeam shows the same values. In the *Results* tab, node A has R<sub>y</sub> = −0.0061547 rad (negative: clockwise) and node C has D<sub>z</sub> = 0.01154 m (positive: down).

## Cantilever, tip load {#cantilever-tip-load}

$L = 4$ m, fixed at A, $F = 18$ kN downward at the free end B.

::model-figure{caption="Cantilever, 18 kN at the tip"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Quantity | Formula | Value |
| --- | --- | --- |
| Vertical reaction | $F$ | 18 kN |
| Fixing moment | $FL$ | 72 kNm, hogging: M = −72 kNm |
| Tip rotation | $FL^2/(2EI)$ | 0.0082063 rad, clockwise |
| Tip deflection | $FL^3/(3EI)$ | 21.883 mm, down |

In the *Results* tab, node B has R<sub>y</sub> = −0.0082063 rad and D<sub>z</sub> = 0.021883 m.

## Fixed–fixed beam, uniform load {#fixed–fixed-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, both ends fixed. This beam is statically indeterminate, so the solution depends on the stiffness; the formulas come from the compatibility condition that both end rotations are zero.

::model-figure{caption="Fixed–fixed beam, 12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Quantity | Formula | Value |
| --- | --- | --- |
| Reactions | $qL/2$ | 36 kN |
| Support moments | $qL^2/12$ | 36 kNm, hogging: M = −36 kNm |
| Mid-span moment | $qL^2/24$ | 18 kNm, sagging |
| Deflection at C | $qL^4/(384EI)$ | 2.3080 mm, down |

Fixing the ends lifts the whole moment diagram by $qL^2/12$: the total drop from support to mid-span is still $qL^2/8 = 54$ kNm, as in the simply supported beam. In the app, start from the simply supported model and change both supports to **Fixed** to watch it happen.

## Propped cantilever, uniform load {#propped-cantilever-uniform-load}

$L = 6$ m, $q = 12$ kN/m, fixed at A and on a roller at B.

::model-figure{caption="Propped cantilever, 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Quantity | Formula | Value |
| --- | --- | --- |
| Reaction at the fixed end | $5qL/8$ | 45 kN |
| Reaction at the roller | $3qL/8$ | 27 kN |
| Fixing moment | $qL^2/8$ | 54 kNm, hogging: M = −54 kNm |
| Largest sagging moment | $9qL^2/128$ | 30.375 kNm |
| … where $V = 0$ | $x = 5L/8$ | 3.75 m from A |
| Rotation at B | $qL^3/(48EI)$ | 0.0030773 rad, counter-clockwise |

EduBeam labels every extreme of a diagram, so the sagging peak is marked where it occurs. To find its position, read where the shear force crosses zero: $V(x) = 45 - 12x = 0$ gives $x = 3.75$ m.

## Two-bar truss {#two-bar-truss}

Two bars rise from pins at A $(0, 0)$ and B $(4, 0)$ to meet at the apex C $(2, -2)$, 2 m up. Both ends of both bars are **end hinges**, so the bars carry only axial force. A vertical load $F = 20$ kN acts downward at C.

::model-figure{caption="Two-bar truss, 20 kN at the apex"}
---
nodes: { A: [0, 0], C: [2, -2], B: [4, 0] }
supports: { A: pin, B: pin }
members: [{ nodes: [A, C], hinges: [true, true] }, { nodes: [C, B], hinges: [true, true] }]
loads:
  - { node: C, fz: 20 }
results: [N]
show: [nodeLabels]
---
::

Each bar is at 45°. Vertical equilibrium of joint C, with both bars carrying the same force by symmetry:

$$
\begin{aligned}
2N \sin 45^\circ + F &= 0 \\
N = -\frac{F}{\sqrt{2}} &= -14.142\ \text{kN}
\end{aligned}
$$

Both bars are in **compression**. Each support takes 10 kN vertically and 10 kN horizontally, pointing inward: the bars push the supports apart. The **N (x)** overlay and the reactions show the same.

## Temperature gradient on a simply supported beam {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m, $h = 0.3$ m, $\alpha = 12 \times 10^{-6}$ 1/K. The top face warms by 5 K and the bottom face cools by 5 K, so $\Delta T_b - \Delta T_t = -10$ K and the axis keeps its temperature ($\Delta T_c = 0$). A simply supported beam is free to curve, so there are **no internal forces**, only a curvature:

$$
\begin{aligned}
\kappa &= \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} \\
&= \frac{12 \times 10^{-6} \cdot (-10)}{0.3} = -4 \times 10^{-4}\ \text{m}^{-1}
\end{aligned}
$$

The top lengthens and the bottom shortens, so the beam bows **upward**:

::model-figure{caption="Top 10 K warmer than the bottom: the beam bows up 3.2 mm, with no internal forces"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [w]
show: [nodeLabels]
section: { h: 0.3 }
---
::

| Quantity | Formula | Value |
| --- | --- | --- |
| Deflection at C | $\kappa L^2/8$ | 3.2 mm, up: D<sub>z</sub> = −0.0032 m |
| Rotation at A | $\kappa L/2$ | 0.0016 rad, counter-clockwise |
| Bending moment |  | 0 |

A uniform change $\Delta T_c$ would only lengthen the beam, which the roller allows: it adds no forces either.

Now restrain the rotation at both ends (a **Fixed** support at A and a **Slider** at B, which still lets the beam lengthen). The curvature is blocked, and a constant moment takes its place along the whole span:

$$
\begin{aligned}
M &= -EI\kappa \\
&= -17\,547.6 \cdot (-4 \times 10^{-4}) = 7.019\ \text{kNm}
\end{aligned}
$$

It is sagging: the restrained top wants to lengthen, so it ends up in compression.

::model-figure{caption="The same beam with both rotations restrained: a constant 7.019 kNm"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: fixed, B: slider }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [M]
show: [nodeLabels]
section: { h: 0.3 }
---
::

Temperature loads are entered as described in [Loads](/essentials/loads#temperature-load); the section height $h$ is part of the [cross section](/essentials/elements#cross-sections).

## Support settlement {#prescribed-displacement}

Take the [propped cantilever](#propped-cantilever-uniform-load) without its load and let the roller at B settle by $w = 10$ mm. In EduBeam that is a **prescribed displacement** D<sub>z</sub> = 0.01 m at B. To follow it, the roller has to pull the tip of the cantilever down, and that bends the beam:

::model-figure{caption="Propped cantilever, B settles 10 mm: the roller pulls down with 2.437 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

| Quantity | Formula | Value |
| --- | --- | --- |
| Force at the roller | $R = 3EIw/L^3$ | 2.4372 kN, pulling down |
| Fixing moment | $RL$ | 14.623 kNm, hogging: M = −14.623 kNm |
| Rotation at B | $3w/(2L)$ | 0.0025 rad, clockwise |

Unlike a load, a settlement makes forces only where the structure resists it: here the stiffer the beam, the larger $R$. A simply supported beam would follow the same settlement as a rigid body, with no forces at all.

Add the 12 kN/m load back and the results superpose: the fixed end now takes $45 + 2.4372 = 47.437$ kN and $54 + 14.623 = 68.623$ kNm, and the roller $27 - 2.4372 = 24.563$ kN. How to enter a settlement is described in [Loads](/essentials/loads#prescribed-displacements-support-settlements).

## Shear deformation {#shear-deformation}

EduBeam's beam elements are **Timoshenko** beams: on top of the bending deflection, they deflect in shear, by an amount set by the section's shear stiffness $kGA$. What that changes depends on the structure:

- **Statically determinate**: the reactions and internal forces follow from equilibrium alone, so they stay exactly as they were. Only the displacements grow. In a simply supported beam and a cantilever the rotations of the cross sections stay as well; elsewhere, such as at the end of an overhang, they change a little too.
- **Statically indeterminate**: the forces depend on the stiffness, so they shift slightly as well.

### A simply supported beam {#shear-simply-supported}

The [Quick start](/guide/quick-start#_8-check-by-hand) beam shows how much. It is the simply supported beam from above with a real section, the **IPE 200 (approx)** from the section library: $I_y = 1943$ cm⁴, $A = 28.48$ cm² and a shear coefficient $k = 0.3933$ (the web's share of the area), with $G = 81$ GPa. So $EI = 4080.3$ kNm² and $kGA = 90\,720$ kN.

| Quantity | Formula | Value |
| --- | --- | --- |
| End rotation | $qL^3/(24EI)$ | 0.026469 rad |
| Mid-span deflection, bending | $5qL^4/(384EI)$ | 49.629 mm |
| Mid-span deflection, shear | $qL^2/(8kGA)$ | 0.59524 mm |
| Mid-span deflection, total | sum | 50.224 mm, as EduBeam shows |

The shear part is 1.2 % of the total. The end rotation is the Euler–Bernoulli value, as are the reactions and the moments.

### A cantilever: short members {#shear-cantilever}

For a cantilever with a tip load $F$, the tip deflects by $FL^3/(3EI)$ in bending and $FL/(kGA)$ in shear. Their ratio is

$$
\frac{\text{shear}}{\text{bending}} = \frac{3EI}{kGA\,L^2}
$$

With the same IPE 200 that is 0.84 % for a 4 m cantilever, but 13.5 % for a 1 m one: shear deformation matters for short, deep members.

### A propped cantilever: the forces move {#shear-propped-cantilever}

The [propped cantilever](#propped-cantilever-uniform-load) made of the IPE 200 is indeterminate, and the roller now takes a little more. With $\beta = 3EI/(kGA\,L^2) = 0.0037481$ for $L = 6$ m, compatibility at the roller gives

$$
R_B = \frac{3qL}{8} \cdot \frac{1 + 4\beta/3}{1 + \beta} = 27.034\ \text{kN}
$$

instead of 27 kN, and the fixing moment drops from 54 to $qL^2/2 - R_B L = 53.798$ kNm. Small here, but it grows with $\beta$, so with short, deep members.

### Comparing with Euler–Bernoulli {#shear-switch-off}

To compare with Euler–Bernoulli formulas, set the section's **Shear coefficient** to a very large value, such as `1e10`. The shear part then vanishes and every case on this page agrees again. The element formulation is in the [theory manual](/elements/beam).

## Tips for your own checks {#tips-for-your-own-checks}

- Keep the **units chip** at the bottom right of the viewer in view; most discrepancies are unit slips.
- Read exact numbers from the **Results** tab and the hover tooltips rather than from the diagram labels. **Export CSV** or **Copy** gives you the reactions too, ready for a spreadsheet. See [Results & diagrams](/essentials/results#results-tab).
- Set **Number format** to *Automatic* in Settings to read `40` instead of `4 · 10¹`.
- Use the **Stiffness matrix** window to compare a single element with the [theory manual](/elements/beam) when learning the direct stiffness method.
- Use **Share model** to hand a checked model to a colleague or teacher.
- To check many cases at once, or to generate exercises with known answers, run the same solver from code: [@edubeam/fem](/solver) is the library behind every number in the app.
