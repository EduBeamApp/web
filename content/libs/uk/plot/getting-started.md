---
title: Початок роботи
description: "Встановіть @edubeam/plot, намалюйте у Vue 3 балку з @edubeam/fem з навантаженням, реакціями й епюрою моментів, оновлюйте її та збережіть у SVG."
order: 1
group: Вступ
source: site
---

# Початок роботи

@edubeam/plot малює плоску балку, раму чи ферму разом із результатами у форматі SVG: стрижні, опори, навантаження, реакції, епюри N, V і M та деформовану схему — саме так, як виглядають рисунки на цьому сайті. Ви передаєте їй модель, розраховану бібліотекою [@edubeam/fem](/uk/solver), тим самим розв’язувачем, на якому працює [EduBeam]{.edubeam}, а бібліотека сама вибирає компонування, масштаб і місце для кожного числа.

Викладачі використовують її для [вправ і контрольних робіт](/uk/plot/exercises), які генеруються із зерна (початкового значення генератора випадкових чисел), для [слайдів](/uk/plot/slides), на яких рисунок доповнюється з кожним клацанням, і для рисунків у конспектах — на вебсторінці або у файлах для LaTeX і Word. На ній побудовано й сторінки [Задачі з будівельної механіки](/uk/practice) та [генератор контрольних робіт](/uk/exam) на цьому сайті.

