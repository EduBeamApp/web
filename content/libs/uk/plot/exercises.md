---
title: Вправи та контрольні роботи
description: "Своя вправа для кожного студента із зерна, з відповідями, які завжди правильні: на вебсторінці, у друкованій контрольній чи як SVG для LaTeX і Word."
order: 5
group: Застосування
source: site
---

# Вправи та контрольні роботи

Опишіть конструкцію один раз як функцію зерна (початкового значення генератора випадкових чисел), і у вас буде вправа для кожного студента на кожен тиждень, кожна з відповідями, які завжди правильні: @edubeam/fem розраховує конструкцію, а @edubeam/plot малює завдання й відповіді з однієї й тієї самої моделі.

Натисніть нижче **Нова вправа**. Кожне натискання — це нове зерно: вправа генерується, розраховується й малюється просто у вашому браузері.

::exercise-generator
::

Демонстрація малює задачі двох сторінок цього сайту, обидві побудовані з частин, описаних нижче. На сторінці [Задачі з будівельної механіки](/uk/practice) студент вводить реакції та найбільший момент або зусилля в стрижні й одразу дізнається, чи правильні вони. [Генератор контрольних робіт](/uk/exam) друкує для кожного студента свій варіант контрольної з відповідями, а рисунки зберігає як файли SVG і відповіді як CSV. Спробуйте їх, перш ніж писати власний генератор.

## Як це працює {#how-it-works}

1. **Зерно вибирає числа.** Генератор випадкових чисел із тим самим зерном дає ту саму вправу, тож за зерном, надрукованим на аркуші, завжди можна знову знайти відповіді.
2. **Відповіді обчислює розв’язувач.** @edubeam/fem розраховує кожну конструкцію, тож реакції та моменти беруться з розв’язувача, а не з формули, у якій можна помилитися.
3. **@edubeam/plot малює і завдання, і відповіді.** Завдання показує конструкцію з позначеннями вузлів, розмірами та позначеними невідомими реакціями; у відповідях наведено значення реакцій і додано епюру.

