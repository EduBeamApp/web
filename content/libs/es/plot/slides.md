---
title: Diapositivas y apuntes
description: "Figuras para clase con @edubeam/plot que se completan clic a clic en Slidev, Vue o Beamer, se resuelven en directo y pasan a apuntes, PowerPoint y Word como SVG."
order: 6
source: site
---

# Diapositivas y apuntes de clase

Muestra una estructura en el mismo orden en que la explicas: primero la geometría, después los apoyos y las cargas, luego las reacciones y, por último, el momento flector. Una figura dibujada a partir de un modelo resuelto se completa en su sitio, una capa por clic, y siempre es correcta. El mismo modelo te da después las figuras de los apuntes.

![Una diapositiva de Slidev tras 0, 2 y 4 clics: los nodos de un pórtico con sus cotas, después el pórtico sobre sus apoyos con las cargas y, por último, las reacciones y el momento flector](/screenshots/es/p2p-plot-slidev-steps.webp){.shot-md}

## Una figura que se completa paso a paso {#a-figure-that-builds-up}

Bastan dos archivos. `frame.ts` crea y resuelve la estructura:

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Un pórtico de 6 m por 4 m, con pies articulados, 10 kN/m en el dintel y 15 kN empujando en B. */
export const portalFrame = (): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 }) // IPE 300
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [0, 0, -4]) // z apunta hacia abajo: 4 m hacia arriba
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

`BuildUp.vue` la dibuja por etapas. Cada etapa enumera las capas que muestra, y `reserve` las compone todas desde el primer clic, así que cada capa aparece con un fundido en su sitio y nada se mueve:

```vue [BuildUp.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { StructurePlot, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame'

const props = defineProps<{ step: number }>()

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'], // la geometría
  ['nodeLabels', 'members', 'supports'], // la estructura
  ['nodeLabels', 'members', 'supports', 'loads'], // sus cargas
  ['members', 'supports', 'loads', 'reactions'], // las reacciones
  ['members', 'supports', 'reactions', 'M'], // y el momento flector
]
const all = [...new Set(stages.flat())] // compuestas desde el primer paso, así nada se mueve después
const layers = computed(() => stages[Math.min(props.step, stages.length - 1)])

const frame = portalFrame()
</script>

<template>
  <StructurePlot :solver="frame" :layers="layers" :reserve="all" :height="360" />
</template>
```

