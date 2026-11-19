---
title: Pórticos
description: "Um programa completo do @edubeam/fem para um pórtico triarticulado, com pilares, cantos rígidos e uma rótula central, e os resultados conferidos à mão."
order: 13
source: site
---

# Pórticos {#frames}

Um pórtico é formado por vigas e pilares ligados rigidamente nos cantos. Este exemplo monta em código o pórtico do [tutorial do pórtico triarticulado](/pt/tutorials/three-hinged-frame): dois pilares de 4 m com apoios fixos em A e E, uma viga de 8 m com uma rótula em C e 10 kN/m sobre a viga. O tutorial numera os nós de 1 a 5; aqui eles vão de A a E.

::model-figure{caption="O pórtico do programa abaixo: apoios fixos em A e E, rótula em C, 10 kN/m"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, k: 1e32 }) // IPE 300

// z aponta para baixo: o topo dos pilares de 4 m fica em z = -4
const pin = [DofID.Dx, DofID.Dz]
domain.createNode('A', [0, 0, 0], pin)
domain.createNode('B', [0, 0, -4])
domain.createNode('C', [4, 0, -4]) // a rótula central
domain.createNode('D', [8, 0, -4])
domain.createNode('E', [8, 0, 0], pin)

const column = domain.createBeam2D(1, ['A', 'B'], 1, 1) // de baixo para cima
const left = domain.createBeam2D(2, ['B', 'C'], 1, 1, [false, true]) // rótula em C
domain.createBeam2D(3, ['C', 'D'], 1, 1)
domain.createBeam2D(4, ['D', 'E'], 1, 1)

const lc = solver.loadCases[0]
for (const half of [2, 3]) {
  lc.createBeamElementUniformEdgeLoad(half, [0, 10e3], false)
}
solver.solve()

// getReactions retorna uma Matrix do mathjs ou um array: converta para array
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()
const kN = (v: number) => (v / 1e3).toFixed(2)

for (const label of ['A', 'E']) {
  const [rx, rz] = list(domain.getNode(label).getReactions(lc).values)
  console.log(`${label}: Rx = ${kN(rx)} kN, Rz = ${kN(rz)} kN`)
}
for (const x of [0, 2, 4]) {
  const m = left.computeBendingMomentAt(lc, x)
  console.log(`M at ${x} m from B = ${kN(m)} kNm`)
}
const top = column.computeBendingMomentAt(lc, 4)
console.log(`M at the top of column 1 = ${kN(top)} kNm`)
```

```text [Saída]
A: Rx = 20.00 kN, Rz = -40.00 kN
E: Rx = -20.00 kN, Rz = -40.00 kN
M at 0 m from B = -80.00 kNm
M at 2 m from B = -20.00 kNm
M at 4 m from B = 0.00 kNm
M at the top of column 1 = -80.00 kNm
```

## Confira à mão {#check-it-by-hand}

| Grandeza | À mão | Solver |
| --- | --- | --- |
| Reações verticais | $q \cdot 8/2 = 40$ kN para cima | $R_z = -40$ kN em A e em E |
| Reações horizontais | de $M_C = 0$ na metade esquerda: $(40 \cdot 4 - 10 \cdot 4 \cdot 2)/4 = 20$ kN, para dentro | $R_x = +20$ kN em A, $-20$ kN em E |
| Momento no canto | $-20 \cdot 4 = -80$ kNm | $-80$ kNm na viga e no pilar |
| Momento a 2 m de B | $-80 + 40 \cdot 2 - 10 \cdot 2^2/2 = -20$ kNm | $-20$ kNm |
| Momento na rótula | 0 | 0 |

## O que observar {#things-to-notice}

- **Os pilares sobem, então z é negativo.** O topo dos pilares fica em $z = -4$.
- **Os eixos locais do pilar.** A barra 1 vai de A, embaixo, até B, em cima, então o seu z local aponta para a direita, para dentro do pórtico. O momento no topo dela é −80 kNm, igual ao da viga no canto: tração do lado de fora. Defina o pilar de B para A, de cima para baixo, e o z local aponta para a esquerda: o momento muda de sinal, e `x` passa a ser medido a partir do topo. Veja [Orientação da barra](/pt/solver/conventions#member-direction).
- **Uma rótula, uma extremidade de barra.** A rótula fica na extremidade da barra 2 em C; a barra 3 começa rigidamente em C. Uma extremidade liberada basta para fazer de C uma rótula.
- **Cargas globais na viga.** `false` dá a carga em eixos globais: vertical, qualquer que seja a inclinação da barra. Numa viga horizontal desenhada da esquerda para a direita, isso é o mesmo que em eixos locais.

## Pórticos hiperestáticos {#statically-indeterminate-frames}

Retire a rótula, `[false, false]`, e o pórtico passa a ser biarticulado, uma vez hiperestático. Os esforços passam então a depender da rigidez da viga em relação à dos pilares: dê seções diferentes às barras para ver isso. Os [experimentos do tutorial](/pt/tutorials/three-hinged-frame#_7-experiment) engastam as bases e empurram o pórtico lateralmente, com os números para conferir. A página [Slides e notas de aula](/pt/plot/slides) do @edubeam/plot desenha um pórtico desses passo a passo.
