---
title: Embedding
description: "Put @edubeam/plot figures in a Vite app, VitePress course notes or a Nuxt site, render them on the server, ship pre-solved models as JSON, or write plain SVG for any page without Vue."
order: 7
source: site
---

# Embedding

The components are plain Vue 3, so they work wherever Vue does, and they render on the server as well as in the browser. Nothing touches `window` before a plot is mounted, and every plot gets its own ids, so any number of them can share a page. Pick the setup you have:

| You have | Do this |
| --- | --- |
| A Vue app built with Vite | Install, import, done: [A Vite app](#a-vite-app) |
| Course notes in Markdown | Register the plugin once in VitePress: [VitePress course notes](#vitepress-course-notes) |
| A Nuxt site | Import the components, or add a plugin: [Nuxt](#nuxt) |
| A page that only shows figures | Solve at build time and ship JSON: [Ship the drawing](#ship-the-drawing-not-the-solver) |
| No Vue at all | Write the SVG in Node: [Without Vue](#plain-html-from-node) |

## A Vite app

```bash
npm create vue@latest
npm install @edubeam/plot @edubeam/fem
```

Import the components where you use them, as in [Getting started](/plot/getting-started#draw-a-solved-model), or register both once with `app.use(EduBeamPlot)`. There is nothing else to configure: no stylesheet and no bundler plugin.

## VitePress course notes

[VitePress](https://vitepress.dev) builds Markdown pages with Vue, which makes it a good home for course notes. Register the components in the theme, `.vitepress/theme/index.ts`:

```ts [.vitepress/theme/index.ts]
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { EduBeamPlot } from '@edubeam/plot'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(EduBeamPlot) // <StructurePlot> and <DiagramStack> in every page
  },
} satisfies Theme
```

Then build and draw a model right in a page, next to `frame.ts`:

```md [portal-frame.md]
<script setup lang="ts">
import { portalFrame } from './frame' // () => a solved LinearStaticSolver

const frame = portalFrame()
</script>

# Portal frame

The bending moment under the design loads:

<StructurePlot :solver="frame" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

`vitepress build` solves the frame and writes the finished SVG into the page's HTML, labels and all. In the browser the page takes over, and the plot fits itself to the column. `frame.ts` is on the [Slides](/plot/slides#a-figure-that-builds-up) page.

## Nuxt

Nuxt renders on the server too; this site is built with it. Import the components in a page or component as usual, or register them for the whole app with a plugin in `plugins/edubeam-plot.ts`:

```ts [plugins/edubeam-plot.ts]
import { EduBeamPlot } from '@edubeam/plot'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(EduBeamPlot)
})
```

On the server there is no box to measure, so a plot is laid out at its `width` prop: 640 px by default (400 px with `compact`), 720 px for `DiagramStack`. Once mounted it lays out again at its real width. If your column is much narrower or wider, give `width` a closer guess and the figure will not change size as the page loads.

## Ship the drawing, not the solver {#ship-the-drawing-not-the-solver}

A page that only shows a figure needs no solver. `modelFromSolver` reads a solved model into plain data: nodes, members, loads, reactions, and every member's N, V, M and displacements as exact polynomials. Make it at build time, with a script such as `build-figures.ts`:

```ts [build-figures.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

writeFileSync('portal-frame.json', JSON.stringify(modelFromSolver(portalFrame())))
```

and draw it with the `model` prop:

```vue
<script setup lang="ts">
import { StructurePlot, type PlotModel } from '@edubeam/plot'
import frame from './portal-frame.json'
</script>

<template>
  <StructurePlot :model="frame as PlotModel" />
</template>
```

The portal frame is under 2 kB of JSON and draws exactly as its solver does. Every feature works on a model as on a solver, and `model` wins if you give both. The format is in [Plot model](/plot/model).

## Without Vue {#plain-html-from-node}

`structureSvg` turns a model into the text of an SVG file, with plain colours and no styles or scripts. Paste it into any HTML, a static site generator, a Markdown file or a CMS. This script writes a page with one figure:

```ts [frame-html.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const svg = structureSvg(modelFromSolver(portalFrame()), { layers: ['members', 'supports', 'reactions', 'M'] })
writeFileSync('frame.html', `<!doctype html><meta charset="utf-8"><title>Portal frame</title>${svg}`)
```

Such a figure has the size it was written at, 640 px wide by default (`max-width: 100%; height: auto` lets it shrink with the column), and a white background of its own; `background: false` leaves it transparent. It does not follow a dark theme or read values under the pointer: for that, render the component. The [test generator](/plot/exercises#print-a-test) prints a whole test this way, and [A standalone SVG file](/plot/functions#a-standalone-svg-file) lists the options.
