---
title: Slide và tài liệu bài giảng
description: "Hình bài giảng với @edubeam/plot hiện dần theo từng cú nhấp trong Slidev, Vue hoặc Beamer, giải trực tiếp trong giờ giảng, và vào tài liệu, PowerPoint, Word dưới dạng tệp SVG."
order: 6
source: site
---

# Slide và tài liệu bài giảng

Hãy trình bày kết cấu theo đúng trình tự bạn giảng: trước tiên là hình học, rồi gối tựa và tải trọng, tiếp đến phản lực, cuối cùng là mô men uốn. Hình vẽ từ một mô hình đã giải sẽ hiện dần tại chỗ, mỗi cú nhấp thêm một lớp, và luôn đúng. Cũng từ mô hình đó, bạn có hình cho tài liệu bài giảng.

![Một slide Slidev sau 0, 2 và 4 cú nhấp: các nút của khung cổng cùng kích thước, rồi khung trên các gối tựa với tải trọng, sau đó là phản lực và mô men uốn](/screenshots/vi/p2p-plot-slidev-steps.webp){.shot-md}

## Hình hiện dần {#a-figure-that-builds-up}

Chỉ cần hai tệp. `frame.ts` dựng và giải kết cấu:

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Khung cổng 6 m × 4 m, hai chân cột gối cố định, 10 kN/m trên dầm và lực 15 kN đẩy tại B. */
export const portalFrame = (): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 }) // IPE 300
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [0, 0, -4]) // z hướng xuống: cao 4 m
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

`BuildUp.vue` vẽ kết cấu theo từng bước. Mỗi bước liệt kê các lớp cần hiện, còn `reserve` bố trí sẵn tất cả các lớp ngay từ cú nhấp đầu tiên, nên mỗi lớp hiện dần đúng chỗ của nó và không có gì xê dịch:

```vue [BuildUp.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { StructurePlot, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame'

const props = defineProps<{ step: number }>()

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'], // hình học
  ['nodeLabels', 'members', 'supports'], // kết cấu
  ['nodeLabels', 'members', 'supports', 'loads'], // tải trọng
  ['members', 'supports', 'loads', 'reactions'], // phản lực
  ['members', 'supports', 'reactions', 'M'], // và mô men uốn
]
const all = [...new Set(stages.flat())] // bố trí ngay từ bước đầu, nên về sau không có gì xê dịch
const layers = computed(() => stages[Math.min(props.step, stages.length - 1)])

const frame = portalFrame()
</script>

<template>
  <StructurePlot :solver="frame" :layers="layers" :reserve="all" :height="360" />
</template>
```

