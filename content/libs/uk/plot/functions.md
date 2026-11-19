---
title: Функції
description: "Функції, константи й типи @edubeam/plot 0.2.0: structureSvg для файлів SVG, точне зчитування результатів, одиниці, лінії балок і компонування рисунків."
order: 10
source: site
---

# Функції

Усе, що малюють компоненти, береться з чистих функцій, у яких немає Vue. Вони записують рисунок як файл SVG, точно зчитують результати, заздалегідь готують дані й дають змогу будувати власні рисунки. Іменовані імпорти зберігають бандл малим: сторінка, яка імпортує лише `modelFromSolver`, не отримує жодного коду компонентів.

Усі значення задано в СІ, якщо не вказано іншої одиниці; положення вздовж стрижня — це метри від його початкового вузла.

## Окремий файл SVG {#a-standalone-svg-file}

Рисунок на сторінці бере кольори з CSS-змінних сторінки, тож `<svg>`, скопійований звідти, кольорів не має. Натомість `structureSvg` записує рисунок як текст окремого файлу `.svg`: звичайні кольори, без файлу стилів і без скриптів, а компонування — тією самою процедурою, що й у `StructurePlot`. Word, PowerPoint, Inkscape, CairoSVG та інструменти LaTeX відображають його так само, як сторінка.

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts' // () => розрахований LinearStaticSolver, як на сторінці «Слайди та конспекти»

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![П-подібна рама як окремий файл SVG, відрендерений CairoSVG: навантаження, реакції 20 і 40 угору та 2,3 і 12,7 горизонтально, епюра згинальних моментів від −50,7 у вузлі C до 29,3 на ригелі](/screenshots/uk/p2p-plot-frame-svg.webp){.shot-lg}

