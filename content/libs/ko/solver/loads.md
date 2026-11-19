---
title: 절점하중 및 부재하중
description: "@edubeam/fem에서 절점에 힘과 모멘트를, 부재에 등분포·사다리꼴 분포·집중하중을 전체 또는 국부 좌표계로 가하고, 이를 바꾸거나 지우는 방법입니다."
order: 6
group: 하중
source: site
---

# 절점하중 및 부재하중 {#nodal-and-member-loads}

하중은 하중조건에 속합니다. 솔버에는 처음부터 하중조건 `solver.loadCases[0]`이 하나 있고, 이 하중조건의 `create…` 메서드는 하중을 하나 추가하고 그 하중을 반환합니다. 하중조건을 여러 개 쓰고 조합하는 방법은 [하중조건](/ko/solver/load-cases)을 참고하세요.

값의 단위는 N, N/m, N·m이고 [좌표축](/ko/solver/conventions#axes)을 따릅니다. +z는 아래쪽이고, 양의 모멘트는 반시계 방향입니다.

## 모든 종류의 하중을 받는 보 {#a-beam-with-every-kind}

힌지 지점과 롤러 지점으로 받친 8 m 보에 4 kN/m에서 10 kN/m로 커지는 분포하중, 20 kN의 집중하중, 10 kNm의 집중모멘트, 그리고 롤러 지점에 수평력을 가합니다.

```ts [loads.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // 힌지 지점
domain.createNode('B', [8, 0, 0], [DofID.Dz]) // 롤러 지점
domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
// A에서 4 kN/m, B에서 10 kN/m로 커지는 하중, 아래 방향
lc.createBeamElementTrapezoidalEdgeLoad(1, [0, 4e3], [0, 10e3], false)
// [fx, fz, my, a]: 아래로 20 kN, A에서 2 m
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], false)
// 반시계 방향 10 kNm 집중모멘트, A에서 6 m
lc.createBeamConcentratedLoad(1, [0, 0, 10e3, 6], false)
// B에 오른쪽으로 5 kN
lc.createNodalLoad('B', { [DofID.Dx]: 5e3 })
solver.solve()

// getReactions는 mathjs Matrix 또는 배열을 반환하므로 배열로 맞춤
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

console.log(list(domain.getNode('A').getReactions(lc).values))
console.log(list(domain.getNode('B').getReactions(lc).values))
```

```text [출력]
[ -5000, -40250 ]
[ -35750 ]
```

손 계산으로 확인해 봅니다. 분포하중의 합력은 56 kN이고 A에서 4.571 m 위치에 작용합니다. A에 대한 모멘트 평형에서 $8R_B = 56 \cdot 4.571 + 20 \cdot 2 - 10 = 286$이므로 $R_B = 35.75$ kN(위쪽), $R_A = 76 - 35.75 = 40.25$ kN(위쪽)입니다. 힌지 지점은 5 kN의 수평력도 받으므로, 보 전체에 5 kN의 인장이 생깁니다.

::model-figure{caption="같은 하중. 그림에서는 집중모멘트를 6 m 위치의 절점 C에 가했으며, 결과는 같습니다."}
---
nodes: { A: [0, 0], C: [6, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: [4, 8.5] }
  - { member: 2, qz: [8.5, 10] }
  - { member: 1, pz: 20, at: 2 }
  - { node: C, my: 10 }
  - { node: B, fx: 5 }
results: [M]
show: [nodeLabels]
labels: horizontal
---
::

## 절점하중 {#nodal-loads}

```ts
lc.createNodalLoad(node, { [DofID.Dx]: fx, [DofID.Dz]: fz, [DofID.Ry]: my }, lcs)
```

필요한 성분만 주면 됩니다. 값은 전체 좌표계 기준이고, `lcs`를 `true`로 하면 [`updateLcs`](/ko/solver/nodes-supports#inclined-supports)로 돌린 절점 자신의 좌표축 기준입니다. 지점이 구속한 자유도에 가한 힘은 그대로 반력으로 들어가며, 부재를 휘게 하지 않습니다.

## 부재하중 {#member-loads}

| 메서드 | 값 | 하중 |
| --- | --- | --- |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | N/m | 부재 전체에 등분포 |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | N/m | 첫 번째 절점에서 두 번째 절점까지 선형 변화 |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | N, N·m, m | 첫 번째 절점에서 `a` m 떨어진 위치의 힘과 집중모멘트 |

분포하중은 항상 부재 전체에 작용합니다. 경간 일부에만 작용하는 하중은 하중이 시작하는 곳에 절점을 두어 부재를 나누세요. 절점을 추가해도 결과는 달라지지 않습니다. 집중하중과 집중모멘트는 부재 위 어디에나 둘 수 있습니다.

### 전체 좌표계와 국부 좌표계 {#global-or-local-axes}

마지막 인수 `lcs`는 성분을 어느 좌표축 기준으로 줄지 정합니다.

- `false`: 전체 좌표계의 x와 z. `fz`는 부재의 기울기와 관계없이 연직 방향으로 작용합니다.
- `true`: 부재의 국부 x(부재 축 방향)와 국부 z(부재에 수직). `fz`는 부재에 수직으로 작용합니다.

왼쪽에서 오른쪽으로 그린 수평 부재에서는 둘이 같습니다. 오른쪽에서 왼쪽으로 그렸다면 국부 `fz`는 위쪽을 향합니다.

::callout{type="info" title="분포하중은 부재 길이 1 m당 값입니다"}
두 경우 모두 부재 자체의 길이 1 m당 작용합니다. 수평 거리 4 m에 걸친 길이 5 m의 서까래에 전체 좌표계로 `[0, 10e3]`을 주면 합계 50 kN이 됩니다. 수평 투영 길이 1 m당 10 kN/m인 적설하중은 서까래를 따라 $10 \cdot 4/5 = 8$ kN/m이므로 `[0, 8e3]`을 주세요.
::

## 하중 바꾸기와 지우기 {#change-or-remove-a-load}

`create…` 메서드는 모두 하중을 반환합니다. 그 값을 바꾸고 다시 풀면 됩니다.

```ts
const q = lc.createBeamElementUniformEdgeLoad(1, [0, 10e3], true)
solver.solve()
q.values = [0, 20e3] // 하중을 두 배로
solver.solve()
```

하중은 평범한 배열인 `lc.nodalLoadList`와 `lc.elementLoadList`(부재하중과 온도하중)에 들어 있으므로, `lc.elementLoadList.splice(index, 1)`로 하나를 지울 수 있습니다. 각 하중의 속성 이름은 [API 레퍼런스](/ko/solver/reference#loads)에 있습니다.

온도 변화와 지점 침하도 하중입니다. [온도하중 및 지점 침하](/ko/solver/temperature-settlements)를 참고하세요.
