---
title: Integrazione
description: "Inserisci le figure di @edubeam/plot in un’app Vite, in dispense VitePress o in un sito Nuxt, con rendering lato server, modelli già risolti in JSON o SVG semplice senza Vue."
order: 7
source: site
---

# Integrazione

I componenti sono normali componenti Vue 3, quindi funzionano ovunque funzioni Vue, e vengono renderizzati sia sul server sia nel browser. Nulla accede a `window` prima che una figura sia montata, e ogni figura ha i propri id, quindi in una pagina possono convivere quante figure vuoi. Scegli la configurazione che hai:

| Hai | Fai così |
| --- | --- |
| Un’app Vue costruita con Vite | Installa, importa, fatto: [Un’app Vite](#a-vite-app) |
| Dispense in Markdown | Registra il plugin una volta in VitePress: [Dispense con VitePress](#vitepress-course-notes) |
| Un sito Nuxt | Importa i componenti o aggiungi un plugin: [Nuxt](#nuxt) |
| Una pagina che mostra solo figure | Risolvi in fase di build e distribuisci JSON: [Distribuisci il disegno](#ship-the-drawing-not-the-solver) |
| Niente Vue | Scrivi l’SVG in Node: [Senza Vue](#plain-html-from-node) |

## Un’app Vite {#a-vite-app}

```bash
npm create vue@latest
npm install @edubeam/plot @edubeam/fem
```

Importa i componenti dove li usi, come in [Per iniziare](/it/plot/getting-started#draw-a-solved-model), oppure registrali entrambi una volta con `app.use(EduBeamPlot)`. Non c’è altro da configurare: nessun foglio di stile e nessun plugin per il bundler.

## Dispense con VitePress {#vitepress-course-notes}

[VitePress](https://vitepress.dev) costruisce pagine Markdown con Vue, ed è quindi una buona scelta per le dispense di un corso. Registra i componenti nel tema, `.vitepress/theme/index.ts`:

```ts [.vitepress/theme/index.ts]
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { EduBeamPlot } from '@edubeam/plot'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(EduBeamPlot) // <StructurePlot> e <DiagramStack> in ogni pagina
  },
} satisfies Theme
```

Poi costruisci e disegna un modello direttamente in una pagina, accanto a `frame.ts`:

```md [portal-frame.md]
<script setup lang="ts">
import { portalFrame } from './frame' // () => un LinearStaticSolver risolto

const frame = portalFrame()
</script>

# Portal frame

The bending moment under the design loads:

<StructurePlot :solver="frame" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

`vitepress build` risolve il telaio e scrive l’SVG finito nell’HTML della pagina, etichette comprese. Nel browser la pagina prende il controllo e la figura si adatta alla colonna. `frame.ts` si trova nella pagina [Slide e dispense](/it/plot/slides#a-figure-that-builds-up).

## Nuxt {#nuxt}

Anche Nuxt esegue il rendering lato server; questo sito è costruito con Nuxt. Importa i componenti in una pagina o in un componente come al solito, oppure registrali per tutta l’app con un plugin in `plugins/edubeam-plot.ts`:

```ts [plugins/edubeam-plot.ts]
import { EduBeamPlot } from '@edubeam/plot'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(EduBeamPlot)
})
```

Sul server non c’è un contenitore da misurare, quindi una figura viene impaginata alla larghezza della sua prop `width`: 640 px per impostazione predefinita (400 px con `compact`), 720 px per `DiagramStack`. Una volta montata, si impagina di nuovo alla larghezza reale. Se la tua colonna è molto più stretta o più larga, dai a `width` una stima più vicina e la figura non cambierà dimensione durante il caricamento della pagina.

## Distribuisci il disegno, non il solutore {#ship-the-drawing-not-the-solver}

Una pagina che mostra solo una figura non ha bisogno del solutore. `modelFromSolver` legge un modello risolto in dati semplici: nodi, aste, carichi, reazioni e N, V, M e spostamenti di ogni asta come polinomi esatti. Preparalo in fase di build, con uno script come `build-figures.ts`:

```ts [build-figures.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

writeFileSync('portal-frame.json', JSON.stringify(modelFromSolver(portalFrame())))
```

e disegnalo con la prop `model`:

```vue
<script setup lang="ts">
import { StructurePlot, type PlotModel } from '@edubeam/plot'
import frame from './portal-frame.json'
</script>

<template>
  <StructurePlot :model="frame as PlotModel" />
</template>
```

Il telaio a portale occupa meno di 2 kB di JSON e si disegna esattamente come con il suo solutore. Con un modello funziona tutto come con un solutore, e se li passi entrambi prevale `model`. Il formato è descritto in [Modello di disegno](/it/plot/model).

## Senza Vue {#plain-html-from-node}

`structureSvg` trasforma un modello nel testo di un file SVG, con colori fissi e senza stili né script. Incollalo in qualsiasi HTML, generatore di siti statici, file Markdown o CMS. Questo script scrive una pagina con una figura:

```ts [frame-html.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const svg = structureSvg(modelFromSolver(portalFrame()), { layers: ['members', 'supports', 'reactions', 'M'] })
writeFileSync('frame.html', `<!doctype html><meta charset="utf-8"><title>Portal frame</title>${svg}`)
```

Una figura così ha la dimensione con cui è stata scritta, 640 px di larghezza per impostazione predefinita (`max-width: 100%; height: auto` le permette di restringersi con la colonna), e un proprio sfondo bianco; `background: false` lo rende trasparente. Non segue un tema scuro e non legge i valori sotto il puntatore: per questo, usa il componente. Lo [script per il compito stampato](/it/plot/exercises#print-a-test) stampa così un intero compito, e [Un file SVG autonomo](/it/plot/functions#a-standalone-svg-file) elenca le opzioni.
