---
title: Treliças
description: "Treliça Warren de nós articulados no @edubeam/fem, cada esforço conferido pelo método das seções, e um laço que gera treliças com qualquer número de painéis."
order: 14
source: site
---

# Treliças {#trusses}

Uma treliça é formada por barras rotuladas nas duas extremidades e carregadas nos nós, de modo que cada barra resiste apenas a esforço normal. Este exemplo monta uma treliça Warren a partir de duas listas, confere à mão o esforço em cada barra e depois gera treliças de qualquer tamanho num laço.

::model-figure{caption="Uma treliça Warren: 9 m de vão, 1,8 m de altura, 8 kN em cada nó superior"}
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

// Treliça Warren: 9 m de vão, 1,8 m de altura, banzo inferior A-B-C-D, banzo superior E-F-G
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

// Cada rótulo indica os dois nós da barra. Rótulas nas duas extremidades: só esforço normal.
const bars = ['AB', 'BC', 'CD', 'EF', 'FG', 'AE', 'EB', 'BF', 'FC', 'CG', 'GD']
const members = bars.map((bar) =>
  domain.createBeam2D(bar, [bar[0], bar[1]], 1, 1, [true, true])
)

const lc = solver.loadCases[0]
for (const top of ['E', 'F', 'G']) {
  lc.createNodalLoad(top, { [DofID.Dz]: 8e3 }) // 8 kN para baixo
}
solver.solve()

for (const bar of members) {
  const n = bar.computeNormalForceAt(lc, 0) / 1e3
  console.log(bar.label, n.toFixed(2), n > 0 ? 'tension' : 'compression')
}
```

```text [Saída]
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

O esforço normal numa barra é constante, então basta lê-lo em `x = 0`. Os rótulos de duas letras servem também como pares de nós: `bar[0]` e `bar[1]`.

## Confira à mão {#check-it-by-hand}

Cada apoio recebe metade dos 24 kN, ou seja, 12 kN. Corte a treliça e faça o equilíbrio de momentos em relação ao nó oposto à barra cortada, como no [método das seções](/pt/tutorials/truss):

| Barra | Seção | Esforço |
| --- | --- | --- |
| BC, banzo inferior | momentos em relação a F: $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$ | 16,67 kN de tração |
| EF, banzo superior | momentos em relação a B: $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$ | 13,33 kN de compressão |
| AE, diagonal de extremidade | nó A: $12 \cdot \sqrt{1{,}5^2 + 1{,}8^2}/1{,}8$ | 15,62 kN de compressão |
| EB, diagonal | cortante no painel, $12 - 8 = 4$ kN: $4 \cdot 2{,}343/1{,}8$ | 5,21 kN de tração |

A seção não altera os esforços nas barras de uma treliça isostática; ela só determina quanto os nós se deslocam. A figura acima usa outra seção, a do aplicativo EduBeam, e dá os mesmos esforços.

## Qualquer número de painéis {#any-number-of-panels}

Para gerar treliças, para exercícios ou para um estudo paramétrico, monte os nós e as barras num laço, painel por painel. Com `panels = 3` este programa dá a treliça acima e imprime os mesmos esforços; mude `panels`, `w` e `h` para obter outra.

```ts [warren.ts]
import { type Beam2D, DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })
const lc = solver.loadCases[0]

const panels = 3 // painéis do banzo inferior
const w = 3 // largura do painel, m
const h = 1.8 // altura, m

// Nós inferiores b0, b1, … sobre um apoio fixo e um móvel; nós superiores t0, t1, … entre eles
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
  bar(`b${i}`, `b${i + 1}`) // banzo inferior
  bar(`b${i}`, `t${i}`) // diagonal subindo
  bar(`t${i}`, `b${i + 1}`) // diagonal descendo
  if (i > 0) bar(`t${i - 1}`, `t${i}`) // banzo superior
}
solver.solve()

for (const m of members) {
  console.log(m.label, (m.computeNormalForceAt(lc, 0) / 1e3).toFixed(2))
}
```

O tempo de cálculo cresce rápido com o tamanho: algumas dezenas de painéis não são problema (veja [Tamanho do modelo](/pt/solver/solving#model-size)). Para desenhar cada treliça gerada, com ou sem as respostas, veja [Exercícios e provas](/pt/plot/exercises), do @edubeam/plot.

## O que observar {#things-to-notice}

- **Rótulas em todas as extremidades de barra.** Assim, todos os nós ficam livres para girar, e o solver informa a rotação deles como 0. Um momento aplicado num nó desses não tem nada que o equilibre, e [o cálculo falha](/pt/solver/solving#when-solving-fails).
- **Cargas nos nós.** Uma carga ao longo de uma barra a flexionaria: ela passaria a ser uma viga, e não uma barra de treliça, e teria diagrama de momento fletor.

O [tutorial da treliça plana](/pt/tutorials/truss) monta uma treliça no aplicativo EduBeam, e a página [Elemento de treliça](/pt/elements/truss) deduz a rigidez da barra.
