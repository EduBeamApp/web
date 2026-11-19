---
title: Dibujar los resultados
description: "Dibuja con @edubeam/plot los diagramas de un modelo resuelto de @edubeam/fem: en un componente de Vue, como SVG independiente desde Node o como JSON."
order: 11
source: site
---

# Dibujar los resultados {#drawing-the-results}

[@edubeam/plot](/es/plot) dibuja un modelo resuelto tal como se ven las figuras de este sitio: barras, apoyos, cargas, reacciones, los diagramas de N, V y M y la deformada, en SVG. Pásale el solver; lee de él todo lo que necesita.

```bash
npm install @edubeam/plot @edubeam/fem vue
```

## En un componente de Vue {#in-a-vue-component}

```vue [BeamFigure.vue]
<script setup lang="ts">
import { markRaw } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot } from '@edubeam/plot'

// Una viga biapoyada de 6 m con 12 kN/m, en unidades SI: m, N, Pa
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // apoyo articulado
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // apoyo móvil
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

// Solo se lee, nunca se observa: markRaw evita que Vue haga reactivo el solver
const beam = markRaw(solver)
</script>

<template>
  <StructurePlot
    :solver="beam"
    :layers="['members', 'supports', 'loads', 'reactions', 'M']"
  />
</template>
```

Dibuja las reacciones de 36 kN y el momento de 54 kNm, como en esta figura interactiva:

::model-figure{caption="Lo que dibuja BeamFigure.vue"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
---
::

`StructurePlot` dibuja el caso de carga 0; la prop `loadCase` elige otro de `solver.loadCases`. No observa el solver: si cambias el modelo y vuelves a resolver, cambia su prop `revision` para que se redibuje. [StructurePlot](/es/plot/structure-plot) tiene todas las opciones.

## Sin navegador {#without-a-browser}

`structureSvg`, nuevo en @edubeam/plot 0.2, escribe el mismo dibujo como archivo SVG independiente, con colores fijos que entienden Word, Inkscape y las cadenas de herramientas de LaTeX. Sin navegador ni componente de Vue, solo un script de Node:

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { modelFromSolver, structureSvg } from '@edubeam/plot'

// La misma viga que en BeamFigure.vue
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

El archivo muestra lo mismo que la figura interactiva de arriba, con colores de impresión. `width` fija su tamaño en píxeles, ya que no hay ningún contenedor que medir. Para una página entera de figuras lista para imprimir, renderiza el componente de Vue a HTML en el servidor, como hace el [script que imprime un examen](/es/plot/exercises#print-a-test) de @edubeam/plot. Las opciones de `structureSvg` están en [Funciones](/es/plot/functions#a-standalone-svg-file).

## Entregar el dibujo, no el solver {#ship-the-drawing-not-the-solver}

`modelFromSolver` convierte un modelo resuelto en datos simples, serializables en JSON: la geometría, las cargas, las reacciones y los resultados de cada barra como polinomios exactos. Resuelve en tiempo de build, entrega el JSON y dibújalo con la prop `model` en lugar de `solver`:

```ts
import { modelFromSolver } from '@edubeam/plot'

// ... la viga resuelta de to-svg.ts
writeFileSync('beam.json', JSON.stringify(modelFromSolver(solver)))
```

Así, una página que muestra la figura no resuelve nada: el trabajo se hace una sola vez, cuando generas la página. [Integración](/es/plot/embedding#ship-the-drawing-not-the-solver) muestra el lado del componente, y [Modelo de dibujo](/es/plot/model), el formato.

Todo lo demás, desde los colores hasta las lecturas al pasar el ratón por encima y las cargas que se pueden arrastrar, está en la [documentación de @edubeam/plot](/es/plot/getting-started).
