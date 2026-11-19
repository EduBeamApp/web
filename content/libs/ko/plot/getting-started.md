---
title: 빠른 시작
description: "@edubeam/plot 라이브러리를 설치하고, @edubeam/fem 솔버로 푼 보를 하중, 반력, 휨모멘트와 함께 Vue 3 앱에 그립니다. 모델이 바뀔 때 다시 그리고 SVG 파일로 저장하는 방법도 다룹니다."
order: 1
group: 시작하기
source: site
---

# 빠른 시작

시각화 라이브러리 @edubeam/plot은 평면 보, 라멘, 트러스와 그 해석 결과를 SVG로 그립니다. 부재, 지점, 하중, 반력, 축력도·전단력도·휨모멘트도와 변형 형상까지, 이 사이트의 그림과 똑같은 모양입니다. [EduBeam]{.edubeam}의 솔버 라이브러리 [@edubeam/fem](/ko/solver)으로 푼 모델을 넘기기만 하면, 배치와 축척, 숫자 하나하나의 위치는 라이브러리가 알아서 정합니다.

교수자는 이 라이브러리로 시드에서 만드는 [연습 문제와 시험](/ko/plot/exercises), 클릭할 때마다 한 단계씩 쌓이는 [슬라이드](/ko/plot/slides), 강의 노트의 그림을 만듭니다. 그림은 웹 페이지에 넣을 수도 있고, LaTeX와 Word용 파일로 저장할 수도 있습니다. 이 사이트의 [연습 문제](/ko/practice) 페이지와 [시험지 생성기](/ko/exam)도 이 라이브러리로 만들었습니다.

