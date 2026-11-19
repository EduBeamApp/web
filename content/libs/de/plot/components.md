---
title: Komponenten-API
description: "Alle Props und Events von StructurePlot und DiagramStack in @edubeam/plot 0.2.0 mit Typen und Standardwerten, das Plugin EduBeamPlot und die exportierten Typen."
order: 8
group: Referenz
---

# Komponenten-API

Die Props und Events der beiden Komponenten, wie sie in @edubeam/plot 0.2.0 deklariert sind. Slots haben beide nicht. Werte in SI-Einheiten sind als solche gekennzeichnet; Größen sind CSS-Pixel.

## StructurePlot {#structureplot}

```ts
import { StructurePlot } from '@edubeam/plot'
```

Zeichnet ein ebenes Tragwerk und seine Ergebnisse. Anleitung: [StructurePlot](/de/plot/structure-plot).

### Props {#props}

| Prop | Typ | Standard | Beschreibung |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Ein Solver von @edubeam/fem. Ergebnisse werden gezeichnet, sobald sein Lastfall berechnet ist. |
| `model` | `PlotModel` | – | Oder die einfachen Daten, die [`modelFromSolver`](/de/plot/model) erzeugt. Hat Vorrang vor `solver`. |
| `loadCase` | `number` | `0` | Index in `solver.loadCases` |
| `revision` | `number` | `0` | Ändern Sie den Wert, um einen direkt veränderten Solver neu zu zeichnen |
| `layers` | `readonly PlotLayer[]` | Stäbe, Lager, Lasten, Auflagerreaktionen und ein Ergebnis | Was gezeichnet wird: `'nodes'`, `'nodeLabels'`, `'dimensions'`, `'members'`, `'supports'`, `'loads'`, `'reactions'`, `'N'`, `'V'`, `'M'`, `'w'` |
| `reserve` | `readonly PlotLayer[]` | `layers` | Ebenen, für die auch im ausgeblendeten Zustand Platz freigehalten wird |
| `compact` | `boolean` | `false` | Darstellung als Vorschaubild: kleinere Symbole, höchstens zwei Werte pro Stab |
| `units` | `Partial<Units>` | `KN_UNITS` | Anzeigeeinheiten |
| `numberFormat` | `Intl.NumberFormat` | englisch, höchstens 1 Nachkommastelle | Formatiert jede Zahl |
| `colors` | `Partial<PlotColors>` | – | Abweichende Farben je Farbton: [Farben und Farbschemata](/de/plot/theming#the-colors-prop) |
| `width` | `number` | `640`, kompakt `400` | Breite, bevor der Container gemessen ist, etwa auf dem Server |
| `height` | `number` | – | Feste Höhe. Ohne sie richtet sich die Höhe nach der Zeichnung. |
| `maxHeight` | `number` | `max(320, 0.75 × width)`, kompakt keine | Obergrenze der automatischen Höhe |
| `padding` | `number` | `6` | Abstand um die Zeichnung |
| `fontSize` | `number` | `13`, kompakt `11.5` | Schriftgröße |
| `diagramSize` | `number` | `48`, kompakt `26` | Länge der größten Ordinate eines Verlaufs |
| `deformedSize` | `number` | `30`, kompakt `18` | Größte Verschiebung in der Verformungsfigur |
| `diagramScale` | `Partial<Record<ResultLayer, number>>` | – | Fester Maßstab in px pro SI-Einheit für ein Ergebnis, ersetzt `diagramSize` bzw. `deformedSize` |
| `momentOnTensionSide` | `boolean` | `true` | M auf der Zugseite; `false` für die Druckseite |
| `resultLabelMode` | `'horizontal' \| 'axis'` | `'horizontal'` | Werte aufrecht oder entlang ihrer Ordinate gedreht |
| `reactionLabels` | `'values' \| 'names'` | `'values'` | Auflagerreaktionen so, wie sie wirken, mit ihrem Wert; oder, für eine Übungsaufgabe, jede gehaltene Richtung benannt (*A<sub>x</sub>*, *M<sub>A</sub>*) und in die als positiv geltende Richtung zeigend. Namen brauchen keine Ergebnisse: [Auflagerreaktionen als Unbekannte](/de/plot/structure-plot#reactions-as-unknowns) |
| `reserveLabelModes` | `readonly ResultLabelMode[]` | – | Beschriftungsmodi, für die zusätzlich zum aktuellen Platz freigehalten wird |
| `reserveReactionLabels` | `readonly ReactionLabels[]` | – | Beschriftungsarten der Reaktionen, für die zusätzlich zu `reactionLabels` Platz freigehalten wird, damit die Zeichnung einer Aufgabe stillsteht, wenn daraus die Lösung wird |
| `animate` | `boolean` | `true` | Ebenen einblenden und Stäbe zeichnen lassen. Bei `prefers-reduced-motion` immer aus. |
| `hover` | `boolean` | `false` | Werte unter dem Zeiger ablesen, markiert an der Ordinatenspitze jedes Verlaufs. Ausgeschaltet verarbeitet die Grafik überhaupt keine Zeigereingaben. |
| `title` | `string` | eine Beschreibung des Dargestellten | Barrierefreier Name der Abbildung |

Ohne `layers` ist das Ergebnis `M` für Träger und Rahmen, `N` für ein Fachwerk und `w`, wenn keine Kraft übertragen wird (`defaultResultLayer`).

### Events {#events}

| Event | Nutzdaten | Wann |
| --- | --- | --- |
| `readout` | `Readout \| null` | Mit `hover`: die Stelle des Stabs unter dem Zeiger und ihre Ergebnisse; `null`, wenn der Zeiger die Grafik verlässt |

```ts
interface Readout {
  readonly member: string
  readonly x: number // m vom Anfangsknoten des Stabs
  readonly px: number // der Punkt auf dem Bildschirm, px
  readonly py: number
  readonly values: Readonly<Record<'N' | 'V' | 'M' | 'w', SidedValue>> // SI-Einheiten
  readonly u: number // Verschiebung in lokaler x-Richtung des Stabs, m
}
interface SidedValue {
  readonly left: number
  readonly right: number // gleich left, wo das Ergebnis stetig ist
}
```

## DiagramStack {#diagramstack}

```ts
import { DiagramStack } from '@edubeam/plot'
```

Zeichnet einen geraden Träger über seinen Verläufen auf einer gemeinsamen x-Achse. Die Stäbe müssen eine horizontale Linie bilden, von links nach rechts gezeichnet; alles andere löst einen Fehler aus. Anleitung: [DiagramStack](/de/plot/diagram-stack).

### Props {#props-1}

| Prop | Typ | Standard | Beschreibung |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Der berechnete Träger |
| `model` | `PlotModel` | – | Oder einfache Daten aus `modelFromSolver`; hat Vorrang |
| `loadCase` | `number` | `0` | Index in `solver.loadCases` |
| `revision` | `number` | `0` | Ändern Sie den Wert, um einen direkt veränderten Solver neu zu zeichnen |
| `members` | `readonly string[]` | alle Stäbe | Die Stäbe der Trägerlinie |
| `rows` | `readonly StackRow[]` | `['V', 'M', 'w']` | Zeilen mit Verläufen, von oben nach unten, aus `'N'`, `'V'`, `'M'`, `'w'` |
| `loadRow` | `boolean` | `true` | Der Träger mit Lagern, Lasten und Auflagerreaktionen über den Zeilen |
| `ranges` | `Partial<Record<StackRow, readonly [number, number]>>` | je Zeile der eigene | Wertebereich je Zeile, SI-Einheiten |
| `rowHeights` | `Partial<Record<StackRow, number>>` | N 100, V 116, M 128, w 76; unter 560 px Breite 88, 96, 104, 64 | Zeilenhöhen, bevor `maxHeight` sie skaliert |
| `maxHeight` | `number` | – | Die Zeilen schrumpfen auf höchstens 60 %, damit die Abbildung hineinpasst. Die Schrift behält ihre Größe. |
| `units` | `Partial<Units>` | `KN_UNITS` | Anzeigeeinheiten |
| `numberFormat` | `Intl.NumberFormat` | englisch, höchstens 1 Nachkommastelle | Formatiert jede Zahl |
| `colors` | `Partial<PlotColors>` | – | Abweichende Farben |
| `width` | `number` | `720` | Breite, bevor der Container gemessen ist; mindestens 320 werden verwendet |
| `fontSize` | `number` | `12.5` | Schriftgröße |
| `hover` | `boolean` | `true` | Der Ablese-Cursor. Ausgeschaltet verarbeitet die Abbildung keine Zeigereingaben. |
| `loadAt` | `number` | – | Position (m entlang der Linie) einer Einzellast, die Lesende verschieben dürfen; zusammen mit `v-model:load-at` |
| `loadLabel` | `string` | `P = …` mit dem Betrag der Last | Text neben der verschiebbaren Last |
| `loadStep` | `number` | `0.05` | Schrittweite, auf die beim Ziehen gerundet wird, m; um sie bewegen auch die Pfeiltasten die Last |
| `title` | `string` | eine Beschreibung der Zeilen | Barrierefreier Name der Abbildung |

### Events {#events-1}

| Event | Nutzdaten | Wann |
| --- | --- | --- |
| `update:loadAt` | `number` | Die Last wurde verschoben: ihre neue Position, m. Steuert `v-model:load-at`. |
| `readout` | `StackReadout \| null` | Die Werte des Cursors über alle Zeilen; `null`, wenn der Zeiger die Abbildung verlässt |

```ts
interface StackReadout {
  readonly x: number // m entlang der Trägerlinie
  readonly values: Partial<Record<'N' | 'V' | 'M' | 'w', { readonly left: number; readonly right: number }>> // SI
}
```

## Das Plugin {#the-plugin}

```ts
import { EduBeamPlot } from '@edubeam/plot'

app.use(EduBeamPlot) // registriert <StructurePlot> und <DiagramStack> global
```

Es ist optional: Benannte Importe der Komponenten sind schlanker, und ein Bundler entfernt das Plugin aus einem Build, der es nicht verwendet.

## Typen {#types}

Für typisierte Wrapper um die Komponenten exportiert das Paket deren Props und Events:

```ts
import type { PlotLayer, StructurePlotProps } from '@edubeam/plot'

const figure: StructurePlotProps = { layers: ['members', 'supports', 'M'] satisfies PlotLayer[], compact: true }
```

| Typ | Beschreibt |
| --- | --- |
| `StructurePlotProps`, `StructurePlotEmits` | Die Props und Events von `StructurePlot` |
| `DiagramStackProps`, `DiagramStackEmits` | Die Props und Events von `DiagramStack` |
| `Readout`, `ReadoutQuantity`, `SidedValue`, `StackReadout` | Nutzdaten der Events |
| `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `StackRow` | Namen von Ebenen, Ergebnissen, Beschriftungsmodi, Reaktionsbeschriftungen und Zeilen |
| `Units`, `Unit`, `UnitKind` | Anzeigeeinheiten: `{ symbol, scale }` je Art |
| `PlotColors` | Farben je Farbton |
| `PlotModel` | Das einfache Modell: [Zeichenmodell](/de/plot/model) |

Die übrigen Exporte, darunter `structureSvg` für SVG-Dateien und die Funktionen hinter der Zeichnung, finden Sie unter [Funktionen](/de/plot/functions).
