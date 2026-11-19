---
title: API komponent
description: "Všechny props a události komponent StructurePlot a DiagramStack v @edubeam/plot 0.2.0 s typy a výchozími hodnotami, plugin EduBeamPlot a exportované typy props."
order: 8
group: Reference
---

# API komponent

Props a události obou komponent, jak jsou deklarované v @edubeam/plot 0.2.0. Žádná z nich nemá sloty. Hodnoty v jednotkách SI jsou takto označené; velikosti jsou v pixelech CSS.

## StructurePlot {#structureplot}

```ts
import { StructurePlot } from '@edubeam/plot'
```

Vykreslí rovinnou konstrukci a její výsledky. Návod: [StructurePlot](/cs/plot/structure-plot).

### Props {#props}

| Prop | Typ | Výchozí | Popis |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Řešič @edubeam/fem. Výsledky se vykreslí, jakmile je jeho zatěžovací stav spočtený. |
| `model` | `PlotModel` | – | Nebo prostá data, která vytvoří [`modelFromSolver`](/cs/plot/model). Má přednost před `solver`. |
| `loadCase` | `number` | `0` | Index do `solver.loadCases` |
| `revision` | `number` | `0` | Změňte ji, chcete-li překreslit řešič změněný na místě |
| `layers` | `readonly PlotLayer[]` | prvky, podpory, zatížení, reakce a jeden výsledek | Co vykreslit: `'nodes'`, `'nodeLabels'`, `'dimensions'`, `'members'`, `'supports'`, `'loads'`, `'reactions'`, `'N'`, `'V'`, `'M'`, `'w'` |
| `reserve` | `readonly PlotLayer[]` | `layers` | Vrstvy, pro které se nechává místo, i když jsou skryté |
| `compact` | `boolean` | `false` | Kresba pro náhledy: menší značky, nejvýše dvě hodnoty na prvek |
| `units` | `Partial<Units>` | `KN_UNITS` | Zobrazované jednotky |
| `numberFormat` | `Intl.NumberFormat` | anglický formát, nejvýše 1 desetinné místo | Formátuje všechna čísla |
| `colors` | `Partial<PlotColors>` | – | Přepsání barev podle tónu: [Motivy a barvy](/cs/plot/theming#the-colors-prop) |
| `width` | `number` | `640`, compact `400` | Šířka, dokud není kontejner změřen, například na serveru |
| `height` | `number` | – | Pevná výška. Bez ní se výška řídí výkresem. |
| `maxHeight` | `number` | `max(320, 0.75 × width)`, compact žádná | Horní mez automatické výšky |
| `padding` | `number` | `6` | Okraj kolem výkresu |
| `fontSize` | `number` | `13`, compact `11.5` | Velikost textu |
| `diagramSize` | `number` | `48`, compact `26` | Délka největší pořadnice průběhu |
| `deformedSize` | `number` | `30`, compact `18` | Největší posunutí na deformovaném tvaru |
| `diagramScale` | `Partial<Record<ResultLayer, number>>` | – | Pevný počet px na jednotku SI pro výsledek; přepíše `diagramSize` nebo `deformedSize` |
| `momentOnTensionSide` | `boolean` | `true` | M na tažené straně; `false` pro tlačenou stranu |
| `resultLabelMode` | `'horizontal' \| 'axis'` | `'horizontal'` | Hodnoty psané vodorovně, nebo natočené podél pořadnice |
| `reactionLabels` | `'values' \| 'names'` | `'values'` | Reakce tak, jak působí, s velikostí; nebo pro zadání příkladu každý podepřený směr pojmenovaný (*A<sub>x</sub>*, *M<sub>A</sub>*) a nakreslený v kladném smyslu. Jména nepotřebují výsledky: [Reakce jako neznámé](/cs/plot/structure-plot#reactions-as-unknowns) |
| `reserveLabelModes` | `readonly ResultLabelMode[]` | – | Režimy popisků, pro které se kromě aktuálního nechává místo |
| `reserveReactionLabels` | `readonly ReactionLabels[]` | – | Styly popisků reakcí, pro které se kromě `reactionLabels` nechává místo, aby se výkres nepohnul, když se zadání příkladu změní v řešení |
| `animate` | `boolean` | `true` | Plynulé objevování vrstev a postupné vykreslování prvků. Při `prefers-reduced-motion` vždy vypnuté. |
| `hover` | `boolean` | `false` | Odečet hodnot pod ukazatelem, vyznačených na konci pořadnice každého průběhu. Když je vypnutý, obrázek na ukazatel vůbec nereaguje. |
| `title` | `string` | popis toho, co obrázek ukazuje | Přístupný název obrázku. Výchozí popis je anglický („Structure with its …“); web nebo aplikace ho mohou nahradit přes `PLOT_TEXTS` z `@edubeam/plot`. |

Bez `layers` je výsledkem `M` pro nosníky a rámy, `N` pro příhradovou konstrukci a `w`, když žádný prvek nepřenáší sílu (`defaultResultLayer`).

### Události {#events}

| Událost | Data | Kdy |
| --- | --- | --- |
| `readout` | `Readout \| null` | S `hover`: bod prvku pod ukazatelem a jeho výsledky; `null`, když ukazatel odjede |

```ts
interface Readout {
  readonly member: string
  readonly x: number // m od počátečního uzlu prvku
  readonly px: number // bod na obrazovce, px
  readonly py: number
  readonly values: Readonly<Record<'N' | 'V' | 'M' | 'w', SidedValue>> // jednotky SI
  readonly u: number // posunutí ve směru lokální osy x prvku, m
}
interface SidedValue {
  readonly left: number
  readonly right: number // rovné left tam, kde je výsledek spojitý
}
```

## DiagramStack {#diagramstack}

```ts
import { DiagramStack } from '@edubeam/plot'
```

Vykreslí přímý nosník nad jeho průběhy na společné ose x. Prvky musí tvořit jednu vodorovnou přímku zadanou zleva doprava; cokoli jiného vyhodí chybu. Návod: [DiagramStack](/cs/plot/diagram-stack).

### Props {#props-1}

| Prop | Typ | Výchozí | Popis |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Spočtený nosník |
| `model` | `PlotModel` | – | Nebo prostá data z `modelFromSolver`; mají přednost |
| `loadCase` | `number` | `0` | Index do `solver.loadCases` |
| `revision` | `number` | `0` | Změňte ji, chcete-li překreslit řešič změněný na místě |
| `members` | `readonly string[]` | všechny prvky | Prvky nosníku |
| `rows` | `readonly StackRow[]` | `['V', 'M', 'w']` | Řádky průběhů shora dolů, z `'N'`, `'V'`, `'M'`, `'w'` |
| `loadRow` | `boolean` | `true` | Nosník s podporami, zatížením a reakcemi nad řádky |
| `ranges` | `Partial<Record<StackRow, readonly [number, number]>>` | vlastní rozsah každého řádku | Rozsah hodnot pro každý řádek, jednotky SI |
| `rowHeights` | `Partial<Record<StackRow, number>>` | N 100, V 116, M 128, w 76; při šířce pod 560 px 88, 96, 104, 64 | Výšky řádků předtím, než je zmenší `maxHeight` |
| `maxHeight` | `number` | – | Řádky se zmenší, nejvýše na 60 %, aby se obrázek vešel. Text si velikost drží. |
| `units` | `Partial<Units>` | `KN_UNITS` | Zobrazované jednotky |
| `numberFormat` | `Intl.NumberFormat` | anglický formát, nejvýše 1 desetinné místo | Formátuje všechna čísla |
| `colors` | `Partial<PlotColors>` | – | Přepsání barev |
| `width` | `number` | `720` | Šířka, dokud není kontejner změřen; použije se nejméně 320 |
| `fontSize` | `number` | `12.5` | Velikost textu |
| `hover` | `boolean` | `true` | Kurzor pro odečítání. Když je vypnutý, obrázek na ukazatel nereaguje. |
| `loadAt` | `number` | – | Poloha (m podél přímky) osamělé síly, kterou může čtenář posouvat; používá se s `v-model:load-at` |
| `loadLabel` | `string` | `P = …` s velikostí síly | Text vedle posuvné síly |
| `loadStep` | `number` | `0.05` | Krok, na který se tažení zaokrouhluje, m; o tento krok posouvají sílu šipky |
| `title` | `string` | popis řádků | Přístupný název obrázku |

### Události {#events-1}

| Událost | Data | Kdy |
| --- | --- | --- |
| `update:loadAt` | `number` | Čtenář posunul sílu: její nová poloha, m. Pohání `v-model:load-at`. |
| `readout` | `StackReadout \| null` | Hodnoty kurzoru ve všech řádcích; `null`, když ukazatel odjede |

```ts
interface StackReadout {
  readonly x: number // m podél nosníku
  readonly values: Partial<Record<'N' | 'V' | 'M' | 'w', { readonly left: number; readonly right: number }>> // SI
}
```

## Plugin {#the-plugin}

```ts
import { EduBeamPlot } from '@edubeam/plot'

app.use(EduBeamPlot) // zaregistruje <StructurePlot> a <DiagramStack> globálně
```

Plugin je nepovinný: import komponent podle jména je úspornější a bundler plugin z buildu, který ho nepoužívá, vypustí.

## Typy {#types}

Pro typované obaly komponent exportuje balíček jejich props a události:

```ts
import type { PlotLayer, StructurePlotProps } from '@edubeam/plot'

const figure: StructurePlotProps = { layers: ['members', 'supports', 'M'] satisfies PlotLayer[], compact: true }
```

| Typ | Popis |
| --- | --- |
| `StructurePlotProps`, `StructurePlotEmits` | Props a události `StructurePlot` |
| `DiagramStackProps`, `DiagramStackEmits` | Props a události `DiagramStack` |
| `Readout`, `ReadoutQuantity`, `SidedValue`, `StackReadout` | Data událostí |
| `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `StackRow` | Názvy vrstev, výsledků, režimů popisků, popisků reakcí a řádků |
| `Units`, `Unit`, `UnitKind` | Zobrazované jednotky: `{ symbol, scale }` pro každý druh |
| `PlotColors` | Barvy podle tónu |
| `PlotModel` | Model jako prostá data: [Model pro vykreslení](/cs/plot/model) |

Ostatní exporty, mezi nimi `structureSvg` pro soubory SVG a funkce, na kterých stojí kreslení, najdete na stránce [Funkce](/cs/plot/functions).
