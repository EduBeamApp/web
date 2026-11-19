---
description: "Short answers about EduBeam: cost, offline use, privacy, accuracy, how results are computed, citing it, practice problems, sharing and code."
source: site
---

# Frequently asked questions

Short answers, each with a link to the page that covers the topic in full. Can't find yours? See [Troubleshooting](/reference/troubleshooting) or [ask on GitHub](https://github.com/janvorisek/edubeam/issues).

## General

### What is EduBeam?

A free, open-source app for the linear static analysis of 2D beams, frames and trusses, made for students, teachers and engineers who want instant feedback. It runs in the browser. The [Introduction](/guide/introduction) lists what it does and what it does not.

### Is it really free? Do I need an account?

Yes, it is free, and no, you don't need an account. Open [run.edubeam.app](https://run.edubeam.app){target="_blank"} and start modelling: there is nothing to install and no usage limit. The source is on [GitHub](https://github.com/janvorisek/edubeam) under the GPL-3.0 licence.

### Which browsers and devices work?

Any current Chrome, Edge, Firefox or Safari, on a computer, tablet or phone. On a touch screen, tap to select, drag a node to move it, drag elsewhere to pan, pinch to zoom, and press and hold for the canvas menu. A mouse and keyboard are still faster for modelling. See [Keyboard, mouse & touch](/reference/shortcuts#touch).

### I lost my model. Can I get it back?

Probably. When a model is cleared, or replaced by a link, a file or an example, EduBeam keeps it in **☰ → Recent structures** (the last 10), and <kbd>Ctrl</kbd>+<kbd>Z</kbd> undoes the replacement. Both live in this browser only, so a model from another computer or browser profile isn't there. See [Recent structures](/essentials/import-export#recent-structures).

### Can I use it offline?

Yes. EduBeam is a progressive web app: once your browser has loaded it, it keeps working without a connection, and the browser may offer to install it. When a new version is out, a dialog asks before updating.

### Where is my data stored?

In your browser. There are no accounts and no cloud storage: the app keeps your model and settings in this browser, and a share link carries the model inside the link itself. See [What is stored in your browser](/essentials/units-settings#what-is-stored-in-your-browser).

The app at run.edubeam.app does collect usage statistics (Google Analytics) and error reports (Sentry). An error report, and the recording Sentry makes of a sample of sessions, can include what was on the screen, your model among it.

### Where can I practise statics problems? {#practice}

On the [Practice](/practice) page. It gives you a beam, frame or truss with new numbers each time: work out the reactions and the largest bending moment or bar force on paper, type them in, and each value is checked at once. The [examples](/examples/) come with questions and answers too. Teachers can print a different test for every student, with an answer key, from the [exam builder](/exam); see [Practice problems and test papers](/guide/teaching#practice-and-test-papers).

### How do I cite EduBeam? {#cite}

As software, with the version and the date you used it. The version is at the bottom of the **☰** menu. For example:

> Voříšek, J. and contributors. *EduBeam*, version 1.3.4 \[software\]. https://edubeam.app (accessed 18 November 2026).

To refer to one particular model, add its [share link](/essentials/import-export#share-a-link): it opens the same model for every reader.

## Modelling

### How do I make a fixed / pinned / roller support?

Click the node, choose **Node supports** and pick the symbol: pin, roller, fixed, slider and more. Or tick the restrained DOFs in the **Nodes** tab: `Dx` + `Dz` + `Ry` is fixed, `Dx` + `Dz` is a pin, `Dz` alone is a roller. [Nodes & supports](/essentials/nodes-supports#supports) lists every type.

### How do I make a truss?

Draw the bars as ordinary elements and release both ends of each: tick both **End hinges** in the **Elements** tab, or tick **Start hinge** and **End hinge** in the banner before drawing the bars with the mouse. Apply the loads at the joints. The [truss tutorial](/tutorials/truss) builds one step by step.

### How do I put a hinge in a frame?

Release the moment at the end of the element that should turn freely: tick its end hinge in the **Elements** tab. A hinge belongs to one element end, so at a joint of several elements, releasing one of them leaves the others rigidly connected. See [End hinges](/essentials/elements#end-hinges).

### How do I add a support or a point load in the middle of a beam?

For a support, add a node on the beam with the mouse (the **Add node** button with the cursor icon) and choose **Connect to structure**: the beam is split in two at that node, and you can support it. A point load needs no node: add a **Concentrated load** to the element and set its position from the start node. See [Placing a node on an existing element](/essentials/nodes-supports#placing-a-node-on-an-existing-element) and [Concentrated load](/essentials/loads#concentrated-load).

### Can I apply self-weight?

Not automatically: the material's density isn't used in a static analysis. Add it as a uniformly distributed load $f_z = \rho g A$, for example $7850 \cdot 9.81 \cdot 28.48 \cdot 10^{-4} = 219$ N/m, that is 0.22 kN/m, for an IPE 200.

### Can I model inclined supports?

Yes. Give the node a **Nodal LCS angle**, and its supports then act along the rotated axes. See [Inclined supports](/essentials/nodes-supports#inclined-skewed-supports).

### Can I work in US customary units?

Yes. Click the units chip at the bottom right of the viewer, which opens **Settings → Language & Locale**, and set **Unit system** to **US customary (imperial)** for feet and kips, or pick each unit on its own. The model is stored in SI, so switching units converts what you see and never changes the model. See [Units & settings](/essentials/units-settings).

### Are there load cases or combinations?

No, a model has one load case. Save each case as its own file or link, and combine the results yourself. A session from the desktop EduBeam with several load cases opens with the first one, and a message names those left out.

### Why do my loads point up?

Probably because you entered a negative value. In EduBeam the global z axis points **down**, so a positive `fz` or `Fz` is a downward, gravity load: 12 kN/m down is `fz = 12`. See [Coordinate system & sign conventions](/elements/conventions#loads). If your course uses a vertical axis pointing up, switch to **x right, y up** in **Settings → Language & Locale → Coordinate system**: inputs and results then follow that axis.

## Results

### Why is there no "Solve" button?

Because the model is solved again after every change. If no results appear, the model can't be solved yet, and a message on the canvas says why. [Troubleshooting](/reference/troubleshooting#no-results-are-drawn) lists what to check.

### Why does my deflection differ slightly from the formula?

EduBeam uses Timoshenko beam elements, so a deflection includes the shear deformation that textbook formulas usually leave out. For a slender beam the difference is around 1 %, and the [Quick start](/guide/quick-start#_8-check-by-hand) adds it up by hand. In a statically indeterminate structure the shear stiffness also shifts the internal forces slightly. More in [Checking results by hand](/guide/verification).

### How accurate are the results? Do I need more elements?

For linear statics the beam element is exact for every load type EduBeam offers, so one element per member is enough and there is no mesh to refine. Add nodes only where you need a support, a hinge, a change of section, a nodal load or a displacement to read. See [Precision and accuracy](/essentials/results#precision-and-accuracy).

### How does EduBeam compute the results?

With the direct stiffness method of the finite element method, the one taught in structural analysis courses, in your browser. [How EduBeam solves a model](/elements/analysis) follows each step on a small example you can repeat by hand, and the solver itself is open source as [@edubeam/fem](/solver).

### Can I see the stiffness matrices?

Yes. In the **Elements** tab, the matrix button in an element's row opens its 6 × 6 stiffness matrix, in global axes and SI units (N, m). Clicking an element in the viewer offers **Stiffness matrix** too. The [beam element](/elements/beam#global-stiffness-matrix) page derives it.

### Where are the reactions listed?

In the viewer, as arrows with their values: **Reactions** in the display options, on by default. They are also in the file from **Results → Export CSV** and in what **Copy** puts on the clipboard. The **Results** tab lists nodal displacements and element end forces. See [Results & diagrams](/essentials/results).

## Files & sharing

### How do I share a model?

Press **Share model** and then **Copy**. The link holds the whole model, and whoever opens it gets their own copy to edit: there is no live collaboration. Switch on **Show what I see** to make the link open with your diagrams and labels on. See [Share a link](/essentials/import-export#share-a-link) and, for courses, [Teaching with EduBeam](/guide/teaching#in-lecture-notes-and-assignments).

### Can I embed a model on my website or in slides?

Yes. Add `&viewer=1` to a share link and put it in an `<iframe>`: see [Embed a viewer](/essentials/import-export#embed-a-read-only-viewer). For a static figure in a page, a slide or printed notes, export an SVG, or draw it from code with [@edubeam/plot](/plot).

### Can I export images or tables?

Yes. **☰ → Export image** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) saves the drawing as PNG or SVG, at the size or scale you choose. **Results → Export CSV** saves both result tables, and **Copy** puts them on the clipboard for a spreadsheet. See [Export an image](/essentials/import-export#export-an-image).

### Can I open files from the desktop EduBeam? {#can-i-open-files-from-the-desktop-edubeam}

Yes. Sessions saved by the desktop EduBeam 2.x to 3.5 (`.xml`) open with **☰ → Open project** or by dropping them on the app, just like a `project.json`. Their values are read as kN, kPa and m. See [Open a project](/essentials/import-export#open-a-project).

### Can I generate models programmatically?

Yes, in two ways:

- **Write the file.** A `project.json` is plain JSON in SI units, so a script in any language can write one, and EduBeam opens it with **Open project** or by drag and drop. See the [project file format](/essentials/import-export#project-file-format).
- **Solve it in code.** [@edubeam/fem](/solver) is the finite element solver behind EduBeam, as a JavaScript and TypeScript library. [@edubeam/plot](/plot) then draws the result, for example as a [generated exercise sheet](/plot/exercises).

The beam from the [Quick start](/guide/quick-start), in SI units:

```ts
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial('steel', { e: 210e9, g: 81e9 }) // Pa
const section = { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 } // m², m⁴, m
domain.createCrossSection('IPE200', section)
domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]) // pin
domain.createNode('2', [6, 0, 0], [DofID.Dz]) // roller
const beam = domain.createBeam2D('1', ['1', '2'], 'steel', 'IPE200')
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad('1', [0, 12e3], true) // 12 kN/m, downward

solver.solve()
beam.computeBendingMomentAt(lc, 3) // 54000 N·m at mid-span
beam.computeLocalDefl(lc, 2).w[1] // 0.0502 m at mid-span
```

## Support

### How do I report a bug or request a feature?

Open an issue on [GitHub](https://github.com/janvorisek/edubeam/issues) and attach a share link or a project file that shows the problem. For private questions, write to [support@edubeam.app](mailto:support@edubeam.app).
