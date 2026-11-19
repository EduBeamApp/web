---
description: "Crea y edita nodos en EduBeam, ajústalos a la cuadrícula, divide elementos y elige el apoyo: articulación, rodillo, empotramiento, deslizadera o uno inclinado."
source: site
---

# Nodos y apoyos

Los nodos son los puntos del modelo: los elementos los unen, y sobre ellos se colocan los apoyos y las cargas nodales. Colócalos escribiendo sus coordenadas o con clics, y después da a los nodos apoyados el apoyo que corresponde a tu dibujo.

## Coordenadas {#coordinates}

Cada nodo tiene una coordenada **X** y una **Z** en la [unidad de longitud](/es/essentials/units-settings#units) actual. X apunta a la derecha y **Z hacia abajo**, de modo que todo lo que está por encima del suelo tiene Z negativa: un pilar de 4 m de altura va de `Z = 0` a `Z = −4`.

::model-figure{caption="Un pórtico de 6 m de ancho y 4 m de alto: A y D están en Z = 0, B y C en Z = −4"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: fixed, D: fixed }
members: [[A, B], [B, C], [C, D]]
results: []
show: [nodeLabels, dimensions]
---
::

Si prefieres que el eje vertical apunte hacia arriba, cambia a [ejes con y hacia arriba](/es/elements/conventions#y-up-axes) en la configuración. Solo cambia la representación; el modelo y sus archivos siguen siendo los mismos.

## Añadir nodos {#adding-nodes}

- **Escribiendo.** Pestaña *Nodos* → **Añadir nodo** (el botón con el icono **+**), o clic derecho en el lienzo → *Añadir nodo*. Escribe X y Z y, si quieres, los apoyos y el ángulo del apoyo.
- **Con clics.** Pestaña *Nodos* → **Añadir nodo** (el botón con el icono de cursor), o mantén pulsada <kbd>Ctrl</kbd> al elegir *Añadir nodo* en el menú del lienzo. Cada clic coloca un nodo; pulsa <kbd>Esc</kbd>, **Cancelar** o de nuevo el botón para terminar.
- **Al dibujar elementos.** Cuando [dibujas elementos con el ratón](/es/essentials/elements#adding-elements), un clic en el lienzo vacío crea allí un nodo.
- **Copiando.** Selecciona nodos (y elementos), pulsa <kbd>Ctrl</kbd>+<kbd>C</kbd> y <kbd>Ctrl</kbd>+<kbd>V</kbd>, y haz clic donde deba ir la copia, o escribe un desplazamiento Δx, Δz en la franja superior y pulsa **Pegar**.

::div{.shots}

![El diálogo Añadir nodo](/screenshots/es/qs-node.webp)

![En el modo de ratón, la franja superior define los apoyos y el ángulo de cada nodo que colocas](/screenshots/es/nodes-add-banner.webp)

::

Los nodos nuevos reciben el siguiente número libre: `1`, `2`, `3`, … Puedes renombrarlos en la columna *Nodo* de la tabla, por ejemplo `A`, `B`, `C`.

### Ajuste a la cuadrícula {#snapping}

Con **Ajustar a la cuadrícula** activado (pulsa <kbd>S</kbd> o el botón **S** abajo a la derecha del visor), los nodos que colocas o arrastras caen en la cuadrícula. El paso es de 0,1 m por defecto, o de 0,5 ft en unidades estadounidenses; cámbialo en [Configuración → Ajustes del visor → Cuadrícula](/es/essentials/units-settings#viewer-settings). Para cualquier otra posición, escribe las coordenadas exactas en la tabla.

### Colocar un nodo sobre un elemento existente {#placing-a-node-on-an-existing-element}

Si al añadir nodos con el ratón haces clic sobre un elemento (o muy cerca de él), EduBeam te pregunta qué quieres hacer:

- **Conectar a la estructura** divide el elemento en dos, `1a` y `1b`, unidos en el nuevo nodo. Es la forma más rápida de añadir un apoyo intermedio o un punto donde aplicar una carga. Las rótulas de los extremos exteriores se quedan donde estaban. Las cargas uniformes y trapezoidales se reparten entre las dos mitades. Las cargas puntuales y térmicas pasan todas a la primera mitad, `1a`: en la tabla *Cargas*, pasa a `1b` la carga puntual que quedaba más allá del nuevo nodo (su posición se mide ahora desde el nuevo nodo) y da a `1b` su propia carga térmica.
- **Colocar nodo independiente** pone el nodo sobre el elemento sin conectarlo.

En ambos casos, la colocación de nodos termina ahí; vuelve a hacer clic en el botón del cursor para colocar más.

## Editar nodos {#editing-nodes}

| Para | Haz esto |
| --- | --- |
| Mover un nodo | Arrástralo en el visor (en pantalla táctil, púlsalo y arrástralo) o escribe X y Z en la tabla *Nodos*. Los elementos conectados, sus cargas y las líneas de cota lo siguen. |
| Renombrarlo | Escribe una etiqueta nueva en la columna *Nodo*. |
| Cambiar sus apoyos | Haz clic en él → **Apoyos del nodo**, o usa la columna *Grados de libertad restringidos*. Consulta [Apoyos](#supports). |
| Editarlo todo a la vez | El lápiz de la columna *Acciones* abre **Editar nodo**: coordenadas, apoyos y ángulo del apoyo, con una vista previa del símbolo. |
| Eliminarlo | La × de la tabla, **Eliminar** en el panel del nodo, o selecciónalo y pulsa <kbd>Supr</kbd>. Con él se eliminan también los elementos, las cargas y las líneas de cota conectados a él. |

Todos los cambios se pueden deshacer con <kbd>Ctrl</kbd>+<kbd>Z</kbd>.

## Apoyos {#supports}

Cada nodo puede moverse de tres maneras, sus **grados de libertad** (GDL): `Dx` según x, `Dz` según z y `Ry`, un giro en el plano del dibujo. Un apoyo **restringe** algunos de ellos.

Los ocho apoyos son las ocho combinaciones posibles de los tres. Lee la tabla por filas: en la columna central el nodo gira libremente; en la de la derecha, además, tiene impedido el giro.

| Traslaciones impedidas | Gira libremente | Además, giro impedido |
| --- | --- | --- |
| **Ambas** (`Dx` y `Dz`) | ![](/screenshots/es/b-support-pin.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Articulación** | ![](/screenshots/es/b-support-fixed.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Empotramiento** |
| **Solo la vertical** (`Dz`): se desliza en horizontal | ![](/screenshots/es/b-support-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Rodillo** | ![](/screenshots/es/b-support-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Deslizadera** |
| **Solo la horizontal** (`Dx`): se desliza en vertical | ![](/screenshots/es/b-support-vertical-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Rodillo vertical** | ![](/screenshots/es/b-support-vertical-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Deslizadera vertical** |
| **Ninguna**: se desliza en ambas direcciones | ![](/screenshots/es/b-support-free.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Libre** (sin apoyo) | ![](/screenshots/es/b-support-rotation-only.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Solo giro impedido** |

Para cada GDL restringido EduBeam calcula una **reacción**: `Dx` da una fuerza horizontal $R_x$, `Dz` una fuerza vertical $R_z$ y `Ry` un momento $M$. Así, una articulación da $R_x$ y $R_z$, un rodillo solo $R_z$, una deslizadera $R_z$ y $M$, y un empotramiento las tres.

### Definir un apoyo {#setting-a-support}

Elige el símbolo o marca los GDL uno a uno; ambos siempre coinciden. Los encontrarás en tres sitios:

- en el panel del nodo (haz clic en el nodo) → **Apoyos del nodo**, junto con el **Ángulo del SCL nodal**, como en la imagen;
- en los diálogos **Añadir nodo** y **Editar nodo**;
- en la columna *Grados de libertad restringidos* de la tabla *Nodos*, donde el símbolo es un pequeño menú y `Dx`, `Dz`, `Ry` son casillas.

![Apoyos del nodo en el panel del nodo: los símbolos, las casillas de los GDL y el ángulo del apoyo](/screenshots/es/nodes-support-picker.webp){.shot-lg}

Pasa el ratón por encima de un símbolo para ver su nombre.

### ¿Rodillo o deslizadera? {#roller-or-slider}

Los dos van sobre un carril y se deslizan a lo largo de él. La diferencia está en el giro:

- un **rodillo** es una articulación sobre un carril: el extremo **gira libremente**, así que allí no hay momento;
- una **deslizadera** es un empotramiento sobre un carril: el extremo **no puede girar**, así que el apoyo resiste un momento.

La misma viga de 6 m con una carga de 10 kN/m, en la que solo cambia el apoyo de la derecha. Alterna entre la deformada y el momento flector:

::div{.shots}

:::model-figure{caption="Articulación y rodillo: el extremo derecho gira libremente; allí M = 0, y cada apoyo recibe 30 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

:::model-figure{caption="Articulación y deslizadera: el extremo derecho se mantiene horizontal; allí M = −45 kNm, y la deslizadera recibe 37,5 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: slider }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

::

La primera es una viga biapoyada ($M_{max} = qL^2/8 = 45\ \text{kNm}$ en el centro del vano). Con carga vertical, la deslizadera actúa exactamente como un empotramiento, así que la segunda es una viga empotrada y apoyada ($R_B = 5qL/8 = 37{,}5\ \text{kN}$, $M_B = -qL^2/8 = -45\ \text{kNm}$). Mantener horizontal el extremo también rigidiza la viga: la flecha máxima baja de 9,617 mm a 4 mm. La deslizadera solo se diferencia de un empotramiento cuando algo empuja en la dirección de su carril.

### Apoyos inclinados (girados) {#inclined-skewed-supports}

Un apoyo sobre una pendiente restringe el nodo según unos ejes girados. Define el **Ángulo del SCL nodal** α, en grados de −180 a 180, en el panel del nodo dentro de *Apoyos del nodo*, en los diálogos Añadir nodo y Editar nodo, o en el campo **α** de la tabla *Nodos*.

Los ejes del nodo giran α y los GDL marcados actúan según ellos. α gira x hacia z, es decir, en **sentido horario** en pantalla (con el eje y hacia arriba, gira x hacia y, en sentido antihorario). Así, un rodillo sobre una superficie que baja 30° hacia la derecha es un rodillo con α = 30°. El símbolo gira con los ejes, y la reacción se da según ellos.

::model-figure{caption="Rodillo en B girado α = 30°: su reacción de 34,64 kN es perpendicular a la pendiente, y la viga trabaja con N = +17,32 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [N, M]
show: [nodeLabels]
---
::

Es la misma viga de antes, 6 m con 10 kN/m, pero ahora su rodillo está sobre una pendiente de 30°. La componente vertical de la reacción en B sigue siendo $qL/2 = 30\ \text{kN}$, así que la reacción vale $30/\cos 30° = 34{,}64\ \text{kN}$, y su componente horizontal, $30 \tan 30° = 17{,}32\ \text{kN}$, empuja el nodo B hacia la derecha. La articulación de A lo retiene, de modo que la viga queda traccionada. El momento flector no cambia.

Las [cargas nodales](/es/essentials/loads#nodal-loads) en un nodo girado pueden darse en ejes globales o en los ejes del nodo; un [desplazamiento impuesto](/es/essentials/loads#prescribed-displacements-support-settlements) actúa siempre según los ejes propios del apoyo.

### Estabilidad {#stability}

Una estructura plana necesita al menos **tres GDL restringidos**, dispuestos de forma que realmente la sujeten. Mientras falten apoyos, el visor muestra el aviso azul **Faltan apoyos**. Si hay suficientes pero no pueden sujetar la estructura (todos paralelos, o todos concurrentes en un punto), o si las rótulas permiten que las barras giren unas respecto a otras, un mensaje rojo indica el problema y un contorno discontinuo muestra cómo se mueve la estructura. En [Solución de problemas](/es/reference/troubleshooting#messages) se explica cada mensaje.

## Cargas nodales y asientos {#nodal-loads-and-settlements}

Haz clic en un nodo → **Añadir carga** para una fuerza o un momento, o → **Imponer desplazamiento** para mover un apoyo una cantidad dada (un asiento). Ambos se explican en [Cargas nodales](/es/essentials/loads#nodal-loads).

## Líneas de cota {#dimension-lines}

Las líneas de cota indican longitudes en el dibujo. No influyen en el cálculo, pero se guardan con el proyecto, van incluidas en los enlaces para compartir y aparecen en las [imágenes exportadas](/es/essentials/import-export#export-an-image).

| Para | Haz esto |
| --- | --- |
| Añadir una | Clic derecho en el lienzo → **Añadir cota**, y luego haz clic en los dos extremos. Un punto cerca de un nodo se ajusta a él. |
| Acotar un elemento | Clic derecho en el elemento → **Acotar el elemento**. |
| Editarla o invertirla | Haz clic en la línea → **Editar** para escribir sus coordenadas, o **Invertir cota** para poner la etiqueta al otro lado. |
| Moverla | Arrástrala, o arrastra uno de sus extremos. Un extremo situado en un nodo queda ligado a él y lo sigue. |
