---
title: Балки
description: "Повні програми @edubeam/fem для консолі та двопрольотної нерозрізної балки, з їхнім виводом і перевіркою за формулами з підручника."
order: 12
group: Приклади програм
source: site
---

# Балки {#beams}

Дві повні програми, які можна скопіювати й змінювати. Обидві використовують переріз без деформації зсуву (`k: 1e32`), тож їхні числа точно відповідають формулам теорії Ейлера–Бернуллі. Запускайте їх командою `node cantilever.ts` (Node 22.18 або новіший) у теці, підготовленій, як описано в розділі [Встановлення](/uk/solver/getting-started#install).

## Консоль {#a-cantilever}

Довжина 4 m, защемлення в A, сила 18 kN донизу на вільному кінці:

```ts [cantilever.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // защемлення
const tip = domain.createNode('B', [4, 0, 0]) // вільний
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
lc.createNodalLoad('B', { [DofID.Dz]: 18e3 }) // 18 kN донизу на вільному кінці
solver.solve()

console.log(beam.computeBendingMomentAt(lc, 0)) // N·m у защемленні
console.log(tip.getUnknowns(lc, [DofID.Dz])) // m, прогин вільного кінця
```

```text [Вивід]
-72000
0.09411072715241528
```

$M_A = -FL = -72$ kNm, від’ємний (розтягнуті верхні волокна), а прогин вільного кінця дорівнює $FL^3/3EI = 94{,}11$ mm, де $EI = 4{,}0803$ MNm². Така сама консоль є серед прикладів застосунку EduBeam.

## Нерозрізна балка {#a-continuous-beam}

Два прольоти по 5 m на трьох опорах, 10 kN/m на обох. Програма знаходить реакції, момент над середньою опорою і найбільший прольотний момент:

```ts [continuous.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [5, 0, 0], [DofID.Dz])
domain.createNode('C', [10, 0, 0], [DofID.Dz])
const span1 = domain.createBeam2D(1, ['A', 'B'], 1, 1)
domain.createBeam2D(2, ['B', 'C'], 1, 1)

const lc = solver.loadCases[0]
for (const span of [1, 2]) {
  lc.createBeamElementUniformEdgeLoad(span, [0, 10e3], true)
}
solver.solve()

// getReactions повертає матрицю mathjs або масив: перетворимо на масив
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

for (const label of ['A', 'B', 'C']) {
  const { dofs, values } = domain.getNode(label).getReactions(lc)
  const rz = list(values)[dofs.indexOf(DofID.Dz)]
  console.log(`R${label} = ${(-rz / 1e3).toFixed(2)} kN up`)
}
const mB = span1.computeBendingMomentAt(lc, 5)
console.log(`MB = ${(mB / 1e3).toFixed(2)} kNm`)

// Найбільший додатний момент у прольоті 1 з 501 точки вздовж нього
const { x, M } = span1.computeBendingMoment(lc, 500)
const i = M.indexOf(Math.max(...M))
console.log(`max M = ${(M[i] / 1e3).toFixed(2)} kNm at x = ${x[i]} m`)
```

```text [Вивід]
RA = 18.75 kN up
RB = 62.50 kN up
RC = 18.75 kN up
MB = -31.25 kNm
max M = 17.58 kNm at x = 1.87 m
```

Значення з підручника для двох однакових прольотів: $R_A = R_C = 0{,}375\,qL$, $R_B = 1{,}25\,qL$, $M_B = -qL^2/8$, а найбільший прольотний момент $R_A^2/2q = 17{,}58$ kNm при $x = R_A/q = 1{,}875$ m. Вибірка знаходить його в точці сітки 1,87 m, з відхиленням від точного значення не більше 0,0002 kNm.

::model-figure{caption="Два прольоти по 5 m під навантаженням 10 kN/m"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels]
---
::

На рисунку використано переріз із прикладів застосунку, а не IPE 200. Якщо переріз по всій довжині однаковий, внутрішні зусилля нерозрізної балки не залежать від її жорсткості, тож епюри мають ті самі числа; відрізняється лише прогин.

## Що можна змінити {#change-it}

- **Різні прольоти чи навантаження:** змініть координати C або перелік навантажень. Навантаживши лише один проліт, отримаєте знайомий випадок невигідного розташування навантаження.
- **Три прольоти:** додайте вузол D і стрижень `['C', 'D']`.
- **Защемлений кінець:** задайте для A `[DofID.Dx, DofID.Dz, DofID.Ry]`.
- **Справжня деформація зсуву:** `k: 5 / 6` для прямокутника або коефіцієнт зсуву вашого перерізу.
- **Рисунок:** передайте розв’язувач бібліотеці [@edubeam/plot](/uk/solver/drawing).

У покроковому прикладі [Нерозрізна балка й осідання опори](/uk/tutorials/continuous-beam) таку балку будують у застосунку EduBeam, а на сторінці [Перевірка результатів вручну](/uk/guide/verification) є інші випадки з підручників разом із формулами.
