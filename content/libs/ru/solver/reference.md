---
title: Справочник API
description: "Все классы, методы и аргументы @edubeam/fem 0.3 с единицами, значениями по умолчанию и формой возвращаемых значений."
order: 16
group: Справочник API
source: site
---

# Справочник API {#api-reference}

Всё, что экспортирует `@edubeam/fem` 0.3, сгруппировано по назначению. Единицы везде СИ: м, Н, Н·м, Н/м, Па, К и рад. Метки (`LabelType`) имеют тип `string | number` и хранятся как строки. Методы, которых здесь нет, внутренние: в TypeScript они публичны лишь потому, что их вызывают собственные классы решателя.

## Экспорт {#exports}

| Экспорт | Вид | Раздел |
| --- | --- | --- |
| `LinearStaticSolver` | класс | [Виды расчёта](#analyses) |
| `Solver` | абстрактный класс | [Виды расчёта](#analyses) |
| `Domain` | класс | [Domain](#domain) |
| `Node` | класс | [Node](#node) |
| `Beam2D`, `Element` | классы | [Элементы](#elements) |
| `Material`, `CrossSection` | классы | [Материалы и сечения](#materials-and-sections) |
| `LoadCase` | класс | [Нагрузки](#loads) |
| `NodalLoad`, `BeamConcentratedLoad`, `BeamElementUniformEdgeLoad`, `BeamElementTrapezoidalEdgeLoad`, `BeamTemperatureLoad`, `PrescribedDisplacement`, `Load`, `BeamElementLoad` | классы | [Нагрузки](#loads) |
| `DofID` | перечисление | [DofID](#dofid) |
| `LabelType`, `EnumDictionary`, `MaterialParameters`, `CrossSectionParameters` | типы | |

## Виды расчёта {#analyses}

### `LinearStaticSolver` {#linearstaticsolver}

```ts
const solver = new LinearStaticSolver()
```

| Свойство или метод | Тип | Описание |
| --- | --- | --- |
| `domain` | `Domain` | Модель |
| `loadCases` | `LoadCase[]` | Изначально содержит один случай, `'DefaultLC'`. Новые добавляйте через `new LoadCase(label, solver.domain)`: [Случаи нагружения](/ru/solver/load-cases). |
| `solve()` | `void` | При необходимости нумерует уравнения, собирает и решает все случаи нагружения. Для [механизма](/ru/solver/solving#when-solving-fails) может выбросить исключение, но не всегда. Начиная с версии 0.3.1 ничего не выводит; версия 0.3.0 печатала время расчёта. |
| `codeNumberGenerated` | `boolean` | Присвойте `false` после добавления или удаления узлов или стержней или изменения опор: [почему](/ru/solver/solving#solving-again-after-a-change) |
| `neq`, `pneq` | `number` | Число свободных и закреплённых степеней свободы, после расчёта |
| `k` | mathjs `Matrix` | Собранная глобальная матрица жёсткости, после расчёта |
| `getNodeDofIDs(label)` | `number[]` | Степени свободы узла, после расчёта |

`EigenValueDynamicSolver` есть в исходном коде, но не экспортируется.

## Domain {#domain}

`solver.domain` хранит модель в четырёх `Map` с меткой в виде строки в качестве ключа: `nodes`, `elements`, `materials`, `crossSections`. Методов удаления нет: узел или стержень удаляют `domain.nodes.delete(label)` и `domain.elements.delete(label)`, после чего нужна [перенумерация](/ru/solver/solving#solving-again-after-a-change).

| Метод | Возвращает | Описание |
| --- | --- | --- |
| `createNode(label, coords?, bcs?)` | `Node` | `coords` — `[x, y, z]` в м (по умолчанию `[0, 0, 0]`), `bcs` — закреплённые опорой `DofID` (по умолчанию нет) |
| `createBeam2D(label, nodes, mat, cs, hinges?)` | `Beam2D` | `nodes` — `[first, second]`, `hinges` — `[atFirst, atSecond]` (по умолчанию `[false, false]`) |
| `createMaterial(label, params?)` | `Material` | См. [Материалы и сечения](#materials-and-sections) |
| `createCrossSection(label, params?)` | `CrossSection` | См. [Материалы и сечения](#materials-and-sections) |
| `getNode(label)`, `getElement(label)`, `getMaterial(label)`, `getCS(label)` | сам объект | Для неизвестной метки выбрасывает `RangeError`. `getElement` имеет тип `Element`: чтобы читать результаты, напишите `as Beam2D`. |

Создание объекта с уже занятой меткой заменяет старый объект.

## Node {#node}

| Свойство или метод | Тип | Описание |
| --- | --- | --- |
| `label` | `string` | |
| `coords` | `number[]` | `[x, y, z]`, м. Измените, чтобы переместить узел. |
| `bcs` | `Set<DofID>` | Закреплённые степени свободы. Замените, чтобы изменить опору. |
| `lcs` | `number[][] \| undefined` | Повёрнутые оси узла, если они заданы |
| `updateLcs({ locx, locy }?)` | `void` | Поворачивает оси узла: `locx` — его ось x в глобальных составляющих, `locy` — `[0, 1, 0]`. Без аргумента возвращает исходные оси. |
| `hasLcs()` | `boolean` | Повёрнуты ли оси |
| `getUnknowns(lc, dofs)` | `Matrix` или `number` для одной степени свободы | Перемещения (м) и углы поворота (рад), в осях узла |
| `getReactions(lc, global?)` | `{ dofs, values }` | Реакции по закреплённым степеням свободы в порядке `bcs`: Н, Н·м. `values` — матрица mathjs `Matrix`, если реакций несколько, массив из одного элемента, если реакция одна, и `[]` для свободного узла. Если `global` равен `true` и оси узла повёрнуты: все три степени свободы в глобальных осях, `dofs` — `[0, 2, 4]`, `values` — массив с 0 там, где ничего не закреплено. [Как их читать](/ru/solver/results#reactions). |

## Элементы {#elements}

### `Beam2D` {#beam2d}

Двухузловая балка Тимошенко в плоскости x–z, три степени свободы в каждом узле (`Dx`, `Dz`, `Ry`). `x` задаётся в метрах от первого узла; `n` — число участков, что даёт n + 1 точек.

| Свойство или метод | Возвращает | Описание |
| --- | --- | --- |
| `label`, `nodes`, `mat`, `cs` | `string`, `string[]`, `string`, `string` | |
| `hinges` | `[boolean, boolean]` | Шарниры (снятие момента) у первого и второго узла |
| `computeNormalForceAt(lc, x)` | `number` | N, растяжение положительно |
| `computeShearForceAt(lc, x)` | `number` | V, положительна там, где M растёт вдоль локальной оси x |
| `computeBendingMomentAt(lc, x)` | `number` | M, положителен при растяжении со стороны локальной оси +z |
| `computeNormalForce(lc, n)` | `{ x, N }` | N в n + 1 точках |
| `computeShearForce(lc, n)` | `{ x, V }` | V в n + 1 точках |
| `computeBendingMoment(lc, n)` | `{ x, M }` | M в n + 1 точках |
| `computeLocalDefl(lc, n)` | `{ u, w }` | Перемещения вдоль и поперёк стержня, в локальных осях, м |
| `computeGlobalDefl(lc, n)` | `{ u, w }` | То же в глобальных осях x и z |
| `computeEndForces(lc)` | `Matrix` | `[X12, Z12, M12, X21, Z21, M21]` — силы, с которыми узлы действуют на стержень, в локальных осях |
| `computeEndDisplacement(lc)` | `Matrix` | Перемещения концов в локальных осях, включая повороты в шарнирах |
| `computeGeo()` | `{ l, dx, dz }` | Длина и проекции, м |
| `computeT()` | `Matrix` | Матрица преобразования 6 × 6, из глобальных осей в локальные |
| `computeLocalStiffnessMtrx()` | `{ answer }` | `answer` — локальная матрица жёсткости 6 × 6, шарниры исключены конденсацией |
| `computeStiffness()` | `Matrix` | Глобальная матрица жёсткости 6 × 6 |
| `computeShearFactor()` | `number` | $\Phi = 12EI_y/kGAL^2$ |
| `getMaterial()`, `getCS()` | `Material`, `CrossSection` | |

В точке приложения сосредоточенной силы методы `…At` возвращают значение сразу за ней. `Element` — абстрактный базовый класс `Beam2D`; этот тип используют `domain.elements` и `getElement`.

## Материалы и сечения {#materials-and-sections}

| `MaterialParameters` | Единица | По умолчанию | Для чего |
| --- | --- | --- | --- |
| `e` | Па | 1 | жёсткость |
| `g` | Па | 1 | сдвиговая жёсткость |
| `alpha` | 1/К | 1 | температурные нагрузки |
| `d` | кг/м³ | 1 | в статике не используется |

| `CrossSectionParameters` | Единица | По умолчанию | Для чего |
| --- | --- | --- | --- |
| `a` | м² | нет, обязателен | продольная и сдвиговая жёсткость |
| `iy` | м⁴ | нет, обязателен | изгибная жёсткость |
| `k` | — | нет, обязателен | сдвиговая жёсткость $kGA$; `1e32` — без деформаций сдвига |
| `h` | м | нет | температурный перепад (без него `NaN`) |
| `iz`, `dyz`, `j` | м⁴ | нет | `Beam2D` не использует |

Пропущенный параметр материала равен 1, а не типичному значению; пропущенные `a`, `iy` или `k` превращают все результаты в `NaN`. Ни то, ни другое не вызывает ошибки. У обоих классов есть метод `change(params)`, который задаёт переданные параметры, а сами параметры хранятся в одноимённых свойствах.

## Нагрузки {#loads}

### `LoadCase` {#loadcase}

| Метод | Возвращает | Значения |
| --- | --- | --- |
| `createNodalLoad(node, values, lcs?)` | `NodalLoad` | `{ [DofID.Dx]: N, [DofID.Dz]: N, [DofID.Ry]: N·m }`; при `lcs`, равном `true` (по умолчанию `false`), — в повёрнутых осях узла |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | `BeamElementUniformEdgeLoad` | Н/м по всей длине стержня |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | `BeamElementTrapezoidalEdgeLoad` | Н/м в первом и втором узле, линейно между ними |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | `BeamConcentratedLoad` | Н, Н, Н·м, на расстоянии `a` м от первого узла |
| `createBeamTemperatureLoad(el, [dTc, dTb, dTt])` | `BeamTemperatureLoad` | К: центр тяжести, нижние волокна, верхние волокна |
| `createPrescribedDisplacement(node, values)` | `PrescribedDisplacement` | `{ [DofID.Dz]: m, … }` по закреплённым степеням свободы, в осях узла; для свободных игнорируется |

Для нагрузок на стержни `lcs`, равный `true`, означает локальные оси (x вдоль стержня, z поперёк), `false` — глобальные. Погонные нагрузки задаются на метр длины стержня. Примеры — на странице [Узловые нагрузки и нагрузки на стержни](/ru/solver/loads).

| Свойство или метод | Тип | Описание |
| --- | --- | --- |
| `label` | `string` | |
| `nodalLoadList` | `NodalLoad[]` | |
| `elementLoadList` | `BeamElementLoad[]` | Нагрузки на стержни и температурные нагрузки |
| `prescribedBC` | `PrescribedDisplacement[]` | |
| `solved` | `boolean` | `true` после успешного расчёта |
| `getElementLoadsOnElement(el)` | `BeamElementLoad[]` | Нагрузки на один стержень |

Объекты нагрузок хранят значения в публичных свойствах, которые можно изменить перед новым расчётом: `values` (и `lcs`) у `NodalLoad`, `BeamElementUniformEdgeLoad`, `BeamConcentratedLoad` и `BeamTemperatureLoad`; `startValues` и `endValues` у `BeamElementTrapezoidalEdgeLoad`; `prescribedValues` у `PrescribedDisplacement`. У каждой нагрузки есть `target` — метка объекта, на который она действует.

## DofID {#dofid}

| Имя | Значение | Используется в `Beam2D` |
| --- | --- | --- |
| `Dx` | 0 | да |
| `Dy` | 1 | нет |
| `Dz` | 2 | да |
| `Rx` | 3 | нет |
| `Ry` | 4 | да |
| `Rz` | 5 | нет |

## Результаты {#results}

Результаты читаются из `Beam2D` (внутренние усилия, прогибы, концевые усилия) и из `Node` (перемещения, реакции), всегда для заданного `LoadCase` и после `solve()`: см. две таблицы выше, а примеры и правила знаков — на странице [Чтение результатов](/ru/solver/results). Кратко:

| Что нужно | Вызов |
| --- | --- |
| Реакции, Н и Н·м | `node.getReactions(lc)` |
| Перемещения, м, и углы поворота, рад | `node.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])` |
| N, V или M в точке, Н и Н·м | `beam.computeNormalForceAt(lc, x)`, `computeShearForceAt`, `computeBendingMomentAt` |
| N, V или M вдоль стержня | `beam.computeNormalForce(lc, n)`, `computeShearForce`, `computeBendingMoment` |
| Деформированная схема, м | `beam.computeLocalDefl(lc, n)`, `computeGlobalDefl` |
| Концевые усилия, Н и Н·м | `beam.computeEndForces(lc)` |
| Рисунок всего этого | `StructurePlot` или `structureSvg` из [@edubeam/plot](/ru/solver/drawing) |
