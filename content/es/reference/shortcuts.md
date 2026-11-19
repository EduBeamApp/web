---
description: "Atajos de teclado, acciones del ratón y gestos táctiles de EduBeam: deshacer, guardar, abrir, exportar, copiar y pegar, ajustar, zoom, seleccionar y desplazar."
source: site
---

# Teclado, ratón y pantalla táctil

EduBeam se maneja con teclado y ratón, con el panel táctil del portátil o con el dedo. Esta página recoge todos los atajos y gestos. En un Mac, usa <kbd>Cmd</kbd> donde aparezca <kbd>Ctrl</kbd>; los menús de la propia aplicación muestran ahí ⌘.

## Teclado {#keyboard}

Los atajos de dibujo (<kbd>F</kbd>, <kbd>C</kbd>, <kbd>G</kbd>, <kbd>S</kbd>, <kbd>Supr</kbd> y <kbd>Ctrl</kbd>+<kbd>A</kbd>, <kbd>C</kbd>, <kbd>V</kbd>) no hacen nada mientras un campo de texto tiene el foco, así que escribir una `f` o una `s` en un campo nunca los activa. Haz clic antes en el dibujo.

### Archivos e historial {#files-and-history}

| Atajo | Acción |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>Z</kbd> | Deshacer el último cambio del modelo |
| <kbd>Ctrl</kbd>+<kbd>Mayús</kbd>+<kbd>Z</kbd> | Rehacer |
| <kbd>Ctrl</kbd>+<kbd>S</kbd> | Guardar proyecto (descarga `project.json`) |
| <kbd>Ctrl</kbd>+<kbd>O</kbd> | Abrir proyecto |
| <kbd>Ctrl</kbd>+<kbd>P</kbd> | Exportar imagen |

Deshacer también revierte la limpieza del modelo, la apertura de un archivo, un enlace o un ejemplo, y la restauración de una estructura reciente. Mientras sigues escribiendo en una celda de una tabla, <kbd>Ctrl</kbd>+<kbd>Z</kbd> deshace lo escrito; una vez confirmada la celda, deshace el cambio del modelo. En los campos de un diálogo, siempre deshace lo escrito.

### Dibujo {#drawing}

| Atajo | Acción |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>A</kbd> | Seleccionar todo |
| <kbd>Ctrl</kbd>+<kbd>C</kbd> | Copiar los nodos, elementos y cargas seleccionados |
| <kbd>Ctrl</kbd>+<kbd>V</kbd> | Pegar. Una silueta de la copia sigue al puntero: haz clic para colocarla, o escribe un desplazamiento Δx, Δz en la franja superior y pulsa **Pegar** o <kbd>Intro</kbd> |
| <kbd>Supr</kbd> | Eliminar la selección (en un portátil Mac, <kbd>Fn</kbd>+<kbd>⌫</kbd>) |
| <kbd>Esc</kbd> | Salir del modo actual (añadir nodos, elementos o cotas, pegar, elegir la ventana de una imagen) y vaciar la selección; también cierra el menú ☰ y termina el recorrido |
| <kbd>F</kbd> | Ajustar contenido a la pantalla |
| <kbd>C</kbd> | Centrar contenido |
| <kbd>G</kbd> | Mostrar u ocultar la cuadrícula |
| <kbd>S</kbd> | Activar o desactivar el ajuste a la cuadrícula |
| <kbd>Ctrl</kbd>+<kbd>+</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd> | Acercar / alejar el dibujo respecto a su centro |

En EduBeam, <kbd>Ctrl</kbd>+<kbd>+</kbd> y <kbd>Ctrl</kbd>+<kbd>-</kbd> hacen zoom en el dibujo, nunca en toda la interfaz como en otros sitios web. Funcionan con cualquier distribución de teclado: las teclas marcadas con + y −, estén donde estén en tu distribución (en un teclado estadounidense, las dos a la izquierda de <kbd>Retroceso</kbd>), y el + y el − del teclado numérico.

