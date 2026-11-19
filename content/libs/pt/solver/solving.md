---
title: Cálculo
description: "O que o solve() do @edubeam/fem faz, quando numerar de novo as equações após alterar o modelo, como reconhecer um mecanismo e que tamanho de modelo ele aguenta."
order: 9
group: Cálculo e resultados
source: site
---

# Cálculo {#solving}

```ts
solver.solve()
```

`solve()` numera as equações, monta a matriz de rigidez global e os vetores de carga de todos os casos de carga, e calcula os deslocamentos e as reações. Depois disso, qualquer [resultado](/pt/solver/results) pode ser lido; antes, ler um resultado lança um `TypeError`. As etapas são as de [Como o EduBeam resolve um modelo](/pt/elements/analysis), no manual teórico.

A solução é exata para o modelo linear: a deformada e os esforços internos ao longo de cada barra vêm de soluções analíticas da viga de Timoshenko, então não há malha para refinar nem é preciso dividir as barras para obter diagramas precisos.

A partir da versão 0.3.1, `solve()` não escreve nada no console; a 0.3.0 imprimia uma linha como `Solution took 9 [ms]` a cada chamada.

## Resolver de novo após uma alteração {#solving-again-after-a-change}

Mudar números num modelo exige apenas outro `solve()`. Mudar quais equações existem exige uma linha a mais antes:

```ts
domain.createNode('C', [10, 0, 0], [DofID.Dz])
domain.createBeam2D(2, ['B', 'C'], 1, 1)
solver.codeNumberGenerated = false // os GLs mudaram: numere-os de novo
solver.solve()
```

| Alteração | Depois |
| --- | --- |
| Valores das cargas, cargas novas ou removidas | `solve()` |
| Coordenadas dos nós, materiais, seções, rótulas | `solve()` |
| Adicionar nós ou barras | `codeNumberGenerated = false`, depois `solve()` |
| Remover nós ou barras: `domain.nodes.delete(label)`, `domain.elements.delete(label)` | `codeNumberGenerated = false`, depois `solve()` |
| Mudar os apoios de um nó, `node.bcs` | `codeNumberGenerated = false`, depois `solve()` |

Se você esquecer essa linha depois de adicionar um nó, `solve()` lança um `TypeError`. Se esquecer depois de mudar um apoio, ele resolve **sem avisar** com os apoios antigos. Na dúvida, defina `codeNumberGenerated = false` mesmo assim: a numeração não custa quase nada. Remover uma barra também significa remover as cargas dela de `lc.elementLoadList`; caso contrário, `solve()` lança um `RangeError` por causa da barra que falta.

Para muitas variantes de um mesmo modelo, como num estudo paramétrico, um solver novo para cada uma é mais simples e igualmente rápido: veja o [exemplo da linha de influência](/pt/solver/scripts#an-influence-line-as-csv).

## Quando o cálculo falha {#when-solving-fails}

Uma estrutura que pode se mover sem se deformar, um mecanismo, tem matriz de rigidez singular. Às vezes `solve()` percebe isso e lança um erro:

```text
Error: Linear system cannot be solved since matrix is singular
```

Muitas vezes não percebe: os erros de arredondamento fazem a matriz parecer solucionável, e você obtém deslocamentos de $10^{12}$ m, ou números de aparência razoável para uma estrutura que está livre para deslizar. Uma viga sobre dois apoios móveis, por exemplo, é resolvida sem reclamação enquanto nada a empurrar lateralmente. Por isso, confira os apoios você mesmo e trate deslocamentos enormes como sinal de mecanismo.

Causas típicas:

- apoios de menos, como uma viga sobre dois apoios móveis;
- apoios que não conseguem fixar a estrutura: todos paralelos, ou todos apontando para um mesmo ponto;
- uma rótula a mais, como três rótulas alinhadas;
- um momento aplicado num nó em que todas as extremidades de barra são rotuladas.

A mensagem não diz onde está o problema. O aplicativo EduBeam procura mecanismos antes de resolver, e encontra e anima o movimento; montar o mesmo modelo lá costuma ser o jeito mais rápido de vê-lo. [Solução de problemas](/pt/reference/troubleshooting) lista as causas habituais.

Um nó, material ou seção que falta lança um `RangeError` com o nome dele. Parâmetros de seção que faltam não lançam erro nenhum: todos os resultados dão `NaN`. Veja [Materiais e seções](/pt/solver/materials-sections#cross-section).

## Tamanho do modelo {#model-size}

O solver usa matrizes densas, feitas para modelos do tamanho dos usados no ensino. Num notebook, no Node, uma linha reta de barras é resolvida em cerca de:

| Barras | GLs | Tempo |
| --- | --- | --- |
| 50 | 150 | 0,1 s |
| 100 | 300 | 0,2 s |
| 200 | 600 | 1 s |
| 400 | 1200 | 10 s |

Cada vez que o modelo dobra de tamanho, o tempo fica de seis a nove vezes maior.

Todos os exercícios, pórticos e treliças de uma disciplina de análise estrutural cabem com folga. O solver não foi feito para modelos com milhares de barras.

## Nenhuma outra análise {#no-other-analyses}

Esta versão resolve apenas a estática linear. O código-fonte contém um solver de autovalores para frequências naturais, mas ele não faz parte do pacote publicado: `EigenValueDynamicSolver` não pode ser importado de `@edubeam/fem`.
