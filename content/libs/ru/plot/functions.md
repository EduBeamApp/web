---
title: Функции
description: "Все функции, константы и типы @edubeam/plot 0.2.0, кроме компонентов: structureSvg для SVG-файлов, точное считывание результатов, единицы, балочные линии и компоновка."
order: 10
source: site
---

# Функции

Всё, что рисуют компоненты, получается из чистых функций без Vue. Они записывают рисунок в SVG-файл, точно считывают результаты, заранее готовят данные и строят ваши собственные рисунки. Именованные импорты сохраняют сборку маленькой: страница, которая импортирует только `modelFromSolver`, вообще не получает кода компонентов.

Все значения даны в СИ, если не указана другая единица; положения вдоль стержня отсчитываются в метрах от его начального узла.

## Отдельный SVG-файл {#a-standalone-svg-file}

Рисунок на странице берёт цвета из CSS-переменных страницы, поэтому скопированный из неё `<svg>` остаётся без цветов. `structureSvg` вместо этого записывает рисунок как текст отдельного файла `.svg`: фиксированные цвета, без таблиц стилей и скриптов, с компоновкой по тому же алгоритму, что и у `StructurePlot`. Word, PowerPoint, Inkscape, CairoSVG и инструменты LaTeX отображают его так же, как страница.

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts' // () => рассчитанный LinearStaticSolver, как на странице «Слайды и конспекты»

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![П-образная рама в виде отдельного SVG-файла, отрисованного CairoSVG: нагрузки, реакции 20 и 40 вверх и 2,3 и 12,7 по горизонтали и эпюра изгибающих моментов от −50,7 в узле C до 29,3 на ригеле](/screenshots/ru/p2p-plot-frame-svg.webp){.shot-lg}

