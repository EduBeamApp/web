---
title: Funzioni
description: "Funzioni, costanti e tipi che @edubeam/plot 0.2.0 esporta oltre ai componenti: structureSvg per file SVG, lettura esatta dei risultati, unità, linee di trave e impaginazione."
order: 10
source: site
---

# Funzioni

Tutto ciò che i componenti disegnano proviene da funzioni pure, senza Vue. Servono a scrivere una figura come file SVG, a leggere i risultati esattamente, a preparare i dati in anticipo e a costruire figure tue. Con gli import nominali il bundle resta piccolo: una pagina che importa solo `modelFromSolver` non riceve alcun codice dei componenti.

Tutti i valori sono in SI salvo dove un’unità indica altro; le posizioni lungo un’asta sono in metri dal suo nodo iniziale.

## Un file SVG autonomo {#a-standalone-svg-file}

Una figura in una pagina prende i colori dalle proprietà personalizzate CSS della pagina, quindi un `<svg>` copiato da lì non ne ha. `structureSvg` scrive invece la figura come testo di un file `.svg` autonomo: colori fissi, nessun foglio di stile, nessuno script, impaginato dalla stessa routine di `StructurePlot`. Word, PowerPoint, Inkscape, CairoSVG e gli strumenti della catena LaTeX lo disegnano come la pagina.

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts' // () => un LinearStaticSolver risolto, come nella pagina Slide e dispense

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![Il telaio a portale come file SVG autonomo, reso con CairoSVG: i carichi, le reazioni, 20 e 40 verso l’alto e 2,3 e 12,7 orizzontali, e il momento flettente da −50,7 in C a 29,3 nella trave](/screenshots/it/p2p-plot-frame-svg.webp){.shot-lg}

