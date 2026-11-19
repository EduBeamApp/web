---
title: Beams
description: "Complete @edubeam/fem programs for a cantilever and a two-span continuous beam, with their output, each checked against its textbook formula."
order: 12
group: Recipes
source: site
---

# Beams

Two complete programs to copy and change. Both use a shear-rigid section (`k: 1e32`), so their numbers are exactly the Euler–Bernoulli formulas. Run them with `node cantilever.ts` (Node 22.18 or later), in a folder set up as in [Install](/solver/getting-started#install).

## A cantilever

4 m long, fixed at A, 18 kN down at the free end:

```ts [cantilever.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // fixed
const tip = domain.createNode('B', [4, 0, 0]) // free
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
lc.createNodalLoad('B', { [DofID.Dz]: 18e3 }) // 18 kN down at the tip
solver.solve()

console.log(beam.computeBendingMomentAt(lc, 0)) // N·m at the root
console.log(tip.getUnknowns(lc, [DofID.Dz])) // m, the tip deflection
```

```text [Output]
-72000
0.09411072715241528
```

$M_A = -FL = -72$ kNm, hogging, and the tip deflection is $FL^3/3EI = 94.11$ mm, with $EI = 4.0803$ MNm². The same cantilever is one of the EduBeam app's examples.

## A continuous beam {#a-continuous-beam}

Two 5 m spans on three supports, 10 kN/m on both. The reactions, the moment over the middle support and the largest span moment:

```ts [continuous.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [5, 0, 0], [DofID.Dz])
domain.createNode('C', [10, 0, 0], [DofID.Dz])
const span1 = domain.createBeam2D(1, ['A', 'B'], 1, 1)
domain.createBeam2D(2, ['B', 'C'], 1, 1)

const lc = solver.loadCases[0]
for (const span of [1, 2]) {
  lc.createBeamElementUniformEdgeLoad(span, [0, 10e3], true)
}
solver.solve()

// getReactions gives a mathjs Matrix or an array: make it an array
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

for (const label of ['A', 'B', 'C']) {
  const { dofs, values } = domain.getNode(label).getReactions(lc)
  const rz = list(values)[dofs.indexOf(DofID.Dz)]
  console.log(`R${label} = ${(-rz / 1e3).toFixed(2)} kN up`)
}
const mB = span1.computeBendingMomentAt(lc, 5)
console.log(`MB = ${(mB / 1e3).toFixed(2)} kNm`)

// The largest sagging moment in span 1, from 501 points along it
const { x, M } = span1.computeBendingMoment(lc, 500)
const i = M.indexOf(Math.max(...M))
console.log(`max M = ${(M[i] / 1e3).toFixed(2)} kNm at x = ${x[i]} m`)
```

```text [Output]
RA = 18.75 kN up
RB = 62.50 kN up
RC = 18.75 kN up
MB = -31.25 kNm
max M = 17.58 kNm at x = 1.87 m
```

The textbook values for two equal spans: $R_A = R_C = 0.375\,qL$, $R_B = 1.25\,qL$, $M_B = -qL^2/8$, and the largest span moment $R_A^2/2q = 17.58$ kNm, at $x = R_A/q = 1.875$ m. The sampling finds it at the grid point 1.87 m, within 0.0002 kNm of the true value.

::model-figure{caption="Two spans of 5 m under 10 kN/m"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels]
---
::

The figure uses the app's example section rather than the IPE 200. With one section throughout, the internal forces of a continuous beam do not depend on its stiffness, so the diagrams carry the same numbers; only the deflection differs.

## Change it

- **Unequal spans or loads:** change the coordinates of C or the load list. A load on one span only gives the familiar pattern loading.
- **Three spans:** add a node D and a member `['C', 'D']`.
- **A fixed end:** give A `[DofID.Dx, DofID.Dz, DofID.Ry]`.
- **Real shear deformation:** `k: 5 / 6` for a rectangle, or the shear coefficient of your section.
- **A figure of it:** hand the solver to [@edubeam/plot](/solver/drawing).

The [continuous beam tutorial](/tutorials/continuous-beam) builds a beam like this in the EduBeam app, and the [verification page](/guide/verification) has more textbook cases with their formulas.
