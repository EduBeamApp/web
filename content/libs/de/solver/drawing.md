---
title: Ergebnisse zeichnen
description: "Ein berechnetes @edubeam/fem-Modell mit @edubeam/plot zeichnen: in einer Vue-Komponente, als eigenständige SVG-Datei aus einem Node-Skript oder als JSON."
order: 11
---

# Ergebnisse zeichnen {#drawing-the-results}

[@edubeam/plot](/de/plot) zeichnet ein berechnetes Modell so, wie die Abbildungen auf dieser Website aussehen: Stäbe, Lager, Lasten, Auflagerreaktionen, die Verläufe von N, V und M und die Verformungsfigur, als SVG. Übergeben Sie der Bibliothek den Solver; sie liest alles Nötige selbst aus.

```bash
npm install @edubeam/plot @edubeam/fem vue
```

## In einer Vue-Komponente {#in-a-vue-component}

```vue [BeamFigure.vue]
<script setup lang="ts">
import { markRaw } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot } from '@edubeam/plot'

// Ein Einfeldträger von 6 m unter 12 kN/m, in SI-Einheiten: m, N, Pa
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // Festlager
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // Loslager
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

// Nur gelesen, nie beobachtet: markRaw verhindert, dass Vue den Solver reaktiv macht
const beam = markRaw(solver)
</script>

<template>
  <StructurePlot
    :solver="beam"
    :layers="['members', 'supports', 'loads', 'reactions', 'M']"
  />
</template>
```

Die Komponente zeichnet die Auflagerreaktionen von 36 kN und das Moment von 54 kNm, wie in dieser Live-Abbildung:

::model-figure{caption="Was BeamFigure.vue zeichnet"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
---
::

`StructurePlot` zeichnet den Lastfall 0; die Prop `loadCase` wählt einen anderen aus `solver.loadCases`. Die Komponente beobachtet den Solver nicht: Wenn Sie das Modell ändern und neu berechnen, ändern Sie ihre Prop `revision`, damit sie neu zeichnet. Unter [StructurePlot](/de/plot/structure-plot) finden Sie alle Optionen.

## Ohne Browser {#without-a-browser}

`structureSvg`, neu in @edubeam/plot 0.2, schreibt dieselbe Zeichnung als eigenständige SVG-Datei, mit einfachen Farben, die Word, Inkscape und LaTeX-Werkzeugketten verstehen. Kein Browser, keine Vue-Komponente, nur ein Node-Skript:

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { modelFromSolver, structureSvg } from '@edubeam/plot'

// Derselbe Träger wie in BeamFigure.vue
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

Die Datei zeigt, was auch die Live-Abbildung oben zeigt, in Druckfarben. `width` legt ihre Größe in Pixeln fest, weil es keinen Container gibt, der sich ausmessen ließe. Für eine ganze druckfertige Seite mit Abbildungen rendern Sie die Vue-Komponente auf dem Server zu HTML, wie im Abschnitt [Eine gedruckte Klausur](/de/plot/exercises#print-a-test) der Dokumentation von @edubeam/plot. Die Optionen von `structureSvg` stehen unter [Funktionen](/de/plot/functions#a-standalone-svg-file).

## Die Zeichnung ausliefern, nicht den Solver {#ship-the-drawing-not-the-solver}

`modelFromSolver` verwandelt ein berechnetes Modell in einfache, JSON-serialisierbare Daten: Geometrie, Lasten, Auflagerreaktionen und die Ergebnisse jedes Stabs als exakte Polynome. Berechnen Sie beim Build, liefern Sie das JSON aus und zeichnen Sie es mit der Prop `model` statt `solver`:

```ts
import { modelFromSolver } from '@edubeam/plot'

// ... der berechnete Träger aus to-svg.ts
writeFileSync('beam.json', JSON.stringify(modelFromSolver(solver)))
```

Eine Seite, die die Abbildung zeigt, berechnet dann nichts mehr: Die Rechenarbeit fällt einmal an, beim Build. [Einbinden](/de/plot/embedding#ship-the-drawing-not-the-solver) zeigt, wie die Komponente solche Daten zeichnet, und [Zeichenmodell](/de/plot/model) beschreibt das Format.

Alles Weitere, von Farben über Tooltips mit Messwerten bis zu verschiebbaren Lasten, steht in der [Dokumentation von @edubeam/plot](/de/plot/getting-started).
