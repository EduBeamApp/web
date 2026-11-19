---
description: "Tutorial: una viga continua de dos vanos en EduBeam frente a dos vanos biapoyados, con asiento del apoyo central y el método de las fuerzas. Unos 25 minutos."
source: site
---

# Tutorial: viga continua y asiento de apoyo

Modela una viga continua de dos vanos, compárala con dos vanos biapoyados y después deja que su apoyo central asiente 10 mm. El equilibrio por sí solo no da las reacciones de esta viga, así que las comprobarás con el método de las fuerzas.

- **Tiempo:** unos 25 minutos. Es el último y el más completo de los cuatro tutoriales.
- **Necesitas:** EduBeam abierto en otra pestaña del navegador, en un equipo con ratón y teclado. Si no has usado EduBeam antes, haz primero el [Inicio rápido](/es/guide/quick-start) o alguno de los tutoriales anteriores.
- **Conocimientos previos:** el método de las fuerzas con una incógnita hiperestática, y las flechas en el centro del vano de una viga biapoyada: $5qL^4/(384EI)$ con carga uniforme y $FL^3/(48EI)$ con carga puntual.
- **Unidades:** SI. El botón de unidades, abajo a la derecha del visor, debe mostrar `m m² kN kNm MPa`. Si muestra pies y kips, haz clic en él y elige **SI (métrico)** en **Sistema de unidades**.

**Aprenderás a**

- ver qué aporta la continuidad: momentos y flechas menores que en vanos biapoyados,
- imponer un asiento de apoyo y leer los esfuerzos que provoca por sí solo,
- comprobar una viga hiperestática con el método de las fuerzas, y ver por qué una viga más rígida sufre más con un asiento.

