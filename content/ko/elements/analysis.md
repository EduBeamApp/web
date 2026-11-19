---
description: "EduBeam이 수행하는 직접강성법을 일단 고정 타단 롤러 보로 손 계산해 봅니다: 자유도 번호, 조립, 지점, 반력, 부재를 따른 결과."
source: site
---

# EduBeam의 해석 과정

모델을 바꿀 때마다 EduBeam은 브라우저 안에서 **직접강성법**으로 몇 밀리초 만에 모델을 다시 풉니다. 이 페이지에서는 [@edubeam/fem](/ko/solver) 솔버가 하는 일을 작은 예제로 한 단계씩 따라갑니다. 모든 숫자를 손으로 재현할 수 있고, 결과를 믿을 수 있는 이유도 알 수 있습니다.

예제는 일단 고정 타단 롤러 보입니다. 강재 IPE 300, 길이 4 m이며 A는 고정단, B는 롤러 지점이고 10 kN/m를 받습니다. 휨강성은 $EI = 210 \text{ GPa} \times 8356 \text{ cm}^4 = 17{,}548$ kNm²이고, 전단 변형을 무시한 교과서의 답은 $M_A = -qL^2/8 = -20$ kNm, $R_B = 3qL/8 = 15$ kN, $\varphi_B = qL^3/(48EI)$입니다.

::model-figure{caption="일단 고정 타단 롤러 보, IPE 300, 10 kN/m: A에서 M = −20 kNm, 2.5 m 위치에서 +11.25 kNm, 반력 25 kN과 15 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
section: { a: 53.8e-4, iy: 8.356e-5, h: 0.3 }
results: [M, V, w]
show: [nodeLabels]
---
::

## 모델에서 변위까지 {#from-model-to-displacements}

::div{.steps}
### 자유도 번호 매기기 {#number-the-degrees-of-freedom}

각 절점에는 연결된 요소가 필요로 하는 자유도가 생깁니다. 모든 요소가 [보 요소](/ko/elements/beam)이므로 모든 절점에 `Dx`, `Dz`, `Ry`가 있습니다. 솔버는 절점 순서대로 **구속되지 않은** 자유도에 먼저 번호를 매기고, **구속된** 자유도에는 그다음 번호를 매깁니다. 이 예제에서 A는 고정단이고 B는 연직 방향만 구속되어 있으므로 구속되지 않은 자유도는 2개입니다.

$$
\begin{gathered}
\mathbf{r} = \begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix},
\qquad
\mathbf{r}_u = \begin{bmatrix} u_B \\ \varphi_B \end{bmatrix}, \\[1ex]
\mathbf{r}_p = \begin{bmatrix} u_A & w_A & \varphi_A & w_B \end{bmatrix}^\mathsf{T}.
\end{gathered}
$$

