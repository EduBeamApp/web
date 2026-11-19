---
title: Esercizi e compiti
description: "Con @edubeam/fem e @edubeam/plot, un esercizio diverso per studente a partire da un seme, con soluzioni sempre giuste: in una pagina web, stampato o in SVG."
order: 5
group: Casi d’uso
source: site
---

# Esercizi e compiti

Scrivi una struttura una sola volta come funzione di un seme (valore iniziale del generatore casuale) e avrai un esercizio per ogni studente, ogni settimana, ciascuno con una soluzione sempre giusta: @edubeam/fem lo risolve e @edubeam/plot disegna il testo e la soluzione a partire dallo stesso modello.

Fai clic su **Nuovo esercizio** qui sotto. A ogni clic cambia il seme: l’esercizio viene generato, risolto e disegnato nel tuo browser.

::exercise-generator
::

La demo disegna gli esercizi di due pagine di questo sito, entrambe costruite con i pezzi descritti qui: gli [Esercizi di statica](/it/practice), dove lo studente inserisce le reazioni e il momento massimo o lo sforzo massimo in un’asta e li vede subito verificati, e il [generatore di compiti](/it/exam), che stampa una versione diversa del compito per ogni studente, con le soluzioni, e salva le figure come file SVG e i risultati come CSV. Provali prima di scrivere il tuo.

## Come funziona {#how-it-works}

1. **Un seme sceglie i numeri.** Un generatore casuale inizializzato con un seme dà lo stesso esercizio per lo stesso seme, così il seme stampato su un foglio permette di ritrovarne la soluzione.
2. **Il solutore calcola la soluzione.** @edubeam/fem risolve ogni struttura, quindi reazioni e momenti vengono dal solutore, non da una formula in cui potresti sbagliare.
3. **La figura disegna entrambi.** Il testo mostra la struttura con le etichette dei nodi, le quote e le reazioni incognite indicate per nome; la soluzione riporta i valori delle reazioni e aggiunge il diagramma.

