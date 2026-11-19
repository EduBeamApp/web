---
description: "Read EduBeam's results: N, V and M diagrams, the deformed shape and reactions, their signs, hover values, result tables, CSV export and the stiffness matrix."
source: site
---

# Results & diagrams

[EduBeam]{.edubeam} solves the model after every change, so the diagrams, reactions and tables on screen always belong to the model you see. There is no *Solve* button. If nothing is drawn, the model can't be solved yet: the message at the top left of the viewer says why, and [Troubleshooting](/reference/troubleshooting) explains every message.

## Overlays in the viewer

Results are drawn over the model. Switch them on and off in the **display options** at the top right of the viewer; the ⚙ button above them shows or hides the panel.

::model-figure{caption="Three-hinged frame, 10 kN/m: switch between M, V, N and the deformed shape"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, V, N, w]
show: [nodeLabels]
height: 300
---
::

| Switch | Draws | Colour | On at first |
| --- | --- | --- | --- |
| **Deformed shape** | the displaced structure, exaggerated so it is visible | grey | yes |
| **N (x)** | normal force | blue | |
| **V<sub>z</sub> (x)** | shear force | green | |
| **M<sub>y</sub> (x)** | bending moment | red | yes |
| **Reactions** | an arrow and a value for every restrained direction | purple | yes |

