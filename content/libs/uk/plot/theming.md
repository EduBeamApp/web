---
title: Теми та кольори
description: "Кольори рисунків @edubeam/plot через CSS-змінні або проп colors, світла й темна теми, чорно-білий друк, кольори у файлах SVG, шрифт і стиль анімацій."
order: 4
source: site
---

# Теми та кольори

Рисунок бере кольори з CSS-змінних (custom properties) сторінки, тому світла й темна теми сайту застосовуються до нього без змін. Там, де сторінка їх не визначає, їх заступають системні кольори CSS, які відповідають `color-scheme` сторінки. Без будь-яких налаштувань рисунок чорний на білому на світлій сторінці й світлий на темному — на темній.

## CSS-змінні {#custom-properties}

| Для чого | CSS-змінна | Запасне значення |
| --- | --- | --- |
| Стрижні, опори, текст | `--figure-ink`, потім `--ink` | `CanvasText` |
| Тло, ореоли підписів | `--paper` | `Canvas` |
| Розмірні лінії, осі | `--muted` | `GrayText` |
| Вузли, сила, яку можна перетягувати | `--brand` | `#4f46e5` |
| Поздовжня сила | `--color-normal` | `#2222ff` |
| Поперечна сила | `--color-shear` | `#00af00` |
| Згинальний момент | `--color-moment` | `#ff2222` |
| Деформована схема | `--figure-ink`, потім `--ink` | `CanvasText` |
| Навантаження | `--color-load` | `#ff8700` |
| Реакції | `--color-reaction` | `#a020f0` |
| Розтягнуті стрижні ферми | `--color-tension`, потім `--color-moment` | `#ff2222` |
| Стиснуті стрижні ферми | `--color-compression`, потім `--color-normal` | `#2222ff` |
| Шрифт | `--ebp-font`, потім `--font-sans` | `inherit` |

Задайте змінні на будь-якому елементі, що містить рисунок, а для всього сайту — на `:root`:

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

Підписи мають ореол кольору `--paper`, щоб їх було добре видно поверх штрихування: зробіть його таким, як тло, на якому розміщено рисунок.

## Проп `colors` {#the-colors-prop}

Щоб змінити кольори одного рисунка, передайте будь-які тони за назвою:

```vue
<StructurePlot :solver="solver" :colors="{ moment: '#c00', paper: 'transparent' }" />
```

Тони мають назви `ink`, `paper`, `muted`, `brand`, `normal`, `shear`, `moment`, `deformed`, `load`, `reaction`, `tension` і `compression`. Підійде будь-який колір CSS, зокрема й `var(…)`. `DEFAULT_COLORS` містить типове значення кожного тону.

## Чорно-білий друк {#black-and-white}

Для контрольної, яку друкуватимуть чи копіюватимуть у чорно-білому варіанті, задайте всім кольоровим тонам той самий колір, що й `ink`:

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

Епюри й без кольору добре читаються: вони заштриховані, а момент відкладено з боку розтягнутих волокон.

## Кольори у файлі SVG {#colours-in-an-svg-file}

Файл, записаний функцією [`structureSvg`](/uk/plot/functions#a-standalone-svg-file), не має навколо себе сторінки, тому використовує звичайні кольори: `PRINT_COLORS`, тобто кольори застосунку EduBeam на білому тлі. Його параметр `colors` приймає ті самі тони, що й проп, тож чорно-білий набір вище працює й тут:

```ts
structureSvg(model, { colors: print }) // чорне на білому
structureSvg(model, { background: false }) // без тла, для кольорового слайда
```

Лише звичайні кольори: `var(…)` для Word чи Inkscape нічого не означає.

## Шрифти {#fonts}

Текст набрано шрифтом сторінки, через `--ebp-font` або `--font-sans`, з табличними цифрами. Назви рядків, як-от V(x) у `DiagramStack`, набрано шрифтами KaTeX, якщо сторінка їх завантажує, а інакше — шрифтом із засічками. Файл SVG використовує свій параметр `fontFamily`, типово Helvetica або Arial, бо шрифту сторінки знати не може.

## Зміна стилю анімації {#restyling-the-animation}

Ті кілька правил CSS, які потрібні рисунку, вбудовано в кожен SVG, тож файл стилів не потрібен. Усі класи мають префікс `ebp-`, і сторінка може їх перевизначити. Кожен шар — це `<g class="ebp-layer ebp-layer-{name}">`, який отримує клас `ebp-on`, коли його показано:

```css
/* Повільніша поява шарів, для лекційної аудиторії */
.slides .ebp-animate .ebp-layer {
  transition-duration: 1s;
}
```

`PLOT_CSS` експортує вбудовані правила, а `toneVars(colors)` — CSS-змінні, які рисунок задає на своєму кореневому елементі; обидва знадобляться, якщо ви будуєте власні рисунки з [функцій для малювання](/uk/plot/functions#drawing).
