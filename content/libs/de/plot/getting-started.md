---
title: Erste Schritte
description: "@edubeam/plot installieren, einen mit @edubeam/fem berechneten Träger mit Lasten, Reaktionen und M-Verlauf in Vue 3 zeichnen, aktualisieren, als SVG speichern."
order: 1
group: Einführung
---

# Erste Schritte

Die Zeichenbibliothek @edubeam/plot stellt einen ebenen Träger, einen Rahmen oder ein Fachwerk samt Ergebnissen als SVG dar: Stäbe, Lager, Lasten, Auflagerreaktionen, die Verläufe von N, V und M und die Verformungsfigur, genau so, wie die Abbildungen auf dieser Website aussehen. Sie übergeben ein Modell, das mit [@edubeam/fem](/de/solver) berechnet wurde, dem Solver hinter [EduBeam]{.edubeam}; Anordnung, Maßstab und die Position jeder Zahl ermittelt die Bibliothek selbst.

Lehrende erstellen damit [Übungsaufgaben und Klausuren](/de/plot/exercises), die aus einem Seed (Startwert des Zufallsgenerators) erzeugt werden, [Folien](/de/plot/slides), auf denen die Abbildung Klick für Klick wächst, und Abbildungen für das Skript, auf einer Webseite oder als Dateien für LaTeX und Word. Auch die [Übungsaufgaben](/de/practice) und der [Klausurgenerator](/de/exam) dieser Website beruhen auf ihr.

