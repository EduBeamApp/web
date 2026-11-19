---
title: Màu sắc và chủ đề
description: "Tô màu hình của @edubeam/plot qua CSS custom properties hoặc prop colors, theo chủ đề sáng và tối, in đen trắng, tô màu tệp SVG, đặt phông chữ và chỉnh hiệu ứng chuyển động."
order: 4
source: site
---

# Màu sắc và chủ đề

Hình lấy màu từ các CSS custom property của trang, nên chủ đề sáng và tối của trang web được áp dụng nguyên vẹn. Property nào trang không định nghĩa thì các màu hệ thống của CSS thay vào; những màu này đi theo `color-scheme` của trang. Mặc định, hình có nét đen trên nền trắng ở trang sáng và nét sáng trên nền tối ở trang tối.

## Custom property {#custom-properties}

| Dùng cho | Custom property | Giá trị dự phòng |
| --- | --- | --- |
| Thanh, gối tựa, chữ | `--figure-ink`, rồi `--ink` | `CanvasText` |
| Nền, viền sáng quanh nhãn | `--paper` | `Canvas` |
| Đường kích thước, trục | `--muted` | `GrayText` |
| Nút, tải trọng kéo được | `--brand` | `#4f46e5` |
| Lực dọc | `--color-normal` | `#2222ff` |
| Lực cắt | `--color-shear` | `#00af00` |
| Mô men uốn | `--color-moment` | `#ff2222` |
| Sơ đồ biến dạng | `--figure-ink`, rồi `--ink` | `CanvasText` |
| Tải trọng | `--color-load` | `#ff8700` |
| Phản lực | `--color-reaction` | `#a020f0` |
| Thanh dàn chịu kéo | `--color-tension`, rồi `--color-moment` | `#ff2222` |
| Thanh dàn chịu nén | `--color-compression`, rồi `--color-normal` | `#2222ff` |
| Phông chữ | `--ebp-font`, rồi `--font-sans` | `inherit` |

Đặt các property ở bất kỳ phần tử nào bao ngoài hình, trên `:root` nếu muốn áp dụng cho cả trang web:

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

Nhãn có một viền sáng màu `--paper` để vẫn đọc rõ khi nằm trên vùng kẻ vạch: hãy đặt màu này trùng với nền nơi hình nằm.

## Prop `colors` {#the-colors-prop}

Để tô màu riêng cho một hình, truyền bất kỳ tông màu nào theo tên:

```vue
<StructurePlot :solver="solver" :colors="{ moment: '#c00', paper: 'transparent' }" />
```

Các tông màu là `ink`, `paper`, `muted`, `brand`, `normal`, `shear`, `moment`, `deformed`, `load`, `reaction`, `tension` và `compression`. Mọi màu CSS đều dùng được, kể cả `var(…)`. `DEFAULT_COLORS` chứa giá trị mặc định của từng tông.

## Đen trắng {#black-and-white}

Với đề thi photocopy hay bản in đen trắng, hãy đặt mọi tông màu thành màu nét vẽ:

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

Biểu đồ vẫn đọc được khi không có màu: chúng được kẻ vạch, và mô men vẽ về phía thớ chịu kéo.

## Màu trong tệp SVG {#colours-in-an-svg-file}

Tệp do [`structureSvg`](/vi/plot/functions#a-standalone-svg-file) ghi ra không nằm trong trang nào, nên dùng màu cố định: `PRINT_COLORS`, tức màu của ứng dụng EduBeam trên nền trắng. Tùy chọn `colors` của hàm nhận cùng các tông màu như prop, nên bộ màu đen trắng ở trên cũng dùng được ở đây:

```ts
structureSvg(model, { colors: print }) // đen trên nền trắng
structureSvg(model, { background: false }) // không có nền, cho slide có nền màu
```

Chỉ dùng màu cố định: `var(…)` chẳng có nghĩa gì với Word hay Inkscape.

## Phông chữ {#fonts}

Chữ dùng phông của trang, qua `--ebp-font` hoặc `--font-sans`, với chữ số đều chiều rộng. Tên hàng như V(x) trong `DiagramStack` được viết bằng phông của KaTeX nếu trang có tải chúng, nếu không thì bằng một phông có chân. Tệp SVG dùng tùy chọn `fontFamily`, mặc định Helvetica hoặc Arial, vì tệp không thể biết phông của trang.

## Chỉnh hiệu ứng chuyển động {#restyling-the-animation}

Vài quy tắc CSS mà hình cần được nhúng thẳng vào từng SVG, nên không cần tệp CSS riêng. Mọi class đều có tiền tố `ebp-`, và trang có thể ghi đè chúng. Mỗi lớp là một `<g class="ebp-layer ebp-layer-{name}">`, được thêm `ebp-on` khi lớp đó hiện:

```css
/* Hiện dần chậm hơn, cho giảng đường */
.slides .ebp-animate .ebp-layer {
  transition-duration: 1s;
}
```

`PLOT_CSS` export các quy tắc được nhúng đó, còn `toneVars(colors)` trả về các custom property mà hình đặt trên phần tử gốc của nó, để bạn dựng hình riêng từ các [hàm vẽ](/vi/plot/functions#drawing).
