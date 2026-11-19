---
title: Skripte und Server
description: "@edubeam/fem in Node verwenden: ein Übungsblatt mit Lösungsblatt, eine Einflusslinie als CSV und ein kleiner HTTP-Endpunkt, der Träger auf Anfrage berechnet."
order: 15
---

# Skripte und Server {#scripts-and-servers}

Der Solver braucht keinen Browser. In Node schreibt er Lösungsblätter, führt Parameterstudien durch, erstellt Tabellen für eine Tabellenkalkulation oder beantwortet Anfragen einer Webseite.

Die Beispiele sind in TypeScript geschrieben. Node ab Version 22.18 führt `.ts`-Dateien direkt aus (`node answers.ts`), in einem Ordner, der wie unter [Installation](/de/solver/getting-started#install) eingerichtet ist; mit einem älteren Node entfernen Sie die Typannotationen und speichern die Dateien als `.mjs`.

## Ein Übungsblatt mit Lösungsblatt {#answer-key}

Zwanzig Varianten einer Aufgabe, ein Einfeldträger unter einer Streckenlast und einer Einzellast, jede mit ihren Auflagerreaktionen und ihrem größten Moment, geschrieben in eine CSV-Datei. Die Zahlen ergeben sich aus der Aufgabennummer, dasselbe Skript schreibt also immer dasselbe Blatt:

```ts [answers.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Aufgabe i: ein Einfeldträger unter q kN/m und F kN in a m Abstand von A. */
const exercise = (i: number) => {
  const L = 4 + (i % 4) // 4 bis 7 m
  const q = 5 + 5 * (i % 3) // 5, 10 oder 15 kN/m
  const F = 10 + 10 * (i % 2) // 10 oder 20 kN
  const a = L / 4 + (i % 3) // irgendwo im Feld
  return { L, q, F, a }
}

const solve = ({ L, q, F, a }: ReturnType<typeof exercise>) => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  lc.createBeamConcentratedLoad(1, [0, F * 1e3, 0, a], true)
  solver.solve()

  // Die Auflagerreaktionen sind die Querkräfte an den Enden: V(0) in A, -V(L) in B
  const rA = beam.computeShearForceAt(lc, 0) / 1e3
  const rB = -beam.computeShearForceAt(lc, L) / 1e3
  // Das größte Moment, aus Punkten im Abstand von 1 cm
  const { x, M } = beam.computeBendingMoment(lc, L * 100)
  const top = M.indexOf(Math.max(...M))
  return [rA, rB, M[top] / 1e3, x[top]].map((v) => v.toFixed(2))
}

const rows = ['no,L_m,q_kN_m,F_kN,a_m,RA_kN,RB_kN,Mmax_kNm,at_m']
for (let i = 1; i <= 20; i++) {
  const ex = exercise(i)
  rows.push([i, ex.L, ex.q, ex.F, ex.a, ...solve(ex)].join(','))
}
writeFileSync('answers.csv', rows.join('\n') + '\n')
```

```text [answers.csv]
no,L_m,q_kN_m,F_kN,a_m,RA_kN,RB_kN,Mmax_kNm,at_m
1,5,10,20,2.25,36.00,34.00,55.69,2.25
2,6,15,10,3.5,49.17,50.83,80.58,3.28
3,7,5,20,1.75,32.50,22.50,50.63,2.50
...
```

Prüfen Sie die erste Zeile von Hand: $R_B = (10 \cdot 5 \cdot 2{,}5 + 20 \cdot 2{,}25)/5 = 34$ kN, $R_A = 70 - 34 = 36$ kN, und die Querkraft wechselt unter der Einzellast das Vorzeichen, das größte Moment liegt also dort: $36 \cdot 2{,}25 - 10 \cdot 2{,}25^2/2 = 55{,}69$ kNm.

Zwei Entscheidungen halten das Skript kurz. Beim Einfeldträger sind die Auflagerreaktionen die Querkräfte an den Enden, eine [Hilfsfunktion für Auflagerreaktionen](/de/solver/results#reactions) ist also nicht nötig. Und das größte Moment wird aus Punkten im Abstand von 1 cm bestimmt; das ist hier exakt, weil das Extremum auf einer Last oder höchstens einen Zentimeter neben einem Rasterpunkt liegt. Wie Sie jede Aufgabe zeichnen, mit oder ohne Lösungen, steht unter [Übungsaufgaben und Klausuren](/de/plot/exercises) in der Dokumentation von @edubeam/plot; dort wird auch eine ganze Klausur gedruckt.

## Eine Einflusslinie als CSV {#an-influence-line-as-csv}

Wie ändert sich das Moment über dem Mittellager eines Zweifeldträgers, während eine Last von 1 kN darüberwandert? Bauen und berechnen Sie den Träger für jede Laststellung neu und schreiben Sie für jede eine Zeile:

```ts [influence.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Zwei Felder von 5 m, 1 kN bei `at` m ab A: das Moment über dem Mittellager */
const momentAtB = (at: number): number => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [5, 0, 0], [DofID.Dz])
  domain.createNode('C', [10, 0, 0], [DofID.Dz])
  const span1 = domain.createBeam2D(1, ['A', 'B'], 1, 1)
  domain.createBeam2D(2, ['B', 'C'], 1, 1)
  const [member, x] = at <= 5 ? [1, at] : [2, at - 5]
  solver.loadCases[0].createBeamConcentratedLoad(member, [0, 1e3, 0, x], true)
  solver.solve()
  return span1.computeBendingMomentAt(solver.loadCases[0], 5)
}

const rows = ['x_m,MB_kNm_per_kN']
for (let at = 0; at <= 10; at += 0.5) {
  rows.push(`${at},${(momentAtB(at) / 1e3).toFixed(4)}`)
}
writeFileSync('influence.csv', rows.join('\n') + '\n')
```

```bash
node influence.ts
```

```text [influence.csv]
x_m,MB_kNm_per_kN
0,0.0000
0.5,-0.1237
1,-0.2400
1.5,-0.3412
2,-0.4200
2.5,-0.4688
3,-0.4800
...
```

Die geschlossene Lösung für zwei gleiche Felder lautet $M_B = -P\,a\,(L^2 - a^2)/4L^2$: $-0{,}46875$ kNm bei $a = 2{,}5$ m, und die ungünstigste Laststellung ist $a = L/\sqrt{3} = 2{,}887$ m. Die Einflusslinie ist symmetrisch, die 21 Zeilen enden also, wo sie begonnen haben: bei 0 über dem Lager C.

Ein neuer Solver pro Laststellung ist einfacher, als einen bestehenden zu ändern, und kostet ein paar Millisekunden. Wie Sie stattdessen ein berechnetes Modell ändern, steht unter [Erneut berechnen nach einer Änderung](/de/solver/solving#solving-again-after-a-change).

## Ein Solver hinter einem HTTP-Endpunkt {#a-solver-behind-an-http-endpoint}

Ein kleiner Server, nur mit dem eingebauten `http`-Modul von Node, der einen Einfeldträger für jede Spannweite und Last berechnet, die er geschickt bekommt:

```ts [server.ts]
import { createServer } from 'node:http'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Ein IPE 200 als Einfeldträger, `span` m, `q` kN/m: M und Durchbiegung in Feldmitte */
const solveBeam = (span: number, q: number) => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [span, 0, 0], [DofID.Dz])
  const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  solver.solve()
  return {
    momentKNm: beam.computeBendingMomentAt(lc, span / 2) / 1e3,
    deflectionMm: beam.computeLocalDefl(lc, 2).w[1] * 1e3,
  }
}

createServer(async (req, res) => {
  try {
    let body = ''
    for await (const chunk of req) body += chunk
    const { span, q } = JSON.parse(body) as { span?: unknown; q?: unknown }
    if (typeof span !== 'number' || !(span > 0) || typeof q !== 'number') {
      throw new Error('Bad input')
    }
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify(solveBeam(span, q)) + '\n')
  } catch {
    // Ungültiges JSON, ungültige Zahlen oder ein nicht berechenbares Modell: Der Server läuft weiter
    res.writeHead(400).end('Send {"span": metres, "q": kN/m}\n')
  }
}).listen(3000)
```

```bash
node server.ts &
curl -s localhost:3000 -d '{"span": 6, "q": 12}'
# {"momentKNm":54,"deflectionMm":49.62870377178149}
```

$qL^2/8 = 54$ kNm und $5qL^4/384EI = 49{,}63$ mm. Auf das `try` kommt es an: Ungültiges JSON wirft einen Fehler, ein Modell, das der Solver nicht lösen kann, möglicherweise auch, und beides darf den Server nicht zum Absturz bringen. Ein öffentlicher Dienst würde außerdem die Größe der Anfrage und die Spannweite begrenzen.

## Im Browser {#in-the-browser}

Derselbe Code läuft unverändert in einer Webseite und rechnet dann auf dem Gerät der Leserin oder des Lesers: So funktioniert jede Live-Abbildung auf dieser Website. Importieren Sie das Paket über Ihren Bundler, etwa Vite oder Nuxt, und [zeichnen Sie die Ergebnisse](/de/solver/drawing) mit @edubeam/plot. Ein Modell ist in Millisekunden berechnet, eine Seite kann also bei jeder Eingabe neu rechnen.
