---
title: Cargas nodales y en barras
description: "Aplica con @edubeam/fem fuerzas y momentos nodales y cargas uniformes, trapezoidales y puntuales en barras, en ejes globales o locales, y cámbialas o bórralas."
order: 6
group: Cargas
source: site
---

# Cargas nodales y en barras {#nodal-and-member-loads}

Las cargas pertenecen a un caso de carga. El solver empieza con uno, `solver.loadCases[0]`, y cada método `create…` de este añade una carga y la devuelve. Para varios casos y sus combinaciones, consulta [Casos de carga](/es/solver/load-cases).

Los valores van en N, N/m y N·m y siguen los [ejes](/es/solver/conventions#axes): +z es hacia abajo y un momento positivo es antihorario.

## Una viga con todos los tipos {#a-beam-with-every-kind}

Una viga de 8 m sobre un apoyo articulado y un apoyo móvil, con una carga lineal que crece de 4 a 10 kN/m, una carga puntual de 20 kN, un par de 10 kNm y una fuerza horizontal en el apoyo móvil:

```ts [loads.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // apoyo articulado
domain.createNode('B', [8, 0, 0], [DofID.Dz]) // apoyo móvil
domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
// 4 kN/m en A que crecen hasta 10 kN/m en B, hacia abajo
lc.createBeamElementTrapezoidalEdgeLoad(1, [0, 4e3], [0, 10e3], false)
// [fx, fz, my, a]: 20 kN hacia abajo, a 2 m de A
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], false)
// un par de 10 kNm antihorario, a 6 m de A
lc.createBeamConcentratedLoad(1, [0, 0, 10e3, 6], false)
// 5 kN hacia la derecha en B
lc.createNodalLoad('B', { [DofID.Dx]: 5e3 })
solver.solve()

// getReactions da una Matrix de mathjs o un array: lo convertimos en array
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

console.log(list(domain.getNode('A').getReactions(lc).values))
console.log(list(domain.getNode('B').getReactions(lc).values))
```

```text [Salida]
[ -5000, -40250 ]
[ -35750 ]
```

A mano: la carga lineal suma 56 kN y actúa a 4,571 m de A, así que tomando momentos respecto a A, $8R_B = 56 \cdot 4{,}571 + 20 \cdot 2 - 10 = 286$, $R_B = 35{,}75$ kN hacia arriba, y $R_A = 76 - 35{,}75 = 40{,}25$ kN hacia arriba. El apoyo articulado retiene además los 5 kN, lo que somete toda la viga a una tracción de 5 kN.

::model-figure{caption="Las mismas cargas. La figura coloca el par en un nodo C a 6 m, lo que da los mismos resultados."}
---
nodes: { A: [0, 0], C: [6, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: [4, 8.5] }
  - { member: 2, qz: [8.5, 10] }
  - { member: 1, pz: 20, at: 2 }
  - { node: C, my: 10 }
  - { node: B, fx: 5 }
results: [M]
show: [nodeLabels]
labels: horizontal
---
::

## Cargas nodales {#nodal-loads}

```ts
lc.createNodalLoad(node, { [DofID.Dx]: fx, [DofID.Dz]: fz, [DofID.Ry]: my }, lcs)
```

Da solo las componentes que necesites. Los valores están en ejes globales o, con `lcs` igual a `true`, en los ejes propios del nodo, para un nodo girado con [`updateLcs`](/es/solver/nodes-supports#inclined-supports). Una fuerza sobre un GDL que el apoyo impide pasa directamente a la reacción y no produce ninguna flexión.

## Cargas en barras {#member-loads}

| Método | Valores | Carga |
| --- | --- | --- |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | N/m | uniforme en toda la barra |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | N/m | lineal, del primer nodo al segundo |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | N, N·m, m | una fuerza y un par, a `a` metros del primer nodo |

Las cargas lineales siempre cubren toda la barra. Para una carga en una parte del vano, divide la barra con un nodo donde empieza la carga: un nodo más no cambia ningún resultado. Una carga puntual o un par pueden estar en cualquier punto de la barra.

### Ejes globales o locales {#global-or-local-axes}

El último argumento, `lcs`, indica en qué ejes están las componentes:

- `false`: x y z globales. `fz` actúa en vertical sea cual sea la inclinación de la barra.
- `true`: x local (según la barra) y z local (perpendicular a ella). `fz` actúa perpendicularmente a la barra.

En una barra horizontal dibujada de izquierda a derecha, ambos coinciden; dibujada de derecha a izquierda, la `fz` local apunta hacia arriba.

::callout{type="info" title="Las cargas lineales son por metro de barra"}
Los dos tipos actúan por metro de la longitud propia de la barra. En una viga inclinada de 5 m de longitud que salva 4 m en horizontal, `[0, 10e3]` en ejes globales suma 50 kN. Una carga de nieve de 10 kN/m medida en proyección horizontal equivale a $10 \cdot 4/5 = 8$ kN/m según la viga inclinada: da `[0, 8e3]`.
::

## Modificar o eliminar una carga {#change-or-remove-a-load}

Cada método `create…` devuelve la carga. Cambia sus valores y vuelve a resolver:

```ts
const q = lc.createBeamElementUniformEdgeLoad(1, [0, 10e3], true)
solver.solve()
q.values = [0, 20e3] // el doble de carga
solver.solve()
```

Las cargas se guardan en arrays normales, `lc.nodalLoadList` y `lc.elementLoadList` (cargas en barras y cargas térmicas), así que `lc.elementLoadList.splice(index, 1)` elimina una. Los nombres de las propiedades de cada carga están en la [referencia](/es/solver/reference#loads).

Las variaciones de temperatura y los asientos de apoyo también son cargas: consulta [Temperatura y asientos](/es/solver/temperature-settlements).
