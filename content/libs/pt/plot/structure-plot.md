---
title: StructurePlot
description: "Vigas, pórticos e treliças com StructurePlot: camadas, figuras que se completam, reações como incógnitas, miniaturas, tamanhos, unidades e leitura de valores."
order: 2
group: Componentes
source: site
---

# StructurePlot

`StructurePlot` desenha uma estrutura inteira, ajustada à largura do seu contêiner: barras, rótulas, apoios, cargas, reações, os diagramas de N, V e M e a deformada. Passe ao componente um solver, ou o [modelo de dados simples](/pt/plot/model) obtido de um, e diga o que desenhar.

```vue
<StructurePlot :solver="solver" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

Todas as props, com tipo e valor padrão, estão na [API dos componentes](/pt/plot/components#structureplot).

Esta figura é um `StructurePlot` com `nodeLabels` e `dimensions` ativadas, `hover` ligado e o formato numérico deste site, com quatro algarismos significativos: alterne entre os resultados e aponte para uma barra para ler os seus valores.

::model-figure{caption="Um pórtico: apoios fixos nas bases, 10 kN/m na viga, 15 kN em B"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: pin, D: pin }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
  - { node: B, fx: 15 }
results: [M, V, N, w]
show: [nodeLabels, dimensions]
---
::

## Camadas {#layers}

Uma figura é feita de camadas, pintadas numa ordem fixa, seja qual for a ordem em que você as liste:

| Camada | Desenha |
| --- | --- |
| `members` | as barras, com as rótulas como pequenos círculos |
| `supports` | um símbolo para cada apoio, girado nos apoios inclinados |
| `loads` | cargas nodais e nas barras, cargas térmicas e recalques, com os seus valores |
| `reactions` | as reações, como setas e setas curvas com os seus valores; ou, com `reactionLabels: 'names'`, como as [incógnitas nomeadas](#reactions-as-unknowns) de um exercício |
| `nodes` | cada nó como um pequeno círculo |
| `nodeLabels` | os rótulos dos nós |
| `dimensions` | cotas em cadeia, como num enunciado de exercício: cada trecho entre nós e cargas concentradas embaixo da estrutura, cada andar à direita dela e a cota total numa segunda linha |
| `N`, `V`, `M` | os diagramas de esforço normal, esforço cortante e momento fletor |
| `w` | a deformada |

Sem `layers`, a figura desenha barras, apoios, cargas e reações, mais um resultado escolhido conforme a estrutura: `M` para vigas e pórticos, `N` para uma treliça e `w` quando nada transmite esforço, como numa viga livre para se dilatar sob uma carga térmica.

Os diagramas seguem o aplicativo EduBeam: N e V são hachurados transversalmente à barra, e M fica do lado tracionado, de modo que um momento positivo (tração embaixo) aparece abaixo da viga. `:moment-on-tension-side="false"` desenha M do lado comprimido. Numa treliça, o esforço normal de cada barra aparece uma única vez, ao longo da barra, colorido conforme o sinal.

## Figuras que se completam passo a passo {#figures-that-build-up}

`reserve` lista camadas para as quais se reserva espaço enquanto estão ocultas. A figura posiciona todas as camadas reservadas desde o início; assim, quando uma delas é ativada, ela surge suavemente no seu lugar e nada mais se move:

```vue
<script setup lang="ts">
import type { PlotLayer } from '@edubeam/plot'

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'],
  ['nodeLabels', 'members', 'supports'],
  ['nodeLabels', 'members', 'supports', 'loads'],
  ['members', 'supports', 'loads', 'reactions'],
  ['members', 'supports', 'reactions', 'M'],
]
const all = [...new Set(stages.flat())]
// `frame` é um solver resolvido e `step` a etapa atual: o componente completo está em Slides e notas de aula
</script>

<template>
  <StructurePlot :solver="frame" :layers="stages[step]" :reserve="all" />
