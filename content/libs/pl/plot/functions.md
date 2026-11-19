---
title: Funkcje
description: "Funkcje, stałe i typy @edubeam/plot 0.2.0 poza komponentami: structureSvg, dokładny odczyt wyników, jednostki, linie belek i układ własnych rysunków."
order: 10
source: site
---

# Funkcje

Wszystko, co rysują komponenty, pochodzi z czystych funkcji, w których nie ma Vue. Zapisują rysunek jako plik SVG, dokładnie odczytują wyniki, przygotowują dane z wyprzedzeniem i budują własne rysunki. Importy nazwane utrzymują mały bundle: strona, która importuje tylko `modelFromSolver`, nie dostaje w ogóle kodu komponentów.

Wszystkie wartości są w SI, chyba że podano jednostkę; położenia wzdłuż pręta są w metrach od jego węzła początkowego.

## Samodzielny plik SVG {#a-standalone-svg-file}

Rysunek na stronie bierze kolory ze zmiennych CSS strony, więc skopiowany z niego `<svg>` nie ma żadnych kolorów. `structureSvg` zapisuje zamiast tego rysunek jako tekst samodzielnego pliku `.svg`: zwykłe kolory, bez arkusza stylów, bez skryptów, rozmieszczony tą samą procedurą co `StructurePlot`. Word, PowerPoint, Inkscape, CairoSVG i narzędzia LaTeX-a rysują go tak samo jak strona.

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts' // () => obliczony LinearStaticSolver, jak na stronie Slajdy i materiały

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![Rama portalowa jako samodzielny plik SVG wyrenderowany przez CairoSVG: obciążenia, reakcje 20 i 40 w górę oraz 2,3 i 12,7 w poziomie i moment zginający od −50,7 w węźle C do 29,3 w ryglu](/screenshots/pl/p2p-plot-frame-svg.webp){.shot-lg}

