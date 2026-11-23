---
title: Integrare
description: "Figuri @edubeam/plot într-o aplicație Vite, în note de curs VitePress sau pe un site Nuxt, randare pe server, modele calculate dinainte în JSON și fișiere SVG simple."
order: 7
source: site
---

# Integrare

Componentele sunt componente Vue 3 obișnuite, așa că funcționează oriunde funcționează Vue și se randează atât pe server, cât și în browser. Nimic nu accesează `window` înainte ca desenul să fie montat, iar fiecare desen primește propriile identificatoare, deci pe o pagină pot sta oricâte. Alege cazul tău:

| Ai | Fă așa |
| --- | --- |
| O aplicație Vue construită cu Vite | Instalează, importă, gata: [O aplicație Vite](#a-vite-app) |
| Note de curs în Markdown | Înregistrează pluginul o singură dată în VitePress: [Note de curs în VitePress](#vitepress-course-notes) |
| Un site Nuxt | Importă componentele sau adaugă un plugin: [Nuxt](#nuxt) |
| O pagină care doar afișează figuri | Calculează la build și livrează JSON: [Livrează desenul](#ship-the-drawing-not-the-solver) |
| Deloc Vue | Scrie fișierul SVG în Node: [Fără Vue](#plain-html-from-node) |

## O aplicație Vite {#a-vite-app}

```bash
npm create vue@latest
npm install @edubeam/plot @edubeam/fem
```

Importă componentele acolo unde le folosești, ca în [Primii pași](/ro/plot/getting-started#draw-a-solved-model), sau înregistrează-le pe amândouă o singură dată cu `app.use(EduBeamPlot)`. Nu mai e nimic de configurat: nicio foaie de stiluri și niciun plugin de bundler.

## Note de curs în VitePress {#vitepress-course-notes}

[VitePress](https://vitepress.dev) construiește pagini din Markdown cu Vue, deci se potrivește bine pentru note de curs. Înregistrează componentele în temă, `.vitepress/theme/index.ts`:

```ts [.vitepress/theme/index.ts]
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { EduBeamPlot } from '@edubeam/plot'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(EduBeamPlot) // <StructurePlot> și <DiagramStack> în fiecare pagină
  },
} satisfies Theme
```

Apoi construiește și desenează un model direct într-o pagină, lângă `frame.ts`:

```md [portal-frame.md]
<script setup lang="ts">
import { portalFrame } from './frame' // () => un LinearStaticSolver calculat

const frame = portalFrame()
</script>

# Portal frame

The bending moment under the design loads:

<StructurePlot :solver="frame" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

`vitepress build` calculează cadrul și scrie SVG-ul final în HTML-ul paginii, cu tot cu etichete. În browser pagina preia controlul, iar desenul se adaptează la lățimea coloanei. `frame.ts` se află pe pagina [Slide-uri și note de curs](/ro/plot/slides#a-figure-that-builds-up).

## Nuxt {#nuxt}

Și Nuxt randează pe server; acest site este construit cu el. Importă componentele într-o pagină sau într-o componentă, ca de obicei, sau înregistrează-le pentru toată aplicația cu un plugin în `plugins/edubeam-plot.ts`:

```ts [plugins/edubeam-plot.ts]
import { EduBeamPlot } from '@edubeam/plot'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(EduBeamPlot)
})
```

Pe server nu există un container de măsurat, așa că desenul este așezat la lățimea dată de prop-ul `width`: implicit 640 px (400 px cu `compact`), 720 px pentru `DiagramStack`. După montare se așază din nou la lățimea reală. Dacă coloana ta e mult mai îngustă sau mai lată, dă-i lui `width` o valoare apropiată de ea, ca figura să nu-și schimbe dimensiunea în timp ce pagina se încarcă.

## Livrează desenul, nu solverul {#ship-the-drawing-not-the-solver}

O pagină care doar afișează o figură nu are nevoie de program de calcul. `modelFromSolver` transformă un model calculat în date simple: noduri, bare, încărcări, reacțiuni și, pentru fiecare bară, N, V, M și deplasările ca polinoame exacte. Creează-le la build, cu un script precum `build-figures.ts`:

```ts [build-figures.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

writeFileSync('portal-frame.json', JSON.stringify(modelFromSolver(portalFrame())))
```

și desenează-le cu prop-ul `model`:

```vue
<script setup lang="ts">
import { StructurePlot, type PlotModel } from '@edubeam/plot'
import frame from './portal-frame.json'
</script>

<template>
  <StructurePlot :model="frame as PlotModel" />
</template>
```

Cadrul portal ocupă sub 2 kB de JSON și se desenează exact ca din `solver`. Toate funcționalitățile merg cu un model la fel ca cu un `solver`, iar dacă le dai pe amândouă, are prioritate `model`. Formatul este descris în [Modelul desenului](/ro/plot/model).

## Fără Vue {#plain-html-from-node}

`structureSvg` transformă un model în textul unui fișier SVG, cu culori simple, fără stiluri și fără scripturi. Lipește-l în orice HTML, într-un generator de site-uri statice, într-un fișier Markdown sau într-un CMS. Scriptul acesta scrie o pagină cu o singură figură:

```ts [frame-html.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const svg = structureSvg(modelFromSolver(portalFrame()), { layers: ['members', 'supports', 'reactions', 'M'] })
writeFileSync('frame.html', `<!doctype html><meta charset="utf-8"><title>Portal frame</title>${svg}`)
```

O astfel de figură are dimensiunea cu care a fost scrisă, implicit 640 px lățime (`max-width: 100%; height: auto` o lasă să se micșoreze odată cu coloana), și un fundal alb propriu; `background: false` îl lasă transparent. Nu urmează o temă întunecată și nu citește valori de sub cursor: pentru asta, randează componenta. [Generatorul de teste](/ro/plot/exercises#print-a-test) tipărește astfel un test întreg, iar opțiunile sunt descrise în [Un fișier SVG de sine stătător](/ro/plot/functions#a-standalone-svg-file).
