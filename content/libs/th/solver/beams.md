---
title: คาน
description: "โปรแกรม @edubeam/fem ที่สมบูรณ์สำหรับคานยื่นและคานต่อเนื่องสองช่วง พร้อมผลลัพธ์ที่ตรวจกับสูตรในตำราแล้ว"
order: 12
group: ตัวอย่างโปรแกรม
source: site
---

# คาน {#beams}

โปรแกรมสมบูรณ์สองโปรแกรมให้คัดลอกไปแก้ไข ทั้งสองใช้หน้าตัดที่ไม่คิดการเสียรูปเนื่องจากแรงเฉือน (`k: 1e32`) ตัวเลขจึงตรงกับสูตรของคาน Euler–Bernoulli พอดี รันด้วย `node cantilever.ts` (Node 22.18 ขึ้นไป) ในโฟลเดอร์ที่ตั้งค่าตามหัวข้อ [ติดตั้ง](/th/solver/getting-started#install)

## คานยื่น {#a-cantilever}

ยาว 4 m ยึดแน่นที่ A รับแรง 18 kN ทิศลงที่ปลายอิสระ:

```ts [cantilever.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // ยึดแน่น
const tip = domain.createNode('B', [4, 0, 0]) // อิสระ
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
lc.createNodalLoad('B', { [DofID.Dz]: 18e3 }) // 18 kN ทิศลงที่ปลายคานยื่น
solver.solve()

console.log(beam.computeBendingMomentAt(lc, 0)) // N·m ที่โคนคาน
console.log(tip.getUnknowns(lc, [DofID.Dz])) // m การโก่งตัวที่ปลาย
```

```text [เอาต์พุต]
-72000
0.09411072715241528
```

$M_A = -FL = -72$ kNm เป็นโมเมนต์ลบ และการโก่งตัวที่ปลายคือ $FL^3/3EI = 94.11$ mm โดย $EI = 4.0803$ MNm² คานยื่นนี้เป็นตัวอย่างหนึ่งในแอป EduBeam ด้วย

## คานต่อเนื่อง {#a-continuous-beam}

สองช่วง ช่วงละ 5 m บนจุดรองรับสามจุด รับ 10 kN/m ทั้งสองช่วง โปรแกรมหาแรงปฏิกิริยา โมเมนต์เหนือจุดรองรับกลาง และโมเมนต์ในช่วงที่มีค่ามากที่สุด:

```ts [continuous.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [5, 0, 0], [DofID.Dz])
domain.createNode('C', [10, 0, 0], [DofID.Dz])
const span1 = domain.createBeam2D(1, ['A', 'B'], 1, 1)
domain.createBeam2D(2, ['B', 'C'], 1, 1)

const lc = solver.loadCases[0]
for (const span of [1, 2]) {
  lc.createBeamElementUniformEdgeLoad(span, [0, 10e3], true)
}
solver.solve()

// getReactions คืน Matrix ของ mathjs หรืออาร์เรย์: แปลงให้เป็นอาร์เรย์
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

for (const label of ['A', 'B', 'C']) {
  const { dofs, values } = domain.getNode(label).getReactions(lc)
  const rz = list(values)[dofs.indexOf(DofID.Dz)]
  console.log(`R${label} = ${(-rz / 1e3).toFixed(2)} kN up`)
}
const mB = span1.computeBendingMomentAt(lc, 5)
console.log(`MB = ${(mB / 1e3).toFixed(2)} kNm`)

// โมเมนต์บวกที่มากที่สุดในช่วงที่ 1 จาก 501 จุดตลอดช่วง
const { x, M } = span1.computeBendingMoment(lc, 500)
const i = M.indexOf(Math.max(...M))
console.log(`max M = ${(M[i] / 1e3).toFixed(2)} kNm at x = ${x[i]} m`)
```

```text [เอาต์พุต]
RA = 18.75 kN up
RB = 62.50 kN up
RC = 18.75 kN up
MB = -31.25 kNm
max M = 17.58 kNm at x = 1.87 m
```

ค่าจากตำราสำหรับสองช่วงที่ยาวเท่ากัน: $R_A = R_C = 0.375\,qL$, $R_B = 1.25\,qL$, $M_B = -qL^2/8$ และโมเมนต์ในช่วงที่มากที่สุด $R_A^2/2q = 17.58$ kNm ที่ $x = R_A/q = 1.875$ m การหาค่าทีละจุดพบค่านี้ที่จุดกริด 1.87 m ต่างจากค่าจริงไม่เกิน 0.0002 kNm

::model-figure{caption="สองช่วง ช่วงละ 5 m รับ 10 kN/m"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels]
---
::

รูปนี้ใช้หน้าตัดตัวอย่างของแอปแทน IPE 200 เมื่อใช้หน้าตัดเดียวกันตลอด แรงภายในของคานต่อเนื่องไม่ขึ้นกับความแข็งเกร็ง แผนภาพจึงให้ตัวเลขเดียวกัน ต่างกันเพียงการโก่งตัว

## ลองแก้ไข {#change-it}

- **ช่วงหรือแรงกระทำไม่เท่ากัน:** เปลี่ยนพิกัดของ C หรือรายการแรงกระทำ แรงกระทำบนช่วงเดียวให้รูปแบบการจัดวางแรงกระทำ (pattern loading) ที่คุ้นเคย
- **สามช่วง:** เพิ่มโหนด D และชิ้นส่วน `['C', 'D']`
- **ปลายยึดแน่น:** กำหนด `[DofID.Dx, DofID.Dz, DofID.Ry]` ให้ A
- **คิดการเสียรูปเนื่องจากแรงเฉือนจริง:** ใช้ `k: 5 / 6` สำหรับหน้าตัดสี่เหลี่ยมผืนผ้า หรือสัมประสิทธิ์เฉือนของหน้าตัดที่ใช้
- **รูปของคาน:** ส่งตัวคำนวณให้ [@edubeam/plot](/th/solver/drawing)

[บทเรียน: คานต่อเนื่องและการทรุดตัวของจุดรองรับ](/th/tutorials/continuous-beam) สร้างคานแบบนี้ในแอป EduBeam และหน้า [ตรวจสอบผลลัพธ์ด้วยการคำนวณมือ](/th/guide/verification) มีตัวอย่างจากตำราพร้อมสูตรอีกมาก
