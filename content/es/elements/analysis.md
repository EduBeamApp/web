---
description: "El método directo de la rigidez como lo aplica EduBeam, resuelto a mano en una viga empotrada y apoyada: GDL, ensamblaje, apoyos, reacciones y esfuerzos."
source: site
---

# Cómo resuelve EduBeam un modelo

Cada vez que cambias el modelo, EduBeam lo vuelve a resolver con el **método directo de la rigidez**, en tu navegador y en pocos milisegundos. Esta página sigue paso a paso al solver [@edubeam/fem](/es/solver) en un ejemplo pequeño, para que puedas reproducir a mano cada número y sepas por qué puedes fiarte de los resultados.

El ejemplo es una viga empotrada y apoyada: un IPE 300 de acero, de 4 m, empotrado en A, apoyado sobre un rodillo en B y con una carga de 10 kN/m. Su rigidez es $EI = 210 \text{ GPa} \times 8356 \text{ cm}^4 = 17\,548$ kNm² y, sin deformación por cortante, las soluciones de los libros de texto son $M_A = -qL^2/8 = -20$ kNm, $R_B = 3qL/8 = 15$ kN y $\varphi_B = qL^3/(48EI)$.

::model-figure{caption="Viga empotrada y apoyada, IPE 300, 10 kN/m: M = −20 kNm en A y +11,25 kNm a 2,5 m, reacciones de 25 kN y 15 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
section: { a: 53.8e-4, iy: 8.356e-5, h: 0.3 }
results: [M, V, w]
show: [nodeLabels]
---
::

## Del modelo a los desplazamientos {#from-model-to-displacements}

::div{.steps}
### Numerar los grados de libertad {#number-the-degrees-of-freedom}

Cada nodo recibe los GDL que necesitan sus elementos. Todos los elementos son [elementos viga](/es/elements/beam), así que cada nodo tiene `Dx`, `Dz` y `Ry`. El solver numera primero los GDL **libres** y después los **restringidos**, nodo a nodo. Aquí A está empotrado y B solo está sujeto verticalmente, de modo que hay dos GDL libres:

$$
\begin{gathered}
\mathbf{r} = \begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix},
\qquad
\mathbf{r}_u = \begin{bmatrix} u_B \\ \varphi_B \end{bmatrix}, \\[1ex]
\mathbf{r}_p = \begin{bmatrix} u_A & w_A & \varphi_A & w_B \end{bmatrix}^\mathsf{T}.
\end{gathered}
$$

