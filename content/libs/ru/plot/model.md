---
title: Модель рисунка
description: "PlotModel — сериализуемая в JSON модель, которую modelFromSolver создаёт из расчёта @edubeam/fem: кусочные полиномы результатов, точные значения и экстремумы."
order: 9
source: site
---

# Модель рисунка

Всё, что рисует @edubeam/plot, берётся из `PlotModel` — простых данных, которые `modelFromSolver` извлекает из рассчитанной модели @edubeam/fem. В них хранятся геометрия, опоры, нагрузки, реакции и результаты для каждого стержня в виде точных полиномов. Модель сериализуется в JSON, поэтому её можно создать во время сборки и передавать вместо решателя; кроме того, это самый простой способ получить точные значения и экстремумы для рассчитанной конструкции.

```ts
import { modelFromSolver } from '@edubeam/plot'

const model = modelFromSolver(solver) // или modelFromSolver(solver, { loadCase: 1 })
```

Поле `results` есть только у рассчитанного случая нагружения. Без него компоненты рисуют одну модель, а с [`reactionLabels: 'names'`](/ru/plot/structure-plot#reactions-as-unknowns) по-прежнему рисуют неизвестные реакции, так что нерассчитанная модель может служить условием задачи.

## Формат {#the-format}

Все величины даны в единицах СИ (м, Н, Н·м, Н/м, К, рад) и в осях решателя: x вправо, z вниз, повороты положительны против часовой стрелки на экране.

```ts
interface PlotModel {
  readonly nodes: readonly PlotNode[]
  readonly members: readonly PlotMember[]
  readonly loads: readonly PlotLoad[]
  readonly results?: PlotResults // только для рассчитанного случая нагружения
}

interface PlotNode {
  readonly id: string
  readonly x: number
  readonly z: number
  readonly fixity: { readonly dx: boolean; readonly dz: boolean; readonly ry: boolean } // закреплённые степени свободы
  readonly angle: number // поворот осей повёрнутой опоры, рад, по часовой стрелке на экране
}

interface PlotMember {
  readonly id: string
  readonly start: string // идентификаторы узлов
  readonly end: string
  readonly hinges: readonly [boolean, boolean]
}

interface PlotResults {
  readonly members: Readonly<Record<string, MemberResults>> // по идентификатору стержня
  readonly reactions: readonly PlotReaction[]
}

interface MemberResults {
  readonly N: Piecewise // продольная сила, растяжение положительно
  readonly V: Piecewise // поперечная сила
  readonly M: Piecewise // изгибающий момент, положителен при растяжении со стороны локальной оси +z
  readonly u: Piecewise // перемещение вдоль локальной оси x
  readonly w: Piecewise // перемещение вдоль локальной оси z
}

interface PlotReaction {
  readonly node: string
  readonly dof: 'dx' | 'dz' | 'ry'
  readonly value: number // сила, действующая на конструкцию вдоль оси узла, Н (Н·м для ry)
}
```

Нагрузка относится к одному из семи видов, которые различаются полем `kind`:

| `kind` | Поля | Что это |
| --- | --- | --- |
| `'nodalForce'` | `node`, `fx`, `fz` | сила в узле, компоненты в глобальных осях, Н |
| `'nodalMoment'` | `node`, `my` | момент в узле, Н·м |
| `'distributed'` | `member`, `start`, `end`, `local` | распределённая нагрузка, меняющаяся по линейному закону, `{ fx, fz }` на каждом конце, Н/м; при равных значениях — равномерная |
| `'pointForce'` | `member`, `at`, `fx`, `fz`, `local` | сила на расстоянии `at` метров от начала стержня |
| `'pointMoment'` | `member`, `at`, `my` | сосредоточенный момент на стержне |
| `'temperature'` | `member`, `uniform`, `gradient` | К: изменение температуры на оси стержня и разность температур нижних и верхних волокон |
| `'prescribed'` | `node`, `dx?`, `dz?`, `ry?` | заданное перемещение опоры в осях узла, м и рад |

`local` равно `true`, если компоненты заданы вдоль локальных осей x и z стержня, а не в глобальных осях.

## Кусочные полиномы {#piecewise-polynomials}

Результат для стержня — это `Piecewise`: список участков, на каждом из которых он задан полиномом. Новый участок начинается везде, где сосредоточенная сила или момент вызывают излом или скачок результата.

```ts
interface Piece {
  readonly x0: number // м от начала стержня
  readonly x1: number
  readonly c: readonly number[] // значение = Σ c[k]·sᵏ, где s = (x − x0)/(x1 − x0)
}
type Piecewise = readonly Piece[]
```

N, V и M — полиномы не выше третьей степени, прогиб — не выше пятой, поэтому нескольких коэффициентов хватает, чтобы точно передать ответ решателя. Поперечная сила в балке пролётом 6 м с силой 20 кН в 2 м от опоры состоит из двух постоянных участков:

```json
[{ "x0": 0, "x1": 2, "c": [13333.33] }, { "x0": 2, "x1": 6, "c": [-6666.67] }]
```

## Самостоятельное считывание значений {#reading-values-yourself}

Функции, которые рисуют эпюры, умеют их и считывать — точно и без дискретизации:

```ts
import { extremes, innerBreaks, modelFromSolver, valueAt } from '@edubeam/plot'

// шарнирно опёртая балка 6 м, 20 кН в 2 м от A, IPE 200 без деформаций сдвига
const model = modelFromSolver(solver)
const { V, M, w } = model.results!.members['1']

innerBreaks(V) // [2]: участки стыкуются под силой
valueAt(V, 2, 'left') // 13333.3 Н, непосредственно перед силой
valueAt(V, 2, 'right') // -6666.7 Н, сразу после неё
extremes(M) // максимум 26666.7 Н·м при x = 2
extremes(w) // максимум 0.018973 м при x = 2.734
```

`extremes` возвращает `{ max, min }`, каждый в виде `{ x, value, side }`, или `null` для пустого списка. Наибольший прогиб находится не под силой: он возникает в точке $x = L - \sqrt{(L^2 - a^2)/3} = 2{,}734$ м и равен $P\,a\,(L^2 - a^2)^{3/2}/9\sqrt{3}\,EIL = 18{,}97$ мм — именно это даёт формула для силы, приложенной не в середине пролёта.

Так [генератор задач](/ru/plot/exercises#the-generator) находит экстремальные моменты для ответов. Остальное перечислено на странице [Функции](/ru/plot/functions#piecewise-polynomials): наклоны, экстремумы внутри участка, степени полиномов и кривые Безье.

## Передача в JSON {#ship-it-as-json}

Достаточно `JSON.stringify(model)`, а `JSON.parse` возвращает модель, которая рисуется в точности так же, как по решателю. П-образная рама с распределённой и сосредоточенной нагрузками занимает меньше 2 КБ. См. [Встраивание](/ru/plot/embedding#ship-the-drawing-not-the-solver). Модель можно передать и в [`structureSvg`](/ru/plot/functions#a-standalone-svg-file), которая запишет её в SVG-файл.
