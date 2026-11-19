---
title: Khung
description: "Chương trình @edubeam/fem hoàn chỉnh cho khung ba khớp, với cột, nút góc cứng và khớp đỉnh, kèm kết quả kiểm tra bằng tính tay."
order: 13
source: site
---

# Khung {#frames}

Khung gồm dầm và cột nối cứng với nhau tại các góc. Ví dụ này dùng mã để dựng lại khung của bài [Hướng dẫn: khung ba khớp](/vi/tutorials/three-hinged-frame): hai cột cao 4 m có gối cố định tại A và E, dầm dài 8 m có khớp tại C, và tải 10 kN/m trên dầm. Bài hướng dẫn đánh số nút từ 1 đến 5; ở đây các nút là A đến E.

::model-figure{caption="Khung của chương trình bên dưới: gối cố định tại A và E, khớp tại C, 10 kN/m"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, k: 1e32 }) // IPE 300

// z hướng xuống: đỉnh các cột cao 4 m nằm tại z = -4
const pin = [DofID.Dx, DofID.Dz]
domain.createNode('A', [0, 0, 0], pin)
domain.createNode('B', [0, 0, -4])
domain.createNode('C', [4, 0, -4]) // khớp đỉnh
domain.createNode('D', [8, 0, -4])
domain.createNode('E', [8, 0, 0], pin)

const column = domain.createBeam2D(1, ['A', 'B'], 1, 1) // từ dưới lên
const left = domain.createBeam2D(2, ['B', 'C'], 1, 1, [false, true]) // khớp tại C
domain.createBeam2D(3, ['C', 'D'], 1, 1)
domain.createBeam2D(4, ['D', 'E'], 1, 1)

const lc = solver.loadCases[0]
for (const half of [2, 3]) {
  lc.createBeamElementUniformEdgeLoad(half, [0, 10e3], false)
}
solver.solve()

// getReactions trả về Matrix của mathjs hoặc một mảng: chuyển về mảng
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()
const kN = (v: number) => (v / 1e3).toFixed(2)

for (const label of ['A', 'E']) {
  const [rx, rz] = list(domain.getNode(label).getReactions(lc).values)
  console.log(`${label}: Rx = ${kN(rx)} kN, Rz = ${kN(rz)} kN`)
}
for (const x of [0, 2, 4]) {
  const m = left.computeBendingMomentAt(lc, x)
  console.log(`M at ${x} m from B = ${kN(m)} kNm`)
}
const top = column.computeBendingMomentAt(lc, 4)
console.log(`M at the top of column 1 = ${kN(top)} kNm`)
```

```text [Đầu ra]
A: Rx = 20.00 kN, Rz = -40.00 kN
E: Rx = -20.00 kN, Rz = -40.00 kN
M at 0 m from B = -80.00 kNm
M at 2 m from B = -20.00 kNm
M at 4 m from B = 0.00 kNm
M at the top of column 1 = -80.00 kNm
```

## Kiểm tra bằng tính tay {#check-it-by-hand}

| Đại lượng | Tính tay | Bộ giải |
| --- | --- | --- |
| Phản lực đứng | $q \cdot 8/2 = 40$ kN, hướng lên | $R_z = -40$ kN tại A và E |
| Phản lực ngang | từ $M_C = 0$ cho nửa trái: $(40 \cdot 4 - 10 \cdot 4 \cdot 2)/4 = 20$ kN, hướng vào trong | $R_x = +20$ kN tại A, $-20$ kN tại E |
| Mô men tại góc khung | $-20 \cdot 4 = -80$ kNm | $-80$ kNm trong dầm và trong cột |
| Mô men cách B 2 m | $-80 + 40 \cdot 2 - 10 \cdot 2^2/2 = -20$ kNm | $-20$ kNm |
| Mô men tại khớp | 0 | 0 |

## Điều cần lưu ý {#things-to-notice}

- **Cột hướng lên, nên z âm.** Đỉnh cột nằm tại $z = -4$.
- **Hệ trục địa phương của cột.** Thanh 1 chạy từ A lên B, nên trục z địa phương của nó hướng sang phải, vào phía trong khung. Mô men tại đỉnh cột là −80 kNm, giống mô men của dầm tại góc khung: căng thớ phía ngoài. Khai báo cột từ B xuống A thì trục z địa phương hướng sang trái: mô men đổi dấu, và `x` tính từ đỉnh cột. Xem [Chiều của thanh](/vi/solver/conventions#member-direction).
- **Một khớp, một đầu thanh.** Khớp nằm ở đầu thanh 2 tại C; thanh 3 bắt đầu tại C với liên kết cứng. Chỉ cần giải phóng một đầu thanh là C đã thành khớp.
- **Tải trên dầm theo hệ trục tổng thể.** `false` cho tải trong hệ trục tổng thể: thẳng đứng, bất kể thanh nghiêng thế nào. Với dầm nằm ngang vẽ từ trái sang phải, cách này giống hệt hệ trục địa phương.

## Khung siêu tĩnh {#statically-indeterminate-frames}

Bỏ khớp đi, `[false, false]`, khung trở thành khung cổng siêu tĩnh bậc một, với một phản lực thừa. Khi đó nội lực phụ thuộc vào độ cứng của dầm so với cột: hãy cho các thanh những tiết diện khác nhau để thấy điều đó. Mục [Thử nghiệm](/vi/tutorials/three-hinged-frame#_7-experiment) của bài hướng dẫn chuyển chân cột thành ngàm và đẩy khung theo phương ngang, kèm số liệu để đối chiếu. Trang [Slide và tài liệu bài giảng](/vi/plot/slides) của @edubeam/plot vẽ một khung cổng như vậy theo từng bước.
