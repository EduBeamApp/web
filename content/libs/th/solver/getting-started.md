---
title: เริ่มต้นใช้งาน
description: "ติดตั้ง @edubeam/fem ตัวคำนวณไฟไนต์เอลิเมนต์เบื้องหลัง EduBeam แล้วคำนวณ ตรวจสอบ และอ่านผลของคานรองรับธรรมดาด้วย TypeScript สิบกว่าบรรทัด"
order: 1
group: เริ่มต้น
source: site
---

# เริ่มต้นใช้งาน {#getting-started}

@edubeam/fem คือตัวคำนวณไฟไนต์เอลิเมนต์ที่อยู่เบื้องหลัง [EduBeam]{.edubeam} แผนภาพ แรงปฏิกิริยา และการโก่งตัวทุกค่าที่แอปแสดงล้วนคำนวณจากไลบรารีนี้ ใช้ไลบรารีนี้คำนวณคาน โครงข้อแข็ง และโครงถักในระนาบจากโค้ดของคุณเองได้ ทั้งในเบราว์เซอร์และใน Node เช่น สร้างโจทย์พร้อมคำตอบ ตรวจการบ้าน ศึกษาผลของการเปลี่ยนพารามิเตอร์ หรือใส่ตัวคำนวณไว้เบื้องหลังหน้าเว็บ

