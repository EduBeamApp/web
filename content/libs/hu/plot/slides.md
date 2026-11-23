---
title: Diák és jegyzetek
description: "Előadásábrák az @edubeam/plot könyvtárral: kattintásról kattintásra felépülve Slidevben, Vue-ban vagy Beamerben, élő számítással, SVG-ként jegyzetekben, PowerPointban és Wordben."
order: 6
source: site
---

# Diák és előadásjegyzetek

Úgy mutasd be a szerkezetet, ahogy elmagyarázod: előbb a geometriát, aztán a támaszokat és a terheket, majd a támaszerőket, végül a hajlítónyomatékot. A kiszámított modellből készült rajz a helyén épül fel, kattintásonként egy réteggel, és mindig helyes. Ugyanaz a modell adja aztán a jegyzeteid ábráit is.

![Slidev-dia 0, 2 és 4 kattintás után: egy keret csomópontjai a méretvonalakkal, aztán a keret a támaszain a terheivel, végül a támaszerők és a hajlítónyomaték](/screenshots/hu/p2p-plot-slidev-steps.webp){.shot-md}

## Egy teljes előadás {#a-whole-lecture}

[Egy minta-előadás a síkbeli rácsos tartókról](https://edubeam-slides.pages.dev) mindezt egyetlen diasorba foglalja: 23 dia, ahogy egy tantárgy előadásán elhangzana, csomópontról csomópontra kiszámított mintapéldával, amelyben minden kimetszett csomópont az egyenletei mellett látható, kattintásról kattintásra felépülő ábrákkal, és egy feladattal, amelynek a megoldása kattintásra jelenik meg. Nyisd meg a böngészőben, vagy indítsd a saját diasorodat [a forráskódjából](https://github.com/EduBeamApp/slides): a kitalált egyetem logója, nevei és színei három fájlban vannak.

![A minta-előadás négy diája: a Plane trusses című előadás címdiája egy Warren-rendszerű rácsos tartóval és rúderőivel, a kimetszett A csomópont a két egyenlete mellett, a rácsos tartó összes rúdereje táblázattal, valamint Pratt-, Howe- és Warren-rendszerű hídtartók egymás mellett](/screenshots/plot-example-lecture.webp){.shot-lg}

## Fokozatosan felépülő rajz {#a-figure-that-builds-up}

Két fájl kell. A `frame.ts` felépíti és kiszámítja a szerkezetet:

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Egy 6 m × 4 m-es keret csuklós oszloptalpakkal, a gerendán 10 kN/m, B-ben 15 kN vízszintes erővel. */
export const portalFrame = (): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 }) // IPE 300
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [0, 0, -4]) // z lefelé mutat: 4 m felfelé
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

A `BuildUp.vue` szakaszosan rajzolja meg. Minden szakasz felsorolja a megjelenített rétegeit, a `reserve` pedig már az első kattintástól mindegyiknek helyet hagy, így minden réteg a helyén úszik be, és semmi sem mozdul el:

```vue [BuildUp.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { StructurePlot, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame'

const props = defineProps<{ step: number }>()

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'], // a geometria
  ['nodeLabels', 'members', 'supports'], // a szerkezet
  ['nodeLabels', 'members', 'supports', 'loads'], // a terhei
  ['members', 'supports', 'loads', 'reactions'], // a támaszerők
  ['members', 'supports', 'reactions', 'M'], // és a hajlítónyomaték
]
const all = [...new Set(stages.flat())] // az első lépéstől elrendezve, így később semmi sem mozdul el
const layers = computed(() => stages[Math.min(props.step, stages.length - 1)])

const frame = portalFrame()
</script>

<template>
  <StructurePlot :solver="frame" :layers="layers" :reserve="all" :height="360" />
</template>
```

