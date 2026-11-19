---
title: Barras y rótulas
description: "Barras Beam2D entre nodos, rótulas de extremo que liberan el momento, barras de celosía y las matrices de rigidez y de transformación en @edubeam/fem."
order: 5
source: site
---

# Barras y rótulas {#members-and-hinges}

Cada barra es un `Beam2D`: una viga de Timoshenko recta, de dos nodos, en el plano x–z, que transmite esfuerzo axil, esfuerzo cortante y momento flector. Las rótulas en sus extremos liberan allí el momento. Los fragmentos usan los `solver`, `domain` y `lc` de un programa como el de [Primeros pasos](/es/solver/getting-started), con su material `'steel'` y su sección `'IPE200'`.

## Crear una barra {#create-a-member}

```ts
domain.createBeam2D(label, [startNode, endNode], material, crossSection, hinges)
```

| Argumento | Tipo | Significado |
| --- | --- | --- |
| `label` | `string \| number` | Su nombre, guardado como cadena |
| `nodes` | `[label, label]` | Primer y segundo nodo. El eje x local va del primero al segundo: consulta [Orientación de la barra](/es/solver/conventions#member-direction). |
| `mat`, `cs` | `string \| number` | Etiquetas de un material y de una sección |
| `hinges` | `[boolean, boolean]` | Una rótula en el primer nodo y otra en el segundo. Opcional; por defecto `[false, false]`, extremos rígidos. |

Devuelve el `Beam2D`: guárdalo para leer los resultados. `domain.getElement(label)` lo vuelve a encontrar, pero con el tipo general `Element`, así que TypeScript pide `as Beam2D` antes de leer resultados de él.

Las barras que concurren en un nodo sin rótulas están unidas rígidamente: giran juntas. Los nodos, el material y la sección pueden crearse en cualquier orden, siempre que existan todos al resolver; si falta uno, `solve()` lanza un `RangeError` que lo nombra.

## Rótulas de extremo {#end-hinges}

Una rótula pertenece a un extremo de barra, no a un nodo. Aquí la barra 2 empieza con una rótula en C, así que C transmite el cortante, pero no el momento, del vano C–D al voladizo A–C:

```ts [hinge.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry])
domain.createNode('C', [2, 0, 0])
domain.createNode('D', [6, 0, 0], [DofID.Dz])
const ac = domain.createBeam2D(1, ['A', 'C'], 'steel', 'IPE200')
const cd = domain.createBeam2D(2, ['C', 'D'], 'steel', 'IPE200', [true, false])

lc.createBeamElementUniformEdgeLoad(2, [0, 10e3], true)
solver.solve()

cd.computeBendingMomentAt(lc, 0) // 0 en la rótula
cd.computeBendingMomentAt(lc, 2) // 20000 N·m: qL²/8 del vano de 4 m
ac.computeBendingMomentAt(lc, 0) // -40000 N·m: los 20 kN que llegan de C–D, a 2 m
```

::model-figure{caption="Un voladizo que soporta un vano articulado: momento nulo en C"}
---
nodes: { A: [0, 0], C: [2, 0], D: [6, 0] }
supports: { A: fixed, D: roller }
members: [[A, C], { nodes: [C, D], hinges: [true, false] }]
loads:
  - { member: 2, qz: 10 }
results: [M, V]
show: [nodeLabels]
---
::

Cuando varias barras concurren en un nudo articulado, basta con una rótula en todos los extremos de barra menos uno. También funciona poner una rótula en todos los extremos: entonces nada hace girar el nudo, y el solver da su giro como 0. Pero un momento aplicado en un nudo así no tiene nada que lo resista, y [el cálculo falla](/es/solver/solving#when-solving-fails).

## Barras de celosía {#truss-bars}

Con rótulas en los dos extremos, una barra solo transmite esfuerzo axil, siempre que esté cargada en sus nodos: es una barra de celosía.

```ts
domain.createBeam2D('AE', ['A', 'E'], 'steel', 'bar', [true, true])
```

El [ejemplo de la celosía](/es/solver/trusses) resuelve así una celosía completa. El ejemplo de celosía de la aplicación EduBeam usa en cambio nudos rígidos, con un área tan grande que los momentos flectores son despreciables frente a los axiles. Los dos modelos son válidos; solo se diferencian en esos pequeños momentos. La matriz de rigidez de la barra se deduce en la página [Barra de celosía](/es/elements/truss) del manual teórico.

## Las matrices del elemento {#the-element-s-matrices}

Para enseñar el propio método, un `Beam2D` da sus matrices como matrices de [mathjs](https://mathjs.org); `.toArray()` las convierte en `number[][]`:

| Método | Devuelve |
| --- | --- |
| `computeGeo()` | `{ l, dx, dz }`: longitud y proyecciones, m |
| `computeLocalStiffnessMtrx().answer` | rigidez de 6 × 6 en ejes locales, con las rótulas condensadas |
| `computeT()` | transformación de 6 × 6 de ejes globales a locales |
| `computeStiffness()` | rigidez de 6 × 6 en ejes globales, $T^T K_l T$ |
| `computeShearFactor()` | $\Phi = 12EI_y/kGAL^2$ |

```ts
ac.computeStiffness().toArray() // number[][], N/m, N y N·m
```

Los GDL están ordenados así: $u_1, w_1, \varphi_1, u_2, w_2, \varphi_2$. La página [Elemento viga](/es/elements/beam) del manual teórico deduce estas matrices, y [Cómo resuelve EduBeam un modelo](/es/elements/analysis) muestra cómo se ensamblan.
