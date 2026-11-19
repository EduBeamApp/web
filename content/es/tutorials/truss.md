---
description: "Tutorial: una celosía plana en EduBeam. Axiles por nudos y por secciones, una barra de esfuerzo nulo y una flecha por trabajos virtuales. Unos 20 minutos."
source: site
---

# Tutorial: celosía plana

Construye una pequeña celosía isostática con barras articuladas, comprueba sus axiles con el método de los nudos y el de las secciones, y comprueba una flecha con el principio de los trabajos virtuales.

- **Tiempo:** unos 20 minutos.
- **Necesitas:** EduBeam abierto en otra pestaña del navegador, en un equipo con ratón y teclado. Si no has usado EduBeam antes, haz primero el [Inicio rápido](/es/guide/quick-start) o alguno de los tutoriales anteriores.
- **Conocimientos previos:** el método de los nudos y el método de las secciones. La comprobación opcional de la flecha usa el método de la carga unitaria (trabajos virtuales).
- **Unidades:** SI. El botón de unidades, abajo a la derecha del visor, debe mostrar `m m² kN kNm MPa`. Si muestra pies y kips, haz clic en él y elige **SI (métrico)** en **Sistema de unidades**.

**Aprenderás a**

- modelar las barras de una celosía como elementos viga con rótulas en los dos extremos, dibujándolas con el ratón,
- comprobar los axiles de las barras con el método de los nudos y el de las secciones,
- reconocer una barra de esfuerzo nulo y entender por qué en una celosía funciona un modelo de nudos articulados.

::div{.actions}
[Abrir EduBeam ↗](https://run.edubeam.app/?lang=es){target="_blank"} [Ir a la comprobación a mano](#_5-check-by-hand)
::

::model-figure{caption="La celosía terminada: 30 kN en los nodos 2 y 3, y los axiles de las barras, con la tracción positiva"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: roller }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 30 }
  - { node: 3, fz: 30 }
results: [N, w]
show: [nodeLabels, dimensions]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

## El problema {#the-problem}

- Una luz de 12 m dividida en tres módulos de 4 m, con 3 m de canto: los nodos 1 a 4 forman el cordón inferior, y los nodos 5 y 6, el superior.
- Un apoyo articulado en el nodo 1 y un apoyo móvil en el nodo 4.
- Dos cargas de 30 kN, en los nodos 2 y 3 del cordón inferior.
- Barras de acero, $E = 210$ GPa, $A = 20$ cm².

| Elementos | Barras, por sus nodos | |
| --- | --- | --- |
| 1, 2, 3 | 1–2, 2–3, 3–4 | cordón inferior |
| 4, 5, 6 | 1–5, 5–6, 6–4 | diagonal extrema, cordón superior, diagonal extrema |
| 7, 8, 9 | 2–5, 5–3, 3–6 | montante, diagonal central, montante |

**¿Es isostática?** Con $m = 9$ barras, $r = 3$ reacciones y $j = 6$ nudos, $m + r = 12 = 2j$. Cada nudo da dos ecuaciones de equilibrio, así que los axiles de las barras se obtienen solo con la estática.

## Crea el modelo {#model-it}

::div{.steps}

### Material y sección {#_1-material-and-section}

1. Haz clic en **Limpiar estructura** en la barra superior, marca **Eliminar materiales** y **Eliminar secciones** y haz clic en **Confirmar**. Los nodos y los elementos vuelven a numerarse desde 1.
2. Pestaña **Materiales** → **Biblioteca de materiales** → **+** en la fila **Acero (S235)**; después cierra la biblioteca con **Cancelar**.
3. Pestaña **Secciones** → **Añadir sección**. Escribe `0,002` en **Área** y `1e-6` en **Iy**, deja **Altura** y **Coeficiente de cortante** en `1` y haz clic en **Añadir sección**.

Con barras articuladas solo importa el área; basta con que $I_y$ sea positivo.

### Dibuja las barras con rótulas {#_2-draw-the-bars-with-hinges}

En EduBeam, una barra de celosía es un elemento viga con **las dos rótulas de extremo** marcadas. La herramienta de dibujo con el ratón puede marcarlas por ti, y el orden en que dibujes las barras da la numeración de la tabla anterior.

