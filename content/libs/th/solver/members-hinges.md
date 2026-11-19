---
title: ชิ้นส่วนและจุดหมุน
description: "เชื่อมโหนดด้วยชิ้นส่วน Beam2D ปลดโมเมนต์ด้วยจุดหมุนที่ปลาย สร้างชิ้นส่วนโครงถัก และขอเมทริกซ์ความแข็งและเมทริกซ์การแปลงของเอลิเมนต์จาก @edubeam/fem"
order: 5
source: site
---

# ชิ้นส่วนและจุดหมุน {#members-and-hinges}

ชิ้นส่วนทุกชิ้นเป็น `Beam2D` คือคาน Timoshenko เส้นตรงสองโหนดในระนาบ x–z ที่รับแรงตามแนวแกน แรงเฉือน และโมเมนต์ดัด จุดหมุนที่ปลายปลดโมเมนต์ที่ปลายนั้น โค้ดสั้น ๆ ในหน้านี้ใช้ `solver`, `domain` และ `lc` ของโปรแกรมแบบในหน้า [เริ่มต้นใช้งาน](/th/solver/getting-started) พร้อมวัสดุ `'steel'` และหน้าตัด `'IPE200'`

## สร้างชิ้นส่วน {#create-a-member}

```ts
domain.createBeam2D(label, [startNode, endNode], material, crossSection, hinges)
```

