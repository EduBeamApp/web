---
title: Prezentácie a skriptá
description: "Obrázky k prednáškam s @edubeam/plot: v Slidev, Vue alebo Beameri pribúdajú klik po kliku, počítajú sa naživo a ako SVG idú do skrípt, PowerPointu aj Wordu."
order: 6
source: site
---

# Prezentácie a skriptá

Ukážte konštrukciu tak, ako ju vysvetľujete: najprv geometriu, potom podpery a zaťaženie, potom reakcie a nakoniec ohybový moment. Obrázok nakreslený z vypočítaného modelu pribúda na mieste, s každým kliknutím o jednu vrstvu, a je vždy správny. Ten istý model vám potom dá aj obrázky do skrípt.

![Snímka v Slidev po 0, 2 a 4 kliknutiach: uzly dvojkĺbového rámu s kótami, potom rám na podperách so zaťažením, nakoniec reakcie a ohybový moment](/screenshots/sk/p2p-plot-slidev-steps.webp){.shot-md}

## Celá prednáška {#a-whole-lecture}

[Ukážková prednáška o rovinných priehradových konštrukciách](https://edubeam-slides.pages.dev) spája všetko do jednej prezentácie: 23 snímok, ako by ich zostavil skutočný predmet, s riešeným príkladom vypočítaným uzlovou metódou, pri ktorom je každý uvoľnený uzol nakreslený vedľa svojich rovníc, s obrázkami, ktoré pribúdajú klik po kliku, a s úlohou, ktorej výsledok sa objaví po kliknutí. Otvorte ju v prehliadači alebo si z [jej zdrojového kódu](https://github.com/EduBeamApp/slides) založte vlastnú prezentáciu: logo, názvy a farby jej vymyslenej univerzity sú v troch súboroch.

![Štyri snímky ukážkovej prednášky: titulná snímka prednášky Plane trusses s Warrenovým priehradovým nosníkom a silami v prútoch, uvoľnený uzol A vedľa svojich dvoch rovníc, všetky sily v prútoch priehradovej konštrukcie s ich tabuľkou a mostné priehradové nosníky typu Pratt, Howe a Warren vedľa seba](/screenshots/plot-example-lecture.webp){.shot-lg}

## Postupne pribúdajúci obrázok {#a-figure-that-builds-up}

Stačia dva súbory. `frame.ts` zostaví a vypočíta konštrukciu:

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Dvojkĺbový rám 6 m × 4 m, 10 kN/m na nosníku a vodorovná sila 15 kN v B. */
export const portalFrame = (): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 }) // IPE 300
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [0, 0, -4]) // z smeruje nadol: 4 m nahor
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

`BuildUp.vue` ju kreslí po etapách. Každá etapa vymenuje vrstvy, ktoré ukazuje, a `reserve` ich rozloží všetky hneď od prvého kliknutia, takže sa každá vrstva objaví na svojom mieste a nič sa neposunie:

```vue [BuildUp.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { StructurePlot, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame'

const props = defineProps<{ step: number }>()

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'], // geometria
  ['nodeLabels', 'members', 'supports'], // konštrukcia
  ['nodeLabels', 'members', 'supports', 'loads'], // jej zaťaženie
  ['members', 'supports', 'loads', 'reactions'], // reakcie
  ['members', 'supports', 'reactions', 'M'], // a ohybový moment
]
const all = [...new Set(stages.flat())] // rozložené od prvého kroku, aby sa neskôr nič neposunulo
const layers = computed(() => stages[Math.min(props.step, stages.length - 1)])

const frame = portalFrame()
</script>

<template>
  <StructurePlot :solver="frame" :layers="layers" :reserve="all" :height="360" />
</template>
```

