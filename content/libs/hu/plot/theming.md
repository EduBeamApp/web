---
title: Témák és színek
description: "Az @edubeam/plot rajzok színezése CSS-változókkal vagy a colors proppal: világos és sötét téma, fekete-fehér nyomtatás, színek SVG-fájlban, betűtípusok, animációk."
order: 4
source: site
---

# Témák és színek

A rajz a színeit az oldal CSS-változóiból (custom properties) veszi, így a webhely világos és sötét témája külön munka nélkül érvényesül. Ahol az oldal nem határozza meg őket, a CSS rendszerszínei lépnek a helyükbe, amelyek követik az oldal `color-scheme` beállítását. Beállítások nélkül a rajz világos oldalon fehér alapon fekete, sötét oldalon sötét alapon világos.

## CSS-változók {#custom-properties}

| Mire való | CSS-változó | Tartalékérték |
| --- | --- | --- |
| Rudak, támaszok, szöveg | `--figure-ink`, utána `--ink` | `CanvasText` |
| Háttér, a feliratok körvonala | `--paper` | `Canvas` |
| Méretvonalak, tengelyek | `--muted` | `GrayText` |
| Csomópontok, a húzható teher | `--brand` | `#4f46e5` |
| Normálerő | `--color-normal` | `#2222ff` |
| Nyíróerő | `--color-shear` | `#00af00` |
| Hajlítónyomaték | `--color-moment` | `#ff2222` |
| Deformált alak | `--figure-ink`, utána `--ink` | `CanvasText` |
| Terhek | `--color-load` | `#ff8700` |
| Támaszerők | `--color-reaction` | `#a020f0` |
| Húzott rácsrudak | `--color-tension`, utána `--color-moment` | `#ff2222` |
| Nyomott rácsrudak | `--color-compression`, utána `--color-normal` | `#2222ff` |
| Betűtípus | `--ebp-font`, utána `--font-sans` | `inherit` |

A változókat a rajz fölötti bármelyik elemen beállíthatod, az egész webhelyre a `:root` elemen:

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

A feliratok `--paper` színű körvonalat kapnak, hogy a vonalkázás fölött is olvashatók maradjanak: igazítsd ezt ahhoz a háttérhez, amelyen a rajz áll.

## A `colors` prop {#the-colors-prop}

Egyetlen rajz színezéséhez add meg név szerint a kívánt tónusokat:

```vue
<StructurePlot :solver="solver" :colors="{ moment: '#c00', paper: 'transparent' }" />
```

A tónusok: `ink`, `paper`, `muted`, `brand`, `normal`, `shear`, `moment`, `deformed`, `load`, `reaction`, `tension` és `compression`. Bármilyen CSS-szín használható, a `var(…)` is. Az egyes tónusok alapértékét a `DEFAULT_COLORS` tartalmazza.

## Fekete-fehér {#black-and-white}

Fénymásolt dolgozathoz vagy fekete-fehér nyomtatáshoz állíts minden színes tónust a szöveg színére:

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

Az ábrák szín nélkül is olvashatók maradnak: vonalkázottak, és a nyomaték a húzott oldalon van.

## Színek SVG-fájlban {#colours-in-an-svg-file}

A [`structureSvg`](/hu/plot/functions#a-standalone-svg-file) által kiírt fájlt nem veszi körül oldal, ezért egyszerű színeket használ: a `PRINT_COLORS` értékeit, vagyis az EduBeam alkalmazás színeit fehér alapon. A `colors` beállítása ugyanazokat a tónusokat fogadja, mint a prop, így a fenti fekete-fehér készlet ott is működik:

```ts
structureSvg(model, { colors: print }) // fekete fehér alapon
structureSvg(model, { background: false }) // háttér nélkül, színes diához
```

Csak egyszerű színek: a `var(…)` semmit sem jelent a Wordnek vagy az Inkscape-nek.

## Betűtípusok {#fonts}

A szöveg az oldal betűtípusát használja a `--ebp-font` vagy a `--font-sans` révén, táblázatos számjegyekkel. A sorok nevét, például a V(x) jelölést a `DiagramStack` komponensben, a KaTeX betűtípusaival szedi, ha az oldal betölti őket, egyébként talpas betűvel. Az SVG-fájl a `fontFamily` beállítást használja, alapértelmezés szerint Helveticát vagy Arialt, mert az oldal betűtípusát nem ismerheti.

## Az animáció testreszabása {#restyling-the-animation}

A rajzhoz szükséges néhány CSS-szabály közvetlenül minden SVG-be bekerül, így nincs szükség stíluslapra. Minden osztály `ebp-` előtagot kap, és az oldal felülírhatja őket. Minden réteg egy `<g class="ebp-layer ebp-layer-{name}">` elem, amely megkapja az `ebp-on` osztályt, amikor látható:

```css
/* Lassabb beúszás előadóterembe */
.slides .ebp-animate .ebp-layer {
  transition-duration: 1s;
}
```

A `PLOT_CSS` a beágyazott szabályokat exportálja, a `toneVars(colors)` pedig azokat a CSS-változókat, amelyeket a rajz a gyökérelemén beállít; ezekkel a [rajzoló függvényekből](/hu/plot/functions#drawing) saját ábrákat építhetsz.
