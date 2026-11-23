---
title: Eredmények rajzolása
description: "Egy megoldott @edubeam/fem modellből ábrák az @edubeam/plot segítségével: Vue-komponensben, önálló SVG-fájlként Node-szkriptből, vagy JSON-ként későbbi rajzoláshoz."
order: 11
source: site
---

# Eredmények rajzolása {#drawing-the-results}

Az [@edubeam/plot](/hu/plot) úgy rajzolja meg a megoldott modellt, ahogy az ezen az oldalon látható ábrák kinéznek: rudak, támaszok, terhek, támaszerők, az N, V és M ábra és a deformált alak, SVG-ként. Elég átadnod neki a számítómagot; minden szükséges adatot maga olvas ki belőle.

```bash
npm install @edubeam/plot @edubeam/fem vue
```

## Vue-komponensben {#in-a-vue-component}

```vue [BeamFigure.vue]
<script setup lang="ts">
import { markRaw } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot } from '@edubeam/plot'

// 6 m-es kéttámaszú tartó 12 kN/m teherrel, SI-mértékegységekben: m, N, Pa
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // csuklós támasz
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // görgős támasz
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

// Csak olvassuk, nem figyeljük: a markRaw megakadályozza, hogy a Vue reaktívvá tegye a számítómagot
const beam = markRaw(solver)
</script>

<template>
  <StructurePlot
    :solver="beam"
    :layers="['members', 'supports', 'loads', 'reactions', 'M']"
  />
</template>
```

A komponens a 36 kN-os támaszerőket és az 54 kNm-es nyomatékot rajzolja meg, ahogy ez az élő ábra:

::model-figure{caption="Amit a BeamFigure.vue megrajzol"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
---
::

A `StructurePlot` a 0. terhelési esetet rajzolja; a `loadCase` prop a `solver.loadCases` egy másik elemét választja ki. A komponens nem figyeli a számítómagot: ha módosítod a modellt és újra megoldod, változtasd meg a `revision` propot az újrarajzoláshoz. Minden beállítás a [StructurePlot](/hu/plot/structure-plot) oldalon található.

## Böngésző nélkül {#without-a-browser}

Az @edubeam/plot 0.2-es verziójában megjelent `structureSvg` ugyanezt a rajzot önálló SVG-fájlként írja ki, egyszerű színekkel, amelyeket a Word, az Inkscape és a LaTeX-eszközök is értenek. Nem kell hozzá sem böngésző, sem Vue-komponens, elég egy Node-szkript:

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { modelFromSolver, structureSvg } from '@edubeam/plot'

// Ugyanaz a tartó, mint a BeamFigure.vue-ban
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

A fájl ugyanazt mutatja, mint a fenti élő ábra, nyomtatási színekkel. A `width` pixelben adja meg a méretét, mivel nincs tároló, amelynek a méretét le lehetne mérni. Egy teljes, nyomtatható ábraoldalhoz tegyél több ilyen fájlt egyetlen HTML-oldalra, ahogy az @edubeam/plot [dolgozatgenerátora](/hu/plot/exercises#print-a-test) is teszi, Vue és böngésző nélkül. A `structureSvg` beállításait a [Függvények](/hu/plot/functions#a-standalone-svg-file) oldal írja le.

## A rajzot szállítsd, ne a számítómagot {#ship-the-drawing-not-the-solver}

A `modelFromSolver` a megoldott modellt egyszerű, JSON-ná szerializálható adattá alakítja: geometria, terhek, támaszerők és minden rúd eredményei pontos polinomokként. Oldd meg a modellt buildeléskor, szállítsd a JSON-t, és a `solver` helyett a `model` proppal rajzold meg:

```ts
import { modelFromSolver } from '@edubeam/plot'

// ... a to-svg.ts megoldott tartója
writeFileSync('beam.json', JSON.stringify(modelFromSolver(solver)))
```

Az ábrát megjelenítő oldal így semmit sem old meg: a számítás egyszer, buildeléskor fut le. A [Beágyazás](/hu/plot/embedding#ship-the-drawing-not-the-solver) oldal a komponens oldalát mutatja be, az [A rajz modellje](/hu/plot/model) című oldal pedig az adatformátumot.

Minden más, a színektől az egérmutató alatti értékkiolvasáson át a húzható terhekig, az [@edubeam/plot dokumentációjában](/hu/plot/getting-started) található.
