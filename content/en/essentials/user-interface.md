---
description: "A map of the EduBeam interface: the app bar and ☰ menu, the viewer and its display options, selecting and editing, the bottom-bar tables, typing values."
source: site
---

# User interface

[EduBeam]{.edubeam} has three zones: the **app bar** at the top, the **viewer** in the middle where you draw, and the **bottom bar** with a table for every kind of object. Everything you can do in the viewer, you can also do in the tables, and the other way round.

![The parts of the interface, numbered as in the list below](/screenshots/ui-overview.webp)

1. **☰ menu**: open, save, share and export; examples and guided tours.
2. **Clear mesh** and **Share model**.
3. **Undo** and **Redo**.
4. **Viewer buttons**: center, fit to screen, and the display options.
5. **Display options**: which results and parts of the model are drawn.
6. **Grid, snap, crosshair and units.**
7. **Bottom-bar tabs**: Nodes, Elements, Loads, Materials, Cross sections, Results.
8. **The table** of the open tab, where every value can be edited.

::callout{type="tip" title="Take the tour"}
**☰ → Show me around** points out these parts in the app itself, one at a time.
::

## App bar {#app-bar}

- **☰** opens the main menu, below.
- **Clear mesh** deletes all nodes, elements and loads after you confirm; tick **Delete materials** or **Delete cross sections** to remove those too. <kbd>Ctrl</kbd>+<kbd>Z</kbd> brings the model back, and it is also kept in *Recent structures*.
- **Share model** opens the [share dialog](/essentials/import-export#share-a-link) with a link that carries the whole model.
- **What’s New?** shows the release notes. They also open by themselves once after an update.
- **Documentation** opens this guide, and the GitHub icon the source code.

On a phone, only ☰ and **Documentation** fit; **Clear mesh** and **Share model** are in the menu.

### The ☰ menu

![The ☰ menu](/screenshots/ui-app-menu.webp){.shot-xs}

- **Open project** and **Save project** open or download a `project.json` file (<kbd>Ctrl</kbd>+<kbd>O</kbd>, <kbd>Ctrl</kbd>+<kbd>S</kbd>).
- **Recent structures** keeps the last 10 models you cleared or replaced, ready to restore.
- **Export image** saves the drawing as PNG or SVG, or copies it (<kbd>Ctrl</kbd>+<kbd>P</kbd>).
- **Examples** is the gallery of ready-made models; **Draw your first beam** is a seven-step guided task; **Show me around** is the tour of the interface.
- **Share model** and **Clear mesh** are the same as the app-bar buttons.

The bottom of the menu shows the app version and its release date. Opening, saving, sharing and exporting are covered in [Files, links & export](/essentials/import-export).

## Viewer {#viewer}

The canvas, where you draw and inspect the model. It recomputes the results with every change; there is no *Solve* button.

### Buttons on the canvas {#buttons-on-the-canvas}

**Top left: Undo and Redo** step back and forward through every change to the model: adding, editing, dragging, deleting, clearing (<kbd>Ctrl</kbd>+<kbd>Z</kbd>, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>).

**Top right:**

- **Box select**, on a device with a touch screen: the next drag of your finger selects a rectangle.
- **Center content** centres the model without zooming (<kbd>C</kbd>); **Fit content to screen** zooms to fit the whole model (<kbd>F</kbd>).
- **⚙** shows or hides the [display options](#display-options).

**Bottom right:**

![The grid, snap, crosshair and units buttons](/screenshots/ui-grid-units.webp){.shot-sm}

- **G** shows or hides the grid and rulers (<kbd>G</kbd>); **S** turns snapping to the grid on or off (<kbd>S</kbd>).
- The **crosshair** button marks the pointer's position on the rulers, with a mouse only.
- The **units chip** opens the settings on [Language & Locale](/essentials/units-settings#language-locale).

### Display options {#display-options}

The ⚙ button opens two rows of checkboxes. The first picks the results drawn over the model: *Deformed shape*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)* and *Reactions*; the deformed shape, the bending moment and the reactions are on at first. The second shows or hides parts of the model: *Supports*, *Loads*, *Node labels* and *Element labels*, all on at first.

![The viewer buttons and the display options](/screenshots/ui-display-settings.webp){.shot-lg}

**More settings** opens the [viewer settings](/essentials/units-settings#viewer-settings): sizes, colours, and how the diagrams are drawn. [Results & diagrams](/essentials/results#overlays-in-the-viewer) explains what each result shows.

### Navigating {#navigating}

| Action | Mouse and keyboard | Touch |
| --- | --- | --- |
| Zoom | Mouse wheel, towards the pointer; on a trackpad, pinch or scroll with two fingers | Pinch |
| Pan | Drag with the right button or the pressed wheel; choose which in [Controls & Shortcuts](/essentials/units-settings#controls-shortcuts) | Drag with one finger |
| Fit, center | <kbd>F</kbd>, <kbd>C</kbd>, or the top-right buttons | The top-right buttons |

<kbd>Ctrl</kbd>+<kbd>+</kbd> and <kbd>Ctrl</kbd>+<kbd>-</kbd> zoom the drawing about its centre, on any keyboard layout. They never scale the whole interface, as the browser's own zoom would.

### Selecting and editing {#selecting-and-editing}

| To | Do this |
| --- | --- |
| Select one object | Click a node, element, load or dimension line. A panel opens next to it with its actions: add a load, set supports, edit, show the stiffness matrix, delete. The bottom bar switches to its tab. |
| Select several | Drag a rectangle on empty canvas (on touch, press **Box select** first). It selects every node inside it and every element it touches, with their loads and dimension lines. <kbd>Ctrl</kbd>+<kbd>A</kbd> selects everything. |
| Delete, copy, paste | <kbd>Delete</kbd>, <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd>. A paste follows the pointer until you click, or takes an offset Δx, Δz typed in the banner. |
| Move a node | Drag it. With snap on, it lands on the grid; connected elements and loads follow. |
| Edit a load | Double-click it. |
| See details | Point at anything for a tooltip: a node's displacements and rotation, an element's material and section, a load's values. On touch, tap: the panel shows the same. |
| Open the canvas menu | Right-click the canvas, or press and hold on a touch screen. |

::div{.shots}

![A node's panel: add a load, set supports, prescribe a displacement](/screenshots/ui-node-menu.webp)

![Pointing at a node shows its displacements and rotation](/screenshots/ui-hover.webp)

::

The **canvas menu** offers *Add node*, *Add element*, *Add dimension* (and *Dimension element* over an element), then *Edit*, *Copy*, *Paste* and *Delete* for the current selection. Hold <kbd>Ctrl</kbd> while choosing *Add node* or *Add element* to place them with the mouse instead of a dialog.

![The canvas menu](/screenshots/ui-canvas-menu.webp){.shot-sm}

The page [Keyboard, mouse & touch](/reference/shortcuts) lists every shortcut and gesture.

### When the model cannot be solved {#when-the-model-cannot-be-solved}

Messages appear at the top left of the viewer:

| Message | Means |
| --- | --- |
| *No materials defined*, *No cross sections defined* | Add one with the **Add new** button next to it. |
| A blue **Needs supports** chip | The model is simply unfinished: it needs more supports. |
| A red message, with **Show details** | Something is wrong. The details list every problem, each with a hint. |
| A yellow message | The model was solved, but something looks odd, such as a node no element connects to. |

When the structure can still move, EduBeam swings it as a dashed outline and circles the nodes or hinges at fault. Point at the message to see the motion again; its eye button hides it.

![A frame with hinges at B and C is a mechanism: EduBeam shows how it moves](/screenshots/ui-mechanism.webp)

[Troubleshooting](/reference/troubleshooting#messages) explains every message and how to fix it.

## Bottom bar {#bottom-bar}

Six tabs, each with a toolbar and an editable table. A tab's label shows how many objects it holds. Drag the tab strip up or down to resize the bar, or fold it away with the button at the right. The **?** next to it explains the open tab, and so does the **?** next to some column headings.

| Tab | Toolbar | Table columns |
| --- | --- | --- |
| **Nodes** | Add node (dialog), Add node (mouse) | Node, Coordinates, **Supported DOFs** (support symbol, `Dx`, `Dz`, `Ry`, angle α), Loads, Actions |
| **Elements** | Add element (dialog), Add element (mouse) | Element, Type, Nodes (with **Swap nodes**), Material, Cross section, **End hinges**, Loads, Actions |
| **Loads** | Add nodal load, Add element load | Type, Target, Components, Actions |
| **Materials** | Add material, Material library | Material, E, G, α<sub>T</sub>, Actions |
| **Cross sections** | Add cross section, Section library, Polygonal section | Shape, Cross section, Area, I<sub>y</sub>, Height, Shear coefficient, Actions |
| **Results** | Nodal results, Element results, Export CSV, Copy | Displacements per node, or end forces per element; see [Results](/essentials/results#results-tab) |

The tabs are covered in detail on [Nodes & supports](/essentials/nodes-supports), [Elements, materials & sections](/essentials/elements), [Loads](/essentials/loads) and [Results & diagrams](/essentials/results#results-tab).

### Typing values

Every number field, in the tables and in the dialogs, works the same way:

- Values are in the [current units](/essentials/units-settings#units), shown in the column heading or after the field.
- A decimal point or a comma both work: `2.5` and `2,5` are the same.
- You can type arithmetic: `+ - * / ^` and brackets, so `6/2`, `3*1.5`, `2^3` or `(4+2)/3` are worked out for you, and `1e-5` is $10^{-5}$.
- In a table, <kbd>Enter</kbd>, <kbd>Esc</kbd>, <kbd>Tab</kbd> or a click elsewhere applies the value. <kbd>Ctrl</kbd>+<kbd>Z</kbd> then takes it back; while you are still typing, it undoes the typing instead.

## Tabs above the viewer {#tabs-above-the-viewer}

**Viewer** shows the canvas. **Settings** shows the [settings](/essentials/units-settings) full-size in its place, so you can change colours or units and switch back to see the effect. The units chip and *More settings* open the same settings as a dialog over the model.

## Floating windows {#floating-windows}

**Stiffness matrix** (from an element's panel or the *Elements* table) opens a window with the element's 6 × 6 stiffness matrix in global axes. **Edit** in the canvas menu opens a table of the current selection. Move a window by dragging its title bar, and close it with the ×.
