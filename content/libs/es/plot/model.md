---
title: Modelo de dibujo
description: "El PlotModel, datos simples serializables en JSON que modelFromSolver obtiene de un modelo resuelto: polinomios por tramos, valores exactos y extremos."
order: 9
source: site
---

# Modelo de dibujo

Todo lo que dibuja @edubeam/plot sale de un `PlotModel`: datos simples que `modelFromSolver` extrae de un modelo resuelto con @edubeam/fem. Contiene la geometría, los apoyos, las cargas, las reacciones y los resultados de cada barra como polinomios exactos. Se puede serializar en JSON, así que se puede crear durante el build y entregar en lugar del solver, y es la forma más sencilla de obtener valores exactos y extremos de una estructura resuelta.

```ts
import { modelFromSolver } from '@edubeam/plot'

const model = modelFromSolver(solver) // o modelFromSolver(solver, { loadCase: 1 })
```

`results` solo existe cuando el caso de carga está resuelto. Sin él, los componentes dibujan solo el modelo y, con [`reactionLabels: 'names'`](/es/plot/structure-plot#reactions-as-unknowns), siguen dibujando las reacciones incógnita, así que un modelo sin resolver puede servir de enunciado de un ejercicio.

## El formato {#the-format}

Todo está en unidades SI (m, N, N·m, N/m, K, rad) y en los ejes del solver: x hacia la derecha, z hacia abajo, giros positivos en sentido antihorario en pantalla.

```ts
interface PlotModel {
  readonly nodes: readonly PlotNode[]
  readonly members: readonly PlotMember[]
  readonly loads: readonly PlotLoad[]
  readonly results?: PlotResults // solo para un caso de carga resuelto
}

interface PlotNode {
  readonly id: string
  readonly x: number
  readonly z: number
  readonly fixity: { readonly dx: boolean; readonly dz: boolean; readonly ry: boolean } // grados de libertad restringidos
  readonly angle: number // giro de los ejes de un apoyo girado, rad, horario en pantalla
}

interface PlotMember {
  readonly id: string
  readonly start: string // ids de los nodos
  readonly end: string
  readonly hinges: readonly [boolean, boolean]
}

interface PlotResults {
  readonly members: Readonly<Record<string, MemberResults>> // por id de barra
  readonly reactions: readonly PlotReaction[]
}

interface MemberResults {
  readonly N: Piecewise // esfuerzo axil, tracción positiva
  readonly V: Piecewise // esfuerzo cortante
  readonly M: Piecewise // momento flector, positivo con tracción en el lado +z local
  readonly u: Piecewise // desplazamiento según x local
  readonly w: Piecewise // desplazamiento según z local
}

interface PlotReaction {
  readonly node: string
  readonly dof: 'dx' | 'dz' | 'ry'
  readonly value: number // fuerza sobre la estructura según el eje del nodo, N (N·m para ry)
}
```

Una carga es de uno de siete tipos, que se distinguen por `kind`:

| `kind` | Campos | Es |
| --- | --- | --- |
| `'nodalForce'` | `node`, `fx`, `fz` | una fuerza en un nodo, componentes globales, N |
| `'nodalMoment'` | `node`, `my` | un momento en un nodo, N·m |
| `'distributed'` | `member`, `start`, `end`, `local` | una carga repartida de variación lineal, `{ fx, fz }` en cada extremo, N/m; uniforme si son iguales |
| `'pointForce'` | `member`, `at`, `fx`, `fz`, `local` | una fuerza a `at` metros del inicio de la barra |
| `'pointMoment'` | `member`, `at`, `my` | un momento puntual en una barra |
| `'temperature'` | `member`, `uniform`, `gradient` | K: la variación en el centro de gravedad, y la diferencia entre la cara inferior y la superior |
| `'prescribed'` | `node`, `dx?`, `dz?`, `ry?` | un desplazamiento impuesto del apoyo en los ejes del nodo, m y rad |

`local` vale `true` cuando las componentes van según los ejes locales x y z de la barra en lugar de los ejes globales.

## Polinomios por tramos {#piecewise-polynomials}

El resultado de una barra es un `Piecewise`: una lista de tramos, cada uno un polinomio sobre una parte de la barra. Empieza un tramo nuevo allí donde una carga o un momento puntual produce una discontinuidad en el resultado.

```ts
interface Piece {
  readonly x0: number // m desde el inicio de la barra
  readonly x1: number
  readonly c: readonly number[] // valor = Σ c[k]·sᵏ, con s = (x − x0)/(x1 − x0)
}
type Piecewise = readonly Piece[]
```

N, V y M son como mucho cúbicos, y la flecha como mucho de quinto grado, así que unos pocos coeficientes guardan exactamente la respuesta del solver. El cortante de una viga de 6 m con 20 kN a 2 m son dos tramos constantes:

```json
[{ "x0": 0, "x1": 2, "c": [13333.33] }, { "x0": 2, "x1": 6, "c": [-6666.67] }]
```

## Leer valores por tu cuenta {#reading-values-yourself}

Las funciones que dibujan los diagramas también los leen, de forma exacta y sin muestrear:

```ts
import { extremes, innerBreaks, modelFromSolver, valueAt } from '@edubeam/plot'

// biapoyada de 6 m, 20 kN a 2 m de A, IPE 200 rígido a cortante
const model = modelFromSolver(solver)
const { V, M, w } = model.results!.members['1']

innerBreaks(V) // [2]: los tramos se unen en la carga
valueAt(V, 2, 'left') // 13333.3 N, justo antes de la carga
valueAt(V, 2, 'right') // -6666.7 N, justo después
extremes(M) // máximo 26666.7 N·m en x = 2
extremes(w) // máximo 0.018973 m en x = 2.734
```

`extremes` devuelve `{ max, min }`, cada uno `{ x, value, side }`, o `null` para una lista vacía. La flecha máxima no está bajo la carga: está en $x = L - \sqrt{(L^2 - a^2)/3} = 2{,}734$ m y vale $P\,a\,(L^2 - a^2)^{3/2}/9\sqrt{3}\,EIL = 18{,}97$ mm, como da la fórmula de una carga no centrada.

Así encuentra el [generador de ejercicios](/es/plot/exercises#the-generator) los momentos extremos para su solución. La página [Funciones](/es/plot/functions#piecewise-polynomials) recoge el resto: pendientes, extremos dentro de un tramo, grados y curvas de Bézier.

## Entregarlo como JSON {#ship-it-as-json}

Basta con `JSON.stringify(model)`, y `JSON.parse` devuelve un modelo que se dibuja exactamente igual que con el solver. Un pórtico con una carga repartida y una carga puntual ocupa menos de 2 kB. Consulta [Integración](/es/plot/embedding#ship-the-drawing-not-the-solver). Un modelo también sirve de entrada a [`structureSvg`](/es/plot/functions#a-standalone-svg-file), que lo escribe como archivo SVG.
