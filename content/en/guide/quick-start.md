---
description: "Model a simply supported steel beam in EduBeam in ten minutes: material, section, nodes, supports and load, then read the results and check them by hand."
source: site
---

# Quick start

In about ten minutes you will build a simply supported steel beam, read its reactions, shear force, bending moment and deflection, and check every number by hand. Open EduBeam in a second tab, or next to this page, and follow along.

::div{.actions}
[Open EduBeam ↗](https://run.edubeam.app){target="_blank"} [Jump to the hand check](#_8-check-by-hand)
::

## The problem

A 6 m beam rests on a pin at node 1 and a roller at node 2, and carries a uniform load of 12 kN/m along its whole length. It is a steel IPE 200: $E = 210$ GPa, $G = 81$ GPa, $A = 28.48\ \text{cm}^2$ and $I_y = 1943\ \text{cm}^4$. All four come from EduBeam's libraries, so there is nothing to look up.

::model-figure{caption="The beam you will build: a 6 m span from node 1 to node 2, under 12 kN/m"}
---
nodes: { 1: [0, 0], 2: [6, 0] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 12 }
results: []
show: [nodeLabels, dimensions]
---
::

## Build the model {#build-the-model}

::div{.steps}

### Start from an empty model {#start-from-an-empty-model}

On your first visit, a welcome dialog asks how you would like to start. Pick **SI (metric)** under **Unit system**, keep **x right, z down** under **Coordinate system**, and press **Skip for now**. The app then shows a small example frame.

1. Press **Clear mesh** in the app bar (on a phone, it is in the **☰** menu).
2. Tick **Delete materials** and **Delete cross sections**, and press **Confirm**.

The canvas is now empty, and two red messages say that there is no material and no cross section yet. The next steps fix that. Nothing is lost: <kbd>Ctrl</kbd>+<kbd>Z</kbd> brings the frame back, and it is also kept in **☰ → Recent structures**.

### Check the units {#_1-check-the-units}

The chip at the bottom right of the viewer lists the units that every field and result uses. This page uses SI units, which the chip shows as `m m² kN kNm MPa`, and the z axis pointing down. If the chip shows feet and kips, click it and set **Unit system** to **SI (metric)**. In the same place, **Coordinate system** must be **x right, z down**: with y up, a positive load points up, and the signs on this page would not match.

![The grid (G) and snap (S) toggles, the crosshair and the units chip](/screenshots/ui-grid-units.webp){.shot-sm}

### Add the material and cross section {#_2-add-the-material-and-cross-section}

Every element needs a material and a cross section, so add them first, from the libraries.

1. Open the **Materials** tab in the bottom bar and click **Material library**.
2. Press **+** on the **Steel (S235)** row ($E = 210\,000$ MPa, $G = 81\,000$ MPa). The library stays open for more, so close it with **Cancel**.
3. Open the **Cross sections** tab and click **Section library**.
4. Scroll to the **IPE 200 (approx)** row, press **+**, and close the library with **Cancel**.

Both red messages are gone, and the **Cross sections** tab lists the IPE 200:

![The IPE 200 in the Cross sections tab: area, Iy, height and shear coefficient](/screenshots/a-qs-cross-sections.webp)

To type in your own values instead, use **Add material** and **Add cross section**. The shear coefficient, 0.3933 here, comes up again in the [hand check](#_8-check-by-hand).

### Add the nodes {#_3-add-the-nodes}

1. Open the **Nodes** tab. It has two **Add node** buttons: **+** opens a dialog, and the one with the cursor icon places nodes with the mouse. Click **+ Add node**.
2. Leave **X-coordinate** and **Z-coordinate** at `0` and press **Add node**. The dialog closes, and node `1` appears.
3. Click **+ Add node** again, enter `6` in **X-coordinate**, and press **Add node**. This is node `2`.

![The Add new node dialog. It can also set the supports straight away.](/screenshots/qs-node.webp){.shot-md}

### Connect them with an element {#_4-connect-them-with-an-element}

Open the **Elements** tab and click **+ Add element**. The dialog already proposes **Initial node** `1`, **End node** `2`, and your material and section. Press **Add element**.

![Add new element: the two end nodes, an optional hinge at each end, the material and the section](/screenshots/a-qs-element.webp){.shot-md}

A beam appears between the nodes. Press <kbd>F</kbd> to fit it to the screen. A blue **Needs supports** chip at the top left of the viewer tells you why there are no results yet.

### Add the supports {#_5-add-the-supports}

Back in the **Nodes** tab, each row has a support picker at the start of the **Supported DOFs** column.

- Node `1`: pick **Pin**. This ticks `Dx` and `Dz`.
- Node `2`: pick **Roller**. This ticks `Dz` only.

![The support picker in the Nodes table](/screenshots/a-qs-support-picker.webp){.shot-lg}

The **Needs supports** chip disappears. You can also click a node in the viewer and choose **Node supports**. [Nodes & supports](/essentials/nodes-supports#supports) lists every support type.

### Add the load {#_6-add-the-load}

1. Open the **Loads** tab and click **Add element load**.
2. Keep **Load type** *Uniformly distributed load* and **Element** `1`.
3. Enter `12` in **fz**, leave **fx** at `0`, and press **Add element load**.

![The dialog previews the load on the element](/screenshots/a-qs-load.webp){.shot-md}

Positive `fz` points along +z, which is **down**, so a positive value is a gravity load. The ticked **LCS** box means the load follows the element's own axes; for a horizontal beam drawn from left to right, they are the same as the global axes. See the [sign conventions](/elements/conventions#loads).

::

## Read the results {#_7-read-the-results}

The beam is solved the moment the load is in, and again after every change you make: there is no *Solve* button. The panel at the top right of the viewer switches the drawings on and off. **Deformed shape**, **M<sub>y</sub>(x)** and **Reactions** are on from the start. Tick **V<sub>z</sub>(x)** to add the shear force.

![The display options, with the shear force switched on](/screenshots/a-qs-display.webp){.shot-md}

Your screen should now match this figure. Switch between the bending moment and the shear force:

::model-figure{caption="The finished beam: 36 kN reactions and 54 kNm at mid-span"}
---
nodes: { 1: [0, 0], 2: [6, 0] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 12 }
results: [M, V]
show: [nodeLabels]
---
::

| Drawing | What to look for |
| --- | --- |
| **Reactions** | Two upward arrows of **36 kN**, one at each support. |
| **V<sub>z</sub>(x)** | A straight line from **+36 kN** at node `1` to **−36 kN** at node `2`, crossing zero at mid-span. |
| **M<sub>y</sub>(x)** | A parabola with its peak of **54 kNm** at mid-span, drawn on the tension side, below the beam. |
| **Deformed shape** | A symmetric sag, drawn magnified. |

For the numbers, open the **Results** tab. **Nodal results** lists the displacements `Dx`, `Dz` and the rotation `Ry` of each node, and **Element results** lists the end forces of each element in its own axes. Node `1` turns by $R_y = -2.6469 \cdot 10^{-2}$ rad, and node `2` by the same amount the other way. [Results & diagrams](/essentials/results) explains every table and sign.

If the diagrams look too large or too small, change **Results scale** in **Settings → Viewer settings**.

## Check by hand {#_8-check-by-hand}

With $q = 12$ kN/m and $L = 6$ m, the textbook formulas give:

| Quantity | Formula | By hand | EduBeam |
| --- | --- | --- | --- |
| Reactions | $qL/2$ | 36 kN | 36 kN |
| Largest shear force | $qL/2$ | 36 kN | 36 kN |
| Largest moment | $qL^2/8$ | 54 kNm | 54 kNm |
| End rotation | $qL^3/(24EI)$ | 0.02647 rad | 0.02647 rad |
| Mid-span deflection | $w_b + w_s$ | 49.63 + 0.60 = 50.22 mm | 50.22 mm |

The deflection has two parts, and most textbooks give only the first:

- **Bending:** $w_b = 5qL^4/(384EI) = 49.63$ mm, with $EI = 4080$ kNm² from $E = 210$ GPa and $I_y = 1943\ \text{cm}^4$.
- **Shear:** $w_s = qL^2/(8kGA) = 0.60$ mm, with $kGA \approx 90\,700$ kN from $k = 0.3933$, $G = 81$ GPa and $A = 28.48\ \text{cm}^2$.

There is no node at mid-span yet, so add one to read the deflection there:

1. In the **Nodes** tab, click the second **Add node** button, the one with the cursor icon.
2. Click the beam at `x = 3`; with snap on, the node lands on the grid. EduBeam asks what to do with the node: press **Connect to structure**. The element is split into `1a` and `1b`, its load with it, and placing nodes stops. If node `3` is not at X = `3` in the **Nodes** tab, type `3` there.
3. In **Results → Nodal results**, node `3` now shows $D_z = 5.0224 \cdot 10^{-2}$ m, that is 50.22 mm.

![Nodal results after the split: node 3 moves down by 50.22 mm](/screenshots/a-qs-nodal-results.webp){.shot-lg}

Splitting the beam changes no result, because the element is exact for these loads: there is no mesh to refine.

::callout{type="details" title="Why the shear coefficient matters"}
EduBeam uses Timoshenko beam elements, which include shear deformation. The shear coefficient $k$ scales the area that carries shear, so $kGA$ is the shear stiffness. For the library's I-sections $k$ is the web's share of the area, $h t_w / A$: for the IPE 200, $0.2 \cdot 0.0056 / 0.002848 = 0.3933$. The shear part of the deflection, $w_s = qL^2/(8kGA)$, is the integral of $V/(kGA)$ from a support to mid-span.

For this slender beam the shear part is 0.60 mm, about 1 % of the total. In a short, deep beam it is much larger. Set the shear coefficient to a very large number (`1e10`, say) in the **Cross sections** tab, and EduBeam returns the bending-only 49.63 mm. The [beam element page](/elements/beam) has the theory.
::

More hand-check recipes (cantilever, fixed beam, truss, temperature, settlement) are in [Checking results by hand](/guide/verification).

## Experiment {#_9-experiment}

Change the model and watch the diagrams follow. Try each change on its own, and undo it with <kbd>Ctrl</kbd>+<kbd>Z</kbd> before the next. Node `3` is the mid-span node you just added.

- **Drag node `2`** to the right. The moment grows with $L^2$ and the deflection with $L^4$.
- **Tick `Ry` at node `1`** to clamp that end. A hogging moment appears at the clamp: $qL^2/8 = 54$ kNm by the textbook formula, 53.8 kNm in EduBeam. In a statically indeterminate beam the shear stiffness changes the forces too.
- **Tick `Dz` at node `3`** to add a middle support and make a two-span continuous beam. The moment over the middle support turns hogging: $q(L/2)^2/8 = 13.5$ kNm by hand, 13.3 kNm in EduBeam, for the same reason.
- **Tick `Dz` at node `3`, and the second box in the *End hinges* column of element `1a`** (its end at node `3`) in the **Elements** tab. The beam turns into two simple spans of 3 m. Now untick `Dz` at node `3`: the beam becomes a mechanism, and EduBeam shows how it can move.

To play with span and load without building anything, drag the sliders below, and switch between the results to see how each one grows with the span.

::example-structure
::

## Save or share {#_10-save-or-share}

- **Send it to someone.** Press **Share model** in the app bar, then **Copy**. The link holds the whole model, and whoever opens it gets their own copy to edit.
- **Keep it as a file.** **☰ → Save project** (<kbd>Ctrl</kbd>+<kbd>S</kbd>) downloads a `project.json`. Open it again with **☰ → Open project** (<kbd>Ctrl</kbd>+<kbd>O</kbd>) or by dropping it on the app.
- **Put the drawing in a report.** **☰ → Export image** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) saves it as PNG or SVG.

The model is also kept in your browser, so reloading the page does not lose it. [Files, links & export](/essentials/import-export) has the details.

## Where next

::card-grid{cols="2"}
:::card{title="Tutorials" icon="lucide:graduation-cap" to="/tutorials/inclined-beam"}
Four models built step by step and checked by hand, from an inclined beam to a continuous beam with a settling support.
:::
:::card{title="Examples" icon="lucide:library" to="/examples/"}
Ready-made beams, frames and trusses that open in one click, with exercises and answers.
:::
:::card{title="Loads" icon="lucide:arrow-down-to-line" to="/essentials/loads"}
Trapezoidal, concentrated and temperature loads, nodal forces and support settlements.
:::
:::card{title="Keyboard, mouse & touch" icon="lucide:keyboard" to="/reference/shortcuts"}
Draw nodes and elements straight on the canvas, and edit faster.
:::
::
