---
title: Grinzi cu zăbrele
description: "O grindă cu zăbrele Warren cu noduri articulate în @edubeam/fem, cu efortul din fiecare bară verificat prin metoda secțiunilor, și o buclă care generează grinzi cu zăbrele cu oricâte panouri."
order: 14
source: site
---

# Grinzi cu zăbrele {#trusses}

O grindă cu zăbrele este formată din bare articulate la ambele capete și încărcate în noduri, așa că fiecare bară preia doar forță axială. Acest exemplu construiește o grindă cu zăbrele Warren din două liste, verifică manual efortul din fiecare bară și apoi generează într-o buclă grinzi cu zăbrele de orice dimensiune.

::model-figure{caption="O grindă cu zăbrele Warren: deschidere de 9 m, înălțime de 1,8 m, 8 kN în fiecare nod superior"}
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

// O grindă cu zăbrele Warren: deschidere 9 m, înălțime 1,8 m, talpa inferioară A-B-C-D, talpa superioară E-F-G
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

// Fiecare etichetă numește cele două noduri ale barei. Articulată la ambele capete: doar forță axială.
const bars = ['AB', 'BC', 'CD', 'EF', 'FG', 'AE', 'EB', 'BF', 'FC', 'CG', 'GD']
const members = bars.map((bar) =>
  domain.createBeam2D(bar, [bar[0], bar[1]], 1, 1, [true, true])
)

const lc = solver.loadCases[0]
for (const top of ['E', 'F', 'G']) {
  lc.createNodalLoad(top, { [DofID.Dz]: 8e3 }) // 8 kN în jos
}
solver.solve()

for (const bar of members) {
  const n = bar.computeNormalForceAt(lc, 0) / 1e3
  console.log(bar.label, n.toFixed(2), n > 0 ? 'tension' : 'compression')
}
```

```text [Rezultat]
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

Forța axială dintr-o bară este constantă, așa că e suficient să o citești la `x = 0`. Etichetele din două litere sunt totodată perechile de noduri: `bar[0]` și `bar[1]`.

## Verificare prin calcul manual {#check-it-by-hand}

Fiecare reazem preia jumătate din cei 24 kN, adică 12 kN. Secționează grinda cu zăbrele și scrie ecuația de momente față de nodul opus barei secționate, ca în [metoda secțiunilor](/ro/tutorials/truss):

| Bară | Secțiune | Efort |
| --- | --- | --- |
| BC, talpa inferioară | momente față de F: $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$ | 16,67 kN, întindere |
| EF, talpa superioară | momente față de B: $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$ | 13,33 kN, compresiune |
| AE, diagonala de capăt | nodul A: $12 \cdot \sqrt{1{,}5^2 + 1{,}8^2}/1{,}8$ | 15,62 kN, compresiune |
| EB, diagonală | forța tăietoare din panou, $12 - 8 = 4$ kN: $4 \cdot 2{,}343/1{,}8$ | 5,21 kN, întindere |

Secțiunea barelor nu schimbă eforturile dintr-o grindă cu zăbrele static determinată; ea stabilește doar cât de mult se deplasează nodurile. Figura de mai sus folosește o altă secțiune, cea din aplicația EduBeam, și dă aceleași eforturi.

## Oricâte panouri {#any-number-of-panels}

Pentru a genera grinzi cu zăbrele, pentru exerciții sau pentru un studiu parametric, construiește nodurile și barele într-o buclă, panou cu panou. Cu `panels = 3` obții grinda cu zăbrele de mai sus, iar programul afișează aceleași eforturi; schimbă `panels`, `w` și `h` pentru alta.

```ts [warren.ts]
import { type Beam2D, DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })
const lc = solver.loadCases[0]

const panels = 3 // numărul de panouri ale tălpii inferioare
const w = 3 // lățimea panoului, m
const h = 1.8 // înălțimea, m

// Noduri inferioare b0, b1, … pe o articulație și un reazem simplu; noduri superioare t0, t1, … între ele
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
  bar(`b${i}`, `b${i + 1}`) // talpa inferioară
  bar(`b${i}`, `t${i}`) // diagonală în sus
  bar(`t${i}`, `b${i + 1}`) // diagonală în jos
  if (i > 0) bar(`t${i - 1}`, `t${i}`) // talpa superioară
}
solver.solve()

for (const m of members) {
  console.log(m.label, (m.computeNormalForceAt(lc, 0) / 1e3).toFixed(2))
}
```

Timpul de calcul crește repede cu dimensiunea: câteva zeci de panouri nu sunt o problemă, vezi [Dimensiunea modelului](/ro/solver/solving#model-size). Pentru a desena fiecare grindă cu zăbrele generată, cu sau fără răspunsuri, vezi [Exerciții și teste](/ro/plot/exercises) din @edubeam/plot.

## De reținut {#things-to-notice}

- **Articulații la fiecare capăt de bară.** Fiecare nod se poate atunci roti liber, iar programul de calcul îi dă rotirea 0. Un moment aplicat într-un astfel de nod nu are ce să-l preia, iar [calculul eșuează](/ro/solver/solving#when-solving-fails).
- **Încărcări în noduri.** O încărcare în lungul unei bare ar încovoia-o: atunci ar fi o grindă, nu o bară de grindă cu zăbrele, și ar avea diagramă de momente.

Tutorialul [Grindă cu zăbrele plană](/ro/tutorials/truss) construiește o grindă cu zăbrele în aplicația EduBeam, iar pagina [Elementul de bară articulată](/ro/elements/truss) deduce rigiditatea barei.
