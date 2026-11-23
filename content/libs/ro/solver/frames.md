---
title: Cadre
description: "Un program @edubeam/fem complet pentru un cadru cu trei articulații, cu stâlpi, noduri rigide și articulație la cheie, cu rezultatele verificate prin calcul manual."
order: 13
source: site
---

# Cadre {#frames}

Un cadru este format din rigle și stâlpi legați rigid în noduri. Acest exemplu construiește în cod cadrul din tutorialul [Cadru cu trei articulații](/ro/tutorials/three-hinged-frame): doi stâlpi de 4 m articulați în A și E, o riglă de 8 m cu o articulație în C și 10 kN/m pe riglă. Tutorialul numerotează nodurile de la 1 la 5; aici sunt notate de la A la E.

::model-figure{caption="Cadrul din programul de mai jos: articulații în A și E, articulație în C, 10 kN/m"}
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

// z este orientată în jos: capetele de sus ale stâlpilor de 4 m sunt la z = -4
const pin = [DofID.Dx, DofID.Dz]
domain.createNode('A', [0, 0, 0], pin)
domain.createNode('B', [0, 0, -4])
domain.createNode('C', [4, 0, -4]) // articulația de la cheie
domain.createNode('D', [8, 0, -4])
domain.createNode('E', [8, 0, 0], pin)

const column = domain.createBeam2D(1, ['A', 'B'], 1, 1) // de jos în sus
const left = domain.createBeam2D(2, ['B', 'C'], 1, 1, [false, true]) // articulație în C
domain.createBeam2D(3, ['C', 'D'], 1, 1)
domain.createBeam2D(4, ['D', 'E'], 1, 1)

const lc = solver.loadCases[0]
for (const half of [2, 3]) {
  lc.createBeamElementUniformEdgeLoad(half, [0, 10e3], false)
}
solver.solve()

// getReactions întoarce o matrice mathjs sau un tablou: transformă-l în tablou
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

```text [Rezultat]
A: Rx = 20.00 kN, Rz = -40.00 kN
E: Rx = -20.00 kN, Rz = -40.00 kN
M at 0 m from B = -80.00 kNm
M at 2 m from B = -20.00 kNm
M at 4 m from B = 0.00 kNm
M at the top of column 1 = -80.00 kNm
```

## Verificare prin calcul manual {#check-it-by-hand}

| Mărime | Calcul manual | Program de calcul |
| --- | --- | --- |
| Reacțiuni verticale | $q \cdot 8/2 = 40$ kN în sus | $R_z = -40$ kN în A și E |
| Reacțiuni orizontale | din $M_C = 0$ pe jumătatea stângă: $(40 \cdot 4 - 10 \cdot 4 \cdot 2)/4 = 20$ kN, spre interior | $R_x = +20$ kN în A, $-20$ kN în E |
| Momentul din nodul de colț | $-20 \cdot 4 = -80$ kNm | $-80$ kNm în riglă și în stâlp |
| Momentul la 2 m de B | $-80 + 40 \cdot 2 - 10 \cdot 2^2/2 = -20$ kNm | $-20$ kNm |
| Momentul în articulație | 0 | 0 |

## De reținut {#things-to-notice}

- **Stâlpii merg în sus, deci z este negativ.** Capetele de sus ale stâlpilor sunt la $z = -4$.
- **Axele locale ale stâlpului.** Bara 1 merge de la A în sus până la B, deci axa ei locală z este orientată spre dreapta, spre interiorul cadrului. Momentul ei la capătul de sus este −80 kNm, ca și cel al riglei în nodul de colț: fibra exterioară este întinsă. Definește stâlpul de la B în jos până la A și axa lui locală z va fi orientată spre stânga: momentul își schimbă semnul, iar `x` se măsoară de sus. Vezi [Sensul barei](/ro/solver/conventions#member-direction).
- **O articulație, un capăt de bară.** Articulația se află la capătul barei 2 din C; bara 3 pornește rigid din C. Un singur capăt eliberat este suficient ca C să devină articulație.
- **Încărcări globale pe riglă.** `false` dă încărcarea în axe globale: verticală, indiferent de înclinarea barei. Pe o riglă orizontală desenată de la stânga la dreapta, rezultatul este același ca în axe locale.

## Cadre static nedeterminate {#statically-indeterminate-frames}

Elimină articulația, `[false, false]`, și cadrul devine un cadru portal o dată static nedeterminat. Eforturile depind atunci de rigiditatea riglei în raport cu cea a stâlpilor: dă barelor secțiuni diferite ca să vezi acest lucru. [Experimentele din tutorial](/ro/tutorials/three-hinged-frame#_7-experiment) încastrează bazele stâlpilor și împing cadrul lateral, cu valori de comparat. Pagina [Slide-uri și note de curs](/ro/plot/slides) din @edubeam/plot desenează un astfel de cadru portal pas cu pas.
