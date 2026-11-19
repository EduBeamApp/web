---
title: Per iniziare
description: "Installa @edubeam/plot, disegna in un’app Vue 3 una trave risolta con @edubeam/fem, con carichi, reazioni e momento flettente, aggiornala e salvala in SVG."
order: 1
group: Introduzione
source: site
---

# Per iniziare

La libreria @edubeam/plot disegna in SVG una trave, un telaio o una travatura reticolare piana insieme ai suoi risultati: aste, vincoli, carichi, reazioni, diagrammi di N, V e M e deformata, con lo stesso aspetto delle figure di questo sito. Riceve un modello risolto con [@edubeam/fem](/it/solver), il solutore di [EduBeam]{.edubeam}, e pensa da sé all’impaginazione, alla scala e alla posizione di ogni valore.

I docenti la usano per [esercizi e compiti](/it/plot/exercises) generati a partire da un seme (valore iniziale del generatore casuale), per [slide](/it/plot/slides) in cui la figura si costruisce un clic alla volta e per le figure delle dispense, in una pagina web o come file per LaTeX e Word. Con questa libreria sono fatti anche gli [Esercizi di statica](/it/practice) e il [generatore di compiti](/it/exam) di questo sito.

::div{.actions}
[Disegna la tua prima figura](#draw-a-solved-model) [Genera esercizi](/it/plot/exercises)
::

## Installazione {#install}

```bash
npm install @edubeam/plot @edubeam/fem vue
```

Vue 3.5 o successivo e il solutore sono peer dependencies, così la tua app ne tiene una sola copia ciascuno. Il pacchetto è solo ESM, include i propri tipi e non richiede alcun foglio di stile. Funziona con Node 20.19 o successivo; per eseguire direttamente uno script scritto in TypeScript, con `node script.ts`, serve Node 22.18 o successivo.

## Disegnare un modello risolto {#draw-a-solved-model}

Bastano due file. Il primo, `beams.ts`, costruisce e risolve una trave con @edubeam/fem. È una semplice funzione, quindi lo stesso modello può alimentare una pagina, una slide e uno script:

```ts [beams.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Trave semplicemente appoggiata, lunga `span` m, con `q` kN/m: risolta. Il solutore lavora in unità SI. */
export const simpleBeam = (span: number, q: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 }) // acciaio, Pa
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 }) // IPE 200, senza deformazione a taglio
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // cerniera
  domain.createNode('B', [span, 0, 0], [DofID.Dz]) // carrello
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true) // N/m, +z verso il basso
  solver.solve()
  return solver
}
```

Il secondo, `BeamFigure.vue`, passa il solutore a `StructurePlot` e indica che cosa disegnare:

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

Ecco tutta la figura: la trave sui suoi vincoli, il carico di 12 kN/m, le due reazioni da 36 kN e il momento flettente, $qL^2/8 = 54$ kNm in mezzeria, disegnato dal lato teso:

::model-figure{caption="Ciò che disegna BeamFigure.vue: una campata di 6 m con 12 kN/m"}
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

La figura occupa tutta la larghezza del contenitore e stabilisce da sé la propria altezza. Testi, simboli e spessori delle linee mantengono la loro dimensione in pixel qualunque sia la dimensione della struttura, così la figura resta leggibile anche su uno smartphone. Se ometti `layers`, è la figura a scegliere il risultato: M per travi e telai, N per una travatura reticolare. Tutti i [livelli](/it/plot/structure-plot#layers) sono descritti con `StructurePlot`; come costruire i modelli è spiegato nella [documentazione del solutore](/it/solver/getting-started).

## Quando il modello cambia {#when-the-model-changes}

Una figura legge il solutore che le passi, ma non lo osserva. Quando qualcosa cambia, risolvi di nuovo e passa il nuovo solutore. È esattamente ciò che fa una `computed`:

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

Una trave come questa si risolve in circa un millisecondo, quindi la figura segue il cursore mentre si sposta. Hai invece modificato un solutore esistente? Incrementa la prop `revision` e la figura lo rilegge.

::callout{type="tip" title="Tieni i solutori fuori dalla reattività profonda"}
Una `computed`, una prop o una semplice `const` conservano il solutore così com’è. Per tenerne uno nello stato di un componente, usa `shallowRef` oppure avvolgilo in `markRaw`: con un normale `ref` Vue percorrerebbe l’intero solutore per renderlo reattivo, senza alcun vantaggio.
::

## Salvarla come file {#save-it-as-a-file}

Per una figura da inserire in LaTeX, Word o Inkscape, `structureSvg` scrive lo stesso disegno come file SVG autonomo, con colori fissi. Non servono né Vue né un browser, basta Node. Salva questo file come `beam-svg.ts` accanto a `beams.ts`:

```ts [beam-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { simpleBeam } from './beams.ts'

const svg = structureSvg(modelFromSolver(simpleBeam(6, 12)), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
})
writeFileSync('beam.svg', svg)
```

Eseguilo con `node beam-svg.ts` (Node 22.18 o successivo; con le versioni precedenti, `npx tsx beam-svg.ts`). Le opzioni, e come inserire il file in LaTeX e Word, sono descritte in [Un file SVG autonomo](/it/plot/functions#a-standalone-svg-file).

## La figura con i diagrammi in colonna {#the-stacked-figure}

`DiagramStack` disegna la figura di ogni libro di statica: una trave rettilinea con i suoi carichi e, sotto, sullo stesso asse x, il taglio V(x), il momento flettente M(x) e la freccia w(x). Con `v-model:load-at` il lettore può trascinare un carico concentrato lungo la trave e vedere i diagrammi seguirlo:

```vue
<DiagramStack v-model:load-at="at" :solver="solveWithLoadAt(at)" />
```

L’esempio completo è nella pagina [DiagramStack](/it/plot/diagram-stack).

## Usarla ovunque {#use-it-everywhere}

Per registrare entrambi i componenti a livello globale, invece di importarli dove li usi:

```ts [main.ts]
import { createApp } from 'vue'
import { EduBeamPlot } from '@edubeam/plot'
import App from './App.vue'

createApp(App).use(EduBeamPlot).mount('#app') // <StructurePlot> e <DiagramStack> in ogni template
```

Con gli import nominali il bundle resta più leggero: una pagina che importa solo `StructurePlot` non riceve né `DiagramStack` né il plugin. Entrambi i componenti vengono renderizzati anche lato server, in Nuxt o VitePress: vedi [Integrazione](/it/plot/embedding).

## Dove andare ora {#next}

::card-grid{cols="2"}
:::card{title="Esercizi e compiti" icon="lucide:dices" to="/it/plot/exercises"}
Un esercizio diverso per ogni studente a partire da un seme, con la sua soluzione, da stampare o da salvare per LaTeX.
:::
:::card{title="Slide e dispense" icon="lucide:presentation" to="/it/plot/slides"}
Figure che si costruiscono un clic alla volta in Slidev, Vue o Beamer, e le stesse figure per le dispense.
:::
:::card{title="StructurePlot" icon="lucide:frame" to="/it/plot/structure-plot"}
Livelli, quote, miniature, dimensioni, unità e lettura dei valori con il puntatore.
:::
:::card{title="DiagramStack" icon="lucide:rows-3" to="/it/plot/diagram-stack"}
Una trave sopra i suoi diagrammi di V, M e w, con un carico che il lettore può trascinare.
:::
::
