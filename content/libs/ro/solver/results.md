---
title: Citirea rezultatelor
description: "Citește reacțiunile, deplasările, eforturile în lungul unei bare, deformata și forțele la capete dintr-un model @edubeam/fem calculat și află ce întoarce fiecare apel."
order: 10
source: site
---

# Citirea rezultatelor {#reading-results}

După `solve()`, rezultatele se citesc din noduri și din bare, pentru un caz de încărcare dat. Toate exemplele de pe această pagină citesc același model: o grindă simplu rezemată de 6 m, IPE 200 rigid la forfecare, cu 20 kN la 2 m de A:

```ts [results.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 }) // rigid la forfecare

const A = domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
const B = domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
const lc = solver.loadCases[0]
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], true)
solver.solve()
```

::model-figure{caption="20 kN la 2 m pe o deschidere de 6 m"}
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

## Ce se citește și de unde {#what-to-read-where}

| Rezultat | Apel | Întoarce |
| --- | --- | --- |
| Reacțiuni | `node.getReactions(lc)` | `{ dofs, values }`: N, N·m |
| Deplasări | `node.getUnknowns(lc, dofs)` | m, rad |
| N, V sau M într-un punct | `beam.computeBendingMomentAt(lc, x)` | un număr: N, N·m |
| N, V sau M în lungul unei bare | `beam.computeBendingMoment(lc, n)` | `{ x, M }`, n + 1 puncte |
| Deformata | `beam.computeLocalDefl(lc, n)` | `{ u, w }`, n + 1 puncte, m |
| Forțe la capete | `beam.computeEndForces(lc)` | o matrice mathjs cu 6 valori |

Pentru N și V, metodele sunt `computeNormalForceAt` și `computeShearForceAt`, respectiv `computeNormalForce` și `computeShearForce`, care întorc `{ x, N }` și `{ x, V }`. Semnele sunt descrise în [Unități și convenții de semne](/ro/solver/conventions#signs-of-the-results).

## Reacțiuni {#reactions}

`getReactions` dă câte o reacțiune pentru fiecare grad de libertate blocat de reazem: `dofs` le enumeră, în ordinea în care au fost date în `createNode`, iar `values` conține reacțiunile în aceeași ordine. `values` este o **matrice mathjs** când sunt mai multe și un tablou simplu când este una singură, așa că o mică funcție ajutătoare îl transformă în tablou în ambele cazuri:

```ts
/** Transformă o matrice mathjs, un tablou sau un număr într-un tablou simplu. */
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

Ca să iei o anumită reacțiune fără să depinzi de ordine, caută-i gradul de libertate: `list(values)[dofs.indexOf(DofID.Dz)]`, cum face [exemplul de grindă continuă](/ro/solver/beams#a-continuous-beam).

O reacțiune este forța cu care reazemul acționează asupra structurii: −13 333 N după z înseamnă 13,3 kN care împing în sus, $P\,b/L = 20 \cdot 4/6$. La un nod cu [axe rotite](/ro/solver/nodes-supports#inclined-supports), reacțiunile sunt în acele axe; `getReactions(lc, true)` le transformă în axe globale și întoarce toate cele trei grade de libertate, cu 0 acolo unde nu este nimic blocat. Un nod fără reazem dă `{ dofs: [], values: [] }`.

## Deplasări {#displacements}

`getUnknowns` citește orice grade de libertate ale unui nod, rezemat sau nu:

```ts
list(A.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])) // [0, 0, -0.0108924]
```

A se rotește în sens orar cu 0,010892 rad, $P\,b\,(L^2 - b^2)/6EIL$. Când ceri un singur grad de libertate, `getUnknowns` întoarce un număr simplu, deși TypeScript declară o matrice: `list` se descurcă și cu asta.

## Eforturi în lungul unei bare {#internal-forces-along-a-member}

Metodele `…At` dau o valoare la `x` metri de primul nod al barei:

```ts
beam.computeShearForceAt(lc, 1) // 13333.3 N
beam.computeShearForceAt(lc, 2) // -6666.7 N: în dreptul forței, valoarea de după ea
beam.computeBendingMomentAt(lc, 2) // 26666.7 N·m: R_A · 2
```

Acolo unde o forță concentrată produce un salt, valoarea exact în dreptul forței este cea de pe partea cealaltă. Ca să citești valoarea de dinaintea saltului, cere un punct puțin mai la stânga, de exemplu `x - 1e-9`.

Metodele care întorc tablouri eșantionează bara în n + 1 puncte egal distanțate, inclusiv capetele:

```ts
beam.computeBendingMoment(lc, 3)
// { x: [0, 2, 4, 6], M: [0, 26666.7, 13333.3, 0] }, până la erorile de rotunjire
```

Așteaptă-te la erori de rotunjire, de exemplu `-3.6e-12` acolo unde valoarea exactă este 0: formatează numerele cu `toFixed` înainte de a le afișa. Valoarea maximă în lungul unei bare o obții dintr-o eșantionare deasă, de exemplu `computeBendingMoment(lc, 500)`, ca în [exemplul de grindă continuă](/ro/solver/beams#a-continuous-beam). Sub încărcări distribuite M este un polinom, deci extremul lui exact se află acolo unde V trece prin zero; [@edubeam/plot](/ro/plot/model#reading-values-yourself) îl găsește exact.

## Deformata {#deflected-shape}

```ts
beam.computeLocalDefl(lc, 3)
// { u: [0, 0, 0, 0], w: [0, 0.0174279, 0.0152494, 0] }
```

`computeLocalDefl` dă deplasările în lungul barei și transversal pe ea, `u` și `w`, în axele ei locale; `computeGlobalDefl` aceleași puncte în x și z globale. Săgeata sub forță, 17,43 mm, este $P\,a^2 b^2/3EIL$. Forma dintre noduri este exactă, nu interpolată din valorile de la capete. Pentru desenarea ei, vezi [Desenarea rezultatelor](/ro/solver/drawing).

## Forțe la capete {#end-forces}

```ts
beam.computeEndForces(lc).toArray()
// [0, -13333.3, 0, 0, -6666.7, 0]: X12, Z12, M12, X21, Z21, M21
```

Forțele cu care cele două noduri acționează asupra barei, în axele ei locale: valorile din tabelul *Rezultate pe elemente* din aplicație, explicate în [Forțe la capete](/ro/elements/conventions#end-forces-element-results-table).

## Rezultate ca valori de verificat {#results-as-numbers-to-check}

Fiecare valoare de mai sus coincide cu formula ei analitică. Pagina [Verificarea rezultatelor prin calcul manual](/ro/guide/verification) parcurge multe alte cazuri din manuale, calculate de același program de calcul în browserul tău.
