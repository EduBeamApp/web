---
title: शुरुआत
description: "@edubeam/plot इंस्टॉल करें, @edubeam/fem से हल किए गए बीम को भार, प्रतिक्रियाओं और बंकन आघूर्ण के साथ Vue 3 ऐप में बनाएँ, मॉडल बदलने पर फिर से बनाएँ और SVG फ़ाइल में सहेजें।"
order: 1
group: परिचय
source: site
---

# शुरुआत {#getting-started}

ड्रॉइंग लाइब्रेरी @edubeam/plot समतल बीम, फ्रेम या ट्रस और उसके परिणामों को SVG में बनाती है: सदस्य, सपोर्ट, भार, प्रतिक्रियाएँ, N, V और M आरेख और विरूपित आकार, ठीक वैसे ही जैसे इस साइट के चित्र दिखते हैं। आप इसे [@edubeam/fem](/hi/solver) से हल किया गया मॉडल देते हैं, वही सॉल्वर जिस पर [EduBeam]{.edubeam} चलता है; लेआउट, पैमाना और हर संख्या की जगह यह लाइब्रेरी ख़ुद तय करती है।

शिक्षक इससे सीड (seed: यादृच्छिक संख्याओं का प्रारंभिक मान) से बनने वाले [अभ्यास और प्रश्नपत्र](/hi/plot/exercises), हर क्लिक के साथ आगे बढ़ने वाली [स्लाइड](/hi/plot/slides) और नोट्स के चित्र बनाते हैं, वेब पेज पर भी और LaTeX व Word के लिए फ़ाइलों के रूप में भी। इस साइट के [अभ्यास प्रश्न](/hi/practice) और [प्रश्नपत्र जनरेटर](/hi/exam) इसी से बने हैं।

