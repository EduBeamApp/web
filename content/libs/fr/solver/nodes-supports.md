---
title: Nœuds et appuis
description: "Créez les nœuds d’un modèle @edubeam/fem, bloquez leurs degrés de liberté, tournez les axes d’un appui simple incliné et modifiez les nœuds après un calcul."
order: 3
group: Modélisation
source: site
---

# Nœuds et appuis {#nodes-and-supports}

Les nœuds sont les points que relient les barres. Un appui n’est pas un objet à part : c’est la liste des degrés de liberté qu’un nœud a bloqués. Les extraits de cette page font partie d’un programme comme celui de [Premiers pas](/fr/solver/getting-started) et en utilisent les variables `solver`, `domain` et `lc`.

## Créer un nœud {#create-a-node}

```ts
domain.createNode(label, [x, y, z], bcs)
```

| Argument | Type | Signification |
| --- | --- | --- |
| `label` | `string \| number` | Son nom, stocké comme chaîne : `1` et `'1'` désignent le même nœud |
| `coords` | `number[]` | `[x, y, z]` en mètres, avec `y = 0`. z est dirigé vers le bas. |
| `bcs` | `DofID[]` | Les degrés de liberté que bloque l’appui. Omettez-le pour un nœud libre. |

La méthode renvoie le `Node` ; `domain.getNode(label)` le retrouve ensuite. Une étiquette déjà utilisée remplace l’ancien nœud.

```ts
import { DofID } from '@edubeam/fem'

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [0, 0, -4]) // libre : la tête d'un poteau de 4 m
```

## Appuis {#supports}

Chaque appui de l’application EduBeam correspond à un ensemble de DDL bloqués :

| Appui | `bcs` | Bloque |
| --- | --- | --- |
| Encastrement | `[DofID.Dx, DofID.Dz, DofID.Ry]` | tout |
| Rotule (appui articulé) | `[DofID.Dx, DofID.Dz]` | les deux déplacements, rotation libre |
| Appui simple | `[DofID.Dz]` | le déplacement vertical, roule selon x |
| Appui simple vertical | `[DofID.Dx]` | le déplacement horizontal, roule selon z |
| Glissière | `[DofID.Dz, DofID.Ry]` | le déplacement vertical et la rotation, glisse selon x |
| Glissière verticale | `[DofID.Dx, DofID.Ry]` | le déplacement horizontal et la rotation, glisse selon z |
| Rotation bloquée seule | `[DofID.Ry]` | la rotation |

L’ordre dans lequel vous les donnez est celui dans lequel les [réactions](/fr/solver/results#reactions) sont renvoyées. Une structure a besoin d’au moins trois DDL bloqués, disposés de sorte qu’elle ne puisse pas se déplacer comme un mécanisme : voir [Quand le calcul échoue](/fr/solver/solving#when-solving-fails).

Un DDL bloqué peut aussi être déplacé d’une valeur donnée, ce qui modélise un tassement d’appui : voir [Déplacements imposés](/fr/solver/temperature-settlements#prescribed-displacements).

## Appuis inclinés {#inclined-supports}

Un appui simple sur une pente retient le nœud perpendiculairement à la pente, et non verticalement. Tournez les axes du nœud avec `updateLcs` : ses `bcs` se rapportent alors aux axes tournés. Dans le programme de Premiers pas, créez plutôt B ainsi :

```ts
const b = domain.createNode('B', [6, 0, 0], [DofID.Dz]) // bloque son propre z
const a = (30 * Math.PI) / 180 // 30°, de x vers z : sens horaire à l'écran
b.updateLcs({ locx: [Math.cos(a), 0, Math.sin(a)], locy: [0, 1, 0] })
```

`locx` est l’axe x propre du nœud, exprimé comme vecteur en axes globaux, et `locy` son axe y, qui reste `[0, 1, 0]`. Dans l’application EduBeam, cet angle est l’*Angle du SCL nodal* du nœud, 30°.

Après `solve()`, B pousse perpendiculairement à la pente, et l’articulation en A reprend la composante horizontale :

```ts
b.getReactions(lc).values // [-41569] : N selon le z propre de B, 36 kN / cos 30°
b.getReactions(lc, true).values // [20785, -36000, 0] : selon x, selon z, moment
```

::model-figure{caption="Un appui simple tourné de 30° : sa réaction est perpendiculaire à la pente, et la poutre est tendue"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, N]
show: [nodeLabels]
---
::

La composante verticale vaut toujours $qL/2 = 36$ kN ; la composante horizontale, $36 \tan 30° = 20{,}8$ kN, tire la poutre à ses deux extrémités. Le moment ne change pas.

Sur un nœud tourné, déplacements et réactions sont donnés dans les axes propres du nœud, sauf si vous passez `true` pour les obtenir en axes globaux. Les charges nodales qui s’y appliquent sont globales, sauf indication contraire : voir [Charges nodales](/fr/solver/loads#nodal-loads). `node.updateLcs()` sans argument remet les axes dans leur position d’origine.

## Modifier un nœud {#change-a-node}

Un nœud est un simple objet : modifiez `node.coords` pour le déplacer, ou remplacez `node.bcs`, un `Set<DofID>`, pour changer son appui.

```ts
domain.getNode('B').coords = [8, 0, 0] // une portée plus longue : solve() suffit
domain.getNode('A').bcs = new Set(fixed) // un nouvel appui : renuméroter d'abord
solver.codeNumberGenerated = false
solver.solve()
```

Changer des appuis, ou ajouter et supprimer des nœuds, modifie les équations : sans `codeNumberGenerated = false`, le solveur **garde sans prévenir les anciens appuis**. [Recalculer après une modification](/fr/solver/solving#solving-again-after-a-change) indique quelles modifications l’exigent.
