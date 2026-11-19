---
title: Rámy
description: "Kompletní program v @edubeam/fem pro trojkloubový rám se sloupy, tuhými rohy a vrcholovým kloubem, s výsledky ověřenými ručním výpočtem."
order: 13
---

# Rámy {#frames}

Rám tvoří příčle a sloupy, které jsou v rozích spojené tuhě. Tento postup sestaví v kódu rám ze stránky [Návod: trojkloubový rám](/cs/tutorials/three-hinged-frame): dva sloupy výšky 4 m s kloubovými podporami v A a E, příčel o délce 8 m s kloubem v C a zatížení 10 kN/m na příčli. Návod čísluje uzly 1 až 5, tady jsou označené A až E.

::model-figure{caption="Rám z programu níže: kloubové podpory v A a E, kloub v C, 10 kN/m"}
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

// z míří dolů: hlavy sloupů vysokých 4 m jsou v z = -4
const pin = [DofID.Dx, DofID.Dz]
domain.createNode('A', [0, 0, 0], pin)
domain.createNode('B', [0, 0, -4])
domain.createNode('C', [4, 0, -4]) // vrcholový kloub
domain.createNode('D', [8, 0, -4])
domain.createNode('E', [8, 0, 0], pin)

const column = domain.createBeam2D(1, ['A', 'B'], 1, 1) // zdola nahoru
const left = domain.createBeam2D(2, ['B', 'C'], 1, 1, [false, true]) // kloub v C
domain.createBeam2D(3, ['C', 'D'], 1, 1)
domain.createBeam2D(4, ['D', 'E'], 1, 1)

const lc = solver.loadCases[0]
for (const half of [2, 3]) {
  lc.createBeamElementUniformEdgeLoad(half, [0, 10e3], false)
}
solver.solve()

// getReactions vrací matici mathjs nebo pole: převedeme ji na pole
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

```text [Výstup]
A: Rx = 20.00 kN, Rz = -40.00 kN
E: Rx = -20.00 kN, Rz = -40.00 kN
M at 0 m from B = -80.00 kNm
M at 2 m from B = -20.00 kNm
M at 4 m from B = 0.00 kNm
M at the top of column 1 = -80.00 kNm
```

## Kontrola ručním výpočtem {#check-it-by-hand}

| Veličina | Ručně | Řešič |
| --- | --- | --- |
| Svislé reakce | $q \cdot 8/2 = 40$ kN nahoru | $R_z = -40$ kN v A i E |
| Vodorovné reakce | z $M_C = 0$ na levé polovině: $(40 \cdot 4 - 10 \cdot 4 \cdot 2)/4 = 20$ kN, dovnitř | $R_x = +20$ kN v A, $-20$ kN v E |
| Moment v rohu | $-20 \cdot 4 = -80$ kNm | $-80$ kNm v příčli i ve sloupu |
| Moment 2 m od B | $-80 + 40 \cdot 2 - 10 \cdot 2^2/2 = -20$ kNm | $-20$ kNm |
| Moment v kloubu | 0 | 0 |

## Čeho si všimnout {#things-to-notice}

- **Sloupy míří nahoru, takže z je záporné.** Hlavy sloupů jsou v $z = -4$.
- **Lokální osy sloupu.** Prvek 1 vede z A nahoru do B, takže jeho lokální osa z míří doprava, dovnitř rámu. Jeho moment v hlavě je −80 kNm, stejně jako moment příčle v rohu: tah je na vnější straně. Když sloup zadáte shora dolů, z B do A, jeho lokální osa z míří doleva: moment změní znaménko a `x` se měří od hlavy. Viz [Orientace prvku](/cs/solver/conventions#member-direction).
- **Jeden kloub, jeden konec prvku.** Kloub je na konci prvku 2 v uzlu C; prvek 3 je k uzlu C připojený tuhě. K tomu, aby byl uzel C kloubem, stačí uvolnit jeden konec.
- **Globální zatížení na příčli.** `false` zadává zatížení v globálních osách: svisle, ať je prvek skloněný jakkoli. U vodorovné příčle zadané zleva doprava je to totéž jako v lokálních osách.

## Staticky neurčité rámy {#statically-indeterminate-frames}

Odstraňte kloub, `[false, false]`, a z rámu se stane dvoukloubový rám s jednou nadbytečnou reakcí. Jeho vnitřní síly pak závisí na tom, jak tuhá je příčel ve srovnání se sloupy: dejte prvkům různé průřezy a uvidíte to. [Experimenty v návodu](/cs/tutorials/three-hinged-frame#_7-experiment) patky sloupů vetknou a rám zatlačí do strany, i s čísly ke kontrole. Stránka [Prezentace a skripta](/cs/plot/slides) dokumentace @edubeam/plot takový rám vykresluje krok za krokem.
