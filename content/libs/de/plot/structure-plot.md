---
title: StructurePlot
description: "Träger, Rahmen und Fachwerke mit StructurePlot: Ebenen, schrittweise Abbildungen, Reaktionen als Unbekannte, Vorschaubilder, Größe, Einheiten, Werte ablesen."
order: 2
group: Komponenten
---

# StructurePlot

`StructurePlot` zeichnet ein ganzes Tragwerk, eingepasst in die Breite seines Containers: Stäbe, Gelenke, Lager, Lasten, Auflagerreaktionen, die Verläufe von N, V und M und die Verformungsfigur. Übergeben Sie einen Solver oder das daraus erzeugte [einfache Modell](/de/plot/model) und legen Sie fest, was gezeichnet werden soll.

```vue
<StructurePlot :solver="solver" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

Alle Props mit Typ und Standardwert finden Sie in der [Komponenten-API](/de/plot/components#structureplot).

Die folgende Abbildung ist ein `StructurePlot` mit eingeschalteten `nodeLabels` und `dimensions`, gesetztem `hover` und dem Zahlenformat dieser Website mit vier signifikanten Stellen: Wechseln Sie zwischen den Ergebnissen und zeigen Sie auf einen Stab, um seine Werte abzulesen.

::model-figure{caption="Ein Portalrahmen: Fußpunkte gelenkig gelagert, 10 kN/m auf dem Riegel, 15 kN in B"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: pin, D: pin }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
  - { node: B, fx: 15 }
results: [M, V, N, w]
show: [nodeLabels, dimensions]
---
::

## Ebenen {#layers}

Eine Grafik besteht aus Ebenen. Sie werden immer in derselben Reihenfolge gezeichnet, egal in welcher Reihenfolge Sie sie angeben:

| Ebene | Zeichnet |
| --- | --- |
| `members` | die Stäbe, Gelenke als kleine Kreise |
| `supports` | ein Symbol für jedes Lager, bei schrägen Lagern gedreht |
| `loads` | Knoten- und Stablasten, Temperaturlasten und Auflagersenkungen, jeweils mit ihren Werten |
| `reactions` | die Auflagerreaktionen als Pfeile und gebogene Pfeile mit ihren Werten; mit `reactionLabels: 'names'` als [benannte Unbekannte](#reactions-as-unknowns) einer Übungsaufgabe |
| `nodes` | jeden Knoten als kleinen Kreis |
| `nodeLabels` | die Knotenbezeichnungen |
| `dimensions` | Kettenbemaßung, wie auf einem Übungsblatt: alle Abstände zwischen Knoten und Einzellasten unter dem Tragwerk, jedes Geschoss rechts davon und die Gesamtmaße in einer zweiten Zeile |
| `N`, `V`, `M` | die Verläufe von Normalkraft, Querkraft und Biegemoment |
| `w` | die Verformungsfigur |

Lassen Sie `layers` weg, zeichnet die Grafik Stäbe, Lager, Lasten und Auflagerreaktionen sowie ein Ergebnis, das zum Tragwerk passt: `M` für Träger und Rahmen, `N` für ein Fachwerk und `w`, wenn keine Kraft übertragen wird, etwa bei einem Träger, der sich unter einer Temperaturlast frei ausdehnen kann.

Die Verläufe entsprechen der EduBeam-App: N und V sind quer zum Stab schraffiert, M liegt auf der Zugseite, ein positives Moment also unter dem Träger. Mit `:moment-on-tension-side="false"` wird M stattdessen auf der Druckseite angetragen. Ein Fachwerk zeigt die Kraft jedes Stabs einmal, entlang des Stabs und nach Vorzeichen eingefärbt.

## Schrittweise aufgebaute Abbildungen {#figures-that-build-up}

`reserve` listet Ebenen auf, für die Platz freigehalten wird, solange sie ausgeblendet sind. Die Grafik plant den Platz für alle reservierten Ebenen von Anfang an ein. Wird eine davon eingeschaltet, blendet sie sich an ihrer Stelle ein, und nichts anderes verschiebt sich:

```vue
<script setup lang="ts">
import type { PlotLayer } from '@edubeam/plot'

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'],
  ['nodeLabels', 'members', 'supports'],
  ['nodeLabels', 'members', 'supports', 'loads'],
  ['members', 'supports', 'loads', 'reactions'],
  ['members', 'supports', 'reactions', 'M'],
]
const all = [...new Set(stages.flat())]
// `frame` ist ein berechneter Solver, `step` der aktuelle Schritt: die ganze Komponente steht unter „Folien und Skripte“
</script>

<template>
  <StructurePlot :solver="frame" :layers="stages[step]" :reserve="all" />
