---
title: Διαφάνειες και σημειώσεις
description: "Σχήματα για διαλέξεις με το @edubeam/plot που χτίζονται κλικ προς κλικ σε Slidev, Vue ή Beamer, επιλύονται ζωντανά και μπαίνουν ως SVG σε σημειώσεις, PowerPoint και Word."
order: 6
source: site
---

# Διαφάνειες και σημειώσεις διαλέξεων

Δείξτε έναν φορέα με τη σειρά που τον εξηγείτε: πρώτα τη γεωμετρία, μετά τις στηρίξεις και τα φορτία, έπειτα τις αντιδράσεις και στο τέλος την καμπτική ροπή. Ένα σχήμα που σχεδιάζεται από επιλυμένο μοντέλο χτίζεται επί τόπου, ένα επίπεδο ανά κλικ, και είναι πάντα σωστό. Το ίδιο μοντέλο δίνει έπειτα και τα σχήματα για τις σημειώσεις σας.

![Μια διαφάνεια Slidev μετά από 0, 2 και 4 κλικ: οι κόμβοι ενός αμφιαρθρωτού πλαισίου με τις διαστάσεις του, μετά το πλαίσιο πάνω στις στηρίξεις του με τα φορτία, και τέλος οι αντιδράσεις και η καμπτική ροπή](/screenshots/el/p2p-plot-slidev-steps.webp){.shot-md}

## Μια ολόκληρη διάλεξη {#a-whole-lecture}

