---
title: สคริปต์และเซิร์ฟเวอร์
description: "ใช้ @edubeam/fem จาก Node: แบบฝึกหัดพร้อมเฉลย เส้นอิทธิพลที่เขียนเป็น CSV และ HTTP endpoint ขนาดเล็กที่คำนวณคานตามคำขอ"
order: 15
source: site
---

# สคริปต์และเซิร์ฟเวอร์ {#scripts-and-servers}

ตัวคำนวณไม่ต้องใช้เบราว์เซอร์ ใน Node ใช้เขียนเฉลย ศึกษาผลของการเปลี่ยนพารามิเตอร์ สร้างตารางสำหรับสเปรดชีต หรือตอบคำขอจากหน้าเว็บได้

ตัวอย่างเขียนด้วย TypeScript Node 22.18 ขึ้นไปรันไฟล์ `.ts` ได้โดยตรง (`node answers.ts`) ในโฟลเดอร์ที่ตั้งค่าตามหัวข้อ [ติดตั้ง](/th/solver/getting-started#install) ถ้าใช้ Node รุ่นเก่ากว่า ให้ลบ type annotation ออกแล้วบันทึกเป็น `.mjs`

## แบบฝึกหัดพร้อมเฉลย {#answer-key}

โจทย์ข้อเดียวกันยี่สิบแบบ คือคานรองรับธรรมดาที่รับแรงแผ่กระจายและแรงกระทำเป็นจุด แต่ละแบบมีแรงปฏิกิริยาและโมเมนต์มากที่สุด เขียนลงไฟล์ CSV ตัวเลขได้มาจากหมายเลขโจทย์ สคริปต์เดิมจึงเขียนแบบฝึกหัดชุดเดิมทุกครั้ง:

```ts [answers.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** โจทย์ข้อ i: คานรองรับธรรมดารับ q kN/m และ F kN ที่ระยะ a m จาก A */
const exercise = (i: number) => {
  const L = 4 + (i % 4) // 4 ถึง 7 m
  const q = 5 + 5 * (i % 3) // 5, 10 หรือ 15 kN/m
  const F = 10 + 10 * (i % 2) // 10 หรือ 20 kN
  const a = L / 4 + (i % 3) // ตำแหน่งใดตำแหน่งหนึ่งในช่วง
  return { L, q, F, a }
}

const solve = ({ L, q, F, a }: ReturnType<typeof exercise>) => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  lc.createBeamConcentratedLoad(1, [0, F * 1e3, 0, a], true)
  solver.solve()

  // แรงปฏิกิริยาคือแรงเฉือนที่ปลาย: V(0) ที่ A และ -V(L) ที่ B
  const rA = beam.computeShearForceAt(lc, 0) / 1e3
  const rB = -beam.computeShearForceAt(lc, L) / 1e3
  // โมเมนต์มากที่สุด จากจุดที่ห่างกัน 1 cm
  const { x, M } = beam.computeBendingMoment(lc, L * 100)
  const top = M.indexOf(Math.max(...M))
  return [rA, rB, M[top] / 1e3, x[top]].map((v) => v.toFixed(2))
}

const rows = ['no,L_m,q_kN_m,F_kN,a_m,RA_kN,RB_kN,Mmax_kNm,at_m']
for (let i = 1; i <= 20; i++) {
  const ex = exercise(i)
  rows.push([i, ex.L, ex.q, ex.F, ex.a, ...solve(ex)].join(','))
}
writeFileSync('answers.csv', rows.join('\n') + '\n')
```

```text [answers.csv]
no,L_m,q_kN_m,F_kN,a_m,RA_kN,RB_kN,Mmax_kNm,at_m
1,5,10,20,2.25,36.00,34.00,55.69,2.25
2,6,15,10,3.5,49.17,50.83,80.58,3.28
3,7,5,20,1.75,32.50,22.50,50.63,2.50
...
```

ตรวจข้อแรกด้วยการคำนวณมือ: $R_B = (10 \cdot 5 \cdot 2.5 + 20 \cdot 2.25)/5 = 34$ kN, $R_A = 70 - 34 = 36$ kN แรงเฉือนเปลี่ยนเครื่องหมายใต้แรงกระทำเป็นจุด โมเมนต์มากที่สุดจึงอยู่ตรงนั้น: $36 \cdot 2.25 - 10 \cdot 2.25^2/2 = 55.69$ kNm

สคริปต์นี้สั้นได้เพราะเลือกทำสองอย่าง อย่างแรก บนคานรองรับธรรมดา แรงปฏิกิริยาคือแรงเฉือนที่ปลาย จึงไม่ต้องใช้ [ฟังก์ชันช่วยสำหรับแรงปฏิกิริยา](/th/solver/results#reactions) อย่างที่สอง โมเมนต์มากที่สุดได้จากจุดที่ห่างกัน 1 cm ซึ่งแม่นตรงในกรณีนี้ เพราะค่าสุดขีดตกที่ตำแหน่งแรงกระทำหรือห่างจากจุดกริดไม่เกินหนึ่งเซนติเมตร ถ้าต้องการวาดโจทย์แต่ละข้อ จะแสดงคำตอบหรือไม่ก็ได้ ดู [โจทย์และข้อสอบ](/th/plot/exercises) ของ @edubeam/plot ซึ่งพิมพ์ข้อสอบได้ทั้งฉบับด้วย

## เส้นอิทธิพลเป็น CSV {#an-influence-line-as-csv}

โมเมนต์เหนือจุดรองรับกลางของคานสองช่วงเปลี่ยนไปอย่างไรเมื่อแรง 1 kN เคลื่อนผ่าน สร้างและคำนวณคานหนึ่งครั้งต่อหนึ่งตำแหน่งของแรง แล้วเขียนหนึ่งแถวต่อหนึ่งตำแหน่ง:

```ts [influence.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** สองช่วง ช่วงละ 5 m แรง 1 kN ที่ระยะ `at` m จาก A: โมเมนต์เหนือจุดรองรับกลาง */
const momentAtB = (at: number): number => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [5, 0, 0], [DofID.Dz])
  domain.createNode('C', [10, 0, 0], [DofID.Dz])
  const span1 = domain.createBeam2D(1, ['A', 'B'], 1, 1)
  domain.createBeam2D(2, ['B', 'C'], 1, 1)
  const [member, x] = at <= 5 ? [1, at] : [2, at - 5]
  solver.loadCases[0].createBeamConcentratedLoad(member, [0, 1e3, 0, x], true)
  solver.solve()
  return span1.computeBendingMomentAt(solver.loadCases[0], 5)
}

const rows = ['x_m,MB_kNm_per_kN']
for (let at = 0; at <= 10; at += 0.5) {
  rows.push(`${at},${(momentAtB(at) / 1e3).toFixed(4)}`)
}
writeFileSync('influence.csv', rows.join('\n') + '\n')
```

```bash
node influence.ts
```

```text [influence.csv]
x_m,MB_kNm_per_kN
0,0.0000
0.5,-0.1237
1,-0.2400
1.5,-0.3412
2,-0.4200
2.5,-0.4688
3,-0.4800
...
```

สูตรปิดสำหรับสองช่วงที่ยาวเท่ากันคือ $M_B = -P\,a\,(L^2 - a^2)/4L^2$ ได้ $-0.46875$ kNm ที่ $a = 2.5$ m และตำแหน่งที่วิกฤตที่สุดคือ $a = L/\sqrt{3} = 2.887$ m เส้นนี้สมมาตร ทั้ง 21 แถวจึงจบที่ค่าเดียวกับตอนเริ่ม คือ 0 เหนือจุดรองรับ C

การสร้างตัวคำนวณใหม่ทุกตำแหน่งง่ายกว่าการแก้ไขตัวเดิม และใช้เวลาเพียงไม่กี่มิลลิวินาที ถ้าต้องการแก้ไขโมเดลที่คำนวณแล้วแทน ดู [คำนวณใหม่หลังแก้ไขโมเดล](/th/solver/solving#solving-again-after-a-change)

## ตัวคำนวณเบื้องหลัง HTTP endpoint {#a-solver-behind-an-http-endpoint}

เซิร์ฟเวอร์ขนาดเล็กที่ใช้เพียงโมดูล `http` ของ Node เอง คำนวณคานรองรับธรรมดาสำหรับช่วงและแรงกระทำใดก็ได้ที่ส่งมา:

```ts [server.ts]
import { createServer } from 'node:http'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** คานรองรับธรรมดา IPE 200 ยาว `span` m รับ `q` kN/m: M และการโก่งตัวที่กึ่งกลางช่วง */
const solveBeam = (span: number, q: number) => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [span, 0, 0], [DofID.Dz])
  const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  solver.solve()
  return {
    momentKNm: beam.computeBendingMomentAt(lc, span / 2) / 1e3,
    deflectionMm: beam.computeLocalDefl(lc, 2).w[1] * 1e3,
  }
}

createServer(async (req, res) => {
  try {
    let body = ''
    for await (const chunk of req) body += chunk
    const { span, q } = JSON.parse(body) as { span?: unknown; q?: unknown }
    if (typeof span !== 'number' || !(span > 0) || typeof q !== 'number') {
      throw new Error('Bad input')
    }
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify(solveBeam(span, q)) + '\n')
  } catch {
    // JSON ผิด ตัวเลขผิด หรือโมเดลที่คำนวณไม่ได้: ให้เซิร์ฟเวอร์ทำงานต่อ
    res.writeHead(400).end('Send {"span": metres, "q": kN/m}\n')
  }
}).listen(3000)
```

```bash
node server.ts &
curl -s localhost:3000 -d '{"span": 6, "q": 12}'
# {"momentKNm":54,"deflectionMm":49.62870377178149}
```

$qL^2/8 = 54$ kNm และ $5qL^4/384EI = 49.63$ mm บล็อก `try` มีความสำคัญ JSON ที่ไม่ถูกต้องจะ throw error และโมเดลที่ตัวคำนวณคำนวณไม่ได้ก็อาจ throw ด้วย ทั้งสองกรณีไม่ควรทำให้เซิร์ฟเวอร์ล่ม บริการสาธารณะควรจำกัดขนาดของคำขอและความยาวช่วงด้วย

## ในเบราว์เซอร์ {#in-the-browser}

โค้ดเดียวกันรันในหน้าเว็บได้โดยไม่ต้องแก้ และคำนวณบนอุปกรณ์ของผู้อ่าน รูปที่คำนวณสดทุกรูปบนเว็บไซต์นี้ก็ทำงานแบบนี้ import แพ็กเกจผ่าน bundler เช่น Vite หรือ Nuxt แล้ว [วาดผลลัพธ์](/th/solver/drawing) ด้วย @edubeam/plot โมเดลคำนวณเสร็จในไม่กี่มิลลิวินาที หน้าเว็บจึงคำนวณใหม่ได้ทุกครั้งที่มีอีเวนต์ input