Pochi file brevi ti portano da qui a un compito stampato: [il generatore](#the-generator), [un componente](#the-exercise-in-a-page) per una pagina web e [uno script](#print-a-test) che stampa un compito o [scrive le figure](#figures-for-latex-and-word) per LaTeX e Word. Copiali in un progetto in cui hai [installato le librerie](/it/plot/getting-started#install); gli script si eseguono con `node` dalla versione 22.18, oppure con `npx tsx` nelle versioni precedenti.

## Il generatore {#the-generator}

Un modulo, `exercise.ts`, trasforma un seme in un esercizio: una trave su una cerniera e un carrello, una volta su due con uno sbalzo che porta un carico concentrato all’estremità. Entrambi i casi sono isostatici, quindi ogni seme si può risolvere a mano oltre che con il solutore.

```ts [exercise.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { extremes, modelFromSolver, type PlotModel } from '@edubeam/plot'

export interface Exercise {
  readonly seed: number
  readonly statement: string
  /** La struttura risolta come dati semplici: disegna sia il testo sia la soluzione */
  readonly model: PlotModel
  /** Reazioni vincolari verso l’alto, N, e momenti flettenti estremi, N·m */
  readonly key: { RA: number; RB: number; mMax: number; mMin: number }
}

/** mulberry32: un piccolo generatore con seme, così un seme indica sempre lo stesso esercizio */
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

  // Una campata su cerniera e carrello, una volta su due con sbalzo: isostatica, quindi sempre risolvibile
  const L = pick([4, 5, 6]) // m
  const c = pick([0, 0, 1, 1.5, 2]) // m di sbalzo
  const q = int(4, 12) // kN/m sulla campata
  const F = int(2, 6) * 5 // kN all’estremità, oppure a `a` da A se non c’è sbalzo
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

  // La soluzione, dal modello risolto: reazioni (z punta verso il basso, quindi verso l’alto è negativo), estremi esatti di M
  const model = modelFromSolver(solver)
  const { reactions, members } = model.results!
  const up = (node: string) => -(reactions.find((x) => x.node === node && x.dof === 'dz')?.value ?? 0)
  const m = Object.values(members).flatMap((member) => extremes(member.M) ?? [])
  const mMax = Math.max(...m.map((e) => e.max.value))
  const mMin = Math.min(...m.map((e) => e.min.value))

  return { seed, statement, model, key: { RA: up('A'), RB: up('B'), mMax, mMin } }
}
```

`modelFromSolver` legge la struttura risolta in un [modello di disegno](/it/plot/model): dati semplici con le reazioni e i risultati di ogni asta come polinomi esatti, così `extremes` trova i momenti massimi senza campionamento. L’esercizio conserva solo quel modello; il solutore non serve più.

Il seme 5 dà *«Span L = 6 m with an overhang c = 1.5 m. q = 5 kN/m on the span, F = 25 kN at the tip C.»* (campata di 6 m con uno sbalzo di 1,5 m, 5 kN/m sulla campata e 25 kN all’estremità C). La sua soluzione: $R_A = (5 \cdot 6 \cdot 3 - 25 \cdot 1{,}5)/6 = 8{,}75$ kN, $R_B = 5 \cdot 6 + 25 - 8{,}75 = 46{,}25$ kN, $M_B = -25 \cdot 1{,}5 = -37{,}5$ kNm sull’appoggio e $M = 8{,}75^2/(2 \cdot 5) = 7{,}66$ kNm in campata, dove il taglio si annulla. Il solutore concorda fino all’ultima cifra.

## In una pagina web {#the-exercise-in-a-page}

Un componente, `ExerciseCard.vue`, disegna il testo dell’esercizio oppure, con `answers`, la soluzione:

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

Il secondo riquadro termina con *R<sub>A</sub> = 8.75 kN, R<sub>B</sub> = 46.25 kN, M from −37.5 kNm to 7.66 kNm*. `formatQuantity` scrive l’unità e un vero segno meno, come fa la figura.

Nel testo, `reaction-labels="names"` disegna le reazioni come incognite: una freccia per ogni direzione bloccata da un vincolo, orientata nel verso considerato positivo (verso destra, verso l’alto, in senso antiorario), con il nome *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>* al posto del valore. Il segno di ogni risposta è così definito sul disegno: una reazione che agisce nel verso opposto è negativa. La soluzione riporta i valori.

`reserve` impagina fin dall’inizio i livelli di entrambe le viste, così attivando `answers`, ad esempio con un pulsante *Mostra la soluzione* per lo studio individuale, il diagramma compare in dissolvenza al suo posto ([Figure progressive](/it/plot/structure-plot#figures-that-build-up)). `reserve-reaction-labels` fa lo stesso per le reazioni, così la trave resta ferma mentre i nomi diventano valori: vedi [Reazioni come incognite](/it/plot/structure-plot#reactions-as-unknowns).

## Un compito stampato {#print-a-test}

Per un compito scritto, uno script Node, `print-test.ts`, scrive una pagina per ogni studente e, dopo, le soluzioni. `structureSvg` trasforma ogni modello in testo SVG, quindi lo script non ha bisogno né di Vue né di un browser:

```ts [print-test.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const students = ['Ada', 'Ben', 'Cleo']
const exercises = students.map((_, i) => makeExercise(1000 + i)) // semi 1000, 1001, …

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

Apri `test.html` in un browser e stampalo, oppure salvalo in PDF: l’esercizio di ogni studente e ogni soluzione hanno una pagina a sé. La pagina di Ada e la sua soluzione:

![Esercizio 1000: una campata di 6 m con uno sbalzo di 2 m, 10 kN/m sulla campata e 30 kN all’estremità, le reazioni incognite indicate come A_x, A_z e B_z, e quote in serie di 6 m e 2 m con 8 m complessivi; sotto, la soluzione, con reazioni di 20 e 70 e il momento flettente da −60 sull’appoggio a 20 in campata](/screenshots/it/p2p-plot-exercise-sheet.webp){.shot-lg}

Il livello `dimensions` riporta ogni campata e la lunghezza complessiva, come il testo di un esercizio, e `reactionLabels: 'names'` dà un nome alle incognite, con ogni freccia orientata nel verso in cui la sua risposta è positiva. Nelle soluzioni, reazioni e valori dei diagrammi sono numeri senza unità, in kN e kNm, come nell’app EduBeam: se i tuoi studenti hanno bisogno di saperlo, scrivilo nell’intestazione delle soluzioni. Per una fotocopiatrice in bianco e nero, passa `colors` con tutti i toni impostati sul nero: vedi [Bianco e nero](/it/plot/theming#black-and-white).

## Figure per LaTeX e Word {#figures-for-latex-and-word}

Se prepari i compiti in LaTeX o Word, salva invece le figure come file e tieni il tuo modello di documento. `figures.ts` scrive il testo e la soluzione di 30 semi:

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

Eseguilo con `node figures.ts`: sono 60 file per 30 studenti, ciascuno un semplice SVG con colori fissi, senza CSS né script.

- **Word** (2019 e Microsoft 365) inserisce un SVG così com’è: *Inserisci › Immagini*.
- **LaTeX** include PDF anziché SVG. Converti una volta, con [CairoSVG](https://cairosvg.org) (`cairosvg exercise-1000.svg -o exercise-1000.pdf`) o con Inkscape, poi `\includegraphics[width=\linewidth]{exercise-1000.pdf}`. Il comando `\includesvg` del pacchetto `svg` fa la conversione al posto tuo, se Inkscape è installato.

Una figura è larga 640 unità con testo da 13 unità, quindi alla larghezza di una colonna di testo A4, circa 16 cm, le sue etichette sono di 9 pt. Imposta `fontFamily` su un font usato nel tuo documento: tutte le opzioni sono in [Un file SVG autonomo](/it/plot/functions#a-standalone-svg-file).

## Adattalo alle tue esigenze {#make-it-your-own}

- **Altri tipi di struttura.** Aggiungi casi: una mensola, una trave continua a due campate, un telaio a portale, una travatura reticolare. La demo in cima alla pagina sceglie tra otto tipi, dalla trave semplicemente appoggiata al telaio a tre cerniere, alla travatura Warren e al telaio a portale.
- **Esercizi iperstatici.** Il solutore li risolve altrettanto bene; si allunga solo la soluzione a mano.
- **Numeri tondi.** Prendi carichi e lunghezze da liste brevi, come sopra, così la soluzione viene tonda quanto vuoi. Scorri qualche centinaio di semi e scarta quelli la cui soluzione ha più decimali di quanti ne desideri.
- **Proteggiti dai meccanismi.** Un generatore che può disporre male i vincoli dovrebbe risolvere dentro un `try` e scartare i semi che sollevano un’eccezione: vedi [Quando il calcolo non riesce](/it/solver/solving#when-solving-fails).
- **Chiedi di più.** Disegna il taglio (`'V'`), la freccia (`'w'`, con i valori di [`getUnknowns`](/it/solver/results#displacements)) o lo sforzo normale in un’asta inclinata.
