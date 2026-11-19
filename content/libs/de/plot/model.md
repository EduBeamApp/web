---
title: Zeichenmodell
description: "Das als JSON serialisierbare PlotModel, das modelFromSolver aus einem berechneten Modell erzeugt: stückweise Polynome, exakte Werte und Extremwerte."
order: 9
---

# Zeichenmodell

Alles, was @edubeam/plot zeichnet, stammt aus einem `PlotModel`: einfachen Daten, die `modelFromSolver` aus einem berechneten Modell von @edubeam/fem ausliest. Es enthält die Geometrie, die Lager, die Lasten, die Auflagerreaktionen und die Ergebnisse jedes Stabs als exakte Polynome. Es lässt sich als JSON serialisieren, kann also beim Build erzeugt und statt des Solvers ausgeliefert werden, und es ist der einfachste Weg, exakte Werte und Extremwerte eines berechneten Tragwerks abzulesen.

```ts
import { modelFromSolver } from '@edubeam/plot'

const model = modelFromSolver(solver) // oder modelFromSolver(solver, { loadCase: 1 })
```

`results` ist nur vorhanden, wenn der Lastfall berechnet ist. Ohne Ergebnisse zeichnen die Komponenten nur das Modell, und mit [`reactionLabels: 'names'`](/de/plot/structure-plot#reactions-as-unknowns) trotzdem die unbekannten Auflagerreaktionen; ein nicht berechnetes Modell kann also ein Übungsblatt sein.

## Das Format {#the-format}

Alles ist in SI-Einheiten (m, N, N·m, N/m, K, rad) und in den Achsen des Solvers angegeben: x nach rechts, z nach unten, Verdrehungen auf dem Bildschirm gegen den Uhrzeigersinn positiv.

```ts
interface PlotModel {
  readonly nodes: readonly PlotNode[]
  readonly members: readonly PlotMember[]
  readonly loads: readonly PlotLoad[]
  readonly results?: PlotResults // nur für einen berechneten Lastfall
}

interface PlotNode {
  readonly id: string
  readonly x: number
  readonly z: number
  readonly fixity: { readonly dx: boolean; readonly dz: boolean; readonly ry: boolean } // gehaltene Freiheitsgrade
  readonly angle: number // Drehung der Achsen eines gedrehten Lagers, rad, auf dem Bildschirm im Uhrzeigersinn
}

interface PlotMember {
  readonly id: string
  readonly start: string // Knoten-IDs
  readonly end: string
  readonly hinges: readonly [boolean, boolean]
}

interface PlotResults {
  readonly members: Readonly<Record<string, MemberResults>> // nach Stab-ID
  readonly reactions: readonly PlotReaction[]
}

interface MemberResults {
  readonly N: Piecewise // Normalkraft, Zug positiv
  readonly V: Piecewise // Querkraft
  readonly M: Piecewise // Biegemoment, positiv bei Zug auf der Seite der lokalen +z-Achse
  readonly u: Piecewise // Verschiebung in lokaler x-Richtung
  readonly w: Piecewise // Verschiebung in lokaler z-Richtung
}

interface PlotReaction {
  readonly node: string
  readonly dof: 'dx' | 'dz' | 'ry'
  readonly value: number // Kraft auf das Tragwerk in Richtung der Knotenachse, N (N·m für ry)
}
```

Es gibt sieben Arten von Lasten, unterschieden durch `kind`:

| `kind` | Felder | Bedeutet |
| --- | --- | --- |
| `'nodalForce'` | `node`, `fx`, `fz` | eine Kraft an einem Knoten, globale Komponenten, N |
| `'nodalMoment'` | `node`, `my` | ein Moment an einem Knoten, N·m |
| `'distributed'` | `member`, `start`, `end`, `local` | eine linear veränderliche Streckenlast, `{ fx, fz }` an jedem Ende, N/m; bei gleichen Werten eine Gleichlast |
| `'pointForce'` | `member`, `at`, `fx`, `fz`, `local` | eine Kraft `at` Meter vom Stabanfang |
| `'pointMoment'` | `member`, `at`, `my` | ein Einzelmoment auf einem Stab |
| `'temperature'` | `member`, `uniform`, `gradient` | K: die Änderung im Schwerpunkt und unten minus oben |
| `'prescribed'` | `node`, `dx?`, `dz?`, `ry?` | eine Lagerverschiebung in den Knotenachsen, m und rad |

`local` ist `true`, wenn die Komponenten in Richtung der lokalen x- und z-Achse des Stabs statt der globalen Achsen angegeben sind.

## Stückweise Polynome {#piecewise-polynomials}

Das Ergebnis eines Stabs ist ein `Piecewise`: eine Liste von Abschnitten, jeder ein Polynom über einen Teil des Stabs. Ein neuer Abschnitt beginnt überall dort, wo eine Einzellast oder ein Einzelmoment einen Knick oder Sprung im Ergebnis erzeugt.

```ts
interface Piece {
  readonly x0: number // m vom Stabanfang
  readonly x1: number
  readonly c: readonly number[] // Wert = Σ c[k]·sᵏ, mit s = (x − x0)/(x1 − x0)
}
type Piecewise = readonly Piece[]
```

N, V und M sind höchstens kubisch, die Durchbiegung höchstens fünften Grades, sodass wenige Koeffizienten das Ergebnis des Solvers exakt wiedergeben. Die Querkraft eines Trägers von 6 m mit 20 kN bei 2 m besteht aus zwei konstanten Abschnitten:

```json
[{ "x0": 0, "x1": 2, "c": [13333.33] }, { "x0": 2, "x1": 6, "c": [-6666.67] }]
```

## Werte selbst ablesen {#reading-values-yourself}

Die Funktionen, die die Verläufe zeichnen, lesen sie auch ab, exakt und ohne Abtasten:

```ts
import { extremes, innerBreaks, modelFromSolver, valueAt } from '@edubeam/plot'

// Einfeldträger 6 m, 20 kN bei 2 m von A, schubstarrer IPE 200
const model = modelFromSolver(solver)
const { V, M, w } = model.results!.members['1']

innerBreaks(V) // [2]: die Abschnitte treffen sich an der Last
valueAt(V, 2, 'left') // 13333.3 N, unmittelbar vor der Last
valueAt(V, 2, 'right') // -6666.7 N, unmittelbar danach
extremes(M) // max 26666.7 N·m bei x = 2
extremes(w) // max 0.018973 m bei x = 2.734
```

`extremes` gibt `{ max, min }` zurück, jeweils `{ x, value, side }`, oder `null` für eine leere Liste. Die größte Durchbiegung liegt nicht unter der Last, sondern bei $x = L - \sqrt{(L^2 - a^2)/3} = 2{,}734$ m und beträgt $P\,a\,(L^2 - a^2)^{3/2}/9\sqrt{3}\,EIL = 18{,}97$ mm, wie es die Formel für eine außermittige Last ergibt.

So findet der [Aufgabengenerator](/de/plot/exercises#the-generator) die extremen Momente für sein Lösungsblatt. Den Rest listet die Seite [Funktionen](/de/plot/functions#piecewise-polynomials) auf: Neigungen, Extremwerte innerhalb eines Abschnitts, Polynomgrade und Bézierkurven.

## Als JSON ausliefern {#ship-it-as-json}

`JSON.stringify(model)` genügt, und `JSON.parse` liefert ein Modell zurück, das genau so gezeichnet wird wie aus dem Solver. Ein Portalrahmen mit einer Streckenlast und einer Einzellast braucht weniger als 2 kB. Siehe [Einbinden](/de/plot/embedding#ship-the-drawing-not-the-solver). Ein Modell lässt sich auch an [`structureSvg`](/de/plot/functions#a-standalone-svg-file) übergeben, das es als SVG-Datei schreibt.
