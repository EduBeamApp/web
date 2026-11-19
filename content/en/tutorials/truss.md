---
description: "Tutorial: build a plane truss in EduBeam from hinged bars, check its bar forces with the method of joints and the method of sections, find a zero-force member, and check a deflection by virtual work. About 20 minutes."
source: site
---

# Tutorial: plane truss

Build a small statically determinate truss from hinged bars, check its bar forces with the method of joints and the method of sections, and check a deflection by virtual work.

- **Time:** about 20 minutes.
- **You need:** EduBeam open in a second tab, on a computer with a mouse and keyboard. The [Quick start](/guide/quick-start), or one of the tutorials before this one, if you have not used EduBeam before.
- **Background:** the method of joints and the method of sections. The optional deflection check uses the unit load method (virtual work).
- **Units:** SI. The units chip at the bottom right of the viewer should read `m m² kN kNm MPa`. If it shows feet and kips, click it and set **Unit system** to **SI (metric)**.

**You will learn to**

- model truss bars as beam elements with both end hinges, drawn with the mouse,
- check bar forces by the method of joints and the method of sections,
- spot a zero-force member, and see why a pin-jointed model works for a truss.

::div{.actions}
[Open EduBeam ↗](https://run.edubeam.app){target="_blank"} [Jump to the hand check](#_5-check-by-hand)
::

::model-figure{caption="The finished truss: 30 kN at nodes 2 and 3, bar forces with tension positive"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: roller }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 30 }
  - { node: 3, fz: 30 }
results: [N, w]
show: [nodeLabels, dimensions]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

## The problem

- A 12 m span in three 4 m panels, 3 m deep: bottom chord nodes 1 to 4, top chord nodes 5 and 6.
- A pin at node 1 and a roller at node 4.
- Two loads of 30 kN, at the bottom-chord nodes 2 and 3.
- Steel bars, $E = 210$ GPa, $A = 20$ cm².

| Elements | Bars, by their nodes | |
| --- | --- | --- |
| 1, 2, 3 | 1–2, 2–3, 3–4 | bottom chord |
| 4, 5, 6 | 1–5, 5–6, 6–4 | end diagonal, top chord, end diagonal |
| 7, 8, 9 | 2–5, 5–3, 3–6 | vertical, middle diagonal, vertical |

**Is it determinate?** With $m = 9$ bars, $r = 3$ reactions and $j = 6$ joints, $m + r = 12 = 2j$. Each joint gives two equations of equilibrium, so the bar forces follow from statics alone.

## Model it

::div{.steps}

### Material and section {#_1-material-and-section}

1. Click **Clear mesh** in the app bar, tick **Delete materials** and **Delete cross sections**, and click **Confirm**. Nodes and elements are numbered from 1 again.
2. **Materials** tab → **Material library** → **+** on the **Steel (S235)** row, then **Cancel** to close the library.
3. **Cross sections** tab → **Add cross section**. Type `0.002` in **Area** and `1e-6` in **Iy**, keep **Height** and **Shear coefficient** at `1`, and click **Add cross section**.

With hinged bars only the area matters; $I_y$ just has to be positive.

### Draw the bars with hinges {#_2-draw-the-bars-with-hinges}

A truss bar in EduBeam is a beam element with **both end hinges** ticked. The mouse tool can tick them for you, and the order you draw in gives the numbers in the table above.

1. **Elements** tab → the second **Add element** button, the one with the cursor icon.
2. In the banner at the top of the viewer, tick **Start hinge** and **End hinge**. Every bar you draw now gets both.
3. Bottom chord: click (0, 0), (4, 0), (8, 0) and (12, 0), then press <kbd>Esc</kbd>.
4. Top: click the **Add element** button again, then node 1 at (0, 0), (4, −3), (8, −3) and node 4 at (12, 0). Clicking an existing node connects to it instead of adding a new one. Press <kbd>Esc</kbd>.
5. Web: once more, click node 2 at (4, 0), node 5 at (4, −3), node 3 at (8, 0) and node 6 at (8, −3). Press <kbd>Esc</kbd>, then <kbd>F</kbd> to fit the view.

The **Elements** table should now list the nine elements of the table above, each with both **End hinges** ticked. <kbd>Esc</kbd> leaves the drawing mode, but the hinge boxes in the banner stay ticked for the next time.

### Supports and loads {#_3-supports-and-loads}

1. Click node 1 → **Node supports** → the **Pin** symbol. Give node 4 the **Roller**.
2. Click node 2 → **Add load** → `Fz = 30` → **Add nodal load**. Do the same at node 3.

Positive `Fz` points down. Every bar at a joint is hinged, so nothing holds the joint against rotation; EduBeam accepts that and reports the rotation of such a node as 0.

::

## Results {#_4-results}

In the display options at the top right of the viewer (the cog shows and hides them), untick **Deformed shape** and **M<sub>y</sub> (x)**, as there is no bending in a truss, and tick **N (x)**. Tension is positive, and EduBeam labels the forces in kN with two decimals.

- Both supports read `30.00` upward; the pin's horizontal reaction reads `0.00`, as no horizontal load acts.
- The bottom chord reads `40.00` in all three bars, tension; the top chord `-40.00`, compression.
- The middle diagonal, 5–3, carries nothing, so it has no label, as in the figure at the top.
- **Results** tab → **Nodal results**: node 2 moves down by $D_z$ = `2.2937 · 10⁻³ m`, that is 2.294 mm.

