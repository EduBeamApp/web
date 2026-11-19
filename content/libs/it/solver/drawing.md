---
title: Disegnare i risultati
description: "Trasforma un modello @edubeam/fem risolto in diagrammi con @edubeam/plot: in un componente Vue, come file SVG da uno script Node o come JSON da disegnare dopo."
order: 11
source: site
---

# Disegnare i risultati {#drawing-the-results}

[@edubeam/plot](/it/plot) disegna un modello risolto con lo stesso aspetto delle figure di questo sito: aste, vincoli, carichi, reazioni, i diagrammi di N, V e M e la deformata, in SVG. Passagli il solutore: legge da sé tutto ciò che gli serve.

```bash
npm install @edubeam/plot @edubeam/fem vue
```

## In un componente Vue {#in-a-vue-component}

```vue [BeamFigure.vue]
<script setup lang="ts">
import { markRaw } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot } from '@edubeam/plot'

// Una trave semplicemente appoggiata di 6 m con 12 kN/m, in unità SI: m, N, Pa
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // cerniera
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // carrello
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

// Solo letto, mai osservato: markRaw impedisce a Vue di rendere reattivo il solutore
const beam = markRaw(solver)
</script>

<template>
  <StructurePlot
    :solver="beam"
    :layers="['members', 'supports', 'loads', 'reactions', 'M']"
  />
</template>
```

Il componente disegna le reazioni di 36 kN e il momento di 54 kNm, come in questa figura interattiva:

::model-figure{caption="Ciò che disegna BeamFigure.vue"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
---
::

`StructurePlot` disegna il caso di carico 0; la prop `loadCase` ne sceglie un altro tra quelli di `solver.loadCases`. Il componente non osserva il solutore: dopo aver modificato il modello e averlo risolto di nuovo, cambia la sua prop `revision` per ridisegnarlo. [StructurePlot](/it/plot/structure-plot) riporta tutte le opzioni.

## Senza browser {#without-a-browser}

`structureSvg`, novità di @edubeam/plot 0.2, scrive lo stesso disegno come file SVG autonomo, con colori semplici che Word, Inkscape e gli strumenti di LaTeX sanno leggere. Niente browser, niente componente Vue, solo uno script Node:

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { modelFromSolver, structureSvg } from '@edubeam/plot'

// La stessa trave di BeamFigure.vue
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

Il file contiene ciò che mostra la figura interattiva qui sopra, con i colori di stampa. `width` ne imposta la dimensione in pixel, perché non c’è un riquadro da misurare. Per un’intera pagina di figure da stampare, metti più file di questo tipo in un’unica pagina HTML, come fa lo [script per il compito stampato](/it/plot/exercises#print-a-test) di @edubeam/plot, senza Vue né browser. Le opzioni di `structureSvg` sono in [Funzioni](/it/plot/functions#a-standalone-svg-file).

## Distribuisci il disegno, non il solutore {#ship-the-drawing-not-the-solver}

`modelFromSolver` trasforma un modello risolto in dati semplici, serializzabili in JSON: geometria, carichi, reazioni e i risultati di ogni asta come polinomi esatti. Risolvi il modello durante la build, distribuisci il JSON e disegnalo con la prop `model` invece di `solver`:

```ts
import { modelFromSolver } from '@edubeam/plot'

// ... la trave risolta di to-svg.ts
writeFileSync('beam.json', JSON.stringify(modelFromSolver(solver)))
```

Così la pagina che mostra la figura non risolve nulla: il calcolo si fa una volta sola, durante la build. [Integrazione](/it/plot/embedding#ship-the-drawing-not-the-solver) mostra il lato del componente, e [Modello di disegno](/it/plot/model) il formato dei dati.

Tutto il resto, dai colori ai valori mostrati al passaggio del mouse fino ai carichi trascinabili, è nella [documentazione di @edubeam/plot](/it/plot/getting-started).
