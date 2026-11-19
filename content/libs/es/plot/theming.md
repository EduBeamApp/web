---
title: Temas y colores
description: "Colorea las figuras de @edubeam/plot con propiedades personalizadas de CSS o la prop colors: temas claro y oscuro, blanco y negro, archivos SVG, fuente y animación."
order: 4
source: site
---

# Temas y colores

Un gráfico toma sus colores de las propiedades personalizadas de CSS de la página, así que los temas claro y oscuro de un sitio se aplican tal cual. Donde la página no define ninguna, se usan los colores de sistema de CSS, que siguen el `color-scheme` de la página. Sin configurar nada, un gráfico es negro sobre blanco en una página clara y claro sobre oscuro en una oscura.

## Propiedades personalizadas {#custom-properties}

| Se usa para | Propiedad personalizada | Valor de reserva |
| --- | --- | --- |
| Barras, apoyos, texto | `--figure-ink`, después `--ink` | `CanvasText` |
| Fondo, halos de las etiquetas | `--paper` | `Canvas` |
| Líneas de cota, ejes | `--muted` | `GrayText` |
| Nodos, la carga que se arrastra | `--brand` | `#4f46e5` |
| Esfuerzo axil | `--color-normal` | `#2222ff` |
| Esfuerzo cortante | `--color-shear` | `#00af00` |
| Momento flector | `--color-moment` | `#ff2222` |
| Deformada | `--figure-ink`, después `--ink` | `CanvasText` |
| Cargas | `--color-load` | `#ff8700` |
| Reacciones | `--color-reaction` | `#a020f0` |
| Barras de celosía traccionadas | `--color-tension`, después `--color-moment` | `#ff2222` |
| Barras de celosía comprimidas | `--color-compression`, después `--color-normal` | `#2222ff` |
| Fuente | `--ebp-font`, después `--font-sans` | `inherit` |

Define las propiedades en cualquier elemento por encima del gráfico, o en `:root` para todo el sitio:

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

Las etiquetas llevan un halo del color de `--paper` para que se lean bien sobre el rayado: hazlo coincidir con el fondo sobre el que está el gráfico.

## La prop `colors` {#the-colors-prop}

Para colorear un solo gráfico, pasa cualquiera de los tonos por su nombre:

```vue
<StructurePlot :solver="solver" :colors="{ moment: '#c00', paper: 'transparent' }" />
```

Los tonos son `ink`, `paper`, `muted`, `brand`, `normal`, `shear`, `moment`, `deformed`, `load`, `reaction`, `tension` y `compression`. Sirve cualquier color de CSS, también un `var(…)`. `DEFAULT_COLORS` contiene el valor por defecto de cada uno.

## Blanco y negro {#black-and-white}

Para un examen fotocopiado o una impresión en blanco y negro, pon todos los tonos de color en negro:

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

Los diagramas se siguen leyendo bien sin color: están rayados, y el momento se dibuja en el lado traccionado.

## Colores en un archivo SVG {#colours-in-an-svg-file}

Un archivo escrito por [`structureSvg`](/es/plot/functions#a-standalone-svg-file) no tiene una página alrededor, así que usa colores fijos: `PRINT_COLORS`, los colores de la aplicación EduBeam sobre blanco. Su opción `colors` admite los mismos tonos que la prop, así que el juego en blanco y negro de arriba también sirve:

```ts
structureSvg(model, { colors: print }) // negro sobre blanco
structureSvg(model, { background: false }) // sin fondo, para una diapositiva de color
```

Solo colores fijos: un `var(…)` no significa nada para Word ni para Inkscape.

## Fuentes {#fonts}

El texto usa la fuente de la página, a través de `--ebp-font` o `--font-sans`, con cifras tabulares. Los nombres de las filas de `DiagramStack`, como V(x), se escriben con las fuentes de KaTeX cuando la página las carga, y si no, con una fuente serif. Un archivo SVG usa su opción `fontFamily`, por defecto Helvetica o Arial, porque no puede saber qué fuente tiene la página.

## Personalizar la animación {#restyling-the-animation}

Las pocas reglas CSS que necesita un gráfico van incrustadas en cada SVG, así que no hace falta ninguna hoja de estilos. Todas las clases llevan el prefijo `ebp-`, y la página puede sobrescribirlas. Cada capa es un `<g class="ebp-layer ebp-layer-{name}">`, que recibe `ebp-on` cuando está visible:

```css
/* Fundidos más lentos, para un aula grande */
.slides .ebp-animate .ebp-layer {
  transition-duration: 1s;
}
```

`PLOT_CSS` exporta las reglas incrustadas, y `toneVars(colors)`, las propiedades personalizadas que un gráfico define en su elemento raíz, para construir tus propias figuras con las [funciones de dibujo](/es/plot/functions#drawing).
