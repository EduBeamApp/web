---
title: Materials and sections
description: "The material and cross-section parameters @edubeam/fem uses, which ones each analysis needs, what happens when one is missing, and how to switch shear deformation off."
order: 4
source: site
---

# Materials and sections

Members take their stiffness from a material and a cross section, each created once and referred to by its label.

```ts
domain.createMaterial('steel', { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection('IPE200', {
  a: 28.5e-4, // m²
  iy: 1943e-8, // m⁴
  h: 0.2, // m
  k: 5 / 6,
})
```

## Material

| Parameter | Meaning | Unit | Needed for |
| --- | --- | --- | --- |
| `e` | Young's modulus $E$ | Pa | always |
| `g` | Shear modulus $G$ | Pa | always, unless `k` is huge (no shear deformation) |
| `alpha` | Thermal expansion coefficient $\alpha$ | 1/K | temperature loads |
| `d` | Density $\rho$ | kg/m³ | nothing in a static analysis |

A parameter you leave out is **1**, not a typical value, and nothing warns you. Forget `g` on the beam of Getting started and its deflection is 22 700 km.

## Cross section {#cross-section}

| Parameter | Meaning | Unit | Needed for |
| --- | --- | --- | --- |
| `a` | Area $A$ | m² | always: axial and shear stiffness |
| `iy` | Second moment of area $I_y$ | m⁴ | always: bending stiffness |
| `k` | Shear coefficient $k$ | – | always: shear stiffness $kGA$ |
| `h` | Depth $h$ | m | temperature gradients |
| `iz`, `dyz`, `j` | $I_z$, $I_{yz}$, torsion constant | m⁴ | nothing in a plane model |

A cross section has no defaults. Leave out `a`, `iy` or `k` and every result is `NaN`; leave out `h` and a temperature gradient gives `NaN`. Neither throws an error, so a `NaN` result almost always means a missing parameter.

## Shear deformation

The member is a Timoshenko beam: it deforms in shear as well as in bending. How much depends on

$$
\Phi = \frac{12\,EI_y}{k\,G\,A\,L^2},
$$

which `beam.computeShearFactor()` returns. For slender members $\Phi$ is tiny, and deflections grow by a fraction of a percent. For short, deep members it matters.

For the Euler–Bernoulli beam of textbook tables, make the shear stiffness practically infinite with a huge shear coefficient, as the EduBeam app's examples do:

```ts
domain.createCrossSection('IPE200-EB', { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
```

The recipes on these pages do this, so their numbers match the formulas exactly. For a real shear coefficient, $k = 5/6$ suits a rectangle. The [verification page](/guide/verification#shear-deformation) shows the size of the effect.

## Rigid in axial direction

A large area makes members practically inextensible, as hand calculations usually assume. A frame's internal forces depend on the area only slightly; a truss's displacements depend on it entirely. The internal forces of a statically determinate structure depend on no stiffness at all.

## Change them later {#change-them-later}

```ts
domain.getMaterial('steel').change({ e: 200e9 })
domain.getCS('IPE200').change({ iy: 2000e-8 })
solver.solve()
```

Each member reads its material and section when the solver assembles, so a new `solve()` is all it takes. Different members can use different sections: give each its own label.
