---
title: Ανάγνωση αποτελεσμάτων
description: "Διαβάστε αντιδράσεις, μετακινήσεις, εντατικά μεγέθη κατά μήκος μέλους, ελαστικές γραμμές και δυνάμεις άκρων από ένα επιλυμένο μοντέλο @edubeam/fem, και τι επιστρέφει κάθε κλήση."
order: 10
source: site
---

# Ανάγνωση αποτελεσμάτων {#reading-results}

Μετά την `solve()`, τα αποτελέσματα διαβάζονται από τους κόμβους και τα μέλη, για μια δεδομένη περίπτωση φόρτισης. Όλα τα παραδείγματα αυτής της σελίδας διαβάζουν το ίδιο μοντέλο: αμφιέρειστη δοκό ανοίγματος 6 m, IPE 200 χωρίς διατμητική παραμόρφωση, με 20 kN σε απόσταση 2 m από το A:

```ts [results.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 }) // διατμητικά απαραμόρφωτη

const A = domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
const B = domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
const lc = solver.loadCases[0]
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], true)
solver.solve()
```

::model-figure{caption="20 kN στα 2 m σε άνοιγμα 6 m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M, w]
show: [nodeLabels]
---
::

## Τι διαβάζεται πού {#what-to-read-where}

| Αποτέλεσμα | Κλήση | Επιστρέφει |
| --- | --- | --- |
| Αντιδράσεις | `node.getReactions(lc)` | `{ dofs, values }`: N, N·m |
| Μετακινήσεις | `node.getUnknowns(lc, dofs)` | m, rad |
| N, V ή M σε σημείο | `beam.computeBendingMomentAt(lc, x)` | αριθμό: N, N·m |
| N, V ή M κατά μήκος μέλους | `beam.computeBendingMoment(lc, n)` | `{ x, M }`, n + 1 σημεία |
| Ελαστική γραμμή | `beam.computeLocalDefl(lc, n)` | `{ u, w }`, n + 1 σημεία, m |
| Δυνάμεις άκρων | `beam.computeEndForces(lc)` | μητρώο mathjs με 6 τιμές |

Για τα N και V οι μέθοδοι είναι οι `computeNormalForceAt` και `computeShearForceAt`, `computeNormalForce` και `computeShearForce`, που επιστρέφουν `{ x, N }` και `{ x, V }`. Τα πρόσημα περιγράφονται στη σελίδα [Μονάδες και πρόσημα](/el/solver/conventions#signs-of-the-results).

## Αντιδράσεις {#reactions}

Η `getReactions` δίνει μία αντίδραση για κάθε βαθμό ελευθερίας που δεσμεύει η στήριξη: το `dofs` τους απαριθμεί, με τη σειρά που δόθηκαν στην `createNode`, και το `values` περιέχει τις αντιδράσεις με την ίδια σειρά. Το `values` είναι **μητρώο mathjs** όταν είναι περισσότερες και απλός πίνακας όταν είναι μία, οπότε μια μικρή βοηθητική συνάρτηση το μετατρέπει σε πίνακα σε κάθε περίπτωση:

```ts
/** Μετατρέπει ένα Matrix του mathjs, έναν πίνακα ή έναν αριθμό σε απλό πίνακα. */
const list = (v: unknown): number[] =>
  typeof v === 'number'
    ? [v]
    : Array.isArray(v)
      ? v
      : (v as { toArray(): number[] }).toArray()

A.getReactions(lc).dofs // [0, 2]: DofID.Dx, DofID.Dz
list(A.getReactions(lc).values) // [0, -13333.3]
list(B.getReactions(lc).values) // [-6666.7]
```

Για να πάρετε μία αντίδραση ανεξάρτητα από τη σειρά, αναζητήστε τον βαθμό ελευθερίας της: `list(values)[dofs.indexOf(DofID.Dz)]`, όπως κάνει το [παράδειγμα συνεχούς δοκού](/el/solver/beams#a-continuous-beam).

Αντίδραση είναι η δύναμη που ασκεί η στήριξη στον φορέα: −13 333 N κατά z είναι 13,3 kN προς τα πάνω, $P\,b/L = 20 \cdot 4/6$. Σε κόμβο με [στραμμένους άξονες](/el/solver/nodes-supports#inclined-supports) οι αντιδράσεις δίνονται σε αυτούς τους άξονες· η `getReactions(lc, true)` τις μετατρέπει στο καθολικό σύστημα και επιστρέφει και τους τρεις βαθμούς ελευθερίας, με 0 όπου δεν δεσμεύεται τίποτε. Ένας κόμβος χωρίς στήριξη δίνει `{ dofs: [], values: [] }`.

## Μετακινήσεις {#displacements}

Η `getUnknowns` διαβάζει οποιουσδήποτε βαθμούς ελευθερίας ενός κόμβου, στηριζόμενου ή όχι:

```ts
list(A.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])) // [0, 0, -0.0108924]
```

Ο A στρέφεται δεξιόστροφα κατά 0,010892 rad, $P\,b\,(L^2 - b^2)/6EIL$. Όταν ζητάτε έναν βαθμό ελευθερίας, η `getUnknowns` επιστρέφει απλό αριθμό, αν και η TypeScript δηλώνει μητρώο: η `list` χειρίζεται και αυτό.

## Εντατικά μεγέθη κατά μήκος μέλους {#internal-forces-along-a-member}

Οι μέθοδοι `…At` δίνουν την τιμή σε απόσταση `x` μέτρων από τον πρώτο κόμβο του μέλους:

```ts
beam.computeShearForceAt(lc, 1) // 13333.3 N
beam.computeShearForceAt(lc, 2) // -6666.7 N: στο φορτίο, η τιμή μετά από αυτό
beam.computeBendingMomentAt(lc, 2) // 26666.7 N·m: R_A · 2
```

Όπου ένα συγκεντρωμένο φορτίο προκαλεί άλμα, η τιμή ακριβώς στο φορτίο είναι αυτή της απέναντι πλευράς του. Για να διαβάσετε την πλευρά πριν από το φορτίο, ζητήστε ένα σημείο ελάχιστα νωρίτερα, όπως `x - 1e-9`.

Οι μέθοδοι πινάκων δειγματοληπτούν ένα μέλος σε n + 1 ισαπέχοντα σημεία, μαζί με τα άκρα:

```ts
beam.computeBendingMoment(lc, 3)
// { x: [0, 2, 4, 6], M: [0, 26666.7, 13333.3, 0] }, με ακρίβεια στρογγύλευσης
```

Να περιμένετε σφάλματα στρογγύλευσης, όπως `-3.6e-12` εκεί όπου η ακριβής τιμή είναι 0: μορφοποιήστε τους αριθμούς με `toFixed` πριν τους εμφανίσετε. Ως μέγιστη τιμή κατά μήκος ενός μέλους πάρτε τη μέγιστη μιας πυκνής δειγματοληψίας, όπως `computeBendingMoment(lc, 500)`, όπως στο [παράδειγμα συνεχούς δοκού](/el/solver/beams#a-continuous-beam). Υπό κατανεμημένα φορτία η M είναι πολυώνυμο, οπότε το ακριβές ακρότατό της βρίσκεται εκεί όπου η V μηδενίζεται· το [@edubeam/plot](/el/plot/model#reading-values-yourself) το βρίσκει ακριβώς.

## Ελαστική γραμμή {#deflected-shape}

```ts
beam.computeLocalDefl(lc, 3)
// { u: [0, 0, 0, 0], w: [0, 0.0174279, 0.0152494, 0] }
```

Η `computeLocalDefl` δίνει τις μετακινήσεις κατά μήκος και εγκάρσια στο μέλος, `u` και `w`, στους τοπικούς του άξονες· η `computeGlobalDefl` τα ίδια σημεία στους καθολικούς x και z. Το βέλος κάμψης κάτω από το φορτίο, 17,43 mm, είναι $P\,a^2 b^2/3EIL$. Η γραμμή μεταξύ των κόμβων είναι ακριβής, όχι παρεμβολή από τις τιμές των άκρων. Για τη σχεδίασή της, δείτε [Σχεδίαση αποτελεσμάτων](/el/solver/drawing).

## Δυνάμεις άκρων {#end-forces}

```ts
beam.computeEndForces(lc).toArray()
// [0, -13333.3, 0, 0, -6666.7, 0]: X12, Z12, M12, X21, Z21, M21
```

Οι δυνάμεις που ασκούν οι δύο κόμβοι στο μέλος, στους τοπικούς του άξονες: είναι οι αριθμοί του πίνακα *Αποτελέσματα στοιχείων* της εφαρμογής, που εξηγούνται στην ενότητα [Δυνάμεις άκρων](/el/elements/conventions#end-forces-element-results-table).

## Αποτελέσματα για έλεγχο {#results-as-numbers-to-check}

Κάθε παραπάνω τιμή συμφωνεί με τον αναλυτικό της τύπο. Η σελίδα [Έλεγχος αποτελεσμάτων με το χέρι](/el/guide/verification) εξετάζει πολλές ακόμη περιπτώσεις από βιβλία, επιλυμένες από τον ίδιο επιλυτή στο πρόγραμμα περιήγησής σας.
