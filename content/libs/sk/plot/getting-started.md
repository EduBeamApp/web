---
title: Začíname
description: "Inštalácia @edubeam/plot, vykreslenie nosníka vypočítaného v @edubeam/fem so zaťažením, reakciami a ohybovým momentom vo Vue 3, prekreslenie po zmene a export do SVG."
order: 1
group: Úvod
source: site
---

# Začíname

@edubeam/plot vykreslí rovinný nosník, rám alebo priehradovú konštrukciu aj s výsledkami ako SVG: prvky, podpery, zaťaženie, reakcie, priebehy N, V a M a deformovaný tvar, presne tak, ako vyzerajú obrázky na tomto webe. Knižnici odovzdáte model vypočítaný riešičom [@edubeam/fem](/sk/solver), na ktorom je postavený [EduBeam]{.edubeam}, a o rozložení, mierke aj umiestnení každého čísla rozhodne sama.

Vyučujúci ju používajú na [príklady a písomky](/sk/plot/exercises) generované zo seedu (počiatočnej hodnoty generátora náhodných čísel), na [prezentácie](/sk/plot/slides), v ktorých obrázok pribúda s každým kliknutím, a na obrázky do skrípt, či už na webovej stránke, alebo ako súbory pre LaTeX a Word. Sú na nej postavené aj stránky [Precvičovanie](/sk/practice) a [Generátor písomiek](/sk/exam) na tomto webe.

