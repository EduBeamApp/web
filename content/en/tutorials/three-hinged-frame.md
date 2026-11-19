---
description: "Tutorial: a three-hinged frame under a uniform load in EduBeam, its reactions, thrust and internal forces, checked by hand with the hinge deflection."
source: site
---

# Tutorial: three-hinged frame

Model a portal frame with a hinge at mid-span, read its reactions and diagrams, and check every number by hand, down to the deflection of the hinge.

- **Time:** about 15 minutes.
- **You need:** EduBeam open in a second tab, on a computer with a mouse and keyboard. The [Quick start](/guide/quick-start) or the [inclined beam](/tutorials/inclined-beam) tutorial first, if you have not used EduBeam before.
- **Background:** equilibrium of a frame and free-body diagrams. The optional deflection check uses the unit load method (virtual work).
- **Units:** SI. The units chip at the bottom right of the viewer should read `m m² kN kNm MPa`. If it shows feet and kips, click it and set **Unit system** to **SI (metric)**.

**You will learn to**

- draw a frame as one polyline with the mouse,
- put a hinge inside a member with the **End hinges** boxes,
- find the horizontal thrust from the condition $M = 0$ at the hinge, and read the sign of $V$ in members drawn in different directions.

::div{.actions}
[Open EduBeam ↗](https://run.edubeam.app){target="_blank"} [Jump to the hand check](#_6-check-by-hand)
::

::model-figure{caption="The finished frame: 10 kN/m on the beam, pins at nodes 1 and 5, a hinge at node 3"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], { nodes: [2, 3], hinges: [false, true] }, [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## The problem

- Two 4 m columns, pinned at their bases, nodes 1 and 5, 8 m apart.
- A horizontal beam from node 2 to node 4 on top, with a hinge at mid-span, node 3.
- A uniform load $q = 10$ kN/m on the whole beam.
- Steel, $E = 210$ GPa, and $I_y = 8.356 \times 10^{-5}$ m⁴ (an IPE 300) for every member.

| Node | x (m) | z (m) | |
| --- | --- | --- | --- |
| 1 | 0 | 0 | pin |
| 2 | 0 | −4 | corner |
| 3 | 4 | −4 | hinge in the beam |
| 4 | 8 | −4 | corner |
| 5 | 8 | 0 | pin |

The z axis points **down**, so the tops of the columns are at $z = -4$.

**Is it determinate?** Two pins give four reactions. Three equations of equilibrium and $M_3 = 0$ at the hinge make four equations: yes.

## Model it

::div{.steps}

### Material and section {#_1-material-and-section}

1. Click **Clear mesh** in the app bar, tick **Delete materials** and **Delete cross sections**, and click **Confirm**. Nodes and elements are numbered from 1 again.
2. **Materials** tab → **Material library** → **+** on the **Steel (S235)** row, then **Cancel** to close the library.
3. **Cross sections** tab → **Add cross section**. Type `8.356e-5` in **Iy**, keep **Area**, **Height** and **Shear coefficient** at `1`, and click **Add cross section**.

An area of 1 m² keeps the members from shortening or shearing noticeably, as the hand calculation of the deflection assumes. The internal forces of a determinate frame do not depend on $E$, $A$ or $I_y$ at all.

### Draw the frame {#_2-draw-the-frame}

1. **Elements** tab → the second **Add element** button, the one with the cursor icon.
2. Click at (0, 0), (0, −4), (4, −4), (8, −4) and (8, 0). Each click adds the next node and connects it to the previous one; the clicks snap to the grid.
3. Press <kbd>Esc</kbd> to stop drawing, then <kbd>F</kbd> to fit the view.

You now have nodes 1 to 5 and elements 1 to 4, numbered in the order you drew them, as in the figures here. Compare the **Nodes** table with the table above and type over any coordinate that missed.

### Supports and the hinge {#_3-supports-and-the-hinge}

1. Click node 1 → **Node supports** → the **Pin** symbol. Do the same for node 5.
2. In the **Elements** table, find element 2, from node 2 to node 3, and tick the second of its **End hinges** boxes: the hinge at its end, at node 3.

![The Elements table: element 2 has its end hinge ticked, at node 3](/screenshots/p2t-frame-elements-table.webp)

One hinge is enough. Element 3 is then the only member rigidly attached to node 3, so no moment can pass into it there. Ticking the start of element 3 as well changes nothing.

### Load {#_4-load}

1. **Loads** tab → **Add element load**.
2. **Load type** *Uniformly distributed load*, **Element** `2`, `fz = 10`. Click **Add element load**.
3. Repeat for element 3.

`fz` is positive downward. The beam is horizontal, so the **LCS** box makes no difference here.

::

## Results {#_5-results}

In the display options at the top right of the viewer (the cog shows and hides them), **Deformed shape**, **M<sub>y</sub> (x)** and **Reactions** are on from the start. Tick **N (x)** and **V<sub>z</sub> (x)** for the rest, or untick some to see one diagram at a time. EduBeam labels them in kN and kNm with two decimals.

- Each base reads `40.00` upward and `20.00` inward.
- The bending moment reads `-80.00` at both corners and has no label at the hinge, where it is zero. EduBeam draws it on the tension side, here outside the frame.
- The normal force is negative everywhere: `-40.00` in the columns, `-20.00` in the beam. All four members are in compression.
- **Results** tab → **Nodal results**: the hinge, node 3, moves down by $D_z$ = `4.2554 · 10⁻² m`, that is 42.55 mm, the value at the hinge in the $w(x)$ view of the figure above.

## Check by hand {#_6-check-by-hand}

**Vertical reactions.** By symmetry each base takes half of the 80 kN:

$$
V_1 = V_5 = \frac{q \cdot 8}{2} = 40\ \text{kN}
$$

**Horizontal reactions.** Cut the frame at the hinge and take moments about node 3 for the left half, where the moment is zero:

$$
V_1 \cdot 4 - H_1 \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_1 = \frac{160 - 80}{4} = 20\ \text{kN}
$$

Both bases push inward by 20 kN. Without that thrust, from pins that cannot slide apart, the frame could not stand: the columns would splay and the hinge would drop.

| Quantity | Formula | By hand | EduBeam |
| --- | --- | --- | --- |
| Vertical reactions | $q \cdot 8/2$ | 40 kN | 40.00 |
| Horizontal reactions | from $M_3 = 0$ | 20 kN | 20.00 |
| Moments at the corners, nodes 2 and 4 | $H_1 \cdot 4$ | 80 kNm, outside | −80.00 |
| Moment at the hinge, node 3 | | 0 | no label |
| $N$ in the columns | $-V_1$ | −40 kN | −40.00 |
| $N$ in the beam | $-H_1$ | −20 kN | −20.00 |
| $V$ in the columns | $\pm H_1$ | ±20 kN | −20.00, 20.00 |
| $V$ in the beam at nodes 2, 3, 4 | $V_1 - q\,x$ | 40, 0, −40 kN | 40.00, no label, −40.00 |

The two columns carry the same shear with opposite signs, −20 kN in element 1 and +20 kN in element 4, because each element's local axes follow the direction it was drawn in: element 1 upward, element 4 downward. Swap the nodes of one column and its sign flips. The [sign conventions](/elements/conventions#internal-forces) explain why.

In the beam, $M(x) = -80 + 40x - 5x^2$ kNm, with $x$ measured from node 2. It is zero at the hinge and never positive: the whole beam hogs. The shear $V(x) = 40 - 10x$ is zero exactly at the hinge, so that is where the moment has its extreme.

::callout{type="details" title="The deflection of the hinge, by virtual work"}
Put a unit load downward at node 3. It gives reactions $\bar V = \bar H = 1/2$ and a moment $\bar m$ that grows from 0 at a base to 2 at a corner and falls back to 0 at the hinge, with tension outside, like the real moment $M$. Integrate $M \bar m$ over the four members:

$$
\text{columns: } 2\int_0^4 (20\,y)(0.5\,y)\,dy = 426.7
$$

$$
\text{beam: } 2\int_0^4 (80 - 40x + 5x^2)(2 - 0.5x)\,dx = 320
$$

With $EI = 210 \times 10^6 \cdot 8.356 \times 10^{-5} = 17\,548$ kNm²:

$$
\delta_3 = \frac{1}{EI}\int M \bar m\,dx = \frac{746.7}{17\,548} = 0.04255\ \text{m}
$$

That is the 42.55 mm EduBeam reports as `4.2554 · 10⁻²` m. The 4 in the last digit is the tiny shortening and shearing that an area of 1 m² still allows, which the hand calculation leaves out. With the real area of an IPE 300, $A = 53.8$ cm², and its web as the shear area (a shear coefficient of 0.40), the members shorten and shear more, and the hinge drops 43.7 mm, about 3 % more.
::

## Experiment {#_7-experiment}

Change one thing at a time, predict the result, then look. <kbd>Ctrl</kbd>+<kbd>Z</kbd> takes each change back.

**Untick the hinge.** The frame becomes once statically indeterminate. The thrust halves to 10 kN, the corner moments drop to −40 kNm, and the beam sags by 40 kNm at mid-span. Node 3 now moves down only 12.16 mm instead of 42.55 mm. The sections matter now too: give the beam a stiffer section than the columns and the corner moments grow.

::model-figure{caption="Without the hinge: less thrust, half the corner moments, and a sagging moment at mid-span"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], [2, 3], [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, w]
show: [nodeLabels]
---
::

**Fix the bases.** Give nodes 1 and 5 the **Fixed** symbol. The thrust rises to 30 kN and moments of 40 kNm appear at the bases (EduBeam shows `39.99`, because the columns shorten very slightly), yet the corner moments stay at 80 kNm. By symmetry the shear at the hinge is zero, so each half of the beam still works as a 4 m cantilever from its corner: $q \cdot 4^2/2 = 80$ kNm.

**Push sideways.** Back on pins, add a nodal load `Fx = 10` kN at node 2. The reactions lose their symmetry: 35 kN and 45 kN up, 15 kN and 25 kN horizontal. Check them with the same three equations and $M_3 = 0$; the load at node 2 has no lever arm about node 3. The left corner drops to −60 kNm, and the left half of the beam now sags slightly, by 1.25 kNm at 0.5 m from the hinge.

::model-figure{caption="A 10 kN horizontal load at node 2: the right corner now takes 100 kNm"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], { nodes: [2, 3], hinges: [false, true] }, [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
  - { node: 2, fx: 10 }
results: [M, N]
show: [nodeLabels]
---
::

**Add a second hinge.** Tick the start hinge of element 2 as well, at node 2. Two hinges in the beam on two pinned columns make a mechanism. EduBeam shows no results, reports *The hinges at nodes 2, 3 let the structure move.*, and animates the motion.

## Next steps {#next-steps}

::card-grid{cols="2"}
:::card{title="Practise: three-hinged frames" icon="lucide:dices" to="/practice?p=H2048"}
The same frame under new loads, a horizontal push among them, with your answers checked at once. Start with H2048; for more, keep only **Three-hinged frame** selected and press **New problem**.
:::
:::card{title="Next: plane truss" icon="lucide:git-fork" to="/tutorials/truss"}
Nine hinged bars: the method of joints, the method of sections, a zero-force member and a deflection by virtual work.
:::
::
