---
title: Cas de charge
description: "Calculez en une fois plusieurs cas de charge d’un modèle @edubeam/fem et combinez leurs résultats par superposition en combinaisons de charges et en enveloppes."
order: 8
source: site
---

# Cas de charge {#load-cases}

Un cas de charge est un ensemble de charges calculées ensemble. Le solveur démarre avec un cas ; ajoutez-en d’autres, et un seul `solve()` les calcule tous avec une seule matrice de rigidité. Le calcul est linéaire : les résultats de différents cas peuvent être pondérés et additionnés, et une combinaison de charges n’est rien d’autre que cela.

## Ajouter un cas de charge {#add-a-load-case}

```ts [load-cases.ts]
import { DofID, LinearStaticSolver, LoadCase } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const dead = solver.loadCases[0] // celui avec lequel démarre tout solveur
const live = new LoadCase('live', domain)
solver.loadCases.push(live)

dead.createBeamElementUniformEdgeLoad(1, [0, 10e3], true) // 10 kN/m
live.createBeamConcentratedLoad(1, [0, 20e3, 0, 3], true) // 20 kN à mi-portée
solver.solve() // calcule tous les cas de charge

console.log(beam.computeBendingMomentAt(dead, 3)) // qL²/8
console.log(beam.computeBendingMomentAt(live, 3)) // PL/4
```

```text [Sortie]
45000
30000
```

Chaque méthode de résultat prend le cas de charge qu’elle doit lire. Le premier cas porte l’étiquette `'DefaultLC'` ; les étiquettes ne sont que des noms, et le solveur distingue les cas par l’objet lui-même.

## Les combiner {#combine-them}

Multipliez le résultat de chaque cas par son coefficient et additionnez. Pour l’état limite ultime de l’Eurocode, $1{,}35\,G + 1{,}5\,Q$, à mi-portée :

```ts
1.35 * beam.computeBendingMomentAt(dead, 3) +
  1.5 * beam.computeBendingMomentAt(live, 3) // 105750 N·m
```

Il en va de même pour les réactions, les déplacements et tous les autres résultats. Sur toute la longueur d’une barre, combinez point par point : les tableaux de `computeBendingMoment(lc, n)` utilisent les mêmes `x` pour tous les cas.

```ts
const n = 60
const g = beam.computeBendingMoment(dead, n).M
const q = beam.computeBendingMoment(live, n).M
const uls = g.map((m, i) => 1.35 * m + 1.5 * q[i])
Math.max(...uls) // 105750 N·m, en x = 3
```

Une enveloppe, c’est-à-dire la plus grande et la plus petite valeur sur plusieurs combinaisons, s’obtient par un `Math.max` et un `Math.min` point par point sur de tels tableaux. Pour une charge mobile, calculez plutôt une fois par position de la charge : c’est ce que fait l’[exemple de la ligne d’influence](/fr/solver/scripts#an-influence-line-as-csv).

## Dans l’application EduBeam {#in-the-edubeam-app}

L’application calcule un seul cas de charge à la fois : les combinaisons sont donc un domaine où la bibliothèque va plus loin. Un modèle à plusieurs cas peut tout de même être [dessiné](/fr/solver/drawing) cas par cas : le `StructurePlot` de @edubeam/plot prend un indice `loadCase` dans `solver.loadCases`.
