---
title: Primii pași
description: "Instalează @edubeam/plot, desenează în Vue 3 o grindă calculată cu @edubeam/fem, cu încărcări, reacțiuni și moment încovoietor, actualizeaz-o la fiecare schimbare și salveaz-o ca SVG."
order: 1
group: Introducere
source: site
---

# Primii pași

@edubeam/plot desenează ca SVG o grindă, un cadru sau o grindă cu zăbrele plană și rezultatele lor: bare, reazeme, încărcări, reacțiuni, diagramele N, V și M și deformata, exact cum arată figurile de pe acest site. Îi dai un model calculat cu [@edubeam/fem](/ro/solver), programul de calcul din spatele [EduBeam]{.edubeam}; biblioteca stabilește singură așezarea, scara și locul fiecărui număr.

Cadrele didactice o folosesc pentru [exerciții și teste](/ro/plot/exercises) generate dintr-un seed, pentru [slide-uri](/ro/plot/slides) pe care figura se construiește clic cu clic și pentru figuri în note de curs, pe o pagină web sau ca fișiere pentru LaTeX și Word. Paginile [Probleme de statică](/ro/practice) și [generatorul de teste](/ro/exam) de pe acest site sunt făcute cu ea.

::div{.actions}
[Desenează prima figură](#draw-a-solved-model) [Generează exerciții](/ro/plot/exercises)
::

## Instalare {#install}

```bash
npm install @edubeam/plot @edubeam/fem vue
```

Vue 3.5 sau mai nou și programul de calcul sunt dependențe peer, așa că aplicația ta păstrează câte o singură copie din fiecare. Pachetul este doar ESM, vine cu propriile tipuri și nu are nevoie de foaie de stiluri. Rulează în Node 20.19 sau mai nou; ca să rulezi direct un script scris în TypeScript, cu `node script.ts`, ai nevoie de Node 22.18 sau mai nou.

## Desenarea unui model calculat {#draw-a-solved-model}

Două fișiere. Primul, `beams.ts`, construiește și calculează o grindă cu @edubeam/fem. Este o funcție obișnuită, așa că același model poate alimenta o pagină, un slide și un script:

```ts [beams.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Grindă simplu rezemată cu deschiderea `span` m și încărcarea `q` kN/m, gata calculată. Programul de calcul lucrează în unități SI. */
export const simpleBeam = (span: number, q: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 }) // oțel, Pa
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 }) // IPE 200, fără deformații din forfecare
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // articulație
  domain.createNode('B', [span, 0, 0], [DofID.Dz]) // reazem simplu
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true) // N/m, +z în jos
  solver.solve()
  return solver
}
```

Al doilea, `BeamFigure.vue`, îi dă `solver`-ul lui `StructurePlot` și spune ce se desenează:

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

Aceasta este toată figura: grinda pe reazemele ei, încărcarea de 12 kN/m, cele două reacțiuni de câte 36 kN și momentul încovoietor, $qL^2/8 = 54$ kNm la mijlocul deschiderii, desenat de partea fibrei întinse:

::model-figure{caption="Ce desenează BeamFigure.vue: o deschidere de 6 m sub 12 kN/m"}
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

Desenul umple lățimea containerului și își stabilește singur înălțimea. Textul, simbolurile și grosimile liniilor își păstrează mărimea în pixeli oricât de mare ar fi structura, așa că figura rămâne lizibilă și pe telefon. Dacă omiți `layers`, desenul alege singur rezultatul: M pentru grinzi și cadre, N pentru o grindă cu zăbrele. Toate [straturile](/ro/plot/structure-plot#layers) sunt descrise la `StructurePlot`; construirea modelelor este explicată în [documentația programului de calcul](/ro/solver/getting-started).

## Când modelul se schimbă {#when-the-model-changes}

Un desen citește `solver`-ul primit, dar nu îl urmărește. Când se schimbă ceva, calculează din nou și transmite noul `solver`. Exact asta face un `computed`:

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

O astfel de grindă se calculează în circa o milisecundă, așa că figura urmărește glisorul pe măsură ce îl miști. Dacă în schimb ai modificat pe loc un `solver` existent, mărește valoarea prop-ului `revision` și desenul îl citește din nou.

::callout{type="tip" title="Ține solverul departe de reactivitatea profundă"}
Un `computed`, un prop sau o simplă constantă `const` păstrează `solver`-ul așa cum este. Ca să-l ții în starea componentei, folosește `shallowRef` sau învelește-l în `markRaw`: un `ref` obișnuit l-ar face pe Vue să parcurgă degeaba tot `solver`-ul ca să-l facă reactiv.
::

## Salvarea ca fișier {#save-it-as-a-file}

Pentru o figură în LaTeX, Word sau Inkscape, `structureSvg` scrie același desen ca fișier SVG de sine stătător, cu culori simple. Nu are nevoie nici de Vue, nici de browser, doar de Node. Salvează scriptul acesta ca `beam-svg.ts` lângă `beams.ts`:

```ts [beam-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { simpleBeam } from './beams.ts'

const svg = structureSvg(modelFromSolver(simpleBeam(6, 12)), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
})
writeFileSync('beam.svg', svg)
```

Rulează-l cu `node beam-svg.ts` (Node 22.18 sau mai nou; pe versiunile mai vechi, `npx tsx beam-svg.ts`). Opțiunile și modul de a aduce fișierul în LaTeX și Word sunt în [Un fișier SVG de sine stătător](/ro/plot/functions#a-standalone-svg-file).

## Diagramele sub grindă {#the-stacked-figure}

`DiagramStack` desenează figura din orice manual de statică: o grindă dreaptă cu încărcările ei și, sub ea, pe aceeași axă x, diagramele V(x), M(x) și w(x). Cu `v-model:load-at`, cititorul poate trage o forță concentrată de-a lungul grinzii și poate urmări cum se schimbă diagramele:

```vue
<DiagramStack v-model:load-at="at" :solver="solveWithLoadAt(at)" />
```

Exemplul complet este pe pagina [DiagramStack](/ro/plot/diagram-stack).

## În toată aplicația {#use-it-everywhere}

Ca să înregistrezi ambele componente global, în loc să le imporți acolo unde le folosești:

```ts [main.ts]
import { createApp } from 'vue'
import { EduBeamPlot } from '@edubeam/plot'
import App from './App.vue'

createApp(App).use(EduBeamPlot).mount('#app') // <StructurePlot> și <DiagramStack> în fiecare șablon
```

Importurile cu nume păstrează bundle-ul mai mic: o pagină care importă doar `StructurePlot` nu primește nici `DiagramStack`, nici pluginul. Ambele componente se randează și pe server, în Nuxt sau VitePress: vezi [Integrare](/ro/plot/embedding).

## Ce urmează {#next}

::card-grid{cols="2"}
:::card{title="Exerciții și teste" icon="lucide:dices" to="/ro/plot/exercises"}
Alt exercițiu pentru fiecare student, generat dintr-un seed, cu barem, tipărit sau salvat pentru LaTeX.
:::
:::card{title="Slide-uri și note de curs" icon="lucide:presentation" to="/ro/plot/slides"}
Figuri care se construiesc clic cu clic în Slidev, Vue sau Beamer și aceleași figuri pentru notele de curs.
:::
:::card{title="StructurePlot" icon="lucide:frame" to="/ro/plot/structure-plot"}
Straturi, cote, miniaturi, mărimi, unități și citirea valorilor cu cursorul.
:::
:::card{title="DiagramStack" icon="lucide:rows-3" to="/ro/plot/diagram-stack"}
O grindă deasupra diagramelor V, M și w, cu o forță pe care cititorul o poate trage.
:::
::
