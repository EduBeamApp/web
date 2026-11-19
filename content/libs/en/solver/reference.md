---
title: API reference
description: "Every class, method and argument of @edubeam/fem 0.3, with units, defaults and the shape of what each returns."
order: 16
group: Reference
source: site
---

# API reference

What `@edubeam/fem` 0.3 exports, grouped by what you use it for. Units are SI throughout: m, N, N·m, N/m, Pa, K and rad. Labels (`LabelType`) are `string | number`, stored as strings. Methods not listed here are internal: they are public in TypeScript only because the solver's own classes call them.

## Exports

| Export | Kind | Section |
| --- | --- | --- |
| `LinearStaticSolver` | class | [Analyses](#analyses) |
| `Solver` | abstract class | [Analyses](#analyses) |
| `Domain` | class | [Domain](#domain) |
| `Node` | class | [Node](#node) |
| `Beam2D`, `Element` | classes | [Elements](#elements) |
| `Material`, `CrossSection` | classes | [Materials and sections](#materials-and-sections) |
| `LoadCase` | class | [Loads](#loads) |
| `NodalLoad`, `BeamConcentratedLoad`, `BeamElementUniformEdgeLoad`, `BeamElementTrapezoidalEdgeLoad`, `BeamTemperatureLoad`, `PrescribedDisplacement`, `Load`, `BeamElementLoad` | classes | [Loads](#loads) |
| `DofID` | enum | [DofID](#dofid) |
| `LabelType`, `EnumDictionary`, `MaterialParameters`, `CrossSectionParameters` | types | |

## Analyses

### `LinearStaticSolver`

```ts
const solver = new LinearStaticSolver()
```

| Member | Type | Description |
| --- | --- | --- |
| `domain` | `Domain` | The model |
| `loadCases` | `LoadCase[]` | Starts with one case, `'DefaultLC'`. Push more with `new LoadCase(label, solver.domain)`: [Load cases](/solver/load-cases). |
| `solve()` | `void` | Numbers the equations if needed, assembles and solves every load case. May throw on a [mechanism](/solver/solving#when-solving-fails), but does not always. Silent from 0.3.1; 0.3.0 logged its time. |
| `codeNumberGenerated` | `boolean` | Set it to `false` after adding or removing nodes or members, or changing supports: [why](/solver/solving#solving-again-after-a-change) |
| `neq`, `pneq` | `number` | Numbers of free and of supported DOFs, after a solve |
| `k` | mathjs `Matrix` | The assembled global stiffness matrix, after a solve |
| `getNodeDofIDs(label)` | `number[]` | The DOFs a node has, after a solve |

`EigenValueDynamicSolver` exists in the source but is not exported.

## Domain

`solver.domain` holds the model in four `Map`s keyed by the label as a string: `nodes`, `elements`, `materials`, `crossSections`. There are no remove methods: `domain.nodes.delete(label)` and `domain.elements.delete(label)` remove a node or a member, followed by [renumbering](/solver/solving#solving-again-after-a-change).

| Method | Returns | Description |
| --- | --- | --- |
| `createNode(label, coords?, bcs?)` | `Node` | `coords` `[x, y, z]` in m (default `[0, 0, 0]`), `bcs` the supported `DofID`s (default none) |
| `createBeam2D(label, nodes, mat, cs, hinges?)` | `Beam2D` | `nodes` `[first, second]`, `hinges` `[atFirst, atSecond]` (default `[false, false]`) |
| `createMaterial(label, params?)` | `Material` | See [Materials and sections](#materials-and-sections) |
| `createCrossSection(label, params?)` | `CrossSection` | See [Materials and sections](#materials-and-sections) |
| `getNode(label)`, `getElement(label)`, `getMaterial(label)`, `getCS(label)` | the object | Throws a `RangeError` for an unknown label. `getElement` is typed `Element`: write `as Beam2D` to read results. |

Creating an object with a label already in use replaces the old one.

## Node

| Member | Type | Description |
| --- | --- | --- |
| `label` | `string` | |
| `coords` | `number[]` | `[x, y, z]`, m. Change it to move the node. |
| `bcs` | `Set<DofID>` | Supported DOFs. Replace it to change the support. |
| `lcs` | `number[][] \| undefined` | The node's turned axes, if any |
| `updateLcs({ locx, locy }?)` | `void` | Turns the node's axes: `locx` its x axis in global components, `locy` `[0, 1, 0]`. No argument resets them. |
| `hasLcs()` | `boolean` | Whether the axes are turned |
| `getUnknowns(lc, dofs)` | `Matrix`, or a `number` for one DOF | Displacements (m) and rotations (rad), in the node's axes |
| `getReactions(lc, global?)` | `{ dofs, values }` | Reactions at the supported DOFs, in the order of `bcs`: N, N·m. `values` is a mathjs `Matrix` for several, a one-element array for one, `[]` for a free node. With `global` `true` on a turned node: all three DOFs in global axes, `dofs` `[0, 2, 4]`, `values` an array with 0 where nothing is held. [Reading them](/solver/results#reactions). |

## Elements

### `Beam2D`

A two-node Timoshenko beam in the x–z plane, three DOFs per node (`Dx`, `Dz`, `Ry`). `x` is in metres from the first node; `n` is a number of segments, giving n + 1 points.

| Member | Returns | Description |
| --- | --- | --- |
| `label`, `nodes`, `mat`, `cs` | `string`, `string[]`, `string`, `string` | |
| `hinges` | `[boolean, boolean]` | Moment releases at the first and second node |
| `computeNormalForceAt(lc, x)` | `number` | N, tension positive |
| `computeShearForceAt(lc, x)` | `number` | V, positive where M grows along local x |
| `computeBendingMomentAt(lc, x)` | `number` | M, positive with tension on the local +z side |
| `computeNormalForce(lc, n)` | `{ x, N }` | N at n + 1 points |
| `computeShearForce(lc, n)` | `{ x, V }` | V at n + 1 points |
| `computeBendingMoment(lc, n)` | `{ x, M }` | M at n + 1 points |
| `computeLocalDefl(lc, n)` | `{ u, w }` | Displacements along and across the member, local axes, m |
| `computeGlobalDefl(lc, n)` | `{ u, w }` | The same in global x and z |
| `computeEndForces(lc)` | `Matrix` | `[X12, Z12, M12, X21, Z21, M21]`, the forces the nodes put on the member, local axes |
| `computeEndDisplacement(lc)` | `Matrix` | End displacements in local axes, hinge rotations included |
| `computeGeo()` | `{ l, dx, dz }` | Length and projections, m |
| `computeT()` | `Matrix` | 6 × 6 transformation, global to local |
| `computeLocalStiffnessMtrx()` | `{ answer }` | `answer`: 6 × 6 local stiffness, hinges condensed |
| `computeStiffness()` | `Matrix` | 6 × 6 global stiffness |
| `computeShearFactor()` | `number` | $\Phi = 12EI_y/kGAL^2$ |
| `getMaterial()`, `getCS()` | `Material`, `CrossSection` | |

At a point load, the `…At` methods return the value just past it. `Element` is the abstract base class of `Beam2D`; it is the type `domain.elements` and `getElement` use.

## Materials and sections

| `MaterialParameters` | Unit | Default | Used for |
| --- | --- | --- | --- |
| `e` | Pa | 1 | stiffness |
| `g` | Pa | 1 | shear stiffness |
| `alpha` | 1/K | 1 | temperature loads |
| `d` | kg/m³ | 1 | nothing in statics |

| `CrossSectionParameters` | Unit | Default | Used for |
| --- | --- | --- | --- |
| `a` | m² | none, required | axial and shear stiffness |
| `iy` | m⁴ | none, required | bending stiffness |
| `k` | – | none, required | shear stiffness $kGA$; `1e32` for none |
| `h` | m | none | temperature gradients (`NaN` without it) |
| `iz`, `dyz`, `j` | m⁴ | none | not used by `Beam2D` |

A missing material parameter is 1, not a typical value; a missing `a`, `iy` or `k` makes every result `NaN`. Neither throws. Both classes have a `change(params)` method that sets the parameters given, and keep them as properties of the same names.

## Loads

### `LoadCase`

| Method | Returns | Values |
| --- | --- | --- |
| `createNodalLoad(node, values, lcs?)` | `NodalLoad` | `{ [DofID.Dx]: N, [DofID.Dz]: N, [DofID.Ry]: N·m }`; `lcs` (default `false`) `true`: in the node's turned axes |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | `BeamElementUniformEdgeLoad` | N/m over the whole member |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | `BeamElementTrapezoidalEdgeLoad` | N/m at the first and second node, linear between |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | `BeamConcentratedLoad` | N, N, N·m, at `a` m from the first node |
| `createBeamTemperatureLoad(el, [dTc, dTb, dTt])` | `BeamTemperatureLoad` | K: centroid, bottom fibre, top fibre |
| `createPrescribedDisplacement(node, values)` | `PrescribedDisplacement` | `{ [DofID.Dz]: m, … }` on supported DOFs, in the node's axes; ignored on free DOFs |

For member loads, `lcs` `true` means local axes (x along the member, z across it), `false` global axes. Line loads are per metre of the member's length. [Loads](/solver/loads) has examples.

| Member | Type | Description |
| --- | --- | --- |
| `label` | `string` | |
| `nodalLoadList` | `NodalLoad[]` | |
| `elementLoadList` | `BeamElementLoad[]` | Member and temperature loads |
| `prescribedBC` | `PrescribedDisplacement[]` | |
| `solved` | `boolean` | `true` after a successful solve |
| `getElementLoadsOnElement(el)` | `BeamElementLoad[]` | The loads on one member |

The load objects keep their values in public properties, which you can change before solving again: `values` (and `lcs`) on `NodalLoad`, `BeamElementUniformEdgeLoad`, `BeamConcentratedLoad` and `BeamTemperatureLoad`; `startValues` and `endValues` on `BeamElementTrapezoidalEdgeLoad`; `prescribedValues` on `PrescribedDisplacement`. Each has a `target`, the label it acts on.

## DofID

| Name | Value | Used by `Beam2D` |
| --- | --- | --- |
| `Dx` | 0 | yes |
| `Dy` | 1 | no |
| `Dz` | 2 | yes |
| `Rx` | 3 | no |
| `Ry` | 4 | yes |
| `Rz` | 5 | no |

## Results

Results are read from a `Beam2D` (internal forces, deflections, end forces) and from a `Node` (displacements, reactions), always for a given `LoadCase`, after `solve()`: see the two tables above, and [Reading results](/solver/results) for examples and the signs. In short:

| To get | Call |
| --- | --- |
| Reactions, N and N·m | `node.getReactions(lc)` |
| Displacements, m, and rotations, rad | `node.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])` |
| N, V or M at a point, N and N·m | `beam.computeNormalForceAt(lc, x)`, `computeShearForceAt`, `computeBendingMomentAt` |
| N, V or M along a member | `beam.computeNormalForce(lc, n)`, `computeShearForce`, `computeBendingMoment` |
| Deflected shape, m | `beam.computeLocalDefl(lc, n)`, `computeGlobalDefl` |
| End forces, N and N·m | `beam.computeEndForces(lc)` |
| A figure of it all | `StructurePlot` or `structureSvg` from [@edubeam/plot](/solver/drawing) |
