---
title: Ejercicios y exámenes
description: "Con @edubeam/fem y @edubeam/plot, un ejercicio distinto para cada estudiante a partir de una semilla, con su solución: en la web, impreso o en SVG."
order: 5
group: Casos de uso
source: site
---

# Ejercicios y exámenes

Escribe una estructura una sola vez como función de una semilla (el valor inicial del generador aleatorio) y tendrás un ejercicio para cada estudiante, cada semana, cada uno con una solución que siempre es correcta: @edubeam/fem lo resuelve y @edubeam/plot dibuja el enunciado y la solución a partir del mismo modelo.

Pulsa **Nuevo ejercicio** aquí abajo. Cada pulsación es una semilla nueva: el ejercicio se genera, se resuelve y se dibuja en tu navegador.

::exercise-generator
::

La demostración dibuja los problemas de dos páginas de este sitio, ambas construidas con las piezas que se describen aquí: [Problemas para practicar](/es/practice), donde el estudiante introduce las reacciones y el momento máximo o el axil máximo y comprueba al momento si son correctos, y el [generador de exámenes](/es/exam), que imprime una versión distinta del examen para cada estudiante con la hoja de soluciones, y guarda las figuras como archivos SVG y las soluciones como CSV. Pruébalas antes de escribir tu propio generador.

## Cómo funciona {#how-it-works}

1. **La semilla elige los números.** Un generador aleatorio con semilla da el mismo ejercicio para la misma semilla, así que la semilla impresa en la hoja permite encontrar de nuevo su solución.
2. **El solver calcula la solución.** @edubeam/fem resuelve cada estructura, de modo que las reacciones y los momentos salen del solver, no de una fórmula en la que podrías equivocarte.
3. **El gráfico dibuja ambas cosas.** El enunciado muestra la estructura con los nombres de los nodos, las cotas y las reacciones incógnita con su nombre; la solución da los valores de las reacciones y añade el diagrama.

