---
title: Стержни и шарниры
description: "Стержни Beam2D между узлами, концевые шарниры, снимающие момент, стержни фермы и матрицы жёсткости и преобразования элемента в @edubeam/fem."
order: 5
source: site
---

# Стержни и шарниры {#members-and-hinges}

Любой стержень — это `Beam2D`: прямая двухузловая балка Тимошенко в плоскости x–z, которая воспринимает продольную силу, поперечную силу и изгибающий момент. Шарниры на концах снимают в этих местах момент. Фрагменты используют `solver`, `domain` и `lc` программы вроде той, что на странице [Начало работы](/ru/solver/getting-started), с её материалом `'steel'` и сечением `'IPE200'`.

## Создание стержня {#create-a-member}

```ts
domain.createBeam2D(label, [startNode, endNode], material, crossSection, hinges)
```

| Аргумент | Тип | Смысл |
| --- | --- | --- |
| `label` | `string \| number` | Имя стержня, хранится как строка |
| `nodes` | `[label, label]` | Первый и второй узел. Локальная ось x идёт от первого ко второму: см. [Направление стержня](/ru/solver/conventions#member-direction). |
| `mat`, `cs` | `string \| number` | Метки материала и сечения |
| `hinges` | `[boolean, boolean]` | Шарнир у первого узла, у второго. Необязательный аргумент; по умолчанию `[false, false]`, жёсткие концы. |

Метод возвращает `Beam2D`: сохраните его, чтобы читать результаты. `domain.getElement(label)` находит стержень снова, но с общим типом `Element`, поэтому перед чтением результатов TypeScript потребует `as Beam2D`.

Стержни, сходящиеся в узле без шарниров, соединены жёстко: они поворачиваются вместе. Узлы, материал и сечение можно создавать в любом порядке, лишь бы к расчёту все они существовали; если чего-то не хватает, `solve()` выбрасывает `RangeError` с его именем.

## Концевые шарниры {#end-hinges}

Шарнир принадлежит концу стержня, а не узлу. Здесь стержень 2 начинается с шарнира в C, поэтому узел C передаёт с пролёта C–D на консоль A–C поперечную силу, но не момент:

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

cd.computeBendingMomentAt(lc, 0) // 0 в шарнире
cd.computeBendingMomentAt(lc, 2) // 20000 N·m: qL²/8 пролёта 4 m
ac.computeBendingMomentAt(lc, 0) // -40000 N·m: 20 kN с пролёта C–D на плече 2 m
```

::model-figure{caption="Консоль, на которую через шарнир опирается пролёт: в C момента нет"}
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

Если в шарнирном узле сходятся несколько стержней, достаточно шарниров на концах всех стержней, кроме одного. Шарниры на всех концах тоже допустимы: тогда поворот узла ничем не определяется, и решатель выдаёт его равным 0. Но момент, приложенный к такому узлу, воспринять нечему, и [расчёт не удаётся](/ru/solver/solving#when-solving-fails).

## Стержни фермы {#truss-bars}

Поставьте шарниры на оба конца, и стержень, нагруженный только в узлах, будет воспринимать одну продольную силу: это стержень фермы.

```ts
domain.createBeam2D('AE', ['A', 'E'], 'steel', 'bar', [true, true])
```

[Пример с фермой](/ru/solver/trusses) так рассчитывает целую ферму. Пример фермы в приложении EduBeam, наоборот, использует жёсткие узлы и настолько большую площадь сечения, что изгибающие моменты пренебрежимо малы по сравнению с продольными силами. Обе модели корректны и различаются только этими малыми моментами. Матрица жёсткости самого стержня выведена на странице [Элемент фермы](/ru/elements/truss) теоретического раздела.

## Матрицы элемента {#the-element-s-matrices}

Для изучения самого метода `Beam2D` выдаёт свои матрицы как матрицы [mathjs](https://mathjs.org); `.toArray()` превращает их в `number[][]`:

| Метод | Что даёт |
| --- | --- |
| `computeGeo()` | `{ l, dx, dz }`: длина и проекции, м |
| `computeLocalStiffnessMtrx().answer` | матрица жёсткости 6 × 6 в локальных осях, шарниры исключены статической конденсацией |
| `computeT()` | матрица преобразования 6 × 6 из глобальных осей в локальные |
| `computeStiffness()` | матрица жёсткости 6 × 6 в глобальных осях, $T^T K_l T$ |
| `computeShearFactor()` | $\Phi = 12EI_y/kGAL^2$ |

```ts
ac.computeStiffness().toArray() // number[][], N/m, N и N·m
```

Степени свободы упорядочены так: $u_1, w_1, \varphi_1, u_2, w_2, \varphi_2$. Эти матрицы выведены на странице [Балочный элемент](/ru/elements/beam) теоретического раздела, а их сборка показана на странице [Как EduBeam рассчитывает модель](/ru/elements/analysis).
