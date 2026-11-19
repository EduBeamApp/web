---
title: 라멘
description: "기둥, 강절점인 모서리, 중앙 힌지로 이루어진 3힌지 라멘을 푸는 완전한 @edubeam/fem 프로그램과, 그 결과를 손 계산으로 검증하는 방법입니다."
order: 13
source: site
---

# 라멘 {#frames}

라멘은 보와 기둥을 모서리에서 강접합한 구조물입니다. 이 예제는 [튜토리얼: 3힌지 라멘](/ko/tutorials/three-hinged-frame)의 라멘을 코드로 만듭니다. A와 E에서 힌지 지점으로 받친 4 m 기둥 두 개, C에 힌지가 있는 8 m 보, 그리고 보에 작용하는 10 kN/m로 이루어집니다. 튜토리얼에서는 절점 번호가 1–5이지만, 여기서는 A–E입니다.

::model-figure{caption="아래 프로그램의 라멘: A와 E에 힌지 지점, C에 힌지, 10 kN/m"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, k: 1e32 }) // IPE 300

// z는 아래쪽: 높이 4 m 기둥의 상단은 z = -4
const pin = [DofID.Dx, DofID.Dz]
domain.createNode('A', [0, 0, 0], pin)
domain.createNode('B', [0, 0, -4])
domain.createNode('C', [4, 0, -4]) // 중앙 힌지
domain.createNode('D', [8, 0, -4])
domain.createNode('E', [8, 0, 0], pin)

const column = domain.createBeam2D(1, ['A', 'B'], 1, 1) // 아래에서 위로
const left = domain.createBeam2D(2, ['B', 'C'], 1, 1, [false, true]) // C에 힌지
domain.createBeam2D(3, ['C', 'D'], 1, 1)
domain.createBeam2D(4, ['D', 'E'], 1, 1)

const lc = solver.loadCases[0]
for (const half of [2, 3]) {
  lc.createBeamElementUniformEdgeLoad(half, [0, 10e3], false)
}
solver.solve()

// getReactions는 mathjs Matrix 또는 배열을 반환하므로 배열로 맞춤
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()
const kN = (v: number) => (v / 1e3).toFixed(2)

for (const label of ['A', 'E']) {
  const [rx, rz] = list(domain.getNode(label).getReactions(lc).values)
  console.log(`${label}: Rx = ${kN(rx)} kN, Rz = ${kN(rz)} kN`)
}
for (const x of [0, 2, 4]) {
  const m = left.computeBendingMomentAt(lc, x)
  console.log(`M at ${x} m from B = ${kN(m)} kNm`)
}
const top = column.computeBendingMomentAt(lc, 4)
console.log(`M at the top of column 1 = ${kN(top)} kNm`)
```

```text [출력]
A: Rx = 20.00 kN, Rz = -40.00 kN
E: Rx = -20.00 kN, Rz = -40.00 kN
M at 0 m from B = -80.00 kNm
M at 2 m from B = -20.00 kNm
M at 4 m from B = 0.00 kNm
M at the top of column 1 = -80.00 kNm
```

## 손 계산으로 검증 {#check-it-by-hand}

| 물리량 | 손 계산 | 솔버 |
| --- | --- | --- |
| 연직 반력 | $q \cdot 8/2 = 40$ kN, 위쪽 | A와 E에서 $R_z = -40$ kN |
| 수평 반력 | 왼쪽 절반에서 $M_C = 0$: $(40 \cdot 4 - 10 \cdot 4 \cdot 2)/4 = 20$ kN, 안쪽 | A에서 $R_x = +20$ kN, E에서 $-20$ kN |
| 모서리 모멘트 | $-20 \cdot 4 = -80$ kNm | 보와 기둥 모두 $-80$ kNm |
| B에서 2 m 위치의 모멘트 | $-80 + 40 \cdot 2 - 10 \cdot 2^2/2 = -20$ kNm | $-20$ kNm |
| 힌지의 모멘트 | 0 | 0 |

## 살펴볼 점 {#things-to-notice}

- **기둥은 위로 올라가므로 z가 음수입니다.** 기둥 상단은 $z = -4$에 있습니다.
- **기둥의 국부 좌표축.** 부재 1은 A에서 B로 올라가므로, 국부 z는 오른쪽, 즉 라멘 안쪽을 향합니다. 상단의 모멘트는 모서리에서의 보 모멘트와 같은 −80 kNm로, 바깥쪽이 인장입니다. 기둥을 B에서 A로 내려가게 정의하면 국부 z가 왼쪽을 향하므로 모멘트의 부호가 바뀌고, `x`는 상단에서부터 잽니다. [부재 방향](/ko/solver/conventions#member-direction)을 참고하세요.
- **힌지 하나는 부재 끝 하나에.** 힌지는 C에 있는 부재 2의 끝에 있고, 부재 3은 C에서 강접합으로 시작합니다. 해제된 끝이 하나만 있어도 C는 힌지가 됩니다.
- **보에 전체 좌표계로 가한 하중.** `false`를 주면 하중이 전체 좌표계 기준이 되어, 부재의 기울기와 관계없이 연직으로 작용합니다. 왼쪽에서 오른쪽으로 그린 수평 보에서는 국부 좌표계와 같습니다.

## 부정정 라멘 {#statically-indeterminate-frames}

힌지를 없애 `[false, false]`로 하면 1차 부정정인 문형 라멘이 됩니다. 이때 부재력은 기둥에 대한 보의 상대 강성에 따라 달라집니다. 부재마다 단면을 다르게 주면 확인할 수 있습니다. 튜토리얼의 [실험해 보기](/ko/tutorials/three-hinged-frame#_7-experiment)에서는 기둥 하단을 고정하고 라멘을 옆에서 밀어 보며, 비교할 숫자도 함께 제시합니다. @edubeam/plot의 [슬라이드와 강의 노트](/ko/plot/slides) 페이지는 이런 문형 라멘을 단계별로 그립니다.
