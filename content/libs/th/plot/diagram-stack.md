---
title: DiagramStack
description: "วาดคานเหนือแผนภาพ V(x), M(x) และ w(x) บนแกน x เดียวกันด้วย DiagramStack อ่านค่าทุกแถวด้วยเส้นเคอร์เซอร์ และให้ผู้อ่านลากแรงกระทำเป็นจุดไปตามคาน"
order: 3
source: site
---

# DiagramStack

`DiagramStack` วาดภาพที่มีอยู่ในตำรากลศาสตร์โครงสร้างทุกเล่ม: คานตรงพร้อมจุดรองรับ แรงกระทำ และแรงปฏิกิริยา และข้างใต้บนแกน x เดียวกันคือแรงเฉือน V(x) โมเมนต์ดัด M(x) และการโก่งตัว w(x) เส้นเคอร์เซอร์อ่านค่าทุกแถวพร้อมกัน และถ้าต้องการ ผู้อ่านลากแรงกระทำเป็นจุดไปตามคานได้

```vue
<DiagramStack :solver="solver" />
```

![DiagramStack: คานช่วงเดียวแบบรองรับธรรมดายาว 6 m กับแรง 20 kN ที่ผู้อ่านลากได้ ในภาพอยู่ห่างจากจุดรองรับซ้าย 4.3 m แรงปฏิกิริยา 5.7 kN และ 14.3 kN แรงเฉือนกระโดดจาก 5.7 kN เป็น −14.3 kN ใต้แรงกระทำ โมเมนต์ดัดสูงสุด 24.4 kNm ที่ตำแหน่งเดียวกัน และการโก่งตัวที่มีค่ามากที่สุด 17 mm](/screenshots/th/p2p-plot-diagram-stack.webp){.shot-lg}

