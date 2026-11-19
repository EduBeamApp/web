---
title: StructurePlot
description: "Vẽ dầm, khung hay dàn phẳng bằng StructurePlot: lớp vẽ, hình hiện dần, phản lực chưa biết có tên cho bài tập, ảnh thu nhỏ, cỡ hình, đơn vị và đọc giá trị khi di chuột."
order: 2
group: Component
source: site
---

# StructurePlot

`StructurePlot` vẽ toàn bộ kết cấu, vừa với chiều rộng khối chứa: thanh, khớp, gối tựa, tải trọng, phản lực, biểu đồ N, V, M và sơ đồ biến dạng. Bạn truyền vào một bộ giải, hoặc [mô hình dữ liệu thuần](/vi/plot/model) tạo từ bộ giải, rồi chỉ ra cần vẽ những gì.

```vue
<StructurePlot :solver="solver" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

Mọi prop, cùng kiểu và giá trị mặc định, có ở trang [API của component](/vi/plot/components#structureplot).

Hình dưới đây là một `StructurePlot` bật `nodeLabels` và `dimensions`, có `hover`, và định dạng số của trang web này với bốn chữ số có nghĩa. Hãy chuyển qua lại giữa các kết quả và trỏ vào một thanh để đọc giá trị.

::model-figure{caption="Khung cổng: hai chân cột gối cố định, 10 kN/m trên dầm, 15 kN tại B"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: pin, D: pin }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
  - { node: B, fx: 15 }
results: [M, V, N, w]
show: [nodeLabels, dimensions]
---
::

## Lớp vẽ {#layers}

Hình gồm nhiều lớp, luôn được vẽ theo một thứ tự cố định, bất kể bạn liệt kê chúng theo thứ tự nào:

| Lớp | Vẽ |
| --- | --- |
| `members` | các thanh, khớp vẽ thành vòng tròn nhỏ |
| `supports` | ký hiệu cho từng gối tựa, xoay nghiêng theo gối xiên |
| `loads` | tải trọng nút và tải trọng trên thanh, tải nhiệt độ và lún gối tựa, kèm giá trị |
| `reactions` | phản lực, vẽ bằng mũi tên thẳng và mũi tên cong kèm giá trị; hoặc, với `reactionLabels: 'names'`, thành các [ẩn số có tên](#reactions-as-unknowns) của bài tập |
| `nodes` | mỗi nút là một vòng tròn nhỏ |
| `nodeLabels` | nhãn nút |
| `dimensions` | kích thước nối tiếp như trên phiếu bài tập: mọi đoạn giữa các nút và lực tập trung ở phía dưới kết cấu, mọi tầng ở bên phải, và kích thước tổng ở hàng thứ hai |
| `N`, `V`, `M` | biểu đồ lực dọc, lực cắt và mô men uốn |
| `w` | sơ đồ biến dạng |

Nếu bỏ `layers`, hình vẽ thanh, gối tựa, tải trọng và phản lực, cùng một kết quả chọn theo kết cấu: `M` cho dầm và khung, `N` cho dàn, và `w` khi không có nội lực nào, ví dụ dầm được tự do giãn nở dưới tải nhiệt độ.

Biểu đồ được vẽ như trong ứng dụng EduBeam: N và V kẻ vạch vuông góc với thanh, còn M vẽ về phía thớ chịu kéo, nên mô men dương (căng thớ dưới) nằm phía dưới dầm. `:moment-on-tension-side="false"` vẽ M về phía thớ chịu nén. Với dàn, lực dọc của mỗi thanh được ghi một lần dọc theo thanh, tô màu theo dấu.

## Hình hiện dần {#figures-that-build-up}

`reserve` liệt kê các lớp cần dành chỗ trong khi chúng còn ẩn. Hình bố trí mọi lớp được dành chỗ ngay từ đầu, nên khi một lớp được bật, nó hiện dần đúng chỗ của mình và không có gì khác bị xê dịch:

```vue
<script setup lang="ts">
import type { PlotLayer } from '@edubeam/plot'

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'],
  ['nodeLabels', 'members', 'supports'],
  ['nodeLabels', 'members', 'supports', 'loads'],
  ['members', 'supports', 'loads', 'reactions'],
  ['members', 'supports', 'reactions', 'M'],
]
const all = [...new Set(stages.flat())]
// `frame` là một bộ giải đã giải, `step` là bước hiện tại: trang Slide và tài liệu bài giảng có component đầy đủ
</script>

<template>
  <StructurePlot :solver="frame" :layers="stages[step]" :reserve="all" />
