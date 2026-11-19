---
title: बीम
description: "एक कैंटिलीवर और दो-स्पैन सतत बीम के लिए @edubeam/fem के पूरे प्रोग्राम, उनके आउटपुट के साथ, हर एक पाठ्यपुस्तक के सूत्र से जाँचा हुआ।"
order: 12
group: उदाहरण प्रोग्राम
source: site
---

# बीम {#beams}

कॉपी करके बदलने के लिए दो पूरे प्रोग्राम। दोनों अपरूपण-दृढ़ काट (`k: 1e32`) लेते हैं, इसलिए उनकी संख्याएँ ठीक Euler–Bernoulli सूत्रों वाली हैं। इन्हें `node cantilever.ts` (Node 22.18 या उसके बाद) से चलाएँ, ऐसे फ़ोल्डर में जो [इंस्टॉल करना](/hi/solver/getting-started#install) के अनुसार तैयार किया गया हो।

## कैंटिलीवर {#a-cantilever}

4 m लंबा, A पर फिक्स्ड, मुक्त सिरे पर 18 kN नीचे की ओर:

```ts [cantilever.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // फिक्स्ड
const tip = domain.createNode('B', [4, 0, 0]) // मुक्त
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
lc.createNodalLoad('B', { [DofID.Dz]: 18e3 }) // मुक्त सिरे पर 18 kN नीचे की ओर
solver.solve()

console.log(beam.computeBendingMomentAt(lc, 0)) // फिक्स्ड सिरे पर, N·m
console.log(tip.getUnknowns(lc, [DofID.Dz])) // मुक्त सिरे का विक्षेप, m
```

```text [Output]
-72000
0.09411072715241528
```

$M_A = -FL = -72$ kNm, होगिंग (ऊपरी तंतुओं में तनाव), और मुक्त सिरे का विक्षेप $FL^3/3EI = 94.11$ mm है, जहाँ $EI = 4.0803$ MNm²। यही कैंटिलीवर EduBeam ऐप के उदाहरणों में भी है।

## सतत बीम {#a-continuous-beam}

तीन सपोर्टों पर 5 m के दो स्पैन, दोनों पर 10 kN/m। प्रतिक्रियाएँ, बीच वाले सपोर्ट के ऊपर आघूर्ण और स्पैन का सबसे बड़ा आघूर्ण:

```ts [continuous.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [5, 0, 0], [DofID.Dz])
domain.createNode('C', [10, 0, 0], [DofID.Dz])
const span1 = domain.createBeam2D(1, ['A', 'B'], 1, 1)
domain.createBeam2D(2, ['B', 'C'], 1, 1)

const lc = solver.loadCases[0]
for (const span of [1, 2]) {
  lc.createBeamElementUniformEdgeLoad(span, [0, 10e3], true)
}
solver.solve()

// getReactions mathjs Matrix या array देता है: उसे array बना लें
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

for (const label of ['A', 'B', 'C']) {
  const { dofs, values } = domain.getNode(label).getReactions(lc)
  const rz = list(values)[dofs.indexOf(DofID.Dz)]
  console.log(`R${label} = ${(-rz / 1e3).toFixed(2)} kN up`)
}
const mB = span1.computeBendingMomentAt(lc, 5)
console.log(`MB = ${(mB / 1e3).toFixed(2)} kNm`)

// स्पैन 1 में सबसे बड़ा सैगिंग आघूर्ण, उसके अनुदिश 501 बिंदुओं से
const { x, M } = span1.computeBendingMoment(lc, 500)
const i = M.indexOf(Math.max(...M))
console.log(`max M = ${(M[i] / 1e3).toFixed(2)} kNm at x = ${x[i]} m`)
```

```text [Output]
RA = 18.75 kN up
RB = 62.50 kN up
RC = 18.75 kN up
MB = -31.25 kNm
max M = 17.58 kNm at x = 1.87 m
```

दो बराबर स्पैनों के पाठ्यपुस्तक वाले मान: $R_A = R_C = 0.375\,qL$, $R_B = 1.25\,qL$, $M_B = -qL^2/8$, और स्पैन का सबसे बड़ा आघूर्ण $R_A^2/2q = 17.58$ kNm, $x = R_A/q = 1.875$ m पर। 501 बिंदुओं वाली गणना इसे ग्रिड बिंदु 1.87 m पर पाती है, वास्तविक मान से 0.0002 kNm के भीतर।

::model-figure{caption="10 kN/m भार वाले 5 m के दो स्पैन"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels]
---
::

चित्र IPE 200 के बजाय ऐप के उदाहरण वाला काट लेता है। पूरे बीम में एक ही काट हो, तो सतत बीम के आंतरिक बल उसकी कठोरता पर निर्भर नहीं करते, इसलिए आरेखों पर वही संख्याएँ आती हैं; केवल विक्षेप अलग होता है।

## इसे बदलें {#change-it}

- **असमान स्पैन या भार:** C के निर्देशांक या भारों की सूची बदलें। केवल एक स्पैन पर भार देने से जानी-पहचानी पैटर्न लोडिंग (pattern loading) बनती है।
- **तीन स्पैन:** एक नोड D और एक सदस्य `['C', 'D']` जोड़ें।
- **फिक्स्ड सिरा:** A को `[DofID.Dx, DofID.Dz, DofID.Ry]` दें।
- **वास्तविक अपरूपण विरूपण:** आयताकार काट के लिए `k: 5 / 6`, या अपने काट का अपरूपण संशोधन गुणांक।
- **इसका चित्र:** सॉल्वर [@edubeam/plot](/hi/solver/drawing) को सौंप दें।

[सतत बीम ट्यूटोरियल](/hi/tutorials/continuous-beam) EduBeam ऐप में ऐसा ही बीम बनाता है, और [परिणामों की हाथ से जाँच](/hi/guide/verification) वाले पृष्ठ पर पाठ्यपुस्तक के और उदाहरण उनके सूत्रों के साथ हैं।
