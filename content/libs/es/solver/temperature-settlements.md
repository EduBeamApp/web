---
title: Temperatura y asientos
description: "Carga barras de @edubeam/fem con una variación uniforme y una diferencia de temperatura, y mueve apoyos con un desplazamiento impuesto, con ejemplos comprobados."
order: 7
source: site
---

# Temperatura y asientos {#temperature-and-settlements}

Dos cargas que no son fuerzas: una barra que tiende a cambiar su longitud o su curvatura, y un apoyo que se mueve. Las dos producen esfuerzos solo donde la estructura se lo impide, lo que las hace muy útiles para estudiar estructuras hiperestáticas. La teoría de ambas está en [Cargas de elemento](/es/elements/beam#element-loads), en el manual teórico de la aplicación.

## Temperatura {#temperature}

```ts
lc.createBeamTemperatureLoad(member, [dTc, dTb, dTt])
```

| Valor | Significado | Efecto en una barra libre |
| --- | --- | --- |
| `dTc` | variación en el centro de gravedad, K | se alarga $\alpha\,\Delta T_c\,L$ |
| `dTb` | variación en la fibra inferior (el lado +z local), K | junto con `dTt`, se curva $\kappa = \alpha\,(\Delta T_b - \Delta T_t)/h$ |
| `dTt` | variación en la fibra superior, K | |

Solo la diferencia `dTb - dTt` flexiona la barra, así que `[30, 20, 0]` y `[30, 10, -10]` son la misma carga. Necesita el `alpha` del material y el `h` de la sección; sin `h`, los momentos salen `NaN`.

Una viga biempotrada no puede alargarse ni curvarse, así que en su lugar queda comprimida y flexionada: $N = -EA\,\alpha\,\Delta T_c$ y $M = -EI\,\alpha\,(\Delta T_b - \Delta T_t)/h$.

```ts [temperature.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial(1, { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [6, 0, 0], fixed)
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

// El centro de gravedad 30 K más caliente, la fibra inferior 20 K más caliente que la superior
lc.createBeamTemperatureLoad(1, [30, 20, 0])
solver.solve()

beam.computeNormalForceAt(lc, 3) // -215460 N: EA · 12e-6 · 30
beam.computeBendingMomentAt(lc, 3) // -4896.4 N·m: EI · 12e-6 · 20 / 0.2
```

Con el IPE 200, $EA = 598{,}5$ MN y $EI = 4{,}0803$ MNm². Una fibra inferior más caliente hace que una viga libre levante sus extremos, así que la coacción la flexiona en sentido contrario: un momento negativo, con la fibra superior traccionada.

::model-figure{caption="Una viga biempotrada, 30 K más caliente en su centro de gravedad y 20 K más caliente en la fibra inferior que en la superior"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 30, bottom: 20, top: 0 } }
results: [M, N]
show: [nodeLabels]
material: { e: 210e9, alpha: 12e-6 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

En una viga biapoyada, la misma carga no produce ningún esfuerzo, solo movimiento: el apoyo móvil se desplaza hacia fuera $\alpha\,\Delta T_c\,L = 2{,}16$ mm y el centro del vano baja $\kappa L^2/8 = 5{,}4$ mm.

## Desplazamientos impuestos {#prescribed-displacements}

```ts
lc.createPrescribedDisplacement(node, { [DofID.Dz]: 0.01 })
```

Mueve un apoyo una cantidad dada: metros para `Dx` y `Dz`, radianes para `Ry`, en los ejes propios del nodo. El GDL tiene que ser uno de los que impide el apoyo del nodo; en un GDL libre, el valor se ignora sin ningún aviso.

Una viga empotrada y apoyada cuyo apoyo móvil sufre un asiento de 10 mm, en un solver nuevo con el material y la sección del ejemplo de temperatura:

```ts
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // empotramiento
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // apoyo móvil
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

lc.createPrescribedDisplacement('B', { [DofID.Dz]: 0.01 }) // 10 mm hacia abajo
solver.solve()

domain.getNode('B').getReactions(lc).values // [566.7] N: 3EIw/L³
beam.computeBendingMomentAt(lc, 0) // -3400.2 N·m en A: 3EIw/L²
```

El apoyo móvil tiene que obligar a la viga a bajar con él, así que su reacción es positiva, según +z: $3EIw/L^3 = 3 \cdot 4{,}0803 \times 10^6 \cdot 0{,}01 / 216 = 566{,}7$ N.

::model-figure{caption="El apoyo móvil de una viga empotrada y apoyada sufre un asiento de 10 mm: −3,4 kNm en el empotramiento"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

Cómo dibuja la aplicación ambas cargas se explica en [Cargas](/es/essentials/loads).
