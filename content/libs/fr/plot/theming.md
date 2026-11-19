---
title: Thèmes et couleurs
description: "Colorer les figures de @edubeam/plot par des propriétés CSS ou la prop colors, suivre le thème clair ou sombre, imprimer en noir et blanc, régler police et animations."
order: 4
source: site
---

# Thèmes et couleurs

Une figure prend ses couleurs dans les propriétés personnalisées CSS de la page : les thèmes clair et sombre d’un site s’appliquent tels quels. Là où la page n’en définit aucune, les couleurs système CSS prennent le relais ; elles suivent le `color-scheme` de la page. Sans aucun réglage, une figure est noire sur blanc dans une page claire et claire sur fond sombre dans une page sombre.

## Propriétés personnalisées {#custom-properties}

| Utilisée pour | Propriété personnalisée | Valeur de repli |
| --- | --- | --- |
| Barres, appuis, texte | `--figure-ink`, puis `--ink` | `CanvasText` |
| Fond, halos des étiquettes | `--paper` | `Canvas` |
| Lignes de cote, axes | `--muted` | `GrayText` |
| Nœuds, charge déplaçable | `--brand` | `#4f46e5` |
| Effort normal | `--color-normal` | `#2222ff` |
| Effort tranchant | `--color-shear` | `#00af00` |
| Moment fléchissant | `--color-moment` | `#ff2222` |
| Déformée | `--figure-ink`, puis `--ink` | `CanvasText` |
| Charges | `--color-load` | `#ff8700` |
| Réactions d’appui | `--color-reaction` | `#a020f0` |
| Barres de treillis tendues | `--color-tension`, puis `--color-moment` | `#ff2222` |
| Barres de treillis comprimées | `--color-compression`, puis `--color-normal` | `#2222ff` |
| Police | `--ebp-font`, puis `--font-sans` | `inherit` |

Définissez les propriétés n’importe où au-dessus de la figure, sur `:root` pour tout un site :

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

Les étiquettes reçoivent un halo de la couleur `--paper` pour rester lisibles sur les hachures : accordez-la au fond sur lequel se trouve la figure.

## La prop `colors` {#the-colors-prop}

Pour colorer une seule figure, passez n’importe quelle teinte par son nom :

```vue
<StructurePlot :solver="solver" :colors="{ moment: '#c00', paper: 'transparent' }" />
```

Les teintes sont `ink`, `paper`, `muted`, `brand`, `normal`, `shear`, `moment`, `deformed`, `load`, `reaction`, `tension` et `compression`. Toute couleur CSS convient, y compris un `var(…)`. `DEFAULT_COLORS` contient la valeur par défaut de chacune.

## Noir et blanc {#black-and-white}

Pour un sujet photocopié ou une impression en noir et blanc, donnez à toutes les teintes colorées la couleur de l’encre :

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

Les diagrammes restent lisibles sans couleur : ils sont hachurés, et le moment se dessine du côté tendu.

## Couleurs dans un fichier SVG {#colours-in-an-svg-file}

Un fichier écrit par [`structureSvg`](/fr/plot/functions#a-standalone-svg-file) n’a pas de page autour de lui : il utilise donc des couleurs fixes, `PRINT_COLORS`, celles de l’application EduBeam sur fond blanc. Son option `colors` accepte les mêmes teintes que la prop, si bien que le jeu noir et blanc ci-dessus y fonctionne aussi :

```ts
structureSvg(model, { colors: print }) // noir sur blanc
structureSvg(model, { background: false }) // sans fond, pour une diapositive colorée
```

Uniquement des couleurs fixes : un `var(…)` ne signifie rien pour Word ou Inkscape.

## Polices {#fonts}

Le texte utilise la police de la page, via `--ebp-font` ou `--font-sans`, avec des chiffres tabulaires. Les noms de lignes comme V(x) dans `DiagramStack` sont composés dans les polices de KaTeX lorsque la page les charge, sinon dans une police à empattements. Un fichier SVG utilise son option `fontFamily`, Helvetica ou Arial par défaut, puisqu’il ne peut pas connaître la police de la page.

## Personnaliser l’animation {#restyling-the-animation}

Les quelques règles CSS dont une figure a besoin sont intégrées à chaque SVG : aucune feuille de style n’est nécessaire. Toutes les classes portent le préfixe `ebp-`, et une page peut les redéfinir. Chaque couche est un `<g class="ebp-layer ebp-layer-{name}">`, qui reçoit `ebp-on` lorsqu’elle est affichée :

```css
/* Fondus plus lents, pour un amphithéâtre */
.slides .ebp-animate .ebp-layer {
  transition-duration: 1s;
}
```

`PLOT_CSS` exporte les règles intégrées, et `toneVars(colors)` les propriétés personnalisées qu’une figure définit sur son élément racine, pour construire vos propres figures à partir des [fonctions de dessin](/fr/plot/functions#drawing).
