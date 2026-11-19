---
description: "Por qué EduBeam no muestra resultados y cómo solucionarlo: todos los mensajes de error y advertencia, resultados extraños y archivos o enlaces que no se abren."
source: site
---

# Solución de problemas

Cuando un modelo no se puede resolver, [EduBeam]{.edubeam} explica por qué en un mensaje arriba a la izquierda del visor, y **Mostrar detalles** enumera todos los problemas con el texto completo. Busca el título del diálogo que has visto: cada mensaje de abajo explica qué significa y cómo solucionarlo.

::card-grid{cols="2"}
:::card{title="Aún no se puede resolver" icon="lucide:circle-dashed" to="#still-needed"}
Un aviso azul **Faltan apoyos**. No hay ningún error: la estructura simplemente todavía no está sujeta.
:::
:::card{title="No se puede resolver el modelo" icon="lucide:circle-x" to="#errors"}
Un mensaje rojo. Apoyos que no sujetan, rótulas que forman un mecanismo, un elemento de longitud cero.
:::
:::card{title="Advertencias del modelo" icon="lucide:triangle-alert" to="#warnings"}
Un mensaje amarillo. El modelo se ha resuelto, pero probablemente algo no es lo que pretendías.
:::
:::card{title="Los resultados parecen erróneos" icon="lucide:scale" to="#results-look-wrong"}
Cargas que actúan hacia arriba, flechas que difieren en potencias de diez, un signo que parece invertido.
:::
::

## Mensajes {#messages}

### Qué significan los colores {#read-the-message}

| Ves | Significa |
| --- | --- |
| Un aviso azul **Faltan apoyos** | El modelo está sin terminar. Añade apoyos. Pasa el ratón por encima del aviso para ver, como contorno discontinuo, cómo puede moverse todavía la estructura. |
| Un mensaje **rojo** | Algo impide el cálculo. Indica el problema, o dice *Errores en el modelo: n* cuando hay varios. Los nodos implicados aparecen rodeados con un círculo en el dibujo. |
| Un mensaje **amarillo** | Advertencias. El modelo se ha resuelto de todos modos. Si hay varias, dice *Advertencias en el modelo: n*. |
| *No hay materiales definidos.* / *No hay secciones definidas.* | Los elementos necesitan ambos. Añade uno con el botón **Añadir** que hay junto al mensaje. |

**Mostrar detalles** abre el diálogo, titulado *Aún no se puede resolver*, *No se puede resolver el modelo* o *Advertencias del modelo*. Su interruptor muestra u oculta cómo puede moverse la estructura, y su enlace **Solución de problemas** lleva a esta página.

![El diálogo No se puede resolver el modelo, con el interruptor que muestra cómo puede moverse la estructura](/screenshots/es/ui-diagnostics.webp){.shot-lg}

En el dibujo:

- La **✕** de un mensaje rojo lo pliega en un pequeño aviso *No se puede resolver el modelo*, para dejar sitio en una pantalla pequeña. Haz clic en el aviso para desplegarlo.
- El botón del **ojo** de un mensaje rojo muestra u oculta el contorno discontinuo del movimiento. **Configuración → Ajustes del visor → Comprobación del modelo** desactiva el contorno, y su animación, de forma permanente.
- La **✕** de un mensaje amarillo oculta las advertencias.

### Falta por completar {#still-needed}

El modelo no está mal, solo sin terminar. Pasa el ratón por encima del aviso para ver el texto breve; el diálogo muestra el largo.

| Mensaje | Significado y solución |
| --- | --- |
| *La estructura necesita apoyos para poder resolverse.* <br> *El modelo necesita al menos 3 grados de libertad restringidos para ser estable en un análisis 2D.* | Hay menos de tres direcciones restringidas en total. Añade apoyos. |
| *La parte con los nudos … necesita apoyos.* <br> *Una parte independiente de la estructura (nodos …) tiene menos de 3 grados de libertad restringidos y puede moverse libremente.* | El modelo está formado por partes separadas y una de ellas queda suelta. Únela al resto o ponle apoyos. |
| *n partes de la estructura necesitan apoyos.* | Hay varias partes sueltas. **Mostrar detalles** las enumera. |

### Errores {#errors}

