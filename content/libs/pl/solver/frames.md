---
title: Ramy
description: "Kompletny program w @edubeam/fem dla ramy trójprzegubowej ze słupami, sztywnymi narożami i przegubem w kluczu, z wynikami sprawdzonymi ręcznie."
order: 13
source: site
---

# Ramy {#frames}

Rama to rygle i słupy połączone sztywno w narożach. Ten program buduje w kodzie ramę z samouczka [Rama trójprzegubowa](/pl/tutorials/three-hinged-frame): dwa słupy o wysokości 4 m z podporami przegubowymi w A i E, rygiel o długości 8 m z przegubem w C i obciążenie 10 kN/m na ryglu. Samouczek numeruje węzły od 1 do 5; tutaj są oznaczone od A do E.

::model-figure{caption="Rama z poniższego programu: podpory przegubowe w A i E, przegub w C, 10 kN/m"}
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

// Oś z jest skierowana w dół: górne końce słupów o wysokości 4 m leżą na z = -4
const pin = [DofID.Dx, DofID.Dz]
domain.createNode('A', [0, 0, 0], pin)
domain.createNode('B', [0, 0, -4])
domain.createNode('C', [4, 0, -4]) // przegub w kluczu
domain.createNode('D', [8, 0, -4])
domain.createNode('E', [8, 0, 0], pin)

const column = domain.createBeam2D(1, ['A', 'B'], 1, 1) // od dołu do góry
const left = domain.createBeam2D(2, ['B', 'C'], 1, 1, [false, true]) // przegub w C
domain.createBeam2D(3, ['C', 'D'], 1, 1)
domain.createBeam2D(4, ['D', 'E'], 1, 1)

const lc = solver.loadCases[0]
for (const half of [2, 3]) {
  lc.createBeamElementUniformEdgeLoad(half, [0, 10e3], false)
}
solver.solve()

// getReactions zwraca macierz mathjs albo tablicę: zamień ją na tablicę
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

```text [Wynik]
A: Rx = 20.00 kN, Rz = -40.00 kN
E: Rx = -20.00 kN, Rz = -40.00 kN
M at 0 m from B = -80.00 kNm
M at 2 m from B = -20.00 kNm
M at 4 m from B = 0.00 kNm
M at the top of column 1 = -80.00 kNm
```

## Sprawdzenie ręczne {#check-it-by-hand}

| Wielkość | Ręcznie | Solver |
| --- | --- | --- |
| Reakcje pionowe | $q \cdot 8/2 = 40$ kN w górę | $R_z = -40$ kN w A i E |
| Reakcje poziome | z $M_C = 0$ dla lewej połowy: $(40 \cdot 4 - 10 \cdot 4 \cdot 2)/4 = 20$ kN, do wewnątrz | $R_x = +20$ kN w A, $-20$ kN w E |
| Moment w narożu | $-20 \cdot 4 = -80$ kNm | $-80$ kNm w ryglu i w słupie |
| Moment 2 m od B | $-80 + 40 \cdot 2 - 10 \cdot 2^2/2 = -20$ kNm | $-20$ kNm |
| Moment w przegubie | 0 | 0 |

## Na co zwrócić uwagę {#things-to-notice}

- **Słupy biegną w górę, więc z jest ujemne.** Górne końce słupów leżą na $z = -4$.
- **Osie lokalne słupa.** Pręt 1 biegnie od A w górę do B, więc jego lokalna oś z jest skierowana w prawo, do wnętrza ramy. Jego moment u góry wynosi −80 kNm, tak samo jak moment rygla w narożu: rozciągane są włókna zewnętrzne. Zdefiniuj słup od B w dół do A, a jego lokalna oś z będzie skierowana w lewo: moment zmieni znak, a `x` będzie liczone od góry. Zob. [Kierunek pręta](/pl/solver/conventions#member-direction).
- **Jeden przegub, jeden koniec pręta.** Przegub znajduje się na końcu pręta 2 w C; pręt 3 zaczyna się w C sztywno. Jeden zwolniony koniec wystarczy, by w C powstał przegub.
- **Obciążenia globalne na ryglu.** `false` oznacza obciążenie w osiach globalnych: pionowe bez względu na nachylenie pręta. W poziomym ryglu rysowanym od lewej do prawej oba warianty dają to samo.

## Ramy statycznie niewyznaczalne {#statically-indeterminate-frames}

Usuń przegub, `[false, false]`, a otrzymasz ramę portalową, jednokrotnie statycznie niewyznaczalną. Jej siły przekrojowe zależą wtedy od sztywności rygla w stosunku do sztywności słupów: nadaj prętom różne przekroje, by to zobaczyć. [Eksperymenty z samouczka](/pl/tutorials/three-hinged-frame#_7-experiment) utwierdzają podstawy słupów i obciążają ramę poziomo, podając wyniki do porównania. Strona [Slajdy i materiały](/pl/plot/slides) biblioteki @edubeam/plot rysuje taką ramę portalową krok po kroku.
