---
title: Desenarea rezultatelor
description: "Transformă un model @edubeam/fem calculat în diagrame cu @edubeam/plot: într-o componentă Vue, ca fișier SVG de sine stătător dintr-un script Node sau ca JSON de desenat mai târziu."
order: 11
source: site
---

# Desenarea rezultatelor {#drawing-the-results}

[@edubeam/plot](/ro/plot) desenează un model calculat așa cum arată figurile de pe acest site: bare, reazeme, încărcări, reacțiuni, diagramele N, V și M și deformata, ca SVG. Dă-i programul de calcul; citește singur tot ce îi trebuie.

```bash
npm install @edubeam/plot @edubeam/fem vue
```

## Într-o componentă Vue {#in-a-vue-component}

```vue [BeamFigure.vue]
<script setup lang="ts">
import { markRaw } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot } from '@edubeam/plot'

// O grindă simplu rezemată de 6 m sub 12 kN/m, în unități SI: m, N, Pa
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // articulație
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // reazem simplu
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

// Doar citit, niciodată urmărit: markRaw împiedică Vue să facă programul de calcul reactiv
const beam = markRaw(solver)
</script>

<template>
  <StructurePlot
    :solver="beam"
    :layers="['members', 'supports', 'loads', 'reactions', 'M']"
  />
</template>
```

Componenta desenează reacțiunile de 36 kN și momentul de 54 kNm, ca în această figură interactivă:

::model-figure{caption="Ce desenează BeamFigure.vue"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
---
::

`StructurePlot` desenează cazul de încărcare 0; prop-ul `loadCase` alege altul din `solver.loadCases`. Componenta nu urmărește programul de calcul: după ce modifici modelul și îl calculezi din nou, schimbă prop-ul `revision` ca să redeseneze. [StructurePlot](/ro/plot/structure-plot) descrie toate opțiunile.

## Fără browser {#without-a-browser}

`structureSvg`, nou în @edubeam/plot 0.2, scrie același desen ca fișier SVG de sine stătător, cu culori simple pe care le înțeleg Word, Inkscape și instrumentele LaTeX. Fără browser, fără componentă Vue, doar un script Node:

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { modelFromSolver, structureSvg } from '@edubeam/plot'

// Aceeași grindă ca în BeamFigure.vue
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

Fișierul arată ce arată și figura interactivă de mai sus, în culori pentru tipar. `width` îi stabilește dimensiunea în pixeli, deoarece nu există un container care să poată fi măsurat. Pentru o pagină întreagă de figuri de tipărit, pune mai multe astfel de fișiere într-o singură pagină HTML, cum face [generatorul de teste](/ro/plot/exercises#print-a-test) din @edubeam/plot, fără Vue și fără browser. Opțiunile lui `structureSvg` sunt în [Funcții](/ro/plot/functions#a-standalone-svg-file).

## Livrează desenul, nu programul de calcul {#ship-the-drawing-not-the-solver}

`modelFromSolver` transformă un model calculat în date simple, serializabile ca JSON: geometria, încărcările, reacțiunile și rezultatele fiecărei bare ca polinoame exacte. Calculează modelul la build, livrează fișierul JSON și desenează-l cu prop-ul `model` în loc de `solver`:

```ts
import { modelFromSolver } from '@edubeam/plot'

// ... grinda calculată din to-svg.ts
writeFileSync('beam.json', JSON.stringify(modelFromSolver(solver)))
```

O pagină care afișează figura nu mai calculează nimic: munca se face o singură dată, la build. [Integrare](/ro/plot/embedding#ship-the-drawing-not-the-solver) arată partea de componentă, iar [Modelul desenului](/ro/plot/model) descrie formatul.

Tot restul, de la culori la valorile afișate la cursor și la încărcările care pot fi trase, se găsește în [documentația @edubeam/plot](/ro/plot/getting-started).
