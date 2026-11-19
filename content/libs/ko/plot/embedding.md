---
title: 삽입
description: "@edubeam/plot 그림을 Vite 앱, VitePress 강의 노트, Nuxt 사이트에 넣고, 서버에서 렌더링하고, 미리 푼 모델을 JSON으로 보내고, Vue 없이 어떤 페이지에든 쓸 SVG를 만듭니다."
order: 7
source: site
---

# 삽입

컴포넌트는 평범한 Vue 3 컴포넌트이므로 Vue가 동작하는 곳이면 어디서든 동작하고, 브라우저뿐 아니라 서버에서도 렌더링됩니다. 그림이 마운트되기 전에는 `window`를 건드리지 않고, 그림마다 고유한 id를 쓰므로 한 페이지에 그림을 몇 개든 넣을 수 있습니다. 내 환경에 맞는 방법을 고르세요.

| 내 환경 | 할 일 |
| --- | --- |
| Vite로 빌드하는 Vue 앱 | 설치하고 가져오면 끝: [Vite 앱](#a-vite-app) |
| Markdown으로 쓴 강의 노트 | VitePress에 플러그인을 한 번 등록: [VitePress 강의 노트](#vitepress-course-notes) |
| Nuxt 사이트 | 컴포넌트를 가져오거나 플러그인 추가: [Nuxt](#nuxt) |
| 그림만 보여 주는 페이지 | 빌드할 때 풀고 JSON으로 보내기: [솔버 대신 그림 보내기](#ship-the-drawing-not-the-solver) |
| Vue를 전혀 쓰지 않음 | Node에서 SVG 쓰기: [Vue 없이](#plain-html-from-node) |

## Vite 앱 {#a-vite-app}

```bash
npm create vue@latest
npm install @edubeam/plot @edubeam/fem
```

[빠른 시작](/ko/plot/getting-started#draw-a-solved-model)에서처럼 쓰는 곳에서 컴포넌트를 가져오거나, `app.use(EduBeamPlot)`으로 두 컴포넌트를 한 번에 등록합니다. 그 밖에 설정할 것은 없습니다. 스타일시트도 번들러 플러그인도 필요 없습니다.

## VitePress 강의 노트 {#vitepress-course-notes}

[VitePress](https://vitepress.dev)는 Vue로 Markdown 페이지를 빌드하므로 강의 노트를 두기에 좋습니다. 테마 파일 `.vitepress/theme/index.ts`에서 컴포넌트를 등록합니다.

```ts [.vitepress/theme/index.ts]
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { EduBeamPlot } from '@edubeam/plot'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(EduBeamPlot) // 모든 페이지에서 <StructurePlot>과 <DiagramStack> 사용 가능
  },
} satisfies Theme
```

그다음 `frame.ts` 옆에 있는 페이지 안에서 바로 모델을 만들고 그립니다.

```md [portal-frame.md]
<script setup lang="ts">
import { portalFrame } from './frame' // () => 풀린 LinearStaticSolver

const frame = portalFrame()
</script>

# Portal frame

The bending moment under the design loads:

<StructurePlot :solver="frame" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

`vitepress build`가 라멘을 풀고, 레이블까지 포함한 완성된 SVG를 페이지의 HTML에 써 넣습니다. 브라우저에서는 페이지가 이 HTML을 이어받아 동작하고(hydration), 그림은 단의 너비에 맞춰 스스로 크기를 조정합니다. `frame.ts`는 [슬라이드와 강의 노트](/ko/plot/slides#a-figure-that-builds-up) 페이지에 있습니다.

## Nuxt {#nuxt}

Nuxt도 서버에서 렌더링하며, 이 사이트도 Nuxt로 만들었습니다. 페이지나 컴포넌트에서 평소처럼 컴포넌트를 가져오거나, `plugins/edubeam-plot.ts` 플러그인으로 앱 전체에 등록합니다.

```ts [plugins/edubeam-plot.ts]
import { EduBeamPlot } from '@edubeam/plot'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(EduBeamPlot)
})
```

서버에는 크기를 잴 상자가 없으므로, 그림은 `width` 프롭의 너비로 배치됩니다. 기본값은 640 px(`compact`이면 400 px)이고, `DiagramStack`은 720 px입니다. 마운트된 뒤에는 실제 너비로 다시 배치합니다. 단이 이보다 훨씬 좁거나 넓다면 `width`에 실제에 더 가까운 값을 주세요. 그러면 페이지를 불러오는 동안 그림 크기가 바뀌지 않습니다.

## 솔버 대신 그림 보내기 {#ship-the-drawing-not-the-solver}

그림만 보여 주는 페이지에는 솔버가 필요 없습니다. `modelFromSolver`는 풀린 모델을 일반 데이터로 읽어 옵니다. 절점, 부재, 하중, 반력, 그리고 각 부재의 N, V, M과 변위를 정확한 다항식으로 담습니다. `build-figures.ts` 같은 스크립트로 빌드할 때 만들어 두고,

```ts [build-figures.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

writeFileSync('portal-frame.json', JSON.stringify(modelFromSolver(portalFrame())))
```

`model` 프롭으로 그립니다.

```vue
<script setup lang="ts">
import { StructurePlot, type PlotModel } from '@edubeam/plot'
import frame from './portal-frame.json'
</script>

<template>
  <StructurePlot :model="frame as PlotModel" />
</template>
```

문형 라멘은 JSON으로 2 kB가 안 되고, 솔버에서 그린 것과 똑같이 그려집니다. 모든 기능이 솔버에서처럼 모델에서도 동작하며, 둘 다 주면 `model`이 우선합니다. 형식은 [그림 모델](/ko/plot/model)에 있습니다.

## Vue 없이 {#plain-html-from-node}

`structureSvg`는 모델을 SVG 파일의 텍스트로 바꿉니다. 색상 값이 그대로 들어가고 스타일도 스크립트도 없습니다. 어떤 HTML, 정적 사이트 생성기, Markdown 파일, CMS에든 붙여 넣으면 됩니다. 다음 스크립트는 그림 하나가 든 페이지를 씁니다.

```ts [frame-html.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const svg = structureSvg(modelFromSolver(portalFrame()), { layers: ['members', 'supports', 'reactions', 'M'] })
writeFileSync('frame.html', `<!doctype html><meta charset="utf-8"><title>Portal frame</title>${svg}`)
```

이런 그림은 쓸 때 정한 크기 그대로이고(기본 너비 640 px. `max-width: 100%; height: auto`를 주면 단에 맞춰 줄어듭니다), 자체 흰 배경이 있습니다. `background: false`로 지정하면 배경이 투명해집니다. 다크 테마를 따르지도, 포인터 아래의 값을 읽지도 않습니다. 그런 기능이 필요하면 컴포넌트를 렌더링하세요. [시험지 인쇄 스크립트](/ko/plot/exercises#print-a-test)가 이 방식으로 시험지 전체를 인쇄하며, 옵션은 [독립 SVG 파일](/ko/plot/functions#a-standalone-svg-file)에 정리되어 있습니다.
