---
title: Barres et rotules
description: "Reliez les nœuds par des barres Beam2D, libérez les moments par des rotules d’extrémité, modélisez des treillis et lisez les matrices de rigidité et de passage."
order: 5
source: site
---

# Barres et rotules {#members-and-hinges}

Chaque barre est un `Beam2D` : une poutre de Timoshenko droite à deux nœuds, dans le plan x–z, qui reprend effort normal, effort tranchant et moment fléchissant. Des rotules à ses extrémités y libèrent le moment. Les extraits utilisent les variables `solver`, `domain` et `lc` d’un programme comme celui de [Premiers pas](/fr/solver/getting-started), avec son matériau `'steel'` et sa section `'IPE200'`.

## Créer une barre {#create-a-member}

```ts
domain.createBeam2D(label, [startNode, endNode], material, crossSection, hinges)
```

| Argument | Type | Signification |
| --- | --- | --- |
| `label` | `string \| number` | Son nom, stocké comme chaîne |
| `nodes` | `[label, label]` | Premier et second nœud. L’axe x local va du premier au second : voir [Sens de la barre](/fr/solver/conventions#member-direction). |
| `mat`, `cs` | `string \| number` | Étiquettes d’un matériau et d’une section |
| `hinges` | `[boolean, boolean]` | Une rotule au premier nœud, au second. Facultatif ; par défaut `[false, false]`, extrémités rigides. |

La méthode renvoie le `Beam2D` : conservez-le pour lire les résultats. `domain.getElement(label)` le retrouve aussi, mais typé comme `Element` générique : TypeScript exige alors un `as Beam2D` avant d’y lire des résultats.

Les barres qui se rejoignent en un nœud sans rotule y sont liées rigidement : elles tournent ensemble. Les nœuds, le matériau et la section peuvent être créés dans n’importe quel ordre, pourvu qu’ils existent tous au moment du calcul ; s’il en manque un, `solve()` lève une `RangeError` qui le nomme.

## Rotules d’extrémité {#end-hinges}

Une rotule appartient à une extrémité de barre, et non à un nœud. Ici, la barre 2 commence par une rotule en C : C transmet l’effort tranchant, mais aucun moment, de la travée C–D à la console A–C.

```ts [hinge.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry])
domain.createNode('C', [2, 0, 0])
domain.createNode('D', [6, 0, 0], [DofID.Dz])
const ac = domain.createBeam2D(1, ['A', 'C'], 'steel', 'IPE200')
const cd = domain.createBeam2D(2, ['C', 'D'], 'steel', 'IPE200', [true, false])

lc.createBeamElementUniformEdgeLoad(2, [0, 10e3], true)
solver.solve()

cd.computeBendingMomentAt(lc, 0) // 0 à la rotule
cd.computeBendingMomentAt(lc, 2) // 20000 N·m : qL²/8 de la travée de 4 m
ac.computeBendingMomentAt(lc, 0) // -40000 N·m : les 20 kN venant de C–D, à 2 m
```

::model-figure{caption="Une console qui porte une travée articulée : pas de moment en C"}
---
nodes: { A: [0, 0], C: [2, 0], D: [6, 0] }
supports: { A: fixed, D: roller }
members: [[A, C], { nodes: [C, D], hinges: [true, false] }]
loads:
  - { member: 2, qz: 10 }
results: [M, V]
show: [nodeLabels]
---
::

Là où plusieurs barres se rejoignent en un nœud articulé, il suffit d’une rotule à l’extrémité de chaque barre sauf une. Une rotule à chaque extrémité fonctionne aussi : rien ne fait alors tourner le nœud, et le solveur indique une rotation nulle. Mais un moment appliqué à un tel nœud n’a rien pour le reprendre, et [le calcul échoue](/fr/solver/solving#when-solving-fails).

## Barres de treillis {#truss-bars}

Avec une rotule à chaque extrémité, une barre ne reprend que de l’effort normal, tant qu’elle n’est chargée qu’à ses nœuds : c’est une barre de treillis.

```ts
domain.createBeam2D('AE', ['A', 'E'], 'steel', 'bar', [true, true])
```

L’[exemple du treillis](/fr/solver/trusses) calcule ainsi un treillis entier. L’exemple de treillis de l’application EduBeam utilise au contraire des nœuds rigides, avec une aire si grande que les moments fléchissants sont négligeables devant les efforts normaux. Les deux modèles sont valables ; ils ne diffèrent que par ces petits moments. La matrice de rigidité de la barre elle-même est établie à la page [Barre de treillis](/fr/elements/truss) du manuel théorique.

## Les matrices de l’élément {#the-element-s-matrices}

Pour enseigner la méthode elle-même, un `Beam2D` fournit ses matrices sous forme de matrices [mathjs](https://mathjs.org) ; `.toArray()` les convertit en `number[][]` :

| Méthode | Fournit |
| --- | --- |
| `computeGeo()` | `{ l, dx, dz }` : longueur et projections, m |
| `computeLocalStiffnessMtrx().answer` | matrice de rigidité 6 × 6 en axes locaux, rotules éliminées par condensation |
| `computeT()` | matrice de passage 6 × 6 des axes globaux aux axes locaux |
| `computeStiffness()` | matrice de rigidité 6 × 6 en axes globaux, $T^T K_l T$ |
| `computeShearFactor()` | $\Phi = 12EI_y/kGAL^2$ |

```ts
ac.computeStiffness().toArray() // number[][], N/m, N et N·m
```

Les DDL sont rangés dans l’ordre $u_1, w_1, \varphi_1, u_2, w_2, \varphi_2$. La page [Élément poutre](/fr/elements/beam) du manuel théorique établit ces matrices, et [Comment EduBeam résout un modèle](/fr/elements/analysis) montre comment elles sont assemblées.
