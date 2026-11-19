---
title: Упражнения и контрольные работы
description: "Своё упражнение по строительной механике для каждого студента по зерну генератора, с всегда верными ответами: на веб-странице, на бумаге или в SVG для LaTeX и Word."
order: 5
group: Применение
source: site
---

# Упражнения и контрольные работы

Опишите конструкцию один раз как функцию зерна генератора случайных чисел (seed) — и у вас будет упражнение для каждого студента на каждую неделю, и к каждому — ответы, которые всегда верны: @edubeam/fem рассчитывает конструкцию, а @edubeam/plot рисует по одной и той же модели и условие, и ответы.

Нажмите кнопку **Новое упражнение** ниже. Каждое нажатие — новое зерно: упражнение генерируется, рассчитывается и рисуется прямо в вашем браузере.

::exercise-generator
::

Демонстрация рисует задачи с двух страниц этого сайта, и обе собраны из описанных здесь частей. На странице [Задачи по строительной механике](/ru/practice) студент вводит реакции и наибольший момент или усилие в стержне и сразу получает проверку. [Конструктор контрольных работ](/ru/exam) печатает для каждого студента свой вариант контрольной с ответами, а рисунки сохраняет в SVG-файлы и ответы — в CSV. Прежде чем писать собственный генератор, попробуйте их.

## Как это работает {#how-it-works}

1. **Зерно выбирает числа.** Генератор случайных чисел при одном и том же зерне выдаёт одно и то же упражнение, поэтому по зерну, напечатанному на листе, всегда можно снова найти ответы к нему.
2. **Ответы находит решатель.** @edubeam/fem рассчитывает каждую конструкцию, так что реакции и моменты берутся из решателя, а не из формулы, в которой легко ошибиться.
3. **@edubeam/plot рисует и то, и другое.** Условие показывает конструкцию с обозначениями узлов, размерами и неизвестными реакциями, обозначенными по имени; в ответах приведены значения реакций и добавлена эпюра.

