---
title: Függvények
description: "Az @edubeam/plot által a komponenseken kívül exportált függvények, konstansok és típusok: structureSvg SVG-fájlokhoz, pontos eredmények, mértékegységek, tartóvonalak és elrendezés."
order: 10
source: site
---

# Függvények

Mindaz, amit a komponensek rajzolnak, Vue nélküli tiszta függvényekből származik. Ezek SVG-fájlként írják ki a rajzot, pontosan olvassák ki az eredményeket, előre elkészítik az adatokat, és saját rajzokat építenek. A nevesített importok kicsiben tartják a bundle-t: egy oldal, amely csak a `modelFromSolver` függvényt importálja, egyáltalán nem kap komponenskódot.

Minden érték SI-egységben van, hacsak nincs más mértékegység megadva; a rúd menti helyek a rúd kezdő csomópontjától mért méterek.

## Önálló SVG-fájl {#a-standalone-svg-file}

Az oldalon lévő rajz a színeit az oldal CSS-változóiból veszi, így a belőle kimásolt `<svg>` elemnek nincsenek színei. A `structureSvg` ehelyett egy önálló `.svg` fájl szövegeként írja ki a rajzot: egyszerű színekkel, stíluslap és szkriptek nélkül, ugyanazzal az eljárással elrendezve, mint a `StructurePlot`. A Word, a PowerPoint, az Inkscape, a CairoSVG és a LaTeX eszközláncai ugyanúgy jelenítik meg, mint az oldal.

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts' // () => egy kiszámított LinearStaticSolver, mint a Diák és jegyzetek oldalon

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![A keret önálló SVG-fájlként, a CairoSVG renderelésében: a terhek, a támaszerők (20 és 40 felfelé, 2,3 és 12,7 vízszintesen) és a hajlítónyomaték a C csomóponti −50,7-től a gerendabeli 29,3-ig](/screenshots/hu/p2p-plot-frame-svg.webp){.shot-lg}

