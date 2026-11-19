---
title: Farben und Farbschemata
description: "@edubeam/plot-Grafiken über CSS-Variablen oder die Prop colors einfärben: helles und dunkles Farbschema, Schwarz-Weiß-Druck, SVG-Dateien, Schrift, Animation."
order: 4
---

# Farben und Farbschemata

Eine Grafik übernimmt ihre Farben aus CSS-Variablen (Custom Properties) der Seite, sodass das helle und das dunkle Farbschema einer Website unverändert gelten. Wo die Seite keine definiert, springen die CSS-Systemfarben ein, die dem `color-scheme` der Seite folgen. Ohne weitere Einstellungen ist eine Grafik auf einer hellen Seite schwarz auf weiß und auf einer dunklen hell auf dunkel.

## CSS-Variablen {#custom-properties}

| Verwendet für | CSS-Variable | Ersatzwert |
| --- | --- | --- |
| Stäbe, Lager, Text | `--figure-ink`, dann `--ink` | `CanvasText` |
| Hintergrund, Rand um Beschriftungen | `--paper` | `Canvas` |
| Maßlinien, Achsen | `--muted` | `GrayText` |
| Knoten, die verschiebbare Last | `--brand` | `#4f46e5` |
| Normalkraft | `--color-normal` | `#2222ff` |
| Querkraft | `--color-shear` | `#00af00` |
| Biegemoment | `--color-moment` | `#ff2222` |
| Verformungsfigur | `--figure-ink`, dann `--ink` | `CanvasText` |
| Lasten | `--color-load` | `#ff8700` |
| Auflagerreaktionen | `--color-reaction` | `#a020f0` |
| Fachwerkstäbe unter Zug | `--color-tension`, dann `--color-moment` | `#ff2222` |
| Fachwerkstäbe unter Druck | `--color-compression`, dann `--color-normal` | `#2222ff` |
| Schrift | `--ebp-font`, dann `--font-sans` | `inherit` |

Setzen Sie die Variablen auf einem beliebigen Element oberhalb der Grafik, für eine ganze Website auf `:root`:

```css
:root {
  --ink: #1b1b3a;
  --paper: #ffffff;
  --color-moment: #d7263d;
}

.dark {
  --ink: #eeeeff;
  --paper: #0b0d1f;
}
```

Beschriftungen erhalten einen Rand in der Farbe `--paper`, damit sie über Schraffuren lesbar bleiben: Stimmen Sie diese Farbe auf den Hintergrund ab, auf dem die Grafik steht.

## Die Prop `colors` {#the-colors-prop}

Um eine einzelne Grafik einzufärben, übergeben Sie beliebige Farbtöne mit ihrem Namen:

```vue
<StructurePlot :solver="solver" :colors="{ moment: '#c00', paper: 'transparent' }" />
```

Die Farbtöne heißen `ink`, `paper`, `muted`, `brand`, `normal`, `shear`, `moment`, `deformed`, `load`, `reaction`, `tension` und `compression`. Jede CSS-Farbe ist erlaubt, auch ein `var(…)`. `DEFAULT_COLORS` enthält den Standardwert jedes Farbtons.

## Schwarz-Weiß {#black-and-white}

Für eine kopierte Klausur oder einen Schwarz-Weiß-Druck setzen Sie jeden farbigen Ton auf die Textfarbe:

```vue
<script setup lang="ts">
import type { PlotColors } from '@edubeam/plot'

const print: Partial<PlotColors> = {
  ink: '#000', paper: '#fff', muted: '#555', brand: '#000',
  normal: '#000', shear: '#000', moment: '#000', deformed: '#000',
  load: '#000', reaction: '#000', tension: '#000', compression: '#000',
}
</script>

<template>
  <StructurePlot :solver="solver" :colors="print" :animate="false" />
</template>
```

Die Verläufe bleiben auch ohne Farbe lesbar: Sie sind schraffiert, und das Moment liegt auf der Zugseite.

## Farben in einer SVG-Datei {#colours-in-an-svg-file}

Eine Datei, die [`structureSvg`](/de/plot/functions#a-standalone-svg-file) schreibt, hat keine Seite um sich herum und verwendet daher feste Farben: `PRINT_COLORS`, die Farben der EduBeam-App auf Weiß. Ihre Option `colors` nimmt dieselben Farbtöne wie die Prop, der Schwarz-Weiß-Satz von oben funktioniert also auch dort:

```ts
structureSvg(model, { colors: print }) // schwarz auf weiß
structureSvg(model, { background: false }) // kein Hintergrund, für eine farbige Folie
```

Nur feste Farben: Mit einem `var(…)` können Word und Inkscape nichts anfangen.

## Schriften {#fonts}

Text verwendet die Schrift der Seite, über `--ebp-font` oder `--font-sans`, mit Ziffern gleicher Breite (Tabellenziffern). Zeilennamen wie V(x) in `DiagramStack` erscheinen in den KaTeX-Schriften, wenn die Seite sie lädt, sonst in einer Serifenschrift. Eine SVG-Datei verwendet ihre Option `fontFamily`, standardmäßig Helvetica oder Arial, da sie die Schrift der Seite nicht kennen kann.

## Die Animation anpassen {#restyling-the-animation}

Die wenigen CSS-Regeln, die eine Grafik braucht, stehen direkt in jedem SVG, ein Stylesheet ist also nicht nötig. Alle Klassen beginnen mit `ebp-`, und eine Seite kann sie überschreiben. Jede Ebene ist ein `<g class="ebp-layer ebp-layer-{name}">`, das die Klasse `ebp-on` erhält, sobald es angezeigt wird:

```css
/* Langsameres Einblenden, für den Hörsaal */
.slides .ebp-animate .ebp-layer {
  transition-duration: 1s;
}
```

`PLOT_CSS` exportiert diese Regeln und `toneVars(colors)` die CSS-Variablen, die eine Grafik auf ihrem Wurzelelement setzt, damit Sie mit den [Zeichenfunktionen](/de/plot/functions#drawing) eigene Abbildungen bauen können.
