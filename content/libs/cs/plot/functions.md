---
title: Funkce
description: "Funkce, konstanty a typy, které @edubeam/plot 0.2.0 exportuje vedle komponent: structureSvg, přesné výsledky, jednotky, nosník v jedné linii a vlastní obrázky."
order: 10
---

# Funkce

Všechno, co komponenty kreslí, vychází z čistých funkcí, ve kterých není žádné Vue. Zapíší obrázek jako soubor SVG, přesně odečtou výsledky, připraví data předem a poslouží ke stavbě vlastních obrázků. Díky pojmenovaným importům zůstane bundle malý: stránka, která importuje jen `modelFromSolver`, nedostane žádný kód komponent.

Všechny hodnoty jsou v SI, pokud jednotka neříká jinak; poloha na prvku je vzdálenost v metrech od jeho počátečního uzlu.

## Samostatný soubor SVG {#a-standalone-svg-file}

Obrázek na stránce bere barvy z CSS proměnných (custom properties) stránky, takže `<svg>` z něj zkopírované žádné barvy nemá. `structureSvg` proto zapíše obrázek jako text samostatného souboru `.svg`: s pevnými barvami, bez stylů a bez skriptů, rozvržený stejným kódem jako `StructurePlot`. Word, PowerPoint, Inkscape, CairoSVG i nástroje pro LaTeX ho vykreslí stejně jako stránka.

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts' // () => spočtený LinearStaticSolver, jako na stránce Prezentace a skripta

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![Dvoukloubový rám jako samostatný soubor SVG vykreslený pomocí CairoSVG: zatížení, reakce 20 a 40 nahoru a 2,3 a 12,7 vodorovně a ohybový moment od −50,7 v C po 29,3 na příčli](/screenshots/cs/p2p-plot-frame-svg.webp){.shot-lg}