::div{.actions}
[अपना पहला प्लॉट बनाएँ](#draw-a-solved-model) [अभ्यास बनाएँ](/hi/plot/exercises)
::

## इंस्टॉल करना {#install}

```bash
npm install @edubeam/plot @edubeam/fem vue
```

Vue 3.5 या उसके बाद का संस्करण और सॉल्वर peer dependencies हैं, इसलिए आपके ऐप में हर एक की केवल एक प्रति रहती है। पैकेज केवल ESM है, अपनी type definitions साथ लाता है और उसे किसी stylesheet की ज़रूरत नहीं होती। यह Node 20.19 या उसके बाद के संस्करणों में चलता है; TypeScript में लिखी स्क्रिप्ट को सीधे, `node script.ts` से चलाने के लिए Node 22.18 या उसके बाद का संस्करण चाहिए।

## हल किया गया मॉडल बनाना {#draw-a-solved-model}

दो फ़ाइलें। पहली, `beams.ts`, @edubeam/fem से एक बीम बनाती और हल करती है। यह एक साधारण फ़ंक्शन है, इसलिए वही मॉडल किसी पेज, स्लाइड और स्क्रिप्ट, तीनों के काम आता है:

```ts [beams.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** `span` m लंबा सरल आलंबित बीम, `q` kN/m भार के साथ, हल किया हुआ। सॉल्वर SI इकाइयों में काम करता है। */
export const simpleBeam = (span: number, q: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 }) // स्टील, Pa
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 }) // IPE 200, अपरूपण में दृढ़
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // पिन
  domain.createNode('B', [span, 0, 0], [DofID.Dz]) // रोलर
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true) // N/m, +z नीचे की ओर
  solver.solve()
  return solver
}
```

दूसरी, `BeamFigure.vue`, सॉल्वर को `StructurePlot` को सौंपती है और बताती है कि क्या बनाना है:

```vue [BeamFigure.vue]
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams'

const beam = simpleBeam(6, 12)
</script>

<template>
  <StructurePlot :solver="beam" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
</template>
```

पूरा चित्र बस इतना ही है: अपने सपोर्टों पर बीम, 12 kN/m का भार, 36 kN की दो प्रतिक्रियाएँ और बंकन आघूर्ण (bending moment), जो स्पैन के मध्य में $qL^2/8 = 54$ kNm है और तनाव की ओर बनता है:

::model-figure{caption="BeamFigure.vue जो बनाता है: 12 kN/m भार के साथ 6 m का स्पैन"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
labels: horizontal
---
::

प्लॉट अपने container की पूरी चौड़ाई लेता है और अपनी ऊँचाई ख़ुद तय करता है। संरचना कितनी भी बड़ी हो, पाठ, प्रतीक और रेखाओं की मोटाई पिक्सेल में उतनी ही रहती है, इसलिए फ़ोन पर भी चित्र पढ़ा जा सकता है। `layers` न दें तो प्लॉट परिणाम ख़ुद चुनता है: बीम और फ्रेम के लिए M, ट्रस के लिए N। सारी [लेयर](/hi/plot/structure-plot#layers) `StructurePlot` पृष्ठ पर दी गई हैं; मॉडल बनाना [सॉल्वर के दस्तावेज़](/hi/solver/getting-started) में समझाया गया है।

## जब मॉडल बदले {#when-the-model-changes}

प्लॉट उसे दिया गया सॉल्वर पढ़ता है, उस पर नज़र नहीं रखता। कुछ बदले तो फिर से हल करें और नया सॉल्वर दें। `computed` ठीक यही करता है:

```vue [LoadSlider.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams'

const q = ref(12) // kN/m
const beam = computed(() => simpleBeam(6, q.value))
</script>

<template>
  <input v-model.number="q" type="range" min="1" max="30" />
  <StructurePlot :solver="beam" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
</template>
```

ऐसा बीम लगभग एक मिलीसेकंड में हल हो जाता है, इसलिए स्लाइडर खिसकाते ही चित्र भी साथ-साथ बदलता है। अगर आपने नया सॉल्वर बनाने के बजाय उसी सॉल्वर ऑब्जेक्ट को बदला है, तो `revision` prop बढ़ा दें: प्लॉट उसे फिर से पढ़ लेगा।

::callout{type="tip" title="सॉल्वर को deep reactivity से दूर रखें"}
`computed`, prop या साधारण `const` सॉल्वर को जैसा है वैसा ही रखते हैं। उसे कंपोनेंट की state में रखना हो तो `shallowRef` का उपयोग करें या उसे `markRaw` में लपेटें: साधारण `ref` में रखने पर Vue पूरे सॉल्वर को reactive बनाने के लिए उसकी हर property से गुज़रेगा, और वह भी बेवजह।
::

## फ़ाइल के रूप में सहेजना {#save-it-as-a-file}

LaTeX, Word या Inkscape के चित्र के लिए `structureSvg` वही ड्रॉइंग साधारण रंगों वाली एक स्वतंत्र SVG फ़ाइल के रूप में लिखता है। इसे न Vue चाहिए न ब्राउज़र, केवल Node। इसे `beams.ts` के पास `beam-svg.ts` नाम से सहेजें:

```ts [beam-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { simpleBeam } from './beams.ts'

const svg = structureSvg(modelFromSolver(simpleBeam(6, 12)), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
})
writeFileSync('beam.svg', svg)
```

इसे `node beam-svg.ts` से चलाएँ (Node 22.18 या उसके बाद; पुराने संस्करणों पर `npx tsx beam-svg.ts`)। विकल्प, और फ़ाइल को LaTeX और Word में लाने का तरीका, [स्वतंत्र SVG फ़ाइल](/hi/plot/functions#a-standalone-svg-file) में हैं।

## एक के नीचे एक आरेख {#the-stacked-figure}

`DiagramStack` वह चित्र बनाता है जो संरचनात्मक विश्लेषण की हर पाठ्यपुस्तक में होता है: भार के साथ एक सीधा बीम, और उसके नीचे एक ही x अक्ष पर उसके V(x), M(x) और w(x)। `v-model:load-at` के साथ पाठक एक बिंदु भार को बीम पर खींच सकता है और देख सकता है कि आरेख उसके साथ कैसे बदलते हैं:

```vue
<DiagramStack v-model:load-at="at" :solver="solveWithLoadAt(at)" />
```

पूरा उदाहरण [DiagramStack](/hi/plot/diagram-stack) पृष्ठ पर है।

## हर जगह उपयोग करना {#use-it-everywhere}

दोनों कंपोनेंट को हर फ़ाइल में अलग से import करने के बजाय पूरे ऐप के लिए एक बार register करें:

```ts [main.ts]
import { createApp } from 'vue'
import { EduBeamPlot } from '@edubeam/plot'
import App from './App.vue'

createApp(App).use(EduBeamPlot).mount('#app') // हर template में <StructurePlot> और <DiagramStack>
```

Named imports से bundle छोटा रहता है: जो पेज केवल `StructurePlot` import करता है, उसमें न `DiagramStack` आता है न plugin। दोनों कंपोनेंट Nuxt या VitePress में सर्वर पर भी render होते हैं: देखें [एम्बेड करना](/hi/plot/embedding)।

## आगे क्या पढ़ें {#next}

::card-grid{cols="2"}
:::card{title="अभ्यास और प्रश्नपत्र" icon="lucide:dices" to="/hi/plot/exercises"}
सीड से हर विद्यार्थी के लिए अलग अभ्यास, उसकी उत्तर कुंजी के साथ, छापने के लिए या LaTeX के लिए सहेजा हुआ।
:::
:::card{title="स्लाइड और नोट्स" icon="lucide:presentation" to="/hi/plot/slides"}
Slidev, Vue या Beamer में हर क्लिक के साथ आगे बढ़ते चित्र, और वही चित्र नोट्स के लिए।
:::
:::card{title="StructurePlot" icon="lucide:frame" to="/hi/plot/structure-plot"}
लेयर, विमा रेखाएँ, थंबनेल, आकार, इकाइयाँ और पॉइंटर से मान पढ़ना।
:::
:::card{title="DiagramStack" icon="lucide:rows-3" to="/hi/plot/diagram-stack"}
अपने V, M और w आरेखों के ऊपर बीम, और एक भार जिसे पाठक खींच सकता है।
:::
::
