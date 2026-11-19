---
title: Модель рисунка
description: "PlotModel — дані для JSON, які modelFromSolver бере з розрахованої моделі @edubeam/fem: кусково-поліноміальні результати, точні значення й екстремуми."
order: 9
source: site
---

# Модель рисунка

Усе, що малює @edubeam/plot, береться з `PlotModel`: звичайних даних, які `modelFromSolver` зчитує з розрахованої моделі @edubeam/fem. Вона містить геометрію, опори, навантаження, реакції та результати кожного стрижня у вигляді точних поліномів. Її можна серіалізувати в JSON, тож її можна створити під час збирання й передавати замість розв’язувача, і це найпростіший спосіб прочитати точні значення та екстремуми розрахованої конструкції.

```ts
import { modelFromSolver } from '@edubeam/plot'

const model = modelFromSolver(solver) // або modelFromSolver(solver, { loadCase: 1 })
```

`results` є лише тоді, коли випадок навантаження розраховано. Без нього компоненти малюють саму модель, а з [`reactionLabels: 'names'`](/uk/plot/structure-plot#reactions-as-unknowns) все одно малюють невідомі реакції, тож нерозрахована модель може слугувати аркушем завдань.

## Формат {#the-format}

Усе задано в одиницях СІ (m, N, N·m, N/m, K, rad) і в осях розв’язувача: x праворуч, z униз, повороти додатні проти годинникової стрілки на екрані.

```ts
interface PlotModel {
  readonly nodes: readonly PlotNode[]
  readonly members: readonly PlotMember[]
  readonly loads: readonly PlotLoad[]
  readonly results?: PlotResults // лише для розрахованого випадку навантаження
}

interface PlotNode {
  readonly id: string
  readonly x: number
  readonly z: number
  readonly fixity: { readonly dx: boolean; readonly dz: boolean; readonly ry: boolean } // закріплені ступені вільності
  readonly angle: number // поворот осей повернутої опори, rad, за годинниковою стрілкою на екрані
}

interface PlotMember {
  readonly id: string
  readonly start: string // ідентифікатори вузлів
  readonly end: string
  readonly hinges: readonly [boolean, boolean]
}

interface PlotResults {
  readonly members: Readonly<Record<string, MemberResults>> // за ідентифікатором стрижня
  readonly reactions: readonly PlotReaction[]
}

interface MemberResults {
  readonly N: Piecewise // поздовжня сила, розтяг додатний
  readonly V: Piecewise // поперечна сила
  readonly M: Piecewise // згинальний момент, додатний, коли розтягнуті волокна з боку локальної +z
  readonly u: Piecewise // переміщення вздовж локальної осі x
  readonly w: Piecewise // переміщення вздовж локальної осі z
}

interface PlotReaction {
  readonly node: string
  readonly dof: 'dx' | 'dz' | 'ry'
  readonly value: number // сила, що діє на конструкцію вздовж осі вузла, N (для ry — N·m)
}
```

Навантаження буває одного із семи видів, які розрізняє поле `kind`:

| `kind` | Поля | Що це |
| --- | --- | --- |
| `'nodalForce'` | `node`, `fx`, `fz` | сила у вузлі, глобальні складові, N |
| `'nodalMoment'` | `node`, `my` | момент у вузлі, N·m |
| `'distributed'` | `member`, `start`, `end`, `local` | лінійно змінне розподілене навантаження, `{ fx, fz }` на кожному кінці, N/m; рівномірне, коли вони однакові |
| `'pointForce'` | `member`, `at`, `fx`, `fz`, `local` | сила на відстані `at` метрів від початку стрижня |
| `'pointMoment'` | `member`, `at`, `my` | зосереджений момент на стрижні |
| `'temperature'` | `member`, `uniform`, `gradient` | K: зміна температури в центрі ваги перерізу та перепад температури (нижній край мінус верхній) |
| `'prescribed'` | `node`, `dx?`, `dz?`, `ry?` | переміщення опори в осях вузла, m і rad |

`local` має значення `true`, коли складові задано вздовж локальних осей x і z стрижня, а не в глобальних осях.

## Кусково-поліноміальні функції {#piecewise-polynomials}

Результат стрижня — це `Piecewise`: список ділянок, кожна з яких є поліномом на частині стрижня. Нова ділянка починається там, де зосереджена сила чи момент спричиняє стрибок чи злам результату.

```ts
interface Piece {
  readonly x0: number // m від початку стрижня
  readonly x1: number
  readonly c: readonly number[] // значення = Σ c[k]·sᵏ, де s = (x − x0)/(x1 − x0)
}
type Piecewise = readonly Piece[]
```

N, V і M — щонайбільше кубічні поліноми, а прогин — щонайбільше п’ятого степеня, тож кількох коефіцієнтів досить, щоб точно зберегти розв’язок. Поперечна сила в балці прольотом 6 m із силою 20 kN на відстані 2 m — це дві сталі ділянки:

```json
[{ "x0": 0, "x1": 2, "c": [13333.33] }, { "x0": 2, "x1": 6, "c": [-6666.67] }]
```

## Самостійне зчитування значень {#reading-values-yourself}

Функції, які малюють епюри, вміють їх і зчитувати — точно й без дискретизації:

```ts
import { extremes, innerBreaks, modelFromSolver, valueAt } from '@edubeam/plot'

// шарнірно оперта балка 6 m, 20 kN на відстані 2 m від A, IPE 200 без деформацій зсуву
const model = modelFromSolver(solver)
const { V, M, w } = model.results!.members['1']

innerBreaks(V) // [2]: ділянки стикуються під силою
valueAt(V, 2, 'left') // 13333.3 N, безпосередньо перед силою
valueAt(V, 2, 'right') // -6666.7 N, одразу за нею
extremes(M) // max 26666.7 N·m при x = 2
extremes(w) // max 0.018973 m при x = 2.734
```

`extremes` повертає `{ max, min }`, кожен у вигляді `{ x, value, side }`, або `null` для порожнього списку. Найбільший прогин — не під силою: він розташований у точці $x = L - \sqrt{(L^2 - a^2)/3} = 2{,}734$ m і дорівнює $P\,a\,(L^2 - a^2)^{3/2}/9\sqrt{3}\,EIL = 18{,}97$ mm, як дає формула для сили, прикладеної не посередині прольоту.

Саме так [генератор вправ](/uk/plot/exercises#the-generator) знаходить екстремальні моменти для відповідей. Решту функцій наведено на сторінці [Функції](/uk/plot/functions#piecewise-polynomials): похідні, екстремуми всередині ділянки, степені поліномів і криві Безьє.

## Передавання в JSON {#ship-it-as-json}

Досить `JSON.stringify(model)`, а `JSON.parse` повертає модель, яка малюється точно так само, як із розв’язувача. П-подібна рама з розподіленим навантаженням і зосередженою силою займає менше ніж 2 kB. Див. [Вбудовування](/uk/plot/embedding#ship-the-drawing-not-the-solver). Модель також можна передати у [`structureSvg`](/uk/plot/functions#a-standalone-svg-file), яка записує її як файл SVG.
