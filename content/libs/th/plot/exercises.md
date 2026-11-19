---
title: โจทย์และข้อสอบ
description: "สร้างโจทย์ไม่ซ้ำกันให้นักศึกษาแต่ละคนจากค่า seed ด้วย @edubeam/fem และ @edubeam/plot พร้อมเฉลยที่ถูกเสมอ บนหน้าเว็บ ข้อสอบพิมพ์ หรือ SVG สำหรับ LaTeX และ Word"
order: 5
group: การใช้งาน
source: site
---

# โจทย์และข้อสอบ

เขียนฟังก์ชันที่สร้างโครงสร้างจากค่า seed ของการสุ่มไว้ครั้งเดียว แล้วคุณจะมีโจทย์ให้นักศึกษาทุกคนได้ทุกสัปดาห์ แต่ละข้อมีเฉลยที่ถูกต้องเสมอ เพราะ @edubeam/fem คำนวณให้ และ @edubeam/plot วาดทั้งรูปโจทย์และรูปเฉลยจากโมเดลเดียวกัน

กดปุ่ม **โจทย์ใหม่** ด้านล่าง กดแต่ละครั้งจะได้ค่า seed ใหม่ แล้วเบราว์เซอร์ของคุณจะสร้างโจทย์ คำนวณ และวาดออกมา

::exercise-generator
::

เดโมนี้วาดโจทย์ของสองหน้าในเว็บไซต์นี้ ซึ่งสร้างจากส่วนประกอบที่อธิบายในหน้านี้ทั้งคู่ ได้แก่ หน้า [ฝึกทำโจทย์](/th/practice) ซึ่งนักศึกษาใส่แรงปฏิกิริยาและโมเมนต์หรือแรงในชิ้นส่วนที่มีค่ามากที่สุด แล้วตรวจคำตอบได้ทันที และ [เครื่องมือสร้างข้อสอบ](/th/exam) ซึ่งพิมพ์ข้อสอบคนละชุดให้นักศึกษาแต่ละคนพร้อมเฉลย และบันทึกรูปเป็นไฟล์ SVG และคำตอบเป็น CSV ลองใช้สองหน้านี้ก่อนเขียนของคุณเอง

## ทำงานอย่างไร {#how-it-works}

1. **ค่า seed เลือกตัวเลข** ตัวสุ่มแบบกำหนดค่า seed ได้จะให้โจทย์เดิมทุกครั้งเมื่อใช้ค่า seed เดิม ค่า seed ที่พิมพ์ไว้บนแผ่นโจทย์จึงพาไปหาเฉลยได้เสมอ
2. **ตัวคำนวณหาเฉลย** @edubeam/fem คำนวณโครงสร้างแต่ละข้อ แรงปฏิกิริยาและโมเมนต์จึงมาจากตัวคำนวณ ไม่ได้มาจากสูตรที่คุณอาจเขียนผิด
3. **@edubeam/plot วาดทั้งโจทย์และเฉลย** รูปโจทย์แสดงโครงสร้างพร้อมชื่อโหนด เส้นบอกขนาด และชื่อของแรงปฏิกิริยาที่ไม่ทราบค่า รูปเฉลยบอกค่าของแรงปฏิกิริยาและเพิ่มแผนภาพ