Отсюда до напечатанной контрольной — несколько коротких файлов: [генератор](#the-generator), [компонент](#the-exercise-in-a-page) для веб-страницы и [скрипт](#print-a-test), который печатает контрольную или [записывает рисунки](#figures-for-latex-and-word) для LaTeX и Word. Скопируйте их в проект, где [установлены библиотеки](/ru/plot/getting-started#install); скрипты запускаются командой `node` начиная с версии 22.18, а в более старых версиях — через `npx tsx`.

## Генератор {#the-generator}

Один модуль, `exercise.ts`, превращает зерно в упражнение: балку на шарнирно-неподвижной и шарнирно-подвижной опорах, в половине случаев с консолью, на конце которой приложена сосредоточенная сила. Обе схемы статически определимы, поэтому любое зерно можно решить и вручную, и решателем.

```ts [exercise.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { extremes, modelFromSolver, type PlotModel } from '@edubeam/plot'

export interface Exercise {
  readonly seed: number
  readonly statement: string
  /** Рассчитанная конструкция в виде простых данных: по ней рисуются и условие, и ответы */
  readonly model: PlotModel
  /** Опорные реакции, положительные вверх, Н, и экстремальные изгибающие моменты, Н·м */
  readonly key: { RA: number; RB: number; mMax: number; mMin: number }
}

/** mulberry32: маленький генератор с зерном, так что зерно навсегда задаёт одно и то же упражнение */
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

  // Пролёт на шарнирно-неподвижной и шарнирно-подвижной опорах, в половине случаев с консолью: статически определимо, поэтому всегда решается
  const L = pick([4, 5, 6]) // м
  const c = pick([0, 0, 1, 1.5, 2]) // м, вылет консоли
  const q = int(4, 12) // кН/м на пролёте
  const F = int(2, 6) * 5 // кН на конце консоли, а без консоли — на расстоянии `a` от A
  const a = int(1, L - 1) // м

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

  // Ответы по рассчитанной модели: реакции (z направлена вниз, поэтому вверх — со знаком минус) и точные экстремумы M
  const model = modelFromSolver(solver)
  const { reactions, members } = model.results!
  const up = (node: string) => -(reactions.find((x) => x.node === node && x.dof === 'dz')?.value ?? 0)
  const m = Object.values(members).flatMap((member) => extremes(member.M) ?? [])
  const mMax = Math.max(...m.map((e) => e.max.value))
  const mMin = Math.min(...m.map((e) => e.min.value))

  return { seed, statement, model, key: { RA: up('A'), RB: up('B'), mMax, mMin } }
}
```

`modelFromSolver` переводит рассчитанную конструкцию в [модель рисунка](/ru/plot/model): простые данные с реакциями и результатами для каждого стержня в виде точных полиномов, поэтому `extremes` находит наибольшие моменты без дискретизации. Упражнение хранит только эту модель, решатель больше не нужен.

Зерно 5 даёт условие *«Span L = 6 m with an overhang c = 1.5 m. q = 5 kN/m on the span, F = 25 kN at the tip C.»* (строки условия в коде написаны по-английски — переведите их для своего курса). Ответы к нему: $R_A = (5 \cdot 6 \cdot 3 - 25 \cdot 1{,}5)/6 = 8{,}75$ кН, $R_B = 5 \cdot 6 + 25 - 8{,}75 = 46{,}25$ кН, над опорой $M_B = -25 \cdot 1{,}5 = -37{,}5$ кН·м, а в пролёте, там, где поперечная сила равна нулю, $M = 8{,}75^2/(2 \cdot 5) = 7{,}66$ кН·м. Решатель даёт то же самое до последней цифры.

## На веб-странице {#the-exercise-in-a-page}

Компонент `ExerciseCard.vue` рисует условие, а со свойством `answers` — ответы:

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

Вторая карточка заканчивается строкой *R<sub>A</sub> = 8.75 kN, R<sub>B</sub> = 46.25 kN, M from −37.5 kNm to 7.66 kNm*. `formatQuantity` дописывает единицу и ставит настоящий знак минуса, как и сам рисунок. Десятичная точка здесь из формата `'en'`; с `new Intl.NumberFormat('ru', …)` получится десятичная запятая.

В условии `reaction-labels="names"` рисует реакции как неизвестные: стрелку для каждого направления, в котором закреплена опора, направленную в положительную сторону (вправо, вверх, против часовой стрелки), с обозначением *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>* вместо величины. Так знак каждого ответа задан прямо на рисунке: реакция, действующая в обратную сторону, отрицательна. В ответах выводятся значения.

`reserve` с самого начала размещает слои обоих вариантов, поэтому, когда `answers` включается, например кнопкой *Показать решение* для самостоятельной работы, эпюра плавно появляется на своём месте ([Рисунки, которые строятся по шагам](/ru/plot/structure-plot#figures-that-build-up)). `reserve-reaction-labels` делает то же для реакций: балка остаётся на месте, а обозначения реакций сменяются значениями, см. [Реакции как неизвестные](/ru/plot/structure-plot#reactions-as-unknowns).

## Контрольная на бумаге {#print-a-test}

Для письменной контрольной скрипт для Node `print-test.ts` создаёт по странице на каждого студента, а после них — страницы с ответами. `structureSvg` превращает каждую модель в текст SVG, поэтому скрипту не нужны ни Vue, ни браузер:

```ts [print-test.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const students = ['Ada', 'Ben', 'Cleo']
const exercises = students.map((_, i) => makeExercise(1000 + i)) // зёрна 1000, 1001, …

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

Откройте `test.html` в браузере и распечатайте его или сохраните в PDF: упражнение каждого студента и каждые ответы получают отдельную страницу. Страница Ады и ответы к ней:

![Упражнение 1000: пролёт 6 м с консолью 2 м, 10 кН/м на пролёте и 30 кН на конце консоли, неизвестные реакции с обозначениями A_x, A_z и B_z и размерная цепочка 6 м и 2 м с общим размером 8 м; под ним ответы: реакции 20 и 70 и эпюра изгибающих моментов от −60 над опорой до 20 в пролёте](/screenshots/ru/p2p-plot-exercise-sheet.webp){.shot-lg}

Слой `dimensions` проставляет размеры всех участков и общую длину, как это принято в условии задачи, а `reactionLabels: 'names'` обозначает неизвестные, и каждая стрелка указывает направление, в котором ответ считается положительным. В ответах реакции и значения на эпюрах — числа без единиц, в кН и кН·м, как в приложении EduBeam; если студентам это нужно пояснить, укажите единицы в заголовке ответов. Для чёрно-белого копира передайте `colors`, где все тона чёрные: см. [Чёрно-белая печать](/ru/plot/theming#black-and-white).

## Рисунки для LaTeX и Word {#figures-for-latex-and-word}

Если вы готовите контрольные в LaTeX или Word, лучше записать рисунки в файлы и оставить собственный шаблон. `figures.ts` записывает условия и ответы для 30 зёрен:

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

Запустите его командой `node figures.ts`: получится 60 файлов на 30 студентов, каждый — простой SVG с фиксированными цветами, без CSS и без скриптов.

- **Word** (2019 и Microsoft 365) вставляет SVG как есть: *Вставка › Рисунки*.
- **LaTeX** вставляет не SVG, а PDF. Один раз преобразуйте файлы с помощью [CairoSVG](https://cairosvg.org) (`cairosvg exercise-1000.svg -o exercise-1000.pdf`) или Inkscape, затем используйте `\includegraphics[width=\linewidth]{exercise-1000.pdf}`. Если установлен Inkscape, команда `\includesvg` из пакета `svg` выполнит преобразование сама.

Рисунок имеет ширину 640 единиц и текст высотой 13 единиц, поэтому при ширине текстовой колонки на листе A4, около 16 см, подписи получаются размером 9 пт. В `fontFamily` укажите шрифт, которым набран ваш документ; все параметры описаны в разделе [Отдельный SVG-файл](/ru/plot/functions#a-standalone-svg-file).

## Под свой курс {#make-it-your-own}

- **Больше видов конструкций.** Добавьте новые случаи: консольную балку, двухпролётную неразрезную балку, П-образную раму, ферму. Демонстрация в начале страницы выбирает из восьми видов — от шарнирно опёртой балки до трёхшарнирной рамы, фермы Уоррена и П-образной рамы.
- **Статически неопределимые упражнения.** Решатель справляется с ними так же хорошо; длиннее становится только ручное решение.
- **Круглые числа.** Выбирайте нагрузки и длины из коротких списков, как выше, и ответы получатся настолько круглыми, насколько нужно. Переберите в цикле несколько сотен зёрен и пропустите те, у которых в ответах больше знаков после запятой, чем вам хочется.
- **Защита от механизмов.** Генератор, который может неудачно расставить опоры, должен выполнять расчёт внутри `try` и пропускать зёрна, на которых возникает исключение: см. [Если расчёт не удался](/ru/solver/solving#when-solving-fails).
- **Больше вопросов.** Рисуйте эпюру поперечных сил (`'V'`), прогибы (`'w'`, со значениями из [`getUnknowns`](/ru/solver/results#displacements)) или продольную силу в наклонном стержне.
