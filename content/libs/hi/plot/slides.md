---
title: स्लाइड और नोट्स
description: "@edubeam/plot से व्याख्यान के चित्र: Slidev, Vue या Beamer में हर क्लिक के साथ आगे बढ़ते, लाइव हल होते, और SVG के रूप में नोट्स, PowerPoint और Word में।"
order: 6
source: site
---

# स्लाइड और व्याख्यान नोट्स {#slides-and-lecture-notes}

संरचना को उसी क्रम में दिखाएँ जिसमें आप उसे समझाते हैं: पहले ज्यामिति, फिर सपोर्ट और भार, फिर प्रतिक्रियाएँ, और अंत में बंकन आघूर्ण (bending moment)। हल किए गए मॉडल से बना चित्र अपनी जगह पर ही, हर क्लिक के साथ एक लेयर जोड़ता हुआ पूरा होता है, और उसमें कभी कोई ग़लती नहीं होती। फिर वही मॉडल आपके नोट्स के चित्र भी देता है।

![0, 2 और 4 क्लिक के बाद एक Slidev स्लाइड: पहले पोर्टल फ्रेम के नोड उसकी विमा रेखाओं के साथ, फिर अपने सपोर्टों और भारों के साथ फ्रेम, फिर प्रतिक्रियाएँ और बंकन आघूर्ण।](/screenshots/hi/p2p-plot-slidev-steps.webp){.shot-md}

## क्रम से बनता चित्र {#a-figure-that-builds-up}

