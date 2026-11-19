---
title: Übungsaufgaben und Klausuren
description: "Mit @edubeam/fem und @edubeam/plot für alle Studierenden eine eigene Statikaufgabe aus einem Seed erzeugen, mit stets richtiger Lösung: im Web, gedruckt, als SVG."
order: 5
group: Anwendungen
---

# Übungsaufgaben und Klausuren

Schreiben Sie ein Tragwerk einmal als Funktion eines Seeds (Startwert des Zufallsgenerators), und Sie haben eine Aufgabe für alle Studierenden, jede Woche, jede mit einem Lösungsblatt, das immer stimmt: @edubeam/fem berechnet sie, und @edubeam/plot zeichnet Aufgabenstellung und Lösung aus demselben Modell.

Klicken Sie unten auf **Neue Aufgabe**. Jeder Klick ist ein neuer Seed: Die Aufgabe wird direkt in Ihrem Browser erzeugt, berechnet und gezeichnet.

::exercise-generator
::

Die Demo zeichnet die Aufgaben zweier Seiten dieser Website, die beide aus den hier beschriebenen Bausteinen bestehen: [Übungsaufgaben](/de/practice), wo Studierende die Auflagerreaktionen und das größte Moment oder die größte Stabkraft eingeben und sofort erfahren, ob sie stimmen, und der [Klausurgenerator](/de/exam), der Klausuren druckt, für jede Studentin und jeden Studenten eine eigene Variante, mit Lösungsblatt, und die Abbildungen als SVG-Dateien und die Lösungen als CSV speichert. Probieren Sie beide aus, bevor Sie Ihren eigenen Generator schreiben.

## So funktioniert es {#how-it-works}

1. **Ein Seed wählt die Zahlen.** Ein Zufallsgenerator mit Seed liefert für denselben Seed dieselbe Aufgabe; über den Seed auf dem Blatt finden Sie also die zugehörige Lösung wieder.
2. **Der Solver rechnet die Lösung.** @edubeam/fem berechnet jedes Tragwerk, die Auflagerreaktionen und Momente stammen also aus dem Solver, nicht aus einer Formel, bei der Sie sich vertun könnten.
3. **Die Grafik zeichnet beides.** Das Übungsblatt zeigt das Tragwerk mit Knotenbezeichnungen, Bemaßung und den unbekannten Auflagerreaktionen mit ihren Namen; das Lösungsblatt nennt die Werte der Reaktionen und ergänzt den Verlauf.

