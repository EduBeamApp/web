---
title: Vẽ kết quả
description: "Biến mô hình @edubeam/fem đã giải thành biểu đồ bằng @edubeam/plot: trong component Vue, thành tệp SVG độc lập từ script Node, hoặc thành JSON để vẽ sau."
order: 11
source: site
---

# Vẽ kết quả {#drawing-the-results}

[@edubeam/plot](/vi/plot) vẽ mô hình đã giải giống như các hình trên trang web này: thanh, gối tựa, tải trọng, phản lực, biểu đồ N, V, M và sơ đồ biến dạng, dưới dạng SVG. Bạn chỉ cần truyền bộ giải vào; thư viện tự đọc mọi thứ cần thiết.

```bash
npm install @edubeam/plot @edubeam/fem vue
```

## Trong component Vue {#in-a-vue-component}

```vue [BeamFigure.vue]
<script setup lang="ts">
import { markRaw } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot } from '@edubeam/plot'

// Dầm đơn giản nhịp 6 m chịu 12 kN/m, đơn vị SI: m, N, Pa
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // gối cố định
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // gối di động
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

// Chỉ đọc, không theo dõi: markRaw ngăn Vue biến bộ giải thành reactive
const beam = markRaw(solver)
</script>

<template>
  <StructurePlot
    :solver="beam"
    :layers="['members', 'supports', 'loads', 'reactions', 'M']"
  />
</template>
```

Component vẽ phản lực 36 kN và mô men 54 kNm, như trong hình trực tiếp này:

::model-figure{caption="Những gì BeamFigure.vue vẽ ra"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
---
::

`StructurePlot` vẽ trường hợp tải 0; prop `loadCase` chọn một trường hợp khác trong `solver.loadCases`. Component không theo dõi bộ giải: sau khi sửa mô hình và giải lại, hãy đổi prop `revision` để vẽ lại. Trang [StructurePlot](/vi/plot/structure-plot) có đầy đủ các tùy chọn.

## Không cần trình duyệt {#without-a-browser}

`structureSvg`, có từ @edubeam/plot 0.2, ghi cùng hình vẽ đó thành một tệp SVG độc lập, với màu cơ bản mà Word, Inkscape và các công cụ LaTeX đều hiểu. Không cần trình duyệt, không cần component Vue, chỉ một script Node:

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { modelFromSolver, structureSvg } from '@edubeam/plot'

// Cùng dầm như trong BeamFigure.vue
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

Tệp này thể hiện đúng những gì hình trực tiếp ở trên thể hiện, với màu dành cho bản in. `width` đặt kích thước theo pixel, vì không có vùng chứa nào để đo. Muốn có cả một trang in gồm nhiều hình, hãy đặt nhiều tệp như vậy vào một trang HTML, như [script in đề thi](/vi/plot/exercises#print-a-test) của @edubeam/plot vẫn làm, không cần Vue cũng không cần trình duyệt. Các tùy chọn của `structureSvg` có ở trang [Hàm](/vi/plot/functions#a-standalone-svg-file).

## Gửi hình vẽ, không gửi bộ giải {#ship-the-drawing-not-the-solver}

`modelFromSolver` biến mô hình đã giải thành dữ liệu thuần, tuần tự hóa được sang JSON: hình học, tải trọng, phản lực và kết quả của mọi thanh dưới dạng đa thức chính xác. Hãy giải lúc build, gửi đi tệp JSON, rồi vẽ nó bằng prop `model` thay cho `solver`:

```ts
import { modelFromSolver } from '@edubeam/plot'

// ... dầm đã giải trong to-svg.ts
writeFileSync('beam.json', JSON.stringify(modelFromSolver(solver)))
```

Khi đó trang hiển thị hình không phải giải gì cả: việc tính toán chỉ làm một lần, lúc bạn build trang. Trang [Nhúng vào trang web](/vi/plot/embedding#ship-the-drawing-not-the-solver) trình bày phía component, còn trang [Mô hình vẽ](/vi/plot/model) mô tả định dạng dữ liệu.

Mọi thứ khác, từ màu sắc đến giá trị hiện khi di chuột và tải trọng kéo thả được, có trong [tài liệu @edubeam/plot](/vi/plot/getting-started).
