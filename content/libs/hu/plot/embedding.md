---
title: Beágyazás
description: "@edubeam/plot rajzok Vite-alkalmazásban, VitePress-jegyzetekben vagy Nuxt-webhelyen, renderelés a szerveren, előre kiszámított modellek JSON-ban és egyszerű SVG-fájlok."
order: 7
source: site
---

# Beágyazás

A komponensek egyszerű Vue 3-komponensek, így mindenhol működnek, ahol a Vue, és a böngésző mellett a szerveren is renderelhetők. Semmi sem nyúl a `window` objektumhoz, mielőtt a rajz csatolódik (mount), és minden rajz saját azonosítókat kap, így egy oldalon akárhány lehet belőlük. Válaszd ki, mivel dolgozol:

| Ami van | Ezt csináld |
| --- | --- |
| Vite-tal buildelt Vue-alkalmazás | Telepítés, importálás, kész: [Vite-alkalmazás](#a-vite-app) |
| Markdownban írt jegyzetek | Regisztráld egyszer a plugint a VitePressben: [Jegyzetek VitePressben](#vitepress-course-notes) |
| Nuxt-webhely | Importáld a komponenseket, vagy adj hozzá egy plugint: [Nuxt](#nuxt) |
| Oldal, amely csak rajzokat mutat | Számíts a build idején, és szállíts JSON-t: [A rajzot szállítsd](#ship-the-drawing-not-the-solver) |
| Egyáltalán nincs Vue | Írd ki az SVG-t Node-ban: [Vue nélkül](#plain-html-from-node) |

## Vite-alkalmazás {#a-vite-app}

```bash
npm create vue@latest
npm install @edubeam/plot @edubeam/fem
```

Importáld a komponenseket ott, ahol használod őket, ahogy az [Első lépések](/hu/plot/getting-started#draw-a-solved-model) oldalon, vagy regisztráld mindkettőt egyszer az `app.use(EduBeamPlot)` hívással. Mást nem kell beállítani: se stíluslap, se bundler-plugin nem kell.

## Jegyzetek VitePressben {#vitepress-course-notes}

A [VitePress](https://vitepress.dev) Vue segítségével készít oldalakat Markdownból, így jó otthona lehet az óravázlatoknak és jegyzeteknek. Regisztráld a komponenseket a témában, a `.vitepress/theme/index.ts` fájlban:

```ts [.vitepress/theme/index.ts]
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { EduBeamPlot } from '@edubeam/plot'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(EduBeamPlot) // <StructurePlot> és <DiagramStack> minden oldalon
  },
} satisfies Theme
```

Ezután építs fel és rajzolj meg egy modellt közvetlenül az oldalon, a `frame.ts` mellett:

```md [portal-frame.md]
<script setup lang="ts">
import { portalFrame } from './frame' // () => egy kiszámított LinearStaticSolver

const frame = portalFrame()
</script>

# Portal frame

The bending moment under the design loads:

<StructurePlot :solver="frame" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

A `vitepress build` kiszámítja a keretet, és a kész SVG-t feliratokkal együtt beírja az oldal HTML-jébe. A böngészőben a Vue átveszi az oldalt, és a rajz az oszlop szélességéhez igazodik. A `frame.ts` a [Diák és jegyzetek](/hu/plot/slides#a-figure-that-builds-up) oldalon található.

## Nuxt {#nuxt}

A Nuxt szintén renderel a szerveren; ez a webhely is azzal készült. Importáld a komponenseket egy oldalon vagy komponensben a szokásos módon, vagy regisztráld őket az egész alkalmazásra egy pluginnal a `plugins/edubeam-plot.ts` fájlban:

```ts [plugins/edubeam-plot.ts]
import { EduBeamPlot } from '@edubeam/plot'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(EduBeamPlot)
})
```

A szerveren nincs megmérhető tároló, ezért a rajz elrendezése a `width` prop szerinti szélességre készül: alapértelmezés szerint 640 px-re (`compact` esetén 400 px-re), a `DiagramStack` esetén 720 px-re. Csatolás után a rajz a valódi szélességre rendeződik újra. Ha az oszlopod jóval keskenyebb vagy szélesebb, adj meg a `width` propban egy közelebbi becslést, és a rajz nem fog méretet váltani az oldal betöltése közben.

## A rajzot szállítsd, ne a számítómagot {#ship-the-drawing-not-the-solver}

Egy oldalnak, amely csak egy rajzot mutat, nincs szüksége számítómagra. A `modelFromSolver` egy kiszámított modellt egyszerű adatokká alakít: csomópontokká, rudakká, terhekké, támaszerőkké, valamint minden rúd N, V, M igénybevételévé és elmozdulásaivá, pontos polinomok formájában. Készítsd el a build idején, például egy `build-figures.ts` szkripttel:

```ts [build-figures.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

writeFileSync('portal-frame.json', JSON.stringify(modelFromSolver(portalFrame())))
```

és rajzold meg a `model` proppal:

```vue
<script setup lang="ts">
import { StructurePlot, type PlotModel } from '@edubeam/plot'
import frame from './portal-frame.json'
</script>

<template>
  <StructurePlot :model="frame as PlotModel" />
</template>
```

A keret JSON-ban 2 kB alatt van, és pontosan úgy rajzolódik ki, mint a számítómagból. Minden funkció ugyanúgy működik modellel, mint számítómaggal, és ha mindkettőt megadod, a `model` élvez elsőbbséget. A formátumot az [A rajz modellje](/hu/plot/model) oldal írja le.

## Vue nélkül {#plain-html-from-node}

A `structureSvg` egy modellt SVG-fájl szövegévé alakít, egyszerű színekkel, stílusok és szkriptek nélkül. Beillesztheted bármilyen HTML-be, statikusoldal-generátorba, Markdown-fájlba vagy CMS-be. Ez a szkript egy olyan oldalt ír ki, amelyen egyetlen rajz van:

```ts [frame-html.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const svg = structureSvg(modelFromSolver(portalFrame()), { layers: ['members', 'supports', 'reactions', 'M'] })
writeFileSync('frame.html', `<!doctype html><meta charset="utf-8"><title>Portal frame</title>${svg}`)
```

Egy ilyen rajz akkora, amekkorára kiírták, alapértelmezés szerint 640 px széles (a `max-width: 100%; height: auto` lehetővé teszi, hogy az oszloppal együtt zsugorodjon), és saját fehér háttere van; a `background: false` átlátszóan hagyja. Nem követi a sötét témát, és nem olvas le értékeket a mutató alatt: ehhez a komponenst rendereld. A [dolgozatgenerátor](/hu/plot/exercises#print-a-test) így nyomtat ki egy teljes dolgozatot, a beállításokat pedig az [Önálló SVG-fájl](/hu/plot/functions#a-standalone-svg-file) szakasz sorolja fel.
