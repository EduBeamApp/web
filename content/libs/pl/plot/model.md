---
title: Model rysunku
description: "PlotModel z modelFromSolver: zwykły JSON z obliczonego modelu @edubeam/fem, wyniki jako wielomiany przedziałami i odczyt dokładnych wartości oraz ekstremów."
order: 9
source: site
---

# Model rysunku

Wszystko, co rysuje @edubeam/plot, pochodzi z `PlotModel`: zwykłych danych, które `modelFromSolver` odczytuje z obliczonego modelu @edubeam/fem. Zawierają geometrię, podpory, obciążenia, reakcje i wyniki każdego pręta w postaci dokładnych wielomianów. Dane dają się serializować do JSON, więc można je przygotować w czasie budowania i dostarczyć zamiast solvera; to także najprostszy sposób na odczytanie dokładnych wartości i ekstremów obliczonej konstrukcji.

```ts
import { modelFromSolver } from '@edubeam/plot'

const model = modelFromSolver(solver) // albo modelFromSolver(solver, { loadCase: 1 })
```

`results` występuje tylko wtedy, gdy przypadek obciążenia jest obliczony. Bez wyników komponenty rysują sam model, a z [`reactionLabels: 'names'`](/pl/plot/structure-plot#reactions-as-unknowns) rysują też niewiadome reakcje, więc nieobliczony model może posłużyć jako treść zadania.

## Format {#the-format}

Wszystko jest w jednostkach SI (m, N, N·m, N/m, K, rad) i w osiach solvera: x w prawo, z w dół, obroty dodatnie przeciwnie do ruchu wskazówek zegara na ekranie.

```ts
interface PlotModel {
  readonly nodes: readonly PlotNode[]
  readonly members: readonly PlotMember[]
  readonly loads: readonly PlotLoad[]
  readonly results?: PlotResults // tylko dla obliczonego przypadku obciążenia
}

interface PlotNode {
  readonly id: string
  readonly x: number
  readonly z: number
  readonly fixity: { readonly dx: boolean; readonly dz: boolean; readonly ry: boolean } // podparte stopnie swobody
  readonly angle: number // obrót osi podpory ukośnej, rad, zgodnie z ruchem wskazówek zegara na ekranie
}

interface PlotMember {
  readonly id: string
  readonly start: string // identyfikatory węzłów
  readonly end: string
  readonly hinges: readonly [boolean, boolean]
}

interface PlotResults {
  readonly members: Readonly<Record<string, MemberResults>> // według identyfikatora pręta
  readonly reactions: readonly PlotReaction[]
}

interface MemberResults {
  readonly N: Piecewise // siła normalna, rozciąganie dodatnie
  readonly V: Piecewise // siła tnąca
  readonly M: Piecewise // moment zginający, dodatni, gdy rozciąga stronę lokalnej osi +z
  readonly u: Piecewise // przemieszczenie wzdłuż lokalnej osi x
  readonly w: Piecewise // przemieszczenie wzdłuż lokalnej osi z
}

interface PlotReaction {
  readonly node: string
  readonly dof: 'dx' | 'dz' | 'ry'
  readonly value: number // siła działająca na konstrukcję wzdłuż osi węzła, N (N·m dla ry)
}
```

Obciążenie jest jednym z siedmiu rodzajów, rozróżnianych polem `kind`:

| `kind` | Pola | Oznacza |
| --- | --- | --- |
| `'nodalForce'` | `node`, `fx`, `fz` | siłę w węźle, składowe globalne, N |
| `'nodalMoment'` | `node`, `my` | moment w węźle, N·m |
| `'distributed'` | `member`, `start`, `end`, `local` | obciążenie liniowo zmienne, `{ fx, fz }` na każdym końcu, N/m; równomierne, gdy są równe |
| `'pointForce'` | `member`, `at`, `fx`, `fz`, `local` | siłę w odległości `at` metrów od początku pręta |
| `'pointMoment'` | `member`, `at`, `my` | moment skupiony na pręcie |
| `'temperature'` | `member`, `uniform`, `gradient` | K: zmianę temperatury w środku ciężkości oraz różnicę temperatur dół – góra |
| `'prescribed'` | `node`, `dx?`, `dz?`, `ry?` | przemieszczenie podpory w osiach węzła, m i rad |

`local` ma wartość `true`, gdy składowe są podane wzdłuż lokalnych osi x i z pręta, a nie osi globalnych.

## Wielomiany przedziałami {#piecewise-polynomials}

Wynik pręta to `Piecewise`: lista odcinków, z których każdy jest wielomianem na części pręta. Nowy odcinek zaczyna się wszędzie tam, gdzie siła skupiona lub moment skupiony przerywa przebieg wyniku.

```ts
interface Piece {
  readonly x0: number // m od początku pręta
  readonly x1: number
  readonly c: readonly number[] // wartość = Σ c[k]·sᵏ, gdzie s = (x − x0)/(x1 − x0)
}
type Piecewise = readonly Piece[]
```

N, V i M są co najwyżej trzeciego stopnia, a ugięcie co najwyżej piątego, więc kilka współczynników zapisuje odpowiedź solvera dokładnie. Siła tnąca w belce o rozpiętości 6 m z siłą 20 kN w odległości 2 m to dwa odcinki stałe:

```json
[{ "x0": 0, "x1": 2, "c": [13333.33] }, { "x0": 2, "x1": 6, "c": [-6666.67] }]
```

## Samodzielny odczyt wartości {#reading-values-yourself}

Funkcje, które rysują wykresy, również je odczytują, dokładnie i bez próbkowania:

```ts
import { extremes, innerBreaks, modelFromSolver, valueAt } from '@edubeam/plot'

// belka swobodnie podparta 6 m, 20 kN w odległości 2 m od A, IPE 200 bez odkształceń postaciowych
const model = modelFromSolver(solver)
const { V, M, w } = model.results!.members['1']

innerBreaks(V) // [2]: odcinki stykają się pod siłą
valueAt(V, 2, 'left') // 13333.3 N, tuż przed siłą
valueAt(V, 2, 'right') // -6666.7 N, tuż za nią
extremes(M) // max 26666.7 N·m w x = 2
extremes(w) // max 0.018973 m w x = 2.734
```

`extremes` zwraca `{ max, min }`, każde w postaci `{ x, value, side }`, albo `null` dla pustej listy. Największe ugięcie nie występuje pod siłą: jest w $x = L - \sqrt{(L^2 - a^2)/3} = 2{,}734$ m i wynosi $P\,a\,(L^2 - a^2)^{3/2}/9\sqrt{3}\,EIL = 18{,}97$ mm, zgodnie ze wzorem dla siły przyłożonej poza środkiem rozpiętości.

W ten sposób [generator zadań](/pl/plot/exercises#the-generator) znajduje ekstremalne momenty do klucza odpowiedzi. Pozostałe funkcje: kąty nachylenia, ekstrema wewnątrz odcinka, stopnie i krzywe Béziera, wymienia strona [Funkcje](/pl/plot/functions#piecewise-polynomials).

## Dostarczanie jako JSON {#ship-it-as-json}

Wystarczy `JSON.stringify(model)`, a `JSON.parse` zwraca model, który rysuje się dokładnie tak jak z solvera. Rama portalowa z obciążeniem rozłożonym i siłą skupioną zajmuje poniżej 2 kB. Zob. [Osadzanie](/pl/plot/embedding#ship-the-drawing-not-the-solver). Model zasila też [`structureSvg`](/pl/plot/functions#a-standalone-svg-file), które zapisuje go jako plik SVG.
