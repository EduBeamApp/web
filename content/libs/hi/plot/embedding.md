---
title: एम्बेड करना
description: "@edubeam/plot के चित्र Vite ऐप, VitePress पाठ्यक्रम नोट्स या Nuxt साइट में लगाएँ, सर्वर पर render करें, पहले से हल मॉडल JSON में भेजें, या Vue के बिना साधारण SVG लिखें।"
order: 7
source: site
---

# एम्बेड करना {#embedding}

कंपोनेंट साधारण Vue 3 हैं, इसलिए जहाँ Vue चलता है वहाँ ये भी चलते हैं, और ब्राउज़र के साथ-साथ सर्वर पर भी render होते हैं। प्लॉट के mount होने से पहले कुछ भी `window` को नहीं छूता, और हर प्लॉट को अपने अलग id मिलते हैं, इसलिए एक पेज पर कितने भी प्लॉट रह सकते हैं। अपना setup चुनें:

| आपके पास है | यह करें |
| --- | --- |
| Vite से बना Vue ऐप | इंस्टॉल करें, import करें, बस: [Vite ऐप](#a-vite-app) |
| Markdown में पाठ्यक्रम के नोट्स | VitePress में plugin एक बार register करें: [VitePress में पाठ्यक्रम नोट्स](#vitepress-course-notes) |
| Nuxt साइट | कंपोनेंट import करें, या plugin जोड़ें: [Nuxt](#nuxt) |
| ऐसा पेज जो केवल चित्र दिखाता है | build के समय हल करें और JSON भेजें: [सॉल्वर नहीं, चित्र भेजें](#ship-the-drawing-not-the-solver) |
| Vue बिल्कुल नहीं | Node में SVG लिखें: [Vue के बिना](#plain-html-from-node) |

## Vite ऐप {#a-vite-app}

```bash
npm create vue@latest
npm install @edubeam/plot @edubeam/fem
```

कंपोनेंट वहीं import करें जहाँ उनका उपयोग करते हैं, जैसे [शुरुआत](/hi/plot/getting-started#draw-a-solved-model) में, या दोनों को `app.use(EduBeamPlot)` से एक बार register करें। और कुछ configure नहीं करना: न stylesheet, न bundler plugin।

## VitePress में पाठ्यक्रम नोट्स {#vitepress-course-notes}

[VitePress](https://vitepress.dev) Vue के साथ Markdown पेज बनाता है, इसलिए पाठ्यक्रम के नोट्स के लिए यह अच्छी जगह है। कंपोनेंट theme में, `.vitepress/theme/index.ts` में, register करें:

```ts [.vitepress/theme/index.ts]
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { EduBeamPlot } from '@edubeam/plot'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(EduBeamPlot) // हर पेज में <StructurePlot> और <DiagramStack>
  },
} satisfies Theme
```

फिर `frame.ts` के पास किसी पेज में ही मॉडल बनाएँ और उसका चित्र बनाएँ:

```md [portal-frame.md]
<script setup lang="ts">
import { portalFrame } from './frame' // () => हल किया गया LinearStaticSolver

const frame = portalFrame()
</script>

# Portal frame

The bending moment under the design loads:

<StructurePlot :solver="frame" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

`vitepress build` फ्रेम को हल करता है और तैयार SVG, लेबलों समेत, पेज के HTML में लिख देता है। ब्राउज़र में पेज hydrate होता है, और प्लॉट ख़ुद को column की चौड़ाई में फ़िट कर लेता है। `frame.ts` [स्लाइड और नोट्स](/hi/plot/slides#a-figure-that-builds-up) पृष्ठ पर है।

## Nuxt {#nuxt}

Nuxt भी सर्वर पर render करता है; यह साइट इसी से बनी है। कंपोनेंट को किसी पेज या कंपोनेंट में हमेशा की तरह import करें, या पूरे ऐप के लिए `plugins/edubeam-plot.ts` में plugin से register करें:

```ts [plugins/edubeam-plot.ts]
import { EduBeamPlot } from '@edubeam/plot'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(EduBeamPlot)
})
```

सर्वर पर मापने के लिए कोई box नहीं होता, इसलिए प्लॉट का लेआउट उसके `width` prop पर बनता है: default रूप से 640 px (`compact` के साथ 400 px), `DiagramStack` के लिए 720 px। mount होने के बाद वह अपनी असली चौड़ाई पर फिर से लेआउट बनाता है। अगर आपका column इससे बहुत संकरा या चौड़ा है, तो `width` में उसके क़रीब का अनुमान दें, तब पेज load होते समय चित्र का आकार नहीं बदलेगा।

## सॉल्वर नहीं, चित्र भेजें {#ship-the-drawing-not-the-solver}

जो पेज केवल चित्र दिखाता है, उसे सॉल्वर की ज़रूरत नहीं। `modelFromSolver` हल किए गए मॉडल को साधारण डेटा में पढ़ता है: नोड, सदस्य, भार, प्रतिक्रियाएँ, और हर सदस्य के N, V, M और विस्थापन सटीक बहुपदों के रूप में। इसे build के समय बनाएँ, `build-figures.ts` जैसी किसी स्क्रिप्ट से:

```ts [build-figures.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

writeFileSync('portal-frame.json', JSON.stringify(modelFromSolver(portalFrame())))
```

और `model` prop से उसका चित्र बनाएँ:

```vue
<script setup lang="ts">
import { StructurePlot, type PlotModel } from '@edubeam/plot'
import frame from './portal-frame.json'
</script>

<template>
  <StructurePlot :model="frame as PlotModel" />
</template>
```

पोर्टल फ्रेम का JSON 2 kB से कम है, और उसका चित्र ठीक वैसा ही बनता है जैसा उसके सॉल्वर से। मॉडल पर हर सुविधा उसी तरह काम करती है जैसे सॉल्वर पर, और दोनों दें तो `model` को प्राथमिकता मिलती है। इसका स्वरूप [प्लॉट मॉडल](/hi/plot/model) पृष्ठ पर समझाया गया है।

## Vue के बिना {#plain-html-from-node}

`structureSvg` मॉडल को SVG फ़ाइल के पाठ में बदलता है, साधारण रंगों के साथ और बिना style या script के। इसे किसी भी HTML, static site generator, Markdown फ़ाइल या CMS में चिपका दें। यह स्क्रिप्ट एक चित्र वाला पेज लिखती है:

```ts [frame-html.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const svg = structureSvg(modelFromSolver(portalFrame()), { layers: ['members', 'supports', 'reactions', 'M'] })
writeFileSync('frame.html', `<!doctype html><meta charset="utf-8"><title>Portal frame</title>${svg}`)
```

ऐसे चित्र का आकार वही रहता है जिस पर वह लिखा गया, default रूप से 640 px चौड़ा (`max-width: 100%; height: auto` उसे column के साथ सिकुड़ने देता है), और उसकी अपनी सफ़ेद पृष्ठभूमि होती है; `background: false` उसे पारदर्शी छोड़ता है। वह dark थीम का पालन नहीं करता और पॉइंटर के नीचे मान नहीं पढ़ता: इसके लिए कंपोनेंट render करें। [प्रश्नपत्र छापने वाली स्क्रिप्ट](/hi/plot/exercises#print-a-test) इसी तरह पूरा प्रश्नपत्र छापती है, और [स्वतंत्र SVG फ़ाइल](/hi/plot/functions#a-standalone-svg-file) में सारे विकल्प हैं।
