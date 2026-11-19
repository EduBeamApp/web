---
title: Portiques
description: "Un programme @edubeam/fem complet pour un portique à trois articulations, avec poteaux, angles rigides et rotule à la clé, et ses résultats vérifiés à la main."
order: 13
source: site
---

# Portiques {#frames}

Un portique se compose de poutres et de poteaux liés rigidement dans les angles. Cet exemple construit en code le portique du [tutoriel sur le portique à trois articulations](/fr/tutorials/three-hinged-frame) : deux poteaux de 4 m articulés en A et en E, une traverse de 8 m avec une rotule en C, et 10 kN/m sur la traverse. Le tutoriel numérote les nœuds de 1 à 5 ; ici, ils vont de A à E.

::model-figure{caption="Le portique du programme ci-dessous : articulations en A et en E, rotule en C, 10 kN/m"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, k: 1e32 }) // IPE 300

// z est dirigé vers le bas : les têtes des poteaux de 4 m sont en z = -4
const pin = [DofID.Dx, DofID.Dz]
domain.createNode('A', [0, 0, 0], pin)
domain.createNode('B', [0, 0, -4])
domain.createNode('C', [4, 0, -4]) // la rotule à la clé
domain.createNode('D', [8, 0, -4])
domain.createNode('E', [8, 0, 0], pin)

const column = domain.createBeam2D(1, ['A', 'B'], 1, 1) // de bas en haut
const left = domain.createBeam2D(2, ['B', 'C'], 1, 1, [false, true]) // rotule en C
domain.createBeam2D(3, ['C', 'D'], 1, 1)
domain.createBeam2D(4, ['D', 'E'], 1, 1)

const lc = solver.loadCases[0]
for (const half of [2, 3]) {
  lc.createBeamElementUniformEdgeLoad(half, [0, 10e3], false)
}
solver.solve()

// getReactions renvoie une Matrix mathjs ou un tableau : on le convertit en tableau
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()
const kN = (v: number) => (v / 1e3).toFixed(2)

for (const label of ['A', 'E']) {
  const [rx, rz] = list(domain.getNode(label).getReactions(lc).values)
  console.log(`${label}: Rx = ${kN(rx)} kN, Rz = ${kN(rz)} kN`)
}
for (const x of [0, 2, 4]) {
  const m = left.computeBendingMomentAt(lc, x)
  console.log(`M at ${x} m from B = ${kN(m)} kNm`)
}
const top = column.computeBendingMomentAt(lc, 4)
console.log(`M at the top of column 1 = ${kN(top)} kNm`)
```

```text [Sortie]
A: Rx = 20.00 kN, Rz = -40.00 kN
E: Rx = -20.00 kN, Rz = -40.00 kN
M at 0 m from B = -80.00 kNm
M at 2 m from B = -20.00 kNm
M at 4 m from B = 0.00 kNm
M at the top of column 1 = -80.00 kNm
```

## Vérification à la main {#check-it-by-hand}

| Grandeur | À la main | Solveur |
| --- | --- | --- |
| Réactions verticales | $q \cdot 8/2 = 40$ kN vers le haut | $R_z = -40$ kN en A et en E |
| Réactions horizontales | de $M_C = 0$ sur la moitié gauche : $(40 \cdot 4 - 10 \cdot 4 \cdot 2)/4 = 20$ kN, vers l’intérieur | $R_x = +20$ kN en A, $-20$ kN en E |
| Moment d’angle | $-20 \cdot 4 = -80$ kNm | $-80$ kNm dans la traverse et dans le poteau |
| Moment à 2 m de B | $-80 + 40 \cdot 2 - 10 \cdot 2^2/2 = -20$ kNm | $-20$ kNm |
| Moment à la rotule | 0 | 0 |

## À remarquer {#things-to-notice}

- **Les poteaux montent, donc z est négatif.** Les têtes des poteaux sont en $z = -4$.
- **Les axes locaux du poteau.** La barre 1 va de A vers le haut, jusqu’à B : son axe z local est donc dirigé vers la droite, vers l’intérieur du portique. Son moment en tête vaut −80 kNm, comme celui de la traverse dans l’angle : la face extérieure est tendue. Définissez le poteau de B vers A, vers le bas, et son axe z local est dirigé vers la gauche : son moment change de signe, et `x` part du haut. Voir [Sens de la barre](/fr/solver/conventions#member-direction).
- **Une rotule, une extrémité de barre.** La rotule se trouve à l’extrémité de la barre 2 en C ; la barre 3 part de C avec une liaison rigide. Une seule extrémité libérée suffit à faire de C une rotule.
- **Des charges globales sur la traverse.** `false` donne la charge en axes globaux : verticale, quelle que soit l’inclinaison de la barre. Sur une traverse horizontale dessinée de gauche à droite, cela revient au même qu’en axes locaux.

## Portiques hyperstatiques {#statically-indeterminate-frames}

Supprimez la rotule, `[false, false]`, et vous obtenez un portique bi-articulé, hyperstatique de degré 1. Ses efforts dépendent alors de la rigidité de la traverse par rapport à celle des poteaux : donnez aux barres des sections différentes pour le constater. Les [expériences du tutoriel](/fr/tutorials/three-hinged-frame#_7-experiment) encastrent les pieds des poteaux et poussent le portique latéralement, avec les valeurs de contrôle. La page [Diapositives et supports de cours](/fr/plot/slides) de @edubeam/plot dessine un tel portique étape par étape.
