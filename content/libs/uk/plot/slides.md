---
title: Слайди та конспекти
description: "Лекційні рисунки з @edubeam/plot: доповнюються з кожним клацанням у Slidev, Vue чи Beamer, рахуються наживо й потрапляють у конспекти, PowerPoint і Word як SVG."
order: 6
source: site
---

# Слайди та конспекти лекцій

Показуйте конструкцію так, як ви її пояснюєте: спочатку геометрію, потім опори й навантаження, далі реакції і насамкінець епюру згинальних моментів. Рисунок, намальований із розрахованої моделі, доповнюється на місці, по одному шару на клацання, і завжди правильний. Та сама модель потім дає рисунки для конспектів.

![Слайд у Slidev після 0, 2 і 4 клацань: вузли П-подібної рами з розмірами, потім рама на опорах із навантаженням, нарешті реакції та епюра згинальних моментів](/screenshots/uk/p2p-plot-slidev-steps.webp){.shot-md}

## Рисунок, що доповнюється {#a-figure-that-builds-up}

Знадобляться два файли. `frame.ts` створює й розраховує конструкцію:

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** П-подібна рама 6 m × 4 m: шарнірно-нерухомі опори, 10 kN/m на ригелі та 15 kN, що штовхає вузол B. */
export const portalFrame = (): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 }) // IPE 300
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [0, 0, -4]) // z спрямована вниз: 4 m угору
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

`BuildUp.vue` малює її поетапно. Кожен етап перелічує шари, які показує, а `reserve` розміщує їх усі вже з першого клацання, тож кожен шар плавно з’являється на своєму місці й ніщо не зсувається:

```vue [BuildUp.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { StructurePlot, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame'

const props = defineProps<{ step: number }>()

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'], // геометрія
  ['nodeLabels', 'members', 'supports'], // конструкція
  ['nodeLabels', 'members', 'supports', 'loads'], // її навантаження
  ['members', 'supports', 'loads', 'reactions'], // реакції
  ['members', 'supports', 'reactions', 'M'], // і епюра згинальних моментів
]
const all = [...new Set(stages.flat())] // розміщені з першого кроку, тож пізніше ніщо не зсувається
const layers = computed(() => stages[Math.min(props.step, stages.length - 1)])

const frame = portalFrame()
</script>

<template>
  <StructurePlot :solver="frame" :layers="layers" :reserve="all" :height="360" />
</template>
```

