---
title: Exerciții și teste
description: "Alt exercițiu de statică pentru fiecare student, generat dintr-un seed cu @edubeam/fem și @edubeam/plot, cu un barem mereu corect: pe web, tipărit sau ca figuri SVG."
order: 5
group: Utilizări
source: site
---

# Exerciții și teste

Scrie o structură o singură dată, ca funcție de un seed (valoarea de inițializare a unui generator de numere aleatoare), și ai câte un exercițiu pentru fiecare student, în fiecare săptămână, fiecare cu un barem mereu corect: @edubeam/fem îl rezolvă, iar @edubeam/plot desenează enunțul și baremul din același model.

Apasă mai jos **Exercițiu nou**. Fiecare apăsare înseamnă un seed nou: exercițiul este generat, calculat și desenat în browserul tău.

::exercise-generator
::

Demonstrația desenează problemele a două pagini de pe acest site, construite amândouă din piesele descrise aici. Pe pagina [Probleme de statică](/ro/practice) studentul introduce reacțiunile și cel mai mare moment sau cel mai mare efort dintr-o bară și află imediat dacă sunt corecte. [Generatorul de teste](/ro/exam) tipărește pentru fiecare student altă variantă a testului, cu barem, și salvează figurile ca fișiere SVG, iar răspunsurile ca CSV. Încearcă-le înainte să-ți scrii propriul generator.

## Cum funcționează {#how-it-works}

1. **Seedul alege numerele.** Un generator de numere aleatoare cu seed dă același exercițiu pentru același seed, așa că seedul tipărit pe foaie regăsește oricând baremul.
2. **Programul de calcul face baremul.** @edubeam/fem rezolvă fiecare structură, deci reacțiunile și momentele vin din calcul, nu dintr-o formulă în care poți greși.
3. **Desenul le arată pe amândouă.** Enunțul arată structura cu etichetele nodurilor, cotele și reacțiunile necunoscute denumite; baremul dă valorile reacțiunilor și adaugă diagrama.

