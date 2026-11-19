---
title: Modelo de desenho
description: "O PlotModel, dados simples serializáveis em JSON que modelFromSolver obtém de um modelo resolvido: polinômios por trechos, valores exatos e extremos."
order: 9
source: site
---

# Modelo de desenho

Tudo o que o @edubeam/plot desenha vem de um `PlotModel`: dados simples que `modelFromSolver` extrai de um modelo resolvido com o @edubeam/fem. Ele contém a geometria, os apoios, as cargas, as reações e os resultados de cada barra como polinômios exatos. É serializável em JSON, então pode ser gerado no build e entregue no lugar do solver, e é a maneira mais simples de obter valores exatos e extremos de uma estrutura resolvida.

```ts
import { modelFromSolver } from '@edubeam/plot'

const model = modelFromSolver(solver) // ou modelFromSolver(solver, { loadCase: 1 })
```

`results` só existe quando o caso de carga está resolvido. Sem ele, os componentes desenham apenas o modelo e, com [`reactionLabels: 'names'`](/pt/plot/structure-plot#reactions-as-unknowns), continuam desenhando as reações incógnitas, de modo que um modelo não resolvido pode servir de enunciado de exercício.

## O formato {#the-format}

Tudo está em unidades SI (m, N, N·m, N/m, K, rad) e nos eixos do solver: x para a direita, z para baixo, rotações positivas no sentido anti-horário na tela.

```ts
interface PlotModel {
  readonly nodes: readonly PlotNode[]
  readonly members: readonly PlotMember[]
  readonly loads: readonly PlotLoad[]
  readonly results?: PlotResults // só para um caso de carga resolvido
}

interface PlotNode {
  readonly id: string
  readonly x: number
  readonly z: number
  readonly fixity: { readonly dx: boolean; readonly dz: boolean; readonly ry: boolean } // GLs restringidos
  readonly angle: number // rotação dos eixos de um apoio girado, rad, sentido horário na tela
}

interface PlotMember {
  readonly id: string
  readonly start: string // ids dos nós
  readonly end: string
  readonly hinges: readonly [boolean, boolean]
}

interface PlotResults {
  readonly members: Readonly<Record<string, MemberResults>> // por id da barra
  readonly reactions: readonly PlotReaction[]
}

interface MemberResults {
  readonly N: Piecewise // esforço normal, tração positiva
  readonly V: Piecewise // esforço cortante
  readonly M: Piecewise // momento fletor, positivo com tração do lado +z local
  readonly u: Piecewise // deslocamento ao longo do x local
  readonly w: Piecewise // deslocamento ao longo do z local
}

interface PlotReaction {
  readonly node: string
  readonly dof: 'dx' | 'dz' | 'ry'
  readonly value: number // força sobre a estrutura ao longo do eixo do nó, N (N·m para ry)
}
```

Uma carga é de um de sete tipos, distinguidos por `kind`:

| `kind` | Campos | O que é |
| --- | --- | --- |
| `'nodalForce'` | `node`, `fx`, `fz` | uma força num nó, componentes globais, N |
| `'nodalMoment'` | `node`, `my` | um momento num nó, N·m |
| `'distributed'` | `member`, `start`, `end`, `local` | uma carga distribuída com variação linear, `{ fx, fz }` em cada extremidade, N/m; uniforme quando são iguais |
| `'pointForce'` | `member`, `at`, `fx`, `fz`, `local` | uma força a `at` metros do início da barra |
| `'pointMoment'` | `member`, `at`, `my` | um momento concentrado numa barra |
| `'temperature'` | `member`, `uniform`, `gradient` | K: a variação no centroide e a diferença entre as faces inferior e superior (inferior menos superior) |
| `'prescribed'` | `node`, `dx?`, `dz?`, `ry?` | um deslocamento de apoio nos eixos do nó, m e rad |

`local` é `true` quando as componentes estão ao longo dos eixos locais x e z da barra, e não dos eixos globais.

## Polinômios por trechos {#piecewise-polynomials}

O resultado de uma barra é um `Piecewise`: uma lista de trechos, cada um com um polinômio sobre uma parte da barra. Um novo trecho começa onde uma carga concentrada ou um momento concentrado interrompe o resultado.

```ts
interface Piece {
  readonly x0: number // m a partir do início da barra
  readonly x1: number
  readonly c: readonly number[] // valor = Σ c[k]·sᵏ, com s = (x − x0)/(x1 − x0)
}
type Piecewise = readonly Piece[]
```

N, V e M são no máximo cúbicos, e a flecha no máximo de quinto grau, então poucos coeficientes guardam exatamente a resposta do solver. O esforço cortante de uma viga de 6 m com 20 kN a 2 m é formado por dois trechos constantes:

```json
[{ "x0": 0, "x1": 2, "c": [13333.33] }, { "x0": 2, "x1": 6, "c": [-6666.67] }]
```

## Ler os valores você mesmo {#reading-values-yourself}

As funções que desenham os diagramas também os leem, de forma exata e sem amostragem:

```ts
import { extremes, innerBreaks, modelFromSolver, valueAt } from '@edubeam/plot'

// biapoiada de 6 m, 20 kN a 2 m de A, IPE 200 rígido ao cisalhamento
const model = modelFromSolver(solver)
const { V, M, w } = model.results!.members['1']

innerBreaks(V) // [2]: os trechos se encontram na carga
valueAt(V, 2, 'left') // 13333.3 N, logo antes da carga
valueAt(V, 2, 'right') // -6666.7 N, logo depois dela
extremes(M) // máx. 26666.7 N·m em x = 2
extremes(w) // máx. 0.018973 m em x = 2.734
```

`extremes` retorna `{ max, min }`, cada um `{ x, value, side }`, ou `null` para uma lista vazia. A maior flecha não fica sob a carga: ela está em $x = L - \sqrt{(L^2 - a^2)/3} = 2{,}734$ m e vale $P\,a\,(L^2 - a^2)^{3/2}/9\sqrt{3}\,EIL = 18{,}97$ mm, como dá a fórmula para uma carga fora do meio do vão.

É assim que o [gerador de exercícios](/pt/plot/exercises#the-generator) encontra os momentos extremos para o seu gabarito. A página [Funções](/pt/plot/functions#piecewise-polynomials) lista o restante: inclinações, extremos dentro de um trecho, graus e curvas de Bézier.

## Entregar como JSON {#ship-it-as-json}

Basta `JSON.stringify(model)`, e `JSON.parse` devolve um modelo cujo desenho é idêntico ao feito a partir do solver. Um pórtico com uma carga distribuída e uma carga concentrada ocupa menos de 2 kB. Veja [Incorporação](/pt/plot/embedding#ship-the-drawing-not-the-solver). Um modelo também alimenta [`structureSvg`](/pt/plot/functions#a-standalone-svg-file), que o escreve como arquivo SVG.
