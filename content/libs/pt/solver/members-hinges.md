---
title: Barras e rótulas
description: "Ligue nós com barras Beam2D, libere momentos com rótulas de extremidade, modele barras de treliça e obtenha as matrizes do elemento no @edubeam/fem."
order: 5
source: site
---

# Barras e rótulas {#members-and-hinges}

Toda barra é um `Beam2D`: uma viga de Timoshenko reta, de dois nós, no plano x–z, que resiste a esforço normal, esforço cortante e momento fletor. Rótulas nas suas extremidades liberam o momento ali. Os trechos de código usam os `solver`, `domain` e `lc` de um programa como o de [Primeiros passos](/pt/solver/getting-started), com o material `'steel'` e a seção `'IPE200'`.

## Criar uma barra {#create-a-member}

```ts
domain.createBeam2D(label, [startNode, endNode], material, crossSection, hinges)
```

| Argumento | Tipo | Significado |
| --- | --- | --- |
| `label` | `string \| number` | O nome da barra, guardado como string |
| `nodes` | `[label, label]` | Primeiro e segundo nó. O x local vai do primeiro para o segundo: veja [Orientação da barra](/pt/solver/conventions#member-direction). |
| `mat`, `cs` | `string \| number` | Rótulos de um material e de uma seção |
| `hinges` | `[boolean, boolean]` | Uma rótula no primeiro nó, no segundo. Opcional; padrão `[false, false]`, extremidades rígidas. |

O método retorna o `Beam2D`: guarde-o para ler os resultados. `domain.getElement(label)` o encontra de novo, mas tipado como o `Element` genérico, então o TypeScript exige `as Beam2D` antes de você ler resultados dele.

Barras que se encontram num nó sem rótulas estão ligadas rigidamente: giram juntas. Os nós, o material e a seção podem ser criados em qualquer ordem, desde que todos existam no momento do cálculo; se faltar algum, `solve()` lança um `RangeError` com o nome dele.

## Rótulas de extremidade {#end-hinges}

A rótula pertence à extremidade de uma barra, e não ao nó. Aqui a barra 2 começa com uma rótula em C, então C transmite o cortante, mas nenhum momento, do vão C–D para o balanço A–C:

```ts [hinge.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry])
domain.createNode('C', [2, 0, 0])
domain.createNode('D', [6, 0, 0], [DofID.Dz])
const ac = domain.createBeam2D(1, ['A', 'C'], 'steel', 'IPE200')
const cd = domain.createBeam2D(2, ['C', 'D'], 'steel', 'IPE200', [true, false])

lc.createBeamElementUniformEdgeLoad(2, [0, 10e3], true)
solver.solve()

cd.computeBendingMomentAt(lc, 0) // 0 na rótula
cd.computeBendingMomentAt(lc, 2) // 20000 N·m: qL²/8 do vão de 4 m
ac.computeBendingMomentAt(lc, 0) // -40000 N·m: os 20 kN vindos de C–D, a 2 m de distância
```

::model-figure{caption="Um balanço que sustenta um vão rotulado: nenhum momento em C"}
---
nodes: { A: [0, 0], C: [2, 0], D: [6, 0] }
supports: { A: fixed, D: roller }
members: [[A, C], { nodes: [C, D], hinges: [true, false] }]
loads:
  - { member: 2, qz: 10 }
results: [M, V]
show: [nodeLabels]
---
::

Onde várias barras se encontram num nó rotulado, basta uma rótula na extremidade de cada barra, menos uma. Uma rótula em todas as extremidades também funciona: nenhuma barra gira junto com o nó, e o solver informa a rotação dele como 0. Mas um momento aplicado nesse nó não tem nada que o equilibre, e [o cálculo falha](/pt/solver/solving#when-solving-fails).

## Barras de treliça {#truss-bars}

Coloque rótulas nas duas extremidades e a barra resiste apenas a esforço normal, desde que seja carregada nos nós: é uma barra de treliça.

```ts
domain.createBeam2D('AE', ['A', 'E'], 'steel', 'bar', [true, true])
```

O [exemplo da treliça](/pt/solver/trusses) resolve uma treliça inteira assim. O exemplo de treliça do aplicativo EduBeam usa nós rígidos, com uma área tão grande que os momentos fletores são desprezíveis perto dos esforços normais. Os dois modelos são válidos; diferem só nesses pequenos momentos. A matriz de rigidez da barra é deduzida na página [Elemento de treliça](/pt/elements/truss) do manual teórico.

## As matrizes do elemento {#the-element-s-matrices}

Para ensinar o próprio método, um `Beam2D` fornece as suas matrizes como matrizes do [mathjs](https://mathjs.org); `.toArray()` as converte em `number[][]`:

| Método | Fornece |
| --- | --- |
| `computeGeo()` | `{ l, dx, dz }`: comprimento e projeções, m |
| `computeLocalStiffnessMtrx().answer` | rigidez 6 × 6 em eixos locais, com as rótulas condensadas |
| `computeT()` | transformação 6 × 6 dos eixos globais para os locais |
| `computeStiffness()` | rigidez 6 × 6 em eixos globais, $T^T K_l T$ |
| `computeShearFactor()` | $\Phi = 12EI_y/kGAL^2$ |

```ts
ac.computeStiffness().toArray() // number[][], N/m, N e N·m
```

Os GLs estão na ordem $u_1, w_1, \varphi_1, u_2, w_2, \varphi_2$. A página [Elemento de viga](/pt/elements/beam) do manual teórico deduz essas matrizes, e [Como o EduBeam resolve um modelo](/pt/elements/analysis) mostra como elas são montadas.
