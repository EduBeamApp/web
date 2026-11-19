---
title: Bắt đầu
description: "Cài đặt @edubeam/plot, vẽ dầm do @edubeam/fem giải kèm tải trọng, phản lực và mô men uốn trong ứng dụng Vue 3, vẽ lại khi mô hình đổi và lưu thành tệp SVG."
order: 1
group: Giới thiệu
source: site
---

# Bắt đầu

@edubeam/plot vẽ dầm, khung hay dàn phẳng cùng kết quả tính dưới dạng SVG: thanh, gối tựa, tải trọng, phản lực, biểu đồ N, V, M và sơ đồ biến dạng, đúng như các hình trên trang web này. Bạn đưa vào một mô hình đã giải bằng [@edubeam/fem](/vi/solver), bộ giải mà [EduBeam]{.edubeam} dùng; thư viện tự lo bố cục, tỷ lệ và vị trí của từng con số.

Giảng viên dùng thư viện để tạo [bài tập và đề thi](/vi/plot/exercises) từ một seed (giá trị khởi tạo bộ sinh số ngẫu nhiên), làm [slide hiện dần](/vi/plot/slides) theo từng cú nhấp, và vẽ hình cho tài liệu bài giảng, trên trang web hoặc thành tệp cho LaTeX và Word. Trang [Luyện tập](/vi/practice) và [Trình tạo đề thi](/vi/exam) của trang web này cũng được làm bằng thư viện này.