1. Pestaña **Elementos** → el segundo botón **Añadir elemento**, el del icono de cursor.
2. En la franja superior del visor, marca **Rótula al inicio** y **Rótula al final**. Todas las barras que dibujes a partir de ahora tendrán las dos.
3. Cordón inferior: haz clic en (0, 0), (4, 0), (8, 0) y (12, 0) y pulsa <kbd>Esc</kbd>.
4. Parte superior: vuelve a hacer clic en el botón **Añadir elemento** y después en el nodo 1, en (0, 0), en (4, −3), en (8, −3) y en el nodo 4, en (12, 0). Al hacer clic en un nodo existente, la barra se une a él en lugar de crear un nodo nuevo. Pulsa <kbd>Esc</kbd>.
5. Montantes y diagonal central: una vez más, haz clic en **Añadir elemento** y después en el nodo 2, en (4, 0), el nodo 5, en (4, −3), el nodo 3, en (8, 0), y el nodo 6, en (8, −3). Pulsa <kbd>Esc</kbd> y luego <kbd>F</kbd> para ajustar la vista.

La tabla **Elementos** debe mostrar ahora los nueve elementos de la tabla anterior, todos con las dos casillas de **Rótulas de extremo** marcadas. <kbd>Esc</kbd> sale del modo de dibujo, pero las casillas de rótula de la franja superior siguen marcadas para la próxima vez.

### Apoyos y cargas {#_3-supports-and-loads}

1. Haz clic en el nodo 1 → **Apoyos del nodo** → el símbolo **Articulación**. Al nodo 4 ponle el **Rodillo**.
2. Haz clic en el nodo 2 → **Añadir carga** → `Fz = 30` → **Añadir carga nodal**. Haz lo mismo en el nodo 3.

Un `Fz` positivo apunta hacia abajo. Todas las barras que llegan a cada nudo están articuladas, así que nada impide que el nudo gire; EduBeam lo admite y da para ese nodo un giro igual a 0.

::

## Resultados {#_4-results}

En las opciones de visualización, arriba a la derecha del visor (el engranaje las muestra y las oculta), desmarca **Forma deformada** y **M<sub>y</sub> (x)**, porque en una celosía no hay flexión, y marca **N (x)**. La tracción es positiva, y EduBeam rotula los esfuerzos en kN con dos decimales.

- Los dos apoyos marcan `30,00` hacia arriba; la reacción horizontal del apoyo articulado marca `0,00`, porque no actúa ninguna carga horizontal.
- Las tres barras del cordón inferior marcan `40,00`, a tracción; el cordón superior, `-40,00`, a compresión.
- La diagonal central, 5–3, no trabaja, así que no tiene etiqueta, como en la figura del principio.
- Pestaña **Resultados** → **Resultados nodales**: el nodo 2 baja $D_z$ = `2,2937 · 10⁻³ m`, es decir, 2,294 mm.

## Comprueba a mano {#_5-check-by-hand}

**Reacciones.** Las cargas son simétricas, así que $R_1 = R_4 = 30$ kN hacia arriba, y como no hay carga horizontal, la reacción horizontal del apoyo articulado es nula.

**Nudo 1** (método de los nudos). La diagonal extrema 1–5 mide 5 m, así que $\sin\alpha = 3/5$ y $\cos\alpha = 4/5$:

$$
\textstyle\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \ \Rightarrow\ N_{15} = -50\ \text{kN}
$$

$$
\textstyle\sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}
$$

**Nudo 2.** El montante 2–5 es la única barra que puede llevar hacia arriba la carga de 30 kN: $N_{25} = +30$ kN, y $N_{23} = N_{12} = 40$ kN.

**Sección por el módulo central** (método de las secciones). Corta las barras 5–6, 5–3 y 2–3 y quédate con la parte izquierda:

- Momentos respecto al nodo 3: $R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN.
- Fuerzas verticales: el cortante en el módulo es $R_1 - 30 = 0$, así que la diagonal central **5–3 no trabaja**: $N_{53} = 0$.

| Barras | A mano | EduBeam |
| --- | --- | --- |
| Cordón inferior 1–2, 2–3, 3–4 | +40 kN, tracción | 40,00 |
| Cordón superior 5–6 | −40 kN, compresión | −40,00 |
| Diagonales extremas 1–5, 6–4 | −50 kN | −50,00 |
| Montantes 2–5, 3–6 | +30 kN | 30,00 |
| Diagonal central 5–3 | 0 | sin etiqueta |

Una barra de esfuerzo nulo no es una barra inútil: con *esta* carga no trabaja, pero si la quitas, la celosía se desmorona, como muestran los experimentos de más abajo.

