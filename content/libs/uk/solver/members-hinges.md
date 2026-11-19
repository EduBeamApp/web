---
title: Стрижні та шарніри
description: "Стрижні Beam2D між вузлами, звільнення моментів кінцевими шарнірами, стрижні ферм і матриці жорсткості та перетворення елемента в @edubeam/fem."
order: 5
source: site
---

# Стрижні та шарніри {#members-and-hinges}

Кожен стрижень — це `Beam2D`: прямий двовузловий балковий елемент Тимошенка в площині x–z, що сприймає поздовжню силу, поперечну силу і згинальний момент. Шарнір на кінці стрижня звільняє момент у цьому місці. Фрагменти коду використовують `solver`, `domain` і `lc` програми на зразок тієї, що на сторінці [Початок роботи](/uk/solver/getting-started), з її матеріалом `'steel'` і перерізом `'IPE200'`.

## Створення стрижня {#create-a-member}

```ts
domain.createBeam2D(label, [startNode, endNode], material, crossSection, hinges)
```

| Аргумент | Тип | Зміст |
| --- | --- | --- |
| `label` | `string \| number` | Назва стрижня, зберігається як рядок |
| `nodes` | `[label, label]` | Перший і другий вузол. Локальна вісь x іде від першого до другого: див. [Напрям стрижня](/uk/solver/conventions#member-direction). |
| `mat`, `cs` | `string \| number` | Позначки матеріалу й поперечного перерізу |
| `hinges` | `[boolean, boolean]` | Шарнір у першому вузлі, у другому. Необов’язковий; типово `[false, false]`, жорсткі кінці. |

Метод повертає `Beam2D`: збережіть його, щоб читати результати. `domain.getElement(label)` знайде його знову, але з загальним типом `Element`, тож перед читанням результатів TypeScript вимагатиме `as Beam2D`.

Стрижні, що сходяться у вузлі без шарнірів, з’єднані жорстко: вони повертаються разом. Вузли, матеріал і переріз можна створювати в будь-якому порядку, головне, щоб на момент розрахунку всі вони існували; якщо чогось бракує, `solve()` викидає `RangeError` із назвою відсутнього об’єкта.

## Кінцеві шарніри {#end-hinges}

Шарнір належить кінцю стрижня, а не вузлу. Тут стрижень 2 починається шарніром у C, тож C передає з прольоту C–D на консоль A–C поперечну силу, але не момент:

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

cd.computeBendingMomentAt(lc, 0) // 0 у шарнірі
cd.computeBendingMomentAt(lc, 2) // 20000 N·m: qL²/8 прольоту 4 m
ac.computeBendingMomentAt(lc, 0) // -40000 N·m: 20 kN із C–D на відстані 2 m
```

::model-figure{caption="Консоль, що несе шарнірно приєднаний проліт: у C момент нульовий"}
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

Коли в шарнірному вузлі сходиться кілька стрижнів, досить поставити шарнір на кінці кожного з них, крім одного. Шарніри на всіх кінцях теж працюють: тоді вузол ніщо не повертає, і розв’язувач показує його поворот як 0. Але момент, прикладений до такого вузла, нічим не сприймається, і [розрахунок не вдасться](/uk/solver/solving#when-solving-fails).

## Стрижні ферм {#truss-bars}

Поставте шарніри на обох кінцях, і стрижень сприйматиме лише поздовжню силу, якщо навантаження прикладено тільки у вузлах: це стрижень ферми.

```ts
domain.createBeam2D('AE', ['A', 'E'], 'steel', 'bar', [true, true])
```

У [прикладі з фермою](/uk/solver/trusses) так розраховано цілу ферму. Приклад ферми в застосунку EduBeam натомість використовує жорсткі вузли з настільки великою площею, що згинальні моменти поряд із поздовжніми силами незначні. Обидві моделі правильні; вони відрізняються лише цими малими моментами. Власну матрицю жорсткості стрижня ферми виведено на сторінці [Елемент ферми](/uk/elements/truss) теоретичного посібника.

## Матриці елемента {#the-element-s-matrices}

Для викладання самого методу `Beam2D` видає свої матриці як матриці [mathjs](https://mathjs.org); `.toArray()` перетворює їх на `number[][]`:

| Метод | Що повертає |
| --- | --- |
| `computeGeo()` | `{ l, dx, dz }`: довжина та проєкції, m |
| `computeLocalStiffnessMtrx().answer` | матриця жорсткості 6 × 6 у локальних осях, зі сконденсованими шарнірами |
| `computeT()` | матриця перетворення 6 × 6 з глобальних осей у локальні |
| `computeStiffness()` | матриця жорсткості 6 × 6 у глобальних осях, $T^T K_l T$ |
| `computeShearFactor()` | $\Phi = 12EI_y/kGAL^2$ |

```ts
ac.computeStiffness().toArray() // number[][], N/m, N і N·m
```

Ступені вільності впорядковано як $u_1, w_1, \varphi_1, u_2, w_2, \varphi_2$. На сторінці [Балковий елемент](/uk/elements/beam) теоретичного посібника ці матриці виведено, а сторінка [Як EduBeam розраховує модель](/uk/elements/analysis) показує, як їх збирають.
