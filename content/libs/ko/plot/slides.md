---
title: 슬라이드와 강의 노트
description: "@edubeam/plot으로 만드는 강의용 그림: Slidev, Vue, Beamer에서 클릭할 때마다 쌓이고, 강의 중에 바로 풀며, SVG 파일로 강의 노트, PowerPoint, Word에 들어갑니다."
order: 6
source: site
---

# 슬라이드와 강의 노트

구조물을 설명하는 순서대로 보여 주세요. 먼저 형상, 다음에 지점과 하중, 그다음 반력, 마지막으로 휨모멘트입니다. 풀린 모델에서 그린 그림은 클릭할 때마다 레이어가 하나씩 제자리에 쌓이고, 언제나 정확합니다. 같은 모델로 강의 노트의 그림도 만들 수 있습니다.

![Slidev 슬라이드의 0, 2, 4번째 클릭: 치수가 들어간 문형 라멘의 절점, 다음에 지점과 하중이 있는 라멘, 마지막으로 반력과 휨모멘트](/screenshots/ko/p2p-plot-slidev-steps.webp){.shot-md}

## 단계별로 쌓이는 그림 {#a-figure-that-builds-up}

파일은 두 개입니다. `frame.ts`는 구조물을 만들고 풉니다.

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** 문형 라멘: 6 m × 4 m, 기둥 하단은 힌지 지점, 보에 10 kN/m, B에서 미는 15 kN. */
export const portalFrame = (): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 }) // IPE 300
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [0, 0, -4]) // z가 아래 방향이므로 4 m 위
  domain.createNode('C', [6, 0, -4])
  domain.createNode('D', [6, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  domain.createBeam2D(2, ['B', 'C'], 1, 1)
  domain.createBeam2D(3, ['C', 'D'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(2, [0, 10e3], true)
  solver.loadCases[0].createNodalLoad('B', { [DofID.Dx]: 15e3 })
  solver.solve()
  return solver
}
```

`BuildUp.vue`는 이 구조물을 단계별로 그립니다. 단계마다 보여 줄 레이어를 나열하고, `reserve`가 첫 클릭부터 모든 레이어를 배치해 두므로, 각 레이어는 제자리에서 서서히 나타나고 아무것도 움직이지 않습니다.

```vue [BuildUp.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { StructurePlot, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame'

const props = defineProps<{ step: number }>()

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'], // 형상
  ['nodeLabels', 'members', 'supports'], // 구조물
  ['nodeLabels', 'members', 'supports', 'loads'], // 하중
  ['members', 'supports', 'loads', 'reactions'], // 반력
  ['members', 'supports', 'reactions', 'M'], // 그리고 휨모멘트
]
const all = [...new Set(stages.flat())] // 첫 단계부터 배치해 두므로 나중에 아무것도 움직이지 않습니다
const layers = computed(() => stages[Math.min(props.step, stages.length - 1)])

const frame = portalFrame()
</script>

<template>
  <StructurePlot :solver="frame" :layers="layers" :reserve="all" :height="360" />
</template>
```

레이어는 사라질 수도 있습니다. 마지막 단계에서는 휨모멘트가 들어갈 자리를 내주려고 하중을 뺍니다. `:height="360"`은 그림이 슬라이드 안에 들어가게 합니다. 부재는 처음 나타날 때 한쪽 끝에서 다른 쪽 끝으로 그려지고, 레이어는 0.5초에 걸쳐 서서히 나타납니다. `prefers-reduced-motion`이 설정되어 있으면 둘 다 꺼지고, `:animate="false"`로 지정하면 누구에게나 꺼집니다. 강의실에 맞게 더 천천히 하려면 [애니메이션 스타일 바꾸기](/ko/plot/theming#restyling-the-animation)를 참고하세요.

## Slidev에서 {#in-slidev}

[Slidev](https://sli.dev)는 Markdown과 Vue로 슬라이드를 만들므로, 컴포넌트를 그대로 쓸 수 있습니다. 슬라이드 프로젝트에 라이브러리를 설치합니다.

```bash
npm install @edubeam/plot @edubeam/fem
```

`frame.ts`와 `BuildUp.vue`를 프로젝트의 `components/` 폴더에 넣고, `slides.md`에서 슬라이드의 클릭 수가 단계를 정하게 합니다.

```md [slides.md]
---
clicks: 4
---

# From geometry to bending moment

<BuildUp :step="$clicks" />
```

`clicks: 4`는 슬라이드에 클릭 4번을 주고, `$clicks`는 0부터 클릭을 셉니다. 화살표 키를 누를 때마다 다음 단계가 나타나고, 뒤로 가면 다시 사라집니다. `slidev export`는 슬라이드를 PDF로 만들며, `--with-clicks`를 붙이면 클릭마다 한 쪽씩 만듭니다.

## 다른 Vue 슬라이드에서 {#in-any-vue-slides}

그 밖의 환경에서는 단계를 직접 관리합니다.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import BuildUp from './BuildUp.vue'

const step = ref(0)
</script>

<template>
  <BuildUp :step="step" />
  <button type="button" @click="step = Math.max(0, step - 1)">Back</button>
  <button type="button" @click="step++">Next</button>
</template>
```

## 강의 중에 바로 풀기 {#solve-it-live}

이 정도 라멘은 솔버가 몇 밀리초 만에 풀므로, 강의 중에 구조물을 바꾸고 그 자리에서 풀 수 있습니다. 하중을 슬라이더에 연결하고, 바뀔 때마다 새로 푼 모델을 넘기세요. [모델이 바뀌면](/ko/plot/getting-started#when-the-model-changes)과 같은 방식입니다.

- **이동하중.** [DiagramStack](/ko/plot/diagram-stack#a-load-the-reader-can-drag)에서는 학생이 집중하중을 보를 따라 드래그하면서 전단력과 휨모멘트가 따라 바뀌는 모습을 봅니다.
- **경우를 나란히 비교.** [`diagramScale`](/ko/plot/structure-plot#several-plots-at-one-scale)을 고정하면 두 그림이 같은 축척으로 모멘트를 그리므로, 큰 쪽이 실제로 크게 보입니다.
- **값 읽기.** `hover`가 있으면 부재에 포인터를 올렸을 때 각 다이어그램의 종거 끝에 값이 표시됩니다. [값 읽기](/ko/plot/structure-plot#reading-values)를 참고하세요.

## Beamer, PowerPoint, Word용 그림 {#figures-for-beamer-powerpoint-and-word}

LaTeX Beamer나 PowerPoint로 만든 슬라이드, Word로 쓴 강의 노트에는 그림을 파일로 넣습니다. `structureSvg`는 그림을 색상 값이 그대로 들어간 독립 SVG로 쓰며, 배치는 `StructurePlot`과 똑같습니다. `frame.ts` 옆에 Node 스크립트 `frame-svg.ts`를 둡니다.

```ts [frame-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![CairoSVG로 렌더링한 독립 SVG 파일 속 문형 라멘: 하중, 반력(위로 20과 40, 수평으로 2.3과 12.7), 휨모멘트는 C의 −50.7에서 보 안의 29.3까지](/screenshots/ko/p2p-plot-frame-svg.webp){.shot-lg}

PowerPoint와 Word(2019와 Microsoft 365)는 SVG를 그대로 삽입합니다. LaTeX에는 PDF로 넣습니다. `cairosvg frame.svg -o frame.pdf`나 Inkscape로 변환하거나, `svg` 패키지의 `\includesvg`에 변환을 맡기세요. 자세한 내용은 [LaTeX와 Word용 그림](/ko/plot/exercises#figures-for-latex-and-word)에, 모든 옵션은 [독립 SVG 파일](/ko/plot/functions#a-standalone-svg-file)에 있습니다.

### Beamer에서 단계별로 쌓기 {#a-build-up-in-beamer}

파일은 그리는 레이어에 맞춰 크기가 정해지므로, 단계마다 따로 쓴 파일은 서로 맞지 않습니다. `structureSvg`에 `BuildUp.vue`와 같은 `reserve`, 즉 모든 단계의 모든 레이어를 주면, 모든 파일의 크기가 같고 구조물도 같은 자리에 놓입니다. `frame-stages.ts`는 단계마다 파일을 하나씩 씁니다.

```ts [frame-stages.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'],
  ['nodeLabels', 'members', 'supports'],
  ['nodeLabels', 'members', 'supports', 'loads'],
  ['members', 'supports', 'loads', 'reactions'],
  ['members', 'supports', 'reactions', 'M'],
]
const all = [...new Set(stages.flat())]
const frame = modelFromSolver(portalFrame())

stages.forEach((layers, i) => {
  writeFileSync(`frame-${i + 1}.svg`, structureSvg(frame, { layers, reserve: all }))
})
```

파일을 PDF로 변환하고,

```bash
for i in 1 2 3 4 5; do cairosvg frame-$i.svg -o frame-$i.pdf; done
```

각 파일에 오버레이를 하나씩 줍니다. 파일 하나가 한 단계 전체를 담고 있으므로 Beamer 프레임에는 한 번에 하나씩만 나타나고, 파일끼리 위치가 맞으므로 클릭할 때마다 레이어가 하나씩 더해지는 것처럼 보입니다.

```latex [lecture.tex]
\begin{frame}{From geometry to bending moment}
  \centering
  \includegraphics<1>[width=0.8\linewidth]{frame-1.pdf}%
  \includegraphics<2>[width=0.8\linewidth]{frame-2.pdf}%
  \includegraphics<3>[width=0.8\linewidth]{frame-3.pdf}%
  \includegraphics<4>[width=0.8\linewidth]{frame-4.pdf}%
  \includegraphics<5>[width=0.8\linewidth]{frame-5.pdf}
\end{frame}
```

PowerPoint에서는 파일 다섯 개를 연속된 슬라이드 다섯 장에 전환 효과 없이 넣으세요. 강의 중에는 각 단계가 클릭 한 번과 똑같아 보입니다.

## 강의 노트와 유인물 {#notes-and-handouts}

- **웹 강의 노트.** VitePress와 Nuxt는 빌드할 때 그림을 렌더링하므로, 스크립트가 실행되기 전에 이미 그림이 HTML에 들어 있습니다. [삽입](/ko/plot/embedding)을 참고하세요.
- **인쇄용 강의 노트.** [시험지 인쇄 스크립트](/ko/plot/exercises#print-a-test)처럼 `structureSvg`로 그림을 HTML 페이지에 써서 인쇄하거나, 파일을 LaTeX나 Word에 넣습니다.
- **모델 하나로 모든 그림.** 슬라이드, 강의 노트, 연습 문제지 모두 같은 `frame.ts`에서 나오므로 서로 어긋나는 일이 없습니다.
