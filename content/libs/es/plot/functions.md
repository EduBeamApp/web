---
title: Funciones
description: "Funciones, constantes y tipos de @edubeam/plot 0.2.0 además de los componentes: structureSvg, resultados exactos, unidades, líneas de viga y figuras propias."
order: 10
source: site
---

# Funciones

Todo lo que dibujan los componentes sale de funciones puras sin nada de Vue. Sirven para escribir una figura como archivo SVG, leer resultados exactos, preparar datos de antemano y construir tus propias figuras. Las importaciones con nombre mantienen el bundle pequeño: una página que solo importa `modelFromSolver` no recibe nada del código de los componentes.

Todos los valores están en SI salvo que se indique una unidad; las posiciones a lo largo de una barra son metros desde su nodo inicial.

## Un archivo SVG independiente {#a-standalone-svg-file}

Un gráfico dentro de una página toma sus colores de las propiedades personalizadas de CSS de la página, así que un `<svg>` copiado de ella no tiene ninguno. `structureSvg`, en cambio, escribe la figura como el texto de un archivo `.svg` independiente: colores fijos, sin hoja de estilos ni scripts, y compuesto con la misma rutina que `StructurePlot`. Word, PowerPoint, Inkscape, CairoSVG y las herramientas de LaTeX lo dibujan igual que la página.

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts' // () => un LinearStaticSolver resuelto, como en la página Diapositivas y apuntes

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![El pórtico como archivo SVG independiente, renderizado con CairoSVG: las cargas, las reacciones, 20 y 40 hacia arriba y 2,3 y 12,7 en horizontal, y el momento flector de −50,7 en C a 29,3 en el dintel](/screenshots/es/p2p-plot-frame-svg.webp){.shot-lg}

