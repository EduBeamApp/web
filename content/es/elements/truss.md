---
description: "La barra de celosía en EduBeam: un elemento viga con rótulas en ambos extremos, por qué equivale a la barra clásica y sus matrices de rigidez y transformación."
source: site
---

# Barra de celosía

Una barra de celosía solo transmite esfuerzo axil. EduBeam no tiene un elemento de celosía aparte: una barra de celosía es un [elemento viga](/es/elements/beam) con **las dos rótulas de extremo** marcadas. Esta página muestra por qué eso equivale exactamente a la barra de celosía clásica de dos nodos, da sus matrices de rigidez y de transformación, y explica qué puede hacer una barra con rótulas que no puede hacer la barra de celosía de los libros de texto.

::model-figure{caption="Todas las barras con rótulas en ambos extremos: las barras inclinadas tienen N = −7,071 kN, el tirante +5 kN, y ninguna barra trabaja a flexión"}
---
nodes: { A: [0, 0], B: [6, 0], C: [3, -3] }
supports: { A: pin, B: roller }
members:
  - { nodes: [A, C], hinges: [true, true] }
  - { nodes: [C, B], hinges: [true, true] }
  - { nodes: [A, B], hinges: [true, true] }
loads:
  - { node: C, fz: 10 }
results: [N]
show: [nodeLabels]
---
::

