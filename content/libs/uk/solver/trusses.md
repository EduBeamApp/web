---
title: Ферми
description: "Шарнірна ферма Воррена в @edubeam/fem, зусилля в кожному стрижні, перевірене методом перерізів, і цикл, що генерує ферми з будь-якою кількістю панелей."
order: 14
source: site
---

# Ферми {#trusses}

Ферма складається зі стрижнів, шарнірно з’єднаних на обох кінцях і навантажених у вузлах, тож кожен стрижень сприймає лише поздовжню силу. Цей приклад будує ферму Воррена (з трикутною решіткою) із двох списків, перевіряє зусилля в кожному стрижні вручну, а потім генерує в циклі ферми будь-якого розміру.

::model-figure{caption="Ферма Воррена: проліт 9 m, висота 1,8 m, 8 kN у кожному верхньому вузлі"}
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

// Ферма Воррена: проліт 9 m, висота 1,8 m, нижній пояс A-B-C-D, верхній пояс E-F-G
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

// Кожна позначка називає два вузли стрижня. Шарніри на обох кінцях: лише поздовжня сила.
const bars = ['AB', 'BC', 'CD', 'EF', 'FG', 'AE', 'EB', 'BF', 'FC', 'CG', 'GD']
const members = bars.map((bar) =>
  domain.createBeam2D(bar, [bar[0], bar[1]], 1, 1, [true, true])
)

const lc = solver.loadCases[0]
for (const top of ['E', 'F', 'G']) {
  lc.createNodalLoad(top, { [DofID.Dz]: 8e3 }) // 8 kN донизу
}
solver.solve()

for (const bar of members) {
  const n = bar.computeNormalForceAt(lc, 0) / 1e3
  console.log(bar.label, n.toFixed(2), n > 0 ? 'tension' : 'compression')
}
```

```text [Вивід]
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

Поздовжня сила в стрижні стала, тож досить прочитати її при `x = 0`. Двобуквені позначки водночас задають пари вузлів: `bar[0]` і `bar[1]`.

## Перевірка вручну {#check-it-by-hand}

Кожна опора сприймає половину навантаження 24 kN, тобто 12 kN. Розріжте ферму і складіть рівняння моментів відносно вузла навпроти перерізаного стрижня, як у [методі перерізів](/uk/tutorials/truss):

| Стрижень | Переріз | Зусилля |
| --- | --- | --- |
| BC, нижній пояс | моменти відносно F: $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$ | 16,67 kN, розтяг |
| EF, верхній пояс | моменти відносно B: $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$ | 13,33 kN, стиск |
| AE, опорний розкіс | вузол A: $12 \cdot \sqrt{1{,}5^2 + 1{,}8^2}/1{,}8$ | 15,62 kN, стиск |
| EB, розкіс | поперечна сила в панелі, $12 - 8 = 4$ kN: $4 \cdot 2{,}343/1{,}8$ | 5,21 kN, розтяг |

Переріз не змінює зусиль у стрижнях статично визначуваної ферми; від нього залежить лише те, наскільки зміщуються вузли. Рисунок вище використовує інший переріз, той, що в застосунку EduBeam, і дає ті самі зусилля.

## Будь-яка кількість панелей {#any-number-of-panels}

Щоб генерувати ферми, наприклад для вправ або параметричного дослідження, будуйте вузли й стрижні в циклі, панель за панеллю. З `panels = 3` це та сама ферма, що й вище, і програма виведе ті самі зусилля; змініть `panels`, `w` і `h`, щоб отримати іншу.

```ts [warren.ts]
import { type Beam2D, DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })
const lc = solver.loadCases[0]

const panels = 3 // кількість панелей нижнього пояса
const w = 3 // ширина панелі, m
const h = 1.8 // висота ферми, m

// Нижні вузли b0, b1, … на шарнірно-нерухомій і шарнірно-рухомій опорах; верхні вузли t0, t1, … між ними
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
  bar(`b${i}`, `b${i + 1}`) // нижній пояс
  bar(`b${i}`, `t${i}`) // висхідний розкіс
  bar(`t${i}`, `b${i + 1}`) // низхідний розкіс
  if (i > 0) bar(`t${i - 1}`, `t${i}`) // верхній пояс
}
solver.solve()

for (const m of members) {
  console.log(m.label, (m.computeNormalForceAt(lc, 0) / 1e3).toFixed(2))
}
```

Час розрахунку швидко зростає з розміром: кілька десятків панелей — без проблем, див. [Розмір моделі](/uk/solver/solving#model-size). Як побудувати рисунок кожної згенерованої ферми, з відповідями або без них, описано на сторінці [Вправи та контрольні роботи](/uk/plot/exercises) бібліотеки @edubeam/plot.

## На що звернути увагу {#things-to-notice}

- **Шарніри на кожному кінці стрижня.** Тоді кожен вузол може вільно повертатися, і розв’язувач показує його поворот як 0. Момент, прикладений у такому вузлі, нічим не сприймається, і [розрахунок не вдасться](/uk/solver/solving#when-solving-fails).
- **Навантаження у вузлах.** Навантаження, прикладене вздовж стрижня, згинало б його: тоді це вже балка з власною епюрою моментів, а не стрижень ферми.

Покроковий приклад [Плоска ферма](/uk/tutorials/truss) будує ферму в застосунку EduBeam, а на сторінці [Елемент ферми](/uk/elements/truss) виведено жорсткість стрижня ферми.
