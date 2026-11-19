---
title: 연습 문제와 시험
description: "@edubeam/fem과 @edubeam/plot으로 시드에서 학생마다 다른 구조역학 연습 문제를 만듭니다. 언제나 맞는 정답지와 함께 웹 페이지, 인쇄용 시험지, LaTeX와 Word용 SVG 그림으로."
order: 5
group: 활용 사례
source: site
---

# 연습 문제와 시험

구조물을 시드에 대한 함수로 한 번만 작성해 두면, 매주 학생마다 다른 연습 문제가 생기고 정답지는 언제나 맞습니다. @edubeam/fem 솔버가 문제를 풀고, @edubeam/plot 라이브러리가 같은 모델에서 문제와 정답지를 그립니다.

아래의 **새 문제**를 눌러 보세요. 누를 때마다 새 시드로 문제를 만들고, 풀고, 그리는 일이 모두 브라우저 안에서 일어납니다.

::exercise-generator
::

이 데모는 이 사이트의 두 페이지에 나오는 문제를 그립니다. 두 페이지 모두 여기서 설명하는 구성 요소로 만들었습니다. 하나는 [연습 문제](/ko/practice) 페이지로, 학생이 반력과 최대 휨모멘트나 최대 부재력을 입력하면 바로 채점해 줍니다. 다른 하나는 [시험지 생성기](/ko/exam)로, 학생마다 유형이 다른 시험지를 정답지와 함께 인쇄하고, 그림은 SVG 파일로, 정답은 CSV로 저장합니다. 직접 만들기 전에 먼저 써 보세요.

## 동작 원리 {#how-it-works}

1. **시드가 숫자를 고릅니다.** 시드(난수 초깃값)를 쓰는 난수 생성기는 같은 시드에 대해 언제나 같은 문제를 만듭니다. 그래서 문제지에 인쇄된 시드로 정답지를 다시 찾을 수 있습니다.
2. **솔버가 정답을 구합니다.** @edubeam/fem 솔버가 각 구조물을 풀므로, 반력과 모멘트는 잘못 쓸 수도 있는 공식이 아니라 솔버에서 나옵니다.
3. **그림 라이브러리가 둘 다 그립니다.** 문제지에는 절점 이름, 치수, 이름만 붙은 미지 반력과 함께 구조물이 나옵니다. 정답지에는 반력의 값과 다이어그램이 더해집니다.

