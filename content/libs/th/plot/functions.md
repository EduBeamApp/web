---
title: ฟังก์ชัน
description: "ฟังก์ชัน ค่าคงที่ และ type ที่ @edubeam/plot 0.2.0 export นอกจากคอมโพเนนต์: structureSvg สำหรับไฟล์ SVG การอ่านผลลัพธ์แม่นตรง หน่วย แนวคาน และการจัดวางภาพเอง"
order: 10
source: site
---

# ฟังก์ชัน

ทุกอย่างที่คอมโพเนนต์วาดมาจากฟังก์ชันบริสุทธิ์ (pure function) ที่ไม่มี Vue อยู่ข้างใน ฟังก์ชันเหล่านี้เขียนภาพเป็นไฟล์ SVG อ่านผลลัพธ์แบบแม่นตรง เตรียมข้อมูลไว้ล่วงหน้า และสร้างภาพแบบของคุณเอง การ import ตามชื่อทำให้ bundle เล็ก หน้าที่ import เฉพาะ `modelFromSolver` จะไม่มีโค้ดของคอมโพเนนต์ติดมาเลย

ทุกค่าใช้หน่วย SI เว้นแต่จะระบุหน่วยไว้ ตำแหน่งตามชิ้นส่วนเป็นเมตรจากโหนดเริ่มต้น

## ไฟล์ SVG แบบ standalone {#a-standalone-svg-file}

ภาพในหน้าเว็บรับสีจาก CSS custom properties ของหน้า ถ้าคัดลอก `<svg>` ออกมา สีจะไม่ติดมาด้วย `structureSvg` จึงเขียนภาพเป็นข้อความของไฟล์ `.svg` แบบ standalone แทน โดยกำหนดสีไว้ตายตัว ไม่มี stylesheet ไม่มีสคริปต์ และจัดวางด้วยรูทีนเดียวกับ `StructurePlot` Word, PowerPoint, Inkscape, CairoSVG และเครื่องมือของ LaTeX วาดภาพออกมาเหมือนในหน้าเว็บ

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts' // () => LinearStaticSolver ที่คำนวณแล้ว แบบในหน้าสไลด์

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![โครงข้อแข็งพอร์ทัลเป็นไฟล์ SVG แบบ standalone ที่เรนเดอร์ด้วย CairoSVG: แรงกระทำ แรงปฏิกิริยา 20 และ 40 ชี้ขึ้น และ 2.3 และ 12.7 ในแนวนอน และโมเมนต์ดัดตั้งแต่ −50.7 ที่ C ถึง 29.3 ในคาน](/screenshots/th/p2p-plot-frame-svg.webp){.shot-lg}

