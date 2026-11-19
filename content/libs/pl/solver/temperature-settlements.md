---
title: Temperatura i osiadania podpór
description: "Obciąż pręty w @edubeam/fem równomierną zmianą temperatury i różnicą temperatur, a podpory przesuń o zadane przemieszczenie – na sprawdzonych przykładach."
order: 7
source: site
---

# Temperatura i osiadania podpór {#temperature-and-settlements}

Dwa obciążenia, które nie są siłami: pręt, który chce zmienić długość lub krzywiznę, i podpora, która się przemieszcza. Oba wywołują siły przekrojowe tylko tam, gdzie konstrukcja się temu przeciwstawia, dlatego dobrze nadają się do ćwiczeń z układów statycznie niewyznaczalnych. Teorię obu obciążeń znajdziesz w części [Obciążenia elementów](/pl/elements/beam#element-loads) podręcznika teoretycznego aplikacji.

## Temperatura {#temperature}

```ts
lc.createBeamTemperatureLoad(member, [dTc, dTb, dTt])
```

| Wartość | Znaczenie | Wpływ na swobodny pręt |
| --- | --- | --- |
| `dTc` | zmiana w środku ciężkości, K | wydłużenie o $\alpha\,\Delta T_c\,L$ |
| `dTb` | zmiana we włóknach dolnych (po stronie lokalnej osi +z), K | razem z `dTt` zakrzywia pręt: $\kappa = \alpha\,(\Delta T_b - \Delta T_t)/h$ |
| `dTt` | zmiana we włóknach górnych, K | |

Pręt zgina tylko różnica `dTb - dTt`, więc `[30, 20, 0]` i `[30, 10, -10]` to to samo obciążenie. Wymaga ono `alpha` materiału i `h` przekroju; bez `h` momenty wychodzą `NaN`.

Belka utwierdzona na obu końcach nie może się ani wydłużyć, ani zakrzywić, więc zamiast tego jest ściskana i zginana: $N = -EA\,\alpha\,\Delta T_c$ i $M = -EI\,\alpha\,(\Delta T_b - \Delta T_t)/h$.

```ts [temperature.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial(1, { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [6, 0, 0], fixed)
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

// Środek ciężkości cieplejszy o 30 K, dół cieplejszy od góry o 20 K
lc.createBeamTemperatureLoad(1, [30, 20, 0])
solver.solve()

beam.computeNormalForceAt(lc, 3) // -215460 N: EA · 12e-6 · 30
beam.computeBendingMomentAt(lc, 3) // -4896.4 N·m: EI · 12e-6 · 20 / 0.2
```

Dla IPE 200 $EA = 598{,}5$ MN i $EI = 4{,}0803$ MNm². Cieplejsze włókna dolne sprawiają, że swobodna belka wygina się końcami do góry, więc utwierdzenia zginają ją w przeciwną stronę: powstaje moment ujemny, rozciągający włókna górne.

::model-figure{caption="Belka obustronnie utwierdzona, w środku ciężkości cieplejsza o 30 K, a na dole cieplejsza niż na górze o 20 K"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 30, bottom: 20, top: 0 } }
results: [M, N]
show: [nodeLabels]
material: { e: 210e9, alpha: 12e-6 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

W belce swobodnie podpartej to samo obciążenie nie wywołuje żadnych sił przekrojowych, tylko przemieszczenia: podpora przesuwna przesuwa się na zewnątrz o $\alpha\,\Delta T_c\,L = 2{,}16$ mm, a środek rozpiętości ugina się o $\kappa L^2/8 = 5{,}4$ mm.

## Zadane przemieszczenia {#prescribed-displacements}

```ts
lc.createPrescribedDisplacement(node, { [DofID.Dz]: 0.01 })
```

Przesuwa podporę o zadaną wartość: w metrach dla `Dx` i `Dz`, w radianach dla `Ry`, we własnych osiach węzła. Musi to być stopień swobody zablokowany przez podporę węzła; dla swobodnego stopnia swobody wartość jest ignorowana bez ostrzeżenia.

Belka jednostronnie utwierdzona, której podpora przesuwna osiada o 10 mm, w nowym solverze z materiałem i przekrojem z przykładu z temperaturą:

```ts
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // utwierdzenie
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // podpora przesuwna
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

lc.createPrescribedDisplacement('B', { [DofID.Dz]: 0.01 }) // 10 mm w dół
solver.solve()

domain.getNode('B').getReactions(lc).values // [566.7] N: 3EIw/L³
beam.computeBendingMomentAt(lc, 0) // -3400.2 N·m w A: 3EIw/L²
```

Podpora przesuwna musi pociągnąć belkę w dół, żeby ta za nią podążyła, dlatego jej reakcja jest dodatnia, skierowana wzdłuż +z: $3EIw/L^3 = 3 \cdot 4{,}0803 \times 10^6 \cdot 0{,}01 / 216 = 566{,}7$ N.

::model-figure{caption="Podpora przesuwna belki jednostronnie utwierdzonej osiada o 10 mm: −3,4 kNm w utwierdzeniu"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

Jak aplikacja rysuje oba te obciążenia, opisuje strona [Obciążenia](/pl/essentials/loads).
