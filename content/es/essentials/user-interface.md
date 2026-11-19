---
description: "Mapa de la interfaz de EduBeam: barra superior y menú ☰, visor con sus botones y opciones de visualización, selección y edición, tablas de la barra inferior y cómo introducir valores."
source: site
---

# Interfaz de usuario

[EduBeam]{.edubeam} tiene tres zonas: la **barra superior**, el **visor** en el centro, donde dibujas, y la **barra inferior**, con una tabla para cada tipo de objeto. Todo lo que haces en el visor puedes hacerlo también en las tablas, y al revés.

![Las partes de la interfaz, numeradas como en la lista siguiente](/screenshots/es/ui-overview.webp)

1. **Menú ☰**: abrir, guardar, compartir y exportar; ejemplos y recorridos guiados.
2. **Limpiar estructura** y **Compartir modelo**.
3. **Deshacer** y **Rehacer**.
4. **Botones del visor**: centrar, ajustar a la pantalla y las opciones de visualización.
5. **Opciones de visualización**: qué resultados y qué partes del modelo se dibujan.
6. **Cuadrícula, ajuste, cruceta y unidades.**
7. **Pestañas de la barra inferior**: Nodos, Elementos, Cargas, Materiales, Secciones, Resultados.
8. **La tabla** de la pestaña abierta, donde se puede editar cada valor.

::callout{type="tip" title="Haz el recorrido"}
**☰ → Hacer un recorrido** te muestra estas partes en la propia aplicación, una a una.
::

## Barra superior {#app-bar}

