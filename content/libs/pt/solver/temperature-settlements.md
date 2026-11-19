---
title: Temperatura e recalques
description: "Aplique a barras do @edubeam/fem uma variação uniforme e uma diferença de temperatura, e desloque apoios com um deslocamento prescrito, com exemplos conferidos."
order: 7
source: site
---

# Temperatura e recalques {#temperature-and-settlements}

Duas cargas que não são forças: uma barra que tende a mudar de comprimento ou de curvatura, e um apoio que se desloca. Ambas só provocam esforços internos onde a estrutura impede esses movimentos, o que as torna um bom tema de exercícios sobre estruturas hiperestáticas. A teoria das duas está na seção [Cargas de elemento](/pt/elements/beam#element-loads) do manual teórico do aplicativo.

## Temperatura {#temperature}

```ts
lc.createBeamTemperatureLoad(member, [dTc, dTb, dTt])
```

| Valor | Significado | Efeito numa barra livre |
| --- | --- | --- |
| `dTc` | variação no centroide, K | alonga-se $\alpha\,\Delta T_c\,L$ |
| `dTb` | variação na fibra inferior (o lado +z local), K | com `dTt`, curva-se com $\kappa = \alpha\,(\Delta T_b - \Delta T_t)/h$ |
| `dTt` | variação na fibra superior, K | |

Só a diferença `dTb - dTt` flexiona a barra, então `[30, 20, 0]` e `[30, 10, -10]` são a mesma carga. A carga precisa do `alpha` do material e do `h` da seção; sem `h`, os momentos dão `NaN`.

Uma viga biengastada não consegue nem alongar-se nem curvar-se, então ela fica comprimida e flexionada: $N = -EA\,\alpha\,\Delta T_c$ e $M = -EI\,\alpha\,(\Delta T_b - \Delta T_t)/h$.

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

// Centroide 30 K mais quente, fibra inferior 20 K mais quente que a superior
lc.createBeamTemperatureLoad(1, [30, 20, 0])
solver.solve()

beam.computeNormalForceAt(lc, 3) // -215460 N: EA · 12e-6 · 30
beam.computeBendingMomentAt(lc, 3) // -4896.4 N·m: EI · 12e-6 · 20 / 0.2
```

Com o IPE 200, $EA = 598{,}5$ MN e $EI = 4{,}0803$ MNm². Uma fibra inferior mais quente faz uma viga livre levantar as extremidades, então os engastes a flexionam no sentido contrário: momento negativo, com tração na fibra superior.

::model-figure{caption="Uma viga biengastada, 30 K mais quente no centroide e 20 K mais quente embaixo do que em cima"}
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

Numa viga biapoiada, a mesma carga não provoca esforço interno nenhum, só deslocamentos: o apoio móvel desliza $\alpha\,\Delta T_c\,L = 2{,}16$ mm para fora e o meio do vão desce $\kappa L^2/8 = 5{,}4$ mm.

## Deslocamentos prescritos {#prescribed-displacements}

```ts
lc.createPrescribedDisplacement(node, { [DofID.Dz]: 0.01 })
```

Desloca um apoio de um valor dado: em metros para `Dx` e `Dz`, em radianos para `Ry`, nos eixos do próprio nó. O GL precisa ser um dos que o apoio do nó restringe; num GL livre, o valor é ignorado sem nenhum aviso.

Uma viga engastada e apoiada cujo apoio móvel sofre um recalque de 10 mm, num novo solver com o material e a seção do exemplo de temperatura:

```ts
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // engaste
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // apoio móvel
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

lc.createPrescribedDisplacement('B', { [DofID.Dz]: 0.01 }) // 10 mm para baixo
solver.solve()

domain.getNode('B').getReactions(lc).values // [566.7] N: 3EIw/L³
beam.computeBendingMomentAt(lc, 0) // -3400.2 N·m em A: 3EIw/L²
```

O apoio móvel precisa puxar a viga para baixo para que ela o acompanhe, por isso a reação dele é positiva, no sentido +z: $3EIw/L^3 = 3 \cdot 4{,}0803 \times 10^6 \cdot 0{,}01 / 216 = 566{,}7$ N.

::model-figure{caption="O apoio móvel de uma viga engastada e apoiada sofre um recalque de 10 mm: −3,4 kNm no engaste"}
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

Como o aplicativo desenha as duas cargas está explicado em [Cargas](/pt/essentials/loads).
