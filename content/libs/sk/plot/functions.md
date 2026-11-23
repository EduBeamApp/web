---
title: Funkcie
description: "Funkcie, konštanty a typy, ktoré @edubeam/plot exportuje popri komponentoch: structureSvg pre súbory SVG, presné výsledky, jednotky, nosník v jednej línii a rozloženie."
order: 10
source: site
---

# Funkcie

Všetko, čo komponenty kreslia, vychádza z čistých funkcií, v ktorých nie je žiadne Vue. Zapíšu obrázok ako súbor SVG, presne odčítajú výsledky, pripravia dáta vopred a poslúžia na zostavenie vlastných obrázkov. Vďaka pomenovaným importom zostane bundle malý: stránka, ktorá importuje iba `modelFromSolver`, nedostane žiadny kód komponentov.

Všetky hodnoty sú v jednotkách SI, ak nie je uvedená iná jednotka; poloha na prvku je vzdialenosť v metroch od jeho počiatočného uzla.

## Samostatný súbor SVG {#a-standalone-svg-file}

Obrázok na stránke preberá farby z CSS premenných (custom properties) stránky, takže skopírovaný `<svg>` nemá žiadne farby. `structureSvg` preto zapíše obrázok ako text samostatného súboru `.svg`: s pevnými farbami, bez štýlov a bez skriptov, rozložený tým istým kódom ako `StructurePlot`. Word, PowerPoint, Inkscape, CairoSVG aj nástroje pre LaTeX ho vykreslia rovnako ako stránka.

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts' // () => vypočítaný LinearStaticSolver, ako na stránke Prezentácie a skriptá

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![Dvojkĺbový rám ako samostatný súbor SVG vykreslený pomocou CairoSVG: zaťaženie, reakcie 20 a 40 nahor a 2,3 a 12,7 vodorovne a ohybový moment od −50,7 v C po 29,3 na nosníku](/screenshots/sk/p2p-plot-frame-svg.webp){.shot-lg}

