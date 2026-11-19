---
description: "Dibuja elementos viga en EduBeam, libera sus extremos con rótulas para modelar articulaciones y barras de celosía, y define materiales y secciones desde las bibliotecas o con tu propio polígono."
source: site
---

# Elementos, materiales y secciones

En [EduBeam]{.edubeam}, cada elemento es una viga entre dos nodos, con un material y una sección. Dibuja los elementos entre nodos, libera sus extremos con rótulas allí donde la estructura tiene articulaciones, y elige materiales y secciones de las bibliotecas o define los tuyos.

## El elemento viga {#the-beam-element}

Hay un único tipo de elemento: una **viga de Timoshenko 2D** en el plano x–z, con tres grados de libertad en cada extremo (`Dx`, `Dz`, `Ry`). Transmite esfuerzo axil, esfuerzo cortante y momento flector, e incluye la [deformación por cortante](#shear-deformation). Una barra de celosía es el mismo elemento con [los dos extremos articulados](#end-hinges). La formulación está en el [manual teórico](/es/elements/beam).

Los resultados a lo largo de un elemento son exactos para el modelo lineal, así que **basta un elemento por barra**. Añade un nodo dentro de una barra solo donde necesites un apoyo, una rótula, un cambio de sección o un punto en el que leer desplazamientos. Una carga puntual no lo necesita: una [carga concentrada](/es/essentials/loads#concentrated-load) puede estar en cualquier punto del elemento.

## Añadir elementos {#adding-elements}

Un elemento necesita un material y una sección, así que añádelos antes (consulta [Materiales](#materials) y [Secciones](#cross-sections)). Mientras no haya ninguno, el visor muestra *No hay materiales definidos.* o *No hay secciones definidas.*, con un botón **Añadir**.

- **Eligiendo los nodos.** Pestaña *Elementos* → **Añadir elemento** (el botón con el icono **+**), o clic derecho en el lienzo → *Añadir elemento*. Elige el **Nodo inicial** y el **Nodo final**, marca **Rótula** debajo de cualquiera de ellos si hace falta, y elige el **Material** y la **Sección transversal**. Hacen falta al menos dos nodos.
- **Con clics.** Pestaña *Elementos* → **Añadir elemento** (el botón con el icono de cursor), o mantén pulsada <kbd>Ctrl</kbd> al elegir *Añadir elemento* en el menú del lienzo. Haz clic en un nodo (o en el lienzo vacío, lo que crea uno) y luego en el siguiente; sigue haciendo clic para dibujar una cadena de elementos y pulsa <kbd>Esc</kbd> o **Cancelar** para terminar. La franja superior define la **Rótula al inicio** y la **Rótula al final** de cada elemento que dibujas. Los elementos reciben el primer material y la primera sección del modelo.

![El diálogo Añadir elemento](/screenshots/es/qs-element.webp){.shot-md}

## Orientación del elemento {#element-direction}

Cada elemento tiene sus propios **ejes locales**. El eje x local va del **nodo inicial** al **nodo final**; el eje z local es el x local girado 90° en sentido horario en pantalla. En un elemento dibujado de izquierda a derecha, los ejes locales coinciden con los globales. La **línea discontinua** dibujada a lo largo de cada elemento marca su lado +z local, las «fibras inferiores».

![Un pórtico dibujado A → B → C → D: las líneas discontinuas de los tres elementos quedan dentro del pórtico](/screenshots/es/p2b-element-direction.webp){.shot-md}

En este pórtico, el elemento 1 sube de A a B, así que su eje z local, y su línea discontinua, apuntan a la derecha; el elemento 3 baja de C a D, así que su línea discontinua queda a la izquierda. Dibujado así, todas las líneas discontinuas de un pórtico quedan en el interior.

La orientación importa para:

- las cargas dadas en ejes locales (**LCS** marcado), consulta [Cargas de elemento](/es/essentials/loads#element-loads);
- la **Posición de carga desde el nodo inicial** de una carga concentrada;
- el orden de las [fuerzas de extremo](/es/elements/conventions#end-forces-element-results-table) en los resultados: `X12, Z12, M12` en el nodo inicial y `X21, Z21, M21` en el nodo final;
- cuál es el «lado discontinuo» en los [ajustes de los diagramas](/es/essentials/units-settings#viewer-settings).

Para invertir un elemento, pulsa **Intercambiar nodos** (las flechas entre los dos nodos en la tabla *Elementos*).

## Rótulas de extremo {#end-hinges}

Una rótula de extremo libera el momento flector en un extremo del elemento: allí el momento es nulo y el extremo puede girar independientemente del nodo.

- **Una rótula** introduce una articulación dentro de una viga o de un pórtico.
- **Dos rótulas** convierten el elemento en una **barra de celosía**, que solo transmite esfuerzo axil.

Márcalas en cualquiera de estos sitios:

- la columna **Rótulas de extremo** de la tabla *Elementos*, con una casilla para cada extremo;
- las casillas **Rótula** del diálogo **Añadir elemento**, o del panel del elemento → **Editar elemento**;
- **Rótula al inicio** y **Rótula al final** en la franja superior, al dibujar con el ratón.

![La tabla Elementos de un pórtico triarticulado: el elemento 2 tiene una rótula en su final, en el nodo C](/screenshots/es/elements-table.webp)

### Una rótula: una articulación dentro de la estructura {#one-hinge-a-pin-inside-the-structure}

La misma viga continua de dos vanos de 5 m con una carga de 10 kN/m. A la derecha, el elemento 1 tiene una rótula en su final, en B: el momento sobre el apoyo se anula y cada vano trabaja como una viga biapoyada.

::div{.shots}

:::model-figure{caption="Continua: M = −31,25 kNm sobre B"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M]
show: [nodeLabels]
---
:::

:::model-figure{caption="Con rótula en B: M = 0 sobre B, 31,25 kNm en cada vano"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [{ nodes: [A, B], hinges: [false, true] }, [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M]
show: [nodeLabels]
---
:::

::

A mano: en la viga continua, $M_B = -qL^2/8 = -31{,}25\ \text{kNm}$ y como máximo $9qL^2/128 = 17{,}58\ \text{kNm}$ en cada vano; con la rótula, $M_B = 0$ y $M_{max} = qL^2/8 = 31{,}25\ \text{kNm}$ en el centro de cada vano. La rótula descarga el apoyo, pero casi duplica los momentos en los vanos. Si quieres resolver a mano una viga con una rótula interior y comprobar tus respuestas mientras las escribes, prueba el [problema G2048](/es/practice?p=G2048).

### Dos rótulas: una barra de celosía {#both-hinges-a-truss-bar}

Una ménsula de pared formada por dos barras, ambas articuladas en los dos extremos, que soporta 20 kN en B. Las barras solo transmiten esfuerzo axil, y el diagrama de momentos queda vacío.

::model-figure{caption="Tirante AB: N = +26,67 kN (tracción); puntal CB: N = −33,33 kN (compresión)"}
---
nodes: { A: [0, 0], B: [4, 0], C: [0, 3] }
supports: { A: pin, C: pin }
members: [{ nodes: [A, B], hinges: [true, true] }, { nodes: [C, B], hinges: [true, true] }]
loads:
  - { node: B, fz: 20 }
results: [N, M]
show: [nodeLabels]
---
::

A mano: el puntal mide 5 m y sube 3 m, así que $N_{CB} = -20 \cdot 5/3 = -33{,}33\ \text{kN}$, y el tirante equilibra su componente horizontal, $N_{AB} = 33{,}33 \cdot 4/5 = 26{,}67\ \text{kN}$. El [tutorial de la celosía plana](/es/tutorials/truss) construye así una celosía completa, y en [Problemas para practicar](/es/practice?p=T2048) hay celosías para resolver a mano.

### La rótula es del elemento, no del nodo {#hinge-the-element-not-the-node}

Una rótula pertenece a un extremo de un elemento: deja que ese extremo gire por su cuenta, mientras todos los demás elementos que llegan al nodo siguen unidos a él rígidamente. Así, donde se encuentran dos barras, una rótula basta para formar una articulación; donde se encuentran varias, articula todas menos una. En un nudo de celosía, donde todas las barras son barras de celosía, todas están articuladas.

Un nodo en el que todos los elementos están articulados no tiene rigidez al giro. EduBeam lo admite y da su giro como 0. Si las rótulas convierten la estructura en un mecanismo, EduBeam las rodea con un círculo y muestra cómo se mueve; consulta [Solución de problemas](/es/reference/troubleshooting#messages).

## Editar y eliminar {#editing-and-deleting}

| Para | Haz esto |
| --- | --- |
| Cambiar nodos, rótulas, material o sección | Haz clic en el elemento → **Editar elemento**, o edítalo en la tabla *Elementos*. |
| Invertirlo | **Intercambiar nodos** en la tabla *Elementos*. |
| Renombrarlo | Escribe una etiqueta nueva en la columna *Elemento*. |
| Ver su matriz de rigidez | Haz clic en él → **Matriz de rigidez**, o el botón de la matriz en la columna *Acciones*. Una ventana muestra la matriz 6 × 6 del elemento en ejes globales, en unidades SI (N y m) sean cuales sean las unidades que muestres, con las rótulas de extremo ya condensadas. Muy útil para comprobar un ensamblaje hecho a mano. |
| Eliminarlo | Haz clic en él → **Eliminar**, la × de la tabla, o selecciónalo y pulsa <kbd>Supr</kbd>. Sus cargas se eliminan con él. |

![El panel de un elemento](/screenshots/es/ui-element-menu.webp){.shot-xs}

## Materiales {#materials}

Pestaña *Materiales* → **Añadir material**, o **Biblioteca de materiales** para uno ya preparado. Muchos elementos pueden compartir un mismo material; al cambiarlo se actualizan todos.

| Campo | Unidad | Para qué sirve |
| --- | --- | --- |
| Módulo de Young $E$ | MPa | Rigidez axil y a flexión, $EA$ y $EI_y$. Acero 210 000 MPa, hormigón unos 30 000 MPa, madera unos 11 000 MPa. |
| Módulo de cortante $G$ | MPa | Rigidez a cortante $kGA$. Salvo que la $k$ de la sección sea enorme, añade [deformación por cortante](#shear-deformation): flechas mayores y, en una estructura hiperestática, esfuerzos distintos. $G = E/(2(1+\nu))$: acero unos 81 000 MPa. |
| Densidad $\rho$ | kg/m³ | Se guarda con el material, pero no se usa: no hay carga de peso propio. |
| Coeficiente de dilatación térmica $\alpha$ | 1/K | Lo usan las [cargas térmicas](/es/essentials/loads#temperature-load). Acero $12 \times 10^{-6}$ 1/K. |

Estas son las unidades SI por defecto; siguen tu [configuración](/es/essentials/units-settings#units), así que en unidades estadounidenses E y G están en ksi, la densidad en lb/ft³ y α en 1/°F.

Un material nuevo empieza con $E$ = 210 000 MPa, $G$ = 87 500 MPa ($E/2{,}4$, es decir, $\nu = 0{,}2$), $\rho$ = 1000 kg/m³ y $\alpha = 12 \times 10^{-6}$ 1/K; en unidades estadounidenses empieza como acero ASTM A992. Para el acero, cambia $G$ a 81 000 MPa o elige un acero de la biblioteca.

![El diálogo Añadir material](/screenshots/es/qs-material.webp){.shot-md}

La **Biblioteca de materiales** (también *O elegir de la biblioteca* en el diálogo Añadir material) muestra primero los materiales métricos (EN), o primero los estadounidenses (aceros ASTM, hormigón ACI) cuando tus longitudes están en pies o pulgadas. El **+** de una fila añade ese material, con su nombre:

| Familia | Materiales |
| --- | --- |
| Metales | Acero S235, S275, S355; acero inoxidable 304, 316; fundición; aluminio 6061-T6, 7075-T6, 5083; cobre, latón, bronce; titanio Grade 2 y Ti-6Al-4V; aceros estadounidenses ASTM A992, A36, A572 Gr. 50 y HSS A500 Gr. C |
| Hormigón | C25/30, C30/37, C40/50, ligero; estadounidense $f'_c$ = 4 ksi y 5 ksi |
| Madera | C24, GL24h, GL32h |
| Otros | Vidrio, GFRP, CFRP, HDPE, PVC, PMMA, policarbonato |

Un material que todavía usan algunos elementos no se puede eliminar: asigna antes otro material a esos elementos.

## Secciones {#cross-sections}

Pestaña *Secciones* → **Añadir sección**, **Biblioteca de secciones**, o **Sección poligonal** para dibujar tu propia forma. Como los materiales, las secciones pueden compartirlas muchos elementos.

| Campo | Unidad | Para qué sirve |
| --- | --- | --- |
| Área $A$ | m² | Rigidez axil $EA$ y área a cortante $kA$. |
| Momento de inercia $I_y$ | m⁴ | Rigidez a flexión $EI_y$, respecto al eje perpendicular al dibujo. |
| Altura $h$ | m | Solo la usan las cargas térmicas: la curvatura es $\alpha\,(\Delta T_b - \Delta T_t)/h$. |
| Coeficiente de cortante $k$ | – | El área eficaz a cortante es $kA$, así que la rigidez a cortante es $kGA$. Unos 0,83 para un rectángulo, $A_{alma}/A$ para una sección en I. |

Una sección nueva empieza con $A$ = 1 m², $I_y = 10^{-4}$ m⁴, $h$ = 1 m y $k$ = 1 (en unidades estadounidenses, un W12×26 con $k$ = 1). Sustitúyelos por los valores de tu sección, o elige una de la biblioteca.

::callout{type="tip" title="Obtener los resultados de un libro que desprecia la deformación por cortante"}
La mayoría de los cálculos a mano usan vigas de Euler–Bernoulli, sin deformación por cortante. Para obtener sus resultados, da a $k$ un valor muy grande, como `1e10`; los ejemplos de la aplicación y las figuras de este sitio usan `1e32`. Una sección nueva ($k = 1$), la biblioteca y el editor de polígonos incluyen todos la deformación por cortante; [más abajo](#shear-deformation) verás cuánto cambia.
::

La **Biblioteca de secciones** da valores aproximados para:

| Familia | Secciones | $k$ |
| --- | --- | --- |
| Macizas | Rectángulos, cuadrados, círculos | 0,833 (rectángulo), 0,9 (círculo) |
| Perfiles en I | IPE 100, IPE 200, HEA 100, HEA 200; perfiles W de AISC, de W8×31 a W36×150 | $h\,t_w/A$, el alma |
| Tubos rectangulares | RHS 100×50×3, 150×100×5; HSS de AISC | $2ht/A$, las dos almas |
| Tubos circulares | CHS Ø60×3, Ø114×5; HSS circulares de AISC | 0,5 |

Comprueba los valores de la biblioteca con una tabla de perfiles antes de fiarte de ellos.

![La Biblioteca de secciones](/screenshots/es/sections-library.webp){.shot-lg}

Para una comprobación rápida a mano: un rectángulo $b \times h$ tiene $A = bh$ e $I_y = bh^3/12$; un círculo macizo de diámetro $d$ tiene $A = \pi d^2/4$ e $I_y = \pi d^4/64$.

### Deformación por cortante: cuándo importan G y k {#shear-deformation}

La rigidez a cortante $kGA$ entra en el elemento a través del [parámetro de cortante](/es/elements/beam#timoshenko-or-euler-bernoulli) $\Phi = 12EI_y/(kGAL^2)$. Con una $k$ muy grande, $\Phi = 0$ y el elemento es una viga de Euler–Bernoulli, así que $G$ no influye. Con una $k$ real, la deformación por cortante siempre aumenta las flechas. En una estructura isostática los esfuerzos no cambian; en una hiperestática cambian también, porque las incógnitas hiperestáticas dependen de la rigidez.

Cuánto cambian depende de la esbeltez de la barra. Un IPE 200 de la biblioteca ($k = h\,t_w/A = 0{,}393$) de acero S235 ($G$ = 81 000 MPa), con 10 kN/m, comparado con la misma viga con $k$ = `1e32`:

| Viga | Con deformación por cortante | Euler–Bernoulli |
| --- | --- | --- |
| Biapoyada, $L$ = 2 m ($L/h$ = 10): flecha en el centro del vano | 0,566 mm | 0,511 mm |
| Empotrada y apoyada, $L$ = 2 m: momento en el empotramiento | −4,84 kNm | −5,00 kNm |
| Biapoyada, $L$ = 6 m ($L/h$ = 30): flecha en el centro del vano | 41,85 mm | 41,36 mm |

A mano: la parte de la flecha en el centro del vano debida al cortante es $qL^2/(8kGA)$, 0,055 mm en la viga corta, un 11 % más que la parte debida a la flexión, $5qL^4/(384EI_y)$. En la viga empotrada y apoyada, el momento de empotramiento baja de $qL^2/8$ a $(qL^2/8)/(1 + \Phi/4)$. Con $L/h$ = 30, ambos efectos rondan el 1 % o menos; por eso los pórticos esbeltos coinciden con las soluciones de los libros sea cual sea $k$.

### Secciones poligonales {#polygonal-sections}

Pestaña *Secciones* → **Sección poligonal**, o *O definir una forma poligonal* en el diálogo Añadir sección, abre un editor de formas que calcula por ti las propiedades de la sección.

![El editor de secciones poligonales con la plantilla de sección en I, sus ejes principales y la elipse de inercia](/screenshots/es/sections-polygon.webp)

::div{.steps}

### Empieza con una plantilla {#start-from-a-preset}

Elige una **Plantilla** (rectángulo, sección en I, sección en T, sección en L, perfil en U, rectangular hueca, círculo, circular hueca), define sus dimensiones y pulsa **Aplicar**.

### Ajusta la forma {#adjust-the-shape}

Arrastra los vértices (se ajustan al **Paso de ajuste**), haz clic en el punto medio de un lado para insertar un vértice, o haz doble clic en un vértice para eliminarlo. También puedes escribir las coordenadas en la tabla **Vértices**. **Añadir hueco** añade un contorno interior, y **Centrar en el centro de gravedad** mueve la forma para que su centro de gravedad quede en el origen.

### Lee las propiedades {#read-the-properties}

La pestaña **Propiedades de la sección** muestra $A$, el centro de gravedad, $I_y$, $I_z$, $I_{yz}$ respecto al centro de gravedad, los momentos principales $I_1$, $I_2$ con el **Ángulo de los ejes principales** $\alpha$ (de $y$ al eje 1) y los radios de giro. El dibujo muestra los ejes principales y la elipse de inercia.

### Añádela {#add-it}

Revisa la **Etiqueta** y el **Coeficiente de cortante** $k$: empieza en 0,833, el valor correcto para un rectángulo; una sección en I necesita aproximadamente $A_{alma}/A$. Después pulsa **Añadir sección** (**Guardar** si editas una forma existente). $A$, $I_y$ y $h$ salen de la forma y en la tabla son de solo lectura; para cambiarlos, vuelve a editar la forma con el botón del polígono en la columna *Acciones*.

::

Las coordenadas de la sección son locales y dextrógiras: $x$ sale de la pantalla, $y$ apunta a la izquierda y $z$ hacia abajo.

Si la forma no es simétrica respecto al plano del pórtico (un angular en L, por ejemplo), el editor te avisa: un análisis 2D solo es exacto si la barra está impedida frente al desplazamiento lateral y a la torsión en toda su longitud, por ejemplo por una losa. Cuando $I_{yz}$ es significativo, eliges la rigidez a flexión: **restringida lateralmente y a torsión en toda su longitud** ($I_y$) o **libre de desplazarse lateralmente**, que es menor. La torsión no se incluye en ningún caso.
