---
title: Начало работы
description: "Установка @edubeam/plot, рисунок балки, рассчитанной в @edubeam/fem, с нагрузками, реакциями и эпюрой M во Vue 3, обновление вслед за моделью и экспорт в SVG."
order: 1
group: Введение
source: site
---

# Начало работы

@edubeam/plot рисует плоскую балку, раму или ферму вместе с результатами расчёта в формате SVG: стержни, опоры, нагрузки, реакции, эпюры N, V и M и деформированную схему — точно так же, как выглядят рисунки на этом сайте. На вход библиотека получает модель, рассчитанную в [@edubeam/fem](/ru/solver) — решателе, на котором работает [EduBeam]{.edubeam}, а компоновку, масштаб и место для каждого числа подбирает сама.

Преподаватели делают с её помощью [упражнения и контрольные работы](/ru/plot/exercises), которые генерируются по зерну генератора случайных чисел (seed), [слайды](/ru/plot/slides), где рисунок дополняется с каждым щелчком, и иллюстрации для конспектов — на веб-странице или в виде файлов для LaTeX и Word. На ней же построены [задачи по строительной механике](/ru/practice) и [конструктор контрольных работ](/ru/exam) на этом сайте.

::div{.actions}
[Построить первый рисунок](#draw-a-solved-model) [Сгенерировать упражнения](/ru/plot/exercises)
::

## Установка {#install}

```bash
npm install @edubeam/plot @edubeam/fem vue
```

Vue 3.5 или новее и решатель указаны как peer dependencies, поэтому в приложении остаётся по одной копии каждого из них. Пакет распространяется только в формате ESM, содержит собственные типы и не требует таблицы стилей. Он работает в Node 20.19 и новее; чтобы запускать скрипт на TypeScript как есть, командой `node script.ts`, нужен Node 22.18 или новее.

## Рисунок рассчитанной модели {#draw-a-solved-model}

Понадобятся два файла. Первый, `beams.ts`, строит и рассчитывает балку в @edubeam/fem. Это обычная функция, поэтому одна и та же модель пригодится и для страницы, и для слайда, и для скрипта:

```ts [beams.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Шарнирно опёртая балка пролётом `span` м под нагрузкой `q` кН/м, уже рассчитанная. Решатель работает в единицах СИ. */
export const simpleBeam = (span: number, q: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 }) // сталь, Па
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 }) // IPE 200 без деформаций сдвига
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // шарнирно-неподвижная опора
  domain.createNode('B', [span, 0, 0], [DofID.Dz]) // шарнирно-подвижная опора
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true) // Н/м, +z направлена вниз
  solver.solve()
  return solver
}
```

Второй, `BeamFigure.vue`, передаёт решатель компоненту `StructurePlot` и указывает, что рисовать:

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

Вот и весь рисунок: балка на опорах, нагрузка 12 кН/м, две реакции по 36 кН и эпюра изгибающих моментов с $qL^2/8 = 54$ кН·м в середине пролёта, отложенная со стороны растянутых волокон:

::model-figure{caption="Что рисует BeamFigure.vue: пролёт 6 м под нагрузкой 12 кН/м"}
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

Рисунок занимает всю ширину контейнера, а высоту выбирает сам. Текст, условные обозначения и толщина линий сохраняют свой размер в пикселях, как бы велика ни была конструкция, поэтому рисунок остаётся читаемым и на телефоне. Если не указать `layers`, рисунок сам выберет, какой результат показать: M для балок и рам, N для фермы. Все [слои](/ru/plot/structure-plot#layers) перечислены на странице `StructurePlot`, а построение моделей описано в [документации решателя](/ru/solver/getting-started).

## Когда модель меняется {#when-the-model-changes}

Рисунок считывает переданный ему решатель, но не следит за его изменениями. Если что-то изменилось, рассчитайте модель заново и передайте новый решатель. Именно это и делает `computed`:

```vue [LoadSlider.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams'

const q = ref(12) // кН/м
const beam = computed(() => simpleBeam(6, q.value))
</script>

<template>
  <input v-model.number="q" type="range" min="1" max="30" />
  <StructurePlot :solver="beam" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
</template>
```

Такая балка рассчитывается примерно за миллисекунду, поэтому рисунок успевает за движением ползунка. Если же вы изменили существующий решатель на месте, увеличьте значение свойства `revision`, и рисунок прочитает решатель заново.

::callout{type="tip" title="Не делайте решатель глубоко реактивным"}
`computed`, свойство компонента или обычная `const` хранят решатель как есть. Чтобы держать решатель в состоянии компонента, используйте `shallowRef` или оберните его в `markRaw`: обычный `ref` заставил бы Vue без всякой пользы обойти весь решатель, чтобы сделать его реактивным.
::

## Сохранение в файл {#save-it-as-a-file}

Для рисунка в LaTeX, Word или Inkscape функция `structureSvg` записывает то же изображение в отдельный SVG-файл с фиксированными цветами. Ей не нужны ни Vue, ни браузер, только Node. Сохраните этот скрипт как `beam-svg.ts` рядом с `beams.ts`:

```ts [beam-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { simpleBeam } from './beams.ts'

const svg = structureSvg(modelFromSolver(simpleBeam(6, 12)), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
})
writeFileSync('beam.svg', svg)
```

Запустите его командой `node beam-svg.ts` (Node 22.18 и новее; в более старых версиях — `npx tsx beam-svg.ts`). Параметры функции и то, как вставить файл в LaTeX и Word, описаны в разделе [Отдельный SVG-файл](/ru/plot/functions#a-standalone-svg-file).

## Эпюры одна под другой {#the-stacked-figure}

`DiagramStack` рисует картинку из любого учебника строительной механики: прямую балку с нагрузками, а под ней на общей оси x — эпюры V(x), M(x) и прогибы w(x). С `v-model:load-at` читатель может перетаскивать сосредоточенную силу вдоль балки и смотреть, как вслед за ней меняются эпюры:

```vue
<DiagramStack v-model:load-at="at" :solver="solveWithLoadAt(at)" />
```

Полный пример приведён на странице [DiagramStack](/ru/plot/diagram-stack).

## Регистрация во всём приложении {#use-it-everywhere}

Чтобы зарегистрировать оба компонента глобально, а не импортировать их там, где они нужны:

```ts [main.ts]
import { createApp } from 'vue'
import { EduBeamPlot } from '@edubeam/plot'
import App from './App.vue'

createApp(App).use(EduBeamPlot).mount('#app') // <StructurePlot> и <DiagramStack> в любом шаблоне
```

Именованные импорты делают сборку меньше: страница, которая импортирует только `StructurePlot`, не получает ни `DiagramStack`, ни плагина. Оба компонента отрисовываются и на сервере, в Nuxt или VitePress: см. [Встраивание](/ru/plot/embedding).

## Что дальше {#next}

::card-grid{cols="2"}
:::card{title="Упражнения и контрольные работы" icon="lucide:dices" to="/ru/plot/exercises"}
Для каждого студента своё упражнение по зерну генератора, с ответами, для печати или в виде файлов для LaTeX.
:::
:::card{title="Слайды и конспекты" icon="lucide:presentation" to="/ru/plot/slides"}
Рисунки, которые дополняются с каждым щелчком в Slidev, Vue или Beamer, и те же рисунки для конспектов.
:::
:::card{title="StructurePlot" icon="lucide:frame" to="/ru/plot/structure-plot"}
Слои, размерные линии, миниатюры, размеры рисунка, единицы и считывание значений под указателем.
:::
:::card{title="DiagramStack" icon="lucide:rows-3" to="/ru/plot/diagram-stack"}
Балка над эпюрами V, M и w с нагрузкой, которую читатель может перетаскивать.
:::
::
