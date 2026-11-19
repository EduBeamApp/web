---
title: Träger
description: "Vollständige @edubeam/fem-Programme für einen Kragträger und einen Zweifeldträger, mit ihrer Ausgabe, jeweils an der Formel aus dem Lehrbuch geprüft."
order: 12
group: Beispielprogramme
---

# Träger {#beams}

Zwei vollständige Programme zum Kopieren und Abwandeln. Beide verwenden einen schubstarren Querschnitt (`k: 1e32`), ihre Zahlen entsprechen also exakt den Euler-Bernoulli-Formeln. Starten Sie sie mit `node cantilever.ts` (Node ab Version 22.18) in einem Ordner, der wie unter [Installation](/de/solver/getting-started#install) eingerichtet ist.

## Ein Kragträger {#a-cantilever}

4 m lang, in A eingespannt, 18 kN nach unten am freien Ende:

```ts [cantilever.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // Einspannung
const tip = domain.createNode('B', [4, 0, 0]) // frei
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
lc.createNodalLoad('B', { [DofID.Dz]: 18e3 }) // 18 kN nach unten am Kragende
solver.solve()

console.log(beam.computeBendingMomentAt(lc, 0)) // N·m an der Einspannung
console.log(tip.getUnknowns(lc, [DofID.Dz])) // m, die Durchbiegung am Kragende
```

```text [Ausgabe]
-72000
0.09411072715241528
```

$M_A = -FL = -72$ kNm, ein negatives Moment (Zug oben), und die Durchbiegung am Kragende ist $FL^3/3EI = 94{,}11$ mm, mit $EI = 4{,}0803$ MNm². Derselbe Kragträger ist eines der Beispiele der EduBeam-App.

## Ein Durchlaufträger {#a-continuous-beam}

Zwei Felder von je 5 m auf drei Lagern, 10 kN/m auf beiden. Gesucht sind die Auflagerreaktionen, das Moment über dem Mittellager und das größte Feldmoment:

```ts [continuous.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [5, 0, 0], [DofID.Dz])
domain.createNode('C', [10, 0, 0], [DofID.Dz])
const span1 = domain.createBeam2D(1, ['A', 'B'], 1, 1)
domain.createBeam2D(2, ['B', 'C'], 1, 1)

const lc = solver.loadCases[0]
for (const span of [1, 2]) {
  lc.createBeamElementUniformEdgeLoad(span, [0, 10e3], true)
}
solver.solve()

// getReactions liefert eine mathjs-Matrix oder ein Array: in ein Array umwandeln
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

for (const label of ['A', 'B', 'C']) {
  const { dofs, values } = domain.getNode(label).getReactions(lc)
  const rz = list(values)[dofs.indexOf(DofID.Dz)]
  console.log(`R${label} = ${(-rz / 1e3).toFixed(2)} kN up`)
}
const mB = span1.computeBendingMomentAt(lc, 5)
console.log(`MB = ${(mB / 1e3).toFixed(2)} kNm`)

// Das größte positive Moment in Feld 1, aus 501 Punkten entlang des Felds
const { x, M } = span1.computeBendingMoment(lc, 500)
const i = M.indexOf(Math.max(...M))
console.log(`max M = ${(M[i] / 1e3).toFixed(2)} kNm at x = ${x[i]} m`)
```

```text [Ausgabe]
RA = 18.75 kN up
RB = 62.50 kN up
RC = 18.75 kN up
MB = -31.25 kNm
max M = 17.58 kNm at x = 1.87 m
```

Die Lehrbuchwerte für zwei gleiche Felder: $R_A = R_C = 0{,}375\,qL$, $R_B = 1{,}25\,qL$, $M_B = -qL^2/8$ und das größte Feldmoment $R_A^2/2q = 17{,}58$ kNm bei $x = R_A/q = 1{,}875$ m. Die Auswertung findet es am Rasterpunkt 1,87 m, weniger als 0,0002 kNm vom wahren Wert entfernt.

::model-figure{caption="Zwei Felder von je 5 m unter 10 kN/m"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels]
---
::

Die Abbildung verwendet den Beispielquerschnitt der App statt des IPE 200. Mit einem einzigen Querschnitt im ganzen Träger hängen die Schnittgrößen eines Durchlaufträgers nicht von seiner Steifigkeit ab; die Verläufe zeigen also dieselben Zahlen, nur die Durchbiegung ist eine andere.

## Abwandeln {#change-it}

- **Ungleiche Felder oder Lasten:** Ändern Sie die Koordinaten von C oder die Lastliste. Mit einer Last auf nur einem Feld erhalten Sie die bekannte feldweise Laststellung.
- **Drei Felder:** Fügen Sie einen Knoten D und einen Stab `['C', 'D']` hinzu.
- **Ein eingespanntes Ende:** Geben Sie A `[DofID.Dx, DofID.Dz, DofID.Ry]`.
- **Echte Schubverformung:** `k: 5 / 6` für einen Rechteckquerschnitt oder der Schubkoeffizient Ihres Querschnitts.
- **Eine Abbildung davon:** Übergeben Sie den Solver an [@edubeam/plot](/de/solver/drawing).

Das Tutorial [Durchlaufträger und Auflagersenkung](/de/tutorials/continuous-beam) baut einen solchen Träger in der EduBeam-App auf, und die Seite [Ergebnisse von Hand prüfen](/de/guide/verification) enthält weitere Lehrbuchfälle mit ihren Formeln.
