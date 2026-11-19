---
title: 트러스
description: "핀 접합 워렌 트러스를 @edubeam/fem으로 풀고, 모든 부재력을 단면법으로 검증하고, 격간 수에 관계없이 트러스를 생성하는 반복문을 만듭니다."
order: 14
source: site
---

# 트러스 {#trusses}

트러스는 양 끝이 힌지인 부재로 이루어지고 하중을 절점에만 받으므로, 모든 부재는 축력만 전달합니다. 이 예제는 목록 두 개로 워렌 트러스를 만들고, 모든 부재력을 손으로 검증한 다음, 반복문으로 원하는 크기의 트러스를 생성합니다.

::model-figure{caption="워렌 트러스: 경간 9 m, 높이 1.8 m, 상현 절점마다 8 kN"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members:
  - { nodes: [A, B], hinges: [true, true] }
  - { nodes: [B, C], hinges: [true, true] }
  - { nodes: [C, D], hinges: [true, true] }
  - { nodes: [E, F], hinges: [true, true] }
  - { nodes: [F, G], hinges: [true, true] }
  - { nodes: [A, E], hinges: [true, true] }
  - { nodes: [E, B], hinges: [true, true] }
  - { nodes: [B, F], hinges: [true, true] }
  - { nodes: [F, C], hinges: [true, true] }
  - { nodes: [C, G], hinges: [true, true] }
  - { nodes: [G, D], hinges: [true, true] }
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: [N, w]
show: [nodeLabels]
---
::

```ts [truss.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })

// 워렌 트러스: 경간 9 m, 높이 1.8 m, 하현재 A-B-C-D, 상현재 E-F-G
const nodes: [string, number, number, DofID[]][] = [
  ['A', 0, 0, [DofID.Dx, DofID.Dz]],
  ['B', 3, 0, []],
  ['C', 6, 0, []],
  ['D', 9, 0, [DofID.Dz]],
  ['E', 1.5, -1.8, []],
  ['F', 4.5, -1.8, []],
  ['G', 7.5, -1.8, []],
]
for (const [label, x, z, support] of nodes) {
  domain.createNode(label, [x, 0, z], support)
}

// 레이블이 양 끝 절점의 이름. 양 끝이 힌지이므로 축력만 전달
const bars = ['AB', 'BC', 'CD', 'EF', 'FG', 'AE', 'EB', 'BF', 'FC', 'CG', 'GD']
const members = bars.map((bar) =>
  domain.createBeam2D(bar, [bar[0], bar[1]], 1, 1, [true, true])
)

const lc = solver.loadCases[0]
for (const top of ['E', 'F', 'G']) {
  lc.createNodalLoad(top, { [DofID.Dz]: 8e3 }) // 아래로 8 kN
}
solver.solve()

for (const bar of members) {
  const n = bar.computeNormalForceAt(lc, 0) / 1e3
  console.log(bar.label, n.toFixed(2), n > 0 ? 'tension' : 'compression')
}
```

```text [출력]
AB 10.00 tension
BC 16.67 tension
CD 10.00 tension
EF -13.33 compression
FG -13.33 compression
AE -15.62 compression
EB 5.21 tension
BF -5.21 compression
FC -5.21 compression
CG 5.21 tension
GD -15.62 compression
```

부재의 축력은 일정하므로 `x = 0`에서 읽으면 충분합니다. 두 글자 레이블은 그대로 양 끝 절점의 이름이 됩니다(`bar[0]`과 `bar[1]`).

## 손 계산으로 검증 {#check-it-by-hand}

두 지점은 24 kN의 절반인 12 kN씩 받습니다. 트러스를 자르고, [단면법](/ko/tutorials/truss)에서처럼 잘린 부재 맞은편의 절점에 대한 모멘트를 취합니다.

| 부재 | 단면 | 부재력 |
| --- | --- | --- |
| BC, 하현재 | F에 대한 모멘트: $(12 \cdot 4.5 - 8 \cdot 3)/1.8$ | 16.67 kN 인장 |
| EF, 상현재 | B에 대한 모멘트: $(12 \cdot 3 - 8 \cdot 1.5)/1.8$ | 13.33 kN 압축 |
| AE, 단부 사재 | 절점 A: $12 \cdot \sqrt{1.5^2 + 1.8^2}/1.8$ | 15.62 kN 압축 |
| EB, 사재 | 격간(패널)의 전단력 $12 - 8 = 4$ kN: $4 \cdot 2.343/1.8$ | 5.21 kN 인장 |

정정 트러스의 부재력은 단면에 따라 달라지지 않습니다. 단면은 절점이 얼마나 움직이는지만 정합니다. 위 그림은 다른 단면, 즉 EduBeam 앱의 단면을 쓰지만 부재력은 같습니다.

## 임의의 격간 수 {#any-number-of-panels}

연습 문제나 매개변수 연구를 위해 트러스를 생성하려면, 절점과 부재를 격간마다 반복문으로 만듭니다. `panels = 3`이면 위의 트러스가 되고 같은 부재력이 출력됩니다. `panels`, `w`, `h`를 바꾸면 다른 트러스가 됩니다.

```ts [warren.ts]
import { type Beam2D, DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })
const lc = solver.loadCases[0]

const panels = 3 // 하현재의 격간 수
const w = 3 // 격간 길이, m
const h = 1.8 // 높이, m

// 하현 절점 b0, b1, …은 힌지 지점과 롤러 지점 위에, 상현 절점 t0, t1, …은 그 사이에
for (let i = 0; i <= panels; i++) {
  const ends = i === 0 ? [DofID.Dx, DofID.Dz] : i === panels ? [DofID.Dz] : []
  domain.createNode(`b${i}`, [i * w, 0, 0], ends)
}
for (let i = 0; i < panels; i++) {
  domain.createNode(`t${i}`, [(i + 0.5) * w, 0, -h])
  lc.createNodalLoad(`t${i}`, { [DofID.Dz]: 8e3 })
}

const members: Beam2D[] = []
const bar = (a: string, b: string) =>
  members.push(domain.createBeam2D(`${a}-${b}`, [a, b], 1, 1, [true, true]))
for (let i = 0; i < panels; i++) {
  bar(`b${i}`, `b${i + 1}`) // 하현재
  bar(`b${i}`, `t${i}`) // 올라가는 사재
  bar(`t${i}`, `b${i + 1}`) // 내려가는 사재
  if (i > 0) bar(`t${i - 1}`, `t${i}`) // 상현재
}
solver.solve()

for (const m of members) {
  console.log(m.label, (m.computeNormalForceAt(lc, 0) / 1e3).toFixed(2))
}
```

솔버의 계산 시간은 크기에 따라 빠르게 늘어납니다. 격간 수십 개 정도는 문제없습니다. [모델 크기](/ko/solver/solving#model-size)를 참고하세요. 생성한 트러스를 정답과 함께 또는 정답 없이 그리려면 @edubeam/plot의 [연습 문제와 시험](/ko/plot/exercises)을 참고하세요.

## 살펴볼 점 {#things-to-notice}

- **모든 부재 끝에 힌지.** 그러면 모든 절점이 자유롭게 회전할 수 있고, 솔버가 내놓는 절점 회전각은 0입니다. 그런 절점에 모멘트를 가하면 받을 부재가 없어 [해석이 실패합니다](/ko/solver/solving#when-solving-fails).
- **하중은 절점에.** 부재 중간에 하중을 가하면 부재가 휩니다. 그러면 트러스 부재가 아니라 보가 되고, 휨모멘트도가 생깁니다.

[튜토리얼: 평면 트러스](/ko/tutorials/truss)에서는 EduBeam 앱에서 트러스를 만들고, [트러스 요소](/ko/elements/truss) 페이지에서는 트러스 부재의 강성을 유도합니다.
