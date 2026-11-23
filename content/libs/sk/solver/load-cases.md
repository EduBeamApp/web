---
title: Zaťažovacie stavy
description: "Vyriešte v @edubeam/fem naraz niekoľko zaťažovacích stavov jedného modelu a ich výsledky skladajte superpozíciou do kombinácií zaťažení a obálok."
order: 8
source: site
---

# Zaťažovacie stavy {#load-cases}

Zaťažovací stav je súbor zaťažení, ktoré sa riešia spoločne. Riešič začína s jedným; pridajte ďalšie a jediné `solve()` ich vyrieši všetky s jednou maticou tuhosti. Výpočet je lineárny, takže výsledky rôznych stavov možno násobiť a sčítať: nič iné kombinácia zaťažení nie je.

## Pridanie zaťažovacieho stavu {#add-a-load-case}

```ts [load-cases.ts]
import { DofID, LinearStaticSolver, LoadCase } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const dead = solver.loadCases[0] // ten, s ktorým začína každý riešič
const live = new LoadCase('live', domain)
solver.loadCases.push(live)

dead.createBeamElementUniformEdgeLoad(1, [0, 10e3], true) // 10 kN/m
live.createBeamConcentratedLoad(1, [0, 20e3, 0, 3], true) // 20 kN v strede rozpätia
solver.solve() // vyrieši všetky zaťažovacie stavy

console.log(beam.computeBendingMomentAt(dead, 3)) // qL²/8
console.log(beam.computeBendingMomentAt(live, 3)) // PL/4
```

```text [Výstup]
45000
30000
```

Každá metóda na výsledky dostáva zaťažovací stav, ktorého výsledky má vrátiť. Prvý stav má označenie `'DefaultLC'`; označenia sú len názvy a riešič stavy rozlišuje podľa objektu.

## Kombinácie {#combine-them}

Vynásobte výsledok každého stavu jeho súčiniteľom a sčítajte. Pre medzný stav únosnosti podľa Eurokódu, $1{,}35\,G + 1{,}5\,Q$, v strede rozpätia:

```ts
1.35 * beam.computeBendingMomentAt(dead, 3) +
  1.5 * beam.computeBendingMomentAt(live, 3) // 105750 N·m
```

To isté platí pre reakcie, posunutia a všetky ostatné výsledky. Po celej dĺžke prvku kombinujte bod po bode: polia z `computeBendingMoment(lc, n)` používajú pre každý stav rovnaké `x`.

```ts
const n = 60
const g = beam.computeBendingMoment(dead, n).M
const q = beam.computeBendingMoment(live, n).M
const uls = g.map((m, i) => 1.35 * m + 1.5 * q[i])
Math.max(...uls) // 105750 N·m, v x = 3
```

Obálka, teda najväčšia a najmenšia hodnota z niekoľkých kombinácií, je `Math.max` a `Math.min` cez takéto polia, bod po bode. Pri pohyblivom zaťažení naopak riešte model raz pre každú polohu zaťaženia: tak to robí postup [Príčinková čiara ako CSV](/sk/solver/scripts#an-influence-line-as-csv).

## V aplikácii EduBeam {#in-the-edubeam-app}

Aplikácia rieši vždy len jeden zaťažovací stav, takže v kombináciách knižnica dokáže viac ako aplikácia. Model s niekoľkými stavmi sa však dá [vykresliť](/sk/solver/drawing) stav po stave: `StructurePlot` z @edubeam/plot prijíma `loadCase`, index do `solver.loadCases`.
