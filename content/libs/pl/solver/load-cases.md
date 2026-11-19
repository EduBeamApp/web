---
title: Przypadki obciążenia
description: "Rozwiąż w @edubeam/fem kilka przypadków obciążenia jednego modelu naraz i łącz ich wyniki metodą superpozycji w kombinacje obciążeń i obwiednie."
order: 8
source: site
---

# Przypadki obciążenia {#load-cases}

Przypadek obciążenia to zestaw obciążeń rozwiązywanych razem. Solver zaczyna z jednym; dodaj kolejne, a jedno wywołanie `solve()` rozwiąże je wszystkie z jedną macierzą sztywności. Obliczenia są liniowe, więc wyniki różnych przypadków można mnożyć przez współczynniki i dodawać: na tym właśnie polega kombinacja obciążeń.

## Dodawanie przypadku obciążenia {#add-a-load-case}

```ts [load-cases.ts]
import { DofID, LinearStaticSolver, LoadCase } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const dead = solver.loadCases[0] // ten, z którym startuje każdy solver
const live = new LoadCase('live', domain)
solver.loadCases.push(live)

dead.createBeamElementUniformEdgeLoad(1, [0, 10e3], true) // 10 kN/m
live.createBeamConcentratedLoad(1, [0, 20e3, 0, 3], true) // 20 kN w środku rozpiętości
solver.solve() // rozwiązuje wszystkie przypadki obciążenia

console.log(beam.computeBendingMomentAt(dead, 3)) // qL²/8
console.log(beam.computeBendingMomentAt(live, 3)) // PL/4
```

```text [Wynik]
45000
30000
```

Każda metoda zwracająca wyniki przyjmuje przypadek obciążenia, z którego ma je odczytać. Pierwszy przypadek ma etykietę `'DefaultLC'`; etykiety to tylko nazwy, a solver rozróżnia przypadki po samych obiektach.

## Kombinacje obciążeń {#combine-them}

Pomnóż wynik każdego przypadku przez jego współczynnik i dodaj. Dla stanu granicznego nośności według Eurokodu, $1{,}35\,G + 1{,}5\,Q$, w środku rozpiętości:

```ts
1.35 * beam.computeBendingMomentAt(dead, 3) +
  1.5 * beam.computeBendingMomentAt(live, 3) // 105750 N·m
```

Tak samo jest z reakcjami, przemieszczeniami i każdym innym wynikiem. Na całej długości pręta łącz wyniki punkt po punkcie: tablice z `computeBendingMoment(lc, n)` mają dla każdego przypadku te same `x`.

```ts
const n = 60
const g = beam.computeBendingMoment(dead, n).M
const q = beam.computeBendingMoment(live, n).M
const uls = g.map((m, i) => 1.35 * m + 1.5 * q[i])
Math.max(...uls) // 105750 N·m, w x = 3
```

Obwiednia, czyli największa i najmniejsza wartość z kilku kombinacji, to `Math.max` i `Math.min` po takich tablicach, punkt po punkcie. Przy obciążeniu ruchomym rozwiąż natomiast model osobno dla każdego położenia obciążenia: tak robi [przykład z linią wpływu](/pl/solver/scripts#an-influence-line-as-csv).

## W aplikacji EduBeam {#in-the-edubeam-app}

Aplikacja rozwiązuje jeden przypadek obciążenia naraz, dlatego kombinacje to obszar, w którym biblioteka daje więcej niż aplikacja. Model z kilkoma przypadkami można mimo to [narysować](/pl/solver/drawing) przypadek po przypadku: `StructurePlot` z @edubeam/plot przyjmuje `loadCase`, czyli indeks w tablicy `solver.loadCases`.
