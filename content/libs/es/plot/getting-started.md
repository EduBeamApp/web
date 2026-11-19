---
title: Primeros pasos
description: "Instala @edubeam/plot, dibuja en Vue 3 una viga resuelta con @edubeam/fem con sus cargas, reacciones y momento flector, actualízala y guárdala como SVG."
order: 1
group: Introducción
source: site
---

# Primeros pasos

La biblioteca de dibujo @edubeam/plot representa en SVG una viga, un pórtico o una celosía plana junto con sus resultados: barras, apoyos, cargas, reacciones, los diagramas de N, V y M y la deformada, con el mismo aspecto que las figuras de este sitio. Le das un modelo resuelto con [@edubeam/fem](/es/solver), el solver de [EduBeam]{.edubeam}, y la biblioteca decide la composición, la escala y dónde va cada número.

Los docentes la usan para [ejercicios y exámenes](/es/plot/exercises) generados a partir de una semilla, para [diapositivas](/es/plot/slides) en las que la figura se completa clic a clic y para las figuras de los apuntes, en una página web o como archivos para LaTeX y Word. Los [Problemas para practicar](/es/practice) y el [generador de exámenes](/es/exam) de este sitio están hechos con ella.

::div{.actions}
[Dibuja tu primer gráfico](#draw-a-solved-model) [Genera ejercicios](/es/plot/exercises)
::

## Instalación {#install}

```bash
npm install @edubeam/plot @edubeam/fem vue
```

Vue 3.5 o posterior y el solver son *peer dependencies*, así que tu aplicación conserva una sola copia de cada uno. El paquete es solo ESM, incluye sus propios tipos y no necesita hoja de estilos. Funciona en Node 20.19 o posterior; para ejecutar tal cual un script escrito en TypeScript, con `node script.ts`, necesitas Node 22.18 o posterior.

## Dibujar un modelo resuelto {#draw-a-solved-model}

Bastan dos archivos. El primero, `beams.ts`, crea y resuelve una viga con @edubeam/fem. Es una función normal, así que el mismo modelo puede alimentar una página, una diapositiva y un script:

```ts [beams.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Una viga biapoyada de `span` m bajo `q` kN/m, ya resuelta. El solver trabaja en unidades SI. */
export const simpleBeam = (span: number, q: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 }) // acero, Pa
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 }) // IPE 200, rígido a cortante
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // apoyo articulado
  domain.createNode('B', [span, 0, 0], [DofID.Dz]) // apoyo móvil
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true) // N/m, +z hacia abajo
  solver.solve()
  return solver
}
```

El segundo, `BeamFigure.vue`, pasa el solver a `StructurePlot` y le dice qué dibujar:

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

Esa es toda la figura: la viga sobre sus apoyos, la carga de 12 kN/m, las dos reacciones de 36 kN y el momento flector, $qL^2/8 = 54$ kNm en el centro del vano, dibujado en el lado traccionado:

::model-figure{caption="Lo que dibuja BeamFigure.vue: un vano de 6 m bajo 12 kN/m"}
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

El gráfico ocupa todo el ancho de su contenedor y calcula su propia altura. Los textos, los símbolos y los grosores de línea mantienen su tamaño en píxeles sea cual sea el tamaño de la estructura, así que la figura se lee bien incluso en un móvil. Si omites `layers`, el gráfico elige el resultado por sí mismo: M para vigas y pórticos, N para una celosía. Todas las [capas](/es/plot/structure-plot#layers) se describen en `StructurePlot`; cómo crear modelos lo explica la [documentación del solver](/es/solver/getting-started).

## Cuando el modelo cambia {#when-the-model-changes}

Un gráfico lee el solver que recibe, pero no lo vigila. Cuando algo cambia, vuelve a resolver y pasa el nuevo solver. Un `computed` hace exactamente eso:

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

Una viga así se resuelve en un milisegundo aproximadamente, de modo que la figura sigue al control deslizante mientras se mueve. ¿Has modificado un solver directamente, sin crear otro? Incrementa la prop `revision` y el gráfico lo vuelve a leer.

::callout{type="tip" title="No hagas reactivo el solver en profundidad"}
Un `computed`, una prop o una simple `const` guardan el solver tal cual. Para guardarlo en el estado de un componente, usa `shallowRef` o envuélvelo con `markRaw`: un `ref` normal haría que Vue recorriera el solver entero para volverlo reactivo, sin ninguna utilidad.
::

## Guardar como archivo {#save-it-as-a-file}

Para una figura en LaTeX, Word o Inkscape, `structureSvg` escribe el mismo dibujo como un archivo SVG independiente con colores fijos. No necesita Vue ni un navegador, solo Node. Guarda esto como `beam-svg.ts` junto a `beams.ts`:

```ts [beam-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { simpleBeam } from './beams.ts'

const svg = structureSvg(modelFromSolver(simpleBeam(6, 12)), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
})
writeFileSync('beam.svg', svg)
```

Ejecútalo con `node beam-svg.ts` (Node 22.18 o posterior; en versiones anteriores, `npx tsx beam-svg.ts`). Las opciones, y cómo llevar el archivo a LaTeX y Word, están en [Un archivo SVG independiente](/es/plot/functions#a-standalone-svg-file).

## La figura apilada {#the-stacked-figure}

`DiagramStack` dibuja la figura de cualquier libro de estática: una viga recta con sus cargas y, debajo, sobre el mismo eje x, su cortante V(x), su momento flector M(x) y su flecha w(x). Con `v-model:load-at`, el lector puede arrastrar una carga puntual a lo largo de la viga y ver cómo la siguen los diagramas:

```vue
<DiagramStack v-model:load-at="at" :solver="solveWithLoadAt(at)" />
```

El ejemplo completo está en [DiagramStack](/es/plot/diagram-stack).

## Usarlo en toda la aplicación {#use-it-everywhere}

Para registrar los dos componentes de forma global en lugar de importarlos allí donde los usas:

```ts [main.ts]
import { createApp } from 'vue'
import { EduBeamPlot } from '@edubeam/plot'
import App from './App.vue'

createApp(App).use(EduBeamPlot).mount('#app') // <StructurePlot> y <DiagramStack> en cualquier plantilla
```

Las importaciones con nombre mantienen el bundle más pequeño: una página que solo importa `StructurePlot` no recibe ni `DiagramStack` ni el plugin. Los dos componentes también se renderizan en el servidor, con Nuxt o VitePress: consulta [Integración](/es/plot/embedding).

## Siguientes pasos {#next}

::card-grid{cols="2"}
:::card{title="Ejercicios y exámenes" icon="lucide:dices" to="/es/plot/exercises"}
Un ejercicio distinto para cada estudiante a partir de una semilla, con su solución, impreso o guardado para LaTeX.
:::
:::card{title="Diapositivas y apuntes" icon="lucide:presentation" to="/es/plot/slides"}
Figuras que se completan clic a clic en Slidev, Vue o Beamer, y las mismas figuras para los apuntes.
:::
:::card{title="StructurePlot" icon="lucide:frame" to="/es/plot/structure-plot"}
Capas, cotas, miniaturas, tamaños, unidades y lectura de valores con el puntero.
:::
:::card{title="DiagramStack" icon="lucide:rows-3" to="/es/plot/diagram-stack"}
Una viga sobre sus diagramas de V, M y w, con una carga que el lector puede arrastrar.
:::
::
