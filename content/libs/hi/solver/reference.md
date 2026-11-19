---
title: API संदर्भ
description: "@edubeam/fem 0.3 की हर class, method और argument, इकाइयों और डिफ़ॉल्ट मानों के साथ, और यह भी कि हर एक क्या लौटाता है।"
order: 16
group: API संदर्भ
source: site
---

# API संदर्भ {#api-reference}

`@edubeam/fem` 0.3 क्या export करता है, उपयोग के अनुसार समूहों में। इकाइयाँ हर जगह SI हैं: m, N, N·m, N/m, Pa, K और rad। लेबल (`LabelType`) `string | number` होते हैं और स्ट्रिंग के रूप में संग्रहीत होते हैं। जो methods यहाँ सूचीबद्ध नहीं हैं, वे आंतरिक हैं: वे TypeScript में public केवल इसलिए हैं क्योंकि सॉल्वर की अपनी classes उन्हें कॉल करती हैं।

## Exports {#exports}

| Export | प्रकार | खंड |
| --- | --- | --- |
| `LinearStaticSolver` | class | [विश्लेषण](#analyses) |
| `Solver` | abstract class | [विश्लेषण](#analyses) |
| `Domain` | class | [Domain](#domain) |
| `Node` | class | [Node](#node) |
| `Beam2D`, `Element` | classes | [अवयव](#elements) |
| `Material`, `CrossSection` | classes | [सामग्री और अनुप्रस्थ काट](#materials-and-sections) |
| `LoadCase` | class | [भार](#loads) |
| `NodalLoad`, `BeamConcentratedLoad`, `BeamElementUniformEdgeLoad`, `BeamElementTrapezoidalEdgeLoad`, `BeamTemperatureLoad`, `PrescribedDisplacement`, `Load`, `BeamElementLoad` | classes | [भार](#loads) |
| `DofID` | enum | [DofID](#dofid) |
| `LabelType`, `EnumDictionary`, `MaterialParameters`, `CrossSectionParameters` | types | |

## विश्लेषण {#analyses}

### `LinearStaticSolver` {#linearstaticsolver}

```ts
const solver = new LinearStaticSolver()
```

| Member | प्रकार | विवरण |
| --- | --- | --- |
| `domain` | `Domain` | मॉडल |
| `loadCases` | `LoadCase[]` | एक लोड केस, `'DefaultLC'`, से शुरू होता है। और लोड केस `new LoadCase(label, solver.domain)` से push करें: [लोड केस](/hi/solver/load-cases)। |
| `solve()` | `void` | ज़रूरत हो तो समीकरणों का क्रमांकन करता है, फिर हर लोड केस को असेंबल करके हल करता है। [यंत्र](/hi/solver/solving#when-solving-fails) पर त्रुटि फेंक सकता है, पर हमेशा नहीं। 0.3.1 से कुछ नहीं छापता; 0.3.0 अपना समय log करता था। |
| `codeNumberGenerated` | `boolean` | नोड या सदस्य जोड़ने या हटाने, या सपोर्ट बदलने के बाद इसे `false` करें: [क्यों](/hi/solver/solving#solving-again-after-a-change) |
| `neq`, `pneq` | `number` | मुक्त और सपोर्ट वाली DOF की संख्या, हल के बाद |
| `k` | mathjs `Matrix` | असेंबल किया गया वैश्विक कठोरता मैट्रिक्स, हल के बाद |
| `getNodeDofIDs(label)` | `number[]` | नोड की DOF, हल के बाद |

`EigenValueDynamicSolver` स्रोत कोड में है, पर export नहीं होता।

## Domain {#domain}

`solver.domain` मॉडल को चार `Map` में रखता है, जिनकी keys स्ट्रिंग के रूप में लेबल हैं: `nodes`, `elements`, `materials`, `crossSections`। हटाने के कोई methods नहीं हैं: `domain.nodes.delete(label)` और `domain.elements.delete(label)` कोई नोड या सदस्य हटाते हैं, जिसके बाद [फिर से क्रमांकन](/hi/solver/solving#solving-again-after-a-change) करें।

| Method | लौटाता है | विवरण |
| --- | --- | --- |
| `createNode(label, coords?, bcs?)` | `Node` | `coords` `[x, y, z]` m में (डिफ़ॉल्ट `[0, 0, 0]`), `bcs` सपोर्ट वाली `DofID` (डिफ़ॉल्ट कोई नहीं) |
| `createBeam2D(label, nodes, mat, cs, hinges?)` | `Beam2D` | `nodes` `[first, second]`, `hinges` `[atFirst, atSecond]` (डिफ़ॉल्ट `[false, false]`) |
| `createMaterial(label, params?)` | `Material` | देखें [सामग्री और अनुप्रस्थ काट](#materials-and-sections) |
| `createCrossSection(label, params?)` | `CrossSection` | देखें [सामग्री और अनुप्रस्थ काट](#materials-and-sections) |
| `getNode(label)`, `getElement(label)`, `getMaterial(label)`, `getCS(label)` | वह object | अज्ञात लेबल पर `RangeError` फेंकता है। `getElement` का type `Element` है: परिणाम पढ़ने के लिए `as Beam2D` लिखें। |

पहले से उपयोग में आए लेबल से object बनाने पर पुराना object बदल जाता है।

## Node {#node}

| Member | प्रकार | विवरण |
| --- | --- | --- |
| `label` | `string` | |
| `coords` | `number[]` | `[x, y, z]`, m। नोड खिसकाने के लिए इसे बदलें। |
| `bcs` | `Set<DofID>` | सपोर्ट वाली DOF। सपोर्ट बदलने के लिए इसे बदलें। |
| `lcs` | `number[][] \| undefined` | नोड के घुमाए गए अक्ष, यदि हों |
| `updateLcs({ locx, locy }?)` | `void` | नोड के अक्ष घुमाता है: `locx` वैश्विक घटकों में उसका x अक्ष, `locy` `[0, 1, 0]`। बिना argument के अक्ष वापस मूल स्थिति में आते हैं। |
| `hasLcs()` | `boolean` | क्या अक्ष घुमाए गए हैं |
| `getUnknowns(lc, dofs)` | `Matrix`, या एक DOF के लिए `number` | विस्थापन (m) और घूर्णन (rad), नोड के अक्षों में |
| `getReactions(lc, global?)` | `{ dofs, values }` | सपोर्ट वाली DOF पर प्रतिक्रियाएँ, `bcs` के क्रम में: N, N·m। कई हों तो `values` एक mathjs `Matrix` है, एक हो तो एक तत्व वाला array, मुक्त नोड के लिए `[]`। घुमाए गए नोड पर `global` `true` के साथ: वैश्विक अक्षों में तीनों DOF, `dofs` `[0, 2, 4]`, `values` एक array जिसमें जहाँ कुछ रोका नहीं गया वहाँ 0। [इन्हें पढ़ना](/hi/solver/results#reactions)। |

## अवयव {#elements}

### `Beam2D` {#beam2d}

x–z समतल में दो नोडों वाला Timoshenko बीम, हर नोड पर तीन DOF (`Dx`, `Dz`, `Ry`)। `x` पहले नोड से मीटर में है; `n` खंडों की संख्या है, जिससे n + 1 बिंदु मिलते हैं।

| Member | लौटाता है | विवरण |
| --- | --- | --- |
| `label`, `nodes`, `mat`, `cs` | `string`, `string[]`, `string`, `string` | |
| `hinges` | `[boolean, boolean]` | पहले और दूसरे नोड पर आघूर्ण मुक्ति |
| `computeNormalForceAt(lc, x)` | `number` | N, तनाव धनात्मक |
| `computeShearForceAt(lc, x)` | `number` | V, धनात्मक जहाँ M स्थानीय x के अनुदिश बढ़ता है |
| `computeBendingMomentAt(lc, x)` | `number` | M, धनात्मक जब स्थानीय +z की ओर तनाव हो |
| `computeNormalForce(lc, n)` | `{ x, N }` | n + 1 बिंदुओं पर N |
| `computeShearForce(lc, n)` | `{ x, V }` | n + 1 बिंदुओं पर V |
| `computeBendingMoment(lc, n)` | `{ x, M }` | n + 1 बिंदुओं पर M |
| `computeLocalDefl(lc, n)` | `{ u, w }` | सदस्य के अनुदिश और आर-पार विस्थापन, स्थानीय अक्ष, m |
| `computeGlobalDefl(lc, n)` | `{ u, w }` | वही, वैश्विक x और z में |
| `computeEndForces(lc)` | `Matrix` | `[X12, Z12, M12, X21, Z21, M21]`, वे बल जो नोड सदस्य पर लगाते हैं, स्थानीय अक्ष |
| `computeEndDisplacement(lc)` | `Matrix` | स्थानीय अक्षों में सिरों के विस्थापन, हिंज के घूर्णन सहित |
| `computeGeo()` | `{ l, dx, dz }` | लंबाई और प्रक्षेप, m |
| `computeT()` | `Matrix` | 6 × 6 रूपांतरण, वैश्विक से स्थानीय |
| `computeLocalStiffnessMtrx()` | `{ answer }` | `answer`: 6 × 6 स्थानीय कठोरता, हिंज वाले घूर्णन संघनित करके हटाए गए |
| `computeStiffness()` | `Matrix` | 6 × 6 वैश्विक कठोरता |
| `computeShearFactor()` | `number` | $\Phi = 12EI_y/kGAL^2$ |
| `getMaterial()`, `getCS()` | `Material`, `CrossSection` | |

बिंदु भार पर `…At` methods उसके ठीक आगे का मान लौटाते हैं। `Element`, `Beam2D` की abstract base class है; `domain.elements` और `getElement` यही type इस्तेमाल करते हैं।

## सामग्री और अनुप्रस्थ काट {#materials-and-sections}

| `MaterialParameters` | इकाई | डिफ़ॉल्ट | किसके लिए |
| --- | --- | --- | --- |
| `e` | Pa | 1 | कठोरता |
| `g` | Pa | 1 | अपरूपण कठोरता |
| `alpha` | 1/K | 1 | तापीय भार |
| `d` | kg/m³ | 1 | स्थैतिकी में किसी काम का नहीं |

| `CrossSectionParameters` | इकाई | डिफ़ॉल्ट | किसके लिए |
| --- | --- | --- | --- |
| `a` | m² | कोई नहीं, अनिवार्य | अक्षीय और अपरूपण कठोरता |
| `iy` | m⁴ | कोई नहीं, अनिवार्य | बंकन कठोरता |
| `k` | – | कोई नहीं, अनिवार्य | अपरूपण कठोरता $kGA$; अपरूपण विरूपण न चाहिए तो `1e32` |
| `h` | m | कोई नहीं | तापमान प्रवणता (इसके बिना `NaN`) |
| `iz`, `dyz`, `j` | m⁴ | कोई नहीं | `Beam2D` इनका उपयोग नहीं करता |

सामग्री का छूटा पैरामीटर 1 होता है, कोई सामान्य मान नहीं; `a`, `iy` या `k` छूट जाए, तो हर परिणाम `NaN` होता है। दोनों में कोई त्रुटि नहीं आती। दोनों classes में एक `change(params)` method है जो दिए गए पैरामीटर सेट करता है, और दोनों उन्हें इन्हीं नामों की properties के रूप में रखती हैं।

## भार {#loads}

### `LoadCase` {#loadcase}

| Method | लौटाता है | मान |
| --- | --- | --- |
| `createNodalLoad(node, values, lcs?)` | `NodalLoad` | `{ [DofID.Dx]: N, [DofID.Dz]: N, [DofID.Ry]: N·m }`; `lcs` (डिफ़ॉल्ट `false`) `true`: नोड के घुमाए गए अक्षों में |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | `BeamElementUniformEdgeLoad` | पूरे सदस्य पर N/m |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | `BeamElementTrapezoidalEdgeLoad` | पहले और दूसरे नोड पर N/m, बीच में रैखिक |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | `BeamConcentratedLoad` | N, N, N·m, पहले नोड से `a` m पर |
| `createBeamTemperatureLoad(el, [dTc, dTb, dTt])` | `BeamTemperatureLoad` | K: केंद्रक, निचला तंतु, ऊपरी तंतु |
| `createPrescribedDisplacement(node, values)` | `PrescribedDisplacement` | `{ [DofID.Dz]: m, … }` सपोर्ट वाली DOF पर, नोड के अक्षों में; मुक्त DOF पर अनदेखा |

सदस्य भारों के लिए `lcs` `true` का अर्थ है स्थानीय अक्ष (x सदस्य के अनुदिश, z उसके आर-पार), और `false` वैश्विक अक्ष। रेखीय भार सदस्य की लंबाई के प्रति मीटर होते हैं। उदाहरण [नोडल और सदस्य भार](/hi/solver/loads) पृष्ठ पर हैं।

| Member | प्रकार | विवरण |
| --- | --- | --- |
| `label` | `string` | |
| `nodalLoadList` | `NodalLoad[]` | |
| `elementLoadList` | `BeamElementLoad[]` | सदस्य भार और तापीय भार |
| `prescribedBC` | `PrescribedDisplacement[]` | |
| `solved` | `boolean` | सफल हल के बाद `true` |
| `getElementLoadsOnElement(el)` | `BeamElementLoad[]` | एक सदस्य पर लगे भार |

भार objects अपने मान public properties में रखते हैं, जिन्हें दोबारा हल करने से पहले आप बदल सकते हैं: `NodalLoad`, `BeamElementUniformEdgeLoad`, `BeamConcentratedLoad` और `BeamTemperatureLoad` पर `values` (और `lcs`); `BeamElementTrapezoidalEdgeLoad` पर `startValues` और `endValues`; `PrescribedDisplacement` पर `prescribedValues`। हर एक का एक `target` होता है, वह लेबल जिस पर वह लगता है।

## DofID {#dofid}

| नाम | मान | `Beam2D` उपयोग करता है |
| --- | --- | --- |
| `Dx` | 0 | हाँ |
| `Dy` | 1 | नहीं |
| `Dz` | 2 | हाँ |
| `Rx` | 3 | नहीं |
| `Ry` | 4 | हाँ |
| `Rz` | 5 | नहीं |

## परिणाम {#results}

परिणाम `Beam2D` से (आंतरिक बल, विक्षेप, सिरा-बल) और `Node` से (विस्थापन, प्रतिक्रियाएँ) पढ़े जाते हैं, हमेशा किसी दिए गए `LoadCase` के लिए, `solve()` के बाद: ऊपर की दोनों तालिकाएँ देखें, और उदाहरणों और चिह्नों के लिए [परिणाम पढ़ना](/hi/solver/results)। संक्षेप में:

| क्या चाहिए | कॉल |
| --- | --- |
| प्रतिक्रियाएँ, N और N·m | `node.getReactions(lc)` |
| विस्थापन, m, और घूर्णन, rad | `node.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])` |
| किसी बिंदु पर N, V या M, N और N·m | `beam.computeNormalForceAt(lc, x)`, `computeShearForceAt`, `computeBendingMomentAt` |
| सदस्य के अनुदिश N, V या M | `beam.computeNormalForce(lc, n)`, `computeShearForce`, `computeBendingMoment` |
| विरूपित आकार, m | `beam.computeLocalDefl(lc, n)`, `computeGlobalDefl` |
| सिरा-बल, N और N·m | `beam.computeEndForces(lc)` |
| इन सबका चित्र | [@edubeam/plot](/hi/solver/drawing) का `StructurePlot` या `structureSvg` |