- **☰** abre el menú principal, descrito más abajo.
- **Limpiar estructura** elimina todos los nodos, elementos y cargas tras pedir confirmación; marca **Eliminar materiales** o **Eliminar secciones** para quitar también esos. <kbd>Ctrl</kbd>+<kbd>Z</kbd> recupera el modelo, que además queda guardado en *Estructuras recientes*.
- **Compartir modelo** abre el [diálogo de compartir](/es/essentials/import-export#share-a-link) con un enlace que contiene todo el modelo.
- **¿Qué hay de nuevo?** muestra las notas de versión. También se abren solas una vez después de cada actualización.
- **Documentación** abre esta guía, y el icono de GitHub, el código fuente.

En un teléfono solo caben ☰ y **Documentación**; **Limpiar estructura** y **Compartir modelo** están en el menú.

### El menú ☰ {#the-☰-menu}

![El menú ☰](/screenshots/es/ui-app-menu.webp){.shot-xs}

- **Abrir proyecto** y **Guardar proyecto** abren o descargan un archivo `project.json` (<kbd>Ctrl</kbd>+<kbd>O</kbd>, <kbd>Ctrl</kbd>+<kbd>S</kbd>).
- **Estructuras recientes** guarda los 10 últimos modelos que limpiaste o reemplazaste, listos para restaurarlos.
- **Exportar imagen** guarda el dibujo en PNG o SVG, o lo copia (<kbd>Ctrl</kbd>+<kbd>P</kbd>).
- **Ejemplos** es la galería de modelos ya preparados; **Dibuja tu primera viga** es una tarea guiada de siete pasos; **Hacer un recorrido** es el recorrido por la interfaz.
- **Compartir modelo** y **Limpiar estructura** hacen lo mismo que los botones de la barra superior.

En la parte inferior del menú aparecen la versión de la aplicación y su fecha de publicación. Abrir, guardar, compartir y exportar se explica en [Archivos, enlaces y exportación](/es/essentials/import-export).

## Visor {#viewer}

El lienzo, donde dibujas e inspeccionas el modelo. Los resultados se recalculan con cada cambio; no hay botón *Calcular*.

### Botones sobre el lienzo {#buttons-on-the-canvas}

**Arriba a la izquierda: Deshacer y Rehacer.** Recorren hacia atrás y hacia delante cada cambio del modelo: añadir, editar, arrastrar, eliminar, limpiar (<kbd>Ctrl</kbd>+<kbd>Z</kbd>, <kbd>Ctrl</kbd>+<kbd>Mayús</kbd>+<kbd>Z</kbd>).

**Arriba a la derecha:**

- **Selección por rectángulo**, en un dispositivo con pantalla táctil: el siguiente arrastre con el dedo selecciona un rectángulo.
- **Centrar contenido** centra el modelo sin cambiar el zoom (<kbd>C</kbd>); **Ajustar contenido a la pantalla** ajusta el zoom para que se vea el modelo entero (<kbd>F</kbd>).
- **⚙** muestra u oculta las [opciones de visualización](#display-options).

**Abajo a la derecha:**

![Los botones de cuadrícula, ajuste, cruceta y unidades](/screenshots/es/ui-grid-units.webp){.shot-sm}

- **G** muestra u oculta la cuadrícula y las reglas (<kbd>G</kbd>); **S** activa o desactiva el ajuste a la cuadrícula (<kbd>S</kbd>).
- El botón de la **cruceta** marca en las reglas la posición del puntero (solo con ratón).
- El **botón de unidades** abre la configuración en [Idioma y configuración regional](/es/essentials/units-settings#language-locale).

### Opciones de visualización {#display-options}

El botón ⚙ abre dos filas de casillas. La primera elige los resultados que se dibujan sobre el modelo: *Forma deformada*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)* y *Reacciones*; al principio están marcados la deformada, el momento flector y las reacciones. La segunda muestra u oculta partes del modelo: *Apoyos*, *Cargas*, *Etiquetas de nodos* y *Etiquetas de elementos*, todas marcadas al principio.

![Los botones del visor y las opciones de visualización](/screenshots/es/ui-display-settings.webp){.shot-lg}

**Más ajustes** abre los [ajustes del visor](/es/essentials/units-settings#viewer-settings): tamaños, colores y cómo se dibujan los diagramas. Qué muestra cada resultado se explica en [Resultados y diagramas](/es/essentials/results#overlays-in-the-viewer).

### Navegar {#navigating}

| Acción | Ratón y teclado | Pantalla táctil |
| --- | --- | --- |
| Zoom | Rueda del ratón, hacia el puntero; en un panel táctil, pellizca o desplaza con dos dedos | Pellizcar |
| Desplazar la vista | Arrastra con el botón derecho o con la rueda pulsada; elige cuál en [Controles y atajos](/es/essentials/units-settings#controls-shortcuts) | Arrastrar con un dedo |
| Ajustar, centrar | <kbd>F</kbd>, <kbd>C</kbd> o los botones de arriba a la derecha | Los botones de arriba a la derecha |

No hay tecla de zoom: los atajos del propio navegador <kbd>Ctrl</kbd>+<kbd>+</kbd> y <kbd>Ctrl</kbd>+<kbd>-</kbd> están desactivados en la aplicación, para que no amplíen sin querer toda la interfaz.

### Seleccionar y editar {#selecting-and-editing}

| Para | Haz esto |
| --- | --- |
| Seleccionar un objeto | Haz clic en un nodo, elemento, carga o línea de cota. Junto a él se abre un panel con sus acciones: añadir una carga, definir apoyos, editar, mostrar la matriz de rigidez, eliminar. La barra inferior cambia a su pestaña. |
| Seleccionar varios | Arrastra un rectángulo sobre el lienzo vacío (en pantalla táctil, pulsa antes **Selección por rectángulo**). Se seleccionan todos los nodos que quedan dentro y todos los elementos que toca, con sus cargas y líneas de cota. <kbd>Ctrl</kbd>+<kbd>A</kbd> lo selecciona todo. |
| Eliminar, copiar, pegar | <kbd>Supr</kbd>, <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd>. Lo que pegas sigue al puntero hasta que haces clic; también puedes escribir un desplazamiento Δx, Δz en la franja superior. |
| Mover un nodo | Arrástralo. Con el ajuste activado, cae en la cuadrícula; los elementos y las cargas conectados lo siguen. |
| Editar una carga | Haz doble clic en ella. |
| Ver detalles | Pasa el ratón por encima de cualquier objeto y aparece un recuadro emergente: los desplazamientos y el giro de un nodo, el material y la sección de un elemento, los valores de una carga. En pantalla táctil, tócalo: el panel muestra lo mismo. |
| Abrir el menú del lienzo | Haz clic derecho en el lienzo, o mantén el dedo pulsado en una pantalla táctil. |

::div{.shots}

![El panel de un nodo: añadir una carga, definir apoyos, imponer un desplazamiento](/screenshots/es/ui-node-menu.webp)

![Al pasar el ratón por encima de un nodo se ven sus desplazamientos y su giro](/screenshots/es/ui-hover.webp)

::

El **menú del lienzo** ofrece *Añadir nodo*, *Añadir elemento*, *Añadir cota* (y, sobre un elemento, *Acotar el elemento*) y después *Editar*, *Copiar*, *Pegar* y *Eliminar* para la selección actual. Mantén pulsada <kbd>Ctrl</kbd> al elegir *Añadir nodo* o *Añadir elemento* para colocarlos con el ratón en lugar de con un diálogo.

![El menú del lienzo](/screenshots/es/ui-canvas-menu.webp){.shot-sm}

La página [Teclado, ratón y pantalla táctil](/es/reference/shortcuts) recoge todos los atajos y gestos.

### Cuando el modelo no se puede resolver {#when-the-model-cannot-be-solved}

Los mensajes aparecen arriba a la izquierda del visor:

| Mensaje | Significa |
| --- | --- |
| *No hay materiales definidos.*, *No hay secciones definidas.* | Añade uno con el botón **Añadir** que aparece al lado. |
| El aviso azul **Faltan apoyos** | El modelo simplemente está sin terminar: necesita más apoyos. |
| Un mensaje rojo, con **Mostrar detalles** | Algo está mal. Los detalles enumeran todos los problemas, cada uno con una pista para resolverlo. |
| Un mensaje amarillo | El modelo se ha resuelto, pero algo parece raro, por ejemplo un nodo al que no llega ningún elemento. |

Cuando la estructura todavía puede moverse, EduBeam dibuja con línea discontinua cómo oscila y rodea con un círculo los nodos o las rótulas responsables. Pasa el ratón por encima del mensaje para volver a ver el movimiento; su botón del ojo lo oculta.

![Un pórtico con rótulas en B y C es un mecanismo: EduBeam muestra cómo se mueve](/screenshots/es/ui-mechanism.webp)

En [Solución de problemas](/es/reference/troubleshooting#messages) se explica cada mensaje y cómo corregirlo.

## Barra inferior {#bottom-bar}

Seis pestañas, cada una con una barra de herramientas y una tabla editable. La etiqueta de cada pestaña indica cuántos objetos contiene. Arrastra la fila de pestañas hacia arriba o hacia abajo para cambiar la altura de la barra, o recógela con el botón de la derecha. El **?** de al lado explica la pestaña abierta, igual que el **?** junto a algunos encabezados de columna.

| Pestaña | Barra de herramientas | Columnas de la tabla |
| --- | --- | --- |
| **Nodos** | Añadir nodo (diálogo), Añadir nodo (ratón) | Nodo, Coordenadas, **Grados de libertad restringidos** (símbolo del apoyo, `Dx`, `Dz`, `Ry`, ángulo α), Cargas, Acciones |
| **Elementos** | Añadir elemento (diálogo), Añadir elemento (ratón) | Elemento, Tipo, Nodos (con **Intercambiar nodos**), Material, Sección transversal, **Rótulas de extremo**, Cargas, Acciones |
| **Cargas** | Añadir carga nodal, Añadir carga de elemento | Tipo, Punto de aplicación, Componentes, Acciones |
| **Materiales** | Añadir material, Biblioteca de materiales | Material, E, G, α<sub>T</sub>, Acciones |
| **Secciones** | Añadir sección, Biblioteca de secciones, Sección poligonal | Forma, Sección transversal, Área, I<sub>y</sub>, Altura, Coeficiente de cortante, Acciones |
| **Resultados** | Resultados nodales, Resultados de elementos, Exportar CSV, Copiar | Desplazamientos de cada nodo o fuerzas de extremo de cada elemento; consulta [Resultados y diagramas](/es/essentials/results#results-tab) |

Las pestañas se describen en detalle en [Nodos y apoyos](/es/essentials/nodes-supports), [Elementos, materiales y secciones](/es/essentials/elements), [Cargas](/es/essentials/loads) y [Resultados y diagramas](/es/essentials/results#results-tab).

### Introducir valores {#typing-values}

Todos los campos numéricos, en las tablas y en los diálogos, funcionan igual:

- Los valores están en las [unidades actuales](/es/essentials/units-settings#units), que se indican en el encabezado de la columna o detrás del campo.
- Sirven tanto el punto como la coma decimal: `2.5` y `2,5` son lo mismo.
- Puedes escribir operaciones: `+ - * / ^` y paréntesis, de modo que `6/2`, `3*1.5`, `2^3` o `(4+2)/3` se calculan solos, y `1e-5` es $10^{-5}$.
- En una tabla, <kbd>Intro</kbd>, <kbd>Esc</kbd>, <kbd>Tab</kbd> o un clic en otro sitio aplican el valor. Después, <kbd>Ctrl</kbd>+<kbd>Z</kbd> lo deshace; mientras todavía escribes, deshace solo lo que has escrito.

## Pestañas sobre el visor {#tabs-above-the-viewer}

**Visor** muestra el lienzo. **Configuración** muestra en su lugar la [configuración](/es/essentials/units-settings) a tamaño completo, para que puedas cambiar colores o unidades y volver al visor para ver el efecto. El botón de unidades y *Más ajustes* abren la misma configuración como un diálogo sobre el modelo.

## Ventanas flotantes {#floating-windows}

**Matriz de rigidez** (desde el panel de un elemento o desde la tabla *Elementos*) abre una ventana con la matriz de rigidez 6 × 6 del elemento en ejes globales. **Editar** en el menú del lienzo abre una tabla con la selección actual. Mueve una ventana arrastrando su barra de título y ciérrala con la ×.