Einige kurze Dateien bringen Sie von hier zur gedruckten Klausur: [der Generator](#the-generator), [eine Komponente](#the-exercise-in-a-page) für eine Webseite und [ein Skript](#print-a-test), das eine Klausur druckt oder [Abbildungen](#figures-for-latex-and-word) für LaTeX und Word schreibt. Kopieren Sie sie in ein Projekt, in dem [die Bibliotheken installiert](/de/plot/getting-started#install) sind; die Skripte laufen ab Node 22.18 mit `node`, in älteren Versionen mit `npx tsx`.

## Der Generator {#the-generator}

Ein einziges Modul, `exercise.ts`, macht aus einem Seed eine Aufgabe: einen Träger auf Fest- und Loslager, in der Hälfte der Fälle mit einem Kragarm, an dessen Ende eine Einzellast angreift. Beide Varianten sind statisch bestimmt, jeder Seed lässt sich also von Hand ebenso lösen wie mit dem Solver.

```ts [exercise.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { extremes, modelFromSolver, type PlotModel } from '@edubeam/plot'

export interface Exercise {
  readonly seed: number
  readonly statement: string
  /** Das berechnete Tragwerk als einfache Daten: daraus entstehen Aufgabenstellung und Lösung */
  readonly model: PlotModel
  /** Auflagerkräfte, nach oben positiv, N, und die extremen Biegemomente, N·m */
  readonly key: { RA: number; RB: number; mMax: number; mMin: number }
}

/** mulberry32: ein winziger Zufallsgenerator mit Seed, damit ein Seed für immer dieselbe Aufgabe bezeichnet */
const random = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), seed | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export const makeExercise = (seed: number): Exercise => {
  const r = random(seed)
  const pick = <T>(xs: readonly T[]): T => xs[Math.floor(r() * xs.length)]
  const int = (lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1))

  // Ein Feld auf Fest- und Loslager, in der Hälfte der Fälle mit Kragarm: statisch bestimmt, also immer lösbar
  const L = pick([4, 5, 6]) // m
  const c = pick([0, 0, 1, 1.5, 2]) // m Kragarm
  const q = int(4, 12) // kN/m auf dem Feld
  const F = int(2, 6) * 5 // kN am Kragende, ohne Kragarm im Abstand `a` von A
  const a = int(1, L - 1) // m

  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  if (c > 0) {
    domain.createNode('C', [L + c, 0, 0])
    domain.createBeam2D(2, ['B', 'C'], 1, 1)
    lc.createNodalLoad('C', { [DofID.Dz]: F * 1e3 })
  } else {
    lc.createBeamConcentratedLoad(1, [0, F * 1e3, 0, a], true)
  }
  solver.solve()

  const statement =
    c > 0
      ? `Span L = ${L} m with an overhang c = ${c} m. q = ${q} kN/m on the span, F = ${F} kN at the tip C.`
      : `Span L = ${L} m. q = ${q} kN/m over the span, F = ${F} kN at ${a} m from A.`

  // Die Lösung aus dem berechneten Modell: Auflagerreaktionen (z zeigt nach unten, oben ist also minus), exakte Extremwerte von M
  const model = modelFromSolver(solver)
  const { reactions, members } = model.results!
  const up = (node: string) => -(reactions.find((x) => x.node === node && x.dof === 'dz')?.value ?? 0)
  const m = Object.values(members).flatMap((member) => extremes(member.M) ?? [])
  const mMax = Math.max(...m.map((e) => e.max.value))
  const mMin = Math.min(...m.map((e) => e.min.value))

  return { seed, statement, model, key: { RA: up('A'), RB: up('B'), mMax, mMin } }
}
```

`modelFromSolver` liest das berechnete Tragwerk in ein [Zeichenmodell](/de/plot/model) ein: einfache Daten mit den Auflagerreaktionen und den Ergebnissen jedes Stabs als exakte Polynome, sodass `extremes` die größten Momente ohne Abtasten findet. Die Aufgabe behält nur dieses Modell; den Solver braucht sie nicht mehr.

Seed 5 ergibt *„Span L = 6 m with an overhang c = 1.5 m. q = 5 kN/m on the span, F = 25 kN at the tip C.“* Die Lösung: $R_A = (5 \cdot 6 \cdot 3 - 25 \cdot 1{,}5)/6 = 8{,}75$ kN, $R_B = 5 \cdot 6 + 25 - 8{,}75 = 46{,}25$ kN, über dem Lager $M_B = -25 \cdot 1{,}5 = -37{,}5$ kNm und im Feld, wo die Querkraft null ist, $M = 8{,}75^2/(2 \cdot 5) = 7{,}66$ kNm. Der Solver stimmt bis auf die letzte Stelle überein.

## Auf einer Webseite {#the-exercise-in-a-page}

Eine Komponente, `ExerciseCard.vue`, zeichnet die Aufgabenstellung oder, mit `answers`, die Lösung:

```vue [ExerciseCard.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { formatQuantity, KN_UNITS, StructurePlot, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise'

const props = defineProps<{ seed: number; answers?: boolean }>()
const exercise = computed(() => makeExercise(props.seed))

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']
const twoDecimals = new Intl.NumberFormat('en', { maximumFractionDigits: 2 })
const kN = (si: number) => formatQuantity(si, KN_UNITS.force, twoDecimals)
const kNm = (si: number) => formatQuantity(si, KN_UNITS.moment, twoDecimals)
</script>

<template>
  <article>
    <h3>Exercise {{ seed }}</h3>
    <p>{{ exercise.statement }} Find the reactions and draw the bending moment diagram.</p>
    <StructurePlot
      :model="exercise.model"
      :layers="answers ? key : sheet"
      :reserve="[...sheet, ...key]"
      :reaction-labels="answers ? 'values' : 'names'"
      :reserve-reaction-labels="['names', 'values']"
    />
    <p v-if="answers">
      R<sub>A</sub> = {{ kN(exercise.key.RA) }}, R<sub>B</sub> = {{ kN(exercise.key.RB) }},
      M from {{ kNm(exercise.key.mMin) }} to {{ kNm(exercise.key.mMax) }}
    </p>
  </article>
</template>
```

```vue
<ExerciseCard :seed="5" />
<ExerciseCard :seed="5" answers />
```

Die zweite Karte endet mit *R<sub>A</sub> = 8.75 kN, R<sub>B</sub> = 46.25 kN, M from −37.5 kNm to 7.66 kNm*. `formatQuantity` schreibt die Einheit und ein echtes Minuszeichen, so wie die Grafik. Den Dezimalpunkt liefert das Format `'en'`; mit `new Intl.NumberFormat('de', …)` erhalten Sie ein Dezimalkomma.

Auf dem Übungsblatt zeichnet `reaction-labels="names"` die Auflagerreaktionen als Unbekannte: einen Pfeil für jede Richtung, die ein Lager hält, in die Richtung, die als positiv gilt (nach rechts, nach oben, gegen den Uhrzeigersinn), benannt mit *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>* statt mit einem Wert versehen. Damit ist das Vorzeichen jeder Antwort in der Zeichnung festgelegt: Eine Reaktion, die andersherum wirkt, ist negativ. Das Lösungsblatt schreibt die Werte an.

`reserve` plant den Platz für die Ebenen beider Ansichten von Anfang an ein. Schalten Sie `answers` ein, etwa mit einer Schaltfläche *Lösung anzeigen* zum Selbststudium, blendet sich der Verlauf an seiner Stelle ein ([Schrittweise aufgebaute Abbildungen](/de/plot/structure-plot#figures-that-build-up)). `reserve-reaction-labels` tut dasselbe für die Auflagerreaktionen: Der Träger bleibt, wo er ist, während aus den Namen Werte werden. Siehe [Auflagerreaktionen als Unbekannte](/de/plot/structure-plot#reactions-as-unknowns).

## Eine gedruckte Klausur {#print-a-test}

Für eine schriftliche Klausur schreibt ein Node-Skript, `print-test.ts`, eine Seite pro Studentin oder Student und danach die Lösungen. `structureSvg` macht aus jedem Modell SVG-Text, das Skript braucht also weder Vue noch einen Browser:

```ts [print-test.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const students = ['Ada', 'Ben', 'Cleo']
const exercises = students.map((_, i) => makeExercise(1000 + i)) // Seeds 1000, 1001, …

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']
const task = 'Find the reactions and draw the bending moment diagram.'

const pages = [
  ...exercises.map((e, i) => `<h2>${students[i]}, exercise ${e.seed}</h2>
    <p>${e.statement} ${task}</p>${structureSvg(e.model, { layers: sheet, reactionLabels: 'names' })}`),
  ...exercises.map((e) => `<h2>Key, exercise ${e.seed}</h2>
    ${structureSvg(e.model, { layers: key })}`),
]

const style = `body { font: 15px/1.5 system-ui, sans-serif; max-width: 640px; margin: 2rem auto }
  section { break-after: page }`
writeFileSync('test.html', `<!doctype html><meta charset="utf-8"><title>Test</title>
  <style>${style}</style>${pages.map((page) => `<section>${page}</section>`).join('\n')}`)
```

```bash
node print-test.ts
```

Öffnen Sie `test.html` im Browser und drucken Sie die Datei oder speichern Sie sie als PDF: Jede Aufgabe und jede Lösung bekommt eine eigene Seite. Adas Seite und ihre Lösung:

![Aufgabe 1000: ein Feld von 6 m mit einem Kragarm von 2 m, 10 kN/m auf dem Feld und 30 kN am Kragende, die unbekannten Auflagerreaktionen als A_x, A_z und B_z benannt, Kettenbemaßung 6 m und 2 m, gesamt 8 m; darunter die Lösung mit den Auflagerkräften 20 und 70 und dem Biegemoment von −60 über dem Lager bis 20 im Feld](/screenshots/de/p2p-plot-exercise-sheet.webp){.shot-lg}

Die Ebene `dimensions` gibt jedes Feld und die Gesamtlänge an, wie ein Übungsblatt, und `reactionLabels: 'names'` benennt die Unbekannten, wobei jeder Pfeil in die Richtung zeigt, in der seine Antwort positiv zählt. Im Lösungsblatt sind Auflagerreaktionen und Werte der Verläufe reine Zahlen in kN und kNm, wie in der EduBeam-App: Schreiben Sie das in die Überschrift des Lösungsblatts, falls Ihre Studierenden den Hinweis brauchen. Für einen Schwarz-Weiß-Kopierer übergeben Sie `colors` mit allen Farbtönen auf Schwarz: siehe [Schwarz-Weiß](/de/plot/theming#black-and-white).

## Abbildungen für LaTeX und Word {#figures-for-latex-and-word}

Schreiben Sie Ihre Klausuren in LaTeX oder Word, speichern Sie die Abbildungen stattdessen als Dateien und behalten Sie Ihre eigene Vorlage. `figures.ts` schreibt Übungs- und Lösungsblatt für 30 Seeds:

```ts [figures.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']

for (let seed = 1000; seed < 1030; seed++) {
  const { model } = makeExercise(seed)
  writeFileSync(`exercise-${seed}.svg`, structureSvg(model, { layers: sheet, reactionLabels: 'names' }))
  writeFileSync(`exercise-${seed}-key.svg`, structureSvg(model, { layers: key }))
}
```

Führen Sie es mit `node figures.ts` aus: Das ergibt 60 Dateien für 30 Studierende, jede ein einfaches SVG mit festen Farben, ohne CSS und ohne Skripte.

- **Word** (2019 und Microsoft 365) fügt ein SVG direkt ein: *Einfügen › Bilder*.
- **LaTeX** bindet PDF statt SVG ein. Konvertieren Sie einmal mit [CairoSVG](https://cairosvg.org) (`cairosvg exercise-1000.svg -o exercise-1000.pdf`) oder Inkscape und verwenden Sie dann `\includegraphics[width=\linewidth]{exercise-1000.pdf}`. Ist Inkscape installiert, übernimmt `\includesvg` aus dem Paket `svg` die Konvertierung für Sie.

Eine Abbildung ist 640 Einheiten breit, mit Text von 13 Einheiten; in der Breite einer Textspalte auf A4, etwa 16 cm, sind die Beschriftungen also 9 pt groß. Setzen Sie `fontFamily` auf eine Schrift Ihres Dokuments: Alle Optionen finden Sie unter [Eine eigenständige SVG-Datei](/de/plot/functions#a-standalone-svg-file).

## Eigene Erweiterungen {#make-it-your-own}

- **Weitere Tragwerke.** Ergänzen Sie Fälle: einen Kragträger, einen Zweifeldträger, einen Portalrahmen, ein Fachwerk. Die Demo oben wählt aus acht Tragwerkstypen, vom Einfeldträger über den Dreigelenkrahmen und das Warren-Fachwerk (Strebenfachwerk) bis zum Portalrahmen.
- **Statisch unbestimmte Aufgaben.** Der Solver rechnet sie genauso; nur die Handrechnung wird länger.
- **Runde Zahlen.** Wählen Sie Lasten und Längen aus kurzen Listen, wie oben, damit die Lösung so rund ausfällt, wie Sie möchten. Durchlaufen Sie ein paar Hundert Seeds und überspringen Sie die, deren Lösung mehr Nachkommastellen hat als gewünscht.
- **Mechanismen abfangen.** Ein Generator, der Lager ungünstig setzen kann, sollte in einem `try` rechnen und die Seeds überspringen, die einen Fehler werfen: siehe [Wenn die Berechnung scheitert](/de/solver/solving#when-solving-fails).
- **Mehr abfragen.** Lassen Sie die Querkraft (`'V'`), die Durchbiegung (`'w'`, mit den Werten aus [`getUnknowns`](/de/solver/results#displacements)) oder die Normalkraft in einem geneigten Stab zeichnen.