## Check by hand {#_5-check-by-hand}

**Reactions.** The loads are symmetric, so $R_1 = R_4 = 30$ kN upward, and with no horizontal load the pin's horizontal reaction is zero.

**Joint 1** (method of joints). The end diagonal 1–5 is 5 m long, so $\sin\alpha = 3/5$ and $\cos\alpha = 4/5$:

$$
\textstyle\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \ \Rightarrow\ N_{15} = -50\ \text{kN}
$$

$$
\textstyle\sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}
$$

**Joint 2.** The vertical 2–5 is the only bar that can carry the 30 kN load up: $N_{25} = +30$ kN, and $N_{23} = N_{12} = 40$ kN.

**Section through the middle panel** (method of sections). Cut bars 5–6, 5–3 and 2–3 and keep the left part:

- Moments about node 3: $R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN.
- Vertical forces: the shear in the panel is $R_1 - 30 = 0$, so the middle diagonal **5–3 carries nothing**: $N_{53} = 0$.

| Bars | By hand | EduBeam |
| --- | --- | --- |
| Bottom chord 1–2, 2–3, 3–4 | +40 kN, tension | 40.00 |
| Top chord 5–6 | −40 kN, compression | −40.00 |
| End diagonals 1–5, 6–4 | −50 kN | −50.00 |
| Verticals 2–5, 3–6 | +30 kN | 30.00 |
| Middle diagonal 5–3 | 0 | no label |

A zero-force member is not a useless one: it carries nothing under *this* load, but take it away and the truss collapses, as the experiments below show.

::callout{type="details" title="The deflection of node 2, by virtual work"}
Put a unit load downward at node 2 and solve the truss again by hand: $R_1 = 2/3$, $R_4 = 1/3$, and the bar forces $n$ below. The deflection is $\delta = \sum N\,n\,L / (EA)$:

| Bar | $N$ (kN) | $n$ | $L$ (m) | $N\,n\,L$ |
| --- | --- | --- | --- | --- |
| 1–2 | 40 | 8/9 | 4 | 142.2 |
| 2–3 | 40 | 8/9 | 4 | 142.2 |
| 3–4 | 40 | 4/9 | 4 | 71.1 |
| 1–5 | −50 | −10/9 | 5 | 277.8 |
| 5–6 | −40 | −4/9 | 4 | 71.1 |
| 6–4 | −50 | −5/9 | 5 | 138.9 |
| 2–5 | 30 | 1 | 3 | 90.0 |
| 5–3 | 0 | −5/9 | 5 | 0 |
| 3–6 | 30 | 1/3 | 3 | 30.0 |
| | | | sum | 963.3 |

$$
\delta_2 = \frac{963.3}{EA} = \frac{963.3}{210 \times 10^6 \cdot 0.002} = 0.002294\ \text{m}
$$

That is 2.294 mm, the same as EduBeam's $D_z$ of node 2, `2.2937 · 10⁻³` m.
::

## Experiment {#_6-experiment}

Change one thing at a time, predict the result, then look. <kbd>Ctrl</kbd>+<kbd>Z</kbd> takes each change back.

**Move one load.** Put both loads at node 2: delete the load at node 3 and change the other to `Fz = 60`. Now $R_1 = 40$ kN, the shear in the middle panel is $40 - 60 = -20$ kN, and the middle diagonal has to carry it: $N_{53} = -20 \cdot 5/3 = -33.33$ kN, in compression.

::model-figure{caption="60 kN at node 2: the middle diagonal 5–3 now carries the panel shear"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: roller }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 60 }
results: [N]
show: [nodeLabels]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

**Remove the middle diagonal.** Delete element 8. The middle panel becomes a hinged rectangle that can shear sideways. EduBeam shows no results, reports *The hinges at nodes 2, 3, 5, 6 let the structure move.*, the four corners of that panel, and animates the motion.

**Untick all the hinges** in the **Elements** table. The truss becomes a frame with rigid joints. Tick **M<sub>y</sub> (x)**: the bending moments stay below 0.1 kNm and the normal forces change by less than 0.1 %. That is why the pin-jointed idealisation works for a triangulated truss.

**Pin both supports.** A fourth reaction makes the truss once indeterminate, and the result may surprise you: the bottom chord now carries **nothing**, and each support pushes inward by 40 kN instead. Nodes 1 and 4 cannot move apart, so the three bars of the chord between them, in line, must have a total elongation of zero. They all carry the same force, so that force is zero, and its 40 kN goes into the supports. This holds whatever the bar areas.

::model-figure{caption="Both supports pinned: the supports take over the job of the bottom chord"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: pin }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 30 }
  - { node: 3, fz: 30 }
results: [N]
show: [nodeLabels]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

## Next steps {#next-steps}

The theory behind the bar element is in [Truss element](/elements/truss).

::card-grid{cols="2"}
:::card{title="Practise: Warren trusses" icon="lucide:dices" to="/practice?p=T2048"}
Reactions and the force in one bar of a larger truss, with your answers checked at once. Start with T2048; for more, keep only **Warren truss** selected and press **New problem**.
:::
:::card{title="Next: continuous beam and settlement" icon="lucide:spline" to="/tutorials/continuous-beam"}
A statically indeterminate beam: what continuity buys, what a settling support does to it, and the force method to check both.
:::
::
