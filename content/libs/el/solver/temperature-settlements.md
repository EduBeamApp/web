---
title: Θερμοκρασία και υποχωρήσεις
description: "Φορτίστε μέλη του @edubeam/fem με ομοιόμορφη μεταβολή θερμοκρασίας και θερμοκρασιακή διαφορά, και μετακινήστε στηρίξεις κατά επιβαλλόμενη μετακίνηση, με ελεγμένα παραδείγματα."
order: 7
source: site
---

# Θερμοκρασία και υποχωρήσεις {#temperature-and-settlements}

Δύο φορτία που δεν είναι δυνάμεις: ένα μέλος που τείνει να αλλάξει το μήκος ή την καμπυλότητά του και μια στήριξη που μετακινείται. Και τα δύο προκαλούν εντατικά μεγέθη μόνο εκεί όπου ο φορέας τα παρεμποδίζει, γι' αυτό είναι κατάλληλα για τη διδασκαλία των υπερστατικών φορέων. Η θεωρία και των δύο βρίσκεται στην ενότητα [Φορτία στοιχείου](/el/elements/beam#element-loads) του θεωρητικού εγχειριδίου της εφαρμογής.

## Θερμοκρασία {#temperature}

```ts
lc.createBeamTemperatureLoad(member, [dTc, dTb, dTt])
```

| Τιμή | Σημασία | Επίδραση σε ελεύθερο μέλος |
| --- | --- | --- |
| `dTc` | μεταβολή στο κέντρο βάρους, K | επιμήκυνση κατά $\alpha\,\Delta T_c\,L$ |
| `dTb` | μεταβολή στην κάτω ίνα (πλευρά του τοπικού +z), K | μαζί με το `dTt` καμπυλώνει το μέλος κατά $\kappa = \alpha\,(\Delta T_b - \Delta T_t)/h$ |
| `dTt` | μεταβολή στην άνω ίνα, K | |

Μόνο η διαφορά `dTb - dTt` κάμπτει το μέλος, οπότε τα `[30, 20, 0]` και `[30, 10, -10]` είναι το ίδιο φορτίο. Απαιτεί το `alpha` του υλικού και το `h` της διατομής· χωρίς `h` οι ροπές βγαίνουν `NaN`.

Μια αμφίπακτη δοκός δεν μπορεί ούτε να επιμηκυνθεί ούτε να καμπυλωθεί, οπότε αντί γι' αυτό θλίβεται και κάμπτεται: $N = -EA\,\alpha\,\Delta T_c$ και $M = -EI\,\alpha\,(\Delta T_b - \Delta T_t)/h$.

```ts [temperature.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial(1, { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [6, 0, 0], fixed)
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

// Το κέντρο βάρους 30 K θερμότερο, η κάτω πλευρά 20 K θερμότερη από την άνω
lc.createBeamTemperatureLoad(1, [30, 20, 0])
solver.solve()

beam.computeNormalForceAt(lc, 3) // -215460 N: EA · 12e-6 · 30
beam.computeBendingMomentAt(lc, 3) // -4896.4 N·m: EI · 12e-6 · 20 / 0.2
```

Για την IPE 200, $EA = 598{,}5$ MN και $EI = 4{,}0803$ MNm². Μια θερμότερη κάτω ίνα κάνει μια ελεύθερη δοκό να σηκώνει τα άκρα της, οπότε η δέσμευση την κάμπτει προς την αντίθετη φορά: αρνητική ροπή, εφελκυσμός στην άνω ίνα.

::model-figure{caption="Αμφίπακτη δοκός, 30 K θερμότερη στο κέντρο βάρους και 20 K θερμότερη κάτω από ό,τι πάνω"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 30, bottom: 20, top: 0 } }
results: [M, N]
show: [nodeLabels]
material: { e: 210e9, alpha: 12e-6 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

Σε αμφιέρειστη δοκό το ίδιο φορτίο δεν προκαλεί κανένα εντατικό μέγεθος, μόνο μετακινήσεις: η κύλιση μετακινείται προς τα έξω κατά $\alpha\,\Delta T_c\,L = 2{,}16$ mm και το μέσο του ανοίγματος βυθίζεται κατά $\kappa L^2/8 = 5{,}4$ mm.

## Επιβαλλόμενες μετακινήσεις {#prescribed-displacements}

```ts
lc.createPrescribedDisplacement(node, { [DofID.Dz]: 0.01 })
```

Μετακινεί μια στήριξη κατά δεδομένη τιμή: σε μέτρα για τα `Dx` και `Dz`, σε ακτίνια για το `Ry`, στους δικούς άξονες του κόμβου. Ο βαθμός ελευθερίας πρέπει να είναι δεσμευμένος από τη στήριξη του κόμβου· σε ελεύθερο βαθμό ελευθερίας η τιμή αγνοείται χωρίς προειδοποίηση.

Μια μονόπακτη δοκός της οποίας η κύλιση υποχωρεί κατά 10 mm, σε νέο επιλυτή με το υλικό και τη διατομή του θερμοκρασιακού παραδείγματος:

```ts
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // πάκτωση
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // κύλιση
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

lc.createPrescribedDisplacement('B', { [DofID.Dz]: 0.01 }) // 10 mm προς τα κάτω
solver.solve()

domain.getNode('B').getReactions(lc).values // [566.7] N: 3EIw/L³
beam.computeBendingMomentAt(lc, 0) // -3400.2 N·m στο A: 3EIw/L²
```

Η κύλιση πρέπει να τραβήξει τη δοκό προς τα κάτω για να την ακολουθήσει, οπότε η αντίδρασή της είναι θετική, κατά +z: $3EIw/L^3 = 3 \cdot 4{,}0803 \times 10^6 \cdot 0{,}01 / 216 = 566{,}7$ N.

::model-figure{caption="Η κύλιση μιας μονόπακτης δοκού υποχωρεί κατά 10 mm: −3,4 kNm στην πάκτωση"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

Το πώς σχεδιάζει η εφαρμογή αυτά τα δύο φορτία περιγράφεται στη σελίδα [Φορτία](/el/essentials/loads).
