---
title: API dos componentes
description: "Todas as props e eventos de StructurePlot e DiagramStack no @edubeam/plot 0.2.0, com tipos e valores padrão, o plugin EduBeamPlot e os tipos exportados."
order: 8
group: Referência
source: site
---

# API dos componentes

As props e os eventos dos dois componentes, como declarados no @edubeam/plot 0.2.0. Nenhum dos dois tem slots. Os valores em unidades SI estão indicados como tal; os tamanhos são pixels CSS.

## StructurePlot {#structureplot}

```ts
import { StructurePlot } from '@edubeam/plot'
```

Desenha uma estrutura plana e os seus resultados. Guia: [StructurePlot](/pt/plot/structure-plot).

### Props {#props}

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Um solver do @edubeam/fem. Os resultados são desenhados quando o seu caso de carga está resolvido. |
| `model` | `PlotModel` | – | Ou os dados simples gerados por [`modelFromSolver`](/pt/plot/model). Tem prioridade sobre `solver`. |
| `loadCase` | `number` | `0` | Índice em `solver.loadCases` |
| `revision` | `number` | `0` | Altere-o para redesenhar um solver modificado diretamente |
| `layers` | `readonly PlotLayer[]` | barras, apoios, cargas, reações e um resultado | O que desenhar: `'nodes'`, `'nodeLabels'`, `'dimensions'`, `'members'`, `'supports'`, `'loads'`, `'reactions'`, `'N'`, `'V'`, `'M'`, `'w'` |
| `reserve` | `readonly PlotLayer[]` | `layers` | Camadas para as quais se reserva espaço enquanto estão ocultas |
| `compact` | `boolean` | `false` | Desenho de miniatura: símbolos menores, no máximo dois valores por barra |
| `units` | `Partial<Units>` | `KN_UNITS` | Unidades de exibição |
| `numberFormat` | `Intl.NumberFormat` | inglês, no máximo 1 casa decimal | Formata todos os números |
| `colors` | `Partial<PlotColors>` | – | Substitui cores, por tom: [Temas e cores](/pt/plot/theming#the-colors-prop) |
| `width` | `number` | `640`, compact `400` | Largura antes de o contêiner ser medido, como no servidor |
| `height` | `number` | – | Altura fixa. Sem ela, a altura acompanha o desenho. |
| `maxHeight` | `number` | `max(320, 0.75 × width)`, compact: nenhum | Limite superior da altura automática |
| `padding` | `number` | `6` | Espaço em volta do desenho |
| `fontSize` | `number` | `13`, compact `11.5` | Tamanho do texto |
| `diagramSize` | `number` | `48`, compact `26` | Comprimento da maior ordenada dos diagramas |
| `deformedSize` | `number` | `30`, compact `18` | Maior deslocamento na deformada |
| `diagramScale` | `Partial<Record<ResultLayer, number>>` | – | Escala fixa em px por unidade SI para um resultado; substitui `diagramSize` ou `deformedSize` |
| `momentOnTensionSide` | `boolean` | `true` | M do lado tracionado; `false` para o lado comprimido |
| `resultLabelMode` | `'horizontal' \| 'axis'` | `'horizontal'` | Valores na horizontal ou girados ao longo da ordenada |
| `reactionLabels` | `'values' \| 'names'` | `'values'` | As reações como atuam, com a sua intensidade; ou, para um exercício, cada direção restringida com um nome (*A<sub>x</sub>*, *M<sub>A</sub>*), apontando no sentido em que é considerada positiva. Os nomes não precisam de resultados: [Reações como incógnitas](/pt/plot/structure-plot#reactions-as-unknowns) |
| `reserveLabelModes` | `readonly ResultLabelMode[]` | – | Modos de rótulo para os quais se reserva espaço além do atual |
| `reserveReactionLabels` | `readonly ReactionLabels[]` | – | Estilos de rótulo das reações para os quais se reserva espaço além de `reactionLabels`, para que um exercício que se transforma na sua solução mantenha o desenho parado |
| `animate` | `boolean` | `true` | Faz as camadas surgirem gradualmente e as barras se desenharem. Sempre desligado com `prefers-reduced-motion`. |
| `hover` | `boolean` | `false` | Lê os valores sob o ponteiro, marcados na extremidade da ordenada de cada diagrama. Quando desligado, a figura não recebe nenhuma entrada do ponteiro. |
| `title` | `string` | uma descrição do que é mostrado | Nome acessível da figura |

Sem `layers`, o resultado é `M` para vigas e pórticos, `N` para uma treliça e `w` quando nada transmite esforço (`defaultResultLayer`).

### Eventos {#events}

| Evento | Payload | Quando |
| --- | --- | --- |
| `readout` | `Readout \| null` | Com `hover`: o ponto da barra sob o ponteiro e os seus resultados; `null` quando o ponteiro sai |

```ts
interface Readout {
  readonly member: string
  readonly x: number // m a partir do nó inicial da barra
  readonly px: number // o ponto na tela, px
  readonly py: number
  readonly values: Readonly<Record<'N' | 'V' | 'M' | 'w', SidedValue>> // unidades SI
  readonly u: number // deslocamento ao longo do x local da barra, m
}
interface SidedValue {
  readonly left: number
  readonly right: number // igual a left onde o resultado é contínuo
}
```

## DiagramStack {#diagramstack}

```ts
import { DiagramStack } from '@edubeam/plot'
```

Desenha uma viga reta sobre os seus diagramas num mesmo eixo x. As barras devem formar uma única linha horizontal, desenhada da esquerda para a direita; qualquer outra coisa lança um erro. Guia: [DiagramStack](/pt/plot/diagram-stack).

### Props {#props-1}

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | A viga resolvida |
| `model` | `PlotModel` | – | Ou os dados simples de `modelFromSolver`; tem prioridade |
| `loadCase` | `number` | `0` | Índice em `solver.loadCases` |
| `revision` | `number` | `0` | Altere-o para redesenhar um solver modificado diretamente |
| `members` | `readonly string[]` | todas as barras | As barras da linha da viga |
| `rows` | `readonly StackRow[]` | `['V', 'M', 'w']` | As linhas de diagramas, de cima para baixo, entre `'N'`, `'V'`, `'M'`, `'w'` |
| `loadRow` | `boolean` | `true` | A viga com os seus apoios, cargas e reações acima das linhas |
| `ranges` | `Partial<Record<StackRow, readonly [number, number]>>` | o de cada linha | Intervalo de valores por linha, em unidades SI |
| `rowHeights` | `Partial<Record<StackRow, number>>` | N 100, V 116, M 128, w 76; abaixo de 560 px de largura, 88, 96, 104, 64 | Alturas das linhas antes de `maxHeight` reduzi-las |
| `maxHeight` | `number` | – | As linhas encolhem, até 60 % no máximo, para que a figura caiba. O texto mantém o tamanho. |
| `units` | `Partial<Units>` | `KN_UNITS` | Unidades de exibição |
| `numberFormat` | `Intl.NumberFormat` | inglês, no máximo 1 casa decimal | Formata todos os números |
| `colors` | `Partial<PlotColors>` | – | Substitui cores |
| `width` | `number` | `720` | Largura antes de o contêiner ser medido; usa-se no mínimo 320 |
| `fontSize` | `number` | `12.5` | Tamanho do texto |
| `hover` | `boolean` | `true` | O cursor de leitura. Quando desligado, a figura não recebe nenhuma entrada do ponteiro. |
| `loadAt` | `number` | – | Posição (em m ao longo da linha) de uma carga concentrada que o leitor pode arrastar; use com `v-model:load-at` |
| `loadLabel` | `string` | `P = …` com a intensidade da carga | Texto ao lado da carga arrastável |
| `loadStep` | `number` | `0.05` | O arrasto é arredondado a esse passo, em m; as setas do teclado movem a carga por ele |
| `title` | `string` | uma descrição das linhas | Nome acessível da figura |

### Eventos {#events-1}

| Evento | Payload | Quando |
| --- | --- | --- |
| `update:loadAt` | `number` | O leitor moveu a carga: a nova posição, em m. Alimenta `v-model:load-at`. |
| `readout` | `StackReadout \| null` | Os valores do cursor em todas as linhas; `null` quando o ponteiro sai |

```ts
interface StackReadout {
  readonly x: number // m ao longo da linha da viga
  readonly values: Partial<Record<'N' | 'V' | 'M' | 'w', { readonly left: number; readonly right: number }>> // SI
}
```

## O plugin {#the-plugin}

```ts
import { EduBeamPlot } from '@edubeam/plot'

app.use(EduBeamPlot) // registra <StructurePlot> e <DiagramStack> globalmente
```

Ele é opcional: importar os componentes pelo nome é mais leve, e um bundler descarta o plugin de um build que não o usa.

## Tipos {#types}

Para wrappers tipados em volta dos componentes, o pacote exporta as suas props e os seus eventos:

```ts
import type { PlotLayer, StructurePlotProps } from '@edubeam/plot'

const figure: StructurePlotProps = { layers: ['members', 'supports', 'M'] satisfies PlotLayer[], compact: true }
```

| Tipo | O que é |
| --- | --- |
| `StructurePlotProps`, `StructurePlotEmits` | As props e os eventos de `StructurePlot` |
| `DiagramStackProps`, `DiagramStackEmits` | As props e os eventos de `DiagramStack` |
| `Readout`, `ReadoutQuantity`, `SidedValue`, `StackReadout` | Payloads dos eventos |
| `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `StackRow` | Nomes de camadas, resultados, modos de rótulo, rótulos de reação e linhas |
| `Units`, `Unit`, `UnitKind` | Unidades de exibição: `{ symbol, scale }` por tipo |
| `PlotColors` | Cores por tom |
| `PlotModel` | O modelo de dados simples: [Modelo de desenho](/pt/plot/model) |

As demais exportações, entre elas `structureSvg` para arquivos SVG e as funções por trás do desenho, estão em [Funções](/pt/plot/functions).
