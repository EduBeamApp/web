---
title: Pórticos
description: "Un programa completo de @edubeam/fem para un pórtico triarticulado, con pilares, esquinas rígidas y rótula de clave, y sus resultados comprobados a mano."
order: 13
source: site
---

# Pórticos {#frames}

Un pórtico está formado por vigas y pilares unidos rígidamente en sus esquinas. Este ejemplo construye en código el pórtico del [tutorial del pórtico triarticulado](/es/tutorials/three-hinged-frame): dos pilares de 4 m articulados en A y E, una viga de 8 m con una rótula en C y 10 kN/m sobre la viga. El tutorial numera los nodos del 1 al 5; aquí van de la A a la E.

::model-figure{caption="El pórtico del programa: articulaciones en A y E, una rótula en C, 10 kN/m"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, k: 1e32 }) // IPE 300

// z apunta hacia abajo: las cabezas de los pilares de 4 m están en z = -4
const pin = [DofID.Dx, DofID.Dz]
domain.createNode('A', [0, 0, 0], pin)
domain.createNode('B', [0, 0, -4])
domain.createNode('C', [4, 0, -4]) // la rótula de clave
domain.createNode('D', [8, 0, -4])
domain.createNode('E', [8, 0, 0], pin)

const column = domain.createBeam2D(1, ['A', 'B'], 1, 1) // de abajo arriba
const left = domain.createBeam2D(2, ['B', 'C'], 1, 1, [false, true]) // rótula en C
domain.createBeam2D(3, ['C', 'D'], 1, 1)
domain.createBeam2D(4, ['D', 'E'], 1, 1)

const lc = solver.loadCases[0]
for (const half of [2, 3]) {
  lc.createBeamElementUniformEdgeLoad(half, [0, 10e3], false)
}
solver.solve()

// getReactions da una Matrix de mathjs o un array: lo convertimos en array
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()
const kN = (v: number) => (v / 1e3).toFixed(2)

for (const label of ['A', 'E']) {
  const [rx, rz] = list(domain.getNode(label).getReactions(lc).values)
  console.log(`${label}: Rx = ${kN(rx)} kN, Rz = ${kN(rz)} kN`)
}
for (const x of [0, 2, 4]) {
  const m = left.computeBendingMomentAt(lc, x)
  console.log(`M at ${x} m from B = ${kN(m)} kNm`)
}
const top = column.computeBendingMomentAt(lc, 4)
console.log(`M at the top of column 1 = ${kN(top)} kNm`)
```

```text [Salida]
A: Rx = 20.00 kN, Rz = -40.00 kN
E: Rx = -20.00 kN, Rz = -40.00 kN
M at 0 m from B = -80.00 kNm
M at 2 m from B = -20.00 kNm
M at 4 m from B = 0.00 kNm
M at the top of column 1 = -80.00 kNm
```

## Comprobación a mano {#check-it-by-hand}

| Magnitud | A mano | Solver |
| --- | --- | --- |
| Reacciones verticales | $q \cdot 8/2 = 40$ kN hacia arriba | $R_z = -40$ kN en A y en E |
| Reacciones horizontales | de $M_C = 0$ en la mitad izquierda: $(40 \cdot 4 - 10 \cdot 4 \cdot 2)/4 = 20$ kN, hacia dentro | $R_x = +20$ kN en A, $-20$ kN en E |
| Momento en la esquina | $-20 \cdot 4 = -80$ kNm | $-80$ kNm en la viga y en el pilar |
| Momento a 2 m de B | $-80 + 40 \cdot 2 - 10 \cdot 2^2/2 = -20$ kNm | $-20$ kNm |
| Momento en la rótula | 0 | 0 |

## Detalles que conviene observar {#things-to-notice}

- **Los pilares suben, así que z es negativa.** Las cabezas de los pilares están en $z = -4$.
- **Los ejes locales del pilar.** La barra 1 va de A hacia arriba hasta B, así que su eje z local apunta a la derecha, hacia el interior del pórtico. Su momento en la cabeza es −80 kNm, igual que el de la viga en la esquina: tracción en la cara exterior. Si defines el pilar de B hacia abajo hasta A, su eje z local apunta a la izquierda: su momento cambia de signo, y `x` se mide desde la cabeza. Consulta [Orientación de la barra](/es/solver/conventions#member-direction).
- **Una rótula, un extremo de barra.** La rótula está en el extremo de la barra 2 en C; la barra 3 empieza en C con unión rígida. Basta con liberar un extremo para que C sea una rótula.
- **Cargas globales en la viga.** `false` da la carga en ejes globales: vertical, sea cual sea la inclinación de la barra. En una viga horizontal dibujada de izquierda a derecha, es lo mismo que en ejes locales.

## Pórticos hiperestáticos {#statically-indeterminate-frames}

Quita la rótula, `[false, false]`, y el pórtico pasa a ser un pórtico biarticulado, una vez hiperestático. Sus esfuerzos dependen entonces de la rigidez de la viga en comparación con la de los pilares: da a las barras secciones distintas para verlo. Los [experimentos del tutorial](/es/tutorials/three-hinged-frame#_7-experiment) empotran las bases y empujan el pórtico lateralmente, con los números para comprobar. La página [Diapositivas y apuntes](/es/plot/slides) de @edubeam/plot dibuja un pórtico así paso a paso.