::div{.actions}
[Vẽ hình đầu tiên](#draw-a-solved-model) [Tạo bài tập](/vi/plot/exercises)
::

## Cài đặt {#install}

```bash
npm install @edubeam/plot @edubeam/fem vue
```

Vue 3.5 trở lên và bộ giải là peer dependency, nên ứng dụng của bạn chỉ giữ một bản của mỗi gói. Gói chỉ có dạng ESM, có sẵn kiểu TypeScript và không cần tệp CSS nào. Gói chạy trên Node 20.19 trở lên; muốn chạy thẳng một script viết bằng TypeScript bằng lệnh `node script.ts` thì cần Node 22.18 trở lên.

## Vẽ một mô hình đã giải {#draw-a-solved-model}

Chỉ cần hai tệp. Tệp thứ nhất, `beams.ts`, dựng và giải một dầm bằng @edubeam/fem. Đây là một hàm bình thường, nên cùng một mô hình có thể dùng cho trang web, slide và script:

```ts [beams.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Dầm đơn giản nhịp `span` m chịu tải `q` kN/m, đã giải. Bộ giải làm việc với đơn vị SI. */
export const simpleBeam = (span: number, q: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 }) // thép, Pa
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 }) // IPE 200, bỏ qua biến dạng trượt
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // gối cố định
  domain.createNode('B', [span, 0, 0], [DofID.Dz]) // gối di động
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true) // N/m, +z hướng xuống
  solver.solve()
  return solver
}
```

Tệp thứ hai, `BeamFigure.vue`, đưa bộ giải cho `StructurePlot` và chỉ ra cần vẽ những gì:

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

Chỉ vậy là đủ cho cả hình: dầm trên hai gối tựa, tải 12 kN/m, hai phản lực 36 kN và biểu đồ mô men uốn với $qL^2/8 = 54$ kNm ở giữa nhịp, vẽ về phía thớ chịu kéo:

::model-figure{caption="Hình do BeamFigure.vue vẽ: nhịp 6 m chịu tải 12 kN/m"}
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

Hình chiếm hết chiều rộng của khối chứa và tự chọn chiều cao. Chữ, ký hiệu và nét vẽ giữ nguyên kích thước theo pixel dù kết cấu lớn hay nhỏ, nên hình vẫn đọc rõ trên điện thoại. Nếu bỏ `layers`, hình tự chọn kết quả cần vẽ: M cho dầm và khung, N cho dàn. Danh sách đầy đủ các [lớp](/vi/plot/structure-plot#layers) có ở trang `StructurePlot`; cách dựng mô hình được trình bày trong [tài liệu bộ giải](/vi/solver/getting-started).

## Khi mô hình thay đổi {#when-the-model-changes}

Hình đọc bộ giải được truyền vào, chứ không theo dõi nó. Khi có gì thay đổi, hãy giải lại và truyền bộ giải mới. Một `computed` làm đúng việc đó:

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

Một dầm như thế này giải mất khoảng một mili giây, nên hình thay đổi theo thanh trượt ngay khi bạn kéo. Nếu bạn sửa trực tiếp một bộ giải có sẵn, hãy tăng prop `revision` để hình đọc lại.

::callout{type="tip" title="Đừng đưa bộ giải vào reactivity sâu"}
Một `computed`, một prop hay một `const` thông thường giữ nguyên bộ giải như nó vốn có. Muốn lưu bộ giải trong state của component, hãy dùng `shallowRef` hoặc bọc nó trong `markRaw`: một `ref` thông thường sẽ khiến Vue duyệt toàn bộ bộ giải để biến nó thành reactive, mà chẳng được gì.
::

## Lưu thành tệp {#save-it-as-a-file}

Để có hình cho LaTeX, Word hay Inkscape, `structureSvg` ghi cùng hình vẽ đó thành một tệp SVG độc lập với màu cố định. Hàm này không cần Vue hay trình duyệt, chỉ cần Node. Lưu đoạn sau thành `beam-svg.ts`, cạnh `beams.ts`:

```ts [beam-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { simpleBeam } from './beams.ts'

const svg = structureSvg(modelFromSolver(simpleBeam(6, 12)), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
})
writeFileSync('beam.svg', svg)
```

Chạy bằng `node beam-svg.ts` (Node 22.18 trở lên; với phiên bản cũ hơn, dùng `npx tsx beam-svg.ts`). Các tùy chọn, cùng cách đưa tệp vào LaTeX và Word, có ở mục [Tệp SVG độc lập](/vi/plot/functions#a-standalone-svg-file).

## Hình xếp chồng {#the-stacked-figure}

`DiagramStack` vẽ hình quen thuộc trong mọi giáo trình Cơ học kết cấu: một dầm thẳng với tải trọng, bên dưới là V(x), M(x) và w(x) trên cùng một trục x. Với `v-model:load-at`, người đọc có thể kéo một lực tập trung dọc theo dầm và xem các biểu đồ thay đổi theo:

```vue
<DiagramStack v-model:load-at="at" :solver="solveWithLoadAt(at)" />
```

Trang [DiagramStack](/vi/plot/diagram-stack) có ví dụ đầy đủ.

## Dùng ở mọi nơi {#use-it-everywhere}

Để đăng ký cả hai component cho toàn ứng dụng thay vì import ở từng nơi dùng:

```ts [main.ts]
import { createApp } from 'vue'
import { EduBeamPlot } from '@edubeam/plot'
import App from './App.vue'

createApp(App).use(EduBeamPlot).mount('#app') // <StructurePlot> và <DiagramStack> dùng được trong mọi template
```

Import theo tên giúp bundle nhỏ hơn: một trang chỉ import `StructurePlot` sẽ không kéo theo `DiagramStack` hay plugin. Cả hai component cũng render được trên server, trong Nuxt hoặc VitePress: xem [Nhúng vào trang web](/vi/plot/embedding).

## Tiếp theo {#next}

::card-grid{cols="2"}
:::card{title="Bài tập và đề thi" icon="lucide:dices" to="/vi/plot/exercises"}
Mỗi sinh viên một bài tập khác nhau từ một seed, kèm đáp án, để in hoặc lưu cho LaTeX.
:::
:::card{title="Slide và tài liệu bài giảng" icon="lucide:presentation" to="/vi/plot/slides"}
Hình hiện dần theo từng cú nhấp trong Slidev, Vue hoặc Beamer, và chính những hình đó cho tài liệu bài giảng.
:::
:::card{title="StructurePlot" icon="lucide:frame" to="/vi/plot/structure-plot"}
Lớp vẽ, kích thước, ảnh thu nhỏ, cỡ hình, đơn vị và đọc giá trị bằng con trỏ.
:::
:::card{title="DiagramStack" icon="lucide:rows-3" to="/vi/plot/diagram-stack"}
Dầm phía trên các biểu đồ V, M và w, với một tải trọng người đọc kéo được.
:::
::
