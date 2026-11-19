---
title: อุณหภูมิและการทรุดตัวของจุดรองรับ
description: "ใส่แรงกระทำเนื่องจากการเปลี่ยนแปลงอุณหภูมิและผลต่างอุณหภูมิให้ชิ้นส่วนใน @edubeam/fem และเลื่อนจุดรองรับด้วยการกระจัดที่กำหนด พร้อมตัวอย่างที่ตรวจสอบแล้ว"
order: 7
source: site
---

# อุณหภูมิและการทรุดตัวของจุดรองรับ {#temperature-and-settlements}

หน้านี้มีแรงกระทำสองแบบที่ไม่ใช่แรง แบบแรกคือชิ้นส่วนที่ต้องการเปลี่ยนความยาวหรือความโค้ง แบบที่สองคือจุดรองรับที่เคลื่อนที่ ทั้งสองแบบทำให้เกิดแรงภายในเฉพาะเมื่อโครงสร้างขัดขวางการเปลี่ยนรูปนั้น จึงเหมาะสำหรับฝึกกับโครงสร้างอินดีเทอร์มิเนท ทฤษฎีของทั้งสองแบบอยู่ในหัวข้อ [แรงกระทำบนเอลิเมนต์](/th/elements/beam#element-loads) ของคู่มือทฤษฎี

## อุณหภูมิ {#temperature}

```ts
lc.createBeamTemperatureLoad(member, [dTc, dTb, dTt])
```

| ค่า | ความหมาย | ผลต่อชิ้นส่วนที่ไม่มีการยึดรั้ง |
| --- | --- | --- |
| `dTc` | การเปลี่ยนแปลงที่เซนทรอยด์ หน่วย K | ยืดออก $\alpha\,\Delta T_c\,L$ |
| `dTb` | การเปลี่ยนแปลงที่เส้นใยล่าง (ด้าน +z ท้องถิ่น) หน่วย K | ร่วมกับ `dTt` ทำให้โค้ง $\kappa = \alpha\,(\Delta T_b - \Delta T_t)/h$ |
| `dTt` | การเปลี่ยนแปลงที่เส้นใยบน หน่วย K | |

มีเพียงผลต่าง `dTb - dTt` ที่ทำให้ชิ้นส่วนดัด ดังนั้น `[30, 20, 0]` กับ `[30, 10, -10]` คือแรงกระทำเดียวกัน แรงกระทำนี้ต้องใช้ `alpha` ของวัสดุและ `h` ของหน้าตัด ถ้าไม่มี `h` โมเมนต์จะเป็น `NaN`

คานยึดแน่นสองปลายยืดหรือโค้งไม่ได้ คานจึงรับแรงอัดและโมเมนต์ดัดแทน: $N = -EA\,\alpha\,\Delta T_c$ และ $M = -EI\,\alpha\,(\Delta T_b - \Delta T_t)/h$

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

// เซนทรอยด์ร้อนขึ้น 30 K และเส้นใยล่างร้อนกว่าเส้นใยบน 20 K
lc.createBeamTemperatureLoad(1, [30, 20, 0])
solver.solve()

beam.computeNormalForceAt(lc, 3) // -215460 N: EA · 12e-6 · 30
beam.computeBendingMomentAt(lc, 3) // -4896.4 N·m: EI · 12e-6 · 20 / 0.2
```

สำหรับ IPE 200 $EA = 598.5$ MN และ $EI = 4.0803$ MNm² เส้นใยล่างที่ร้อนกว่าทำให้คานที่ไม่มีการยึดรั้งโค้งจนปลายทั้งสองยกขึ้น การยึดรั้งจึงดัดคานไปในทางตรงข้าม เกิดโมเมนต์ลบ เส้นใยบนรับแรงดึง

::model-figure{caption="คานยึดแน่นสองปลาย เซนทรอยด์ร้อนขึ้น 30 K และด้านล่างร้อนกว่าด้านบน 20 K"}
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

บนคานรองรับธรรมดา แรงกระทำเดียวกันนี้ไม่ทำให้เกิดแรงภายในเลย มีเพียงการเคลื่อนที่ ล้อเลื่อนเลื่อนออกไป $\alpha\,\Delta T_c\,L = 2.16$ mm และกึ่งกลางช่วงแอ่นตัวลง $\kappa L^2/8 = 5.4$ mm

## การกระจัดที่กำหนด {#prescribed-displacements}

```ts
lc.createPrescribedDisplacement(node, { [DofID.Dz]: 0.01 })
```

เลื่อนจุดรองรับไปตามระยะที่กำหนด หน่วยเมตรสำหรับ `Dx` และ `Dz` และเรเดียนสำหรับ `Ry` ในแกนของโหนดเอง DOF นั้นต้องเป็น DOF ที่จุดรองรับของโหนดยึดไว้ ถ้าเป็น DOF อิสระ ตัวคำนวณจะไม่สนใจค่านี้โดยไม่มีคำเตือน

คานปลายยึดแน่น–ปลายรองรับธรรมดาที่ล้อเลื่อนทรุดตัว 10 mm ในตัวคำนวณใหม่ที่ใช้วัสดุและหน้าตัดเดียวกับตัวอย่างอุณหภูมิ:

```ts
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // ยึดแน่น
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // ล้อเลื่อน
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

lc.createPrescribedDisplacement('B', { [DofID.Dz]: 0.01 }) // 10 mm ทิศลง
solver.solve()

domain.getNode('B').getReactions(lc).values // [566.7] N: 3EIw/L³
beam.computeBendingMomentAt(lc, 0) // -3400.2 N·m ที่ A: 3EIw/L²
```

ล้อเลื่อนต้องดึงคานลงเพื่อให้คานเคลื่อนตาม แรงปฏิกิริยาจึงเป็นบวก ตามแกน +z: $3EIw/L^3 = 3 \cdot 4.0803 \times 10^6 \cdot 0.01 / 216 = 566.7$ N

::model-figure{caption="ล้อเลื่อนของคานปลายยึดแน่น–ปลายรองรับธรรมดาทรุดตัว 10 mm: −3.4 kNm ที่ปลายยึดแน่น"}
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

วิธีที่แอปแสดงแรงกระทำทั้งสองแบบอยู่ในหน้า [แรงกระทำ](/th/essentials/loads)
