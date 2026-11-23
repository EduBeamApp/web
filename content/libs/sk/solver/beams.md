---
title: Nosníky
description: "Kompletné programy v @edubeam/fem pre konzolu a spojitý nosník s dvoma poľami, s ich výstupom a kontrolou podľa učebnicového vzorca."
order: 12
group: Postupy
source: site
---

# Nosníky {#beams}

Dva kompletné programy, ktoré si môžete skopírovať a upraviť. Oba používajú šmykovo tuhý prierez (`k: 1e32`), takže ich čísla presne zodpovedajú vzorcom Bernoulliho–Navierovej teórie. Spustíte ich príkazom `node cantilever.ts` (Node 22.18 alebo novší) v priečinku pripravenom podľa časti [Inštalácia](/sk/solver/getting-started#install).

## Konzola {#a-cantilever}

Dĺžka 4 m, votknutie v A, sila 18 kN nadol na voľnom konci:

```ts [cantilever.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // votknutie
const tip = domain.createNode('B', [4, 0, 0]) // voľný koniec
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
lc.createNodalLoad('B', { [DofID.Dz]: 18e3 }) // 18 kN nadol na voľnom konci
solver.solve()

console.log(beam.computeBendingMomentAt(lc, 0)) // N·m vo votknutí
console.log(tip.getUnknowns(lc, [DofID.Dz])) // m, priehyb voľného konca
```

```text [Výstup]
-72000
0.09411072715241528
```

$M_A = -FL = -72$ kNm, teda záporný moment (ťah hore), a priehyb voľného konca je $FL^3/3EI = 94{,}11$ mm pri $EI = 4{,}0803$ MNm². Rovnaká konzola je jedným z príkladov v aplikácii EduBeam.

## Spojitý nosník {#a-continuous-beam}

Dve polia po 5 m na troch podperách, na oboch 10 kN/m. Program vypíše reakcie, moment nad strednou podperou a najväčší moment v poli:

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

// getReactions vracia maticu mathjs alebo pole: prevedieme ju na pole
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

for (const label of ['A', 'B', 'C']) {
  const { dofs, values } = domain.getNode(label).getReactions(lc)
  const rz = list(values)[dofs.indexOf(DofID.Dz)]
  console.log(`R${label} = ${(-rz / 1e3).toFixed(2)} kN up`)
}
const mB = span1.computeBendingMomentAt(lc, 5)
console.log(`MB = ${(mB / 1e3).toFixed(2)} kNm`)

// Najväčší kladný moment v poli 1, z 501 bodov pozdĺž prvku
const { x, M } = span1.computeBendingMoment(lc, 500)
const i = M.indexOf(Math.max(...M))
console.log(`max M = ${(M[i] / 1e3).toFixed(2)} kNm at x = ${x[i]} m`)
```

```text [Výstup]
RA = 18.75 kN up
RB = 62.50 kN up
RC = 18.75 kN up
MB = -31.25 kNm
max M = 17.58 kNm at x = 1.87 m
```

Učebnicové hodnoty pre dve rovnaké polia: $R_A = R_C = 0{,}375\,qL$, $R_B = 1{,}25\,qL$, $M_B = -qL^2/8$ a najväčší moment v poli $R_A^2/2q = 17{,}58$ kNm v mieste $x = R_A/q = 1{,}875$ m. Vzorkovanie ho nájde v bode delenia 1,87 m a od presnej hodnoty sa líši o menej ako 0,0002 kNm.

::model-figure{caption="Dve polia po 5 m so zaťažením 10 kN/m"}
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

Obrázok používa namiesto IPE 200 prierez z príkladu v aplikácii. Keď má spojitý nosník všade rovnaký prierez, jeho vnútorné sily od tuhosti nezávisia, takže priebehy ukazujú rovnaké čísla; líši sa len priehyb.

## Ako program upraviť {#change-it}

- **Nerovnaké polia alebo zaťaženie:** zmeňte súradnice uzla C alebo zoznam zaťažení. Zaťaženie len v jednom poli dá známe šachovnicové zaťaženie.
- **Tri polia:** pridajte uzol D a prvok `['C', 'D']`.
- **Votknutý koniec:** zadajte v uzle A väzby `[DofID.Dx, DofID.Dz, DofID.Ry]`.
- **Skutočné šmykové deformácie:** `k: 5 / 6` pre obdĺžnik, alebo šmykový súčiniteľ vášho prierezu.
- **Obrázok modelu:** odovzdajte riešič knižnici [@edubeam/plot](/sk/solver/drawing).

Návod [Spojitý nosník a pokles podpery](/sk/tutorials/continuous-beam) zostaví podobný nosník v aplikácii EduBeam a na stránke [Ručné overenie výsledkov](/sk/guide/verification) nájdete ďalšie učebnicové prípady aj so vzorcami.
