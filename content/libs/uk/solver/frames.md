---
title: Рами
description: "Повна програма @edubeam/fem для тришарнірної рами з колонами, жорсткими кутовими вузлами та ключовим шарніром, з результатами, перевіреними вручну."
order: 13
source: site
---

# Рами {#frames}

Рама складається з ригелів і колон, жорстко з’єднаних у кутах. Цей приклад будує в коді раму з покрокового прикладу [Тришарнірна рама](/uk/tutorials/three-hinged-frame): дві колони заввишки 4 m із шарнірно-нерухомими опорами в A і E, ригель завдовжки 8 m із шарніром у C і навантаження 10 kN/m на ригелі. У покроковому прикладі вузли пронумеровано від 1 до 5, тут вони позначені від A до E.

::model-figure{caption="Рама з програми нижче: шарнірно-нерухомі опори в A і E, шарнір у C, 10 kN/m"}
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

// вісь z напрямлена вниз: верх колон заввишки 4 m лежить у z = -4
const pin = [DofID.Dx, DofID.Dz]
domain.createNode('A', [0, 0, 0], pin)
domain.createNode('B', [0, 0, -4])
domain.createNode('C', [4, 0, -4]) // ключовий шарнір
domain.createNode('D', [8, 0, -4])
domain.createNode('E', [8, 0, 0], pin)

const column = domain.createBeam2D(1, ['A', 'B'], 1, 1) // знизу вгору
const left = domain.createBeam2D(2, ['B', 'C'], 1, 1, [false, true]) // шарнір у C
domain.createBeam2D(3, ['C', 'D'], 1, 1)
domain.createBeam2D(4, ['D', 'E'], 1, 1)

const lc = solver.loadCases[0]
for (const half of [2, 3]) {
  lc.createBeamElementUniformEdgeLoad(half, [0, 10e3], false)
}
solver.solve()

// getReactions повертає матрицю mathjs або масив: перетворимо на масив
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

```text [Вивід]
A: Rx = 20.00 kN, Rz = -40.00 kN
E: Rx = -20.00 kN, Rz = -40.00 kN
M at 0 m from B = -80.00 kNm
M at 2 m from B = -20.00 kNm
M at 4 m from B = 0.00 kNm
M at the top of column 1 = -80.00 kNm
```

## Перевірка вручну {#check-it-by-hand}

| Величина | Вручну | Розв’язувач |
| --- | --- | --- |
| Вертикальні реакції | $q \cdot 8/2 = 40$ kN угору | $R_z = -40$ kN в A і E |
| Горизонтальні реакції | з $M_C = 0$ для лівої половини: $(40 \cdot 4 - 10 \cdot 4 \cdot 2)/4 = 20$ kN, всередину рами | $R_x = +20$ kN в A, $-20$ kN в E |
| Момент у кутовому вузлі | $-20 \cdot 4 = -80$ kNm | $-80$ kNm у ригелі та в колоні |
| Момент на відстані 2 m від B | $-80 + 40 \cdot 2 - 10 \cdot 2^2/2 = -20$ kNm | $-20$ kNm |
| Момент у шарнірі | 0 | 0 |

## На що звернути увагу {#things-to-notice}

- **Колони йдуть угору, тож z від’ємне.** Верх колон лежить у $z = -4$.
- **Локальні осі колони.** Стрижень 1 іде від A вгору до B, тож його локальна вісь z напрямлена праворуч, усередину рами. Його момент угорі дорівнює −80 kNm, як і момент ригеля в кутовому вузлі: розтягнуті зовнішні волокна. Задайте колону від B донизу до A, і її локальна вісь z буде напрямлена ліворуч: момент змінить знак, а `x` відраховуватиметься від верху. Див. [Напрям стрижня](/uk/solver/conventions#member-direction).
- **Один шарнір — один кінець стрижня.** Шарнір розташований на кінці стрижня 2 у C; стрижень 3 починається в C жорстко. Одного звільненого кінця досить, щоб C став шарніром.
- **Навантаження на ригель у глобальних осях.** `false` задає навантаження в глобальних осях: воно діє вертикально, незалежно від нахилу стрижня. На горизонтальному ригелі, заданому зліва направо, це те саме, що й у локальних осях.

## Статично невизначувані рами {#statically-indeterminate-frames}

Приберіть шарнір, `[false, false]`, і отримаєте П-подібну раму, один раз статично невизначувану. Її зусилля тоді залежать від того, наскільки жорсткий ригель порівняно з колонами: задайте стрижням різні перерізи, щоб це побачити. У розділі [Експериментуйте](/uk/tutorials/three-hinged-frame#_7-experiment) покрокового прикладу основи колон защемлюють і штовхають раму вбік; там є й числа для перевірки. Сторінка [Слайди та конспекти](/uk/plot/slides) бібліотеки @edubeam/plot крок за кроком малює таку П-подібну раму.
