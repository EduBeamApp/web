---
title: Slides e notas de aula
description: "Figuras de aula com @edubeam/plot que se completam clique a clique no Slidev, Vue ou Beamer, resolvidas ao vivo e levadas em SVG para notas, PowerPoint e Word."
order: 6
source: site
---

# Slides e notas de aula

Mostre a estrutura na ordem em que você a explica: primeiro a geometria, depois os apoios e as cargas, em seguida as reações e, por último, o momento fletor. Uma figura desenhada a partir de um modelo resolvido se completa no próprio lugar, uma camada por clique, e está sempre certa. O mesmo modelo fornece depois as figuras das suas notas de aula.

![Um slide do Slidev após 0, 2 e 4 cliques: os nós de um pórtico com as suas cotas, depois o pórtico sobre os apoios com as cargas e, por fim, as reações e o momento fletor](/screenshots/pt/p2p-plot-slidev-steps.webp){.shot-md}

## Uma figura que se completa passo a passo {#a-figure-that-builds-up}

Dois arquivos. `frame.ts` monta e resolve a estrutura:

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Um pórtico de 6 m por 4 m, apoios fixos nas bases, 10 kN/m na viga e 15 kN empurrando em B. */
export const portalFrame = (): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 }) // IPE 300
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [0, 0, -4]) // z aponta para baixo: 4 m para cima
  domain.createNode('C', [6, 0, -4])
  domain.createNode('D', [6, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  domain.createBeam2D(2, ['B', 'C'], 1, 1)
  domain.createBeam2D(3, ['C', 'D'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(2, [0, 10e3], true)
  solver.loadCases[0].createNodalLoad('B', { [DofID.Dx]: 15e3 })
  solver.solve()
  return solver
}
```

`BuildUp.vue` a desenha em etapas. Cada etapa lista as camadas que mostra, e `reserve` posiciona todas elas desde o primeiro clique, de modo que cada camada surge suavemente no seu lugar e nada se move:

```vue [BuildUp.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { StructurePlot, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame'

const props = defineProps<{ step: number }>()

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'], // a geometria
  ['nodeLabels', 'members', 'supports'], // a estrutura
  ['nodeLabels', 'members', 'supports', 'loads'], // as cargas
  ['members', 'supports', 'loads', 'reactions'], // as reações
  ['members', 'supports', 'reactions', 'M'], // e o momento fletor
]
const all = [...new Set(stages.flat())] // posicionadas desde a primeira etapa, para que nada se mova depois
const layers = computed(() => stages[Math.min(props.step, stages.length - 1)])

const frame = portalFrame()
</script>

<template>
  <StructurePlot :solver="frame" :layers="layers" :reserve="all" :height="360" />
</template>
```

Uma camada também pode sair: a última etapa retira as cargas para dar espaço ao momento. `:height="360"` mantém a figura dentro do slide. As barras se desenham de uma extremidade à outra quando aparecem pela primeira vez, e as camadas surgem gradualmente em meio segundo; as duas animações ficam desligadas com `prefers-reduced-motion`, e `:animate="false"` as desliga para todos. Para deixá-las mais lentas num auditório, veja [Personalizar a animação](/pt/plot/theming#restyling-the-animation).

## No Slidev {#in-slidev}

O [Slidev](https://sli.dev) cria slides a partir de Markdown com Vue, então o componente funciona ali sem nenhuma alteração. Instale as bibliotecas na apresentação:

```bash
npm install @edubeam/plot @edubeam/fem
```

Coloque `frame.ts` e `BuildUp.vue` na pasta `components/` da apresentação e deixe que os cliques do slide controlem a etapa em `slides.md`:

```md [slides.md]
---
clicks: 4
---

# From geometry to bending moment

<BuildUp :step="$clicks" />
```

`clicks: 4` dá ao slide quatro cliques, e `$clicks` os conta a partir de 0. Cada vez que você pressiona a seta, aparece a etapa seguinte; ao voltar, ela se oculta de novo. `slidev export` gera um PDF da apresentação, com uma página por clique se você usar `--with-clicks`.

## Em qualquer apresentação com Vue {#in-any-vue-slides}

Em qualquer outro lugar, controle você mesmo a etapa:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import BuildUp from './BuildUp.vue'

const step = ref(0)
</script>

<template>
  <BuildUp :step="step" />
  <button type="button" @click="step = Math.max(0, step - 1)">Back</button>
  <button type="button" @click="step++">Next</button>
</template>
```

## Resolver ao vivo {#solve-it-live}

O solver leva milissegundos para um pórtico como esse, então dá para alterar a estrutura durante a aula e resolvê-la na hora. Ligue uma carga a um controle deslizante e passe um novo modelo resolvido a cada vez, como em [Quando o modelo muda](/pt/plot/getting-started#when-the-model-changes).

- **Uma carga móvel.** O [DiagramStack](/pt/plot/diagram-stack#a-load-the-reader-can-drag) permite que os alunos arrastem uma carga concentrada ao longo de uma viga e vejam o esforço cortante e o momento fletor acompanharem.
- **Casos lado a lado.** Fixe [`diagramScale`](/pt/plot/structure-plot#several-plots-at-one-scale) e duas figuras desenham os momentos na mesma escala, de modo que o maior parece maior.
- **Leitura de valores.** Com `hover`, apontar para uma barra marca o valor na extremidade da ordenada de cada diagrama: veja [Leitura de valores](/pt/plot/structure-plot#reading-values).

## Figuras para Beamer, PowerPoint e Word {#figures-for-beamer-powerpoint-and-word}

Uma apresentação feita no Beamer do LaTeX ou no PowerPoint, ou notas de aula escritas no Word, recebem a figura como arquivo. `structureSvg` escreve a figura como um SVG independente com cores fixas, composto como o `StructurePlot` o compõe. Um script Node, `frame-svg.ts`, ao lado de `frame.ts`:

```ts [frame-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![O pórtico como arquivo SVG independente, renderizado pelo CairoSVG: as cargas, as reações, 20 e 40 para cima e 2,3 e 12,7 na horizontal, e o momento fletor de −50,7 em C a 29,3 na viga](/screenshots/pt/p2p-plot-frame-svg.webp){.shot-lg}

O PowerPoint e o Word (2019 e Microsoft 365) inserem o SVG como ele é. O LaTeX o recebe como PDF: converta-o com `cairosvg frame.svg -o frame.pdf` ou com o Inkscape, ou deixe que o `\includesvg` do pacote `svg` faça isso. [Figuras para LaTeX e Word](/pt/plot/exercises#figures-for-latex-and-word) traz os detalhes, e [Um arquivo SVG independente](/pt/plot/functions#a-standalone-svg-file) todas as opções.

### Uma figura em etapas no Beamer {#a-build-up-in-beamer}

Um arquivo é ajustado às camadas que desenha, então arquivos escritos separadamente para cada etapa não ficariam alinhados. Passe a `structureSvg` o mesmo `reserve` de `BuildUp.vue`, todas as camadas de todas as etapas, e cada arquivo terá o mesmo tamanho, com a estrutura no mesmo lugar. `frame-stages.ts` escreve um arquivo por etapa:

```ts [frame-stages.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'],
  ['nodeLabels', 'members', 'supports'],
  ['nodeLabels', 'members', 'supports', 'loads'],
  ['members', 'supports', 'loads', 'reactions'],
  ['members', 'supports', 'reactions', 'M'],
]
const all = [...new Set(stages.flat())]
const frame = modelFromSolver(portalFrame())

stages.forEach((layers, i) => {
  writeFileSync(`frame-${i + 1}.svg`, structureSvg(frame, { layers, reserve: all }))
})
```

Converta os arquivos para PDF:

```bash
for i in 1 2 3 4 5; do cairosvg frame-$i.svg -o frame-$i.pdf; done
```

e dê a cada um a sua própria sobreposição (*overlay*). Cada arquivo contém uma etapa inteira, então o frame do Beamer mostra um arquivo de cada vez e, como eles estão alinhados, cada clique parece acrescentar uma camada:

```latex [lecture.tex]
\begin{frame}{From geometry to bending moment}
  \centering
  \includegraphics<1>[width=0.8\linewidth]{frame-1.pdf}%
  \includegraphics<2>[width=0.8\linewidth]{frame-2.pdf}%
  \includegraphics<3>[width=0.8\linewidth]{frame-3.pdf}%
  \includegraphics<4>[width=0.8\linewidth]{frame-4.pdf}%
  \includegraphics<5>[width=0.8\linewidth]{frame-5.pdf}
\end{frame}
```

No PowerPoint, coloque os cinco arquivos em cinco slides consecutivos, sem transição entre eles: cada etapa fica igual a um clique na aula.

## Notas de aula e material impresso {#notes-and-handouts}

- **Notas de aula na web.** O VitePress e o Nuxt renderizam as figuras no build, então elas já estão no HTML antes de qualquer script rodar: veja [Incorporação](/pt/plot/embedding).
- **Notas impressas.** Escreva as figuras com `structureSvg` numa página HTML e imprima-a, como faz o [script que imprime provas](/pt/plot/exercises#print-a-test), ou inclua os arquivos no LaTeX ou no Word.
- **Um modelo, todas as figuras.** O mesmo `frame.ts` alimenta os slides, as notas de aula e a lista de exercícios, então eles nunca se contradizem.
