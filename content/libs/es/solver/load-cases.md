---
title: Casos de carga
description: "Resuelve a la vez varios casos de carga de un modelo de @edubeam/fem y combina sus resultados por superposición en combinaciones de cargas y envolventes."
order: 8
source: site
---

# Casos de carga {#load-cases}

Un caso de carga es un conjunto de cargas que se resuelven juntas. El solver empieza con uno; añade más, y un único `solve()` los resuelve todos con una sola matriz de rigidez. El análisis es lineal, así que los resultados de distintos casos pueden multiplicarse por un factor y sumarse: en eso consiste una combinación de cargas.

## Añadir un caso de carga {#add-a-load-case}

```ts [load-cases.ts]
import { DofID, LinearStaticSolver, LoadCase } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const dead = solver.loadCases[0] // el caso con el que empieza todo solver
const live = new LoadCase('live', domain)
solver.loadCases.push(live)

dead.createBeamElementUniformEdgeLoad(1, [0, 10e3], true) // 10 kN/m
live.createBeamConcentratedLoad(1, [0, 20e3, 0, 3], true) // 20 kN en el centro del vano
solver.solve() // resuelve todos los casos de carga

console.log(beam.computeBendingMomentAt(dead, 3)) // qL²/8
console.log(beam.computeBendingMomentAt(live, 3)) // PL/4
```

```text [Salida]
45000
30000
```

Cada método de resultados recibe el caso de carga que debe leer. El primer caso tiene la etiqueta `'DefaultLC'`; las etiquetas son solo nombres, y el solver distingue los casos por el objeto.

## Combinarlos {#combine-them}

Multiplica el resultado de cada caso por su coeficiente y suma. Para el estado límite último del Eurocódigo, $1{,}35\,G + 1{,}5\,Q$, en el centro del vano:

```ts
1.35 * beam.computeBendingMomentAt(dead, 3) +
  1.5 * beam.computeBendingMomentAt(live, 3) // 105750 N·m
```

Lo mismo vale para las reacciones, los desplazamientos y cualquier otro resultado. A lo largo de toda una barra, combina punto a punto: los arrays de `computeBendingMoment(lc, n)` usan las mismas `x` en todos los casos.

```ts
const n = 60
const g = beam.computeBendingMoment(dead, n).M
const q = beam.computeBendingMoment(live, n).M
const uls = g.map((m, i) => 1.35 * m + 1.5 * q[i])
Math.max(...uls) // 105750 N·m, en x = 3
```

Una envolvente, el valor máximo y el mínimo de varias combinaciones, es un `Math.max` y un `Math.min` sobre esos arrays, punto a punto. Para una carga móvil, resuelve en cambio una vez por cada posición de la carga: el [ejemplo de la línea de influencia](/es/solver/scripts#an-influence-line-as-csv) lo hace así.

## En la aplicación EduBeam {#in-the-edubeam-app}

La aplicación resuelve un caso de carga cada vez, así que en las combinaciones la biblioteca va más allá que la aplicación. Un modelo con varios casos se puede [dibujar](/es/solver/drawing) igualmente caso por caso: `StructurePlot`, de @edubeam/plot, tiene la prop `loadCase`, un índice de `solver.loadCases`.
