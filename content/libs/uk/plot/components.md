---
title: API компонентів
description: "Усі пропси й події StructurePlot і DiagramStack в @edubeam/plot 0.2.0 з типами та типовими значеннями, плагін EduBeamPlot і експортовані типи пропсів."
order: 8
group: Довідник API
source: site
---

# API компонентів

Пропси й події обох компонентів, як їх оголошено в @edubeam/plot 0.2.0. Слотів не має жоден. Значення в одиницях СІ позначено окремо; розміри задано в пікселях CSS.

## StructurePlot {#structureplot}

```ts
import { StructurePlot } from '@edubeam/plot'
```

Малює плоску конструкцію та її результати. Посібник: [StructurePlot](/uk/plot/structure-plot).

### Пропси {#props}

| Проп | Тип | Типово | Опис |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Розв’язувач @edubeam/fem. Результати малюються, щойно його випадок навантаження розраховано. |
| `model` | `PlotModel` | – | Або звичайні дані, які створює [`modelFromSolver`](/uk/plot/model). Має перевагу над `solver`. |
| `loadCase` | `number` | `0` | Індекс у `solver.loadCases` |
| `revision` | `number` | `0` | Змініть його, щоб перемалювати розв’язувач, змінений на місці |
| `layers` | `readonly PlotLayer[]` | стрижні, опори, навантаження, реакції та один результат | Що малювати: `'nodes'`, `'nodeLabels'`, `'dimensions'`, `'members'`, `'supports'`, `'loads'`, `'reactions'`, `'N'`, `'V'`, `'M'`, `'w'` |
| `reserve` | `readonly PlotLayer[]` | `layers` | Шари, для яких треба залишити місце, поки вони приховані |
| `compact` | `boolean` | `false` | Рисунок-мініатюра: менші символи, щонайбільше два значення на стрижень |
| `units` | `Partial<Units>` | `KN_UNITS` | Одиниці відображення |
| `numberFormat` | `Intl.NumberFormat` | англійський, щонайбільше 1 десятковий знак | Форматує всі числа |
| `colors` | `Partial<PlotColors>` | – | Зміна кольорів за тонами: [Теми та кольори](/uk/plot/theming#the-colors-prop) |
| `width` | `number` | `640`, compact `400` | Ширина, доки контейнер не виміряно, наприклад на сервері |
| `height` | `number` | – | Фіксована висота. Без неї висота залежить від рисунка. |
| `maxHeight` | `number` | `max(320, 0.75 × width)`, compact без обмеження | Верхня межа автоматичної висоти |
| `padding` | `number` | `6` | Відступ навколо рисунка |
| `fontSize` | `number` | `13`, compact `11.5` | Розмір тексту |
| `diagramSize` | `number` | `48`, compact `26` | Довжина найбільшої ординати епюри |
| `deformedSize` | `number` | `30`, compact `18` | Найбільше переміщення на деформованій схемі |
| `diagramScale` | `Partial<Record<ResultLayer, number>>` | – | Фіксований масштаб результату в px на одиницю СІ; замінює `diagramSize` чи `deformedSize` |
| `momentOnTensionSide` | `boolean` | `true` | M з боку розтягнутих волокон; `false` — з боку стиснутих |
| `resultLabelMode` | `'horizontal' \| 'axis'` | `'horizontal'` | Значення горизонтально або повернуті вздовж ординати |
| `reactionLabels` | `'values' \| 'names'` | `'values'` | Реакції так, як вони діють, з величиною; або, для вправи, кожен закріплений напрямок з назвою (*A<sub>x</sub>*, *M<sub>A</sub>*), спрямований у бік, що вважається додатним. Для назв результати не потрібні: [Реакції як невідомі](/uk/plot/structure-plot#reactions-as-unknowns) |
| `reserveLabelModes` | `readonly ResultLabelMode[]` | – | Режими підписів, для яких треба залишити місце, крім поточного |
| `reserveReactionLabels` | `readonly ReactionLabels[]` | – | Стилі підписів реакцій, для яких треба залишити місце, крім `reactionLabels`, щоб рисунок вправи, яка перетворюється на свій розв’язок, лишався нерухомим |
| `animate` | `boolean` | `true` | Плавна поява шарів і прокреслювання стрижнів. За `prefers-reduced-motion` завжди вимкнено. |
| `hover` | `boolean` | `false` | Зчитування значень під курсором, позначених на кінці ординати кожної епюри. Якщо вимкнено, рисунок взагалі не реагує на вказівник. |
| `title` | `string` | опис того, що показано | Доступна назва рисунка |

Якщо `layers` не задано, результатом буде `M` для балок і рам, `N` для ферми й `w`, коли жоден стрижень не зазнає зусиль (`defaultResultLayer`).

### Події {#events}

| Подія | Дані | Коли |
| --- | --- | --- |
| `readout` | `Readout \| null` | З `hover`: точка стрижня під курсором і результати в ній; `null`, коли курсор залишає рисунок |

```ts
interface Readout {
  readonly member: string
  readonly x: number // m від початкового вузла стрижня
  readonly px: number // точка на екрані, px
  readonly py: number
  readonly values: Readonly<Record<'N' | 'V' | 'M' | 'w', SidedValue>> // одиниці СІ
  readonly u: number // переміщення вздовж локальної осі x стрижня, m
}
interface SidedValue {
  readonly left: number
  readonly right: number // дорівнює left там, де результат неперервний
}
```

## DiagramStack {#diagramstack}

```ts
import { DiagramStack } from '@edubeam/plot'
```

Малює пряму балку над її епюрами на спільній осі x. Стрижні мають утворювати одну горизонтальну лінію, накреслену зліва направо; для всього іншого компонент видає помилку. Посібник: [DiagramStack](/uk/plot/diagram-stack).

### Пропси {#props-1}

| Проп | Тип | Типово | Опис |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Розрахована балка |
| `model` | `PlotModel` | – | Або звичайні дані з `modelFromSolver`; має перевагу |
| `loadCase` | `number` | `0` | Індекс у `solver.loadCases` |
| `revision` | `number` | `0` | Змініть його, щоб перемалювати розв’язувач, змінений на місці |
| `members` | `readonly string[]` | усі стрижні | Стрижні, що утворюють балку |
| `rows` | `readonly StackRow[]` | `['V', 'M', 'w']` | Рядки епюр згори вниз, із `'N'`, `'V'`, `'M'`, `'w'` |
| `loadRow` | `boolean` | `true` | Балка з опорами, навантаженням і реакціями над рядками |
| `ranges` | `Partial<Record<StackRow, readonly [number, number]>>` | власний для кожного рядка | Діапазон значень для кожного рядка, одиниці СІ |
| `rowHeights` | `Partial<Record<StackRow, number>>` | N 100, V 116, M 128, w 76; за ширини менше ніж 560 px 88, 96, 104, 64 | Висоти рядків до масштабування за `maxHeight` |
| `maxHeight` | `number` | – | Рядки зменшуються, щонайбільше до 60 %, щоб рисунок умістився. Текст зберігає розмір. |
| `units` | `Partial<Units>` | `KN_UNITS` | Одиниці відображення |
| `numberFormat` | `Intl.NumberFormat` | англійський, щонайбільше 1 десятковий знак | Форматує всі числа |
| `colors` | `Partial<PlotColors>` | – | Зміна кольорів |
| `width` | `number` | `720` | Ширина, доки контейнер не виміряно; використовується щонайменше 320 |
| `fontSize` | `number` | `12.5` | Розмір тексту |
| `hover` | `boolean` | `true` | Курсор для зчитування. Якщо вимкнено, рисунок не реагує на вказівник. |
| `loadAt` | `number` | – | Положення (m уздовж лінії) зосередженої сили, яку читач може перетягувати; використовуйте з `v-model:load-at` |
| `loadLabel` | `string` | `P = …` з величиною сили | Текст біля сили, яку можна перетягувати |
| `loadStep` | `number` | `0.05` | Крок, до якого округлюється перетягування, m; на цей крок силу зсувають клавіші зі стрілками |
| `title` | `string` | опис рядків | Доступна назва рисунка |

### Події {#events-1}

| Подія | Дані | Коли |
| --- | --- | --- |
| `update:loadAt` | `number` | Читач перемістив силу: її нове положення, m. Забезпечує роботу `v-model:load-at`. |
| `readout` | `StackReadout \| null` | Значення під курсором у всіх рядках; `null`, коли вказівник залишає рисунок |

```ts
interface StackReadout {
  readonly x: number // m уздовж лінії балки
  readonly values: Partial<Record<'N' | 'V' | 'M' | 'w', { readonly left: number; readonly right: number }>> // СІ
}
```

## Плагін {#the-plugin}

```ts
import { EduBeamPlot } from '@edubeam/plot'

app.use(EduBeamPlot) // глобально реєструє <StructurePlot> і <DiagramStack>
```

Він необов’язковий: іменований імпорт компонентів дає меншу збірку, а бандлер вилучає плагін зі збірки, яка його не використовує.

## Типи {#types}

Для типізованих обгорток навколо компонентів пакет експортує їхні пропси й події:

```ts
import type { PlotLayer, StructurePlotProps } from '@edubeam/plot'

const figure: StructurePlotProps = { layers: ['members', 'supports', 'M'] satisfies PlotLayer[], compact: true }
```

| Тип | Що це |
| --- | --- |
| `StructurePlotProps`, `StructurePlotEmits` | Пропси й події `StructurePlot` |
| `DiagramStackProps`, `DiagramStackEmits` | Пропси й події `DiagramStack` |
| `Readout`, `ReadoutQuantity`, `SidedValue`, `StackReadout` | Дані подій |
| `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `StackRow` | Назви шарів, результатів, режимів підписів, підписів реакцій і рядків |
| `Units`, `Unit`, `UnitKind` | Одиниці відображення: `{ symbol, scale }` для кожного виду |
| `PlotColors` | Кольори за тонами |
| `PlotModel` | Звичайна модель: [Модель рисунка](/uk/plot/model) |

Решту експортів, серед них `structureSvg` для файлів SVG і функції, на яких побудовано малювання, описано на сторінці [Функції](/uk/plot/functions).