</template>
```

Com `animate`, ligado por padrão, as camadas aparecem gradualmente e as barras se desenham de uma extremidade à outra. Com `prefers-reduced-motion`, nada é animado. [Slides e notas de aula](/pt/plot/slides) coloca esta figura numa apresentação.

## Valores dos diagramas {#diagram-values}

Cada valor é escrito logo além da extremidade da ordenada a que pertence, como fazem os livros didáticos: toda extremidade de barra com valor não nulo, os extremos entre elas, os dois valores num salto e o valor num canto rígido uma única vez. Os valores são números sem unidade na unidade de exibição (kN para N e V, kNm para M), assim como as reações, como no aplicativo EduBeam; as unidades só aparecem nos dados do problema: cargas, recalques e variações de temperatura. Um rótulo que se sobreporia a outro rótulo, a uma barra ou a uma seta tenta outras posições na mesma extremidade e é omitido se nenhuma estiver livre, de modo que dois números nunca ficam um sobre o outro. Os valores das cargas e das reações são posicionados primeiro, para que os números de um diagrama nunca os expulsem. Os esforços nas barras de treliça nunca são omitidos: eles deslizam ao longo da barra, trocam de lado e, só em último caso, diminuem de tamanho.

`result-label-mode="axis"` gira os valores para que acompanhem as suas ordenadas, como o aplicativo EduBeam os escreve. Se o leitor puder alternar entre os dois modos, passe `:reserve-label-modes="['horizontal', 'axis']"` para que o desenho não se mova quando ele alternar.

## Reações como incógnitas {#reactions-as-unknowns}

Um enunciado de exercício pede as reações, então deve mostrá-las sem os valores. `reaction-labels="names"` desenha uma seta para cada direção que um apoio restringe, no sentido em que ela é considerada positiva: na direção do eixo x do nó (para a direita, a menos que o apoio esteja girado), para cima e no sentido anti-horário para um momento de engastamento. Cada seta leva o nome do seu nó, *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>*, em itálico e com um subscrito de verdade. Assim, o sinal de cada resposta fica definido no próprio desenho: uma reação que atua no sentido contrário é negativa.

```vue
<StructurePlot
  :model="model"
  :layers="['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']"
  reaction-labels="names"
/>
```

![Em cima, uma viga engastada e apoiada como enunciado de exercício: engaste em A, apoio móvel em B, 40 kN no meio do vão, cotas em cadeia de 3 m e 3 m com 6 m no total e as reações desenhadas como setas nomeadas A_x, A_z, M_A e B_z. Embaixo, a mesma viga com os rótulos de reação padrão: 27,5 e 12,5 para cima, um momento de engastamento de 45 e o momento fletor de −45 no engaste a 37,5 sob a carga](/screenshots/pt/p4-plot-reaction-names.webp){.shot-lg}

Os nomes não precisam de resultados, então um modelo que ainda não foi resolvido pode ser desenhado como enunciado. Para o gabarito, deixe `reactionLabels` em `'values'`. Nomes e valores ocupam espaços diferentes (uma reação horizontal nula tem nome no enunciado, mas nenhuma seta no gabarito); por isso, uma figura que alterna entre eles deve reservar espaço para os dois com `:reserve-reaction-labels="['names', 'values']"`: o desenho fica parado e só os rótulos mudam. O cartão de exercício de [Exercícios e provas](/pt/plot/exercises#the-exercise-in-a-page) alterna entre eles com uma prop `answers`, como faz a página [Exercícios de estática](/pt/practice) deste site quando o aluno pede a solução.

## Miniaturas {#thumbnails}

`compact` desenha para blocos de cerca de 400 × 200 px: símbolos menores e texto de 11,5 px, no máximo dois valores por barra e cargas distribuídas rotuladas só pela intensidade, sem `q =`.

```vue
<StructurePlot v-for="t in tiles" :key="t.title" :solver="t.solver" compact :height="200" :title="t.title" />
```

A [galeria de exemplos](/pt/examples/) deste site é desenhada assim.

## Tamanho {#size}

A figura mede o seu contêiner e é composta nessa largura, em pixels reais. Sem `height`, a altura acompanha o desenho, até `maxHeight`, que por padrão é $\max(320;\ 0{,}75 \times \text{largura})$. Antes de poder medir, por exemplo no servidor, ela usa `width`, 640 px por padrão.

| Prop | Padrão | Define |
| --- | --- | --- |
| `width` | 640, compact 400 | a largura de composição até o contêiner ser medido, px |
| `height` | acompanha o desenho | uma altura fixa, px |
| `maxHeight` | $\max(320, 0.75w)$, compact: nenhum | o limite superior da altura automática |
| `padding` | 6 | o espaço em volta do desenho, px |
| `fontSize` | 13, compact 11.5 | o tamanho do texto, px |
| `diagramSize` | 48, compact 26 | o comprimento da maior ordenada, px |
| `deformedSize` | 30, compact 18 | o maior deslocamento da deformada, px |

### Várias figuras na mesma escala {#several-plots-at-one-scale}

Cada figura escala os diagramas pelo seu próprio maior valor, então um momento de 20 kNm parece tão grande quanto um de 80 kNm. Para comparar, fixe a escala em pixels por unidade SI com `diagramScale`:

```vue
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams' // de Primeiros passos: (vão em m, q em kN/m) => um solver resolvido

