---
title: Treillis
description: "Un treillis Warren articulé dans @edubeam/fem, l’effort de chaque barre vérifié par la méthode des sections, et une boucle qui génère des treillis de n’importe quel nombre de panneaux."
order: 14
source: site
---

# Treillis {#trusses}

Un treillis se compose de barres articulées à leurs deux extrémités et chargées aux nœuds : chaque barre ne reprend donc qu’un effort normal. Cet exemple construit un treillis Warren à partir de deux listes, vérifie à la main l’effort dans chaque barre, puis génère dans une boucle des treillis de taille quelconque.

::model-figure{caption="Un treillis Warren : 9 m de portée, 1,8 m de hauteur, 8 kN à chaque nœud supérieur"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members:
  - { nodes: [A, B], hinges: [true, true] }
  - { nodes: [B, C], hinges: [true, true] }
  - { nodes: [C, D], hinges: [true, true] }
  - { nodes: [E, F], hinges: [true, true] }
  - { nodes: [F, G], hinges: [true, true] }
  - { nodes: [A, E], hinges: [true, true] }
  - { nodes: [E, B], hinges: [true, true] }
  - { nodes: [B, F], hinges: [true, true] }
  - { nodes: [F, C], hinges: [true, true] }
  - { nodes: [C, G], hinges: [true, true] }
  - { nodes: [G, D], hinges: [true, true] }
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: [N, w]
show: [nodeLabels]
---
::

```ts [truss.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })

// Un treillis Warren : 9 m de portée, 1,8 m de hauteur, membrure inférieure A-B-C-D, membrure supérieure E-F-G
const nodes: [string, number, number, DofID[]][] = [
  ['A', 0, 0, [DofID.Dx, DofID.Dz]],
  ['B', 3, 0, []],
  ['C', 6, 0, []],
  ['D', 9, 0, [DofID.Dz]],
  ['E', 1.5, -1.8, []],
  ['F', 4.5, -1.8, []],
  ['G', 7.5, -1.8, []],
]
for (const [label, x, z, support] of nodes) {
  domain.createNode(label, [x, 0, z], support)
}

// Chaque étiquette nomme les deux nœuds de la barre. Articulée aux deux extrémités : effort normal seul.
const bars = ['AB', 'BC', 'CD', 'EF', 'FG', 'AE', 'EB', 'BF', 'FC', 'CG', 'GD']
const members = bars.map((bar) =>
  domain.createBeam2D(bar, [bar[0], bar[1]], 1, 1, [true, true])
)

const lc = solver.loadCases[0]
for (const top of ['E', 'F', 'G']) {
  lc.createNodalLoad(top, { [DofID.Dz]: 8e3 }) // 8 kN vers le bas
}
solver.solve()

for (const bar of members) {
  const n = bar.computeNormalForceAt(lc, 0) / 1e3
  console.log(bar.label, n.toFixed(2), n > 0 ? 'tension' : 'compression')
}
```

```text [Sortie]
AB 10.00 tension
BC 16.67 tension
CD 10.00 tension
EF -13.33 compression
FG -13.33 compression
AE -15.62 compression
EB 5.21 tension
BF -5.21 compression
FC -5.21 compression
CG 5.21 tension
GD -15.62 compression
```

L’effort normal d’une barre est constant : il suffit donc de le lire en `x = 0`. Les étiquettes de deux lettres servent aussi de paires de nœuds : `bar[0]` et `bar[1]`.

## Vérification à la main {#check-it-by-hand}

Chaque appui reprend la moitié des 24 kN, soit 12 kN. Coupez le treillis et écrivez l’équilibre des moments par rapport au nœud opposé à la barre coupée, comme dans la [méthode des sections](/fr/tutorials/truss) (méthode de Ritter) :

| Barre | Coupe | Effort |
| --- | --- | --- |
| BC, membrure inférieure | moments par rapport à F : $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$ | 16,67 kN, traction |
| EF, membrure supérieure | moments par rapport à B : $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$ | 13,33 kN, compression |
| AE, diagonale d’extrémité | nœud A : $12 \cdot \sqrt{1{,}5^2 + 1{,}8^2}/1{,}8$ | 15,62 kN, compression |
| EB, diagonale | effort tranchant dans le panneau, $12 - 8 = 4$ kN : $4 \cdot 2{,}343/1{,}8$ | 5,21 kN, traction |

La section ne change pas les efforts dans les barres d’un treillis isostatique ; elle ne fixe que l’ampleur des déplacements des nœuds. La figure ci-dessus utilise une autre section, celle de l’application EduBeam, et donne les mêmes efforts.

## Un nombre quelconque de panneaux {#any-number-of-panels}

Pour générer des treillis, pour des exercices ou une étude paramétrique, construisez les nœuds et les barres dans une boucle, panneau par panneau. Avec `panels = 3`, c’est le treillis ci-dessus, et le programme affiche les mêmes efforts ; modifiez `panels`, `w` et `h` pour en obtenir un autre.

```ts [warren.ts]
import { type Beam2D, DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })
const lc = solver.loadCases[0]

const panels = 3 // panneaux de la membrure inférieure
const w = 3 // largeur d'un panneau, m
const h = 1.8 // hauteur, m

// Nœuds inférieurs b0, b1, … sur une articulation et un appui simple ; nœuds supérieurs t0, t1, … entre eux
for (let i = 0; i <= panels; i++) {
  const ends = i === 0 ? [DofID.Dx, DofID.Dz] : i === panels ? [DofID.Dz] : []
  domain.createNode(`b${i}`, [i * w, 0, 0], ends)
}
for (let i = 0; i < panels; i++) {
  domain.createNode(`t${i}`, [(i + 0.5) * w, 0, -h])
  lc.createNodalLoad(`t${i}`, { [DofID.Dz]: 8e3 })
}

const members: Beam2D[] = []
const bar = (a: string, b: string) =>
  members.push(domain.createBeam2D(`${a}-${b}`, [a, b], 1, 1, [true, true]))
for (let i = 0; i < panels; i++) {
  bar(`b${i}`, `b${i + 1}`) // membrure inférieure
  bar(`b${i}`, `t${i}`) // diagonale montante
  bar(`t${i}`, `b${i + 1}`) // diagonale descendante
  if (i > 0) bar(`t${i - 1}`, `t${i}`) // membrure supérieure
}
solver.solve()

for (const m of members) {
  console.log(m.label, (m.computeNormalForceAt(lc, 0) / 1e3).toFixed(2))
}
```

Le temps de calcul croît vite avec la taille : quelques dizaines de panneaux ne posent aucun problème, voir [Taille du modèle](/fr/solver/solving#model-size). Pour dessiner chaque treillis généré, avec ou sans ses solutions, voir [Exercices et examens](/fr/plot/exercises) dans la documentation de @edubeam/plot.

## À remarquer {#things-to-notice}

- **Des rotules à chaque extrémité de barre.** Chaque nœud est alors libre de tourner, et le solveur indique une rotation nulle. Un moment appliqué à un tel nœud n’a rien pour le reprendre, et [le calcul échoue](/fr/solver/solving#when-solving-fails).
- **Des charges aux nœuds.** Une charge le long d’une barre la ferait fléchir : ce serait alors une poutre, et non une barre de treillis, avec un diagramme des moments.

Le [tutoriel sur le treillis plan](/fr/tutorials/truss) construit un treillis dans l’application EduBeam, et la page [Barre de treillis](/fr/elements/truss) établit la rigidité de la barre.
