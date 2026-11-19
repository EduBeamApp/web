---
title: 하중조건
description: "@edubeam/fem 모델 하나의 여러 하중조건을 한 번에 풀고, 그 결과를 중첩해 하중조합과 포락선을 만드는 방법입니다."
order: 8
source: site
---

# 하중조건 {#load-cases}

하중조건은 함께 푸는 하중의 묶음입니다. 솔버에는 처음부터 하중조건이 하나 있습니다. 하중조건을 더 추가해도 `solve()` 한 번에 강성 행렬 하나로 모두 풉니다. 선형 해석이므로 서로 다른 하중조건의 결과에 계수를 곱해 더할 수 있습니다. 하중조합이란 바로 이것입니다.

## 하중조건 추가 {#add-a-load-case}

```ts [load-cases.ts]
import { DofID, LinearStaticSolver, LoadCase } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const dead = solver.loadCases[0] // 모든 솔버에 처음부터 있는 하중조건
const live = new LoadCase('live', domain)
solver.loadCases.push(live)

dead.createBeamElementUniformEdgeLoad(1, [0, 10e3], true) // 10 kN/m
live.createBeamConcentratedLoad(1, [0, 20e3, 0, 3], true) // 경간 중앙에 20 kN
solver.solve() // 모든 하중조건을 풂

console.log(beam.computeBendingMomentAt(dead, 3)) // qL²/8
console.log(beam.computeBendingMomentAt(live, 3)) // PL/4
```

```text [출력]
45000
30000
```

결과를 읽는 메서드는 모두 어느 하중조건을 읽을지 인수로 받습니다. 첫 번째 하중조건의 레이블은 `'DefaultLC'`입니다. 레이블은 이름일 뿐이고, 솔버는 하중조건을 객체로 구별합니다.

## 조합하기 {#combine-them}

각 하중조건의 결과에 하중계수를 곱해 더합니다. Eurocode의 극한한계상태 조합 $1.35\,G + 1.5\,Q$를 경간 중앙에서 계산하면 다음과 같습니다.

```ts
1.35 * beam.computeBendingMomentAt(dead, 3) +
  1.5 * beam.computeBendingMomentAt(live, 3) // 105750 N·m
```

반력, 변위를 비롯한 다른 모든 결과도 마찬가지입니다. 부재 전체에 걸쳐 조합하려면 점마다 조합합니다. `computeBendingMoment(lc, n)`이 반환하는 배열은 어느 하중조건이든 같은 `x`를 씁니다.

```ts
const n = 60
const g = beam.computeBendingMoment(dead, n).M
const q = beam.computeBendingMoment(live, n).M
const uls = g.map((m, i) => 1.35 * m + 1.5 * q[i])
Math.max(...uls) // 105750 N·m, x = 3에서
```

포락선, 즉 여러 하중조합 가운데 가장 큰 값과 가장 작은 값은 이런 배열에 대해 점마다 `Math.max`와 `Math.min`을 취하면 됩니다. 이동하중이라면 하중 위치마다 한 번씩 풉니다. [영향선 예제](/ko/solver/scripts#an-influence-line-as-csv)가 그렇게 합니다.

## EduBeam 앱에서는 {#in-the-edubeam-app}

앱은 한 번에 하중조건 하나만 풉니다. 따라서 하중조합은 라이브러리가 앱보다 더 나아가는 부분입니다. 하중조건이 여러 개인 모델도 하중조건별로 [그릴](/ko/solver/drawing) 수 있습니다. @edubeam/plot의 `StructurePlot`은 `loadCase` 프롭으로 `solver.loadCases`의 인덱스를 받습니다.
