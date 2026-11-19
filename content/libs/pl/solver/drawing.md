---
title: Rysowanie wyników
description: "Wykresy z rozwiązanego modelu @edubeam/fem za pomocą @edubeam/plot: w komponencie Vue, jako plik SVG ze skryptu w Node albo jako JSON do narysowania później."
order: 11
source: site
---

# Rysowanie wyników {#drawing-the-results}

Biblioteka [@edubeam/plot](/pl/plot) rysuje rozwiązany model tak, jak wyglądają rysunki w tej witrynie: pręty, podpory, obciążenia, reakcje, wykresy N, V i M oraz postać odkształconą – jako SVG. Wystarczy przekazać jej solver; wszystko, czego potrzebuje, odczyta sama.

```bash
npm install @edubeam/plot @edubeam/fem vue
```

## W komponencie Vue {#in-a-vue-component}

```vue [BeamFigure.vue]
<script setup lang="ts">
import { markRaw } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot } from '@edubeam/plot'

// Belka swobodnie podparta o rozpiętości 6 m, obciążona 12 kN/m, w jednostkach SI: m, N, Pa
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // podpora nieprzesuwna
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // podpora przesuwna
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

// Solver jest tylko odczytywany, nie obserwowany: markRaw nie pozwala Vue uczynić go reaktywnym
const beam = markRaw(solver)
</script>

<template>
  <StructurePlot
    :solver="beam"
    :layers="['members', 'supports', 'loads', 'reactions', 'M']"
  />
</template>
```

Komponent rysuje reakcje 36 kN i moment 54 kNm, tak jak ten interaktywny rysunek:

::model-figure{caption="Co rysuje BeamFigure.vue"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
---
::

`StructurePlot` rysuje przypadek obciążenia 0; prop `loadCase` wybiera inny z `solver.loadCases`. Komponent nie obserwuje solvera: gdy zmienisz model i ponownie go rozwiążesz, zmień prop `revision`, aby odświeżyć rysunek. Wszystkie opcje opisuje strona [StructurePlot](/pl/plot/structure-plot).

## Bez przeglądarki {#without-a-browser}

`structureSvg`, nowość w @edubeam/plot 0.2, zapisuje ten sam rysunek jako samodzielny plik SVG, z prostymi kolorami, które rozumieją Word, Inkscape i narzędzia LaTeX-a. Bez przeglądarki i bez komponentu Vue – wystarczy skrypt w Node:

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { modelFromSolver, structureSvg } from '@edubeam/plot'

// Ta sama belka co w BeamFigure.vue
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

Plik pokazuje to samo co interaktywny rysunek powyżej, w kolorach do druku. `width` ustala jego szerokość w pikselach, bo nie ma kontenera, którego rozmiar można by zmierzyć. Aby uzyskać całą stronę rysunków do druku, umieść kilka takich plików na jednej stronie HTML, tak jak robi to [skrypt drukujący kolokwia](/pl/plot/exercises#print-a-test) z dokumentacji @edubeam/plot – bez Vue i bez przeglądarki. Opcje `structureSvg` opisuje strona [Funkcje](/pl/plot/functions#a-standalone-svg-file).

## Dostarcz rysunek, nie solver {#ship-the-drawing-not-the-solver}

`modelFromSolver` zamienia rozwiązany model na zwykłe dane, które można serializować do JSON: geometrię, obciążenia, reakcje i wyniki każdego pręta w postaci dokładnych wielomianów. Rozwiąż model podczas buildu, dołącz plik JSON i narysuj go za pomocą propa `model` zamiast `solver`:

```ts
import { modelFromSolver } from '@edubeam/plot'

// ... rozwiązana belka z to-svg.ts
writeFileSync('beam.json', JSON.stringify(modelFromSolver(solver)))
```

Strona, która pokazuje rysunek, niczego wtedy nie rozwiązuje: obliczenia wykonuje się raz, podczas buildu. Część [Osadzanie](/pl/plot/embedding#ship-the-drawing-not-the-solver) pokazuje, jak wygląda to po stronie komponentu, a strona [Model rysunku](/pl/plot/model) opisuje format danych.

Wszystko inne, od kolorów po odczyt wartości po najechaniu kursorem i przeciągane obciążenia, opisuje [dokumentacja @edubeam/plot](/pl/plot/getting-started).
