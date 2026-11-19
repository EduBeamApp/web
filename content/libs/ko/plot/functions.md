---
title: 함수
description: "@edubeam/plot 0.2.0이 컴포넌트 외에 내보내는 모든 함수, 상수, 타입: 독립 SVG 파일을 쓰는 structureSvg, 정확한 결과 읽기, 단위, 보 축선, 직접 만드는 그림의 배치."
order: 10
source: site
---

# 함수

컴포넌트가 그리는 모든 것은 Vue가 들어 있지 않은 순수 함수에서 나옵니다. 이 함수로 그림을 SVG 파일로 쓰고, 결과를 정확하게 읽고, 데이터를 미리 준비하고, 나만의 그림을 만들 수 있습니다. 이름을 지정해 가져오면 번들이 작게 유지됩니다. `modelFromSolver`만 가져오는 페이지에는 컴포넌트 코드가 전혀 들어가지 않습니다.

단위가 따로 적혀 있지 않으면 모든 값은 SI 단위이고, 부재를 따라 잰 위치는 시작 절점에서의 거리(m)입니다.

## 독립 SVG 파일 {#a-standalone-svg-file}

페이지 안의 그림은 페이지의 CSS 사용자 지정 속성에서 색을 가져오므로, 거기서 복사해 낸 `<svg>`에는 색이 없습니다. `structureSvg`는 그 대신 그림을 독립 `.svg` 파일의 텍스트로 씁니다. 색상 값이 그대로 들어가고, 스타일시트도 스크립트도 없으며, `StructurePlot`과 같은 루틴으로 배치합니다. Word, PowerPoint, Inkscape, CairoSVG와 LaTeX 도구는 이 파일을 페이지에서와 똑같이 그립니다.

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts' // () => 풀린 LinearStaticSolver, '슬라이드와 강의 노트' 페이지의 것

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![CairoSVG로 렌더링한 독립 SVG 파일 속 문형 라멘: 하중, 반력(위로 20과 40, 수평으로 2.3과 12.7), 휨모멘트는 C의 −50.7에서 보 안의 29.3까지](/screenshots/ko/p2p-plot-frame-svg.webp){.shot-lg}

