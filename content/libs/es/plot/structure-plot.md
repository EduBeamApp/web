---
title: StructurePlot
description: "Vigas, pórticos y celosías planas con StructurePlot: capas, figuras que se completan, reacciones como incógnitas, miniaturas, tamaños, unidades y lectura de valores."
order: 2
group: Componentes
source: site
---

# StructurePlot

`StructurePlot` dibuja una estructura completa, ajustada al ancho de su contenedor: barras, rótulas, apoyos, cargas, reacciones, los diagramas de N, V y M y la deformada. Dale un solver, o el [modelo de datos simple](/es/plot/model) que se obtiene de él, y dile qué dibujar.

```vue
<StructurePlot :solver="solver" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

Todas las props, con su tipo y su valor por defecto, están en la [API de componentes](/es/plot/components#structureplot).

Esta figura es un `StructurePlot` con las capas `nodeLabels` y `dimensions` activadas, la prop `hover` y el formato numérico de este sitio (cuatro cifras significativas): cambia de resultado y pasa el puntero por encima de una barra para leer sus valores.

::model-figure{caption="Un pórtico: pies articulados, 10 kN/m en el dintel, 15 kN en B"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: pin, D: pin }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
  - { node: B, fx: 15 }
results: [M, V, N, w]
show: [nodeLabels, dimensions]
---
::

## Capas {#layers}

Un gráfico se compone de capas, que se pintan siempre en el mismo orden, sea cual sea el orden en que las enumeres:

| Capa | Dibuja |
| --- | --- |
| `members` | las barras, con las rótulas como pequeños círculos |
| `supports` | un símbolo para cada apoyo, girado si el apoyo es inclinado |
| `loads` | las cargas nodales y de barra, las cargas térmicas y los asientos, con sus valores |
| `reactions` | las reacciones, como flechas rectas y curvas con sus valores; o, con `reactionLabels: 'names'`, como las [incógnitas con nombre](#reactions-as-unknowns) de un ejercicio |
| `nodes` | cada nodo como un pequeño círculo |
| `nodeLabels` | los nombres de los nodos |
| `dimensions` | cotas encadenadas, como en el enunciado de un ejercicio: cada tramo entre nodos y cargas puntuales debajo de la estructura, cada planta a su derecha y la cota total en una segunda línea |
| `N`, `V`, `M` | los diagramas de axiles, cortantes y momentos flectores |
| `w` | la deformada |

Si omites `layers`, el gráfico dibuja barras, apoyos, cargas y reacciones, más un resultado elegido según la estructura: `M` para vigas y pórticos, `N` para una celosía y `w` cuando ninguna barra transmite esfuerzos, como en una viga que puede dilatarse libremente bajo una carga térmica.

Los diagramas siguen las convenciones de la aplicación EduBeam: N y V se dibujan con un rayado perpendicular a la barra, y M se dibuja en el lado traccionado, de modo que un momento positivo (tracción abajo) queda debajo de la viga. Con `:moment-on-tension-side="false"`, M se dibuja en el lado comprimido. Una celosía muestra el axil de cada barra una sola vez, a lo largo de la barra y con un color según su signo.

## Figuras que se completan paso a paso {#figures-that-build-up}

`reserve` enumera las capas para las que se reserva espacio mientras están ocultas. El gráfico compone desde el principio todas las capas reservadas, así que cuando activas una, aparece con un fundido en su sitio y nada más se mueve:

```vue
<script setup lang="ts">
import type { PlotLayer } from '@edubeam/plot'

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'],
  ['nodeLabels', 'members', 'supports'],
  ['nodeLabels', 'members', 'supports', 'loads'],
  ['members', 'supports', 'loads', 'reactions'],
  ['members', 'supports', 'reactions', 'M'],
]
const all = [...new Set(stages.flat())]
// `frame` es un solver resuelto y `step`, la etapa actual: el componente completo está en Diapositivas y apuntes
</script>

<template>
  <StructurePlot :solver="frame" :layers="stages[step]" :reserve="all" />