</template>
```

Với `animate`, bật sẵn theo mặc định, các lớp hiện dần lên và thanh tự vẽ từ đầu này sang đầu kia. Khi người dùng bật `prefers-reduced-motion`, không có hiệu ứng nào. Trang [Slide và tài liệu bài giảng](/vi/plot/slides) đưa hình này vào một bộ slide.

## Giá trị trên biểu đồ {#diagram-values}

Mỗi giá trị được ghi ngay ngoài đầu tung độ của nó, như cách giáo trình ghi biểu đồ: mọi đầu thanh có giá trị khác 0, các cực trị ở giữa, cả hai giá trị tại một bước nhảy, và nút góc cứng chỉ ghi một lần. Giá trị chỉ ghi số, không kèm đơn vị, theo đơn vị hiển thị (kN cho N và V, kNm cho M); phản lực cũng vậy, giống như trong ứng dụng EduBeam; đơn vị chỉ được ghi kèm những đại lượng cho trước: tải trọng, lún gối tựa và thay đổi nhiệt độ. Nếu một nhãn chồng lên nhãn khác, lên thanh hay mũi tên, nó sẽ thử các vị trí khác ở cùng đầu tung độ, và bị bỏ đi nếu không còn chỗ trống, nên hai con số không bao giờ đè lên nhau. Giá trị của tải trọng và phản lực được đặt trước, nên số của biểu đồ không bao giờ đẩy chúng ra. Lực dọc trong thanh dàn không bao giờ bị bỏ: nhãn trượt dọc theo thanh, đổi phía, và cùng lắm thì thu nhỏ lại.

`result-label-mode="axis"` xoay các giá trị nằm dọc theo tung độ, như ứng dụng EduBeam ghi. Nếu người đọc được chuyển qua lại giữa hai cách ghi, hãy truyền `:reserve-label-modes="['horizontal', 'axis']"` để hình không xê dịch khi họ chuyển.

## Phản lực là ẩn số {#reactions-as-unknowns}

Phiếu bài tập yêu cầu tìm phản lực, nên phải vẽ phản lực mà không kèm giá trị. `reaction-labels="names"` vẽ một mũi tên cho mỗi phương mà gối tựa chặn, chỉ theo chiều được quy ước là dương: dọc trục x của nút (sang phải, trừ khi gối bị xoay), hướng lên, và ngược chiều kim đồng hồ với mô men ngàm. Mỗi mũi tên mang tên theo nút của nó, *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>*, in nghiêng với chỉ số dưới thật. Như vậy dấu của mọi đáp số được xác định ngay trên hình: phản lực tác dụng theo chiều ngược lại mang dấu âm.

```vue
<StructurePlot
  :model="model"
  :layers="['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']"
  reaction-labels="names"
/>
```

![Phía trên, dầm một đầu ngàm, một đầu gối di động dưới dạng phiếu bài tập: ngàm tại A, gối di động tại B, 40 kN ở giữa nhịp, kích thước nối tiếp 3 m và 3 m, tổng 6 m, và các phản lực vẽ thành mũi tên có tên A_x, A_z, M_A và B_z. Phía dưới, cùng dầm đó với nhãn phản lực mặc định: 27,5 và 12,5 hướng lên, mô men ngàm 45, và mô men uốn từ −45 tại ngàm đến 37,5 dưới lực tập trung](/screenshots/vi/p4-plot-reaction-names.webp){.shot-lg}

Tên không cần kết quả tính, nên một mô hình chưa giải vẫn vẽ được thành phiếu bài tập. Với đáp án, giữ `reactionLabels` là `'values'`. Tên và giá trị chiếm chỗ khác nhau (phản lực ngang bằng 0 có tên trên phiếu bài tập nhưng không có mũi tên trong đáp án), nên hình nào chuyển qua lại giữa hai cách ghi cần dành chỗ cho cả hai bằng `:reserve-reaction-labels="['names', 'values']"`: hình vẽ khi đó đứng yên, chỉ các nhãn thay đổi. Thẻ bài tập ở trang [Bài tập và đề thi](/vi/plot/exercises#the-exercise-in-a-page) chuyển qua lại giữa hai cách ghi bằng prop `answers`, giống như trang [Luyện tập](/vi/practice) của trang web này khi sinh viên chọn xem đáp án.

## Ảnh thu nhỏ {#thumbnails}

`compact` vẽ cho các ô cỡ khoảng 400 × 200 px: ký hiệu nhỏ hơn, chữ 11,5 px, nhiều nhất hai giá trị trên mỗi thanh, và tải phân bố chỉ ghi độ lớn, không có `q =`.

```vue
<StructurePlot v-for="t in tiles" :key="t.title" :solver="t.solver" compact :height="200" :title="t.title" />
```

Các hình ở trang [Ví dụ](/vi/examples/) của trang web này được vẽ theo cách đó.

## Cỡ hình {#size}

Hình đo khối chứa và bố trí theo đúng chiều rộng đó, tính bằng pixel thật. Nếu không có `height`, chiều cao đi theo hình vẽ, tối đa bằng `maxHeight`, mặc định $\max(320;\ 0{,}75 \times \text{width})$. Trước khi đo được, chẳng hạn khi render trên server, hình dùng `width`, mặc định 640 px.

| Prop | Mặc định | Đặt |
| --- | --- | --- |
| `width` | 640, compact 400 | chiều rộng bố trí khi chưa đo được khối chứa, px |
| `height` | follows the drawing | chiều cao cố định, px |
| `maxHeight` | $\max(320, 0.75w)$, compact none | giới hạn trên của chiều cao tự động |
| `padding` | 6 | khoảng trống quanh hình vẽ, px |
| `fontSize` | 13, compact 11.5 | cỡ chữ, px |
| `diagramSize` | 48, compact 26 | độ dài tung độ lớn nhất, px |
| `deformedSize` | 30, compact 18 | chuyển vị lớn nhất trên sơ đồ biến dạng, px |

### Nhiều hình cùng một tỷ lệ {#several-plots-at-one-scale}

Mỗi hình chia tỷ lệ biểu đồ theo giá trị lớn nhất của chính nó, nên mô men 20 kNm trông lớn ngang mô men 80 kNm. Muốn so sánh, hãy cố định tỷ lệ theo pixel trên một đơn vị SI bằng `diagramScale`:

```vue
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams' // từ trang Bắt đầu: (nhịp m, q kN/m) => bộ giải đã giải

