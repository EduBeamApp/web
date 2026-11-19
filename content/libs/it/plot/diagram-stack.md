---
title: DiagramStack
description: "Disegna con DiagramStack una trave sopra i diagrammi V(x), M(x) e w(x) su un unico asse x, leggi ogni riga con un cursore e lascia trascinare un carico concentrato."
order: 3
source: site
---

# DiagramStack

`DiagramStack` disegna la figura di ogni libro di statica: una trave rettilinea con i suoi vincoli, carichi e reazioni e, sotto, sullo stesso asse x, il taglio V(x), il momento flettente M(x) e la freccia w(x). Un cursore legge tutte le righe insieme, e un carico concentrato opzionale può essere trascinato lungo la trave.

```vue
<DiagramStack :solver="solver" />
```

![DiagramStack: una trave appoggiata di 6 m con un carico di 20 kN che il lettore può trascinare, qui a 4,3 m dall’appoggio sinistro; reazioni di 5,7 kN e 14,3 kN, il taglio che salta da 5,7 kN a −14,3 kN sotto il carico, il momento flettente che lì raggiunge il massimo di 24,4 kNm e la freccia con il valore massimo di 17 mm](/screenshots/it/p2p-plot-diagram-stack.webp){.shot-lg}

Le aste devono formare un’unica linea orizzontale, disegnata da sinistra a destra. Qualsiasi altra configurazione, una linea inclinata o spezzata o un’asta disegnata da destra a sinistra, viene rifiutata con un errore anziché disegnata in modo sbagliato, perché l’asse x della figura è quello della trave. Ogni prop è nell’[API dei componenti](/it/plot/components#diagramstack).

## Righe {#rows}

| Prop | Predefinito | Imposta |
| --- | --- | --- |
| `rows` | `['V', 'M', 'w']` | i diagrammi, dall’alto verso il basso; è disponibile anche `'N'` |
| `loadRow` | `true` | la trave con vincoli, carichi e reazioni sopra le righe |
| `members` | tutte le aste | le aste della linea della trave, se il modello ne ha altre |
| `rowHeights` | N 100, V 116, M 128, w 76 px | altezze delle righe; un po’ minori sotto i 560 px di larghezza |
| `maxHeight` | nessuno | le righe si riducono, fino al 60 % al massimo, perché la figura ci stia; il testo mantiene la sua dimensione |
| `ranges` | quello di ogni riga | intervalli di valori fissi per riga, in unità SI |

V e N sono disegnati positivi verso l’alto, M e w positivi verso il basso, come nella maggior parte dei libri di testo: un momento positivo (fibre inferiori tese) e una freccia verso il basso stanno sotto l’asse. Ogni riga riporta i suoi valori estremi.

## Il cursore di lettura {#the-reading-cursor}

`hover` è attivo per impostazione predefinita. Muovendo il puntatore sulla figura compare un cursore verticale che attraversa tutte le righe, con il valore di ciascuna in un’etichetta. Entro 8 px da un salto, in corrispondenza di un carico concentrato o di un vincolo, il cursore vi si aggancia e V mostra entrambi i lati, come `5.7 → −14.3 kN` sotto il carico della figura qui sopra. I valori vengono anche emessi:

```vue
<DiagramStack :solver="solver" @readout="(r) => (reading = r)" />
```

Una lettura è `{ x, values }`: `x` in metri lungo la trave e `{ left, right }` per ogni riga in unità SI; vale `null` quando il puntatore esce dalla figura.

## Un carico che il lettore può trascinare {#a-load-the-reader-can-drag}

Passa a `v-model:load-at` la posizione di un carico concentrato e il carico riceve una maniglia: il lettore la trascina con il puntatore, oppure le dà il focus e usa i tasti freccia. Il componente si limita a comunicare la nuova posizione. Risolvi di nuovo la trave con il carico in quel punto e ripassa il nuovo solutore, come fa `MovingLoad.vue`:

```vue [MovingLoad.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { beamLine, DiagramStack, lineDiagram, modelFromSolver, rowRange, type StackRow } from '@edubeam/plot'

const L = 6 // m
const P = 20e3 // N

/** La trave con il carico concentrato a `at` metri da A, risolta. */
const solveWithLoadAt = (at: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamConcentratedLoad(1, [0, P, 0, at], true)
  solver.solve()
  return solver
}

/** L’intervallo di ogni riga su tutte le posizioni del carico, così i diagrammi crescono e calano invece di riscalarsi. */
const rows: StackRow[] = ['V', 'M', 'w']
const envelope = (() => {
  const ranges: Partial<Record<StackRow, [number, number]>> = {}
  for (let at = 0.25; at < L; at += 0.25) {
    const model = modelFromSolver(solveWithLoadAt(at))
    const line = beamLine(model)
    for (const row of rows) {
      const [lo, hi] = rowRange(lineDiagram(model, line, row))
      const [min, max] = ranges[row] ?? [0, 0]
      ranges[row] = [Math.min(min, lo), Math.max(max, hi)]
    }
  }
  return ranges
})()

const at = ref(2)
const solver = computed(() => solveWithLoadAt(at.value))
</script>

<template>
  <DiagramStack v-model:load-at="at" :solver="solver" :rows="rows" :ranges="envelope" load-label="P = 20 kN" />
  <p>The load is {{ at.toFixed(2) }} m from A.</p>
</template>
```

Con il carico a 4,3 m, la figura mostra le reazioni di 5,7 kN e 14,3 kN, il salto del taglio da 5,7 a −14,3 kN sotto il carico e lì $M = 5{,}67 \cdot 4{,}3 = 24{,}4$ kNm. Senza `ranges`, ogni riga si riscalerebbe sui propri estremi mentre il carico si sposta, e i diagrammi sembrerebbero non cambiare affatto.

| Prop | Predefinito | Imposta |
| --- | --- | --- |
| `loadAt` | nessuno | la posizione del carico, in m dall’inizio della linea; con `v-model:load-at` |
| `loadLabel` | `P = …` | il testo accanto alla maniglia |
| `loadStep` | 0.05 | il passo a cui si arrotonda il trascinamento, m; i tasti freccia spostano il carico di questo passo |

La maniglia è un elemento `role="slider"` che può ricevere il focus, con il suo intervallo e la sua posizione per gli screen reader. I tasti freccia la spostano di `loadStep`, Pag ↑ e Pag ↓ di 1 m, Home e Fine la portano alle estremità della trave. Sugli schermi touch si trascina con un dito, e lo scorrimento verticale sopra la figura continua a funzionare.

La maniglia rappresenta la forza concentrata che il modello risolto ha in `loadAt`: quella forza è disegnata come maniglia, con la sua intensità come etichetta a meno che tu non indichi `loadLabel`. Inserisci il carico nel modello nella stessa posizione, come fa `solveWithLoadAt`.

## Dimensioni e rendering lato server {#size-and-server-rendering}

La figura misura il suo contenitore e si impagina su quella larghezza, almeno 320 px. Prima di poter misurare usa `width`, 720 px per impostazione predefinita. Il testo è di 12,5 px (`fontSize`) e non si rimpicciolisce mai insieme alla figura.
