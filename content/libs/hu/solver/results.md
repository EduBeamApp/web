---
title: Eredmények kiolvasása
description: "Támaszerők, elmozdulások, a rúd menti igénybevételek, a deformált alak és a rúdvégi erők kiolvasása egy megoldott @edubeam/fem modellből, és amit az egyes hívások visszaadnak."
order: 10
source: site
---

# Eredmények kiolvasása {#reading-results}

A `solve()` után az eredményeket a csomópontokból és a rudakból lehet kiolvasni, mindig egy adott terhelési esetre. Az oldal minden példája ugyanazt a modellt használja: 6 m-es kéttámaszú tartó nyírásra merev IPE 200 keresztmetszettel, A-tól 2 m-re 20 kN erővel:

```ts [results.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 }) // nyírásra merev

const A = domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
const B = domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
const lc = solver.loadCases[0]
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], true)
solver.solve()
```

::model-figure{caption="20 kN 2 m-re, 6 m-es támaszközön"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M, w]
show: [nodeLabels]
---
::

## Mit honnan olvass ki? {#what-to-read-where}

| Eredmény | Hívás | Visszatérési érték |
| --- | --- | --- |
| Támaszerők | `node.getReactions(lc)` | `{ dofs, values }`: N, N·m |
| Elmozdulások | `node.getUnknowns(lc, dofs)` | m, rad |
| N, V vagy M egy pontban | `beam.computeBendingMomentAt(lc, x)` | egy szám: N, N·m |
| N, V vagy M a rúd mentén | `beam.computeBendingMoment(lc, n)` | `{ x, M }`, n + 1 pont |
| Deformált alak | `beam.computeLocalDefl(lc, n)` | `{ u, w }`, n + 1 pont, m |
| Rúdvégi erők | `beam.computeEndForces(lc)` | 6 elemű mathjs-mátrix |

