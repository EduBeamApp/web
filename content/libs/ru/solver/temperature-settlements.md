---
title: Температура и осадки опор
description: "Изменение температуры и температурный перепад в стержнях @edubeam/fem и заданные перемещения опор, с проверенными примерами."
order: 7
source: site
---

# Температура и осадки опор {#temperature-and-settlements}

Две нагрузки, которые не сводятся к силам: стержень, который стремится изменить свою длину или кривизну, и опора, которая смещается. Обе вызывают внутренние усилия только там, где конструкция этому препятствует, поэтому хорошо подходят для задач на статически неопределимые системы. Теория обеих изложена в разделе [Нагрузки на элементы](/ru/elements/beam#element-loads) теоретической части.

## Температура {#temperature}

```ts
lc.createBeamTemperatureLoad(member, [dTc, dTb, dTt])
```

| Значение | Смысл | Действие на свободный стержень |
| --- | --- | --- |
| `dTc` | изменение в центре тяжести, К | удлиняется на $\alpha\,\Delta T_c\,L$ |
| `dTb` | изменение на нижних волокнах (со стороны локальной оси +z), К | вместе с `dTt` искривляется: $\kappa = \alpha\,(\Delta T_b - \Delta T_t)/h$ |
| `dTt` | изменение на верхних волокнах, К | |

Изгибает стержень только разность `dTb - dTt`, поэтому `[30, 20, 0]` и `[30, 10, -10]` — одна и та же нагрузка. Нужны `alpha` материала и `h` сечения; без `h` моменты будут `NaN`.

Балка с двумя заделками не может ни удлиниться, ни искривиться, поэтому вместо этого она сжимается и изгибается: $N = -EA\,\alpha\,\Delta T_c$ и $M = -EI\,\alpha\,(\Delta T_b - \Delta T_t)/h$.

```ts [temperature.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial(1, { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [6, 0, 0], fixed)
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

// Центр тяжести теплее на 30 K, низ теплее верха на 20 K
lc.createBeamTemperatureLoad(1, [30, 20, 0])
solver.solve()

beam.computeNormalForceAt(lc, 3) // -215460 N: EA · 12e-6 · 30
beam.computeBendingMomentAt(lc, 3) // -4896.4 N·m: EI · 12e-6 · 20 / 0.2
```

Для IPE 200 $EA = 598{,}5$ МН и $EI = 4{,}0803$ МН·м². Свободная балка с более тёплыми нижними волокнами загибается концами вверх, поэтому заделки изгибают её в обратную сторону: момент отрицательный, растянуты верхние волокна.

::model-figure{caption="Балка с двумя заделками: в центре тяжести теплее на 30 К, внизу на 20 К теплее, чем вверху"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 30, bottom: 20, top: 0 } }
results: [M, N]
show: [nodeLabels]
material: { e: 210e9, alpha: 12e-6 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

В шарнирно опёртой балке та же нагрузка вообще не вызывает внутренних усилий, только перемещения: подвижная опора смещается на $\alpha\,\Delta T_c\,L = 2{,}16$ мм, а середина пролёта опускается на $\kappa L^2/8 = 5{,}4$ мм.

## Заданные перемещения {#prescribed-displacements}

```ts
lc.createPrescribedDisplacement(node, { [DofID.Dz]: 0.01 })
```

Смещает опору на заданную величину: в метрах для `Dx` и `Dz`, в радианах для `Ry`, в собственных осях узла. Степень свободы должна быть закреплена опорой узла; для свободной степени свободы значение молча игнорируется.

Возьмём балку с заделкой и шарнирно-подвижной опорой и опустим подвижную опору на 10 мм. Решатель новый, материал и сечение — из примера с температурой:

```ts
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // заделка
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // шарнирно-подвижная
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

lc.createPrescribedDisplacement('B', { [DofID.Dz]: 0.01 }) // 10 mm вниз
solver.solve()

domain.getNode('B').getReactions(lc).values // [566.7] N: 3EIw/L³
beam.computeBendingMomentAt(lc, 0) // -3400.2 N·m в A: 3EIw/L²
```

Чтобы балка последовала за опорой, подвижная опора должна тянуть её вниз, поэтому её реакция положительна, вдоль +z: $3EIw/L^3 = 3 \cdot 4{,}0803 \times 10^6 \cdot 0{,}01 / 216 = 566{,}7$ Н.

::model-figure{caption="Подвижная опора балки с заделкой оседает на 10 мм: −3,4 кН·м в заделке"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

Как приложение изображает обе нагрузки, описано на странице [Нагрузки](/ru/essentials/loads).
