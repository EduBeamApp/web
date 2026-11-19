---
title: Pręty i przeguby
description: "Połącz węzły prętami Beam2D, zwolnij momenty przegubami końcowymi, zamodeluj pręty kratownicy i pobierz z @edubeam/fem macierze elementu."
order: 5
source: site
---

# Pręty i przeguby {#members-and-hinges}

Każdy pręt to `Beam2D`: prosta, dwuwęzłowa belka Timoszenki w płaszczyźnie x–z, która przenosi siłę normalną, siłę tnącą i moment zginający. Przeguby na końcach pręta zwalniają w tym miejscu moment. Fragmenty kodu korzystają z `solver`, `domain` i `lc` programu takiego jak ten ze strony [Pierwsze kroki](/pl/solver/getting-started), z jego materiałem `'steel'` i przekrojem `'IPE200'`.

## Tworzenie pręta {#create-a-member}

```ts
domain.createBeam2D(label, [startNode, endNode], material, crossSection, hinges)
```

| Argument | Typ | Znaczenie |
| --- | --- | --- |
| `label` | `string \| number` | Nazwa pręta, przechowywana jako tekst |
| `nodes` | `[label, label]` | Pierwszy i drugi węzeł. Lokalna oś x biegnie od pierwszego do drugiego: zob. [Kierunek pręta](/pl/solver/conventions#member-direction). |
| `mat`, `cs` | `string \| number` | Etykiety materiału i przekroju |
| `hinges` | `[boolean, boolean]` | Przegub w pierwszym węźle, w drugim. Argument opcjonalny; domyślnie `[false, false]`, czyli sztywne końce. |

Metoda zwraca `Beam2D`: zachowaj go, aby odczytywać wyniki. `domain.getElement(label)` też go odnajdzie, ale z ogólnym typem `Element`, więc zanim odczytasz z niego wyniki, TypeScript wymaga `as Beam2D`.

Pręty, które spotykają się w węźle bez przegubów, są połączone sztywno: obracają się razem. Węzły, materiał i przekrój można tworzyć w dowolnej kolejności, byle wszystkie istniały w chwili obliczeń; jeśli któregoś brakuje, `solve()` zgłasza `RangeError` z jego nazwą.

## Przeguby końcowe {#end-hinges}

Przegub należy do końca pręta, a nie do węzła. Tutaj pręt 2 zaczyna się przegubem w C, więc węzeł C przekazuje z przęsła C–D na wspornik A–C siłę tnącą, ale nie moment:

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

cd.computeBendingMomentAt(lc, 0) // 0 w przegubie
cd.computeBendingMomentAt(lc, 2) // 20000 N·m: qL²/8 przęsła 4 m
ac.computeBendingMomentAt(lc, 0) // -40000 N·m: 20 kN z C–D na ramieniu 2 m
```

::model-figure{caption="Wspornik, na którym oparto przęsło z przegubem: w C nie ma momentu"}
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

Gdy w węźle przegubowym spotyka się kilka prętów, wystarczy przegub na końcach wszystkich prętów z wyjątkiem jednego. Przeguby na wszystkich końcach też działają: wtedy nic nie obraca węzła, a solver podaje jego obrót jako 0. Moment przyłożony do takiego węzła nie ma jednak czym zostać przeniesiony i [obliczenia się nie udają](/pl/solver/solving#when-solving-fails).

## Pręty kratownicy {#truss-bars}

Daj przeguby na obu końcach, a pręt będzie przenosił tylko siłę normalną, o ile jest obciążony w węzłach: to pręt kratownicy.

```ts
domain.createBeam2D('AE', ['A', 'E'], 'steel', 'bar', [true, true])
```

[Przykładowy program dla kratownicy](/pl/solver/trusses) rozwiązuje w ten sposób całą kratownicę. Przykład kratownicy w aplikacji EduBeam ma natomiast sztywne węzły i tak duże pole przekroju, że momenty zginające są pomijalne w porównaniu z siłami osiowymi. Oba modele są poprawne; różnią się tylko tymi niewielkimi momentami. Macierz sztywności samego pręta jest wyprowadzona na stronie [Element kratownicy](/pl/elements/truss) w podręczniku teoretycznym.

## Macierze elementu {#the-element-s-matrices}

Do nauczania samej metody `Beam2D` udostępnia swoje macierze jako macierze [mathjs](https://mathjs.org); `.toArray()` zamienia je na `number[][]`:

| Metoda | Zwraca |
| --- | --- |
| `computeGeo()` | `{ l, dx, dz }`: długość i rzuty, m |
| `computeLocalStiffnessMtrx().answer` | macierz sztywności 6 × 6 w osiach lokalnych, z wyeliminowanymi (skondensowanymi) przegubami |
| `computeT()` | macierz transformacji 6 × 6 z osi globalnych do lokalnych |
| `computeStiffness()` | macierz sztywności 6 × 6 w osiach globalnych, $T^T K_l T$ |
| `computeShearFactor()` | $\Phi = 12EI_y/kGAL^2$ |

```ts
ac.computeStiffness().toArray() // number[][], N/m, N i N·m
```

Stopnie swobody są uporządkowane jako $u_1, w_1, \varphi_1, u_2, w_2, \varphi_2$. Strona [Element belkowy](/pl/elements/beam) w podręczniku teoretycznym wyprowadza te macierze, a strona [Jak EduBeam rozwiązuje model](/pl/elements/analysis) pokazuje, jak się je agreguje.