Algo impide el cálculo. El mensaje rojo muestra el texto breve; el diálogo, el largo.

| Mensaje | Significado y solución |
| --- | --- |
| *Los apoyos no sujetan la estructura: todavía puede desplazarse horizontalmente / moverse verticalmente / girar libremente / moverse como sólido rígido.* <br> *La estructura tiene suficientes apoyos, pero no la sujetan: todavía puede …* | Hay restricciones suficientes, pero son todas paralelas o sus líneas de acción se cortan en un punto, como con tres rodillos en una viga horizontal. El contorno discontinuo muestra el movimiento; gira o mueve uno de los apoyos. |
| *La parte con los nudos … no está sujeta: todavía puede …* <br> *Una parte independiente de la estructura (nodos …) tiene suficientes apoyos, pero no la sujetan: todavía puede …* | Lo mismo, para una de las partes separadas del modelo. |
| *Las articulaciones del nudo … permiten que la estructura se mueva.* <br> *Los apoyos sujetan la estructura, pero sigue siendo un mecanismo: sus barras pueden girar alrededor de las articulaciones del nudo …* | Las rótulas permiten que las barras giren unas respecto a otras, como en un pórtico con los dos pies articulados y una rótula en la cabeza de cada pilar, o en un cuadrado de barras articuladas sin diagonal. Quita una rótula, o añade una barra o un apoyo. |
| *La estructura es inestable: se mueve casi sin resistencia.* <br> *La estructura es inestable; se mueve prácticamente sin resistencia: nodo … en horizontal (Dx) …* | Casi un mecanismo, o una rigidez cercana a cero. El mensaje largo indica los nodos y las direcciones. Comprueba los apoyos, las rótulas y los valores de `E`, `A` e `Iy`. |
| *La estructura es un mecanismo: puede moverse sin resistencia.* <br> *La estructura es un mecanismo: la matriz de rigidez es singular.* | Algo puede moverse libremente y las comprobaciones anteriores no lo han detectado. Comprueba que cada parte esté sujeta por al menos tres restricciones y que las rótulas de extremo no dejen una barra libre para girar. |
| *El elemento … tiene longitud cero: los nodos … y … están en el mismo punto.* | Dos nodos de un mismo elemento están uno encima del otro. Mueve uno o elimina el elemento. |
| *El elemento … hace referencia al mismo nodo en ambos extremos.* | Elimina el elemento y vuelve a dibujarlo entre dos nodos distintos. |
| *El elemento … hace referencia al nodo / material / sección transversal inexistente …* | El objeto que usa se ha eliminado, normalmente en un archivo de proyecto editado a mano. Vuelve a asignarlo en la tabla *Elementos*. |
| *El elemento … debe hacer referencia a exactamente 2 nodos.* | Un elemento dañado en un archivo importado. Elimínalo y vuelve a dibujarlo. |
| *La carga nodal #n hace referencia al nodo inexistente …* <br> *El desplazamiento impuesto #n hace referencia al nodo inexistente …* | Elimina la carga o asígnale un nodo que exista. |
| *La carga de elemento #n hace referencia al elemento inexistente …* | Elimina la carga. |
| *El solver falló por una incoherencia interna del modelo.* | Un fallo genérico. Deshaz el último paso, o guarda el proyecto e [informa del problema](#reporting-a-bug). |

### Advertencias {#warnings}

El modelo se resuelve de todos modos, pero revisa estas:

| Mensaje | Significado y solución |
| --- | --- |
| *El nodo … no está conectado a ningún elemento y el solver lo ignora.* | Un nodo suelto. Elimínalo o conéctalo. |
| *El nodo … tiene apoyo, pero ningún elemento llega a él, así que el apoyo no transmite nada.* | Un apoyo en un nodo suelto. |
| *La carga nodal #n contiene valores no válidos.* <br> *El desplazamiento impuesto #n contiene valores no válidos.* | Una componente que no es un número. Edita la carga. |

### Mientras editas {#while-editing}

Estos mensajes se abren en un diálogo del navegador mientras trabajas, y el modelo queda como estaba:

| Mensaje | Significado y solución |
| --- | --- |
| *Añada primero un material.* <br> *Añada primero una sección transversal.* | Un elemento necesita ambos. Añade uno en la pestaña *Materiales* o *Secciones* y vuelve a dibujar el elemento. |
| *Seleccione un material y una sección transversal.* | El diálogo **Añadir elemento** tiene un campo vacío. Elige ambos. |
| *La etiqueta … ya está en uso.* | Dos nodos, elementos, materiales o secciones no pueden compartir etiqueta. Elige otra. |
| *Ya existe un desplazamiento impuesto en este nodo. Elimínelo primero.* | Un nodo admite un solo desplazamiento impuesto. Edita el que tiene, o elimínalo primero. |

## No se dibuja nada {#no-results-are-drawn}

Si no aparece ningún diagrama, comprueba, en este orden:

::div{.steps}

### Comprueba las opciones de visualización {#check-the-display-options}

Si no hay ningún mensaje, el modelo está resuelto: puede que el diagrama simplemente esté desactivado. Marca **M<sub>y</sub>(x)**, u otro resultado, en las opciones de visualización, arriba a la derecha del visor; el botón ⚙ que hay encima muestra el panel. Un modelo sin ninguna carga tiene resultados nulos en todas partes, así que tampoco hay nada que dibujar.

### Comprueba los apoyos {#check-the-supports}

El solver necesita al menos tres direcciones restringidas, y entre todos los apoyos deben impedir que la estructura se deslice o gire. Una viga sobre dos rodillos solo tiene dos y se desliza: convierte uno de ellos en una **articulación**. Tres rodillos paralelos, o apoyos cuyas líneas de acción se cortan en un punto, tampoco la sujetan. Consulta [Nodos y apoyos](/es/essentials/nodes-supports#supports).

### Comprueba que los elementos estén conectados {#check-the-connections}

Dos nodos con las mismas coordenadas siguen siendo dos nodos distintos, y una parte que solo toca el resto en ese punto queda suelta. Elimina el nodo sobrante y vuelve a conectar. Cuando coloques un nodo sobre un elemento, responde **Conectar a la estructura** para dividir allí el elemento.

### Cuenta las rótulas {#count-the-hinges}

Un pórtico con los dos pies articulados y una rótula en la cabeza de cada pilar, o un cuadrado de barras articuladas sin diagonal, es un mecanismo. EduBeam rodea las rótulas con un círculo y anima un contorno discontinuo con el movimiento. Consulta [Rótulas de extremo](/es/essentials/elements#end-hinges).

### Busca una rigidez nula {#look-for-zero-stiffness}

Un `E`, `A` o `Iy` introducido como 0, o en la unidad equivocada, hace que parte de la estructura se mueva casi sin resistencia. EduBeam lo indica como *inestable*.

::

## Los resultados parecen erróneos {#results-look-wrong}

| Síntoma | Causa probable |
| --- | --- |
| Las cargas actúan hacia arriba | El eje global **z apunta hacia abajo**, así que un `Fz` o `fz` positivo actúa hacia abajo; los valores negativos apuntan hacia arriba. Con los ejes y hacia arriba es al revés. Consulta [Cargas](/es/essentials/loads#sign-convention-in-one-line). |
| La flecha difiere en potencias de diez | Una confusión de unidades: `E` introducido en Pa cuando el campo espera MPa, o `Iy` en cm⁴ cuando espera m⁴. El botón de unidades, abajo a la derecha del visor, indica las unidades de cada campo. |
| La flecha es algo mayor que la de la fórmula del libro | La deformación por cortante de la viga de Timoshenko. Consulta [Comprobar resultados a mano](/es/guide/verification#shear-deformation). |
| Un signo parece incorrecto | Lee el signo en el valor, no en el lado en que se dibuja el diagrama: el M positivo tracciona la fibra inferior. Las fuerzas en los extremos de *Resultados de elementos* siguen los ejes locales del elemento, no la convención de N, V y M. Consulta [Interpretar el signo](/es/essentials/results#reading-the-sign). |
| Un diagrama está en el lado «equivocado» | El lado es una opción de visualización: el momento flector del lado traccionado o del comprimido, N y V a uno u otro lado de la línea discontinua. **Configuración → Ajustes del visor → Diagramas de esfuerzos internos**. |
| Dos pilares idénticos muestran cortantes de signo opuesto | El signo de V sigue la dirección de cada elemento. Intercambia los nodos de uno de ellos para compararlos. |
| Números como `4 · 10¹` | El formato numérico científico. Elige *Automático* en **Configuración → Idioma y configuración regional → Formato numérico**. |
| Los diagramas son enormes o diminutos | Solo afecta al dibujo. Ajusta la **Escala de resultados** en **Configuración → Ajustes del visor**. |
| Una carga en ejes locales apunta al revés | El eje x local de un elemento va de su nodo *inicial* a su nodo *final*. Intercambia los nodos o cambia el signo. |
| La carga sobre una barra inclinada no cuadra | La casilla **LCS** está marcada por defecto, así que `fz` actúa perpendicular a la barra. Desmárcalo para una carga vertical. |
| Una carga térmica no hace nada | Una estructura isostática se deforma libremente con la temperatura, sin esfuerzos. Para que se deforme, comprueba que α no sea 0 y, en un gradiente, que el canto $h$ de la sección esté definido. |

## Archivos y enlaces {#files-and-links}

| Síntoma | Solución |
| --- | --- |
| *No se pudo importar el archivo. Compruebe el formato del archivo.* | El archivo no es ni un proyecto de EduBeam ni una sesión del EduBeam de escritorio. Tu modelo no ha cambiado. |
| *Esta sesión de EduBeam tiene varios casos de carga, pero solo se puede abrir uno.* | Una sesión del EduBeam de escritorio con varios casos de carga: EduBeam abre el primero e indica los que ha omitido. |
| Un enlace compartido abre tu modelo anterior | El enlace se cortó o se modificó, por ejemplo porque un cliente de correo lo partió en varias líneas. EduBeam ignora un enlace que no puede leer y conserva tu modelo. Vuelve a copiar el enlace completo. |
| Un enlace corto no se abre en el equipo de un colega | Su copia de EduBeam es anterior a la versión 1.3.2. Debe recargar la aplicación, o puedes compartir con **Enlace más corto** desactivado. Consulta [Compartir un enlace](/es/essentials/import-export#share-a-link). |

## Problemas de la interfaz {#interface-issues}

| Síntoma | Solución |
| --- | --- |
| Los atajos no hacen nada | Haz clic primero en el dibujo: las teclas sueltas se ignoran mientras un campo de texto tiene el foco. En un Mac, usa <kbd>Cmd</kbd> en lugar de <kbd>Ctrl</kbd>. Consulta [Teclado, ratón y pantalla táctil](/es/reference/shortcuts). |
| <kbd>Supr</kbd> no hace nada en un Mac | En el teclado de un Mac, la tecla de borrar (⌫) es en realidad la de retroceso. Pulsa <kbd>Fn</kbd>+<kbd>⌫</kbd>. |
| No puedo desplazar la vista | La vista se desplaza con el botón central o derecho del ratón; elige cuál en **Configuración → Controles y atajos**. En un panel táctil, haz clic y arrastra con dos dedos. En una pantalla táctil, arrastra con un dedo. |
| Mi modelo ha desaparecido | Al abrir un enlace, un archivo o un ejemplo, y al limpiar, el modelo anterior se conserva: **☰ → Estructuras recientes**, o <kbd>Ctrl</kbd>+<kbd>Z</kbd>. Al abrir un enlace, un aviso en la parte inferior de la pantalla lo indica: *Se abrió una estructura compartida. La anterior está en Estructuras recientes.*, con un botón **Mostrar**. |
| Idioma equivocado | **Configuración → Idioma y configuración regional**, o añade `?lang=es` a la dirección. |
| Los cambios de configuración no se guardan | El almacenamiento local está bloqueado, por ejemplo en una ventana privada o en un modo de privacidad estricto. La configuración, el modelo guardado y las Estructuras recientes lo necesitan. |

## Informar de un error {#reporting-a-bug}

Abre una [incidencia en GitHub](https://github.com/janvorisek/edubeam/issues) indicando tu navegador y tu sistema operativo, qué hiciste y qué esperabas. Lo más útil de todo es un **enlace para compartir** o el **archivo de proyecto** que muestre el problema.
