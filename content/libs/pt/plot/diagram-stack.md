---
title: DiagramStack
description: "Desenhe com DiagramStack uma viga sobre os seus diagramas V(x), M(x) e w(x) num mesmo eixo x, leia todas as linhas com um cursor e deixe o leitor arrastar uma carga."
order: 3
source: site
---

# DiagramStack

`DiagramStack` desenha a figura de todo livro de estática: uma viga reta com os seus apoios, cargas e reações e, embaixo dela, no mesmo eixo x, o esforço cortante V(x), o momento fletor M(x) e a flecha w(x). Um cursor lê todas as linhas ao mesmo tempo, e uma carga concentrada opcional pode ser arrastada ao longo da viga.

```vue
<DiagramStack :solver="solver" />
```

![DiagramStack: uma viga biapoiada de 6 m com uma carga de 20 kN que o leitor pode arrastar, aqui a 4,3 m do apoio da esquerda; reações de 5,7 kN e 14,3 kN, o esforço cortante saltando de 5,7 kN para −14,3 kN sob a carga, o momento fletor máximo de 24,4 kNm nesse ponto e a flecha com o seu maior valor, 17 mm](/screenshots/pt/p2p-plot-diagram-stack.webp){.shot-lg}

As barras devem formar uma única linha horizontal, desenhada da esquerda para a direita. Qualquer outra coisa, uma linha inclinada ou quebrada ou uma barra desenhada da direita para a esquerda, é recusada com um erro em vez de ser desenhada errado, porque o eixo x da figura é o eixo da viga. Todas as props estão na [API dos componentes](/pt/plot/components#diagramstack).

## Linhas {#rows}

| Prop | Padrão | Define |
| --- | --- | --- |
| `rows` | `['V', 'M', 'w']` | os diagramas, de cima para baixo; `'N'` também está disponível |
| `loadRow` | `true` | a viga com os seus apoios, cargas e reações acima das linhas |
| `members` | todas as barras | as barras da linha da viga, quando o modelo tem outras |
| `rowHeights` | N 100, V 116, M 128, w 76 px | as alturas das linhas; um pouco menores abaixo de 560 px de largura |
| `maxHeight` | nenhum | as linhas encolhem, até 60 % no máximo, para que a figura caiba; o texto mantém o tamanho |
| `ranges` | o de cada linha | intervalos de valores fixos por linha, em unidades SI |

V e N são desenhados positivos para cima, M e w positivos para baixo, como a maioria dos livros os desenha: um momento positivo (tração embaixo) e uma flecha para baixo ficam abaixo do eixo. Cada linha escreve os seus valores extremos.

## O cursor de leitura {#the-reading-cursor}

`hover` vem ligado por padrão. Ao mover o ponteiro sobre a figura, aparece um cursor vertical que atravessa todas as linhas, com o valor de cada linha numa pequena etiqueta. A menos de 8 px de um salto, numa carga concentrada ou num apoio, o cursor se fixa nesse ponto, e V mostra os dois lados, como em `5.7 → −14.3 kN` sob a carga da figura acima. Os valores também são emitidos:

```vue
<DiagramStack :solver="solver" @readout="(r) => (reading = r)" />
```

Uma leitura é `{ x, values }`: `x` em metros ao longo da viga e `{ left, right }` para cada linha, em unidades SI; `null` quando o ponteiro sai.

## Uma carga que o leitor pode arrastar {#a-load-the-reader-can-drag}

Passe a `v-model:load-at` a posição de uma carga concentrada e ela ganha uma alça: o leitor a arrasta com o ponteiro ou coloca o foco nela e usa as setas do teclado. O componente só informa a nova posição. Resolva a viga de novo com a carga nesse ponto e devolva o novo solver, como faz `MovingLoad.vue`:

```vue [MovingLoad.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { beamLine, DiagramStack, lineDiagram, modelFromSolver, rowRange, type StackRow } from '@edubeam/plot'

const L = 6 // m
const P = 20e3 // N

/** A viga com a carga concentrada a `at` metros de A, já resolvida. */
const solveWithLoadAt = (at: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamConcentratedLoad(1, [0, P, 0, at], true)
  solver.solve()
  return solver
}

/** O intervalo de cada linha para todas as posições da carga, para que os diagramas cresçam e diminuam em vez de mudar de escala. */
const rows: StackRow[] = ['V', 'M', 'w']
const envelope = (() => {
  const ranges: Partial<Record<StackRow, [number, number]>> = {}
  for (let at = 0.25; at < L; at += 0.25) {
    const model = modelFromSolver(solveWithLoadAt(at))
    const line = beamLine(model)
    for (const row of rows) {
      const [lo, hi] = rowRange(lineDiagram(model, line, row))
      const [min, max] = ranges[row] ?? [0, 0]
      ranges[row] = [Math.min(min, lo), Math.max(max, hi)]
    }
  }
  return ranges
})()

const at = ref(2)
const solver = computed(() => solveWithLoadAt(at.value))
</script>

<template>
  <DiagramStack v-model:load-at="at" :solver="solver" :rows="rows" :ranges="envelope" load-label="P = 20 kN" />
  <p>The load is {{ at.toFixed(2) }} m from A.</p>
</template>
```

Com a carga a 4,3 m, a figura mostra as reações de 5,7 kN e 14,3 kN, o salto do cortante de 5,7 para −14,3 kN sob a carga e $M = 5{,}67 \cdot 4{,}3 = 24{,}4$ kNm nesse ponto. Sem `ranges`, cada linha mudaria de escala conforme os próprios extremos enquanto a carga se move, e os diagramas pareceriam não mudar nada.

| Prop | Padrão | Define |
| --- | --- | --- |
| `loadAt` | nenhum | a posição da carga, em m a partir do início da linha; com `v-model:load-at` |
| `loadLabel` | `P = …` | o texto ao lado da alça |
| `loadStep` | 0.05 | o arrasto é arredondado a esse passo, em m; as setas do teclado movem a carga por ele |

A alça é um `role="slider"` que pode receber foco, com o seu intervalo e a sua posição para os leitores de tela. As setas do teclado a movem por `loadStep`, Page Up e Page Down por 1 m, e Home e End a levam às extremidades da viga. Numa tela sensível ao toque, dá para arrastá-la com o dedo, e a rolagem vertical continua funcionando sobre a figura.

A alça representa a força concentrada que o modelo resolvido tem em `loadAt`: essa força é desenhada como a alça, rotulada com a sua intensidade, a menos que você passe `loadLabel`. Coloque a carga no modelo na mesma posição, como faz `solveWithLoadAt`.

## Tamanho e renderização no servidor {#size-and-server-rendering}

A figura mede o seu contêiner e é composta nessa largura, no mínimo 320 px. Antes de poder medir, ela usa `width`, 720 px por padrão. O texto tem 12,5 px (`fontSize`) e nunca diminui junto com a figura.
