---
title: Μοντέλο σχήματος
description: "Το PlotModel της modelFromSolver: απλό JSON από ένα επιλυμένο μοντέλο του @edubeam/fem, αποτελέσματα ως τμηματικά πολυώνυμα, ακριβείς τιμές και ακρότατα."
order: 9
source: site
---

# Μοντέλο σχήματος

Ό,τι σχεδιάζει το @edubeam/plot προέρχεται από ένα `PlotModel`: απλά δεδομένα που η `modelFromSolver` διαβάζει από ένα επιλυμένο μοντέλο του @edubeam/fem. Περιέχει τη γεωμετρία, τις στηρίξεις, τα φορτία, τις αντιδράσεις και τα αποτελέσματα κάθε μέλους ως ακριβή πολυώνυμα. Σειριοποιείται σε JSON, οπότε μπορεί να δημιουργηθεί κατά το build και να διανεμηθεί αντί για τον επιλυτή· είναι επίσης ο πιο εύκολος τρόπος να διαβάσετε ακριβείς τιμές και ακρότατα ενός επιλυμένου φορέα.

```ts
import { modelFromSolver } from '@edubeam/plot'

const model = modelFromSolver(solver) // ή modelFromSolver(solver, { loadCase: 1 })
```

Το `results` υπάρχει μόνο όταν η περίπτωση φόρτισης έχει επιλυθεί. Χωρίς αυτό, τα components σχεδιάζουν μόνο το μοντέλο, και με [`reactionLabels: 'names'`](/el/plot/structure-plot#reactions-as-unknowns) σχεδιάζουν ωστόσο τις άγνωστες αντιδράσεις, οπότε ένα μη επιλυμένο μοντέλο μπορεί να γίνει εκφώνηση άσκησης.

## Η μορφή {#the-format}

Όλα είναι σε μονάδες SI (m, N, N·m, N/m, K, rad) και στους άξονες του επιλυτή: x προς τα δεξιά, z προς τα κάτω, στροφές θετικές αριστερόστροφα στην οθόνη.

```ts
interface PlotModel {
  readonly nodes: readonly PlotNode[]
  readonly members: readonly PlotMember[]
  readonly loads: readonly PlotLoad[]
  readonly results?: PlotResults // μόνο για επιλυμένη περίπτωση φόρτισης
}

interface PlotNode {
  readonly id: string
  readonly x: number
  readonly z: number
  readonly fixity: { readonly dx: boolean; readonly dz: boolean; readonly ry: boolean } // δεσμευμένοι βαθμοί ελευθερίας
  readonly angle: number // στροφή των αξόνων μιας κεκλιμένης στήριξης, rad, δεξιόστροφα στην οθόνη
}

interface PlotMember {
  readonly id: string
  readonly start: string // αναγνωριστικά κόμβων
  readonly end: string
  readonly hinges: readonly [boolean, boolean]
}

interface PlotResults {
  readonly members: Readonly<Record<string, MemberResults>> // ανά αναγνωριστικό μέλους
  readonly reactions: readonly PlotReaction[]
}

interface MemberResults {
  readonly N: Piecewise // αξονική δύναμη, θετική ο εφελκυσμός
  readonly V: Piecewise // τέμνουσα δύναμη
  readonly M: Piecewise // καμπτική ροπή, θετική όταν εφελκύεται η πλευρά του τοπικού +z
  readonly u: Piecewise // μετακίνηση κατά τον τοπικό άξονα x
  readonly w: Piecewise // μετακίνηση κατά τον τοπικό άξονα z
}

interface PlotReaction {
  readonly node: string
  readonly dof: 'dx' | 'dz' | 'ry'
  readonly value: number // δύναμη πάνω στον φορέα κατά τον άξονα του κόμβου, N (N·m για ry)
}
```

Ένα φορτίο ανήκει σε ένα από επτά είδη, που διακρίνονται με το πεδίο `kind`:

| `kind` | Πεδία | Σημαίνει |
| --- | --- | --- |
| `'nodalForce'` | `node`, `fx`, `fz` | δύναμη σε κόμβο, καθολικές συνιστώσες, N |
| `'nodalMoment'` | `node`, `my` | ροπή σε κόμβο, N·m |
| `'distributed'` | `member`, `start`, `end`, `local` | γραμμικά μεταβαλλόμενο φορτίο, `{ fx, fz }` σε κάθε άκρο, N/m· ομοιόμορφο όταν είναι ίσα |
| `'pointForce'` | `member`, `at`, `fx`, `fz`, `local` | δύναμη σε απόσταση `at` μέτρων από την αρχή του μέλους |
| `'pointMoment'` | `member`, `at`, `my` | συγκεντρωμένη ροπή πάνω σε μέλος |
| `'temperature'` | `member`, `uniform`, `gradient` | K: η μεταβολή στο κέντρο βάρους και η διαφορά κάτω μείον άνω ινών |
| `'prescribed'` | `node`, `dx?`, `dz?`, `ry?` | μετακίνηση στήριξης στους άξονες του κόμβου, m και rad |

Το `local` είναι `true` όταν οι συνιστώσες δίνονται κατά τους τοπικούς άξονες x και z του μέλους και όχι κατά τους καθολικούς άξονες.

## Τμηματικά πολυώνυμα {#piecewise-polynomials}

Το αποτέλεσμα ενός μέλους είναι ένα `Piecewise`: μια λίστα από τμήματα, το καθένα ένα πολυώνυμο σε μέρος του μέλους. Νέο τμήμα ξεκινά όπου ένα συγκεντρωμένο φορτίο ή μια συγκεντρωμένη ροπή διακόπτει την πορεία του αποτελέσματος.

```ts
interface Piece {
  readonly x0: number // m από την αρχή του μέλους
  readonly x1: number
  readonly c: readonly number[] // τιμή = Σ c[k]·sᵏ, όπου s = (x − x0)/(x1 − x0)
}
type Piecewise = readonly Piece[]
```

Τα N, V και M είναι το πολύ τρίτου βαθμού και το βέλος κάμψης το πολύ πέμπτου, οπότε λίγοι συντελεστές αποδίδουν ακριβώς την απάντηση του επιλυτή. Η τέμνουσα δύναμη μιας δοκού 6 m με 20 kN στα 2 m αποτελείται από δύο σταθερά τμήματα:

```json
[{ "x0": 0, "x1": 2, "c": [13333.33] }, { "x0": 2, "x1": 6, "c": [-6666.67] }]
```

## Ανάγνωση τιμών από εσάς {#reading-values-yourself}

Οι συναρτήσεις που σχεδιάζουν τα διαγράμματα τα διαβάζουν επίσης, ακριβώς και χωρίς δειγματοληψία:

```ts
import { extremes, innerBreaks, modelFromSolver, valueAt } from '@edubeam/plot'

// αμφιέρειστη δοκός 6 m, 20 kN στα 2 m από το A, IPE 200 χωρίς διατμητικές παραμορφώσεις
const model = modelFromSolver(solver)
const { V, M, w } = model.results!.members['1']

innerBreaks(V) // [2]: τα τμήματα συναντώνται κάτω από το φορτίο
valueAt(V, 2, 'left') // 13333.3 N, ακριβώς πριν από το φορτίο
valueAt(V, 2, 'right') // -6666.7 N, ακριβώς μετά
extremes(M) // max 26666.7 N·m στο x = 2
extremes(w) // max 0.018973 m στο x = 2.734
```

Η `extremes` επιστρέφει `{ max, min }`, το καθένα της μορφής `{ x, value, side }`, ή `null` για κενή λίστα. Το μέγιστο βέλος κάμψης δεν εμφανίζεται κάτω από το φορτίο: βρίσκεται στο $x = L - \sqrt{(L^2 - a^2)/3} = 2{,}734$ m και ισούται με $P\,a\,(L^2 - a^2)^{3/2}/9\sqrt{3}\,EIL = 18{,}97$ mm, όπως δίνει ο τύπος για έκκεντρο φορτίο.

Έτσι η [γεννήτρια ασκήσεων](/el/plot/exercises#the-generator) βρίσκει τις ακραίες ροπές για τις λύσεις. Τις υπόλοιπες, δηλαδή κλίσεις, ακρότατα μέσα σε τμήμα, βαθμούς και καμπύλες Bézier, τις παραθέτει η σελίδα [Συναρτήσεις](/el/plot/functions#piecewise-polynomials).

## Διανομή ως JSON {#ship-it-as-json}

Αρκεί ένα `JSON.stringify(model)`, και το `JSON.parse` επιστρέφει ένα μοντέλο που σχεδιάζεται ακριβώς όπως από τον επιλυτή. Ένα αμφιαρθρωτό πλαίσιο με γραμμικό και συγκεντρωμένο φορτίο καταλαμβάνει λιγότερο από 2 kB. Δείτε την [Ενσωμάτωση](/el/plot/embedding#ship-the-drawing-not-the-solver). Ένα μοντέλο τροφοδοτεί επίσης τη [`structureSvg`](/el/plot/functions#a-standalone-svg-file), η οποία το γράφει ως αρχείο SVG.
