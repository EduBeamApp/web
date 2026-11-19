---
title: Trường hợp tải
description: "Giải cùng lúc nhiều trường hợp tải của một mô hình @edubeam/fem, rồi cộng tác dụng các kết quả thành tổ hợp tải trọng và biểu đồ bao."
order: 8
source: site
---

# Trường hợp tải {#load-cases}

Trường hợp tải là một tập tải trọng được giải cùng nhau. Bộ giải có sẵn một trường hợp; bạn thêm các trường hợp khác, và chỉ một lần gọi `solve()` sẽ giải tất cả với cùng một ma trận độ cứng. Phân tích là tuyến tính, nên kết quả của các trường hợp khác nhau có thể nhân hệ số rồi cộng lại: tổ hợp tải trọng chỉ có vậy.

## Thêm trường hợp tải {#add-a-load-case}

```ts [load-cases.ts]
import { DofID, LinearStaticSolver, LoadCase } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const dead = solver.loadCases[0] // trường hợp có sẵn trong mọi bộ giải
const live = new LoadCase('live', domain)
solver.loadCases.push(live)

dead.createBeamElementUniformEdgeLoad(1, [0, 10e3], true) // 10 kN/m
live.createBeamConcentratedLoad(1, [0, 20e3, 0, 3], true) // 20 kN giữa nhịp
solver.solve() // giải mọi trường hợp tải

console.log(beam.computeBendingMomentAt(dead, 3)) // qL²/8
console.log(beam.computeBendingMomentAt(live, 3)) // PL/4
```

```text [Đầu ra]
45000
30000
```

Mọi phương thức đọc kết quả đều nhận trường hợp tải cần đọc. Trường hợp đầu tiên có nhãn `'DefaultLC'`; nhãn chỉ là tên gọi, còn bộ giải phân biệt các trường hợp tải qua chính đối tượng.

## Tổ hợp {#combine-them}

Nhân kết quả của từng trường hợp với hệ số của nó rồi cộng lại. Với tổ hợp ở trạng thái giới hạn cực hạn (ULS) theo Eurocode, $1{,}35\,G + 1{,}5\,Q$, tại giữa nhịp:

```ts
1.35 * beam.computeBendingMomentAt(dead, 3) +
  1.5 * beam.computeBendingMomentAt(live, 3) // 105750 N·m
```

Phản lực, chuyển vị và mọi kết quả khác cũng tổ hợp như vậy. Dọc theo cả một thanh, hãy tổ hợp từng điểm: các mảng của `computeBendingMoment(lc, n)` dùng cùng các giá trị `x` cho mọi trường hợp.

```ts
const n = 60
const g = beam.computeBendingMoment(dead, n).M
const q = beam.computeBendingMoment(live, n).M
const uls = g.map((m, i) => 1.35 * m + 1.5 * q[i])
Math.max(...uls) // 105750 N·m, tại x = 3
```

Biểu đồ bao, tức giá trị lớn nhất và nhỏ nhất qua nhiều tổ hợp, chỉ là `Math.max` và `Math.min` trên những mảng như vậy, tính tại từng điểm. Với tải di động, hãy giải một lần cho mỗi vị trí tải: [ví dụ đường ảnh hưởng](/vi/solver/scripts#an-influence-line-as-csv) làm đúng như vậy.

## Trong ứng dụng EduBeam {#in-the-edubeam-app}

Ứng dụng giải từng trường hợp tải một, nên tổ hợp tải trọng là chỗ thư viện làm được nhiều hơn ứng dụng. Mô hình có nhiều trường hợp tải vẫn [vẽ được](/vi/solver/drawing) theo từng trường hợp: `StructurePlot` của @edubeam/plot nhận prop `loadCase`, là chỉ số trong `solver.loadCases`.
