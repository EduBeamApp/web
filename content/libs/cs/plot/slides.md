---
title: Prezentace a skripta
description: "Obrázky k přednáškám s @edubeam/plot: ve Slidevu, Vue nebo Beameru přibývají klik po kliku, počítají se živě a jako SVG jdou do skript, PowerPointu i Wordu."
order: 6
---

# Prezentace a skripta

Ukažte konstrukci tak, jak ji vykládáte: nejdřív geometrii, pak podpory a zatížení, potom reakce a nakonec ohybový moment. Obrázek nakreslený ze spočteného modelu přibývá na místě, s každým kliknutím o jednu vrstvu, a je vždy správně. Tentýž model vám pak dá i obrázky do skript.

![Snímek ve Slidevu po 0, 2 a 4 kliknutích: uzly dvoukloubového rámu s kótami, pak rám na podporách se zatížením, nakonec reakce a ohybový moment](/screenshots/cs/p2p-plot-slidev-steps.webp){.shot-md}

## Postupně přibývající obrázek {#a-figure-that-builds-up}

Stačí dva soubory. `frame.ts` sestaví a spočte konstrukci:

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Dvoukloubový rám 6 m × 4 m, 10 kN/m na příčli a vodorovná síla 15 kN v B. */
export const portalFrame = (): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 }) // IPE 300
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [0, 0, -4]) // z míří dolů: 4 m nahoru
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

`BuildUp.vue` ji kreslí po etapách. Každá etapa vyjmenuje vrstvy, které ukazuje, a `reserve` je rozvrhne všechny hned od prvního kliknutí, takže se každá vrstva objeví na svém místě a nic se neposune:

```vue [BuildUp.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { StructurePlot, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame'

const props = defineProps<{ step: number }>()

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'], // geometrie
  ['nodeLabels', 'members', 'supports'], // konstrukce
  ['nodeLabels', 'members', 'supports', 'loads'], // její zatížení
  ['members', 'supports', 'loads', 'reactions'], // reakce
  ['members', 'supports', 'reactions', 'M'], // a ohybový moment
]
const all = [...new Set(stages.flat())] // rozvrženo od prvního kroku, aby se později nic neposunulo
const layers = computed(() => stages[Math.min(props.step, stages.length - 1)])

const frame = portalFrame()
</script>

<template>
  <StructurePlot :solver="frame" :layers="layers" :reserve="all" :height="360" />
</template>
```

