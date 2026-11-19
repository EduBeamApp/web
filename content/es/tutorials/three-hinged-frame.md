---
description: "Tutorial: un pórtico triarticulado con carga uniforme en EduBeam. Reacciones, empuje y esfuerzos comprobados a mano, hasta la flecha de la rótula. Unos 15 minutos."
source: site
---

# Tutorial: pórtico triarticulado

Modela un pórtico con una rótula en el centro del vano, lee sus reacciones y diagramas, y comprueba cada número a mano, hasta la flecha de la rótula.

- **Tiempo:** unos 15 minutos.
- **Necesitas:** EduBeam abierto en otra pestaña del navegador, en un equipo con ratón y teclado. Si no has usado EduBeam antes, haz primero el [Inicio rápido](/es/guide/quick-start) o el tutorial de la [viga inclinada](/es/tutorials/inclined-beam).
- **Conocimientos previos:** el equilibrio de un pórtico y los diagramas de cuerpo libre. La comprobación opcional de la flecha usa el método de la carga unitaria (trabajos virtuales).
- **Unidades:** SI. El botón de unidades, abajo a la derecha del visor, debe mostrar `m m² kN kNm MPa`. Si muestra pies y kips, haz clic en él y elige **SI (métrico)** en **Sistema de unidades**.

**Aprenderás a**

- dibujar un pórtico con el ratón como una sola polilínea,
- colocar una rótula dentro de una barra con las casillas **Rótulas de extremo**,
- hallar el empuje horizontal con la condición $M = 0$ en la rótula, e interpretar el signo de $V$ en barras dibujadas en direcciones distintas.

