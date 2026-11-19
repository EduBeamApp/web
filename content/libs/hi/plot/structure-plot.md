---
title: StructurePlot
description: "StructurePlot से समतल बीम, फ्रेम या ट्रस बनाएँ: लेयर, क्रम से बनते चित्र, अभ्यास के लिए अज्ञात प्रतिक्रियाओं के नाम, थंबनेल, आकार, इकाइयाँ और होवर पर मान।"
order: 2
group: कंपोनेंट
source: site
---

# StructurePlot {#structureplot}

`StructurePlot` पूरी संरचना बनाता है, अपने box की चौड़ाई में फ़िट करके: सदस्य, हिंज, सपोर्ट, भार, प्रतिक्रियाएँ, N, V और M आरेख और विरूपित आकार। इसे एक सॉल्वर दें, या उससे बना [साधारण मॉडल](/hi/plot/model), और बताएँ कि क्या बनाना है।

```vue
<StructurePlot :solver="solver" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

हर prop, उसके type और default के साथ, [कंपोनेंट API](/hi/plot/components#structureplot) में है।

यह चित्र एक `StructurePlot` है: `nodeLabels` और `dimensions` चालू हैं, `hover` दिया गया है, और संख्याएँ इस साइट के प्रारूप में, चार सार्थक अंकों तक, लिखी हैं। परिणामों के बीच बदलें, और किसी सदस्य पर पॉइंटर ले जाकर उसके मान पढ़ें।

::model-figure{caption="एक पोर्टल फ्रेम: स्तंभों के नीचे पिन सपोर्ट, बीम पर 10 kN/m, B पर 15 kN"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: pin, D: pin }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
  - { node: B, fx: 15 }
results: [M, V, N, w]
show: [nodeLabels, dimensions]
---
::

## लेयर {#layers}

प्लॉट लेयरों से बनता है। उन्हें आप किसी भी क्रम में लिखें, वे हमेशा एक तय क्रम में बनती हैं:

| लेयर | क्या बनाती है |
| --- | --- |
| `members` | सदस्य, और हिंज छोटे वृत्तों के रूप में |
| `supports` | हर सपोर्ट का प्रतीक, झुके सपोर्ट के लिए घुमाया हुआ |
| `loads` | नोडल और सदस्य भार, तापमान और सपोर्ट का धँसाव, उनके मानों के साथ |
| `reactions` | प्रतिक्रियाएँ, तीरों और वक्र तीरों के रूप में, उनके मानों के साथ; या `reactionLabels: 'names'` के साथ, अभ्यास की [नाम वाली अज्ञात राशियों](#reactions-as-unknowns) के रूप में |
| `nodes` | हर नोड एक छोटे वृत्त के रूप में |
| `nodeLabels` | नोडों के लेबल |
| `dimensions` | क्रमवार विमा रेखाएँ (chain dimensions), जैसी अभ्यास पत्रक में होती हैं: नोडों और बिंदु भारों के बीच की हर दूरी संरचना के नीचे, हर मंज़िल की ऊँचाई उसकी दाईं ओर, और कुल माप दूसरी पंक्ति में |
| `N`, `V`, `M` | अक्षीय बल (normal force), अपरूपण बल (shear force) और बंकन आघूर्ण (bending moment) के आरेख |
| `w` | विरूपित आकार |

`layers` न दें तो प्लॉट सदस्य, सपोर्ट, भार और प्रतिक्रियाएँ बनाता है, और साथ में संरचना के अनुसार चुना गया एक परिणाम: बीम और फ्रेम के लिए `M`, ट्रस के लिए `N`, और `w` जब कोई सदस्य बल नहीं उठाता, जैसे तापीय भार के अधीन ऐसा बीम जो फैलने के लिए मुक्त है।

आरेख EduBeam ऐप जैसे ही बनते हैं: N और V सदस्य के आर-पार हैच होते हैं, और M तनाव की ओर बनता है, इसलिए सैगिंग (निचले तंतुओं में तनाव) वाला आघूर्ण बीम के नीचे दिखता है। `:moment-on-tension-side="false"` M को संपीड़न की ओर बनाता है। ट्रस में हर छड़ का बल एक बार, छड़ के अनुदिश लिखा जाता है, और उसका रंग चिह्न बताता है।

## क्रम से बनते चित्र {#figures-that-build-up}

`reserve` उन लेयरों की सूची है जिनके लिए जगह छोड़नी है, भले ही वे अभी छिपी हों। प्लॉट हर reserved लेयर का लेआउट शुरू से ही बना लेता है, इसलिए जब कोई लेयर चालू होती है तो वह अपनी जगह पर उभरती है और बाकी कुछ नहीं हिलता:

```vue
<script setup lang="ts">
import type { PlotLayer } from '@edubeam/plot'

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'],
  ['nodeLabels', 'members', 'supports'],
  ['nodeLabels', 'members', 'supports', 'loads'],
  ['members', 'supports', 'loads', 'reactions'],
  ['members', 'supports', 'reactions', 'M'],
]
const all = [...new Set(stages.flat())]
// `frame` एक हल किया गया सॉल्वर है और `step` वर्तमान चरण: पूरा कंपोनेंट “स्लाइड और नोट्स” पृष्ठ पर है
</script>

