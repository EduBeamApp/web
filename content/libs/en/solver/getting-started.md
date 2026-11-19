---
title: Getting started
description: "Install @edubeam/fem, the finite element solver behind EduBeam, and solve, check and read a simply supported beam in a dozen lines of TypeScript."
order: 1
group: Introduction
source: site
---

# Getting started

@edubeam/fem is the finite element solver behind [EduBeam]{.edubeam}: every diagram, reaction and deflection the app shows comes from it. Use it to solve plane beams, frames and trusses from your own code, in the browser or in Node: generate exercises with their answers, check homework, run parametric studies, or put a solver behind a web page.

::div{.actions}
[Solve your first beam](#a-simply-supported-beam) [Browse the recipes](/solver/beams)
::

It is written in TypeScript, ships its own types, and is free software under the GPL-3.0. It was created by Bořek Patzák and is developed with Jan Voříšek and contributors.

## Install

```bash
npm install @edubeam/fem
```

It works with `import` and `require`, in the browser and in Node 18 or later, and brings one dependency, [mathjs](https://mathjs.org). Until version 0.3.0 it was installed from GitHub as `ts-fem`: if you used that, change your imports to `@edubeam/fem`. Nothing else changed.

To try the example below from an empty folder, make it a project that uses `import`, then install:

```bash
npm init -y
npm pkg set type=module
npm install @edubeam/fem
```

Without `"type": "module"` in `package.json` the example still runs, but Node prints a warning first.

## Your first beam {#a-simply-supported-beam}

A 6 m steel beam, an IPE 200, on a pin and a roller under 12 kN/m:

```ts [beam.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver

// SI units throughout: m, N, Pa. Steel and an IPE 200.
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

// Nodes at [x, y, z] in metres, with the DOFs their support holds
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // pin
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // roller
const beam = domain.createBeam2D(1, ['A', 'B'], 'steel', 'IPE200')

// 12 kN/m along the member's local z: down on a beam drawn left to right
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad(1, [0, 12e3], true)

solver.solve()

console.log(beam.computeBendingMomentAt(lc, 3)) // N·m at midspan
console.log(beam.computeShearForceAt(lc, 0)) // N at A
console.log(beam.computeLocalDefl(lc, 2).w[1]) // m at midspan
```

Save it as `beam.ts` and run `node beam.ts`: Node 22.18 and later run TypeScript as it is. The file has no type annotations, so on an older Node save it as `beam.mjs` instead. It prints:

```text [Output]
54000
36000
0.04990940552616746
```

Those are the textbook values, $M = qL^2/8 = 54$ kNm and $V = qL/2 = 36$ kN. Here is the same beam, solved in your browser by the same solver:

::model-figure{caption="The beam above: 6 m, IPE 200, 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9, g: 81e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 0.8333333 }
---
::

The deflection, 49.91 mm, is 0.28 mm more than Euler–Bernoulli's $5qL^4/384EI = 49.63$ mm. That is no error: the member is a Timoshenko beam, and 0.28 mm is $qL^2/8kGA$, the shear deformation of this beam. Make `k` huge, such as `1e32`, and it disappears: see [Shear deformation](/solver/materials-sections#shear-deformation).

## What the code does

::div{.steps}
### Make a solver

`new LinearStaticSolver()` comes with an empty `domain`, which holds the model, and one load case, `solver.loadCases[0]`.

### Describe the model

Materials and cross sections, nodes with their supports, then members between the nodes. Everything has a label, a string or a number, by which the rest of the model refers to it. See [Nodes and supports](/solver/nodes-supports), [Materials and sections](/solver/materials-sections) and [Members and hinges](/solver/members-hinges).

### Load it

Loads belong to a load case: forces at nodes, loads along members, temperature and settlements. See [Loads](/solver/loads).

### Solve

`solver.solve()` assembles and solves every load case. See [Solving](/solver/solving).

### Read the results

Internal forces anywhere along a member, deflections, end forces, nodal displacements and reactions. See [Reading results](/solver/results), and [Drawing the results](/solver/drawing) for diagrams.
::

## Units and signs in brief {#axes-and-signs}

SI units in, SI units out. The model lies in the x–z plane with **z pointing down**, so a positive `fz` pushes down and the top of a 4 m column is at $z = -4$. Positions along a member are metres from its first node. A sagging moment is positive. [Units and signs](/solver/conventions) has the full list.

## Six things that trip people up {#pitfalls}

1. **z points down.** Gravity loads are positive, and anything above the supports has a negative z. See [Axes](/solver/conventions#axes).
2. **A member's direction sets the sign of M and w.** Define beams left to right and columns bottom to top, and the signs read as in a textbook. See [Member direction](/solver/conventions#member-direction).
3. **A missing parameter gives `NaN` or nonsense, not an error.** A section needs `a`, `iy` and `k`; a material needs `e`, and `g` unless `k` is huge. See [Materials and sections](/solver/materials-sections).
4. **After adding nodes or members, or changing supports,** set `solver.codeNumberGenerated = false` before solving again. See [Solving again after a change](/solver/solving#solving-again-after-a-change).
5. **Reactions come back as a mathjs matrix or as an array,** in the order the support's DOFs were given. See [Reactions](/solver/results#reactions).
6. **A mechanism does not always throw.** A displacement of $10^{12}$ m means the structure can move freely. See [When solving fails](/solver/solving#when-solving-fails).

## Where to next {#next}

::card-grid{cols="2"}
:::card{title="Recipes" icon="lucide:book-open" to="/solver/beams"}
Complete, checked programs: beams, frames, trusses, an exercise sheet with its answer key, a small HTTP server.
:::
:::card{title="Draw the results" icon="lucide:chart-spline" to="/solver/drawing"}
Hand a solved model to @edubeam/plot and get its diagrams as SVG, in Vue or from a Node script.
:::
:::card{title="API reference" icon="lucide:list-tree" to="/solver/reference"}
Every class, method and argument, with units and what comes back.
:::
:::card{title="The theory" icon="lucide:sigma" to="/elements/beam"}
The beam element, its stiffness matrix and transformation, in EduBeam's theory manual.
:::
::
