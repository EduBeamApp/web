---
title: 테마와 색상
description: "CSS 사용자 지정 속성이나 colors 프롭으로 @edubeam/plot 그림의 색을 정하고, 라이트·다크 테마를 따르고, 흑백으로 인쇄하고, SVG 파일의 색과 글꼴, 애니메이션을 바꿉니다."
order: 4
source: site
---

# 테마와 색상

그림은 페이지의 CSS 사용자 지정 속성에서 색을 가져오므로, 사이트의 라이트 테마와 다크 테마가 그대로 적용됩니다. 페이지에 정의된 속성이 없으면 CSS 시스템 색상이 대신 쓰이며, 이 색은 페이지의 `color-scheme`을 따릅니다. 아무 설정 없이도 그림은 밝은 페이지에서는 흰 바탕에 검은색, 어두운 페이지에서는 어두운 바탕에 밝은색으로 그려집니다.

## 사용자 지정 속성 {#custom-properties}

| 용도 | 사용자 지정 속성 | 대체값 |
| --- | --- | --- |
| 부재, 지점, 글자 | `--figure-ink`, 없으면 `--ink` | `CanvasText` |
| 배경, 레이블 테두리(halo) | `--paper` | `Canvas` |
| 치수선, 축 | `--muted` | `GrayText` |
| 절점, 드래그할 수 있는 하중 | `--brand` | `#4f46e5` |
| 축력 | `--color-normal` | `#2222ff` |
| 전단력 | `--color-shear` | `#00af00` |
| 휨모멘트 | `--color-moment` | `#ff2222` |
| 변형 형상 | `--figure-ink`, 없으면 `--ink` | `CanvasText` |
| 하중 | `--color-load` | `#ff8700` |
| 반력 | `--color-reaction` | `#a020f0` |
| 인장을 받는 트러스 부재 | `--color-tension`, 없으면 `--color-moment` | `#ff2222` |
| 압축을 받는 트러스 부재 | `--color-compression`, 없으면 `--color-normal` | `#2222ff` |
| 글꼴 | `--ebp-font`, 없으면 `--font-sans` | `inherit` |

속성은 그림보다 위에 있는 요소라면 어디에든 설정할 수 있습니다. 사이트 전체에 적용하려면 `:root`에 설정하세요.

```css
:root {
  --ink: #1b1b3a;
  --paper: #ffffff;
  --color-moment: #d7263d;
}

.dark {
  --ink: #eeeeff;
  --paper: #0b0d1f;
}
```

레이블에는 `--paper` 색의 테두리(halo)가 둘러져 있어서 빗금 위에서도 잘 읽힙니다. 이 색을 그림이 놓인 배경색에 맞추세요.

## `colors` 프롭 {#the-colors-prop}

그림 하나의 색만 바꾸려면 톤(tone) 이름으로 원하는 색을 넘깁니다.

```vue
<StructurePlot :solver="solver" :colors="{ moment: '#c00', paper: 'transparent' }" />
```

톤은 `ink`, `paper`, `muted`, `brand`, `normal`, `shear`, `moment`, `deformed`, `load`, `reaction`, `tension`, `compression`입니다. CSS 색상이라면 `var(…)`를 포함해 무엇이든 쓸 수 있습니다. 각 톤의 기본값은 `DEFAULT_COLORS`에 있습니다.

## 흑백 {#black-and-white}

복사기로 찍어 낼 시험지나 흑백 인쇄물이라면 색이 있는 톤을 모두 잉크 색으로 지정합니다.

```vue
<script setup lang="ts">
import type { PlotColors } from '@edubeam/plot'

const print: Partial<PlotColors> = {
  ink: '#000', paper: '#fff', muted: '#555', brand: '#000',
  normal: '#000', shear: '#000', moment: '#000', deformed: '#000',
  load: '#000', reaction: '#000', tension: '#000', compression: '#000',
}
</script>

<template>
  <StructurePlot :solver="solver" :colors="print" :animate="false" />
</template>
```

다이어그램은 색이 없어도 잘 읽힙니다. 빗금이 그려져 있고, 휨모멘트는 인장 측에 그려지기 때문입니다.

## SVG 파일의 색 {#colours-in-an-svg-file}

[`structureSvg`](/ko/plot/functions#a-standalone-svg-file)로 쓴 파일은 둘러싼 페이지가 없으므로 색상 값을 직접 씁니다. 기본값은 흰 바탕에 EduBeam 앱의 색을 쓰는 `PRINT_COLORS`입니다. `colors` 옵션은 프롭과 같은 톤을 받으므로, 위의 흑백 설정을 여기에도 그대로 쓸 수 있습니다.

```ts
structureSvg(model, { colors: print }) // 흰 바탕에 검은색
structureSvg(model, { background: false }) // 배경 없음. 색이 있는 슬라이드용
```

색상 값만 직접 쓰세요. `var(…)`는 Word나 Inkscape에서 아무 의미가 없습니다.

## 글꼴 {#fonts}

글자는 `--ebp-font`나 `--font-sans`를 통해 페이지의 글꼴을 쓰며, 숫자는 고정폭 숫자(tabular figures)로 씁니다. `DiagramStack`의 V(x) 같은 행 이름은 페이지가 KaTeX 글꼴을 불러왔으면 그 글꼴로, 아니면 세리프 글꼴로 씁니다. SVG 파일은 페이지의 글꼴을 알 수 없으므로 `fontFamily` 옵션을 쓰며, 기본값은 Helvetica나 Arial입니다.

## 애니메이션 스타일 바꾸기 {#restyling-the-animation}

그림에 필요한 몇 안 되는 CSS 규칙은 각 SVG 안에 인라인으로 들어 있으므로 스타일시트가 필요 없습니다. 모든 클래스에는 `ebp-` 접두사가 붙어 있고, 페이지에서 덮어쓸 수 있습니다. 레이어는 각각 `<g class="ebp-layer ebp-layer-{name}">`이며, 표시되면 `ebp-on` 클래스가 붙습니다.

```css
/* 강의실용으로 더 천천히 나타나게 */
.slides .ebp-animate .ebp-layer {
  transition-duration: 1s;
}
```

`PLOT_CSS`는 인라인으로 들어가는 규칙을, `toneVars(colors)`는 그림이 루트 요소에 설정하는 사용자 지정 속성을 내보냅니다. [그리기 함수](/ko/plot/functions#drawing)로 직접 그림을 만들 때 쓰세요.
