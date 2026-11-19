---
title: Cargas nodais e nas barras
description: "Aplique forças e momentos nos nós e cargas uniformes, trapezoidais e concentradas nas barras, em eixos globais ou locais, com o @edubeam/fem; depois altere-as."
order: 6
group: Cargas
source: site
---

# Cargas nodais e nas barras {#nodal-and-member-loads}

As cargas pertencem a um caso de carga. O solver começa com um, `solver.loadCases[0]`, e cada método `create…` dele adiciona uma carga e a retorna. Para vários casos e as suas combinações, veja [Casos de carga](/pt/solver/load-cases).

Os valores são dados em N, N/m e N·m e seguem os [eixos](/pt/solver/conventions#axes): +z é para baixo, e um momento positivo é anti-horário.

## Uma viga com todos os tipos de carga {#a-beam-with-every-kind}

Uma viga de 8 m sobre um apoio fixo e um apoio móvel, com uma carga distribuída que cresce de 4 para 10 kN/m, uma carga concentrada de 20 kN, um momento concentrado de 10 kNm e uma força horizontal no apoio móvel:

```ts [loads.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // apoio fixo
domain.createNode('B', [8, 0, 0], [DofID.Dz]) // apoio móvel
domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
// 4 kN/m em A crescendo até 10 kN/m em B, para baixo
lc.createBeamElementTrapezoidalEdgeLoad(1, [0, 4e3], [0, 10e3], false)
// [fx, fz, my, a]: 20 kN para baixo, a 2 m de A
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], false)
// um momento concentrado anti-horário de 10 kNm, a 6 m de A
lc.createBeamConcentratedLoad(1, [0, 0, 10e3, 6], false)
// 5 kN para a direita em B
lc.createNodalLoad('B', { [DofID.Dx]: 5e3 })
solver.solve()

// getReactions retorna uma Matrix do mathjs ou um array: converta para array
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

console.log(list(domain.getNode('A').getReactions(lc).values))
console.log(list(domain.getNode('B').getReactions(lc).values))
```

```text [Saída]
[ -5000, -40250 ]
[ -35750 ]
```

À mão: a carga distribuída soma 56 kN e atua a 4,571 m de A, então o equilíbrio de momentos em relação a A dá $8R_B = 56 \cdot 4{,}571 + 20 \cdot 2 - 10 = 286$, $R_B = 35{,}75$ kN para cima, e $R_A = 76 - 35{,}75 = 40{,}25$ kN para cima. O apoio fixo também segura os 5 kN, o que deixa a viga inteira tracionada com 5 kN.

::model-figure{caption="As mesmas cargas. A figura põe o momento concentrado num nó C a 6 m, o que dá os mesmos resultados."}
---
nodes: { A: [0, 0], C: [6, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: [4, 8.5] }
  - { member: 2, qz: [8.5, 10] }
  - { member: 1, pz: 20, at: 2 }
  - { node: C, my: 10 }
  - { node: B, fx: 5 }
results: [M]
show: [nodeLabels]
labels: horizontal
---
::

## Cargas nodais {#nodal-loads}

```ts
lc.createNodalLoad(node, { [DofID.Dx]: fx, [DofID.Dz]: fz, [DofID.Ry]: my }, lcs)
```

Informe só as componentes de que precisa. Os valores estão em eixos globais ou, com `lcs` igual a `true`, nos eixos do próprio nó, para um nó girado com [`updateLcs`](/pt/solver/nodes-supports#inclined-supports). Uma força num GL restringido pelo apoio vai direto para a reação e não flexiona nada.

## Cargas nas barras {#member-loads}

| Método | Valores | Carga |
| --- | --- | --- |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | N/m | uniforme em toda a barra |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | N/m | linear, do primeiro nó ao segundo |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | N, N·m, m | uma força e um momento concentrado, a `a` metros do primeiro nó |

As cargas distribuídas sempre cobrem a barra inteira. Para uma carga em parte de um vão, divida a barra com um nó onde a carga começa: um nó a mais não muda nenhum resultado. Uma carga concentrada ou um momento concentrado pode ficar em qualquer ponto da barra.

### Eixos globais ou locais {#global-or-local-axes}

O último argumento, `lcs`, diz em quais eixos estão as componentes:

- `false`: x e z globais. `fz` atua na vertical, qualquer que seja a inclinação da barra.
- `true`: o x local da barra (ao longo dela) e o z local (perpendicular a ela). `fz` atua perpendicularmente à barra.

Numa barra horizontal desenhada da esquerda para a direita, os dois coincidem; desenhada da direita para a esquerda, o `fz` local aponta para cima.

::callout{type="info" title="As cargas distribuídas são por metro de barra"}
Nos dois casos, a carga atua por metro do comprimento da própria barra. Numa viga inclinada de cobertura com 5 m de comprimento e 4 m de projeção horizontal, `[0, 10e3]` em eixos globais soma 50 kN. Uma carga de neve de 10 kN/m medida em planta (na projeção horizontal) equivale a $10 \cdot 4/5 = 8$ kN/m ao longo da viga inclinada: informe `[0, 8e3]`.
::

## Alterar ou remover uma carga {#change-or-remove-a-load}

Cada método `create…` retorna a carga. Altere os valores dela e resolva de novo:

```ts
const q = lc.createBeamElementUniformEdgeLoad(1, [0, 10e3], true)
solver.solve()
q.values = [0, 20e3] // o dobro da carga
solver.solve()
```

As cargas ficam em arrays comuns, `lc.nodalLoadList` e `lc.elementLoadList` (cargas nas barras e cargas térmicas), então `lc.elementLoadList.splice(index, 1)` remove uma delas. Os nomes das propriedades de cada carga estão na [referência](/pt/solver/reference#loads).

Variações de temperatura e recalques de apoio também são cargas: veja [Temperatura e recalques](/pt/solver/temperature-settlements).
