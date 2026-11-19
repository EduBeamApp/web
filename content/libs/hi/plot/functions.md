---
title: फ़ंक्शन
description: "कंपोनेंट के अलावा @edubeam/plot के सारे फ़ंक्शन, constant और टाइप: SVG फ़ाइलों के लिए structureSvg, सटीक परिणाम, इकाइयाँ, बीम-रेखाएँ और अपने चित्रों का लेआउट।"
order: 10
source: site
---

# फ़ंक्शन {#functions}

कंपोनेंट जो कुछ भी बनाते हैं, वह pure फ़ंक्शनों से आता है, जिनमें Vue नहीं है। ये चित्र को SVG फ़ाइल में लिखते हैं, परिणाम सटीक रूप से पढ़ते हैं, डेटा पहले से तैयार करते हैं और आपके अपने चित्र बनाते हैं। Named imports से bundle छोटा रहता है: जो पेज केवल `modelFromSolver` import करता है, उसमें कंपोनेंट का कोई कोड नहीं आता।

जब तक इकाई कुछ और न बताए, सभी मान SI में हैं; सदस्य के अनुदिश स्थितियाँ उसके प्रारंभिक नोड से मीटर में हैं।

## स्वतंत्र SVG फ़ाइल {#a-standalone-svg-file}

पेज में रखा प्लॉट अपने रंग पेज की CSS custom properties से लेता है, इसलिए उससे कॉपी किए गए `<svg>` में कोई रंग नहीं होता। `structureSvg` इसके बजाय चित्र को एक स्वतंत्र `.svg` फ़ाइल के पाठ के रूप में लिखता है: साधारण रंग, कोई stylesheet नहीं, कोई script नहीं, और लेआउट उसी routine से जिससे `StructurePlot` का बनता है। Word, PowerPoint, Inkscape, CairoSVG और LaTeX के tool chains उसे वैसा ही दिखाते हैं जैसा पेज।

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts' // () => हल किया गया LinearStaticSolver, जैसा “स्लाइड और नोट्स” पृष्ठ पर है

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![स्वतंत्र SVG फ़ाइल के रूप में पोर्टल फ्रेम, CairoSVG से render किया हुआ: भार, प्रतिक्रियाएँ, ऊपर की ओर 20 और 40 और क्षैतिज 2.3 और 12.7, और बंकन आघूर्ण C पर −50.7 से बीम में 29.3 तक।](/screenshots/hi/p2p-plot-frame-svg.webp){.shot-lg}

