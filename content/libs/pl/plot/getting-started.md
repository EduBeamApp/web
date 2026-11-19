---
title: Pierwsze kroki
description: "Instalacja @edubeam/plot, rysunek belki obliczonej przez @edubeam/fem z obciążeniem, reakcjami i momentem zginającym w Vue 3, odświeżanie i zapis do SVG."
order: 1
group: Wprowadzenie
source: site
---

# Pierwsze kroki

Biblioteka graficzna @edubeam/plot rysuje płaską belkę, ramę lub kratownicę wraz z wynikami jako SVG: pręty, podpory, obciążenia, reakcje, wykresy N, V i M oraz postać odkształconą, dokładnie tak, jak wyglądają rysunki na tej stronie. Przekazujesz jej model obliczony przez [@edubeam/fem](/pl/solver), solver, na którym działa [EduBeam]{.edubeam}, a ona sama dobiera układ rysunku, skalę i miejsce dla każdej liczby.

Prowadzący zajęcia używają jej do [zadań i kolokwiów](/pl/plot/exercises) generowanych na podstawie ziarna generatora liczb losowych, do [slajdów](/pl/plot/slides), na których rysunek rozbudowuje się z każdym kliknięciem, oraz do rysunków w materiałach do wykładu – na stronie internetowej albo jako pliki dla LaTeX-a i Worda. Z jej pomocą powstały też strony [Zadania ze statyki](/pl/practice) i [generator kolokwiów](/pl/exam) w tej witrynie.

