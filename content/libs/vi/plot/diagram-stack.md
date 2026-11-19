---
title: DiagramStack
description: "Vẽ dầm phía trên các biểu đồ V(x), M(x) và w(x) trên cùng một trục x bằng DiagramStack, đọc mọi hàng bằng con trỏ và cho người đọc kéo lực tập trung dọc dầm."
order: 3
source: site
---

# DiagramStack

`DiagramStack` vẽ hình quen thuộc trong mọi giáo trình Cơ học kết cấu: một dầm thẳng với gối tựa, tải trọng và phản lực, bên dưới, trên cùng một trục x, là biểu đồ lực cắt V(x), mô men uốn M(x) và độ võng w(x). Một con trỏ đọc mọi hàng cùng lúc, và có thể thêm một lực tập trung để kéo dọc theo dầm.

```vue
<DiagramStack :solver="solver" />
```

![DiagramStack: dầm đơn giản nhịp 6 m với lực 20 kN mà người đọc kéo được, ở đây cách gối trái 4,3 m; phản lực 5,7 kN và 14,3 kN, lực cắt nhảy từ 5,7 kN xuống −14,3 kN dưới lực tập trung, mô men uốn đạt cực đại 24,4 kNm tại đó, và đường độ võng với giá trị lớn nhất 17 mm](/screenshots/vi/p2p-plot-diagram-stack.webp){.shot-lg}

