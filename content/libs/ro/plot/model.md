---
title: Modelul desenului
description: "PlotModel, serializabil în JSON, produs de modelFromSolver dintr-un model @edubeam/fem calculat: rezultate ca polinoame pe porțiuni, valori exacte și extreme."
order: 9
source: site
---

# Modelul desenului

Tot ce desenează @edubeam/plot vine dintr-un `PlotModel`: date simple pe care `modelFromSolver` le extrage dintr-un model @edubeam/fem calculat. El conține geometria, reazemele, încărcările, reacțiunile și rezultatele fiecărei bare ca polinoame exacte. Este serializabil în JSON, așa că poate fi creat la build și livrat în locul programului de calcul, și este cel mai simplu mod de a citi valorile exacte și extremele unei structuri calculate.

```ts
import { modelFromSolver } from '@edubeam/plot'

const model = modelFromSolver(solver) // sau modelFromSolver(solver, { loadCase: 1 })
```

`results` există doar când cazul de încărcare este calculat. Fără el, componentele desenează doar modelul, iar cu [`reactionLabels: 'names'`](/ro/plot/structure-plot#reactions-as-unknowns) desenează în continuare reacțiunile necunoscute, așa că un model necalculat poate servi drept enunț de exercițiu.

## Formatul {#the-format}

Totul este în unități SI (m, N, N·m, N/m, K, rad) și în axele programului de calcul: x spre dreapta, z în jos, rotiri pozitive în sens antiorar pe ecran.

```ts
interface PlotModel {
  readonly nodes: readonly PlotNode[]
  readonly members: readonly PlotMember[]
  readonly loads: readonly PlotLoad[]
  readonly results?: PlotResults // doar pentru un caz de încărcare calculat
}

interface PlotNode {
  readonly id: string
  readonly x: number
  readonly z: number
  readonly fixity: { readonly dx: boolean; readonly dz: boolean; readonly ry: boolean } // gradele de libertate blocate
  readonly angle: number // rotirea axelor unui reazem înclinat, rad, în sens orar pe ecran
}

interface PlotMember {
  readonly id: string
  readonly start: string // identificatoarele nodurilor
  readonly end: string
  readonly hinges: readonly [boolean, boolean]
}

interface PlotResults {
  readonly members: Readonly<Record<string, MemberResults>> // după identificatorul barei
  readonly reactions: readonly PlotReaction[]
}

interface MemberResults {
  readonly N: Piecewise // forța axială, pozitivă la întindere
  readonly V: Piecewise // forța tăietoare
  readonly M: Piecewise // momentul încovoietor, pozitiv când întinde fibra dinspre axa locală +z
  readonly u: Piecewise // deplasarea după axa locală x
  readonly w: Piecewise // deplasarea după axa locală z
}

interface PlotReaction {
  readonly node: string
  readonly dof: 'dx' | 'dz' | 'ry'
  readonly value: number // forța care acționează asupra structurii după axa nodului, N (N·m pentru ry)
}
```

O încărcare are unul din șapte tipuri, deosebite prin `kind`:

| `kind` | Câmpuri | Înseamnă |
| --- | --- | --- |
| `'nodalForce'` | `node`, `fx`, `fz` | o forță într-un nod, componente globale, N |
| `'nodalMoment'` | `node`, `my` | un moment într-un nod, N·m |
| `'distributed'` | `member`, `start`, `end`, `local` | o încărcare liniar variabilă, `{ fx, fz }` la fiecare capăt, N/m; uniform distribuită când sunt egale |
| `'pointForce'` | `member`, `at`, `fx`, `fz`, `local` | o forță la `at` metri de începutul barei |
| `'pointMoment'` | `member`, `at`, `my` | un moment concentrat pe o bară |
| `'temperature'` | `member`, `uniform`, `gradient` | K: variația în centrul de greutate și diferența jos minus sus |
| `'prescribed'` | `node`, `dx?`, `dz?`, `ry?` | o cedare de reazem în axele nodului, m și rad |

`local` este `true` când componentele sunt date după axele locale x și z ale barei, nu după axele globale.

## Polinoame pe porțiuni {#piecewise-polynomials}

Rezultatul unei bare este un `Piecewise`: o listă de porțiuni, fiecare fiind un polinom pe o parte a barei. O porțiune nouă începe oriunde o forță concentrată sau un moment concentrat întrerupe variația rezultatului.

```ts
interface Piece {
  readonly x0: number // m de la începutul barei
  readonly x1: number
  readonly c: readonly number[] // valoarea = Σ c[k]·sᵏ, unde s = (x − x0)/(x1 − x0)
}
type Piecewise = readonly Piece[]
```

N, V și M sunt cel mult de gradul trei, iar săgeata cel mult de gradul cinci, așa că câțiva coeficienți păstrează exact rezultatul programului de calcul. Forța tăietoare a unei grinzi de 6 m cu 20 kN la 2 m înseamnă două porțiuni constante:

```json
[{ "x0": 0, "x1": 2, "c": [13333.33] }, { "x0": 2, "x1": 6, "c": [-6666.67] }]
```

## Citirea directă a valorilor {#reading-values-yourself}

Aceleași funcții care desenează diagramele le pot și citi, exact și fără eșantionare:

```ts
import { extremes, innerBreaks, modelFromSolver, valueAt } from '@edubeam/plot'

// grindă simplu rezemată de 6 m, 20 kN la 2 m de A, IPE 200 fără deformații din forfecare
const model = modelFromSolver(solver)
const { V, M, w } = model.results!.members['1']

innerBreaks(V) // [2]: porțiunile se întâlnesc sub forță
valueAt(V, 2, 'left') // 13333.3 N, imediat înainte de forță
valueAt(V, 2, 'right') // -6666.7 N, imediat după ea
extremes(M) // max 26666.7 N·m în x = 2
extremes(w) // max 0.018973 m în x = 2.734
```

`extremes` întoarce `{ max, min }`, fiecare ca `{ x, value, side }`, sau `null` pentru o listă goală. Săgeata maximă nu este sub forță: ea apare la $x = L - \sqrt{(L^2 - a^2)/3} = 2{,}734$ m și valorează $P\,a\,(L^2 - a^2)^{3/2}/9\sqrt{3}\,EIL = 18{,}97$ mm, cum dă formula pentru o forță aplicată excentric față de mijlocul deschiderii.

Așa găsește [generatorul de exerciții](/ro/plot/exercises#the-generator) momentele extreme pentru barem. Pagina [Funcții](/ro/plot/functions#piecewise-polynomials) le enumeră pe celelalte: pante, extreme în interiorul unei porțiuni, grade și curbe Bézier.

## Livrarea ca JSON {#ship-it-as-json}

E de ajuns `JSON.stringify(model)`, iar `JSON.parse` dă înapoi un model care se desenează exact ca din programul de calcul. Un cadru portal cu o încărcare distribuită și o forță concentrată ocupă sub 2 kB. Vezi [Integrare](/ro/plot/embedding#ship-the-drawing-not-the-solver). Un model alimentează și [`structureSvg`](/ro/plot/functions#a-standalone-svg-file), care îl scrie ca fișier SVG.
