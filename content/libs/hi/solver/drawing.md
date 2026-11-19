---
title: परिणामों का चित्रण
description: "हल किए गए @edubeam/fem मॉडल को @edubeam/plot से आरेखों में बदलें: Vue कंपोनेंट में, Node स्क्रिप्ट से अलग SVG फ़ाइल के रूप में, या बाद के लिए JSON में।"
order: 11
source: site
---

# परिणामों का चित्रण {#drawing-the-results}

[@edubeam/plot](/hi/plot) हल किए गए मॉडल को वैसे ही चित्रित करता है जैसे इस साइट के चित्र दिखते हैं: सदस्य, सपोर्ट, भार, प्रतिक्रियाएँ, N, V और M आरेख और विरूपित आकार, SVG के रूप में। उसे सॉल्वर दे दें; जो कुछ चाहिए, वह खुद पढ़ लेता है।

```bash
npm install @edubeam/plot @edubeam/fem vue
```

## Vue कंपोनेंट में {#in-a-vue-component}

```vue [BeamFigure.vue]
<script setup lang="ts">
import { markRaw } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot } from '@edubeam/plot'

// 12 kN/m भार वाला 6 m का सरल आलंबित बीम, SI इकाइयों में: m, N, Pa
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // पिन
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // रोलर
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

// केवल पढ़ा जाता है, watch नहीं होता: markRaw, Vue को सॉल्वर reactive बनाने से रोकता है
const beam = markRaw(solver)
</script>

<template>
  <StructurePlot
    :solver="beam"
    :layers="['members', 'supports', 'loads', 'reactions', 'M']"
  />
</template>
```

यह 36 kN की प्रतिक्रियाएँ और 54 kNm का आघूर्ण बनाता है, जैसा इस लाइव चित्र में है:

::model-figure{caption="BeamFigure.vue क्या बनाता है"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
---
::

`StructurePlot` लोड केस 0 चित्रित करता है; `loadCase` prop `solver.loadCases` में से कोई दूसरा चुनता है। यह सॉल्वर को watch नहीं करता: मॉडल बदलकर दोबारा हल करने के बाद फिर से चित्रित करने के लिए उसका `revision` prop बदलें। हर विकल्प [StructurePlot](/hi/plot/structure-plot) पृष्ठ पर है।

## ब्राउज़र के बिना {#without-a-browser}

`structureSvg`, जो @edubeam/plot 0.2 में नया है, वही चित्र एक अलग SVG फ़ाइल के रूप में लिखता है, सादे रंगों में, जिन्हें Word, Inkscape और LaTeX टूलचेन समझते हैं। न ब्राउज़र, न Vue कंपोनेंट, बस एक Node स्क्रिप्ट:

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { modelFromSolver, structureSvg } from '@edubeam/plot'

// वही बीम जो BeamFigure.vue में है
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

const svg = structureSvg(modelFromSolver(solver), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
  width: 640,
})
writeFileSync('beam.svg', svg)
```

फ़ाइल वही दिखाती है जो ऊपर का लाइव चित्र, बस छपाई वाले रंगों में। `width` उसका आकार पिक्सेल में तय करता है, क्योंकि यहाँ मापने के लिए कोई box नहीं है। चित्रों से भरे पूरे छपने लायक पृष्ठ के लिए ऐसी कई फ़ाइलें एक HTML पेज में रखें, जैसा @edubeam/plot की [प्रश्नपत्र छापने वाली स्क्रिप्ट](/hi/plot/exercises#print-a-test) करती है, बिना Vue और बिना ब्राउज़र के। `structureSvg` के विकल्प [फ़ंक्शन](/hi/plot/functions#a-standalone-svg-file) में हैं।

## सॉल्वर नहीं, चित्र भेजें {#ship-the-drawing-not-the-solver}

`modelFromSolver` हल किए गए मॉडल को साधारण, JSON में serialize होने लायक डेटा में बदल देता है: ज्यामिति, भार, प्रतिक्रियाएँ, और हर सदस्य के परिणाम सटीक बहुपदों के रूप में। build के समय हल करें, JSON भेजें, और उसे `solver` के बजाय `model` prop से चित्रित करें:

```ts
import { modelFromSolver } from '@edubeam/plot'

// ... to-svg.ts का हल किया हुआ बीम
writeFileSync('beam.json', JSON.stringify(modelFromSolver(solver)))
```

तब चित्र दिखाने वाला पेज कुछ भी हल नहीं करता: काम एक ही बार होता है, जब आप उसे build करते हैं। [एम्बेड करना](/hi/plot/embedding#ship-the-drawing-not-the-solver) कंपोनेंट वाला पक्ष दिखाता है, और [प्लॉट मॉडल](/hi/plot/model) डेटा का format।

बाकी सब, रंगों से लेकर होवर पर दिखने वाले मानों और खींचे जा सकने वाले भारों तक, [@edubeam/plot के दस्तावेज़ों](/hi/plot/getting-started) में है।
