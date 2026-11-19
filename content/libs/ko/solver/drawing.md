---
title: 결과 그리기
description: "풀린 @edubeam/fem 모델을 @edubeam/plot으로 다이어그램으로 그립니다. Vue 컴포넌트에서, Node 스크립트로 만든 독립 SVG 파일로, 또는 나중에 그릴 JSON으로."
order: 11
source: site
---

# 결과 그리기 {#drawing-the-results}

시각화 라이브러리 [@edubeam/plot](/ko/plot)은 풀린 모델을 이 사이트의 그림과 같은 모양의 SVG로 그립니다. 부재, 지점, 하중, 반력, 축력도·전단력도·휨모멘트도, 변형 형상을 그릴 수 있습니다. 솔버를 넘겨주면 필요한 정보는 모두 솔버에서 읽습니다.

```bash
npm install @edubeam/plot @edubeam/fem vue
```

## Vue 컴포넌트에서 {#in-a-vue-component}

```vue [BeamFigure.vue]
<script setup lang="ts">
import { markRaw } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot } from '@edubeam/plot'

// 12 kN/m를 받는 6 m 단순보, SI 단위: m, N, Pa
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // 힌지 지점
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // 롤러 지점
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

// 읽기만 하고 감시하지 않음: markRaw로 Vue가 솔버를 반응형으로 만들지 않게 함
const beam = markRaw(solver)
</script>

<template>
  <StructurePlot
    :solver="beam"
    :layers="['members', 'supports', 'loads', 'reactions', 'M']"
  />
</template>
```

이 컴포넌트는 아래 라이브 그림처럼 36 kN의 반력과 54 kNm의 모멘트를 그립니다.

::model-figure{caption="BeamFigure.vue가 그리는 그림"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
---
::

`StructurePlot`은 하중조건 0을 그립니다. `solver.loadCases`의 다른 하중조건을 그리려면 `loadCase` 프롭으로 고릅니다. 솔버를 감시하지 않으므로, 모델을 바꾸고 다시 푼 뒤에는 `revision` 프롭의 값을 바꿔 다시 그리게 하세요. 모든 옵션은 [StructurePlot](/ko/plot/structure-plot)에 있습니다.

## 브라우저 없이 {#without-a-browser}

@edubeam/plot 0.2에 새로 추가된 `structureSvg`는 같은 그림을 독립된 SVG 파일로 씁니다. 색은 Word, Inkscape, LaTeX 도구에서도 그대로 읽히는 단순한 형식입니다. 브라우저도 Vue 컴포넌트도 필요 없이 Node 스크립트 하나면 됩니다.

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { modelFromSolver, structureSvg } from '@edubeam/plot'

// BeamFigure.vue와 같은 보
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

const svg = structureSvg(modelFromSolver(solver), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
  width: 640,
})
writeFileSync('beam.svg', svg)
```

이 파일에는 위의 라이브 그림과 같은 내용이 인쇄용 색으로 그려집니다. 크기를 잴 상자가 없으므로 `width`로 크기를 픽셀 단위로 정합니다. 인쇄할 그림을 한 페이지에 모으려면 이런 파일 여러 개를 HTML 페이지 하나에 넣으세요. @edubeam/plot의 [시험지 인쇄 스크립트](/ko/plot/exercises#print-a-test)가 Vue도 브라우저도 없이 이렇게 합니다. `structureSvg`의 옵션은 [함수](/ko/plot/functions#a-standalone-svg-file)에 있습니다.

## 솔버 대신 그림 보내기 {#ship-the-drawing-not-the-solver}

`modelFromSolver`는 풀린 모델을 JSON으로 직렬화할 수 있는 평범한 데이터로 바꿉니다. 기하 정보, 하중, 반력, 그리고 모든 부재의 결과를 정확한 다항식으로 담습니다. 빌드할 때 풀어서 JSON을 보내고, `solver` 대신 `model` 프롭으로 그리면 됩니다.

```ts
import { modelFromSolver } from '@edubeam/plot'

// ... to-svg.ts에서 푼 보
writeFileSync('beam.json', JSON.stringify(modelFromSolver(solver)))
```

그러면 그림을 보여 주는 페이지는 아무것도 풀지 않습니다. 계산은 빌드할 때 한 번만 합니다. 컴포넌트 쪽 사용법은 [삽입](/ko/plot/embedding#ship-the-drawing-not-the-solver)에, 데이터 형식은 [그림 모델](/ko/plot/model)에 있습니다.

색부터 마우스를 올렸을 때의 값 표시, 드래그할 수 있는 하중까지 나머지는 모두 [@edubeam/plot 문서](/ko/plot/getting-started)에 있습니다.
