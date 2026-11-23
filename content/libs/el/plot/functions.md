---
title: Συναρτήσεις
description: "Οι συναρτήσεις, οι σταθερές και οι τύποι που εξάγει το @edubeam/plot εκτός από τα components: structureSvg για αρχεία SVG, ακριβή αποτελέσματα, μονάδες, γραμμές δοκών και διάταξη."
order: 10
source: site
---

# Συναρτήσεις

Ό,τι σχεδιάζουν τα components προέρχεται από καθαρές συναρτήσεις που δεν εξαρτώνται από τη Vue. Γράφουν ένα σχήμα ως αρχείο SVG, διαβάζουν τα αποτελέσματα με ακρίβεια, προετοιμάζουν δεδομένα εκ των προτέρων και φτιάχνουν δικά σας σχήματα. Τα ονομαστικά imports κρατούν το bundle μικρό: μια σελίδα που κάνει import μόνο τη `modelFromSolver` δεν παίρνει καθόλου κώδικα components.

Όλες οι τιμές είναι σε SI, εκτός αν αναφέρεται άλλη μονάδα· οι θέσεις κατά μήκος ενός μέλους είναι σε μέτρα από τον αρχικό του κόμβο.

## Αυτόνομο αρχείο SVG {#a-standalone-svg-file}

Ένα σχήμα σε σελίδα παίρνει τα χρώματά του από τις μεταβλητές CSS της σελίδας, οπότε ένα `<svg>` που αντιγράφεται από αυτό δεν έχει κανένα χρώμα. Η `structureSvg`, αντίθετα, γράφει το σχήμα ως κείμενο ενός αυτόνομου αρχείου `.svg`: απλά χρώματα, χωρίς φύλλο στυλ, χωρίς scripts, με διάταξη από την ίδια ρουτίνα με το `StructurePlot`. Το Word, το PowerPoint, το Inkscape, το CairoSVG και τα εργαλεία του LaTeX το εμφανίζουν όπως ακριβώς η σελίδα.

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts' // () => ένας επιλυμένος LinearStaticSolver, όπως στη σελίδα Διαφάνειες και σημειώσεις

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![Το αμφιαρθρωτό πλαίσιο ως αυτόνομο αρχείο SVG, αποδοσμένο με το CairoSVG: τα φορτία, οι αντιδράσεις 20 και 40 προς τα πάνω και 2,3 και 12,7 οριζόντια, και η καμπτική ροπή από −50,7 στο C έως 29,3 στο ζύγωμα](/screenshots/el/p2p-plot-frame-svg.webp){.shot-lg}

