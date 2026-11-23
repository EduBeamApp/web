---
title: Ενσωμάτωση
description: "Σχήματα του @edubeam/plot σε εφαρμογή Vite, σε σημειώσεις με VitePress ή σε ιστότοπο Nuxt, απόδοση στον διακομιστή, προεπιλυμένα μοντέλα σε JSON και απλά αρχεία SVG."
order: 7
source: site
---

# Ενσωμάτωση

Τα components είναι απλή Vue 3, οπότε λειτουργούν όπου λειτουργεί η Vue και αποδίδονται τόσο στον διακομιστή όσο και στον browser. Τίποτα δεν αγγίζει το `window` πριν προσαρτηθεί ένα σχήμα και κάθε σχήμα παίρνει τα δικά του αναγνωριστικά, οπότε σε μία σελίδα μπορούν να συνυπάρχουν όσα θέλετε. Διαλέξτε τη δική σας περίπτωση:

| Έχετε | Κάντε το εξής |
| --- | --- |
| Εφαρμογή Vue με Vite | Εγκατάσταση, import, τέλος: [Εφαρμογή Vite](#a-vite-app) |
| Σημειώσεις μαθήματος σε Markdown | Καταχωρίστε το plugin μία φορά στο VitePress: [Σημειώσεις μαθήματος με VitePress](#vitepress-course-notes) |
| Ιστότοπο Nuxt | Κάντε import τα components ή προσθέστε ένα plugin: [Nuxt](#nuxt) |
| Σελίδα που μόνο δείχνει σχήματα | Επιλύστε κατά το build και διανείμετε JSON: [Διανείμετε το σχέδιο](#ship-the-drawing-not-the-solver) |
| Καθόλου Vue | Γράψτε το SVG σε Node: [Χωρίς Vue](#plain-html-from-node) |

## Εφαρμογή Vite {#a-vite-app}

```bash
npm create vue@latest
npm install @edubeam/plot @edubeam/fem
```

Κάντε import τα components εκεί όπου τα χρησιμοποιείτε, όπως στα [Πρώτα βήματα](/el/plot/getting-started#draw-a-solved-model), ή καταχωρίστε και τα δύο μία φορά με `app.use(EduBeamPlot)`. Δεν χρειάζεται καμία άλλη ρύθμιση: ούτε φύλλο στυλ ούτε plugin για τον bundler.

## Σημειώσεις μαθήματος με VitePress {#vitepress-course-notes}

Το [VitePress](https://vitepress.dev) φτιάχνει σελίδες από Markdown με τη Vue, γι' αυτό ταιριάζει καλά σε σημειώσεις μαθήματος. Καταχωρίστε τα components στο θέμα, `.vitepress/theme/index.ts`:

```ts [.vitepress/theme/index.ts]
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { EduBeamPlot } from '@edubeam/plot'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(EduBeamPlot) // <StructurePlot> και <DiagramStack> σε κάθε σελίδα
  },
} satisfies Theme
```

Έπειτα δημιουργήστε και σχεδιάστε ένα μοντέλο απευθείας στη σελίδα, δίπλα στο `frame.ts`:

```md [portal-frame.md]
<script setup lang="ts">
import { portalFrame } from './frame' // () => ένας επιλυμένος LinearStaticSolver

const frame = portalFrame()
</script>

# Portal frame

The bending moment under the design loads:

<StructurePlot :solver="frame" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

Το `vitepress build` επιλύει το πλαίσιο και γράφει το τελικό SVG μέσα στο HTML της σελίδας, μαζί με τις ετικέτες. Στον browser τη σελίδα αναλαμβάνει η Vue και το σχήμα προσαρμόζεται στο πλάτος της στήλης. Το `frame.ts` βρίσκεται στη σελίδα [Διαφάνειες και σημειώσεις](/el/plot/slides#a-figure-that-builds-up).

## Nuxt {#nuxt}

Και το Nuxt αποδίδει στον διακομιστή· αυτός ο ιστότοπος είναι φτιαγμένος με αυτό. Κάντε import τα components σε μια σελίδα ή σε ένα component όπως συνήθως, ή καταχωρίστε τα για όλη την εφαρμογή με ένα plugin στο `plugins/edubeam-plot.ts`:

```ts [plugins/edubeam-plot.ts]
import { EduBeamPlot } from '@edubeam/plot'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(EduBeamPlot)
})
```

Στον διακομιστή δεν υπάρχει περιέκτης για να μετρηθεί, οπότε το σχήμα διατάσσεται με βάση το prop `width`: από προεπιλογή 640 px (400 px με `compact`), 720 px για το `DiagramStack`. Μόλις προσαρτηθεί, διατάσσεται ξανά στο πραγματικό του πλάτος. Αν η στήλη σας είναι πολύ στενότερη ή πλατύτερη, δώστε στο `width` μια πιο κοντινή εκτίμηση και το σχήμα δεν θα αλλάξει μέγεθος κατά τη φόρτωση της σελίδας.

## Διανείμετε το σχέδιο, όχι τον επιλυτή {#ship-the-drawing-not-the-solver}

Μια σελίδα που μόνο δείχνει ένα σχήμα δεν χρειάζεται επιλυτή. Η `modelFromSolver` μετατρέπει ένα επιλυμένο μοντέλο σε απλά δεδομένα: κόμβους, μέλη, φορτία, αντιδράσεις και, για κάθε μέλος, τα N, V, M και τις μετακινήσεις ως ακριβή πολυώνυμα. Δημιουργήστε το κατά το build, με ένα script όπως το `build-figures.ts`:

```ts [build-figures.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

writeFileSync('portal-frame.json', JSON.stringify(modelFromSolver(portalFrame())))
```

και σχεδιάστε το με το prop `model`:

```vue
<script setup lang="ts">
import { StructurePlot, type PlotModel } from '@edubeam/plot'
import frame from './portal-frame.json'
</script>

<template>
  <StructurePlot :model="frame as PlotModel" />
</template>
```

Το αμφιαρθρωτό πλαίσιο καταλαμβάνει λιγότερο από 2 kB σε JSON και σχεδιάζεται ακριβώς όπως από τον επιλυτή. Κάθε δυνατότητα λειτουργεί με ένα μοντέλο όπως και με έναν επιλυτή, και αν δώσετε και τα δύο, προτεραιότητα έχει το `model`. Η μορφή περιγράφεται στη σελίδα [Μοντέλο σχήματος](/el/plot/model).

## Χωρίς Vue {#plain-html-from-node}

Η `structureSvg` μετατρέπει ένα μοντέλο στο κείμενο ενός αρχείου SVG, με απλά χρώματα, χωρίς στυλ και scripts. Επικολλήστε το σε οποιοδήποτε HTML, σε γεννήτρια στατικών ιστότοπων, σε αρχείο Markdown ή σε CMS. Αυτό το script γράφει μια σελίδα με ένα σχήμα:

```ts [frame-html.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const svg = structureSvg(modelFromSolver(portalFrame()), { layers: ['members', 'supports', 'reactions', 'M'] })
writeFileSync('frame.html', `<!doctype html><meta charset="utf-8"><title>Portal frame</title>${svg}`)
```

Ένα τέτοιο σχήμα έχει το μέγεθος με το οποίο γράφτηκε, από προεπιλογή πλάτος 640 px (το `max-width: 100%; height: auto` του επιτρέπει να μικραίνει μαζί με τη στήλη), και δικό του λευκό φόντο· το `background: false` το αφήνει διάφανο. Δεν ακολουθεί σκοτεινό θέμα και δεν δείχνει τιμές κάτω από τον δείκτη: για αυτά, αποδώστε το component. Η [γεννήτρια διαγωνισμάτων](/el/plot/exercises#print-a-test) τυπώνει έτσι ολόκληρο διαγώνισμα, ενώ όλες οι επιλογές περιγράφονται στην ενότητα [Αυτόνομο αρχείο SVG](/el/plot/functions#a-standalone-svg-file).