| 옵션 | 기본값 | 하는 일 |
| --- | --- | --- |
| `layers` | members, supports, loads, reactions and the result `StructurePlot` would pick | 그릴 것 |
| `width` | `640` | 너비, px(SVG의 사용자 단위) |
| `height` | follows the drawing | 고정 높이, px |
| `maxHeight` | max(320, 0.75 × width) | 자동 높이의 상한 |
| `padding` | `6` | 그림 둘레의 여백, px |
| `fontSize` | `13`, compact `11.5` | 글자 크기, px |
| `fontFamily` | `Helvetica, Arial, sans-serif` | 파일을 여는 프로그램에 있는 글꼴 목록 |
| `colors` | `PRINT_COLORS` | 원하는 톤을 색상 값으로 |
| `background` | `true` | 배경을 `paper` 색으로 칠함. `false`이면 투명 |
| `title` | none | SVG의 `<title>`로 씀 |
| `reserve`, `reserveLabelModes`, `reserveReactionLabels` | none | 그리는 것 외에 자리를 잡아 둘 레이어, 레이블 방식, 반력 레이블 방식. 단계별 파일의 위치가 맞도록: [Beamer에서 단계별로 쌓기](/ko/plot/slides#a-build-up-in-beamer) |
| `units`, `numberFormat`, `compact`, `diagramSize`, `deformedSize`, `momentOnTensionSide`, `resultLabelMode`, `reactionLabels` | as `StructurePlot` | 컴포넌트의 프롭과 같은 의미 |

`PRINT_COLORS`는 흰 바탕에 쓰는 EduBeam 앱의 색입니다. 잉크 `#16182b`, 축력 `#2222ff`, 전단력 `#00af00`, 휨모멘트 `#ff2222`, 하중 `#ff8700`, 반력 `#a020f0`입니다. 모든 SVG 프로그램이 `paint-order`를 이해하지는 않으므로, 레이블은 모두 두 번 쓰입니다. 아래에 배경색 테두리(halo)를, 그 위에 글자를 씁니다. 반력 이름 *A<sub>x</sub>* 같은 아래 첨자는 Word와 Inkscape가 읽을 수 있도록 일반 숫자를 쓴 `tspan`입니다. `reserve`가 없으면 파일은 그리는 레이어에 맞춰 크기가 정해집니다.

파일을 넣는 방법은 다음과 같습니다.

- **Word와 PowerPoint**(2019와 Microsoft 365): *삽입 › 그림*.
- **LaTeX**: [CairoSVG](https://cairosvg.org)(`cairosvg frame.svg -o frame.pdf`)나 Inkscape로 PDF로 변환한 다음 `\includegraphics`를 씁니다. 또는 Inkscape를 대신 호출해 주는 `svg` 패키지의 `\includesvg`를 씁니다. 너비 640단위인 그림을 16 cm 본문 너비로 넣으면 레이블은 9 pt입니다.
- **Vue를 쓰지 않는 웹 페이지**: 텍스트를 HTML에 붙여 넣습니다. [Vue 없이](/ko/plot/embedding#plain-html-from-node)를 참고하세요.

[연습 문제와 시험](/ko/plot/exercises#figures-for-latex-and-word)에서는 학생별 문제와 정답지를 파일로 씁니다.

## 솔버에서 {#from-a-solver}

| 내보내기 | 시그니처 | 하는 일 |
| --- | --- | --- |
| `modelFromSolver` | `(solver: Solver, options?: FromSolverOptions) => PlotModel` | 솔버를 일반 데이터인 [그림 모델](/ko/plot/model)로 읽어 옴. 결과는 풀린 하중조건에서만 |
| `FromSolverOptions` | type | `{ loadCase?: number }`, `solver.loadCases`의 인덱스 |

## 구간별 다항식 {#piecewise-polynomials}

부재의 결과는 `Piecewise` 값, 즉 `{ x0, x1, c }` 조각의 목록이며, [그림 모델](/ko/plot/model#piecewise-polynomials)에서 설명합니다. `side`는 두 조각이 만나는 점의 바로 앞(`'left'`) 값과 바로 뒤(`'right'`, 기본값) 값 가운데 하나를 고릅니다.

| 내보내기 | 시그니처 | 하는 일 |
| --- | --- | --- |
| `valueAt` | `(pw, x, side?) => number` | `x`에서의 값. 양 끝을 벗어나면 가까운 끝의 값 |
| `slopeAt` | `(pw, x, side?) => number` | 도함수, 값의 단위/m |
| `extremes` | `(pw) => { max: Extreme; min: Extreme } \| null` | 최댓값과 최솟값을 정확하게, 각각 `{ x, value, side }` |
| `maxAbs` | `(pw) => number` | 절댓값의 최댓값 |
| `innerBreaks` | `(pw) => number[]` | 양 끝을 뺀, 조각이 만나는 위치 |
| `isZero` | `(pw) => boolean` | 결과가 전 구간에서 0인지 여부 |
| `evalPiece` | `(piece, x) => number` | 조각 하나의 값 |
| `evalPieceSlope` | `(piece, x) => number` | 조각 하나의 기울기 |
| `pieceExtrema` | `(piece) => number[]` | 조각의 기울기가 0인 위치, m |
| `pieceDegree` | `(piece) => number \| null` | 조각의 차수. 0인 조각이면 `null` |
| `cleanPiecewise` | `(pw, tolerance) => Piecewise` | `tolerance`보다 작은 계수(풀린 모델의 반올림 오차)를 버림 |
| `fitPiece` | `(f, x0, x1, degree) => Piece` | 구간 `(x0, x1)`에서 함수 `f`를 지나는, 주어진 차수의 다항식 |
| `pieceToBeziers` | `(piece, segments?) => CubicSegment[]` | 조각을 (x, 값) 평면의 3차 베지에 곡선으로. 3차까지는 정확하고, 그보다 높으면 `segments`개(기본 4개)로 근사 |

타입: `Piece`, `Piecewise`, `Side`(`'left' \| 'right'`), `Extreme`, `CubicSegment`.

## 단위와 숫자 {#units-and-numbers}

| 내보내기 | 시그니처 | 하는 일 |
| --- | --- | --- |
| `KN_UNITS` | `Units` | kN, kNm, kN/m, m, mm, mrad, K: 기본값 |
| `SI_UNITS` | `Units` | N, N·m, N/m, m, m, rad, K |
| `resolveUnits` | `(units?: Partial<Units>) => Units` | 바꾼 단위를 반영한 `KN_UNITS` |
| `DEFAULT_NUMBER_FORMAT` | `Intl.NumberFormat` | 영어 형식, 소수점 아래 최대 한 자리 |
| `formatNumber` | `(value, format?) => string` | 진짜 빼기 기호를 쓴 숫자. −0은 나오지 않음 |
| `formatQuantity` | `(si, unit, format?) => string` | `"36 kN"`: SI 값을 주어진 단위로, 좁은 줄바꿈 없는 공백과 함께 |

`Unit`은 `{ symbol, scale }`이고, 표시값 = SI 값 × `scale`입니다. `Units`에는 `UnitKind`마다 하나씩 있습니다: `force`, `moment`, `distributed`, `length`, `displacement`, `rotation`, `temperature`.

```ts
import { formatQuantity, KN_UNITS } from '@edubeam/plot'

formatQuantity(-37500, KN_UNITS.moment) // "−37.5 kNm"
```

## 값 읽기 {#reading-values}

| 내보내기 | 시그니처 | 하는 일 |
| --- | --- | --- |
| `readMember` | `(results: MemberResults, x, snap?) => { x, u, values }` | `x`에서의 N, V, M, w(각각 `{ left, right }`)와 축방향 변위 `u`. `snap` m 이내의 불연속점에 붙음 |
| `readoutAt` | `(model, transform, px, py, reach) => Readout \| null` | 화면 위의 점에서 `reach` px 이내의 가장 가까운 부재와 그 위치의 결과 |
| `readoutMarks` | `(model, transform, readout, shown, k, side) => ReadoutMark[]` | 읽은 값을 표시할 위치: 표시 중인 각 다이어그램의 종거 끝(불연속점에서는 양쪽 끝), 변형 형상 위의 점 |
| `formatReadout` | `(readout, quantity, units, format?) => string` | `"M = 54 kNm"`, 불연속점에서는 `"V = 13.3 → −6.7 kN"` |

`k`는 결과별 SI 단위당 px, `side`는 각 다이어그램을 그리는 쪽이며, 아래의 `diagramScales`와 `diagramSide`에서 얻습니다. 타입: `Readout`, `ReadoutMark`(px 단위의 `{ tone, from, to }`), `ReadoutQuantity`(`'N' \| 'V' \| 'M' \| 'w'`), `SidedValue`.

## 보 축선 {#beam-lines}

[DiagramStack](/ko/plot/diagram-stack)을 이루는 부품으로, 다이어그램을 쌓은 그림을 직접 만들 때 씁니다.

| 내보내기 | 시그니처 | 하는 일 |
| --- | --- | --- |
| `beamLine` | `(model, ids?) => BeamLine` | 부재를 왼쪽에서 오른쪽으로 이어진 하나의 수평선으로. 그 밖의 경우는 예외를 던짐 |
| `lineDiagram` | `(model, line, row) => Piecewise` | 선 전체를 따라 이어진 결과 하나, 선의 x 좌표로 |
| `rowRange` | `(pw) => [number, number]` | 행의 축척을 정하는 범위. 언제나 0을 포함 |
| `rowPeaks` | `(pw) => RowPeak[]` | 행에 적을 만한 극값 |
| `rowBreaks` | `(pw) => number[]` | 결과가 끊기는 위치: 지점, 절점, 집중하중 |
| `rowOutline` | `(pw, sx, sy, close) => string` | 행 윤곽선의 SVG 경로 데이터. m와 값을 px로 바꾸는 함수를 받음 |
| `rowOrdinates` | `(pw, sx, sy, spacing) => string` | `spacing` px 간격으로 그은 빗금 종거의 SVG 경로 데이터 |
| `lineModel` | `(model, line, omit?) => PlotModel` | 선에 해당하는 부분만 남긴 모델. 하중 하나를 뺄 수 있음 |
| `pointLoadAt` | `(model, line, at) => PlotLoad \| undefined` | 선 위의 위치 `at`에 있는 집중하중 |

타입: `BeamLine`, `LineMember`, `RowPeak`, `StackRow`.

[DiagramStack](/ko/plot/diagram-stack#a-load-the-reader-can-drag) 페이지는 `beamLine`, `lineDiagram`, `rowRange`로 이동하중의 모든 위치에 걸쳐 각 행의 축척을 유지합니다.

## 형상과 지점 {#geometry-and-supports}

| 내보내기 | 시그니처 | 하는 일 |
| --- | --- | --- |
| `nodeMap` | `(model) => ReadonlyMap<string, PlotNode>` | id별 절점 |
| `memberFrame` | `(model, member, nodes?) => MemberFrame` | 부재의 시작점, 단위 접선 벡터, 국부 z 방향 단위 벡터, 길이 |
| `memberFrames` | `(model) => Map<string, MemberFrame>` | 모든 부재에 대해 같은 것, id별 |
| `pointAlong` | `(frame, at) => { x, z }` | 부재를 따라 `at` m 떨어진 점 |
| `supportKind` | `(fixity) => SupportKind` | `'fixed'`, `'pin'`, `'roller'`, `'slider'`, `'rotation'`, `'none'` 중 하나 |
| `supportPlacement` | `(model, node) => SupportPlacement` | 절점에 놓을 기호와 시계 방향 회전각, 도 |
| `supportGlyph` | `(kind) => readonly GlyphPart[]` | 기호를 이루는 선, px |
| `glyphReach` | `(kind, rotation, x, z) => number` | 돌린 기호가 한 방향으로 뻗는 길이, px |

## 그리기 {#drawing}

그리기는 세 단계로 이루어집니다. `buildStructureScene`은 모델을 장면 항목, 즉 화면 픽셀 단위의 오프셋이 붙은 모델 위의 점으로 바꿉니다. `fitScene`은 이 항목이 상자에 들어가는 축척과 오프셋을 찾습니다. `resolveScene`은 항목을 SVG 경로 데이터, 원, 그리고 자리가 있는 레이블로 바꿉니다. `layoutStructure`는 `StructurePlot`과 `structureSvg`처럼 세 단계를 모두 실행하므로, 직접 만든 그림도 똑같이 배치됩니다.

| 내보내기 | 시그니처 | 하는 일 |
| --- | --- | --- |
| `layoutStructure` | `(model, options, box, shown?, labelModes?) => StructureLayout` | 전체 배치: 모든 레이블을 넣어 맞추고, 붐비는 레이블을 빼고, 다시 맞춤. `{ fit, items, resolved }`를 반환 |
| `structureSvg` | `(model, options?) => string` | 독립 `.svg` 파일: [위 참고](#a-standalone-svg-file) |
| `buildStructureScene` | `(model, options: StructureSceneOptions) => SceneItem[]` | 선택한 레이어를 주어진 축척(m당 px)으로 그린 것 |
| `fitScene` | `(items, box: FitBox) => Fit` | 상자 `{ width, height?, maxHeight?, padding, fontSize }`에 맞는 축척과 오프셋 |
| `resolveScene` | `(items, transform, options: ResolveOptions) => ResolvedScene` | px 단위의 `{ paths, circles, texts }`, 들어갈 자리가 있는 레이블 포함 |
| `placeLabels` | `(items, transform, options: ResolveOptions) => Map<SceneText, SceneText>` | 남길 레이블과 그 위치 |
| `alternativeResultGroups` | `(shown) => ReadonlySet<string>` | 한 번에 하나씩만 표시되는 결과 레이어. 이 레이어의 레이블은 다른 것에는 자리를 양보하지만 서로에게는 양보하지 않음 |
| `sceneBounds` | `(items, scale, fontSize) => Bounds` | 장면의 범위, px |
| `project` | `(transform, anchor) => [number, number]` | 장면 위의 점을 화면 좌표로, px |
| `defaultResultLayer` | `(model) => ResultLayer \| null` | 아무것도 지정하지 않았을 때 그림이 보여 주는 결과 |
| `diagramScales` | `(model, options) => Record<ResultLayer, number>` | 결과별 SI 단위당 px |
| `diagramSide` | `(q, momentOnTensionSide) => 1 \| -1` | 양의 값을 부재의 어느 쪽에 그리는지 |
| `isBarStructure` | `(model, memberResults) => boolean` | N을 다이어그램 대신 부재를 따라 숫자로 쓰는지(트러스) 여부 |
| `tipPlacements` | `(tip, out, mode, gaps?) => TextPlacement[]` | 종거 끝 바깥에서 값이 놓일 수 있는 자리 |
| `PLOT_LAYERS` | `readonly PlotLayer[]` | 모든 레이어, 그리는 순서대로 |
| `RESULT_LAYERS` | `['N', 'V', 'M', 'w']` | 결과 레이어 |
| `HATCH_SPACING_PX` | `7` | 다이어그램 종거의 간격, px |
| `DEFAULT_COLORS` | `PlotColors` | 각 톤의 기본 색, CSS로: [테마와 색상](/ko/plot/theming) |
| `PRINT_COLORS` | `Record<Tone \| 'paper', string>` | 파일용 색상 값. 흰 바탕에 앱의 색 |
| `toneVars` | `(colors?) => Record<string, string>` | 그림이 루트 요소에 설정하는 사용자 지정 속성 |
| `PLOT_CSS` | `string` | 각 그림에 인라인으로 들어가는 CSS 규칙 |

`ResolveOptions`는 `{ fontSize, viewport?, exclude?, alternativeGroups?, shields? }`입니다. `shields`는 선이 레이블을 밀어내는 그룹(표시 중인 다이어그램)이며, 생략하면 모든 그룹입니다. `layoutStructure`에서 `options.layers`는 배치할 레이어(`reserve`처럼 표시될 수 있는 모든 것), `shown`은 표시 중인 레이어, `labelModes`는 자리를 잡아 둘 레이블 방식입니다.

타입: `StructureSceneOptions`, `StructureLayout`, `StructureSvgOptions`, `SceneItem`, `SceneText`, `TextPlacement`, `ResolvedScene`, `ResolvedPath`, `ResolvedText`, `ResolvedCircle`, `ResolveOptions`, `Bounds`, `Anchor`, `Transform`, `Fit`, `FitBox`, `Tone`, `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `SupportKind`, `SupportPlacement`, `GlyphPart`, 그리고 [그림 모델](/ko/plot/model)의 모델 타입.
