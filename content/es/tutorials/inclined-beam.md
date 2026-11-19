---
description: "Tutorial: una viga inclinada de cubierta o de escalera en EduBeam: carga por metro en planta, axiles y cortantes, y el giro del rodillo. Unos 15 minutos."
source: site
---

# Tutorial: viga inclinada

Modela una viga inclinada de cubierta bajo carga de nieve, lee los esfuerzos axiles y cortantes a lo largo de su pendiente y compruébalos a mano.

- **Tiempo:** unos 15 minutos. Es el primero y el más corto de los cuatro tutoriales.
- **Necesitas:** EduBeam abierto en otra pestaña del navegador, en un equipo con ratón y teclado. Si no has usado EduBeam antes, haz primero el [Inicio rápido](/es/guide/quick-start): muestra las pestañas y los diálogos que usa este tutorial.
- **Conocimientos previos:** el equilibrio de una viga biapoyada y la descomposición de una fuerza en dos componentes.
- **Unidades:** SI. El botón de unidades, abajo a la derecha del visor, debe mostrar `m m² kN kNm MPa`. Si muestra pies y kips, haz clic en él y elige **SI (métrico)** en **Sistema de unidades**.

**Aprenderás a**

- convertir una carga dada por metro en planta en la carga por metro de barra que usa EduBeam,
- orientar una carga lineal en vertical o perpendicular a la barra con la casilla **LCS** (sistema de coordenadas local),
- girar un rodillo y ver que cambia el axil, pero no el momento flector.

