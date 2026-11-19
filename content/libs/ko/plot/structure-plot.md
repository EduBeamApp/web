---
title: StructurePlot
description: "StructurePlot으로 평면 보, 라멘, 트러스를 그립니다. 레이어, 단계별로 쌓이는 그림, 연습 문제용 미지 반력 이름, 썸네일, 크기, 단위, 포인터로 값 읽기를 다룹니다."
order: 2
group: 컴포넌트
source: site
---

# StructurePlot

`StructurePlot`은 구조물 전체를 상자의 너비에 맞춰 그립니다. 부재, 힌지, 지점, 하중, 반력, 축력도·전단력도·휨모멘트도와 변형 형상까지입니다. 솔버나 솔버에서 만든 [그림 모델](/ko/plot/model)을 넘기고, 무엇을 그릴지 정하면 됩니다.

```vue
<StructurePlot :solver="solver" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

모든 프롭의 타입과 기본값은 [컴포넌트 API](/ko/plot/components#structureplot)에 있습니다.

아래 그림은 `nodeLabels`와 `dimensions`를 켜고 `hover`를 지정한 `StructurePlot`으로, 이 사이트의 숫자 형식(유효숫자 네 자리)을 씁니다. 결과를 바꿔 보고, 부재에 포인터를 올려 값을 읽어 보세요.

::model-figure{caption="문형 라멘: 기둥 하단은 힌지 지점, 보에 10 kN/m, B에 15 kN"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: pin, D: pin }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
  - { node: B, fx: 15 }
results: [M, V, N, w]
show: [nodeLabels, dimensions]
---
::

## 레이어 {#layers}

그림은 여러 레이어로 이루어지며, 나열한 순서와 상관없이 정해진 순서로 그려집니다.

| 레이어 | 그리는 것 |
| --- | --- |
| `members` | 부재. 힌지는 작은 원으로 표시 |
| `supports` | 지점마다 기호 하나. 경사 지점은 기호를 돌려서 표시 |
| `loads` | 절점하중과 부재하중, 온도하중, 지점 침하와 그 값 |
| `reactions` | 반력. 화살표와 곡선 화살표에 값을 붙여 표시. `reactionLabels: 'names'`이면 연습 문제의 [미지수 이름](#reactions-as-unknowns)으로 표시 |
| `nodes` | 모든 절점을 작은 원으로 표시 |
| `nodeLabels` | 절점 이름 |
| `dimensions` | 연습 문제지처럼 넣는 연속 치수. 절점과 집중하중 사이의 구간은 구조물 아래에, 층 높이는 오른쪽에, 전체 치수는 그 바깥 줄에 |
| `N`, `V`, `M` | 축력도, 전단력도, 휨모멘트도 |
| `w` | 변형 형상 |

`layers`를 생략하면 부재, 지점, 하중, 반력에 더해, 구조물에 맞게 고른 결과 하나를 그립니다. 보와 라멘이면 `M`, 트러스면 `N`이고, 온도하중을 받아 자유롭게 늘어나는 보처럼 아무 부재도 힘을 받지 않으면 `w`입니다.

다이어그램은 EduBeam 앱을 따릅니다. N과 V는 부재를 가로지르는 빗금으로 채우고, M은 인장 측에 그리므로 정모멘트는 보 아래에 나타납니다. `:moment-on-tension-side="false"`로 지정하면 M을 압축 측에 그립니다. 트러스는 각 부재의 부재력을 부재를 따라 한 번만 쓰고, 부호에 따라 색을 칠합니다.

## 단계별로 쌓이는 그림 {#figures-that-build-up}

`reserve`에는 숨겨져 있는 동안에도 자리를 잡아 둘 레이어를 나열합니다. 그림은 처음부터 예약된 레이어를 모두 배치해 두므로, 어떤 레이어를 켜면 제자리에서 서서히 나타나고 다른 것은 하나도 움직이지 않습니다.

```vue
<script setup lang="ts">
import type { PlotLayer } from '@edubeam/plot'

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'],
  ['nodeLabels', 'members', 'supports'],
  ['nodeLabels', 'members', 'supports', 'loads'],
  ['members', 'supports', 'loads', 'reactions'],
  ['members', 'supports', 'reactions', 'M'],
]
const all = [...new Set(stages.flat())]
// `frame`은 풀린 솔버, `step`은 현재 단계입니다. 컴포넌트 전체는 '슬라이드와 강의 노트'에 있습니다
</script>

<template>
  <StructurePlot :solver="frame" :layers="stages[step]" :reserve="all" />
