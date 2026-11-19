---
description: "Resultados en EduBeam: diagramas de axiles, cortantes y momentos, deformada, reacciones y sus signos, valores al pasar el ratón, tablas, CSV, matriz de rigidez y formato numérico."
source: site
---

# Resultados y diagramas

[EduBeam]{.edubeam} resuelve el modelo tras cada cambio, así que los diagramas, las reacciones y las tablas de la pantalla corresponden siempre al modelo que ves. No hay botón *Calcular*. Si no se dibuja nada, el modelo todavía no se puede resolver: el mensaje de arriba a la izquierda del visor explica por qué, y en [Solución de problemas](/es/reference/troubleshooting) se explica cada mensaje.

## Capas en el visor {#overlays-in-the-viewer}

Los resultados se dibujan sobre el modelo. Actívalos y desactívalos en las **opciones de visualización**, arriba a la derecha del visor; el botón ⚙ que hay encima muestra u oculta el panel.

::model-figure{caption="Pórtico triarticulado con 10 kN/m: alterna entre M, V, N y la deformada"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, V, N, w]
show: [nodeLabels]
height: 300
---
::

| Casilla | Dibuja | Color | Marcada al principio |
| --- | --- | --- | --- |
| **Forma deformada** | la estructura desplazada, exagerada para que se vea | gris | sí |
| **N (x)** | esfuerzo axil | azul | |
| **V<sub>z</sub> (x)** | esfuerzo cortante | verde | |
| **M<sub>y</sub> (x)** | momento flector | rojo | sí |
| **Reacciones** | una flecha y un valor por cada dirección restringida | morado | sí |

