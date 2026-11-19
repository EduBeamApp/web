---
title: แรงกระทำที่โหนดและบนชิ้นส่วน
description: "ใส่แรงและโมเมนต์ที่โหนด และแรงแผ่กระจายสม่ำเสมอ รูปสี่เหลี่ยมคางหมู และแรงกระทำเป็นจุดบนชิ้นส่วน ในแกนรวมหรือแกนท้องถิ่นด้วย @edubeam/fem แล้วแก้ไขหรือลบออก"
order: 6
group: แรงกระทำ
source: site
---

# แรงกระทำที่โหนดและบนชิ้นส่วน {#nodal-and-member-loads}

แรงกระทำอยู่ในกรณีแรงกระทำ ตัวคำนวณเริ่มต้นด้วยหนึ่งกรณีคือ `solver.loadCases[0]` และเมธอด `create…` แต่ละตัวของกรณีนั้นจะเพิ่มแรงกระทำแล้วคืนแรงกระทำนั้นกลับมา ถ้ามีหลายกรณีและต้องการจัดหมู่ ดู [กรณีแรงกระทำ](/th/solver/load-cases)

ค่าเป็น N, N/m และ N·m และเป็นไปตาม [แกน](/th/solver/conventions#axes): +z ชี้ลง และโมเมนต์บวกทวนเข็มนาฬิกา

## คานที่รับแรงกระทำทุกแบบ {#a-beam-with-every-kind}

คานยาว 8 m บนจุดรองรับแบบหมุดและแบบล้อเลื่อน รับแรงแผ่กระจายที่เพิ่มจาก 4 เป็น 10 kN/m แรงกระทำเป็นจุด 20 kN โมเมนต์แบบจุด 10 kNm และแรงแนวนอนที่ล้อเลื่อน:

```ts [loads.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // จุดรองรับแบบหมุด
domain.createNode('B', [8, 0, 0], [DofID.Dz]) // จุดรองรับแบบล้อเลื่อน
domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
// 4 kN/m ที่ A เพิ่มเป็น 10 kN/m ที่ B ทิศลง
lc.createBeamElementTrapezoidalEdgeLoad(1, [0, 4e3], [0, 10e3], false)
// [fx, fz, my, a]: 20 kN ทิศลง ห่างจาก A 2 m
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], false)
// โมเมนต์แบบจุด 10 kNm ทวนเข็มนาฬิกา ห่างจาก A 6 m
lc.createBeamConcentratedLoad(1, [0, 0, 10e3, 6], false)
// 5 kN ไปทางขวาที่ B
lc.createNodalLoad('B', { [DofID.Dx]: 5e3 })
solver.solve()

// getReactions คืน Matrix ของ mathjs หรืออาร์เรย์: แปลงให้เป็นอาร์เรย์
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

console.log(list(domain.getNode('A').getReactions(lc).values))
console.log(list(domain.getNode('B').getReactions(lc).values))
```

```text [เอาต์พุต]
[ -5000, -40250 ]
[ -35750 ]
```

ตรวจด้วยการคำนวณมือ: แรงแผ่กระจายรวม 56 kN กระทำห่างจาก A 4.571 m โมเมนต์รอบ A จึงให้ $8R_B = 56 \cdot 4.571 + 20 \cdot 2 - 10 = 286$ ได้ $R_B = 35.75$ kN ทิศขึ้น และ $R_A = 76 - 35.75 = 40.25$ kN ทิศขึ้น จุดรองรับแบบหมุดยังต้านแรง 5 kN ไว้ด้วย ทำให้คานทั้งชิ้นรับแรงดึง 5 kN

::model-figure{caption="แรงกระทำชุดเดียวกัน รูปนี้วางโมเมนต์แบบจุดไว้ที่โหนด C ที่ 6 m ซึ่งให้ผลลัพธ์เหมือนกัน"}
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

## แรงกระทำที่โหนด {#nodal-loads}

```ts
lc.createNodalLoad(node, { [DofID.Dx]: fx, [DofID.Dz]: fz, [DofID.Ry]: my }, lcs)
```

ระบุเฉพาะองค์ประกอบที่ต้องการ ค่าอยู่ในแกนรวม หรือถ้าตั้ง `lcs` เป็น `true` จะอยู่ในแกนของโหนดเอง สำหรับโหนดที่หมุนแกนด้วย [`updateLcs`](/th/solver/nodes-supports#inclined-supports) แรงที่กระทำตาม DOF ที่จุดรองรับยึดไว้จะส่งเข้าแรงปฏิกิริยาโดยตรงและไม่ทำให้ชิ้นส่วนใดดัด

## แรงกระทำบนชิ้นส่วน {#member-loads}

| เมธอด | ค่า | แรงกระทำ |
| --- | --- | --- |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | N/m | แผ่สม่ำเสมอตลอดทั้งชิ้นส่วน |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | N/m | แปรผันเชิงเส้นจากโหนดแรกถึงโหนดที่สอง |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | N, N·m, m | แรงและโมเมนต์แบบจุด ห่างจากโหนดแรก `a` เมตร |

แรงแผ่กระจายคลุมทั้งชิ้นส่วนเสมอ ถ้าแรงกระทำอยู่บนบางส่วนของช่วง ให้แบ่งชิ้นส่วนด้วยโหนดตรงจุดที่แรงเริ่ม โหนดที่เพิ่มเข้ามาไม่เปลี่ยนผลลัพธ์ใด ๆ แรงกระทำเป็นจุดหรือโมเมนต์แบบจุดวางที่ใดบนชิ้นส่วนก็ได้

### แกนรวมหรือแกนท้องถิ่น {#global-or-local-axes}

อาร์กิวเมนต์ตัวสุดท้าย `lcs` บอกว่าองค์ประกอบอยู่ในแกนใด:

- `false`: แกน x และ z ของระบบพิกัดรวม `fz` กระทำในแนวดิ่งไม่ว่าชิ้นส่วนจะเอียงเท่าใด
- `true`: แกน x ท้องถิ่น (ตามแนวชิ้นส่วน) และแกน z ท้องถิ่น (ตั้งฉากกับชิ้นส่วน) `fz` กระทำตั้งฉากกับชิ้นส่วน

บนชิ้นส่วนแนวนอนที่กำหนดจากซ้ายไปขวา ทั้งสองแบบเหมือนกัน ถ้ากำหนดจากขวาไปซ้าย `fz` ท้องถิ่นจะชี้ขึ้น

::callout{type="info" title="แรงแผ่กระจายเป็นค่าต่อเมตรของชิ้นส่วน"}
แรงแผ่กระจายทั้งสองแบบกระทำต่อเมตรของความยาวชิ้นส่วนเอง บนจันทันยาว 5 m ซึ่งมีระยะราบ 4 m ค่า `[0, 10e3]` ในแกนรวมจะรวมเป็นแรง 50 kN แรงกระทำจากหิมะ 10 kN/m ที่วัดต่อเมตรของภาพฉายแนวนอนเท่ากับ $10 \cdot 4/5 = 8$ kN/m ตามแนวจันทัน จึงใส่ `[0, 8e3]`
::

## แก้ไขหรือลบแรงกระทำ {#change-or-remove-a-load}

เมธอด `create…` ทุกตัวคืนแรงกระทำกลับมา เปลี่ยนค่าของแรงกระทำแล้วคำนวณใหม่:

```ts
const q = lc.createBeamElementUniformEdgeLoad(1, [0, 10e3], true)
solver.solve()
q.values = [0, 20e3] // แรงกระทำเป็นสองเท่า
solver.solve()
```

แรงกระทำเก็บอยู่ในอาร์เรย์ธรรมดา `lc.nodalLoadList` และ `lc.elementLoadList` (แรงกระทำบนชิ้นส่วนและแรงกระทำเนื่องจากอุณหภูมิ) ดังนั้น `lc.elementLoadList.splice(index, 1)` จะลบแรงกระทำหนึ่งรายการ ชื่อ property ของแรงกระทำแต่ละแบบอยู่ใน [เอกสารอ้างอิง API](/th/solver/reference#loads)

การเปลี่ยนแปลงอุณหภูมิและการทรุดตัวของจุดรองรับก็เป็นแรงกระทำเช่นกัน ดู [อุณหภูมิและการทรุดตัวของจุดรองรับ](/th/solver/temperature-settlements)
