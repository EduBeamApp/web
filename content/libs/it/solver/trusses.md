---
title: Travature reticolari
description: "Una travatura Warren con nodi a cerniera in @edubeam/fem, gli sforzi verificati col metodo delle sezioni e un ciclo che genera travature con quanti campi vuoi."
order: 14
source: site
---

# Travature reticolari {#trusses}

Una travatura reticolare è fatta di aste incernierate a entrambe le estremità e caricate nei nodi, quindi ogni asta porta solo uno sforzo normale. Questo esempio costruisce una travatura Warren a partire da due elenchi, verifica a mano ogni sforzo nelle aste e poi genera in un ciclo travature di qualsiasi dimensione.

::model-figure{caption="Una travatura Warren: luce 9 m, altezza 1,8 m, 8 kN in ogni nodo superiore"}
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

// Una travatura Warren: luce 9 m, altezza 1,8 m, corrente inferiore A-B-C-D, corrente superiore E-F-G
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

// Ogni etichetta indica i due nodi dell'asta. Cerniere a entrambe le estremità: solo sforzo normale.
const bars = ['AB', 'BC', 'CD', 'EF', 'FG', 'AE', 'EB', 'BF', 'FC', 'CG', 'GD']
const members = bars.map((bar) =>
  domain.createBeam2D(bar, [bar[0], bar[1]], 1, 1, [true, true])
)

const lc = solver.loadCases[0]
for (const top of ['E', 'F', 'G']) {
  lc.createNodalLoad(top, { [DofID.Dz]: 8e3 }) // 8 kN verso il basso
}
solver.solve()

for (const bar of members) {
  const n = bar.computeNormalForceAt(lc, 0) / 1e3
  console.log(bar.label, n.toFixed(2), n > 0 ? 'tension' : 'compression')
}
```

```text [Output]
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

Lo sforzo normale di un’asta è costante, quindi basta leggerlo a `x = 0`. Le etichette di due lettere fungono anche da coppie di nodi: `bar[0]` e `bar[1]`.

## Verifica a mano {#check-it-by-hand}

Ogni appoggio porta metà dei 24 kN, cioè 12 kN. Taglia la travatura e scrivi l’equilibrio alla rotazione attorno al nodo opposto all’asta tagliata, come nel [metodo delle sezioni](/it/tutorials/truss):

| Asta | Equilibrio | Sforzo |
| --- | --- | --- |
| BC, corrente inferiore | momenti rispetto a F: $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$ | 16,67 kN di trazione |
| EF, corrente superiore | momenti rispetto a B: $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$ | 13,33 kN di compressione |
| AE, diagonale di estremità | nodo A: $12 \cdot \sqrt{1{,}5^2 + 1{,}8^2}/1{,}8$ | 15,62 kN di compressione |
| EB, diagonale | taglio nel campo, $12 - 8 = 4$ kN: $4 \cdot 2{,}343/1{,}8$ | 5,21 kN di trazione |

La sezione scelta per le aste non cambia gli sforzi di una travatura isostatica; stabilisce solo di quanto si spostano i nodi. La figura qui sopra usa un’altra sezione, quella dell’app EduBeam, e dà gli stessi sforzi.

## Un numero qualsiasi di campi {#any-number-of-panels}

Per generare travature, per degli esercizi o per uno studio parametrico, costruisci nodi e aste in un ciclo, campo per campo. Con `panels = 3` ottieni la travatura qui sopra, e il programma stampa gli stessi sforzi; cambia `panels`, `w` e `h` per ottenerne un’altra.

```ts [warren.ts]
import { type Beam2D, DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })
const lc = solver.loadCases[0]

const panels = 3 // campi del corrente inferiore
const w = 3 // larghezza di un campo, m
const h = 1.8 // altezza, m

// Nodi inferiori b0, b1, … su una cerniera e un carrello; nodi superiori t0, t1, … in mezzo
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
  bar(`b${i}`, `b${i + 1}`) // corrente inferiore
  bar(`b${i}`, `t${i}`) // diagonale ascendente
  bar(`t${i}`, `b${i + 1}`) // diagonale discendente
  if (i > 0) bar(`t${i - 1}`, `t${i}`) // corrente superiore
}
solver.solve()

for (const m of members) {
  console.log(m.label, (m.computeNormalForceAt(lc, 0) / 1e3).toFixed(2))
}
```

Il tempo di calcolo cresce rapidamente con le dimensioni: qualche decina di campi va bene, vedi [Dimensioni del modello](/it/solver/solving#model-size). Per disegnare ogni travatura generata, con o senza soluzioni, vedi [Esercizi e compiti](/it/plot/exercises) di @edubeam/plot.

## Da notare {#things-to-notice}

- **Cerniere su ogni estremità d’asta.** Ogni nodo è allora libero di ruotare, e il solutore ne riporta la rotazione come 0. Un momento applicato in un nodo del genere non trova nulla che lo equilibri, e [il calcolo non riesce](/it/solver/solving#when-solving-fails).
- **Carichi nei nodi.** Un carico lungo un’asta la farebbe inflettere: sarebbe allora una trave, non un’asta reticolare, con il suo diagramma del momento.

Il [tutorial sulla travatura reticolare piana](/it/tutorials/truss) costruisce una travatura nell’app EduBeam, e la pagina [Elemento reticolare](/it/elements/truss) ricava la rigidezza dell’asta.
