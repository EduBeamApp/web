---
title: DiagramStack
description: "DiagramStack से एक ही x अक्ष पर बीम और उसके नीचे V(x), M(x) और w(x) आरेख बनाएँ, cursor से हर पंक्ति पढ़ें और पाठक को बिंदु भार बीम पर खींचने दें।"
order: 3
source: site
---

# DiagramStack {#diagramstack}

`DiagramStack` वह चित्र बनाता है जो संरचनात्मक विश्लेषण की हर पाठ्यपुस्तक में होता है: अपने सपोर्ट, भार और प्रतिक्रियाओं के साथ एक सीधा बीम, और उसके नीचे, उसी x अक्ष पर, उसका अपरूपण बल (shear force) V(x), बंकन आघूर्ण (bending moment) M(x) और विक्षेप (deflection) w(x)। एक cursor सारी पंक्तियाँ एक साथ पढ़ता है, और चाहें तो एक बिंदु भार को बीम पर खींचा जा सकता है।

```vue
<DiagramStack :solver="solver" />
```

![DiagramStack: 6 m का सरल आलंबित बीम, 20 kN के भार के साथ जिसे पाठक खींच सकता है, यहाँ बाएँ सपोर्ट से 4.3 m पर; प्रतिक्रियाएँ 5.7 kN और 14.3 kN, अपरूपण बल भार के नीचे 5.7 kN से −14.3 kN पर उछलता है, बंकन आघूर्ण वहीं 24.4 kNm के शिखर पर है, और विक्षेप का सबसे बड़ा मान 17 mm है।](/screenshots/hi/p2p-plot-diagram-stack.webp){.shot-lg}

