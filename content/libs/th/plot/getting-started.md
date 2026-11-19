---
title: เริ่มต้นใช้งาน
description: "ติดตั้ง @edubeam/plot วาดคานที่คำนวณด้วย @edubeam/fem พร้อมแรงกระทำ แรงปฏิกิริยา และโมเมนต์ดัดในแอป Vue 3 วาดใหม่เมื่อโมเดลเปลี่ยน และบันทึกเป็นไฟล์ SVG"
order: 1
group: เริ่มต้น
source: site
---

# เริ่มต้นใช้งาน

ไลบรารีวาดภาพ @edubeam/plot วาดคาน โครงข้อแข็ง และโครงถักในระนาบพร้อมผลการวิเคราะห์ออกมาเป็น SVG ทั้งชิ้นส่วน จุดรองรับ แรงกระทำ แรงปฏิกิริยา แผนภาพ N, V และ M และรูปร่างที่เสียรูป หน้าตาเหมือนภาพประกอบทุกภาพในเว็บไซต์นี้ สิ่งที่ต้องส่งให้คือโมเดลที่คำนวณแล้วด้วย [@edubeam/fem](/th/solver) ซึ่งเป็นตัวคำนวณเบื้องหลัง [EduBeam]{.edubeam} ส่วนการจัดวาง มาตราส่วน และตำแหน่งของตัวเลขทุกตัว ไลบรารีจัดการให้เอง

ผู้สอนใช้ไลบรารีนี้สร้าง [โจทย์และข้อสอบ](/th/plot/exercises) จากค่า seed ของการสุ่ม สร้าง [สไลด์ที่ค่อย ๆ เพิ่มเนื้อหา](/th/plot/slides) ทีละคลิก และวาดภาพประกอบเอกสารประกอบการสอน ทั้งบนหน้าเว็บและเป็นไฟล์สำหรับ LaTeX และ Word หน้า [ฝึกทำโจทย์](/th/practice) และ [เครื่องมือสร้างข้อสอบ](/th/exam) ของเว็บไซต์นี้ก็สร้างด้วยไลบรารีนี้