Vrstva môže aj zmiznúť: posledná etapa vynechá zaťaženie, aby mal moment viac miesta. `:height="360"` udrží obrázok vnútri snímky. Prvky sa pri prvom zobrazení vykreslia od jedného konca k druhému a vrstvy sa objavujú postupne počas pol sekundy. Pri `prefers-reduced-motion` je oboje vypnuté a `:animate="false"` to vypne pre všetkých. Ako animácie spomaliť pre poslucháreň, nájdete v časti [Úprava animácie](/sk/plot/theming#restyling-the-animation).

## V Slidev {#in-slidev}

[Slidev](https://sli.dev) robí prezentácie z Markdownu pomocou Vue, takže v ňom komponent funguje tak, ako je. Nainštalujte knižnice do projektu prezentácie:

```bash
npm install @edubeam/plot @edubeam/fem
```

Súbory `frame.ts` a `BuildUp.vue` dajte do priečinka `components/` prezentácie a v `slides.md` nechajte krok riadiť kliknutiami na snímke:

```md [slides.md]
---
clicks: 4
---

# From geometry to bending moment

<BuildUp :step="$clicks" />
```

`clicks: 4` dá snímke štyri kliknutia a `$clicks` ich počíta od 0. Každé stlačenie šípky ukáže ďalšiu etapu, krok späť ju zase skryje. `slidev export` vytvorí z prezentácie PDF, s `--with-clicks` jednu stranu na každé kliknutie.

## V iných prezentáciách vo Vue {#in-any-vue-slides}

Inde si krok udržiavajte sami:

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

## Výpočet priamo na prednáške {#solve-it-live}

Riešič vypočíta takýto rám za niekoľko milisekúnd, takže na prednáške môžete konštrukciu zmeniť a hneď ju prepočítať. Naviažte zaťaženie na posúvač a zakaždým odovzdajte novo vypočítaný model, ako v časti [Keď sa model zmení](/sk/plot/getting-started#when-the-model-changes).

- **Pohyblivé zaťaženie.** [DiagramStack](/sk/plot/diagram-stack#a-load-the-reader-can-drag) nechá študentov posúvať osamelú silu po nosníku a sledovať, ako sa s ňou mení priečna sila a ohybový moment.
- **Prípady vedľa seba.** Zadajte pevné [`diagramScale`](/sk/plot/structure-plot#several-plots-at-one-scale) a dva obrázky vykreslia momenty v rovnakej mierke, takže väčší moment naozaj vyzerá väčší.
- **Odčítanie hodnôt.** S `hover` stačí ukázať na prvok a na konci poradnice každého priebehu sa vyznačí hodnota: pozrite [Odčítanie hodnôt](/sk/plot/structure-plot#reading-values).

## Obrázky pre Beamer, PowerPoint a Word {#figures-for-beamer-powerpoint-and-word}

Prezentácie v LaTeXe (Beamer) alebo v PowerPointe a skriptá písané vo Worde potrebujú obrázok ako súbor. `structureSvg` zapíše obrázok ako samostatné SVG s pevnými farbami, rozložené rovnako, ako ho rozloží `StructurePlot`. Stačí skript v Node, `frame-svg.ts`, vedľa súboru `frame.ts`:

```ts [frame-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![Dvojkĺbový rám ako samostatný súbor SVG vykreslený pomocou CairoSVG: zaťaženie, reakcie 20 a 40 nahor a 2,3 a 12,7 vodorovne a ohybový moment od −50,7 v C po 29,3 na nosníku](/screenshots/sk/p2p-plot-frame-svg.webp){.shot-lg}

PowerPoint aj Word (2019 a Microsoft 365) vložia SVG tak, ako je. LaTeX ho potrebuje ako PDF: preveďte ho príkazom `cairosvg frame.svg -o frame.pdf` alebo Inkscapom, prípadne to nechajte na `\includesvg` z balíka `svg`. Podrobnosti nájdete v časti [Obrázky pre LaTeX a Word](/sk/plot/exercises#figures-for-latex-and-word) a všetky voľby v časti [Samostatný súbor SVG](/sk/plot/functions#a-standalone-svg-file).

### Postupne pribúdajúci obrázok v Beameri {#a-build-up-in-beamer}

Súbor sa prispôsobí vrstvám, ktoré kreslí, takže súbory zapísané pre každú etapu zvlášť by na seba nelícovali. Odovzdajte `structureSvg` rovnaké `reserve` ako v `BuildUp.vue`, teda všetky vrstvy všetkých etáp, a každý súbor bude mať rovnakú veľkosť a konštrukciu na rovnakom mieste. `frame-stages.ts` zapíše jeden súbor na každú etapu:

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

Preveďte súbory do PDF:

```bash
for i in 1 2 3 4 5; do cairosvg frame-$i.svg -o frame-$i.pdf; done
```

a každému dajte vlastný overlay. Každý súbor obsahuje celú etapu, takže snímka (frame) ukazuje vždy iba jeden z nich, a keďže na seba presne lícujú, vyzerá to, že každé kliknutie pridá vrstvu:

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

V PowerPointe dajte päť súborov na päť po sebe idúcich snímok bez prechodu: každý krok potom vyzerá rovnako ako kliknutie na prednáške.

## Skriptá a podklady {#notes-and-handouts}

- **Skriptá na webe.** VitePress aj Nuxt vykresľujú obrázky pri builde, takže sú v HTML skôr, ako sa spustí akýkoľvek skript: pozrite [Vkladanie do stránok](/sk/plot/embedding).
- **Tlačené skriptá.** Zapíšte obrázky pomocou `structureSvg` do stránky HTML a vytlačte ju, ako to robí [skript na tlač písomiek](/sk/plot/exercises#print-a-test), alebo vložte súbory do LaTeXu či Wordu.
- **Jeden model pre všetky obrázky.** Ten istý `frame.ts` slúži snímkam, skriptám aj zadaniu príkladu, takže si nikdy neodporujú.
