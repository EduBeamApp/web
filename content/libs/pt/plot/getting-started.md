---
title: Primeiros passos
description: "Instale o @edubeam/plot, desenhe num app Vue 3 uma viga resolvida com o @edubeam/fem, com cargas, reações e momento fletor, atualize-a e salve-a como SVG."
order: 1
group: Introdução
source: site
---

# Primeiros passos

A biblioteca de desenho @edubeam/plot desenha em SVG uma viga, um pórtico ou uma treliça plana com os seus resultados: barras, apoios, cargas, reações, os diagramas de N, V e M e a deformada, com a mesma aparência das figuras deste site. Você entrega um modelo resolvido com o [@edubeam/fem](/pt/solver), o solver por trás do [EduBeam]{.edubeam}, e a biblioteca decide a composição, a escala e onde fica cada número.

Os professores a usam para [exercícios e provas](/pt/plot/exercises) gerados a partir de uma semente (o valor inicial do gerador aleatório), para [slides](/pt/plot/slides) em que a figura se completa a cada clique e para as figuras das notas de aula, numa página web ou como arquivos para LaTeX e Word. A página [Exercícios de estática](/pt/practice) e o [gerador de provas](/pt/exam) deste site foram feitos com ela.

::div{.actions}
[Desenhe sua primeira figura](#draw-a-solved-model) [Gere exercícios](/pt/plot/exercises)
::

## Instalação {#install}

```bash
npm install @edubeam/plot @edubeam/fem vue
```

O Vue 3.5 ou posterior e o solver são *peer dependencies*, de modo que o seu app mantém uma única cópia de cada um. O pacote é somente ESM, traz os próprios tipos e não precisa de folha de estilos. Ele roda no Node 20.19 ou posterior; para executar um script escrito em TypeScript diretamente, com `node script.ts`, você precisa do Node 22.18 ou posterior.

## Desenhar um modelo resolvido {#draw-a-solved-model}

Bastam dois arquivos. O primeiro, `beams.ts`, monta e resolve uma viga com o @edubeam/fem. É uma função comum, então o mesmo modelo pode alimentar uma página, um slide e um script:

```ts [beams.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Uma viga biapoiada de `span` m sob `q` kN/m, já resolvida. O solver trabalha em unidades SI. */
export const simpleBeam = (span: number, q: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 }) // aço, Pa
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 }) // IPE 200, rígido ao cisalhamento
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // apoio fixo
  domain.createNode('B', [span, 0, 0], [DofID.Dz]) // apoio móvel
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true) // N/m, +z para baixo
  solver.solve()
  return solver
}
```

O segundo, `BeamFigure.vue`, passa o solver ao `StructurePlot` e diz o que desenhar:

```vue [BeamFigure.vue]
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams'

const beam = simpleBeam(6, 12)
</script>

<template>
  <StructurePlot :solver="beam" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
</template>
```

Essa é a figura inteira: a viga sobre os apoios, a carga de 12 kN/m, as duas reações de 36 kN e o momento fletor, $qL^2/8 = 54$ kNm no meio do vão, desenhado do lado tracionado:

::model-figure{caption="O que BeamFigure.vue desenha: um vão de 6 m sob 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
labels: horizontal
---
::

A figura ocupa toda a largura do contêiner e define a própria altura. Textos, símbolos e espessuras de linha mantêm o tamanho em pixels, seja qual for o tamanho da estrutura, então a figura continua legível num celular. Se você omitir `layers`, a figura escolhe o resultado sozinha: M para vigas e pórticos, N para uma treliça. Todas as [camadas](/pt/plot/structure-plot#layers) estão descritas em `StructurePlot`; a montagem de modelos é explicada na [documentação do solver](/pt/solver/getting-started).

## Quando o modelo muda {#when-the-model-changes}

A figura lê o solver que recebe, mas não o observa. Quando algo muda, resolva de novo e passe o novo solver. Um `computed` faz exatamente isso:

```vue [LoadSlider.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams'

const q = ref(12) // kN/m
const beam = computed(() => simpleBeam(6, q.value))
</script>

<template>
  <input v-model.number="q" type="range" min="1" max="30" />
  <StructurePlot :solver="beam" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
</template>
```

Uma viga como essa é resolvida em cerca de um milissegundo, então a figura acompanha o controle deslizante enquanto ele se move. Alterou um solver diretamente, sem criar outro? Incremente a prop `revision` e a figura o lê de novo.

::callout{type="tip" title="Não deixe o solver com reatividade profunda"}
Um `computed`, uma prop ou uma simples `const` guardam o solver como ele é. Para mantê-lo no estado de um componente, use `shallowRef` ou envolva-o com `markRaw`: um `ref` comum faria o Vue percorrer o solver inteiro para torná-lo reativo, sem nenhum proveito.
::

## Salvar como arquivo {#save-it-as-a-file}

Para uma figura no LaTeX, no Word ou no Inkscape, `structureSvg` escreve o mesmo desenho como um arquivo SVG independente, com cores fixas. Ele não precisa do Vue nem de um navegador, só do Node. Salve isto como `beam-svg.ts`, ao lado de `beams.ts`:

```ts [beam-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { simpleBeam } from './beams.ts'

const svg = structureSvg(modelFromSolver(simpleBeam(6, 12)), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
})
writeFileSync('beam.svg', svg)
```

Execute-o com `node beam-svg.ts` (Node 22.18 ou posterior; em versões anteriores, `npx tsx beam-svg.ts`). As opções, e como levar o arquivo para o LaTeX e o Word, estão em [Um arquivo SVG independente](/pt/plot/functions#a-standalone-svg-file).

## A figura empilhada {#the-stacked-figure}

`DiagramStack` desenha a figura de todo livro de estática: uma viga reta com as suas cargas e, embaixo, no mesmo eixo x, V(x), M(x) e w(x). Com `v-model:load-at`, o leitor pode arrastar uma carga concentrada ao longo da viga e ver os diagramas acompanharem:

```vue
<DiagramStack v-model:load-at="at" :solver="solveWithLoadAt(at)" />
```

O exemplo completo está em [DiagramStack](/pt/plot/diagram-stack).

## Usar em todo o app {#use-it-everywhere}

Para registrar os dois componentes globalmente, em vez de importá-los onde forem usados:

```ts [main.ts]
import { createApp } from 'vue'
import { EduBeamPlot } from '@edubeam/plot'
import App from './App.vue'

createApp(App).use(EduBeamPlot).mount('#app') // <StructurePlot> e <DiagramStack> em todos os templates
```

Importações nomeadas deixam o bundle menor: uma página que importa só `StructurePlot` não recebe nem `DiagramStack` nem o plugin. Os dois componentes também são renderizados no servidor, no Nuxt ou no VitePress: veja [Incorporação](/pt/plot/embedding).

## Próximos passos {#next}

::card-grid{cols="2"}
:::card{title="Exercícios e provas" icon="lucide:dices" to="/pt/plot/exercises"}
Um exercício diferente para cada aluno a partir de uma semente, com o gabarito, impresso ou salvo para o LaTeX.
:::
:::card{title="Slides e notas de aula" icon="lucide:presentation" to="/pt/plot/slides"}
Figuras que se completam a cada clique no Slidev, no Vue ou no Beamer, e as mesmas figuras para as notas de aula.
:::
:::card{title="StructurePlot" icon="lucide:frame" to="/pt/plot/structure-plot"}
Camadas, cotas, miniaturas, tamanhos, unidades e leitura de valores com o ponteiro.
:::
:::card{title="DiagramStack" icon="lucide:rows-3" to="/pt/plot/diagram-stack"}
Uma viga sobre os seus diagramas de V, M e w, com uma carga que o leitor pode arrastar.
:::
::
