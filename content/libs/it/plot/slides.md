---
title: Slide e dispense
description: "Figure per le lezioni con @edubeam/plot che si costruiscono un clic alla volta in Slidev, Vue o Beamer, si risolvono dal vivo e finiscono in dispense, PowerPoint e Word come SVG."
order: 6
source: site
---

# Slide e dispense delle lezioni

Mostra una struttura nell’ordine in cui la spieghi: prima la geometria, poi i vincoli e i carichi, poi le reazioni e infine il momento flettente. Una figura disegnata da un modello risolto si costruisce sul posto, un livello per clic, ed è sempre corretta. Lo stesso modello fornisce poi le figure per le tue dispense.

![Una slide di Slidev ai clic 0, 2 e 4: i nodi di un telaio a portale con le sue quote, poi il telaio sui suoi vincoli con i carichi, infine le reazioni e il momento flettente](/screenshots/it/p2p-plot-slidev-steps.webp){.shot-md}

## Una figura che si costruisce {#a-figure-that-builds-up}

Bastano due file. `frame.ts` costruisce e risolve la struttura:

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Un telaio a portale: 6 m per 4 m, cerniere al piede, 10 kN/m sulla trave e 15 kN che spingono in B. */
export const portalFrame = (): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 }) // IPE 300
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [0, 0, -4]) // z punta verso il basso: 4 m più in alto
  domain.createNode('C', [6, 0, -4])
  domain.createNode('D', [6, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  domain.createBeam2D(2, ['B', 'C'], 1, 1)
  domain.createBeam2D(3, ['C', 'D'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(2, [0, 10e3], true)
  solver.loadCases[0].createNodalLoad('B', { [DofID.Dx]: 15e3 })
  solver.solve()
  return solver
}
```

`BuildUp.vue` la disegna per fasi. Ogni fase elenca i livelli che mostra, e `reserve` li impagina tutti fin dal primo clic, così ogni livello compare in dissolvenza al suo posto e nulla si sposta:

```vue [BuildUp.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { StructurePlot, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame'

const props = defineProps<{ step: number }>()

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'], // la geometria
  ['nodeLabels', 'members', 'supports'], // la struttura
  ['nodeLabels', 'members', 'supports', 'loads'], // i suoi carichi
  ['members', 'supports', 'loads', 'reactions'], // le reazioni
  ['members', 'supports', 'reactions', 'M'], // e il momento flettente
]
const all = [...new Set(stages.flat())] // impaginati dalla prima fase, così dopo nulla si sposta
const layers = computed(() => stages[Math.min(props.step, stages.length - 1)])

const frame = portalFrame()
</script>

<template>
  <StructurePlot :solver="frame" :layers="layers" :reserve="all" :height="360" />
</template>
```

Un livello può anche sparire: l’ultima fase toglie i carichi per lasciare spazio al momento. `:height="360"` mantiene la figura dentro una slide. Le aste si disegnano da un’estremità all’altra quando compaiono per la prima volta e i livelli appaiono con una dissolvenza di mezzo secondo; entrambi gli effetti sono disattivati con `prefers-reduced-motion`, e `:animate="false"` li disattiva per tutti. Per rallentarli durante la lezione in aula, vedi [Personalizzare l’animazione](/it/plot/theming#restyling-the-animation).

## In Slidev {#in-slidev}

[Slidev](https://sli.dev) crea slide da Markdown con Vue, quindi il componente funziona così com’è. Installa le librerie nella presentazione:

```bash
npm install @edubeam/plot @edubeam/fem
```

Metti `frame.ts` e `BuildUp.vue` nella cartella `components/` della presentazione e lascia che i clic della slide guidino la fase in `slides.md`:

```md [slides.md]
---
clicks: 4
---

# From geometry to bending moment

<BuildUp :step="$clicks" />
```

`clicks: 4` assegna alla slide quattro clic, e `$clicks` li conta a partire da 0. Ogni volta che premi il tasto freccia compare la fase successiva; tornando indietro scompare di nuovo. `slidev export` crea un PDF della presentazione, con una pagina per clic se aggiungi `--with-clicks`.

## In qualsiasi presentazione Vue {#in-any-vue-slides}

Altrove, gestisci tu la fase:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import BuildUp from './BuildUp.vue'

const step = ref(0)
</script>

<template>
  <BuildUp :step="step" />
  <button type="button" @click="step = Math.max(0, step - 1)">Back</button>
  <button type="button" @click="step++">Next</button>
</template>
```

## Risolvere dal vivo {#solve-it-live}

Per un telaio come questo il solutore impiega pochi millisecondi, quindi durante una lezione puoi modificare la struttura e risolverla sul momento. Collega un carico a un cursore e passa ogni volta un nuovo modello risolto, come in [Quando il modello cambia](/it/plot/getting-started#when-the-model-changes).

- **Un carico mobile.** [DiagramStack](/it/plot/diagram-stack#a-load-the-reader-can-drag) permette agli studenti di trascinare un carico concentrato lungo una trave e di vedere il taglio e il momento flettente seguirlo.
- **Casi a confronto.** Fissa [`diagramScale`](/it/plot/structure-plot#several-plots-at-one-scale) e due figure disegnano i loro momenti alla stessa scala, così il maggiore appare davvero maggiore.
- **Lettura dei valori.** Con `hover`, quando porti il puntatore su un’asta, la figura segna il valore all’estremità dell’ordinata di ogni diagramma: vedi [Lettura dei valori](/it/plot/structure-plot#reading-values).

## Figure per Beamer, PowerPoint e Word {#figures-for-beamer-powerpoint-and-word}

In una presentazione LaTeX Beamer o PowerPoint, o in dispense scritte in Word, la figura entra come file. `structureSvg` scrive la figura come SVG autonomo con colori fissi, impaginato come lo impagina `StructurePlot`. Uno script Node, `frame-svg.ts`, accanto a `frame.ts`:

```ts [frame-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![Il telaio a portale come file SVG autonomo, reso con CairoSVG: i carichi, le reazioni, 20 e 40 verso l’alto e 2,3 e 12,7 orizzontali, e il momento flettente da −50,7 in C a 29,3 nella trave](/screenshots/it/p2p-plot-frame-svg.webp){.shot-lg}

PowerPoint e Word (2019 e Microsoft 365) inseriscono l’SVG così com’è. LaTeX lo vuole in PDF: convertilo con `cairosvg frame.svg -o frame.pdf` o con Inkscape, oppure lascia fare a `\includesvg` del pacchetto `svg`. [Figure per LaTeX e Word](/it/plot/exercises#figures-for-latex-and-word) entra nei dettagli e [Un file SVG autonomo](/it/plot/functions#a-standalone-svg-file) elenca tutte le opzioni.

### Una figura progressiva in Beamer {#a-build-up-in-beamer}

Un file è adattato ai livelli che disegna, quindi file scritti per ogni fase separatamente non sarebbero allineati. Passa a `structureSvg` lo stesso `reserve` di `BuildUp.vue`, cioè tutti i livelli di tutte le fasi, e ogni file avrà la stessa dimensione con la struttura nella stessa posizione. `frame-stages.ts` scrive un file per fase:

```ts [frame-stages.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'],
  ['nodeLabels', 'members', 'supports'],
  ['nodeLabels', 'members', 'supports', 'loads'],
  ['members', 'supports', 'loads', 'reactions'],
  ['members', 'supports', 'reactions', 'M'],
]
const all = [...new Set(stages.flat())]
const frame = modelFromSolver(portalFrame())

stages.forEach((layers, i) => {
  writeFileSync(`frame-${i + 1}.svg`, structureSvg(frame, { layers, reserve: all }))
})
```

Converti i file in PDF:

```bash
for i in 1 2 3 4 5; do cairosvg frame-$i.svg -o frame-$i.pdf; done
```

e assegna a ciascuno il proprio overlay. Ogni file contiene una fase completa, quindi il frame ne mostra una alla volta, e poiché sono allineati ogni clic sembra aggiungere un livello:

```latex [lecture.tex]
\begin{frame}{From geometry to bending moment}
  \centering
  \includegraphics<1>[width=0.8\linewidth]{frame-1.pdf}%
  \includegraphics<2>[width=0.8\linewidth]{frame-2.pdf}%
  \includegraphics<3>[width=0.8\linewidth]{frame-3.pdf}%
  \includegraphics<4>[width=0.8\linewidth]{frame-4.pdf}%
  \includegraphics<5>[width=0.8\linewidth]{frame-5.pdf}
\end{frame}
```

In PowerPoint, metti i cinque file su cinque slide consecutive senza transizioni: ogni passaggio appare come un clic durante la lezione.

## Dispense e materiale da distribuire {#notes-and-handouts}

- **Dispense sul web.** VitePress e Nuxt renderizzano le figure in fase di build, quindi le figure sono nell’HTML prima che venga eseguito qualsiasi script: vedi [Integrazione](/it/plot/embedding).
- **Dispense stampate.** Scrivi le figure con `structureSvg` in una pagina HTML e stampala, come fa lo [script per il compito stampato](/it/plot/exercises#print-a-test), oppure includi i file in LaTeX o Word.
- **Un modello, tutte le figure.** Lo stesso `frame.ts` alimenta le slide, le dispense e il testo dell’esercizio, quindi non possono mai essere in disaccordo.