De aici până la un test tipărit te duc câteva fișiere scurte: [generatorul](#the-generator), [o componentă](#the-exercise-in-a-page) pentru o pagină web și [un script](#print-a-test) care tipărește un test sau [scrie figuri](#figures-for-latex-and-word) pentru LaTeX și Word. Copiază-le într-un proiect care are [bibliotecile instalate](/ro/plot/getting-started#install); scripturile rulează cu `node` de la versiunea 22.18 sau cu `npx tsx` pe versiunile mai vechi.

## Generatorul {#the-generator}

Un singur modul, `exercise.ts`, transformă un seed într-un exercițiu: o grindă cu o articulație și un reazem simplu, în jumătate din cazuri cu o consolă încărcată cu o forță concentrată la capăt. Ambele variante sunt static determinate, deci fiecare seed poate fi rezolvat de mână la fel de bine ca de programul de calcul.

```ts [exercise.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { extremes, modelFromSolver, type PlotModel } from '@edubeam/plot'

export interface Exercise {
  readonly seed: number
  readonly statement: string
  /** Structura calculată, ca date simple: din ea se desenează și enunțul, și baremul */
  readonly model: PlotModel
  /** Reacțiunile din reazeme, pozitive în sus, N, și momentele încovoietoare extreme, N·m */
  readonly key: { RA: number; RB: number; mMax: number; mMin: number }
}

/** mulberry32: un generator mic cu seed; același seed dă mereu același exercițiu */
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

  // O deschidere cu o articulație și un reazem simplu, în jumătate din cazuri cu consolă: static determinată, deci mereu rezolvabilă
  const L = pick([4, 5, 6]) // m
  const c = pick([0, 0, 1, 1.5, 2]) // m, lungimea consolei
  const q = int(4, 12) // kN/m pe deschidere
  const F = int(2, 6) * 5 // kN la capătul consolei sau, fără consolă, la distanța `a` de A
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

  // Baremul, din modelul calculat: reacțiunile (z e orientat în jos, deci în sus înseamnă minus) și extremele exacte ale lui M
  const model = modelFromSolver(solver)
  const { reactions, members } = model.results!
  const up = (node: string) => -(reactions.find((x) => x.node === node && x.dof === 'dz')?.value ?? 0)
  const m = Object.values(members).flatMap((member) => extremes(member.M) ?? [])
  const mMax = Math.max(...m.map((e) => e.max.value))
  const mMin = Math.min(...m.map((e) => e.min.value))

  return { seed, statement, model, key: { RA: up('A'), RB: up('B'), mMax, mMin } }
}
```

`modelFromSolver` transformă structura calculată într-un [model de desen](/ro/plot/model): date simple, cu reacțiunile și rezultatele fiecărei bare ca polinoame exacte, așa că `extremes` găsește momentele maxime fără eșantionare. Exercițiul păstrează doar acest model; `solver`-ul nu mai este necesar.

Seedul 5 dă enunțul *„Span L = 6 m with an overhang c = 1.5 m. q = 5 kN/m on the span, F = 25 kN at the tip C.”* Baremul: $R_A = (5 \cdot 6 \cdot 3 - 25 \cdot 1{,}5)/6 = 8{,}75$ kN, $R_B = 5 \cdot 6 + 25 - 8{,}75 = 46{,}25$ kN, $M_B = -25 \cdot 1{,}5 = -37{,}5$ kNm deasupra reazemului și $M = 8{,}75^2/(2 \cdot 5) = 7{,}66$ kNm în deschidere, acolo unde forța tăietoare este zero. Programul de calcul dă exact aceleași valori, până la ultima cifră.

## Pe o pagină web {#the-exercise-in-a-page}

O componentă, `ExerciseCard.vue`, desenează enunțul sau, cu `answers`, baremul:

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

A doua fișă se încheie cu *R<sub>A</sub> = 8.75 kN, R<sub>B</sub> = 46.25 kN, M from −37.5 kNm to 7.66 kNm*. `formatQuantity` scrie unitatea și un semn minus adevărat, la fel ca desenul.

În enunț, `reaction-labels="names"` desenează reacțiunile ca necunoscute: câte o săgeată pentru fiecare direcție blocată de un reazem, orientată în sensul considerat pozitiv (spre dreapta, în sus, în sens antiorar), denumită *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>* în loc de valoare. Semnul fiecărui răspuns este astfel definit pe desen: o reacțiune care acționează în sens opus este negativă. Baremul scrie valorile.

`reserve` rezervă de la început locul straturilor din ambele variante, așa că atunci când activezi `answers`, de exemplu cu un buton *Arată rezolvarea* pentru studiu individual, diagrama apare treptat exact unde îi e locul ([Figuri construite pas cu pas](/ro/plot/structure-plot#figures-that-build-up)). `reserve-reaction-labels` face același lucru pentru reacțiuni, așa că grinda rămâne pe loc în timp ce denumirile lor devin valori: vezi [Reacțiunile ca necunoscute](/ro/plot/structure-plot#reactions-as-unknowns).

## Un test tipărit {#print-a-test}

Pentru un test scris, un script Node, `print-test.ts`, scrie câte o pagină pentru fiecare student și, după ele, baremele. `structureSvg` transformă fiecare model în text SVG, așa că scriptul nu are nevoie nici de Vue, nici de browser:

```ts [print-test.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const students = ['Ada', 'Ben', 'Cleo']
const exercises = students.map((_, i) => makeExercise(1000 + i)) // seedurile 1000, 1001, …

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

Deschide `test.html` într-un browser și tipărește-l sau salvează-l ca PDF: exercițiul fiecărui student și fiecare barem primesc câte o pagină separată. Pagina Adei și baremul ei:

![Exercițiul 1000: o deschidere de 6 m cu o consolă de 2 m, 10 kN/m pe deschidere și 30 kN la capătul consolei, reacțiunile necunoscute denumite A_x, A_z și B_z și cote în lanț de 6 m și 2 m, cu 8 m în total; dedesubt baremul, cu reacțiuni de 20 și 70 și momentul încovoietor de la −60 deasupra reazemului la 20 în deschidere](/screenshots/ro/p2p-plot-exercise-sheet.webp){.shot-lg}

Stratul `dimensions` cotează fiecare deschidere și lungimea totală, ca într-un enunț de exercițiu, iar `reactionLabels: 'names'` denumește necunoscutele, fiecare săgeată fiind orientată în sensul în care răspunsul ei se consideră pozitiv. În barem, reacțiunile și valorile de pe diagramă sunt numere simple, în kN și kNm, ca în aplicația EduBeam: scrie asta în titlul baremului dacă studenții tăi au nevoie să știe. Pentru un copiator alb-negru, transmite `colors` cu fiecare ton setat pe negru: vezi [Alb-negru](/ro/plot/theming#black-and-white).

## Figuri pentru LaTeX și Word {#figures-for-latex-and-word}

Dacă îți scrii testele în LaTeX sau Word, scrie în schimb figurile ca fișiere și păstrează-ți propriul șablon. `figures.ts` scrie enunțul și baremul pentru 30 de seeduri:

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

Rulează-l cu `node figures.ts`: rezultă 60 de fișiere pentru 30 de studenți, fiecare un SVG simplu, cu culori fixe, fără CSS și fără scripturi.

- **Word** (2019 și Microsoft 365) inserează un SVG ca atare: *Inserare › Imagini*.
- **LaTeX** include PDF, nu SVG. Convertește o singură dată, cu [CairoSVG](https://cairosvg.org) (`cairosvg exercise-1000.svg -o exercise-1000.pdf`) sau cu Inkscape, apoi `\includegraphics[width=\linewidth]{exercise-1000.pdf}`. Comanda `\includesvg` din pachetul `svg` face conversia în locul tău dacă Inkscape este instalat.

O figură are 640 de unități lățime și text de 13 unități, așa că la lățimea unei coloane de text A4, de circa 16 cm, etichetele ei au 9 pt. Setează `fontFamily` la un font folosit în documentul tău: toate opțiunile sunt în [Un fișier SVG de sine stătător](/ro/plot/functions#a-standalone-svg-file).

## Adaptează-l {#make-it-your-own}

- **Mai multe tipuri de structuri.** Adaugă cazuri: o consolă, o grindă continuă cu două deschideri, un cadru portal, o grindă cu zăbrele. Demonstrația de la începutul paginii alege dintre opt tipuri, de la grinda simplu rezemată la cadrul cu trei articulații, grinda cu zăbrele Warren și cadrul portal.
- **Exerciții static nedeterminate.** Programul de calcul le rezolvă la fel de bine; doar rezolvarea de mână devine mai lungă.
- **Numere rotunde.** Alege încărcările și lungimile din liste scurte, ca mai sus, ca baremul să iasă cât de rotund vrei. Parcurge câteva sute de seeduri și sari peste cele al căror barem are mai multe zecimale decât vrei.
- **Protecție împotriva mecanismelor.** Un generator care poate așeza greșit reazemele ar trebui să calculeze în interiorul unui `try` și să sară peste seedurile care aruncă o excepție: vezi [Când calculul eșuează](/ro/solver/solving#when-solving-fails).
- **Cere mai mult.** Desenează forța tăietoare (`'V'`), săgeata (`'w'`, cu valorile din [`getUnknowns`](/ro/solver/results#displacements)) sau forța axială dintr-o bară înclinată.
