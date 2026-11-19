---
title: Load cases
description: "Solve several load cases of one @edubeam/fem model at once, and combine their results by superposition into load combinations and envelopes."
order: 8
source: site
---

# Load cases

A load case is a set of loads solved together. The solver starts with one; add more, and a single `solve()` solves them all with one stiffness matrix. The analysis is linear, so the results of different cases can be scaled and added: that is all a load combination is.

## Add a load case

```ts [load-cases.ts]
import { DofID, LinearStaticSolver, LoadCase } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const dead = solver.loadCases[0] // the one every solver starts with
const live = new LoadCase('live', domain)
solver.loadCases.push(live)

dead.createBeamElementUniformEdgeLoad(1, [0, 10e3], true) // 10 kN/m
live.createBeamConcentratedLoad(1, [0, 20e3, 0, 3], true) // 20 kN at midspan
solver.solve() // solves every load case

console.log(beam.computeBendingMomentAt(dead, 3)) // qL²/8
console.log(beam.computeBendingMomentAt(live, 3)) // PL/4
```

```text [Output]
45000
30000
```

Every result method takes the load case it should read. The first case is labelled `'DefaultLC'`; labels are only names, and the solver tells cases apart by the object.

## Combine them

Multiply each case's result by its factor and add. For the ultimate limit state of Eurocode, $1.35\,G + 1.5\,Q$, at midspan:

```ts
1.35 * beam.computeBendingMomentAt(dead, 3) +
  1.5 * beam.computeBendingMomentAt(live, 3) // 105750 N·m
```

The same holds for reactions, displacements and every other result. Along a whole member, combine point by point: the arrays of `computeBendingMoment(lc, n)` use the same `x` for every case.

```ts
const n = 60
const g = beam.computeBendingMoment(dead, n).M
const q = beam.computeBendingMoment(live, n).M
const uls = g.map((m, i) => 1.35 * m + 1.5 * q[i])
Math.max(...uls) // 105750 N·m, at x = 3
```

An envelope, the largest and smallest value over several combinations, is a `Math.max` and `Math.min` over such arrays, point by point. For a moving load, solve once per load position instead: the [influence line recipe](/solver/scripts#an-influence-line-as-csv) does that.

## In the EduBeam app {#in-the-edubeam-app}

The app solves one load case at a time, so combinations are where the library goes further. A model with several cases can still be [drawn](/solver/drawing) case by case: `StructurePlot` from @edubeam/plot takes a `loadCase` index into `solver.loadCases`.
