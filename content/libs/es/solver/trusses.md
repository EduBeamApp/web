---
title: Celosías
description: "Una celosía Warren articulada en @edubeam/fem, con cada axil comprobado por el método de las secciones, y un bucle que genera celosías de cualquier número de módulos."
order: 14
source: site
---

# Celosías {#trusses}

Una celosía está formada por barras articuladas en ambos extremos y cargadas en los nudos, así que cada barra solo transmite esfuerzo axil. Este ejemplo construye una celosía Warren a partir de dos listas, comprueba a mano el axil de cada barra y después genera celosías de cualquier tamaño en un bucle.

::model-figure{caption="Una celosía Warren: 9 m de luz, 1,8 m de canto, 8 kN en cada nudo superior"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members:
  - { nodes: [A, B], hinges: [true, true] }
  - { nodes: [B, C], hinges: [true, true] }
  - { nodes: [C, D], hinges: [true, true] }
  - { nodes: [E, F], hinges: [true, true] }
  - { nodes: [F, G], hinges: [true, true] }
  - { nodes: [A, E], hinges: [true, true] }
  - { nodes: [E, B], hinges: [true, true] }
  - { nodes: [B, F], hinges: [true, true] }
  - { nodes: [F, C], hinges: [true, true] }
  - { nodes: [C, G], hinges: [true, true] }
  - { nodes: [G, D], hinges: [true, true] }
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: [N, w]
show: [nodeLabels]
---
::

```ts [truss.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })

// Una celosía Warren: 9 m de luz, 1.8 m de canto, cordón inferior A-B-C-D, cordón superior E-F-G
const nodes: [string, number, number, DofID[]][] = [
  ['A', 0, 0, [DofID.Dx, DofID.Dz]],
  ['B', 3, 0, []],
  ['C', 6, 0, []],
  ['D', 9, 0, [DofID.Dz]],
  ['E', 1.5, -1.8, []],
  ['F', 4.5, -1.8, []],
  ['G', 7.5, -1.8, []],
]
for (const [label, x, z, support] of nodes) {
  domain.createNode(label, [x, 0, z], support)
}

// Cada etiqueta nombra sus dos nodos. Articuladas en ambos extremos: solo axil.
const bars = ['AB', 'BC', 'CD', 'EF', 'FG', 'AE', 'EB', 'BF', 'FC', 'CG', 'GD']
const members = bars.map((bar) =>
  domain.createBeam2D(bar, [bar[0], bar[1]], 1, 1, [true, true])
)

const lc = solver.loadCases[0]
for (const top of ['E', 'F', 'G']) {
  lc.createNodalLoad(top, { [DofID.Dz]: 8e3 }) // 8 kN hacia abajo
}
solver.solve()

for (const bar of members) {
  const n = bar.computeNormalForceAt(lc, 0) / 1e3
  console.log(bar.label, n.toFixed(2), n > 0 ? 'tension' : 'compression')
}
```

```text [Salida]
AB 10.00 tension
BC 16.67 tension
CD 10.00 tension
EF -13.33 compression
FG -13.33 compression
AE -15.62 compression
EB 5.21 tension
BF -5.21 compression
FC -5.21 compression
CG 5.21 tension
GD -15.62 compression
```

El axil de una barra es constante, así que basta con leerlo en `x = 0`. Las etiquetas de dos letras sirven a la vez como pares de nodos: `bar[0]` y `bar[1]`.

## Comprobación a mano {#check-it-by-hand}

Cada apoyo recibe la mitad de los 24 kN, es decir, 12 kN. Corta la celosía y toma momentos respecto al nudo opuesto a la barra cortada, como en el [método de las secciones](/es/tutorials/truss):

| Barra | Sección | Axil |
| --- | --- | --- |
| BC, cordón inferior | momentos respecto a F: $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$ | 16,67 kN de tracción |
| EF, cordón superior | momentos respecto a B: $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$ | 13,33 kN de compresión |
| AE, diagonal extrema | nudo A: $12 \cdot \sqrt{1{,}5^2 + 1{,}8^2}/1{,}8$ | 15,62 kN de compresión |
| EB, diagonal | cortante en el módulo, $12 - 8 = 4$ kN: $4 \cdot 2{,}343/1{,}8$ | 5,21 kN de tracción |

La sección no cambia los axiles de una celosía isostática; solo determina cuánto se mueven los nudos. La figura de arriba usa otra sección, la de la aplicación EduBeam, y da los mismos axiles.

## Cualquier número de módulos {#any-number-of-panels}

Para generar celosías, para ejercicios o para un estudio paramétrico, construye los nudos y las barras en un bucle, módulo a módulo. Con `panels = 3` es la celosía de arriba, y muestra los mismos axiles; cambia `panels`, `w` y `h` para obtener otra.

```ts [warren.ts]
import { type Beam2D, DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })
const lc = solver.loadCases[0]

const panels = 3 // módulos del cordón inferior
const w = 3 // ancho del módulo, m
const h = 1.8 // canto, m

// Nudos inferiores b0, b1, … sobre un apoyo articulado y uno móvil; nudos superiores t0, t1, … entre ellos
for (let i = 0; i <= panels; i++) {
  const ends = i === 0 ? [DofID.Dx, DofID.Dz] : i === panels ? [DofID.Dz] : []
  domain.createNode(`b${i}`, [i * w, 0, 0], ends)
}
for (let i = 0; i < panels; i++) {
  domain.createNode(`t${i}`, [(i + 0.5) * w, 0, -h])
  lc.createNodalLoad(`t${i}`, { [DofID.Dz]: 8e3 })
}

const members: Beam2D[] = []
const bar = (a: string, b: string) =>
  members.push(domain.createBeam2D(`${a}-${b}`, [a, b], 1, 1, [true, true]))
for (let i = 0; i < panels; i++) {
  bar(`b${i}`, `b${i + 1}`) // cordón inferior
  bar(`b${i}`, `t${i}`) // diagonal ascendente
  bar(`t${i}`, `b${i + 1}`) // diagonal descendente
  if (i > 0) bar(`t${i - 1}`, `t${i}`) // cordón superior
}
solver.solve()

for (const m of members) {
  console.log(m.label, (m.computeNormalForceAt(lc, 0) / 1e3).toFixed(2))
}
```

El tiempo de cálculo del solver crece rápidamente con el tamaño: unas cuantas decenas de módulos no dan problemas; consulta [Tamaño del modelo](/es/solver/solving#model-size). Para dibujar cada celosía generada, con o sin sus soluciones, consulta [Ejercicios y exámenes](/es/plot/exercises), en @edubeam/plot.

## Detalles que conviene observar {#things-to-notice}

- **Rótulas en todos los extremos de barra.** Así, todos los nudos pueden girar libremente, y el solver da su giro como 0. Un momento aplicado en un nudo así no tiene nada que lo resista y [el cálculo falla](/es/solver/solving#when-solving-fails).
- **Cargas en los nudos.** Una carga en el vano de una barra la flexionaría: entonces sería una viga, no una barra de celosía, y tendría diagrama de momentos.

El [tutorial de la celosía plana](/es/tutorials/truss) construye una celosía en la aplicación EduBeam, y la página [Barra de celosía](/es/elements/truss) deduce la rigidez de la barra.
