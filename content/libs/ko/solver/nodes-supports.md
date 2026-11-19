---
title: 절점 및 지점
description: "@edubeam/fem 모델의 절점을 만들고, 자유도를 구속해 지점을 정의하고, 경사 롤러를 위해 지점의 좌표축을 돌리고, 해석 후에 절점을 바꾸는 방법입니다."
order: 3
group: 모델링
source: site
---

# 절점 및 지점 {#nodes-and-supports}

절점은 부재가 연결되는 점입니다. 지점은 별도의 객체가 아니라, 절점이 구속하는 자유도의 목록입니다. 이 페이지의 코드 조각은 [빠른 시작](/ko/solver/getting-started)과 같은 프로그램의 일부이며, 그 프로그램의 `solver`, `domain`, `lc`를 사용합니다.

## 절점 만들기 {#create-a-node}

```ts
domain.createNode(label, [x, y, z], bcs)
```

| 인수 | 타입 | 의미 |
| --- | --- | --- |
| `label` | `string \| number` | 절점의 이름. 문자열로 저장되므로 `1`과 `'1'`은 같은 절점 |
| `coords` | `number[]` | `[x, y, z]`(m), `y = 0`. z는 아래쪽. |
| `bcs` | `DofID[]` | 지점이 구속하는 자유도. 생략하면 자유 절점. |

반환값은 `Node`이며, `domain.getNode(label)`로 다시 찾을 수 있습니다. 이미 쓰고 있는 레이블로 만들면 기존 절점을 대체합니다.

```ts
import { DofID } from '@edubeam/fem'

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [0, 0, -4]) // 자유 절점: 높이 4 m 기둥의 상단
```

## 지점 {#supports}

EduBeam 앱의 지점은 각각 구속된 자유도의 조합입니다.

| 지점 | `bcs` | 구속 |
| --- | --- | --- |
| 고정단 | `[DofID.Dx, DofID.Dz, DofID.Ry]` | 모두 |
| 힌지 | `[DofID.Dx, DofID.Dz]` | 두 방향 변위, 회전은 자유 |
| 롤러 | `[DofID.Dz]` | 수직 변위, x 방향으로 이동 |
| 수직 롤러 | `[DofID.Dx]` | 수평 변위, z 방향으로 이동 |
| 슬라이더 | `[DofID.Dz, DofID.Ry]` | 수직 변위와 회전, x 방향으로 미끄러짐 |
| 수직 슬라이더 | `[DofID.Dx, DofID.Ry]` | 수평 변위와 회전, z 방향으로 미끄러짐 |
| 회전만 구속 | `[DofID.Ry]` | 회전 |

자유도를 나열한 순서가 곧 [반력](/ko/solver/results#reactions)이 반환되는 순서입니다. 구조물에는 구속된 자유도가 3개 이상 필요하고, 그 배치가 구조물을 메커니즘으로 움직이지 못하게 해야 합니다. [해석이 실패할 때](/ko/solver/solving#when-solving-fails)를 참고하세요.

구속된 자유도를 정해진 양만큼 움직일 수도 있습니다. 이것이 지점 침하입니다. [강제변위](/ko/solver/temperature-settlements#prescribed-displacements)를 참고하세요.

## 경사 지점 {#inclined-supports}

경사면 위의 롤러 지점은 절점을 연직 방향이 아니라 경사면에 수직인 방향으로 구속합니다. `updateLcs`로 절점의 좌표축을 돌리면, 그 절점의 `bcs`는 돌린 좌표축을 기준으로 합니다. 빠른 시작의 프로그램에서 B를 다음과 같이 만들어 봅니다.

```ts
const b = domain.createNode('B', [6, 0, 0], [DofID.Dz]) // 자신의 z 방향을 구속
const a = (30 * Math.PI) / 180 // 30°, x에서 z 쪽으로: 화면에서 시계 방향
b.updateLcs({ locx: [Math.cos(a), 0, Math.sin(a)], locy: [0, 1, 0] })
```

`locx`는 절점 자신의 x축을 전체 좌표계 성분으로 나타낸 벡터이고, `locy`는 y축으로 `[0, 1, 0]` 그대로 둡니다. EduBeam 앱에서는 같은 각도를 *절점 좌표계 각도*에 30°로 입력합니다.

`solve()` 후 B는 경사면에 수직으로 밀고, A의 힌지 지점이 수평 성분을 받습니다.

```ts
b.getReactions(lc).values // [-41569]: B 자신의 z 방향, N. 36 kN / cos 30°
b.getReactions(lc, true).values // [20785, -36000, 0]: x 방향, z 방향, 모멘트
```

::model-figure{caption="30° 돌린 롤러 지점: 반력은 경사면에 수직이고 보에는 인장이 생김"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, N]
show: [nodeLabels]
---
::

연직 성분은 그대로 $qL/2 = 36$ kN이고, 수평 성분 $36 \tan 30° = 20.8$ kN이 보를 양 끝에서 잡아당깁니다. 모멘트는 변하지 않습니다.

좌표축을 돌린 절점에서는 `true`를 넘겨 전체 좌표계를 요청하지 않는 한, 변위와 반력이 절점 자신의 좌표축 기준입니다. 반면 그 절점에 가하는 절점하중은 따로 지정하지 않으면 전체 좌표계 기준입니다. [절점하중](/ko/solver/loads#nodal-loads)을 참고하세요. 인수 없이 `node.updateLcs()`를 호출하면 좌표축이 원래대로 돌아갑니다.

## 절점 바꾸기 {#change-a-node}

절점은 평범한 객체입니다. `node.coords`를 바꾸면 절점이 옮겨지고, `Set<DofID>`인 `node.bcs`를 새로 대입하면 지점이 바뀝니다.

```ts
domain.getNode('B').coords = [8, 0, 0] // 경간이 길어짐: solve()만 다시 하면 됨
domain.getNode('A').bcs = new Set(fixed) // 새 지점: 먼저 번호를 다시 매김
solver.codeNumberGenerated = false
solver.solve()
```

지점을 바꾸거나 절점을 추가·삭제하면 방정식이 달라집니다. `codeNumberGenerated = false` 없이 풀면 솔버는 **아무 경고 없이 이전 지점 조건으로** 계산합니다. 어떤 변경에 이 설정이 필요한지는 [변경 후 다시 풀기](/ko/solver/solving#solving-again-after-a-change)에 정리되어 있습니다.
