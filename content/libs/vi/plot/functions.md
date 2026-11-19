---
title: Hàm
description: "Mọi hàm, hằng số và kiểu mà @edubeam/plot 0.2.0 export ngoài các component: structureSvg cho tệp SVG độc lập, đọc kết quả chính xác, đơn vị, đường dầm và bố cục cho hình riêng."
order: 10
source: site
---

# Hàm

Mọi thứ các component vẽ đều đến từ các hàm thuần, không dính dáng gì tới Vue. Chúng ghi hình thành tệp SVG, đọc kết quả chính xác, chuẩn bị dữ liệu từ trước và dựng hình theo ý bạn. Import theo tên giúp bundle nhỏ: một trang chỉ import `modelFromSolver` sẽ không kéo theo chút mã component nào.

Mọi giá trị đều theo SI, trừ khi có ghi đơn vị khác; vị trí dọc theo thanh tính bằng mét từ nút đầu của thanh.

## Tệp SVG độc lập {#a-standalone-svg-file}

Hình trong một trang web lấy màu từ các CSS custom property của trang, nên một `<svg>` chép ra khỏi trang sẽ mất hết màu. Thay vào đó, `structureSvg` ghi hình thành văn bản của một tệp `.svg` độc lập: màu cố định, không có stylesheet, không có script, bố trí bằng cùng thủ tục với `StructurePlot`. Word, PowerPoint, Inkscape, CairoSVG và các công cụ LaTeX đều vẽ nó giống như trên trang.

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts' // () => một LinearStaticSolver đã giải, như ở trang Slide và tài liệu bài giảng

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![Khung cổng dưới dạng tệp SVG độc lập, render bằng CairoSVG: tải trọng, phản lực 20 và 40 hướng lên, 2,3 và 12,7 theo phương ngang, và mô men uốn từ −50,7 tại C đến 29,3 trên dầm](/screenshots/vi/p2p-plot-frame-svg.webp){.shot-lg}

