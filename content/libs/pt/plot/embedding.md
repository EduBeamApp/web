---
title: Incorporação
description: "Figuras do @edubeam/plot num app Vite, em notas de aula com VitePress ou num site Nuxt: renderização no servidor, modelos resolvidos em JSON ou SVG puro sem Vue."
order: 7
source: site
---

# Incorporação

Os componentes são Vue 3 puro, então funcionam em qualquer lugar onde o Vue funciona e são renderizados tanto no servidor quanto no navegador. Nada acessa `window` antes de a figura ser montada, e cada figura recebe os seus próprios ids, de modo que qualquer número delas pode dividir a mesma página. Escolha a configuração que corresponde ao seu caso:

| Você tem | Faça isto |
| --- | --- |
| Um app Vue criado com Vite | Instale, importe e pronto: [Um app Vite](#a-vite-app) |
| Notas de aula em Markdown | Registre o plugin uma vez no VitePress: [Notas de aula com VitePress](#vitepress-course-notes) |
| Um site Nuxt | Importe os componentes ou acrescente um plugin: [Nuxt](#nuxt) |
| Uma página que só mostra figuras | Resolva no build e entregue JSON: [Entregar o desenho](#ship-the-drawing-not-the-solver) |
| Um projeto sem Vue | Escreva o SVG no Node: [Sem Vue](#plain-html-from-node) |

## Um app Vite {#a-vite-app}

```bash
npm create vue@latest
npm install @edubeam/plot @edubeam/fem
```

Importe os componentes onde for usá-los, como em [Primeiros passos](/pt/plot/getting-started#draw-a-solved-model), ou registre os dois de uma vez com `app.use(EduBeamPlot)`. Não há mais nada para configurar: nem folha de estilos nem plugin de bundler.

## Notas de aula com VitePress {#vitepress-course-notes}

O [VitePress](https://vitepress.dev) gera páginas a partir de Markdown com Vue, o que o torna um bom lugar para notas de aula. Registre os componentes no tema, em `.vitepress/theme/index.ts`:

```ts [.vitepress/theme/index.ts]
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { EduBeamPlot } from '@edubeam/plot'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(EduBeamPlot) // <StructurePlot> e <DiagramStack> em todas as páginas
  },
} satisfies Theme
```

Depois monte e desenhe um modelo diretamente numa página, ao lado de `frame.ts`:

```md [portal-frame.md]
<script setup lang="ts">
import { portalFrame } from './frame' // () => um LinearStaticSolver resolvido

const frame = portalFrame()
</script>

# Portal frame

The bending moment under the design loads:

<StructurePlot :solver="frame" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

`vitepress build` resolve o pórtico e escreve o SVG pronto no HTML da página, com todos os rótulos. No navegador, a página assume o controle, e a figura se ajusta à largura da coluna. `frame.ts` está na página [Slides e notas de aula](/pt/plot/slides#a-figure-that-builds-up).

## Nuxt {#nuxt}

O Nuxt também renderiza no servidor; este site é feito com ele. Importe os componentes numa página ou num componente como de costume, ou registre-os para o app inteiro com um plugin em `plugins/edubeam-plot.ts`:

```ts [plugins/edubeam-plot.ts]
import { EduBeamPlot } from '@edubeam/plot'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(EduBeamPlot)
})
```

No servidor não há contêiner para medir, então a figura é composta na largura da prop `width`: 640 px por padrão (400 px com `compact`) e 720 px para o `DiagramStack`. Depois de montada, ela é composta de novo na largura real. Se a sua coluna for bem mais estreita ou mais larga, passe a `width` um valor mais próximo, e a figura não mudará de tamanho enquanto a página carrega.

## Entregar o desenho, não o solver {#ship-the-drawing-not-the-solver}

Uma página que só mostra uma figura não precisa de solver. `modelFromSolver` lê um modelo resolvido em dados simples: nós, barras, cargas, reações e, para cada barra, N, V, M e os deslocamentos como polinômios exatos. Gere esses dados no build, com um script como `build-figures.ts`:

```ts [build-figures.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

writeFileSync('portal-frame.json', JSON.stringify(modelFromSolver(portalFrame())))
```

e desenhe-os com a prop `model`:

```vue
<script setup lang="ts">
import { StructurePlot, type PlotModel } from '@edubeam/plot'
import frame from './portal-frame.json'
</script>

<template>
  <StructurePlot :model="frame as PlotModel" />
</template>
```

O pórtico ocupa menos de 2 kB de JSON e o desenho sai idêntico ao feito a partir do solver. Todos os recursos funcionam com um modelo como com um solver, e `model` tem prioridade se você passar os dois. O formato está em [Modelo de desenho](/pt/plot/model).

## Sem Vue {#plain-html-from-node}

`structureSvg` transforma um modelo no texto de um arquivo SVG, com cores fixas e sem estilos nem scripts. Cole-o em qualquer HTML, num gerador de sites estáticos, num arquivo Markdown ou num CMS. Este script escreve uma página com uma figura:

```ts [frame-html.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const svg = structureSvg(modelFromSolver(portalFrame()), { layers: ['members', 'supports', 'reactions', 'M'] })
writeFileSync('frame.html', `<!doctype html><meta charset="utf-8"><title>Portal frame</title>${svg}`)
```

Uma figura assim tem o tamanho com que foi escrita, 640 px de largura por padrão (`max-width: 100%; height: auto` permite que ela encolha com a coluna), e um fundo branco próprio; `background: false` a deixa transparente. Ela não acompanha um tema escuro nem lê valores sob o ponteiro: para isso, renderize o componente. O [script que imprime provas](/pt/plot/exercises#print-a-test) gera uma prova inteira assim, e [Um arquivo SVG independente](/pt/plot/functions#a-standalone-svg-file) lista as opções.
