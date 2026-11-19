---
title: Temperatura e cedimenti
description: "Applica alle aste di @edubeam/fem una variazione termica uniforme e una differenza di temperatura, e sposta i vincoli con uno spostamento imposto, con esempi verificati."
order: 7
source: site
---

# Temperatura e cedimenti {#temperature-and-settlements}

Due carichi che non sono forze: un’asta che vorrebbe cambiare lunghezza o curvatura, e un vincolo che si sposta. Entrambi generano forze interne solo dove la struttura glielo impedisce, e per questo si prestano bene agli esercizi sulle strutture iperstatiche. La teoria di entrambi è nella sezione [Carichi sull’elemento](/it/elements/beam#element-loads) del manuale teorico dell’app.

## Temperatura {#temperature}

```ts
lc.createBeamTemperatureLoad(member, [dTc, dTb, dTt])
```

| Valore | Significato | Effetto su un’asta libera |
| --- | --- | --- |
| `dTc` | variazione nel baricentro, K | si allunga di $\alpha\,\Delta T_c\,L$ |
| `dTb` | variazione nella fibra inferiore (il lato +z locale), K | insieme a `dTt`, si incurva con $\kappa = \alpha\,(\Delta T_b - \Delta T_t)/h$ |
| `dTt` | variazione nella fibra superiore, K | |

Solo la differenza `dTb - dTt` inflette l’asta, quindi `[30, 20, 0]` e `[30, 10, -10]` sono lo stesso carico. Servono l’`alpha` del materiale e l’`h` della sezione; senza `h` i momenti sono `NaN`.

Una trave incastrata a entrambe le estremità non può né allungarsi né incurvarsi, quindi si ritrova compressa e inflessa: $N = -EA\,\alpha\,\Delta T_c$ e $M = -EI\,\alpha\,(\Delta T_b - \Delta T_t)/h$.

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

// Baricentro più caldo di 30 K, fibra inferiore più calda di 20 K rispetto a quella superiore
lc.createBeamTemperatureLoad(1, [30, 20, 0])
solver.solve()

beam.computeNormalForceAt(lc, 3) // -215460 N: EA · 12e-6 · 30
beam.computeBendingMomentAt(lc, 3) // -4896.4 N·m: EI · 12e-6 · 20 / 0.2
```

Con l’IPE 200, $EA = 598{,}5$ MN e $EI = 4{,}0803$ MNm². Una fibra inferiore più calda fa sollevare le estremità di una trave libera, quindi gli incastri la inflettono nel verso opposto: un momento negativo, con le fibre superiori tese.

::model-figure{caption="Una trave doppiamente incastrata, 30 K più calda nel baricentro e 20 K più calda sotto che sopra"}
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

Su una trave semplicemente appoggiata lo stesso carico non genera alcuna forza interna, solo spostamenti: il carrello scorre verso l’esterno di $\alpha\,\Delta T_c\,L = 2{,}16$ mm e la mezzeria si abbassa di $\kappa L^2/8 = 5{,}4$ mm.

## Spostamenti imposti {#prescribed-displacements}

```ts
lc.createPrescribedDisplacement(node, { [DofID.Dz]: 0.01 })
```

Sposta un vincolo di una quantità data: metri per `Dx` e `Dz`, radianti per `Ry`, negli assi propri del nodo. Il GdL deve essere uno di quelli bloccati dal vincolo del nodo; su un GdL libero il valore viene ignorato senza alcun avviso.

Una trave incastrata-appoggiata il cui carrello cede di 10 mm, in un nuovo solutore con il materiale e la sezione dell’esempio sulla temperatura:

```ts
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // incastro
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // carrello
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

lc.createPrescribedDisplacement('B', { [DofID.Dz]: 0.01 }) // 10 mm verso il basso
solver.solve()

domain.getNode('B').getReactions(lc).values // [566.7] N: 3EIw/L³
beam.computeBendingMomentAt(lc, 0) // -3400.2 N·m in A: 3EIw/L²
```

Il carrello deve tirare la trave verso il basso perché questa lo segua, quindi la sua reazione è positiva, lungo +z: $3EIw/L^3 = 3 \cdot 4{,}0803 \times 10^6 \cdot 0{,}01 / 216 = 566{,}7$ N.

::model-figure{caption="Il carrello di una trave incastrata-appoggiata cede di 10 mm: −3,4 kNm all’incastro"}
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

La pagina [Carichi](/it/essentials/loads) della guida spiega come l’app disegna entrambi i carichi.
