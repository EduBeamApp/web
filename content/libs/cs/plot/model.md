---
title: Model pro vykreslení
description: "PlotModel z modelFromSolver: prostá data pro JSON ze spočteného modelu @edubeam/fem, výsledky jako polynomy po částech a odečet přesných hodnot a extrémů."
order: 9
---

# Model pro vykreslení

Všechno, co @edubeam/plot kreslí, pochází z `PlotModel`: z prostých dat, která `modelFromSolver` přečte ze spočteného modelu @edubeam/fem. Obsahuje geometrii, podpory, zatížení, reakce a výsledky každého prvku jako přesné polynomy. Dá se serializovat do JSONu, takže ho můžete vytvořit už při buildu a posílat místo řešiče. Je to také nejjednodušší cesta, jak ze spočtené konstrukce přečíst přesné hodnoty a extrémy.

```ts
import { modelFromSolver } from '@edubeam/plot'

const model = modelFromSolver(solver) // nebo modelFromSolver(solver, { loadCase: 1 })
```

`results` je k dispozici jen tehdy, když je zatěžovací stav spočtený. Bez výsledků komponenty vykreslí samotný model a s [`reactionLabels: 'names'`](/cs/plot/structure-plot#reactions-as-unknowns) nakreslí i neznámé reakce, takže nespočtený model může posloužit jako zadání příkladu.

## Formát {#the-format}

Všechno je v jednotkách SI (m, N, N·m, N/m, K, rad) a v osách řešiče: x doprava, z dolů, pootočení kladné proti směru hodinových ručiček na obrazovce.

```ts
interface PlotModel {
  readonly nodes: readonly PlotNode[]
  readonly members: readonly PlotMember[]
  readonly loads: readonly PlotLoad[]
  readonly results?: PlotResults // jen pro spočtený zatěžovací stav
}

interface PlotNode {
  readonly id: string
  readonly x: number
  readonly z: number
  readonly fixity: { readonly dx: boolean; readonly dz: boolean; readonly ry: boolean } // podepřené stupně volnosti
  readonly angle: number // pootočení os natočené podpory, rad, po směru hodinových ručiček na obrazovce
}

interface PlotMember {
  readonly id: string
  readonly start: string // id uzlů
  readonly end: string
  readonly hinges: readonly [boolean, boolean]
}

interface PlotResults {
  readonly members: Readonly<Record<string, MemberResults>> // podle id prvku
  readonly reactions: readonly PlotReaction[]
}

interface MemberResults {
  readonly N: Piecewise // normálová síla, tah kladný
  readonly V: Piecewise // posouvající síla
  readonly M: Piecewise // ohybový moment, kladný při tahu na straně lokální +z
  readonly u: Piecewise // posunutí ve směru lokální osy x
  readonly w: Piecewise // posunutí ve směru lokální osy z
}

interface PlotReaction {
  readonly node: string
  readonly dof: 'dx' | 'dz' | 'ry'
  readonly value: number // síla působící na konstrukci ve směru osy uzlu, N (N·m pro ry)
}
```

Každé zatížení patří k jednomu ze sedmi druhů, které rozlišuje pole `kind`:

| `kind` | Pole | Význam |
| --- | --- | --- |
| `'nodalForce'` | `node`, `fx`, `fz` | síla v uzlu, globální složky, N |
| `'nodalMoment'` | `node`, `my` | moment v uzlu, N·m |
| `'distributed'` | `member`, `start`, `end`, `local` | lineárně proměnné spojité zatížení, `{ fx, fz }` na každém konci, N/m; při shodných hodnotách rovnoměrné |
| `'pointForce'` | `member`, `at`, `fx`, `fz`, `local` | osamělá síla ve vzdálenosti `at` metrů od začátku prvku |
| `'pointMoment'` | `member`, `at`, `my` | osamělý moment na prvku |
| `'temperature'` | `member`, `uniform`, `gradient` | K: změna teploty v těžišti a rozdíl spodní mínus horní |
| `'prescribed'` | `node`, `dx?`, `dz?`, `ry?` | předepsané posunutí podpory v osách uzlu, m a rad |

`local` je `true`, když složky míří podél lokálních os x a z prvku, a ne podél globálních os.

## Polynomy po částech {#piecewise-polynomials}

Výsledek na prvku je `Piecewise`: seznam úseků, z nichž každý je polynom na části prvku. Nový úsek začíná všude, kde osamělá síla nebo osamělý moment výsledek přeruší.

```ts
interface Piece {
  readonly x0: number // m od začátku prvku
  readonly x1: number
  readonly c: readonly number[] // hodnota = Σ c[k]·sᵏ, kde s = (x − x0)/(x1 − x0)
}
type Piecewise = readonly Piece[]
```

N, V a M jsou nejvýše kubické a průhyb nejvýše pátého stupně, takže výsledek řešiče přesně vyjádří několik koeficientů. Průběh posouvající síly na nosníku o rozpětí 6 m se silou 20 kN ve vzdálenosti 2 m tvoří dva konstantní úseky:

```json
[{ "x0": 0, "x1": 2, "c": [13333.33] }, { "x0": 2, "x1": 6, "c": [-6666.67] }]
```

## Vlastní odečítání hodnot {#reading-values-yourself}

Funkce, které průběhy kreslí, z nich umějí také číst hodnoty, a to přesně a bez vzorkování:

```ts
import { extremes, innerBreaks, modelFromSolver, valueAt } from '@edubeam/plot'

// prostý nosník 6 m, 20 kN ve vzdálenosti 2 m od A, IPE 200 tuhý ve smyku
const model = modelFromSolver(solver)
const { V, M, w } = model.results!.members['1']

innerBreaks(V) // [2]: úseky se stýkají pod silou
valueAt(V, 2, 'left') // 13333.3 N, těsně před silou
valueAt(V, 2, 'right') // -6666.7 N, těsně za ní
extremes(M) // max 26666.7 N·m v x = 2
extremes(w) // max 0.018973 m v x = 2.734
```

`extremes` vrací `{ max, min }`, každé ve tvaru `{ x, value, side }`, nebo `null` pro prázdný seznam. Největší průhyb není pod silou: je v $x = L - \sqrt{(L^2 - a^2)/3} = 2{,}734$ m a činí $P\,a\,(L^2 - a^2)^{3/2}/9\sqrt{3}\,EIL = 18{,}97$ mm, což odpovídá vzorci pro sílu mimo střed rozpětí.

Takto [generátor příkladů](/cs/plot/exercises#the-generator) hledá extrémní momenty pro klíč řešení. Zbytek, tedy sklony, extrémy uvnitř úseku, stupně polynomů a Bézierovy křivky, najdete na stránce [Funkce](/cs/plot/functions#piecewise-polynomials).

## Přenos jako JSON {#ship-it-as-json}

Stačí `JSON.stringify(model)` a `JSON.parse` vrátí model, který se vykreslí přesně tak jako z řešiče. Dvoukloubový rám se spojitým zatížením a osamělou silou má méně než 2 kB. Viz [Vkládání do stránek](/cs/plot/embedding#ship-the-drawing-not-the-solver). Model lze předat i funkci [`structureSvg`](/cs/plot/functions#a-standalone-svg-file), která ho zapíše jako soubor SVG.
