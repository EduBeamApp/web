---
title: Довідник API
description: "Усі класи, методи й аргументи @edubeam/fem 0.3 з одиницями, типовими значеннями та формою того, що кожен із них повертає."
order: 16
group: Довідник API
source: site
---

# Довідник API {#api-reference}

Що експортує `@edubeam/fem` 0.3, згруповано за призначенням. Скрізь використовуються одиниці СІ: m, N, N·m, N/m, Pa, K і rad. Позначки (`LabelType`) мають тип `string | number` і зберігаються як рядки. Методи, яких тут немає, є внутрішніми: у TypeScript вони публічні лише тому, що їх викликають власні класи розв’язувача.

## Експорти {#exports}

| Експорт | Вид | Розділ |
| --- | --- | --- |
| `LinearStaticSolver` | клас | [Розрахунки](#analyses) |
| `Solver` | абстрактний клас | [Розрахунки](#analyses) |
| `Domain` | клас | [Domain](#domain) |
| `Node` | клас | [Node](#node) |
| `Beam2D`, `Element` | класи | [Елементи](#elements) |
| `Material`, `CrossSection` | класи | [Матеріали та перерізи](#materials-and-sections) |
| `LoadCase` | клас | [Навантаження](#loads) |
| `NodalLoad`, `BeamConcentratedLoad`, `BeamElementUniformEdgeLoad`, `BeamElementTrapezoidalEdgeLoad`, `BeamTemperatureLoad`, `PrescribedDisplacement`, `Load`, `BeamElementLoad` | класи | [Навантаження](#loads) |
| `DofID` | перелік (enum) | [DofID](#dofid) |
| `LabelType`, `EnumDictionary`, `MaterialParameters`, `CrossSectionParameters` | типи | |

## Розрахунки {#analyses}

### `LinearStaticSolver` {#linearstaticsolver}

```ts
const solver = new LinearStaticSolver()
```

| Властивість або метод | Тип | Опис |
| --- | --- | --- |
| `domain` | `Domain` | Модель |
| `loadCases` | `LoadCase[]` | Спочатку містить один випадок, `'DefaultLC'`. Інші додавайте через `new LoadCase(label, solver.domain)`: [Випадки навантаження](/uk/solver/load-cases). |
| `solve()` | `void` | За потреби нумерує рівняння, збирає і розв’язує систему для кожного випадку навантаження. Може викинути виняток, якщо модель є [механізмом](/uk/solver/solving#when-solving-fails), але не завжди. Починаючи з 0.3.1 нічого не виводить; версія 0.3.0 виводила час розрахунку. |
| `codeNumberGenerated` | `boolean` | Задайте `false` після додавання чи вилучення вузлів або стрижнів чи зміни опор: [чому](/uk/solver/solving#solving-again-after-a-change) |
| `neq`, `pneq` | `number` | Кількість вільних і закріплених ступенів вільності, після розрахунку |
| `k` | `Matrix` mathjs | Зібрана глобальна матриця жорсткості, після розрахунку |
| `getNodeDofIDs(label)` | `number[]` | Ступені вільності вузла, після розрахунку |

`EigenValueDynamicSolver` у вихідному коді є, але не експортується.

## Domain {#domain}

`solver.domain` зберігає модель у чотирьох `Map`, ключем яких є позначка у вигляді рядка: `nodes`, `elements`, `materials`, `crossSections`. Методів для вилучення немає: вузол чи стрижень вилучають `domain.nodes.delete(label)` і `domain.elements.delete(label)`, після чого потрібна [перенумерація](/uk/solver/solving#solving-again-after-a-change).

| Метод | Повертає | Опис |
| --- | --- | --- |
| `createNode(label, coords?, bcs?)` | `Node` | `coords` — `[x, y, z]` у m (типово `[0, 0, 0]`), `bcs` — закріплені `DofID` (типово жодного) |
| `createBeam2D(label, nodes, mat, cs, hinges?)` | `Beam2D` | `nodes` — `[first, second]`, `hinges` — `[atFirst, atSecond]` (типово `[false, false]`) |
| `createMaterial(label, params?)` | `Material` | Див. [Матеріали та перерізи](#materials-and-sections) |
| `createCrossSection(label, params?)` | `CrossSection` | Див. [Матеріали та перерізи](#materials-and-sections) |
| `getNode(label)`, `getElement(label)`, `getMaterial(label)`, `getCS(label)` | об’єкт | Для невідомої позначки викидає `RangeError`. `getElement` має тип `Element`: щоб читати результати, напишіть `as Beam2D`. |

Якщо позначка вже зайнята, новий об’єкт замінить старий.

## Node {#node}

| Властивість або метод | Тип | Опис |
| --- | --- | --- |
| `label` | `string` | |
| `coords` | `number[]` | `[x, y, z]`, m. Змініть, щоб перемістити вузол. |
| `bcs` | `Set<DofID>` | Закріплені ступені вільності. Замініть, щоб змінити опору. |
| `lcs` | `number[][] \| undefined` | Повернуті осі вузла, якщо вони є |
| `updateLcs({ locx, locy }?)` | `void` | Повертає осі вузла: `locx` — його вісь x у глобальних складових, `locy` — `[0, 1, 0]`. Без аргументу повертає осі у вихідне положення. |
| `hasLcs()` | `boolean` | Чи повернуті осі |
| `getUnknowns(lc, dofs)` | `Matrix` або `number` для одного ступеня вільності | Переміщення (m) і повороти (rad) в осях вузла |
| `getReactions(lc, global?)` | `{ dofs, values }` | Реакції в закріплених ступенях вільності в порядку `bcs`: N, N·m. `values` — це `Matrix` mathjs для кількох реакцій, одноелементний масив для однієї, `[]` для вільного вузла. З `global` рівним `true` у повернутому вузлі: усі три ступені вільності в глобальних осях, `dofs` — `[0, 2, 4]`, `values` — масив з 0 там, де нічого не закріплено. [Як їх читати](/uk/solver/results#reactions). |

## Елементи {#elements}

### `Beam2D` {#beam2d}

Двовузловий балковий елемент Тимошенка в площині x–z, три ступені вільності у вузлі (`Dx`, `Dz`, `Ry`). `x` задають у метрах від першого вузла; `n` — кількість відрізків, що дає n + 1 точок.

| Властивість або метод | Повертає | Опис |
| --- | --- | --- |
| `label`, `nodes`, `mat`, `cs` | `string`, `string[]`, `string`, `string` | |
| `hinges` | `[boolean, boolean]` | Звільнення моменту в першому та другому вузлі |
| `computeNormalForceAt(lc, x)` | `number` | N, розтяг додатний |
| `computeShearForceAt(lc, x)` | `number` | V, додатна там, де M зростає вздовж локальної осі x |
| `computeBendingMomentAt(lc, x)` | `number` | M, додатний, коли розтягнуті волокна з боку локальної осі +z |
| `computeNormalForce(lc, n)` | `{ x, N }` | N у n + 1 точках |
| `computeShearForce(lc, n)` | `{ x, V }` | V у n + 1 точках |
| `computeBendingMoment(lc, n)` | `{ x, M }` | M у n + 1 точках |
| `computeLocalDefl(lc, n)` | `{ u, w }` | Переміщення вздовж і поперек стрижня, локальні осі, m |
| `computeGlobalDefl(lc, n)` | `{ u, w }` | Те саме в глобальних x і z |
| `computeEndForces(lc)` | `Matrix` | `[X12, Z12, M12, X21, Z21, M21]`, сили, якими вузли діють на стрижень, локальні осі |
| `computeEndDisplacement(lc)` | `Matrix` | Переміщення кінців у локальних осях, включно з поворотами в шарнірах |
| `computeGeo()` | `{ l, dx, dz }` | Довжина та проєкції, m |
| `computeT()` | `Matrix` | Матриця перетворення 6 × 6 з глобальних осей у локальні |
| `computeLocalStiffnessMtrx()` | `{ answer }` | `answer`: локальна матриця жорсткості 6 × 6, зі сконденсованими шарнірами |
| `computeStiffness()` | `Matrix` | Глобальна матриця жорсткості 6 × 6 |
| `computeShearFactor()` | `number` | $\Phi = 12EI_y/kGAL^2$ |
| `getMaterial()`, `getCS()` | `Material`, `CrossSection` | |

У місці зосередженої сили методи `…At` повертають значення одразу за нею. `Element` — абстрактний базовий клас для `Beam2D`; саме цей тип використовують `domain.elements` і `getElement`.

## Матеріали та перерізи {#materials-and-sections}

| `MaterialParameters` | Одиниця | Типово | Для чого |
| --- | --- | --- | --- |
| `e` | Pa | 1 | жорсткість |
| `g` | Pa | 1 | жорсткість на зсув |
| `alpha` | 1/K | 1 | температурні навантаження |
| `d` | kg/m³ | 1 | у статиці не використовується |

| `CrossSectionParameters` | Одиниця | Типово | Для чого |
| --- | --- | --- | --- |
| `a` | m² | немає, обов’язковий | поздовжня жорсткість і жорсткість на зсув |
| `iy` | m⁴ | немає, обов’язковий | згинальна жорсткість |
| `k` | – | немає, обов’язковий | жорсткість на зсув $kGA$; `1e32` — без деформації зсуву |
| `h` | m | немає | перепади температури по висоті перерізу (без нього `NaN`) |
| `iz`, `dyz`, `j` | m⁴ | немає | `Beam2D` не використовує |

Відсутній параметр матеріалу дорівнює 1, а не якомусь типовому значенню; відсутній `a`, `iy` або `k` робить кожен результат `NaN`. В обох випадках винятку не буде. Обидва класи мають метод `change(params)`, що задає передані параметри, і зберігають їх як властивості з тими самими назвами.

## Навантаження {#loads}

### `LoadCase` {#loadcase}

| Метод | Повертає | Значення |
| --- | --- | --- |
| `createNodalLoad(node, values, lcs?)` | `NodalLoad` | `{ [DofID.Dx]: N, [DofID.Dz]: N, [DofID.Ry]: N·m }`; `lcs` (типово `false`) зі значенням `true`: у повернутих осях вузла |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | `BeamElementUniformEdgeLoad` | N/m по всьому стрижню |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | `BeamElementTrapezoidalEdgeLoad` | N/m у першому та другому вузлі, лінійно між ними |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | `BeamConcentratedLoad` | N, N, N·m на відстані `a` m від першого вузла |
| `createBeamTemperatureLoad(el, [dTc, dTb, dTt])` | `BeamTemperatureLoad` | K: центр ваги, нижні волокна, верхні волокна |
| `createPrescribedDisplacement(node, values)` | `PrescribedDisplacement` | `{ [DofID.Dz]: m, … }` у закріплених ступенях вільності, в осях вузла; у вільних ігнорується |

Для навантажень на стрижні `lcs` зі значенням `true` означає локальні осі (x уздовж стрижня, z поперек нього), `false` — глобальні осі. Розподілені навантаження задаються на метр довжини стрижня. Приклади наведено на сторінці [Вузлові навантаження та навантаження на стрижні](/uk/solver/loads).

| Властивість або метод | Тип | Опис |
| --- | --- | --- |
| `label` | `string` | |
| `nodalLoadList` | `NodalLoad[]` | |
| `elementLoadList` | `BeamElementLoad[]` | Навантаження на стрижні й температурні навантаження |
| `prescribedBC` | `PrescribedDisplacement[]` | |
| `solved` | `boolean` | `true` після успішного розрахунку |
| `getElementLoadsOnElement(el)` | `BeamElementLoad[]` | Навантаження на одному стрижні |

Об’єкти навантажень зберігають свої значення в публічних властивостях, які можна змінити перед повторним розрахунком: `values` (і `lcs`) у `NodalLoad`, `BeamElementUniformEdgeLoad`, `BeamConcentratedLoad` і `BeamTemperatureLoad`; `startValues` і `endValues` у `BeamElementTrapezoidalEdgeLoad`; `prescribedValues` у `PrescribedDisplacement`. Кожен має `target` — позначку об’єкта, на який діє.

## DofID {#dofid}

| Назва | Значення | Використовується в `Beam2D` |
| --- | --- | --- |
| `Dx` | 0 | так |
| `Dy` | 1 | ні |
| `Dz` | 2 | так |
| `Rx` | 3 | ні |
| `Ry` | 4 | так |
| `Rz` | 5 | ні |

## Результати {#results}

Результати читають із `Beam2D` (внутрішні зусилля, прогини, кінцеві зусилля) і з `Node` (переміщення, реакції), завжди для заданого `LoadCase`, після `solve()`: див. дві таблиці вище, а приклади й правила знаків — на сторінці [Читання результатів](/uk/solver/results). Коротко:

| Що отримати | Виклик |
| --- | --- |
| Реакції, N і N·m | `node.getReactions(lc)` |
| Переміщення, m, і повороти, rad | `node.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])` |
| N, V або M у точці, N і N·m | `beam.computeNormalForceAt(lc, x)`, `computeShearForceAt`, `computeBendingMomentAt` |
| N, V або M уздовж стрижня | `beam.computeNormalForce(lc, n)`, `computeShearForce`, `computeBendingMoment` |
| Пружна лінія, m | `beam.computeLocalDefl(lc, n)`, `computeGlobalDefl` |
| Кінцеві зусилля, N і N·m | `beam.computeEndForces(lc)` |
| Рисунок усього цього | `StructurePlot` або `structureSvg` з [@edubeam/plot](/uk/solver/drawing) |
