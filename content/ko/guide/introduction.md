---
description: "EduBeam 소개: 2D 보, 라멘, 트러스를 브라우저에서 푸는 무료 유한요소 프로그램. 할 수 있는 일과 없는 일, 대상, 사용 설명서의 구성, 바탕이 되는 오픈 소스 라이브러리."
source: site
---

# 소개

[EduBeam]{.edubeam}은 **보, 라멘, 트러스**를 해석하는 무료 구조 해석 앱으로, 브라우저에서 바로 실행됩니다. 구조물을 그리고 지점과 하중을 넣으면, 무엇을 바꾸든 유한요소 솔버가 다이어그램, 반력, 처짐을 곧바로 다시 계산합니다. *해석* 버튼도, 설치도, 계정도 필요 없습니다.

::div{.actions}
[EduBeam 실행 ↗](https://run.edubeam.app/?lang=ko){target="_blank"} [빠른 시작 (10분)](/ko/guide/quick-start)
::

![EduBeam의 3힌지 라멘: 하중은 주황색, 반력은 보라색, 휨모멘트는 빨간색, 변형 형상은 회색](/screenshots/ko/hero.webp)

:span{#your-first-visit}

## 할 수 있는 일 {#what-it-does}

::card-grid{cols="2"}
:::card{title="구조물" icon="lucide:triangle" to="/ko/essentials/elements"}
x–z 평면의 보, 연속보, 라멘, 트러스를 Timoshenko 보 요소로 모델링합니다. 단부 힌지를 넣으면 부재가 트러스 부재가 됩니다.
:::
:::card{title="지점" icon="lucide:anchor" to="/ko/essentials/nodes-supports#supports"}
힌지 지점, 롤러 지점, 고정단, 슬라이더, 또는 `Dx`, `Dz`, `Ry` 구속의 어떤 조합이든 기호를 보고 고릅니다. 경사 지점과 지점 침하도 다룹니다.
:::
:::card{title="하중" icon="lucide:arrow-down-to-line" to="/ko/essentials/loads"}
절점이나 부재 위 어디에나 가하는 힘과 모멘트, 등분포하중과 사다리꼴 분포하중, 온도하중, 강제변위.
:::
:::card{title="단면" icon="lucide:shapes" to="/ko/essentials/elements#cross-sections"}
유럽 및 미국 규격의 단면 라이브러리에서 고르거나 임의의 다각형을 직접 그립니다. $A$, $I_y$, $I_z$, $I_{yz}$, 주축, 회전반경은 자동으로 계산됩니다.
:::
:::card{title="결과" icon="lucide:chart-spline" to="/ko/essentials/results"}
**N**, **V**, **M** 다이어그램, 변형 형상, 반력, 절점 변위, 단부력, 요소 강성 행렬.
:::
:::card{title="해석" icon="lucide:calculator" to="/ko/elements/analysis"}
선형 정적 해석으로 선형 모델의 정확해를 구하므로 요소를 잘게 나눌 필요가 없습니다. 구조물이 불안정하면 그 이유를 설명하고, 움직이는 모습을 애니메이션으로 보여 줍니다.
:::
:::card{title="파일" icon="lucide:folder-open" to="/ko/essentials/import-export"}
프로젝트는 JSON으로, 모델 전체는 링크로, 그림은 PNG나 SVG로, 결과는 CSV로 저장합니다. 다른 모델로 바뀌어도 이전 모델은 보관되며, 어떤 데이터도 기기 밖으로 나가지 않습니다.
:::
:::card{title="단위" icon="lucide:ruler" to="/ko/essentials/units-settings"}
클릭 한 번으로 SI 또는 미국 단위로 바꾸거나 물리량마다 따로 정합니다. z축은 아래 방향, 또는 교과서처럼 y축 위 방향.
:::
::

## (아직) 할 수 없는 일 {#what-it-does-not-do-yet}

한계를 미리 알아 두면 시간을 아낄 수 있습니다.

::div{.limits}
- **2D 전용.** 면외 거동과 3D 골조는 다루지 않습니다.
- **선형 정적 해석 전용.** 2차(P–Δ) 효과, 좌굴, 동적 해석, 소성은 다루지 않습니다.
- **하중조건 하나.** 하중조합과 포락선은 없습니다. 하중조건마다 따로 파일이나 링크로 저장하세요.
- **자중 없음.** 분포하중으로 가하세요.
- **설계 검토 없음.** EduBeam은 부재력과 변위를 계산합니다. 설계기준에 따른 검토는 사용자가 직접 해야 합니다.
::

꼭 필요한 기능이 없다면 [이슈를 등록](https://github.com/janvorisek/edubeam/issues)해 주세요.

::elementarium-promo{placement="introduction"}
::

## 누구를 위한 도구인가요? {#who-is-it-for}

::card-grid{cols="2"}
:::card{title="학생" icon="lucide:graduation-cap" to="/ko/practice"}
손 계산 결과를 바로 확인할 수 있고, 풀어 가는 동안 답을 채점해 주는 연습 문제가 있습니다.
:::
:::card{title="교수자" icon="lucide:presentation" to="/ko/guide/teaching"}
지점, 힌지, 하중에 따라 부재력이 어떻게 달라지는지 프로젝터로 실시간으로 보여 줄 수 있고(18개 언어 지원), 학생마다 다른 시험지를 인쇄할 수 있습니다.
:::
:::card{title="엔지니어" icon="lucide:hard-hat" to="/ko/elements/analysis"}
무거운 데스크톱 프로그램을 열기 전에 빠르게 검산할 수 있으며, 풀이의 모든 단계가 문서로 정리되어 있습니다.
:::
:::card{title="개발자" icon="lucide:code-xml" to="#libraries"}
EduBeam의 솔버와 그리기 기능을 오픈 소스 라이브러리로 공개하므로 직접 작성한 코드에서 쓸 수 있습니다.
:::
::

## 사용 설명서 둘러보기 {#how-this-guide-is-organised}

사이드바에는 페이지가 아래와 같이 묶여 있습니다. 앱의 **?** 버튼을 누르면 이 사용 설명서의 해당 페이지가 앱과 같은 언어로 열립니다.

::card-grid{cols="2"}
:::card{title="시작하기" icon="lucide:flag" to="/ko/guide/quick-start"}
이 페이지와 빠른 시작: 10분 만에 그리는 첫 번째 보.
:::
:::card{title="모델 만들기" icon="lucide:pencil-ruler" to="/ko/essentials/user-interface"}
인터페이스, 절점과 지점, 요소, 재료와 단면, 하중, 단위와 설정.
:::
:::card{title="결과 읽기" icon="lucide:chart-spline" to="/ko/essentials/results"}
다이어그램과 결과 표, 그리고 손 계산으로 검증하는 방법.
:::
:::card{title="공유 및 강의" icon="lucide:share-2" to="/ko/essentials/import-export"}
프로젝트 파일, 공유 링크, 이미지와 CSV 내보내기, EduBeam으로 가르치기.
:::
:::card{title="튜토리얼" icon="lucide:triangle" to="/ko/tutorials/inclined-beam"}
경사 보, 3힌지 라멘, 평면 트러스, 지점 침하가 있는 연속보. 하나씩 단계별로 만들고 손 계산으로 검증합니다.
:::
:::card{title="예제" icon="lucide:library" to="/ko/examples/"}
클릭 한 번으로 열리는 완성된 모델 6개. 연습 문제와 정답이 함께 있습니다.
:::
:::card{title="이론 매뉴얼" icon="lucide:sigma" to="/ko/elements/conventions"}
좌표계 및 부호 규약, 보 요소와 트러스 요소, EduBeam의 해석 과정.
:::
:::card{title="도움말" icon="lucide:life-buoy" to="/ko/reference/shortcuts"}
키보드, 마우스, 터치 조작, 문제 해결, 자주 묻는 질문.
:::
::

## 나만의 도구 만들기 {#libraries}

EduBeam은 두 개의 오픈 소스 라이브러리 위에 만들어졌으며, 두 라이브러리의 문서도 이 사이트에 있습니다. 스크립트로 구조물을 풀거나, 학생마다 다른 연습 문제를 만들거나, 슬라이드와 강의 노트에 넣을 그림을 그릴 때 쓸 수 있습니다.

::card-grid{cols="2"}
:::card{title="@edubeam/fem" icon="lucide:package" to="/ko/solver"}
EduBeam의 유한요소 솔버를 TypeScript로 제공합니다. 브라우저나 Node에서 열두 줄 남짓한 코드로 보를 모델링하고, 풀고, 결과를 읽습니다.
:::
:::card{title="@edubeam/plot" icon="lucide:spline" to="/ko/plot"}
해석이 끝난 구조물을 하중, 반력, N, V, M 다이어그램과 함께 SVG로 그리는 Vue 3 컴포넌트.
:::
::

## 언어 {#languages}

EduBeam은 18개 언어를 지원하며, 처음에는 브라우저의 언어로 열립니다. **설정 → 언어 및 지역**에서 바꾸거나 여기에서 고르세요.

::div{.chips}
- [:icon{name="circle-flags:lang-en"} English](https://run.edubeam.app/?lang=en){target="_blank"}
- [:icon{name="circle-flags:lang-id"} Bahasa Indonesia](https://run.edubeam.app/?lang=id){target="_blank"}
- [:icon{name="circle-flags:lang-cs"} Čeština](https://run.edubeam.app/?lang=cs){target="_blank"}
- [:icon{name="circle-flags:lang-de"} Deutsch](https://run.edubeam.app/?lang=de){target="_blank"}
- [:icon{name="circle-flags:lang-es"} Español](https://run.edubeam.app/?lang=es){target="_blank"}
- [:icon{name="circle-flags:lang-fr"} Français](https://run.edubeam.app/?lang=fr){target="_blank"}
- [:icon{name="circle-flags:lang-it"} Italiano](https://run.edubeam.app/?lang=it){target="_blank"}
- [:icon{name="circle-flags:lang-pl"} Polski](https://run.edubeam.app/?lang=pl){target="_blank"}
- [:icon{name="circle-flags:lang-pt-br"} Português](https://run.edubeam.app/?lang=pt){target="_blank"}
- [:icon{name="circle-flags:lang-vi"} Tiếng Việt](https://run.edubeam.app/?lang=vi){target="_blank"}
- [:icon{name="circle-flags:lang-ru"} Русский](https://run.edubeam.app/?lang=ru){target="_blank"}
- [:icon{name="circle-flags:lang-tr"} Türkçe](https://run.edubeam.app/?lang=tr){target="_blank"}
- [:icon{name="circle-flags:lang-uk"} Українська](https://run.edubeam.app/?lang=uk){target="_blank"}
- [:icon{name="circle-flags:lang-hi"} हिन्दी](https://run.edubeam.app/?lang=hi){target="_blank"}
- [:icon{name="circle-flags:lang-ja"} 日本語](https://run.edubeam.app/?lang=ja){target="_blank"}
- [:icon{name="circle-flags:lang-ko"} 한국어](https://run.edubeam.app/?lang=ko){target="_blank"}
- [:icon{name="circle-flags:lang-th"} ไทย](https://run.edubeam.app/?lang=th){target="_blank"}
- [:icon{name="circle-flags:lang-zh"} 中文](https://run.edubeam.app/?lang=cn){target="_blank"}
::

링크로 언어를 정해 줄 수도 있습니다. `run.edubeam.app/?lang=ko`는 한국어로 열립니다.

## 개발자 및 감사의 글 {#authors-credits}

[EduBeam]{.edubeam}은 [Jan Voříšek](https://github.com/janvorisek)이 독립 프로젝트로 개발하고 있습니다. 그 바탕은 [프라하 체코 공과대학교(CTU) 토목공학부](https://www.fsv.cvut.cz/en) 역학과의 [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/), [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/)가 만든 Windows와 Linux용 데스크톱 EduBeam이며, 지금도 그 세션 파일을 열 수 있습니다. [@edubeam/fem](/ko/solver) 솔버는 Bořek Patzák이 만든 첫 버전에서 발전했습니다. 앱과 솔버 모두 GPL-3.0 라이선스의 오픈 소스입니다.

::team-members{size="small" :members='[{"avatar":"https://www.github.com/janvorisek.png","name":"Jan Voříšek","title":"수석 개발자 및 제품 디자이너","links":[{"icon":"github","link":"https://github.com/janvorisek"},{"icon":"twitter","link":"https://twitter.com/janvorisekdev"}]},{"avatar":"https://www.github.com/kelidas.png","name":"Václav Sadílek","title":"개발자: 터치 조작, 그리기 성능, 하중과 지점","links":[{"icon":"web","link":"https://www.stm.fce.vutbr.cz/sadilek/"},{"icon":"github","link":"https://github.com/kelidas"}]},{"avatar":"https://www.github.com/bpatzak.png","name":"Bořek Patzák","title":"원래 EduBeam과 최초의 유한요소 솔버","links":[{"icon":"github","link":"https://github.com/bpatzak"}]}]'}
::

## 기여하기 {#contribute}

::card-grid{cols="3"}
:::card{title="문제 알리기" icon="lucide:bug" to="https://github.com/janvorisek/edubeam/issues"}
헷갈리거나 틀리거나 제대로 작동하지 않는 부분이 있나요? GitHub에 이슈를 올리면 개발팀에 전달됩니다.
:::
:::card{title="번역 개선" icon="lucide:languages" to="https://github.com/janvorisek/edubeam/tree/main/src/locales"}
앱의 문구는 언어마다 파일 하나에 들어 있습니다. 풀 리퀘스트를 환영합니다.
:::
:::card{title="널리 알리기" icon="lucide:share-2"}
동기와 동료에게 EduBeam을 알리거나, 강의 노트에 모델 링크를 넣어 주세요.
:::
::
