---
title: Funcții
description: "Funcțiile, constantele și tipurile exportate de @edubeam/plot pe lângă componente: structureSvg pentru fișiere SVG, rezultate exacte, unități, linii de grindă și așezare."
order: 10
source: site
---

# Funcții

Tot ce desenează componentele vine din funcții pure, fără Vue în ele. Ele scriu o figură ca fișier SVG, citesc exact rezultatele, pregătesc datele dinainte și construiesc figuri proprii. Importurile cu nume păstrează bundle-ul mic: o pagină care importă doar `modelFromSolver` nu primește deloc cod de componente.

Toate valorile sunt în SI, dacă nu se indică altă unitate; pozițiile de-a lungul unei bare sunt în metri de la nodul ei de început.

## Un fișier SVG de sine stătător {#a-standalone-svg-file}

Un desen dintr-o pagină își ia culorile din variabilele CSS ale paginii, așa că un `<svg>` copiat din el nu are nicio culoare. `structureSvg` scrie în schimb figura ca textul unui fișier `.svg` de sine stătător: culori simple, fără foaie de stiluri, fără scripturi, așezat de aceeași rutină ca `StructurePlot`. Word, PowerPoint, Inkscape, CairoSVG și instrumentele LaTeX îl desenează la fel ca pagina.

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts' // () => un LinearStaticSolver calculat, ca pe pagina Slide-uri și note de curs

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![Cadrul portal ca fișier SVG de sine stătător, randat cu CairoSVG: încărcările, reacțiunile, 20 și 40 în sus și 2,3 și 12,7 pe orizontală, și momentul încovoietor de la −50,7 în C la 29,3 în riglă](/screenshots/ro/p2p-plot-frame-svg.webp){.shot-lg}

