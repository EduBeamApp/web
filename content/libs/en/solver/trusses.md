---
title: Trusses
description: "A pin-jointed Warren truss in @edubeam/fem, every bar force checked by the method of sections, and a loop that generates trusses of any number of panels."
order: 14
source: site
---

# Trusses

A truss is bars hinged at both ends and loaded at the joints, so every bar carries only a normal force. This recipe builds a Warren truss from two lists, checks every bar force by hand, and then generates trusses of any size in a loop.

::model-figure{caption="A Warren truss: 9 m span, 1.8 m deep, 8 kN at each top joint"}
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

// A Warren truss: 9 m span, 1.8 m deep, bottom chord A-B-C-D, top chord E-F-G
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

// Each label names its two nodes. Hinged at both ends: axial force only.
const bars = ['AB', 'BC', 'CD', 'EF', 'FG', 'AE', 'EB', 'BF', 'FC', 'CG', 'GD']
const members = bars.map((bar) =>
  domain.createBeam2D(bar, [bar[0], bar[1]], 1, 1, [true, true])
)

const lc = solver.loadCases[0]
for (const top of ['E', 'F', 'G']) {
  lc.createNodalLoad(top, { [DofID.Dz]: 8e3 }) // 8 kN down
}
solver.solve()

for (const bar of members) {
  const n = bar.computeNormalForceAt(lc, 0) / 1e3
  console.log(bar.label, n.toFixed(2), n > 0 ? 'tension' : 'compression')
}
```

```text [Output]
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

A bar's normal force is constant, so reading it at `x = 0` is enough. The two-letter labels double as the node pairs: `bar[0]` and `bar[1]`.

## Check it by hand

Each support carries half of the 24 kN, 12 kN. Cut the truss and take moments about the joint opposite the cut bar, as in the [method of sections](/tutorials/truss):

| Bar | Section | Force |
| --- | --- | --- |
| BC, bottom chord | moments about F: $(12 \cdot 4.5 - 8 \cdot 3)/1.8$ | 16.67 kN tension |
| EF, top chord | moments about B: $(12 \cdot 3 - 8 \cdot 1.5)/1.8$ | 13.33 kN compression |
| AE, end diagonal | joint A: $12 \cdot \sqrt{1.5^2 + 1.8^2}/1.8$ | 15.62 kN compression |
| EB, diagonal | shear in the panel, $12 - 8 = 4$ kN: $4 \cdot 2.343/1.8$ | 5.21 kN tension |

The section does not change the bar forces of a statically determinate truss; it only sets how much the joints move. The figure above uses another section, the EduBeam app's, and gives the same forces.

## Any number of panels {#any-number-of-panels}

To generate trusses, for exercises or a parameter study, build the joints and bars in a loop, panel by panel. With `panels = 3` this is the truss above, and it prints the same forces; change `panels`, `w` and `h` for another.

```ts [warren.ts]
import { type Beam2D, DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })
const lc = solver.loadCases[0]

const panels = 3 // panels of the bottom chord
const w = 3 // panel width, m
const h = 1.8 // depth, m

// Bottom joints b0, b1, … on a pin and a roller; top joints t0, t1, … between
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
  bar(`b${i}`, `b${i + 1}`) // bottom chord
  bar(`b${i}`, `t${i}`) // diagonal up
  bar(`t${i}`, `b${i + 1}`) // diagonal down
  if (i > 0) bar(`t${i - 1}`, `t${i}`) // top chord
}
solver.solve()

for (const m of members) {
  console.log(m.label, (m.computeNormalForceAt(lc, 0) / 1e3).toFixed(2))
}
```

The solver's time grows quickly with size: a few dozen panels are fine, see [Model size](/solver/solving#model-size). To draw each generated truss, with or without its answers, see [Exercises and tests](/plot/exercises) of @edubeam/plot.

## Things to notice {#things-to-notice}

- **Hinges on every bar end.** Every joint is then free to turn, and the solver reports its rotation as 0. A moment applied at such a joint has nothing to carry it and [solving fails](/solver/solving#when-solving-fails).
- **Loads at the joints.** A load along a bar would bend it: then it is a beam, not a truss bar, and it gets a moment diagram.

The [plane truss tutorial](/tutorials/truss) builds a truss in the EduBeam app, and the [truss element](/elements/truss) page derives the bar's stiffness.
