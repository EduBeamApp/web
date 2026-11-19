---
title: Встраивание
description: "Рисунки @edubeam/plot в приложении на Vite, конспектах на VitePress и на сайте на Nuxt: отрисовка на сервере, заранее рассчитанные модели в JSON и SVG без Vue."
order: 7
source: site
---

# Встраивание

Компоненты написаны на обычном Vue 3, поэтому работают везде, где работает Vue, и отрисовываются как в браузере, так и на сервере. До монтирования рисунка ничто не обращается к `window`, а каждый рисунок получает собственные идентификаторы, так что на одной странице их может быть сколько угодно. Выберите свой вариант:

| Что у вас есть | Что сделать |
| --- | --- |
| Приложение на Vue, собранное Vite | Установить, импортировать — готово: [Приложение на Vite](#a-vite-app) |
| Конспект лекций в Markdown | Один раз зарегистрировать плагин в VitePress: [Конспект лекций на VitePress](#vitepress-course-notes) |
| Сайт на Nuxt | Импортировать компоненты или добавить плагин: [Nuxt](#nuxt) |
| Страница, которая только показывает рисунки | Рассчитать модель при сборке и передать JSON: [Передавайте рисунок](#ship-the-drawing-not-the-solver) |
| Vue не используется | Записать SVG в Node: [Без Vue](#plain-html-from-node) |

## Приложение на Vite {#a-vite-app}

```bash
npm create vue@latest
npm install @edubeam/plot @edubeam/fem
```

Импортируйте компоненты там, где они нужны, как в разделе [Начало работы](/ru/plot/getting-started#draw-a-solved-model), или один раз зарегистрируйте оба через `app.use(EduBeamPlot)`. Больше ничего настраивать не нужно: ни таблицы стилей, ни плагина для сборщика.

## Конспект лекций на VitePress {#vitepress-course-notes}

[VitePress](https://vitepress.dev) собирает страницы из Markdown с помощью Vue и поэтому хорошо подходит для конспектов лекций. Зарегистрируйте компоненты в теме, `.vitepress/theme/index.ts`:

```ts [.vitepress/theme/index.ts]
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { EduBeamPlot } from '@edubeam/plot'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(EduBeamPlot) // <StructurePlot> и <DiagramStack> на каждой странице
  },
} satisfies Theme
```

Затем постройте и нарисуйте модель прямо на странице, которая лежит рядом с `frame.ts`:

```md [portal-frame.md]
<script setup lang="ts">
import { portalFrame } from './frame' // () => рассчитанный LinearStaticSolver

const frame = portalFrame()
</script>

# Portal frame

The bending moment under the design loads:

<StructurePlot :solver="frame" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

`vitepress build` рассчитывает раму и записывает готовый SVG вместе со всеми подписями прямо в HTML страницы. В браузере страница становится интерактивной, и рисунок подстраивается под ширину колонки. `frame.ts` приведён на странице [Слайды и конспекты](/ru/plot/slides#a-figure-that-builds-up).

## Nuxt {#nuxt}

Nuxt тоже отрисовывает страницы на сервере; на нём построен и этот сайт. Импортируйте компоненты в странице или компоненте как обычно или зарегистрируйте их для всего приложения плагином в `plugins/edubeam-plot.ts`:

```ts [plugins/edubeam-plot.ts]
import { EduBeamPlot } from '@edubeam/plot'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(EduBeamPlot)
})
```

На сервере измерять нечего, поэтому рисунок компонуется по свойству `width`: по умолчанию 640 px (400 px с `compact`), у `DiagramStack` — 720 px. После монтирования он компонуется заново по реальной ширине. Если ваша колонка заметно уже или шире, задайте в `width` значение ближе к ней, и рисунок не будет менять размер при загрузке страницы.

## Передавайте рисунок, а не решатель {#ship-the-drawing-not-the-solver}

Странице, которая только показывает рисунок, решатель не нужен. `modelFromSolver` переводит рассчитанную модель в простые данные: узлы, стержни, нагрузки, реакции, а также N, V, M и перемещения каждого стержня в виде точных полиномов. Создайте их во время сборки скриптом, например `build-figures.ts`:

```ts [build-figures.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

writeFileSync('portal-frame.json', JSON.stringify(modelFromSolver(portalFrame())))
```

и нарисуйте через свойство `model`:

```vue
<script setup lang="ts">
import { StructurePlot, type PlotModel } from '@edubeam/plot'
import frame from './portal-frame.json'
</script>

<template>
  <StructurePlot :model="frame as PlotModel" />
</template>
```

П-образная рама занимает в JSON меньше 2 КБ и рисуется в точности так же, как по решателю. Все возможности работают с моделью так же, как с решателем, а если передать и то и другое, приоритет у `model`. Формат описан на странице [Модель рисунка](/ru/plot/model).

## Без Vue {#plain-html-from-node}

`structureSvg` превращает модель в текст SVG-файла с фиксированными цветами, без стилей и скриптов. Его можно вставить в любой HTML, в генератор статических сайтов, в файл Markdown или в CMS. Этот скрипт записывает страницу с одним рисунком:

```ts [frame-html.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const svg = structureSvg(modelFromSolver(portalFrame()), { layers: ['members', 'supports', 'reactions', 'M'] })
writeFileSync('frame.html', `<!doctype html><meta charset="utf-8"><title>Portal frame</title>${svg}`)
```

Такой рисунок имеет тот размер, с которым был записан, по умолчанию 640 px в ширину (`max-width: 100%; height: auto` позволяет ему сжиматься вместе с колонкой), и собственный белый фон; `background: false` делает фон прозрачным. Он не следует тёмной теме и не считывает значения под указателем: для этого нужен компонент. [Скрипт для печати контрольных](/ru/plot/exercises#print-a-test) так печатает целую контрольную, а параметры перечислены в разделе [Отдельный SVG-файл](/ru/plot/functions#a-standalone-svg-file).