| Opcja | Domyślnie | Działanie |
| --- | --- | --- |
| `layers` | pręty, podpory, obciążenia, reakcje i wynik, który wybrałby `StructurePlot` | Co narysować |
| `width` | `640` | Szerokość w px, czyli jednostkach użytkownika SVG |
| `height` | wynika z rysunku | Stała wysokość, px |
| `maxHeight` | max(320, 0.75 × width) | Górna granica automatycznej wysokości |
| `padding` | `6` | Odstęp wokół rysunku, px |
| `fontSize` | `13`, compact `11.5` | Wielkość tekstu, px |
| `fontFamily` | `Helvetica, Arial, sans-serif` | Lista czcionek, które ma program otwierający plik |
| `colors` | `PRINT_COLORS` | Dowolne tony jako zwykłe kolory |
| `background` | `true` | Maluje tło kolorem `paper`; `false` zostawia je przezroczyste |
| `title` | brak | Zapisywany jako `<title>` pliku SVG |
| `reserve`, `reserveLabelModes`, `reserveReactionLabels` | brak | Warstwy, style etykiet i style etykiet reakcji, dla których trzeba zostawić miejsce oprócz rysowanych, aby pliki kolejnych etapów się pokrywały: [Rysunek rozbudowywany etapami w Beamerze](/pl/plot/slides#a-build-up-in-beamer) |
| `units`, `numberFormat`, `compact`, `diagramSize`, `deformedSize`, `momentOnTensionSide`, `resultLabelMode`, `reactionLabels` | jak w `StructurePlot` | To samo znaczenie co propsy komponentu |

`PRINT_COLORS` to kolory aplikacji EduBeam na białym tle: tusz `#16182b`, siła normalna `#2222ff`, siła tnąca `#00af00`, moment zginający `#ff2222`, obciążenia `#ff8700`, reakcje `#a020f0`. Każda etykieta jest zapisana dwa razy, z obwódką w kolorze tła pod tekstem, ponieważ nie każdy program do grafiki SVG obsługuje `paint-order`, a indeks dolny, jak w nazwach reakcji *A<sub>x</sub>*, to `tspan` ze zwykłymi liczbami, które Word i Inkscape odczytują poprawnie. Bez `reserve` plik jest dopasowany do warstw, które rysuje.

Jak użyć pliku:

- **Word i PowerPoint** (2019 i Microsoft 365): *Wstawianie › Obrazy*.
- **LaTeX**: przekonwertuj plik do PDF za pomocą [CairoSVG](https://cairosvg.org) (`cairosvg frame.svg -o frame.pdf`) lub Inkscape'a, a potem użyj `\includegraphics`; albo użyj `\includesvg` z pakietu `svg`, które samo wywoła Inkscape'a. Przy szerokości 640 jednostek rysunek wstawiony w kolumnę tekstu o szerokości 16 cm ma etykiety 9 pt.
- **Strona internetowa bez Vue**: wklej tekst do HTML-a. Zob. [Bez Vue](/pl/plot/embedding#plain-html-from-node).

Strona [Zadania i kolokwia](/pl/plot/exercises#figures-for-latex-and-word) zapisuje plik z zadaniem i kluczem dla każdego studenta.

## Z solvera {#from-a-solver}

| Eksport | Sygnatura | Działanie |
| --- | --- | --- |
| `modelFromSolver` | `(solver: Solver, options?: FromSolverOptions) => PlotModel` | Odczytuje solver do zwykłego [modelu rysunku](/pl/plot/model); wyniki tylko dla obliczonego przypadku obciążenia |
| `FromSolverOptions` | typ | `{ loadCase?: number }`, indeks w `solver.loadCases` |

## Wielomiany przedziałami {#piecewise-polynomials}

Wyniki pręta to wartości `Piecewise`: listy odcinków `{ x0, x1, c }`, opisane na stronie [Model rysunku](/pl/plot/model#piecewise-polynomials). `side` wybiera wartość tuż przed (`'left'`) lub tuż za (`'right'`, domyślnie) punktem, w którym stykają się dwa odcinki.

| Eksport | Sygnatura | Działanie |
| --- | --- | --- |
| `valueAt` | `(pw, x, side?) => number` | Wartość w `x`; poza końcami wartość na najbliższym końcu |
| `slopeAt` | `(pw, x, side?) => number` | Pochodna, w jednostkach wartości na metr |
| `extremes` | `(pw) => { max: Extreme; min: Extreme } \| null` | Największa i najmniejsza wartość, dokładnie, każda w postaci `{ x, value, side }` |
| `maxAbs` | `(pw) => number` | Największa wartość bezwzględna |
| `innerBreaks` | `(pw) => number[]` | Miejsca styku odcinków, bez obu końców |
| `isZero` | `(pw) => boolean` | Czy wynik jest wszędzie równy zeru |
| `evalPiece` | `(piece, x) => number` | Wartość jednego odcinka |
| `evalPieceSlope` | `(piece, x) => number` | Nachylenie jednego odcinka |
| `pieceExtrema` | `(piece) => number[]` | Miejsca, w których nachylenie odcinka jest równe zeru, m |
| `pieceDegree` | `(piece) => number \| null` | Stopień odcinka; `null`, gdy jest zerowy |
| `cleanPiecewise` | `(pw, tolerance) => Piecewise` | Usuwa współczynniki mniejsze od `tolerance`, czyli błędy zaokrągleń obliczonego modelu |
| `fitPiece` | `(f, x0, x1, degree) => Piece` | Wielomian danego stopnia dopasowany do funkcji na `(x0, x1)` |
| `pieceToBeziers` | `(piece, segments?) => CubicSegment[]` | Odcinek jako krzywe Béziera trzeciego stopnia w (x, wartość): dokładnie do wielomianów trzeciego stopnia, w przeciwnym razie `segments` krzywych, domyślnie 4 |

Typy: `Piece`, `Piecewise`, `Side` (`'left' \| 'right'`), `Extreme`, `CubicSegment`.

## Jednostki i liczby {#units-and-numbers}

| Eksport | Sygnatura | Działanie |
| --- | --- | --- |
| `KN_UNITS` | `Units` | kN, kNm, kN/m, m, mm, mrad, K: domyślne |
| `SI_UNITS` | `Units` | N, N·m, N/m, m, m, rad, K |
| `resolveUnits` | `(units?: Partial<Units>) => Units` | `KN_UNITS` z Twoimi zmianami |
| `DEFAULT_NUMBER_FORMAT` | `Intl.NumberFormat` | Angielski, najwyżej jedno miejsce po przecinku |
| `formatNumber` | `(value, format?) => string` | Liczba z prawdziwym znakiem minus, nigdy −0 |
| `formatQuantity` | `(si, unit, format?) => string` | `"36 kN"`: wartość w SI w danej jednostce, z wąską spacją nierozdzielającą |

`Unit` to `{ symbol, scale }`, przy czym wartość wyświetlana = wartość w SI × `scale`. `Units` ma jedną jednostkę dla każdego `UnitKind`: `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` i `temperature`.

```ts
import { formatQuantity, KN_UNITS } from '@edubeam/plot'

formatQuantity(-37500, KN_UNITS.moment) // "−37.5 kNm"
```

## Odczyt wartości {#reading-values}

| Eksport | Sygnatura | Działanie |
| --- | --- | --- |
| `readMember` | `(results: MemberResults, x, snap?) => { x, u, values }` | N, V, M i w w `x`, każde jako `{ left, right }`, oraz przemieszczenie osiowe `u`; przyciąga do skoku w odległości do `snap` m |
| `readoutAt` | `(model, transform, px, py, reach) => Readout \| null` | Pręt najbliższy punktowi na ekranie w zasięgu `reach` px i jego wyniki w tym miejscu |
| `readoutMarks` | `(model, transform, readout, shown, k, side) => ReadoutMark[]` | Gdzie są rysowane odczytane wartości: koniec rzędnej każdego pokazanego wykresu (przy skoku oba) i punkt na postaci odkształconej |
| `formatReadout` | `(readout, quantity, units, format?) => string` | `"M = 54 kNm"` albo przy skoku `"V = 13.3 → −6.7 kN"` |

`k` to liczba px na jednostkę SI dla każdego wyniku, a `side` strona, po której rysowany jest każdy wykres; obie wartości dają `diagramScales` i `diagramSide` opisane niżej. Typy: `Readout`, `ReadoutMark` (`{ tone, from, to }` w px), `ReadoutQuantity` (`'N' \| 'V' \| 'M' \| 'w'`), `SidedValue`.

## Linie belek {#beam-lines}

Elementy składowe [DiagramStack](/pl/plot/diagram-stack), do budowania własnego rysunku z wykresami jeden pod drugim.

| Eksport | Sygnatura | Działanie |
| --- | --- | --- |
| `beamLine` | `(model, ids?) => BeamLine` | Pręty jako jedna pozioma linia, od lewej do prawej; w każdym innym przypadku zgłasza wyjątek |
| `lineDiagram` | `(model, line, row) => Piecewise` | Jeden wynik wzdłuż całej linii, we współrzędnej x linii |
| `rowRange` | `(pw) => [number, number]` | Zakres, do którego skalowany jest wiersz, zawsze z zerem |
| `rowPeaks` | `(pw) => RowPeak[]` | Ekstrema warte opisania w wierszu |
| `rowBreaks` | `(pw) => number[]` | Miejsca, w których przebieg wyniku się załamuje: podpory, styki prętów i siły skupione |
| `rowOutline` | `(pw, sx, sy, close) => string` | Dane ścieżki SVG obrysu wiersza, przy danych odwzorowaniach m i wartości na px |
| `rowOrdinates` | `(pw, sx, sy, spacing) => string` | Dane ścieżki SVG rzędnych kreskowania, w odstępach `spacing` px |
| `lineModel` | `(model, line, omit?) => PlotModel` | Model ograniczony do linii, opcjonalnie bez jednego obciążenia |
| `pointLoadAt` | `(model, line, at) => PlotLoad \| undefined` | Siła skupiona w położeniu `at` na linii |

Typy: `BeamLine`, `LineMember`, `RowPeak`, `StackRow`.

Strona [DiagramStack](/pl/plot/diagram-stack#a-load-the-reader-can-drag) używa `beamLine`, `lineDiagram` i `rowRange`, aby zachować skalę każdego wiersza dla wszystkich położeń ruchomej siły.

## Geometria i podpory {#geometry-and-supports}

| Eksport | Sygnatura | Działanie |
| --- | --- | --- |
| `nodeMap` | `(model) => ReadonlyMap<string, PlotNode>` | Węzły według identyfikatora |
| `memberFrame` | `(model, member, nodes?) => MemberFrame` | Początek pręta, jednostkowy wektor styczny, jednostkowa lokalna oś z i długość |
| `memberFrames` | `(model) => Map<string, MemberFrame>` | To samo dla każdego pręta, według identyfikatora |
| `pointAlong` | `(frame, at) => { x, z }` | Punkt w odległości `at` metrów wzdłuż pręta |
| `supportKind` | `(fixity) => SupportKind` | `'fixed'`, `'pin'`, `'roller'`, `'slider'`, `'rotation'` lub `'none'` |
| `supportPlacement` | `(model, node) => SupportPlacement` | Symbol dla węzła i jego obrót zgodnie z ruchem wskazówek zegara, w stopniach |
| `supportGlyph` | `(kind) => readonly GlyphPart[]` | Linie symbolu, w px |
| `glyphReach` | `(kind, rotation, x, z) => number` | Jak daleko obrócony symbol sięga w danym kierunku, px |

## Rysowanie {#drawing}

Rysowanie przebiega w trzech krokach. `buildStructureScene` zamienia model w elementy sceny: punkty modelu z przesunięciami w pikselach ekranu. `fitScene` znajduje skalę i przesunięcie, przy których mieszczą się one w prostokącie. `resolveScene` zamienia je w dane ścieżek SVG, okręgi i etykiety, dla których jest miejsce. `layoutStructure` wykonuje wszystkie trzy kroki tak jak `StructurePlot` i `structureSvg`, więc własny rysunek jest rozmieszczony tak samo jak ich rysunki.

| Eksport | Sygnatura | Działanie |
| --- | --- | --- |
| `layoutStructure` | `(model, options, box, shown?, labelModes?) => StructureLayout` | Cały układ: dopasowanie ze wszystkimi etykietami, usunięcie zbyt ciasnych etykiet, ponowne dopasowanie. Zwraca `{ fit, items, resolved }` |
| `structureSvg` | `(model, options?) => string` | Samodzielny plik `.svg`: [powyżej](#a-standalone-svg-file) |
| `buildStructureScene` | `(model, options: StructureSceneOptions) => SceneItem[]` | Rysunek wybranych warstw w danej skali, px na metr |
| `fitScene` | `(items, box: FitBox) => Fit` | Skala i przesunięcie, aby zmieścić scenę w prostokącie `{ width, height?, maxHeight?, padding, fontSize }` |
| `resolveScene` | `(items, transform, options: ResolveOptions) => ResolvedScene` | `{ paths, circles, texts }` w px, z etykietami, które się mieszczą |
| `placeLabels` | `(items, transform, options: ResolveOptions) => Map<SceneText, SceneText>` | Które etykiety zachować i gdzie |
| `alternativeResultGroups` | `(shown) => ReadonlySet<string>` | Warstwy wyników pokazywane pojedynczo, których etykiety ustępują pozostałym, ale nie sobie nawzajem |
| `sceneBounds` | `(items, scale, fontSize) => Bounds` | Zasięg sceny, px |
| `project` | `(transform, anchor) => [number, number]` | Punkt sceny na ekranie, px |
| `defaultResultLayer` | `(model) => ResultLayer \| null` | Wynik, który rysunek pokazuje, gdy nie wybrano żadnego |
| `diagramScales` | `(model, options) => Record<ResultLayer, number>` | Liczba px na jednostkę SI dla każdego wyniku |
| `diagramSide` | `(q, momentOnTensionSide) => 1 \| -1` | Po której stronie pręta rysowana jest wartość dodatnia |
| `isBarStructure` | `(model, memberResults) => boolean` | Czy N jest zapisywane liczbami wzdłuż prętów (kratownica), a nie rysowane jako wykres |
| `tipPlacements` | `(tip, out, mode, gaps?) => TextPlacement[]` | Miejsca, które może zająć wartość za końcem rzędnej |
| `PLOT_LAYERS` | `readonly PlotLayer[]` | Wszystkie warstwy, w kolejności rysowania |
| `RESULT_LAYERS` | `['N', 'V', 'M', 'w']` | Warstwy wyników |
| `HATCH_SPACING_PX` | `7` | Odstęp rzędnych wykresu, px |
| `DEFAULT_COLORS` | `PlotColors` | Domyślny kolor każdego tonu, jako CSS: [Motywy i kolory](/pl/plot/theming) |
| `PRINT_COLORS` | `Record<Tone \| 'paper', string>` | Zwykłe kolory do pliku, kolory aplikacji na białym tle |
| `toneVars` | `(colors?) => Record<string, string>` | Zmienne CSS, które rysunek ustawia na swoim elemencie głównym |
| `PLOT_CSS` | `string` | Reguły CSS wpisane w każdy rysunek |

`ResolveOptions` to `{ fontSize, viewport?, exclude?, alternativeGroups?, shields? }`: `shields` to grupy, których linie nie dopuszczają do siebie etykiet (pokazane wykresy); jeśli je pominiesz, dotyczy to wszystkich grup. W `layoutStructure` `options.layers` to warstwy do rozmieszczenia (wszystko, co może zostać pokazane, podobnie jak `reserve`), `shown` te widoczne, a `labelModes` style etykiet, dla których trzeba zostawić miejsce.

Typy: `StructureSceneOptions`, `StructureLayout`, `StructureSvgOptions`, `SceneItem`, `SceneText`, `TextPlacement`, `ResolvedScene`, `ResolvedPath`, `ResolvedText`, `ResolvedCircle`, `ResolveOptions`, `Bounds`, `Anchor`, `Transform`, `Fit`, `FitBox`, `Tone`, `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `SupportKind`, `SupportPlacement`, `GlyphPart` oraz typy modelu ze strony [Model rysunku](/pl/plot/model).
