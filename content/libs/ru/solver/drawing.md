---
title: Отрисовка результатов
description: "Эпюры рассчитанной модели @edubeam/fem с помощью @edubeam/plot: в компоненте Vue, отдельным SVG-файлом из скрипта Node или в виде JSON для отрисовки позже."
order: 11
source: site
---

# Отрисовка результатов {#drawing-the-results}

[@edubeam/plot](/ru/plot) рисует рассчитанную модель так, как выглядят рисунки на этом сайте: стержни, опоры, нагрузки, реакции, эпюры N, V и M и деформированную схему, в формате SVG. Передайте ей решатель — всё нужное она прочитает сама.

```bash
npm install @edubeam/plot @edubeam/fem vue
```

## В компоненте Vue {#in-a-vue-component}

```vue [BeamFigure.vue]
<script setup lang="ts">
import { markRaw } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot } from '@edubeam/plot'

// Шарнирно опёртая балка пролётом 6 m под нагрузкой 12 kN/m, в единицах СИ: m, N, Pa
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // шарнирно-неподвижная
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // шарнирно-подвижная
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

// Решатель только читается, изменения в нём не отслеживаются: markRaw не даёт Vue сделать его реактивным
const beam = markRaw(solver)
</script>

<template>
  <StructurePlot
    :solver="beam"
    :layers="['members', 'supports', 'loads', 'reactions', 'M']"
  />
</template>
```

Компонент рисует реакции 36 кН и момент 54 кН·м, как на этом интерактивном рисунке:

::model-figure{caption="Что рисует BeamFigure.vue"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
---
::

`StructurePlot` рисует случай нагружения 0; свойство `loadCase` выбирает другой случай из `solver.loadCases`. Компонент не следит за решателем: после того как вы изменили модель и снова выполнили расчёт, измените свойство `revision`, чтобы рисунок перерисовался. Все параметры описаны на странице [StructurePlot](/ru/plot/structure-plot).

## Без браузера {#without-a-browser}

Функция `structureSvg`, появившаяся в @edubeam/plot 0.2, записывает тот же рисунок как самостоятельный SVG-файл с простыми цветами, которые понимают Word, Inkscape и инструменты LaTeX. Ни браузера, ни компонента Vue — только скрипт Node:

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { modelFromSolver, structureSvg } from '@edubeam/plot'

// Та же балка, что в BeamFigure.vue
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

const svg = structureSvg(modelFromSolver(solver), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
  width: 640,
})
writeFileSync('beam.svg', svg)
```

Файл показывает то же, что интерактивный рисунок выше, но в цветах для печати. `width` задаёт его размер в пикселях, поскольку измерить контейнер здесь нельзя. Чтобы получить целую страницу рисунков для печати, соберите несколько таких файлов в одну HTML-страницу, как это делает [скрипт для печати контрольных](/ru/plot/exercises#print-a-test) из документации @edubeam/plot, без Vue и без браузера. Параметры `structureSvg` описаны на странице [Функции](/ru/plot/functions#a-standalone-svg-file).

## Передавайте рисунок, а не решатель {#ship-the-drawing-not-the-solver}

`modelFromSolver` превращает рассчитанную модель в простые данные, которые сериализуются в JSON: геометрию, нагрузки, реакции и результаты каждого стержня в виде точных многочленов. Выполните расчёт при сборке (build), передайте на страницу JSON и рисуйте его через свойство `model` вместо `solver`:

```ts
import { modelFromSolver } from '@edubeam/plot'

// ... рассчитанная балка из to-svg.ts
writeFileSync('beam.json', JSON.stringify(modelFromSolver(solver)))
```

Странице, которая показывает рисунок, тогда ничего не нужно рассчитывать: работа выполняется один раз, при сборке. Сторона компонента показана на странице [Встраивание](/ru/plot/embedding#ship-the-drawing-not-the-solver), а формат данных — на странице [Модель рисунка](/ru/plot/model).

Всё остальное, от цветов до всплывающих значений и перетаскиваемых нагрузок, описано в [документации @edubeam/plot](/ru/plot/getting-started).
