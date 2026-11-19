---
title: Nút và gối tựa
description: "Tạo nút cho mô hình @edubeam/fem, đặt gối tựa bằng cách chặn bậc tự do, xoay hệ trục của gối để có gối di động xiên, và sửa nút sau khi giải."
order: 3
group: Mô hình hóa
source: site
---

# Nút và gối tựa {#nodes-and-supports}

Nút là những điểm mà các thanh nối vào. Gối tựa không phải là một đối tượng riêng: nó là danh sách các bậc tự do bị chặn tại nút. Các đoạn mã trên trang này là một phần của chương trình giống như ở trang [Bắt đầu](/vi/solver/getting-started), và dùng các biến `solver`, `domain` và `lc` của chương trình đó.

## Tạo nút {#create-a-node}

```ts
domain.createNode(label, [x, y, z], bcs)
```

| Đối số | Kiểu | Ý nghĩa |
| --- | --- | --- |
| `label` | `string \| number` | Tên của nút, lưu dưới dạng chuỗi: `1` và `'1'` là cùng một nút |
| `coords` | `number[]` | `[x, y, z]` tính bằng mét, với `y = 0`. Trục z hướng xuống. |
| `bcs` | `DofID[]` | Các bậc tự do mà gối tựa chặn. Bỏ trống nếu nút tự do. |

Phương thức trả về đối tượng `Node`; `domain.getNode(label)` giúp lấy lại nó sau này. Nếu nhãn đã được dùng, nút mới sẽ thay thế nút cũ.

```ts
import { DofID } from '@edubeam/fem'

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [0, 0, -4]) // tự do: đỉnh một cột cao 4 m
```

## Gối tựa {#supports}

Mỗi loại gối tựa của ứng dụng EduBeam là một tập bậc tự do bị chặn:

| Gối tựa | `bcs` | Chặn |
| --- | --- | --- |
| Ngàm | `[DofID.Dx, DofID.Dz, DofID.Ry]` | toàn bộ |
| Gối cố định | `[DofID.Dx, DofID.Dz]` | cả hai chuyển vị, xoay tự do |
| Gối di động | `[DofID.Dz]` | chuyển vị đứng, lăn theo x |
| Gối di động đứng | `[DofID.Dx]` | chuyển vị ngang, lăn theo z |
| Ngàm trượt | `[DofID.Dz, DofID.Ry]` | chuyển vị đứng và góc xoay, trượt theo x |
| Ngàm trượt đứng | `[DofID.Dx, DofID.Ry]` | chuyển vị ngang và góc xoay, trượt theo z |
| Chỉ chặn xoay | `[DofID.Ry]` | góc xoay |

Bạn liệt kê các bậc tự do theo thứ tự nào thì [phản lực](/vi/solver/results#reactions) trả về theo đúng thứ tự đó. Kết cấu cần ít nhất ba bậc tự do bị chặn, bố trí sao cho nó không thể chuyển động như một hệ biến hình: xem [Khi giải thất bại](/vi/solver/solving#when-solving-fails).

Một bậc tự do bị chặn cũng có thể được cho dịch chuyển một lượng cho trước, tức là lún gối tựa: xem [Chuyển vị cưỡng bức](/vi/solver/temperature-settlements#prescribed-displacements).

## Gối tựa xiên {#inclined-supports}

Gối di động đặt trên mặt nghiêng giữ nút theo phương vuông góc với mặt nghiêng, chứ không theo phương thẳng đứng. Xoay hệ trục của nút bằng `updateLcs`, khi đó `bcs` của nút sẽ hiểu theo hệ trục đã xoay. Trong chương trình ở trang Bắt đầu, hãy tạo nút B như sau:

```ts
const b = domain.createNode('B', [6, 0, 0], [DofID.Dz]) // chặn theo trục z riêng của nút
const a = (30 * Math.PI) / 180 // 30°, từ x về phía z: theo chiều kim đồng hồ trên màn hình
b.updateLcs({ locx: [Math.cos(a), 0, Math.sin(a)], locy: [0, 1, 0] })
```

`locx` là trục x riêng của nút, viết dưới dạng véc tơ trong hệ trục tổng thể, còn `locy` là trục y của nút, luôn giữ là `[0, 1, 0]`. Trong ứng dụng EduBeam, góc này chính là *Góc LCS của nút* (LCS: hệ tọa độ địa phương), bằng 30°.

Sau `solve()`, B đẩy theo phương vuông góc với mặt nghiêng, và gối cố định tại A nhận thành phần nằm ngang:

```ts
b.getReactions(lc).values // [-41569]: N theo trục z riêng của B, 36 kN / cos 30°
b.getReactions(lc, true).values // [20785, -36000, 0]: theo x, theo z, mô men
```

::model-figure{caption="Gối di động xoay 30°: phản lực vuông góc với mặt nghiêng, và dầm chịu kéo"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, N]
show: [nodeLabels]
---
::

Thành phần thẳng đứng vẫn là $qL/2 = 36$ kN; thành phần nằm ngang, $36 \tan 30° = 20{,}8$ kN, kéo dầm từ hai đầu. Mô men không đổi.

Tại nút có hệ trục đã xoay, chuyển vị và phản lực được tính theo hệ trục riêng của nút, trừ khi bạn truyền `true` để lấy theo hệ trục tổng thể. Ngược lại, tải trọng nút đặt lên nút đó tính theo hệ trục tổng thể, nếu bạn không chỉ định khác: xem [Tải trọng nút](/vi/solver/loads#nodal-loads). Gọi `node.updateLcs()` không có đối số để đưa hệ trục về như cũ.

## Sửa nút {#change-a-node}

Nút là một đối tượng thông thường: đổi `node.coords` để di chuyển nút, hoặc thay `node.bcs`, một `Set<DofID>`, để đổi gối tựa.

```ts
domain.getNode('B').coords = [8, 0, 0] // nhịp dài hơn: chỉ cần solve()
domain.getNode('A').bcs = new Set(fixed) // gối tựa mới: phải đánh số lại trước
solver.codeNumberGenerated = false
solver.solve()
```

Đổi gối tựa, hay thêm và xóa nút, sẽ làm thay đổi hệ phương trình: nếu thiếu `codeNumberGenerated = false`, bộ giải **âm thầm giữ nguyên gối tựa cũ**. Mục [Giải lại sau khi thay đổi](/vi/solver/solving#solving-again-after-a-change) liệt kê những thay đổi cần đến dòng này.
