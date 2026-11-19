---
title: Nodal and member loads
description: "Apply forces and moments at nodes, and uniform, trapezoidal and point loads along members, in global or local axes, with @edubeam/fem; then change or remove them."
order: 6
group: Loads
source: site
---

# Nodal and member loads

Loads belong to a load case. The solver starts with one, `solver.loadCases[0]`, and each `create…` method on it adds a load and returns it. For several cases and their combinations, see [Load cases](/solver/load-cases).

Values are in N, N/m and N·m and follow the [axes](/solver/conventions#axes): +z is down, a positive moment is counter-clockwise.

## A beam with every kind

An 8 m beam on a pin and a roller, with a line load rising from 4 to 10 kN/m, a 20 kN point load, a 10 kNm couple and a horizontal force at the roller:

```ts [loads.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // pin
domain.createNode('B', [8, 0, 0], [DofID.Dz]) // roller
domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
// 4 kN/m at A rising to 10 kN/m at B, down
lc.createBeamElementTrapezoidalEdgeLoad(1, [0, 4e3], [0, 10e3], false)
// [fx, fz, my, a]: 20 kN down, 2 m from A
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], false)
// a 10 kNm counter-clockwise couple, 6 m from A
lc.createBeamConcentratedLoad(1, [0, 0, 10e3, 6], false)
// 5 kN to the right at B
lc.createNodalLoad('B', { [DofID.Dx]: 5e3 })
solver.solve()

// getReactions gives a mathjs Matrix or an array: make it an array
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

console.log(list(domain.getNode('A').getReactions(lc).values))
console.log(list(domain.getNode('B').getReactions(lc).values))
```

```text [Output]
[ -5000, -40250 ]
[ -35750 ]
```

By hand: the line load is 56 kN acting 4.571 m from A, so moments about A give $8R_B = 56 \cdot 4.571 + 20 \cdot 2 - 10 = 286$, $R_B = 35.75$ kN up, and $R_A = 76 - 35.75 = 40.25$ kN up. The pin also holds back the 5 kN, which puts the whole beam in 5 kN of tension.

::model-figure{caption="The same loads. The figure puts the couple on a node C at 6 m, which gives the same results."}
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

## Nodal loads

```ts
lc.createNodalLoad(node, { [DofID.Dx]: fx, [DofID.Dz]: fz, [DofID.Ry]: my }, lcs)
```

Give only the components you need. The values are in global axes, or, with `lcs` set to `true`, in the node's own axes, for a node turned with [`updateLcs`](/solver/nodes-supports#inclined-supports). A force on a DOF the support holds goes straight into the reaction and bends nothing.

## Member loads

| Method | Values | Load |
| --- | --- | --- |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | N/m | uniform over the whole member |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | N/m | linear, from the first node to the second |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | N, N·m, m | a force and a couple, `a` metres from the first node |

Line loads always cover the whole member. For a load on part of a span, split the member with a node where the load starts: an extra node changes no result. A point load or a couple can sit anywhere along the member.

### Global or local axes {#global-or-local-axes}

The last argument, `lcs`, says which axes the components are in:

- `false`: global x and z. `fz` acts vertically whatever the member's slope.
- `true`: the member's local x (along it) and z (across it). `fz` acts perpendicular to the member.

On a horizontal member drawn left to right the two are the same; drawn right to left, local `fz` points up.

::callout{type="info" title="Line loads are per metre of member"}
Both kinds act per metre of the member's own length. On a rafter 5 m long that spans 4 m horizontally, `[0, 10e3]` in global axes adds up to 50 kN. A snow load of 10 kN/m measured on the horizontal projection is $10 \cdot 4/5 = 8$ kN/m along the rafter: give `[0, 8e3]`.
::

## Change or remove a load

Each `create…` method returns the load. Change its values and solve again:

```ts
const q = lc.createBeamElementUniformEdgeLoad(1, [0, 10e3], true)
solver.solve()
q.values = [0, 20e3] // twice the load
solver.solve()
```

The loads live in plain arrays, `lc.nodalLoadList` and `lc.elementLoadList` (member and temperature loads), so `lc.elementLoadList.splice(index, 1)` removes one. The property names of each load are in the [reference](/solver/reference#loads).

Temperature changes and support settlements are loads too: see [Temperature and settlements](/solver/temperature-settlements).
