---
title: StructurePlot
description: "Disegna con StructurePlot una trave, un telaio o una travatura piana: livelli, figure progressive, reazioni incognite per esercizi, miniature, dimensioni, unità e lettura dei valori."
order: 2
group: Componenti
source: site
---

# StructurePlot

`StructurePlot` disegna un’intera struttura adattata alla larghezza del suo contenitore: aste, cerniere, vincoli, carichi, reazioni, diagrammi di N, V e M e deformata. Passagli un solutore, oppure il [modello semplice](/it/plot/model) ricavato da uno, e indica che cosa disegnare.

```vue
<StructurePlot :solver="solver" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

Ogni prop, con il suo tipo e il valore predefinito, è nell’[API dei componenti](/it/plot/components#structureplot).

Questa figura è uno `StructurePlot` con `nodeLabels` e `dimensions` attivi, `hover` impostato e il formato numerico di questo sito, con quattro cifre significative: passa da un risultato all’altro e porta il puntatore su un’asta per leggerne i valori.

::model-figure{caption="Un telaio a portale: cerniere al piede, 10 kN/m sulla trave, 15 kN in B"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: pin, D: pin }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
  - { node: B, fx: 15 }
results: [M, V, N, w]
show: [nodeLabels, dimensions]
---
::

## Livelli {#layers}

Una figura è composta da livelli, disegnati in un ordine fisso, qualunque sia l’ordine in cui li elenchi:

| Livello | Disegna |
| --- | --- |
| `members` | le aste, con le cerniere come piccoli cerchi |
| `supports` | un simbolo per ogni vincolo, ruotato per quelli inclinati |
| `loads` | carichi nodali e sulle aste, carichi termici e cedimenti, con i loro valori |
| `reactions` | le reazioni, come frecce e frecce curve con i loro valori; oppure, con `reactionLabels: 'names'`, come [incognite con nome](#reactions-as-unknowns) di un esercizio |
| `nodes` | ogni nodo come un piccolo cerchio |
| `nodeLabels` | le etichette dei nodi |
| `dimensions` | quote in serie, come le riporta il testo di un esercizio: ogni tratto tra nodi e carichi concentrati sotto la struttura, ogni piano alla sua destra e la dimensione complessiva su una seconda linea |
| `N`, `V`, `M` | i diagrammi dello sforzo normale, del taglio e del momento flettente |
| `w` | la deformata |

Se ometti `layers`, la figura disegna aste, vincoli, carichi e reazioni, più un risultato scelto in base alla struttura: `M` per travi e telai, `N` per una travatura reticolare e `w` quando nulla è sollecitato, come in una trave libera di dilatarsi sotto un carico termico.

I diagrammi seguono l’app EduBeam: N e V sono tratteggiati trasversalmente all’asta, e M sta dal lato teso, quindi un momento positivo (fibre inferiori tese) compare sotto la trave. `:moment-on-tension-side="false"` disegna invece M dal lato compresso. In una travatura reticolare lo sforzo di ogni asta compare una sola volta, lungo l’asta, colorato in base al segno.

## Figure progressive {#figures-that-build-up}

`reserve` elenca i livelli per cui lasciare spazio mentre sono nascosti. La figura impagina fin dall’inizio ogni livello riservato, così quando uno viene attivato compare in dissolvenza al suo posto e nient’altro si sposta:

```vue
<script setup lang="ts">
import type { PlotLayer } from '@edubeam/plot'

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'],
  ['nodeLabels', 'members', 'supports'],
  ['nodeLabels', 'members', 'supports', 'loads'],
  ['members', 'supports', 'loads', 'reactions'],
  ['members', 'supports', 'reactions', 'M'],
]
const all = [...new Set(stages.flat())]
// `frame` è un solutore risolto e `step` la fase corrente: il componente completo è in Slide e dispense
</script>

<template>
  <StructurePlot :solver="frame" :layers="stages[step]" :reserve="all" />
