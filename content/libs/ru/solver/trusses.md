---
title: Фермы
description: "Ферма Уоррена с шарнирными узлами в @edubeam/fem, проверка всех усилий методом сечений и цикл, который строит фермы с любым числом панелей."
order: 14
source: site
---

# Фермы {#trusses}

Ферма — это стержни, шарнирно соединённые по концам и нагруженные в узлах, поэтому каждый стержень воспринимает только продольную силу. В этом примере ферма Уоррена строится по двум спискам, все усилия в стержнях проверяются вручную, а затем в цикле генерируются фермы любого размера.

::model-figure{caption="Ферма Уоррена: пролёт 9 м, высота 1,8 м, по 8 кН в каждом верхнем узле"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members:
  - { nodes: [A, B], hinges: [true, true] }
  - { nodes: [B, C], hinges: [true, true] }
  - { nodes: [C, D], hinges: [true, true] }
  - { nodes: [E, F], hinges: [true, true] }
  - { nodes: [F, G], hinges: [true, true] }
  - { nodes: [A, E], hinges: [true, true] }
  - { nodes: [E, B], hinges: [true, true] }
  - { nodes: [B, F], hinges: [true, true] }
  - { nodes: [F, C], hinges: [true, true] }
  - { nodes: [C, G], hinges: [true, true] }
  - { nodes: [G, D], hinges: [true, true] }
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: [N, w]
show: [nodeLabels]
---
::

```ts [truss.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })

// Ферма Уоррена: пролёт 9 m, высота 1.8 m, нижний пояс A-B-C-D, верхний пояс E-F-G
const nodes: [string, number, number, DofID[]][] = [
  ['A', 0, 0, [DofID.Dx, DofID.Dz]],
  ['B', 3, 0, []],
  ['C', 6, 0, []],
  ['D', 9, 0, [DofID.Dz]],
  ['E', 1.5, -1.8, []],
  ['F', 4.5, -1.8, []],
  ['G', 7.5, -1.8, []],
]
for (const [label, x, z, support] of nodes) {
  domain.createNode(label, [x, 0, z], support)
}

// Каждая метка называет два узла стержня. Шарниры на обоих концах: только продольная сила.
const bars = ['AB', 'BC', 'CD', 'EF', 'FG', 'AE', 'EB', 'BF', 'FC', 'CG', 'GD']
const members = bars.map((bar) =>
  domain.createBeam2D(bar, [bar[0], bar[1]], 1, 1, [true, true])
)

const lc = solver.loadCases[0]
for (const top of ['E', 'F', 'G']) {
  lc.createNodalLoad(top, { [DofID.Dz]: 8e3 }) // 8 kN вниз
}
solver.solve()

for (const bar of members) {
  const n = bar.computeNormalForceAt(lc, 0) / 1e3
  console.log(bar.label, n.toFixed(2), n > 0 ? 'tension' : 'compression')
}
```

```text [Вывод]
AB 10.00 tension
BC 16.67 tension
CD 10.00 tension
EF -13.33 compression
FG -13.33 compression
AE -15.62 compression
EB 5.21 tension
BF -5.21 compression
FC -5.21 compression
CG 5.21 tension
GD -15.62 compression
```

Продольная сила в стержне постоянна по длине, поэтому достаточно прочитать её при `x = 0`. Двухбуквенные метки заодно задают пары узлов: `bar[0]` и `bar[1]`.

## Ручная проверка {#check-it-by-hand}

Каждая опора воспринимает половину от 24 кН, т. е. 12 кН. Рассеките ферму и запишите уравнение моментов относительно узла напротив рассечённого стержня, как в [методе сечений](/ru/tutorials/truss):

| Стержень | Как найти | Усилие |
| --- | --- | --- |
| BC, нижний пояс | моменты относительно F: $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$ | 16,67 кН, растяжение |
| EF, верхний пояс | моменты относительно B: $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$ | 13,33 кН, сжатие |
| AE, опорный раскос | вырезание узла A: $12 \cdot \sqrt{1{,}5^2 + 1{,}8^2}/1{,}8$ | 15,62 кН, сжатие |
| EB, раскос | поперечная сила в панели, $12 - 8 = 4$ кН: $4 \cdot 2{,}343/1{,}8$ | 5,21 кН, растяжение |

Сечение стержней не влияет на усилия в статически определимой ферме; от него зависят только перемещения узлов. Рисунок выше построен с другим сечением, из приложения EduBeam, и даёт те же усилия.

## Любое число панелей {#any-number-of-panels}

Чтобы генерировать фермы — для задач или параметрического исследования, — стройте узлы и стержни в цикле, панель за панелью. При `panels = 3` получается ферма выше, и программа выводит те же усилия; измените `panels`, `w` и `h`, чтобы получить другую.

```ts [warren.ts]
import { type Beam2D, DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })
const lc = solver.loadCases[0]

const panels = 3 // число панелей нижнего пояса
const w = 3 // длина панели, m
const h = 1.8 // высота, m

// Нижние узлы b0, b1, … на шарнирно-неподвижной и шарнирно-подвижной опорах; верхние узлы t0, t1, … между ними
for (let i = 0; i <= panels; i++) {
  const ends = i === 0 ? [DofID.Dx, DofID.Dz] : i === panels ? [DofID.Dz] : []
  domain.createNode(`b${i}`, [i * w, 0, 0], ends)
}
for (let i = 0; i < panels; i++) {
  domain.createNode(`t${i}`, [(i + 0.5) * w, 0, -h])
  lc.createNodalLoad(`t${i}`, { [DofID.Dz]: 8e3 })
}

const members: Beam2D[] = []
const bar = (a: string, b: string) =>
  members.push(domain.createBeam2D(`${a}-${b}`, [a, b], 1, 1, [true, true]))
for (let i = 0; i < panels; i++) {
  bar(`b${i}`, `b${i + 1}`) // нижний пояс
  bar(`b${i}`, `t${i}`) // восходящий раскос
  bar(`t${i}`, `b${i + 1}`) // нисходящий раскос
  if (i > 0) bar(`t${i - 1}`, `t${i}`) // верхний пояс
}
solver.solve()

for (const m of members) {
  console.log(m.label, (m.computeNormalForceAt(lc, 0) / 1e3).toFixed(2))
}
```

Время расчёта быстро растёт с размером модели: несколько десятков панелей — не проблема, см. [Размер модели](/ru/solver/solving#model-size). Чтобы нарисовать каждую сгенерированную ферму, с ответами или без, см. страницу [Упражнения и контрольные работы](/ru/plot/exercises) библиотеки @edubeam/plot.

## На что обратить внимание {#things-to-notice}

- **Шарниры на всех концах стержней.** Тогда каждый узел может свободно поворачиваться, и решатель выдаёт его угол поворота равным 0. Момент, приложенный к такому узлу, воспринять нечему, и [расчёт не удаётся](/ru/solver/solving#when-solving-fails).
- **Нагрузки в узлах.** Нагрузка вдоль стержня изгибала бы его: тогда это балка, а не стержень фермы, и у неё появляется эпюра моментов.

В [учебном примере с плоской фермой](/ru/tutorials/truss) ферма строится в приложении EduBeam, а на странице [Элемент фермы](/ru/elements/truss) выведена жёсткость стержня.
