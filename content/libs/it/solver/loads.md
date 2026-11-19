---
title: Carichi nodali e sulle aste
description: "Applica con @edubeam/fem forze e momenti nodali e carichi uniformi, trapezoidali e concentrati sulle aste, in assi globali o locali; poi modificali o rimuovili."
order: 6
group: Carichi
source: site
---

# Carichi nodali e sulle aste {#nodal-and-member-loads}

I carichi appartengono a un caso di carico. Il solutore parte con un caso, `solver.loadCases[0]`, e ogni suo metodo `create…` aggiunge un carico e lo restituisce. Per più casi e le loro combinazioni, vedi [Casi di carico](/it/solver/load-cases).

I valori sono in N, N/m e N·m e seguono gli [assi](/it/solver/conventions#axes): +z è verso il basso, un momento positivo è antiorario.

## Una trave con tutti i tipi di carico {#a-beam-with-every-kind}

Una trave di 8 m su una cerniera e un carrello, con un carico distribuito che cresce da 4 a 10 kN/m, un carico concentrato di 20 kN, una coppia di 10 kNm e una forza orizzontale sul carrello:

```ts [loads.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // cerniera
domain.createNode('B', [8, 0, 0], [DofID.Dz]) // carrello
domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
// 4 kN/m in A, che crescono fino a 10 kN/m in B, verso il basso
lc.createBeamElementTrapezoidalEdgeLoad(1, [0, 4e3], [0, 10e3], false)
// [fx, fz, my, a]: 20 kN verso il basso, a 2 m da A
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], false)
// una coppia antioraria di 10 kNm, a 6 m da A
lc.createBeamConcentratedLoad(1, [0, 0, 10e3, 6], false)
// 5 kN verso destra in B
lc.createNodalLoad('B', { [DofID.Dx]: 5e3 })
solver.solve()

// getReactions restituisce una Matrix di mathjs o un array: trasformala in array
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

console.log(list(domain.getNode('A').getReactions(lc).values))
console.log(list(domain.getNode('B').getReactions(lc).values))
```

```text [Output]
[ -5000, -40250 ]
[ -35750 ]
```

A mano: il carico distribuito vale 56 kN e agisce a 4,571 m da A, quindi l’equilibrio alla rotazione attorno ad A dà $8R_B = 56 \cdot 4{,}571 + 20 \cdot 2 - 10 = 286$, $R_B = 35{,}75$ kN verso l’alto, e $R_A = 76 - 35{,}75 = 40{,}25$ kN verso l’alto. La cerniera trattiene anche i 5 kN orizzontali, e quindi tutta la trave è tesa con uno sforzo normale di 5 kN.

::model-figure{caption="Gli stessi carichi. La figura applica la coppia in un nodo C a 6 m, e i risultati sono gli stessi."}
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

## Carichi nodali {#nodal-loads}

```ts
lc.createNodalLoad(node, { [DofID.Dx]: fx, [DofID.Dz]: fz, [DofID.Ry]: my }, lcs)
```

Indica solo le componenti che ti servono. I valori sono negli assi globali oppure, con `lcs` impostato a `true`, negli assi propri del nodo, per un nodo ruotato con [`updateLcs`](/it/solver/nodes-supports#inclined-supports). Una forza su un GdL bloccato dal vincolo finisce direttamente nella reazione e non fa inflettere nulla.

## Carichi sulle aste {#member-loads}

| Metodo | Valori | Carico |
| --- | --- | --- |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | N/m | uniforme su tutta l’asta |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | N/m | lineare, dal primo nodo al secondo |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | N, N·m, m | una forza e una coppia, a `a` metri dal primo nodo |

I carichi distribuiti coprono sempre l’intera asta. Per un carico su una parte della campata, dividi l’asta con un nodo nel punto in cui inizia il carico: un nodo in più non cambia alcun risultato. Un carico concentrato o una coppia può stare in qualsiasi punto dell’asta.

### Assi globali o locali {#global-or-local-axes}

L’ultimo argomento, `lcs`, indica in quali assi sono date le componenti:

- `false`: x e z globali. `fz` agisce in verticale, qualunque sia l’inclinazione dell’asta.
- `true`: la x locale dell’asta (lungo l’asta) e la sua z locale (trasversale). `fz` agisce perpendicolarmente all’asta.

Su un’asta orizzontale disegnata da sinistra a destra le due scelte coincidono; se l’asta è disegnata da destra a sinistra, la `fz` locale punta verso l’alto.

::callout{type="info" title="I carichi distribuiti si intendono per metro di asta"}
Entrambi i tipi agiscono per metro della lunghezza propria dell’asta. Su una trave di falda lunga 5 m che copre 4 m in orizzontale, `[0, 10e3]` negli assi globali dà in totale 50 kN. Un carico neve di 10 kN/m misurato sulla proiezione orizzontale vale $10 \cdot 4/5 = 8$ kN/m lungo la trave di falda: inserisci `[0, 8e3]`.
::

## Modificare o rimuovere un carico {#change-or-remove-a-load}

Ogni metodo `create…` restituisce il carico. Cambiane i valori e risolvi di nuovo:

```ts
const q = lc.createBeamElementUniformEdgeLoad(1, [0, 10e3], true)
solver.solve()
q.values = [0, 20e3] // il doppio del carico
solver.solve()
```

I carichi stanno in semplici array, `lc.nodalLoadList` e `lc.elementLoadList` (carichi sulle aste e carichi termici), quindi `lc.elementLoadList.splice(index, 1)` ne rimuove uno. I nomi delle proprietà di ogni carico sono nel [riferimento API](/it/solver/reference#loads).

Anche le variazioni di temperatura e i cedimenti vincolari sono carichi: vedi [Temperatura e cedimenti](/it/solver/temperature-settlements).