</template>
```

Mit `animate`, standardmäßig eingeschaltet, blenden sich Ebenen weich ein, und Stäbe zeichnen sich von einem Ende zum anderen. Bei `prefers-reduced-motion` ist nichts animiert. Unter [Folien und Skripte](/de/plot/slides) kommt diese Abbildung in einen Foliensatz.

## Werte an den Verläufen {#diagram-values}

Jeder Wert steht knapp hinter der Spitze der Ordinate, zu der er gehört, so wie ein Lehrbuch einen Verlauf beschriftet: jedes Stabende mit einem Wert ungleich null, die Extremwerte dazwischen, beide Werte an einem Sprung und eine biegesteife Ecke nur einmal. Die Werte sind reine Zahlen in der Anzeigeeinheit (kN für N und V, kNm für M), ebenso die Auflagerreaktionen, wie in der EduBeam-App; Einheiten stehen nur bei Vorgaben: Lasten, Auflagersenkungen und Temperaturänderungen. Eine Beschriftung, die eine andere Beschriftung, einen Stab oder einen Pfeil überdecken würde, probiert andere Plätze an derselben Spitze aus und entfällt, wenn keiner frei ist; zwei Zahlen liegen also nie übereinander. Die Werte von Lasten und Auflagerreaktionen werden zuerst platziert, damit die Zahlen eines Verlaufs sie nie verdrängen. Stabkräfte im Fachwerk entfallen nie: Sie verschieben sich entlang des Stabs, wechseln die Seite und werden notfalls verkleinert.

Mit `result-label-mode="axis"` laufen die Werte entlang ihrer Ordinaten, so wie die EduBeam-App sie schreibt. Können die Lesenden zwischen beiden Varianten wechseln, geben Sie `:reserve-label-modes="['horizontal', 'axis']"` an, damit sich die Zeichnung beim Wechsel nicht verschiebt.

## Auflagerreaktionen als Unbekannte {#reactions-as-unknowns}

Ein Übungsblatt fragt nach den Auflagerreaktionen, es soll sie also ohne ihre Werte zeigen. Mit `reaction-labels="names"` erscheint ein Pfeil für jede Richtung, die ein Lager hält, in die Richtung, die als positiv gilt: entlang der x-Achse des Knotens (nach rechts, wenn das Lager nicht gedreht ist), nach oben und, für ein Einspannmoment, gegen den Uhrzeigersinn. Jeder Pfeil ist nach seinem Knoten benannt, *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>*, kursiv und mit echtem Index. Damit ist das Vorzeichen jeder Antwort in der Zeichnung festgelegt: Eine Reaktion, die andersherum wirkt, ist negativ.

```vue
<StructurePlot
  :model="model"
  :layers="['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']"
  reaction-labels="names"
/>
```

![Oben ein einseitig eingespannter Träger als Übungsblatt: Einspannung in A, Loslager in B, 40 kN in Feldmitte, Kettenbemaßung 3 m und 3 m, gesamt 6 m, die Auflagerreaktionen als benannte Pfeile A_x, A_z, M_A und B_z. Unten derselbe Träger mit den standardmäßigen Reaktionsbeschriftungen: 27,5 und 12,5 nach oben, ein Einspannmoment von 45 und das Biegemoment von −45 an der Einspannung bis 37,5 unter der Last](/screenshots/de/p4-plot-reaction-names.webp){.shot-lg}

Namen brauchen keine Ergebnisse, daher lässt sich auch ein noch nicht berechnetes Modell als Übungsblatt zeichnen. Für das Lösungsblatt lassen Sie `reactionLabels` auf `'values'`. Namen und Werte brauchen unterschiedlich viel Platz (eine horizontale Reaktion von null hat auf dem Übungsblatt einen Namen, im Lösungsblatt aber keinen Pfeil). Eine Grafik, die zwischen beiden wechselt, sollte daher mit `:reserve-reaction-labels="['names', 'values']"` Platz für beide freihalten: Die Zeichnung bleibt dann, wo sie ist, und nur die Beschriftungen ändern sich. Die Aufgabenkarte unter [Übungsaufgaben und Klausuren](/de/plot/exercises#the-exercise-in-a-page) wechselt über eine Prop `answers` zwischen beiden, so wie die [Übungsaufgaben](/de/practice) dieser Website, wenn Studierende die Lösung anfordern.

## Vorschaubilder {#thumbnails}

`compact` ist für Kacheln von etwa 400 × 200 px gedacht: kleinere Symbole und 11,5 px große Schrift, höchstens zwei Werte pro Stab und Streckenlasten nur mit ihrem Betrag beschriftet, ohne `q =`.

```vue
<StructurePlot v-for="t in tiles" :key="t.title" :solver="t.solver" compact :height="200" :title="t.title" />
```

So ist die [Beispielgalerie](/de/examples/) dieser Website gezeichnet.

## Größe {#size}

Die Grafik misst ihren Container und ordnet die Zeichnung in dieser Breite an, in echten Pixeln. Ohne `height` richtet sich die Höhe nach der Zeichnung, bis höchstens `maxHeight`, standardmäßig $\max(320;\ 0{,}75 \times \text{Breite})$. Solange sie nicht messen kann, etwa auf dem Server, verwendet sie `width`, standardmäßig 640 px.

| Prop | Standard | Legt fest |
| --- | --- | --- |
| `width` | 640, kompakt 400 | die Breite der Anordnung, bis der Container gemessen ist, px |
| `height` | folgt der Zeichnung | eine feste Höhe, px |
| `maxHeight` | $\max(320;\ 0{,}75w)$, kompakt keine | die Obergrenze der automatischen Höhe |
| `padding` | 6 | Abstand um die Zeichnung, px |
| `fontSize` | 13, kompakt 11,5 | Schriftgröße, px |
| `diagramSize` | 48, kompakt 26 | die Länge der größten Ordinate, px |
| `deformedSize` | 30, kompakt 18 | die größte Verschiebung der Verformungsfigur, px |

### Mehrere Grafiken im gleichen Maßstab {#several-plots-at-one-scale}

Jede Grafik skaliert ihre Verläufe auf ihren eigenen Größtwert, ein Moment von 20 kNm sieht also genauso groß aus wie eines von 80 kNm. Zum Vergleichen legen Sie mit `diagramScale` den Maßstab in Pixeln pro SI-Einheit fest:

```vue
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams' // aus „Erste Schritte“: (Spannweite m, q kN/m) => ein berechneter Solver

