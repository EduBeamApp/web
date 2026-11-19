---
description: "El elemento viga de Timoshenko de EduBeam: rigidez exacta, deformación por cortante, rótulas por condensación estática, empotramiento perfecto y transformación."
source: site
---

# Elemento viga

En EduBeam, toda barra, sea una viga, un pilar o una barra de celosía, es el mismo elemento: una **viga de Timoshenko** recta de dos nodos en el plano x–z, con sección constante. Esta página presenta su formulación exactamente como la calcula el solver, para que puedas reconstruir a mano cualquier matriz de elemento o vector de cargas y compararlo con la aplicación. Los signos son los de [Sistema de coordenadas y convención de signos](/es/elements/conventions), el código está en `Beam2D.ts` de la biblioteca [@edubeam/fem](/es/solver), y [Cómo resuelve EduBeam un modelo](/es/elements/analysis) muestra cómo se combinan los elementos hasta llegar a la solución.

## Grados de libertad {#degrees-of-freedom}

Cada nodo tiene tres grados de libertad (GDL), así que el elemento tiene seis. En los [ejes locales](/es/elements/conventions#element-local-axes) del elemento, a cada desplazamiento de extremo le corresponde una [fuerza de extremo](/es/elements/conventions#end-forces-element-results-table), con su propia columna en la tabla *Resultados de elementos*:

::element-sketch{mode="dofs" caption="Los seis grados de libertad del elemento viga, todos dibujados en sentido positivo; la línea discontinua marca la fibra inferior (+z local)"}
::

| Dirección | Nodo inicial (1) | Nodo final (2) |
| --- | --- | --- |
| según x local | $u_1$ y `X12` | $u_2$ y `X21` |
| según z local, hacia abajo en un elemento dibujado de izquierda a derecha | $w_1$ y `Z12` | $w_2$ y `Z21` |
| giro, en sentido antihorario | $\varphi_1$ y `M12` | $\varphi_2$ y `M21` |

En este orden forman los vectores de desplazamientos y de fuerzas del elemento:

$$
\begin{aligned}
\mathbf{d}_l &= \begin{bmatrix} u_1 & w_1 & \varphi_1 & u_2 & w_2 & \varphi_2 \end{bmatrix}^\mathsf{T}, \\
\mathbf{f} &= \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}.
\end{aligned}
$$

Como z apunta hacia abajo y los giros son positivos en sentido antihorario, el eje de una viga sin deformación por cortante gira $\varphi = -\,\mathrm{d}w/\mathrm{d}x$.

## Matriz de rigidez local {#local-stiffness-matrix}

Las fuerzas de extremo de un elemento sin cargas de elemento son $\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l$, con

$$
\mathbf{K}_l =
\begin{bmatrix}
 k_N & 0 & 0 & -k_N & 0 & 0 \\
 0 & k_1 & -k_2 & 0 & -k_1 & -k_2 \\
 0 & -k_2 & k_3 & 0 & k_2 & k_4 \\
 -k_N & 0 & 0 & k_N & 0 & 0 \\
 0 & -k_1 & k_2 & 0 & k_1 & k_2 \\
 0 & -k_2 & k_4 & 0 & k_2 & k_3
\end{bmatrix}
$$

y

$$
\begin{aligned}
k_N &= \frac{EA}{L}, & k_1 &= \frac{12\,EI_y}{(1+\Phi)\,L^3}, \\[1ex]
k_2 &= \frac{6\,EI_y}{(1+\Phi)\,L^2}, & k_3 &= \frac{(4+\Phi)\,EI_y}{(1+\Phi)\,L}, \\[1ex]
k_4 &= \frac{(2-\Phi)\,EI_y}{(1+\Phi)\,L}, & \Phi &= \frac{12\,EI_y}{k\,GA\,L^2}.
\end{aligned}
$$

$E$ y $G$ son el módulo de Young y el módulo de cortante del material, $A$ el área, $I_y$ el momento de inercia respecto al eje y, $k$ el **Coeficiente de cortante** de la sección y $L$ la longitud del elemento. $\Phi$ es el **parámetro de cortante**: mide lo flexible que es la barra a cortante en comparación con la flexión, y crece cuanto más corta y de más canto es la barra. Con $\Phi = 0$ aparecen los términos conocidos de la viga de Euler–Bernoulli: $12EI/L^3$, $6EI/L^2$, $4EI/L$ y $2EI/L$. El comportamiento axil y el de flexión están desacoplados: $u_1$ y $u_2$ solo intervienen en $k_N$.

