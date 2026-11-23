---
title: Csomóponti terhek és rúdterhek
description: "Csomóponti erők és nyomatékok, valamint egyenletesen megoszló, trapéz alakú és koncentrált rúdterhek megadása globális vagy lokális tengelyekben az @edubeam/fem csomaggal, majd módosításuk vagy törlésük."
order: 6
group: Terhek
source: site
---

# Csomóponti terhek és rúdterhek {#nodal-and-member-loads}

A terhek egy terhelési esethez tartoznak. A számítómag eggyel indul, ez a `solver.loadCases[0]`, és minden `create…` metódusa hozzáad egy terhet, majd visszaadja azt. Több terhelési esetről és kombinációikról a [Terhelési esetek](/hu/solver/load-cases) oldal szól.

Az értékek N, N/m és N·m egységben értendők, és a [tengelyeket](/hu/solver/conventions#axes) követik: a +z lefelé mutat, a pozitív nyomaték az óramutató járásával ellentétes.

## Tartó mindenféle teherrel {#a-beam-with-every-kind}

Egy 8 m-es tartó csuklós és görgős támaszon, 4-ről 10 kN/m-re növekvő megoszló teherrel, 20 kN koncentrált erővel, 10 kNm koncentrált nyomatékkal és a görgős támasznál vízszintes erővel:

```ts [loads.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // csuklós támasz
domain.createNode('B', [8, 0, 0], [DofID.Dz]) // görgős támasz
domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
// A-ban 4 kN/m, B-ig 10 kN/m-re nő, lefelé
lc.createBeamElementTrapezoidalEdgeLoad(1, [0, 4e3], [0, 10e3], false)
// [fx, fz, my, a]: 20 kN lefelé, A-tól 2 m-re
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], false)
// 10 kNm koncentrált nyomaték az óramutató járásával ellentétesen, A-tól 6 m-re
lc.createBeamConcentratedLoad(1, [0, 0, 10e3, 6], false)
// 5 kN jobbra B-ben
lc.createNodalLoad('B', { [DofID.Dx]: 5e3 })
solver.solve()

// A getReactions mathjs-mátrixot vagy tömböt ad: alakítsd tömbbé
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

console.log(list(domain.getNode('A').getReactions(lc).values))
console.log(list(domain.getNode('B').getReactions(lc).values))
```

```text [Kimenet]
[ -5000, -40250 ]
[ -35750 ]
```

Kézzel: a megoszló teher eredője 56 kN, A-tól 4,571 m-re, így az A pontra felírt nyomatéki egyenletből $8R_B = 56 \cdot 4{,}571 + 20 \cdot 2 - 10 = 286$, $R_B = 35{,}75$ kN felfelé, és $R_A = 76 - 35{,}75 = 40{,}25$ kN felfelé. A csuklós támasz az 5 kN-t is felveszi, így az egész tartó 5 kN-nal húzott.

::model-figure{caption="Ugyanezek a terhek. Az ábra a koncentrált nyomatékot egy 6 m-nél lévő C csomópontra teszi, ami ugyanazt az eredményt adja."}
---
nodes: { A: [0, 0], C: [6, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: [4, 8.5] }
  - { member: 2, qz: [8.5, 10] }
  - { member: 1, pz: 20, at: 2 }
  - { node: C, my: 10 }
  - { node: B, fx: 5 }
results: [M]
show: [nodeLabels]
labels: horizontal
---
::

## Csomóponti terhek {#nodal-loads}

```ts
lc.createNodalLoad(node, { [DofID.Dx]: fx, [DofID.Dz]: fz, [DofID.Ry]: my }, lcs)
```

Csak a szükséges komponenseket add meg. Az értékek globális tengelyekben értendők, vagy ha `lcs` értéke `true`, a csomópont saját tengelyeiben, az [`updateLcs`](/hu/solver/nodes-supports#inclined-supports) metódussal elforgatott csomópont esetén. A támasz által gátolt szabadságfok irányába mutató erő egyenesen a támaszerőbe kerül, és semmit sem hajlít.

## Rúdterhek {#member-loads}

| Metódus | Értékek | Teher |
| --- | --- | --- |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | N/m | egyenletesen megoszló a teljes rúdon |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | N/m | lineárisan változó, az első csomóponttól a másodikig |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | N, N·m, m | erő és koncentrált nyomaték az első csomóponttól `a` méterre |

A megoszló terhek mindig a teljes rudat lefedik. Ha a teher csak a támaszköz egy részén hat, oszd ketté a rudat egy csomóponttal ott, ahol a teher kezdődik: egy plusz csomópont egyetlen eredményt sem változtat meg. Koncentrált erő vagy nyomaték a rúd bármely pontján lehet.

### Globális vagy lokális tengelyek {#global-or-local-axes}

Az utolsó argumentum, az `lcs` adja meg, melyik tengelyekben értendők a komponensek:

- `false`: globális x és z. Az `fz` függőlegesen hat, a rúd hajlásától függetlenül.
- `true`: a rúd lokális x (rúdirányú) és z (rúdra merőleges) tengelye. Az `fz` a rúdra merőlegesen hat.

Balról jobbra rajzolt vízszintes rúdon a kettő ugyanaz; jobbról balra rajzolt rúdon a lokális `fz` felfelé mutat.

::callout{type="info" title="A megoszló terhek a rúd egy méterére vonatkoznak"}
Mindkét változat a rúd saját hosszának egy méterére hat. Egy 5 m hosszú szarufán, amelynek vízszintes vetülete 4 m, a globális tengelyekben megadott `[0, 10e3]` összesen 50 kN. A vízszintes vetületre vonatkoztatott 10 kN/m hóteher a szarufa mentén $10 \cdot 4/5 = 8$ kN/m: add meg `[0, 8e3]`-ként.
::

## Teher módosítása vagy törlése {#change-or-remove-a-load}

Minden `create…` metódus visszaadja a terhet. Módosítsd az értékeit, és oldd meg újra a modellt:

```ts
const q = lc.createBeamElementUniformEdgeLoad(1, [0, 10e3], true)
solver.solve()
q.values = [0, 20e3] // kétszeres teher
solver.solve()
```

A terhek egyszerű tömbökben vannak, ezek az `lc.nodalLoadList` és az `lc.elementLoadList` (rúdterhek és hőmérsékleti terhek), így az `lc.elementLoadList.splice(index, 1)` töröl közülük egyet. Az egyes terhek tulajdonságainak nevei az [API-referenciában](/hu/solver/reference#loads) találhatók.

A hőmérséklet-változás és a támaszsüllyedés is teher: lásd [Hőmérséklet-változás és támaszsüllyedés](/hu/solver/temperature-settlements).
