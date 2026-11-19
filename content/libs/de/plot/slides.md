---
title: Folien und Skripte
description: "Abbildungen für die Vorlesung mit @edubeam/plot: Klick für Klick aufgebaut in Slidev, Vue oder Beamer, live berechnet und als SVG im Skript, in PowerPoint und Word."
order: 6
---

# Folien und Vorlesungsskripte

Zeigen Sie ein Tragwerk so, wie Sie es erklären: erst die Geometrie, dann Lager und Lasten, dann die Auflagerreaktionen und zuletzt das Biegemoment. Eine Abbildung, die aus einem berechneten Modell gezeichnet wird, baut sich an Ort und Stelle auf, eine Ebene pro Klick, und stimmt immer. Dasselbe Modell liefert anschließend die Abbildungen für Ihr Skript.

![Eine Slidev-Folie nach 0, 2 und 4 Klicks: die Knoten eines Portalrahmens mit Bemaßung, dann der Rahmen auf seinen Lagern mit den Lasten, zuletzt die Auflagerreaktionen und das Biegemoment](/screenshots/de/p2p-plot-slidev-steps.webp){.shot-md}

## Eine Abbildung, die sich aufbaut {#a-figure-that-builds-up}

Sie brauchen zwei Dateien. `frame.ts` erstellt das Tragwerk und berechnet es:

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Ein Portalrahmen: 6 m × 4 m, Fußpunkte gelenkig, 10 kN/m auf dem Riegel und 15 kN Horizontallast in B. */
export const portalFrame = (): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 }) // IPE 300
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [0, 0, -4]) // z zeigt nach unten: 4 m nach oben
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

`BuildUp.vue` zeichnet es in Schritten. Jeder Schritt listet die Ebenen auf, die er zeigt, und `reserve` ordnet sie alle schon ab dem ersten Klick an, sodass sich jede Ebene an ihrer Stelle einblendet und sich nichts verschiebt:

```vue [BuildUp.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { StructurePlot, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame'

const props = defineProps<{ step: number }>()

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'], // die Geometrie
  ['nodeLabels', 'members', 'supports'], // das Tragwerk
  ['nodeLabels', 'members', 'supports', 'loads'], // seine Lasten
  ['members', 'supports', 'loads', 'reactions'], // die Auflagerreaktionen
  ['members', 'supports', 'reactions', 'M'], // und das Biegemoment
]
const all = [...new Set(stages.flat())] // ab dem ersten Schritt angeordnet, damit sich später nichts verschiebt
const layers = computed(() => stages[Math.min(props.step, stages.length - 1)])

const frame = portalFrame()
</script>

<template>
  <StructurePlot :solver="frame" :layers="layers" :reserve="all" :height="360" />
</template>
```