</template>
```

`animate`가 켜져 있으면(기본값) 레이어는 서서히 나타나고, 부재는 한쪽 끝에서 다른 쪽 끝으로 그려집니다. `prefers-reduced-motion`이 설정되어 있으면 아무것도 움직이지 않습니다. [슬라이드와 강의 노트](/ko/plot/slides)에서 이 그림을 슬라이드에 넣습니다.

## 다이어그램 값 {#diagram-values}

값은 교과서가 다이어그램에 값을 적듯이, 해당 종거의 끝 바로 바깥에 씁니다. 값을 쓰는 곳은 0이 아닌 모든 부재 끝과 그 사이의 극값이고, 불연속점에서는 양쪽 값을 모두 쓰며, 강절점 모서리에서는 한 번만 씁니다. 값은 표시 단위(N과 V는 kN, M은 kNm)의 숫자만 쓰며, EduBeam 앱처럼 반력도 마찬가지입니다. 단위는 주어진 값, 즉 하중, 지점 침하, 온도 변화에만 붙습니다. 다른 레이블, 부재, 화살표와 겹치는 레이블은 같은 끝의 다른 자리를 시도하고, 빈자리가 없으면 생략되므로 숫자 두 개가 겹치는 일은 없습니다. 하중과 반력의 값을 먼저 배치하므로 다이어그램의 숫자에 밀려나지 않습니다. 트러스의 부재력은 절대 생략되지 않습니다. 부재를 따라 미끄러지고, 반대쪽으로 넘어가고, 마지막 수단으로 크기가 줄어듭니다.

`result-label-mode="axis"`로 지정하면 EduBeam 앱처럼 값이 종거 방향을 따라 쓰입니다. 읽는 사람이 두 방식을 오갈 수 있다면 `:reserve-label-modes="['horizontal', 'axis']"`를 지정하세요. 방식을 바꿔도 그림이 움직이지 않습니다.

## 미지수로 그린 반력 {#reactions-as-unknowns}

연습 문제지는 반력을 구하라고 하므로, 반력을 값 없이 보여 주어야 합니다. `reaction-labels="names"`는 지점이 구속하는 방향마다 양의 방향을 가리키는 화살표를 그립니다. 절점의 x 방향(지점을 돌리지 않았다면 오른쪽), 위쪽, 그리고 고정단의 모멘트 반력은 반시계 방향입니다. 각 화살표에는 절점 이름을 딴 *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>*라는 이름이 붙으며, 이름은 기울임꼴에 실제 아래 첨자로 씁니다. 그러면 모든 답의 부호가 그림 위에서 정해집니다. 반대 방향으로 작용하는 반력은 음수입니다.

```vue
<StructurePlot
  :model="model"
  :layers="['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']"
  reaction-labels="names"
/>
```

![위: 연습 문제지로 그린 일단 고정 타단 롤러 보. A는 고정단, B는 롤러 지점, 경간 중앙에 40 kN, 연속 치수 3 m와 3 m, 전체 6 m, 반력은 이름이 붙은 화살표 A_x, A_z, M_A, B_z. 아래: 같은 보를 기본 반력 레이블로 그린 그림. 위로 27.5와 12.5, 고정단의 모멘트 반력 45, 휨모멘트는 벽 쪽 −45에서 하중 아래 37.5까지](/screenshots/ko/p4-plot-reaction-names.webp){.shot-lg}

이름에는 해석 결과가 필요 없으므로, 풀지 않은 모델도 문제지로 그릴 수 있습니다. 정답지에서는 `reactionLabels`를 `'values'`로 둡니다. 이름과 값은 차지하는 자리가 다르므로(0인 수평 반력은 문제지에는 이름이 있지만 정답지에는 화살표가 없습니다), 둘 사이를 오가는 그림은 `:reserve-reaction-labels="['names', 'values']"`로 두 경우 모두의 자리를 잡아 두어야 합니다. 그러면 그림은 그대로 있고 레이블만 바뀝니다. [연습 문제와 시험](/ko/plot/exercises#the-exercise-in-a-page)의 연습 문제 카드는 `answers` 프롭으로 둘 사이를 전환합니다. 학생이 풀이를 요청할 때 이 사이트의 [연습 문제](/ko/practice)도 같은 방식으로 동작합니다.

## 썸네일 {#thumbnails}

`compact`는 약 400 × 200 px 크기의 타일에 맞게 그립니다. 기호가 더 작고, 글자는 11.5 px이며, 부재마다 값은 많아야 두 개이고, 분포하중에는 `q =` 없이 크기만 씁니다.

```vue
<StructurePlot v-for="t in tiles" :key="t.title" :solver="t.solver" compact :height="200" :title="t.title" />
```

이 사이트의 [예제 갤러리](/ko/examples/)가 이렇게 그려져 있습니다.

## 크기 {#size}

그림은 상자의 크기를 재고 그 너비에 맞춰 실제 픽셀 단위로 배치합니다. `height`가 없으면 높이는 그림을 따르되 `maxHeight`를 넘지 않으며, 그 기본값은 $\max(320, 0.75 \times \text{width})$입니다. 크기를 잴 수 없을 때(예를 들어 서버에서)는 `width`를 쓰며, 기본값은 640 px입니다.

| 프롭 | 기본값 | 설정하는 것 |
| --- | --- | --- |
| `width` | 640, compact 400 | 상자 크기를 재기 전의 배치 너비, px |
| `height` | follows the drawing | 고정 높이, px |
| `maxHeight` | $\max(320, 0.75w)$, compact none | 자동 높이의 상한 |
| `padding` | 6 | 그림 둘레의 여백, px |
| `fontSize` | 13, compact 11.5 | 글자 크기, px |
| `diagramSize` | 48, compact 26 | 가장 큰 종거의 길이, px |
| `deformedSize` | 30, compact 18 | 변형 형상의 최대 변위, px |

### 여러 그림을 같은 축척으로 {#several-plots-at-one-scale}

그림은 저마다 자기 최댓값에 맞춰 다이어그램의 축척을 정하므로, 20 kNm 모멘트도 80 kNm 모멘트와 같은 크기로 보입니다. 비교하려면 `diagramScale`로 SI 단위당 픽셀 수를 고정하세요.

```vue
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams' // '빠른 시작'에서: (경간 m, q kN/m) => 풀린 솔버

