---
description: "Tutorial: model an inclined beam (a roof rafter or a stair flight) in EduBeam, enter a load given per metre of plan, read the normal and shear forces along the slope, and see how the direction of the roller changes them. About 15 minutes."
source: site
---

# Tutorial: inclined beam

Model a roof rafter under snow, read the normal and shear forces along its slope, and check them by hand.

- **Time:** about 15 minutes. This is the first and shortest of the four tutorials.
- **You need:** EduBeam open in a second tab, on a computer with a mouse and keyboard. Do the [Quick start](/guide/quick-start) first if you have not used EduBeam before: it shows the tabs and dialogs this tutorial uses.
- **Background:** equilibrium of a simply supported beam, and splitting a force into two components.
- **Units:** SI. The units chip at the bottom right of the viewer should read `m m² kN kNm MPa`. If it shows feet and kips, click it and set **Unit system** to **SI (metric)**.

**You will learn to**

- turn a load given per metre of plan into the load along the member that EduBeam takes,
- point a line load vertically or perpendicular to the member with the **LCS** box,
- turn a roller, and see that it moves the normal force but not the bending moment.

::div{.actions}
[Open EduBeam ↗](https://run.edubeam.app){target="_blank"} [Jump to the hand check](#check-by-hand)
::

::model-figure{caption="The finished rafter: 3 kN/m of snow per metre of plan, entered as 2.4 kN/m along the member, with a pin at the eaves (node 1) and a roller at the ridge (node 2)"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## The problem

- A straight rafter from node 1 at (0, 0) up to node 2 at (4, −3): 4 m in plan and 3 m high, so it is $L = 5$ m long, with $\cos\alpha = 4/5$ and $\sin\alpha = 3/5$.
- A pin at node 1, the eaves. At node 2, the ridge, a roller that rolls horizontally, so its reaction is vertical.
- Snow $s = 3$ kN/m, given, as codes give it, **per metre of plan** (of horizontal projection).
- Steel, $E = 210$ GPa, and $I_y = 8.356 \times 10^{-5}$ m⁴, that of an IPE 300.

**Is it determinate?** Three reactions and three equations of equilibrium: yes. Its forces follow from statics alone; $E$ and $I_y$ only matter for the deflection.

## Model it

::div{.steps}

### Material and section

1. Click **Clear mesh** in the app bar, tick **Delete materials** and **Delete cross sections**, and click **Confirm**. Nodes and elements are numbered from 1 again.
2. **Materials** tab → **Material library** → **+** on the **Steel (S235)** row, then **Cancel** to close the library.
3. **Cross sections** tab → **Add cross section**. Type `8.356e-5` in **Iy**, keep **Area**, **Height** and **Shear coefficient** at `1`, and click **Add cross section**.

An area of 1 m² keeps the member from shortening or shearing noticeably, as the hand calculation assumes.

### Draw the member

1. **Elements** tab → the second **Add element** button, the one with the cursor icon.
2. Click at (0, 0), then at (4, −3). The rulers and the crosshair show where you are, and the clicks snap to the grid.
3. Press <kbd>Esc</kbd> to stop drawing, then <kbd>F</kbd> to fit the view.

The z axis points down, so node 2, 3 m **above** node 1, is at $z = -3$. Check both nodes in the **Nodes** table and type over any coordinate that missed.

### Supports

Click node 1 → **Node supports** → the **Pin** symbol. Give node 2 the **Roller** the same way.

### Load

The snow on the rafter is $3 \cdot 4 = 12$ kN in all. EduBeam spreads a uniform load along the member's **length**, so the same 12 kN over 5 m is

$$
f_z = s \cdot \frac{4}{5} = s\cos\alpha = 3 \cdot 0.8 = 2.4\ \text{kN/m}
$$

1. **Loads** tab → **Add element load**.
2. **Load type** *Uniformly distributed load*, **Element** `1`, `fz = 2.4`.
3. **Untick LCS**, so that `fz` acts vertically, and click **Add element load**.

::callout{type="warning" title="LCS is ticked by default"}
With **LCS** ticked, `fz` acts along the element's local z axis, perpendicular to the slope: wind on a roof, not snow. On a horizontal beam the two are the same, which is why this is easy to miss. The load arrows show which way the load points; [Loads](/essentials/loads#uniformly-distributed-load) has the details.
::

::

## Results

The beam is solved as soon as the load is in. In the display options at the top right of the viewer (the cog shows and hides them), **Deformed shape**, **M<sub>y</sub> (x)** and **Reactions** are on from the start; tick **N (x)** and **V<sub>z</sub> (x)** as well. The switch under the figure at the top shows the same diagrams.

EduBeam labels diagrams and reactions in kN and kNm with two decimals, so you should read:

- `6.00` at each support, upward. The pin has no horizontal arrow: it takes no horizontal force.
- `6.00` kNm, the peak of the bending moment, at mid-span.
- `4.80` kN of shear at node 1 and `-4.80` at node 2.
- `-3.60` kN of normal force at node 1 (compression) and `3.60` at node 2 (tension), through zero at mid-span.

## Check by hand

**Reactions.** The 12 kN resultant acts 2 m in plan from node 1, so moments about either end give $V_1 = V_2 = 6$ kN. No horizontal force acts, so $H_1 = 0$.

**Bending moment.** For vertical forces only the horizontal lever arms count. At a distance $x$ in plan from node 1,

$$
M(x) = V_1\,x - \frac{s\,x^2}{2}, \qquad M_{\max} = \frac{s\,a^2}{8} = \frac{3 \cdot 4^2}{8} = 6\ \text{kNm}
$$

exactly as for a horizontal beam of span $a = 4$ m under the same load per metre of plan.

**Shear and normal force.** The forces to the left of a cut at $x$ add up to a vertical force $T(x) = V_1 - s\,x$. Split it into its parts perpendicular to the member and along it:

$$
V = T\cos\alpha, \qquad N = -T\sin\alpha
$$

| | Node 1, $T = +6$ kN | Mid-span, $T = 0$ | Node 2, $T = -6$ kN |
| --- | --- | --- | --- |
| $V$ | $6 \cdot 0.8 = 4.8$ kN | 0 | −4.8 kN |
| $N$ | $-6 \cdot 0.6 = -3.6$ kN | 0 | +3.6 kN |
| $M$ | 0 | 6 kNm | 0 |

All as in EduBeam. The upward reaction at node 1 pushes the lower end up the slope, into the member: compression. The upward reaction at node 2 pulls the upper end further up the slope, away from the member: tension. The signs follow the element's direction, from node 1 to node 2, as [Sign conventions](/elements/conventions#internal-forces) explains.

## Experiment

Change one thing at a time, predict the result, then look. <kbd>Ctrl</kbd>+<kbd>Z</kbd> takes each change back.

**Forget the cosine.** Enter `fz = 3` instead of 2.4. That is 3 kN per metre of slope, 15 kN in all, and every result comes out 25 % too large: 7.5 kN reactions and 7.5 kNm. On a roof pitched at 30° the error would be 15 %, at 45° 41 %.

**Leave LCS ticked.** Tick **LCS** on the 2.4 kN/m load. It now pushes perpendicular to the slope, as wind would, with a horizontal part of 7.2 kN that only the pin can take. The moment rises to $2.4 \cdot 5^2/8 = 7.5$ kNm, and the normal force becomes a constant tension of 4.5 kN.

::model-figure{caption="The same 2.4 kN/m with LCS ticked: perpendicular to the slope, so the pin takes 7.2 kN sideways"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4, local: true }
results: [M, N]
show: [nodeLabels]
---
::

**Turn the roller.** Untick **LCS** again and change only the direction in which the roller at node 2 rolls. Click node 2 → **Node supports**, type `-36.87` in **Nodal LCS angle** and press <kbd>Enter</kbd> (or in the **α** field of its row in the **Nodes** table).

![The Node supports menu of node 2: the support symbols, the restrained directions and the Nodal LCS angle](/screenshots/p2t-node-supports-angle.webp){.shot-md}

The angle turns the node's own axes. In the default axes, x right and z down, a negative angle turns them counter-clockwise on screen. [Inclined supports](/essentials/nodes-supports#inclined-skewed-supports) has more.

The roller now rolls along the slope, so its reaction is perpendicular to the member: $12 \cdot 2 / 5 = 4.8$ kN, from moments about node 1. The pin takes the rest, and with it the whole normal force: −7.2 kN at node 1, zero at node 2. (EduBeam may label node 2 `-0.00`, a trace left by rounding the angle to −36.87°.)

::model-figure{caption="The roller at node 2 turned by −36.87° to roll along the slope: the normal force runs from −7.2 kN to zero"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
angles: { 2: -36.87 }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

**Make it a vertical roller.** Set the angle back to 0 and pick the **Vertical roller** for node 2. It rolls vertically, so it can only push sideways: moments about node 1, $H_2 \cdot 3 = 12 \cdot 2$, give 8 kN, and the pin holds the rafter against that thrust. The whole member is in compression.

::model-figure{caption="A vertical roller at node 2: a horizontal thrust of 8 kN, and the whole rafter in compression"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: verticalRoller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

The three rollers side by side:

| Roller at node 2 | Reaction at node 2 | Reaction at node 1 | $N$ from node 1 to 2 |
| --- | --- | --- | --- |
| Horizontal | 6 kN ↑ | 6 kN ↑ | −3.6 to +3.6 kN |
| Along the slope | 4.8 kN ⊥ member | 2.88 kN →, 8.16 kN ↑ | −7.2 to 0 kN |
| Vertical | 8 kN ← | 8 kN →, 12 kN ↑ | −13.6 to −6.4 kN |

**The bending moment never changes**, and neither does the shear force: 6 kNm and ±4.8 kN in all three. Node 1, node 2 and every cut lie on one straight line, the member's axis. The part of the reaction at node 2 that acts along that line has no moment about any of them, so it only adds normal force. The part perpendicular to the member is fixed at 4.8 kN by moments about node 1, whichever way the roller points. The roller's direction decides only where the thrust goes, which matters for the wall or the stair landing that has to take it.

## Next steps

::card-grid{cols="2"}
:::card{title="Practise: beams with an overhang" icon="lucide:dices" to="/practice?p=O2048"}
Reactions and the largest moment of a beam under a distributed load, with your answers checked at once. Start with O2048; for more, keep only **Beam with an overhang** selected and press **New problem**.
:::
:::card{title="Next: three-hinged frame" icon="lucide:triangle" to="/tutorials/three-hinged-frame"}
Four members, an internal hinge and a horizontal thrust: a frame you can still solve by statics alone.
:::
::
