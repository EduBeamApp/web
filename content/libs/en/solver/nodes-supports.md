---
title: Nodes and supports
description: "Create the nodes of a @edubeam/fem model, support them by fixing degrees of freedom, turn a support's axes for an inclined roller, and change nodes after a solve."
order: 3
group: Modelling
source: site
---

# Nodes and supports

Nodes are the points members connect. A support is not a separate object: it is the list of degrees of freedom a node holds fixed. The snippets on this page are parts of a program like the one in [Getting started](/solver/getting-started), and use its `solver`, `domain` and `lc`.

## Create a node

```ts
domain.createNode(label, [x, y, z], bcs)
```

| Argument | Type | Meaning |
| --- | --- | --- |
| `label` | `string \| number` | Its name, stored as a string: `1` and `'1'` are the same node |
| `coords` | `number[]` | `[x, y, z]` in metres, with `y = 0`. z points down. |
| `bcs` | `DofID[]` | The degrees of freedom the support holds. Leave it out for a free node. |

It returns the `Node`; `domain.getNode(label)` finds it again. A label already in use replaces the old node.

```ts
import { DofID } from '@edubeam/fem'

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [0, 0, -4]) // free: the top of a 4 m column
```

## Supports

Each support of the EduBeam app is a set of fixed DOFs:

| Support | `bcs` | Holds |
| --- | --- | --- |
| Fixed | `[DofID.Dx, DofID.Dz, DofID.Ry]` | everything |
| Pin | `[DofID.Dx, DofID.Dz]` | both displacements, free to turn |
| Roller | `[DofID.Dz]` | vertical displacement, rolls along x |
| Vertical roller | `[DofID.Dx]` | horizontal displacement, rolls along z |
| Slider | `[DofID.Dz, DofID.Ry]` | vertical displacement and rotation, slides along x |
| Vertical slider | `[DofID.Dx, DofID.Ry]` | horizontal displacement and rotation, slides along z |
| Rotation only | `[DofID.Ry]` | rotation |

The order you list them in is the order [reactions](/solver/results#reactions) come back in. A structure needs at least three fixed DOFs, arranged so that it cannot move as a mechanism: see [When solving fails](/solver/solving#when-solving-fails).

A fixed DOF can also be moved by a given amount, a support settlement: see [Prescribed displacements](/solver/temperature-settlements#prescribed-displacements).

## Inclined supports

A roller on a slope holds the node across the slope, not vertically. Turn the node's axes with `updateLcs`, and its `bcs` then refer to the turned axes. In the program of Getting started, create B like this instead:

```ts
const b = domain.createNode('B', [6, 0, 0], [DofID.Dz]) // holds its own z
const a = (30 * Math.PI) / 180 // 30°, from x toward z: clockwise on screen
b.updateLcs({ locx: [Math.cos(a), 0, Math.sin(a)], locy: [0, 1, 0] })
```

`locx` is the node's own x axis as a vector in global axes, and `locy` its y axis, which stays `[0, 1, 0]`. In the EduBeam app the same angle is the node's *Nodal LCS angle*, 30°.

After `solve()`, B pushes across the slope, and the pin at A takes the horizontal component:

```ts
b.getReactions(lc).values // [-41569]: N along B's own z, 36 kN / cos 30°
b.getReactions(lc, true).values // [20785, -36000, 0]: along x, along z, moment
```

::model-figure{caption="A roller turned by 30°: its reaction is across the slope, and the beam is in tension"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, N]
show: [nodeLabels]
---
::

The vertical component is still $qL/2 = 36$ kN; the horizontal one, $36 \tan 30° = 20.8$ kN, pulls the beam from both ends. The moment does not change.

On a turned node, displacements and reactions are in the node's own axes unless you pass `true` for global ones. Nodal loads on it are global unless you say otherwise: see [Nodal loads](/solver/loads#nodal-loads). `node.updateLcs()` with no argument turns the axes back.

## Change a node

A node is a plain object: change `node.coords` to move it, or replace `node.bcs`, a `Set<DofID>`, to change its support.

```ts
domain.getNode('B').coords = [8, 0, 0] // a longer span: solve() is enough
domain.getNode('A').bcs = new Set(fixed) // a new support: renumber first
solver.codeNumberGenerated = false
solver.solve()
```

Changing supports, or adding and removing nodes, changes the equations: without `codeNumberGenerated = false` the solver **silently keeps the old supports**. [Solving again after a change](/solver/solving#solving-again-after-a-change) lists which changes need it.