<template>
  <StructurePlot :solver="frame" :layers="stages[step]" :reserve="all" />
</template>
```

`animate` के साथ, जो default रूप से चालू है, लेयर धीरे-धीरे उभरती हैं और सदस्य एक सिरे से दूसरे सिरे तक अपने-आप बनते जाते हैं। `prefers-reduced-motion` में कुछ भी animate नहीं होता। [स्लाइड और नोट्स](/hi/plot/slides) पृष्ठ यही चित्र एक स्लाइड डेक में दिखाता है।

## आरेख के मान {#diagram-values}

हर मान उस कोटि (ordinate) के सिरे के ठीक आगे लिखा जाता है जिसका वह है, जैसे पाठ्यपुस्तक में आरेख पर लिखा जाता है: सदस्य का हर सिरा जहाँ मान शून्य नहीं है, बीच के चरम मान, उछाल (jump) पर दोनों मान, और दृढ़ कोने पर एक बार। मान बिना इकाई की संख्याएँ हैं, प्रदर्शन इकाई में (N और V के लिए kN, M के लिए kNm), और प्रतिक्रियाएँ भी ऐसी ही हैं, जैसे EduBeam ऐप में; इकाई केवल दी गई राशियों के साथ लिखी जाती है: भार, सपोर्ट का धँसाव और तापमान परिवर्तन। जो लेबल किसी दूसरे लेबल, सदस्य या तीर पर चढ़ जाता, वह उसी सिरे पर दूसरी जगहें आज़माता है, और कोई जगह ख़ाली न हो तो छोड़ दिया जाता है, इसलिए दो संख्याएँ कभी एक-दूसरे पर नहीं बैठतीं। भारों और प्रतिक्रियाओं के मान पहले रखे जाते हैं, इसलिए आरेख की संख्याएँ उन्हें कभी नहीं हटातीं। ट्रस की छड़ों के बल कभी नहीं छोड़े जाते: वे छड़ के अनुदिश खिसकते हैं, दूसरी ओर चले जाते हैं और अंतिम उपाय के रूप में छोटे हो जाते हैं।

`result-label-mode="axis"` मानों को उनकी कोटि के अनुदिश घुमा देता है, जैसे EduBeam ऐप उन्हें लिखता है। अगर पाठक दोनों के बीच बदल सकता है, तो `:reserve-label-modes="['horizontal', 'axis']"` दें, ताकि बदलने पर ड्रॉइंग न हिले।

## अज्ञात राशियों के रूप में प्रतिक्रियाएँ {#reactions-as-unknowns}

अभ्यास पत्रक प्रतिक्रियाएँ पूछता है, इसलिए उसे उन्हें बिना मान के दिखाना चाहिए। `reaction-labels="names"` हर उस दिशा के लिए तीर बनाता है जिसे सपोर्ट रोकता है, और तीर उस ओर होता है जिसे धनात्मक माना जाता है: नोड के x के अनुदिश (सपोर्ट घुमाया न गया हो तो दाईं ओर), ऊपर की ओर, और फिक्स्ड सिरे के आघूर्ण के लिए वामावर्त। हर तीर का नाम उसके नोड के नाम पर होता है, *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>*, italic में और असली subscript के साथ। इस तरह हर उत्तर का चिह्न ड्रॉइंग पर ही तय हो जाता है: जो प्रतिक्रिया उलटी दिशा में लगती है, वह ऋणात्मक है।

```vue
<StructurePlot
  :model="model"
  :layers="['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']"
  reaction-labels="names"
