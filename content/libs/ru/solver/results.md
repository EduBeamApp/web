---
title: Чтение результатов
description: "Реакции, перемещения узлов, внутренние усилия в любой точке стержня, деформированная схема и концевые усилия модели @edubeam/fem и форма каждого ответа."
order: 10
source: site
---

# Чтение результатов {#reading-results}

После `solve()` результаты читаются из узлов и стержней для заданного случая нагружения. Все примеры на этой странице читают одну модель: шарнирно опёртую балку пролётом 6 м из IPE 200 без деформаций сдвига, с силой 20 кН в 2 м от A:

```ts [results.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 }) // без деформаций сдвига

const A = domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
const B = domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
const lc = solver.loadCases[0]
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], true)
solver.solve()
```

::model-figure{caption="Сила 20 кН в 2 м от A на пролёте 6 м"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M, w]
show: [nodeLabels]
---
::

## Где что читать {#what-to-read-where}

| Результат | Вызов | Возвращает |
| --- | --- | --- |
| Реакции | `node.getReactions(lc)` | `{ dofs, values }`: Н, Н·м |
| Перемещения | `node.getUnknowns(lc, dofs)` | м, рад |
| N, V или M в точке | `beam.computeBendingMomentAt(lc, x)` | число: Н, Н·м |
| N, V или M вдоль стержня | `beam.computeBendingMoment(lc, n)` | `{ x, M }`, n + 1 точек |
| Деформированная схема | `beam.computeLocalDefl(lc, n)` | `{ u, w }`, n + 1 точек, м |
| Концевые усилия | `beam.computeEndForces(lc)` | матрица mathjs из 6 значений |

Для N и V это методы `computeNormalForceAt` и `computeShearForceAt`, `computeNormalForce` и `computeShearForce`, которые возвращают `{ x, N }` и `{ x, V }`. Знаки описаны на странице [Единицы и знаки](/ru/solver/conventions#signs-of-the-results).

## Реакции {#reactions}

`getReactions` выдаёт по одной реакции на каждую степень свободы, закреплённую опорой: `dofs` перечисляет их в том порядке, в каком они были переданы в `createNode`, а `values` содержит реакции в том же порядке. Если реакций несколько, `values` — **матрица mathjs**, если одна — обычный массив, поэтому небольшая вспомогательная функция в любом случае превращает его в массив:

```ts
/** Превращает матрицу mathjs, массив или число в обычный массив. */
const list = (v: unknown): number[] =>
  typeof v === 'number'
    ? [v]
    : Array.isArray(v)
      ? v
      : (v as { toArray(): number[] }).toArray()

A.getReactions(lc).dofs // [0, 2]: DofID.Dx, DofID.Dz
list(A.getReactions(lc).values) // [0, -13333.3]
list(B.getReactions(lc).values) // [-6666.7]
```

Чтобы взять конкретную реакцию независимо от порядка, найдите её степень свободы: `list(values)[dofs.indexOf(DofID.Dz)]`, как в [примере с неразрезной балкой](/ru/solver/beams#a-continuous-beam).

Реакция — это сила, с которой опора действует на конструкцию: −13 333 Н вдоль z — это 13,3 кН, направленные вверх, $P\,b/L = 20 \cdot 4/6$. В узле с [повёрнутыми осями](/ru/solver/nodes-supports#inclined-supports) реакции выдаются в этих осях; `getReactions(lc, true)` переводит их в глобальные и возвращает все три степени свободы, с 0 там, где ничего не закреплено. Узел без опоры выдаёт `{ dofs: [], values: [] }`.

## Перемещения {#displacements}

`getUnknowns` читает любые степени свободы узла, закреплённые или нет:

```ts
list(A.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])) // [0, 0, -0.0108924]
```

Узел A поворачивается по часовой стрелке на 0,010892 рад, $P\,b\,(L^2 - b^2)/6EIL$. Если запросить одну степень свободы, `getUnknowns` возвращает простое число, хотя TypeScript объявляет матрицу: `list` справляется и с этим.

## Внутренние усилия вдоль стержня {#internal-forces-along-a-member}

Методы `…At` выдают значение в точке на расстоянии `x` метров от первого узла стержня:

```ts
beam.computeShearForceAt(lc, 1) // 13333.3 N
beam.computeShearForceAt(lc, 2) // -6666.7 N: в точке приложения силы — значение за ней
beam.computeBendingMomentAt(lc, 2) // 26666.7 N·m: R_A · 2
```

Там, где сосредоточенная сила даёт скачок, в самой точке её приложения выдаётся значение за силой, с дальней от первого узла стороны. Чтобы получить значение перед силой, запросите точку чуть ближе к первому узлу, например `x - 1e-9`.

Методы, возвращающие массивы, берут n + 1 равноотстоящих точек стержня, включая концы:

```ts
beam.computeBendingMoment(lc, 3)
// { x: [0, 2, 4, 6], M: [0, 26666.7, 13333.3, 0] }, с точностью до округления
```

Ожидайте погрешностей округления вроде `-3.6e-12` там, где точное значение равно 0: перед выводом форматируйте числа через `toFixed`. Наибольшее значение вдоль стержня можно найти как максимум по частой сетке точек, например `computeBendingMoment(lc, 500)`, как в [примере с неразрезной балкой](/ru/solver/beams#a-continuous-beam). При распределённых нагрузках M — многочлен, поэтому его точный экстремум находится там, где V меняет знак; [@edubeam/plot](/ru/plot/model#reading-values-yourself) находит его точно.

## Деформированная схема {#deflected-shape}

```ts
beam.computeLocalDefl(lc, 3)
// { u: [0, 0, 0, 0], w: [0, 0.0174279, 0.0152494, 0] }
```

`computeLocalDefl` выдаёт перемещения вдоль и поперёк стержня, `u` и `w`, в его локальных осях; `computeGlobalDefl` — те же точки в глобальных осях x и z. Прогиб под силой, 17,43 мм, равен $P\,a^2 b^2/3EIL$. Форма между узлами точная, а не интерполированная по значениям на концах. Как её нарисовать, описано на странице [Отрисовка результатов](/ru/solver/drawing).

## Концевые усилия {#end-forces}

```ts
beam.computeEndForces(lc).toArray()
// [0, -13333.3, 0, 0, -6666.7, 0]: X12, Z12, M12, X21, Z21, M21
```

Это силы, с которыми два узла действуют на стержень, в его локальных осях: те же числа, что в таблице *Результаты по элементам* приложения, а их смысл объяснён в разделе [Концевые усилия](/ru/elements/conventions#end-forces-element-results-table).

## Результаты как числа для проверки {#results-as-numbers-to-check}

Каждое значение выше совпадает со своей аналитической формулой. На странице [Проверка результатов вручную](/ru/guide/verification) разобрано ещё много учебных случаев, рассчитанных тем же решателем прямо в вашем браузере.
