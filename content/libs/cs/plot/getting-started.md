---
title: Začínáme
description: "Instalace @edubeam/plot, vykreslení nosníku spočteného v @edubeam/fem se zatížením, reakcemi a ohybovým momentem ve Vue 3, překreslení po změně a export do SVG."
order: 1
group: Úvod
---

# Začínáme

@edubeam/plot vykreslí rovinný nosník, rám nebo příhradovou konstrukci i s výsledky jako SVG: prvky, podpory, zatížení, reakce, průběhy N, V a M a deformovaný tvar, přesně tak, jak vypadají obrázky na tomto webu. Předáte jí model spočtený řešičem [@edubeam/fem](/cs/solver), na kterém stojí [EduBeam]{.edubeam}, a knihovna sama zvolí rozvržení, měřítko i místo pro každé číslo.

Učitelé ji používají pro [příklady a písemky](/cs/plot/exercises) generované ze seedu (počáteční hodnoty generátoru náhodných čísel), pro [prezentace](/cs/plot/slides), v nichž obrázek přibývá s každým kliknutím, a pro obrázky do skript, ať už na webové stránce, nebo jako soubory pro LaTeX a Word. Jsou na ní postavené i stránky [Procvičování](/cs/practice) a [Generátor písemek](/cs/exam) na tomto webu.

