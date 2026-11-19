---
title: Obciążenia węzłów i prętów
description: "Przyłóż w @edubeam/fem siły i momenty w węzłach oraz obciążenia równomierne, trapezowe i skupione na prętach, w osiach globalnych lub lokalnych, i zmieniaj je."
order: 6
group: Obciążenia
source: site
---

# Obciążenia węzłów i prętów {#nodal-and-member-loads}

Obciążenia należą do przypadku obciążenia. Solver zaczyna z jednym, `solver.loadCases[0]`, a każda jego metoda `create…` dodaje obciążenie i je zwraca. Wiele przypadków i ich kombinacje opisuje strona [Przypadki obciążenia](/pl/solver/load-cases).

Wartości podaje się w N, N/m i N·m, zgodnie z [osiami](/pl/solver/conventions#axes): +z jest skierowana w dół, a dodatni moment kręci przeciwnie do ruchu wskazówek zegara.

## Belka ze wszystkimi rodzajami obciążeń {#a-beam-with-every-kind}

Belka o rozpiętości 8 m na podporze przegubowej nieprzesuwnej i przesuwnej, z obciążeniem liniowym narastającym od 4 do 10 kN/m, siłą skupioną 20 kN, momentem skupionym 10 kNm i siłą poziomą w podporze przesuwnej:

```ts [loads.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // podpora nieprzesuwna
domain.createNode('B', [8, 0, 0], [DofID.Dz]) // podpora przesuwna
domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
// 4 kN/m w A, narasta do 10 kN/m w B, w dół
lc.createBeamElementTrapezoidalEdgeLoad(1, [0, 4e3], [0, 10e3], false)
// [fx, fz, my, a]: 20 kN w dół, 2 m od A
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], false)
// moment skupiony 10 kNm przeciwnie do ruchu wskazówek zegara, 6 m od A
lc.createBeamConcentratedLoad(1, [0, 0, 10e3, 6], false)
// 5 kN w prawo w B
lc.createNodalLoad('B', { [DofID.Dx]: 5e3 })
solver.solve()

// getReactions zwraca macierz mathjs albo tablicę: zamień ją na tablicę
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

console.log(list(domain.getNode('A').getReactions(lc).values))
console.log(list(domain.getNode('B').getReactions(lc).values))
```

```text [Wynik]
[ -5000, -40250 ]
[ -35750 ]
```

Ręcznie: wypadkowa obciążenia liniowego to 56 kN, działająca 4,571 m od A, więc z równania momentów względem A: $8R_B = 56 \cdot 4{,}571 + 20 \cdot 2 - 10 = 286$, $R_B = 35{,}75$ kN w górę, a $R_A = 76 - 35{,}75 = 40{,}25$ kN w górę. Podpora nieprzesuwna przejmuje też siłę 5 kN, przez co cała belka jest rozciągana siłą 5 kN.

::model-figure{caption="Te same obciążenia. Na rysunku moment skupiony przyłożono w węźle C, 6 m od A, co daje te same wyniki."}
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

## Obciążenia węzłowe {#nodal-loads}

```ts
lc.createNodalLoad(node, { [DofID.Dx]: fx, [DofID.Dz]: fz, [DofID.Ry]: my }, lcs)
```

Podaj tylko potrzebne składowe. Wartości są w osiach globalnych albo – gdy `lcs` ma wartość `true` – we własnych osiach węzła obróconego metodą [`updateLcs`](/pl/solver/nodes-supports#inclined-supports). Siła działająca w kierunku stopnia swobody zablokowanego przez podporę trafia wprost do reakcji i niczego nie zgina.

## Obciążenia prętów {#member-loads}

| Metoda | Wartości | Obciążenie |
| --- | --- | --- |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | N/m | równomierne na całej długości pręta |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | N/m | liniowo zmienne, od pierwszego węzła do drugiego |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | N, N·m, m | siła i moment skupiony w odległości `a` metrów od pierwszego węzła |

Obciążenia liniowe zawsze obejmują cały pręt. Jeśli obciążenie działa tylko na części przęsła, podziel pręt węzłem w miejscu, w którym się ono zaczyna: dodatkowy węzeł nie zmienia żadnego wyniku. Siłę lub moment skupiony można umieścić w dowolnym miejscu pręta.

### Osie globalne czy lokalne {#global-or-local-axes}

Ostatni argument, `lcs`, określa, w których osiach są podane składowe:

- `false`: globalne x i z. `fz` działa pionowo bez względu na nachylenie pręta.
- `true`: lokalne osie pręta, x (wzdłuż niego) i z (w poprzek). `fz` działa prostopadle do pręta.

W poziomym pręcie rysowanym od lewej do prawej oba warianty są takie same; w pręcie rysowanym od prawej do lewej lokalne `fz` jest skierowane w górę.

::callout{type="info" title="Obciążenia liniowe działają na metr długości pręta"}
Oba warianty działają na metr własnej długości pręta. Na krokwi o długości 5 m, której rzut poziomy ma 4 m, `[0, 10e3]` w osiach globalnych daje łącznie 50 kN. Obciążenie śniegiem 10 kN/m odniesione do rzutu poziomego to wzdłuż krokwi $10 \cdot 4/5 = 8$ kN/m: podaj `[0, 8e3]`.
::

## Zmiana lub usunięcie obciążenia {#change-or-remove-a-load}

Każda metoda `create…` zwraca obciążenie. Zmień jego wartości i rozwiąż model ponownie:

```ts
const q = lc.createBeamElementUniformEdgeLoad(1, [0, 10e3], true)
solver.solve()
q.values = [0, 20e3] // dwa razy większe obciążenie
solver.solve()
```

Obciążenia są przechowywane w zwykłych tablicach, `lc.nodalLoadList` i `lc.elementLoadList` (obciążenia prętów i obciążenia termiczne), więc `lc.elementLoadList.splice(index, 1)` usuwa jedno z nich. Nazwy właściwości każdego obciążenia podaje [dokumentacja API](/pl/solver/reference#loads).

Zmiany temperatury i osiadania podpór to także obciążenia: zob. [Temperatura i osiadania podpór](/pl/solver/temperature-settlements).
