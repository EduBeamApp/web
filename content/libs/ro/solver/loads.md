---
title: Încărcări în noduri și pe bare
description: "Aplică în @edubeam/fem forțe și momente în noduri și încărcări uniform distribuite, trapezoidale și concentrate pe bare, în axe globale sau locale; apoi modifică-le sau elimină-le."
order: 6
group: Încărcări
source: site
---

# Încărcări în noduri și pe bare {#nodal-and-member-loads}

Încărcările aparțin unui caz de încărcare. Programul de calcul pornește cu unul, `solver.loadCases[0]`, iar fiecare metodă `create…` a acestuia adaugă o încărcare și o întoarce. Pentru mai multe cazuri și combinațiile lor, vezi [Cazuri de încărcare](/ro/solver/load-cases).

Valorile sunt în N, N/m și N·m și respectă [axele](/ro/solver/conventions#axes): +z este în jos, iar un moment pozitiv este în sens antiorar.

## O grindă cu toate tipurile de încărcări {#a-beam-with-every-kind}

O grindă de 8 m, articulată la un capăt și simplu rezemată la celălalt, cu o încărcare liniară care crește de la 4 la 10 kN/m, o forță concentrată de 20 kN, un moment concentrat de 10 kNm și o forță orizontală în reazemul simplu:

```ts [loads.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // articulație
domain.createNode('B', [8, 0, 0], [DofID.Dz]) // reazem simplu
domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
// 4 kN/m în A, crescând la 10 kN/m în B, în jos
lc.createBeamElementTrapezoidalEdgeLoad(1, [0, 4e3], [0, 10e3], false)
// [fx, fz, my, a]: 20 kN în jos, la 2 m de A
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], false)
// un moment concentrat de 10 kNm în sens antiorar, la 6 m de A
lc.createBeamConcentratedLoad(1, [0, 0, 10e3, 6], false)
// 5 kN spre dreapta în B
lc.createNodalLoad('B', { [DofID.Dx]: 5e3 })
solver.solve()

// getReactions întoarce o matrice mathjs sau un tablou: transformă-l în tablou
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

console.log(list(domain.getNode('A').getReactions(lc).values))
console.log(list(domain.getNode('B').getReactions(lc).values))
```

```text [Rezultat]
[ -5000, -40250 ]
[ -35750 ]
```

Prin calcul manual: rezultanta încărcării liniare este 56 kN și acționează la 4,571 m de A, deci ecuația de momente față de A dă $8R_B = 56 \cdot 4{,}571 + 20 \cdot 2 - 10 = 286$, $R_B = 35{,}75$ kN în sus, iar $R_A = 76 - 35{,}75 = 40{,}25$ kN în sus. Articulația preia și forța de 5 kN, care întinde toată grinda cu 5 kN.

::model-figure{caption="Aceleași încărcări. Figura pune momentul concentrat într-un nod C la 6 m, ceea ce dă aceleași rezultate."}
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

## Încărcări nodale {#nodal-loads}

```ts
lc.createNodalLoad(node, { [DofID.Dx]: fx, [DofID.Dz]: fz, [DofID.Ry]: my }, lcs)
```

Dă doar componentele de care ai nevoie. Valorile sunt în axe globale sau, cu `lcs` setat la `true`, în axele proprii ale nodului, pentru un nod rotit cu [`updateLcs`](/ro/solver/nodes-supports#inclined-supports). O forță pe un grad de libertate blocat de reazem trece direct în reacțiune și nu încovoaie nimic.

## Încărcări pe bare {#member-loads}

| Metodă | Valori | Încărcare |
| --- | --- | --- |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | N/m | uniform distribuită pe toată bara |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | N/m | liniar variabilă, de la primul nod la al doilea |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | N, N·m, m | o forță și un moment concentrat, la `a` metri de primul nod |

Încărcările liniare acoperă întotdeauna toată bara. Pentru o încărcare pe o parte a deschiderii, împarte bara cu un nod acolo unde începe încărcarea: un nod suplimentar nu schimbă niciun rezultat. O forță sau un moment concentrat poate fi pus oriunde în lungul barei.

### Axe globale sau locale {#global-or-local-axes}

Ultimul argument, `lcs`, spune în ce axe sunt date componentele:

- `false`: x și z globale. `fz` acționează vertical, indiferent de înclinarea barei.
- `true`: axele locale ale barei, x (în lungul ei) și z (transversal). `fz` acționează perpendicular pe bară.

Pe o bară orizontală desenată de la stânga la dreapta, cele două coincid; desenată de la dreapta la stânga, `fz` local este orientat în sus.

::callout{type="info" title="Încărcările liniare sunt pe metru de bară"}
Ambele variante acționează pe metru din lungimea proprie a barei. Pe un căprior lung de 5 m, cu proiecția orizontală de 4 m, `[0, 10e3]` în axe globale însumează 50 kN. O încărcare din zăpadă de 10 kN/m raportată la proiecția orizontală înseamnă $10 \cdot 4/5 = 8$ kN/m în lungul căpriorului: dă `[0, 8e3]`.
::

## Modifică sau elimină o încărcare {#change-or-remove-a-load}

Fiecare metodă `create…` întoarce încărcarea. Modifică-i valorile și calculează din nou:

```ts
const q = lc.createBeamElementUniformEdgeLoad(1, [0, 10e3], true)
solver.solve()
q.values = [0, 20e3] // încărcare dublă
solver.solve()
```

Încărcările stau în tablouri obișnuite, `lc.nodalLoadList` și `lc.elementLoadList` (încărcări pe bare și din variații de temperatură), așa că `lc.elementLoadList.splice(index, 1)` elimină una dintre ele. Numele proprietăților fiecărei încărcări sunt în [referința API](/ro/solver/reference#loads).

Variațiile de temperatură și cedările de reazem sunt și ele încărcări: vezi [Temperatură și cedări de reazem](/ro/solver/temperature-settlements).