$u$, $w$, $\varphi$는 [자유도 표](/ko/elements/conventions#degrees-of-freedom)에서처럼 x 방향 변위, z 방향 변위, 회전각입니다. 각 요소에는 **위치 배열**(location array)이 있습니다. 요소의 자유도 6개가 $\mathbf{r}$에서 몇 번째에 있는지를 담은 배열입니다. 1부터 세면 보의 자유도 $(u_A, w_A, \varphi_A, u_B, w_B, \varphi_B)$는 $(3, 4, 5, 1, 6, 2)$번째에 있습니다.

### 요소 행렬 계산 {#compute-the-element-matrices}

솔버는 요소마다 [국부 강성 행렬](/ko/elements/beam#local-stiffness-matrix)을 만들고, [단부 힌지](/ko/elements/beam#end-hinges)가 있으면 정적 축약으로 소거한 다음 전체 좌표계로 변환합니다($\mathbf{K}_g = \mathbf{T}^\mathsf{T}\mathbf{K}_l\,\mathbf{T}$). 요소하중은 모두 [등가 절점하중](/ko/elements/beam#element-loads) $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$로 바뀝니다. 이 예제의 보는 수평이므로 $\mathbf{T}$는 단위 행렬이고, 등분포하중은 kN과 kNm 단위로 다음과 같습니다.

$$
\mathbf{f}_\mathrm{eq} = \begin{bmatrix} 0 \\[0.5ex] qL/2 \\[0.5ex] -qL^2/12 \\[0.5ex] 0 \\[0.5ex] qL/2 \\[0.5ex] qL^2/12 \end{bmatrix}
= \begin{bmatrix} 0 \\[0.5ex] 20 \\[0.5ex] -13.33 \\[0.5ex] 0 \\[0.5ex] 20 \\[0.5ex] 13.33 \end{bmatrix}.
$$

### 조립 {#assemble}

전체 강성 행렬 $\mathbf{K}$는 0으로 시작합니다. 각 요소는 자기 행렬의 성분 $(i, j)$를, 위치 배열이 $i$와 $j$에 대응시키는 행과 열에 더합니다. 그래서 여러 요소가 한 절점에 모이면 그 절점의 자유도에 대한 강성이 합쳐집니다. 하중 벡터 $\mathbf{F}$도 같은 방법으로 절점하중과 등가 절점하중을 모읍니다. 강제변위(지점 침하)는 $\mathbf{r}_p$에 들어갑니다. 구속되지 않은 자유도를 먼저, 구속된 자유도를 나중에 놓으면 연립방정식은 다음과 같이 블록으로 나뉩니다.

$$
\begin{bmatrix} \mathbf{K}_{uu} & \mathbf{K}_{up} \\ \mathbf{K}_{pu} & \mathbf{K}_{pp} \end{bmatrix}
\begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix}
=
\begin{bmatrix} \mathbf{F}_u \\ \mathbf{F}_p + \mathbf{R} \end{bmatrix},
$$

여기서 $\mathbf{R}$은 미지의 반력입니다. 이 예제에서는 보의 B단에 해당하는 행과 열만 $\mathbf{K}_{uu}$에 들어갑니다.

$$
\begin{aligned}
\mathbf{K}_{uu} &= \begin{bmatrix} EA/L & 0 \\ 0 & 4EI/L \end{bmatrix} \\[1ex]
&= \begin{bmatrix} 282{,}450 \text{ kN/m} & 0 \\ 0 & 17{,}548 \text{ kNm} \end{bmatrix}, \\[1ex]
\mathbf{F}_u &= \begin{bmatrix} 0 \\ 13.33 \text{ kNm} \end{bmatrix}.
\end{aligned}
$$

### 지점 조건 적용과 풀이 {#apply-the-supports-and-solve}

EduBeam은 지점을 스프링이나 대각 성분의 큰 수로 처리하지 않고, 구속된 자유도를 그냥 분리해 냅니다. 구속되지 않은 변위는

$$
\mathbf{K}_{uu}\,\mathbf{r}_u = \mathbf{F}_u - \mathbf{K}_{up}\,\mathbf{r}_p,
$$

를 LU 분해로 풀어 구합니다. 지점 침하가 없으면 $\mathbf{r}_p = \mathbf{0}$이고, 이 예제에서는

$$
\varphi_B = \frac{13.33}{17{,}548} = 7.598 \times 10^{-4} \text{ rad},
$$

입니다. 교과서의 $qL^3/(48EI)$와 같고, $u_B = 0$입니다.

### 반력 계산 {#compute-the-reactions}

모든 변위를 알면 구속된 자유도의 행에서 반력, 즉 지점이 구조물에 가하는 힘을 구할 수 있습니다.

$$
\mathbf{R} = \mathbf{K}_{pu}\,\mathbf{r}_u + \mathbf{K}_{pp}\,\mathbf{r}_p - \mathbf{F}_p.
$$

$w_A$에 해당하는 $\mathbf{K}_{pu}$의 행에는 $\varphi_B$ 열에 $-6EI/L^2$이 있고, $\mathbf{F}_p$에는 $qL/2$가 있습니다.

$$
\begin{aligned}
R_{wA} &= -\frac{6EI}{L^2}\,\varphi_B - \frac{qL}{2} \\
&= -5 - 20 = -25 \text{ kN},
\end{aligned}
$$

z축이 아래를 향하므로 이는 위쪽으로 25 kN입니다. 같은 방법으로 $R_{\varphi A} = +20$ kNm, $R_{wB} = -15$ kN을 얻으며, 교과서의 $qL^2/8$, $3qL/8$과 같습니다.
::

## 부재를 따른 결과 {#results-along-the-members}

솔버는 요소마다 $\mathbf{r}$에서 단부 변위를 꺼내 국부 좌표계로 변환하고($\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$), [단부력](/ko/elements/conventions#end-forces-element-results-table)을 계산합니다.

$$
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix}.
$$

이 예제에서는 $\mathbf{d}_l = [0,\ 0,\ 0,\ 0,\ 0,\ \varphi_B]^\mathsf{T}$에서 $Z_{12} = -25$ kN, $M_{12} = 20$ kNm, $Z_{21} = -15$ kN, $M_{21} = 0$을 얻습니다.

임의의 $x$에서 부재력은 요소의 시작점부터 $x$까지 잘라 낸 부분의 평형에서 구합니다. 시작점에 작용하는 힘에 그 부분에 작용하는 하중을 더하면 됩니다.

$$
\begin{aligned}
N(x) &= -X_{12} + N_q(x), \\
V(x) &= -Z_{12} + V_q(x), \\
M(x) &= -M_{12} - Z_{12}\,x + M_q(x),
\end{aligned}
$$

여기서 $N_q$, $V_q$, $M_q$는 그 부분에 작용하는 하중에서 나오는 항입니다. 등분포하중 $q_z$, $q_1$에서 $q_2$까지의 사다리꼴 분포하중($\Delta q = q_2 - q_1$), 거리 $a$에 작용하는 집중하중 $F_z$ 또는 집중모멘트 $M_y$(이 둘은 $x \ge a$에서만 작용)에 대해서는 다음과 같습니다.

$$
\begin{array}{l|cc}
\text{하중} & V_q(x) & M_q(x) \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -q_z\,x & -\dfrac{q_z\,x^2}{2} \\[3ex]
q_1 \to q_2 & -q_1 x - \dfrac{\Delta q\,x^2}{2L} & -\dfrac{q_1 x^2}{2} - \dfrac{\Delta q\,x^3}{6L} \\[3ex]
F_z,\ M_y & -F_z & -F_z\,(x-a) - M_y
\end{array}
$$

$N_q$는 $V_q$에서 $q_z$와 $F_z$ 대신 축방향 성분 $q_x$와 $F_x$를 넣은 것입니다.

이 예제에서는 $M(x) = -20 + 25\,x - 5\,x^2$ kNm이고, $x = 2.5$ m에서 최대 $11.25$ kNm $= 9qL^2/128$입니다. 온도하중에는 별도의 항이 없습니다. 온도하중은 단부력을 통해서만 작용합니다.

처짐은 [형상함수](/ko/elements/beam#local-stiffness-matrix)에 단부 변위를 곱한 값에, 양단을 고정한 상태에서 요소에 작용하는 하중으로 생기는 처짐을 더한 것입니다. 힌지가 있는 끝에서는 먼저 [정적 축약](/ko/elements/beam#end-hinges) 식으로 그 끝의 회전각을 복원합니다. 다이어그램과 변형 형상은 이 함수를 각 부재를 따라 계산한 것입니다.

## 결과가 정확한 이유 {#exact}

위의 각 단계는 해석하는 모델에 대해서는 정확합니다.

- 요소의 강성은 다항식 형상을 가정해서 얻은 것이 아니라 등단면 Timoshenko 부재의 **정확해**에서 나온 것이므로, 부재의 실제 강성입니다.
- 고정단력은 하중 유형마다 양단 고정 부재의 정확해이므로, 등가 절점하중에서 잃는 것이 없습니다.
- 따라서 절점 변위는 정확하고, 절점 사이의 부재력은 실제 하중에 대한 평형에서 구하므로 이것도 정확합니다.

그래서 EduBeam에서는 요소를 잘게 나눌 필요가 없습니다. 부재 하나에 요소 하나를 쓰든 100개를 쓰든 답은 같습니다. 절점은 부재 자체가 바뀌는 곳, 즉 지점, 힌지, 모서리, 단면이 바뀌는 위치에만 있으면 됩니다. 그 사이의 집중하중은 요소하중으로 두면 됩니다. 남는 오차는 부동소수점 반올림 오차뿐입니다. 결과 표는 같은 종류의 값 가운데 가장 큰 값의 $10^{-12}$배보다 작은 값을 0으로 표시합니다.

“정확하다”는 것은 모델에 대한 말이며, 모델에는 한계가 있습니다.

::div{.limits}
- **선형 탄성 재료**와 **미소 변위**: 평형은 변형 전 형상에서 세우므로 2차(P–Δ) 효과나 좌굴은 없습니다.
- **곧은 등단면 부재**: 요소 하나에 단면 하나입니다. 단면이 변하는 부재는 여러 요소로 근사해야 합니다.
- **x–z 평면 안의 휨만**: 비틀림과 면외 거동은 없습니다.
::

## 구조물이 서 있을 수 없을 때 {#mechanisms}

변형 없이 움직일 수 있는 구조물은 강성 행렬이 특이 행렬이 되어 해가 하나로 정해지지 않습니다. EduBeam은 풀기 전에 이런 경우를 찾아내고, 푼 뒤에도 답을 검사합니다.

1. **풀기 전에** 구조물의 연결된 각 부분을 기하 형상만으로 검사합니다. 지점은 평면 물체의 강체 운동 3가지를 막아야 합니다. 구속이 3개보다 적으면 모델이 아직 완성되지 않은 것일 뿐이고(*구조물을 해석하려면 먼저 지점이 필요합니다.*), 평행한 롤러처럼 구속이 3개 이상인데도 미끄러지거나 회전할 수 있으면 오류입니다. 다음으로 힌지를 검사합니다. 모든 부재가 길이를 유지한 채 힌지를 중심으로 회전할 수 있으면 구조물은 메커니즘이며, EduBeam은 해당 힌지에 원을 표시하고 움직임을 보여 줍니다.
2. **푸는 중에** 행렬이 정확히 특이하면 LU 분해가 멈춥니다: *구조물이 메커니즘입니다. 강성 행렬이 특이 행렬입니다.*
3. **푼 뒤에** $10^6$ m 또는 rad보다 큰 변위나 회전각이 있으면, 반올림 오차를 제외하면 사실상 행렬이 특이했다는 뜻입니다. EduBeam은 움직이는 절점과 방향을 알려 줍니다: *구조물이 불안정합니다. 다음 자유도가 거의 저항 없이 움직입니다: …* 재료나 단면을 0으로 입력했거나 단위를 잘못 입력한 경우도 여기에 해당합니다.

모든 부재가 힌지로 연결된 절점에서 아무것에도 연결되지 않은 회전은 메커니즘이 아닙니다. 솔버는 이 회전각을 0으로 둡니다. 각 메시지의 뜻과 해결 방법은 [문제 해결](/ko/reference/troubleshooting#no-results-are-drawn)에 설명되어 있습니다.

## 솔버 직접 실행하기 {#library}

솔버는 오픈 소스입니다. [@edubeam/fem](/ko/solver) 라이브러리는 TypeScript로 작성되었고 브라우저와 Node에서 동작합니다. 같은 일단 고정 타단 롤러 보를 풀면 다음과 같습니다.

```ts
import { DofID, LinearStaticSolver, type Beam2D } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]

// SI 단위: m, N, Pa. 강재, IPE 300. k = 1e32이면 전단 변형이 없음
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // 고정단
domain.createNode('B', [4, 0, 0], [DofID.Dz]) // 롤러
domain.createBeam2D('1', ['A', 'B'], 1, 1)
lc.createBeamElementUniformEdgeLoad('1', [0, 10_000], true) // 10 kN/m, 아래 방향

solver.solve()

solver.neq // 2: B의 Dx와 Ry는 구속되지 않음
lc.r.toArray() // [0, 0.0007598, 0, 0, 0, 0]: 구속되지 않은 자유도, 그다음 구속된 자유도
lc.R.toArray() // [0, -25000, 20000, -15000]: A (Dx, Dz, Ry), 그다음 B (Dz)

const beam = domain.getElement('1') as Beam2D
beam.computeEndForces(lc).toArray() // [0, -25000, 20000, 0, -15000, 0]
beam.computeBendingMomentAt(lc, 0) // -20000: N·m, 고정단의 부모멘트
beam.computeBendingMomentAt(lc, 2.5) // 11250: 최대 정모멘트
```

`solve()` 다음에는 `solver.k`에 조립된 행렬 $\mathbf{K}$가, `solver.f`에 하중 벡터 $\mathbf{F}$가 들어 있으므로 직접 조립한 결과와 비교할 수 있습니다. 이 페이지의 각 단계는 `Solver.ts`(번호 매기기), `LinearStaticSolver.ts`(조립, 풀이, 반력), `Beam2D.ts`(요소 행렬과 결과)에 있습니다.

::div{.actions}
[@edubeam/fem 시작하기](/ko/solver/getting-started) [라이브러리 구성](/ko/solver/reference) [GitHub 소스 코드 ↗](https://github.com/EduBeamApp/fem){target="_blank"}
::
