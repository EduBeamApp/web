---
title: Nosníky
description: "Kompletní programy v @edubeam/fem pro konzolu a spojitý nosník o dvou polích, s jejich výstupem a kontrolou podle učebnicového vzorce."
order: 12
group: Postupy
---

# Nosníky {#beams}

Dva kompletní programy, které si můžete zkopírovat a upravit. Oba používají smykově tuhý průřez (`k: 1e32`), takže jejich čísla přesně odpovídají vzorcům Bernoulliho–Navierovy teorie. Spustíte je příkazem `node cantilever.ts` (Node 22.18 nebo novější) ve složce připravené podle oddílu [Instalace](/cs/solver/getting-started#install).

## Konzola {#a-cantilever}

Délka 4 m, vetknutí v A, síla 18 kN dolů na volném konci:

```ts [cantilever.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // vetknutí
const tip = domain.createNode('B', [4, 0, 0]) // volný konec
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
lc.createNodalLoad('B', { [DofID.Dz]: 18e3 }) // 18 kN dolů na volném konci
solver.solve()

console.log(beam.computeBendingMomentAt(lc, 0)) // N·m ve vetknutí
console.log(tip.getUnknowns(lc, [DofID.Dz])) // m, průhyb volného konce
```

```text [Výstup]
-72000
0.09411072715241528
```

$M_A = -FL = -72$ kNm, tedy záporný moment (tah nahoře), a průhyb volného konce je $FL^3/3EI = 94{,}11$ mm při $EI = 4{,}0803$ MNm². Stejná konzola je jedním z příkladů v aplikaci EduBeam.

## Spojitý nosník {#a-continuous-beam}

Dvě pole po 5 m na třech podporách, na obou 10 kN/m. Program vypíše reakce, moment nad střední podporou a největší moment v poli:

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

// getReactions vrací matici mathjs nebo pole: převedeme ji na pole
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

for (const label of ['A', 'B', 'C']) {
  const { dofs, values } = domain.getNode(label).getReactions(lc)
  const rz = list(values)[dofs.indexOf(DofID.Dz)]
  console.log(`R${label} = ${(-rz / 1e3).toFixed(2)} kN up`)
}
const mB = span1.computeBendingMomentAt(lc, 5)
console.log(`MB = ${(mB / 1e3).toFixed(2)} kNm`)

// Největší kladný moment v poli 1, z 501 bodů podél prvku
const { x, M } = span1.computeBendingMoment(lc, 500)
const i = M.indexOf(Math.max(...M))
console.log(`max M = ${(M[i] / 1e3).toFixed(2)} kNm at x = ${x[i]} m`)
```

```text [Výstup]
RA = 18.75 kN up
RB = 62.50 kN up
RC = 18.75 kN up
MB = -31.25 kNm
max M = 17.58 kNm at x = 1.87 m
```

Učebnicové hodnoty pro dvě stejná pole: $R_A = R_C = 0{,}375\,qL$, $R_B = 1{,}25\,qL$, $M_B = -qL^2/8$ a největší moment v poli $R_A^2/2q = 17{,}58$ kNm v místě $x = R_A/q = 1{,}875$ m. Vzorkování ho najde v bodě sítě 1,87 m, od skutečné hodnoty se liší o méně než 0,0002 kNm.

::model-figure{caption="Dvě pole po 5 m se zatížením 10 kN/m"}
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

Obrázek používá místo IPE 200 průřez z příkladu v aplikaci. Když má spojitý nosník všude stejný průřez, jeho vnitřní síly na tuhosti nezávisí, takže průběhy ukazují stejná čísla; liší se jen průhyb.

## Jak program upravit {#change-it}

- **Nestejná pole nebo zatížení:** změňte souřadnice uzlu C nebo seznam zatížení. Zatížení jen v jednom poli dá známé šachovnicové zatížení.
- **Tři pole:** přidejte uzel D a prvek `['C', 'D']`.
- **Vetknutý konec:** zadejte uzlu A podepření `[DofID.Dx, DofID.Dz, DofID.Ry]`.
- **Skutečná smyková deformace:** `k: 5 / 6` pro obdélník, nebo smykový součinitel vašeho průřezu.
- **Obrázek modelu:** předejte řešič knihovně [@edubeam/plot](/cs/solver/drawing).

[Návod: spojitý nosník a pokles podpory](/cs/tutorials/continuous-beam) sestaví podobný nosník v aplikaci EduBeam a na stránce [Ověření výsledků ručně](/cs/guide/verification) najdete další učebnicové případy i se vzorci.
