---
title: DiagramStack
description: "Belka nad wykresami V(x), M(x) i w(x) na wspólnej osi x w DiagramStack, odczyt wszystkich wierszy kursorem i siła skupiona, którą czytelnik przesuwa po belce."
order: 3
source: site
---

# DiagramStack

`DiagramStack` tworzy rysunek znany z każdego podręcznika statyki: prostą belkę z podporami, obciążeniem i reakcjami, a pod nią, na tej samej osi x, wykresy siły tnącej V(x), momentu zginającego M(x) i ugięcia w(x). Kursor odczytuje wszystkie wiersze naraz, a opcjonalną siłę skupioną można przesuwać wzdłuż belki.

```vue
<DiagramStack :solver="solver" />
```

![DiagramStack: belka swobodnie podparta o rozpiętości 6 m z siłą 20 kN, którą czytelnik może przesuwać, tutaj 4,3 m od lewej podpory; reakcje 5,7 kN i 14,3 kN, siła tnąca skacząca pod siłą z 5,7 kN na −14,3 kN, moment zginający osiągający tam maksimum 24,4 kNm i linia ugięcia z największą wartością 17 mm](/screenshots/pl/p2p-plot-diagram-stack.webp){.shot-lg}

Pręty muszą tworzyć jedną poziomą linię, zdefiniowaną od lewej do prawej. Wszystko inne, czyli linia pochyła lub łamana albo pręt zdefiniowany od prawej do lewej, komponent odrzuca z błędem, zamiast narysować źle, ponieważ oś x rysunku jest osią belki. Wszystkie propsy opisuje [API komponentów](/pl/plot/components#diagramstack).

## Wiersze {#rows}

| Prop | Domyślnie | Ustawia |
| --- | --- | --- |
| `rows` | `['V', 'M', 'w']` | wykresy, od góry do dołu; dostępny jest też `'N'` |
| `loadRow` | `true` | belkę z podporami, obciążeniem i reakcjami nad wierszami |
| `members` | wszystkie pręty | pręty tworzące belkę, gdy model ma też inne |
| `rowHeights` | N 100, V 116, M 128, w 76 px | wysokości wierszy; przy szerokości poniżej 560 px nieco mniejsze |
| `maxHeight` | brak | wiersze zmniejszają się, najwyżej do 60 %, aby rysunek się zmieścił; tekst zachowuje rozmiar |
| `ranges` | własny zakres każdego wiersza | stałe zakresy wartości poszczególnych wierszy, w jednostkach SI |

V i N są odkładane dodatnio w górę, M i w dodatnio w dół, jak w większości podręczników: moment dodatni (rozciągający włókna dolne) i ugięcie w dół leżą pod osią. Każdy wiersz podaje swoje wartości ekstremalne.

## Kursor do odczytu {#the-reading-cursor}

`hover` jest domyślnie włączone. Gdy przesuwasz kursor nad rysunkiem, przez wszystkie wiersze biegnie pionowa linia, a wartość każdego wiersza pojawia się w plakietce. W odległości do 8 px od skoku, przy sile skupionej lub podporze, linia przyciąga się do niego, a V pokazuje obie strony, jak `5.7 → −14.3 kN` pod siłą na rysunku powyżej. Wartości są też emitowane:

```vue
<DiagramStack :solver="solver" @readout="(r) => (reading = r)" />
```

Odczyt ma postać `{ x, values }`: `x` w metrach wzdłuż belki i `{ left, right }` dla każdego wiersza w jednostkach SI; gdy kursor opuści rysunek, jest `null`.

## Siła przesuwana przez czytelnika {#a-load-the-reader-can-drag}

Przekaż `v-model:load-at` położenie siły skupionej, a dostanie ona uchwyt: czytelnik przeciąga ją kursorem albo zaznacza ją i używa klawiszy strzałek. Komponent zgłasza tylko nowe położenie. Oblicz belkę ponownie z siłą w tym miejscu i przekaż z powrotem nowy solver, tak jak robi to `MovingLoad.vue`:

```vue [MovingLoad.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { beamLine, DiagramStack, lineDiagram, modelFromSolver, rowRange, type StackRow } from '@edubeam/plot'

const L = 6 // m
const P = 20e3 // N

/** Obliczona belka z siłą skupioną w odległości `at` metrów od A. */
const solveWithLoadAt = (at: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamConcentratedLoad(1, [0, P, 0, at], true)
  solver.solve()
  return solver
}

/** Zakres każdego wiersza dla wszystkich położeń siły, aby wykresy rosły i malały zamiast zmieniać skalę. */
const rows: StackRow[] = ['V', 'M', 'w']
const envelope = (() => {
  const ranges: Partial<Record<StackRow, [number, number]>> = {}
  for (let at = 0.25; at < L; at += 0.25) {
    const model = modelFromSolver(solveWithLoadAt(at))
    const line = beamLine(model)
    for (const row of rows) {
      const [lo, hi] = rowRange(lineDiagram(model, line, row))
      const [min, max] = ranges[row] ?? [0, 0]
      ranges[row] = [Math.min(min, lo), Math.max(max, hi)]
    }
  }
  return ranges
})()

const at = ref(2)
const solver = computed(() => solveWithLoadAt(at.value))
</script>

<template>
  <DiagramStack v-model:load-at="at" :solver="solver" :rows="rows" :ranges="envelope" load-label="P = 20 kN" />
  <p>The load is {{ at.toFixed(2) }} m from A.</p>
</template>
```

Przy sile w odległości 4,3 m rysunek pokazuje reakcje 5,7 kN i 14,3 kN, skok siły tnącej pod siłą z 5,7 na −14,3 kN i moment $M = 5{,}67 \cdot 4{,}3 = 24{,}4$ kNm w tym miejscu. Bez `ranges` każdy wiersz przy przesuwaniu siły skalowałby się do własnych ekstremów i wykresy zdawałyby się w ogóle nie zmieniać.

| Prop | Domyślnie | Ustawia |
| --- | --- | --- |
| `loadAt` | brak | położenie siły w m od początku linii; z `v-model:load-at` |
| `loadLabel` | `P = …` | tekst obok uchwytu |
| `loadStep` | 0.05 | krok w m, do którego zaokrąglane jest przeciąganie; o tyle przesuwają siłę klawisze strzałek |

Uchwyt jest elementem `role="slider"`, który może przyjąć fokus i podaje czytnikom ekranu swój zakres i położenie. Klawisze strzałek przesuwają go o `loadStep`, Page Up i Page Down o 1 m, a Home i End na końce belki. Na ekranie dotykowym można go przeciągać palcem, a przewijanie w pionie nad rysunkiem nadal działa.

Uchwyt zastępuje siłę skupioną, którą obliczony model ma w punkcie `loadAt`: ta siła jest rysowana jako uchwyt, z opisem jej wartości, chyba że podasz `loadLabel`. Umieść siłę w modelu w tym samym miejscu, tak jak robi to `solveWithLoadAt`.

## Rozmiar i renderowanie na serwerze {#size-and-server-rendering}

Rysunek mierzy swój kontener i dopasowuje układ do jego szerokości, co najmniej 320 px. Zanim będzie mógł go zmierzyć, używa `width`, domyślnie 720 px. Tekst ma 12,5 px (`fontSize`) i nigdy nie zmniejsza się razem z rysunkiem.
