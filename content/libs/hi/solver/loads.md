---
title: नोडल और सदस्य भार
description: "@edubeam/fem में नोडों पर बल और आघूर्ण, और सदस्यों पर समान, समलम्बी और बिंदु भार लगाएँ, वैश्विक या स्थानीय अक्षों में; फिर उन्हें बदलें या हटाएँ।"
order: 6
group: भार
source: site
---

# नोडल और सदस्य भार {#nodal-and-member-loads}

भार किसी लोड केस के होते हैं। सॉल्वर एक लोड केस के साथ शुरू होता है, `solver.loadCases[0]`, और उस पर हर `create…` method एक भार जोड़कर उसे लौटाता है। कई लोड केस और उनके संयोजनों के लिए देखें [लोड केस](/hi/solver/load-cases)।

मान N, N/m और N·m में होते हैं और [अक्षों](/hi/solver/conventions#axes) का पालन करते हैं: +z नीचे की ओर है, धनात्मक आघूर्ण वामावर्त है।

## हर तरह के भार वाला बीम {#a-beam-with-every-kind}

पिन और रोलर सपोर्ट पर 8 m लंबा बीम, जिस पर 4 से 10 kN/m तक बढ़ता रेखीय भार, 20 kN का बिंदु भार, 10 kNm का युग्म (couple) और रोलर पर एक क्षैतिज बल है:

```ts [loads.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // पिन
domain.createNode('B', [8, 0, 0], [DofID.Dz]) // रोलर
domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
// A पर 4 kN/m से B पर 10 kN/m तक बढ़ता, नीचे की ओर
lc.createBeamElementTrapezoidalEdgeLoad(1, [0, 4e3], [0, 10e3], false)
// [fx, fz, my, a]: 20 kN नीचे की ओर, A से 2 m पर
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], false)
// 10 kNm का वामावर्त युग्म, A से 6 m पर
lc.createBeamConcentratedLoad(1, [0, 0, 10e3, 6], false)
// B पर 5 kN दाईं ओर
lc.createNodalLoad('B', { [DofID.Dx]: 5e3 })
solver.solve()

// getReactions mathjs Matrix या array देता है: उसे array बना लें
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

console.log(list(domain.getNode('A').getReactions(lc).values))
console.log(list(domain.getNode('B').getReactions(lc).values))
```

```text [Output]
[ -5000, -40250 ]
[ -35750 ]
```

हाथ से: रेखीय भार 56 kN है और A से 4.571 m पर लगता है, इसलिए A के परितः आघूर्ण लेने पर $8R_B = 56 \cdot 4.571 + 20 \cdot 2 - 10 = 286$, $R_B = 35.75$ kN ऊपर, और $R_A = 76 - 35.75 = 40.25$ kN ऊपर। पिन 5 kN के बल को भी थामता है, जिससे पूरे बीम में 5 kN का तनाव आता है।

::model-figure{caption="वही भार। चित्र युग्म को 6 m पर एक नोड C पर रखता है, जिससे परिणाम वही रहते हैं।"}
---
nodes: { A: [0, 0], C: [6, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: [4, 8.5] }
  - { member: 2, qz: [8.5, 10] }
  - { member: 1, pz: 20, at: 2 }
  - { node: C, my: 10 }
  - { node: B, fx: 5 }
results: [M]
show: [nodeLabels]
labels: horizontal
---
::

## नोडल भार {#nodal-loads}

```ts
lc.createNodalLoad(node, { [DofID.Dx]: fx, [DofID.Dz]: fz, [DofID.Ry]: my }, lcs)
```

केवल वे घटक दें जिनकी आपको ज़रूरत है। मान वैश्विक अक्षों में होते हैं, या `lcs` को `true` करने पर नोड के अपने अक्षों में, यदि नोड [`updateLcs`](/hi/solver/nodes-supports#inclined-supports) से घुमाया गया है। सपोर्ट जिस DOF को रोकता है, उस पर लगा बल सीधे प्रतिक्रिया में चला जाता है और कुछ भी मोड़ता नहीं।

## सदस्य भार {#member-loads}

| Method | मान | भार |
| --- | --- | --- |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | N/m | पूरे सदस्य पर समान |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | N/m | रैखिक, पहले नोड से दूसरे तक |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | N, N·m, m | एक बल और एक युग्म, पहले नोड से `a` मीटर पर |

रेखीय भार हमेशा पूरे सदस्य पर लगते हैं। स्पैन के किसी हिस्से पर भार के लिए, जहाँ भार शुरू होता है वहाँ एक नोड डालकर सदस्य को बाँट दें: अतिरिक्त नोड कोई परिणाम नहीं बदलता। बिंदु भार या युग्म सदस्य पर कहीं भी हो सकता है।

### वैश्विक या स्थानीय अक्ष {#global-or-local-axes}

अंतिम argument, `lcs`, बताता है कि घटक किन अक्षों में हैं:

- `false`: वैश्विक x और z। सदस्य का ढलान कुछ भी हो, `fz` ऊर्ध्वाधर लगता है।
- `true`: सदस्य का स्थानीय x (उसके अनुदिश) और z (उसके आर-पार)। `fz` सदस्य के लंबवत लगता है।

बाएँ से दाएँ बने क्षैतिज सदस्य पर दोनों एक ही हैं; दाएँ से बाएँ बने सदस्य पर स्थानीय `fz` ऊपर की ओर होता है।

::callout{type="info" title="रेखीय भार सदस्य के प्रति मीटर होते हैं"}
दोनों प्रकार सदस्य की अपनी लंबाई के प्रति मीटर लगते हैं। 5 m लंबे राफ़्टर पर, जिसका क्षैतिज प्रक्षेप 4 m है, वैश्विक अक्षों में `[0, 10e3]` कुल मिलाकर 50 kN होता है। क्षैतिज प्रक्षेप के प्रति मीटर मापा गया 10 kN/m का हिम भार राफ़्टर के अनुदिश $10 \cdot 4/5 = 8$ kN/m होता है: `[0, 8e3]` दें।
::

## भार बदलना या हटाना {#change-or-remove-a-load}

हर `create…` method भार लौटाता है। उसके मान बदलें और फिर से हल करें:

```ts
const q = lc.createBeamElementUniformEdgeLoad(1, [0, 10e3], true)
solver.solve()
q.values = [0, 20e3] // दोगुना भार
solver.solve()
```

भार साधारण arrays में रहते हैं, `lc.nodalLoadList` और `lc.elementLoadList` (सदस्य और तापीय भार), इसलिए `lc.elementLoadList.splice(index, 1)` एक भार हटा देता है। हर भार के property नाम [API संदर्भ](/hi/solver/reference#loads) में हैं।

तापमान परिवर्तन और सपोर्ट का धँसाव भी भार ही हैं: देखें [तापमान और सपोर्ट का धँसाव](/hi/solver/temperature-settlements)।