Một lớp cũng có thể biến mất: bước cuối bỏ tải trọng để nhường chỗ cho mô men. `:height="360"` giữ hình nằm gọn trong slide. Thanh tự vẽ từ đầu này sang đầu kia khi xuất hiện lần đầu, và các lớp hiện dần trong nửa giây; cả hai hiệu ứng đều tắt khi người dùng bật `prefers-reduced-motion`, còn `:animate="false"` tắt chúng cho mọi người. Muốn chúng chậm hơn cho giảng đường, xem [Chỉnh hiệu ứng chuyển động](/vi/plot/theming#restyling-the-animation).

## Trong Slidev {#in-slidev}

[Slidev](https://sli.dev) tạo slide từ Markdown với Vue, nên component dùng được ở đó nguyên như vậy. Cài các thư viện vào bộ slide:

```bash
npm install @edubeam/plot @edubeam/fem
```

Đặt `frame.ts` và `BuildUp.vue` vào thư mục `components/` của bộ slide, rồi để số cú nhấp của slide điều khiển bước trong `slides.md`:

```md [slides.md]
---
clicks: 4
---

# From geometry to bending moment

<BuildUp :step="$clicks" />
```

`clicks: 4` cho slide bốn cú nhấp, và `$clicks` đếm chúng từ 0. Mỗi lần nhấn phím mũi tên hiện bước tiếp theo; lùi lại thì bước đó ẩn đi. `slidev export` xuất bộ slide thành PDF, mỗi cú nhấp một trang khi có `--with-clicks`.

## Trong slide Vue bất kỳ {#in-any-vue-slides}

Ở những nơi khác, bạn tự giữ bước hiện tại:

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

## Giải trực tiếp trong giờ giảng {#solve-it-live}

Bộ giải chỉ mất vài mili giây cho một khung như thế này, nên trong giờ giảng bạn có thể thay đổi kết cấu và giải ngay tại chỗ. Gắn một tải trọng với thanh trượt và mỗi lần truyền vào một mô hình mới đã giải, như ở mục [Khi mô hình thay đổi](/vi/plot/getting-started#when-the-model-changes).

- **Tải trọng di động.** [DiagramStack](/vi/plot/diagram-stack#a-load-the-reader-can-drag) cho sinh viên kéo một lực tập trung dọc theo dầm và xem lực cắt và mô men uốn thay đổi theo.
- **Đặt các trường hợp cạnh nhau.** Cố định [`diagramScale`](/vi/plot/structure-plot#several-plots-at-one-scale) thì hai hình vẽ mô men cùng một tỷ lệ, nên mô men lớn hơn trông lớn hơn.
- **Đọc giá trị.** Với `hover`, trỏ vào một thanh sẽ đánh dấu giá trị ở đầu tung độ của từng biểu đồ: xem [Đọc giá trị](/vi/plot/structure-plot#reading-values).

## Hình cho Beamer, PowerPoint và Word {#figures-for-beamer-powerpoint-and-word}

Bộ slide làm bằng LaTeX Beamer hay PowerPoint, hoặc tài liệu bài giảng viết bằng Word, nhận hình dưới dạng tệp. `structureSvg` ghi hình thành một tệp SVG độc lập với màu cố định, bố trí giống hệt `StructurePlot`. Một script Node, `frame-svg.ts`, đặt cạnh `frame.ts`:

```ts [frame-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![Khung cổng dưới dạng tệp SVG độc lập, render bằng CairoSVG: tải trọng, phản lực 20 và 40 hướng lên, 2,3 và 12,7 theo phương ngang, và mô men uốn từ −50,7 tại C đến 29,3 trên dầm](/screenshots/vi/p2p-plot-frame-svg.webp){.shot-lg}

PowerPoint và Word (2019 và Microsoft 365) chèn thẳng tệp SVG. LaTeX nhận hình dưới dạng PDF: chuyển đổi bằng `cairosvg frame.svg -o frame.pdf` hoặc Inkscape, hoặc để `\includesvg` của gói `svg` làm việc đó. Mục [Hình cho LaTeX và Word](/vi/plot/exercises#figures-for-latex-and-word) có chi tiết, còn mục [Tệp SVG độc lập](/vi/plot/functions#a-standalone-svg-file) có mọi tùy chọn.

### Hình hiện dần trong Beamer {#a-build-up-in-beamer}

Mỗi tệp được cắt vừa với các lớp mà nó vẽ, nên những tệp ghi riêng cho từng bước sẽ không khớp nhau. Hãy truyền cho `structureSvg` cùng một `reserve` như trong `BuildUp.vue`, gồm mọi lớp của mọi bước, thì các tệp có cùng kích thước và kết cấu nằm đúng một chỗ. `frame-stages.ts` ghi mỗi bước một tệp:

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

Chuyển các tệp sang PDF:

```bash
for i in 1 2 3 4 5; do cairosvg frame-$i.svg -o frame-$i.pdf; done
```

rồi gán cho mỗi tệp một overlay riêng. Mỗi tệp chứa trọn một bước, nên slide Beamer chỉ hiện từng tệp một, và vì chúng khớp nhau, mỗi cú nhấp trông như thêm một lớp:

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

Trong PowerPoint, đặt năm tệp lên năm slide liên tiếp, không có hiệu ứng chuyển slide: mỗi bước trông giống hệt một cú nhấp trong giờ giảng.

## Tài liệu bài giảng và tài liệu phát tay {#notes-and-handouts}

- **Tài liệu bài giảng trên web.** VitePress và Nuxt render hình lúc build, nên hình đã có sẵn trong HTML trước khi bất kỳ script nào chạy: xem [Nhúng vào trang web](/vi/plot/embedding).
- **Tài liệu in.** Ghi hình bằng `structureSvg` vào một trang HTML rồi in, như [script in đề thi](/vi/plot/exercises#print-a-test) làm, hoặc chèn các tệp vào LaTeX hay Word.
- **Một mô hình, mọi hình vẽ.** Cùng một `frame.ts` cấp dữ liệu cho slide, tài liệu bài giảng và phiếu bài tập, nên chúng không bao giờ mâu thuẫn nhau.
