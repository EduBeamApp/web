---
title: Grinzi
description: "Programe complete @edubeam/fem pentru o consolă și o grindă continuă cu două deschideri, cu rezultatele lor, fiecare verificată cu formula din manual."
order: 12
group: Exemple de programe
source: site
---

# Grinzi {#beams}

Două programe complete, de copiat și modificat. Ambele folosesc o secțiune rigidă la forfecare (`k: 1e32`), așa că rezultatele lor sunt exact cele date de formulele Euler–Bernoulli. Rulează-le cu `node cantilever.ts` (Node 22.18 sau mai nou), într-un folder pregătit ca la [Instalare](/ro/solver/getting-started#install).

## O consolă {#a-cantilever}

Lungă de 4 m, încastrată în A, cu 18 kN în jos la capătul liber:

```ts [cantilever.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // încastrare
const tip = domain.createNode('B', [4, 0, 0]) // liber
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
lc.createNodalLoad('B', { [DofID.Dz]: 18e3 }) // 18 kN în jos la capătul liber
solver.solve()

console.log(beam.computeBendingMomentAt(lc, 0)) // N·m în încastrare
console.log(tip.getUnknowns(lc, [DofID.Dz])) // m, săgeata la capătul liber
```

```text [Rezultat]
-72000
0.09411072715241528
```

$M_A = -FL = -72$ kNm, moment negativ (fibra superioară întinsă), iar săgeata la capătul liber este $FL^3/3EI = 94{,}11$ mm, cu $EI = 4{,}0803$ MNm². Aceeași consolă este unul dintre exemplele din aplicația EduBeam.

## O grindă continuă {#a-continuous-beam}

Două deschideri de 5 m pe trei reazeme, cu 10 kN/m pe amândouă. Reacțiunile, momentul de pe reazemul din mijloc și cel mai mare moment din deschidere:

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

// getReactions întoarce o matrice mathjs sau un tablou: transformă-l în tablou
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

for (const label of ['A', 'B', 'C']) {
  const { dofs, values } = domain.getNode(label).getReactions(lc)
  const rz = list(values)[dofs.indexOf(DofID.Dz)]
  console.log(`R${label} = ${(-rz / 1e3).toFixed(2)} kN up`)
}
const mB = span1.computeBendingMomentAt(lc, 5)
console.log(`MB = ${(mB / 1e3).toFixed(2)} kNm`)

// Cel mai mare moment pozitiv din deschiderea 1, din 501 puncte în lungul ei
const { x, M } = span1.computeBendingMoment(lc, 500)
const i = M.indexOf(Math.max(...M))
console.log(`max M = ${(M[i] / 1e3).toFixed(2)} kNm at x = ${x[i]} m`)
```

```text [Rezultat]
RA = 18.75 kN up
RB = 62.50 kN up
RC = 18.75 kN up
MB = -31.25 kNm
max M = 17.58 kNm at x = 1.87 m
```

Valorile din manual pentru două deschideri egale: $R_A = R_C = 0{,}375\,qL$, $R_B = 1{,}25\,qL$, $M_B = -qL^2/8$, iar cel mai mare moment din deschidere $R_A^2/2q = 17{,}58$ kNm, la $x = R_A/q = 1{,}875$ m. Eșantionarea îl găsește în punctul de grilă 1,87 m, la mai puțin de 0,0002 kNm de valoarea exactă.

::model-figure{caption="Două deschideri de 5 m sub 10 kN/m"}
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

Figura folosește secțiunea din exemplul aplicației, nu IPE 200. Când toată grinda continuă are aceeași secțiune, eforturile ei nu depind de rigiditate, așa că diagramele au aceleași valori; diferă doar săgeata.

## Modifică programul {#change-it}

- **Deschideri sau încărcări inegale:** schimbă coordonatele lui C sau lista de încărcări. O încărcare pe o singură deschidere dă binecunoscuta încărcare în șah.
- **Trei deschideri:** adaugă un nod D și o bară `['C', 'D']`.
- **Un capăt încastrat:** dă-i lui A `[DofID.Dx, DofID.Dz, DofID.Ry]`.
- **Deformația reală din forfecare:** `k: 5 / 6` pentru un dreptunghi sau coeficientul de forfecare al secțiunii tale.
- **O figură:** dă programul de calcul bibliotecii [@edubeam/plot](/ro/solver/drawing).

Tutorialul [Grindă continuă și cedare de reazem](/ro/tutorials/continuous-beam) construiește o grindă ca aceasta în aplicația EduBeam, iar pagina [Verificarea rezultatelor prin calcul manual](/ro/guide/verification) are mai multe cazuri din manual, cu formulele lor.
