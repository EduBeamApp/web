---
title: Побудова епюр
description: "Перетворіть розраховану модель @edubeam/fem на епюри за допомогою @edubeam/plot: у компоненті Vue, як файл SVG зі скрипту в Node або як JSON."
order: 11
source: site
---

# Побудова епюр {#drawing-the-results}

Графічна бібліотека [@edubeam/plot](/uk/plot) малює розраховану модель так, як виглядають рисунки на цьому сайті: стрижні, опори, навантаження, реакції, епюри N, V і M та деформовану схему, усе у форматі SVG. Передайте їй розв’язувач — усе потрібне вона прочитає сама.

```bash
npm install @edubeam/plot @edubeam/fem vue
```

## У компоненті Vue {#in-a-vue-component}

```vue [BeamFigure.vue]
<script setup lang="ts">
import { markRaw } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot } from '@edubeam/plot'

// Шарнірно оперта балка прольотом 6 m під 12 kN/m, в одиницях СІ: m, N, Pa
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // шарнірно-нерухома опора
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // шарнірно-рухома опора
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

// Лише читається, не відстежується: markRaw не дає Vue зробити розв’язувач реактивним
const beam = markRaw(solver)
</script>

<template>
  <StructurePlot
    :solver="beam"
    :layers="['members', 'supports', 'loads', 'reactions', 'M']"
  />
</template>
```

Компонент малює реакції 36 kN і момент 54 kNm, як на цьому живому рисунку:

::model-figure{caption="Що малює BeamFigure.vue"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
---
::

`StructurePlot` малює випадок навантаження 0; проп `loadCase` вибирає інший із `solver.loadCases`. Компонент не відстежує розв’язувач: коли ви зміните модель і розрахуєте її знову, змініть проп `revision`, щоб перемалювати рисунок. Усі параметри описано на сторінці [StructurePlot](/uk/plot/structure-plot).

## Без браузера {#without-a-browser}

Функція `structureSvg`, нова у @edubeam/plot 0.2, записує той самий рисунок як окремий файл SVG із простими кольорами, які розуміють Word, Inkscape та інструменти LaTeX. Без браузера, без компонента Vue, лише скрипт у Node:

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { modelFromSolver, structureSvg } from '@edubeam/plot'

// Та сама балка, що й у BeamFigure.vue
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

Файл показує те саме, що й живий рисунок вище, у кольорах для друку. `width` задає його розмір у пікселях, бо немає контейнера, розмір якого можна було б виміряти. Щоб отримати цілу сторінку рисунків для друку, вставте кілька таких файлів в одну сторінку HTML, як це робить [скрипт для друку контрольної](/uk/plot/exercises#print-a-test) з документації @edubeam/plot, без Vue і без браузера. Параметри `structureSvg` описано в розділі [Функції](/uk/plot/functions#a-standalone-svg-file).

## Передавайте рисунок, а не розв’язувач {#ship-the-drawing-not-the-solver}

`modelFromSolver` перетворює розраховану модель на прості дані, які можна серіалізувати в JSON: геометрію, навантаження, реакції та результати кожного стрижня у вигляді точних поліномів. Розрахуйте модель під час збирання, передавайте JSON і малюйте його за допомогою пропа `model` замість `solver`:

```ts
import { modelFromSolver } from '@edubeam/plot'

// ... розрахована балка з to-svg.ts
writeFileSync('beam.json', JSON.stringify(modelFromSolver(solver)))
```

Сторінка, що показує рисунок, тоді нічого не розраховує: роботу виконано один раз, під час збирання. Сторінка [Вбудовування](/uk/plot/embedding#ship-the-drawing-not-the-solver) показує бік компонента, а [Модель рисунка](/uk/plot/model) — формат даних.

Усе інше, від кольорів до значень під курсором і навантажень, які можна перетягувати, описано в [документації @edubeam/plot](/uk/plot/getting-started).
