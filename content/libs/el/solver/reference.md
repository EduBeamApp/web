---
title: Τεκμηρίωση API
description: "Κάθε κλάση, μέθοδος και όρισμα του @edubeam/fem 0.3, με μονάδες, προεπιλεγμένες τιμές και τη μορφή της τιμής που επιστρέφει καθεμία."
order: 16
group: Τεκμηρίωση API
source: site
---

# Τεκμηρίωση API {#api-reference}

Τι εξάγει το `@edubeam/fem` 0.3, ομαδοποιημένο κατά χρήση. Οι μονάδες είναι παντού SI: m, N, N·m, N/m, Pa, K και rad. Οι ετικέτες (`LabelType`) είναι `string | number` και αποθηκεύονται ως κείμενο. Οι μέθοδοι που δεν αναφέρονται εδώ είναι εσωτερικές: είναι δημόσιες στην TypeScript μόνο επειδή τις καλούν οι ίδιες οι κλάσεις του επιλυτή.

## Εξαγωγές {#exports}

| Εξαγωγή | Είδος | Ενότητα |
| --- | --- | --- |
| `LinearStaticSolver` | κλάση | [Αναλύσεις](#analyses) |
| `Solver` | αφηρημένη κλάση | [Αναλύσεις](#analyses) |
| `Domain` | κλάση | [Domain](#domain) |
| `Node` | κλάση | [Node](#node) |
| `Beam2D`, `Element` | κλάσεις | [Στοιχεία](#elements) |
| `Material`, `CrossSection` | κλάσεις | [Υλικά και διατομές](#materials-and-sections) |
| `LoadCase` | κλάση | [Φορτία](#loads) |
| `NodalLoad`, `BeamConcentratedLoad`, `BeamElementUniformEdgeLoad`, `BeamElementTrapezoidalEdgeLoad`, `BeamTemperatureLoad`, `PrescribedDisplacement`, `Load`, `BeamElementLoad` | κλάσεις | [Φορτία](#loads) |
| `DofID` | enum | [DofID](#dofid) |
| `LabelType`, `EnumDictionary`, `MaterialParameters`, `CrossSectionParameters` | τύποι | |

## Αναλύσεις {#analyses}

### `LinearStaticSolver` {#linearstaticsolver}

```ts
const solver = new LinearStaticSolver()
```

| Μέλος κλάσης | Τύπος | Περιγραφή |
| --- | --- | --- |
| `domain` | `Domain` | Το μοντέλο |
| `loadCases` | `LoadCase[]` | Ξεκινά με μία περίπτωση, `'DefaultLC'`. Προσθέστε κι άλλες με `new LoadCase(label, solver.domain)`: [Περιπτώσεις φόρτισης](/el/solver/load-cases). |
| `solve()` | `void` | Αριθμεί τις εξισώσεις αν χρειάζεται, συναρμολογεί και επιλύει κάθε περίπτωση φόρτισης. Μπορεί να προκαλέσει εξαίρεση σε [μηχανισμό](/el/solver/solving#when-solving-fails), αλλά όχι πάντα. Από την 0.3.1 δεν τυπώνει τίποτε· η 0.3.0 κατέγραφε τον χρόνο της. |
| `codeNumberGenerated` | `boolean` | Θέστε το σε `false` μετά από προσθήκη ή αφαίρεση κόμβων ή μελών ή αλλαγή στηρίξεων: [γιατί](/el/solver/solving#solving-again-after-a-change) |
| `neq`, `pneq` | `number` | Πλήθος ελεύθερων και πλήθος δεσμευμένων βαθμών ελευθερίας, μετά από επίλυση |
| `k` | mathjs `Matrix` | Το συναρμολογημένο καθολικό μητρώο στιβαρότητας, μετά από επίλυση |
| `getNodeDofIDs(label)` | `number[]` | Οι βαθμοί ελευθερίας ενός κόμβου, μετά από επίλυση |

Ο `EigenValueDynamicSolver` υπάρχει στον πηγαίο κώδικα, αλλά δεν εξάγεται.

## Domain {#domain}

Το `solver.domain` περιέχει το μοντέλο σε τέσσερα `Map` με κλειδί την ετικέτα ως κείμενο: `nodes`, `elements`, `materials`, `crossSections`. Δεν υπάρχουν μέθοδοι αφαίρεσης: τα `domain.nodes.delete(label)` και `domain.elements.delete(label)` αφαιρούν έναν κόμβο ή ένα μέλος, και στη συνέχεια χρειάζεται [νέα αρίθμηση](/el/solver/solving#solving-again-after-a-change).

| Μέθοδος | Επιστρέφει | Περιγραφή |
| --- | --- | --- |
| `createNode(label, coords?, bcs?)` | `Node` | `coords` `[x, y, z]` σε m (προεπιλογή `[0, 0, 0]`), `bcs` οι δεσμευμένοι `DofID` (προεπιλογή κανένας) |
| `createBeam2D(label, nodes, mat, cs, hinges?)` | `Beam2D` | `nodes` `[first, second]`, `hinges` `[atFirst, atSecond]` (προεπιλογή `[false, false]`) |
| `createMaterial(label, params?)` | `Material` | Δείτε [Υλικά και διατομές](#materials-and-sections) |
| `createCrossSection(label, params?)` | `CrossSection` | Δείτε [Υλικά και διατομές](#materials-and-sections) |
| `getNode(label)`, `getElement(label)`, `getMaterial(label)`, `getCS(label)` | το αντικείμενο | Προκαλεί `RangeError` για άγνωστη ετικέτα. Η `getElement` έχει τύπο `Element`: γράψτε `as Beam2D` για να διαβάσετε αποτελέσματα. |

Η δημιουργία αντικειμένου με ετικέτα που χρησιμοποιείται ήδη αντικαθιστά το παλιό.

## Node {#node}

| Μέλος κλάσης | Τύπος | Περιγραφή |
| --- | --- | --- |
| `label` | `string` | |
| `coords` | `number[]` | `[x, y, z]`, m. Αλλάξτε το για να μετακινήσετε τον κόμβο. |
| `bcs` | `Set<DofID>` | Δεσμευμένοι βαθμοί ελευθερίας. Αντικαταστήστε το για να αλλάξετε τη στήριξη. |
| `lcs` | `number[][] \| undefined` | Οι στραμμένοι άξονες του κόμβου, αν υπάρχουν |
| `updateLcs({ locx, locy }?)` | `void` | Στρέφει τους άξονες του κόμβου: `locx` ο άξονας x του σε καθολικές συνιστώσες, `locy` `[0, 1, 0]`. Χωρίς όρισμα τους επαναφέρει. |
| `hasLcs()` | `boolean` | Αν οι άξονες είναι στραμμένοι |
| `getUnknowns(lc, dofs)` | `Matrix` ή `number` για έναν βαθμό ελευθερίας | Μετακινήσεις (m) και στροφές (rad), στους άξονες του κόμβου |
| `getReactions(lc, global?)` | `{ dofs, values }` | Αντιδράσεις στους δεσμευμένους βαθμούς ελευθερίας, με τη σειρά του `bcs`: N, N·m. Το `values` είναι mathjs `Matrix` για περισσότερες, πίνακας ενός στοιχείου για μία, `[]` για ελεύθερο κόμβο. Με `global` ίσο με `true` σε στραμμένο κόμβο: και οι τρεις βαθμοί ελευθερίας στο καθολικό σύστημα, `dofs` ίσο με `[0, 2, 4]`, `values` πίνακας με 0 όπου δεν δεσμεύεται τίποτε. [Πώς διαβάζονται](/el/solver/results#reactions). |

## Στοιχεία {#elements}

### `Beam2D` {#beam2d}

Δοκός Timoshenko δύο κόμβων στο επίπεδο x–z, με τρεις βαθμούς ελευθερίας ανά κόμβο (`Dx`, `Dz`, `Ry`). Το `x` δίνεται σε μέτρα από τον πρώτο κόμβο· το `n` είναι πλήθος τμημάτων, που δίνει n + 1 σημεία.

| Μέλος κλάσης | Επιστρέφει | Περιγραφή |
| --- | --- | --- |
| `label`, `nodes`, `mat`, `cs` | `string`, `string[]`, `string`, `string` | |
| `hinges` | `[boolean, boolean]` | Απελευθερώσεις ροπής στον πρώτο και στον δεύτερο κόμβο |
| `computeNormalForceAt(lc, x)` | `number` | N, θετική ο εφελκυσμός |
| `computeShearForceAt(lc, x)` | `number` | V, θετική όπου η M αυξάνει κατά τον τοπικό x |
| `computeBendingMomentAt(lc, x)` | `number` | M, θετική με εφελκυσμό στην πλευρά του τοπικού +z |
| `computeNormalForce(lc, n)` | `{ x, N }` | N σε n + 1 σημεία |
| `computeShearForce(lc, n)` | `{ x, V }` | V σε n + 1 σημεία |
| `computeBendingMoment(lc, n)` | `{ x, M }` | M σε n + 1 σημεία |
| `computeLocalDefl(lc, n)` | `{ u, w }` | Μετακινήσεις κατά μήκος και εγκάρσια στο μέλος, τοπικό σύστημα, m |
| `computeGlobalDefl(lc, n)` | `{ u, w }` | Τα ίδια στους καθολικούς x και z |
| `computeEndForces(lc)` | `Matrix` | `[X12, Z12, M12, X21, Z21, M21]`, οι δυνάμεις που ασκούν οι κόμβοι στο μέλος, τοπικό σύστημα |
| `computeEndDisplacement(lc)` | `Matrix` | Μετακινήσεις άκρων στο τοπικό σύστημα, μαζί με τις στροφές στις αρθρώσεις |
| `computeGeo()` | `{ l, dx, dz }` | Μήκος και προβολές, m |
| `computeT()` | `Matrix` | Μητρώο μετασχηματισμού 6 × 6, από το καθολικό στο τοπικό σύστημα |
| `computeLocalStiffnessMtrx()` | `{ answer }` | `answer`: τοπικό μητρώο στιβαρότητας 6 × 6, με συμπυκνωμένες τις αρθρώσεις |
| `computeStiffness()` | `Matrix` | Καθολικό μητρώο στιβαρότητας 6 × 6 |
| `computeShearFactor()` | `number` | $\Phi = 12EI_y/kGAL^2$ |
| `getMaterial()`, `getCS()` | `Material`, `CrossSection` | |

Σε συγκεντρωμένο φορτίο, οι μέθοδοι `…At` επιστρέφουν την τιμή αμέσως μετά από αυτό. Το `Element` είναι η αφηρημένη βασική κλάση του `Beam2D`· αυτόν τον τύπο χρησιμοποιούν το `domain.elements` και η `getElement`.

## Υλικά και διατομές {#materials-and-sections}

| `MaterialParameters` | Μονάδα | Προεπιλογή | Χρήση |
| --- | --- | --- | --- |
| `e` | Pa | 1 | στιβαρότητα |
| `g` | Pa | 1 | διατμητική στιβαρότητα |
| `alpha` | 1/K | 1 | θερμοκρασιακές φορτίσεις |
| `d` | kg/m³ | 1 | δεν χρησιμοποιείται στη στατική |

| `CrossSectionParameters` | Μονάδα | Προεπιλογή | Χρήση |
| --- | --- | --- | --- |
| `a` | m² | καμία, υποχρεωτικό | αξονική και διατμητική στιβαρότητα |
| `iy` | m⁴ | καμία, υποχρεωτικό | καμπτική στιβαρότητα |
| `k` | – | καμία, υποχρεωτικό | διατμητική στιβαρότητα $kGA$· `1e32` για να μην ληφθεί υπόψη |
| `h` | m | καμία | θερμοκρασιακές διαφορές (`NaN` χωρίς αυτό) |
| `iz`, `dyz`, `j` | m⁴ | καμία | δεν χρησιμοποιούνται από το `Beam2D` |

Μια παράμετρος υλικού που λείπει έχει τιμή 1, όχι κάποια τυπική τιμή· αν λείπει το `a`, το `iy` ή το `k`, κάθε αποτέλεσμα είναι `NaN`. Σε καμία περίπτωση δεν προκαλείται σφάλμα. Και οι δύο κλάσεις έχουν μέθοδο `change(params)` που ορίζει τις δοσμένες παραμέτρους, και τις κρατούν ως ιδιότητες με τα ίδια ονόματα.

## Φορτία {#loads}

### `LoadCase` {#loadcase}

| Μέθοδος | Επιστρέφει | Τιμές |
| --- | --- | --- |
| `createNodalLoad(node, values, lcs?)` | `NodalLoad` | `{ [DofID.Dx]: N, [DofID.Dz]: N, [DofID.Ry]: N·m }`· `lcs` (προεπιλογή `false`) ίσο με `true`: στους στραμμένους άξονες του κόμβου |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | `BeamElementUniformEdgeLoad` | N/m σε όλο το μέλος |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | `BeamElementTrapezoidalEdgeLoad` | N/m στον πρώτο και στον δεύτερο κόμβο, γραμμικά ενδιάμεσα |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | `BeamConcentratedLoad` | N, N, N·m, σε απόσταση `a` m από τον πρώτο κόμβο |
| `createBeamTemperatureLoad(el, [dTc, dTb, dTt])` | `BeamTemperatureLoad` | K: κέντρο βάρους, κάτω ίνα, άνω ίνα |
| `createPrescribedDisplacement(node, values)` | `PrescribedDisplacement` | `{ [DofID.Dz]: m, … }` σε δεσμευμένους βαθμούς ελευθερίας, στους άξονες του κόμβου· αγνοείται σε ελεύθερους βαθμούς ελευθερίας |

Στα φορτία μελών, `lcs` ίσο με `true` σημαίνει τοπικό σύστημα (x κατά μήκος του μέλους, z εγκάρσια), `false` καθολικό σύστημα. Τα κατανεμημένα φορτία δίνονται ανά μέτρο μήκους του μέλους. Παραδείγματα υπάρχουν στη σελίδα [Φορτία](/el/solver/loads).

| Μέλος κλάσης | Τύπος | Περιγραφή |
| --- | --- | --- |
| `label` | `string` | |
| `nodalLoadList` | `NodalLoad[]` | |
| `elementLoadList` | `BeamElementLoad[]` | Φορτία μελών και θερμοκρασιακά φορτία |
| `prescribedBC` | `PrescribedDisplacement[]` | |
| `solved` | `boolean` | `true` μετά από επιτυχή επίλυση |
| `getElementLoadsOnElement(el)` | `BeamElementLoad[]` | Τα φορτία ενός μέλους |

Τα αντικείμενα φορτίων κρατούν τις τιμές τους σε δημόσιες ιδιότητες, τις οποίες μπορείτε να αλλάξετε πριν επιλύσετε ξανά: `values` (και `lcs`) στα `NodalLoad`, `BeamElementUniformEdgeLoad`, `BeamConcentratedLoad` και `BeamTemperatureLoad`· `startValues` και `endValues` στο `BeamElementTrapezoidalEdgeLoad`· `prescribedValues` στο `PrescribedDisplacement`. Καθένα έχει ένα `target`, την ετικέτα του αντικειμένου στο οποίο ασκείται.

## DofID {#dofid}

| Όνομα | Τιμή | Χρησιμοποιείται από το `Beam2D` |
| --- | --- | --- |
| `Dx` | 0 | ναι |
| `Dy` | 1 | όχι |
| `Dz` | 2 | ναι |
| `Rx` | 3 | όχι |
| `Ry` | 4 | ναι |
| `Rz` | 5 | όχι |

## Αποτελέσματα {#results}

Τα αποτελέσματα διαβάζονται από ένα `Beam2D` (εντατικά μεγέθη, βέλη κάμψης, δυνάμεις άκρων) και από έναν `Node` (μετακινήσεις, αντιδράσεις), πάντα για μια δεδομένη `LoadCase`, μετά την `solve()`: δείτε τους δύο παραπάνω πίνακες, και τη σελίδα [Ανάγνωση αποτελεσμάτων](/el/solver/results) για παραδείγματα και πρόσημα. Συνοπτικά:

| Για να πάρετε | Κλήση |
| --- | --- |
| Αντιδράσεις, N και N·m | `node.getReactions(lc)` |
| Μετακινήσεις, m, και στροφές, rad | `node.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])` |
| N, V ή M σε σημείο, N και N·m | `beam.computeNormalForceAt(lc, x)`, `computeShearForceAt`, `computeBendingMomentAt` |
| N, V ή M κατά μήκος μέλους | `beam.computeNormalForce(lc, n)`, `computeShearForce`, `computeBendingMoment` |
| Ελαστική γραμμή, m | `beam.computeLocalDefl(lc, n)`, `computeGlobalDefl` |
| Δυνάμεις άκρων, N και N·m | `beam.computeEndForces(lc)` |
| Σχήμα όλων των παραπάνω | `StructurePlot` ή `structureSvg` από το [@edubeam/plot](/el/solver/drawing) |
