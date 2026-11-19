---
title: Jednostki i konwencja znaków
description: "Jednostki, osie, stopnie swobody i konwencja znaków w @edubeam/fem oraz to, jak kierunek pręta zmienia znak jego wyników."
order: 2
source: site
---

# Jednostki i konwencja znaków {#units-and-signs}

Solver nie ma własnego układu jednostek: liczy na liczbach, które mu podasz. Podaj dane w SI, a wszystkie wyniki też otrzymasz w SI. Tak postępują zawsze przykłady na tych stronach i aplikacja EduBeam. Konwencja znaków jest taka sama jak w aplikacji; jej podręcznik teoretyczny objaśnia ją z rysunkami na stronie [Układ współrzędnych i konwencje znaków](/pl/elements/conventions).

## Jednostki {#units}

| Wielkość | Jednostka | Przykład |
| --- | --- | --- |
| Współrzędne, długości, położenia na pręcie | m | `[6, 0, 0]` |
| Siły | N | `20e3` dla 20 kN |
| Momenty | N·m | `10e3` dla 10 kNm |
| Obciążenia liniowe | N/m | `12e3` dla 12 kN/m |
| Moduł Younga i moduł Kirchhoffa | Pa | `210e9` |
| Pole przekroju | m² | `28.5e-4` dla 28,5 cm² |
| Moment bezwładności | m⁴ | `1943e-8` dla 1943 cm⁴ |
| Zmiana temperatury | K | `20` |
| Współczynnik rozszerzalności termicznej | 1/K | `12e-6` |
| Przemieszczenia, obroty | m, rad | `0.01` dla 10 mm |

Sprawdzi się każdy spójny układ, np. kN, m i kPa, w którym wyniki wychodzą w kN i kNm. Przy SI nie musisz jednak niczego pilnować.

## Osie {#axes}

- **Oś x** jest skierowana w prawo, **oś z – w dół**, a model leży w płaszczyźnie x–z. Współrzędne zapisuje się jako `[x, y, z]`, z `y = 0`.
- **Oś y** wychodzi z ekranu w stronę patrzącego. Obroty i momenty są liczone względem osi y, więc dodatnie kręcą na ekranie **przeciwnie do ruchu wskazówek zegara**.
- **Lokalna oś x** pręta biegnie od jego pierwszego węzła do drugiego. Jego **lokalna oś z** to lokalna oś x obrócona na ekranie o 90° zgodnie z ruchem wskazówek zegara: w pręcie rysowanym od lewej do prawej jest skierowana w dół.

Ponieważ oś z jest skierowana w dół, obciążenie grawitacyjne to dodatnie `fz`, a górny koniec słupa o wysokości 4 m stojącego na $z = 0$ leży na $z = -4$.

## Stopnie swobody {#degrees-of-freedom}

Każdy węzeł modelu z elementów `Beam2D` ma trzy stopnie swobody, nazwane w typie wyliczeniowym `DofID`:

| `DofID` | Wartość | Znaczenie |
| --- | --- | --- |
| `DofID.Dx` | 0 | Przemieszczenie wzdłuż x |
| `DofID.Dz` | 2 | Przemieszczenie wzdłuż z, w dół |
| `DofID.Ry` | 4 | Obrót wokół y, przeciwnie do ruchu wskazówek zegara |

`Dy`, `Rx` i `Rz` (1, 3, 5) istnieją w tym typie, ale płaskie pręty z nich nie korzystają.

## Znaki wyników {#signs-of-the-results}

| Wynik | Wartość dodatnia oznacza | Metoda |
| --- | --- | --- |
| Siła normalna N | rozciąganie | `computeNormalForceAt` |
| Moment zginający M | rozciąganie po stronie lokalnej osi +z: w belce rysowanej od lewej do prawej rozciągane są włókna dolne | `computeBendingMomentAt` |
| Siła tnąca V | M rośnie wzdłuż lokalnej osi x, $V = dM/dx$; w belce rysowanej od lewej do prawej obraca wycinek belki zgodnie z ruchem wskazówek zegara: $+qL/2$ przy lewej podporze belki swobodnie podpartej | `computeShearForceAt` |
| Ugięcie w | wzdłuż lokalnej osi +z: w belce rysowanej od lewej do prawej – w dół | `computeLocalDefl` |
| Przemieszczenie węzła | wzdłuż +x, +z (w dół), obrót przeciwnie do ruchu wskazówek zegara | `node.getUnknowns` |
| Reakcja | siła, jaką podpora działa na konstrukcję, wzdłuż +x, +z (w dół), moment przeciwnie do ruchu wskazówek zegara | `node.getReactions` |
| Siły przywęzłowe | siły, jakimi węzły działają na pręt, w jego osiach lokalnych | `computeEndForces` |

Dlatego podpora nieprzesuwna belki obciążonej w dół zwraca reakcję −36 000 N wzdłuż z, czyli 36 kN skierowane w górę.

## Położenia na pręcie {#positions-along-a-member}

Każda metoda `…At(lc, x)` przyjmuje `x` w metrach od pierwszego węzła pręta, a nie jako ułamek jego długości. Tak samo umieszcza się na pręcie obciążenia skupione.

## Kierunek pręta {#member-direction}

M i w są mierzone w osiach samego pręta, więc kolejność jego dwóch węzłów ma znaczenie. Poniżej belka obciążona 12 kN/m ze strony [Pierwsze kroki](/pl/solver/getting-started), zdefiniowana na oba sposoby, z obciążeniem w osiach globalnych (`[0, 12e3], false`), które za każdym razem działa w dół. Wyniki odczytano metodami `computeBendingMomentAt(lc, 3)`, `computeLocalDefl(lc, 2).w[1]` i `computeShearForceAt`:

| Pręt | M (środek rozpiętości) | w (środek rozpiętości) | V (podpora A) |
| --- | --- | --- | --- |
| `['A', 'B']`, od lewej do prawej | +54 000 N·m | +0,0499 m | +36 000 N, w `x = 0` |
| `['B', 'A']`, od prawej do lewej | −54 000 N·m | −0,0499 m | +36 000 N, w `x = 6` |

Przy definicji od prawej do lewej lokalna oś z jest skierowana w górę, więc ta sama belka z rozciąganymi włóknami dolnymi zwraca ujemny moment i ugięcie w górę. N i V zachowują znak w każdym punkcie belki; tylko `x` liczy się od drugiego końca. Obciążenie podane w osiach lokalnych (`true`) obraca się razem z prętem: w belce zdefiniowanej od prawej do lewej `[0, 12e3], true` działa w górę.

::callout{type="tip" title="Definiuj pręty tak, jak je rysujesz"}
Belki od lewej do prawej, słupy od dołu do góry – wtedy znaki są takie jak w podręczniku. W słupie zdefiniowanym od dołu do góry lokalna oś z jest skierowana w prawo, więc rozciąganie po prawej stronie słupa daje moment dodatni. Pokazuje to [przykładowy program dla ramy](/pl/solver/frames#things-to-notice).
::
