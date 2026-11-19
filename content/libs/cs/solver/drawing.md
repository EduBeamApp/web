---
title: Vykreslení výsledků
description: "Jak z vyřešeného modelu @edubeam/fem udělat průběhy pomocí @edubeam/plot: ve Vue komponentě, jako samostatný soubor SVG ze skriptu v Node, nebo jako JSON k pozdějšímu vykreslení."
order: 11
---

# Vykreslení výsledků {#drawing-the-results}

Knihovna [@edubeam/plot](/cs/plot) vykreslí vyřešený model tak, jak vypadají obrázky na tomto webu: prvky, podpory, zatížení, reakce, průběhy N, V a M a deformovaný tvar, to vše jako SVG. Stačí jí předat řešič; všechno potřebné si z něj přečte sama.

```bash
npm install @edubeam/plot @edubeam/fem vue
```

## Ve Vue komponentě {#in-a-vue-component}

```vue [BeamFigure.vue]
<script setup lang="ts">
import { markRaw } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot } from '@edubeam/plot'

// Prostý nosník o rozpětí 6 m se zatížením 12 kN/m, v jednotkách SI: m, N, Pa
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // kloub
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // posuvný kloub
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

// Řešič se jen čte, nesleduje: markRaw zabrání tomu, aby z něj Vue dělalo reaktivní objekt
const beam = markRaw(solver)
</script>

<template>
  <StructurePlot
    :solver="beam"
    :layers="['members', 'supports', 'loads', 'reactions', 'M']"
  />
</template>
```

Komponenta vykreslí reakce 36 kN a moment 54 kNm, stejně jako tento živý obrázek:

::model-figure{caption="Co vykreslí BeamFigure.vue"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
---
::

`StructurePlot` kreslí zatěžovací stav 0; jiný ze `solver.loadCases` zvolíte pomocí prop `loadCase`. Změny řešiče nesleduje: když model změníte a znovu spočítáte, překreslíte obrázek změnou prop `revision`. Všechny volby najdete na stránce [StructurePlot](/cs/plot/structure-plot).

## Bez prohlížeče {#without-a-browser}

`structureSvg`, novinka v @edubeam/plot 0.2, zapíše stejný výkres jako samostatný soubor SVG s obyčejnými barvami, kterým rozumí Word, Inkscape i nástroje kolem LaTeXu. Bez prohlížeče a bez Vue komponenty, stačí skript v Node:

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { modelFromSolver, structureSvg } from '@edubeam/plot'

// Stejný nosník jako v BeamFigure.vue
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

Soubor ukazuje totéž co živý obrázek výše, jen v barvách pro tisk. `width` určuje jeho šířku v pixelech, protože tu není žádný prvek stránky, podle kterého by se velikost změřila. Celou stránku obrázků k tisku získáte tak, že několik takových souborů vložíte do jedné HTML stránky, jak to dělá [generátor písemek](/cs/plot/exercises#print-a-test) v dokumentaci @edubeam/plot, bez Vue i bez prohlížeče. Volby funkce `structureSvg` popisuje stránka [Funkce](/cs/plot/functions#a-standalone-svg-file).

## Posílejte výkres, ne řešič {#ship-the-drawing-not-the-solver}

`modelFromSolver` převede vyřešený model na obyčejná data serializovatelná do JSON: geometrii, zatížení, reakce a výsledky každého prvku jako přesné polynomy. Model spočítejte při buildu, pošlete JSON a vykreslete ho přes prop `model` místo `solver`:

```ts
import { modelFromSolver } from '@edubeam/plot'

// ... vyřešený nosník z to-svg.ts
writeFileSync('beam.json', JSON.stringify(modelFromSolver(solver)))
```

Stránka, která obrázek zobrazuje, pak nic nepočítá: práce proběhne jednou, při buildu. Stranu komponenty ukazuje stránka [Vkládání do stránek](/cs/plot/embedding#ship-the-drawing-not-the-solver) a formát dat stránka [Model pro vykreslení](/cs/plot/model).

Vše ostatní, od barev přes hodnoty po najetí myší až po zatížení, která lze posouvat myší, najdete v [dokumentaci @edubeam/plot](/cs/plot/getting-started).
