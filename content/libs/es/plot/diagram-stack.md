---
title: DiagramStack
description: "Dibuja con DiagramStack una viga sobre sus diagramas V(x), M(x) y w(x) en un mismo eje x, lee todas las filas con un cursor y deja arrastrar una carga puntual."
order: 3
source: site
---

# DiagramStack

`DiagramStack` dibuja la figura de cualquier libro de estática: una viga recta con sus apoyos, cargas y reacciones y, debajo, sobre el mismo eje x, su esfuerzo cortante V(x), su momento flector M(x) y su flecha w(x). Un cursor lee todas las filas a la vez, y opcionalmente se puede arrastrar una carga puntual a lo largo de la viga.

```vue
<DiagramStack :solver="solver" />
```

![DiagramStack: una viga biapoyada de 6 m con una carga de 20 kN que el lector puede arrastrar, aquí a 4,3 m del apoyo izquierdo; reacciones de 5,7 kN y 14,3 kN, el cortante salta de 5,7 kN a −14,3 kN bajo la carga, el momento flector alcanza allí su máximo de 24,4 kNm, y la flecha tiene su valor máximo de 17 mm](/screenshots/es/p2p-plot-diagram-stack.webp){.shot-lg}

Las barras deben formar una sola línea horizontal, dibujada de izquierda a derecha. Cualquier otra cosa, una línea inclinada o quebrada o una barra dibujada de derecha a izquierda, se rechaza con un error en lugar de dibujarse mal, porque el eje x de la figura es el de la viga. Todas las props están en la [API de componentes](/es/plot/components#diagramstack).

## Filas {#rows}

| Prop | Por defecto | Define |
| --- | --- | --- |
| `rows` | `['V', 'M', 'w']` | los diagramas, de arriba abajo; también está disponible `'N'` |
| `loadRow` | `true` | la viga con sus apoyos, cargas y reacciones encima de las filas |
| `members` | todas las barras | las barras de la línea de la viga, cuando el modelo tiene otras |
| `rowHeights` | N 100, V 116, M 128, w 76 px | la altura de las filas; algo menor por debajo de 560 px de ancho |
| `maxHeight` | ninguno | las filas se reducen, como mucho al 60 %, para que la figura quepa; el texto conserva su tamaño |
| `ranges` | el propio de cada fila | rangos de valores fijos para cada fila, en unidades SI |

V y N se dibujan positivos hacia arriba, y M y w positivos hacia abajo, como en la mayoría de los libros de texto: un momento positivo (tracción abajo) y una flecha hacia abajo quedan por debajo del eje. Cada fila rotula sus valores extremos.

## El cursor de lectura {#the-reading-cursor}

`hover` está activado por defecto. Al mover el puntero sobre la figura aparece un cursor vertical que atraviesa todas las filas, con el valor de cada fila en un recuadro. A menos de 8 px de un salto, en una carga puntual o en un apoyo, el cursor se ajusta a él, y V muestra los dos lados, como `5.7 → −14.3 kN` bajo la carga de la figura anterior. Los valores también se emiten:

```vue
<DiagramStack :solver="solver" @readout="(r) => (reading = r)" />
```

Una lectura es `{ x, values }`: `x` en metros a lo largo de la viga y `{ left, right }` para cada fila en unidades SI; vale `null` cuando el puntero sale.

## Una carga que el lector puede arrastrar {#a-load-the-reader-can-drag}

Pasa a `v-model:load-at` la posición de una carga puntual y la carga tendrá un tirador: el lector la arrastra con el puntero, o la selecciona con el teclado y la mueve con las flechas. El componente solo comunica la nueva posición. Resuelve de nuevo la viga con la carga en ese punto y devuelve el nuevo solver, como hace `MovingLoad.vue`:

```vue [MovingLoad.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { beamLine, DiagramStack, lineDiagram, modelFromSolver, rowRange, type StackRow } from '@edubeam/plot'

const L = 6 // m
const P = 20e3 // N

/** La viga con la carga puntual a `at` metros de A, ya resuelta. */
const solveWithLoadAt = (at: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamConcentratedLoad(1, [0, P, 0, at], true)
  solver.solve()
  return solver
}

/** El rango de cada fila para todas las posiciones de la carga, así los diagramas crecen y decrecen en vez de reescalarse. */
const rows: StackRow[] = ['V', 'M', 'w']
const envelope = (() => {
  const ranges: Partial<Record<StackRow, [number, number]>> = {}
  for (let at = 0.25; at < L; at += 0.25) {
    const model = modelFromSolver(solveWithLoadAt(at))
    const line = beamLine(model)
    for (const row of rows) {
      const [lo, hi] = rowRange(lineDiagram(model, line, row))
      const [min, max] = ranges[row] ?? [0, 0]
      ranges[row] = [Math.min(min, lo), Math.max(max, hi)]
    }
  }
  return ranges
})()

const at = ref(2)
const solver = computed(() => solveWithLoadAt(at.value))
</script>

<template>
  <DiagramStack v-model:load-at="at" :solver="solver" :rows="rows" :ranges="envelope" load-label="P = 20 kN" />
  <p>The load is {{ at.toFixed(2) }} m from A.</p>
</template>
```

Con la carga a 4,3 m, la figura muestra las reacciones de 5,7 kN y 14,3 kN, el salto del cortante de 5,7 a −14,3 kN bajo la carga y, en ese punto, $M = 5{,}67 \cdot 4{,}3 = 24{,}4$ kNm. Sin `ranges`, cada fila se reescalaría a sus propios extremos al moverse la carga, y daría la impresión de que los diagramas no cambian en absoluto.

| Prop | Por defecto | Define |
| --- | --- | --- |
| `loadAt` | ninguno | la posición de la carga, en m desde el inicio de la línea; con `v-model:load-at` |
| `loadLabel` | `P = …` | el texto junto al tirador |
| `loadStep` | 0.05 | el paso, en m, al que se redondea el arrastre; las flechas del teclado mueven la carga en ese paso |

El tirador es un elemento `role="slider"` que recibe el foco y comunica su rango y su posición a los lectores de pantalla. Las flechas lo mueven en pasos de `loadStep`, Re Pág y Av Pág en pasos de 1 m, e Inicio y Fin lo llevan a los extremos de la viga. En una pantalla táctil se puede arrastrar con el dedo, y el desplazamiento vertical sigue funcionando sobre la figura.

El tirador sustituye a la fuerza puntual que el modelo resuelto tiene en `loadAt`: esa fuerza se dibuja como el tirador, rotulada con su valor salvo que indiques `loadLabel`. Pon la carga en el modelo en la misma posición, como hace `solveWithLoadAt`.

## Tamaño y renderizado en el servidor {#size-and-server-rendering}

La figura mide su contenedor y compone el dibujo a ese ancho, con un mínimo de 320 px. Mientras no puede medir, usa `width`, 720 px por defecto. El texto mide 12,5 px (`fontSize`) y nunca se reduce con la figura.
