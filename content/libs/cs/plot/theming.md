---
title: Motivy a barvy
description: "Barvy obrázků @edubeam/plot přes CSS proměnné nebo prop colors, světlý a tmavý motiv, černobílý tisk, barvy souborů SVG, písmo a úprava animací."
order: 4
---

# Motivy a barvy

Obrázek bere barvy z CSS proměnných (custom properties) stránky, takže se na něj světlý i tmavý motiv webu přenese beze změny. Kde stránka žádné proměnné nedefinuje, nastoupí systémové barvy CSS, které se řídí vlastností `color-scheme` stránky. Bez jakéhokoli nastavení je tedy obrázek na světlé stránce černý na bílém a na tmavé světlý na tmavém.

## CSS proměnné {#custom-properties}

| K čemu slouží | CSS proměnná | Záložní hodnota |
| --- | --- | --- |
| Prvky, podpory, text | `--figure-ink`, pak `--ink` | `CanvasText` |
| Pozadí, lemy popisků | `--paper` | `Canvas` |
| Kóty, osy | `--muted` | `GrayText` |
| Uzly, síla posouvaná ukazatelem | `--brand` | `#4f46e5` |
| Normálová síla | `--color-normal` | `#2222ff` |
| Posouvající síla | `--color-shear` | `#00af00` |
| Ohybový moment | `--color-moment` | `#ff2222` |
| Deformovaný tvar | `--figure-ink`, pak `--ink` | `CanvasText` |
| Zatížení | `--color-load` | `#ff8700` |
| Reakce | `--color-reaction` | `#a020f0` |
| Pruty příhradové konstrukce v tahu | `--color-tension`, pak `--color-moment` | `#ff2222` |
| Pruty příhradové konstrukce v tlaku | `--color-compression`, pak `--color-normal` | `#2222ff` |
| Písmo | `--ebp-font`, pak `--font-sans` | `inherit` |

Proměnné nastavte kdekoli nad obrázkem, pro celý web na `:root`:

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

Popisky mají lem v barvě `--paper`, aby zůstaly čitelné i přes šrafování: nastavte ji podle pozadí, na kterém obrázek leží.

## Prop `colors` {#the-colors-prop}

Chcete-li obarvit jediný obrázek, předejte mu kterékoli tóny podle názvu:

```vue
<StructurePlot :solver="solver" :colors="{ moment: '#c00', paper: 'transparent' }" />
```

Tóny jsou `ink`, `paper`, `muted`, `brand`, `normal`, `shear`, `moment`, `deformed`, `load`, `reaction`, `tension` a `compression`. Funguje jakákoli barva CSS, včetně `var(…)`. Výchozí hodnotu každého tónu obsahuje `DEFAULT_COLORS`.

## Černobíle {#black-and-white}

Pro písemku z kopírky nebo pro černobílý tisk nastavte všechny barevné tóny na barvu kresby:

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

Průběhy zůstanou čitelné i bez barev: jsou šrafované a moment se vynáší na taženou stranu.

## Barvy v souboru SVG {#colours-in-an-svg-file}

Soubor zapsaný funkcí [`structureSvg`](/cs/plot/functions#a-standalone-svg-file) nemá kolem sebe žádnou stránku, a proto používá pevné barvy: `PRINT_COLORS`, tedy barvy aplikace EduBeam na bílém podkladu. Jeho volba `colors` přijímá stejné tóny jako prop, takže černobílá sada z předchozí části funguje i tady:

```ts
structureSvg(model, { colors: print }) // černá na bílé
structureSvg(model, { background: false }) // bez pozadí, pro snímek s barevným pozadím
```

Jen pevné barvy: `var(…)` Wordu ani Inkscapu nic neřekne.

## Písmo {#fonts}

Text používá písmo stránky, přes `--ebp-font` nebo `--font-sans`, s tabulkovými číslicemi. Názvy řádků jako V(x) v `DiagramStack` se sázejí písmy KaTeXu, pokud je stránka načítá, jinak patkovým písmem. Soubor SVG písmo stránky znát nemůže, a proto používá svou volbu `fontFamily`, ve výchozím nastavení Helveticu nebo Arial.

## Úprava animace {#restyling-the-animation}

Těch pár pravidel CSS, která obrázek potřebuje, je vložených přímo do každého SVG, takže nepotřebuje žádný soubor se styly. Všechny třídy mají předponu `ebp-` a stránka je může přepsat. Každá vrstva je element `<g class="ebp-layer ebp-layer-{name}">`, který dostane třídu `ebp-on`, když je vrstva zobrazená:

```css
/* Pomalejší prolínání pro posluchárnu */
.slides .ebp-animate .ebp-layer {
  transition-duration: 1s;
}
```

`PLOT_CSS` obsahuje vložená pravidla a `toneVars(colors)` vrací CSS proměnné, které obrázek nastavuje na svém kořenovém elementu. Obojí se hodí, když sestavujete vlastní obrázky z [funkcí pro kreslení](/cs/plot/functions#drawing).
