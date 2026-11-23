---
title: A rajz modellje
description: "A JSON-ba szerializálható PlotModel, amelyet a modelFromSolver egy kiszámított @edubeam/fem modellből készít: szakaszonként polinomiális eredmények, pontos értékek és szélső értékek."
order: 9
source: site
---

# A rajz modellje

Mindaz, amit az @edubeam/plot rajzol, egy `PlotModel` objektumból származik: egyszerű adatokból, amelyeket a `modelFromSolver` olvas ki egy kiszámított @edubeam/fem modellből. Ezek tartalmazzák a geometriát, a támaszokat, a terheket, a támaszerőket és minden rúd eredményeit pontos polinomok formájában. Az adatok JSON-ba szerializálhatók, így a build idején elkészíthetők, és a számítómag helyett szállíthatók; ez egyben a legegyszerűbb módja annak is, hogy egy kiszámított szerkezet pontos értékeit és szélső értékeit kiolvasd.

```ts
import { modelFromSolver } from '@edubeam/plot'

const model = modelFromSolver(solver) // vagy modelFromSolver(solver, { loadCase: 1 })
```

A `results` csak akkor van jelen, ha a terhelési eset ki van számítva. Nélküle a komponensek csak magát a modellt rajzolják meg, a [`reactionLabels: 'names'`](/hu/plot/structure-plot#reactions-as-unknowns) beállítással azonban az ismeretlen támaszerőket is, így egy ki nem számított modell is lehet feladatlap.

## A formátum {#the-format}

Minden érték SI-egységben (m, N, N·m, N/m, K, rad) és a számítómag tengelyrendszerében szerepel: x jobbra, z lefelé, az elfordulás a képernyőn az óramutató járásával ellentétesen pozitív.

```ts
interface PlotModel {
  readonly nodes: readonly PlotNode[]
  readonly members: readonly PlotMember[]
  readonly loads: readonly PlotLoad[]
  readonly results?: PlotResults // csak kiszámított terhelési esetnél
}

interface PlotNode {
  readonly id: string
  readonly x: number
  readonly z: number
  readonly fixity: { readonly dx: boolean; readonly dz: boolean; readonly ry: boolean } // megtámasztott szabadságfokok
  readonly angle: number // elforgatott támasz tengelyeinek elfordulása, rad, a képernyőn az óramutató járásával megegyezően
}

interface PlotMember {
  readonly id: string
  readonly start: string // csomópont-azonosítók
  readonly end: string
  readonly hinges: readonly [boolean, boolean]
}

interface PlotResults {
  readonly members: Readonly<Record<string, MemberResults>> // rúdazonosító szerint
  readonly reactions: readonly PlotReaction[]
}

interface MemberResults {
  readonly N: Piecewise // normálerő, húzás pozitív
  readonly V: Piecewise // nyíróerő
  readonly M: Piecewise // hajlítónyomaték, pozitív, ha a lokális +z oldal húzott
  readonly u: Piecewise // elmozdulás a lokális x mentén
  readonly w: Piecewise // elmozdulás a lokális z mentén
}

interface PlotReaction {
  readonly node: string
  readonly dof: 'dx' | 'dz' | 'ry'
  readonly value: number // a szerkezetre ható erő a csomópont tengelye mentén, N (ry esetén N·m)
}
```

Egy teher hétféle lehet, ezeket a `kind` mező különbözteti meg:

| `kind` | Mezők | Jelentés |
| --- | --- | --- |
| `'nodalForce'` | `node`, `fx`, `fz` | csomóponti erő, globális komponensek, N |
| `'nodalMoment'` | `node`, `my` | csomóponti nyomaték, N·m |
| `'distributed'` | `member`, `start`, `end`, `local` | lineárisan változó megoszló teher, mindkét végen `{ fx, fz }`, N/m; egyenletesen megoszló, ha a kettő egyenlő |
| `'pointForce'` | `member`, `at`, `fx`, `fz`, `local` | erő a rúd kezdetétől `at` méterre |
| `'pointMoment'` | `member`, `at`, `my` | koncentrált nyomaték a rúdon |
| `'temperature'` | `member`, `uniform`, `gradient` | K: a hőmérséklet-változás a súlypontban, valamint az alsó és a felső szál különbsége |
| `'prescribed'` | `node`, `dx?`, `dz?`, `ry?` | előírt támaszelmozdulás a csomópont tengelyeiben, m és rad |

A `local` értéke `true`, ha a komponensek a rúd lokális x és z tengelye mentén értendők, nem a globális tengelyek mentén.

## Szakaszonként definiált polinomok {#piecewise-polynomials}

Egy rúd eredménye `Piecewise`: szakaszok listája, amelyek mindegyike egy polinom a rúd egy részén. Új szakasz kezdődik mindenütt, ahol egy koncentrált erő vagy nyomaték megtöri az eredmény lefutását.

```ts
interface Piece {
  readonly x0: number // m a rúd kezdetétől
  readonly x1: number
  readonly c: readonly number[] // érték = Σ c[k]·sᵏ, ahol s = (x − x0)/(x1 − x0)
}
type Piecewise = readonly Piece[]
```

N, V és M legfeljebb harmadfokú, a lehajlás legfeljebb ötödfokú, így néhány együttható pontosan tárolja a számítómag eredményét. Egy 6 m-es tartó nyíróereje 2 m-nél ható 20 kN-os erő esetén két állandó szakaszból áll:

```json
[{ "x0": 0, "x1": 2, "c": [13333.33] }, { "x0": 2, "x1": 6, "c": [-6666.67] }]
```

## Értékek leolvasása saját kézzel {#reading-values-yourself}

Az ábrákat rajzoló függvények az értékeket ki is olvassák, pontosan és mintavételezés nélkül:

```ts
import { extremes, innerBreaks, modelFromSolver, valueAt } from '@edubeam/plot'

// 6 m-es kéttámaszú tartó, 20 kN A-tól 2 m-re, nyírásra merev IPE 200
const model = modelFromSolver(solver)
const { V, M, w } = model.results!.members['1']

innerBreaks(V) // [2]: a szakaszok az erő alatt találkoznak
valueAt(V, 2, 'left') // 13333.3 N, közvetlenül az erő előtt
valueAt(V, 2, 'right') // -6666.7 N, közvetlenül utána
extremes(M) // max 26666.7 N·m, x = 2 helyen
extremes(w) // max 0.018973 m, x = 2.734 helyen
```

Az `extremes` visszatérési értéke `{ max, min }`, mindkettő `{ x, value, side }` alakban, üres lista esetén `null`. A legnagyobb lehajlás nem az erő alatt van: az $x = L - \sqrt{(L^2 - a^2)/3} = 2{,}734$ m helyen lép fel, és értéke $P\,a\,(L^2 - a^2)^{3/2}/9\sqrt{3}\,EIL = 18{,}97$ mm, ahogy a nem középen ható erőre vonatkozó képlet adja.

Így találja meg a [feladatgenerátor](/hu/plot/exercises#the-generator) a megoldókulcshoz a szélső nyomatékokat. A többit – meredekségeket, szakaszon belüli szélső értékeket, fokszámokat és Bézier-görbéket – a [Függvények](/hu/plot/functions#piecewise-polynomials) oldal sorolja fel.

## Szállítás JSON-ként {#ship-it-as-json}

Csak egy `JSON.stringify(model)` kell, és a `JSON.parse` olyan modellt ad vissza, amely pontosan úgy rajzolódik ki, mint a számítómagból. Egy megoszló teherrel és koncentrált erővel terhelt keret 2 kB alatt van. Lásd: [Beágyazás](/hu/plot/embedding#ship-the-drawing-not-the-solver). A modell a [`structureSvg`](/hu/plot/functions#a-standalone-svg-file) bemenete is lehet, amely SVG-fájlként írja ki.
