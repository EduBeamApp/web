---
title: प्लॉट मॉडल
description: "JSON में बदला जा सकने वाला PlotModel जो modelFromSolver हल किए गए @edubeam/fem मॉडल से बनाता है, उसके खंडशः बहुपद परिणाम, सटीक मान और चरम मान।"
order: 9
source: site
---

# प्लॉट मॉडल {#plot-model}

@edubeam/plot जो कुछ भी बनाता है, वह एक `PlotModel` से आता है: साधारण डेटा, जिसे `modelFromSolver` हल किए गए @edubeam/fem मॉडल से पढ़ता है। इसमें ज्यामिति, सपोर्ट, भार, प्रतिक्रियाएँ और हर सदस्य के परिणाम सटीक बहुपदों के रूप में होते हैं। यह JSON में बदला जा सकता है, इसलिए इसे build के समय बनाकर सॉल्वर की जगह भेजा जा सकता है, और हल की गई संरचना के सटीक मान और चरम मान पढ़ने का यह सबसे आसान तरीका है।

```ts
import { modelFromSolver } from '@edubeam/plot'

const model = modelFromSolver(solver) // या modelFromSolver(solver, { loadCase: 1 })
```

`results` तभी होता है जब लोड केस हल हो चुका हो। इसके बिना कंपोनेंट केवल मॉडल बनाते हैं, और [`reactionLabels: 'names'`](/hi/plot/structure-plot#reactions-as-unknowns) के साथ फिर भी अज्ञात प्रतिक्रियाएँ बनाते हैं, इसलिए बिना हल किया मॉडल भी अभ्यास पत्रक बन सकता है।

## मॉडल का स्वरूप {#the-format}

सब कुछ SI इकाइयों (m, N, N·m, N/m, K, rad) में और सॉल्वर के अक्षों में है: x दाईं ओर, z नीचे की ओर, घूर्णन स्क्रीन पर वामावर्त धनात्मक।

```ts
interface PlotModel {
  readonly nodes: readonly PlotNode[]
  readonly members: readonly PlotMember[]
  readonly loads: readonly PlotLoad[]
  readonly results?: PlotResults // केवल हल किए गए लोड केस के लिए
}

interface PlotNode {
  readonly id: string
  readonly x: number
  readonly z: number
  readonly fixity: { readonly dx: boolean; readonly dz: boolean; readonly ry: boolean } // अवरुद्ध DOF
  readonly angle: number // घुमाए गए सपोर्ट के अक्षों का घूर्णन, rad, स्क्रीन पर दक्षिणावर्त
}

interface PlotMember {
  readonly id: string
  readonly start: string // नोडों के id
  readonly end: string
  readonly hinges: readonly [boolean, boolean]
}

interface PlotResults {
  readonly members: Readonly<Record<string, MemberResults>> // सदस्य के id के अनुसार
  readonly reactions: readonly PlotReaction[]
}

interface MemberResults {
  readonly N: Piecewise // अक्षीय बल, तनाव धनात्मक
  readonly V: Piecewise // अपरूपण बल
  readonly M: Piecewise // बंकन आघूर्ण, धनात्मक जब स्थानीय +z की ओर तनाव हो
  readonly u: Piecewise // स्थानीय x के अनुदिश विस्थापन
  readonly w: Piecewise // स्थानीय z के अनुदिश विस्थापन
}

interface PlotReaction {
  readonly node: string
  readonly dof: 'dx' | 'dz' | 'ry'
  readonly value: number // संरचना पर नोड के अक्ष के अनुदिश बल, N (ry के लिए N·m)
}
```

भार सात प्रकारों में से एक होता है, जिन्हें `kind` से पहचाना जाता है:

| `kind` | Fields | क्या है |
| --- | --- | --- |
| `'nodalForce'` | `node`, `fx`, `fz` | नोड पर बल, वैश्विक घटक, N |
| `'nodalMoment'` | `node`, `my` | नोड पर आघूर्ण, N·m |
| `'distributed'` | `member`, `start`, `end`, `local` | रैखिक रूप से बदलता रेखीय भार, हर सिरे पर `{ fx, fz }`, N/m; दोनों बराबर हों तो समान |
| `'pointForce'` | `member`, `at`, `fx`, `fz`, `local` | सदस्य के आरंभ से `at` मीटर पर बल |
| `'pointMoment'` | `member`, `at`, `my` | सदस्य पर बल-युग्म |
| `'temperature'` | `member`, `uniform`, `gradient` | K: केंद्रक पर तापमान परिवर्तन, और नीचे व ऊपर के तापमान का अंतर (नीचे − ऊपर) |
| `'prescribed'` | `node`, `dx?`, `dz?`, `ry?` | नोड के अक्षों में सपोर्ट का विस्थापन, m और rad |

`local` तब `true` होता है जब घटक वैश्विक अक्षों के बजाय सदस्य के स्थानीय x और z के अनुदिश हों।

## खंडशः बहुपद {#piecewise-polynomials}

सदस्य का परिणाम एक `Piecewise` है: टुकड़ों की सूची, जिसमें हर टुकड़ा सदस्य के एक भाग पर एक बहुपद है। जहाँ भी कोई बिंदु भार या बल-युग्म परिणाम को तोड़ता है, वहाँ नया टुकड़ा शुरू होता है।

```ts
interface Piece {
  readonly x0: number // सदस्य के आरंभ से m
  readonly x1: number
  readonly c: readonly number[] // मान = Σ c[k]·sᵏ, जहाँ s = (x − x0)/(x1 − x0)
}
type Piecewise = readonly Piece[]
```

N, V और M अधिक से अधिक त्रिघात (cubic) बहुपद हैं, और विक्षेप अधिक से अधिक पाँचवीं घात का, इसलिए कुछ गुणांक ही सॉल्वर का उत्तर सटीक रूप से रख लेते हैं। 6 m के बीम पर 2 m पर 20 kN हो, तो उसका अपरूपण बल (shear force) दो अचर टुकड़ों से बना है:

```json
[{ "x0": 0, "x1": 2, "c": [13333.33] }, { "x0": 2, "x1": 6, "c": [-6666.67] }]
```

## मान ख़ुद पढ़ना {#reading-values-yourself}

जो फ़ंक्शन आरेख बनाते हैं, वही उन्हें पढ़ते भी हैं, सटीक रूप से और बिना सैंपलिंग के:

```ts
import { extremes, innerBreaks, modelFromSolver, valueAt } from '@edubeam/plot'

// 6 m सरल आलंबित, A से 2 m पर 20 kN, अपरूपण में दृढ़ IPE 200
const model = modelFromSolver(solver)
const { V, M, w } = model.results!.members['1']

innerBreaks(V) // [2]: टुकड़े भार पर मिलते हैं
valueAt(V, 2, 'left') // 13333.3 N, भार से ठीक पहले
valueAt(V, 2, 'right') // -6666.7 N, उसके ठीक बाद
extremes(M) // अधिकतम 26666.7 N·m, x = 2 पर
extremes(w) // अधिकतम 0.018973 m, x = 2.734 पर
```

`extremes` `{ max, min }` लौटाता है, जिनमें हर एक `{ x, value, side }` है, या ख़ाली सूची के लिए `null`। सबसे बड़ा विक्षेप भार के नीचे नहीं है: वह $x = L - \sqrt{(L^2 - a^2)/3} = 2.734$ m पर है, और $P\,a\,(L^2 - a^2)^{3/2}/9\sqrt{3}\,EIL = 18.97$ mm है, जैसा केंद्र से हटे भार का सूत्र देता है।

[अभ्यास जनरेटर](/hi/plot/exercises#the-generator) अपनी उत्तर कुंजी के लिए चरम आघूर्ण इसी तरह ढूँढ़ता है। बाकी सब [फ़ंक्शन](/hi/plot/functions#piecewise-polynomials) पृष्ठ पर है: ढाल, टुकड़े के अंदर के चरम मान, घात और Bézier वक्र।

## JSON के रूप में भेजना {#ship-it-as-json}

बस `JSON.stringify(model)` चाहिए, और `JSON.parse` ऐसा मॉडल लौटाता है जिसका चित्र ठीक वैसा ही बनता है जैसा सॉल्वर से बना था। रेखीय भार और बिंदु भार वाला पोर्टल फ्रेम 2 kB से कम है। देखें [एम्बेड करना](/hi/plot/embedding#ship-the-drawing-not-the-solver)। मॉडल [`structureSvg`](/hi/plot/functions#a-standalone-svg-file) को भी दिया जा सकता है, जो उसे SVG फ़ाइल में लिखता है।
