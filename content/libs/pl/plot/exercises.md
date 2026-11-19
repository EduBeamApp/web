---
title: Zadania i kolokwia
description: "Inne zadanie ze statyki dla każdego studenta, generowane z ziarna przez @edubeam/fem i @edubeam/plot, z poprawnym kluczem: na stronie, w druku lub jako SVG."
order: 5
group: Zastosowania
source: site
---

# Zadania i kolokwia

Zapisz konstrukcję raz, jako funkcję ziarna generatora liczb losowych, a będziesz mieć zadanie dla każdego studenta na każdy tydzień, każde z kluczem odpowiedzi, który zawsze się zgadza: @edubeam/fem rozwiązuje zadanie, a @edubeam/plot rysuje treść i klucz z tego samego modelu.

Kliknij poniżej **Nowe zadanie**. Każde kliknięcie to nowe ziarno: zadanie jest generowane, obliczane i rysowane w Twojej przeglądarce.

::exercise-generator
::

Ten pokaz rysuje zadania z dwóch stron tej witryny, zbudowanych z elementów opisanych poniżej. Na stronie [Zadania ze statyki](/pl/practice) student wpisuje reakcje i największy moment lub siłę w pręcie i od razu sprawdza, czy są poprawne. [Generator kolokwiów](/pl/exam) drukuje dla każdego studenta inną wersję kolokwium z kluczem odpowiedzi, a rysunki zapisuje jako pliki SVG, odpowiedzi zaś jako CSV. Wypróbuj je, zanim napiszesz własny generator.

## Jak to działa {#how-it-works}

1. **Ziarno wybiera liczby.** Generator liczb losowych z ziarnem daje dla tego samego ziarna zawsze to samo zadanie, więc z ziarna wydrukowanego na arkuszu zawsze odtworzysz jego klucz.
2. **Solver oblicza klucz.** @edubeam/fem rozwiązuje każdą konstrukcję, więc reakcje i momenty pochodzą z solvera, a nie ze wzoru, w którym łatwo o pomyłkę.
3. **@edubeam/plot rysuje jedno i drugie.** Treść zadania pokazuje konstrukcję z etykietami węzłów, wymiarami i nazwami niewiadomych reakcji; klucz podaje wartości reakcji i dodaje wykres.