Vrstva může také zmizet: poslední etapa vynechá zatížení, aby měl moment víc místa. `:height="360"` udrží obrázek uvnitř snímku. Prvky se při prvním zobrazení vykreslí od jednoho konce k druhému a vrstvy se objevují postupně během půl sekundy. Při `prefers-reduced-motion` je obojí vypnuté a `:animate="false"` to vypne pro všechny. Jak animace zpomalit pro posluchárnu, najdete v části [Úprava animace](/cs/plot/theming#restyling-the-animation).

## Ve Slidevu {#in-slidev}

[Slidev](https://sli.dev) dělá prezentace z Markdownu pomocí Vue, takže v něm komponenta funguje tak, jak je. Nainstalujte knihovny do projektu prezentace:

```bash
npm install @edubeam/plot @edubeam/fem
```

Soubory `frame.ts` a `BuildUp.vue` dejte do složky `components/` prezentace a v `slides.md` nechte krok řídit kliknutími na snímku:

```md [slides.md]
---
clicks: 4
---

# From geometry to bending moment

<BuildUp :step="$clicks" />
```

`clicks: 4` dá snímku čtyři kliknutí a `$clicks` je počítá od 0. Každé stisknutí šipky ukáže další etapu, krok zpět ji zase skryje. `slidev export` vytvoří z prezentace PDF, s `--with-clicks` jednu stránku na každé kliknutí.

## V jiných prezentacích ve Vue {#in-any-vue-slides}

Jinde si krok udržujte sami:

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

## Výpočet přímo na přednášce {#solve-it-live}

Řešič spočte takový rám za několik milisekund, takže na přednášce můžete konstrukci změnit a hned ji přepočítat. Navažte zatížení na posuvník a pokaždé předejte nově spočtený model, jako v části [Když se model změní](/cs/plot/getting-started#when-the-model-changes).

- **Pohyblivé zatížení.** [DiagramStack](/cs/plot/diagram-stack#a-load-the-reader-can-drag) nechá studenty posouvat osamělou sílu po nosníku a sledovat, jak se s ní mění posouvající síla a ohybový moment.
- **Případy vedle sebe.** Zadejte pevné [`diagramScale`](/cs/plot/structure-plot#several-plots-at-one-scale) a dva obrázky vykreslí momenty ve stejném měřítku, takže větší moment opravdu vypadá větší.
- **Odečítání hodnot.** S `hover` stačí ukázat na prvek a na konci pořadnice každého průběhu se vyznačí hodnota: viz [Odečítání hodnot](/cs/plot/structure-plot#reading-values).

## Obrázky pro Beamer, PowerPoint a Word {#figures-for-beamer-powerpoint-and-word}

Prezentace v LaTeXu (Beamer) nebo v PowerPointu a skripta psaná ve Wordu potřebují obrázek jako soubor. `structureSvg` zapíše obrázek jako samostatné SVG s pevnými barvami, rozvržené stejně, jako ho rozvrhne `StructurePlot`. Stačí skript v Node, `frame-svg.ts`, vedle souboru `frame.ts`:

```ts [frame-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![Dvoukloubový rám jako samostatný soubor SVG vykreslený pomocí CairoSVG: zatížení, reakce 20 a 40 nahoru a 2,3 a 12,7 vodorovně a ohybový moment od −50,7 v C po 29,3 na příčli](/screenshots/cs/p2p-plot-frame-svg.webp){.shot-lg}

PowerPoint i Word (2019 a Microsoft 365) vloží SVG tak, jak je. LaTeX ho potřebuje jako PDF: převeďte ho příkazem `cairosvg frame.svg -o frame.pdf` nebo Inkscapem, případně to nechte na `\includesvg` z balíčku `svg`. Podrobnosti najdete v části [Obrázky pro LaTeX a Word](/cs/plot/exercises#figures-for-latex-and-word) a všechny volby v části [Samostatný soubor SVG](/cs/plot/functions#a-standalone-svg-file).

### Postupně přibývající obrázek v Beameru {#a-build-up-in-beamer}

Soubor se přizpůsobí vrstvám, které kreslí, takže soubory zapsané pro každou etapu zvlášť by na sebe nelícovaly. Předejte `structureSvg` stejné `reserve` jako v `BuildUp.vue`, tedy všechny vrstvy všech etap, a každý soubor bude mít stejnou velikost a konstrukci na stejném místě. `frame-stages.ts` zapíše jeden soubor na každou etapu:

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

Převeďte soubory do PDF:

```bash
for i in 1 2 3 4 5; do cairosvg frame-$i.svg -o frame-$i.pdf; done
```

a každému dejte vlastní overlay. Každý soubor obsahuje celou etapu, takže snímek (frame) ukazuje vždy jen jeden z nich, a protože na sebe přesně lícují, vypadá to, že každé kliknutí přidá vrstvu:

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

V PowerPointu dejte pět souborů na pět po sobě jdoucích snímků bez přechodu: každý krok pak vypadá stejně jako kliknutí na přednášce.

## Skripta a podklady {#notes-and-handouts}

- **Skripta na webu.** VitePress i Nuxt vykreslují obrázky při buildu, takže jsou v HTML dřív, než se spustí jakýkoli skript: viz [Vkládání do stránek](/cs/plot/embedding).
- **Tištěná skripta.** Zapište obrázky pomocí `structureSvg` do stránky HTML a vytiskněte ji, jako to dělá [skript pro tisk písemek](/cs/plot/exercises#print-a-test), nebo vložte soubory do LaTeXu či Wordu.
- **Jeden model pro všechny obrázky.** Tentýž `frame.ts` napájí snímky, skripta i zadání příkladu, takže si nikdy neodporují.
