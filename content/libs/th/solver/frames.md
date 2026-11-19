---
title: โครงข้อแข็ง
description: "โปรแกรม @edubeam/fem ที่สมบูรณ์สำหรับโครงข้อแข็งสามจุดหมุน มีเสา มุมโครงแบบยึดแข็ง และจุดหมุนที่ยอด พร้อมตรวจผลลัพธ์ด้วยการคำนวณมือ"
order: 13
source: site
---

# โครงข้อแข็ง {#frames}

โครงข้อแข็งประกอบด้วยคานและเสาที่ต่อกันแบบยึดแข็งที่มุม ตัวอย่างนี้เขียนโค้ดสร้างโครงข้อแข็งจาก [บทเรียน: โครงข้อแข็งสามจุดหมุน](/th/tutorials/three-hinged-frame) ได้แก่ เสาสองต้นสูง 4 m ที่มีจุดรองรับแบบหมุดที่ A และ E คานยาว 8 m ที่มีจุดหมุนที่ C และแรงแผ่กระจาย 10 kN/m บนคาน บทเรียนให้หมายเลขโหนด 1 ถึง 5 ส่วนที่นี่ใช้ A ถึง E

::model-figure{caption="โครงข้อแข็งของโปรแกรมด้านล่าง: จุดรองรับแบบหมุดที่ A และ E จุดหมุนที่ C รับ 10 kN/m"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, k: 1e32 }) // IPE 300

// แกน z ชี้ลง: ยอดเสาสูง 4 m อยู่ที่ z = -4
const pin = [DofID.Dx, DofID.Dz]
domain.createNode('A', [0, 0, 0], pin)
domain.createNode('B', [0, 0, -4])
domain.createNode('C', [4, 0, -4]) // จุดหมุนที่ยอด
domain.createNode('D', [8, 0, -4])
domain.createNode('E', [8, 0, 0], pin)

const column = domain.createBeam2D(1, ['A', 'B'], 1, 1) // จากล่างขึ้นบน
const left = domain.createBeam2D(2, ['B', 'C'], 1, 1, [false, true]) // จุดหมุนที่ C
domain.createBeam2D(3, ['C', 'D'], 1, 1)
domain.createBeam2D(4, ['D', 'E'], 1, 1)

const lc = solver.loadCases[0]
for (const half of [2, 3]) {
  lc.createBeamElementUniformEdgeLoad(half, [0, 10e3], false)
}
solver.solve()

// getReactions คืน Matrix ของ mathjs หรืออาร์เรย์: แปลงให้เป็นอาร์เรย์
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()
const kN = (v: number) => (v / 1e3).toFixed(2)

for (const label of ['A', 'E']) {
  const [rx, rz] = list(domain.getNode(label).getReactions(lc).values)
  console.log(`${label}: Rx = ${kN(rx)} kN, Rz = ${kN(rz)} kN`)
}
for (const x of [0, 2, 4]) {
  const m = left.computeBendingMomentAt(lc, x)
  console.log(`M at ${x} m from B = ${kN(m)} kNm`)
}
const top = column.computeBendingMomentAt(lc, 4)
console.log(`M at the top of column 1 = ${kN(top)} kNm`)
```

```text [เอาต์พุต]
A: Rx = 20.00 kN, Rz = -40.00 kN
E: Rx = -20.00 kN, Rz = -40.00 kN
M at 0 m from B = -80.00 kNm
M at 2 m from B = -20.00 kNm
M at 4 m from B = 0.00 kNm
M at the top of column 1 = -80.00 kNm
```

## ตรวจสอบด้วยการคำนวณมือ {#check-it-by-hand}

| ปริมาณ | คำนวณมือ | ตัวคำนวณ |
| --- | --- | --- |
| แรงปฏิกิริยาแนวดิ่ง | $q \cdot 8/2 = 40$ kN ทิศขึ้น | $R_z = -40$ kN ที่ A และ E |
| แรงปฏิกิริยาแนวนอน | จาก $M_C = 0$ ของครึ่งซ้าย: $(40 \cdot 4 - 10 \cdot 4 \cdot 2)/4 = 20$ kN ชี้เข้าด้านใน | $R_x = +20$ kN ที่ A และ $-20$ kN ที่ E |
| โมเมนต์ที่มุมโครง | $-20 \cdot 4 = -80$ kNm | $-80$ kNm ทั้งในคานและในเสา |
| โมเมนต์ที่ระยะ 2 m จาก B | $-80 + 40 \cdot 2 - 10 \cdot 2^2/2 = -20$ kNm | $-20$ kNm |
| โมเมนต์ที่จุดหมุน | 0 | 0 |

## สิ่งที่ควรสังเกต {#things-to-notice}

- **เสาตั้งขึ้น ค่า z จึงเป็นลบ** ยอดเสาอยู่ที่ $z = -4$
- **แกนท้องถิ่นของเสา** ชิ้นส่วน 1 กำหนดจาก A ขึ้นไปยัง B แกน z ท้องถิ่นจึงชี้ไปทางขวา เข้าหาด้านในโครง โมเมนต์ที่ยอดเสาคือ −80 kNm เท่ากับของคานที่มุมโครง: ผิวด้านนอกรับแรงดึง ถ้ากำหนดเสาจาก B ลงมายัง A แกน z ท้องถิ่นจะชี้ไปทางซ้าย โมเมนต์จะเปลี่ยนเครื่องหมาย และ `x` จะนับจากยอดเสา ดู [ทิศของชิ้นส่วน](/th/solver/conventions#member-direction)
- **จุดหมุนหนึ่งจุด อยู่ที่ปลายชิ้นส่วนหนึ่งปลาย** จุดหมุนอยู่ที่ปลายของชิ้นส่วน 2 ที่ C ส่วนชิ้นส่วน 3 เริ่มที่ C แบบยึดแข็ง ปลดปลายเดียวก็พอที่จะทำให้ C เป็นจุดหมุน
- **แรงกระทำบนคานในแกนรวม** `false` ให้แรงกระทำอยู่ในแกนรวม คือแนวดิ่งไม่ว่าชิ้นส่วนจะเอียงเท่าใด บนคานแนวนอนที่กำหนดจากซ้ายไปขวา ผลเหมือนกับแกนท้องถิ่น

## โครงข้อแข็งอินดีเทอร์มิเนท {#statically-indeterminate-frames}

เอาจุดหมุนออก `[false, false]` แล้วโครงจะเป็นโครงข้อแข็งพอร์ทัลที่มีแรงปฏิกิริยาเกินจำเป็นหนึ่งค่า แรงภายในจะขึ้นกับว่าคานแข็งเกร็งเพียงใดเมื่อเทียบกับเสา ลองกำหนดหน้าตัดต่างกันให้ชิ้นส่วนเพื่อดูผลนี้ [หัวข้อทดลองของบทเรียน](/th/tutorials/three-hinged-frame#_7-experiment) เปลี่ยนฐานเสาเป็นแบบยึดแน่นและผลักโครงไปด้านข้าง พร้อมตัวเลขให้ตรวจสอบ หน้า [สไลด์และเอกสารประกอบการสอน](/th/plot/slides) ของ @edubeam/plot วาดโครงข้อแข็งพอร์ทัลแบบนี้ทีละขั้น
