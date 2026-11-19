---
title: Nhiệt độ và lún gối tựa
description: "Đặt tải thay đổi nhiệt độ và chênh lệch nhiệt độ lên thanh trong @edubeam/fem, và dịch chuyển gối tựa bằng chuyển vị cưỡng bức, kèm ví dụ đã kiểm tra."
order: 7
source: site
---

# Nhiệt độ và lún gối tựa {#temperature-and-settlements}

Hai loại tải không phải là lực: thanh muốn thay đổi chiều dài hoặc độ cong, và gối tựa bị dịch chuyển. Cả hai chỉ gây ra nội lực ở những chỗ kết cấu ngăn cản biến dạng đó, nên rất hợp để ra bài tập về kết cấu siêu tĩnh. Lý thuyết của cả hai có trong mục [Tải trọng phần tử](/vi/elements/beam#element-loads) của sổ tay lý thuyết.

## Nhiệt độ {#temperature}

```ts
lc.createBeamTemperatureLoad(member, [dTc, dTb, dTt])
```

| Giá trị | Ý nghĩa | Tác dụng lên thanh tự do |
| --- | --- | --- |
| `dTc` | thay đổi nhiệt độ tại trọng tâm, K | dãn dài thêm $\alpha\,\Delta T_c\,L$ |
| `dTb` | thay đổi nhiệt độ tại thớ dưới (phía +z địa phương), K | cùng với `dTt`, làm thanh cong với $\kappa = \alpha\,(\Delta T_b - \Delta T_t)/h$ |
| `dTt` | thay đổi nhiệt độ tại thớ trên, K | |

Chỉ hiệu `dTb - dTt` làm thanh cong, nên `[30, 20, 0]` và `[30, 10, -10]` là cùng một tải. Tải này cần `alpha` của vật liệu và `h` của tiết diện; thiếu `h` thì mô men là `NaN`.

Dầm hai đầu ngàm không thể dãn dài, cũng không thể cong, nên nó bị nén và bị uốn: $N = -EA\,\alpha\,\Delta T_c$ và $M = -EI\,\alpha\,(\Delta T_b - \Delta T_t)/h$.

```ts [temperature.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial(1, { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [6, 0, 0], fixed)
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

// Trọng tâm nóng thêm 30 K, thớ dưới nóng hơn thớ trên 20 K
lc.createBeamTemperatureLoad(1, [30, 20, 0])
solver.solve()

beam.computeNormalForceAt(lc, 3) // -215460 N: EA · 12e-6 · 30
beam.computeBendingMomentAt(lc, 3) // -4896.4 N·m: EI · 12e-6 · 20 / 0.2
```

Với IPE 200, $EA = 598{,}5$ MN và $EI = 4{,}0803$ MNm². Thớ dưới nóng hơn làm dầm tự do cong xuống, hai đầu vểnh lên, nên liên kết uốn dầm theo chiều ngược lại: mô men âm, căng thớ trên.

::model-figure{caption="Dầm hai đầu ngàm, tại trọng tâm nóng thêm 30 K, thớ dưới nóng hơn thớ trên 20 K"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 30, bottom: 20, top: 0 } }
results: [M, N]
show: [nodeLabels]
material: { e: 210e9, alpha: 12e-6 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

Trên dầm đơn giản, cùng tải đó không gây ra nội lực nào, chỉ gây chuyển vị: gối di động trượt ra $\alpha\,\Delta T_c\,L = 2{,}16$ mm và giữa nhịp võng xuống $\kappa L^2/8 = 5{,}4$ mm.

## Chuyển vị cưỡng bức {#prescribed-displacements}

```ts
lc.createPrescribedDisplacement(node, { [DofID.Dz]: 0.01 })
```

Dịch chuyển gối tựa một lượng cho trước: tính bằng mét với `Dx` và `Dz`, bằng radian với `Ry`, theo hệ trục riêng của nút. Bậc tự do đó phải bị gối tựa của nút chặn; với bậc tự do không bị chặn, giá trị này bị bỏ qua mà không có cảnh báo nào.

Một dầm một đầu ngàm, một đầu gối di động, có gối di động lún 10 mm, trong một bộ giải mới với vật liệu và tiết diện của ví dụ nhiệt độ:

```ts
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // ngàm
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // gối di động
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

lc.createPrescribedDisplacement('B', { [DofID.Dz]: 0.01 }) // lún xuống 10 mm
solver.solve()

domain.getNode('B').getReactions(lc).values // [566.7] N: 3EIw/L³
beam.computeBendingMomentAt(lc, 0) // -3400.2 N·m tại A: 3EIw/L²
```

Gối di động phải kéo dầm xuống để dầm đi theo nó, nên phản lực của gối dương, theo chiều +z: $3EIw/L^3 = 3 \cdot 4{,}0803 \times 10^6 \cdot 0{,}01 / 216 = 566{,}7$ N.

::model-figure{caption="Gối di động của dầm ngàm – gối di động lún 10 mm: −3,4 kNm tại đầu ngàm"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

Cách ứng dụng vẽ hai loại tải này có ở trang [Tải trọng](/vi/essentials/loads).
