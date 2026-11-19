---
description: "EduBeam의 2절점 Timoshenko 보 요소: 정확한 강성 행렬, 전단 변형, 정적 축약으로 처리하는 단부 힌지, 고정단력, 좌표 변환."
source: site
---

# 보 요소

EduBeam에서는 보든 기둥이든 트러스 부재든 모든 부재가 같은 요소입니다. x–z 평면에 놓인 곧은 2절점 **Timoshenko 보**이며 단면은 일정합니다. 이 페이지는 솔버가 계산하는 그대로 이 요소의 정식화를 설명합니다. 따라서 어떤 요소 행렬이나 하중 벡터든 손으로 다시 만들어 앱의 값과 비교할 수 있습니다. 부호는 [좌표계 및 부호 규약](/ko/elements/conventions)을 따르고, 코드는 [@edubeam/fem](/ko/solver)의 `Beam2D.ts`입니다. 요소를 모아 해를 구하는 과정은 [EduBeam의 해석 과정](/ko/elements/analysis)에서 설명합니다.

## 자유도 {#degrees-of-freedom}

절점마다 자유도(DOF)가 3개이므로 요소의 자유도는 6개입니다. 요소의 [국부 좌표계](/ko/elements/conventions#element-local-axes)에서 단부 변위마다 짝이 되는 [단부력](/ko/elements/conventions#end-forces-element-results-table)이 있고, 단부력은 *요소 결과* 표의 각 열에 나옵니다.

::element-sketch{mode="dofs" caption="보 요소의 자유도 6개(모두 양의 방향으로 표시). 점선은 하연(국부 +z 쪽)을 나타냄"}
::

| 방향 | 시작 절점 (1) | 끝 절점 (2) |
| --- | --- | --- |
| 국부 x 방향 | $u_1$과 `X12` | $u_2$와 `X21` |
| 국부 z 방향(왼쪽에서 오른쪽으로 그린 요소에서는 아래쪽) | $w_1$과 `Z12` | $w_2$와 `Z21` |
| 회전, 반시계 방향 | $\varphi_1$과 `M12` | $\varphi_2$와 `M21` |

이 순서로 요소의 변위 벡터와 힘 벡터를 구성합니다.

$$
\begin{aligned}
\mathbf{d}_l &= \begin{bmatrix} u_1 & w_1 & \varphi_1 & u_2 & w_2 & \varphi_2 \end{bmatrix}^\mathsf{T}, \\
\mathbf{f} &= \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}.
\end{aligned}
$$

z축이 아래를 향하고 회전은 반시계 방향이 양이므로, 전단 변형이 없는 보에서 부재축의 회전각은 $\varphi = -\,\mathrm{d}w/\mathrm{d}x$입니다.

## 국부 강성 행렬 {#local-stiffness-matrix}

요소하중이 없는 요소의 단부력은 $\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l$이며,

$$
\mathbf{K}_l =
\begin{bmatrix}
 k_N & 0 & 0 & -k_N & 0 & 0 \\
 0 & k_1 & -k_2 & 0 & -k_1 & -k_2 \\
 0 & -k_2 & k_3 & 0 & k_2 & k_4 \\
 -k_N & 0 & 0 & k_N & 0 & 0 \\
 0 & -k_1 & k_2 & 0 & k_1 & k_2 \\
 0 & -k_2 & k_4 & 0 & k_2 & k_3
\end{bmatrix}
$$

입니다. 여기서

$$
\begin{aligned}
k_N &= \frac{EA}{L}, & k_1 &= \frac{12\,EI_y}{(1+\Phi)\,L^3}, \\[1ex]
k_2 &= \frac{6\,EI_y}{(1+\Phi)\,L^2}, & k_3 &= \frac{(4+\Phi)\,EI_y}{(1+\Phi)\,L}, \\[1ex]
k_4 &= \frac{(2-\Phi)\,EI_y}{(1+\Phi)\,L}, & \Phi &= \frac{12\,EI_y}{k\,GA\,L^2}.
\end{aligned}
$$

$E$와 $G$는 재료의 탄성계수와 전단탄성계수, $A$는 단면적, $I_y$는 y축에 대한 단면2차모멘트, $k$는 단면의 **전단 보정계수**, $L$은 요소의 길이입니다. $\Phi$는 **전단 매개변수**로, 부재가 휨에 비해 전단에 얼마나 유연한지를 나타냅니다. 부재가 짧고 춤이 클수록 커집니다. $\Phi = 0$이면 각 항은 Euler–Bernoulli 보에서 익숙한 $12EI/L^3$, $6EI/L^2$, $4EI/L$, $2EI/L$이 됩니다. 축방향 거동과 휨 거동은 서로 연성되지 않습니다. $u_1$과 $u_2$는 $k_N$에만 관계합니다.