सदस्यों को बाएँ से दाएँ बनी एक क्षैतिज रेखा बनानी चाहिए। कुछ और हो, जैसे झुकी या टूटी रेखा या दाएँ से बाएँ बना सदस्य, तो कंपोनेंट उसे ग़लत बनाने के बजाय error देकर अस्वीकार कर देता है, क्योंकि चित्र का x अक्ष बीम का ही अक्ष है। हर prop [कंपोनेंट API](/hi/plot/components#diagramstack) में है।

## पंक्तियाँ {#rows}

| Prop | Default | क्या तय करता है |
| --- | --- | --- |
| `rows` | `['V', 'M', 'w']` | आरेख, ऊपर से नीचे; `'N'` भी उपलब्ध है |
| `loadRow` | `true` | पंक्तियों के ऊपर बीम, अपने सपोर्ट, भार और प्रतिक्रियाओं के साथ |
| `members` | all members | बीम-रेखा के सदस्य, जब मॉडल में दूसरे सदस्य भी हों |
| `rowHeights` | N 100, V 116, M 128, w 76 px | पंक्तियों की ऊँचाई; 560 px से कम चौड़ाई पर थोड़ी कम |
| `maxHeight` | none | पंक्तियाँ अधिक से अधिक 60 % तक सिकुड़ती हैं ताकि चित्र समा जाए; पाठ का आकार वही रहता है |
| `ranges` | each row's own | हर पंक्ति के लिए मानों का तय दायरा, SI इकाइयों में |

V और N ऊपर की ओर धनात्मक बनते हैं, M और w नीचे की ओर, जैसे अधिकतर पाठ्यपुस्तकें उन्हें बनाती हैं: सैगिंग (निचले तंतुओं में तनाव) वाला आघूर्ण और नीचे की ओर विक्षेप अक्ष के नीचे दिखते हैं। हर पंक्ति अपने चरम मान लिखती है।

## पढ़ने वाला cursor {#the-reading-cursor}

`hover` default रूप से चालू है। चित्र पर पॉइंटर ले जाने से हर पंक्ति के आर-पार एक ऊर्ध्वाधर cursor दिखता है, और हर पंक्ति का मान एक pill में। किसी उछाल (jump) से 8 px के भीतर, यानी बिंदु भार या सपोर्ट पर, cursor उसी पर स्नैप हो जाता है, और V दोनों ओर के मान दिखाता है, जैसे ऊपर के चित्र में भार के नीचे `5.7 → −14.3 kN`। कंपोनेंट मान emit भी करता है:

```vue
<DiagramStack :solver="solver" @readout="(r) => (reading = r)" />
```

Readout का रूप `{ x, values }` है: `x` बीम के अनुदिश मीटर में, और हर पंक्ति के लिए SI इकाइयों में `{ left, right }`; पॉइंटर हटने पर `null`।

## भार जिसे पाठक खींच सके {#a-load-the-reader-can-drag}

`v-model:load-at` को एक बिंदु भार की स्थिति दें, और उस भार को एक पकड़ (grip) मिल जाती है: पाठक उसे पॉइंटर से खींचता है, या उस पर focus करके तीर कुंजियों का उपयोग करता है। कंपोनेंट केवल नई स्थिति बताता है। बीम को भार की नई स्थिति के साथ फिर से हल करें और नया सॉल्वर वापस दें, जैसे `MovingLoad.vue` करता है:

```vue [MovingLoad.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { beamLine, DiagramStack, lineDiagram, modelFromSolver, rowRange, type StackRow } from '@edubeam/plot'

const L = 6 // m
const P = 20e3 // N

/** A से `at` मीटर पर बिंदु भार वाला बीम, हल किया हुआ। */
const solveWithLoadAt = (at: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamConcentratedLoad(1, [0, P, 0, at], true)
  solver.solve()
  return solver
}

/** भार की हर स्थिति पर हर पंक्ति का दायरा, ताकि आरेख नया पैमाना लेने के बजाय बढ़ें और घटें। */
const rows: StackRow[] = ['V', 'M', 'w']
const envelope = (() => {
  const ranges: Partial<Record<StackRow, [number, number]>> = {}
  for (let at = 0.25; at < L; at += 0.25) {
    const model = modelFromSolver(solveWithLoadAt(at))
    const line = beamLine(model)
    for (const row of rows) {
      const [lo, hi] = rowRange(lineDiagram(model, line, row))
      const [min, max] = ranges[row] ?? [0, 0]
      ranges[row] = [Math.min(min, lo), Math.max(max, hi)]
    }
  }
  return ranges
})()

const at = ref(2)
const solver = computed(() => solveWithLoadAt(at.value))
</script>

<template>
  <DiagramStack v-model:load-at="at" :solver="solver" :rows="rows" :ranges="envelope" load-label="P = 20 kN" />
  <p>The load is {{ at.toFixed(2) }} m from A.</p>
</template>
```

भार 4.3 m पर हो तो चित्र प्रतिक्रियाएँ 5.7 kN और 14.3 kN दिखाता है, भार के नीचे अपरूपण बल का 5.7 से −14.3 kN तक उछाल, और वहीं $M = 5.67 \cdot 4.3 = 24.4$ kNm। `ranges` के बिना भार खिसकने पर हर पंक्ति अपने ही चरम मानों के अनुसार नया पैमाना ले लेती, और आरेख बदलते हुए दिखते ही नहीं।

| Prop | Default | क्या तय करता है |
| --- | --- | --- |
| `loadAt` | none | भार की स्थिति, रेखा के आरंभ से m में; `v-model:load-at` के साथ |
| `loadLabel` | `P = …` | पकड़ के पास लिखा पाठ |
| `loadStep` | 0.05 | खींचने पर स्थिति इस अंतराल तक round होती है, m; तीर कुंजियाँ इतना ही खिसकाती हैं |

पकड़ एक focus होने वाला `role="slider"` है, जो screen reader को अपना दायरा और स्थिति बताता है। तीर कुंजियाँ उसे `loadStep` जितना खिसकाती हैं, Page Up और Page Down 1 m, और Home और End बीम के सिरों तक। टच स्क्रीन पर उसे उँगली से खींचा जा सकता है, और चित्र के ऊपर ऊर्ध्वाधर scroll फिर भी काम करता है।

पकड़ उस बिंदु बल की जगह दिखती है जो हल किए गए मॉडल में `loadAt` पर है: वह बल पकड़ के रूप में बनता है, और उस पर उसका परिमाण लिखा होता है, जब तक आप `loadLabel` न दें। भार को मॉडल में उसी स्थिति पर रखें, जैसे `solveWithLoadAt` करता है।

## आकार और सर्वर रेंडरिंग {#size-and-server-rendering}

चित्र अपना box मापता है और उसी चौड़ाई पर लेआउट बनाता है, कम से कम 320 px। मापने से पहले वह `width` का उपयोग करता है, default रूप से 720 px। पाठ 12.5 px का होता है (`fontSize`) और चित्र के साथ कभी छोटा नहीं होता।