</template>
```

Con `animate`, attivo per impostazione predefinita, i livelli compaiono in dissolvenza e le aste si disegnano da un’estremità all’altra. Con `prefers-reduced-motion` non c’è alcuna animazione. [Slide e dispense](/it/plot/slides) porta questa figura in una presentazione.

## Valori sui diagrammi {#diagram-values}

Ogni valore è scritto appena oltre l’estremità dell’ordinata a cui appartiene, come nei diagrammi dei libri di testo: ogni estremità di asta con valore non nullo, gli estremi intermedi, entrambi i valori in corrispondenza di un salto, e una sola volta in un nodo d’angolo rigido. I valori sono numeri senza unità, espressi nell’unità di visualizzazione (kN per N e V, kNm per M), e così anche le reazioni, come nell’app EduBeam; le unità si scrivono solo con i dati assegnati: carichi, cedimenti e variazioni termiche. Un’etichetta che si sovrapporrebbe a un’altra etichetta, a un’asta o a una freccia prova altre posizioni presso la stessa estremità e, se nessuna è libera, viene omessa: così due numeri non finiscono mai uno sopra l’altro. I valori di carichi e reazioni vengono collocati per primi, quindi i numeri di un diagramma non li spostano mai. Gli sforzi nelle aste di una travatura non vengono mai omessi: scorrono lungo l’asta, cambiano lato e, in ultima istanza, rimpiccioliscono.

`result-label-mode="axis"` orienta i valori lungo le loro ordinate, come li scrive l’app EduBeam. Se il lettore può passare da una modalità all’altra, imposta `:reserve-label-modes="['horizontal', 'axis']"` così il disegno non si sposta quando lo fa.

## Reazioni come incognite {#reactions-as-unknowns}

Il testo di un esercizio chiede le reazioni, quindi deve mostrarle senza i loro valori. `reaction-labels="names"` disegna una freccia per ogni direzione bloccata da un vincolo, orientata nel verso considerato positivo: lungo l’asse x del nodo (verso destra, se il vincolo non è ruotato), verso l’alto, e in senso antiorario per un momento d’incastro. Ciascuna prende il nome dal suo nodo, *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>*, in corsivo e con un vero pedice. Il segno di ogni risposta è così definito sul disegno: una reazione che agisce nel verso opposto è negativa.

```vue
<StructurePlot
  :model="model"
  :layers="['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']"
  reaction-labels="names"
/>
```

![In alto, una trave incastrata-appoggiata come testo di esercizio: incastro in A, carrello in B, 40 kN in mezzeria, quote in serie di 3 m e 3 m con 6 m complessivi, e le reazioni disegnate come frecce con nome A_x, A_z, M_A e B_z. In basso, la stessa trave con le etichette predefinite delle reazioni: 27,5 e 12,5 verso l’alto, un momento d’incastro di 45 e il momento flettente da −45 all’incastro a 37,5 sotto il carico](/screenshots/it/p4-plot-reaction-names.webp){.shot-lg}

I nomi non richiedono risultati, quindi anche un modello non risolto può essere disegnato come testo di un esercizio. Lascia `reactionLabels` a `'values'` per le soluzioni. Nomi e valori occupano spazi diversi (una reazione orizzontale nulla ha un nome nel testo ma nessuna freccia nella soluzione), quindi una figura che passa dagli uni agli altri dovrebbe lasciare spazio a entrambi con `:reserve-reaction-labels="['names', 'values']"`: il disegno resta fermo e cambiano solo le etichette. Il riquadro dell’esercizio in [Esercizi e compiti](/it/plot/exercises#the-exercise-in-a-page) passa dagli uni agli altri con una prop `answers`, come fanno gli [Esercizi di statica](/it/practice) di questo sito quando lo studente chiede la soluzione.

## Miniature {#thumbnails}

`compact` disegna per riquadri di circa 400 × 200 px: simboli più piccoli e testo da 11,5 px, al massimo due valori per asta e carichi distribuiti indicati solo dalla loro intensità, senza `q =`.

```vue
<StructurePlot v-for="t in tiles" :key="t.title" :solver="t.solver" compact :height="200" :title="t.title" />
```

La [galleria degli esempi](/it/examples/) di questo sito è disegnata così.

## Dimensioni {#size}

La figura misura il suo contenitore e si impagina su quella larghezza, in pixel reali. Senza `height` l’altezza segue il disegno, fino a `maxHeight`, che per impostazione predefinita vale $\max(320;\ 0{,}75 \times \text{larghezza})$. Prima di poter misurare, ad esempio sul server, usa `width`, 640 px per impostazione predefinita.

| Prop | Predefinito | Imposta |
| --- | --- | --- |
| `width` | 640, compact 400 | la larghezza di impaginazione finché il contenitore non è misurato, px |
| `height` | segue il disegno | un’altezza fissa, px |
| `maxHeight` | $\max(320, 0.75w)$, compact nessuno | il limite superiore dell’altezza automatica |
| `padding` | 6 | spazio attorno al disegno, px |
| `fontSize` | 13, compact 11.5 | dimensione del testo, px |
| `diagramSize` | 48, compact 26 | la lunghezza dell’ordinata maggiore, px |
| `deformedSize` | 30, compact 18 | lo spostamento massimo della deformata, px |

### Più figure alla stessa scala {#several-plots-at-one-scale}

Ogni figura scala i diagrammi sul proprio valore massimo, quindi un momento di 20 kNm sembra grande quanto uno di 80 kNm. Per confrontarli, fissa la scala in pixel per unità SI con `diagramScale`:

```vue
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams' // da Per iniziare: (luce in m, q in kN/m) => un solutore risolto

