---
title: लोड केस
description: "@edubeam/fem मॉडल के कई लोड केस एक साथ हल करें, और अध्यारोपण से उनके परिणामों को भार संयोजनों और एनवेलप में जोड़ें।"
order: 8
source: site
---

# लोड केस {#load-cases}

लोड केस उन भारों का समूह है जो एक साथ हल किए जाते हैं। सॉल्वर एक लोड केस के साथ शुरू होता है; और जोड़ें, तो एक ही `solve()` एक ही कठोरता मैट्रिक्स से सबको हल कर देता है। विश्लेषण रैखिक है, इसलिए अलग-अलग लोड केसों के परिणामों को गुणांकों से गुणा करके जोड़ा जा सकता है: भार संयोजन बस इतना ही है।

## लोड केस जोड़ना {#add-a-load-case}

```ts [load-cases.ts]
import { DofID, LinearStaticSolver, LoadCase } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const dead = solver.loadCases[0] // वह जिसके साथ हर सॉल्वर शुरू होता है
const live = new LoadCase('live', domain)
solver.loadCases.push(live)

dead.createBeamElementUniformEdgeLoad(1, [0, 10e3], true) // 10 kN/m
live.createBeamConcentratedLoad(1, [0, 20e3, 0, 3], true) // मध्य-स्पैन पर 20 kN
solver.solve() // हर लोड केस हल करता है

console.log(beam.computeBendingMomentAt(dead, 3)) // qL²/8
console.log(beam.computeBendingMomentAt(live, 3)) // PL/4
```

```text [Output]
45000
30000
```

परिणाम का हर method वह लोड केस लेता है जिसे उसे पढ़ना है। पहले लोड केस का लेबल `'DefaultLC'` है; लेबल केवल नाम हैं, और सॉल्वर लोड केसों को object से पहचानता है।

## संयोजन बनाना {#combine-them}

हर लोड केस के परिणाम को उसके गुणांक से गुणा करें और जोड़ दें। Eurocode की चरम सीमा अवस्था (ultimate limit state), $1.35\,G + 1.5\,Q$, के लिए मध्य-स्पैन पर:

```ts
1.35 * beam.computeBendingMomentAt(dead, 3) +
  1.5 * beam.computeBendingMomentAt(live, 3) // 105750 N·m
```

यही प्रतिक्रियाओं, विस्थापनों और हर दूसरे परिणाम पर लागू होता है। पूरे सदस्य के अनुदिश बिंदु-दर-बिंदु जोड़ें: `computeBendingMoment(lc, n)` के arrays हर लोड केस के लिए एक ही `x` का उपयोग करते हैं।

```ts
const n = 60
const g = beam.computeBendingMoment(dead, n).M
const q = beam.computeBendingMoment(live, n).M
const uls = g.map((m, i) => 1.35 * m + 1.5 * q[i])
Math.max(...uls) // 105750 N·m, x = 3 पर
```

एनवेलप, यानी कई संयोजनों में सबसे बड़ा और सबसे छोटा मान, ऐसे arrays पर बिंदु-दर-बिंदु `Math.max` और `Math.min` भर है। चलते भार के लिए इसके बजाय हर भार-स्थिति पर एक बार हल करें: [प्रभाव रेखा (influence line) वाला उदाहरण](/hi/solver/scripts#an-influence-line-as-csv) यही करता है।

## EduBeam ऐप में {#in-the-edubeam-app}

ऐप एक समय में एक लोड केस हल करता है, इसलिए संयोजनों में लाइब्रेरी ऐप से आगे जाती है। कई लोड केसों वाले मॉडल को फिर भी हर लोड केस के लिए अलग से [चित्रित](/hi/solver/drawing) किया जा सकता है: @edubeam/plot का `StructurePlot` अपने `loadCase` prop में `solver.loadCases` का index लेता है।
