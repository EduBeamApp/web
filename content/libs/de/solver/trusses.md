---
title: Fachwerke
description: "Ein gelenkiges Warren-Fachwerk in @edubeam/fem, jede Stabkraft mit dem Ritterschnitt geprüft, und eine Schleife, die Fachwerke mit beliebig vielen Feldern erzeugt."
order: 14
---

# Fachwerke {#trusses}

Ein Fachwerk besteht aus Stäben, die an beiden Enden gelenkig angeschlossen und nur in den Knoten belastet sind; jeder Stab trägt also nur eine Normalkraft. Dieses Beispiel baut ein Warren-Fachwerk (Strebenfachwerk) aus zwei Listen auf, prüft jede Stabkraft von Hand und erzeugt dann in einer Schleife Fachwerke beliebiger Größe.

::model-figure{caption="Ein Warren-Fachwerk: 9 m Spannweite, 1,8 m Höhe, 8 kN an jedem oberen Knoten"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members:
  - { nodes: [A, B], hinges: [true, true] }
  - { nodes: [B, C], hinges: [true, true] }
  - { nodes: [C, D], hinges: [true, true] }
  - { nodes: [E, F], hinges: [true, true] }
  - { nodes: [F, G], hinges: [true, true] }
  - { nodes: [A, E], hinges: [true, true] }
  - { nodes: [E, B], hinges: [true, true] }
  - { nodes: [B, F], hinges: [true, true] }
  - { nodes: [F, C], hinges: [true, true] }
  - { nodes: [C, G], hinges: [true, true] }
  - { nodes: [G, D], hinges: [true, true] }
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: [N, w]
show: [nodeLabels]
---
::

```ts [truss.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })

// Ein Warren-Fachwerk: 9 m Spannweite, 1.8 m Höhe, Untergurt A-B-C-D, Obergurt E-F-G
const nodes: [string, number, number, DofID[]][] = [
  ['A', 0, 0, [DofID.Dx, DofID.Dz]],
  ['B', 3, 0, []],
  ['C', 6, 0, []],
  ['D', 9, 0, [DofID.Dz]],
  ['E', 1.5, -1.8, []],
  ['F', 4.5, -1.8, []],
  ['G', 7.5, -1.8, []],
]
for (const [label, x, z, support] of nodes) {
  domain.createNode(label, [x, 0, z], support)
}

// Jede Bezeichnung nennt die beiden Knoten. An beiden Enden gelenkig: nur Normalkraft.
const bars = ['AB', 'BC', 'CD', 'EF', 'FG', 'AE', 'EB', 'BF', 'FC', 'CG', 'GD']
const members = bars.map((bar) =>
  domain.createBeam2D(bar, [bar[0], bar[1]], 1, 1, [true, true])
)

const lc = solver.loadCases[0]
for (const top of ['E', 'F', 'G']) {
  lc.createNodalLoad(top, { [DofID.Dz]: 8e3 }) // 8 kN nach unten
}
solver.solve()

for (const bar of members) {
  const n = bar.computeNormalForceAt(lc, 0) / 1e3
  console.log(bar.label, n.toFixed(2), n > 0 ? 'tension' : 'compression')
}
```

```text [Ausgabe]
AB 10.00 tension
BC 16.67 tension
CD 10.00 tension
EF -13.33 compression
FG -13.33 compression
AE -15.62 compression
EB 5.21 tension
BF -5.21 compression
FC -5.21 compression
CG 5.21 tension
GD -15.62 compression
```

Die Normalkraft eines Stabs ist konstant, es genügt also, sie bei `x = 0` auszulesen. Die zweibuchstabigen Bezeichnungen sind zugleich die Knotenpaare: `bar[0]` und `bar[1]`.

## Von Hand prüfen {#check-it-by-hand}

Jedes Lager trägt die Hälfte der 24 kN, also 12 kN. Schneiden Sie das Fachwerk und bilden Sie das Momentengleichgewicht um den Knoten gegenüber dem geschnittenen Stab, wie beim [Ritterschnitt](/de/tutorials/truss):

| Stab | Schnitt | Kraft |
| --- | --- | --- |
| BC, Untergurt | Momente um F: $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$ | 16,67 kN Zug |
| EF, Obergurt | Momente um B: $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$ | 13,33 kN Druck |
| AE, Enddiagonale | Knoten A: $12 \cdot \sqrt{1{,}5^2 + 1{,}8^2}/1{,}8$ | 15,62 kN Druck |
| EB, Diagonale | Querkraft im Feld, $12 - 8 = 4$ kN: $4 \cdot 2{,}343/1{,}8$ | 5,21 kN Zug |

Der Querschnitt ändert die Stabkräfte eines statisch bestimmten Fachwerks nicht; er bestimmt nur, wie weit sich die Knoten verschieben. Die Abbildung oben verwendet einen anderen Querschnitt, den der EduBeam-App, und ergibt dieselben Kräfte.

## Beliebig viele Felder {#any-number-of-panels}

Um Fachwerke zu erzeugen, für Übungsaufgaben oder eine Parameterstudie, bauen Sie Knoten und Stäbe in einer Schleife Feld für Feld auf. Mit `panels = 3` entsteht genau das obige Fachwerk, und das Programm gibt dieselben Kräfte aus; ändern Sie `panels`, `w` und `h` für ein anderes.

```ts [warren.ts]
import { type Beam2D, DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })
const lc = solver.loadCases[0]

const panels = 3 // Felder des Untergurts
const w = 3 // Feldbreite, m
const h = 1.8 // Höhe, m

// Untere Knoten b0, b1, … auf Festlager und Loslager; obere Knoten t0, t1, … dazwischen
for (let i = 0; i <= panels; i++) {
  const ends = i === 0 ? [DofID.Dx, DofID.Dz] : i === panels ? [DofID.Dz] : []
  domain.createNode(`b${i}`, [i * w, 0, 0], ends)
}
for (let i = 0; i < panels; i++) {
  domain.createNode(`t${i}`, [(i + 0.5) * w, 0, -h])
  lc.createNodalLoad(`t${i}`, { [DofID.Dz]: 8e3 })
}

const members: Beam2D[] = []
const bar = (a: string, b: string) =>
  members.push(domain.createBeam2D(`${a}-${b}`, [a, b], 1, 1, [true, true]))
for (let i = 0; i < panels; i++) {
  bar(`b${i}`, `b${i + 1}`) // Untergurt
  bar(`b${i}`, `t${i}`) // Diagonale nach oben
  bar(`t${i}`, `b${i + 1}`) // Diagonale nach unten
  if (i > 0) bar(`t${i - 1}`, `t${i}`) // Obergurt
}
solver.solve()

for (const m of members) {
  console.log(m.label, (m.computeNormalForceAt(lc, 0) / 1e3).toFixed(2))
}
```

Die Rechenzeit des Solvers wächst mit der Größe schnell: Einige Dutzend Felder sind kein Problem, siehe [Modellgröße](/de/solver/solving#model-size). Wie Sie jedes erzeugte Fachwerk zeichnen, mit oder ohne Lösungen, steht unter [Übungsaufgaben und Klausuren](/de/plot/exercises) in der Dokumentation von @edubeam/plot.

## Worauf Sie achten sollten {#things-to-notice}

- **Gelenke an jedem Stabende.** Dann kann sich jeder Knoten frei verdrehen, und der Solver meldet seine Verdrehung als 0. Ein Moment an einem solchen Knoten kann von nichts aufgenommen werden, und [die Berechnung scheitert](/de/solver/solving#when-solving-fails).
- **Lasten in den Knoten.** Eine Last entlang eines Stabs würde ihn biegen: Dann ist er ein Balken und kein Fachwerkstab mehr und erhält einen Momentenverlauf.

Das [Tutorial zum ebenen Fachwerk](/de/tutorials/truss) baut ein Fachwerk in der EduBeam-App auf, und die Seite [Fachwerkstab](/de/elements/truss) leitet die Steifigkeit des Stabs her.
