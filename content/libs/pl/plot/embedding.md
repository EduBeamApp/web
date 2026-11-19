---
title: Osadzanie
description: "Rysunki @edubeam/plot w aplikacji Vite, w materiałach w VitePressie lub na stronie w Nuxcie, renderowanie na serwerze, gotowe modele w JSON i czysty SVG bez Vue."
order: 7
source: site
---

# Osadzanie

Komponenty to zwykłe Vue 3, więc działają wszędzie tam, gdzie działa Vue, i renderują się zarówno na serwerze, jak i w przeglądarce. Nic nie odwołuje się do `window`, zanim rysunek zostanie zamontowany, a każdy rysunek dostaje własne identyfikatory, więc na jednej stronie może być ich dowolnie wiele. Wybierz swoją sytuację:

| Masz | Zrób tak |
| --- | --- |
| Aplikację Vue budowaną przez Vite | Zainstaluj, zaimportuj, gotowe: [Aplikacja Vite](#a-vite-app) |
| Materiały do wykładu w Markdownie | Zarejestruj plugin raz w VitePressie: [Materiały do wykładu w VitePressie](#vitepress-course-notes) |
| Stronę w Nuxcie | Zaimportuj komponenty albo dodaj plugin: [Nuxt](#nuxt) |
| Stronę, która tylko pokazuje rysunki | Oblicz w czasie budowania i dołącz JSON: [Dostarcz rysunek](#ship-the-drawing-not-the-solver) |
| Żadnego Vue | Zapisz SVG w Node: [Bez Vue](#plain-html-from-node) |

## Aplikacja Vite {#a-vite-app}

```bash
npm create vue@latest
npm install @edubeam/plot @edubeam/fem
```

Zaimportuj komponenty tam, gdzie ich używasz, jak w [Pierwszych krokach](/pl/plot/getting-started#draw-a-solved-model), albo zarejestruj oba raz przez `app.use(EduBeamPlot)`. Nie trzeba niczego więcej konfigurować: żadnego arkusza stylów ani pluginu bundlera.

## Materiały do wykładu w VitePressie {#vitepress-course-notes}

[VitePress](https://vitepress.dev) buduje strony z Markdownu za pomocą Vue, więc dobrze nadaje się na materiały do wykładu. Zarejestruj komponenty w motywie, `.vitepress/theme/index.ts`:

```ts [.vitepress/theme/index.ts]
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { EduBeamPlot } from '@edubeam/plot'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(EduBeamPlot) // <StructurePlot> i <DiagramStack> na każdej stronie
  },
} satisfies Theme
```

Następnie zbuduj i narysuj model bezpośrednio na stronie, obok `frame.ts`:

```md [portal-frame.md]
<script setup lang="ts">
import { portalFrame } from './frame' // () => obliczony LinearStaticSolver

const frame = portalFrame()
</script>

# Portal frame

The bending moment under the design loads:

<StructurePlot :solver="frame" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

`vitepress build` oblicza ramę i zapisuje gotowy SVG w HTML-u strony, razem z etykietami. W przeglądarce strona przejmuje kontrolę, a rysunek dopasowuje się do szerokości kolumny. Plik `frame.ts` jest na stronie [Slajdy i materiały do wykładu](/pl/plot/slides#a-figure-that-builds-up).

## Nuxt {#nuxt}

Nuxt także renderuje na serwerze; ta witryna jest w nim zbudowana. Zaimportuj komponenty na stronie lub w komponencie jak zwykle albo zarejestruj je dla całej aplikacji pluginem w `plugins/edubeam-plot.ts`:

```ts [plugins/edubeam-plot.ts]
import { EduBeamPlot } from '@edubeam/plot'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(EduBeamPlot)
})
```

Na serwerze nie ma kontenera do zmierzenia, więc rysunek jest rozmieszczany dla szerokości z propa `width`: domyślnie 640 px (400 px z `compact`), 720 px dla `DiagramStack`. Po zamontowaniu ponownie dopasowuje układ do rzeczywistej szerokości. Jeśli Twoja kolumna jest znacznie węższa lub szersza, podaj w `width` wartość bliższą rzeczywistej, a rysunek nie zmieni rozmiaru podczas wczytywania strony.

## Dostarcz rysunek, nie solver {#ship-the-drawing-not-the-solver}

Strona, która tylko pokazuje rysunek, nie potrzebuje solvera. `modelFromSolver` przepisuje obliczony model do zwykłych danych: węzłów, prętów, obciążeń, reakcji oraz sił N, V, M i przemieszczeń każdego pręta w postaci dokładnych wielomianów. Utwórz go w czasie budowania, skryptem takim jak `build-figures.ts`:

```ts [build-figures.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

writeFileSync('portal-frame.json', JSON.stringify(modelFromSolver(portalFrame())))
```

i narysuj go propem `model`:

```vue
<script setup lang="ts">
import { StructurePlot, type PlotModel } from '@edubeam/plot'
import frame from './portal-frame.json'
</script>

<template>
  <StructurePlot :model="frame as PlotModel" />
</template>
```

Rama portalowa zajmuje poniżej 2 kB w JSON i rysuje się dokładnie tak jak z solvera. Wszystkie możliwości działają z modelem tak samo jak z solverem, a jeśli podasz oba, pierwszeństwo ma `model`. Format opisuje strona [Model rysunku](/pl/plot/model).

## Bez Vue {#plain-html-from-node}

`structureSvg` zamienia model w tekst pliku SVG, ze zwykłymi kolorami, bez stylów i skryptów. Wklej go do dowolnego HTML-a, generatora stron statycznych, pliku Markdown lub systemu CMS. Ten skrypt zapisuje stronę z jednym rysunkiem:

```ts [frame-html.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const svg = structureSvg(modelFromSolver(portalFrame()), { layers: ['members', 'supports', 'reactions', 'M'] })
writeFileSync('frame.html', `<!doctype html><meta charset="utf-8"><title>Portal frame</title>${svg}`)
```

Taki rysunek ma rozmiar, z jakim został zapisany, domyślnie 640 px szerokości (`max-width: 100%; height: auto` pozwala mu zmniejszać się razem z kolumną), i własne białe tło; `background: false` zostawia je przezroczyste. Nie dostosowuje się do ciemnego motywu i nie odczytuje wartości pod kursorem: do tego wyrenderuj komponent. [Skrypt drukujący kolokwia](/pl/plot/exercises#print-a-test) drukuje w ten sposób całe kolokwium, a wszystkie opcje opisuje sekcja [Samodzielny plik SVG](/pl/plot/functions#a-standalone-svg-file).
