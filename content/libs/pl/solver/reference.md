---
title: Dokumentacja API
description: "Wszystkie klasy, metody i argumenty @edubeam/fem 0.3, z jednostkami, wartościami domyślnymi i strukturą tego, co zwraca każda metoda."
order: 16
group: Dokumentacja API
source: site
---

# Dokumentacja API {#api-reference}

Co eksportuje `@edubeam/fem` 0.3, pogrupowane według zastosowania. Wszędzie obowiązują jednostki SI: m, N, N·m, N/m, Pa, K i rad. Etykiety (`LabelType`) mają typ `string | number` i są przechowywane jako tekst. Metody, których tu nie wymieniono, są wewnętrzne: w TypeScripcie są publiczne tylko dlatego, że wywołują je inne klasy solvera.

## Eksporty {#exports}

| Eksport | Rodzaj | Rozdział |
| --- | --- | --- |
| `LinearStaticSolver` | klasa | [Analizy](#analyses) |
| `Solver` | klasa abstrakcyjna | [Analizy](#analyses) |
| `Domain` | klasa | [Domain](#domain) |
| `Node` | klasa | [Node](#node) |
| `Beam2D`, `Element` | klasy | [Elementy](#elements) |
| `Material`, `CrossSection` | klasy | [Materiały i przekroje](#materials-and-sections) |
| `LoadCase` | klasa | [Obciążenia](#loads) |
| `NodalLoad`, `BeamConcentratedLoad`, `BeamElementUniformEdgeLoad`, `BeamElementTrapezoidalEdgeLoad`, `BeamTemperatureLoad`, `PrescribedDisplacement`, `Load`, `BeamElementLoad` | klasy | [Obciążenia](#loads) |
| `DofID` | enum | [DofID](#dofid) |
| `LabelType`, `EnumDictionary`, `MaterialParameters`, `CrossSectionParameters` | typy | |

## Analizy {#analyses}

### `LinearStaticSolver` {#linearstaticsolver}

```ts
const solver = new LinearStaticSolver()
```

| Składowa | Typ | Opis |
| --- | --- | --- |
| `domain` | `Domain` | Model |
| `loadCases` | `LoadCase[]` | Na początku zawiera jeden przypadek, `'DefaultLC'`. Kolejne dodawaj przez `new LoadCase(label, solver.domain)`: [Przypadki obciążenia](/pl/solver/load-cases). |
| `solve()` | `void` | W razie potrzeby numeruje równania, agreguje i rozwiązuje wszystkie przypadki obciążenia. Może zgłosić wyjątek dla [mechanizmu](/pl/solver/solving#when-solving-fails), ale nie zawsze. Od wersji 0.3.1 niczego nie wypisuje; wersja 0.3.0 wypisywała czas obliczeń. |
| `codeNumberGenerated` | `boolean` | Ustaw na `false` po dodaniu lub usunięciu węzłów lub prętów albo po zmianie podpór: [dlaczego](/pl/solver/solving#solving-again-after-a-change) |
| `neq`, `pneq` | `number` | Liczba swobodnych i liczba podpartych stopni swobody, po obliczeniach |
| `k` | mathjs `Matrix` | Zagregowana globalna macierz sztywności, po obliczeniach |
| `getNodeDofIDs(label)` | `number[]` | Stopnie swobody węzła, po obliczeniach |

`EigenValueDynamicSolver` istnieje w kodzie źródłowym, ale nie jest eksportowany.

## Domain {#domain}

`solver.domain` przechowuje model w czterech obiektach `Map`, których kluczem jest etykieta jako tekst: `nodes`, `elements`, `materials`, `crossSections`. Nie ma metod do usuwania: `domain.nodes.delete(label)` i `domain.elements.delete(label)` usuwają węzeł lub pręt, po czym trzeba [ponumerować równania od nowa](/pl/solver/solving#solving-again-after-a-change).

| Metoda | Zwraca | Opis |
| --- | --- | --- |
| `createNode(label, coords?, bcs?)` | `Node` | `coords` – `[x, y, z]` w m (domyślnie `[0, 0, 0]`), `bcs` – podparte `DofID` (domyślnie żadne) |
| `createBeam2D(label, nodes, mat, cs, hinges?)` | `Beam2D` | `nodes` – `[first, second]`, `hinges` – `[atFirst, atSecond]` (domyślnie `[false, false]`) |
| `createMaterial(label, params?)` | `Material` | Zob. [Materiały i przekroje](#materials-and-sections) |
| `createCrossSection(label, params?)` | `CrossSection` | Zob. [Materiały i przekroje](#materials-and-sections) |
| `getNode(label)`, `getElement(label)`, `getMaterial(label)`, `getCS(label)` | obiekt | Dla nieznanej etykiety zgłasza `RangeError`. `getElement` ma typ `Element`: aby odczytać wyniki, napisz `as Beam2D`. |

Utworzenie obiektu z etykietą, która jest już w użyciu, zastępuje stary obiekt.

## Node {#node}

| Składowa | Typ | Opis |
| --- | --- | --- |
| `label` | `string` | |
| `coords` | `number[]` | `[x, y, z]`, m. Zmień, aby przesunąć węzeł. |
| `bcs` | `Set<DofID>` | Podparte stopnie swobody. Zastąp, aby zmienić podporę. |
| `lcs` | `number[][] \| undefined` | Obrócone osie węzła, jeśli zostały obrócone |
| `updateLcs({ locx, locy }?)` | `void` | Obraca osie węzła: `locx` – jego oś x w składowych globalnych, `locy` – `[0, 1, 0]`. Bez argumentu przywraca osie globalne. |
| `hasLcs()` | `boolean` | Czy osie są obrócone |
| `getUnknowns(lc, dofs)` | `Matrix` albo `number` dla jednego stopnia swobody | Przemieszczenia (m) i obroty (rad), w osiach węzła |
| `getReactions(lc, global?)` | `{ dofs, values }` | Reakcje w podpartych stopniach swobody, w kolejności `bcs`: N, N·m. `values` to macierz mathjs `Matrix` dla kilku reakcji, jednoelementowa tablica dla jednej i `[]` dla węzła swobodnego. Z `global` równym `true` w obróconym węźle: wszystkie trzy stopnie swobody w osiach globalnych, `dofs` równe `[0, 2, 4]`, `values` – tablica z 0 tam, gdzie nic nie jest zablokowane. [Jak je odczytać](/pl/solver/results#reactions). |

## Elementy {#elements}

### `Beam2D` {#beam2d}

Dwuwęzłowa belka Timoszenki w płaszczyźnie x–z, z trzema stopniami swobody w każdym węźle (`Dx`, `Dz`, `Ry`). `x` podaje się w metrach od pierwszego węzła; `n` to liczba odcinków, co daje n + 1 punktów.

| Składowa | Zwraca | Opis |
| --- | --- | --- |
| `label`, `nodes`, `mat`, `cs` | `string`, `string[]`, `string`, `string` | |
| `hinges` | `[boolean, boolean]` | Zwolnienia momentu w pierwszym i drugim węźle |
| `computeNormalForceAt(lc, x)` | `number` | N, rozciąganie dodatnie |
| `computeShearForceAt(lc, x)` | `number` | V, dodatnia tam, gdzie M rośnie wzdłuż lokalnej osi x |
| `computeBendingMomentAt(lc, x)` | `number` | M, dodatni przy rozciąganiu po stronie lokalnej osi +z |
| `computeNormalForce(lc, n)` | `{ x, N }` | N w n + 1 punktach |
| `computeShearForce(lc, n)` | `{ x, V }` | V w n + 1 punktach |
| `computeBendingMoment(lc, n)` | `{ x, M }` | M w n + 1 punktach |
| `computeLocalDefl(lc, n)` | `{ u, w }` | Przemieszczenia wzdłuż pręta i w poprzek niego, w osiach lokalnych, m |
| `computeGlobalDefl(lc, n)` | `{ u, w }` | To samo w globalnych x i z |
| `computeEndForces(lc)` | `Matrix` | `[X12, Z12, M12, X21, Z21, M21]`, siły, jakimi węzły działają na pręt, w osiach lokalnych |
| `computeEndDisplacement(lc)` | `Matrix` | Przemieszczenia końców w osiach lokalnych, łącznie z obrotami w przegubach |
| `computeGeo()` | `{ l, dx, dz }` | Długość i rzuty, m |
| `computeT()` | `Matrix` | Macierz transformacji 6 × 6, z osi globalnych do lokalnych |
| `computeLocalStiffnessMtrx()` | `{ answer }` | `answer`: lokalna macierz sztywności 6 × 6, ze skondensowanymi przegubami |
| `computeStiffness()` | `Matrix` | Globalna macierz sztywności 6 × 6 |
| `computeShearFactor()` | `number` | $\Phi = 12EI_y/kGAL^2$ |
| `getMaterial()`, `getCS()` | `Material`, `CrossSection` | |

W miejscu siły skupionej metody `…At` zwracają wartość tuż za nią. `Element` to abstrakcyjna klasa bazowa `Beam2D`; tego typu używają `domain.elements` i `getElement`.

## Materiały i przekroje {#materials-and-sections}

| `MaterialParameters` | Jednostka | Domyślnie | Zastosowanie |
| --- | --- | --- | --- |
| `e` | Pa | 1 | sztywność |
| `g` | Pa | 1 | sztywność postaciowa |
| `alpha` | 1/K | 1 | obciążenia termiczne |
| `d` | kg/m³ | 1 | nieużywany w statyce |

| `CrossSectionParameters` | Jednostka | Domyślnie | Zastosowanie |
| --- | --- | --- | --- |
| `a` | m² | brak, wymagany | sztywność osiowa i postaciowa |
| `iy` | m⁴ | brak, wymagany | sztywność na zginanie |
| `k` | – | brak, wymagany | sztywność postaciowa $kGA$; `1e32`, aby ją pominąć |
| `h` | m | brak | różnica temperatur (bez niego `NaN`) |
| `iz`, `dyz`, `j` | m⁴ | brak | nieużywane przez `Beam2D` |

Brakujący parametr materiału ma wartość 1, a nie jakąś typową wartość; brak `a`, `iy` lub `k` sprawia, że każdy wynik to `NaN`. W żadnym z tych przypadków nie pojawia się błąd. Obie klasy mają metodę `change(params)`, która ustawia podane parametry, i przechowują je jako właściwości o tych samych nazwach.

## Obciążenia {#loads}

### `LoadCase` {#loadcase}

| Metoda | Zwraca | Wartości |
| --- | --- | --- |
| `createNodalLoad(node, values, lcs?)` | `NodalLoad` | `{ [DofID.Dx]: N, [DofID.Dz]: N, [DofID.Ry]: N·m }`; `lcs` (domyślnie `false`) równe `true`: w obróconych osiach węzła |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | `BeamElementUniformEdgeLoad` | N/m na całej długości pręta |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | `BeamElementTrapezoidalEdgeLoad` | N/m w pierwszym i drugim węźle, liniowo pomiędzy nimi |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | `BeamConcentratedLoad` | N, N, N·m, w odległości `a` m od pierwszego węzła |
| `createBeamTemperatureLoad(el, [dTc, dTb, dTt])` | `BeamTemperatureLoad` | K: środek ciężkości, włókna dolne, włókna górne |
| `createPrescribedDisplacement(node, values)` | `PrescribedDisplacement` | `{ [DofID.Dz]: m, … }` w podpartych stopniach swobody, w osiach węzła; w swobodnych stopniach swobody ignorowane |

W obciążeniach prętów `lcs` równe `true` oznacza osie lokalne (x wzdłuż pręta, z w poprzek), a `false` – osie globalne. Obciążenia liniowe działają na metr długości pręta. Przykłady są na stronie [Obciążenia węzłów i prętów](/pl/solver/loads).

| Składowa | Typ | Opis |
| --- | --- | --- |
| `label` | `string` | |
| `nodalLoadList` | `NodalLoad[]` | |
| `elementLoadList` | `BeamElementLoad[]` | Obciążenia prętów i obciążenia termiczne |
| `prescribedBC` | `PrescribedDisplacement[]` | |
| `solved` | `boolean` | `true` po udanym rozwiązaniu |
| `getElementLoadsOnElement(el)` | `BeamElementLoad[]` | Obciążenia jednego pręta |

Obiekty obciążeń przechowują wartości w publicznych właściwościach, które możesz zmienić przed ponownym rozwiązaniem: `values` (i `lcs`) w `NodalLoad`, `BeamElementUniformEdgeLoad`, `BeamConcentratedLoad` i `BeamTemperatureLoad`; `startValues` i `endValues` w `BeamElementTrapezoidalEdgeLoad`; `prescribedValues` w `PrescribedDisplacement`. Każdy z nich ma też `target`, czyli etykietę obiektu, na który działa.

## DofID {#dofid}

| Nazwa | Wartość | Używany przez `Beam2D` |
| --- | --- | --- |
| `Dx` | 0 | tak |
| `Dy` | 1 | nie |
| `Dz` | 2 | tak |
| `Rx` | 3 | nie |
| `Ry` | 4 | tak |
| `Rz` | 5 | nie |

## Wyniki {#results}

Wyniki odczytuje się z `Beam2D` (siły przekrojowe, ugięcia, siły przywęzłowe) i z `Node` (przemieszczenia, reakcje), zawsze dla wybranego `LoadCase` i po `solve()`: zob. dwie tabele powyżej, a przykłady i znaki – na stronie [Odczyt wyników](/pl/solver/results). W skrócie:

| Co chcesz uzyskać | Wywołanie |
| --- | --- |
| Reakcje, N i N·m | `node.getReactions(lc)` |
| Przemieszczenia, m, i obroty, rad | `node.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])` |
| N, V lub M w punkcie, N i N·m | `beam.computeNormalForceAt(lc, x)`, `computeShearForceAt`, `computeBendingMomentAt` |
| N, V lub M wzdłuż pręta | `beam.computeNormalForce(lc, n)`, `computeShearForce`, `computeBendingMoment` |
| Linia ugięcia, m | `beam.computeLocalDefl(lc, n)`, `computeGlobalDefl` |
| Siły przywęzłowe, N i N·m | `beam.computeEndForces(lc)` |
| Rysunek wszystkich wyników | `StructurePlot` lub `structureSvg` z [@edubeam/plot](/pl/solver/drawing) |