| Beállítás | Alapérték | Mit csinál |
| --- | --- | --- |
| `layers` | rudak, támaszok, terhek, támaszerők és az az eredmény, amelyet a `StructurePlot` választana | Mit rajzoljon |
| `width` | `640` | Szélesség px-ben, az SVG felhasználói egységeiben |
| `height` | a rajzhoz igazodik | Rögzített magasság, px |
| `maxHeight` | max(320, 0.75 × width) | Az automatikus magasság felső korlátja |
| `padding` | `6` | Térköz a rajz körül, px |
| `fontSize` | `13`, compact `11.5` | Betűméret, px |
| `fontFamily` | `Helvetica, Arial, sans-serif` | Betűtípuslista, amely megvan a fájlt megnyitó programban |
| `colors` | `PRINT_COLORS` | Bármelyik tónus, egyszerű színként |
| `background` | `true` | A hátteret `paper` színnel festi ki; `false` esetén átlátszó marad |
| `title` | nincs | Az SVG `<title>` elemeként íródik ki |
| `reserve`, `reserveLabelModes`, `reserveReactionLabels` | nincs | Rétegek, feliratstílusok és támaszerő-feliratstílusok, amelyeknek a kirajzoltakon kívül helyet kell hagyni, hogy a fokozatosan felépülő rajz fájljai fedjék egymást: [Fokozatos felépítés Beamerben](/hu/plot/slides#a-build-up-in-beamer) |
| `units`, `numberFormat`, `compact`, `diagramSize`, `deformedSize`, `momentOnTensionSide`, `resultLabelMode`, `reactionLabels` | mint a `StructurePlot` esetén | Jelentésük ugyanaz, mint a komponens propjaié |

A `PRINT_COLORS` az EduBeam alkalmazás színei fehér alapon: tinta `#16182b`, normálerő `#2222ff`, nyíróerő `#00af00`, hajlítónyomaték `#ff2222`, terhek `#ff8700`, támaszerők `#a020f0`. Minden felirat kétszer íródik ki, a szöveg alatt háttérszínű körvonallal, mert nem minden SVG-program ismeri a `paint-order` tulajdonságot; az alsó index pedig, mint az *A<sub>x</sub>* támaszerőnévben, egyszerű számokat tartalmazó `tspan`, amelyet a Word és az Inkscape is helyesen olvas. `reserve` nélkül a fájl a kirajzolt rétegekhez igazodik.

A fájl felhasználása:

- **Word és PowerPoint** (2019 és Microsoft 365): *Beszúrás › Képek*.
- **LaTeX**: alakítsd PDF-fé a [CairoSVG](https://cairosvg.org) (`cairosvg frame.svg -o frame.pdf`) vagy az Inkscape segítségével, majd használd az `\includegraphics` parancsot; vagy használd az `svg` csomag `\includesvg` parancsát, amely helyetted hívja meg az Inkscape-et. 640 egységes szélesség mellett egy 16 cm-es szövegoszlopba illesztett rajz feliratai 9 pt-osak.
- **Weboldal Vue nélkül**: illeszd be a szöveget a HTML-be. Lásd: [Vue nélkül](/hu/plot/embedding#plain-html-from-node).

A [Feladatok és dolgozatok](/hu/plot/exercises#figures-for-latex-and-word) oldal minden hallgató feladatához és megoldókulcsához kiír egy fájlt.

## Számítómagból {#from-a-solver}

| Export | Szignatúra | Mit csinál |
| --- | --- | --- |
| `modelFromSolver` | `(solver: Solver, options?: FromSolverOptions) => PlotModel` | Egy számítómagot [a rajz egyszerű modelljébe](/hu/plot/model) olvas ki; eredményeket csak kiszámított terhelési esetre ad |
| `FromSolverOptions` | típus | `{ loadCase?: number }`, index a `solver.loadCases` tömbben |

## Szakaszonként definiált polinomok {#piecewise-polynomials}

Egy rúd eredményei `Piecewise` értékek: `{ x0, x1, c }` szakaszok listái, amelyeket az [A rajz modellje](/hu/plot/model#piecewise-polynomials) oldal ismertet. A `side` a közvetlenül előtte (`'left'`) vagy közvetlenül utána (`'right'`, ez az alapérték) lévő értéket választja ott, ahol két szakasz találkozik.

| Export | Szignatúra | Mit csinál |
| --- | --- | --- |
| `valueAt` | `(pw, x, side?) => number` | Az érték `x`-ben; a végeken túl a legközelebbi végponti érték |
| `slopeAt` | `(pw, x, side?) => number` | A derivált, értékegység/méter |
| `extremes` | `(pw) => { max: Extreme; min: Extreme } \| null` | A legnagyobb és a legkisebb érték pontosan, mindkettő `{ x, value, side }` alakban |
| `maxAbs` | `(pw) => number` | A legnagyobb abszolút érték |
| `innerBreaks` | `(pw) => number[]` | A szakaszok találkozási helyei, a két vég nélkül |
| `isZero` | `(pw) => boolean` | Mindenütt nulla-e az eredmény |
| `evalPiece` | `(piece, x) => number` | Egy szakasz értéke |
| `evalPieceSlope` | `(piece, x) => number` | Egy szakasz meredeksége |
| `pieceExtrema` | `(piece) => number[]` | Ahol egy szakasz meredeksége nulla, m |
| `pieceDegree` | `(piece) => number \| null` | Egy szakasz fokszáma; `null`, ha a szakasz nulla |
| `cleanPiecewise` | `(pw, tolerance) => Piecewise` | Elhagyja a `tolerance` alatti együtthatókat, vagyis a kiszámított modell kerekítési hibáit |
| `fitPiece` | `(f, x0, x1, degree) => Piece` | Adott fokszámú polinom egy függvényre illesztve az `(x0, x1)` intervallumon |
| `pieceToBeziers` | `(piece, segments?) => CubicSegment[]` | A szakasz harmadfokú Bézier-görbékként (x, érték) koordinátákban: harmadfokú polinomig pontosan, egyébként `segments` darab görbével, alapértelmezés szerint 4-gyel |

Típusok: `Piece`, `Piecewise`, `Side` (`'left' \| 'right'`), `Extreme`, `CubicSegment`.

## Mértékegységek és számok {#units-and-numbers}

| Export | Szignatúra | Mit csinál |
| --- | --- | --- |
| `KN_UNITS` | `Units` | kN, kNm, kN/m, m, mm, mrad, K: az alapérték |
| `SI_UNITS` | `Units` | N, N·m, N/m, m, m, rad, K |
| `resolveUnits` | `(units?: Partial<Units>) => Units` | `KN_UNITS` a te módosításaiddal |
| `DEFAULT_NUMBER_FORMAT` | `Intl.NumberFormat` | Angol, legfeljebb egy tizedesjegy |
| `formatNumber` | `(value, format?) => string` | A szám valódi mínuszjellel, soha nem −0 |
| `formatQuantity` | `(si, unit, format?) => string` | `"36 kN"`: SI-érték az adott mértékegységben, keskeny nem törhető szóközzel |

Egy `Unit` alakja `{ symbol, scale }`, ahol a megjelenített érték = SI-érték × `scale`. A `Units` minden `UnitKind` fajtához tartalmaz egyet: `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` és `temperature`.

```ts
import { formatQuantity, KN_UNITS } from '@edubeam/plot'

formatQuantity(-37500, KN_UNITS.moment) // "−37.5 kNm"
```

## Értékek leolvasása {#reading-values}

| Export | Szignatúra | Mit csinál |
| --- | --- | --- |
| `readMember` | `(results: MemberResults, x, snap?) => { x, u, values }` | N, V, M és w az `x` helyen, mindegyik `{ left, right }` alakban, valamint az `u` tengelyirányú elmozdulás; `snap` m-en belül egy ugráshoz illeszt |
| `readoutAt` | `(model, transform, px, py, reach) => Readout \| null` | A képernyő egy pontjához legközelebbi, `reach` px-en belüli rúd és az ott érvényes eredményei |
| `readoutMarks` | `(model, transform, readout, shown, k, side) => ReadoutMark[]` | Hol rajzolódnak ki a leolvasott értékek: minden látható ábra ordinátájának végén (ugrásnál mindkettőn) és a deformált alak pontján |
| `formatReadout` | `(readout, quantity, units, format?) => string` | `"M = 54 kNm"`, ugrásnál `"V = 13.3 → −6.7 kN"` |

A `k` eredményenként a px/SI-egység arány, a `side` pedig az, hogy melyik oldalra rajzolódik az egyes ábra; mindkettőt az alább ismertetett `diagramScales` és `diagramSide` adja. Típusok: `Readout`, `ReadoutMark` (`{ tone, from, to }` px-ben), `ReadoutQuantity` (`'N' \| 'V' \| 'M' \| 'w'`), `SidedValue`.

## Tartóvonalak {#beam-lines}

A [DiagramStack](/hu/plot/diagram-stack) építőelemei, ha saját, egymás alá rendezett ábrákból álló rajzot akarsz készíteni.

| Export | Szignatúra | Mit csinál |
| --- | --- | --- |
| `beamLine` | `(model, ids?) => BeamLine` | A rudak egyetlen vízszintes vonalként, balról jobbra; minden más esetben kivételt dob |
| `lineDiagram` | `(model, line, row) => Piecewise` | Egy eredmény a teljes vonal mentén, a vonal x koordinátájában |
| `rowRange` | `(pw) => [number, number]` | A tartomány, amelyre egy sor skálázódik, mindig a nullát is beleértve |
| `rowPeaks` | `(pw) => RowPeak[]` | Azok a szélső értékek, amelyeket érdemes kiírni egy sorban |
| `rowBreaks` | `(pw) => number[]` | Ahol az eredmény lefutása megtörik: támaszok, rúdcsatlakozások és koncentrált erők |
| `rowOutline` | `(pw, sx, sy, close) => string` | Egy sor körvonalának SVG-útvonaladatai, a méterből és az értékből px-be képező leképezések ismeretében |
| `rowOrdinates` | `(pw, sx, sy, spacing) => string` | A vonalkázó ordináták SVG-útvonaladatai, egymástól `spacing` px-re |
| `lineModel` | `(model, line, omit?) => PlotModel` | A vonalra szűkített modell, opcionálisan egy teher nélkül |
| `pointLoadAt` | `(model, line, at) => PlotLoad \| undefined` | A koncentrált erő a vonal `at` helyén |

Típusok: `BeamLine`, `LineMember`, `RowPeak`, `StackRow`.

A [DiagramStack](/hu/plot/diagram-stack#a-load-the-reader-can-drag) oldal a `beamLine`, a `lineDiagram` és a `rowRange` segítségével tartja meg minden sor léptékét a mozgó erő összes helyzetére.

## Geometria és támaszok {#geometry-and-supports}

| Export | Szignatúra | Mit csinál |
| --- | --- | --- |
| `nodeMap` | `(model) => ReadonlyMap<string, PlotNode>` | A csomópontok azonosító szerint |
| `memberFrame` | `(model, member, nodes?) => MemberFrame` | Egy rúd kezdőpontja, érintő irányú egységvektora, lokális z irányú egységvektora és hossza |
| `memberFrames` | `(model) => Map<string, MemberFrame>` | Ugyanez minden rúdra, azonosító szerint |
| `pointAlong` | `(frame, at) => { x, z }` | A rúd mentén `at` méterre lévő pont |
| `supportKind` | `(fixity) => SupportKind` | `'fixed'`, `'pin'`, `'roller'`, `'slider'`, `'rotation'` vagy `'none'` |
| `supportPlacement` | `(model, node) => SupportPlacement` | Egy csomópont jele és annak az óramutató járásával megegyező elforgatása, fokban |
| `supportGlyph` | `(kind) => readonly GlyphPart[]` | A jel vonalai, px-ben |
| `glyphReach` | `(kind, rotation, x, z) => number` | Milyen messzire nyúlik egy elforgatott jel egy adott irányban, px |

## Rajzolás {#drawing}

A rajzolás három lépésben történik. A `buildStructureScene` a modellt jelenetelemekké alakítja: modellpontokká, képernyőpixelben megadott eltolásokkal. A `fitScene` megkeresi azt a léptéket és eltolást, amellyel ezek elférnek egy téglalapban. A `resolveScene` SVG-útvonaladatokká, körökké és azokká a feliratokká alakítja őket, amelyeknek jut hely. A `layoutStructure` mindhárom lépést úgy futtatja, ahogy a `StructurePlot` és a `structureSvg`, így a saját rajzod ugyanúgy rendeződik el, mint az övék.

| Export | Szignatúra | Mit csinál |
| --- | --- | --- |
| `layoutStructure` | `(model, options, box, shown?, labelModes?) => StructureLayout` | A teljes elrendezés: illesztés minden felirattal, a zsúfolt feliratok elhagyása, újabb illesztés. Visszatérési értéke `{ fit, items, resolved }` |
| `structureSvg` | `(model, options?) => string` | Önálló `.svg` fájl: [lásd fent](#a-standalone-svg-file) |
| `buildStructureScene` | `(model, options: StructureSceneOptions) => SceneItem[]` | A kiválasztott rétegek rajza adott léptékben, px/méter |
| `fitScene` | `(items, box: FitBox) => Fit` | Lépték és eltolás, hogy a jelenet elférjen a `{ width, height?, maxHeight?, padding, fontSize }` téglalapban |
| `resolveScene` | `(items, transform, options: ResolveOptions) => ResolvedScene` | `{ paths, circles, texts }` px-ben, az elférő feliratokkal |
| `placeLabels` | `(items, transform, options: ResolveOptions) => Map<SceneText, SceneText>` | Mely feliratok maradjanak meg, és hol |
| `alternativeResultGroups` | `(shown) => ReadonlySet<string>` | Az egyenként megjelenített eredményrétegek, amelyek feliratai engednek a többinek, de egymásnak nem |
| `sceneBounds` | `(items, scale, fontSize) => Bounds` | A jelenet kiterjedése, px |
| `project` | `(transform, anchor) => [number, number]` | Egy jelenetpont a képernyőn, px |
| `defaultResultLayer` | `(model) => ResultLayer \| null` | Az eredmény, amelyet a rajz mutat, ha nincs megadva konkrét eredmény |
| `diagramScales` | `(model, options) => Record<ResultLayer, number>` | px/SI-egység minden eredményre |
| `diagramSide` | `(q, momentOnTensionSide) => 1 \| -1` | A rúd melyik oldalára rajzolódik a pozitív érték |
| `isBarStructure` | `(model, memberResults) => boolean` | Az N számként íródik-e ki a rudak mentén (rácsos tartó), nem pedig ábraként rajzolódik |
| `tipPlacements` | `(tip, out, mode, gaps?) => TextPlacement[]` | A helyek, amelyeket egy érték az ordináta végén túl elfoglalhat |
| `PLOT_LAYERS` | `readonly PlotLayer[]` | Minden réteg, rajzolási sorrendben |
| `RESULT_LAYERS` | `['N', 'V', 'M', 'w']` | Az eredményrétegek |
| `HATCH_SPACING_PX` | `7` | Az ábraordináták távolsága, px |
| `DEFAULT_COLORS` | `PlotColors` | Minden tónus alapértelmezett színe CSS-ként: [Témák és színek](/hu/plot/theming) |
| `PRINT_COLORS` | `Record<Tone \| 'paper', string>` | Egyszerű színek fájlhoz: az alkalmazás színei fehér alapon |
| `toneVars` | `(colors?) => Record<string, string>` | A CSS-változók, amelyeket a rajz a gyökérelemén beállít |
| `PLOT_CSS` | `string` | Az egyes rajzokba beágyazott CSS-szabályok |

A `ResolveOptions` alakja `{ fontSize, viewport?, exclude?, alternativeGroups?, shields? }`: a `shields` azok a csoportok, amelyek vonalai távol tartják a feliratokat (a látható ábrák); ha elhagyod, az összes csoport. A `layoutStructure` függvényben az `options.layers` az elrendezendő rétegek (minden, ami megjelenhet, mint a `reserve`), a `shown` a láthatók, a `labelModes` pedig azok a feliratstílusok, amelyeknek helyet kell hagyni.

Típusok: `StructureSceneOptions`, `StructureLayout`, `StructureSvgOptions`, `SceneItem`, `SceneText`, `TextPlacement`, `ResolvedScene`, `ResolvedPath`, `ResolvedText`, `ResolvedCircle`, `ResolveOptions`, `Bounds`, `Anchor`, `Transform`, `Fit`, `FitBox`, `Tone`, `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `SupportKind`, `SupportPlacement`, `GlyphPart`, valamint az [A rajz modellje](/hu/plot/model) oldal modelltípusai.
