---
title: Modello di disegno
description: "Il PlotModel, dati semplici e serializzabili in JSON che modelFromSolver ricava da un modello risolto con @edubeam/fem: risultati come polinomi a tratti, valori esatti ed estremi."
order: 9
source: site
---

# Modello di disegno

Tutto ciò che @edubeam/plot disegna proviene da un `PlotModel`: dati semplici che `modelFromSolver` legge da un modello risolto con @edubeam/fem. Contiene la geometria, i vincoli, i carichi, le reazioni e i risultati di ogni asta come polinomi esatti. È serializzabile in JSON, quindi può essere preparato in fase di build e distribuito al posto del solutore, ed è il modo più semplice per leggere valori esatti ed estremi di una struttura risolta.

```ts
import { modelFromSolver } from '@edubeam/plot'

const model = modelFromSolver(solver) // oppure modelFromSolver(solver, { loadCase: 1 })
```

`results` è presente solo se il caso di carico è risolto. Senza, i componenti disegnano solo il modello e, con [`reactionLabels: 'names'`](/it/plot/structure-plot#reactions-as-unknowns), disegnano comunque le reazioni incognite: così un modello non risolto può diventare il testo di un esercizio.

## Il formato {#the-format}

Tutto è in unità SI (m, N, N·m, N/m, K, rad) e negli assi del solutore: x verso destra, z verso il basso, rotazioni positive in senso antiorario sullo schermo.

```ts
interface PlotModel {
  readonly nodes: readonly PlotNode[]
  readonly members: readonly PlotMember[]
  readonly loads: readonly PlotLoad[]
  readonly results?: PlotResults // solo per un caso di carico risolto
}

interface PlotNode {
  readonly id: string
  readonly x: number
  readonly z: number
  readonly fixity: { readonly dx: boolean; readonly dz: boolean; readonly ry: boolean } // GdL vincolati
  readonly angle: number // rotazione degli assi di un vincolo inclinato, rad, in senso orario sullo schermo
}

interface PlotMember {
  readonly id: string
  readonly start: string // id dei nodi
  readonly end: string
  readonly hinges: readonly [boolean, boolean]
}

interface PlotResults {
  readonly members: Readonly<Record<string, MemberResults>> // per id dell’asta
  readonly reactions: readonly PlotReaction[]
}

interface MemberResults {
  readonly N: Piecewise // sforzo normale, positivo se di trazione
  readonly V: Piecewise // taglio
  readonly M: Piecewise // momento flettente, positivo se tende il lato +z locale
  readonly u: Piecewise // spostamento lungo x locale
  readonly w: Piecewise // spostamento lungo z locale
}

interface PlotReaction {
  readonly node: string
  readonly dof: 'dx' | 'dz' | 'ry'
  readonly value: number // forza sulla struttura lungo l’asse del nodo, N (N·m per ry)
}
```

Un carico è di uno di sette tipi, distinti da `kind`:

| `kind` | Campi | Che cos’è |
| --- | --- | --- |
| `'nodalForce'` | `node`, `fx`, `fz` | una forza in un nodo, componenti globali, N |
| `'nodalMoment'` | `node`, `my` | un momento in un nodo, N·m |
| `'distributed'` | `member`, `start`, `end`, `local` | un carico distribuito a variazione lineare, `{ fx, fz }` a ciascuna estremità, N/m; uniforme se sono uguali |
| `'pointForce'` | `member`, `at`, `fx`, `fz`, `local` | una forza a `at` metri dall’inizio dell’asta |
| `'pointMoment'` | `member`, `at`, `my` | una coppia applicata a un’asta |
| `'temperature'` | `member`, `uniform`, `gradient` | K: la variazione nel baricentro, e la differenza tra fibre inferiori e superiori (inferiore meno superiore) |
| `'prescribed'` | `node`, `dx?`, `dz?`, `ry?` | un cedimento vincolare negli assi del nodo, m e rad |

`local` vale `true` quando le componenti sono riferite agli assi locali x e z dell’asta anziché agli assi globali.

## Polinomi a tratti {#piecewise-polynomials}

Il risultato di un’asta è un `Piecewise`: una lista di tratti, ciascuno un polinomio su una parte dell’asta. Un nuovo tratto inizia dove un carico concentrato o una coppia interrompe l’andamento del risultato.

```ts
interface Piece {
  readonly x0: number // m dall’inizio dell’asta
  readonly x1: number
  readonly c: readonly number[] // valore = Σ c[k]·sᵏ, con s = (x − x0)/(x1 − x0)
}
type Piecewise = readonly Piece[]
```

N, V e M sono al più cubici e la freccia al più di quinto grado, quindi pochi coefficienti conservano esattamente la risposta del solutore. Il taglio di una trave di 6 m con 20 kN a 2 m è formato da due tratti costanti:

```json
[{ "x0": 0, "x1": 2, "c": [13333.33] }, { "x0": 2, "x1": 6, "c": [-6666.67] }]
```

## Leggere i valori direttamente {#reading-values-yourself}

Le funzioni che disegnano i diagrammi servono anche a leggerli, esattamente e senza campionamento:

```ts
import { extremes, innerBreaks, modelFromSolver, valueAt } from '@edubeam/plot'

// trave appoggiata di 6 m, 20 kN a 2 m da A, IPE 200 senza deformazione a taglio
const model = modelFromSolver(solver)
const { V, M, w } = model.results!.members['1']

innerBreaks(V) // [2]: i tratti si incontrano sotto il carico
valueAt(V, 2, 'left') // 13333.3 N, subito prima del carico
valueAt(V, 2, 'right') // -6666.7 N, subito dopo
extremes(M) // max 26666.7 N·m a x = 2
extremes(w) // max 0.018973 m a x = 2.734
```

`extremes` restituisce `{ max, min }`, ciascuno `{ x, value, side }`, oppure `null` per una lista vuota. La freccia massima non si trova sotto il carico, ma a $x = L - \sqrt{(L^2 - a^2)/3} = 2{,}734$ m, e vale $P\,a\,(L^2 - a^2)^{3/2}/9\sqrt{3}\,EIL = 18{,}97$ mm, come dà la formula per un carico non centrato.

È così che il [generatore di esercizi](/it/plot/exercises#the-generator) trova i momenti estremi per le soluzioni. La pagina [Funzioni](/it/plot/functions#piecewise-polynomials) elenca il resto: pendenze, estremi all’interno di un tratto, gradi e curve di Bézier.

## Distribuirlo come JSON {#ship-it-as-json}

Basta `JSON.stringify(model)`, e `JSON.parse` restituisce un modello che si disegna esattamente come faceva il solutore. Un telaio a portale con un carico distribuito e un carico concentrato occupa meno di 2 kB. Vedi [Integrazione](/it/plot/embedding#ship-the-drawing-not-the-solver). Un modello alimenta anche [`structureSvg`](/it/plot/functions#a-standalone-svg-file), che lo scrive come file SVG.