const spans = [4, 6, 8].map((L) => ({ L, solver: simpleBeam(L, 10) }))
// 0,5 px pro kNm (0,5e-3 px pro N·m): die 80 kNm des 8-m-Feldes werden 40 px tief gezeichnet, die 20 kNm des 4-m-Feldes 10 px
const scale = { M: 0.5e-3 }
</script>

<template>
  <figure v-for="s in spans" :key="s.L">
    <StructurePlot :solver="s.solver" :layers="['members', 'supports', 'M']" :diagram-scale="scale" />
    <figcaption>L = {{ s.L }} m</figcaption>
  </figure>
</template>
```

## Einheiten und Zahlen {#units-and-numbers}

Intern sind alle Werte in SI und werden nur für die Anzeige umgerechnet: standardmäßig in kN, kNm, kN/m, m, mm, mrad und K. Jede Einheit lässt sich durch ein Symbol und einen Faktor ersetzen, Anzeigewert = SI-Wert × Faktor:

```vue
<StructurePlot :solver="solver" :units="{ force: { symbol: 'N', scale: 1 } }" />
```

Zahlen laufen durch ein `Intl.NumberFormat`, standardmäßig englisch mit höchstens einer Nachkommastelle. Übergeben Sie ein eigenes, das zur Sprache der Seite passt:

```vue
<StructurePlot :solver="solver" :number-format="new Intl.NumberFormat('cs', { maximumFractionDigits: 2 })" />
```

Minuszeichen sind echte Minuszeichen (−), und ein Wert, der auf null gerundet wird, erscheint nie als −0. Die Einheiten heißen `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` und `temperature`; `KN_UNITS` und `SI_UNITS` werden als Ausgangspunkte exportiert.

## Werte ablesen {#reading-values}

Mit `hover` liest die Grafik die angezeigten Ergebnisse an der Stelle des Stabs unter dem Zeiger ab. Sie markiert jeden Wert dort, wo er gezeichnet ist, mit einem Punkt an der Spitze der Ordinate jedes angezeigten Verlaufs (an einem Sprung an beiden Spitzen) oder auf der Verformungsfigur, und listet die Werte in einem kleinen Feld auf, etwa `M = 54 kNm`, oder beide Seiten eines Sprungs, `V = 13.3 → −6.7 kN`. Der Zeiger erfasst einen Stab von überall über seinem Verlauf, nicht nur auf dem Stab selbst. Die Grafik gibt die Werte auch als Daten aus:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { StructurePlot, type Readout } from '@edubeam/plot'
import { portalFrame } from './frame' // aus „Folien und Skripte“: () => ein berechneter Solver

const frame = portalFrame()
const reading = ref<Readout | null>(null)
</script>

<template>
  <StructurePlot :solver="frame" :layers="['members', 'supports', 'M']" hover @readout="reading = $event" />
  <p v-if="reading">
    Member {{ reading.member }}, {{ reading.x.toFixed(2) }} m from its start:
    M = {{ (reading.values.M.left / 1e3).toFixed(1) }} kNm
  </p>
</template>
```

Ein Ablesewert ist `{ member, x, px, py, values, u }`: der Stab, die Position entlang des Stabs in Metern, der Punkt auf dem Bildschirm in px, `{ left, right }` für jedes von `N`, `V`, `M` und `w` in SI-Einheiten und die Längsverschiebung `u`. Verlässt der Zeiger die Grafik, ist er `null`. Die interaktiven Abbildungen auf dieser Website verwenden `hover`: Zeigen Sie auf eine.

Ohne `hover` registriert eine Grafik überhaupt keine Event-Listener: Die Seite scrollt also über sie hinweg, und ein Tippen auf eine Grafik innerhalb eines Links folgt dem Link. Mit `hover` hört die Grafik nur auf Pointer-Events, und vertikales Scrollen und Zoomen mit zwei Fingern funktionieren auf Touchscreens weiterhin.

## Barrierefreiheit {#accessibility}

Jede Grafik ist ein `<svg role="img">`, benannt nach ihrer Prop `title` oder nach einer Beschreibung dessen, was sie zeigt, etwa „Structure with its loads, reactions, bending moment“. Ausgeblendete reservierte Ebenen sind `aria-hidden`.
