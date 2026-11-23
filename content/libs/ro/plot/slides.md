---
title: Slide-uri și note de curs
description: "Figuri de curs cu @edubeam/plot care se construiesc clic cu clic în Slidev, Vue sau Beamer, se calculează live și ajung ca SVG în note, PowerPoint și Word."
order: 6
source: site
---

# Slide-uri și note de curs

Arată o structură așa cum o explici: întâi geometria, apoi reazemele și încărcările, apoi reacțiunile și, la final, momentul încovoietor. O figură desenată dintr-un model calculat se construiește pe loc, câte un strat la fiecare clic, și este mereu corectă. Același model îți dă apoi figurile pentru notele de curs.

![Un slide Slidev după 0, 2 și 4 clicuri: nodurile unui cadru portal cu cotele lui, apoi cadrul pe reazeme cu încărcările lui, apoi reacțiunile și momentul încovoietor](/screenshots/ro/p2p-plot-slidev-steps.webp){.shot-md}

## Un curs întreg {#a-whole-lecture}

[Un curs demonstrativ despre grinzile cu zăbrele plane](https://edubeam-slides.pages.dev) pune totul într-o singură prezentare: 23 de slide-uri, așa cum le-ar da un curs, cu un exemplu rezolvat nod cu nod, fiecare nod desenat izolat lângă ecuațiile lui, figuri care se construiesc clic cu clic și un exercițiu al cărui răspuns apare la un clic. Deschide-l în browser sau pornește-ți propria prezentare din [sursa lui](https://github.com/EduBeamApp/slides): sigla, numele și culorile universității fictive se află în trei fișiere.

![Patru slide-uri din cursul demonstrativ: slide-ul de titlu „Plane trusses” cu o grindă cu zăbrele Warren și eforturile din bare, nodul A izolat lângă cele două ecuații ale lui, toate eforturile din barele grinzii cu zăbrele împreună cu tabelul lor și grinzi cu zăbrele de pod Pratt, Howe și Warren alăturate](/screenshots/plot-example-lecture.webp){.shot-lg}

## O figură care se construiește pas cu pas {#a-figure-that-builds-up}

Două fișiere. `frame.ts` construiește și calculează structura:

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Un cadru portal de 6 m pe 4 m, articulat la baza stâlpilor, cu 10 kN/m pe riglă și 15 kN care împinge în B. */
export const portalFrame = (): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 }) // IPE 300
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [0, 0, -4]) // z e orientat în jos: 4 m în sus
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

`BuildUp.vue` o desenează pe etape. Fiecare etapă enumeră straturile pe care le arată, iar `reserve` le așază pe toate de la primul clic, așa că fiecare strat apare treptat exact unde îi e locul și nimic nu se mișcă:

```vue [BuildUp.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { StructurePlot, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame'

const props = defineProps<{ step: number }>()

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'], // geometria
  ['nodeLabels', 'members', 'supports'], // structura
  ['nodeLabels', 'members', 'supports', 'loads'], // încărcările ei
  ['members', 'supports', 'loads', 'reactions'], // reacțiunile
  ['members', 'supports', 'reactions', 'M'], // și momentul încovoietor
]
const all = [...new Set(stages.flat())] // așezate de la prima etapă, ca nimic să nu se miște mai târziu
const layers = computed(() => stages[Math.min(props.step, stages.length - 1)])

const frame = portalFrame()
</script>

<template>
  <StructurePlot :solver="frame" :layers="layers" :reserve="all" :height="360" />
</template>
```

