---
title: कंपोनेंट API
description: "@edubeam/plot 0.2.0 में StructurePlot और DiagramStack के सभी props और इवेंट, उनके type और default मानों के साथ; EduBeamPlot plugin और export किए गए prop type।"
order: 8
group: API संदर्भ
source: site
---

# कंपोनेंट API {#component-api}

दोनों कंपोनेंट के props और इवेंट, जैसे वे @edubeam/plot 0.2.0 में घोषित हैं। किसी में भी slot नहीं है। जो मान SI इकाइयों में हैं, उनके साथ यह लिखा है; आकार CSS पिक्सेल में हैं।

## StructurePlot {#structureplot}

```ts
import { StructurePlot } from '@edubeam/plot'
```

समतल संरचना और उसके परिणाम बनाता है। विस्तार से: [StructurePlot](/hi/plot/structure-plot)।

### Props {#props}

| Prop | Type | Default | विवरण |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | @edubeam/fem का सॉल्वर। उसका लोड केस हल होने पर परिणाम बनते हैं। |
| `model` | `PlotModel` | – | या वह साधारण डेटा जो [`modelFromSolver`](/hi/plot/model) बनाता है। दोनों दिए हों तो `solver` के बजाय इसी का उपयोग होता है। |
| `loadCase` | `number` | `0` | `solver.loadCases` में index |
| `revision` | `number` | `0` | सॉल्वर ऑब्जेक्ट को सीधे बदलने के बाद प्लॉट फिर से बनवाने के लिए इसे बदलें |
| `layers` | `readonly PlotLayer[]` | members, supports, loads, reactions and one result | क्या बनाना है: `'nodes'`, `'nodeLabels'`, `'dimensions'`, `'members'`, `'supports'`, `'loads'`, `'reactions'`, `'N'`, `'V'`, `'M'`, `'w'` |
| `reserve` | `readonly PlotLayer[]` | `layers` | लेयर जिनके लिए छिपे रहने पर भी जगह छोड़नी है |
| `compact` | `boolean` | `false` | थंबनेल ड्रॉइंग: छोटे प्रतीक, हर सदस्य पर अधिक से अधिक दो मान |
| `units` | `Partial<Units>` | `KN_UNITS` | प्रदर्शन इकाइयाँ |
| `numberFormat` | `Intl.NumberFormat` | English, at most 1 decimal | हर संख्या का format |
| `colors` | `Partial<PlotColors>` | – | tone के अनुसार बदले गए रंग: [थीम और रंग](/hi/plot/theming#the-colors-prop) |
| `width` | `number` | `640`, compact `400` | box मापे जाने से पहले की चौड़ाई, जैसे सर्वर पर |
| `height` | `number` | – | तय ऊँचाई। इसके बिना ऊँचाई ड्रॉइंग के अनुसार होती है। |
| `maxHeight` | `number` | `max(320, 0.75 × width)`, compact none | स्वचालित ऊँचाई की ऊपरी सीमा |
| `padding` | `number` | `6` | ड्रॉइंग के चारों ओर की जगह |
| `fontSize` | `number` | `13`, compact `11.5` | पाठ का आकार |
| `diagramSize` | `number` | `48`, compact `26` | आरेख की सबसे बड़ी कोटि (ordinate) की लंबाई |
| `deformedSize` | `number` | `30`, compact `18` | विरूपित आकार पर सबसे बड़ा विस्थापन |
| `diagramScale` | `Partial<Record<ResultLayer, number>>` | – | किसी परिणाम के लिए तय px प्रति SI इकाई, जो `diagramSize` या `deformedSize` की जगह लेता है |
| `momentOnTensionSide` | `boolean` | `true` | M तनाव की ओर; संपीड़न की ओर के लिए `false` |
| `resultLabelMode` | `'horizontal' \| 'axis'` | `'horizontal'` | मान सीधे खड़े, या अपनी कोटि के अनुदिश घुमाए हुए |
| `reactionLabels` | `'values' \| 'names'` | `'values'` | प्रतिक्रियाएँ जैसी लगती हैं, अपने परिमाण के साथ; या, अभ्यास के लिए, हर रोकी गई दिशा का नाम (*A<sub>x</sub>*, *M<sub>A</sub>*) और उस ओर तीर जिसे धनात्मक माना जाता है। नामों के लिए परिणाम नहीं चाहिए: [अज्ञात राशियों के रूप में प्रतिक्रियाएँ](/hi/plot/structure-plot#reactions-as-unknowns) |
| `reserveLabelModes` | `readonly ResultLabelMode[]` | – | वर्तमान mode के अलावा वे लेबल mode जिनके लिए जगह छोड़नी है |
| `reserveReactionLabels` | `readonly ReactionLabels[]` | – | `reactionLabels` के अलावा प्रतिक्रिया लेबल शैलियाँ जिनके लिए जगह छोड़नी है, ताकि जो अभ्यास अपने हल में बदलता है उसकी ड्रॉइंग स्थिर रहे |
| `animate` | `boolean` | `true` | लेयरों का धीरे-धीरे उभरना और सदस्यों का एक सिरे से दूसरे सिरे तक बनना। `prefers-reduced-motion` में हमेशा बंद। |
| `hover` | `boolean` | `false` | पॉइंटर के नीचे मान पढ़ना, हर आरेख की कोटि के सिरे पर चिह्नित। बंद हो तो प्लॉट कोई pointer input नहीं लेता। |
| `title` | `string` | a description of what is shown | चित्र का accessible name |

`layers` के बिना परिणाम बीम और फ्रेम के लिए `M` होता है, ट्रस के लिए `N`, और `w` जब कोई सदस्य बल नहीं उठाता (`defaultResultLayer`)।

### इवेंट {#events}

| इवेंट | Payload | कब |
| --- | --- | --- |
| `readout` | `Readout \| null` | `hover` के साथ: पॉइंटर के नीचे सदस्य का बिंदु और वहाँ के परिणाम; पॉइंटर हटने पर `null` |

```ts
interface Readout {
  readonly member: string
  readonly x: number // सदस्य के प्रारंभिक नोड से m
  readonly px: number // स्क्रीन पर बिंदु, px
  readonly py: number
  readonly values: Readonly<Record<'N' | 'V' | 'M' | 'w', SidedValue>> // SI इकाइयाँ
  readonly u: number // सदस्य के स्थानीय x के अनुदिश विस्थापन, m
}
interface SidedValue {
  readonly left: number
  readonly right: number // जहाँ परिणाम सतत है वहाँ left के बराबर
}
```

## DiagramStack {#diagramstack}

```ts
import { DiagramStack } from '@edubeam/plot'
```

एक ही x अक्ष पर सीधा बीम और उसके नीचे उसके आरेख बनाता है। सदस्यों को बाएँ से दाएँ बनी एक क्षैतिज रेखा बनानी चाहिए; कुछ और हो तो error आता है। विस्तार से: [DiagramStack](/hi/plot/diagram-stack)।

### Props {#props-1}

| Prop | Type | Default | विवरण |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | हल किया गया बीम |
| `model` | `PlotModel` | – | या `modelFromSolver` से साधारण डेटा; दोनों दिए हों तो यही चलता है |
| `loadCase` | `number` | `0` | `solver.loadCases` में index |
| `revision` | `number` | `0` | सॉल्वर ऑब्जेक्ट को सीधे बदलने के बाद चित्र फिर से बनवाने के लिए इसे बदलें |
| `members` | `readonly string[]` | all members | बीम-रेखा के सदस्य |
| `rows` | `readonly StackRow[]` | `['V', 'M', 'w']` | आरेखों की पंक्तियाँ, ऊपर से नीचे, `'N'`, `'V'`, `'M'`, `'w'` में से |
| `loadRow` | `boolean` | `true` | पंक्तियों के ऊपर बीम, अपने सपोर्ट, भार और प्रतिक्रियाओं के साथ |
| `ranges` | `Partial<Record<StackRow, readonly [number, number]>>` | each row's own | हर पंक्ति के मानों का दायरा, SI इकाइयाँ |
| `rowHeights` | `Partial<Record<StackRow, number>>` | N 100, V 116, M 128, w 76; below 560 px wide 88, 96, 104, 64 | `maxHeight` से पैमाना बदलने से पहले पंक्तियों की ऊँचाई |
| `maxHeight` | `number` | – | पंक्तियाँ अधिक से अधिक 60 % तक सिकुड़ती हैं ताकि चित्र समा जाए। पाठ का आकार वही रहता है। |
| `units` | `Partial<Units>` | `KN_UNITS` | प्रदर्शन इकाइयाँ |
| `numberFormat` | `Intl.NumberFormat` | English, at most 1 decimal | हर संख्या का format |
| `colors` | `Partial<PlotColors>` | – | बदले गए रंग |
| `width` | `number` | `720` | box मापे जाने से पहले की चौड़ाई; कम से कम 320 लिया जाता है |
| `fontSize` | `number` | `12.5` | पाठ का आकार |
| `hover` | `boolean` | `true` | पढ़ने वाला cursor। बंद हो तो चित्र कोई pointer input नहीं लेता। |
| `loadAt` | `number` | – | उस बिंदु भार की स्थिति (रेखा के अनुदिश m) जिसे पाठक खींच सकता है; `v-model:load-at` के साथ उपयोग करें |
| `loadLabel` | `string` | `P = …` with the load's magnitude | खींचे जाने वाले भार के पास लिखा पाठ |
| `loadStep` | `number` | `0.05` | खींचने पर स्थिति इस अंतराल तक round होती है, m; तीर कुंजियाँ इतना ही खिसकाती हैं |
| `title` | `string` | a description of the rows | चित्र का accessible name |

### इवेंट {#events-1}

| इवेंट | Payload | कब |
| --- | --- | --- |
| `update:loadAt` | `number` | पाठक ने भार खिसकाया: उसकी नई स्थिति, m। `v-model:load-at` इसी से चलता है। |
| `readout` | `StackReadout \| null` | सभी पंक्तियों में cursor के मान; पॉइंटर हटने पर `null` |

```ts
interface StackReadout {
  readonly x: number // बीम-रेखा के अनुदिश m
  readonly values: Partial<Record<'N' | 'V' | 'M' | 'w', { readonly left: number; readonly right: number }>> // SI
}
```

## Plugin {#the-plugin}

```ts
import { EduBeamPlot } from '@edubeam/plot'

app.use(EduBeamPlot) // <StructurePlot> और <DiagramStack> को पूरे ऐप के लिए register करता है
```

यह वैकल्पिक है: कंपोनेंट को नाम से import करना हल्का पड़ता है, और जिस build में plugin का उपयोग नहीं होता, उससे bundler उसे हटा देता है।

## टाइप {#types}

कंपोनेंट के ऊपर अपने typed wrapper लिखने के लिए पैकेज उनके props और इवेंट के type भी export करता है:

```ts
import type { PlotLayer, StructurePlotProps } from '@edubeam/plot'

const figure: StructurePlotProps = { layers: ['members', 'supports', 'M'] satisfies PlotLayer[], compact: true }
```

| टाइप | क्या है |
| --- | --- |
| `StructurePlotProps`, `StructurePlotEmits` | `StructurePlot` के props और इवेंट |
| `DiagramStackProps`, `DiagramStackEmits` | `DiagramStack` के props और इवेंट |
| `Readout`, `ReadoutQuantity`, `SidedValue`, `StackReadout` | इवेंट के payload |
| `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `StackRow` | लेयर, परिणाम, लेबल mode, प्रतिक्रिया लेबल और पंक्तियों के नाम |
| `Units`, `Unit`, `UnitKind` | प्रदर्शन इकाइयाँ: हर प्रकार के लिए `{ symbol, scale }` |
| `PlotColors` | tone के अनुसार रंग |
| `PlotModel` | साधारण मॉडल: [प्लॉट मॉडल](/hi/plot/model) |

बाकी export, जिनमें SVG फ़ाइलों के लिए `structureSvg` और ड्रॉइंग के पीछे के फ़ंक्शन भी हैं, [फ़ंक्शन](/hi/plot/functions) पृष्ठ पर हैं।