| Параметр | Типово | Що робить |
| --- | --- | --- |
| `layers` | стрижні, опори, навантаження, реакції та результат, який вибрав би `StructurePlot` | Що малювати |
| `width` | `640` | Ширина в px, тобто в користувацьких одиницях SVG |
| `height` | за рисунком | Фіксована висота, px |
| `maxHeight` | max(320, 0.75 × width) | Верхня межа автоматичної висоти |
| `padding` | `6` | Відступ навколо рисунка, px |
| `fontSize` | `13`, compact `11.5` | Розмір тексту, px |
| `fontFamily` | `Helvetica, Arial, sans-serif` | Набір шрифтів, який є в програмі, що відкриває файл |
| `colors` | `PRINT_COLORS` | Будь-які тони як звичайні кольори |
| `background` | `true` | Заливає тло кольором `paper`; `false` залишає його прозорим |
| `title` | немає | Записується як `<title>` SVG |
| `reserve`, `reserveLabelModes`, `reserveReactionLabels` | немає | Шари, стилі підписів і стилі підписів реакцій, для яких треба залишити місце, крім намальованих, щоб файли поетапного рисунка збігалися: [Поетапний рисунок у Beamer](/uk/plot/slides#a-build-up-in-beamer) |
| `units`, `numberFormat`, `compact`, `diagramSize`, `deformedSize`, `momentOnTensionSide`, `resultLabelMode`, `reactionLabels` | як у `StructurePlot` | Те саме значення, що й однойменні пропси компонента |

`PRINT_COLORS` — це кольори застосунку EduBeam на білому тлі: основний колір `#16182b`, поздовжня сила `#2222ff`, поперечна сила `#00af00`, згинальний момент `#ff2222`, навантаження `#ff8700`, реакції `#a020f0`. Кожен підпис записано двічі (під текстом лежить його ореол кольору тла), бо не кожна програма для SVG розуміє `paint-order`, а нижній індекс, як у назвах реакцій *A<sub>x</sub>*, — це `tspan` зі звичайними числами, які читають Word та Inkscape. Без `reserve` файл підганяється під шари, які він малює.

Як використати файл:

- **Word і PowerPoint** (2019 і Microsoft 365): *Вставлення › Зображення*.
- **LaTeX**: перетворіть його на PDF за допомогою [CairoSVG](https://cairosvg.org) (`cairosvg frame.svg -o frame.pdf`) або Inkscape, а потім використайте `\includegraphics`; або скористайтеся `\includesvg` з пакета `svg`, який сам викликає Inkscape. За ширини 640 одиниць рисунок, вписаний у текстовий стовпець 16 cm, має підписи розміром 9 pt.
- **Вебсторінка без Vue**: вставте текст у HTML. Див. [Без Vue](/uk/plot/embedding#plain-html-from-node).

Як записати файл із вправою та відповідями для кожного студента, показано на сторінці [Вправи та контрольні роботи](/uk/plot/exercises#figures-for-latex-and-word).

## З розв’язувача {#from-a-solver}

| Експорт | Сигнатура | Що робить |
| --- | --- | --- |
| `modelFromSolver` | `(solver: Solver, options?: FromSolverOptions) => PlotModel` | Зчитує розв’язувач у звичайну [модель рисунка](/uk/plot/model); результати — лише для розрахованого випадку навантаження |
| `FromSolverOptions` | тип | `{ loadCase?: number }`, індекс у `solver.loadCases` |

## Кусково-поліноміальні функції {#piecewise-polynomials}

Результати стрижня — це значення `Piecewise`: списки ділянок `{ x0, x1, c }`, описані на сторінці [Модель рисунка](/uk/plot/model#piecewise-polynomials). `side` вибирає значення безпосередньо перед (`'left'`) або одразу за (`'right'`, типово) точкою, де стикуються дві ділянки.

| Експорт | Сигнатура | Що робить |
| --- | --- | --- |
| `valueAt` | `(pw, x, side?) => number` | Значення в точці `x`; за межами кінців — значення на найближчому кінці |
| `slopeAt` | `(pw, x, side?) => number` | Похідна, одиниці значення на метр |
| `extremes` | `(pw) => { max: Extreme; min: Extreme } \| null` | Найбільше й найменше значення, точно, кожне як `{ x, value, side }` |
| `maxAbs` | `(pw) => number` | Найбільше значення за модулем |
| `innerBreaks` | `(pw) => number[]` | Місця, де стикуються ділянки, без двох кінців |
| `isZero` | `(pw) => boolean` | Чи дорівнює результат нулю всюди |
| `evalPiece` | `(piece, x) => number` | Значення однієї ділянки |
| `evalPieceSlope` | `(piece, x) => number` | Похідна однієї ділянки |
| `pieceExtrema` | `(piece) => number[]` | Місця, де похідна ділянки дорівнює нулю, m |
| `pieceDegree` | `(piece) => number \| null` | Степінь полінома ділянки; `null`, коли вона нульова |
| `cleanPiecewise` | `(pw, tolerance) => Piecewise` | Відкидає коефіцієнти, менші за `tolerance`, тобто похибки округлення розрахованої моделі |
| `fitPiece` | `(f, x0, x1, degree) => Piece` | Поліном заданого степеня, що проходить через функцію на `(x0, x1)` |
| `pieceToBeziers` | `(piece, segments?) => CubicSegment[]` | Ділянка як кубічні криві Безьє в координатах (x, значення): точно до кубічних поліномів включно, інакше `segments` кривих, типово 4 |

Типи: `Piece`, `Piecewise`, `Side` (`'left' \| 'right'`), `Extreme`, `CubicSegment`.

## Одиниці та числа {#units-and-numbers}

| Експорт | Сигнатура | Що робить |
| --- | --- | --- |
| `KN_UNITS` | `Units` | kN, kNm, kN/m, m, mm, mrad, K: типові |
| `SI_UNITS` | `Units` | N, N·m, N/m, m, m, rad, K |
| `resolveUnits` | `(units?: Partial<Units>) => Units` | `KN_UNITS` з вашими змінами |
| `DEFAULT_NUMBER_FORMAT` | `Intl.NumberFormat` | Англійський, щонайбільше один десятковий знак |
| `formatNumber` | `(value, format?) => string` | Число зі справжнім знаком мінус, ніколи не −0 |
| `formatQuantity` | `(si, unit, format?) => string` | `"36 kN"`: значення в СІ, перераховане в одиницю, з вузьким нерозривним пробілом |

`Unit` — це `{ symbol, scale }`, значення для відображення = значення в СІ × `scale`. `Units` містить по одиниці для кожного `UnitKind`: `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` і `temperature`.

```ts
import { formatQuantity, KN_UNITS } from '@edubeam/plot'

formatQuantity(-37500, KN_UNITS.moment) // "−37.5 kNm"
```

## Зчитування значень {#reading-values}

| Експорт | Сигнатура | Що робить |
| --- | --- | --- |
| `readMember` | `(results: MemberResults, x, snap?) => { x, u, values }` | N, V, M і w у точці `x`, кожне як `{ left, right }`, та осьове переміщення `u`; прив’язується до стрибка в межах `snap` m |
| `readoutAt` | `(model, transform, px, py, reach) => Readout \| null` | Стрижень, найближчий до точки на екрані в межах `reach` px, і його результати в цьому місці |
| `readoutMarks` | `(model, transform, readout, shown, k, side) => ReadoutMark[]` | Де намальовано зчитані значення: кінець ординати кожної показаної епюри (у місці стрибка — обидва), точка на деформованій схемі |
| `formatReadout` | `(readout, quantity, units, format?) => string` | `"M = 54 kNm"` або `"V = 13.3 → −6.7 kN"` у місці стрибка |

`k` — це px на одиницю СІ для кожного результату, а `side` — бік, з якого малюється кожна епюра; обидва дають `diagramScales` і `diagramSide`, описані нижче. Типи: `Readout`, `ReadoutMark` (`{ tone, from, to }` у px), `ReadoutQuantity` (`'N' \| 'V' \| 'M' \| 'w'`), `SidedValue`.

## Лінії балок {#beam-lines}

Складники [DiagramStack](/uk/plot/diagram-stack), з яких можна побудувати власний рисунок з епюрами під балкою.

| Експорт | Сигнатура | Що робить |
| --- | --- | --- |
| `beamLine` | `(model, ids?) => BeamLine` | Стрижні як одна горизонтальна лінія зліва направо; для всього іншого видає помилку |
| `lineDiagram` | `(model, line, row) => Piecewise` | Один результат уздовж усієї лінії, у координаті x лінії |
| `rowRange` | `(pw) => [number, number]` | Діапазон, за яким масштабується рядок; завжди містить нуль |
| `rowPeaks` | `(pw) => RowPeak[]` | Екстремуми, які варто підписати в рядку |
| `rowBreaks` | `(pw) => number[]` | Місця, де результат має стрибок чи злам: опори, вузли й зосереджені сили |
| `rowOutline` | `(pw, sx, sy, close) => string` | Дані шляху SVG для контуру рядка за заданими перетвореннями з m і значення в px |
| `rowOrdinates` | `(pw, sx, sy, spacing) => string` | Дані шляху SVG для ординат штрихування з кроком `spacing` px |
| `lineModel` | `(model, line, omit?) => PlotModel` | Модель, обрізана до лінії, за бажанням без одного навантаження |
| `pointLoadAt` | `(model, line, at) => PlotLoad \| undefined` | Зосереджена сила в положенні `at` на лінії |

Типи: `BeamLine`, `LineMember`, `RowPeak`, `StackRow`.

Сторінка [DiagramStack](/uk/plot/diagram-stack#a-load-the-reader-can-drag) використовує `beamLine`, `lineDiagram` і `rowRange`, щоб зберегти масштаб кожного рядка для всіх положень рухомої сили.

## Геометрія та опори {#geometry-and-supports}

| Експорт | Сигнатура | Що робить |
| --- | --- | --- |
| `nodeMap` | `(model) => ReadonlyMap<string, PlotNode>` | Вузли за ідентифікатором |
| `memberFrame` | `(model, member, nodes?) => MemberFrame` | Початок стрижня, одиничний дотичний вектор, одиничний вектор локальної осі z і довжина |
| `memberFrames` | `(model) => Map<string, MemberFrame>` | Те саме для кожного стрижня, за ідентифікатором |
| `pointAlong` | `(frame, at) => { x, z }` | Точка на відстані `at` метрів уздовж стрижня |
| `supportKind` | `(fixity) => SupportKind` | `'fixed'`, `'pin'`, `'roller'`, `'slider'`, `'rotation'` або `'none'` |
| `supportPlacement` | `(model, node) => SupportPlacement` | Символ для вузла та його поворот за годинниковою стрілкою, градуси |
| `supportGlyph` | `(kind) => readonly GlyphPart[]` | Лінії символу, у px |
| `glyphReach` | `(kind, rotation, x, z) => number` | Наскільки далеко сягає повернутий символ у заданому напрямку, px |

## Малювання {#drawing}

Малювання відбувається в три кроки. `buildStructureScene` перетворює модель на елементи сцени: точки моделі зі зміщеннями в екранних пікселях. `fitScene` знаходить масштаб і зміщення, за яких вони вміщуються в контейнер. `resolveScene` перетворює їх на дані шляхів SVG, кола й ті підписи, для яких є місце. `layoutStructure` виконує всі три кроки так, як це роблять `StructurePlot` і `structureSvg`, тож ваш власний рисунок буде скомпоновано так само.

| Експорт | Сигнатура | Що робить |
| --- | --- | --- |
| `layoutStructure` | `(model, options, box, shown?, labelModes?) => StructureLayout` | Усе компонування: вписати з усіма підписами, відкинути підписи, яким тісно, вписати знову. Повертає `{ fit, items, resolved }` |
| `structureSvg` | `(model, options?) => string` | Окремий файл `.svg`: див. [вище](#a-standalone-svg-file) |
| `buildStructureScene` | `(model, options: StructureSceneOptions) => SceneItem[]` | Рисунок вибраних шарів у масштабі, px на метр |
| `fitScene` | `(items, box: FitBox) => Fit` | Масштаб і зміщення, щоб уписати сцену в контейнер `{ width, height?, maxHeight?, padding, fontSize }` |
| `resolveScene` | `(items, transform, options: ResolveOptions) => ResolvedScene` | `{ paths, circles, texts }` у px з підписами, які вмістилися |
| `placeLabels` | `(items, transform, options: ResolveOptions) => Map<SceneText, SceneText>` | Які підписи залишити й де |
| `alternativeResultGroups` | `(shown) => ReadonlySet<string>` | Шари результатів, які показуються по одному; їхні підписи поступаються місцем решті, але не одне одному |
| `sceneBounds` | `(items, scale, fontSize) => Bounds` | Розміри сцени, px |
| `project` | `(transform, anchor) => [number, number]` | Точка сцени на екрані, px |
| `defaultResultLayer` | `(model) => ResultLayer \| null` | Результат, який показує рисунок, коли жодного не задано |
| `diagramScales` | `(model, options) => Record<ResultLayer, number>` | px на одиницю СІ для кожного результату |
| `diagramSide` | `(q, momentOnTensionSide) => 1 \| -1` | З якого боку стрижня малюється додатне значення |
| `isBarStructure` | `(model, memberResults) => boolean` | Чи записується N числами вздовж стрижнів (ферма), а не малюється епюрою |
| `tipPlacements` | `(tip, out, mode, gaps?) => TextPlacement[]` | Можливі місця для значення за кінцем ординати |
| `PLOT_LAYERS` | `readonly PlotLayer[]` | Усі шари в порядку малювання |
| `RESULT_LAYERS` | `['N', 'V', 'M', 'w']` | Шари результатів |
| `HATCH_SPACING_PX` | `7` | Крок ординат епюр, px |
| `DEFAULT_COLORS` | `PlotColors` | Типовий колір кожного тону у вигляді CSS: [Теми та кольори](/uk/plot/theming) |
| `PRINT_COLORS` | `Record<Tone \| 'paper', string>` | Звичайні кольори для файлу, кольори застосунку на білому тлі |
| `toneVars` | `(colors?) => Record<string, string>` | CSS-змінні, які рисунок задає на своєму кореневому елементі |
| `PLOT_CSS` | `string` | Правила CSS, вбудовані в кожен рисунок |

`ResolveOptions` — це `{ fontSize, viewport?, exclude?, alternativeGroups?, shields? }`: `shields` — групи, лінії яких не підпускають до себе підписи (показані епюри); якщо їх не задано, то всі групи. У `layoutStructure` `options.layers` — це шари, які треба скомпонувати (усе, що може бути показано, як у `reserve`), `shown` — ті, що показані, а `labelModes` — стилі підписів, для яких треба залишити місце.

Типи: `StructureSceneOptions`, `StructureLayout`, `StructureSvgOptions`, `SceneItem`, `SceneText`, `TextPlacement`, `ResolvedScene`, `ResolvedPath`, `ResolvedText`, `ResolvedCircle`, `ResolveOptions`, `Bounds`, `Anchor`, `Transform`, `Fit`, `FitBox`, `Tone`, `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `SupportKind`, `SupportPlacement`, `GlyphPart` і типи моделі зі сторінки [Модель рисунка](/uk/plot/model).
