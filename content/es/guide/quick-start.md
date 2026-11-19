---
description: "Modela en EduBeam una viga biapoyada de acero en unos diez minutos: material, sección, nodos, apoyos y carga; lee reacciones y diagramas y compruébalos a mano."
source: site
---

# Inicio rápido

En unos diez minutos modelarás una viga biapoyada de acero, leerás sus reacciones, el esfuerzo cortante, el momento flector y la flecha, y comprobarás cada número a mano. Abre EduBeam en otra pestaña, o al lado de esta página, y sigue los pasos.

::div{.actions}
[Abrir EduBeam ↗](https://run.edubeam.app/?lang=es){target="_blank"} [Ir a la comprobación a mano](#_8-check-by-hand)
::

## El problema {#the-problem}

Una viga de 6 m descansa sobre un apoyo articulado en el nodo 1 y un apoyo móvil en el nodo 2, y soporta una carga uniforme de 12 kN/m en toda su longitud. Es un perfil de acero IPE 200: $E = 210$ GPa, $G = 81$ GPa, $A = 28{,}48\ \text{cm}^2$ e $I_y = 1943\ \text{cm}^4$. Los cuatro valores están en las bibliotecas de EduBeam, así que no hace falta buscar nada.

::model-figure{caption="La viga que vas a modelar: un vano de 6 m del nodo 1 al nodo 2, con 12 kN/m"}
---
nodes: { 1: [0, 0], 2: [6, 0] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 12 }
results: []
show: [nodeLabels, dimensions]
---
::

## Crea el modelo {#build-the-model}

::div{.steps}

### Empieza con un modelo vacío {#start-from-an-empty-model}

En tu primera visita, un diálogo de bienvenida te pregunta cómo quieres empezar. Elige **SI (métrico)** en **Sistema de unidades**, deja **x a la derecha, z hacia abajo** en **Sistema de coordenadas** y pulsa **Omitir por ahora**. La aplicación muestra entonces un pequeño pórtico de ejemplo.

1. Pulsa **Limpiar estructura** en la barra superior (en el teléfono está en el menú **☰**).
2. Marca **Eliminar materiales** y **Eliminar secciones**, y pulsa **Confirmar**.

El lienzo queda vacío y dos mensajes en rojo avisan de que todavía no hay ningún material ni ninguna sección. Los pasos siguientes lo resuelven. No se pierde nada: <kbd>Ctrl</kbd>+<kbd>Z</kbd> recupera el pórtico, que además se conserva en **☰ → Estructuras recientes**.

### Comprueba las unidades {#_1-check-the-units}

El botón de unidades, abajo a la derecha del visor, indica las unidades de todos los campos y resultados. Esta página usa unidades SI, que el botón muestra como `m m² kN kNm MPa`, y el eje z hacia abajo. Si el botón muestra pies y kips, haz clic en él y pon **Sistema de unidades** en **SI (métrico)**. En ese mismo lugar, **Sistema de coordenadas** debe ser **x a la derecha, z hacia abajo**: con el eje y hacia arriba, una carga positiva apunta hacia arriba y los signos de esta página no coincidirían.

![Los botones de cuadrícula (G) y ajuste (S), la cruceta y el botón de unidades](/screenshots/es/ui-grid-units.webp){.shot-sm}

### Añade el material y la sección {#_2-add-the-material-and-cross-section}

Cada elemento necesita un material y una sección, así que añádelos primero, desde las bibliotecas.

1. Abre la pestaña **Materiales** en la barra inferior y haz clic en **Biblioteca de materiales**.
2. Pulsa **+** en la fila **Acero (S235)** ($E = 210\,000$ MPa, $G = 81\,000$ MPa). La biblioteca sigue abierta por si quieres añadir más; ciérrala con **Cancelar**.
3. Abre la pestaña **Secciones** y haz clic en **Biblioteca de secciones**.
4. Baja hasta la fila **IPE 200 (aprox.)**, pulsa **+** y cierra la biblioteca con **Cancelar**.

Los dos mensajes en rojo han desaparecido, y la pestaña **Secciones** muestra el IPE 200:

![El IPE 200 en la pestaña Secciones: área, Iy, altura y coeficiente de cortante](/screenshots/es/a-qs-cross-sections.webp)

Si prefieres escribir tus propios valores, usa **Añadir material** y **Añadir sección**. El coeficiente de cortante, aquí 0,3933, vuelve a aparecer en la [comprobación a mano](#_8-check-by-hand).

### Añade los nodos {#_3-add-the-nodes}

1. Abre la pestaña **Nodos**. Tiene dos botones **Añadir nodo**: **+** abre un diálogo, y el del icono de cursor coloca los nodos con el ratón. Haz clic en **+ Añadir nodo**.
2. Deja **Coordenada X** y **Coordenada Z** en `0` y pulsa **Añadir nodo**. El diálogo se cierra y aparece el nodo `1`.
3. Vuelve a hacer clic en **+ Añadir nodo**, escribe `6` en **Coordenada X** y pulsa **Añadir nodo**. Es el nodo `2`.

![El diálogo Añadir nuevo nodo. También permite definir los apoyos directamente.](/screenshots/es/qs-node.webp){.shot-md}

### Conéctalos con un elemento {#_4-connect-them-with-an-element}

Abre la pestaña **Elementos** y haz clic en **+ Añadir elemento**. El diálogo ya propone **Nodo inicial** `1`, **Nodo final** `2`, y tu material y tu sección. Pulsa **Añadir elemento**.

![Añadir nuevo elemento: los dos nodos extremos, una rótula opcional en cada extremo, el material y la sección](/screenshots/es/a-qs-element.webp){.shot-md}

Aparece una viga entre los nodos. Pulsa <kbd>F</kbd> para ajustarla a la pantalla. El aviso azul **Faltan apoyos**, arriba a la izquierda del visor, explica por qué todavía no hay resultados.

### Añade los apoyos {#_5-add-the-supports}

De vuelta en la pestaña **Nodos**, cada fila tiene un selector de apoyo al principio de la columna **Grados de libertad restringidos**.

- Nodo `1`: elige **Articulación**. Se marcan `Dx` y `Dz`.
- Nodo `2`: elige **Rodillo**. Se marca solo `Dz`.

![El selector de apoyo en la tabla de nodos](/screenshots/es/a-qs-support-picker.webp){.shot-lg}

El aviso **Faltan apoyos** desaparece. También puedes hacer clic en un nodo del visor y elegir **Apoyos del nodo**. En [Nodos y apoyos](/es/essentials/nodes-supports#supports) se describen todos los tipos de apoyo.

### Añade la carga {#_6-add-the-load}

1. Abre la pestaña **Cargas** y haz clic en **Añadir carga de elemento**.
2. Deja **Tipo de carga** en *Carga uniformemente distribuida* y **Elemento** en `1`.
3. Escribe `12` en **fz**, deja **fx** en `0` y pulsa **Añadir carga de elemento**.

![El diálogo muestra una vista previa de la carga sobre el elemento](/screenshots/es/a-qs-load.webp){.shot-md}

Un `fz` positivo apunta en el sentido de +z, es decir, **hacia abajo**, así que un valor positivo es una carga gravitatoria. La casilla **LCS** marcada significa que la carga sigue los ejes propios del elemento (su sistema de coordenadas local, SCL); en una viga horizontal dibujada de izquierda a derecha coinciden con los ejes globales. Consulta la [convención de signos](/es/elements/conventions#loads).

::

## Lee los resultados {#_7-read-the-results}

La viga se resuelve en cuanto introduces la carga, y de nuevo tras cada cambio que hagas: no hay botón *Calcular*. El panel de arriba a la derecha del visor activa y desactiva los dibujos. **Forma deformada**, **M<sub>y</sub>(x)** y **Reacciones** están activados desde el principio. Marca **V<sub>z</sub>(x)** para añadir el esfuerzo cortante.

![Las opciones de visualización, con el esfuerzo cortante activado](/screenshots/es/a-qs-display.webp){.shot-md}

Tu pantalla debería coincidir ahora con esta figura. Alterna entre el momento flector y el esfuerzo cortante:

::model-figure{caption="La viga terminada: reacciones de 36 kN y 54 kNm en el centro del vano"}
---
nodes: { 1: [0, 0], 2: [6, 0] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 12 }
results: [M, V]
show: [nodeLabels]
---
::

| Dibujo | Qué debes ver |
| --- | --- |
| **Reacciones** | Dos flechas hacia arriba de **36 kN**, una en cada apoyo. |
| **V<sub>z</sub>(x)** | Una recta desde **+36 kN** en el nodo `1` hasta **−36 kN** en el nodo `2`, que pasa por cero en el centro del vano. |
| **M<sub>y</sub>(x)** | Una parábola con su máximo de **54 kNm** en el centro del vano, dibujada del lado traccionado, bajo la viga. |
| **Forma deformada** | Una curva simétrica hacia abajo, dibujada a escala ampliada. |

Para ver los números, abre la pestaña **Resultados**. **Resultados nodales** muestra los desplazamientos `Dx`, `Dz` y el giro `Ry` de cada nodo, y **Resultados de elementos**, las fuerzas en los extremos de cada elemento en sus propios ejes. El nodo `1` gira $R_y = -2{,}6469 \cdot 10^{-2}$ rad, y el nodo `2` lo mismo en sentido contrario. En [Resultados y diagramas](/es/essentials/results) se explican todas las tablas y todos los signos.

Si los diagramas se ven demasiado grandes o pequeños, cambia la **Escala de resultados** en **Configuración → Ajustes del visor**.

## Comprueba a mano {#_8-check-by-hand}

Con $q = 12$ kN/m y $L = 6$ m, las fórmulas de los libros de texto dan:

| Magnitud | Fórmula | A mano | EduBeam |
| --- | --- | --- | --- |
| Reacciones | $qL/2$ | 36 kN | 36 kN |
| Cortante máximo | $qL/2$ | 36 kN | 36 kN |
| Momento máximo | $qL^2/8$ | 54 kNm | 54 kNm |
| Giro en el extremo | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Flecha en el centro del vano | $w_b + w_s$ | 49,63 + 0,60 = 50,22 mm | 50,22 mm |

La flecha tiene dos partes, y la mayoría de los libros de texto solo dan la primera:

- **Flexión:** $w_b = 5qL^4/(384EI) = 49{,}63$ mm, con $EI = 4080$ kNm² a partir de $E = 210$ GPa e $I_y = 1943\ \text{cm}^4$.
- **Cortante:** $w_s = qL^2/(8kGA) = 0{,}60$ mm, con $kGA \approx 90\,700$ kN a partir de $k = 0{,}3933$, $G = 81$ GPa y $A = 28{,}48\ \text{cm}^2$.

Todavía no hay ningún nodo en el centro del vano, así que añade uno para leer allí la flecha:

1. En la pestaña **Nodos**, haz clic en el segundo botón **Añadir nodo**, el del icono de cursor.
2. Haz clic sobre la viga en `x = 3`; con el ajuste activado, el nodo cae sobre la cuadrícula. EduBeam pregunta qué hacer con el nodo: pulsa **Conectar a la estructura**. El elemento se divide en `1a` y `1b`, cada uno con su parte de la carga, y el modo de colocar nodos termina. Si en la pestaña **Nodos** el nodo `3` no está en X = `3`, escribe `3` ahí.
3. En **Resultados → Resultados nodales**, el nodo `3` muestra ahora $D_z = 5{,}0224 \cdot 10^{-2}$ m, es decir, 50,22 mm.

![Resultados nodales tras la división: el nodo 3 baja 50,22 mm](/screenshots/es/a-qs-nodal-results.webp){.shot-lg}

Dividir la viga no cambia ningún resultado, porque el elemento es exacto para estas cargas: no hay malla que refinar.

::callout{type="details" title="Por qué importa el coeficiente de cortante"}
EduBeam usa elementos viga de Timoshenko, que incluyen la deformación por cortante. El coeficiente de cortante $k$ escala el área que resiste el cortante, de modo que $kGA$ es la rigidez a cortante. En las secciones en I de la biblioteca, $k$ es la fracción del área que corresponde al alma, $h t_w / A$: para el IPE 200, $0{,}2 \cdot 0{,}0056 / 0{,}002848 = 0{,}3933$. La parte de la flecha debida al cortante, $w_s = qL^2/(8kGA)$, es la integral de $V/(kGA)$ desde un apoyo hasta el centro del vano.

En esta viga esbelta, la parte debida al cortante es de 0,60 mm, alrededor del 1 % del total. En una viga corta y de gran canto es mucho mayor. Pon un coeficiente de cortante muy grande (por ejemplo `1e10`) en la pestaña **Secciones** y EduBeam devuelve los 49,63 mm de la flexión pura. La teoría está en la [página del elemento viga](/es/elements/beam).
::

Encontrarás más casos de comprobación a mano (voladizo, viga biempotrada, celosía, temperatura, asiento de apoyo) en [Comprobar resultados a mano](/es/guide/verification).

## Experimenta {#_9-experiment}

Modifica el modelo y observa cómo responden los diagramas. Prueba cada cambio por separado y deshazlo con <kbd>Ctrl</kbd>+<kbd>Z</kbd> antes del siguiente. El nodo `3` es el nodo del centro del vano que acabas de añadir.

- **Arrastra el nodo `2`** hacia la derecha. El momento crece con $L^2$ y la flecha con $L^4$.
- **Marca `Ry` en el nodo `1`** para empotrar ese extremo. En el empotramiento aparece un momento negativo: $qL^2/8 = 54$ kNm según la fórmula de los libros, 53,8 kNm en EduBeam. En una viga hiperestática, la rigidez a cortante también modifica los esfuerzos.
- **Marca `Dz` en el nodo `3`** para añadir un apoyo intermedio y obtener una viga continua de dos vanos. El momento sobre el apoyo intermedio pasa a ser negativo: $q(L/2)^2/8 = 13{,}5$ kNm a mano, 13,3 kNm en EduBeam, por el mismo motivo.
- **Marca `Dz` en el nodo `3` y la segunda casilla de la columna *Rótulas de extremo* del elemento `1a`** (su extremo en el nodo `3`), en la pestaña **Elementos**. La viga se convierte en dos vanos biapoyados de 3 m. Ahora desmarca `Dz` en el nodo `3`: la viga pasa a ser un mecanismo y EduBeam muestra cómo puede moverse.

Para variar la luz y la carga sin construir nada, arrastra los controles deslizantes de abajo y cambia de resultado para ver cómo crece cada uno con la luz.

::example-structure
::

## Guarda o comparte {#_10-save-or-share}

- **Envíaselo a alguien.** Pulsa **Compartir modelo** en la barra superior y después **Copiar**. El enlace contiene el modelo completo, y quien lo abra obtiene su propia copia para editarla.
- **Guárdalo como archivo.** **☰ → Guardar proyecto** (<kbd>Ctrl</kbd>+<kbd>S</kbd>) descarga un `project.json`. Vuelve a abrirlo con **☰ → Abrir proyecto** (<kbd>Ctrl</kbd>+<kbd>O</kbd>) o arrastrándolo a la aplicación.
- **Lleva el dibujo a un informe.** **☰ → Exportar imagen** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) lo guarda en PNG o SVG.

El modelo también se conserva en el navegador, así que no se pierde al recargar la página. Encontrarás los detalles en [Archivos, enlaces y exportación](/es/essentials/import-export).

## Siguientes pasos {#where-next}

::card-grid{cols="2"}
:::card{title="Tutoriales" icon="lucide:graduation-cap" to="/es/tutorials/inclined-beam"}
Cuatro modelos construidos paso a paso y comprobados a mano, desde una viga inclinada hasta una viga continua con asiento de apoyo.
:::
:::card{title="Ejemplos" icon="lucide:library" to="/es/examples/"}
Vigas, pórticos y celosías ya preparados que se abren con un clic, con ejercicios y soluciones.
:::
:::card{title="Cargas" icon="lucide:arrow-down-to-line" to="/es/essentials/loads"}
Cargas trapezoidales, concentradas y térmicas, fuerzas nodales y asientos de apoyo.
:::
:::card{title="Teclado, ratón y pantalla táctil" icon="lucide:keyboard" to="/es/reference/shortcuts"}
Dibuja nodos y elementos directamente en el lienzo y edita más rápido.
:::
::
