---
description: "Seis vigas, pórticos y celosías resueltos que se abren en EduBeam con un clic, con ejercicios, qué observar y soluciones para comprobar tu cálculo a mano."
source: site
---

# Ejemplos

Cada tarjeta de abajo es un modelo interactivo ya resuelto. Haz clic en una para abrir el modelo en [EduBeam]{.edubeam}, listo para editar: arrastra un nodo, cambia una carga o marca una rótula y observa cómo se actualizan los diagramas. Los ejercicios de más abajo convierten cada modelo en un pequeño estudio, con soluciones para comprobar tu cálculo a mano.

::feature-structures
::

Los mismos modelos están en la aplicación en **☰ → Ejemplos**, y [run.edubeam.app/?panel=examples&lang=es](https://run.edubeam.app/?panel=examples&lang=es){target="_blank"} abre directamente esa galería.

::callout{type="info" title="La misma barra en los seis ejemplos"}
Todos los ejemplos usan la misma barra de acero: $E = 210$ GPa, $I_y = 8356\ \text{cm}^4$ (es decir, $EI = 17\,548$ kNm²), un área de $1\ \text{m}^2$ y una rigidez a cortante tan grande que las deformaciones por axil y por cortante son despreciables. Por eso las fórmulas de los libros de texto para vigas esbeltas coinciden con la aplicación en todas las cifras que muestra. El canto de la sección es $1$ m, que solo importa en la carga térmica.
::

## Ejercicios propuestos {#suggested-exercises}

Resuelve primero a mano y comprueba después en la aplicación: abre el modelo desde su tarjeta de arriba o con **Abrir en EduBeam** bajo su figura. Al abrir un modelo se sustituye el que tienes; <kbd>Ctrl</kbd>+<kbd>Z</kbd> te lo devuelve, y además se guarda en **☰ → Estructuras recientes**.

### Viga hiperestática {#exercise-indeterminate-beam}

Una viga de 3 m, empotrada en A y sobre un rodillo en B, con 10 kN/m.

::model-figure{caption="Empotramiento en A, rodillo en B, 10 kN/m"}
---
nodes: { A: [0, 0], B: [3, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Determinar a mano las reacciones y el momento en el empotramiento, por el método de las fuerzas o con una tabla de momentos de empotramiento perfecto.
2. Desmarcar `Ry` en A para que la viga quede biapoyada. ¿Cómo cambia el momento máximo?
3. Volver a marcar `Ry` en A, y marcarlo también en B, para empotrar los dos extremos.

**Observa** dónde cambia de signo el diagrama de momentos y cómo el empotramiento recibe más carga que el rodillo.

::callout{type="details" title="Soluciones"}
- Empotrada y apoyada: $R_A = 5qL/8 = 18{,}75$ kN, $R_B = 3qL/8 = 11{,}25$ kN, $M_A = qL^2/8 = 11{,}25$ kNm, negativo. El mayor momento positivo es $9qL^2/128 = 6{,}33$ kNm, a 1,125 m de B, donde el cortante se anula.
- Biapoyada: $qL^2/8 = 11{,}25$ kNm en el centro del vano, el mismo valor que antes tenía el empotramiento.
- Biempotrada: $qL^2/12 = 7{,}5$ kNm negativo en los extremos y $qL^2/24 = 3{,}75$ kNm positivo en el centro del vano.
::

### Voladizo {#exercise-cantilever}

Un voladizo de 4 m, empotrado en A, con 18 kN hacia abajo en el extremo libre B.

::model-figure{caption="Voladizo con 18 kN en el extremo libre"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Determinar el momento en el empotramiento, la flecha y el giro en el extremo libre. Compararlos con el nodo B en **Resultados → Resultados nodales**.
2. Reducir $I_y$ a la mitad en la pestaña **Secciones**. ¿Qué cambia y qué no?
3. Sustituir la carga puntual por una carga uniforme de 4,5 kN/m, con los mismos 18 kN en total: eliminar la carga nodal en la pestaña **Cargas** y después usar **Añadir carga de elemento**.

**Observa** la forma del diagrama de momentos: una recta con la carga puntual y una parábola con la carga uniforme.

::callout{type="details" title="Soluciones"}
- $M_A = FL = 72$ kNm, $w_B = FL^3/(3EI) = 21{,}88$ mm, $\varphi_B = FL^2/(2EI) = 8{,}21$ mrad.
- Con la mitad de $I_y$, la flecha se duplica hasta 43,77 mm. El momento sigue siendo 72 kNm: el voladizo es isostático, así que sus esfuerzos no dependen de la rigidez.
- Carga uniforme: $M_A = qL^2/2 = 36$ kNm y $w_B = qL^4/(8EI) = 8{,}21$ mm. La misma carga total da la mitad de momento y tres octavos de la flecha.
::

### Celosía Warren {#exercise-pratt-truss}

Una celosía de 9 m de luz y 1,8 m de canto, con 8 kN en cada uno de los tres nudos superiores E, F y G. Marca **N(x)** en las opciones de visualización para ver los esfuerzos axiles. (Con diagonales alternas y sin montantes, su disposición es la que la mayoría de los libros de texto llama celosía Warren).

::model-figure{caption="Nudos de A a G, 8 kN en E, F y G"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D], [E, F], [F, G], [A, E], [E, B], [B, F], [F, C], [C, G], [G, D]]
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: []
show: [nodeLabels]
---
::

1. Determinar las reacciones y, por el método de los nudos, los esfuerzos en la diagonal extrema A–E y en el cordón inferior A–B.
2. Determinar, por el método de las secciones, el esfuerzo en el cordón superior del módulo central y en el cordón inferior B–C.
3. Los nudos de este modelo son rígidos. Marcar las dos rótulas de extremo de todas las barras en la pestaña **Elementos** para obtener una celosía de nudos articulados, y comparar los esfuerzos axiles.
4. Eliminar la diagonal B–F, primero con nudos rígidos y después con rótulas. ¿Sigue en pie la celosía?

**Observa** el patrón de signos: el cordón superior comprimido, el inferior traccionado y las diagonales con signos alternos.

::callout{type="details" title="Soluciones"}
- Reacciones: 12 kN en A y en D.
- Diagonales extremas: 15,62 kN de compresión. Cordones inferiores A–B y C–D: 10,00 kN de tracción.
- Cordones superiores E–F y F–G: 13,33 kN de compresión (momentos respecto a B: $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$). Cordón inferior B–C: 16,67 kN de tracción (momentos respecto a F: $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$). Diagonales interiores: 5,21 kN, a tracción las que bajan de E y G al cordón inferior, a compresión las que suben hacia F.
- Los nudos rígidos y los articulados dan los mismos esfuerzos axiles con una diferencia menor del 0,1 %. La flexión en una celosía triangulada es despreciable, y por eso funciona el modelo de nudos articulados.
- Sin B–F, la celosía de nudos rígidos sigue en pie trabajando como pórtico, con momentos flectores de unos 3 kNm. Con rótulas le falta una barra: se convierte en un mecanismo, y EduBeam muestra cómo puede moverse.
::

### Viga continua de tres vanos {#exercise-three-span-continuous-beam}

Una viga de 16 m con vanos de 5 + 6 + 5 m: 8 kN/m en el primer vano, 20 kN en C y 6 kN/m en el último vano. Al abrirla, solo están apoyados A y D.

::model-figure{caption="Tal como se abre: apoyada solo en A y D"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Tal como se abre, es una única viga biapoyada de 16 m. Determinar las reacciones y los momentos en B y C.
2. Marcar `Dz` en B y en C para convertirla en una viga continua sobre cuatro apoyos.
3. Determinar los momentos sobre B y C con la ecuación de los tres momentos y, después, las reacciones.

**Observa** los momentos negativos que aparecen sobre los apoyos interiores, cuánto menores se hacen todos los momentos y qué ocurre con la carga de 20 kN cuando C pasa a ser un apoyo.

::callout{type="details" title="Soluciones"}
- Biapoyada: $R_A = 44{,}69$ kN, $R_D = 45{,}31$ kN, $M_B = 123{,}4$ kNm y $M_C = 151{,}6$ kNm, ambos positivos.
- Continua, con $M_A = M_D = 0$:
  $$22 M_B + 6 M_C = -\tfrac{8 \cdot 5^3}{4}$$
  $$6 M_B + 22 M_C = -\tfrac{6 \cdot 5^3}{4}$$
  dan $M_B = -9{,}766$ kNm y $M_C = -5{,}859$ kNm, negativos. Los 20 kN en C van directamente al apoyo y no producen flexión.
- Reacciones: A 18,05 kN, B 22,60 kN, C 35,52 kN (incluidos los 20 kN), D 13,83 kN. Suman los 90 kN de carga.

::model-figure{caption="La viga continua sobre cuatro apoyos"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, B: roller, C: roller, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: [M, V]
---
::
::

### Pórtico {#exercise-portal-frame}

Un pórtico con un dintel de 8 m sobre dos pilares de 6 m, empotrado en A y apoyado sobre un rodillo en D. El dintel tiene una carga de 10 kN/m, y la esquina superior C recibe 8 kN hacia la izquierda y 10 kN hacia abajo.

::model-figure{caption="Empotramiento en A, rodillo en D: 10 kN/m en el dintel, 8 kN y 10 kN en C"}
---
nodes: { A: [0, 0], B: [0, -6], C: [8, -6], D: [8, 0] }
supports: { A: fixed, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
  - { node: C, fx: -8 }
  - { node: C, fz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. ¿Cuántas veces es hiperestático el pórtico?
2. Desmarcar `Ry` en A para convertir el apoyo en una articulación. El pórtico pasa a ser isostático: determinar a mano las reacciones y los momentos en las esquinas B y C.
3. Volver a marcar `Ry` en A y marcar después `Dx` en D para convertir también ese apoyo en una articulación. Observar el desplome del dintel en la deformada.

**Observa** hacia dónde se mueve la parte superior del pórtico. En el pórtico tal como se abre, se mueve hacia la derecha, en contra de la carga de 8 kN. ¿Por qué?

::callout{type="details" title="Soluciones"}
- Cuatro reacciones (tres en el empotramiento y una en el rodillo) y tres ecuaciones de equilibrio: una vez hiperestático. Con D también articulado, dos veces.
- Articulación en A: $V_D = (10 \cdot 8 \cdot 4 + 10 \cdot 8 - 8 \cdot 6)/8 = 44$ kN, $V_A = 46$ kN, $H_A = 8$ kN hacia la derecha. El momento en la esquina B es $8 \cdot 6 = 48$ kNm. En C es nulo: sin reacción horizontal en D, el pilar derecho solo tiene un axil de 44 kN.
- Tal como se abre, la parte superior se desplaza 9,5 mm hacia la derecha: el momento que transmite el dintel cargado flecta el pilar empotrado más de lo que lo hacen los 8 kN. Con D articulado, D toma 4,9 kN en horizontal y la parte superior se desplaza 4,8 mm hacia la izquierda.
::

### Carga térmica {#exercise-temperature-load}

Una viga biapoyada de 8 m, calentada $\Delta T_c = 20$ K en su eje, con la cara inferior 10 K más fría que la superior ($\Delta T_b - \Delta T_t = -10$ K).

::model-figure{caption="Viga biapoyada de 8 m, calentada 20 K, con la cara inferior 10 K más fría que la superior"}
---
nodes: { A: [0, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 20, bottom: -10, top: 0 } }
results: []
show: [nodeLabels, dimensions]
---
::

1. Antes de mirar: ¿qué esfuerzos produce la temperatura y cómo se mueve la viga?
2. Marcar `Dx` en B para impedir que la viga se alargue.
3. Marcar también `Ry` en los dos extremos.

**Observa** la deformada y los números de **Resultados → Resultados nodales**: la viga se mueve sin ningún esfuerzo hasta que la coaccionas.

::callout{type="details" title="Soluciones"}
- Una viga isostática puede dilatarse y curvarse libremente, así que no aparecen esfuerzos. B se desplaza hacia fuera $\alpha \Delta T_c L = 12 \cdot 10^{-6} \cdot 20 \cdot 8 = 1{,}92$ mm. La cara inferior, más fría, se acorta, de modo que la viga se arquea hacia arriba con curvatura $\kappa = \alpha (\Delta T_b - \Delta T_t)/h = -1{,}2 \cdot 10^{-4}$ 1/m: los extremos giran $\kappa L/2 = 0{,}48$ mrad y el centro del vano sube $\kappa L^2/8 = 0{,}96$ mm.
- Con los dos extremos sujetos en x: $N = -EA\alpha\Delta T_c = -50\,400$ kN, de compresión. El valor tan grande se debe al área ficticia de 1 m²; en un IPE 200, con 28,48 cm², el axil sería de 143,5 kN.
- Con los dos extremos empotrados: un momento constante $EI\alpha(\Delta T_b - \Delta T_t)/h = 2{,}11$ kNm en toda la viga.
::

## Tutoriales resueltos {#worked-tutorials}

Modelos más largos, construidos paso a paso y comprobados a mano:

::card-grid{cols="2"}
:::card{title="Viga inclinada" icon="lucide:move-diagonal" to="/es/tutorials/inclined-beam"}
Una viga de cubierta con nieve: cargas por metro en planta, axiles y cortantes según la pendiente y un rodillo girado.
:::
:::card{title="Pórtico triarticulado" icon="lucide:triangle" to="/es/tutorials/three-hinged-frame"}
Reacciones, N, V y M de un pórtico con una rótula interior.
:::
:::card{title="Celosía plana" icon="lucide:git-fork" to="/es/tutorials/truss"}
El método de los nudos, el método de las secciones, una barra de esfuerzo nulo y una flecha por trabajos virtuales.
:::
:::card{title="Viga continua y asiento de apoyo" icon="lucide:spline" to="/es/tutorials/continuous-beam"}
Una viga de dos vanos resuelta por el método de las fuerzas y, después, con un asiento de 10 mm en el apoyo central.
:::
::

Para más comprobaciones con solución analítica, consulta [Comprobar resultados a mano](/es/guide/verification).

## Más problemas {#more-problems}

[Problemas para practicar](/es/practice) te da una viga, un pórtico o una celosía nuevos, con otros números, cada vez que lo pides, y comprueba al momento tus reacciones y el momento máximo o el mayor esfuerzo en barra. Para una clase, el [generador de exámenes](/es/exam) imprime un examen distinto para cada estudiante, con la hoja de soluciones, y [@edubeam/plot](/es/guide/teaching#exercise-sheets-tests-and-slides-from-code) crea hojas de ejercicios a partir de código.

## Aportar un ejemplo {#contribute-an-example}

¿Tienes un buen modelo docente? Comparte su enlace en [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions) y quizá lo añadamos a la galería.