$u$, $w$ y $\varphi$ son los desplazamientos según x y z y el giro, como en la [tabla de GDL](/es/elements/conventions#degrees-of-freedom). Cada elemento guarda un **vector de localización**: las posiciones de sus seis GDL en $\mathbf{r}$. Contando desde 1, los GDL de la viga $(u_A, w_A, \varphi_A, u_B, w_B, \varphi_B)$ ocupan las posiciones $(3, 4, 5, 1, 6, 2)$.

### Calcular las matrices de los elementos {#compute-the-element-matrices}

Para cada elemento, el solver construye la [matriz de rigidez local](/es/elements/beam#local-stiffness-matrix), condensa las [rótulas de extremo](/es/elements/beam#end-hinges) que tenga y la pasa a ejes globales, $\mathbf{K}_g = \mathbf{T}^\mathsf{T}\mathbf{K}_l\,\mathbf{T}$. Cada carga de elemento se convierte en [cargas nodales equivalentes](/es/elements/beam#element-loads), $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. Nuestra viga es horizontal, así que $\mathbf{T}$ es la identidad, y la carga uniforme da, en kN y kNm,

$$
\mathbf{f}_\mathrm{eq} = \begin{bmatrix} 0 \\[0.5ex] qL/2 \\[0.5ex] -qL^2/12 \\[0.5ex] 0 \\[0.5ex] qL/2 \\[0.5ex] qL^2/12 \end{bmatrix}
= \begin{bmatrix} 0 \\[0.5ex] 20 \\[0.5ex] -13{,}33 \\[0.5ex] 0 \\[0.5ex] 20 \\[0.5ex] 13{,}33 \end{bmatrix}.
$$

### Ensamblar {#assemble}

La matriz de rigidez global $\mathbf{K}$ empieza llena de ceros. Cada elemento suma su término $(i, j)$ en la fila y la columna que su vector de localización indica para $i$ y $j$, de modo que, donde varios elementos concurren en un nodo, sus rigideces para los GDL de ese nodo se suman. El vector de cargas $\mathbf{F}$ reúne del mismo modo las cargas nodales y las cargas nodales equivalentes. Los desplazamientos impuestos (asientos) van en $\mathbf{r}_p$. Con el orden «primero los libres, después los restringidos», el sistema se divide en bloques:

$$
\begin{bmatrix} \mathbf{K}_{uu} & \mathbf{K}_{up} \\ \mathbf{K}_{pu} & \mathbf{K}_{pp} \end{bmatrix}
\begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix}
=
\begin{bmatrix} \mathbf{F}_u \\ \mathbf{F}_p + \mathbf{R} \end{bmatrix},
$$

donde $\mathbf{R}$ son las reacciones desconocidas. En el ejemplo, en $\mathbf{K}_{uu}$ solo caen las filas y columnas del extremo B de la viga:

$$
\begin{aligned}
\mathbf{K}_{uu} &= \begin{bmatrix} EA/L & 0 \\ 0 & 4EI/L \end{bmatrix} \\[1ex]
&= \begin{bmatrix} 282\,450 \text{ kN/m} & 0 \\ 0 & 17\,548 \text{ kNm} \end{bmatrix}, \\[1ex]
\mathbf{F}_u &= \begin{bmatrix} 0 \\ 13{,}33 \text{ kNm} \end{bmatrix}.
\end{aligned}
$$

### Introducir los apoyos y resolver {#apply-the-supports-and-solve}

Los apoyos no se modelan con muelles ni con números grandes en la diagonal: los GDL restringidos simplemente se separan. Los desplazamientos libres se obtienen de

$$
\mathbf{K}_{uu}\,\mathbf{r}_u = \mathbf{F}_u - \mathbf{K}_{up}\,\mathbf{r}_p,
$$

que se resuelve por descomposición LU. Sin asientos, $\mathbf{r}_p = \mathbf{0}$, y aquí

$$
\varphi_B = \frac{13{,}33}{17\,548} = 7{,}598 \times 10^{-4} \text{ rad},
$$

que es el $qL^3/(48EI)$ de los libros de texto, y $u_B = 0$.

### Calcular las reacciones {#compute-the-reactions}

Conocidos todos los desplazamientos, las filas restringidas dan las reacciones, es decir, las fuerzas que los apoyos ejercen sobre la estructura:

$$
\mathbf{R} = \mathbf{K}_{pu}\,\mathbf{r}_u + \mathbf{K}_{pp}\,\mathbf{r}_p - \mathbf{F}_p.
$$

Para $w_A$, la fila de $\mathbf{K}_{pu}$ tiene $-6EI/L^2$ bajo $\varphi_B$, y $\mathbf{F}_p$ tiene $qL/2$:

$$
\begin{aligned}
R_{wA} &= -\frac{6EI}{L^2}\,\varphi_B - \frac{qL}{2} \\
&= -5 - 20 = -25 \text{ kN},
\end{aligned}
$$

es decir, 25 kN hacia arriba (z apunta hacia abajo). Del mismo modo, $R_{\varphi A} = +20$ kNm y $R_{wB} = -15$ kN: los $qL^2/8$ y $3qL/8$ de los libros de texto.
::

## Resultados a lo largo de las barras {#results-along-the-members}

Para cada elemento, el solver toma sus desplazamientos de extremo de $\mathbf{r}$, los pasa a ejes locales, $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, y calcula las [fuerzas de extremo](/es/elements/conventions#end-forces-element-results-table)

$$
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix}.
$$

En el ejemplo, $\mathbf{d}_l = [0,\ 0,\ 0,\ 0,\ 0,\ \varphi_B]^\mathsf{T}$ da $Z_{12} = -25$ kN, $M_{12} = 20$ kNm, $Z_{21} = -15$ kN y $M_{21} = 0$.

Los esfuerzos en cualquier $x$ se obtienen después del equilibrio del trozo de elemento comprendido entre su inicio y $x$: las fuerzas en su inicio más la carga sobre ese trozo.

$$
\begin{aligned}
N(x) &= -X_{12} + N_q(x), \\
V(x) &= -Z_{12} + V_q(x), \\
M(x) &= -M_{12} - Z_{12}\,x + M_q(x),
\end{aligned}
$$

donde $N_q$, $V_q$ y $M_q$ proceden de las cargas sobre ese trozo. Para una carga uniforme $q_z$, una carga trapezoidal de $q_1$ a $q_2$ (con $\Delta q = q_2 - q_1$) y una fuerza $F_z$ o un momento $M_y$ a la distancia $a$, que solo actúan para $x \ge a$:

$$
\begin{array}{l|cc}
\text{Carga} & V_q(x) & M_q(x) \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -q_z\,x & -\dfrac{q_z\,x^2}{2} \\[3ex]
q_1 \to q_2 & -q_1 x - \dfrac{\Delta q\,x^2}{2L} & -\dfrac{q_1 x^2}{2} - \dfrac{\Delta q\,x^3}{6L} \\[3ex]
F_z,\ M_y & -F_z & -F_z\,(x-a) - M_y
\end{array}
$$

$N_q$ es $V_q$ con las componentes axiles $q_x$ y $F_x$ en lugar de $q_z$ y $F_z$.

En el ejemplo, $M(x) = -20 + 25\,x - 5\,x^2$ kNm, máximo en $x = 2{,}5$ m con $11{,}25$ kNm $= 9qL^2/128$. La carga térmica no tiene término propio: actúa solo a través de las fuerzas de extremo.

La flecha es el producto de las [funciones de forma](/es/elements/beam#local-stiffness-matrix) por los desplazamientos de extremo, más la flecha que produce la carga en el elemento biempotrado. Antes, cada extremo con rótula recupera su propio giro a partir de la [condensación](/es/elements/beam#end-hinges). Los diagramas y la deformada son estas funciones, evaluadas a lo largo de cada barra.

## Por qué los resultados son exactos {#exact}

Cada paso anterior es exacto para el modelo que resuelve:

- La rigidez del elemento procede de la **solución exacta** de una barra prismática de Timoshenko, no de formas polinómicas supuestas, así que es la rigidez real de la barra.
- Las fuerzas de empotramiento perfecto son las soluciones exactas del elemento biempotrado para cada tipo de carga, así que al pasar a cargas nodales equivalentes no se pierde nada.
- Los desplazamientos nodales son, por tanto, exactos, y los esfuerzos entre los nodos salen del equilibrio con la carga real, así que también son exactos.

Por eso EduBeam nunca te pide refinar una malla: un elemento por barra da el mismo resultado que cien. Solo hacen falta nodos donde cambia la propia barra: en un apoyo, una rótula, una esquina o un cambio de sección. Una carga puntual entre ellos puede seguir siendo una carga de elemento. El único error que queda es el de redondeo; las tablas de resultados muestran como 0 los valores menores que $10^{-12}$ veces el mayor valor de su tipo.

«Exacto» se refiere al modelo, que tiene sus límites:

::div{.limits}
- **Material elástico lineal** y **pequeños desplazamientos**: el equilibrio se plantea en la geometría sin deformar, así que no hay efectos de segundo orden (P–Δ) ni pandeo.
- **Barras rectas y prismáticas**: una sección por elemento. Una barra de canto variable hay que aproximarla con varios elementos.
- **Flexión solo en el plano x–z**: sin torsión ni comportamiento fuera del plano.
::

## Cuando la estructura no se sostiene {#mechanisms}

Una estructura que puede moverse sin deformarse tiene una matriz de rigidez singular y no tiene solución única. EduBeam lo detecta antes de resolver y comprueba el resultado después:

1. **Antes de resolver**, se comprueba cada parte conexa de la estructura solo por su geometría. Sus apoyos deben impedir los tres movimientos de sólido rígido de un cuerpo plano: con menos de tres restricciones, el modelo simplemente no está terminado (*La estructura necesita apoyos para poder resolverse.*), mientras que tres o más que aún le permiten desplazarse o girar, como rodillos paralelos, son un error. Después se comprueban las rótulas: si las barras pueden girar alrededor de ellas sin que ninguna cambie de longitud, la estructura es un mecanismo, y EduBeam rodea las rótulas con un círculo y muestra el movimiento.
2. **Durante la resolución**, una matriz exactamente singular detiene la descomposición LU: *La estructura es un mecanismo: la matriz de rigidez es singular.*
3. **Después de resolver**, un desplazamiento o un giro mayor que $10^6$ m o rad significa que la matriz era singular salvo por el redondeo. EduBeam indica los nodos y las direcciones que se mueven: *La estructura es inestable; se mueve prácticamente sin resistencia: …* Un material o una sección introducidos como cero, o en una unidad equivocada, acaban también aquí.

Un giro al que no está conectado nada, en un nodo donde todas las barras tienen rótula, no es un mecanismo: el solver lo deja en cero. [Solución de problemas](/es/reference/troubleshooting#no-results-are-drawn) explica cada mensaje y cómo resolverlo.

## Ejecuta tú mismo el solver {#library}

El solver es de código abierto: [@edubeam/fem](/es/solver), en TypeScript, para el navegador y Node. La misma viga empotrada y apoyada:

```ts
import { DofID, LinearStaticSolver, type Beam2D } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]

// Unidades SI: m, N, Pa. Acero, IPE 300; k = 1e32 la hace rígida a cortante.
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // empotramiento
domain.createNode('B', [4, 0, 0], [DofID.Dz]) // rodillo
domain.createBeam2D('1', ['A', 'B'], 1, 1)
lc.createBeamElementUniformEdgeLoad('1', [0, 10_000], true) // 10 kN/m, hacia abajo

solver.solve()

solver.neq // 2: Dx y Ry de B son libres
lc.r.toArray() // [0, 0.0007598, 0, 0, 0, 0]: GDL libres, después restringidos
lc.R.toArray() // [0, -25000, 20000, -15000]: A (Dx, Dz, Ry), después B (Dz)

const beam = domain.getElement('1') as Beam2D
beam.computeEndForces(lc).toArray() // [0, -25000, 20000, 0, -15000, 0]
beam.computeBendingMomentAt(lc, 0) // -20000: N·m, momento negativo en el empotramiento
beam.computeBendingMomentAt(lc, 2.5) // 11250: el mayor momento positivo
```

Tras `solve()`, `solver.k` contiene la matriz ensamblada $\mathbf{K}$ y `solver.f` el vector de cargas $\mathbf{F}$, para que los compares con tu propio ensamblaje. Los pasos de esta página están en `Solver.ts` (numeración), `LinearStaticSolver.ts` (ensamblaje, solución, reacciones) y `Beam2D.ts` (matrices del elemento y resultados).

::div{.actions}
[Primeros pasos con @edubeam/fem](/es/solver/getting-started) [Referencia de la API](/es/solver/reference) [Código fuente en GitHub ↗](https://github.com/EduBeamApp/fem){target="_blank"}
::
