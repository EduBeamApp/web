---
title: Plot model
description: "The JSON-serialisable PlotModel that modelFromSolver makes from a solved @edubeam/fem model, its piecewise polynomial results, exact values and extremes."
order: 9
source: site
---

# Plot model

Everything @edubeam/plot draws comes from a `PlotModel`: plain data that `modelFromSolver` reads out of a solved @edubeam/fem model. It holds the geometry, the supports, the loads, the reactions, and each member's results as exact polynomials. It is JSON-serialisable, so it can be made at build time and shipped instead of the solver, and it is the easiest way to read exact values and extremes of a solved structure.

```ts
import { modelFromSolver } from '@edubeam/plot'

const model = modelFromSolver(solver) // or modelFromSolver(solver, { loadCase: 1 })
```

`results` is present only when the load case is solved. Without it, the components draw the model alone, and with [`reactionLabels: 'names'`](/plot/structure-plot#reactions-as-unknowns) they still draw the unknown reactions, so an unsolved model can be an exercise sheet.

## The format

Everything is in SI units (m, N, N·m, N/m, K, rad) and in the solver's axes: x to the right, z down, rotations positive counter-clockwise on screen.

```ts
interface PlotModel {
  readonly nodes: readonly PlotNode[]
  readonly members: readonly PlotMember[]
  readonly loads: readonly PlotLoad[]
  readonly results?: PlotResults // only for a solved load case
}

interface PlotNode {
  readonly id: string
  readonly x: number
  readonly z: number
  readonly fixity: { readonly dx: boolean; readonly dz: boolean; readonly ry: boolean } // supported DOFs
  readonly angle: number // rotation of a turned support's axes, rad, clockwise on screen
}

interface PlotMember {
  readonly id: string
  readonly start: string // node ids
  readonly end: string
  readonly hinges: readonly [boolean, boolean]
}

interface PlotResults {
  readonly members: Readonly<Record<string, MemberResults>> // by member id
  readonly reactions: readonly PlotReaction[]
}

interface MemberResults {
  readonly N: Piecewise // normal force, tension positive
  readonly V: Piecewise // shear force
  readonly M: Piecewise // bending moment, positive with tension on the local +z side
  readonly u: Piecewise // displacement along local x
  readonly w: Piecewise // displacement along local z
}

interface PlotReaction {
  readonly node: string
  readonly dof: 'dx' | 'dz' | 'ry'
  readonly value: number // force on the structure along the node's axis, N (N·m for ry)
}
```

A load is one of seven kinds, told apart by `kind`:

| `kind` | Fields | Is |
| --- | --- | --- |
| `'nodalForce'` | `node`, `fx`, `fz` | a force at a node, global components, N |
| `'nodalMoment'` | `node`, `my` | a moment at a node, N·m |
| `'distributed'` | `member`, `start`, `end`, `local` | a linearly varying line load, `{ fx, fz }` at each end, N/m; uniform when equal |
| `'pointForce'` | `member`, `at`, `fx`, `fz`, `local` | a force `at` metres from the member's start |
| `'pointMoment'` | `member`, `at`, `my` | a couple on a member |
| `'temperature'` | `member`, `uniform`, `gradient` | K: the centroid change, and bottom minus top |
| `'prescribed'` | `node`, `dx?`, `dz?`, `ry?` | a support displacement in the node's axes, m and rad |

`local` is `true` when the components are along the member's local x and z rather than the global axes.

## Piecewise polynomials

A member's result is a `Piecewise`: a list of pieces, each a polynomial over part of the member. A new piece starts wherever a point load or couple breaks the result.

```ts
interface Piece {
  readonly x0: number // m from the member's start
  readonly x1: number
  readonly c: readonly number[] // value = Σ c[k]·sᵏ, with s = (x − x0)/(x1 − x0)
}
type Piecewise = readonly Piece[]
```

N, V and M are at most cubic, and the deflection at most quintic, so a few coefficients hold the solver's answer exactly. The shear force of a 6 m beam with 20 kN at 2 m is two constant pieces:

```json
[{ "x0": 0, "x1": 2, "c": [13333.33] }, { "x0": 2, "x1": 6, "c": [-6666.67] }]
```

## Reading values yourself {#reading-values-yourself}

The functions that draw the diagrams also read them, exactly and without sampling:

```ts
import { extremes, innerBreaks, modelFromSolver, valueAt } from '@edubeam/plot'

// 6 m simply supported, 20 kN at 2 m from A, shear-rigid IPE 200
const model = modelFromSolver(solver)
const { V, M, w } = model.results!.members['1']

innerBreaks(V) // [2]: the pieces meet at the load
valueAt(V, 2, 'left') // 13333.3 N, just before the load
valueAt(V, 2, 'right') // -6666.7 N, just after it
extremes(M) // max 26666.7 N·m at x = 2
extremes(w) // max 0.018973 m at x = 2.734
```

`extremes` returns `{ max, min }`, each `{ x, value, side }`, or `null` for an empty list. The largest deflection is not under the load: it is at $x = L - \sqrt{(L^2 - a^2)/3} = 2.734$ m, and $P\,a\,(L^2 - a^2)^{3/2}/9\sqrt{3}\,EIL = 18.97$ mm, as the formula for an off-centre load gives.

This is how the [exercise generator](/plot/exercises#the-generator) finds the extreme moments for its answer key. The [Functions](/plot/functions#piecewise-polynomials) page lists the rest: slopes, extremes inside a piece, degrees and Bézier curves.

## Ship it as JSON

`JSON.stringify(model)` is all it takes, and `JSON.parse` gives back a model that draws exactly as the solver did. A portal frame with a line load and a point load is under 2 kB. See [Embedding](/plot/embedding#ship-the-drawing-not-the-solver). A model also feeds [`structureSvg`](/plot/functions#a-standalone-svg-file), which writes it as an SVG file.