| Параметр | По умолчанию | Что делает |
| --- | --- | --- |
| `layers` | стержни, опоры, нагрузки, реакции и результат, который выбрал бы `StructurePlot` | Что рисовать |
| `width` | `640` | Ширина в px, в пользовательских единицах SVG |
| `height` | по размеру изображения | Фиксированная высота, px |
| `maxHeight` | max(320, 0.75 × width) | Верхняя граница автоматической высоты |
| `padding` | `6` | Отступ вокруг изображения, px |
| `fontSize` | `13`, compact `11.5` | Размер текста, px |
| `fontFamily` | `Helvetica, Arial, sans-serif` | Набор шрифтов, которые есть у программы, открывающей файл |
| `colors` | `PRINT_COLORS` | Любые тона в виде фиксированных цветов |
| `background` | `true` | Заливает фон цветом `paper`; `false` оставляет его прозрачным |
| `title` | нет | Записывается в `<title>` SVG |
| `reserve`, `reserveLabelModes`, `reserveReactionLabels` | нет | Слои, стили подписей и стили подписей реакций, для которых нужно оставить место помимо нарисованных, чтобы файлы пошагового рисунка совпадали: [Пошаговый рисунок в Beamer](/ru/plot/slides#a-build-up-in-beamer) |
| `units`, `numberFormat`, `compact`, `diagramSize`, `deformedSize`, `momentOnTensionSide`, `resultLabelMode`, `reactionLabels` | как у `StructurePlot` | То же, что одноимённые свойства компонента |

`PRINT_COLORS` — это цвета приложения EduBeam на белом фоне: линии (ink) `#16182b`, продольная сила `#2222ff`, поперечная сила `#00af00`, изгибающий момент `#ff2222`, нагрузки `#ff8700`, реакции `#a020f0`. Каждая подпись записывается дважды — под текстом лежит ореол цвета фона, потому что не все программы для SVG понимают `paint-order`, — а нижний индекс, как в обозначениях реакций *A<sub>x</sub>*, — это `tspan` с простыми числовыми смещениями, которые понимают Word и Inkscape. Без `reserve` файл подгоняется под слои, которые в нём нарисованы.

Как использовать файл:

- **Word и PowerPoint** (2019 и Microsoft 365): *Вставка › Рисунки*.
- **LaTeX**: преобразуйте файл в PDF с помощью [CairoSVG](https://cairosvg.org) (`cairosvg frame.svg -o frame.pdf`) или Inkscape, затем вставьте его через `\includegraphics`; или используйте `\includesvg` из пакета `svg`, который сам вызывает Inkscape. При ширине 640 единиц рисунок, вписанный в текстовую колонку шириной 16 см, имеет подписи размером 9 пт.
- **Веб-страница без Vue**: вставьте текст в HTML. См. [Без Vue](/ru/plot/embedding#plain-html-from-node).

На странице [Упражнения и контрольные работы](/ru/plot/exercises#figures-for-latex-and-word) такие файлы записываются для упражнения и ответов каждого студента.

## Из решателя {#from-a-solver}

| Экспорт | Сигнатура | Что делает |
| --- | --- | --- |
| `modelFromSolver` | `(solver: Solver, options?: FromSolverOptions) => PlotModel` | Переводит решатель в простую [модель рисунка](/ru/plot/model); результаты — только для рассчитанного случая нагружения |
| `FromSolverOptions` | тип | `{ loadCase?: number }`, индекс в `solver.loadCases` |

## Кусочные полиномы {#piecewise-polynomials}

Результаты для стержня — значения типа `Piecewise`: списки участков `{ x0, x1, c }`, описанные на странице [Модель рисунка](/ru/plot/model#piecewise-polynomials). `side` выбирает значение непосредственно перед (`'left'`) или сразу после (`'right'`, по умолчанию) точки, где сходятся два участка.

| Экспорт | Сигнатура | Что делает |
| --- | --- | --- |
| `valueAt` | `(pw, x, side?) => number` | Значение в точке `x`; за концами — значение на ближайшем конце |
| `slopeAt` | `(pw, x, side?) => number` | Производная, в единицах значения на метр |
| `extremes` | `(pw) => { max: Extreme; min: Extreme } \| null` | Точные наибольшее и наименьшее значения, каждое в виде `{ x, value, side }` |
| `maxAbs` | `(pw) => number` | Наибольшее значение по модулю |
| `innerBreaks` | `(pw) => number[]` | Точки стыка участков, без двух концов |
| `isZero` | `(pw) => boolean` | Равен ли результат нулю по всей длине |
| `evalPiece` | `(piece, x) => number` | Значение на одном участке |
| `evalPieceSlope` | `(piece, x) => number` | Наклон на одном участке |
| `pieceExtrema` | `(piece) => number[]` | Точки, где наклон участка равен нулю, м |
| `pieceDegree` | `(piece) => number \| null` | Степень полинома участка; `null`, если он нулевой |
| `cleanPiecewise` | `(pw, tolerance) => Piecewise` | Отбрасывает коэффициенты меньше `tolerance` — погрешность округления рассчитанной модели |
| `fitPiece` | `(f, x0, x1, degree) => Piece` | Полином заданной степени, проходящий через функцию на `(x0, x1)` |
| `pieceToBeziers` | `(piece, segments?) => CubicSegment[]` | Участок в виде кубических кривых Безье в координатах (x, значение): точно для полиномов до третьей степени, иначе — `segments` кривых, по умолчанию 4 |

Типы: `Piece`, `Piecewise`, `Side` (`'left' \| 'right'`), `Extreme`, `CubicSegment`.

## Единицы и числа {#units-and-numbers}

| Экспорт | Сигнатура | Что делает |
| --- | --- | --- |
| `KN_UNITS` | `Units` | kN, kNm, kN/m, m, mm, mrad, K: по умолчанию |
| `SI_UNITS` | `Units` | N, N·m, N/m, m, m, rad, K |
| `resolveUnits` | `(units?: Partial<Units>) => Units` | `KN_UNITS` с вашими заменами |
| `DEFAULT_NUMBER_FORMAT` | `Intl.NumberFormat` | Английский формат, не больше одного знака после запятой |
| `formatNumber` | `(value, format?) => string` | Число с настоящим знаком минуса, никогда не −0 |
| `formatQuantity` | `(si, unit, format?) => string` | `"36 kN"`: значение в СИ, пересчитанное в единицу и отделённое от неё узким неразрывным пробелом |

`Unit` — это `{ symbol, scale }`, отображаемое значение = значение в СИ × `scale`. В `Units` есть по единице на каждый `UnitKind`: `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` и `temperature`.

```ts
import { formatQuantity, KN_UNITS } from '@edubeam/plot'

formatQuantity(-37500, KN_UNITS.moment) // "−37.5 kNm"
```

## Считывание значений {#reading-values}

| Экспорт | Сигнатура | Что делает |
| --- | --- | --- |
| `readMember` | `(results: MemberResults, x, snap?) => { x, u, values }` | N, V, M и w в точке `x`, каждое в виде `{ left, right }`, и продольное перемещение `u`; притягивается к скачку, если он ближе `snap` м |
| `readoutAt` | `(model, transform, px, py, reach) => Readout \| null` | Ближайший к точке экрана стержень в пределах `reach` px и его результаты в этом месте |
| `readoutMarks` | `(model, transform, readout, shown, k, side) => ReadoutMark[]` | Где рисуются считанные значения: конец ординаты каждой видимой эпюры (в месте скачка — оба), точка на деформированной схеме |
| `formatReadout` | `(readout, quantity, units, format?) => string` | `"M = 54 kNm"` или, в месте скачка, `"V = 13.3 → −6.7 kN"` |

`k` — пиксели на единицу СИ для каждого результата, `side` — сторона, с которой рисуется каждая эпюра; их дают `diagramScales` и `diagramSide`, описанные ниже. Типы: `Readout`, `ReadoutMark` (`{ tone, from, to }` в px), `ReadoutQuantity` (`'N' \| 'V' \| 'M' \| 'w'`), `SidedValue`.

## Балочные линии {#beam-lines}

Составные части [DiagramStack](/ru/plot/diagram-stack) — для собственного рисунка с эпюрами одна под другой.

| Экспорт | Сигнатура | Что делает |
| --- | --- | --- |
| `beamLine` | `(model, ids?) => BeamLine` | Стержни как одна горизонтальная линия слева направо; в остальных случаях выбрасывает исключение |
| `lineDiagram` | `(model, line, row) => Piecewise` | Один результат вдоль всей линии, в координате x линии |
| `rowRange` | `(pw) => [number, number]` | Диапазон, по которому масштабируется ряд; всегда включает ноль |
| `rowPeaks` | `(pw) => RowPeak[]` | Экстремумы, которые стоит подписать в ряду |
| `rowBreaks` | `(pw) => number[]` | Где у результата излом или скачок: опоры, стыки стержней и сосредоточенные силы |
| `rowOutline` | `(pw, sx, sy, close) => string` | Данные SVG-пути для контура ряда по заданным преобразованиям метров и значений в px |
| `rowOrdinates` | `(pw, sx, sy, spacing) => string` | Данные SVG-пути для штриховых ординат с шагом `spacing` px |
| `lineModel` | `(model, line, omit?) => PlotModel` | Модель, урезанная до линии, при необходимости без одной нагрузки |
| `pointLoadAt` | `(model, line, at) => PlotLoad \| undefined` | Сосредоточенная сила в точке линии `at` |

Типы: `BeamLine`, `LineMember`, `RowPeak`, `StackRow`.

На странице [DiagramStack](/ru/plot/diagram-stack#a-load-the-reader-can-drag) с помощью `beamLine`, `lineDiagram` и `rowRange` масштаб каждого ряда сохраняется при всех положениях подвижной нагрузки.

## Геометрия и опоры {#geometry-and-supports}

| Экспорт | Сигнатура | Что делает |
| --- | --- | --- |
| `nodeMap` | `(model) => ReadonlyMap<string, PlotNode>` | Узлы по идентификатору |
| `memberFrame` | `(model, member, nodes?) => MemberFrame` | Начало стержня, единичные векторы касательной и локальной оси z и длина |
| `memberFrames` | `(model) => Map<string, MemberFrame>` | То же для всех стержней, по идентификатору |
| `pointAlong` | `(frame, at) => { x, z }` | Точка на расстоянии `at` метров вдоль стержня |
| `supportKind` | `(fixity) => SupportKind` | `'fixed'`, `'pin'`, `'roller'`, `'slider'`, `'rotation'` или `'none'` |
| `supportPlacement` | `(model, node) => SupportPlacement` | Условное обозначение для узла и его поворот по часовой стрелке, градусы |
| `supportGlyph` | `(kind) => readonly GlyphPart[]` | Линии условного обозначения, в px |
| `glyphReach` | `(kind, rotation, x, z) => number` | Насколько далеко повёрнутое обозначение выступает в заданном направлении, px |

## Рисование {#drawing}

Рисование проходит в три этапа. `buildStructureScene` превращает модель в элементы сцены: точки модели со смещениями в экранных пикселях. `fitScene` подбирает масштаб и сдвиг, при которых они помещаются в контейнер. `resolveScene` превращает их в данные SVG-путей, окружности и те подписи, для которых нашлось место. `layoutStructure` выполняет все три этапа так же, как `StructurePlot` и `structureSvg`, поэтому ваш собственный рисунок компонуется так же, как их рисунки.

| Экспорт | Сигнатура | Что делает |
| --- | --- | --- |
| `layoutStructure` | `(model, options, box, shown?, labelModes?) => StructureLayout` | Вся компоновка: вписать со всеми подписями, убрать подписи, которым тесно, вписать снова. Возвращает `{ fit, items, resolved }` |
| `structureSvg` | `(model, options?) => string` | Отдельный файл `.svg`: см. [выше](#a-standalone-svg-file) |
| `buildStructureScene` | `(model, options: StructureSceneOptions) => SceneItem[]` | Изображение выбранных слоёв в заданном масштабе, px на метр |
| `fitScene` | `(items, box: FitBox) => Fit` | Масштаб и сдвиг, чтобы вписать сцену в контейнер `{ width, height?, maxHeight?, padding, fontSize }` |
| `resolveScene` | `(items, transform, options: ResolveOptions) => ResolvedScene` | `{ paths, circles, texts }` в px, с подписями, которые помещаются |
| `placeLabels` | `(items, transform, options: ResolveOptions) => Map<SceneText, SceneText>` | Какие подписи оставить и где |
| `alternativeResultGroups` | `(shown) => ReadonlySet<string>` | Слои результатов, которые показываются по одному: их подписи уступают место остальным, но не друг другу |
| `sceneBounds` | `(items, scale, fontSize) => Bounds` | Границы сцены, px |
| `project` | `(transform, anchor) => [number, number]` | Точка сцены на экране, px |
| `defaultResultLayer` | `(model) => ResultLayer \| null` | Результат, который рисунок показывает, если ничего не задано |
| `diagramScales` | `(model, options) => Record<ResultLayer, number>` | Пиксели на единицу СИ для каждого результата |
| `diagramSide` | `(q, momentOnTensionSide) => 1 \| -1` | С какой стороны стержня откладывается положительное значение |
| `isBarStructure` | `(model, memberResults) => boolean` | Записывается ли N числами вдоль стержней (ферма), а не рисуется эпюрой |
| `tipPlacements` | `(tip, out, mode, gaps?) => TextPlacement[]` | Возможные положения значения за концом ординаты |
| `PLOT_LAYERS` | `readonly PlotLayer[]` | Все слои в порядке рисования |
| `RESULT_LAYERS` | `['N', 'V', 'M', 'w']` | Слои результатов |
| `HATCH_SPACING_PX` | `7` | Шаг штриховых ординат эпюр, px |
| `DEFAULT_COLORS` | `PlotColors` | Цвет каждого тона по умолчанию, в виде CSS: [Темы и цвета](/ru/plot/theming) |
| `PRINT_COLORS` | `Record<Tone \| 'paper', string>` | Фиксированные цвета для файла — цвета приложения на белом фоне |
| `toneVars` | `(colors?) => Record<string, string>` | CSS-переменные, которые рисунок задаёт на своём корневом элементе |
| `PLOT_CSS` | `string` | CSS-правила, встроенные в каждый рисунок |

`ResolveOptions` — это `{ fontSize, viewport?, exclude?, alternativeGroups?, shields? }`: `shields` — группы, на линии которых нельзя ставить подписи (показанные эпюры); если параметр не задан — все группы. В `layoutStructure` `options.layers` — слои, которые нужно разместить (всё, что может быть показано, как в `reserve`), `shown` — показанные слои, а `labelModes` — стили подписей, для которых нужно оставить место.

Типы: `StructureSceneOptions`, `StructureLayout`, `StructureSvgOptions`, `SceneItem`, `SceneText`, `TextPlacement`, `ResolvedScene`, `ResolvedPath`, `ResolvedText`, `ResolvedCircle`, `ResolveOptions`, `Bounds`, `Anchor`, `Transform`, `Fit`, `FitBox`, `Tone`, `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `SupportKind`, `SupportPlacement`, `GlyphPart` и типы модели со страницы [Модель рисунка](/ru/plot/model).
