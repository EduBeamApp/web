---
title: Teme și culori
description: "Culorile figurilor @edubeam/plot prin variabile CSS sau prop-ul colors: teme deschisă și întunecată, tipar alb-negru, culori în fișiere SVG, fonturi și animații."
order: 4
source: site
---

# Teme și culori

Un desen își ia culorile din variabilele CSS (custom properties) ale paginii, așa că temele deschisă și întunecată ale unui site se aplică fără nimic în plus. Acolo unde pagina nu definește niciuna, le țin locul culorile de sistem CSS, care urmează `color-scheme` al paginii. Fără nicio setare, un desen este negru pe alb într-o pagină deschisă și deschis la culoare pe fond închis într-una întunecată.

## Variabile CSS {#custom-properties}

| Folosită pentru | Variabilă CSS | Valoare de rezervă |
| --- | --- | --- |
| Bare, reazeme, text | `--figure-ink`, apoi `--ink` | `CanvasText` |
| Fundal, contururile etichetelor | `--paper` | `Canvas` |
| Linii de cotă, axe | `--muted` | `GrayText` |
| Noduri, forța care poate fi trasă | `--brand` | `#4f46e5` |
| Forță axială | `--color-normal` | `#2222ff` |
| Forță tăietoare | `--color-shear` | `#00af00` |
| Moment încovoietor | `--color-moment` | `#ff2222` |
| Deformată | `--figure-ink`, apoi `--ink` | `CanvasText` |
| Încărcări | `--color-load` | `#ff8700` |
| Reacțiuni | `--color-reaction` | `#a020f0` |
| Bare întinse ale grinzilor cu zăbrele | `--color-tension`, apoi `--color-moment` | `#ff2222` |
| Bare comprimate ale grinzilor cu zăbrele | `--color-compression`, apoi `--color-normal` | `#2222ff` |
| Font | `--ebp-font`, apoi `--font-sans` | `inherit` |

Setează variabilele oriunde deasupra desenului, pe `:root` pentru tot site-ul:

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

Etichetele au un contur în culoarea `--paper`, ca să rămână lizibile peste hașuri: potrivește-l cu fundalul pe care stă desenul.

## Prop-ul `colors` {#the-colors-prop}

Ca să colorezi un singur desen, transmite oricare dintre tonuri după nume:

```vue
<StructurePlot :solver="solver" :colors="{ moment: '#c00', paper: 'transparent' }" />
```

Tonurile sunt `ink`, `paper`, `muted`, `brand`, `normal`, `shear`, `moment`, `deformed`, `load`, `reaction`, `tension` și `compression`. Merge orice culoare CSS, inclusiv un `var(…)`. `DEFAULT_COLORS` conține valoarea implicită a fiecăruia.

## Alb-negru {#black-and-white}

Pentru o lucrare fotocopiată sau un tipar alb-negru, setează fiecare ton colorat pe culoarea cernelii:

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

Diagramele rămân lizibile și fără culoare: sunt hașurate, iar momentul stă de partea fibrei întinse.

## Culori într-un fișier SVG {#colours-in-an-svg-file}

Un fișier scris de [`structureSvg`](/ro/plot/functions#a-standalone-svg-file) nu are o pagină în jurul lui, așa că folosește culori simple: `PRINT_COLORS`, culorile aplicației EduBeam pe alb. Opțiunea lui `colors` primește aceleași tonuri ca prop-ul, așa că setul alb-negru de mai sus funcționează și aici:

```ts
structureSvg(model, { colors: print }) // negru pe alb
structureSvg(model, { background: false }) // fără fundal, pentru un slide colorat
```

Doar culori simple: un `var(…)` nu înseamnă nimic pentru Word sau Inkscape.

## Fonturi {#fonts}

Textul folosește fontul paginii, prin `--ebp-font` sau `--font-sans`, cu cifre tabelare. Numele rândurilor, ca V(x) în `DiagramStack`, sunt scrise cu fonturile KaTeX când pagina le încarcă, iar altfel cu un font serif. Un fișier SVG folosește opțiunea lui `fontFamily`, implicit Helvetica sau Arial, pentru că nu poate cunoaște fontul paginii.

## Personalizarea animației {#restyling-the-animation}

Puținele reguli CSS de care are nevoie un desen sunt incluse direct în fiecare SVG, așa că nu e nevoie de o foaie de stiluri. Fiecare clasă are prefixul `ebp-`, iar o pagină le poate suprascrie. Fiecare strat este un `<g class="ebp-layer ebp-layer-{name}">`, care primește `ebp-on` când este afișat:

```css
/* Apariție mai lentă, pentru un amfiteatru */
.slides .ebp-animate .ebp-layer {
  transition-duration: 1s;
}
```

`PLOT_CSS` exportă regulile incluse, iar `toneVars(colors)` variabilele CSS pe care un desen le setează pe elementul său rădăcină, pentru a construi figuri proprii cu [funcțiile de desenare](/ro/plot/functions#drawing).
