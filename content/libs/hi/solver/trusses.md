---
title: ट्रस
description: "@edubeam/fem में पिन जोड़ों वाला Warren ट्रस, खंड विधि से जाँचा गया हर छड़ बल, और एक लूप जो कितने भी पैनलों वाले ट्रस बनाता है।"
order: 14
source: site
---

# ट्रस {#trusses}

ट्रस ऐसी छड़ों से बनता है जिनके दोनों सिरों पर हिंज होते हैं और जिन पर भार केवल संधियों पर लगता है, इसलिए हर छड़ केवल अक्षीय बल वहन करती है। यह उदाहरण दो सूचियों से एक Warren ट्रस बनाता है, हर छड़ का बल हाथ से जाँचता है, और फिर एक लूप में किसी भी आकार के ट्रस बनाता है।

::model-figure{caption="Warren ट्रस: 9 m स्पैन, 1.8 m ऊँचाई, हर ऊपरी संधि पर 8 kN"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members:
  - { nodes: [A, B], hinges: [true, true] }
  - { nodes: [B, C], hinges: [true, true] }
  - { nodes: [C, D], hinges: [true, true] }
  - { nodes: [E, F], hinges: [true, true] }
  - { nodes: [F, G], hinges: [true, true] }
  - { nodes: [A, E], hinges: [true, true] }
  - { nodes: [E, B], hinges: [true, true] }
  - { nodes: [B, F], hinges: [true, true] }
  - { nodes: [F, C], hinges: [true, true] }
  - { nodes: [C, G], hinges: [true, true] }
  - { nodes: [G, D], hinges: [true, true] }
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: [N, w]
show: [nodeLabels]
---
::

```ts [truss.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })

// Warren ट्रस: 9 m स्पैन, 1.8 m ऊँचाई, निचली कॉर्ड A-B-C-D, ऊपरी कॉर्ड E-F-G
const nodes: [string, number, number, DofID[]][] = [
  ['A', 0, 0, [DofID.Dx, DofID.Dz]],
  ['B', 3, 0, []],
  ['C', 6, 0, []],
  ['D', 9, 0, [DofID.Dz]],
  ['E', 1.5, -1.8, []],
  ['F', 4.5, -1.8, []],
  ['G', 7.5, -1.8, []],
]
for (const [label, x, z, support] of nodes) {
  domain.createNode(label, [x, 0, z], support)
}

// हर लेबल अपने दोनों नोडों के नाम बताता है। दोनों सिरों पर हिंज: केवल अक्षीय बल।
const bars = ['AB', 'BC', 'CD', 'EF', 'FG', 'AE', 'EB', 'BF', 'FC', 'CG', 'GD']
const members = bars.map((bar) =>
  domain.createBeam2D(bar, [bar[0], bar[1]], 1, 1, [true, true])
)

const lc = solver.loadCases[0]
for (const top of ['E', 'F', 'G']) {
  lc.createNodalLoad(top, { [DofID.Dz]: 8e3 }) // 8 kN नीचे की ओर
}
solver.solve()

for (const bar of members) {
  const n = bar.computeNormalForceAt(lc, 0) / 1e3
  console.log(bar.label, n.toFixed(2), n > 0 ? 'tension' : 'compression')
}
```

```text [Output]
AB 10.00 tension
BC 16.67 tension
CD 10.00 tension
EF -13.33 compression
FG -13.33 compression
AE -15.62 compression
EB 5.21 tension
BF -5.21 compression
FC -5.21 compression
CG 5.21 tension
GD -15.62 compression
```

छड़ का अक्षीय बल पूरी लंबाई में स्थिर रहता है, इसलिए उसे `x = 0` पर पढ़ना काफ़ी है। दो अक्षरों वाले लेबल नोडों के जोड़े भी बताते हैं: `bar[0]` और `bar[1]`। आउटपुट में `tension` तनाव है और `compression` संपीड़न।

## हाथ से जाँच {#check-it-by-hand}

हर सपोर्ट 24 kN का आधा, यानी 12 kN, लेता है। ट्रस को काटें और कटी छड़ के सामने वाली संधि के परितः आघूर्ण लें, जैसा [खंड विधि](/hi/tutorials/truss) (method of sections) में होता है:

| छड़ | खंड | बल |
| --- | --- | --- |
| BC, निचली कॉर्ड | F के परितः आघूर्ण: $(12 \cdot 4.5 - 8 \cdot 3)/1.8$ | 16.67 kN तनाव |
| EF, ऊपरी कॉर्ड | B के परितः आघूर्ण: $(12 \cdot 3 - 8 \cdot 1.5)/1.8$ | 13.33 kN संपीड़न |
| AE, सिरे का विकर्ण | संधि A: $12 \cdot \sqrt{1.5^2 + 1.8^2}/1.8$ | 15.62 kN संपीड़न |
| EB, विकर्ण | पैनल में अपरूपण बल, $12 - 8 = 4$ kN: $4 \cdot 2.343/1.8$ | 5.21 kN तनाव |

स्थैतिकतः निर्धार्य ट्रस के छड़ बल अनुप्रस्थ काट पर निर्भर नहीं करते; काट केवल यह तय करता है कि संधियाँ कितनी खिसकती हैं। ऊपर का चित्र दूसरा काट, EduBeam ऐप वाला, लेता है और वही बल देता है।

## कितने भी पैनल {#any-number-of-panels}

अभ्यासों या पैरामीटर अध्ययन के लिए ट्रस बनाने हों, तो संधियाँ और छड़ें एक लूप में, पैनल-दर-पैनल बनाएँ। `panels = 3` के साथ यह ऊपर वाला ट्रस है और वही बल छापता है; दूसरे ट्रस के लिए `panels`, `w` और `h` बदलें।

```ts [warren.ts]
import { type Beam2D, DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })
const lc = solver.loadCases[0]

const panels = 3 // निचली कॉर्ड के पैनल
const w = 3 // पैनल की लंबाई, m
const h = 1.8 // ऊँचाई, m

// निचली संधियाँ b0, b1, … पिन और रोलर पर; ऊपरी संधियाँ t0, t1, … उनके बीच
for (let i = 0; i <= panels; i++) {
  const ends = i === 0 ? [DofID.Dx, DofID.Dz] : i === panels ? [DofID.Dz] : []
  domain.createNode(`b${i}`, [i * w, 0, 0], ends)
}
for (let i = 0; i < panels; i++) {
  domain.createNode(`t${i}`, [(i + 0.5) * w, 0, -h])
  lc.createNodalLoad(`t${i}`, { [DofID.Dz]: 8e3 })
}

const members: Beam2D[] = []
const bar = (a: string, b: string) =>
  members.push(domain.createBeam2D(`${a}-${b}`, [a, b], 1, 1, [true, true]))
for (let i = 0; i < panels; i++) {
  bar(`b${i}`, `b${i + 1}`) // निचली कॉर्ड
  bar(`b${i}`, `t${i}`) // ऊपर जाता विकर्ण
  bar(`t${i}`, `b${i + 1}`) // नीचे जाता विकर्ण
  if (i > 0) bar(`t${i - 1}`, `t${i}`) // ऊपरी कॉर्ड
}
solver.solve()

for (const m of members) {
  console.log(m.label, (m.computeNormalForceAt(lc, 0) / 1e3).toFixed(2))
}
```

आकार के साथ सॉल्वर का समय तेज़ी से बढ़ता है: कुछ दर्जन पैनल ठीक हैं, देखें [मॉडल का आकार](/hi/solver/solving#model-size)। बनाए गए हर ट्रस को चित्रित करने के लिए, उत्तरों के साथ या बिना, @edubeam/plot का [अभ्यास और प्रश्नपत्र](/hi/plot/exercises) पृष्ठ देखें।

## ध्यान देने लायक बातें {#things-to-notice}

- **हर छड़ के हर सिरे पर हिंज।** तब हर संधि घूमने के लिए मुक्त है, और सॉल्वर उसका घूर्णन 0 बताता है। ऐसी संधि पर लगाए गए आघूर्ण को वहन करने वाला कोई नहीं होता और [हल विफल हो जाता है](/hi/solver/solving#when-solving-fails)।
- **भार संधियों पर।** दो संधियों के बीच छड़ पर लगा भार उसे मोड़ देगा: तब वह ट्रस छड़ नहीं, बीम है, और उसका बंकन आघूर्ण आरेख बनता है।

[समतल ट्रस ट्यूटोरियल](/hi/tutorials/truss) EduBeam ऐप में ट्रस बनाता है, और [ट्रस अवयव](/hi/elements/truss) पृष्ठ छड़ की कठोरता व्युत्पन्न करता है।