Los libros de texto que usan el eje y hacia arriba escriben $+6EI/L^2$ donde esta matriz tiene $-k_2$. Ambas matrices describen la misma rigidez; solo cambia el sentido positivo del desplazamiento transversal.

::callout{type="details" title="De dónde sale la matriz: las funciones de forma exactas"}
Para una barra prismática de Timoshenko sin carga, las ecuaciones de equilibrio tienen solución exacta: $u$ es lineal en $x$, $w$ cúbica y $\varphi$ cuadrática. Expresada en función de los desplazamientos de extremo, con $\xi = x/L$, la flecha es

$$
w(\xi) = N_1\,w_1 + N_2\,\varphi_1 + N_3\,w_2 + N_4\,\varphi_2,
$$

$$
\begin{aligned}
N_1 &= \frac{(1-\xi)\,(1+\Phi+\xi-2\xi^2)}{1+\Phi}, \\[1ex]
N_2 &= -\frac{L\,\xi\,(1-\xi)\,(2+\Phi-2\xi)}{2\,(1+\Phi)}, \\[1ex]
N_3 &= \frac{\xi\,(\Phi+3\xi-2\xi^2)}{1+\Phi}, \\[1ex]
N_4 &= \frac{L\,\xi\,(1-\xi)\,(\Phi+2\xi)}{2\,(1+\Phi)}.
\end{aligned}
$$

Para $\Phi = 0$ son los polinomios cúbicos de Hermite, $N_1 = 1 - 3\xi^2 + 2\xi^3$ y $N_2 = -L\,\xi(1-\xi)^2$; el signo menos viene de $\varphi = -w'$. La matriz de rigidez contiene justo las fuerzas de extremo que necesitan estas formas exactas, de modo que es la rigidez exacta de la barra y no una aproximación que mejora al añadir elementos. El solver dibuja la deformada con estas mismas funciones.
::

## Deformación por cortante: ¿Timoshenko o Euler–Bernoulli? {#timoshenko-or-euler-bernoulli}

Que el elemento se deforme o no por cortante depende solo de $\Phi$, y por tanto del coeficiente de cortante $k$ de la sección: $kA$ es el área que resiste el cortante. Cada tipo de sección parte de su propio valor de $k$:

| Sección | Coeficiente de cortante $k$ |
| --- | --- |
| El modelo inicial y los ejemplos incluidos | $10^{32}$, con lo que $\Phi \approx 0$: Euler–Bernoulli |
| Perfiles I, H y de ala ancha de la biblioteca | $h\,t_w / A$: el alma resiste el cortante |
| Perfiles tubulares rectangulares de la biblioteca | $2\,h\,t / A$: las dos paredes laterales |
| Rectángulos y cuadrados de la biblioteca | 0,833 |
| Círculos de la biblioteca | 0,9 |
| Perfiles tubulares circulares de la biblioteca | 0,5 |
| Secciones poligonales | 0,833 de partida |
| Diálogo **Añadir sección** | 1 de partida |

En una barra esbelta la diferencia es pequeña. En una viga biapoyada con carga uniforme, el cortante aumenta la flecha de flexión en el centro del vano en una fracción $0{,}8\,\Phi$. Con un IPE 200 de acero, eso supone un 1,2 % con 6 m de luz, pero un 11 % con 2 m. Para desactivar la deformación por cortante, da a $k$ un valor muy grande, como `1e32`. Salvo que se indique lo contrario, las figuras interactivas de este sitio usan la sección de los ejemplos, rígida a cortante, de modo que coinciden con el cálculo a mano según la teoría de Euler–Bernoulli. La siguiente no:

::model-figure{caption="IPE 200 con 2 m de luz y k = h·tw/A = 0,393: w = 0,5657 mm en el centro del vano, un 11 % más que los 0,5106 mm de la teoría de Euler–Bernoulli (Φ = 0,135)"}
---
nodes: { A: [0, 0], B: [2, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
material: { e: 210e9, g: 81e9 }
section: { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 }
results: [w, M]
---
::

## Rótulas de extremo {#end-hinges}

Una [rótula de extremo](/es/essentials/elements#end-hinges) marcada anula el momento en ese extremo del elemento. El giro de extremo del elemento queda entonces libre, y el solver lo elimina por **condensación estática**. Se separan los seis GDL en los que se conservan, $a$, y los giros de extremo liberados, $b$:

$$
\begin{bmatrix} \mathbf{f}_a \\ \mathbf{0} \end{bmatrix}
=
\begin{bmatrix} \mathbf{K}_{aa} & \mathbf{K}_{ab} \\ \mathbf{K}_{ba} & \mathbf{K}_{bb} \end{bmatrix}
\begin{bmatrix} \mathbf{d}_a \\ \mathbf{d}_b \end{bmatrix}
+
\begin{bmatrix} \mathbf{f}_{\mathrm{fix},a} \\ \mathbf{f}_{\mathrm{fix},b} \end{bmatrix}.
$$

Aquí $\mathbf{f}_\mathrm{fix}$ son las fuerzas de empotramiento perfecto de las [cargas de elemento](#element-loads). La segunda fila da el giro en la rótula,

$$
\mathbf{d}_b = -\mathbf{K}_{bb}^{-1}\left(\mathbf{K}_{ba}\,\mathbf{d}_a + \mathbf{f}_{\mathrm{fix},b}\right),
$$

y al sustituirlo en la primera fila quedan la rigidez y las fuerzas de empotramiento condensadas

$$
\begin{aligned}
\mathbf{K}^{*} &= \mathbf{K}_{aa} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}, \\
\mathbf{f}^{*}_\mathrm{fix} &= \mathbf{f}_{\mathrm{fix},a} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{f}_{\mathrm{fix},b}.
\end{aligned}
$$

El solver vuelve a colocar $\mathbf{K}^{*}$ en una matriz de 6 × 6 con filas y columnas nulas para los giros liberados, de modo que un elemento con rótulas se ensambla exactamente igual que cualquier otro. Una vez resuelto el sistema, recupera $\mathbf{d}_b$ con la fórmula anterior, y la deformada muestra el quiebro en la rótula.

Con una rótula en el nodo final, la parte de flexión para $(w_1, \varphi_1, w_2)$ queda

$$
\mathbf{K}^{*}_{w} = \frac{12\,EI_y}{(4+\Phi)\,L^3}
\begin{bmatrix} 1 & -L & -1 \\ -L & L^2 & L \\ -1 & L & 1 \end{bmatrix},
$$

que para $\Phi = 0$ es la rigidez clásica $3EI/L^3$ de una barra empotrada y apoyada. Con rótulas en **ambos** extremos no queda nada de los términos de flexión y solo permanece $EA/L$: el elemento es una [barra de celosía](/es/elements/truss).

La rótula pertenece al extremo del elemento, no al nodo. Si todos los elementos que concurren en un nodo tienen rótula en él, el giro propio del nodo no queda unido a nada. El solver lo deja en cero, lo que no causa ningún problema, pero un momento nodal aplicado en ese nodo no tiene sobre qué actuar y hace singular el sistema.

## Cargas de elemento {#element-loads}

Las cargas que actúan sobre un elemento entran en la solución como **cargas nodales equivalentes**, $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. Las **fuerzas de empotramiento perfecto** $\mathbf{f}_\mathrm{fix}$ son las fuerzas de extremo que mantienen en equilibrio el elemento cargado con ambos extremos empotrados.

Todas las fórmulas siguientes están en ejes locales. Una carga introducida en ejes globales (con la casilla **LCS** desmarcada) se descompone primero en componentes locales, con $c = \cos\theta$ y $s = \sin\theta$ del [ángulo](#transformation-matrix) del elemento:

$$
q_x = c\,\bar q_x + s\,\bar q_z, \qquad q_z = -s\,\bar q_x + c\,\bar q_z,
$$

donde la raya sobre la letra indica las componentes globales. Las cargas lineales actúan por metro de longitud del propio elemento. Una viga inclinada de $(0, 0)$ a $(3, -4)$, por ejemplo, tiene $L = 5$ m, $c = 0{,}6$ y $s = -0{,}8$ (sube, así que $z$ disminuye). Una carga gravitatoria $\bar q_z = 10$ kN/m sobre ella da $q_x = -8$ kN/m, pendiente abajo, y $q_z = 6$ kN/m perpendicular a ella, y la viga recibe en total $10 \times 5 = 50$ kN, no $10 \times 3$.

En las tablas:

- $q_z$, $q_x$: carga uniforme; $q_1 \to q_2$: carga trapezoidal, con $q_1$ en el nodo inicial y $q_2$ en el nodo final.
- $F_z$, $F_x$, $M_y$: fuerza o momento a la distancia $a$ del nodo inicial, con $b = L - a$.
- $\Delta T = \Delta T_b - \Delta T_t$: la fibra inferior más caliente que la superior; $\Delta T_c$: el eje más caliente. $\alpha$ es el coeficiente de dilatación térmica del material y $h$ la **Altura** de la sección.

Perpendicularmente al eje (componentes z) y para $\Phi = 0$, en el nodo inicial:

$$
\begin{array}{l|cc}
\text{Carga} & Z_{12} & M_{12} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & \dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(7q_1+3q_2)}{20} & \dfrac{L^2\,(3q_1+2q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,b^2\,(3a+b)}{L^3} & \dfrac{F_z\,a\,b^2}{L^2} \\[3ex]
M_y & -\dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,b\,(b-2a)}{L^2} \\[3ex]
\Delta T & 0 & \dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

En el nodo final:

$$
\begin{array}{l|cc}
\text{Carga} & Z_{21} & M_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & -\dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(3q_1+7q_2)}{20} & -\dfrac{L^2\,(2q_1+3q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,a^2\,(a+3b)}{L^3} & -\dfrac{F_z\,a^2\,b}{L^2} \\[3ex]
M_y & \dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,a\,(a-2b)}{L^2} \\[3ex]
\Delta T & 0 & -\dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

Según el eje (componentes x), para cualquier $\Phi$:

$$
\begin{array}{l|cc}
\text{Carga} & X_{12} & X_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_x & -\dfrac{q_x L}{2} & -\dfrac{q_x L}{2} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(2q_1+q_2)}{6} & -\dfrac{L\,(q_1+2q_2)}{6} \\[3ex]
F_x & -\dfrac{F_x\,b}{L} & -\dfrac{F_x\,a}{L} \\[3ex]
\Delta T_c & EA\,\alpha\,\Delta T_c & -EA\,\alpha\,\Delta T_c
\end{array}
$$

::callout{type="details" title="Fuerzas de empotramiento perfecto con deformación por cortante"}
La carga uniforme y la carga térmica dan las mismas fuerzas de empotramiento perfecto para cualquier $\Phi$. Para las demás, con $D = 1 + \Phi$ y $\Delta q = q_2 - q_1$ (componentes z):

$$
\begin{aligned}
&\text{Trapezoidal:} \\
Z_{12} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(9+10\Phi)}{60\,D}, \\[1ex]
M_{12} &= \frac{q_1 L^2}{12} + \frac{\Delta q\,L^2\,(4+5\Phi)}{120\,D}, \\[1ex]
Z_{21} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(21+20\Phi)}{60\,D}, \\[1ex]
M_{21} &= -\frac{q_1 L^2}{12} - \frac{\Delta q\,L^2\,(6+5\Phi)}{120\,D}; \\[3ex]
&\text{Fuerza } F_z\text{:} \\
Z_{12} &= -\frac{F_z\,b\,(\Phi L^2 + 3ab + b^2)}{D\,L^3}, \\[1ex]
M_{12} &= \frac{F_z\,a\,b\,(\Phi L + 2b)}{2\,D\,L^2}, \\[1ex]
Z_{21} &= -\frac{F_z\,a\,(\Phi L^2 + a^2 + 3ab)}{D\,L^3}, \\[1ex]
M_{21} &= -\frac{F_z\,a\,b\,(\Phi L + 2a)}{2\,D\,L^2}; \\[3ex]
&\text{Momento } M_y\text{:} \\
Z_{12} &= -\frac{6\,a\,b\,M_y}{D\,L^3}, \qquad Z_{21} = \frac{6\,a\,b\,M_y}{D\,L^3}, \\[1ex]
M_{12} &= -\frac{M_y\,b\,(\Phi L - 2a + b)}{D\,L^2}, \\[1ex]
M_{21} &= -\frac{M_y\,a\,(\Phi L + a - 2b)}{D\,L^2}.
\end{aligned}
$$

