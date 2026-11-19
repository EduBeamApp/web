---
title: Teplota a poklesy podpor
description: "Zatěžte prvky v @edubeam/fem rovnoměrnou a nerovnoměrnou změnou teploty a posuňte podpory o předepsané posunutí, na ověřených příkladech."
order: 7
---

# Teplota a poklesy podpor {#temperature-and-settlements}

Dvě zatížení, která nejsou silami: prvek, který chce změnit svou délku nebo křivost, a podpora, která se posune. Obě vyvolají vnitřní síly jen tam, kde jim konstrukce brání, a proto se dobře hodí k procvičení staticky neurčitých konstrukcí. Teorii k oběma najdete v oddílu [Prvková zatížení](/cs/elements/beam#element-loads) teoretického manuálu aplikace.

## Teplota {#temperature}

```ts
lc.createBeamTemperatureLoad(member, [dTc, dTb, dTt])
```

| Hodnota | Význam | Účinek na volný prvek |
| --- | --- | --- |
| `dTc` | změna v těžišti, K | prodlouží se o $\alpha\,\Delta T_c\,L$ |
| `dTb` | změna v dolních vláknech (na straně lokální +z), K | spolu s `dTt` se zakřiví o $\kappa = \alpha\,(\Delta T_b - \Delta T_t)/h$ |
| `dTt` | změna v horních vláknech, K | |

Prvek ohýbá jen rozdíl `dTb - dTt`, takže `[30, 20, 0]` a `[30, 10, -10]` je totéž zatížení. Výpočet potřebuje `alpha` materiálu a `h` průřezu; bez `h` vyjdou momenty `NaN`.

Oboustranně vetknutý nosník se nemůže prodloužit ani zakřivit, a proto je místo toho stlačen a ohnut: $N = -EA\,\alpha\,\Delta T_c$ a $M = -EI\,\alpha\,(\Delta T_b - \Delta T_t)/h$.

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

// Těžiště o 30 K teplejší, dolní vlákna o 20 K teplejší než horní
lc.createBeamTemperatureLoad(1, [30, 20, 0])
solver.solve()

beam.computeNormalForceAt(lc, 3) // -215460 N: EA · 12e-6 · 30
beam.computeBendingMomentAt(lc, 3) // -4896.4 N·m: EI · 12e-6 · 20 / 0.2
```

Pro IPE 200 je $EA = 598{,}5$ MN a $EI = 4{,}0803$ MNm². Při teplejších dolních vláknech by se volný nosník prohnul tak, že by se mu konce zvedly, takže ho vetknutí ohne opačně: vznikne záporný moment s tahem v horních vláknech.

::model-figure{caption="Oboustranně vetknutý nosník, v těžišti o 30 K teplejší a dole o 20 K teplejší než nahoře"}
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

Na prostém nosníku nevyvolá stejné zatížení žádné vnitřní síly, jen pohyb: posuvný kloub se posune ven o $\alpha\,\Delta T_c\,L = 2{,}16$ mm a střed rozpětí poklesne o $\kappa L^2/8 = 5{,}4$ mm.

## Předepsaná posunutí {#prescribed-displacements}

```ts
lc.createPrescribedDisplacement(node, { [DofID.Dz]: 0.01 })
```

Posune podporu o zadanou hodnotu: v metrech pro `Dx` a `Dz`, v radiánech pro `Ry`, ve vlastních osách uzlu. Musí jít o stupeň volnosti, který podpora uzlu drží; u volného stupně volnosti se hodnota bez varování ignoruje.

Jednostranně vetknutý nosník, jehož posuvný kloub poklesne o 10 mm, v novém řešiči s materiálem a průřezem z příkladu s teplotou:

```ts
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // vetknutí
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // posuvný kloub
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

lc.createPrescribedDisplacement('B', { [DofID.Dz]: 0.01 }) // 10 mm dolů
solver.solve()

domain.getNode('B').getReactions(lc).values // [566.7] N: 3EIw/L³
beam.computeBendingMomentAt(lc, 0) // -3400.2 N·m v A: 3EIw/L²
```

Posuvný kloub musí nosník stáhnout dolů, aby ho přinutil svůj pokles sledovat, takže jeho reakce je kladná, ve směru +z: $3EIw/L^3 = 3 \cdot 4{,}0803 \times 10^6 \cdot 0{,}01 / 216 = 566{,}7$ N.

::model-figure{caption="Posuvný kloub jednostranně vetknutého nosníku poklesne o 10 mm: −3,4 kNm ve vetknutí"}
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

Jak aplikace obě zatížení zobrazuje, popisuje stránka [Zatížení](/cs/essentials/loads).
