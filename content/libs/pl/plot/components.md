---
title: API komponentów
description: "Wszystkie propsy i zdarzenia StructurePlot i DiagramStack w @edubeam/plot 0.2.0, z typami i wartościami domyślnymi, plugin EduBeamPlot i eksportowane typy."
order: 8
group: Dokumentacja API
source: site
---

# API komponentów

Propsy i zdarzenia obu komponentów, tak jak deklaruje je @edubeam/plot 0.2.0. Żaden z nich nie ma slotów. Wartości w jednostkach SI są tak oznaczone; rozmiary są w pikselach CSS.

## StructurePlot {#structureplot}

```ts
import { StructurePlot } from '@edubeam/plot'
```

Rysuje konstrukcję płaską i jej wyniki. Przewodnik: [StructurePlot](/pl/plot/structure-plot).

### Props {#props}

| Prop | Typ | Domyślnie | Opis |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Solver @edubeam/fem. Wyniki są rysowane, gdy jego przypadek obciążenia zostanie obliczony. |
| `model` | `PlotModel` | – | Albo zwykłe dane, które tworzy [`modelFromSolver`](/pl/plot/model). Ma pierwszeństwo przed `solver`. |
| `loadCase` | `number` | `0` | Indeks w `solver.loadCases` |
| `revision` | `number` | `0` | Zmień go, aby przerysować solver zmieniony w miejscu |
| `layers` | `readonly PlotLayer[]` | pręty, podpory, obciążenia, reakcje i jeden wynik | Co narysować: `'nodes'`, `'nodeLabels'`, `'dimensions'`, `'members'`, `'supports'`, `'loads'`, `'reactions'`, `'N'`, `'V'`, `'M'`, `'w'` |
| `reserve` | `readonly PlotLayer[]` | `layers` | Warstwy, dla których trzeba zostawić miejsce, choć są ukryte |
| `compact` | `boolean` | `false` | Rysunek miniatury: mniejsze symbole, najwyżej dwie wartości na pręt |
| `units` | `Partial<Units>` | `KN_UNITS` | Jednostki wyświetlania |
| `numberFormat` | `Intl.NumberFormat` | angielski, najwyżej 1 miejsce po przecinku | Formatuje każdą liczbę |
| `colors` | `Partial<PlotColors>` | – | Własne kolory według tonów: [Motywy i kolory](/pl/plot/theming#the-colors-prop) |
| `width` | `number` | `640`, compact `400` | Szerokość, dopóki kontener nie zostanie zmierzony, np. na serwerze |
| `height` | `number` | – | Stała wysokość. Bez niej wysokość wynika z rysunku. |
| `maxHeight` | `number` | `max(320, 0.75 × width)`, compact brak | Górna granica automatycznej wysokości |
| `padding` | `number` | `6` | Odstęp wokół rysunku |
| `fontSize` | `number` | `13`, compact `11.5` | Wielkość tekstu |
| `diagramSize` | `number` | `48`, compact `26` | Długość największej rzędnej wykresu |
| `deformedSize` | `number` | `30`, compact `18` | Największe przemieszczenie na postaci odkształconej |
| `diagramScale` | `Partial<Record<ResultLayer, number>>` | – | Stała liczba px na jednostkę SI dla danego wyniku; zastępuje `diagramSize` lub `deformedSize` |
| `momentOnTensionSide` | `boolean` | `true` | M po stronie rozciąganej; `false` po stronie ściskanej |
| `resultLabelMode` | `'horizontal' \| 'axis'` | `'horizontal'` | Wartości zapisane poziomo albo obrócone wzdłuż rzędnej |
| `reactionLabels` | `'values' \| 'names'` | `'values'` | Reakcje tak, jak działają, z wartością; albo, do zadania, każdy zablokowany kierunek z nazwą (*A<sub>x</sub>*, *M<sub>A</sub>*) i strzałką zwróconą w stronę dodatnią. Nazwy nie wymagają wyników: [Reakcje jako niewiadome](/pl/plot/structure-plot#reactions-as-unknowns) |
| `reserveLabelModes` | `readonly ResultLabelMode[]` | – | Tryby etykiet, dla których trzeba zostawić miejsce oprócz bieżącego |
| `reserveReactionLabels` | `readonly ReactionLabels[]` | – | Style etykiet reakcji, dla których trzeba zostawić miejsce oprócz `reactionLabels`, aby rysunek zadania zamieniającego się w rozwiązanie się nie przesuwał |
| `animate` | `boolean` | `true` | Płynne pojawianie się warstw i rysowanie prętów. Zawsze wyłączone przy `prefers-reduced-motion`. |
| `hover` | `boolean` | `false` | Odczyt wartości pod kursorem, zaznaczonych na końcu rzędnej każdego wykresu. Gdy jest wyłączony, rysunek w ogóle nie reaguje na kursor. |
| `title` | `string` | opis tego, co jest pokazane | Nazwa dostępna (accessible name) rysunku |

Bez `layers` wynikiem jest `M` dla belek i ram, `N` dla kratownicy i `w`, gdy nic nie przenosi sił (`defaultResultLayer`).

### Zdarzenia {#events}

| Zdarzenie | Dane | Kiedy |
| --- | --- | --- |
| `readout` | `Readout \| null` | Z `hover`: punkt pręta pod kursorem i wyniki w nim; `null`, gdy kursor opuści rysunek |

```ts
interface Readout {
  readonly member: string
  readonly x: number // m od węzła początkowego pręta
  readonly px: number // punkt na ekranie, px
  readonly py: number
  readonly values: Readonly<Record<'N' | 'V' | 'M' | 'w', SidedValue>> // jednostki SI
  readonly u: number // przemieszczenie wzdłuż lokalnej osi x pręta, m
}
interface SidedValue {
  readonly left: number
  readonly right: number // równe left tam, gdzie wynik jest ciągły
}
```

## DiagramStack {#diagramstack}

```ts
import { DiagramStack } from '@edubeam/plot'
```

Rysuje prostą belkę nad jej wykresami na wspólnej osi x. Pręty muszą tworzyć jedną poziomą linię, zdefiniowaną od lewej do prawej; w każdym innym przypadku komponent zgłasza wyjątek. Przewodnik: [DiagramStack](/pl/plot/diagram-stack).

### Props {#props-1}

| Prop | Typ | Domyślnie | Opis |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Obliczona belka |
| `model` | `PlotModel` | – | Albo zwykłe dane z `modelFromSolver`; ma pierwszeństwo |
| `loadCase` | `number` | `0` | Indeks w `solver.loadCases` |
| `revision` | `number` | `0` | Zmień go, aby przerysować solver zmieniony w miejscu |
| `members` | `readonly string[]` | wszystkie pręty | Pręty tworzące linię belki |
| `rows` | `readonly StackRow[]` | `['V', 'M', 'w']` | Wiersze wykresów od góry do dołu, z `'N'`, `'V'`, `'M'`, `'w'` |
| `loadRow` | `boolean` | `true` | Belka z podporami, obciążeniem i reakcjami nad wierszami |
| `ranges` | `Partial<Record<StackRow, readonly [number, number]>>` | własny zakres każdego wiersza | Zakres wartości poszczególnych wierszy, jednostki SI |
| `rowHeights` | `Partial<Record<StackRow, number>>` | N 100, V 116, M 128, w 76; przy szerokości poniżej 560 px 88, 96, 104, 64 | Wysokości wierszy, zanim zmniejszy je `maxHeight` |
| `maxHeight` | `number` | – | Wiersze zmniejszają się, najwyżej do 60 %, aby rysunek się zmieścił. Tekst zachowuje rozmiar. |
| `units` | `Partial<Units>` | `KN_UNITS` | Jednostki wyświetlania |
| `numberFormat` | `Intl.NumberFormat` | angielski, najwyżej 1 miejsce po przecinku | Formatuje każdą liczbę |
| `colors` | `Partial<PlotColors>` | – | Własne kolory |
| `width` | `number` | `720` | Szerokość, dopóki kontener nie zostanie zmierzony; używane jest co najmniej 320 |
| `fontSize` | `number` | `12.5` | Wielkość tekstu |
| `hover` | `boolean` | `true` | Kursor do odczytu. Gdy jest wyłączony, rysunek w ogóle nie reaguje na kursor. |
| `loadAt` | `number` | – | Położenie (w m wzdłuż linii) siły skupionej, którą czytelnik może przesuwać; używaj z `v-model:load-at` |
| `loadLabel` | `string` | `P = …` z wartością siły | Tekst obok przesuwanej siły |
| `loadStep` | `number` | `0.05` | Krok w m, do którego zaokrąglane jest przeciąganie; o tyle przesuwają siłę klawisze strzałek |
| `title` | `string` | opis wierszy | Nazwa dostępna (accessible name) rysunku |

### Zdarzenia {#events-1}

| Zdarzenie | Dane | Kiedy |
| --- | --- | --- |
| `update:loadAt` | `number` | Czytelnik przesunął siłę: jej nowe położenie, m. Obsługuje `v-model:load-at`. |
| `readout` | `StackReadout \| null` | Wartości pod kursorem we wszystkich wierszach; `null`, gdy kursor opuści rysunek |

```ts
interface StackReadout {
  readonly x: number // m wzdłuż linii belki
  readonly values: Partial<Record<'N' | 'V' | 'M' | 'w', { readonly left: number; readonly right: number }>> // SI
}
```

## Plugin {#the-plugin}

```ts
import { EduBeamPlot } from '@edubeam/plot'

app.use(EduBeamPlot) // rejestruje <StructurePlot> i <DiagramStack> globalnie
```

Jest opcjonalny: importowanie komponentów po nazwie jest lżejsze, a bundler usuwa plugin z buildu, który go nie używa.

## Typy {#types}

Do typowanych nakładek na komponenty pakiet eksportuje ich propsy i zdarzenia:

```ts
import type { PlotLayer, StructurePlotProps } from '@edubeam/plot'

const figure: StructurePlotProps = { layers: ['members', 'supports', 'M'] satisfies PlotLayer[], compact: true }
```

| Typ | Opis |
| --- | --- |
| `StructurePlotProps`, `StructurePlotEmits` | Propsy i zdarzenia `StructurePlot` |
| `DiagramStackProps`, `DiagramStackEmits` | Propsy i zdarzenia `DiagramStack` |
| `Readout`, `ReadoutQuantity`, `SidedValue`, `StackReadout` | Dane zdarzeń |
| `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `StackRow` | Nazwy warstw, wyników, trybów etykiet, stylów etykiet reakcji i wierszy |
| `Units`, `Unit`, `UnitKind` | Jednostki wyświetlania: `{ symbol, scale }` dla każdego rodzaju |
| `PlotColors` | Kolory według tonów |
| `PlotModel` | Zwykły model: [Model rysunku](/pl/plot/model) |

Pozostałe eksporty, w tym `structureSvg` do plików SVG i funkcje, na których opiera się rysowanie, opisuje strona [Funkcje](/pl/plot/functions).
