---
title: स्क्रिप्ट और सर्वर
description: "Node से @edubeam/fem का उपयोग: उत्तर कुंजी के साथ अभ्यास पत्रक, CSV में लिखी प्रभाव रेखा, और एक छोटा HTTP endpoint जो माँगने पर बीम हल करता है।"
order: 15
source: site
---

# स्क्रिप्ट और सर्वर {#scripts-and-servers}

सॉल्वर को ब्राउज़र की ज़रूरत नहीं है। Node में यह उत्तर कुंजियाँ लिखता है, पैरामीटर अध्ययन चलाता है, स्प्रेडशीट के लिए तालिकाएँ बनाता है, या किसी वेब पेज के अनुरोधों का जवाब देता है।

उदाहरण TypeScript में हैं। Node 22.18 या उसके बाद के संस्करण `.ts` फ़ाइलें सीधे चलाते हैं (`node answers.ts`), ऐसे फ़ोल्डर में जो [इंस्टॉल करना](/hi/solver/getting-started#install) के अनुसार तैयार किया गया हो; पुराने Node के साथ type annotations हटाकर फ़ाइलों को `.mjs` नाम से सहेजें।

## उत्तर कुंजी के साथ अभ्यास पत्रक {#answer-key}

एक ही अभ्यास के बीस रूप: रेखीय भार और बिंदु भार वाला सरल आलंबित बीम (simply supported beam), हर एक अपनी प्रतिक्रियाओं और सबसे बड़े आघूर्ण के साथ, CSV फ़ाइल में लिखा हुआ। संख्याएँ अभ्यास के क्रमांक से आती हैं, इसलिए यही स्क्रिप्ट हमेशा वही पत्रक लिखती है:

```ts [answers.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** अभ्यास i: q kN/m और A से a m पर F kN वाला सरल आलंबित बीम। */
const exercise = (i: number) => {
  const L = 4 + (i % 4) // 4 से 7 m
  const q = 5 + 5 * (i % 3) // 5, 10 या 15 kN/m
  const F = 10 + 10 * (i % 2) // 10 या 20 kN
  const a = L / 4 + (i % 3) // स्पैन में कहीं
  return { L, q, F, a }
}

const solve = ({ L, q, F, a }: ReturnType<typeof exercise>) => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  lc.createBeamConcentratedLoad(1, [0, F * 1e3, 0, a], true)
  solver.solve()

  // प्रतिक्रियाएँ सिरों के अपरूपण बल हैं: A पर V(0), B पर -V(L)
  const rA = beam.computeShearForceAt(lc, 0) / 1e3
  const rB = -beam.computeShearForceAt(lc, L) / 1e3
  // सबसे बड़ा आघूर्ण, 1 cm की दूरी वाले बिंदुओं से
  const { x, M } = beam.computeBendingMoment(lc, L * 100)
  const top = M.indexOf(Math.max(...M))
  return [rA, rB, M[top] / 1e3, x[top]].map((v) => v.toFixed(2))
}

const rows = ['no,L_m,q_kN_m,F_kN,a_m,RA_kN,RB_kN,Mmax_kNm,at_m']
for (let i = 1; i <= 20; i++) {
  const ex = exercise(i)
  rows.push([i, ex.L, ex.q, ex.F, ex.a, ...solve(ex)].join(','))
}
writeFileSync('answers.csv', rows.join('\n') + '\n')
```

```text [answers.csv]
no,L_m,q_kN_m,F_kN,a_m,RA_kN,RB_kN,Mmax_kNm,at_m
1,5,10,20,2.25,36.00,34.00,55.69,2.25
2,6,15,10,3.5,49.17,50.83,80.58,3.28
3,7,5,20,1.75,32.50,22.50,50.63,2.50
...
```

पहले को हाथ से जाँचें: $R_B = (10 \cdot 5 \cdot 2.5 + 20 \cdot 2.25)/5 = 34$ kN, $R_A = 70 - 34 = 36$ kN, और अपरूपण बल बिंदु भार के नीचे चिह्न बदलता है, इसलिए सबसे बड़ा आघूर्ण वहीं है: $36 \cdot 2.25 - 10 \cdot 2.25^2/2 = 55.69$ kNm।

दो फ़ैसले स्क्रिप्ट को छोटा रखते हैं। सरल आलंबित बीम पर प्रतिक्रियाएँ सिरों के अपरूपण बल ही हैं, इसलिए [प्रतिक्रियाओं वाले helper](/hi/solver/results#reactions) की ज़रूरत नहीं पड़ती। और सबसे बड़ा आघूर्ण 1 cm की दूरी वाले बिंदुओं से आता है, जो यहाँ सटीक है क्योंकि चरम मान किसी भार पर या ग्रिड से एक सेंटीमीटर के भीतर पड़ता है। हर अभ्यास को चित्रित करने के लिए, उत्तरों के साथ या बिना, @edubeam/plot का [अभ्यास और प्रश्नपत्र](/hi/plot/exercises) पृष्ठ देखें, जो पूरा प्रश्नपत्र भी छापता है।

## CSV के रूप में प्रभाव रेखा {#an-influence-line-as-csv}

1 kN का भार दो-स्पैन सतत बीम पर से गुज़रता है, तो बीच वाले सपोर्ट के ऊपर का आघूर्ण कैसे बदलता है? हर भार-स्थिति के लिए बीम को एक बार बनाकर हल करें, और हर स्थिति के लिए एक पंक्ति लिखें। यही प्रभाव रेखा (influence line) है:

```ts [influence.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** 5 m के दो स्पैन, A से `at` m पर 1 kN: बीच वाले सपोर्ट के ऊपर का आघूर्ण */
const momentAtB = (at: number): number => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [5, 0, 0], [DofID.Dz])
  domain.createNode('C', [10, 0, 0], [DofID.Dz])
  const span1 = domain.createBeam2D(1, ['A', 'B'], 1, 1)
  domain.createBeam2D(2, ['B', 'C'], 1, 1)
  const [member, x] = at <= 5 ? [1, at] : [2, at - 5]
  solver.loadCases[0].createBeamConcentratedLoad(member, [0, 1e3, 0, x], true)
  solver.solve()
  return span1.computeBendingMomentAt(solver.loadCases[0], 5)
}

const rows = ['x_m,MB_kNm_per_kN']
for (let at = 0; at <= 10; at += 0.5) {
  rows.push(`${at},${(momentAtB(at) / 1e3).toFixed(4)}`)
}
writeFileSync('influence.csv', rows.join('\n') + '\n')
```

```bash
node influence.ts
```

```text [influence.csv]
x_m,MB_kNm_per_kN
0,0.0000
0.5,-0.1237
1,-0.2400
1.5,-0.3412
2,-0.4200
2.5,-0.4688
3,-0.4800
...
```

दो बराबर स्पैनों के लिए मानक सूत्र (closed form) $M_B = -P\,a\,(L^2 - a^2)/4L^2$ है: $a = 2.5$ m पर $-0.46875$ kNm, और सबसे प्रतिकूल स्थिति $a = L/\sqrt{3} = 2.887$ m। रेखा सममित है, इसलिए 21 पंक्तियाँ वहीं खत्म होती हैं जहाँ से शुरू हुई थीं: सपोर्ट C के ऊपर 0 पर।

हर स्थिति के लिए नया सॉल्वर बनाना एक ही सॉल्वर को बदलते रहने से सरल है, और इसमें कुछ मिलीसेकंड लगते हैं। इसके बजाय हल किया हुआ मॉडल बदलना हो, तो देखें [बदलाव के बाद दोबारा हल करना](/hi/solver/solving#solving-again-after-a-change)।

## HTTP endpoint के पीछे सॉल्वर {#a-solver-behind-an-http-endpoint}

Node के अपने `http` module भर से बना एक छोटा सर्वर, जो उसे भेजे गए किसी भी स्पैन और भार के लिए सरल आलंबित बीम हल करता है:

```ts [server.ts]
import { createServer } from 'node:http'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** सरल आलंबित IPE 200, `span` m, `q` kN/m: मध्य-स्पैन पर M और विक्षेप */
const solveBeam = (span: number, q: number) => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [span, 0, 0], [DofID.Dz])
  const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  solver.solve()
  return {
    momentKNm: beam.computeBendingMomentAt(lc, span / 2) / 1e3,
    deflectionMm: beam.computeLocalDefl(lc, 2).w[1] * 1e3,
  }
}

createServer(async (req, res) => {
  try {
    let body = ''
    for await (const chunk of req) body += chunk
    const { span, q } = JSON.parse(body) as { span?: unknown; q?: unknown }
    if (typeof span !== 'number' || !(span > 0) || typeof q !== 'number') {
      throw new Error('Bad input')
    }
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify(solveBeam(span, q)) + '\n')
  } catch {
    // ग़लत JSON, ग़लत संख्याएँ या हल न होने वाला मॉडल: सर्वर चलता रहे
    res.writeHead(400).end('Send {"span": metres, "q": kN/m}\n')
  }
}).listen(3000)
```

```bash
node server.ts &
curl -s localhost:3000 -d '{"span": 6, "q": 12}'
# {"momentKNm":54,"deflectionMm":49.62870377178149}
```

$qL^2/8 = 54$ kNm और $5qL^4/384EI = 49.63$ mm। `try` ज़रूरी है: अमान्य JSON पर त्रुटि आती है, और ऐसे मॉडल पर भी आ सकती है जिसे सॉल्वर हल नहीं कर सकता, पर इनमें से किसी से भी सर्वर बंद नहीं होना चाहिए। सार्वजनिक सेवा अनुरोध के आकार और स्पैन की सीमा भी तय करेगी।

## ब्राउज़र में {#in-the-browser}

यही कोड किसी पेज में बिना बदले चलता है और पाठक के डिवाइस पर हल करता है: इस साइट का हर लाइव चित्र ऐसे ही काम करता है। पैकेज को अपने bundler से import करें, जैसे Vite या Nuxt, और परिणामों को @edubeam/plot से [चित्रित करें](/hi/solver/drawing)। मॉडल मिलीसेकंडों में हल हो जाता है, इसलिए पेज हर input event पर दोबारा हल कर सकता है।