| ตัวเลือก | ค่าเริ่มต้น | หน้าที่ |
| --- | --- | --- |
| `layers` | members, supports, loads, reactions and the result `StructurePlot` would pick | สิ่งที่จะวาด |
| `width` | `640` | ความกว้างเป็น px ซึ่งเป็น user unit ของ SVG |
| `height` | follows the drawing | ความสูงคงที่, px |
| `maxHeight` | max(320, 0.75 × width) | ขีดจำกัดบนของความสูงอัตโนมัติ |
| `padding` | `6` | ระยะว่างรอบภาพ, px |
| `fontSize` | `13`, compact `11.5` | ขนาดตัวอักษร, px |
| `fontFamily` | `Helvetica, Arial, sans-serif` | รายการฟอนต์ (font stack) ที่โปรแกรมซึ่งเปิดไฟล์มีอยู่ |
| `colors` | `PRINT_COLORS` | สีของโทนใดก็ได้ เป็นสีตายตัว |
| `background` | `true` | ระบายพื้นหลังด้วยสี `paper` ถ้าเป็น `false` พื้นหลังจะโปร่งใส |
| `title` | none | เขียนเป็น `<title>` ของ SVG |
| `reserve`, `reserveLabelModes`, `reserveReactionLabels` | none | เลเยอร์ รูปแบบป้ายค่า และรูปแบบป้ายแรงปฏิกิริยาที่ต้องเว้นที่ไว้นอกจากที่วาด ไฟล์ของภาพที่ค่อย ๆ ประกอบขึ้นจึงวางตรงกัน: [ภาพที่ค่อย ๆ ประกอบขึ้นใน Beamer](/th/plot/slides#a-build-up-in-beamer) |
| `units`, `numberFormat`, `compact`, `diagramSize`, `deformedSize`, `momentOnTensionSide`, `resultLabelMode`, `reactionLabels` | as `StructurePlot` | ความหมายเดียวกับ props ของคอมโพเนนต์ |

`PRINT_COLORS` คือสีของแอป EduBeam บนพื้นขาว: หมึก `#16182b` แรงตามแนวแกน `#2222ff` แรงเฉือน `#00af00` โมเมนต์ดัด `#ff2222` แรงกระทำ `#ff8700` และแรงปฏิกิริยา `#a020f0` ป้ายทุกป้ายเขียนสองครั้ง คือขอบเรืองสีพื้นหลังอยู่ใต้ข้อความ เพราะโปรแกรม SVG บางตัวไม่เข้าใจ `paint-order` และตัวห้อย เช่น ในชื่อแรงปฏิกิริยา *A<sub>x</sub>* เป็น `tspan` ที่ใช้ตัวเลขธรรมดาซึ่ง Word และ Inkscape อ่านได้ ถ้าไม่ใส่ `reserve` ไฟล์จะปรับขนาดให้พอดีกับเลเยอร์ที่วาด

วิธีใช้ไฟล์

- **Word และ PowerPoint** (2019 และ Microsoft 365): *แทรก › รูปภาพ*
- **LaTeX**: แปลงเป็น PDF ด้วย [CairoSVG](https://cairosvg.org) (`cairosvg frame.svg -o frame.pdf`) หรือ Inkscape แล้วใช้ `\includegraphics` หรือใช้ `\includesvg` ของแพ็กเกจ `svg` ซึ่งเรียก Inkscape ให้เอง ภาพกว้าง 640 หน่วยที่ปรับให้กว้างเท่าคอลัมน์ข้อความ 16 cm จะมีป้ายขนาด 9 pt
- **หน้าเว็บที่ไม่มี Vue**: วางข้อความลงใน HTML ดู [ไม่ใช้ Vue](/th/plot/embedding#plain-html-from-node)

หน้า [โจทย์และข้อสอบ](/th/plot/exercises#figures-for-latex-and-word) เขียนไฟล์สำหรับโจทย์และเฉลยของนักศึกษาทุกคน

## จากตัวคำนวณ {#from-a-solver}

| Export | Signature | หน้าที่ |
| --- | --- | --- |
| `modelFromSolver` | `(solver: Solver, options?: FromSolverOptions) => PlotModel` | อ่านตัวคำนวณออกมาเป็น [โมเดลสำหรับวาดภาพ](/th/plot/model) ที่เป็นข้อมูลธรรมดา มีผลลัพธ์เฉพาะเมื่อกรณีแรงกระทำคำนวณแล้ว |
| `FromSolverOptions` | type | `{ loadCase?: number }` ดัชนีใน `solver.loadCases` |

## พหุนามแบบแบ่งช่วง {#piecewise-polynomials}

ผลลัพธ์ของชิ้นส่วนเป็นค่า `Piecewise` คือรายการของช่วงย่อย `{ x0, x1, c }` ตามที่อธิบายไว้ใน [โมเดลสำหรับวาดภาพ](/th/plot/model#piecewise-polynomials) `side` เลือกค่าก่อนถึงจุดที่ช่วงย่อยสองช่วงมาบรรจบกันเล็กน้อย (`'left'`) หรือเลยจุดนั้นไปเล็กน้อย (`'right'` ค่าเริ่มต้น)

| Export | Signature | หน้าที่ |
| --- | --- | --- |
| `valueAt` | `(pw, x, side?) => number` | ค่าที่ `x` ถ้าเลยปลาย จะได้ค่าที่ปลายซึ่งใกล้ที่สุด |
| `slopeAt` | `(pw, x, side?) => number` | อนุพันธ์ หน่วยของค่าต่อเมตร |
| `extremes` | `(pw) => { max: Extreme; min: Extreme } \| null` | ค่ามากที่สุดและน้อยที่สุดแบบแม่นตรง แต่ละตัวเป็น `{ x, value, side }` |
| `maxAbs` | `(pw) => number` | ค่าสัมบูรณ์ที่มากที่สุด |
| `innerBreaks` | `(pw) => number[]` | ตำแหน่งที่ช่วงย่อยมาบรรจบกัน ไม่รวมปลายทั้งสอง |
| `isZero` | `(pw) => boolean` | ผลลัพธ์เป็นศูนย์ตลอดทั้งชิ้นส่วนหรือไม่ |
| `evalPiece` | `(piece, x) => number` | ค่าของช่วงย่อยหนึ่งช่วง |
| `evalPieceSlope` | `(piece, x) => number` | ความชันของช่วงย่อยหนึ่งช่วง |
| `pieceExtrema` | `(piece) => number[]` | ตำแหน่งที่ความชันของช่วงย่อยเป็นศูนย์, m |
| `pieceDegree` | `(piece) => number \| null` | ดีกรีของช่วงย่อย เป็น `null` เมื่อช่วงย่อยเป็นศูนย์ |
| `cleanPiecewise` | `(pw, tolerance) => Piecewise` | ตัดสัมประสิทธิ์ที่เล็กกว่า `tolerance` ซึ่งเป็นเศษจากการปัดเลขของโมเดลที่คำนวณแล้ว |
| `fitPiece` | `(f, x0, x1, degree) => Piece` | พหุนามดีกรี `degree` ที่ประมาณฟังก์ชัน `f` บนช่วง `(x0, x1)` |
| `pieceToBeziers` | `(piece, segments?) => CubicSegment[]` | ช่วงย่อยเป็นเส้นโค้ง Bézier กำลังสามใน (x, ค่า): แม่นตรงถึงดีกรีสาม ถ้าสูงกว่านั้นใช้ `segments` เส้น ค่าเริ่มต้น 4 |

Type: `Piece`, `Piecewise`, `Side` (`'left' \| 'right'`), `Extreme`, `CubicSegment`

## หน่วยและตัวเลข {#units-and-numbers}

| Export | Signature | หน้าที่ |
| --- | --- | --- |
| `KN_UNITS` | `Units` | kN, kNm, kN/m, m, mm, mrad, K: ค่าเริ่มต้น |
| `SI_UNITS` | `Units` | N, N·m, N/m, m, m, rad, K |
| `resolveUnits` | `(units?: Partial<Units>) => Units` | `KN_UNITS` ที่แทนที่ด้วยค่าที่คุณกำหนด |
| `DEFAULT_NUMBER_FORMAT` | `Intl.NumberFormat` | รูปแบบภาษาอังกฤษ ทศนิยมไม่เกินหนึ่งตำแหน่ง |
| `formatNumber` | `(value, format?) => string` | ตัวเลขที่มีเครื่องหมายลบจริง ไม่มีวันเป็น −0 |
| `formatQuantity` | `(si, unit, format?) => string` | `"36 kN"`: ค่า SI ในหน่วยที่กำหนด คั่นด้วยช่องว่างแคบแบบไม่ตัดบรรทัด |

`Unit` คือ `{ symbol, scale }` โดยค่าที่แสดง = ค่า SI × `scale` `Units` มีหน่วยหนึ่งหน่วยสำหรับแต่ละ `UnitKind`: `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` และ `temperature`

```ts
import { formatQuantity, KN_UNITS } from '@edubeam/plot'

formatQuantity(-37500, KN_UNITS.moment) // "−37.5 kNm"
```

## การอ่านค่า {#reading-values}

| Export | Signature | หน้าที่ |
| --- | --- | --- |
| `readMember` | `(results: MemberResults, x, snap?) => { x, u, values }` | N, V, M และ w ที่ `x` แต่ละตัวเป็น `{ left, right }` และการกระจัดตามแนวแกน `u` สแนปไปยังตำแหน่งที่ค่ากระโดดถ้าอยู่ห่างไม่เกิน `snap` m |
| `readoutAt` | `(model, transform, px, py, reach) => Readout \| null` | ชิ้นส่วนที่ใกล้จุดบนหน้าจอที่สุดภายในระยะ `reach` px และผลลัพธ์ที่จุดนั้น |
| `readoutMarks` | `(model, transform, readout, shown, k, side) => ReadoutMark[]` | ตำแหน่งที่วาดค่าที่อ่านได้: ปลายออร์ดิเนตของแผนภาพที่แสดงอยู่แต่ละแผนภาพ (ทั้งสองปลายตรงตำแหน่งที่กระโดด) และจุดบนรูปร่างที่เสียรูป |
| `formatReadout` | `(readout, quantity, units, format?) => string` | `"M = 54 kNm"` หรือ `"V = 13.3 → −6.7 kN"` ตรงตำแหน่งที่กระโดด |

`k` คือ px ต่อหน่วย SI ของแต่ละผลลัพธ์ และ `side` คือด้านที่วาดแผนภาพแต่ละแผนภาพ ได้จาก `diagramScales` และ `diagramSide` ด้านล่าง Type: `Readout`, `ReadoutMark` (`{ tone, from, to }` เป็น px), `ReadoutQuantity` (`'N' \| 'V' \| 'M' \| 'w'`), `SidedValue`

## แนวคาน {#beam-lines}

ชิ้นส่วนประกอบของ [DiagramStack](/th/plot/diagram-stack) สำหรับสร้างภาพแผนภาพเรียงซ้อนของคุณเอง

| Export | Signature | หน้าที่ |
| --- | --- | --- |
| `beamLine` | `(model, ids?) => BeamLine` | ชิ้นส่วนที่เรียงเป็นเส้นแนวนอนเส้นเดียวจากซ้ายไปขวา แบบอื่นจะ throw ข้อผิดพลาด |
| `lineDiagram` | `(model, line, row) => Piecewise` | ผลลัพธ์หนึ่งอย่างตลอดแนวคาน ในพิกัด x ของแนวคาน |
| `rowRange` | `(pw) => [number, number]` | ช่วงค่าที่ใช้ปรับมาตราส่วนของแถว ซึ่งรวมศูนย์ไว้เสมอ |
| `rowPeaks` | `(pw) => RowPeak[]` | ค่าสุดขีดที่ควรเขียนกำกับในแถว |
| `rowBreaks` | `(pw) => number[]` | ตำแหน่งที่ผลลัพธ์หักมุมหรือกระโดด: จุดรองรับ จุดต่อ และแรงกระทำเป็นจุด |
| `rowOutline` | `(pw, sx, sy, close) => string` | path data ของ SVG สำหรับเส้นขอบของแถว โดยรับฟังก์ชันแปลง m และค่าเป็น px |
| `rowOrdinates` | `(pw, sx, sy, spacing) => string` | path data ของ SVG สำหรับเส้นออร์ดิเนตที่ใช้แรเงา ห่างกัน `spacing` px |
| `lineModel` | `(model, line, omit?) => PlotModel` | โมเดลที่ตัดเหลือเฉพาะแนวคาน และเลือกไม่รวมแรงกระทำหนึ่งตัวได้ |
| `pointLoadAt` | `(model, line, at) => PlotLoad \| undefined` | แรงกระทำเป็นจุดที่ตำแหน่ง `at` บนแนวคาน |

Type: `BeamLine`, `LineMember`, `RowPeak`, `StackRow`

หน้า [DiagramStack](/th/plot/diagram-stack#a-load-the-reader-can-drag) ใช้ `beamLine`, `lineDiagram` และ `rowRange` เพื่อคงมาตราส่วนของแต่ละแถวไว้ตลอดทุกตำแหน่งของแรงกระทำเคลื่อนที่

## รูปทรงและจุดรองรับ {#geometry-and-supports}

| Export | Signature | หน้าที่ |
| --- | --- | --- |
| `nodeMap` | `(model) => ReadonlyMap<string, PlotNode>` | โหนดตาม id |
| `memberFrame` | `(model, member, nodes?) => MemberFrame` | จุดเริ่ม เวกเตอร์หนึ่งหน่วยตามแนวชิ้นส่วน เวกเตอร์หนึ่งหน่วยตามแกน z ท้องถิ่น และความยาวของชิ้นส่วน |
| `memberFrames` | `(model) => Map<string, MemberFrame>` | ค่าเดียวกันของชิ้นส่วนทุกชิ้น ตาม id |
| `pointAlong` | `(frame, at) => { x, z }` | จุดที่ห่าง `at` เมตรตามชิ้นส่วน |
| `supportKind` | `(fixity) => SupportKind` | `'fixed'`, `'pin'`, `'roller'`, `'slider'`, `'rotation'` หรือ `'none'` |
| `supportPlacement` | `(model, node) => SupportPlacement` | สัญลักษณ์ของโหนดและมุมที่หมุนตามเข็มนาฬิกา, องศา |
| `supportGlyph` | `(kind) => readonly GlyphPart[]` | เส้นของสัญลักษณ์ เป็น px |
| `glyphReach` | `(kind, rotation, x, z) => number` | สัญลักษณ์ที่หมุนแล้วยื่นออกไปได้ไกลเท่าใดในทิศทางหนึ่ง, px |

## การวาด {#drawing}

การวาดมีสามขั้น `buildStructureScene` เปลี่ยนโมเดลเป็นรายการในฉาก (scene item) คือจุดของโมเดลพร้อมระยะเลื่อนเป็นพิกเซลบนหน้าจอ `fitScene` หามาตราส่วนและระยะเลื่อนที่ทำให้รายการทั้งหมดพอดีกับกล่อง `resolveScene` เปลี่ยนรายการเป็น path data ของ SVG วงกลม และป้ายที่มีที่ว่างพอ `layoutStructure` ทำทั้งสามขั้นแบบเดียวกับที่ `StructurePlot` และ `structureSvg` ทำ ภาพของคุณเองจึงจัดวางแบบเดียวกับของไลบรารี

| Export | Signature | หน้าที่ |
| --- | --- | --- |
| `layoutStructure` | `(model, options, box, shown?, labelModes?) => StructureLayout` | การจัดวางทั้งหมด: จัดให้พอดีโดยมีป้ายครบ ตัดป้ายที่แออัดออก แล้วจัดให้พอดีอีกครั้ง คืนค่า `{ fit, items, resolved }` |
| `structureSvg` | `(model, options?) => string` | ไฟล์ `.svg` แบบ standalone: [ข้างบน](#a-standalone-svg-file) |
| `buildStructureScene` | `(model, options: StructureSceneOptions) => SceneItem[]` | ภาพของเลเยอร์ที่เลือกที่มาตราส่วนหนึ่ง px ต่อเมตร |
| `fitScene` | `(items, box: FitBox) => Fit` | มาตราส่วนและระยะเลื่อนให้พอดีกับกล่อง `{ width, height?, maxHeight?, padding, fontSize }` |
| `resolveScene` | `(items, transform, options: ResolveOptions) => ResolvedScene` | `{ paths, circles, texts }` เป็น px พร้อมป้ายที่มีที่พอ |
| `placeLabels` | `(items, transform, options: ResolveOptions) => Map<SceneText, SceneText>` | ป้ายใดได้แสดง และวางไว้ที่ใด |
| `alternativeResultGroups` | `(shown) => ReadonlySet<string>` | เลเยอร์ผลลัพธ์ที่แสดงทีละอย่าง ซึ่งป้ายของเลเยอร์เหล่านี้หลีกทางให้ป้ายอื่น แต่ไม่หลีกทางให้กันเอง |
| `sceneBounds` | `(items, scale, fontSize) => Bounds` | ขอบเขตของฉาก, px |
| `project` | `(transform, anchor) => [number, number]` | จุดของฉากบนหน้าจอ, px |
| `defaultResultLayer` | `(model) => ResultLayer \| null` | ผลลัพธ์ที่ภาพแสดงเมื่อไม่ได้ระบุ |
| `diagramScales` | `(model, options) => Record<ResultLayer, number>` | px ต่อหน่วย SI ของแต่ละผลลัพธ์ |
| `diagramSide` | `(q, momentOnTensionSide) => 1 \| -1` | ด้านของชิ้นส่วนที่วาดค่าบวก |
| `isBarStructure` | `(model, memberResults) => boolean` | N เขียนเป็นตัวเลขตามชิ้นส่วน (โครงถัก) แทนการวาดเป็นแผนภาพหรือไม่ |
| `tipPlacements` | `(tip, out, mode, gaps?) => TextPlacement[]` | ตำแหน่งที่ค่าวางได้ถัดจากปลายออร์ดิเนต |
| `PLOT_LAYERS` | `readonly PlotLayer[]` | ทุกเลเยอร์ ตามลำดับการวาด |
| `RESULT_LAYERS` | `['N', 'V', 'M', 'w']` | เลเยอร์ผลลัพธ์ |
| `HATCH_SPACING_PX` | `7` | ระยะห่างของเส้นออร์ดิเนตในแผนภาพ, px |
| `DEFAULT_COLORS` | `PlotColors` | สีเริ่มต้นของแต่ละโทนในรูป CSS: [ธีมและสี](/th/plot/theming) |
| `PRINT_COLORS` | `Record<Tone \| 'paper', string>` | สีตายตัวสำหรับไฟล์ คือสีของแอปบนพื้นขาว |
| `toneVars` | `(colors?) => Record<string, string>` | custom properties ที่ภาพตั้งไว้ที่ element ราก |
| `PLOT_CSS` | `string` | กฎ CSS ที่ฝังอยู่ในภาพแต่ละภาพ |

`ResolveOptions` คือ `{ fontSize, viewport?, exclude?, alternativeGroups?, shields? }` โดย `shields` คือกลุ่มที่เส้นของกลุ่มกันป้ายไม่ให้ทับ (แผนภาพที่แสดงอยู่) ถ้าไม่ระบุจะเป็นทุกกลุ่ม สำหรับ `layoutStructure` ค่า `options.layers` คือเลเยอร์ที่ต้องจัดวาง (ทุกอย่างที่อาจแสดง เหมือน `reserve`) `shown` คือเลเยอร์ที่แสดงอยู่ และ `labelModes` คือรูปแบบป้ายค่าที่ต้องเว้นที่ไว้

Type: `StructureSceneOptions`, `StructureLayout`, `StructureSvgOptions`, `SceneItem`, `SceneText`, `TextPlacement`, `ResolvedScene`, `ResolvedPath`, `ResolvedText`, `ResolvedCircle`, `ResolveOptions`, `Bounds`, `Anchor`, `Transform`, `Fit`, `FitBox`, `Tone`, `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `SupportKind`, `SupportPlacement`, `GlyphPart` และ type ของโมเดลในหน้า [โมเดลสำหรับวาดภาพ](/th/plot/model)
