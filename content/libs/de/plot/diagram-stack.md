---
title: DiagramStack
description: "Mit DiagramStack einen Träger über seinen Verläufen V(x), M(x) und w(x) zeichnen, alle Zeilen mit einem Cursor ablesen und eine Einzellast verschiebbar machen."
order: 3
---

# DiagramStack

`DiagramStack` zeichnet die Abbildung, die in jedem Statiklehrbuch steht: einen geraden Träger mit Lagern, Lasten und Auflagerreaktionen und darunter, auf derselben x-Achse, seine Querkraft V(x), sein Biegemoment M(x) und seine Durchbiegung w(x). Ein Cursor liest alle Zeilen gleichzeitig ab, und auf Wunsch lässt sich eine Einzellast am Träger entlangziehen.

```vue
<DiagramStack :solver="solver" />
```

![DiagramStack: ein Einfeldträger von 6 m mit einer verschiebbaren Last von 20 kN, hier 4,3 m vom linken Lager entfernt; Auflagerkräfte 5,7 kN und 14,3 kN, die Querkraft springt unter der Last von 5,7 kN auf −14,3 kN, das Biegemoment erreicht dort sein Maximum von 24,4 kNm, und die Biegelinie hat ihren Größtwert von 17 mm](/screenshots/de/p2p-plot-diagram-stack.webp){.shot-lg}

Die Stäbe müssen eine horizontale Linie bilden, von links nach rechts gezeichnet. Alles andere, eine geneigte oder geknickte Linie oder ein von rechts nach links gezeichneter Stab, wird mit einem Fehler abgewiesen, statt falsch gezeichnet zu werden, denn die x-Achse der Abbildung ist die des Trägers. Alle Props stehen in der [Komponenten-API](/de/plot/components#diagramstack).

## Zeilen {#rows}

| Prop | Standard | Legt fest |
| --- | --- | --- |
| `rows` | `['V', 'M', 'w']` | die Verläufe, von oben nach unten; auch `'N'` ist möglich |
| `loadRow` | `true` | den Träger mit Lagern, Lasten und Auflagerreaktionen über den Zeilen |
| `members` | alle Stäbe | die Stäbe der Trägerlinie, wenn das Modell weitere enthält |
| `rowHeights` | N 100, V 116, M 128, w 76 px | die Zeilenhöhen; unter 560 px Breite etwas kleiner |
| `maxHeight` | keine | die Zeilen schrumpfen auf höchstens 60 %, damit die Abbildung hineinpasst; die Schrift behält ihre Größe |
| `ranges` | je Zeile der eigene | feste Wertebereiche je Zeile, in SI-Einheiten |

V und N werden nach oben positiv angetragen, M und w nach unten, wie in den meisten Lehrbüchern: Ein positives Moment und eine Durchbiegung nach unten liegen unter der Achse. Jede Zeile schreibt ihre Extremwerte an.

## Der Ablese-Cursor {#the-reading-cursor}

`hover` ist standardmäßig eingeschaltet. Bewegen Sie den Zeiger über die Abbildung, erscheint ein senkrechter Cursor über alle Zeilen, mit dem Wert jeder Zeile in einem kleinen Feld. Näher als 8 px an einem Sprung, bei einer Einzellast oder einem Lager, rastet der Cursor dort ein, und V zeigt beide Seiten, wie `5.7 → −14.3 kN` unter der Last oben. Die Werte werden auch als Ereignis ausgegeben:

```vue
<DiagramStack :solver="solver" @readout="(r) => (reading = r)" />
```

Ein Ablesewert ist `{ x, values }`: `x` in Metern entlang des Trägers und `{ left, right }` je Zeile in SI-Einheiten; `null`, wenn der Zeiger die Abbildung verlässt.

## Eine verschiebbare Last {#a-load-the-reader-can-drag}

Übergeben Sie `v-model:load-at` die Position einer Einzellast, erhält sie einen Ziehpunkt: Die Lesenden ziehen ihn mit dem Zeiger oder fokussieren ihn und benutzen die Pfeiltasten. Die Komponente meldet nur die neue Position. Berechnen Sie den Träger mit der Last an dieser Stelle neu und geben Sie den neuen Solver zurück, so wie `MovingLoad.vue`:

```vue [MovingLoad.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { beamLine, DiagramStack, lineDiagram, modelFromSolver, rowRange, type StackRow } from '@edubeam/plot'

const L = 6 // m
const P = 20e3 // N

/** Der Träger mit der Einzellast `at` Meter von A entfernt, berechnet. */
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

/** Der Wertebereich jeder Zeile über alle Laststellungen, damit die Verläufe wachsen und schrumpfen, statt neu zu skalieren. */
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

Steht die Last bei 4,3 m, zeigt die Abbildung die Auflagerkräfte 5,7 kN und 14,3 kN, den Querkraftsprung von 5,7 auf −14,3 kN unter der Last und dort $M = 5{,}67 \cdot 4{,}3 = 24{,}4$ kNm. Ohne `ranges` skaliert jede Zeile beim Verschieben der Last auf ihre eigenen Extremwerte, und die Verläufe sähen aus, als änderten sie sich gar nicht.

| Prop | Standard | Legt fest |
| --- | --- | --- |
| `loadAt` | keine | die Position der Last, in m vom Anfang der Linie; mit `v-model:load-at` |
| `loadLabel` | `P = …` | den Text neben dem Ziehpunkt |
| `loadStep` | 0,05 | die Schrittweite, auf die beim Ziehen gerundet wird, m; um sie bewegen auch die Pfeiltasten die Last |

Der Ziehpunkt ist ein fokussierbarer `role="slider"` mit Wertebereich und Position für Screenreader. Die Pfeiltasten verschieben ihn um `loadStep`, die Tasten Bild↑ und Bild↓ um 1 m, Pos1 und Ende an die Enden des Trägers. Auf einem Touchscreen lässt er sich mit dem Finger ziehen, und vertikales Scrollen über der Abbildung funktioniert weiterhin.

Der Ziehpunkt steht für die Einzelkraft, die das berechnete Modell bei `loadAt` hat: Diese Kraft wird als Ziehpunkt gezeichnet und mit ihrem Betrag beschriftet, sofern Sie kein `loadLabel` angeben. Setzen Sie die Last im Modell an dieselbe Stelle, wie es `solveWithLoadAt` tut.

## Größe und Rendern auf dem Server {#size-and-server-rendering}

Die Abbildung misst ihren Container und ordnet die Zeichnung in dieser Breite an, mindestens 320 px. Solange sie nicht messen kann, verwendet sie `width`, standardmäßig 720 px. Die Schrift ist 12,5 px groß (`fontSize`) und wird mit der Abbildung nie kleiner.
