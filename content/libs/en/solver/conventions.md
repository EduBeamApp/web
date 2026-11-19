---
title: Units and signs
description: "The units, axes, degrees of freedom and sign conventions of @edubeam/fem, and how a member's direction changes the sign of its results."
order: 2
source: site
---

# Units and signs

The solver has no unit system of its own: it computes with the numbers you give it. Give it SI and every result comes back in SI. The examples on these pages, and the EduBeam app, always do. The signs are the app's too; its theory manual explains them with figures in [Coordinate system and sign conventions](/elements/conventions).

## Units

| Quantity | Unit | Example |
| --- | --- | --- |
| Coordinates, lengths, positions along a member | m | `[6, 0, 0]` |
| Forces | N | `20e3` for 20 kN |
| Moments | N·m | `10e3` for 10 kNm |
| Line loads | N/m | `12e3` for 12 kN/m |
| Young's and shear modulus | Pa | `210e9` |
| Area | m² | `28.5e-4` for 28.5 cm² |
| Second moment of area | m⁴ | `1943e-8` for 1943 cm⁴ |
| Temperature change | K | `20` |
| Thermal expansion coefficient | 1/K | `12e-6` |
| Displacements, rotations | m, rad | `0.01` for 10 mm |

Any consistent set works, such as kN, m and kPa, which gives results in kN and kNm. SI saves you from checking.

## Axes

- **x** points right, **z points down**, and the model lies in the x–z plane. Coordinates are `[x, y, z]`, with `y = 0`.
- **y** points toward you, out of the screen. Rotations and moments are about y, so a positive one is **counter-clockwise** on screen.
- A member's **local x** runs from its first node to its second. Its **local z** is local x turned 90° clockwise on screen: on a member drawn left to right, it points down.

Because z points down, a gravity load is a positive `fz`, and the top of a 4 m column standing at $z = 0$ is at $z = -4$.

## Degrees of freedom

Every node of a `Beam2D` model has three degrees of freedom, named by the `DofID` enum:

| `DofID` | Value | Meaning |
| --- | --- | --- |
| `DofID.Dx` | 0 | Displacement along x |
| `DofID.Dz` | 2 | Displacement along z, down |
| `DofID.Ry` | 4 | Rotation about y, counter-clockwise |

`Dy`, `Rx` and `Rz` (1, 3, 5) exist in the enum but are not used by plane members.

## Signs of the results

| Result | Positive means | Read with |
| --- | --- | --- |
| Normal force N | tension | `computeNormalForceAt` |
| Bending moment M | tension on the local +z side: sagging, on a beam drawn left to right | `computeBendingMomentAt` |
| Shear force V | M grows along local x, $V = dM/dx$; on a beam drawn left to right it turns a piece clockwise: $+qL/2$ at the left support of a simply supported beam | `computeShearForceAt` |
| Deflection w | along local +z: down, on a beam drawn left to right | `computeLocalDefl` |
| Nodal displacement | along +x, +z (down), counter-clockwise | `node.getUnknowns` |
| Reaction | the force the support puts on the structure, along +x, +z (down), counter-clockwise | `node.getReactions` |
| End forces | the forces the nodes put on the member, in its local axes | `computeEndForces` |

So the pin of a beam loaded downward reports a reaction of −36 000 N along z: 36 kN pushing up.

## Positions along a member

Every `…At(lc, x)` method takes `x` in metres from the member's first node, not a fraction of its length. Point loads along a member are placed the same way.

## Member direction {#member-direction}

M and w are measured in the member's own axes, so the order of its two nodes matters. The 12 kN/m beam of [Getting started](/solver/getting-started), defined both ways with the load in global axes, `[0, 12e3], false`, so that it pushes down both times, and read with `computeBendingMomentAt(lc, 3)`, `computeLocalDefl(lc, 2).w[1]` and `computeShearForceAt`:

| Member | M at midspan | w at midspan | V at A |
| --- | --- | --- | --- |
| `['A', 'B']`, left to right | +54 000 N·m | +0.0499 m | +36 000 N, at `x = 0` |
| `['B', 'A']`, right to left | −54 000 N·m | −0.0499 m | +36 000 N, at `x = 6` |

Defined right to left, the local z points up, so the same sagging beam reports a negative moment and an upward deflection. N and V keep their sign at every point of the beam; only `x` runs from the other end. A load given in local axes (`true`) turns with the member: on the right-to-left beam, `[0, 12e3], true` pushes up.

::callout{type="tip" title="Define members the way you draw them"}
Beams left to right, columns bottom to top, and the signs read as in a textbook. For a column from bottom to top the local z points right, so tension on the right face is a positive moment. The [frame recipe](/solver/frames#things-to-notice) shows it.
::
