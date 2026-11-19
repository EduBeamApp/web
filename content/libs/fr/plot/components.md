---
title: API des composants
description: "Les props et les événements de StructurePlot et DiagramStack dans @edubeam/plot 0.2.0, avec types et défauts, le plugin EduBeamPlot et les types exportés."
order: 8
group: Référence
source: site
---

# API des composants

Les props et les événements des deux composants, tels que déclarés dans @edubeam/plot 0.2.0. Aucun des deux n’a de slot. Les valeurs en unités SI sont signalées comme telles ; les tailles sont en pixels CSS.

## StructurePlot {#structureplot}

```ts
import { StructurePlot } from '@edubeam/plot'
```

Dessine une structure plane et ses résultats. Guide : [StructurePlot](/fr/plot/structure-plot).

### Props {#props}

| Prop | Type | Défaut | Description |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Un solveur @edubeam/fem. Les résultats sont dessinés dès que son cas de charge est calculé. |
| `model` | `PlotModel` | – | Ou les données simples que produit [`modelFromSolver`](/fr/plot/model). Prioritaire sur `solver`. |
| `loadCase` | `number` | `0` | Indice dans `solver.loadCases` |
| `revision` | `number` | `0` | À modifier pour redessiner un solveur modifié sur place |
| `layers` | `readonly PlotLayer[]` | barres, appuis, charges, réactions et un résultat | Ce qu’il faut dessiner : `'nodes'`, `'nodeLabels'`, `'dimensions'`, `'members'`, `'supports'`, `'loads'`, `'reactions'`, `'N'`, `'V'`, `'M'`, `'w'` |
| `reserve` | `readonly PlotLayer[]` | `layers` | Couches dont la place est réservée tant qu’elles sont masquées |
| `compact` | `boolean` | `false` | Dessin de miniature : symboles plus petits, au plus deux valeurs par barre |
| `units` | `Partial<Units>` | `KN_UNITS` | Unités d’affichage |
| `numberFormat` | `Intl.NumberFormat` | anglais, au plus 1 décimale | Formate tous les nombres |
| `colors` | `Partial<PlotColors>` | – | Couleurs remplacées, par teinte : [Thèmes et couleurs](/fr/plot/theming#the-colors-prop) |
| `width` | `number` | `640`, compact `400` | Largeur avant la mesure du conteneur, par exemple côté serveur |
| `height` | `number` | – | Hauteur fixe. Sans elle, la hauteur suit le dessin. |
| `maxHeight` | `number` | `max(320, 0.75 × width)`, compact aucune | Limite supérieure de la hauteur automatique |
| `padding` | `number` | `6` | Espace autour du dessin |
| `fontSize` | `number` | `13`, compact `11.5` | Taille du texte |
| `diagramSize` | `number` | `48`, compact `26` | Longueur de la plus grande ordonnée d’un diagramme |
| `deformedSize` | `number` | `30`, compact `18` | Plus grand déplacement de la déformée |
| `diagramScale` | `Partial<Record<ResultLayer, number>>` | – | Échelle fixe en px par unité SI pour un résultat, à la place de `diagramSize` ou `deformedSize` |
| `momentOnTensionSide` | `boolean` | `true` | M du côté tendu ; `false` pour le côté comprimé |
| `resultLabelMode` | `'horizontal' \| 'axis'` | `'horizontal'` | Valeurs horizontales, ou orientées le long de leur ordonnée |
| `reactionLabels` | `'values' \| 'names'` | `'values'` | Les réactions telles qu’elles agissent, avec leur valeur ; ou, pour un exercice, chaque direction bloquée nommée (*A<sub>x</sub>*, *M<sub>A</sub>*) et orientée dans le sens compté comme positif. Les noms n’ont pas besoin de résultats : [Réactions inconnues](/fr/plot/structure-plot#reactions-as-unknowns) |
| `reserveLabelModes` | `readonly ResultLabelMode[]` | – | Modes d’étiquetage dont la place est réservée en plus du mode courant |
| `reserveReactionLabels` | `readonly ReactionLabels[]` | – | Styles d’étiquettes de réaction dont la place est réservée en plus de `reactionLabels`, pour qu’un exercice qui devient son corrigé garde un dessin immobile |
| `animate` | `boolean` | `true` | Fait apparaître les couches en fondu et trace les barres. Toujours désactivé avec `prefers-reduced-motion`. |
| `hover` | `boolean` | `false` | Lit les valeurs sous le pointeur, marquées à l’extrémité de l’ordonnée de chaque diagramme. Désactivé, la figure ne réagit à aucune entrée du pointeur. |
| `title` | `string` | une description de ce qui est affiché | Nom accessible de la figure |

Sans `layers`, le résultat est `M` pour les poutres et les portiques, `N` pour un treillis, et `w` lorsqu’aucune barre n’est sollicitée (`defaultResultLayer`).

### Événements {#events}

| Événement | Données | Quand |
| --- | --- | --- |
| `readout` | `Readout \| null` | Avec `hover` : le point de la barre sous le pointeur et ses résultats ; `null` quand le pointeur quitte la figure |

```ts
interface Readout {
  readonly member: string
  readonly x: number // m depuis le nœud initial de la barre
  readonly px: number // le point à l’écran, px
  readonly py: number
  readonly values: Readonly<Record<'N' | 'V' | 'M' | 'w', SidedValue>> // unités SI
  readonly u: number // déplacement selon l’axe x local de la barre, m
}
interface SidedValue {
  readonly left: number
  readonly right: number // égal à left là où le résultat est continu
}
```

## DiagramStack {#diagramstack}

```ts
import { DiagramStack } from '@edubeam/plot'
```

Dessine une poutre droite au-dessus de ses diagrammes, sur un même axe x. Les barres doivent former une seule ligne horizontale, dessinée de gauche à droite ; dans tout autre cas, le composant lève une exception. Guide : [DiagramStack](/fr/plot/diagram-stack).

### Props {#props-1}

| Prop | Type | Défaut | Description |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | La poutre calculée |
| `model` | `PlotModel` | – | Ou les données simples de `modelFromSolver` ; prioritaire |
| `loadCase` | `number` | `0` | Indice dans `solver.loadCases` |
| `revision` | `number` | `0` | À modifier pour redessiner un solveur modifié sur place |
| `members` | `readonly string[]` | toutes les barres | Les barres de la ligne de poutre |
| `rows` | `readonly StackRow[]` | `['V', 'M', 'w']` | Lignes de diagrammes, de haut en bas, parmi `'N'`, `'V'`, `'M'`, `'w'` |
| `loadRow` | `boolean` | `true` | La poutre avec ses appuis, ses charges et ses réactions au-dessus des lignes |
| `ranges` | `Partial<Record<StackRow, readonly [number, number]>>` | celle de chaque ligne | Plage de valeurs par ligne, unités SI |
| `rowHeights` | `Partial<Record<StackRow, number>>` | N 100, V 116, M 128, w 76 ; sous 560 px de largeur 88, 96, 104, 64 | Hauteurs des lignes avant leur mise à l’échelle par `maxHeight` |
| `maxHeight` | `number` | – | Les lignes rétrécissent, jusqu’à 60 % au plus, pour que la figure tienne. Le texte garde sa taille. |
| `units` | `Partial<Units>` | `KN_UNITS` | Unités d’affichage |
| `numberFormat` | `Intl.NumberFormat` | anglais, au plus 1 décimale | Formate tous les nombres |
| `colors` | `Partial<PlotColors>` | – | Couleurs remplacées |
| `width` | `number` | `720` | Largeur avant la mesure du conteneur ; la largeur utilisée vaut au moins 320 |
| `fontSize` | `number` | `12.5` | Taille du texte |
| `hover` | `boolean` | `true` | Le curseur de lecture. Désactivé, la figure ne réagit à aucune entrée du pointeur. |
| `loadAt` | `number` | – | Position (m le long de la ligne) d’une charge ponctuelle que le lecteur peut faire glisser ; à utiliser avec `v-model:load-at` |
| `loadLabel` | `string` | `P = …` avec l’intensité de la charge | Texte à côté de la charge déplaçable |
| `loadStep` | `number` | `0.05` | Pas auquel le glissement est arrondi, m ; les touches fléchées déplacent la charge de ce pas |
| `title` | `string` | une description des lignes | Nom accessible de la figure |

### Événements {#events-1}

| Événement | Données | Quand |
| --- | --- | --- |
| `update:loadAt` | `number` | Le lecteur a déplacé la charge : sa nouvelle position, m. Pilote `v-model:load-at`. |
| `readout` | `StackReadout \| null` | Les valeurs du curseur sur toutes les lignes ; `null` quand le pointeur quitte la figure |

```ts
interface StackReadout {
  readonly x: number // m le long de la ligne de poutre
  readonly values: Partial<Record<'N' | 'V' | 'M' | 'w', { readonly left: number; readonly right: number }>> // SI
}
```

## Le plugin {#the-plugin}

```ts
import { EduBeamPlot } from '@edubeam/plot'

app.use(EduBeamPlot) // enregistre <StructurePlot> et <DiagramStack> globalement
```

Il est facultatif : importer les composants par leur nom est plus léger, et un bundler retire le plugin d’un build qui ne l’utilise pas.

## Types {#types}

Pour écrire des wrappers typés autour des composants, le paquet exporte leurs props et leurs événements :

```ts
import type { PlotLayer, StructurePlotProps } from '@edubeam/plot'

const figure: StructurePlotProps = { layers: ['members', 'supports', 'M'] satisfies PlotLayer[], compact: true }
```

| Type | Représente |
| --- | --- |
| `StructurePlotProps`, `StructurePlotEmits` | Les props et les événements de `StructurePlot` |
| `DiagramStackProps`, `DiagramStackEmits` | Les props et les événements de `DiagramStack` |
| `Readout`, `ReadoutQuantity`, `SidedValue`, `StackReadout` | Les données des événements |
| `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `StackRow` | Les noms des couches, des résultats, des modes d’étiquetage, des étiquettes de réaction et des lignes |
| `Units`, `Unit`, `UnitKind` | Unités d’affichage : `{ symbol, scale }` par grandeur |
| `PlotColors` | Couleurs par teinte |
| `PlotModel` | Le modèle simple : [Modèle de dessin](/fr/plot/model) |

Les autres exports, dont `structureSvg` pour les fichiers SVG et les fonctions qui produisent le dessin, sont décrits dans [Fonctions](/fr/plot/functions).