ชิ้นส่วนต้องเรียงเป็นเส้นตรงแนวนอนเส้นเดียว และวาดจากซ้ายไปขวา แบบอื่นทั้งหมด เช่น เส้นเอียง เส้นหักมุม หรือชิ้นส่วนที่วาดจากขวาไปซ้าย คอมโพเนนต์จะแจ้งข้อผิดพลาดแทนที่จะวาดออกมาผิด เพราะแกน x ของภาพคือแกนของคาน props ทุกตัวอยู่ในหน้า [API ของคอมโพเนนต์](/th/plot/components#diagramstack)

## แถว {#rows}

| Prop | ค่าเริ่มต้น | กำหนด |
| --- | --- | --- |
| `rows` | `['V', 'M', 'w']` | แผนภาพเรียงจากบนลงล่าง ใช้ `'N'` ได้ด้วย |
| `loadRow` | `true` | คานพร้อมจุดรองรับ แรงกระทำ และแรงปฏิกิริยาเหนือแถวแผนภาพ |
| `members` | all members | ชิ้นส่วนที่ประกอบเป็นแนวคาน เมื่อโมเดลมีชิ้นส่วนอื่นด้วย |
| `rowHeights` | N 100, V 116, M 128, w 76 px | ความสูงของแต่ละแถว จะเล็กลงเล็กน้อยเมื่อกว้างไม่ถึง 560 px |
| `maxHeight` | none | แถวหดลงได้ถึง 60 % เพื่อให้ภาพพอดี ขนาดตัวอักษรคงเดิม |
| `ranges` | each row's own | ช่วงค่าคงที่ของแต่ละแถว ในหน่วย SI |

V และ N วาดโดยให้ค่าบวกอยู่ด้านบน ส่วน M และ w ให้ค่าบวกอยู่ด้านล่าง แบบที่ตำราส่วนใหญ่วาด โมเมนต์บวกและการโก่งตัวลงจึงอยู่ใต้แกน แต่ละแถวเขียนค่าสุดขีดของตัวเองกำกับไว้

## เส้นเคอร์เซอร์อ่านค่า {#the-reading-cursor}

`hover` เปิดไว้เป็นค่าเริ่มต้น เมื่อเลื่อนตัวชี้ไปบนภาพ จะมีเส้นเคอร์เซอร์แนวดิ่งพาดผ่านทุกแถว พร้อมค่าของแต่ละแถวในป้าย ถ้าอยู่ห่างจากตำแหน่งที่แผนภาพกระโดดไม่เกิน 8 px เช่น ที่แรงกระทำเป็นจุดหรือที่จุดรองรับ เส้นเคอร์เซอร์จะสแนปไปที่ตำแหน่งนั้น และ V จะแสดงทั้งสองข้าง เช่น `5.7 → −14.3 kN` ใต้แรงกระทำในภาพข้างบน ค่าเหล่านี้ส่งออกมาผ่านอีเวนต์ด้วย

```vue
<DiagramStack :solver="solver" @readout="(r) => (reading = r)" />
```

ค่าที่อ่านได้คือ `{ x, values }` โดย `x` เป็นระยะตามคานเป็นเมตร และ `{ left, right }` ของแต่ละแถวในหน่วย SI เมื่อตัวชี้ออกจากภาพ ค่าจะเป็น `null`

## แรงกระทำที่ผู้อ่านลากได้ {#a-load-the-reader-can-drag}

ส่งตำแหน่งของแรงกระทำเป็นจุดให้ `v-model:load-at` แล้วแรงนั้นจะมีจุดจับ ผู้อ่านลากด้วยตัวชี้ได้ หรือโฟกัสที่จุดจับแล้วใช้ปุ่มลูกศรก็ได้ คอมโพเนนต์แค่รายงานตำแหน่งใหม่ ให้คำนวณคานใหม่โดยวางแรงที่ตำแหน่งนั้น แล้วส่งตัวคำนวณตัวใหม่กลับเข้าไป แบบที่ `MovingLoad.vue` ทำ

```vue [MovingLoad.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { beamLine, DiagramStack, lineDiagram, modelFromSolver, rowRange, type StackRow } from '@edubeam/plot'

const L = 6 // m
const P = 20e3 // N

/** คานที่มีแรงกระทำเป็นจุดห่างจาก A เป็นระยะ `at` เมตร คำนวณแล้ว */
const solveWithLoadAt = (at: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamConcentratedLoad(1, [0, P, 0, at], true)
  solver.solve()
  return solver
}

/** ช่วงค่าของแต่ละแถวเมื่อแรงอยู่ทุกตำแหน่ง แผนภาพจึงขยายและหดได้แทนการปรับมาตราส่วนใหม่ */
const rows: StackRow[] = ['V', 'M', 'w']
const envelope = (() => {
  const ranges: Partial<Record<StackRow, [number, number]>> = {}
  for (let at = 0.25; at < L; at += 0.25) {
    const model = modelFromSolver(solveWithLoadAt(at))
    const line = beamLine(model)
    for (const row of rows) {
      const [lo, hi] = rowRange(lineDiagram(model, line, row))
      const [min, max] = ranges[row] ?? [0, 0]
      ranges[row] = [Math.min(min, lo), Math.max(max, hi)]
    }
  }
  return ranges
})()

const at = ref(2)
const solver = computed(() => solveWithLoadAt(at.value))
</script>

<template>
  <DiagramStack v-model:load-at="at" :solver="solver" :rows="rows" :ranges="envelope" load-label="P = 20 kN" />
  <p>The load is {{ at.toFixed(2) }} m from A.</p>
</template>
```

เมื่อแรงกระทำอยู่ที่ 4.3 m ภาพแสดงแรงปฏิกิริยา 5.7 kN และ 14.3 kN แรงเฉือนกระโดดจาก 5.7 เป็น −14.3 kN ใต้แรงกระทำ และ $M = 5.67 \cdot 4.3 = 24.4$ kNm ที่ตำแหน่งนั้น ถ้าไม่ใส่ `ranges` ทุกแถวจะปรับมาตราส่วนตามค่าสุดขีดของตัวเองขณะที่แรงเคลื่อนที่ และแผนภาพจะดูเหมือนไม่เปลี่ยนเลย

| Prop | ค่าเริ่มต้น | กำหนด |
| --- | --- | --- |
| `loadAt` | none | ตำแหน่งของแรงกระทำ, m จากจุดเริ่มของแนวคาน ใช้กับ `v-model:load-at` |
| `loadLabel` | `P = …` | ข้อความข้างจุดจับ |
| `loadStep` | 0.05 | ระยะที่ใช้ปัดตำแหน่งขณะลาก, m และเป็นระยะที่ปุ่มลูกศรเลื่อนแต่ละครั้ง |

จุดจับเป็น `role="slider"` ที่โฟกัสได้ และบอกช่วงกับตำแหน่งให้โปรแกรมอ่านหน้าจอ ปุ่มลูกศรเลื่อนทีละ `loadStep` ปุ่ม Page Up และ Page Down เลื่อนทีละ 1 m และปุ่ม Home กับ End ไปที่ปลายทั้งสองของคาน บนหน้าจอสัมผัสลากด้วยนิ้วได้ และยังเลื่อนหน้าในแนวดิ่งผ่านภาพได้ตามปกติ

จุดจับใช้แทนแรงกระทำเป็นจุดที่ตำแหน่ง `loadAt` ในโมเดลที่คำนวณแล้ว แรงนั้นจึงปรากฏเป็นจุดจับ กำกับด้วยขนาดของแรง เว้นแต่จะกำหนด `loadLabel` ดังนั้นต้องใส่แรงกระทำไว้ในโมเดลที่ตำแหน่งเดียวกัน แบบที่ `solveWithLoadAt` ทำ

## ขนาดและการเรนเดอร์บนเซิร์ฟเวอร์ {#size-and-server-rendering}

ภาพวัดขนาดกล่องที่อยู่แล้วจัดวางตามความกว้างนั้น โดยกว้างอย่างน้อย 320 px ก่อนที่จะวัดได้ ภาพจะใช้ `width` ซึ่งมีค่าเริ่มต้นเป็น 720 px ข้อความมีขนาด 12.5 px (`fontSize`) และไม่ย่อลงตามภาพ
