---
title: Thanh và khớp
description: "Nối các nút bằng thanh Beam2D, giải phóng mô men bằng khớp đầu thanh, mô hình hóa thanh dàn, và lấy ma trận độ cứng, ma trận biến đổi của phần tử từ @edubeam/fem."
order: 5
source: site
---

# Thanh và khớp {#members-and-hinges}

Mọi thanh đều là một `Beam2D`: dầm Timoshenko thẳng, có hai nút, nằm trong mặt phẳng x–z, chịu lực dọc, lực cắt và mô men uốn. Khớp ở đầu thanh giải phóng mô men tại đầu đó. Các đoạn mã dùng `solver`, `domain` và `lc` của một chương trình giống như ở trang [Bắt đầu](/vi/solver/getting-started), cùng vật liệu `'steel'` và tiết diện `'IPE200'` của chương trình đó.

## Tạo thanh {#create-a-member}

```ts
domain.createBeam2D(label, [startNode, endNode], material, crossSection, hinges)
```

| Đối số | Kiểu | Ý nghĩa |
| --- | --- | --- |
| `label` | `string \| number` | Tên của thanh, lưu dưới dạng chuỗi |
| `nodes` | `[label, label]` | Nút thứ nhất và nút thứ hai. Trục x địa phương chạy từ nút thứ nhất đến nút thứ hai: xem [Chiều của thanh](/vi/solver/conventions#member-direction). |
| `mat`, `cs` | `string \| number` | Nhãn của vật liệu và của tiết diện |
| `hinges` | `[boolean, boolean]` | Khớp tại nút thứ nhất, tại nút thứ hai. Không bắt buộc; mặc định là `[false, false]`, hai đầu liên kết cứng. |

Phương thức trả về đối tượng `Beam2D`: hãy giữ lại nó để đọc kết quả. `domain.getElement(label)` cũng lấy lại được thanh, nhưng với kiểu chung là `Element`, nên TypeScript yêu cầu viết `as Beam2D` trước khi đọc kết quả.

Các thanh gặp nhau tại một nút mà không có khớp thì được nối cứng: chúng xoay cùng nhau. Nút, vật liệu và tiết diện có thể tạo theo thứ tự bất kỳ, miễn là tất cả đều tồn tại khi giải; thiếu một đối tượng thì `solve()` ném ra `RangeError` kèm tên của đối tượng đó.

## Khớp đầu thanh {#end-hinges}

Khớp thuộc về một đầu thanh, không thuộc về nút. Ở đây thanh 2 bắt đầu bằng một khớp tại C, nên C truyền lực cắt nhưng không truyền mô men từ nhịp C–D sang đoạn công xôn A–C:

```ts [hinge.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry])
domain.createNode('C', [2, 0, 0])
domain.createNode('D', [6, 0, 0], [DofID.Dz])
const ac = domain.createBeam2D(1, ['A', 'C'], 'steel', 'IPE200')
const cd = domain.createBeam2D(2, ['C', 'D'], 'steel', 'IPE200', [true, false])

lc.createBeamElementUniformEdgeLoad(2, [0, 10e3], true)
solver.solve()

cd.computeBendingMomentAt(lc, 0) // 0 tại khớp
cd.computeBendingMomentAt(lc, 2) // 20000 N·m: qL²/8 của nhịp 4 m
ac.computeBendingMomentAt(lc, 0) // -40000 N·m: lực 20 kN từ C–D, cánh tay đòn 2 m
```

::model-figure{caption="Dầm công xôn đỡ một nhịp có khớp: không có mô men tại C"}
---
nodes: { A: [0, 0], C: [2, 0], D: [6, 0] }
supports: { A: fixed, D: roller }
members: [[A, C], { nodes: [C, D], hinges: [true, false] }]
loads:
  - { member: 2, qz: 10 }
results: [M, V]
show: [nodeLabels]
---
::

Khi nhiều thanh gặp nhau tại một nút khớp, chỉ cần đặt khớp ở mọi đầu thanh trừ một. Đặt khớp ở tất cả các đầu thanh cũng được: khi đó không có gì làm nút xoay, và bộ giải báo góc xoay của nút bằng 0. Nhưng mô men tác dụng vào một nút như vậy không có gì tiếp nhận, và [bộ giải sẽ thất bại](/vi/solver/solving#when-solving-fails).

## Thanh dàn {#truss-bars}

Đặt khớp ở cả hai đầu, thanh chỉ chịu lực dọc, miễn là tải trọng chỉ đặt tại nút: đó là thanh dàn.

```ts
domain.createBeam2D('AE', ['A', 'E'], 'steel', 'bar', [true, true])
```

[Ví dụ dàn](/vi/solver/trusses) giải cả một dàn theo cách này. Ví dụ dàn trong ứng dụng EduBeam thì lại dùng nút cứng, với diện tích lớn đến mức mô men uốn không đáng kể so với lực dọc. Cả hai đều là mô hình hợp lệ; chúng chỉ khác nhau ở những mô men nhỏ đó. Ma trận độ cứng của thanh dàn được thiết lập trong trang [Phần tử thanh dàn](/vi/elements/truss) của sổ tay lý thuyết.

## Ma trận của phần tử {#the-element-s-matrices}

Để dạy chính phương pháp tính, `Beam2D` cung cấp các ma trận của nó dưới dạng ma trận [mathjs](https://mathjs.org); `.toArray()` chuyển chúng thành `number[][]`:

| Phương thức | Cho ra |
| --- | --- |
| `computeGeo()` | `{ l, dx, dz }`: chiều dài và các hình chiếu, m |
| `computeLocalStiffnessMtrx().answer` | ma trận độ cứng 6 × 6 trong hệ trục địa phương, đã ngưng tụ bậc tự do tại khớp |
| `computeT()` | ma trận biến đổi 6 × 6 từ hệ trục tổng thể sang hệ trục địa phương |
| `computeStiffness()` | ma trận độ cứng 6 × 6 trong hệ trục tổng thể, $T^T K_l T$ |
| `computeShearFactor()` | $\Phi = 12EI_y/kGAL^2$ |

```ts
ac.computeStiffness().toArray() // number[][], N/m, N và N·m
```

Các bậc tự do được sắp theo thứ tự $u_1, w_1, \varphi_1, u_2, w_2, \varphi_2$. Trang [Phần tử dầm](/vi/elements/beam) của sổ tay lý thuyết thiết lập các ma trận này, còn trang [EduBeam giải mô hình như thế nào](/vi/elements/analysis) cho thấy cách ghép chúng vào ma trận tổng thể.
