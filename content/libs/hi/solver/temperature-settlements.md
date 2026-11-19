---
title: तापमान और सपोर्ट का धँसाव
description: "@edubeam/fem में सदस्यों पर तापमान परिवर्तन और तापमान प्रवणता का भार लगाएँ, और सपोर्टों को निर्धारित विस्थापन से खिसकाएँ, जाँचे हुए उदाहरणों के साथ।"
order: 7
source: site
---

# तापमान और सपोर्ट का धँसाव {#temperature-and-settlements}

दो भार जो बल नहीं हैं: एक सदस्य जो अपनी लंबाई या वक्रता बदलना चाहता है, और एक सपोर्ट जो धँस जाता या खिसक जाता है, यानी सपोर्ट का धँसाव (support settlement)। दोनों आंतरिक बल वहीं पैदा करते हैं जहाँ संरचना उन्हें रोकती है, इसलिए स्थैतिकतः अनिर्धार्य संरचनाओं के अभ्यास के लिए ये अच्छे विषय हैं। दोनों का सिद्धांत ऐप के [अवयव भार](/hi/elements/beam#element-loads) खंड में है।

## तापमान {#temperature}

```ts
lc.createBeamTemperatureLoad(member, [dTc, dTb, dTt])
```

| मान | अर्थ | मुक्त सदस्य पर प्रभाव |
| --- | --- | --- |
| `dTc` | केंद्रक पर परिवर्तन, K | लंबाई $\alpha\,\Delta T_c\,L$ बढ़ जाती है |
| `dTb` | निचले तंतु (स्थानीय +z की ओर) पर परिवर्तन, K | `dTt` के साथ $\kappa = \alpha\,(\Delta T_b - \Delta T_t)/h$ वक्रता से मुड़ता है |
| `dTt` | ऊपरी तंतु पर परिवर्तन, K | |

सदस्य को केवल अंतर `dTb - dTt` मोड़ता है, इसलिए `[30, 20, 0]` और `[30, 10, -10]` एक ही भार हैं। इसके लिए सामग्री का `alpha` और काट का `h` चाहिए; `h` के बिना आघूर्ण `NaN` आते हैं।

दोनों सिरों पर फिक्स्ड बीम न लंबा हो सकता है, न मुड़ सकता है, इसलिए उसमें संपीड़न और बंकन आ जाते हैं: $N = -EA\,\alpha\,\Delta T_c$ और $M = -EI\,\alpha\,(\Delta T_b - \Delta T_t)/h$।

```ts [temperature.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial(1, { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [6, 0, 0], fixed)
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

// केंद्रक 30 K गर्म, नीचे का भाग ऊपर से 20 K अधिक गर्म
lc.createBeamTemperatureLoad(1, [30, 20, 0])
solver.solve()

beam.computeNormalForceAt(lc, 3) // -215460 N: EA · 12e-6 · 30
beam.computeBendingMomentAt(lc, 3) // -4896.4 N·m: EI · 12e-6 · 20 / 0.2
```

IPE 200 के लिए $EA = 598.5$ MN और $EI = 4.0803$ MNm²। गर्म निचला तंतु मुक्त बीम के सिरों को ऊपर की ओर मोड़ देता है, इसलिए फिक्स्ड सिरे उसे उलटी दिशा में मोड़ते हैं: होगिंग आघूर्ण, यानी ऊपरी तंतु में तनाव।

::model-figure{caption="दोनों सिरों पर फिक्स्ड बीम, केंद्रक पर 30 K गर्म और नीचे से ऊपर की तुलना में 20 K अधिक गर्म"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 30, bottom: 20, top: 0 } }
results: [M, N]
show: [nodeLabels]
material: { e: 210e9, alpha: 12e-6 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

सरल आलंबित बीम (simply supported beam) पर यही भार कोई आंतरिक बल पैदा नहीं करता, केवल गति: रोलर $\alpha\,\Delta T_c\,L = 2.16$ mm बाहर सरकता है और मध्य-स्पैन $\kappa L^2/8 = 5.4$ mm नीचे झुकता है।

## निर्धारित विस्थापन {#prescribed-displacements}

```ts
lc.createPrescribedDisplacement(node, { [DofID.Dz]: 0.01 })
```

सपोर्ट को दी गई मात्रा से खिसकाता है: `Dx` और `Dz` के लिए मीटर, `Ry` के लिए रेडियन, नोड के अपने अक्षों में। DOF ऐसी होनी चाहिए जिसे नोड का सपोर्ट रोकता हो; मुक्त DOF पर मान बिना चेतावनी के अनदेखा हो जाता है।

एक प्रॉप्ड कैंटिलीवर, जिसका रोलर 10 mm धँसता है, नए सॉल्वर में, तापमान वाले उदाहरण की सामग्री और काट के साथ:

```ts
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // फिक्स्ड
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // रोलर
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

lc.createPrescribedDisplacement('B', { [DofID.Dz]: 0.01 }) // 10 mm नीचे
solver.solve()

domain.getNode('B').getReactions(lc).values // [566.7] N: 3EIw/L³
beam.computeBendingMomentAt(lc, 0) // A पर -3400.2 N·m: 3EIw/L²
```

बीम को अपने साथ नीचे लाने के लिए रोलर को उसे खींचना पड़ता है, इसलिए उसकी प्रतिक्रिया +z के अनुदिश धनात्मक है: $3EIw/L^3 = 3 \cdot 4.0803 \times 10^6 \cdot 0.01 / 216 = 566.7$ N।

::model-figure{caption="प्रॉप्ड कैंटिलीवर का रोलर 10 mm धँसता है: फिक्स्ड सिरे पर −3.4 kNm।"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

ऐप ये दोनों भार कैसे दिखाता है, यह [भार](/hi/essentials/loads) पृष्ठ पर है।
