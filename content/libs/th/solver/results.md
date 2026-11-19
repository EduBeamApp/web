---
title: การอ่านผลลัพธ์
description: "อ่านแรงปฏิกิริยา การกระจัดที่โหนด แรงภายในที่จุดใดก็ได้บนชิ้นส่วน รูปร่างที่เสียรูป และแรงปลายจากโมเดล @edubeam/fem ที่คำนวณแล้ว พร้อมรูปแบบค่าที่แต่ละเมธอดคืน"
order: 10
source: site
---

# การอ่านผลลัพธ์ {#reading-results}

หลัง `solve()` ผลลัพธ์อ่านได้จากโหนดและชิ้นส่วน สำหรับกรณีแรงกระทำที่ระบุ ทุกตัวอย่างในหน้านี้อ่านจากโมเดลเดียว คือคานรองรับธรรมดายาว 6 m หน้าตัด IPE 200 ที่ไม่คิดการเสียรูปเนื่องจากแรงเฉือน รับแรง 20 kN ที่ระยะ 2 m จาก A:

```ts [results.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 }) // ไม่คิดการเสียรูปเนื่องจากแรงเฉือน

const A = domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
const B = domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
const lc = solver.loadCases[0]
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], true)
solver.solve()
```

::model-figure{caption="แรง 20 kN ที่ระยะ 2 m บนช่วง 6 m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M, w]
show: [nodeLabels]
---
::

## อ่านค่าใดจากที่ใด {#what-to-read-where}

| ผลลัพธ์ | เรียก | คืนค่า |
| --- | --- | --- |
| แรงปฏิกิริยา | `node.getReactions(lc)` | `{ dofs, values }`: N, N·m |
| การกระจัด | `node.getUnknowns(lc, dofs)` | m, rad |
| N, V หรือ M ที่จุดหนึ่ง | `beam.computeBendingMomentAt(lc, x)` | ตัวเลข: N, N·m |
| N, V หรือ M ตลอดชิ้นส่วน | `beam.computeBendingMoment(lc, n)` | `{ x, M }` จำนวน n + 1 จุด |
| รูปร่างที่เสียรูป | `beam.computeLocalDefl(lc, n)` | `{ u, w }` จำนวน n + 1 จุด หน่วย m |
| แรงปลาย | `beam.computeEndForces(lc)` | เมทริกซ์ของ mathjs ที่มี 6 ค่า |

สำหรับ N และ V เมธอดคือ `computeNormalForceAt` และ `computeShearForceAt` รวมถึง `computeNormalForce` และ `computeShearForce` ซึ่งคืนค่า `{ x, N }` และ `{ x, V }` เครื่องหมายอธิบายไว้ในหน้า [หน่วยและเครื่องหมาย](/th/solver/conventions#signs-of-the-results)

## แรงปฏิกิริยา {#reactions}

`getReactions` ให้แรงปฏิกิริยาหนึ่งค่าต่อหนึ่ง DOF ที่จุดรองรับยึดไว้ `dofs` แสดงรายการ DOF ตามลำดับที่ส่งให้ `createNode` และ `values` เก็บแรงปฏิกิริยาในลำดับเดียวกัน `values` เป็น **เมทริกซ์ของ mathjs** เมื่อมีหลายค่า และเป็นอาร์เรย์ธรรมดาเมื่อมีค่าเดียว ฟังก์ชันช่วยเล็ก ๆ จึงแปลงให้เป็นอาร์เรย์ได้ทั้งสองกรณี:

```ts
/** แปลง Matrix ของ mathjs อาร์เรย์ หรือตัวเลข ให้เป็นอาร์เรย์ธรรมดา */
const list = (v: unknown): number[] =>
  typeof v === 'number'
    ? [v]
    : Array.isArray(v)
      ? v
      : (v as { toArray(): number[] }).toArray()

A.getReactions(lc).dofs // [0, 2]: DofID.Dx, DofID.Dz
list(A.getReactions(lc).values) // [0, -13333.3]
list(B.getReactions(lc).values) // [-6666.7]
```

ถ้าต้องการแรงปฏิกิริยาค่าใดค่าหนึ่งโดยไม่ขึ้นกับลำดับ ให้ค้นจาก DOF: `list(values)[dofs.indexOf(DofID.Dz)]` อย่างที่ [ตัวอย่างคานต่อเนื่อง](/th/solver/beams#a-continuous-beam) ทำ

แรงปฏิกิริยาคือแรงที่จุดรองรับกระทำต่อโครงสร้าง ค่า −13,333 N ตามแกน z คือแรง 13.3 kN ที่ดันขึ้น $P\,b/L = 20 \cdot 4/6$ บนโหนดที่ [หมุนแกน](/th/solver/nodes-supports#inclined-supports) แรงปฏิกิริยาจะอยู่ในแกนนั้น `getReactions(lc, true)` แปลงเป็นแกนรวมและคืนค่าครบทั้งสาม DOF โดยเป็น 0 ที่ DOF ที่ไม่ได้ยึด โหนดที่ไม่มีจุดรองรับให้ค่า `{ dofs: [], values: [] }`

## การกระจัด {#displacements}

`getUnknowns` อ่าน DOF ใดก็ได้ของโหนด ไม่ว่าจะมีจุดรองรับหรือไม่:

```ts
list(A.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])) // [0, 0, -0.0108924]
```

A หมุนตามเข็มนาฬิกา 0.010892 rad ตามสูตร $P\,b\,(L^2 - b^2)/6EIL$ ถ้าขอเพียง DOF เดียว `getUnknowns` จะคืนตัวเลขธรรมดา แม้ TypeScript ประกาศชนิดเป็นเมทริกซ์ ฟังก์ชัน `list` จัดการกรณีนี้ได้ด้วย

## แรงภายในตลอดชิ้นส่วน {#internal-forces-along-a-member}

เมธอด `…At` ให้ค่าที่ตำแหน่ง `x` เมตรจากโหนดแรกของชิ้นส่วน:

```ts
beam.computeShearForceAt(lc, 1) // 13333.3 N
beam.computeShearForceAt(lc, 2) // -6666.7 N: ที่ตำแหน่งแรงพอดีได้ค่าถัดจากแรงไป
beam.computeBendingMomentAt(lc, 2) // 26666.7 N·m: R_A · 2
```

ตรงที่แรงกระทำเป็นจุดทำให้ค่ากระโดด ค่าที่ตำแหน่งแรงพอดีคือค่าที่อยู่ถัดจากแรงไป ถ้าต้องการค่าก่อนถึงแรง ให้ขอค่าที่ตำแหน่งก่อนหน้าเล็กน้อย เช่น `x - 1e-9`

เมธอดแบบอาร์เรย์คำนวณค่าบนชิ้นส่วนที่ n + 1 จุดซึ่งห่างเท่ากัน รวมปลายทั้งสอง:

```ts
beam.computeBendingMoment(lc, 3)
// { x: [0, 2, 4, 6], M: [0, 26666.7, 13333.3, 0] } ไม่นับความคลาดเคลื่อนจากการปัดเศษ
```

ค่าที่ควรเป็น 0 อาจออกมาเป็น `-3.6e-12` จากการปัดเศษ จึงควรจัดรูปแบบตัวเลขด้วย `toFixed` ก่อนพิมพ์ ค่ามากที่สุดตลอดชิ้นส่วนหาได้จากค่าที่จุดซึ่งแบ่งไว้ถี่พอ เช่น `computeBendingMoment(lc, 500)` อย่างใน [ตัวอย่างคานต่อเนื่อง](/th/solver/beams#a-continuous-beam) ภายใต้แรงแผ่กระจาย M เป็นพหุนาม ค่าสุดขีดที่แม่นตรงจึงอยู่ที่ตำแหน่งที่ V เป็นศูนย์ ซึ่ง [@edubeam/plot](/th/plot/model#reading-values-yourself) หาได้แม่นตรง

## รูปร่างที่เสียรูป {#deflected-shape}

```ts
beam.computeLocalDefl(lc, 3)
// { u: [0, 0, 0, 0], w: [0, 0.0174279, 0.0152494, 0] }
```

`computeLocalDefl` ให้การกระจัดตามแนวชิ้นส่วนและตั้งฉากกับชิ้นส่วน `u` และ `w` ในแกนท้องถิ่น ส่วน `computeGlobalDefl` ให้ค่าที่จุดเดียวกันในแกน x และ z รวม การโก่งตัวใต้แรง 17.43 mm เท่ากับ $P\,a^2 b^2/3EIL$ รูปร่างระหว่างโหนดเป็นค่าแม่นตรง ไม่ได้ประมาณจากค่าที่ปลาย วิธีวาดดูได้ใน [การวาดผลลัพธ์](/th/solver/drawing)

## แรงปลาย {#end-forces}

```ts
beam.computeEndForces(lc).toArray()
// [0, -13333.3, 0, 0, -6666.7, 0]: X12, Z12, M12, X21, Z21, M21
```

แรงที่โหนดทั้งสองกระทำต่อชิ้นส่วนในแกนท้องถิ่นของชิ้นส่วน คือตัวเลขในตาราง *ผลลัพธ์ที่เอลิเมนต์* ของแอป ซึ่งอธิบายไว้ใน [แรงปลาย](/th/elements/conventions#end-forces-element-results-table)

## ผลลัพธ์ที่ใช้ตรวจสอบได้ {#results-as-numbers-to-check}

ทุกค่าข้างต้นตรงกับสูตรปิดของค่านั้น หน้า [ตรวจสอบผลลัพธ์ด้วยการคำนวณมือ](/th/guide/verification) มีตัวอย่างจากตำราอีกหลายกรณี ซึ่งคำนวณในเบราว์เซอร์ของคุณด้วยตัวคำนวณตัวเดียวกันนี้