y축을 위로 잡는 교과서에는 이 행렬의 $-k_2$ 자리에 $+6EI/L^2$이 적혀 있습니다. 둘 다 같은 강성을 나타내며, 다른 것은 횡방향 변위의 방향뿐입니다.

::callout{type="details" title="행렬의 유도: 정확한 형상함수"}
하중이 없는 등단면 Timoshenko 부재에서는 평형 방정식의 정확해를 구할 수 있습니다. $u$는 $x$의 1차식, $w$는 3차식, $\varphi$는 2차식입니다. $\xi = x/L$로 두고 단부 변위로 나타내면 처짐은

$$
w(\xi) = N_1\,w_1 + N_2\,\varphi_1 + N_3\,w_2 + N_4\,\varphi_2,
$$

$$
\begin{aligned}
N_1 &= \frac{(1-\xi)\,(1+\Phi+\xi-2\xi^2)}{1+\Phi}, \\[1ex]
N_2 &= -\frac{L\,\xi\,(1-\xi)\,(2+\Phi-2\xi)}{2\,(1+\Phi)}, \\[1ex]
N_3 &= \frac{\xi\,(\Phi+3\xi-2\xi^2)}{1+\Phi}, \\[1ex]
N_4 &= \frac{L\,\xi\,(1-\xi)\,(\Phi+2\xi)}{2\,(1+\Phi)}.
\end{aligned}
$$

입니다. $\Phi = 0$이면 이 함수는 3차 Hermite 다항식 $N_1 = 1 - 3\xi^2 + 2\xi^3$, $N_2 = -L\,\xi(1-\xi)^2$이 되며, 음의 부호는 $\varphi = -w'$에서 나옵니다. 강성 행렬은 이 정확한 변형 형상을 만드는 데 필요한 단부력을 모은 것입니다. 따라서 요소를 늘릴수록 좋아지는 근사가 아니라 부재의 정확한 강성입니다. 솔버는 변형 형상도 같은 함수로 그립니다.
::

## 전단 변형: Timoshenko 보인가 Euler–Bernoulli 보인가 {#timoshenko-or-euler-bernoulli}

요소에 전단 변형이 생기는지는 $\Phi$에만, 즉 단면의 전단 보정계수 $k$에만 달려 있습니다. $kA$는 전단을 받는 면적입니다. 단면 종류마다 $k$의 초깃값이 다릅니다.

| 단면 | 전단 보정계수 $k$ |
| --- | --- |
| 시작 모델과 내장 예제 | $10^{32}$. $\Phi \approx 0$이 되어 Euler–Bernoulli 보 |
| 라이브러리의 I형, H형, 광폭 플랜지 단면 | $h\,t_w / A$: 웨브가 전단을 받음 |
| 라이브러리의 각형 강관 | $2\,h\,t / A$: 양쪽 측벽 두 개가 전단을 받음 |
| 라이브러리의 직사각형과 정사각형 단면 | 0.833 |
| 라이브러리의 원형 단면 | 0.9 |
| 라이브러리의 원형 강관 | 0.5 |
| 다각형 단면 | 초깃값 0.833 |
| **단면 추가** 대화 상자 | 초깃값 1 |

세장한 부재에서는 차이가 작습니다. 등분포하중을 받는 단순보에서는 전단 때문에 경간 중앙의 처짐이 휨 처짐의 $0.8\,\Phi$배만큼 늘어납니다. 강재 IPE 200이라면 경간 6 m에서 1.2 %, 경간 2 m에서는 11 %입니다. 전단 변형을 끄려면 $k$를 `1e32`처럼 아주 큰 수로 지정합니다. 이 사이트의 인터랙티브 그림은 따로 밝히지 않는 한 전단 강성이 무한대인 예제 단면을 쓰므로 Euler–Bernoulli 이론에 따른 손 계산과 일치합니다. 아래 그림은 예외입니다.

