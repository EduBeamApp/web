---
description: "Fuerzas, momentos, asientos y cargas uniformes, trapezoidales, puntuales y térmicas en EduBeam, con su convención de signos: z positiva hacia abajo y momentos positivos antihorarios."
source: site
---

# Cargas

Las cargas actúan en los nodos o a lo largo de los elementos. Todas pertenecen a un **único caso de carga** y actúan a la vez; para comparar escenarios, guarda cada uno como [archivo de proyecto o enlace para compartir](/es/essentials/import-export).

| Carga | Actúa sobre | Dónde se añade |
| --- | --- | --- |
| [Fuerza o momento](#nodal-loads) | un nodo | pestaña *Cargas* → **Añadir carga nodal**, o haz clic en el nodo → **Añadir carga** |
| [Desplazamiento impuesto](#prescribed-displacements-support-settlements) (asiento) | un nodo con apoyo | el mismo diálogo, o haz clic en el nodo → **Imponer desplazamiento** |
| Carga [uniformemente distribuida](#uniformly-distributed-load), [trapezoidal](#trapezoidal-load), [concentrada](#concentrated-load) o [térmica](#temperature-load) | un elemento | pestaña *Cargas* → **Añadir carga de elemento**, o haz clic en el elemento → **Añadir carga** |

## Convención de signos {#sign-convention-in-one-line}

x apunta a la **derecha**, z apunta **hacia abajo** y los momentos son positivos en sentido **antihorario**. Por tanto, un `Fz` o `fz` positivo es una carga hacia abajo, como la gravedad, y una carga hacia arriba es negativa.

::model-figure{caption="Todas estas cargas son positivas: Fx = +10 kN hacia la derecha, Fz = +10 kN hacia abajo, My = +10 kNm en sentido antihorario"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0] }
supports: { A: pin, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: A, fx: 10 }
  - { node: B, fz: 10 }
  - { node: C, my: 10 }
results: []
---
::

| Positivo | Ejes por defecto (z hacia abajo) | [Ejes con y hacia arriba](/es/elements/conventions#y-up-axes) |
| --- | --- | --- |
| Fuerza horizontal `Fx`, `fx` | hacia la derecha | hacia la derecha |
| Fuerza vertical | `Fz`, `fz`: **hacia abajo** | `Fy`, `fy`: **hacia arriba** |
| Momento | `My`: antihorario | `Mz`: antihorario |
| Asiento vertical | `Dz`: hacia abajo | `Dy`: hacia arriba |

Las cargas en los **ejes locales** de un elemento (LCS marcado) siguen, en cambio, al elemento: el eje x local va de su nodo inicial a su nodo final, y el eje z local es el x local girado 90° en sentido horario, hacia la línea discontinua dibujada a lo largo del elemento. Consulta [Orientación del elemento](/es/essentials/elements#element-direction). La convención completa, incluidos los esfuerzos, está en [Sistema de coordenadas y convención de signos](/es/elements/conventions#loads).

## Cargas nodales {#nodal-loads}

Pestaña *Cargas* → **Añadir carga nodal**, o haz clic en un nodo → **Añadir carga**, y deja seleccionado **Fuerza/Momento**. Introduce las fuerzas `Fx`, `Fz` (kN) y el momento `My` (kNm), con los signos de [arriba](#sign-convention-in-one-line); la vista previa dibuja la carga mientras escribes.

![Añadir carga nodal: la vista previa muestra la dirección mientras escribes](/screenshots/es/loads-nodal.webp){.shot-md}

- Las componentes están en ejes **globales**. En un nodo con los ejes girados (un [apoyo inclinado](/es/essentials/nodes-supports#inclined-skewed-supports)), el diálogo añade el selector **Ejes globales** / **Ejes del nudo**. En los ejes del nodo, las componentes, que aparecen como `Fx′` y `Fz′`, actúan según los ejes propios del nodo y giran con ellos si después cambia el ángulo. Al cambiar de ejes, los valores se recalculan para que la carga se quede como estaba.
- Un nodo puede tener varias cargas nodales; se suman.

### Desplazamientos impuestos (asientos de apoyo) {#prescribed-displacements-support-settlements}

Para mover un apoyo una cantidad dada, elige **Desplazamiento impuesto** en el mismo diálogo, o haz clic en un nodo con apoyo → **Imponer desplazamiento**. Introduce los desplazamientos `Dx`, `Dz` (positivos hacia la derecha y hacia abajo, en la [unidad de desplazamiento](/es/essentials/units-settings#units), m por defecto) y el giro `Ry` (rad, positivo en sentido antihorario).

- Solo se pueden imponer los GDL **restringidos**: los demás campos aparecen en gris, y un nodo sin apoyo no puede tener ningún asiento.
- Un nodo tiene como máximo un desplazamiento impuesto. Para cambiarlo, edítalo en lugar de añadir un segundo.
- En un apoyo inclinado, los campos se llaman `Dx′` y `Dz′`: el asiento actúa según los ejes propios del apoyo.

Que un asiento produzca esfuerzos depende de la estructura. El mismo asiento de 10 mm del apoyo B, sin ninguna otra carga:

::div{.shots}

:::model-figure{caption="Biapoyada: la viga solo se inclina; sin reacciones, M = 0"}
---
nodes: { A: [0, 0], B: [5, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

:::model-figure{caption="Continua sobre B: la viga se flecta, M = 21,06 kNm sobre B"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

::

Una estructura isostática sigue al apoyo sin oponer resistencia. La viga continua tiene que flectar: el apoyo B la arrastra hacia abajo $\delta = 10\ \text{mm}$, como una carga puntual en el centro de un vano biapoyado de 10 m. Con $L = 5\ \text{m}$ y el $EI = 17\,548\ \text{kNm}^2$ del acero del ejemplo, esa carga vale $P = 6EI\delta/L^3 = 8{,}423\ \text{kN}$, que es la reacción en B, y $M_B = PL/2 = 3EI\delta/L^2 = 21{,}06\ \text{kNm}$. El [tutorial de la viga continua](/es/tutorials/continuous-beam) combina un asiento con cargas.

## Cargas de elemento {#element-loads}

Pestaña *Cargas* → **Añadir carga de elemento**, o haz clic en un elemento → **Añadir carga**. Elige el **Tipo de carga**; la vista previa muestra la carga sobre el elemento mientras escribes. Las fuerzas van en kN y las cargas lineales en kN/m, o en las [unidades](/es/essentials/units-settings#units) que hayas elegido.

![Añadir carga de elemento, con una carga uniformemente distribuida](/screenshots/es/loads-udl.webp){.shot-md}

### Carga uniformemente distribuida {#uniformly-distributed-load}

Una carga constante por unidad de longitud, `fx` y `fz`, en todo el elemento. Con **LCS** marcado (por defecto) actúan según los ejes locales del elemento; desmarcado, según los ejes globales. En un elemento horizontal dibujado de izquierda a derecha ambas cosas coinciden; en una barra inclinada, no:

| Quieres | Introduce |
| --- | --- |
| una carga **perpendicular** a la barra (viento sobre una viga inclinada de cubierta) | `fz` con LCS **marcado** |
| una carga **vertical** por metro de barra (peso propio) | `fz` con LCS **desmarcado** |
| una carga **vertical** por metro en planta (nieve) | no disponible directamente: multiplícala por $\cos\alpha$, siendo $\alpha$ la inclinación de la barra, e introdúcela como carga vertical |

Los mismos 10 kN/m sobre una viga inclinada de cubierta de 4 m en horizontal y 3 m en vertical, de 5 m de longitud:

::div{.shots}

:::model-figure{caption="LCS desmarcado: vertical, 50 kN en total; M = 25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [M]
---
:::

:::model-figure{caption="LCS marcado: perpendicular a la barra; M = 31,25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10, local: true }
results: [M]
---
:::

::

A mano: perpendicular, $M = qL^2/8 = 10 \cdot 5^2/8 = 31{,}25\ \text{kNm}$; vertical, los 50 kN repartidos en 4 m de luz son 12,5 kN/m en planta, así que $M = 12{,}5 \cdot 4^2/8 = 25\ \text{kNm}$.

### Carga trapezoidal {#trapezoidal-load}

Una carga que varía linealmente a lo largo del elemento: `f1x`, `f1z` en el nodo **inicial** y `f2x`, `f2z` en el nodo **final**. Pon a cero uno de los extremos para obtener una carga triangular.

::model-figure{caption="Carga triangular de 0 a 10 kN/m: reacciones de 10 y 20 kN, M máximo = 23,09 kNm a 3,46 m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: [0, 10] }
results: [M, V]
show: [nodeLabels]
---
::

A mano: la carga total $qL/2 = 30\ \text{kN}$ actúa a $2L/3$, así que $R_A = 10\ \text{kN}$ y $R_B = 20\ \text{kN}$; el cortante se anula, y el momento es máximo, en $x = L/\sqrt{3} = 3{,}46\ \text{m}$, donde $M = qL^2/(9\sqrt{3}) = 23{,}09\ \text{kNm}$.

Las cargas trapezoidales actúan según los **ejes locales** del elemento (la casilla LCS está bloqueada). En un elemento horizontal dibujado de izquierda a derecha, eso equivale a los ejes globales; en uno inclinado, `f1z` y `f2z` son perpendiculares a la barra, y `f1x`, `f2x` van según su eje.

Una carga **vertical** variable sobre una barra de inclinación $\alpha$ también se puede introducir de forma exacta: da en cada extremo sus dos componentes locales, $f_z = q\cos\alpha$ y $f_x = q\sin\alpha$ apuntando pendiente abajo, que es negativa cuando el elemento sube desde su nodo inicial. Para la viga inclinada de antes, de 4 m en horizontal y 3 m en vertical y dibujada desde abajo, una carga vertical que crece de 0 a 10 kN/m de barra es `f1x` = `f1z` = 0, `f2x` = −6 y `f2z` = 8 kN/m.

::model-figure{caption="Carga vertical de 0 a 10 kN/m de barra, introducida con sus componentes locales: reacciones de 8,333 y 16,67 kN, M máximo = 12,83 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qx: [0, -6], qz: [0, 8], local: true }
results: [M]
show: [nodeLabels]
---
::

A mano: la resultante de 25 kN actúa a dos tercios de la luz, a 2,67 m, así que $R_B = 25 \cdot 2{,}667/4 = 16{,}67\ \text{kN}$. Sobre los 4 m en planta la carga es un triángulo que llega a 12,5 kN/m, así que, como antes, $M = 12{,}5 \cdot 4^2/(9\sqrt{3}) = 12{,}83\ \text{kNm}$.

### Carga concentrada {#concentrated-load}

Una fuerza puntual `Fx`, `Fz` o un momento `My` en cualquier punto **a lo largo** de un elemento, sin necesidad de un nodo adicional. **Posición de carga desde el nodo inicial** es su distancia $a$ al nodo inicial, $0 \le a \le L$. Su valor inicial es la mitad de la longitud, redondeada hacia abajo a metros enteros y como máximo 5 m (en unidades estadounidenses, pies enteros y como máximo 15 ft), así que ajústala a la posición real de tu carga. **LCS** funciona como en las cargas uniformes.

::model-figure{caption="20 kN a 2 m en un vano de 6 m: V salta de 13,33 a −6,667 kN, M = 26,67 kNm bajo la carga"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M]
show: [nodeLabels]
---
::

El diagrama de cortantes da un salto igual a `Fz` en el punto de la carga, y el diagrama de momentos presenta allí un punto anguloso: $R_A = 20 \cdot 4/6 = 13{,}33\ \text{kN}$, $M = 13{,}33 \cdot 2 = 26{,}67\ \text{kNm}$. Un `My` concentrado hace saltar, en cambio, el diagrama de momentos.

### Carga térmica {#temperature-load}

| Campo | Significado | Efecto |
| --- | --- | --- |
| **ΔT<sub>c</sub>**, cambio térmico axial | la misma variación en toda la sección | alargamiento $\alpha\,\Delta T_c\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>** | variación de las fibras inferiores menos la de las superiores | curvatura $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

Ambos son *variaciones* de temperatura respecto al estado sin tensiones, en °C por defecto; una variación de 1 °C equivale a 1 K. Las cargas térmicas usan el **α** del material y la **altura h** de la sección. Las fibras **inferiores** están en el lado de la línea discontinua. Un ΔT<sub>b</sub> − ΔT<sub>t</sub> positivo (más caliente abajo) alarga las fibras inferiores, así que el elemento flecta hacia abajo como una viga bajo carga gravitatoria.

En una estructura isostática, la temperatura solo produce desplazamientos. Las coacciones (extremos empotrados, continuidad, barras redundantes) la convierten en esfuerzos. La misma viga de acero de 6 m y 0,3 m de canto, 20 K más caliente abajo que arriba:

::div{.shots}

:::model-figure{caption="Biapoyada: flecha de 3,6 mm en el centro del vano, M = 0"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [w, M]
---
:::

:::model-figure{caption="Biempotrada: se mantiene recta, M = −14,04 kNm en toda su longitud"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [M, w]
---
:::

::

A mano: la curvatura libre es $\kappa = \alpha\,\Delta T/h = 12 \times 10^{-6} \cdot 20/0{,}3 = 8 \times 10^{-4}\ \text{1/m}$. Biapoyada, la viga la adopta libremente y su flecha es $\kappa L^2/8 = 3{,}6\ \text{mm}$. Con los extremos empotrados, un momento constante debe anularla: $M = -EI\kappa = -17\,548 \cdot 8 \times 10^{-4} = -14{,}04\ \text{kNm}$. En [Comprobar resultados a mano](/es/guide/verification#temperature-gradient-on-a-simply-supported-beam) se resuelve otro caso.

## Editar y eliminar cargas {#editing-and-removing-loads}

| Para | Haz esto |
| --- | --- |
| Cambiar valores rápidamente | Edita las componentes (y la casilla LCS) directamente en la pestaña *Cargas*. |
| Abrir el diálogo de edición | Haz doble clic en la carga en el visor, o haz clic en ella → **Editar carga**. Las cargas aparecen también como botones en las tablas *Nodos* y *Elementos*; haz clic en uno para editar esa carga. |
| Eliminarla | Selecciónala y pulsa <kbd>Supr</kbd>, haz clic en ella → **Eliminar**, o usa la × de la pestaña *Cargas*. |

Las cargas pertenecen a su nodo o elemento: al eliminar el nodo o el elemento se eliminan con él, y al copiarlo con sus cargas seleccionadas se copian también.

![La pestaña Cargas: una fila por carga, con sus componentes editables directamente](/screenshots/es/loads-table.webp)

## Qué no está disponible {#what-is-not-available}

::div{.limits}
- **Un solo caso de carga.** No hay combinaciones: guarda cada caso en su propio archivo o enlace.
- **Sin peso propio.** Añádelo como carga uniforme con LCS desmarcado: $f_z = \rho\,g\,A$, p. ej. $\approx 0{,}22\ \text{kN/m}$ para un IPE 200.
- **Cargas trapezoidales solo en ejes locales.** Para una carga vertical variable sobre una barra inclinada, introduce sus [componentes locales](#trapezoidal-load).
- **Sin cargas lineales parciales.** Una carga lineal cubre todo el elemento: añade un nodo donde empieza o termina.
::
