---
title: StructurePlot
description: "Belka, rama lub kratownica w StructurePlot: warstwy, rysunki rozbudowywane etapami, niewiadome reakcje, miniatury, rozmiar, jednostki i odczyt wartości."
order: 2
group: Komponenty
source: site
---

# StructurePlot

`StructurePlot` rysuje całą konstrukcję dopasowaną do szerokości swojego kontenera: pręty, przeguby, podpory, obciążenia, reakcje, wykresy N, V i M oraz postać odkształconą. Przekaż mu solver albo [zwykły model](/pl/plot/model) utworzony z solvera i określ, co ma narysować.

```vue
<StructurePlot :solver="solver" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

Każdy prop, z typem i wartością domyślną, opisuje [API komponentów](/pl/plot/components#structureplot).

Poniższy rysunek to `StructurePlot` z włączonymi `nodeLabels` i `dimensions`, ustawionym `hover` i formatem liczb tej witryny, czyli czterema cyframi znaczącymi: przełączaj wyniki i wskaż pręt kursorem, aby odczytać jego wartości.

::model-figure{caption="Rama portalowa: podpory przegubowe u podstawy słupów, 10 kN/m na ryglu, 15 kN w węźle B"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: pin, D: pin }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
  - { node: B, fx: 15 }
results: [M, V, N, w]
show: [nodeLabels, dimensions]
---
::

## Warstwy {#layers}

Rysunek składa się z warstw rysowanych zawsze w tej samej kolejności, niezależnie od kolejności, w jakiej je wymienisz:

| Warstwa | Rysuje |
| --- | --- |
| `members` | pręty, z przegubami jako małymi kółkami |
| `supports` | symbol każdej podpory, obrócony przy podporach ukośnych |
| `loads` | obciążenia węzłowe i obciążenia prętów, obciążenia termiczne i osiadania podpór, wraz z wartościami |
| `reactions` | reakcje jako strzałki proste i łukowe z wartościami albo, z `reactionLabels: 'names'`, jako [nazwane niewiadome](#reactions-as-unknowns) zadania |
| `nodes` | każdy węzeł jako małe kółko |
| `nodeLabels` | etykiety węzłów |
| `dimensions` | wymiary łańcuchowe, jak w treści zadania: każdy odcinek między węzłami i siłami skupionymi pod konstrukcją, każda kondygnacja z jej prawej strony, a wymiar całkowity w drugim rzędzie |
| `N`, `V`, `M` | wykresy siły normalnej, siły tnącej i momentu zginającego |
| `w` | postać odkształcona |

Jeśli pominiesz `layers`, rysunek pokaże pręty, podpory, obciążenia i reakcje oraz jeden wynik dobrany do konstrukcji: `M` dla belek i ram, `N` dla kratownicy, a `w`, gdy nic nie przenosi sił, jak w belce, która może się swobodnie wydłużać pod obciążeniem termicznym.

Wykresy wyglądają tak jak w aplikacji EduBeam: N i V są kreskowane w poprzek pręta, a M jest odkładany po stronie rozciąganej, więc moment dodatni (rozciągający włókna dolne) leży pod belką. `:moment-on-tension-side="false"` rysuje M po stronie ściskanej. Kratownica pokazuje siłę w każdym pręcie jeden raz, wzdłuż pręta, w kolorze zależnym od znaku.

## Rysunki rozbudowywane etapami {#figures-that-build-up}

`reserve` wymienia warstwy, dla których trzeba zostawić miejsce, choć są ukryte. Rysunek od początku rozmieszcza każdą zarezerwowaną warstwę, więc gdy ją włączysz, pojawia się płynnie na swoim miejscu, a nic innego się nie przesuwa:

```vue
<script setup lang="ts">
import type { PlotLayer } from '@edubeam/plot'

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'],
  ['nodeLabels', 'members', 'supports'],
  ['nodeLabels', 'members', 'supports', 'loads'],
  ['members', 'supports', 'loads', 'reactions'],
  ['members', 'supports', 'reactions', 'M'],
]
const all = [...new Set(stages.flat())]
// `frame` to obliczony solver, a `step` bieżący etap: cały komponent jest na stronie Slajdy i materiały
</script>

<template>
  <StructurePlot :solver="frame" :layers="stages[step]" :reserve="all" />