| Volba | Výchozí | Co dělá |
| --- | --- | --- |
| `layers` | members, supports, loads, reactions a výsledek, který by zvolil `StructurePlot` | Co se kreslí |
| `width` | `640` | Šířka v px, tedy v uživatelských jednotkách SVG |
| `height` | podle výkresu | Pevná výška, px |
| `maxHeight` | max(320, 0.75 × width) | Horní mez automatické výšky |
| `padding` | `6` | Okraj kolem výkresu, px |
| `fontSize` | `13`, compact `11.5` | Velikost písma, px |
| `fontFamily` | `Helvetica, Arial, sans-serif` | Písma, která má program otevírající soubor k dispozici |
| `colors` | `PRINT_COLORS` | Kterékoli z tónů, jako pevné barvy |
| `background` | `true` | Vyplní pozadí barvou `paper`; `false` ho nechá průhledné |
| `title` | žádný | Zapíše se jako `<title>` souboru SVG |
| `reserve`, `reserveLabelModes`, `reserveReactionLabels` | žádné | Vrstvy, styly popisků a styly popisků reakcí, pro které se kromě vykreslených nechá místo, aby soubory postupně přibývajícího obrázku lícovaly: [Postupně přibývající obrázek v Beameru](/cs/plot/slides#a-build-up-in-beamer) |
| `units`, `numberFormat`, `compact`, `diagramSize`, `deformedSize`, `momentOnTensionSide`, `resultLabelMode`, `reactionLabels` | jako `StructurePlot` | Stejný význam jako props komponenty |

`PRINT_COLORS` jsou barvy aplikace EduBeam na bílém podkladu: kresba `#16182b`, normálová síla `#2222ff`, posouvající síla `#00af00`, ohybový moment `#ff2222`, zatížení `#ff8700`, reakce `#a020f0`. Každý popisek je zapsán dvakrát, pod textem ještě jednou jako lem v barvě pozadí, protože ne každý program pro SVG rozumí `paint-order`. Dolní index, jako v názvech reakcí *A<sub>x</sub>*, je `tspan` s obyčejnými čísly, která Word i Inkscape přečtou. Bez `reserve` se soubor přizpůsobí vrstvám, které kreslí.

Jak soubor použít:

- **Word a PowerPoint** (2019 a Microsoft 365): *Vložení › Obrázky*.
- **LaTeX**: převeďte ho do PDF pomocí [CairoSVG](https://cairosvg.org) (`cairosvg frame.svg -o frame.pdf`) nebo Inkscapu a vložte přes `\includegraphics`, případně použijte `\includesvg` z balíčku `svg`, který Inkscape zavolá za vás. Obrázek široký 640 jednotek, vysázený na šířku sloupce 16 cm, má popisky velké 9 pt.
- **Webová stránka bez Vue**: vložte text přímo do HTML. Viz [Bez Vue](/cs/plot/embedding#plain-html-from-node).

Stránka [Příklady a písemky](/cs/plot/exercises#figures-for-latex-and-word) zapíše pro příklad každého studenta soubor se zadáním a soubor s klíčem řešení.

## Z řešiče {#from-a-solver}

| Export | Signatura | Co dělá |
| --- | --- | --- |
| `modelFromSolver` | `(solver: Solver, options?: FromSolverOptions) => PlotModel` | Převede řešič na prostá data [modelu pro vykreslení](/cs/plot/model); výsledky jen pro spočtený zatěžovací stav |
| `FromSolverOptions` | type | `{ loadCase?: number }`, index do `solver.loadCases` |

## Polynomy po částech {#piecewise-polynomials}

Výsledky prvku jsou hodnoty typu `Piecewise`: seznamy úseků `{ x0, x1, c }`, popsané na stránce [Model pro vykreslení](/cs/plot/model#piecewise-polynomials). `side` volí hodnotu těsně před (`'left'`) nebo těsně za (`'right'`, výchozí) bodem, ve kterém se dva úseky stýkají.

| Export | Signatura | Co dělá |
| --- | --- | --- |
| `valueAt` | `(pw, x, side?) => number` | Hodnota v `x`; za koncem hodnota na bližším konci |
| `slopeAt` | `(pw, x, side?) => number` | Derivace, v jednotkách hodnoty na metr |
| `extremes` | `(pw) => { max: Extreme; min: Extreme } \| null` | Největší a nejmenší hodnota, přesně, každá jako `{ x, value, side }` |
| `maxAbs` | `(pw) => number` | Největší absolutní hodnota |
| `innerBreaks` | `(pw) => number[]` | Místa, kde se úseky stýkají, bez obou konců |
| `isZero` | `(pw) => boolean` | Zda je výsledek všude nulový |
| `evalPiece` | `(piece, x) => number` | Hodnota jednoho úseku |
| `evalPieceSlope` | `(piece, x) => number` | Směrnice jednoho úseku |
| `pieceExtrema` | `(piece) => number[]` | Místa, kde je směrnice úseku nulová, m |
| `pieceDegree` | `(piece) => number \| null` | Stupeň úseku; `null`, je-li úsek nulový |
| `cleanPiecewise` | `(pw, tolerance) => Piecewise` | Zahodí koeficienty menší než `tolerance`, tedy zaokrouhlovací chyby spočteného modelu |
| `fitPiece` | `(f, x0, x1, degree) => Piece` | Polynom daného stupně proložený hodnotami funkce `f` na `(x0, x1)` |
| `pieceToBeziers` | `(piece, segments?) => CubicSegment[]` | Úsek jako kubické Bézierovy křivky v souřadnicích (x, hodnota): do třetího stupně přesně, jinak `segments` křivek, výchozí 4 |

Typy: `Piece`, `Piecewise`, `Side` (`'left' \| 'right'`), `Extreme`, `CubicSegment`.

## Jednotky a čísla {#units-and-numbers}

| Export | Signatura | Co dělá |
| --- | --- | --- |
| `KN_UNITS` | `Units` | kN, kNm, kN/m, m, mm, mrad, K: výchozí |
| `SI_UNITS` | `Units` | N, N·m, N/m, m, m, rad, K |
| `resolveUnits` | `(units?: Partial<Units>) => Units` | `KN_UNITS` s vašimi změnami |
| `DEFAULT_NUMBER_FORMAT` | `Intl.NumberFormat` | Anglický formát, nejvýše jedno desetinné místo |
| `formatNumber` | `(value, format?) => string` | Číslo se skutečným znaménkem minus, nikdy −0 |
| `formatQuantity` | `(si, unit, format?) => string` | `"36 kN"`: hodnota v SI převedená na jednotku, s úzkou nezlomitelnou mezerou |

`Unit` je `{ symbol, scale }`, kde zobrazená hodnota = hodnota v SI × `scale`. `Units` obsahuje jednu jednotku pro každý `UnitKind`: `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` a `temperature`.

```ts
import { formatQuantity, KN_UNITS } from '@edubeam/plot'

formatQuantity(-37500, KN_UNITS.moment) // "−37.5 kNm"
```

## Odečítání hodnot {#reading-values}

| Export | Signatura | Co dělá |
| --- | --- | --- |
| `readMember` | `(results: MemberResults, x, snap?) => { x, u, values }` | N, V, M a w v `x`, každá jako `{ left, right }`, a osové posunutí `u`; přichytí se ke skoku vzdálenému nejvýše `snap` m |
| `readoutAt` | `(model, transform, px, py, reach) => Readout \| null` | Prvek nejbližší bodu na obrazovce, nejvýše `reach` px daleko, a jeho výsledky v tomto místě |
| `readoutMarks` | `(model, transform, readout, shown, k, side) => ReadoutMark[]` | Kde se odečtené hodnoty vyznačí: konec pořadnice každého zobrazeného průběhu (u skoku oba) a bod na deformovaném tvaru |
| `formatReadout` | `(readout, quantity, units, format?) => string` | `"M = 54 kNm"`, u skoku `"V = 13.3 → −6.7 kN"` |

`k` je počet px na jednotku SI pro každý výsledek a `side` strana, na kterou se který průběh kreslí; obojí vracejí `diagramScales` a `diagramSide` níže. Typy: `Readout`, `ReadoutMark` (`{ tone, from, to }` v px), `ReadoutQuantity` (`'N' \| 'V' \| 'M' \| 'w'`), `SidedValue`.

## Nosník v jedné linii {#beam-lines}

Stavební kameny komponenty [DiagramStack](/cs/plot/diagram-stack), ze kterých sestavíte vlastní obrázek s průběhy pod sebou.

| Export | Signatura | Co dělá |
| --- | --- | --- |
| `beamLine` | `(model, ids?) => BeamLine` | Prvky jako jedna vodorovná linie zleva doprava; pro cokoli jiného vyhodí výjimku |
| `lineDiagram` | `(model, line, row) => Piecewise` | Jeden výsledek po celé linii, v souřadnici x linie |
| `rowRange` | `(pw) => [number, number]` | Rozsah, na který se řádek škáluje, vždy včetně nuly |
| `rowPeaks` | `(pw) => RowPeak[]` | Extrémy, které stojí za to do řádku napsat |
| `rowBreaks` | `(pw) => number[]` | Kde se průběh láme: podpory, styčníky a osamělé síly |
| `rowOutline` | `(pw, sx, sy, close) => string` | Data cesty SVG s obrysem řádku, pro zadaná zobrazení z m a z hodnoty na px |
| `rowOrdinates` | `(pw, sx, sy, spacing) => string` | Data cesty SVG se šrafovacími pořadnicemi po `spacing` px |
| `lineModel` | `(model, line, omit?) => PlotModel` | Model zúžený na linii, případně bez jednoho zatížení |
| `pointLoadAt` | `(model, line, at) => PlotLoad \| undefined` | Osamělá síla v poloze `at` na linii |

Typy: `BeamLine`, `LineMember`, `RowPeak`, `StackRow`.

Stránka [DiagramStack](/cs/plot/diagram-stack#a-load-the-reader-can-drag) používá `beamLine`, `lineDiagram` a `rowRange`, aby měl každý řádek stejné měřítko pro všechny polohy pohyblivého zatížení.

## Geometrie a podpory {#geometry-and-supports}

| Export | Signatura | Co dělá |
| --- | --- | --- |
| `nodeMap` | `(model) => ReadonlyMap<string, PlotNode>` | Uzly podle id |
| `memberFrame` | `(model, member, nodes?) => MemberFrame` | Počátek prvku, jednotkový tečný vektor, jednotkový vektor lokální osy z a délka |
| `memberFrames` | `(model) => Map<string, MemberFrame>` | Totéž pro všechny prvky, podle id |
| `pointAlong` | `(frame, at) => { x, z }` | Bod ve vzdálenosti `at` metrů od počátku prvku |
| `supportKind` | `(fixity) => SupportKind` | `'fixed'`, `'pin'`, `'roller'`, `'slider'`, `'rotation'` nebo `'none'` |
| `supportPlacement` | `(model, node) => SupportPlacement` | Značka podpory v uzlu a její pootočení po směru hodinových ručiček, ve stupních |
| `supportGlyph` | `(kind) => readonly GlyphPart[]` | Čáry značky, v px |
| `glyphReach` | `(kind, rotation, x, z) => number` | Jak daleko pootočená značka sahá v daném směru, px |

## Kreslení {#drawing}

Kreslení probíhá ve třech krocích. `buildStructureScene` převede model na položky scény: body modelu s odsazením v pixelech obrazovky. `fitScene` najde měřítko a posun, se kterými se položky vejdou do zadaného obdélníku. `resolveScene` z nich udělá data cest SVG, kružnice a ty popisky, na které zbylo místo. `layoutStructure` spustí všechny tři kroky stejně jako `StructurePlot` a `structureSvg`, takže vlastní obrázek bude rozvržený stejně jako jejich.

| Export | Signatura | Co dělá |
| --- | --- | --- |
| `layoutStructure` | `(model, options, box, shown?, labelModes?) => StructureLayout` | Celé rozvržení: umístění se všemi popisky, vypuštění popisků, které se nevejdou, a nové umístění. Vrací `{ fit, items, resolved }` |
| `structureSvg` | `(model, options?) => string` | Samostatný soubor `.svg`: viz [výše](#a-standalone-svg-file) |
| `buildStructureScene` | `(model, options: StructureSceneOptions) => SceneItem[]` | Výkres zvolených vrstev v daném měřítku, px na metr |
| `fitScene` | `(items, box: FitBox) => Fit` | Měřítko a posun, aby se scéna vešla do obdélníku `{ width, height?, maxHeight?, padding, fontSize }` |
| `resolveScene` | `(items, transform, options: ResolveOptions) => ResolvedScene` | `{ paths, circles, texts }` v px, s popisky, které se vejdou |
| `placeLabels` | `(items, transform, options: ResolveOptions) => Map<SceneText, SceneText>` | Které popisky zůstanou a kde |
| `alternativeResultGroups` | `(shown) => ReadonlySet<string>` | Vrstvy výsledků, které se zobrazují po jedné; jejich popisky ustupují ostatním, ale ne sobě navzájem |
| `sceneBounds` | `(items, scale, fontSize) => Bounds` | Rozměry scény, px |
| `project` | `(transform, anchor) => [number, number]` | Bod scény na obrazovce, px |
| `defaultResultLayer` | `(model) => ResultLayer \| null` | Výsledek, který obrázek ukáže, když žádný nezadáte |
| `diagramScales` | `(model, options) => Record<ResultLayer, number>` | px na jednotku SI pro každý výsledek |
| `diagramSide` | `(q, momentOnTensionSide) => 1 \| -1` | Na kterou stranu prvku se vynáší kladná hodnota |
| `isBarStructure` | `(model, memberResults) => boolean` | Zda se N píše jako čísla podél prutů (příhradová konstrukce), místo aby se kreslil průběh |
| `tipPlacements` | `(tip, out, mode, gaps?) => TextPlacement[]` | Místa za koncem pořadnice, kam lze hodnotu napsat |
| `PLOT_LAYERS` | `readonly PlotLayer[]` | Všechny vrstvy v pořadí kreslení |
| `RESULT_LAYERS` | `['N', 'V', 'M', 'w']` | Vrstvy výsledků |
| `HATCH_SPACING_PX` | `7` | Rozteč pořadnic průběhů, px |
| `DEFAULT_COLORS` | `PlotColors` | Výchozí barva každého tónu jako CSS: [Motivy a barvy](/cs/plot/theming) |
| `PRINT_COLORS` | `Record<Tone \| 'paper', string>` | Pevné barvy pro soubor, barvy aplikace na bílém podkladu |
| `toneVars` | `(colors?) => Record<string, string>` | CSS proměnné, které obrázek nastaví na svém kořenovém elementu |
| `PLOT_CSS` | `string` | Pravidla CSS vložená do každého obrázku |

`ResolveOptions` jsou `{ fontSize, viewport?, exclude?, alternativeGroups?, shields? }`: `shields` jsou skupiny, jejichž čáry k sobě nepustí popisky (zobrazené průběhy); když je vynecháte, platí to pro všechny. V `layoutStructure` jsou `options.layers` vrstvy, které se rozvrhnou (všechno, co se může zobrazit, podobně jako u `reserve`), `shown` ty, které jsou zobrazené, a `labelModes` styly popisků, pro které se má nechat místo.

Typy: `StructureSceneOptions`, `StructureLayout`, `StructureSvgOptions`, `SceneItem`, `SceneText`, `TextPlacement`, `ResolvedScene`, `ResolvedPath`, `ResolvedText`, `ResolvedCircle`, `ResolveOptions`, `Bounds`, `Anchor`, `Transform`, `Fit`, `FitBox`, `Tone`, `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `SupportKind`, `SupportPlacement`, `GlyphPart` a typy modelu ze stránky [Model pro vykreslení](/cs/plot/model).