const spans = [4, 6, 8].map((L) => ({ L, solver: simpleBeam(L, 10) }))
// 1 kNm당 0.5 px(1 N·m당 0.5e-3 px): 경간 8 m의 80 kNm은 40 px 깊이로, 경간 4 m의 20 kNm은 10 px로 그려집니다
const scale = { M: 0.5e-3 }
</script>

<template>
  <figure v-for="s in spans" :key="s.L">
    <StructurePlot :solver="s.solver" :layers="['members', 'supports', 'M']" :diagram-scale="scale" />
    <figcaption>L = {{ s.L }} m</figcaption>
  </figure>
</template>
```

## 단위와 숫자 {#units-and-numbers}

값은 내부에서 SI 단위이고, 표시할 때만 변환됩니다. 기본 단위는 kN, kNm, kN/m, m, mm, mrad, K입니다. 어떤 단위든 기호와 배율로 바꿀 수 있으며, 표시값 = SI 값 × 배율입니다.

```vue
<StructurePlot :solver="solver" :units="{ force: { symbol: 'N', scale: 1 } }" />
```

숫자는 `Intl.NumberFormat`을 거치며, 기본값은 소수점 아래 최대 한 자리의 영어 형식입니다. 페이지의 언어에 맞추려면 직접 만든 형식을 넘기세요.

```vue
<StructurePlot :solver="solver" :number-format="new Intl.NumberFormat('cs', { maximumFractionDigits: 2 })" />
```

빼기 기호는 진짜 빼기 기호(−)이고, 반올림해서 0이 되는 값은 절대 −0으로 표시되지 않습니다. 단위 이름은 `force`, `moment`, `distributed`, `length`, `displacement`, `rotation`, `temperature`이며, 출발점으로 쓸 수 있도록 `KN_UNITS`와 `SI_UNITS`를 내보냅니다.

## 값 읽기 {#reading-values}

`hover`가 있으면 그림은 포인터 아래의 부재 위치에서, 표시 중인 결과의 값을 읽습니다. 각 값은 그려진 자리에 표시됩니다. 표시 중인 다이어그램마다 종거 끝에 점을 찍고(불연속점에서는 양쪽 끝 모두), 변형 형상에서는 그 위에 찍습니다. 값은 작은 레이블 상자에 `M = 54 kNm`처럼, 불연속점에서는 양쪽 값을 `V = 13.3 → −6.7 kN`처럼 나열합니다. 포인터는 부재 바로 위가 아니어도 그 다이어그램 위 어디서든 부재를 잡습니다. 그림은 값을 데이터로도 내보냅니다(emit).

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { StructurePlot, type Readout } from '@edubeam/plot'
import { portalFrame } from './frame' // '슬라이드와 강의 노트'에서: () => 풀린 솔버

const frame = portalFrame()
const reading = ref<Readout | null>(null)
</script>

<template>
  <StructurePlot :solver="frame" :layers="['members', 'supports', 'M']" hover @readout="reading = $event" />
  <p v-if="reading">
    Member {{ reading.member }}, {{ reading.x.toFixed(2) }} m from its start:
    M = {{ (reading.values.M.left / 1e3).toFixed(1) }} kNm
  </p>
</template>
```

읽은 값(readout)은 `{ member, x, px, py, values, u }`입니다. 부재, 부재를 따라 잰 위치(m), 화면 위의 점(px), `N`, `V`, `M`, `w` 각각의 `{ left, right }`(SI 단위), 그리고 축방향 변위 `u`입니다. 포인터가 벗어나면 `null`입니다. 이 사이트의 인터랙티브 그림은 `hover`를 씁니다. 하나에 포인터를 올려 보세요.

`hover`가 없으면 그림은 이벤트 리스너를 하나도 달지 않습니다. 그래서 그림 위에서도 페이지가 스크롤되고, 링크 안의 그림을 탭하면 링크로 이동합니다. `hover`가 있으면 그림은 포인터 이벤트만 받고, 터치스크린에서 세로 스크롤과 두 손가락 확대·축소는 그대로 동작합니다.

## 접근성 {#accessibility}

모든 그림은 `<svg role="img">`이며, `title` 프롭이나 “Structure with its loads, reactions, bending moment”처럼 무엇을 보여 주는지 설명하는 문구가 이름이 됩니다. 숨겨진 예약 레이어는 `aria-hidden`입니다.
