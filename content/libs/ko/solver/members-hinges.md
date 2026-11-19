---
title: 부재 및 힌지
description: "Beam2D 부재로 절점을 잇고, 단부 힌지로 모멘트를 해제하고, 트러스 부재를 모델링하고, @edubeam/fem에서 요소의 강성 행렬과 좌표 변환 행렬을 얻는 방법입니다."
order: 5
source: site
---

# 부재 및 힌지 {#members-and-hinges}

모든 부재는 `Beam2D`입니다. x–z 평면에 놓인 곧은 2절점 Timoshenko 보로, 축력, 전단력, 휨모멘트를 전달합니다. 부재 끝의 힌지는 그곳의 모멘트를 해제합니다. 코드 조각은 [빠른 시작](/ko/solver/getting-started)과 같은 프로그램의 `solver`, `domain`, `lc`와, 그 프로그램의 재료 `'steel'`, 단면 `'IPE200'`을 사용합니다.

## 부재 만들기 {#create-a-member}

```ts
domain.createBeam2D(label, [startNode, endNode], material, crossSection, hinges)
```

| 인수 | 타입 | 의미 |
| --- | --- | --- |
| `label` | `string \| number` | 부재의 이름. 문자열로 저장 |
| `nodes` | `[label, label]` | 첫 번째 절점과 두 번째 절점. 국부 x는 첫 번째에서 두 번째로 향함: [부재 방향](/ko/solver/conventions#member-direction) 참고. |
| `mat`, `cs` | `string \| number` | 재료와 단면의 레이블 |
| `hinges` | `[boolean, boolean]` | 첫 번째 절점 쪽, 두 번째 절점 쪽 힌지. 생략 가능하며 기본값은 `[false, false]`, 양 끝 모두 강접합. |

반환값은 `Beam2D`입니다. 결과를 읽으려면 변수에 담아 두세요. `domain.getElement(label)`로 다시 찾을 수도 있지만, 반환 타입이 일반적인 `Element`이므로 TypeScript에서 결과를 읽으려면 먼저 `as Beam2D`를 붙여야 합니다.

힌지 없이 한 절점에서 만나는 부재는 강접합되어 함께 회전합니다. 절점, 재료, 단면은 풀 때 모두 존재하기만 하면 어떤 순서로 만들어도 됩니다. 하나라도 없으면 `solve()`가 그 이름을 담은 `RangeError`를 던집니다.

## 단부 힌지 {#end-hinges}

힌지는 절점이 아니라 부재의 끝에 속합니다. 아래 예에서 부재 2는 C에서 힌지로 시작합니다. 그래서 C는 경간 C–D에서 캔틸레버 A–C로 전단력은 전달하지만 모멘트는 전달하지 않습니다.

```ts [hinge.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry])
domain.createNode('C', [2, 0, 0])
domain.createNode('D', [6, 0, 0], [DofID.Dz])
const ac = domain.createBeam2D(1, ['A', 'C'], 'steel', 'IPE200')
const cd = domain.createBeam2D(2, ['C', 'D'], 'steel', 'IPE200', [true, false])

lc.createBeamElementUniformEdgeLoad(2, [0, 10e3], true)
solver.solve()

cd.computeBendingMomentAt(lc, 0) // 힌지에서 0
cd.computeBendingMomentAt(lc, 2) // 20000 N·m: 4 m 경간의 qL²/8
ac.computeBendingMomentAt(lc, 0) // -40000 N·m: C–D에서 온 20 kN, 2 m 떨어짐
```

::model-figure{caption="힌지로 연결된 경간을 받치는 캔틸레버: C에서 모멘트는 0"}
---
nodes: { A: [0, 0], C: [2, 0], D: [6, 0] }
supports: { A: fixed, D: roller }
members: [[A, C], { nodes: [C, D], hinges: [true, false] }]
loads:
  - { member: 2, qz: 10 }
results: [M, V]
show: [nodeLabels]
---
::

여러 부재가 힌지 절점에서 만날 때는 한 부재를 뺀 나머지 모든 부재 끝에 힌지를 두면 충분합니다. 모든 부재 끝에 힌지를 두어도 됩니다. 이때는 절점을 회전시키는 것이 없으므로 솔버가 내놓는 절점 회전각은 0입니다. 다만 그런 절점에 모멘트를 가하면 그 모멘트를 받을 부재가 없어 [해석이 실패합니다](/ko/solver/solving#when-solving-fails).

## 트러스 부재 {#truss-bars}

양 끝에 힌지를 두고 하중을 절점에만 가하면, 부재는 축력만 전달합니다. 이것이 트러스 부재입니다.

```ts
domain.createBeam2D('AE', ['A', 'E'], 'steel', 'bar', [true, true])
```

[트러스 예제](/ko/solver/trusses)는 이 방법으로 트러스 전체를 풉니다. 반면 EduBeam 앱의 트러스 예제는 강절점을 쓰고, 단면적을 아주 크게 주어 휨모멘트가 축력에 비해 무시할 만큼 작아지게 합니다. 두 모델 모두 타당하며, 차이는 그 작은 모멘트뿐입니다. 트러스 부재 자체의 강성 행렬은 이론 매뉴얼의 [트러스 요소](/ko/elements/truss) 페이지에서 유도합니다.

## 요소의 행렬 {#the-element-s-matrices}

해석 방법 자체를 가르칠 수 있도록 `Beam2D`는 자신의 행렬을 [mathjs](https://mathjs.org) 행렬로 제공합니다. `.toArray()`를 호출하면 `number[][]`가 됩니다.

| 메서드 | 반환값 |
| --- | --- |
| `computeGeo()` | `{ l, dx, dz }`: 길이와 투영 길이, m |
| `computeLocalStiffnessMtrx().answer` | 국부 좌표계의 6 × 6 강성 행렬, 힌지의 회전각은 정적 축약으로 소거 |
| `computeT()` | 전체 좌표계에서 국부 좌표계로의 6 × 6 좌표 변환 행렬 |
| `computeStiffness()` | 전체 좌표계의 6 × 6 강성 행렬, $T^T K_l T$ |
| `computeShearFactor()` | $\Phi = 12EI_y/kGAL^2$ |

```ts
ac.computeStiffness().toArray() // number[][], N/m, N, N·m
```

자유도의 순서는 $u_1, w_1, \varphi_1, u_2, w_2, \varphi_2$입니다. 이론 매뉴얼의 [보 요소](/ko/elements/beam) 페이지에서 이 행렬을 유도하고, [EduBeam의 해석 과정](/ko/elements/analysis)에서 이를 조립하는 과정을 보여 줍니다.
