---
title: Komponens API
description: "A StructurePlot és a DiagramStack minden propja és eseménye az @edubeam/plot 0.2.0-ban, típusokkal és alapértékekkel, az EduBeamPlot plugin és az exportált prop-típusok."
order: 8
group: Referencia
source: site
---

# Komponens API

A két komponens propjai és eseményei úgy, ahogy az @edubeam/plot 0.2.0 deklarálja őket. Egyiknek sincsenek slotjai. Az SI-egységben értendő értékeknél ezt külön jelöljük; a méretek CSS-pixelben értendők.

## StructurePlot {#structureplot}

```ts
import { StructurePlot } from '@edubeam/plot'
```

Síkbeli szerkezetet és eredményeit rajzolja meg. Útmutató: [StructurePlot](/hu/plot/structure-plot).

### Propok {#props}

| Prop | Típus | Alapérték | Leírás |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Egy @edubeam/fem számítómag. Az eredmények akkor jelennek meg, ha a terhelési esetét kiszámították. |
| `model` | `PlotModel` | – | Vagy a [`modelFromSolver`](/hu/plot/model) által előállított egyszerű adatok. Elsőbbséget élvez a `solver`-rel szemben. |
| `loadCase` | `number` | `0` | Index a `solver.loadCases` tömbben |
| `revision` | `number` | `0` | Változtasd meg, hogy egy helyben módosított számítómag újrarajzolódjon |
| `layers` | `readonly PlotLayer[]` | rudak, támaszok, terhek, támaszerők és egy eredmény | Mit rajzoljon: `'nodes'`, `'nodeLabels'`, `'dimensions'`, `'members'`, `'supports'`, `'loads'`, `'reactions'`, `'N'`, `'V'`, `'M'`, `'w'` |
| `reserve` | `readonly PlotLayer[]` | `layers` | Rétegek, amelyeknek rejtve is helyet kell hagyni |
| `compact` | `boolean` | `false` | Bélyegkép-rajz: kisebb jelek, rudanként legfeljebb két érték |
| `units` | `Partial<Units>` | `KN_UNITS` | Megjelenítési mértékegységek |
| `numberFormat` | `Intl.NumberFormat` | angol, legfeljebb 1 tizedesjegy | Minden számot ez formáz |
| `colors` | `Partial<PlotColors>` | – | Saját színek tónusonként: [Témák és színek](/hu/plot/theming#the-colors-prop) |
| `width` | `number` | `640`, compact `400` | Szélesség, amíg a tárolót meg nem méri, például a szerveren |
| `height` | `number` | – | Rögzített magasság. Nélküle a magasság a rajzhoz igazodik. |
| `maxHeight` | `number` | `max(320, 0.75 × width)`, compact nincs | Az automatikus magasság felső korlátja |
| `padding` | `number` | `6` | Térköz a rajz körül |
| `fontSize` | `number` | `13`, compact `11.5` | Betűméret |
| `diagramSize` | `number` | `48`, compact `26` | Az ábra legnagyobb ordinátájának hossza |
| `deformedSize` | `number` | `30`, compact `18` | A deformált alak legnagyobb elmozdulása |
| `diagramScale` | `Partial<Record<ResultLayer, number>>` | – | Rögzített px/SI-egység egy eredményhez; felülírja a `diagramSize` vagy a `deformedSize` értékét |
| `momentOnTensionSide` | `boolean` | `true` | M a húzott oldalon; `false` esetén a nyomott oldalon |
| `resultLabelMode` | `'horizontal' \| 'axis'` | `'horizontal'` | Az értékek vízszintesen, vagy az ordinátájuk mentén elforgatva |
| `reactionLabels` | `'values' \| 'names'` | `'values'` | A támaszerők úgy, ahogy hatnak, a nagyságukkal; vagy feladathoz minden gátolt irány a nevével (*A<sub>x</sub>*, *M<sub>A</sub>*), a pozitív irányba mutató nyíllal. A nevekhez nem kellenek eredmények: [Támaszerők mint ismeretlenek](/hu/plot/structure-plot#reactions-as-unknowns) |
| `reserveLabelModes` | `readonly ResultLabelMode[]` | – | Feliratozási módok, amelyeknek a jelenlegin kívül helyet kell hagyni |
| `reserveReactionLabels` | `readonly ReactionLabels[]` | – | Támaszerő-feliratstílusok, amelyeknek a `reactionLabels` mellett helyet kell hagyni, hogy a megoldássá alakuló feladat rajza ne mozduljon el |
| `animate` | `boolean` | `true` | A rétegek beúsztatása és a rudak kirajzolása. `prefers-reduced-motion` mellett mindig ki van kapcsolva. |
| `hover` | `boolean` | `false` | Értékek leolvasása a mutató alatt, minden ábra ordinátájának végén megjelölve. Kikapcsolva a rajz egyáltalán nem fogad mutatóbemenetet. |
| `title` | `string` | annak leírása, ami látható | A rajz akadálymentes neve (accessible name) |

`layers` nélkül az eredmény tartóknál és kereteknél `M`, rácsos tartónál `N`, és `w`, ha semmi sem visel erőt (`defaultResultLayer`).

### Események {#events}

| Esemény | Adat | Mikor |
| --- | --- | --- |
| `readout` | `Readout \| null` | `hover` mellett: a rúd mutató alatti pontja és az ott érvényes eredmények; `null`, ha a mutató elhagyja a rajzot |

```ts
interface Readout {
  readonly member: string
  readonly x: number // m a rúd kezdő csomópontjától
  readonly px: number // a pont a képernyőn, px
  readonly py: number
  readonly values: Readonly<Record<'N' | 'V' | 'M' | 'w', SidedValue>> // SI-egységek
  readonly u: number // elmozdulás a rúd lokális x tengelye mentén, m
}
interface SidedValue {
  readonly left: number
  readonly right: number // ahol az eredmény folytonos, egyenlő a left értékkel
}
```

## DiagramStack {#diagramstack}

```ts
import { DiagramStack } from '@edubeam/plot'
```

Egyenes tartót rajzol az ábrái fölé, közös x tengelyen. A rudaknak egyetlen vízszintes vonalat kell alkotniuk, balról jobbra megadva; minden más esetben a komponens kivételt dob. Útmutató: [DiagramStack](/hu/plot/diagram-stack).

### Propok {#props-1}

| Prop | Típus | Alapérték | Leírás |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | A kiszámított tartó |
| `model` | `PlotModel` | – | Vagy egyszerű adatok a `modelFromSolver` függvényből; elsőbbséget élvez |
| `loadCase` | `number` | `0` | Index a `solver.loadCases` tömbben |
| `revision` | `number` | `0` | Változtasd meg, hogy egy helyben módosított számítómag újrarajzolódjon |
| `members` | `readonly string[]` | minden rúd | A tartó vonalát alkotó rudak |
| `rows` | `readonly StackRow[]` | `['V', 'M', 'w']` | Az ábrák sorai fentről lefelé, az `'N'`, `'V'`, `'M'` és `'w'` közül |
| `loadRow` | `boolean` | `true` | A tartó a támaszokkal, terhekkel és támaszerőkkel a sorok fölött |
| `ranges` | `Partial<Record<StackRow, readonly [number, number]>>` | minden sor saját tartománya | Értéktartomány soronként, SI-egységekben |
| `rowHeights` | `Partial<Record<StackRow, number>>` | N 100, V 116, M 128, w 76; 560 px szélesség alatt 88, 96, 104, 64 | A sorok magassága, mielőtt a `maxHeight` lekicsinyíti őket |
| `maxHeight` | `number` | – | A sorok legfeljebb 60%-ig zsugorodnak, hogy a rajz elférjen. A szöveg megtartja a méretét. |
| `units` | `Partial<Units>` | `KN_UNITS` | Megjelenítési mértékegységek |
| `numberFormat` | `Intl.NumberFormat` | angol, legfeljebb 1 tizedesjegy | Minden számot ez formáz |
| `colors` | `Partial<PlotColors>` | – | Saját színek |
| `width` | `number` | `720` | Szélesség, amíg a tárolót meg nem méri; legalább 320 px-t használ |
| `fontSize` | `number` | `12.5` | Betűméret |
| `hover` | `boolean` | `true` | A leolvasó kurzor. Kikapcsolva a rajz nem fogad mutatóbemenetet. |
| `loadAt` | `number` | – | Az olvasó által húzható koncentrált erő helye (m a vonal mentén); a `v-model:load-at` direktívával használd |
| `loadLabel` | `string` | `P = …` az erő nagyságával | A húzható erő melletti szöveg |
| `loadStep` | `number` | `0.05` | A húzás erre a lépésközre kerekít, m; a nyílbillentyűk ennyivel mozgatják |
| `title` | `string` | a sorok leírása | A rajz akadálymentes neve (accessible name) |

### Események {#events-1}

| Esemény | Adat | Mikor |
| --- | --- | --- |
| `update:loadAt` | `number` | Az olvasó elmozdította az erőt: az új helye, m. Ez működteti a `v-model:load-at` direktívát. |
| `readout` | `StackReadout \| null` | A kurzor értékei az összes sorban; `null`, ha a mutató elhagyja a rajzot |

```ts
interface StackReadout {
  readonly x: number // m a tartó vonala mentén
  readonly values: Partial<Record<'N' | 'V' | 'M' | 'w', { readonly left: number; readonly right: number }>> // SI
}
```

## A plugin {#the-plugin}

```ts
import { EduBeamPlot } from '@edubeam/plot'

app.use(EduBeamPlot) // globálisan regisztrálja a <StructurePlot> és <DiagramStack> komponenst
```

Használata nem kötelező: a komponensek név szerinti importálása kisebb kódot eredményez, és a bundler kihagyja a plugint abból a buildből, amely nem használja.

## Típusok {#types}

A komponensek köré írt típusos burkolókhoz a csomag exportálja a propjaikat és eseményeiket:

```ts
import type { PlotLayer, StructurePlotProps } from '@edubeam/plot'

const figure: StructurePlotProps = { layers: ['members', 'supports', 'M'] satisfies PlotLayer[], compact: true }
```

| Típus | Jelentés |
| --- | --- |
| `StructurePlotProps`, `StructurePlotEmits` | A `StructurePlot` propjai és eseményei |
| `DiagramStackProps`, `DiagramStackEmits` | A `DiagramStack` propjai és eseményei |
| `Readout`, `ReadoutQuantity`, `SidedValue`, `StackReadout` | Az események adatai |
| `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `StackRow` | A rétegek, eredmények, feliratozási módok, támaszerő-feliratstílusok és sorok nevei |
| `Units`, `Unit`, `UnitKind` | Megjelenítési mértékegységek: fajtánként `{ symbol, scale }` |
| `PlotColors` | Színek tónusonként |
| `PlotModel` | Az egyszerű modell: [A rajz modellje](/hu/plot/model) |

A többi exportot, köztük az SVG-fájlokhoz való `structureSvg` függvényt és a rajzolás mögötti függvényeket, a [Függvények](/hu/plot/functions) oldal ismerteti.