| Opzione | Predefinito | Che cosa fa |
| --- | --- | --- |
| `layers` | aste, vincoli, carichi, reazioni e il risultato che sceglierebbe `StructurePlot` | Che cosa disegnare |
| `width` | `640` | Larghezza in px, le unità utente dell’SVG |
| `height` | segue il disegno | Un’altezza fissa, px |
| `maxHeight` | max(320, 0.75 × width) | Il limite superiore dell’altezza automatica |
| `padding` | `6` | Spazio attorno al disegno, px |
| `fontSize` | `13`, compact `11.5` | Dimensione del testo, px |
| `fontFamily` | `Helvetica, Arial, sans-serif` | Una lista di font disponibili nel programma che apre il file |
| `colors` | `PRINT_COLORS` | Qualsiasi tono, come colore fisso |
| `background` | `true` | Colora lo sfondo con `paper`; `false` lo lascia trasparente |
| `title` | nessuno | Scritto come `<title>` dell’SVG |
| `reserve`, `reserveLabelModes`, `reserveReactionLabels` | nessuno | Livelli, stili delle etichette e stili delle etichette delle reazioni per cui lasciare spazio oltre a quelli disegnati, così i file di una sequenza progressiva sono allineati: [Una figura progressiva in Beamer](/it/plot/slides#a-build-up-in-beamer) |
| `units`, `numberFormat`, `compact`, `diagramSize`, `deformedSize`, `momentOnTensionSide`, `resultLabelMode`, `reactionLabels` | come `StructurePlot` | Lo stesso significato delle props del componente |

`PRINT_COLORS` sono i colori dell’app EduBeam su sfondo bianco: inchiostro (`ink`) `#16182b`, sforzo normale `#2222ff`, taglio `#00af00`, momento flettente `#ff2222`, carichi `#ff8700`, reazioni `#a020f0`. Ogni etichetta è scritta due volte, con un alone del colore dello sfondo sotto il testo, perché non tutti i programmi SVG supportano `paint-order`; un pedice, come nei nomi delle reazioni *A<sub>x</sub>*, è un `tspan` con numeri semplici che Word e Inkscape leggono. Senza `reserve`, un file è adattato ai livelli che disegna.

Per usare il file:

- **Word e PowerPoint** (2019 e Microsoft 365): *Inserisci › Immagini*.
- **LaTeX**: convertilo in PDF con [CairoSVG](https://cairosvg.org) (`cairosvg frame.svg -o frame.pdf`) o con Inkscape, poi usa `\includegraphics`; oppure usa `\includesvg` del pacchetto `svg`, che chiama Inkscape al posto tuo. Con 640 unità di larghezza, una figura portata a una colonna di testo di 16 cm ha etichette di 9 pt.
- **Una pagina web senza Vue**: incolla il testo nell’HTML. Vedi [Senza Vue](/it/plot/embedding#plain-html-from-node).

[Esercizi e compiti](/it/plot/exercises#figures-for-latex-and-word) scrive un file per l’esercizio e la soluzione di ogni studente.

## Da un solutore {#from-a-solver}

| Export | Firma | Che cosa fa |
| --- | --- | --- |
| `modelFromSolver` | `(solver: Solver, options?: FromSolverOptions) => PlotModel` | Legge un solutore nel semplice [modello di disegno](/it/plot/model); i risultati solo per un caso di carico risolto |
| `FromSolverOptions` | tipo | `{ loadCase?: number }`, un indice in `solver.loadCases` |

## Polinomi a tratti {#piecewise-polynomials}

I risultati di un’asta sono valori `Piecewise`: liste di tratti `{ x0, x1, c }`, descritte in [Modello di disegno](/it/plot/model#piecewise-polynomials). `side` sceglie il valore subito prima (`'left'`) o subito dopo (`'right'`, il predefinito) un punto in cui due tratti si incontrano.

| Export | Firma | Che cosa fa |
| --- | --- | --- |
| `valueAt` | `(pw, x, side?) => number` | Il valore in `x`; oltre le estremità, il valore dell’estremità più vicina |
| `slopeAt` | `(pw, x, side?) => number` | La derivata, in unità del valore per metro |
| `extremes` | `(pw) => { max: Extreme; min: Extreme } \| null` | Il valore massimo e minimo, esatti, ciascuno `{ x, value, side }` |
| `maxAbs` | `(pw) => number` | Il massimo valore assoluto |
| `innerBreaks` | `(pw) => number[]` | Dove si incontrano i tratti, escluse le due estremità |
| `isZero` | `(pw) => boolean` | Se il risultato è nullo ovunque |
| `evalPiece` | `(piece, x) => number` | Il valore di un singolo tratto |
| `evalPieceSlope` | `(piece, x) => number` | La pendenza di un singolo tratto |
| `pieceExtrema` | `(piece) => number[]` | Dove la pendenza di un tratto si annulla, m |
| `pieceDegree` | `(piece) => number \| null` | Il grado di un tratto; `null` se è nullo |
| `cleanPiecewise` | `(pw, tolerance) => Piecewise` | Elimina i coefficienti inferiori a `tolerance`, l’errore di arrotondamento di un modello risolto |
| `fitPiece` | `(f, x0, x1, degree) => Piece` | Il polinomio di un dato grado che approssima una funzione su `(x0, x1)` |
| `pieceToBeziers` | `(piece, segments?) => CubicSegment[]` | Il tratto come curve di Bézier cubiche in (x, valore): esatto fino al terzo grado, altrimenti `segments` curve, 4 per impostazione predefinita |

Tipi: `Piece`, `Piecewise`, `Side` (`'left' \| 'right'`), `Extreme`, `CubicSegment`.

## Unità e numeri {#units-and-numbers}

| Export | Firma | Che cosa fa |
| --- | --- | --- |
| `KN_UNITS` | `Units` | kN, kNm, kN/m, m, mm, mrad, K: il predefinito |
| `SI_UNITS` | `Units` | N, N·m, N/m, m, m, rad, K |
| `resolveUnits` | `(units?: Partial<Units>) => Units` | `KN_UNITS` con le tue modifiche |
| `DEFAULT_NUMBER_FORMAT` | `Intl.NumberFormat` | Inglese, al massimo un decimale |
| `formatNumber` | `(value, format?) => string` | Il numero con un vero segno meno, mai −0 |
| `formatQuantity` | `(si, unit, format?) => string` | `"36 kN"`: un valore SI in un’unità, con uno spazio stretto indivisibile |

Una `Unit` è `{ symbol, scale }`, con valore visualizzato = valore SI × `scale`. `Units` ne contiene una per ogni `UnitKind`: `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` e `temperature`.

```ts
import { formatQuantity, KN_UNITS } from '@edubeam/plot'

formatQuantity(-37500, KN_UNITS.moment) // "−37.5 kNm"
```

## Lettura dei valori {#reading-values}

| Export | Firma | Che cosa fa |
| --- | --- | --- |
| `readMember` | `(results: MemberResults, x, snap?) => { x, u, values }` | N, V, M e w in `x`, ciascuno `{ left, right }`, e lo spostamento assiale `u`; si aggancia a un salto entro `snap` m |
| `readoutAt` | `(model, transform, px, py, reach) => Readout \| null` | L’asta più vicina a un punto dello schermo entro `reach` px, e i suoi risultati in quel punto |
| `readoutMarks` | `(model, transform, readout, shown, k, side) => ReadoutMark[]` | Dove vengono disegnati i valori letti: l’estremità dell’ordinata di ogni diagramma visibile (entrambe in un salto), il punto sulla deformata |
| `formatReadout` | `(readout, quantity, units, format?) => string` | `"M = 54 kNm"`, oppure `"V = 13.3 → −6.7 kN"` in corrispondenza di un salto |

`k` sono i px per unità SI di ogni risultato e `side` il lato su cui è disegnato ogni diagramma, da `diagramScales` e `diagramSide` più sotto. Tipi: `Readout`, `ReadoutMark` (`{ tone, from, to }` in px), `ReadoutQuantity` (`'N' \| 'V' \| 'M' \| 'w'`), `SidedValue`.

## Linee di trave {#beam-lines}

I pezzi di [DiagramStack](/it/plot/diagram-stack), per costruire una tua figura con i diagrammi in colonna.

| Export | Firma | Che cosa fa |
| --- | --- | --- |
| `beamLine` | `(model, ids?) => BeamLine` | Le aste come un’unica linea orizzontale, da sinistra a destra; solleva un errore in ogni altro caso |
| `lineDiagram` | `(model, line, row) => Piecewise` | Un risultato lungo tutta la linea, nella x della linea |
| `rowRange` | `(pw) => [number, number]` | L’intervallo su cui è scalata una riga, che include sempre lo zero |
| `rowPeaks` | `(pw) => RowPeak[]` | Gli estremi che vale la pena scrivere su una riga |
| `rowBreaks` | `(pw) => number[]` | Dove il risultato si interrompe: vincoli, nodi e carichi concentrati |
| `rowOutline` | `(pw, sx, sy, close) => string` | Dati di path SVG del contorno di una riga, date le mappe da m e valore a px |
| `rowOrdinates` | `(pw, sx, sy, spacing) => string` | Dati di path SVG delle ordinate del tratteggio, a `spacing` px l’una dall’altra |
| `lineModel` | `(model, line, omit?) => PlotModel` | Il modello ridotto alla linea, facoltativamente senza un carico |
| `pointLoadAt` | `(model, line, at) => PlotLoad \| undefined` | La forza concentrata nella posizione `at` della linea |

Tipi: `BeamLine`, `LineMember`, `RowPeak`, `StackRow`.

La pagina [DiagramStack](/it/plot/diagram-stack#a-load-the-reader-can-drag) usa `beamLine`, `lineDiagram` e `rowRange` per mantenere la scala di ogni riga su tutte le posizioni di un carico mobile.

## Geometria e vincoli {#geometry-and-supports}

| Export | Firma | Che cosa fa |
| --- | --- | --- |
| `nodeMap` | `(model) => ReadonlyMap<string, PlotNode>` | I nodi per id |
| `memberFrame` | `(model, member, nodes?) => MemberFrame` | Inizio, tangente unitaria, z locale unitario e lunghezza di un’asta |
| `memberFrames` | `(model) => Map<string, MemberFrame>` | Lo stesso per ogni asta, per id |
| `pointAlong` | `(frame, at) => { x, z }` | Il punto a `at` metri lungo un’asta |
| `supportKind` | `(fixity) => SupportKind` | `'fixed'`, `'pin'`, `'roller'`, `'slider'`, `'rotation'` o `'none'` |
| `supportPlacement` | `(model, node) => SupportPlacement` | Il simbolo di un nodo e la sua rotazione in senso orario, in gradi |
| `supportGlyph` | `(kind) => readonly GlyphPart[]` | Le linee del simbolo, in px |
| `glyphReach` | `(kind, rotation, x, z) => number` | Fin dove arriva un simbolo ruotato lungo una direzione, px |

## Disegno {#drawing}

Il disegno avviene in tre passi. `buildStructureScene` trasforma un modello in elementi di scena: punti del modello con scostamenti in pixel sullo schermo. `fitScene` trova la scala e lo spostamento che li fanno stare in un riquadro. `resolveScene` li trasforma in dati di path SVG, cerchi e le etichette che hanno spazio. `layoutStructure` esegue tutti e tre i passi come fanno `StructurePlot` e `structureSvg`, così una figura tua viene impaginata come le loro.

| Export | Firma | Che cosa fa |
| --- | --- | --- |
| `layoutStructure` | `(model, options, box, shown?, labelModes?) => StructureLayout` | L’intera impaginazione: adatta con tutte le etichette, elimina quelle troppo affollate, adatta di nuovo. Restituisce `{ fit, items, resolved }` |
| `structureSvg` | `(model, options?) => string` | Un file `.svg` autonomo: [sopra](#a-standalone-svg-file) |
| `buildStructureScene` | `(model, options: StructureSceneOptions) => SceneItem[]` | Il disegno dei livelli scelti a una data scala, px per metro |
| `fitScene` | `(items, box: FitBox) => Fit` | Scala e spostamento per stare in un riquadro `{ width, height?, maxHeight?, padding, fontSize }` |
| `resolveScene` | `(items, transform, options: ResolveOptions) => ResolvedScene` | `{ paths, circles, texts }` in px, con le etichette che ci stanno |
| `placeLabels` | `(items, transform, options: ResolveOptions) => Map<SceneText, SceneText>` | Quali etichette tenere, e dove |
| `alternativeResultGroups` | `(shown) => ReadonlySet<string>` | I livelli dei risultati mostrati uno alla volta, le cui etichette cedono il posto al resto ma non tra loro |
| `sceneBounds` | `(items, scale, fontSize) => Bounds` | L’ingombro di una scena, px |
| `project` | `(transform, anchor) => [number, number]` | Un punto della scena sullo schermo, px |
| `defaultResultLayer` | `(model) => ResultLayer \| null` | Il risultato che una figura mostra quando non ne viene richiesto nessuno |
| `diagramScales` | `(model, options) => Record<ResultLayer, number>` | px per unità SI per ogni risultato |
| `diagramSide` | `(q, momentOnTensionSide) => 1 \| -1` | Su quale lato di un’asta si disegna un valore positivo |
| `isBarStructure` | `(model, memberResults) => boolean` | Se N viene scritto come numeri lungo le aste (una travatura reticolare) anziché disegnato come diagramma |
| `tipPlacements` | `(tip, out, mode, gaps?) => TextPlacement[]` | Le posizioni che un valore può occupare oltre l’estremità di un’ordinata |
| `PLOT_LAYERS` | `readonly PlotLayer[]` | Tutti i livelli, nell’ordine in cui vengono disegnati |
| `RESULT_LAYERS` | `['N', 'V', 'M', 'w']` | I livelli dei risultati |
| `HATCH_SPACING_PX` | `7` | La distanza tra le ordinate dei diagrammi, px |
| `DEFAULT_COLORS` | `PlotColors` | Il colore predefinito di ogni tono, in CSS: [Temi e colori](/it/plot/theming) |
| `PRINT_COLORS` | `Record<Tone \| 'paper', string>` | Colori fissi per un file, quelli dell’app su sfondo bianco |
| `toneVars` | `(colors?) => Record<string, string>` | Le proprietà personalizzate che una figura imposta sul suo elemento radice |
| `PLOT_CSS` | `string` | Le regole CSS incluse in ogni figura |

`ResolveOptions` sono `{ fontSize, viewport?, exclude?, alternativeGroups?, shields? }`: `shields` sono i gruppi le cui linee tengono lontane le etichette (i diagrammi visibili), tutti se l’opzione è omessa. In `layoutStructure`, `options.layers` sono i livelli da impaginare (tutto ciò che può essere mostrato, come `reserve`), `shown` quelli visibili e `labelModes` gli stili delle etichette per cui lasciare spazio.

Tipi: `StructureSceneOptions`, `StructureLayout`, `StructureSvgOptions`, `SceneItem`, `SceneText`, `TextPlacement`, `ResolvedScene`, `ResolvedPath`, `ResolvedText`, `ResolvedCircle`, `ResolveOptions`, `Bounds`, `Anchor`, `Transform`, `Fit`, `FitBox`, `Tone`, `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `SupportKind`, `SupportPlacement`, `GlyphPart` e i tipi del modello descritti in [Modello di disegno](/it/plot/model).