::div{.actions}
[Abrir EduBeam ↗](https://run.edubeam.app/?lang=es){target="_blank"} [Ir a la comprobación a mano](#_6-check-by-hand)
::

::model-figure{caption="El pórtico terminado: 10 kN/m en el dintel, apoyos articulados en los nodos 1 y 5 y una rótula en el nodo 3"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], { nodes: [2, 3], hinges: [false, true] }, [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## El problema {#the-problem}

- Dos pilares de 4 m, articulados en sus bases, los nodos 1 y 5, separados 8 m.
- Arriba, un dintel horizontal del nodo 2 al nodo 4, con una rótula en el centro del vano, el nodo 3.
- Una carga uniforme $q = 10$ kN/m en todo el dintel.
- Acero, con $E = 210$ GPa, y en todas las barras $I_y = 8{,}356 \times 10^{-5}$ m⁴ (un IPE 300).

| Nodo | x (m) | z (m) | |
| --- | --- | --- | --- |
| 1 | 0 | 0 | apoyo articulado |
| 2 | 0 | −4 | esquina |
| 3 | 4 | −4 | rótula en el dintel |
| 4 | 8 | −4 | esquina |
| 5 | 8 | 0 | apoyo articulado |

El eje z apunta **hacia abajo**, así que la cabeza de los pilares está en $z = -4$.

**¿Es isostático?** Dos apoyos articulados dan cuatro reacciones. Las tres ecuaciones de equilibrio y $M_3 = 0$ en la rótula suman cuatro ecuaciones: sí.

## Crea el modelo {#model-it}

::div{.steps}

### Material y sección {#_1-material-and-section}

1. Haz clic en **Limpiar estructura** en la barra superior, marca **Eliminar materiales** y **Eliminar secciones** y haz clic en **Confirmar**. Los nodos y los elementos vuelven a numerarse desde 1.
2. Pestaña **Materiales** → **Biblioteca de materiales** → **+** en la fila **Acero (S235)**; después cierra la biblioteca con **Cancelar**.
3. Pestaña **Secciones** → **Añadir sección**. Escribe `8,356e-5` en **Iy**, deja **Área**, **Altura** y **Coeficiente de cortante** en `1` y haz clic en **Añadir sección**.

Un área de 1 m² evita que las barras se acorten o se deformen por cortante de forma apreciable, como supone el cálculo a mano de la flecha. Los esfuerzos de un pórtico isostático no dependen en absoluto de $E$, $A$ ni $I_y$.

### Dibuja el pórtico {#_2-draw-the-frame}

1. Pestaña **Elementos** → el segundo botón **Añadir elemento**, el del icono de cursor.
2. Haz clic en (0, 0), (0, −4), (4, −4), (8, −4) y (8, 0). Cada clic añade el siguiente nodo y lo une al anterior; los clics se ajustan a la cuadrícula.
3. Pulsa <kbd>Esc</kbd> para dejar de dibujar y luego <kbd>F</kbd> para ajustar la vista.

Ahora tienes los nodos 1 a 5 y los elementos 1 a 4, numerados en el orden en que los dibujaste, como en las figuras de esta página. Compara la tabla **Nodos** con la tabla anterior y corrige las coordenadas que hayan quedado mal.

### Apoyos y rótula {#_3-supports-and-the-hinge}

1. Haz clic en el nodo 1 → **Apoyos del nodo** → el símbolo **Articulación**. Haz lo mismo con el nodo 5.
2. En la tabla **Elementos**, busca el elemento 2, del nodo 2 al nodo 3, y marca la segunda de sus casillas de **Rótulas de extremo**: la rótula en su final, en el nodo 3.

![La tabla Elementos: el elemento 2 tiene marcada la rótula final, en el nodo 3](/screenshots/es/p2t-frame-elements-table.webp)

Basta con una rótula. El elemento 3 es entonces la única barra unida rígidamente al nodo 3, así que ahí no puede transmitírsele ningún momento. Marcar también el inicio del elemento 3 no cambia nada.

### Carga {#_4-load}

1. Pestaña **Cargas** → **Añadir carga de elemento**.
2. **Tipo de carga** *Carga uniformemente distribuida*, **Elemento** `2`, `fz = 10`. Haz clic en **Añadir carga de elemento**.
3. Repite con el elemento 3.

`fz` es positivo hacia abajo. El dintel es horizontal, así que aquí la casilla **LCS** no influye.

::

## Resultados {#_5-results}

En las opciones de visualización, arriba a la derecha del visor (el engranaje las muestra y las oculta), **Forma deformada**, **M<sub>y</sub> (x)** y **Reacciones** están activadas desde el principio. Marca **N (x)** y **V<sub>z</sub> (x)** para ver el resto, o desmarca algunas para ver un diagrama cada vez. EduBeam los rotula en kN y kNm con dos decimales.

- Cada base marca `40,00` hacia arriba y `20,00` hacia dentro.
- El momento flector marca `-80,00` en las dos esquinas y no tiene etiqueta en la rótula, donde es nulo. EduBeam lo dibuja del lado traccionado, aquí por fuera del pórtico.
- El axil es negativo en todas partes: `-40,00` en los pilares y `-20,00` en el dintel. Las cuatro barras están comprimidas.
- Pestaña **Resultados** → **Resultados nodales**: la rótula, el nodo 3, baja $D_z$ = `4,2554 · 10⁻² m`, es decir, 42,55 mm, el valor en la rótula de la vista $w(x)$ de la figura del principio.

## Comprueba a mano {#_6-check-by-hand}

**Reacciones verticales.** Por simetría, cada base recibe la mitad de los 80 kN:

$$
V_1 = V_5 = \frac{q \cdot 8}{2} = 40\ \text{kN}
$$

**Reacciones horizontales.** Corta el pórtico por la rótula y toma momentos respecto al nodo 3 en la mitad izquierda, donde el momento es nulo:

$$
V_1 \cdot 4 - H_1 \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_1 = \frac{160 - 80}{4} = 20\ \text{kN}
$$

Las dos bases empujan hacia dentro con 20 kN. Sin ese empuje, que solo pueden dar unos apoyos articulados que no se separan, el pórtico no se sostendría: los pilares se abrirían y la rótula caería.

| Magnitud | Fórmula | A mano | EduBeam |
| --- | --- | --- | --- |
| Reacciones verticales | $q \cdot 8/2$ | 40 kN | 40,00 |
| Reacciones horizontales | de $M_3 = 0$ | 20 kN | 20,00 |
| Momentos en las esquinas, nodos 2 y 4 | $H_1 \cdot 4$ | 80 kNm, tracción por fuera | −80,00 |
| Momento en la rótula, nodo 3 | | 0 | sin etiqueta |
| $N$ en los pilares | $-V_1$ | −40 kN | −40,00 |
| $N$ en el dintel | $-H_1$ | −20 kN | −20,00 |
| $V$ en los pilares | $\pm H_1$ | ±20 kN | −20,00; 20,00 |
| $V$ en el dintel en los nodos 2, 3, 4 | $V_1 - q\,x$ | 40; 0; −40 kN | 40,00; sin etiqueta; −40,00 |

Los dos pilares tienen el mismo cortante con signos opuestos, −20 kN en el elemento 1 y +20 kN en el elemento 4, porque los ejes locales de cada elemento siguen la dirección en que se dibujó: el elemento 1 hacia arriba y el 4 hacia abajo. Intercambia los nodos de un pilar y su signo cambia. El porqué se explica en [Sistema de coordenadas y convención de signos](/es/elements/conventions#internal-forces).

En el dintel, $M(x) = -80 + 40x - 5x^2$ kNm, con $x$ medido desde el nodo 2. Se anula en la rótula y nunca es positivo: todo el dintel trabaja a momento negativo, con tracción arriba. El cortante $V(x) = 40 - 10x$ se anula justo en la rótula, así que es ahí donde el momento alcanza su extremo.

::callout{type="details" title="La flecha de la rótula por trabajos virtuales"}
Coloca una carga unitaria hacia abajo en el nodo 3. Produce reacciones $\bar V = \bar H = 1/2$ y un momento $\bar m$ que crece de 0 en una base a 2 en una esquina y vuelve a 0 en la rótula, con tracción por fuera, como el momento real $M$. Integra $M \bar m$ en las cuatro barras:

$$
\text{pilares: } 2\int_0^4 (20\,y)(0{,}5\,y)\,dy = 426{,}7
$$

$$
\text{dintel: } 2\int_0^4 (80 - 40x + 5x^2)(2 - 0{,}5x)\,dx = 320
$$

Con $EI = 210 \times 10^6 \cdot 8{,}356 \times 10^{-5} = 17\,548$ kNm²:

$$
\delta_3 = \frac{1}{EI}\int M \bar m\,dx = \frac{746{,}7}{17\,548} = 0{,}04255\ \text{m}
$$

Son los 42,55 mm que EduBeam da como `4,2554 · 10⁻²` m. El 4 de la última cifra se debe al mínimo acortamiento y a la mínima deformación por cortante que todavía permite un área de 1 m², y que el cálculo a mano desprecia. Con el área real de un IPE 300, $A = 53{,}8$ cm², y su alma como área de cortante (un coeficiente de cortante de 0,40), las barras se acortan y se deforman más por cortante, y la rótula baja 43,7 mm, aproximadamente un 3 % más.
::

## Experimenta {#_7-experiment}

Cambia una sola cosa cada vez, predice el resultado y luego compruébalo. <kbd>Ctrl</kbd>+<kbd>Z</kbd> deshace cada cambio.

**Desmarca la rótula.** El pórtico pasa a ser una vez hiperestático. El empuje se reduce a la mitad, 10 kN, los momentos en las esquinas bajan a −40 kNm y en el centro del dintel aparece un momento positivo de 40 kNm. El nodo 3 baja ahora solo 12,16 mm en lugar de 42,55 mm. Y ahora también importan las secciones: si das al dintel una sección más rígida que la de los pilares, los momentos en las esquinas crecen.

::model-figure{caption="Sin la rótula: menos empuje, la mitad de momento en las esquinas y un momento positivo en el centro del vano"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], [2, 3], [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, w]
show: [nodeLabels]
---
::

**Empotra las bases.** Pon a los nodos 1 y 5 el símbolo **Empotramiento**. El empuje sube a 30 kN y aparecen momentos de 40 kNm en las bases (EduBeam muestra `39,99`, porque los pilares se acortan muy ligeramente), pero los momentos en las esquinas siguen siendo de 80 kNm. Por simetría, el cortante en la rótula es nulo, así que cada mitad del dintel sigue trabajando como un voladizo de 4 m que sale de su esquina: $q \cdot 4^2/2 = 80$ kNm.

**Empuja en horizontal.** Con las bases otra vez articuladas, añade una carga nodal `Fx = 10` kN en el nodo 2. Las reacciones pierden la simetría: 35 kN y 45 kN hacia arriba, 15 kN y 25 kN en horizontal. Compruébalas con las mismas tres ecuaciones y $M_3 = 0$; la carga del nodo 2 no tiene brazo respecto al nodo 3. El momento en la esquina izquierda baja a −60 kNm, y la mitad izquierda del dintel tiene ahora un pequeño momento positivo, de 1,25 kNm a 0,5 m de la rótula.

::model-figure{caption="Una carga horizontal de 10 kN en el nodo 2: la esquina derecha recibe ahora 100 kNm"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], { nodes: [2, 3], hinges: [false, true] }, [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
  - { node: 2, fx: 10 }
results: [M, N]
show: [nodeLabels]
---
::

**Añade una segunda rótula.** Marca también la rótula al inicio del elemento 2, en el nodo 2. Dos rótulas en el dintel sobre dos pilares articulados forman un mecanismo. EduBeam no muestra resultados, avisa *Las articulaciones de los nudos 2, 3 permiten que la estructura se mueva.* y anima el movimiento.

## Siguientes pasos {#next-steps}

::card-grid{cols="2"}
:::card{title="Practicar: Pórtico triarticulado" icon="lucide:dices" to="/es/practice?p=H2048"}
El mismo pórtico con cargas nuevas, entre ellas un empuje horizontal, y tus respuestas comprobadas al instante. Empieza por H2048; para seguir, deja seleccionado solo **Pórtico triarticulado** y pulsa **Nuevo problema**.
:::
:::card{title="Siguiente: celosía plana" icon="lucide:git-fork" to="/es/tutorials/truss"}
Nueve barras articuladas: el método de los nudos, el de las secciones, una barra de esfuerzo nulo y una flecha por trabajos virtuales.
:::
::