const spans = [4, 6, 8].map((L) => ({ L, solver: simpleBeam(L, 10) }))
// 0,5 px trên 1 kNm (0,5e-3 px trên 1 N·m): 80 kNm của nhịp 8 m vẽ sâu 40 px, 20 kNm của nhịp 4 m sâu 10 px
const scale = { M: 0.5e-3 }
</script>

<template>
  <figure v-for="s in spans" :key="s.L">
    <StructurePlot :solver="s.solver" :layers="['members', 'supports', 'M']" :diagram-scale="scale" />
    <figcaption>L = {{ s.L }} m</figcaption>
  </figure>
</template>
```

## Đơn vị và con số {#units-and-numbers}

Bên trong, giá trị luôn theo SI và chỉ được đổi khi hiển thị: mặc định là kN, kNm, kN/m, m, mm, mrad và K. Đơn vị nào cũng thay được bằng một ký hiệu và một hệ số, giá trị hiển thị = giá trị SI × hệ số:

```vue
<StructurePlot :solver="solver" :units="{ force: { symbol: 'N', scale: 1 } }" />
```

Các con số được định dạng qua `Intl.NumberFormat`, mặc định theo tiếng Anh với nhiều nhất một chữ số thập phân. Truyền định dạng của riêng bạn để khớp với ngôn ngữ của trang:

```vue
<StructurePlot :solver="solver" :number-format="new Intl.NumberFormat('cs', { maximumFractionDigits: 2 })" />
```

Dấu trừ là dấu trừ thật (−), và một giá trị làm tròn về 0 không bao giờ hiện thành −0. Tên các đơn vị là `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` và `temperature`; `KN_UNITS` và `SI_UNITS` được export sẵn để làm điểm xuất phát.

## Đọc giá trị {#reading-values}

Với `hover`, hình đọc giá trị của các kết quả đang hiển thị, tại điểm trên thanh nằm dưới con trỏ. Mỗi giá trị được đánh dấu ngay chỗ nó được vẽ: một chấm ở đầu tung độ của từng biểu đồ đang hiện (cả hai đầu tại bước nhảy) hoặc trên sơ đồ biến dạng, và được liệt kê trong một nhãn, chẳng hạn `M = 54 kNm`, hoặc hai phía của bước nhảy, `V = 13.3 → −6.7 kN`. Con trỏ bắt được thanh từ bất kỳ chỗ nào trên biểu đồ của nó, không chỉ trên chính thanh. Hình cũng phát các giá trị ra dưới dạng dữ liệu:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { StructurePlot, type Readout } from '@edubeam/plot'
import { portalFrame } from './frame' // từ trang Slide và tài liệu bài giảng: () => bộ giải đã giải

const frame = portalFrame()
const reading = ref<Readout | null>(null)
</script>

<template>
  <StructurePlot :solver="frame" :layers="['members', 'supports', 'M']" hover @readout="reading = $event" />
  <p v-if="reading">
    Member {{ reading.member }}, {{ reading.x.toFixed(2) }} m from its start:
    M = {{ (reading.values.M.left / 1e3).toFixed(1) }} kNm
  </p>
</template>
```

Dữ liệu đọc được (readout) có dạng `{ member, x, px, py, values, u }`: thanh, vị trí dọc theo thanh tính bằng mét, điểm trên màn hình tính bằng px, `{ left, right }` cho mỗi đại lượng `N`, `V`, `M` và `w` theo đơn vị SI, và chuyển vị dọc trục `u`. Giá trị là `null` khi con trỏ rời khỏi hình. Các hình tương tác trên trang web này đều dùng `hover`: hãy trỏ vào một hình xem thử.

Không có `hover`, hình không gắn trình nghe sự kiện nào, nên trang vẫn cuộn được khi lướt qua hình, và chạm vào một hình nằm trong liên kết sẽ mở liên kết đó. Có `hover`, hình chỉ nghe sự kiện con trỏ, và trên màn hình cảm ứng vẫn cuộn dọc và chụm hai ngón để phóng to được.

## Trợ năng {#accessibility}

Mỗi hình là một `<svg role="img">` có tên lấy từ prop `title`, hoặc từ một câu mô tả nội dung hình, chẳng hạn “Structure with its loads, reactions, bending moment” (câu mô tả này do thư viện tạo, bằng tiếng Anh). Các lớp được dành chỗ nhưng đang ẩn mang `aria-hidden`.
