---
title: Рамы
description: "Готовая программа @edubeam/fem для трёхшарнирной рамы со стойками, жёсткими узлами и ключевым шарниром и ручная проверка её результатов."
order: 13
source: site
---

# Рамы {#frames}

Рама — это ригели и стойки, жёстко соединённые в узлах. В этом примере в коде строится рама из [учебного примера с трёхшарнирной рамой](/ru/tutorials/three-hinged-frame): две стойки высотой 4 м с шарнирно-неподвижными опорами в A и E, ригель пролётом 8 м с шарниром в C и нагрузка 10 кН/м на ригеле. В учебном примере узлы пронумерованы от 1 до 5, здесь они обозначены буквами от A до E.

::model-figure{caption="Рама из программы ниже: шарнирно-неподвижные опоры в A и E, шарнир в C, 10 кН/м"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, k: 1e32 }) // IPE 300

// Ось z направлена вниз: верх стоек высотой 4 m находится при z = -4
const pin = [DofID.Dx, DofID.Dz]
domain.createNode('A', [0, 0, 0], pin)
domain.createNode('B', [0, 0, -4])
domain.createNode('C', [4, 0, -4]) // ключевой шарнир
domain.createNode('D', [8, 0, -4])
domain.createNode('E', [8, 0, 0], pin)

const column = domain.createBeam2D(1, ['A', 'B'], 1, 1) // снизу вверх
const left = domain.createBeam2D(2, ['B', 'C'], 1, 1, [false, true]) // шарнир в C
domain.createBeam2D(3, ['C', 'D'], 1, 1)
domain.createBeam2D(4, ['D', 'E'], 1, 1)

const lc = solver.loadCases[0]
for (const half of [2, 3]) {
  lc.createBeamElementUniformEdgeLoad(half, [0, 10e3], false)
}
solver.solve()

// getReactions выдаёт матрицу mathjs или массив: приводим к массиву
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()
const kN = (v: number) => (v / 1e3).toFixed(2)

for (const label of ['A', 'E']) {
  const [rx, rz] = list(domain.getNode(label).getReactions(lc).values)
  console.log(`${label}: Rx = ${kN(rx)} kN, Rz = ${kN(rz)} kN`)
}
for (const x of [0, 2, 4]) {
  const m = left.computeBendingMomentAt(lc, x)
  console.log(`M at ${x} m from B = ${kN(m)} kNm`)
}
const top = column.computeBendingMomentAt(lc, 4)
console.log(`M at the top of column 1 = ${kN(top)} kNm`)
```

```text [Вывод]
A: Rx = 20.00 kN, Rz = -40.00 kN
E: Rx = -20.00 kN, Rz = -40.00 kN
M at 0 m from B = -80.00 kNm
M at 2 m from B = -20.00 kNm
M at 4 m from B = 0.00 kNm
M at the top of column 1 = -80.00 kNm
```

## Ручная проверка {#check-it-by-hand}

| Величина | Вручную | Решатель |
| --- | --- | --- |
| Вертикальные реакции | $q \cdot 8/2 = 40$ кН вверх | $R_z = -40$ кН в A и E |
| Горизонтальные реакции (распор) | из условия $M_C = 0$ для левой половины: $(40 \cdot 4 - 10 \cdot 4 \cdot 2)/4 = 20$ кН, внутрь | $R_x = +20$ кН в A, $-20$ кН в E |
| Момент в узле рамы | $-20 \cdot 4 = -80$ кН·м | $-80$ кН·м в ригеле и в стойке |
| Момент в 2 м от B | $-80 + 40 \cdot 2 - 10 \cdot 2^2/2 = -20$ кН·м | $-20$ кН·м |
| Момент в шарнире | 0 | 0 |

## На что обратить внимание {#things-to-notice}

- **Стойки идут вверх, поэтому координата z отрицательна.** Верх стоек находится при $z = -4$.
- **Локальные оси стойки.** Стержень 1 идёт от A вверх к B, поэтому его локальная ось z направлена вправо, внутрь рамы. Момент в его верхнем сечении равен −80 кН·м, как и момент ригеля в узле рамы: растянуты наружные волокна. Задайте стойку от B вниз к A — и её локальная ось z будет направлена влево: момент сменит знак, а `x` будет отсчитываться от верха. См. [Направление стержня](/ru/solver/conventions#member-direction).
- **Один шарнир — один конец стержня.** Шарнир стоит на конце стержня 2 в C; стержень 3 начинается в C жёстко. Одного освобождённого конца достаточно, чтобы C стал шарниром.
- **Нагрузка на ригель в глобальных осях.** `false` задаёт нагрузку в глобальных осях: вертикально при любом наклоне стержня. У горизонтального ригеля, нарисованного слева направо, это то же самое, что в локальных осях.

## Статически неопределимые рамы {#statically-indeterminate-frames}

Уберите шарнир, `[false, false]`, и получится двухшарнирная П-образная рама с одной лишней связью. Её усилия тогда зависят от того, насколько жёсткий ригель по сравнению со стойками: задайте стержням разные сечения, чтобы это увидеть. В разделе [«Экспериментируйте»](/ru/tutorials/three-hinged-frame#_7-experiment) учебного примера опоры защемляются, а рама нагружается горизонтально, с числами для проверки. На странице [Слайды и конспекты](/ru/plot/slides) библиотеки @edubeam/plot такая П-образная рама рисуется шаг за шагом.
