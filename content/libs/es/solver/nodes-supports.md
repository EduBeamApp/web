---
title: Nodos y apoyos
description: "Crea los nodos de un modelo de @edubeam/fem, apóyalos impidiendo grados de libertad, gira los ejes de un apoyo móvil inclinado y modifica nodos tras el cálculo."
order: 3
group: Modelado
source: site
---

# Nodos y apoyos {#nodes-and-supports}

Los nodos son los puntos que unen las barras. Un apoyo no es un objeto aparte: es la lista de grados de libertad que un nodo tiene impedidos. Los fragmentos de esta página forman parte de un programa como el de [Primeros pasos](/es/solver/getting-started) y usan sus `solver`, `domain` y `lc`.

## Crear un nodo {#create-a-node}

```ts
domain.createNode(label, [x, y, z], bcs)
```

| Argumento | Tipo | Significado |
| --- | --- | --- |
| `label` | `string \| number` | Su nombre, guardado como cadena: `1` y `'1'` son el mismo nodo |
| `coords` | `number[]` | `[x, y, z]` en metros, con `y = 0`. El eje z apunta hacia abajo. |
| `bcs` | `DofID[]` | Los grados de libertad que impide el apoyo. Omítelo para un nodo libre. |

Devuelve el `Node`; `domain.getNode(label)` lo vuelve a encontrar. Si la etiqueta ya está en uso, el nodo nuevo sustituye al anterior.

```ts
import { DofID } from '@edubeam/fem'

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [0, 0, -4]) // libre: la cabeza de un pilar de 4 m
```

## Apoyos {#supports}

Cada apoyo de la aplicación EduBeam es un conjunto de GDL impedidos:

| Apoyo | `bcs` | Impide |
| --- | --- | --- |
| Empotramiento | `[DofID.Dx, DofID.Dz, DofID.Ry]` | todo |
| Articulación | `[DofID.Dx, DofID.Dz]` | los dos desplazamientos; el giro queda libre |
| Rodillo | `[DofID.Dz]` | el desplazamiento vertical; rueda según x |
| Rodillo vertical | `[DofID.Dx]` | el desplazamiento horizontal; rueda según z |
| Deslizadera | `[DofID.Dz, DofID.Ry]` | el desplazamiento vertical y el giro; desliza según x |
| Deslizadera vertical | `[DofID.Dx, DofID.Ry]` | el desplazamiento horizontal y el giro; desliza según z |
| Solo giro impedido | `[DofID.Ry]` | el giro |

El orden en que los enumeras es el orden en que llegan las [reacciones](/es/solver/results#reactions). Una estructura necesita al menos tres GDL impedidos, dispuestos de modo que no pueda moverse como un mecanismo: consulta [Cuando el cálculo falla](/es/solver/solving#when-solving-fails).

A un GDL impedido también se le puede imponer un movimiento dado, un asiento de apoyo: consulta [Desplazamientos impuestos](/es/solver/temperature-settlements#prescribed-displacements).

## Apoyos inclinados {#inclined-supports}

Un apoyo móvil sobre un plano inclinado sujeta el nodo en dirección perpendicular a la pendiente, no en vertical. Gira los ejes del nodo con `updateLcs`; a partir de ahí, sus `bcs` se refieren a los ejes girados. En el programa de Primeros pasos, crea B así:

```ts
const b = domain.createNode('B', [6, 0, 0], [DofID.Dz]) // impide el desplazamiento según su propio z
const a = (30 * Math.PI) / 180 // 30°, de x hacia z: horario en la pantalla
b.updateLcs({ locx: [Math.cos(a), 0, Math.sin(a)], locy: [0, 1, 0] })
```

`locx` es el eje x propio del nodo, como vector en ejes globales, y `locy` su eje y, que sigue siendo `[0, 1, 0]`. En la aplicación EduBeam ese mismo ángulo es el *Ángulo del SCL nodal* del nodo, 30°.

Después de `solve()`, B empuja perpendicularmente a la pendiente, y el apoyo articulado de A recoge la componente horizontal:

```ts
b.getReactions(lc).values // [-41569]: N según el z propio de B, 36 kN / cos 30°
b.getReactions(lc, true).values // [20785, -36000, 0]: según x, según z, momento
```

::model-figure{caption="Un apoyo móvil girado 30°: su reacción es perpendicular a la pendiente y la viga queda traccionada"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, N]
show: [nodeLabels]
---
::

La componente vertical sigue siendo $qL/2 = 36$ kN; la horizontal, $36 \tan 30° = 20{,}8$ kN, tracciona la viga desde ambos extremos. El momento no cambia.

En un nodo girado, los desplazamientos y las reacciones están en los ejes propios del nodo, salvo que pases `true` para obtenerlos en ejes globales. Las cargas nodales sobre él son globales salvo que indiques lo contrario: consulta [Cargas nodales](/es/solver/loads#nodal-loads). `node.updateLcs()` sin argumento devuelve los ejes a su posición original.

## Modificar un nodo {#change-a-node}

Un nodo es un objeto normal: cambia `node.coords` para moverlo, o sustituye `node.bcs`, un `Set<DofID>`, para cambiar su apoyo.

```ts
domain.getNode('B').coords = [8, 0, 0] // un vano más largo: basta con solve()
domain.getNode('A').bcs = new Set(fixed) // un apoyo nuevo: hay que renumerar antes
solver.codeNumberGenerated = false
solver.solve()
```

Cambiar los apoyos, o añadir y eliminar nodos, cambia las ecuaciones: sin `codeNumberGenerated = false`, el solver **mantiene los apoyos antiguos sin avisar**. [Volver a resolver tras un cambio](/es/solver/solving#solving-again-after-a-change) indica qué cambios lo necesitan.
