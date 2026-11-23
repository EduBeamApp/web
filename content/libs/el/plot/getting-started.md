---
title: Πρώτα βήματα
description: "Εγκατάσταση του @edubeam/plot, σχεδίαση δοκού επιλυμένης από το @edubeam/fem με φορτία, αντιδράσεις και καμπτική ροπή σε Vue 3, επανασχεδίαση όταν αλλάζει και αποθήκευση ως SVG."
order: 1
group: Εισαγωγή
source: site
---

# Πρώτα βήματα

Η βιβλιοθήκη @edubeam/plot σχεδιάζει μια επίπεδη δοκό, ένα πλαίσιο ή ένα δικτύωμα μαζί με τα αποτελέσματά του ως SVG: μέλη, στηρίξεις, φορτία, αντιδράσεις, τα διαγράμματα N, V και M και τον παραμορφωμένο φορέα, ακριβώς όπως φαίνονται τα σχήματα σε αυτόν τον ιστότοπο. Της δίνετε ένα μοντέλο επιλυμένο από το [@edubeam/fem](/el/solver), τον επιλυτή πάνω στον οποίο βασίζεται το [EduBeam]{.edubeam}· εκείνη επιλέγει μόνη της τη διάταξη, την κλίμακα και τη θέση κάθε αριθμού.

Οι διδάσκοντες τη χρησιμοποιούν για [ασκήσεις και διαγωνίσματα](/el/plot/exercises) που παράγονται από έναν σπόρο (seed), για [διαφάνειες](/el/plot/slides) όπου το σχήμα χτίζεται κλικ προς κλικ, και για σχήματα στις σημειώσεις, σε ιστοσελίδα ή ως αρχεία για LaTeX και Word. Με αυτήν έχουν φτιαχτεί οι [Ασκήσεις Στατικής](/el/practice) και ο [δημιουργός διαγωνισμάτων](/el/exam) αυτού του ιστότοπου.