Un strat poate și să dispară: ultima etapă renunță la încărcări ca să facă loc momentului. `:height="360"` ține figura în interiorul slide-ului. Barele se desenează de la un capăt la celălalt când apar prima dată, iar straturile apar treptat în jumătate de secundă; ambele animații sunt dezactivate la `prefers-reduced-motion`, iar `:animate="false"` le dezactivează pentru toată lumea. Ca să le încetinești pentru un amfiteatru, vezi [Personalizarea animației](/ro/plot/theming#restyling-the-animation).

## În Slidev {#in-slidev}

[Slidev](https://sli.dev) face slide-uri din Markdown cu Vue, așa că acolo componenta funcționează ca atare. Instalează bibliotecile în proiectul prezentării:

```bash
npm install @edubeam/plot @edubeam/fem
```

Pune `frame.ts` și `BuildUp.vue` în folderul `components/` al prezentării și lasă clicurile slide-ului să conducă etapa în `slides.md`:

```md [slides.md]
---
clicks: 4
---

# From geometry to bending moment

<BuildUp :step="$clicks" />
```

`clicks: 4` îi dă slide-ului patru clicuri, iar `$clicks` le numără de la 0. Fiecare apăsare a tastei săgeată arată etapa următoare; revenirea o ascunde din nou. `slidev export` face un PDF din prezentare, cu câte o pagină pentru fiecare clic dacă adaugi `--with-clicks`.

## În orice slide-uri Vue {#in-any-vue-slides}

În orice alt loc, ține tu evidența etapei:

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

## Calcul live {#solve-it-live}

Programul de calcul rezolvă un astfel de cadru în câteva milisecunde, așa că la curs poți schimba structura și o poți recalcula pe loc. Leagă o încărcare de un glisor și transmite de fiecare dată un nou model calculat, ca în [Când modelul se schimbă](/ro/plot/getting-started#when-the-model-changes).

- **O forță mobilă.** [DiagramStack](/ro/plot/diagram-stack#a-load-the-reader-can-drag) îi lasă pe studenți să tragă o forță concentrată de-a lungul unei grinzi și să urmărească cum o urmează forța tăietoare și momentul încovoietor.
- **Cazuri alăturate.** Fixează [`diagramScale`](/ro/plot/structure-plot#several-plots-at-one-scale), iar două desene își vor arăta momentele la aceeași scară, așa că momentul mai mare chiar arată mai mare.
- **Citirea valorilor.** Cu `hover`, când arăți spre o bară, valoarea este marcată la vârful ordonatei fiecărei diagrame: vezi [Citirea valorilor](/ro/plot/structure-plot#reading-values).

## Figuri pentru Beamer, PowerPoint și Word {#figures-for-beamer-powerpoint-and-word}

O prezentare făcută în LaTeX Beamer sau PowerPoint ori note scrise în Word primesc figura ca fișier. `structureSvg` scrie desenul ca fișier SVG de sine stătător, cu culori simple, așezat la fel ca în `StructurePlot`. Un script Node, `frame-svg.ts`, lângă `frame.ts`:

```ts [frame-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![Cadrul portal ca fișier SVG de sine stătător, randat cu CairoSVG: încărcările, reacțiunile, 20 și 40 în sus și 2,3 și 12,7 pe orizontală, și momentul încovoietor de la −50,7 în C la 29,3 în riglă](/screenshots/ro/p2p-plot-frame-svg.webp){.shot-lg}

PowerPoint și Word (2019 și Microsoft 365) inserează SVG-ul ca atare. LaTeX îl primește ca PDF: convertește-l cu `cairosvg frame.svg -o frame.pdf` sau cu Inkscape ori lasă comanda `\includesvg` din pachetul `svg` să o facă. Detaliile sunt în [Figuri pentru LaTeX și Word](/ro/plot/exercises#figures-for-latex-and-word), iar toate opțiunile în [Un fișier SVG de sine stătător](/ro/plot/functions#a-standalone-svg-file).

### Construcție pas cu pas în Beamer {#a-build-up-in-beamer}

Un fișier este încadrat pe straturile pe care le desenează, așa că fișierele scrise separat pentru fiecare etapă nu s-ar suprapune. Dă-i lui `structureSvg` același `reserve` ca în `BuildUp.vue`, adică fiecare strat al fiecărei etape, iar toate fișierele vor avea aceeași dimensiune, cu structura în același loc. `frame-stages.ts` scrie câte un fișier pentru fiecare etapă:

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

Convertește fișierele în PDF:

```bash
for i in 1 2 3 4 5; do cairosvg frame-$i.svg -o frame-$i.pdf; done
```

și dă-i fiecăruia propriul overlay. Fiecare fișier conține o etapă întreagă, așa că frame-ul le arată pe rând, iar pentru că se suprapun exact, fiecare clic pare să adauge un strat:

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

În PowerPoint, pune cele cinci fișiere pe cinci slide-uri consecutive, fără tranziții între ele: fiecare pas arată la curs la fel ca un clic.

## Note de curs și materiale tipărite {#notes-and-handouts}

- **Note de curs pe web.** VitePress și Nuxt randează desenele la build, așa că figurile sunt în HTML înainte să ruleze vreun script: vezi [Integrare](/ro/plot/embedding).
- **Note tipărite.** Scrie figurile cu `structureSvg` într-o pagină HTML și tipărește-o, cum face [generatorul de teste](/ro/plot/exercises#print-a-test), sau include fișierele în LaTeX ori Word.
- **Un singur model, toate figurile.** Același `frame.ts` alimentează slide-urile, notele și enunțul exercițiului, așa că nu se contrazic niciodată.
