---
title: Nhúng vào trang web
description: "Đưa hình của @edubeam/plot vào ứng dụng Vite, tài liệu VitePress hay trang Nuxt, render trên server, gửi mô hình đã giải dạng JSON, hoặc ghi SVG thuần không cần Vue."
order: 7
source: site
---

# Nhúng vào trang web

Các component là Vue 3 thuần, nên chạy được ở mọi nơi Vue chạy, và render được trên server cũng như trong trình duyệt. Không có gì đụng tới `window` trước khi hình được mount, và mỗi hình có các id riêng, nên một trang chứa bao nhiêu hình cũng được. Hãy chọn trường hợp của bạn:

| Bạn có | Cách làm |
| --- | --- |
| Ứng dụng Vue build bằng Vite | Cài đặt, import, xong: [Ứng dụng Vite](#a-vite-app) |
| Tài liệu bài giảng viết bằng Markdown | Đăng ký plugin một lần trong VitePress: [Tài liệu bài giảng VitePress](#vitepress-course-notes) |
| Trang web Nuxt | Import các component, hoặc thêm một plugin: [Nuxt](#nuxt) |
| Trang chỉ hiển thị hình | Giải lúc build và gửi JSON: [Gửi hình vẽ](#ship-the-drawing-not-the-solver) |
| Không dùng Vue | Ghi SVG trong Node: [Không dùng Vue](#plain-html-from-node) |

## Ứng dụng Vite {#a-vite-app}

```bash
npm create vue@latest
npm install @edubeam/plot @edubeam/fem
```

Import các component ở nơi dùng, như ở trang [Bắt đầu](/vi/plot/getting-started#draw-a-solved-model), hoặc đăng ký cả hai một lần bằng `app.use(EduBeamPlot)`. Không cần cấu hình gì thêm: không tệp CSS, không plugin cho bundler.

## Tài liệu bài giảng VitePress {#vitepress-course-notes}

[VitePress](https://vitepress.dev) build các trang Markdown với Vue, nên rất hợp để viết tài liệu bài giảng. Đăng ký các component trong theme, tệp `.vitepress/theme/index.ts`:

```ts [.vitepress/theme/index.ts]
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { EduBeamPlot } from '@edubeam/plot'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(EduBeamPlot) // <StructurePlot> và <DiagramStack> dùng được trong mọi trang
  },
} satisfies Theme
```

Sau đó dựng và vẽ mô hình ngay trong trang, đặt cạnh `frame.ts`:

```md [portal-frame.md]
<script setup lang="ts">
import { portalFrame } from './frame' // () => một LinearStaticSolver đã giải

const frame = portalFrame()
</script>

# Portal frame

The bending moment under the design loads:

<StructurePlot :solver="frame" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

`vitepress build` giải khung và ghi SVG hoàn chỉnh vào HTML của trang, kể cả các nhãn. Trong trình duyệt, trang tiếp quản và hình tự co giãn vừa cột nội dung. `frame.ts` có ở trang [Slide và tài liệu bài giảng](/vi/plot/slides#a-figure-that-builds-up).

## Nuxt {#nuxt}

Nuxt cũng render trên server; trang web này được làm bằng Nuxt. Import các component trong một trang hay component như thường lệ, hoặc đăng ký chúng cho toàn ứng dụng bằng một plugin trong `plugins/edubeam-plot.ts`:

```ts [plugins/edubeam-plot.ts]
import { EduBeamPlot } from '@edubeam/plot'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(EduBeamPlot)
})
```

Trên server không có khối chứa nào để đo, nên hình được bố trí theo prop `width`: mặc định 640 px (400 px với `compact`), 720 px với `DiagramStack`. Khi đã mount, hình bố trí lại theo chiều rộng thật. Nếu cột nội dung của bạn hẹp hơn hay rộng hơn nhiều, hãy đặt `width` gần đúng hơn để hình không đổi kích thước khi trang tải.

## Gửi hình vẽ, không gửi bộ giải {#ship-the-drawing-not-the-solver}

Một trang chỉ hiển thị hình thì không cần bộ giải. `modelFromSolver` đọc mô hình đã giải thành dữ liệu thuần: nút, thanh, tải trọng, phản lực, và N, V, M cùng chuyển vị của mọi thanh dưới dạng đa thức chính xác. Hãy tạo nó lúc build, bằng một script như `build-figures.ts`:

```ts [build-figures.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

writeFileSync('portal-frame.json', JSON.stringify(modelFromSolver(portalFrame())))
```

rồi vẽ bằng prop `model`:

```vue
<script setup lang="ts">
import { StructurePlot, type PlotModel } from '@edubeam/plot'
import frame from './portal-frame.json'
</script>

<template>
  <StructurePlot :model="frame as PlotModel" />
</template>
```

Khung cổng chưa đến 2 kB JSON và được vẽ giống hệt như từ bộ giải. Mọi tính năng hoạt động với mô hình như với bộ giải, và nếu bạn truyền cả hai thì `model` được ưu tiên. Định dạng được mô tả ở trang [Mô hình vẽ](/vi/plot/model).

## Không dùng Vue {#plain-html-from-node}

`structureSvg` biến một mô hình thành văn bản của tệp SVG, với màu cố định, không có style hay script. Dán văn bản đó vào bất kỳ trang HTML, trình tạo trang tĩnh, tệp Markdown hay CMS nào. Script sau ghi một trang có một hình:

```ts [frame-html.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const svg = structureSvg(modelFromSolver(portalFrame()), { layers: ['members', 'supports', 'reactions', 'M'] })
writeFileSync('frame.html', `<!doctype html><meta charset="utf-8"><title>Portal frame</title>${svg}`)
```

Hình như vậy giữ kích thước lúc được ghi, mặc định rộng 640 px (`max-width: 100%; height: auto` cho phép nó co lại theo cột), và có nền trắng riêng; `background: false` để nền trong suốt. Hình không theo chủ đề tối và không đọc giá trị dưới con trỏ: muốn vậy, hãy render component. [Script in đề thi](/vi/plot/exercises#print-a-test) in cả một đề thi theo cách này, và mục [Tệp SVG độc lập](/vi/plot/functions#a-standalone-svg-file) liệt kê các tùy chọn.
