---
description: "EduBeam에서 힘, 모멘트, 지점 침하, 등분포·사다리꼴·집중·온도하중을 가하는 방법과 각 하중의 부호 규약: z는 아래가 양, 모멘트는 반시계 방향이 양."
source: site
---

# 하중

하중은 절점에 작용하거나 요소를 따라 작용합니다. 모든 하중은 **하나의 하중조건**에 속하며 함께 작용합니다. 여러 경우를 비교하려면 각 경우를 [프로젝트 파일이나 공유 링크](/ko/essentials/import-export)로 저장하세요.

| 하중 | 작용 대상 | 추가하는 곳 |
| --- | --- | --- |
| [힘 또는 모멘트](#nodal-loads) | 절점 | *하중* 탭 → **절점하중 추가**, 또는 절점을 클릭 → **하중 추가** |
| [강제변위](#prescribed-displacements-support-settlements)(지점 침하) | 지점이 있는 절점 | 같은 대화 상자, 또는 절점을 클릭 → **강제변위 지정** |
| [등분포하중](#uniformly-distributed-load), [사다리꼴 분포하중](#trapezoidal-load), [집중하중](#concentrated-load), [온도하중](#temperature-load) | 요소 | *하중* 탭 → **요소하중 추가**, 또는 요소를 클릭 → **하중 추가** |

## 부호 규약 {#sign-convention-in-one-line}

x는 **오른쪽**, z는 **아래쪽**을 향하고, 모멘트는 **반시계 방향**이 양입니다. 따라서 양의 `Fz`나 `fz`는 중력처럼 아래로 향하는 하중이고, 위로 향하는 하중은 음수입니다.

::model-figure{caption="여기 있는 하중은 모두 양수: Fx = +10 kN 오른쪽, Fz = +10 kN 아래쪽, My = +10 kNm 반시계 방향"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0] }
supports: { A: pin, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: A, fx: 10 }
  - { node: B, fz: 10 }
  - { node: C, my: 10 }
results: []
---
::

| 양의 방향 | 기본 좌표축(z 아래) | [y 위 좌표축](/ko/elements/conventions#y-up-axes) |
| --- | --- | --- |
| 수평력 `Fx`, `fx` | 오른쪽 | 오른쪽 |
| 연직력 | `Fz`, `fz`: **아래** | `Fy`, `fy`: **위** |
| 모멘트 | `My`: 반시계 방향 | `Mz`: 반시계 방향 |
| 연직 지점 침하 | `Dz`: 아래 | `Dy`: 위 |

요소의 **국부 좌표계**로 준 하중(LCS 체크)은 요소를 따릅니다. 국부 x축은 시작 절점에서 끝 절점으로 향하고, 국부 z축은 국부 x축을 시계 방향으로 90° 돌린 방향, 즉 요소를 따라 그려진 점선 쪽입니다. [요소 방향](/ko/essentials/elements#element-direction)을 참고하세요. 부재력을 포함한 전체 부호 규약은 [좌표계 및 부호 규약](/ko/elements/conventions#loads)에 있습니다.

## 절점하중 {#nodal-loads}

*하중* 탭 → **절점하중 추가**, 또는 절점을 클릭 → **하중 추가**를 누르고 **힘/모멘트**가 선택된 상태로 둡니다. 힘 `Fx`, `Fz`(kN)와 모멘트 `My`(kNm)를 [위](#sign-convention-in-one-line)의 부호대로 입력합니다. 입력하는 동안 미리보기가 하중을 그려 줍니다.

![절점하중 추가: 입력하는 동안 미리보기에 방향이 표시됩니다](/screenshots/ko/loads-nodal.webp){.shot-md}

- 성분은 **전체** 좌표계 기준입니다. 축이 회전된 절점([경사 지점](/ko/essentials/nodes-supports#inclined-skewed-supports))에서는 대화 상자에 **전체 좌표축** / **절점 좌표축** 전환이 추가됩니다. 절점 좌표축에서는 `Fx′`, `Fz′`로 표시되는 성분이 절점 자체의 축 방향으로 작용하고, 나중에 각도가 바뀌면 함께 회전합니다. 전환하면 하중이 그 자리에 그대로 있도록 값이 다시 계산됩니다.
- 한 절점에 절점하중을 여러 개 가할 수 있으며, 하중은 합산됩니다.

### 강제변위(지점 침하) {#prescribed-displacements-support-settlements}

지점을 주어진 양만큼 움직이려면 같은 대화 상자에서 **강제변위**를 고르거나, 지점이 있는 절점을 클릭 → **강제변위 지정**을 누릅니다. 변위 `Dx`, `Dz`(오른쪽과 아래가 양, [변위 단위](/ko/essentials/units-settings#units)로, 기본 m)와 회전각 `Ry`(rad, 반시계 방향이 양)를 입력합니다.

- **구속된** 자유도에만 값을 지정할 수 있습니다. 나머지 입력란은 회색으로 비활성화되고, 지점이 없는 절점에는 지점 침하를 줄 수 없습니다.
- 한 절점에는 강제변위가 최대 하나입니다. 바꾸려면 두 번째를 추가하지 말고 기존 것을 편집하세요.
- 경사 지점에서는 입력란이 `Dx′`, `Dz′`로 표시됩니다. 지점 침하는 지점 자체의 축 방향으로 작용합니다.

지점 침하로 부재력이 생기는지는 구조물에 따라 다릅니다. 다음은 다른 하중 없이 지점 B만 똑같이 10 mm 침하시킨 두 경우입니다.

::div{.shots}

:::model-figure{caption="단순보: 보가 기울기만 하며 반력 없음, M = 0"}
---
nodes: { A: [0, 0], B: [5, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

:::model-figure{caption="B에서 연속인 보: 보가 휘며 B 위에서 M = 21.06 kNm"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

::

정정 구조물은 아무 저항 없이 지점을 따라 움직이지만, 연속보는 휠 수밖에 없습니다. 지점 B가 보를 $\delta = 10\ \text{mm}$만큼 끌어내리는데, 이는 경간 10 m 단순보의 중앙에 집중하중을 가한 것과 같습니다. $L = 5\ \text{m}$이고 예제 강재 보의 $EI = 17{,}548\ \text{kNm}^2$이면 그 하중, 즉 B의 반력은 $P = 6EI\delta/L^3 = 8.423\ \text{kN}$이고, $M_B = PL/2 = 3EI\delta/L^2 = 21.06\ \text{kNm}$입니다. [연속보 튜토리얼](/ko/tutorials/continuous-beam)에서는 지점 침하와 하중을 함께 다룹니다.

## 요소하중 {#element-loads}

*하중* 탭 → **요소하중 추가**, 또는 요소를 클릭 → **하중 추가**. **하중 유형**을 고르면 입력하는 동안 미리보기가 요소 위의 하중을 보여 줍니다. 힘은 kN, 선하중은 kN/m 단위이며, 다른 [단위](/ko/essentials/units-settings#units)를 골랐다면 그 단위를 따릅니다.

![요소하중 추가, 등분포하중](/screenshots/ko/loads-udl.webp){.shot-md}

### 등분포하중 {#uniformly-distributed-load}

요소 전체에 걸쳐 단위 길이당 일정한 하중 `fx`와 `fz`입니다. **LCS**가 체크되어 있으면(기본값) 요소의 국부 좌표축 방향으로, 해제하면 전체 좌표축 방향으로 작용합니다. 왼쪽에서 오른쪽으로 그린 수평 요소에서는 둘이 같지만 경사 부재에서는 다릅니다.

| 원하는 하중 | 입력 |
| --- | --- |
| 부재에 **수직인** 하중(서까래에 작용하는 풍하중) | LCS를 **체크**하고 `fz` |
| 부재 길이 1 m당 **연직** 하중(자중) | LCS를 **해제**하고 `fz` |
| 수평 투영 길이 1 m당 **연직** 하중(적설하중) | 직접 입력할 수 없음: 부재의 경사각 $\alpha$에 대해 $\cos\alpha$를 곱해 연직 하중으로 입력 |

다음은 수평 4 m, 높이 3 m, 길이 5 m인 서까래에 같은 10 kN/m를 가한 두 경우입니다.

::div{.shots}

:::model-figure{caption="LCS 해제: 연직 방향, 합계 50 kN, M = 25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [M]
---
:::

:::model-figure{caption="LCS 체크: 부재에 수직, M = 31.25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10, local: true }
results: [M]
---
:::

::

손 계산: 수직 하중이면 $M = qL^2/8 = 10 \cdot 5^2/8 = 31.25\ \text{kNm}$입니다. 연직 하중이면 50 kN이 수평 4 m에 퍼지므로 수평 투영 길이당 12.5 kN/m이고, $M = 12.5 \cdot 4^2/8 = 25\ \text{kNm}$입니다.

### 사다리꼴 분포하중 {#trapezoidal-load}

요소를 따라 선형으로 변하는 하중입니다. **시작** 절점에서 `f1x`, `f1z`, **끝** 절점에서 `f2x`, `f2z`입니다. 한쪽 끝을 0으로 두면 삼각형 분포하중이 됩니다.

::model-figure{caption="0에서 10 kN/m까지의 삼각형 분포하중: 반력 10 kN과 20 kN, 최대 M = 23.09 kNm(3.46 m 위치)"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: [0, 10] }
results: [M, V]
show: [nodeLabels]
---
::

손 계산: 전체 하중 $qL/2 = 30\ \text{kN}$이 $2L/3$ 위치에 작용하므로 $R_A = 10\ \text{kN}$, $R_B = 20\ \text{kN}$입니다. 전단력이 0이고 모멘트가 최대인 곳은 $x = L/\sqrt{3} = 3.46\ \text{m}$이며, 그곳에서 $M = qL^2/(9\sqrt{3}) = 23.09\ \text{kNm}$입니다.

사다리꼴 분포하중은 요소의 **국부 좌표축** 방향으로 작용합니다(LCS 체크박스가 고정되어 있습니다). 왼쪽에서 오른쪽으로 그린 수평 요소에서는 전체 좌표축과 같고, 경사 요소에서는 `f1z`, `f2z`가 부재에 수직, `f1x`, `f2x`가 부재 방향입니다.

경사각 $\alpha$인 부재에 변하는 **연직** 하중을 가해도 정확하게 다룰 수 있습니다. 각 끝에서 국부 성분 두 개를 입력하면 됩니다. $f_z = q\cos\alpha$, 그리고 경사를 따라 아래로 향하는 $f_x = q\sin\alpha$입니다. 요소가 시작 절점에서 오르막으로 그려졌다면 $f_x$는 음수입니다. 위의 서까래(수평 4 m, 높이 3 m, 아래쪽에서부터 그림)에 부재 길이당 0에서 10 kN/m까지 커지는 연직 하중을 주려면 `f1x` = `f1z` = 0, `f2x` = −6, `f2z` = 8 kN/m입니다.

::model-figure{caption="부재 길이당 0에서 10 kN/m까지의 연직 하중을 국부 성분으로 입력: 반력 8.333 kN과 16.67 kN, 최대 M = 12.83 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qx: [0, -6], qz: [0, 8], local: true }
results: [M]
show: [nodeLabels]
---
::

손 계산: 합력 25 kN은 수평 거리의 3분의 2 지점, 즉 2.67 m에 작용하므로 $R_B = 25 \cdot 2.667/4 = 16.67\ \text{kN}$입니다. 수평 투영 4 m에 대해 하중은 12.5 kN/m까지 커지는 삼각형이므로, 앞의 경우와 같이 $M = 12.5 \cdot 4^2/(9\sqrt{3}) = 12.83\ \text{kNm}$입니다.

### 집중하중 {#concentrated-load}

절점을 추가하지 않고 요소를 **따라** 어디에나 가하는 집중력 `Fx`, `Fz` 또는 모멘트 `My`입니다. **시작 절점 기준 하중 위치**는 시작 절점으로부터의 거리 $a$이며 $0 \le a \le L$입니다. 초깃값은 요소 길이의 절반을 미터 단위로 내림한 값이고 최대 5 m(미국 단위에서는 피트 단위로 내림하고 최대 15 ft)이므로, 실제 하중 위치로 바꾸세요. **LCS**는 등분포하중과 같이 동작합니다.

::model-figure{caption="경간 6 m, 2 m 위치에 20 kN: V가 13.33 kN에서 −6.667 kN으로 불연속, 하중 아래에서 M = 26.67 kNm"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M]
show: [nodeLabels]
---
::

전단력도는 하중 위치에서 `Fz`만큼 불연속으로 변하고, 휨모멘트도는 그곳에서 꺾입니다. 손 계산으로는 $R_A = 20 \cdot 4/6 = 13.33\ \text{kN}$, $M = 13.33 \cdot 2 = 26.67\ \text{kNm}$입니다. 집중 모멘트 `My`를 가하면 대신 휨모멘트도가 불연속으로 변합니다.

### 온도하중 {#temperature-load}

| 항목 | 의미 | 효과 |
| --- | --- | --- |
| **ΔT<sub>c</sub>**, 축방향 온도 변화 | 단면 전체에 같은 온도 변화 | 신장량 $\alpha\,\Delta T_c\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>** | 하연 온도 변화에서 상연 온도 변화를 뺀 값 | 곡률 $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

둘 다 응력이 없는 상태로부터의 온도 *변화*이며, 기본 단위는 °C입니다. 1 °C의 변화는 1 K와 같습니다. 온도하중에는 재료의 **α**와 단면의 **높이 h**가 쓰입니다. **하연**은 점선이 있는 쪽입니다. 양의 ΔT<sub>b</sub> − ΔT<sub>t</sub>(하연이 더 따뜻함)는 하연을 늘이므로, 요소는 중력 하중을 받는 보처럼 아래로 처집니다.

정정 구조물에서 온도는 변위만 일으킵니다. 구속(고정단, 연속성, 부정정 부재)이 있으면 온도 변화가 부재력을 일으킵니다. 경간 6 m, 춤 0.3 m인 같은 강재 보에서 하연이 상연보다 20 K 따뜻한 경우입니다.

::div{.shots}

:::model-figure{caption="단순보: 경간 중앙에서 3.6 mm 처지며 M = 0"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [w, M]
---
:::

:::model-figure{caption="양단 고정보: 곧은 채로 남으며 전 길이에서 M = −14.04 kNm"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [M, w]
---
:::

::

손 계산: 구속이 없을 때의 곡률은 $\kappa = \alpha\,\Delta T/h = 12 \times 10^{-6} \cdot 20/0.3 = 8 \times 10^{-4}\ \text{1/m}$입니다. 단순보는 이 곡률대로 자유롭게 휘어 $\kappa L^2/8 = 3.6\ \text{mm}$ 처집니다. 양단이 고정되어 있으면 일정한 모멘트가 이 곡률을 없애야 하므로 $M = -EI\kappa = -17{,}548 \cdot 8 \times 10^{-4} = -14.04\ \text{kNm}$입니다. [손 계산으로 결과 검증](/ko/guide/verification#temperature-gradient-on-a-simply-supported-beam)에서 다른 예를 풀어 봅니다.

## 하중 편집과 삭제 {#editing-and-removing-loads}

| 하려는 일 | 방법 |
| --- | --- |
| 값 빠르게 바꾸기 | *하중* 탭에서 성분(과 LCS 체크박스)을 그 자리에서 편집합니다. |
| 편집 대화 상자 열기 | 뷰어에서 하중을 더블클릭하거나, 클릭 → **하중 편집**. 하중은 *절점* 표와 *요소* 표에도 칩으로 표시되며, 칩을 클릭해도 편집할 수 있습니다. |
| 삭제 | 선택하고 <kbd>Delete</kbd>를 누르거나, 클릭 → **삭제**, 또는 *하중* 탭의 ×. |

하중은 자신이 붙은 절점이나 요소에 속합니다. 절점이나 요소를 삭제하면 하중도 삭제되고, 하중을 함께 선택해 복사하면 하중도 복사됩니다.

![하중 탭: 하중마다 한 행이며 성분을 그 자리에서 편집할 수 있습니다](/screenshots/ko/loads-table.webp)

## 지원하지 않는 기능 {#what-is-not-available}

::div{.limits}
- **하중조건은 하나뿐.** 하중조합이 없습니다. 하중조건마다 파일이나 링크로 따로 저장하세요.
- **자중 없음.** LCS를 해제한 등분포하중 $f_z = \rho\,g\,A$로 입력하세요. 예를 들어 IPE 200은 $\approx 0.22\ \text{kN/m}$입니다.
- **사다리꼴 분포하중은 국부 좌표축으로만.** 경사 부재에 변하는 연직 하중은 [국부 성분](#trapezoidal-load)으로 입력하세요.
- **부분 선하중 없음.** 선하중은 요소 전체에 걸칩니다. 하중이 시작하거나 끝나는 곳에 절점을 추가하세요.
::
