---
title: Đọc kết quả
description: "Đọc phản lực, chuyển vị nút, nội lực tại mọi điểm trên thanh, đường đàn hồi và nội lực đầu phần tử từ mô hình @edubeam/fem đã giải, kèm dạng dữ liệu trả về."
order: 10
source: site
---

# Đọc kết quả {#reading-results}

Sau `solve()`, kết quả được đọc từ các nút và các thanh, cho một trường hợp tải cụ thể. Mọi ví dụ trên trang này đọc cùng một mô hình: dầm đơn giản nhịp 6 m, tiết diện IPE 200 không biến dạng trượt, chịu lực 20 kN cách A 2 m:

```ts [results.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 }) // không biến dạng trượt

const A = domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
const B = domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
const lc = solver.loadCases[0]
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], true)
solver.solve()
```

::model-figure{caption="Lực 20 kN cách gối A 2 m, nhịp 6 m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M, w]
show: [nodeLabels]
---
::

## Đọc gì, ở đâu {#what-to-read-where}

| Kết quả | Lệnh gọi | Trả về |
| --- | --- | --- |
| Phản lực | `node.getReactions(lc)` | `{ dofs, values }`: N, N·m |
| Chuyển vị | `node.getUnknowns(lc, dofs)` | m, rad |
| N, V hoặc M tại một điểm | `beam.computeBendingMomentAt(lc, x)` | một số: N, N·m |
| N, V hoặc M dọc theo thanh | `beam.computeBendingMoment(lc, n)` | `{ x, M }`, n + 1 điểm |
| Đường đàn hồi | `beam.computeLocalDefl(lc, n)` | `{ u, w }`, n + 1 điểm, m |
| Nội lực đầu phần tử | `beam.computeEndForces(lc)` | ma trận mathjs gồm 6 giá trị |

Với N và V, các phương thức là `computeNormalForceAt` và `computeShearForceAt`, `computeNormalForce` và `computeShearForce`, trả về `{ x, N }` và `{ x, V }`. Quy ước dấu có ở trang [Đơn vị và quy ước dấu](/vi/solver/conventions#signs-of-the-results).

## Phản lực {#reactions}

`getReactions` cho một phản lực ứng với mỗi bậc tự do bị gối tựa chặn: `dofs` liệt kê các bậc tự do đó, theo thứ tự đã truyền cho `createNode`, và `values` chứa các phản lực theo cùng thứ tự. `values` là **ma trận mathjs** khi có nhiều phản lực và là mảng thông thường khi chỉ có một, nên một hàm phụ nhỏ giúp luôn đưa nó về mảng:

```ts
/** Chuyển Matrix của mathjs, mảng hoặc số thành mảng thông thường. */
const list = (v: unknown): number[] =>
  typeof v === 'number'
    ? [v]
    : Array.isArray(v)
      ? v
      : (v as { toArray(): number[] }).toArray()

A.getReactions(lc).dofs // [0, 2]: DofID.Dx, DofID.Dz
list(A.getReactions(lc).values) // [0, -13333.3]
list(B.getReactions(lc).values) // [-6666.7]
```

Để lấy một phản lực bất kể thứ tự, hãy tra theo bậc tự do của nó: `list(values)[dofs.indexOf(DofID.Dz)]`, như trong [ví dụ dầm liên tục](/vi/solver/beams#a-continuous-beam).

Phản lực là lực mà gối tựa tác dụng lên kết cấu: −13 333 N theo z nghĩa là 13,3 kN đẩy lên, $P\,b/L = 20 \cdot 4/6$. Tại nút có [hệ trục đã xoay](/vi/solver/nodes-supports#inclined-supports), phản lực tính theo hệ trục đó; `getReactions(lc, true)` chuyển chúng sang hệ trục tổng thể và trả về cả ba bậc tự do, với 0 ở những bậc tự do không bị chặn. Nút không có gối tựa cho `{ dofs: [], values: [] }`.

## Chuyển vị {#displacements}

`getUnknowns` đọc bất kỳ bậc tự do nào của nút, dù có gối tựa hay không:

```ts
list(A.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])) // [0, 0, -0.0108924]
```

A xoay theo chiều kim đồng hồ một góc 0,010892 rad, $P\,b\,(L^2 - b^2)/6EIL$. Khi chỉ hỏi một bậc tự do, `getUnknowns` trả về một số thông thường, dù TypeScript khai báo kiểu ma trận: `list` cũng xử lý được trường hợp này.

## Nội lực dọc theo thanh {#internal-forces-along-a-member}

Các phương thức `…At` cho giá trị tại điểm cách nút thứ nhất của thanh `x` mét:

```ts
beam.computeShearForceAt(lc, 1) // 13333.3 N
beam.computeShearForceAt(lc, 2) // -6666.7 N: tại vị trí lực, giá trị ngay sau lực
beam.computeBendingMomentAt(lc, 2) // 26666.7 N·m: R_A · 2
```

Tại chỗ lực tập trung gây bước nhảy, giá trị đúng tại vị trí lực là giá trị ngay sau lực. Muốn đọc giá trị ngay trước lực, hãy hỏi tại một điểm sát trước đó, chẳng hạn `x - 1e-9`.

Các phương thức trả về mảng lấy mẫu thanh tại n + 1 điểm cách đều, kể cả hai đầu:

```ts
beam.computeBendingMoment(lc, 3)
// { x: [0, 2, 4, 6], M: [0, 26666.7, 13333.3, 0] }, chưa kể sai số làm tròn
```

Sẽ có sai số làm tròn, chẳng hạn `-3.6e-12` ở chỗ giá trị chính xác là 0: hãy định dạng số bằng `toFixed` trước khi in. Giá trị lớn nhất dọc theo thanh lấy bằng giá trị lớn nhất trong một lần lấy mẫu dày điểm, chẳng hạn `computeBendingMoment(lc, 500)`, như trong [ví dụ dầm liên tục](/vi/solver/beams#a-continuous-beam). Dưới tải phân bố, M là một đa thức, nên cực trị chính xác của nó nằm ở chỗ V đổi dấu; [@edubeam/plot](/vi/plot/model#reading-values-yourself) tìm chính xác điểm đó.

## Đường đàn hồi {#deflected-shape}

```ts
beam.computeLocalDefl(lc, 3)
// { u: [0, 0, 0, 0], w: [0, 0.0174279, 0.0152494, 0] }
```

`computeLocalDefl` cho chuyển vị dọc và vuông góc với thanh, `u` và `w`, trong hệ trục địa phương; `computeGlobalDefl` cho cùng các điểm đó theo x và z tổng thể. Độ võng dưới lực, 17,43 mm, bằng $P\,a^2 b^2/3EIL$. Hình dạng giữa các nút là chính xác, không phải nội suy từ giá trị ở hai đầu. Để vẽ nó, xem [Vẽ kết quả](/vi/solver/drawing).

## Nội lực đầu phần tử {#end-forces}

```ts
beam.computeEndForces(lc).toArray()
// [0, -13333.3, 0, 0, -6666.7, 0]: X12, Z12, M12, X21, Z21, M21
```

Đây là các lực mà hai nút tác dụng lên thanh, trong hệ trục địa phương của thanh: chính là các số trong bảng *Kết quả phần tử* của ứng dụng, được giải thích ở mục [Nội lực đầu phần tử](/vi/elements/conventions#end-forces-element-results-table).

## Kết quả để đối chiếu {#results-as-numbers-to-check}

Mọi giá trị ở trên đều khớp với công thức giải tích tương ứng. Trang [Kiểm tra kết quả bằng tính tay](/vi/guide/verification) trình bày thêm nhiều bài toán trong giáo trình, do chính bộ giải này tính ngay trong trình duyệt của bạn.
