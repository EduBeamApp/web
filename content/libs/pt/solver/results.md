---
title: Leitura dos resultados
description: "Leia reações, deslocamentos nodais, esforços internos em qualquer ponto da barra, deformadas e esforços de extremidade de um modelo resolvido no @edubeam/fem."
order: 10
source: site
---

# Leitura dos resultados {#reading-results}

Depois de `solve()`, os resultados são lidos nos nós e nas barras, para um caso de carga dado. Todos os exemplos desta página leem o mesmo modelo, uma viga biapoiada de 6 m, IPE 200 rígido ao cisalhamento, com 20 kN a 2 m de A:

```ts [results.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 }) // rígido ao cisalhamento

const A = domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
const B = domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
const lc = solver.loadCases[0]
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], true)
solver.solve()
```

::model-figure{caption="20 kN a 2 m num vão de 6 m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M, w]
show: [nodeLabels]
---
::

## O que ler e onde {#what-to-read-where}

| Resultado | Chamada | Retorna |
| --- | --- | --- |
| Reações | `node.getReactions(lc)` | `{ dofs, values }`: N, N·m |
| Deslocamentos | `node.getUnknowns(lc, dofs)` | m, rad |
| N, V ou M num ponto | `beam.computeBendingMomentAt(lc, x)` | um número: N, N·m |
| N, V ou M ao longo de uma barra | `beam.computeBendingMoment(lc, n)` | `{ x, M }`, n + 1 pontos |
| Deformada | `beam.computeLocalDefl(lc, n)` | `{ u, w }`, n + 1 pontos, m |
| Esforços de extremidade | `beam.computeEndForces(lc)` | uma matriz do mathjs com 6 valores |

Para N e V, os métodos são `computeNormalForceAt` e `computeShearForceAt`, `computeNormalForce` e `computeShearForce`, que retornam `{ x, N }` e `{ x, V }`. Os sinais estão em [Unidades e sinais](/pt/solver/conventions#signs-of-the-results).

## Reações {#reactions}

`getReactions` dá uma reação para cada GL que o apoio restringe: `dofs` os lista, na ordem em que foram passados a `createNode`, e `values` contém as reações na mesma ordem. `values` é uma **matriz do mathjs** quando há várias e um array simples quando há uma só, então uma pequena função auxiliar o transforma em array nos dois casos:

```ts
/** Converte uma Matrix do mathjs, um array ou um número num array simples. */
const list = (v: unknown): number[] =>
  typeof v === 'number'
    ? [v]
    : Array.isArray(v)
      ? v
      : (v as { toArray(): number[] }).toArray()

A.getReactions(lc).dofs // [0, 2]: DofID.Dx, DofID.Dz
list(A.getReactions(lc).values) // [0, -13333.3]
list(B.getReactions(lc).values) // [-6666.7]
```

Para pegar uma reação específica independentemente da ordem, procure o GL dela: `list(values)[dofs.indexOf(DofID.Dz)]`, como faz o [exemplo da viga contínua](/pt/solver/beams#a-continuous-beam).

Uma reação é a força que o apoio exerce sobre a estrutura: −13 333 N em z são 13,3 kN empurrando para cima, $P\,b/L = 20 \cdot 4/6$. Num nó com [eixos girados](/pt/solver/nodes-supports#inclined-supports), as reações são dadas nesses eixos; `getReactions(lc, true)` as converte para os globais e retorna os três GLs, com 0 onde nada é restringido. Um nó sem apoio dá `{ dofs: [], values: [] }`.

## Deslocamentos {#displacements}

`getUnknowns` lê quaisquer GLs de um nó, com ou sem apoio:

```ts
list(A.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])) // [0, 0, -0.0108924]
```

A gira 0,010892 rad no sentido horário, $P\,b\,(L^2 - b^2)/6EIL$. Quando se pede um só GL, `getUnknowns` retorna um número simples, embora o TypeScript declare uma matriz: `list` também resolve isso.

## Esforços internos ao longo de uma barra {#internal-forces-along-a-member}

Os métodos `…At` dão o valor a `x` metros do primeiro nó da barra:

```ts
beam.computeShearForceAt(lc, 1) // 13333.3 N
beam.computeShearForceAt(lc, 2) // -6666.7 N: no ponto da carga, o valor logo depois dela
beam.computeBendingMomentAt(lc, 2) // 26666.7 N·m: R_A · 2
```

Onde uma carga concentrada provoca um salto, o valor exatamente no ponto da carga é o do lado de lá. Para ler o lado de cá, peça o valor num ponto um pouco antes, como `x - 1e-9`.

Os métodos que retornam arrays amostram a barra em n + 1 pontos igualmente espaçados, incluindo as extremidades:

```ts
beam.computeBendingMoment(lc, 3)
// { x: [0, 2, 4, 6], M: [0, 26666.7, 13333.3, 0] }, a menos de arredondamento
```

Espere erros de arredondamento como `-3.6e-12` onde o valor exato é 0: formate os números com `toFixed` antes de imprimi-los. O maior valor ao longo de uma barra é o maior de uma amostragem fina, como `computeBendingMoment(lc, 500)`, como no [exemplo da viga contínua](/pt/solver/beams#a-continuous-beam). Sob cargas distribuídas, M é um polinômio, então o extremo exato fica onde V passa por zero; o [@edubeam/plot](/pt/plot/model#reading-values-yourself) o encontra exatamente.

## Deformada {#deflected-shape}

```ts
beam.computeLocalDefl(lc, 3)
// { u: [0, 0, 0, 0], w: [0, 0.0174279, 0.0152494, 0] }
```

`computeLocalDefl` dá os deslocamentos ao longo da barra e perpendiculares a ela, `u` e `w`, nos eixos locais; `computeGlobalDefl` dá os mesmos pontos em x e z globais. A flecha sob a carga, 17,43 mm, é $P\,a^2 b^2/3EIL$. A forma entre os nós é exata, e não interpolada a partir dos valores nas extremidades. Para desenhá-la, veja [Desenho dos resultados](/pt/solver/drawing).

## Esforços de extremidade {#end-forces}

```ts
beam.computeEndForces(lc).toArray()
// [0, -13333.3, 0, 0, -6666.7, 0]: X12, Z12, M12, X21, Z21, M21
```

São as forças que os dois nós exercem sobre a barra, nos eixos locais dela: os números da tabela *Resultados dos elementos* do aplicativo, explicados em [Esforços de extremidade](/pt/elements/conventions#end-forces-element-results-table).

## Resultados como números para conferir {#results-as-numbers-to-check}

Todos os valores acima coincidem com a fórmula analítica correspondente. A página [Conferir resultados à mão](/pt/guide/verification) percorre muitos outros casos dos livros, resolvidos por este mesmo solver no seu navegador.