const spans = [4, 6, 8].map((L) => ({ L, solver: simpleBeam(L, 10) }))
// 0.5 px per kNm (0.5e-3 px per N·m): gli 80 kNm della campata di 8 m sono alti 40 px, i 20 kNm di quella di 4 m 10 px
const scale = { M: 0.5e-3 }
</script>

<template>
  <figure v-for="s in spans" :key="s.L">
    <StructurePlot :solver="s.solver" :layers="['members', 'supports', 'M']" :diagram-scale="scale" />
    <figcaption>L = {{ s.L }} m</figcaption>
  </figure>
</template>
```

## Unità e numeri {#units-and-numbers}

All’interno i valori sono in SI e vengono convertiti solo per la visualizzazione: per impostazione predefinita kN, kNm, kN/m, m, mm, mrad e K. Puoi sostituire qualsiasi unità con un simbolo e una scala, dove valore visualizzato = valore SI × scala:

```vue
<StructurePlot :solver="solver" :units="{ force: { symbol: 'N', scale: 1 } }" />
```

I numeri passano per un `Intl.NumberFormat`, per impostazione predefinita inglese con al massimo un decimale. Passane uno tuo per adattarli alla lingua della pagina:

```vue
<StructurePlot :solver="solver" :number-format="new Intl.NumberFormat('cs', { maximumFractionDigits: 2 })" />
```

I segni meno sono veri segni meno (−) e un valore che si arrotonda a zero non compare mai come −0. I nomi delle unità sono `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` e `temperature`; `KN_UNITS` e `SI_UNITS` sono esportati come punto di partenza.

## Lettura dei valori {#reading-values}

Con `hover`, la figura legge i risultati visualizzati nel punto dell’asta sotto il puntatore. Segna ogni valore dove è disegnato, con un punto all’estremità dell’ordinata di ogni diagramma visibile (entrambe le estremità in corrispondenza di un salto) o sulla deformata, e li elenca in un’etichetta, ad esempio `M = 54 kNm`, oppure i due lati di un salto, `V = 13.3 → −6.7 kN`. Il puntatore aggancia un’asta da qualsiasi punto del suo diagramma, non solo sull’asta stessa. La figura emette anche i valori come dati:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { StructurePlot, type Readout } from '@edubeam/plot'
import { portalFrame } from './frame' // da Slide e dispense: () => un solutore risolto

const frame = portalFrame()
const reading = ref<Readout | null>(null)
</script>

<template>
  <StructurePlot :solver="frame" :layers="['members', 'supports', 'M']" hover @readout="reading = $event" />
  <p v-if="reading">
    Member {{ reading.member }}, {{ reading.x.toFixed(2) }} m from its start:
    M = {{ (reading.values.M.left / 1e3).toFixed(1) }} kNm
  </p>
</template>
```

Una lettura è `{ member, x, px, py, values, u }`: l’asta, la posizione lungo di essa in metri, il punto sullo schermo in px, `{ left, right }` per ciascuno di `N`, `V`, `M` e `w` in unità SI, e lo spostamento assiale `u`. Vale `null` quando il puntatore esce dalla figura. Le figure interattive di questo sito usano `hover`: passaci sopra il puntatore.

Senza `hover`, una figura non registra alcun listener di eventi, quindi la pagina scorre sopra di essa e un tocco su una figura all’interno di un link apre il link. Con `hover`, la figura ascolta solo gli eventi del puntatore e lascia funzionare lo scorrimento verticale e lo zoom con due dita sugli schermi touch.

## Accessibilità {#accessibility}

Ogni figura è un `<svg role="img">` il cui nome è dato dalla prop `title` o da una descrizione di ciò che mostra, ad esempio «Structure with its loads, reactions, bending moment» (il testo predefinito della libreria è in inglese). I livelli riservati nascosti sono `aria-hidden`.
