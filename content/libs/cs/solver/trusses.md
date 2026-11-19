---
title: Příhradové konstrukce
description: "Kloubový Warrenův příhradový nosník v @edubeam/fem, síly ve všech prutech ověřené průsečnou metodou a cyklus, který vytvoří nosník o libovolném počtu polí."
order: 14
---

# Příhradové konstrukce {#trusses}

Příhradová konstrukce se skládá z prutů kloubově připojených na obou koncích a zatížených ve styčnících, takže každý prut přenáší jen normálovou sílu. Tento postup sestaví Warrenův příhradový nosník ze dvou seznamů, všechny síly v prutech ověří ručně a nakonec v cyklu vytvoří příhradové nosníky libovolné velikosti.

::model-figure{caption="Warrenův příhradový nosník: rozpětí 9 m, výška 1,8 m, 8 kN v každém horním styčníku"}
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

// Warrenův příhradový nosník: rozpětí 9 m, výška 1.8 m, dolní pás A-B-C-D, horní pás E-F-G
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

// Označení prutu se skládá z jeho dvou uzlů. Klouby na obou koncích: jen normálová síla.
const bars = ['AB', 'BC', 'CD', 'EF', 'FG', 'AE', 'EB', 'BF', 'FC', 'CG', 'GD']
const members = bars.map((bar) =>
  domain.createBeam2D(bar, [bar[0], bar[1]], 1, 1, [true, true])
)

const lc = solver.loadCases[0]
for (const top of ['E', 'F', 'G']) {
  lc.createNodalLoad(top, { [DofID.Dz]: 8e3 }) // 8 kN dolů
}
solver.solve()

for (const bar of members) {
  const n = bar.computeNormalForceAt(lc, 0) / 1e3
  console.log(bar.label, n.toFixed(2), n > 0 ? 'tension' : 'compression')
}
```

```text [Výstup]
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

Normálová síla v prutu je konstantní, takže ji stačí přečíst v `x = 0`. Dvoupísmenná označení zároveň slouží jako dvojice uzlů: `bar[0]` a `bar[1]`.

## Kontrola ručním výpočtem {#check-it-by-hand}

Každá podpora nese polovinu celkových 24 kN, tedy 12 kN. Konstrukci přeřízněte a sestavte momentovou podmínku ke styčníku naproti přeříznutému prutu, jako v [průsečné metodě](/cs/tutorials/truss):

| Prut | Řez | Síla |
| --- | --- | --- |
| BC, dolní pás | momentová podmínka k F: $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$ | tah 16,67 kN |
| EF, horní pás | momentová podmínka k B: $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$ | tlak 13,33 kN |
| AE, krajní diagonála | styčník A: $12 \cdot \sqrt{1{,}5^2 + 1{,}8^2}/1{,}8$ | tlak 15,62 kN |
| EB, diagonála | posouvající síla v poli, $12 - 8 = 4$ kN: $4 \cdot 2{,}343/1{,}8$ | tah 5,21 kN |

Na síly v prutech staticky určité příhradové konstrukce průřez vliv nemá; určuje jen to, o kolik se styčníky posunou. Obrázek výše používá jiný průřez, ten z aplikace EduBeam, a dává stejné síly.

## Libovolný počet polí {#any-number-of-panels}

Chcete-li příhradové nosníky generovat, pro příklady nebo pro parametrickou studii, sestavte styčníky a pruty v cyklu, pole po poli. S `panels = 3` vznikne nosník výše a program vypíše stejné síly; pro jiný nosník změňte `panels`, `w` a `h`.

```ts [warren.ts]
import { type Beam2D, DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })
const lc = solver.loadCases[0]

const panels = 3 // počet polí dolního pásu
const w = 3 // šířka pole, m
const h = 1.8 // výška, m

// Dolní styčníky b0, b1, … na kloubu a posuvném kloubu; horní styčníky t0, t1, … mezi nimi
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
  bar(`b${i}`, `b${i + 1}`) // dolní pás
  bar(`b${i}`, `t${i}`) // diagonála nahoru
  bar(`t${i}`, `b${i + 1}`) // diagonála dolů
  if (i > 0) bar(`t${i - 1}`, `t${i}`) // horní pás
}
solver.solve()

for (const m of members) {
  console.log(m.label, (m.computeNormalForceAt(lc, 0) / 1e3).toFixed(2))
}
```

Doba výpočtu s velikostí rychle roste: několik desítek polí je v pořádku, viz [Velikost modelu](/cs/solver/solving#model-size). Jak každý vygenerovaný nosník vykreslit, s výsledky nebo bez nich, popisuje stránka [Příklady a písemky](/cs/plot/exercises) dokumentace @edubeam/plot.

## Čeho si všimnout {#things-to-notice}

- **Klouby na všech koncích prutů.** Každý styčník se pak může volně pootočit a řešič vrátí jeho pootočení 0. Moment zadaný do takového styčníku nemá nic, co by ho přeneslo, a [výpočet selže](/cs/solver/solving#when-solving-fails).
- **Zatížení ve styčnících.** Zatížení podél prutu by ho ohýbalo: pak už nejde o příhradový prut, ale o nosník, a ten má průběh ohybového momentu.

[Návod: rovinná příhradová konstrukce](/cs/tutorials/truss) sestaví příhradovou konstrukci v aplikaci EduBeam a stránka [Příhradový prut](/cs/elements/truss) odvozuje tuhost prutu.
