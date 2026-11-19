---
title: Temperature and settlements
description: "Load @edubeam/fem members with a temperature change and a temperature gradient, and move supports by a prescribed displacement, with checked examples."
order: 7
source: site
---

# Temperature and settlements

Two loads that are not forces: a member that wants to change its length or curvature, and a support that moves. Both cause internal forces only where the structure stops them, which makes them good material for statically indeterminate structures. The theory behind both is in the app's [Element loads](/elements/beam#element-loads).

## Temperature

```ts
lc.createBeamTemperatureLoad(member, [dTc, dTb, dTt])
```

| Value | Meaning | Effect on a free member |
| --- | --- | --- |
| `dTc` | change at the centroid, K | lengthens by $\alpha\,\Delta T_c\,L$ |
| `dTb` | change at the bottom fibre (the local +z side), K | with `dTt`, curves by $\kappa = \alpha\,(\Delta T_b - \Delta T_t)/h$ |
| `dTt` | change at the top fibre, K | |

Only the difference `dTb - dTt` bends the member, so `[30, 20, 0]` and `[30, 10, -10]` are the same load. It needs the material's `alpha` and the section's `h`; without `h`, the moments are `NaN`.

A beam fixed at both ends can neither lengthen nor curve, so it is squeezed and bent instead: $N = -EA\,\alpha\,\Delta T_c$ and $M = -EI\,\alpha\,(\Delta T_b - \Delta T_t)/h$.

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

// The centroid 30 K warmer, the bottom 20 K warmer than the top
lc.createBeamTemperatureLoad(1, [30, 20, 0])
solver.solve()

beam.computeNormalForceAt(lc, 3) // -215460 N: EA · 12e-6 · 30
beam.computeBendingMomentAt(lc, 3) // -4896.4 N·m: EI · 12e-6 · 20 / 0.2
```

With the IPE 200, $EA = 598.5$ MN and $EI = 4.0803$ MNm². A warmer bottom fibre makes a free beam curl up at its ends, so the restraint bends it the other way: a hogging moment, tension in the top fibre.

::model-figure{caption="A fixed-end beam, 30 K warmer at its centroid and 20 K warmer at the bottom than at the top"}
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

On a simply supported beam the same load causes no internal forces at all, only movement: the roller slides out by $\alpha\,\Delta T_c\,L = 2.16$ mm and the midspan sags $\kappa L^2/8 = 5.4$ mm.

## Prescribed displacements

```ts
lc.createPrescribedDisplacement(node, { [DofID.Dz]: 0.01 })
```

Moves a support by a given amount: metres for `Dx` and `Dz`, radians for `Ry`, in the node's own axes. The DOF must be one the node's support holds; on a free DOF the value is ignored without a warning.

A propped cantilever whose roller settles 10 mm, in a new solver with the material and section of the temperature example:

```ts
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // fixed
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // roller
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

lc.createPrescribedDisplacement('B', { [DofID.Dz]: 0.01 }) // 10 mm down
solver.solve()

domain.getNode('B').getReactions(lc).values // [566.7] N: 3EIw/L³
beam.computeBendingMomentAt(lc, 0) // -3400.2 N·m at A: 3EIw/L²
```

The roller has to pull the beam down to make it follow, so its reaction is positive, along +z: $3EIw/L^3 = 3 \cdot 4.0803 \times 10^6 \cdot 0.01 / 216 = 566.7$ N.

::model-figure{caption="The roller of a propped cantilever settles 10 mm: −3.4 kNm at the fixed end"}
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

How the app draws both loads is in [Loads](/essentials/loads).
