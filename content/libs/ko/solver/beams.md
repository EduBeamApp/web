---
title: 보
description: "캔틸레버와 2경간 연속보를 푸는 완전한 @edubeam/fem 프로그램과 그 출력을, 각각 교과서 공식과 비교해 검증합니다."
order: 12
group: 예제 프로그램
source: site
---

# 보 {#beams}

그대로 복사해서 고쳐 쓸 수 있는 완전한 프로그램 두 개입니다. 둘 다 전단 변형을 무시하는 단면(`k: 1e32`)을 쓰므로, 숫자가 Euler–Bernoulli 공식과 정확히 일치합니다. [설치](/ko/solver/getting-started#install)에서처럼 준비한 폴더에서 `node cantilever.ts`(Node 22.18 이상)로 실행하세요.

## 캔틸레버 {#a-cantilever}

길이 4 m, A에서 고정되어 있고 자유단에 아래로 18 kN이 작용합니다.

```ts [cantilever.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // 고정단
const tip = domain.createNode('B', [4, 0, 0]) // 자유단
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
lc.createNodalLoad('B', { [DofID.Dz]: 18e3 }) // 자유단에 아래로 18 kN
solver.solve()

console.log(beam.computeBendingMomentAt(lc, 0)) // 고정단의 휨모멘트, N·m
console.log(tip.getUnknowns(lc, [DofID.Dz])) // 자유단의 처짐, m
```

```text [출력]
-72000
0.09411072715241528
```

$M_A = -FL = -72$ kNm로 부모멘트이고, 자유단의 처짐은 $EI = 4.0803$ MNm²일 때 $FL^3/3EI = 94.11$ mm입니다. 같은 캔틸레버가 EduBeam 앱의 예제에도 있습니다.

## 연속보 {#a-continuous-beam}

지점 세 개 위에 놓인 5 m 경간 두 개에 모두 10 kN/m가 작용합니다. 반력, 중간 지점 위의 모멘트, 경간의 최대 모멘트를 구합니다.

```ts [continuous.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [5, 0, 0], [DofID.Dz])
domain.createNode('C', [10, 0, 0], [DofID.Dz])
const span1 = domain.createBeam2D(1, ['A', 'B'], 1, 1)
domain.createBeam2D(2, ['B', 'C'], 1, 1)

const lc = solver.loadCases[0]
for (const span of [1, 2]) {
  lc.createBeamElementUniformEdgeLoad(span, [0, 10e3], true)
}
solver.solve()

// getReactions는 mathjs Matrix 또는 배열을 반환하므로 배열로 맞춤
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

for (const label of ['A', 'B', 'C']) {
  const { dofs, values } = domain.getNode(label).getReactions(lc)
  const rz = list(values)[dofs.indexOf(DofID.Dz)]
  console.log(`R${label} = ${(-rz / 1e3).toFixed(2)} kN up`)
}
const mB = span1.computeBendingMomentAt(lc, 5)
console.log(`MB = ${(mB / 1e3).toFixed(2)} kNm`)

// 경간 1의 최대 정모멘트, 부재를 따라 501개 점에서 구함
const { x, M } = span1.computeBendingMoment(lc, 500)
const i = M.indexOf(Math.max(...M))
console.log(`max M = ${(M[i] / 1e3).toFixed(2)} kNm at x = ${x[i]} m`)
```

```text [출력]
RA = 18.75 kN up
RB = 62.50 kN up
RC = 18.75 kN up
MB = -31.25 kNm
max M = 17.58 kNm at x = 1.87 m
```

경간이 같은 2경간 연속보의 교과서 값은 $R_A = R_C = 0.375\,qL$, $R_B = 1.25\,qL$, $M_B = -qL^2/8$이고, 경간의 최대 모멘트는 $x = R_A/q = 1.875$ m에서 $R_A^2/2q = 17.58$ kNm입니다. 샘플링으로는 계산 점 1.87 m에서 최대가 나오며, 참값과의 차이는 0.0002 kNm 이내입니다.

::model-figure{caption="10 kN/m를 받는 5 m 경간 두 개"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels]
---
::

그림은 IPE 200이 아니라 앱 예제의 단면을 씁니다. 연속보 전체에 단면이 하나뿐이면 부재력은 강성에 영향을 받지 않으므로, 다이어그램의 숫자는 같고 처짐만 다릅니다.

## 바꿔 보기 {#change-it}

- **경간이나 하중이 다를 때:** C의 좌표나 하중 목록을 바꿉니다. 한 경간에만 하중을 가하면 익숙한 패턴 하중 배치가 됩니다.
- **3경간:** 절점 D와 부재 `['C', 'D']`를 추가합니다.
- **고정단:** A에 `[DofID.Dx, DofID.Dz, DofID.Ry]`를 줍니다.
- **실제 전단 변형:** 직사각형 단면이라면 `k: 5 / 6`, 아니면 해당 단면의 전단 보정계수를 줍니다.
- **그림으로 그리기:** 솔버를 [@edubeam/plot](/ko/solver/drawing)에 넘깁니다.

[튜토리얼: 연속보와 지점 침하](/ko/tutorials/continuous-beam)에서는 이런 보를 EduBeam 앱에서 만들고, [손 계산으로 결과 검증](/ko/guide/verification) 페이지에는 공식이 딸린 교과서 예제가 더 있습니다.
