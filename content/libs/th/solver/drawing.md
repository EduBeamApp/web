---
title: การวาดผลลัพธ์
description: "แปลงโมเดล @edubeam/fem ที่คำนวณแล้วเป็นแผนภาพด้วย @edubeam/plot ในคอมโพเนนต์ Vue เป็นไฟล์ SVG จากสคริปต์ Node หรือเป็น JSON ไว้วาดภายหลัง"
order: 11
source: site
---

# การวาดผลลัพธ์ {#drawing-the-results}

[@edubeam/plot](/th/plot) วาดโมเดลที่คำนวณแล้วให้ออกมาเหมือนรูปบนเว็บไซต์นี้ ได้แก่ ชิ้นส่วน จุดรองรับ แรงกระทำ แรงปฏิกิริยา แผนภาพ N, V และ M และรูปร่างที่เสียรูป เป็น SVG เพียงส่งตัวคำนวณให้ ไลบรารีจะอ่านทุกอย่างที่ต้องใช้เอง

```bash
npm install @edubeam/plot @edubeam/fem vue
```

## ในคอมโพเนนต์ Vue {#in-a-vue-component}

```vue [BeamFigure.vue]
<script setup lang="ts">
import { markRaw } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot } from '@edubeam/plot'

// คานรองรับธรรมดายาว 6 m รับ 12 kN/m ในหน่วย SI: m, N, Pa
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // จุดรองรับแบบหมุด
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // จุดรองรับแบบล้อเลื่อน
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

// อ่านอย่างเดียว ไม่ต้อง watch: markRaw กันไม่ให้ Vue ทำตัวคำนวณเป็น reactive
const beam = markRaw(solver)
</script>

<template>
  <StructurePlot
    :solver="beam"
    :layers="['members', 'supports', 'loads', 'reactions', 'M']"
  />
</template>
```

คอมโพเนนต์นี้วาดแรงปฏิกิริยา 36 kN และโมเมนต์ 54 kNm เหมือนรูปที่คำนวณสดนี้:

::model-figure{caption="สิ่งที่ BeamFigure.vue วาด"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
---
::

`StructurePlot` วาดกรณีแรงกระทำ 0 ส่วน prop `loadCase` เลือกกรณีอื่นจาก `solver.loadCases` คอมโพเนนต์ไม่ได้ watch ตัวคำนวณ หลังแก้ไขโมเดลและคำนวณใหม่ ให้เปลี่ยน prop `revision` เพื่อวาดใหม่ ตัวเลือกทั้งหมดอยู่ในหน้า [StructurePlot](/th/plot/structure-plot)

## ไม่ใช้เบราว์เซอร์ {#without-a-browser}

`structureSvg` ซึ่งเพิ่มเข้ามาใน @edubeam/plot 0.2 เขียนภาพเดียวกันเป็นไฟล์ SVG แบบ standalone ด้วยสีตายตัวที่ Word, Inkscape และเครื่องมือของ LaTeX อ่านได้ ไม่ต้องใช้เบราว์เซอร์หรือคอมโพเนนต์ Vue มีเพียงสคริปต์ Node:

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { modelFromSolver, structureSvg } from '@edubeam/plot'

// คานเดียวกับใน BeamFigure.vue
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

const svg = structureSvg(modelFromSolver(solver), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
  width: 640,
})
writeFileSync('beam.svg', svg)
```

ไฟล์แสดงสิ่งเดียวกับรูปที่คำนวณสดด้านบน ด้วยสีสำหรับงานพิมพ์ `width` กำหนดขนาดเป็นพิกเซล เพราะไม่มีกรอบให้วัด ถ้าต้องการหน้ากระดาษที่รวมหลายรูปสำหรับพิมพ์ ให้ใส่ไฟล์เหล่านี้หลายไฟล์ในหน้า HTML เดียว อย่างที่ [สคริปต์พิมพ์ข้อสอบ](/th/plot/exercises#print-a-test) ของ @edubeam/plot ทำ โดยไม่ใช้ทั้ง Vue และเบราว์เซอร์ ตัวเลือกของ `structureSvg` อยู่ในหน้า [ฟังก์ชัน](/th/plot/functions#a-standalone-svg-file)

## ส่งภาพ ไม่ต้องส่งตัวคำนวณ {#ship-the-drawing-not-the-solver}

`modelFromSolver` แปลงโมเดลที่คำนวณแล้วเป็นข้อมูลธรรมดาที่แปลงเป็น JSON ได้ ได้แก่ เรขาคณิต แรงกระทำ แรงปฏิกิริยา และผลลัพธ์ของทุกชิ้นส่วนในรูปพหุนามที่แม่นตรง คำนวณตอน build ส่งไฟล์ JSON ไปกับเว็บ แล้ววาดด้วย prop `model` แทน `solver`:

```ts
import { modelFromSolver } from '@edubeam/plot'

// ... คานที่คำนวณแล้วจาก to-svg.ts
writeFileSync('beam.json', JSON.stringify(modelFromSolver(solver)))
```

หน้าที่แสดงรูปจึงไม่ต้องคำนวณอะไร งานคำนวณทำเพียงครั้งเดียวตอน build หน้า [การฝังในหน้าเว็บ](/th/plot/embedding#ship-the-drawing-not-the-solver) แสดงฝั่งคอมโพเนนต์ และหน้า [โมเดลสำหรับวาดภาพ](/th/plot/model) อธิบายรูปแบบข้อมูล

ส่วนอื่นทั้งหมด ตั้งแต่สี ค่าที่แสดงเมื่อชี้เมาส์ ไปจนถึงแรงกระทำที่ลากได้ อยู่ใน [เอกสารของ @edubeam/plot](/th/plot/getting-started)
