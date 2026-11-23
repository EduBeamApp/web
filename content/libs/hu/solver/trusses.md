---
title: Rácsos tartók
description: "Csuklós csomópontú, Warren-rendszerű rácsos tartó az @edubeam/fem csomaggal, minden rúderő átmetsző (Ritter-) módszerrel ellenőrizve, és egy ciklus, amely tetszőleges számú mezőből álló rácsos tartókat generál."
order: 14
source: site
---

# Rácsos tartók {#trusses}

A rácsos tartó mindkét végükön csuklós, a csomópontokban terhelt rudakból áll, így minden rúd csak normálerőt visz át. Ez a példaprogram két listából felépít egy Warren-rendszerű rácsos tartót, kézzel ellenőriz minden rúderőt, majd egy ciklusban tetszőleges méretű rácsos tartókat generál.

::model-figure{caption="Warren-rendszerű rácsos tartó: 9 m támaszköz, 1,8 m magasság, minden felső csomópontban 8 kN"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members:
  - { nodes: [A, B], hinges: [true, true] }
  - { nodes: [B, C], hinges: [true, true] }
  - { nodes: [C, D], hinges: [true, true] }
  - { nodes: [E, F], hinges: [true, true] }
  - { nodes: [F, G], hinges: [true, true] }
  - { nodes: [A, E], hinges: [true, true] }
  - { nodes: [E, B], hinges: [true, true] }
  - { nodes: [B, F], hinges: [true, true] }
  - { nodes: [F, C], hinges: [true, true] }
  - { nodes: [C, G], hinges: [true, true] }
  - { nodes: [G, D], hinges: [true, true] }
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: [N, w]
show: [nodeLabels]
---
::

```ts [truss.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })

// Warren-rendszerű rácsos tartó: 9 m támaszköz, 1,8 m magasság, alsó öv A-B-C-D, felső öv E-F-G
const nodes: [string, number, number, DofID[]][] = [
  ['A', 0, 0, [DofID.Dx, DofID.Dz]],
  ['B', 3, 0, []],
  ['C', 6, 0, []],
  ['D', 9, 0, [DofID.Dz]],
  ['E', 1.5, -1.8, []],
  ['F', 4.5, -1.8, []],
  ['G', 7.5, -1.8, []],
]
for (const [label, x, z, support] of nodes) {
  domain.createNode(label, [x, 0, z], support)
}

// Minden jelölés a rúd két csomópontját adja meg. Mindkét végén csuklós: csak normálerő.
const bars = ['AB', 'BC', 'CD', 'EF', 'FG', 'AE', 'EB', 'BF', 'FC', 'CG', 'GD']
const members = bars.map((bar) =>
  domain.createBeam2D(bar, [bar[0], bar[1]], 1, 1, [true, true])
)

const lc = solver.loadCases[0]
for (const top of ['E', 'F', 'G']) {
  lc.createNodalLoad(top, { [DofID.Dz]: 8e3 }) // 8 kN lefelé
}
solver.solve()

for (const bar of members) {
  const n = bar.computeNormalForceAt(lc, 0) / 1e3
  console.log(bar.label, n.toFixed(2), n > 0 ? 'tension' : 'compression')
}
```

```text [Kimenet]
AB 10.00 tension
BC 16.67 tension
CD 10.00 tension
EF -13.33 compression
FG -13.33 compression
AE -15.62 compression
EB 5.21 tension
BF -5.21 compression
FC -5.21 compression
CG 5.21 tension
GD -15.62 compression
```

A rúd normálereje állandó, így elég `x = 0`-nál kiolvasni. A kétbetűs jelölések egyben a csomópontpárokat is megadják: `bar[0]` és `bar[1]`.

## Kézi ellenőrzés {#check-it-by-hand}

Mindkét támasz a 24 kN felét, 12 kN-t veszi fel. Metszd át a rácsos tartót, és írj fel nyomatéki egyenletet az átmetszett rúddal szemközti csomópontra, ahogy az [átmetsző módszernél](/hu/tutorials/truss):

| Rúd | Egyenlet | Erő |
| --- | --- | --- |
| BC, alsó öv | nyomaték F-re: $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$ | 16,67 kN, húzás |
| EF, felső öv | nyomaték B-re: $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$ | 13,33 kN, nyomás |
| AE, szélső ferde rácsrúd | A csomópont: $12 \cdot \sqrt{1{,}5^2 + 1{,}8^2}/1{,}8$ | 15,62 kN, nyomás |
| EB, ferde rácsrúd | a mező nyíróereje, $12 - 8 = 4$ kN: $4 \cdot 2{,}343/1{,}8$ | 5,21 kN, húzás |

A keresztmetszet nem változtatja meg egy statikailag határozott rácsos tartó rúderőit; csak azt határozza meg, mennyire mozdulnak el a csomópontok. A fenti ábra más keresztmetszetet, az EduBeam alkalmazásét használja, és ugyanazokat az erőket adja.

## Tetszőleges számú mező {#any-number-of-panels}

Ha rácsos tartókat szeretnél generálni, feladatokhoz vagy paramétervizsgálathoz, a csomópontokat és a rudakat ciklusban, mezőről mezőre építsd fel. `panels = 3` esetén ez a fenti rácsos tartó, és ugyanazokat az erőket írja ki; másikhoz változtasd meg a `panels`, `w` és `h` értékét.

```ts [warren.ts]
import { type Beam2D, DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })
const lc = solver.loadCases[0]

const panels = 3 // az alsó öv mezőinek száma
const w = 3 // mezőszélesség, m
const h = 1.8 // magasság, m

// Alsó csomópontok b0, b1, … csuklós és görgős támaszon; felső csomópontok t0, t1, … közöttük
for (let i = 0; i <= panels; i++) {
  const ends = i === 0 ? [DofID.Dx, DofID.Dz] : i === panels ? [DofID.Dz] : []
  domain.createNode(`b${i}`, [i * w, 0, 0], ends)
}
for (let i = 0; i < panels; i++) {
  domain.createNode(`t${i}`, [(i + 0.5) * w, 0, -h])
  lc.createNodalLoad(`t${i}`, { [DofID.Dz]: 8e3 })
}

const members: Beam2D[] = []
const bar = (a: string, b: string) =>
  members.push(domain.createBeam2D(`${a}-${b}`, [a, b], 1, 1, [true, true]))
for (let i = 0; i < panels; i++) {
  bar(`b${i}`, `b${i + 1}`) // alsó öv
  bar(`b${i}`, `t${i}`) // felfelé tartó ferde rácsrúd
  bar(`t${i}`, `b${i + 1}`) // lefelé tartó ferde rácsrúd
  if (i > 0) bar(`t${i - 1}`, `t${i}`) // felső öv
}
solver.solve()

for (const m of members) {
  console.log(m.label, (m.computeNormalForceAt(lc, 0) / 1e3).toFixed(2))
}
```

A számítási idő gyorsan nő a mérettel: néhány tucat mező még nem gond, lásd [Modellméret](/hu/solver/solving#model-size). Ha minden generált rácsos tartót meg szeretnél rajzolni, megoldással vagy anélkül, lásd az @edubeam/plot [Feladatok és dolgozatok](/hu/plot/exercises) oldalát.

## Amire érdemes figyelni {#things-to-notice}

- **Csukló minden rúdvégen.** Így minden csomópont szabadon elfordulhat, és a számítómag az elfordulását 0-nak adja meg. Egy ilyen csomópontra működő nyomatékot semmi sem tud felvenni, és [a megoldás nem sikerül](/hu/solver/solving#when-solving-fails).
- **Terhek a csomópontokban.** A rúd hossza mentén ható teher meghajlítaná a rudat: ekkor az már gerenda, nem rácsrúd, és nyomatéki ábrája is lesz.

A [síkbeli rácsos tartó oktatóanyaga](/hu/tutorials/truss) egy rácsos tartót épít fel az EduBeam alkalmazásban, a [Rácsrúdelem](/hu/elements/truss) oldal pedig levezeti a rúd merevségét.
