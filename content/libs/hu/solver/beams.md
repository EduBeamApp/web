---
title: Tartók
description: "Teljes @edubeam/fem programok egy konzolra és egy kéttámaszközű többtámaszú tartóra, a kimenetükkel, mindegyik a tankönyvi képlettel ellenőrizve."
order: 12
group: Példaprogramok
source: site
---

# Tartók {#beams}

Két teljes program, amelyet lemásolhatsz és átírhatsz. Mindkettő nyírásra merev keresztmetszetet használ (`k: 1e32`), így az eredményeik pontosan az Euler–Bernoulli-féle képleteknek felelnek meg. Futtasd őket a `node cantilever.ts` paranccsal (Node 22.18 vagy újabb), a [Telepítés](/hu/solver/getting-started#install) szerint előkészített mappában.

## Konzol {#a-cantilever}

4 m hosszú, A-ban befogott, a szabad végén 18 kN lefelé:

```ts [cantilever.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // befogás
const tip = domain.createNode('B', [4, 0, 0]) // szabad
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
lc.createNodalLoad('B', { [DofID.Dz]: 18e3 }) // 18 kN lefelé a szabad végen
solver.solve()

console.log(beam.computeBendingMomentAt(lc, 0)) // N·m a befogásnál
console.log(tip.getUnknowns(lc, [DofID.Dz])) // m, a szabad vég lehajlása
```

```text [Kimenet]
-72000
0.09411072715241528
```

$M_A = -FL = -72$ kNm, negatív (felül húzott) nyomaték, a szabad vég lehajlása pedig $FL^3/3EI = 94{,}11$ mm, ahol $EI = 4{,}0803$ MNm². Ugyanez a konzol az EduBeam alkalmazás egyik példája.

## Többtámaszú tartó {#a-continuous-beam}

Két 5 m-es támaszköz három támaszon, mindkettőn 10 kN/m. A támaszerők, a középső támasz feletti nyomaték és a legnagyobb mezőnyomaték:

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

// A getReactions mathjs-mátrixot vagy tömböt ad: alakítsd tömbbé
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

for (const label of ['A', 'B', 'C']) {
  const { dofs, values } = domain.getNode(label).getReactions(lc)
  const rz = list(values)[dofs.indexOf(DofID.Dz)]
  console.log(`R${label} = ${(-rz / 1e3).toFixed(2)} kN up`)
}
const mB = span1.computeBendingMomentAt(lc, 5)
console.log(`MB = ${(mB / 1e3).toFixed(2)} kNm`)

// A legnagyobb pozitív nyomaték az 1. támaszközben, a rúd mentén vett 501 pontból
const { x, M } = span1.computeBendingMoment(lc, 500)
const i = M.indexOf(Math.max(...M))
console.log(`max M = ${(M[i] / 1e3).toFixed(2)} kNm at x = ${x[i]} m`)
```

```text [Kimenet]
RA = 18.75 kN up
RB = 62.50 kN up
RC = 18.75 kN up
MB = -31.25 kNm
max M = 17.58 kNm at x = 1.87 m
```

A tankönyvi értékek két egyenlő támaszköz esetén: $R_A = R_C = 0{,}375\,qL$, $R_B = 1{,}25\,qL$, $M_B = -qL^2/8$, a legnagyobb mezőnyomaték pedig $R_A^2/2q = 17{,}58$ kNm, az $x = R_A/q = 1{,}875$ m helyen. A mintavételezés az 1,87 m-es rácspontban találja meg, a pontos értéktől legfeljebb 0,0002 kNm eltéréssel.

::model-figure{caption="Két 5 m-es támaszköz 10 kN/m teherrel"}
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

Az ábra az IPE 200 helyett az alkalmazás példakeresztmetszetét használja. Ha a többtámaszú tartó végig azonos keresztmetszetű, az igénybevételei nem függnek a merevségétől, így az ábrák ugyanazokat az értékeket mutatják; csak a lehajlás más.

## Módosítsd {#change-it}

- **Eltérő támaszközök vagy terhek:** változtasd meg C koordinátáit vagy a terhek listáját. Ha csak az egyik támaszköz terhelt, a jól ismert sakktáblaszerű teherelrendezést kapod.
- **Három támaszköz:** adj hozzá egy D csomópontot és egy `['C', 'D']` rudat.
- **Befogott vég:** add meg A-nak a `[DofID.Dx, DofID.Dz, DofID.Ry]` szabadságfokokat.
- **Valódi nyírási alakváltozás:** téglalaphoz `k: 5 / 6`, vagy a saját keresztmetszeted nyírási tényezője.
- **Ábra róla:** add át a számítómagot az [@edubeam/plot](/hu/solver/drawing) csomagnak.

A [többtámaszú tartó oktatóanyaga](/hu/tutorials/continuous-beam) egy ilyen tartót épít fel az EduBeam alkalmazásban, az [Eredmények ellenőrzése kézi számítással](/hu/guide/verification) oldalon pedig további tankönyvi esetek találhatók a képleteikkel.
