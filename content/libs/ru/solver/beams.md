---
title: Балки
description: "Готовые программы @edubeam/fem для консоли и двухпролётной неразрезной балки, с их выводом; каждая проверена по формуле из учебника."
order: 12
group: Примеры программ
source: site
---

# Балки {#beams}

Две готовые программы, которые можно копировать и менять. Обе используют сечение без деформаций сдвига (`k: 1e32`), поэтому их числа в точности совпадают с формулами Эйлера — Бернулли. Запускайте их командой `node cantilever.ts` (Node 22.18 и новее) в папке, подготовленной, как описано в разделе [Установка](/ru/solver/getting-started#install).

## Консоль {#a-cantilever}

Длина 4 м, заделка в A, сила 18 кН вниз на свободном конце:

```ts [cantilever.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // заделка
const tip = domain.createNode('B', [4, 0, 0]) // свободный
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
lc.createNodalLoad('B', { [DofID.Dz]: 18e3 }) // 18 kN вниз на свободном конце
solver.solve()

console.log(beam.computeBendingMomentAt(lc, 0)) // N·m в заделке
console.log(tip.getUnknowns(lc, [DofID.Dz])) // m, прогиб свободного конца
```

```text [Вывод]
-72000
0.09411072715241528
```

$M_A = -FL = -72$ кН·м, растянуты верхние волокна, а прогиб свободного конца равен $FL^3/3EI = 94{,}11$ мм при $EI = 4{,}0803$ МН·м². Эта же консоль — один из примеров приложения EduBeam.

## Неразрезная балка {#a-continuous-beam}

Два пролёта по 5 м на трёх опорах, 10 кН/м на обоих. Программа находит реакции, момент над средней опорой и наибольший пролётный момент:

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

// getReactions выдаёт матрицу mathjs или массив: приводим к массиву
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

for (const label of ['A', 'B', 'C']) {
  const { dofs, values } = domain.getNode(label).getReactions(lc)
  const rz = list(values)[dofs.indexOf(DofID.Dz)]
  console.log(`R${label} = ${(-rz / 1e3).toFixed(2)} kN up`)
}
const mB = span1.computeBendingMomentAt(lc, 5)
console.log(`MB = ${(mB / 1e3).toFixed(2)} kNm`)

// Наибольший положительный момент в пролёте 1 по 501 точке
const { x, M } = span1.computeBendingMoment(lc, 500)
const i = M.indexOf(Math.max(...M))
console.log(`max M = ${(M[i] / 1e3).toFixed(2)} kNm at x = ${x[i]} m`)
```

```text [Вывод]
RA = 18.75 kN up
RB = 62.50 kN up
RC = 18.75 kN up
MB = -31.25 kNm
max M = 17.58 kNm at x = 1.87 m
```

Значения из учебника для двух равных пролётов: $R_A = R_C = 0{,}375\,qL$, $R_B = 1{,}25\,qL$, $M_B = -qL^2/8$, а наибольший пролётный момент равен $R_A^2/2q = 17{,}58$ кН·м при $x = R_A/q = 1{,}875$ м. Выборка находит его в точке 1,87 м, с отклонением не более 0,0002 кН·м от точного значения.

::model-figure{caption="Два пролёта по 5 м под нагрузкой 10 кН/м"}
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

На рисунке используется сечение из примеров приложения, а не IPE 200. Если сечение во всех пролётах одинаковое, внутренние усилия неразрезной балки не зависят от её жёсткости, поэтому на эпюрах те же числа; отличается только прогиб.

## Измените пример {#change-it}

- **Разные пролёты или нагрузки:** измените координаты C или список нагрузок. Нагрузка только на одном пролёте даёт знакомую схему невыгодного расположения нагрузки.
- **Три пролёта:** добавьте узел D и стержень `['C', 'D']`.
- **Заделка на конце:** задайте для A `[DofID.Dx, DofID.Dz, DofID.Ry]`.
- **Реальная деформация сдвига:** `k: 5 / 6` для прямоугольника или коэффициент сдвига вашего сечения.
- **Рисунок:** передайте решатель в [@edubeam/plot](/ru/solver/drawing).

В [учебном примере с неразрезной балкой](/ru/tutorials/continuous-beam) такая балка строится в приложении EduBeam, а на странице [Проверка результатов вручную](/ru/guide/verification) есть ещё учебные случаи с формулами.
