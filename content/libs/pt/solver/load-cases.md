---
title: Casos de carga
description: "Resolva vários casos de carga de um modelo do @edubeam/fem de uma só vez e combine os resultados por superposição em combinações de cargas e envoltórias."
order: 8
source: site
---

# Casos de carga {#load-cases}

Um caso de carga é um conjunto de cargas resolvidas juntas. O solver começa com um; adicione outros, e um único `solve()` resolve todos com uma só matriz de rigidez. A análise é linear, então os resultados de casos diferentes podem ser multiplicados por fatores e somados: uma combinação de cargas não é nada além disso.

## Adicionar um caso de carga {#add-a-load-case}

```ts [load-cases.ts]
import { DofID, LinearStaticSolver, LoadCase } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const dead = solver.loadCases[0] // o caso com que todo solver começa
const live = new LoadCase('live', domain)
solver.loadCases.push(live)

dead.createBeamElementUniformEdgeLoad(1, [0, 10e3], true) // 10 kN/m
live.createBeamConcentratedLoad(1, [0, 20e3, 0, 3], true) // 20 kN no meio do vão
solver.solve() // resolve todos os casos de carga

console.log(beam.computeBendingMomentAt(dead, 3)) // qL²/8
console.log(beam.computeBendingMomentAt(live, 3)) // PL/4
```

```text [Saída]
45000
30000
```

Todo método de resultado recebe o caso de carga que deve ler. O primeiro caso tem o rótulo `'DefaultLC'`; os rótulos são apenas nomes, e o solver distingue os casos pelo objeto.

## Combinar os casos {#combine-them}

Multiplique o resultado de cada caso pelo seu fator e some. Para o estado-limite último do Eurocódigo, $1{,}35\,G + 1{,}5\,Q$, no meio do vão:

```ts
1.35 * beam.computeBendingMomentAt(dead, 3) +
  1.5 * beam.computeBendingMomentAt(live, 3) // 105750 N·m
```

O mesmo vale para as reações, os deslocamentos e qualquer outro resultado. Ao longo de uma barra inteira, combine ponto a ponto: os arrays de `computeBendingMoment(lc, n)` usam os mesmos `x` para todos os casos.

```ts
const n = 60
const g = beam.computeBendingMoment(dead, n).M
const q = beam.computeBendingMoment(live, n).M
const uls = g.map((m, i) => 1.35 * m + 1.5 * q[i])
Math.max(...uls) // 105750 N·m, em x = 3
```

Uma envoltória, o maior e o menor valor entre várias combinações, é um `Math.max` e um `Math.min` sobre esses arrays, ponto a ponto. Para uma carga móvel, resolva uma vez para cada posição da carga: o [exemplo da linha de influência](/pt/solver/scripts#an-influence-line-as-csv) faz isso.

## No aplicativo EduBeam {#in-the-edubeam-app}

O aplicativo resolve um caso de carga por vez, então as combinações são um ponto em que a biblioteca vai além dele. Um modelo com vários casos ainda pode ser [desenhado](/pt/solver/drawing) caso a caso: o `StructurePlot` do @edubeam/plot recebe na prop `loadCase` um índice de `solver.loadCases`.
