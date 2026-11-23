---
title: Model na vykreslenie
description: "PlotModel z modelFromSolver: jednoduché dáta pre JSON z vypočítaného modelu @edubeam/fem, výsledky ako po častiach definované polynómy a odčítanie presných hodnôt a extrémov."
order: 9
source: site
---

# Model na vykreslenie

Všetko, čo @edubeam/plot kreslí, pochádza z `PlotModel`: z jednoduchých dát, ktoré `modelFromSolver` prečíta z vypočítaného modelu @edubeam/fem. Obsahuje geometriu, podpery, zaťaženie, reakcie a výsledky každého prvku ako presné polynómy. Dá sa serializovať do JSON, takže ho môžete vytvoriť už pri builde a posielať namiesto riešiča. Je to aj najjednoduchší spôsob, ako z vypočítanej konštrukcie prečítať presné hodnoty a extrémy.

```ts
import { modelFromSolver } from '@edubeam/plot'

const model = modelFromSolver(solver) // alebo modelFromSolver(solver, { loadCase: 1 })
```

`results` je k dispozícii iba vtedy, keď je zaťažovací stav vypočítaný. Bez výsledkov komponenty vykreslia samotný model a s [`reactionLabels: 'names'`](/sk/plot/structure-plot#reactions-as-unknowns) nakreslia aj neznáme reakcie, takže nevypočítaný model môže poslúžiť ako zadanie príkladu.

## Formát {#the-format}

Všetko je v jednotkách SI (m, N, N·m, N/m, K, rad) a v osiach riešiča: x doprava, z nadol, pootočenie kladné proti smeru hodinových ručičiek na obrazovke.

```ts
interface PlotModel {
  readonly nodes: readonly PlotNode[]
  readonly members: readonly PlotMember[]
  readonly loads: readonly PlotLoad[]
  readonly results?: PlotResults // iba pre vypočítaný zaťažovací stav
}

interface PlotNode {
  readonly id: string
  readonly x: number
  readonly z: number
  readonly fixity: { readonly dx: boolean; readonly dz: boolean; readonly ry: boolean } // podopreté stupne voľnosti
  readonly angle: number // pootočenie osí natočenej podpery, rad, v smere hodinových ručičiek na obrazovke
}

interface PlotMember {
  readonly id: string
  readonly start: string // id uzlov
  readonly end: string
  readonly hinges: readonly [boolean, boolean]
}

interface PlotResults {
  readonly members: Readonly<Record<string, MemberResults>> // podľa id prvku
  readonly reactions: readonly PlotReaction[]
}

interface MemberResults {
  readonly N: Piecewise // normálová sila, ťah kladný
  readonly V: Piecewise // priečna sila
  readonly M: Piecewise // ohybový moment, kladný pri ťahu na strane lokálnej +z
  readonly u: Piecewise // posunutie v smere lokálnej osi x
  readonly w: Piecewise // posunutie v smere lokálnej osi z
}

interface PlotReaction {
  readonly node: string
  readonly dof: 'dx' | 'dz' | 'ry'
  readonly value: number // sila pôsobiaca na konštrukciu v smere osi uzla, N (N·m pre ry)
}
```

Každé zaťaženie patrí k jednému zo siedmich druhov, ktoré rozlišuje pole `kind`:

| `kind` | Polia | Význam |
| --- | --- | --- |
| `'nodalForce'` | `node`, `fx`, `fz` | sila v uzle, globálne zložky, N |
| `'nodalMoment'` | `node`, `my` | moment v uzle, N·m |
| `'distributed'` | `member`, `start`, `end`, `local` | lineárne sa meniace spojité zaťaženie, `{ fx, fz }` na každom konci, N/m; pri rovnakých hodnotách rovnomerné |
| `'pointForce'` | `member`, `at`, `fx`, `fz`, `local` | osamelá sila vo vzdialenosti `at` metrov od začiatku prvku |
| `'pointMoment'` | `member`, `at`, `my` | osamelý moment na prvku |
| `'temperature'` | `member`, `uniform`, `gradient` | K: zmena teploty v ťažisku a rozdiel dolné mínus horné vlákna |
| `'prescribed'` | `node`, `dx?`, `dz?`, `ry?` | predpísané posunutie podpery v osiach uzla, m a rad |

`local` je `true`, keď zložky smerujú pozdĺž lokálnych osí x a z prvku, a nie pozdĺž globálnych osí.

## Po častiach definované polynómy {#piecewise-polynomials}

Výsledok na prvku je `Piecewise`: zoznam úsekov, z ktorých každý je polynóm na časti prvku. Nový úsek začína všade, kde osamelá sila alebo osamelý moment výsledok preruší.

```ts
interface Piece {
  readonly x0: number // m od začiatku prvku
  readonly x1: number
  readonly c: readonly number[] // hodnota = Σ c[k]·sᵏ, kde s = (x − x0)/(x1 − x0)
}
type Piecewise = readonly Piece[]
```

N, V a M sú najviac kubické a priehyb najviac piateho stupňa, takže výsledok riešiča presne vyjadrí niekoľko koeficientov. Priebeh priečnej sily na nosníku s rozpätím 6 m so silou 20 kN vo vzdialenosti 2 m tvoria dva konštantné úseky:

```json
[{ "x0": 0, "x1": 2, "c": [13333.33] }, { "x0": 2, "x1": 6, "c": [-6666.67] }]
```

## Vlastné odčítanie hodnôt {#reading-values-yourself}

Funkcie, ktoré priebehy kreslia, vedia z nich aj odčítať hodnoty, a to presne a bez vzorkovania:

```ts
import { extremes, innerBreaks, modelFromSolver, valueAt } from '@edubeam/plot'

// prostý nosník 6 m, 20 kN vo vzdialenosti 2 m od A, IPE 200 tuhý v šmyku
const model = modelFromSolver(solver)
const { V, M, w } = model.results!.members['1']

innerBreaks(V) // [2]: úseky sa stýkajú pod silou
valueAt(V, 2, 'left') // 13333.3 N, tesne pred silou
valueAt(V, 2, 'right') // -6666.7 N, tesne za ňou
extremes(M) // max 26666.7 N·m v x = 2
extremes(w) // max 0.018973 m v x = 2.734
```

`extremes` vracia `{ max, min }`, každý v tvare `{ x, value, side }`, alebo `null` pre prázdny zoznam. Najväčší priehyb nie je pod silou: je v $x = L - \sqrt{(L^2 - a^2)/3} = 2{,}734$ m a má hodnotu $P\,a\,(L^2 - a^2)^{3/2}/9\sqrt{3}\,EIL = 18{,}97$ mm, čo zodpovedá vzorcu pre silu mimo stredu rozpätia.

Takto [generátor príkladov](/sk/plot/exercises#the-generator) hľadá extrémne momenty pre kľúč riešení. Zvyšok, teda sklony, extrémy vnútri úseku, stupne polynómov a Bézierove krivky, nájdete na stránke [Funkcie](/sk/plot/functions#piecewise-polynomials).

## Prenos ako JSON {#ship-it-as-json}

Stačí `JSON.stringify(model)` a `JSON.parse` vráti model, ktorý sa vykreslí presne tak ako z riešiča. Dvojkĺbový rám so spojitým zaťažením a osamelou silou má menej než 2 kB. Pozrite [Vkladanie do stránok](/sk/plot/embedding#ship-the-drawing-not-the-solver). Model možno odovzdať aj funkcii [`structureSvg`](/sk/plot/functions#a-standalone-svg-file), ktorá ho zapíše ako súbor SVG.
