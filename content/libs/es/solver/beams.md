---
title: Vigas
description: "Programas completos de @edubeam/fem para un voladizo y una viga continua de dos vanos, con su salida, cada uno comprobado con su fórmula de libro de texto."
order: 12
group: Programas de ejemplo
source: site
---

# Vigas {#beams}

Dos programas completos para copiar y modificar. Los dos usan una sección rígida a cortante (`k: 1e32`), así que sus números coinciden exactamente con las fórmulas de Euler–Bernoulli. Ejecútalos con `node cantilever.ts` (Node 22.18 o posterior), en una carpeta preparada como en [Instalación](/es/solver/getting-started#install).

## Un voladizo {#a-cantilever}

De 4 m de longitud, empotrado en A, con 18 kN hacia abajo en el extremo libre:

```ts [cantilever.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // empotramiento
const tip = domain.createNode('B', [4, 0, 0]) // libre
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
lc.createNodalLoad('B', { [DofID.Dz]: 18e3 }) // 18 kN hacia abajo en el extremo libre
solver.solve()

console.log(beam.computeBendingMomentAt(lc, 0)) // N·m en el empotramiento
console.log(tip.getUnknowns(lc, [DofID.Dz])) // m, la flecha en el extremo libre
```

```text [Salida]
-72000
0.09411072715241528
```

$M_A = -FL = -72$ kNm, un momento negativo, y la flecha en el extremo libre es $FL^3/3EI = 94{,}11$ mm, con $EI = 4{,}0803$ MNm². Este mismo voladizo es uno de los ejemplos de la aplicación EduBeam.

## Una viga continua {#a-continuous-beam}

Dos vanos de 5 m sobre tres apoyos, con 10 kN/m en ambos. Las reacciones, el momento sobre el apoyo central y el mayor momento en el vano:

```ts [continuous.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [5, 0, 0], [DofID.Dz])
domain.createNode('C', [10, 0, 0], [DofID.Dz])
const span1 = domain.createBeam2D(1, ['A', 'B'], 1, 1)
domain.createBeam2D(2, ['B', 'C'], 1, 1)

const lc = solver.loadCases[0]
for (const span of [1, 2]) {
  lc.createBeamElementUniformEdgeLoad(span, [0, 10e3], true)
}
solver.solve()

// getReactions da una Matrix de mathjs o un array: lo convertimos en array
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

for (const label of ['A', 'B', 'C']) {
  const { dofs, values } = domain.getNode(label).getReactions(lc)
  const rz = list(values)[dofs.indexOf(DofID.Dz)]
  console.log(`R${label} = ${(-rz / 1e3).toFixed(2)} kN up`)
}
const mB = span1.computeBendingMomentAt(lc, 5)
console.log(`MB = ${(mB / 1e3).toFixed(2)} kNm`)

// El mayor momento positivo del vano 1, a partir de 501 puntos
const { x, M } = span1.computeBendingMoment(lc, 500)
const i = M.indexOf(Math.max(...M))
console.log(`max M = ${(M[i] / 1e3).toFixed(2)} kNm at x = ${x[i]} m`)
```

```text [Salida]
RA = 18.75 kN up
RB = 62.50 kN up
RC = 18.75 kN up
MB = -31.25 kNm
max M = 17.58 kNm at x = 1.87 m
```

Los valores de libro de texto para dos vanos iguales: $R_A = R_C = 0{,}375\,qL$, $R_B = 1{,}25\,qL$, $M_B = -qL^2/8$, y el mayor momento en el vano, $R_A^2/2q = 17{,}58$ kNm, en $x = R_A/q = 1{,}875$ m. El muestreo lo encuentra en x = 1,87 m, el punto muestreado más cercano, a menos de 0,0002 kNm del valor exacto.

::model-figure{caption="Dos vanos de 5 m con 10 kN/m"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels]
---
::

La figura usa la sección de los ejemplos de la aplicación en lugar del IPE 200. Con una misma sección en toda la viga, los esfuerzos de una viga continua no dependen de su rigidez, así que los diagramas muestran los mismos números; solo cambia la flecha.

## Modifícalo {#change-it}

- **Vanos o cargas distintos:** cambia las coordenadas de C o la lista de cargas. Una carga en un solo vano da la conocida alternancia de sobrecargas.
- **Tres vanos:** añade un nodo D y una barra `['C', 'D']`.
- **Un extremo empotrado:** dale a A `[DofID.Dx, DofID.Dz, DofID.Ry]`.
- **Deformación por cortante real:** `k: 5 / 6` para un rectángulo, o el coeficiente de cortante de tu sección.
- **Una figura:** pasa el solver a [@edubeam/plot](/es/solver/drawing).

El [tutorial de la viga continua](/es/tutorials/continuous-beam) construye una viga como esta en la aplicación EduBeam, y la página [Comprobar resultados a mano](/es/guide/verification) tiene más casos de libro de texto con sus fórmulas.