::div{.actions}
[Erste Grafik zeichnen](#draw-a-solved-model) [Übungsaufgaben erzeugen](/de/plot/exercises)
::

## Installation {#install}

```bash
npm install @edubeam/plot @edubeam/fem vue
```

Vue ab Version 3.5 und der Solver sind Peer Dependencies, Ihre Anwendung enthält also von beiden nur eine Kopie. Das Paket ist reines ESM, bringt eigene Typen mit und braucht kein Stylesheet. Es läuft ab Node 20.19; um ein in TypeScript geschriebenes Skript direkt mit `node script.ts` auszuführen, brauchen Sie Node 22.18 oder neuer.

## Ein berechnetes Modell zeichnen {#draw-a-solved-model}

Sie brauchen zwei Dateien. Die erste, `beams.ts`, erstellt einen Träger mit @edubeam/fem und berechnet ihn. Sie enthält nur eine gewöhnliche Funktion, sodass dasselbe Modell einer Seite, einer Folie und einem Skript dienen kann:

```ts [beams.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Ein Einfeldträger, `span` m lang, unter `q` kN/m: berechnet. Der Solver rechnet in SI-Einheiten. */
export const simpleBeam = (span: number, q: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 }) // Stahl, Pa
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 }) // IPE 200, schubstarr
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // Festlager
  domain.createNode('B', [span, 0, 0], [DofID.Dz]) // Loslager
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true) // N/m, +z zeigt nach unten
  solver.solve()
  return solver
}
```

Die zweite, `BeamFigure.vue`, übergibt den Solver an `StructurePlot` und legt fest, was gezeichnet wird:

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

Das ist schon die ganze Abbildung: der Träger auf seinen Lagern, die Last von 12 kN/m, die beiden Auflagerkräfte von je 36 kN und das Biegemoment, in Feldmitte $qL^2/8 = 54$ kNm, auf der Zugseite angetragen:

::model-figure{caption="Was BeamFigure.vue zeichnet: ein Feld von 6 m unter 12 kN/m"}
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

Die Grafik füllt die Breite ihres Containers und bestimmt ihre Höhe selbst. Text, Symbole und Linienstärken behalten ihre Größe in Pixeln, unabhängig von der Größe des Tragwerks, sodass eine Abbildung auch auf dem Smartphone lesbar bleibt. Lassen Sie `layers` weg, wählt die Grafik das Ergebnis selbst: M für Träger und Rahmen, N für ein Fachwerk. Alle [Ebenen](/de/plot/structure-plot#layers) sind bei `StructurePlot` aufgeführt; wie Sie Modelle erstellen, beschreibt die [Solver-Dokumentation](/de/solver/getting-started).

## Wenn sich das Modell ändert {#when-the-model-changes}

Eine Grafik liest den Solver, den sie erhält, beobachtet ihn aber nicht. Ändert sich etwas, berechnen Sie neu und übergeben den neuen Solver. Genau das leistet ein `computed`:

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

Ein solcher Träger ist in etwa einer Millisekunde berechnet, die Abbildung folgt dem Schieberegler also, während er sich bewegt. Haben Sie stattdessen einen vorhandenen Solver direkt verändert? Erhöhen Sie die Prop `revision`, dann liest die Grafik ihn erneut.

::callout{type="tip" title="Solver nicht tief reaktiv machen"}
Ein `computed`, eine Prop oder eine einfache `const` hält einen Solver so, wie er ist. Wollen Sie ihn im Zustand einer Komponente speichern, nehmen Sie `shallowRef` oder umschließen ihn mit `markRaw`: Ein gewöhnliches `ref` ließe Vue den ganzen Solver durchlaufen, um ihn reaktiv zu machen, und das ohne Nutzen.
::

## Als Datei speichern {#save-it-as-a-file}

Für eine Abbildung in LaTeX, Word oder Inkscape schreibt `structureSvg` dieselbe Zeichnung als eigenständige SVG-Datei mit festen Farben. Dafür brauchen Sie weder Vue noch einen Browser, nur Node. Speichern Sie dieses Skript als `beam-svg.ts` neben `beams.ts`:

```ts [beam-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { simpleBeam } from './beams.ts'

const svg = structureSvg(modelFromSolver(simpleBeam(6, 12)), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
})
writeFileSync('beam.svg', svg)
```

Führen Sie es mit `node beam-svg.ts` aus (ab Node 22.18; in älteren Versionen mit `npx tsx beam-svg.ts`). Die Optionen und wie Sie die Datei in LaTeX und Word einbinden, stehen unter [Eine eigenständige SVG-Datei](/de/plot/functions#a-standalone-svg-file).

## Verläufe untereinander {#the-stacked-figure}

`DiagramStack` zeichnet die Abbildung, die in jedem Statiklehrbuch steht: einen geraden Träger mit seinen Lasten und darunter, auf einer gemeinsamen x-Achse, seine Verläufe V(x), M(x) und w(x). Mit `v-model:load-at` können Lesende eine Einzellast am Träger entlangziehen und zusehen, wie die Verläufe folgen:

```vue
<DiagramStack v-model:load-at="at" :solver="solveWithLoadAt(at)" />
```

Das vollständige Beispiel finden Sie unter [DiagramStack](/de/plot/diagram-stack).

## Überall verwenden {#use-it-everywhere}

So registrieren Sie beide Komponenten global, statt sie dort zu importieren, wo Sie sie verwenden:

```ts [main.ts]
import { createApp } from 'vue'
import { EduBeamPlot } from '@edubeam/plot'
import App from './App.vue'

createApp(App).use(EduBeamPlot).mount('#app') // <StructurePlot> und <DiagramStack> in jedem Template
```

Benannte Importe halten das Bundle kleiner: Eine Seite, die nur `StructurePlot` importiert, bekommt weder `DiagramStack` noch das Plugin. Beide Komponenten lassen sich auch auf dem Server rendern, in Nuxt oder VitePress: siehe [Einbinden](/de/plot/embedding).

## Wie geht es weiter? {#next}

::card-grid{cols="2"}
:::card{title="Übungsaufgaben und Klausuren" icon="lucide:dices" to="/de/plot/exercises"}
Für alle Studierenden eine eigene Aufgabe aus einem Seed, mit Lösungsblatt, gedruckt oder als Datei für LaTeX.
:::
:::card{title="Folien und Skripte" icon="lucide:presentation" to="/de/plot/slides"}
Abbildungen, die Klick für Klick wachsen, in Slidev, Vue oder Beamer, und dieselben Abbildungen für das Skript.
:::
:::card{title="StructurePlot" icon="lucide:frame" to="/de/plot/structure-plot"}
Ebenen, Bemaßung, Vorschaubilder, Größen, Einheiten und das Ablesen von Werten mit dem Zeiger.
:::
:::card{title="DiagramStack" icon="lucide:rows-3" to="/de/plot/diagram-stack"}
Ein Träger über seinen Verläufen V, M und w, mit einer Last, die Lesende verschieben können.
:::
::