A second row switches the drawing itself: **Supports**, **Loads**, **Node labels** and **Element labels**. **More settings** under the panel opens the [viewer settings](/essentials/units-settings#viewer-settings), where you set the size of the diagrams (*Results scale*), the colours, the label orientation and the diagram style.

Values are written where they matter: at the ends of each member, on both sides of a jump under a point load or over a support, and at each extreme of the diagram, such as the peak of a parabola where $V = 0$. The figure above shows the [three-hinged frame](/tutorials/three-hinged-frame), which you can check by hand: 40 kN of compression in each column, 20 kN in the beam, and −80 kNm at both corners. Its *w* view shows the hinge at C sinking 42.55 mm.

### Reading the sign

Read the sign from the **value**, not from the side of the member a diagram is drawn on. The conventions are those of most textbooks:

| Result | Positive means |
| --- | --- |
| **N** | tension |
| **V<sub>z</sub>** | it turns a short piece of the member clockwise. Since $V = \mathrm{d}M/\mathrm{d}x$, it is positive at the left support of a simply supported beam under gravity load and negative at the right |
| **M<sub>y</sub>** | sagging: tension in the bottom fibre, on the side of the **dashed line** drawn along each member |

A beam with an overhang shows both signs at once. Between the supports it sags (+13.5 kNm); over the right support it hogs (−24 kNm), with tension on top. The shear force jumps by the 54 kN reaction at B, from −30 to +24 kN:

::model-figure{caption="Overhanging beam, 12 kN/m: sagging between the supports, hogging over B"}
---
nodes: { A: [0, 0], B: [4, 0], C: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

By default the bending moment is drawn on the **tension side**, and positive normal and shear forces on the side away from the dashed line. Schools differ here, so each can be flipped in **Settings → Viewer settings → Internal force diagrams**, where you can also hatch the diagrams as by hand and label each segment with its polynomial degree. Flipping a side changes only the drawing, never the values. The full sign conventions, including the element's local axes, are in the [theory manual](/elements/conventions#internal-forces).

## Hover tooltips

Point at an object to read its values:

- **Node**: the displacements $u_x$, $u_z$ (in the displacement unit) and the rotation $\varphi_y$ (in radians).
- **Element**: its label, cross section and material.
- **Load**: its components.

On a touch screen, tap the object instead: its panel shows the same details.

![Pointing at node 2 of the Quick start beam](/screenshots/ui-hover.webp){.shot-sm}

## Results tab

The **Results** tab in the bottom bar holds two tables, switched with **Nodal results** and **Element results**.

### Nodal results

One row per node with its displacements **D<sub>x</sub>** and **D<sub>z</sub>** (in the displacement unit) and its rotation **R<sub>y</sub>** (in radians), in the global axes: positive D<sub>z</sub> is downward and positive R<sub>y</sub> is counter-clockwise on screen. A supported direction shows 0, or the settlement you prescribed. The reactions are not in this table: read them on the drawing, or in the [CSV export](#export-csv-and-copy).

![Nodal results of the three-hinged frame above, with Number format set to Automatic](/screenshots/p2c-results-nodal.webp){.shot-lg}

### Element results

One row per element with its **end forces in the element's local coordinate system**:

| Column | Meaning |
| --- | --- |
| X<sub>12</sub>, Z<sub>12</sub>, M<sub>12</sub> | axial force, shear force and moment acting on the element at its **start** node |
| X<sub>21</sub>, Z<sub>21</sub>, M<sub>21</sub> | the same at its **end** node |

![Element results of the three-hinged frame: the end forces of its four members](/screenshots/p2c-results-element.webp)

End forces are the forces the nodes exert on the element. They follow the local axes, not the N-V-M convention of the diagrams, so their signs differ:

- **Simply supported beam** (6 m, 12 kN/m, the [Quick start](/guide/quick-start)): Z<sub>12</sub> = Z<sub>21</sub> = −36 kN. Both supports push the beam up, which is −z.
- **Cantilever** fixed at its start node, 18 kN down at the tip: Z<sub>12</sub> = −18 kN, M<sub>12</sub> = +72 kNm, Z<sub>21</sub> = +18 kN, M<sub>21</sub> = 0.
- **Column 1 of the frame** (A at the bottom, B at the top): X<sub>12</sub> = +40 kN pushes along the local x axis into the element, which is 40 kN of compression.

More on this table in the [theory manual](/elements/conventions#end-forces-element-results-table).

### Export CSV and Copy

**Export CSV** downloads `edubeam-results.csv` with both tables, in the units shown on screen and ready for a spreadsheet. **Copy** puts the same tables on the clipboard as tab-separated text, which pastes straight into Excel, LibreOffice or Google Sheets.

| Table | Columns |
| --- | --- |
| Nodes | Node, x, z, Dx, Dz, Ry, and the **reactions** Rx, Rz, My |
| Elements | Element, Node 1, Node 2, and the end forces N1, V1, M1, N2, V2, M2 |

Every header carries its unit, for example `Dz [mm]`. The element end forces are the same local values as X<sub>12</sub> … M<sub>21</sub> on screen.

### Stiffness matrix

Choose **Stiffness matrix** in an element's panel, or with the button in its row of the *Elements* table, to open the element's 6 × 6 stiffness matrix in **global coordinates** and SI units (N, m). It is handy for checking hand assembly in a stiffness-method course; the formulas are in the [theory manual](/elements/beam).

## Number format

The tables and tooltips show results to five significant digits. **Settings → Language & Locale → Number format** decides how they are written:

| Format | 40 000 is written as | Use it for |
| --- | --- | --- |
| **Scientific** (default) | 4 · 10⁴ | values that span many orders of magnitude |
| **Engineering** | 40 · 10³ | reading off kilo and mega prefixes |
| **Automatic** | 40,000 | everyday numbers in teaching |

*Automatic* writes values from 0.001 up to 100 000 as plain numbers. Outside that range it writes them as *Engineering* does, with powers of ten in steps of three, such as 380.95 · 10⁻⁹ in the nodal results above. The decimal separator follows the language.

The labels on the drawing (diagram values and reactions) always have two decimals, whatever the number format: 6.6667 kN reads 6.67. Read the tables or tooltips when you need more digits.

## Precision and accuracy

- The beam element is exact for the linear Timoshenko model under nodal, uniform, trapezoidal, concentrated and temperature loads. Results do **not** depend on the number of elements, and there is no mesh to refine.
- The computation runs in double precision. A value smaller than a trillionth of the largest value of its kind is round-off, and the tables show it as 0.
- Deflections include **shear deformation**, and in a statically indeterminate structure it shifts the forces slightly too. For slender members it adds a fraction of a percent to the Euler–Bernoulli deflection; for short, deep members it can reach ten percent or more. [Checking results by hand](/guide/verification#shear-deformation) shows how large it is, and how to switch it off for a comparison with textbook formulas.

## Results in a report

- **☰ → Export image** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) saves the drawing as PNG or SVG with the diagrams you choose. See [Export an image](/essentials/import-export#export-an-image).
- **Export CSV** or **Copy** in the Results tab gives the numbers.
- **Share model** gives a link, so the reader can open the model itself.
- For lecture notes and exercise sheets, [@edubeam/plot](/plot) draws the same diagrams from code.
