---
title: Слайды и конспекты
description: "Рисунки для лекций с @edubeam/plot: дополняются по щелчку в Slidev, Vue или Beamer, считаются на лету и попадают в конспекты, PowerPoint и Word как SVG."
order: 6
source: site
---

# Слайды и конспекты лекций

Показывайте конструкцию в том порядке, в каком её объясняете: сначала геометрию, затем опоры и нагрузки, потом реакции и в конце эпюру изгибающих моментов. Рисунок, построенный по рассчитанной модели, дополняется на месте, по одному слою на щелчок, и всегда верен. Та же модель затем даёт и рисунки для конспекта.

![Слайд в Slidev после 0, 2 и 4 щелчков: узлы П-образной рамы с размерами, затем рама на опорах с нагрузками, затем реакции и эпюра изгибающих моментов](/screenshots/ru/p2p-plot-slidev-steps.webp){.shot-md}

## Рисунок, который строится по шагам {#a-figure-that-builds-up}

Понадобятся два файла. `frame.ts` строит и рассчитывает конструкцию:

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** П-образная рама 6 × 4 м с шарнирными опорами, 10 кН/м на ригеле и сила 15 кН, приложенная в узле B. */
export const portalFrame = (): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 }) // IPE 300
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [0, 0, -4]) // z направлена вниз: 4 м вверх
  domain.createNode('C', [6, 0, -4])
  domain.createNode('D', [6, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  domain.createBeam2D(2, ['B', 'C'], 1, 1)
  domain.createBeam2D(3, ['C', 'D'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(2, [0, 10e3], true)
  solver.loadCases[0].createNodalLoad('B', { [DofID.Dx]: 15e3 })
  solver.solve()
  return solver
}
```

`BuildUp.vue` рисует её по шагам. Каждый шаг перечисляет слои, которые он показывает, а `reserve` размещает их все уже с первого щелчка, поэтому каждый слой плавно появляется на своём месте и ничего не сдвигается:

```vue [BuildUp.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { StructurePlot, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame'

const props = defineProps<{ step: number }>()

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'], // геометрия
  ['nodeLabels', 'members', 'supports'], // конструкция
  ['nodeLabels', 'members', 'supports', 'loads'], // её нагрузки
  ['members', 'supports', 'loads', 'reactions'], // реакции
  ['members', 'supports', 'reactions', 'M'], // и эпюра изгибающих моментов
]
const all = [...new Set(stages.flat())] // размещаются с первого шага, чтобы потом ничего не сдвигалось
const layers = computed(() => stages[Math.min(props.step, stages.length - 1)])

const frame = portalFrame()
</script>

<template>
  <StructurePlot :solver="frame" :layers="layers" :reserve="all" :height="360" />
</template>
```

Слой может и исчезнуть: на последнем шаге нагрузки убираются, чтобы освободить место для эпюры моментов. `:height="360"` удерживает рисунок в пределах слайда. При первом появлении стержни прорисовываются от одного конца к другому, а слои проявляются за полсекунды; при `prefers-reduced-motion` обе анимации отключены, а `:animate="false"` отключает их для всех. Как замедлить их для большой аудитории, описано в разделе [Настройка анимации](/ru/plot/theming#restyling-the-animation).

## В Slidev {#in-slidev}

[Slidev](https://sli.dev) собирает слайды из Markdown с помощью Vue, поэтому компонент работает там без изменений. Установите библиотеки в проект презентации:

```bash
npm install @edubeam/plot @edubeam/fem
```

Положите `frame.ts` и `BuildUp.vue` в папку `components/` презентации, а в `slides.md` свяжите шаг со щелчками на слайде:

```md [slides.md]
---
clicks: 4
---

# From geometry to bending moment

<BuildUp :step="$clicks" />
```

`clicks: 4` задаёт слайду четыре щелчка, а `$clicks` считает их с 0. Каждое нажатие клавиши со стрелкой показывает следующий шаг, а возврат назад снова его скрывает. `slidev export` сохраняет презентацию в PDF, а с `--with-clicks` — по странице на каждый щелчок.

## В любых слайдах на Vue {#in-any-vue-slides}

В любой другой среде храните номер шага сами:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import BuildUp from './BuildUp.vue'

const step = ref(0)
</script>

<template>
  <BuildUp :step="step" />
  <button type="button" @click="step = Math.max(0, step - 1)">Back</button>
  <button type="button" @click="step++">Next</button>
</template>
```

## Расчёт прямо на лекции {#solve-it-live}

Такую раму решатель рассчитывает за миллисекунды, поэтому на лекции конструкцию можно менять и сразу пересчитывать. Свяжите нагрузку с ползунком и каждый раз передавайте новую рассчитанную модель, как в разделе [Когда модель меняется](/ru/plot/getting-started#when-the-model-changes).

- **Подвижная нагрузка.** [DiagramStack](/ru/plot/diagram-stack#a-load-the-reader-can-drag) позволяет студентам перетаскивать сосредоточенную силу вдоль балки и смотреть, как за ней следуют эпюры поперечных сил и изгибающих моментов.
- **Варианты рядом.** Зафиксируйте [`diagramScale`](/ru/plot/structure-plot#several-plots-at-one-scale), и два рисунка покажут моменты в одном масштабе, так что больший момент и выглядит больше.
- **Считывание значений.** С `hover` при наведении указателя на стержень значение отмечается на конце ординаты каждой эпюры: см. [Считывание значений](/ru/plot/structure-plot#reading-values).

## Рисунки для Beamer, PowerPoint и Word {#figures-for-beamer-powerpoint-and-word}

В презентацию в LaTeX Beamer или PowerPoint и в конспект в Word рисунок вставляется файлом. `structureSvg` записывает рисунок в отдельный SVG-файл с фиксированными цветами и той же компоновкой, что и у `StructurePlot`. Скрипт для Node `frame-svg.ts` лежит рядом с `frame.ts`:

```ts [frame-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![П-образная рама в виде отдельного SVG-файла, отрисованного CairoSVG: нагрузки, реакции 20 и 40 вверх и 2,3 и 12,7 по горизонтали и эпюра изгибающих моментов от −50,7 в узле C до 29,3 на ригеле](/screenshots/ru/p2p-plot-frame-svg.webp){.shot-lg}

PowerPoint и Word (2019 и Microsoft 365) вставляют SVG как есть. LaTeX принимает его в виде PDF: преобразуйте файл командой `cairosvg frame.svg -o frame.pdf` или в Inkscape либо поручите это команде `\includesvg` из пакета `svg`. Подробности — в разделе [Рисунки для LaTeX и Word](/ru/plot/exercises#figures-for-latex-and-word), все параметры — в разделе [Отдельный SVG-файл](/ru/plot/functions#a-standalone-svg-file).

### Пошаговый рисунок в Beamer {#a-build-up-in-beamer}

Файл подгоняется под слои, которые в нём нарисованы, поэтому файлы, записанные для каждого шага по отдельности, не совпадут друг с другом. Передайте `structureSvg` тот же `reserve`, что и в `BuildUp.vue`, — все слои всех шагов, — и все файлы получатся одного размера, с конструкцией на одном и том же месте. `frame-stages.ts` записывает по файлу на каждый шаг:

```ts [frame-stages.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'],
  ['nodeLabels', 'members', 'supports'],
  ['nodeLabels', 'members', 'supports', 'loads'],
  ['members', 'supports', 'loads', 'reactions'],
  ['members', 'supports', 'reactions', 'M'],
]
const all = [...new Set(stages.flat())]
const frame = modelFromSolver(portalFrame())

stages.forEach((layers, i) => {
  writeFileSync(`frame-${i + 1}.svg`, structureSvg(frame, { layers, reserve: all }))
})
```

Преобразуйте файлы в PDF:

```bash
for i in 1 2 3 4 5; do cairosvg frame-$i.svg -o frame-$i.pdf; done
```

и выведите каждый файл на своём шаге показа Beamer (`<1>`, `<2>`, …). Каждый файл содержит шаг целиком, поэтому кадр показывает их по одному, а поскольку файлы совпадают, кажется, что с каждым щелчком добавляется слой:

```latex [lecture.tex]
\begin{frame}{From geometry to bending moment}
  \centering
  \includegraphics<1>[width=0.8\linewidth]{frame-1.pdf}%
  \includegraphics<2>[width=0.8\linewidth]{frame-2.pdf}%
  \includegraphics<3>[width=0.8\linewidth]{frame-3.pdf}%
  \includegraphics<4>[width=0.8\linewidth]{frame-4.pdf}%
  \includegraphics<5>[width=0.8\linewidth]{frame-5.pdf}
\end{frame}
```

В PowerPoint разместите пять файлов на пяти идущих подряд слайдах без переходов между ними: на лекции каждый шаг будет выглядеть как щелчок по тому же слайду.

## Конспекты и раздаточные материалы {#notes-and-handouts}

- **Конспект лекций на сайте.** VitePress и Nuxt отрисовывают рисунки во время сборки, поэтому рисунки попадают в HTML ещё до запуска каких-либо скриптов: см. [Встраивание](/ru/plot/embedding).
- **Печатный конспект.** Запишите рисунки с помощью `structureSvg` в HTML-страницу и распечатайте её, как это делает [скрипт для печати контрольных](/ru/plot/exercises#print-a-test), или вставьте файлы в LaTeX или Word.
- **Одна модель — все рисунки.** Один и тот же `frame.ts` используется для слайдов, конспекта и листа с условием, поэтому они никогда не расходятся.
