---
title: 온도하중 및 지점 침하
description: "@edubeam/fem에서 부재에 균일한 온도 변화와 온도차를 가하고, 강제변위로 지점을 움직이는 방법을 검증된 예제와 함께 설명합니다."
order: 7
source: site
---

# 온도하중 및 지점 침하 {#temperature-and-settlements}

힘이 아닌 하중이 두 가지 있습니다. 길이나 곡률을 바꾸려는 부재와, 움직이는 지점입니다. 둘 다 구조물이 그 변형을 막는 곳에서만 부재력을 만들기 때문에, 부정정 구조물의 예제로 알맞습니다. 두 하중의 이론은 앱 이론 매뉴얼의 [요소하중](/ko/elements/beam#element-loads)에 있습니다.

## 온도 {#temperature}

```ts
lc.createBeamTemperatureLoad(member, [dTc, dTb, dTt])
```

| 값 | 의미 | 자유로운 부재에 미치는 효과 |
| --- | --- | --- |
| `dTc` | 도심의 온도 변화, K | $\alpha\,\Delta T_c\,L$만큼 늘어남 |
| `dTb` | 하연(국부 +z 쪽)의 온도 변화, K | `dTt`와 함께 곡률 $\kappa = \alpha\,(\Delta T_b - \Delta T_t)/h$로 휨 |
| `dTt` | 상연의 온도 변화, K | |

부재를 휘게 하는 것은 차이 `dTb - dTt`뿐이므로, `[30, 20, 0]`과 `[30, 10, -10]`은 같은 하중입니다. 재료의 `alpha`와 단면의 `h`가 필요하며, `h`가 없으면 모멘트가 `NaN`이 됩니다.

양단 고정보는 늘어날 수도 휠 수도 없으므로, 대신 압축되고 휩니다. $N = -EA\,\alpha\,\Delta T_c$, $M = -EI\,\alpha\,(\Delta T_b - \Delta T_t)/h$입니다.

```ts [temperature.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial(1, { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [6, 0, 0], fixed)
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

// 도심은 30 K 상승, 하연이 상연보다 20 K 더 따뜻함
lc.createBeamTemperatureLoad(1, [30, 20, 0])
solver.solve()

beam.computeNormalForceAt(lc, 3) // -215460 N: EA · 12e-6 · 30
beam.computeBendingMomentAt(lc, 3) // -4896.4 N·m: EI · 12e-6 · 20 / 0.2
```

IPE 200에서 $EA = 598.5$ MN, $EI = 4.0803$ MNm²입니다. 하연이 더 따뜻하면 자유로운 보는 양 끝이 위로 들리며 휘려 하므로, 구속이 반대 방향으로 휘게 합니다. 그 결과 상연이 인장인 부모멘트가 생깁니다.

::model-figure{caption="양단 고정보: 도심 온도 30 K 상승, 하연이 상연보다 20 K 더 따뜻함"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 30, bottom: 20, top: 0 } }
results: [M, N]
show: [nodeLabels]
material: { e: 210e9, alpha: 12e-6 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

단순보에서는 같은 하중이 부재력을 전혀 만들지 않고 변위만 생깁니다. 롤러 지점이 $\alpha\,\Delta T_c\,L = 2.16$ mm만큼 밀려나고, 경간 중앙은 $\kappa L^2/8 = 5.4$ mm 처집니다.

## 강제변위 {#prescribed-displacements}

```ts
lc.createPrescribedDisplacement(node, { [DofID.Dz]: 0.01 })
```

지점을 정해진 양만큼 움직입니다. `Dx`와 `Dz`는 미터, `Ry`는 라디안 단위이며, 절점 자신의 좌표축 기준입니다. 이 자유도는 그 절점의 지점이 구속하는 자유도여야 합니다. 구속되지 않은 자유도에 준 값은 경고 없이 무시됩니다.

일단 고정 타단 롤러 보의 롤러 지점이 10 mm 침하하는 경우입니다. 새 솔버에 온도하중 예제와 같은 재료와 단면을 씁니다.

```ts
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // 고정단
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // 롤러 지점
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

lc.createPrescribedDisplacement('B', { [DofID.Dz]: 0.01 }) // 아래로 10 mm
solver.solve()

domain.getNode('B').getReactions(lc).values // [566.7] N: 3EIw/L³
beam.computeBendingMomentAt(lc, 0) // -3400.2 N·m, A에서: 3EIw/L²
```

롤러 지점은 보를 아래로 끌어내려 따라오게 해야 하므로, 반력은 +z 방향, 즉 양수입니다. $3EIw/L^3 = 3 \cdot 4.0803 \times 10^6 \cdot 0.01 / 216 = 566.7$ N입니다.

::model-figure{caption="고정–롤러 보의 롤러 지점이 10 mm 침하: 고정단에 −3.4 kNm"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

앱에서 두 하중을 어떻게 그리는지는 [하중](/ko/essentials/loads)에 있습니다.
