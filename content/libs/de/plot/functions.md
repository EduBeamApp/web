---
title: Funktionen
description: "Funktionen, Konstanten und Typen von @edubeam/plot 0.2.0 neben den Komponenten: structureSvg, exakte Ergebnisse, Einheiten, Trägerlinien und eigene Abbildungen."
order: 10
---

# Funktionen

Alles, was die Komponenten zeichnen, stammt aus reinen Funktionen ohne Vue. Sie schreiben eine Abbildung als SVG-Datei, lesen Ergebnisse exakt ab, bereiten Daten im Voraus auf und bauen eigene Abbildungen. Benannte Importe halten das Bundle klein: Eine Seite, die nur `modelFromSolver` importiert, bekommt überhaupt keinen Komponentencode.

Alle Werte sind in SI, sofern keine Einheit etwas anderes angibt; Positionen entlang eines Stabs sind Meter ab seinem Anfangsknoten.

## Eine eigenständige SVG-Datei {#a-standalone-svg-file}

Eine Grafik auf einer Seite übernimmt ihre Farben aus den CSS-Variablen der Seite; ein daraus kopiertes `<svg>` hat also keine. `structureSvg` schreibt die Abbildung stattdessen als Text einer eigenständigen `.svg`-Datei: feste Farben, kein Stylesheet, keine Skripte, angeordnet von derselben Routine wie bei `StructurePlot`. Word, PowerPoint, Inkscape, CairoSVG und LaTeX-Toolchains stellen sie genauso dar wie die Seite.

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts' // () => ein berechneter LinearStaticSolver, wie auf der Seite „Folien und Skripte“

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![Der Portalrahmen als eigenständige SVG-Datei, gerendert mit CairoSVG: die Lasten, die Auflagerreaktionen, 20 und 40 nach oben und 2,3 und 12,7 horizontal, und das Biegemoment von −50,7 in C bis 29,3 im Riegel](/screenshots/de/p2p-plot-frame-svg.webp){.shot-lg}