const spans = [4, 6, 8].map((L) => ({ L, solver: simpleBeam(L, 10) }))
// 0.5 px por kNm (0.5e-3 px por N·m): os 80 kNm do vão de 8 m ocupam 40 px, os 20 kNm do vão de 4 m, 10 px
const scale = { M: 0.5e-3 }
</script>

<template>
  <figure v-for="s in spans" :key="s.L">
    <StructurePlot :solver="s.solver" :layers="['members', 'supports', 'M']" :diagram-scale="scale" />
    <figcaption>L = {{ s.L }} m</figcaption>
  </figure>
</template>
```

## Unidades e números {#units-and-numbers}

Internamente, os valores estão em SI e só são convertidos para exibição: kN, kNm, kN/m, m, mm, mrad e K por padrão. Substitua qualquer unidade por um símbolo e uma escala, com valor exibido = valor SI × escala:

```vue
<StructurePlot :solver="solver" :units="{ force: { symbol: 'N', scale: 1 } }" />
```

Os números passam por um `Intl.NumberFormat`, por padrão em inglês e com no máximo uma casa decimal. Passe o seu próprio formato para acompanhar o idioma da página, como neste exemplo em tcheco (com `'pt'`, você obtém o formato brasileiro, com vírgula decimal):

```vue
<StructurePlot :solver="solver" :number-format="new Intl.NumberFormat('cs', { maximumFractionDigits: 2 })" />
```

Os sinais de menos são sinais de menos de verdade (−), e um valor que arredonda para zero nunca aparece como −0. Os nomes das unidades são `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` e `temperature`; `KN_UNITS` e `SI_UNITS` são exportados como ponto de partida.

## Leitura de valores {#reading-values}

Com `hover`, a figura lê os resultados exibidos no ponto da barra sob o ponteiro. Ela marca cada valor onde ele está desenhado, com um ponto na extremidade da ordenada de cada diagrama exibido (as duas extremidades num salto) ou sobre a deformada, e os lista numa pequena etiqueta, como `M = 54 kNm`, ou os dois lados de um salto, `V = 13.3 → −6.7 kN`. O ponteiro capta uma barra de qualquer ponto sobre o seu diagrama, não só sobre a barra. A figura também emite os valores como dados:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { StructurePlot, type Readout } from '@edubeam/plot'
import { portalFrame } from './frame' // de Slides e notas de aula: () => um solver resolvido

const frame = portalFrame()
const reading = ref<Readout | null>(null)
</script>

<template>
  <StructurePlot :solver="frame" :layers="['members', 'supports', 'M']" hover @readout="reading = $event" />
  <p v-if="reading">
    Member {{ reading.member }}, {{ reading.x.toFixed(2) }} m from its start:
    M = {{ (reading.values.M.left / 1e3).toFixed(1) }} kNm
  </p>
</template>
```

Uma leitura é `{ member, x, px, py, values, u }`: a barra, a posição ao longo dela em metros, o ponto na tela em px, `{ left, right }` para cada um de `N`, `V`, `M` e `w` em unidades SI e o deslocamento axial `u`. Ela é `null` quando o ponteiro sai. As figuras interativas deste site usam `hover`: aponte para uma delas.

Sem `hover`, a figura não registra nenhum event listener, então a página rola normalmente sobre ela, e um toque numa figura dentro de um link segue o link. Com `hover`, ela escuta apenas eventos de ponteiro e mantém a rolagem vertical e o zoom com pinça funcionando nas telas sensíveis ao toque.

## Acessibilidade {#accessibility}

Cada figura é um `<svg role="img">` nomeado pela prop `title` ou por uma descrição do que mostra, como “Structure with its loads, reactions, bending moment” (o texto vem em inglês da biblioteca). As camadas reservadas ocultas recebem `aria-hidden`.