N-hez és V-hez a `computeNormalForceAt` és a `computeShearForceAt`, illetve a `computeNormalForce` és a `computeShearForce` metódus tartozik, amelyek `{ x, N }`, illetve `{ x, V }` alakban adnak vissza eredményt. Az előjeleket a [Mértékegységek és előjelek](/hu/solver/conventions#signs-of-the-results) oldal írja le.

## Támaszerők {#reactions}

A `getReactions` a támasz minden gátolt szabadságfokára egy támaszerőt ad: a `dofs` sorolja fel őket, abban a sorrendben, ahogy a `createNode`-nak megadtad őket, a `values` pedig ugyanebben a sorrendben tartalmazza a támaszerőket. A `values` több támaszerő esetén **mathjs-mátrix**, egy esetén egyszerű tömb, így egy kis segédfüggvény mindkét esetben tömbbé alakítja:

```ts
/** Egy mathjs-mátrixot, tömböt vagy számot egyszerű tömbbé alakít. */
const list = (v: unknown): number[] =>
  typeof v === 'number'
    ? [v]
    : Array.isArray(v)
      ? v
      : (v as { toArray(): number[] }).toArray()

A.getReactions(lc).dofs // [0, 2]: DofID.Dx, DofID.Dz
list(A.getReactions(lc).values) // [0, -13333.3]
list(B.getReactions(lc).values) // [-6666.7]
```

Ha a sorrendtől függetlenül egyetlen támaszerőt szeretnél kiválasztani, keresd meg a szabadságfokát: `list(values)[dofs.indexOf(DofID.Dz)]`, ahogy a [többtámaszú tartós példaprogram](/hu/solver/beams#a-continuous-beam) teszi.

A támaszerő a támasz által a szerkezetre kifejtett erő: a z irányú −13 333 N tehát 13,3 kN felfelé, $P\,b/L = 20 \cdot 4/6$. [Elforgatott tengelyű](/hu/solver/nodes-supports#inclined-supports) csomópontnál a támaszerők ezekben a tengelyekben értendők; a `getReactions(lc, true)` globális tengelyekre számítja át őket, és mindhárom szabadságfokot visszaadja, 0-val ott, ahol nincs gátlás. Támasz nélküli csomópont `{ dofs: [], values: [] }` eredményt ad.

## Elmozdulások {#displacements}

A `getUnknowns` egy csomópont bármely szabadságfokát kiolvassa, akár gátolt, akár nem:

```ts
list(A.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])) // [0, 0, -0.0108924]
```

Az A pont az óramutató járásával megegyezően 0,010892 rad-dal fordul el, $P\,b\,(L^2 - b^2)/6EIL$. Egyetlen szabadságfok lekérdezésekor a `getUnknowns` egyszerű számot ad vissza, bár a TypeScript mátrixot deklarál: a `list` ezt is kezeli.

## Igénybevételek a rúd mentén {#internal-forces-along-a-member}

A `…At` metódusok a rúd első csomópontjától `x` méterre lévő pontban adják meg az értéket:

```ts
beam.computeShearForceAt(lc, 1) // 13333.3 N
beam.computeShearForceAt(lc, 2) // -6666.7 N: a teher helyén az utána következő érték
beam.computeBendingMomentAt(lc, 2) // 26666.7 N·m: R_A · 2
```

Ahol a koncentrált erő ugrást okoz, a pontosan a teher helyén vett érték a teher túloldali értéke. Az innenső oldal értékéhez kérdezz le egy hajszállal korábbi pontot, például `x - 1e-9`-et.

A tömböt visszaadó metódusok a rudat n + 1 egyenletesen elosztott pontban mintavételezik, a végpontokat is beleértve:

```ts
beam.computeBendingMoment(lc, 3)
// { x: [0, 2, 4, 6], M: [0, 26666.7, 13333.3, 0] }, kerekítési hibától eltekintve
```

Számíts kerekítési hibákra, például `-3.6e-12`-re ott, ahol a pontos érték 0: kiírás előtt formázd a számokat a `toFixed` metódussal. A rúd menti legnagyobb érték egy sűrű mintavételezés legnagyobb értéke, például a `computeBendingMoment(lc, 500)`-é, ahogy a [többtámaszú tartós példaprogramban](/hu/solver/beams#a-continuous-beam). Megoszló teher alatt M polinom, így pontos szélsőértéke ott van, ahol V előjelet vált; az [@edubeam/plot](/hu/plot/model#reading-values-yourself) pontosan meghatározza.

## Deformált alak {#deflected-shape}

```ts
beam.computeLocalDefl(lc, 3)
// { u: [0, 0, 0, 0], w: [0, 0.0174279, 0.0152494, 0] }
```

A `computeLocalDefl` a rúdirányú és a rúdra merőleges elmozdulásokat, `u`-t és `w`-t adja meg a rúd lokális tengelyeiben; a `computeGlobalDefl` ugyanezekben a pontokban globális x és z irányban adja meg őket. A teher alatti 17,43 mm-es lehajlás $P\,a^2 b^2/3EIL$. Az alak a csomópontok között pontos, nem a végértékekből interpolált. Megrajzolásához lásd [Eredmények rajzolása](/hu/solver/drawing).

## Rúdvégi erők {#end-forces}

```ts
beam.computeEndForces(lc).toArray()
// [0, -13333.3, 0, 0, -6666.7, 0]: X12, Z12, M12, X21, Z21, M21
```

A két csomópont által a rúdra kifejtett erők, a rúd lokális tengelyeiben: ezek az alkalmazás *Elemek eredményei* táblázatának számai, magyarázatuk a [Rúdvégi erők](/hu/elements/conventions#end-forces-element-results-table) részben található.

## Ellenőrizhető számok {#results-as-numbers-to-check}

A fenti értékek mindegyike egyezik a zárt alakú képletével. Az [Eredmények ellenőrzése kézi számítással](/hu/guide/verification) oldal sok további tankönyvi esetet dolgoz fel, amelyeket ugyanez a számítómag old meg a böngésződben.
