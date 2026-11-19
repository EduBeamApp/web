---
title: สไลด์และเอกสารประกอบการสอน
description: "ภาพประกอบการบรรยายด้วย @edubeam/plot ที่ค่อย ๆ เพิ่มเนื้อหาทีละคลิกใน Slidev, Vue หรือ Beamer คำนวณสด และใช้ในเอกสาร PowerPoint และ Word เป็นไฟล์ SVG"
order: 6
source: site
---

# สไลด์และเอกสารประกอบการสอน

แสดงโครงสร้างตามลำดับที่คุณอธิบาย: เริ่มจากรูปทรง ตามด้วยจุดรองรับและแรงกระทำ จากนั้นแรงปฏิกิริยา และสุดท้ายโมเมนต์ดัด ภาพที่วาดจากโมเดลที่คำนวณแล้วจะค่อย ๆ ประกอบขึ้นในที่เดิม คลิกละหนึ่งเลเยอร์ และถูกต้องเสมอ โมเดลเดียวกันยังใช้สร้างภาพสำหรับเอกสารประกอบการสอนได้ด้วย

![สไลด์ Slidev ที่คลิกที่ 0, 2 และ 4: โหนดของโครงข้อแข็งพอร์ทัลพร้อมเส้นบอกขนาด ต่อมาโครงข้อแข็งบนจุดรองรับพร้อมแรงกระทำ และสุดท้ายแรงปฏิกิริยาและโมเมนต์ดัด](/screenshots/th/p2p-plot-slidev-steps.webp){.shot-md}

## ภาพที่ค่อย ๆ ประกอบขึ้น {#a-figure-that-builds-up}