| Tùy chọn | Mặc định | Tác dụng |
| --- | --- | --- |
| `layers` | members, supports, loads, reactions and the result `StructurePlot` would pick | Những gì cần vẽ |
| `width` | `640` | Chiều rộng tính bằng px, là đơn vị người dùng của SVG |
| `height` | follows the drawing | Chiều cao cố định, px |
| `maxHeight` | max(320, 0.75 × width) | Giới hạn trên của chiều cao tự động |
| `padding` | `6` | Khoảng trống quanh hình vẽ, px |
| `fontSize` | `13`, compact `11.5` | Cỡ chữ, px |
| `fontFamily` | `Helvetica, Arial, sans-serif` | Danh sách phông mà chương trình mở tệp có sẵn |
| `colors` | `PRINT_COLORS` | Bất kỳ tông màu nào, dưới dạng màu cố định |
| `background` | `true` | Tô nền bằng màu `paper`; `false` để nền trong suốt |
| `title` | none | Ghi thành `<title>` của SVG |
| `reserve`, `reserveLabelModes`, `reserveReactionLabels` | none | Các lớp, cách ghi nhãn và kiểu nhãn phản lực cần dành chỗ ngoài những gì đang vẽ, để các tệp của hình hiện dần khớp nhau: [Hình hiện dần trong Beamer](/vi/plot/slides#a-build-up-in-beamer) |
| `units`, `numberFormat`, `compact`, `diagramSize`, `deformedSize`, `momentOnTensionSide`, `resultLabelMode`, `reactionLabels` | as `StructurePlot` | Cùng ý nghĩa như prop của component |

`PRINT_COLORS` là màu của ứng dụng EduBeam trên nền trắng: nét vẽ `#16182b`, lực dọc `#2222ff`, lực cắt `#00af00`, mô men uốn `#ff2222`, tải trọng `#ff8700`, phản lực `#a020f0`. Mỗi nhãn được ghi hai lần: bên dưới là một lớp viền màu nền, bên trên là chữ, vì không phải chương trình SVG nào cũng hiểu `paint-order`; còn chỉ số dưới, như trong tên phản lực *A<sub>x</sub>*, là một `tspan` với các con số thuần mà Word và Inkscape đọc được. Không có `reserve`, mỗi tệp được cắt vừa với các lớp mà nó vẽ.

Cách dùng tệp:

- **Word và PowerPoint** (2019 và Microsoft 365): *Insert › Pictures*.
- **LaTeX**: chuyển sang PDF bằng [CairoSVG](https://cairosvg.org) (`cairosvg frame.svg -o frame.pdf`) hoặc Inkscape, rồi dùng `\includegraphics`; hoặc dùng `\includesvg` của gói `svg`, lệnh này tự gọi Inkscape giúp bạn. Với chiều rộng 640 đơn vị, một hình đặt vừa cột chữ 16 cm có nhãn cỡ 9 pt.
- **Trang web không dùng Vue**: dán văn bản vào HTML. Xem [Không dùng Vue](/vi/plot/embedding#plain-html-from-node).

Trang [Bài tập và đề thi](/vi/plot/exercises#figures-for-latex-and-word) ghi một tệp cho đề bài và đáp án của từng sinh viên.

## Từ bộ giải {#from-a-solver}

| Export | Chữ ký | Tác dụng |
| --- | --- | --- |
| `modelFromSolver` | `(solver: Solver, options?: FromSolverOptions) => PlotModel` | Đọc bộ giải thành [mô hình vẽ](/vi/plot/model) dạng dữ liệu thuần; chỉ có kết quả khi trường hợp tải đã giải |
| `FromSolverOptions` | type | `{ loadCase?: number }`, chỉ số trong `solver.loadCases` |

## Đa thức từng đoạn {#piecewise-polynomials}

Kết quả của một thanh là các giá trị `Piecewise`: danh sách các đoạn `{ x0, x1, c }`, được giải thích ở trang [Mô hình vẽ](/vi/plot/model#piecewise-polynomials). `side` chọn giá trị ngay trước (`'left'`) hoặc ngay sau (`'right'`, mặc định) điểm nơi hai đoạn gặp nhau.

| Export | Chữ ký | Tác dụng |
| --- | --- | --- |
| `valueAt` | `(pw, x, side?) => number` | Giá trị tại `x`; ra ngoài hai đầu thì lấy giá trị ở đầu gần nhất |
| `slopeAt` | `(pw, x, side?) => number` | Đạo hàm, theo đơn vị của giá trị trên mét |
| `extremes` | `(pw) => { max: Extreme; min: Extreme } \| null` | Giá trị lớn nhất và nhỏ nhất, chính xác, mỗi giá trị là `{ x, value, side }` |
| `maxAbs` | `(pw) => number` | Giá trị tuyệt đối lớn nhất |
| `innerBreaks` | `(pw) => number[]` | Các điểm nối giữa các đoạn, không tính hai đầu |
| `isZero` | `(pw) => boolean` | Kết quả có bằng 0 trên toàn bộ hay không |
| `evalPiece` | `(piece, x) => number` | Giá trị của một đoạn |
| `evalPieceSlope` | `(piece, x) => number` | Đạo hàm của một đoạn |
| `pieceExtrema` | `(piece) => number[]` | Các điểm đạo hàm của đoạn bằng 0, m |
| `pieceDegree` | `(piece) => number \| null` | Bậc của một đoạn; `null` khi đoạn bằng 0 |
| `cleanPiecewise` | `(pw, tolerance) => Piecewise` | Bỏ các hệ số nhỏ hơn `tolerance`, tức sai số làm tròn của mô hình đã giải |
| `fitPiece` | `(f, x0, x1, degree) => Piece` | Đa thức bậc cho trước đi qua một hàm trên `(x0, x1)` |
| `pieceToBeziers` | `(piece, segments?) => CubicSegment[]` | Đoạn dưới dạng các đường Bézier bậc ba trong (x, giá trị): chính xác tới bậc ba, nếu không thì dùng `segments` đường, mặc định 4 |

Kiểu: `Piece`, `Piecewise`, `Side` (`'left' \| 'right'`), `Extreme`, `CubicSegment`.

## Đơn vị và con số {#units-and-numbers}

| Export | Chữ ký | Tác dụng |
| --- | --- | --- |
| `KN_UNITS` | `Units` | kN, kNm, kN/m, m, mm, mrad, K: mặc định |
| `SI_UNITS` | `Units` | N, N·m, N/m, m, m, rad, K |
| `resolveUnits` | `(units?: Partial<Units>) => Units` | `KN_UNITS` cùng những đơn vị bạn ghi đè |
| `DEFAULT_NUMBER_FORMAT` | `Intl.NumberFormat` | Tiếng Anh, nhiều nhất một chữ số thập phân |
| `formatNumber` | `(value, format?) => string` | Con số với dấu trừ thật, không bao giờ ra −0 |
| `formatQuantity` | `(si, unit, format?) => string` | `"36 kN"`: giá trị SI đổi sang một đơn vị, cách đơn vị bằng một khoảng trắng hẹp không ngắt dòng |

Một `Unit` có dạng `{ symbol, scale }`, giá trị hiển thị = giá trị SI × `scale`. `Units` có một đơn vị cho mỗi `UnitKind`: `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` và `temperature`.

```ts
import { formatQuantity, KN_UNITS } from '@edubeam/plot'

formatQuantity(-37500, KN_UNITS.moment) // "−37.5 kNm"
```

## Đọc giá trị {#reading-values}

| Export | Chữ ký | Tác dụng |
| --- | --- | --- |
| `readMember` | `(results: MemberResults, x, snap?) => { x, u, values }` | N, V, M và w tại `x`, mỗi đại lượng là `{ left, right }`, và chuyển vị dọc trục `u`; bắt dính vào bước nhảy trong phạm vi `snap` m |
| `readoutAt` | `(model, transform, px, py, reach) => Readout \| null` | Thanh gần một điểm trên màn hình nhất trong phạm vi `reach` px, và kết quả tại đó |
| `readoutMarks` | `(model, transform, readout, shown, k, side) => ReadoutMark[]` | Nơi vẽ các giá trị đọc được: đầu tung độ của từng biểu đồ đang hiện (cả hai đầu tại bước nhảy), điểm trên sơ đồ biến dạng |
| `formatReadout` | `(readout, quantity, units, format?) => string` | `"M = 54 kNm"`, hoặc `"V = 13.3 → −6.7 kN"` tại bước nhảy |

`k` là số px trên một đơn vị SI cho mỗi kết quả, còn `side` là phía vẽ mỗi biểu đồ, lấy từ `diagramScales` và `diagramSide` ở dưới. Kiểu: `Readout`, `ReadoutMark` (`{ tone, from, to }` tính bằng px), `ReadoutQuantity` (`'N' \| 'V' \| 'M' \| 'w'`), `SidedValue`.

## Đường dầm {#beam-lines}

Các thành phần của [DiagramStack](/vi/plot/diagram-stack), để dựng hình xếp chồng của riêng bạn.

| Export | Chữ ký | Tác dụng |
| --- | --- | --- |
| `beamLine` | `(model, ids?) => BeamLine` | Các thanh thành một đường nằm ngang, từ trái sang phải; báo lỗi với mọi trường hợp khác |
| `lineDiagram` | `(model, line, row) => Piecewise` | Một kết quả dọc theo toàn bộ đường dầm, theo trục x của đường |
| `rowRange` | `(pw) => [number, number]` | Khoảng giá trị dùng để chia tỷ lệ một hàng, luôn chứa 0 |
| `rowPeaks` | `(pw) => RowPeak[]` | Các cực trị đáng ghi trên một hàng |
| `rowBreaks` | `(pw) => number[]` | Các điểm kết quả gián đoạn: gối tựa, mối nối và lực tập trung |
| `rowOutline` | `(pw, sx, sy, close) => string` | Dữ liệu path SVG cho đường bao của một hàng, khi biết các phép ánh xạ từ m và từ giá trị sang px |
| `rowOrdinates` | `(pw, sx, sy, spacing) => string` | Dữ liệu path SVG cho các tung độ kẻ vạch, cách nhau `spacing` px |
| `lineModel` | `(model, line, omit?) => PlotModel` | Mô hình thu gọn về đường dầm, có thể bỏ đi một tải trọng |
| `pointLoadAt` | `(model, line, at) => PlotLoad \| undefined` | Lực tập trung tại vị trí `at` trên đường dầm |

Kiểu: `BeamLine`, `LineMember`, `RowPeak`, `StackRow`.

Trang [DiagramStack](/vi/plot/diagram-stack#a-load-the-reader-can-drag) dùng `beamLine`, `lineDiagram` và `rowRange` để giữ tỷ lệ của mỗi hàng qua mọi vị trí của tải trọng di động.

## Hình học và gối tựa {#geometry-and-supports}

| Export | Chữ ký | Tác dụng |
| --- | --- | --- |
| `nodeMap` | `(model) => ReadonlyMap<string, PlotNode>` | Các nút theo id |
| `memberFrame` | `(model, member, nodes?) => MemberFrame` | Điểm đầu, véc tơ tiếp tuyến đơn vị, véc tơ z địa phương đơn vị và chiều dài của một thanh |
| `memberFrames` | `(model) => Map<string, MemberFrame>` | Như trên cho mọi thanh, theo id |
| `pointAlong` | `(frame, at) => { x, z }` | Điểm cách đầu thanh `at` mét |
| `supportKind` | `(fixity) => SupportKind` | `'fixed'`, `'pin'`, `'roller'`, `'slider'`, `'rotation'` hoặc `'none'` |
| `supportPlacement` | `(model, node) => SupportPlacement` | Ký hiệu cho một nút và góc xoay theo chiều kim đồng hồ của nó, độ |
| `supportGlyph` | `(kind) => readonly GlyphPart[]` | Các nét của ký hiệu, px |
| `glyphReach` | `(kind, rotation, x, z) => number` | Ký hiệu đã xoay vươn xa bao nhiêu theo một phương, px |

## Vẽ {#drawing}

Việc vẽ gồm ba bước. `buildStructureScene` biến mô hình thành các mục của cảnh (scene item): các điểm của mô hình kèm độ lệch tính bằng pixel màn hình. `fitScene` tìm tỷ lệ và độ dịch để chúng vừa một khối chứa. `resolveScene` biến chúng thành dữ liệu path SVG, hình tròn, và các nhãn còn chỗ. `layoutStructure` chạy cả ba bước như `StructurePlot` và `structureSvg` vẫn làm, nên hình riêng của bạn được bố trí giống hình của chúng.

| Export | Chữ ký | Tác dụng |
| --- | --- | --- |
| `layoutStructure` | `(model, options, box, shown?, labelModes?) => StructureLayout` | Toàn bộ bố cục: căn vừa với mọi nhãn, bỏ các nhãn bị chật, rồi căn lại. Trả về `{ fit, items, resolved }` |
| `structureSvg` | `(model, options?) => string` | Một tệp `.svg` độc lập: [ở trên](#a-standalone-svg-file) |
| `buildStructureScene` | `(model, options: StructureSceneOptions) => SceneItem[]` | Hình vẽ của các lớp được chọn ở một tỷ lệ, px trên mét |
| `fitScene` | `(items, box: FitBox) => Fit` | Tỷ lệ và độ dịch để vừa một khối chứa `{ width, height?, maxHeight?, padding, fontSize }` |
| `resolveScene` | `(items, transform, options: ResolveOptions) => ResolvedScene` | `{ paths, circles, texts }` tính bằng px, cùng các nhãn còn chỗ |
| `placeLabels` | `(items, transform, options: ResolveOptions) => Map<SceneText, SceneText>` | Giữ những nhãn nào, và đặt ở đâu |
| `alternativeResultGroups` | `(shown) => ReadonlySet<string>` | Các lớp kết quả hiện lần lượt từng lớp một; nhãn của chúng nhường chỗ cho phần còn lại nhưng không nhường nhau |
| `sceneBounds` | `(items, scale, fontSize) => Bounds` | Phạm vi của một cảnh, px |
| `project` | `(transform, anchor) => [number, number]` | Một điểm của cảnh trên màn hình, px |
| `defaultResultLayer` | `(model) => ResultLayer \| null` | Kết quả mà hình vẽ khi không được chỉ định |
| `diagramScales` | `(model, options) => Record<ResultLayer, number>` | Số px trên một đơn vị SI cho mỗi kết quả |
| `diagramSide` | `(q, momentOnTensionSide) => 1 \| -1` | Giá trị dương được vẽ về phía nào của thanh |
| `isBarStructure` | `(model, memberResults) => boolean` | N được ghi thành con số dọc theo thanh (dàn) hay vẽ thành biểu đồ |
| `tipPlacements` | `(tip, out, mode, gaps?) => TextPlacement[]` | Các vị trí mà một giá trị có thể chiếm ngoài đầu tung độ |
| `PLOT_LAYERS` | `readonly PlotLayer[]` | Mọi lớp, theo thứ tự vẽ |
| `RESULT_LAYERS` | `['N', 'V', 'M', 'w']` | Các lớp kết quả |
| `HATCH_SPACING_PX` | `7` | Khoảng cách giữa các tung độ kẻ vạch của biểu đồ, px |
| `DEFAULT_COLORS` | `PlotColors` | Màu mặc định của từng tông, dạng CSS: [Màu sắc và chủ đề](/vi/plot/theming) |
| `PRINT_COLORS` | `Record<Tone \| 'paper', string>` | Màu cố định cho tệp, màu của ứng dụng trên nền trắng |
| `toneVars` | `(colors?) => Record<string, string>` | Các custom property mà hình đặt trên phần tử gốc |
| `PLOT_CSS` | `string` | Các quy tắc CSS nhúng vào từng hình |

`ResolveOptions` có dạng `{ fontSize, viewport?, exclude?, alternativeGroups?, shields? }`: `shields` là các nhóm có nét vẽ không cho nhãn đè lên (các biểu đồ đang hiện), mặc định là tất cả khi bỏ trống. Trong `layoutStructure`, `options.layers` là các lớp cần bố trí (mọi thứ có thể hiện, như `reserve`), `shown` là các lớp đang hiện, còn `labelModes` là các cách ghi nhãn cần dành chỗ.

Kiểu: `StructureSceneOptions`, `StructureLayout`, `StructureSvgOptions`, `SceneItem`, `SceneText`, `TextPlacement`, `ResolvedScene`, `ResolvedPath`, `ResolvedText`, `ResolvedCircle`, `ResolveOptions`, `Bounds`, `Anchor`, `Transform`, `Fit`, `FitBox`, `Tone`, `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `SupportKind`, `SupportPlacement`, `GlyphPart`, và các kiểu mô hình ở trang [Mô hình vẽ](/vi/plot/model).
