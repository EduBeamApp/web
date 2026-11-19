---
title: Members and hinges
description: "Connect nodes with Beam2D members, release moments with end hinges, model truss bars, and read stiffness and transformation matrices in @edubeam/fem."
order: 5
source: site
---

# Members and hinges

Every member is a `Beam2D`: a straight, two-node Timoshenko beam in the x–z plane that carries normal force, shear force and bending moment. Hinges at its ends release the moment there. The snippets use the `solver`, `domain` and `lc` of a program like the one in [Getting started](/solver/getting-started), with its material `'steel'` and section `'IPE200'`.

## Create a member

```ts
domain.createBeam2D(label, [startNode, endNode], material, crossSection, hinges)
```

| Argument | Type | Meaning |
| --- | --- | --- |
| `label` | `string \| number` | Its name, stored as a string |
| `nodes` | `[label, label]` | First and second node. Local x runs from the first to the second: see [Member direction](/solver/conventions#member-direction). |
| `mat`, `cs` | `string \| number` | Labels of a material and a cross section |
| `hinges` | `[boolean, boolean]` | A hinge at the first node, at the second. Optional; default `[false, false]`, rigid ends. |

It returns the `Beam2D`: keep it to read results. `domain.getElement(label)` finds it again, but typed as the general `Element`, so TypeScript wants `as Beam2D` before you read results from it.

Members meeting at a node without hinges are rigidly connected: they turn together. The nodes, the material and the section can be created in any order, as long as they all exist when you solve; a missing one makes `solve()` throw a `RangeError` naming it.

## End hinges

A hinge belongs to a member end, not to a node. Here member 2 starts with a hinge at C, so C passes shear but no moment from the span C–D to the cantilever A–C:

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

cd.computeBendingMomentAt(lc, 0) // 0 at the hinge
cd.computeBendingMomentAt(lc, 2) // 20000 N·m: qL²/8 of the 4 m span
ac.computeBendingMomentAt(lc, 0) // -40000 N·m: the 20 kN from C–D, 2 m away
```

::model-figure{caption="A cantilever carrying a hinged span: no moment at C"}
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

Where several members meet at a hinged joint, a hinge on every member end but one is enough. A hinge on every end works too: nothing then turns the joint, and the solver reports its rotation as 0. But a moment applied to such a joint has nothing to carry it, and [solving fails](/solver/solving#when-solving-fails).

## Truss bars

Hinge both ends and a member carries only normal force, as long as it is loaded at its nodes: a truss bar.

```ts
domain.createBeam2D('AE', ['A', 'E'], 'steel', 'bar', [true, true])
```

The [truss recipe](/solver/trusses) solves a whole truss this way. The EduBeam app's truss example uses rigid joints instead, with an area so large that the bending moments are negligible beside the axial forces. Both are valid models; they differ only in those small moments. The bar's own stiffness matrix is derived on the [truss element](/elements/truss) page of the theory manual.

## The element's matrices {#the-element-s-matrices}

For teaching the method itself, a `Beam2D` gives its matrices as [mathjs](https://mathjs.org) matrices; `.toArray()` makes them `number[][]`:

| Method | Gives |
| --- | --- |
| `computeGeo()` | `{ l, dx, dz }`: length and projections, m |
| `computeLocalStiffnessMtrx().answer` | 6 × 6 stiffness in local axes, hinges condensed out |
| `computeT()` | 6 × 6 transformation from global to local axes |
| `computeStiffness()` | 6 × 6 stiffness in global axes, $T^T K_l T$ |
| `computeShearFactor()` | $\Phi = 12EI_y/kGAL^2$ |

```ts
ac.computeStiffness().toArray() // number[][], N/m, N and N·m
```

The DOFs are ordered $u_1, w_1, \varphi_1, u_2, w_2, \varphi_2$. The [beam element](/elements/beam) page of the theory manual derives these matrices, and [How EduBeam solves](/elements/analysis) shows how they are assembled.