</template>
```

Con `animate`, activado por defecto, las capas aparecen con un fundido y las barras se dibujan de un extremo a otro. Con `prefers-reduced-motion` no se anima nada. En [Diapositivas y apuntes](/es/plot/slides) esta figura forma parte de una presentación.

## Valores de los diagramas {#diagram-values}

Cada valor se escribe justo más allá del extremo de su ordenada, como en los diagramas de un libro de texto: cada extremo de barra con valor no nulo, los máximos y mínimos intermedios, los dos valores de cada salto y un único valor en cada nudo rígido. Los valores son números sin unidad, en la unidad de visualización (kN para N y V, kNm para M), y lo mismo las reacciones, como en la aplicación EduBeam; la unidad solo se escribe en los datos: cargas, asientos y variaciones de temperatura. Una etiqueta que se solaparía con otra, con una barra o con una flecha prueba otras posiciones en el mismo extremo, y si no hay ninguna libre, se omite, de modo que nunca quedan dos números uno encima de otro. Los valores de las cargas y las reacciones se colocan primero, así que los números de un diagrama nunca los desplazan. Los axiles de las barras de una celosía nunca se omiten: se deslizan a lo largo de la barra, cambian de lado y, como último recurso, se hacen más pequeños.

Con `result-label-mode="axis"`, los valores se giran en la dirección de su ordenada, como los escribe la aplicación EduBeam. Si el lector puede cambiar entre ambos modos, añade `:reserve-label-modes="['horizontal', 'axis']"` para que el dibujo no se mueva al cambiar.

## Reacciones como incógnitas {#reactions-as-unknowns}

El enunciado de un ejercicio pide las reacciones, así que debe mostrarlas sin sus valores. `reaction-labels="names"` dibuja una flecha para cada dirección que impide un apoyo, en el sentido que se toma como positivo: según el eje x del nodo (hacia la derecha, salvo que el apoyo esté girado), hacia arriba y, para un momento de empotramiento, en sentido antihorario. Cada una lleva el nombre de su nodo, *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>*, en cursiva y con un subíndice de verdad. Así, el signo de cada respuesta queda definido en el dibujo: una reacción que actúa en sentido contrario es negativa.

```vue
<StructurePlot
  :model="model"
  :layers="['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']"
  reaction-labels="names"
/>
```

![Arriba, una viga empotrada y apoyada como enunciado de un ejercicio: empotramiento en A, apoyo móvil en B, 40 kN en el centro del vano, cotas encadenadas de 3 m y 3 m con 6 m en total, y las reacciones dibujadas como flechas con nombre A_x, A_z, M_A y B_z. Abajo, la misma viga con las etiquetas de reacción por defecto: 27,5 y 12,5 hacia arriba, un momento de empotramiento de 45 y el momento flector de −45 en el empotramiento a 37,5 bajo la carga](/screenshots/es/p4-plot-reaction-names.webp){.shot-lg}

Los nombres no necesitan resultados, así que un modelo sin resolver también se puede dibujar como enunciado. Para la solución, deja `reactionLabels` en `'values'`. Los nombres y los valores no ocupan el mismo espacio (una reacción horizontal nula tiene nombre en el enunciado pero ninguna flecha en la solución), así que un gráfico que cambia entre ambos debe reservar espacio para los dos con `:reserve-reaction-labels="['names', 'values']"`: el dibujo se queda donde está y solo cambian las etiquetas. La tarjeta de ejercicio de [Ejercicios y exámenes](/es/plot/exercises#the-exercise-in-a-page) cambia entre ambos con una prop `answers`, igual que hacen los [Problemas para practicar](/es/practice) de este sitio cuando el estudiante pide la solución.

## Miniaturas {#thumbnails}

`compact` dibuja para recuadros de unos 400 × 200 px: símbolos más pequeños y texto de 11,5 px, como mucho dos valores por barra, y las cargas repartidas rotuladas solo con su valor, sin `q =`.

```vue
<StructurePlot v-for="t in tiles" :key="t.title" :solver="t.solver" compact :height="200" :title="t.title" />
```

La [galería de ejemplos](/es/examples/) de este sitio está dibujada así.

## Tamaño {#size}

El gráfico mide su contenedor y compone el dibujo a ese ancho, en píxeles reales. Sin `height`, su altura se adapta al dibujo, hasta `maxHeight`, que por defecto es $\max(320;\ 0{,}75 \times \text{ancho})$. Mientras no puede medir, por ejemplo en el servidor, usa `width`, 640 px por defecto.

| Prop | Por defecto | Define |
| --- | --- | --- |
| `width` | 640; con `compact`, 400 | el ancho de composición hasta que se mide el contenedor, px |
| `height` | se adapta al dibujo | una altura fija, px |
| `maxHeight` | $\max(320;\ 0{,}75w)$; con `compact`, sin límite | el límite superior de la altura automática |
| `padding` | 6 | el margen alrededor del dibujo, px |
| `fontSize` | 13; con `compact`, 11.5 | el tamaño del texto, px |
| `diagramSize` | 48; con `compact`, 26 | la longitud de la ordenada más grande, px |
| `deformedSize` | 30; con `compact`, 18 | el mayor desplazamiento de la deformada, px |

### Varios gráficos a la misma escala {#several-plots-at-one-scale}

Cada gráfico escala sus diagramas según su propio valor máximo, así que un momento de 20 kNm se ve tan grande como uno de 80 kNm. Para comparar, fija la escala en píxeles por unidad SI con `diagramScale`:

```vue
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams' // de Primeros pasos: (luz en m, q en kN/m) => un solver resuelto

