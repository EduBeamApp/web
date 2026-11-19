---
title: Aste e cerniere
description: "Collega i nodi con aste Beam2D, svincola il momento con cerniere di estremità, modella aste reticolari e ricava da @edubeam/fem le matrici di rigidezza e di trasformazione."
order: 5
source: site
---

# Aste e cerniere {#members-and-hinges}

Ogni asta è un `Beam2D`: una trave di Timoshenko rettilinea a due nodi nel piano x–z, che porta sforzo normale, taglio e momento flettente. Le cerniere alle sue estremità vi svincolano il momento. I frammenti di codice usano `solver`, `domain` e `lc` di un programma come quello di [Per iniziare](/it/solver/getting-started), con il suo materiale `'steel'` e la sua sezione `'IPE200'`.

## Creare un’asta {#create-a-member}

```ts
domain.createBeam2D(label, [startNode, endNode], material, crossSection, hinges)
```

| Argomento | Tipo | Significato |
| --- | --- | --- |
| `label` | `string \| number` | Il suo nome, memorizzato come stringa |
| `nodes` | `[label, label]` | Primo e secondo nodo. La x locale va dal primo al secondo: vedi [Verso dell’asta](/it/solver/conventions#member-direction). |
| `mat`, `cs` | `string \| number` | Etichette di un materiale e di una sezione |
| `hinges` | `[boolean, boolean]` | Una cerniera al primo nodo, al secondo. Facoltativo; predefinito `[false, false]`, estremità rigide. |

Restituisce il `Beam2D`: conservalo per leggere i risultati. `domain.getElement(label)` lo ritrova, ma con il tipo generico `Element`, quindi TypeScript richiede `as Beam2D` prima che tu ne legga i risultati.

Le aste che si incontrano in un nodo senza cerniere sono collegate rigidamente: ruotano insieme. Nodi, materiale e sezione si possono creare in qualsiasi ordine, purché esistano tutti al momento del calcolo; se ne manca uno, `solve()` lancia un `RangeError` che lo nomina.

## Cerniere di estremità {#end-hinges}

Una cerniera appartiene all’estremità di un’asta, non a un nodo. Qui l’asta 2 inizia con una cerniera in C, quindi C trasmette dalla campata C–D alla mensola A–C il taglio, ma non il momento:

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

cd.computeBendingMomentAt(lc, 0) // 0 nella cerniera
cd.computeBendingMomentAt(lc, 2) // 20000 N·m: qL²/8 della campata di 4 m
ac.computeBendingMomentAt(lc, 0) // -40000 N·m: i 20 kN da C–D, a 2 m di distanza
```

::model-figure{caption="Una mensola che porta una campata incernierata: momento nullo in C"}
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

Dove più aste si incontrano in un nodo a cerniera, basta una cerniera su tutte le estremità tranne una. Funziona anche una cerniera su ogni estremità: allora niente fa ruotare il nodo, e il solutore ne riporta la rotazione come 0. Un momento applicato a un nodo del genere, però, non trova nulla che lo equilibri, e [il calcolo non riesce](/it/solver/solving#when-solving-fails).

## Aste reticolari {#truss-bars}

Con una cerniera a entrambe le estremità un’asta porta solo sforzo normale, purché sia caricata nei nodi: è un’asta reticolare.

```ts
domain.createBeam2D('AE', ['A', 'E'], 'steel', 'bar', [true, true])
```

L’[esempio della travatura reticolare](/it/solver/trusses) risolve così un’intera travatura. L’esempio di travatura dell’app EduBeam usa invece nodi rigidi, con un’area così grande che i momenti flettenti sono trascurabili rispetto agli sforzi normali. Entrambi i modelli sono validi; differiscono solo per quei piccoli momenti. La matrice di rigidezza dell’asta reticolare è ricavata nella pagina [Elemento reticolare](/it/elements/truss) del manuale teorico.

## Le matrici dell’elemento {#the-element-s-matrices}

Per insegnare il metodo stesso, un `Beam2D` fornisce le sue matrici come matrici [mathjs](https://mathjs.org); `.toArray()` le trasforma in `number[][]`:

| Metodo | Fornisce |
| --- | --- |
| `computeGeo()` | `{ l, dx, dz }`: lunghezza e proiezioni, m |
| `computeLocalStiffnessMtrx().answer` | rigidezza 6 × 6 negli assi locali, con le cerniere condensate |
| `computeT()` | trasformazione 6 × 6 dagli assi globali a quelli locali |
| `computeStiffness()` | rigidezza 6 × 6 negli assi globali, $T^T K_l T$ |
| `computeShearFactor()` | $\Phi = 12EI_y/kGAL^2$ |

```ts
ac.computeStiffness().toArray() // number[][], N/m, N e N·m
```

I GdL sono ordinati come $u_1, w_1, \varphi_1, u_2, w_2, \varphi_2$. La pagina [Elemento trave](/it/elements/beam) del manuale teorico ricava queste matrici, e [Come EduBeam risolve un modello](/it/elements/analysis) mostra come si assemblano.