::div{.actions}
[Το πρώτο σας σχήμα](#draw-a-solved-model) [Δημιουργία ασκήσεων](/el/plot/exercises)
::

## Εγκατάσταση {#install}

```bash
npm install @edubeam/plot @edubeam/fem vue
```

Η Vue 3.5 ή νεότερη και ο επιλυτής είναι peer dependencies, οπότε η εφαρμογή σας κρατά ένα μόνο αντίγραφο από το καθένα. Το πακέτο είναι αποκλειστικά ESM, περιέχει τους δικούς του τύπους και δεν χρειάζεται φύλλο στυλ. Τρέχει σε Node 20.19 ή νεότερο· για να εκτελέσετε απευθείας ένα script γραμμένο σε TypeScript, με `node script.ts`, χρειάζεστε Node 22.18 ή νεότερο.

## Σχεδίαση επιλυμένου μοντέλου {#draw-a-solved-model}

Αρκούν δύο αρχεία. Το πρώτο, `beams.ts`, δημιουργεί και επιλύει μια δοκό με το @edubeam/fem. Είναι μια απλή συνάρτηση, οπότε το ίδιο μοντέλο μπορεί να τροφοδοτήσει μια σελίδα, μια διαφάνεια και ένα script:

```ts [beams.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Επιλυμένη αμφιέρειστη δοκός ανοίγματος `span` m υπό φορτίο `q` kN/m. Ο επιλυτής δουλεύει σε μονάδες SI. */
export const simpleBeam = (span: number, q: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 }) // χάλυβας, Pa
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 }) // IPE 200, χωρίς διατμητικές παραμορφώσεις
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // άρθρωση
  domain.createNode('B', [span, 0, 0], [DofID.Dz]) // κύλιση
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true) // N/m, +z προς τα κάτω
  solver.solve()
  return solver
}
```

Το δεύτερο, `BeamFigure.vue`, δίνει τον επιλυτή στο `StructurePlot` και ορίζει τι θα σχεδιαστεί:

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

Αυτό είναι όλο το σχήμα: η δοκός πάνω στις στηρίξεις της, το φορτίο 12 kN/m, οι δύο αντιδράσεις των 36 kN και η καμπτική ροπή, $qL^2/8 = 54$ kNm στο μέσο του ανοίγματος, σχεδιασμένη στην εφελκυόμενη πλευρά:

::model-figure{caption="Τι σχεδιάζει το BeamFigure.vue: άνοιγμα 6 m υπό 12 kN/m"}
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

Το σχήμα γεμίζει το πλάτος του περιέκτη του και ορίζει μόνο του το ύψος του. Κείμενα, σύμβολα και πάχη γραμμών κρατούν το μέγεθός τους σε pixel όποιο κι αν είναι το μέγεθος του φορέα, έτσι το σχήμα διαβάζεται και σε κινητό. Αν παραλείψετε το `layers`, το σχήμα διαλέγει μόνο του το αποτέλεσμα: M για δοκούς και πλαίσια, N για δικτύωμα. Όλα τα [επίπεδα](/el/plot/structure-plot#layers) περιγράφονται στη σελίδα του `StructurePlot`· η δημιουργία μοντέλων περιγράφεται στην [τεκμηρίωση του επιλυτή](/el/solver/getting-started).

## Όταν αλλάζει το μοντέλο {#when-the-model-changes}

Ένα σχήμα διαβάζει τον επιλυτή που του δόθηκε· δεν παρακολουθεί τις αλλαγές του. Όταν κάτι αλλάξει, επιλύστε ξανά και δώστε τον νέο επιλυτή. Αυτό ακριβώς κάνει ένα `computed`:

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

Μια τέτοια δοκός επιλύεται σε περίπου ένα χιλιοστό του δευτερολέπτου, οπότε το σχήμα ακολουθεί τον ολισθητή καθώς κινείται. Αν αντίθετα τροποποιήσετε έναν υπάρχοντα επιλυτή επί τόπου, αυξήστε την τιμή του prop `revision` και το σχήμα θα τον διαβάσει ξανά.

::callout{type="tip" title="Μην κάνετε τον επιλυτή βαθιά reactive"}
Ένα `computed`, ένα prop ή μια απλή `const` κρατά τον επιλυτή ως έχει. Για να τον κρατήσετε στην κατάσταση ενός component, χρησιμοποιήστε `shallowRef` ή τυλίξτε τον σε `markRaw`: ένα απλό `ref` θα έβαζε τη Vue να διατρέξει ολόκληρο τον επιλυτή για να τον κάνει reactive, χωρίς λόγο.
::

## Αποθήκευση ως αρχείο {#save-it-as-a-file}

Για ένα σχήμα σε LaTeX, Word ή Inkscape, η `structureSvg` γράφει το ίδιο σχέδιο ως αυτόνομο αρχείο SVG με απλά χρώματα. Δεν χρειάζεται ούτε Vue ούτε browser, μόνο Node. Αποθηκεύστε αυτό ως `beam-svg.ts` δίπλα στο `beams.ts`:

```ts [beam-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { simpleBeam } from './beams.ts'

const svg = structureSvg(modelFromSolver(simpleBeam(6, 12)), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
})
writeFileSync('beam.svg', svg)
```

Εκτελέστε το με `node beam-svg.ts` (Node 22.18 ή νεότερο· σε παλαιότερες εκδόσεις `npx tsx beam-svg.ts`). Οι επιλογές, καθώς και ο τρόπος εισαγωγής του αρχείου σε LaTeX και Word, περιγράφονται στην ενότητα [Αυτόνομο αρχείο SVG](/el/plot/functions#a-standalone-svg-file).

## Τα διαγράμματα κάτω από τη δοκό {#the-stacked-figure}

Το `DiagramStack` σχεδιάζει το σχήμα που υπάρχει σε κάθε βιβλίο Στατικής: μια ευθύγραμμη δοκό με τα φορτία της και από κάτω, σε κοινό άξονα x, τα V(x), M(x) και w(x). Με το `v-model:load-at` ο αναγνώστης μπορεί να μετακινεί ένα συγκεντρωμένο φορτίο κατά μήκος της δοκού και να βλέπει τα διαγράμματα να ακολουθούν:

```vue
<DiagramStack v-model:load-at="at" :solver="solveWithLoadAt(at)" />
```

Το πλήρες παράδειγμα βρίσκεται στη σελίδα [DiagramStack](/el/plot/diagram-stack).

## Σε όλη την εφαρμογή {#use-it-everywhere}

Για να καταχωρίσετε και τα δύο components καθολικά, αντί να τα κάνετε import όπου τα χρησιμοποιείτε:

```ts [main.ts]
import { createApp } from 'vue'
import { EduBeamPlot } from '@edubeam/plot'
import App from './App.vue'

createApp(App).use(EduBeamPlot).mount('#app') // <StructurePlot> και <DiagramStack> σε κάθε template
```

Τα ονομαστικά imports κρατούν το bundle μικρότερο: μια σελίδα που κάνει import μόνο το `StructurePlot` δεν παίρνει ούτε το `DiagramStack` ούτε το plugin. Και τα δύο components αποδίδονται επίσης στον διακομιστή, σε Nuxt ή VitePress: δείτε την [Ενσωμάτωση](/el/plot/embedding).

## Επόμενα βήματα {#next}

::card-grid{cols="2"}
:::card{title="Ασκήσεις και διαγωνίσματα" icon="lucide:dices" to="/el/plot/exercises"}
Διαφορετική άσκηση για κάθε φοιτητή από έναν σπόρο, με τις λύσεις της, σε έντυπη μορφή ή ως αρχεία για LaTeX.
:::
:::card{title="Διαφάνειες και σημειώσεις" icon="lucide:presentation" to="/el/plot/slides"}
Σχήματα που χτίζονται κλικ προς κλικ σε Slidev, Vue ή Beamer, και τα ίδια σχήματα για τις σημειώσεις.
:::
:::card{title="StructurePlot" icon="lucide:frame" to="/el/plot/structure-plot"}
Επίπεδα, διαστάσεις, μικρογραφίες, μεγέθη, μονάδες και ανάγνωση τιμών με τον δείκτη.
:::
:::card{title="DiagramStack" icon="lucide:rows-3" to="/el/plot/diagram-stack"}
Μια δοκός πάνω από τα διαγράμματα V, M και w, με φορτίο που ο αναγνώστης μπορεί να μετακινεί.
:::
::