</template>
```

Z `animate`, domyślnie włączonym, warstwy pojawiają się płynnie, a pręty rysują się od jednego końca do drugiego. Przy `prefers-reduced-motion` nic się nie animuje. Strona [Slajdy i materiały do wykładu](/pl/plot/slides) wstawia ten rysunek do prezentacji.

## Wartości na wykresach {#diagram-values}

Każda wartość stoi tuż za końcem rzędnej, do której należy, tak jak opisuje się wykres w podręczniku: na każdym niezerowym końcu pręta, w ekstremach pomiędzy nimi, po obu stronach skoku i raz w sztywnym narożu. Wartości są samymi liczbami w jednostce wyświetlania (kN dla N i V, kNm dla M), podobnie jak reakcje, tak jak w aplikacji EduBeam; jednostki pojawiają się tylko przy wielkościach zadanych: obciążeniach, osiadaniach i zmianach temperatury. Etykieta, która nachodziłaby na inną etykietę, pręt lub strzałkę, próbuje innych miejsc przy tym samym końcu rzędnej, a jeśli żadne nie jest wolne, zostaje pominięta, więc dwie liczby nigdy nie leżą jedna na drugiej. Wartości obciążeń i reakcji są rozmieszczane jako pierwsze, więc liczby wykresów nigdy ich nie wypychają. Sił w prętach kratownicy nigdy się nie pomija: przesuwają się wzdłuż pręta, przechodzą na drugą stronę, a w ostateczności zmniejszają się.

`result-label-mode="axis"` obraca wartości wzdłuż ich rzędnych, tak jak zapisuje je aplikacja EduBeam. Jeśli czytelnik może przełączać się między oboma trybami, podaj `:reserve-label-modes="['horizontal', 'axis']"`, a rysunek nie przesunie się przy przełączeniu.

## Reakcje jako niewiadome {#reactions-as-unknowns}

W zadaniu trzeba wyznaczyć reakcje, więc rysunek powinien je pokazać bez wartości. `reaction-labels="names"` rysuje strzałkę dla każdego kierunku, który blokuje podpora, zwróconą w stronę dodatnią: wzdłuż osi x węzła (w prawo, o ile podpora nie jest obrócona), w górę oraz przeciwnie do ruchu wskazówek zegara dla momentu utwierdzenia. Każda nosi nazwę od swojego węzła, *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>*, zapisaną kursywą i z prawdziwym indeksem dolnym. Znak każdej odpowiedzi jest wtedy określony na rysunku: reakcja działająca w przeciwną stronę jest ujemna.

```vue
<StructurePlot
  :model="model"
  :layers="['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']"
  reaction-labels="names"
/>
```

![U góry belka jednostronnie utwierdzona jako treść zadania: utwierdzenie w A, podpora przegubowa przesuwna w B, 40 kN w środku rozpiętości, wymiary łańcuchowe 3 m i 3 m z wymiarem całkowitym 6 m oraz reakcje narysowane jako nazwane strzałki A_x, A_z, M_A i B_z. U dołu ta sama belka z domyślnymi etykietami reakcji: 27,5 i 12,5 w górę, moment utwierdzenia 45 i moment zginający od −45 przy utwierdzeniu do 37,5 pod siłą](/screenshots/pl/p4-plot-reaction-names.webp){.shot-lg}

Nazwy nie wymagają wyników, więc jako treść zadania można narysować model, który nie został obliczony. W kluczu odpowiedzi zostaw `reactionLabels` na `'values'`. Nazwy i wartości zajmują różną ilość miejsca (zerowa reakcja pozioma ma w treści zadania nazwę, ale w kluczu nie ma strzałki), więc rysunek, który przełącza się między nimi, powinien zostawić miejsce dla obu przez `:reserve-reaction-labels="['names', 'values']"`: rysunek pozostaje wtedy na miejscu i zmieniają się tylko etykiety. Karta zadania na stronie [Zadania i kolokwia](/pl/plot/exercises#the-exercise-in-a-page) przełącza się między nimi propem `answers`, tak jak strona [Zadania ze statyki](/pl/practice), gdy student poprosi o rozwiązanie.

## Miniatury {#thumbnails}

`compact` rysuje na kafelki o wymiarach około 400 × 200 px: mniejsze symbole i tekst 11,5 px, najwyżej dwie wartości na pręt, a obciążenia rozłożone opisane samą wartością, bez `q =`.

```vue
<StructurePlot v-for="t in tiles" :key="t.title" :solver="t.solver" compact :height="200" :title="t.title" />
```

Tak narysowana jest [galeria przykładów](/pl/examples/) w tej witrynie.

## Rozmiar {#size}

Rysunek mierzy swój kontener i dopasowuje układ do jego szerokości, w rzeczywistych pikselach. Bez `height` jego wysokość wynika z rysunku, najwyżej do `maxHeight`, domyślnie $\max(320;\ 0{,}75 \times \text{szerokość})$. Zanim będzie mógł zmierzyć kontener, np. na serwerze, używa `width`, domyślnie 640 px.

| Prop | Domyślnie | Ustawia |
| --- | --- | --- |
| `width` | 640, compact 400 | szerokość układu, dopóki kontener nie zostanie zmierzony, px |
| `height` | wynika z rysunku | stałą wysokość, px |
| `maxHeight` | $\max(320;\ 0{,}75w)$, compact brak | górną granicę automatycznej wysokości |
| `padding` | 6 | odstęp wokół rysunku, px |
| `fontSize` | 13, compact 11.5 | wielkość tekstu, px |
| `diagramSize` | 48, compact 26 | długość największej rzędnej, px |
| `deformedSize` | 30, compact 18 | największe przemieszczenie na postaci odkształconej, px |

### Kilka rysunków w jednej skali {#several-plots-at-one-scale}

Każdy rysunek skaluje wykresy do swojej największej wartości, więc moment 20 kNm wygląda na tak samo duży jak moment 80 kNm. Aby je porównać, ustal skalę w pikselach na jednostkę SI za pomocą `diagramScale`:

```vue
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams' // z Pierwszych kroków: (rozpiętość m, q kN/m) => obliczony solver