::div{.actions}
[วาดภาพแรก](#draw-a-solved-model) [สร้างโจทย์](/th/plot/exercises)
::

## ติดตั้ง {#install}

```bash
npm install @edubeam/plot @edubeam/fem vue
```

Vue 3.5 ขึ้นไปและตัวคำนวณเป็น peer dependencies แอปของคุณจึงมีแต่ละแพ็กเกจอยู่ชุดเดียว แพ็กเกจนี้เป็น ESM เท่านั้น มี type มาในตัว และไม่ต้องใช้ stylesheet ทำงานบน Node 20.19 ขึ้นไป ถ้าต้องการรันสคริปต์ TypeScript ตรง ๆ ด้วย `node script.ts` ต้องใช้ Node 22.18 ขึ้นไป

## วาดโมเดลที่คำนวณแล้ว {#draw-a-solved-model}

ใช้สองไฟล์ ไฟล์แรก `beams.ts` สร้างคานและคำนวณด้วย @edubeam/fem โค้ดเป็นฟังก์ชันธรรมดา โมเดลเดียวกันจึงใช้ได้ทั้งในหน้าเว็บ ในสไลด์ และในสคริปต์

```ts [beams.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** คานช่วงเดียวแบบรองรับธรรมดา ยาว `span` m รับ `q` kN/m คำนวณเสร็จแล้ว ตัวคำนวณใช้หน่วย SI */
export const simpleBeam = (span: number, q: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 }) // เหล็ก, Pa
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 }) // IPE 200 ไม่เสียรูปจากแรงเฉือน
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // หมุด
  domain.createNode('B', [span, 0, 0], [DofID.Dz]) // ล้อเลื่อน
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true) // N/m, +z ชี้ลง
  solver.solve()
  return solver
}
```

ไฟล์ที่สอง `BeamFigure.vue` ส่งตัวคำนวณให้ `StructurePlot` และบอกว่าจะวาดอะไร

```vue [BeamFigure.vue]
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams'

const beam = simpleBeam(6, 12)
</script>

<template>
  <StructurePlot :solver="beam" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
</template>
```

เท่านี้ก็ได้ภาพครบ: คานบนจุดรองรับ แรงกระทำ 12 kN/m แรงปฏิกิริยาสองค่า ค่าละ 36 kN และโมเมนต์ดัด $qL^2/8 = 54$ kNm ที่กึ่งกลางช่วง ซึ่งวาดไว้ทางด้านรับแรงดึง

::model-figure{caption="สิ่งที่ BeamFigure.vue วาด: ช่วงยาว 6 m รับแรง 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
labels: horizontal
---
::

ภาพกว้างเต็มคอนเทนเนอร์และกำหนดความสูงเอง ข้อความ สัญลักษณ์ และความหนาของเส้นมีขนาดคงที่เป็นพิกเซลไม่ว่าโครงสร้างจะใหญ่แค่ไหน ภาพจึงยังอ่านได้บนโทรศัพท์ ถ้าไม่ระบุ `layers` ภาพจะเลือกผลลัพธ์ให้เอง: M สำหรับคานและโครงข้อแข็ง N สำหรับโครงถัก [เลเยอร์](/th/plot/structure-plot#layers) ทั้งหมดอยู่ในหน้า `StructurePlot` ส่วนการสร้างโมเดลอธิบายไว้ใน [เอกสารของตัวคำนวณ](/th/solver/getting-started)

## เมื่อโมเดลเปลี่ยน {#when-the-model-changes}

ภาพอ่านค่าจากตัวคำนวณที่ส่งให้ แต่ไม่ได้คอยเฝ้าดูการเปลี่ยนแปลง เมื่อมีอะไรเปลี่ยน ให้คำนวณใหม่แล้วส่งตัวคำนวณตัวใหม่เข้าไป ซึ่ง `computed` ทำได้พอดี

```vue [LoadSlider.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams'

const q = ref(12) // kN/m
const beam = computed(() => simpleBeam(6, q.value))
</script>

<template>
  <input v-model.number="q" type="range" min="1" max="30" />
  <StructurePlot :solver="beam" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
</template>
```

คานแบบนี้คำนวณเสร็จในราวหนึ่งมิลลิวินาที ภาพจึงเปลี่ยนตามแถบเลื่อนได้ทันขณะลาก ถ้าแก้ค่าในตัวคำนวณตัวเดิมโดยตรงแทน ให้เพิ่มค่า prop `revision` แล้วภาพจะอ่านค่าใหม่

::callout{type="tip" title="อย่าให้ตัวคำนวณอยู่ใน reactivity แบบลึก"}
`computed`, prop หรือ `const` ธรรมดาเก็บตัวคำนวณไว้ตามที่เป็น ถ้าจะเก็บตัวคำนวณไว้ใน state ของคอมโพเนนต์ ให้ใช้ `shallowRef` หรือห่อด้วย `markRaw` เพราะ `ref` ธรรมดาจะทำให้ Vue ไล่ไปทั่วทั้งตัวคำนวณเพื่อทำให้เป็น reactive โดยไม่ได้ประโยชน์อะไร
::

## บันทึกเป็นไฟล์ {#save-it-as-a-file}

สำหรับภาพใน LaTeX, Word หรือ Inkscape ฟังก์ชัน `structureSvg` เขียนภาพเดียวกันออกมาเป็นไฟล์ SVG แบบ standalone ที่กำหนดสีไว้ตายตัว โดยไม่ต้องใช้ทั้ง Vue และเบราว์เซอร์ ใช้แค่ Node บันทึกโค้ดนี้เป็น `beam-svg.ts` ไว้ข้าง `beams.ts`

```ts [beam-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { simpleBeam } from './beams.ts'

const svg = structureSvg(modelFromSolver(simpleBeam(6, 12)), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
})
writeFileSync('beam.svg', svg)
```

รันด้วย `node beam-svg.ts` (Node 22.18 ขึ้นไป ถ้าเป็นเวอร์ชันเก่ากว่าให้ใช้ `npx tsx beam-svg.ts`) ตัวเลือกต่าง ๆ และวิธีนำไฟล์ไปใช้ใน LaTeX และ Word อยู่ในหัวข้อ [ไฟล์ SVG แบบ standalone](/th/plot/functions#a-standalone-svg-file)

## ภาพแผนภาพเรียงซ้อน {#the-stacked-figure}

`DiagramStack` วาดภาพที่มีอยู่ในตำรากลศาสตร์โครงสร้างทุกเล่ม: คานตรงพร้อมแรงกระทำ และแผนภาพ V(x), M(x) และ w(x) เรียงอยู่ข้างใต้บนแกน x เดียวกัน เมื่อใช้ `v-model:load-at` ผู้อ่านลากแรงกระทำเป็นจุดไปตามคานได้ และเห็นแผนภาพเปลี่ยนตาม

```vue
<DiagramStack v-model:load-at="at" :solver="solveWithLoadAt(at)" />
```

ตัวอย่างฉบับเต็มอยู่ในหน้า [DiagramStack](/th/plot/diagram-stack)

## ใช้ได้ทุกที่ {#use-it-everywhere}

ถ้าต้องการลงทะเบียนคอมโพเนนต์ทั้งสองแบบ global แทนการ import ในทุกไฟล์ที่ใช้

```ts [main.ts]
import { createApp } from 'vue'
import { EduBeamPlot } from '@edubeam/plot'
import App from './App.vue'

createApp(App).use(EduBeamPlot).mount('#app') // ใช้ <StructurePlot> และ <DiagramStack> ได้ในทุก template
```

การ import ตามชื่อทำให้ bundle เล็กกว่า หน้าที่ import เฉพาะ `StructurePlot` จะไม่มี `DiagramStack` หรือปลั๊กอินติดมาด้วย คอมโพเนนต์ทั้งสองเรนเดอร์ฝั่งเซิร์ฟเวอร์ได้ด้วย ทั้งใน Nuxt และ VitePress ดู [การฝังในหน้าเว็บ](/th/plot/embedding)

## ขั้นต่อไป {#next}

::card-grid{cols="2"}
:::card{title="โจทย์และข้อสอบ" icon="lucide:dices" to="/th/plot/exercises"}
โจทย์ไม่ซ้ำกันสำหรับนักศึกษาแต่ละคนจากค่า seed พร้อมเฉลย จะพิมพ์ออกมาหรือบันทึกไว้ใช้กับ LaTeX ก็ได้
:::
:::card{title="สไลด์และเอกสารประกอบการสอน" icon="lucide:presentation" to="/th/plot/slides"}
ภาพที่ค่อย ๆ เพิ่มเนื้อหาทีละคลิกใน Slidev, Vue หรือ Beamer และภาพเดียวกันสำหรับเอกสารประกอบการสอน
:::
:::card{title="StructurePlot" icon="lucide:frame" to="/th/plot/structure-plot"}
เลเยอร์ เส้นบอกขนาด ภาพย่อ ขนาด หน่วย และการอ่านค่าด้วยตัวชี้
:::
:::card{title="DiagramStack" icon="lucide:rows-3" to="/th/plot/diagram-stack"}
คานเหนือแผนภาพ V, M และ w พร้อมแรงกระทำที่ผู้อ่านลากได้
:::
::
