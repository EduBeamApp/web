---
title: Odczyt wyników
description: "Reakcje, przemieszczenia węzłów, siły przekrojowe wzdłuż pręta, linia ugięcia i siły przywęzłowe z modelu @edubeam/fem oraz format zwracanych danych."
order: 10
source: site
---

# Odczyt wyników {#reading-results}

Po `solve()` wyniki odczytuje się z węzłów i prętów, zawsze dla wybranego przypadku obciążenia. Wszystkie przykłady na tej stronie korzystają z jednego modelu: belki swobodnie podpartej o rozpiętości 6 m z przekrojem IPE 200 sztywnym na ścinanie i siłą 20 kN w odległości 2 m od A:

```ts [results.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 }) // sztywny na ścinanie

const A = domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
const B = domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
const lc = solver.loadCases[0]
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], true)
solver.solve()
```

::model-figure{caption="Siła 20 kN w odległości 2 m na przęśle o rozpiętości 6 m"}
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

## Gdzie co odczytać {#what-to-read-where}

| Wynik | Wywołanie | Zwraca |
| --- | --- | --- |
| Reakcje | `node.getReactions(lc)` | `{ dofs, values }`: N, N·m |
| Przemieszczenia | `node.getUnknowns(lc, dofs)` | m, rad |
| N, V lub M w punkcie | `beam.computeBendingMomentAt(lc, x)` | liczbę: N, N·m |
| N, V lub M wzdłuż pręta | `beam.computeBendingMoment(lc, n)` | `{ x, M }`, n + 1 punktów |
| Linia ugięcia | `beam.computeLocalDefl(lc, n)` | `{ u, w }`, n + 1 punktów, m |
| Siły przywęzłowe | `beam.computeEndForces(lc)` | macierz mathjs z 6 wartościami |

Dla N i V metody to `computeNormalForceAt` i `computeShearForceAt` oraz `computeNormalForce` i `computeShearForce`, zwracające `{ x, N }` i `{ x, V }`. Znaki opisuje strona [Jednostki i konwencja znaków](/pl/solver/conventions#signs-of-the-results).

## Reakcje {#reactions}

`getReactions` zwraca jedną reakcję dla każdego stopnia swobody zablokowanego przez podporę: `dofs` je wymienia, w kolejności podanej w `createNode`, a `values` zawiera reakcje w tej samej kolejności. Gdy reakcji jest kilka, `values` jest **macierzą mathjs**, a gdy jest jedna – zwykłą tablicą, więc mała funkcja pomocnicza zamienia je na tablicę w obu przypadkach:

```ts
/** Zamienia macierz mathjs, tablicę lub liczbę na zwykłą tablicę. */
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

Aby wybrać jedną reakcję niezależnie od kolejności, wyszukaj jej stopień swobody: `list(values)[dofs.indexOf(DofID.Dz)]`, jak w [przykładzie z belką ciągłą](/pl/solver/beams#a-continuous-beam).

Reakcja to siła, jaką podpora działa na konstrukcję: −13 333 N wzdłuż z to 13,3 kN skierowane w górę, $P\,b/L = 20 \cdot 4/6$. W węźle z [obróconymi osiami](/pl/solver/nodes-supports#inclined-supports) reakcje są podawane w tych osiach; `getReactions(lc, true)` przelicza je na osie globalne i zwraca wszystkie trzy stopnie swobody, z zerem tam, gdzie nic nie jest zablokowane. Węzeł bez podpory zwraca `{ dofs: [], values: [] }`.

## Przemieszczenia {#displacements}

`getUnknowns` odczytuje dowolne stopnie swobody węzła, podparte lub nie:

```ts
list(A.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])) // [0, 0, -0.0108924]
```

Węzeł A obraca się zgodnie z ruchem wskazówek zegara o 0,010892 rad, $P\,b\,(L^2 - b^2)/6EIL$. Gdy pytasz o jeden stopień swobody, `getUnknowns` zwraca zwykłą liczbę, choć TypeScript deklaruje macierz: `list` radzi sobie i z tym.

## Siły przekrojowe wzdłuż pręta {#internal-forces-along-a-member}

Metody `…At` podają wartość w punkcie odległym o `x` metrów od pierwszego węzła pręta:

```ts
beam.computeShearForceAt(lc, 1) // 13333.3 N
beam.computeShearForceAt(lc, 2) // -6666.7 N: w miejscu siły – wartość za nią
beam.computeBendingMomentAt(lc, 2) // 26666.7 N·m: R_A · 2
```

Tam, gdzie siła skupiona powoduje skok, wartość dokładnie w miejscu siły to wartość po jej drugiej stronie. Aby odczytać wartość przed siłą, zapytaj o punkt minimalnie wcześniejszy, np. `x - 1e-9`.

Metody zwracające tablice próbkują pręt w n + 1 równo rozmieszczonych punktach, łącznie z końcami:

```ts
beam.computeBendingMoment(lc, 3)
// { x: [0, 2, 4, 6], M: [0, 26666.7, 13333.3, 0] }, z dokładnością do zaokrągleń
```

Spodziewaj się błędów zaokrągleń, np. `-3.6e-12` tam, gdzie dokładna wartość to 0: przed wypisaniem formatuj liczby metodą `toFixed`. Największa wartość wzdłuż pręta to największa wartość z gęstego próbkowania, np. `computeBendingMoment(lc, 500)`, jak w [przykładzie z belką ciągłą](/pl/solver/beams#a-continuous-beam). Pod obciążeniem rozłożonym M jest wielomianem, więc jego dokładne ekstremum leży tam, gdzie V zmienia znak; [@edubeam/plot](/pl/plot/model#reading-values-yourself) wyznacza je dokładnie.

## Linia ugięcia {#deflected-shape}

```ts
beam.computeLocalDefl(lc, 3)
// { u: [0, 0, 0, 0], w: [0, 0.0174279, 0.0152494, 0] }
```

`computeLocalDefl` podaje przemieszczenia wzdłuż pręta i w poprzek niego, `u` i `w`, w jego osiach lokalnych; `computeGlobalDefl` – te same punkty w globalnych x i z. Ugięcie pod siłą, 17,43 mm, to $P\,a^2 b^2/3EIL$. Kształt między węzłami jest dokładny, a nie interpolowany z wartości na końcach. Jak go narysować, opisuje strona [Rysowanie wyników](/pl/solver/drawing).

## Siły przywęzłowe {#end-forces}

```ts
beam.computeEndForces(lc).toArray()
// [0, -13333.3, 0, 0, -6666.7, 0]: X12, Z12, M12, X21, Z21, M21
```

Siły, jakimi oba węzły działają na pręt, w jego osiach lokalnych: to liczby z tabeli *Wyniki elementów* w aplikacji, objaśnione w części [Siły przywęzłowe](/pl/elements/conventions#end-forces-element-results-table).

## Wyniki do sprawdzenia {#results-as-numbers-to-check}

Każda powyższa wartość zgadza się ze swoim wzorem analitycznym. Strona [Sprawdzanie wyników ręcznie](/pl/guide/verification) omawia wiele innych przypadków z podręczników, rozwiązanych przez ten sam solver w przeglądarce.
