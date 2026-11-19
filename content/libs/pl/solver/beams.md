---
title: Belki
description: "Kompletne programy w @edubeam/fem dla wspornika i dwuprzęsłowej belki ciągłej, z wynikami, z których każdy sprawdzono wzorem z podręcznika."
order: 12
group: Przykładowe programy
source: site
---

# Belki {#beams}

Dwa kompletne programy do skopiowania i przerobienia. Oba używają przekroju sztywnego na ścinanie (`k: 1e32`), więc ich wyniki dokładnie odpowiadają wzorom teorii Eulera–Bernoulliego. Uruchom je poleceniem `node cantilever.ts` (Node 22.18 lub nowszy) w folderze przygotowanym jak w części [Instalacja](/pl/solver/getting-started#install).

## Wspornik {#a-cantilever}

Długość 4 m, utwierdzenie w A, siła 18 kN w dół na swobodnym końcu:

```ts [cantilever.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // utwierdzenie
const tip = domain.createNode('B', [4, 0, 0]) // swobodny
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
lc.createNodalLoad('B', { [DofID.Dz]: 18e3 }) // 18 kN w dół na swobodnym końcu
solver.solve()

console.log(beam.computeBendingMomentAt(lc, 0)) // N·m w utwierdzeniu
console.log(tip.getUnknowns(lc, [DofID.Dz])) // m, ugięcie swobodnego końca
```

```text [Wynik]
-72000
0.09411072715241528
```

$M_A = -FL = -72$ kNm, moment ujemny (rozciągane włókna górne), a ugięcie swobodnego końca to $FL^3/3EI = 94{,}11$ mm, przy $EI = 4{,}0803$ MNm². Ten sam wspornik jest jednym z przykładów w aplikacji EduBeam.

## Belka ciągła {#a-continuous-beam}

Dwa przęsła po 5 m na trzech podporach, 10 kN/m na obu. Reakcje, moment nad podporą środkową i największy moment przęsłowy:

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

// getReactions zwraca macierz mathjs albo tablicę: zamień ją na tablicę
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

for (const label of ['A', 'B', 'C']) {
  const { dofs, values } = domain.getNode(label).getReactions(lc)
  const rz = list(values)[dofs.indexOf(DofID.Dz)]
  console.log(`R${label} = ${(-rz / 1e3).toFixed(2)} kN up`)
}
const mB = span1.computeBendingMomentAt(lc, 5)
console.log(`MB = ${(mB / 1e3).toFixed(2)} kNm`)

// Największy moment dodatni w przęśle 1, z 501 punktów wzdłuż pręta
const { x, M } = span1.computeBendingMoment(lc, 500)
const i = M.indexOf(Math.max(...M))
console.log(`max M = ${(M[i] / 1e3).toFixed(2)} kNm at x = ${x[i]} m`)
```

```text [Wynik]
RA = 18.75 kN up
RB = 62.50 kN up
RC = 18.75 kN up
MB = -31.25 kNm
max M = 17.58 kNm at x = 1.87 m
```

Wartości z podręcznika dla dwóch równych przęseł: $R_A = R_C = 0{,}375\,qL$, $R_B = 1{,}25\,qL$, $M_B = -qL^2/8$, a największy moment przęsłowy $R_A^2/2q = 17{,}58$ kNm, w $x = R_A/q = 1{,}875$ m. Próbkowanie znajduje go w punkcie siatki 1,87 m i różni się od dokładnej wartości o mniej niż 0,0002 kNm.

::model-figure{caption="Dwa przęsła po 5 m, obciążenie 10 kN/m"}
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

Rysunek używa przekroju z przykładu w aplikacji zamiast IPE 200. Gdy cała belka ciągła ma jeden przekrój, jej siły przekrojowe nie zależą od sztywności, więc wykresy mają te same wartości; różni się tylko ugięcie.

## Jak zmienić program {#change-it}

- **Nierówne przęsła lub obciążenia:** zmień współrzędne C albo listę obciążeń. Obciążenie tylko jednego przęsła daje dobrze znany niekorzystny układ obciążenia zmiennego.
- **Trzy przęsła:** dodaj węzeł D i pręt `['C', 'D']`.
- **Utwierdzony koniec:** nadaj węzłowi A `[DofID.Dx, DofID.Dz, DofID.Ry]`.
- **Rzeczywiste odkształcenie postaciowe:** `k: 5 / 6` dla prostokąta albo współczynnik ścinania wybranego przekroju.
- **Rysunek:** przekaż solver bibliotece [@edubeam/plot](/pl/solver/drawing).

Samouczek [Belka ciągła i osiadanie podpory](/pl/tutorials/continuous-beam) buduje podobną belkę w aplikacji EduBeam, a strona [Sprawdzanie wyników ręcznie](/pl/guide/verification) zawiera więcej przypadków z podręczników wraz ze wzorami.