::model-figure{caption="경간 2 m의 IPE 200, k = h·tw/A = 0.393: 경간 중앙에서 w = 0.5657 mm로, Euler–Bernoulli 이론의 0.5106 mm보다 11 % 큼(Φ = 0.135)"}
---
nodes: { A: [0, 0], B: [2, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
material: { e: 210e9, g: 81e9 }
section: { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 }
results: [w, M]
---
::

## 단부 힌지 {#end-hinges}

[단부 힌지](/ko/essentials/elements#end-hinges)를 체크하면 요소의 그 끝에서 모멘트가 0이 됩니다. 이때 요소의 단부 회전각은 자유로워지고, 솔버는 이 회전각을 **정적 축약**(static condensation)으로 소거합니다. 요소의 자유도 6개를 남는 자유도 $a$와 해제되는 단부 회전각 $b$로 나누면 다음과 같습니다.

$$
\begin{bmatrix} \mathbf{f}_a \\ \mathbf{0} \end{bmatrix}
=
\begin{bmatrix} \mathbf{K}_{aa} & \mathbf{K}_{ab} \\ \mathbf{K}_{ba} & \mathbf{K}_{bb} \end{bmatrix}
\begin{bmatrix} \mathbf{d}_a \\ \mathbf{d}_b \end{bmatrix}
+
\begin{bmatrix} \mathbf{f}_{\mathrm{fix},a} \\ \mathbf{f}_{\mathrm{fix},b} \end{bmatrix}.
$$

여기서 $\mathbf{f}_\mathrm{fix}$는 [요소하중](#element-loads)의 고정단력입니다. 둘째 행에서 힌지 위치의 회전각

$$
\mathbf{d}_b = -\mathbf{K}_{bb}^{-1}\left(\mathbf{K}_{ba}\,\mathbf{d}_a + \mathbf{f}_{\mathrm{fix},b}\right),
$$

을 얻고, 이를 첫째 행에 대입하면 축약된 강성 행렬과 고정단력이 남습니다.

$$
\begin{aligned}
\mathbf{K}^{*} &= \mathbf{K}_{aa} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}, \\
\mathbf{f}^{*}_\mathrm{fix} &= \mathbf{f}_{\mathrm{fix},a} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{f}_{\mathrm{fix},b}.
\end{aligned}
$$

솔버는 $\mathbf{K}^{*}$를 다시 6 × 6 행렬에 채워 넣고, 해제된 회전각의 행과 열은 0으로 둡니다. 그래서 힌지가 있는 요소도 다른 요소와 똑같이 조립됩니다. 해를 구한 뒤에는 위 식으로 $\mathbf{d}_b$를 복원하므로, 변형 형상에 힌지 위치의 꺾임이 나타납니다.

끝 절점에 힌지가 있으면 $(w_1, \varphi_1, w_2)$에 대한 휨 부분은

$$
\mathbf{K}^{*}_{w} = \frac{12\,EI_y}{(4+\Phi)\,L^3}
\begin{bmatrix} 1 & -L & -1 \\ -L & L^2 & L \\ -1 & L & 1 \end{bmatrix},
$$

이 되고, $\Phi = 0$이면 일단 고정 타단 롤러 부재의 잘 알려진 강성 $3EI/L^3$입니다. **양단** 모두에 힌지가 있으면 휨 항은 하나도 남지 않고 $EA/L$만 남습니다. 곧 [트러스 부재](/ko/elements/truss)가 됩니다.

힌지는 절점이 아니라 요소의 끝에 속합니다. 한 절점에 모이는 모든 요소가 그 절점에서 힌지로 연결되어 있으면 절점 자체의 회전각에는 아무것도 연결되지 않습니다. 솔버는 이 회전각을 0으로 두므로 문제가 없지만, 이런 절점에 절점 모멘트를 가하면 그 모멘트를 받을 요소가 없어 연립방정식이 특이(singular)해집니다.

## 요소하중 {#element-loads}

요소를 따라 작용하는 하중은 **등가 절점하중** $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$로 해석에 들어갑니다. **고정단력** $\mathbf{f}_\mathrm{fix}$는 양단을 고정한 요소가 하중을 받을 때 양 끝에서 요소를 붙잡는 단부력입니다.

아래 식은 모두 국부 좌표계 기준입니다. **LCS**(국부 좌표계)의 체크를 해제하고 전체 좌표계로 입력한 하중은 먼저 요소 [각도](#transformation-matrix)의 $c = \cos\theta$와 $s = \sin\theta$로 국부 성분으로 바꿉니다.

$$
q_x = c\,\bar q_x + s\,\bar q_z, \qquad q_z = -s\,\bar q_x + c\,\bar q_z,
$$

위에 줄을 그은 기호는 전체 좌표계 성분입니다. 선하중의 크기는 요소 자체의 길이 1 m당 값입니다. 예를 들어 $(0, 0)$에서 $(3, -4)$로 가는 서까래는 $L = 5$ m, $c = 0.6$, $s = -0.8$입니다(올라가므로 $z$가 줄어듭니다). 여기에 중력 방향 하중 $\bar q_z = 10$ kN/m를 가하면 $q_x = -8$ kN/m(경사를 따라 아래쪽), $q_z = 6$ kN/m(부재축에 수직)이고, 서까래가 받는 전체 하중은 $10 \times 3$이 아니라 $10 \times 5 = 50$ kN입니다.

표의 기호는 다음과 같습니다.

- $q_z$, $q_x$: 등분포하중. $q_1 \to q_2$: 사다리꼴 분포하중으로, 시작 절점에서 $q_1$, 끝 절점에서 $q_2$.
- $F_z$, $F_x$, $M_y$: 시작 절점에서 거리 $a$에 작용하는 힘 또는 모멘트, $b = L - a$.
- $\Delta T = \Delta T_b - \Delta T_t$: 하연이 상연보다 온도가 높은 경우. $\Delta T_c$: 부재축의 온도 상승. $\alpha$는 재료의 열팽창계수, $h$는 단면의 **높이**.

부재축에 수직한 방향(z 성분), $\Phi = 0$일 때 시작 절점에서는 다음과 같습니다.

$$
\begin{array}{l|cc}
\text{하중} & Z_{12} & M_{12} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & \dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(7q_1+3q_2)}{20} & \dfrac{L^2\,(3q_1+2q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,b^2\,(3a+b)}{L^3} & \dfrac{F_z\,a\,b^2}{L^2} \\[3ex]
M_y & -\dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,b\,(b-2a)}{L^2} \\[3ex]
\Delta T & 0 & \dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

끝 절점에서는 다음과 같습니다.

$$
\begin{array}{l|cc}
\text{하중} & Z_{21} & M_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & -\dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(3q_1+7q_2)}{20} & -\dfrac{L^2\,(2q_1+3q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,a^2\,(a+3b)}{L^3} & -\dfrac{F_z\,a^2\,b}{L^2} \\[3ex]
M_y & \dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,a\,(a-2b)}{L^2} \\[3ex]
\Delta T & 0 & -\dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

부재축 방향(x 성분)은 $\Phi$와 관계없이 다음과 같습니다.

$$
\begin{array}{l|cc}
\text{하중} & X_{12} & X_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_x & -\dfrac{q_x L}{2} & -\dfrac{q_x L}{2} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(2q_1+q_2)}{6} & -\dfrac{L\,(q_1+2q_2)}{6} \\[3ex]
F_x & -\dfrac{F_x\,b}{L} & -\dfrac{F_x\,a}{L} \\[3ex]
\Delta T_c & EA\,\alpha\,\Delta T_c & -EA\,\alpha\,\Delta T_c
\end{array}
$$

::callout{type="details" title="전단 변형을 고려한 고정단력"}
등분포하중과 온도하중의 고정단력은 $\Phi$와 관계없이 같습니다. 나머지 하중은 $D = 1 + \Phi$, $\Delta q = q_2 - q_1$(z 성분)로 두면 다음과 같습니다.

$$
\begin{aligned}
&\text{사다리꼴 분포하중:} \\
Z_{12} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(9+10\Phi)}{60\,D}, \\[1ex]
M_{12} &= \frac{q_1 L^2}{12} + \frac{\Delta q\,L^2\,(4+5\Phi)}{120\,D}, \\[1ex]
Z_{21} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(21+20\Phi)}{60\,D}, \\[1ex]
M_{21} &= -\frac{q_1 L^2}{12} - \frac{\Delta q\,L^2\,(6+5\Phi)}{120\,D}; \\[3ex]
&\text{집중하중 } F_z\text{:} \\
Z_{12} &= -\frac{F_z\,b\,(\Phi L^2 + 3ab + b^2)}{D\,L^3}, \\[1ex]
M_{12} &= \frac{F_z\,a\,b\,(\Phi L + 2b)}{2\,D\,L^2}, \\[1ex]
Z_{21} &= -\frac{F_z\,a\,(\Phi L^2 + a^2 + 3ab)}{D\,L^3}, \\[1ex]
M_{21} &= -\frac{F_z\,a\,b\,(\Phi L + 2a)}{2\,D\,L^2}; \\[3ex]
&\text{집중모멘트 } M_y\text{:} \\
Z_{12} &= -\frac{6\,a\,b\,M_y}{D\,L^3}, \qquad Z_{21} = \frac{6\,a\,b\,M_y}{D\,L^3}, \\[1ex]
M_{12} &= -\frac{M_y\,b\,(\Phi L - 2a + b)}{D\,L^2}, \\[1ex]
M_{21} &= -\frac{M_y\,a\,(\Phi L + a - 2b)}{D\,L^2}.
\end{aligned}
$$