| Opción | Por defecto | Qué hace |
| --- | --- | --- |
| `layers` | barras, apoyos, cargas, reacciones y el resultado que elegiría `StructurePlot` | Qué dibujar |
| `width` | `640` | Ancho en px, las unidades de usuario del SVG |
| `height` | se adapta al dibujo | Una altura fija, px |
| `maxHeight` | max(320, 0.75 × width) | El límite superior de la altura automática |
| `padding` | `6` | El margen alrededor del dibujo, px |
| `fontSize` | `13`; con `compact`, `11.5` | El tamaño del texto, px |
| `fontFamily` | `Helvetica, Arial, sans-serif` | Una lista de fuentes que tenga el programa que abre el archivo |
| `colors` | `PRINT_COLORS` | Cualquiera de los tonos, como colores fijos |
| `background` | `true` | Pinta el fondo con `paper`; `false` lo deja transparente |
| `title` | ninguno | Se escribe como el `<title>` del SVG |
| `reserve`, `reserveLabelModes`, `reserveReactionLabels` | ninguno | Capas, modos de etiqueta y estilos de etiqueta de las reacciones para los que se reserva espacio además de los dibujados, para que coincidan los archivos de una figura por etapas: [Una figura por etapas en Beamer](/es/plot/slides#a-build-up-in-beamer) |
| `units`, `numberFormat`, `compact`, `diagramSize`, `deformedSize`, `momentOnTensionSide`, `resultLabelMode`, `reactionLabels` | como en `StructurePlot` | El mismo significado que las props del componente |

`PRINT_COLORS` son los colores de la aplicación EduBeam sobre blanco: tinta `#16182b`, esfuerzo axil `#2222ff`, esfuerzo cortante `#00af00`, momento flector `#ff2222`, cargas `#ff8700`, reacciones `#a020f0`. Cada etiqueta se escribe dos veces, con un halo del color de fondo debajo del texto, porque no todos los programas de SVG entienden `paint-order`; y un subíndice, como en los nombres de las reacciones *A<sub>x</sub>*, es un `tspan` con números simples, que Word e Inkscape leen bien. Sin `reserve`, cada archivo se ajusta a las capas que dibuja.

Para usar el archivo:

- **Word y PowerPoint** (2019 y Microsoft 365): *Insertar › Imágenes*.
- **LaTeX**: conviértelo a PDF con [CairoSVG](https://cairosvg.org) (`cairosvg frame.svg -o frame.pdf`) o con Inkscape, y después usa `\includegraphics`; o usa `\includesvg` del paquete `svg`, que llama a Inkscape por ti. Con 640 unidades de ancho, una figura ajustada a una columna de texto de 16 cm tiene etiquetas de 9 pt.
- **Una página web sin Vue**: pega el texto en el HTML. Consulta [Sin Vue](/es/plot/embedding#plain-html-from-node).

[Ejercicios y exámenes](/es/plot/exercises#figures-for-latex-and-word) escribe un archivo para el ejercicio y la solución de cada estudiante.

## A partir de un solver {#from-a-solver}

| Exportación | Firma | Hace |
| --- | --- | --- |
| `modelFromSolver` | `(solver: Solver, options?: FromSolverOptions) => PlotModel` | Convierte un solver en el [modelo de dibujo](/es/plot/model) de datos simples; incluye resultados solo si el caso de carga está resuelto |
| `FromSolverOptions` | tipo | `{ loadCase?: number }`, un índice en `solver.loadCases` |

## Polinomios por tramos {#piecewise-polynomials}

Los resultados de una barra son valores `Piecewise`: listas de tramos `{ x0, x1, c }`, explicadas en [Modelo de dibujo](/es/plot/model#piecewise-polynomials). `side` elige el valor justo antes (`'left'`) o justo después (`'right'`, por defecto) de un punto donde se unen dos tramos.

| Exportación | Firma | Hace |
| --- | --- | --- |
| `valueAt` | `(pw, x, side?) => number` | El valor en `x`; fuera de los extremos, el valor del extremo más cercano |
| `slopeAt` | `(pw, x, side?) => number` | La derivada, en unidades del valor por metro |
| `extremes` | `(pw) => { max: Extreme; min: Extreme } \| null` | Los valores mayor y menor, exactos, cada uno `{ x, value, side }` |
| `maxAbs` | `(pw) => number` | El mayor valor absoluto |
| `innerBreaks` | `(pw) => number[]` | Dónde se unen los tramos, sin los dos extremos |
| `isZero` | `(pw) => boolean` | Si el resultado es nulo en toda la barra |
| `evalPiece` | `(piece, x) => number` | El valor de un tramo |
| `evalPieceSlope` | `(piece, x) => number` | La pendiente de un tramo |
| `pieceExtrema` | `(piece) => number[]` | Dónde se anula la pendiente de un tramo, m |
| `pieceDegree` | `(piece) => number \| null` | El grado de un tramo; `null` si es nulo |
| `cleanPiecewise` | `(pw, tolerance) => Piecewise` | Elimina los coeficientes menores que `tolerance`, el error de redondeo de un modelo resuelto |
| `fitPiece` | `(f, x0, x1, degree) => Piece` | El polinomio de un grado dado que pasa por una función en `(x0, x1)` |
| `pieceToBeziers` | `(piece, segments?) => CubicSegment[]` | El tramo como curvas de Bézier cúbicas en (x, valor): exacto hasta grado tres; si no, `segments` curvas, 4 por defecto |

Tipos: `Piece`, `Piecewise`, `Side` (`'left' \| 'right'`), `Extreme`, `CubicSegment`.

## Unidades y números {#units-and-numbers}

| Exportación | Firma | Hace |
| --- | --- | --- |
| `KN_UNITS` | `Units` | kN, kNm, kN/m, m, mm, mrad, K: las unidades por defecto |
| `SI_UNITS` | `Units` | N, N·m, N/m, m, m, rad, K |
| `resolveUnits` | `(units?: Partial<Units>) => Units` | `KN_UNITS` con tus cambios |
| `DEFAULT_NUMBER_FORMAT` | `Intl.NumberFormat` | Inglés, como mucho un decimal |
| `formatNumber` | `(value, format?) => string` | El número con un signo menos tipográfico, nunca −0 |
| `formatQuantity` | `(si, unit, format?) => string` | `"36 kN"`: un valor SI en una unidad, separado por un espacio fino indivisible |

Un `Unit` es `{ symbol, scale }`, con valor mostrado = valor SI × `scale`. `Units` tiene uno para cada `UnitKind`: `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` y `temperature`.

```ts
import { formatQuantity, KN_UNITS } from '@edubeam/plot'

formatQuantity(-37500, KN_UNITS.moment) // "−37.5 kNm"
```

## Lectura de valores {#reading-values}

| Exportación | Firma | Hace |
| --- | --- | --- |
| `readMember` | `(results: MemberResults, x, snap?) => { x, u, values }` | N, V, M y w en `x`, cada uno `{ left, right }`, y el desplazamiento axial `u`; se ajusta a un salto a menos de `snap` m |
| `readoutAt` | `(model, transform, px, py, reach) => Readout \| null` | La barra más cercana a un punto de la pantalla, a menos de `reach` px, y sus resultados en ese punto |
| `readoutMarks` | `(model, transform, readout, shown, k, side) => ReadoutMark[]` | Dónde se dibujan los valores leídos: en el extremo de la ordenada de cada diagrama visible (en los dos lados de un salto) y en el punto de la deformada |
| `formatReadout` | `(readout, quantity, units, format?) => string` | `"M = 54 kNm"`, o `"V = 13.3 → −6.7 kN"` en un salto |

`k` son los px por unidad SI de cada resultado y `side`, el lado en el que se dibuja cada diagrama, obtenidos de `diagramScales` y `diagramSide`, más abajo. Tipos: `Readout`, `ReadoutMark` (`{ tone, from, to }` en px), `ReadoutQuantity` (`'N' \| 'V' \| 'M' \| 'w'`), `SidedValue`.

## Líneas de viga {#beam-lines}

Las piezas de [DiagramStack](/es/plot/diagram-stack), para construir tu propia figura apilada.

| Exportación | Firma | Hace |
| --- | --- | --- |
| `beamLine` | `(model, ids?) => BeamLine` | Las barras como una sola línea horizontal, de izquierda a derecha; lanza un error en cualquier otro caso |
| `lineDiagram` | `(model, line, row) => Piecewise` | Un resultado a lo largo de toda la línea, en la x de la línea |
| `rowRange` | `(pw) => [number, number]` | El rango al que se escala una fila, que siempre incluye el cero |
| `rowPeaks` | `(pw) => RowPeak[]` | Los extremos que merece la pena rotular en una fila |
| `rowBreaks` | `(pw) => number[]` | Dónde se interrumpe el resultado: apoyos, nudos y cargas puntuales |
| `rowOutline` | `(pw, sx, sy, close) => string` | Los datos del trazado SVG del contorno de una fila, dadas las funciones que pasan de m y de valor a px |
| `rowOrdinates` | `(pw, sx, sy, spacing) => string` | Los datos del trazado SVG de las ordenadas del rayado, separadas `spacing` px |
| `lineModel` | `(model, line, omit?) => PlotModel` | El modelo reducido a la línea, opcionalmente sin una carga |
| `pointLoadAt` | `(model, line, at) => PlotLoad \| undefined` | La fuerza puntual en la posición `at` de la línea |

Tipos: `BeamLine`, `LineMember`, `RowPeak`, `StackRow`.

La página [DiagramStack](/es/plot/diagram-stack#a-load-the-reader-can-drag) usa `beamLine`, `lineDiagram` y `rowRange` para mantener la escala de cada fila en todas las posiciones de una carga móvil.

## Geometría y apoyos {#geometry-and-supports}

| Exportación | Firma | Hace |
| --- | --- | --- |
| `nodeMap` | `(model) => ReadonlyMap<string, PlotNode>` | Los nodos por id |
| `memberFrame` | `(model, member, nodes?) => MemberFrame` | El inicio de una barra, su vector tangente unitario, el vector unitario de su eje z local y su longitud |
| `memberFrames` | `(model) => Map<string, MemberFrame>` | Lo mismo para todas las barras, por id |
| `pointAlong` | `(frame, at) => { x, z }` | El punto situado a `at` metros a lo largo de una barra |
| `supportKind` | `(fixity) => SupportKind` | `'fixed'`, `'pin'`, `'roller'`, `'slider'`, `'rotation'` o `'none'` |
| `supportPlacement` | `(model, node) => SupportPlacement` | El símbolo de un nodo y su giro en sentido horario, en grados |
| `supportGlyph` | `(kind) => readonly GlyphPart[]` | Las líneas del símbolo, en px |
| `glyphReach` | `(kind, rotation, x, z) => number` | Hasta dónde llega un símbolo girado en una dirección, px |

## Dibujo {#drawing}

El dibujo se hace en tres pasos. `buildStructureScene` convierte un modelo en elementos de escena: puntos del modelo con desplazamientos en píxeles de pantalla. `fitScene` busca la escala y el desplazamiento que los hacen caber en un recuadro. `resolveScene` los convierte en datos de trazado SVG, círculos y las etiquetas que tienen sitio. `layoutStructure` ejecuta los tres como lo hacen `StructurePlot` y `structureSvg`, así que una figura propia se compone igual que las suyas.

| Exportación | Firma | Hace |
| --- | --- | --- |
| `layoutStructure` | `(model, options, box, shown?, labelModes?) => StructureLayout` | La composición completa: ajusta con todas las etiquetas, quita las que se amontonan y vuelve a ajustar. Devuelve `{ fit, items, resolved }` |
| `structureSvg` | `(model, options?) => string` | Un archivo `.svg` independiente: [más arriba](#a-standalone-svg-file) |
| `buildStructureScene` | `(model, options: StructureSceneOptions) => SceneItem[]` | El dibujo de las capas elegidas a una escala, en px por metro |
| `fitScene` | `(items, box: FitBox) => Fit` | La escala y el desplazamiento para caber en un recuadro `{ width, height?, maxHeight?, padding, fontSize }` |
| `resolveScene` | `(items, transform, options: ResolveOptions) => ResolvedScene` | `{ paths, circles, texts }` en px, con las etiquetas que caben |
| `placeLabels` | `(items, transform, options: ResolveOptions) => Map<SceneText, SceneText>` | Qué etiquetas se conservan, y dónde |
| `alternativeResultGroups` | `(shown) => ReadonlySet<string>` | Las capas de resultados que se muestran de una en una, cuyas etiquetas ceden ante las demás pero no entre sí |
| `sceneBounds` | `(items, scale, fontSize) => Bounds` | La extensión de una escena, px |
| `project` | `(transform, anchor) => [number, number]` | Un punto de la escena en pantalla, px |
| `defaultResultLayer` | `(model) => ResultLayer \| null` | El resultado que muestra un gráfico cuando no se pide ninguno |
| `diagramScales` | `(model, options) => Record<ResultLayer, number>` | Los px por unidad SI de cada resultado |
| `diagramSide` | `(q, momentOnTensionSide) => 1 \| -1` | En qué lado de una barra se dibuja un valor positivo |
| `isBarStructure` | `(model, memberResults) => boolean` | Si N se escribe como números a lo largo de las barras (una celosía) en lugar de dibujarse como diagrama |
| `tipPlacements` | `(tip, out, mode, gaps?) => TextPlacement[]` | Las posiciones que puede ocupar un valor más allá del extremo de una ordenada |
| `PLOT_LAYERS` | `readonly PlotLayer[]` | Todas las capas, en orden de pintado |
| `RESULT_LAYERS` | `['N', 'V', 'M', 'w']` | Las capas de resultados |
| `HATCH_SPACING_PX` | `7` | La separación de las ordenadas de los diagramas, px |
| `DEFAULT_COLORS` | `PlotColors` | El color por defecto de cada tono, como CSS: [Temas y colores](/es/plot/theming) |
| `PRINT_COLORS` | `Record<Tone \| 'paper', string>` | Colores fijos para un archivo, los de la aplicación sobre blanco |
| `toneVars` | `(colors?) => Record<string, string>` | Las propiedades personalizadas que un gráfico define en su raíz |
| `PLOT_CSS` | `string` | Las reglas CSS incrustadas en cada gráfico |

`ResolveOptions` son `{ fontSize, viewport?, exclude?, alternativeGroups?, shields? }`: `shields` son los grupos cuyas líneas mantienen alejadas las etiquetas (los diagramas visibles); si se omite, todos. En `layoutStructure`, `options.layers` son las capas que se componen (todo lo que puede llegar a mostrarse, como `reserve`), `shown`, las visibles, y `labelModes`, los modos de etiqueta para los que se reserva espacio.

Tipos: `StructureSceneOptions`, `StructureLayout`, `StructureSvgOptions`, `SceneItem`, `SceneText`, `TextPlacement`, `ResolvedScene`, `ResolvedPath`, `ResolvedText`, `ResolvedCircle`, `ResolveOptions`, `Bounds`, `Anchor`, `Transform`, `Fit`, `FitBox`, `Tone`, `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `SupportKind`, `SupportPlacement`, `GlyphPart`, y los tipos del modelo de [Modelo de dibujo](/es/plot/model).
