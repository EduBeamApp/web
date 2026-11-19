---
title: API dei componenti
description: "Tutte le props e gli eventi di StructurePlot e DiagramStack in @edubeam/plot 0.2.0, con tipi e valori predefiniti, il plugin EduBeamPlot e i tipi esportati."
order: 8
group: Riferimento
source: site
---

# API dei componenti

Le props e gli eventi dei due componenti, così come sono dichiarati in @edubeam/plot 0.2.0. Nessuno dei due ha slot. I valori in unità SI sono indicati come tali; le dimensioni sono in pixel CSS.

## StructurePlot {#structureplot}

```ts
import { StructurePlot } from '@edubeam/plot'
```

Disegna una struttura piana e i suoi risultati. Guida: [StructurePlot](/it/plot/structure-plot).

### Props {#props}

| Prop | Tipo | Predefinito | Descrizione |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Un solutore di @edubeam/fem. I risultati vengono disegnati quando il suo caso di carico è risolto. |
| `model` | `PlotModel` | – | In alternativa, i dati semplici prodotti da [`modelFromSolver`](/it/plot/model). Ha la precedenza su `solver`. |
| `loadCase` | `number` | `0` | Indice in `solver.loadCases` |
| `revision` | `number` | `0` | Cambialo per ridisegnare un solutore modificato senza sostituirlo |
| `layers` | `readonly PlotLayer[]` | aste, vincoli, carichi, reazioni e un risultato | Che cosa disegnare: `'nodes'`, `'nodeLabels'`, `'dimensions'`, `'members'`, `'supports'`, `'loads'`, `'reactions'`, `'N'`, `'V'`, `'M'`, `'w'` |
| `reserve` | `readonly PlotLayer[]` | `layers` | Livelli per cui lasciare spazio mentre sono nascosti |
| `compact` | `boolean` | `false` | Disegno per miniature: simboli più piccoli, al massimo due valori per asta |
| `units` | `Partial<Units>` | `KN_UNITS` | Unità di visualizzazione |
| `numberFormat` | `Intl.NumberFormat` | inglese, al massimo 1 decimale | Formatta ogni numero |
| `colors` | `Partial<PlotColors>` | – | Colori personalizzati per tono: [Temi e colori](/it/plot/theming#the-colors-prop) |
| `width` | `number` | `640`, compact `400` | Larghezza prima che il contenitore sia misurato, ad esempio sul server |
| `height` | `number` | – | Altezza fissa. Senza, l’altezza segue il disegno. |
| `maxHeight` | `number` | `max(320, 0.75 × width)`, compact nessuno | Limite superiore dell’altezza automatica |
| `padding` | `number` | `6` | Spazio attorno al disegno |
| `fontSize` | `number` | `13`, compact `11.5` | Dimensione del testo |
| `diagramSize` | `number` | `48`, compact `26` | Lunghezza dell’ordinata maggiore di un diagramma |
| `deformedSize` | `number` | `30`, compact `18` | Spostamento massimo sulla deformata |
| `diagramScale` | `Partial<Record<ResultLayer, number>>` | – | Scala fissa in px per unità SI per un risultato; sostituisce `diagramSize` o `deformedSize` |
| `momentOnTensionSide` | `boolean` | `true` | M dal lato teso; `false` per il lato compresso |
| `resultLabelMode` | `'horizontal' \| 'axis'` | `'horizontal'` | Valori diritti, oppure ruotati lungo la loro ordinata |
| `reactionLabels` | `'values' \| 'names'` | `'values'` | Reazioni come agiscono, con il loro valore; oppure, per un esercizio, ogni direzione vincolata con il suo nome (*A<sub>x</sub>*, *M<sub>A</sub>*) e orientata nel verso considerato positivo. I nomi non richiedono risultati: [Reazioni come incognite](/it/plot/structure-plot#reactions-as-unknowns) |
| `reserveLabelModes` | `readonly ResultLabelMode[]` | – | Modalità delle etichette per cui lasciare spazio oltre a quella corrente |
| `reserveReactionLabels` | `readonly ReactionLabels[]` | – | Stili delle etichette delle reazioni per cui lasciare spazio oltre a `reactionLabels`, così un esercizio che diventa la sua soluzione mantiene fermo il disegno |
| `animate` | `boolean` | `true` | Fa comparire i livelli in dissolvenza e disegna le aste progressivamente. Sempre disattivato con `prefers-reduced-motion`. |
| `hover` | `boolean` | `false` | Legge i valori sotto il puntatore, segnati all’estremità dell’ordinata di ogni diagramma. Se è disattivato, la figura non riceve alcun input dal puntatore. |
| `title` | `string` | una descrizione di ciò che è mostrato | Nome accessibile della figura |

Senza `layers`, il risultato è `M` per travi e telai, `N` per una travatura reticolare e `w` quando nulla è sollecitato (`defaultResultLayer`).

### Eventi {#events}

| Evento | Payload | Quando |
| --- | --- | --- |
| `readout` | `Readout \| null` | Con `hover`: il punto dell’asta sotto il puntatore e i suoi risultati; `null` quando il puntatore esce |

```ts
interface Readout {
  readonly member: string
  readonly x: number // m dal nodo iniziale dell’asta
  readonly px: number // il punto sullo schermo, px
  readonly py: number
  readonly values: Readonly<Record<'N' | 'V' | 'M' | 'w', SidedValue>> // unità SI
  readonly u: number // spostamento lungo l’asse x locale dell’asta, m
}
interface SidedValue {
  readonly left: number
  readonly right: number // uguale a left dove il risultato è continuo
}
```

## DiagramStack {#diagramstack}

```ts
import { DiagramStack } from '@edubeam/plot'
```

Disegna una trave rettilinea sopra i suoi diagrammi, su un unico asse x. Le aste devono formare un’unica linea orizzontale, disegnata da sinistra a destra; in tutti gli altri casi il componente solleva un errore. Guida: [DiagramStack](/it/plot/diagram-stack).

### Props {#props-1}

| Prop | Tipo | Predefinito | Descrizione |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | La trave risolta |
| `model` | `PlotModel` | – | In alternativa, i dati semplici di `modelFromSolver`; ha la precedenza |
| `loadCase` | `number` | `0` | Indice in `solver.loadCases` |
| `revision` | `number` | `0` | Cambialo per ridisegnare un solutore modificato senza sostituirlo |
| `members` | `readonly string[]` | tutte le aste | Le aste della linea della trave |
| `rows` | `readonly StackRow[]` | `['V', 'M', 'w']` | Righe dei diagrammi, dall’alto verso il basso, tra `'N'`, `'V'`, `'M'`, `'w'` |
| `loadRow` | `boolean` | `true` | La trave con vincoli, carichi e reazioni sopra le righe |
| `ranges` | `Partial<Record<StackRow, readonly [number, number]>>` | quello di ogni riga | Intervallo di valori per riga, unità SI |
| `rowHeights` | `Partial<Record<StackRow, number>>` | N 100, V 116, M 128, w 76; sotto i 560 px di larghezza 88, 96, 104, 64 | Altezze delle righe prima che `maxHeight` le riduca |
| `maxHeight` | `number` | – | Le righe si riducono, fino al 60 % al massimo, perché la figura ci stia. Il testo mantiene la sua dimensione. |
| `units` | `Partial<Units>` | `KN_UNITS` | Unità di visualizzazione |
| `numberFormat` | `Intl.NumberFormat` | inglese, al massimo 1 decimale | Formatta ogni numero |
| `colors` | `Partial<PlotColors>` | – | Colori personalizzati |
| `width` | `number` | `720` | Larghezza prima che il contenitore sia misurato; si usano almeno 320 |
| `fontSize` | `number` | `12.5` | Dimensione del testo |
| `hover` | `boolean` | `true` | Il cursore di lettura. Se è disattivato, la figura non riceve alcun input dal puntatore. |
| `loadAt` | `number` | – | Posizione (m lungo la linea) di un carico concentrato che il lettore può trascinare; da usare con `v-model:load-at` |
| `loadLabel` | `string` | `P = …` con l’intensità del carico | Testo accanto al carico trascinabile |
| `loadStep` | `number` | `0.05` | Il passo a cui si arrotonda il trascinamento, m; i tasti freccia spostano il carico di questo passo |
| `title` | `string` | una descrizione delle righe | Nome accessibile della figura |

### Eventi {#events-1}

| Evento | Payload | Quando |
| --- | --- | --- |
| `update:loadAt` | `number` | Il lettore ha spostato il carico: la sua nuova posizione, m. Alimenta `v-model:load-at`. |
| `readout` | `StackReadout \| null` | I valori del cursore su tutte le righe; `null` quando il puntatore esce |

```ts
interface StackReadout {
  readonly x: number // m lungo la linea della trave
  readonly values: Partial<Record<'N' | 'V' | 'M' | 'w', { readonly left: number; readonly right: number }>> // SI
}
```

## Il plugin {#the-plugin}

```ts
import { EduBeamPlot } from '@edubeam/plot'

app.use(EduBeamPlot) // registra <StructurePlot> e <DiagramStack> a livello globale
```

È facoltativo: importare i componenti per nome è più leggero, e un bundler elimina il plugin da una build che non lo usa.

## Tipi {#types}

Per scrivere wrapper tipizzati attorno ai componenti, il pacchetto esporta le loro props e i loro eventi:

```ts
import type { PlotLayer, StructurePlotProps } from '@edubeam/plot'

const figure: StructurePlotProps = { layers: ['members', 'supports', 'M'] satisfies PlotLayer[], compact: true }
```

| Tipo | Che cos’è |
| --- | --- |
| `StructurePlotProps`, `StructurePlotEmits` | Le props e gli eventi di `StructurePlot` |
| `DiagramStackProps`, `DiagramStackEmits` | Le props e gli eventi di `DiagramStack` |
| `Readout`, `ReadoutQuantity`, `SidedValue`, `StackReadout` | Payload degli eventi |
| `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `StackRow` | Nomi di livelli, risultati, modalità delle etichette, etichette delle reazioni e righe |
| `Units`, `Unit`, `UnitKind` | Unità di visualizzazione: `{ symbol, scale }` per tipo di grandezza |
| `PlotColors` | Colori per tono |
| `PlotModel` | Il modello semplice: [Modello di disegno](/it/plot/model) |

Gli altri export, tra cui `structureSvg` per i file SVG e le funzioni su cui si basa il disegno, sono in [Funzioni](/it/plot/functions).
