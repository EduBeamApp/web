---
title: अभ्यास और प्रश्नपत्र
description: "सीड के आधार पर हर विद्यार्थी के लिए अलग स्थैतिकी अभ्यास और हमेशा सही उत्तर कुंजी: वेब पेज पर, छपे प्रश्नपत्र में या LaTeX व Word के लिए SVG चित्रों में।"
order: 5
group: उपयोग
source: site
---

# अभ्यास और प्रश्नपत्र {#exercises-and-tests}

संरचना को एक बार सीड (seed: यादृच्छिक संख्याओं का प्रारंभिक मान) के फ़ंक्शन के रूप में लिखें: फिर हर सप्ताह हर विद्यार्थी के लिए अलग अभ्यास तैयार है, और हर एक की उत्तर कुंजी हमेशा सही होती है: @edubeam/fem उसे हल करता है, और @edubeam/plot उसी मॉडल से प्रश्न और उत्तर कुंजी दोनों बनाता है।

नीचे **नया अभ्यास** दबाएँ। हर बार नया सीड लिया जाता है, और अभ्यास आपके ब्राउज़र में ही बनता, हल होता और चित्र के रूप में दिखता है।

::exercise-generator
::

यह डेमो इस साइट के दो पेजों के प्रश्न बनाता है, जो दोनों यहाँ बताए गए हिस्सों से बने हैं: [अभ्यास प्रश्न](/hi/practice), जहाँ विद्यार्थी प्रतिक्रियाएँ और सबसे बड़ा आघूर्ण या छड़ का बल भरता है और उसके उत्तर तुरंत जाँचे जाते हैं, और [प्रश्नपत्र जनरेटर](/hi/exam), जो हर विद्यार्थी के लिए प्रश्नपत्र का अलग सेट उत्तर कुंजी के साथ छापता है, चित्रों को SVG फ़ाइलों में और उत्तरों को CSV में सहेजता है। अपना कोड लिखने से पहले इन्हें आज़माएँ।

## यह कैसे काम करता है {#how-it-works}

1. **सीड संख्याएँ चुनता है।** सीड वाला यादृच्छिक जनरेटर एक ही सीड के लिए हमेशा वही अभ्यास देता है, इसलिए पत्रक पर छपे सीड से उसकी उत्तर कुंजी फिर से मिल जाती है।
2. **सॉल्वर उत्तर कुंजी निकालता है।** @edubeam/fem हर संरचना हल करता है, इसलिए प्रतिक्रियाएँ और आघूर्ण सॉल्वर से आते हैं, किसी ऐसे सूत्र से नहीं जिसमें आपसे ग़लती हो सकती है।
3. **प्लॉट दोनों बनाता है।** प्रश्न पत्रक संरचना को उसके नोड लेबलों, विमा रेखाओं और नाम वाली अज्ञात प्रतिक्रियाओं के साथ दिखाता है; उत्तर कुंजी प्रतिक्रियाओं के मान देती है और आरेख जोड़ती है।