::div{.actions}
[Abrir EduBeam ↗](https://run.edubeam.app/?lang=es){target="_blank"} [Ir a la comprobación a mano](#check-by-hand)
::

::model-figure{caption="La viga terminada: 3 kN/m de nieve por metro en planta, introducidos como 2,4 kN/m a lo largo de la barra, con un apoyo articulado en el alero (nodo 1) y un rodillo en la cumbrera (nodo 2)"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## El problema {#the-problem}

- Una viga inclinada recta, del nodo 1 en (0, 0) al nodo 2 en (4, −3): 4 m en planta y 3 m de altura, así que mide $L = 5$ m, con $\cos\alpha = 4/5$ y $\sin\alpha = 3/5$.
- Un apoyo articulado en el nodo 1, el alero. En el nodo 2, la cumbrera, un rodillo que se desplaza en horizontal, de modo que su reacción es vertical.
- Nieve $s = 3$ kN/m, dada, como la dan las normas, **por metro en planta** (de proyección horizontal).
- Acero, con $E = 210$ GPa; $I_y = 8{,}356 \times 10^{-5}$ m⁴, el de un IPE 300.

**¿Es isostática?** Tres reacciones y tres ecuaciones de equilibrio: sí. Sus esfuerzos salen solo de la estática; $E$ e $I_y$ solo influyen en la flecha.

## Crea el modelo {#model-it}

::div{.steps}

### Material y sección {#material-and-section}

1. Haz clic en **Limpiar estructura** en la barra superior, marca **Eliminar materiales** y **Eliminar secciones** y haz clic en **Confirmar**. Los nodos y los elementos vuelven a numerarse desde 1.
2. Pestaña **Materiales** → **Biblioteca de materiales** → **+** en la fila **Acero (S235)**; después cierra la biblioteca con **Cancelar**.
3. Pestaña **Secciones** → **Añadir sección**. Escribe `8,356e-5` en **Iy**, deja **Área**, **Altura** y **Coeficiente de cortante** en `1` y haz clic en **Añadir sección**.

Un área de 1 m² evita que la barra se acorte o se deforme por cortante de forma apreciable, como supone el cálculo a mano.

### Dibuja la barra {#draw-the-member}

1. Pestaña **Elementos** → el segundo botón **Añadir elemento**, el del icono de cursor.
2. Haz clic en (0, 0) y luego en (4, −3). Las reglas y la cruceta muestran dónde estás, y los clics se ajustan a la cuadrícula.
3. Pulsa <kbd>Esc</kbd> para dejar de dibujar y luego <kbd>F</kbd> para ajustar la vista.

El eje z apunta hacia abajo, así que el nodo 2, 3 m **por encima** del nodo 1, está en $z = -3$. Comprueba los dos nodos en la tabla **Nodos** y corrige las coordenadas que hayan quedado mal.

### Apoyos {#supports}

Haz clic en el nodo 1 → **Apoyos del nodo** → el símbolo **Articulación**. Al nodo 2 ponle el **Rodillo** de la misma manera.

### Carga {#load}

La nieve sobre la viga suma $3 \cdot 4 = 12$ kN. EduBeam reparte una carga uniforme a lo largo de la **longitud** de la barra, así que esos mismos 12 kN repartidos en 5 m son

$$
f_z = s \cdot \frac{4}{5} = s\cos\alpha = 3 \cdot 0{,}8 = 2{,}4\ \text{kN/m}
$$

1. Pestaña **Cargas** → **Añadir carga de elemento**.
2. **Tipo de carga** *Carga uniformemente distribuida*, **Elemento** `1`, `fz = 2,4`.
3. **Desmarca LCS**, para que `fz` actúe en vertical, y haz clic en **Añadir carga de elemento**.

::callout{type="warning" title="La casilla LCS viene marcada por defecto"}
Con **LCS** marcada, `fz` actúa según el eje z local del elemento, perpendicular a la pendiente: como el viento sobre una cubierta, no como la nieve. En una viga horizontal ambas direcciones coinciden, y por eso es fácil pasarlo por alto. El dibujo de la carga muestra hacia dónde apunta; los detalles están en [Cargas](/es/essentials/loads#uniformly-distributed-load).
::

::

## Resultados {#results}

La viga se resuelve en cuanto introduces la carga. En las opciones de visualización, arriba a la derecha del visor (el engranaje las muestra y las oculta), **Forma deformada**, **M<sub>y</sub> (x)** y **Reacciones** están activadas desde el principio; marca también **N (x)** y **V<sub>z</sub> (x)**. El selector que hay bajo la figura del principio muestra los mismos diagramas.

EduBeam rotula los diagramas y las reacciones en kN y kNm con dos decimales, así que deberías leer:

- `6,00` en cada apoyo, hacia arriba. La reacción horizontal del apoyo articulado marca `0,00`: no actúa ninguna fuerza horizontal.
- `6,00` kNm, el máximo del momento flector, en el centro del vano.
- `4,80` kN de cortante en el nodo 1 y `-4,80` en el nodo 2.
- `-3,60` kN de axil en el nodo 1 (compresión) y `3,60` en el nodo 2 (tracción), pasando por cero en el centro del vano.

## Comprueba a mano {#check-by-hand}

**Reacciones.** La resultante de 12 kN actúa a 2 m en planta del nodo 1, así que, tomando momentos respecto a cualquiera de los dos extremos, $V_1 = V_2 = 6$ kN. No actúa ninguna fuerza horizontal, así que $H_1 = 0$.

**Momento flector.** Con fuerzas verticales solo cuentan los brazos horizontales. A una distancia $x$ en planta desde el nodo 1,

$$
M(x) = V_1\,x - \frac{s\,x^2}{2}, \qquad M_{\max} = \frac{s\,a^2}{8} = \frac{3 \cdot 4^2}{8} = 6\ \text{kNm}
$$

exactamente como en una viga horizontal de luz $a = 4$ m con la misma carga por metro en planta.

**Cortante y axil.** Las fuerzas a la izquierda de un corte en $x$ suman una fuerza vertical $T(x) = V_1 - s\,x$. Descomponla en una componente perpendicular a la barra y otra según la barra:

$$
V = T\cos\alpha, \qquad N = -T\sin\alpha
$$

| | Nodo 1, $T = +6$ kN | Centro del vano, $T = 0$ | Nodo 2, $T = -6$ kN |
| --- | --- | --- | --- |
| $V$ | $6 \cdot 0{,}8 = 4{,}8$ kN | 0 | −4,8 kN |
| $N$ | $-6 \cdot 0{,}6 = -3{,}6$ kN | 0 | +3,6 kN |
| $M$ | 0 | 6 kNm | 0 |

Todo coincide con EduBeam. La reacción hacia arriba del nodo 1 empuja el extremo inferior pendiente arriba, contra la barra: compresión. La reacción hacia arriba del nodo 2 lleva el extremo superior todavía más arriba por la pendiente, separándolo de la barra: tracción. Los signos siguen la dirección del elemento, del nodo 1 al nodo 2, como se explica en [Sistema de coordenadas y convención de signos](/es/elements/conventions#internal-forces).

## Experimenta {#experiment}

Cambia una sola cosa cada vez, predice el resultado y luego compruébalo. <kbd>Ctrl</kbd>+<kbd>Z</kbd> deshace cada cambio.

**Olvida el coseno.** Introduce `fz = 3` en lugar de 2,4. Son 3 kN por metro de pendiente, 15 kN en total, y todos los resultados salen un 25 % mayores: reacciones de 7,5 kN y un momento de 7,5 kNm. En una cubierta con 30° de pendiente el error sería del 15 %, y con 45°, del 41 %.

**Deja LCS marcada.** Marca **LCS** en la carga de 2,4 kN/m. Ahora empuja perpendicular a la pendiente, como lo haría el viento, con una componente horizontal de 7,2 kN que solo puede tomar el apoyo articulado. El momento sube a $2{,}4 \cdot 5^2/8 = 7{,}5$ kNm, y el axil pasa a ser una tracción constante de 4,5 kN.

::model-figure{caption="Los mismos 2,4 kN/m con LCS marcada: perpendiculares a la pendiente, así que el apoyo articulado toma 7,2 kN en horizontal"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4, local: true }
results: [M, N]
show: [nodeLabels]
---
::

**Gira el rodillo.** Desmarca de nuevo **LCS** y cambia solo la dirección en que se desplaza el rodillo del nodo 2. Haz clic en el nodo 2 → **Apoyos del nodo**, escribe `-36,87` en **Ángulo del SCL nodal** y pulsa <kbd>Intro</kbd> (o usa el campo **α** de su fila en la tabla **Nodos**).

![El menú Apoyos del nodo del nodo 2: los símbolos de apoyo, las direcciones restringidas y el Ángulo del SCL nodal](/screenshots/es/p2t-node-supports-angle.webp){.shot-md}

El ángulo gira los ejes propios del nodo. Con los ejes por defecto, x a la derecha y z hacia abajo, un ángulo negativo los gira en sentido antihorario en la pantalla. Hay más en [Apoyos inclinados](/es/essentials/nodes-supports#inclined-skewed-supports).

Ahora el rodillo se desplaza según la pendiente, así que su reacción es perpendicular a la barra: $12 \cdot 2 / 5 = 4{,}8$ kN, tomando momentos respecto al nodo 1. El apoyo articulado toma el resto, y con él todo el axil: −7,2 kN en el nodo 1 y cero en el nodo 2.

::model-figure{caption="El rodillo del nodo 2 girado −36,87° para que se desplace según la pendiente: el axil va de −7,2 kN a cero"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
angles: { 2: -36.87 }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

**Ponle un rodillo vertical.** Vuelve a poner el ángulo a 0 y elige el **Rodillo vertical** para el nodo 2. Se desplaza en vertical, así que solo puede empujar en horizontal: tomando momentos respecto al nodo 1, $H_2 \cdot 3 = 12 \cdot 2$ da 8 kN, y el apoyo articulado sujeta la viga frente a ese empuje. Toda la barra trabaja a compresión.

::model-figure{caption="Un rodillo vertical en el nodo 2: un empuje horizontal de 8 kN y toda la viga a compresión"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: verticalRoller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

Los tres rodillos, uno junto a otro:

| Rodillo en el nodo 2 | Reacción en el nodo 2 | Reacción en el nodo 1 | $N$ del nodo 1 al 2 |
| --- | --- | --- | --- |
| Horizontal | 6 kN ↑ | 6 kN ↑ | de −3,6 a +3,6 kN |
| Según la pendiente | 4,8 kN ⊥ a la barra | 2,88 kN →; 8,16 kN ↑ | de −7,2 a 0 kN |
| Vertical | 8 kN ← | 8 kN →; 12 kN ↑ | de −13,6 a −6,4 kN |

**El momento flector no cambia nunca**, y el cortante tampoco: 6 kNm y ±4,8 kN en los tres casos. El nodo 1, el nodo 2 y cualquier corte están sobre una misma recta, el eje de la barra. La parte de la reacción del nodo 2 que actúa según esa recta no tiene momento respecto a ninguno de ellos, así que solo añade axil. La parte perpendicular a la barra queda fijada en 4,8 kN por los momentos respecto al nodo 1, apunte hacia donde apunte el rodillo. La dirección del rodillo solo decide adónde va el empuje, y eso sí le importa al muro o al rellano de la escalera que tiene que recibirlo.

## Siguientes pasos {#next-steps}

::card-grid{cols="2"}
:::card{title="Practicar: Viga biapoyada con voladizo" icon="lucide:dices" to="/es/practice?p=O2048"}
Las reacciones y el momento máximo de una viga con carga distribuida, con tus respuestas comprobadas al instante. Empieza por O2048; para seguir, deja seleccionada solo **Viga biapoyada con voladizo** y pulsa **Nuevo problema**.
:::
:::card{title="Siguiente: pórtico triarticulado" icon="lucide:triangle" to="/es/tutorials/three-hinged-frame"}
Cuatro barras, una rótula interior y un empuje horizontal: un pórtico que todavía se resuelve solo con la estática.
:::
::
