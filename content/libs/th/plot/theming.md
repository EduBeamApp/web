---
title: ธีมและสี
description: "กำหนดสีภาพของ @edubeam/plot ด้วย CSS custom properties หรือ prop colors ให้ตามธีมสว่างและธีมมืด พิมพ์ขาวดำ ตั้งสีไฟล์ SVG ตั้งฟอนต์ และปรับภาพเคลื่อนไหว"
order: 4
source: site
---

# ธีมและสี

ภาพรับสีจาก CSS custom properties ของหน้าเว็บ ธีมสว่างและธีมมืดของเว็บไซต์จึงมีผลกับภาพได้ทันที ถ้าหน้าเว็บไม่ได้กำหนดไว้ ภาพจะใช้สีระบบของ CSS ซึ่งเปลี่ยนตาม `color-scheme` ของหน้า ถ้าไม่ได้ตั้งค่าอะไรเลย ภาพจะเป็นสีดำบนพื้นขาวในหน้าสว่าง และสีอ่อนบนพื้นมืดในหน้ามืด

## Custom properties {#custom-properties}

| ใช้สำหรับ | Custom property | ค่าสำรอง |
| --- | --- | --- |
| ชิ้นส่วน จุดรองรับ ข้อความ | `--figure-ink` แล้วจึง `--ink` | `CanvasText` |
| พื้นหลัง ขอบเรืองรอบป้าย | `--paper` | `Canvas` |
| เส้นบอกขนาด แกน | `--muted` | `GrayText` |
| โหนด แรงกระทำที่ลากได้ | `--brand` | `#4f46e5` |
| แรงตามแนวแกน | `--color-normal` | `#2222ff` |
| แรงเฉือน | `--color-shear` | `#00af00` |
| โมเมนต์ดัด | `--color-moment` | `#ff2222` |
| รูปร่างที่เสียรูป | `--figure-ink` แล้วจึง `--ink` | `CanvasText` |
| แรงกระทำ | `--color-load` | `#ff8700` |
| แรงปฏิกิริยา | `--color-reaction` | `#a020f0` |
| ชิ้นส่วนโครงถักที่รับแรงดึง | `--color-tension` แล้วจึง `--color-moment` | `#ff2222` |
| ชิ้นส่วนโครงถักที่รับแรงอัด | `--color-compression` แล้วจึง `--color-normal` | `#2222ff` |
| ฟอนต์ | `--ebp-font` แล้วจึง `--font-sans` | `inherit` |

กำหนด property เหล่านี้ที่ element ใดก็ได้ที่อยู่เหนือภาพ หรือที่ `:root` เพื่อใช้กับทั้งเว็บไซต์

```css
:root {
  --ink: #1b1b3a;
  --paper: #ffffff;
  --color-moment: #d7263d;
}

.dark {
  --ink: #eeeeff;
  --paper: #0b0d1f;
}
```

ป้ายมีขอบเรือง (halo) สี `--paper` เพื่อให้อ่านออกเมื่ออยู่บนลายแรเงา ให้ตั้งสีนี้ให้ตรงกับพื้นหลังที่ภาพวางอยู่

## Prop `colors` {#the-colors-prop}

ถ้าต้องการเปลี่ยนสีภาพเดียว ให้ส่งโทนที่ต้องการตามชื่อ

```vue
<StructurePlot :solver="solver" :colors="{ moment: '#c00', paper: 'transparent' }" />
```

โทนที่มีคือ `ink`, `paper`, `muted`, `brand`, `normal`, `shear`, `moment`, `deformed`, `load`, `reaction`, `tension` และ `compression` ใช้สี CSS แบบใดก็ได้ รวมถึง `var(…)` ค่าเริ่มต้นของแต่ละโทนอยู่ใน `DEFAULT_COLORS`

## ขาวดำ {#black-and-white}

สำหรับข้อสอบที่ถ่ายเอกสารหรือพิมพ์ขาวดำ ให้ตั้งโทนที่มีสีทุกโทนเป็นสีหมึก

```vue
<script setup lang="ts">
import type { PlotColors } from '@edubeam/plot'

const print: Partial<PlotColors> = {
  ink: '#000', paper: '#fff', muted: '#555', brand: '#000',
  normal: '#000', shear: '#000', moment: '#000', deformed: '#000',
  load: '#000', reaction: '#000', tension: '#000', compression: '#000',
}
</script>

<template>
  <StructurePlot :solver="solver" :colors="print" :animate="false" />
</template>
```

แผนภาพยังอ่านได้แม้ไม่มีสี เพราะมีลายแรเงา และโมเมนต์วาดไว้ทางด้านรับแรงดึง

## สีในไฟล์ SVG {#colours-in-an-svg-file}

ไฟล์ที่เขียนด้วย [`structureSvg`](/th/plot/functions#a-standalone-svg-file) ไม่มีหน้าเว็บอยู่รอบ ๆ จึงใช้สีตายตัว คือ `PRINT_COLORS` ซึ่งเป็นสีของแอป EduBeam บนพื้นขาว ตัวเลือก `colors` รับโทนชุดเดียวกับ prop ชุดสีขาวดำข้างบนจึงใช้ที่นี่ได้ด้วย

```ts
structureSvg(model, { colors: print }) // ดำบนขาว
structureSvg(model, { background: false }) // ไม่มีพื้นหลัง สำหรับสไลด์ที่มีพื้นสี
```

ใช้ได้เฉพาะสีตายตัว เพราะ `var(…)` ไม่มีความหมายสำหรับ Word หรือ Inkscape

## ฟอนต์ {#fonts}

ข้อความใช้ฟอนต์ของหน้าเว็บผ่าน `--ebp-font` หรือ `--font-sans` โดยใช้ตัวเลขแบบความกว้างเท่ากัน (tabular figures) ชื่อแถว เช่น V(x) ใน `DiagramStack` ใช้ฟอนต์ของ KaTeX ถ้าหน้าเว็บโหลดไว้ ไม่เช่นนั้นจะใช้ฟอนต์ serif ไฟล์ SVG ใช้ตัวเลือก `fontFamily` ซึ่งค่าเริ่มต้นคือ Helvetica หรือ Arial เพราะไฟล์ไม่รู้ว่าหน้าเว็บใช้ฟอนต์อะไร

## ปรับแต่งภาพเคลื่อนไหว {#restyling-the-animation}

กฎ CSS ไม่กี่ข้อที่ภาพต้องใช้ฝังอยู่ใน SVG แต่ละภาพแล้ว จึงไม่ต้องใช้ stylesheet ทุกคลาสขึ้นต้นด้วย `ebp-` และหน้าเว็บเขียนทับได้ แต่ละเลเยอร์เป็น `<g class="ebp-layer ebp-layer-{name}">` ซึ่งจะได้คลาส `ebp-on` เมื่อแสดงอยู่

```css
/* ค่อย ๆ ปรากฏช้าลง สำหรับห้องบรรยาย */
.slides .ebp-animate .ebp-layer {
  transition-duration: 1s;
}
```

ถ้าจะสร้างภาพของคุณเองจาก [ฟังก์ชันวาดภาพ](/th/plot/functions#drawing) ไลบรารี export กฎที่ฝังไว้เป็น `PLOT_CSS` และมี `toneVars(colors)` ที่คืน custom properties ซึ่งภาพตั้งไว้ที่ element ราก
