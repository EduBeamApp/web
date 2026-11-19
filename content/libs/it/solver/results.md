---
title: Lettura dei risultati
description: "Leggi da un modello @edubeam/fem risolto reazioni, spostamenti, forze interne lungo le aste, deformate e forze di estremità, con la forma restituita da ogni chiamata."
order: 10
source: site
---

# Lettura dei risultati {#reading-results}

Dopo `solve()`, i risultati si leggono dai nodi e dalle aste, per un caso di carico dato. Ogni esempio di questa pagina legge lo stesso modello, una trave semplicemente appoggiata di 6 m, un IPE 200 indeformabile a taglio, con 20 kN a 2 m da A:

```ts [results.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 }) // indeformabile a taglio

const A = domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
const B = domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
const lc = solver.loadCases[0]
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], true)
solver.solve()
```

::model-figure{caption="20 kN a 2 m su una campata di 6 m"}
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

## Cosa leggere e dove {#what-to-read-where}

| Risultato | Chiamata | Restituisce |
| --- | --- | --- |
| Reazioni | `node.getReactions(lc)` | `{ dofs, values }`: N, N·m |
| Spostamenti | `node.getUnknowns(lc, dofs)` | m, rad |
| N, V o M in un punto | `beam.computeBendingMomentAt(lc, x)` | un numero: N, N·m |
| N, V o M lungo un’asta | `beam.computeBendingMoment(lc, n)` | `{ x, M }`, n + 1 punti |
| Deformata | `beam.computeLocalDefl(lc, n)` | `{ u, w }`, n + 1 punti, m |
| Forze di estremità | `beam.computeEndForces(lc)` | una matrice mathjs di 6 valori |

Per N e V i metodi sono `computeNormalForceAt` e `computeShearForceAt`, `computeNormalForce` e `computeShearForce`, che restituiscono `{ x, N }` e `{ x, V }`. I segni sono spiegati in [Unità e segni](/it/solver/conventions#signs-of-the-results).

## Reazioni {#reactions}

`getReactions` dà una reazione per ogni GdL bloccato dal vincolo: `dofs` li elenca, nell’ordine in cui sono stati passati a `createNode`, e `values` contiene le reazioni nello stesso ordine. `values` è una **matrice mathjs** quando le reazioni sono più di una e un semplice array quando ce n’è una sola, quindi una piccola funzione di supporto lo trasforma in array in entrambi i casi:

```ts
/** Trasforma una Matrix di mathjs, un array o un numero in un semplice array. */
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

Per prendere una singola reazione indipendentemente dall’ordine, cerca il suo GdL: `list(values)[dofs.indexOf(DofID.Dz)]`, come fa l’[esempio della trave continua](/it/solver/beams#a-continuous-beam).

Una reazione è la forza che il vincolo esercita sulla struttura: −13 333 N lungo z sono 13,3 kN verso l’alto, $P\,b/L = 20 \cdot 4/6$. Su un nodo con [assi ruotati](/it/solver/nodes-supports#inclined-supports), le reazioni sono in quegli assi; `getReactions(lc, true)` le riporta negli assi globali e restituisce tutti e tre i GdL, con 0 dove nulla è bloccato. Un nodo senza vincolo dà `{ dofs: [], values: [] }`.

## Spostamenti {#displacements}

`getUnknowns` legge qualsiasi GdL di un nodo, vincolato o no:

```ts
list(A.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])) // [0, 0, -0.0108924]
```

A ruota in senso orario di 0,010892 rad, $P\,b\,(L^2 - b^2)/6EIL$. Se chiedi un solo GdL, `getUnknowns` restituisce un semplice numero, anche se TypeScript dichiara una matrice: `list` gestisce anche questo caso.

## Forze interne lungo un’asta {#internal-forces-along-a-member}

I metodi `…At` danno il valore a `x` metri dal primo nodo dell’asta:

```ts
beam.computeShearForceAt(lc, 1) // 13333.3 N
beam.computeShearForceAt(lc, 2) // -6666.7 N: nel punto del carico, il valore subito dopo
beam.computeBendingMomentAt(lc, 2) // 26666.7 N·m: R_A · 2
```

Dove un carico concentrato produce un salto, il valore esattamente nel punto del carico è quello che si ha dopo il carico. Per leggere il valore che precede il salto, chiedilo appena prima, ad esempio a `x - 1e-9`.

I metodi che restituiscono array campionano un’asta in n + 1 punti equidistanti, estremi compresi:

```ts
beam.computeBendingMoment(lc, 3)
// { x: [0, 2, 4, 6], M: [0, 26666.7, 13333.3, 0] }, a meno degli arrotondamenti
```

Aspettati errori di arrotondamento come `-3.6e-12` dove il valore esatto è 0: formatta i numeri con `toFixed` prima di stamparli. Per il valore massimo lungo un’asta prendi il massimo di un campionamento fitto, ad esempio `computeBendingMoment(lc, 500)`, come nell’[esempio della trave continua](/it/solver/beams#a-continuous-beam). Con carichi distribuiti M è un polinomio, quindi il suo estremo esatto si trova dove V si annulla; [@edubeam/plot](/it/plot/model#reading-values-yourself) lo trova esattamente.

## Deformata {#deflected-shape}

```ts
beam.computeLocalDefl(lc, 3)
// { u: [0, 0, 0, 0], w: [0, 0.0174279, 0.0152494, 0] }
```

`computeLocalDefl` dà gli spostamenti lungo l’asta e trasversali, `u` e `w`, nei suoi assi locali; `computeGlobalDefl` dà gli stessi punti in x e z globali. La freccia sotto il carico, 17,43 mm, è $P\,a^2 b^2/3EIL$. La forma tra i nodi è esatta, non interpolata dai valori agli estremi. Per disegnarla, vedi [Disegnare i risultati](/it/solver/drawing).

## Forze di estremità {#end-forces}

```ts
beam.computeEndForces(lc).toArray()
// [0, -13333.3, 0, 0, -6666.7, 0]: X12, Z12, M12, X21, Z21, M21
```

Le forze che i due nodi esercitano sull’asta, nei suoi assi locali: sono i numeri della tabella *Risultati degli elementi* dell’app, spiegati in [Forze di estremità](/it/elements/conventions#end-forces-element-results-table).

## Risultati da verificare {#results-as-numbers-to-check}

Ogni valore qui sopra coincide con la sua formula in forma chiusa. La pagina [Verificare i risultati a mano](/it/guide/verification) svolge molti altri casi da libro di testo, risolti da questo stesso solutore nel tuo browser.
