---
title: Vykreslenie výsledkov
description: "Ako z vyriešeného modelu @edubeam/fem urobiť priebehy pomocou @edubeam/plot: vo Vue komponente, ako súbor SVG zo skriptu v Node alebo ako JSON na neskôr."
order: 11
source: site
---

# Vykreslenie výsledkov {#drawing-the-results}

Knižnica [@edubeam/plot](/sk/plot) vykreslí vyriešený model tak, ako vyzerajú obrázky na tomto webe: prvky, podpery, zaťaženie, reakcie, priebehy N, V a M a deformovaný tvar, to všetko ako SVG. Stačí jej odovzdať riešič; všetko potrebné si z neho prečíta sama.

```bash
npm install @edubeam/plot @edubeam/fem vue
```

## Vo Vue komponente {#in-a-vue-component}

```vue [BeamFigure.vue]
<script setup lang="ts">
import { markRaw } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot } from '@edubeam/plot'

// Prostý nosník s rozpätím 6 m so zaťažením 12 kN/m, v jednotkách SI: m, N, Pa
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // pevný kĺb
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // posuvný kĺb
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

// Riešič sa len číta, nesleduje: markRaw zabráni tomu, aby z neho Vue robilo reaktívny objekt
const beam = markRaw(solver)
</script>

<template>
  <StructurePlot
    :solver="beam"
    :layers="['members', 'supports', 'loads', 'reactions', 'M']"
  />
</template>
```

Komponent vykreslí reakcie 36 kN a moment 54 kNm, rovnako ako tento živý obrázok:

::model-figure{caption="Čo vykreslí BeamFigure.vue"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
---
::

`StructurePlot` kreslí zaťažovací stav 0; iný zo `solver.loadCases` zvolíte pomocou prop `loadCase`. Zmeny riešiča nesleduje: keď model zmeníte a znova prepočítate, prekreslíte obrázok zmenou prop `revision`. Všetky voľby nájdete na stránke [StructurePlot](/sk/plot/structure-plot).

## Bez prehliadača {#without-a-browser}

`structureSvg`, novinka v @edubeam/plot 0.2, zapíše ten istý výkres ako samostatný súbor SVG s obyčajnými farbami, ktorým rozumie Word, Inkscape aj nástroje okolo LaTeXu. Bez prehliadača a bez komponentu Vue, stačí skript v Node:

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { modelFromSolver, structureSvg } from '@edubeam/plot'

// Ten istý nosník ako v BeamFigure.vue
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

Súbor ukazuje to isté ako živý obrázok vyššie, len vo farbách pre tlač. `width` určuje jeho šírku v pixeloch, pretože tu nie je žiadny prvok stránky, podľa ktorého by sa veľkosť zmerala. Celú stránku obrázkov na tlač získate tak, že niekoľko takých súborov vložíte do jednej HTML stránky, ako to robí [generátor písomiek](/sk/plot/exercises#print-a-test) v dokumentácii @edubeam/plot, bez Vue aj bez prehliadača. Voľby funkcie `structureSvg` opisuje stránka [Funkcie](/sk/plot/functions#a-standalone-svg-file).

## Posielajte výkres, nie riešič {#ship-the-drawing-not-the-solver}

`modelFromSolver` prevedie vyriešený model na obyčajné dáta serializovateľné do JSON: geometriu, zaťaženie, reakcie a výsledky každého prvku ako presné polynómy. Model vypočítajte pri builde, pošlite JSON a vykreslite ho cez prop `model` namiesto `solver`:

```ts
import { modelFromSolver } from '@edubeam/plot'

// ... vyriešený nosník z to-svg.ts
writeFileSync('beam.json', JSON.stringify(modelFromSolver(solver)))
```

Stránka, ktorá obrázok zobrazuje, potom nič nepočíta: práca prebehne raz, pri builde. Ako to vyzerá na strane komponentu, ukazuje stránka [Vkladanie do stránok](/sk/plot/embedding#ship-the-drawing-not-the-solver) a formát dát stránka [Model na vykreslenie](/sk/plot/model).

Všetko ostatné, od farieb cez hodnoty pri kurzore až po zaťaženie, ktoré sa dá ťahať myšou, nájdete v [dokumentácii @edubeam/plot](/sk/plot/getting-started).
