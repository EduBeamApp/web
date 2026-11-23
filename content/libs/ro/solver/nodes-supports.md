---
title: Noduri și reazeme
description: "Creează nodurile unui model @edubeam/fem, rezemă-le blocând grade de libertate, rotește axele unui reazem pentru un reazem simplu înclinat și modifică nodurile ulterior."
order: 3
group: Modelare
source: site
---

# Noduri și reazeme {#nodes-and-supports}

Nodurile sunt punctele în care se leagă barele. Un reazem nu este un obiect separat: este lista gradelor de libertate pe care un nod le are blocate. Fragmentele de cod de pe această pagină fac parte dintr-un program ca cel din [Primii pași](/ro/solver/getting-started) și folosesc `solver`, `domain` și `lc` din acesta.

## Creează un nod {#create-a-node}

```ts
domain.createNode(label, [x, y, z], bcs)
```

| Argument | Tip | Semnificație |
| --- | --- | --- |
| `label` | `string \| number` | Numele nodului, stocat ca șir de caractere: `1` și `'1'` sunt același nod |
| `coords` | `number[]` | `[x, y, z]` în metri, cu `y = 0`. z este orientată în jos. |
| `bcs` | `DofID[]` | Gradele de libertate blocate de reazem. Omite-l pentru un nod liber. |

Metoda întoarce obiectul `Node`; `domain.getNode(label)` îl găsește din nou. O etichetă deja folosită înlocuiește nodul vechi.

```ts
import { DofID } from '@edubeam/fem'

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [0, 0, -4]) // liber: capătul de sus al unui stâlp de 4 m
```

## Reazeme {#supports}

Fiecare reazem din aplicația EduBeam este un set de grade de libertate blocate:

| Reazem | `bcs` | Blochează |
| --- | --- | --- |
| Încastrare | `[DofID.Dx, DofID.Dz, DofID.Ry]` | tot |
| Articulație | `[DofID.Dx, DofID.Dz]` | ambele deplasări, rotirea este liberă |
| Reazem simplu | `[DofID.Dz]` | deplasarea verticală, este liber după x |
| Reazem simplu vertical | `[DofID.Dx]` | deplasarea orizontală, este liber după z |
| Încastrare glisantă | `[DofID.Dz, DofID.Ry]` | deplasarea verticală și rotirea, alunecă după x |
| Încastrare glisantă verticală | `[DofID.Dx, DofID.Ry]` | deplasarea orizontală și rotirea, alunecă după z |
| Doar rotire blocată | `[DofID.Ry]` | rotirea |

Ordinea în care le enumeri este ordinea în care se întorc [reacțiunile](/ro/solver/results#reactions). O structură are nevoie de cel puțin trei grade de libertate blocate, dispuse astfel încât structura să nu devină mecanism: vezi [Când calculul eșuează](/ro/solver/solving#when-solving-fails).

Un grad de libertate blocat poate fi și deplasat cu o valoare dată, adică o cedare de reazem: vezi [Deplasări impuse](/ro/solver/temperature-settlements#prescribed-displacements).

## Reazeme înclinate {#inclined-supports}

Un reazem simplu pe un plan înclinat blochează nodul perpendicular pe plan, nu vertical. Rotește axele nodului cu `updateLcs`, iar `bcs` se referă apoi la axele rotite. În programul din Primii pași, creează B astfel:

```ts
const b = domain.createNode('B', [6, 0, 0], [DofID.Dz]) // blochează propria axă z
const a = (30 * Math.PI) / 180 // 30°, de la x spre z: în sens orar pe ecran
b.updateLcs({ locx: [Math.cos(a), 0, Math.sin(a)], locy: [0, 1, 0] })
```

`locx` este axa x proprie a nodului, ca vector în axe globale, iar `locy` axa lui y, care rămâne `[0, 1, 0]`. În aplicația EduBeam, același unghi este *Unghiul sistemului local al nodului*, 30°.

După `solve()`, B împinge perpendicular pe plan, iar articulația din A preia componenta orizontală:

```ts
b.getReactions(lc).values // [-41569]: N după axa z proprie a lui B, 36 kN / cos 30°
b.getReactions(lc, true).values // [20785, -36000, 0]: după x, după z, moment
```

::model-figure{caption="Un reazem simplu rotit cu 30°: reacțiunea lui este perpendiculară pe plan, iar grinda este întinsă"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, N]
show: [nodeLabels]
---
::

Componenta verticală este tot $qL/2 = 36$ kN; cea orizontală, $36 \tan 30° = 20{,}8$ kN, trage de grindă la ambele capete. Momentul nu se schimbă.

La un nod rotit, deplasările și reacțiunile sunt în axele proprii ale nodului, dacă nu transmiți `true` pentru axele globale. Încărcările nodale pe el sunt globale, dacă nu specifici altfel: vezi [Încărcări nodale](/ro/solver/loads#nodal-loads). `node.updateLcs()` fără argument readuce axele la poziția inițială.

## Modifică un nod {#change-a-node}

Un nod este un obiect simplu: schimbă `node.coords` ca să-l muți sau înlocuiește `node.bcs`, un `Set<DofID>`, ca să-i schimbi reazemul.

```ts
domain.getNode('B').coords = [8, 0, 0] // o deschidere mai mare: ajunge solve()
domain.getNode('A').bcs = new Set(fixed) // un reazem nou: renumerotează mai întâi
solver.codeNumberGenerated = false
solver.solve()
```

Modificarea reazemelor sau adăugarea și eliminarea de noduri schimbă sistemul de ecuații: fără `codeNumberGenerated = false`, programul de calcul **păstrează în tăcere reazemele vechi**. [Recalcularea după o modificare](/ro/solver/solving#solving-again-after-a-change) enumeră modificările care au nevoie de asta.