Una capa también puede desaparecer: la última etapa quita las cargas para dejar sitio al momento. `:height="360"` mantiene la figura dentro de la diapositiva. Las barras se dibujan de un extremo a otro la primera vez que aparecen, y las capas aparecen con un fundido de medio segundo; ambas animaciones se desactivan con `prefers-reduced-motion`, y `:animate="false"` las desactiva para todos. Para hacerlas más lentas en un aula grande, consulta [Personalizar la animación](/es/plot/theming#restyling-the-animation).

## En Slidev {#in-slidev}

[Slidev](https://sli.dev) crea diapositivas a partir de Markdown con Vue, así que el componente funciona allí tal cual. Instala las bibliotecas en el proyecto de la presentación:

```bash
npm install @edubeam/plot @edubeam/fem
```

Pon `frame.ts` y `BuildUp.vue` en la carpeta `components/` de la presentación, y deja que los clics de la diapositiva controlen la etapa en `slides.md`:

```md [slides.md]
---
clicks: 4
---

# From geometry to bending moment

<BuildUp :step="$clicks" />
```

`clicks: 4` da a la diapositiva cuatro clics, y `$clicks` los cuenta desde 0. Cada pulsación de la flecha muestra la siguiente etapa; al retroceder, se vuelve a ocultar. `slidev export` genera un PDF de la presentación, con una página por clic si añades `--with-clicks`.

## En cualquier presentación con Vue {#in-any-vue-slides}

En cualquier otro sitio, lleva tú la cuenta de la etapa:

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

## Resolver en directo {#solve-it-live}

El solver tarda milisegundos en resolver un pórtico como este, así que en plena clase se puede modificar la estructura y resolverla al momento. Vincula una carga a un control deslizante y pasa cada vez un nuevo modelo resuelto, como en [Cuando el modelo cambia](/es/plot/getting-started#when-the-model-changes).

- **Una carga móvil.** [DiagramStack](/es/plot/diagram-stack#a-load-the-reader-can-drag) permite a los estudiantes arrastrar una carga puntual a lo largo de una viga y ver cómo la siguen el cortante y el momento flector.
- **Casos lado a lado.** Fija [`diagramScale`](/es/plot/structure-plot#several-plots-at-one-scale) y dos gráficos dibujarán sus momentos a la misma escala, de modo que el mayor se vea mayor.
- **Lectura de valores.** Con `hover`, al pasar el puntero por una barra se marca el valor en el extremo de la ordenada de cada diagrama: consulta [Lectura de valores](/es/plot/structure-plot#reading-values).

## Figuras para Beamer, PowerPoint y Word {#figures-for-beamer-powerpoint-and-word}

Una presentación hecha con LaTeX Beamer o PowerPoint, o unos apuntes escritos en Word, recibe la figura como archivo. `structureSvg` escribe el gráfico como un SVG independiente con colores fijos, compuesto igual que lo compone `StructurePlot`. Un script de Node, `frame-svg.ts`, junto a `frame.ts`:

```ts [frame-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![El pórtico como archivo SVG independiente, renderizado con CairoSVG: las cargas, las reacciones, 20 y 40 hacia arriba y 2,3 y 12,7 en horizontal, y el momento flector de −50,7 en C a 29,3 en el dintel](/screenshots/es/p2p-plot-frame-svg.webp){.shot-lg}

PowerPoint y Word (2019 y Microsoft 365) insertan el SVG tal cual. LaTeX lo necesita en PDF: conviértelo con `cairosvg frame.svg -o frame.pdf` o con Inkscape, o deja que lo haga `\includesvg` del paquete `svg`. En [Figuras para LaTeX y Word](/es/plot/exercises#figures-for-latex-and-word) tienes los detalles, y en [Un archivo SVG independiente](/es/plot/functions#a-standalone-svg-file), todas las opciones.

### Una figura por etapas en Beamer {#a-build-up-in-beamer}

Un archivo se ajusta a las capas que dibuja, así que los archivos escritos por separado para cada etapa no coincidirían entre sí. Pasa a `structureSvg` el mismo `reserve` que a `BuildUp.vue`, con todas las capas de todas las etapas, y todos los archivos tendrán el mismo tamaño, con la estructura en el mismo sitio. `frame-stages.ts` escribe un archivo por etapa:

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

Convierte los archivos a PDF:

```bash
for i in 1 2 3 4 5; do cairosvg frame-$i.svg -o frame-$i.pdf; done
```

y asigna a cada uno su propia superposición (*overlay*). Cada archivo contiene una etapa completa, así que el *frame* muestra uno cada vez, y como coinciden, cada clic parece añadir una capa:

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

En PowerPoint, pon los cinco archivos en cinco diapositivas consecutivas sin transición entre ellas: cada paso se ve igual que un clic en clase.

## Apuntes y material impreso {#notes-and-handouts}

- **Apuntes en la web.** VitePress y Nuxt renderizan los gráficos al generar el sitio, así que las figuras ya están en el HTML antes de que se ejecute ningún script: consulta [Integración](/es/plot/embedding).
- **Apuntes impresos.** Escribe las figuras con `structureSvg` en una página HTML e imprímela, como hace el [script que imprime un examen](/es/plot/exercises#print-a-test), o incluye los archivos en LaTeX o Word.
- **Un modelo, todas las figuras.** El mismo `frame.ts` alimenta las diapositivas, los apuntes y la hoja de ejercicios, así que nunca se contradicen.
