---
title: Referencia de la API
description: "Todas las clases, métodos y argumentos de @edubeam/fem 0.3, con sus unidades, sus valores por defecto y la forma de lo que devuelve cada uno."
order: 16
group: Referencia
source: site
---

# Referencia de la API {#api-reference}

Lo que exporta `@edubeam/fem` 0.3, agrupado según para qué se usa. Las unidades son SI en todo: m, N, N·m, N/m, Pa, K y rad. Las etiquetas (`LabelType`) son `string | number` y se guardan como cadenas. Los métodos que no aparecen aquí son internos: son públicos en TypeScript solo porque los llaman las propias clases del solver.

## Exportaciones {#exports}

| Exportación | Tipo | Sección |
| --- | --- | --- |
| `LinearStaticSolver` | clase | [Análisis](#analyses) |
| `Solver` | clase abstracta | [Análisis](#analyses) |
| `Domain` | clase | [Domain](#domain) |
| `Node` | clase | [Node](#node) |
| `Beam2D`, `Element` | clases | [Elementos](#elements) |
| `Material`, `CrossSection` | clases | [Materiales y secciones](#materials-and-sections) |
| `LoadCase` | clase | [Cargas](#loads) |
| `NodalLoad`, `BeamConcentratedLoad`, `BeamElementUniformEdgeLoad`, `BeamElementTrapezoidalEdgeLoad`, `BeamTemperatureLoad`, `PrescribedDisplacement`, `Load`, `BeamElementLoad` | clases | [Cargas](#loads) |
| `DofID` | enum | [DofID](#dofid) |
| `LabelType`, `EnumDictionary`, `MaterialParameters`, `CrossSectionParameters` | tipos | |

## Análisis {#analyses}

### `LinearStaticSolver` {#linearstaticsolver}

```ts
const solver = new LinearStaticSolver()
```

| Miembro | Tipo | Descripción |
| --- | --- | --- |
| `domain` | `Domain` | El modelo |
| `loadCases` | `LoadCase[]` | Empieza con un caso, `'DefaultLC'`. Añade más con `new LoadCase(label, solver.domain)`: [Casos de carga](/es/solver/load-cases). |
| `solve()` | `void` | Numera las ecuaciones si hace falta, ensambla y resuelve todos los casos de carga. Puede lanzar una excepción ante un [mecanismo](/es/solver/solving#when-solving-fails), pero no siempre lo hace. No escribe nada desde la 0.3.1; la 0.3.0 mostraba su tiempo. |
| `codeNumberGenerated` | `boolean` | Ponlo a `false` después de añadir o eliminar nodos o barras, o de cambiar apoyos: [por qué](/es/solver/solving#solving-again-after-a-change) |
| `neq`, `pneq` | `number` | Número de GDL libres y de GDL impedidos, después de resolver |
| `k` | `Matrix` de mathjs | La matriz de rigidez global ensamblada, después de resolver |
| `getNodeDofIDs(label)` | `number[]` | Los GDL que tiene un nodo, después de resolver |

`EigenValueDynamicSolver` existe en el código fuente, pero no se exporta.

## Domain {#domain}

`solver.domain` guarda el modelo en cuatro `Map` cuya clave es la etiqueta como cadena: `nodes`, `elements`, `materials`, `crossSections`. No hay métodos para eliminar: `domain.nodes.delete(label)` y `domain.elements.delete(label)` eliminan un nodo o una barra, y después hay que [renumerar](/es/solver/solving#solving-again-after-a-change).

| Método | Devuelve | Descripción |
| --- | --- | --- |
| `createNode(label, coords?, bcs?)` | `Node` | `coords` `[x, y, z]` en m (por defecto `[0, 0, 0]`), `bcs` los `DofID` impedidos (por defecto ninguno) |
| `createBeam2D(label, nodes, mat, cs, hinges?)` | `Beam2D` | `nodes` `[first, second]`, `hinges` `[atFirst, atSecond]` (por defecto `[false, false]`) |
| `createMaterial(label, params?)` | `Material` | Consulta [Materiales y secciones](#materials-and-sections) |
| `createCrossSection(label, params?)` | `CrossSection` | Consulta [Materiales y secciones](#materials-and-sections) |
| `getNode(label)`, `getElement(label)`, `getMaterial(label)`, `getCS(label)` | el objeto | Lanza un `RangeError` si la etiqueta no existe. `getElement` tiene el tipo `Element`: escribe `as Beam2D` para leer resultados. |

Crear un objeto con una etiqueta que ya está en uso sustituye al anterior.

## Node {#node}

| Miembro | Tipo | Descripción |
| --- | --- | --- |
| `label` | `string` | |
| `coords` | `number[]` | `[x, y, z]`, m. Cámbialo para mover el nodo. |
| `bcs` | `Set<DofID>` | GDL impedidos. Sustitúyelo para cambiar el apoyo. |
| `lcs` | `number[][] \| undefined` | Los ejes girados del nodo, si los tiene |
| `updateLcs({ locx, locy }?)` | `void` | Gira los ejes del nodo: `locx` es su eje x en componentes globales, `locy` es `[0, 1, 0]`. Sin argumento, los restablece. |
| `hasLcs()` | `boolean` | Si los ejes están girados |
| `getUnknowns(lc, dofs)` | `Matrix`, o un `number` para un solo GDL | Desplazamientos (m) y giros (rad), en los ejes del nodo |
| `getReactions(lc, global?)` | `{ dofs, values }` | Reacciones en los GDL impedidos, en el orden de `bcs`: N, N·m. `values` es una `Matrix` de mathjs si hay varias, un array de un elemento si hay una, y `[]` en un nodo libre. Con `global` igual a `true` en un nodo girado: los tres GDL en ejes globales, `dofs` `[0, 2, 4]`, `values` un array con 0 donde no hay nada impedido. [Cómo leerlas](/es/solver/results#reactions). |

## Elementos {#elements}

### `Beam2D` {#beam2d}

Una viga de Timoshenko de dos nodos en el plano x–z, con tres GDL por nodo (`Dx`, `Dz`, `Ry`). `x` se da en metros desde el primer nodo; `n` es un número de segmentos, que da n + 1 puntos.

| Miembro | Devuelve | Descripción |
| --- | --- | --- |
| `label`, `nodes`, `mat`, `cs` | `string`, `string[]`, `string`, `string` | |
| `hinges` | `[boolean, boolean]` | Liberación del momento en el primer y en el segundo nodo |
| `computeNormalForceAt(lc, x)` | `number` | N, positivo en tracción |
| `computeShearForceAt(lc, x)` | `number` | V, positivo donde M crece según el x local |
| `computeBendingMomentAt(lc, x)` | `number` | M, positivo con tracción en el lado +z local |
| `computeNormalForce(lc, n)` | `{ x, N }` | N en n + 1 puntos |
| `computeShearForce(lc, n)` | `{ x, V }` | V en n + 1 puntos |
| `computeBendingMoment(lc, n)` | `{ x, M }` | M en n + 1 puntos |
| `computeLocalDefl(lc, n)` | `{ u, w }` | Desplazamientos según la barra y perpendiculares a ella, en ejes locales, m |
| `computeGlobalDefl(lc, n)` | `{ u, w }` | Lo mismo en x y z globales |
| `computeEndForces(lc)` | `Matrix` | `[X12, Z12, M12, X21, Z21, M21]`, las fuerzas que los nodos ejercen sobre la barra, en ejes locales |
| `computeEndDisplacement(lc)` | `Matrix` | Desplazamientos de los extremos en ejes locales, incluidos los giros de las rótulas |
| `computeGeo()` | `{ l, dx, dz }` | Longitud y proyecciones, m |
| `computeT()` | `Matrix` | Transformación de 6 × 6, de ejes globales a locales |
| `computeLocalStiffnessMtrx()` | `{ answer }` | `answer`: rigidez local de 6 × 6, con las rótulas condensadas |
| `computeStiffness()` | `Matrix` | Rigidez global de 6 × 6 |
| `computeShearFactor()` | `number` | $\Phi = 12EI_y/kGAL^2$ |
| `getMaterial()`, `getCS()` | `Material`, `CrossSection` | |

En una carga puntual, los métodos `…At` devuelven el valor justo después de ella. `Element` es la clase base abstracta de `Beam2D`; es el tipo que usan `domain.elements` y `getElement`.

## Materiales y secciones {#materials-and-sections}

| `MaterialParameters` | Unidad | Por defecto | Se usa para |
| --- | --- | --- | --- |
| `e` | Pa | 1 | la rigidez |
| `g` | Pa | 1 | la rigidez a cortante |
| `alpha` | 1/K | 1 | las cargas térmicas |
| `d` | kg/m³ | 1 | nada en estática |

| `CrossSectionParameters` | Unidad | Por defecto | Se usa para |
| --- | --- | --- | --- |
| `a` | m² | ninguno, obligatorio | la rigidez axil y a cortante |
| `iy` | m⁴ | ninguno, obligatorio | la rigidez a flexión |
| `k` | – | ninguno, obligatorio | la rigidez a cortante $kGA$; `1e32` para despreciar la deformación por cortante |
| `h` | m | ninguno | los gradientes térmicos (`NaN` sin él) |
| `iz`, `dyz`, `j` | m⁴ | ninguno | no los usa `Beam2D` |

Un parámetro de material que falta vale 1, no un valor típico; si falta `a`, `iy` o `k`, todos los resultados son `NaN`. Ninguno de los dos casos lanza un error. Las dos clases tienen un método `change(params)` que fija los parámetros dados, y los guardan como propiedades con los mismos nombres.

## Cargas {#loads}

### `LoadCase` {#loadcase}

| Método | Devuelve | Valores |
| --- | --- | --- |
| `createNodalLoad(node, values, lcs?)` | `NodalLoad` | `{ [DofID.Dx]: N, [DofID.Dz]: N, [DofID.Ry]: N·m }`; `lcs` (por defecto `false`) igual a `true`: en los ejes girados del nodo |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | `BeamElementUniformEdgeLoad` | N/m en toda la barra |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | `BeamElementTrapezoidalEdgeLoad` | N/m en el primer y en el segundo nodo, con variación lineal entre ellos |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | `BeamConcentratedLoad` | N, N, N·m, a `a` m del primer nodo |
| `createBeamTemperatureLoad(el, [dTc, dTb, dTt])` | `BeamTemperatureLoad` | K: centro de gravedad, fibra inferior, fibra superior |
| `createPrescribedDisplacement(node, values)` | `PrescribedDisplacement` | `{ [DofID.Dz]: m, … }` en GDL impedidos, en los ejes del nodo; se ignora en GDL libres |

En las cargas en barras, `lcs` igual a `true` significa ejes locales (x según la barra, z perpendicular a ella), y `false`, ejes globales. Las cargas lineales son por metro de longitud de la barra. [Cargas nodales y en barras](/es/solver/loads) tiene ejemplos.

| Miembro | Tipo | Descripción |
| --- | --- | --- |
| `label` | `string` | |
| `nodalLoadList` | `NodalLoad[]` | |
| `elementLoadList` | `BeamElementLoad[]` | Cargas en barras y cargas térmicas |
| `prescribedBC` | `PrescribedDisplacement[]` | |
| `solved` | `boolean` | `true` tras un cálculo correcto |
| `getElementLoadsOnElement(el)` | `BeamElementLoad[]` | Las cargas sobre una barra |

Los objetos de carga guardan sus valores en propiedades públicas, que puedes cambiar antes de volver a resolver: `values` (y `lcs`) en `NodalLoad`, `BeamElementUniformEdgeLoad`, `BeamConcentratedLoad` y `BeamTemperatureLoad`; `startValues` y `endValues` en `BeamElementTrapezoidalEdgeLoad`; `prescribedValues` en `PrescribedDisplacement`. Cada uno tiene un `target`, la etiqueta del objeto sobre el que actúa.

## DofID {#dofid}

| Nombre | Valor | Lo usa `Beam2D` |
| --- | --- | --- |
| `Dx` | 0 | sí |
| `Dy` | 1 | no |
| `Dz` | 2 | sí |
| `Rx` | 3 | no |
| `Ry` | 4 | sí |
| `Rz` | 5 | no |

## Resultados {#results}

Los resultados se leen de un `Beam2D` (esfuerzos, flechas, fuerzas en los extremos) y de un `Node` (desplazamientos, reacciones), siempre para un `LoadCase` dado y después de `solve()`: consulta las dos tablas anteriores, y [Lectura de resultados](/es/solver/results) para ver ejemplos y los signos. En resumen:

| Para obtener | Llamada |
| --- | --- |
| Reacciones, N y N·m | `node.getReactions(lc)` |
| Desplazamientos, m, y giros, rad | `node.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])` |
| N, V o M en un punto, N y N·m | `beam.computeNormalForceAt(lc, x)`, `computeShearForceAt`, `computeBendingMomentAt` |
| N, V o M a lo largo de una barra | `beam.computeNormalForce(lc, n)`, `computeShearForce`, `computeBendingMoment` |
| Deformada, m | `beam.computeLocalDefl(lc, n)`, `computeGlobalDefl` |
| Fuerzas en los extremos, N y N·m | `beam.computeEndForces(lc)` |
| Una figura con todo ello | `StructurePlot` o `structureSvg`, de [@edubeam/plot](/es/solver/drawing) |