::callout{type="details" title="La flecha del nodo 2 por trabajos virtuales"}
Coloca una carga unitaria hacia abajo en el nodo 2 y vuelve a resolver la celosía a mano: $R_1 = 2/3$, $R_4 = 1/3$ y los axiles $n$ de la tabla. La flecha es $\delta = \sum N\,n\,L / (EA)$:

| Barra | $N$ (kN) | $n$ | $L$ (m) | $N\,n\,L$ |
| --- | --- | --- | --- | --- |
| 1–2 | 40 | 8/9 | 4 | 142,2 |
| 2–3 | 40 | 8/9 | 4 | 142,2 |
| 3–4 | 40 | 4/9 | 4 | 71,1 |
| 1–5 | −50 | −10/9 | 5 | 277,8 |
| 5–6 | −40 | −4/9 | 4 | 71,1 |
| 6–4 | −50 | −5/9 | 5 | 138,9 |
| 2–5 | 30 | 1 | 3 | 90,0 |
| 5–3 | 0 | −5/9 | 5 | 0 |
| 3–6 | 30 | 1/3 | 3 | 30,0 |
| | | | suma | 963,3 |

$$
\delta_2 = \frac{963{,}3}{EA} = \frac{963{,}3}{210 \times 10^6 \cdot 0{,}002} = 0{,}002294\ \text{m}
$$

Son 2,294 mm, lo mismo que el $D_z$ del nodo 2 en EduBeam, `2,2937 · 10⁻³` m.
::

## Experimenta {#_6-experiment}

Cambia una sola cosa cada vez, predice el resultado y luego compruébalo. <kbd>Ctrl</kbd>+<kbd>Z</kbd> deshace cada cambio.

**Mueve una carga.** Pon las dos cargas en el nodo 2: borra la carga del nodo 3 y cambia la otra a `Fz = 60`. Ahora $R_1 = 40$ kN, el cortante en el módulo central es $40 - 60 = -20$ kN y la diagonal central tiene que transmitirlo: $N_{53} = -20 \cdot 5/3 = -33{,}33$ kN, a compresión.

::model-figure{caption="60 kN en el nodo 2: la diagonal central 5–3 transmite ahora el cortante del módulo"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: roller }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 60 }
results: [N]
show: [nodeLabels]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

**Quita la diagonal central.** Borra el elemento 8. El módulo central se convierte en un rectángulo articulado que puede desplazarse lateralmente. EduBeam no muestra resultados, avisa *Las articulaciones de los nudos 2, 3, 5, 6 permiten que la estructura se mueva.*, que son las cuatro esquinas de ese módulo, y anima el movimiento.

**Desmarca todas las rótulas** en la tabla **Elementos**. La celosía se convierte en un pórtico de nudos rígidos. Marca **M<sub>y</sub> (x)**: los momentos flectores no llegan a 0,1 kNm y los axiles cambian menos de un 0,1 %. Por eso funciona la idealización de nudos articulados en una celosía triangulada.

**Articula los dos apoyos.** Una cuarta reacción hace que la celosía sea una vez hiperestática, y el resultado quizá te sorprenda: el cordón inferior ya **no trabaja**, y en su lugar cada apoyo empuja hacia dentro con 40 kN. Los nodos 1 y 4 no pueden separarse, así que las tres barras del cordón que hay entre ellos, alineadas, deben tener un alargamiento total nulo. Las tres llevan el mismo axil, así que ese axil es nulo, y sus 40 kN pasan a los apoyos. Esto se cumple sean cuales sean las áreas de las barras.

::model-figure{caption="Los dos apoyos articulados: los apoyos asumen la función del cordón inferior"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: pin }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 30 }
  - { node: 3, fz: 30 }
results: [N]
show: [nodeLabels]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

## Siguientes pasos {#next-steps}

La teoría del elemento de celosía está en [Barra de celosía](/es/elements/truss).

::card-grid{cols="2"}
:::card{title="Practicar: Celosía Warren" icon="lucide:dices" to="/es/practice?p=T2048"}
Las reacciones y el axil de una barra de una celosía más grande, con tus respuestas comprobadas al instante. Empieza por T2048; para seguir, deja seleccionada solo **Celosía Warren** y pulsa **Nuevo problema**.
:::
:::card{title="Siguiente: viga continua y asiento de apoyo" icon="lucide:spline" to="/es/tutorials/continuous-beam"}
Una viga hiperestática: qué aporta la continuidad, qué le hace un apoyo que asienta y cómo comprobar ambas cosas con el método de las fuerzas.
:::
::
