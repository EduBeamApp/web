---
title: Primeiros passos
description: "Instale o @edubeam/fem, o solver de elementos finitos do EduBeam, e resolva, confira e leia uma viga biapoiada em uma dúzia de linhas de TypeScript."
order: 1
group: Introdução
source: site
---

# Primeiros passos {#getting-started}

O @edubeam/fem é o solver de elementos finitos por trás do [EduBeam]{.edubeam}: todos os diagramas, reações e flechas que o aplicativo mostra vêm dele. Com ele você resolve vigas, pórticos e treliças planas a partir do seu próprio código, no navegador ou no Node: pode gerar exercícios com as respostas, corrigir exercícios para casa, fazer estudos paramétricos ou colocar um solver por trás de uma página web.

::div{.actions}
[Resolva sua primeira viga](#a-simply-supported-beam) [Veja os programas de exemplo](/pt/solver/beams)
::

A biblioteca é escrita em TypeScript, traz seus próprios tipos e é software livre sob a licença GPL-3.0. Foi criada por Bořek Patzák e é desenvolvida com Jan Voříšek e outros colaboradores.

## Instalação {#install}

```bash
npm install @edubeam/fem
```

Funciona com `import` e com `require`, no navegador e no Node 18 ou posterior, e tem uma única dependência, o [mathjs](https://mathjs.org). Até a versão 0.3.0 ela era instalada a partir do GitHub com o nome `ts-fem`: se você a usava assim, troque seus imports para `@edubeam/fem`. Nada mais mudou.

Para testar o exemplo abaixo a partir de uma pasta vazia, transforme-a em um projeto que usa `import` e depois instale o pacote:

```bash
npm init -y
npm pkg set type=module
npm install @edubeam/fem
```

Sem `"type": "module"` no `package.json` o exemplo também roda, mas o Node mostra um aviso antes.

## Sua primeira viga {#a-simply-supported-beam}

Uma viga de aço IPE 200 com 6 m de vão, sobre um apoio fixo e um apoio móvel, com uma carga de 12 kN/m:

```ts [beam.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver

// Unidades SI em tudo: m, N, Pa. Aço e um IPE 200.
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

// Nós em [x, y, z], em metros, com os GLs que o apoio restringe
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // apoio fixo
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // apoio móvel
const beam = domain.createBeam2D(1, ['A', 'B'], 'steel', 'IPE200')

// 12 kN/m no eixo z local da barra: para baixo numa viga desenhada da esquerda para a direita
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad(1, [0, 12e3], true)

solver.solve()

console.log(beam.computeBendingMomentAt(lc, 3)) // N·m no meio do vão
console.log(beam.computeShearForceAt(lc, 0)) // N em A
console.log(beam.computeLocalDefl(lc, 2).w[1]) // m no meio do vão
```

Salve o código como `beam.ts` e execute `node beam.ts`: o Node 22.18 e posteriores executam TypeScript diretamente. O arquivo não tem anotações de tipo, então, num Node mais antigo, basta salvá-lo como `beam.mjs`. A saída é:

```text [Saída]
54000
36000
0.04990940552616746
```

São os valores dos livros, $M = qL^2/8 = 54$ kNm e $V = qL/2 = 36$ kN. Aqui está a mesma viga, resolvida no seu navegador pelo mesmo solver:

::model-figure{caption="A viga acima: 6 m, IPE 200, 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9, g: 81e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 0.8333333 }
---
::

A flecha, 49,91 mm, é 0,28 mm maior que a de Euler–Bernoulli, $5qL^4/384EI = 49{,}63$ mm. Não é erro: a barra é uma viga de Timoshenko, e esses 0,28 mm são $qL^2/8kGA$, a deformação por cisalhamento desta viga. Dê a `k` um valor enorme, como `1e32`, e a diferença desaparece: veja [Deformação por cisalhamento](/pt/solver/materials-sections#shear-deformation).

## O que o código faz {#what-the-code-does}

::div{.steps}
### Crie um solver {#make-a-solver}

`new LinearStaticSolver()` já vem com um `domain` vazio, que guarda o modelo, e com um caso de carga, `solver.loadCases[0]`.

### Descreva o modelo {#describe-the-model}

Materiais e seções, nós com seus apoios e, depois, barras entre os nós. Tudo tem um rótulo, uma string ou um número, pelo qual o resto do modelo se refere a ele. Veja [Nós e apoios](/pt/solver/nodes-supports), [Materiais e seções](/pt/solver/materials-sections) e [Barras e rótulas](/pt/solver/members-hinges).

### Aplique as cargas {#load-it}

As cargas pertencem a um caso de carga: forças nos nós, cargas ao longo das barras, temperatura e recalques. Veja [Cargas nodais e nas barras](/pt/solver/loads).

### Resolva {#solve}

`solver.solve()` monta e resolve todos os casos de carga. Veja [Cálculo](/pt/solver/solving).

### Leia os resultados {#read-the-results}

Esforços internos em qualquer ponto de uma barra, flechas, esforços de extremidade, deslocamentos nodais e reações. Veja [Leitura dos resultados](/pt/solver/results) e, para os diagramas, [Desenho dos resultados](/pt/solver/drawing).
::

## Unidades e sinais em resumo {#axes-and-signs}

Unidades SI na entrada, unidades SI na saída. O modelo fica no plano x–z com o **eixo z para baixo**, então uma `fz` positiva empurra para baixo e o topo de um pilar de 4 m fica em $z = -4$. As posições ao longo de uma barra são medidas em metros a partir do seu primeiro nó. O momento positivo traciona a fibra inferior. [Unidades e sinais](/pt/solver/conventions) traz a lista completa.

## Seis armadilhas comuns {#pitfalls}

1. **O eixo z aponta para baixo.** As cargas gravitacionais são positivas, e tudo o que está acima dos apoios tem z negativo. Veja [Eixos](/pt/solver/conventions#axes).
2. **A orientação da barra define o sinal de M e de w.** Defina as vigas da esquerda para a direita e os pilares de baixo para cima, e os sinais saem como nos livros. Veja [Orientação da barra](/pt/solver/conventions#member-direction).
3. **Um parâmetro que falta dá `NaN` ou um resultado absurdo, não um erro.** Uma seção precisa de `a`, `iy` e `k`; um material precisa de `e`, e também de `g`, a menos que `k` seja enorme. Veja [Materiais e seções](/pt/solver/materials-sections).
4. **Depois de adicionar nós ou barras, ou de mudar apoios,** defina `solver.codeNumberGenerated = false` antes de resolver de novo. Veja [Resolver de novo após uma alteração](/pt/solver/solving#solving-again-after-a-change).
5. **As reações vêm como uma matriz do mathjs ou como um array,** na ordem em que os GLs do apoio foram informados. Veja [Reações](/pt/solver/results#reactions).
6. **Um mecanismo nem sempre lança uma exceção.** Um deslocamento de $10^{12}$ m significa que a estrutura pode se mover livremente. Veja [Quando o cálculo falha](/pt/solver/solving#when-solving-fails).

## Próximos passos {#next}

::card-grid{cols="2"}
:::card{title="Programas de exemplo" icon="lucide:book-open" to="/pt/solver/beams"}
Programas completos e conferidos: vigas, pórticos, treliças, uma lista de exercícios com o gabarito e um pequeno servidor HTTP.
:::
:::card{title="Desenhe os resultados" icon="lucide:chart-spline" to="/pt/solver/drawing"}
Passe um modelo resolvido ao @edubeam/plot e obtenha seus diagramas em SVG, no Vue ou a partir de um script Node.
:::
:::card{title="Referência da API" icon="lucide:list-tree" to="/pt/solver/reference"}
Todas as classes, métodos e argumentos, com as unidades e o que cada um retorna.
:::
:::card{title="A teoria" icon="lucide:sigma" to="/pt/elements/beam"}
O elemento de viga, sua matriz de rigidez e sua transformação, no manual teórico do EduBeam.
:::
::