Unos pocos archivos cortos te llevan de aquí a un examen impreso: [el generador](#the-generator), [un componente](#the-exercise-in-a-page) para una página web y [un script](#print-a-test) que imprime un examen o [escribe las figuras](#figures-for-latex-and-word) para LaTeX y Word. Cópialos en un proyecto que tenga [las bibliotecas instaladas](/es/plot/getting-started#install); los scripts se ejecutan con `node` a partir de la versión 22.18, o con `npx tsx` en versiones anteriores.

## El generador {#the-generator}

Un único módulo, `exercise.ts`, convierte una semilla en un ejercicio: una viga sobre un apoyo articulado y un apoyo móvil, la mitad de las veces con un voladizo que lleva una carga puntual en su extremo libre. Los dos casos son isostáticos, así que cualquier semilla se puede resolver a mano igual que con el solver.

```ts [exercise.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { extremes, modelFromSolver, type PlotModel } from '@edubeam/plot'

export interface Exercise {
  readonly seed: number
  readonly statement: string
  /** La estructura resuelta como datos simples: de ella se dibujan el enunciado y la solución */
  readonly model: PlotModel
  /** Reacciones en los apoyos, positivas hacia arriba, N, y momentos flectores extremos, N·m */
  readonly key: { RA: number; RB: number; mMax: number; mMin: number }
}

/** mulberry32: un generador diminuto con semilla, para que una semilla designe siempre el mismo ejercicio */
const random = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), seed | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export const makeExercise = (seed: number): Exercise => {
  const r = random(seed)
  const pick = <T>(xs: readonly T[]): T => xs[Math.floor(r() * xs.length)]
  const int = (lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1))

  // Un vano sobre apoyo articulado y apoyo móvil, la mitad de las veces con voladizo: isostático, siempre resoluble
  const L = pick([4, 5, 6]) // m
  const c = pick([0, 0, 1, 1.5, 2]) // m de voladizo
  const q = int(4, 12) // kN/m en el vano
  const F = int(2, 6) * 5 // kN en el extremo libre, o a `a` de A si no hay voladizo
  const a = int(1, L - 1) // m

  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  if (c > 0) {
    domain.createNode('C', [L + c, 0, 0])
    domain.createBeam2D(2, ['B', 'C'], 1, 1)
    lc.createNodalLoad('C', { [DofID.Dz]: F * 1e3 })
  } else {
    lc.createBeamConcentratedLoad(1, [0, F * 1e3, 0, a], true)
  }
  solver.solve()

  const statement =
    c > 0
      ? `Span L = ${L} m with an overhang c = ${c} m. q = ${q} kN/m on the span, F = ${F} kN at the tip C.`
      : `Span L = ${L} m. q = ${q} kN/m over the span, F = ${F} kN at ${a} m from A.`

  // La solución, del modelo resuelto: reacciones (z apunta hacia abajo, así que hacia arriba es negativo) y extremos exactos de M
  const model = modelFromSolver(solver)
  const { reactions, members } = model.results!
  const up = (node: string) => -(reactions.find((x) => x.node === node && x.dof === 'dz')?.value ?? 0)
  const m = Object.values(members).flatMap((member) => extremes(member.M) ?? [])
  const mMax = Math.max(...m.map((e) => e.max.value))
  const mMin = Math.min(...m.map((e) => e.min.value))

  return { seed, statement, model, key: { RA: up('A'), RB: up('B'), mMax, mMin } }
}
```

`modelFromSolver` convierte la estructura resuelta en un [modelo de dibujo](/es/plot/model): datos simples con las reacciones y los resultados de cada barra como polinomios exactos, de modo que `extremes` encuentra los momentos máximos sin muestrear. El ejercicio solo conserva ese modelo; el solver ya no hace falta.

La semilla 5 da «Span L = 6 m with an overhang c = 1.5 m. q = 5 kN/m on the span, F = 25 kN at the tip C.» (una viga de 6 m de luz con un voladizo de 1,5 m, 5 kN/m en el vano y 25 kN en el extremo libre C). Su solución: $R_A = (5 \cdot 6 \cdot 3 - 25 \cdot 1{,}5)/6 = 8{,}75$ kN, $R_B = 5 \cdot 6 + 25 - 8{,}75 = 46{,}25$ kN, $M_B = -25 \cdot 1{,}5 = -37{,}5$ kNm sobre el apoyo y $M = 8{,}75^2/(2 \cdot 5) = 7{,}66$ kNm en el vano, donde el cortante se anula. El solver coincide hasta la última cifra.

## En una página web {#the-exercise-in-a-page}

Un componente, `ExerciseCard.vue`, dibuja el enunciado o, con `answers`, la solución:

```vue [ExerciseCard.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { formatQuantity, KN_UNITS, StructurePlot, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise'

const props = defineProps<{ seed: number; answers?: boolean }>()
const exercise = computed(() => makeExercise(props.seed))

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']
const twoDecimals = new Intl.NumberFormat('en', { maximumFractionDigits: 2 })
const kN = (si: number) => formatQuantity(si, KN_UNITS.force, twoDecimals)
const kNm = (si: number) => formatQuantity(si, KN_UNITS.moment, twoDecimals)
</script>

<template>
  <article>
    <h3>Exercise {{ seed }}</h3>
    <p>{{ exercise.statement }} Find the reactions and draw the bending moment diagram.</p>
    <StructurePlot
      :model="exercise.model"
      :layers="answers ? key : sheet"
      :reserve="[...sheet, ...key]"
      :reaction-labels="answers ? 'values' : 'names'"
      :reserve-reaction-labels="['names', 'values']"
    />
    <p v-if="answers">
      R<sub>A</sub> = {{ kN(exercise.key.RA) }}, R<sub>B</sub> = {{ kN(exercise.key.RB) }},
      M from {{ kNm(exercise.key.mMin) }} to {{ kNm(exercise.key.mMax) }}
    </p>
  </article>
</template>
```

```vue
<ExerciseCard :seed="5" />
<ExerciseCard :seed="5" answers />
```

La segunda tarjeta termina con *R<sub>A</sub> = 8.75 kN, R<sub>B</sub> = 46.25 kN, M from −37.5 kNm to 7.66 kNm*. `formatQuantity` escribe la unidad y un signo menos tipográfico, igual que el gráfico. El punto decimal viene del formato `'en'`; con `new Intl.NumberFormat('es', …)` obtienes la coma decimal.

En el enunciado, `reaction-labels="names"` dibuja las reacciones como incógnitas: una flecha para cada dirección que impide un apoyo, en el sentido que se toma como positivo (hacia la derecha, hacia arriba, antihorario), con el nombre *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>* en lugar de un valor. Así, el signo de cada respuesta queda definido en el dibujo: una reacción que actúa en sentido contrario es negativa. La solución escribe los valores.

`reserve` compone desde el principio las capas de las dos vistas, así que al activar `answers`, por ejemplo con un botón *Mostrar la solución* para el estudio autónomo, el diagrama aparece con un fundido en su sitio ([Figuras que se completan paso a paso](/es/plot/structure-plot#figures-that-build-up)). `reserve-reaction-labels` hace lo mismo con las reacciones, de modo que la viga no se mueve mientras los nombres se convierten en valores: consulta [Reacciones como incógnitas](/es/plot/structure-plot#reactions-as-unknowns).

## Un examen impreso {#print-a-test}

Para un examen escrito, un script de Node, `print-test.ts`, escribe una página por estudiante y, después, las soluciones. `structureSvg` convierte cada modelo en texto SVG, así que el script no necesita Vue ni un navegador:

```ts [print-test.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const students = ['Ada', 'Ben', 'Cleo']
const exercises = students.map((_, i) => makeExercise(1000 + i)) // semillas 1000, 1001, …

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']
const task = 'Find the reactions and draw the bending moment diagram.'

const pages = [
  ...exercises.map((e, i) => `<h2>${students[i]}, exercise ${e.seed}</h2>
    <p>${e.statement} ${task}</p>${structureSvg(e.model, { layers: sheet, reactionLabels: 'names' })}`),
  ...exercises.map((e) => `<h2>Key, exercise ${e.seed}</h2>
    ${structureSvg(e.model, { layers: key })}`),
]

const style = `body { font: 15px/1.5 system-ui, sans-serif; max-width: 640px; margin: 2rem auto }
  section { break-after: page }`
writeFileSync('test.html', `<!doctype html><meta charset="utf-8"><title>Test</title>
  <style>${style}</style>${pages.map((page) => `<section>${page}</section>`).join('\n')}`)
```

```bash
node print-test.ts
```

Abre `test.html` en un navegador e imprímelo, o guárdalo como PDF: el ejercicio de cada estudiante y cada solución ocupan una página propia. La página de Ada y su solución:

![Ejercicio 1000: un vano de 6 m con un voladizo de 2 m, 10 kN/m en el vano y 30 kN en el extremo libre, las reacciones incógnita con los nombres A_x, A_z y B_z, y cotas encadenadas de 6 m y 2 m con 8 m en total; debajo, la solución, con reacciones de 20 y 70 y el momento flector de −60 sobre el apoyo a 20 en el vano](/screenshots/es/p2p-plot-exercise-sheet.webp){.shot-lg}

La capa `dimensions` acota cada vano y la longitud total, como en el enunciado de un ejercicio, y `reactionLabels: 'names'` da nombre a las incógnitas, cada flecha en el sentido en que su respuesta se toma como positiva. En la solución, las reacciones y los valores del diagrama son números sin unidad, en kN y kNm, como en la aplicación EduBeam: indícalo en el encabezado de la solución si tus estudiantes lo necesitan. Para una fotocopiadora en blanco y negro, pasa `colors` con todos los tonos en negro: consulta [Blanco y negro](/es/plot/theming#black-and-white).

## Figuras para LaTeX y Word {#figures-for-latex-and-word}

Si escribes los exámenes en LaTeX o Word, guarda las figuras como archivos y conserva tu propia plantilla. `figures.ts` escribe el enunciado y la solución de 30 semillas:

```ts [figures.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']

for (let seed = 1000; seed < 1030; seed++) {
  const { model } = makeExercise(seed)
  writeFileSync(`exercise-${seed}.svg`, structureSvg(model, { layers: sheet, reactionLabels: 'names' }))
  writeFileSync(`exercise-${seed}-key.svg`, structureSvg(model, { layers: key }))
}
```

Ejecútalo con `node figures.ts`: son 60 archivos para 30 estudiantes, cada uno un SVG simple con colores fijos, sin CSS y sin scripts.

- **Word** (2019 y Microsoft 365) inserta un SVG tal cual: *Insertar › Imágenes*.
- **LaTeX** incluye PDF en lugar de SVG. Convierte una vez con [CairoSVG](https://cairosvg.org) (`cairosvg exercise-1000.svg -o exercise-1000.pdf`) o con Inkscape, y después usa `\includegraphics[width=\linewidth]{exercise-1000.pdf}`. Si tienes Inkscape instalado, `\includesvg` del paquete `svg` hace la conversión por ti.

Una figura mide 640 unidades de ancho con texto de 13 unidades, así que al ancho de una columna de texto en A4, unos 16 cm, sus etiquetas quedan a 9 pt. Pon en `fontFamily` una fuente que use tu documento: todas las opciones están en [Un archivo SVG independiente](/es/plot/functions#a-standalone-svg-file).

## Adáptalo a tu curso {#make-it-your-own}

- **Más tipos de estructura.** Añade casos: un voladizo, una viga continua de dos vanos, un pórtico, una celosía. La demostración de arriba elige entre ocho tipos, desde una viga biapoyada hasta un pórtico triarticulado, una celosía Warren y un pórtico.
- **Ejercicios hiperestáticos.** El solver los resuelve igual de bien; solo se alarga la solución a mano.
- **Números redondos.** Elige las cargas y las longitudes de listas cortas, como arriba, para que la solución salga tan redonda como quieras. Recorre unos cientos de semillas y descarta las que tengan más decimales de los que deseas.
- **Evita los mecanismos.** Un generador que pueda colocar mal los apoyos debe resolver dentro de un `try` y descartar las semillas que lancen un error: consulta [Cuando el cálculo falla](/es/solver/solving#when-solving-fails).
- **Pide más.** Dibuja el cortante (`'V'`), la flecha (`'w'`, con los valores de [`getUnknowns`](/es/solver/results#displacements)) o el axil en una barra inclinada.
