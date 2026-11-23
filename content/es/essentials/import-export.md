---
description: "Guarda y abre proyectos y sesiones del EduBeam de escritorio, comparte un enlace, incrusta un visor y exporta imágenes y tablas. Todo se queda en tu navegador."
source: site
---

# Archivos, enlaces y exportación

:span{#importar-exportar-y-compartir}

Guarda tu modelo como archivo, envíalo como enlace, incrústalo en una página web o exporta una imagen o una tabla. En [EduBeam]{.edubeam} todo ocurre en tu navegador y no se sube nada: un enlace para compartir contiene literalmente el modelo.

::card-grid{cols="3"}
:::card{title="Archivo de proyecto" icon="lucide:file-json" to="#save-a-project"}
`project.json` para guardarlo, entregarlo o abrirlo más tarde.
:::
:::card{title="Enlace para compartir" icon="lucide:link" to="#share-a-link"}
Todo el modelo en una URL, para apuntes, diapositivas y mensajes.
:::
:::card{title="Imagen o tabla" icon="lucide:image" to="#export-an-image"}
PNG o SVG para informes, CSV para hojas de cálculo.
:::
::

## Guardar un proyecto {#save-a-project}

**☰ → Guardar proyecto** o <kbd>Ctrl</kbd>+<kbd>S</kbd> (<kbd>⌘</kbd>+<kbd>S</kbd> en un Mac, como todos los atajos de esta página) descarga `project.json`. Contiene los nodos, los elementos, los materiales, las secciones (con sus formas dibujadas), las cargas, las líneas de cota y la versión de la aplicación que lo escribió. Puedes renombrar el archivo libremente.

## Abrir un proyecto {#open-a-project}

**☰ → Abrir proyecto** o <kbd>Ctrl</kbd>+<kbd>O</kbd> y elige el archivo, o **arrastra el archivo a cualquier punto de la ventana de la aplicación**. EduBeam abre:

- archivos `project.json` guardados por cualquier versión de EduBeam;
- sesiones `.xml` guardadas por el **EduBeam de escritorio** original, versiones 2.x a 3.5. Sus valores no llevan unidades, así que se leen en kN, kPa y m, las unidades que usaba su manual. EduBeam abre un caso de carga cada vez: de una sesión con varios abre el primero e indica los que ha dejado fuera.

Abrir un archivo reemplaza el modelo actual, incluidos sus materiales y secciones. El modelo que tenías no se pierde: <kbd>Ctrl</kbd>+<kbd>Z</kbd> lo recupera, y además queda en [Estructuras recientes](#recent-structures). Un archivo que EduBeam no puede leer se rechaza con un mensaje, y tu modelo queda como estaba.

## Compartir un enlace {#share-a-link}

**Compartir modelo**, en la barra superior o en el menú ☰, abre el diálogo *Compartir modelo por URL*:

![El diálogo Compartir modelo por URL](/screenshots/es/c1-share.webp){.shot-lg}

- **Copiar**, o un clic en cualquier punto del campo, copia el enlace.
- **Abrir enlace** lo abre en una pestaña nueva, para que veas lo que verá el destinatario.
- **Compartir con el diálogo del sistema** pasa el enlace al menú de compartir de tu dispositivo, si el navegador lo admite.
- **Enlace más corto** (activado por defecto) escribe el mismo modelo con aproximadamente la mitad de caracteres. Las copias de EduBeam anteriores a la versión 1.3.2 (noviembre de 2026) no pueden leerlo hasta que se actualicen, así que desactívalo cuando un enlace tenga que abrirse en todas partes desde el primer momento.
- **Mostrar lo que veo** (desactivado por defecto) hace que el enlace se abra con los diagramas, las cargas y las etiquetas que tú tienes activados, en lugar de con las opciones de visualización del destinatario.

El enlace tiene la forma `https://run.edubeam.app/?model=…` y codifica el modelo completo. Quien lo abre obtiene su propia copia para editar; los cambios **no** se sincronizan de vuelta, así que envía un enlace nuevo cuando cambie el modelo. Los modelos muy grandes generan enlaces muy largos; en ese caso, comparte mejor el archivo de proyecto.

Cuando alguien abre un enlace, su propio modelo anterior pasa a Estructuras recientes, y un mensaje le indica dónde encontrarlo. Los enlaces no caducan nunca: un enlace en los apuntes del año pasado abre hoy el mismo modelo.

## Incrustar un visor {#embed-a-read-only-viewer}

Añade `&viewer=1` a un enlace para compartir y el modelo se abrirá en **modo visor**: se ocultan la barra superior, la barra inferior, deshacer y rehacer, los botones de cuadrícula y de unidades y la cruceta, y quedan el dibujo, los botones de ajustar y centrar y las opciones de visualización. Tampoco se abren el diálogo de bienvenida ni las notas de versión. Pon esa URL en un `<iframe>` para incrustar un modelo interactivo, con zoom, en tus apuntes, en la página de una asignatura o en una diapositiva:

```html
<iframe
  src="https://run.edubeam.app/?viewer=1&show=MRLS&model=…"
  width="100%"
  height="400"
></iframe>
```

![El pórtico triarticulado en modo visor](/screenshots/es/viewer-mode.webp){.shot-lg}

El modo visor es para mirar, pero no está bloqueado: los visitantes pueden seguir arrastrando nodos y cambiando de diagrama. Abierto por sí solo, un enlace de visor reemplaza el modelo del visitante como cualquier otro enlace, y su modelo queda esperando en Estructuras recientes. Incrustado en una página de otro sitio, la mayoría de los navegadores actuales dan al marco su propio almacenamiento, de modo que el modelo del visitante no se toca, pero no todos los navegadores lo hacen.

Para una figura que no necesita la aplicación, como un diagrama estático en una página, una diapositiva o una hoja de ejercicios, [@edubeam/plot](/es/plot) dibuja estructuras y sus diagramas desde código. Las figuras interactivas de este sitio están dibujadas con ella.

## Parámetros de URL {#url-parameters}

| Parámetro | Efecto |
| --- | --- |
| `model=<datos>` | Carga el modelo codificado y lo ajusta a la pantalla. Lo escribe **Compartir modelo**. |
| `viewer=1` | [Modo visor](#embed-a-read-only-viewer). |
| `show=<letras>` | Abre con exactamente estas capas activadas, una letra cada una: `N` esfuerzo axil, `V` esfuerzo cortante, `M` momento flector, `U` deformada, `R` reacciones, `L` cargas, `S` apoyos, `n` etiquetas de nodos, `e` etiquetas de elementos. `show=MRLS` muestra el momento flector, las reacciones, las cargas y los apoyos. Lo escribe **Mostrar lo que veo**. |
| `lang=<código>` | Cambia el idioma de la interfaz: `en`, `cs`, `sk`, `de`, `fr`, `es`, `pt`, `pl`, `hu`, `ro`, `el`, `cn` (chino), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`. |
| `panel=examples` | Abre directamente la galería de ejemplos. |

Los parámetros se combinan con `&`, como en `?lang=es&viewer=1&model=…`. EduBeam los elimina de la barra de direcciones después de leerlos. `lang` y `show` se conservan como configuración del visitante, igual que si los hubiera elegido en la aplicación.

## Exportar una imagen {#export-an-image}

**☰ → Exportar imagen** o <kbd>Ctrl</kbd>+<kbd>P</kbd> abre la exportación de imágenes. El dibujo se vuelve a componer para el tamaño que elijas, de modo que las líneas y las etiquetas conservan su grosor real.

![Exportar imagen: elige las capas, el encuadre y el tamaño, y luego descarga o copia](/screenshots/es/export-image.webp)

::div{.steps}

### Elige las capas {#choose-the-layers}

Los botones de arriba eligen qué se dibuja: la deformada, N, V, M y las reacciones, y después los apoyos, las cargas, las etiquetas de nodos y las de elementos. Empiezan como las opciones de visualización del visor, y cambiarlos aquí no altera el visor.

### Encuadra el dibujo {#frame-the-drawing}

Elige una proporción (16:9, 4:3, 3:2 o 1:1), **Ajustar todo**, o **Ventana…** para arrastrar un rectángulo sobre el dibujo. También puedes arrastrar los bordes de la vista previa.

### Fija el tamaño {#set-the-size}

Anchura y altura en píxeles, o una **Escala** como 1 : 50 para un dibujo a escala en papel (a 96 DPI). **Altura del diagrama** fija el tamaño de los diagramas de resultados, y **Fondo transparente** omite el fondo blanco. Si los diagramas o las etiquetas no caben, el diálogo te lo indica y te ofrece reducir los diagramas o ampliar el lienzo.

### Guárdala {#save-it}

**Descargar PNG**, **Descargar SVG** o, si el navegador lo permite, **Copiar al portapapeles**. Los archivos llevan el nombre de su tamaño, como `edubeam-512x512.svg`. En una pantalla de alta resolución, el PNG tiene más píxeles que la anchura y la altura que fijaste, en proporción a la densidad de píxeles de la pantalla, para que se vea tan nítido como en la aplicación; su tamaño en píxeles aparece junto a los botones.

::

El SVG se mantiene nítido a cualquier tamaño y funciona en Word, Inkscape y LaTeX en Overleaf, lo que lo convierte en la mejor opción para informes y trabajos académicos. El mismo tamaño encuadra siempre la estructura de la misma forma, así que N, V y M exportados uno tras otro quedan alineados uno junto a otro.

Para generar estas figuras desde código, por ejemplo una para cada ejercicio de una hoja, @edubeam/plot escribe [un archivo SVG independiente](/es/plot/functions#a-standalone-svg-file) que se abre en los mismos programas.

## Exportar los resultados {#export-the-results}

**Exportar CSV**, en la pestaña **Resultados**, descarga las dos tablas de resultados, incluidas las reacciones, y **Copiar** las pone en el portapapeles para una hoja de cálculo. Consulta [Exportar CSV y Copiar](/es/essentials/results#export-csv-and-copy).

## Estructuras recientes {#recent-structures}

**☰ → Estructuras recientes** conserva las 10 últimas estructuras que se limpiaron o que fueron reemplazadas por un enlace, un archivo, un ejemplo, la tarea de la primera viga u otra restauración. Cada una muestra una miniatura, qué la reemplazó y su número de nodos y elementos. **Restaurar** recupera una: el modelo que tenías en ese momento pasa a su vez a la lista, y <kbd>Ctrl</kbd>+<kbd>Z</kbd> deshace la restauración. **Quitar** elimina una entrada.

![Estructuras recientes](/screenshots/es/recent.webp){.shot-lg}

La lista se guarda solo en este navegador.

## Ejemplos {#examples}

**☰ → Ejemplos** abre una galería de modelos docentes ya preparados. Abrir uno reemplaza tu modelo, y <kbd>Ctrl</kbd>+<kbd>Z</kbd> recupera el tuyo. Los mismos modelos, con ejercicios, están en la página [Ejemplos](/es/examples/) de esta guía.

![La galería de ejemplos](/screenshots/es/examples.webp){.shot-lg}

## Persistencia automática {#automatic-persistence}

Tu modelo y tu configuración se guardan en el almacenamiento local del navegador tras cada cambio y se restauran cuando vuelves, incluso después de cerrar el navegador. Es una comodidad, no una copia de seguridad: pertenece a un perfil de navegador en un dispositivo, una ventana privada lo olvida, y borrar los datos del sitio lo elimina. Guarda el trabajo importante como archivo de proyecto. En [Qué se guarda en tu navegador](/es/essentials/units-settings#what-is-stored-in-your-browser) está la lista completa.

## Formato del archivo de proyecto {#project-file-format}

`project.json` es JSON sencillo y legible. Esta es la viga del [Inicio rápido](/es/guide/quick-start), con el acero y el IPE 200 de las bibliotecas:

```json [project.json]
{
  "edubeam": true,
  "version": "1.3.4",
  "domain": {
    "materials": [
      {
        "label": "Steel (S235)",
        "d": 7850,
        "e": 210000000000,
        "g": 81000000000,
        "alpha": 0.000012
      }
    ],
    "crossSections": [
      {
        "label": "IPE 200 (approx)",
        "a": 0.002848,
        "iy": 0.00001943,
        "h": 0.2,
        "k": 0.3932584269662922
      }
    ],
    "nodes": [
      { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] },
      { "label": "2", "coords": [6, 0, 0], "bcs": [2] }
    ],
    "elements": [
      {
        "label": "1",
        "nodes": ["1", "2"],
        "mat": "Steel (S235)",
        "cs": "IPE 200 (approx)",
        "hinges": [false, false]
      }
    ],
    "loadCases": [
      {
        "label": "DefaultLC",
        "nodalLoads": [],
        "elementLoads": [
          { "type": "udl", "target": "1", "lcs": true, "values": [0, 12000] }
        ],
        "prescribedBC": []
      }
    ]
  },
  "dimensions": []
}
```

Todos los valores están en **unidades SI** (m, N, Pa, rad), sean cuales sean las unidades que muestre la aplicación. Las coordenadas son `[x, y, z]`, con $y = 0$ y $z$ hacia abajo. Los apoyos y las componentes de las cargas usan los identificadores de GDL `0 = Dx`, `2 = Dz`, `4 = Ry`.

| `type` de la carga de elemento | Valores |
| --- | --- |
| `udl` | `values: [fx, fz]` en N/m |
| `trapezoidal` | `startValues: [f1x, f1z]`, `endValues: [f2x, f2z]` en N/m |
| `concentrated` | `values: [Fx, Fz, My, a]` en N, N·m y m desde el nodo inicial |
| `temperature` | `values: [ΔTc, ΔTb, ΔTt]` en K; el gradiente es ΔTb − ΔTt |

`lcs: true`, o la ausencia de `lcs`, sitúa una carga de elemento en los ejes locales del elemento; `false`, en los globales. Las demás entradas:

- **Cargas nodales**: `{ "target": "2", "values": { "0": Fx, "2": Fz, "4": My } }`, más `"lcs": true` para una carga en los ejes de un apoyo girado.
- **Desplazamientos impuestos**: `{ "target": "2", "prescribedValues": { "0": Dx, "2": Dz, "4": Ry } }`; una componente que omitas vale 0.
- Los archivos escritos por la aplicación incluyen además una `date`, un `commit`, los ejes de los apoyos girados (`lcs` en un nodo) y las formas dibujadas de las secciones (`shape`).

Como el formato es sencillo, puedes generar modelos con un script o una hoja de cálculo y abrirlos con **Abrir proyecto**. Para construir y resolver modelos íntegramente en código, usa el solver que hay detrás de la aplicación, [@edubeam/fem](/es/solver).