छपे प्रश्नपत्र तक पहुँचने के लिए कुछ छोटी फ़ाइलें काफ़ी हैं: [जनरेटर](#the-generator), वेब पेज के लिए [एक कंपोनेंट](#the-exercise-in-a-page), और [एक स्क्रिप्ट](#print-a-test) जो प्रश्नपत्र छापती है या LaTeX और Word के लिए [चित्र लिखती है](#figures-for-latex-and-word)। इन्हें ऐसे प्रोजेक्ट में कॉपी करें जिसमें [लाइब्रेरियाँ इंस्टॉल](/hi/plot/getting-started#install) हों; स्क्रिप्टें Node 22.18 या उसके बाद के संस्करण में सीधे `node` से चलती हैं, पुराने संस्करणों पर `npx tsx` से।

## जनरेटर {#the-generator}

एक module, `exercise.ts`, सीड को अभ्यास में बदलता है: पिन सपोर्ट और रोलर सपोर्ट पर एक बीम, आधी बार ओवरहैंग (overhang) के साथ, जिसके सिरे पर बिंदु भार है। दोनों रूप स्थैतिकतः निर्धार्य (statically determinate) हैं, इसलिए हर सीड हाथ से भी हल हो सकता है और सॉल्वर से भी।

```ts [exercise.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { extremes, modelFromSolver, type PlotModel } from '@edubeam/plot'

export interface Exercise {
  readonly seed: number
  readonly statement: string
  /** हल की गई संरचना, साधारण डेटा के रूप में: इसी से प्रश्न और उत्तर कुंजी दोनों बनते हैं */
  readonly model: PlotModel
  /** ऊपर की ओर धनात्मक सपोर्ट प्रतिक्रियाएँ, N, और बंकन आघूर्ण के चरम मान, N·m */
  readonly key: { RA: number; RB: number; mMax: number; mMin: number }
}

/** mulberry32: सीड वाला एक छोटा जनरेटर, ताकि एक सीड हमेशा के लिए उसी अभ्यास को दर्शाए */
const random = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), seed | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export const makeExercise = (seed: number): Exercise => {
  const r = random(seed)
  const pick = <T>(xs: readonly T[]): T => xs[Math.floor(r() * xs.length)]
  const int = (lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1))

  // पिन और रोलर पर एक स्पैन, आधी बार ओवरहैंग के साथ: निर्धार्य, इसलिए हमेशा हल होने योग्य
  const L = pick([4, 5, 6]) // m
  const c = pick([0, 0, 1, 1.5, 2]) // m, ओवरहैंग की लंबाई
  const q = int(4, 12) // kN/m, स्पैन पर
  const F = int(2, 6) * 5 // kN, सिरे पर, या ओवरहैंग न हो तो A से `a` पर
  const a = int(1, L - 1) // m

  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  if (c > 0) {
    domain.createNode('C', [L + c, 0, 0])
    domain.createBeam2D(2, ['B', 'C'], 1, 1)
    lc.createNodalLoad('C', { [DofID.Dz]: F * 1e3 })
  } else {
    lc.createBeamConcentratedLoad(1, [0, F * 1e3, 0, a], true)
  }
  solver.solve()

  const statement =
    c > 0
      ? `Span L = ${L} m with an overhang c = ${c} m. q = ${q} kN/m on the span, F = ${F} kN at the tip C.`
      : `Span L = ${L} m. q = ${q} kN/m over the span, F = ${F} kN at ${a} m from A.`

  // हल किए गए मॉडल से उत्तर कुंजी: प्रतिक्रियाएँ (z नीचे की ओर है, इसलिए ऊपर ऋणात्मक), M के सटीक चरम मान
  const model = modelFromSolver(solver)
  const { reactions, members } = model.results!
  const up = (node: string) => -(reactions.find((x) => x.node === node && x.dof === 'dz')?.value ?? 0)
  const m = Object.values(members).flatMap((member) => extremes(member.M) ?? [])
  const mMax = Math.max(...m.map((e) => e.max.value))
  const mMin = Math.min(...m.map((e) => e.min.value))

  return { seed, statement, model, key: { RA: up('A'), RB: up('B'), mMax, mMin } }
}
```

`modelFromSolver` हल की गई संरचना को [प्लॉट मॉडल](/hi/plot/model) में पढ़ता है: साधारण डेटा, जिसमें प्रतिक्रियाएँ और हर सदस्य के परिणाम सटीक बहुपदों के रूप में होते हैं, इसलिए `extremes` बिना सैंपलिंग के सबसे बड़े आघूर्ण ढूँढ़ लेता है। अभ्यास केवल यही मॉडल रखता है; सॉल्वर की अब ज़रूरत नहीं रहती।

सीड 5 से प्रश्न बनता है *“Span L = 6 m with an overhang c = 1.5 m. q = 5 kN/m on the span, F = 25 kN at the tip C.”* उसकी उत्तर कुंजी: $R_A = (5 \cdot 6 \cdot 3 - 25 \cdot 1.5)/6 = 8.75$ kN, $R_B = 5 \cdot 6 + 25 - 8.75 = 46.25$ kN, सपोर्ट के ऊपर $M_B = -25 \cdot 1.5 = -37.5$ kNm, और स्पैन में, जहाँ अपरूपण बल शून्य है, $M = 8.75^2/(2 \cdot 5) = 7.66$ kNm। सॉल्वर अंतिम अंक तक यही देता है।

## वेब पेज पर {#the-exercise-in-a-page}

एक कंपोनेंट, `ExerciseCard.vue`, प्रश्न बनाता है, या `answers` के साथ उत्तर कुंजी:

```vue [ExerciseCard.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { formatQuantity, KN_UNITS, StructurePlot, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise'

const props = defineProps<{ seed: number; answers?: boolean }>()
const exercise = computed(() => makeExercise(props.seed))

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']
const twoDecimals = new Intl.NumberFormat('en', { maximumFractionDigits: 2 })
const kN = (si: number) => formatQuantity(si, KN_UNITS.force, twoDecimals)
const kNm = (si: number) => formatQuantity(si, KN_UNITS.moment, twoDecimals)
</script>

<template>
  <article>
    <h3>Exercise {{ seed }}</h3>
    <p>{{ exercise.statement }} Find the reactions and draw the bending moment diagram.</p>
    <StructurePlot
      :model="exercise.model"
      :layers="answers ? key : sheet"
      :reserve="[...sheet, ...key]"
      :reaction-labels="answers ? 'values' : 'names'"
      :reserve-reaction-labels="['names', 'values']"
    />
    <p v-if="answers">
      R<sub>A</sub> = {{ kN(exercise.key.RA) }}, R<sub>B</sub> = {{ kN(exercise.key.RB) }},
      M from {{ kNm(exercise.key.mMin) }} to {{ kNm(exercise.key.mMax) }}
    </p>
  </article>
</template>
```

```vue
<ExerciseCard :seed="5" />
<ExerciseCard :seed="5" answers />
```

दूसरा कार्ड *R<sub>A</sub> = 8.75 kN, R<sub>B</sub> = 46.25 kN, M from −37.5 kNm to 7.66 kNm* पर समाप्त होता है। `formatQuantity` इकाई और असली ऋण चिह्न लिखता है, जैसे प्लॉट लिखता है।

प्रश्न पत्रक पर `reaction-labels="names"` प्रतिक्रियाओं को अज्ञात राशियों के रूप में बनाता है: हर उस दिशा के लिए एक तीर जिसे सपोर्ट रोकता है, उस ओर जिसे धनात्मक माना जाता है (दाईं ओर, ऊपर की ओर, वामावर्त), और मान के बजाय नाम *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>*। इस तरह हर उत्तर का चिह्न ड्रॉइंग पर ही तय हो जाता है: जो प्रतिक्रिया उलटी दिशा में लगती है, वह ऋणात्मक है। उत्तर कुंजी मान लिखती है।

`reserve` दोनों रूपों की लेयरों का लेआउट शुरू से बना लेता है, इसलिए `answers` चालू करने पर, जैसे स्व-अध्ययन के लिए *हल दिखाएँ* बटन से, आरेख अपनी जगह पर उभरता है ([क्रम से बनते चित्र](/hi/plot/structure-plot#figures-that-build-up))। `reserve-reaction-labels` प्रतिक्रियाओं के लिए यही करता है, ताकि बीम अपनी जगह रहे और केवल प्रतिक्रियाओं के नाम मानों में बदलें: देखें [अज्ञात राशियों के रूप में प्रतिक्रियाएँ](/hi/plot/structure-plot#reactions-as-unknowns)।

## छपा हुआ प्रश्नपत्र {#print-a-test}

लिखित परीक्षा के लिए एक Node स्क्रिप्ट, `print-test.ts`, हर विद्यार्थी के लिए एक पेज लिखती है और उनके बाद उत्तर कुंजियाँ। `structureSvg` हर मॉडल को SVG पाठ में बदलता है, इसलिए इस स्क्रिप्ट को न Vue चाहिए न ब्राउज़र:

```ts [print-test.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const students = ['Ada', 'Ben', 'Cleo']
const exercises = students.map((_, i) => makeExercise(1000 + i)) // सीड 1000, 1001, …

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']
const task = 'Find the reactions and draw the bending moment diagram.'

const pages = [
  ...exercises.map((e, i) => `<h2>${students[i]}, exercise ${e.seed}</h2>
    <p>${e.statement} ${task}</p>${structureSvg(e.model, { layers: sheet, reactionLabels: 'names' })}`),
  ...exercises.map((e) => `<h2>Key, exercise ${e.seed}</h2>
    ${structureSvg(e.model, { layers: key })}`),
]

const style = `body { font: 15px/1.5 system-ui, sans-serif; max-width: 640px; margin: 2rem auto }
  section { break-after: page }`
writeFileSync('test.html', `<!doctype html><meta charset="utf-8"><title>Test</title>
  <style>${style}</style>${pages.map((page) => `<section>${page}</section>`).join('\n')}`)
```

```bash
node print-test.ts
```

`test.html` को ब्राउज़र में खोलें और छापें, या PDF के रूप में सहेजें: हर विद्यार्थी के अभ्यास और हर उत्तर कुंजी को अपना अलग पेज मिलता है। Ada का पेज और उसकी उत्तर कुंजी:

![अभ्यास 1000: 2 m ओवरहैंग के साथ 6 m का स्पैन, स्पैन पर 10 kN/m और सिरे पर 30 kN, अज्ञात प्रतिक्रियाएँ A_x, A_z और B_z नाम से, और 6 m और 2 m की क्रमवार विमा रेखाएँ, कुल 8 m; उसके नीचे उत्तर कुंजी, प्रतिक्रियाएँ 20 और 70, और बंकन आघूर्ण सपोर्ट के ऊपर −60 से स्पैन में 20 तक।](/screenshots/hi/p2p-plot-exercise-sheet.webp){.shot-lg}

`dimensions` लेयर हर स्पैन और कुल लंबाई देती है, जैसे अभ्यास पत्रक देता है, और `reactionLabels: 'names'` अज्ञात राशियों को नाम देता है, हर तीर उस ओर जिसमें उसका उत्तर धनात्मक माना जाता है। उत्तर कुंजी में प्रतिक्रियाएँ और आरेख के मान बिना इकाई की संख्याएँ हैं, kN और kNm में, जैसे EduBeam ऐप में: अगर आपके विद्यार्थियों को यह बताना ज़रूरी हो तो उत्तर कुंजी के शीर्षक में लिख दें। श्वेत-श्याम फ़ोटोकॉपी मशीन के लिए `colors` में हर tone काला दें: देखें [श्वेत-श्याम](/hi/plot/theming#black-and-white)।

## LaTeX और Word के लिए चित्र {#figures-for-latex-and-word}

अगर आपके प्रश्नपत्र LaTeX या Word में लिखे जाते हैं, तो चित्रों को फ़ाइलों के रूप में लिखें और अपना template वैसा ही रखें। `figures.ts` 30 सीडों के प्रश्न पत्रक और उत्तर कुंजी लिखती है:

```ts [figures.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']

for (let seed = 1000; seed < 1030; seed++) {
  const { model } = makeExercise(seed)
  writeFileSync(`exercise-${seed}.svg`, structureSvg(model, { layers: sheet, reactionLabels: 'names' }))
  writeFileSync(`exercise-${seed}-key.svg`, structureSvg(model, { layers: key }))
}
```

इसे `node figures.ts` से चलाएँ: 30 विद्यार्थियों के लिए 60 फ़ाइलें, हर एक तय रंगों वाली साधारण SVG, बिना CSS और बिना script के।

- **Word** (2019 और Microsoft 365) SVG को जैसा है वैसा ही डाल देता है: *Insert › Pictures*।
- **LaTeX** SVG के बजाय PDF लेता है। एक बार [CairoSVG](https://cairosvg.org) (`cairosvg exercise-1000.svg -o exercise-1000.pdf`) या Inkscape से बदलें, फिर `\includegraphics[width=\linewidth]{exercise-1000.pdf}`। अगर Inkscape इंस्टॉल है, तो `svg` package का `\includesvg` यह बदलाव आपके लिए कर देता है।

चित्र 640 इकाई चौड़ा है और उसका पाठ 13 इकाई का, इसलिए A4 के text column की चौड़ाई, लगभग 16 cm, पर उसके लेबल 9 pt के होते हैं। `fontFamily` को उस फ़ॉन्ट पर सेट करें जो आपका दस्तावेज़ उपयोग करता है: हर विकल्प के लिए देखें [स्वतंत्र SVG फ़ाइल](/hi/plot/functions#a-standalone-svg-file)।

## अपने हिसाब से बदलें {#make-it-your-own}

- **और प्रकार की संरचनाएँ।** नए प्रकार जोड़ें: कैंटिलीवर, दो-स्पैन सतत बीम, पोर्टल फ्रेम, ट्रस। ऊपर का live डेमो आठ प्रकारों में से चुनता है, सरल आलंबित बीम से लेकर त्रि-हिंज फ्रेम, Warren ट्रस और पोर्टल फ्रेम तक।
- **स्थैतिकतः अनिर्धार्य अभ्यास।** सॉल्वर इन्हें भी उतनी ही आसानी से हल करता है; बस हाथ से हल लंबा हो जाता है।
- **गोल संख्याएँ।** भार और लंबाइयाँ छोटी सूचियों से चुनें, जैसे ऊपर, ताकि उत्तर कुंजी उतनी ही गोल संख्याओं में आए जितनी आप चाहते हैं। कुछ सौ सीडों पर loop चलाएँ और उन्हें छोड़ दें जिनकी उत्तर कुंजी में आपकी इच्छा से अधिक दशमलव स्थान हों।
- **यंत्र (mechanism) से बचाव।** जो जनरेटर सपोर्ट ग़लत जगह रख सकता है, उसे `try` के अंदर हल करना चाहिए और जिन सीडों पर error आए, उन्हें छोड़ देना चाहिए: देखें [जब हल विफल हो](/hi/solver/solving#when-solving-fails)।
- **और प्रश्न पूछें।** अपरूपण बल (`'V'`), विक्षेप (`'w'`, [`getUnknowns`](/hi/solver/results#displacements) से मिले मानों के साथ) या किसी झुके सदस्य में अक्षीय बल भी बनवाएँ।
