---
title: Motywy i kolory
description: "Kolory rysunków @edubeam/plot przez zmienne CSS lub prop colors, motyw jasny i ciemny, druk czarno-biały, kolory plików SVG, czcionka i własne animacje."
order: 4
source: site
---

# Motywy i kolory

Rysunek bierze kolory ze zmiennych CSS (custom properties) strony, więc jasny i ciemny motyw witryny działają bez dodatkowej pracy. Tam, gdzie strona ich nie definiuje, zastępują je kolory systemowe CSS, które dostosowują się do `color-scheme` strony. Bez żadnych ustawień rysunek jest czarny na białym na jasnej stronie i jasny na ciemnym na ciemnej.

## Zmienne CSS {#custom-properties}

| Do czego | Zmienna CSS | Wartość zastępcza |
| --- | --- | --- |
| Pręty, podpory, tekst | `--figure-ink`, potem `--ink` | `CanvasText` |
| Tło, obwódki etykiet | `--paper` | `Canvas` |
| Linie wymiarowe, osie | `--muted` | `GrayText` |
| Węzły, przesuwana siła | `--brand` | `#4f46e5` |
| Siła normalna | `--color-normal` | `#2222ff` |
| Siła tnąca | `--color-shear` | `#00af00` |
| Moment zginający | `--color-moment` | `#ff2222` |
| Postać odkształcona | `--figure-ink`, potem `--ink` | `CanvasText` |
| Obciążenia | `--color-load` | `#ff8700` |
| Reakcje | `--color-reaction` | `#a020f0` |
| Pręty kratownicy rozciągane | `--color-tension`, potem `--color-moment` | `#ff2222` |
| Pręty kratownicy ściskane | `--color-compression`, potem `--color-normal` | `#2222ff` |
| Czcionka | `--ebp-font`, potem `--font-sans` | `inherit` |

Zmienne ustaw w dowolnym elemencie nad rysunkiem, dla całej witryny w `:root`:

```css
:root {
  --ink: #1b1b3a;
  --paper: #ffffff;
  --color-moment: #d7263d;
}

.dark {
  --ink: #eeeeff;
  --paper: #0b0d1f;
}
```

Etykiety mają obwódkę w kolorze `--paper`, dzięki czemu są czytelne nad kreskowaniem: dopasuj ją do tła, na którym leży rysunek.

## Prop `colors` {#the-colors-prop}

Aby pokolorować jeden rysunek, przekaż wybrane tony po nazwie:

```vue
<StructurePlot :solver="solver" :colors="{ moment: '#c00', paper: 'transparent' }" />
```

Tony to `ink`, `paper`, `muted`, `brand`, `normal`, `shear`, `moment`, `deformed`, `load`, `reaction`, `tension` i `compression`. Działa każdy kolor CSS, także `var(…)`. Domyślną wartość każdego tonu zawiera `DEFAULT_COLORS`.

## Czarno-biało {#black-and-white}

Do kserowanego kolokwium lub wydruku czarno-białego ustaw każdy kolorowy ton na czarny, tak jak tekst:

```vue
<script setup lang="ts">
import type { PlotColors } from '@edubeam/plot'

const print: Partial<PlotColors> = {
  ink: '#000', paper: '#fff', muted: '#555', brand: '#000',
  normal: '#000', shear: '#000', moment: '#000', deformed: '#000',
  load: '#000', reaction: '#000', tension: '#000', compression: '#000',
}
</script>

<template>
  <StructurePlot :solver="solver" :colors="print" :animate="false" />
</template>
```

Wykresy są czytelne także bez koloru: są kreskowane, a moment leży po stronie rozciąganej.

## Kolory w pliku SVG {#colours-in-an-svg-file}

Plik zapisany przez [`structureSvg`](/pl/plot/functions#a-standalone-svg-file) nie ma wokół siebie strony, więc używa zwykłych kolorów: `PRINT_COLORS`, czyli kolorów aplikacji EduBeam na białym tle. Jego opcja `colors` przyjmuje te same tony co prop, więc powyższy zestaw czarno-biały działa także tutaj:

```ts
structureSvg(model, { colors: print }) // czarno na białym
structureSvg(model, { background: false }) // bez tła, na kolorowy slajd
```

Tylko zwykłe kolory: `var(…)` nic nie znaczy dla Worda ani Inkscape'a.

## Czcionki {#fonts}

Tekst używa czcionki strony, przez `--ebp-font` lub `--font-sans`, z cyframi tabelarycznymi. Nazwy wierszy, takie jak V(x) w `DiagramStack`, są składane czcionkami KaTeX-a, jeśli strona je wczytuje, a w przeciwnym razie czcionką szeryfową. Plik SVG używa swojej opcji `fontFamily`, domyślnie Helvetica lub Arial, ponieważ nie może znać czcionki strony.

## Własny styl animacji {#restyling-the-animation}

Kilka reguł CSS, których potrzebuje rysunek, jest wpisanych bezpośrednio w każdy rysunek SVG, więc nie jest potrzebny arkusz stylów. Każda klasa ma przedrostek `ebp-`, a strona może je nadpisać. Każda warstwa to `<g class="ebp-layer ebp-layer-{name}">`, która dostaje klasę `ebp-on`, gdy jest widoczna:

```css
/* Wolniejsze pojawianie się, do dużej sali wykładowej */
.slides .ebp-animate .ebp-layer {
  transition-duration: 1s;
}
```

`PLOT_CSS` eksportuje te reguły, a `toneVars(colors)` zmienne CSS, które rysunek ustawia na swoim elemencie głównym, do budowania własnych rysunków za pomocą [funkcji rysujących](/pl/plot/functions#drawing).
