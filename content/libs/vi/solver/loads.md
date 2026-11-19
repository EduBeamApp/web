---
title: Tải trọng nút và tải trọng trên thanh
description: "Đặt lực, mô men tại nút và tải phân bố đều, hình thang, lực tập trung trên thanh trong @edubeam/fem, theo hệ trục tổng thể hoặc địa phương; rồi sửa hoặc xóa."
order: 6
group: Tải trọng
source: site
---

# Tải trọng nút và tải trọng trên thanh {#nodal-and-member-loads}

Tải trọng thuộc về một trường hợp tải. Bộ giải có sẵn một trường hợp tải, `solver.loadCases[0]`, và mỗi phương thức `create…` của nó thêm một tải trọng rồi trả về tải trọng đó. Khi cần nhiều trường hợp tải và tổ hợp của chúng, xem [Trường hợp tải](/vi/solver/load-cases).

Giá trị tính bằng N, N/m và N·m, theo [hệ trục](/vi/solver/conventions#axes): +z hướng xuống, mô men dương ngược chiều kim đồng hồ.

## Một dầm với đủ loại tải {#a-beam-with-every-kind}

Một dầm dài 8 m trên gối cố định và gối di động, chịu tải phân bố tăng dần từ 4 lên 10 kN/m, một lực tập trung 20 kN, một mô men tập trung 10 kNm và một lực ngang tại gối di động:

```ts [loads.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // gối cố định
domain.createNode('B', [8, 0, 0], [DofID.Dz]) // gối di động
domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
// 4 kN/m tại A tăng dần đến 10 kN/m tại B, hướng xuống
lc.createBeamElementTrapezoidalEdgeLoad(1, [0, 4e3], [0, 10e3], false)
// [fx, fz, my, a]: 20 kN hướng xuống, cách A 2 m
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], false)
// mô men tập trung 10 kNm ngược chiều kim đồng hồ, cách A 6 m
lc.createBeamConcentratedLoad(1, [0, 0, 10e3, 6], false)
// 5 kN hướng sang phải tại B
lc.createNodalLoad('B', { [DofID.Dx]: 5e3 })
solver.solve()

// getReactions trả về Matrix của mathjs hoặc một mảng: chuyển về mảng
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

console.log(list(domain.getNode('A').getReactions(lc).values))
console.log(list(domain.getNode('B').getReactions(lc).values))
```

```text [Đầu ra]
[ -5000, -40250 ]
[ -35750 ]
```

Tính tay: tải phân bố có hợp lực 56 kN, đặt cách A 4,571 m, nên phương trình mô men với A cho $8R_B = 56 \cdot 4{,}571 + 20 \cdot 2 - 10 = 286$, $R_B = 35{,}75$ kN hướng lên, và $R_A = 76 - 35{,}75 = 40{,}25$ kN hướng lên. Gối cố định còn giữ lực 5 kN, làm cả dầm chịu kéo 5 kN.

::model-figure{caption="Cùng các tải trọng đó. Hình vẽ đặt mô men tập trung vào nút C tại 6 m, cho cùng kết quả."}
---
nodes: { A: [0, 0], C: [6, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: [4, 8.5] }
  - { member: 2, qz: [8.5, 10] }
  - { member: 1, pz: 20, at: 2 }
  - { node: C, my: 10 }
  - { node: B, fx: 5 }
results: [M]
show: [nodeLabels]
labels: horizontal
---
::

## Tải trọng nút {#nodal-loads}

```ts
lc.createNodalLoad(node, { [DofID.Dx]: fx, [DofID.Dz]: fz, [DofID.Ry]: my }, lcs)
```

Chỉ cần khai báo những thành phần bạn dùng. Giá trị tính theo hệ trục tổng thể, hoặc theo hệ trục riêng của nút nếu `lcs` là `true`, dành cho nút đã xoay bằng [`updateLcs`](/vi/solver/nodes-supports#inclined-supports). Lực đặt vào bậc tự do bị gối tựa chặn sẽ truyền thẳng vào phản lực và không gây uốn.

## Tải trọng trên thanh {#member-loads}

| Phương thức | Giá trị | Tải trọng |
| --- | --- | --- |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | N/m | phân bố đều trên toàn bộ thanh |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | N/m | tuyến tính, từ nút thứ nhất đến nút thứ hai |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | N, N·m, m | một lực và một mô men tập trung, cách nút thứ nhất `a` mét |

Tải phân bố luôn phủ toàn bộ thanh. Với tải chỉ đặt trên một phần nhịp, hãy chia thanh bằng một nút tại điểm tải bắt đầu: thêm nút không làm thay đổi kết quả nào. Lực tập trung hay mô men tập trung thì đặt được ở bất kỳ đâu trên thanh.

### Hệ trục tổng thể hay địa phương {#global-or-local-axes}

Đối số cuối cùng, `lcs`, cho biết các thành phần được cho trong hệ trục nào:

- `false`: trục x và z tổng thể. `fz` tác dụng theo phương thẳng đứng, bất kể thanh nghiêng thế nào.
- `true`: trục x địa phương (dọc thanh) và trục z địa phương (vuông góc với thanh). `fz` tác dụng vuông góc với thanh.

Với thanh nằm ngang vẽ từ trái sang phải, hai cách này như nhau; với thanh vẽ từ phải sang trái, `fz` địa phương hướng lên.

::callout{type="info" title="Tải phân bố tính trên mỗi mét chiều dài thanh"}
Cả hai loại đều tác dụng trên mỗi mét chiều dài thực của thanh. Với một kèo mái dài 5 m có hình chiếu ngang 4 m, `[0, 10e3]` trong hệ trục tổng thể cộng lại thành 50 kN. Tải tuyết 10 kN/m trên mỗi mét hình chiếu ngang tương ứng với $10 \cdot 4/5 = 8$ kN/m dọc theo kèo: hãy nhập `[0, 8e3]`.
::

## Sửa hoặc xóa tải trọng {#change-or-remove-a-load}

Mỗi phương thức `create…` trả về tải trọng vừa tạo. Đổi giá trị của nó rồi giải lại:

```ts
const q = lc.createBeamElementUniformEdgeLoad(1, [0, 10e3], true)
solver.solve()
q.values = [0, 20e3] // tải tăng gấp đôi
solver.solve()
```

Các tải trọng nằm trong những mảng thông thường, `lc.nodalLoadList` và `lc.elementLoadList` (tải trên thanh và tải nhiệt độ), nên `lc.elementLoadList.splice(index, 1)` xóa một tải. Tên thuộc tính của từng loại tải có trong [Tham chiếu API](/vi/solver/reference#loads).

Thay đổi nhiệt độ và lún gối tựa cũng là tải trọng: xem [Nhiệt độ và lún gối tựa](/vi/solver/temperature-settlements).
