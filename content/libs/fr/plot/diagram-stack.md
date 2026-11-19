---
title: DiagramStack
description: "Dessiner avec DiagramStack une poutre au-dessus de ses diagrammes V(x), M(x) et w(x), les lire au curseur et laisser le lecteur déplacer une charge."
order: 3
source: site
---

# DiagramStack

`DiagramStack` dessine la figure de tous les manuels de statique : une poutre droite avec ses appuis, ses charges et ses réactions et, en dessous, sur le même axe x, son effort tranchant V(x), son moment fléchissant M(x) et sa flèche w(x). Un curseur lit toutes les lignes à la fois, et une charge ponctuelle facultative peut être déplacée le long de la poutre.

```vue
<DiagramStack :solver="solver" />
```

![DiagramStack : une poutre sur deux appuis de 6 m avec une charge de 20 kN que le lecteur peut faire glisser, ici à 4,3 m de l’appui gauche ; réactions de 5,7 kN et 14,3 kN, effort tranchant qui saute de 5,7 kN à −14,3 kN sous la charge, moment fléchissant maximal de 24,4 kNm au même endroit, et flèche dont la plus grande valeur est de 17 mm](/screenshots/fr/p2p-plot-diagram-stack.webp){.shot-lg}

Les barres doivent former une seule ligne horizontale, dessinée de gauche à droite. Tout autre cas, une ligne inclinée ou brisée ou une barre dessinée de droite à gauche, est refusé avec une erreur plutôt que mal dessiné, car l’axe x de la figure est celui de la poutre. Toutes les props figurent dans l’[API des composants](/fr/plot/components#diagramstack).

## Lignes {#rows}

| Prop | Défaut | Définit |
| --- | --- | --- |
| `rows` | `['V', 'M', 'w']` | les diagrammes, de haut en bas ; `'N'` est aussi disponible |
| `loadRow` | `true` | la poutre avec ses appuis, ses charges et ses réactions au-dessus des lignes |
| `members` | toutes les barres | les barres de la ligne de poutre, lorsque le modèle en contient d’autres |
| `rowHeights` | N 100, V 116, M 128, w 76 px | les hauteurs des lignes ; un peu plus petites sous 560 px de largeur |
| `maxHeight` | aucune | les lignes rétrécissent, jusqu’à 60 % au plus, pour que la figure tienne ; le texte garde sa taille |
| `ranges` | celle de chaque ligne | des plages de valeurs fixes par ligne, en unités SI |

V et N sont dessinés positifs vers le haut, M et w positifs vers le bas, comme dans la plupart des manuels : un moment positif et une flèche vers le bas se dessinent sous l’axe. Chaque ligne indique ses valeurs extrêmes.

## Le curseur de lecture {#the-reading-cursor}

`hover` est activé par défaut. Quand le pointeur passe sur la figure, un curseur vertical traverse toutes les lignes, avec la valeur de chacune dans une pastille. À moins de 8 px d’un saut, sous une charge ponctuelle ou sur un appui, le curseur s’y accroche, et V montre les deux côtés, comme `5.7 → −14.3 kN` sous la charge ci-dessus. Les valeurs sont aussi émises :

```vue
<DiagramStack :solver="solver" @readout="(r) => (reading = r)" />
```

Une lecture est un objet `{ x, values }` : `x` en mètres le long de la poutre, et `{ left, right }` par ligne en unités SI ; elle vaut `null` quand le pointeur quitte la figure.

## Une charge que le lecteur déplace {#a-load-the-reader-can-drag}

Donnez à `v-model:load-at` la position d’une charge ponctuelle et celle-ci reçoit une poignée : le lecteur la fait glisser avec le pointeur, ou lui donne le focus et utilise les touches fléchées. Le composant ne fait que signaler la nouvelle position. Recalculez la poutre avec la charge à cet endroit et renvoyez le nouveau solveur, comme le fait `MovingLoad.vue` :

```vue [MovingLoad.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { beamLine, DiagramStack, lineDiagram, modelFromSolver, rowRange, type StackRow } from '@edubeam/plot'

const L = 6 // m
const P = 20e3 // N

/** La poutre avec la charge ponctuelle à `at` mètres de A, calculée. */
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

/** La plage de chaque ligne sur toutes les positions de la charge : les diagrammes grandissent et rétrécissent au lieu de changer d’échelle. */
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

Avec la charge à 4,3 m, la figure montre les réactions de 5,7 kN et 14,3 kN, le saut de l’effort tranchant de 5,7 à −14,3 kN sous la charge et, au même endroit, $M = 5{,}67 \cdot 4{,}3 = 24{,}4$ kNm. Sans `ranges`, chaque ligne se remettrait à l’échelle de ses propres extremums à mesure que la charge se déplace, et les diagrammes sembleraient ne pas changer du tout.

| Prop | Défaut | Définit |
| --- | --- | --- |
| `loadAt` | aucune | la position de la charge, en m depuis le début de la ligne ; avec `v-model:load-at` |
| `loadLabel` | `P = …` | le texte à côté de la poignée |
| `loadStep` | 0.05 | le pas auquel le glissement est arrondi, m ; les touches fléchées déplacent la charge de ce pas |

La poignée est un `role="slider"` qui peut recevoir le focus, avec sa plage et sa position pour les lecteurs d’écran. Les touches fléchées la déplacent de `loadStep`, les touches Page précédente et Page suivante de 1 m, et Début et Fin la portent aux extrémités de la poutre. Sur un écran tactile, on peut la faire glisser du doigt, et le défilement vertical fonctionne toujours au-dessus de la figure.

La poignée remplace la force ponctuelle que le modèle calculé porte à `loadAt` : cette force est dessinée sous forme de poignée, étiquetée par son intensité, sauf si vous donnez `loadLabel`. Placez la charge dans le modèle à la même position, comme le fait `solveWithLoadAt`.

## Taille et rendu côté serveur {#size-and-server-rendering}

La figure mesure son conteneur et se met en page à cette largeur, 320 px au minimum. Tant qu’elle ne peut pas mesurer, elle utilise `width`, 720 px par défaut. Le texte fait 12,5 px (`fontSize`) et ne rétrécit jamais avec la figure.