Para modelar una celosía en la aplicación, marca **Rótula al inicio** y **Rótula al final** en cada barra, o márcalas las dos en la franja superior antes de dibujar las barras con el ratón ([rótulas de extremo](/es/essentials/elements#end-hinges)). En el tutorial [Celosía plana](/es/tutorials/truss) se construye una paso a paso.

## Grados de libertad {#degrees-of-freedom}

Una barra de celosía trabaja con las dos traslaciones de cada extremo, en sus [ejes locales](/es/elements/conventions#element-local-axes):

::element-sketch{mode="dofs" :hinges='[true,true]' :rotations='false' caption="Una barra de celosía: rótulas en ambos extremos y dos traslaciones en cada uno"}
::

| Dirección | Nodo inicial (1) | Nodo final (2) |
| --- | --- | --- |
| según x local | $u_1$ y `X12` | $u_2$ y `X21` |
| según z local | $w_1$ y `Z12` | $w_2$ y `Z21` |

$$
\mathbf{d}_l = \begin{bmatrix} u_1 & w_1 & u_2 & w_2 \end{bmatrix}^\mathsf{T}.
$$

Los nodos conservan su giro `Ry`, porque toda barra es un elemento viga, pero una barra con rótulas en ambos extremos ni lo nota ni lo transmite: sus momentos de extremo `M12` y `M21` son siempre nulos. En un nudo en el que todas las barras tienen rótula, nada retiene ese giro. El solver lo deja en cero, pero un momento nodal aplicado en ese nudo no tiene sobre qué actuar y detiene el cálculo con *La estructura es un mecanismo: la matriz de rigidez es singular.*

## Matriz de rigidez local {#local-stiffness-matrix}

$$
\mathbf{K}_l = \frac{EA}{L}
\begin{bmatrix}
 1 & 0 & -1 & 0 \\
 0 & 0 & 0 & 0 \\
 -1 & 0 & 1 & 0 \\
 0 & 0 & 0 & 0
\end{bmatrix},
$$

donde $E$ es el módulo de Young, $A$ el área de la sección y $L$ la longitud. Solo el alargamiento de la barra consume energía, así que el esfuerzo axil de una barra sin cargas de elemento es constante:

$$
N = \frac{EA}{L}\,(u_2 - u_1).
$$

### Por qué una viga con dos rótulas es una barra de celosía {#why-a-beam-with-two-hinges-is-a-truss-bar}

Condensa los dos giros de extremo de la [matriz de rigidez de la viga](/es/elements/beam#local-stiffness-matrix), como con cualquier [rótula de extremo](/es/elements/beam#end-hinges). Los términos axiles no dependen de los giros y quedan como están. Los términos de flexión desaparecen por completo: con los dos giros libres, cualquier pareja de desplazamientos de extremo $w_1$, $w_2$ solo hace girar la barra como sólido rígido alrededor de sus rótulas, lo que no consume energía. El solver hace esta condensación numéricamente, para cualquier coeficiente de cortante, y obtiene la matriz anterior salvo el error de redondeo.

::callout{type="details" title="La condensación, paso a paso"}
Para la parte de flexión, ordena los GDL en conservados, $a = (w_1, w_2)$, y liberados, $b = (\varphi_1, \varphi_2)$. De la matriz de la viga, con $k_1$ a $k_4$ y el parámetro de cortante $\Phi$ definidos [allí](/es/elements/beam#local-stiffness-matrix),

$$
\begin{aligned}
\mathbf{K}_{aa} &= k_1 \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{ab} &= k_2 \begin{bmatrix} -1 & -1 \\ 1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{bb} &= \begin{bmatrix} k_3 & k_4 \\ k_4 & k_3 \end{bmatrix}.
\end{aligned}
$$

Como $\mathbf{K}_{ab}$ tiene dos columnas iguales, solo importa la suma de los términos de $\mathbf{K}_{bb}^{-1}$, que vale $2/(k_3 + k_4)$:

$$
\mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}
= \frac{2\,k_2^2}{k_3 + k_4} \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}.
$$

Con $k_3 + k_4 = 6EI_y / ((1+\Phi)L)$, el factor es $\dfrac{12\,EI_y}{(1+\Phi)L^3} = k_1$, de modo que este producto es exactamente $\mathbf{K}_{aa}$ y la rigidez a flexión condensada $\mathbf{K}_{aa} - \mathbf{K}_{ab}\mathbf{K}_{bb}^{-1}\mathbf{K}_{ba}$ es nula.
::

## Matriz de transformación {#transformation-matrix}

Para una barra inclinada un ángulo $\theta$ desde el eje x global hacia el eje z global, con $c = \cos\theta = (x_2 - x_1)/L$ y $s = \sin\theta = (z_2 - z_1)/L$, los desplazamientos locales son $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, con

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 \\
 -s & c & 0 & 0 \\
 0 & 0 & c & s \\
 0 & 0 & -s & c
\end{bmatrix}:
$$

las filas y columnas de traslación de la [matriz de transformación de la viga](/es/elements/beam#transformation-matrix). Cuidado con el signo de $s$ con z hacia abajo: la barra inclinada A → C de la celosía anterior sube, así que $z_2 - z_1 = -3$ m, $c = 0{,}7071$ y $s = -0{,}7071$.

## Matriz de rigidez global {#global-stiffness-matrix}

Al desarrollar $\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T}$ se obtiene

$$
\mathbf{K}_g = \frac{EA}{L}
\begin{bmatrix}
 c^2 & cs & -c^2 & -cs \\
 cs & s^2 & -cs & -s^2 \\
 -c^2 & -cs & c^2 & cs \\
 -cs & -s^2 & cs & s^2
\end{bmatrix}.
$$

La ventana **Matriz de rigidez** de una barra con rótulas muestra estos números en sus filas y columnas de traslación, y ceros en las de giro.

## Qué puede hacer una viga con rótulas que no hace una barra de celosía {#where-a-hinged-beam-does-more}

Como en EduBeam una barra de celosía sigue siendo un elemento viga, puede hacer dos cosas que la barra de celosía de los libros de texto no puede:

- **Recibir cargas a lo largo de la barra.** Una carga lineal sobre una barra, como su peso propio, la hace trabajar a flexión entre sus nudos como una viga biapoyada y transmite $qL/2$ a cada nudo. Las demás barras resisten los esfuerzos axiles de la celosía bajo estas cargas en los nudos. En la propia barra cargada, la componente de la carga según la barra hace que $N$ varíe linealmente, y el esfuerzo que da el cálculo como celosía es su valor en el centro de la barra.
- **Combinarse con vigas.** Un pórtico puede contener barras con rótulas, como un tirante o una diagonal de arriostramiento, sin ningún tipo de elemento especial.

Añade 5 kN/m al tirante de la celosía anterior:

::model-figure{caption="La misma celosía con 5 kN/m en el tirante: los esfuerzos axiles no cambian, y el tirante trabaja a flexión con M = qL²/8 = 22,5 kNm"}
---
nodes: { A: [0, 0], B: [6, 0], C: [3, -3] }
supports: { A: pin, B: roller }
members:
  - { nodes: [A, C], hinges: [true, true] }
  - { nodes: [C, B], hinges: [true, true] }
  - { nodes: [A, B], hinges: [true, true] }
loads:
  - { node: C, fz: 10 }
  - { member: 3, qz: 5 }
results: [M, N]
show: [nodeLabels]
---
::

La comprobación a mano: en C, el equilibrio vertical $2\,N \sin 45^\circ + 10 = 0$ da $N = -7{,}071$ kN en cada barra inclinada. En A, la componente horizontal del axil de la barra inclinada, $7{,}071 \cos 45^\circ = 5$ kN, la equilibra el tirante, que trabaja a tracción con $N = +5$ kN. La carga del tirante va directamente a los apoyos de sus extremos: suma $qL/2 = 15$ kN a cada reacción, pero nada a los esfuerzos axiles.

Una celosía tiene que ser estable como estructura de nudos articulados. Un módulo cuadrado sin diagonal, por ejemplo, es un mecanismo: EduBeam indica las rótulas y muestra el movimiento ([Solución de problemas](/es/reference/troubleshooting#no-results-are-drawn)).
