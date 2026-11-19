---
title: Poutres
description: "Des programmes @edubeam/fem complets pour une console et une poutre continue à deux travées, avec leur sortie, chacun vérifié par la formule classique."
order: 12
group: Exemples complets
source: site
---

# Poutres {#beams}

Deux programmes complets, à copier et à modifier. Tous deux utilisent une section sans déformation d’effort tranchant (`k: 1e32`) : leurs valeurs sont donc exactement celles des formules d’Euler–Bernoulli. Lancez-les avec `node cantilever.ts` (Node 22.18 ou plus récent), dans un dossier préparé comme dans [Installation](/fr/solver/getting-started#install).

## Une console {#a-cantilever}

4 m de long, encastrée en A, 18 kN vers le bas à l’extrémité libre :

```ts [cantilever.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // encastrement
const tip = domain.createNode('B', [4, 0, 0]) // libre
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
lc.createNodalLoad('B', { [DofID.Dz]: 18e3 }) // 18 kN vers le bas en bout
solver.solve()

console.log(beam.computeBendingMomentAt(lc, 0)) // N·m à l'encastrement
console.log(tip.getUnknowns(lc, [DofID.Dz])) // m, la flèche en bout
```

```text [Sortie]
-72000
0.09411072715241528
```

$M_A = -FL = -72$ kNm, un moment négatif, et la flèche en bout vaut $FL^3/3EI = 94{,}11$ mm, avec $EI = 4{,}0803$ MNm². Cette même console fait partie des exemples de l’application EduBeam.

## Une poutre continue {#a-continuous-beam}

Deux travées de 5 m sur trois appuis, 10 kN/m sur les deux. Les réactions, le moment sur l’appui central et le plus grand moment en travée :

```ts [continuous.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [5, 0, 0], [DofID.Dz])
domain.createNode('C', [10, 0, 0], [DofID.Dz])
const span1 = domain.createBeam2D(1, ['A', 'B'], 1, 1)
domain.createBeam2D(2, ['B', 'C'], 1, 1)

const lc = solver.loadCases[0]
for (const span of [1, 2]) {
  lc.createBeamElementUniformEdgeLoad(span, [0, 10e3], true)
}
solver.solve()

// getReactions renvoie une Matrix mathjs ou un tableau : on le convertit en tableau
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

for (const label of ['A', 'B', 'C']) {
  const { dofs, values } = domain.getNode(label).getReactions(lc)
  const rz = list(values)[dofs.indexOf(DofID.Dz)]
  console.log(`R${label} = ${(-rz / 1e3).toFixed(2)} kN up`)
}
const mB = span1.computeBendingMomentAt(lc, 5)
console.log(`MB = ${(mB / 1e3).toFixed(2)} kNm`)

// Le plus grand moment positif de la travée 1, sur 501 points
const { x, M } = span1.computeBendingMoment(lc, 500)
const i = M.indexOf(Math.max(...M))
console.log(`max M = ${(M[i] / 1e3).toFixed(2)} kNm at x = ${x[i]} m`)
```

```text [Sortie]
RA = 18.75 kN up
RB = 62.50 kN up
RC = 18.75 kN up
MB = -31.25 kNm
max M = 17.58 kNm at x = 1.87 m
```

Les valeurs des manuels pour deux travées égales : $R_A = R_C = 0{,}375\,qL$, $R_B = 1{,}25\,qL$, $M_B = -qL^2/8$, et le plus grand moment en travée $R_A^2/2q = 17{,}58$ kNm, en $x = R_A/q = 1{,}875$ m. L’échantillonnage le trouve au point d’échantillonnage 1,87 m, à 0,0002 kNm près de la valeur exacte.

::model-figure{caption="Deux travées de 5 m sous 10 kN/m"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels]
---
::

La figure utilise la section des exemples de l’application plutôt que l’IPE 200. Avec une seule section sur toute la longueur, les efforts internes d’une poutre continue ne dépendent pas de sa rigidité : les diagrammes portent donc les mêmes valeurs, et seule la flèche diffère.

## Modifier ces programmes {#change-it}

- **Travées ou charges inégales :** modifiez les coordonnées de C ou la liste des charges. Une charge sur une seule travée donne le chargement alterné bien connu.
- **Trois travées :** ajoutez un nœud D et une barre `['C', 'D']`.
- **Une extrémité encastrée :** donnez à A `[DofID.Dx, DofID.Dz, DofID.Ry]`.
- **Une vraie déformation d’effort tranchant :** `k: 5 / 6` pour un rectangle, ou le coefficient de cisaillement de votre section.
- **Une figure :** passez le solveur à [@edubeam/plot](/fr/solver/drawing).

Le [tutoriel sur la poutre continue](/fr/tutorials/continuous-beam) construit une poutre de ce type dans l’application EduBeam, et la page [Vérifier les résultats à la main](/fr/guide/verification) propose d’autres cas classiques avec leurs formules.
