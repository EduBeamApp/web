---
title: Випадки навантаження
description: "Розраховуйте кілька випадків навантаження моделі @edubeam/fem одночасно і складайте результати в комбінації навантажень та обвідні епюри."
order: 8
source: site
---

# Випадки навантаження {#load-cases}

Випадок навантаження — це набір навантажень, які розраховують разом. Новий розв’язувач має один випадок; додайте інші, і один виклик `solve()` розв’яже їх усі з однією матрицею жорсткості. Розрахунок лінійний, тож результати різних випадків можна множити на коефіцієнти й додавати: саме це і є комбінація навантажень.

## Додавання випадку навантаження {#add-a-load-case}

```ts [load-cases.ts]
import { DofID, LinearStaticSolver, LoadCase } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const dead = solver.loadCases[0] // той, що є в кожному новому розв’язувачі
const live = new LoadCase('live', domain)
solver.loadCases.push(live)

dead.createBeamElementUniformEdgeLoad(1, [0, 10e3], true) // 10 kN/m
live.createBeamConcentratedLoad(1, [0, 20e3, 0, 3], true) // 20 kN посередині прольоту
solver.solve() // розв’язує всі випадки навантаження

console.log(beam.computeBendingMomentAt(dead, 3)) // qL²/8
console.log(beam.computeBendingMomentAt(live, 3)) // PL/4
```

```text [Вивід]
45000
30000
```

Кожен метод для читання результатів приймає випадок навантаження, з якого має читати. Перший випадок має позначку `'DefaultLC'`; позначки — лише назви, а розв’язувач розрізняє випадки за самим об’єктом.

## Комбінування {#combine-them}

Помножте результат кожного випадку на його коефіцієнт і додайте. Для граничного стану несучої здатності за Єврокодом, $1{,}35\,G + 1{,}5\,Q$, посередині прольоту:

```ts
1.35 * beam.computeBendingMomentAt(dead, 3) +
  1.5 * beam.computeBendingMomentAt(live, 3) // 105750 N·m
```

Те саме стосується реакцій, переміщень і всіх інших результатів. Уздовж усього стрижня комбінуйте точка за точкою: масиви з `computeBendingMoment(lc, n)` використовують ті самі `x` для кожного випадку.

```ts
const n = 60
const g = beam.computeBendingMoment(dead, n).M
const q = beam.computeBendingMoment(live, n).M
const uls = g.map((m, i) => 1.35 * m + 1.5 * q[i])
Math.max(...uls) // 105750 N·m, при x = 3
```

Обвідна епюра, тобто найбільше й найменше значення з кількох комбінацій, — це `Math.max` і `Math.min` по таких масивах, точка за точкою. Для рухомого навантаження натомість розрахуйте модель один раз для кожного положення навантаження: так робить [приклад із лінією впливу](/uk/solver/scripts#an-influence-line-as-csv).

## У застосунку EduBeam {#in-the-edubeam-app}

Застосунок розраховує випадки навантаження по одному, тож комбінації — це те, у чому бібліотека дає більше. Модель із кількома випадками все одно можна [зобразити](/uk/solver/drawing) окремо для кожного випадку: `StructurePlot` з @edubeam/plot приймає `loadCase` — індекс у `solver.loadCases`.
