---
title: Vkladanie do stránok
description: "Obrázky @edubeam/plot v aplikácii vo Vite, v skriptách vo VitePresse alebo na webe v Nuxte, vykreslenie na serveri, vopred vypočítané modely v JSON a čisté SVG."
order: 7
source: site
---

# Vkladanie do stránok

Komponenty sú obyčajné Vue 3, takže fungujú všade, kde funguje Vue, a vykreslia sa na serveri rovnako ako v prehliadači. Kým sa obrázok nepripojí (mount), na `window` nesiaha; každý obrázok navyše dostane vlastné id, takže ich na jednej stránke môže byť ľubovoľne veľa. Vyberte, čo máte:

| Máte | Postup |
| --- | --- |
| Aplikáciu vo Vue zostavenú vo Vite | Nainštalujte, importujte, hotovo: [Aplikácia vo Vite](#a-vite-app) |
| Skriptá v Markdowne | Raz zaregistrujte plugin vo VitePresse: [Skriptá vo VitePresse](#vitepress-course-notes) |
| Web v Nuxte | Importujte komponenty alebo pridajte plugin: [Nuxt](#nuxt) |
| Stránku, ktorá iba zobrazuje obrázky | Vypočítajte model pri builde a pošlite JSON: [Posielajte výkres, nie riešič](#ship-the-drawing-not-the-solver) |
| Vôbec žiadne Vue | Zapíšte SVG v Node: [Bez Vue](#plain-html-from-node) |

## Aplikácia vo Vite {#a-vite-app}

```bash
npm create vue@latest
npm install @edubeam/plot @edubeam/fem
```

Importujte komponenty tam, kde ich používate, ako na stránke [Začíname](/sk/plot/getting-started#draw-a-solved-model), alebo ich oba raz zaregistrujte pomocou `app.use(EduBeamPlot)`. Nič ďalšie sa nenastavuje: žiadny súbor so štýlmi ani plugin pre bundler.

## Skriptá vo VitePresse {#vitepress-course-notes}

[VitePress](https://vitepress.dev) zostavuje stránky z Markdownu pomocou Vue, a preto sa dobre hodí na skriptá k predmetu. Komponenty zaregistrujte v téme, v súbore `.vitepress/theme/index.ts`:

```ts [.vitepress/theme/index.ts]
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { EduBeamPlot } from '@edubeam/plot'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(EduBeamPlot) // <StructurePlot> a <DiagramStack> na každej stránke
  },
} satisfies Theme
```

Potom model zostavte a vykreslite priamo na stránke, vedľa súboru `frame.ts`:

```md [portal-frame.md]
<script setup lang="ts">
import { portalFrame } from './frame' // () => vypočítaný LinearStaticSolver

const frame = portalFrame()
</script>

# Portal frame

The bending moment under the design loads:

<StructurePlot :solver="frame" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

`vitepress build` rám vypočíta a hotové SVG zapíše aj s popismi do HTML stránky. V prehliadači potom stránku prevezme Vue a obrázok sa prispôsobí šírke stĺpca. Súbor `frame.ts` nájdete na stránke [Prezentácie a skriptá](/sk/plot/slides#a-figure-that-builds-up).

## Nuxt {#nuxt}

Aj Nuxt vykresľuje na serveri; tento web je postavený práve v ňom. Komponenty importujte na stránke alebo v komponente ako zvyčajne, alebo ich zaregistrujte pre celú aplikáciu pluginom v `plugins/edubeam-plot.ts`:

```ts [plugins/edubeam-plot.ts]
import { EduBeamPlot } from '@edubeam/plot'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(EduBeamPlot)
})
```

Na serveri nie je čo merať, takže sa obrázok rozloží podľa prop `width`: predvolene na 640 px (s `compact` na 400 px), pri `DiagramStack` na 720 px. Po pripojení sa rozloží znova podľa skutočnej šírky. Ak je váš stĺpec výrazne užší alebo širší, zadajte do `width` bližší odhad a obrázok pri načítaní stránky nezmení veľkosť.

## Posielajte výkres, nie riešič {#ship-the-drawing-not-the-solver}

Stránka, ktorá obrázok iba ukazuje, riešič nepotrebuje. `modelFromSolver` prevedie vypočítaný model na jednoduché dáta: uzly, prvky, zaťaženie, reakcie a pre každý prvok N, V, M a posunutia ako presné polynómy. Vytvorte ich pri builde, napríklad skriptom `build-figures.ts`:

```ts [build-figures.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

writeFileSync('portal-frame.json', JSON.stringify(modelFromSolver(portalFrame())))
```

a vykreslite ich cez prop `model`:

```vue
<script setup lang="ts">
import { StructurePlot, type PlotModel } from '@edubeam/plot'
import frame from './portal-frame.json'
</script>

<template>
  <StructurePlot :model="frame as PlotModel" />
</template>
```

Dvojkĺbový rám zaberie v JSON menej než 2 kB a vykreslí sa presne tak isto ako z riešiča. Všetko funguje s modelom rovnako ako s riešičom, a ak zadáte oboje, má prednosť `model`. Formát opisuje stránka [Model na vykreslenie](/sk/plot/model).

## Bez Vue {#plain-html-from-node}

`structureSvg` prevedie model na text súboru SVG s pevnými farbami, bez štýlov a skriptov. Vložte ho do akéhokoľvek HTML, do generátora statických stránok, do súboru Markdown alebo do CMS. Tento skript zapíše stránku s jedným obrázkom:

```ts [frame-html.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const svg = structureSvg(modelFromSolver(portalFrame()), { layers: ['members', 'supports', 'reactions', 'M'] })
writeFileSync('frame.html', `<!doctype html><meta charset="utf-8"><title>Portal frame</title>${svg}`)
```

Takýto obrázok má veľkosť, s ktorou bol zapísaný, predvolene šírku 640 px (s `max-width: 100%; height: auto` sa zmenší podľa stĺpca), a vlastné biele pozadie; `background: false` ho nechá priehľadné. Neriadi sa tmavým motívom a neodčítava hodnoty pod ukazovateľom: na to vykreslite komponent. [Skript na tlač písomiek](/sk/plot/exercises#print-a-test) takto tlačí celú písomku a všetky voľby uvádza časť [Samostatný súbor SVG](/sk/plot/functions#a-standalone-svg-file).
