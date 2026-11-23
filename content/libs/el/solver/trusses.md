---
title: Δικτυώματα
description: "Αρθρωτό δικτύωμα Warren στο @edubeam/fem, με κάθε αξονική δύναμη ράβδου ελεγμένη με τη μέθοδο των τομών, και ένας βρόχος που δημιουργεί δικτυώματα με οποιονδήποτε αριθμό φατνωμάτων."
order: 14
source: site
---

# Δικτυώματα {#trusses}

Ένα δικτύωμα αποτελείται από ράβδους με αρθρώσεις και στα δύο άκρα, φορτισμένες μόνο στους κόμβους, οπότε κάθε ράβδος φέρει μόνο αξονική δύναμη. Αυτό το παράδειγμα κατασκευάζει ένα δικτύωμα Warren από δύο λίστες, ελέγχει με το χέρι τη δύναμη κάθε ράβδου και στη συνέχεια δημιουργεί σε βρόχο δικτυώματα οποιουδήποτε μεγέθους.

::model-figure{caption="Δικτύωμα Warren: άνοιγμα 9 m, ύψος 1,8 m, 8 kN σε κάθε άνω κόμβο"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members:
  - { nodes: [A, B], hinges: [true, true] }
  - { nodes: [B, C], hinges: [true, true] }
  - { nodes: [C, D], hinges: [true, true] }
  - { nodes: [E, F], hinges: [true, true] }
  - { nodes: [F, G], hinges: [true, true] }
  - { nodes: [A, E], hinges: [true, true] }
  - { nodes: [E, B], hinges: [true, true] }
  - { nodes: [B, F], hinges: [true, true] }
  - { nodes: [F, C], hinges: [true, true] }
  - { nodes: [C, G], hinges: [true, true] }
  - { nodes: [G, D], hinges: [true, true] }
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: [N, w]
show: [nodeLabels]
---
::

```ts [truss.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })

// Δικτύωμα Warren: άνοιγμα 9 m, ύψος 1,8 m, κάτω πέλμα A-B-C-D, άνω πέλμα E-F-G
const nodes: [string, number, number, DofID[]][] = [
  ['A', 0, 0, [DofID.Dx, DofID.Dz]],
  ['B', 3, 0, []],
  ['C', 6, 0, []],
  ['D', 9, 0, [DofID.Dz]],
  ['E', 1.5, -1.8, []],
  ['F', 4.5, -1.8, []],
  ['G', 7.5, -1.8, []],
]
for (const [label, x, z, support] of nodes) {
  domain.createNode(label, [x, 0, z], support)
}

// Κάθε ετικέτα ονομάζει τους δύο κόμβους της ράβδου. Αρθρώσεις και στα δύο άκρα: μόνο αξονική δύναμη.
const bars = ['AB', 'BC', 'CD', 'EF', 'FG', 'AE', 'EB', 'BF', 'FC', 'CG', 'GD']
const members = bars.map((bar) =>
  domain.createBeam2D(bar, [bar[0], bar[1]], 1, 1, [true, true])
)

const lc = solver.loadCases[0]
for (const top of ['E', 'F', 'G']) {
  lc.createNodalLoad(top, { [DofID.Dz]: 8e3 }) // 8 kN προς τα κάτω
}
solver.solve()

for (const bar of members) {
  const n = bar.computeNormalForceAt(lc, 0) / 1e3
  console.log(bar.label, n.toFixed(2), n > 0 ? 'tension' : 'compression')
}
```

```text [Έξοδος]
AB 10.00 tension
BC 16.67 tension
CD 10.00 tension
EF -13.33 compression
FG -13.33 compression
AE -15.62 compression
EB 5.21 tension
BF -5.21 compression
FC -5.21 compression
CG 5.21 tension
GD -15.62 compression
```

Η αξονική δύναμη μιας ράβδου είναι σταθερή, οπότε αρκεί να διαβαστεί στο `x = 0`. Οι διγράμματες ετικέτες χρησιμεύουν ταυτόχρονα ως ζεύγη κόμβων: `bar[0]` και `bar[1]`.

## Έλεγχος με το χέρι {#check-it-by-hand}

Κάθε στήριξη παραλαμβάνει το μισό των 24 kN, δηλαδή 12 kN. Κόψτε το δικτύωμα και γράψτε την ισορροπία ροπών ως προς τον κόμβο απέναντι από την κομμένη ράβδο, όπως στη [μέθοδο των τομών (Ritter)](/el/tutorials/truss):

| Ράβδος | Τομή | Δύναμη |
| --- | --- | --- |
| BC, κάτω πέλμα | ροπές ως προς F: $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$ | 16,67 kN, εφελκυσμός |
| EF, άνω πέλμα | ροπές ως προς B: $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$ | 13,33 kN, θλίψη |
| AE, ακραία διαγώνιος | κόμβος A: $12 \cdot \sqrt{1{,}5^2 + 1{,}8^2}/1{,}8$ | 15,62 kN, θλίψη |
| EB, διαγώνιος | τέμνουσα στο φάτνωμα, $12 - 8 = 4$ kN: $4 \cdot 2{,}343/1{,}8$ | 5,21 kN, εφελκυσμός |

Η διατομή δεν αλλάζει τις δυνάμεις των ράβδων ενός ισοστατικού δικτυώματος· καθορίζει μόνο πόσο μετακινούνται οι κόμβοι. Το παραπάνω σχήμα χρησιμοποιεί άλλη διατομή, αυτή της εφαρμογής EduBeam, και δίνει τις ίδιες δυνάμεις.

## Οποιοσδήποτε αριθμός φατνωμάτων {#any-number-of-panels}

Για να δημιουργείτε δικτυώματα, για ασκήσεις ή για μια παραμετρική μελέτη, κατασκευάστε τους κόμβους και τις ράβδους σε βρόχο, φάτνωμα προς φάτνωμα. Με `panels = 3` προκύπτει το παραπάνω δικτύωμα και εμφανίζονται οι ίδιες δυνάμεις· αλλάξτε τα `panels`, `w` και `h` για ένα άλλο.

```ts [warren.ts]
import { type Beam2D, DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })
const lc = solver.loadCases[0]

const panels = 3 // φατνώματα του κάτω πέλματος
const w = 3 // πλάτος φατνώματος, m
const h = 1.8 // ύψος, m

// Κάτω κόμβοι b0, b1, … σε άρθρωση και κύλιση· άνω κόμβοι t0, t1, … ανάμεσά τους
for (let i = 0; i <= panels; i++) {
  const ends = i === 0 ? [DofID.Dx, DofID.Dz] : i === panels ? [DofID.Dz] : []
  domain.createNode(`b${i}`, [i * w, 0, 0], ends)
}
for (let i = 0; i < panels; i++) {
  domain.createNode(`t${i}`, [(i + 0.5) * w, 0, -h])
  lc.createNodalLoad(`t${i}`, { [DofID.Dz]: 8e3 })
}

const members: Beam2D[] = []
const bar = (a: string, b: string) =>
  members.push(domain.createBeam2D(`${a}-${b}`, [a, b], 1, 1, [true, true]))
for (let i = 0; i < panels; i++) {
  bar(`b${i}`, `b${i + 1}`) // κάτω πέλμα
  bar(`b${i}`, `t${i}`) // ανιούσα διαγώνιος
  bar(`t${i}`, `b${i + 1}`) // κατιούσα διαγώνιος
  if (i > 0) bar(`t${i - 1}`, `t${i}`) // άνω πέλμα
}
solver.solve()

for (const m of members) {
  console.log(m.label, (m.computeNormalForceAt(lc, 0) / 1e3).toFixed(2))
}
```

Ο χρόνος επίλυσης αυξάνει γρήγορα με το μέγεθος: μερικές δεκάδες φατνώματα δεν είναι πρόβλημα, δείτε [Μέγεθος μοντέλου](/el/solver/solving#model-size). Για να σχεδιάσετε κάθε δικτύωμα που δημιουργείται, με ή χωρίς τις λύσεις του, δείτε τη σελίδα [Ασκήσεις και διαγωνίσματα](/el/plot/exercises) του @edubeam/plot.

## Τι να προσέξετε {#things-to-notice}

- **Αρθρώσεις σε κάθε άκρο ράβδου.** Κάθε κόμβος μπορεί τότε να στραφεί ελεύθερα και ο επιλυτής δίνει τη στροφή του ως 0. Μια ροπή που ασκείται σε τέτοιον κόμβο δεν έχει τίποτε να την παραλάβει και [η επίλυση αποτυγχάνει](/el/solver/solving#when-solving-fails).
- **Φορτία στους κόμβους.** Ένα φορτίο κατά μήκος μιας ράβδου θα την έκαμπτε: τότε είναι δοκός, όχι ράβδος δικτυώματος, και αποκτά διάγραμμα ροπών.

Ο οδηγός βήμα προς βήμα [Επίπεδο δικτύωμα](/el/tutorials/truss) κατασκευάζει ένα δικτύωμα στην εφαρμογή EduBeam και η σελίδα [Στοιχείο δικτυώματος](/el/elements/truss) εξάγει τη στιβαρότητα της ράβδου.
