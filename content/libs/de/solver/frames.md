---
title: Rahmen
description: "Ein vollständiges @edubeam/fem-Programm für einen Dreigelenkrahmen mit Stützen, biegesteifen Ecken und Mittelgelenk, die Ergebnisse von Hand geprüft."
order: 13
---

# Rahmen {#frames}

Ein Rahmen besteht aus Riegeln und Stützen, die an den Ecken biegesteif verbunden sind. Dieses Beispiel baut den Rahmen aus dem [Tutorial zum Dreigelenkrahmen](/de/tutorials/three-hinged-frame) im Code nach: zwei 4 m hohe Stützen mit Festlagern in A und E, ein 8 m langer Riegel mit einem Gelenk in C und 10 kN/m auf dem Riegel. Das Tutorial nummeriert die Knoten von 1 bis 5, hier heißen sie A bis E.

::model-figure{caption="Der Rahmen des Programms unten: Festlager in A und E, ein Gelenk in C, 10 kN/m"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, k: 1e32 }) // IPE 300

// z zeigt nach unten: Die Köpfe der 4 m hohen Stützen liegen bei z = -4
const pin = [DofID.Dx, DofID.Dz]
domain.createNode('A', [0, 0, 0], pin)
domain.createNode('B', [0, 0, -4])
domain.createNode('C', [4, 0, -4]) // das Mittelgelenk
domain.createNode('D', [8, 0, -4])
domain.createNode('E', [8, 0, 0], pin)

const column = domain.createBeam2D(1, ['A', 'B'], 1, 1) // von unten nach oben
const left = domain.createBeam2D(2, ['B', 'C'], 1, 1, [false, true]) // Gelenk in C
domain.createBeam2D(3, ['C', 'D'], 1, 1)
domain.createBeam2D(4, ['D', 'E'], 1, 1)

const lc = solver.loadCases[0]
for (const half of [2, 3]) {
  lc.createBeamElementUniformEdgeLoad(half, [0, 10e3], false)
}
solver.solve()

// getReactions liefert eine mathjs-Matrix oder ein Array: in ein Array umwandeln
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()
const kN = (v: number) => (v / 1e3).toFixed(2)

for (const label of ['A', 'E']) {
  const [rx, rz] = list(domain.getNode(label).getReactions(lc).values)
  console.log(`${label}: Rx = ${kN(rx)} kN, Rz = ${kN(rz)} kN`)
}
for (const x of [0, 2, 4]) {
  const m = left.computeBendingMomentAt(lc, x)
  console.log(`M at ${x} m from B = ${kN(m)} kNm`)
}
const top = column.computeBendingMomentAt(lc, 4)
console.log(`M at the top of column 1 = ${kN(top)} kNm`)
```

```text [Ausgabe]
A: Rx = 20.00 kN, Rz = -40.00 kN
E: Rx = -20.00 kN, Rz = -40.00 kN
M at 0 m from B = -80.00 kNm
M at 2 m from B = -20.00 kNm
M at 4 m from B = 0.00 kNm
M at the top of column 1 = -80.00 kNm
```

## Von Hand prüfen {#check-it-by-hand}

| Größe | Von Hand | Solver |
| --- | --- | --- |
| Vertikale Auflagerreaktionen | $q \cdot 8/2 = 40$ kN nach oben | $R_z = -40$ kN in A und E |
| Horizontale Auflagerreaktionen | aus $M_C = 0$ an der linken Hälfte: $(40 \cdot 4 - 10 \cdot 4 \cdot 2)/4 = 20$ kN, nach innen | $R_x = +20$ kN in A, $-20$ kN in E |
| Eckmoment | $-20 \cdot 4 = -80$ kNm | $-80$ kNm im Riegel und in der Stütze |
| Moment 2 m rechts von B | $-80 + 40 \cdot 2 - 10 \cdot 2^2/2 = -20$ kNm | $-20$ kNm |
| Moment im Gelenk | 0 | 0 |

## Worauf Sie achten sollten {#things-to-notice}

- **Stützen ragen nach oben, z ist also negativ.** Die Stützenköpfe liegen bei $z = -4$.
- **Die lokalen Achsen der Stütze.** Stab 1 verläuft von A nach oben zu B, seine lokale z-Achse zeigt also nach rechts, ins Rahmeninnere. Sein Moment am Kopf ist −80 kNm, wie das des Riegels in der Ecke: Zug außen. Definieren Sie die Stütze von B nach unten zu A, zeigt ihre lokale z-Achse nach links: Ihr Moment wechselt das Vorzeichen, und `x` läuft vom Kopf aus. Siehe [Stabrichtung](/de/solver/conventions#member-direction).
- **Ein Gelenk, ein Stabende.** Das Gelenk sitzt am Ende von Stab 2 in C; Stab 3 beginnt in C biegesteif. Ein freigegebenes Stabende genügt, um C zum Gelenk zu machen.
- **Globale Lasten auf dem Riegel.** `false` gibt die Last in globalen Achsen an: vertikal, unabhängig von der Neigung des Stabs. Bei einem horizontalen Riegel, der von links nach rechts definiert ist, ist das dasselbe wie lokal.

## Statisch unbestimmte Rahmen {#statically-indeterminate-frames}

Entfernen Sie das Gelenk, `[false, false]`, und aus dem Rahmen wird ein Zweigelenkrahmen mit einer statisch Überzähligen. Seine Schnittgrößen hängen dann davon ab, wie steif der Riegel im Vergleich zu den Stützen ist: Geben Sie den Stäben unterschiedliche Querschnitte, um es zu sehen. Die [Experimente im Tutorial](/de/tutorials/three-hinged-frame#_7-experiment) spannen die Fußpunkte ein und schieben den Rahmen seitlich, mit Zahlen zum Vergleichen. Die Seite [Folien und Skripte](/de/plot/slides) von @edubeam/plot zeichnet einen solchen Portalrahmen Schritt für Schritt.
