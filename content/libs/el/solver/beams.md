---
title: Δοκοί
description: "Πλήρη προγράμματα @edubeam/fem για πρόβολο και συνεχή δοκό δύο ανοιγμάτων, με την έξοδό τους, το καθένα ελεγμένο με τον τύπο του βιβλίου."
order: 12
group: Παραδείγματα
source: site
---

# Δοκοί {#beams}

Δύο πλήρη προγράμματα για να τα αντιγράψετε και να τα τροποποιήσετε. Και τα δύο χρησιμοποιούν διατομή χωρίς διατμητική παραμόρφωση (`k: 1e32`), οπότε οι αριθμοί τους είναι ακριβώς αυτοί των τύπων Euler–Bernoulli. Εκτελέστε τα με `node cantilever.ts` (Node 22.18 ή νεότερο), σε φάκελο προετοιμασμένο όπως στην ενότητα [Εγκατάσταση](/el/solver/getting-started#install).

## Πρόβολος {#a-cantilever}

Μήκος 4 m, πάκτωση στο A, 18 kN προς τα κάτω στο ελεύθερο άκρο:

```ts [cantilever.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // πάκτωση
const tip = domain.createNode('B', [4, 0, 0]) // ελεύθερος
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
lc.createNodalLoad('B', { [DofID.Dz]: 18e3 }) // 18 kN προς τα κάτω στο ελεύθερο άκρο
solver.solve()

console.log(beam.computeBendingMomentAt(lc, 0)) // N·m στην πάκτωση
console.log(tip.getUnknowns(lc, [DofID.Dz])) // m, το βέλος του ελεύθερου άκρου
```

```text [Έξοδος]
-72000
0.09411072715241528
```

$M_A = -FL = -72$ kNm, αρνητική ροπή (εφελκυσμός στις άνω ίνες), και το βέλος του ελεύθερου άκρου είναι $FL^3/3EI = 94{,}11$ mm, με $EI = 4{,}0803$ MNm². Ο ίδιος πρόβολος είναι ένα από τα παραδείγματα της εφαρμογής EduBeam.

## Συνεχής δοκός {#a-continuous-beam}

Δύο ανοίγματα των 5 m σε τρεις στηρίξεις, 10 kN/m και στα δύο. Οι αντιδράσεις, η ροπή πάνω από τη μεσαία στήριξη και η μέγιστη ροπή ανοίγματος:

```ts [continuous.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [5, 0, 0], [DofID.Dz])
domain.createNode('C', [10, 0, 0], [DofID.Dz])
const span1 = domain.createBeam2D(1, ['A', 'B'], 1, 1)
domain.createBeam2D(2, ['B', 'C'], 1, 1)

const lc = solver.loadCases[0]
for (const span of [1, 2]) {
  lc.createBeamElementUniformEdgeLoad(span, [0, 10e3], true)
}
solver.solve()

// η getReactions δίνει Matrix του mathjs ή πίνακα: μετατρέψτε το σε πίνακα
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

for (const label of ['A', 'B', 'C']) {
  const { dofs, values } = domain.getNode(label).getReactions(lc)
  const rz = list(values)[dofs.indexOf(DofID.Dz)]
  console.log(`R${label} = ${(-rz / 1e3).toFixed(2)} kN up`)
}
const mB = span1.computeBendingMomentAt(lc, 5)
console.log(`MB = ${(mB / 1e3).toFixed(2)} kNm`)

// Η μέγιστη θετική ροπή στο άνοιγμα 1, από 501 σημεία κατά μήκος του
const { x, M } = span1.computeBendingMoment(lc, 500)
const i = M.indexOf(Math.max(...M))
console.log(`max M = ${(M[i] / 1e3).toFixed(2)} kNm at x = ${x[i]} m`)
```

```text [Έξοδος]
RA = 18.75 kN up
RB = 62.50 kN up
RC = 18.75 kN up
MB = -31.25 kNm
max M = 17.58 kNm at x = 1.87 m
```

Οι τιμές του βιβλίου για δύο ίσα ανοίγματα: $R_A = R_C = 0{,}375\,qL$, $R_B = 1{,}25\,qL$, $M_B = -qL^2/8$, και η μέγιστη ροπή ανοίγματος $R_A^2/2q = 17{,}58$ kNm, στο $x = R_A/q = 1{,}875$ m. Η δειγματοληψία τη βρίσκει στο σημείο πλέγματος 1,87 m, με απόκλιση κάτω από 0,0002 kNm από την ακριβή τιμή.

::model-figure{caption="Δύο ανοίγματα των 5 m υπό 10 kN/m"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels]
---
::

Το σχήμα χρησιμοποιεί τη διατομή των παραδειγμάτων της εφαρμογής αντί για την IPE 200. Με μία διατομή σε όλο το μήκος, τα εντατικά μεγέθη μιας συνεχούς δοκού δεν εξαρτώνται από τη στιβαρότητά της, οπότε τα διαγράμματα έχουν τους ίδιους αριθμούς· διαφέρει μόνο το βέλος κάμψης.

## Τροποποιήσεις {#change-it}

- **Άνισα ανοίγματα ή φορτία:** αλλάξτε τις συντεταγμένες του C ή τον κατάλογο φορτίων. Φορτίο σε ένα μόνο άνοιγμα δίνει τη γνωστή δυσμενή διάταξη κινητού φορτίου.
- **Τρία ανοίγματα:** προσθέστε έναν κόμβο D και ένα μέλος `['C', 'D']`.
- **Πακτωμένο άκρο:** δώστε στον A `[DofID.Dx, DofID.Dz, DofID.Ry]`.
- **Πραγματική διατμητική παραμόρφωση:** `k: 5 / 6` για ορθογωνική διατομή ή ο συντελεστής διάτμησης της διατομής σας.
- **Σχήμα του φορέα:** δώστε τον επιλυτή στο [@edubeam/plot](/el/solver/drawing).

Ο οδηγός βήμα προς βήμα [Συνεχής δοκός και υποχώρηση στήριξης](/el/tutorials/continuous-beam) κατασκευάζει μια τέτοια δοκό στην εφαρμογή EduBeam και η σελίδα [Έλεγχος αποτελεσμάτων με το χέρι](/el/guide/verification) έχει περισσότερες περιπτώσεις από βιβλία με τους τύπους τους.
