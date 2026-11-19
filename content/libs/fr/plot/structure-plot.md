---
title: StructurePlot
description: "Dessiner une poutre, un portique ou un treillis plan avec StructurePlot : couches, figures progressives, réactions nommées, miniatures, unités, lecture au survol."
order: 2
group: Composants
source: site
---

# StructurePlot

`StructurePlot` dessine une structure entière, ajustée à la largeur de son conteneur : barres, rotules, appuis, charges, réactions d’appui, diagrammes de N, V et M et déformée. Donnez-lui un solveur, ou le [modèle simple](/fr/plot/model) qu’on en tire, et indiquez ce qu’il faut dessiner.

```vue
<StructurePlot :solver="solver" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

Toutes les props, avec leur type et leur valeur par défaut, figurent dans l’[API des composants](/fr/plot/components#structureplot).

La figure ci-dessous est un `StructurePlot` avec `nodeLabels`, `dimensions` et `hover` activés, et le format numérique de ce site, à quatre chiffres significatifs : passez d’un résultat à l’autre et pointez une barre pour lire ses valeurs.

::model-figure{caption="Un portique : pieds articulés, 10 kN/m sur la traverse, 15 kN en B"}
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

## Couches {#layers}

Une figure se compose de couches, peintes dans un ordre fixe, quel que soit l’ordre dans lequel vous les indiquez :

| Couche | Dessine |
| --- | --- |
| `members` | les barres, avec les rotules sous forme de petits cercles |
| `supports` | un symbole pour chaque appui, tourné pour les appuis inclinés |
| `loads` | les charges nodales et les charges sur barre, les charges thermiques et les tassements, avec leurs valeurs |
| `reactions` | les réactions d’appui, en flèches droites et courbes avec leurs valeurs ; ou, avec `reactionLabels: 'names'`, en [inconnues nommées](#reactions-as-unknowns) d’un exercice |
| `nodes` | chaque nœud sous forme de petit cercle |
| `nodeLabels` | les noms des nœuds |
| `dimensions` | des cotes en chaîne, comme dans un énoncé d’exercice : chaque intervalle entre nœuds et charges ponctuelles sous la structure, chaque étage à sa droite, et la cote totale sur une seconde ligne |
| `N`, `V`, `M` | les diagrammes de l’effort normal, de l’effort tranchant et du moment fléchissant |
| `w` | la déformée |

Si vous omettez `layers`, la figure dessine les barres, les appuis, les charges et les réactions, plus un résultat choisi selon la structure : `M` pour les poutres et les portiques, `N` pour un treillis, et `w` lorsqu’aucune barre n’est sollicitée, comme pour une poutre libre de se dilater sous une charge thermique.

Les diagrammes suivent l’application EduBeam : N et V sont hachurés perpendiculairement à la barre, et M se dessine du côté tendu, si bien qu’un moment positif apparaît sous la poutre. `:moment-on-tension-side="false"` dessine M du côté comprimé. Un treillis montre l’effort de chaque barre une seule fois, le long de la barre, coloré selon son signe.

## Figures progressives {#figures-that-build-up}

`reserve` liste les couches pour lesquelles il faut prévoir la place tant qu’elles sont masquées. La figure met en page dès le départ toutes les couches réservées : lorsqu’on en active une, elle apparaît en fondu à sa place et rien d’autre ne bouge.

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
// `frame` est un solveur calculé et `step` l’étape en cours : le composant complet est sur la page Diapositives et supports de cours
</script>

<template>
  <StructurePlot :solver="frame" :layers="stages[step]" :reserve="all" />
</template>
```

Avec `animate`, activé par défaut, les couches apparaissent en fondu et les barres se tracent d’une extrémité à l’autre. Avec `prefers-reduced-motion`, rien n’est animé. La page [Diapositives et supports de cours](/fr/plot/slides) place cette figure dans une présentation.

## Valeurs des diagrammes {#diagram-values}

