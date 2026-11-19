---
title: Mô hình vẽ
description: "PlotModel: dữ liệu thuần, tuần tự hóa được thành JSON, do modelFromSolver tạo từ mô hình @edubeam/fem đã giải, kết quả dạng đa thức từng đoạn, cách đọc giá trị và cực trị chính xác."
order: 9
source: site
---

# Mô hình vẽ

Mọi thứ @edubeam/plot vẽ đều lấy từ một `PlotModel`: dữ liệu thuần mà `modelFromSolver` đọc ra từ một mô hình @edubeam/fem đã giải. Nó chứa hình học, gối tựa, tải trọng, phản lực, và kết quả của từng thanh dưới dạng đa thức chính xác. Mô hình này tuần tự hóa được thành JSON, nên có thể tạo lúc build và gửi đi thay cho bộ giải, và đây cũng là cách dễ nhất để đọc giá trị và cực trị chính xác của một kết cấu đã giải.

```ts
import { modelFromSolver } from '@edubeam/plot'

const model = modelFromSolver(solver) // hoặc modelFromSolver(solver, { loadCase: 1 })
```

`results` chỉ có khi trường hợp tải đã được giải. Khi không có, các component chỉ vẽ mô hình, và với [`reactionLabels: 'names'`](/vi/plot/structure-plot#reactions-as-unknowns) chúng vẫn vẽ các phản lực chưa biết, nên một mô hình chưa giải vẫn có thể làm phiếu bài tập.

## Định dạng {#the-format}

Mọi giá trị đều theo đơn vị SI (m, N, N·m, N/m, K, rad) và theo hệ trục của bộ giải: x sang phải, z hướng xuống, góc xoay dương khi ngược chiều kim đồng hồ trên màn hình.

```ts
interface PlotModel {
  readonly nodes: readonly PlotNode[]
  readonly members: readonly PlotMember[]
  readonly loads: readonly PlotLoad[]
  readonly results?: PlotResults // chỉ khi trường hợp tải đã giải
}

interface PlotNode {
  readonly id: string
  readonly x: number
  readonly z: number
  readonly fixity: { readonly dx: boolean; readonly dz: boolean; readonly ry: boolean } // các bậc tự do bị chặn
  readonly angle: number // góc xoay hệ trục của gối xiên, rad, theo chiều kim đồng hồ trên màn hình
}

interface PlotMember {
  readonly id: string
  readonly start: string // id của nút
  readonly end: string
  readonly hinges: readonly [boolean, boolean]
}

interface PlotResults {
  readonly members: Readonly<Record<string, MemberResults>> // theo id của thanh
  readonly reactions: readonly PlotReaction[]
}

interface MemberResults {
  readonly N: Piecewise // lực dọc, kéo là dương
  readonly V: Piecewise // lực cắt
  readonly M: Piecewise // mô men uốn, dương khi thớ phía +z địa phương chịu kéo
  readonly u: Piecewise // chuyển vị theo trục x địa phương
  readonly w: Piecewise // chuyển vị theo trục z địa phương
}

interface PlotReaction {
  readonly node: string
  readonly dof: 'dx' | 'dz' | 'ry'
  readonly value: number // lực tác dụng lên kết cấu theo trục của nút, N (N·m với ry)
}
```

Tải trọng thuộc một trong bảy loại, phân biệt bằng `kind`:

| `kind` | Trường | Là |
| --- | --- | --- |
| `'nodalForce'` | `node`, `fx`, `fz` | lực tại nút, các thành phần theo hệ trục tổng thể, N |
| `'nodalMoment'` | `node`, `my` | mô men tại nút, N·m |
| `'distributed'` | `member`, `start`, `end`, `local` | tải phân bố biến đổi tuyến tính, `{ fx, fz }` ở mỗi đầu, N/m; phân bố đều khi hai đầu bằng nhau |
| `'pointForce'` | `member`, `at`, `fx`, `fz`, `local` | lực cách đầu thanh `at` mét |
| `'pointMoment'` | `member`, `at`, `my` | mô men tập trung trên thanh |
| `'temperature'` | `member`, `uniform`, `gradient` | K: thay đổi nhiệt độ tại trọng tâm, và chênh lệch thớ dưới trừ thớ trên |
| `'prescribed'` | `node`, `dx?`, `dz?`, `ry?` | chuyển vị cưỡng bức của gối tựa theo trục nút, m và rad |

`local` là `true` khi các thành phần lấy theo trục x và z địa phương của thanh thay vì hệ trục tổng thể.

## Đa thức từng đoạn {#piecewise-polynomials}

Kết quả của một thanh là một `Piecewise`: danh sách các đoạn, mỗi đoạn là một đa thức trên một phần của thanh. Một đoạn mới bắt đầu ở mọi chỗ mà lực tập trung hay mô men tập trung làm kết quả bị gián đoạn.

```ts
interface Piece {
  readonly x0: number // m tính từ đầu thanh
  readonly x1: number
  readonly c: readonly number[] // giá trị = Σ c[k]·sᵏ, với s = (x − x0)/(x1 − x0)
}
type Piecewise = readonly Piece[]
```

N, V và M cao nhất là bậc ba, độ võng cao nhất là bậc năm, nên chỉ cần vài hệ số là chứa trọn đáp số chính xác của bộ giải. Lực cắt của dầm nhịp 6 m với lực 20 kN tại 2 m gồm hai đoạn hằng số:

```json
[{ "x0": 0, "x1": 2, "c": [13333.33] }, { "x0": 2, "x1": 6, "c": [-6666.67] }]
```

## Tự đọc giá trị {#reading-values-yourself}

Các hàm vẽ biểu đồ cũng đọc được chúng, chính xác và không cần lấy mẫu:

```ts
import { extremes, innerBreaks, modelFromSolver, valueAt } from '@edubeam/plot'

// dầm đơn giản nhịp 6 m, 20 kN cách A 2 m, IPE 200 bỏ qua biến dạng trượt
const model = modelFromSolver(solver)
const { V, M, w } = model.results!.members['1']

innerBreaks(V) // [2]: các đoạn nối nhau tại lực tập trung
valueAt(V, 2, 'left') // 13333.3 N, ngay trước lực
valueAt(V, 2, 'right') // -6666.7 N, ngay sau lực
extremes(M) // max 26666.7 N·m tại x = 2
extremes(w) // max 0.018973 m tại x = 2.734
```

`extremes` trả về `{ max, min }`, mỗi giá trị có dạng `{ x, value, side }`, hoặc `null` với danh sách rỗng. Độ võng lớn nhất không nằm dưới lực tập trung: nó ở $x = L - \sqrt{(L^2 - a^2)/3} = 2{,}734$ m, và bằng $P\,a\,(L^2 - a^2)^{3/2}/9\sqrt{3}\,EIL = 18{,}97$ mm, đúng như công thức cho lực không đặt giữa nhịp.

Đây là cách [bộ sinh bài tập](/vi/plot/exercises#the-generator) tìm mô men cực trị cho đáp án. Trang [Hàm](/vi/plot/functions#piecewise-polynomials) liệt kê phần còn lại: đạo hàm, cực trị bên trong một đoạn, bậc đa thức và đường cong Bézier.

## Gửi dưới dạng JSON {#ship-it-as-json}

Chỉ cần `JSON.stringify(model)`, và `JSON.parse` trả lại một mô hình được vẽ giống hệt như từ bộ giải. Một khung cổng với một tải phân bố và một lực tập trung chưa đến 2 kB. Xem [Nhúng vào trang web](/vi/plot/embedding#ship-the-drawing-not-the-solver). Mô hình cũng dùng được cho [`structureSvg`](/vi/plot/functions#a-standalone-svg-file), hàm ghi nó thành tệp SVG.