| อาร์กิวเมนต์ | ชนิด | ความหมาย |
| --- | --- | --- |
| `label` | `string \| number` | ชื่อของชิ้นส่วน เก็บเป็นสตริง |
| `nodes` | `[label, label]` | โหนดแรกและโหนดที่สอง แกน x ท้องถิ่นชี้จากโหนดแรกไปยังโหนดที่สอง ดู [ทิศของชิ้นส่วน](/th/solver/conventions#member-direction) |
| `mat`, `cs` | `string \| number` | ชื่อของวัสดุและหน้าตัด |
| `hinges` | `[boolean, boolean]` | จุดหมุนที่โหนดแรกและที่โหนดที่สอง ไม่บังคับ ค่าเริ่มต้น `[false, false]` คือปลายยึดแข็ง |

เมธอดคืนค่าเป็น `Beam2D` ให้เก็บไว้เพื่ออ่านผลลัพธ์ `domain.getElement(label)` หาชิ้นส่วนนี้ได้อีกครั้ง แต่คืนชนิดเป็น `Element` แบบทั่วไป TypeScript จึงต้องการ `as Beam2D` ก่อนอ่านผลลัพธ์

ชิ้นส่วนที่มาบรรจบกันที่โหนดโดยไม่มีจุดหมุนจะต่อกันแบบยึดแข็ง คือหมุนไปด้วยกัน โหนด วัสดุ และหน้าตัดสร้างในลำดับใดก็ได้ ขอเพียงให้มีครบตอนคำนวณ ถ้าขาดตัวใด `solve()` จะ throw `RangeError` ที่ระบุชื่อตัวที่ขาด

## จุดหมุนที่ปลาย {#end-hinges}

จุดหมุนเป็นของปลายชิ้นส่วน ไม่ใช่ของโหนด ในตัวอย่างนี้ชิ้นส่วน 2 เริ่มต้นด้วยจุดหมุนที่ C ดังนั้น C ถ่ายแรงเฉือนแต่ไม่ถ่ายโมเมนต์จากช่วง C–D ไปยังคานยื่น A–C:

```ts [hinge.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry])
domain.createNode('C', [2, 0, 0])
domain.createNode('D', [6, 0, 0], [DofID.Dz])
const ac = domain.createBeam2D(1, ['A', 'C'], 'steel', 'IPE200')
const cd = domain.createBeam2D(2, ['C', 'D'], 'steel', 'IPE200', [true, false])

lc.createBeamElementUniformEdgeLoad(2, [0, 10e3], true)
solver.solve()

cd.computeBendingMomentAt(lc, 0) // 0 ที่จุดหมุน
cd.computeBendingMomentAt(lc, 2) // 20000 N·m: qL²/8 ของช่วง 4 m
ac.computeBendingMomentAt(lc, 0) // -40000 N·m: แรง 20 kN จาก C–D ที่ระยะ 2 m
```

::model-figure{caption="คานยื่นที่รับช่วงคานซึ่งมีจุดหมุน: ไม่มีโมเมนต์ที่ C"}
---
nodes: { A: [0, 0], C: [2, 0], D: [6, 0] }
supports: { A: fixed, D: roller }
members: [[A, C], { nodes: [C, D], hinges: [true, false] }]
loads:
  - { member: 2, qz: 10 }
results: [M, V]
show: [nodeLabels]
---
::

ที่จุดต่อซึ่งเป็นจุดหมุนและมีหลายชิ้นส่วนมาบรรจบกัน ใส่จุดหมุนที่ปลายของทุกชิ้นส่วนยกเว้นชิ้นเดียวก็พอ จะใส่จุดหมุนที่ทุกปลายก็ได้เช่นกัน ในกรณีนั้นไม่มีชิ้นส่วนใดบังคับการหมุนของจุดต่อ และตัวคำนวณรายงานการหมุนของจุดต่อเป็น 0 แต่โมเมนต์ที่กระทำที่จุดต่อแบบนี้จะไม่มีอะไรรับ และ [การคำนวณจะไม่สำเร็จ](/th/solver/solving#when-solving-fails)

## ชิ้นส่วนโครงถัก {#truss-bars}

ใส่จุดหมุนทั้งสองปลาย แล้วชิ้นส่วนจะรับเฉพาะแรงตามแนวแกน ตราบที่แรงกระทำอยู่ที่โหนด นี่คือชิ้นส่วนโครงถัก

```ts
domain.createBeam2D('AE', ['A', 'E'], 'steel', 'bar', [true, true])
```

[ตัวอย่างโครงถัก](/th/solver/trusses) คำนวณโครงถักทั้งโครงด้วยวิธีนี้ ส่วนตัวอย่างโครงถักในแอป EduBeam ใช้จุดต่อแบบยึดแข็งแทน โดยให้พื้นที่หน้าตัดใหญ่มากจนโมเมนต์ดัดเล็กน้อยเมื่อเทียบกับแรงตามแนวแกน ทั้งสองแบบเป็นโมเดลที่ถูกต้อง ต่างกันเพียงโมเมนต์เล็ก ๆ เหล่านั้น ที่มาของเมทริกซ์ความแข็งของชิ้นส่วนโครงถักอยู่ในหน้า [เอลิเมนต์โครงถัก](/th/elements/truss) ของคู่มือทฤษฎี

## เมทริกซ์ของเอลิเมนต์ {#the-element-s-matrices}

สำหรับการสอนตัววิธีความแข็งเอง `Beam2D` ให้เมทริกซ์ของเอลิเมนต์เป็นเมทริกซ์ของ [mathjs](https://mathjs.org) และ `.toArray()` แปลงเป็น `number[][]`:

| เมธอด | ให้ค่า |
| --- | --- |
| `computeGeo()` | `{ l, dx, dz }`: ความยาวและภาพฉาย หน่วย m |
| `computeLocalStiffnessMtrx().answer` | เมทริกซ์ความแข็ง 6 × 6 ในแกนท้องถิ่น หลังลดรูปแบบสถิต (static condensation) ที่จุดหมุนแล้ว |
| `computeT()` | เมทริกซ์การแปลง 6 × 6 จากแกนรวมเป็นแกนท้องถิ่น |
| `computeStiffness()` | เมทริกซ์ความแข็ง 6 × 6 ในแกนรวม $T^T K_l T$ |
| `computeShearFactor()` | $\Phi = 12EI_y/kGAL^2$ |

```ts
ac.computeStiffness().toArray() // number[][] หน่วย N/m, N และ N·m
```

DOF เรียงลำดับเป็น $u_1, w_1, \varphi_1, u_2, w_2, \varphi_2$ หน้า [เอลิเมนต์คาน](/th/elements/beam) ของคู่มือทฤษฎีแสดงที่มาของเมทริกซ์เหล่านี้ และหน้า [EduBeam คำนวณโมเดลอย่างไร](/th/elements/analysis) แสดงวิธีประกอบเมทริกซ์