Chaque valeur est écrite juste au-delà de l’extrémité de l’ordonnée à laquelle elle se rapporte, comme dans un manuel : chaque extrémité de barre où la valeur n’est pas nulle, les extremums intermédiaires, les deux valeurs d’un saut, et une seule fois à un nœud d’angle rigide. Les valeurs sont des nombres sans unité, dans l’unité d’affichage (kN pour N et V, kNm pour M), tout comme les réactions, comme dans l’application EduBeam ; l’unité n’est écrite qu’avec les données : charges, tassements et variations de température. Une étiquette qui chevaucherait une autre étiquette, une barre ou une flèche essaie d’autres emplacements à la même extrémité, et elle est omise si aucun n’est libre : deux nombres ne se superposent jamais. Les valeurs des charges et des réactions sont placées en premier, pour que les nombres d’un diagramme ne les chassent jamais. Les efforts dans les barres d’un treillis ne sont jamais omis : ils glissent le long de la barre, changent de côté et, en dernier recours, rétrécissent.

`result-label-mode="axis"` oriente les valeurs le long de leurs ordonnées, comme les écrit l’application EduBeam. Si le lecteur peut passer d’un mode à l’autre, donnez `:reserve-label-modes="['horizontal', 'axis']"` pour que le dessin ne bouge pas au changement.

## Réactions inconnues {#reactions-as-unknowns}

Un énoncé d’exercice demande les réactions d’appui : il doit donc les montrer sans leurs valeurs. `reaction-labels="names"` dessine une flèche pour chaque direction bloquée par un appui, orientée dans le sens compté comme positif : selon l’axe x du nœud (vers la droite, sauf si l’appui est tourné), vers le haut, et dans le sens trigonométrique pour un moment d’encastrement. Chacune porte le nom de son nœud, *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>*, en italique avec un véritable indice. Le signe de chaque réponse est alors défini sur le dessin : une réaction qui agit dans l’autre sens est négative.

```vue
<StructurePlot
  :model="model"
  :layers="['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']"
  reaction-labels="names"
/>
```

![En haut, une poutre encastrée-appuyée en énoncé d’exercice : encastrée en A, appui simple en B, 40 kN à mi-portée, cotes en chaîne de 3 m et 3 m avec 6 m au total, et les réactions dessinées en flèches nommées A_x, A_z, M_A et B_z. En bas, la même poutre avec les étiquettes de réaction par défaut : 27,5 et 12,5 vers le haut, un moment d’encastrement de 45, et le moment fléchissant de −45 à l’encastrement à 37,5 sous la charge](/screenshots/fr/p4-plot-reaction-names.webp){.shot-lg}

