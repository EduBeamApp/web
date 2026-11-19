---
description: "Save and open EduBeam projects and desktop sessions, share a model as a link, embed a live viewer, and export images and result tables, all in your browser."
source: site
---

# Files, links & export

:span{#import-export-sharing}

Save your model as a file, send it as a link, embed it in a web page, or export a picture or a table of it. Everything in [EduBeam]{.edubeam} happens in your browser and nothing is uploaded: a share link literally contains the model.

::card-grid{cols="3"}
:::card{title="Project file" icon="lucide:file-json" to="#save-a-project"}
`project.json` to keep, hand in or open later.
:::
:::card{title="Share link" icon="lucide:link" to="#share-a-link"}
The whole model in one URL, for notes, slides and messages.
:::
:::card{title="Image or table" icon="lucide:image" to="#export-an-image"}
PNG or SVG for reports, CSV for spreadsheets.
:::
::

## Save a project

**☰ → Save project** or <kbd>Ctrl</kbd>+<kbd>S</kbd> (<kbd>⌘</kbd>+<kbd>S</kbd> on a Mac, as for every shortcut on this page) downloads `project.json`. It holds the nodes, elements, materials, cross sections (with drawn shapes), loads, dimension lines and the app version that wrote it. Rename the file freely.

## Open a project

**☰ → Open project** or <kbd>Ctrl</kbd>+<kbd>O</kbd>, then pick the file, or **drop the file anywhere onto the app window**. EduBeam opens:

- `project.json` files saved by every version of EduBeam;
- `.xml` sessions saved by the **desktop EduBeam** 2.x to 3.5. Their values carry no units, so they are read as kN, kPa and m, the units its manual used. EduBeam opens one load case at a time: a session with several opens the first and names the ones it left out.

Opening replaces the current model, including its materials and cross sections. The model you had is not lost: <kbd>Ctrl</kbd>+<kbd>Z</kbd> brings it back, and it is kept in [Recent structures](#recent-structures). A file EduBeam can't read is refused with a message, and your model stays as it was.

## Share a link

**Share model**, in the app bar or the ☰ menu, opens the *Share model via URL* dialog:

![The Share model via URL dialog](/screenshots/c1-share.webp){.shot-lg}

- **Copy**, or a click anywhere in the field, copies the link.
- **Open link** opens it in a new tab, so you see what the recipient will see.
- **Share via system dialog** hands the link to your device's share sheet, where the browser supports it.
- **Shorter link** (on by default) writes the same model in about half the characters. Copies of EduBeam older than version 1.3.2 (November 2026) can't read it until they update, so switch it off when a link has to open everywhere right away.
- **Show what I see** (off by default) makes the link open with the diagrams, loads and labels you have switched on, rather than the recipient's own display options.

The link has the form `https://run.edubeam.app/?model=…` and encodes the entire model. Whoever opens it gets their own copy to edit; changes are **not** synchronised back, so send a new link when the model changes. Very large models make very long links; share the project file instead.

When someone opens a link, their own previous model goes to Recent structures, and a message tells them where to find it. Links never expire: a link in last year's lecture notes opens the same model today.

## Embed a viewer {#embed-a-read-only-viewer}

Add `&viewer=1` to a share link to open the model in **viewer mode**: the app bar, the bottom bar, undo and redo, the grid and units chips and the crosshair are hidden, leaving the drawing, the fit and centre buttons and the display options. The welcome dialog and the release notes don't open either. Put that URL in an `<iframe>` to embed a live, zoomable model in lecture notes, a course page or a slide:

```html
<iframe
  src="https://run.edubeam.app/?viewer=1&show=MRLS&model=…"
  width="100%"
  height="400"
></iframe>
```

![The three-hinged frame in viewer mode](/screenshots/viewer-mode.webp){.shot-lg}

Viewer mode is for looking, but it is not locked: visitors can still drag nodes and switch diagrams. Opened on its own, a viewer link replaces the visitor's own model like any link, and their model waits in Recent structures. Embedded in a page on another site, most current browsers give the frame storage of its own, which leaves the visitor's model alone, but not every browser does.

For a figure that doesn't need the app at all, such as a static diagram in a page, a slide or an exercise sheet, [@edubeam/plot](/plot) draws structures and their diagrams from code. The live figures on this site are drawn with it.

## URL parameters

| Parameter | Effect |
| --- | --- |
| `model=<data>` | Load the encoded model and fit it to the screen. Written by **Share model**. |
| `viewer=1` | [Viewer mode](#embed-a-read-only-viewer). |
| `show=<letters>` | Open with exactly these layers on, one letter each: `N` normal force, `V` shear force, `M` bending moment, `U` deformed shape, `R` reactions, `L` loads, `S` supports, `n` node labels, `e` element labels. `show=MRLS` shows the bending moment, reactions, loads and supports. Written by **Show what I see**. |
| `lang=<code>` | Switch the interface language: `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn` (Chinese), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`. |
| `panel=examples` | Open the examples gallery straight away. |

Parameters combine with `&`, as in `?lang=de&viewer=1&model=…`. EduBeam removes them from the address bar once it has read them. `lang` and `show` are kept as the visitor's settings, just as if they had chosen them in the app.

## Export an image {#export-an-image}

**☰ → Export image** or <kbd>Ctrl</kbd>+<kbd>P</kbd> opens the image export. The drawing is laid out afresh for the size you pick, so lines and labels keep their real thickness.

![Export image: choose the layers, the frame and the size, then download or copy](/screenshots/export-image.webp)

::div{.steps}

### Choose the layers

The chips at the top choose what is drawn: the deformed shape, N, V, M and reactions, then supports, loads, node labels and element labels. They start as the viewer's display options, and changing them here leaves the viewer as it is.

### Frame the drawing

Pick an aspect ratio (16:9, 4:3, 3:2 or 1:1), **Fit all**, or **Window…** to drag a rectangle over the drawing. You can also drag the edges of the preview.

### Set the size

Width and height in pixels, or a **Scale** such as 1 : 50 for a drawing to scale on paper (at 96 DPI). **Diagram height** sets the size of the result diagrams, and **Transparent background** leaves out the white. If the diagrams or labels don't fit, the dialog says so and offers to shrink the diagrams or enlarge the canvas.

### Save it

**Download PNG**, **Download SVG** or, where the browser allows it, **Copy to clipboard**. The files are named after their size, such as `edubeam-512x512.svg`. On a high-resolution screen the PNG has more pixels than the width and height you set, in proportion to the screen's pixel density, so that it is as sharp as the app; its size in pixels is shown next to the buttons.

::

SVG stays sharp at any size and works in Word, Inkscape and LaTeX on Overleaf, which makes it the best choice for reports and theses. The same size always frames the structure the same way, so N, V and M exported one after another line up side by side.

To make such figures from code, for example one for every exercise on a sheet, @edubeam/plot writes [a standalone SVG file](/plot/functions#a-standalone-svg-file) that opens in the same programs.

## Export the results

**Export CSV** in the **Results** tab downloads both result tables, including the reactions, and **Copy** puts them on the clipboard for a spreadsheet. See [Export CSV and Copy](/essentials/results#export-csv-and-copy).

## Recent structures {#recent-structures}

**☰ → Recent structures** keeps the last 10 structures that were cleared, or replaced by a link, a file, an example, the first-beam task or another restore. Each shows a thumbnail, what replaced it, and its number of nodes and elements. **Restore** brings one back: the model you had then joins the list in turn, and <kbd>Ctrl</kbd>+<kbd>Z</kbd> undoes the restore. **Remove** deletes an entry.

![Recent structures](/screenshots/recent.webp){.shot-lg}

The list is stored in this browser only.

## Examples

**☰ → Examples** opens a gallery of ready-made teaching models. Opening one replaces your model, and <kbd>Ctrl</kbd>+<kbd>Z</kbd> brings yours back. The same models, with exercises, are on the [Examples](/examples/) page of this guide.

![The examples gallery](/screenshots/examples.webp){.shot-lg}

## Automatic persistence

Your model and settings are saved in the browser's local storage after every change and restored when you come back, even after closing the browser. This is a convenience, not a backup: it belongs to one browser profile on one device, a private window forgets it, and clearing the site data removes it. Save important work as a project file. [What is stored in your browser](/essentials/units-settings#what-is-stored-in-your-browser) lists everything.

## Project file format

`project.json` is plain, readable JSON. This is the [Quick start](/guide/quick-start) beam, with the steel and the IPE 200 from the libraries:

```json [project.json]
{
  "edubeam": true,
  "version": "1.3.4",
  "domain": {
    "materials": [
      {
        "label": "Steel (S235)",
        "d": 7850,
        "e": 210000000000,
        "g": 81000000000,
        "alpha": 0.000012
      }
    ],
    "crossSections": [
      {
        "label": "IPE 200 (approx)",
        "a": 0.002848,
        "iy": 0.00001943,
        "h": 0.2,
        "k": 0.3932584269662922
      }
    ],
    "nodes": [
      { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] },
      { "label": "2", "coords": [6, 0, 0], "bcs": [2] }
    ],
    "elements": [
      {
        "label": "1",
        "nodes": ["1", "2"],
        "mat": "Steel (S235)",
        "cs": "IPE 200 (approx)",
        "hinges": [false, false]
      }
    ],
    "loadCases": [
      {
        "label": "DefaultLC",
        "nodalLoads": [],
        "elementLoads": [
          { "type": "udl", "target": "1", "lcs": true, "values": [0, 12000] }
        ],
        "prescribedBC": []
      }
    ]
  },
  "dimensions": []
}
```

All values are in **SI units** (m, N, Pa, rad), whatever units the app displays. Coordinates are `[x, y, z]` with $y = 0$ and $z$ pointing down. Supports and load components use DOF ids `0 = Dx`, `2 = Dz`, `4 = Ry`.

| Element load `type` | Values |
| --- | --- |
| `udl` | `values: [fx, fz]` in N/m |
| `trapezoidal` | `startValues: [f1x, f1z]`, `endValues: [f2x, f2z]` in N/m |
| `concentrated` | `values: [Fx, Fz, My, a]` in N, N·m, and m from the start node |
| `temperature` | `values: [ΔTc, ΔTb, ΔTt]` in K; the gradient is ΔTb − ΔTt |

`lcs: true`, or no `lcs` at all, puts an element load in the element's local axes; `false` in the global ones. The other entries:

- **Nodal loads**: `{ "target": "2", "values": { "0": Fx, "2": Fz, "4": My } }`, plus `"lcs": true` for a load in the axes of a rotated support.
- **Prescribed displacements**: `{ "target": "2", "prescribedValues": { "0": Dx, "2": Dz, "4": Ry } }`; a component you leave out is 0.
- Files written by the app also carry a `date`, a `commit`, the axes of rotated supports (`lcs` on a node) and drawn section `shape`s.

Because the format is simple, you can write models with a script or a spreadsheet and open them with **Open project**. To build and solve models entirely in code, use the solver behind the app, [@edubeam/fem](/solver).
