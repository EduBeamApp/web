---
title: Temperatură și cedări de reazem
description: "Încarcă barele în @edubeam/fem cu o variație uniformă de temperatură și o diferență de temperatură între fețe și deplasează reazemele cu o deplasare impusă, pe exemple verificate."
order: 7
source: site
---

# Temperatură și cedări de reazem {#temperature-and-settlements}

Două încărcări care nu sunt forțe: o bară care vrea să-și schimbe lungimea sau curbura și un reazem care se deplasează. Ambele produc eforturi doar acolo unde structura le împiedică, ceea ce le face exemple bune pentru structurile static nedeterminate. Teoria pentru amândouă se află în [Încărcări pe element](/ro/elements/beam#element-loads), în manualul teoretic al aplicației.

## Temperatură {#temperature}

```ts
lc.createBeamTemperatureLoad(member, [dTc, dTb, dTt])
```

| Valoare | Semnificație | Efect asupra unei bare libere |
| --- | --- | --- |
| `dTc` | variația în centrul de greutate, K | se lungește cu $\alpha\,\Delta T_c\,L$ |
| `dTb` | variația în fibra inferioară (pe partea +z locală), K | împreună cu `dTt`, se curbează cu $\kappa = \alpha\,(\Delta T_b - \Delta T_t)/h$ |
| `dTt` | variația în fibra superioară, K | |

Doar diferența `dTb - dTt` încovoaie bara, deci `[30, 20, 0]` și `[30, 10, -10]` sunt aceeași încărcare. Încărcarea are nevoie de `alpha` al materialului și de `h` al secțiunii; fără `h`, momentele sunt `NaN`.

O grindă încastrată la ambele capete nu se poate nici lungi, nici curba, așa că este în schimb comprimată și încovoiată: $N = -EA\,\alpha\,\Delta T_c$ și $M = -EI\,\alpha\,(\Delta T_b - \Delta T_t)/h$.

```ts [temperature.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial(1, { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [6, 0, 0], fixed)
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

// Centrul de greutate mai cald cu 30 K, fața de jos mai caldă cu 20 K decât cea de sus
lc.createBeamTemperatureLoad(1, [30, 20, 0])
solver.solve()

beam.computeNormalForceAt(lc, 3) // -215460 N: EA · 12e-6 · 30
beam.computeBendingMomentAt(lc, 3) // -4896.4 N·m: EI · 12e-6 · 20 / 0.2
```

Pentru IPE 200, $EA = 598{,}5$ MN și $EI = 4{,}0803$ MNm². O fibră inferioară mai caldă face ca o grindă liberă să se ridice la capete, așa că legăturile o încovoaie în sens opus: un moment negativ, cu fibra superioară întinsă.

::model-figure{caption="O grindă încastrată la ambele capete, mai caldă cu 30 K în centrul de greutate și cu 20 K mai caldă jos decât sus"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 30, bottom: 20, top: 0 } }
results: [M, N]
show: [nodeLabels]
material: { e: 210e9, alpha: 12e-6 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

La o grindă simplu rezemată, aceeași încărcare nu produce niciun efort, doar deplasări: reazemul simplu alunecă spre exterior cu $\alpha\,\Delta T_c\,L = 2{,}16$ mm, iar mijlocul deschiderii coboară cu $\kappa L^2/8 = 5{,}4$ mm.

## Deplasări impuse {#prescribed-displacements}

```ts
lc.createPrescribedDisplacement(node, { [DofID.Dz]: 0.01 })
```

Deplasează un reazem cu o valoare dată: în metri pentru `Dx` și `Dz`, în radiani pentru `Ry`, în axele proprii ale nodului. Gradul de libertate trebuie să fie unul blocat de reazemul nodului; pe un grad de libertate liber, valoarea este ignorată fără avertisment.

O grindă încastrată și simplu rezemată, al cărei reazem simplu cedează cu 10 mm, într-un program de calcul nou, cu materialul și secțiunea din exemplul cu temperatura:

```ts
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // încastrare
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // reazem simplu
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

lc.createPrescribedDisplacement('B', { [DofID.Dz]: 0.01 }) // 10 mm în jos
solver.solve()

domain.getNode('B').getReactions(lc).values // [566.7] N: 3EIw/L³
beam.computeBendingMomentAt(lc, 0) // -3400.2 N·m în A: 3EIw/L²
```

Reazemul simplu trebuie să tragă grinda în jos ca ea să-l urmeze, deci reacțiunea lui este pozitivă, după +z: $3EIw/L^3 = 3 \cdot 4{,}0803 \times 10^6 \cdot 0{,}01 / 216 = 566{,}7$ N.

::model-figure{caption="Reazemul simplu al unei grinzi încastrate la un capăt cedează cu 10 mm: −3,4 kNm în încastrare"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

Cum desenează aplicația ambele încărcări este descris în [Încărcări](/ro/essentials/loads).
