---
title: Περιπτώσεις φόρτισης
description: "Επιλύστε ταυτόχρονα πολλές περιπτώσεις φόρτισης ενός μοντέλου @edubeam/fem και συνδυάστε τα αποτελέσματά τους με επαλληλία σε συνδυασμούς φορτίσεων και περιβάλλουσες."
order: 8
source: site
---

# Περιπτώσεις φόρτισης {#load-cases}

Μια περίπτωση φόρτισης είναι ένα σύνολο φορτίων που επιλύονται μαζί. Ο επιλυτής ξεκινά με μία· προσθέστε κι άλλες και μία μόνο `solve()` τις επιλύει όλες με ένα μητρώο στιβαρότητας. Η ανάλυση είναι γραμμική, οπότε τα αποτελέσματα διαφορετικών περιπτώσεων μπορούν να πολλαπλασιαστούν με συντελεστές και να προστεθούν: αυτό ακριβώς είναι ένας συνδυασμός φορτίσεων.

## Προσθήκη περίπτωσης φόρτισης {#add-a-load-case}

```ts [load-cases.ts]
import { DofID, LinearStaticSolver, LoadCase } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const dead = solver.loadCases[0] // αυτή με την οποία ξεκινά κάθε επιλυτής
const live = new LoadCase('live', domain)
solver.loadCases.push(live)

dead.createBeamElementUniformEdgeLoad(1, [0, 10e3], true) // 10 kN/m
live.createBeamConcentratedLoad(1, [0, 20e3, 0, 3], true) // 20 kN στο μέσο του ανοίγματος
solver.solve() // επιλύει κάθε περίπτωση φόρτισης

console.log(beam.computeBendingMomentAt(dead, 3)) // qL²/8
console.log(beam.computeBendingMomentAt(live, 3)) // PL/4
```

```text [Έξοδος]
45000
30000
```

Κάθε μέθοδος αποτελεσμάτων δέχεται την περίπτωση φόρτισης από την οποία πρέπει να διαβάσει. Η πρώτη περίπτωση έχει ετικέτα `'DefaultLC'`· οι ετικέτες είναι απλώς ονόματα και ο επιλυτής ξεχωρίζει τις περιπτώσεις από το ίδιο το αντικείμενο.

## Συνδυασμοί φορτίσεων {#combine-them}

Πολλαπλασιάστε το αποτέλεσμα κάθε περίπτωσης με τον συντελεστή της και προσθέστε. Για την οριακή κατάσταση αστοχίας του Ευρωκώδικα, $1{,}35\,G + 1{,}5\,Q$, στο μέσο του ανοίγματος:

```ts
1.35 * beam.computeBendingMomentAt(dead, 3) +
  1.5 * beam.computeBendingMomentAt(live, 3) // 105750 N·m
```

Το ίδιο ισχύει για τις αντιδράσεις, τις μετακινήσεις και κάθε άλλο αποτέλεσμα. Σε όλο το μήκος ενός μέλους, συνδυάστε σημείο προς σημείο: οι πίνακες της `computeBendingMoment(lc, n)` χρησιμοποιούν τα ίδια `x` για κάθε περίπτωση.

```ts
const n = 60
const g = beam.computeBendingMoment(dead, n).M
const q = beam.computeBendingMoment(live, n).M
const uls = g.map((m, i) => 1.35 * m + 1.5 * q[i])
Math.max(...uls) // 105750 N·m, στο x = 3
```

Μια περιβάλλουσα, δηλαδή η μέγιστη και η ελάχιστη τιμή από πολλούς συνδυασμούς, είναι ένα `Math.max` και ένα `Math.min` πάνω σε τέτοιους πίνακες, σημείο προς σημείο. Για κινητό φορτίο, αντίθετα, επιλύστε μία φορά για κάθε θέση του φορτίου: αυτό κάνει το [παράδειγμα γραμμής επιρροής](/el/solver/scripts#an-influence-line-as-csv).

## Στην εφαρμογή EduBeam {#in-the-edubeam-app}

Η εφαρμογή επιλύει μία περίπτωση φόρτισης κάθε φορά, οπότε στους συνδυασμούς η βιβλιοθήκη πηγαίνει πιο πέρα από αυτήν. Ένα μοντέλο με πολλές περιπτώσεις μπορεί πάντως να [σχεδιαστεί](/el/solver/drawing) περίπτωση προς περίπτωση: το `StructurePlot` του @edubeam/plot δέχεται έναν δείκτη `loadCase` στον πίνακα `solver.loadCases`.
