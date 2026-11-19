---
title: API de componentes
description: "Todas las props y eventos de StructurePlot y DiagramStack en @edubeam/plot 0.2.0, con tipos y valores por defecto, el plugin EduBeamPlot y los tipos exportados."
order: 8
group: Referencia
source: site
---

# API de componentes

Las props y los eventos de los dos componentes, tal como los declara @edubeam/plot 0.2.0. Ninguno tiene slots. Los valores en unidades SI se indican como tales; los tamaños son píxeles CSS.

## StructurePlot {#structureplot}

```ts
import { StructurePlot } from '@edubeam/plot'
```

Dibuja una estructura plana y sus resultados. Guía: [StructurePlot](/es/plot/structure-plot).

### Props {#props}

| Prop | Tipo | Por defecto | Descripción |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Un solver de @edubeam/fem. Los resultados se dibujan cuando su caso de carga está resuelto. |
| `model` | `PlotModel` | – | O los datos simples que genera [`modelFromSolver`](/es/plot/model). Tiene prioridad sobre `solver`. |
| `loadCase` | `number` | `0` | Índice en `solver.loadCases` |
| `revision` | `number` | `0` | Cámbiala para volver a dibujar un solver modificado directamente |
| `layers` | `readonly PlotLayer[]` | barras, apoyos, cargas, reacciones y un resultado | Qué dibujar: `'nodes'`, `'nodeLabels'`, `'dimensions'`, `'members'`, `'supports'`, `'loads'`, `'reactions'`, `'N'`, `'V'`, `'M'`, `'w'` |
| `reserve` | `readonly PlotLayer[]` | `layers` | Capas para las que se reserva espacio mientras están ocultas |
| `compact` | `boolean` | `false` | Dibujo en miniatura: símbolos más pequeños, como mucho dos valores por barra |
| `units` | `Partial<Units>` | `KN_UNITS` | Unidades de visualización |
| `numberFormat` | `Intl.NumberFormat` | inglés, como mucho 1 decimal | Da formato a todos los números |
| `colors` | `Partial<PlotColors>` | – | Colores propios por tono: [Temas y colores](/es/plot/theming#the-colors-prop) |
| `width` | `number` | `640`; con `compact`, `400` | Ancho antes de medir el contenedor, como en el servidor |
| `height` | `number` | – | Altura fija. Sin ella, la altura se adapta al dibujo. |
| `maxHeight` | `number` | `max(320, 0.75 × width)`; con `compact`, sin límite | Límite superior de la altura automática |
| `padding` | `number` | `6` | Margen alrededor del dibujo |
| `fontSize` | `number` | `13`; con `compact`, `11.5` | Tamaño del texto |
| `diagramSize` | `number` | `48`; con `compact`, `26` | Longitud de la mayor ordenada de un diagrama |
| `deformedSize` | `number` | `30`; con `compact`, `18` | Mayor desplazamiento en la deformada |
| `diagramScale` | `Partial<Record<ResultLayer, number>>` | – | Escala fija en px por unidad SI para un resultado; sustituye a `diagramSize` o `deformedSize` |
| `momentOnTensionSide` | `boolean` | `true` | M en el lado traccionado; `false` para el lado comprimido |
| `resultLabelMode` | `'horizontal' \| 'axis'` | `'horizontal'` | Valores en horizontal, o girados en la dirección de su ordenada |
| `reactionLabels` | `'values' \| 'names'` | `'values'` | Reacciones tal como actúan, con su valor; o, para un ejercicio, cada dirección impedida con su nombre (*A<sub>x</sub>*, *M<sub>A</sub>*) y apuntando en el sentido que se toma como positivo. Los nombres no necesitan resultados: [Reacciones como incógnitas](/es/plot/structure-plot#reactions-as-unknowns) |
| `reserveLabelModes` | `readonly ResultLabelMode[]` | – | Modos de etiqueta para los que se reserva espacio además del actual |
| `reserveReactionLabels` | `readonly ReactionLabels[]` | – | Estilos de etiqueta de las reacciones para los que se reserva espacio además de `reactionLabels`, para que el dibujo de un ejercicio no se mueva cuando se convierte en su solución |
| `animate` | `boolean` | `true` | Las capas aparecen con un fundido y las barras se dibujan. Siempre desactivado con `prefers-reduced-motion`. |
| `hover` | `boolean` | `false` | Lee los valores bajo el puntero y los marca en el extremo de la ordenada de cada diagrama. Desactivado, el gráfico no recibe ninguna entrada del puntero. |
| `title` | `string` | una descripción de lo que se muestra | Nombre accesible de la figura |

Sin `layers`, el resultado es `M` para vigas y pórticos, `N` para una celosía y `w` cuando ninguna barra transmite esfuerzos (`defaultResultLayer`).

### Eventos {#events}

| Evento | Datos | Cuándo |
| --- | --- | --- |
| `readout` | `Readout \| null` | Con `hover`: el punto de la barra bajo el puntero y sus resultados; `null` cuando el puntero sale |

```ts
interface Readout {
  readonly member: string
  readonly x: number // m desde el nodo inicial de la barra
  readonly px: number // el punto en pantalla, px
  readonly py: number
  readonly values: Readonly<Record<'N' | 'V' | 'M' | 'w', SidedValue>> // unidades SI
  readonly u: number // desplazamiento según el eje x local de la barra, m
}
interface SidedValue {
  readonly left: number
  readonly right: number // igual a left donde el resultado es continuo
}
```

## DiagramStack {#diagramstack}

```ts
import { DiagramStack } from '@edubeam/plot'
```

Dibuja una viga recta sobre sus diagramas en un mismo eje x. Las barras deben formar una sola línea horizontal, dibujada de izquierda a derecha; cualquier otra cosa lanza un error. Guía: [DiagramStack](/es/plot/diagram-stack).

### Props {#props-1}

| Prop | Tipo | Por defecto | Descripción |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | La viga resuelta |
| `model` | `PlotModel` | – | O los datos simples de `modelFromSolver`; tiene prioridad |
| `loadCase` | `number` | `0` | Índice en `solver.loadCases` |
| `revision` | `number` | `0` | Cámbiala para volver a dibujar un solver modificado directamente |
| `members` | `readonly string[]` | todas las barras | Las barras de la línea de la viga |
| `rows` | `readonly StackRow[]` | `['V', 'M', 'w']` | Filas de diagramas, de arriba abajo, entre `'N'`, `'V'`, `'M'`, `'w'` |
| `loadRow` | `boolean` | `true` | La viga con sus apoyos, cargas y reacciones encima de las filas |
| `ranges` | `Partial<Record<StackRow, readonly [number, number]>>` | el propio de cada fila | Rango de valores de cada fila, unidades SI |
| `rowHeights` | `Partial<Record<StackRow, number>>` | N 100, V 116, M 128, w 76; por debajo de 560 px de ancho 88, 96, 104, 64 | Altura de las filas antes de que `maxHeight` las escale |
| `maxHeight` | `number` | – | Las filas se reducen, como mucho al 60 %, para que la figura quepa. El texto conserva su tamaño. |
| `units` | `Partial<Units>` | `KN_UNITS` | Unidades de visualización |
| `numberFormat` | `Intl.NumberFormat` | inglés, como mucho 1 decimal | Da formato a todos los números |
| `colors` | `Partial<PlotColors>` | – | Colores propios |
| `width` | `number` | `720` | Ancho antes de medir el contenedor; se usa como mínimo 320 |
| `fontSize` | `number` | `12.5` | Tamaño del texto |
| `hover` | `boolean` | `true` | El cursor de lectura. Desactivado, la figura no recibe ninguna entrada del puntero. |
| `loadAt` | `number` | – | Posición (m a lo largo de la línea) de una carga puntual que el lector puede arrastrar; se usa con `v-model:load-at` |
| `loadLabel` | `string` | `P = …` con el valor de la carga | Texto junto a la carga que se arrastra |
| `loadStep` | `number` | `0.05` | Paso en m al que se redondea el arrastre; las flechas del teclado mueven la carga en ese paso |
| `title` | `string` | una descripción de las filas | Nombre accesible de la figura |

### Eventos {#events-1}

| Evento | Datos | Cuándo |
| --- | --- | --- |
| `update:loadAt` | `number` | El lector ha movido la carga: su nueva posición, en m. Alimenta `v-model:load-at`. |
| `readout` | `StackReadout \| null` | Los valores del cursor en todas las filas; `null` cuando el puntero sale |

```ts
interface StackReadout {
  readonly x: number // m a lo largo de la línea de la viga
  readonly values: Partial<Record<'N' | 'V' | 'M' | 'w', { readonly left: number; readonly right: number }>> // SI
}
```

## El plugin {#the-plugin}

```ts
import { EduBeamPlot } from '@edubeam/plot'

app.use(EduBeamPlot) // registra <StructurePlot> y <DiagramStack> globalmente
```

Es opcional: importar los componentes por su nombre resulta más ligero, y un bundler elimina el plugin de un build que no lo usa.

## Tipos {#types}

Para envolver los componentes con tipos, el paquete exporta sus props y sus eventos:

```ts
import type { PlotLayer, StructurePlotProps } from '@edubeam/plot'

const figure: StructurePlotProps = { layers: ['members', 'supports', 'M'] satisfies PlotLayer[], compact: true }
```

| Tipo | Contiene |
| --- | --- |
| `StructurePlotProps`, `StructurePlotEmits` | Las props y los eventos de `StructurePlot` |
| `DiagramStackProps`, `DiagramStackEmits` | Las props y los eventos de `DiagramStack` |
| `Readout`, `ReadoutQuantity`, `SidedValue`, `StackReadout` | Los datos de los eventos |
| `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `StackRow` | Los nombres de capas, resultados, modos de etiqueta, estilos de etiqueta de las reacciones y filas |
| `Units`, `Unit`, `UnitKind` | Unidades de visualización: `{ symbol, scale }` para cada magnitud |
| `PlotColors` | Colores por tono |
| `PlotModel` | El modelo de datos simple: [Modelo de dibujo](/es/plot/model) |

Las demás exportaciones, entre ellas `structureSvg` para archivos SVG y las funciones que hay detrás del dibujo, están en [Funciones](/es/plot/functions).
