---
title: โครงถัก
description: "โครงถัก Warren ที่จุดต่อเป็นจุดหมุนใน @edubeam/fem ตรวจแรงในชิ้นส่วนทุกชิ้นด้วยวิธีตัดหน้าตัด และลูปที่สร้างโครงถักกี่ช่องก็ได้"
order: 14
source: site
---

# โครงถัก {#trusses}

โครงถักประกอบด้วยชิ้นส่วนที่มีจุดหมุนทั้งสองปลายและรับแรงกระทำที่จุดต่อ ชิ้นส่วนทุกชิ้นจึงรับเฉพาะแรงตามแนวแกน ตัวอย่างนี้สร้างโครงถัก Warren จากรายการสองชุด ตรวจแรงในชิ้นส่วนทุกชิ้นด้วยการคำนวณมือ แล้วสร้างโครงถักขนาดใดก็ได้ในลูป

::model-figure{caption="โครงถัก Warren: ช่วง 9 m ลึก 1.8 m แรง 8 kN ที่จุดต่อบนทุกจุด"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members:
  - { nodes: [A, B], hinges: [true, true] }
  - { nodes: [B, C], hinges: [true, true] }
  - { nodes: [C, D], hinges: [true, true] }
  - { nodes: [E, F], hinges: [true, true] }
  - { nodes: [F, G], hinges: [true, true] }
  - { nodes: [A, E], hinges: [true, true] }
  - { nodes: [E, B], hinges: [true, true] }
  - { nodes: [B, F], hinges: [true, true] }
  - { nodes: [F, C], hinges: [true, true] }
  - { nodes: [C, G], hinges: [true, true] }
  - { nodes: [G, D], hinges: [true, true] }
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: [N, w]
show: [nodeLabels]
---
::

```ts [truss.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })

// โครงถัก Warren: ช่วง 9 m ลึก 1.8 m คอร์ดล่าง A-B-C-D คอร์ดบน E-F-G
const nodes: [string, number, number, DofID[]][] = [
  ['A', 0, 0, [DofID.Dx, DofID.Dz]],
  ['B', 3, 0, []],
  ['C', 6, 0, []],
  ['D', 9, 0, [DofID.Dz]],
  ['E', 1.5, -1.8, []],
  ['F', 4.5, -1.8, []],
  ['G', 7.5, -1.8, []],
]
for (const [label, x, z, support] of nodes) {
  domain.createNode(label, [x, 0, z], support)
}

// ชื่อของแต่ละชิ้นส่วนบอกโหนดทั้งสอง มีจุดหมุนทั้งสองปลาย: รับเฉพาะแรงตามแนวแกน
const bars = ['AB', 'BC', 'CD', 'EF', 'FG', 'AE', 'EB', 'BF', 'FC', 'CG', 'GD']
const members = bars.map((bar) =>
  domain.createBeam2D(bar, [bar[0], bar[1]], 1, 1, [true, true])
)

const lc = solver.loadCases[0]
for (const top of ['E', 'F', 'G']) {
  lc.createNodalLoad(top, { [DofID.Dz]: 8e3 }) // 8 kN ทิศลง
}
solver.solve()

for (const bar of members) {
  const n = bar.computeNormalForceAt(lc, 0) / 1e3
  console.log(bar.label, n.toFixed(2), n > 0 ? 'tension' : 'compression')
}
```

```text [เอาต์พุต]
AB 10.00 tension
BC 16.67 tension
CD 10.00 tension
EF -13.33 compression
FG -13.33 compression
AE -15.62 compression
EB 5.21 tension
BF -5.21 compression
FC -5.21 compression
CG 5.21 tension
GD -15.62 compression
```

แรงตามแนวแกนในชิ้นส่วนโครงถักคงที่ตลอดชิ้นส่วน อ่านที่ `x = 0` ก็พอ ชื่อสองตัวอักษรใช้เป็นคู่โหนดไปในตัว: `bar[0]` และ `bar[1]`

## ตรวจสอบด้วยการคำนวณมือ {#check-it-by-hand}

จุดรองรับแต่ละจุดรับครึ่งหนึ่งของ 24 kN คือ 12 kN ตัดโครงถักแล้วคิดโมเมนต์รอบจุดต่อที่อยู่ตรงข้ามกับชิ้นส่วนที่ตัด ตาม [วิธีตัดหน้าตัด](/th/tutorials/truss):

| ชิ้นส่วน | การตัด | แรง |
| --- | --- | --- |
| BC คอร์ดล่าง | โมเมนต์รอบ F: $(12 \cdot 4.5 - 8 \cdot 3)/1.8$ | 16.67 kN แรงดึง |
| EF คอร์ดบน | โมเมนต์รอบ B: $(12 \cdot 3 - 8 \cdot 1.5)/1.8$ | 13.33 kN แรงอัด |
| AE ชิ้นส่วนทแยงที่ปลาย | จุดต่อ A: $12 \cdot \sqrt{1.5^2 + 1.8^2}/1.8$ | 15.62 kN แรงอัด |
| EB ชิ้นส่วนทแยง | แรงเฉือนในช่อง $12 - 8 = 4$ kN: $4 \cdot 2.343/1.8$ | 5.21 kN แรงดึง |

หน้าตัดไม่เปลี่ยนแรงในชิ้นส่วนของโครงถักดีเทอร์มิเนท มีผลเพียงว่าจุดต่อเคลื่อนที่มากน้อยเท่าใด รูปด้านบนใช้หน้าตัดอีกแบบคือหน้าตัดของแอป EduBeam และให้แรงเท่ากัน

## กี่ช่องก็ได้ {#any-number-of-panels}

ถ้าต้องการสร้างโครงถักหลายแบบสำหรับโจทย์หรือการศึกษาผลของพารามิเตอร์ ให้สร้างจุดต่อและชิ้นส่วนในลูปทีละช่อง เมื่อ `panels = 3` จะได้โครงถักข้างต้นและพิมพ์แรงชุดเดียวกัน เปลี่ยน `panels`, `w` และ `h` เพื่อได้โครงถักแบบอื่น

```ts [warren.ts]
import { type Beam2D, DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })
const lc = solver.loadCases[0]

const panels = 3 // จำนวนช่องของคอร์ดล่าง
const w = 3 // ความกว้างช่อง หน่วย m
const h = 1.8 // ความลึก หน่วย m

// จุดต่อล่าง b0, b1, … บนจุดรองรับแบบหมุดและล้อเลื่อน จุดต่อบน t0, t1, … อยู่ระหว่างกลาง
for (let i = 0; i <= panels; i++) {
  const ends = i === 0 ? [DofID.Dx, DofID.Dz] : i === panels ? [DofID.Dz] : []
  domain.createNode(`b${i}`, [i * w, 0, 0], ends)
}
for (let i = 0; i < panels; i++) {
  domain.createNode(`t${i}`, [(i + 0.5) * w, 0, -h])
  lc.createNodalLoad(`t${i}`, { [DofID.Dz]: 8e3 })
}

const members: Beam2D[] = []
const bar = (a: string, b: string) =>
  members.push(domain.createBeam2D(`${a}-${b}`, [a, b], 1, 1, [true, true]))
for (let i = 0; i < panels; i++) {
  bar(`b${i}`, `b${i + 1}`) // คอร์ดล่าง
  bar(`b${i}`, `t${i}`) // ชิ้นส่วนทแยงขึ้น
  bar(`t${i}`, `b${i + 1}`) // ชิ้นส่วนทแยงลง
  if (i > 0) bar(`t${i - 1}`, `t${i}`) // คอร์ดบน
}
solver.solve()

for (const m of members) {
  console.log(m.label, (m.computeNormalForceAt(lc, 0) / 1e3).toFixed(2))
}
```

เวลาคำนวณเพิ่มขึ้นเร็วตามขนาดโมเดล ไม่กี่สิบช่องยังไม่มีปัญหา ดู [ขนาดโมเดล](/th/solver/solving#model-size) ถ้าต้องการวาดโครงถักแต่ละโครงที่สร้างขึ้น จะแสดงคำตอบหรือไม่ก็ได้ ดู [โจทย์และข้อสอบ](/th/plot/exercises) ของ @edubeam/plot

## สิ่งที่ควรสังเกต {#things-to-notice}

- **จุดหมุนที่ทุกปลายชิ้นส่วน** จุดต่อทุกจุดจึงหมุนได้อิสระ และตัวคำนวณรายงานการหมุนเป็น 0 โมเมนต์ที่กระทำที่จุดต่อแบบนี้ไม่มีอะไรรับ และ [การคำนวณจะไม่สำเร็จ](/th/solver/solving#when-solving-fails)
- **แรงกระทำที่จุดต่อ** แรงกระทำบนชิ้นส่วนจะทำให้ชิ้นส่วนดัด ชิ้นส่วนนั้นจึงเป็นคาน ไม่ใช่ชิ้นส่วนโครงถัก และมีแผนภาพโมเมนต์

[บทเรียน: โครงถักในระนาบ](/th/tutorials/truss) สร้างโครงถักในแอป EduBeam และหน้า [เอลิเมนต์โครงถัก](/th/elements/truss) แสดงที่มาของความแข็งเกร็งของชิ้นส่วนโครงถัก