| Voľba | Predvolené | Čo robí |
| --- | --- | --- |
| `layers` | members, supports, loads, reactions a výsledok, ktorý by zvolil `StructurePlot` | Čo sa kreslí |
| `width` | `640` | Šírka v px, teda v používateľských jednotkách SVG |
| `height` | podľa výkresu | Pevná výška, px |
| `maxHeight` | max(320, 0.75 × width) | Horná hranica automatickej výšky |
| `padding` | `6` | Okraj okolo výkresu, px |
| `fontSize` | `13`, compact `11.5` | Veľkosť písma, px |
| `fontFamily` | `Helvetica, Arial, sans-serif` | Písma, ktoré má program otvárajúci súbor k dispozícii |
| `colors` | `PRINT_COLORS` | Ktorékoľvek tóny ako pevné farby |
| `background` | `true` | Vyplní pozadie farbou `paper`; `false` ho nechá priehľadné |
| `title` | žiadny | Zapíše sa ako `<title>` súboru SVG |
| `reserve`, `reserveLabelModes`, `reserveReactionLabels` | žiadne | Vrstvy, štýly popisov a štýly popisov reakcií, pre ktoré sa okrem vykreslených necháva miesto, aby súbory postupne pribúdajúceho obrázka lícovali: [Postupne pribúdajúci obrázok v Beameri](/sk/plot/slides#a-build-up-in-beamer) |
| `units`, `numberFormat`, `compact`, `diagramSize`, `deformedSize`, `momentOnTensionSide`, `resultLabelMode`, `reactionLabels` | ako `StructurePlot` | Rovnaký význam ako props komponentu |

`PRINT_COLORS` sú farby aplikácie EduBeam na bielom podklade: kresba `#16182b`, normálová sila `#2222ff`, priečna sila `#00af00`, ohybový moment `#ff2222`, zaťaženie `#ff8700`, reakcie `#a020f0`. Každý popis je zapísaný dvakrát, pod textom ešte raz ako lem vo farbe pozadia, pretože nie každý program pre SVG rozumie `paint-order`. Dolný index, ako v názvoch reakcií *A<sub>x</sub>*, je `tspan` s obyčajnými číslami, ktoré Word aj Inkscape prečítajú. Bez `reserve` sa súbor prispôsobí vrstvám, ktoré kreslí.

Ako súbor použiť:

- **Word a PowerPoint** (2019 a Microsoft 365): *Vložiť › Obrázky*.
- **LaTeX**: preveďte ho do PDF pomocou [CairoSVG](https://cairosvg.org) (`cairosvg frame.svg -o frame.pdf`) alebo Inkscapu a vložte cez `\includegraphics`, prípadne použite `\includesvg` z balíka `svg`, ktorý Inkscape zavolá za vás. Obrázok široký 640 jednotiek, vysadený na šírku stĺpca 16 cm, má popisy veľké 9 pt.
- **Webová stránka bez Vue**: vložte text priamo do HTML. Pozrite [Bez Vue](/sk/plot/embedding#plain-html-from-node).

Stránka [Príklady a písomky](/sk/plot/exercises#figures-for-latex-and-word) zapíše pre príklad každého študenta súbor so zadaním a súbor s kľúčom riešení.

## Z riešiča {#from-a-solver}

| Export | Signatúra | Čo robí |
| --- | --- | --- |
| `modelFromSolver` | `(solver: Solver, options?: FromSolverOptions) => PlotModel` | Prevedie riešič na jednoduché dáta [modelu na vykreslenie](/sk/plot/model); výsledky iba pre vypočítaný zaťažovací stav |
| `FromSolverOptions` | type | `{ loadCase?: number }`, index do `solver.loadCases` |

## Po častiach definované polynómy {#piecewise-polynomials}

Výsledky prvku sú hodnoty typu `Piecewise`: zoznamy úsekov `{ x0, x1, c }`, opísané na stránke [Model na vykreslenie](/sk/plot/model#piecewise-polynomials). `side` volí hodnotu tesne pred (`'left'`) alebo tesne za (`'right'`, predvolené) bodom, v ktorom sa dva úseky stýkajú.

| Export | Signatúra | Čo robí |
| --- | --- | --- |
| `valueAt` | `(pw, x, side?) => number` | Hodnota v `x`; za koncom hodnota na bližšom konci |
| `slopeAt` | `(pw, x, side?) => number` | Derivácia, v jednotkách hodnoty na meter |
| `extremes` | `(pw) => { max: Extreme; min: Extreme } \| null` | Najväčšia a najmenšia hodnota, presne, každá ako `{ x, value, side }` |
| `maxAbs` | `(pw) => number` | Najväčšia absolútna hodnota |
| `innerBreaks` | `(pw) => number[]` | Miesta, kde sa úseky stýkajú, bez oboch koncov |
| `isZero` | `(pw) => boolean` | Či je výsledok všade nulový |
| `evalPiece` | `(piece, x) => number` | Hodnota jedného úseku |
| `evalPieceSlope` | `(piece, x) => number` | Smernica jedného úseku |
| `pieceExtrema` | `(piece) => number[]` | Miesta, kde je smernica úseku nulová, m |
| `pieceDegree` | `(piece) => number \| null` | Stupeň úseku; `null`, ak je úsek nulový |
| `cleanPiecewise` | `(pw, tolerance) => Piecewise` | Zahodí koeficienty menšie než `tolerance`, teda zaokrúhľovacie chyby vypočítaného modelu |
| `fitPiece` | `(f, x0, x1, degree) => Piece` | Polynóm daného stupňa preložený hodnotami funkcie `f` na `(x0, x1)` |
| `pieceToBeziers` | `(piece, segments?) => CubicSegment[]` | Úsek ako kubické Bézierove krivky v súradniciach (x, hodnota): do tretieho stupňa presne, inak `segments` kriviek, predvolene 4 |

Typy: `Piece`, `Piecewise`, `Side` (`'left' \| 'right'`), `Extreme`, `CubicSegment`.

## Jednotky a čísla {#units-and-numbers}

| Export | Signatúra | Čo robí |
| --- | --- | --- |
| `KN_UNITS` | `Units` | kN, kNm, kN/m, m, mm, mrad, K: predvolené |
| `SI_UNITS` | `Units` | N, N·m, N/m, m, m, rad, K |
| `resolveUnits` | `(units?: Partial<Units>) => Units` | `KN_UNITS` s vašimi zmenami |
| `DEFAULT_NUMBER_FORMAT` | `Intl.NumberFormat` | Anglický formát, najviac jedno desatinné miesto |
| `formatNumber` | `(value, format?) => string` | Číslo so skutočným znamienkom mínus, nikdy −0 |
| `formatQuantity` | `(si, unit, format?) => string` | `"36 kN"`: hodnota v SI prevedená na jednotku, s úzkou nezlomiteľnou medzerou |

`Unit` je `{ symbol, scale }`, kde zobrazená hodnota = hodnota v SI × `scale`. `Units` obsahuje jednu jednotku pre každý `UnitKind`: `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` a `temperature`.

```ts
import { formatQuantity, KN_UNITS } from '@edubeam/plot'

formatQuantity(-37500, KN_UNITS.moment) // "−37.5 kNm"
```

## Odčítanie hodnôt {#reading-values}

| Export | Signatúra | Čo robí |
| --- | --- | --- |
| `readMember` | `(results: MemberResults, x, snap?) => { x, u, values }` | N, V, M a w v `x`, každá ako `{ left, right }`, a osové posunutie `u`; prichytí sa k skoku vzdialenému najviac `snap` m |
| `readoutAt` | `(model, transform, px, py, reach) => Readout \| null` | Prvok najbližší bodu na obrazovke, najviac `reach` px ďaleko, a jeho výsledky v tomto mieste |
| `readoutMarks` | `(model, transform, readout, shown, k, side) => ReadoutMark[]` | Kde sa odčítané hodnoty vyznačia: koniec poradnice každého zobrazeného priebehu (pri skoku oba) a bod na deformovanom tvare |
| `formatReadout` | `(readout, quantity, units, format?) => string` | `"M = 54 kNm"`, pri skoku `"V = 13.3 → −6.7 kN"` |

`k` je počet px na jednotku SI pre každý výsledok a `side` strana, na ktorú sa ktorý priebeh kreslí; obe vracajú funkcie `diagramScales` a `diagramSide` uvedené nižšie. Typy: `Readout`, `ReadoutMark` (`{ tone, from, to }` v px), `ReadoutQuantity` (`'N' \| 'V' \| 'M' \| 'w'`), `SidedValue`.

## Nosník v jednej línii {#beam-lines}

Stavebné kamene komponentu [DiagramStack](/sk/plot/diagram-stack), z ktorých zostavíte vlastný obrázok s priebehmi pod sebou.

| Export | Signatúra | Čo robí |
| --- | --- | --- |
| `beamLine` | `(model, ids?) => BeamLine` | Prvky ako jedna vodorovná línia zľava doprava; pre čokoľvek iné vyhodí výnimku |
| `lineDiagram` | `(model, line, row) => Piecewise` | Jeden výsledok po celej línii, v súradnici x línie |
| `rowRange` | `(pw) => [number, number]` | Rozsah, na ktorý sa riadok škáluje, vždy vrátane nuly |
| `rowPeaks` | `(pw) => RowPeak[]` | Extrémy, ktoré stojí za to do riadku napísať |
| `rowBreaks` | `(pw) => number[]` | Kde sa priebeh láme: podpery, spoje prvkov a osamelé sily |
| `rowOutline` | `(pw, sx, sy, close) => string` | Dáta cesty SVG s obrysom riadku, pre zadané zobrazenia z m a z hodnoty na px |
| `rowOrdinates` | `(pw, sx, sy, spacing) => string` | Dáta cesty SVG so šrafovacími poradnicami po `spacing` px |
| `lineModel` | `(model, line, omit?) => PlotModel` | Model zúžený na líniu, prípadne bez jedného zaťaženia |
| `pointLoadAt` | `(model, line, at) => PlotLoad \| undefined` | Osamelá sila v polohe `at` na línii |

Typy: `BeamLine`, `LineMember`, `RowPeak`, `StackRow`.

Stránka [DiagramStack](/sk/plot/diagram-stack#a-load-the-reader-can-drag) používa `beamLine`, `lineDiagram` a `rowRange`, aby mal každý riadok rovnakú mierku pre všetky polohy pohyblivého zaťaženia.

## Geometria a podpery {#geometry-and-supports}

| Export | Signatúra | Čo robí |
| --- | --- | --- |
| `nodeMap` | `(model) => ReadonlyMap<string, PlotNode>` | Uzly podľa id |
| `memberFrame` | `(model, member, nodes?) => MemberFrame` | Začiatok prvku, jednotkový dotyčnicový vektor, jednotkový vektor lokálnej osi z a dĺžka |
| `memberFrames` | `(model) => Map<string, MemberFrame>` | To isté pre všetky prvky, podľa id |
| `pointAlong` | `(frame, at) => { x, z }` | Bod vo vzdialenosti `at` metrov od začiatku prvku |
| `supportKind` | `(fixity) => SupportKind` | `'fixed'`, `'pin'`, `'roller'`, `'slider'`, `'rotation'` alebo `'none'` |
| `supportPlacement` | `(model, node) => SupportPlacement` | Značka podpery v uzle a jej pootočenie v smere hodinových ručičiek, v stupňoch |
| `supportGlyph` | `(kind) => readonly GlyphPart[]` | Čiary značky, v px |
| `glyphReach` | `(kind, rotation, x, z) => number` | Ako ďaleko pootočená značka siaha v danom smere, px |

## Kreslenie {#drawing}

Kreslenie prebieha v troch krokoch. `buildStructureScene` prevedie model na položky scény: body modelu s odsadením v pixeloch obrazovky. `fitScene` nájde mierku a posun, s ktorými sa položky zmestia do zadaného obdĺžnika. `resolveScene` z nich urobí dáta ciest SVG, kružnice a tie popisy, na ktoré zostalo miesto. `layoutStructure` spustí všetky tri kroky rovnako ako `StructurePlot` a `structureSvg`, takže vlastný obrázok sa rozloží presne ako tieto dva.

| Export | Signatúra | Čo robí |
| --- | --- | --- |
| `layoutStructure` | `(model, options, box, shown?, labelModes?) => StructureLayout` | Celé rozloženie: umiestnenie so všetkými popismi, vynechanie popisov, ktoré sa nezmestia, a nové umiestnenie. Vracia `{ fit, items, resolved }` |
| `structureSvg` | `(model, options?) => string` | Samostatný súbor `.svg`: pozrite [vyššie](#a-standalone-svg-file) |
| `buildStructureScene` | `(model, options: StructureSceneOptions) => SceneItem[]` | Výkres zvolených vrstiev v danej mierke, px na meter |
| `fitScene` | `(items, box: FitBox) => Fit` | Mierka a posun, aby sa scéna zmestila do obdĺžnika `{ width, height?, maxHeight?, padding, fontSize }` |
| `resolveScene` | `(items, transform, options: ResolveOptions) => ResolvedScene` | `{ paths, circles, texts }` v px, s popismi, ktoré sa zmestia |
| `placeLabels` | `(items, transform, options: ResolveOptions) => Map<SceneText, SceneText>` | Ktoré popisy zostanú a kde |
| `alternativeResultGroups` | `(shown) => ReadonlySet<string>` | Vrstvy výsledkov, ktoré sa zobrazujú po jednej; ich popisy ustupujú ostatným, ale nie sebe navzájom |
| `sceneBounds` | `(items, scale, fontSize) => Bounds` | Rozmery scény, px |
| `project` | `(transform, anchor) => [number, number]` | Bod scény na obrazovke, px |
| `defaultResultLayer` | `(model) => ResultLayer \| null` | Výsledok, ktorý obrázok ukáže, keď žiadny nezadáte |
| `diagramScales` | `(model, options) => Record<ResultLayer, number>` | px na jednotku SI pre každý výsledok |
| `diagramSide` | `(q, momentOnTensionSide) => 1 \| -1` | Na ktorú stranu prvku sa vynáša kladná hodnota |
| `isBarStructure` | `(model, memberResults) => boolean` | Či sa N píše ako čísla pozdĺž prútov (priehradová konštrukcia) namiesto toho, aby sa kreslil priebeh |
| `tipPlacements` | `(tip, out, mode, gaps?) => TextPlacement[]` | Miesta za koncom poradnice, kam možno hodnotu napísať |
| `PLOT_LAYERS` | `readonly PlotLayer[]` | Všetky vrstvy v poradí kreslenia |
| `RESULT_LAYERS` | `['N', 'V', 'M', 'w']` | Vrstvy výsledkov |
| `HATCH_SPACING_PX` | `7` | Rozostup poradníc priebehov, px |
| `DEFAULT_COLORS` | `PlotColors` | Predvolená farba každého tónu ako CSS: [Motívy a farby](/sk/plot/theming) |
| `PRINT_COLORS` | `Record<Tone \| 'paper', string>` | Pevné farby pre súbor, farby aplikácie na bielom podklade |
| `toneVars` | `(colors?) => Record<string, string>` | CSS premenné, ktoré obrázok nastaví na svojom koreňovom elemente |
| `PLOT_CSS` | `string` | Pravidlá CSS vložené do každého obrázka |

`ResolveOptions` sú `{ fontSize, viewport?, exclude?, alternativeGroups?, shields? }`: `shields` sú skupiny, ktorých čiary k sebe nepustia popisy (zobrazené priebehy); keď ich vynecháte, platí to pre všetky. V `layoutStructure` sú `options.layers` vrstvy, ktoré sa rozložia (všetko, čo sa môže zobraziť, podobne ako pri `reserve`), `shown` tie, ktoré sú zobrazené, a `labelModes` štýly popisov, pre ktoré sa má nechať miesto.

Typy: `StructureSceneOptions`, `StructureLayout`, `StructureSvgOptions`, `SceneItem`, `SceneText`, `TextPlacement`, `ResolvedScene`, `ResolvedPath`, `ResolvedText`, `ResolvedCircle`, `ResolveOptions`, `Bounds`, `Anchor`, `Transform`, `Fit`, `FitBox`, `Tone`, `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `SupportKind`, `SupportPlacement`, `GlyphPart` a typy modelu zo stránky [Model na vykreslenie](/sk/plot/model).
