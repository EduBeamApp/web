---
title: Intégration
description: "Intégrer les figures de @edubeam/plot dans un projet Vite, un cours VitePress ou un site Nuxt, avec SSR, des modèles précalculés en JSON ou du SVG sans Vue."
order: 7
source: site
---

# Intégration

Les composants sont du Vue 3 ordinaire : ils fonctionnent partout où Vue fonctionne, et s’affichent côté serveur aussi bien que dans le navigateur. Rien ne touche à `window` avant le montage d’une figure, et chaque figure reçoit ses propres identifiants : une page peut en contenir autant que vous voulez. Choisissez la configuration qui correspond à la vôtre :

| Vous avez | Procédez ainsi |
| --- | --- |
| Une application Vue construite avec Vite | Installez, importez, c’est tout : [Une application Vite](#a-vite-app) |
| Un cours rédigé en Markdown | Enregistrez une fois le plugin dans VitePress : [Un cours sous VitePress](#vitepress-course-notes) |
| Un site Nuxt | Importez les composants ou ajoutez un plugin : [Nuxt](#nuxt) |
| Une page qui ne fait qu’afficher des figures | Calculez au moment du build et livrez du JSON : [Livrer le dessin](#ship-the-drawing-not-the-solver) |
| Pas de Vue du tout | Écrivez le SVG dans Node : [Sans Vue](#plain-html-from-node) |

## Une application Vite {#a-vite-app}

```bash
npm create vue@latest
npm install @edubeam/plot @edubeam/fem
```

Importez les composants là où vous les utilisez, comme dans [Premiers pas](/fr/plot/getting-started#draw-a-solved-model), ou enregistrez-les une fois pour toutes avec `app.use(EduBeamPlot)`. Il n’y a rien d’autre à configurer : ni feuille de style ni plugin de bundler.

## Un cours sous VitePress {#vitepress-course-notes}

[VitePress](https://vitepress.dev) construit des pages Markdown avec Vue, ce qui en fait un bon choix pour des supports de cours. Enregistrez les composants dans le thème, `.vitepress/theme/index.ts` :

```ts [.vitepress/theme/index.ts]
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { EduBeamPlot } from '@edubeam/plot'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(EduBeamPlot) // <StructurePlot> et <DiagramStack> dans toutes les pages
  },
} satisfies Theme
```

Construisez et dessinez ensuite un modèle directement dans une page, à côté de `frame.ts` :

```md [portal-frame.md]
<script setup lang="ts">
import { portalFrame } from './frame' // () => un LinearStaticSolver calculé

const frame = portalFrame()
</script>

# Portal frame

The bending moment under the design loads:

<StructurePlot :solver="frame" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

`vitepress build` calcule le portique et écrit le SVG terminé, étiquettes comprises, dans le HTML de la page. Dans le navigateur, la page prend le relais et la figure s’ajuste à la colonne. `frame.ts` se trouve sur la page [Diapositives et supports de cours](/fr/plot/slides#a-figure-that-builds-up).

## Nuxt {#nuxt}

Nuxt fait lui aussi le rendu côté serveur ; ce site est construit avec. Importez les composants dans une page ou un composant comme d’habitude, ou enregistrez-les pour toute l’application avec un plugin dans `plugins/edubeam-plot.ts` :

```ts [plugins/edubeam-plot.ts]
import { EduBeamPlot } from '@edubeam/plot'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(EduBeamPlot)
})
```

Côté serveur, il n’y a pas de conteneur à mesurer : une figure est mise en page à la largeur de sa prop `width`, 640 px par défaut (400 px avec `compact`) et 720 px pour `DiagramStack`. Une fois montée, elle se remet en page à sa largeur réelle. Si votre colonne est nettement plus étroite ou plus large, donnez à `width` une valeur plus proche : la figure ne changera pas de taille pendant le chargement de la page.

## Livrer le dessin, pas le solveur {#ship-the-drawing-not-the-solver}

Une page qui ne fait qu’afficher une figure n’a pas besoin de solveur. `modelFromSolver` transforme un modèle calculé en données simples : nœuds, barres, charges, réactions d’appui, et pour chaque barre N, V, M et les déplacements sous forme de polynômes exacts. Produisez-le au moment du build, avec un script comme `build-figures.ts` :

```ts [build-figures.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

writeFileSync('portal-frame.json', JSON.stringify(modelFromSolver(portalFrame())))
```

et dessinez-le avec la prop `model` :

```vue
<script setup lang="ts">
import { StructurePlot, type PlotModel } from '@edubeam/plot'
import frame from './portal-frame.json'
</script>

<template>
  <StructurePlot :model="frame as PlotModel" />
</template>
```

Le portique tient en moins de 2 ko de JSON et se dessine exactement comme avec son solveur. Toutes les fonctionnalités fonctionnent avec un modèle comme avec un solveur, et `model` l’emporte si vous donnez les deux. Le format est décrit dans [Modèle de dessin](/fr/plot/model).

## Sans Vue {#plain-html-from-node}

`structureSvg` transforme un modèle en texte de fichier SVG, aux couleurs fixes, sans styles ni scripts. Collez-le dans n’importe quel HTML, un générateur de site statique, un fichier Markdown ou un CMS. Ce script écrit une page contenant une figure :

```ts [frame-html.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const svg = structureSvg(modelFromSolver(portalFrame()), { layers: ['members', 'supports', 'reactions', 'M'] })
writeFileSync('frame.html', `<!doctype html><meta charset="utf-8"><title>Portal frame</title>${svg}`)
```

Une telle figure garde la taille à laquelle elle a été écrite, 640 px de large par défaut (`max-width: 100%; height: auto` lui permet de rétrécir avec la colonne), et a son propre fond blanc ; `background: false` la laisse transparente. Elle ne suit pas un thème sombre et ne lit pas les valeurs sous le pointeur : pour cela, utilisez le composant. Le [générateur de sujets](/fr/plot/exercises#print-a-test) imprime ainsi un sujet complet, et [Un fichier SVG autonome](/fr/plot/functions#a-standalone-svg-file) liste les options.
