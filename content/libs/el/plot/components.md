---
title: API των components
description: "Όλα τα props και τα συμβάντα των StructurePlot και DiagramStack στο @edubeam/plot 0.2.0, με τύπους και προεπιλογές, το plugin EduBeamPlot και οι εξαγόμενοι τύποι."
order: 8
group: Τεκμηρίωση API
source: site
---

# API των components

Τα props και τα συμβάντα των δύο components, όπως τα δηλώνει το @edubeam/plot 0.2.0. Κανένα από τα δύο δεν έχει slots. Οι τιμές σε μονάδες SI σημειώνονται ως τέτοιες· τα μεγέθη είναι σε pixel CSS.

## StructurePlot {#structureplot}

```ts
import { StructurePlot } from '@edubeam/plot'
```

Σχεδιάζει έναν επίπεδο φορέα και τα αποτελέσματά του. Οδηγός: [StructurePlot](/el/plot/structure-plot).

### Props {#props}

| Prop | Τύπος | Προεπιλογή | Περιγραφή |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Ένας επιλυτής του @edubeam/fem. Τα αποτελέσματα σχεδιάζονται μόλις επιλυθεί η περίπτωση φόρτισής του. |
| `model` | `PlotModel` | – | Ή τα απλά δεδομένα που παράγει η [`modelFromSolver`](/el/plot/model). Έχει προτεραιότητα έναντι του `solver`. |
| `loadCase` | `number` | `0` | Δείκτης στο `solver.loadCases` |
| `revision` | `number` | `0` | Αλλάξτε τον για να ξανασχεδιαστεί ένας επιλυτής που άλλαξε επί τόπου |
| `layers` | `readonly PlotLayer[]` | μέλη, στηρίξεις, φορτία, αντιδράσεις και ένα αποτέλεσμα | Τι θα σχεδιαστεί: `'nodes'`, `'nodeLabels'`, `'dimensions'`, `'members'`, `'supports'`, `'loads'`, `'reactions'`, `'N'`, `'V'`, `'M'`, `'w'` |
| `reserve` | `readonly PlotLayer[]` | `layers` | Επίπεδα για τα οποία κρατιέται χώρος ενώ είναι κρυφά |
| `compact` | `boolean` | `false` | Σχεδίαση μικρογραφίας: μικρότερα σύμβολα, το πολύ δύο τιμές ανά μέλος |
| `units` | `Partial<Units>` | `KN_UNITS` | Μονάδες εμφάνισης |
| `numberFormat` | `Intl.NumberFormat` | αγγλικά, το πολύ 1 δεκαδικό | Μορφοποιεί κάθε αριθμό |
| `colors` | `Partial<PlotColors>` | – | Δικά σας χρώματα ανά τόνο: [Θέματα και χρώματα](/el/plot/theming#the-colors-prop) |
| `width` | `number` | `640`, compact `400` | Πλάτος πριν μετρηθεί ο περιέκτης, όπως στον διακομιστή |
| `height` | `number` | – | Σταθερό ύψος. Χωρίς αυτό, το ύψος προκύπτει από το σχέδιο. |
| `maxHeight` | `number` | `max(320, 0.75 × width)`, compact κανένα | Ανώτατο όριο του αυτόματου ύψους |
| `padding` | `number` | `6` | Κενό γύρω από το σχέδιο |
| `fontSize` | `number` | `13`, compact `11.5` | Μέγεθος κειμένου |
| `diagramSize` | `number` | `48`, compact `26` | Μήκος της μεγαλύτερης τεταγμένης διαγράμματος |
| `deformedSize` | `number` | `30`, compact `18` | Μέγιστη μετακίνηση στον παραμορφωμένο φορέα |
| `diagramScale` | `Partial<Record<ResultLayer, number>>` | – | Σταθερά px ανά μονάδα SI για ένα αποτέλεσμα· αντικαθιστά το `diagramSize` ή το `deformedSize` |
| `momentOnTensionSide` | `boolean` | `true` | Το M στην εφελκυόμενη πλευρά· `false` για τη θλιβόμενη πλευρά |
| `resultLabelMode` | `'horizontal' \| 'axis'` | `'horizontal'` | Τιμές γραμμένες οριζόντια ή περιστραμμένες κατά τη διεύθυνση της τεταγμένης τους |
| `reactionLabels` | `'values' \| 'names'` | `'values'` | Οι αντιδράσεις όπως δρουν, με το μέγεθός τους· ή, για άσκηση, κάθε δεσμευμένη διεύθυνση με όνομα (*A<sub>x</sub>*, *M<sub>A</sub>*) και βέλος προς τη θετική φορά. Τα ονόματα δεν χρειάζονται αποτελέσματα: [Αντιδράσεις ως άγνωστοι](/el/plot/structure-plot#reactions-as-unknowns) |
| `reserveLabelModes` | `readonly ResultLabelMode[]` | – | Τρόποι ετικετών για τους οποίους κρατιέται χώρος εκτός από τον τρέχοντα |
| `reserveReactionLabels` | `readonly ReactionLabels[]` | – | Στυλ ετικετών αντιδράσεων για τα οποία κρατιέται χώρος εκτός από το `reactionLabels`, ώστε μια άσκηση που γίνεται λύση να μη μετακινεί το σχέδιό της |
| `animate` | `boolean` | `true` | Σταδιακή εμφάνιση των επιπέδων και σχεδίαση των μελών. Πάντα ανενεργό με `prefers-reduced-motion`. |
| `hover` | `boolean` | `false` | Ανάγνωση τιμών κάτω από τον δείκτη, σημειωμένων στην άκρη της τεταγμένης κάθε διαγράμματος. Όταν είναι ανενεργό, το σχήμα δεν δέχεται καθόλου είσοδο από τον δείκτη. |
| `title` | `string` | περιγραφή του περιεχομένου | Προσβάσιμο όνομα (accessible name) του σχήματος |

Χωρίς `layers`, το αποτέλεσμα είναι `M` για δοκούς και πλαίσια, `N` για δικτύωμα και `w` όταν τίποτα δεν φέρει δύναμη (`defaultResultLayer`).

### Συμβάντα {#events}

| Συμβάν | Δεδομένα | Πότε |
| --- | --- | --- |
| `readout` | `Readout \| null` | Με `hover`: το σημείο του μέλους κάτω από τον δείκτη και τα αποτελέσματά του· `null` όταν ο δείκτης φύγει |

```ts
interface Readout {
  readonly member: string
  readonly x: number // m από τον αρχικό κόμβο του μέλους
  readonly px: number // το σημείο στην οθόνη, px
  readonly py: number
  readonly values: Readonly<Record<'N' | 'V' | 'M' | 'w', SidedValue>> // μονάδες SI
  readonly u: number // μετακίνηση κατά τον τοπικό άξονα x του μέλους, m
}
interface SidedValue {
  readonly left: number
  readonly right: number // ίσο με left όπου το αποτέλεσμα είναι συνεχές
}
```

## DiagramStack {#diagramstack}

```ts
import { DiagramStack } from '@edubeam/plot'
```

Σχεδιάζει μια ευθύγραμμη δοκό πάνω από τα διαγράμματά της σε κοινό άξονα x. Τα μέλη πρέπει να σχηματίζουν μία οριζόντια γραμμή, ορισμένη από αριστερά προς τα δεξιά· σε κάθε άλλη περίπτωση προκαλείται σφάλμα. Οδηγός: [DiagramStack](/el/plot/diagram-stack).

### Props {#props-1}

| Prop | Τύπος | Προεπιλογή | Περιγραφή |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Η επιλυμένη δοκός |
| `model` | `PlotModel` | – | Ή απλά δεδομένα από τη `modelFromSolver`· έχει προτεραιότητα |
| `loadCase` | `number` | `0` | Δείκτης στο `solver.loadCases` |
| `revision` | `number` | `0` | Αλλάξτε τον για να ξανασχεδιαστεί ένας επιλυτής που άλλαξε επί τόπου |
| `members` | `readonly string[]` | όλα τα μέλη | Τα μέλη της γραμμής της δοκού |
| `rows` | `readonly StackRow[]` | `['V', 'M', 'w']` | Γραμμές διαγραμμάτων, από πάνω προς τα κάτω, από τα `'N'`, `'V'`, `'M'`, `'w'` |
| `loadRow` | `boolean` | `true` | Η δοκός με τις στηρίξεις, τα φορτία και τις αντιδράσεις πάνω από τις γραμμές |
| `ranges` | `Partial<Record<StackRow, readonly [number, number]>>` | το εύρος κάθε γραμμής | Εύρος τιμών ανά γραμμή, μονάδες SI |
| `rowHeights` | `Partial<Record<StackRow, number>>` | N 100, V 116, M 128, w 76· σε πλάτος κάτω από 560 px 88, 96, 104, 64 | Ύψη γραμμών πριν τα μικρύνει το `maxHeight` |
| `maxHeight` | `number` | – | Οι γραμμές μικραίνουν, έως το 60 % το πολύ, ώστε να χωρέσει το σχήμα. Το κείμενο κρατά το μέγεθός του. |
| `units` | `Partial<Units>` | `KN_UNITS` | Μονάδες εμφάνισης |
| `numberFormat` | `Intl.NumberFormat` | αγγλικά, το πολύ 1 δεκαδικό | Μορφοποιεί κάθε αριθμό |
| `colors` | `Partial<PlotColors>` | – | Δικά σας χρώματα |
| `width` | `number` | `720` | Πλάτος πριν μετρηθεί ο περιέκτης· χρησιμοποιείται τουλάχιστον 320 |
| `fontSize` | `number` | `12.5` | Μέγεθος κειμένου |
| `hover` | `boolean` | `true` | Ο δρομέας ανάγνωσης. Όταν είναι ανενεργός, το σχήμα δεν δέχεται είσοδο από τον δείκτη. |
| `loadAt` | `number` | – | Θέση (σε m κατά μήκος της γραμμής) ενός συγκεντρωμένου φορτίου που μπορεί να μετακινεί ο αναγνώστης· χρησιμοποιήστε το με `v-model:load-at` |
| `loadLabel` | `string` | `P = …` με το μέγεθος του φορτίου | Κείμενο δίπλα στο μετακινούμενο φορτίο |
| `loadStep` | `number` | `0.05` | Το βήμα σε m στο οποίο στρογγυλεύεται η μετακίνηση· κατά τόσο μετακινούν το φορτίο τα πλήκτρα βέλους |
| `title` | `string` | περιγραφή των γραμμών | Προσβάσιμο όνομα (accessible name) του σχήματος |

### Συμβάντα {#events-1}

| Συμβάν | Δεδομένα | Πότε |
| --- | --- | --- |
| `update:loadAt` | `number` | Ο αναγνώστης μετακίνησε το φορτίο: η νέα του θέση, m. Τροφοδοτεί το `v-model:load-at`. |
| `readout` | `StackReadout \| null` | Οι τιμές του δρομέα σε όλες τις γραμμές· `null` όταν ο δείκτης φύγει |

```ts
interface StackReadout {
  readonly x: number // m κατά μήκος της γραμμής της δοκού
  readonly values: Partial<Record<'N' | 'V' | 'M' | 'w', { readonly left: number; readonly right: number }>> // SI
}
```

## Το plugin {#the-plugin}

```ts
import { EduBeamPlot } from '@edubeam/plot'

app.use(EduBeamPlot) // καταχωρίζει τα <StructurePlot> και <DiagramStack> καθολικά
```

Είναι προαιρετικό: το import των components με το όνομά τους είναι ελαφρύτερο, και ο bundler αφαιρεί το plugin από ένα build που δεν το χρησιμοποιεί.

## Τύποι {#types}

Για typed wrappers γύρω από τα components, το πακέτο εξάγει τα props και τα συμβάντα τους:

```ts
import type { PlotLayer, StructurePlotProps } from '@edubeam/plot'

const figure: StructurePlotProps = { layers: ['members', 'supports', 'M'] satisfies PlotLayer[], compact: true }
```

| Τύπος | Περιγραφή |
| --- | --- |
| `StructurePlotProps`, `StructurePlotEmits` | Τα props και τα συμβάντα του `StructurePlot` |
| `DiagramStackProps`, `DiagramStackEmits` | Τα props και τα συμβάντα του `DiagramStack` |
| `Readout`, `ReadoutQuantity`, `SidedValue`, `StackReadout` | Δεδομένα συμβάντων |
| `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `StackRow` | Ονόματα επιπέδων, αποτελεσμάτων, τρόπων ετικετών, στυλ ετικετών αντιδράσεων και γραμμών |
| `Units`, `Unit`, `UnitKind` | Μονάδες εμφάνισης: `{ symbol, scale }` ανά είδος |
| `PlotColors` | Χρώματα ανά τόνο |
| `PlotModel` | Το απλό μοντέλο: [Μοντέλο σχήματος](/el/plot/model) |

Οι υπόλοιπες εξαγωγές, μεταξύ τους η `structureSvg` για αρχεία SVG και οι συναρτήσεις πίσω από τη σχεδίαση, περιγράφονται στη σελίδα [Συναρτήσεις](/el/plot/functions).
