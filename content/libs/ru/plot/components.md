---
title: API компонентов
description: "Все свойства и события StructurePlot и DiagramStack в @edubeam/plot 0.2.0 с типами и значениями по умолчанию, плагин EduBeamPlot и экспортируемые типы свойств."
order: 8
group: Справочник API
source: site
---

# API компонентов

Свойства (props) и события обоих компонентов в том виде, как они объявлены в @edubeam/plot 0.2.0. Слотов нет ни у одного из них. Значения в единицах СИ отмечены особо; размеры указаны в CSS-пикселях.

## StructurePlot {#structureplot}

```ts
import { StructurePlot } from '@edubeam/plot'
```

Рисует плоскую конструкцию и результаты её расчёта. Подробнее: [StructurePlot](/ru/plot/structure-plot).

### Свойства {#props}

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Решатель @edubeam/fem. Результаты рисуются, как только его случай нагружения рассчитан. |
| `model` | `PlotModel` | – | Или простые данные, которые создаёт [`modelFromSolver`](/ru/plot/model). Имеет приоритет над `solver`. |
| `loadCase` | `number` | `0` | Индекс в `solver.loadCases` |
| `revision` | `number` | `0` | Измените, чтобы перерисовать решатель, изменённый на месте |
| `layers` | `readonly PlotLayer[]` | стержни, опоры, нагрузки, реакции и один результат | Что рисовать: `'nodes'`, `'nodeLabels'`, `'dimensions'`, `'members'`, `'supports'`, `'loads'`, `'reactions'`, `'N'`, `'V'`, `'M'`, `'w'` |
| `reserve` | `readonly PlotLayer[]` | `layers` | Слои, для которых нужно оставить место, пока они скрыты |
| `compact` | `boolean` | `false` | Рисунок для миниатюр: меньшие обозначения, не больше двух значений на стержень |
| `units` | `Partial<Units>` | `KN_UNITS` | Единицы отображения |
| `numberFormat` | `Intl.NumberFormat` | английский, не больше 1 знака после запятой | Форматирует все числа |
| `colors` | `Partial<PlotColors>` | – | Замена цветов по тонам: [Темы и цвета](/ru/plot/theming#the-colors-prop) |
| `width` | `number` | `640`, compact `400` | Ширина до измерения контейнера, например на сервере |
| `height` | `number` | – | Фиксированная высота. Без неё высота подстраивается под изображение. |
| `maxHeight` | `number` | `max(320, 0.75 × width)`, compact нет | Верхняя граница автоматической высоты |
| `padding` | `number` | `6` | Отступ вокруг изображения |
| `fontSize` | `number` | `13`, compact `11.5` | Размер текста |
| `diagramSize` | `number` | `48`, compact `26` | Длина наибольшей ординаты эпюры |
| `deformedSize` | `number` | `30`, compact `18` | Наибольшее перемещение на деформированной схеме |
| `diagramScale` | `Partial<Record<ResultLayer, number>>` | – | Фиксированный масштаб результата в px на единицу СИ; заменяет `diagramSize` или `deformedSize` |
| `momentOnTensionSide` | `boolean` | `true` | M со стороны растянутых волокон; `false` — со стороны сжатых |
| `resultLabelMode` | `'horizontal' \| 'axis'` | `'horizontal'` | Значения стоят прямо или повёрнуты вдоль своей ординаты |
| `reactionLabels` | `'values' \| 'names'` | `'values'` | Реакции в том направлении, в котором действуют, с величиной; или, для упражнения, каждое закреплённое направление с обозначением (*A<sub>x</sub>*, *M<sub>A</sub>*) и стрелкой в положительную сторону. Для обозначений результаты не нужны: [Реакции как неизвестные](/ru/plot/structure-plot#reactions-as-unknowns) |
| `reserveLabelModes` | `readonly ResultLabelMode[]` | – | Режимы подписей, для которых нужно оставить место помимо текущего |
| `reserveReactionLabels` | `readonly ReactionLabels[]` | – | Стили подписей реакций, для которых нужно оставить место помимо `reactionLabels`, чтобы рисунок не сдвигался, когда упражнение превращается в решение |
| `animate` | `boolean` | `true` | Плавное появление слоёв и прорисовка стержней. При `prefers-reduced-motion` всегда выключено. |
| `hover` | `boolean` | `false` | Считывание значений под указателем с отметками на концах ординат эпюр. Если выключено, рисунок вообще не принимает ввод указателем. |
| `title` | `string` | описание показанного | Доступное имя рисунка |

Без `layers` показывается результат `M` для балок и рам, `N` для фермы и `w`, если усилий нет нигде (`defaultResultLayer`).

### События {#events}

| Событие | Данные | Когда |
| --- | --- | --- |
| `readout` | `Readout \| null` | С `hover`: точка стержня под указателем и результаты в ней; `null`, когда указатель уходит |

```ts
interface Readout {
  readonly member: string
  readonly x: number // м от начального узла стержня
  readonly px: number // точка на экране, px
  readonly py: number
  readonly values: Readonly<Record<'N' | 'V' | 'M' | 'w', SidedValue>> // единицы СИ
  readonly u: number // перемещение вдоль локальной оси x стержня, м
}
interface SidedValue {
  readonly left: number
  readonly right: number // равно left там, где результат непрерывен
}
```

## DiagramStack {#diagramstack}

```ts
import { DiagramStack } from '@edubeam/plot'
```

Рисует прямую балку над её эпюрами на общей оси x. Стержни должны образовывать одну горизонтальную линию, заданную слева направо; в остальных случаях выбрасывается исключение. Подробнее: [DiagramStack](/ru/plot/diagram-stack).

### Свойства {#props-1}

| Свойство | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Рассчитанная балка |
| `model` | `PlotModel` | – | Или простые данные из `modelFromSolver`; имеет приоритет |
| `loadCase` | `number` | `0` | Индекс в `solver.loadCases` |
| `revision` | `number` | `0` | Измените, чтобы перерисовать решатель, изменённый на месте |
| `members` | `readonly string[]` | все стержни | Стержни балочной линии |
| `rows` | `readonly StackRow[]` | `['V', 'M', 'w']` | Ряды эпюр сверху вниз, из `'N'`, `'V'`, `'M'`, `'w'` |
| `loadRow` | `boolean` | `true` | Балка с опорами, нагрузками и реакциями над рядами |
| `ranges` | `Partial<Record<StackRow, readonly [number, number]>>` | у каждого ряда свой | Диапазон значений для ряда, единицы СИ |
| `rowHeights` | `Partial<Record<StackRow, number>>` | N 100, V 116, M 128, w 76; при ширине меньше 560 px — 88, 96, 104, 64 | Высоты рядов до масштабирования по `maxHeight` |
| `maxHeight` | `number` | – | Чтобы рисунок поместился, ряды сжимаются, но не ниже 60 % своей высоты. Размер текста не меняется. |
| `units` | `Partial<Units>` | `KN_UNITS` | Единицы отображения |
| `numberFormat` | `Intl.NumberFormat` | английский, не больше 1 знака после запятой | Форматирует все числа |
| `colors` | `Partial<PlotColors>` | – | Замена цветов |
| `width` | `number` | `720` | Ширина до измерения контейнера; используется не меньше 320 |
| `fontSize` | `number` | `12.5` | Размер текста |
| `hover` | `boolean` | `true` | Курсор для считывания. Если выключен, рисунок не принимает ввод указателем. |
| `loadAt` | `number` | – | Положение (м вдоль линии) сосредоточенной силы, которую может перетаскивать читатель; используется с `v-model:load-at` |
| `loadLabel` | `string` | `P = …` с величиной силы | Текст рядом с перетаскиваемой силой |
| `loadStep` | `number` | `0.05` | Шаг округления при перетаскивании, м; на этот шаг сдвигают клавиши со стрелками |
| `title` | `string` | описание рядов | Доступное имя рисунка |

### События {#events-1}

| Событие | Данные | Когда |
| --- | --- | --- |
| `update:loadAt` | `number` | Читатель сдвинул силу: её новое положение, м. На этом событии работает `v-model:load-at`. |
| `readout` | `StackReadout \| null` | Значения курсора во всех рядах; `null`, когда указатель уходит |

```ts
interface StackReadout {
  readonly x: number // м вдоль балочной линии
  readonly values: Partial<Record<'N' | 'V' | 'M' | 'w', { readonly left: number; readonly right: number }>> // СИ
}
```

## Плагин {#the-plugin}

```ts
import { EduBeamPlot } from '@edubeam/plot'

app.use(EduBeamPlot) // регистрирует <StructurePlot> и <DiagramStack> глобально
```

Плагин не обязателен: импорт компонентов по имени легче, а сборщик выбрасывает плагин из сборки, которая его не использует.

## Типы {#types}

Для типизированных обёрток вокруг компонентов пакет экспортирует типы их свойств и событий:

```ts
import type { PlotLayer, StructurePlotProps } from '@edubeam/plot'

const figure: StructurePlotProps = { layers: ['members', 'supports', 'M'] satisfies PlotLayer[], compact: true }
```

| Тип | Что это |
| --- | --- |
| `StructurePlotProps`, `StructurePlotEmits` | Свойства и события `StructurePlot` |
| `DiagramStackProps`, `DiagramStackEmits` | Свойства и события `DiagramStack` |
| `Readout`, `ReadoutQuantity`, `SidedValue`, `StackReadout` | Данные событий |
| `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `StackRow` | Названия слоёв, результатов, режимов подписей, подписей реакций и рядов |
| `Units`, `Unit`, `UnitKind` | Единицы отображения: `{ symbol, scale }` для каждого вида |
| `PlotColors` | Цвета по тонам |
| `PlotModel` | Простая модель: [Модель рисунка](/ru/plot/model) |

Остальные экспорты, в том числе `structureSvg` для SVG-файлов и функции, на которых построено рисование, описаны на странице [Функции](/ru/plot/functions).
