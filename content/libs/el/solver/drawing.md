---
title: Σχεδίαση αποτελεσμάτων
description: "Μετατρέψτε ένα επιλυμένο μοντέλο @edubeam/fem σε διαγράμματα με το @edubeam/plot: σε ένα component της Vue, ως αυτόνομο αρχείο SVG από σενάριο Node ή ως JSON για μεταγενέστερη σχεδίαση."
order: 11
source: site
---

# Σχεδίαση αποτελεσμάτων {#drawing-the-results}

Το [@edubeam/plot](/el/plot) σχεδιάζει ένα επιλυμένο μοντέλο στο ύφος των σχημάτων αυτού του ιστότοπου: μέλη, στηρίξεις, φορτία, αντιδράσεις, τα διαγράμματα N, V και M και τον παραμορφωμένο φορέα, ως SVG. Δώστε του τον επιλυτή· διαβάζει μόνο του ό,τι χρειάζεται.

```bash
npm install @edubeam/plot @edubeam/fem vue
```

## Σε component της Vue {#in-a-vue-component}

```vue [BeamFigure.vue]
<script setup lang="ts">
import { markRaw } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot } from '@edubeam/plot'

// Αμφιέρειστη δοκός 6 m υπό 12 kN/m, σε μονάδες SI: m, N, Pa
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // άρθρωση
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // κύλιση
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

// Μόνο διαβάζεται, δεν παρακολουθείται: η markRaw εμποδίζει τη Vue να κάνει τον επιλυτή reactive
const beam = markRaw(solver)
</script>

<template>
  <StructurePlot
    :solver="beam"
    :layers="['members', 'supports', 'loads', 'reactions', 'M']"
  />
</template>
```

Σχεδιάζει τις αντιδράσεις των 36 kN και τη ροπή των 54 kNm, όπως σε αυτό το διαδραστικό σχήμα:

::model-figure{caption="Τι σχεδιάζει το BeamFigure.vue"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
---
::

Το `StructurePlot` σχεδιάζει την περίπτωση φόρτισης 0· το prop `loadCase` επιλέγει άλλη από τις `solver.loadCases`. Δεν παρακολουθεί τον επιλυτή: αφού αλλάξετε το μοντέλο και το επιλύσετε ξανά, αλλάξτε το prop `revision` για να ανανεωθεί το σχήμα. Η σελίδα [StructurePlot](/el/plot/structure-plot) περιγράφει όλες τις επιλογές.

## Χωρίς πρόγραμμα περιήγησης {#without-a-browser}

Η `structureSvg`, νέα στο @edubeam/plot 0.2, γράφει το ίδιο σχέδιο ως αυτόνομο αρχείο SVG, με απλά χρώματα που καταλαβαίνουν το Word, το Inkscape και τα εργαλεία του LaTeX. Χωρίς πρόγραμμα περιήγησης, χωρίς component της Vue, μόνο ένα σενάριο Node:

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { modelFromSolver, structureSvg } from '@edubeam/plot'

// Η ίδια δοκός όπως στο BeamFigure.vue
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

const svg = structureSvg(modelFromSolver(solver), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
  width: 640,
})
writeFileSync('beam.svg', svg)
```

Το αρχείο δείχνει ό,τι και το παραπάνω διαδραστικό σχήμα, σε χρώματα εκτύπωσης. Το `width` ορίζει το μέγεθός του σε pixel, αφού δεν υπάρχει πλαίσιο για να μετρηθεί. Για μια ολόκληρη εκτυπώσιμη σελίδα σχημάτων, βάλτε πολλά τέτοια αρχεία σε μία σελίδα HTML, όπως κάνει ο [δημιουργός διαγωνισμάτων](/el/plot/exercises#print-a-test) του @edubeam/plot, χωρίς Vue και χωρίς πρόγραμμα περιήγησης. Οι επιλογές της `structureSvg` περιγράφονται στη σελίδα [Συναρτήσεις](/el/plot/functions#a-standalone-svg-file).

## Διανείμετε το σχέδιο, όχι τον επιλυτή {#ship-the-drawing-not-the-solver}

Η `modelFromSolver` μετατρέπει ένα επιλυμένο μοντέλο σε απλά δεδομένα που σειριοποιούνται σε JSON: γεωμετρία, φορτία, αντιδράσεις και τα αποτελέσματα κάθε μέλους ως ακριβή πολυώνυμα. Επιλύστε κατά το build, διανείμετε το JSON και σχεδιάστε το με το prop `model` αντί για το `solver`:

```ts
import { modelFromSolver } from '@edubeam/plot'

// ... η επιλυμένη δοκός του to-svg.ts
writeFileSync('beam.json', JSON.stringify(modelFromSolver(solver)))
```

Μια σελίδα που δείχνει το σχήμα δεν επιλύει τότε τίποτε: η δουλειά γίνεται μία φορά, κατά το build. Η σελίδα [Ενσωμάτωση](/el/plot/embedding#ship-the-drawing-not-the-solver) δείχνει την πλευρά του component και η σελίδα [Μοντέλο σχήματος](/el/plot/model) τη μορφή των δεδομένων.

Όλα τα υπόλοιπα, από τα χρώματα έως την ανάγνωση τιμών με το δείκτη του ποντικιού και τα φορτία που σύρονται, βρίσκονται στην [τεκμηρίωση του @edubeam/plot](/el/plot/getting-started).
