---
title: Температура та осідання опор
description: "Навантажуйте стрижні @edubeam/fem зміною температури та перепадом температури по висоті перерізу і зміщуйте опори заданим переміщенням, з перевіреними прикладами."
order: 7
source: site
---

# Температура та осідання опор {#temperature-and-settlements}

Два навантаження, які не є силами: стрижень, що прагне змінити довжину або кривину, і опора, що зміщується. Обидва спричиняють внутрішні зусилля лише там, де конструкція цьому перешкоджає, тому вони добре підходять для статично невизначуваних конструкцій. Теорію обох описано в розділі [Навантаження на елемент](/uk/elements/beam#element-loads) теоретичного посібника застосунку.

## Температура {#temperature}

```ts
lc.createBeamTemperatureLoad(member, [dTc, dTb, dTt])
```

| Значення | Зміст | Вплив на вільний стрижень |
| --- | --- | --- |
| `dTc` | зміна в центрі ваги перерізу, K | подовжується на $\alpha\,\Delta T_c\,L$ |
| `dTb` | зміна в нижніх волокнах (з боку локальної осі +z), K | разом із `dTt` викривлюється з кривиною $\kappa = \alpha\,(\Delta T_b - \Delta T_t)/h$ |
| `dTt` | зміна у верхніх волокнах, K | |

Згинає стрижень лише різниця `dTb - dTt`, тож `[30, 20, 0]` і `[30, 10, -10]` — це те саме навантаження. Потрібні `alpha` матеріалу та `h` перерізу; без `h` моменти будуть `NaN`.

Балка, защемлена на обох кінцях, не може ні подовжитися, ні викривитися, тому її натомість стискає й згинає: $N = -EA\,\alpha\,\Delta T_c$ і $M = -EI\,\alpha\,(\Delta T_b - \Delta T_t)/h$.

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

// Центр ваги тепліший на 30 K, низ тепліший за верх на 20 K
lc.createBeamTemperatureLoad(1, [30, 20, 0])
solver.solve()

beam.computeNormalForceAt(lc, 3) // -215460 N: EA · 12e-6 · 30
beam.computeBendingMomentAt(lc, 3) // -4896.4 N·m: EI · 12e-6 · 20 / 0.2
```

Для IPE 200 $EA = 598{,}5$ MN і $EI = 4{,}0803$ MNm². Тепліші нижні волокна змушують вільну балку вигнутися кінцями вгору, тож защемлення згинає її в протилежний бік: виникає від’ємний момент, розтягнуті верхні волокна.

::model-figure{caption="Балка з двома защемленнями: у центрі ваги тепліша на 30 K, знизу тепліша, ніж зверху, на 20 K"}
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

На шарнірно опертій балці те саме навантаження не спричиняє жодних внутрішніх зусиль, лише переміщення: шарнірно-рухома опора зсувається назовні на $\alpha\,\Delta T_c\,L = 2{,}16$ mm, а середина прольоту прогинається на $\kappa L^2/8 = 5{,}4$ mm.

## Задані переміщення {#prescribed-displacements}

```ts
lc.createPrescribedDisplacement(node, { [DofID.Dz]: 0.01 })
```

Зміщує опору на задану величину: у метрах для `Dx` і `Dz`, у радіанах для `Ry`, у власних осях вузла. Ступінь вільності має бути закріплений опорою вузла; на вільному ступені вільності значення ігнорується без попередження.

Балка із защемленням в A і шарнірно-рухомою опорою в B, яка осідає на 10 mm; новий розв’язувач, матеріал і переріз — як у температурному прикладі:

```ts
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // защемлення
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // шарнірно-рухома опора
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

lc.createPrescribedDisplacement('B', { [DofID.Dz]: 0.01 }) // 10 mm донизу
solver.solve()

domain.getNode('B').getReactions(lc).values // [566.7] N: 3EIw/L³
beam.computeBendingMomentAt(lc, 0) // -3400.2 N·m в A: 3EIw/L²
```

Шарнірно-рухома опора мусить тягнути балку донизу, щоб балка пішла за нею, тож її реакція додатна, уздовж +z: $3EIw/L^3 = 3 \cdot 4{,}0803 \times 10^6 \cdot 0{,}01 / 216 = 566{,}7$ N.

::model-figure{caption="Шарнірно-рухома опора балки із защемленням осідає на 10 mm: −3,4 kNm у защемленні"}
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

Як застосунок показує обидва навантаження, описано на сторінці [Навантаження](/uk/essentials/loads).