/>
```

![ऊपर, अभ्यास पत्रक के रूप में एक प्रॉप्ड कैंटिलीवर: A पर फिक्स्ड, B पर रोलर, स्पैन के मध्य में 40 kN, 3 m और 3 m की क्रमवार विमा रेखाएँ और कुल 6 m, और प्रतिक्रियाएँ नाम वाले तीरों A_x, A_z, M_A और B_z के रूप में। नीचे, वही बीम default प्रतिक्रिया लेबलों के साथ: ऊपर की ओर 27.5 और 12.5, फिक्स्ड सिरे का आघूर्ण 45, और बंकन आघूर्ण दीवार पर −45 से भार के नीचे 37.5 तक।](/screenshots/hi/p4-plot-reaction-names.webp){.shot-lg}

नामों के लिए परिणाम नहीं चाहिए, इसलिए जो मॉडल हल नहीं हुआ है, उसे भी अभ्यास पत्रक के रूप में बनाया जा सकता है। उत्तर कुंजी के लिए `reactionLabels` को `'values'` पर रहने दें। नाम और मान अलग-अलग जगह लेते हैं (शून्य क्षैतिज प्रतिक्रिया का पत्रक पर नाम होता है, पर उत्तर कुंजी में कोई तीर नहीं), इसलिए जो प्लॉट दोनों के बीच बदलता है, उसे `:reserve-reaction-labels="['names', 'values']"` से दोनों के लिए जगह छोड़नी चाहिए: तब ड्रॉइंग अपनी जगह रहती है और केवल लेबल बदलते हैं। [अभ्यास और प्रश्नपत्र](/hi/plot/exercises#the-exercise-in-a-page) का अभ्यास कार्ड `answers` prop से इन दोनों के बीच बदलता है, जैसे इस साइट के [अभ्यास प्रश्न](/hi/practice) तब करते हैं जब विद्यार्थी हल माँगता है।

## थंबनेल {#thumbnails}

`compact` लगभग 400 × 200 px की टाइलों के लिए बनाता है: छोटे प्रतीक और 11.5 px का पाठ, हर सदस्य पर अधिक से अधिक दो मान, और रेखीय भारों पर केवल उनका परिमाण, बिना `q =` के।

```vue
<StructurePlot v-for="t in tiles" :key="t.title" :solver="t.solver" compact :height="200" :title="t.title" />
```

इस साइट की [उदाहरण गैलरी](/hi/examples/) इसी तरह बनी है।

## आकार {#size}

प्लॉट अपना box मापता है और उसी चौड़ाई पर, असली पिक्सेल में, लेआउट बनाता है। `height` के बिना उसकी ऊँचाई ड्रॉइंग के अनुसार होती है, `maxHeight` तक, जो default रूप से $\max(320, 0.75 \times \text{width})$ है। मापने से पहले, जैसे सर्वर पर, वह `width` का उपयोग करता है, default रूप से 640 px।

| Prop | Default | क्या तय करता है |
| --- | --- | --- |
| `width` | 640, compact 400 | box मापे जाने तक लेआउट की चौड़ाई, px |
| `height` | follows the drawing | तय ऊँचाई, px |
| `maxHeight` | $\max(320, 0.75w)$, compact none | स्वचालित ऊँचाई की ऊपरी सीमा |
| `padding` | 6 | ड्रॉइंग के चारों ओर की जगह, px |
| `fontSize` | 13, compact 11.5 | पाठ का आकार, px |
| `diagramSize` | 48, compact 26 | सबसे बड़ी कोटि की लंबाई, px |
| `deformedSize` | 30, compact 18 | विरूपित आकार का सबसे बड़ा विस्थापन, px |

### एक ही पैमाने पर कई प्लॉट {#several-plots-at-one-scale}

हर प्लॉट अपने आरेखों का पैमाना अपने ही सबसे बड़े मान से तय करता है, इसलिए 20 kNm का आघूर्ण उतना ही बड़ा दिखता है जितना 80 kNm का। तुलना करनी हो तो `diagramScale` से पैमाना पिक्सेल प्रति SI इकाई में तय करें:

```vue
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams' // “शुरुआत” पृष्ठ से: (span m, q kN/m) => हल किया गया सॉल्वर

const spans = [4, 6, 8].map((L) => ({ L, solver: simpleBeam(L, 10) }))
// 0.5 px प्रति kNm (0.5e-3 px प्रति N·m): 8 m स्पैन का 80 kNm 40 px गहरा बनता है, 4 m स्पैन का 20 kNm 10 px
const scale = { M: 0.5e-3 }
</script>

