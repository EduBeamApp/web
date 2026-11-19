---
title: Theming and colours
description: "Colour @edubeam/plot figures with CSS custom properties or the colors prop: light and dark themes, black-and-white print, SVG colours, fonts, animations."
order: 4
source: site
---

# Theming and colours

A plot takes its colours from CSS custom properties on the page, so a site's light and dark themes apply as they are. Where the page defines none, CSS system colours stand in, which follow the page's `color-scheme`. Out of the box, a plot is black on white in a light page and light on dark in a dark one.

## Custom properties

| Used for | Custom property | Fallback |
| --- | --- | --- |
| Members, supports, text | `--figure-ink`, then `--ink` | `CanvasText` |
| Background, label halos | `--paper` | `Canvas` |
| Dimension lines, axes | `--muted` | `GrayText` |
| Nodes, the draggable load | `--brand` | `#4f46e5` |
| Normal force | `--color-normal` | `#2222ff` |
| Shear force | `--color-shear` | `#00af00` |
| Bending moment | `--color-moment` | `#ff2222` |
| Deformed shape | `--figure-ink`, then `--ink` | `CanvasText` |
| Loads | `--color-load` | `#ff8700` |
| Reactions | `--color-reaction` | `#a020f0` |
| Truss bars in tension | `--color-tension`, then `--color-moment` | `#ff2222` |
| Truss bars in compression | `--color-compression`, then `--color-normal` | `#2222ff` |
| Font | `--ebp-font`, then `--font-sans` | `inherit` |

Set the properties anywhere above the plot, on `:root` for a whole site:

```css
:root {
  --ink: #1b1b3a;
  --paper: #ffffff;
  --color-moment: #d7263d;
}

.dark {
  --ink: #eeeeff;
  --paper: #0b0d1f;
}
```

Labels get a halo in the `--paper` colour so they stay legible over hatching: match it to the background the plot sits on.

## The `colors` prop

To colour one plot, pass any of the tones by name:

```vue
<StructurePlot :solver="solver" :colors="{ moment: '#c00', paper: 'transparent' }" />
```

The tones are `ink`, `paper`, `muted`, `brand`, `normal`, `shear`, `moment`, `deformed`, `load`, `reaction`, `tension` and `compression`. Any CSS colour works, a `var(…)` included. `DEFAULT_COLORS` holds the default value of each.

## Black and white

For a photocopied test or a print in black and white, set every coloured tone to ink:

```vue
<script setup lang="ts">
import type { PlotColors } from '@edubeam/plot'

const print: Partial<PlotColors> = {
  ink: '#000', paper: '#fff', muted: '#555', brand: '#000',
  normal: '#000', shear: '#000', moment: '#000', deformed: '#000',
  load: '#000', reaction: '#000', tension: '#000', compression: '#000',
}
</script>

<template>
  <StructurePlot :solver="solver" :colors="print" :animate="false" />
</template>
```

The diagrams stay readable without colour: they are hatched, and the moment hangs on the tension side.

## Colours in an SVG file {#colours-in-an-svg-file}

A file written by [`structureSvg`](/plot/functions#a-standalone-svg-file) has no page around it, so it uses plain colours: `PRINT_COLORS`, the EduBeam app's colours on white. Its `colors` option takes the same tones as the prop, so the black-and-white set above works there too:

```ts
structureSvg(model, { colors: print }) // black on white
structureSvg(model, { background: false }) // no background, for a coloured slide
```

Plain colours only: a `var(…)` means nothing to Word or Inkscape.

## Fonts

Text uses the page's font, through `--ebp-font` or `--font-sans`, with tabular figures. Row names such as V(x) in `DiagramStack` are set in KaTeX's fonts when the page loads them, and in a serif otherwise. An SVG file uses its `fontFamily` option, Helvetica or Arial by default, since it cannot know the page's font.

## Restyling the animation

The few CSS rules a plot needs are inlined into each SVG, so it needs no stylesheet. Every class is prefixed `ebp-`, and a page can override them. Each layer is a `<g class="ebp-layer ebp-layer-{name}">`, which gets `ebp-on` when it is shown:

```css
/* Slower fades, for a lecture hall */
.slides .ebp-animate .ebp-layer {
  transition-duration: 1s;
}
```

`PLOT_CSS` exports the inlined rules, and `toneVars(colors)` the custom properties a plot sets on its root element, for building your own figures from the [drawing functions](/plot/functions#drawing).
