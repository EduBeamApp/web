---
title: Frames
description: "A complete @edubeam/fem program for a three-hinged frame, with columns, rigid corners and a crown hinge, and its results checked by hand."
order: 13
source: site
---

# Frames

A frame is beams and columns joined rigidly at their corners. This recipe builds the frame of the [three-hinged frame tutorial](/tutorials/three-hinged-frame) in code: two 4 m columns pinned at A and E, an 8 m beam with a hinge at C, and 10 kN/m on the beam. The tutorial numbers the nodes 1 to 5; here they are A to E.

::model-figure{caption="The frame of the program below: pins at A and E, a hinge at C, 10 kN/m"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, k: 1e32 }) // IPE 300

// z points down: the tops of the 4 m columns are at z = -4
const pin = [DofID.Dx, DofID.Dz]
domain.createNode('A', [0, 0, 0], pin)
domain.createNode('B', [0, 0, -4])
domain.createNode('C', [4, 0, -4]) // the crown hinge
domain.createNode('D', [8, 0, -4])
domain.createNode('E', [8, 0, 0], pin)

const column = domain.createBeam2D(1, ['A', 'B'], 1, 1) // bottom to top
const left = domain.createBeam2D(2, ['B', 'C'], 1, 1, [false, true]) // C hinge
domain.createBeam2D(3, ['C', 'D'], 1, 1)
domain.createBeam2D(4, ['D', 'E'], 1, 1)

const lc = solver.loadCases[0]
for (const half of [2, 3]) {
  lc.createBeamElementUniformEdgeLoad(half, [0, 10e3], false)
}
solver.solve()

// getReactions gives a mathjs Matrix or an array: make it an array
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()
const kN = (v: number) => (v / 1e3).toFixed(2)

for (const label of ['A', 'E']) {
  const [rx, rz] = list(domain.getNode(label).getReactions(lc).values)
  console.log(`${label}: Rx = ${kN(rx)} kN, Rz = ${kN(rz)} kN`)
}
for (const x of [0, 2, 4]) {
  const m = left.computeBendingMomentAt(lc, x)
  console.log(`M at ${x} m from B = ${kN(m)} kNm`)
}
const top = column.computeBendingMomentAt(lc, 4)
console.log(`M at the top of column 1 = ${kN(top)} kNm`)
```

```text [Output]
A: Rx = 20.00 kN, Rz = -40.00 kN
E: Rx = -20.00 kN, Rz = -40.00 kN
M at 0 m from B = -80.00 kNm
M at 2 m from B = -20.00 kNm
M at 4 m from B = 0.00 kNm
M at the top of column 1 = -80.00 kNm
```

## Check it by hand

| Quantity | By hand | Solver |
| --- | --- | --- |
| Vertical reactions | $q \cdot 8/2 = 40$ kN up | $R_z = -40$ kN at A and E |
| Horizontal reactions | from $M_C = 0$ on the left half: $(40 \cdot 4 - 10 \cdot 4 \cdot 2)/4 = 20$ kN, inward | $R_x = +20$ kN at A, $-20$ kN at E |
| Corner moment | $-20 \cdot 4 = -80$ kNm | $-80$ kNm in the beam and in the column |
| Moment 2 m from B | $-80 + 40 \cdot 2 - 10 \cdot 2^2/2 = -20$ kNm | $-20$ kNm |
| Moment at the hinge | 0 | 0 |

## Things to notice {#things-to-notice}

- **Columns go up, so z is negative.** The tops of the columns are at $z = -4$.
- **The column's local axes.** Member 1 runs from A up to B, so its local z points right, into the frame. Its moment at the top is −80 kNm, like the beam's at the corner: tension on the outside. Define the column from B down to A and its local z points left: its moment changes sign, and `x` runs from the top. See [Member direction](/solver/conventions#member-direction).
- **One hinge, one member end.** The hinge sits on the end of member 2 at C; member 3 starts rigidly at C. One released end is enough to make C a hinge.
- **Global loads on the beam.** `false` gives the load in global axes: vertical, whatever the member's slope. On a horizontal beam drawn left to right that is the same as local.

## Statically indeterminate frames

Remove the hinge, `[false, false]`, and the frame is a portal frame with one redundant reaction. Its forces then depend on how stiff the beam is compared with the columns: give the members different cross sections to see it. The [experiments of the tutorial](/tutorials/three-hinged-frame#_7-experiment) fix the bases and push the frame sideways, with the numbers to check against. The [slides page](/plot/slides) of @edubeam/plot draws such a portal frame step by step.
