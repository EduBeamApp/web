---
title: Casi di carico
description: "Risolvi in una volta più casi di carico di un modello @edubeam/fem e combinane i risultati per sovrapposizione in combinazioni di carico e inviluppi."
order: 8
source: site
---

# Casi di carico {#load-cases}

Un caso di carico è un insieme di carichi risolti insieme. Il solutore parte con un caso; aggiungine altri, e un solo `solve()` li risolve tutti con un’unica matrice di rigidezza. L’analisi è lineare, quindi i risultati di casi diversi si possono moltiplicare per un coefficiente e sommare: una combinazione di carico non è altro che questo.

## Aggiungere un caso di carico {#add-a-load-case}

```ts [load-cases.ts]
import { DofID, LinearStaticSolver, LoadCase } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const dead = solver.loadCases[0] // quello con cui parte ogni solutore
const live = new LoadCase('live', domain)
solver.loadCases.push(live)

dead.createBeamElementUniformEdgeLoad(1, [0, 10e3], true) // 10 kN/m
live.createBeamConcentratedLoad(1, [0, 20e3, 0, 3], true) // 20 kN in mezzeria
solver.solve() // risolve tutti i casi di carico

console.log(beam.computeBendingMomentAt(dead, 3)) // qL²/8
console.log(beam.computeBendingMomentAt(live, 3)) // PL/4
```

```text [Output]
45000
30000
```

Ogni metodo che legge un risultato riceve il caso di carico da leggere. Il primo caso ha l’etichetta `'DefaultLC'`; le etichette sono solo nomi, e il solutore distingue i casi in base all’oggetto.

## Combinarli {#combine-them}

Moltiplica il risultato di ogni caso per il suo coefficiente e somma. Per lo stato limite ultimo dell’Eurocodice, $1{,}35\,G + 1{,}5\,Q$, in mezzeria:

```ts
1.35 * beam.computeBendingMomentAt(dead, 3) +
  1.5 * beam.computeBendingMomentAt(live, 3) // 105750 N·m
```

Lo stesso vale per reazioni, spostamenti e ogni altro risultato. Lungo un’intera asta, combina punto per punto: gli array di `computeBendingMoment(lc, n)` usano la stessa `x` per ogni caso.

```ts
const n = 60
const g = beam.computeBendingMoment(dead, n).M
const q = beam.computeBendingMoment(live, n).M
const uls = g.map((m, i) => 1.35 * m + 1.5 * q[i])
Math.max(...uls) // 105750 N·m, a x = 3
```

Un inviluppo, cioè il valore massimo e minimo su più combinazioni, è un `Math.max` e un `Math.min` su questi array, punto per punto. Per un carico mobile, invece, risolvi una volta per ogni posizione del carico: lo fa l’[esempio della linea d’influenza](/it/solver/scripts#an-influence-line-as-csv).

## Nell’app EduBeam {#in-the-edubeam-app}

L’app risolve un caso di carico alla volta: con le combinazioni la libreria va oltre l’app. Un modello con più casi si può comunque [disegnare](/it/solver/drawing) caso per caso: `StructurePlot` di @edubeam/plot riceve nella prop `loadCase` l’indice del caso in `solver.loadCases`.