::div{.actions}
[Abrir EduBeam ↗](https://run.edubeam.app/?lang=es){target="_blank"} [Ir a la comprobación a mano](#check-by-hand)
::

::model-figure{caption="La viga terminada: dos vanos de 6 m con 10 kN/m, antes del asiento"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels, dimensions]
---
::

## El problema {#the-problem}

- Dos vanos de $L = 6$ m: un apoyo articulado en el nodo 1 y apoyos móviles en los nodos 2 y 3.
- Una carga uniforme $q = 10$ kN/m en los dos vanos.
- Acero, con $E = 210$ GPa; $I_y = 8{,}356 \times 10^{-5}$ m⁴ (un IPE 300), de modo que $EI = 17\,547{,}6$ kNm².
- En la segunda parte, el apoyo central, el nodo 2, asienta $\Delta = 10$ mm.

**¿Es isostática?** Cuatro reacciones (dos en el nodo 1 y una en cada uno de los nodos 2 y 3) frente a tres ecuaciones de equilibrio: la viga es una vez hiperestática. La ecuación que falta sale de la deformación: el nodo 2 no se mueve, o se mueve exactamente $\Delta$.

## Crea el modelo {#model-it}

::div{.steps}

### Material y sección {#material-and-section}

1. Haz clic en **Limpiar estructura** en la barra superior, marca **Eliminar materiales** y **Eliminar secciones** y haz clic en **Confirmar**. Los nodos y los elementos vuelven a numerarse desde 1.
2. Pestaña **Materiales** → **Biblioteca de materiales** → **+** en la fila **Acero (S235)**; después cierra la biblioteca con **Cancelar**.
3. Pestaña **Secciones** → **Añadir sección**. Escribe `8,356e-5` en **Iy**, deja **Área**, **Altura** y **Coeficiente de cortante** en `1` y haz clic en **Añadir sección**.

Un área de 1 m² evita que la viga se deforme por cortante de forma apreciable, como supone el cálculo a mano. Esta vez $I_y$ influye también en los esfuerzos: verás dónde.

### Dibuja la viga {#draw-the-beam}

1. Pestaña **Elementos** → el segundo botón **Añadir elemento**, el del icono de cursor.
2. Haz clic en (0, 0), (6, 0) y (12, 0).
3. Pulsa <kbd>Esc</kbd> para dejar de dibujar y luego <kbd>F</kbd> para ajustar la vista.

Tres nodos y dos elementos. Comprueba las coordenadas en la tabla **Nodos**.

### Apoyos {#supports}

Haz clic en el nodo 1 → **Apoyos del nodo** → el símbolo **Articulación**. A los nodos 2 y 3 ponles el **Rodillo**.

### Carga {#load}

Pestaña **Cargas** → **Añadir carga de elemento** → *Carga uniformemente distribuida* en **Elemento** `1`, `fz = 10` → **Añadir carga de elemento**. Repite con el elemento 2.

::

## Resultados {#results}

El momento flector, las reacciones y la deformada están activados desde el principio. Para ver el cortante, marca **V<sub>z</sub> (x)** en las opciones de visualización, arriba a la derecha del visor (el engranaje las muestra y las oculta). EduBeam rotula los diagramas y las reacciones en kN y kNm con dos decimales.

- Las reacciones marcan `22,50` en los nodos 1 y 3, y `75,00` en el nodo 2: el apoyo central recibe más de la mitad de los 120 kN.
- El momento sobre el nodo 2 marca `-45,00`, negativo (tracción arriba). En los vanos, el momento positivo llega como máximo a `25,31` kNm, a 2,25 m de los apoyos extremos.
- El cortante salta de `-37,50` a `37,50` sobre el nodo 2.

### Comparación con dos vanos biapoyados {#compare-with-two-simple-spans}

¿Qué aporta la continuidad? Elimínala: en la tabla **Elementos**, marca la rótula **final** del elemento 1, en el nodo 2. La viga se convierte en dos vanos biapoyados de 6 m, una estructura isostática.

::model-figure{caption="Con una rótula sobre el nodo 2: dos vanos biapoyados, cada uno con qL²/8 = 45 kNm"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [{ nodes: [1, 2], hinges: [false, true] }, [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, w]
show: [nodeLabels]
---
::

| | Continua | Dos vanos biapoyados |
| --- | --- | --- |
| Reacciones en los nodos 1, 2, 3 | 22,5; 75; 22,5 kN | 30; 60; 30 kN |
| Momento sobre el nodo 2 | −45 kNm | 0 |
| Máximo momento positivo | 25,31 kNm | 45 kNm |
| Flecha máxima, en la vista $w(x)$ de las figuras | 4,000 mm | 9,617 mm |

El momento máximo es el mismo, 45 kNm, pero en la viga continua se traslada sobre el apoyo, y el momento positivo de los vanos es mucho menor. Además, cada vano es 2,4 veces más rígido: su extremo sobre el nodo 2 no puede girar, casi como si estuviera empotrado. Desmarca la rótula antes de seguir.

## Asiento del apoyo central {#settle-the-middle-support}

Ahora deja que el nodo 2 baje 10 mm, como podría hacerlo una zapata sobre un terreno blando.

::div{.steps}

### Impón el asiento {#prescribe-the-settlement}

Haz clic en el nodo 2 → **Imponer desplazamiento**. En el diálogo ya está elegido **Desplazamiento impuesto**; escribe `0,01` en **Dz** y haz clic en **Añadir carga nodal**.

![El diálogo del desplazamiento impuesto: solo se puede fijar Dz, la dirección que impide el rodillo](/screenshots/es/p2t-prescribe-displacement.webp){.shot-sm}

Con las unidades SI por defecto, los desplazamientos van en metros, así que 10 mm son `0,01`; el sentido positivo es hacia abajo. Solo se pueden fijar las direcciones restringidas: un rodillo se puede desplazar hacia abajo, pero no de lado. Encontrarás más en [Desplazamientos impuestos](/es/essentials/loads#prescribed-displacements-support-settlements).

### Lee los nuevos resultados {#read-the-new-results}

La reacción central baja a `70,13` kN y las extremas suben a `24,94` kN. El momento sobre el nodo 2 se reduce a `-30,38` kNm, y el momento positivo de los vanos crece hasta `31,09` kNm.

::model-figure{caption="El nodo 2 asentado 10 mm: el momento negativo sobre él disminuye y los vanos reciben más"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
  - { node: 2, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

### El asiento por sí solo {#look-at-the-settlement-alone}

Borra las dos cargas de elemento: selecciona cada una y pulsa <kbd>Supr</kbd>, o usa la × de su fila en la tabla **Cargas**. Lo que queda es el efecto del asiento por sí solo: un momento triangular de `14,62` kNm sobre el nodo 2, positivo, y una reacción en el nodo 2 que actúa **hacia abajo**, de `4,87` kN, mientras que los nodos 1 y 3 empujan hacia arriba con `2,44` kN cada uno. La viga se resiste a adoptar la forma que le impone el asiento, y esa resistencia es lo único que la solicita.

::model-figure{caption="Solo el asiento: no hay carga, y aun así la viga se flecta y los apoyos reaccionan"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { node: 2, settlement: { dz: 0.01 } }
results: [M, w]
show: [nodeLabels]
---
::

Súmalo a los resultados con la carga sola y obtendrás la viga asentada y cargada: 75 − 4,87 = 70,13 kN, −45 + 14,62 = −30,38 kNm. El cálculo es lineal, así que los efectos se superponen.

### Vuelve a eliminar la continuidad {#cut-the-continuity-again}

Recupera las cargas con <kbd>Ctrl</kbd>+<kbd>Z</kbd>, una vez por cada carga borrada, y vuelve a marcar la rótula final del elemento 1. Ahora los vanos asentados simplemente se inclinan: las reacciones y los momentos son exactamente los de dos vanos biapoyados, sea cual sea el asiento, y sin las cargas serían nulos. **Un asiento solo provoca esfuerzos en una estructura hiperestática.** Desmarca la rótula antes de seguir.

::

## Comprueba a mano {#check-by-hand}

Usa el método de las fuerzas. Quita el apoyo del nodo 2 y sustitúyelo por su reacción incógnita $R_2$, que actúa hacia arriba sobre una viga biapoyada de luz $2L = 12$ m.

**Flechas de la viga liberada en el nodo 2.** Con la carga, y con una fuerza unitaria hacia arriba en el nodo 2:

$$
\delta_q = \frac{5q\,(2L)^4}{384\,EI} = \frac{5 \cdot 10 \cdot 12^4}{384 \cdot 17\,547{,}6} = 0{,}15387\ \text{m}
$$

$$
\delta_{1} = \frac{(2L)^3}{48\,EI} = \frac{12^3}{48 \cdot 17\,547{,}6} = 0{,}0020516\ \text{m/kN}
$$

**Compatibilidad.** $R_2$ tiene que devolver el nodo 2 hacia arriba hasta donde está el apoyo: a cero, o a $\Delta$ por debajo.

$$
R_2\,\delta_1 = \delta_q - \Delta \quad\Rightarrow\quad R_2 = \frac{\delta_q - \Delta}{\delta_1}
$$

**Todo lo demás** sale del equilibrio; el máximo momento positivo está donde se anula el cortante $R_1 - qx$.

| | Fórmula | Sin asiento | Nodo 2 asentado 10 mm |
| --- | --- | --- | --- |
| $R_2$ | $(\delta_q - \Delta)/\delta_1$ | 75,00 kN | 70,13 kN |
| $R_1 = R_3$ | $(2qL - R_2)/2$ | 22,50 kN | 24,94 kN |
| $M_2$ | $R_1 L - qL^2/2$ | −45,00 kNm | −30,38 kNm |
| $M_{\max}$ | $R_1^2/(2q)$ | 25,31 kNm | 31,09 kNm |

EduBeam muestra los mismos valores hasta la última cifra.

Sin asiento, son los valores de los libros de texto: $R_2 = 10qL/8$, $M_2 = -qL^2/8$ y $M_{\max} = 9qL^2/128$. El asiento por sí solo cambia las reacciones en $\Delta/\delta_1 = 4{,}874$ kN, y el momento sobre el nodo 2 en

$$
\Delta M_2 = \frac{\Delta}{\delta_1} \cdot \frac{2L}{4} = \frac{3\,EI\,\Delta}{L^2} = \frac{3 \cdot 17\,547{,}6 \cdot 0{,}01}{36} = 14{,}62\ \text{kNm}
$$

Fíjate en el $EI$ que aparece. Los esfuerzos que provoca una carga dependen solo de la rigidez de las barras *relativa entre sí*; los que provoca un desplazamiento impuesto crecen con la propia rigidez. Sobre un apoyo que asienta, una viga más rígida atrae momentos mayores.

## Experimenta {#experiment}

Parte de la viga asentada y cargada, cambia una sola cosa cada vez, predice el resultado y luego compruébalo. <kbd>Ctrl</kbd>+<kbd>Z</kbd> deshace cada cambio.

**Duplica la rigidez.** En la tabla **Secciones**, pon **Iy** a `1,6712e-4`. El efecto del asiento sobre el momento en el nodo 2 se duplica hasta 29,25 kNm, y $M_2$ se reduce a −15,75 kNm. Con la carga sola no cambiaría nada salvo las flechas, que se reducirían a la mitad.

**Busca el asiento que libera el nodo 2.** ¿Para qué $\Delta$ se anula el momento sobre el nodo 2? Para que $\Delta M_2 = 45$ kNm hace falta $\Delta = 45 L^2/(3EI) = qL^4/(24EI) = 0{,}0308$ m. Cambia el asiento a `0,0308`, en la tabla **Cargas** o con doble clic sobre él en el visor: las reacciones pasan a ser 30, 60 y 30 kN, las de dos vanos biapoyados, salvo el redondeo de $\Delta$. $qL^4/(24EI)$ es el giro en el extremo de un vano biapoyado multiplicado por $L$: el asiento inclina cada vano lo justo para cerrar el quiebro sobre el nodo 2, y a la continuidad ya no le queda nada que hacer.

**Suelta el nodo 2.** Cambia el asiento a `0,1539`, la flecha $\delta_q$ de la viga liberada de 12 m. La reacción en el nodo 2 cae prácticamente a cero, y la viga resiste la carga como un único vano biapoyado: 180 kNm en el centro. Un apoyo que asienta tanto ya no es un apoyo.

**Levanta el nodo 2.** Cambia el asiento a `-0,01`, 10 mm hacia arriba. Todo lo que cambiaba el asiento cambia de signo: el nodo 2 recibe ahora 79,87 kN y el momento negativo crece hasta −59,62 kNm.

Hay más comprobaciones con solución analítica, entre ellas el asiento de una viga empotrada y apoyada, en [Comprobar resultados a mano](/es/guide/verification#prescribed-displacement).

## Siguientes pasos {#next-steps}

::card-grid{cols="2"}
:::card{title="Practicar: Viga continua de dos vanos" icon="lucide:dices" to="/es/practice?p=K2049"}
Vigas de dos vanos con carga en uno o en los dos, resueltas con el método de las fuerzas, y tus respuestas comprobadas al instante. Empieza por K2049; para seguir, selecciona solo **Viga continua de dos vanos** y pulsa **Nuevo problema**.
:::
:::card{title="Ejemplos" icon="lucide:library" to="/es/examples/"}
Este era el último tutorial. La galería de ejemplos tiene más modelos para abrir, modificar y comprobar, y ejercicios para proponer.
:::
::
