---
title: Einbinden
description: "Grafiken von @edubeam/plot in Vite, VitePress oder Nuxt, Rendern auf dem Server, vorberechnete Modelle als JSON und reines SVG für Seiten ohne Vue."
order: 7
---

# Einbinden

Die Komponenten sind gewöhnliches Vue 3, sie funktionieren also überall, wo Vue läuft, und lassen sich auf dem Server ebenso rendern wie im Browser. Nichts greift auf `window` zu, bevor eine Grafik gemountet ist, und jede Grafik bekommt eigene IDs, sodass beliebig viele auf einer Seite stehen können. Wählen Sie Ihr Szenario:

| Sie haben | So gehen Sie vor |
| --- | --- |
| Eine mit Vite gebaute Vue-App | Installieren, importieren, fertig: [Eine Vite-App](#a-vite-app) |
| Ein Vorlesungsskript in Markdown | Das Plugin einmal in VitePress registrieren: [Vorlesungsskripte mit VitePress](#vitepress-course-notes) |
| Eine Nuxt-Website | Die Komponenten importieren oder ein Plugin hinzufügen: [Nuxt](#nuxt) |
| Eine Seite, die nur Abbildungen zeigt | Beim Build berechnen und JSON ausliefern: [Die Zeichnung ausliefern](#ship-the-drawing-not-the-solver) |
| Gar kein Vue | Das SVG in Node schreiben: [Ohne Vue](#plain-html-from-node) |

## Eine Vite-App {#a-vite-app}

```bash
npm create vue@latest
npm install @edubeam/plot @edubeam/fem
```

Importieren Sie die Komponenten dort, wo Sie sie verwenden, wie unter [Erste Schritte](/de/plot/getting-started#draw-a-solved-model), oder registrieren Sie beide einmal mit `app.use(EduBeamPlot)`. Sonst ist nichts zu konfigurieren: kein Stylesheet und kein Bundler-Plugin.

## Vorlesungsskripte mit VitePress {#vitepress-course-notes}

[VitePress](https://vitepress.dev) baut Markdown-Seiten mit Vue und eignet sich daher gut für Vorlesungsskripte. Registrieren Sie die Komponenten im Theme, `.vitepress/theme/index.ts`:

```ts [.vitepress/theme/index.ts]
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { EduBeamPlot } from '@edubeam/plot'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(EduBeamPlot) // <StructurePlot> und <DiagramStack> auf jeder Seite
  },
} satisfies Theme
```

Dann erstellen und zeichnen Sie ein Modell direkt in einer Seite, neben `frame.ts`:

```md [portal-frame.md]
<script setup lang="ts">
import { portalFrame } from './frame' // () => a solved LinearStaticSolver

const frame = portalFrame()
</script>

# Portal frame

The bending moment under the design loads:

<StructurePlot :solver="frame" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

`vitepress build` berechnet den Rahmen und schreibt das fertige SVG samt Beschriftungen in das HTML der Seite. Im Browser übernimmt dann die Seite, und die Grafik passt sich der Spaltenbreite an. `frame.ts` finden Sie auf der Seite [Folien und Skripte](/de/plot/slides#a-figure-that-builds-up).

## Nuxt {#nuxt}

Auch Nuxt rendert auf dem Server; diese Website ist damit gebaut. Importieren Sie die Komponenten wie gewohnt in einer Seite oder Komponente, oder registrieren Sie sie mit einem Plugin in `plugins/edubeam-plot.ts` für die ganze App:

```ts [plugins/edubeam-plot.ts]
import { EduBeamPlot } from '@edubeam/plot'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(EduBeamPlot)
})
```

Auf dem Server gibt es keinen Container zum Messen, daher wird eine Grafik in der Breite ihrer Prop `width` angeordnet: standardmäßig 640 px (400 px mit `compact`), 720 px bei `DiagramStack`. Nach dem Mounten ordnet sie sich in ihrer tatsächlichen Breite neu an. Ist Ihre Spalte deutlich schmaler oder breiter, geben Sie für `width` einen besseren Schätzwert an, dann ändert die Abbildung beim Laden der Seite ihre Größe nicht.

## Die Zeichnung ausliefern, nicht den Solver {#ship-the-drawing-not-the-solver}

Eine Seite, die nur eine Abbildung zeigt, braucht keinen Solver. `modelFromSolver` liest ein berechnetes Modell in einfache Daten ein: Knoten, Stäbe, Lasten, Auflagerreaktionen und für jeden Stab N, V, M und die Verschiebungen als exakte Polynome. Erzeugen Sie es beim Build, mit einem Skript wie `build-figures.ts`:

```ts [build-figures.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

writeFileSync('portal-frame.json', JSON.stringify(modelFromSolver(portalFrame())))
```

und zeichnen Sie es mit der Prop `model`:

```vue
<script setup lang="ts">
import { StructurePlot, type PlotModel } from '@edubeam/plot'
import frame from './portal-frame.json'
</script>

<template>
  <StructurePlot :model="frame as PlotModel" />
</template>
```

Der Portalrahmen braucht weniger als 2 kB JSON und wird genau so gezeichnet wie aus seinem Solver. Mit einem Modell funktioniert alles genauso wie mit einem Solver; geben Sie beides an, gilt `model`. Das Format beschreibt die Seite [Zeichenmodell](/de/plot/model).

## Ohne Vue {#plain-html-from-node}

`structureSvg` macht aus einem Modell den Text einer SVG-Datei, mit festen Farben und ohne Styles oder Skripte. Fügen Sie ihn in beliebiges HTML ein, in einen Static-Site-Generator, eine Markdown-Datei oder ein CMS. Dieses Skript schreibt eine Seite mit einer Abbildung:

```ts [frame-html.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const svg = structureSvg(modelFromSolver(portalFrame()), { layers: ['members', 'supports', 'reactions', 'M'] })
writeFileSync('frame.html', `<!doctype html><meta charset="utf-8"><title>Portal frame</title>${svg}`)
```

Eine solche Abbildung hat die Größe, in der sie geschrieben wurde, standardmäßig 640 px breit (mit `max-width: 100%; height: auto` schrumpft sie mit der Spalte), und einen eigenen weißen Hintergrund; mit `background: false` bleibt sie transparent. Sie folgt keinem dunklen Farbschema und zeigt unter dem Zeiger keine Werte an: Dafür rendern Sie die Komponente. Das [Skript für gedruckte Klausuren](/de/plot/exercises#print-a-test) druckt auf diese Weise eine ganze Klausur, und unter [Eine eigenständige SVG-Datei](/de/plot/functions#a-standalone-svg-file) sind die Optionen aufgeführt.