Les noms n’ont pas besoin de résultats : un modèle non calculé peut être dessiné comme énoncé. Laissez `reactionLabels` à `'values'` pour le corrigé. Les noms et les valeurs n’occupent pas la même place (une réaction horizontale nulle a un nom sur l’énoncé mais aucune flèche dans le corrigé) : une figure qui passe de l’un à l’autre doit prévoir la place des deux avec `:reserve-reaction-labels="['names', 'values']"`. Le dessin reste alors en place et seules les étiquettes changent. La carte d’exercice de la page [Exercices et examens](/fr/plot/exercises#the-exercise-in-a-page) passe de l’un à l’autre grâce à une prop `answers`, comme les [exercices d’entraînement](/fr/practice) de ce site lorsque l’étudiant demande la solution.

## Miniatures {#thumbnails}

`compact` dessine pour des vignettes d’environ 400 × 200 px : symboles plus petits, texte de 11,5 px, au plus deux valeurs par barre, et charges linéiques étiquetées par leur seule intensité, sans `q =`.

```vue
<StructurePlot v-for="t in tiles" :key="t.title" :solver="t.solver" compact :height="200" :title="t.title" />
```

La [galerie d’exemples](/fr/examples/) de ce site est dessinée ainsi.

## Taille {#size}

La figure mesure son conteneur et se met en page à cette largeur, en pixels réels. Sans `height`, sa hauteur suit le dessin, jusqu’à `maxHeight`, par défaut $\max(320;\ 0{,}75 \times \text{largeur})$. Tant qu’elle ne peut pas mesurer, par exemple côté serveur, elle utilise `width`, 640 px par défaut.

| Prop | Défaut | Définit |
| --- | --- | --- |
| `width` | 640, compact 400 | la largeur de mise en page tant que le conteneur n’est pas mesuré, px |
| `height` | suit le dessin | une hauteur fixe, px |
| `maxHeight` | $\max(320, 0.75w)$, compact aucune | la limite supérieure de la hauteur automatique |
| `padding` | 6 | l’espace autour du dessin, px |
| `fontSize` | 13, compact 11.5 | la taille du texte, px |
| `diagramSize` | 48, compact 26 | la longueur de la plus grande ordonnée, px |
| `deformedSize` | 30, compact 18 | le plus grand déplacement de la déformée, px |

### Plusieurs figures à la même échelle {#several-plots-at-one-scale}

Chaque figure met ses diagrammes à l’échelle de sa propre valeur maximale : un moment de 20 kNm paraît aussi grand qu’un moment de 80 kNm. Pour comparer, fixez l’échelle en pixels par unité SI avec `diagramScale` :

```vue
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams' // de Premiers pas : (portée en m, q en kN/m) => un solveur calculé

const spans = [4, 6, 8].map((L) => ({ L, solver: simpleBeam(L, 10) }))
// 0,5 px par kNm (0,5e-3 px par N·m) : les 80 kNm de la poutre de 8 m sont dessinés sur 40 px, les 20 kNm de celle de 4 m sur 10 px
const scale = { M: 0.5e-3 }
</script>

<template>
  <figure v-for="s in spans" :key="s.L">
    <StructurePlot :solver="s.solver" :layers="['members', 'supports', 'M']" :diagram-scale="scale" />
    <figcaption>L = {{ s.L }} m</figcaption>
  </figure>
</template>
```

## Unités et nombres {#units-and-numbers}

Les valeurs sont stockées en SI et converties uniquement pour l’affichage : kN, kNm, kN/m, m, mm, mrad et K par défaut. Vous pouvez remplacer n’importe quelle unité par un symbole et un facteur d’échelle, avec valeur affichée = valeur SI × échelle :

```vue
<StructurePlot :solver="solver" :units="{ force: { symbol: 'N', scale: 1 } }" />
```

Les nombres passent par un `Intl.NumberFormat`, par défaut en anglais avec au plus une décimale. Passez le vôtre pour l’accorder à la langue de la page :

```vue
<StructurePlot :solver="solver" :number-format="new Intl.NumberFormat('cs', { maximumFractionDigits: 2 })" />
```

Les signes moins sont de vrais signes moins (−), et une valeur arrondie à zéro ne s’affiche jamais −0. Les noms des unités sont `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` et `temperature` ; `KN_UNITS` et `SI_UNITS` sont exportés comme point de départ.

## Lecture des valeurs {#reading-values}

Avec `hover`, la figure lit les résultats affichés au point de la barre situé sous le pointeur. Elle marque chaque valeur là où elle est dessinée, par un point à l’extrémité de l’ordonnée de chaque diagramme affiché (aux deux extrémités dans un saut) ou sur la déformée, et les liste dans une pastille, par exemple `M = 54 kNm`, ou les deux côtés d’un saut, `V = 13.3 → −6.7 kN`. Le pointeur saisit une barre depuis n’importe quel point de son diagramme, pas seulement sur la barre elle-même. La figure émet aussi les valeurs sous forme de données :

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { StructurePlot, type Readout } from '@edubeam/plot'
import { portalFrame } from './frame' // de Diapositives et supports de cours : () => un solveur calculé

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

Une lecture est un objet `{ member, x, px, py, values, u }` : la barre, la position le long de celle-ci en mètres, le point à l’écran en px, `{ left, right }` pour chacun de `N`, `V`, `M` et `w` en unités SI, et le déplacement axial `u`. Elle vaut `null` quand le pointeur quitte la figure. Les figures interactives de ce site utilisent `hover` : pointez-en une.

Sans `hover`, une figure n’attache aucun écouteur d’événements : la page défile par-dessus, et toucher une figure placée dans un lien ouvre ce lien. Avec `hover`, la figure n’écoute que les événements de pointeur et préserve le défilement vertical et le zoom par pincement sur les écrans tactiles.

## Accessibilité {#accessibility}

Chaque figure est un `<svg role="img">` nommé par sa prop `title`, ou par une description de ce qu’elle montre, comme « Structure with its loads, reactions, bending moment ». Les couches réservées masquées sont `aria-hidden`.