const spans = [4, 6, 8].map((L) => ({ L, solver: simpleBeam(L, 10) }))
// 0,5 px por kNm (0,5e-3 px por N·m): los 80 kNm del vano de 8 m se dibujan con una ordenada de 40 px, los 20 kNm del de 4 m con una de 10 px
const scale = { M: 0.5e-3 }
</script>

<template>
  <figure v-for="s in spans" :key="s.L">
    <StructurePlot :solver="s.solver" :layers="['members', 'supports', 'M']" :diagram-scale="scale" />
    <figcaption>L = {{ s.L }} m</figcaption>
  </figure>
</template>
```

## Unidades y números {#units-and-numbers}

Internamente, los valores están en SI y solo se convierten para mostrarlos: por defecto en kN, kNm, kN/m, m, mm, mrad y K. Puedes sustituir cualquier unidad por un símbolo y una escala, con valor mostrado = valor SI × escala:

```vue
<StructurePlot :solver="solver" :units="{ force: { symbol: 'N', scale: 1 } }" />
```

Los números pasan por un `Intl.NumberFormat`, por defecto en inglés y con un decimal como máximo. Pasa el tuyo para que coincida con el idioma de la página:

```vue
<StructurePlot :solver="solver" :number-format="new Intl.NumberFormat('cs', { maximumFractionDigits: 2 })" />
```

Para una página en español, usa `new Intl.NumberFormat('es', …)` y obtendrás la coma decimal. Los signos menos son signos menos tipográficos (−), y un valor que se redondea a cero nunca aparece como −0. Los nombres de las unidades son `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` y `temperature`; `KN_UNITS` y `SI_UNITS` se exportan como punto de partida.

## Lectura de valores {#reading-values}

Con `hover`, el gráfico lee los resultados visibles en el punto de la barra que está bajo el puntero. Marca cada valor donde está dibujado, con un punto en el extremo de la ordenada de cada diagrama visible (los dos extremos en un salto) o sobre la deformada, y los muestra en un recuadro, como `M = 54 kNm`, o con los dos lados de un salto, `V = 13.3 → −6.7 kN`. El puntero detecta una barra desde cualquier punto de su diagrama, no solo sobre la propia barra. El gráfico también emite los valores como datos:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { StructurePlot, type Readout } from '@edubeam/plot'
import { portalFrame } from './frame' // de Diapositivas y apuntes: () => un solver resuelto

const frame = portalFrame()
const reading = ref<Readout | null>(null)
</script>

<template>
  <StructurePlot :solver="frame" :layers="['members', 'supports', 'M']" hover @readout="reading = $event" />
  <p v-if="reading">
    Member {{ reading.member }}, {{ reading.x.toFixed(2) }} m from its start:
    M = {{ (reading.values.M.left / 1e3).toFixed(1) }} kNm
  </p>
</template>
```

Una lectura es `{ member, x, px, py, values, u }`: la barra, la posición a lo largo de ella en metros, el punto en pantalla en px, `{ left, right }` para cada uno de `N`, `V`, `M` y `w` en unidades SI, y el desplazamiento axial `u`. Vale `null` cuando el puntero sale. Las figuras interactivas de este sitio usan `hover`: pasa el puntero por encima de una.

Sin `hover`, el gráfico no registra ningún detector de eventos, así que la página se desplaza sobre él y un toque en un gráfico dentro de un enlace sigue el enlace. Con `hover`, el gráfico solo escucha eventos de puntero, y en las pantallas táctiles siguen funcionando el desplazamiento vertical y el zoom con dos dedos.

## Accesibilidad {#accessibility}

Cada gráfico es un `<svg role="img">` cuyo nombre es su prop `title` o, sin ella, una descripción de lo que muestra, como «Structure with its loads, reactions, bending moment». Las capas reservadas ocultas llevan `aria-hidden`.