Μια [ενδεικτική διάλεξη για τα επίπεδα δικτυώματα](https://edubeam-slides.pages.dev) τα συγκεντρώνει όλα σε μία παρουσίαση: 23 διαφάνειες όπως θα τις έδινε ένα μάθημα, με λυμένο παράδειγμα κόμβο προς κόμβο, όπου κάθε κόμβος σχεδιάζεται απομονωμένος δίπλα στις εξισώσεις του, σχήματα που χτίζονται κλικ προς κλικ, και μια άσκηση της οποίας η απάντηση εμφανίζεται με ένα κλικ. Ανοίξτε τη στον browser ή ξεκινήστε τη δική σας παρουσίαση από [τον πηγαίο κώδικά της](https://github.com/EduBeamApp/slides): το λογότυπο, τα ονόματα και τα χρώματα του φανταστικού πανεπιστημίου της βρίσκονται σε τρία αρχεία.

![Τέσσερις διαφάνειες της ενδεικτικής διάλεξης: η διαφάνεια τίτλου «Plane trusses» με ένα δικτύωμα Warren και τις δυνάμεις των ράβδων του, ο κόμβος A απομονωμένος δίπλα στις δύο εξισώσεις του, όλες οι δυνάμεις ράβδων του δικτυώματος μαζί με τον πίνακά τους, και δικτυώματα γεφυρών τύπου Pratt, Howe και Warren το ένα δίπλα στο άλλο](/screenshots/plot-example-lecture.webp){.shot-lg}

## Σχήμα που χτίζεται σταδιακά {#a-figure-that-builds-up}

Αρκούν δύο αρχεία. Το `frame.ts` δημιουργεί και επιλύει τον φορέα:

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Αμφιαρθρωτό πλαίσιο 6 m επί 4 m, αρθρωτές στηρίξεις στις βάσεις, 10 kN/m στο ζύγωμα και 15 kN που ωθεί στο B. */
export const portalFrame = (): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 }) // IPE 300
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [0, 0, -4]) // ο z δείχνει προς τα κάτω: 4 m προς τα πάνω
  domain.createNode('C', [6, 0, -4])
  domain.createNode('D', [6, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  domain.createBeam2D(2, ['B', 'C'], 1, 1)
  domain.createBeam2D(3, ['C', 'D'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(2, [0, 10e3], true)
  solver.loadCases[0].createNodalLoad('B', { [DofID.Dx]: 15e3 })
  solver.solve()
  return solver
}
```

Το `BuildUp.vue` τον σχεδιάζει σε στάδια. Κάθε στάδιο απαριθμεί τα επίπεδα που δείχνει, και το `reserve` τα διατάσσει όλα από το πρώτο κλικ, οπότε κάθε επίπεδο εμφανίζεται σταδιακά στη θέση του και τίποτα δεν μετακινείται:

```vue [BuildUp.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { StructurePlot, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame'

const props = defineProps<{ step: number }>()

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'], // η γεωμετρία
  ['nodeLabels', 'members', 'supports'], // ο φορέας
  ['nodeLabels', 'members', 'supports', 'loads'], // τα φορτία του
  ['members', 'supports', 'loads', 'reactions'], // οι αντιδράσεις
  ['members', 'supports', 'reactions', 'M'], // και η καμπτική ροπή
]
const all = [...new Set(stages.flat())] // διατάσσονται από το πρώτο στάδιο, οπότε αργότερα τίποτα δεν μετακινείται
const layers = computed(() => stages[Math.min(props.step, stages.length - 1)])

const frame = portalFrame()
</script>

<template>
  <StructurePlot :solver="frame" :layers="layers" :reserve="all" :height="360" />
</template>
```

Ένα επίπεδο μπορεί και να φύγει: το τελευταίο στάδιο παραλείπει τα φορτία για να δώσει χώρο στη ροπή. Το `:height="360"` κρατά το σχήμα μέσα στη διαφάνεια. Τα μέλη σχεδιάζονται από το ένα άκρο στο άλλο όταν εμφανίζονται για πρώτη φορά, και τα επίπεδα εμφανίζονται σταδιακά μέσα σε μισό δευτερόλεπτο· με `prefers-reduced-motion` και τα δύο είναι ανενεργά, ενώ το `:animate="false"` τα απενεργοποιεί για όλους. Για να τα επιβραδύνετε σε ένα αμφιθέατρο, δείτε την ενότητα [Δικό σας στυλ για τα κινούμενα εφέ](/el/plot/theming#restyling-the-animation).

## Στο Slidev {#in-slidev}

Το [Slidev](https://sli.dev) φτιάχνει διαφάνειες από Markdown με τη Vue, οπότε το component λειτουργεί εκεί ως έχει. Εγκαταστήστε τις βιβλιοθήκες στο έργο της παρουσίασης:

```bash
npm install @edubeam/plot @edubeam/fem
```

Βάλτε τα `frame.ts` και `BuildUp.vue` στον φάκελο `components/` της παρουσίασης και αφήστε τα κλικ της διαφάνειας να ορίζουν το στάδιο στο `slides.md`:

```md [slides.md]
---
clicks: 4
---

# From geometry to bending moment

<BuildUp :step="$clicks" />
```

Το `clicks: 4` δίνει στη διαφάνεια τέσσερα κλικ, και το `$clicks` τα μετρά από το 0. Κάθε πάτημα του πλήκτρου βέλους δείχνει το επόμενο στάδιο· αν πάτε πίσω, κρύβεται ξανά. Το `slidev export` φτιάχνει ένα PDF της παρουσίασης, με `--with-clicks` μία σελίδα ανά κλικ.

## Σε οποιεσδήποτε διαφάνειες με Vue {#in-any-vue-slides}

Οπουδήποτε αλλού, διαχειριστείτε μόνοι σας το στάδιο:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import BuildUp from './BuildUp.vue'

const step = ref(0)
</script>

<template>
  <BuildUp :step="step" />
  <button type="button" @click="step = Math.max(0, step - 1)">Back</button>
  <button type="button" @click="step++">Next</button>
</template>
```

## Ζωντανή επίλυση {#solve-it-live}

Ο επιλυτής χρειάζεται λίγα χιλιοστά του δευτερολέπτου για ένα τέτοιο πλαίσιο, οπότε μέσα στη διάλεξη μπορείτε να αλλάξετε τον φορέα και να τον επιλύσετε επί τόπου. Συνδέστε ένα φορτίο με ένα ρυθμιστικό και δίνετε κάθε φορά ένα νέο επιλυμένο μοντέλο, όπως στην ενότητα [Όταν αλλάζει το μοντέλο](/el/plot/getting-started#when-the-model-changes).

- **Κινητό φορτίο.** Το [DiagramStack](/el/plot/diagram-stack#a-load-the-reader-can-drag) αφήνει τους φοιτητές να μετακινούν ένα συγκεντρωμένο φορτίο κατά μήκος μιας δοκού και να βλέπουν την τέμνουσα δύναμη και την καμπτική ροπή να το ακολουθούν.
- **Περιπτώσεις δίπλα δίπλα.** Ορίστε σταθερό [`diagramScale`](/el/plot/structure-plot#several-plots-at-one-scale) και δύο σχήματα σχεδιάζουν τις ροπές τους στην ίδια κλίμακα, ώστε η μεγαλύτερη να φαίνεται μεγαλύτερη.
- **Ανάγνωση τιμών.** Με `hover`, όταν τοποθετείτε τον δείκτη σε ένα μέλος, σημειώνεται η τιμή στην άκρη της τεταγμένης κάθε διαγράμματος: δείτε την [Ανάγνωση τιμών](/el/plot/structure-plot#reading-values).

## Σχήματα για Beamer, PowerPoint και Word {#figures-for-beamer-powerpoint-and-word}

Μια παρουσίαση σε LaTeX Beamer ή PowerPoint, ή σημειώσεις γραμμένες σε Word, δέχονται το σχήμα ως αρχείο. Η `structureSvg` γράφει το σχήμα ως αυτόνομο αρχείο SVG με απλά χρώματα, διατεταγμένο όπως το διατάσσει το `StructurePlot`. Αρκεί ένα script Node, το `frame-svg.ts`, δίπλα στο `frame.ts`:

```ts [frame-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![Το αμφιαρθρωτό πλαίσιο ως αυτόνομο αρχείο SVG, αποδοσμένο με το CairoSVG: τα φορτία, οι αντιδράσεις 20 και 40 προς τα πάνω και 2,3 και 12,7 οριζόντια, και η καμπτική ροπή από −50,7 στο C έως 29,3 στο ζύγωμα](/screenshots/el/p2p-plot-frame-svg.webp){.shot-lg}

Το PowerPoint και το Word (2019 και Microsoft 365) εισάγουν το SVG ως έχει. Το LaTeX το δέχεται ως PDF: μετατρέψτε το με `cairosvg frame.svg -o frame.pdf` ή με το Inkscape, ή αφήστε το `\includesvg` του πακέτου `svg` να το κάνει. Λεπτομέρειες υπάρχουν στην ενότητα [Σχήματα για LaTeX και Word](/el/plot/exercises#figures-for-latex-and-word) και όλες οι επιλογές στην ενότητα [Αυτόνομο αρχείο SVG](/el/plot/functions#a-standalone-svg-file).

### Σταδιακό σχήμα στο Beamer {#a-build-up-in-beamer}

Ένα αρχείο προσαρμόζεται στα επίπεδα που σχεδιάζει, οπότε αρχεία γραμμένα χωριστά για κάθε στάδιο δεν θα ευθυγραμμίζονταν. Δώστε στη `structureSvg` το ίδιο `reserve` με το `BuildUp.vue`, δηλαδή κάθε επίπεδο κάθε σταδίου, και όλα τα αρχεία θα έχουν το ίδιο μέγεθος με τον φορέα στην ίδια θέση. Το `frame-stages.ts` γράφει ένα αρχείο ανά στάδιο:

```ts [frame-stages.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'],
  ['nodeLabels', 'members', 'supports'],
  ['nodeLabels', 'members', 'supports', 'loads'],
  ['members', 'supports', 'loads', 'reactions'],
  ['members', 'supports', 'reactions', 'M'],
]
const all = [...new Set(stages.flat())]
const frame = modelFromSolver(portalFrame())

stages.forEach((layers, i) => {
  writeFileSync(`frame-${i + 1}.svg`, structureSvg(frame, { layers, reserve: all }))
})
```

Μετατρέψτε τα αρχεία σε PDF:

```bash
for i in 1 2 3 4 5; do cairosvg frame-$i.svg -o frame-$i.pdf; done
```

και δώστε στο καθένα το δικό του overlay. Κάθε αρχείο περιέχει ολόκληρο στάδιο, οπότε το frame του Beamer τα δείχνει ένα κάθε φορά, και επειδή ευθυγραμμίζονται, κάθε κλικ μοιάζει να προσθέτει ένα επίπεδο:

```latex [lecture.tex]
\begin{frame}{From geometry to bending moment}
  \centering
  \includegraphics<1>[width=0.8\linewidth]{frame-1.pdf}%
  \includegraphics<2>[width=0.8\linewidth]{frame-2.pdf}%
  \includegraphics<3>[width=0.8\linewidth]{frame-3.pdf}%
  \includegraphics<4>[width=0.8\linewidth]{frame-4.pdf}%
  \includegraphics<5>[width=0.8\linewidth]{frame-5.pdf}
\end{frame}
```

Στο PowerPoint, βάλτε τα πέντε αρχεία σε πέντε διαδοχικές διαφάνειες χωρίς μετάβαση ανάμεσά τους: κάθε βήμα φαίνεται στη διάλεξη ακριβώς σαν ένα κλικ.

## Σημειώσεις και φυλλάδια {#notes-and-handouts}

- **Σημειώσεις μαθήματος στο web.** Το VitePress και το Nuxt αποδίδουν τα σχήματα κατά το build, οπότε τα σχήματα βρίσκονται στο HTML πριν εκτελεστεί οποιοδήποτε script: δείτε την [Ενσωμάτωση](/el/plot/embedding).
- **Έντυπες σημειώσεις.** Γράψτε τα σχήματα με τη `structureSvg` σε μια σελίδα HTML και εκτυπώστε τη, όπως κάνει η [γεννήτρια διαγωνισμάτων](/el/plot/exercises#print-a-test), ή εισαγάγετε τα αρχεία σε LaTeX ή Word.
- **Ένα μοντέλο, όλα τα σχήματα.** Το ίδιο `frame.ts` τροφοδοτεί τις διαφάνειες, τις σημειώσεις και την εκφώνηση της άσκησης, οπότε δεν διαφωνούν ποτέ μεταξύ τους.
