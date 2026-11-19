---
description: "EduBeam에서 절점을 배치하고 편집하는 방법, 그리드 스냅, 요소 분할, 그리고 힌지, 롤러, 고정단, 슬라이더와 수직·경사 지점 가운데 알맞은 지점을 고르는 방법."
source: site
---

# 절점 및 지점

절점은 모델의 점입니다. 요소는 절점을 서로 연결하고, 지점과 절점하중은 절점에 놓입니다. 좌표를 입력하거나 클릭해서 절점을 배치한 다음, 지지되는 절점에는 도면과 같은 지점을 지정합니다.

## 좌표 {#coordinates}

모든 절점에는 현재 [길이 단위](/ko/essentials/units-settings#units)로 된 **X** 좌표와 **Z** 좌표가 있습니다. X는 오른쪽을, **Z는 아래쪽**을 향하므로 지면보다 위에 있는 점은 Z가 음수입니다. 높이 4 m인 기둥은 `Z = 0`에서 `Z = −4`까지 이어집니다.

::model-figure{caption="폭 6 m, 높이 4 m인 문형 라멘: A와 D는 Z = 0, B와 C는 Z = −4"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: fixed, D: fixed }
members: [[A, B], [B, C], [C, D]]
results: []
show: [nodeLabels, dimensions]
---
::

연직축이 위를 향하는 편이 좋다면 설정에서 [y 위 좌표축](/ko/elements/conventions#y-up-axes)으로 바꾸세요. 바뀌는 것은 화면 표시뿐이고, 모델과 파일은 그대로입니다.

## 절점 추가 {#adding-nodes}

- **입력해서.** *절점* 탭 → **절점 추가**(**+** 아이콘이 있는 버튼), 또는 캔버스를 마우스 오른쪽 버튼으로 클릭 → *절점 추가*. X와 Z를 입력하고, 필요하면 지점과 지점 각도도 입력합니다.
- **클릭해서.** *절점* 탭 → **절점 추가**(커서 아이콘이 있는 버튼), 또는 캔버스 메뉴에서 <kbd>Ctrl</kbd>을 누른 채 *절점 추가*를 고릅니다. 클릭할 때마다 절점이 하나씩 놓입니다. 멈추려면 <kbd>Esc</kbd>나 **취소**를 누르거나 버튼을 한 번 더 누릅니다.
- **요소를 그리면서.** [마우스로 요소를 그릴 때](/ko/essentials/elements#adding-elements) 빈 캔버스를 클릭하면 그 자리에 절점이 만들어집니다.
- **복사해서.** 절점(과 요소)을 선택하고 <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd>를 누른 다음, 사본을 놓을 곳을 클릭하거나 배너에 이동량 Δx, Δz를 입력하고 **붙여넣기**를 누릅니다.

::div{.shots}

![절점 추가 대화 상자](/screenshots/ko/qs-node.webp)

![마우스 모드에서는 위쪽 배너에서 배치할 모든 절점의 지점과 각도를 정합니다](/screenshots/ko/nodes-add-banner.webp)

::

새 절점에는 비어 있는 다음 번호 `1`, `2`, `3`, …이 붙습니다. 표의 *절점* 열에서 이름을 `A`, `B`, `C`처럼 얼마든지 바꿀 수 있습니다.

### 스냅 {#snapping}

**그리드 스냅**을 켜면(<kbd>S</kbd> 키나 뷰어 오른쪽 아래의 **S** 칩) 배치하거나 드래그한 절점이 그리드 위에 놓입니다. 간격은 기본 0.1 m이고 미국 단위에서는 0.5 ft입니다. [설정 → 뷰어 설정 → 그리드](/ko/essentials/units-settings#viewer-settings)에서 바꿀 수 있습니다. 그리드에서 벗어난 위치는 표에 정확한 좌표를 입력하세요.

### 기존 요소 위에 절점 배치 {#placing-a-node-on-an-existing-element}

마우스로 절점을 추가하다가 요소 위(또는 아주 가까이)를 클릭하면 EduBeam이 어떻게 할지 묻습니다.

- **구조물에 연결**은 요소를 새 절점에서 이어지는 두 요소 `1a`와 `1b`로 나눕니다. 내부 지점이나 하중 작용점을 추가하는 가장 빠른 방법입니다. 바깥쪽 끝의 힌지는 그대로 남습니다. 등분포하중과 사다리꼴 분포하중은 두 부분에 나뉘어 들어갑니다. 집중하중과 온도하중은 모두 첫 번째 부분 `1a`로 갑니다. 새 절점 너머에 있던 집중하중은 *하중* 표에서 `1b`로 옮기고(위치는 이제 새 절점부터 잽니다), `1b`에는 온도하중을 따로 지정하세요.
- **독립 절점으로 배치**는 요소 위에 절점을 놓되 요소와 연결하지는 않습니다.

어느 쪽을 고르든 절점 배치는 거기서 끝납니다. 더 배치하려면 커서 버튼을 다시 누르세요.

## 절점 편집 {#editing-nodes}

| 하려는 일 | 방법 |
| --- | --- |
| 절점 이동 | 뷰어에서 드래그하거나(터치스크린에서는 누른 채 드래그), *절점* 표에 X와 Z를 입력합니다. 연결된 요소와 그 하중, 치수선도 따라옵니다. |
| 이름 바꾸기 | *절점* 열에 새 이름을 입력합니다. |
| 지점 바꾸기 | 절점을 클릭 → **지지조건**, 또는 *구속 자유도* 열을 씁니다. [지점](#supports)을 참고하세요. |
| 한꺼번에 편집 | *작업* 열의 연필 아이콘이 **절점 편집**을 엽니다. 좌표, 지점, 지점 각도를 지점 기호 미리보기와 함께 설정합니다. |
| 삭제 | 표의 ×, 절점 패널의 **삭제**, 또는 선택한 뒤 <kbd>Delete</kbd>. 절점에 붙은 요소, 하중, 치수선도 함께 삭제됩니다. |

모든 변경은 <kbd>Ctrl</kbd>+<kbd>Z</kbd>로 되돌릴 수 있습니다.

## 지점 {#supports}

절점은 x 방향 이동 `Dx`, z 방향 이동 `Dz`, 그림 평면 안의 회전 `Ry`의 세 가지로 움직일 수 있습니다. 이것이 절점의 **자유도**(DOF)이며, 지점은 이 가운데 일부를 **구속**합니다.

지점 8가지는 세 자유도를 조합하는 여덟 가지 방법입니다. 표를 가로로 읽으세요. 가운데 열은 자유롭게 회전하고, 오른쪽 열은 회전도 구속됩니다.

| 구속된 이동 | 자유롭게 회전 | 회전도 구속 |
| --- | --- | --- |
| **양방향**(`Dx`와 `Dz`) | ![](/screenshots/ko/b-support-pin.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **힌지** | ![](/screenshots/ko/b-support-fixed.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **고정단** |
| **연직만**(`Dz`): 수평으로 이동 | ![](/screenshots/ko/b-support-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **롤러** | ![](/screenshots/ko/b-support-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **슬라이더** |
| **수평만**(`Dx`): 연직으로 이동 | ![](/screenshots/ko/b-support-vertical-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **수직 롤러** | ![](/screenshots/ko/b-support-vertical-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **수직 슬라이더** |
| **없음**: 양방향으로 이동 | ![](/screenshots/ko/b-support-free.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **자유**(지점 없음) | ![](/screenshots/ko/b-support-rotation-only.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **회전만 구속** |

EduBeam은 구속된 자유도마다 **반력**을 계산합니다. `Dx`에서는 수평력 $R_x$, `Dz`에서는 연직력 $R_z$, `Ry`에서는 모멘트 $M$이 생깁니다. 따라서 힌지 지점에는 $R_x$와 $R_z$, 롤러 지점에는 $R_z$만, 슬라이더에는 $R_z$와 $M$, 고정단에는 세 가지가 모두 생깁니다.

### 지점 설정 {#setting-a-support}

지점 기호를 고르거나 자유도를 하나씩 체크합니다. 기호와 체크박스는 항상 서로 일치합니다. 둘 다 다음 세 곳에서 설정할 수 있습니다.

- 절점 패널(절점을 클릭) → **지지조건**. 아래 그림처럼 **절점 좌표계 각도**와 함께 있습니다.
- **절점 추가**와 **절점 편집** 대화 상자.
- *절점* 표의 *구속 자유도* 열. 기호는 작은 메뉴이고 `Dx`, `Dz`, `Ry`는 체크박스입니다.

![절점 패널의 지지조건: 지점 기호, 자유도 체크박스, 지점 각도](/screenshots/ko/nodes-support-picker.webp){.shot-lg}

기호에 포인터를 올리면 이름이 나타납니다.

### 롤러와 슬라이더의 차이 {#roller-or-slider}

둘 다 레일 위에 놓여 레일을 따라 미끄러집니다. 차이는 회전에 있습니다.

- **롤러**는 레일 위의 힌지 지점입니다. 끝이 **자유롭게 회전**하므로 그곳에는 모멘트가 없습니다.
- **슬라이더**는 레일 위의 고정단입니다. 끝이 **회전할 수 없으므로** 지점이 모멘트를 받습니다.

경간 6 m에 10 kN/m가 작용하는 같은 보에서 오른쪽 지점만 바꾸었습니다. 변형 형상과 휨모멘트를 번갈아 보세요.

::div{.shots}

:::model-figure{caption="힌지 지점과 롤러 지점: 오른쪽 끝이 자유롭게 회전하며 그곳의 M = 0, 각 지점 반력 30 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

:::model-figure{caption="힌지 지점과 슬라이더: 오른쪽 끝이 수평을 유지하며 그곳의 M = −45 kNm, 슬라이더 반력 37.5 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: slider }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

::

첫 번째는 단순보입니다(경간 중앙에서 $M_{max} = qL^2/8 = 45\ \text{kNm}$). 연직 하중만 받을 때 슬라이더는 고정단과 똑같이 작용하므로, 두 번째는 일단 고정 타단 롤러 보가 됩니다($R_B = 5qL/8 = 37.5\ \text{kN}$, $M_B = -qL^2/8 = -45\ \text{kNm}$). 끝이 수평을 유지하도록 붙잡으면 보의 강성도 커져서 최대 처짐이 9.617 mm에서 4 mm로 줄어듭니다. 슬라이더가 고정단과 달라지는 것은 레일 방향으로 미는 힘이 있을 때뿐입니다.

### 경사 지점 {#inclined-skewed-supports}

경사면 위의 지점은 회전된 축 방향으로 절점을 구속합니다. **절점 좌표계 각도** α를 −180°에서 180°까지 도 단위로 설정합니다. 절점 패널의 *지지조건*, 절점 추가 및 편집 대화 상자, 또는 *절점* 표의 **α** 입력란에서 설정할 수 있습니다.

절점의 좌표축이 α만큼 회전하고, 체크한 자유도는 회전된 축 방향으로 작용합니다. α는 x를 z 쪽으로 돌리므로 화면에서는 **시계 방향**입니다(y 위 좌표축에서는 x를 y 쪽으로, 즉 반시계 방향으로 돌립니다). 따라서 오른쪽으로 30° 내려가는 면 위의 롤러 지점은 α = 30°인 롤러입니다. 기호도 축과 함께 회전하고, 반력도 회전된 축 방향으로 표시됩니다.

::model-figure{caption="B의 롤러를 α = 30°만큼 회전: 반력 34.64 kN은 경사면에 수직이고, 보에는 N = +17.32 kN이 생깁니다"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [N, M]
show: [nodeLabels]
---
::

위와 같은 보(경간 6 m, 10 kN/m)이지만 이번에는 롤러가 30° 경사면 위에 있습니다. B 반력의 연직 성분은 여전히 $qL/2 = 30\ \text{kN}$이므로 반력 자체는 $30/\cos 30° = 34.64\ \text{kN}$이고, 수평 성분 $30 \tan 30° = 17.32\ \text{kN}$은 B를 오른쪽으로 밉니다. A의 힌지 지점이 이를 붙잡으므로 보에는 인장이 생깁니다. 휨모멘트는 변하지 않습니다.

회전된 절점의 [절점하중](/ko/essentials/loads#nodal-loads)은 전체 좌표축이나 절점 좌표축으로 입력할 수 있습니다. [강제변위](/ko/essentials/loads#prescribed-displacements-support-settlements)는 항상 지점 자체의 축 방향으로 작용합니다.

### 안정성 {#stability}

평면 구조물에는 **구속된 자유도가 3개 이상** 필요하고, 그 배치가 구조물을 실제로 붙잡을 수 있어야 합니다. 지점이 부족한 동안 뷰어에는 파란색 **지점 필요** 칩이 표시됩니다. 지점 수는 충분하지만 구조물을 붙잡지 못하거나(모두 평행하거나 반력의 작용선이 한 점에서 만나는 경우), 힌지 때문에 부재끼리 서로 돌아갈 수 있으면 빨간색 메시지가 문제를 알려 주고 점선 윤곽이 구조물이 어떻게 움직이는지 보여 줍니다. 각 메시지는 [문제 해결](/ko/reference/troubleshooting#messages)에서 설명합니다.

## 절점하중과 지점 침하 {#nodal-loads-and-settlements}

절점을 클릭한 뒤 **하중 추가**를 고르면 힘이나 모멘트를 가할 수 있고, **강제변위 지정**을 고르면 지점을 주어진 양만큼 움직일 수 있습니다(지점 침하). 둘 다 [절점하중](/ko/essentials/loads#nodal-loads)에서 설명합니다.

## 치수선 {#dimension-lines}

치수선은 그림에 길이를 표시합니다. 해석에는 영향을 주지 않지만 프로젝트와 함께 저장되고, 공유 링크에도 담기며, [내보낸 이미지](/ko/essentials/import-export#export-an-image)에도 나타납니다.

| 하려는 일 | 방법 |
| --- | --- |
| 치수선 추가 | 캔버스를 마우스 오른쪽 버튼으로 클릭 → **치수 추가**, 그다음 두 끝점을 클릭합니다. 절점 가까이의 점은 절점에 스냅됩니다. |
| 요소에 치수 넣기 | 요소를 마우스 오른쪽 버튼으로 클릭 → **요소 1에 치수 추가**(요소 이름이 들어갑니다). |
| 편집하거나 뒤집기 | 치수선을 클릭 → **편집**으로 좌표를 입력하거나, **치수 뒤집기**로 치수 값을 선의 반대쪽으로 옮깁니다. |
| 이동 | 치수선이나 끝점을 드래그합니다. 절점에 붙은 끝점은 그 절점에 묶여 함께 움직입니다. |
