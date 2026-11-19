---
title: 빠른 시작
description: "EduBeam의 유한요소 솔버인 @edubeam/fem 라이브러리를 설치하고, TypeScript 십여 줄로 단순보를 풀어 결과를 읽고 검증합니다."
order: 1
group: 시작하기
source: site
---

# 빠른 시작 {#getting-started}

@edubeam/fem 라이브러리는 [EduBeam]{.edubeam}의 계산을 맡은 유한요소 솔버입니다. 앱이 보여 주는 다이어그램, 반력, 처짐은 모두 이 솔버가 계산합니다. 직접 작성한 코드에서 이 라이브러리로 평면 보, 라멘, 트러스를 풀 수 있습니다. 브라우저와 Node 어디서나 동작하므로 정답이 딸린 연습 문제를 만들거나, 과제를 채점하거나, 매개변수 연구를 하거나, 웹 페이지의 백엔드에서 솔버를 돌릴 수 있습니다.

::div{.actions}
[첫 번째 보 풀기](#a-simply-supported-beam) [예제 프로그램 보기](/ko/solver/beams)
::

TypeScript로 작성되었고 타입 정의를 함께 제공하며, GPL-3.0 라이선스로 배포되는 자유 소프트웨어입니다. Bořek Patzák이 만들었고, Jan Voříšek 및 여러 기여자와 함께 개발하고 있습니다.

## 설치 {#install}

```bash
npm install @edubeam/fem
```

`import`와 `require` 모두 쓸 수 있고, 브라우저와 Node 18 이상에서 동작합니다. 의존성은 [mathjs](https://mathjs.org) 하나뿐입니다. 0.3.0 이전에는 GitHub에서 `ts-fem`이라는 이름으로 설치했습니다. 그 패키지를 쓰고 있었다면 import 경로를 `@edubeam/fem`으로 바꾸세요. 그 밖에 바뀐 것은 없습니다.

아래 예제를 빈 폴더에서 실행해 보려면, 먼저 그 폴더를 `import`를 쓰는 프로젝트로 만든 다음 설치합니다.

```bash
npm init -y
npm pkg set type=module
npm install @edubeam/fem
```

`package.json`에 `"type": "module"`이 없어도 예제는 실행되지만, Node가 먼저 경고를 출력합니다.

## 첫 번째 보 {#a-simply-supported-beam}

길이 6 m의 강재 보(IPE 200)를 힌지 지점과 롤러 지점으로 받치고, 12 kN/m의 등분포하중을 가합니다.

```ts [beam.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver

// 단위는 모두 SI: m, N, Pa. 강재와 IPE 200
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

// 절점 좌표 [x, y, z](m)와 지점이 구속하는 자유도
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // 힌지 지점
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // 롤러 지점
const beam = domain.createBeam2D(1, ['A', 'B'], 'steel', 'IPE200')

// 부재의 국부 z 방향으로 12 kN/m: 왼쪽에서 오른쪽으로 그린 보에서는 아래쪽
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad(1, [0, 12e3], true)

solver.solve()

console.log(beam.computeBendingMomentAt(lc, 3)) // 경간 중앙의 휨모멘트, N·m
console.log(beam.computeShearForceAt(lc, 0)) // A의 전단력, N
console.log(beam.computeLocalDefl(lc, 2).w[1]) // 경간 중앙의 처짐, m
```

`beam.ts`로 저장하고 `node beam.ts`로 실행합니다. Node 22.18 이상은 TypeScript를 그대로 실행합니다. 이 파일에는 타입 표기가 없으므로, 그보다 오래된 Node에서는 `beam.mjs`로 저장하세요. 출력은 다음과 같습니다.

```text [출력]
54000
36000
0.04990940552616746
```

교과서 값과 같은 $M = qL^2/8 = 54$ kNm, $V = qL/2 = 36$ kN입니다. 아래 그림은 같은 보를 같은 솔버가 브라우저에서 푼 결과입니다.

::model-figure{caption="위의 보: 6 m, IPE 200, 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9, g: 81e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 0.8333333 }
---
::

처짐 49.91 mm는 Euler–Bernoulli 보의 공식 $5qL^4/384EI = 49.63$ mm보다 0.28 mm 큽니다. 오류가 아닙니다. 이 부재는 Timoshenko 보이고, 0.28 mm는 이 보의 전단 변형 $qL^2/8kGA$입니다. `k`를 `1e32`처럼 아주 큰 값으로 바꾸면 이 차이는 사라집니다. [전단 변형](/ko/solver/materials-sections#shear-deformation)을 참고하세요.

## 코드가 하는 일 {#what-the-code-does}

::div{.steps}
### 솔버 만들기 {#make-a-solver}

`new LinearStaticSolver()`로 만든 솔버에는 모델을 담는 빈 `domain`과 하중조건 하나, `solver.loadCases[0]`이 들어 있습니다.

### 모델 정의하기 {#describe-the-model}

재료와 단면, 지점이 있는 절점, 그리고 절점 사이의 부재를 차례로 만듭니다. 모든 객체에는 레이블(문자열 또는 숫자)이 있고, 모델의 나머지 부분은 이 레이블로 그 객체를 가리킵니다. [절점 및 지점](/ko/solver/nodes-supports), [재료 및 단면](/ko/solver/materials-sections), [부재 및 힌지](/ko/solver/members-hinges)를 참고하세요.

### 하중 가하기 {#load-it}

하중은 하중조건에 속합니다. 절점에 작용하는 힘, 부재를 따라 작용하는 하중, 온도하중, 지점 침하가 있습니다. [절점하중 및 부재하중](/ko/solver/loads)을 참고하세요.

### 풀기 {#solve}

`solver.solve()`는 모든 하중조건에 대해 강성 행렬을 조립하고 풉니다. [해석](/ko/solver/solving)을 참고하세요.

### 결과 읽기 {#read-the-results}

부재 위 임의 위치의 부재력, 처짐, 단부력, 절점 변위, 반력을 읽을 수 있습니다. [결과 읽기](/ko/solver/results)를 참고하고, 다이어그램은 [결과 그리기](/ko/solver/drawing)를 참고하세요.
::

## 단위와 부호 요약 {#axes-and-signs}

SI 단위로 넣으면 SI 단위로 나옵니다. 모델은 x–z 평면에 있고 **z축은 아래쪽**을 향합니다. 따라서 양의 `fz`는 아래로 누르고, 높이 4 m 기둥의 상단은 $z = -4$에 있습니다. 부재 위의 위치는 첫 번째 절점에서 잰 거리(m)입니다. 정모멘트(하연 인장)가 양수입니다. 전체 목록은 [단위 및 부호](/ko/solver/conventions)에 있습니다.

## 자주 실수하는 여섯 가지 {#pitfalls}

1. **z축은 아래쪽입니다.** 중력 방향 하중은 양수이고, 지점보다 위에 있는 것은 z가 음수입니다. [좌표축](/ko/solver/conventions#axes)을 참고하세요.
2. **부재의 방향이 M과 w의 부호를 정합니다.** 보는 왼쪽에서 오른쪽으로, 기둥은 아래에서 위로 정의하면 부호가 교과서와 같아집니다. [부재 방향](/ko/solver/conventions#member-direction)을 참고하세요.
3. **매개변수가 빠지면 오류 대신 `NaN`이나 엉뚱한 값이 나옵니다.** 단면에는 `a`, `iy`, `k`가 필요합니다. 재료에는 `e`가 필요하고, `k`가 아주 크지 않다면 `g`도 필요합니다. [재료 및 단면](/ko/solver/materials-sections)을 참고하세요.
4. **절점이나 부재를 추가했거나 지점을 바꿨다면** 다시 풀기 전에 `solver.codeNumberGenerated = false`로 설정하세요. [변경 후 다시 풀기](/ko/solver/solving#solving-again-after-a-change)를 참고하세요.
5. **반력은 mathjs 행렬 또는 배열로 반환됩니다.** 순서는 지점의 자유도를 지정한 순서입니다. [반력](/ko/solver/results#reactions)을 참고하세요.
6. **메커니즘이라고 해서 항상 오류가 나지는 않습니다.** 변위가 $10^{12}$ m 정도로 나오면 구조물이 자유롭게 움직일 수 있다는 뜻입니다. [해석이 실패할 때](/ko/solver/solving#when-solving-fails)를 참고하세요.

## 다음 단계 {#next}

::card-grid{cols="2"}
:::card{title="예제 프로그램" icon="lucide:book-open" to="/ko/solver/beams"}
검증을 마친 완전한 프로그램: 보, 라멘, 트러스, 정답지가 딸린 연습 문제지, 작은 HTTP 서버.
:::
:::card{title="결과 그리기" icon="lucide:chart-spline" to="/ko/solver/drawing"}
풀린 모델을 @edubeam/plot에 넘기면 다이어그램을 SVG로 얻습니다. Vue에서도, Node 스크립트에서도 쓸 수 있습니다.
:::
:::card{title="API 레퍼런스" icon="lucide:list-tree" to="/ko/solver/reference"}
모든 클래스, 메서드, 인수를 단위 및 반환값과 함께 정리했습니다.
:::
:::card{title="이론" icon="lucide:sigma" to="/ko/elements/beam"}
EduBeam 이론 매뉴얼에서 보 요소와 그 강성 행렬, 좌표 변환을 설명합니다.
:::
::
