---
description: "EduBeam의 트러스 부재: 양단 힌지 보 요소가 고전적인 트러스 요소와 정확히 같은 이유, 강성 행렬과 좌표 변환 행렬."
source: site
---

# 트러스 요소

트러스 부재는 축력만 받습니다. EduBeam에는 트러스 요소가 따로 없습니다. 트러스 부재는 **양쪽 단부 힌지**를 체크한 [보 요소](/ko/elements/beam)입니다. 이 페이지에서는 이것이 왜 고전적인 2절점 트러스 요소와 정확히 같은지 보이고, 강성 행렬과 좌표 변환 행렬을 정리합니다. 또 교과서의 트러스 부재로는 할 수 없지만 양단 힌지 부재로는 할 수 있는 일도 설명합니다.

::model-figure{caption="모든 부재가 양단 힌지: 서까래는 N = −7.071 kN, 타이(인장재)는 +5 kN이며 휘는 부재는 없음"}
---
nodes: { A: [0, 0], B: [6, 0], C: [3, -3] }
supports: { A: pin, B: roller }
members:
  - { nodes: [A, C], hinges: [true, true] }
  - { nodes: [C, B], hinges: [true, true] }
  - { nodes: [A, B], hinges: [true, true] }
loads:
  - { node: C, fz: 10 }
results: [N]
show: [nodeLabels]
---
::

