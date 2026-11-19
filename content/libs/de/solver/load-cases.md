---
title: Lastfälle
description: "Mehrere Lastfälle eines @edubeam/fem-Modells auf einmal berechnen und die Ergebnisse zu Lastfallkombinationen und Umhüllenden überlagern."
order: 8
---

# Lastfälle {#load-cases}

Ein Lastfall ist eine Gruppe von Lasten, die gemeinsam berechnet werden. Der Solver beginnt mit einem; fügen Sie weitere hinzu, und ein einziges `solve()` berechnet sie alle mit derselben Steifigkeitsmatrix. Die Berechnung ist linear, die Ergebnisse verschiedener Lastfälle lassen sich also skalieren und addieren: Mehr ist eine Lastfallkombination nicht.

## Lastfall hinzufügen {#add-a-load-case}

```ts [load-cases.ts]
import { DofID, LinearStaticSolver, LoadCase } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const dead = solver.loadCases[0] // der Lastfall, mit dem jeder Solver startet
const live = new LoadCase('live', domain)
solver.loadCases.push(live)

dead.createBeamElementUniformEdgeLoad(1, [0, 10e3], true) // 10 kN/m
live.createBeamConcentratedLoad(1, [0, 20e3, 0, 3], true) // 20 kN in Feldmitte
solver.solve() // berechnet alle Lastfälle

console.log(beam.computeBendingMomentAt(dead, 3)) // qL²/8
console.log(beam.computeBendingMomentAt(live, 3)) // PL/4
```

```text [Ausgabe]
45000
30000
```

Jede Ergebnismethode erwartet den Lastfall, den sie auslesen soll. Der erste Lastfall heißt `'DefaultLC'`; Bezeichnungen sind nur Namen, der Solver unterscheidet die Lastfälle am Objekt.

## Kombinieren {#combine-them}

Multiplizieren Sie das Ergebnis jedes Lastfalls mit seinem Faktor und addieren Sie. Für den Grenzzustand der Tragfähigkeit nach Eurocode, $1{,}35\,G + 1{,}5\,Q$, in Feldmitte:

```ts
1.35 * beam.computeBendingMomentAt(dead, 3) +
  1.5 * beam.computeBendingMomentAt(live, 3) // 105750 N·m
```

Dasselbe gilt für Auflagerreaktionen, Verschiebungen und jedes andere Ergebnis. Entlang eines ganzen Stabs kombinieren Sie Punkt für Punkt: Die Arrays von `computeBendingMoment(lc, n)` verwenden in jedem Lastfall dieselben `x`.

```ts
const n = 60
const g = beam.computeBendingMoment(dead, n).M
const q = beam.computeBendingMoment(live, n).M
const uls = g.map((m, i) => 1.35 * m + 1.5 * q[i])
Math.max(...uls) // 105750 N·m, bei x = 3
```

Eine Umhüllende, also der größte und der kleinste Wert über mehrere Kombinationen, ist ein punktweises `Math.max` und `Math.min` über solche Arrays. Für eine Wanderlast berechnen Sie stattdessen jede Laststellung einzeln: Das [Beispiel zur Einflusslinie](/de/solver/scripts#an-influence-line-as-csv) macht genau das.

## In der EduBeam-App {#in-the-edubeam-app}

Die App berechnet jeweils nur einen Lastfall; bei Kombinationen kann die Bibliothek also mehr. Ein Modell mit mehreren Lastfällen lässt sich trotzdem Lastfall für Lastfall [zeichnen](/de/solver/drawing): `StructurePlot` aus @edubeam/plot erwartet einen Index `loadCase` in `solver.loadCases`.
