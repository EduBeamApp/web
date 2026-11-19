---
title: Temi e colori
description: "Colora le figure di @edubeam/plot con proprietà CSS personalizzate o la prop colors: temi chiaro e scuro, stampa in bianco e nero, font e animazioni."
order: 4
source: site
---

# Temi e colori

Una figura prende i colori dalle proprietà personalizzate CSS della pagina, quindi il tema chiaro e quello scuro di un sito si applicano così come sono. Dove la pagina non ne definisce, subentrano i colori di sistema CSS, che seguono il `color-scheme` della pagina. Senza alcuna configurazione, una figura è nera su bianco in una pagina chiara e chiara su scuro in una pagina scura.

## Proprietà personalizzate {#custom-properties}

| Usata per | Proprietà personalizzata | Valore di riserva |
| --- | --- | --- |
| Aste, vincoli, testo | `--figure-ink`, poi `--ink` | `CanvasText` |
| Sfondo, alone delle etichette | `--paper` | `Canvas` |
| Linee di quota, assi | `--muted` | `GrayText` |
| Nodi, carico trascinabile | `--brand` | `#4f46e5` |
| Sforzo normale | `--color-normal` | `#2222ff` |
| Taglio | `--color-shear` | `#00af00` |
| Momento flettente | `--color-moment` | `#ff2222` |
| Deformata | `--figure-ink`, poi `--ink` | `CanvasText` |
| Carichi | `--color-load` | `#ff8700` |
| Reazioni | `--color-reaction` | `#a020f0` |
| Aste tese di una travatura | `--color-tension`, poi `--color-moment` | `#ff2222` |
| Aste compresse di una travatura | `--color-compression`, poi `--color-normal` | `#2222ff` |
| Font | `--ebp-font`, poi `--font-sans` | `inherit` |

Imposta le proprietà su un qualsiasi elemento che contiene la figura, su `:root` per un intero sito:

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

Le etichette hanno un alone del colore di `--paper`, così restano leggibili sopra il tratteggio: fallo corrispondere allo sfondo su cui si trova la figura.

## La prop `colors` {#the-colors-prop}

Per colorare una sola figura, passa uno qualsiasi dei toni per nome:

```vue
<StructurePlot :solver="solver" :colors="{ moment: '#c00', paper: 'transparent' }" />
```

I toni sono `ink`, `paper`, `muted`, `brand`, `normal`, `shear`, `moment`, `deformed`, `load`, `reaction`, `tension` e `compression`. Va bene qualsiasi colore CSS, anche un `var(…)`. `DEFAULT_COLORS` contiene il valore predefinito di ciascuno.

## Bianco e nero {#black-and-white}

Per un compito fotocopiato o una stampa in bianco e nero, imposta ogni tono colorato sul colore dell’inchiostro, `ink`:

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

I diagrammi restano leggibili anche senza colore: sono tratteggiati, e il momento sta dal lato teso.

## Colori in un file SVG {#colours-in-an-svg-file}

Un file scritto da [`structureSvg`](/it/plot/functions#a-standalone-svg-file) non ha una pagina attorno, quindi usa colori fissi: `PRINT_COLORS`, i colori dell’app EduBeam su sfondo bianco. La sua opzione `colors` accetta gli stessi toni della prop, quindi anche la combinazione in bianco e nero qui sopra funziona:

```ts
structureSvg(model, { colors: print }) // nero su bianco
structureSvg(model, { background: false }) // senza sfondo, per una slide colorata
```

Solo colori fissi: un `var(…)` non significa nulla per Word o Inkscape.

## Font {#fonts}

Il testo usa il font della pagina, tramite `--ebp-font` o `--font-sans`, con cifre tabulari. I nomi delle righe come V(x) in `DiagramStack` sono composti nei font di KaTeX se la pagina li carica, altrimenti in un font con grazie. Un file SVG usa la sua opzione `fontFamily`, per impostazione predefinita Helvetica o Arial, perché non può conoscere il font della pagina.

## Personalizzare l’animazione {#restyling-the-animation}

Le poche regole CSS di cui una figura ha bisogno sono incluse direttamente in ogni SVG, quindi non serve alcun foglio di stile. Ogni classe ha il prefisso `ebp-` e una pagina può sovrascriverle. Ogni livello è un `<g class="ebp-layer ebp-layer-{name}">`, che riceve `ebp-on` quando è visibile:

```css
/* Dissolvenze più lente, per la lezione in aula */
.slides .ebp-animate .ebp-layer {
  transition-duration: 1s;
}
```

`PLOT_CSS` esporta le regole incluse e `toneVars(colors)` le proprietà personalizzate che una figura imposta sul suo elemento radice, per costruire figure tue con le [funzioni di disegno](/it/plot/functions#drawing).
