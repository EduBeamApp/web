---
title: Węzły i podpory
description: "Utwórz węzły modelu w @edubeam/fem, podeprzyj je, blokując stopnie swobody, obróć osie podpory, by uzyskać podporę ukośną, i zmieniaj węzły po obliczeniach."
order: 3
group: Modelowanie
source: site
---

# Węzły i podpory {#nodes-and-supports}

Węzły to punkty, w których łączą się pręty. Podpora nie jest osobnym obiektem: to lista stopni swobody, które węzeł ma zablokowane. Fragmenty kodu na tej stronie są częściami programu takiego jak ten ze strony [Pierwsze kroki](/pl/solver/getting-started) i korzystają z jego `solver`, `domain` i `lc`.

## Tworzenie węzła {#create-a-node}

```ts
domain.createNode(label, [x, y, z], bcs)
```

| Argument | Typ | Znaczenie |
| --- | --- | --- |
| `label` | `string \| number` | Nazwa węzła, przechowywana jako tekst: `1` i `'1'` to ten sam węzeł |
| `coords` | `number[]` | `[x, y, z]` w metrach, z `y = 0`. Oś z jest skierowana w dół. |
| `bcs` | `DofID[]` | Stopnie swobody blokowane przez podporę. Pomiń ten argument dla węzła swobodnego. |

Metoda zwraca obiekt `Node`; `domain.getNode(label)` pozwala go później odnaleźć. Utworzenie węzła z etykietą, która jest już w użyciu, zastępuje stary węzeł.

```ts
import { DofID } from '@edubeam/fem'

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [0, 0, -4]) // swobodny: górny koniec słupa o wysokości 4 m
```

## Podpory {#supports}

Każda podpora z aplikacji EduBeam to zestaw zablokowanych stopni swobody:

| Podpora | `bcs` | Blokuje |
| --- | --- | --- |
| Utwierdzenie | `[DofID.Dx, DofID.Dz, DofID.Ry]` | wszystko |
| Przegub | `[DofID.Dx, DofID.Dz]` | oba przemieszczenia, obrót jest swobodny |
| Przegub przesuwny | `[DofID.Dz]` | przemieszczenie pionowe, przesuwa się wzdłuż x |
| Przegub przesuwny pionowy | `[DofID.Dx]` | przemieszczenie poziome, przesuwa się wzdłuż z |
| Utwierdzenie przesuwne | `[DofID.Dz, DofID.Ry]` | przemieszczenie pionowe i obrót, przesuwa się wzdłuż x |
| Utwierdzenie przesuwne pionowe | `[DofID.Dx, DofID.Ry]` | przemieszczenie poziome i obrót, przesuwa się wzdłuż z |
| Tylko obrót zablokowany | `[DofID.Ry]` | obrót |

W kolejności, w jakiej je podasz, wracają potem [reakcje](/pl/solver/results#reactions). Konstrukcja potrzebuje co najmniej trzech zablokowanych stopni swobody, rozmieszczonych tak, by nie mogła się poruszać jak mechanizm: zob. [Gdy obliczenia się nie udają](/pl/solver/solving#when-solving-fails).

Zablokowany stopień swobody można też przesunąć o zadaną wartość, czyli zadać osiadanie podpory: zob. [Zadane przemieszczenia](/pl/solver/temperature-settlements#prescribed-displacements).

## Podpory ukośne {#inclined-supports}

Podpora przesuwna na pochyłej płaszczyźnie blokuje węzeł prostopadle do niej, a nie pionowo. Obróć osie węzła metodą `updateLcs`; jego `bcs` odnoszą się wtedy do obróconych osi. W programie ze strony Pierwsze kroki utwórz B tak:

```ts
const b = domain.createNode('B', [6, 0, 0], [DofID.Dz]) // blokuje własną oś z
const a = (30 * Math.PI) / 180 // 30°, od x w stronę z: zgodnie z ruchem wskazówek zegara na ekranie
b.updateLcs({ locx: [Math.cos(a), 0, Math.sin(a)], locy: [0, 1, 0] })
```

`locx` to własna oś x węzła zapisana jako wektor w osiach globalnych, a `locy` – jego oś y, która pozostaje `[0, 1, 0]`. W aplikacji EduBeam ten sam kąt to *Kąt lokalnego układu* węzła, 30°.

Po `solve()` podpora B działa prostopadle do pochyłej płaszczyzny, a podpora nieprzesuwna w A przejmuje składową poziomą:

```ts
b.getReactions(lc).values // [-41569]: N wzdłuż własnej osi z węzła B, 36 kN / cos 30°
b.getReactions(lc, true).values // [20785, -36000, 0]: wzdłuż x, wzdłuż z, moment
```

::model-figure{caption="Podpora przesuwna obrócona o 30°: jej reakcja jest prostopadła do pochyłej płaszczyzny, a belka jest rozciągana"}
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

Składowa pionowa to nadal $qL/2 = 36$ kN; pozioma, $36 \tan 30° = 20{,}8$ kN, rozciąga belkę, ciągnąc ją z obu końców. Moment się nie zmienia.

W obróconym węźle przemieszczenia i reakcje są podawane w jego własnych osiach, chyba że przekażesz `true`, by otrzymać je w osiach globalnych. Obciążenia węzłowe przyłożone do takiego węzła są globalne, chyba że wskażesz inaczej: zob. [Obciążenia węzłowe](/pl/solver/loads#nodal-loads). `node.updateLcs()` bez argumentu przywraca pierwotne osie.

## Zmiana węzła {#change-a-node}

Węzeł to zwykły obiekt: zmień `node.coords`, aby go przesunąć, albo zastąp `node.bcs`, czyli `Set<DofID>`, aby zmienić podporę.

```ts
domain.getNode('B').coords = [8, 0, 0] // dłuższe przęsło: wystarczy solve()
domain.getNode('A').bcs = new Set(fixed) // nowa podpora: najpierw ponumeruj od nowa
solver.codeNumberGenerated = false
solver.solve()
```

Zmiana podpór albo dodanie lub usunięcie węzłów zmienia układ równań: bez `codeNumberGenerated = false` solver **po cichu zachowuje stare podpory**. Część [Ponowne obliczenia po zmianie](/pl/solver/solving#solving-again-after-a-change) wymienia zmiany, które tego wymagają.
