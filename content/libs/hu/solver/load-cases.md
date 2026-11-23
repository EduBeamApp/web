---
title: Terhelési esetek
description: "Egy @edubeam/fem modell több terhelési esetének egyidejű megoldása, és eredményeik szuperpozícióval való összegzése teherkombinációkká és burkolókká."
order: 8
source: site
---

# Terhelési esetek {#load-cases}

A terhelési eset együtt megoldott terhek csoportja. A számítómag eggyel indul; adj hozzá továbbiakat, és egyetlen `solve()` hívás mindet megoldja egyetlen merevségi mátrixszal. A számítás lineáris, így a különböző esetek eredményei szorozhatók és összeadhatók: a teherkombináció sem más, mint ez.

## Terhelési eset hozzáadása {#add-a-load-case}

```ts [load-cases.ts]
import { DofID, LinearStaticSolver, LoadCase } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const dead = solver.loadCases[0] // amellyel minden számítómag indul
const live = new LoadCase('live', domain)
solver.loadCases.push(live)

dead.createBeamElementUniformEdgeLoad(1, [0, 10e3], true) // 10 kN/m
live.createBeamConcentratedLoad(1, [0, 20e3, 0, 3], true) // 20 kN a támaszköz közepén
solver.solve() // minden terhelési esetet megold

console.log(beam.computeBendingMomentAt(dead, 3)) // qL²/8
console.log(beam.computeBendingMomentAt(live, 3)) // PL/4
```

```text [Kimenet]
45000
30000
```

Minden eredménymetódus megkapja azt a terhelési esetet, amelyből olvasnia kell. Az első eset jelölése `'DefaultLC'`; a jelölések csak nevek, a számítómag magukról az objektumokról ismeri fel az eseteket.

## Kombinálás {#combine-them}

Szorozd meg minden eset eredményét a saját tényezőjével, és add össze őket. Az Eurocode teherbírási határállapotára, $1{,}35\,G + 1{,}5\,Q$, a támaszköz közepén:

```ts
1.35 * beam.computeBendingMomentAt(dead, 3) +
  1.5 * beam.computeBendingMomentAt(live, 3) // 105750 N·m
```

Ugyanez érvényes a támaszerőkre, az elmozdulásokra és minden más eredményre. A rúd teljes hosszán pontról pontra kombinálj: a `computeBendingMoment(lc, n)` tömbjei minden esetben ugyanazokat az `x` értékeket használják.

```ts
const n = 60
const g = beam.computeBendingMoment(dead, n).M
const q = beam.computeBendingMoment(live, n).M
const uls = g.map((m, i) => 1.35 * m + 1.5 * q[i])
Math.max(...uls) // 105750 N·m, x = 3-nál
```

A burkoló, vagyis több kombináció legnagyobb és legkisebb értéke, ilyen tömbökön pontról pontra vett `Math.max` és `Math.min`. Mozgó teher esetén viszont minden teherhelyzetre külön oldd meg a modellt: ezt teszi a [hatásvonalas példaprogram](/hu/solver/scripts#an-influence-line-as-csv).

## Az EduBeam alkalmazásban {#in-the-edubeam-app}

Az alkalmazás egyszerre egy terhelési esetet old meg, így a kombinációk terén a könyvtár többet nyújt. A több esetet tartalmazó modell ettől még esetenként [megrajzolható](/hu/solver/drawing): az @edubeam/plot `StructurePlot` komponense `loadCase` propként a `solver.loadCases` egy indexét kapja.