::div{.actions}
[Pierwszy rysunek](#draw-a-solved-model) [Generuj zadania](/pl/plot/exercises)
::

## Instalacja {#install}

```bash
npm install @edubeam/plot @edubeam/fem vue
```

Vue 3.5 lub nowsze oraz solver są zależnościami typu peer (peer dependencies), więc aplikacja ma tylko po jednej kopii każdego z nich. Pakiet jest wyłącznie w formacie ESM, zawiera własne typy i nie wymaga arkusza stylów. Działa w Node 20.19 lub nowszym; aby uruchamiać skrypt napisany w TypeScripcie bezpośrednio, poleceniem `node script.ts`, potrzebujesz Node 22.18 lub nowszego.

## Rysunek obliczonego modelu {#draw-a-solved-model}

Wystarczą dwa pliki. Pierwszy, `beams.ts`, buduje i oblicza belkę za pomocą @edubeam/fem. To zwykła funkcja, więc ten sam model może posłużyć stronie, slajdowi i skryptowi:

```ts [beams.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Obliczona belka swobodnie podparta o rozpiętości `span` m pod obciążeniem `q` kN/m. Solver pracuje w jednostkach SI. */
export const simpleBeam = (span: number, q: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 }) // stal, Pa
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 }) // IPE 200, bez odkształceń postaciowych
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // podpora przegubowa nieprzesuwna
  domain.createNode('B', [span, 0, 0], [DofID.Dz]) // podpora przegubowa przesuwna
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true) // N/m, +z w dół
  solver.solve()
  return solver
}
```

Drugi, `BeamFigure.vue`, przekazuje solver komponentowi `StructurePlot` i określa, co narysować:

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

To cały rysunek: belka na podporach, obciążenie 12 kN/m, dwie reakcje po 36 kN i moment zginający, w środku rozpiętości $qL^2/8 = 54$ kNm, odłożony po stronie rozciąganej:

::model-figure{caption="Co rysuje BeamFigure.vue: przęsło 6 m pod obciążeniem 12 kN/m"}
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

Rysunek wypełnia szerokość swojego kontenera i sam ustala wysokość. Tekst, symbole i grubości linii zachowują rozmiar w pikselach niezależnie od wielkości konstrukcji, więc rysunek pozostaje czytelny nawet na telefonie. Jeśli pominiesz `layers`, rysunek sam wybierze wynik: M dla belek i ram, N dla kratownicy. Wszystkie [warstwy](/pl/plot/structure-plot#layers) opisuje strona `StructurePlot`, a budowanie modeli – [dokumentacja solvera](/pl/solver/getting-started).

## Gdy model się zmienia {#when-the-model-changes}

Rysunek odczytuje solver, który dostał, ale nie śledzi jego zmian. Gdy coś się zmieni, oblicz model ponownie i przekaż nowy solver. Dokładnie to robi `computed`:

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

Obliczenie takiej belki trwa około milisekundy, więc rysunek nadąża za przesuwanym suwakiem. Jeśli zamiast tego zmieniasz istniejący solver w miejscu, zwiększ wartość propa `revision`, a rysunek odczyta go ponownie.

::callout{type="tip" title="Trzymaj solver z dala od głębokiej reaktywności"}
`computed`, prop albo zwykła stała `const` przechowuje solver bez zmian. Aby trzymać go w stanie komponentu, użyj `shallowRef` albo opakuj go w `markRaw`: zwykły `ref` kazałby Vue niepotrzebnie przechodzić przez cały solver, żeby uczynić go reaktywnym.
::

## Zapis do pliku {#save-it-as-a-file}

Na potrzeby LaTeX-a, Worda lub Inkscape'a `structureSvg` zapisuje ten sam rysunek jako samodzielny plik SVG ze zwykłymi kolorami. Nie potrzebuje ani Vue, ani przeglądarki, tylko Node. Zapisz ten skrypt jako `beam-svg.ts` obok `beams.ts`:

```ts [beam-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { simpleBeam } from './beams.ts'

const svg = structureSvg(modelFromSolver(simpleBeam(6, 12)), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
})
writeFileSync('beam.svg', svg)
```

Uruchom go poleceniem `node beam-svg.ts` (Node 22.18 lub nowszy; w starszych wersjach `npx tsx beam-svg.ts`). Opcje oraz sposób wstawienia pliku do LaTeX-a i Worda opisuje sekcja [Samodzielny plik SVG](/pl/plot/functions#a-standalone-svg-file).

## Wykresy pod belką {#the-stacked-figure}

`DiagramStack` tworzy rysunek znany z każdego podręcznika statyki: prostą belkę z obciążeniem, a pod nią, na wspólnej osi x, wykresy V(x), M(x) i w(x). Dzięki `v-model:load-at` czytelnik może przesuwać siłę skupioną wzdłuż belki i patrzeć, jak zmieniają się wykresy:

```vue
<DiagramStack v-model:load-at="at" :solver="solveWithLoadAt(at)" />
```

Pełny przykład jest na stronie [DiagramStack](/pl/plot/diagram-stack).

## W całej aplikacji {#use-it-everywhere}

Aby zarejestrować oba komponenty globalnie, zamiast importować je tam, gdzie ich używasz:

```ts [main.ts]
import { createApp } from 'vue'
import { EduBeamPlot } from '@edubeam/plot'
import App from './App.vue'

createApp(App).use(EduBeamPlot).mount('#app') // <StructurePlot> i <DiagramStack> w każdym szablonie
```

Importy nazwane dają mniejszy bundle: strona, która importuje tylko `StructurePlot`, nie dostaje ani `DiagramStack`, ani pluginu. Oba komponenty renderują się także na serwerze, w Nuxcie lub VitePressie: zob. [Osadzanie](/pl/plot/embedding).

## Co dalej {#next}

::card-grid{cols="2"}
:::card{title="Zadania i kolokwia" icon="lucide:dices" to="/pl/plot/exercises"}
Inne zadanie dla każdego studenta, wygenerowane z ziarna, z kluczem odpowiedzi, do druku lub jako pliki dla LaTeX-a.
:::
:::card{title="Slajdy i materiały" icon="lucide:presentation" to="/pl/plot/slides"}
Rysunki rozbudowywane kliknięcie po kliknięciu w Slidevie, Vue lub Beamerze i te same rysunki w materiałach do wykładu.
:::
:::card{title="StructurePlot" icon="lucide:frame" to="/pl/plot/structure-plot"}
Warstwy, wymiary, miniatury, rozmiary, jednostki i odczyt wartości kursorem.
:::
:::card{title="DiagramStack" icon="lucide:rows-3" to="/pl/plot/diagram-stack"}
Belka nad wykresami V, M i w z obciążeniem, które czytelnik może przesuwać.
:::
::