Una segunda fila controla el propio dibujo: **Apoyos**, **Cargas**, **Etiquetas de nodos** y **Etiquetas de elementos**. **Más ajustes**, debajo del panel, abre los [ajustes del visor](/es/essentials/units-settings#viewer-settings), donde se fijan el tamaño de los diagramas (*Escala de resultados*), los colores, la orientación de las etiquetas y el estilo de los diagramas.

Los valores se escriben donde importan: en los extremos de cada barra, a ambos lados de un salto bajo una carga puntual o sobre un apoyo, y en cada máximo o mínimo del diagrama, como el vértice de una parábola donde $V = 0$. La figura de arriba muestra el [pórtico triarticulado](/es/tutorials/three-hinged-frame), que puedes comprobar a mano: 40 kN de compresión en cada pilar, 20 kN en la viga y −80 kNm en las dos esquinas. En la vista *w* se ve que la rótula C desciende 42,55 mm.

### Interpretar el signo {#reading-the-sign}

Lee el signo en el **valor**, no por el lado de la barra en que se dibuja el diagrama. Las convenciones son las de la mayoría de los libros de texto:

| Resultado | Positivo significa |
| --- | --- |
| **N** | tracción |
| **V<sub>z</sub>** | hace girar en sentido horario un trozo corto de la barra. Como $V = \mathrm{d}M/\mathrm{d}x$, es positivo en el apoyo izquierdo de una viga biapoyada con carga gravitatoria y negativo en el derecho |
| **M<sub>y</sub>** | momento positivo: tracción en la fibra inferior, en el lado de la **línea discontinua** dibujada a lo largo de cada barra |

Una viga biapoyada con voladizo muestra los dos signos a la vez. Entre los apoyos el momento es positivo (+13,5 kNm); sobre el apoyo derecho es negativo (−24 kNm), con la tracción arriba. En B, el cortante salta tanto como la reacción, 54 kN: de −30 a +24 kN.

::model-figure{caption="Viga biapoyada con voladizo, 12 kN/m: momento positivo entre los apoyos, negativo sobre B"}
---
nodes: { A: [0, 0], B: [4, 0], C: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

Por defecto, el momento flector se dibuja en el **lado traccionado**, y los axiles y cortantes positivos en el lado opuesto a la línea discontinua. Aquí cada escuela tiene su costumbre, así que cada uno se puede invertir en **Configuración → Ajustes del visor → Diagramas de esfuerzos internos**, donde también puedes rayar los diagramas como a mano y rotular cada tramo con el grado de su polinomio. Cambiar el lado solo cambia el dibujo, nunca los valores. Las convenciones de signos completas, incluidos los ejes locales del elemento, están en el [manual teórico](/es/elements/conventions#internal-forces).

## Valores al pasar el ratón {#hover-tooltips}

Pasa el ratón por encima de un objeto para leer sus valores:

- **Nodo**: los desplazamientos $u_x$, $u_z$ (en la unidad de desplazamiento) y el giro $\varphi_y$ (en radianes).
- **Elemento**: su etiqueta, su sección y su material.
- **Carga**: sus componentes.

En una pantalla táctil, toca el objeto: su panel muestra los mismos datos.

![Con el ratón sobre el nodo 2 de la viga del Inicio rápido](/screenshots/es/ui-hover.webp){.shot-sm}

## Pestaña Resultados {#results-tab}

La pestaña **Resultados** de la barra inferior contiene dos tablas, que se alternan con **Resultados nodales** y **Resultados de elementos**.

### Resultados nodales {#nodal-results}

Una fila por nodo con sus desplazamientos **D<sub>x</sub>** y **D<sub>z</sub>** (en la unidad de desplazamiento) y su giro **R<sub>y</sub>** (en radianes), en ejes globales: D<sub>z</sub> positivo es hacia abajo y R<sub>y</sub> positivo es antihorario en pantalla. Una dirección con apoyo muestra 0, o el asiento que hayas impuesto. Las reacciones no están en esta tabla: léelas en el dibujo o en la [exportación CSV](#export-csv-and-copy).

![Resultados nodales del pórtico triarticulado de arriba, con el formato numérico Automático](/screenshots/es/p2c-results-nodal.webp){.shot-lg}

### Resultados de elementos {#element-results}

Una fila por elemento con sus **fuerzas de extremo, en el sistema de coordenadas local del elemento**:

| Columna | Significado |
| --- | --- |
| X<sub>12</sub>, Z<sub>12</sub>, M<sub>12</sub> | esfuerzo axil, esfuerzo cortante y momento que actúan sobre el elemento en su nodo **inicial** |
| X<sub>21</sub>, Z<sub>21</sub>, M<sub>21</sub> | lo mismo en su nodo **final** |

![Resultados de elementos del pórtico triarticulado: las fuerzas de extremo de sus cuatro barras](/screenshots/es/p2c-results-element.webp)

Las fuerzas de extremo son las que los nodos ejercen sobre el elemento. Siguen los ejes locales, no la convención N-V-M de los diagramas, así que sus signos son distintos:

- **Viga biapoyada** (6 m, 12 kN/m, la del [Inicio rápido](/es/guide/quick-start)): Z<sub>12</sub> = Z<sub>21</sub> = −36 kN. Los dos apoyos empujan la viga hacia arriba, que es −z.
- **Voladizo** empotrado en su nodo inicial, con 18 kN hacia abajo en el extremo libre: Z<sub>12</sub> = −18 kN, M<sub>12</sub> = +72 kNm, Z<sub>21</sub> = +18 kN, M<sub>21</sub> = 0.
- **Pilar 1 del pórtico** (A abajo, B arriba): X<sub>12</sub> = +40 kN empuja según el eje x local hacia dentro del elemento, es decir, 40 kN de compresión.

Hay más sobre esta tabla en el [manual teórico](/es/elements/conventions#end-forces-element-results-table).

### Exportar CSV y Copiar {#export-csv-and-copy}

**Exportar CSV** descarga `edubeam-results.csv` con las dos tablas, en las unidades que se ven en pantalla y lista para una hoja de cálculo. **Copiar** pone las mismas tablas en el portapapeles como texto separado por tabuladores, que se pega directamente en Excel, LibreOffice o Google Sheets.

| Tabla | Columnas |
| --- | --- |
| Nodos | Node, x, z, Dx, Dz, Ry, y las **reacciones** Rx, Rz, My |
| Elementos | Element, Node 1, Node 2, y las fuerzas de extremo N1, V1, M1, N2, V2, M2 |

Cada encabezado lleva su unidad, por ejemplo `Dz [mm]`. Las fuerzas de extremo de los elementos son los mismos valores locales que X<sub>12</sub> … M<sub>21</sub> en pantalla.

### Matriz de rigidez {#stiffness-matrix}

Elige **Matriz de rigidez** en el panel de un elemento, o con el botón de su fila en la tabla *Elementos*, para abrir la matriz de rigidez 6 × 6 del elemento en **coordenadas globales** y unidades SI (N, m). Es muy útil para comprobar un ensamblaje hecho a mano en una asignatura de cálculo matricial; las fórmulas están en el [manual teórico](/es/elements/beam).

## Formato numérico {#number-format}

Las tablas y los recuadros emergentes muestran los resultados con cinco cifras significativas. **Configuración → Idioma y configuración regional → Formato numérico** decide cómo se escriben:

| Formato | 40 000 se escribe | Úsalo para |
| --- | --- | --- |
| **Científico** (predeterminado) | 4 · 10⁴ | valores que abarcan muchos órdenes de magnitud |
| **Ingeniería** | 40 · 10³ | leer directamente los prefijos kilo y mega |
| **Automático** | 40.000 | los números habituales en clase |

*Automático* escribe los valores de 0,001 a 100 000 como números normales. Fuera de ese intervalo los escribe como *Ingeniería*, con potencias de diez de tres en tres, como 380,95 · 10⁻⁹ en los resultados nodales de arriba. El separador decimal sigue al idioma.

Las etiquetas del dibujo (valores de los diagramas y reacciones) tienen siempre dos decimales, sea cual sea el formato numérico: 6,6667 kN aparece como 6,67. Consulta las tablas o los recuadros emergentes cuando necesites más cifras.

## Precisión y exactitud {#precision-and-accuracy}

- El elemento viga es exacto para el modelo lineal de Timoshenko con cargas nodales, uniformes, trapezoidales, concentradas y térmicas. Los resultados **no** dependen del número de elementos, y no hay ninguna malla que refinar.
- El cálculo se hace en doble precisión. Un valor menor que una billonésima del mayor valor de su tipo es un error de redondeo, y las tablas lo muestran como 0.
- Las flechas incluyen la **deformación por cortante**, que en una estructura hiperestática también modifica ligeramente los esfuerzos. En barras esbeltas añade a la flecha de Euler–Bernoulli menos de un 1 %; en barras cortas y de gran canto puede llegar al 10 % o más. En [Comprobar resultados a mano](/es/guide/verification#shear-deformation) se ve cuánto vale y cómo desactivarla para comparar con las fórmulas de los libros.

## Resultados en un informe {#results-in-a-report}

- **☰ → Exportar imagen** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) guarda el dibujo en PNG o SVG con los diagramas que elijas. Consulta [Exportar una imagen](/es/essentials/import-export#export-an-image).
- **Exportar CSV** o **Copiar**, en la pestaña Resultados, te dan los números.
- **Compartir modelo** te da un enlace, para que el lector pueda abrir el propio modelo.
- Para apuntes y hojas de ejercicios, [@edubeam/plot](/es/plot) dibuja los mismos diagramas desde código.
