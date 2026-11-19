---
description: "EduBeam에서 클릭 한 번으로 열리는 해석 완료된 보, 라멘, 트러스 6개. 연습 문제, 살펴볼 점, 손 계산을 확인할 정답을 함께 실었습니다."
source: site
---

# 예제

아래 카드는 모두 해석이 끝난 실시간 모델입니다. 카드를 클릭하면 [EduBeam]{.edubeam}에서 바로 편집할 수 있는 상태로 열립니다. 절점을 드래그하거나, 하중을 바꾸거나, 힌지를 체크하면 다이어그램이 곧바로 따라 바뀝니다. 아래쪽의 연습 문제는 각 모델을 짧은 학습 과제로 만든 것이며, 손 계산 결과를 확인할 수 있는 정답도 함께 실었습니다.

::feature-structures
::

같은 모델은 앱의 **☰ → 예제**에도 있으며, [run.edubeam.app/?panel=examples&lang=ko](https://run.edubeam.app/?panel=examples&lang=ko){target="_blank"}를 열면 이 갤러리로 바로 이동합니다.

::callout{type="info" title="여섯 예제 모두 같은 부재"}
모든 예제는 같은 강재 부재를 씁니다. $E = 210$ GPa, $I_y = 8356\ \text{cm}^4$(따라서 $EI = 17{,}548$ kNm²), 단면적 $1\ \text{m}^2$이고, 전단 강성은 축방향 변형과 전단 변형을 무시할 수 있을 만큼 크게 잡았습니다. 그래서 세장한 보에 대한 교과서 공식이 앱에 표시되는 자릿수까지 일치합니다. 단면 높이는 $1$ m이며, 이 값은 온도하중에서만 영향을 줍니다.
::

## 연습 문제 제안 {#suggested-exercises}

먼저 손으로 답을 구한 다음 앱에서 확인하세요. 모델은 위의 카드나 각 그림 아래의 **EduBeam에서 열기**로 엽니다. 모델을 열면 지금 작업 중인 모델을 대신하게 됩니다. <kbd>Ctrl</kbd>+<kbd>Z</kbd>를 누르면 원래 모델로 돌아오며, 원래 모델은 **☰ → 최근 구조물**에도 보관됩니다.

### 부정정보 {#exercise-indeterminate-beam}

길이 3 m의 보가 A에서 고정되고 B에서 롤러로 지지되어 있으며, 10 kN/m를 받습니다.

::model-figure{caption="A 고정단, B 롤러 지점, 10 kN/m"}
---
nodes: { A: [0, 0], B: [3, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. 응력법이나 고정단 모멘트 표를 이용하여 반력과 고정단의 모멘트를 손으로 구하시오.
2. A의 `Ry` 체크를 해제하여 단순보로 만드시오. 최대 모멘트는 어떻게 달라지는가?
3. A의 `Ry`를 다시 체크하고 B의 `Ry`도 체크하여 양단 고정보로 만드시오.

**살펴볼 점:** 휨모멘트도의 부호가 바뀌는 위치, 그리고 고정단이 롤러보다 하중을 더 많이 받는 모습.

::callout{type="details" title="정답"}
- 일단 고정 타단 롤러 보: $R_A = 5qL/8 = 18.75$ kN, $R_B = 3qL/8 = 11.25$ kN, $M_A = qL^2/8 = 11.25$ kNm(부모멘트). 최대 정모멘트는 $9qL^2/128 = 6.33$ kNm이며, 전단력이 0이 되는 B에서 1.125 m 떨어진 위치에 생깁니다.
- 단순보: 경간 중앙에서 $qL^2/8 = 11.25$ kNm. 앞에서 고정단이 받던 값과 같습니다.
- 양단 고정보: 양 끝에서 $qL^2/12 = 7.5$ kNm(부모멘트), 경간 중앙에서 $qL^2/24 = 3.75$ kNm(정모멘트).
::

### 캔틸레버 {#exercise-cantilever}

길이 4 m의 캔틸레버가 A에서 고정되어 있고, 자유단 B에 아래 방향으로 18 kN이 작용합니다.

::model-figure{caption="자유단에 18 kN이 작용하는 캔틸레버"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: []
show: [nodeLabels, dimensions]
---
::

1. 고정단의 모멘트, 자유단의 처짐과 처짐각을 구하시오. **결과 → 절점 결과**에서 절점 B의 값과 비교하시오.
2. **단면** 탭에서 $I_y$를 절반으로 줄이시오. 무엇이 바뀌고 무엇이 바뀌지 않는가?
3. 집중하중을 전체 하중이 같은 18 kN인 4.5 kN/m의 등분포하중으로 바꾸시오. **하중** 탭에서 절점하중을 삭제한 다음 **요소하중 추가**를 사용하시오.

**살펴볼 점:** 휨모멘트도의 모양. 집중하중에서는 직선, 등분포하중에서는 포물선입니다.

::callout{type="details" title="정답"}
- $M_A = FL = 72$ kNm, $w_B = FL^3/(3EI) = 21.88$ mm, $\varphi_B = FL^2/(2EI) = 8.21$ mrad.
- $I_y$를 절반으로 줄이면 처짐은 두 배인 43.77 mm가 됩니다. 모멘트는 72 kNm 그대로입니다. 캔틸레버는 정정 구조물이므로 부재력이 강성에 따라 달라지지 않습니다.
- 등분포하중: $M_A = qL^2/2 = 36$ kNm, $w_B = qL^4/(8EI) = 8.21$ mm. 전체 하중이 같아도 모멘트는 절반, 처짐은 8분의 3이 됩니다.
::

### 워렌 트러스 {#exercise-pratt-truss}

경간 9 m, 높이 1.8 m의 트러스이며, 상현재의 세 절점 E, F, G에 각각 8 kN이 작용합니다. 축력을 보려면 표시 옵션에서 **N (x)** 항목을 체크합니다. (사재의 방향이 번갈아 바뀌고 수직재가 없는 이 형식을 대부분의 교과서는 워렌 트러스라고 부릅니다.)

::model-figure{caption="절점 A부터 G까지, E, F, G에 8 kN"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D], [E, F], [F, G], [A, E], [E, B], [B, F], [F, C], [C, G], [G, D]]
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: []
show: [nodeLabels]
---
::

1. 반력을 구한 다음, 절점법으로 단부 사재 A–E와 하현재 A–B의 부재력을 구하시오.
2. 단면법으로 가운데 격간(패널)의 상현재 부재력과 하현재 B–C의 부재력을 구하시오.
3. 이 모델의 절점은 강절점이다. **요소** 탭에서 모든 부재의 양쪽 단부 힌지를 체크하여 핀 접합 트러스로 만들고 축력을 비교하시오.
4. 사재 B–F를 삭제하시오. 먼저 강절점인 상태에서, 다음에는 힌지로 연결한 상태에서 시험하시오. 트러스는 여전히 서 있는가?

**살펴볼 점:** 부호의 배열. 상현재는 압축, 하현재는 인장이고, 사재는 인장과 압축이 번갈아 나타납니다.

::callout{type="details" title="정답"}
- 반력: A와 D에서 각각 12 kN.
- 단부 사재: 15.62 kN 압축. 하현재 A–B와 C–D: 10.00 kN 인장.
- 상현재 E–F와 F–G: 13.33 kN 압축(B에 대한 모멘트: $(12 \cdot 3 - 8 \cdot 1.5)/1.8$). 하현재 B–C: 16.67 kN 인장(F에 대한 모멘트: $(12 \cdot 4.5 - 8 \cdot 3)/1.8$). 안쪽 사재: 5.21 kN. E와 G에서 하현재로 내려가는 사재는 인장, F로 올라가는 사재는 압축입니다.
- 강절점과 핀 접합의 축력 차이는 0.1 % 이내입니다. 삼각형으로 구성된 트러스에서는 휨이 무시할 만큼 작기 때문에 핀 접합 모델이 성립합니다.
- B–F가 없어도 강절점 트러스는 라멘 작용으로 서 있으며, 휨모멘트는 약 3 kNm입니다. 힌지로 연결하면 부재가 하나 모자라 메커니즘이 되고, EduBeam은 구조물이 어떻게 움직일 수 있는지 보여 줍니다.
::

### 3경간 연속보 {#exercise-three-span-continuous-beam}

길이 16 m의 보이며 경간은 5 + 6 + 5 m입니다. 첫째 경간에 8 kN/m, C에 20 kN, 마지막 경간에 6 kN/m가 작용합니다. 처음 열었을 때는 A와 D만 지지되어 있습니다.

::model-figure{caption="처음 열었을 때: A와 D에서만 지지"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: []
show: [nodeLabels, dimensions]
---
::

1. 처음 열었을 때는 경간 16 m의 단순보 하나이다. 반력과 B, C의 모멘트를 구하시오.
2. B와 C에서 `Dz`를 체크하여 지점 4개 위의 연속보로 만드시오.
3. 3연모멘트 방정식으로 B와 C 위의 모멘트를 구한 다음 반력을 구하시오.

**살펴볼 점:** 내부 지점 위에 나타나는 부모멘트, 모든 모멘트가 얼마나 작아지는지, 그리고 C가 지점이 된 뒤 20 kN 하중이 어떻게 되는지.

::callout{type="details" title="정답"}
- 단순보: $R_A = 44.69$ kN, $R_D = 45.31$ kN, $M_B = 123.4$ kNm, $M_C = 151.6$ kNm, 둘 다 정모멘트.
- 연속보, $M_A = M_D = 0$:
  $$22 M_B + 6 M_C = -\tfrac{8 \cdot 5^3}{4}$$
  $$6 M_B + 22 M_C = -\tfrac{6 \cdot 5^3}{4}$$
  에서 $M_B = -9.766$ kNm, $M_C = -5.859$ kNm(부모멘트)를 얻습니다. C의 20 kN은 지점으로 바로 전달되며 아무것도 휘게 하지 않습니다.
- 반력: A 18.05 kN, B 22.60 kN, C 35.52 kN(20 kN 포함), D 13.83 kN. 합하면 전체 하중 90 kN과 같습니다.

::model-figure{caption="지점 4개 위의 연속보"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, B: roller, C: roller, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: [M, V]
---
::
::

### 문형 라멘 {#exercise-portal-frame}

길이 8 m의 보가 높이 6 m의 기둥 두 개 위에 놓여 있고, A는 고정단, D는 롤러 지점입니다. 보에는 10 kN/m가 작용하고, 위쪽 모서리 C에는 왼쪽으로 8 kN, 아래로 10 kN이 작용합니다.

::model-figure{caption="A 고정단, D 롤러 지점: 보에 10 kN/m, C에 8 kN과 10 kN"}
---
nodes: { A: [0, 0], B: [0, -6], C: [8, -6], D: [8, 0] }
supports: { A: fixed, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
  - { node: C, fx: -8 }
  - { node: C, fz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. 이 라멘은 몇 차 부정정인가?
2. A의 `Ry` 체크를 해제하여 A를 힌지 지점으로 만드시오. 이제 라멘은 정정이다. 반력과 모서리 B, C의 모멘트를 손으로 구하시오.
3. A의 `Ry`를 다시 체크한 다음, D의 `Dx`를 체크하여 D를 힌지 지점으로 만드시오. 변형 형상에서 보의 횡변위를 관찰하시오.

**살펴볼 점:** 라멘 위쪽이 어느 방향으로 움직이는지. 처음 연 라멘에서는 8 kN 하중과 반대인 오른쪽으로 움직입니다. 왜 그럴까요?

::callout{type="details" title="정답"}
- 반력이 4개(고정단에 3개, 롤러에 1개)이고 평형 방정식은 3개이므로 1차 부정정입니다. D도 힌지 지점으로 바꾸면 2차 부정정입니다.
- A가 힌지 지점일 때: $V_D = (10 \cdot 8 \cdot 4 + 10 \cdot 8 - 8 \cdot 6)/8 = 44$ kN, $V_A = 46$ kN, $H_A = 8$ kN(오른쪽 방향). 모서리 B의 모멘트는 $8 \cdot 6 = 48$ kNm입니다. C에서는 0입니다. D에 수평 반력이 없으므로 오른쪽 기둥은 44 kN의 축력만 받습니다.
- 처음 연 상태에서는 위쪽이 오른쪽으로 9.5 mm 움직입니다. 보에 작용하는 하중으로 생긴 모멘트가 고정된 기둥을 8 kN보다 더 크게 휘게 하기 때문입니다. D를 힌지 지점으로 바꾸면 D가 수평으로 4.9 kN을 받고, 위쪽은 왼쪽으로 4.8 mm 움직입니다.
::

### 온도하중 {#exercise-temperature-load}

경간 8 m의 단순보가 부재축을 따라 $\Delta T_c = 20$ K만큼 가열되고, 하연이 상연보다 10 K 낮습니다($\Delta T_b - \Delta T_t = -10$ K).

::model-figure{caption="경간 8 m의 단순보, 20 K 가열, 하연이 상연보다 10 K 낮음"}
---
nodes: { A: [0, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 20, bottom: -10, top: 0 } }
results: []
show: [nodeLabels, dimensions]
---
::

1. 결과를 보기 전에 답하시오. 온도 때문에 어떤 부재력이 생기며, 보는 어떻게 움직이는가?
2. B의 `Dx`를 체크하여 보가 늘어나지 못하게 하시오.
3. 양 끝의 `Ry`도 체크하시오.

**살펴볼 점:** 변형 형상과 **결과 → 절점 결과**의 숫자. 구속하기 전까지 보는 부재력 없이 움직입니다.

::callout{type="details" title="정답"}
- 정정보는 자유롭게 늘어나고 휠 수 있으므로 부재력이 생기지 않습니다. B는 $\alpha \Delta T_c L = 12 \cdot 10^{-6} \cdot 20 \cdot 8 = 1.92$ mm만큼 바깥쪽으로 미끄러집니다. 온도가 낮은 하연이 줄어들므로 보는 곡률 $\kappa = \alpha (\Delta T_b - \Delta T_t)/h = -1.2 \cdot 10^{-4}$ 1/m로 위로 볼록하게 휩니다. 양 끝은 $\kappa L/2 = 0.48$ mrad 회전하고 경간 중앙은 $\kappa L^2/8 = 0.96$ mm 올라갑니다.
- 양 끝을 x 방향으로 구속하면 $N = -EA\alpha\Delta T_c = -50{,}400$ kN의 압축력이 생깁니다. 이렇게 큰 것은 임시로 넣은 단면적 1 m² 때문이며, 단면적 28.48 cm²인 IPE 200이라면 143.5 kN입니다.
- 양 끝을 고정하면 보 전체에 일정한 모멘트 $EI\alpha(\Delta T_b - \Delta T_t)/h = 2.11$ kNm가 생깁니다.
::

## 풀이 튜토리얼 {#worked-tutorials}

단계별로 만들고 손 계산으로 검증하는 더 긴 모델입니다.

::card-grid{cols="2"}
:::card{title="경사 보" icon="lucide:move-diagonal" to="/ko/tutorials/inclined-beam"}
적설하중을 받는 서까래: 수평 투영 길이 1 m당 하중, 경사를 따른 축력과 전단력, 방향을 돌린 롤러 지점.
:::
:::card{title="3힌지 라멘" icon="lucide:triangle" to="/ko/tutorials/three-hinged-frame"}
내부 힌지가 있는 라멘의 반력과 N, V, M.
:::
:::card{title="평면 트러스" icon="lucide:git-fork" to="/ko/tutorials/truss"}
절점법, 단면법, 영부재, 가상일의 원리로 구하는 처짐.
:::
:::card{title="연속보와 지점 침하" icon="lucide:spline" to="/ko/tutorials/continuous-beam"}
2경간 연속보를 응력법으로 푼 다음, 가운데 지점이 10 mm 침하하는 경우를 풉니다.
:::
::

닫힌 해로 검증하는 사례는 [손 계산으로 결과 검증](/ko/guide/verification)에 더 있습니다.

## 더 많은 문제 {#more-problems}

[연습 문제](/ko/practice) 페이지는 요청할 때마다 숫자가 새로운 보, 라멘, 트러스를 내주고, 반력과 최대 모멘트 또는 최대 부재력을 바로 채점합니다. 수업용으로는 [시험지 생성기](/ko/exam)가 학생마다 다른 시험지를 정답지와 함께 인쇄해 주고, [@edubeam/plot](/ko/guide/teaching#exercise-sheets-tests-and-slides-from-code) 라이브러리로는 코드에서 연습 문제지를 만들 수 있습니다.

## 예제 기여하기 {#contribute-an-example}

수업에 쓰기 좋은 모델이 있나요? [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions)에 링크를 공유해 주세요. 갤러리에 추가할 수도 있습니다.
