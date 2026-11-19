---
title: Primeros pasos
description: "Instala @edubeam/fem, el solver de elementos finitos de EduBeam, y resuelve, comprueba y lee una viga biapoyada con una docena de líneas de TypeScript."
order: 1
group: Introducción
source: site
---

# Primeros pasos {#getting-started}

@edubeam/fem es el solver de elementos finitos en el que se basa [EduBeam]{.edubeam}: todos los diagramas, reacciones y flechas que muestra la aplicación salen de él. Con esta biblioteca puedes resolver vigas, pórticos y celosías planas desde tu propio código, en el navegador o en Node: generar ejercicios con sus soluciones, corregir tareas, hacer estudios paramétricos o poner un motor de cálculo detrás de una página web.

::div{.actions}
[Resuelve tu primera viga](#a-simply-supported-beam) [Ver los programas de ejemplo](/es/solver/beams)
::

Está escrita en TypeScript, incluye sus propios tipos y es software libre bajo la licencia GPL-3.0. La creó Bořek Patzák y la desarrolla junto con Jan Voříšek y otros colaboradores.

## Instalación {#install}

```bash
npm install @edubeam/fem
```

Funciona con `import` y con `require`, en el navegador y en Node 18 o posterior, y tiene una sola dependencia, [mathjs](https://mathjs.org). Hasta la versión 0.3.0 se instalaba desde GitHub con el nombre `ts-fem`: si la usabas así, cambia tus imports a `@edubeam/fem`. No cambió nada más.

Para probar el ejemplo de abajo en una carpeta vacía, conviértela en un proyecto que use `import` y después instala el paquete:

```bash
npm init -y
npm pkg set type=module
npm install @edubeam/fem
```

Sin `"type": "module"` en `package.json` el ejemplo también funciona, pero Node muestra antes un aviso.

## Tu primera viga {#a-simply-supported-beam}

Una viga de acero IPE 200 de 6 m, sobre un apoyo articulado y un apoyo móvil, con una carga de 12 kN/m:

```ts [beam.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver

// Unidades SI en todo: m, N, Pa. Acero y un IPE 200.
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

// Nodos en [x, y, z], en metros, con los GDL que impide su apoyo
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // apoyo articulado
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // apoyo móvil
const beam = domain.createBeam2D(1, ['A', 'B'], 'steel', 'IPE200')

// 12 kN/m según el eje z local de la barra: hacia abajo en una viga dibujada de izquierda a derecha
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad(1, [0, 12e3], true)

solver.solve()

console.log(beam.computeBendingMomentAt(lc, 3)) // N·m en el centro del vano
console.log(beam.computeShearForceAt(lc, 0)) // N en A
console.log(beam.computeLocalDefl(lc, 2).w[1]) // m en el centro del vano
```

Guárdalo como `beam.ts` y ejecútalo con `node beam.ts`: Node 22.18 y posteriores ejecutan TypeScript directamente. El archivo no tiene anotaciones de tipo, así que con un Node más antiguo basta con guardarlo como `beam.mjs`. Muestra:

```text [Salida]
54000
36000
0.04990940552616746
```

Son los valores de los libros de texto, $M = qL^2/8 = 54$ kNm y $V = qL/2 = 36$ kN. Aquí tienes la misma viga, resuelta en tu navegador por el mismo solver:

::model-figure{caption="La viga del ejemplo: 6 m, IPE 200, 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9, g: 81e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 0.8333333 }
---
::

La flecha, 49,91 mm, es 0,28 mm mayor que la de Euler–Bernoulli, $5qL^4/384EI = 49{,}63$ mm. No es un error: la barra es una viga de Timoshenko, y esos 0,28 mm son $qL^2/8kGA$, la deformación por cortante de esta viga. Si das a `k` un valor enorme, como `1e32`, la diferencia desaparece: consulta [Deformación por cortante](/es/solver/materials-sections#shear-deformation).

## Qué hace el código {#what-the-code-does}

::div{.steps}
### Crea un solver {#make-a-solver}

`new LinearStaticSolver()` trae un `domain` vacío, que contiene el modelo, y un caso de carga, `solver.loadCases[0]`.

### Describe el modelo {#describe-the-model}

Materiales y secciones, nodos con sus apoyos y, después, barras entre los nodos. Todo tiene una etiqueta, una cadena o un número, con la que el resto del modelo se refiere a ello. Consulta [Nodos y apoyos](/es/solver/nodes-supports), [Materiales y secciones](/es/solver/materials-sections) y [Barras y rótulas](/es/solver/members-hinges).

### Cárgalo {#load-it}

Las cargas pertenecen a un caso de carga: fuerzas en los nodos, cargas en las barras, cargas térmicas y asientos. Consulta [Cargas nodales y en barras](/es/solver/loads).

### Resuelve {#solve}

`solver.solve()` ensambla y resuelve todos los casos de carga. Consulta [Cálculo](/es/solver/solving).

### Lee los resultados {#read-the-results}

Esfuerzos en cualquier punto de una barra, flechas, fuerzas en los extremos, desplazamientos de los nodos y reacciones. Consulta [Lectura de resultados](/es/solver/results) y, para los diagramas, [Dibujar los resultados](/es/solver/drawing).
::

## Unidades y signos en resumen {#axes-and-signs}

Las unidades entran en SI y los resultados salen en SI. El modelo está en el plano x–z con el **eje z hacia abajo**, así que una `fz` positiva empuja hacia abajo y la cabeza de un pilar de 4 m está en $z = -4$. Las posiciones en una barra se miden en metros desde su primer nodo. El momento positivo es el que tracciona la fibra inferior. [Unidades y signos](/es/solver/conventions) tiene la lista completa.

## Seis errores frecuentes {#pitfalls}

1. **El eje z apunta hacia abajo.** Las cargas gravitatorias son positivas, y todo lo que está por encima de los apoyos tiene z negativa. Consulta [Ejes](/es/solver/conventions#axes).
2. **La orientación de una barra fija el signo de M y w.** Define las vigas de izquierda a derecha y los pilares de abajo arriba, y los signos saldrán como en un libro de texto. Consulta [Orientación de la barra](/es/solver/conventions#member-direction).
3. **Un parámetro que falta da `NaN` o un disparate, no un error.** Una sección necesita `a`, `iy` y `k`; un material necesita `e`, y también `g` salvo que `k` sea enorme. Consulta [Materiales y secciones](/es/solver/materials-sections).
4. **Después de añadir nodos o barras, o de cambiar apoyos,** pon `solver.codeNumberGenerated = false` antes de volver a resolver. Consulta [Volver a resolver tras un cambio](/es/solver/solving#solving-again-after-a-change).
5. **Las reacciones llegan como una matriz de mathjs o como un array,** en el orden en que se dieron los GDL del apoyo. Consulta [Reacciones](/es/solver/results#reactions).
6. **Un mecanismo no siempre lanza una excepción.** Un desplazamiento de $10^{12}$ m significa que la estructura puede moverse libremente. Consulta [Cuando el cálculo falla](/es/solver/solving#when-solving-fails).

## Siguientes pasos {#next}

::card-grid{cols="2"}
:::card{title="Programas de ejemplo" icon="lucide:book-open" to="/es/solver/beams"}
Programas completos y comprobados: vigas, pórticos, celosías, una hoja de ejercicios con sus soluciones y un pequeño servidor HTTP.
:::
:::card{title="Dibuja los resultados" icon="lucide:chart-spline" to="/es/solver/drawing"}
Pasa un modelo resuelto a @edubeam/plot y obtén sus diagramas en SVG, en Vue o desde un script de Node.
:::
:::card{title="Referencia de la API" icon="lucide:list-tree" to="/es/solver/reference"}
Todas las clases, métodos y argumentos, con sus unidades y lo que devuelven.
:::
:::card{title="La teoría" icon="lucide:sigma" to="/es/elements/beam"}
El elemento viga, su matriz de rigidez y su transformación, en el manual teórico de EduBeam.
:::
::
