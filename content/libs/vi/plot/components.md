---
title: API của component
description: "Mọi prop và sự kiện của StructurePlot và DiagramStack trong @edubeam/plot 0.2.0, kèm kiểu và giá trị mặc định, plugin EduBeamPlot và các kiểu prop được export."
order: 8
group: Tham chiếu API
source: site
---

# API của component

Prop và sự kiện của hai component, đúng như khai báo trong @edubeam/plot 0.2.0. Cả hai đều không có slot. Giá trị theo đơn vị SI được ghi rõ; kích thước tính bằng pixel CSS.

## StructurePlot {#structureplot}

```ts
import { StructurePlot } from '@edubeam/plot'
```

Vẽ một kết cấu phẳng cùng kết quả tính. Hướng dẫn: [StructurePlot](/vi/plot/structure-plot).

### Props {#props}

| Prop | Kiểu | Mặc định | Mô tả |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Một bộ giải @edubeam/fem. Kết quả được vẽ khi trường hợp tải của nó đã giải. |
| `model` | `PlotModel` | – | Hoặc dữ liệu thuần do [`modelFromSolver`](/vi/plot/model) tạo. Được ưu tiên hơn `solver`. |
| `loadCase` | `number` | `0` | Chỉ số trong `solver.loadCases` |
| `revision` | `number` | `0` | Đổi giá trị này để vẽ lại một bộ giải đã bị sửa trực tiếp |
| `layers` | `readonly PlotLayer[]` | members, supports, loads, reactions and one result | Những gì cần vẽ: `'nodes'`, `'nodeLabels'`, `'dimensions'`, `'members'`, `'supports'`, `'loads'`, `'reactions'`, `'N'`, `'V'`, `'M'`, `'w'` |
| `reserve` | `readonly PlotLayer[]` | `layers` | Các lớp cần dành chỗ trong khi còn ẩn |
| `compact` | `boolean` | `false` | Kiểu vẽ ảnh thu nhỏ: ký hiệu nhỏ hơn, nhiều nhất hai giá trị trên mỗi thanh |
| `units` | `Partial<Units>` | `KN_UNITS` | Đơn vị hiển thị |
| `numberFormat` | `Intl.NumberFormat` | English, at most 1 decimal | Định dạng mọi con số |
| `colors` | `Partial<PlotColors>` | – | Ghi đè màu theo tông: [Màu sắc và chủ đề](/vi/plot/theming#the-colors-prop) |
| `width` | `number` | `640`, compact `400` | Chiều rộng khi chưa đo được khối chứa, như khi render trên server |
| `height` | `number` | – | Chiều cao cố định. Nếu không có, chiều cao đi theo hình vẽ. |
| `maxHeight` | `number` | `max(320, 0.75 × width)`, compact none | Giới hạn trên của chiều cao tự động |
| `padding` | `number` | `6` | Khoảng trống quanh hình vẽ |
| `fontSize` | `number` | `13`, compact `11.5` | Cỡ chữ |
| `diagramSize` | `number` | `48`, compact `26` | Độ dài tung độ lớn nhất của biểu đồ |
| `deformedSize` | `number` | `30`, compact `18` | Chuyển vị lớn nhất trên sơ đồ biến dạng |
| `diagramScale` | `Partial<Record<ResultLayer, number>>` | – | Tỷ lệ cố định, px trên một đơn vị SI, cho một kết quả; thay cho `diagramSize` hoặc `deformedSize` |
| `momentOnTensionSide` | `boolean` | `true` | M vẽ về phía thớ chịu kéo; `false` để vẽ về phía thớ chịu nén |
| `resultLabelMode` | `'horizontal' \| 'axis'` | `'horizontal'` | Giá trị viết nằm ngang, hoặc xoay dọc theo tung độ |
| `reactionLabels` | `'values' \| 'names'` | `'values'` | Phản lực theo chiều tác dụng thực, kèm độ lớn; hoặc, cho bài tập, mỗi phương bị chặn được gọi tên (*A<sub>x</sub>*, *M<sub>A</sub>*) và chỉ theo chiều quy ước dương. Tên không cần kết quả tính: [Phản lực là ẩn số](/vi/plot/structure-plot#reactions-as-unknowns) |
| `reserveLabelModes` | `readonly ResultLabelMode[]` | – | Các cách ghi nhãn cần dành chỗ ngoài cách hiện tại |
| `reserveReactionLabels` | `readonly ReactionLabels[]` | – | Các kiểu nhãn phản lực cần dành chỗ ngoài `reactionLabels`, để hình của bài tập đứng yên khi chuyển sang đáp án |
| `animate` | `boolean` | `true` | Cho các lớp hiện dần và thanh tự vẽ ra. Luôn tắt khi có `prefers-reduced-motion`. |
| `hover` | `boolean` | `false` | Đọc giá trị dưới con trỏ, đánh dấu ở đầu tung độ của từng biểu đồ. Khi tắt, hình hoàn toàn không nhận thao tác con trỏ. |
| `title` | `string` | a description of what is shown | Tên truy cập (accessible name) của hình |

Khi không có `layers`, kết quả được vẽ là `M` cho dầm và khung, `N` cho dàn, và `w` khi không có nội lực nào (`defaultResultLayer`).

### Sự kiện {#events}

| Sự kiện | Payload | Khi nào |
| --- | --- | --- |
| `readout` | `Readout \| null` | Với `hover`: điểm trên thanh nằm dưới con trỏ và kết quả tại đó; `null` khi con trỏ rời đi |

```ts
interface Readout {
  readonly member: string
  readonly x: number // m tính từ nút đầu của thanh
  readonly px: number // điểm trên màn hình, px
  readonly py: number
  readonly values: Readonly<Record<'N' | 'V' | 'M' | 'w', SidedValue>> // đơn vị SI
  readonly u: number // chuyển vị theo trục x địa phương của thanh, m
}
interface SidedValue {
  readonly left: number
  readonly right: number // bằng left ở chỗ kết quả liên tục
}
```

## DiagramStack {#diagramstack}

```ts
import { DiagramStack } from '@edubeam/plot'
```

Vẽ một dầm thẳng phía trên các biểu đồ của nó, trên cùng một trục x. Các thanh phải tạo thành một đường nằm ngang, vẽ từ trái sang phải; mọi trường hợp khác đều báo lỗi. Hướng dẫn: [DiagramStack](/vi/plot/diagram-stack).

### Props {#props-1}

| Prop | Kiểu | Mặc định | Mô tả |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Dầm đã giải |
| `model` | `PlotModel` | – | Hoặc dữ liệu thuần từ `modelFromSolver`; được ưu tiên |
| `loadCase` | `number` | `0` | Chỉ số trong `solver.loadCases` |
| `revision` | `number` | `0` | Đổi giá trị này để vẽ lại một bộ giải đã bị sửa trực tiếp |
| `members` | `readonly string[]` | all members | Các thanh thuộc đường dầm |
| `rows` | `readonly StackRow[]` | `['V', 'M', 'w']` | Các hàng biểu đồ, từ trên xuống, chọn trong `'N'`, `'V'`, `'M'`, `'w'` |
| `loadRow` | `boolean` | `true` | Dầm cùng gối tựa, tải trọng và phản lực phía trên các hàng |
| `ranges` | `Partial<Record<StackRow, readonly [number, number]>>` | each row's own | Khoảng giá trị của từng hàng, đơn vị SI |
| `rowHeights` | `Partial<Record<StackRow, number>>` | N 100, V 116, M 128, w 76; below 560 px wide 88, 96, 104, 64 | Chiều cao các hàng trước khi `maxHeight` co chúng lại |
| `maxHeight` | `number` | – | Các hàng co lại, nhiều nhất còn 60 %, để hình không vượt quá chiều cao này. Chữ giữ nguyên cỡ. |
| `units` | `Partial<Units>` | `KN_UNITS` | Đơn vị hiển thị |
| `numberFormat` | `Intl.NumberFormat` | English, at most 1 decimal | Định dạng mọi con số |
| `colors` | `Partial<PlotColors>` | – | Ghi đè màu |
| `width` | `number` | `720` | Chiều rộng khi chưa đo được khối chứa; nhỏ nhất là 320 |
| `fontSize` | `number` | `12.5` | Cỡ chữ |
| `hover` | `boolean` | `true` | Con trỏ đọc giá trị. Khi tắt, hình không nhận thao tác con trỏ. |
| `loadAt` | `number` | – | Vị trí (m dọc theo đường dầm) của lực tập trung mà người đọc có thể kéo; dùng với `v-model:load-at` |
| `loadLabel` | `string` | `P = …` with the load's magnitude | Dòng chữ cạnh tải trọng kéo được |
| `loadStep` | `number` | `0.05` | Khi kéo, vị trí được làm tròn theo bước này, m; phím mũi tên dịch đúng một bước |
| `title` | `string` | a description of the rows | Tên truy cập (accessible name) của hình |

### Sự kiện {#events-1}

| Sự kiện | Payload | Khi nào |
| --- | --- | --- |
| `update:loadAt` | `number` | Người đọc đã di chuyển tải trọng: vị trí mới, m. Điều khiển `v-model:load-at`. |
| `readout` | `StackReadout \| null` | Giá trị tại con trỏ trên các hàng; `null` khi con trỏ rời đi |

```ts
interface StackReadout {
  readonly x: number // m dọc theo đường dầm
  readonly values: Partial<Record<'N' | 'V' | 'M' | 'w', { readonly left: number; readonly right: number }>> // SI
}
```

## Plugin {#the-plugin}

```ts
import { EduBeamPlot } from '@edubeam/plot'

app.use(EduBeamPlot) // đăng ký <StructurePlot> và <DiagramStack> cho toàn ứng dụng
```

Plugin không bắt buộc: import các component theo tên thì nhẹ hơn, và bundler sẽ bỏ plugin khỏi bản build không dùng đến nó.

## Kiểu {#types}

Để viết wrapper có kiểu quanh các component, gói export sẵn prop và sự kiện của chúng:

```ts
import type { PlotLayer, StructurePlotProps } from '@edubeam/plot'

const figure: StructurePlotProps = { layers: ['members', 'supports', 'M'] satisfies PlotLayer[], compact: true }
```

| Kiểu | Là |
| --- | --- |
| `StructurePlotProps`, `StructurePlotEmits` | Prop và sự kiện của `StructurePlot` |
| `DiagramStackProps`, `DiagramStackEmits` | Prop và sự kiện của `DiagramStack` |
| `Readout`, `ReadoutQuantity`, `SidedValue`, `StackReadout` | Payload của sự kiện |
| `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `StackRow` | Tên lớp, kết quả, cách ghi nhãn, kiểu nhãn phản lực và hàng |
| `Units`, `Unit`, `UnitKind` | Đơn vị hiển thị: `{ symbol, scale }` cho mỗi loại |
| `PlotColors` | Màu theo tông |
| `PlotModel` | Mô hình dữ liệu thuần: [Mô hình vẽ](/vi/plot/model) |

Các export còn lại, trong đó có `structureSvg` để ghi tệp SVG và các hàm đứng sau việc vẽ, có ở trang [Hàm](/vi/plot/functions).