Egy réteg el is tűnhet: az utolsó szakasz elhagyja a terheket, hogy helyet adjon a nyomatéknak. A `:height="360"` a dián belül tartja a rajzot. A rudak első megjelenésükkor egyik végüktől a másikig kirajzolódnak, a rétegek pedig fél másodperc alatt úsznak be; `prefers-reduced-motion` mellett mindkettő ki van kapcsolva, a `:animate="false"` pedig mindenkinél kikapcsolja őket. Hogy előadóteremhez hogyan lassíthatod le őket, azt az [Az animáció testreszabása](/hu/plot/theming#restyling-the-animation) szakasz írja le.

## Slidevben {#in-slidev}

A [Slidev](https://sli.dev) Vue segítségével készít diákat Markdownból, így a komponens változtatás nélkül működik benne. Telepítsd a könyvtárakat a diasor projektjébe:

```bash
npm install @edubeam/plot @edubeam/fem
```

Tedd a `frame.ts` és a `BuildUp.vue` fájlt a diasor `components/` mappájába, a `slides.md` fájlban pedig a dia kattintásai vezéreljék a lépést:

```md [slides.md]
---
clicks: 4
---

# From geometry to bending moment

<BuildUp :step="$clicks" />
```

A `clicks: 4` négy kattintást ad a diának, a `$clicks` pedig 0-tól számolja őket. A nyílbillentyű minden lenyomása a következő szakaszt mutatja, visszalépéskor az ismét eltűnik. A `slidev export` PDF-et készít a diasorból, a `--with-clicks` kapcsolóval kattintásonként egy oldallal.

## Bármilyen Vue-alapú diákban {#in-any-vue-slides}

Máshol magad tárold a lépést:

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

## Élő számítás {#solve-it-live}

Egy ilyen keretet a számítómag néhány ezredmásodperc alatt kiszámít, így előadás közben is meg lehet változtatni a szerkezetet, és azonnal újraszámolni. Köss egy terhet egy csúszkához, és minden alkalommal adj át egy új kiszámított modellt, ahogy a [Ha a modell változik](/hu/plot/getting-started#when-the-model-changes) szakaszban.

- **Mozgó teher.** A [DiagramStack](/hu/plot/diagram-stack#a-load-the-reader-can-drag) lehetővé teszi, hogy a hallgatók egy koncentrált erőt húzzanak végig a tartón, és figyeljék, hogyan követi ezt a nyíróerő és a hajlítónyomaték.
- **Esetek egymás mellett.** Rögzítsd a [`diagramScale`](/hu/plot/structure-plot#several-plots-at-one-scale) értékét, és két rajz azonos léptékben rajzolja a nyomatékait, így a nagyobb nagyobbnak is látszik.
- **Értékek leolvasása.** `hover` mellett egy rúdra mutatva minden ábra ordinátájának végén megjelenik az érték: lásd [Értékek leolvasása](/hu/plot/structure-plot#reading-values).

## Ábrák Beamerhez, PowerPointhoz és Wordhöz {#figures-for-beamer-powerpoint-and-word}

A LaTeX Beamerben vagy PowerPointban készült diasor, illetve a Wordben írt jegyzet fájlként fogadja a rajzot. A `structureSvg` önálló, egyszerű színekkel dolgozó SVG-ként írja ki a rajzot, ugyanúgy elrendezve, ahogy a `StructurePlot`. Egy Node-szkript, a `frame-svg.ts`, a `frame.ts` mellett:

```ts [frame-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![A keret önálló SVG-fájlként, a CairoSVG renderelésében: a terhek, a támaszerők (20 és 40 felfelé, 2,3 és 12,7 vízszintesen) és a hajlítónyomaték a C csomóponti −50,7-től a gerendabeli 29,3-ig](/screenshots/hu/p2p-plot-frame-svg.webp){.shot-lg}

A PowerPoint és a Word (2019 és Microsoft 365) átalakítás nélkül beszúrja az SVG-t. A LaTeX PDF-ként fogadja: alakítsd át a `cairosvg frame.svg -o frame.pdf` paranccsal vagy az Inkscape-pel, vagy bízd az `svg` csomag `\includesvg` parancsára. A részleteket az [Ábrák LaTeX-hez és Wordhöz](/hu/plot/exercises#figures-for-latex-and-word), az összes beállítást az [Önálló SVG-fájl](/hu/plot/functions#a-standalone-svg-file) szakasz ismerteti.

### Fokozatos felépítés Beamerben {#a-build-up-in-beamer}

Minden fájl elrendezése a benne kirajzolt rétegekhez igazodik, így az egyes szakaszokhoz külön-külön kiírt fájlok nem illeszkednének egymásra. Add meg a `structureSvg` függvénynek ugyanazt a `reserve` értéket, mint a `BuildUp.vue` fájlban, vagyis minden szakasz minden rétegét, és minden fájl ugyanakkora lesz, a szerkezettel ugyanazon a helyen. A `frame-stages.ts` szakaszonként egy fájlt ír ki:

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

Alakítsd a fájlokat PDF-fé:

```bash
for i in 1 2 3 4 5; do cairosvg frame-$i.svg -o frame-$i.pdf; done
```

és mindegyiknek adj saját overlay-t. Minden fájl egy teljes szakaszt tartalmaz, így a Beamer-frame egyszerre csak egyet mutat, és mivel pontosan fedik egymást, minden kattintás látszólag egy réteget ad hozzá:

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

PowerPointban tedd az öt fájlt öt egymást követő diára, áttűnés nélkül: minden lépés az előadáson ugyanúgy néz ki, mint egy kattintás.

## Jegyzetek és kiosztott anyagok {#notes-and-handouts}

- **Webes jegyzetek.** A VitePress és a Nuxt a build idején rendereli a rajzokat, így az ábrák már azelőtt benne vannak a HTML-ben, hogy bármilyen szkript lefutna: lásd [Beágyazás](/hu/plot/embedding).
- **Nyomtatott jegyzetek.** Írd ki az ábrákat a `structureSvg` segítségével egy HTML-oldalra, és nyomtasd ki, ahogy a [dolgozatgenerátor](/hu/plot/exercises#print-a-test) teszi, vagy illeszd be a fájlokat LaTeX-be vagy Wordbe.
- **Egy modell, minden ábra.** Ugyanaz a `frame.ts` táplálja a diákat, a jegyzeteket és a feladatlapot, így soha nem mondanak ellent egymásnak.