::div{.actions}
[Намалюйте перший рисунок](#draw-a-solved-model) [Згенеруйте вправи](/uk/plot/exercises)
::

## Встановлення {#install}

```bash
npm install @edubeam/plot @edubeam/fem vue
```

Vue (від версії 3.5) і розв’язувач є peer dependencies, тож у вашому застосунку буде лише одна копія кожного з них. Пакет підтримує тільки ESM, містить власні типи й не потребує жодного файлу стилів. Він працює в Node 20.19 і новіших версіях; щоб запускати скрипт на TypeScript без компіляції, командою `node script.ts`, потрібна версія Node 22.18 або новіша.

## Рисунок розрахованої моделі {#draw-a-solved-model}

Знадобляться два файли. Перший, `beams.ts`, створює й розраховує балку за допомогою @edubeam/fem. Це звичайна функція, тож одну й ту саму модель можна використати на сторінці, у слайді та в скрипті:

```ts [beams.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Розрахована шарнірно оперта балка прольотом `span` m під навантаженням `q` kN/m. Розв’язувач працює в одиницях СІ. */
export const simpleBeam = (span: number, q: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 }) // сталь, Pa
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 }) // IPE 200, без деформацій зсуву
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // шарнірно-нерухома опора
  domain.createNode('B', [span, 0, 0], [DofID.Dz]) // шарнірно-рухома опора
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true) // N/m, +z спрямована вниз
  solver.solve()
  return solver
}
```

Другий, `BeamFigure.vue`, передає розв’язувач компоненту `StructurePlot` і вказує, що малювати:

```vue [BeamFigure.vue]
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams'

const beam = simpleBeam(6, 12)
</script>

<template>
  <StructurePlot :solver="beam" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
</template>
```

Ось і весь рисунок: балка на опорах, навантаження 12 kN/m, дві реакції по 36 kN та епюра згинальних моментів зі значенням $qL^2/8 = 54$ kNm посередині прольоту, побудована з боку розтягнутих волокон:

::model-figure{caption="Що малює BeamFigure.vue: проліт 6 m під навантаженням 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
labels: horizontal
---
::

Рисунок займає всю ширину контейнера, а висоту визначає сам. Текст, символи й товщина ліній зберігають свій розмір у пікселях незалежно від розмірів конструкції, тому рисунок добре читається й на телефоні. Якщо не задати `layers`, рисунок сам вибере, який результат показати: M для балок і рам, N для ферми. Усі [шари](/uk/plot/structure-plot#layers) описано на сторінці `StructurePlot`, а як створювати моделі, пояснює [документація розв’язувача](/uk/solver/getting-started).

## Коли модель змінюється {#when-the-model-changes}

Рисунок читає переданий йому розв’язувач, але не стежить за ним. Коли щось змінюється, розрахуйте модель знову й передайте новий розв’язувач. Саме це й робить `computed`:

```vue [LoadSlider.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams'

const q = ref(12) // kN/m
const beam = computed(() => simpleBeam(6, q.value))
</script>

<template>
  <input v-model.number="q" type="range" min="1" max="30" />
  <StructurePlot :solver="beam" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
</template>
```

Таку балку розв’язувач розраховує приблизно за мілісекунду, тому рисунок встигає за повзунком, поки той рухається. Змінили розв’язувач на місці, без створення нового? Збільште значення пропа `revision`, і рисунок прочитає його знову.

::callout{type="tip" title="Не робіть розв’язувач глибоко реактивним"}
`computed`, проп або звичайна `const` зберігають розв’язувач таким, як він є. Щоб тримати його в стані компонента, використайте `shallowRef` або обгорніть його в `markRaw`: звичайний `ref` змусив би Vue обійти весь розв’язувач, щоб зробити його реактивним, і все це даремно.
::

## Збереження у файл {#save-it-as-a-file}

Для рисунка в LaTeX, Word чи Inkscape функція `structureSvg` записує той самий рисунок як окремий файл SVG зі звичайними кольорами. Їй не потрібні ні Vue, ні браузер, лише Node. Збережіть цей скрипт як `beam-svg.ts` поруч із `beams.ts`:

```ts [beam-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { simpleBeam } from './beams.ts'

const svg = structureSvg(modelFromSolver(simpleBeam(6, 12)), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
})
writeFileSync('beam.svg', svg)
```

Запустіть його командою `node beam-svg.ts` (Node 22.18 або новіша версія; у старіших версіях `npx tsx beam-svg.ts`). Параметри та те, як вставити файл у LaTeX і Word, описано в розділі [Окремий файл SVG](/uk/plot/functions#a-standalone-svg-file).

## Епюри під балкою {#the-stacked-figure}

`DiagramStack` малює рисунок, знайомий з кожного підручника будівельної механіки: пряму балку з навантаженням, а під нею на спільній осі x епюри V(x), M(x) і w(x). З `v-model:load-at` читач може перетягувати зосереджену силу вздовж балки й спостерігати, як змінюються епюри:

```vue
<DiagramStack v-model:load-at="at" :solver="solveWithLoadAt(at)" />
```

Повний приклад наведено на сторінці [DiagramStack](/uk/plot/diagram-stack).

## Використання в усьому застосунку {#use-it-everywhere}

Щоб зареєструвати обидва компоненти глобально, а не імпортувати їх там, де вони потрібні:

```ts [main.ts]
import { createApp } from 'vue'
import { EduBeamPlot } from '@edubeam/plot'
import App from './App.vue'

createApp(App).use(EduBeamPlot).mount('#app') // <StructurePlot> і <DiagramStack> у кожному шаблоні
```

Іменовані імпорти зменшують бандл: сторінка, яка імпортує лише `StructurePlot`, не отримує ні `DiagramStack`, ні плагіна. Обидва компоненти рендеряться й на сервері, у Nuxt або VitePress: див. [Вбудовування](/uk/plot/embedding).

## Що далі {#next}

::card-grid{cols="2"}
:::card{title="Вправи та контрольні роботи" icon="lucide:dices" to="/uk/plot/exercises"}
Для кожного студента своя вправа із зерна, разом із відповідями, надрукована або збережена для LaTeX.
:::
:::card{title="Слайди та конспекти" icon="lucide:presentation" to="/uk/plot/slides"}
Рисунки, що доповнюються з кожним клацанням у Slidev, Vue чи Beamer, і ті самі рисунки для конспектів.
:::
:::card{title="StructurePlot" icon="lucide:frame" to="/uk/plot/structure-plot"}
Шари, розмірні лінії, мініатюри, розмір рисунка, одиниці та зчитування значень курсором.
:::
:::card{title="DiagramStack" icon="lucide:rows-3" to="/uk/plot/diagram-stack"}
Балка над своїми епюрами V, M і w із силою, яку читач може перетягувати.
:::
::
