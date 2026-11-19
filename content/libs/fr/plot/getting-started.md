---
title: Premiers pas
description: "Installer @edubeam/plot, dessiner dans Vue 3 une poutre de @edubeam/fem avec charges, réactions et moment fléchissant, la redessiner et l’enregistrer en SVG."
order: 1
group: Introduction
source: site
---

# Premiers pas

La bibliothèque de dessin @edubeam/plot dessine en SVG une poutre, un portique ou un treillis plan avec ses résultats : barres, appuis, charges, réactions d’appui, diagrammes de N, V et M et déformée, exactement comme les figures de ce site. Vous lui donnez un modèle calculé par [@edubeam/fem](/fr/solver), le solveur d’[EduBeam]{.edubeam} ; elle se charge de la mise en page, de l’échelle et de la place de chaque valeur.

Les enseignants s’en servent pour des [exercices et des examens](/fr/plot/exercises) générés à partir d’une graine (valeur initiale du générateur aléatoire), pour des [diapositives](/fr/plot/slides) où la figure se construit clic après clic, et pour les figures des supports de cours, dans une page web ou en fichiers pour LaTeX et Word. Les [exercices d’entraînement](/fr/practice) et le [générateur d’examens](/fr/exam) de ce site reposent sur elle.

::div{.actions}
[Dessiner votre première figure](#draw-a-solved-model) [Générer des exercices](/fr/plot/exercises)
::

## Installation {#install}

```bash
npm install @edubeam/plot @edubeam/fem vue
```

Vue 3.5 ou plus récent et le solveur sont des *peer dependencies* : votre application n’en garde qu’une copie de chacun. Le paquet est uniquement ESM, fournit ses propres types et n’a besoin d’aucune feuille de style. Il fonctionne avec Node 20.19 ou plus récent ; pour exécuter tel quel un script écrit en TypeScript, avec `node script.ts`, il faut Node 22.18 ou plus récent.

## Dessiner un modèle calculé {#draw-a-solved-model}

Deux fichiers suffisent. Le premier, `beams.ts`, construit et calcule une poutre avec @edubeam/fem. C’est une simple fonction : le même modèle peut ainsi alimenter une page, une diapositive et un script.

```ts [beams.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Poutre sur deux appuis de `span` m sous `q` kN/m, calculée. Le solveur travaille en unités SI. */
export const simpleBeam = (span: number, q: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 }) // acier, Pa
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 }) // IPE 200, sans déformation d’effort tranchant
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // appui articulé
  domain.createNode('B', [span, 0, 0], [DofID.Dz]) // appui simple
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true) // N/m, +z vers le bas
  solver.solve()
  return solver
}
```

Le second, `BeamFigure.vue`, transmet le solveur à `StructurePlot` et lui indique ce qu’il faut dessiner :

```vue [BeamFigure.vue]
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams'

const beam = simpleBeam(6, 12)
</script>

<template>
  <StructurePlot :solver="beam" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
</template>
```

C’est toute la figure : la poutre sur ses appuis, la charge de 12 kN/m, les deux réactions de 36 kN et le moment fléchissant, $qL^2/8 = 54$ kNm à mi-portée, dessiné du côté tendu :

::model-figure{caption="Ce que dessine BeamFigure.vue : une portée de 6 m sous 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
labels: horizontal
---
::

La figure occupe toute la largeur de son conteneur et calcule elle-même sa hauteur. Les textes, les symboles et les épaisseurs de trait gardent leur taille en pixels quelle que soit la taille de la structure : la figure reste lisible même sur un téléphone. Si vous omettez `layers`, la figure choisit elle-même le résultat : M pour les poutres et les portiques, N pour un treillis. Toutes les [couches](/fr/plot/structure-plot#layers) sont décrites avec `StructurePlot` ; la construction des modèles est expliquée dans la [documentation du solveur](/fr/solver/getting-started).

## Quand le modèle change {#when-the-model-changes}

Une figure lit le solveur qu’on lui donne, mais ne le surveille pas. Quand quelque chose change, relancez le calcul et transmettez le nouveau solveur. C’est exactement ce que fait un `computed` :

```vue [LoadSlider.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams'

const q = ref(12) // kN/m
const beam = computed(() => simpleBeam(6, q.value))
</script>

<template>
  <input v-model.number="q" type="range" min="1" max="30" />
  <StructurePlot :solver="beam" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
</template>
```

Une telle poutre se calcule en une milliseconde environ : la figure suit le curseur pendant qu’il se déplace. Vous avez modifié un solveur sur place au lieu d’en créer un nouveau ? Incrémentez la prop `revision` et la figure le relit.

::callout{type="tip" title="Tenez les solveurs à l’écart de la réactivité profonde"}
Un `computed`, une prop ou une simple `const` conservent le solveur tel quel. Pour en garder un dans l’état d’un composant, utilisez `shallowRef` ou enveloppez-le dans `markRaw` : un `ref` ordinaire obligerait Vue à parcourir tout le solveur pour le rendre réactif, sans aucune utilité.
::

## L’enregistrer dans un fichier {#save-it-as-a-file}

Pour une figure destinée à LaTeX, Word ou Inkscape, `structureSvg` écrit le même dessin sous forme de fichier SVG autonome, avec des couleurs fixes. Il ne lui faut ni Vue ni navigateur, seulement Node. Enregistrez ceci sous `beam-svg.ts`, à côté de `beams.ts` :

```ts [beam-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { simpleBeam } from './beams.ts'

const svg = structureSvg(modelFromSolver(simpleBeam(6, 12)), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
})
writeFileSync('beam.svg', svg)
```

Lancez-le avec `node beam-svg.ts` (Node 22.18 ou plus récent ; avec les versions antérieures, `npx tsx beam-svg.ts`). Les options, et la façon d’insérer le fichier dans LaTeX et Word, sont décrites dans [Un fichier SVG autonome](/fr/plot/functions#a-standalone-svg-file).

## La figure en colonne {#the-stacked-figure}

`DiagramStack` dessine la figure de tous les manuels de statique : une poutre droite avec ses charges et, en dessous, sur le même axe x, son effort tranchant V(x), son moment fléchissant M(x) et sa flèche w(x). Avec `v-model:load-at`, le lecteur peut faire glisser une charge ponctuelle le long de la poutre et voir les diagrammes la suivre :

```vue
<DiagramStack v-model:load-at="at" :solver="solveWithLoadAt(at)" />
```

L’exemple complet se trouve sur la page [DiagramStack](/fr/plot/diagram-stack).

## L’utiliser partout {#use-it-everywhere}

Pour enregistrer les deux composants globalement au lieu de les importer là où vous les utilisez :

```ts [main.ts]
import { createApp } from 'vue'
import { EduBeamPlot } from '@edubeam/plot'
import App from './App.vue'

createApp(App).use(EduBeamPlot).mount('#app') // <StructurePlot> et <DiagramStack> dans tous les templates
```

Avec des imports nommés, le bundle reste plus léger : une page qui n’importe que `StructurePlot` ne reçoit ni `DiagramStack` ni le plugin. Les deux composants s’affichent aussi côté serveur, dans Nuxt ou VitePress : voir [Intégration](/fr/plot/embedding).

## Pour aller plus loin {#next}

::card-grid{cols="2"}
:::card{title="Exercices et examens" icon="lucide:dices" to="/fr/plot/exercises"}
Un exercice différent pour chaque étudiant à partir d’une graine, avec son corrigé, imprimé ou enregistré pour LaTeX.
:::
:::card{title="Diapositives et supports de cours" icon="lucide:presentation" to="/fr/plot/slides"}
Des figures qui se construisent clic après clic dans Slidev, Vue ou Beamer, et les mêmes figures pour les supports de cours.
:::
:::card{title="StructurePlot" icon="lucide:frame" to="/fr/plot/structure-plot"}
Couches, cotes, miniatures, tailles, unités et lecture des valeurs au pointeur.
:::
:::card{title="DiagramStack" icon="lucide:rows-3" to="/fr/plot/diagram-stack"}
Une poutre au-dessus de ses diagrammes de V, M et w, avec une charge que le lecteur peut faire glisser.
:::
::
