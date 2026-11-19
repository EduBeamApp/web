---
title: Charges nodales et charges sur barre
description: "Appliquez avec @edubeam/fem forces et moments nodaux, charges sur barre uniformes, trapézoïdales et ponctuelles, en axes globaux ou locaux, puis modifiez-les."
order: 6
group: Charges
source: site
---

# Charges nodales et charges sur barre {#nodal-and-member-loads}

Les charges appartiennent à un cas de charge. Le solveur démarre avec un cas, `solver.loadCases[0]`, et chacune de ses méthodes `create…` ajoute une charge et la renvoie. Pour plusieurs cas et leurs combinaisons, voir [Cas de charge](/fr/solver/load-cases).

Les valeurs s’expriment en N, N/m et N·m et suivent les [axes](/fr/solver/conventions#axes) : +z est dirigé vers le bas, un moment positif tourne dans le sens trigonométrique.

## Une poutre avec tous les types de charges {#a-beam-with-every-kind}

Une poutre de 8 m sur une articulation et un appui simple, avec une charge linéique croissant de 4 à 10 kN/m, une charge ponctuelle de 20 kN, un couple de 10 kNm et une force horizontale sur l’appui simple :

```ts [loads.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // articulation
domain.createNode('B', [8, 0, 0], [DofID.Dz]) // appui simple
domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
// 4 kN/m en A, croissant jusqu'à 10 kN/m en B, vers le bas
lc.createBeamElementTrapezoidalEdgeLoad(1, [0, 4e3], [0, 10e3], false)
// [fx, fz, my, a] : 20 kN vers le bas, à 2 m de A
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], false)
// un couple de 10 kNm dans le sens trigonométrique, à 6 m de A
lc.createBeamConcentratedLoad(1, [0, 0, 10e3, 6], false)
// 5 kN vers la droite en B
lc.createNodalLoad('B', { [DofID.Dx]: 5e3 })
solver.solve()

// getReactions renvoie une Matrix mathjs ou un tableau : on le convertit en tableau
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

console.log(list(domain.getNode('A').getReactions(lc).values))
console.log(list(domain.getNode('B').getReactions(lc).values))
```

```text [Sortie]
[ -5000, -40250 ]
[ -35750 ]
```

À la main : la charge linéique vaut 56 kN et agit à 4,571 m de A ; l’équilibre des moments par rapport à A donne $8R_B = 56 \cdot 4{,}571 + 20 \cdot 2 - 10 = 286$, soit $R_B = 35{,}75$ kN vers le haut, et $R_A = 76 - 35{,}75 = 40{,}25$ kN vers le haut. L’articulation retient aussi les 5 kN, si bien que toute la poutre est tendue par un effort normal de 5 kN.

::model-figure{caption="Les mêmes charges. La figure place le couple sur un nœud C à 6 m, ce qui donne les mêmes résultats."}
---
nodes: { A: [0, 0], C: [6, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: [4, 8.5] }
  - { member: 2, qz: [8.5, 10] }
  - { member: 1, pz: 20, at: 2 }
  - { node: C, my: 10 }
  - { node: B, fx: 5 }
results: [M]
show: [nodeLabels]
labels: horizontal
---
::

## Charges nodales {#nodal-loads}

```ts
lc.createNodalLoad(node, { [DofID.Dx]: fx, [DofID.Dz]: fz, [DofID.Ry]: my }, lcs)
```

Ne donnez que les composantes dont vous avez besoin. Les valeurs sont en axes globaux ou, avec `lcs` à `true`, dans les axes propres du nœud, pour un nœud tourné avec [`updateLcs`](/fr/solver/nodes-supports#inclined-supports). Une force appliquée sur un DDL bloqué par l’appui passe directement dans la réaction, sans rien faire fléchir.

## Charges sur barre {#member-loads}

| Méthode | Valeurs | Charge |
| --- | --- | --- |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | N/m | uniforme sur toute la barre |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | N/m | linéaire, du premier nœud au second |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | N, N·m, m | une force et un couple, à `a` mètres du premier nœud |

Les charges linéiques couvrent toujours toute la barre. Pour une charge sur une partie de la travée, coupez la barre par un nœud là où la charge commence : un nœud supplémentaire ne change aucun résultat. Une charge ponctuelle ou un couple peut se placer n’importe où le long de la barre.

### Axes globaux ou locaux {#global-or-local-axes}

Le dernier argument, `lcs`, indique dans quels axes sont données les composantes :

- `false` : x et z globaux. `fz` agit verticalement, quelle que soit l’inclinaison de la barre.
- `true` : x local (le long de la barre) et z local (perpendiculaire à la barre). `fz` agit perpendiculairement à la barre.

Sur une barre horizontale dessinée de gauche à droite, les deux coïncident ; dessinée de droite à gauche, le `fz` local est dirigé vers le haut.

::callout{type="info" title="Les charges linéiques sont données par mètre de barre"}
Dans les deux cas, elles agissent par mètre de longueur propre de la barre. Sur un arbalétrier de 5 m de long qui franchit 4 m en plan, `[0, 10e3]` en axes globaux totalise 50 kN. Une charge de neige de 10 kN/m mesurée en projection horizontale vaut $10 \cdot 4/5 = 8$ kN/m le long de l’arbalétrier : donnez `[0, 8e3]`.
::

## Modifier ou supprimer une charge {#change-or-remove-a-load}

Chaque méthode `create…` renvoie la charge. Modifiez ses valeurs et relancez le calcul :

```ts
const q = lc.createBeamElementUniformEdgeLoad(1, [0, 10e3], true)
solver.solve()
q.values = [0, 20e3] // une charge deux fois plus grande
solver.solve()
```

Les charges sont rangées dans de simples tableaux, `lc.nodalLoadList` et `lc.elementLoadList` (charges sur barre et charges thermiques) : `lc.elementLoadList.splice(index, 1)` en supprime donc une. Les noms des propriétés de chaque charge figurent dans la [référence](/fr/solver/reference#loads).

Les variations de température et les tassements d’appui sont aussi des charges : voir [Température et tassements](/fr/solver/temperature-settlements).
