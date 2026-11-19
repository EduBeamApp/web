---
description: "EduBeam frente a las fórmulas de los libros: vigas, una celosía, temperatura, un asiento de apoyo y en qué difiere su viga de Timoshenko de la de Euler–Bernoulli."
source: site
---

# Comprobar resultados a mano

No te fíes nunca de un número que no puedas reproducir, al menos aproximadamente. Esta página resuelve a mano los casos clásicos de los libros de texto y los compara con [EduBeam]{.edubeam}, que coincide en todas las cifras mostradas. Las tablas dan cinco cifras significativas, como la pestaña *Resultados* de la aplicación; las etiquetas de las figuras están redondeadas a cuatro. Cada figura se resuelve en directo en tu navegador; **Abrir en EduBeam** carga el mismo modelo en la aplicación, donde puedes leer las tablas, cambiar un valor y ver qué ocurre.

::div{.chips}
- [Viga biapoyada](#simply-supported-beam-uniform-load)
- [Voladizo](#cantilever-tip-load)
- [Viga biempotrada](#fixed–fixed-beam-uniform-load)
- [Viga empotrada y apoyada](#propped-cantilever-uniform-load)
- [Celosía de dos barras](#two-bar-truss)
- [Temperatura](#temperature-gradient-on-a-simply-supported-beam)
- [Asiento de apoyo](#prescribed-displacement)
- [Deformación por cortante](#shear-deformation)
::

Para estructuras completas resueltas de principio a fin, consulta los tutoriales del [pórtico triarticulado](/es/tutorials/three-hinged-frame) y de la [celosía plana](/es/tutorials/truss). Si buscas problemas nuevos para resolver a mano, con las respuestas comprobadas a medida que las escribes, prueba la página [Problemas para practicar](/es/practice).

## La sección que se usa aquí {#the-section-used-here}

Salvo que se indique otra cosa, todos los casos usan la viga de acero de los ejemplos de la aplicación: $E = 210$ GPa e $I_y = 8356$ cm⁴ (un IPE 300), así que

$$
EI = 210 \times 10^9 \cdot 8{,}356 \times 10^{-5} = 17\,547{,}6\ \text{kNm}^2
$$

Su área ($A = 1$ m²) y su coeficiente de cortante ($k = 10^{32}$) son tan grandes que las deformaciones por axil y por cortante desaparecen, y los resultados siguen exactamente las fórmulas de Euler–Bernoulli de tu libro de texto.

::callout{type="info" title="Las vigas de EduBeam son vigas de Timoshenko"}
Con una sección real, como las de la biblioteca de secciones, las barras también se deforman por cortante. Las flechas salen entonces algo mayores que las de las fórmulas de Euler–Bernoulli, y en una estructura hiperestática los esfuerzos también cambian ligeramente. El apartado [Deformación por cortante](#shear-deformation), al final de esta página, muestra cuánto y cómo desactivarla.
::

En la pestaña *Resultados*, los desplazamientos y los giros siguen los [ejes globales](/es/elements/conventions#global-axes): un D<sub>z</sub> positivo es hacia abajo, un R<sub>y</sub> positivo es antihorario, y los desplazamientos se dan en metros salvo que cambies la unidad en [Configuración](/es/essentials/units-settings).

## Viga biapoyada con carga uniforme {#simply-supported-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, apoyo articulado en A y apoyo móvil en B. El nodo C, en el centro del vano, permite leer allí la flecha; dividir una barra con un nodo no cambia ningún resultado.

::model-figure{caption="Viga biapoyada, 12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Magnitud | Fórmula | Valor |
| --- | --- | --- |
| Reacciones | $qL/2$ | 36 kN |
| Cortante en los apoyos | $\pm qL/2$ | +36 kN en A, −36 kN en B |
| Momento en el centro del vano | $qL^2/8$ | 54 kNm |
| Giro en A | $qL^3/(24EI)$ | 0,0061547 rad, horario |
| Flecha en C | $5qL^4/(384EI)$ | 11,540 mm, hacia abajo |

EduBeam muestra los mismos valores. En la pestaña *Resultados*, el nodo A tiene R<sub>y</sub> = −0,0061547 rad (negativo: horario) y el nodo C, D<sub>z</sub> = 0,01154 m (positivo: hacia abajo).

## Voladizo con carga en el extremo {#cantilever-tip-load}

$L = 4$ m, empotrado en A, $F = 18$ kN hacia abajo en el extremo libre B.

::model-figure{caption="Voladizo, 18 kN en el extremo"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Magnitud | Fórmula | Valor |
| --- | --- | --- |
| Reacción vertical | $F$ | 18 kN |
| Momento de empotramiento | $FL$ | 72 kNm, negativo: M = −72 kNm |
| Giro en el extremo | $FL^2/(2EI)$ | 0,0082063 rad, horario |
| Flecha en el extremo | $FL^3/(3EI)$ | 21,883 mm, hacia abajo |

En la pestaña *Resultados*, el nodo B tiene R<sub>y</sub> = −0,0082063 rad y D<sub>z</sub> = 0,021883 m.

## Viga biempotrada con carga uniforme {#fixed–fixed-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, los dos extremos empotrados. Esta viga es hiperestática, así que la solución depende de la rigidez; las fórmulas salen de la condición de compatibilidad: giro nulo en los dos extremos.

::model-figure{caption="Viga biempotrada, 12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Magnitud | Fórmula | Valor |
| --- | --- | --- |
| Reacciones | $qL/2$ | 36 kN |
| Momentos en los apoyos | $qL^2/12$ | 36 kNm, negativo: M = −36 kNm |
| Momento en el centro del vano | $qL^2/24$ | 18 kNm, positivo |
| Flecha en C | $qL^4/(384EI)$ | 2,3080 mm, hacia abajo |

Empotrar los extremos desplaza todo el diagrama de momentos en $qL^2/12$: la variación total entre el apoyo y el centro del vano sigue siendo $qL^2/8 = 54$ kNm, como en la viga biapoyada. En la aplicación, parte del modelo biapoyado y cambia los dos apoyos a **Empotramiento** para verlo.

## Viga empotrada y apoyada con carga uniforme {#propped-cantilever-uniform-load}

$L = 6$ m, $q = 12$ kN/m, empotrada en A y con apoyo móvil en B.

::model-figure{caption="Viga empotrada y apoyada, 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Magnitud | Fórmula | Valor |
| --- | --- | --- |
| Reacción en el empotramiento | $5qL/8$ | 45 kN |
| Reacción en el apoyo móvil | $3qL/8$ | 27 kN |
| Momento de empotramiento | $qL^2/8$ | 54 kNm, negativo: M = −54 kNm |
| Momento positivo máximo | $9qL^2/128$ | 30,375 kNm |
| … donde $V = 0$ | $x = 5L/8$ | a 3,75 m de A |
| Giro en B | $qL^3/(48EI)$ | 0,0030773 rad, antihorario |

EduBeam rotula todos los máximos y mínimos de un diagrama, así que el máximo positivo aparece marcado donde se produce. Para hallar su posición, busca dónde se anula el cortante: $V(x) = 45 - 12x = 0$ da $x = 3{,}75$ m.

## Celosía de dos barras {#two-bar-truss}

Dos barras suben desde apoyos articulados en A $(0, 0)$ y B $(4, 0)$ hasta encontrarse en el vértice C $(2, -2)$, 2 m más arriba. Los dos extremos de ambas barras tienen **rótulas de extremo**, así que las barras solo transmiten esfuerzo axil. En C actúa una carga vertical $F = 20$ kN hacia abajo.

::model-figure{caption="Celosía de dos barras, 20 kN en el vértice"}
---
nodes: { A: [0, 0], C: [2, -2], B: [4, 0] }
supports: { A: pin, B: pin }
members: [{ nodes: [A, C], hinges: [true, true] }, { nodes: [C, B], hinges: [true, true] }]
loads:
  - { node: C, fz: 20 }
results: [N]
show: [nodeLabels]
---
::

Las dos barras están a 45°. Equilibrio vertical del nudo C, con el mismo esfuerzo en ambas barras por simetría:

$$
\begin{aligned}
2N \sin 45^\circ + F &= 0 \\
N = -\frac{F}{\sqrt{2}} &= -14{,}142\ \text{kN}
\end{aligned}
$$

Las dos barras están **comprimidas**. Cada apoyo recibe 10 kN en vertical y 10 kN en horizontal, hacia dentro: las barras empujan los apoyos hacia fuera. La capa **N (x)** y las reacciones muestran lo mismo.

## Gradiente térmico en una viga biapoyada {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m, $h = 0{,}3$ m, $\alpha = 12 \times 10^{-6}$ 1/K. La cara superior se calienta 5 K y la inferior se enfría 5 K, así que $\Delta T_b - \Delta T_t = -10$ K y el eje mantiene su temperatura ($\Delta T_c = 0$). Una viga biapoyada puede curvarse libremente, así que **no hay esfuerzos**, solo una curvatura:

$$
\begin{aligned}
\kappa &= \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} \\
&= \frac{12 \times 10^{-6} \cdot (-10)}{0{,}3} = -4 \times 10^{-4}\ \text{m}^{-1}
\end{aligned}
$$

La cara superior se alarga y la inferior se acorta, así que la viga se curva **hacia arriba**:

::model-figure{caption="Cara superior 10 K más caliente que la inferior: la viga se levanta 3,2 mm, sin esfuerzos"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [w]
show: [nodeLabels]
section: { h: 0.3 }
---
::

| Magnitud | Fórmula | Valor |
| --- | --- | --- |
| Flecha en C | $\kappa L^2/8$ | 3,2 mm, hacia arriba: D<sub>z</sub> = −0,0032 m |
| Giro en A | $\kappa L/2$ | 0,0016 rad, antihorario |
| Momento flector |  | 0 |

Una variación uniforme $\Delta T_c$ solo alargaría la viga, cosa que el apoyo móvil permite: tampoco produce esfuerzos.

Impide ahora el giro en los dos extremos (un **Empotramiento** en A y una **Deslizadera** en B, que sigue dejando que la viga se alargue). La curvatura queda impedida y en su lugar aparece un momento constante en todo el vano:

$$
\begin{aligned}
M &= -EI\kappa \\
&= -17\,547{,}6 \cdot (-4 \times 10^{-4}) = 7{,}019\ \text{kNm}
\end{aligned}
$$

Es positivo: la cara superior, impedida, tiende a alargarse, así que acaba comprimida.

::model-figure{caption="La misma viga con los dos giros impedidos: un momento constante de 7,019 kNm"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: fixed, B: slider }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [M]
show: [nodeLabels]
section: { h: 0.3 }
---
::

Las cargas térmicas se introducen como se describe en [Cargas](/es/essentials/loads#temperature-load); el canto $h$ forma parte de la [sección](/es/essentials/elements#cross-sections).

## Asiento de apoyo {#prescribed-displacement}

Toma la [viga empotrada y apoyada](#propped-cantilever-uniform-load) sin su carga y deja que el apoyo móvil B descienda $w = 10$ mm. En EduBeam eso es un **desplazamiento impuesto** D<sub>z</sub> = 0,01 m en B. Para seguirlo, el apoyo móvil tiene que arrastrar hacia abajo el extremo del voladizo, y eso flexiona la viga:

::model-figure{caption="Viga empotrada y apoyada, B desciende 10 mm: el apoyo móvil ejerce 2,437 kN hacia abajo"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

| Magnitud | Fórmula | Valor |
| --- | --- | --- |
| Fuerza en el apoyo móvil | $R = 3EIw/L^3$ | 2,4372 kN, hacia abajo |
| Momento de empotramiento | $RL$ | 14,623 kNm, negativo: M = −14,623 kNm |
| Giro en B | $3w/(2L)$ | 0,0025 rad, horario |

A diferencia de una carga, un asiento solo produce esfuerzos donde la estructura se le opone: aquí, cuanto más rígida es la viga, mayor es $R$. Una viga biapoyada seguiría el mismo asiento como un sólido rígido, sin ningún esfuerzo.

Vuelve a añadir la carga de 12 kN/m y los resultados se superponen: el empotramiento recibe ahora $45 + 2{,}4372 = 47{,}437$ kN y $54 + 14{,}623 = 68{,}623$ kNm, y el apoyo móvil $27 - 2{,}4372 = 24{,}563$ kN. Cómo introducir un asiento se explica en [Cargas](/es/essentials/loads#prescribed-displacements-support-settlements).

## Deformación por cortante {#shear-deformation}

Los elementos viga de EduBeam son vigas de **Timoshenko**: además de la flecha por flexión, se deforman por cortante, en una cantidad que fija la rigidez a cortante de la sección, $kGA$. Lo que eso cambia depende de la estructura:

- **Isostática**: las reacciones y los esfuerzos se obtienen solo del equilibrio, así que no cambian en absoluto. Solo crecen los desplazamientos. En una viga biapoyada y en un voladizo, los giros de las secciones tampoco cambian; en otros casos, como en el extremo libre de una viga biapoyada con voladizo, también varían un poco.
- **Hiperestática**: los esfuerzos dependen de la rigidez, así que también varían ligeramente.

### Una viga biapoyada {#shear-simply-supported}

La viga del [Inicio rápido](/es/guide/quick-start#_8-check-by-hand) muestra cuánto. Es la viga biapoyada de arriba con una sección real, el **IPE 200 (aprox.)** de la biblioteca de secciones: $I_y = 1943$ cm⁴, $A = 28{,}48$ cm² y un coeficiente de cortante $k = 0{,}3933$ (la fracción del área que corresponde al alma), con $G = 81$ GPa. Así, $EI = 4080{,}3$ kNm² y $kGA = 90\,720$ kN.

| Magnitud | Fórmula | Valor |
| --- | --- | --- |
| Giro en el extremo | $qL^3/(24EI)$ | 0,026469 rad |
| Flecha en el centro del vano, flexión | $5qL^4/(384EI)$ | 49,629 mm |
| Flecha en el centro del vano, cortante | $qL^2/(8kGA)$ | 0,59524 mm |
| Flecha en el centro del vano, total | suma | 50,224 mm, como muestra EduBeam |

La parte debida al cortante es el 1,2 % del total. El giro en el extremo es el de Euler–Bernoulli, igual que las reacciones y los momentos.

### Un voladizo: barras cortas {#shear-cantilever}

En un voladizo con una carga $F$ en el extremo, la flecha en el extremo es $FL^3/(3EI)$ por flexión y $FL/(kGA)$ por cortante. Su cociente es

$$
\frac{\text{cortante}}{\text{flexión}} = \frac{3EI}{kGA\,L^2}
$$

Con el mismo IPE 200, es el 0,84 % para un voladizo de 4 m, pero el 13,5 % para uno de 1 m: la deformación por cortante importa en las barras cortas y de gran canto.

### Una viga empotrada y apoyada: los esfuerzos se redistribuyen {#shear-propped-cantilever}

La [viga empotrada y apoyada](#propped-cantilever-uniform-load) con el IPE 200 es hiperestática, y ahora el apoyo móvil recibe algo más. Con $\beta = 3EI/(kGA\,L^2) = 0{,}0037481$ para $L = 6$ m, la compatibilidad en el apoyo móvil da

$$
R_B = \frac{3qL}{8} \cdot \frac{1 + 4\beta/3}{1 + \beta} = 27{,}034\ \text{kN}
$$

en lugar de 27 kN, y el momento de empotramiento baja de 54 a $qL^2/2 - R_B L = 53{,}798$ kNm. Aquí es poco, pero crece con $\beta$, es decir, en las barras cortas y de gran canto.

### Comparar con Euler–Bernoulli {#shear-switch-off}

Para comparar con las fórmulas de Euler–Bernoulli, pon el **Coeficiente de cortante** de la sección en un valor muy grande, por ejemplo `1e10`. La parte debida al cortante desaparece y todos los casos de esta página vuelven a coincidir. La formulación del elemento está en el [manual teórico](/es/elements/beam).

## Consejos para tus propias comprobaciones {#tips-for-your-own-checks}

- Ten a la vista el **botón de unidades**, abajo a la derecha del visor; la mayoría de las discrepancias son errores de unidades.
- Lee los valores exactos en la pestaña **Resultados** y en los recuadros emergentes, no en las etiquetas de los diagramas. **Exportar CSV** o **Copiar** te dan también las reacciones, listas para una hoja de cálculo. Consulta [Resultados y diagramas](/es/essentials/results#results-tab).
- Pon el **Formato numérico** en *Automático* en Configuración para leer `40` en lugar de `4 · 10¹`.
- Usa la ventana **Matriz de rigidez** para comparar un solo elemento con el [manual teórico](/es/elements/beam) cuando estudies el método directo de la rigidez.
- Usa **Compartir modelo** para pasar un modelo comprobado a un compañero o a tu profesor.
- Para comprobar muchos casos a la vez, o para generar ejercicios con soluciones conocidas, ejecuta el mismo solver desde código: [@edubeam/fem](/es/solver) es la biblioteca que hay detrás de cada número de la aplicación.
