---
description: "Configuración de EduBeam: idioma, unidades SI o estadounidenses, formato numérico, ejes z abajo o y arriba, cuadrícula, diagramas, colores, datos del navegador."
source: site
---

# Unidades y ajustes

Elige el idioma, las unidades y los ejes con los que trabajas, y el aspecto del dibujo. La configuración solo cambia cómo se muestra y se introduce el modelo: el modelo se guarda siempre en unidades SI y con z hacia abajo, así que un proyecto o un enlace se abre igual con cualquier configuración.

Hay tres formas de llegar a ella:

- la pestaña **Configuración**, sobre el visor, la muestra a tamaño completo en lugar del modelo, en *Idioma y configuración regional*; la pestaña **Visor** te devuelve al modelo;
- el **botón de unidades**, abajo a la derecha del visor (`m m² kN kNm MPa`), la abre como un diálogo en *Idioma y configuración regional*;
- **Más ajustes**, bajo las [opciones de visualización](/es/essentials/user-interface#display-options), abre el diálogo en *Ajustes del visor*.

La configuración se guarda en el navegador y se conserva al recargar. **Restablecer configuración**, debajo de la lista de páginas, devuelve los valores predeterminados: formato numérico, ejes, botón para desplazar la vista, las unidades de tu región y todos los ajustes del visor y las opciones de visualización. El idioma se conserva. El restablecimiento no se puede deshacer.

## Idioma y configuración regional {#language-locale}

![Configuración → Idioma y configuración regional](/screenshots/es/settings-language.webp)

**Idioma.** 22 idiomas; la primera vez, EduBeam sigue el idioma de tu navegador. El separador decimal sigue al idioma. Un enlace puede elegir el idioma de quien lo abre: añade `?lang=` con uno de estos códigos: `en`, `cs`, `sk`, `de`, `fr`, `es`, `pt`, `pl`, `hu`, `ro`, `el`, `cn` (chino), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`.

**Formato numérico.** Cómo se escriben los resultados en las tablas y en los recuadros emergentes: *Científico* (1,5 · 10⁴, el predeterminado), *Ingeniería* (15 · 10³) o *Automático*. Consulta [Formato numérico](/es/essentials/results#number-format).

**Sistema de coordenadas.** *x a la derecha, z hacia abajo* (el predeterminado) o *x a la derecha, y hacia arriba*. Con *x a la derecha, y hacia arriba*, el eje vertical se llama y y apunta hacia arriba, y los momentos son respecto a z. Las coordenadas verticales, las fuerzas, los desplazamientos, las reacciones y los ángulos de los apoyos cambian de signo, y todas las entradas, tablas, recuadros emergentes y exportaciones usan los nuevos nombres. El modelo, el dibujo y los archivos guardados no cambian en absoluto. Consulta [Ejes con y hacia arriba](/es/elements/conventions#y-up-axes).

![El pórtico triarticulado con ejes con y hacia arriba: el indicador de ejes de la esquina apunta y hacia arriba](/screenshots/es/settings-y-up.webp){.shot-lg}

**Sistema de unidades.** *SI (métrico)* o *Estadounidense (imperial)* fija de una vez todas las unidades. En la primera visita eliges en el diálogo de bienvenida. EduBeam solo propone las unidades estadounidenses cuando el navegador tiene configuración regional de EE. UU. *y* el equipo está en una zona horaria de EE. UU.; en cualquier otro caso propone el SI. Si después cambias una unidad por separado, el sistema aparece como *Personalizado*.

### Unidades {#units}

Cada magnitud tiene su propia unidad. La usan las entradas (que la muestran al final del campo), las tablas, los recuadros emergentes y las etiquetas de los diagramas, y al cambiar una unidad se convierte lo que se muestra. En el modelo no cambia nada, así que puedes cambiar de unidades tantas veces como quieras sin perder nada.

| Magnitud | Opciones | SI | Estadounidense |
| --- | --- | --- | --- |
| Longitud (geometría, posiciones de cargas) | m, cm, mm, ft, in | m | ft |
| Dimensiones de sección | m, cm, mm, ft, in | m | in |
| Desplazamiento (resultados, asientos impuestos) | m, cm, mm, ft, in | m | in |
| Área | m², cm², mm², ft², in² | m² | in² |
| Segundo momento de área (momento de inercia) | m⁴, cm⁴, mm⁴, ft⁴, in⁴ | m⁴ | in⁴ |
| Masa | kg, lb | kg | lb |
| Fuerza | N, kN, MN, kgf, Tonf, lbf, kip | kN | kip |
| Momento flector | Nmm, Nm, kNm, MNm, Tonf·m, lbf·in, lbf·ft, kip·in, kip·ft | kNm | kip·ft |
| Presión (E, G) | Pa, kPa, MPa, GPa, ksc, psi, ksi, psf, ksf | MPa | ksi |
| Temperatura | °C, °F | °C | °F |

Algunas unidades se deducen de las demás:

- Las **cargas lineales** son fuerza por longitud: kN/m en el SI, kip/ft en unidades estadounidenses.
- La **densidad** es masa por longitud³: kg/m³ o lb/ft³.
- La **dilatación térmica** sigue a la temperatura: 1/K o 1/°F. Las cargas térmicas son *variaciones* de temperatura, así que 10 °C equivalen a 18 °F.
- Los **giros** están siempre en radianes, y los ángulos de los apoyos, en grados.

Tonf es la tonelada-fuerza métrica (1000 kgf), no la tonelada corta estadounidense. Las unidades estadounidenses usan sus definiciones exactas: 1 ft = 0,3048 m, 1 kip = 4448,2216 N. Escribe los pies con decimales, como `5,5`; las reglas y la cruceta muestran pies y pulgadas (5′-6″).

## Ajustes del visor {#viewer-settings}

El aspecto del dibujo. La **Vista previa** de la derecha es una pequeña viga inclinada que muestra al instante cada cambio; los botones de debajo eligen qué resultado muestra, y al cambiar un ajuste de los diagramas o un color, la vista previa pasa a ese resultado.

![Configuración → Ajustes del visor, con la vista previa en directo y los ajustes de los diagramas a la derecha](/screenshots/es/b-settings-viewer.webp)

La columna de la izquierda, de arriba abajo:

- *Cuadrícula*: **Mostrar cuadrícula** (<kbd>G</kbd>) dibuja la cuadrícula y las reglas; **Ajustar a la cuadrícula** (<kbd>S</kbd>) hace que los nodos que colocas o arrastras caigan en ella; **Mostrar cruceta** marca en las reglas la posición del puntero (con ratón). Las tres opciones están activadas al principio. El **Paso de ajuste a la cuadrícula** es de 0,1 m, o de 0,5 ft en unidades estadounidenses. Al cambiar entre unidades métricas y estadounidenses, un paso que sigue en su valor predeterminado pasa al predeterminado del otro sistema; un paso que hayas fijado tú se conserva.
- *Tamaños*: **Escala de resultados**, de 8 a 120 px (48 px al principio), es la altura con la que se dibuja la mayor ordenada de un diagrama, o la mayor flecha; es un ajuste puramente visual, porque cada diagrama se escala con su propio valor máximo. **Tamaño de apoyos** va del 50 al 150 % (100 %), y **Tamaño de fuente**, de 10 a 20 px (14 px); con un proyector conviene aumentarlos.
- *Orientación de las etiquetas de resultados*: los valores se escriben en la dirección de la ordenada, *Perpendicular al diagrama* (la opción predeterminada), o *Siempre horizontales*.
- *Comprobación del modelo*: **Mostrar cómo puede moverse una estructura inestable** dibuja el contorno discontinuo del mecanismo, y **Animar el movimiento** lo hace oscilar de un lado a otro. Ambas están activadas al principio.

### Diagramas de esfuerzos internos {#internal-force-diagrams}

Cada escuela dibuja los diagramas a su manera, así que EduBeam te deja elegir. Estos ajustes solo cambian el dibujo, nunca los valores. La **línea discontinua** a lo largo de cada elemento marca sus fibras inferiores, el lado hacia el que apunta su eje z local (consulta [Orientación del elemento](/es/essentials/elements#element-direction)).

| Ajuste | Opciones | Predeterminado |
| --- | --- | --- |
| **Momento flector** | dibujado en el *Lado traccionado* o en el *Lado comprimido* | *Lado traccionado* |
| **Fuerza cortante positiva** | dibujada en el *Lado opuesto* a la línea discontinua o en el *Lado discontinuo* | *Lado opuesto* |
| **Fuerza normal positiva** | *Lado opuesto* o *Lado discontinuo* | *Lado opuesto* |
| **Relleno** | *Sólido*, *Rayado* (líneas transversales a la barra, como a mano) o *Ninguno* | *Sólido* |
| **Grado de cada tramo** | escribe el grado del polinomio, de 0° a 3°, en cada tramo de un diagrama | desactivado |

En [Resultados y diagramas](/es/essentials/results#reading-the-sign) se explica cómo leer los signos.

### Colores {#colors}

Colores independientes para nodos, elementos, cargas, deformada, esfuerzo axil, esfuerzo cortante, momento flector y reacciones. Haz clic en una muestra para elegir un color. Por defecto: cargas en naranja, deformada en gris, N en azul, V en verde, M en rojo, reacciones en morado, y nodos y elementos en negro.

## Controles y atajos {#controls-shortcuts}

**Desplazar con** define con qué botón del ratón se arrastra el lienzo: *Rueda o botón derecho del ratón* (la opción predeterminada), *Rueda del ratón* (pulsa la rueda y arrastra) o *Botón derecho*. Todos los atajos están en la página [Teclado, ratón y pantalla táctil](/es/reference/shortcuts).

## Qué se guarda en tu navegador {#what-is-stored-in-your-browser}

Además de la configuración, EduBeam guarda en el almacenamiento local del navegador:

- el **modelo actual**, guardado tras cada cambio, de modo que al recargar la pestaña o volver a abrir la aplicación lo recuperas;
- **Estructuras recientes**: los 10 últimos modelos que limpiaste o reemplazaste, listos para restaurarlos desde el menú ☰.

Ambos pertenecen a este navegador en este dispositivo, y si borras los datos del sitio, se eliminan. Para conservar un modelo o llevarlo a otro dispositivo, usa [Guardar proyecto o Compartir modelo](/es/essentials/import-export).
