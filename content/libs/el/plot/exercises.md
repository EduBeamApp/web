---
title: Ασκήσεις και διαγωνίσματα
description: "Διαφορετική άσκηση Στατικής για κάθε φοιτητή από έναν σπόρο (seed), με λύσεις που είναι πάντα σωστές: σε ιστοσελίδα, σε έντυπο διαγώνισμα ή ως σχήματα SVG."
order: 5
group: Εφαρμογές
source: site
---

# Ασκήσεις και διαγωνίσματα

Γράψτε έναν φορέα μία φορά, ως συνάρτηση ενός σπόρου (seed) γεννήτριας τυχαίων αριθμών, και έχετε μια άσκηση για κάθε φοιτητή, κάθε εβδομάδα, την καθεμία με λύσεις που είναι πάντα σωστές: το @edubeam/fem την επιλύει και το @edubeam/plot σχεδιάζει την εκφώνηση και τις λύσεις από το ίδιο μοντέλο.

Πατήστε παρακάτω **Νέα άσκηση**. Κάθε πάτημα δίνει νέο σπόρο: η άσκηση δημιουργείται, επιλύεται και σχεδιάζεται στον browser σας.

::exercise-generator
::

Η επίδειξη σχεδιάζει τις ασκήσεις δύο σελίδων αυτού του ιστότοπου, που είναι και οι δύο φτιαγμένες από τα κομμάτια που περιγράφονται εδώ: τις [Ασκήσεις Στατικής](/el/practice), όπου ο φοιτητής εισάγει τις αντιδράσεις και τη μέγιστη ροπή ή δύναμη ράβδου και ελέγχονται αμέσως, και τον [δημιουργό διαγωνισμάτων](/el/exam), που τυπώνει διαφορετική εκδοχή ενός διαγωνίσματος για κάθε φοιτητή μαζί με τις λύσεις και αποθηκεύει τα σχήματα ως αρχεία SVG και τις απαντήσεις ως CSV. Δοκιμάστε τα πριν γράψετε τη δική σας γεννήτρια.

## Πώς λειτουργεί {#how-it-works}

1. **Ο σπόρος επιλέγει τους αριθμούς.** Μια γεννήτρια τυχαίων αριθμών με σπόρο δίνει για τον ίδιο σπόρο πάντα την ίδια άσκηση, οπότε από τον σπόρο που είναι τυπωμένος στο φύλλο βρίσκετε ξανά τις λύσεις του.
2. **Ο επιλυτής βγάζει τις λύσεις.** Το @edubeam/fem επιλύει κάθε φορέα, οπότε οι αντιδράσεις και οι ροπές προέρχονται από τον επιλυτή και όχι από έναν τύπο στον οποίο εύκολα γίνεται λάθος.
3. **Το @edubeam/plot σχεδιάζει και τα δύο.** Η εκφώνηση δείχνει τον φορέα με τις ετικέτες των κόμβων, τις διαστάσεις του και τις άγνωστες αντιδράσεις με το όνομά τους· οι λύσεις δίνουν τις τιμές των αντιδράσεων και προσθέτουν το διάγραμμα.

