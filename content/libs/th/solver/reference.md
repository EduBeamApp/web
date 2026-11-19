---
title: เอกสารอ้างอิง API
description: "ทุกคลาส เมธอด และอาร์กิวเมนต์ของ @edubeam/fem 0.3 พร้อมหน่วย ค่าเริ่มต้น และรูปแบบของค่าที่แต่ละตัวคืน"
order: 16
group: เอกสารอ้างอิง API
source: site
---

# เอกสารอ้างอิง API {#api-reference}

สิ่งที่ `@edubeam/fem` 0.3 export จัดกลุ่มตามการใช้งาน ใช้หน่วย SI ทั้งหมด: m, N, N·m, N/m, Pa, K และ rad ชื่อ (`LabelType`) เป็น `string | number` และเก็บเป็นสตริง เมธอดที่ไม่อยู่ในหน้านี้เป็นเมธอดภายใน ที่เป็น public ใน TypeScript ก็เพียงเพราะคลาสของตัวคำนวณเองเรียกใช้

## สิ่งที่ export {#exports}

| Export | ประเภท | หัวข้อ |
| --- | --- | --- |
| `LinearStaticSolver` | คลาส | [การวิเคราะห์](#analyses) |
| `Solver` | คลาส abstract | [การวิเคราะห์](#analyses) |
| `Domain` | คลาส | [Domain](#domain) |
| `Node` | คลาส | [Node](#node) |
| `Beam2D`, `Element` | คลาส | [เอลิเมนต์](#elements) |
| `Material`, `CrossSection` | คลาส | [วัสดุและหน้าตัด](#materials-and-sections) |
| `LoadCase` | คลาส | [แรงกระทำ](#loads) |
| `NodalLoad`, `BeamConcentratedLoad`, `BeamElementUniformEdgeLoad`, `BeamElementTrapezoidalEdgeLoad`, `BeamTemperatureLoad`, `PrescribedDisplacement`, `Load`, `BeamElementLoad` | คลาส | [แรงกระทำ](#loads) |
| `DofID` | enum | [DofID](#dofid) |
| `LabelType`, `EnumDictionary`, `MaterialParameters`, `CrossSectionParameters` | type | |

## การวิเคราะห์ {#analyses}

### `LinearStaticSolver` {#linearstaticsolver}

```ts
const solver = new LinearStaticSolver()
```

| สมาชิก | ชนิด | คำอธิบาย |
| --- | --- | --- |
| `domain` | `Domain` | โมเดล |
| `loadCases` | `LoadCase[]` | เริ่มต้นด้วยหนึ่งกรณี `'DefaultLC'` เพิ่มกรณีด้วย `new LoadCase(label, solver.domain)`: [กรณีแรงกระทำ](/th/solver/load-cases) |
| `solve()` | `void` | กำหนดหมายเลขสมการถ้าจำเป็น แล้วประกอบและคำนวณทุกกรณีแรงกระทำ อาจ throw เมื่อเป็น [กลไก](/th/solver/solving#when-solving-fails) แต่ไม่เสมอไป ไม่พิมพ์อะไรตั้งแต่ 0.3.1 ส่วน 0.3.0 พิมพ์เวลาที่ใช้ |
| `codeNumberGenerated` | `boolean` | ตั้งเป็น `false` หลังเพิ่มหรือลบโหนดหรือชิ้นส่วน หรือเปลี่ยนจุดรองรับ: [เหตุผล](/th/solver/solving#solving-again-after-a-change) |
| `neq`, `pneq` | `number` | จำนวน DOF อิสระและจำนวน DOF ที่ยึดไว้ หลังคำนวณ |
| `k` | mathjs `Matrix` | เมทริกซ์ความแข็งรวมที่ประกอบแล้ว หลังคำนวณ |
| `getNodeDofIDs(label)` | `number[]` | DOF ที่โหนดมี หลังคำนวณ |

`EigenValueDynamicSolver` มีอยู่ในซอร์สโค้ดแต่ไม่ได้ export

## Domain {#domain}

`solver.domain` เก็บโมเดลไว้ใน `Map` สี่ตัวที่ใช้ชื่อในรูปสตริงเป็นคีย์: `nodes`, `elements`, `materials`, `crossSections` ไม่มีเมธอดสำหรับลบ ใช้ `domain.nodes.delete(label)` และ `domain.elements.delete(label)` เพื่อลบโหนดหรือชิ้นส่วน แล้วตามด้วย [การกำหนดหมายเลขใหม่](/th/solver/solving#solving-again-after-a-change)

| เมธอด | คืนค่า | คำอธิบาย |
| --- | --- | --- |
| `createNode(label, coords?, bcs?)` | `Node` | `coords` คือ `[x, y, z]` หน่วย m (ค่าเริ่มต้น `[0, 0, 0]`) `bcs` คือ `DofID` ที่ยึดไว้ (ค่าเริ่มต้นไม่มี) |
| `createBeam2D(label, nodes, mat, cs, hinges?)` | `Beam2D` | `nodes` คือ `[first, second]` และ `hinges` คือ `[atFirst, atSecond]` (ค่าเริ่มต้น `[false, false]`) |
| `createMaterial(label, params?)` | `Material` | ดู [วัสดุและหน้าตัด](#materials-and-sections) |
| `createCrossSection(label, params?)` | `CrossSection` | ดู [วัสดุและหน้าตัด](#materials-and-sections) |
| `getNode(label)`, `getElement(label)`, `getMaterial(label)`, `getCS(label)` | ออบเจกต์นั้น | throw `RangeError` เมื่อไม่รู้จักชื่อ `getElement` คืนชนิด `Element`: เขียน `as Beam2D` เพื่ออ่านผลลัพธ์ |

การสร้างออบเจกต์ด้วยชื่อที่มีอยู่แล้วจะแทนที่ออบเจกต์เดิม

## Node {#node}

| สมาชิก | ชนิด | คำอธิบาย |
| --- | --- | --- |
| `label` | `string` | |
| `coords` | `number[]` | `[x, y, z]` หน่วย m เปลี่ยนค่านี้เพื่อย้ายโหนด |
| `bcs` | `Set<DofID>` | DOF ที่ยึดไว้ แทนที่ค่านี้เพื่อเปลี่ยนจุดรองรับ |
| `lcs` | `number[][] \| undefined` | แกนที่หมุนแล้วของโหนด ถ้ามี |
| `updateLcs({ locx, locy }?)` | `void` | หมุนแกนของโหนด: `locx` คือแกน x ของโหนดเป็นองค์ประกอบในแกนรวม `locy` คือ `[0, 1, 0]` ถ้าไม่ใส่อาร์กิวเมนต์จะรีเซ็ตแกน |
| `hasLcs()` | `boolean` | แกนของโหนดหมุนอยู่หรือไม่ |
| `getUnknowns(lc, dofs)` | `Matrix` หรือ `number` เมื่อขอ DOF เดียว | การกระจัด (m) และการหมุน (rad) ในแกนของโหนด |
| `getReactions(lc, global?)` | `{ dofs, values }` | แรงปฏิกิริยาที่ DOF ที่ยึดไว้ ตามลำดับใน `bcs` หน่วย N, N·m `values` เป็น `Matrix` ของ mathjs เมื่อมีหลายค่า เป็นอาร์เรย์หนึ่งสมาชิกเมื่อมีค่าเดียว และเป็น `[]` สำหรับโหนดอิสระ ถ้า `global` เป็น `true` บนโหนดที่หมุนแกน: ได้ครบทั้งสาม DOF ในแกนรวม `dofs` เป็น `[0, 2, 4]` และ `values` เป็นอาร์เรย์ที่มี 0 ที่ DOF ที่ไม่ได้ยึด [การอ่านแรงปฏิกิริยา](/th/solver/results#reactions) |

## เอลิเมนต์ {#elements}

### `Beam2D` {#beam2d}

คาน Timoshenko สองโหนดในระนาบ x–z มีสาม DOF ต่อโหนด (`Dx`, `Dz`, `Ry`) `x` เป็นเมตรจากโหนดแรก ส่วน `n` คือจำนวนช่วงย่อย ซึ่งให้ n + 1 จุด

| สมาชิก | คืนค่า | คำอธิบาย |
| --- | --- | --- |
| `label`, `nodes`, `mat`, `cs` | `string`, `string[]`, `string`, `string` | |
| `hinges` | `[boolean, boolean]` | การปลดโมเมนต์ที่โหนดแรกและโหนดที่สอง |
| `computeNormalForceAt(lc, x)` | `number` | N แรงดึงเป็นบวก |
| `computeShearForceAt(lc, x)` | `number` | V เป็นบวกเมื่อ M เพิ่มขึ้นตามแกน x ท้องถิ่น |
| `computeBendingMomentAt(lc, x)` | `number` | M เป็นบวกเมื่อด้าน +z ท้องถิ่นรับแรงดึง |
| `computeNormalForce(lc, n)` | `{ x, N }` | N ที่ n + 1 จุด |
| `computeShearForce(lc, n)` | `{ x, V }` | V ที่ n + 1 จุด |
| `computeBendingMoment(lc, n)` | `{ x, M }` | M ที่ n + 1 จุด |
| `computeLocalDefl(lc, n)` | `{ u, w }` | การกระจัดตามแนวและตั้งฉากกับชิ้นส่วน ในแกนท้องถิ่น หน่วย m |
| `computeGlobalDefl(lc, n)` | `{ u, w }` | ค่าเดียวกันในแกน x และ z รวม |
| `computeEndForces(lc)` | `Matrix` | `[X12, Z12, M12, X21, Z21, M21]` แรงที่โหนดกระทำต่อชิ้นส่วน ในแกนท้องถิ่น |
| `computeEndDisplacement(lc)` | `Matrix` | การกระจัดที่ปลายในแกนท้องถิ่น รวมการหมุนที่จุดหมุน |
| `computeGeo()` | `{ l, dx, dz }` | ความยาวและภาพฉาย หน่วย m |
| `computeT()` | `Matrix` | เมทริกซ์การแปลง 6 × 6 จากแกนรวมเป็นแกนท้องถิ่น |
| `computeLocalStiffnessMtrx()` | `{ answer }` | `answer`: เมทริกซ์ความแข็ง 6 × 6 ในแกนท้องถิ่น หลังลดรูปแบบสถิต (static condensation) ที่จุดหมุนแล้ว |
| `computeStiffness()` | `Matrix` | เมทริกซ์ความแข็ง 6 × 6 ในแกนรวม |
| `computeShearFactor()` | `number` | $\Phi = 12EI_y/kGAL^2$ |
| `getMaterial()`, `getCS()` | `Material`, `CrossSection` | |

ที่ตำแหน่งแรงกระทำเป็นจุด เมธอด `…At` คืนค่าที่อยู่ถัดจากแรงไปเล็กน้อย `Element` เป็นคลาสฐานแบบ abstract ของ `Beam2D` และเป็นชนิดที่ `domain.elements` และ `getElement` ใช้

## วัสดุและหน้าตัด {#materials-and-sections}

| `MaterialParameters` | หน่วย | ค่าเริ่มต้น | ใช้สำหรับ |
| --- | --- | --- | --- |
| `e` | Pa | 1 | ความแข็งเกร็ง |
| `g` | Pa | 1 | ความแข็งเกร็งต่อแรงเฉือน |
| `alpha` | 1/K | 1 | แรงกระทำเนื่องจากอุณหภูมิ |
| `d` | kg/m³ | 1 | ไม่ใช้ในการวิเคราะห์สถิต |

| `CrossSectionParameters` | หน่วย | ค่าเริ่มต้น | ใช้สำหรับ |
| --- | --- | --- | --- |
| `a` | m² | ไม่มี ต้องระบุ | ความแข็งเกร็งตามแนวแกนและต่อแรงเฉือน |
| `iy` | m⁴ | ไม่มี ต้องระบุ | ความแข็งเกร็งต่อการดัด |
| `k` | – | ไม่มี ต้องระบุ | ความแข็งเกร็งต่อแรงเฉือน $kGA$ ใช้ `1e32` เพื่อตัดการเสียรูปเนื่องจากแรงเฉือน |
| `h` | m | ไม่มี | ผลต่างอุณหภูมิ (ถ้าไม่มีจะได้ `NaN`) |
| `iz`, `dyz`, `j` | m⁴ | ไม่มี | `Beam2D` ไม่ใช้ |

พารามิเตอร์ของวัสดุที่ขาดไปมีค่าเป็น 1 ไม่ใช่ค่าทั่วไปของวัสดุ ส่วนการขาด `a`, `iy` หรือ `k` ทำให้ผลลัพธ์ทุกค่าเป็น `NaN` ทั้งสองกรณีไม่ throw error ทั้งสองคลาสมีเมธอด `change(params)` ซึ่งกำหนดพารามิเตอร์ที่ส่งมา และเก็บพารามิเตอร์ไว้เป็น property ชื่อเดียวกัน

## แรงกระทำ {#loads}

### `LoadCase` {#loadcase}

| เมธอด | คืนค่า | ค่า |
| --- | --- | --- |
| `createNodalLoad(node, values, lcs?)` | `NodalLoad` | `{ [DofID.Dx]: N, [DofID.Dz]: N, [DofID.Ry]: N·m }` ส่วน `lcs` (ค่าเริ่มต้น `false`) ถ้าเป็น `true`: อยู่ในแกนที่หมุนแล้วของโหนด |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | `BeamElementUniformEdgeLoad` | N/m ตลอดทั้งชิ้นส่วน |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | `BeamElementTrapezoidalEdgeLoad` | N/m ที่โหนดแรกและโหนดที่สอง แปรผันเชิงเส้นระหว่างกัน |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | `BeamConcentratedLoad` | N, N, N·m ที่ระยะ `a` m จากโหนดแรก |
| `createBeamTemperatureLoad(el, [dTc, dTb, dTt])` | `BeamTemperatureLoad` | K: เซนทรอยด์ เส้นใยล่าง เส้นใยบน |
| `createPrescribedDisplacement(node, values)` | `PrescribedDisplacement` | `{ [DofID.Dz]: m, … }` บน DOF ที่ยึดไว้ ในแกนของโหนด ไม่มีผลบน DOF อิสระ |

สำหรับแรงกระทำบนชิ้นส่วน `lcs` เป็น `true` หมายถึงแกนท้องถิ่น (x ตามแนวชิ้นส่วน z ตั้งฉากกับชิ้นส่วน) และ `false` หมายถึงแกนรวม แรงแผ่กระจายเป็นค่าต่อเมตรของความยาวชิ้นส่วน ตัวอย่างอยู่ในหน้า [แรงกระทำที่โหนดและบนชิ้นส่วน](/th/solver/loads)

| สมาชิก | ชนิด | คำอธิบาย |
| --- | --- | --- |
| `label` | `string` | |
| `nodalLoadList` | `NodalLoad[]` | |
| `elementLoadList` | `BeamElementLoad[]` | แรงกระทำบนชิ้นส่วนและแรงกระทำเนื่องจากอุณหภูมิ |
| `prescribedBC` | `PrescribedDisplacement[]` | |
| `solved` | `boolean` | `true` หลังคำนวณสำเร็จ |
| `getElementLoadsOnElement(el)` | `BeamElementLoad[]` | แรงกระทำบนชิ้นส่วนหนึ่งชิ้น |

ออบเจกต์แรงกระทำเก็บค่าไว้ใน property แบบ public ซึ่งเปลี่ยนได้ก่อนคำนวณใหม่: `values` (และ `lcs`) บน `NodalLoad`, `BeamElementUniformEdgeLoad`, `BeamConcentratedLoad` และ `BeamTemperatureLoad` ส่วน `startValues` และ `endValues` อยู่บน `BeamElementTrapezoidalEdgeLoad` และ `prescribedValues` อยู่บน `PrescribedDisplacement` แต่ละตัวมี `target` คือชื่อของโหนดหรือชิ้นส่วนที่รับแรงกระทำนั้น

## DofID {#dofid}

| ชื่อ | ค่า | `Beam2D` ใช้หรือไม่ |
| --- | --- | --- |
| `Dx` | 0 | ใช้ |
| `Dy` | 1 | ไม่ใช้ |
| `Dz` | 2 | ใช้ |
| `Rx` | 3 | ไม่ใช้ |
| `Ry` | 4 | ใช้ |
| `Rz` | 5 | ไม่ใช้ |

## ผลลัพธ์ {#results}

ผลลัพธ์อ่านจาก `Beam2D` (แรงภายใน การโก่งตัว แรงปลาย) และจาก `Node` (การกระจัด แรงปฏิกิริยา) สำหรับ `LoadCase` ที่ระบุเสมอ หลัง `solve()` ดูสองตารางข้างต้น และดู [การอ่านผลลัพธ์](/th/solver/results) สำหรับตัวอย่างและเครื่องหมาย โดยสรุป:

| ต้องการ | เรียก |
| --- | --- |
| แรงปฏิกิริยา หน่วย N และ N·m | `node.getReactions(lc)` |
| การกระจัด (m) และการหมุน (rad) | `node.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])` |
| N, V หรือ M ที่จุดหนึ่ง หน่วย N และ N·m | `beam.computeNormalForceAt(lc, x)`, `computeShearForceAt`, `computeBendingMomentAt` |
| N, V หรือ M ตลอดชิ้นส่วน | `beam.computeNormalForce(lc, n)`, `computeShearForce`, `computeBendingMoment` |
| รูปร่างที่เสียรูป หน่วย m | `beam.computeLocalDefl(lc, n)`, `computeGlobalDefl` |
| แรงปลาย หน่วย N และ N·m | `beam.computeEndForces(lc)` |
| รูปของผลลัพธ์ทั้งหมด | `StructurePlot` หรือ `structureSvg` จาก [@edubeam/plot](/th/solver/drawing) |
