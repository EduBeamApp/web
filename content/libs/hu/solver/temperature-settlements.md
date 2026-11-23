---
title: Hőmérséklet-változás és támaszsüllyedés
description: "Rudak terhelése egyenletes hőmérséklet-változással és hőmérséklet-különbséggel, valamint támaszok elmozdítása előírt elmozdulással az @edubeam/fem csomagban, ellenőrzött példákkal."
order: 7
source: site
---

# Hőmérséklet-változás és támaszsüllyedés {#temperature-and-settlements}

Két teher, amely nem erő: egy rúd, amely meg akarja változtatni a hosszát vagy a görbületét, és egy támasz, amely elmozdul. Mindkettő csak ott okoz igénybevételt, ahol a szerkezet ezt meggátolja, ezért kiválóan alkalmasak statikailag határozatlan szerkezetek gyakorlására. Mindkettő elméletét az alkalmazás elméleti kézikönyvében, a [Gerendaelem](/hu/elements/beam#element-loads) oldal rúdterhekről szóló részében találod.

## Hőmérséklet {#temperature}

```ts
lc.createBeamTemperatureLoad(member, [dTc, dTb, dTt])
```

| Érték | Jelentés | Hatás egy szabad rúdra |
| --- | --- | --- |
| `dTc` | változás a súlypontban, K | $\alpha\,\Delta T_c\,L$ értékkel megnyúlik |
| `dTb` | változás az alsó szálban (a lokális +z oldalon), K | a `dTt`-vel együtt meggörbíti: $\kappa = \alpha\,(\Delta T_b - \Delta T_t)/h$ |
| `dTt` | változás a felső szálban, K | |

A rudat csak a `dTb - dTt` különbség hajlítja, így a `[30, 20, 0]` és a `[30, 10, -10]` ugyanaz a teher. Szükség van hozzá az anyag `alpha` és a keresztmetszet `h` paraméterére; `h` nélkül a nyomatékok `NaN` értékűek.

A mindkét végén befogott tartó sem megnyúlni, sem meggörbülni nem tud, ezért nyomóerő és hajlítónyomaték ébred benne: $N = -EA\,\alpha\,\Delta T_c$ és $M = -EI\,\alpha\,(\Delta T_b - \Delta T_t)/h$.

```ts [temperature.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial(1, { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [6, 0, 0], fixed)
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

// A súlypont 30 K-nel melegebb, az alsó szál 20 K-nel melegebb a felsőnél
lc.createBeamTemperatureLoad(1, [30, 20, 0])
solver.solve()

beam.computeNormalForceAt(lc, 3) // -215460 N: EA · 12e-6 · 30
beam.computeBendingMomentAt(lc, 3) // -4896.4 N·m: EI · 12e-6 · 20 / 0.2
```

Az IPE 200 esetén $EA = 598{,}5$ MN és $EI = 4{,}0803$ MNm². A melegebb alsó szál hatására egy szabad tartó végei felfelé hajlanának, ezért a befogások az ellenkező irányba hajlítják: negatív (felül húzott) nyomaték keletkezik.

::model-figure{caption="Mindkét végén befogott tartó, a súlypontjában 30 K-nel, alul 20 K-nel melegebb, mint felül"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 30, bottom: 20, top: 0 } }
results: [M, N]
show: [nodeLabels]
material: { e: 210e9, alpha: 12e-6 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

Kéttámaszú tartón ugyanez a teher semmilyen igénybevételt nem okoz, csak elmozdulást: a görgős támasz $\alpha\,\Delta T_c\,L = 2{,}16$ mm-rel kifelé csúszik, a támaszköz közepe pedig $\kappa L^2/8 = 5{,}4$ mm-t hajlik le.

## Előírt elmozdulások {#prescribed-displacements}

```ts
lc.createPrescribedDisplacement(node, { [DofID.Dz]: 0.01 })
```

Adott értékkel elmozdít egy támaszt: `Dx` és `Dz` esetén méterben, `Ry` esetén radiánban, a csomópont saját tengelyeiben. A szabadságfoknak a csomópont támasza által gátoltnak kell lennie; nem gátolt szabadságfoknál a számítómag figyelmeztetés nélkül figyelmen kívül hagyja az értéket.

Egyik végén befogott, másik végén görgős támaszú tartó, amelynek a görgős támasza 10 mm-t süllyed, új számítómagban, a hőmérsékleti példa anyagával és keresztmetszetével:

```ts
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // befogás
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // görgős támasz
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

lc.createPrescribedDisplacement('B', { [DofID.Dz]: 0.01 }) // 10 mm lefelé
solver.solve()

domain.getNode('B').getReactions(lc).values // [566.7] N: 3EIw/L³
beam.computeBendingMomentAt(lc, 0) // -3400.2 N·m A-ban: 3EIw/L²
```

A görgős támasznak le kell húznia a tartót, hogy az kövesse, ezért a támaszereje pozitív, +z irányú: $3EIw/L^3 = 3 \cdot 4{,}0803 \times 10^6 \cdot 0{,}01 / 216 = 566{,}7$ N.

::model-figure{caption="Befogott–görgős tartó görgős támasza 10 mm-t süllyed: −3,4 kNm a befogásnál"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

Azt, hogy az alkalmazás hogyan rajzolja meg ezt a két terhet, a [Terhek](/hu/essentials/loads) oldal írja le.
