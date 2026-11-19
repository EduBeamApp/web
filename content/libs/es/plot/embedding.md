---
title: Integración
description: "Figuras de @edubeam/plot en una aplicación Vite, apuntes con VitePress o un sitio Nuxt, renderizado en el servidor, modelos resueltos como JSON y SVG sin Vue."
order: 7
source: site
---

# Integración

Los componentes son Vue 3 sin más, así que funcionan dondequiera que funcione Vue, y se renderizan tanto en el servidor como en el navegador. Nada accede a `window` antes de que se monte un gráfico, y cada gráfico tiene sus propios identificadores, así que una página puede tener tantos como quieras. Elige tu caso:

| Tienes | Haz esto |
| --- | --- |
| Una aplicación Vue creada con Vite | Instala, importa y listo: [Una aplicación Vite](#a-vite-app) |
| Apuntes de clase en Markdown | Registra el plugin una vez en VitePress: [Apuntes con VitePress](#vitepress-course-notes) |
| Un sitio Nuxt | Importa los componentes o añade un plugin: [Nuxt](#nuxt) |
| Una página que solo muestra figuras | Resuelve durante el build y entrega JSON: [Entregar el dibujo, no el solver](#ship-the-drawing-not-the-solver) |
| Nada de Vue | Escribe el SVG con Node: [Sin Vue](#plain-html-from-node) |

## Una aplicación Vite {#a-vite-app}

```bash
npm create vue@latest
npm install @edubeam/plot @edubeam/fem
```

Importa los componentes allí donde los uses, como en [Primeros pasos](/es/plot/getting-started#draw-a-solved-model), o regístralos los dos de una vez con `app.use(EduBeamPlot)`. No hay nada más que configurar: ni hoja de estilos ni plugin para el bundler.

## Apuntes con VitePress {#vitepress-course-notes}

[VitePress](https://vitepress.dev) genera páginas a partir de Markdown con Vue, así que es un buen sitio para los apuntes de una asignatura. Registra los componentes en el tema, `.vitepress/theme/index.ts`:

```ts [.vitepress/theme/index.ts]
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { EduBeamPlot } from '@edubeam/plot'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(EduBeamPlot) // <StructurePlot> y <DiagramStack> en todas las páginas
  },
} satisfies Theme
```

Después crea y dibuja un modelo directamente en una página, junto a `frame.ts`:

```md [portal-frame.md]
<script setup lang="ts">
import { portalFrame } from './frame' // () => un LinearStaticSolver resuelto

const frame = portalFrame()
</script>

# Portal frame

The bending moment under the design loads:

<StructurePlot :solver="frame" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

`vitepress build` resuelve el pórtico y escribe el SVG terminado en el HTML de la página, con todas sus etiquetas. En el navegador, la página toma el control y el gráfico se ajusta al ancho de la columna. `frame.ts` está en la página [Diapositivas y apuntes](/es/plot/slides#a-figure-that-builds-up).

## Nuxt {#nuxt}

Nuxt también renderiza en el servidor; este sitio está hecho con él. Importa los componentes en una página o en un componente como siempre, o regístralos para toda la aplicación con un plugin en `plugins/edubeam-plot.ts`:

```ts [plugins/edubeam-plot.ts]
import { EduBeamPlot } from '@edubeam/plot'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(EduBeamPlot)
})
```

En el servidor no hay ningún contenedor que medir, así que el gráfico se compone con el ancho de su prop `width`: 640 px por defecto (400 px con `compact`) y 720 px para `DiagramStack`. Una vez montado, se vuelve a componer con su ancho real. Si tu columna es mucho más estrecha o más ancha, da a `width` un valor más cercano al real y la figura no cambiará de tamaño mientras carga la página.

## Entregar el dibujo, no el solver {#ship-the-drawing-not-the-solver}

Una página que solo muestra una figura no necesita el solver. `modelFromSolver` convierte un modelo resuelto en datos simples: nodos, barras, cargas, reacciones, y los N, V, M y desplazamientos de cada barra como polinomios exactos. Créalos durante el build, con un script como `build-figures.ts`:

```ts [build-figures.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

writeFileSync('portal-frame.json', JSON.stringify(modelFromSolver(portalFrame())))
```

y dibújalos con la prop `model`:

```vue
<script setup lang="ts">
import { StructurePlot, type PlotModel } from '@edubeam/plot'
import frame from './portal-frame.json'
</script>

<template>
  <StructurePlot :model="frame as PlotModel" />
</template>
```

El pórtico ocupa menos de 2 kB de JSON y se dibuja exactamente igual que con su solver. Todo funciona igual con un modelo que con un solver, y si pasas los dos, manda `model`. El formato se describe en [Modelo de dibujo](/es/plot/model).

## Sin Vue {#plain-html-from-node}

`structureSvg` convierte un modelo en el texto de un archivo SVG, con colores fijos y sin estilos ni scripts. Pégalo en cualquier HTML, en un generador de sitios estáticos, en un archivo Markdown o en un CMS. Este script escribe una página con una figura:

```ts [frame-html.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const svg = structureSvg(modelFromSolver(portalFrame()), { layers: ['members', 'supports', 'reactions', 'M'] })
writeFileSync('frame.html', `<!doctype html><meta charset="utf-8"><title>Portal frame</title>${svg}`)
```

Una figura así tiene el tamaño con el que se escribió, 640 px de ancho por defecto (`max-width: 100%; height: auto` permite que se reduzca con la columna), y un fondo blanco propio; `background: false` la deja transparente. No sigue un tema oscuro ni lee valores bajo el puntero: para eso, renderiza el componente. El [script que imprime un examen](/es/plot/exercises#print-a-test) imprime así un examen completo, y en [Un archivo SVG independiente](/es/plot/functions#a-standalone-svg-file) están todas las opciones.
