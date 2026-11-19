---
title: परिणाम पढ़ना
description: "हल किए गए @edubeam/fem मॉडल से प्रतिक्रियाएँ, नोडल विस्थापन, सदस्य के किसी भी बिंदु पर आंतरिक बल, विरूपित आकार और सिरा-बल पढ़ें, और जानें कि हर कॉल क्या लौटाती है।"
order: 10
source: site
---

# परिणाम पढ़ना {#reading-results}

`solve()` के बाद परिणाम नोडों और सदस्यों से, किसी दिए गए लोड केस के लिए, पढ़े जाते हैं। इस पृष्ठ का हर उदाहरण एक ही मॉडल पढ़ता है: 6 m का सरल आलंबित बीम (simply supported beam), अपरूपण-दृढ़ IPE 200, जिस पर A से 2 m पर 20 kN है:

```ts [results.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 }) // अपरूपण-दृढ़

const A = domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
const B = domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
const lc = solver.loadCases[0]
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], true)
solver.solve()
```

::model-figure{caption="6 m स्पैन पर, A से 2 m पर 20 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M, w]
show: [nodeLabels]
---
::

## क्या कहाँ पढ़ें {#what-to-read-where}

| परिणाम | कॉल | क्या लौटाती है |
| --- | --- | --- |
| प्रतिक्रियाएँ | `node.getReactions(lc)` | `{ dofs, values }`: N, N·m |
| विस्थापन | `node.getUnknowns(lc, dofs)` | m, rad |
| किसी बिंदु पर N, V या M | `beam.computeBendingMomentAt(lc, x)` | एक संख्या: N, N·m |
| सदस्य के अनुदिश N, V या M | `beam.computeBendingMoment(lc, n)` | `{ x, M }`, n + 1 बिंदु |
| विरूपित आकार | `beam.computeLocalDefl(lc, n)` | `{ u, w }`, n + 1 बिंदु, m |
| सिरा-बल | `beam.computeEndForces(lc)` | 6 मानों का mathjs मैट्रिक्स |

N और V के लिए methods `computeNormalForceAt` और `computeShearForceAt`, तथा `computeNormalForce` और `computeShearForce` हैं, जो `{ x, N }` और `{ x, V }` लौटाते हैं। चिह्न [इकाइयाँ और चिह्न](/hi/solver/conventions#signs-of-the-results) पृष्ठ पर हैं।

## प्रतिक्रियाएँ {#reactions}

`getReactions` सपोर्ट की रोकी गई हर DOF के लिए एक प्रतिक्रिया देता है: `dofs` उनकी सूची है, उसी क्रम में जिसमें वे `createNode` को दी गई थीं, और `values` में प्रतिक्रियाएँ उसी क्रम में हैं। कई प्रतिक्रियाएँ हों तो `values` एक **mathjs मैट्रिक्स** है, और एक हो तो साधारण array, इसलिए एक छोटा helper उसे हर हाल में array बना देता है:

```ts
/** mathjs Matrix, array या संख्या को साधारण array बनाएँ। */
const list = (v: unknown): number[] =>
  typeof v === 'number'
    ? [v]
    : Array.isArray(v)
      ? v
      : (v as { toArray(): number[] }).toArray()

A.getReactions(lc).dofs // [0, 2]: DofID.Dx, DofID.Dz
list(A.getReactions(lc).values) // [0, -13333.3]
list(B.getReactions(lc).values) // [-6666.7]
```

क्रम की चिंता किए बिना कोई एक प्रतिक्रिया लेनी हो, तो उसकी DOF ढूँढ़ें: `list(values)[dofs.indexOf(DofID.Dz)]`, जैसा [सतत बीम वाला उदाहरण](/hi/solver/beams#a-continuous-beam) करता है।

प्रतिक्रिया वह बल है जो सपोर्ट संरचना पर लगाता है: z के अनुदिश −13,333 N का अर्थ है 13.3 kN ऊपर की ओर, $P\,b/L = 20 \cdot 4/6$। [घुमाए गए अक्षों](/hi/solver/nodes-supports#inclined-supports) वाले नोड पर प्रतिक्रियाएँ उन्हीं अक्षों में होती हैं; `getReactions(lc, true)` उन्हें वैश्विक अक्षों में बदलकर तीनों DOF लौटाता है, और जहाँ कुछ रोका नहीं गया वहाँ 0। बिना सपोर्ट वाला नोड `{ dofs: [], values: [] }` देता है।

## विस्थापन {#displacements}

`getUnknowns` नोड की कोई भी DOF पढ़ता है, सपोर्ट वाली हो या नहीं:

```ts
list(A.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])) // [0, 0, -0.0108924]
```

A दक्षिणावर्त 0.010892 rad घूमता है, $P\,b\,(L^2 - b^2)/6EIL$। केवल एक DOF माँगने पर `getUnknowns` साधारण संख्या लौटाता है, भले ही TypeScript मैट्रिक्स घोषित करता है: `list` इसे भी सँभाल लेता है।

## सदस्य के अनुदिश आंतरिक बल {#internal-forces-along-a-member}

`…At` methods सदस्य के पहले नोड से `x` मीटर पर मान देते हैं:

```ts
beam.computeShearForceAt(lc, 1) // 13333.3 N
beam.computeShearForceAt(lc, 2) // -6666.7 N: भार पर, उसके बाद वाला मान
beam.computeBendingMomentAt(lc, 2) // 26666.7 N·m: R_A · 2
```

जहाँ बिंदु भार उछाल (jump) पैदा करता है, वहाँ ठीक भार पर मान उसके आगे वाली ओर का होता है। पहले वाली ओर का मान पढ़ने के लिए उससे ज़रा पहले का मान माँगें, जैसे `x - 1e-9`।

array वाले methods सदस्य पर n + 1 समान दूरी वाले बिंदुओं पर मान लेते हैं, सिरों सहित:

```ts
beam.computeBendingMoment(lc, 3)
// { x: [0, 2, 4, 6], M: [0, 26666.7, 13333.3, 0] }, round-off त्रुटि छोड़कर
```

जहाँ सटीक मान 0 है, वहाँ `-3.6e-12` जैसी round-off त्रुटि की अपेक्षा रखें: छापने से पहले संख्याओं को `toFixed` से format करें। सदस्य के अनुदिश सबसे बड़ा मान पाने के लिए उसे घने बिंदुओं पर पढ़ें और उनमें सबसे बड़ा लें, जैसे `computeBendingMoment(lc, 500)`, जैसा [सतत बीम वाला उदाहरण](/hi/solver/beams#a-continuous-beam) करता है। वितरित भार होने पर M एक बहुपद है, इसलिए उसका सटीक चरम मान वहाँ है जहाँ V शून्य को पार करता है; [@edubeam/plot](/hi/plot/model#reading-values-yourself) इसे सटीक रूप से ढूँढ़ता है।

## विरूपित आकार {#deflected-shape}

```ts
beam.computeLocalDefl(lc, 3)
// { u: [0, 0, 0, 0], w: [0, 0.0174279, 0.0152494, 0] }
```

`computeLocalDefl` सदस्य के अनुदिश और उसके आर-पार विस्थापन, `u` और `w`, उसके स्थानीय अक्षों में देता है; `computeGlobalDefl` वही बिंदु वैश्विक x और z में। भार के नीचे विक्षेप, 17.43 mm, $P\,a^2 b^2/3EIL$ है। नोडों के बीच का आकार सटीक है, सिरों के मानों से interpolate किया हुआ नहीं। इसे चित्रित करने के लिए देखें [परिणामों का चित्रण](/hi/solver/drawing)।

## सिरा-बल {#end-forces}

```ts
beam.computeEndForces(lc).toArray()
// [0, -13333.3, 0, 0, -6666.7, 0]: X12, Z12, M12, X21, Z21, M21
```

वे बल जो दोनों नोड सदस्य पर लगाते हैं, उसके स्थानीय अक्षों में: ये ऐप की *अवयव परिणाम* तालिका की संख्याएँ हैं, जिन्हें [सिरा-बल](/hi/elements/conventions#end-forces-element-results-table) में समझाया गया है।

## हाथ से जाँचने लायक परिणाम {#results-as-numbers-to-check}

ऊपर का हर मान अपने मानक सूत्र (closed form) से मेल खाता है। [परिणामों की हाथ से जाँच](/hi/guide/verification) वाला पृष्ठ पाठ्यपुस्तक के ऐसे बहुत-से और उदाहरण दिखाता है, जिन्हें यही सॉल्वर आपके ब्राउज़र में हल करता है।
