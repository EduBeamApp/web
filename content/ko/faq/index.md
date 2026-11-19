---
description: "EduBeam에 대한 짧은 답변: 비용, 오프라인 사용, 개인정보, 정확도, 결과 계산 방법, 인용 방법, 연습 문제, 공유, 코드."
source: site
---

# 자주 묻는 질문

짧은 답변과 함께, 주제를 자세히 다루는 페이지로 가는 링크를 달았습니다. 찾는 질문이 없나요? [문제 해결](/ko/reference/troubleshooting)을 보거나 [GitHub에 질문](https://github.com/janvorisek/edubeam/issues)해 주세요.

## 일반 {#general}

### EduBeam은 무엇인가요? {#what-is-edubeam}

2D 보, 라멘, 트러스의 선형 정적 해석을 위한 무료 오픈 소스 앱으로, 즉각적인 피드백을 원하는 학생, 교수자, 엔지니어를 위해 만들었습니다. 브라우저에서 실행됩니다. 할 수 있는 일과 할 수 없는 일은 [소개](/ko/guide/introduction)에 정리되어 있습니다.

### 정말 무료인가요? 계정이 필요한가요? {#is-it-really-free-do-i-need-an-account}

네, 무료이고 계정은 필요 없습니다. [run.edubeam.app](https://run.edubeam.app/?lang=ko){target="_blank"}을 열고 바로 모델링을 시작하세요. 설치할 것도, 사용 제한도 없습니다. 소스 코드는 GPL-3.0 라이선스로 [GitHub](https://github.com/janvorisek/edubeam)에 공개되어 있습니다.

### 어떤 브라우저와 기기에서 작동하나요? {#which-browsers-and-devices-work}

최신 Chrome, Edge, Firefox, Safari라면 컴퓨터, 태블릿, 휴대폰 어디서든 작동합니다. 터치스크린에서는 탭해서 선택하고, 절점을 드래그해 옮기고, 다른 곳을 드래그해 화면을 이동하고, 두 손가락을 벌리거나 모아 확대/축소하고, 길게 눌러 캔버스 메뉴를 엽니다. 그래도 모델링은 마우스와 키보드가 더 빠릅니다. [키보드, 마우스 및 터치](/ko/reference/shortcuts#touch)를 참고하세요.

### 모델이 사라졌습니다. 되찾을 수 있나요? {#i-lost-my-model-can-i-get-it-back}

아마 가능합니다. 모델을 지우거나 링크, 파일, 예제를 열어 모델이 바뀌면 EduBeam이 이전 모델을 **☰ → 최근 구조물**(최근 10개)에 보관하며, <kbd>Ctrl</kbd>+<kbd>Z</kbd>로 바뀌기 전으로 되돌릴 수도 있습니다. 둘 다 지금 쓰는 브라우저에만 있으므로, 다른 컴퓨터나 다른 브라우저 프로필에서 만든 모델은 그곳에 없습니다. [최근 구조물](/ko/essentials/import-export#recent-structures)을 참고하세요.

### 오프라인에서도 쓸 수 있나요? {#can-i-use-it-offline}

네. EduBeam은 프로그레시브 웹 앱입니다. 브라우저에서 한 번 불러오면 인터넷 연결 없이도 작동하며, 브라우저가 설치를 제안할 수도 있습니다. 새 버전이 나오면 업데이트하기 전에 대화 상자로 묻습니다.

### 데이터는 어디에 저장되나요? {#where-is-my-data-stored}

브라우저에 저장됩니다. 계정도 클라우드 저장소도 없습니다. 앱은 모델과 설정을 지금 쓰는 브라우저에 보관하고, 공유 링크는 모델을 링크 안에 담아 전달합니다. [브라우저에 저장되는 내용](/ko/essentials/units-settings#what-is-stored-in-your-browser)을 참고하세요.

다만 run.edubeam.app의 앱은 사용 통계(Google Analytics)와 오류 보고(Sentry)를 수집합니다. 오류 보고와, Sentry가 일부 세션을 골라 녹화한 내용에는 화면에 보이던 내용이 담길 수 있으며, 모델도 여기에 포함됩니다.

### 구조역학 문제는 어디에서 연습할 수 있나요? {#practice}

[연습 문제](/ko/practice) 페이지에서 할 수 있습니다. 매번 새 수치로 된 보, 라멘, 트러스 문제가 나옵니다. 반력과 최대 휨모멘트 또는 부재력을 종이에 구해 입력하면 값마다 바로 채점됩니다. [예제](/ko/examples/)에도 질문과 정답이 있습니다. 교수자는 [시험지 생성기](/ko/exam)로 학생마다 다른 시험지를 정답지와 함께 인쇄할 수 있습니다. [연습 문제와 시험지](/ko/guide/teaching#practice-and-test-papers)를 참고하세요.

### EduBeam은 어떻게 인용하나요? {#cite}

소프트웨어로 인용하고, 사용한 버전과 날짜를 적습니다. 버전은 **☰** 메뉴 맨 아래에 있습니다. 예:

> Voříšek, J. 외. *EduBeam* (버전 1.3.4) \[소프트웨어\]. https://edubeam.app (검색일: 2026. 11. 18.)

특정 모델을 가리키려면 그 모델의 [공유 링크](/ko/essentials/import-export#share-a-link)를 덧붙이세요. 모든 독자에게 같은 모델이 열립니다.

## 모델링 {#modelling}

### 고정 / 힌지 / 롤러 지점은 어떻게 만드나요? {#how-do-i-make-a-fixed-pinned-roller-support}

절점을 클릭하고 **지지조건**을 고른 다음 힌지, 롤러, 고정단, 슬라이더 등의 기호를 선택합니다. 또는 **절점** 탭에서 구속할 자유도를 체크합니다. `Dx` + `Dz` + `Ry`는 고정단, `Dx` + `Dz`는 힌지 지점, `Dz`만 체크하면 롤러 지점입니다. 모든 유형은 [절점 및 지점](/ko/essentials/nodes-supports#supports)에 정리되어 있습니다.

### 트러스는 어떻게 만드나요? {#how-do-i-make-a-truss}

부재를 일반 요소로 그리고 각 부재 양 끝의 모멘트를 해제합니다. **요소** 탭에서 **단부 힌지** 두 칸을 모두 체크하거나, 마우스로 부재를 그리기 전에 배너에서 **시작단 힌지**와 **끝단 힌지**를 체크합니다. 하중은 절점에 가합니다. [평면 트러스 튜토리얼](/ko/tutorials/truss)에서 트러스 하나를 단계별로 만들어 봅니다.

### 라멘에 힌지는 어떻게 넣나요? {#how-do-i-put-a-hinge-in-a-frame}

자유롭게 회전해야 하는 요소 끝의 모멘트를 해제합니다. **요소** 탭에서 그 요소의 단부 힌지를 체크하면 됩니다. 힌지는 요소의 한쪽 끝에 속하므로, 여러 요소가 모이는 절점에서 그중 하나만 해제하면 나머지 요소는 강절점으로 연결된 채로 남습니다. [단부 힌지](/ko/essentials/elements#end-hinges)를 참고하세요.

### 보 중간에 지점이나 집중하중을 추가하려면 어떻게 하나요? {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

지점을 넣으려면 마우스로 보 위에 절점을 추가하고(커서 아이콘이 있는 **절점 추가** 버튼) **구조물에 연결**을 고릅니다. 보가 그 절점에서 둘로 나뉘고, 그 절점에 지점을 줄 수 있습니다. 집중하중에는 절점이 필요 없습니다. 요소에 **집중하중**을 추가하고 시작 절점으로부터의 위치를 지정하세요. [기존 요소 위에 절점 배치](/ko/essentials/nodes-supports#placing-a-node-on-an-existing-element)와 [집중하중](/ko/essentials/loads#concentrated-load)을 참고하세요.

### 자중을 가할 수 있나요? {#can-i-apply-self-weight}

자동으로는 안 됩니다. 재료의 밀도는 정적 해석에 쓰이지 않습니다. 등분포하중 $f_z = \rho g A$로 입력하세요. 예를 들어 IPE 200이라면 $7850 \cdot 9.81 \cdot 28.48 \cdot 10^{-4} = 219$ N/m, 즉 0.22 kN/m입니다.

### 경사 지점을 모델링할 수 있나요? {#can-i-model-inclined-supports}

네. 절점에 **절점 좌표계 각도**를 주면 그 절점의 지점이 회전된 좌표축을 따라 작용합니다. [경사 지점](/ko/essentials/nodes-supports#inclined-skewed-supports)을 참고하세요.

### 미국 단위로 작업할 수 있나요? {#can-i-work-in-us-customary-units}

네. 뷰어 오른쪽 아래의 단위 칩을 클릭하면 **설정 → 언어 및 지역**이 열립니다. 피트와 킵을 쓰려면 **단위계**에서 **미국 단위 (야드파운드법)** 항목을 고르고, 단위를 하나씩 따로 고를 수도 있습니다. 모델은 SI 단위로 저장되므로 단위를 바꾸면 화면에 보이는 값만 환산되고 모델은 바뀌지 않습니다. [단위 및 설정](/ko/essentials/units-settings)을 참고하세요.

### 하중조건이나 하중조합이 있나요? {#are-there-load-cases-or-combinations}

아니요, 모델 하나에는 하중조건이 하나뿐입니다. 하중조건마다 따로 파일이나 링크로 저장하고, 결과는 직접 조합하세요. 하중조건이 여러 개인 데스크톱 EduBeam 세션은 첫 번째 하중조건으로 열리며, 열지 않은 하중조건은 메시지로 알려 줍니다.

### 하중이 왜 위를 향하나요? {#why-do-my-loads-point-up}

아마 음수 값을 입력했기 때문입니다. EduBeam에서 전체 z축은 **아래**를 향하므로, 양의 `fz`나 `Fz`는 아래 방향, 즉 중력 방향 하중입니다. 아래 방향 12 kN/m는 `fz = 12`입니다. [좌표계 및 부호 규약](/ko/elements/conventions#loads)을 참고하세요. 강의에서 연직축이 위를 향하는 좌표계를 쓴다면 **설정 → 언어 및 지역 → 좌표계**에서 **x 오른쪽, y 위**로 바꾸세요. 그러면 입력과 결과가 그 좌표축을 따릅니다.

## 결과 {#results}

### 왜 “해석” 버튼이 없나요? {#why-is-there-no-solve-button}

무엇을 바꾸든 모델이 다시 해석되기 때문입니다. 결과가 나타나지 않으면 모델을 아직 해석할 수 없는 상태이며, 캔버스의 메시지가 그 이유를 알려 줍니다. 확인할 사항은 [문제 해결](/ko/reference/troubleshooting#no-results-are-drawn)에 있습니다.

### 처짐이 공식과 조금 다른 이유는 무엇인가요? {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam은 Timoshenko 보 요소를 쓰므로, 처짐에 교과서 공식이 보통 생략하는 전단 변형이 포함됩니다. 세장한 보에서는 차이가 1 % 정도이며, [빠른 시작](/ko/guide/quick-start#_8-check-by-hand)에서 이를 손으로 더해 봅니다. 부정정 구조물에서는 전단 강성 때문에 부재력도 조금 달라집니다. 자세한 내용은 [손 계산으로 결과 검증](/ko/guide/verification)에 있습니다.

### 결과는 얼마나 정확한가요? 요소를 더 나눠야 하나요? {#how-accurate-are-the-results-do-i-need-more-elements}

선형 정적 해석에서 보 요소는 EduBeam이 제공하는 모든 하중 유형에 대해 정확해를 주므로, 부재 하나에 요소 하나면 충분하고 요소를 잘게 나눌 필요가 없습니다. 절점은 지점, 힌지, 단면 변화, 절점하중이 필요한 곳이나 변위를 읽을 곳에만 추가하세요. [정밀도와 정확도](/ko/essentials/results#precision-and-accuracy)를 참고하세요.

### EduBeam은 결과를 어떻게 계산하나요? {#how-does-edubeam-compute-the-results}

구조해석 강의에서 배우는 유한요소법의 직접강성법으로, 브라우저 안에서 계산합니다. [EduBeam의 해석 과정](/ko/elements/analysis)에서 손으로 따라 할 수 있는 작은 예제로 각 단계를 살펴보며, 솔버 자체도 오픈 소스 라이브러리 [@edubeam/fem](/ko/solver)으로 공개되어 있습니다.

### 강성 행렬을 볼 수 있나요? {#can-i-see-the-stiffness-matrices}

네. **요소** 탭에서 요소 행의 행렬 버튼을 누르면 전체 좌표계와 SI 단위(N, m)로 된 6 × 6 강성 행렬이 열립니다. 뷰어에서 요소를 클릭해도 **강성 행렬**을 열 수 있습니다. 유도 과정은 [보 요소](/ko/elements/beam#global-stiffness-matrix) 페이지에 있습니다.

### 반력은 어디에 나오나요? {#where-are-the-reactions-listed}

뷰어에 값이 붙은 화살표로 나옵니다. 표시 옵션의 **반력**이며 기본으로 켜져 있습니다. **결과 → CSV 내보내기**로 받은 파일과 **복사**로 클립보드에 넣은 내용에도 들어 있습니다. **결과** 탭에는 절점 변위와 요소 단부력이 나옵니다. [결과 및 다이어그램](/ko/essentials/results)을 참고하세요.

## 파일 및 공유 {#files-sharing}

### 모델은 어떻게 공유하나요? {#how-do-i-share-a-model}

**모델 공유**를 누르고 **복사**를 누릅니다. 링크에는 모델 전체가 담기며, 링크를 연 사람은 각자 편집할 수 있는 사본을 받습니다. 실시간 공동 작업 기능은 없습니다. 링크를 열었을 때 내 다이어그램과 레이블이 켜진 상태로 보이게 하려면 **내 화면 그대로 보기**를 켜세요. [링크 공유](/ko/essentials/import-export#share-a-link)와, 강의용으로는 [EduBeam으로 가르치기](/ko/guide/teaching#in-lecture-notes-and-assignments)를 참고하세요.

### 웹 사이트나 슬라이드에 모델을 삽입할 수 있나요? {#can-i-embed-a-model-on-my-website-or-in-slides}

네. 공유 링크에 `&viewer=1`을 붙여 `<iframe>`에 넣으세요. [뷰어 삽입](/ko/essentials/import-export#embed-a-read-only-viewer)을 참고하세요. 웹 페이지, 슬라이드, 인쇄용 강의 노트에 넣을 정적인 그림이 필요하면 SVG로 내보내거나 [@edubeam/plot](/ko/plot)으로 코드에서 그리세요.

### 이미지나 표를 내보낼 수 있나요? {#can-i-export-images-or-tables}

네. **☰ → 이미지 내보내기**(<kbd>Ctrl</kbd>+<kbd>P</kbd>)는 원하는 크기나 축척으로 그림을 PNG나 SVG로 저장합니다. **결과 → CSV 내보내기**는 두 결과 표를 저장하고, **복사**는 스프레드시트에 붙여 넣을 수 있도록 표를 클립보드에 넣습니다. [이미지 내보내기](/ko/essentials/import-export#export-an-image)를 참고하세요.

### 데스크톱 EduBeam의 파일을 열 수 있나요? {#can-i-open-files-from-the-desktop-edubeam}

네. 데스크톱 EduBeam 2.x–3.5에서 저장한 세션(`.xml`)은 `project.json`과 똑같이 **☰ → 프로젝트 열기**로 열거나 앱 위에 끌어다 놓으면 열립니다. 값은 kN, kPa, m 단위로 읽힙니다. [프로젝트 열기](/ko/essentials/import-export#open-a-project)를 참고하세요.

### 프로그램으로 모델을 생성할 수 있나요? {#can-i-generate-models-programmatically}

네, 두 가지 방법이 있습니다.

- **파일을 직접 작성합니다.** `project.json`은 SI 단위로 된 일반 JSON이므로 어떤 언어로 된 스크립트로든 작성할 수 있고, EduBeam에서 **프로젝트 열기**나 끌어다 놓기로 엽니다. [프로젝트 파일 형식](/ko/essentials/import-export#project-file-format)을 참고하세요.
- **코드에서 풉니다.** [@edubeam/fem](/ko/solver)은 EduBeam의 유한요소 솔버를 JavaScript와 TypeScript 라이브러리로 제공합니다. 그 결과를 [@edubeam/plot](/ko/plot)으로 그릴 수 있으며, 예를 들어 [자동 생성 연습 문제지](/ko/plot/exercises)를 만들 수 있습니다.

[빠른 시작](/ko/guide/quick-start)의 보를 SI 단위로 쓰면 다음과 같습니다.

```ts
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial('steel', { e: 210e9, g: 81e9 }) // Pa
const section = { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 } // m², m⁴, m
domain.createCrossSection('IPE200', section)
domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]) // 힌지 지점
domain.createNode('2', [6, 0, 0], [DofID.Dz]) // 롤러 지점
const beam = domain.createBeam2D('1', ['1', '2'], 'steel', 'IPE200')
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad('1', [0, 12e3], true) // 12 kN/m, 아래 방향

solver.solve()
beam.computeBendingMomentAt(lc, 3) // 경간 중앙에서 54000 N·m
beam.computeLocalDefl(lc, 2).w[1] // 경간 중앙에서 0.0502 m
```

## 지원 {#support}

### 버그 신고나 기능 요청은 어떻게 하나요? {#how-do-i-report-a-bug-or-request-a-feature}

[GitHub](https://github.com/janvorisek/edubeam/issues)에 이슈를 등록하고, 문제를 보여 주는 공유 링크나 프로젝트 파일을 첨부해 주세요. 공개하기 어려운 질문은 [support@edubeam.app](mailto:support@edubeam.app)으로 보내 주세요.
