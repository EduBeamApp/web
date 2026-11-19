---
title: Température et tassements
description: "Chargez les barres de @edubeam/fem par une variation et une différence de température, imposez un déplacement aux appuis, avec des exemples vérifiés."
order: 7
source: site
---

# Température et tassements {#temperature-and-settlements}

Deux charges qui ne sont pas des forces : une barre qui voudrait changer de longueur ou de courbure, et un appui qui se déplace. Toutes deux ne créent d’efforts internes que là où la structure les empêche, ce qui en fait de bons exemples pour les structures hyperstatiques. La théorie de ces deux charges est exposée dans la section [Charges d’élément](/fr/elements/beam#element-loads) du manuel de l’application.

## Température {#temperature}

```ts
lc.createBeamTemperatureLoad(member, [dTc, dTb, dTt])
```

| Valeur | Signification | Effet sur une barre libre |
| --- | --- | --- |
| `dTc` | variation au centre de gravité, K | s’allonge de $\alpha\,\Delta T_c\,L$ |
| `dTb` | variation à la fibre inférieure (côté +z local), K | avec `dTt`, prend une courbure $\kappa = \alpha\,(\Delta T_b - \Delta T_t)/h$ |
| `dTt` | variation à la fibre supérieure, K | |

Seule la différence `dTb - dTt` fléchit la barre : `[30, 20, 0]` et `[30, 10, -10]` sont donc la même charge. Cette charge a besoin du `alpha` du matériau et du `h` de la section ; sans `h`, les moments valent `NaN`.

Une poutre bi-encastrée ne peut ni s’allonger ni se courber : elle est donc comprimée et fléchie à la place, avec $N = -EA\,\alpha\,\Delta T_c$ et $M = -EI\,\alpha\,(\Delta T_b - \Delta T_t)/h$.

```ts [temperature.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial(1, { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [6, 0, 0], fixed)
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

// Centre de gravité 30 K plus chaud, fibre inférieure 20 K plus chaude que la fibre supérieure
lc.createBeamTemperatureLoad(1, [30, 20, 0])
solver.solve()

beam.computeNormalForceAt(lc, 3) // -215460 N : EA · 12e-6 · 30
beam.computeBendingMomentAt(lc, 3) // -4896.4 N·m : EI · 12e-6 · 20 / 0.2
```

Avec l’IPE 200, $EA = 598{,}5$ MN et $EI = 4{,}0803$ MNm². Une fibre inférieure plus chaude fait se relever les extrémités d’une poutre libre ; l’encastrement la fléchit donc dans l’autre sens : un moment négatif, fibre supérieure tendue.

::model-figure{caption="Une poutre bi-encastrée, 30 K plus chaude au centre de gravité et 20 K plus chaude en fibre inférieure qu’en fibre supérieure"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 30, bottom: 20, top: 0 } }
results: [M, N]
show: [nodeLabels]
material: { e: 210e9, alpha: 12e-6 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

Sur une poutre sur deux appuis, la même charge ne crée aucun effort interne, seulement des déplacements : l’appui simple glisse vers l’extérieur de $\alpha\,\Delta T_c\,L = 2{,}16$ mm et la flèche à mi-portée vaut $\kappa L^2/8 = 5{,}4$ mm.

## Déplacements imposés {#prescribed-displacements}

```ts
lc.createPrescribedDisplacement(node, { [DofID.Dz]: 0.01 })
```

Cette méthode déplace un appui d’une valeur donnée : en mètres pour `Dx` et `Dz`, en radians pour `Ry`, dans les axes propres du nœud. Le DDL doit être bloqué par l’appui du nœud ; sur un DDL libre, la valeur est ignorée sans avertissement.

Une poutre encastrée-appuyée dont l’appui simple tasse de 10 mm, dans un nouveau solveur avec le matériau et la section de l’exemple de température :

```ts
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // encastrement
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // appui simple
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

lc.createPrescribedDisplacement('B', { [DofID.Dz]: 0.01 }) // 10 mm vers le bas
solver.solve()

domain.getNode('B').getReactions(lc).values // [566.7] N : 3EIw/L³
beam.computeBendingMomentAt(lc, 0) // -3400.2 N·m en A : 3EIw/L²
```

L’appui simple doit tirer la poutre vers le bas pour qu’elle le suive : sa réaction est donc positive (selon +z) : $3EIw/L^3 = 3 \cdot 4{,}0803 \times 10^6 \cdot 0{,}01 / 216 = 566{,}7$ N.

::model-figure{caption="L’appui simple d’une poutre encastrée-appuyée tasse de 10 mm : −3,4 kNm à l’encastrement"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

La façon dont l’application dessine ces deux charges est décrite dans [Charges](/fr/essentials/loads).
