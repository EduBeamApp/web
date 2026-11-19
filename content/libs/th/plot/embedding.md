---
title: การฝังในหน้าเว็บ
description: "ใส่ภาพของ @edubeam/plot ในแอป Vite เอกสารการสอนบน VitePress หรือเว็บ Nuxt เรนเดอร์บนเซิร์ฟเวอร์ ส่งโมเดลที่คำนวณแล้วเป็น JSON หรือเขียน SVG ให้หน้าที่ไม่มี Vue"
order: 7
source: site
---

# การฝังในหน้าเว็บ

คอมโพเนนต์เป็น Vue 3 ธรรมดา จึงใช้ได้ทุกที่ที่ Vue ใช้ได้ และเรนเดอร์ได้ทั้งบนเซิร์ฟเวอร์และในเบราว์เซอร์ ไม่มีโค้ดใดแตะ `window` ก่อนที่ภาพจะ mount และแต่ละภาพมี id ของตัวเอง หน้าเดียวจึงมีกี่ภาพก็ได้ เลือกวิธีตามสิ่งที่คุณมี

| สิ่งที่คุณมี | สิ่งที่ต้องทำ |
| --- | --- |
| แอป Vue ที่ build ด้วย Vite | ติดตั้ง import แล้วใช้ได้เลย: [แอป Vite](#a-vite-app) |
| เอกสารประกอบการสอนเป็น Markdown | ลงทะเบียนปลั๊กอินใน VitePress ครั้งเดียว: [เอกสารประกอบการสอนบน VitePress](#vitepress-course-notes) |
| เว็บไซต์ Nuxt | import คอมโพเนนต์ หรือเพิ่มปลั๊กอิน: [Nuxt](#nuxt) |
| หน้าที่แสดงแต่ภาพ | คำนวณตอน build แล้วส่งเป็น JSON: [ส่งภาพ](#ship-the-drawing-not-the-solver) |
| ไม่มี Vue เลย | เขียน SVG ด้วย Node: [ไม่ใช้ Vue](#plain-html-from-node) |

## แอป Vite {#a-vite-app}

```bash
npm create vue@latest
npm install @edubeam/plot @edubeam/fem
```

import คอมโพเนนต์ในไฟล์ที่ใช้ แบบในหน้า [เริ่มต้นใช้งาน](/th/plot/getting-started#draw-a-solved-model) หรือลงทะเบียนทั้งสองครั้งเดียวด้วย `app.use(EduBeamPlot)` ไม่ต้องตั้งค่าอะไรเพิ่ม ไม่ต้องใช้ stylesheet และไม่ต้องใช้ปลั๊กอินของ bundler

## เอกสารประกอบการสอนบน VitePress {#vitepress-course-notes}

[VitePress](https://vitepress.dev) สร้างหน้าเว็บจาก Markdown ด้วย Vue จึงเหมาะสำหรับเก็บเอกสารประกอบการสอน ลงทะเบียนคอมโพเนนต์ในธีม `.vitepress/theme/index.ts`

```ts [.vitepress/theme/index.ts]
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { EduBeamPlot } from '@edubeam/plot'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(EduBeamPlot) // ใช้ <StructurePlot> และ <DiagramStack> ได้ในทุกหน้า
  },
} satisfies Theme
```

จากนั้นสร้างและวาดโมเดลได้ในหน้าเลย โดยวางหน้าไว้ข้าง `frame.ts`

```md [portal-frame.md]
<script setup lang="ts">
import { portalFrame } from './frame' // () => LinearStaticSolver ที่คำนวณแล้ว

const frame = portalFrame()
</script>

# Portal frame

The bending moment under the design loads:

<StructurePlot :solver="frame" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

`vitepress build` คำนวณโครงข้อแข็งแล้วเขียน SVG ที่เสร็จสมบูรณ์ รวมทั้งป้ายทั้งหมด ลงใน HTML ของหน้า ในเบราว์เซอร์ หน้าเว็บจะรับช่วงต่อ และภาพจะปรับตัวให้พอดีกับคอลัมน์ `frame.ts` อยู่ในหน้า [สไลด์และเอกสารประกอบการสอน](/th/plot/slides#a-figure-that-builds-up)

## Nuxt {#nuxt}

Nuxt เรนเดอร์บนเซิร์ฟเวอร์ได้เช่นกัน เว็บไซต์นี้ก็สร้างด้วย Nuxt import คอมโพเนนต์ในหน้าหรือคอมโพเนนต์ตามปกติ หรือลงทะเบียนให้ทั้งแอปด้วยปลั๊กอินใน `plugins/edubeam-plot.ts`

```ts [plugins/edubeam-plot.ts]
import { EduBeamPlot } from '@edubeam/plot'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(EduBeamPlot)
})
```

บนเซิร์ฟเวอร์ไม่มีกล่องให้วัด ภาพจึงจัดวางตาม prop `width`: ค่าเริ่มต้น 640 px (400 px เมื่อใช้ `compact`) และ 720 px สำหรับ `DiagramStack` เมื่อ mount แล้ว ภาพจะจัดวางใหม่ตามความกว้างจริง ถ้าคอลัมน์ของคุณแคบหรือกว้างกว่านี้มาก ให้ใส่ `width` ที่ใกล้เคียงกว่า แล้วภาพจะไม่เปลี่ยนขนาดระหว่างที่หน้าโหลด

## ส่งภาพ ไม่ต้องส่งตัวคำนวณ {#ship-the-drawing-not-the-solver}

หน้าที่แสดงแต่ภาพไม่ต้องมีตัวคำนวณ `modelFromSolver` อ่านโมเดลที่คำนวณแล้วออกมาเป็นข้อมูลธรรมดา ได้แก่ โหนด ชิ้นส่วน แรงกระทำ แรงปฏิกิริยา และ N, V, M และการกระจัดของชิ้นส่วนทุกชิ้นในรูปพหุนามที่แม่นตรง สร้างข้อมูลนี้ตอน build ด้วยสคริปต์ เช่น `build-figures.ts`

```ts [build-figures.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

writeFileSync('portal-frame.json', JSON.stringify(modelFromSolver(portalFrame())))
```

แล้ววาดด้วย prop `model`

```vue
<script setup lang="ts">
import { StructurePlot, type PlotModel } from '@edubeam/plot'
import frame from './portal-frame.json'
</script>

<template>
  <StructurePlot :model="frame as PlotModel" />
</template>
```

โครงข้อแข็งพอร์ทัลนี้มี JSON ไม่ถึง 2 kB และวาดออกมาเหมือนจากตัวคำนวณทุกประการ ทุกฟีเจอร์ใช้กับโมเดลได้เหมือนกับตัวคำนวณ และถ้าส่งมาทั้งคู่ จะใช้ `model` รูปแบบข้อมูลอยู่ในหน้า [โมเดลสำหรับวาดภาพ](/th/plot/model)

## ไม่ใช้ Vue {#plain-html-from-node}

`structureSvg` เปลี่ยนโมเดลให้เป็นข้อความของไฟล์ SVG ที่กำหนดสีไว้ตายตัว ไม่มี style และไม่มีสคริปต์ วางข้อความนี้ลงใน HTML ใดก็ได้ ใน static site generator ในไฟล์ Markdown หรือใน CMS สคริปต์นี้เขียนหน้าเว็บที่มีภาพหนึ่งภาพ

```ts [frame-html.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const svg = structureSvg(modelFromSolver(portalFrame()), { layers: ['members', 'supports', 'reactions', 'M'] })
writeFileSync('frame.html', `<!doctype html><meta charset="utf-8"><title>Portal frame</title>${svg}`)
```

ภาพแบบนี้มีขนาดตามที่เขียนไว้ ค่าเริ่มต้นกว้าง 640 px (`max-width: 100%; height: auto` ทำให้หดตามคอลัมน์ได้) และมีพื้นหลังสีขาวของตัวเอง `background: false` ทำให้พื้นหลังโปร่งใส ภาพนี้ไม่เปลี่ยนตามธีมมืดและอ่านค่าใต้ตัวชี้ไม่ได้ ถ้าต้องการสิ่งเหล่านี้ให้เรนเดอร์คอมโพเนนต์ [สคริปต์พิมพ์ข้อสอบ](/th/plot/exercises#print-a-test) พิมพ์ข้อสอบทั้งฉบับด้วยวิธีนี้ และตัวเลือกทั้งหมดอยู่ใน [ไฟล์ SVG แบบ standalone](/th/plot/functions#a-standalone-svg-file)
