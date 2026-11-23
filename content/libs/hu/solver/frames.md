---
title: Keretek
description: "Teljes @edubeam/fem program egy háromcsuklós keretre, oszlopokkal, merev sarkokkal és kulcscsuklóval, kézi számítással ellenőrzött eredményekkel."
order: 13
source: site
---

# Keretek {#frames}

A keret gerendákból és oszlopokból áll, amelyek a sarkokban mereven kapcsolódnak. Ez a példaprogram a [háromcsuklós keret oktatóanyagának](/hu/tutorials/three-hinged-frame) keretét építi fel kódban: két 4 m-es oszlop A-ban és E-ben csuklós támasszal, egy 8 m-es gerenda C-ben csuklóval, a gerendán 10 kN/m teherrel. Az oktatóanyag a csomópontokat 1-től 5-ig számozza; itt A-tól E-ig jelöljük őket.

::model-figure{caption="Az alábbi program kerete: csuklós támaszok A-ban és E-ben, csukló C-ben, 10 kN/m"}
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

// A z lefelé mutat: a 4 m-es oszlopok teteje z = -4-nél van
const pin = [DofID.Dx, DofID.Dz]
domain.createNode('A', [0, 0, 0], pin)
domain.createNode('B', [0, 0, -4])
domain.createNode('C', [4, 0, -4]) // kulcscsukló
domain.createNode('D', [8, 0, -4])
domain.createNode('E', [8, 0, 0], pin)

const column = domain.createBeam2D(1, ['A', 'B'], 1, 1) // alulról felfelé
const left = domain.createBeam2D(2, ['B', 'C'], 1, 1, [false, true]) // csukló C-ben
domain.createBeam2D(3, ['C', 'D'], 1, 1)
domain.createBeam2D(4, ['D', 'E'], 1, 1)

const lc = solver.loadCases[0]
for (const half of [2, 3]) {
  lc.createBeamElementUniformEdgeLoad(half, [0, 10e3], false)
}
solver.solve()

// A getReactions mathjs-mátrixot vagy tömböt ad: alakítsd tömbbé
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

```text [Kimenet]
A: Rx = 20.00 kN, Rz = -40.00 kN
E: Rx = -20.00 kN, Rz = -40.00 kN
M at 0 m from B = -80.00 kNm
M at 2 m from B = -20.00 kNm
M at 4 m from B = 0.00 kNm
M at the top of column 1 = -80.00 kNm
```

## Kézi ellenőrzés {#check-it-by-hand}

| Mennyiség | Kézzel | Számítómag |
| --- | --- | --- |
| Függőleges támaszerők | $q \cdot 8/2 = 40$ kN felfelé | $R_z = -40$ kN A-ban és E-ben |
| Vízszintes támaszerők | a bal fél $M_C = 0$ feltételéből: $(40 \cdot 4 - 10 \cdot 4 \cdot 2)/4 = 20$ kN, befelé | $R_x = +20$ kN A-ban, $-20$ kN E-ben |
| Saroknyomaték | $-20 \cdot 4 = -80$ kNm | $-80$ kNm a gerendában és az oszlopban |
| Nyomaték B-től 2 m-re | $-80 + 40 \cdot 2 - 10 \cdot 2^2/2 = -20$ kNm | $-20$ kNm |
| Nyomaték a csuklóban | 0 | 0 |

## Amire érdemes figyelni {#things-to-notice}

- **Az oszlopok felfelé nyúlnak, így z negatív.** Az oszlopok teteje $z = -4$-nél van.
- **Az oszlop lokális tengelyei.** Az 1. rúd A-tól felfelé B-ig tart, így lokális z tengelye jobbra, a keret belseje felé mutat. A nyomatéka a tetején −80 kNm, akárcsak a gerendáé a sarokban: a külső szál húzott. Ha az oszlopot B-től lefelé A-ig adod meg, a lokális z balra mutat: a nyomaték előjelet vált, és `x` a tetejétől számítódik. Lásd [A rúd iránya](/hu/solver/conventions#member-direction).
- **Egy csukló, egy rúdvég.** A csukló a 2. rúd C-beli végén van; a 3. rúd C-ben mereven indul. Egyetlen felszabadított rúdvég elég ahhoz, hogy C csukló legyen.
- **Globális terhek a gerendán.** A `false` globális tengelyekben adja meg a terhet: függőlegesen, a rúd hajlásától függetlenül. Balról jobbra rajzolt vízszintes gerendán ez ugyanaz, mint a lokális.

## Statikailag határozatlan keretek {#statically-indeterminate-frames}

Ha eltávolítod a csuklót (`[false, false]`), egyszeresen határozatlan, egynyílású keretet kapsz. Az igénybevételei ekkor attól függnek, mennyire merev a gerenda az oszlopokhoz képest: adj a rudaknak különböző keresztmetszetet, és meglátod. Az [oktatóanyag kísérletei](/hu/tutorials/three-hinged-frame#_7-experiment) befogják az oszlopok talpát, és oldalirányban terhelik a keretet, összevethető eredményekkel. Az @edubeam/plot [diák oldala](/hu/plot/slides) lépésről lépésre rajzol meg egy ilyen keretet.
