---
title: Vkládání do stránek
description: "Obrázky @edubeam/plot v aplikaci Vite, ve skriptech ve VitePressu nebo na webu v Nuxtu, vykreslení na serveru, předem spočtené modely v JSONu a čisté SVG bez Vue."
order: 7
---

# Vkládání do stránek

Komponenty jsou obyčejné Vue 3, takže fungují všude, kde funguje Vue, a vykreslí se na serveru stejně jako v prohlížeči. Dokud se obrázek nepřipojí (mount), na `window` nesahá, a každý obrázek dostane vlastní id, takže jich na jedné stránce může být libovolně mnoho. Vyberte, co máte:

| Máte | Postup |
| --- | --- |
| Aplikaci ve Vue sestavenou ve Vite | Nainstalujte, importujte, hotovo: [Aplikace ve Vite](#a-vite-app) |
| Skripta v Markdownu | Jednou zaregistrujte plugin ve VitePressu: [Skripta ve VitePressu](#vitepress-course-notes) |
| Web v Nuxtu | Importujte komponenty, nebo přidejte plugin: [Nuxt](#nuxt) |
| Stránku, která jen zobrazuje obrázky | Spočtěte model při buildu a pošlete JSON: [Posílejte výkres, ne řešič](#ship-the-drawing-not-the-solver) |
| Vůbec žádné Vue | Zapište SVG v Node: [Bez Vue](#plain-html-from-node) |

## Aplikace ve Vite {#a-vite-app}

```bash
npm create vue@latest
npm install @edubeam/plot @edubeam/fem
```

Importujte komponenty tam, kde je používáte, jako na stránce [Začínáme](/cs/plot/getting-started#draw-a-solved-model), nebo je obě jednou zaregistrujte pomocí `app.use(EduBeamPlot)`. Nic dalšího se nenastavuje: žádný soubor se styly ani plugin pro bundler.

## Skripta ve VitePressu {#vitepress-course-notes}

[VitePress](https://vitepress.dev) sestavuje stránky z Markdownu pomocí Vue, a proto se dobře hodí pro skripta k předmětu. Komponenty zaregistrujte v motivu, v souboru `.vitepress/theme/index.ts`:

```ts [.vitepress/theme/index.ts]
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { EduBeamPlot } from '@edubeam/plot'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(EduBeamPlot) // <StructurePlot> a <DiagramStack> na každé stránce
  },
} satisfies Theme
```

Pak model sestavte a vykreslete přímo na stránce, vedle souboru `frame.ts`:

```md [portal-frame.md]
<script setup lang="ts">
import { portalFrame } from './frame' // () => spočtený LinearStaticSolver

const frame = portalFrame()
</script>

# Portal frame

The bending moment under the design loads:

<StructurePlot :solver="frame" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

`vitepress build` rám spočte a hotové SVG zapíše i s popisky do HTML stránky. V prohlížeči pak stránku převezme Vue a obrázek se přizpůsobí šířce sloupce. Soubor `frame.ts` najdete na stránce [Prezentace a skripta](/cs/plot/slides#a-figure-that-builds-up).

## Nuxt {#nuxt}

I Nuxt vykresluje na serveru; tento web je postavený právě v něm. Komponenty importujte na stránce nebo v komponentě jako obvykle, nebo je zaregistrujte pro celou aplikaci pluginem v `plugins/edubeam-plot.ts`:

```ts [plugins/edubeam-plot.ts]
import { EduBeamPlot } from '@edubeam/plot'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(EduBeamPlot)
})
```

Na serveru není co změřit, takže se obrázek rozvrhne podle prop `width`: ve výchozím nastavení na 640 px (s `compact` na 400 px), u `DiagramStack` na 720 px. Po připojení se rozvrhne znovu podle skutečné šířky. Je-li váš sloupec výrazně užší nebo širší, zadejte do `width` bližší odhad a obrázek při načítání stránky nezmění velikost.

## Posílejte výkres, ne řešič {#ship-the-drawing-not-the-solver}

Stránka, která obrázek jen ukazuje, řešič nepotřebuje. `modelFromSolver` převede spočtený model na prostá data: uzly, prvky, zatížení, reakce a pro každý prvek N, V, M a posunutí jako přesné polynomy. Vytvořte je při buildu, třeba skriptem `build-figures.ts`:

```ts [build-figures.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

writeFileSync('portal-frame.json', JSON.stringify(modelFromSolver(portalFrame())))
```

a vykreslete je přes prop `model`:

```vue
<script setup lang="ts">
import { StructurePlot, type PlotModel } from '@edubeam/plot'
import frame from './portal-frame.json'
</script>

<template>
  <StructurePlot :model="frame as PlotModel" />
</template>
```

Dvoukloubový rám zabere v JSONu méně než 2 kB a vykreslí se přesně stejně jako z řešiče. Všechno funguje s modelem stejně jako s řešičem, a pokud zadáte obojí, má přednost `model`. Formát popisuje stránka [Model pro vykreslení](/cs/plot/model).

## Bez Vue {#plain-html-from-node}

`structureSvg` převede model na text souboru SVG s pevnými barvami, bez stylů a skriptů. Vložte ho do jakéhokoli HTML, do generátoru statických stránek, do souboru Markdown nebo do CMS. Tento skript zapíše stránku s jedním obrázkem:

```ts [frame-html.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const svg = structureSvg(modelFromSolver(portalFrame()), { layers: ['members', 'supports', 'reactions', 'M'] })
writeFileSync('frame.html', `<!doctype html><meta charset="utf-8"><title>Portal frame</title>${svg}`)
```

Takový obrázek má velikost, se kterou byl zapsán, ve výchozím nastavení šířku 640 px (s `max-width: 100%; height: auto` se zmenší podle sloupce), a vlastní bílé pozadí; `background: false` ho nechá průhledné. Neřídí se tmavým motivem a neodečítá hodnoty pod ukazatelem: k tomu vykreslete komponentu. [Skript pro tisk písemek](/cs/plot/exercises#print-a-test) takto tiskne celou písemku a všechny volby uvádí část [Samostatný soubor SVG](/cs/plot/functions#a-standalone-svg-file).