| Opțiune | Implicit | Ce face |
| --- | --- | --- |
| `layers` | bare, reazeme, încărcări, reacțiuni și rezultatul pe care l-ar alege `StructurePlot` | Ce se desenează |
| `width` | `640` | Lățimea în px (unitățile de utilizator ale SVG-ului) |
| `height` | urmează desenul | O înălțime fixă, px |
| `maxHeight` | max(320, 0.75 × width) | Limita superioară a înălțimii automate |
| `padding` | `6` | Spațiul din jurul desenului, px |
| `fontSize` | `13`, compact `11.5` | Mărimea textului, px |
| `fontFamily` | `Helvetica, Arial, sans-serif` | O listă de fonturi pe care le are programul care deschide fișierul |
| `colors` | `PRINT_COLORS` | Oricare dintre tonuri, ca culori simple |
| `background` | `true` | Colorează fundalul cu `paper`; `false` îl lasă transparent |
| `title` | niciunul | Scris ca `<title>` al SVG-ului |
| `reserve`, `reserveLabelModes`, `reserveReactionLabels` | niciunul | Straturi, stiluri de etichete și stiluri de etichete ale reacțiunilor pentru care se păstrează loc pe lângă cele desenate, ca fișierele unei construcții pas cu pas să se suprapună exact: [Construcție pas cu pas în Beamer](/ro/plot/slides#a-build-up-in-beamer) |
| `units`, `numberFormat`, `compact`, `diagramSize`, `deformedSize`, `momentOnTensionSide`, `resultLabelMode`, `reactionLabels` | ca la `StructurePlot` | Aceeași semnificație ca props-urile componentei |

`PRINT_COLORS` sunt culorile aplicației EduBeam pe alb: cerneala `#16182b`, forța axială `#2222ff`, forța tăietoare `#00af00`, momentul încovoietor `#ff2222`, încărcările `#ff8700`, reacțiunile `#a020f0`. Fiecare etichetă este scrisă de două ori, cu un contur în culoarea fundalului sub text, pentru că nu orice program SVG înțelege `paint-order`, iar un indice, ca în denumirile reacțiunilor *A<sub>x</sub>*, este un `tspan` cu numere simple, pe care Word și Inkscape le citesc corect. Fără `reserve`, un fișier este încadrat pe straturile pe care le desenează.

Cum folosești fișierul:

- **Word și PowerPoint** (2019 și Microsoft 365): *Inserare › Imagini*.
- **LaTeX**: convertește-l în PDF cu [CairoSVG](https://cairosvg.org) (`cairosvg frame.svg -o frame.pdf`) sau cu Inkscape, apoi `\includegraphics`; sau folosește `\includesvg` din pachetul `svg`, care apelează Inkscape în locul tău. La 640 de unități lățime, o figură așezată pe o coloană de text de 16 cm are etichete de 9 pt.
- **O pagină web fără Vue**: lipește textul în HTML. Vezi [Fără Vue](/ro/plot/embedding#plain-html-from-node).

Scriptul de pe pagina [Exerciții și teste](/ro/plot/exercises#figures-for-latex-and-word) scrie câte un fișier pentru exercițiul și baremul fiecărui student.

## Dintr-un solver {#from-a-solver}

| Export | Semnătură | Ce face |
| --- | --- | --- |
| `modelFromSolver` | `(solver: Solver, options?: FromSolverOptions) => PlotModel` | Transformă un `solver` în [modelul de desen](/ro/plot/model) simplu; rezultate doar pentru un caz de încărcare calculat |
| `FromSolverOptions` | tip | `{ loadCase?: number }`, un index în `solver.loadCases` |

## Polinoame pe porțiuni {#piecewise-polynomials}

Rezultatele unei bare sunt valori `Piecewise`: liste de porțiuni `{ x0, x1, c }`, explicate în [Modelul desenului](/ro/plot/model#piecewise-polynomials). `side` alege valoarea imediat înainte (`'left'`) sau imediat după (`'right'`, implicit) un punct în care se întâlnesc două porțiuni.

| Export | Semnătură | Ce face |
| --- | --- | --- |
| `valueAt` | `(pw, x, side?) => number` | Valoarea în `x`; dincolo de capete, valoarea de la cel mai apropiat capăt |
| `slopeAt` | `(pw, x, side?) => number` | Derivata, în unități ale valorii pe metru |
| `extremes` | `(pw) => { max: Extreme; min: Extreme } \| null` | Cea mai mare și cea mai mică valoare, exact, fiecare ca `{ x, value, side }` |
| `maxAbs` | `(pw) => number` | Cea mai mare valoare absolută |
| `innerBreaks` | `(pw) => number[]` | Punctele în care se întâlnesc porțiunile, fără cele două capete |
| `isZero` | `(pw) => boolean` | Dacă rezultatul este zero peste tot |
| `evalPiece` | `(piece, x) => number` | Valoarea unei porțiuni |
| `evalPieceSlope` | `(piece, x) => number` | Panta unei porțiuni |
| `pieceExtrema` | `(piece) => number[]` | Punctele în care panta unei porțiuni este zero, m |
| `pieceDegree` | `(piece) => number \| null` | Gradul unei porțiuni; `null` când este nulă |
| `cleanPiecewise` | `(pw, tolerance) => Piecewise` | Elimină coeficienții sub `tolerance`, adică erorile de rotunjire ale unui model calculat |
| `fitPiece` | `(f, x0, x1, degree) => Piece` | Polinomul de un anumit grad care aproximează o funcție pe `(x0, x1)` |
| `pieceToBeziers` | `(piece, segments?) => CubicSegment[]` | Porțiunea ca curbe Bézier cubice în (x, valoare): exact până la gradul trei, altfel `segments` curbe, implicit 4 |

Tipuri: `Piece`, `Piecewise`, `Side` (`'left' \| 'right'`), `Extreme`, `CubicSegment`.

## Unități și numere {#units-and-numbers}

| Export | Semnătură | Ce face |
| --- | --- | --- |
| `KN_UNITS` | `Units` | kN, kNm, kN/m, m, mm, mrad, K: implicit |
| `SI_UNITS` | `Units` | N, N·m, N/m, m, m, rad, K |
| `resolveUnits` | `(units?: Partial<Units>) => Units` | `KN_UNITS` cu modificările tale |
| `DEFAULT_NUMBER_FORMAT` | `Intl.NumberFormat` | Engleză, cel mult o zecimală |
| `formatNumber` | `(value, format?) => string` | Numărul cu un semn minus adevărat, niciodată −0 |
| `formatQuantity` | `(si, unit, format?) => string` | `"36 kN"`: o valoare SI într-o unitate, cu un spațiu îngust neseparabil |

Un `Unit` este `{ symbol, scale }`, iar valoarea afișată = valoarea SI × `scale`. `Units` are câte una pentru fiecare `UnitKind`: `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` și `temperature`.

```ts
import { formatQuantity, KN_UNITS } from '@edubeam/plot'

formatQuantity(-37500, KN_UNITS.moment) // "−37.5 kNm"
```

## Citirea valorilor {#reading-values}

| Export | Semnătură | Ce face |
| --- | --- | --- |
| `readMember` | `(results: MemberResults, x, snap?) => { x, u, values }` | N, V, M și w în `x`, fiecare ca `{ left, right }`, și deplasarea axială `u`; se aliniază la un salt aflat la cel mult `snap` m |
| `readoutAt` | `(model, transform, px, py, reach) => Readout \| null` | Bara cea mai apropiată de un punct de pe ecran, în raza de `reach` px, și rezultatele ei în acel loc |
| `readoutMarks` | `(model, transform, readout, shown, k, side) => ReadoutMark[]` | Unde se desenează valorile citite: vârful ordonatei fiecărei diagrame afișate (ambele, la un salt) și punctul de pe deformată |
| `formatReadout` | `(readout, quantity, units, format?) => string` | `"M = 54 kNm"` sau, la un salt, `"V = 13.3 → −6.7 kN"` |

`k` este numărul de px pe unitate SI pentru fiecare rezultat, iar `side` este partea pe care se desenează fiecare diagramă; ambele vin din `diagramScales` și `diagramSide`, descrise mai jos. Tipuri: `Readout`, `ReadoutMark` (`{ tone, from, to }` în px), `ReadoutQuantity` (`'N' \| 'V' \| 'M' \| 'w'`), `SidedValue`.

## Linii de grindă {#beam-lines}

Piesele din care e construit [DiagramStack](/ro/plot/diagram-stack), pentru o figură proprie cu diagrame suprapuse.

| Export | Semnătură | Ce face |
| --- | --- | --- |
| `beamLine` | `(model, ids?) => BeamLine` | Barele ca o singură linie orizontală, de la stânga la dreapta; aruncă o excepție în orice alt caz |
| `lineDiagram` | `(model, line, row) => Piecewise` | Un rezultat de-a lungul întregii linii, în coordonata x a liniei |
| `rowRange` | `(pw) => [number, number]` | Domeniul la care este scalat un rând, care include mereu zero |
| `rowPeaks` | `(pw) => RowPeak[]` | Extremele care merită scrise pe un rând |
| `rowBreaks` | `(pw) => number[]` | Punctele în care rezultatul are o frântură: reazeme, îmbinări și forțe concentrate |
| `rowOutline` | `(pw, sx, sy, close) => string` | Datele de traseu SVG ale conturului unui rând, date fiind transformările din m și din valoare în px |
| `rowOrdinates` | `(pw, sx, sy, spacing) => string` | Datele de traseu SVG ale ordonatelor de hașură, la distanță de `spacing` px |
| `lineModel` | `(model, line, omit?) => PlotModel` | Modelul redus la linie, opțional fără o încărcare |
| `pointLoadAt` | `(model, line, at) => PlotLoad \| undefined` | Forța concentrată din poziția `at` de pe linie |

Tipuri: `BeamLine`, `LineMember`, `RowPeak`, `StackRow`.

Pagina [DiagramStack](/ro/plot/diagram-stack#a-load-the-reader-can-drag) folosește `beamLine`, `lineDiagram` și `rowRange` ca să păstreze scara fiecărui rând pentru toate pozițiile unei forțe mobile.

## Geometrie și reazeme {#geometry-and-supports}

| Export | Semnătură | Ce face |
| --- | --- | --- |
| `nodeMap` | `(model) => ReadonlyMap<string, PlotNode>` | Nodurile după identificator |
| `memberFrame` | `(model, member, nodes?) => MemberFrame` | Începutul unei bare, versorul tangentei, versorul axei locale z și lungimea |
| `memberFrames` | `(model) => Map<string, MemberFrame>` | Același lucru pentru fiecare bară, după identificator |
| `pointAlong` | `(frame, at) => { x, z }` | Punctul aflat la `at` metri de-a lungul unei bare |
| `supportKind` | `(fixity) => SupportKind` | `'fixed'`, `'pin'`, `'roller'`, `'slider'`, `'rotation'` sau `'none'` |
| `supportPlacement` | `(model, node) => SupportPlacement` | Simbolul pentru un nod și rotirea lui în sens orar, în grade |
| `supportGlyph` | `(kind) => readonly GlyphPart[]` | Liniile simbolului, în px |
| `glyphReach` | `(kind, rotation, x, z) => number` | Cât de departe ajunge un simbol rotit într-o direcție, px |

## Desenare {#drawing}

Desenarea are trei pași. `buildStructureScene` transformă un model în elemente de scenă: puncte ale modelului cu decalaje în pixeli de ecran. `fitScene` găsește scara și decalajul cu care acestea încap într-un dreptunghi. `resolveScene` le transformă în date de traseu SVG, cercuri și etichetele care au loc. `layoutStructure` rulează toți cei trei pași așa cum o fac `StructurePlot` și `structureSvg`, așa că o figură proprie este așezată la fel ca ale lor.

| Export | Semnătură | Ce face |
| --- | --- | --- |
| `layoutStructure` | `(model, options, box, shown?, labelModes?) => StructureLayout` | Întreaga așezare: încadrare cu toate etichetele, eliminarea etichetelor înghesuite, încă o încadrare. Întoarce `{ fit, items, resolved }` |
| `structureSvg` | `(model, options?) => string` | Un fișier `.svg` de sine stătător: [mai sus](#a-standalone-svg-file) |
| `buildStructureScene` | `(model, options: StructureSceneOptions) => SceneItem[]` | Desenul straturilor alese la o anumită scară, px pe metru |
| `fitScene` | `(items, box: FitBox) => Fit` | Scara și decalajul pentru încadrarea într-un dreptunghi `{ width, height?, maxHeight?, padding, fontSize }` |
| `resolveScene` | `(items, transform, options: ResolveOptions) => ResolvedScene` | `{ paths, circles, texts }` în px, cu etichetele care încap |
| `placeLabels` | `(items, transform, options: ResolveOptions) => Map<SceneText, SceneText>` | Ce etichete se păstrează și unde |
| `alternativeResultGroups` | `(shown) => ReadonlySet<string>` | Straturile de rezultate afișate pe rând, ale căror etichete le fac loc celorlalte, dar nu și unele altora |
| `sceneBounds` | `(items, scale, fontSize) => Bounds` | Întinderea unei scene, px |
| `project` | `(transform, anchor) => [number, number]` | Un punct al scenei pe ecran, px |
| `defaultResultLayer` | `(model) => ResultLayer \| null` | Rezultatul afișat de un desen când nu se cere niciunul |
| `diagramScales` | `(model, options) => Record<ResultLayer, number>` | Numărul de px pe unitate SI pentru fiecare rezultat |
| `diagramSide` | `(q, momentOnTensionSide) => 1 \| -1` | Partea barei pe care se desenează o valoare pozitivă |
| `isBarStructure` | `(model, memberResults) => boolean` | Dacă N se scrie ca numere de-a lungul barelor (grindă cu zăbrele), în loc să fie desenat ca diagramă |
| `tipPlacements` | `(tip, out, mode, gaps?) => TextPlacement[]` | Pozițiile pe care le poate ocupa o valoare dincolo de vârful unei ordonate |
| `PLOT_LAYERS` | `readonly PlotLayer[]` | Toate straturile, în ordinea desenării |
| `RESULT_LAYERS` | `['N', 'V', 'M', 'w']` | Straturile de rezultate |
| `HATCH_SPACING_PX` | `7` | Distanța dintre ordonatele diagramei, px |
| `DEFAULT_COLORS` | `PlotColors` | Culoarea implicită a fiecărui ton, ca CSS: [Teme și culori](/ro/plot/theming) |
| `PRINT_COLORS` | `Record<Tone \| 'paper', string>` | Culori simple pentru un fișier, cele ale aplicației pe alb |
| `toneVars` | `(colors?) => Record<string, string>` | Variabilele CSS pe care un desen le setează pe elementul său rădăcină |
| `PLOT_CSS` | `string` | Regulile CSS incluse în fiecare desen |

`ResolveOptions` sunt `{ fontSize, viewport?, exclude?, alternativeGroups?, shields? }`: `shields` sunt grupurile ale căror linii țin etichetele la distanță (diagramele afișate); dacă lipsesc, toate grupurile. În `layoutStructure`, `options.layers` sunt straturile de așezat (tot ce poate fi afișat, ca la `reserve`), `shown` cele afișate, iar `labelModes` stilurile de etichete pentru care se păstrează loc.

Tipuri: `StructureSceneOptions`, `StructureLayout`, `StructureSvgOptions`, `SceneItem`, `SceneText`, `TextPlacement`, `ResolvedScene`, `ResolvedPath`, `ResolvedText`, `ResolvedCircle`, `ResolveOptions`, `Bounds`, `Anchor`, `Transform`, `Fit`, `FitBox`, `Tone`, `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `SupportKind`, `SupportPlacement`, `GlyphPart` și tipurile modelului din [Modelul desenului](/ro/plot/model).
