---
title: Első lépések
description: "Az @edubeam/plot telepítése, egy @edubeam/fem-mel kiszámított tartó rajza terhekkel, támaszerőkkel és hajlítónyomatékkal Vue 3-ban, újrarajzolás változáskor és mentés SVG-be."
order: 1
group: Bevezetés
source: site
---

# Első lépések

Az @edubeam/plot SVG-ként rajzol meg egy síkbeli tartót, keretet vagy rácsos tartót az eredményeivel együtt: a rudakat, a támaszokat, a terheket, a támaszerőket, az N, V és M igénybevételi ábrákat és a deformált alakot, pontosan úgy, ahogy az ábrák ezen az oldalon kinéznek. Egy [@edubeam/fem](/hu/solver) által kiszámított modellt adsz át neki – ez az [EduBeam]{.edubeam} számítómagja –, a rajz elrendezését, a léptéket és az egyes számok helyét pedig maga határozza meg.

Oktatók használják egy kezdőértékből (seed) generált [feladatokhoz és dolgozatokhoz](/hu/plot/exercises), kattintásról kattintásra felépülő [diákhoz](/hu/plot/slides), valamint jegyzetek ábráihoz, akár weboldalon, akár LaTeX- és Word-fájlként. Ezen a webhelyen a [gyakorló feladatok](/hu/practice) és a [dolgozatkészítő](/hu/exam) is vele készült.

