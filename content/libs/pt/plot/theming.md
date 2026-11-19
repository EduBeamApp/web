---
title: Temas e cores
description: "Cores das figuras do @edubeam/plot com propriedades personalizadas CSS ou a prop colors: temas claro e escuro, preto e branco, arquivos SVG, fonte e animações."
order: 4
source: site
---

# Temas e cores

Uma figura busca as suas cores nas propriedades personalizadas CSS (*custom properties*) da página, então os temas claro e escuro de um site valem para ela sem nenhum ajuste. Onde a página não define nenhuma, entram as cores de sistema do CSS, que seguem o `color-scheme` da página. Sem configuração, uma figura é preta sobre branco numa página clara e clara sobre escuro numa página escura.

## Propriedades personalizadas {#custom-properties}

| Usada para | Propriedade personalizada | Valor alternativo |
| --- | --- | --- |
| Barras, apoios, texto | `--figure-ink`, depois `--ink` | `CanvasText` |
| Fundo, halos dos rótulos | `--paper` | `Canvas` |
| Linhas de cota, eixos | `--muted` | `GrayText` |
| Nós, a carga arrastável | `--brand` | `#4f46e5` |
| Esforço normal | `--color-normal` | `#2222ff` |
| Esforço cortante | `--color-shear` | `#00af00` |
| Momento fletor | `--color-moment` | `#ff2222` |
| Deformada | `--figure-ink`, depois `--ink` | `CanvasText` |
| Cargas | `--color-load` | `#ff8700` |
| Reações | `--color-reaction` | `#a020f0` |
| Barras de treliça tracionadas | `--color-tension`, depois `--color-moment` | `#ff2222` |
| Barras de treliça comprimidas | `--color-compression`, depois `--color-normal` | `#2222ff` |
| Fonte | `--ebp-font`, depois `--font-sans` | `inherit` |

Defina as propriedades em qualquer elemento acima da figura, ou em `:root` para o site inteiro:

```css
:root {
  --ink: #1b1b3a;
  --paper: #ffffff;
  --color-moment: #d7263d;
}

.dark {
  --ink: #eeeeff;
  --paper: #0b0d1f;
}
```

Os rótulos recebem um halo na cor de `--paper` para continuarem legíveis sobre as hachuras: ajuste-o ao fundo sobre o qual a figura fica.

## A prop `colors` {#the-colors-prop}

Para colorir uma única figura, passe qualquer um dos tons pelo nome:

```vue
<StructurePlot :solver="solver" :colors="{ moment: '#c00', paper: 'transparent' }" />
```

Os tons são `ink`, `paper`, `muted`, `brand`, `normal`, `shear`, `moment`, `deformed`, `load`, `reaction`, `tension` e `compression`. Qualquer cor CSS serve, inclusive um `var(…)`. `DEFAULT_COLORS` contém o valor padrão de cada um.

## Preto e branco {#black-and-white}

Para uma prova fotocopiada ou uma impressão em preto e branco, defina todos os tons coloridos como a cor do traço:

```vue
<script setup lang="ts">
import type { PlotColors } from '@edubeam/plot'

const print: Partial<PlotColors> = {
  ink: '#000', paper: '#fff', muted: '#555', brand: '#000',
  normal: '#000', shear: '#000', moment: '#000', deformed: '#000',
  load: '#000', reaction: '#000', tension: '#000', compression: '#000',
}
</script>

<template>
  <StructurePlot :solver="solver" :colors="print" :animate="false" />
</template>
```

Os diagramas continuam legíveis sem cor: eles são hachurados, e o momento fica do lado tracionado.

## Cores num arquivo SVG {#colours-in-an-svg-file}

Um arquivo escrito por [`structureSvg`](/pt/plot/functions#a-standalone-svg-file) não tem uma página em volta, então usa cores fixas: `PRINT_COLORS`, as cores do aplicativo EduBeam sobre branco. A sua opção `colors` aceita os mesmos tons da prop, de modo que o conjunto em preto e branco acima também funciona ali:

```ts
structureSvg(model, { colors: print }) // preto sobre branco
structureSvg(model, { background: false }) // sem fundo, para um slide colorido
```

Só cores fixas: um `var(…)` não significa nada para o Word ou o Inkscape.

## Fontes {#fonts}

O texto usa a fonte da página, por meio de `--ebp-font` ou `--font-sans`, com algarismos tabulares. Os nomes das linhas, como V(x) no `DiagramStack`, usam as fontes do KaTeX quando a página as carrega e, caso contrário, uma fonte serifada. Um arquivo SVG usa a sua opção `fontFamily`, Helvetica ou Arial por padrão, já que não tem como saber a fonte da página.

## Personalizar a animação {#restyling-the-animation}

As poucas regras CSS de que uma figura precisa vêm embutidas em cada SVG, então ela não precisa de folha de estilos. Todas as classes têm o prefixo `ebp-`, e uma página pode sobrescrevê-las. Cada camada é um `<g class="ebp-layer ebp-layer-{name}">`, que recebe `ebp-on` quando está visível:

```css
/* Transições mais lentas, para um auditório */
.slides .ebp-animate .ebp-layer {
  transition-duration: 1s;
}
```

`PLOT_CSS` exporta as regras embutidas, e `toneVars(colors)` as propriedades personalizadas que uma figura define no seu elemento raiz, para você montar as suas próprias figuras com as [funções de desenho](/pt/plot/functions#drawing).
