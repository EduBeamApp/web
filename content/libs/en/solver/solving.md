---
title: Solving
description: "What solve() in @edubeam/fem does, when to number the equations again after changing a model, how to recognise a mechanism, and how large a model it handles."
order: 9
group: Solving and results
source: site
---

# Solving

```ts
solver.solve()
```

`solve()` numbers the equations, assembles the global stiffness matrix and the load vectors of every load case, and solves for the displacements and the reactions. After it, every [result](/solver/results) can be read; before it, reading one throws a `TypeError`. The steps are the ones of [How EduBeam solves](/elements/analysis) in the theory manual.

The solution is exact for the linear model: the deflected shape and the internal forces along each member come from closed-form solutions of the Timoshenko beam, so there is no mesh to refine and no need to split members for accurate diagrams.

`solve()` writes nothing to the console from 0.3.1 on; 0.3.0 printed a line such as `Solution took 9 [ms]` on every call.

## Solving again after a change

Changing numbers in a model needs only another `solve()`. Changing which equations there are needs one more line first:

```ts
domain.createNode('C', [10, 0, 0], [DofID.Dz])
domain.createBeam2D(2, ['B', 'C'], 1, 1)
solver.codeNumberGenerated = false // the DOFs changed: number them again
solver.solve()
```

| Change | Then |
| --- | --- |
| Load values, new or removed loads | `solve()` |
| Node coordinates, materials, sections, hinges | `solve()` |
| Adding nodes or members | `codeNumberGenerated = false`, then `solve()` |
| Removing nodes or members: `domain.nodes.delete(label)`, `domain.elements.delete(label)` | `codeNumberGenerated = false`, then `solve()` |
| Changing a node's supports, `node.bcs` | `codeNumberGenerated = false`, then `solve()` |

Forget it after adding a node, and `solve()` throws a `TypeError`. Forget it after changing a support, and it **silently** solves the old supports. When in doubt, reset it: numbering costs next to nothing. Removing a member also means removing its loads from `lc.elementLoadList`, or `solve()` throws a `RangeError` for the missing member.

For many variants of one model, such as a parameter study, a fresh solver for each is simpler and just as fast: see the [influence line recipe](/solver/scripts#an-influence-line-as-csv).

## When solving fails

A structure that can move without deforming, a mechanism, has a singular stiffness matrix. Sometimes `solve()` notices and throws:

```text
Error: Linear system cannot be solved since matrix is singular
```

Often it does not: round-off makes the matrix look solvable, and you get displacements of $10^{12}$ m, or reasonable-looking numbers for a structure that is free to slide. A beam on two rollers, for one, solves without complaint as long as nothing pushes it sideways. So check the supports yourself, and treat huge displacements as the sign of a mechanism.

Typical causes:

- too few supports, such as a beam on two rollers;
- supports that cannot hold the structure: all parallel, or all pointing at one point;
- one hinge too many, such as three in a row;
- a moment applied to a joint where every member end is hinged.

The message does not say where the problem is. The EduBeam app checks for mechanisms before it solves, and finds and animates the motion; building the same model there is often the quickest way to see it. [Troubleshooting](/reference/troubleshooting) lists the usual causes.

A missing node, material or section throws a `RangeError` that names it. Missing section parameters do not throw at all: every result is `NaN`. See [Materials and sections](/solver/materials-sections#cross-section).

## Model size

The solver uses dense matrices, built for teaching-sized models. On a laptop, in Node, a straight line of members solves in about:

| Members | DOFs | Time |
| --- | --- | --- |
| 50 | 150 | 0.1 s |
| 100 | 300 | 0.2 s |
| 200 | 600 | 1 s |
| 400 | 1200 | 10 s |

Each doubling of the model costs six to nine times as long.

Every exercise, frame and truss of a structural analysis course fits easily. It is not meant for models of thousands of members.

## No other analyses

This version solves linear statics only. The source contains an eigenvalue solver for natural frequencies, but it is not part of the published package: `EigenValueDynamicSolver` cannot be imported from `@edubeam/fem`.