Кілька коротких файлів доведуть вас звідси до надрукованої контрольної: [генератор](#the-generator), [компонент](#the-exercise-in-a-page) для вебсторінки та [скрипт](#print-a-test), який друкує контрольну або [записує рисунки](#figures-for-latex-and-word) для LaTeX і Word. Скопіюйте їх у проєкт, де [встановлено бібліотеки](/uk/plot/getting-started#install); скрипти запускаються командою `node` у версії 22.18 і новіших або через `npx tsx` у старіших.

## Генератор {#the-generator}

Один модуль, `exercise.ts`, перетворює зерно на вправу: балку на шарнірно-нерухомій і шарнірно-рухомій опорах, у половині випадків із консоллю, на вільному кінці якої прикладено зосереджену силу. Обидві схеми статично визначувані, тож кожне зерно можна розв’язати й вручну, і розв’язувачем.

```ts [exercise.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { extremes, modelFromSolver, type PlotModel } from '@edubeam/plot'

export interface Exercise {
  readonly seed: number
  readonly statement: string
  /** Розрахована конструкція як звичайні дані: з неї малюються і завдання, і відповіді */
  readonly model: PlotModel
  /** Опорні реакції, додатні вгору, N, та екстремальні згинальні моменти, N·m */
  readonly key: { RA: number; RB: number; mMax: number; mMin: number }
}

/** mulberry32: крихітний генератор із зерном, тож зерно назавжди визначає ту саму вправу */
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

  // Проліт на шарнірно-нерухомій і шарнірно-рухомій опорах, у половині випадків із консоллю: статично визначувана, тож завжди розв’язна
  const L = pick([4, 5, 6]) // m
  const c = pick([0, 0, 1, 1.5, 2]) // m, довжина консолі
  const q = int(4, 12) // kN/m на прольоті
  const F = int(2, 6) * 5 // kN на вільному кінці, а без консолі — на відстані `a` від A
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

  // Відповіді з розрахованої моделі: реакції (z спрямована вниз, тож угору — це мінус) і точні екстремуми M
  const model = modelFromSolver(solver)
  const { reactions, members } = model.results!
  const up = (node: string) => -(reactions.find((x) => x.node === node && x.dof === 'dz')?.value ?? 0)
  const m = Object.values(members).flatMap((member) => extremes(member.M) ?? [])
  const mMax = Math.max(...m.map((e) => e.max.value))
  const mMin = Math.min(...m.map((e) => e.min.value))

  return { seed, statement, model, key: { RA: up('A'), RB: up('B'), mMax, mMin } }
}
```

`modelFromSolver` перетворює розраховану конструкцію на [модель рисунка](/uk/plot/model): звичайні дані з реакціями та результатами кожного стрижня у вигляді точних поліномів, тож `extremes` знаходить найбільші моменти без дискретизації. Вправа зберігає лише цю модель; розв’язувач більше не потрібен.

Зерно 5 дає умову *«Span L = 6 m with an overhang c = 1.5 m. q = 5 kN/m on the span, F = 25 kN at the tip C.»* (проліт 6 m з консоллю 1,5 m, 5 kN/m на прольоті, 25 kN на вільному кінці C). Відповіді: $R_A = (5 \cdot 6 \cdot 3 - 25 \cdot 1{,}5)/6 = 8{,}75$ kN, $R_B = 5 \cdot 6 + 25 - 8{,}75 = 46{,}25$ kN, над опорою $M_B = -25 \cdot 1{,}5 = -37{,}5$ kNm, а в прольоті, там, де поперечна сила дорівнює нулю, $M = 8{,}75^2/(2 \cdot 5) = 7{,}66$ kNm. Розв’язувач дає те саме до останньої цифри.

## На вебсторінці {#the-exercise-in-a-page}

Компонент `ExerciseCard.vue` малює завдання, а з `answers` — відповіді:

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

Друга картка закінчується текстом *R<sub>A</sub> = 8.75 kN, R<sub>B</sub> = 46.25 kN, M from −37.5 kNm to 7.66 kNm*. `formatQuantity` дописує одиницю та справжній знак мінус, так само як рисунок. Десяткову крапку дає формат `'en'`; з `new Intl.NumberFormat('uk', …)` буде десяткова кома.

У завданні `reaction-labels="names"` малює реакції як невідомі: стрілку для кожної в’язі опори, спрямовану в бік, що вважається додатним (праворуч, угору, проти годинникової стрілки), а замість величини — назву *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>*. Знак кожної відповіді тоді визначено на рисунку: реакція, що діє в протилежний бік, від’ємна. У відповідях наведено значення.

`reserve` від самого початку розміщує шари обох варіантів рисунка, тож коли `answers` вмикається, наприклад кнопкою *Показати розв’язок* для самостійної роботи, епюра плавно з’являється на своєму місці ([Рисунки, що доповнюються](/uk/plot/structure-plot#figures-that-build-up)). `reserve-reaction-labels` робить те саме для реакцій, тож балка лишається на місці, а назви реакцій змінюються на значення: див. [Реакції як невідомі](/uk/plot/structure-plot#reactions-as-unknowns).

## Друкована контрольна {#print-a-test}

Для письмової контрольної скрипт Node `print-test.ts` записує по сторінці на кожного студента, а за ними — відповіді. `structureSvg` перетворює кожну модель на текст SVG, тож скрипту не потрібні ні Vue, ні браузер:

```ts [print-test.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const students = ['Ada', 'Ben', 'Cleo']
const exercises = students.map((_, i) => makeExercise(1000 + i)) // зерна 1000, 1001, …

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

Відкрийте `test.html` у браузері й надрукуйте або збережіть як PDF: вправа кожного студента й кожні відповіді отримають окрему сторінку. Сторінка Ади та відповіді до неї:

![Вправа 1000: проліт 6 m з консоллю 2 m, 10 kN/m на прольоті та 30 kN на вільному кінці, невідомі реакції з позначеннями A_x, A_z і B_z, ланцюгові розміри 6 m і 2 m із загальним розміром 8 m; під нею відповіді з реакціями 20 і 70 та епюрою згинальних моментів від −60 над опорою до 20 у прольоті](/screenshots/uk/p2p-plot-exercise-sheet.webp){.shot-lg}

Шар `dimensions` проставляє розмір кожного прольоту й загальну довжину, як на аркуші завдань, а `reactionLabels: 'names'` позначає невідомі, і кожна стрілка вказує напрямок, у якому відповідь додатна. У відповідях реакції та значення на епюрах — це просто числа в kN і kNm, як у застосунку EduBeam: якщо студентам це треба пояснити, напишіть про це в заголовку відповідей. Для чорно-білого копіювального апарата передайте `colors`, де всі тони чорні: див. [Чорно-білий друк](/uk/plot/theming#black-and-white).

## Рисунки для LaTeX і Word {#figures-for-latex-and-word}

Якщо ви пишете контрольні в LaTeX чи Word, запишіть натомість рисунки у файли, а шаблон залиште свій. `figures.ts` записує завдання й відповіді для 30 зерен:

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

Запустіть його командою `node figures.ts`: для 30 студентів вийде 60 файлів, кожен — звичайний SVG із фіксованими кольорами, без CSS і без скриптів.

- **Word** (2019 і Microsoft 365) вставляє SVG безпосередньо: *Вставлення › Зображення*.
- **LaTeX** вставляє не SVG, а PDF. Перетворіть файли один раз за допомогою [CairoSVG](https://cairosvg.org) (`cairosvg exercise-1000.svg -o exercise-1000.pdf`) або Inkscape, а потім використайте `\includegraphics[width=\linewidth]{exercise-1000.pdf}`. Якщо встановлено Inkscape, перетворення за вас виконає `\includesvg` з пакета `svg`.

Рисунок має ширину 640 одиниць і текст висотою 13 одиниць, тож на ширині текстового стовпця аркуша A4, приблизно 16 cm, підписи мають розмір 9 pt. У `fontFamily` задайте шрифт, яким набрано ваш документ; усі параметри див. у розділі [Окремий файл SVG](/uk/plot/functions#a-standalone-svg-file).

## Під свої потреби {#make-it-your-own}

- **Більше типів конструкцій.** Додайте інші схеми: консоль, двопрольотну нерозрізну балку, П-подібну раму, ферму. Жива демонстрація вгорі вибирає з восьми типів, від шарнірно опертої балки до тришарнірної рами, ферми Воррена та П-подібної рами.
- **Статично невизначувані вправи.** Розв’язувач розраховує їх так само; довшим стає лише ручний розв’язок.
- **Круглі числа.** Вибирайте навантаження й довжини з коротких списків, як вище, і відповіді будуть настільки круглими, як вам потрібно. Переберіть у циклі кілька сотень зерен і пропустіть ті, відповіді яких мають більше десяткових знаків, ніж ви хочете.
- **Захист від механізмів.** Генератор, який може невдало розмістити опори, має розраховувати модель усередині блока `try` і пропускати зерна, для яких виникає виняток: див. [Коли розрахунок не вдається](/uk/solver/solving#when-solving-fails).
- **Більше запитань.** Додайте епюру поперечних сил (`'V'`), прогин (`'w'`, зі значеннями з [`getUnknowns`](/uk/solver/results#displacements)) або поздовжню силу в похилому стрижні.