짧은 파일 몇 개면 인쇄된 시험지까지 갈 수 있습니다. [문제 생성기](#the-generator), 웹 페이지용 [컴포넌트](#the-exercise-in-a-page), 그리고 시험지를 인쇄하거나 LaTeX와 Word용 [그림을 쓰는](#figures-for-latex-and-word) [스크립트](#print-a-test)입니다. [라이브러리를 설치한](/ko/plot/getting-started#install) 프로젝트에 복사해 쓰세요. 스크립트는 22.18 이상의 `node`로, 그보다 오래된 버전에서는 `npx tsx`로 실행합니다.

## 문제 생성기 {#the-generator}

`exercise.ts` 모듈 하나가 시드를 문제로 바꿉니다. 힌지 지점과 롤러 지점 위의 보이며, 절반은 끝에 집중하중을 받는 내민 부분이 있습니다. 두 경우 모두 정정이므로, 어떤 시드든 솔버뿐 아니라 손으로도 풀 수 있습니다.

```ts [exercise.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { extremes, modelFromSolver, type PlotModel } from '@edubeam/plot'

export interface Exercise {
  readonly seed: number
  readonly statement: string
  /** 풀린 구조물을 일반 데이터로: 문제와 정답지를 모두 이것으로 그립니다 */
  readonly model: PlotModel
  /** 위 방향 지점 반력, N, 그리고 휨모멘트의 극값, N·m */
  readonly key: { RA: number; RB: number; mMax: number; mMin: number }
}

/** mulberry32: 작은 시드 난수 생성기. 시드 하나가 언제까지나 같은 문제를 가리킵니다 */
const random = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), seed | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export const makeExercise = (seed: number): Exercise => {
  const r = random(seed)
  const pick = <T>(xs: readonly T[]): T => xs[Math.floor(r() * xs.length)]
  const int = (lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1))

  // 힌지 지점과 롤러 지점 위의 경간 하나, 절반은 내민 부분 포함: 정정이므로 언제나 풀 수 있습니다
  const L = pick([4, 5, 6]) // m
  const c = pick([0, 0, 1, 1.5, 2]) // 내민 길이, m
  const q = int(4, 12) // 경간에 작용하는 kN/m
  const F = int(2, 6) * 5 // 끝에 작용하는 kN, 내민 부분이 없으면 A에서 `a` m 위치에
  const a = int(1, L - 1) // m

  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  if (c > 0) {
    domain.createNode('C', [L + c, 0, 0])
    domain.createBeam2D(2, ['B', 'C'], 1, 1)
    lc.createNodalLoad('C', { [DofID.Dz]: F * 1e3 })
  } else {
    lc.createBeamConcentratedLoad(1, [0, F * 1e3, 0, a], true)
  }
  solver.solve()

  const statement =
    c > 0
      ? `Span L = ${L} m with an overhang c = ${c} m. q = ${q} kN/m on the span, F = ${F} kN at the tip C.`
      : `Span L = ${L} m. q = ${q} kN/m over the span, F = ${F} kN at ${a} m from A.`

  // 풀린 모델에서 얻는 정답: 반력(z가 아래 방향이므로 위 방향은 마이너스), M의 정확한 극값
  const model = modelFromSolver(solver)
  const { reactions, members } = model.results!
  const up = (node: string) => -(reactions.find((x) => x.node === node && x.dof === 'dz')?.value ?? 0)
  const m = Object.values(members).flatMap((member) => extremes(member.M) ?? [])
  const mMax = Math.max(...m.map((e) => e.max.value))
  const mMin = Math.min(...m.map((e) => e.min.value))

  return { seed, statement, model, key: { RA: up('A'), RB: up('B'), mMax, mMin } }
}
```

`modelFromSolver`는 풀린 구조물을 [그림 모델](/ko/plot/model)로 읽어 옵니다. 그림 모델은 반력과, 모든 부재의 결과를 정확한 다항식으로 담은 일반 데이터이므로, `extremes`가 샘플링 없이 최대 모멘트를 찾습니다. 문제에는 이 모델만 남기고, 솔버는 더 이상 필요 없습니다.

시드 5에서는 *“Span L = 6 m with an overhang c = 1.5 m. q = 5 kN/m on the span, F = 25 kN at the tip C.”*라는 문제가 나옵니다(경간 L = 6 m, 내민 길이 c = 1.5 m, 경간에 q = 5 kN/m, 끝 C에 F = 25 kN). 정답은 $R_A = (5 \cdot 6 \cdot 3 - 25 \cdot 1.5)/6 = 8.75$ kN, $R_B = 5 \cdot 6 + 25 - 8.75 = 46.25$ kN, 지점 위에서 $M_B = -25 \cdot 1.5 = -37.5$ kNm, 그리고 전단력이 0이 되는 경간 안의 점에서 $M = 8.75^2/(2 \cdot 5) = 7.66$ kNm입니다. 솔버의 값은 마지막 자리까지 일치합니다.

## 웹 페이지에서 {#the-exercise-in-a-page}

컴포넌트 `ExerciseCard.vue`는 문제를 그리고, `answers`가 있으면 정답지를 그립니다.

```vue [ExerciseCard.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { formatQuantity, KN_UNITS, StructurePlot, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise'

const props = defineProps<{ seed: number; answers?: boolean }>()
const exercise = computed(() => makeExercise(props.seed))

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']
const twoDecimals = new Intl.NumberFormat('en', { maximumFractionDigits: 2 })
const kN = (si: number) => formatQuantity(si, KN_UNITS.force, twoDecimals)
const kNm = (si: number) => formatQuantity(si, KN_UNITS.moment, twoDecimals)
</script>

<template>
  <article>
    <h3>Exercise {{ seed }}</h3>
    <p>{{ exercise.statement }} Find the reactions and draw the bending moment diagram.</p>
    <StructurePlot
      :model="exercise.model"
      :layers="answers ? key : sheet"
      :reserve="[...sheet, ...key]"
      :reaction-labels="answers ? 'values' : 'names'"
      :reserve-reaction-labels="['names', 'values']"
    />
    <p v-if="answers">
      R<sub>A</sub> = {{ kN(exercise.key.RA) }}, R<sub>B</sub> = {{ kN(exercise.key.RB) }},
      M from {{ kNm(exercise.key.mMin) }} to {{ kNm(exercise.key.mMax) }}
    </p>
  </article>
</template>
```

```vue
<ExerciseCard :seed="5" />
<ExerciseCard :seed="5" answers />
```

두 번째 카드는 *R<sub>A</sub> = 8.75 kN, R<sub>B</sub> = 46.25 kN, M from −37.5 kNm to 7.66 kNm*으로 끝납니다. `formatQuantity`는 그림과 마찬가지로 단위와 진짜 빼기 기호를 씁니다.

문제지에서는 `reaction-labels="names"`가 반력을 미지수로 그립니다. 지점이 구속하는 방향마다 양의 방향(오른쪽, 위쪽, 반시계 방향)을 가리키는 화살표를 그리고, 크기 대신 *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>* 같은 이름을 붙입니다. 그러면 모든 답의 부호가 그림 위에서 정해집니다. 반대 방향으로 작용하는 반력은 음수입니다. 정답지에는 값이 적힙니다.

`reserve`는 문제와 정답 두 화면의 레이어를 처음부터 모두 배치해 둡니다. 그래서 자습용 *정답 보기* 버튼 등으로 `answers`를 켜면 다이어그램이 제자리에서 서서히 나타납니다([단계별로 쌓이는 그림](/ko/plot/structure-plot#figures-that-build-up)). `reserve-reaction-labels`는 반력에 대해 같은 일을 하므로, 반력의 이름이 값으로 바뀌는 동안 보는 그 자리에 있습니다. [미지수로 그린 반력](/ko/plot/structure-plot#reactions-as-unknowns)을 참고하세요.

## 인쇄용 시험지 {#print-a-test}

필기시험이라면 Node 스크립트 `print-test.ts`가 학생마다 한 쪽씩, 그 뒤에 정답지를 씁니다. `structureSvg`가 각 모델을 SVG 텍스트로 바꾸므로 이 스크립트에는 Vue도 브라우저도 필요 없습니다.

```ts [print-test.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const students = ['Ada', 'Ben', 'Cleo']
const exercises = students.map((_, i) => makeExercise(1000 + i)) // 시드 1000, 1001, …

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']
const task = 'Find the reactions and draw the bending moment diagram.'

const pages = [
  ...exercises.map((e, i) => `<h2>${students[i]}, exercise ${e.seed}</h2>
    <p>${e.statement} ${task}</p>${structureSvg(e.model, { layers: sheet, reactionLabels: 'names' })}`),
  ...exercises.map((e) => `<h2>Key, exercise ${e.seed}</h2>
    ${structureSvg(e.model, { layers: key })}`),
]

const style = `body { font: 15px/1.5 system-ui, sans-serif; max-width: 640px; margin: 2rem auto }
  section { break-after: page }`
writeFileSync('test.html', `<!doctype html><meta charset="utf-8"><title>Test</title>
  <style>${style}</style>${pages.map((page) => `<section>${page}</section>`).join('\n')}`)
```

```bash
node print-test.ts
```

`test.html`을 브라우저에서 열어 인쇄하거나 PDF로 저장하세요. 학생별 문제와 정답지가 각각 한 쪽씩 차지합니다. Ada의 문제지와 그 정답지는 다음과 같습니다.

![문제 1000: 경간 6 m와 내민 길이 2 m, 경간에 10 kN/m, 끝에 30 kN, A_x, A_z, B_z라는 이름이 붙은 미지 반력, 연속 치수 6 m와 2 m, 전체 8 m. 그 아래는 정답지로, 반력 20과 70, 휨모멘트는 지점 위 −60에서 경간 안의 20까지](/screenshots/ko/p2p-plot-exercise-sheet.webp){.shot-lg}

`dimensions` 레이어는 연습 문제지처럼 각 구간과 전체 길이를 넣고, `reactionLabels: 'names'`는 미지수에 이름을 붙이며 각 화살표가 답의 양의 방향을 가리키게 합니다. 정답지의 반력과 다이어그램 값은 EduBeam 앱처럼 kN과 kNm 단위의 숫자만 씁니다. 학생에게 알려 줄 필요가 있다면 정답지 제목에 단위를 밝혀 두세요. 흑백 복사기를 쓴다면 모든 톤을 검은색으로 지정한 `colors`를 넘기세요. [흑백](/ko/plot/theming#black-and-white)을 참고하세요.

## LaTeX와 Word용 그림 {#figures-for-latex-and-word}

시험지를 LaTeX나 Word로 만든다면, 그림을 파일로 써서 자기 양식을 그대로 쓰면 됩니다. `figures.ts`는 시드 30개의 문제지 그림과 정답지 그림을 씁니다.

```ts [figures.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']

for (let seed = 1000; seed < 1030; seed++) {
  const { model } = makeExercise(seed)
  writeFileSync(`exercise-${seed}.svg`, structureSvg(model, { layers: sheet, reactionLabels: 'names' }))
  writeFileSync(`exercise-${seed}-key.svg`, structureSvg(model, { layers: key }))
}
```

`node figures.ts`로 실행하면 학생 30명분, 파일 60개가 생깁니다. 모두 색이 고정되어 있고 CSS도 스크립트도 없는 일반 SVG입니다.

- **Word**(2019와 Microsoft 365)는 SVG를 그대로 삽입합니다: *삽입 › 그림*.
- **LaTeX**는 SVG가 아니라 PDF를 넣습니다. [CairoSVG](https://cairosvg.org)(`cairosvg exercise-1000.svg -o exercise-1000.pdf`)나 Inkscape로 한 번 변환한 다음 `\includegraphics[width=\linewidth]{exercise-1000.pdf}`를 씁니다. Inkscape가 설치되어 있으면 `svg` 패키지의 `\includesvg`가 변환까지 해 줍니다.

그림은 너비 640단위에 글자 13단위이므로, A4 본문 너비(약 16 cm)로 넣으면 레이블은 9 pt가 됩니다. `fontFamily`에는 문서에서 쓰는 글꼴을 지정하세요. 모든 옵션은 [독립 SVG 파일](/ko/plot/functions#a-standalone-svg-file)에 있습니다.

## 내 문제로 만들기 {#make-it-your-own}

- **구조물 종류 늘리기.** 캔틸레버, 2경간 연속보, 문형 라멘, 트러스 같은 경우를 추가하세요. 맨 위의 데모는 단순보부터 3힌지 라멘, 워렌 트러스, 문형 라멘까지 여덟 종류 가운데에서 고릅니다.
- **부정정 문제.** 솔버는 부정정 구조물도 똑같이 풉니다. 손 풀이만 길어질 뿐입니다.
- **딱 떨어지는 숫자.** 위처럼 하중과 길이를 짧은 목록에서 고르면 정답을 원하는 만큼 딱 떨어지게 만들 수 있습니다. 시드 수백 개를 돌려 보고, 정답의 소수 자릿수가 원하는 것보다 많은 시드는 건너뛰세요.
- **메커니즘 막기.** 지점을 잘못 놓을 수 있는 생성기라면 `try` 안에서 풀고, 예외를 던지는 시드는 건너뛰어야 합니다. [해석이 실패할 때](/ko/solver/solving#when-solving-fails)를 참고하세요.
- **더 많이 묻기.** 전단력(`'V'`), 처짐(`'w'`, 값은 [`getUnknowns`](/ko/solver/results#displacements)에서), 경사 부재의 축력도 그려서 물어볼 수 있습니다.
