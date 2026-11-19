---
title: Nodi e vincoli
description: "Crea i nodi di un modello @edubeam/fem, vincolali bloccando i gradi di libertà, ruota gli assi di un vincolo per un carrello inclinato e modifica i nodi dopo il calcolo."
order: 3
group: Modellazione
source: site
---

# Nodi e vincoli {#nodes-and-supports}

I nodi sono i punti in cui si collegano le aste. Un vincolo non è un oggetto a sé: è l’elenco dei gradi di libertà che un nodo tiene bloccati. I frammenti di codice di questa pagina fanno parte di un programma come quello di [Per iniziare](/it/solver/getting-started) e ne usano `solver`, `domain` e `lc`.

## Creare un nodo {#create-a-node}

```ts
domain.createNode(label, [x, y, z], bcs)
```

| Argomento | Tipo | Significato |
| --- | --- | --- |
| `label` | `string \| number` | Il suo nome, memorizzato come stringa: `1` e `'1'` sono lo stesso nodo |
| `coords` | `number[]` | `[x, y, z]` in metri, con `y = 0`. z punta in basso. |
| `bcs` | `DofID[]` | I gradi di libertà bloccati dal vincolo. Omettilo per un nodo libero. |

Restituisce il `Node`; `domain.getNode(label)` lo ritrova. Un’etichetta già in uso sostituisce il nodo precedente.

```ts
import { DofID } from '@edubeam/fem'

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [0, 0, -4]) // libero: la testa di una colonna alta 4 m
```

## Vincoli {#supports}

Ogni vincolo dell’app EduBeam è un insieme di GdL bloccati:

| Vincolo | `bcs` | Blocca |
| --- | --- | --- |
| Incastro | `[DofID.Dx, DofID.Dz, DofID.Ry]` | tutto |
| Cerniera | `[DofID.Dx, DofID.Dz]` | entrambi gli spostamenti, la rotazione è libera |
| Carrello | `[DofID.Dz]` | lo spostamento verticale, scorre lungo x |
| Carrello verticale | `[DofID.Dx]` | lo spostamento orizzontale, scorre lungo z |
| Pattino | `[DofID.Dz, DofID.Ry]` | spostamento verticale e rotazione, scorre lungo x |
| Pattino verticale | `[DofID.Dx, DofID.Ry]` | spostamento orizzontale e rotazione, scorre lungo z |
| Solo rotazione bloccata | `[DofID.Ry]` | la rotazione |

L’ordine in cui li elenchi è l’ordine in cui tornano le [reazioni](/it/solver/results#reactions). Una struttura ha bisogno di almeno tre GdL bloccati, disposti in modo che non possa muoversi come un meccanismo: vedi [Quando il calcolo non riesce](/it/solver/solving#when-solving-fails).

A un GdL bloccato puoi anche imporre uno spostamento dato, cioè un cedimento vincolare: vedi [Spostamenti imposti](/it/solver/temperature-settlements#prescribed-displacements).

## Vincoli inclinati {#inclined-supports}

Un carrello su un piano inclinato blocca il nodo perpendicolarmente al piano, non in verticale. Ruota gli assi del nodo con `updateLcs`: i suoi `bcs` si riferiscono allora agli assi ruotati. Nel programma della pagina Per iniziare, crea invece B in questo modo:

```ts
const b = domain.createNode('B', [6, 0, 0], [DofID.Dz]) // blocca la propria z
const a = (30 * Math.PI) / 180 // 30°, da x verso z: in senso orario sullo schermo
b.updateLcs({ locx: [Math.cos(a), 0, Math.sin(a)], locy: [0, 1, 0] })
```

`locx` è l’asse x proprio del nodo, espresso come vettore negli assi globali, e `locy` il suo asse y, che resta `[0, 1, 0]`. Nell’app EduBeam lo stesso angolo è l’*Angolo LCS nodale* del nodo, 30°.

Dopo `solve()`, B spinge perpendicolarmente al piano inclinato e la cerniera in A assorbe la componente orizzontale:

```ts
b.getReactions(lc).values // [-41569]: N lungo la z propria di B, 36 kN / cos 30°
b.getReactions(lc, true).values // [20785, -36000, 0]: lungo x, lungo z, momento
```

::model-figure{caption="Un carrello ruotato di 30°: la reazione è perpendicolare al piano inclinato e la trave è tesa"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, N]
show: [nodeLabels]
---
::

La componente verticale è ancora $qL/2 = 36$ kN; quella orizzontale, $36 \tan 30° = 20{,}8$ kN, tira la trave da entrambe le estremità. Il momento non cambia.

Su un nodo ruotato, spostamenti e reazioni sono negli assi propri del nodo, a meno che tu non passi `true` per averli negli assi globali. I carichi nodali su quel nodo sono invece globali, salvo indicazione contraria: vedi [Carichi nodali](/it/solver/loads#nodal-loads). `node.updateLcs()` senza argomenti riporta gli assi nella posizione iniziale.

## Modificare un nodo {#change-a-node}

Un nodo è un semplice oggetto: cambia `node.coords` per spostarlo, oppure sostituisci `node.bcs`, un `Set<DofID>`, per cambiarne il vincolo.

```ts
domain.getNode('B').coords = [8, 0, 0] // una luce maggiore: basta solve()
domain.getNode('A').bcs = new Set(fixed) // un nuovo vincolo: prima rinumera
solver.codeNumberGenerated = false
solver.solve()
```

Modificare i vincoli, o aggiungere e rimuovere nodi, cambia le equazioni: senza `codeNumberGenerated = false` il solutore **continua a usare i vecchi vincoli senza avvisarti**. [Risolvere di nuovo dopo una modifica](/it/solver/solving#solving-again-after-a-change) elenca quali modifiche lo richiedono.
