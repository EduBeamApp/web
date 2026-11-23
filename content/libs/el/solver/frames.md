---
title: Πλαίσια
description: "Πλήρες πρόγραμμα @edubeam/fem για τριαρθρωτό πλαίσιο, με υποστυλώματα, μονολιθικές γωνίες και άρθρωση κορυφής, και με τα αποτελέσματά του ελεγμένα με το χέρι."
order: 13
source: site
---

# Πλαίσια {#frames}

Ένα πλαίσιο αποτελείται από δοκούς και υποστυλώματα που συνδέονται μονολιθικά στις γωνίες τους. Αυτό το παράδειγμα κατασκευάζει σε κώδικα το πλαίσιο του οδηγού βήμα προς βήμα [Τριαρθρωτό πλαίσιο](/el/tutorials/three-hinged-frame): δύο υποστυλώματα ύψους 4 m με αρθρώσεις στα A και E, μια δοκό (ζύγωμα) μήκους 8 m με άρθρωση στο C και 10 kN/m στη δοκό. Ο οδηγός αριθμεί τους κόμβους από 1 έως 5· εδώ ονομάζονται A έως E.

::model-figure{caption="Το πλαίσιο του παρακάτω προγράμματος: αρθρώσεις στα A και E, άρθρωση στο C, 10 kN/m"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, k: 1e32 }) // IPE 300

// Ο z δείχνει προς τα κάτω: οι κορυφές των υποστυλωμάτων ύψους 4 m είναι στο z = -4
const pin = [DofID.Dx, DofID.Dz]
domain.createNode('A', [0, 0, 0], pin)
domain.createNode('B', [0, 0, -4])
domain.createNode('C', [4, 0, -4]) // η άρθρωση κορυφής
domain.createNode('D', [8, 0, -4])
domain.createNode('E', [8, 0, 0], pin)

const column = domain.createBeam2D(1, ['A', 'B'], 1, 1) // από κάτω προς τα πάνω
const left = domain.createBeam2D(2, ['B', 'C'], 1, 1, [false, true]) // άρθρωση στο C
domain.createBeam2D(3, ['C', 'D'], 1, 1)
domain.createBeam2D(4, ['D', 'E'], 1, 1)

const lc = solver.loadCases[0]
for (const half of [2, 3]) {
  lc.createBeamElementUniformEdgeLoad(half, [0, 10e3], false)
}
solver.solve()

// η getReactions δίνει Matrix του mathjs ή πίνακα: μετατρέψτε το σε πίνακα
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()
const kN = (v: number) => (v / 1e3).toFixed(2)

for (const label of ['A', 'E']) {
  const [rx, rz] = list(domain.getNode(label).getReactions(lc).values)
  console.log(`${label}: Rx = ${kN(rx)} kN, Rz = ${kN(rz)} kN`)
}
for (const x of [0, 2, 4]) {
  const m = left.computeBendingMomentAt(lc, x)
  console.log(`M at ${x} m from B = ${kN(m)} kNm`)
}
const top = column.computeBendingMomentAt(lc, 4)
console.log(`M at the top of column 1 = ${kN(top)} kNm`)
```

```text [Έξοδος]
A: Rx = 20.00 kN, Rz = -40.00 kN
E: Rx = -20.00 kN, Rz = -40.00 kN
M at 0 m from B = -80.00 kNm
M at 2 m from B = -20.00 kNm
M at 4 m from B = 0.00 kNm
M at the top of column 1 = -80.00 kNm
```

## Έλεγχος με το χέρι {#check-it-by-hand}

| Μέγεθος | Με το χέρι | Επιλυτής |
| --- | --- | --- |
| Κατακόρυφες αντιδράσεις | $q \cdot 8/2 = 40$ kN προς τα πάνω | $R_z = -40$ kN στα A και E |
| Οριζόντιες αντιδράσεις | από $M_C = 0$ στο αριστερό μισό: $(40 \cdot 4 - 10 \cdot 4 \cdot 2)/4 = 20$ kN, προς τα μέσα | $R_x = +20$ kN στο A, $-20$ kN στο E |
| Ροπή στη γωνία | $-20 \cdot 4 = -80$ kNm | $-80$ kNm στη δοκό και στο υποστύλωμα |
| Ροπή 2 m από το B | $-80 + 40 \cdot 2 - 10 \cdot 2^2/2 = -20$ kNm | $-20$ kNm |
| Ροπή στην άρθρωση | 0 | 0 |

## Τι να προσέξετε {#things-to-notice}

- **Τα υποστυλώματα ανεβαίνουν, οπότε το z είναι αρνητικό.** Οι κορυφές των υποστυλωμάτων βρίσκονται στο $z = -4$.
- **Οι τοπικοί άξονες του υποστυλώματος.** Το μέλος 1 πηγαίνει από το A προς τα πάνω στο B, οπότε ο τοπικός του z δείχνει δεξιά, προς το εσωτερικό του πλαισίου. Η ροπή του στην κορυφή είναι −80 kNm, όπως της δοκού στη γωνία: εφελκυσμός στην εξωτερική πλευρά. Ορίστε το υποστύλωμα από το B προς τα κάτω στο A και ο τοπικός του z δείχνει αριστερά: η ροπή του αλλάζει πρόσημο και το `x` μετριέται από την κορυφή. Δείτε [Φορά του μέλους](/el/solver/conventions#member-direction).
- **Μία άρθρωση, ένα άκρο μέλους.** Η άρθρωση βρίσκεται στο άκρο του μέλους 2 στο C· το μέλος 3 συνδέεται μονολιθικά στο C. Ένα απελευθερωμένο άκρο αρκεί για να γίνει το C άρθρωση.
- **Φορτία της δοκού στο καθολικό σύστημα.** Το `false` δίνει το φορτίο στο καθολικό σύστημα: κατακόρυφο, όποια κι αν είναι η κλίση του μέλους. Σε οριζόντια δοκό σχεδιασμένη από αριστερά προς τα δεξιά αυτό ταυτίζεται με το τοπικό.

## Υπερστατικά πλαίσια {#statically-indeterminate-frames}

Αφαιρέστε την άρθρωση, `[false, false]`, και το πλαίσιο γίνεται αμφιαρθρωτό πλαίσιο, μία φορά υπερστατικό. Τα εντατικά του μεγέθη εξαρτώνται τότε από το πόσο στιβαρή είναι η δοκός σε σχέση με τα υποστυλώματα: δώστε στα μέλη διαφορετικές διατομές για να το δείτε. Τα [πειράματα του οδηγού](/el/tutorials/three-hinged-frame#_7-experiment) πακτώνουν τις βάσεις και ωθούν το πλαίσιο πλευρικά, με τους αριθμούς για σύγκριση. Η σελίδα [Διαφάνειες και σημειώσεις](/el/plot/slides) του @edubeam/plot σχεδιάζει ένα τέτοιο αμφιαρθρωτό πλαίσιο βήμα προς βήμα.
