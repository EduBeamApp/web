---
title: Dàn
description: "Dàn Warren liên kết khớp trong @edubeam/fem, lực dọc của mọi thanh được kiểm tra bằng phương pháp mặt cắt, và vòng lặp tạo dàn với số khoang bất kỳ."
order: 14
source: site
---

# Dàn {#trusses}

Dàn gồm các thanh có khớp ở hai đầu và chịu tải tại nút, nên mỗi thanh chỉ chịu lực dọc. Ví dụ này dựng một dàn Warren từ hai danh sách, kiểm tra lực dọc của từng thanh bằng tính tay, rồi dùng vòng lặp để tạo dàn với kích thước bất kỳ.

::model-figure{caption="Dàn Warren: nhịp 9 m, cao 1,8 m, 8 kN tại mỗi nút cánh trên"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members:
  - { nodes: [A, B], hinges: [true, true] }
  - { nodes: [B, C], hinges: [true, true] }
  - { nodes: [C, D], hinges: [true, true] }
  - { nodes: [E, F], hinges: [true, true] }
  - { nodes: [F, G], hinges: [true, true] }
  - { nodes: [A, E], hinges: [true, true] }
  - { nodes: [E, B], hinges: [true, true] }
  - { nodes: [B, F], hinges: [true, true] }
  - { nodes: [F, C], hinges: [true, true] }
  - { nodes: [C, G], hinges: [true, true] }
  - { nodes: [G, D], hinges: [true, true] }
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: [N, w]
show: [nodeLabels]
---
::

```ts [truss.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })

// Dàn Warren: nhịp 9 m, cao 1.8 m, cánh dưới A-B-C-D, cánh trên E-F-G
const nodes: [string, number, number, DofID[]][] = [
  ['A', 0, 0, [DofID.Dx, DofID.Dz]],
  ['B', 3, 0, []],
  ['C', 6, 0, []],
  ['D', 9, 0, [DofID.Dz]],
  ['E', 1.5, -1.8, []],
  ['F', 4.5, -1.8, []],
  ['G', 7.5, -1.8, []],
]
for (const [label, x, z, support] of nodes) {
  domain.createNode(label, [x, 0, z], support)
}

// Mỗi nhãn gồm tên hai nút của thanh. Khớp ở cả hai đầu: chỉ có lực dọc.
const bars = ['AB', 'BC', 'CD', 'EF', 'FG', 'AE', 'EB', 'BF', 'FC', 'CG', 'GD']
const members = bars.map((bar) =>
  domain.createBeam2D(bar, [bar[0], bar[1]], 1, 1, [true, true])
)

const lc = solver.loadCases[0]
for (const top of ['E', 'F', 'G']) {
  lc.createNodalLoad(top, { [DofID.Dz]: 8e3 }) // 8 kN hướng xuống
}
solver.solve()

for (const bar of members) {
  const n = bar.computeNormalForceAt(lc, 0) / 1e3
  console.log(bar.label, n.toFixed(2), n > 0 ? 'tension' : 'compression')
}
```

```text [Đầu ra]
AB 10.00 tension
BC 16.67 tension
CD 10.00 tension
EF -13.33 compression
FG -13.33 compression
AE -15.62 compression
EB 5.21 tension
BF -5.21 compression
FC -5.21 compression
CG 5.21 tension
GD -15.62 compression
```

Lực dọc trong thanh dàn là hằng số, nên đọc tại `x = 0` là đủ. Nhãn hai chữ cái đồng thời là cặp nút của thanh: `bar[0]` và `bar[1]`.

## Kiểm tra bằng tính tay {#check-it-by-hand}

Mỗi gối tựa chịu một nửa của 24 kN, tức 12 kN. Cắt dàn và lấy mô men với nút đối diện thanh bị cắt, như trong [phương pháp mặt cắt](/vi/tutorials/truss):

| Thanh | Mặt cắt | Lực dọc |
| --- | --- | --- |
| BC, thanh cánh dưới | mô men với F: $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$ | 16,67 kN, kéo |
| EF, thanh cánh trên | mô men với B: $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$ | 13,33 kN, nén |
| AE, thanh xiên đầu dàn | nút A: $12 \cdot \sqrt{1{,}5^2 + 1{,}8^2}/1{,}8$ | 15,62 kN, nén |
| EB, thanh xiên | lực cắt trong khoang, $12 - 8 = 4$ kN: $4 \cdot 2{,}343/1{,}8$ | 5,21 kN, kéo |

Tiết diện không làm thay đổi lực dọc trong các thanh của dàn tĩnh định; nó chỉ quyết định các nút chuyển vị bao nhiêu. Hình vẽ ở trên dùng một tiết diện khác, tiết diện của ứng dụng EduBeam, mà vẫn cho cùng lực dọc.

## Số khoang bất kỳ {#any-number-of-panels}

Để tạo dàn tự động, cho bài tập hay để khảo sát tham số, hãy dựng nút và thanh trong vòng lặp, từng khoang một. Với `panels = 3`, đây chính là dàn ở trên và chương trình in ra cùng các lực dọc; đổi `panels`, `w` và `h` để có dàn khác.

```ts [warren.ts]
import { type Beam2D, DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })
const lc = solver.loadCases[0]

const panels = 3 // số khoang của cánh dưới
const w = 3 // chiều dài khoang, m
const h = 1.8 // chiều cao dàn, m

// Nút dưới b0, b1, … trên gối cố định và gối di động; nút trên t0, t1, … ở giữa
for (let i = 0; i <= panels; i++) {
  const ends = i === 0 ? [DofID.Dx, DofID.Dz] : i === panels ? [DofID.Dz] : []
  domain.createNode(`b${i}`, [i * w, 0, 0], ends)
}
for (let i = 0; i < panels; i++) {
  domain.createNode(`t${i}`, [(i + 0.5) * w, 0, -h])
  lc.createNodalLoad(`t${i}`, { [DofID.Dz]: 8e3 })
}

const members: Beam2D[] = []
const bar = (a: string, b: string) =>
  members.push(domain.createBeam2D(`${a}-${b}`, [a, b], 1, 1, [true, true]))
for (let i = 0; i < panels; i++) {
  bar(`b${i}`, `b${i + 1}`) // cánh dưới
  bar(`b${i}`, `t${i}`) // thanh xiên đi lên
  bar(`t${i}`, `b${i + 1}`) // thanh xiên đi xuống
  if (i > 0) bar(`t${i - 1}`, `t${i}`) // cánh trên
}
solver.solve()

for (const m of members) {
  console.log(m.label, (m.computeNormalForceAt(lc, 0) / 1e3).toFixed(2))
}
```

Thời gian giải tăng nhanh theo kích thước: vài chục khoang vẫn ổn, xem [Kích thước mô hình](/vi/solver/solving#model-size). Để vẽ từng dàn được tạo ra, có hoặc không kèm đáp số, xem [Bài tập và đề thi](/vi/plot/exercises) của @edubeam/plot.

## Điều cần lưu ý {#things-to-notice}

- **Khớp ở mọi đầu thanh.** Khi đó mọi nút đều xoay tự do, và bộ giải báo góc xoay của chúng bằng 0. Mô men tác dụng vào một nút như vậy không có gì tiếp nhận, và [bộ giải sẽ thất bại](/vi/solver/solving#when-solving-fails).
- **Tải trọng đặt tại nút.** Tải đặt dọc theo thanh sẽ làm thanh bị uốn: khi đó nó là dầm, không còn là thanh dàn, và có biểu đồ mô men.

Bài [Hướng dẫn: dàn phẳng](/vi/tutorials/truss) dựng một dàn trong ứng dụng EduBeam, còn trang [Phần tử thanh dàn](/vi/elements/truss) thiết lập ma trận độ cứng của thanh dàn.
