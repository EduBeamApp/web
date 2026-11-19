---
title: Случаи нагружения
description: "Расчёт нескольких случаев нагружения одной модели @edubeam/fem за один раз и суперпозиция их результатов в сочетания нагрузок и огибающие."
order: 8
source: site
---

# Случаи нагружения {#load-cases}

Случай нагружения — это набор нагрузок, которые рассчитываются вместе. Решатель создаётся с одним случаем; добавьте ещё, и один вызов `solve()` рассчитает их все с одной матрицей жёсткости. Расчёт линейный, поэтому результаты разных случаев можно умножать на коэффициенты и складывать: это и есть сочетание нагрузок.

## Добавление случая нагружения {#add-a-load-case}

```ts [load-cases.ts]
import { DofID, LinearStaticSolver, LoadCase } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const dead = solver.loadCases[0] // тот, с которым создаётся каждый решатель
const live = new LoadCase('live', domain)
solver.loadCases.push(live)

dead.createBeamElementUniformEdgeLoad(1, [0, 10e3], true) // 10 kN/m
live.createBeamConcentratedLoad(1, [0, 20e3, 0, 3], true) // 20 kN в середине пролёта
solver.solve() // рассчитывает все случаи нагружения

console.log(beam.computeBendingMomentAt(dead, 3)) // qL²/8
console.log(beam.computeBendingMomentAt(live, 3)) // PL/4
```

```text [Вывод]
45000
30000
```

Каждый метод, возвращающий результаты, принимает случай нагружения, из которого их нужно прочитать. Первый случай имеет метку `'DefaultLC'`; метки — это только имена, а решатель различает случаи по самим объектам.

## Сочетания нагрузок {#combine-them}

Умножьте результат каждого случая на его коэффициент и сложите. Для предельного состояния по несущей способности по Еврокоду, $1{,}35\,G + 1{,}5\,Q$, в середине пролёта:

```ts
1.35 * beam.computeBendingMomentAt(dead, 3) +
  1.5 * beam.computeBendingMomentAt(live, 3) // 105750 N·m
```

То же справедливо для реакций, перемещений и любого другого результата. Вдоль всего стержня сочетайте результаты точка за точкой: массивы `computeBendingMoment(lc, n)` используют одни и те же `x` для каждого случая.

```ts
const n = 60
const g = beam.computeBendingMoment(dead, n).M
const q = beam.computeBendingMoment(live, n).M
const uls = g.map((m, i) => 1.35 * m + 1.5 * q[i])
Math.max(...uls) // 105750 N·m, при x = 3
```

Огибающая — наибольшие и наименьшие значения по нескольким сочетаниям — это `Math.max` и `Math.min` по таким массивам, точка за точкой. Для подвижной нагрузки вместо этого выполните расчёт для каждого положения нагрузки: так делает [пример с линией влияния](/ru/solver/scripts#an-influence-line-as-csv).

## В приложении EduBeam {#in-the-edubeam-app}

Приложение рассчитывает один случай нагружения за раз, так что в сочетаниях нагрузок библиотека даёт больше, чем приложение. Модель с несколькими случаями всё равно можно [отрисовать](/ru/solver/drawing) по отдельным случаям: `StructurePlot` из @edubeam/plot принимает свойство `loadCase` — индекс в массиве `solver.loadCases`.
