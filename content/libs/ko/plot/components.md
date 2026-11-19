---
title: 컴포넌트 API
description: "@edubeam/plot 0.2.0의 StructurePlot과 DiagramStack이 받는 모든 프롭과 이벤트를 타입, 기본값과 함께 정리하고, EduBeamPlot 플러그인과 내보내는 프롭 타입을 설명합니다."
order: 8
group: API 레퍼런스
source: site
---

# 컴포넌트 API

@edubeam/plot 0.2.0에 선언된 두 컴포넌트의 프롭과 이벤트입니다. 두 컴포넌트 모두 슬롯은 없습니다. SI 단위인 값은 따로 표시했고, 크기는 CSS 픽셀입니다.

## StructurePlot {#structureplot}

```ts
import { StructurePlot } from '@edubeam/plot'
```

평면 구조물과 그 결과를 그립니다. 가이드: [StructurePlot](/ko/plot/structure-plot).

### 프롭 {#props}

| 프롭 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | @edubeam/fem 솔버. 하중조건을 풀고 나면 결과를 그립니다. |
| `model` | `PlotModel` | – | 또는 [`modelFromSolver`](/ko/plot/model)가 만드는 일반 데이터. `solver`보다 우선합니다. |
| `loadCase` | `number` | `0` | `solver.loadCases`의 인덱스 |
| `revision` | `number` | `0` | 그 자리에서 고친 솔버를 다시 그리려면 값을 바꿉니다 |
| `layers` | `readonly PlotLayer[]` | members, supports, loads, reactions and one result | 그릴 것: `'nodes'`, `'nodeLabels'`, `'dimensions'`, `'members'`, `'supports'`, `'loads'`, `'reactions'`, `'N'`, `'V'`, `'M'`, `'w'` |
| `reserve` | `readonly PlotLayer[]` | `layers` | 숨겨져 있는 동안에도 자리를 잡아 둘 레이어 |
| `compact` | `boolean` | `false` | 썸네일용 그림: 작은 기호, 부재마다 값은 많아야 두 개 |
| `units` | `Partial<Units>` | `KN_UNITS` | 표시 단위 |
| `numberFormat` | `Intl.NumberFormat` | English, at most 1 decimal | 모든 숫자의 형식 |
| `colors` | `Partial<PlotColors>` | – | 톤별 색 변경: [테마와 색상](/ko/plot/theming#the-colors-prop) |
| `width` | `number` | `640`, compact `400` | 상자 크기를 재기 전의 너비(서버에서처럼) |
| `height` | `number` | – | 고정 높이. 없으면 높이가 그림을 따릅니다. |
| `maxHeight` | `number` | `max(320, 0.75 × width)`, compact none | 자동 높이의 상한 |
| `padding` | `number` | `6` | 그림 둘레의 여백 |
| `fontSize` | `number` | `13`, compact `11.5` | 글자 크기 |
| `diagramSize` | `number` | `48`, compact `26` | 다이어그램에서 가장 큰 종거의 길이 |
| `deformedSize` | `number` | `30`, compact `18` | 변형 형상의 최대 변위 |
| `diagramScale` | `Partial<Record<ResultLayer, number>>` | – | 결과별로 고정한 SI 단위당 px. `diagramSize`나 `deformedSize`보다 우선 |
| `momentOnTensionSide` | `boolean` | `true` | M을 인장 측에 그림. `false`이면 압축 측 |
| `resultLabelMode` | `'horizontal' \| 'axis'` | `'horizontal'` | 값을 똑바로 세워 쓸지, 종거 방향으로 돌려 쓸지 |
| `reactionLabels` | `'values' \| 'names'` | `'values'` | 반력을 실제 작용 방향과 크기로 그리거나, 연습 문제용으로 구속된 방향마다 이름(*A<sub>x</sub>*, *M<sub>A</sub>*)을 붙여 양의 방향으로 그립니다. 이름에는 해석 결과가 필요 없습니다: [미지수로 그린 반력](/ko/plot/structure-plot#reactions-as-unknowns) |
| `reserveLabelModes` | `readonly ResultLabelMode[]` | – | 현재 방식 외에 자리를 잡아 둘 레이블 방식 |
| `reserveReactionLabels` | `readonly ReactionLabels[]` | – | `reactionLabels` 외에 자리를 잡아 둘 반력 레이블 방식. 연습 문제가 풀이로 바뀌어도 그림이 움직이지 않습니다 |
| `animate` | `boolean` | `true` | 레이어를 서서히 나타내고 부재를 그려 나갑니다. `prefers-reduced-motion`이 설정되어 있으면 언제나 꺼집니다. |
| `hover` | `boolean` | `false` | 포인터 아래의 값을 읽고, 각 다이어그램의 종거 끝에 표시합니다. 끄면 그림은 포인터 입력을 전혀 받지 않습니다. |
| `title` | `string` | a description of what is shown | 그림의 접근 가능한 이름 |

`layers`가 없을 때 그리는 결과는 보와 라멘이면 `M`, 트러스면 `N`, 아무 부재도 힘을 받지 않으면 `w`입니다(`defaultResultLayer`).

### 이벤트 {#events}

| 이벤트 | 페이로드 | 발생 시점 |
| --- | --- | --- |
| `readout` | `Readout \| null` | `hover`가 있을 때: 포인터 아래의 부재 위치와 그 결과. 포인터가 벗어나면 `null` |

```ts
interface Readout {
  readonly member: string
  readonly x: number // 부재의 시작 절점에서 m
  readonly px: number // 화면 위의 점, px
  readonly py: number
  readonly values: Readonly<Record<'N' | 'V' | 'M' | 'w', SidedValue>> // SI 단위
  readonly u: number // 부재의 국부 x 방향 변위, m
}
interface SidedValue {
  readonly left: number
  readonly right: number // 결과가 연속인 곳에서는 left와 같음
}
```

## DiagramStack {#diagramstack}

```ts
import { DiagramStack } from '@edubeam/plot'
```

곧은 보와 그 아래의 다이어그램을 같은 x축으로 그립니다. 부재는 왼쪽에서 오른쪽으로 그린 하나의 수평선을 이루어야 하며, 그렇지 않으면 예외를 던집니다. 가이드: [DiagramStack](/ko/plot/diagram-stack).

### 프롭 {#props-1}

| 프롭 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | 풀린 보 |
| `model` | `PlotModel` | – | 또는 `modelFromSolver`가 만드는 일반 데이터. 이쪽이 우선합니다 |
| `loadCase` | `number` | `0` | `solver.loadCases`의 인덱스 |
| `revision` | `number` | `0` | 그 자리에서 고친 솔버를 다시 그리려면 값을 바꿉니다 |
| `members` | `readonly string[]` | all members | 보 축선을 이루는 부재 |
| `rows` | `readonly StackRow[]` | `['V', 'M', 'w']` | 위에서 아래로 놓을 다이어그램 행. `'N'`, `'V'`, `'M'`, `'w'` 중에서 |
| `loadRow` | `boolean` | `true` | 행 위에 지점, 하중, 반력과 함께 그리는 보 |
| `ranges` | `Partial<Record<StackRow, readonly [number, number]>>` | each row's own | 행별 값 범위, SI 단위 |
| `rowHeights` | `Partial<Record<StackRow, number>>` | N 100, V 116, M 128, w 76; below 560 px wide 88, 96, 104, 64 | `maxHeight`로 줄이기 전의 행 높이 |
| `maxHeight` | `number` | – | 그림이 들어가도록 행이 최대 60 %까지 줄어듭니다. 글자 크기는 그대로입니다. |
| `units` | `Partial<Units>` | `KN_UNITS` | 표시 단위 |
| `numberFormat` | `Intl.NumberFormat` | English, at most 1 decimal | 모든 숫자의 형식 |
| `colors` | `Partial<PlotColors>` | – | 색 변경 |
| `width` | `number` | `720` | 상자 크기를 재기 전의 너비. 최소 320을 씁니다 |
| `fontSize` | `number` | `12.5` | 글자 크기 |
| `hover` | `boolean` | `true` | 읽기 커서. 끄면 그림은 포인터 입력을 받지 않습니다. |
| `loadAt` | `number` | – | 읽는 사람이 드래그할 수 있는 집중하중의 위치(선을 따라 m). `v-model:load-at`과 함께 사용 |
| `loadLabel` | `string` | `P = …` with the load's magnitude | 드래그할 수 있는 하중 옆에 쓰는 글 |
| `loadStep` | `number` | `0.05` | 드래그한 위치를 이 간격으로 반올림, m. 화살표 키도 이만큼 이동 |
| `title` | `string` | a description of the rows | 그림의 접근 가능한 이름 |

### 이벤트 {#events-1}

| 이벤트 | 페이로드 | 발생 시점 |
| --- | --- | --- |
| `update:loadAt` | `number` | 읽는 사람이 하중을 옮겼을 때: 새 위치, m. `v-model:load-at`이 이 이벤트로 동작합니다. |
| `readout` | `StackReadout \| null` | 커서 위치에서 모든 행의 값. 포인터가 벗어나면 `null` |

```ts
interface StackReadout {
  readonly x: number // 보 축선을 따라 m
  readonly values: Partial<Record<'N' | 'V' | 'M' | 'w', { readonly left: number; readonly right: number }>> // SI
}
```

## 플러그인 {#the-plugin}

```ts
import { EduBeamPlot } from '@edubeam/plot'

app.use(EduBeamPlot) // <StructurePlot>과 <DiagramStack>을 전역으로 등록
```

플러그인은 선택 사항입니다. 컴포넌트를 이름으로 가져오는 편이 더 가볍고, 플러그인을 쓰지 않는 빌드에서는 번들러가 플러그인을 빼 버립니다.

## 타입 {#types}

컴포넌트를 타입이 있는 래퍼로 감쌀 수 있도록, 패키지는 프롭과 이벤트의 타입을 내보냅니다.

```ts
import type { PlotLayer, StructurePlotProps } from '@edubeam/plot'

const figure: StructurePlotProps = { layers: ['members', 'supports', 'M'] satisfies PlotLayer[], compact: true }
```

| 타입 | 내용 |
| --- | --- |
| `StructurePlotProps`, `StructurePlotEmits` | `StructurePlot`의 프롭과 이벤트 |
| `DiagramStackProps`, `DiagramStackEmits` | `DiagramStack`의 프롭과 이벤트 |
| `Readout`, `ReadoutQuantity`, `SidedValue`, `StackReadout` | 이벤트 페이로드 |
| `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `StackRow` | 레이어, 결과, 레이블 방식, 반력 레이블, 행의 이름 |
| `Units`, `Unit`, `UnitKind` | 표시 단위: 종류마다 `{ symbol, scale }` |
| `PlotColors` | 톤별 색 |
| `PlotModel` | 일반 데이터 모델: [그림 모델](/ko/plot/model) |

나머지 내보내기, 즉 SVG 파일을 쓰는 `structureSvg`와 그림을 그리는 바탕이 되는 함수 등은 [함수](/ko/plot/functions)에 있습니다.
