---
title: API komponentov
description: "Všetky props a udalosti komponentov StructurePlot a DiagramStack v @edubeam/plot 0.2.0 s typmi a predvolenými hodnotami, plugin EduBeamPlot a exportované typy props."
order: 8
group: Referencia
source: site
---

# API komponentov

Props a udalosti oboch komponentov, ako sú deklarované v @edubeam/plot 0.2.0. Ani jeden z nich nemá sloty. Hodnoty v jednotkách SI sú takto označené; veľkosti sú v pixeloch CSS.

## StructurePlot {#structureplot}

```ts
import { StructurePlot } from '@edubeam/plot'
```

Vykreslí rovinnú konštrukciu a jej výsledky. Návod: [StructurePlot](/sk/plot/structure-plot).

### Props {#props}

| Prop | Typ | Predvolené | Popis |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Riešič @edubeam/fem. Výsledky sa vykreslia, len čo je jeho zaťažovací stav vypočítaný. |
| `model` | `PlotModel` | – | Alebo jednoduché dáta, ktoré vytvorí [`modelFromSolver`](/sk/plot/model). Má prednosť pred `solver`. |
| `loadCase` | `number` | `0` | Index do `solver.loadCases` |
| `revision` | `number` | `0` | Zmeňte hodnotu, ak chcete prekresliť riešič zmenený na mieste |
| `layers` | `readonly PlotLayer[]` | prvky, podpery, zaťaženie, reakcie a jeden výsledok | Čo vykresliť: `'nodes'`, `'nodeLabels'`, `'dimensions'`, `'members'`, `'supports'`, `'loads'`, `'reactions'`, `'N'`, `'V'`, `'M'`, `'w'` |
| `reserve` | `readonly PlotLayer[]` | `layers` | Vrstvy, pre ktoré sa necháva miesto, aj keď sú skryté |
| `compact` | `boolean` | `false` | Kresba pre náhľady: menšie značky, najviac dve hodnoty na prvok |
| `units` | `Partial<Units>` | `KN_UNITS` | Zobrazované jednotky |
| `numberFormat` | `Intl.NumberFormat` | anglický formát, najviac 1 desatinné miesto | Formátuje všetky čísla |
| `colors` | `Partial<PlotColors>` | – | Prepísanie farieb podľa tónu: [Motívy a farby](/sk/plot/theming#the-colors-prop) |
| `width` | `number` | `640`, compact `400` | Šírka, kým nie je kontajner zmeraný, napríklad na serveri |
| `height` | `number` | – | Pevná výška. Bez nej sa výška riadi výkresom. |
| `maxHeight` | `number` | `max(320, 0.75 × width)`, compact žiadna | Horná hranica automatickej výšky |
| `padding` | `number` | `6` | Okraj okolo výkresu |
| `fontSize` | `number` | `13`, compact `11.5` | Veľkosť textu |
| `diagramSize` | `number` | `48`, compact `26` | Dĺžka najväčšej poradnice priebehu |
| `deformedSize` | `number` | `30`, compact `18` | Najväčšie posunutie na deformovanom tvare |
| `diagramScale` | `Partial<Record<ResultLayer, number>>` | – | Pevný počet px na jednotku SI pre výsledok; prepíše `diagramSize` alebo `deformedSize` |
| `momentOnTensionSide` | `boolean` | `true` | M na ťahanej strane; `false` pre tlačenú stranu |
| `resultLabelMode` | `'horizontal' \| 'axis'` | `'horizontal'` | Hodnoty písané vodorovne alebo natočené pozdĺž poradnice |
| `reactionLabels` | `'values' \| 'names'` | `'values'` | Reakcie tak, ako pôsobia, s veľkosťou; alebo pre zadanie príkladu každý podopretý smer pomenovaný (*A<sub>x</sub>*, *M<sub>A</sub>*) a nakreslený v kladnom zmysle. Názvy nepotrebujú výsledky: [Reakcie ako neznáme](/sk/plot/structure-plot#reactions-as-unknowns) |
| `reserveLabelModes` | `readonly ResultLabelMode[]` | – | Režimy popisov, pre ktoré sa okrem aktuálneho necháva miesto |
| `reserveReactionLabels` | `readonly ReactionLabels[]` | – | Štýly popisov reakcií, pre ktoré sa okrem `reactionLabels` necháva miesto, aby sa výkres nepohol, keď sa zadanie príkladu zmení na riešenie |
| `animate` | `boolean` | `true` | Plynulé zobrazovanie vrstiev a postupné vykresľovanie prvkov. Pri `prefers-reduced-motion` vždy vypnuté. |
| `hover` | `boolean` | `false` | Odčítanie hodnôt pod ukazovateľom, vyznačených na konci poradnice každého priebehu. Keď je vypnuté, obrázok na ukazovateľ vôbec nereaguje. |
| `title` | `string` | popis toho, čo obrázok ukazuje | Prístupný názov obrázka. Predvolený popis je anglický („Structure with its …“); web alebo aplikácia ho môže nahradiť cez `PLOT_TEXTS` z `@edubeam/plot`. |

Bez `layers` je výsledkom `M` pre nosníky a rámy, `N` pre priehradovú konštrukciu a `w`, keď žiadny prvok neprenáša silu (`defaultResultLayer`).

### Udalosti {#events}

| Udalosť | Dáta | Kedy |
| --- | --- | --- |
| `readout` | `Readout \| null` | S `hover`: bod prvku pod ukazovateľom a jeho výsledky; `null`, keď ukazovateľ odíde |

```ts
interface Readout {
  readonly member: string
  readonly x: number // m od počiatočného uzla prvku
  readonly px: number // bod na obrazovke, px
  readonly py: number
  readonly values: Readonly<Record<'N' | 'V' | 'M' | 'w', SidedValue>> // jednotky SI
  readonly u: number // posunutie v smere lokálnej osi x prvku, m
}
interface SidedValue {
  readonly left: number
  readonly right: number // rovné left tam, kde je výsledok spojitý
}
```

## DiagramStack {#diagramstack}

```ts
import { DiagramStack } from '@edubeam/plot'
```

Vykreslí priamy nosník nad jeho priebehmi na spoločnej osi x. Prvky musia tvoriť jednu vodorovnú priamku zadanú zľava doprava; čokoľvek iné vyhodí chybu. Návod: [DiagramStack](/sk/plot/diagram-stack).

### Props {#props-1}

| Prop | Typ | Predvolené | Popis |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Vypočítaný nosník |
| `model` | `PlotModel` | – | Alebo jednoduché dáta z `modelFromSolver`; majú prednosť |
| `loadCase` | `number` | `0` | Index do `solver.loadCases` |
| `revision` | `number` | `0` | Zmeňte hodnotu, ak chcete prekresliť riešič zmenený na mieste |
| `members` | `readonly string[]` | všetky prvky | Prvky nosníka |
| `rows` | `readonly StackRow[]` | `['V', 'M', 'w']` | Riadky priebehov zhora nadol, z `'N'`, `'V'`, `'M'`, `'w'` |
| `loadRow` | `boolean` | `true` | Nosník s podperami, zaťažením a reakciami nad riadkami |
| `ranges` | `Partial<Record<StackRow, readonly [number, number]>>` | vlastný rozsah každého riadku | Rozsah hodnôt pre každý riadok, jednotky SI |
| `rowHeights` | `Partial<Record<StackRow, number>>` | N 100, V 116, M 128, w 76; pri šírke pod 560 px 88, 96, 104, 64 | Výšky riadkov predtým, ako ich zmenší `maxHeight` |
| `maxHeight` | `number` | – | Riadky sa zmenšia, najviac na 60 %, aby sa obrázok zmestil. Text si veľkosť zachová. |
| `units` | `Partial<Units>` | `KN_UNITS` | Zobrazované jednotky |
| `numberFormat` | `Intl.NumberFormat` | anglický formát, najviac 1 desatinné miesto | Formátuje všetky čísla |
| `colors` | `Partial<PlotColors>` | – | Prepísanie farieb |
| `width` | `number` | `720` | Šírka, kým nie je kontajner zmeraný; použije sa najmenej 320 |
| `fontSize` | `number` | `12.5` | Veľkosť textu |
| `hover` | `boolean` | `true` | Kurzor na odčítanie. Keď je vypnutý, obrázok na ukazovateľ nereaguje. |
| `loadAt` | `number` | – | Poloha (m pozdĺž priamky) osamelej sily, ktorú môže čitateľ posúvať; používa sa s `v-model:load-at` |
| `loadLabel` | `string` | `P = …` s veľkosťou sily | Text vedľa posuvnej sily |
| `loadStep` | `number` | `0.05` | Krok, na ktorý sa ťahanie zaokrúhľuje, m; o tento krok posúvajú silu šípky |
| `title` | `string` | popis riadkov | Prístupný názov obrázka |

### Udalosti {#events-1}

| Udalosť | Dáta | Kedy |
| --- | --- | --- |
| `update:loadAt` | `number` | Čitateľ posunul silu: jej nová poloha, m. Používa ju `v-model:load-at`. |
| `readout` | `StackReadout \| null` | Hodnoty kurzora vo všetkých riadkoch; `null`, keď ukazovateľ odíde |

```ts
interface StackReadout {
  readonly x: number // m pozdĺž nosníka
  readonly values: Partial<Record<'N' | 'V' | 'M' | 'w', { readonly left: number; readonly right: number }>> // SI
}
```

## Plugin {#the-plugin}

```ts
import { EduBeamPlot } from '@edubeam/plot'

app.use(EduBeamPlot) // zaregistruje <StructurePlot> a <DiagramStack> globálne
```

Plugin je nepovinný: import komponentov podľa názvu je úspornejší a bundler plugin z buildu, ktorý ho nepoužíva, vynechá.

## Typy {#types}

Pre typované obaly komponentov exportuje balík ich props a udalosti:

```ts
import type { PlotLayer, StructurePlotProps } from '@edubeam/plot'

const figure: StructurePlotProps = { layers: ['members', 'supports', 'M'] satisfies PlotLayer[], compact: true }
```

| Typ | Popis |
| --- | --- |
| `StructurePlotProps`, `StructurePlotEmits` | Props a udalosti `StructurePlot` |
| `DiagramStackProps`, `DiagramStackEmits` | Props a udalosti `DiagramStack` |
| `Readout`, `ReadoutQuantity`, `SidedValue`, `StackReadout` | Dáta udalostí |
| `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `StackRow` | Názvy vrstiev, výsledkov, režimov popisov, popisov reakcií a riadkov |
| `Units`, `Unit`, `UnitKind` | Zobrazované jednotky: `{ symbol, scale }` pre každý druh |
| `PlotColors` | Farby podľa tónu |
| `PlotModel` | Model ako jednoduché dáta: [Model na vykreslenie](/sk/plot/model) |

Ostatné exporty, medzi nimi `structureSvg` pre súbory SVG a funkcie, na ktorých stojí kreslenie, nájdete na stránke [Funkcie](/sk/plot/functions).
