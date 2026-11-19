---
title: Diapositives et supports de cours
description: "Des figures de cours avec @edubeam/plot : construites clic après clic dans Slidev, Vue ou Beamer, calculées en direct, en SVG pour le polycopié, PowerPoint et Word."
order: 6
source: site
---

# Diapositives et supports de cours

Montrez une structure dans l’ordre où vous l’expliquez : d’abord la géométrie, puis les appuis et les charges, ensuite les réactions d’appui et enfin le moment fléchissant. Une figure dessinée à partir d’un modèle calculé se construit sur place, une couche par clic, et elle est toujours juste. Le même modèle fournit ensuite les figures de votre polycopié.

![Une diapositive Slidev aux clics 0, 2 et 4 : les nœuds d’un portique avec ses cotes, puis le portique sur ses appuis avec ses charges, enfin les réactions et le moment fléchissant](/screenshots/fr/p2p-plot-slidev-steps.webp){.shot-md}

## Une figure qui se construit {#a-figure-that-builds-up}

Deux fichiers. `frame.ts` construit et calcule la structure :

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Un portique de 6 m sur 4 m, pieds articulés, 10 kN/m sur la traverse et 15 kN qui pousse en B. */
export const portalFrame = (): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 }) // IPE 300
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [0, 0, -4]) // z est orienté vers le bas : 4 m plus haut
  domain.createNode('C', [6, 0, -4])
  domain.createNode('D', [6, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  domain.createBeam2D(2, ['B', 'C'], 1, 1)
  domain.createBeam2D(3, ['C', 'D'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(2, [0, 10e3], true)
  solver.loadCases[0].createNodalLoad('B', { [DofID.Dx]: 15e3 })
  solver.solve()
  return solver
}
```

`BuildUp.vue` la dessine par étapes. Chaque étape liste les couches qu’elle affiche, et `reserve` les met toutes en page dès le premier clic : chaque couche apparaît en fondu à sa place et rien ne bouge.

```vue [BuildUp.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { StructurePlot, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame'

const props = defineProps<{ step: number }>()

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'], // la géométrie
  ['nodeLabels', 'members', 'supports'], // la structure
  ['nodeLabels', 'members', 'supports', 'loads'], // ses charges
  ['members', 'supports', 'loads', 'reactions'], // les réactions
  ['members', 'supports', 'reactions', 'M'], // et le moment fléchissant
]
const all = [...new Set(stages.flat())] // mises en page dès la première étape : rien ne bouge ensuite
const layers = computed(() => stages[Math.min(props.step, stages.length - 1)])

const frame = portalFrame()
</script>

<template>
  <StructurePlot :solver="frame" :layers="layers" :reserve="all" :height="360" />
</template>
```

Une couche peut aussi disparaître : la dernière étape retire les charges pour laisser de la place au moment. `:height="360"` maintient la figure dans les limites d’une diapositive. Les barres se tracent d’une extrémité à l’autre lors de leur première apparition, et les couches apparaissent en fondu en une demi-seconde ; les deux effets sont désactivés avec `prefers-reduced-motion`, et `:animate="false"` les désactive pour tout le monde. Pour les ralentir dans un amphithéâtre, voir [Personnaliser l’animation](/fr/plot/theming#restyling-the-animation).

## Dans Slidev {#in-slidev}

[Slidev](https://sli.dev) crée des diapositives à partir de Markdown avec Vue : le composant y fonctionne tel quel. Installez les bibliothèques dans la présentation :

```bash
npm install @edubeam/plot @edubeam/fem
```

Placez `frame.ts` et `BuildUp.vue` dans le dossier `components/` de la présentation, et laissez les clics de la diapositive piloter l’étape dans `slides.md` :

```md [slides.md]
---
clicks: 4
---

# From geometry to bending moment

<BuildUp :step="$clicks" />
```

`clicks: 4` donne quatre clics à la diapositive, et `$clicks` les compte à partir de 0. Chaque appui sur la touche fléchée affiche l’étape suivante ; revenir en arrière la masque de nouveau. `slidev export` produit un PDF de la présentation, une page par clic avec `--with-clicks`.

## Dans n’importe quelles diapositives Vue {#in-any-vue-slides}

Ailleurs, gérez l’étape vous-même :

```vue
<script setup lang="ts">
import { ref } from 'vue'
import BuildUp from './BuildUp.vue'

const step = ref(0)
</script>

<template>
  <BuildUp :step="step" />
  <button type="button" @click="step = Math.max(0, step - 1)">Back</button>
  <button type="button" @click="step++">Next</button>
</template>
```

## Calculer en direct {#solve-it-live}

Le solveur met quelques millisecondes pour un portique comme celui-ci : pendant le cours, vous pouvez modifier la structure et la recalculer sur-le-champ. Liez une charge à un curseur et transmettez à chaque fois un nouveau modèle calculé, comme dans [Quand le modèle change](/fr/plot/getting-started#when-the-model-changes).

- **Une charge mobile.** [DiagramStack](/fr/plot/diagram-stack#a-load-the-reader-can-drag) permet aux étudiants de faire glisser une charge ponctuelle le long d’une poutre et de voir l’effort tranchant et le moment fléchissant la suivre.
- **Des cas côte à côte.** Fixez [`diagramScale`](/fr/plot/structure-plot#several-plots-at-one-scale) et deux figures dessinent leurs moments à la même échelle : le plus grand paraît plus grand.
- **Lecture des valeurs.** Avec `hover`, pointer une barre marque la valeur à l’extrémité de l’ordonnée de chaque diagramme : voir [Lecture des valeurs](/fr/plot/structure-plot#reading-values).

## Figures pour Beamer, PowerPoint et Word {#figures-for-beamer-powerpoint-and-word}

Une présentation réalisée avec LaTeX Beamer ou PowerPoint, ou un polycopié rédigé dans Word, reçoit la figure sous forme de fichier. `structureSvg` écrit la figure en SVG autonome, aux couleurs fixes, avec la même mise en page que `StructurePlot`. Un script Node, `frame-svg.ts`, à côté de `frame.ts` :

```ts [frame-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![Le portique en fichier SVG autonome, rendu par CairoSVG : les charges, les réactions, 20 et 40 vers le haut et 2,3 et 12,7 horizontalement, et le moment fléchissant de −50,7 en C à 29,3 dans la traverse](/screenshots/fr/p2p-plot-frame-svg.webp){.shot-lg}

PowerPoint et Word (2019 et Microsoft 365) insèrent le SVG tel quel. LaTeX le prend en PDF : convertissez-le avec `cairosvg frame.svg -o frame.pdf` ou Inkscape, ou laissez `\includesvg` du paquet `svg` s’en charger. Les détails sont dans [Figures pour LaTeX et Word](/fr/plot/exercises#figures-for-latex-and-word), et toutes les options dans [Un fichier SVG autonome](/fr/plot/functions#a-standalone-svg-file).

### Une figure progressive dans Beamer {#a-build-up-in-beamer}

Un fichier est ajusté aux couches qu’il dessine : des fichiers écrits séparément pour chaque étape ne se superposeraient pas. Donnez à `structureSvg` le même `reserve` que dans `BuildUp.vue`, toutes les couches de toutes les étapes, et chaque fichier a la même taille, avec la structure au même endroit. `frame-stages.ts` écrit un fichier par étape :

```ts [frame-stages.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'],
  ['nodeLabels', 'members', 'supports'],
  ['nodeLabels', 'members', 'supports', 'loads'],
  ['members', 'supports', 'loads', 'reactions'],
  ['members', 'supports', 'reactions', 'M'],
]
const all = [...new Set(stages.flat())]
const frame = modelFromSolver(portalFrame())

stages.forEach((layers, i) => {
  writeFileSync(`frame-${i + 1}.svg`, structureSvg(frame, { layers, reserve: all }))
})
```

Convertissez les fichiers en PDF :

```bash
for i in 1 2 3 4 5; do cairosvg frame-$i.svg -o frame-$i.pdf; done
```

et donnez à chacun son propre overlay. Chaque fichier contient une étape complète : le frame Beamer en montre un à la fois et, comme ils se superposent exactement, chaque clic semble ajouter une couche.

```latex [lecture.tex]
\begin{frame}{From geometry to bending moment}
  \centering
  \includegraphics<1>[width=0.8\linewidth]{frame-1.pdf}%
  \includegraphics<2>[width=0.8\linewidth]{frame-2.pdf}%
  \includegraphics<3>[width=0.8\linewidth]{frame-3.pdf}%
  \includegraphics<4>[width=0.8\linewidth]{frame-4.pdf}%
  \includegraphics<5>[width=0.8\linewidth]{frame-5.pdf}
\end{frame}
```

Dans PowerPoint, placez les cinq fichiers sur cinq diapositives consécutives, sans transition : chaque étape ressemble à un clic pendant le cours.

## Polycopiés et documents distribués {#notes-and-handouts}

- **Supports de cours sur le web.** VitePress et Nuxt génèrent les figures au moment du build : elles sont dans le HTML avant l’exécution du moindre script. Voir [Intégration](/fr/plot/embedding).
- **Polycopiés imprimés.** Écrivez les figures avec `structureSvg` dans une page HTML et imprimez-la, comme le fait le [générateur de sujets](/fr/plot/exercises#print-a-test), ou insérez les fichiers dans LaTeX ou Word.
- **Un seul modèle pour toutes les figures.** Le même `frame.ts` alimente les diapositives, le polycopié et l’énoncé d’exercice : ils ne se contredisent jamais.