::div{.actions}
[첫 그림 그리기](#draw-a-solved-model) [연습 문제 만들기](/ko/plot/exercises)
::

## 설치 {#install}

```bash
npm install @edubeam/plot @edubeam/fem vue
```

Vue 3.5 이상과 솔버는 피어 의존성(peer dependency)이므로 앱에는 각각 한 벌만 들어갑니다. 패키지는 ESM 전용이고, 타입 정의를 함께 제공하며, 스타일시트가 필요 없습니다. Node 20.19 이상에서 동작하고, TypeScript로 쓴 스크립트를 `node script.ts`로 그대로 실행하려면 Node 22.18 이상이 필요합니다.

## 해석한 모델 그리기 {#draw-a-solved-model}

파일은 두 개입니다. 첫 번째 파일 `beams.ts`는 @edubeam/fem 솔버로 보를 만들고 풉니다. 평범한 함수이므로 같은 모델을 웹 페이지, 슬라이드, 스크립트에 모두 쓸 수 있습니다.

```ts [beams.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** 경간 `span` m, 등분포하중 `q` kN/m인 단순보를 풀어서 반환합니다. 솔버는 SI 단위로 계산합니다. */
export const simpleBeam = (span: number, q: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 }) // 강재, Pa
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 }) // IPE 200, 전단 변형 무시
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // 힌지 지점
  domain.createNode('B', [span, 0, 0], [DofID.Dz]) // 롤러 지점
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true) // N/m, +z는 아래 방향
  solver.solve()
  return solver
}
```

두 번째 파일 `BeamFigure.vue`는 솔버를 `StructurePlot`에 넘기고 무엇을 그릴지 정합니다.

```vue [BeamFigure.vue]
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams'

const beam = simpleBeam(6, 12)
</script>

<template>
  <StructurePlot :solver="beam" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
</template>
```

이것이 전부입니다. 그림에는 지점 위의 보, 12 kN/m의 하중, 각각 36 kN인 반력 두 개, 그리고 휨모멘트가 그려집니다. 휨모멘트는 경간 중앙에서 $qL^2/8 = 54$ kNm이고, 인장 측에 그려집니다.

::model-figure{caption="BeamFigure.vue가 그리는 그림: 경간 6 m, 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
labels: horizontal
---
::

그림은 컨테이너의 너비를 가득 채우고, 높이는 스스로 정합니다. 글자, 기호, 선 굵기는 구조물의 크기와 상관없이 픽셀 단위로 크기가 고정되어 있어서 휴대폰에서도 그림이 잘 읽힙니다. `layers`를 생략하면 표시할 결과를 그림이 직접 고릅니다. 보와 라멘이면 M, 트러스면 N입니다. 모든 [레이어](/ko/plot/structure-plot#layers)는 `StructurePlot` 페이지에 정리되어 있고, 모델을 만드는 방법은 [솔버 문서](/ko/solver/getting-started)에서 설명합니다.

## 모델이 바뀌면 {#when-the-model-changes}

그림은 넘겨받은 솔버를 읽기만 하고, 그 변화를 감시하지는 않습니다. 무언가 바뀌면 다시 풀고 새 솔버를 넘기면 됩니다. `computed`가 바로 그 일을 합니다.

```vue [LoadSlider.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams'

const q = ref(12) // kN/m
const beam = computed(() => simpleBeam(6, q.value))
</script>

<template>
  <input v-model.number="q" type="range" min="1" max="30" />
  <StructurePlot :solver="beam" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
</template>
```

이 정도 보는 1밀리초 안팎에 풀리므로, 슬라이더를 움직이는 대로 그림이 따라옵니다. 솔버를 새로 만들지 않고 그 자리에서 고쳤다면 `revision` 프롭의 값을 올리세요. 그러면 그림이 솔버를 다시 읽습니다.

::callout{type="tip" title="솔버는 깊은 반응형에 넣지 마세요"}
`computed`, 프롭, 일반 `const`는 솔버를 있는 그대로 담습니다. 컴포넌트 상태에 솔버를 두려면 `shallowRef`를 쓰거나 `markRaw`로 감싸세요. 일반 `ref`를 쓰면 Vue가 솔버 전체를 훑어 반응형으로 만들려고 하는데, 아무 쓸모가 없는 작업입니다.
::

## 파일로 저장하기 {#save-it-as-a-file}

LaTeX, Word, Inkscape에 넣을 그림이라면 `structureSvg`를 씁니다. 같은 그림을 색상 값이 그대로 들어간 독립 SVG 파일로 써 줍니다. Vue도 브라우저도 필요 없고 Node만 있으면 됩니다. 다음 스크립트를 `beams.ts` 옆에 `beam-svg.ts`로 저장합니다.

```ts [beam-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { simpleBeam } from './beams.ts'

const svg = structureSvg(modelFromSolver(simpleBeam(6, 12)), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
})
writeFileSync('beam.svg', svg)
```

`node beam-svg.ts`로 실행합니다(Node 22.18 이상. 그보다 오래된 버전에서는 `npx tsx beam-svg.ts`). 옵션, 그리고 파일을 LaTeX와 Word에 넣는 방법은 [독립 SVG 파일](/ko/plot/functions#a-standalone-svg-file)에서 설명합니다.

## 다이어그램을 쌓은 그림 {#the-stacked-figure}

`DiagramStack`은 구조역학 교과서마다 나오는 그림을 그립니다. 하중을 받는 곧은 보와, 그 아래에 같은 x축으로 늘어놓은 V(x), M(x), w(x)입니다. `v-model:load-at`을 쓰면 읽는 사람이 집중하중을 보를 따라 드래그하고, 다이어그램이 따라 바뀌는 모습을 볼 수 있습니다.

```vue
<DiagramStack v-model:load-at="at" :solver="solveWithLoadAt(at)" />
```

전체 예제는 [DiagramStack](/ko/plot/diagram-stack) 페이지에 있습니다.

## 앱 전체에서 쓰기 {#use-it-everywhere}

쓰는 곳마다 가져오는 대신 두 컴포넌트를 전역으로 등록하려면 다음과 같이 합니다.

```ts [main.ts]
import { createApp } from 'vue'
import { EduBeamPlot } from '@edubeam/plot'
import App from './App.vue'

createApp(App).use(EduBeamPlot).mount('#app') // 모든 템플릿에서 <StructurePlot>과 <DiagramStack> 사용 가능
```

필요한 것만 이름으로 가져오면(named import) 번들이 더 작아집니다. `StructurePlot`만 가져오는 페이지에는 `DiagramStack`도 플러그인도 들어가지 않습니다. 두 컴포넌트 모두 Nuxt나 VitePress에서 서버 렌더링도 됩니다. [삽입](/ko/plot/embedding)을 참고하세요.

## 다음 단계 {#next}

::card-grid{cols="2"}
:::card{title="연습 문제와 시험" icon="lucide:dices" to="/ko/plot/exercises"}
시드 하나로 학생마다 다른 연습 문제를 정답지와 함께. 인쇄하거나 LaTeX용으로 저장합니다.
:::
:::card{title="슬라이드와 강의 노트" icon="lucide:presentation" to="/ko/plot/slides"}
Slidev, Vue, Beamer에서 클릭할 때마다 쌓이는 그림과, 강의 노트에 넣을 같은 그림.
:::
:::card{title="StructurePlot" icon="lucide:frame" to="/ko/plot/structure-plot"}
레이어, 치수, 썸네일, 크기, 단위, 포인터로 값 읽기.
:::
:::card{title="DiagramStack" icon="lucide:rows-3" to="/ko/plot/diagram-stack"}
보 아래에 전단력도, 휨모멘트도, 처짐곡선. 읽는 사람이 드래그할 수 있는 하중까지.
:::
::