::div{.actions}
[Nakreslete první obrázek](#draw-a-solved-model) [Generujte příklady](/cs/plot/exercises)
::

## Instalace {#install}

```bash
npm install @edubeam/plot @edubeam/fem vue
```

Vue 3.5 nebo novější a řešič jsou peer dependencies, takže vaše aplikace má od každého jen jednu kopii. Balíček je čistě ESM, obsahuje vlastní typy a nepotřebuje žádný soubor se styly. Běží v Node 20.19 a novějším; pokud chcete skript v TypeScriptu spouštět přímo, příkazem `node script.ts`, potřebujete Node 22.18 nebo novější.

## Vykreslení spočteného modelu {#draw-a-solved-model}

Stačí dva soubory. První, `beams.ts`, sestaví a spočte nosník v @edubeam/fem. Je to obyčejná funkce, takže stejný model může posloužit stránce, prezentaci i skriptu:

```ts [beams.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Spočtený prostý nosník o rozpětí `span` m zatížený `q` kN/m. Řešič pracuje v jednotkách SI. */
export const simpleBeam = (span: number, q: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 }) // ocel, Pa
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 }) // IPE 200, ve smyku tuhý
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // kloub
  domain.createNode('B', [span, 0, 0], [DofID.Dz]) // posuvný kloub
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true) // N/m, +z míří dolů
  solver.solve()
  return solver
}
```

Druhý, `BeamFigure.vue`, předá řešič komponentě `StructurePlot` a určí, co se má vykreslit:

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

To je celý obrázek: nosník na podporách, zatížení 12 kN/m, obě reakce 36 kN a ohybový moment, uprostřed rozpětí $qL^2/8 = 54$ kNm, vykreslený na tažené straně:

::model-figure{caption="Co vykreslí BeamFigure.vue: rozpětí 6 m, zatížení 12 kN/m"}
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

Obrázek vyplní šířku svého kontejneru a výšku si určí sám. Text, značky a tloušťky čar si drží velikost v pixelech bez ohledu na velikost konstrukce, takže obrázek zůstane čitelný i na telefonu. Když `layers` vynecháte, zvolí obrázek výsledek sám: M pro nosníky a rámy, N pro příhradovou konstrukci. Přehled všech [vrstev](/cs/plot/structure-plot#layers) najdete na stránce `StructurePlot`, sestavování modelů popisuje [dokumentace řešiče](/cs/solver/getting-started).

## Když se model změní {#when-the-model-changes}

Obrázek si přečte řešič, který dostane, ale jeho změny nesleduje. Když se něco změní, spočtěte model znovu a předejte nový řešič. Přesně to udělá `computed`:

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

Takový nosník se spočte zhruba za milisekundu, takže obrázek plynule sleduje pohyb posuvníku. Změnili jste místo toho přímo stávající řešič? Zvyšte hodnotu prop `revision` a obrázek si ho přečte znovu.

::callout{type="tip" title="Řešiče nedávejte do hluboké reaktivity"}
`computed`, prop nebo obyčejná `const` drží řešič tak, jak je. Pokud ho chcete mít ve stavu komponenty, použijte `shallowRef` nebo ho obalte funkcí `markRaw`: obyčejný `ref` by Vue zbytečně nutil projít celý řešič a udělat ho reaktivním.
::

## Uložení do souboru {#save-it-as-a-file}

Pro obrázek do LaTeXu, Wordu nebo Inkscapu zapíše `structureSvg` stejný výkres jako samostatný soubor SVG s pevnými barvami. Nepotřebuje Vue ani prohlížeč, jen Node. Uložte tento skript jako `beam-svg.ts` vedle `beams.ts`:

```ts [beam-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { simpleBeam } from './beams.ts'

const svg = structureSvg(modelFromSolver(simpleBeam(6, 12)), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
})
writeFileSync('beam.svg', svg)
```

Spusťte ho příkazem `node beam-svg.ts` (Node 22.18 a novější; ve starších verzích `npx tsx beam-svg.ts`). Možnosti funkce a postup, jak soubor vložit do LaTeXu a Wordu, najdete v části [Samostatný soubor SVG](/cs/plot/functions#a-standalone-svg-file).

## Obrázek s průběhy pod sebou {#the-stacked-figure}

`DiagramStack` kreslí obrázek, který najdete v každé učebnici statiky: přímý nosník se zatížením a pod ním na společné ose x průběhy V(x), M(x) a w(x). S `v-model:load-at` může čtenář posouvat osamělou sílu po nosníku a sledovat, jak se průběhy mění:

```vue
<DiagramStack v-model:load-at="at" :solver="solveWithLoadAt(at)" />
```

Celý příklad je na stránce [DiagramStack](/cs/plot/diagram-stack).

## Použití v celé aplikaci {#use-it-everywhere}

Pokud chcete obě komponenty zaregistrovat globálně, místo abyste je importovali tam, kde je používáte:

```ts [main.ts]
import { createApp } from 'vue'
import { EduBeamPlot } from '@edubeam/plot'
import App from './App.vue'

createApp(App).use(EduBeamPlot).mount('#app') // <StructurePlot> a <DiagramStack> v každé šabloně
```

Pojmenované importy udrží bundle menší: stránka, která importuje jen `StructurePlot`, nedostane ani `DiagramStack`, ani plugin. Obě komponenty se vykreslí i na serveru, v Nuxtu nebo VitePressu, viz [Vkládání do stránek](/cs/plot/embedding).

## Kam dál {#next}

::card-grid{cols="2"}
:::card{title="Příklady a písemky" icon="lucide:dices" to="/cs/plot/exercises"}
Pro každého studenta jiný příklad ze seedu, s klíčem řešení, k tisku nebo jako soubory pro LaTeX.
:::
:::card{title="Prezentace a skripta" icon="lucide:presentation" to="/cs/plot/slides"}
Obrázky, které přibývají s každým kliknutím ve Slidevu, Vue nebo Beameru, a tytéž obrázky do skript.
:::
:::card{title="StructurePlot" icon="lucide:frame" to="/cs/plot/structure-plot"}
Vrstvy, kóty, náhledy, velikosti, jednotky a odečítání hodnot ukazatelem.
:::
:::card{title="DiagramStack" icon="lucide:rows-3" to="/cs/plot/diagram-stack"}
Nosník nad průběhy V, M a w se zatížením, které může čtenář posouvat.
:::
::