Các thanh phải tạo thành một đường nằm ngang, vẽ từ trái sang phải. Mọi trường hợp khác, như đường xiên, đường gãy khúc hay một thanh vẽ từ phải sang trái, đều bị từ chối kèm thông báo lỗi chứ không bị vẽ sai, vì trục x của hình chính là trục dầm. Mọi prop có ở trang [API của component](/vi/plot/components#diagramstack).

## Các hàng {#rows}

| Prop | Mặc định | Đặt |
| --- | --- | --- |
| `rows` | `['V', 'M', 'w']` | các biểu đồ, từ trên xuống; cũng có `'N'` |
| `loadRow` | `true` | dầm cùng gối tựa, tải trọng và phản lực phía trên các hàng |
| `members` | all members | các thanh thuộc đường dầm, khi mô hình còn những thanh khác |
| `rowHeights` | N 100, V 116, M 128, w 76 px | chiều cao các hàng; nhỏ hơn một chút khi chiều rộng dưới 560 px |
| `maxHeight` | none | các hàng co lại, nhiều nhất còn 60 %, để hình vừa chiều cao cho phép; chữ giữ nguyên cỡ |
| `ranges` | each row's own | khoảng giá trị cố định cho từng hàng, theo đơn vị SI |

V và N vẽ chiều dương hướng lên, M và w chiều dương hướng xuống, như phần lớn giáo trình: mô men dương (căng thớ dưới) và độ võng hướng xuống nằm dưới trục. Mỗi hàng ghi các giá trị cực trị của mình.

## Con trỏ đọc giá trị {#the-reading-cursor}

`hover` bật sẵn theo mặc định. Khi di chuột trên hình, một đường dọc cắt qua mọi hàng, kèm giá trị của từng hàng trong một nhãn. Trong phạm vi 8 px quanh một bước nhảy, tại lực tập trung hay gối tựa, con trỏ bắt dính vào đó và V hiện cả hai phía, như `5.7 → −14.3 kN` dưới lực tập trung ở hình trên. Các giá trị cũng được phát ra:

```vue
<DiagramStack :solver="solver" @readout="(r) => (reading = r)" />
```

Dữ liệu đọc được (readout) có dạng `{ x, values }`: `x` tính bằng mét dọc theo dầm, và `{ left, right }` cho mỗi hàng theo đơn vị SI; giá trị là `null` khi con trỏ rời khỏi hình.

## Tải trọng người đọc kéo được {#a-load-the-reader-can-drag}

Truyền vị trí của một lực tập trung cho `v-model:load-at` và lực đó có một tay nắm: người đọc kéo nó bằng con trỏ, hoặc đưa focus vào nó rồi dùng các phím mũi tên. Component chỉ báo vị trí mới. Bạn giải lại dầm với lực đặt ở vị trí đó và truyền bộ giải mới vào, như `MovingLoad.vue` làm:

```vue [MovingLoad.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { beamLine, DiagramStack, lineDiagram, modelFromSolver, rowRange, type StackRow } from '@edubeam/plot'

const L = 6 // m
const P = 20e3 // N

/** Dầm với lực tập trung cách A `at` mét, đã giải. */
const solveWithLoadAt = (at: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamConcentratedLoad(1, [0, P, 0, at], true)
  solver.solve()
  return solver
}

/** Khoảng giá trị của mỗi hàng qua mọi vị trí lực, để biểu đồ to lên, nhỏ đi thay vì đổi tỷ lệ. */
const rows: StackRow[] = ['V', 'M', 'w']
const envelope = (() => {
  const ranges: Partial<Record<StackRow, [number, number]>> = {}
  for (let at = 0.25; at < L; at += 0.25) {
    const model = modelFromSolver(solveWithLoadAt(at))
    const line = beamLine(model)
    for (const row of rows) {
      const [lo, hi] = rowRange(lineDiagram(model, line, row))
      const [min, max] = ranges[row] ?? [0, 0]
      ranges[row] = [Math.min(min, lo), Math.max(max, hi)]
    }
  }
  return ranges
})()

const at = ref(2)
const solver = computed(() => solveWithLoadAt(at.value))
</script>

<template>
  <DiagramStack v-model:load-at="at" :solver="solver" :rows="rows" :ranges="envelope" load-label="P = 20 kN" />
  <p>The load is {{ at.toFixed(2) }} m from A.</p>
</template>
```

Khi lực ở vị trí 4,3 m, hình cho phản lực 5,7 kN và 14,3 kN, bước nhảy lực cắt từ 5,7 xuống −14,3 kN dưới lực, và tại đó $M = 5{,}67 \cdot 4{,}3 = 24{,}4$ kNm. Nếu không có `ranges`, mỗi hàng sẽ đổi tỷ lệ theo cực trị của chính nó khi lực di chuyển, và các biểu đồ trông như không hề thay đổi.

| Prop | Mặc định | Đặt |
| --- | --- | --- |
| `loadAt` | none | vị trí của lực, tính bằng mét từ đầu đường dầm; dùng với `v-model:load-at` |
| `loadLabel` | `P = …` | dòng chữ cạnh tay nắm |
| `loadStep` | 0.05 | khi kéo, vị trí được làm tròn theo bước này, m; phím mũi tên dịch đúng một bước |

Tay nắm là một `role="slider"` nhận được focus, báo khoảng và vị trí của nó cho trình đọc màn hình. Phím mũi tên dịch tay nắm một `loadStep`, Page Up và Page Down dịch 1 m, Home và End đưa nó về hai đầu dầm. Trên màn hình cảm ứng, có thể kéo tay nắm bằng ngón tay, và vẫn cuộn dọc trang được khi lướt qua hình.

Tay nắm thay cho lực tập trung mà mô hình đã giải có tại `loadAt`: lực đó được vẽ thành tay nắm, ghi kèm độ lớn, trừ khi bạn truyền `loadLabel`. Hãy đặt lực trong mô hình ở cùng vị trí, như `solveWithLoadAt` làm.

## Cỡ hình và render trên server {#size-and-server-rendering}

Hình đo khối chứa và bố trí theo đúng chiều rộng đó, tối thiểu 320 px. Trước khi đo được, hình dùng `width`, mặc định 720 px. Chữ cỡ 12,5 px (`fontSize`) và không bao giờ thu nhỏ theo hình.