Από εδώ ως ένα τυπωμένο διαγώνισμα χρειάζονται λίγα σύντομα αρχεία: [η γεννήτρια](#the-generator), [ένα component](#the-exercise-in-a-page) για ιστοσελίδα, και [ένα script](#print-a-test) που τυπώνει ένα διαγώνισμα ή [γράφει σχήματα](#figures-for-latex-and-word) για LaTeX και Word. Αντιγράψτε τα σε ένα έργο όπου έχετε [εγκαταστήσει τις βιβλιοθήκες](/el/plot/getting-started#install)· τα scripts εκτελούνται με `node` από την έκδοση 22.18, ή με `npx tsx` σε παλαιότερες εκδόσεις.

## Η γεννήτρια {#the-generator}

Ένα module, το `exercise.ts`, μετατρέπει έναν σπόρο σε άσκηση: μια δοκό σε άρθρωση και κύλιση, στις μισές περιπτώσεις με πρόβολο που φέρει συγκεντρωμένο φορτίο στο άκρο του. Και οι δύο είναι ισοστατικοί φορείς, οπότε κάθε άσκηση λύνεται με το χέρι εξίσου καλά όσο και με τον επιλυτή.

```ts [exercise.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { extremes, modelFromSolver, type PlotModel } from '@edubeam/plot'

export interface Exercise {
  readonly seed: number
  readonly statement: string
  /** Ο επιλυμένος φορέας ως απλά δεδομένα: από αυτόν σχεδιάζονται η εκφώνηση και οι λύσεις */
  readonly model: PlotModel
  /** Αντιδράσεις στηρίξεων, θετικές προς τα πάνω, N, και οι ακραίες καμπτικές ροπές, N·m */
  readonly key: { RA: number; RB: number; mMax: number; mMin: number }
}

/** mulberry32: μια μικρή γεννήτρια με σπόρο, ώστε ένας σπόρος να αντιστοιχεί για πάντα στην ίδια άσκηση */
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

  // Άνοιγμα σε άρθρωση και κύλιση, στις μισές περιπτώσεις με πρόβολο: ισοστατικό, άρα πάντα επιλύσιμο
  const L = pick([4, 5, 6]) // m
  const c = pick([0, 0, 1, 1.5, 2]) // m, μήκος προβόλου
  const q = int(4, 12) // kN/m στο άνοιγμα
  const F = int(2, 6) * 5 // kN στο άκρο, ή σε απόσταση `a` από το A όταν δεν υπάρχει πρόβολος
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

  // Οι λύσεις από το επιλυμένο μοντέλο: αντιδράσεις (ο z δείχνει προς τα κάτω, άρα προς τα πάνω είναι μείον) και ακριβή ακρότατα του M
  const model = modelFromSolver(solver)
  const { reactions, members } = model.results!
  const up = (node: string) => -(reactions.find((x) => x.node === node && x.dof === 'dz')?.value ?? 0)
  const m = Object.values(members).flatMap((member) => extremes(member.M) ?? [])
  const mMax = Math.max(...m.map((e) => e.max.value))
  const mMin = Math.min(...m.map((e) => e.min.value))

  return { seed, statement, model, key: { RA: up('A'), RB: up('B'), mMax, mMin } }
}
```

Η `modelFromSolver` μετατρέπει τον επιλυμένο φορέα σε [μοντέλο σχήματος](/el/plot/model): απλά δεδομένα με τις αντιδράσεις και τα αποτελέσματα κάθε μέλους ως ακριβή πολυώνυμα, οπότε η `extremes` βρίσκει τις μέγιστες ροπές χωρίς δειγματοληψία. Η άσκηση κρατά μόνο αυτό το μοντέλο· ο επιλυτής δεν χρειάζεται πια.

Ο σπόρος 5 δίνει *«Span L = 6 m with an overhang c = 1.5 m. q = 5 kN/m on the span, F = 25 kN at the tip C.»* Οι λύσεις του: $R_A = (5 \cdot 6 \cdot 3 - 25 \cdot 1{,}5)/6 = 8{,}75$ kN, $R_B = 5 \cdot 6 + 25 - 8{,}75 = 46{,}25$ kN, πάνω από τη στήριξη $M_B = -25 \cdot 1{,}5 = -37{,}5$ kNm, και στο άνοιγμα, εκεί όπου η τέμνουσα μηδενίζεται, $M = 8{,}75^2/(2 \cdot 5) = 7{,}66$ kNm. Ο επιλυτής συμφωνεί ως το τελευταίο ψηφίο.

## Σε ιστοσελίδα {#the-exercise-in-a-page}

Ένα component, το `ExerciseCard.vue`, σχεδιάζει την εκφώνηση, ή με `answers` τις λύσεις:

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

Η δεύτερη κάρτα τελειώνει με *R<sub>A</sub> = 8.75 kN, R<sub>B</sub> = 46.25 kN, M from −37.5 kNm to 7.66 kNm*. Η `formatQuantity` γράφει τη μονάδα και ένα πραγματικό σύμβολο μείον, όπως και το σχήμα.

Στην εκφώνηση, το `reaction-labels="names"` σχεδιάζει τις αντιδράσεις ως αγνώστους: ένα βέλος για κάθε διεύθυνση που δεσμεύει μια στήριξη, με τη θετική φορά (προς τα δεξιά, προς τα πάνω, αριστερόστροφα), με όνομα *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>* αντί για τιμή. Έτσι το πρόσημο κάθε απάντησης ορίζεται πάνω στο σχέδιο: μια αντίδραση που δρα αντίθετα είναι αρνητική. Οι λύσεις γράφουν τις τιμές.

Το `reserve` διατάσσει από την αρχή τα επίπεδα και των δύο όψεων, οπότε όταν ενεργοποιηθεί το `answers`, για παράδειγμα με ένα κουμπί *Εμφάνιση λύσης* για αυτομελέτη, το διάγραμμα εμφανίζεται σταδιακά στη θέση του ([Σχήματα που χτίζονται σταδιακά](/el/plot/structure-plot#figures-that-build-up)). Το `reserve-reaction-labels` κάνει το ίδιο για τις αντιδράσεις, οπότε η δοκός μένει στη θέση της ενώ τα ονόματά τους γίνονται τιμές: δείτε την ενότητα [Αντιδράσεις ως άγνωστοι](/el/plot/structure-plot#reactions-as-unknowns).

## Έντυπο διαγώνισμα {#print-a-test}

Για γραπτό διαγώνισμα, ένα script Node, το `print-test.ts`, γράφει μία σελίδα ανά φοιτητή και μετά τις λύσεις. Η `structureSvg` μετατρέπει κάθε μοντέλο σε κείμενο SVG, οπότε το script δεν χρειάζεται ούτε Vue ούτε browser:

```ts [print-test.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const students = ['Ada', 'Ben', 'Cleo']
const exercises = students.map((_, i) => makeExercise(1000 + i)) // σπόροι 1000, 1001, …

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

Ανοίξτε το `test.html` σε έναν browser και εκτυπώστε το ή αποθηκεύστε το ως PDF: η άσκηση κάθε φοιτητή και κάθε σύνολο λύσεων τυπώνονται σε δική τους σελίδα. Η σελίδα της Ada και οι λύσεις της:

![Άσκηση 1000: άνοιγμα 6 m με πρόβολο 2 m, 10 kN/m στο άνοιγμα και 30 kN στο άκρο του προβόλου, οι άγνωστες αντιδράσεις με τα ονόματα A_x, A_z και B_z, και αλυσιδωτές διαστάσεις 6 m και 2 m με συνολική 8 m· από κάτω οι λύσεις, με αντιδράσεις 20 και 70 και καμπτική ροπή από −60 πάνω από τη στήριξη έως 20 στο άνοιγμα](/screenshots/el/p2p-plot-exercise-sheet.webp){.shot-lg}

Το επίπεδο `dimensions` δίνει κάθε τμήμα και το συνολικό μήκος, όπως μια εκφώνηση άσκησης, και το `reactionLabels: 'names'` ονομάζει τους αγνώστους, με κάθε βέλος στη φορά κατά την οποία η απάντησή του μετρά ως θετική. Στις λύσεις, οι αντιδράσεις και οι τιμές των διαγραμμάτων είναι σκέτοι αριθμοί σε kN και kNm, όπως στην εφαρμογή EduBeam: αν χρειάζεται να το ξέρουν οι φοιτητές σας, γράψτε το στην επικεφαλίδα των λύσεων. Για ασπρόμαυρο φωτοαντιγραφικό, δώστε `colors` με κάθε τόνο ορισμένο σε μαύρο: δείτε την ενότητα [Ασπρόμαυρα](/el/plot/theming#black-and-white).

## Σχήματα για LaTeX και Word {#figures-for-latex-and-word}

Αν γράφετε τα διαγωνίσματά σας σε LaTeX ή Word, αποθηκεύστε αντί γι' αυτό μόνο τα σχήματα ως αρχεία και κρατήστε το δικό σας πρότυπο. Το `figures.ts` γράφει την εκφώνηση και τις λύσεις για 30 σπόρους:

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

Εκτελέστε το με `node figures.ts`: αυτό δίνει 60 αρχεία για 30 φοιτητές, το καθένα ένα απλό SVG με σταθερά χρώματα, χωρίς CSS και χωρίς scripts.

- Το **Word** (2019 και Microsoft 365) εισάγει ένα SVG ως έχει: *Εισαγωγή › Εικόνες*.
- Το **LaTeX** δέχεται PDF και όχι SVG. Μετατρέψτε το αρχείο μία φορά, με το [CairoSVG](https://cairosvg.org) (`cairosvg exercise-1000.svg -o exercise-1000.pdf`) ή το Inkscape, και έπειτα `\includegraphics[width=\linewidth]{exercise-1000.pdf}`. Το `\includesvg` του πακέτου `svg` κάνει τη μετατροπή για εσάς, αν έχετε εγκατεστημένο το Inkscape.

Ένα σχήμα έχει πλάτος 640 μονάδων και κείμενο 13 μονάδων, οπότε στο πλάτος μιας στήλης κειμένου σε χαρτί A4, περίπου 16 cm, οι ετικέτες του έχουν μέγεθος 9 pt. Ορίστε το `fontFamily` στη γραμματοσειρά του εγγράφου σας: όλες οι επιλογές περιγράφονται στην ενότητα [Αυτόνομο αρχείο SVG](/el/plot/functions#a-standalone-svg-file).

## Προσαρμόστε τη στις ανάγκες σας {#make-it-your-own}

- **Περισσότερα είδη φορέων.** Προσθέστε περιπτώσεις: πρόβολο, συνεχή δοκό δύο ανοιγμάτων, αμφιαρθρωτό πλαίσιο, δικτύωμα. Η ζωντανή επίδειξη στην αρχή της σελίδας διαλέγει ανάμεσα σε οκτώ είδη, από αμφιέρειστη δοκό ως τριαρθρωτό πλαίσιο, δικτύωμα Warren και αμφιαρθρωτό πλαίσιο.
- **Υπερστατικές ασκήσεις.** Ο επιλυτής τις χειρίζεται εξίσου καλά· μόνο η λύση με το χέρι γίνεται μεγαλύτερη.
- **Στρογγυλοί αριθμοί.** Επιλέξτε φορτία και μήκη από σύντομες λίστες, όπως παραπάνω, ώστε οι λύσεις να βγαίνουν όσο στρογγυλές θέλετε. Διατρέξτε σε βρόχο μερικές εκατοντάδες σπόρους και παραλείψτε όσους δίνουν λύσεις με περισσότερα δεκαδικά από όσα θέλετε.
- **Προστασία από μηχανισμούς.** Μια γεννήτρια που μπορεί να τοποθετήσει λάθος τις στηρίξεις πρέπει να επιλύει μέσα σε ένα `try` και να παραλείπει τους σπόρους που προκαλούν σφάλμα: δείτε την ενότητα [Όταν η επίλυση αποτυγχάνει](/el/solver/solving#when-solving-fails).
- **Ζητήστε περισσότερα.** Σχεδιάστε την τέμνουσα δύναμη (`'V'`), το βέλος κάμψης (`'w'`, με τις τιμές από τη [`getUnknowns`](/el/solver/results#displacements)) ή την αξονική δύναμη σε ένα κεκλιμένο μέλος.
