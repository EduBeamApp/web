---
title: กรณีแรงกระทำ
description: "คำนวณหลายกรณีแรงกระทำของโมเดล @edubeam/fem ในครั้งเดียว แล้วรวมผลด้วยหลักการซ้อนทับเป็นการจัดหมู่แรงกระทำและเส้นห่อหุ้ม"
order: 8
source: site
---

# กรณีแรงกระทำ {#load-cases}

กรณีแรงกระทำคือชุดของแรงกระทำที่คำนวณพร้อมกัน ตัวคำนวณเริ่มต้นด้วยหนึ่งกรณี ถ้าเพิ่มกรณีอื่น `solve()` ครั้งเดียวจะคำนวณทุกกรณีด้วยเมทริกซ์ความแข็งเดียว การวิเคราะห์เป็นแบบเชิงเส้น ผลของกรณีต่าง ๆ จึงคูณด้วยตัวคูณแล้วบวกกันได้ ซึ่งก็คือการจัดหมู่แรงกระทำนั่นเอง

## เพิ่มกรณีแรงกระทำ {#add-a-load-case}

```ts [load-cases.ts]
import { DofID, LinearStaticSolver, LoadCase } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const dead = solver.loadCases[0] // กรณีที่ตัวคำนวณทุกตัวมีตั้งแต่เริ่ม
const live = new LoadCase('live', domain)
solver.loadCases.push(live)

dead.createBeamElementUniformEdgeLoad(1, [0, 10e3], true) // 10 kN/m
live.createBeamConcentratedLoad(1, [0, 20e3, 0, 3], true) // 20 kN ที่กึ่งกลางช่วง
solver.solve() // คำนวณทุกกรณีแรงกระทำ

console.log(beam.computeBendingMomentAt(dead, 3)) // qL²/8
console.log(beam.computeBendingMomentAt(live, 3)) // PL/4
```

```text [เอาต์พุต]
45000
30000
```

เมธอดผลลัพธ์ทุกตัวรับกรณีแรงกระทำที่ต้องการอ่าน กรณีแรกมีชื่อ `'DefaultLC'` ชื่อเป็นเพียงชื่อเรียก ตัวคำนวณแยกกรณีต่าง ๆ ด้วยตัวออบเจกต์

## จัดหมู่แรงกระทำ {#combine-them}

คูณผลของแต่ละกรณีด้วยตัวคูณแล้วบวกกัน สำหรับสภาวะขีดจำกัดด้านกำลัง (ULS) ตาม Eurocode $1.35\,G + 1.5\,Q$ ที่กึ่งกลางช่วง:

```ts
1.35 * beam.computeBendingMomentAt(dead, 3) +
  1.5 * beam.computeBendingMomentAt(live, 3) // 105750 N·m
```

หลักเดียวกันใช้กับแรงปฏิกิริยา การกระจัด และผลลัพธ์อื่นทุกค่า ถ้าต้องการค่าตลอดทั้งชิ้นส่วน ให้รวมทีละจุด อาร์เรย์จาก `computeBendingMoment(lc, n)` ใช้ `x` ชุดเดียวกันทุกกรณี

```ts
const n = 60
const g = beam.computeBendingMoment(dead, n).M
const q = beam.computeBendingMoment(live, n).M
const uls = g.map((m, i) => 1.35 * m + 1.5 * q[i])
Math.max(...uls) // 105750 N·m ที่ x = 3
```

เส้นห่อหุ้ม (envelope) คือค่ามากที่สุดและน้อยที่สุดจากการจัดหมู่หลายแบบ หาได้ด้วย `Math.max` และ `Math.min` บนอาร์เรย์เหล่านี้ทีละจุด สำหรับแรงกระทำเคลื่อนที่ ให้คำนวณหนึ่งครั้งต่อหนึ่งตำแหน่งของแรงแทน อย่างที่ [ตัวอย่างเส้นอิทธิพล](/th/solver/scripts#an-influence-line-as-csv) ทำ

## ในแอป EduBeam {#in-the-edubeam-app}

แอปคำนวณทีละกรณีแรงกระทำ การจัดหมู่จึงเป็นเรื่องที่ไลบรารีทำได้มากกว่าแอป โมเดลที่มีหลายกรณียังคง [วาด](/th/solver/drawing) ได้ทีละกรณี `StructurePlot` จาก @edubeam/plot รับ `loadCase` ซึ่งเป็นดัชนีใน `solver.loadCases`
