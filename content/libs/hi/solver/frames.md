---
title: फ्रेम
description: "त्रि-हिंज फ्रेम के लिए @edubeam/fem का पूरा प्रोग्राम, स्तंभों, दृढ़ कोनों और शिखर हिंज के साथ, और उसके परिणामों की हाथ से जाँच।"
order: 13
source: site
---

# फ्रेम {#frames}

फ्रेम बीम और स्तंभों से बनता है, जो अपने कोनों पर दृढ़ता से जुड़े होते हैं। यह उदाहरण [त्रि-हिंज फ्रेम ट्यूटोरियल](/hi/tutorials/three-hinged-frame) वाला फ्रेम कोड में बनाता है: 4 m के दो स्तंभ, A और E पर पिन सपोर्ट, C पर शिखर हिंज (crown hinge) वाला 8 m का बीम, और बीम पर 10 kN/m। ट्यूटोरियल नोडों को 1 से 5 तक क्रमांक देता है; यहाँ वे A से E हैं।

::model-figure{caption="नीचे वाले प्रोग्राम का फ्रेम: A और E पर पिन, C पर हिंज, 10 kN/m"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, k: 1e32 }) // IPE 300

// z नीचे की ओर है: 4 m ऊँचे स्तंभों के शीर्ष z = -4 पर हैं
const pin = [DofID.Dx, DofID.Dz]
domain.createNode('A', [0, 0, 0], pin)
domain.createNode('B', [0, 0, -4])
domain.createNode('C', [4, 0, -4]) // शिखर हिंज
domain.createNode('D', [8, 0, -4])
domain.createNode('E', [8, 0, 0], pin)

const column = domain.createBeam2D(1, ['A', 'B'], 1, 1) // नीचे से ऊपर
const left = domain.createBeam2D(2, ['B', 'C'], 1, 1, [false, true]) // C पर हिंज
domain.createBeam2D(3, ['C', 'D'], 1, 1)
domain.createBeam2D(4, ['D', 'E'], 1, 1)

const lc = solver.loadCases[0]
for (const half of [2, 3]) {
  lc.createBeamElementUniformEdgeLoad(half, [0, 10e3], false)
}
solver.solve()

// getReactions mathjs Matrix या array देता है: उसे array बना लें
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()
const kN = (v: number) => (v / 1e3).toFixed(2)

for (const label of ['A', 'E']) {
  const [rx, rz] = list(domain.getNode(label).getReactions(lc).values)
  console.log(`${label}: Rx = ${kN(rx)} kN, Rz = ${kN(rz)} kN`)
}
for (const x of [0, 2, 4]) {
  const m = left.computeBendingMomentAt(lc, x)
  console.log(`M at ${x} m from B = ${kN(m)} kNm`)
}
const top = column.computeBendingMomentAt(lc, 4)
console.log(`M at the top of column 1 = ${kN(top)} kNm`)
```

```text [Output]
A: Rx = 20.00 kN, Rz = -40.00 kN
E: Rx = -20.00 kN, Rz = -40.00 kN
M at 0 m from B = -80.00 kNm
M at 2 m from B = -20.00 kNm
M at 4 m from B = 0.00 kNm
M at the top of column 1 = -80.00 kNm
```

## हाथ से जाँच {#check-it-by-hand}

| राशि | हाथ से | सॉल्वर |
| --- | --- | --- |
| ऊर्ध्वाधर प्रतिक्रियाएँ | $q \cdot 8/2 = 40$ kN ऊपर | A और E पर $R_z = -40$ kN |
| क्षैतिज प्रतिक्रियाएँ | बाएँ आधे भाग पर $M_C = 0$ से: $(40 \cdot 4 - 10 \cdot 4 \cdot 2)/4 = 20$ kN, अंदर की ओर | A पर $R_x = +20$ kN, E पर $-20$ kN |
| कोने का आघूर्ण | $-20 \cdot 4 = -80$ kNm | बीम में और स्तंभ में $-80$ kNm |
| B से 2 m पर आघूर्ण | $-80 + 40 \cdot 2 - 10 \cdot 2^2/2 = -20$ kNm | $-20$ kNm |
| हिंज पर आघूर्ण | 0 | 0 |

## ध्यान देने लायक बातें {#things-to-notice}

- **स्तंभ ऊपर जाते हैं, इसलिए z ऋणात्मक है।** स्तंभों के शीर्ष $z = -4$ पर हैं।
- **स्तंभ के स्थानीय अक्ष।** सदस्य 1, A से ऊपर B तक जाता है, इसलिए उसका स्थानीय z दाईं ओर, फ्रेम के अंदर की ओर है। शीर्ष पर उसका आघूर्ण −80 kNm है, कोने पर बीम के आघूर्ण जैसा: बाहरी ओर तनाव। स्तंभ को B से नीचे A तक परिभाषित करें, तो उसका स्थानीय z बाईं ओर होता है: उसके आघूर्ण का चिह्न बदल जाता है, और `x` शीर्ष से गिना जाता है। देखें [सदस्य की दिशा](/hi/solver/conventions#member-direction)।
- **एक हिंज, एक सदस्य का सिरा।** हिंज C पर सदस्य 2 के सिरे पर है; सदस्य 3, C पर दृढ़ता से शुरू होता है। C को हिंज बनाने के लिए एक सिरे पर आघूर्ण मुक्त करना काफ़ी है।
- **बीम पर वैश्विक भार।** `false` भार को वैश्विक अक्षों में देता है: सदस्य का ढलान कुछ भी हो, भार ऊर्ध्वाधर रहता है। बाएँ से दाएँ बने क्षैतिज बीम पर यह स्थानीय के समान ही है।

## स्थैतिकतः अनिर्धार्य फ्रेम {#statically-indeterminate-frames}

हिंज हटा दें, `[false, false]`, तो फ्रेम एक कोटि से अनिर्धार्य पोर्टल फ्रेम बन जाता है: उसकी एक प्रतिक्रिया अतिरिक्त अज्ञात (redundant) है। तब उसके बल इस पर निर्भर करते हैं कि बीम स्तंभों की तुलना में कितना कठोर है: इसे देखने के लिए सदस्यों को अलग-अलग अनुप्रस्थ काट दें। ट्यूटोरियल का खंड [प्रयोग करें](/hi/tutorials/three-hinged-frame#_7-experiment) स्तंभों के निचले सिरे फिक्स्ड करता है और फ्रेम को बगल से धकेलता है, और जाँचने के लिए संख्याएँ भी देता है। @edubeam/plot का [स्लाइड और नोट्स](/hi/plot/slides) पृष्ठ ऐसा पोर्टल फ्रेम चरण-दर-चरण चित्रित करता है।
