---
description: "Convención de signos de EduBeam: x a la derecha, z hacia abajo, cargas y desplazamientos, ejes locales, N, V, M, fuerzas de extremo, reacciones y eje y arriba."
source: site
---

# Sistema de coordenadas y convención de signos

:span{#sistema-de-coordenadas-y-convenio-de-signos}

Cada número que muestra EduBeam tiene signo. Esta página explica qué significa *positivo* para las coordenadas, las cargas, los desplazamientos, los esfuerzos, las fuerzas de extremo y las reacciones, para que puedas comparar la aplicación con tus propios cálculos. La mayoría de los resultados que parecen erróneos son, en realidad, una cuestión de convención de signos.

| Magnitud | Positivo |
| --- | --- |
| `x`, `Dx`, `Fx` | hacia la derecha |
| `z`, `Dz`, `Fz` | **hacia abajo** |
| `Ry`, `My` | antihorario en pantalla |
| $N$ | tracción |
| $V$ | hace girar en sentido horario un trozo corto de la barra |
| $M$ | tracción en la fibra inferior, del lado de la línea discontinua |
| Reacciones | la fuerza que el apoyo ejerce sobre la estructura, con el mismo signo que una carga |

## Ejes globales {#global-axes}

El modelo está en el plano x–z:

- **x** es horizontal, positivo hacia la **derecha**.
- **z** es vertical, positivo **hacia abajo**.
- **y** sale de la pantalla, hacia ti, de modo que el sistema es dextrógiro. Los giros y los momentos son alrededor de y, así que **el sentido antihorario es positivo**.

La cruz de ejes de la esquina del lienzo muestra x en rojo y z en verde. Como z apunta hacia abajo, el nodo en la cabeza de un pilar de 3 m que arranca en `Z = 0` tiene `Z = −3`. Los ángulos, como el de un apoyo inclinado, se miden desde x hacia z, es decir, en sentido horario en pantalla.

Si prefieres el eje y hacia arriba, cambia la [convención de visualización](#y-up-axes): el modelo no cambia, solo los números que lees y escribes.

## Grados de libertad {#degrees-of-freedom}

Cada nodo tiene tres grados de libertad (GDL):

| GDL | Significado | Positivo | Unidad |
| --- | --- | --- | --- |
| `Dx` | desplazamiento horizontal | hacia la derecha | m |
| `Dz` | desplazamiento vertical | hacia abajo | m |
| `Ry` | giro | antihorario | rad |

Los mismos signos valen para los [desplazamientos impuestos](/es/essentials/loads#prescribed-displacements-support-settlements), para la tabla *Resultados nodales* y para los valores que aparecen al pasar el ratón por encima de un nodo.

## Cargas {#loads}

Las cargas son positivas en el sentido positivo de los ejes. **Fx**, **Fz** y **My** son las componentes de una carga nodal o concentrada, **fx** y **fz** las de una carga uniforme, y **f₁x**, **f₂x**, **f₁z**, **f₂z** las de una carga trapezoidal al inicio y al final del elemento.

| Carga | Sentido positivo |
| --- | --- |
| `Fx`, `fx`, `f₁x`, `f₂x` | +x, hacia la derecha; según la x local del elemento si la casilla **LCS** está marcada |
| `Fz`, `fz`, `f₁z`, `f₂z` | +z, **hacia abajo**; según la z local del elemento si la casilla **LCS** está marcada |
| `My` | antihorario |
| `ΔTc` | calentamiento del eje de la barra, que la alarga |
| `ΔTb − ΔTt` | fibra inferior más caliente que la superior |

Así, la gravedad es un `fz` **positivo**, y el viento que empuja hacia la derecha el pilar de la izquierda es un `fx` positivo. Una carga lineal actúa siempre por metro de longitud de la propia barra, también cuando se da en ejes globales sobre una barra inclinada. La página [Cargas](/es/essentials/loads#element-loads) explica cómo introducir cada tipo.

::model-figure{caption="Todas estas cargas son positivas: fz = 5 kN/m en A–B, Fz = 10 kN en B, My = 10 kNm en C y Fx = 10 kN en D"}
---
nodes: { A: [0, 0], B: [3, 0], C: [4.5, 0], D: [6, 0] }
supports: { A: fixed }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 5 }
  - { node: B, fz: 10 }
  - { node: C, my: 10 }
  - { node: D, fx: 10 }
results: []
reactions: false
show: [nodeLabels]
---
::

## Ejes locales del elemento {#element-local-axes}

Cada elemento tiene sus propios ejes:

- la **x local** va del nodo inicial del elemento a su nodo final;
- la **z local** es la x local girada 90° **en sentido horario en pantalla**, el mismo giro que lleva la x global a la z global. Si recorres el elemento del nodo inicial al nodo final, la z local queda a tu derecha.

| Elemento dibujado | La z local apunta |
| --- | --- |
| de izquierda a derecha | hacia abajo: ejes locales y globales coinciden |
| de derecha a izquierda | hacia arriba |
| de abajo arriba | hacia la derecha |
| de arriba abajo | hacia la izquierda |

La dirección del elemento es su ángulo $\theta$, medido desde la x global hacia la z global (en sentido horario en pantalla). La [matriz de transformación](/es/elements/beam#transformation-matrix) pasa los desplazamientos de extremo de un sistema a otro con $\cos\theta$ y $\sin\theta$.

En el visor, una línea discontinua a lo largo de cada elemento marca su lado +z local: su **fibra inferior**. Las cargas de elemento con la casilla **LCS** marcada, la posición de una carga concentrada y las fuerzas de extremo siguen todas los ejes locales. Para invertir un elemento, usa **Intercambiar nodos** en la tabla *Elementos* (véase [dirección del elemento](/es/essentials/elements#element-direction)).

## Esfuerzos {#internal-forces}

Corta una barra a una distancia $x$ de su nodo inicial. En la cara de la parte situada **antes** del corte, cuya normal exterior apunta según +x local, los esfuerzos son positivos cuando actúan según +x local, según +z local y en sentido antihorario. En la otra cara actúan en sentido contrario.

::element-sketch{mode="internal-forces" caption="N, V y M positivos en un trozo corto de barra: tracción, un par de cortantes en sentido horario y momento positivo (tracción en la fibra inferior, la de la línea discontinua)"}
::

Expresado con palabras:

| Magnitud | Positivo significa |
| --- | --- |
| $N$ | tracción |
| $V$ | hace girar en sentido horario un trozo corto de la barra: en una barra dibujada de izquierda a derecha, hacia arriba en la cara izquierda del trozo y hacia abajo en la derecha |
| $M$ | **momento positivo**: tracción en la fibra inferior, del lado de la línea discontinua |

Con $q_x$ y $q_z$ la carga lineal en ejes locales, cumplen

$$
\frac{\mathrm{d}N}{\mathrm{d}x} = -q_x, \qquad \frac{\mathrm{d}V}{\mathrm{d}x} = -q_z, \qquad \frac{\mathrm{d}M}{\mathrm{d}x} = V.
$$

En una carga concentrada $F_x$, $F_z$ o $M_y$ (en ejes locales) presentan los saltos $\Delta N = -F_x$, $\Delta V = -F_z$ y $\Delta M = -M_y$: una fuerza según +z local hace bajar $V$, y un momento antihorario hace bajar $M$.

Por eso una viga biapoyada con carga gravitatoria tiene momento positivo, cortante positivo en el apoyo izquierdo y negativo en el derecho. La viga de abajo tiene además una fuerza de tracción aplicada en el rodillo, así que su axil es positivo.

::model-figure{caption="Viga biapoyada con 10 kN/m y una tracción de 20 kN: M = +45 kNm en el centro del vano, V = +30 kN en el apoyo izquierdo y −30 kN en el derecho, N = +20 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
  - { node: B, fx: 20 }
results: [M, V, N]
---
::

En un voladizo el momento cambia de signo: es negativo, con tracción arriba. Un empuje según su eje lo comprime.

::model-figure{caption="Voladizo con 10 kN en el extremo libre y un empuje de 15 kN: M = −40 kNm en el empotramiento, V = +10 kN, N = −15 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 10 }
  - { member: 1, px: -15, at: 4 }
results: [M, V, N]
---
::

En un pórtico, la fibra inferior de cada barra es su lado +z local, así que el orden en que dibujas un pilar decide cuál de sus caras es la inferior. Este pórtico está dibujado A → B → C → D, lo que deja la z local de todas las barras hacia el interior: un momento positivo significa tracción en la cara interior del pórtico, y los momentos negativos en las esquinas, tracción en la exterior.

::model-figure{caption="Pórtico dibujado A → B → C → D: la z local de las tres barras apunta hacia el interior"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: pin, D: pin }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

Los diagramas se dibujan como en la mayoría de los cursos europeos: $M$ del lado traccionado, y $N$ y $V$ positivos del lado opuesto a la línea discontinua. **Configuración → Ajustes del visor → Diagramas de esfuerzos internos** permite dibujar $M$ del lado comprimido y $N$ o $V$ del lado de la línea discontinua. Eso cambia el dibujo, nunca los valores: fíjate en el signo de la etiqueta, no en el lado del dibujo.

## Fuerzas de extremo (tabla Resultados de elementos) {#end-forces-element-results-table}

La tabla *Resultados de elementos* da seis **fuerzas de extremo** por elemento, en sus ejes **locales**:

::element-sketch{mode="end-forces" caption="Las seis fuerzas de extremo, todas dibujadas en sentido positivo: según x y z locales, y antihorario"}
::

| Columna | Actúa sobre el elemento en | Positiva según |
| --- | --- | --- |
| `X12`, `Z12`, `M12` | su nodo inicial | +x local, +z local, antihorario |
| `X21`, `Z21`, `M21` | su nodo final | +x local, +z local, antihorario |

Son las fuerzas que los nodos ejercen sobre el elemento: su matriz de rigidez por sus desplazamientos de extremo, más las fuerzas que equilibrarían sus cargas de elemento con ambos extremos empotrados,

$$
\begin{gathered}
\mathbf{f} = \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}, \\[1ex]
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix} = \mathbf{K}_l\,\mathbf{d}_l - \mathbf{f}_\mathrm{eq},
\end{gathered}
$$

donde $\mathbf{d}_l$ son los desplazamientos de extremo del elemento en ejes locales y $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$ las cargas nodales equivalentes de sus [cargas de elemento](/es/elements/beam#element-loads).

Las fuerzas de extremo siguen los ejes, no la convención de $N$–$V$–$M$, así que en el nodo inicial sus signos se invierten:

$$
\begin{aligned}
N(0) &= -X_{12}, & N(L) &= X_{21}, \\
V(0) &= -Z_{12}, & V(L) &= Z_{21}, \\
M(0) &= -M_{12}, & M(L) &= M_{21}.
\end{aligned}
$$

En la viga biapoyada de arriba: `X12 = −20 kN` y `X21 = +20 kN` (tracción), `Z12 = Z21 = −30 kN` (los dos apoyos empujan hacia arriba, es decir, en −z) y `M12 = M21 = 0`.

En cada nodo, las fuerzas de extremo de los elementos que concurren en él, pasadas a ejes globales, suman la carga nodal más la reacción. Así se comprueba rápidamente el equilibrio de un nudo.

## Reacciones {#reactions}

Una reacción es la fuerza o el momento que un apoyo ejerce **sobre la estructura**, una por cada GDL restringido. Su signo es el de una carga: positiva según +x, según +z (hacia abajo) y en sentido antihorario. Por eso un apoyo que recibe carga gravitatoria tiene un `Rz` **negativo**.

Las reacciones están en ejes globales, o en los ejes propios del nodo cuando este tiene un **Ángulo del SCL nodal** (un [apoyo inclinado](/es/essentials/nodes-supports#inclined-skewed-supports)). En el visor, cada reacción es una flecha que apunta en el sentido en que empuja el apoyo, con una etiqueta que indica su valor absoluto. Los valores con signo están en la exportación CSV, como `Rx`, `Rz` y `My`.

## Ejes con y hacia arriba {#y-up-axes}

**Configuración → Idioma y configuración regional → Sistema de coordenadas → x a la derecha, y hacia arriba** pasa todo lo que escribes y lees al sistema de los libros de texto: **x** hacia la derecha, **y** hacia arriba y **z** hacia ti. El modelo, los archivos guardados y los dibujos siguen exactamente igual; solo cambian los números y las letras:

| Magnitud | x a la derecha, z hacia abajo (predeterminado) | x a la derecha, y hacia arriba |
| --- | --- | --- |
| Coordenada vertical | `Z` | `Y`, signo opuesto |
| Cargas, desplazamientos, reacciones y fuerzas de extremo verticales | `Fz`, `fz`, `Dz`, `Rz`, `Z12`… | `Fy`, `fy`, `Dy`, `Ry`, `Y12`…, signo opuesto |
| Giros y momentos | `Ry`, `My` | `Rz`, `Mz`, mismo signo (antihorario positivo) |
| Ángulo del apoyo | medido en sentido horario | medido en sentido antihorario, signo opuesto |
| Esfuerzos | $N$, $V$, $M$ | iguales, con los mismos signos y dibujados igual |

Así, con y hacia arriba, la gravedad es un `fy` **negativo**, y la cabeza de un pilar de 3 m tiene `Y = 3`.

## Unidades {#units}

El solver trabaja siempre en SI: m, N, Pa, rad, y K para las variaciones de temperatura. Las unidades de visualización de [Unidades y ajustes](/es/essentials/units-settings) solo cambian lo que escribes y lees, nunca el modelo.
