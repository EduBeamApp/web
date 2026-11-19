---
title: Cálculo
description: "Qué hace solve() en @edubeam/fem, cuándo renumerar las ecuaciones tras cambiar un modelo, cómo reconocer un mecanismo y qué tamaño de modelo admite."
order: 9
group: Cálculo y resultados
source: site
---

# Cálculo {#solving}

```ts
solver.solve()
```

`solve()` numera las ecuaciones, ensambla la matriz de rigidez global y los vectores de carga de todos los casos de carga, y resuelve los desplazamientos y las reacciones. Después ya se puede leer cualquier [resultado](/es/solver/results); antes, leer uno lanza un `TypeError`. Los pasos son los de [Cómo resuelve EduBeam un modelo](/es/elements/analysis), en el manual teórico.

La solución es exacta para el modelo lineal: la deformada y los esfuerzos a lo largo de cada barra salen de soluciones analíticas de la viga de Timoshenko, así que no hay ninguna malla que refinar ni hace falta dividir las barras para obtener diagramas precisos.

`solve()` no escribe nada en la consola a partir de la versión 0.3.1; la 0.3.0 mostraba en cada llamada una línea como `Solution took 9 [ms]`.

## Volver a resolver tras un cambio {#solving-again-after-a-change}

Si solo cambias números del modelo, basta con otro `solve()`. Si cambias qué ecuaciones hay, antes hace falta una línea más:

```ts
domain.createNode('C', [10, 0, 0], [DofID.Dz])
domain.createBeam2D(2, ['B', 'C'], 1, 1)
solver.codeNumberGenerated = false // los GDL han cambiado: hay que volver a numerarlos
solver.solve()
```

| Cambio | Después |
| --- | --- |
| Valores de las cargas, cargas nuevas o eliminadas | `solve()` |
| Coordenadas de los nodos, materiales, secciones, rótulas | `solve()` |
| Añadir nodos o barras | `codeNumberGenerated = false` y luego `solve()` |
| Eliminar nodos o barras: `domain.nodes.delete(label)`, `domain.elements.delete(label)` | `codeNumberGenerated = false` y luego `solve()` |
| Cambiar los apoyos de un nodo, `node.bcs` | `codeNumberGenerated = false` y luego `solve()` |

Si lo olvidas después de añadir un nodo, `solve()` lanza un `TypeError`. Si lo olvidas después de cambiar un apoyo, resuelve **sin avisar** con los apoyos antiguos. En caso de duda, ponlo a `false`: numerar no cuesta casi nada. Eliminar una barra también obliga a eliminar sus cargas de `lc.elementLoadList`; si no, `solve()` lanza un `RangeError` por la barra que falta.

Para muchas variantes de un mismo modelo, como en un estudio paramétrico, es más sencillo e igual de rápido crear un solver nuevo para cada una: consulta el [ejemplo de la línea de influencia](/es/solver/scripts#an-influence-line-as-csv).

## Cuando el cálculo falla {#when-solving-fails}

Una estructura que puede moverse sin deformarse, un mecanismo, tiene una matriz de rigidez singular. A veces `solve()` lo detecta y lanza un error:

```text
Error: Linear system cannot be solved since matrix is singular
```

A menudo no lo detecta: los errores de redondeo hacen que la matriz parezca resoluble, y obtienes desplazamientos de $10^{12}$ m, o números de aspecto razonable para una estructura que puede deslizar libremente. Una viga sobre dos apoyos móviles, por ejemplo, se resuelve sin quejarse mientras nada la empuje lateralmente. Así que comprueba tú mismo los apoyos, y toma los desplazamientos enormes como señal de un mecanismo.

Causas típicas:

- muy pocos apoyos, como una viga sobre dos apoyos móviles;
- apoyos que no pueden sujetar la estructura: todos paralelos, o todos dirigidos hacia un mismo punto;
- una rótula de más, como tres en línea;
- un momento aplicado en un nudo en el que todos los extremos de barra tienen rótula.

El mensaje no dice dónde está el problema. La aplicación EduBeam busca mecanismos antes de resolver, y encuentra y anima el movimiento; construir allí el mismo modelo suele ser la forma más rápida de verlo. [Solución de problemas](/es/reference/troubleshooting) enumera las causas habituales.

Si falta un nodo, un material o una sección, se lanza un `RangeError` que lo nombra. Si faltan parámetros de la sección, no se lanza nada: todos los resultados son `NaN`. Consulta [Materiales y secciones](/es/solver/materials-sections#cross-section).

## Tamaño del modelo {#model-size}

El solver usa matrices densas, pensadas para modelos del tamaño de los de clase. En un portátil, en Node, una fila recta de barras se resuelve aproximadamente en:

| Barras | GDL | Tiempo |
| --- | --- | --- |
| 50 | 150 | 0,1 s |
| 100 | 300 | 0,2 s |
| 200 | 600 | 1 s |
| 400 | 1200 | 10 s |

Cada vez que el modelo dobla su tamaño, el cálculo tarda entre seis y nueve veces más.

Todos los ejercicios, pórticos y celosías de un curso de análisis estructural caben con holgura. No está pensado para modelos de miles de barras.

## Sin otros tipos de análisis {#no-other-analyses}

Esta versión solo resuelve estática lineal. El código fuente contiene un solver de valores propios para frecuencias naturales, pero no forma parte del paquete publicado: `EigenValueDynamicSolver` no se puede importar desde `@edubeam/fem`.