이 값은 양단 고정 Timoshenko 부재의 정확해이며, 솔버가 하중마다 절점 사이에 더하는 처짐도 마찬가지로 정확해입니다.
::

힌지가 있는 요소에서는 [단부 힌지](#end-hinges)에서처럼 고정단력도 $\mathbf{f}^{*}_\mathrm{fix}$로 축약됩니다. 예를 들어 끝 절점에 힌지가 있는 요소에 등분포하중이 작용하면 $Z_{12} = -5q_zL/8$, $M_{12} = q_zL^2/8$, $Z_{21} = -3q_zL/8$, $M_{21} = 0$입니다($\Phi = 0$일 때). 바로 일단 고정 타단 롤러 보의 고정단력입니다.

해를 구한 뒤 요소를 따라 부재력은 단부력과 요소에 작용하는 하중의 평형 조건으로 구하고, 처짐은 형상함수로 구한 값에 양단 고정 상태에서 하중이 만드는 처짐을 더해 구합니다. 자세한 내용은 [부재를 따른 결과](/ko/elements/analysis#results-along-the-members)를 참고하세요.

## 좌표 변환 행렬 {#transformation-matrix}

전체 x축에서 전체 z축 쪽으로(화면에서는 시계 방향으로) 잰 각도 $\theta$에 놓인 요소는

$$
c = \cos\theta = \frac{x_2 - x_1}{L}, \qquad s = \sin\theta = \frac{z_2 - z_1}{L},
$$

이고, 국부 단부 변위는 전체 단부 변위에서 $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$로 구합니다. 여기서

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 & 0 & 0 \\
 -s & c & 0 & 0 & 0 & 0 \\
 0 & 0 & 1 & 0 & 0 & 0 \\
 0 & 0 & 0 & c & s & 0 \\
 0 & 0 & 0 & -s & c & 0 \\
 0 & 0 & 0 & 0 & 0 & 1
\end{bmatrix}.
$$

회전각은 두 좌표계에서 같습니다. 절점에 **절점 좌표계 각도** $\beta$가 있으면([경사 지점](/ko/essentials/nodes-supports#inclined-skewed-supports)), 그 절점의 미지수 $\mathbf{d}_n$은 전체 x축에서 전체 z축 쪽으로 $\beta$만큼 돌린 절점 자체의 좌표축 기준입니다. 이 절점의 자유도 3개에 대해 전체 좌표계 성분은

$$
\mathbf{d}_g = \mathbf{T}_n\,\mathbf{d}_n, \qquad
\mathbf{T}_n = \begin{bmatrix} \cos\beta & -\sin\beta & 0 \\ \sin\beta & \cos\beta & 0 \\ 0 & 0 & 1 \end{bmatrix}
$$

입니다. 솔버는 $\mathbf{T}$의 오른쪽에 두 끝 절점의 $\mathbf{T}_n$으로 이루어진 블록 대각 행렬을 곱합니다(자체 좌표축이 없는 절점은 단위 행렬). 그래서 요소는 각 절점에 그 절점의 좌표축 기준으로 연결됩니다.

## 전체 강성 행렬 {#global-stiffness-matrix}

전체 좌표계에서 요소의 강성 행렬과 등가 절점하중은

$$
\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T},
\qquad
\mathbf{f}_{\mathrm{eq},g} = \mathbf{T}^\mathsf{T}\,\mathbf{f}_\mathrm{eq},
$$

입니다. 요소에 힌지가 있으면 $\mathbf{K}_l$과 $\mathbf{f}_\mathrm{eq}$는 이미 축약된 것입니다. 요소의 **강성 행렬** 창(*요소* 표나 요소의 컨텍스트 메뉴에서 엽니다)에 표시되는 것이 바로 $\mathbf{K}_g$이며, 단위는 SI 단위인 N/m, N, N·m입니다. [EduBeam의 해석 과정](/ko/elements/analysis)에서는 이 행렬을 조립하고 작은 예제를 손으로 풉니다.
