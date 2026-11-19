---
title: Lectura de resultados
description: "Lee reacciones, desplazamientos, esfuerzos en las barras, deformadas y fuerzas de extremo de un modelo resuelto de @edubeam/fem, y qué devuelve cada llamada."
order: 10
source: site
---

# Lectura de resultados {#reading-results}

Después de `solve()`, los resultados se leen en los nodos y en las barras, para un caso de carga dado. Todos los ejemplos de esta página leen el mismo modelo, una viga biapoyada de 6 m, IPE 200 rígido a cortante, con 20 kN a 2 m de A:

```ts [results.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 }) // rígida a cortante

const A = domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
const B = domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
const lc = solver.loadCases[0]
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], true)
solver.solve()
```

::model-figure{caption="20 kN a 2 m en un vano de 6 m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M, w]
show: [nodeLabels]
---
::

## Qué leer y dónde {#what-to-read-where}

| Resultado | Llamada | Devuelve |
| --- | --- | --- |
| Reacciones | `node.getReactions(lc)` | `{ dofs, values }`: N, N·m |
| Desplazamientos | `node.getUnknowns(lc, dofs)` | m, rad |
| N, V o M en un punto | `beam.computeBendingMomentAt(lc, x)` | un número: N, N·m |
| N, V o M a lo largo de una barra | `beam.computeBendingMoment(lc, n)` | `{ x, M }`, n + 1 puntos |
| Deformada | `beam.computeLocalDefl(lc, n)` | `{ u, w }`, n + 1 puntos, m |
| Fuerzas en los extremos | `beam.computeEndForces(lc)` | una matriz de mathjs con 6 valores |

Para N y V, los métodos son `computeNormalForceAt` y `computeShearForceAt`, `computeNormalForce` y `computeShearForce`, que devuelven `{ x, N }` y `{ x, V }`. Los signos están en [Unidades y signos](/es/solver/conventions#signs-of-the-results).

## Reacciones {#reactions}

`getReactions` da una reacción por cada GDL que impide el apoyo: `dofs` los enumera, en el orden en que se dieron a `createNode`, y `values` contiene las reacciones en ese mismo orden. `values` es una **matriz de mathjs** cuando hay varias y un array normal cuando hay una, así que una pequeña función auxiliar lo convierte siempre en array:

```ts
/** Convierte una Matrix de mathjs, un array o un número en un array normal. */
const list = (v: unknown): number[] =>
  typeof v === 'number'
    ? [v]
    : Array.isArray(v)
      ? v
      : (v as { toArray(): number[] }).toArray()

A.getReactions(lc).dofs // [0, 2]: DofID.Dx, DofID.Dz
list(A.getReactions(lc).values) // [0, -13333.3]
list(B.getReactions(lc).values) // [-6666.7]
```

Para tomar una reacción concreta sin depender del orden, busca su GDL: `list(values)[dofs.indexOf(DofID.Dz)]`, como hace el [ejemplo de la viga continua](/es/solver/beams#a-continuous-beam).

Una reacción es la fuerza que el apoyo ejerce sobre la estructura: −13 333 N según z son 13,3 kN empujando hacia arriba, $P\,b/L = 20 \cdot 4/6$. En un nodo con [ejes girados](/es/solver/nodes-supports#inclined-supports), las reacciones están en esos ejes; `getReactions(lc, true)` las pasa a ejes globales y devuelve los tres GDL, con 0 donde no hay nada impedido. Un nodo sin apoyo da `{ dofs: [], values: [] }`.

## Desplazamientos {#displacements}

`getUnknowns` lee cualquier GDL de un nodo, tenga apoyo o no:

```ts
list(A.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])) // [0, 0, -0.0108924]
```

A gira 0,010892 rad en sentido horario, $P\,b\,(L^2 - b^2)/6EIL$. Si se le pide un solo GDL, `getUnknowns` devuelve un número, aunque TypeScript declare una matriz: `list` también resuelve eso.

## Esfuerzos a lo largo de una barra {#internal-forces-along-a-member}

Los métodos `…At` dan el valor a `x` metros del primer nodo de la barra:

```ts
beam.computeShearForceAt(lc, 1) // 13333.3 N
beam.computeShearForceAt(lc, 2) // -6666.7 N: en la carga, el valor justo después
beam.computeBendingMomentAt(lc, 2) // 26666.7 N·m: R_A · 2
```

Donde una carga puntual produce un salto, el valor exactamente en la carga es el del lado más alejado del primer nodo. Para leer el lado anterior, pide un valor un poquito antes, como `x - 1e-9`.

Los métodos que devuelven arrays muestrean la barra en n + 1 puntos equidistantes, extremos incluidos:

```ts
beam.computeBendingMoment(lc, 3)
// { x: [0, 2, 4, 6], M: [0, 26666.7, 13333.3, 0] }, salvo errores de redondeo
```

Cuenta con errores de redondeo como `-3.6e-12` donde el valor exacto es 0: da formato a los números con `toFixed` antes de mostrarlos. El valor máximo a lo largo de una barra es el máximo de un muestreo fino, como `computeBendingMoment(lc, 500)`, igual que en el [ejemplo de la viga continua](/es/solver/beams#a-continuous-beam). Con cargas distribuidas, M es un polinomio, así que su extremo exacto está donde V se anula; [@edubeam/plot](/es/plot/model#reading-values-yourself) lo encuentra exactamente.

## Deformada {#deflected-shape}

```ts
beam.computeLocalDefl(lc, 3)
// { u: [0, 0, 0, 0], w: [0, 0.0174279, 0.0152494, 0] }
```

`computeLocalDefl` da los desplazamientos según la barra y perpendiculares a ella, `u` y `w`, en sus ejes locales; `computeGlobalDefl` da los mismos puntos en x y z globales. La flecha bajo la carga, 17,43 mm, es $P\,a^2 b^2/3EIL$. La forma entre los nodos es exacta, no una interpolación de los valores en los extremos. Para dibujarla, consulta [Dibujar los resultados](/es/solver/drawing).

## Fuerzas en los extremos {#end-forces}

```ts
beam.computeEndForces(lc).toArray()
// [0, -13333.3, 0, 0, -6666.7, 0]: X12, Z12, M12, X21, Z21, M21
```

Son las fuerzas que los dos nodos ejercen sobre la barra, en sus ejes locales: los números de la tabla *Resultados de elementos* de la aplicación, explicados en [Fuerzas de extremo](/es/elements/conventions#end-forces-element-results-table).

## Resultados que puedes comprobar {#results-as-numbers-to-check}

Todos los valores anteriores coinciden con su fórmula analítica. La página [Comprobar resultados a mano](/es/guide/verification) recorre muchos más casos de libro de texto, resueltos en tu navegador por este mismo solver.