| Επιλογή | Προεπιλογή | Τι κάνει |
| --- | --- | --- |
| `layers` | μέλη, στηρίξεις, φορτία, αντιδράσεις και το αποτέλεσμα που θα διάλεγε το `StructurePlot` | Τι θα σχεδιαστεί |
| `width` | `640` | Πλάτος σε px, δηλαδή στις μονάδες χρήστη του SVG |
| `height` | προκύπτει από το σχέδιο | Σταθερό ύψος, px |
| `maxHeight` | max(320, 0.75 × width) | Το ανώτατο όριο του αυτόματου ύψους |
| `padding` | `6` | Κενό γύρω από το σχέδιο, px |
| `fontSize` | `13`, compact `11.5` | Μέγεθος κειμένου, px |
| `fontFamily` | `Helvetica, Arial, sans-serif` | Μια λίστα γραμματοσειρών που διαθέτει το πρόγραμμα που ανοίγει το αρχείο |
| `colors` | `PRINT_COLORS` | Οποιονδήποτε από τους τόνους, ως απλά χρώματα |
| `background` | `true` | Βάφει το φόντο με το `paper`· το `false` το αφήνει διάφανο |
| `title` | κανένα | Γράφεται ως `<title>` του SVG |
| `reserve`, `reserveLabelModes`, `reserveReactionLabels` | κανένα | Επίπεδα, στυλ ετικετών και στυλ ετικετών αντιδράσεων για τα οποία κρατιέται χώρος εκτός από όσα σχεδιάζονται, ώστε τα αρχεία ενός σταδιακού σχήματος να ευθυγραμμίζονται: [Σταδιακό σχήμα στο Beamer](/el/plot/slides#a-build-up-in-beamer) |
| `units`, `numberFormat`, `compact`, `diagramSize`, `deformedSize`, `momentOnTensionSide`, `resultLabelMode`, `reactionLabels` | όπως στο `StructurePlot` | Την ίδια σημασία με τα props του component |

Τα `PRINT_COLORS` είναι τα χρώματα της εφαρμογής EduBeam σε λευκό φόντο: μελάνι `#16182b`, αξονική δύναμη `#2222ff`, τέμνουσα δύναμη `#00af00`, καμπτική ροπή `#ff2222`, φορτία `#ff8700`, αντιδράσεις `#a020f0`. Κάθε ετικέτα γράφεται δύο φορές, με ένα περίγραμμα στο χρώμα του φόντου κάτω από το κείμενο, επειδή δεν υποστηρίζουν όλα τα προγράμματα SVG το `paint-order`, και ένας δείκτης, όπως στα ονόματα αντιδράσεων *A<sub>x</sub>*, είναι ένα `tspan` με απλούς αριθμούς που τους διαβάζουν σωστά το Word και το Inkscape. Χωρίς `reserve`, ένα αρχείο προσαρμόζεται στα επίπεδα που σχεδιάζει.

Πώς χρησιμοποιείτε το αρχείο:

- **Word και PowerPoint** (2019 και Microsoft 365): *Εισαγωγή › Εικόνες*.
- **LaTeX**: μετατρέψτε το σε PDF με το [CairoSVG](https://cairosvg.org) (`cairosvg frame.svg -o frame.pdf`) ή το Inkscape, και έπειτα `\includegraphics`· ή χρησιμοποιήστε το `\includesvg` του πακέτου `svg`, που καλεί το Inkscape για εσάς. Με πλάτος 640 μονάδων, ένα σχήμα σε στήλη κειμένου 16 cm έχει ετικέτες 9 pt.
- **Ιστοσελίδα χωρίς Vue**: επικολλήστε το κείμενο στο HTML. Δείτε το [Χωρίς Vue](/el/plot/embedding#plain-html-from-node).

Η σελίδα [Ασκήσεις και διαγωνίσματα](/el/plot/exercises#figures-for-latex-and-word) γράφει ένα αρχείο για την άσκηση και τις λύσεις κάθε φοιτητή.

## Από έναν επιλυτή {#from-a-solver}

| Εξαγωγή | Υπογραφή | Τι κάνει |
| --- | --- | --- |
| `modelFromSolver` | `(solver: Solver, options?: FromSolverOptions) => PlotModel` | Μετατρέπει έναν επιλυτή στο απλό [μοντέλο σχήματος](/el/plot/model)· αποτελέσματα μόνο για επιλυμένη περίπτωση φόρτισης |
| `FromSolverOptions` | τύπος | `{ loadCase?: number }`, δείκτης στο `solver.loadCases` |

## Τμηματικά πολυώνυμα {#piecewise-polynomials}

Τα αποτελέσματα ενός μέλους είναι τιμές `Piecewise`: λίστες από τμήματα `{ x0, x1, c }`, που εξηγούνται στη σελίδα [Μοντέλο σχήματος](/el/plot/model#piecewise-polynomials). Το `side` επιλέγει την τιμή ακριβώς πριν (`'left'`) ή ακριβώς μετά (`'right'`, η προεπιλογή) από ένα σημείο όπου συναντώνται δύο τμήματα.

| Εξαγωγή | Υπογραφή | Τι κάνει |
| --- | --- | --- |
| `valueAt` | `(pw, x, side?) => number` | Η τιμή στο `x`· πέρα από τα άκρα, η τιμή του πλησιέστερου άκρου |
| `slopeAt` | `(pw, x, side?) => number` | Η παράγωγος, σε μονάδες τιμής ανά μέτρο |
| `extremes` | `(pw) => { max: Extreme; min: Extreme } \| null` | Η μέγιστη και η ελάχιστη τιμή, ακριβώς, η καθεμία ως `{ x, value, side }` |
| `maxAbs` | `(pw) => number` | Η μέγιστη απόλυτη τιμή |
| `innerBreaks` | `(pw) => number[]` | Τα σημεία όπου συναντώνται τμήματα, χωρίς τα δύο άκρα |
| `isZero` | `(pw) => boolean` | Αν το αποτέλεσμα είναι μηδέν παντού |
| `evalPiece` | `(piece, x) => number` | Η τιμή ενός τμήματος |
| `evalPieceSlope` | `(piece, x) => number` | Η κλίση ενός τμήματος |
| `pieceExtrema` | `(piece) => number[]` | Τα σημεία όπου μηδενίζεται η κλίση ενός τμήματος, m |
| `pieceDegree` | `(piece) => number \| null` | Ο βαθμός ενός τμήματος· `null` όταν είναι μηδενικό |
| `cleanPiecewise` | `(pw, tolerance) => Piecewise` | Αφαιρεί συντελεστές μικρότερους από `tolerance`, δηλαδή τα σφάλματα στρογγύλευσης ενός επιλυμένου μοντέλου |
| `fitPiece` | `(f, x0, x1, degree) => Piece` | Το πολυώνυμο δεδομένου βαθμού που προσαρμόζεται σε μια συνάρτηση στο `(x0, x1)` |
| `pieceToBeziers` | `(piece, segments?) => CubicSegment[]` | Το τμήμα ως κυβικές καμπύλες Bézier στο (x, τιμή): ακριβώς έως τρίτου βαθμού, αλλιώς `segments` καμπύλες, από προεπιλογή 4 |

Τύποι: `Piece`, `Piecewise`, `Side` (`'left' \| 'right'`), `Extreme`, `CubicSegment`.

## Μονάδες και αριθμοί {#units-and-numbers}

| Εξαγωγή | Υπογραφή | Τι κάνει |
| --- | --- | --- |
| `KN_UNITS` | `Units` | kN, kNm, kN/m, m, mm, mrad, K: η προεπιλογή |
| `SI_UNITS` | `Units` | N, N·m, N/m, m, m, rad, K |
| `resolveUnits` | `(units?: Partial<Units>) => Units` | Οι `KN_UNITS` με τις δικές σας αλλαγές |
| `DEFAULT_NUMBER_FORMAT` | `Intl.NumberFormat` | Αγγλικά, το πολύ ένα δεκαδικό |
| `formatNumber` | `(value, format?) => string` | Ο αριθμός με πραγματικό σύμβολο μείον, ποτέ −0 |
| `formatQuantity` | `(si, unit, format?) => string` | `"36 kN"`: μια τιμή SI σε μια μονάδα, με στενό αδιάσπαστο κενό |

Μια `Unit` είναι `{ symbol, scale }`, όπου τιμή εμφάνισης = τιμή SI × `scale`. Οι `Units` έχουν μία για κάθε `UnitKind`: `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` και `temperature`.

```ts
import { formatQuantity, KN_UNITS } from '@edubeam/plot'

formatQuantity(-37500, KN_UNITS.moment) // "−37.5 kNm"
```

## Ανάγνωση τιμών {#reading-values}

| Εξαγωγή | Υπογραφή | Τι κάνει |
| --- | --- | --- |
| `readMember` | `(results: MemberResults, x, snap?) => { x, u, values }` | Τα N, V, M και w στο `x`, το καθένα ως `{ left, right }`, και η αξονική μετακίνηση `u`· προσκολλάται σε άλμα που απέχει έως `snap` m |
| `readoutAt` | `(model, transform, px, py, reach) => Readout \| null` | Το μέλος που βρίσκεται πλησιέστερα σε ένα σημείο της οθόνης, εντός `reach` px, και τα αποτελέσματά του εκεί |
| `readoutMarks` | `(model, transform, readout, shown, k, side) => ReadoutMark[]` | Πού σχεδιάζονται οι τιμές που διαβάστηκαν: η άκρη της τεταγμένης κάθε εμφανιζόμενου διαγράμματος (και οι δύο σε ένα άλμα) και το σημείο πάνω στον παραμορφωμένο φορέα |
| `formatReadout` | `(readout, quantity, units, format?) => string` | `"M = 54 kNm"`, ή σε ένα άλμα `"V = 13.3 → −6.7 kN"` |

Το `k` είναι τα px ανά μονάδα SI για κάθε αποτέλεσμα και το `side` η πλευρά στην οποία σχεδιάζεται κάθε διάγραμμα, από τις `diagramScales` και `diagramSide` παρακάτω. Τύποι: `Readout`, `ReadoutMark` (`{ tone, from, to }` σε px), `ReadoutQuantity` (`'N' \| 'V' \| 'M' \| 'w'`), `SidedValue`.

## Γραμμές δοκών {#beam-lines}

Τα δομικά κομμάτια του [DiagramStack](/el/plot/diagram-stack), για να φτιάξετε δικό σας σχήμα με διαγράμματα το ένα κάτω από το άλλο.

| Εξαγωγή | Υπογραφή | Τι κάνει |
| --- | --- | --- |
| `beamLine` | `(model, ids?) => BeamLine` | Τα μέλη ως μία οριζόντια γραμμή, από αριστερά προς τα δεξιά· σε κάθε άλλη περίπτωση προκαλεί σφάλμα |
| `lineDiagram` | `(model, line, row) => Piecewise` | Ένα αποτέλεσμα κατά μήκος όλης της γραμμής, στη συντεταγμένη x της γραμμής |
| `rowRange` | `(pw) => [number, number]` | Το εύρος στο οποίο κλιμακώνεται μια γραμμή, που περιλαμβάνει πάντα το μηδέν |
| `rowPeaks` | `(pw) => RowPeak[]` | Τα ακρότατα που αξίζει να γραφτούν σε μια γραμμή |
| `rowBreaks` | `(pw) => number[]` | Τα σημεία ασυνέχειας του αποτελέσματος: στηρίξεις, συνδέσεις μελών και συγκεντρωμένα φορτία |
| `rowOutline` | `(pw, sx, sy, close) => string` | Δεδομένα διαδρομής SVG για το περίγραμμα μιας γραμμής, με δεδομένες τις απεικονίσεις από m και τιμή σε px |
| `rowOrdinates` | `(pw, sx, sy, spacing) => string` | Δεδομένα διαδρομής SVG για τις τεταγμένες της διαγράμμισης, ανά `spacing` px |
| `lineModel` | `(model, line, omit?) => PlotModel` | Το μοντέλο περιορισμένο στη γραμμή, προαιρετικά χωρίς ένα φορτίο |
| `pointLoadAt` | `(model, line, at) => PlotLoad \| undefined` | Η συγκεντρωμένη δύναμη στη θέση `at` της γραμμής |

Τύποι: `BeamLine`, `LineMember`, `RowPeak`, `StackRow`.

Η σελίδα [DiagramStack](/el/plot/diagram-stack#a-load-the-reader-can-drag) χρησιμοποιεί τις `beamLine`, `lineDiagram` και `rowRange` για να κρατά την κλίμακα κάθε γραμμής σταθερή για όλες τις θέσεις ενός κινητού φορτίου.

## Γεωμετρία και στηρίξεις {#geometry-and-supports}

| Εξαγωγή | Υπογραφή | Τι κάνει |
| --- | --- | --- |
| `nodeMap` | `(model) => ReadonlyMap<string, PlotNode>` | Οι κόμβοι ανά αναγνωριστικό |
| `memberFrame` | `(model, member, nodes?) => MemberFrame` | Η αρχή ενός μέλους, το μοναδιαίο εφαπτόμενο διάνυσμα, ο μοναδιαίος τοπικός άξονας z και το μήκος |
| `memberFrames` | `(model) => Map<string, MemberFrame>` | Το ίδιο για κάθε μέλος, ανά αναγνωριστικό |
| `pointAlong` | `(frame, at) => { x, z }` | Το σημείο σε απόσταση `at` μέτρων κατά μήκος ενός μέλους |
| `supportKind` | `(fixity) => SupportKind` | `'fixed'`, `'pin'`, `'roller'`, `'slider'`, `'rotation'` ή `'none'` |
| `supportPlacement` | `(model, node) => SupportPlacement` | Το σύμβολο για έναν κόμβο και η δεξιόστροφη περιστροφή του, σε μοίρες |
| `supportGlyph` | `(kind) => readonly GlyphPart[]` | Οι γραμμές του συμβόλου, σε px |
| `glyphReach` | `(kind, rotation, x, z) => number` | Πόσο μακριά φτάνει ένα περιστραμμένο σύμβολο σε μια διεύθυνση, px |

## Σχεδίαση {#drawing}

Η σχεδίαση γίνεται σε τρία βήματα. Η `buildStructureScene` μετατρέπει ένα μοντέλο σε στοιχεία σκηνής: σημεία του μοντέλου με μετατοπίσεις σε pixel οθόνης. Η `fitScene` βρίσκει την κλίμακα και τη μετατόπιση ώστε αυτά να χωρούν σε ένα ορθογώνιο. Η `resolveScene` τα μετατρέπει σε δεδομένα διαδρομών SVG, κύκλους και τις ετικέτες για τις οποίες υπάρχει χώρος. Η `layoutStructure` εκτελεί και τα τρία βήματα όπως το `StructurePlot` και η `structureSvg`, οπότε ένα δικό σας σχήμα διατάσσεται όπως τα δικά τους.

| Εξαγωγή | Υπογραφή | Τι κάνει |
| --- | --- | --- |
| `layoutStructure` | `(model, options, box, shown?, labelModes?) => StructureLayout` | Ολόκληρη η διάταξη: προσαρμογή με όλες τις ετικέτες, αφαίρεση των ετικετών που στριμώχνονται, νέα προσαρμογή. Επιστρέφει `{ fit, items, resolved }` |
| `structureSvg` | `(model, options?) => string` | Ένα αυτόνομο αρχείο `.svg`: [παραπάνω](#a-standalone-svg-file) |
| `buildStructureScene` | `(model, options: StructureSceneOptions) => SceneItem[]` | Το σχέδιο των επιλεγμένων επιπέδων σε μια κλίμακα, px ανά μέτρο |
| `fitScene` | `(items, box: FitBox) => Fit` | Κλίμακα και μετατόπιση ώστε η σκηνή να χωρά σε ορθογώνιο `{ width, height?, maxHeight?, padding, fontSize }` |
| `resolveScene` | `(items, transform, options: ResolveOptions) => ResolvedScene` | `{ paths, circles, texts }` σε px, με τις ετικέτες που χωρούν |
| `placeLabels` | `(items, transform, options: ResolveOptions) => Map<SceneText, SceneText>` | Ποιες ετικέτες κρατιούνται και πού |
| `alternativeResultGroups` | `(shown) => ReadonlySet<string>` | Τα επίπεδα αποτελεσμάτων που εμφανίζονται ένα κάθε φορά, των οποίων οι ετικέτες υποχωρούν μπροστά στις υπόλοιπες αλλά όχι η μία μπροστά στην άλλη |
| `sceneBounds` | `(items, scale, fontSize) => Bounds` | Η έκταση μιας σκηνής, px |
| `project` | `(transform, anchor) => [number, number]` | Ένα σημείο της σκηνής στην οθόνη, px |
| `defaultResultLayer` | `(model) => ResultLayer \| null` | Το αποτέλεσμα που δείχνει ένα σχήμα όταν δεν ζητηθεί κανένα |
| `diagramScales` | `(model, options) => Record<ResultLayer, number>` | Τα px ανά μονάδα SI για κάθε αποτέλεσμα |
| `diagramSide` | `(q, momentOnTensionSide) => 1 \| -1` | Σε ποια πλευρά ενός μέλους σχεδιάζεται μια θετική τιμή |
| `isBarStructure` | `(model, memberResults) => boolean` | Αν το N γράφεται ως αριθμοί κατά μήκος των ράβδων (δικτύωμα) αντί να σχεδιάζεται ως διάγραμμα |
| `tipPlacements` | `(tip, out, mode, gaps?) => TextPlacement[]` | Οι θέσεις που μπορεί να πάρει μια τιμή πέρα από την άκρη μιας τεταγμένης |
| `PLOT_LAYERS` | `readonly PlotLayer[]` | Όλα τα επίπεδα, με τη σειρά σχεδίασης |
| `RESULT_LAYERS` | `['N', 'V', 'M', 'w']` | Τα επίπεδα αποτελεσμάτων |
| `HATCH_SPACING_PX` | `7` | Η απόσταση των τεταγμένων του διαγράμματος, px |
| `DEFAULT_COLORS` | `PlotColors` | Το προεπιλεγμένο χρώμα κάθε τόνου, ως CSS: [Θέματα και χρώματα](/el/plot/theming) |
| `PRINT_COLORS` | `Record<Tone \| 'paper', string>` | Απλά χρώματα για αρχείο, τα χρώματα της εφαρμογής σε λευκό φόντο |
| `toneVars` | `(colors?) => Record<string, string>` | Οι μεταβλητές CSS που ορίζει ένα σχήμα στο ριζικό του στοιχείο |
| `PLOT_CSS` | `string` | Οι κανόνες CSS που ενσωματώνονται σε κάθε σχήμα |

Οι `ResolveOptions` είναι `{ fontSize, viewport?, exclude?, alternativeGroups?, shields? }`: τα `shields` είναι οι ομάδες των οποίων οι γραμμές κρατούν μακριά τις ετικέτες (τα εμφανιζόμενα διαγράμματα)· αν παραλειφθούν, όλες οι ομάδες. Στη `layoutStructure`, τα `options.layers` είναι τα επίπεδα προς διάταξη (ό,τι μπορεί να εμφανιστεί, όπως το `reserve`), τα `shown` όσα εμφανίζονται, και τα `labelModes` τα στυλ ετικετών για τα οποία κρατιέται χώρος.

Τύποι: `StructureSceneOptions`, `StructureLayout`, `StructureSvgOptions`, `SceneItem`, `SceneText`, `TextPlacement`, `ResolvedScene`, `ResolvedPath`, `ResolvedText`, `ResolvedCircle`, `ResolveOptions`, `Bounds`, `Anchor`, `Transform`, `Fit`, `FitBox`, `Tone`, `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `SupportKind`, `SupportPlacement`, `GlyphPart`, καθώς και οι τύποι του μοντέλου από τη σελίδα [Μοντέλο σχήματος](/el/plot/model).
