---
title: Zatěžovací stavy
description: "Vyřešte v @edubeam/fem najednou několik zatěžovacích stavů jednoho modelu a jejich výsledky skládejte superpozicí do kombinací zatížení a obálek."
order: 8
---

# Zatěžovací stavy {#load-cases}

Zatěžovací stav je sada zatížení, která se řeší společně. Řešič začíná s jedním; přidejte další a jediné `solve()` je vyřeší všechny s jednou maticí tuhosti. Výpočet je lineární, takže výsledky různých stavů lze násobit a sčítat: nic jiného kombinace zatížení není.

## Přidání zatěžovacího stavu {#add-a-load-case}

```ts [load-cases.ts]
import { DofID, LinearStaticSolver, LoadCase } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const dead = solver.loadCases[0] // ten, se kterým začíná každý řešič
const live = new LoadCase('live', domain)
solver.loadCases.push(live)

dead.createBeamElementUniformEdgeLoad(1, [0, 10e3], true) // 10 kN/m
live.createBeamConcentratedLoad(1, [0, 20e3, 0, 3], true) // 20 kN uprostřed rozpětí
solver.solve() // vyřeší všechny zatěžovací stavy

console.log(beam.computeBendingMomentAt(dead, 3)) // qL²/8
console.log(beam.computeBendingMomentAt(live, 3)) // PL/4
```

```text [Výstup]
45000
30000
```

Každá metoda pro výsledky dostává zatěžovací stav, ze kterého má číst. První stav má označení `'DefaultLC'`; označení jsou jen názvy a řešič stavy rozlišuje podle objektu.

## Kombinace {#combine-them}

Vynásobte výsledek každého stavu jeho součinitelem a sečtěte. Pro mezní stav únosnosti podle Eurokódu, $1{,}35\,G + 1{,}5\,Q$, uprostřed rozpětí:

```ts
1.35 * beam.computeBendingMomentAt(dead, 3) +
  1.5 * beam.computeBendingMomentAt(live, 3) // 105750 N·m
```

Totéž platí pro reakce, posuny a všechny ostatní výsledky. Po celé délce prvku kombinujte bod po bodu: pole z `computeBendingMoment(lc, n)` používají pro každý stav stejná `x`.

```ts
const n = 60
const g = beam.computeBendingMoment(dead, n).M
const q = beam.computeBendingMoment(live, n).M
const uls = g.map((m, i) => 1.35 * m + 1.5 * q[i])
Math.max(...uls) // 105750 N·m, v x = 3
```

Obálka, tedy největší a nejmenší hodnota z několika kombinací, je `Math.max` a `Math.min` přes taková pole, bod po bodu. U pohyblivého zatížení naopak řešte model jednou pro každou polohu zatížení: tak to dělá [postup pro příčinkovou čáru](/cs/solver/scripts#an-influence-line-as-csv).

## V aplikaci EduBeam {#in-the-edubeam-app}

Aplikace řeší vždy jen jeden zatěžovací stav, takže v kombinacích knihovna umí víc než aplikace. Model s několika stavy lze přesto [vykreslit](/cs/solver/drawing) stav po stavu: `StructurePlot` z @edubeam/plot přijímá `loadCase`, index do `solver.loadCases`.
