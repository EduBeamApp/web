---
title: Drawing the results
description: "Turn a solved @edubeam/fem model into diagrams with @edubeam/plot: in a Vue component, as a standalone SVG file from a Node script, or as JSON to draw later."
order: 11
source: site
---

# Drawing the results

[@edubeam/plot](/plot) draws a solved model the way the figures on this site look: members, supports, loads, reactions, the N, V and M diagrams and the deflected shape, as SVG. Hand it the solver; it reads everything it needs.

```bash
npm install @edubeam/plot @edubeam/fem vue
```

## In a Vue component

```vue [BeamFigure.vue]
<script setup lang="ts">
import { markRaw } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot } from '@edubeam/plot'

// A 6 m simply supported beam under 12 kN/m, in SI units: m, N, Pa
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // pin
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // roller
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

// Read, never watched: markRaw keeps Vue from making the solver reactive
const beam = markRaw(solver)
</script>

<template>
  <StructurePlot
    :solver="beam"
    :layers="['members', 'supports', 'loads', 'reactions', 'M']"
  />
</template>
```

It draws the 36 kN reactions and the 54 kNm moment, as in this live figure:

::model-figure{caption="What BeamFigure.vue draws"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
---
::

`StructurePlot` draws load case 0; the `loadCase` prop picks another of `solver.loadCases`. It does not watch the solver: after you change the model and solve again, change its `revision` prop to redraw. [StructurePlot](/plot/structure-plot) has every option.

## Without a browser {#without-a-browser}

`structureSvg`, new in @edubeam/plot 0.2, writes the same drawing as a standalone SVG file, with plain colours that Word, Inkscape and LaTeX tool chains understand. No browser, no Vue component, just a Node script:

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { modelFromSolver, structureSvg } from '@edubeam/plot'

// The same beam as in BeamFigure.vue
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

const svg = structureSvg(modelFromSolver(solver), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
  width: 640,
})
writeFileSync('beam.svg', svg)
```

The file shows what the live figure above shows, in print colours. `width` sets its size in pixels, since there is no box to measure. For a whole printable page of figures, render the Vue component to HTML on the server, as the [test generator](/plot/exercises#print-a-test) of @edubeam/plot does. The options of `structureSvg` are in [Functions](/plot/functions#a-standalone-svg-file).

## Ship the drawing, not the solver {#ship-the-drawing-not-the-solver}

`modelFromSolver` turns a solved model into plain, JSON-serialisable data: geometry, loads, reactions, and every member's results as exact polynomials. Solve at build time, ship the JSON, and draw it with the `model` prop instead of `solver`:

```ts
import { modelFromSolver } from '@edubeam/plot'

// ... the solved beam of to-svg.ts
writeFileSync('beam.json', JSON.stringify(modelFromSolver(solver)))
```

A page that shows the figure then solves nothing: the work is done once, when you build it. [Embedding](/plot/embedding#ship-the-drawing-not-the-solver) shows the component side, and [Plot model](/plot/model) the format.

Everything else, from colours to hover readouts and draggable loads, is in the [@edubeam/plot docs](/plot/getting-started).