### Tablas y diálogos {#tables-and-dialogs}

| Atajo | Acción |
| --- | --- |
| <kbd>Intro</kbd> | En una celda de una tabla: confirma el valor. En un campo de texto de un diálogo: confirma el diálogo, como su botón principal |
| <kbd>Esc</kbd> | En una celda de una tabla: sale de ella y conserva el valor. En un diálogo: lo cierra sin guardar |
| <kbd>Tab</kbd> | Pasa al campo siguiente; una celda de una tabla conserva lo que has escrito |

Los campos numéricos admiten operaciones tal como las escribirías a mano: `6/2`, `3*1,5`, `2^3`, `(4+2)/3` y `1e3`, con coma o con punto decimal.

## Ratón {#mouse}

| Acción | Resultado |
| --- | --- |
| Clic | Selecciona un nodo, un elemento, una carga o una línea de cota y abre su panel |
| Arrastrar sobre el lienzo vacío | Rectángulo de selección |
| Arrastrar un nodo | Lo mueve; se ajusta a la cuadrícula si el ajuste está activado |
| Clic mientras añades | Coloca un nodo, o empieza o continúa una polilínea de elementos |
| Doble clic en una carga | Edita la carga (también un desplazamiento impuesto) |
| Clic derecho | Menú del lienzo: Añadir nodo, Añadir elemento, Añadir cota, Acotar el elemento (sobre un elemento), Editar, Copiar, Pegar, Eliminar |
| <kbd>Ctrl</kbd> + **Añadir nodo** o **Añadir elemento** en el menú del lienzo | Coloca con el ratón en lugar de abrir un diálogo |
| Arrastrar con el botón central o derecho | Desplaza la vista. El botón se elige en **Configuración → Controles y atajos → Desplazar con** |
| Rueda | Zoom hacia el puntero |
| Pasar el ratón por encima de un objeto | Recuadro emergente con sus desplazamientos, propiedades o valores de carga |

En un panel táctil, tanto pellizcar como desplazar con dos dedos hacen zoom. Para desplazar la vista, haz clic y arrastra con dos dedos, lo que equivale a arrastrar con el botón derecho.

## Pantalla táctil {#touch}

| Gesto | Resultado |
| --- | --- |
| Tocar | Selecciona un objeto y muestra sus datos y acciones |
| Tocar mientras añades | Coloca un nodo o continúa un elemento |
| Pulsar un nodo y arrastrar | Mueve el nodo |
| Arrastrar con un dedo en otro sitio | Desplaza la vista |
| Pellizcar | Zoom |
| Mantener pulsado el lienzo | Menú del lienzo |
| Botón **Selección por rectángulo** (arriba a la derecha) y luego arrastrar | Rectángulo de selección; el menú del lienzo, con Copiar y Eliminar, se abre donde levantas el dedo |

Mientras añades nodos, elementos o cotas, pegas o eliges la ventana de una imagen, una franja en la parte superior del dibujo indica el modo y tiene un botón **Cancelar**. Sin tecla <kbd>Esc</kbd>, así es como se sale del modo en una pantalla táctil.

## Paneles de objeto {#object-panels}

Al hacer clic en un objeto, o al tocarlo, se abre junto a él un panel con sus datos y estas acciones:

| Objeto | Acciones |
| --- | --- |
| Nodo | Añadir carga · Apoyos del nodo (símbolo de apoyo, Dx, Dz, Ry) · Ángulo del SCL nodal · Imponer desplazamiento (en un nodo con apoyo) · Eliminar |
| Elemento | Editar elemento (nodos extremos y rótulas, material, sección) · Añadir carga · Matriz de rigidez · Eliminar |
| Carga nodal o de elemento | Editar carga · Eliminar |
| Línea de cota | Editar · Invertir cota · Eliminar |

[Interfaz de usuario](/es/essentials/user-interface) es un recorrido por la pantalla, y [Controles y atajos](/es/essentials/units-settings#controls-shortcuts), en la configuración, permite elegir el botón para desplazar la vista.
