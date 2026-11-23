---
title: Priehradové konštrukcie
description: "Kĺbový Warrenov priehradový nosník v @edubeam/fem, sily vo všetkých prútoch overené priesečnou metódou a cyklus, ktorý vytvorí nosník s ľubovoľným počtom polí."
order: 14
source: site
---

# Priehradové konštrukcie {#trusses}

Priehradová konštrukcia sa skladá z prútov kĺbovo pripojených na oboch koncoch a zaťažených v uzloch, takže každý prút prenáša len normálovú silu. Tento postup zostaví Warrenov priehradový nosník z dvoch zoznamov, všetky sily v prútoch overí ručne a nakoniec v cykle vytvorí priehradové nosníky ľubovoľnej veľkosti.

::model-figure{caption="Warrenov priehradový nosník: rozpätie 9 m, výška 1,8 m, 8 kN v každom hornom uzle"}
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

// Warrenov priehradový nosník: rozpätie 9 m, výška 1.8 m, dolný pás A-B-C-D, horný pás E-F-G
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

// Označenie prúta sa skladá z jeho dvoch uzlov. Kĺby na oboch koncoch: len normálová sila.
const bars = ['AB', 'BC', 'CD', 'EF', 'FG', 'AE', 'EB', 'BF', 'FC', 'CG', 'GD']
const members = bars.map((bar) =>
  domain.createBeam2D(bar, [bar[0], bar[1]], 1, 1, [true, true])
)

const lc = solver.loadCases[0]
for (const top of ['E', 'F', 'G']) {
  lc.createNodalLoad(top, { [DofID.Dz]: 8e3 }) // 8 kN nadol
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

Normálová sila v prúte je konštantná, takže ju stačí prečítať v `x = 0`. Dvojpísmenové označenia zároveň slúžia ako dvojice uzlov: `bar[0]` a `bar[1]`.

## Kontrola ručným výpočtom {#check-it-by-hand}

Každá podpera nesie polovicu celkových 24 kN, teda 12 kN. Konštrukciu prerežte a zostavte momentovú podmienku k uzlu oproti prerezanému prútu, ako pri [priesečnej metóde](/sk/tutorials/truss):

| Prút | Rez | Sila |
| --- | --- | --- |
| BC, dolný pás | momentová podmienka k F: $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$ | ťah 16,67 kN |
| EF, horný pás | momentová podmienka k B: $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$ | tlak 13,33 kN |
| AE, krajná diagonála | uzol A: $12 \cdot \sqrt{1{,}5^2 + 1{,}8^2}/1{,}8$ | tlak 15,62 kN |
| EB, diagonála | priečna sila v poli, $12 - 8 = 4$ kN: $4 \cdot 2{,}343/1{,}8$ | ťah 5,21 kN |

Na sily v prútoch staticky určitej priehradovej konštrukcie prierez vplyv nemá; určuje len to, o koľko sa uzly posunú. Obrázok vyššie používa iný prierez, ten z aplikácie EduBeam, a dáva rovnaké sily.

## Ľubovoľný počet polí {#any-number-of-panels}

Ak chcete priehradové nosníky generovať, pre príklady alebo pre parametrickú štúdiu, zostavte uzly a prúty v cykle, pole po poli. S `panels = 3` vznikne nosník vyššie a program vypíše rovnaké sily; pre iný nosník zmeňte `panels`, `w` a `h`.

```ts [warren.ts]
import { type Beam2D, DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })
const lc = solver.loadCases[0]

const panels = 3 // počet polí dolného pásu
const w = 3 // šírka poľa, m
const h = 1.8 // výška, m

// Dolné uzly b0, b1, … na pevnom a posuvnom kĺbe; horné uzly t0, t1, … medzi nimi
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
  bar(`b${i}`, `b${i + 1}`) // dolný pás
  bar(`b${i}`, `t${i}`) // diagonála nahor
  bar(`t${i}`, `b${i + 1}`) // diagonála nadol
  if (i > 0) bar(`t${i - 1}`, `t${i}`) // horný pás
}
solver.solve()

for (const m of members) {
  console.log(m.label, (m.computeNormalForceAt(lc, 0) / 1e3).toFixed(2))
}
```

Čas výpočtu s veľkosťou rýchlo rastie: niekoľko desiatok polí je v poriadku, pozrite [Veľkosť modelu](/sk/solver/solving#model-size). Ako každý vygenerovaný nosník vykresliť, s výsledkami alebo bez nich, opisuje stránka [Príklady a písomky](/sk/plot/exercises) dokumentácie @edubeam/plot.

## Čoho si všimnúť {#things-to-notice}

- **Kĺby na všetkých koncoch prútov.** Každý uzol sa potom môže voľne pootočiť a riešič vráti jeho pootočenie 0. Moment zadaný do takého uzla nemá nič, čo by ho prenieslo, a [výpočet zlyhá](/sk/solver/solving#when-solving-fails).
- **Zaťaženie v uzloch.** Zaťaženie pozdĺž prúta by ho ohýbalo: potom už nejde o priehradový prút, ale o nosník, a ten má priebeh ohybového momentu.

Návod [Rovinná priehradová konštrukcia](/sk/tutorials/truss) zostaví priehradovú konštrukciu v aplikácii EduBeam a stránka [Priehradový prút](/sk/elements/truss) odvodzuje tuhosť prúta.
