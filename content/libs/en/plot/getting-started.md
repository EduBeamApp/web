---
title: Getting started
description: "Install @edubeam/plot, draw a beam solved by @edubeam/fem with its loads, reactions and bending moment in Vue 3, redraw it as it changes, save it as SVG."
order: 1
group: Introduction
source: site
---

# Getting started

@edubeam/plot draws a plane beam, frame or truss and its results as SVG: members, supports, loads, reactions, the N, V and M diagrams and the deformed shape, just as the figures on this site look. You give it a model solved by [@edubeam/fem](/solver), the solver behind [EduBeam]{.edubeam}; it works out the layout, the scale and where every number goes.

Teachers use it for [exercises and tests](/plot/exercises) generated from a seed, [slides that build up](/plot/slides) click by click, and figures for notes, in a web page or as files for LaTeX and Word. This site's [practice problems](/practice) and [exam builder](/exam) are made with it.

::div{.actions}
[Draw your first plot](#draw-a-solved-model) [Generate exercises](/plot/exercises)
::

## Install

```bash
npm install @edubeam/plot @edubeam/fem vue
```

Vue 3.5 or later and the solver are peer dependencies, so your app keeps one copy of each. The package is ESM only, ships its own types and needs no stylesheet. It runs in Node 20.19 or later; to run a script written in TypeScript as it is, with `node script.ts`, Node 22.18 or later.

## Draw a solved model {#draw-a-solved-model}

Two files. The first, `beams.ts`, builds and solves a beam with @edubeam/fem. It is a plain function, so the same model can feed a page, a slide and a script:

```ts [beams.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** A simply supported beam, `span` m long, under `q` kN/m: solved. The solver works in SI units. */
export const simpleBeam = (span: number, q: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 }) // steel, Pa
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 }) // IPE 200, rigid in shear
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // pin
  domain.createNode('B', [span, 0, 0], [DofID.Dz]) // roller
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true) // N/m, +z is down
  solver.solve()
  return solver
}
```

The second, `BeamFigure.vue`, hands the solver to `StructurePlot` and says what to draw:

```vue [BeamFigure.vue]
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams'

const beam = simpleBeam(6, 12)
</script>

<template>
  <StructurePlot :solver="beam" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
</template>
```

That is the whole figure: the beam on its supports, the 12 kN/m load, the two 36 kN reactions, and the bending moment, $qL^2/8 = 54$ kNm at midspan, hanging on the tension side:

::model-figure{caption="What BeamFigure.vue draws: a 6 m span under 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
labels: horizontal
---
::

The plot fills the width of its container and sets its own height. Text, symbols and line weights keep their size in pixels whatever the size of the structure, so a figure stays legible on a phone. Leave `layers` out and the plot picks the result itself: M for beams and frames, N for a truss. All the [layers](/plot/structure-plot#layers) are listed with `StructurePlot`; building models is covered in the [solver docs](/solver/getting-started).

## When the model changes

A plot reads the solver it is given; it does not watch it. When something changes, solve again and pass the new solver. A `computed` does exactly that:

```vue [LoadSlider.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams'

const q = ref(12) // kN/m
const beam = computed(() => simpleBeam(6, q.value))
</script>

<template>
  <input v-model.number="q" type="range" min="1" max="30" />
  <StructurePlot :solver="beam" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
</template>
```

A beam like this solves in about a millisecond, so the figure follows the slider as it moves. Changed a solver in place instead? Bump the `revision` prop and the plot reads it again.

::callout{type="tip" title="Keep solvers out of deep reactivity"}
A `computed`, a prop or a plain `const` holds a solver as it is. To keep one in component state, use `shallowRef` or wrap it in `markRaw`: a plain `ref` would make Vue walk the whole solver to make it reactive, for nothing.
::

## Save it as a file {#save-it-as-a-file}

For a figure in LaTeX, Word or Inkscape, `structureSvg` writes the same drawing as a standalone SVG file with plain colours. It needs neither Vue nor a browser, only Node. Save this as `beam-svg.ts` next to `beams.ts`:

```ts [beam-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { simpleBeam } from './beams.ts'

const svg = structureSvg(modelFromSolver(simpleBeam(6, 12)), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
})
writeFileSync('beam.svg', svg)
```

Run it with `node beam-svg.ts` (Node 22.18 or later; on older versions, `npx tsx beam-svg.ts`). The options, and how to bring the file into LaTeX and Word, are in [A standalone SVG file](/plot/functions#a-standalone-svg-file).

## The stacked figure {#the-stacked-figure}

`DiagramStack` draws the figure of every statics textbook: a straight beam with its loads, and its V(x), M(x) and w(x) beneath it on one x axis. With `v-model:load-at` the reader can drag a point load along the beam and watch the diagrams follow:

```vue
<DiagramStack v-model:load-at="at" :solver="solveWithLoadAt(at)" />
```

[DiagramStack](/plot/diagram-stack) has the complete example.

## Use it everywhere

To register both components globally instead of importing them where you use them:

```ts [main.ts]
import { createApp } from 'vue'
import { EduBeamPlot } from '@edubeam/plot'
import App from './App.vue'

createApp(App).use(EduBeamPlot).mount('#app') // <StructurePlot> and <DiagramStack> in every template
```

Named imports keep a bundle smaller: a page that imports only `StructurePlot` gets neither `DiagramStack` nor the plugin. Both components render on the server too, in Nuxt or VitePress: see [Embedding](/plot/embedding).

## Where to next {#next}

::card-grid{cols="2"}
:::card{title="Exercises and tests" icon="lucide:dices" to="/plot/exercises"}
A different exercise for every student from a seed, with its answer key, printed or saved for LaTeX.
:::
:::card{title="Slides and notes" icon="lucide:presentation" to="/plot/slides"}
Figures that build up click by click in Slidev, Vue or Beamer, and the same figures for notes.
:::
:::card{title="StructurePlot" icon="lucide:frame" to="/plot/structure-plot"}
Layers, dimensions, thumbnails, sizes, units, and reading values with the pointer.
:::
:::card{title="DiagramStack" icon="lucide:rows-3" to="/plot/diagram-stack"}
A beam over its V, M and w diagrams, with a load the reader can drag.
:::
::
