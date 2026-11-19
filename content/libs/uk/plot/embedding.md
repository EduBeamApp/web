---
title: Вбудовування
description: "Рисунки @edubeam/plot у Vite, VitePress чи Nuxt, рендеринг на сервері, заздалегідь розраховані моделі в JSON і звичайний SVG для сторінок без Vue."
order: 7
source: site
---

# Вбудовування

Компоненти — це звичайний Vue 3, тож вони працюють усюди, де працює Vue, і рендеряться як у браузері, так і на сервері. Ніщо не звертається до `window`, доки рисунок не змонтовано, а кожен рисунок отримує власні ідентифікатори, тож на одній сторінці їх може бути скільки завгодно. Виберіть свій варіант:

| Що у вас є | Що зробити |
| --- | --- |
| Застосунок на Vue, зібраний Vite | Встановити, імпортувати, готово: [Застосунок на Vite](#a-vite-app) |
| Конспект лекцій у Markdown | Один раз зареєструвати плагін у VitePress: [Конспект на VitePress](#vitepress-course-notes) |
| Сайт на Nuxt | Імпортувати компоненти або додати плагін: [Nuxt](#nuxt) |
| Сторінка, яка лише показує рисунки | Розрахувати модель під час збирання й передати JSON: [Передавайте рисунок, а не розв’язувач](#ship-the-drawing-not-the-solver) |
| Vue немає зовсім | Записати SVG у Node: [Без Vue](#plain-html-from-node) |

## Застосунок на Vite {#a-vite-app}

```bash
npm create vue@latest
npm install @edubeam/plot @edubeam/fem
```

Імпортуйте компоненти там, де вони потрібні, як у розділі [Початок роботи](/uk/plot/getting-started#draw-a-solved-model), або зареєструйте обидва один раз через `app.use(EduBeamPlot)`. Більше нічого налаштовувати не треба: ні файлу стилів, ні плагіна для бандлера.

## Конспект на VitePress {#vitepress-course-notes}

[VitePress](https://vitepress.dev) збирає сторінки з Markdown за допомогою Vue, тож добре підходить для конспектів лекцій. Зареєструйте компоненти в темі, `.vitepress/theme/index.ts`:

```ts [.vitepress/theme/index.ts]
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { EduBeamPlot } from '@edubeam/plot'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(EduBeamPlot) // <StructurePlot> і <DiagramStack> на кожній сторінці
  },
} satisfies Theme
```

Потім створіть і намалюйте модель просто на сторінці, поруч із `frame.ts`:

```md [portal-frame.md]
<script setup lang="ts">
import { portalFrame } from './frame' // () => розрахований LinearStaticSolver

const frame = portalFrame()
</script>

# Portal frame

The bending moment under the design loads:

<StructurePlot :solver="frame" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

`vitepress build` розраховує раму й записує готовий SVG разом з усіма підписами в HTML сторінки. У браузері сторінка проходить гідратацію, і рисунок підлаштовується під ширину стовпця. `frame.ts` наведено на сторінці [Слайди та конспекти](/uk/plot/slides#a-figure-that-builds-up).

## Nuxt {#nuxt}

Nuxt теж рендерить на сервері; цей сайт побудовано на ньому. Імпортуйте компоненти на сторінці чи в компоненті, як зазвичай, або зареєструйте їх для всього застосунку плагіном у `plugins/edubeam-plot.ts`:

```ts [plugins/edubeam-plot.ts]
import { EduBeamPlot } from '@edubeam/plot'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(EduBeamPlot)
})
```

На сервері немає контейнера, який можна виміряти, тож рисунок компонується за пропом `width`: типово 640 px (400 px з `compact`), для `DiagramStack` — 720 px. Після монтування він компонується знову, уже за справжньою шириною. Якщо ваш стовпець значно вужчий або ширший, задайте `width` ближче до реальної ширини, і рисунок не змінюватиме розмір під час завантаження сторінки.

## Передавайте рисунок, а не розв’язувач {#ship-the-drawing-not-the-solver}

Сторінці, яка лише показує рисунок, розв’язувач не потрібен. `modelFromSolver` перетворює розраховану модель на звичайні дані: вузли, стрижні, навантаження, реакції та N, V, M і переміщення кожного стрижня у вигляді точних поліномів. Створіть ці дані під час збирання, скриптом на зразок `build-figures.ts`:

```ts [build-figures.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

writeFileSync('portal-frame.json', JSON.stringify(modelFromSolver(portalFrame())))
```

і намалюйте їх за допомогою пропа `model`:

```vue
<script setup lang="ts">
import { StructurePlot, type PlotModel } from '@edubeam/plot'
import frame from './portal-frame.json'
</script>

<template>
  <StructurePlot :model="frame as PlotModel" />
</template>
```

П-подібна рама займає менше ніж 2 kB JSON і малюється точно так само, як із розв’язувача. Усі можливості працюють із моделлю так само, як із розв’язувачем, а якщо задано обидва, перевагу має `model`. Формат описано на сторінці [Модель рисунка](/uk/plot/model).

## Без Vue {#plain-html-from-node}

`structureSvg` перетворює модель на текст файлу SVG зі звичайними кольорами, без стилів і скриптів. Вставте його в будь-який HTML, генератор статичних сайтів, файл Markdown чи CMS. Цей скрипт записує сторінку з одним рисунком:

```ts [frame-html.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const svg = structureSvg(modelFromSolver(portalFrame()), { layers: ['members', 'supports', 'reactions', 'M'] })
writeFileSync('frame.html', `<!doctype html><meta charset="utf-8"><title>Portal frame</title>${svg}`)
```

Такий рисунок має розмір, з яким його записано, типово 640 px завширшки (`max-width: 100%; height: auto` дає йому змогу зменшуватися разом зі стовпцем), і власне біле тло; `background: false` залишає його прозорим. Він не підлаштовується під темну тему й не показує значення під курсором: для цього використовуйте компонент. [Скрипт для друку контрольної](/uk/plot/exercises#print-a-test) так друкує цілу контрольну, а параметри наведено в розділі [Окремий файл SVG](/uk/plot/functions#a-standalone-svg-file).
