---
title: Knoten- und Stablasten
description: "Knotenkräfte und -momente sowie Gleich-, Trapez- und Einzellasten auf Stäben in globalen oder lokalen Achsen mit @edubeam/fem aufbringen, ändern und entfernen."
order: 6
group: Lasten
---

# Knoten- und Stablasten {#nodal-and-member-loads}

Lasten gehören zu einem Lastfall. Der Solver beginnt mit einem, `solver.loadCases[0]`, und jede Methode `create…` daran fügt eine Last hinzu und gibt sie zurück. Für mehrere Lastfälle und ihre Kombinationen siehe [Lastfälle](/de/solver/load-cases).

Die Werte sind in N, N/m und N·m angegeben und folgen den [Achsen](/de/solver/conventions#axes): +z zeigt nach unten, ein positives Moment dreht gegen den Uhrzeigersinn.

## Ein Träger mit allen Lastarten {#a-beam-with-every-kind}

Ein 8 m langer Träger auf einem Festlager und einem Loslager, mit einer Streckenlast, die von 4 auf 10 kN/m ansteigt, einer Einzellast von 20 kN, einem Einzelmoment von 10 kNm und einer Horizontalkraft am Loslager:

```ts [loads.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // Festlager
domain.createNode('B', [8, 0, 0], [DofID.Dz]) // Loslager
domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
// 4 kN/m in A, ansteigend auf 10 kN/m in B, nach unten
lc.createBeamElementTrapezoidalEdgeLoad(1, [0, 4e3], [0, 10e3], false)
// [fx, fz, my, a]: 20 kN nach unten, 2 m von A
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], false)
// ein Einzelmoment von 10 kNm gegen den Uhrzeigersinn, 6 m von A
lc.createBeamConcentratedLoad(1, [0, 0, 10e3, 6], false)
// 5 kN nach rechts in B
lc.createNodalLoad('B', { [DofID.Dx]: 5e3 })
solver.solve()

// getReactions liefert eine mathjs-Matrix oder ein Array: in ein Array umwandeln
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

console.log(list(domain.getNode('A').getReactions(lc).values))
console.log(list(domain.getNode('B').getReactions(lc).values))
```

```text [Ausgabe]
[ -5000, -40250 ]
[ -35750 ]
```

Von Hand: Die Streckenlast ergibt 56 kN mit einem Hebelarm von 4,571 m ab A. Das Momentengleichgewicht um A liefert $8R_B = 56 \cdot 4{,}571 + 20 \cdot 2 - 10 = 286$, also $R_B = 35{,}75$ kN nach oben und $R_A = 76 - 35{,}75 = 40{,}25$ kN nach oben. Das Festlager nimmt außerdem die 5 kN auf; der ganze Träger steht dadurch unter einer Zugkraft von 5 kN.

::model-figure{caption="Dieselben Lasten. Die Abbildung setzt das Einzelmoment auf einen Knoten C bei 6 m, was dieselben Ergebnisse liefert."}
---
nodes: { A: [0, 0], C: [6, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: [4, 8.5] }
  - { member: 2, qz: [8.5, 10] }
  - { member: 1, pz: 20, at: 2 }
  - { node: C, my: 10 }
  - { node: B, fx: 5 }
results: [M]
show: [nodeLabels]
labels: horizontal
---
::

## Knotenlasten {#nodal-loads}

```ts
lc.createNodalLoad(node, { [DofID.Dx]: fx, [DofID.Dz]: fz, [DofID.Ry]: my }, lcs)
```

Geben Sie nur die Komponenten an, die Sie brauchen. Die Werte gelten in globalen Achsen oder, wenn `lcs` auf `true` gesetzt ist, in den eigenen Achsen des Knotens, für einen mit [`updateLcs`](/de/solver/nodes-supports#inclined-supports) gedrehten Knoten. Eine Kraft auf einen Freiheitsgrad, den das Lager hält, geht direkt in die Auflagerreaktion ein und erzeugt keine Biegung.

## Stablasten {#member-loads}

| Methode | Werte | Last |
| --- | --- | --- |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | N/m | gleichmäßig über den ganzen Stab |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | N/m | linear veränderlich, vom ersten zum zweiten Knoten |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | N, N·m, m | eine Kraft und ein Moment, `a` Meter vom ersten Knoten |

Streckenlasten wirken immer auf den ganzen Stab. Für eine Last auf einem Teil des Felds teilen Sie den Stab mit einem Knoten dort, wo die Last beginnt: Ein zusätzlicher Knoten ändert kein Ergebnis. Eine Einzellast oder ein Einzelmoment kann an jeder Stelle des Stabs sitzen.

### Globale oder lokale Achsen {#global-or-local-axes}

Das letzte Argument, `lcs`, gibt an, in welchen Achsen die Komponenten stehen:

- `false`: globale x- und z-Achse. `fz` wirkt vertikal, unabhängig von der Neigung des Stabs.
- `true`: die lokale x-Achse (entlang des Stabs) und z-Achse (quer dazu). `fz` wirkt senkrecht zum Stab.

Bei einem horizontalen Stab, der von links nach rechts gezeichnet ist, sind beide gleich; bei einem von rechts nach links gezeichneten Stab zeigt das lokale `fz` nach oben.

::callout{type="info" title="Streckenlasten gelten pro Meter Stablänge"}
Ob global oder lokal: Streckenlasten wirken pro Meter der tatsächlichen Stablänge. Bei einem 5 m langen Sparren mit 4 m horizontaler Spannweite ergibt `[0, 10e3]` in globalen Achsen insgesamt 50 kN. Eine Schneelast von 10 kN/m, bezogen auf die horizontale Projektion, entspricht $10 \cdot 4/5 = 8$ kN/m entlang des Sparrens: Geben Sie `[0, 8e3]` an.
::

## Lasten ändern oder entfernen {#change-or-remove-a-load}

Jede Methode `create…` gibt die Last zurück. Ändern Sie ihre Werte und berechnen Sie erneut:

```ts
const q = lc.createBeamElementUniformEdgeLoad(1, [0, 10e3], true)
solver.solve()
q.values = [0, 20e3] // doppelte Last
solver.solve()
```

Die Lasten liegen in einfachen Arrays, `lc.nodalLoadList` und `lc.elementLoadList` (Stab- und Temperaturlasten); `lc.elementLoadList.splice(index, 1)` entfernt also eine. Die Eigenschaften jeder Last stehen in der [Referenz](/de/solver/reference#loads).

Auch Temperaturänderungen und Auflagersenkungen sind Lasten: siehe [Temperatur und Auflagersenkungen](/de/solver/temperature-settlements).
