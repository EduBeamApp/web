---
title: Desenho dos resultados
description: "Transforme um modelo resolvido no @edubeam/fem em diagramas com o @edubeam/plot: num componente Vue, como SVG avulso a partir de um script Node ou como JSON."
order: 11
source: site
---

# Desenho dos resultados {#drawing-the-results}

O [@edubeam/plot](/pt/plot) desenha um modelo resolvido do jeito que as figuras deste site aparecem: barras, apoios, cargas, reações, os diagramas de N, V e M e a deformada, em SVG. Entregue o solver a ele; ele lê tudo de que precisa.

```bash
npm install @edubeam/plot @edubeam/fem vue
```

## Num componente Vue {#in-a-vue-component}

```vue [BeamFigure.vue]
<script setup lang="ts">
import { markRaw } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot } from '@edubeam/plot'

// Viga biapoiada de 6 m sob 12 kN/m, em unidades SI: m, N, Pa
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // apoio fixo
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // apoio móvel
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

// Só leitura, nunca observado: markRaw impede o Vue de tornar o solver reativo
const beam = markRaw(solver)
</script>

<template>
  <StructurePlot
    :solver="beam"
    :layers="['members', 'supports', 'loads', 'reactions', 'M']"
  />
</template>
```

O componente desenha as reações de 36 kN e o momento de 54 kNm, como nesta figura interativa:

::model-figure{caption="O que BeamFigure.vue desenha"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
---
::

`StructurePlot` desenha o caso de carga 0; a prop `loadCase` escolhe outro de `solver.loadCases`. Ele não observa o solver: depois de alterar o modelo e resolver de novo, mude a prop `revision` para redesenhar. [StructurePlot](/pt/plot/structure-plot) traz todas as opções.

## Sem navegador {#without-a-browser}

`structureSvg`, novo no @edubeam/plot 0.2, grava o mesmo desenho como um arquivo SVG avulso, com cores simples que o Word, o Inkscape e as ferramentas de LaTeX entendem. Sem navegador, sem componente Vue, só um script Node:

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { modelFromSolver, structureSvg } from '@edubeam/plot'

// A mesma viga de BeamFigure.vue
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

const svg = structureSvg(modelFromSolver(solver), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
  width: 640,
})
writeFileSync('beam.svg', svg)
```

O arquivo mostra o mesmo que a figura interativa acima, com cores para impressão. `width` define o tamanho em pixels, já que não há nenhum contêiner para medir. Para uma página inteira de figuras pronta para imprimir, reúna vários desses arquivos numa única página HTML, como faz o [script que imprime provas](/pt/plot/exercises#print-a-test) do @edubeam/plot, sem Vue e sem navegador. As opções de `structureSvg` estão em [Funções](/pt/plot/functions#a-standalone-svg-file).

## Entregue o desenho, não o solver {#ship-the-drawing-not-the-solver}

`modelFromSolver` transforma um modelo resolvido em dados simples, serializáveis em JSON: geometria, cargas, reações e os resultados de cada barra como polinômios exatos. Resolva no momento do build, publique o JSON e desenhe-o com a prop `model` em vez de `solver`:

```ts
import { modelFromSolver } from '@edubeam/plot'

// ... a viga resolvida de to-svg.ts
writeFileSync('beam.json', JSON.stringify(modelFromSolver(solver)))
```

Assim, a página que mostra a figura não resolve nada: o trabalho é feito uma única vez, no build. [Incorporação](/pt/plot/embedding#ship-the-drawing-not-the-solver) mostra o lado do componente, e [Modelo de desenho](/pt/plot/model), o formato.

Todo o resto, das cores aos valores exibidos ao passar o mouse e às cargas que podem ser arrastadas, está na [documentação do @edubeam/plot](/pt/plot/getting-started).
