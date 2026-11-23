---
title: Motívy a farby
description: "Farby obrázkov @edubeam/plot cez CSS premenné alebo prop colors, svetlý a tmavý motív, čiernobiela tlač, farby súborov SVG, písmo a úprava animácií."
order: 4
source: site
---

# Motívy a farby

Obrázok preberá farby z CSS premenných (custom properties) stránky, takže svetlý aj tmavý motív webu preberie bez akýchkoľvek úprav. Kde stránka žiadne premenné nedefinuje, nastúpia systémové farby CSS, ktoré sa riadia vlastnosťou `color-scheme` stránky. Bez akéhokoľvek nastavenia je teda obrázok na svetlej stránke čierny na bielom a na tmavej svetlý na tmavom.

## CSS premenné {#custom-properties}

| Na čo slúži | CSS premenná | Záložná hodnota |
| --- | --- | --- |
| Prvky, podpery, text | `--figure-ink`, potom `--ink` | `CanvasText` |
| Pozadie, lemy popisov | `--paper` | `Canvas` |
| Kóty, osi | `--muted` | `GrayText` |
| Uzly, sila posúvaná ukazovateľom | `--brand` | `#4f46e5` |
| Normálová sila | `--color-normal` | `#2222ff` |
| Priečna sila | `--color-shear` | `#00af00` |
| Ohybový moment | `--color-moment` | `#ff2222` |
| Deformovaný tvar | `--figure-ink`, potom `--ink` | `CanvasText` |
| Zaťaženie | `--color-load` | `#ff8700` |
| Reakcie | `--color-reaction` | `#a020f0` |
| Priehradové prúty v ťahu | `--color-tension`, potom `--color-moment` | `#ff2222` |
| Priehradové prúty v tlaku | `--color-compression`, potom `--color-normal` | `#2222ff` |
| Písmo | `--ebp-font`, potom `--font-sans` | `inherit` |

Premenné nastavte kdekoľvek nad obrázkom, pre celý web na `:root`:

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

Popisy majú lem vo farbe `--paper`, aby zostali čitateľné aj cez šrafovanie: nastavte ju podľa pozadia, na ktorom obrázok leží.

## Prop `colors` {#the-colors-prop}

Ak chcete zafarbiť jediný obrázok, odovzdajte mu ktorékoľvek tóny podľa názvu:

```vue
<StructurePlot :solver="solver" :colors="{ moment: '#c00', paper: 'transparent' }" />
```

Tóny sú `ink`, `paper`, `muted`, `brand`, `normal`, `shear`, `moment`, `deformed`, `load`, `reaction`, `tension` a `compression`. Funguje akákoľvek farba CSS vrátane `var(…)`. Predvolenú hodnotu každého tónu obsahuje `DEFAULT_COLORS`.

## Čiernobielo {#black-and-white}

Pre písomku z kopírky alebo pre čiernobielu tlač nastavte všetky farebné tóny na farbu kresby:

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

Priebehy zostanú čitateľné aj bez farieb: sú šrafované a moment sa vynáša na ťahanú stranu.

## Farby v súbore SVG {#colours-in-an-svg-file}

Súbor zapísaný funkciou [`structureSvg`](/sk/plot/functions#a-standalone-svg-file) nemá okolo seba žiadnu stránku, a preto používa pevné farby: `PRINT_COLORS`, teda farby aplikácie EduBeam na bielom podklade. Jeho voľba `colors` prijíma rovnaké tóny ako prop, takže čiernobiela sada z predchádzajúcej časti funguje aj tu:

```ts
structureSvg(model, { colors: print }) // čierna na bielom
structureSvg(model, { background: false }) // bez pozadia, pre snímku s farebným pozadím
```

Iba pevné farby: `var(…)` Wordu ani Inkscapu nič nepovie.

## Písmo {#fonts}

Text používa písmo stránky, cez `--ebp-font` alebo `--font-sans`, s tabuľkovými číslicami. Názvy riadkov ako V(x) v `DiagramStack` sa sádzajú písmami KaTeXu, ak ich stránka načítava, inak pätkovým písmom. Súbor SVG písmo stránky poznať nemôže, a preto používa svoju voľbu `fontFamily`, predvolene Helveticu alebo Arial.

## Úprava animácie {#restyling-the-animation}

Tých pár pravidiel CSS, ktoré obrázok potrebuje, je vložených priamo do každého SVG, takže nepotrebuje žiadny súbor so štýlmi. Všetky triedy majú predponu `ebp-` a stránka ich môže prepísať. Každá vrstva je element `<g class="ebp-layer ebp-layer-{name}">`, ktorý dostane triedu `ebp-on`, keď je vrstva zobrazená:

```css
/* Pomalšie prelínanie pre poslucháreň */
.slides .ebp-animate .ebp-layer {
  transition-duration: 1s;
}
```

`PLOT_CSS` obsahuje vložené pravidlá a `toneVars(colors)` vracia CSS premenné, ktoré obrázok nastavuje na svojom koreňovom elemente. Oboje sa hodí, keď zostavujete vlastné obrázky z [funkcií na kreslenie](/sk/plot/functions#drawing).