Od tego miejsca do wydrukowanego kolokwium prowadzi kilka krótkich plików: [generator](#the-generator), [komponent](#the-exercise-in-a-page) na stronę internetową i [skrypt](#print-a-test), który drukuje kolokwium albo [zapisuje rysunki](#figures-for-latex-and-word) dla LaTeX-a i Worda. Skopiuj je do projektu, w którym masz [zainstalowane biblioteki](/pl/plot/getting-started#install); skrypty uruchomisz poleceniem `node` od wersji 22.18, a w starszych wersjach przez `npx tsx`.

## Generator {#the-generator}

Jeden moduł, `exercise.ts`, zamienia ziarno w zadanie: belkę na podporze przegubowej nieprzesuwnej i przesuwnej, w połowie przypadków ze wspornikiem obciążonym siłą skupioną na końcu. Obie wersje są statycznie wyznaczalne, więc każde ziarno da się rozwiązać ręcznie równie dobrze jak solverem.

```ts [exercise.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { extremes, modelFromSolver, type PlotModel } from '@edubeam/plot'

export interface Exercise {
  readonly seed: number
  readonly statement: string
  /** Obliczona konstrukcja jako zwykłe dane: rysuje się z niej treść zadania i klucz */
  readonly model: PlotModel
  /** Reakcje podporowe, dodatnie w górę, N, i ekstremalne momenty zginające, N·m */
  readonly key: { RA: number; RB: number; mMax: number; mMin: number }
}

/** mulberry32: mały generator z ziarnem, więc ziarno na zawsze oznacza to samo zadanie */
const random = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), seed | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export const makeExercise = (seed: number): Exercise => {
  const r = random(seed)
  const pick = <T>(xs: readonly T[]): T => xs[Math.floor(r() * xs.length)]
  const int = (lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1))

  // Przęsło na podporze przegubowej nieprzesuwnej i przesuwnej, w połowie przypadków ze wspornikiem: statycznie wyznaczalne, więc zawsze rozwiązywalne
  const L = pick([4, 5, 6]) // m
  const c = pick([0, 0, 1, 1.5, 2]) // m, długość wspornika
  const q = int(4, 12) // kN/m na przęśle
  const F = int(2, 6) * 5 // kN na końcu wspornika albo w odległości `a` od A, gdy wspornika nie ma
  const a = int(1, L - 1) // m

  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  if (c > 0) {
    domain.createNode('C', [L + c, 0, 0])
    domain.createBeam2D(2, ['B', 'C'], 1, 1)
    lc.createNodalLoad('C', { [DofID.Dz]: F * 1e3 })
  } else {
    lc.createBeamConcentratedLoad(1, [0, F * 1e3, 0, a], true)
  }
  solver.solve()

  const statement =
    c > 0
      ? `Span L = ${L} m with an overhang c = ${c} m. q = ${q} kN/m on the span, F = ${F} kN at the tip C.`
      : `Span L = ${L} m. q = ${q} kN/m over the span, F = ${F} kN at ${a} m from A.`

  // Klucz z obliczonego modelu: reakcje (z skierowana w dół, więc w górę to minus) i dokładne ekstrema M
  const model = modelFromSolver(solver)
  const { reactions, members } = model.results!
  const up = (node: string) => -(reactions.find((x) => x.node === node && x.dof === 'dz')?.value ?? 0)
  const m = Object.values(members).flatMap((member) => extremes(member.M) ?? [])
  const mMax = Math.max(...m.map((e) => e.max.value))
  const mMin = Math.min(...m.map((e) => e.min.value))

  return { seed, statement, model, key: { RA: up('A'), RB: up('B'), mMax, mMin } }
}
```

`modelFromSolver` przepisuje obliczoną konstrukcję do [modelu rysunku](/pl/plot/model): zwykłych danych z reakcjami i wynikami każdego pręta w postaci dokładnych wielomianów, więc `extremes` znajduje największe momenty bez próbkowania. Zadanie przechowuje tylko ten model; solver nie jest już potrzebny.

Ziarno 5 daje treść *„Span L = 6 m with an overhang c = 1.5 m. q = 5 kN/m on the span, F = 25 kN at the tip C.”* Jej klucz: $R_A = (5 \cdot 6 \cdot 3 - 25 \cdot 1{,}5)/6 = 8{,}75$ kN, $R_B = 5 \cdot 6 + 25 - 8{,}75 = 46{,}25$ kN, nad podporą $M_B = -25 \cdot 1{,}5 = -37{,}5$ kNm, a w przęśle, tam gdzie siła tnąca jest równa zeru, $M = 8{,}75^2/(2 \cdot 5) = 7{,}66$ kNm. Solver zgadza się co do ostatniej cyfry.

## Na stronie internetowej {#the-exercise-in-a-page}

Komponent `ExerciseCard.vue` rysuje treść zadania, a z `answers` klucz:

```vue [ExerciseCard.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { formatQuantity, KN_UNITS, StructurePlot, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise'

const props = defineProps<{ seed: number; answers?: boolean }>()
const exercise = computed(() => makeExercise(props.seed))

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']
const twoDecimals = new Intl.NumberFormat('en', { maximumFractionDigits: 2 })
const kN = (si: number) => formatQuantity(si, KN_UNITS.force, twoDecimals)
const kNm = (si: number) => formatQuantity(si, KN_UNITS.moment, twoDecimals)
</script>

<template>
  <article>
    <h3>Exercise {{ seed }}</h3>
    <p>{{ exercise.statement }} Find the reactions and draw the bending moment diagram.</p>
    <StructurePlot
      :model="exercise.model"
      :layers="answers ? key : sheet"
      :reserve="[...sheet, ...key]"
      :reaction-labels="answers ? 'values' : 'names'"
      :reserve-reaction-labels="['names', 'values']"
    />
    <p v-if="answers">
      R<sub>A</sub> = {{ kN(exercise.key.RA) }}, R<sub>B</sub> = {{ kN(exercise.key.RB) }},
      M from {{ kNm(exercise.key.mMin) }} to {{ kNm(exercise.key.mMax) }}
    </p>
  </article>
</template>
```

```vue
<ExerciseCard :seed="5" />
<ExerciseCard :seed="5" answers />
```

Druga karta kończy się tekstem *R<sub>A</sub> = 8.75 kN, R<sub>B</sub> = 46.25 kN, M from −37.5 kNm to 7.66 kNm*. `formatQuantity` dopisuje jednostkę i prawdziwy znak minus, tak jak rysunek.

W treści zadania `reaction-labels="names"` rysuje reakcje jako niewiadome: strzałkę dla każdego kierunku, który blokuje podpora, zwróconą w stronę dodatnią (w prawo, w górę, przeciwnie do ruchu wskazówek zegara), z nazwą *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>* zamiast wartości. Znak każdej odpowiedzi jest wtedy określony na rysunku: reakcja działająca w przeciwną stronę jest ujemna. Klucz podaje wartości.

`reserve` od początku rozmieszcza warstwy obu widoków, więc gdy włączysz `answers`, np. przyciskiem *Pokaż rozwiązanie* do samodzielnej nauki, wykres pojawia się płynnie na swoim miejscu ([Rysunki rozbudowywane etapami](/pl/plot/structure-plot#figures-that-build-up)). `reserve-reaction-labels` robi to samo dla reakcji, więc belka się nie przesuwa, gdy ich nazwy zamieniają się w wartości: zob. [Reakcje jako niewiadome](/pl/plot/structure-plot#reactions-as-unknowns).

## Wydrukowane kolokwium {#print-a-test}

Na kolokwium pisemne skrypt Node, `print-test.ts`, zapisuje po jednej stronie na studenta, a za nimi klucze. `structureSvg` zamienia każdy model w tekst SVG, więc skrypt nie potrzebuje ani Vue, ani przeglądarki:

```ts [print-test.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const students = ['Ada', 'Ben', 'Cleo']
const exercises = students.map((_, i) => makeExercise(1000 + i)) // ziarna 1000, 1001, …

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']
const task = 'Find the reactions and draw the bending moment diagram.'

const pages = [
  ...exercises.map((e, i) => `<h2>${students[i]}, exercise ${e.seed}</h2>
    <p>${e.statement} ${task}</p>${structureSvg(e.model, { layers: sheet, reactionLabels: 'names' })}`),
  ...exercises.map((e) => `<h2>Key, exercise ${e.seed}</h2>
    ${structureSvg(e.model, { layers: key })}`),
]

const style = `body { font: 15px/1.5 system-ui, sans-serif; max-width: 640px; margin: 2rem auto }
  section { break-after: page }`
writeFileSync('test.html', `<!doctype html><meta charset="utf-8"><title>Test</title>
  <style>${style}</style>${pages.map((page) => `<section>${page}</section>`).join('\n')}`)
```

```bash
node print-test.ts
```

Otwórz `test.html` w przeglądarce i wydrukuj albo zapisz jako PDF: zadanie każdego studenta i każdy klucz dostają osobną stronę. Strona Ady i jej klucz:

![Zadanie 1000: przęsło 6 m ze wspornikiem 2 m, 10 kN/m na przęśle i 30 kN na końcu wspornika, niewiadome reakcje nazwane A_x, A_z i B_z oraz wymiary łańcuchowe 6 m i 2 m z wymiarem całkowitym 8 m; pod spodem klucz z reakcjami 20 i 70 oraz momentem zginającym od −60 nad podporą do 20 w przęśle](/screenshots/pl/p2p-plot-exercise-sheet.webp){.shot-lg}

Warstwa `dimensions` podaje każdy odcinek i długość całkowitą, jak w treści zadania, a `reactionLabels: 'names'` nazywa niewiadome, każdą strzałką zwróconą w stronę, w którą odpowiedź liczy się jako dodatnia. W kluczu reakcje i wartości na wykresie są samymi liczbami w kN i kNm, tak jak w aplikacji EduBeam: jeśli studenci tego potrzebują, napisz to w nagłówku klucza. Do kopiowania na czarno-białej kserokopiarce przekaż `colors` z każdym tonem ustawionym na czarny: zob. [Czarno-biało](/pl/plot/theming#black-and-white).

## Rysunki dla LaTeX-a i Worda {#figures-for-latex-and-word}

Jeśli przygotowujesz kolokwia w LaTeX-u lub Wordzie, zapisz zamiast tego rysunki jako pliki i zachowaj własny szablon. `figures.ts` zapisuje treść zadania i klucz dla 30 ziaren:

```ts [figures.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']

for (let seed = 1000; seed < 1030; seed++) {
  const { model } = makeExercise(seed)
  writeFileSync(`exercise-${seed}.svg`, structureSvg(model, { layers: sheet, reactionLabels: 'names' }))
  writeFileSync(`exercise-${seed}-key.svg`, structureSvg(model, { layers: key }))
}
```

Uruchom go poleceniem `node figures.ts`: to 60 plików dla 30 studentów, każdy jako zwykły SVG ze stałymi kolorami, bez CSS i bez skryptów.

- **Word** (2019 i Microsoft 365) wstawia SVG bez konwersji: *Wstawianie › Obrazy*.
- **LaTeX** dołącza PDF, a nie SVG. Przekonwertuj plik raz, za pomocą [CairoSVG](https://cairosvg.org) (`cairosvg exercise-1000.svg -o exercise-1000.pdf`) lub Inkscape'a, a potem użyj `\includegraphics[width=\linewidth]{exercise-1000.pdf}`. Polecenie `\includesvg` z pakietu `svg` wykona konwersję za Ciebie, jeśli masz zainstalowany Inkscape.

Rysunek ma szerokość 640 jednostek i tekst o wysokości 13 jednostek, więc przy szerokości kolumny tekstu na arkuszu A4, około 16 cm, jego etykiety mają 9 pt. Ustaw `fontFamily` na czcionkę używaną w dokumencie: wszystkie opcje opisuje sekcja [Samodzielny plik SVG](/pl/plot/functions#a-standalone-svg-file).

## Dostosuj do siebie {#make-it-your-own}

- **Więcej rodzajów konstrukcji.** Dodaj kolejne przypadki: wspornik, belkę ciągłą dwuprzęsłową, ramę portalową, kratownicę. Pokaz na początku strony wybiera spośród ośmiu rodzajów, od belki swobodnie podpartej po ramę trójprzegubową, kratownicę Warrena i ramę portalową.
- **Zadania statycznie niewyznaczalne.** Solver radzi sobie z nimi równie dobrze; dłuższe staje się tylko rozwiązanie ręczne.
- **Okrągłe liczby.** Losuj obciążenia i długości z krótkich list, jak powyżej, a klucz wyjdzie tak okrągły, jak chcesz. Przejdź w pętli przez kilkaset ziaren i pomiń te, których klucz ma więcej miejsc po przecinku, niż chcesz.
- **Ochrona przed mechanizmami.** Generator, który może źle rozmieścić podpory, powinien obliczać model wewnątrz `try` i pomijać ziarna, przy których zgłoszony zostanie wyjątek: zob. [Gdy obliczenia się nie udają](/pl/solver/solving#when-solving-fails).
- **Więcej pytań.** Narysuj siłę tnącą (`'V'`), ugięcie (`'w'`, z wartościami z [`getUnknowns`](/pl/solver/results#displacements)) albo siłę normalną w pręcie pochyłym.