Eine Ebene kann auch wieder verschwinden: Der letzte Schritt lässt die Lasten weg, um dem Moment Platz zu machen. `:height="360"` hält die Abbildung innerhalb der Folie. Stäbe zeichnen sich beim ersten Erscheinen von einem Ende zum anderen, und Ebenen blenden sich innerhalb einer halben Sekunde ein; bei `prefers-reduced-motion` ist beides aus, und `:animate="false"` schaltet es für alle ab. Wie Sie die Animation für den Hörsaal verlangsamen, steht unter [Die Animation anpassen](/de/plot/theming#restyling-the-animation).

## In Slidev {#in-slidev}

[Slidev](https://sli.dev) erstellt Folien aus Markdown mit Vue, die Komponente funktioniert dort also unverändert. Installieren Sie die Bibliotheken im Foliensatz:

```bash
npm install @edubeam/plot @edubeam/fem
```

Legen Sie `frame.ts` und `BuildUp.vue` in den Ordner `components/` des Foliensatzes und lassen Sie in `slides.md` die Klicks der Folie den Schritt steuern:

```md [slides.md]
---
clicks: 4
---

# From geometry to bending moment

<BuildUp :step="$clicks" />
```

`clicks: 4` gibt der Folie vier Klicks, und `$clicks` zählt sie ab 0. Jeder Druck auf die Pfeiltaste zeigt den nächsten Schritt, ein Schritt zurück blendet ihn wieder aus. `slidev export` erzeugt ein PDF des Foliensatzes, mit `--with-clicks` eine Seite pro Klick.

## In beliebigen Vue-Folien {#in-any-vue-slides}

Überall sonst verwalten Sie den Schritt selbst:

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

## Live berechnen {#solve-it-live}

Für einen solchen Rahmen braucht der Solver Millisekunden, Sie können das Tragwerk in der Vorlesung also verändern und sofort neu berechnen. Binden Sie eine Last an einen Schieberegler und übergeben Sie jedes Mal ein neu berechnetes Modell, wie unter [Wenn sich das Modell ändert](/de/plot/getting-started#when-the-model-changes).

- **Eine wandernde Last.** Mit [DiagramStack](/de/plot/diagram-stack#a-load-the-reader-can-drag) ziehen die Studierenden eine Einzellast am Träger entlang und sehen zu, wie Querkraft und Biegemoment ihr folgen.
- **Fälle nebeneinander.** Legen Sie [`diagramScale`](/de/plot/structure-plot#several-plots-at-one-scale) fest, dann zeichnen zwei Grafiken ihre Momente im gleichen Maßstab, und das größere sieht auch größer aus.
- **Werte ablesen.** Mit `hover` markiert der Zeiger über einem Stab den Wert an der Spitze der Ordinate jedes Verlaufs: siehe [Werte ablesen](/de/plot/structure-plot#reading-values).

## Abbildungen für Beamer, PowerPoint und Word {#figures-for-beamer-powerpoint-and-word}

Ein Foliensatz in LaTeX Beamer oder PowerPoint oder ein Skript in Word nimmt die Abbildung als Datei auf. `structureSvg` schreibt die Grafik als eigenständiges SVG mit festen Farben, angeordnet genau wie bei `StructurePlot`. Ein Node-Skript, `frame-svg.ts`, neben `frame.ts`:

```ts [frame-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![Der Portalrahmen als eigenständige SVG-Datei, gerendert mit CairoSVG: die Lasten, die Auflagerreaktionen, 20 und 40 nach oben und 2,3 und 12,7 horizontal, und das Biegemoment von −50,7 in C bis 29,3 im Riegel](/screenshots/de/p2p-plot-frame-svg.webp){.shot-lg}

PowerPoint und Word (2019 und Microsoft 365) fügen das SVG direkt ein. LaTeX nimmt es als PDF: Konvertieren Sie es mit `cairosvg frame.svg -o frame.pdf` oder Inkscape, oder überlassen Sie das `\includesvg` aus dem Paket `svg`. Einzelheiten stehen unter [Abbildungen für LaTeX und Word](/de/plot/exercises#figures-for-latex-and-word), alle Optionen unter [Eine eigenständige SVG-Datei](/de/plot/functions#a-standalone-svg-file).

### Schrittweiser Aufbau in Beamer {#a-build-up-in-beamer}

Eine Datei wird an die Ebenen angepasst, die sie zeichnet; Dateien, die für jeden Schritt einzeln geschrieben werden, lägen also nicht deckungsgleich übereinander. Geben Sie `structureSvg` dasselbe `reserve` wie `BuildUp.vue`, also jede Ebene jedes Schritts, dann hat jede Datei dieselbe Größe und das Tragwerk dieselbe Lage. `frame-stages.ts` schreibt eine Datei pro Schritt:

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

Konvertieren Sie die Dateien in PDF:

```bash
for i in 1 2 3 4 5; do cairosvg frame-$i.svg -o frame-$i.pdf; done
```

und geben Sie jeder ein eigenes Overlay. Jede Datei enthält einen ganzen Schritt, die Folie zeigt also jeweils eine davon; und weil sie deckungsgleich sind, scheint jeder Klick eine Ebene hinzuzufügen:

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

In PowerPoint legen Sie die fünf Dateien auf fünf aufeinanderfolgende Folien ohne Übergang dazwischen: Jeder Schritt sieht dann aus wie ein Klick in der Vorlesung.

## Skripte und Handouts {#notes-and-handouts}

- **Vorlesungsskripte im Web.** VitePress und Nuxt rendern Grafiken beim Build, die Abbildungen stehen also schon im HTML, bevor irgendein Skript läuft: siehe [Einbinden](/de/plot/embedding).
- **Gedruckte Skripte.** Schreiben Sie die Abbildungen mit `structureSvg` in eine HTML-Seite und drucken Sie sie, wie es das [Skript für gedruckte Klausuren](/de/plot/exercises#print-a-test) tut, oder binden Sie die Dateien in LaTeX oder Word ein.
- **Ein Modell, alle Abbildungen.** Dasselbe `frame.ts` speist die Folien, das Skript und das Übungsblatt, sodass sie nie voneinander abweichen.
