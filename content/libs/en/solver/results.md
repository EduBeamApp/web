---
title: Reading results
description: "Read reactions, nodal displacements, internal forces anywhere along a member, deflected shapes and end forces from a solved @edubeam/fem model, with the shape each call returns."
order: 10
source: site
---

# Reading results

After `solve()`, results are read from the nodes and the members, for a given load case. Every example on this page reads one model, a 6 m simply supported beam, shear-rigid IPE 200, with 20 kN at 2 m from A:

```ts [results.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 }) // shear-rigid

const A = domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
const B = domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
const lc = solver.loadCases[0]
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], true)
solver.solve()
```

::model-figure{caption="20 kN at 2 m on a 6 m span"}
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

## What to read where

| Result | Call | Returns |
| --- | --- | --- |
| Reactions | `node.getReactions(lc)` | `{ dofs, values }`: N, N·m |
| Displacements | `node.getUnknowns(lc, dofs)` | m, rad |
| N, V or M at a point | `beam.computeBendingMomentAt(lc, x)` | a number: N, N·m |
| N, V or M along a member | `beam.computeBendingMoment(lc, n)` | `{ x, M }`, n + 1 points |
| Deflected shape | `beam.computeLocalDefl(lc, n)` | `{ u, w }`, n + 1 points, m |
| End forces | `beam.computeEndForces(lc)` | a mathjs matrix of 6 |

For N and V, the methods are `computeNormalForceAt` and `computeShearForceAt`, `computeNormalForce` and `computeShearForce`, returning `{ x, N }` and `{ x, V }`. The signs are on [Units and signs](/solver/conventions#signs-of-the-results).

## Reactions

`getReactions` gives one reaction per DOF the support holds: `dofs` lists them, in the order they were given to `createNode`, and `values` holds the reactions in the same order. `values` is a **mathjs matrix** when there are several and a plain array when there is one, so a small helper makes it an array either way:

```ts
/** Make a mathjs Matrix, an array or a number a plain array. */
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

To pick one reaction regardless of order, look its DOF up: `list(values)[dofs.indexOf(DofID.Dz)]`, as the [continuous beam recipe](/solver/beams#a-continuous-beam) does.

A reaction is the force the support puts on the structure: −13 333 N along z is 13.3 kN pushing up, $P\,b/L = 20 \cdot 4/6$. On a node with [turned axes](/solver/nodes-supports#inclined-supports), the reactions are in those axes; `getReactions(lc, true)` turns them into global ones and returns all three DOFs, with 0 where nothing is held. A node without a support gives `{ dofs: [], values: [] }`.

## Displacements

`getUnknowns` reads any DOFs of a node, supported or not:

```ts
list(A.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])) // [0, 0, -0.0108924]
```

A turns clockwise by 0.010892 rad, $P\,b\,(L^2 - b^2)/6EIL$. Asked for one DOF, `getUnknowns` returns a plain number, although TypeScript declares a matrix: `list` handles that too.

## Internal forces along a member

The `…At` methods give a value at `x` metres from the member's first node:

```ts
beam.computeShearForceAt(lc, 1) // 13333.3 N
beam.computeShearForceAt(lc, 2) // -6666.7 N: at the load, the value after it
beam.computeBendingMomentAt(lc, 2) // 26666.7 N·m: R_A · 2
```

Where a point load makes a step, the value exactly at the load is the one on its far side. To read the near side, ask a hair before it, such as `x - 1e-9`.

The array methods sample a member at n + 1 evenly spaced points, ends included:

```ts
beam.computeBendingMoment(lc, 3)
// { x: [0, 2, 4, 6], M: [0, 26666.7, 13333.3, 0] }, to round-off
```

Expect round-off such as `-3.6e-12` where the exact value is 0: format numbers with `toFixed` before you print them. The largest value along a member is the largest of a fine sampling, such as `computeBendingMoment(lc, 500)`, as in the [continuous beam recipe](/solver/beams#a-continuous-beam). Under distributed loads M is a polynomial, so its exact extreme is where V crosses zero; [@edubeam/plot](/plot/model#reading-values-yourself) finds it exactly.

## Deflected shape

```ts
beam.computeLocalDefl(lc, 3)
// { u: [0, 0, 0, 0], w: [0, 0.0174279, 0.0152494, 0] }
```

`computeLocalDefl` gives the displacements along and across the member, `u` and `w`, in its local axes; `computeGlobalDefl` the same points in global x and z. The deflection under the load, 17.43 mm, is $P\,a^2 b^2/3EIL$. The shape between the nodes is exact, not interpolated from the end values. To draw it, see [Drawing the results](/solver/drawing).

## End forces

```ts
beam.computeEndForces(lc).toArray()
// [0, -13333.3, 0, 0, -6666.7, 0]: X12, Z12, M12, X21, Z21, M21
```

The forces the two nodes put on the member, in its local axes: the numbers of the app's *Element results* table, explained in [End forces](/elements/conventions#end-forces-element-results-table).

## Results as numbers to check {#results-as-numbers-to-check}

Every value above matches its closed-form formula. The [verification page](/guide/verification) works through many more textbook cases, solved by this same solver in your browser.
