---
title: Slajdy i materiały
description: "Rysunki do wykładu z @edubeam/plot: etapami w Slidevie, Vue lub Beamerze, obliczane na żywo i jako SVG w materiałach, PowerPoincie i Wordzie."
order: 6
source: site
---

# Slajdy i materiały do wykładu

Pokaż konstrukcję tak, jak ją omawiasz: najpierw geometrię, potem podpory i obciążenia, następnie reakcje, a na końcu moment zginający. Rysunek utworzony z obliczonego modelu rozbudowuje się w miejscu, o jedną warstwę na kliknięcie, i zawsze jest poprawny. Ten sam model daje potem rysunki do materiałów.

![Slajd w Slidevie po 0, 2 i 4 kliknięciach: węzły ramy portalowej z wymiarami, potem rama na podporach z obciążeniem, a na końcu reakcje i moment zginający](/screenshots/pl/p2p-plot-slidev-steps.webp){.shot-md}

## Rysunek rozbudowywany etapami {#a-figure-that-builds-up}

Wystarczą dwa pliki. `frame.ts` buduje i oblicza konstrukcję:

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Rama portalowa 6 m na 4 m, podpory przegubowe u podstawy słupów, 10 kN/m na ryglu i 15 kN pchające w węźle B. */
export const portalFrame = (): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 }) // IPE 300
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [0, 0, -4]) // z skierowana w dół: 4 m w górę
  domain.createNode('C', [6, 0, -4])
  domain.createNode('D', [6, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  domain.createBeam2D(2, ['B', 'C'], 1, 1)
  domain.createBeam2D(3, ['C', 'D'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(2, [0, 10e3], true)
  solver.loadCases[0].createNodalLoad('B', { [DofID.Dx]: 15e3 })
  solver.solve()
  return solver
}
```

`BuildUp.vue` rysuje ją etapami. Każdy etap wymienia warstwy, które pokazuje, a `reserve` rozmieszcza je wszystkie od pierwszego kliknięcia, więc każda warstwa pojawia się płynnie na swoim miejscu i nic się nie przesuwa:

```vue [BuildUp.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { StructurePlot, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame'

const props = defineProps<{ step: number }>()

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'], // geometria
  ['nodeLabels', 'members', 'supports'], // konstrukcja
  ['nodeLabels', 'members', 'supports', 'loads'], // jej obciążenie
  ['members', 'supports', 'loads', 'reactions'], // reakcje
  ['members', 'supports', 'reactions', 'M'], // i moment zginający
]
const all = [...new Set(stages.flat())] // rozmieszczone od pierwszego etapu, więc później nic się nie przesuwa
const layers = computed(() => stages[Math.min(props.step, stages.length - 1)])

const frame = portalFrame()
</script>

<template>
  <StructurePlot :solver="frame" :layers="layers" :reserve="all" :height="360" />
</template>
```

Warstwa może też zniknąć: ostatni etap pomija obciążenia, żeby zrobić miejsce na moment. `:height="360"` utrzymuje rysunek w granicach slajdu. Pręty rysują się od jednego końca do drugiego, gdy pojawiają się po raz pierwszy, a warstwy pojawiają się płynnie w ciągu pół sekundy; przy `prefers-reduced-motion` obie animacje są wyłączone, a `:animate="false"` wyłącza je dla wszystkich. Jak spowolnić je na potrzeby dużej sali wykładowej, opisuje sekcja [Własny styl animacji](/pl/plot/theming#restyling-the-animation).

## W Slidevie {#in-slidev}

[Slidev](https://sli.dev) tworzy slajdy z Markdownu za pomocą Vue, więc komponent działa w nim bez zmian. Zainstaluj biblioteki w projekcie prezentacji:

```bash
npm install @edubeam/plot @edubeam/fem
```

Umieść `frame.ts` i `BuildUp.vue` w folderze `components/` prezentacji, a w `slides.md` niech kliknięcia na slajdzie sterują etapem:

```md [slides.md]
---
clicks: 4
---

# From geometry to bending moment

<BuildUp :step="$clicks" />
```

`clicks: 4` daje slajdowi cztery kliknięcia, a `$clicks` liczy je od 0. Każde naciśnięcie klawisza strzałki pokazuje następny etap, a cofnięcie znów go ukrywa. `slidev export` tworzy z prezentacji PDF, z opcją `--with-clicks` po jednej stronie na kliknięcie.

## W dowolnych slajdach w Vue {#in-any-vue-slides}

W innych miejscach przechowuj etap samodzielnie:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import BuildUp from './BuildUp.vue'

const step = ref(0)
</script>

<template>
  <BuildUp :step="step" />
  <button type="button" @click="step = Math.max(0, step - 1)">Back</button>
  <button type="button" @click="step++">Next</button>
</template>
```

## Obliczenia na żywo {#solve-it-live}

Solver oblicza taką ramę w kilka milisekund, więc na wykładzie można zmienić konstrukcję i od razu ją przeliczyć. Powiąż obciążenie z suwakiem i za każdym razem przekazuj nowy obliczony model, tak jak w sekcji [Gdy model się zmienia](/pl/plot/getting-started#when-the-model-changes).

- **Ruchome obciążenie.** [DiagramStack](/pl/plot/diagram-stack#a-load-the-reader-can-drag) pozwala studentom przesuwać siłę skupioną wzdłuż belki i patrzeć, jak zmieniają się za nią siła tnąca i moment zginający.
- **Przypadki obok siebie.** Ustal [`diagramScale`](/pl/plot/structure-plot#several-plots-at-one-scale), a dwa rysunki pokażą momenty w jednej skali, więc większy moment będzie wyglądał na większy.
- **Odczyt wartości.** Z `hover` wskazanie pręta kursorem zaznacza wartość na końcu rzędnej każdego wykresu: zob. [Odczyt wartości](/pl/plot/structure-plot#reading-values).

## Rysunki dla Beamera, PowerPointa i Worda {#figures-for-beamer-powerpoint-and-word}

Prezentacja przygotowana w LaTeX-owym Beamerze lub PowerPoincie albo materiały pisane w Wordzie przyjmują rysunek jako plik. `structureSvg` zapisuje rysunek jako samodzielny plik SVG ze zwykłymi kolorami, rozmieszczony tak samo jak w `StructurePlot`. Skrypt Node, `frame-svg.ts`, obok `frame.ts`:

```ts [frame-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![Rama portalowa jako samodzielny plik SVG wyrenderowany przez CairoSVG: obciążenia, reakcje 20 i 40 w górę oraz 2,3 i 12,7 w poziomie i moment zginający od −50,7 w węźle C do 29,3 w ryglu](/screenshots/pl/p2p-plot-frame-svg.webp){.shot-lg}

PowerPoint i Word (2019 i Microsoft 365) wstawiają SVG bez konwersji. LaTeX przyjmuje go jako PDF: przekonwertuj plik poleceniem `cairosvg frame.svg -o frame.pdf` lub w Inkscapie albo zostaw to poleceniu `\includesvg` z pakietu `svg`. Szczegóły opisuje sekcja [Rysunki dla LaTeX-a i Worda](/pl/plot/exercises#figures-for-latex-and-word), a wszystkie opcje [Samodzielny plik SVG](/pl/plot/functions#a-standalone-svg-file).

### Rysunek rozbudowywany etapami w Beamerze {#a-build-up-in-beamer}

Plik jest dopasowany do warstw, które rysuje, więc pliki zapisane dla każdego etapu osobno nie pokrywałyby się. Przekaż `structureSvg` ten sam `reserve` co w `BuildUp.vue`, czyli każdą warstwę każdego etapu, a wszystkie pliki będą miały ten sam rozmiar i konstrukcję w tym samym miejscu. `frame-stages.ts` zapisuje po jednym pliku na etap:

```ts [frame-stages.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'],
  ['nodeLabels', 'members', 'supports'],
  ['nodeLabels', 'members', 'supports', 'loads'],
  ['members', 'supports', 'loads', 'reactions'],
  ['members', 'supports', 'reactions', 'M'],
]
const all = [...new Set(stages.flat())]
const frame = modelFromSolver(portalFrame())

stages.forEach((layers, i) => {
  writeFileSync(`frame-${i + 1}.svg`, structureSvg(frame, { layers, reserve: all }))
})
```

Przekonwertuj pliki do PDF:

```bash
for i in 1 2 3 4 5; do cairosvg frame-$i.svg -o frame-$i.pdf; done
```

i daj każdemu osobną nakładkę (overlay). Każdy plik zawiera cały etap, więc ramka pokazuje je po jednym, a ponieważ się pokrywają, każde kliknięcie zdaje się dodawać warstwę:

```latex [lecture.tex]
\begin{frame}{From geometry to bending moment}
  \centering
  \includegraphics<1>[width=0.8\linewidth]{frame-1.pdf}%
  \includegraphics<2>[width=0.8\linewidth]{frame-2.pdf}%
  \includegraphics<3>[width=0.8\linewidth]{frame-3.pdf}%
  \includegraphics<4>[width=0.8\linewidth]{frame-4.pdf}%
  \includegraphics<5>[width=0.8\linewidth]{frame-5.pdf}
\end{frame}
```

W PowerPoincie umieść pięć plików na pięciu kolejnych slajdach bez przejść między nimi: każdy krok wygląda wtedy na wykładzie tak samo jak kliknięcie.

## Materiały do wykładu i wydruki {#notes-and-handouts}

- **Materiały do wykładu w sieci.** VitePress i Nuxt renderują rysunki w czasie budowania (build), więc rysunki są w HTML-u, zanim uruchomi się jakikolwiek skrypt: zob. [Osadzanie](/pl/plot/embedding).
- **Materiały drukowane.** Zapisz rysunki przez `structureSvg` na stronie HTML i wydrukuj ją, tak jak robi to [skrypt drukujący kolokwia](/pl/plot/exercises#print-a-test), albo wstaw pliki do LaTeX-a lub Worda.
- **Jeden model, wszystkie rysunki.** Ten sam plik `frame.ts` zasila slajdy, materiały i treść zadania, więc nigdy nie są ze sobą sprzeczne.
