---
title: Dessiner les résultats
description: "Tracez les diagrammes d’un modèle @edubeam/fem calculé avec @edubeam/plot : dans un composant Vue, en SVG depuis un script Node ou en JSON à dessiner plus tard."
order: 11
source: site
---

# Dessiner les résultats {#drawing-the-results}

[@edubeam/plot](/fr/plot) dessine un modèle calculé comme les figures de ce site : barres, appuis, charges, réactions, diagrammes de N, V et M et déformée, en SVG. Passez-lui le solveur ; il y lit tout ce dont il a besoin.

```bash
npm install @edubeam/plot @edubeam/fem vue
```

## Dans un composant Vue {#in-a-vue-component}

```vue [BeamFigure.vue]
<script setup lang="ts">
import { markRaw } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot } from '@edubeam/plot'

// Une poutre de 6 m sur deux appuis sous 12 kN/m, en unités SI : m, N, Pa
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // articulation
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // appui simple
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

// Lu, jamais observé : markRaw empêche Vue de rendre le solveur réactif
const beam = markRaw(solver)
</script>

<template>
  <StructurePlot
    :solver="beam"
    :layers="['members', 'supports', 'loads', 'reactions', 'M']"
  />
</template>
```

Il dessine les réactions de 36 kN et le moment de 54 kNm, comme dans cette figure calculée en direct :

::model-figure{caption="Ce que dessine BeamFigure.vue"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
---
::

`StructurePlot` dessine le cas de charge 0 ; la prop `loadCase` en choisit un autre parmi `solver.loadCases`. Le composant n’observe pas le solveur : après avoir modifié le modèle et relancé le calcul, changez sa prop `revision` pour le redessiner. La page [StructurePlot](/fr/plot/structure-plot) détaille toutes les options.

## Sans navigateur {#without-a-browser}

`structureSvg`, apparu dans @edubeam/plot 0.2, écrit le même dessin dans un fichier SVG autonome, avec des couleurs simples que comprennent Word, Inkscape et les chaînes d’outils LaTeX. Pas de navigateur, pas de composant Vue, juste un script Node :

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { modelFromSolver, structureSvg } from '@edubeam/plot'

// La même poutre que dans BeamFigure.vue
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

const svg = structureSvg(modelFromSolver(solver), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
  width: 640,
})
writeFileSync('beam.svg', svg)
```

Le fichier montre ce que montre la figure en direct ci-dessus, avec des couleurs adaptées à l’impression. `width` fixe sa taille en pixels, puisqu’il n’y a pas de conteneur à mesurer. Pour une page entière de figures à imprimer, réunissez plusieurs de ces fichiers dans une seule page HTML, comme le fait le [générateur de sujets](/fr/plot/exercises#print-a-test) de @edubeam/plot, sans Vue ni navigateur. Les options de `structureSvg` sont décrites dans [Fonctions](/fr/plot/functions#a-standalone-svg-file).

## Livrer le dessin, pas le solveur {#ship-the-drawing-not-the-solver}

`modelFromSolver` transforme un modèle calculé en données simples, sérialisables en JSON : géométrie, charges, réactions, et les résultats de chaque barre sous forme de polynômes exacts. Calculez au moment du build, livrez le JSON et dessinez-le avec la prop `model` au lieu de `solver` :

```ts
import { modelFromSolver } from '@edubeam/plot'

// ... la poutre calculée de to-svg.ts
writeFileSync('beam.json', JSON.stringify(modelFromSolver(solver)))
```

La page qui affiche la figure ne calcule alors plus rien : le travail est fait une fois pour toutes, au build. La page [Intégration](/fr/plot/embedding#ship-the-drawing-not-the-solver) montre le côté composant, et la page [Modèle de dessin](/fr/plot/model) décrit le format.

Tout le reste, des couleurs aux valeurs affichées au survol et aux charges déplaçables, se trouve dans la [documentation de @edubeam/plot](/fr/plot/getting-started).
