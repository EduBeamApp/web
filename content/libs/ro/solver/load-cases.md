---
title: Cazuri de încărcare
description: "Calculează simultan mai multe cazuri de încărcare ale unui model @edubeam/fem și combină rezultatele lor prin suprapunere de efecte în combinații de încărcări și înfășurători."
order: 8
source: site
---

# Cazuri de încărcare {#load-cases}

Un caz de încărcare este un set de încărcări calculate împreună. Programul de calcul pornește cu unul; adaugă altele, iar un singur `solve()` le rezolvă pe toate cu aceeași matrice de rigiditate. Calculul este liniar, deci rezultatele diferitelor cazuri pot fi înmulțite cu coeficienți și adunate: asta este o combinație de încărcări.

## Adaugă un caz de încărcare {#add-a-load-case}

```ts [load-cases.ts]
import { DofID, LinearStaticSolver, LoadCase } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const dead = solver.loadCases[0] // cel cu care pornește orice program de calcul
const live = new LoadCase('live', domain)
solver.loadCases.push(live)

dead.createBeamElementUniformEdgeLoad(1, [0, 10e3], true) // 10 kN/m
live.createBeamConcentratedLoad(1, [0, 20e3, 0, 3], true) // 20 kN la mijlocul deschiderii
solver.solve() // rezolvă toate cazurile de încărcare

console.log(beam.computeBendingMomentAt(dead, 3)) // qL²/8
console.log(beam.computeBendingMomentAt(live, 3)) // PL/4
```

```text [Rezultat]
45000
30000
```

Fiecare metodă care întoarce rezultate primește cazul de încărcare din care trebuie să citească. Primul caz are eticheta `'DefaultLC'`; etichetele sunt doar nume, iar programul de calcul deosebește cazurile după obiect.

## Combină-le {#combine-them}

Înmulțește rezultatul fiecărui caz cu coeficientul lui și adună. Pentru starea limită ultimă din Eurocod, $1{,}35\,G + 1{,}5\,Q$, la mijlocul deschiderii:

```ts
1.35 * beam.computeBendingMomentAt(dead, 3) +
  1.5 * beam.computeBendingMomentAt(live, 3) // 105750 N·m
```

La fel se procedează cu reacțiunile, deplasările și orice alt rezultat. Pe toată lungimea unei bare, combină punct cu punct: tablourile din `computeBendingMoment(lc, n)` folosesc aceleași `x` pentru fiecare caz.

```ts
const n = 60
const g = beam.computeBendingMoment(dead, n).M
const q = beam.computeBendingMoment(live, n).M
const uls = g.map((m, i) => 1.35 * m + 1.5 * q[i])
Math.max(...uls) // 105750 N·m, la x = 3
```

O înfășurătoare, adică cea mai mare și cea mai mică valoare din mai multe combinații, este un `Math.max` și un `Math.min` peste astfel de tablouri, punct cu punct. Pentru o încărcare mobilă, calculează în schimb modelul o dată pentru fiecare poziție a încărcării: [exemplul cu linia de influență](/ro/solver/scripts#an-influence-line-as-csv) face exact asta.

## În aplicația EduBeam {#in-the-edubeam-app}

Aplicația calculează un singur caz de încărcare odată, așa că pentru combinații biblioteca îți oferă mai mult. Un model cu mai multe cazuri poate fi totuși [desenat](/ro/solver/drawing) caz cu caz: `StructurePlot` din @edubeam/plot primește în `loadCase` un indice în `solver.loadCases`.