| Option | Default | क्या करता है |
| --- | --- | --- |
| `layers` | members, supports, loads, reactions and the result `StructurePlot` would pick | क्या बनाना है |
| `width` | `640` | चौड़ाई px में, यानी SVG की user units |
| `height` | follows the drawing | तय ऊँचाई, px |
| `maxHeight` | max(320, 0.75 × width) | स्वचालित ऊँचाई की ऊपरी सीमा |
| `padding` | `6` | ड्रॉइंग के चारों ओर की जगह, px |
| `fontSize` | `13`, compact `11.5` | पाठ का आकार, px |
| `fontFamily` | `Helvetica, Arial, sans-serif` | font stack जो फ़ाइल खोलने वाले प्रोग्राम में उपलब्ध हो |
| `colors` | `PRINT_COLORS` | कोई भी tone, साधारण रंगों के रूप में |
| `background` | `true` | पृष्ठभूमि को `paper` रंग से भरना; `false` उसे पारदर्शी छोड़ता है |
| `title` | none | SVG के `<title>` के रूप में लिखा जाता है |
| `reserve`, `reserveLabelModes`, `reserveReactionLabels` | none | बनाई गई लेयरों के अलावा वे लेयर, लेबल शैलियाँ और प्रतिक्रिया लेबल शैलियाँ जिनके लिए जगह छोड़नी है, ताकि क्रम से बनते चित्र की फ़ाइलें मेल खाएँ: [Beamer में क्रम से बनता चित्र](/hi/plot/slides#a-build-up-in-beamer) |
| `units`, `numberFormat`, `compact`, `diagramSize`, `deformedSize`, `momentOnTensionSide`, `resultLabelMode`, `reactionLabels` | as `StructurePlot` | कंपोनेंट के props जैसा ही अर्थ |

`PRINT_COLORS` सफ़ेद पर EduBeam ऐप के रंग हैं: ink `#16182b`, अक्षीय बल `#2222ff`, अपरूपण बल `#00af00`, बंकन आघूर्ण `#ff2222`, भार `#ff8700`, प्रतिक्रियाएँ `#a020f0`। हर लेबल दो बार लिखा जाता है, नीचे पृष्ठभूमि के रंग में halo और उसके ऊपर पाठ, क्योंकि हर SVG प्रोग्राम `paint-order` नहीं समझता; और subscript, जैसे प्रतिक्रियाओं के नामों *A<sub>x</sub>* में, साधारण संख्याओं वाला एक `tspan` होता है, जिसे Word और Inkscape पढ़ लेते हैं। `reserve` के बिना फ़ाइल उन्हीं लेयरों के अनुसार फ़िट होती है जिन्हें वह बनाती है।

फ़ाइल का उपयोग:

- **Word और PowerPoint** (2019 और Microsoft 365): *Insert › Pictures*।
- **LaTeX**: [CairoSVG](https://cairosvg.org) (`cairosvg frame.svg -o frame.pdf`) या Inkscape से PDF में बदलें, फिर `\includegraphics`; या `svg` package का `\includesvg` उपयोग करें, जो आपके लिए Inkscape चलाता है। 640 इकाई चौड़ा चित्र 16 cm के text column में रखने पर उसके लेबल 9 pt के होते हैं।
- **Vue के बिना वेब पेज**: पाठ को HTML में चिपका दें। देखें [Vue के बिना](/hi/plot/embedding#plain-html-from-node)।

[अभ्यास और प्रश्नपत्र](/hi/plot/exercises#figures-for-latex-and-word) पृष्ठ हर विद्यार्थी के अभ्यास और उत्तर कुंजी के लिए एक फ़ाइल लिखता है।

## सॉल्वर से {#from-a-solver}

| Export | Signature | क्या करता है |
| --- | --- | --- |
| `modelFromSolver` | `(solver: Solver, options?: FromSolverOptions) => PlotModel` | सॉल्वर को साधारण [प्लॉट मॉडल](/hi/plot/model) में पढ़ता है; परिणाम केवल हल किए गए लोड केस के लिए |
| `FromSolverOptions` | type | `{ loadCase?: number }`, `solver.loadCases` में index |

## खंडशः बहुपद {#piecewise-polynomials}

सदस्य के परिणाम `Piecewise` मान हैं: `{ x0, x1, c }` टुकड़ों की सूचियाँ, जो [प्लॉट मॉडल](/hi/plot/model#piecewise-polynomials) में समझाई गई हैं। जहाँ दो टुकड़े मिलते हैं, वहाँ `side` ठीक पहले का मान (`'left'`) या ठीक बाद का मान (`'right'`, default) चुनता है।

| Export | Signature | क्या करता है |
| --- | --- | --- |
| `valueAt` | `(pw, x, side?) => number` | `x` पर मान; सिरों के बाहर, निकटतम सिरे का मान |
| `slopeAt` | `(pw, x, side?) => number` | अवकलज, मान की इकाई प्रति मीटर |
| `extremes` | `(pw) => { max: Extreme; min: Extreme } \| null` | सबसे बड़ा और सबसे छोटा मान, सटीक, हर एक `{ x, value, side }` |
| `maxAbs` | `(pw) => number` | सबसे बड़ा निरपेक्ष मान |
| `innerBreaks` | `(pw) => number[]` | जहाँ टुकड़े मिलते हैं, दोनों सिरों को छोड़कर |
| `isZero` | `(pw) => boolean` | क्या परिणाम पूरी लंबाई में शून्य है |
| `evalPiece` | `(piece, x) => number` | एक टुकड़े का मान |
| `evalPieceSlope` | `(piece, x) => number` | एक टुकड़े का ढाल |
| `pieceExtrema` | `(piece) => number[]` | जहाँ टुकड़े का ढाल शून्य है, m |
| `pieceDegree` | `(piece) => number \| null` | टुकड़े की घात; शून्य हो तो `null` |
| `cleanPiecewise` | `(pw, tolerance) => Piecewise` | `tolerance` से छोटे गुणांक हटाता है, यानी हल किए गए मॉडल की round-off त्रुटि |
| `fitPiece` | `(f, x0, x1, degree) => Piece` | `(x0, x1)` पर किसी फ़ंक्शन से होकर जाने वाला दी गई घात का बहुपद |
| `pieceToBeziers` | `(piece, segments?) => CubicSegment[]` | टुकड़ा (x, मान) में त्रिघात Bézier वक्रों के रूप में: त्रिघात तक सटीक, नहीं तो ऐसे `segments` वक्र, default रूप से 4 |

टाइप: `Piece`, `Piecewise`, `Side` (`'left' \| 'right'`), `Extreme`, `CubicSegment`।

## इकाइयाँ और संख्याएँ {#units-and-numbers}

| Export | Signature | क्या करता है |
| --- | --- | --- |
| `KN_UNITS` | `Units` | kN, kNm, kN/m, m, mm, mrad, K: default |
| `SI_UNITS` | `Units` | N, N·m, N/m, m, m, rad, K |
| `resolveUnits` | `(units?: Partial<Units>) => Units` | आपके बदलावों के साथ `KN_UNITS` |
| `DEFAULT_NUMBER_FORMAT` | `Intl.NumberFormat` | अंग्रेज़ी, अधिक से अधिक एक दशमलव स्थान |
| `formatNumber` | `(value, format?) => string` | असली ऋण चिह्न के साथ संख्या, कभी −0 नहीं |
| `formatQuantity` | `(si, unit, format?) => string` | `"36 kN"`: किसी इकाई में SI मान, narrow no-break space के साथ |

`Unit` का रूप `{ symbol, scale }` है, दिखाया गया मान = SI मान × `scale`। `Units` में हर `UnitKind` के लिए एक इकाई है: `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` और `temperature`।

```ts
import { formatQuantity, KN_UNITS } from '@edubeam/plot'

formatQuantity(-37500, KN_UNITS.moment) // "−37.5 kNm"
```

## मान पढ़ना {#reading-values}

| Export | Signature | क्या करता है |
| --- | --- | --- |
| `readMember` | `(results: MemberResults, x, snap?) => { x, u, values }` | `x` पर N, V, M और w, हर एक `{ left, right }`, और अक्षीय विस्थापन `u`; `snap` m के भीतर उछाल पर स्नैप करता है |
| `readoutAt` | `(model, transform, px, py, reach) => Readout \| null` | स्क्रीन के किसी बिंदु से `reach` px के भीतर निकटतम सदस्य, और वहाँ उसके परिणाम |
| `readoutMarks` | `(model, transform, readout, shown, k, side) => ReadoutMark[]` | पढ़े गए मान कहाँ बनते हैं: दिखाए गए हर आरेख की कोटि का सिरा (उछाल पर दोनों), विरूपित आकार पर बिंदु |
| `formatReadout` | `(readout, quantity, units, format?) => string` | `"M = 54 kNm"`, या उछाल पर `"V = 13.3 → −6.7 kN"` |

`k` हर परिणाम के लिए px प्रति SI इकाई है और `side` वह ओर जिस पर हर आरेख बनता है; दोनों नीचे के `diagramScales` और `diagramSide` से मिलते हैं। टाइप: `Readout`, `ReadoutMark` (px में `{ tone, from, to }`), `ReadoutQuantity` (`'N' \| 'V' \| 'M' \| 'w'`), `SidedValue`।

## बीम-रेखाएँ {#beam-lines}

[DiagramStack](/hi/plot/diagram-stack) के हिस्से, एक के नीचे एक आरेखों वाला अपना चित्र बनाने के लिए।

| Export | Signature | क्या करता है |
| --- | --- | --- |
| `beamLine` | `(model, ids?) => BeamLine` | सदस्य एक क्षैतिज रेखा के रूप में, बाएँ से दाएँ; इसके अलावा कुछ भी हो तो error देता है |
| `lineDiagram` | `(model, line, row) => Piecewise` | पूरी रेखा के अनुदिश एक परिणाम, रेखा के x में |
| `rowRange` | `(pw) => [number, number]` | वह दायरा जिस पर पंक्ति का पैमाना बनता है, हमेशा शून्य सहित |
| `rowPeaks` | `(pw) => RowPeak[]` | पंक्ति पर लिखने लायक चरम मान |
| `rowBreaks` | `(pw) => number[]` | जहाँ परिणाम टूटता है: सपोर्ट, जोड़ और बिंदु भार |
| `rowOutline` | `(pw, sx, sy, close) => string` | पंक्ति की रूपरेखा का SVG path data, m और मान से px तक के map दिए जाने पर |
| `rowOrdinates` | `(pw, sx, sy, spacing) => string` | हैचिंग की कोटियों का SVG path data, `spacing` px की दूरी पर |
| `lineModel` | `(model, line, omit?) => PlotModel` | रेखा तक सीमित मॉडल, चाहें तो एक भार के बिना |
| `pointLoadAt` | `(model, line, at) => PlotLoad \| undefined` | रेखा पर स्थिति `at` पर बिंदु बल |

टाइप: `BeamLine`, `LineMember`, `RowPeak`, `StackRow`।

[DiagramStack](/hi/plot/diagram-stack#a-load-the-reader-can-drag) पृष्ठ `beamLine`, `lineDiagram` और `rowRange` से चलते भार की हर स्थिति पर हर पंक्ति का पैमाना एक-सा रखता है।

## ज्यामिति और सपोर्ट {#geometry-and-supports}

| Export | Signature | क्या करता है |
| --- | --- | --- |
| `nodeMap` | `(model) => ReadonlyMap<string, PlotNode>` | id के अनुसार नोड |
| `memberFrame` | `(model, member, nodes?) => MemberFrame` | सदस्य का आरंभ, इकाई स्पर्शरेखा, इकाई स्थानीय z और लंबाई |
| `memberFrames` | `(model) => Map<string, MemberFrame>` | यही हर सदस्य के लिए, id के अनुसार |
| `pointAlong` | `(frame, at) => { x, z }` | सदस्य के अनुदिश `at` मीटर पर बिंदु |
| `supportKind` | `(fixity) => SupportKind` | `'fixed'`, `'pin'`, `'roller'`, `'slider'`, `'rotation'` या `'none'` |
| `supportPlacement` | `(model, node) => SupportPlacement` | नोड का प्रतीक और उसका दक्षिणावर्त घुमाव, डिग्री |
| `supportGlyph` | `(kind) => readonly GlyphPart[]` | प्रतीक की रेखाएँ, px में |
| `glyphReach` | `(kind, rotation, x, z) => number` | घुमाया गया प्रतीक किसी दिशा में कितनी दूर तक जाता है, px |

## ड्रॉइंग {#drawing}

ड्रॉइंग तीन चरणों में बनती है। `buildStructureScene` मॉडल को scene item में बदलता है: मॉडल के बिंदु, स्क्रीन पिक्सेल में offset के साथ। `fitScene` वह पैमाना और offset ढूँढ़ता है जिससे वे एक box में समा जाएँ। `resolveScene` उन्हें SVG path data, वृत्तों और उन लेबलों में बदलता है जिनके लिए जगह है। `layoutStructure` तीनों को वैसे ही चलाता है जैसे `StructurePlot` और `structureSvg` चलाते हैं, इसलिए आपके अपने चित्र का लेआउट भी उन्हीं जैसा बनता है।

| Export | Signature | क्या करता है |
| --- | --- | --- |
| `layoutStructure` | `(model, options, box, shown?, labelModes?) => StructureLayout` | पूरा लेआउट: सारे लेबलों के साथ फ़िट, भीड़ वाले लेबल हटाना, फिर से फ़िट। `{ fit, items, resolved }` लौटाता है |
| `structureSvg` | `(model, options?) => string` | स्वतंत्र `.svg` फ़ाइल: [ऊपर](#a-standalone-svg-file) |
| `buildStructureScene` | `(model, options: StructureSceneOptions) => SceneItem[]` | चुनी गई लेयरों की ड्रॉइंग किसी पैमाने पर, px प्रति मीटर |
| `fitScene` | `(items, box: FitBox) => Fit` | box `{ width, height?, maxHeight?, padding, fontSize }` में समाने के लिए पैमाना और offset |
| `resolveScene` | `(items, transform, options: ResolveOptions) => ResolvedScene` | px में `{ paths, circles, texts }`, उन लेबलों के साथ जो समाते हैं |
| `placeLabels` | `(items, transform, options: ResolveOptions) => Map<SceneText, SceneText>` | कौन-से लेबल रखने हैं, और कहाँ |
| `alternativeResultGroups` | `(shown) => ReadonlySet<string>` | वे परिणाम लेयर जो एक समय में एक दिखती हैं, जिनके लेबल बाकी सबको जगह देते हैं पर एक-दूसरे को नहीं |
| `sceneBounds` | `(items, scale, fontSize) => Bounds` | scene का विस्तार, px |
| `project` | `(transform, anchor) => [number, number]` | scene का बिंदु स्क्रीन पर, px |
| `defaultResultLayer` | `(model) => ResultLayer \| null` | वह परिणाम जो प्लॉट दिखाता है जब कोई माँगा न गया हो |
| `diagramScales` | `(model, options) => Record<ResultLayer, number>` | हर परिणाम के लिए px प्रति SI इकाई |
| `diagramSide` | `(q, momentOnTensionSide) => 1 \| -1` | सदस्य की किस ओर धनात्मक मान बनता है |
| `isBarStructure` | `(model, memberResults) => boolean` | क्या N आरेख के बजाय छड़ों के अनुदिश संख्याओं के रूप में लिखा जाता है (ट्रस) |
| `tipPlacements` | `(tip, out, mode, gaps?) => TextPlacement[]` | कोटि के सिरे के आगे मान किन जगहों पर लिखा जा सकता है |
| `PLOT_LAYERS` | `readonly PlotLayer[]` | सारी लेयर, बनने के क्रम में |
| `RESULT_LAYERS` | `['N', 'V', 'M', 'w']` | परिणाम लेयर |
| `HATCH_SPACING_PX` | `7` | आरेख की कोटियों के बीच की दूरी, px |
| `DEFAULT_COLORS` | `PlotColors` | हर tone का default रंग, CSS के रूप में: [थीम और रंग](/hi/plot/theming) |
| `PRINT_COLORS` | `Record<Tone \| 'paper', string>` | फ़ाइल के लिए साधारण रंग, सफ़ेद पर ऐप के रंग |
| `toneVars` | `(colors?) => Record<string, string>` | वे custom properties जो प्लॉट अपने root पर सेट करता है |
| `PLOT_CSS` | `string` | हर प्लॉट के अंदर लिखे CSS नियम |

`ResolveOptions` का रूप `{ fontSize, viewport?, exclude?, alternativeGroups?, shields? }` है: `shields` वे group हैं जिनकी रेखाओं पर लेबल नहीं रखे जाते (दिखाए गए आरेख); न दें तो सभी group। `layoutStructure` में `options.layers` वे लेयर हैं जिनका लेआउट बनाना है (जो कुछ भी दिखाया जा सकता है, `reserve` की तरह), `shown` वे जो दिख रही हैं, और `labelModes` वे लेबल शैलियाँ जिनके लिए जगह छोड़नी है।

टाइप: `StructureSceneOptions`, `StructureLayout`, `StructureSvgOptions`, `SceneItem`, `SceneText`, `TextPlacement`, `ResolvedScene`, `ResolvedPath`, `ResolvedText`, `ResolvedCircle`, `ResolveOptions`, `Bounds`, `Anchor`, `Transform`, `Fit`, `FitBox`, `Tone`, `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `SupportKind`, `SupportPlacement`, `GlyphPart`, और [प्लॉट मॉडल](/hi/plot/model) के मॉडल टाइप।
