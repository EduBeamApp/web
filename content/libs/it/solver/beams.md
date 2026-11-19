---
title: Travi
description: "Programmi @edubeam/fem completi per una mensola e una trave continua a due campate, con il loro output, ciascuno verificato con la formula del libro di testo."
order: 12
group: Programmi di esempio
source: site
---

# Travi {#beams}

Due programmi completi da copiare e modificare. Entrambi usano una sezione indeformabile a taglio (`k: 1e32`), quindi i risultati coincidono esattamente con le formule di Eulero–Bernoulli. Eseguili con `node cantilever.ts` (Node 22.18 o successivi), in una cartella preparata come in [Installazione](/it/solver/getting-started#install).

## Una mensola {#a-cantilever}

Lunga 4 m, incastrata in A, con 18 kN verso il basso all’estremità libera:

```ts [cantilever.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // incastro
const tip = domain.createNode('B', [4, 0, 0]) // libero
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
lc.createNodalLoad('B', { [DofID.Dz]: 18e3 }) // 18 kN verso il basso all'estremità
solver.solve()

console.log(beam.computeBendingMomentAt(lc, 0)) // N·m all'incastro
console.log(tip.getUnknowns(lc, [DofID.Dz])) // m, la freccia all'estremità
```

```text [Output]
-72000
0.09411072715241528
```

$M_A = -FL = -72$ kNm, un momento negativo (fibre superiori tese), e la freccia all’estremità è $FL^3/3EI = 94{,}11$ mm, con $EI = 4{,}0803$ MNm². La stessa mensola è uno degli esempi dell’app EduBeam.

## Una trave continua {#a-continuous-beam}

Due campate di 5 m su tre appoggi, con 10 kN/m su entrambe. Le reazioni, il momento sull’appoggio centrale e il massimo momento in campata:

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

// getReactions restituisce una Matrix di mathjs o un array: trasformala in array
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

for (const label of ['A', 'B', 'C']) {
  const { dofs, values } = domain.getNode(label).getReactions(lc)
  const rz = list(values)[dofs.indexOf(DofID.Dz)]
  console.log(`R${label} = ${(-rz / 1e3).toFixed(2)} kN up`)
}
const mB = span1.computeBendingMomentAt(lc, 5)
console.log(`MB = ${(mB / 1e3).toFixed(2)} kNm`)

// Il massimo momento positivo nella campata 1, da 501 punti lungo l'asta
const { x, M } = span1.computeBendingMoment(lc, 500)
const i = M.indexOf(Math.max(...M))
console.log(`max M = ${(M[i] / 1e3).toFixed(2)} kNm at x = ${x[i]} m`)
```

```text [Output]
RA = 18.75 kN up
RB = 62.50 kN up
RC = 18.75 kN up
MB = -31.25 kNm
max M = 17.58 kNm at x = 1.87 m
```

I valori del libro di testo per due campate uguali: $R_A = R_C = 0{,}375\,qL$, $R_B = 1{,}25\,qL$, $M_B = -qL^2/8$, e il massimo momento in campata $R_A^2/2q = 17{,}58$ kNm, a $x = R_A/q = 1{,}875$ m. Il campionamento lo trova nel punto di griglia 1,87 m, a meno di 0,0002 kNm dal valore esatto.

::model-figure{caption="Due campate di 5 m con 10 kN/m"}
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

La figura usa la sezione dell’esempio dell’app invece dell’IPE 200. Con un’unica sezione per tutta la trave, le forze interne di una trave continua non dipendono dalla sua rigidezza, quindi i diagrammi riportano gli stessi numeri; cambia solo la freccia.

## Varianti {#change-it}

- **Campate o carichi diversi:** cambia le coordinate di C o l’elenco dei carichi. Un carico su una sola campata dà la nota disposizione dei carichi a scacchiera.
- **Tre campate:** aggiungi un nodo D e un’asta `['C', 'D']`.
- **Un’estremità incastrata:** assegna ad A `[DofID.Dx, DofID.Dz, DofID.Ry]`.
- **Deformazione a taglio reale:** `k: 5 / 6` per un rettangolo, o il coefficiente di taglio della tua sezione.
- **Una figura del modello:** passa il solutore a [@edubeam/plot](/it/solver/drawing).

Il [tutorial sulla trave continua](/it/tutorials/continuous-beam) costruisce una trave come questa nell’app EduBeam, e la pagina [Verificare i risultati a mano](/it/guide/verification) raccoglie altri casi da libro di testo con le loro formule.
