---
title: Stäbe und Gelenke
description: "Knoten mit Beam2D-Stäben verbinden, Momente mit Endgelenken freigeben, Fachwerkstäbe modellieren und Steifigkeits- und Transformationsmatrix auslesen."
order: 5
---

# Stäbe und Gelenke {#members-and-hinges}

Jeder Stab ist ein `Beam2D`: ein gerader Timoshenko-Balken mit zwei Knoten in der x-z-Ebene, der Normalkraft, Querkraft und Biegemoment überträgt. Gelenke an seinen Enden geben dort das Moment frei. Die Codeausschnitte verwenden `solver`, `domain` und `lc` eines Programms wie in [Erste Schritte](/de/solver/getting-started), mit dessen Material `'steel'` und Querschnitt `'IPE200'`.

## Stab anlegen {#create-a-member}

```ts
domain.createBeam2D(label, [startNode, endNode], material, crossSection, hinges)
```

| Argument | Typ | Bedeutung |
| --- | --- | --- |
| `label` | `string \| number` | Seine Bezeichnung, als String gespeichert |
| `nodes` | `[label, label]` | Erster und zweiter Knoten. Die lokale x-Achse verläuft vom ersten zum zweiten: siehe [Stabrichtung](/de/solver/conventions#member-direction). |
| `mat`, `cs` | `string \| number` | Bezeichnungen eines Materials und eines Querschnitts |
| `hinges` | `[boolean, boolean]` | Gelenk am ersten bzw. am zweiten Knoten. Optional; Standard `[false, false]`, biegesteife Enden. |

Die Methode gibt den `Beam2D` zurück: Speichern Sie ihn in einer Variablen, um Ergebnisse auszulesen. `domain.getElement(label)` findet ihn wieder, allerdings mit dem allgemeinen Typ `Element`; TypeScript verlangt deshalb `as Beam2D`, bevor Sie Ergebnisse daraus lesen.

Stäbe, die ohne Gelenke an einem Knoten zusammentreffen, sind biegesteif verbunden: Sie verdrehen sich gemeinsam. Knoten, Material und Querschnitt können Sie in beliebiger Reihenfolge anlegen, solange beim Berechnen alle existieren; fehlt einer, wirft `solve()` einen `RangeError`, der ihn benennt.

## Endgelenke {#end-hinges}

Ein Gelenk gehört zu einem Stabende, nicht zu einem Knoten. Hier beginnt Stab 2 mit einem Gelenk in C; C überträgt also Querkraft, aber kein Moment vom Feld C–D auf den Kragträger A–C:

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

cd.computeBendingMomentAt(lc, 0) // 0 im Gelenk
cd.computeBendingMomentAt(lc, 2) // 20000 N·m: qL²/8 des 4-m-Felds
ac.computeBendingMomentAt(lc, 0) // -40000 N·m: die 20 kN aus C–D, 2 m entfernt
```

::model-figure{caption="Ein Kragträger, der ein gelenkig angeschlossenes Feld trägt: kein Moment in C"}
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

Treffen mehrere Stäbe an einem Gelenkknoten zusammen, genügt ein Gelenk an jedem Stabende außer einem. Ein Gelenk an jedem Ende funktioniert auch: Dann verdreht nichts den Knoten, und der Solver meldet seine Verdrehung als 0. Ein Moment, das an einem solchen Knoten angreift, kann dann aber von nichts aufgenommen werden, und [die Berechnung scheitert](/de/solver/solving#when-solving-fails).

## Fachwerkstäbe {#truss-bars}

Mit Gelenken an beiden Enden überträgt ein Stab nur Normalkraft, solange er nur an seinen Knoten belastet wird: ein Fachwerkstab.

```ts
domain.createBeam2D('AE', ['A', 'E'], 'steel', 'bar', [true, true])
```

Das [Fachwerkbeispiel](/de/solver/trusses) berechnet auf diese Weise ein ganzes Fachwerk. Das Fachwerkbeispiel der EduBeam-App verwendet stattdessen biegesteife Knoten mit einer so großen Fläche, dass die Biegemomente neben den Normalkräften vernachlässigbar sind. Beide Modelle sind zulässig; sie unterscheiden sich nur in diesen kleinen Momenten. Die Steifigkeitsmatrix des Stabs wird im Theoriehandbuch auf der Seite [Fachwerkstab](/de/elements/truss) hergeleitet.

## Die Matrizen des Elements {#the-element-s-matrices}

Wer das Verfahren selbst lehrt, kann sich von einem `Beam2D` seine Matrizen als [mathjs](https://mathjs.org)-Matrizen geben lassen; `.toArray()` macht daraus `number[][]`:

| Methode | Liefert |
| --- | --- |
| `computeGeo()` | `{ l, dx, dz }`: Länge und Projektionen, m |
| `computeLocalStiffnessMtrx().answer` | 6 × 6 Steifigkeitsmatrix in lokalen Achsen, Gelenke herauskondensiert |
| `computeT()` | 6 × 6 Transformationsmatrix von globalen in lokale Achsen |
| `computeStiffness()` | 6 × 6 Steifigkeitsmatrix in globalen Achsen, $T^T K_l T$ |
| `computeShearFactor()` | $\Phi = 12EI_y/kGAL^2$ |

```ts
ac.computeStiffness().toArray() // number[][], N/m, N und N·m
```

Die Freiheitsgrade sind in der Reihenfolge $u_1, w_1, \varphi_1, u_2, w_2, \varphi_2$ angeordnet. Die Seite [Balkenelement](/de/elements/beam) des Theoriehandbuchs leitet diese Matrizen her, und [Wie EduBeam ein Modell berechnet](/de/elements/analysis) zeigt, wie sie assembliert werden.