จากตรงนี้ไปจนถึงข้อสอบฉบับพิมพ์ใช้ไฟล์สั้น ๆ เพียงไม่กี่ไฟล์ ได้แก่ [ตัวสร้างโจทย์](#the-generator) [คอมโพเนนต์](#the-exercise-in-a-page) สำหรับหน้าเว็บ และ [สคริปต์](#print-a-test) ที่พิมพ์ข้อสอบหรือ [เขียนรูป](#figures-for-latex-and-word) สำหรับ LaTeX และ Word คัดลอกไฟล์เหล่านี้ไปไว้ในโปรเจกต์ที่ [ติดตั้งไลบรารี](/th/plot/getting-started#install) แล้ว สคริปต์รันด้วย `node` ตั้งแต่เวอร์ชัน 22.18 หรือด้วย `npx tsx` ในเวอร์ชันที่เก่ากว่า

## ตัวสร้างโจทย์ {#the-generator}

โมดูลเดียว `exercise.ts` เปลี่ยนค่า seed ให้เป็นโจทย์ โจทย์คือคานบนจุดรองรับแบบหมุดและแบบล้อเลื่อน ครึ่งหนึ่งของโจทย์มีส่วนยื่นที่มีแรงกระทำเป็นจุดที่ปลาย ทั้งสองแบบเป็นโครงสร้างดีเทอร์มิเนท ทุกค่า seed จึงคำนวณด้วยมือได้เช่นเดียวกับด้วยตัวคำนวณ

```ts [exercise.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { extremes, modelFromSolver, type PlotModel } from '@edubeam/plot'

export interface Exercise {
  readonly seed: number
  readonly statement: string
  /** โครงสร้างที่คำนวณแล้วในรูปข้อมูลธรรมดา: ใช้วาดทั้งรูปโจทย์และรูปเฉลย */
  readonly model: PlotModel
  /** แรงปฏิกิริยาที่จุดรองรับ บวกเมื่อชี้ขึ้น, N และโมเมนต์ดัดสุดขีด, N·m */
  readonly key: { RA: number; RB: number; mMax: number; mMin: number }
}

/** mulberry32: ตัวสุ่มขนาดเล็กแบบกำหนดค่า seed ได้ ค่า seed หนึ่งจึงให้โจทย์เดิมเสมอ */
const random = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), seed | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export const makeExercise = (seed: number): Exercise => {
  const r = random(seed)
  const pick = <T>(xs: readonly T[]): T => xs[Math.floor(r() * xs.length)]
  const int = (lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1))

  // ช่วงคานบนหมุดและล้อเลื่อน ครึ่งหนึ่งมีส่วนยื่น เป็นดีเทอร์มิเนท จึงคำนวณได้เสมอ
  const L = pick([4, 5, 6]) // m
  const c = pick([0, 0, 1, 1.5, 2]) // ระยะยื่น, m
  const q = int(4, 12) // kN/m บนช่วง
  const F = int(2, 6) * 5 // kN ที่ปลายยื่น หรือที่ระยะ `a` จาก A ถ้าไม่มีส่วนยื่น
  const a = int(1, L - 1) // m

  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  if (c > 0) {
    domain.createNode('C', [L + c, 0, 0])
    domain.createBeam2D(2, ['B', 'C'], 1, 1)
    lc.createNodalLoad('C', { [DofID.Dz]: F * 1e3 })
  } else {
    lc.createBeamConcentratedLoad(1, [0, F * 1e3, 0, a], true)
  }
  solver.solve()

  const statement =
    c > 0
      ? `Span L = ${L} m with an overhang c = ${c} m. q = ${q} kN/m on the span, F = ${F} kN at the tip C.`
      : `Span L = ${L} m. q = ${q} kN/m over the span, F = ${F} kN at ${a} m from A.`

  // เฉลยจากโมเดลที่คำนวณแล้ว: แรงปฏิกิริยา (z ชี้ลง ทิศขึ้นจึงเป็นลบ) และค่าสุดขีดที่แม่นตรงของ M
  const model = modelFromSolver(solver)
  const { reactions, members } = model.results!
  const up = (node: string) => -(reactions.find((x) => x.node === node && x.dof === 'dz')?.value ?? 0)
  const m = Object.values(members).flatMap((member) => extremes(member.M) ?? [])
  const mMax = Math.max(...m.map((e) => e.max.value))
  const mMin = Math.min(...m.map((e) => e.min.value))

  return { seed, statement, model, key: { RA: up('A'), RB: up('B'), mMax, mMin } }
}
```

`modelFromSolver` อ่านโครงสร้างที่คำนวณแล้วออกมาเป็น [โมเดลสำหรับวาดภาพ](/th/plot/model) ซึ่งเป็นข้อมูลธรรมดาที่มีแรงปฏิกิริยาและผลลัพธ์ของชิ้นส่วนทุกชิ้นในรูปพหุนามที่แม่นตรง `extremes` จึงหาโมเมนต์สุดขีดได้แม่นตรง ไม่ได้ประมาณจากค่าที่จุดตัวอย่าง โจทย์เก็บไว้เฉพาะโมเดลนี้ ไม่ต้องใช้ตัวคำนวณอีกต่อไป

ค่า seed 5 ให้โจทย์ *“Span L = 6 m with an overhang c = 1.5 m. q = 5 kN/m on the span, F = 25 kN at the tip C.”* เฉลยคือ $R_A = (5 \cdot 6 \cdot 3 - 25 \cdot 1.5)/6 = 8.75$ kN, $R_B = 5 \cdot 6 + 25 - 8.75 = 46.25$ kN, $M_B = -25 \cdot 1.5 = -37.5$ kNm เหนือจุดรองรับ และ $M = 8.75^2/(2 \cdot 5) = 7.66$ kNm ในช่วง ตรงตำแหน่งที่แรงเฉือนเป็นศูนย์ ตัวคำนวณให้ผลตรงกันจนถึงหลักสุดท้าย

## บนหน้าเว็บ {#the-exercise-in-a-page}

คอมโพเนนต์ `ExerciseCard.vue` วาดรูปโจทย์ หรือวาดเฉลยเมื่อใส่ `answers`

```vue [ExerciseCard.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { formatQuantity, KN_UNITS, StructurePlot, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise'

const props = defineProps<{ seed: number; answers?: boolean }>()
const exercise = computed(() => makeExercise(props.seed))

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']
const twoDecimals = new Intl.NumberFormat('en', { maximumFractionDigits: 2 })
const kN = (si: number) => formatQuantity(si, KN_UNITS.force, twoDecimals)
const kNm = (si: number) => formatQuantity(si, KN_UNITS.moment, twoDecimals)
</script>

<template>
  <article>
    <h3>Exercise {{ seed }}</h3>
    <p>{{ exercise.statement }} Find the reactions and draw the bending moment diagram.</p>
    <StructurePlot
      :model="exercise.model"
      :layers="answers ? key : sheet"
      :reserve="[...sheet, ...key]"
      :reaction-labels="answers ? 'values' : 'names'"
      :reserve-reaction-labels="['names', 'values']"
    />
    <p v-if="answers">
      R<sub>A</sub> = {{ kN(exercise.key.RA) }}, R<sub>B</sub> = {{ kN(exercise.key.RB) }},
      M from {{ kNm(exercise.key.mMin) }} to {{ kNm(exercise.key.mMax) }}
    </p>
  </article>
</template>
```

```vue
<ExerciseCard :seed="5" />
<ExerciseCard :seed="5" answers />
```

การ์ดที่สองลงท้ายด้วย *R<sub>A</sub> = 8.75 kN, R<sub>B</sub> = 46.25 kN, M from −37.5 kNm to 7.66 kNm* `formatQuantity` เขียนหน่วยและเครื่องหมายลบจริง (−) แบบเดียวกับที่ภาพเขียน

ในรูปโจทย์ `reaction-labels="names"` วาดแรงปฏิกิริยาเป็นตัวไม่ทราบค่า คือมีลูกศรในทุกทิศทางที่จุดรองรับยึดไว้ ชี้ไปทางที่นับเป็นบวก (ไปทางขวา ชี้ขึ้น ทวนเข็มนาฬิกา) และตั้งชื่อเป็น *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>* แทนการบอกขนาด เครื่องหมายของคำตอบทุกค่าจึงกำหนดไว้บนรูป แรงปฏิกิริยาที่กระทำในทิศตรงข้ามมีค่าเป็นลบ ส่วนรูปเฉลยเขียนค่าไว้

`reserve` จัดวางเลเยอร์ของทั้งสองมุมมองไว้ตั้งแต่แรก เมื่อเปิด `answers` เช่น ด้วยปุ่ม *ดูเฉลย* สำหรับการเรียนด้วยตนเอง แผนภาพจะค่อย ๆ ปรากฏขึ้นในตำแหน่งที่ควรอยู่ ([ภาพที่ค่อย ๆ ประกอบขึ้น](/th/plot/structure-plot#figures-that-build-up)) `reserve-reaction-labels` ทำแบบเดียวกันกับแรงปฏิกิริยา คานจึงอยู่กับที่ขณะที่ชื่อเปลี่ยนเป็นค่า ดู [แรงปฏิกิริยาเป็นตัวไม่ทราบค่า](/th/plot/structure-plot#reactions-as-unknowns)

## ข้อสอบฉบับพิมพ์ {#print-a-test}

สำหรับการสอบข้อเขียน สคริปต์พิมพ์ข้อสอบ `print-test.ts` ซึ่งรันด้วย Node จะเขียนโจทย์ให้นักศึกษาคนละหนึ่งหน้า แล้วตามด้วยเฉลย `structureSvg` เปลี่ยนแต่ละโมเดลให้เป็นข้อความ SVG สคริปต์จึงไม่ต้องใช้ทั้ง Vue และเบราว์เซอร์

```ts [print-test.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const students = ['Ada', 'Ben', 'Cleo']
const exercises = students.map((_, i) => makeExercise(1000 + i)) // ค่า seed 1000, 1001, …

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']
const task = 'Find the reactions and draw the bending moment diagram.'

const pages = [
  ...exercises.map((e, i) => `<h2>${students[i]}, exercise ${e.seed}</h2>
    <p>${e.statement} ${task}</p>${structureSvg(e.model, { layers: sheet, reactionLabels: 'names' })}`),
  ...exercises.map((e) => `<h2>Key, exercise ${e.seed}</h2>
    ${structureSvg(e.model, { layers: key })}`),
]

const style = `body { font: 15px/1.5 system-ui, sans-serif; max-width: 640px; margin: 2rem auto }
  section { break-after: page }`
writeFileSync('test.html', `<!doctype html><meta charset="utf-8"><title>Test</title>
  <style>${style}</style>${pages.map((page) => `<section>${page}</section>`).join('\n')}`)
```

```bash
node print-test.ts
```

เปิด `test.html` ในเบราว์เซอร์แล้วสั่งพิมพ์ หรือบันทึกเป็น PDF โจทย์ของนักศึกษาแต่ละคนและเฉลยแต่ละชุดจะได้หน้าของตัวเอง หน้าของ Ada และเฉลยเป็นดังนี้

![โจทย์ 1000: ช่วงยาว 6 m มีส่วนยื่น 2 m แรง 10 kN/m บนช่วงและ 30 kN ที่ปลาย แรงปฏิกิริยาที่ไม่ทราบค่ามีชื่อ A_x, A_z และ B_z และเส้นบอกขนาดต่อเนื่อง 6 m และ 2 m รวม 8 m ด้านล่างเป็นเฉลย แรงปฏิกิริยา 20 และ 70 และโมเมนต์ดัดตั้งแต่ −60 เหนือจุดรองรับถึง 20 ในช่วง](/screenshots/th/p2p-plot-exercise-sheet.webp){.shot-lg}

เลเยอร์ `dimensions` บอกระยะทุกช่วงและความยาวรวมแบบที่โจทย์แบบฝึกหัดบอก และ `reactionLabels: 'names'` ตั้งชื่อตัวไม่ทราบค่า โดยลูกศรแต่ละอันชี้ไปทางที่คำตอบนับเป็นบวก ในเฉลย แรงปฏิกิริยาและค่าในแผนภาพเป็นตัวเลขเปล่าในหน่วย kN และ kNm เหมือนในแอป EduBeam ถ้าจำเป็นต้องบอกนักศึกษา ให้ระบุหน่วยไว้ในหัวเรื่องของเฉลย ถ้าจะถ่ายเอกสารขาวดำ ให้ส่ง `colors` ที่ตั้งทุกโทนเป็นสีดำ ดู [ขาวดำ](/th/plot/theming#black-and-white)

## รูปสำหรับ LaTeX และ Word {#figures-for-latex-and-word}

ถ้าเขียนข้อสอบด้วย LaTeX หรือ Word ให้เขียนรูปออกเป็นไฟล์แทน แล้วใช้แม่แบบของคุณเองต่อไป `figures.ts` เขียนรูปโจทย์และรูปเฉลยของค่า seed 30 ค่า

```ts [figures.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']

for (let seed = 1000; seed < 1030; seed++) {
  const { model } = makeExercise(seed)
  writeFileSync(`exercise-${seed}.svg`, structureSvg(model, { layers: sheet, reactionLabels: 'names' }))
  writeFileSync(`exercise-${seed}-key.svg`, structureSvg(model, { layers: key }))
}
```

รันด้วย `node figures.ts` จะได้ 60 ไฟล์สำหรับนักศึกษา 30 คน แต่ละไฟล์เป็น SVG ธรรมดาที่กำหนดสีไว้ตายตัว ไม่มี CSS และไม่มีสคริปต์

- **Word** (2019 และ Microsoft 365) แทรก SVG ได้โดยตรง: *แทรก › รูปภาพ*
- **LaTeX** ใช้ PDF ไม่ใช่ SVG แปลงไฟล์ครั้งเดียวด้วย [CairoSVG](https://cairosvg.org) (`cairosvg exercise-1000.svg -o exercise-1000.pdf`) หรือ Inkscape แล้วใช้ `\includegraphics[width=\linewidth]{exercise-1000.pdf}` ถ้าติดตั้ง Inkscape ไว้ `\includesvg` ของแพ็กเกจ `svg` จะแปลงให้เอง

รูปกว้าง 640 หน่วย และข้อความสูง 13 หน่วย เมื่อปรับให้กว้างเท่าคอลัมน์ข้อความของกระดาษ A4 ราว 16 cm ป้ายจะมีขนาด 9 pt ตั้ง `fontFamily` เป็นฟอนต์ที่เอกสารของคุณใช้ ตัวเลือกทั้งหมดอยู่ใน [ไฟล์ SVG แบบ standalone](/th/plot/functions#a-standalone-svg-file)

## ปรับให้เป็นของคุณเอง {#make-it-your-own}

- **โครงสร้างแบบอื่น** เพิ่มกรณีอื่น เช่น คานยื่น คานต่อเนื่องสองช่วง โครงข้อแข็งพอร์ทัล หรือโครงถัก เดโมด้านบนสุ่มจากโครงสร้างแปดแบบ ตั้งแต่คานช่วงเดียวแบบรองรับธรรมดา ไปจนถึงโครงข้อแข็งสามจุดหมุน โครงถัก Warren และโครงข้อแข็งพอร์ทัล
- **โจทย์อินดีเทอร์มิเนท** ตัวคำนวณจัดการได้เช่นเดียวกัน มีเพียงวิธีทำด้วยมือที่ยาวขึ้น
- **ตัวเลขลงตัว** สุ่มแรงกระทำและความยาวจากรายการสั้น ๆ แบบข้างบน เฉลยจะได้ลงตัวเท่าที่ต้องการ วนลูปค่า seed สักสองสามร้อยค่า แล้วข้ามค่าที่เฉลยมีทศนิยมมากกว่าที่ต้องการ
- **ป้องกันกลไก** ตัวสร้างโจทย์ที่อาจวางจุดรองรับไม่ดีควรคำนวณภายใน `try` แล้วข้ามค่า seed ที่ throw ข้อผิดพลาด ดู [เมื่อคำนวณไม่สำเร็จ](/th/solver/solving#when-solving-fails)
- **ถามเพิ่ม** วาดแรงเฉือน (`'V'`) การโก่งตัว (`'w'` โดยใช้ค่าจาก [`getUnknowns`](/th/solver/results#displacements)) หรือแรงตามแนวแกนในชิ้นส่วนเอียง
