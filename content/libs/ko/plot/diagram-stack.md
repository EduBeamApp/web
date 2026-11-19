---
title: DiagramStack
description: "DiagramStack으로 보와 그 아래의 V(x), M(x), w(x) 다이어그램을 같은 x축에 그리고, 커서로 모든 행을 읽고, 읽는 사람이 집중하중을 보를 따라 드래그하게 합니다."
order: 3
source: site
---

# DiagramStack

`DiagramStack`은 구조역학 교과서마다 나오는 그림을 그립니다. 지점, 하중, 반력이 있는 곧은 보와, 그 아래에 같은 x축으로 늘어놓은 전단력 V(x), 휨모멘트 M(x), 처짐 w(x)입니다. 커서 하나로 모든 행의 값을 한꺼번에 읽고, 원하면 집중하중을 보를 따라 드래그할 수 있습니다.

```vue
<DiagramStack :solver="solver" />
```

![DiagramStack: 경간 6 m 단순보와 읽는 사람이 드래그할 수 있는 20 kN 하중(여기서는 왼쪽 지점에서 4.3 m). 반력은 5.7 kN과 14.3 kN, 전단력은 하중 위치에서 5.7 kN에서 −14.3 kN으로 바뀌고, 휨모멘트는 그곳에서 최댓값 24.4 kNm, 처짐의 최댓값은 17 mm](/screenshots/ko/p2p-plot-diagram-stack.webp){.shot-lg}

부재는 왼쪽에서 오른쪽으로 그린 하나의 수평선을 이루어야 합니다. 그림의 x축이 곧 보의 축이므로, 기울어지거나 꺾인 선, 오른쪽에서 왼쪽으로 그린 부재처럼 그 밖의 경우는 잘못 그리지 않고 오류를 냅니다. 모든 프롭은 [컴포넌트 API](/ko/plot/components#diagramstack)에 있습니다.

## 행 {#rows}

| 프롭 | 기본값 | 설정하는 것 |
| --- | --- | --- |
| `rows` | `['V', 'M', 'w']` | 위에서 아래로 놓을 다이어그램. `'N'`도 쓸 수 있음 |
| `loadRow` | `true` | 행 위에 지점, 하중, 반력과 함께 그리는 보 |
| `members` | all members | 모델에 다른 부재도 있을 때, 보 축선을 이루는 부재 |
| `rowHeights` | N 100, V 116, M 128, w 76 px | 행 높이. 너비가 560 px보다 좁으면 조금 작아짐 |
| `maxHeight` | none | 그림이 들어가도록 행이 최대 60 %까지 줄어듦. 글자 크기는 그대로 |
| `ranges` | each row's own | 행마다 고정한 값의 범위, SI 단위 |

대부분의 교과서처럼 V와 N은 위쪽을 양으로, M과 w는 아래쪽을 양으로 그립니다. 정모멘트와 아래 방향 처짐은 축 아래에 나타납니다. 각 행에는 극값이 적힙니다.

## 읽기 커서 {#the-reading-cursor}

`hover`는 기본으로 켜져 있습니다. 그림 위에서 포인터를 움직이면 모든 행을 가로지르는 세로 커서가 나타나고, 각 행의 값이 작은 레이블 상자에 표시됩니다. 집중하중이나 지점처럼 값이 불연속인 곳에서 8 px 이내로 다가가면 커서가 그 위치에 붙고, V는 위 그림의 하중 아래처럼 `5.7 → −14.3 kN` 식으로 양쪽 값을 보여 줍니다. 값은 이벤트로도 내보냅니다.

```vue
<DiagramStack :solver="solver" @readout="(r) => (reading = r)" />
```

읽은 값은 `{ x, values }`입니다. `x`는 보를 따라 잰 위치(m)이고, `values`는 행마다 `{ left, right }`(SI 단위)입니다. 포인터가 벗어나면 `null`입니다.

## 읽는 사람이 드래그하는 하중 {#a-load-the-reader-can-drag}

`v-model:load-at`에 집중하중의 위치를 주면 하중에 손잡이가 생깁니다. 읽는 사람은 포인터로 끌거나, 손잡이에 포커스를 두고 화살표 키로 옮깁니다. 컴포넌트는 새 위치를 알려 줄 뿐입니다. 그 위치에 하중을 두고 보를 다시 푼 다음, `MovingLoad.vue`처럼 새 솔버를 다시 넘기세요.

```vue [MovingLoad.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { beamLine, DiagramStack, lineDiagram, modelFromSolver, rowRange, type StackRow } from '@edubeam/plot'

const L = 6 // m
const P = 20e3 // N

/** A에서 `at` m 떨어진 곳에 집중하중이 있는 보를 풀어서 반환합니다. */
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

/** 모든 하중 위치에 걸친 각 행의 범위. 축척이 바뀌지 않으므로 다이어그램이 커지고 작아지는 모습이 보입니다. */
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

하중이 4.3 m에 있으면 그림에는 반력 5.7 kN과 14.3 kN, 하중 아래에서 5.7에서 −14.3 kN으로 바뀌는 전단력, 그리고 그 위치의 $M = 5.67 \cdot 4.3 = 24.4$ kNm이 나타납니다. `ranges`가 없으면 하중이 움직일 때마다 모든 행이 자기 극값에 맞춰 축척을 다시 정하므로, 다이어그램이 전혀 바뀌지 않는 것처럼 보입니다.

| 프롭 | 기본값 | 설정하는 것 |
| --- | --- | --- |
| `loadAt` | none | 하중의 위치, 보 축선의 시작점부터 m. `v-model:load-at`과 함께 사용 |
| `loadLabel` | `P = …` | 손잡이 옆에 쓰는 글 |
| `loadStep` | 0.05 | 드래그한 위치를 이 간격으로 반올림, m. 화살표 키도 이만큼 이동 |

손잡이는 포커스를 받을 수 있는 `role="slider"`이며, 스크린 리더에 범위와 위치를 알립니다. 화살표 키는 `loadStep`만큼, Page Up과 Page Down은 1 m씩 옮기고, Home과 End는 보의 양 끝으로 보냅니다. 터치스크린에서는 손가락으로 끌 수 있고, 그림 위에서 세로 스크롤도 그대로 됩니다.

손잡이는 풀린 모델에서 `loadAt` 위치에 있는 집중하중을 대신합니다. 그 하중은 손잡이로 그려지고, `loadLabel`을 주지 않으면 크기가 레이블로 붙습니다. `solveWithLoadAt`처럼 같은 위치의 하중을 모델에 넣어 두세요.

## 크기와 서버 렌더링 {#size-and-server-rendering}

그림은 상자의 크기를 재고 그 너비(최소 320 px)에 맞춰 배치합니다. 크기를 잴 수 없을 때는 `width`를 쓰며, 기본값은 720 px입니다. 글자는 12.5 px(`fontSize`)이고, 그림이 작아져도 줄어들지 않습니다.