दो फ़ाइलें। `frame.ts` संरचना बनाती और हल करती है:

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** एक पोर्टल फ्रेम: 6 m × 4 m, स्तंभों के नीचे पिन सपोर्ट, बीम पर 10 kN/m और B पर धकेलता 15 kN का बल। */
export const portalFrame = (): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 }) // IPE 300
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [0, 0, -4]) // z नीचे की ओर है: 4 m ऊपर
  domain.createNode('C', [6, 0, -4])
  domain.createNode('D', [6, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  domain.createBeam2D(2, ['B', 'C'], 1, 1)
  domain.createBeam2D(3, ['C', 'D'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(2, [0, 10e3], true)
  solver.loadCases[0].createNodalLoad('B', { [DofID.Dx]: 15e3 })
  solver.solve()
  return solver
}
```

`BuildUp.vue` उसे चरणों में बनाता है। हर चरण उन लेयरों की सूची है जो वह दिखाता है, और `reserve` पहले क्लिक से ही सबका लेआउट बना लेता है, इसलिए हर लेयर अपनी जगह पर उभरती है और कुछ नहीं हिलता:

```vue [BuildUp.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { StructurePlot, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame'

const props = defineProps<{ step: number }>()

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'], // ज्यामिति
  ['nodeLabels', 'members', 'supports'], // संरचना
  ['nodeLabels', 'members', 'supports', 'loads'], // उसके भार
  ['members', 'supports', 'loads', 'reactions'], // प्रतिक्रियाएँ
  ['members', 'supports', 'reactions', 'M'], // और बंकन आघूर्ण
]
const all = [...new Set(stages.flat())] // पहले चरण से ही लेआउट में, ताकि बाद में कुछ न हिले
const layers = computed(() => stages[Math.min(props.step, stages.length - 1)])

const frame = portalFrame()
</script>

<template>
  <StructurePlot :solver="frame" :layers="layers" :reserve="all" :height="360" />
</template>
```

लेयर हट भी सकती है: अंतिम चरण आघूर्ण को जगह देने के लिए भार हटा देता है। `:height="360"` चित्र को स्लाइड के भीतर रखता है। सदस्य पहली बार दिखने पर एक सिरे से दूसरे सिरे तक अपने-आप बनते जाते हैं, और लेयर आधे सेकंड में उभरती हैं; `prefers-reduced-motion` में दोनों बंद रहते हैं, और `:animate="false"` इन्हें सबके लिए बंद कर देता है। व्याख्यान कक्ष के लिए इन्हें धीमा करना हो तो देखें [Animation बदलना](/hi/plot/theming#restyling-the-animation)।

## Slidev में {#in-slidev}

[Slidev](https://sli.dev) Vue के साथ Markdown से स्लाइड बनाता है, इसलिए कंपोनेंट वहाँ जैसा है वैसा ही काम करता है। डेक में लाइब्रेरियाँ इंस्टॉल करें:

```bash
npm install @edubeam/plot @edubeam/fem
```

`frame.ts` और `BuildUp.vue` को डेक के `components/` फ़ोल्डर में रखें, और `slides.md` में स्लाइड के क्लिकों से चरण चलाएँ:

```md [slides.md]
---
clicks: 4
---

# From geometry to bending moment

<BuildUp :step="$clicks" />
```

`clicks: 4` स्लाइड को चार क्लिक देता है, और `$clicks` उन्हें 0 से गिनता है। तीर कुंजी के हर दबाव पर अगला चरण दिखता है; पीछे जाने पर वह फिर छिप जाता है। `slidev export` डेक की PDF बनाता है, और `--with-clicks` के साथ हर क्लिक के लिए एक पेज।

## किसी भी Vue स्लाइड में {#in-any-vue-slides}

बाकी हर जगह चरण आप ख़ुद रखें:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import BuildUp from './BuildUp.vue'

const step = ref(0)
</script>

<template>
  <BuildUp :step="step" />
  <button type="button" @click="step = Math.max(0, step - 1)">Back</button>
  <button type="button" @click="step++">Next</button>
</template>
```

## व्याख्यान में ही हल करें {#solve-it-live}

ऐसे फ्रेम के लिए सॉल्वर कुछ मिलीसेकंड लेता है, इसलिए आप व्याख्यान के दौरान ही संरचना बदलकर उसे तुरंत हल कर सकते हैं। किसी भार को स्लाइडर से जोड़ें और हर बार नया हल किया गया मॉडल दें, जैसे [जब मॉडल बदले](/hi/plot/getting-started#when-the-model-changes) में।

- **चलता हुआ भार।** [DiagramStack](/hi/plot/diagram-stack#a-load-the-reader-can-drag) विद्यार्थियों को बिंदु भार बीम पर खींचने देता है, और वे देखते हैं कि अपरूपण बल और बंकन आघूर्ण उसके साथ कैसे बदलते हैं।
- **दो स्थितियाँ साथ-साथ।** [`diagramScale`](/hi/plot/structure-plot#several-plots-at-one-scale) तय करें, तो दो प्लॉट अपने आघूर्ण एक ही पैमाने पर बनाते हैं, और बड़ा आघूर्ण बड़ा ही दिखता है।
- **मान पढ़ना।** `hover` के साथ किसी सदस्य पर पॉइंटर ले जाने से हर आरेख की कोटि के सिरे पर मान चिह्नित होता है: देखें [मान पढ़ना](/hi/plot/structure-plot#reading-values)।

## Beamer, PowerPoint और Word के लिए चित्र {#figures-for-beamer-powerpoint-and-word}

LaTeX Beamer या PowerPoint में बना डेक, या Word में लिखे नोट्स, चित्र को फ़ाइल के रूप में लेते हैं। `structureSvg` प्लॉट को साधारण रंगों वाली स्वतंत्र SVG फ़ाइल में लिखता है, लेआउट ठीक वैसा ही जैसा `StructurePlot` बनाता है। `frame.ts` के पास एक Node स्क्रिप्ट, `frame-svg.ts`:

```ts [frame-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![स्वतंत्र SVG फ़ाइल के रूप में पोर्टल फ्रेम, CairoSVG से render किया हुआ: भार, प्रतिक्रियाएँ, ऊपर की ओर 20 और 40 और क्षैतिज 2.3 और 12.7, और बंकन आघूर्ण C पर −50.7 से बीम में 29.3 तक।](/screenshots/hi/p2p-plot-frame-svg.webp){.shot-lg}

PowerPoint और Word (2019 और Microsoft 365) SVG को जैसा है वैसा ही डाल देते हैं। LaTeX इसे PDF के रूप में लेता है: `cairosvg frame.svg -o frame.pdf` या Inkscape से बदलें, या यह काम `svg` package के `\includesvg` पर छोड़ दें। विवरण [LaTeX और Word के लिए चित्र](/hi/plot/exercises#figures-for-latex-and-word) में है, और हर विकल्प [स्वतंत्र SVG फ़ाइल](/hi/plot/functions#a-standalone-svg-file) में।

### Beamer में क्रम से बनता चित्र {#a-build-up-in-beamer}

फ़ाइल उन्हीं लेयरों के अनुसार फ़िट होती है जिन्हें वह बनाती है, इसलिए हर चरण के लिए अलग-अलग लिखी फ़ाइलें एक-दूसरे से मेल नहीं खातीं। `structureSvg` को वही `reserve` दें जो `BuildUp.vue` में है, यानी हर चरण की हर लेयर, तो हर फ़ाइल का आकार एक जैसा होगा और संरचना एक ही जगह पर। `frame-stages.ts` हर चरण के लिए एक फ़ाइल लिखती है:

```ts [frame-stages.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'],
  ['nodeLabels', 'members', 'supports'],
  ['nodeLabels', 'members', 'supports', 'loads'],
  ['members', 'supports', 'loads', 'reactions'],
  ['members', 'supports', 'reactions', 'M'],
]
const all = [...new Set(stages.flat())]
const frame = modelFromSolver(portalFrame())

stages.forEach((layers, i) => {
  writeFileSync(`frame-${i + 1}.svg`, structureSvg(frame, { layers, reserve: all }))
})
```

फ़ाइलों को PDF में बदलें:

```bash
for i in 1 2 3 4 5; do cairosvg frame-$i.svg -o frame-$i.pdf; done
```

और हर एक को उसका अपना overlay दें। हर फ़ाइल में पूरा चरण है, इसलिए Beamer का `frame` एक समय में एक ही फ़ाइल दिखाता है, और क्योंकि वे मेल खाती हैं, हर क्लिक पर ऐसा लगता है जैसे एक लेयर जुड़ गई:

```latex [lecture.tex]
\begin{frame}{From geometry to bending moment}
  \centering
  \includegraphics<1>[width=0.8\linewidth]{frame-1.pdf}%
  \includegraphics<2>[width=0.8\linewidth]{frame-2.pdf}%
  \includegraphics<3>[width=0.8\linewidth]{frame-3.pdf}%
  \includegraphics<4>[width=0.8\linewidth]{frame-4.pdf}%
  \includegraphics<5>[width=0.8\linewidth]{frame-5.pdf}
\end{frame}
```

PowerPoint में पाँचों फ़ाइलें लगातार पाँच स्लाइडों पर रखें, उनके बीच कोई transition न हो: हर चरण व्याख्यान में एक क्लिक जैसा ही दिखता है।

## नोट्स और हैंडआउट {#notes-and-handouts}

- **वेब पर पाठ्यक्रम के नोट्स।** VitePress और Nuxt प्लॉट को build के समय render करते हैं, इसलिए कोई script चलने से पहले ही चित्र HTML में होते हैं: देखें [एम्बेड करना](/hi/plot/embedding)।
- **छपे नोट्स।** `structureSvg` से चित्रों को एक HTML पेज में लिखें और उसे छापें, जैसे [प्रश्नपत्र छापने वाली स्क्रिप्ट](/hi/plot/exercises#print-a-test) करती है, या फ़ाइलों को LaTeX या Word में डालें।
- **एक मॉडल, हर चित्र।** वही `frame.ts` स्लाइड, नोट्स और अभ्यास पत्रक, तीनों को चित्र देता है, इसलिए वे कभी एक-दूसरे से अलग नहीं होते।
