---
title: 그림 모델
description: "modelFromSolver가 풀린 @edubeam/fem 모델에서 만드는, JSON으로 직렬화할 수 있는 일반 데이터 PlotModel과 그 구간별 다항식 결과, 정확한 값과 극값을 읽는 방법."
order: 9
source: site
---

# 그림 모델

@edubeam/plot 라이브러리가 그리는 모든 것은 `PlotModel`에서 나옵니다. `PlotModel`은 `modelFromSolver`가 풀린 @edubeam/fem 모델에서 읽어 오는 일반 데이터입니다. 형상, 지점, 하중, 반력, 그리고 각 부재의 결과를 정확한 다항식으로 담습니다. JSON으로 직렬화할 수 있으므로 빌드할 때 만들어 솔버 대신 보낼 수 있고, 풀린 구조물의 정확한 값과 극값을 읽는 가장 쉬운 방법이기도 합니다.

```ts
import { modelFromSolver } from '@edubeam/plot'

const model = modelFromSolver(solver) // 또는 modelFromSolver(solver, { loadCase: 1 })
```

`results`는 하중조건을 풀었을 때만 있습니다. 없으면 컴포넌트는 모델만 그리며, [`reactionLabels: 'names'`](/ko/plot/structure-plot#reactions-as-unknowns)를 주면 미지 반력도 그립니다. 그래서 풀지 않은 모델로도 연습 문제지를 만들 수 있습니다.

## 형식 {#the-format}

모든 값은 SI 단위(m, N, N·m, N/m, K, rad)이고, 솔버의 좌표축을 따릅니다. x는 오른쪽, z는 아래쪽이며, 회전은 화면에서 반시계 방향이 양입니다.

```ts
interface PlotModel {
  readonly nodes: readonly PlotNode[]
  readonly members: readonly PlotMember[]
  readonly loads: readonly PlotLoad[]
  readonly results?: PlotResults // 하중조건을 풀었을 때만
}

interface PlotNode {
  readonly id: string
  readonly x: number
  readonly z: number
  readonly fixity: { readonly dx: boolean; readonly dz: boolean; readonly ry: boolean } // 구속 자유도
  readonly angle: number // 돌린 지점의 좌표축 회전각, rad, 화면에서 시계 방향
}

interface PlotMember {
  readonly id: string
  readonly start: string // 절점 id
  readonly end: string
  readonly hinges: readonly [boolean, boolean]
}

interface PlotResults {
  readonly members: Readonly<Record<string, MemberResults>> // 부재 id별
  readonly reactions: readonly PlotReaction[]
}

interface MemberResults {
  readonly N: Piecewise // 축력, 인장이 양수
  readonly V: Piecewise // 전단력
  readonly M: Piecewise // 휨모멘트, 국부 +z 쪽이 인장일 때 양수
  readonly u: Piecewise // 국부 x 방향 변위
  readonly w: Piecewise // 국부 z 방향 변위
}

interface PlotReaction {
  readonly node: string
  readonly dof: 'dx' | 'dz' | 'ry'
  readonly value: number // 구조물에 작용하는 힘, 절점 좌표축 방향, N (ry는 N·m)
}
```

하중은 일곱 종류 가운데 하나이며, `kind`로 구분합니다.

| `kind` | 필드 | 내용 |
| --- | --- | --- |
| `'nodalForce'` | `node`, `fx`, `fz` | 절점에 작용하는 힘, 전체 좌표계 성분, N |
| `'nodalMoment'` | `node`, `my` | 절점에 작용하는 모멘트, N·m |
| `'distributed'` | `member`, `start`, `end`, `local` | 선형으로 변하는 분포하중, 양 끝의 `{ fx, fz }`, N/m. 같으면 등분포 |
| `'pointForce'` | `member`, `at`, `fx`, `fz`, `local` | 부재의 시작점에서 `at` m 떨어진 곳의 힘 |
| `'pointMoment'` | `member`, `at`, `my` | 부재에 작용하는 집중모멘트 |
| `'temperature'` | `member`, `uniform`, `gradient` | K: 도심의 온도 변화, 그리고 하연 온도에서 상연 온도를 뺀 값 |
| `'prescribed'` | `node`, `dx?`, `dz?`, `ry?` | 절점 좌표축 방향의 지점 변위, m와 rad |

`local`은 성분이 전체 좌표계가 아니라 부재의 국부 x, z 방향일 때 `true`입니다.

## 구간별 다항식 {#piecewise-polynomials}

부재의 결과는 `Piecewise`입니다. 조각(piece)의 목록이며, 조각마다 부재의 한 구간에서 정의된 다항식입니다. 집중하중이나 집중모멘트가 결과를 끊는 곳마다 새 조각이 시작됩니다.

```ts
interface Piece {
  readonly x0: number // 부재 시작점부터의 거리, m
  readonly x1: number
  readonly c: readonly number[] // 값 = Σ c[k]·sᵏ, s = (x − x0)/(x1 − x0)
}
type Piecewise = readonly Piece[]
```

N, V, M은 많아야 3차, 처짐은 많아야 5차이므로, 계수 몇 개로 솔버의 답을 정확히 담을 수 있습니다. 2 m 위치에 20 kN이 작용하는 6 m 보의 전단력은 상수 조각 두 개입니다.

```json
[{ "x0": 0, "x1": 2, "c": [13333.33] }, { "x0": 2, "x1": 6, "c": [-6666.67] }]
```

## 직접 값 읽기 {#reading-values-yourself}

다이어그램을 그리는 함수로 값을 읽을 수도 있습니다. 샘플링 없이 정확한 값입니다.

```ts
import { extremes, innerBreaks, modelFromSolver, valueAt } from '@edubeam/plot'

// 경간 6 m 단순보, A에서 2 m 위치에 20 kN, 전단 변형을 무시한 IPE 200
const model = modelFromSolver(solver)
const { V, M, w } = model.results!.members['1']

innerBreaks(V) // [2]: 하중 위치에서 조각이 만남
valueAt(V, 2, 'left') // 13333.3 N, 하중 바로 앞
valueAt(V, 2, 'right') // -6666.7 N, 하중 바로 뒤
extremes(M) // x = 2에서 최댓값 26666.7 N·m
extremes(w) // x = 2.734에서 최댓값 0.018973 m
```

`extremes`는 `{ max, min }`을 반환하며, 각각 `{ x, value, side }`입니다. 빈 목록이면 `null`입니다. 최대 처짐은 하중 바로 아래가 아니라 $x = L - \sqrt{(L^2 - a^2)/3} = 2.734$ m에서 생기고, 그 값은 $P\,a\,(L^2 - a^2)^{3/2}/9\sqrt{3}\,EIL = 18.97$ mm로, 중앙에서 벗어난 집중하중의 처짐 공식과 일치합니다.

[문제 생성기](/ko/plot/exercises#the-generator)도 이렇게 해서 정답지에 넣을 모멘트의 극값을 찾습니다. 나머지, 즉 기울기, 조각 안의 극값, 차수, 베지에 곡선은 [함수](/ko/plot/functions#piecewise-polynomials) 페이지에 있습니다.

## JSON으로 보내기 {#ship-it-as-json}

`JSON.stringify(model)`이면 충분하고, `JSON.parse`로 되돌린 모델은 솔버에서 그린 것과 똑같이 그려집니다. 분포하중과 집중하중이 있는 문형 라멘은 2 kB가 안 됩니다. [삽입](/ko/plot/embedding#ship-the-drawing-not-the-solver)을 참고하세요. 모델은 [`structureSvg`](/ko/plot/functions#a-standalone-svg-file)에도 넘길 수 있으며, 이 함수가 모델을 SVG 파일로 씁니다.
