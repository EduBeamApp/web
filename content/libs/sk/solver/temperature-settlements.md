---
title: Teplota a poklesy podpier
description: "Zaťažte prvky v @edubeam/fem rovnomernou a nerovnomernou zmenou teploty a posuňte podpery o predpísané posunutie, na overených príkladoch."
order: 7
source: site
---

# Teplota a poklesy podpier {#temperature-and-settlements}

Dve zaťaženia, ktoré nie sú silami: prvok, ktorý chce zmeniť svoju dĺžku alebo krivosť, a podpera, ktorá sa posunie. Obe vyvolajú vnútorné sily len tam, kde im konštrukcia bráni, a preto sa dobre hodia na precvičenie staticky neurčitých konštrukcií. Teóriu k obom nájdete v časti [Prvkové zaťaženie](/sk/elements/beam#element-loads) teoretickej príručky aplikácie.

## Teplota {#temperature}

```ts
lc.createBeamTemperatureLoad(member, [dTc, dTb, dTt])
```

| Hodnota | Význam | Účinok na voľný prvok |
| --- | --- | --- |
| `dTc` | zmena v ťažisku, K | predĺži sa o $\alpha\,\Delta T_c\,L$ |
| `dTb` | zmena v dolných vláknach (na strane lokálnej +z), K | spolu s `dTt` sa zakriví o $\kappa = \alpha\,(\Delta T_b - \Delta T_t)/h$ |
| `dTt` | zmena v horných vláknach, K | |

Prvok ohýba len rozdiel `dTb - dTt`, takže `[30, 20, 0]` a `[30, 10, -10]` je to isté zaťaženie. Výpočet potrebuje `alpha` materiálu a `h` prierezu; bez `h` vyjdú momenty `NaN`.

Obojstranne votknutý nosník sa nemôže predĺžiť ani zakriviť, a preto je namiesto toho stlačený a ohnutý: $N = -EA\,\alpha\,\Delta T_c$ a $M = -EI\,\alpha\,(\Delta T_b - \Delta T_t)/h$.

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

// Ťažisko o 30 K teplejšie, dolné vlákna o 20 K teplejšie ako horné
lc.createBeamTemperatureLoad(1, [30, 20, 0])
solver.solve()

beam.computeNormalForceAt(lc, 3) // -215460 N: EA · 12e-6 · 30
beam.computeBendingMomentAt(lc, 3) // -4896.4 N·m: EI · 12e-6 · 20 / 0.2
```

Pre IPE 200 je $EA = 598{,}5$ MN a $EI = 4{,}0803$ MNm². Pri teplejších dolných vláknach by sa voľný nosník prehol tak, že by sa mu konce zdvihli, takže ho votknutie ohne opačne: vznikne záporný moment s ťahom v horných vláknach.

::model-figure{caption="Obojstranne votknutý nosník, v ťažisku o 30 K teplejší a dole o 20 K teplejší ako hore"}
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

Na prostom nosníku nevyvolá rovnaké zaťaženie žiadne vnútorné sily, len pohyb: posuvný kĺb sa posunie von o $\alpha\,\Delta T_c\,L = 2{,}16$ mm a stred rozpätia poklesne o $\kappa L^2/8 = 5{,}4$ mm.

## Predpísané posunutia {#prescribed-displacements}

```ts
lc.createPrescribedDisplacement(node, { [DofID.Dz]: 0.01 })
```

Posunie podperu o zadanú hodnotu: v metroch pre `Dx` a `Dz`, v radiánoch pre `Ry`, vo vlastných osiach uzla. Musí ísť o stupeň voľnosti, ktorý podpera uzla drží; pri voľnom stupni voľnosti sa hodnota bez varovania ignoruje.

Jednostranne votknutý nosník, ktorého posuvný kĺb poklesne o 10 mm, v novom riešiči s materiálom a prierezom z príkladu s teplotou:

```ts
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // votknutie
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // posuvný kĺb
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

lc.createPrescribedDisplacement('B', { [DofID.Dz]: 0.01 }) // 10 mm nadol
solver.solve()

domain.getNode('B').getReactions(lc).values // [566.7] N: 3EIw/L³
beam.computeBendingMomentAt(lc, 0) // -3400.2 N·m v A: 3EIw/L²
```

Posuvný kĺb musí nosník stiahnuť nadol, aby ho prinútil sledovať svoj pokles, takže jeho reakcia je kladná, v smere +z: $3EIw/L^3 = 3 \cdot 4{,}0803 \times 10^6 \cdot 0{,}01 / 216 = 566{,}7$ N.

::model-figure{caption="Posuvný kĺb jednostranne votknutého nosníka poklesne o 10 mm: −3,4 kNm vo votknutí"}
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

Ako aplikácia obe zaťaženia zobrazuje, opisuje stránka [Zaťaženie](/sk/essentials/loads).
