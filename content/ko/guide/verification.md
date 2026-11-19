---
description: "교과서 공식으로 검증한 EduBeam: 보, 트러스, 온도하중, 지점 침하, 그리고 Timoshenko 보가 Euler–Bernoulli 보와 다른 점."
source: site
---

# 손 계산으로 결과 검증

대략이라도 직접 재현할 수 없는 숫자는 믿지 마세요. 이 페이지는 교과서의 대표적인 경우를 손으로 풀고 [EduBeam]{.edubeam}의 결과와 비교하며, 표시된 모든 자릿수가 일치합니다. 표의 값은 앱의 *결과* 탭처럼 유효숫자 다섯 자리로, 그림의 레이블은 네 자리로 반올림했습니다. 각 그림은 브라우저에서 실시간으로 해석되며, **EduBeam에서 열기**를 누르면 같은 모델이 앱에 열립니다. 앱에서는 표를 읽고, 값을 바꾸고, 결과가 어떻게 달라지는지 볼 수 있습니다.

::div{.chips}
- [단순보](#simply-supported-beam-uniform-load)
- [캔틸레버](#cantilever-tip-load)
- [양단 고정보](#fixed–fixed-beam-uniform-load)
- [일단 고정 타단 롤러 보](#propped-cantilever-uniform-load)
- [2부재 트러스](#two-bar-truss)
- [온도하중](#temperature-gradient-on-a-simply-supported-beam)
- [지점 침하](#prescribed-displacement)
- [전단 변형](#shear-deformation)
::

구조물 전체를 처음부터 끝까지 푼 예는 [3힌지 라멘](/ko/tutorials/three-hinged-frame)과 [평면 트러스](/ko/tutorials/truss) 튜토리얼에 있습니다. 손으로 풀어 볼 새 문제가 필요하면 입력하는 대로 답을 채점해 주는 [연습 문제](/ko/practice) 페이지를 이용하세요.

## 이 페이지에서 쓰는 단면 {#the-section-used-here}

따로 언급하지 않으면 모든 경우에 앱 예제의 강재 보를 씁니다. $E = 210$ GPa, $I_y = 8356$ cm⁴(IPE 300)이므로

$$
EI = 210 \times 10^9 \cdot 8.356 \times 10^{-5} = 17{,}547.6\ \text{kNm}^2
$$

입니다. 단면적($A = 1$ m²)과 전단 보정계수($k = 10^{32}$)를 아주 크게 잡았으므로 축방향 변형과 전단 변형이 사라지고, 결과는 교과서의 Euler–Bernoulli 공식과 정확히 일치합니다.

::callout{type="info" title="EduBeam의 보는 Timoshenko 보입니다"}
단면 라이브러리의 단면처럼 실제 단면을 쓰면 부재가 전단으로도 변형합니다. 그러면 처짐이 Euler–Bernoulli 공식보다 조금 크게 나오고, 부정정 구조물에서는 부재력도 조금 달라집니다. 얼마나 달라지는지, 그리고 전단 변형을 어떻게 끄는지는 이 페이지 끝의 [전단 변형](#shear-deformation)에서 설명합니다.
::

*결과* 탭의 변위와 회전각은 [전체 좌표축](/ko/elements/conventions#global-axes)을 따릅니다. 양의 D<sub>z</sub>는 아래 방향, 양의 R<sub>y</sub>는 반시계 방향이며, [설정](/ko/essentials/units-settings)에서 단위를 바꾸지 않는 한 변위는 미터 단위입니다.

## 단순보, 등분포하중 {#simply-supported-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m. A는 힌지 지점, B는 롤러 지점입니다. 경간 중앙의 절점 C에서 처짐을 읽을 수 있습니다. 부재를 절점으로 나누어도 결과는 바뀌지 않습니다.

::model-figure{caption="단순보, 12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| 물리량 | 공식 | 값 |
| --- | --- | --- |
| 반력 | $qL/2$ | 36 kN |
| 지점의 전단력 | $\pm qL/2$ | A에서 +36 kN, B에서 −36 kN |
| 경간 중앙 휨모멘트 | $qL^2/8$ | 54 kNm |
| A의 회전각 | $qL^3/(24EI)$ | 0.0061547 rad, 시계 방향 |
| C의 처짐 | $5qL^4/(384EI)$ | 11.540 mm, 아래 방향 |

EduBeam도 같은 값을 보여 줍니다. *결과* 탭에서 절점 A는 R<sub>y</sub> = −0.0061547 rad(음수: 시계 방향), 절점 C는 D<sub>z</sub> = 0.01154 m(양수: 아래 방향)입니다.

## 캔틸레버, 자유단 하중 {#cantilever-tip-load}

$L = 4$ m. A는 고정단이고, 자유단 B에 아래 방향 $F = 18$ kN이 작용합니다.

::model-figure{caption="캔틸레버, 자유단에 18 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: [M, V, w]
show: [nodeLabels]
---
::

| 물리량 | 공식 | 값 |
| --- | --- | --- |
| 연직 반력 | $F$ | 18 kN |
| 고정단 모멘트 | $FL$ | 72 kNm, 부모멘트: M = −72 kNm |
| 자유단 회전각 | $FL^2/(2EI)$ | 0.0082063 rad, 시계 방향 |
| 자유단 처짐 | $FL^3/(3EI)$ | 21.883 mm, 아래 방향 |

*결과* 탭에서 절점 B는 R<sub>y</sub> = −0.0082063 rad, D<sub>z</sub> = 0.021883 m입니다.

## 양단 고정보, 등분포하중 {#fixed–fixed-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, 양 끝 고정. 이 보는 부정정이므로 해가 강성에 따라 달라집니다. 공식은 양 끝의 회전각이 0이라는 적합 조건에서 나옵니다.

::model-figure{caption="양단 고정보, 12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| 물리량 | 공식 | 값 |
| --- | --- | --- |
| 반력 | $qL/2$ | 36 kN |
| 지점 모멘트 | $qL^2/12$ | 36 kNm, 부모멘트: M = −36 kNm |
| 경간 중앙 휨모멘트 | $qL^2/24$ | 18 kNm, 정모멘트 |
| C의 처짐 | $qL^4/(384EI)$ | 2.3080 mm, 아래 방향 |

양 끝을 고정하면 휨모멘트도가 전체적으로 $qL^2/12$만큼 위로 올라갑니다. 지점과 경간 중앙의 휨모멘트 차이는 단순보와 마찬가지로 여전히 $qL^2/8 = 54$ kNm입니다. 앱에서 단순보 모델로 시작해 두 지점을 모두 **고정단**으로 바꾸면 이 변화를 직접 볼 수 있습니다.

## 일단 고정 타단 롤러 보, 등분포하중 {#propped-cantilever-uniform-load}

$L = 6$ m, $q = 12$ kN/m. A는 고정단, B는 롤러 지점입니다.

::model-figure{caption="일단 고정 타단 롤러 보, 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| 물리량 | 공식 | 값 |
| --- | --- | --- |
| 고정단 반력 | $5qL/8$ | 45 kN |
| 롤러 반력 | $3qL/8$ | 27 kN |
| 고정단 모멘트 | $qL^2/8$ | 54 kNm, 부모멘트: M = −54 kNm |
| 최대 정모멘트 | $9qL^2/128$ | 30.375 kNm |
| … $V = 0$인 위치 | $x = 5L/8$ | A에서 3.75 m |
| B의 회전각 | $qL^3/(48EI)$ | 0.0030773 rad, 반시계 방향 |

EduBeam은 다이어그램의 모든 극값에 레이블을 붙이므로, 최대 정모멘트도 실제로 생기는 위치에 표시됩니다. 그 위치를 구하려면 전단력이 0이 되는 곳을 읽으면 됩니다. $V(x) = 45 - 12x = 0$에서 $x = 3.75$ m입니다.

## 2부재 트러스 {#two-bar-truss}

$(0, 0)$의 A와 $(4, 0)$의 B에 있는 힌지 지점에서 올라간 두 부재가 2 m 위의 꼭대기 C $(2, -2)$에서 만납니다. 두 부재 모두 양 끝이 **단부 힌지**이므로 축력만 받습니다. C에 아래 방향 연직 하중 $F = 20$ kN이 작용합니다.

::model-figure{caption="2부재 트러스, 꼭대기에 20 kN"}
---
nodes: { A: [0, 0], C: [2, -2], B: [4, 0] }
supports: { A: pin, B: pin }
members: [{ nodes: [A, C], hinges: [true, true] }, { nodes: [C, B], hinges: [true, true] }]
loads:
  - { node: C, fz: 20 }
results: [N]
show: [nodeLabels]
---
::

두 부재는 각각 45° 기울어져 있습니다. 대칭이므로 두 부재의 축력은 같고, 절점 C의 연직 방향 힘의 평형으로부터 다음 식을 얻습니다.

$$
\begin{aligned}
2N \sin 45^\circ + F &= 0 \\
N = -\frac{F}{\sqrt{2}} &= -14.142\ \text{kN}
\end{aligned}
$$

두 부재 모두 **압축**을 받습니다. 각 지점의 반력은 연직 10 kN, 수평 10 kN이며, 수평 반력은 안쪽을 향합니다. 부재가 지점을 바깥쪽으로 밀어내기 때문입니다. **N (x)** 다이어그램과 반력도 같은 결과를 보여 줍니다.

## 단순보의 온도구배 {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m, $h = 0.3$ m, $\alpha = 12 \times 10^{-6}$ 1/K. 상연은 5 K 따뜻해지고 하연은 5 K 차가워지므로 $\Delta T_b - \Delta T_t = -10$ K이고, 도심축의 온도는 변하지 않습니다($\Delta T_c = 0$). 단순보는 자유롭게 휠 수 있으므로 **부재력은 생기지 않고** 곡률만 생깁니다.

$$
\begin{aligned}
\kappa &= \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} \\
&= \frac{12 \times 10^{-6} \cdot (-10)}{0.3} = -4 \times 10^{-4}\ \text{m}^{-1}
\end{aligned}
$$

상연은 늘어나고 하연은 줄어들므로 보는 **위로** 휩니다.

::model-figure{caption="상연이 하연보다 10 K 따뜻함: 보가 부재력 없이 위로 3.2 mm 휨"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [w]
show: [nodeLabels]
section: { h: 0.3 }
---
::

| 물리량 | 공식 | 값 |
| --- | --- | --- |
| C의 처짐 | $\kappa L^2/8$ | 3.2 mm, 위 방향: D<sub>z</sub> = −0.0032 m |
| A의 회전각 | $\kappa L/2$ | 0.0016 rad, 반시계 방향 |
| 휨모멘트 |  | 0 |

균일한 온도 변화 $\Delta T_c$는 보를 늘이기만 하는데, 롤러가 이를 허용하므로 역시 부재력이 생기지 않습니다.

이제 양 끝의 회전을 구속합니다(A는 **고정단**, B는 보가 여전히 늘어날 수 있는 **슬라이더**). 보가 휠 수 없게 되므로 곡률 대신 경간 전체에 일정한 휨모멘트가 생깁니다.

$$
\begin{aligned}
M &= -EI\kappa \\
&= -17{,}547.6 \cdot (-4 \times 10^{-4}) = 7.019\ \text{kNm}
\end{aligned}
$$

이 휨모멘트는 정모멘트입니다. 구속된 상연이 늘어나려 하다가 결국 압축을 받기 때문입니다.

::model-figure{caption="같은 보의 양 끝 회전을 구속: 일정한 휨모멘트 7.019 kNm"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: fixed, B: slider }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [M]
show: [nodeLabels]
section: { h: 0.3 }
---
::

온도하중은 [하중](/ko/essentials/loads#temperature-load)에서 설명한 대로 입력합니다. 단면 높이 $h$는 [단면](/ko/essentials/elements#cross-sections) 데이터에 들어 있습니다.

## 지점 침하 {#prescribed-displacement}

[일단 고정 타단 롤러 보](#propped-cantilever-uniform-load)에서 하중을 빼고, B의 롤러가 $w = 10$ mm 침하한다고 합시다. EduBeam에서는 B에 D<sub>z</sub> = 0.01 m의 **강제변위**를 줍니다. 롤러가 침하를 따라가려면 캔틸레버의 끝을 아래로 끌어내려야 하고, 그 때문에 보가 휩니다.

::model-figure{caption="일단 고정 타단 롤러 보, B가 10 mm 침하: 롤러가 2.437 kN으로 아래로 끌어당김"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

| 물리량 | 공식 | 값 |
| --- | --- | --- |
| 롤러 반력 | $R = 3EIw/L^3$ | 2.4372 kN, 아래로 당김 |
| 고정단 모멘트 | $RL$ | 14.623 kNm, 부모멘트: M = −14.623 kNm |
| B의 회전각 | $3w/(2L)$ | 0.0025 rad, 시계 방향 |

하중과 달리 지점 침하는 구조물이 그 변위에 저항하는 곳에서만 힘을 만듭니다. 여기서는 보의 강성이 클수록 $R$이 커집니다. 단순보라면 같은 침하를 강체처럼 따라가므로 힘이 전혀 생기지 않습니다.

12 kN/m 하중을 다시 추가하면 결과가 중첩됩니다. 고정단은 $45 + 2.4372 = 47.437$ kN과 $54 + 14.623 = 68.623$ kNm를, 롤러는 $27 - 2.4372 = 24.563$ kN을 받습니다. 지점 침하를 입력하는 방법은 [하중](/ko/essentials/loads#prescribed-displacements-support-settlements)에서 설명합니다.

## 전단 변형 {#shear-deformation}

EduBeam의 보 요소는 **Timoshenko** 보입니다. 휨에 의한 처짐 외에 전단에 의한 처짐도 생기며, 그 크기는 단면의 전단 강성 $kGA$가 정합니다. 무엇이 달라지는지는 구조물에 따라 다릅니다.

- **정정 구조물**: 반력과 부재력은 평형만으로 정해지므로 전혀 바뀌지 않습니다. 변위만 커집니다. 단순보와 캔틸레버에서는 단면의 회전각도 그대로이지만, 내민 부분의 끝처럼 다른 곳에서는 회전각도 조금 달라집니다.
- **부정정 구조물**: 부재력이 강성에 따라 정해지므로 부재력도 조금 달라집니다.

### 단순보 {#shear-simply-supported}

[빠른 시작](/ko/guide/quick-start#_8-check-by-hand)의 보가 그 크기를 보여 줍니다. 위의 단순보와 같지만 단면이 실제 단면입니다. 단면 라이브러리의 **IPE 200 (근사)**, 즉 $I_y = 1943$ cm⁴, $A = 28.48$ cm², 전단 보정계수 $k = 0.3933$(단면적 중 웨브가 차지하는 비율)이고 $G = 81$ GPa입니다. 따라서 $EI = 4080.3$ kNm², $kGA = 90{,}720$ kN입니다.

| 물리량 | 공식 | 값 |
| --- | --- | --- |
| 단부 회전각 | $qL^3/(24EI)$ | 0.026469 rad |
| 경간 중앙 처짐, 휨 | $5qL^4/(384EI)$ | 49.629 mm |
| 경간 중앙 처짐, 전단 | $qL^2/(8kGA)$ | 0.59524 mm |
| 경간 중앙 처짐, 합계 | 합 | 50.224 mm, EduBeam과 동일 |

전단 성분은 전체의 1.2 %입니다. 단부 회전각은 반력, 휨모멘트와 마찬가지로 Euler–Bernoulli 값과 같습니다.

### 캔틸레버: 짧은 부재 {#shear-cantilever}

자유단 하중 $F$를 받는 캔틸레버의 자유단 처짐은 휨 성분이 $FL^3/(3EI)$, 전단 성분이 $FL/(kGA)$입니다. 두 값의 비는

$$
\frac{\text{전단}}{\text{휨}} = \frac{3EI}{kGA\,L^2}
$$

입니다. 같은 IPE 200이라도 길이 4 m의 캔틸레버에서는 0.84 %이지만 1 m에서는 13.5 %입니다. 짧고 춤이 큰 부재에서는 전단 변형이 중요합니다.

### 일단 고정 타단 롤러 보: 부재력이 달라짐 {#shear-propped-cantilever}

IPE 200으로 만든 [일단 고정 타단 롤러 보](#propped-cantilever-uniform-load)는 부정정이며, 이제 롤러가 조금 더 많은 하중을 받습니다. $L = 6$ m에서 $\beta = 3EI/(kGA\,L^2) = 0.0037481$이고, 롤러에서의 적합 조건으로부터

$$
R_B = \frac{3qL}{8} \cdot \frac{1 + 4\beta/3}{1 + \beta} = 27.034\ \text{kN}
$$

을 얻습니다(전단 변형을 무시하면 27 kN). 고정단 모멘트는 54 kNm에서 $qL^2/2 - R_B L = 53.798$ kNm로 줄어듭니다. 여기서는 작은 차이지만 $\beta$가 커질수록, 즉 짧고 춤이 큰 부재일수록 커집니다.

### Euler–Bernoulli 보와 비교 {#shear-switch-off}

Euler–Bernoulli 공식과 비교하려면 단면의 **전단 보정계수**를 `1e10`처럼 아주 큰 값으로 두세요. 그러면 전단 성분이 사라지고, 이 페이지의 모든 경우가 다시 일치합니다. 요소의 정식화는 이론 매뉴얼의 [보 요소](/ko/elements/beam) 페이지에 있습니다.

## 직접 검증할 때의 팁 {#tips-for-your-own-checks}

- 뷰어 오른쪽 아래의 **단위 칩**이 늘 보이게 두세요. 결과가 어긋나는 원인은 대부분 단위 실수입니다.
- 정확한 수치는 다이어그램 레이블이 아니라 **결과** 탭과 툴팁에서 읽으세요. **CSV 내보내기**나 **복사**를 쓰면 반력도 스프레드시트에 바로 붙여 넣을 수 있는 형태로 얻습니다. [결과 및 다이어그램](/ko/essentials/results#results-tab)을 참고하세요.
- `4 · 10¹` 대신 `40`으로 읽으려면 설정에서 **숫자 형식**을 *자동*으로 두세요.
- 직접강성법을 배울 때는 **강성 행렬** 창으로 요소 하나를 이론 매뉴얼의 [보 요소](/ko/elements/beam) 페이지와 비교하세요.
- 검증한 모델을 동료나 교수자에게 넘길 때는 **모델 공유**를 쓰세요.
- 많은 경우를 한꺼번에 확인하거나 정답이 있는 연습 문제를 만들려면 같은 솔버를 코드에서 실행하세요. 앱의 모든 숫자를 계산하는 것이 바로 [@edubeam/fem](/ko/solver) 솔버 라이브러리입니다.
