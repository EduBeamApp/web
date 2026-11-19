---
description: "Place and edit nodes in EduBeam, snap them to the grid, split elements, and pick the right support: pin, roller, fixed, slider, vertical or inclined."
source: site
---

# Nodes & supports

Nodes are the points of your model: elements connect them, and supports and nodal loads sit on them. Place them by typing coordinates or by clicking, then give the supported ones the support that matches your drawing.

## Coordinates {#coordinates}

Every node has an **X** and a **Z** coordinate in the current [length unit](/essentials/units-settings#units). X points right and **Z points down**, so anything above the ground has a negative Z: a column 4 m tall runs from `Z = 0` to `Z = −4`.

::model-figure{caption="A portal frame 6 m wide and 4 m tall: A and D are at Z = 0, B and C at Z = −4"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: fixed, D: fixed }
members: [[A, B], [B, C], [C, D]]
results: []
show: [nodeLabels, dimensions]
---
::

If you would rather have the vertical axis point up, switch to [y-up axes](/elements/conventions#y-up-axes) in Settings. Only the display changes; the model and its files stay the same.

## Adding nodes {#adding-nodes}

- **By typing.** *Nodes* tab → **Add node** (the button with the **+** icon), or right-click the canvas → *Add node*. Type X and Z, and optionally the supports and the support angle.
- **By clicking.** *Nodes* tab → **Add node** (the button with the cursor icon), or hold <kbd>Ctrl</kbd> while choosing *Add node* in the canvas menu. Every click places a node; press <kbd>Esc</kbd>, **Cancel** or the button again to stop.
- **While drawing elements.** When you [draw elements with the mouse](/essentials/elements#adding-elements), a click on empty canvas creates a node there.
- **By copying.** Select nodes (and elements), press <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd>, then click where the copy goes, or type an offset Δx, Δz in the banner and press **Paste**.

::div{.shots}

![The Add node dialog](/screenshots/qs-node.webp)

![In mouse mode, the banner at the top sets the supports and angle of every node you place](/screenshots/nodes-add-banner.webp)

::

New nodes get the next free number, `1`, `2`, `3`, …. Rename any of them in the *Node* column of the table, for example to `A`, `B`, `C`.

### Snapping {#snapping}

With **Snap to grid** on (press <kbd>S</kbd>, or the **S** chip at the bottom right of the viewer), nodes you place or drag land on the grid. The step is 0.1 m by default, or 0.5 ft in US units; change it under [Settings → Viewer settings → Grid](/essentials/units-settings#viewer-settings). For any other position, type the exact coordinates in the table.

### Placing a node on an existing element {#placing-a-node-on-an-existing-element}

Click on (or very near) an element while adding nodes with the mouse, and EduBeam asks what you mean:

- **Connect to structure** splits the element in two, `1a` and `1b`, joined at the new node. It is the quickest way to add an interior support or a point to load. Hinges at the outer ends stay where they were. Uniform and trapezoidal loads are shared between the two halves. Point and temperature loads all go to the first half, `1a`: in the *Loads* table, move a point load that lay beyond the new node to `1b` (its position now counts from the new node), and give `1b` its own temperature load.
- **Place individual node** puts the node on top of the element without connecting it.

Either way, placing nodes stops there; click the cursor button again to place more.

## Editing nodes {#editing-nodes}

| To | Do this |
| --- | --- |
| Move a node | Drag it in the viewer (press and drag on a touch screen), or type X and Z in the *Nodes* table. Connected elements, their loads and dimension lines follow. |
| Rename it | Type a new label in the *Node* column. |
| Change its supports | Click it → **Node supports**, or use the *Supported DOFs* column. See [Supports](#supports). |
| Edit everything at once | The pencil in the *Actions* column opens **Edit node**: coordinates, supports and support angle, with a preview of the symbol. |
| Delete it | The × in the table, **Delete** in the node's panel, or select it and press <kbd>Delete</kbd>. The elements, loads and dimension lines attached to it go too. |

Every change can be undone with <kbd>Ctrl</kbd>+<kbd>Z</kbd>.

## Supports {#supports}

Each node can move in three ways, its **degrees of freedom** (DOFs): `Dx` along x, `Dz` along z, and `Ry`, a rotation in the plane of the drawing. A support **restrains** some of them.

The eight supports are the eight ways to combine the three. Read the table across: the middle column turns freely, the right one is also held against rotation.

| Translations held | Rotates freely | Also held against rotation |
| --- | --- | --- |
| **Both** (`Dx` and `Dz`) | ![](/screenshots/b-support-pin.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Pin** | ![](/screenshots/b-support-fixed.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Fixed** |
| **Vertical only** (`Dz`): slides horizontally | ![](/screenshots/b-support-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Roller** | ![](/screenshots/b-support-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Slider** |
| **Horizontal only** (`Dx`): slides vertically | ![](/screenshots/b-support-vertical-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Vertical roller** | ![](/screenshots/b-support-vertical-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Vertical slider** |
| **None**: slides both ways | ![](/screenshots/b-support-free.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Free** (no support) | ![](/screenshots/b-support-rotation-only.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Rotation only** |

For each restrained DOF EduBeam computes a **reaction**: `Dx` gives a horizontal force $R_x$, `Dz` a vertical force $R_z$, `Ry` a moment $M$. So a pin gives $R_x$ and $R_z$, a roller only $R_z$, a slider $R_z$ and $M$, and a fixed support all three.

### Setting a support

Pick the symbol, or tick the DOFs one by one; the two always agree. You'll find both in three places:

- the node's panel (click the node) → **Node supports**, together with the **Nodal LCS angle**, as below;
- the **Add node** and **Edit node** dialogs;
- the *Supported DOFs* column of the *Nodes* table, where the symbol is a small menu and `Dx`, `Dz`, `Ry` are checkboxes.

![Node supports in the node's panel: the symbols, the DOF checkboxes and the support angle](/screenshots/nodes-support-picker.webp){.shot-lg}

Point at a symbol to see its name.

### Roller or slider? {#roller-or-slider}

Both sit on rails and slide along them. The difference is rotation:

- a **roller** is a pin on rails: the end **turns freely**, so there is no moment there;
- a **slider** is a fixed support on rails: the end **cannot turn**, so the support takes a moment.

The same 6 m beam under 10 kN/m, with only the right-hand support changed. Switch between the deformed shape and the bending moment:

::div{.shots}

:::model-figure{caption="Pin and roller: the right end turns freely; M = 0 there, 30 kN at each support"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

:::model-figure{caption="Pin and slider: the right end stays level; M = −45 kNm there, 37.5 kN at the slider"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: slider }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

::

The first is a simply supported beam ($M_{max} = qL^2/8 = 45\ \text{kNm}$ at midspan). Under vertical load, the slider acts just like a fixed end, so the second is a propped cantilever ($R_B = 5qL/8 = 37.5\ \text{kN}$, $M_B = -qL^2/8 = -45\ \text{kNm}$). Holding the end level also stiffens the beam: the largest deflection drops from 9.617 mm to 4 mm. The slider only differs from a fixed end when something pushes along its rails.

### Inclined (skewed) supports {#inclined-skewed-supports}

A support on a slope restrains the node along turned axes. Set the **Nodal LCS angle** α, in degrees from −180 to 180, in the node's panel under *Node supports*, in the Add and Edit node dialogs, or in the **α** field of the *Nodes* table.

The node's axes turn by α and the ticked DOFs act along them. α turns x towards z, which is **clockwise** on screen (with y-up axes it turns x towards y, counter-clockwise). So a roller on a surface falling 30° to the right is a roller with α = 30°. The symbol turns with the axes, and the reaction is reported along them.

::model-figure{caption="Roller at B turned by α = 30°: its 34.64 kN reaction is perpendicular to the slope, and the beam carries N = +17.32 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [N, M]
show: [nodeLabels]
---
::

The same beam as above, 6 m under 10 kN/m, but its roller now sits on a 30° slope. The vertical part of the reaction at B is still $qL/2 = 30\ \text{kN}$, so the reaction itself is $30/\cos 30° = 34.64\ \text{kN}$, and its horizontal part, $30 \tan 30° = 17.32\ \text{kN}$, pushes B to the right. The pin at A holds it back, so the beam is in tension. The bending moment is unchanged.

[Nodal loads](/essentials/loads#nodal-loads) on a turned node can be given in global or in node axes; a [prescribed displacement](/essentials/loads#prescribed-displacements-support-settlements) always acts along the support's own axes.

### Stability {#stability}

A structure in the plane needs at least **three restrained DOFs**, arranged so that they actually hold it. While supports are missing, the viewer shows a blue **Needs supports** chip. If there are enough but they cannot hold the structure (all parallel, or all meeting in one point), or hinges let members turn against each other, a red message names the problem and a dashed outline shows how the structure moves. [Troubleshooting](/reference/troubleshooting#messages) explains every message.

## Nodal loads and settlements {#nodal-loads-and-settlements}

Click a node → **Add load** for a force or moment, or → **Prescribe displacement** to move a support by a given amount (a settlement). Both are explained under [Nodal loads](/essentials/loads#nodal-loads).

## Dimension lines {#dimension-lines}

Dimension lines label lengths in the drawing. They don't affect the analysis, but they are saved with the project, travel in share links and appear in [exported images](/essentials/import-export#export-an-image).

| To | Do this |
| --- | --- |
| Add one | Right-click the canvas → **Add dimension**, then click the two end points. A point near a node snaps to it. |
| Dimension an element | Right-click the element → **Dimension element**. |
| Edit or flip it | Click the line → **Edit** to type its coordinates, or **Flip dimension** to put the label on the other side. |
| Move it | Drag it, or drag an end point. An end on a node stays tied to it and follows it. |