Son las soluciones exactas de una barra de Timoshenko biempotrada, como lo es también la flecha que el solver añade entre los nodos para cada carga.
::

En un elemento con rótulas, las fuerzas de empotramiento se condensan en $\mathbf{f}^{*}_\mathrm{fix}$, como en [Rótulas de extremo](#end-hinges). Una carga uniforme sobre un elemento con rótula en el nodo final, por ejemplo, da $Z_{12} = -5q_zL/8$, $M_{12} = q_zL^2/8$, $Z_{21} = -3q_zL/8$ y $M_{21} = 0$ (para $\Phi = 0$): las fuerzas de empotramiento de una viga empotrada y apoyada.

Una vez resuelto el sistema, los esfuerzos a lo largo del elemento se obtienen de sus fuerzas de extremo y del equilibrio de la carga que actúa sobre él, y la flecha, de las funciones de forma más la flecha que produce esa carga en el elemento biempotrado: véase [Resultados a lo largo de las barras](/es/elements/analysis#results-along-the-members).

## Matriz de transformación {#transformation-matrix}

Un elemento inclinado un ángulo $\theta$, medido desde el eje x global hacia el eje z global (en sentido horario en pantalla), tiene

$$
c = \cos\theta = \frac{x_2 - x_1}{L}, \qquad s = \sin\theta = \frac{z_2 - z_1}{L},
$$

y sus desplazamientos de extremo locales se obtienen de los globales como $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, con

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 & 0 & 0 \\
 -s & c & 0 & 0 & 0 & 0 \\
 0 & 0 & 1 & 0 & 0 & 0 \\
 0 & 0 & 0 & c & s & 0 \\
 0 & 0 & 0 & -s & c & 0 \\
 0 & 0 & 0 & 0 & 0 & 1
\end{bmatrix}.
$$

Los giros son iguales en los dos sistemas. Si un nodo tiene un **Ángulo del SCL nodal** $\beta$ (un [apoyo inclinado](/es/essentials/nodes-supports#inclined-skewed-supports)), sus incógnitas $\mathbf{d}_n$ están en sus propios ejes, girados $\beta$ desde el eje x global hacia el eje z global. Sus componentes globales son

$$
\mathbf{d}_g = \mathbf{T}_n\,\mathbf{d}_n, \qquad
\mathbf{T}_n = \begin{bmatrix} \cos\beta & -\sin\beta & 0 \\ \sin\beta & \cos\beta & 0 \\ 0 & 0 & 1 \end{bmatrix}
$$

para los tres GDL de ese nodo. El solver multiplica $\mathbf{T}$ por la derecha por la matriz diagonal por bloques formada por las $\mathbf{T}_n$ de los dos nodos extremos (la identidad para un nodo sin ejes propios), de modo que el elemento se conecta a cada nodo en los ejes de ese nodo.

## Matriz de rigidez global {#global-stiffness-matrix}

En ejes globales, la matriz de rigidez y las cargas nodales equivalentes del elemento son

$$
\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T},
\qquad
\mathbf{f}_{\mathrm{eq},g} = \mathbf{T}^\mathsf{T}\,\mathbf{f}_\mathrm{eq},
$$

con $\mathbf{K}_l$ y $\mathbf{f}_\mathrm{eq}$ ya condensadas si el elemento tiene rótulas. $\mathbf{K}_g$ es lo que muestra para un elemento la ventana **Matriz de rigidez** (se abre desde la tabla *Elementos* o desde el menú contextual del elemento), en unidades SI: N/m, N y N·m. [Cómo resuelve EduBeam un modelo](/es/elements/analysis) ensambla estas matrices y resuelve a mano un pequeño ejemplo.
