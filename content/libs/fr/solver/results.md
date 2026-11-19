---
title: Lire les résultats
description: "Lisez sur un modèle @edubeam/fem calculé les réactions, les déplacements, les efforts internes le long d’une barre, la déformée, les efforts d’extrémité."
order: 10
source: site
---

# Lire les résultats {#reading-results}

Après `solve()`, les résultats se lisent sur les nœuds et sur les barres, pour un cas de charge donné. Tous les exemples de cette page lisent le même modèle : une poutre de 6 m sur deux appuis, un IPE 200 sans déformation d’effort tranchant, avec 20 kN à 2 m de A.

```ts [results.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 }) // sans déformation d'effort tranchant

const A = domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
const B = domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
const lc = solver.loadCases[0]
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], true)
solver.solve()
```

::model-figure{caption="20 kN à 2 m sur une portée de 6 m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M, w]
show: [nodeLabels]
---
::

## Où lire chaque résultat {#what-to-read-where}

| Résultat | Appel | Renvoie |
| --- | --- | --- |
| Réactions | `node.getReactions(lc)` | `{ dofs, values }` : N, N·m |
| Déplacements | `node.getUnknowns(lc, dofs)` | m, rad |
| N, V ou M en un point | `beam.computeBendingMomentAt(lc, x)` | un nombre : N, N·m |
| N, V ou M le long d’une barre | `beam.computeBendingMoment(lc, n)` | `{ x, M }`, n + 1 points |
| Déformée | `beam.computeLocalDefl(lc, n)` | `{ u, w }`, n + 1 points, m |
| Efforts d’extrémité | `beam.computeEndForces(lc)` | une matrice mathjs de 6 valeurs |

Pour N et V, les méthodes sont `computeNormalForceAt` et `computeShearForceAt`, `computeNormalForce` et `computeShearForce`, qui renvoient `{ x, N }` et `{ x, V }`. Les signes sont décrits dans [Unités et signes](/fr/solver/conventions#signs-of-the-results).

## Réactions {#reactions}

`getReactions` donne une réaction par DDL bloqué par l’appui : `dofs` les liste, dans l’ordre où ils ont été donnés à `createNode`, et `values` contient les réactions dans le même ordre. `values` est une **matrice mathjs** quand il y en a plusieurs, et un simple tableau quand il n’y en a qu’une ; une petite fonction utilitaire en fait un tableau dans tous les cas :

```ts
/** Convertit une Matrix mathjs, un tableau ou un nombre en simple tableau. */
const list = (v: unknown): number[] =>
  typeof v === 'number'
    ? [v]
    : Array.isArray(v)
      ? v
      : (v as { toArray(): number[] }).toArray()

A.getReactions(lc).dofs // [0, 2] : DofID.Dx, DofID.Dz
list(A.getReactions(lc).values) // [0, -13333.3]
list(B.getReactions(lc).values) // [-6666.7]
```

Pour prendre une réaction précise quel que soit l’ordre, cherchez son DDL : `list(values)[dofs.indexOf(DofID.Dz)]`, comme le fait l’[exemple de la poutre continue](/fr/solver/beams#a-continuous-beam).

Une réaction est la force que l’appui exerce sur la structure : −13 333 N selon z, ce sont 13,3 kN dirigés vers le haut, $P\,b/L = 20 \cdot 4/6$. Sur un nœud aux [axes tournés](/fr/solver/nodes-supports#inclined-supports), les réactions sont données dans ces axes ; `getReactions(lc, true)` les ramène en axes globaux et renvoie les trois DDL, avec 0 là où rien n’est bloqué. Un nœud sans appui donne `{ dofs: [], values: [] }`.

## Déplacements {#displacements}

`getUnknowns` lit n’importe quels DDL d’un nœud, avec ou sans appui :

```ts
list(A.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])) // [0, 0, -0.0108924]
```

A tourne de 0,010892 rad dans le sens horaire, $P\,b\,(L^2 - b^2)/6EIL$. Pour un seul DDL, `getUnknowns` renvoie un simple nombre, bien que TypeScript déclare une matrice : `list` gère aussi ce cas.

## Efforts internes le long d’une barre {#internal-forces-along-a-member}

Les méthodes `…At` donnent une valeur à `x` mètres du premier nœud de la barre :

```ts
beam.computeShearForceAt(lc, 1) // 13333.3 N
beam.computeShearForceAt(lc, 2) // -6666.7 N : au droit de la charge, la valeur juste après
beam.computeBendingMomentAt(lc, 2) // 26666.7 N·m : R_A · 2
```

Là où une charge ponctuelle crée un saut, la valeur exactement au droit de la charge est celle qui suit la charge. Pour lire la valeur qui la précède, demandez un point très légèrement avant, par exemple `x - 1e-9`.

Les méthodes à tableaux échantillonnent une barre en n + 1 points régulièrement espacés, extrémités comprises :

```ts
beam.computeBendingMoment(lc, 3)
// { x: [0, 2, 4, 6], M: [0, 26666.7, 13333.3, 0] }, aux erreurs d'arrondi près
```

Attendez-vous à des erreurs d’arrondi comme `-3.6e-12` là où la valeur exacte est 0 : formatez les nombres avec `toFixed` avant de les afficher. Pour obtenir la plus grande valeur le long d’une barre, prenez le maximum d’un échantillonnage fin, par exemple `computeBendingMoment(lc, 500)`, comme dans l’[exemple de la poutre continue](/fr/solver/beams#a-continuous-beam). Sous des charges réparties, M est un polynôme : son extremum exact se trouve là où V s’annule ; [@edubeam/plot](/fr/plot/model#reading-values-yourself) le trouve exactement.

## Déformée {#deflected-shape}

```ts
beam.computeLocalDefl(lc, 3)
// { u: [0, 0, 0, 0], w: [0, 0.0174279, 0.0152494, 0] }
```

`computeLocalDefl` donne les déplacements le long de la barre et perpendiculairement à elle, `u` et `w`, dans ses axes locaux ; `computeGlobalDefl` donne les mêmes points en x et z globaux. La flèche sous la charge, 17,43 mm, vaut $P\,a^2 b^2/3EIL$. La forme entre les nœuds est exacte, et non interpolée à partir des valeurs d’extrémité. Pour la dessiner, voir [Dessiner les résultats](/fr/solver/drawing).

## Efforts d’extrémité {#end-forces}

```ts
beam.computeEndForces(lc).toArray()
// [0, -13333.3, 0, 0, -6666.7, 0] : X12, Z12, M12, X21, Z21, M21
```

Ce sont les forces que les deux nœuds exercent sur la barre, dans ses axes locaux : les valeurs du tableau *Résultats par élément* de l’application, expliquées dans [Efforts d’extrémité](/fr/elements/conventions#end-forces-element-results-table).

## Des résultats à vérifier {#results-as-numbers-to-check}

Chaque valeur ci-dessus correspond à sa formule analytique. La page [Vérifier les résultats à la main](/fr/guide/verification) traite bien d’autres cas classiques des manuels, calculés par ce même solveur dans votre navigateur.
