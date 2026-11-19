---
title: API ของคอมโพเนนต์
description: "props และอีเวนต์ทั้งหมดของ StructurePlot และ DiagramStack ใน @edubeam/plot 0.2.0 พร้อมชนิดและค่าเริ่มต้น ปลั๊กอิน EduBeamPlot และ type ของ props ที่ export"
order: 8
group: เอกสารอ้างอิง API
source: site
---

# API ของคอมโพเนนต์

props และอีเวนต์ของคอมโพเนนต์ทั้งสอง ตามที่ประกาศไว้ใน @edubeam/plot 0.2.0 ทั้งสองไม่มีสล็อต ค่าที่ใช้หน่วย SI มีระบุกำกับไว้ ส่วนขนาดเป็นพิกเซล CSS

## StructurePlot {#structureplot}

```ts
import { StructurePlot } from '@edubeam/plot'
```

วาดโครงสร้างในระนาบและผลลัพธ์ คู่มือ: [StructurePlot](/th/plot/structure-plot)

### Props {#props}

| Prop | ชนิด | ค่าเริ่มต้น | คำอธิบาย |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | ตัวคำนวณของ @edubeam/fem ภาพจะวาดผลลัพธ์เมื่อกรณีแรงกระทำคำนวณแล้ว |
| `model` | `PlotModel` | – | หรือข้อมูลธรรมดาที่ [`modelFromSolver`](/th/plot/model) สร้าง ถ้าส่งมาทั้งคู่ จะใช้ค่านี้แทน `solver` |
| `loadCase` | `number` | `0` | ดัชนีใน `solver.loadCases` |
| `revision` | `number` | `0` | เปลี่ยนค่านี้เพื่อวาดใหม่เมื่อแก้ตัวคำนวณตัวเดิมโดยตรง |
| `layers` | `readonly PlotLayer[]` | members, supports, loads, reactions and one result | สิ่งที่จะวาด: `'nodes'`, `'nodeLabels'`, `'dimensions'`, `'members'`, `'supports'`, `'loads'`, `'reactions'`, `'N'`, `'V'`, `'M'`, `'w'` |
| `reserve` | `readonly PlotLayer[]` | `layers` | เลเยอร์ที่ต้องเว้นที่ไว้ขณะซ่อนอยู่ |
| `compact` | `boolean` | `false` | วาดแบบภาพย่อ: สัญลักษณ์เล็กลง ไม่เกินสองค่าต่อชิ้นส่วน |
| `units` | `Partial<Units>` | `KN_UNITS` | หน่วยที่แสดงผล |
| `numberFormat` | `Intl.NumberFormat` | English, at most 1 decimal | รูปแบบของตัวเลขทุกตัว |
| `colors` | `Partial<PlotColors>` | – | สีที่ใช้แทนตามโทน: [ธีมและสี](/th/plot/theming#the-colors-prop) |
| `width` | `number` | `640`, compact `400` | ความกว้างก่อนวัดกล่องได้ เช่น บนเซิร์ฟเวอร์ |
| `height` | `number` | – | ความสูงคงที่ ถ้าไม่ระบุ ความสูงจะเป็นไปตามภาพที่วาด |
| `maxHeight` | `number` | `max(320, 0.75 × width)`, compact none | ขีดจำกัดบนของความสูงอัตโนมัติ |
| `padding` | `number` | `6` | ระยะว่างรอบภาพ |
| `fontSize` | `number` | `13`, compact `11.5` | ขนาดตัวอักษร |
| `diagramSize` | `number` | `48`, compact `26` | ความยาวของออร์ดิเนตที่ยาวที่สุดในแผนภาพ |
| `deformedSize` | `number` | `30`, compact `18` | การกระจัดที่มากที่สุดบนรูปร่างที่เสียรูป |
| `diagramScale` | `Partial<Record<ResultLayer, number>>` | – | มาตราส่วนคงที่เป็น px ต่อหน่วย SI ของผลลัพธ์ ใช้แทน `diagramSize` หรือ `deformedSize` |
| `momentOnTensionSide` | `boolean` | `true` | M อยู่ทางด้านรับแรงดึง `false` คือด้านรับแรงอัด |
| `resultLabelMode` | `'horizontal' \| 'axis'` | `'horizontal'` | ค่าตั้งตรง หรือหมุนไปตามออร์ดิเนต |
| `reactionLabels` | `'values' \| 'names'` | `'values'` | แรงปฏิกิริยาตามที่กระทำจริงพร้อมขนาด หรือสำหรับโจทย์ ทุกทิศทางที่จุดรองรับยึดไว้จะมีชื่อ (*A<sub>x</sub>*, *M<sub>A</sub>*) และชี้ไปทางที่นับเป็นบวก ชื่อไม่ต้องอาศัยผลลัพธ์: [แรงปฏิกิริยาเป็นตัวไม่ทราบค่า](/th/plot/structure-plot#reactions-as-unknowns) |
| `reserveLabelModes` | `readonly ResultLabelMode[]` | – | รูปแบบป้ายค่าที่ต้องเว้นที่ไว้นอกจากแบบที่ใช้อยู่ |
| `reserveReactionLabels` | `readonly ReactionLabels[]` | – | รูปแบบป้ายแรงปฏิกิริยาที่ต้องเว้นที่ไว้นอกจาก `reactionLabels` โจทย์ที่เปลี่ยนเป็นเฉลยจึงคงภาพไว้กับที่ |
| `animate` | `boolean` | `true` | ให้เลเยอร์ค่อย ๆ ปรากฏและเส้นของชิ้นส่วนค่อย ๆ ลากออกมา ปิดเสมอภายใต้ `prefers-reduced-motion` |
| `hover` | `boolean` | `false` | อ่านค่าใต้ตัวชี้ และทำเครื่องหมายที่ปลายออร์ดิเนตของแต่ละแผนภาพ ถ้าปิด ภาพจะไม่รับ input จากตัวชี้เลย |
| `title` | `string` | a description of what is shown | ชื่อของภาพสำหรับการเข้าถึง (accessible name) |

ถ้าไม่ระบุ `layers` ผลลัพธ์ที่วาดคือ `M` สำหรับคานและโครงข้อแข็ง `N` สำหรับโครงถัก และ `w` เมื่อไม่มีชิ้นส่วนใดรับแรง (`defaultResultLayer`)

### อีเวนต์ {#events}

| อีเวนต์ | Payload | เมื่อใด |
| --- | --- | --- |
| `readout` | `Readout \| null` | เมื่อเปิด `hover`: จุดบนชิ้นส่วนที่อยู่ใต้ตัวชี้และผลลัพธ์ที่จุดนั้น เป็น `null` เมื่อตัวชี้ออกจากภาพ |

```ts
interface Readout {
  readonly member: string
  readonly x: number // m จากโหนดเริ่มต้นของชิ้นส่วน
  readonly px: number // จุดบนหน้าจอ, px
  readonly py: number
  readonly values: Readonly<Record<'N' | 'V' | 'M' | 'w', SidedValue>> // หน่วย SI
  readonly u: number // การกระจัดตามแกน x ท้องถิ่นของชิ้นส่วน, m
}
interface SidedValue {
  readonly left: number
  readonly right: number // เท่ากับ left ในตำแหน่งที่ผลลัพธ์ต่อเนื่อง
}
```

## DiagramStack {#diagramstack}

```ts
import { DiagramStack } from '@edubeam/plot'
```

วาดคานตรงเหนือแผนภาพบนแกน x เดียวกัน ชิ้นส่วนต้องเรียงเป็นเส้นตรงแนวนอนเส้นเดียว และวาดจากซ้ายไปขวา แบบอื่นทั้งหมดจะ throw ข้อผิดพลาด คู่มือ: [DiagramStack](/th/plot/diagram-stack)

### Props {#props-1}

| Prop | ชนิด | ค่าเริ่มต้น | คำอธิบาย |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | คานที่คำนวณแล้ว |
| `model` | `PlotModel` | – | หรือข้อมูลธรรมดาจาก `modelFromSolver` ถ้าส่งมาทั้งคู่ จะใช้ค่านี้ |
| `loadCase` | `number` | `0` | ดัชนีใน `solver.loadCases` |
| `revision` | `number` | `0` | เปลี่ยนค่านี้เพื่อวาดใหม่เมื่อแก้ตัวคำนวณตัวเดิมโดยตรง |
| `members` | `readonly string[]` | all members | ชิ้นส่วนที่ประกอบเป็นแนวคาน |
| `rows` | `readonly StackRow[]` | `['V', 'M', 'w']` | แถวแผนภาพจากบนลงล่าง เลือกจาก `'N'`, `'V'`, `'M'`, `'w'` |
| `loadRow` | `boolean` | `true` | คานพร้อมจุดรองรับ แรงกระทำ และแรงปฏิกิริยาเหนือแถวแผนภาพ |
| `ranges` | `Partial<Record<StackRow, readonly [number, number]>>` | each row's own | ช่วงค่าของแต่ละแถว หน่วย SI |
| `rowHeights` | `Partial<Record<StackRow, number>>` | N 100, V 116, M 128, w 76; below 560 px wide 88, 96, 104, 64 | ความสูงของแต่ละแถวก่อนที่ `maxHeight` จะย่อ |
| `maxHeight` | `number` | – | แถวหดลงได้ถึง 60 % เพื่อให้ภาพพอดี ขนาดตัวอักษรคงเดิม |
| `units` | `Partial<Units>` | `KN_UNITS` | หน่วยที่แสดงผล |
| `numberFormat` | `Intl.NumberFormat` | English, at most 1 decimal | รูปแบบของตัวเลขทุกตัว |
| `colors` | `Partial<PlotColors>` | – | สีที่ใช้แทน |
| `width` | `number` | `720` | ความกว้างก่อนวัดกล่องได้ ใช้อย่างน้อย 320 |
| `fontSize` | `number` | `12.5` | ขนาดตัวอักษร |
| `hover` | `boolean` | `true` | เส้นเคอร์เซอร์อ่านค่า ถ้าปิด ภาพจะไม่รับ input จากตัวชี้ |
| `loadAt` | `number` | – | ตำแหน่ง (m ตามแนวคาน) ของแรงกระทำเป็นจุดที่ผู้อ่านลากได้ ใช้กับ `v-model:load-at` |
| `loadLabel` | `string` | `P = …` with the load's magnitude | ข้อความข้างแรงกระทำที่ลากได้ |
| `loadStep` | `number` | `0.05` | ระยะที่ใช้ปัดตำแหน่งขณะลาก, m และเป็นระยะที่ปุ่มลูกศรเลื่อนแต่ละครั้ง |
| `title` | `string` | a description of the rows | ชื่อของภาพสำหรับการเข้าถึง |

### อีเวนต์ {#events-1}

| อีเวนต์ | Payload | เมื่อใด |
| --- | --- | --- |
| `update:loadAt` | `number` | ผู้อ่านเลื่อนแรงกระทำ: ตำแหน่งใหม่, m เป็นกลไกเบื้องหลัง `v-model:load-at` |
| `readout` | `StackReadout \| null` | ค่าของเส้นเคอร์เซอร์ในทุกแถว เป็น `null` เมื่อตัวชี้ออกจากภาพ |

```ts
interface StackReadout {
  readonly x: number // m ตามแนวคาน
  readonly values: Partial<Record<'N' | 'V' | 'M' | 'w', { readonly left: number; readonly right: number }>> // SI
}
```

## ปลั๊กอิน {#the-plugin}

```ts
import { EduBeamPlot } from '@edubeam/plot'

app.use(EduBeamPlot) // ลงทะเบียน <StructurePlot> และ <DiagramStack> แบบ global
```

ปลั๊กอินเป็นตัวเลือก การ import คอมโพเนนต์ตามชื่อทำให้เบากว่า และ bundler จะตัดปลั๊กอินออกจาก build ที่ไม่ได้ใช้

## Type {#types}

สำหรับ wrapper ที่มี type ครอบคอมโพเนนต์ แพ็กเกจ export props และอีเวนต์ของคอมโพเนนต์ไว้

```ts
import type { PlotLayer, StructurePlotProps } from '@edubeam/plot'

const figure: StructurePlotProps = { layers: ['members', 'supports', 'M'] satisfies PlotLayer[], compact: true }
```

| Type | ความหมาย |
| --- | --- |
| `StructurePlotProps`, `StructurePlotEmits` | props และอีเวนต์ของ `StructurePlot` |
| `DiagramStackProps`, `DiagramStackEmits` | props และอีเวนต์ของ `DiagramStack` |
| `Readout`, `ReadoutQuantity`, `SidedValue`, `StackReadout` | payload ของอีเวนต์ |
| `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `StackRow` | ชื่อเลเยอร์ ผลลัพธ์ รูปแบบป้ายค่า รูปแบบป้ายแรงปฏิกิริยา และแถว |
| `Units`, `Unit`, `UnitKind` | หน่วยที่แสดงผล: `{ symbol, scale }` ของแต่ละชนิด |
| `PlotColors` | สีตามโทน |
| `PlotModel` | โมเดลข้อมูลธรรมดา: [โมเดลสำหรับวาดภาพ](/th/plot/model) |

export ที่เหลือ ซึ่งรวมถึง `structureSvg` สำหรับไฟล์ SVG และฟังก์ชันเบื้องหลังการวาด อยู่ในหน้า [ฟังก์ชัน](/th/plot/functions)
