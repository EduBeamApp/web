---
title: Читання результатів
description: "Реакції, переміщення вузлів, внутрішні зусилля в будь-якій точці стрижня, пружна лінія й кінцеві зусилля з розрахованої моделі @edubeam/fem."
order: 10
source: site
---

# Читання результатів {#reading-results}

Після `solve()` результати читають із вузлів і стрижнів для заданого випадку навантаження. Усі приклади на цій сторінці читають одну модель: шарнірно оперту балку прольотом 6 m із перерізом IPE 200 без деформації зсуву, із силою 20 kN на відстані 2 m від A:

```ts [results.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 }) // без деформації зсуву

const A = domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
const B = domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
const lc = solver.loadCases[0]
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], true)
solver.solve()
```

::model-figure{caption="20 kN на відстані 2 m на прольоті 6 m"}
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

## Що де читати {#what-to-read-where}

| Результат | Виклик | Повертає |
| --- | --- | --- |
| Реакції | `node.getReactions(lc)` | `{ dofs, values }`: N, N·m |
| Переміщення | `node.getUnknowns(lc, dofs)` | m, rad |
| N, V або M у точці | `beam.computeBendingMomentAt(lc, x)` | число: N, N·m |
| N, V або M уздовж стрижня | `beam.computeBendingMoment(lc, n)` | `{ x, M }`, n + 1 точок |
| Пружна лінія | `beam.computeLocalDefl(lc, n)` | `{ u, w }`, n + 1 точок, m |
| Кінцеві зусилля | `beam.computeEndForces(lc)` | матриця mathjs із 6 значень |

Для N і V є методи `computeNormalForceAt` і `computeShearForceAt`, `computeNormalForce` і `computeShearForce`, які повертають `{ x, N }` і `{ x, V }`. Правила знаків наведено на сторінці [Одиниці та правила знаків](/uk/solver/conventions#signs-of-the-results).

## Реакції {#reactions}

`getReactions` повертає по одній реакції на кожен ступінь вільності, закріплений опорою: `dofs` їх перелічує в тому порядку, у якому їх передано в `createNode`, а `values` містить реакції в тому самому порядку. `values` — це **матриця mathjs**, коли реакцій кілька, і звичайний масив, коли реакція одна, тож невелика допоміжна функція в будь-якому разі перетворить її на масив:

```ts
/** Перетворює матрицю mathjs, масив або число на звичайний масив. */
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

Щоб вибрати одну реакцію незалежно від порядку, знайдіть її ступінь вільності: `list(values)[dofs.indexOf(DofID.Dz)]`, як у [прикладі з нерозрізною балкою](/uk/solver/beams#a-continuous-beam).

Реакція — це сила, якою опора діє на конструкцію: −13 333 N уздовж z означає 13,3 kN, спрямовані вгору, $P\,b/L = 20 \cdot 4/6$. У вузлі з [повернутими осями](/uk/solver/nodes-supports#inclined-supports) реакції подаються в цих осях; `getReactions(lc, true)` перетворює їх на глобальні й повертає всі три ступені вільності, з 0 там, де нічого не закріплено. Вузол без опори повертає `{ dofs: [], values: [] }`.

## Переміщення {#displacements}

`getUnknowns` читає будь-які ступені вільності вузла, закріплені чи ні:

```ts
list(A.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])) // [0, 0, -0.0108924]
```

A повертається за годинниковою стрілкою на 0,010892 rad, $P\,b\,(L^2 - b^2)/6EIL$. Якщо запитати один ступінь вільності, `getUnknowns` поверне звичайне число, хоча TypeScript оголошує матрицю: `list` впорається і з цим.

## Внутрішні зусилля вздовж стрижня {#internal-forces-along-a-member}

Методи `…At` повертають значення на відстані `x` метрів від першого вузла стрижня:

```ts
beam.computeShearForceAt(lc, 1) // 13333.3 N
beam.computeShearForceAt(lc, 2) // -6666.7 N: у місці сили — значення за нею
beam.computeBendingMomentAt(lc, 2) // 26666.7 N·m: R_A · 2
```

Там, де зосереджена сила дає стрибок, значення точно в місці сили — це значення за нею, з боку більших `x`. Щоб прочитати значення перед силою, запитайте точку трохи ближче до початку, наприклад `x - 1e-9`.

Методи, що повертають масиви, обчислюють значення в n + 1 рівновіддалених точках стрижня, включно з кінцями:

```ts
beam.computeBendingMoment(lc, 3)
// { x: [0, 2, 4, 6], M: [0, 26666.7, 13333.3, 0] }, з точністю до округлення
```

Очікуйте похибок округлення на зразок `-3.6e-12` там, де точне значення дорівнює 0: перед виведенням форматуйте числа за допомогою `toFixed`. Найбільше значення вздовж стрижня — це найбільше з густої вибірки, наприклад `computeBendingMoment(lc, 500)`, як у [прикладі з нерозрізною балкою](/uk/solver/beams#a-continuous-beam). Під розподіленим навантаженням M є поліномом, тож його точний екстремум лежить там, де V перетинає нуль; [@edubeam/plot](/uk/plot/model#reading-values-yourself) знаходить його точно.

## Пружна лінія {#deflected-shape}

```ts
beam.computeLocalDefl(lc, 3)
// { u: [0, 0, 0, 0], w: [0, 0.0174279, 0.0152494, 0] }
```

`computeLocalDefl` повертає переміщення вздовж і поперек стрижня, `u` і `w`, у його локальних осях; `computeGlobalDefl` — ті самі точки в глобальних x і z. Прогин під силою, 17,43 mm, дорівнює $P\,a^2 b^2/3EIL$. Пружна лінія між вузлами точна, а не інтерпольована з кінцевих значень. Як її намалювати, див. на сторінці [Побудова епюр](/uk/solver/drawing).

## Кінцеві зусилля {#end-forces}

```ts
beam.computeEndForces(lc).toArray()
// [0, -13333.3, 0, 0, -6666.7, 0]: X12, Z12, M12, X21, Z21, M21
```

Сили, якими два вузли діють на стрижень, у його локальних осях: це числа з таблиці застосунку *Результати по елементах*, пояснені в розділі [Кінцеві зусилля](/uk/elements/conventions#end-forces-element-results-table).

## Результати як числа для перевірки {#results-as-numbers-to-check}

Кожне значення вище збігається зі своєю аналітичною формулою. На сторінці [Перевірка результатів вручну](/uk/guide/verification) розібрано багато інших випадків із підручників, розрахованих цим самим розв’язувачем у вашому браузері.