| Option | Standard | Wirkung |
| --- | --- | --- |
| `layers` | Stäbe, Lager, Lasten, Auflagerreaktionen und das Ergebnis, das `StructurePlot` wählen würde | Was gezeichnet wird |
| `width` | `640` | Breite in px, den Benutzereinheiten des SVG |
| `height` | folgt der Zeichnung | Eine feste Höhe, px |
| `maxHeight` | max(320; 0,75 × width) | Die Obergrenze der automatischen Höhe |
| `padding` | `6` | Abstand um die Zeichnung, px |
| `fontSize` | `13`, kompakt `11.5` | Schriftgröße, px |
| `fontFamily` | `Helvetica, Arial, sans-serif` | Ein Font-Stack, den das Programm hat, das die Datei öffnet |
| `colors` | `PRINT_COLORS` | Beliebige Farbtöne, als feste Farben |
| `background` | `true` | Den Hintergrund in `paper` füllen; `false` lässt ihn transparent |
| `title` | keiner | Wird als `<title>` des SVG geschrieben |
| `reserve`, `reserveLabelModes`, `reserveReactionLabels` | keine | Ebenen, Beschriftungsmodi und Beschriftungsarten der Reaktionen, für die zusätzlich zu den gezeichneten Platz freigehalten wird, damit die Dateien eines schrittweisen Aufbaus deckungsgleich sind: [Schrittweiser Aufbau in Beamer](/de/plot/slides#a-build-up-in-beamer) |
| `units`, `numberFormat`, `compact`, `diagramSize`, `deformedSize`, `momentOnTensionSide`, `resultLabelMode`, `reactionLabels` | wie bei `StructurePlot` | Dieselbe Bedeutung wie die Props der Komponente |

`PRINT_COLORS` sind die Farben der EduBeam-App auf Weiß: Text und Linien `#16182b`, Normalkraft `#2222ff`, Querkraft `#00af00`, Biegemoment `#ff2222`, Lasten `#ff8700`, Auflagerreaktionen `#a020f0`. Jede Beschriftung wird zweimal geschrieben, einmal davon als Rand in der Hintergrundfarbe unter dem Text, weil nicht jedes SVG-Programm `paint-order` versteht; und ein Index, wie in den Reaktionsnamen *A<sub>x</sub>*, ist ein `tspan` mit einfachen Zahlenwerten, den Word und Inkscape lesen können. Ohne `reserve` wird eine Datei an die Ebenen angepasst, die sie zeichnet.

So verwenden Sie die Datei:

- **Word und PowerPoint** (2019 und Microsoft 365): *Einfügen › Bilder*.
- **LaTeX**: Konvertieren Sie sie mit [CairoSVG](https://cairosvg.org) (`cairosvg frame.svg -o frame.pdf`) oder Inkscape in PDF und binden Sie sie dann mit `\includegraphics` ein; oder verwenden Sie `\includesvg` aus dem Paket `svg`, das Inkscape für Sie aufruft. Bei 640 Einheiten Breite hat eine Abbildung in einer Textspalte von 16 cm Beschriftungen in 9 pt.
- **Eine Webseite ohne Vue**: Fügen Sie den Text in das HTML ein. Siehe [Ohne Vue](/de/plot/embedding#plain-html-from-node).

Unter [Übungsaufgaben und Klausuren](/de/plot/exercises#figures-for-latex-and-word) entsteht für die Aufgabe und die Lösung jeder Studentin und jedes Studenten eine Datei.

## Aus einem Solver {#from-a-solver}

| Export | Signatur | Wirkung |
| --- | --- | --- |
| `modelFromSolver` | `(solver: Solver, options?: FromSolverOptions) => PlotModel` | Liest einen Solver in das einfache [Zeichenmodell](/de/plot/model) ein; Ergebnisse nur für einen berechneten Lastfall |
| `FromSolverOptions` | Typ | `{ loadCase?: number }`, ein Index in `solver.loadCases` |

## Stückweise Polynome {#piecewise-polynomials}

Die Ergebnisse eines Stabs sind `Piecewise`-Werte: Listen von Abschnitten `{ x0, x1, c }`, erklärt unter [Zeichenmodell](/de/plot/model#piecewise-polynomials). `side` wählt den Wert unmittelbar vor (`'left'`) oder unmittelbar nach (`'right'`, der Standard) einer Stelle, an der zwei Abschnitte zusammentreffen.

| Export | Signatur | Wirkung |
| --- | --- | --- |
| `valueAt` | `(pw, x, side?) => number` | Der Wert bei `x`; jenseits der Enden der Wert am nächstgelegenen Ende |
| `slopeAt` | `(pw, x, side?) => number` | Die Ableitung, Werteinheit pro Meter |
| `extremes` | `(pw) => { max: Extreme; min: Extreme } \| null` | Der größte und der kleinste Wert, exakt, jeweils `{ x, value, side }` |
| `maxAbs` | `(pw) => number` | Der größte Absolutwert |
| `innerBreaks` | `(pw) => number[]` | Wo Abschnitte zusammentreffen, ohne die beiden Enden |
| `isZero` | `(pw) => boolean` | Ob das Ergebnis überall null ist |
| `evalPiece` | `(piece, x) => number` | Der Wert eines Abschnitts |
| `evalPieceSlope` | `(piece, x) => number` | Die Neigung eines Abschnitts |
| `pieceExtrema` | `(piece) => number[]` | Wo die Neigung eines Abschnitts null ist, m |
| `pieceDegree` | `(piece) => number \| null` | Der Grad eines Abschnitts; `null`, wenn er null ist |
| `cleanPiecewise` | `(pw, tolerance) => Piecewise` | Verwirft Koeffizienten unter `tolerance`, das Rundungsrauschen eines berechneten Modells |
| `fitPiece` | `(f, x0, x1, degree) => Piece` | Das Polynom vom Grad `degree` durch eine Funktion auf `(x0, x1)` |
| `pieceToBeziers` | `(piece, segments?) => CubicSegment[]` | Der Abschnitt als kubische Bézierkurven in (x, Wert): exakt bis zu kubischen Polynomen, sonst `segments` Stück davon, standardmäßig 4 |

Typen: `Piece`, `Piecewise`, `Side` (`'left' \| 'right'`), `Extreme`, `CubicSegment`.

## Einheiten und Zahlen {#units-and-numbers}

| Export | Signatur | Wirkung |
| --- | --- | --- |
| `KN_UNITS` | `Units` | kN, kNm, kN/m, m, mm, mrad, K: der Standard |
| `SI_UNITS` | `Units` | N, N·m, N/m, m, m, rad, K |
| `resolveUnits` | `(units?: Partial<Units>) => Units` | `KN_UNITS` mit Ihren Abweichungen |
| `DEFAULT_NUMBER_FORMAT` | `Intl.NumberFormat` | englisch, höchstens eine Nachkommastelle |
| `formatNumber` | `(value, format?) => string` | Die Zahl mit echtem Minuszeichen, nie −0 |
| `formatQuantity` | `(si, unit, format?) => string` | `"36 kN"`: ein SI-Wert in einer Einheit, mit schmalem geschütztem Leerzeichen |

Eine `Unit` ist `{ symbol, scale }`, Anzeigewert = SI-Wert × `scale`. `Units` enthält eine für jede `UnitKind`: `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` und `temperature`.

```ts
import { formatQuantity, KN_UNITS } from '@edubeam/plot'

formatQuantity(-37500, KN_UNITS.moment) // "−37.5 kNm"
```

## Werte ablesen {#reading-values}

| Export | Signatur | Wirkung |
| --- | --- | --- |
| `readMember` | `(results: MemberResults, x, snap?) => { x, u, values }` | N, V, M und w bei `x`, jeweils `{ left, right }`, und die Längsverschiebung `u`; rastet näher als `snap` m an einem Sprung dort ein |
| `readoutAt` | `(model, transform, px, py, reach) => Readout \| null` | Der Stab, der einem Bildschirmpunkt am nächsten liegt, innerhalb von `reach` px, und seine Ergebnisse an dieser Stelle |
| `readoutMarks` | `(model, transform, readout, shown, k, side) => ReadoutMark[]` | Wo die abgelesenen Werte markiert werden: an der Ordinatenspitze jedes angezeigten Verlaufs (an einem Sprung an beiden), am Punkt auf der Verformungsfigur |
| `formatReadout` | `(readout, quantity, units, format?) => string` | `"M = 54 kNm"` oder an einem Sprung `"V = 13.3 → −6.7 kN"` |

`k` ist der Maßstab in px pro SI-Einheit für jedes Ergebnis und `side` die Seite, auf der jeder Verlauf gezeichnet wird, aus `diagramScales` und `diagramSide` weiter unten. Typen: `Readout`, `ReadoutMark` (`{ tone, from, to }` in px), `ReadoutQuantity` (`'N' \| 'V' \| 'M' \| 'w'`), `SidedValue`.

## Trägerlinien {#beam-lines}

Die Bausteine von [DiagramStack](/de/plot/diagram-stack), um selbst eine Abbildung mit untereinander angeordneten Verläufen zu bauen.

| Export | Signatur | Wirkung |
| --- | --- | --- |
| `beamLine` | `(model, ids?) => BeamLine` | Die Stäbe als eine horizontale Linie, von links nach rechts; bei allem anderen ein Fehler |
| `lineDiagram` | `(model, line, row) => Piecewise` | Ein Ergebnis entlang der ganzen Linie, in der x-Koordinate der Linie |
| `rowRange` | `(pw) => [number, number]` | Der Bereich, auf den eine Zeile skaliert wird, immer einschließlich null |
| `rowPeaks` | `(pw) => RowPeak[]` | Die Extremwerte, die es wert sind, an einer Zeile angeschrieben zu werden |
| `rowBreaks` | `(pw) => number[]` | Wo das Ergebnis einen Knick oder Sprung hat: Lager, Knoten und Einzellasten |
| `rowOutline` | `(pw, sx, sy, close) => string` | SVG-Pfaddaten des Umrisses einer Zeile, gegeben die Abbildungen von m und Wert auf px |
| `rowOrdinates` | `(pw, sx, sy, spacing) => string` | SVG-Pfaddaten der Schraffur-Ordinaten im Abstand von `spacing` px |
| `lineModel` | `(model, line, omit?) => PlotModel` | Das auf die Linie reduzierte Modell, wahlweise ohne eine Last |
| `pointLoadAt` | `(model, line, at) => PlotLoad \| undefined` | Die Einzelkraft an der Position `at` der Linie |

Typen: `BeamLine`, `LineMember`, `RowPeak`, `StackRow`.

Die Seite [DiagramStack](/de/plot/diagram-stack#a-load-the-reader-can-drag) verwendet `beamLine`, `lineDiagram` und `rowRange`, um den Maßstab jeder Zeile über alle Stellungen einer wandernden Last beizubehalten.

## Geometrie und Lager {#geometry-and-supports}

| Export | Signatur | Wirkung |
| --- | --- | --- |
| `nodeMap` | `(model) => ReadonlyMap<string, PlotNode>` | Knoten nach ID |
| `memberFrame` | `(model, member, nodes?) => MemberFrame` | Anfangspunkt, Tangenteneinheitsvektor, Einheitsvektor der lokalen z-Achse und Länge eines Stabs |
| `memberFrames` | `(model) => Map<string, MemberFrame>` | Dasselbe für jeden Stab, nach ID |
| `pointAlong` | `(frame, at) => { x, z }` | Der Punkt `at` Meter entlang eines Stabs |
| `supportKind` | `(fixity) => SupportKind` | `'fixed'`, `'pin'`, `'roller'`, `'slider'`, `'rotation'` oder `'none'` |
| `supportPlacement` | `(model, node) => SupportPlacement` | Das Symbol für einen Knoten und seine Drehung im Uhrzeigersinn, in Grad |
| `supportGlyph` | `(kind) => readonly GlyphPart[]` | Die Linien des Symbols, in px |
| `glyphReach` | `(kind, rotation, x, z) => number` | Wie weit ein gedrehtes Symbol in eine Richtung reicht, px |

## Zeichnen {#drawing}

Die Zeichnung entsteht in drei Schritten. `buildStructureScene` macht aus einem Modell Szenenelemente: Modellpunkte mit Versätzen in Bildschirmpixeln. `fitScene` ermittelt Maßstab und Verschiebung, mit denen sie in einen Container passen. `resolveScene` wandelt sie in SVG-Pfaddaten, Kreise und die Beschriftungen um, für die Platz ist. `layoutStructure` führt alle drei so aus wie `StructurePlot` und `structureSvg`, sodass eine eigene Abbildung genauso angeordnet wird wie ihre.

| Export | Signatur | Wirkung |
| --- | --- | --- |
| `layoutStructure` | `(model, options, box, shown?, labelModes?) => StructureLayout` | Die ganze Anordnung: mit allen Beschriftungen einpassen, Beschriftungen an zu vollen Stellen weglassen, erneut einpassen. Gibt `{ fit, items, resolved }` zurück |
| `structureSvg` | `(model, options?) => string` | Eine eigenständige `.svg`-Datei: [siehe oben](#a-standalone-svg-file) |
| `buildStructureScene` | `(model, options: StructureSceneOptions) => SceneItem[]` | Die Zeichnung der gewählten Ebenen in einem Maßstab, px pro Meter |
| `fitScene` | `(items, box: FitBox) => Fit` | Maßstab und Verschiebung zum Einpassen in einen Container `{ width, height?, maxHeight?, padding, fontSize }` |
| `resolveScene` | `(items, transform, options: ResolveOptions) => ResolvedScene` | `{ paths, circles, texts }` in px, mit den Beschriftungen, die Platz finden |
| `placeLabels` | `(items, transform, options: ResolveOptions) => Map<SceneText, SceneText>` | Welche Beschriftungen bleiben, und wo |
| `alternativeResultGroups` | `(shown) => ReadonlySet<string>` | Die Ergebnisebenen, die jeweils einzeln angezeigt werden; ihre Beschriftungen weichen allen anderen aus, aber nicht einander |
| `sceneBounds` | `(items, scale, fontSize) => Bounds` | Die Ausdehnung einer Szene, px |
| `project` | `(transform, anchor) => [number, number]` | Ein Szenenpunkt auf dem Bildschirm, px |
| `defaultResultLayer` | `(model) => ResultLayer \| null` | Das Ergebnis, das eine Grafik zeigt, wenn keines verlangt ist |
| `diagramScales` | `(model, options) => Record<ResultLayer, number>` | px pro SI-Einheit für jedes Ergebnis |
| `diagramSide` | `(q, momentOnTensionSide) => 1 \| -1` | Auf welcher Seite eines Stabs ein positiver Wert gezeichnet wird |
| `isBarStructure` | `(model, memberResults) => boolean` | Ob N als Zahlen entlang der Stäbe geschrieben (ein Fachwerk) statt als Verlauf gezeichnet wird |
| `tipPlacements` | `(tip, out, mode, gaps?) => TextPlacement[]` | Die Plätze, die ein Wert hinter der Spitze einer Ordinate einnehmen darf |
| `PLOT_LAYERS` | `readonly PlotLayer[]` | Alle Ebenen, in Zeichenreihenfolge |
| `RESULT_LAYERS` | `['N', 'V', 'M', 'w']` | Die Ergebnisebenen |
| `HATCH_SPACING_PX` | `7` | Der Abstand der Ordinaten eines Verlaufs, px |
| `DEFAULT_COLORS` | `PlotColors` | Die Standardfarbe jedes Farbtons als CSS: [Farben und Farbschemata](/de/plot/theming) |
| `PRINT_COLORS` | `Record<Tone \| 'paper', string>` | Feste Farben für eine Datei, die der App auf Weiß |
| `toneVars` | `(colors?) => Record<string, string>` | Die CSS-Variablen, die eine Grafik auf ihrem Wurzelelement setzt |
| `PLOT_CSS` | `string` | Die CSS-Regeln, die direkt in jeder Grafik stehen |

`ResolveOptions` sind `{ fontSize, viewport?, exclude?, alternativeGroups?, shields? }`: `shields` sind die Gruppen, deren Linien Beschriftungen fernhalten (die angezeigten Verläufe), ohne Angabe alle. In `layoutStructure` sind `options.layers` die anzuordnenden Ebenen (alles, was angezeigt werden kann, wie bei `reserve`), `shown` die angezeigten und `labelModes` die Beschriftungsmodi, für die Platz freigehalten wird.

Typen: `StructureSceneOptions`, `StructureLayout`, `StructureSvgOptions`, `SceneItem`, `SceneText`, `TextPlacement`, `ResolvedScene`, `ResolvedPath`, `ResolvedText`, `ResolvedCircle`, `ResolveOptions`, `Bounds`, `Anchor`, `Transform`, `Fit`, `FitBox`, `Tone`, `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `SupportKind`, `SupportPlacement`, `GlyphPart` und die Modelltypen aus [Zeichenmodell](/de/plot/model).
