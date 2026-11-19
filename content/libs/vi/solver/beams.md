---
title: Dầm
description: "Chương trình @edubeam/fem hoàn chỉnh cho dầm công xôn và dầm liên tục hai nhịp, kèm đầu ra, mỗi bài đều đối chiếu với công thức trong giáo trình."
order: 12
group: Ví dụ hoàn chỉnh
source: site
---

# Dầm {#beams}

Hai chương trình hoàn chỉnh để bạn sao chép và sửa đổi. Cả hai dùng tiết diện không biến dạng trượt (`k: 1e32`), nên kết quả khớp chính xác với công thức Euler–Bernoulli. Chạy bằng `node cantilever.ts` (Node 22.18 trở lên), trong thư mục đã chuẩn bị như ở mục [Cài đặt](/vi/solver/getting-started#install).

## Dầm công xôn {#a-cantilever}

Dài 4 m, ngàm tại A, lực 18 kN hướng xuống tại đầu tự do:

```ts [cantilever.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // ngàm
const tip = domain.createNode('B', [4, 0, 0]) // tự do
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
lc.createNodalLoad('B', { [DofID.Dz]: 18e3 }) // 18 kN hướng xuống tại đầu tự do
solver.solve()

console.log(beam.computeBendingMomentAt(lc, 0)) // N·m tại ngàm
console.log(tip.getUnknowns(lc, [DofID.Dz])) // m, độ võng đầu tự do
```

```text [Đầu ra]
-72000
0.09411072715241528
```

$M_A = -FL = -72$ kNm, căng thớ trên, và độ võng đầu tự do là $FL^3/3EI = 94{,}11$ mm, với $EI = 4{,}0803$ MNm². Chính dầm công xôn này cũng là một trong các ví dụ của ứng dụng EduBeam.

## Dầm liên tục {#a-continuous-beam}

Hai nhịp 5 m trên ba gối, tải 10 kN/m trên cả hai nhịp. Cần tìm phản lực, mô men tại gối giữa và mô men nhịp lớn nhất:

```ts [continuous.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [5, 0, 0], [DofID.Dz])
domain.createNode('C', [10, 0, 0], [DofID.Dz])
const span1 = domain.createBeam2D(1, ['A', 'B'], 1, 1)
domain.createBeam2D(2, ['B', 'C'], 1, 1)

const lc = solver.loadCases[0]
for (const span of [1, 2]) {
  lc.createBeamElementUniformEdgeLoad(span, [0, 10e3], true)
}
solver.solve()

// getReactions trả về Matrix của mathjs hoặc một mảng: chuyển về mảng
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

for (const label of ['A', 'B', 'C']) {
  const { dofs, values } = domain.getNode(label).getReactions(lc)
  const rz = list(values)[dofs.indexOf(DofID.Dz)]
  console.log(`R${label} = ${(-rz / 1e3).toFixed(2)} kN up`)
}
const mB = span1.computeBendingMomentAt(lc, 5)
console.log(`MB = ${(mB / 1e3).toFixed(2)} kNm`)

// Mô men dương lớn nhất trong nhịp 1, từ 501 điểm dọc theo nhịp
const { x, M } = span1.computeBendingMoment(lc, 500)
const i = M.indexOf(Math.max(...M))
console.log(`max M = ${(M[i] / 1e3).toFixed(2)} kNm at x = ${x[i]} m`)
```

```text [Đầu ra]
RA = 18.75 kN up
RB = 62.50 kN up
RC = 18.75 kN up
MB = -31.25 kNm
max M = 17.58 kNm at x = 1.87 m
```

Giá trị trong giáo trình cho hai nhịp bằng nhau: $R_A = R_C = 0{,}375\,qL$, $R_B = 1{,}25\,qL$, $M_B = -qL^2/8$, và mô men nhịp lớn nhất $R_A^2/2q = 17{,}58$ kNm, tại $x = R_A/q = 1{,}875$ m. Phép lấy mẫu tìm thấy nó tại điểm lưới 1,87 m, lệch so với giá trị đúng chưa tới 0,0002 kNm.

::model-figure{caption="Hai nhịp 5 m chịu 10 kN/m"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels]
---
::

Hình vẽ dùng tiết diện ví dụ của ứng dụng chứ không phải IPE 200. Khi cả dầm dùng chung một tiết diện, nội lực của dầm liên tục không phụ thuộc vào độ cứng, nên các biểu đồ cho cùng con số; chỉ có độ võng là khác.

## Thử thay đổi {#change-it}

- **Nhịp hoặc tải không bằng nhau:** đổi tọa độ của C hoặc danh sách tải. Đặt tải chỉ trên một nhịp sẽ cho sơ đồ chất tải cách nhịp quen thuộc.
- **Ba nhịp:** thêm nút D và thanh `['C', 'D']`.
- **Một đầu ngàm:** cho A `[DofID.Dx, DofID.Dz, DofID.Ry]`.
- **Có biến dạng trượt thực:** `k: 5 / 6` với tiết diện chữ nhật, hoặc hệ số hiệu chỉnh cắt của tiết diện bạn dùng.
- **Vẽ hình:** đưa bộ giải cho [@edubeam/plot](/vi/solver/drawing).

Bài [Hướng dẫn: dầm liên tục và lún gối tựa](/vi/tutorials/continuous-beam) dựng một dầm như vậy trong ứng dụng EduBeam, còn trang [Kiểm tra kết quả bằng tính tay](/vi/guide/verification) có thêm nhiều bài toán trong giáo trình kèm công thức.
