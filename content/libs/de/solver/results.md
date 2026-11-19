---
title: Ergebnisse auslesen
description: "Auflagerreaktionen, Knotenverschiebungen, Schnittgrößen an jeder Stelle eines Stabs, Biegelinien und Stabendkräfte aus einem @edubeam/fem-Modell auslesen."
order: 10
---

# Ergebnisse auslesen {#reading-results}

Nach `solve()` lesen Sie die Ergebnisse an den Knoten und den Stäben aus, jeweils für einen bestimmten Lastfall. Alle Beispiele auf dieser Seite lesen dasselbe Modell aus: einen schubstarren Einfeldträger IPE 200 mit 6 m Spannweite und einer Einzellast von 20 kN in 2 m Abstand von A:

```ts [results.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 }) // schubstarr

const A = domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
const B = domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
const lc = solver.loadCases[0]
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], true)
solver.solve()
```

::model-figure{caption="20 kN bei 2 m auf einem Feld von 6 m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M, w]
show: [nodeLabels]
---
::

## Was wo ausgelesen wird {#what-to-read-where}

| Ergebnis | Aufruf | Rückgabe |
| --- | --- | --- |
| Auflagerreaktionen | `node.getReactions(lc)` | `{ dofs, values }`: N, N·m |
| Verschiebungen | `node.getUnknowns(lc, dofs)` | m, rad |
| N, V oder M an einer Stelle | `beam.computeBendingMomentAt(lc, x)` | eine Zahl: N, N·m |
| N, V oder M entlang eines Stabs | `beam.computeBendingMoment(lc, n)` | `{ x, M }`, n + 1 Punkte |
| Biegelinie | `beam.computeLocalDefl(lc, n)` | `{ u, w }`, n + 1 Punkte, m |
| Stabendkräfte | `beam.computeEndForces(lc)` | eine mathjs-Matrix mit 6 Werten |

Für N und V heißen die Methoden `computeNormalForceAt` und `computeShearForceAt` bzw. `computeNormalForce` und `computeShearForce`; sie geben `{ x, N }` und `{ x, V }` zurück. Die Vorzeichen stehen unter [Einheiten und Vorzeichen](/de/solver/conventions#signs-of-the-results).

## Auflagerreaktionen {#reactions}

`getReactions` liefert eine Auflagerreaktion pro Freiheitsgrad, den das Lager hält: `dofs` listet sie in der Reihenfolge auf, in der sie an `createNode` übergeben wurden, und `values` enthält die Reaktionen in derselben Reihenfolge. `values` ist eine **mathjs-Matrix**, wenn es mehrere sind, und ein einfaches Array, wenn es eine ist. Eine kleine Hilfsfunktion macht in beiden Fällen ein Array daraus:

```ts
/** Wandelt eine mathjs-Matrix, ein Array oder eine Zahl in ein einfaches Array um. */
const list = (v: unknown): number[] =>
  typeof v === 'number'
    ? [v]
    : Array.isArray(v)
      ? v
      : (v as { toArray(): number[] }).toArray()

A.getReactions(lc).dofs // [0, 2]: DofID.Dx, DofID.Dz
list(A.getReactions(lc).values) // [0, -13333.3]
list(B.getReactions(lc).values) // [-6666.7]
```

Um eine bestimmte Auflagerreaktion unabhängig von der Reihenfolge herauszugreifen, suchen Sie ihren Freiheitsgrad: `list(values)[dofs.indexOf(DofID.Dz)]`, wie im [Beispiel zum Durchlaufträger](/de/solver/beams#a-continuous-beam).

Eine Auflagerreaktion ist die Kraft, die das Lager auf das Tragwerk ausübt: −13 333 N in z-Richtung sind 13,3 kN nach oben, $P\,b/L = 20 \cdot 4/6$. An einem Knoten mit [gedrehten Achsen](/de/solver/nodes-supports#inclined-supports) stehen die Auflagerreaktionen in diesen Achsen; `getReactions(lc, true)` dreht sie in globale Achsen und gibt alle drei Freiheitsgrade zurück, mit 0, wo nichts gehalten wird. Ein Knoten ohne Lager liefert `{ dofs: [], values: [] }`.

## Verschiebungen {#displacements}

`getUnknowns` liest beliebige Freiheitsgrade eines Knotens aus, gelagert oder nicht:

```ts
list(A.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])) // [0, 0, -0.0108924]
```

A verdreht sich um 0,010892 rad im Uhrzeigersinn, $P\,b\,(L^2 - b^2)/6EIL$. Fragen Sie nur einen Freiheitsgrad ab, gibt `getUnknowns` eine einfache Zahl zurück, obwohl TypeScript eine Matrix deklariert: Auch das erledigt `list`.

## Schnittgrößen entlang eines Stabs {#internal-forces-along-a-member}

Die Methoden `…At` liefern einen Wert in `x` Metern Abstand vom ersten Knoten des Stabs:

```ts
beam.computeShearForceAt(lc, 1) // 13333.3 N
beam.computeShearForceAt(lc, 2) // -6666.7 N: an der Last der Wert dahinter
beam.computeBendingMomentAt(lc, 2) // 26666.7 N·m: R_A · 2
```

Wo eine Einzellast einen Sprung erzeugt, ist der Wert genau an der Last der auf ihrer anderen Seite. Für die Seite davor fragen Sie ein winziges Stück vorher ab, etwa bei `x - 1e-9`.

Die Array-Methoden werten einen Stab an n + 1 gleichmäßig verteilten Punkten aus, die Enden eingeschlossen:

```ts
beam.computeBendingMoment(lc, 3)
// { x: [0, 2, 4, 6], M: [0, 26666.7, 13333.3, 0] }, bis auf Rundungsfehler
```

Rechnen Sie mit Rundungsfehlern wie `-3.6e-12`, wo der exakte Wert 0 ist: Formatieren Sie Zahlen vor der Ausgabe mit `toFixed`. Den größten Wert entlang eines Stabs liefert eine feine Auswertung, etwa `computeBendingMoment(lc, 500)`, wie im [Beispiel zum Durchlaufträger](/de/solver/beams#a-continuous-beam). Unter Streckenlasten ist M ein Polynom, sein exaktes Extremum liegt also dort, wo V durch null geht; [@edubeam/plot](/de/plot/model#reading-values-yourself) findet es exakt.

## Biegelinie {#deflected-shape}

```ts
beam.computeLocalDefl(lc, 3)
// { u: [0, 0, 0, 0], w: [0, 0.0174279, 0.0152494, 0] }
```

`computeLocalDefl` liefert die Verschiebungen entlang und quer zum Stab, `u` und `w`, in seinen lokalen Achsen; `computeGlobalDefl` dieselben Punkte in globalem x und z. Die Durchbiegung unter der Last, 17,43 mm, ist $P\,a^2 b^2/3EIL$. Der Verlauf zwischen den Knoten ist exakt und nicht aus den Endwerten interpoliert. Wie Sie ihn zeichnen, steht unter [Ergebnisse zeichnen](/de/solver/drawing).

## Stabendkräfte {#end-forces}

```ts
beam.computeEndForces(lc).toArray()
// [0, -13333.3, 0, 0, -6666.7, 0]: X12, Z12, M12, X21, Z21, M21
```

Die Kräfte, die die beiden Knoten auf den Stab ausüben, in seinen lokalen Achsen: die Zahlen der Tabelle *Elementergebnisse* der App, erklärt unter [Stabendkräfte](/de/elements/conventions#end-forces-element-results-table).

## Ergebnisse als Zahlen zum Nachprüfen {#results-as-numbers-to-check}

Jeder Wert oben stimmt mit seiner geschlossenen Formel überein. Die Seite [Ergebnisse von Hand prüfen](/de/guide/verification) rechnet viele weitere Lehrbuchfälle durch, berechnet von genau diesem Solver in Ihrem Browser.
