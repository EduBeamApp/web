---
title: API-ul componentelor
description: "Toate props-urile și evenimentele StructurePlot și DiagramStack din @edubeam/plot 0.2.0, cu tipuri și valori implicite, pluginul EduBeamPlot și tipurile exportate."
order: 8
group: Referință API
source: site
---

# API-ul componentelor

Props-urile și evenimentele celor două componente, așa cum sunt declarate în @edubeam/plot 0.2.0. Niciuna nu are sloturi. Valorile în unități SI sunt marcate ca atare; dimensiunile sunt în pixeli CSS.

## StructurePlot {#structureplot}

```ts
import { StructurePlot } from '@edubeam/plot'
```

Desenează o structură plană și rezultatele ei. Ghid: [StructurePlot](/ro/plot/structure-plot).

### Props {#props}

| Prop | Tip | Implicit | Descriere |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Un `Solver` din @edubeam/fem. Rezultatele se desenează după ce cazul lui de încărcare este calculat. |
| `model` | `PlotModel` | – | Sau datele simple produse de [`modelFromSolver`](/ro/plot/model). Are prioritate față de `solver`. |
| `loadCase` | `number` | `0` | Indexul în `solver.loadCases` |
| `revision` | `number` | `0` | Schimbă-l ca să redesenezi un `solver` modificat pe loc |
| `layers` | `readonly PlotLayer[]` | bare, reazeme, încărcări, reacțiuni și un rezultat | Ce se desenează: `'nodes'`, `'nodeLabels'`, `'dimensions'`, `'members'`, `'supports'`, `'loads'`, `'reactions'`, `'N'`, `'V'`, `'M'`, `'w'` |
| `reserve` | `readonly PlotLayer[]` | `layers` | Straturi pentru care se păstrează loc cât timp sunt ascunse |
| `compact` | `boolean` | `false` | Desen de miniatură: simboluri mai mici, cel mult două valori pe bară |
| `units` | `Partial<Units>` | `KN_UNITS` | Unitățile de afișare |
| `numberFormat` | `Intl.NumberFormat` | engleză, cel mult o zecimală | Formatează fiecare număr |
| `colors` | `Partial<PlotColors>` | – | Culori proprii pe tonuri: [Teme și culori](/ro/plot/theming#the-colors-prop) |
| `width` | `number` | `640`, compact `400` | Lățimea până când containerul este măsurat, de exemplu pe server |
| `height` | `number` | – | Înălțime fixă. Fără ea, înălțimea urmează desenul. |
| `maxHeight` | `number` | `max(320, 0.75 × width)`, compact niciuna | Limita superioară a înălțimii automate |
| `padding` | `number` | `6` | Spațiul din jurul desenului |
| `fontSize` | `number` | `13`, compact `11.5` | Mărimea textului |
| `diagramSize` | `number` | `48`, compact `26` | Lungimea celei mai mari ordonate a diagramei |
| `deformedSize` | `number` | `30`, compact `18` | Cea mai mare deplasare pe deformată |
| `diagramScale` | `Partial<Record<ResultLayer, number>>` | – | Număr fix de px pe unitate SI pentru un rezultat; înlocuiește `diagramSize` sau `deformedSize` |
| `momentOnTensionSide` | `boolean` | `true` | M de partea fibrei întinse; `false` de partea fibrei comprimate |
| `resultLabelMode` | `'horizontal' \| 'axis'` | `'horizontal'` | Valori scrise orizontal sau rotite de-a lungul ordonatei |
| `reactionLabels` | `'values' \| 'names'` | `'values'` | Reacțiunile așa cum acționează, cu valoarea lor; sau, pentru un exercițiu, fiecare direcție blocată denumită (*A<sub>x</sub>*, *M<sub>A</sub>*) și orientată în sensul considerat pozitiv. Denumirile nu au nevoie de rezultate: [Reacțiunile ca necunoscute](/ro/plot/structure-plot#reactions-as-unknowns) |
| `reserveLabelModes` | `readonly ResultLabelMode[]` | – | Moduri de etichetare pentru care se păstrează loc în afară de cel curent |
| `reserveReactionLabels` | `readonly ReactionLabels[]` | – | Stiluri de etichete ale reacțiunilor pentru care se păstrează loc în afară de `reactionLabels`, ca un exercițiu care devine rezolvare să nu-și miște desenul |
| `animate` | `boolean` | `true` | Straturile apar treptat, iar barele se desenează progresiv. Mereu dezactivat la `prefers-reduced-motion`. |
| `hover` | `boolean` | `false` | Citirea valorilor de sub cursor, marcate la vârful ordonatei fiecărei diagrame. Când e dezactivat, desenul nu reacționează deloc la cursor. |
| `title` | `string` | o descriere a ceea ce se afișează | Numele accesibil (accessible name) al figurii |

Fără `layers`, rezultatul este `M` pentru grinzi și cadre, `N` pentru o grindă cu zăbrele și `w` când nimic nu preia forțe (`defaultResultLayer`).

### Evenimente {#events}

| Eveniment | Date | Când |
| --- | --- | --- |
| `readout` | `Readout \| null` | Cu `hover`: punctul de pe bară aflat sub cursor și rezultatele lui; `null` când cursorul iese din desen |

```ts
interface Readout {
  readonly member: string
  readonly x: number // m de la nodul de început al barei
  readonly px: number // punctul de pe ecran, px
  readonly py: number
  readonly values: Readonly<Record<'N' | 'V' | 'M' | 'w', SidedValue>> // unități SI
  readonly u: number // deplasarea de-a lungul axei locale x a barei, m
}
interface SidedValue {
  readonly left: number
  readonly right: number // egală cu left acolo unde rezultatul este continuu
}
```

## DiagramStack {#diagramstack}

```ts
import { DiagramStack } from '@edubeam/plot'
```

Desenează o grindă dreaptă deasupra diagramelor ei, pe o singură axă x. Barele trebuie să formeze o singură linie orizontală, definită de la stânga la dreapta; în orice alt caz componenta aruncă o excepție. Ghid: [DiagramStack](/ro/plot/diagram-stack).

### Props {#props-1}

| Prop | Tip | Implicit | Descriere |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Grinda calculată |
| `model` | `PlotModel` | – | Sau datele simple din `modelFromSolver`; are prioritate |
| `loadCase` | `number` | `0` | Indexul în `solver.loadCases` |
| `revision` | `number` | `0` | Schimbă-l ca să redesenezi un `solver` modificat pe loc |
| `members` | `readonly string[]` | toate barele | Barele care formează linia grinzii |
| `rows` | `readonly StackRow[]` | `['V', 'M', 'w']` | Rândurile de diagrame, de sus în jos, din `'N'`, `'V'`, `'M'`, `'w'` |
| `loadRow` | `boolean` | `true` | Grinda cu reazemele, încărcările și reacțiunile ei, deasupra rândurilor |
| `ranges` | `Partial<Record<StackRow, readonly [number, number]>>` | domeniul propriu al fiecărui rând | Domeniul de valori pe rând, unități SI |
| `rowHeights` | `Partial<Record<StackRow, number>>` | N 100, V 116, M 128, w 76; sub 560 px lățime 88, 96, 104, 64 | Înălțimile rândurilor înainte ca `maxHeight` să le scaleze |
| `maxHeight` | `number` | – | Rândurile se micșorează, cel mult până la 60 %, ca figura să încapă. Textul își păstrează mărimea. |
| `units` | `Partial<Units>` | `KN_UNITS` | Unitățile de afișare |
| `numberFormat` | `Intl.NumberFormat` | engleză, cel mult o zecimală | Formatează fiecare număr |
| `colors` | `Partial<PlotColors>` | – | Culori proprii |
| `width` | `number` | `720` | Lățimea până când containerul este măsurat; se folosește cel puțin 320 |
| `fontSize` | `number` | `12.5` | Mărimea textului |
| `hover` | `boolean` | `true` | Cursorul de citire. Când e dezactivat, figura nu reacționează deloc la cursor. |
| `loadAt` | `number` | – | Poziția (în m de-a lungul liniei) unei forțe concentrate pe care cititorul o poate trage; se folosește cu `v-model:load-at` |
| `loadLabel` | `string` | `P = …` cu valoarea forței | Textul de lângă forța care poate fi trasă |
| `loadStep` | `number` | `0.05` | Pasul în m la care se rotunjește tragerea; tastele săgeți mută forța cu acest pas |
| `title` | `string` | o descriere a rândurilor | Numele accesibil (accessible name) al figurii |

### Evenimente {#events-1}

| Eveniment | Date | Când |
| --- | --- | --- |
| `update:loadAt` | `number` | Cititorul a mutat forța: noua ei poziție, m. Alimentează `v-model:load-at`. |
| `readout` | `StackReadout \| null` | Valorile de sub cursor în toate rândurile; `null` când cursorul iese din figură |

```ts
interface StackReadout {
  readonly x: number // m de-a lungul liniei grinzii
  readonly values: Partial<Record<'N' | 'V' | 'M' | 'w', { readonly left: number; readonly right: number }>> // SI
}
```

## Pluginul {#the-plugin}

```ts
import { EduBeamPlot } from '@edubeam/plot'

app.use(EduBeamPlot) // înregistrează global <StructurePlot> și <DiagramStack>
```

Este opțional: importul componentelor după nume e mai ușor, iar un bundler elimină pluginul dintr-un build care nu îl folosește.

## Tipuri {#types}

Pentru wrappere tipizate în jurul componentelor, pachetul exportă props-urile și evenimentele lor:

```ts
import type { PlotLayer, StructurePlotProps } from '@edubeam/plot'

const figure: StructurePlotProps = { layers: ['members', 'supports', 'M'] satisfies PlotLayer[], compact: true }
```

| Tip | Ce este |
| --- | --- |
| `StructurePlotProps`, `StructurePlotEmits` | Props-urile și evenimentele `StructurePlot` |
| `DiagramStackProps`, `DiagramStackEmits` | Props-urile și evenimentele `DiagramStack` |
| `Readout`, `ReadoutQuantity`, `SidedValue`, `StackReadout` | Datele evenimentelor |
| `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `StackRow` | Numele straturilor, rezultatelor, modurilor de etichetare, stilurilor de etichete ale reacțiunilor și rândurilor |
| `Units`, `Unit`, `UnitKind` | Unitățile de afișare: `{ symbol, scale }` pentru fiecare tip de mărime |
| `PlotColors` | Culorile pe tonuri |
| `PlotModel` | Modelul simplu: [Modelul desenului](/ro/plot/model) |

Celelalte exporturi, printre care `structureSvg` pentru fișiere SVG și funcțiile pe care se bazează desenul, sunt descrise în [Funcții](/ro/plot/functions).