<template>
  <figure v-for="s in spans" :key="s.L">
    <StructurePlot :solver="s.solver" :layers="['members', 'supports', 'M']" :diagram-scale="scale" />
    <figcaption>L = {{ s.L }} m</figcaption>
  </figure>
</template>
```

## इकाइयाँ और संख्याएँ {#units-and-numbers}

अंदर मान SI में रहते हैं और केवल दिखाने के लिए बदले जाते हैं: default रूप से kN, kNm, kN/m, m, mm, mrad और K। किसी भी इकाई को आप एक प्रतीक और एक पैमाने से बदल सकते हैं; दिखाया गया मान = SI मान × पैमाना:

```vue
<StructurePlot :solver="solver" :units="{ force: { symbol: 'N', scale: 1 } }" />
```

संख्याएँ एक `Intl.NumberFormat` से गुज़रती हैं, जो default रूप से अंग्रेज़ी है और अधिक से अधिक एक दशमलव स्थान देता है। पेज की भाषा से मेल खाने के लिए अपना format दें:

```vue
<StructurePlot :solver="solver" :number-format="new Intl.NumberFormat('cs', { maximumFractionDigits: 2 })" />
```

ऋण चिह्न असली ऋण चिह्न (−) होते हैं, और जो मान शून्य पर round होता है वह कभी −0 नहीं दिखता। इकाइयों के नाम `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` और `temperature` हैं; शुरुआत के लिए `KN_UNITS` और `SI_UNITS` export किए गए हैं।

## मान पढ़ना {#reading-values}

`hover` के साथ प्लॉट पॉइंटर के नीचे वाले सदस्य-बिंदु पर दिखाए गए परिणाम पढ़ता है। हर मान को वह वहीं चिह्नित करता है जहाँ वह बना है: दिखाए गए हर आरेख की कोटि के सिरे पर एक बिंदु (उछाल पर दोनों सिरों पर) या विरूपित आकार पर, और मानों को एक pill में लिखता है, जैसे `M = 54 kNm`, या उछाल के दोनों ओर, `V = 13.3 → −6.7 kN`। पॉइंटर सदस्य को उसके आरेख के ऊपर कहीं से भी पकड़ लेता है, केवल सदस्य पर से नहीं। प्लॉट मानों को डेटा के रूप में emit भी करता है:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { StructurePlot, type Readout } from '@edubeam/plot'
import { portalFrame } from './frame' // “स्लाइड और नोट्स” पृष्ठ से: () => हल किया गया सॉल्वर

const frame = portalFrame()
const reading = ref<Readout | null>(null)
</script>

<template>
  <StructurePlot :solver="frame" :layers="['members', 'supports', 'M']" hover @readout="reading = $event" />
  <p v-if="reading">
    Member {{ reading.member }}, {{ reading.x.toFixed(2) }} m from its start:
    M = {{ (reading.values.M.left / 1e3).toFixed(1) }} kNm
  </p>
</template>
```

Readout का रूप `{ member, x, px, py, values, u }` है: सदस्य, उसके अनुदिश स्थिति मीटर में, स्क्रीन पर बिंदु px में, `N`, `V`, `M` और `w` में से हर एक के लिए SI इकाइयों में `{ left, right }`, और अक्षीय विस्थापन `u`। पॉइंटर हटने पर यह `null` होता है। इस साइट के इंटरैक्टिव चित्र `hover` का उपयोग करते हैं: किसी पर पॉइंटर ले जाकर देखें।

`hover` के बिना प्लॉट कोई इवेंट listener नहीं लगाता, इसलिए पेज उसके ऊपर से scroll होता है और किसी लिंक के अंदर रखे प्लॉट पर टैप करने से लिंक खुलता है। `hover` के साथ प्लॉट केवल pointer इवेंट सुनता है, और टच स्क्रीन पर ऊर्ध्वाधर scroll और पिंच-ज़ूम काम करते रहते हैं।

## सुलभता {#accessibility}

हर प्लॉट एक `<svg role="img">` है, जिसका नाम उसका `title` prop होता है, या वह क्या दिखाता है उसका वर्णन, जैसे “Structure with its loads, reactions, bending moment”। छिपी हुई reserved लेयर `aria-hidden` होती हैं।
