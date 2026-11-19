---
title: सदस्य और हिंज
description: "नोडों को Beam2D सदस्यों से जोड़ें, सिरे के हिंज से आघूर्ण मुक्त करें, ट्रस छड़ें मॉडल करें, और @edubeam/fem से अवयव की कठोरता और रूपांतरण मैट्रिक्स पाएँ।"
order: 5
source: site
---

# सदस्य और हिंज {#members-and-hinges}

हर सदस्य एक `Beam2D` है: x–z समतल में दो नोडों वाला सीधा Timoshenko बीम, जो अक्षीय बल, अपरूपण बल (shear force) और बंकन आघूर्ण (bending moment) वहन करता है। उसके सिरों पर हिंज वहाँ आघूर्ण मुक्त कर देते हैं। कोड-अंश [शुरुआत](/hi/solver/getting-started) जैसे किसी प्रोग्राम के `solver`, `domain` और `lc` का, और उसकी सामग्री `'steel'` और काट `'IPE200'` का उपयोग करते हैं।

## सदस्य बनाना {#create-a-member}

```ts
domain.createBeam2D(label, [startNode, endNode], material, crossSection, hinges)
```

| Argument | प्रकार | अर्थ |
| --- | --- | --- |
| `label` | `string \| number` | सदस्य का नाम, स्ट्रिंग के रूप में संग्रहीत |
| `nodes` | `[label, label]` | पहला और दूसरा नोड। स्थानीय x पहले से दूसरे की ओर जाता है: देखें [सदस्य की दिशा](/hi/solver/conventions#member-direction)। |
| `mat`, `cs` | `string \| number` | किसी सामग्री और किसी अनुप्रस्थ काट के लेबल |
| `hinges` | `[boolean, boolean]` | पहले नोड पर हिंज, दूसरे पर हिंज। वैकल्पिक; डिफ़ॉल्ट `[false, false]`, यानी दृढ़ सिरे। |

यह `Beam2D` लौटाता है: परिणाम पढ़ने के लिए इसे रख लें। `domain.getElement(label)` उसे फिर से ढूँढ़ देता है, पर सामान्य `Element` type के रूप में, इसलिए परिणाम पढ़ने से पहले TypeScript को `as Beam2D` चाहिए।

बिना हिंज के किसी नोड पर मिलने वाले सदस्य दृढ़ता से जुड़े होते हैं: वे साथ-साथ घूमते हैं। नोड, सामग्री और काट किसी भी क्रम में बनाए जा सकते हैं, बशर्ते हल करते समय सब मौजूद हों; कोई गायब हो, तो `solve()` उसका नाम बताते हुए `RangeError` फेंकता है।

## सिरे के हिंज {#end-hinges}

हिंज सदस्य के सिरे का होता है, नोड का नहीं। यहाँ सदस्य 2, C पर हिंज से शुरू होता है, इसलिए C स्पैन C–D से कैंटिलीवर A–C तक अपरूपण बल पहुँचाता है, पर आघूर्ण नहीं:

```ts [hinge.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry])
domain.createNode('C', [2, 0, 0])
domain.createNode('D', [6, 0, 0], [DofID.Dz])
const ac = domain.createBeam2D(1, ['A', 'C'], 'steel', 'IPE200')
const cd = domain.createBeam2D(2, ['C', 'D'], 'steel', 'IPE200', [true, false])

lc.createBeamElementUniformEdgeLoad(2, [0, 10e3], true)
solver.solve()

cd.computeBendingMomentAt(lc, 0) // हिंज पर 0
cd.computeBendingMomentAt(lc, 2) // 20000 N·m: 4 m स्पैन का qL²/8
ac.computeBendingMomentAt(lc, 0) // -40000 N·m: C–D से आया 20 kN, 2 m दूर
```

::model-figure{caption="हिंज से जुड़े स्पैन को सहारा देता कैंटिलीवर: C पर कोई आघूर्ण नहीं।"}
---
nodes: { A: [0, 0], C: [2, 0], D: [6, 0] }
supports: { A: fixed, D: roller }
members: [[A, C], { nodes: [C, D], hinges: [true, false] }]
loads:
  - { member: 2, qz: 10 }
results: [M, V]
show: [nodeLabels]
---
::

जहाँ कई सदस्य किसी हिंज वाली संधि पर मिलते हैं, वहाँ एक को छोड़कर बाकी सभी सदस्यों के सिरों पर हिंज काफ़ी है। हर सिरे पर हिंज भी चलता है: तब संधि को कुछ भी नहीं घुमाता, और सॉल्वर उसका घूर्णन 0 बताता है। पर ऐसी संधि पर लगाए गए आघूर्ण को वहन करने वाला कोई नहीं होता, और [हल विफल हो जाता है](/hi/solver/solving#when-solving-fails)।

## ट्रस छड़ें {#truss-bars}

दोनों सिरों पर हिंज लगाएँ, तो सदस्य केवल अक्षीय बल वहन करता है, जब तक उस पर भार केवल उसके नोडों पर लगे: यही ट्रस छड़ है।

```ts
domain.createBeam2D('AE', ['A', 'E'], 'steel', 'bar', [true, true])
```

[ट्रस वाला उदाहरण](/hi/solver/trusses) इसी तरह पूरा ट्रस हल करता है। EduBeam ऐप का ट्रस उदाहरण इसके बजाय दृढ़ संधियों का उपयोग करता है, इतने बड़े क्षेत्रफल के साथ कि अक्षीय बलों के सामने बंकन आघूर्ण नगण्य रह जाते हैं। दोनों मॉडल सही हैं; उनमें अंतर केवल इन छोटे आघूर्णों का है। छड़ का अपना कठोरता मैट्रिक्स सैद्धांतिक मैनुअल के [ट्रस अवयव](/hi/elements/truss) पृष्ठ पर व्युत्पन्न किया गया है।

## अवयव के मैट्रिक्स {#the-element-s-matrices}

विधि को ही पढ़ाने के लिए `Beam2D` अपने मैट्रिक्स [mathjs](https://mathjs.org) मैट्रिक्स के रूप में देता है; `.toArray()` उन्हें `number[][]` बना देता है:

| Method | क्या देता है |
| --- | --- |
| `computeGeo()` | `{ l, dx, dz }`: लंबाई और प्रक्षेप, m |
| `computeLocalStiffnessMtrx().answer` | स्थानीय अक्षों में 6 × 6 कठोरता मैट्रिक्स, हिंज वाले घूर्णन स्थैतिक संघनन (static condensation) से हटाए गए |
| `computeT()` | वैश्विक से स्थानीय अक्षों का 6 × 6 रूपांतरण मैट्रिक्स |
| `computeStiffness()` | वैश्विक अक्षों में 6 × 6 कठोरता मैट्रिक्स, $T^T K_l T$ |
| `computeShearFactor()` | $\Phi = 12EI_y/kGAL^2$ |

```ts
ac.computeStiffness().toArray() // number[][], N/m, N और N·m
```

DOF का क्रम $u_1, w_1, \varphi_1, u_2, w_2, \varphi_2$ है। सैद्धांतिक मैनुअल का [बीम अवयव](/hi/elements/beam) पृष्ठ ये मैट्रिक्स व्युत्पन्न करता है, और [EduBeam मॉडल को कैसे हल करता है](/hi/elements/analysis) दिखाता है कि उन्हें असेंबल कैसे किया जाता है।