앱에서 트러스를 모델링하려면 모든 부재에서 **시작단 힌지**와 **끝단 힌지**를 체크합니다. 마우스로 부재를 그리기 전에 배너에서 둘 다 체크해 두어도 됩니다([단부 힌지](/ko/essentials/elements#end-hinges)). [튜토리얼: 평면 트러스](/ko/tutorials/truss)에서 트러스를 단계별로 만들어 봅니다.

## 자유도 {#degrees-of-freedom}

트러스 부재는 [국부 좌표계](/ko/elements/conventions#element-local-axes)에서 양 끝의 이동 2개씩만 사용합니다.

::element-sketch{mode="dofs" :hinges='[true,true]' :rotations='false' caption="트러스 부재: 양단 힌지이며 각 끝에 이동 2개"}
::

| 방향 | 시작 절점 (1) | 끝 절점 (2) |
| --- | --- | --- |
| 국부 x 방향 | $u_1$과 `X12` | $u_2$와 `X21` |
| 국부 z 방향 | $w_1$과 `Z12` | $w_2$와 `Z21` |

$$
\mathbf{d}_l = \begin{bmatrix} u_1 & w_1 & u_2 & w_2 \end{bmatrix}^\mathsf{T}.
$$

모든 부재가 보 요소이므로 절점에는 회전 `Ry`가 그대로 남아 있습니다. 하지만 양단 힌지 부재는 이 회전의 영향을 받지도 않고 전달하지도 않습니다. 단부 모멘트 `M12`와 `M21`은 항상 0입니다. 모든 부재가 힌지로 연결된 절점에서는 이 회전을 붙잡는 것이 없습니다. 솔버는 이 회전각을 0으로 두지만, 이런 절점에 절점 모멘트를 가하면 그 모멘트를 받을 부재가 없어 해석이 멈추고 다음 메시지가 나타납니다: *구조물이 메커니즘입니다. 강성 행렬이 특이 행렬입니다.*

## 국부 강성 행렬 {#local-stiffness-matrix}

$$
\mathbf{K}_l = \frac{EA}{L}
\begin{bmatrix}
 1 & 0 & -1 & 0 \\
 0 & 0 & 0 & 0 \\
 -1 & 0 & 1 & 0 \\
 0 & 0 & 0 & 0
\end{bmatrix},
$$

여기서 $E$는 탄성계수, $A$는 단면적, $L$은 길이입니다. 변형 에너지가 생기는 것은 부재가 늘어나거나 줄어들 때뿐이므로, 요소하중이 없는 부재의 축력은 일정합니다.

$$
N = \frac{EA}{L}\,(u_2 - u_1).
$$

### 양단 힌지 보가 트러스 부재가 되는 이유 {#why-a-beam-with-two-hinges-is-a-truss-bar}

[보의 강성 행렬](/ko/elements/beam#local-stiffness-matrix)에서 [단부 힌지](/ko/elements/beam#end-hinges)와 같은 방법으로 양 끝의 회전각을 정적 축약으로 소거합니다. 축방향 항에는 회전각이 들어 있지 않으므로 그대로 남습니다. 휨 항은 모두 사라집니다. 양 끝의 회전이 자유로워지면 단부 변위 $w_1$, $w_2$를 어떻게 조합해도 부재는 힌지를 중심으로 강체 회전할 뿐이고, 여기에는 에너지가 들지 않기 때문입니다. 솔버는 이 축약을 전단 보정계수와 관계없이 수치적으로 수행하며, 부동소수점 반올림 오차 범위 안에서 위 행렬을 얻습니다.

::callout{type="details" title="축약 계산 과정"}
휨 부분의 자유도를 남는 자유도 $a = (w_1, w_2)$, 해제되는 자유도 $b = (\varphi_1, \varphi_2)$ 순서로 나열합니다. $k_1$부터 $k_4$와 전단 매개변수 $\Phi$를 [보 요소](/ko/elements/beam#local-stiffness-matrix)에서 정의한 대로 쓰면, 보의 행렬에서 다음을 얻습니다.

$$
\begin{aligned}
\mathbf{K}_{aa} &= k_1 \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{ab} &= k_2 \begin{bmatrix} -1 & -1 \\ 1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{bb} &= \begin{bmatrix} k_3 & k_4 \\ k_4 & k_3 \end{bmatrix}.
\end{aligned}
$$

$\mathbf{K}_{ab}$의 두 열이 같으므로 $\mathbf{K}_{bb}^{-1}$에서는 성분의 합만 중요하며, 그 합은 $2/(k_3 + k_4)$입니다.

$$
\mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}
= \frac{2\,k_2^2}{k_3 + k_4} \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}.
$$

$k_3 + k_4 = 6EI_y / ((1+\Phi)L)$이므로 계수는 $\dfrac{12\,EI_y}{(1+\Phi)L^3} = k_1$입니다. 따라서 이 항은 $\mathbf{K}_{aa}$와 정확히 같고, 축약된 휨 강성 $\mathbf{K}_{aa} - \mathbf{K}_{ab}\mathbf{K}_{bb}^{-1}\mathbf{K}_{ba}$는 0입니다.
::

## 좌표 변환 행렬 {#transformation-matrix}

전체 x축에서 전체 z축 쪽으로 잰 각도 $\theta$에 놓인 부재에서 $c = \cos\theta = (x_2 - x_1)/L$, $s = \sin\theta = (z_2 - z_1)/L$로 두면 국부 변위는 $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$이며,

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 \\
 -s & c & 0 & 0 \\
 0 & 0 & c & s \\
 0 & 0 & -s & c
\end{bmatrix}:
$$

[보의 좌표 변환 행렬](/ko/elements/beam#transformation-matrix)에서 이동에 해당하는 행과 열만 남긴 것입니다. z축이 아래를 향하므로 $s$의 부호에 주의하세요. 위 트러스의 서까래 A → C는 올라가므로 $z_2 - z_1 = -3$ m, $c = 0.7071$, $s = -0.7071$입니다.

## 전체 강성 행렬 {#global-stiffness-matrix}

$\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T}$를 계산하면 다음과 같습니다.

$$
\mathbf{K}_g = \frac{EA}{L}
\begin{bmatrix}
 c^2 & cs & -c^2 & -cs \\
 cs & s^2 & -cs & -s^2 \\
 -c^2 & -cs & c^2 & cs \\
 -cs & -s^2 & cs & s^2
\end{bmatrix}.
$$

양단 힌지 부재의 **강성 행렬** 창에는 이동에 해당하는 행과 열에 이 값이, 회전에 해당하는 행과 열에는 0이 표시됩니다.

## 양단 힌지 보가 트러스 부재보다 더 할 수 있는 일 {#where-a-hinged-beam-does-more}

EduBeam의 트러스 부재는 여전히 보 요소이므로, 교과서의 트러스 부재로는 할 수 없는 일을 두 가지 할 수 있습니다.

- **부재 길이를 따라 하중을 받습니다.** 자중처럼 부재에 작용하는 선하중은 절점 사이에서 부재를 단순보처럼 휘게 하고, 각 절점에 $qL/2$씩 전달합니다. 나머지 부재에는 이 절점하중에 의한 트러스 축력이 생깁니다. 하중을 받는 부재 자체에서는 하중의 부재축 방향 성분 때문에 $N$이 선형으로 변하며, 트러스 해석으로 구하는 부재력은 부재 중앙의 값과 같습니다.
- **보와 함께 쓸 수 있습니다.** 라멘 안에 타이나 가새 같은 양단 힌지 부재를 특별한 요소 유형 없이 넣을 수 있습니다.

위 트러스의 타이에 5 kN/m를 가해 봅니다.

::model-figure{caption="타이에 5 kN/m를 가한 같은 트러스: 축력은 변하지 않고, 타이는 M = qL²/8 = 22.5 kNm로 휨"}
---
nodes: { A: [0, 0], B: [6, 0], C: [3, -3] }
supports: { A: pin, B: roller }
members:
  - { nodes: [A, C], hinges: [true, true] }
  - { nodes: [C, B], hinges: [true, true] }
  - { nodes: [A, B], hinges: [true, true] }
loads:
  - { node: C, fz: 10 }
  - { member: 3, qz: 5 }
results: [M, N]
show: [nodeLabels]
---
::

손 계산으로 확인해 봅니다. 절점 C의 연직 방향 평형 $2\,N \sin 45^\circ + 10 = 0$에서 각 서까래의 축력은 $N = -7.071$ kN입니다. 절점 A에서는 서까래의 수평 성분 $7.071 \cos 45^\circ = 5$ kN을 타이가 받으며, 타이는 $N = +5$ kN의 인장을 받습니다. 타이에 가한 하중은 양 끝의 지점으로 바로 전달됩니다. 각 반력은 $qL/2 = 15$ kN씩 늘어나지만 축력은 변하지 않습니다.

트러스는 핀 접합 구조물로서 안정해야 합니다. 예를 들어 사재가 없는 사각형 격간(패널)은 메커니즘입니다. 이때 EduBeam은 어느 힌지가 문제인지 알려 주고 움직임을 보여 줍니다([문제 해결](/ko/reference/troubleshooting#no-results-are-drawn)).