::div{.actions}
[Az első rajz](#draw-a-solved-model) [Feladatok generálása](/hu/plot/exercises)
::

## Telepítés {#install}

```bash
npm install @edubeam/plot @edubeam/fem vue
```

A Vue 3.5 vagy újabb és a számítómag peer függőségek (peer dependencies), így az alkalmazásodban mindkettőből csak egy példány lesz. A csomag kizárólag ESM, saját típusdefiníciókat tartalmaz, és nincs szüksége stíluslapra. Node 20.19 vagy újabb alatt fut; ha egy TypeScriptben írt szkriptet közvetlenül, `node script.ts` paranccsal akarsz futtatni, Node 22.18 vagy újabb kell.

## Kiszámított modell rajza {#draw-a-solved-model}

Két fájl kell. Az első, a `beams.ts`, az @edubeam/fem segítségével felépít és kiszámít egy tartót. Ez egy egyszerű függvény, így ugyanaz a modell táplálhat egy weboldalt, egy diát és egy szkriptet is:

```ts [beams.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Kiszámított kéttámaszú tartó, `span` m támaszközzel, `q` kN/m teherrel. A számítómag SI-egységekben dolgozik. */
export const simpleBeam = (span: number, q: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 }) // acél, Pa
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 }) // IPE 200, nyírásra merev
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // csuklós támasz
  domain.createNode('B', [span, 0, 0], [DofID.Dz]) // görgős támasz
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true) // N/m, +z lefelé
  solver.solve()
  return solver
}
```

A második, a `BeamFigure.vue`, átadja a számítómagot a `StructurePlot` komponensnek, és megmondja, mit rajzoljon:

```vue [BeamFigure.vue]
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams'

const beam = simpleBeam(6, 12)
</script>

<template>
  <StructurePlot :solver="beam" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
</template>
```

Ez a teljes rajz: a tartó a támaszain, a 12 kN/m-es teher, a két 36 kN-os támaszerő és a hajlítónyomaték, a támaszköz közepén $qL^2/8 = 54$ kNm, a húzott oldalra felrakva:

::model-figure{caption="Amit a BeamFigure.vue rajzol: 6 m-es támaszköz 12 kN/m teherrel"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
labels: horizontal
---
::

A rajz kitölti a tárolója szélességét, a magasságát pedig maga állítja be. A szöveg, a jelek és a vonalvastagságok mérete pixelben állandó, akármekkora a szerkezet, így a rajz telefonon is olvasható marad. Ha a `layers` propot elhagyod, a rajz maga választja ki az eredményt: tartóknál és kereteknél M-et, rácsos tartónál N-et. Az összes [réteget](/hu/plot/structure-plot#layers) a `StructurePlot` oldala sorolja fel; a modellek felépítéséről a [számítómag dokumentációja](/hu/solver/getting-started) szól.

## Ha a modell változik {#when-the-model-changes}

A rajz kiolvassa a kapott számítómagot, de nem figyeli a változásait. Ha valami megváltozik, számítsd ki újra a modellt, és add át az új számítómagot. Egy `computed` pontosan ezt teszi:

```vue [LoadSlider.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams'

const q = ref(12) // kN/m
const beam = computed(() => simpleBeam(6, q.value))
</script>

<template>
  <input v-model.number="q" type="range" min="1" max="30" />
  <StructurePlot :solver="beam" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
</template>
```

Egy ilyen tartó kiszámítása körülbelül egy ezredmásodpercig tart, így a rajz mozgás közben is követi a csúszkát. Ha ehelyett a meglévő számítómagot módosítottad helyben, növeld a `revision` prop értékét, és a rajz újra kiolvassa.

::callout{type="tip" title="A számítómag ne legyen mélyen reaktív"}
Egy `computed`, egy prop vagy egy egyszerű `const` változatlanul tárolja a számítómagot. Ha a komponens állapotában akarod tartani, használj `shallowRef`-et, vagy csomagold `markRaw`-ba: egy sima `ref` miatt a Vue feleslegesen bejárná az egész számítómagot, hogy reaktívvá tegye.
::

## Mentés fájlba {#save-it-as-a-file}

LaTeX-, Word- vagy Inkscape-ábrához a `structureSvg` ugyanezt a rajzot önálló, egyszerű színekkel dolgozó SVG-fájlként írja ki. Nincs szüksége sem Vue-ra, sem böngészőre, csak Node-ra. Mentsd el ezt `beam-svg.ts` néven a `beams.ts` mellé:

```ts [beam-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { simpleBeam } from './beams.ts'

const svg = structureSvg(modelFromSolver(simpleBeam(6, 12)), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
})
writeFileSync('beam.svg', svg)
```

Futtasd a `node beam-svg.ts` paranccsal (Node 22.18 vagy újabb; régebbi verziókon `npx tsx beam-svg.ts`). A beállításokról és arról, hogyan illeszd be a fájlt LaTeX-be és Wordbe, az [Önálló SVG-fájl](/hu/plot/functions#a-standalone-svg-file) szakasz szól.

## Ábrák a tartó alatt {#the-stacked-figure}

A `DiagramStack` minden statikatankönyv jól ismert ábráját rajzolja meg: egy egyenes tartót a terheivel, alatta pedig közös x tengelyen a V(x), M(x) és w(x) ábrát. A `v-model:load-at` segítségével az olvasó egy koncentrált erőt húzhat végig a tartón, és figyelheti, hogyan követik az ábrák:

```vue
<DiagramStack v-model:load-at="at" :solver="solveWithLoadAt(at)" />
```

A teljes példa a [DiagramStack](/hu/plot/diagram-stack) oldalon található.

## Használat mindenhol {#use-it-everywhere}

Ha mindkét komponenst globálisan akarod regisztrálni ahelyett, hogy ott importálnád őket, ahol használod őket:

```ts [main.ts]
import { createApp } from 'vue'
import { EduBeamPlot } from '@edubeam/plot'
import App from './App.vue'

createApp(App).use(EduBeamPlot).mount('#app') // <StructurePlot> és <DiagramStack> minden sablonban
```

A nevesített importok kisebb bundle-t adnak: egy oldal, amely csak a `StructurePlot`-ot importálja, sem a `DiagramStack`-et, sem a plugint nem kapja meg. Mindkét komponens szerveren is renderelhető, Nuxtban vagy VitePressben is: lásd a [Beágyazás](/hu/plot/embedding) oldalt.

## Hogyan tovább {#next}

::card-grid{cols="2"}
:::card{title="Feladatok és dolgozatok" icon="lucide:dices" to="/hu/plot/exercises"}
Minden hallgatónak más feladat egy kezdőértékből, megoldókulccsal, nyomtatva vagy LaTeX-hez mentve.
:::
:::card{title="Diák és jegyzetek" icon="lucide:presentation" to="/hu/plot/slides"}
Kattintásról kattintásra felépülő ábrák Slidevben, Vue-ban vagy Beamerben, és ugyanezek az ábrák jegyzetekhez.
:::
:::card{title="StructurePlot" icon="lucide:frame" to="/hu/plot/structure-plot"}
Rétegek, méretvonalak, bélyegképek, méretek, mértékegységek és értékek leolvasása a mutatóval.
:::
:::card{title="DiagramStack" icon="lucide:rows-3" to="/hu/plot/diagram-stack"}
Tartó a V, M és w ábrája fölött, olyan teherrel, amelyet az olvasó húzhat.
:::
::