ใช้สองไฟล์ `frame.ts` สร้างโครงสร้างและคำนวณ

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** โครงข้อแข็งพอร์ทัลขนาด 6 m × 4 m ฐานเสาเป็นหมุด แรง 10 kN/m บนคาน และแรง 15 kN ดันที่ B */
export const portalFrame = (): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 }) // IPE 300
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [0, 0, -4]) // z ชี้ลง: ขึ้นไป 4 m
  domain.createNode('C', [6, 0, -4])
  domain.createNode('D', [6, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  domain.createBeam2D(2, ['B', 'C'], 1, 1)
  domain.createBeam2D(3, ['C', 'D'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(2, [0, 10e3], true)
  solver.loadCases[0].createNodalLoad('B', { [DofID.Dx]: 15e3 })
  solver.solve()
  return solver
}
```

`BuildUp.vue` วาดโครงสร้างเป็นขั้น ๆ แต่ละขั้นระบุเลเยอร์ที่แสดง และ `reserve` จัดวางทุกเลเยอร์ไว้ตั้งแต่คลิกแรก แต่ละเลเยอร์จึงค่อย ๆ ปรากฏในตำแหน่งที่ควรอยู่ และไม่มีอะไรขยับ

```vue [BuildUp.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { StructurePlot, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame'

const props = defineProps<{ step: number }>()

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'], // รูปทรง
  ['nodeLabels', 'members', 'supports'], // โครงสร้าง
  ['nodeLabels', 'members', 'supports', 'loads'], // แรงกระทำ
  ['members', 'supports', 'loads', 'reactions'], // แรงปฏิกิริยา
  ['members', 'supports', 'reactions', 'M'], // และโมเมนต์ดัด
]
const all = [...new Set(stages.flat())] // จัดวางไว้ตั้งแต่ขั้นแรก ภายหลังจึงไม่มีอะไรขยับ
const layers = computed(() => stages[Math.min(props.step, stages.length - 1)])

const frame = portalFrame()
</script>

<template>
  <StructurePlot :solver="frame" :layers="layers" :reserve="all" :height="360" />
</template>
```

เลเยอร์หายไปได้ด้วย ขั้นสุดท้ายเอาแรงกระทำออกเพื่อให้โมเมนต์มีที่ว่าง `:height="360"` ทำให้ภาพอยู่ในกรอบสไลด์ เส้นของชิ้นส่วนจะค่อย ๆ ลากจากปลายหนึ่งไปอีกปลายเมื่อปรากฏครั้งแรก และเลเยอร์ค่อย ๆ ปรากฏภายในครึ่งวินาที ทั้งสองอย่างปิดอยู่ภายใต้ `prefers-reduced-motion` และ `:animate="false"` ปิดให้ทุกคน ถ้าต้องการให้ช้าลงสำหรับห้องบรรยาย ดู [ปรับแต่งภาพเคลื่อนไหว](/th/plot/theming#restyling-the-animation)

## ใน Slidev {#in-slidev}

[Slidev](https://sli.dev) สร้างสไลด์จาก Markdown ด้วย Vue คอมโพเนนต์จึงใช้ในนั้นได้ทันที ติดตั้งไลบรารีในโปรเจกต์ของชุดสไลด์

```bash
npm install @edubeam/plot @edubeam/fem
```

ใส่ `frame.ts` และ `BuildUp.vue` ไว้ในโฟลเดอร์ `components/` ของชุดสไลด์ แล้วให้จำนวนคลิกของสไลด์กำหนดขั้นใน `slides.md`

```md [slides.md]
---
clicks: 4
---

# From geometry to bending moment

<BuildUp :step="$clicks" />
```

`clicks: 4` ให้สไลด์มีสี่คลิก และ `$clicks` นับคลิกเริ่มจาก 0 กดปุ่มลูกศรแต่ละครั้งจะแสดงขั้นถัดไป และกดย้อนกลับก็ซ่อนขั้นนั้นอีกครั้ง `slidev export` สร้างชุดสไลด์เป็น PDF และถ้าใส่ `--with-clicks` จะได้หน้าละหนึ่งคลิก

## ในสไลด์ Vue แบบอื่น {#in-any-vue-slides}

ในระบบสไลด์อื่น ให้เก็บค่าขั้นไว้เอง

```vue
<script setup lang="ts">
import { ref } from 'vue'
import BuildUp from './BuildUp.vue'

const step = ref(0)
</script>

<template>
  <BuildUp :step="step" />
  <button type="button" @click="step = Math.max(0, step - 1)">Back</button>
  <button type="button" @click="step++">Next</button>
</template>
```

## คำนวณสดในห้องบรรยาย {#solve-it-live}

ตัวคำนวณใช้เวลาเพียงไม่กี่มิลลิวินาทีสำหรับโครงข้อแข็งแบบนี้ ระหว่างบรรยายจึงเปลี่ยนโครงสร้างแล้วคำนวณได้ทันที ผูกแรงกระทำไว้กับแถบเลื่อน แล้วส่งโมเดลที่คำนวณใหม่เข้าไปทุกครั้ง แบบในหัวข้อ [เมื่อโมเดลเปลี่ยน](/th/plot/getting-started#when-the-model-changes)

- **แรงกระทำเคลื่อนที่** [DiagramStack](/th/plot/diagram-stack#a-load-the-reader-can-drag) ให้นักศึกษาลากแรงกระทำเป็นจุดไปตามคาน และเห็นแรงเฉือนและโมเมนต์ดัดเปลี่ยนตาม
- **เทียบกรณีข้างกัน** กำหนด [`diagramScale`](/th/plot/structure-plot#several-plots-at-one-scale) ให้คงที่ แล้วสองภาพจะวาดโมเมนต์ด้วยมาตราส่วนเดียวกัน ค่าที่มากกว่าจึงดูใหญ่กว่า
- **อ่านค่า** เมื่อเปิด `hover` การชี้ที่ชิ้นส่วนจะทำเครื่องหมายค่าที่ปลายออร์ดิเนตของแผนภาพแต่ละแผนภาพ ดู [การอ่านค่า](/th/plot/structure-plot#reading-values)

## ภาพสำหรับ Beamer, PowerPoint และ Word {#figures-for-beamer-powerpoint-and-word}

ชุดสไลด์ที่ทำด้วย LaTeX Beamer หรือ PowerPoint และเอกสารที่เขียนด้วย Word รับภาพเป็นไฟล์ `structureSvg` เขียนภาพเป็น SVG แบบ standalone ที่กำหนดสีไว้ตายตัว และจัดวางแบบเดียวกับที่ `StructurePlot` จัดวาง สคริปต์ Node `frame-svg.ts` วางไว้ข้าง `frame.ts`

```ts [frame-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![โครงข้อแข็งพอร์ทัลเป็นไฟล์ SVG แบบ standalone ที่เรนเดอร์ด้วย CairoSVG: แรงกระทำ แรงปฏิกิริยา 20 และ 40 ชี้ขึ้น และ 2.3 และ 12.7 ในแนวนอน และโมเมนต์ดัดตั้งแต่ −50.7 ที่ C ถึง 29.3 ในคาน](/screenshots/th/p2p-plot-frame-svg.webp){.shot-lg}

PowerPoint และ Word (2019 และ Microsoft 365) แทรก SVG ได้โดยตรง LaTeX ใช้เป็น PDF: แปลงด้วย `cairosvg frame.svg -o frame.pdf` หรือ Inkscape หรือให้ `\includesvg` ของแพ็กเกจ `svg` แปลงให้ รายละเอียดอยู่ใน [รูปสำหรับ LaTeX และ Word](/th/plot/exercises#figures-for-latex-and-word) และตัวเลือกทั้งหมดอยู่ใน [ไฟล์ SVG แบบ standalone](/th/plot/functions#a-standalone-svg-file)

### ภาพที่ค่อย ๆ ประกอบขึ้นใน Beamer {#a-build-up-in-beamer}

ไฟล์แต่ละไฟล์ปรับขนาดให้พอดีกับเลเยอร์ที่วาด ไฟล์ที่เขียนแยกกันทีละขั้นจึงวางไม่ตรงกัน ให้ `structureSvg` ใช้ `reserve` ชุดเดียวกับ `BuildUp.vue` คือทุกเลเยอร์ของทุกขั้น แล้วทุกไฟล์จะมีขนาดเท่ากันและโครงสร้างอยู่ที่เดียวกัน `frame-stages.ts` เขียนไฟล์ขั้นละหนึ่งไฟล์

```ts [frame-stages.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'],
  ['nodeLabels', 'members', 'supports'],
  ['nodeLabels', 'members', 'supports', 'loads'],
  ['members', 'supports', 'loads', 'reactions'],
  ['members', 'supports', 'reactions', 'M'],
]
const all = [...new Set(stages.flat())]
const frame = modelFromSolver(portalFrame())

stages.forEach((layers, i) => {
  writeFileSync(`frame-${i + 1}.svg`, structureSvg(frame, { layers, reserve: all }))
})
```

แปลงไฟล์เป็น PDF

```bash
for i in 1 2 3 4 5; do cairosvg frame-$i.svg -o frame-$i.pdf; done
```

แล้วให้แต่ละไฟล์มี overlay ของตัวเอง แต่ละไฟล์มีภาพของทั้งขั้น เฟรมของ Beamer จึงแสดงทีละไฟล์ และเพราะไฟล์วางตรงกัน การคลิกแต่ละครั้งจึงดูเหมือนเพิ่มเลเยอร์หนึ่งชั้น

```latex [lecture.tex]
\begin{frame}{From geometry to bending moment}
  \centering
  \includegraphics<1>[width=0.8\linewidth]{frame-1.pdf}%
  \includegraphics<2>[width=0.8\linewidth]{frame-2.pdf}%
  \includegraphics<3>[width=0.8\linewidth]{frame-3.pdf}%
  \includegraphics<4>[width=0.8\linewidth]{frame-4.pdf}%
  \includegraphics<5>[width=0.8\linewidth]{frame-5.pdf}
\end{frame}
```

ใน PowerPoint ให้ใส่ไฟล์ทั้งห้าไว้ในสไลด์ห้าสไลด์ติดกันโดยไม่มีการเปลี่ยนภาพ (transition) ระหว่างสไลด์ แต่ละขั้นจะดูเหมือนการคลิกในการบรรยาย

## เอกสารประกอบการสอนและเอกสารแจก {#notes-and-handouts}

- **เอกสารประกอบการสอนบนเว็บ** VitePress และ Nuxt เรนเดอร์ภาพตอน build ภาพจึงอยู่ใน HTML ก่อนที่สคริปต์ใด ๆ จะทำงาน ดู [การฝังในหน้าเว็บ](/th/plot/embedding)
- **เอกสารฉบับพิมพ์** เขียนภาพด้วย `structureSvg` ลงในหน้า HTML แล้วสั่งพิมพ์ แบบที่ [สคริปต์พิมพ์ข้อสอบ](/th/plot/exercises#print-a-test) ทำ หรือใส่ไฟล์ใน LaTeX หรือ Word
- **โมเดลเดียว ทุกภาพ** `frame.ts` ไฟล์เดียวกันใช้สร้างทั้งสไลด์ เอกสารประกอบการสอน และโจทย์แบบฝึกหัด ทั้งหมดจึงไม่มีวันขัดแย้งกัน
