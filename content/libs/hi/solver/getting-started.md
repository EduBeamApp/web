---
title: शुरुआत
description: "EduBeam के पीछे का परिमित अवयव सॉल्वर @edubeam/fem इंस्टॉल करें और TypeScript की लगभग बारह पंक्तियों में एक सरल आलंबित बीम हल करें, जाँचें और उसके परिणाम पढ़ें।"
order: 1
group: परिचय
source: site
---

# शुरुआत {#getting-started}

@edubeam/fem वह परिमित अवयव (finite element) सॉल्वर है जिस पर [EduBeam]{.edubeam} चलता है: ऐप जो भी आरेख, प्रतिक्रिया और विक्षेप दिखाता है, वह इसी से आता है। इससे आप अपने कोड से समतल बीम, फ्रेम और ट्रस हल कर सकते हैं, ब्राउज़र में भी और Node में भी: उत्तरों सहित अभ्यास बनाने, गृहकार्य जाँचने, पैरामीट्रिक अध्ययन चलाने या किसी वेब पेज के पीछे सॉल्वर लगाने के लिए।

::div{.actions}
[अपना पहला बीम हल करें](#a-simply-supported-beam) [उदाहरण प्रोग्राम देखें](/hi/solver/beams)
::

यह TypeScript में लिखा है, अपने types साथ लाता है और GPL-3.0 लाइसेंस के तहत मुक्त सॉफ़्टवेयर है। इसे Bořek Patzák ने बनाया और वे इसे Jan Voříšek और अन्य योगदानकर्ताओं के साथ विकसित करते हैं।

## इंस्टॉल करना {#install}

```bash
npm install @edubeam/fem
```

यह `import` और `require` दोनों के साथ, ब्राउज़र में और Node 18 या उसके बाद के संस्करणों में चलता है, और केवल एक dependency लाता है: [mathjs](https://mathjs.org)। संस्करण 0.3.0 तक यह GitHub से `ts-fem` नाम से इंस्टॉल होता था: अगर आपने उसका उपयोग किया है, तो अपने imports बदलकर `@edubeam/fem` कर दें। और कुछ नहीं बदला।

नीचे का उदाहरण किसी खाली फ़ोल्डर में आज़माना हो, तो पहले उस फ़ोल्डर को ऐसा प्रोजेक्ट बनाएँ जो `import` का उपयोग करे, फिर इंस्टॉल करें:

```bash
npm init -y
npm pkg set type=module
npm install @edubeam/fem
```

`package.json` में `"type": "module"` के बिना भी उदाहरण चलता है, पर Node पहले एक चेतावनी छापता है।

## आपका पहला बीम {#a-simply-supported-beam}

6 m लंबा स्टील बीम, IPE 200, एक पिन सपोर्ट और एक रोलर सपोर्ट पर, 12 kN/m भार के साथ:

```ts [beam.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver

// हर जगह SI इकाइयाँ: m, N, Pa। स्टील और IPE 200।
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

// नोड [x, y, z] पर, मीटर में, उन DOF के साथ जिन्हें उनका सपोर्ट रोकता है
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // पिन
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // रोलर
const beam = domain.createBeam2D(1, ['A', 'B'], 'steel', 'IPE200')

// 12 kN/m सदस्य के स्थानीय z के अनुदिश: बाएँ से दाएँ बने बीम पर नीचे की ओर
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad(1, [0, 12e3], true)

solver.solve()

console.log(beam.computeBendingMomentAt(lc, 3)) // मध्य-स्पैन पर, N·m
console.log(beam.computeShearForceAt(lc, 0)) // A पर, N
console.log(beam.computeLocalDefl(lc, 2).w[1]) // मध्य-स्पैन पर, m
```

इसे `beam.ts` नाम से सहेजें और `node beam.ts` चलाएँ: Node 22.18 और उसके बाद के संस्करण TypeScript को सीधे चलाते हैं। फ़ाइल में कोई type annotation नहीं है, इसलिए पुराने Node पर इसे `beam.mjs` नाम से सहेजें। यह छापता है:

```text [Output]
54000
36000
0.04990940552616746
```

ये पाठ्यपुस्तक वाले मान हैं: $M = qL^2/8 = 54$ kNm और $V = qL/2 = 36$ kN। नीचे यही बीम है, जिसे यही सॉल्वर आपके ब्राउज़र में हल करता है:

::model-figure{caption="ऊपर वाला बीम: 6 m, IPE 200, 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9, g: 81e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 0.8333333 }
---
::

विक्षेप 49.91 mm है, यानी Euler–Bernoulli के $5qL^4/384EI = 49.63$ mm से 0.28 mm अधिक। यह त्रुटि नहीं है: सदस्य एक Timoshenko बीम है, और 0.28 mm, यानी $qL^2/8kGA$, इस बीम का अपरूपण विरूपण (shear deformation) है। `k` को बहुत बड़ा कर दें, जैसे `1e32`, तो यह अंतर गायब हो जाता है: देखें [अपरूपण विरूपण](/hi/solver/materials-sections#shear-deformation)।

## कोड क्या करता है {#what-the-code-does}

::div{.steps}
### सॉल्वर बनाएँ {#make-a-solver}

`new LinearStaticSolver()` के साथ एक खाली `domain` आता है, जिसमें मॉडल रहता है, और एक लोड केस, `solver.loadCases[0]`।

### मॉडल का वर्णन करें {#describe-the-model}

पहले सामग्री और अनुप्रस्थ काट, फिर सपोर्ट सहित नोड, और फिर नोडों के बीच सदस्य। हर चीज़ का एक लेबल होता है, स्ट्रिंग या संख्या, जिससे मॉडल का बाकी हिस्सा उसे पहचानता है। देखें [नोड और सपोर्ट](/hi/solver/nodes-supports), [सामग्री और अनुप्रस्थ काट](/hi/solver/materials-sections) और [सदस्य और हिंज](/hi/solver/members-hinges)।

### भार लगाएँ {#load-it}

भार किसी लोड केस के होते हैं: नोडों पर बल, सदस्यों के अनुदिश भार, तापमान और सपोर्ट का धँसाव। देखें [नोडल और सदस्य भार](/hi/solver/loads)।

### हल करें {#solve}

`solver.solve()` हर लोड केस को असेंबल करके हल करता है। देखें [हल करना](/hi/solver/solving)।

### परिणाम पढ़ें {#read-the-results}

सदस्य के किसी भी बिंदु पर आंतरिक बल, विक्षेप, सिरा-बल, नोडल विस्थापन और प्रतिक्रियाएँ। देखें [परिणाम पढ़ना](/hi/solver/results), और आरेखों के लिए [परिणामों का चित्रण](/hi/solver/drawing)।
::

## इकाइयाँ और चिह्न संक्षेप में {#axes-and-signs}

इनपुट SI इकाइयों में, तो आउटपुट भी SI इकाइयों में। मॉडल x–z समतल में है और **z नीचे की ओर है**, इसलिए धनात्मक `fz` नीचे की ओर धकेलता है और 4 m ऊँचे स्तंभ का शीर्ष $z = -4$ पर होता है। सदस्य के अनुदिश स्थिति उसके पहले नोड से मीटर में मापी जाती है। सैगिंग (निचले तंतुओं में तनाव) वाला आघूर्ण धनात्मक है। पूरी सूची [इकाइयाँ और चिह्न](/hi/solver/conventions) पृष्ठ पर है।

## छह बातें जिनमें लोग अक्सर अटकते हैं {#pitfalls}

1. **z नीचे की ओर है।** गुरुत्व भार धनात्मक होते हैं, और सपोर्टों से ऊपर की हर चीज़ का z ऋणात्मक होता है। देखें [अक्ष](/hi/solver/conventions#axes)।
2. **सदस्य की दिशा M और w का चिह्न तय करती है।** बीम बाएँ से दाएँ और स्तंभ नीचे से ऊपर परिभाषित करें, तो चिह्न पाठ्यपुस्तक जैसे आते हैं। देखें [सदस्य की दिशा](/hi/solver/conventions#member-direction)।
3. **कोई पैरामीटर छूट जाए तो त्रुटि नहीं, बल्कि `NaN` या बेतुका परिणाम मिलता है।** अनुप्रस्थ काट को `a`, `iy` और `k` चाहिए; सामग्री को `e` चाहिए, और `g` भी, जब तक `k` बहुत बड़ा न हो। देखें [सामग्री और अनुप्रस्थ काट](/hi/solver/materials-sections)।
4. **नोड या सदस्य जोड़ने, या सपोर्ट बदलने के बाद** दोबारा हल करने से पहले `solver.codeNumberGenerated = false` सेट करें। देखें [बदलाव के बाद दोबारा हल करना](/hi/solver/solving#solving-again-after-a-change)।
5. **प्रतिक्रियाएँ mathjs मैट्रिक्स या array के रूप में लौटती हैं,** उसी क्रम में जिसमें सपोर्ट के DOF दिए गए थे। देखें [प्रतिक्रियाएँ](/hi/solver/results#reactions)।
6. **यंत्र (mechanism) हमेशा त्रुटि नहीं फेंकता।** $10^{12}$ m का विस्थापन बताता है कि संरचना बिना रुकावट हिल सकती है। देखें [जब हल विफल हो](/hi/solver/solving#when-solving-fails)।

## आगे क्या पढ़ें {#next}

::card-grid{cols="2"}
:::card{title="उदाहरण प्रोग्राम" icon="lucide:book-open" to="/hi/solver/beams"}
पूरे, जाँचे हुए प्रोग्राम: बीम, फ्रेम, ट्रस, उत्तर कुंजी के साथ अभ्यास पत्रक, और एक छोटा HTTP सर्वर।
:::
:::card{title="परिणाम चित्रित करें" icon="lucide:chart-spline" to="/hi/solver/drawing"}
हल किया हुआ मॉडल @edubeam/plot को दें और उसके आरेख SVG के रूप में पाएँ, Vue में या Node स्क्रिप्ट से।
:::
:::card{title="API संदर्भ" icon="lucide:list-tree" to="/hi/solver/reference"}
हर class, method और argument, इकाइयों के साथ और यह भी कि हर एक क्या लौटाता है।
:::
:::card{title="सिद्धांत" icon="lucide:sigma" to="/hi/elements/beam"}
बीम अवयव, उसका कठोरता मैट्रिक्स और रूपांतरण, EduBeam के सैद्धांतिक मैनुअल में।
:::
::
