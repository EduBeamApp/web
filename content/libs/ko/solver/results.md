---
title: 결과 읽기
description: "풀린 @edubeam/fem 모델에서 반력, 절점 변위, 부재 위 임의 위치의 부재력, 변형 형상, 단부력을 읽는 방법과 각 호출의 반환 형태입니다."
order: 10
source: site
---

# 결과 읽기 {#reading-results}

`solve()` 후에는 절점과 부재에서 하중조건을 지정해 결과를 읽습니다. 이 페이지의 예제는 모두 같은 모델을 읽습니다. 전단 변형을 무시한 IPE 200으로 된 6 m 단순보에 A에서 2 m 위치에 20 kN이 작용합니다.

```ts [results.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 }) // 전단 변형 무시

const A = domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
const B = domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
const lc = solver.loadCases[0]
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], true)
solver.solve()
```

::model-figure{caption="6 m 경간의 2 m 위치에 20 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M, w]
show: [nodeLabels]
---
::

## 무엇을 어디서 읽나 {#what-to-read-where}

| 결과 | 호출 | 반환값 |
| --- | --- | --- |
| 반력 | `node.getReactions(lc)` | `{ dofs, values }`: N, N·m |
| 변위 | `node.getUnknowns(lc, dofs)` | m, rad |
| 한 점의 N, V, M | `beam.computeBendingMomentAt(lc, x)` | 숫자: N, N·m |
| 부재를 따라가는 N, V, M | `beam.computeBendingMoment(lc, n)` | `{ x, M }`, n + 1개 점 |
| 변형 형상 | `beam.computeLocalDefl(lc, n)` | `{ u, w }`, n + 1개 점, m |
| 단부력 | `beam.computeEndForces(lc)` | 성분 6개의 mathjs 행렬 |

N과 V를 읽는 메서드는 `computeNormalForceAt`과 `computeShearForceAt`, 그리고 `{ x, N }`과 `{ x, V }`를 반환하는 `computeNormalForce`와 `computeShearForce`입니다. 부호는 [단위 및 부호](/ko/solver/conventions#signs-of-the-results)에 있습니다.

## 반력 {#reactions}

`getReactions`는 지점이 구속하는 자유도마다 반력을 하나씩 줍니다. `dofs`는 그 자유도를 `createNode`에 준 순서대로 나열하고, `values`는 같은 순서로 반력을 담습니다. `values`는 반력이 여러 개면 **mathjs 행렬**, 하나면 평범한 배열입니다. 따라서 작은 헬퍼 함수로 어느 경우든 배열로 바꿔 두면 편합니다.

```ts
/** mathjs Matrix, 배열, 숫자를 평범한 배열로 바꿈 */
const list = (v: unknown): number[] =>
  typeof v === 'number'
    ? [v]
    : Array.isArray(v)
      ? v
      : (v as { toArray(): number[] }).toArray()

A.getReactions(lc).dofs // [0, 2]: DofID.Dx, DofID.Dz
list(A.getReactions(lc).values) // [0, -13333.3]
list(B.getReactions(lc).values) // [-6666.7]
```

순서와 관계없이 반력 하나를 고르려면 그 자유도를 찾으면 됩니다. [연속보 예제](/ko/solver/beams#a-continuous-beam)처럼 `list(values)[dofs.indexOf(DofID.Dz)]`라고 씁니다.

반력은 지점이 구조물에 가하는 힘입니다. z 방향 −13,333 N은 위로 미는 13.3 kN으로, $P\,b/L = 20 \cdot 4/6$입니다. [좌표축을 돌린](/ko/solver/nodes-supports#inclined-supports) 절점에서는 반력이 그 좌표축 기준입니다. `getReactions(lc, true)`는 이를 전체 좌표계로 바꾸고, 자유도 3개를 모두 반환하며 구속하지 않은 자유도에는 0을 넣습니다. 지점이 없는 절점은 `{ dofs: [], values: [] }`를 반환합니다.

## 변위 {#displacements}

`getUnknowns`는 지점이 있든 없든 절점의 어떤 자유도든 읽습니다.

```ts
list(A.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])) // [0, 0, -0.0108924]
```

A는 시계 방향으로 0.010892 rad, 즉 $P\,b\,(L^2 - b^2)/6EIL$만큼 회전합니다. 자유도 하나만 요청하면 `getUnknowns`는 TypeScript 선언으로는 행렬이지만 실제로는 평범한 숫자를 반환합니다. `list`는 이 경우도 처리합니다.

## 부재를 따라가는 부재력 {#internal-forces-along-a-member}

`…At` 메서드는 부재의 첫 번째 절점에서 `x` m 떨어진 점의 값을 줍니다.

```ts
beam.computeShearForceAt(lc, 1) // 13333.3 N
beam.computeShearForceAt(lc, 2) // -6666.7 N: 하중 위치에서는 하중을 지난 쪽 값
beam.computeBendingMomentAt(lc, 2) // 26666.7 N·m: R_A · 2
```

집중하중 때문에 값이 불연속으로 뛰는 곳에서는, 정확히 하중 위치의 값이 하중 너머 쪽의 값입니다. 하중 앞쪽 값을 읽으려면 `x - 1e-9`처럼 아주 조금 앞의 위치를 요청하세요.

배열을 반환하는 메서드는 양 끝을 포함해 부재를 같은 간격의 n + 1개 점에서 계산합니다.

```ts
beam.computeBendingMoment(lc, 3)
// { x: [0, 2, 4, 6], M: [0, 26666.7, 13333.3, 0] }, 반올림 오차 범위에서
```

정확한 값이 0인 곳에 `-3.6e-12` 같은 반올림 오차가 나올 수 있으니, 출력하기 전에 `toFixed`로 숫자를 정리하세요. 부재를 따라가는 최댓값은 `computeBendingMoment(lc, 500)`처럼 촘촘하게 계산한 값 가운데 가장 큰 값으로 구합니다. [연속보 예제](/ko/solver/beams#a-continuous-beam)가 그렇게 합니다. 분포하중을 받으면 M은 다항식이므로, 정확한 극값은 V가 0이 되는 위치에 있습니다. [@edubeam/plot](/ko/plot/model#reading-values-yourself) 라이브러리는 이 위치를 정확히 찾습니다.

## 변형 형상 {#deflected-shape}

```ts
beam.computeLocalDefl(lc, 3)
// { u: [0, 0, 0, 0], w: [0, 0.0174279, 0.0152494, 0] }
```

`computeLocalDefl`은 부재의 국부 좌표계에서 부재 축 방향과 축에 수직인 방향의 변위 `u`와 `w`를 줍니다. `computeGlobalDefl`은 같은 점의 변위를 전체 좌표계의 x와 z로 줍니다. 하중 위치의 처짐 17.43 mm는 $P\,a^2 b^2/3EIL$입니다. 절점 사이의 형상은 양 끝 값을 보간한 것이 아니라 정확한 값입니다. 그림으로 그리려면 [결과 그리기](/ko/solver/drawing)를 참고하세요.

## 단부력 {#end-forces}

```ts
beam.computeEndForces(lc).toArray()
// [0, -13333.3, 0, 0, -6666.7, 0]: X12, Z12, M12, X21, Z21, M21
```

두 절점이 부재에 가하는 힘을 부재의 국부 좌표계로 나타낸 것입니다. 앱의 *요소 결과* 표에 나오는 숫자와 같으며, [단부력](/ko/elements/conventions#end-forces-element-results-table)에서 설명합니다.

## 검증할 수 있는 숫자 {#results-as-numbers-to-check}

위의 값은 모두 닫힌 해의 공식과 일치합니다. [손 계산으로 결과 검증](/ko/guide/verification) 페이지에서는 훨씬 많은 교과서 문제를, 바로 이 솔버로 브라우저에서 풀어 확인합니다.