Шар може й зникнути: на останньому етапі навантаження прибрано, щоб звільнити місце для епюри моментів. `:height="360"` утримує рисунок у межах слайда. Стрижні прокреслюються від одного кінця до іншого, коли з’являються вперше, а шари плавно з’являються впродовж пів секунди; за `prefers-reduced-motion` обидва ефекти вимкнено, а `:animate="false"` вимикає їх для всіх. Як сповільнити їх для лекційної аудиторії, див. [Зміна стилю анімації](/uk/plot/theming#restyling-the-animation).

## У Slidev {#in-slidev}

[Slidev](https://sli.dev) створює слайди з Markdown за допомогою Vue, тож компонент працює там без змін. Встановіть бібліотеки в проєкт презентації:

```bash
npm install @edubeam/plot @edubeam/fem
```

Покладіть `frame.ts` і `BuildUp.vue` у теку `components/` презентації, а в `slides.md` нехай етап визначають клацання слайда:

```md [slides.md]
---
clicks: 4
---

# From geometry to bending moment

<BuildUp :step="$clicks" />
```

`clicks: 4` дає слайду чотири клацання, а `$clicks` рахує їх від 0. Кожне натискання клавіші зі стрілкою показує наступний етап, повернення назад знову його ховає. `slidev export` створює з презентації PDF, а з `--with-clicks` — по сторінці на кожне клацання.

## У будь-яких слайдах на Vue {#in-any-vue-slides}

В інших випадках зберігайте номер етапу самі:

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

## Розрахунок наживо {#solve-it-live}

Таку раму розв’язувач розраховує за мілісекунди, тож на лекції можна змінити конструкцію й одразу її розрахувати. Прив’яжіть навантаження до повзунка й щоразу передавайте нову розраховану модель, як у розділі [Коли модель змінюється](/uk/plot/getting-started#when-the-model-changes).

- **Рухоме навантаження.** [DiagramStack](/uk/plot/diagram-stack#a-load-the-reader-can-drag) дає студентам змогу перетягувати зосереджену силу вздовж балки й спостерігати, як за нею змінюються поперечна сила та згинальний момент.
- **Випадки поруч.** Зафіксуйте [`diagramScale`](/uk/plot/structure-plot#several-plots-at-one-scale), і два рисунки намалюють моменти в одному масштабі, тож більший момент і виглядатиме більшим.
- **Зчитування значень.** З `hover` наведення курсора на стрижень позначає значення на кінці ординати кожної епюри: див. [Зчитування значень](/uk/plot/structure-plot#reading-values).

## Рисунки для Beamer, PowerPoint і Word {#figures-for-beamer-powerpoint-and-word}

Презентація в LaTeX Beamer чи PowerPoint або конспект у Word отримують рисунок як файл. `structureSvg` записує рисунок як окремий SVG зі звичайними кольорами й тим самим компонуванням, що й у `StructurePlot`. Скрипт Node `frame-svg.ts` поруч із `frame.ts`:

```ts [frame-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![П-подібна рама як окремий файл SVG, відрендерений CairoSVG: навантаження, реакції 20 і 40 угору та 2,3 і 12,7 горизонтально, епюра згинальних моментів від −50,7 у вузлі C до 29,3 на ригелі](/screenshots/uk/p2p-plot-frame-svg.webp){.shot-lg}

PowerPoint і Word (2019 і Microsoft 365) вставляють SVG без змін. LaTeX приймає його як PDF: перетворіть файл командою `cairosvg frame.svg -o frame.pdf` або в Inkscape чи доручіть це `\includesvg` з пакета `svg`. Подробиці наведено в розділі [Рисунки для LaTeX і Word](/uk/plot/exercises#figures-for-latex-and-word), а всі параметри — в розділі [Окремий файл SVG](/uk/plot/functions#a-standalone-svg-file).

### Поетапний рисунок у Beamer {#a-build-up-in-beamer}

Файл підганяється під шари, які він малює, тож файли, записані для кожного етапу окремо, не збігалися б між собою. Передайте `structureSvg` той самий `reserve`, що й у `BuildUp.vue`, тобто всі шари всіх етапів, і кожен файл матиме однаковий розмір, а конструкція — те саме місце. `frame-stages.ts` записує по файлу на етап:

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

Перетворіть файли на PDF:

```bash
for i in 1 2 3 4 5; do cairosvg frame-$i.svg -o frame-$i.pdf; done
```

і покажіть кожен на окремому оверлеї (overlay). Кожен файл містить цілий етап, тож кадр показує їх по одному, а оскільки вони збігаються, здається, що кожне клацання додає шар:

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

У PowerPoint покладіть п’ять файлів на п’ять послідовних слайдів без переходів між ними: кожен крок виглядатиме так само, як клацання на лекції.

## Конспекти й роздаткові матеріали {#notes-and-handouts}

- **Конспект лекцій в інтернеті.** VitePress і Nuxt рендерять рисунки під час збирання, тож рисунки є в HTML ще до запуску будь-якого скрипту: див. [Вбудовування](/uk/plot/embedding).
- **Друкований конспект.** Запишіть рисунки за допомогою `structureSvg` у сторінку HTML і надрукуйте її, як це робить [скрипт для друку контрольної](/uk/plot/exercises#print-a-test), або вставте файли в LaTeX чи Word.
- **Одна модель, усі рисунки.** З того самого `frame.ts` беруться рисунки для слайдів, конспекту й аркуша завдань, тож вони ніколи не розходяться.
