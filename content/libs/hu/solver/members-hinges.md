---
title: Rudak és csuklók
description: "Csomópontok összekötése Beam2D rudakkal, nyomatékok felszabadítása rúdvégi csuklókkal, rácsrudak modellezése, valamint a merevségi és transzformációs mátrixok kiolvasása az @edubeam/fem csomagban."
order: 5
source: site
---

# Rudak és csuklók {#members-and-hinges}

Minden rúd egy `Beam2D`: egyenes, kétcsomópontos Timoshenko-gerenda az x–z síkban, amely normálerőt, nyíróerőt és hajlítónyomatékot visz át. A végein lévő csuklók ott felszabadítják a nyomatékot. A kódrészletek egy olyan program `solver`, `domain` és `lc` változóját használják, mint az [Első lépések](/hu/solver/getting-started) oldalon lévő, annak `'steel'` anyagával és `'IPE200'` keresztmetszetével.

## Rúd létrehozása {#create-a-member}

```ts
domain.createBeam2D(label, [startNode, endNode], material, crossSection, hinges)
```

| Argumentum | Típus | Jelentés |
| --- | --- | --- |
| `label` | `string \| number` | A rúd neve, szövegként tárolva |
| `nodes` | `[label, label]` | Az első és a második csomópont. A lokális x az elsőtől a másodikig tart: lásd [A rúd iránya](/hu/solver/conventions#member-direction). |
| `mat`, `cs` | `string \| number` | Egy anyag és egy keresztmetszet jelölése |
| `hinges` | `[boolean, boolean]` | Csukló az első, illetve a második csomópontnál. Elhagyható; alapértéke `[false, false]`, vagyis merev rúdvégek. |

A metódus a `Beam2D` objektumot adja vissza: tartsd meg, hogy kiolvashasd az eredményeket. A `domain.getElement(label)` is megtalálja, de az általános `Element` típussal, így a TypeScript `as Beam2D`-t kér, mielőtt eredményeket olvasnál ki belőle.

A csukló nélkül egy csomópontban találkozó rudak mereven kapcsolódnak: együtt fordulnak el. A csomópontok, az anyag és a keresztmetszet bármilyen sorrendben létrehozhatók, ha a megoldáskor már mind létezik; ha valamelyik hiányzik, a `solve()` a nevét megadó `RangeError` kivételt dob.

## Rúdvégi csuklók {#end-hinges}

A csukló a rúdvéghez tartozik, nem a csomóponthoz. Itt a 2. rúd C-ben csuklóval indul, így C a C–D szakaszról az A–C konzolra nyíróerőt ad át, nyomatékot viszont nem:

```ts [hinge.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry])
domain.createNode('C', [2, 0, 0])
domain.createNode('D', [6, 0, 0], [DofID.Dz])
const ac = domain.createBeam2D(1, ['A', 'C'], 'steel', 'IPE200')
const cd = domain.createBeam2D(2, ['C', 'D'], 'steel', 'IPE200', [true, false])

lc.createBeamElementUniformEdgeLoad(2, [0, 10e3], true)
solver.solve()

cd.computeBendingMomentAt(lc, 0) // 0 a csuklóban
cd.computeBendingMomentAt(lc, 2) // 20000 N·m: a 4 m-es szakasz qL²/8 értéke
ac.computeBendingMomentAt(lc, 0) // -40000 N·m: a C–D szakasz 20 kN-ja 2 m-es karon
```

::model-figure{caption="Konzol, amelyre csuklósan egy tartószakasz támaszkodik: C-ben nincs nyomaték"}
---
nodes: { A: [0, 0], C: [2, 0], D: [6, 0] }
supports: { A: fixed, D: roller }
members: [[A, C], { nodes: [C, D], hinges: [true, false] }]
loads:
  - { member: 2, qz: 10 }
results: [M, V]
show: [nodeLabels]
---
::

Ha egy csuklós csomópontban több rúd találkozik, elég, ha egy kivételével minden rúdvégen csukló van. Az is működik, ha minden rúdvégen csukló van: ekkor semmi sem forgatja el a csomópontot, és a számítómag az elfordulását 0-nak adja meg. Egy ilyen csomópontra működő nyomatékot viszont semmi sem tud felvenni, és [a megoldás nem sikerül](/hu/solver/solving#when-solving-fails).

## Rácsrudak {#truss-bars}

Tegyél csuklót mindkét végre, és a rúd csak normálerőt visz át, amennyiben a csomópontjaiban terhelt: ez a rácsrúd.

```ts
domain.createBeam2D('AE', ['A', 'E'], 'steel', 'bar', [true, true])
```

A [rácsos tartós példaprogram](/hu/solver/trusses) így old meg egy teljes rácsos tartót. Az EduBeam alkalmazás rácsostartó-példája ezzel szemben merev csomópontokat használ, olyan nagy keresztmetszeti területtel, hogy a hajlítónyomatékok a normálerők mellett elhanyagolhatók. Mindkét modell helyes; csak ezekben a kis nyomatékokban különböznek. A rácsrúd saját merevségi mátrixának levezetése az elméleti kézikönyv [Rácsrúdelem](/hu/elements/truss) oldalán található.

## Az elem mátrixai {#the-element-s-matrices}

Magának a módszernek a tanításához a `Beam2D` a mátrixait [mathjs](https://mathjs.org)-mátrixként adja vissza; a `.toArray()` `number[][]`-vé alakítja őket:

| Metódus | Visszatérési érték |
| --- | --- |
| `computeGeo()` | `{ l, dx, dz }`: hossz és vetületek, m |
| `computeLocalStiffnessMtrx().answer` | 6 × 6-os merevségi mátrix lokális tengelyekben, a csuklók kikondenzálva |
| `computeT()` | 6 × 6-os transzformációs mátrix globálisról lokális tengelyekre |
| `computeStiffness()` | 6 × 6-os merevségi mátrix globális tengelyekben, $T^T K_l T$ |
| `computeShearFactor()` | $\Phi = 12EI_y/kGAL^2$ |

```ts
ac.computeStiffness().toArray() // number[][], N/m, N és N·m
```

A szabadságfokok sorrendje $u_1, w_1, \varphi_1, u_2, w_2, \varphi_2$. Az elméleti kézikönyv [Gerendaelem](/hu/elements/beam) oldala levezeti ezeket a mátrixokat, a [Hogyan számít az EduBeam](/hu/elements/analysis) oldal pedig megmutatja, hogyan állnak össze.