::div{.actions}
[คำนวณคานแรกของคุณ](#a-simply-supported-beam) [ดูตัวอย่างโปรแกรม](/th/solver/beams)
::

ไลบรารีเขียนด้วย TypeScript มี type มาในตัว และเป็นซอฟต์แวร์เสรีภายใต้สัญญาอนุญาต GPL-3.0 ผู้สร้างคือ Bořek Patzák ซึ่งพัฒนาต่อร่วมกับ Jan Voříšek และผู้ร่วมพัฒนาคนอื่น ๆ

## ติดตั้ง {#install}

```bash
npm install @edubeam/fem
```

ใช้ได้ทั้ง `import` และ `require` ทั้งในเบราว์เซอร์และใน Node 18 ขึ้นไป และมี dependency เพียงตัวเดียวคือ [mathjs](https://mathjs.org) จนถึงเวอร์ชัน 0.3.0 ไลบรารีนี้ติดตั้งจาก GitHub ในชื่อ `ts-fem` ถ้าคุณเคยใช้ชื่อนั้น ให้เปลี่ยน import เป็น `@edubeam/fem` ส่วนอื่นไม่มีอะไรเปลี่ยน

ถ้าจะลองตัวอย่างด้านล่างในโฟลเดอร์ว่าง ให้ตั้งโฟลเดอร์นั้นเป็นโปรเจกต์ที่ใช้ `import` ก่อน แล้วจึงติดตั้ง:

```bash
npm init -y
npm pkg set type=module
npm install @edubeam/fem
```

ถ้า `package.json` ไม่มี `"type": "module"` ตัวอย่างก็ยังรันได้ แต่ Node จะแสดงคำเตือนก่อน

## คานแรกของคุณ {#a-simply-supported-beam}

คานเหล็ก IPE 200 ยาว 6 m วางบนจุดรองรับแบบหมุดและแบบล้อเลื่อน รับแรงแผ่กระจายสม่ำเสมอ 12 kN/m:

```ts [beam.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver

// ใช้หน่วย SI ทั้งหมด: m, N, Pa วัสดุเหล็กและหน้าตัด IPE 200
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

// โหนดที่ [x, y, z] หน่วยเมตร พร้อม DOF ที่จุดรองรับยึดไว้
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // จุดรองรับแบบหมุด
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // จุดรองรับแบบล้อเลื่อน
const beam = domain.createBeam2D(1, ['A', 'B'], 'steel', 'IPE200')

// 12 kN/m ตามแกน z ท้องถิ่นของชิ้นส่วน: ชี้ลงบนคานที่กำหนดจากซ้ายไปขวา
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad(1, [0, 12e3], true)

solver.solve()

console.log(beam.computeBendingMomentAt(lc, 3)) // N·m ที่กึ่งกลางช่วง
console.log(beam.computeShearForceAt(lc, 0)) // N ที่ A
console.log(beam.computeLocalDefl(lc, 2).w[1]) // m ที่กึ่งกลางช่วง
```

บันทึกเป็น `beam.ts` แล้วรัน `node beam.ts` (Node 22.18 ขึ้นไปรัน TypeScript ได้โดยตรง) ไฟล์นี้ไม่มี type annotation จึงบันทึกเป็น `beam.mjs` แทนได้ถ้าใช้ Node รุ่นเก่ากว่า ผลที่พิมพ์ออกมาคือ:

```text [เอาต์พุต]
54000
36000
0.04990940552616746
```

ค่าเหล่านี้ตรงกับค่าในตำรา คือ $M = qL^2/8 = 54$ kNm และ $V = qL/2 = 36$ kN ด้านล่างคือคานเดียวกันนี้ ซึ่งคำนวณในเบราว์เซอร์ของคุณด้วยตัวคำนวณตัวเดียวกัน:

::model-figure{caption="คานข้างต้น: ยาว 6 m หน้าตัด IPE 200 รับ 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9, g: 81e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 0.8333333 }
---
::

การโก่งตัว 49.91 mm มากกว่าค่าของคาน Euler–Bernoulli $5qL^4/384EI = 49.63$ mm อยู่ 0.28 mm ซึ่งไม่ใช่ความผิดพลาด ชิ้นส่วนนี้เป็นคาน Timoshenko และ 0.28 mm คือ $qL^2/8kGA$ ซึ่งเป็นการเสียรูปเนื่องจากแรงเฉือนของคานนี้ ถ้ากำหนด `k` ให้มีค่ามหาศาล เช่น `1e32` ส่วนต่างนี้จะหายไป ดู [การเสียรูปเนื่องจากแรงเฉือน](/th/solver/materials-sections#shear-deformation)

## โค้ดนี้ทำอะไร {#what-the-code-does}

::div{.steps}
### สร้างตัวคำนวณ {#make-a-solver}

`new LinearStaticSolver()` มาพร้อม `domain` ว่างซึ่งเก็บโมเดล และกรณีแรงกระทำหนึ่งกรณี คือ `solver.loadCases[0]`

### กำหนดโมเดล {#describe-the-model}

วัสดุและหน้าตัด โหนดพร้อมจุดรองรับ แล้วจึงชิ้นส่วนที่เชื่อมระหว่างโหนด ทุกอย่างมีชื่อกำกับ (label) เป็นสตริงหรือตัวเลข และส่วนอื่นของโมเดลอ้างถึงด้วยชื่อนี้ ดู [โหนดและจุดรองรับ](/th/solver/nodes-supports) [วัสดุและหน้าตัด](/th/solver/materials-sections) และ [ชิ้นส่วนและจุดหมุน](/th/solver/members-hinges)

### ใส่แรงกระทำ {#load-it}

แรงกระทำอยู่ในกรณีแรงกระทำ ได้แก่ แรงที่โหนด แรงกระทำบนชิ้นส่วน อุณหภูมิ และการทรุดตัวของจุดรองรับ ดู [แรงกระทำที่โหนดและบนชิ้นส่วน](/th/solver/loads)

### คำนวณ {#solve}

`solver.solve()` ประกอบเมทริกซ์และคำนวณทุกกรณีแรงกระทำ ดู [การคำนวณ](/th/solver/solving)

### อ่านผลลัพธ์ {#read-the-results}

แรงภายในที่จุดใดก็ได้บนชิ้นส่วน การโก่งตัว แรงปลาย การกระจัดที่โหนด และแรงปฏิกิริยา ดู [การอ่านผลลัพธ์](/th/solver/results) และดู [การวาดผลลัพธ์](/th/solver/drawing) สำหรับแผนภาพ
::

## สรุปหน่วยและเครื่องหมาย {#axes-and-signs}

ใส่ค่าเป็นหน่วย SI ก็ได้ผลเป็นหน่วย SI โมเดลอยู่ในระนาบ x–z โดย **แกน z ชี้ลง** ดังนั้น `fz` ที่เป็นบวกจะกดลง และยอดเสาสูง 4 m อยู่ที่ $z = -4$ ตำแหน่งบนชิ้นส่วนวัดเป็นเมตรจากโหนดแรก โมเมนต์บวกคือโมเมนต์ที่ทำให้เส้นใยล่างรับแรงดึง รายการทั้งหมดอยู่ในหน้า [หน่วยและเครื่องหมาย](/th/solver/conventions)

## หกเรื่องที่มักพลาด {#pitfalls}

1. **แกน z ชี้ลง** แรงกระทำเนื่องจากแรงโน้มถ่วงจึงมีค่าบวก และทุกอย่างที่อยู่สูงกว่าจุดรองรับมีพิกัด z เป็นลบ ดู [แกน](/th/solver/conventions#axes)
2. **ทิศของชิ้นส่วนกำหนดเครื่องหมายของ M และ w** กำหนดคานจากซ้ายไปขวาและเสาจากล่างขึ้นบน แล้วเครื่องหมายจะอ่านได้เหมือนในตำรา ดู [ทิศของชิ้นส่วน](/th/solver/conventions#member-direction)
3. **พารามิเตอร์ที่ขาดไปให้ผลเป็น `NaN` หรือค่าที่ไม่มีความหมาย ไม่ใช่ error** หน้าตัดต้องมี `a`, `iy` และ `k` วัสดุต้องมี `e` และต้องมี `g` ด้วย เว้นแต่ `k` มีค่ามหาศาล ดู [วัสดุและหน้าตัด](/th/solver/materials-sections)
4. **หลังเพิ่มโหนดหรือชิ้นส่วน หรือเปลี่ยนจุดรองรับ** ให้ตั้ง `solver.codeNumberGenerated = false` ก่อนคำนวณใหม่ ดู [คำนวณใหม่หลังแก้ไขโมเดล](/th/solver/solving#solving-again-after-a-change)
5. **แรงปฏิกิริยาได้มาเป็นเมทริกซ์ของ mathjs หรือเป็นอาร์เรย์** เรียงตามลำดับที่ระบุ DOF ของจุดรองรับไว้ ดู [แรงปฏิกิริยา](/th/solver/results#reactions)
6. **กลไกไม่ได้ทำให้เกิด error เสมอไป** การกระจัดขนาด $10^{12}$ m หมายความว่าโครงสร้างเคลื่อนที่ได้อย่างอิสระ ดู [เมื่อคำนวณไม่สำเร็จ](/th/solver/solving#when-solving-fails)

## อ่านต่อ {#next}

::card-grid{cols="2"}
:::card{title="ตัวอย่างโปรแกรม" icon="lucide:book-open" to="/th/solver/beams"}
โปรแกรมสมบูรณ์ที่ตรวจสอบแล้ว: คาน โครงข้อแข็ง โครงถัก แบบฝึกหัดพร้อมเฉลย และเซิร์ฟเวอร์ HTTP ขนาดเล็ก
:::
:::card{title="วาดผลลัพธ์" icon="lucide:chart-spline" to="/th/solver/drawing"}
ส่งโมเดลที่คำนวณแล้วให้ @edubeam/plot แล้วได้แผนภาพเป็น SVG ทั้งใน Vue และจากสคริปต์ Node
:::
:::card{title="เอกสารอ้างอิง API" icon="lucide:list-tree" to="/th/solver/reference"}
ทุกคลาส เมธอด และอาร์กิวเมนต์ พร้อมหน่วยและค่าที่คืนกลับมา
:::
:::card{title="ทฤษฎี" icon="lucide:sigma" to="/th/elements/beam"}
เอลิเมนต์คาน เมทริกซ์ความแข็ง และการแปลงพิกัด ในคู่มือทฤษฎีของ EduBeam
:::
::
