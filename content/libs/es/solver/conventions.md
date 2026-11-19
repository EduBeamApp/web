---
title: Unidades y signos
description: "Las unidades, los ejes, los grados de libertad y la convención de signos de @edubeam/fem, y cómo la orientación de una barra cambia el signo de sus resultados."
order: 2
source: site
---

# Unidades y signos {#units-and-signs}

El solver no tiene un sistema de unidades propio: calcula con los números que le das. Si le das SI, todos los resultados salen en SI. Los ejemplos de estas páginas, y la aplicación EduBeam, lo hacen siempre así. Los signos también son los de la aplicación; su manual teórico los explica con figuras en [Sistema de coordenadas y convención de signos](/es/elements/conventions).

## Unidades {#units}

| Magnitud | Unidad | Ejemplo |
| --- | --- | --- |
| Coordenadas, longitudes, posiciones en una barra | m | `[6, 0, 0]` |
| Fuerzas | N | `20e3` para 20 kN |
| Momentos | N·m | `10e3` para 10 kNm |
| Cargas lineales | N/m | `12e3` para 12 kN/m |
| Módulo de Young y módulo de cortante | Pa | `210e9` |
| Área | m² | `28.5e-4` para 28,5 cm² |
| Momento de inercia | m⁴ | `1943e-8` para 1943 cm⁴ |
| Variación de temperatura | K | `20` |
| Coeficiente de dilatación térmica | 1/K | `12e-6` |
| Desplazamientos, giros | m, rad | `0.01` para 10 mm |

Sirve cualquier sistema coherente, por ejemplo kN, m y kPa, con el que los resultados salen en kN y kNm. Con SI te ahorras comprobarlo.

## Ejes {#axes}

- **x** apunta a la derecha, **z apunta hacia abajo** y el modelo está en el plano x–z. Las coordenadas se escriben `[x, y, z]`, con `y = 0`.
- **y** apunta hacia ti, saliendo de la pantalla. Los giros y los momentos son alrededor de y, así que uno positivo va en **sentido antihorario** en la pantalla.
- El **eje x local** de una barra va de su primer nodo al segundo. Su **eje z local** es el x local girado 90° en sentido horario en la pantalla: en una barra dibujada de izquierda a derecha, apunta hacia abajo.

Como z apunta hacia abajo, una carga gravitatoria es una `fz` positiva, y la cabeza de un pilar de 4 m apoyado en $z = 0$ está en $z = -4$.

## Grados de libertad {#degrees-of-freedom}

Cada nodo de un modelo con `Beam2D` tiene tres grados de libertad, que nombra el enum `DofID`:

| `DofID` | Valor | Significado |
| --- | --- | --- |
| `DofID.Dx` | 0 | Desplazamiento según x |
| `DofID.Dz` | 2 | Desplazamiento según z, hacia abajo |
| `DofID.Ry` | 4 | Giro alrededor de y, antihorario |

`Dy`, `Rx` y `Rz` (1, 3, 5) existen en el enum, pero las barras planas no los usan.

## Signos de los resultados {#signs-of-the-results}

| Resultado | Positivo significa | Se lee con |
| --- | --- | --- |
| Esfuerzo axil N | tracción | `computeNormalForceAt` |
| Momento flector M | tracción en el lado +z local: fibra inferior traccionada, en una viga dibujada de izquierda a derecha | `computeBendingMomentAt` |
| Esfuerzo cortante V | M crece según el x local, $V = dM/dx$; en una viga dibujada de izquierda a derecha hace girar un trozo en sentido horario: $+qL/2$ en el apoyo izquierdo de una viga biapoyada | `computeShearForceAt` |
| Flecha w | según +z local: hacia abajo, en una viga dibujada de izquierda a derecha | `computeLocalDefl` |
| Desplazamiento nodal | según +x, +z (hacia abajo), antihorario | `node.getUnknowns` |
| Reacción | la fuerza que el apoyo ejerce sobre la estructura, según +x, +z (hacia abajo), antihoraria | `node.getReactions` |
| Fuerzas en los extremos | las fuerzas que los nodos ejercen sobre la barra, en sus ejes locales | `computeEndForces` |

Por eso el apoyo articulado de una viga cargada hacia abajo da una reacción de −36 000 N según z: 36 kN empujando hacia arriba.

## Posiciones en una barra {#positions-along-a-member}

Todos los métodos `…At(lc, x)` reciben `x` en metros desde el primer nodo de la barra, no como fracción de su longitud. Las cargas puntuales en una barra se sitúan del mismo modo.

## Orientación de la barra {#member-direction}

M y w se miden en los ejes propios de la barra, así que el orden de sus dos nodos importa. Tomemos la viga de 12 kN/m de [Primeros pasos](/es/solver/getting-started), definida en los dos sentidos con la carga en ejes globales, `[0, 12e3], false`, para que empuje hacia abajo en ambos casos, y leída con `computeBendingMomentAt(lc, 3)`, `computeLocalDefl(lc, 2).w[1]` y `computeShearForceAt`:

| Barra | M en el centro del vano | w en el centro del vano | V en A |
| --- | --- | --- | --- |
| `['A', 'B']`, de izquierda a derecha | +54 000 N·m | +0,0499 m | +36 000 N, en `x = 0` |
| `['B', 'A']`, de derecha a izquierda | −54 000 N·m | −0,0499 m | +36 000 N, en `x = 6` |

Definida de derecha a izquierda, su eje z local apunta hacia arriba, así que la misma viga, con la fibra inferior traccionada, da un momento negativo y una flecha hacia arriba. N y V conservan su signo en cada punto de la viga; solo `x` se mide desde el otro extremo. Una carga dada en ejes locales (`true`) gira con la barra: en la viga definida de derecha a izquierda, `[0, 12e3], true` empuja hacia arriba.

::callout{type="tip" title="Define las barras tal como las dibujas"}
Vigas de izquierda a derecha, pilares de abajo arriba, y los signos salen como en un libro de texto. En un pilar definido de abajo arriba el eje z local apunta a la derecha, así que la tracción en la cara derecha es un momento positivo. El [ejemplo del pórtico](/es/solver/frames#things-to-notice) lo muestra.
::