const spans = [4, 6, 8].map((L) => ({ L, solver: simpleBeam(L, 10) }))
// 0,5 px na kNm (0.5e-3 px na N·m): 80 kNm przęsła 8 m ma 40 px, 20 kNm przęsła 4 m ma 10 px
const scale = { M: 0.5e-3 }
</script>

<template>
  <figure v-for="s in spans" :key="s.L">
    <StructurePlot :solver="s.solver" :layers="['members', 'supports', 'M']" :diagram-scale="scale" />
    <figcaption>L = {{ s.L }} m</figcaption>
  </figure>
</template>
```

## Jednostki i liczby {#units-and-numbers}

Wewnątrz wartości są w SI i przelicza się je tylko do wyświetlenia: domyślnie na kN, kNm, kN/m, m, mm, mrad i K. Każdą jednostkę możesz zastąpić symbolem i skalą, przy czym wartość wyświetlana = wartość w SI × skala:

```vue
<StructurePlot :solver="solver" :units="{ force: { symbol: 'N', scale: 1 } }" />
```

Liczby formatuje `Intl.NumberFormat`, domyślnie dla języka angielskiego, z najwyżej jednym miejscem po przecinku. Przekaż własny, zgodny z językiem strony:

```vue
<StructurePlot :solver="solver" :number-format="new Intl.NumberFormat('cs', { maximumFractionDigits: 2 })" />
```

Znaki minus są prawdziwymi minusami (−), a wartość, która zaokrągla się do zera, nigdy nie pojawia się jako −0. Nazwy jednostek to `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` i `temperature`; jako punkt wyjścia biblioteka eksportuje `KN_UNITS` i `SI_UNITS`.

## Odczyt wartości {#reading-values}

Z `hover` rysunek odczytuje pokazane wyniki w punkcie pręta pod kursorem. Zaznacza każdą wartość tam, gdzie jest narysowana: kropką na końcu rzędnej każdego pokazanego wykresu (przy skoku na obu końcach) albo na postaci odkształconej, i wypisuje je w plakietce, np. `M = 54 kNm`, a przy skoku obie strony, `V = 13.3 → −6.7 kN`. Kursor wybiera pręt z dowolnego miejsca nad jego wykresem, nie tylko na samym pręcie. Rysunek emituje te wartości również jako dane:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { StructurePlot, type Readout } from '@edubeam/plot'
import { portalFrame } from './frame' // ze Slajdów i materiałów: () => obliczony solver

const frame = portalFrame()
const reading = ref<Readout | null>(null)
</script>

<template>
  <StructurePlot :solver="frame" :layers="['members', 'supports', 'M']" hover @readout="reading = $event" />
  <p v-if="reading">
    Member {{ reading.member }}, {{ reading.x.toFixed(2) }} m from its start:
    M = {{ (reading.values.M.left / 1e3).toFixed(1) }} kNm
  </p>
</template>
```

Odczyt ma postać `{ member, x, px, py, values, u }`: pręt, położenie wzdłuż niego w metrach, punkt na ekranie w px, `{ left, right }` dla każdej z wielkości `N`, `V`, `M` i `w` w jednostkach SI oraz przemieszczenie osiowe `u`. Gdy kursor opuści rysunek, odczyt jest `null`. Interaktywne rysunki w tej witrynie mają włączone `hover`: wskaż któryś kursorem.

Bez `hover` rysunek nie dodaje żadnych procedur obsługi zdarzeń, więc strona przewija się nad nim, a stuknięcie w rysunek wewnątrz linku otwiera link. Z `hover` rysunek nasłuchuje tylko zdarzeń wskaźnika (pointer events) i na ekranach dotykowych nadal działa przewijanie w pionie i powiększanie dwoma palcami.

## Dostępność {#accessibility}

Każdy rysunek to `<svg role="img">` nazwany propem `title` albo opisem tego, co pokazuje, np. „Structure with its loads, reactions, bending moment”. Ukryte zarezerwowane warstwy mają `aria-hidden`.