::div{.actions}
[Nakreslite prvý obrázok](#draw-a-solved-model) [Generujte príklady](/sk/plot/exercises)
::

## Inštalácia {#install}

```bash
npm install @edubeam/plot @edubeam/fem vue
```

Vue 3.5 alebo novšia verzia a riešič sú peer dependencies, takže vaša aplikácia má z každého iba jednu kópiu. Balík je čisto ESM, obsahuje vlastné typy a nepotrebuje žiadny súbor so štýlmi. Beží v Node 20.19 a novšom; ak chcete skript v TypeScripte spúšťať priamo, príkazom `node script.ts`, potrebujete Node 22.18 alebo novší.

## Vykreslenie vypočítaného modelu {#draw-a-solved-model}

Stačia dva súbory. Prvý, `beams.ts`, zostaví a vypočíta nosník v @edubeam/fem. Je to obyčajná funkcia, takže ten istý model môže poslúžiť stránke, prezentácii aj skriptu:

```ts [beams.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Vypočítaný prostý nosník s rozpätím `span` m zaťažený `q` kN/m. Riešič pracuje v jednotkách SI. */
export const simpleBeam = (span: number, q: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 }) // oceľ, Pa
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 }) // IPE 200, v šmyku tuhý
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // pevný kĺb
  domain.createNode('B', [span, 0, 0], [DofID.Dz]) // posuvný kĺb
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true) // N/m, +z smeruje nadol
  solver.solve()
  return solver
}
```

Druhý, `BeamFigure.vue`, odovzdá riešič komponentu `StructurePlot` a určí, čo sa má vykresliť:

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

To je celý obrázok: nosník na podperách, zaťaženie 12 kN/m, obe reakcie 36 kN a ohybový moment, v strede rozpätia $qL^2/8 = 54$ kNm, vykreslený na ťahanej strane:

::model-figure{caption="Čo vykreslí BeamFigure.vue: rozpätie 6 m, zaťaženie 12 kN/m"}
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

Obrázok vyplní šírku svojho kontajnera a výšku si určí sám. Text, značky a hrúbky čiar si zachovávajú veľkosť v pixeloch bez ohľadu na veľkosť konštrukcie, takže obrázok zostane čitateľný aj na telefóne. Ak `layers` vynecháte, obrázok si výsledok zvolí sám: M pre nosníky a rámy, N pre priehradovú konštrukciu. Prehľad všetkých [vrstiev](/sk/plot/structure-plot#layers) nájdete na stránke `StructurePlot`; zostavovanie modelov opisuje [dokumentácia riešiča](/sk/solver/getting-started).

## Keď sa model zmení {#when-the-model-changes}

Obrázok vychádza z riešiča, ktorý dostane, ale jeho zmeny nesleduje. Keď sa niečo zmení, vypočítajte model znova a odovzdajte nový riešič. Presne to urobí `computed`:

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

Takýto nosník sa vypočíta zhruba za milisekundu, takže obrázok plynulo sleduje pohyb posúvača. Zmenili ste namiesto toho priamo existujúci riešič? Zvýšte hodnotu prop `revision` a obrázok riešič načíta znova.

::callout{type="tip" title="Riešiče nedávajte do hlbokej reaktivity"}
`computed`, prop alebo obyčajná `const` drží riešič taký, aký je. Ak ho chcete mať v stave komponentu, použite `shallowRef` alebo ho obaľte funkciou `markRaw`: obyčajný `ref` by Vue zbytočne nútil prejsť celý riešič a urobiť ho reaktívnym.
::

## Uloženie do súboru {#save-it-as-a-file}

Pre obrázok do LaTeXu, Wordu alebo Inkscapu zapíše `structureSvg` ten istý výkres ako samostatný súbor SVG s pevnými farbami. Nepotrebuje Vue ani prehliadač, iba Node. Uložte tento skript ako `beam-svg.ts` vedľa `beams.ts`:

```ts [beam-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { simpleBeam } from './beams.ts'

const svg = structureSvg(modelFromSolver(simpleBeam(6, 12)), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
})
writeFileSync('beam.svg', svg)
```

Spustite ho príkazom `node beam-svg.ts` (Node 22.18 a novší; v starších verziách `npx tsx beam-svg.ts`). Možnosti funkcie a postup, ako súbor vložiť do LaTeXu a Wordu, nájdete v časti [Samostatný súbor SVG](/sk/plot/functions#a-standalone-svg-file).

## Obrázok s priebehmi pod sebou {#the-stacked-figure}

`DiagramStack` kreslí obrázok, ktorý nájdete v každej učebnici statiky: priamy nosník so zaťažením a pod ním na spoločnej osi x priebehy V(x), M(x) a w(x). S `v-model:load-at` môže čitateľ posúvať osamelú silu po nosníku a sledovať, ako sa priebehy menia:

```vue
<DiagramStack v-model:load-at="at" :solver="solveWithLoadAt(at)" />
```

Celý príklad je na stránke [DiagramStack](/sk/plot/diagram-stack).

## Použitie v celej aplikácii {#use-it-everywhere}

Ak chcete oba komponenty zaregistrovať globálne namiesto toho, aby ste ich importovali tam, kde ich používate:

```ts [main.ts]
import { createApp } from 'vue'
import { EduBeamPlot } from '@edubeam/plot'
import App from './App.vue'

createApp(App).use(EduBeamPlot).mount('#app') // <StructurePlot> a <DiagramStack> v každej šablóne
```

S pomenovanými importmi zostane bundle menší: stránka, ktorá importuje iba `StructurePlot`, nedostane ani `DiagramStack`, ani plugin. Oba komponenty sa vykreslia aj na serveri, v Nuxte alebo VitePresse – pozrite [Vkladanie do stránok](/sk/plot/embedding).

## Kam ďalej {#next}

::card-grid{cols="2"}
:::card{title="Príklady a písomky" icon="lucide:dices" to="/sk/plot/exercises"}
Pre každého študenta iný príklad zo seedu, s kľúčom riešení, na tlač alebo ako súbory pre LaTeX.
:::
:::card{title="Prezentácie a skriptá" icon="lucide:presentation" to="/sk/plot/slides"}
Obrázky, ktoré pribúdajú s každým kliknutím v Slidev, Vue alebo Beameri, a tie isté obrázky do skrípt.
:::
:::card{title="StructurePlot" icon="lucide:frame" to="/sk/plot/structure-plot"}
Vrstvy, kóty, náhľady, veľkosti, jednotky a odčítanie hodnôt ukazovateľom.
:::
:::card{title="DiagramStack" icon="lucide:rows-3" to="/sk/plot/diagram-stack"}
Nosník nad priebehmi V, M a w so zaťažením, ktoré môže čitateľ posúvať.
:::
::
