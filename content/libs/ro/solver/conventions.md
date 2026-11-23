---
title: Unități și convenții de semne
description: "Unitățile, axele, gradele de libertate și convențiile de semne din @edubeam/fem și felul în care sensul unei bare schimbă semnul rezultatelor ei."
order: 2
source: site
---

# Unități și convenții de semne {#units-and-signs}

Programul de calcul nu are un sistem de unități propriu: calculează cu numerele pe care i le dai. Dă-i date în SI și toate rezultatele vin în SI. Exemplele de pe aceste pagini și aplicația EduBeam fac întotdeauna așa. Și semnele sunt cele ale aplicației; manualul ei teoretic le explică, cu figuri, în [Axe și convenții de semne](/ro/elements/conventions).

## Unități {#units}

| Mărime | Unitate | Exemplu |
| --- | --- | --- |
| Coordonate, lungimi, poziții în lungul unei bare | m | `[6, 0, 0]` |
| Forțe | N | `20e3` pentru 20 kN |
| Momente | N·m | `10e3` pentru 10 kNm |
| Încărcări liniare | N/m | `12e3` pentru 12 kN/m |
| Modul de elasticitate longitudinal și transversal | Pa | `210e9` |
| Arie | m² | `28.5e-4` pentru 28,5 cm² |
| Moment de inerție | m⁴ | `1943e-8` pentru 1943 cm⁴ |
| Variație de temperatură | K | `20` |
| Coeficient de dilatare termică | 1/K | `12e-6` |
| Deplasări, rotiri | m, rad | `0.01` pentru 10 mm |

Merge orice sistem coerent, de exemplu kN, m și kPa, care dă rezultate în kN și kNm. Cu SI nu mai trebuie să verifici nimic.

## Axe {#axes}

- **x** este orientată spre dreapta, **z în jos**, iar modelul se află în planul x–z. Coordonatele se scriu `[x, y, z]`, cu `y = 0`.
- **y** iese din ecran, spre tine. Rotirile și momentele sunt în jurul lui y, deci una pozitivă este **în sens antiorar** pe ecran.
- **Axa locală x** a unei bare merge de la primul ei nod la al doilea. **Axa locală z** este axa locală x rotită pe ecran cu 90° în sens orar: la o bară desenată de la stânga la dreapta, este orientată în jos.

Deoarece z este orientată în jos, o încărcare gravitațională este un `fz` pozitiv, iar capătul de sus al unui stâlp de 4 m care stă la $z = 0$ se află la $z = -4$.

## Grade de libertate {#degrees-of-freedom}

Fiecare nod al unui model `Beam2D` are trei grade de libertate, denumite prin enumerarea `DofID`:

| `DofID` | Valoare | Semnificație |
| --- | --- | --- |
| `DofID.Dx` | 0 | Deplasare după x |
| `DofID.Dz` | 2 | Deplasare după z, în jos |
| `DofID.Ry` | 4 | Rotire în jurul lui y, în sens antiorar |

`Dy`, `Rx` și `Rz` (1, 3, 5) există în enumerare, dar barele plane nu le folosesc.

## Semnele rezultatelor {#signs-of-the-results}

| Rezultat | Pozitiv înseamnă | Se citește cu |
| --- | --- | --- |
| Forța axială N | întindere | `computeNormalForceAt` |
| Momentul încovoietor M | întindere pe partea +z locală: fibra inferioară întinsă, la o grindă desenată de la stânga la dreapta | `computeBendingMomentAt` |
| Forța tăietoare V | M crește în lungul axei locale x, $V = dM/dx$; la o grindă desenată de la stânga la dreapta rotește o porțiune de grindă în sens orar: $+qL/2$ în reazemul din stânga al unei grinzi simplu rezemate | `computeShearForceAt` |
| Săgeata w | după +z local: în jos, la o grindă desenată de la stânga la dreapta | `computeLocalDefl` |
| Deplasarea nodului | după +x, +z (în jos), în sens antiorar | `node.getUnknowns` |
| Reacțiunea | forța cu care reazemul acționează asupra structurii, după +x, +z (în jos), în sens antiorar | `node.getReactions` |
| Forțele la capete | forțele cu care nodurile acționează asupra barei, în axele ei locale | `computeEndForces` |

Așadar, la o grindă încărcată în jos, articulația dă o reacțiune de −36 000 N după z: 36 kN care împing în sus.

## Poziții în lungul unei bare {#positions-along-a-member}

Fiecare metodă `…At(lc, x)` primește `x` în metri de la primul nod al barei, nu ca fracțiune din lungimea ei. Forțele concentrate pe bare se poziționează la fel.

## Sensul barei {#member-direction}

M și w se măsoară în axele proprii ale barei, deci contează ordinea celor două noduri ale ei. Iată grinda cu 12 kN/m din [Primii pași](/ro/solver/getting-started), definită în ambele sensuri, cu încărcarea în axe globale, `[0, 12e3], false`, astfel încât să împingă în jos de fiecare dată, și citită cu `computeBendingMomentAt(lc, 3)`, `computeLocalDefl(lc, 2).w[1]` și `computeShearForceAt`:

| Bară | M la mijlocul deschiderii | w la mijlocul deschiderii | V în A |
| --- | --- | --- | --- |
| `['A', 'B']`, de la stânga la dreapta | +54 000 N·m | +0,0499 m | +36 000 N, la `x = 0` |
| `['B', 'A']`, de la dreapta la stânga | −54 000 N·m | −0,0499 m | +36 000 N, la `x = 6` |

Când grinda este definită de la dreapta la stânga, axa ei locală z este orientată în sus, așa că aceeași grindă, cu fibra inferioară întinsă, dă un moment negativ și o săgeată în sus. N și V își păstrează semnul în fiecare punct al grinzii; doar `x` se măsoară de la celălalt capăt. O încărcare dată în axe locale (`true`) se rotește odată cu bara: la grinda definită de la dreapta la stânga, `[0, 12e3], true` împinge în sus.

::callout{type="tip" title="Definește barele așa cum le desenezi"}
Definește grinzile de la stânga la dreapta și stâlpii de jos în sus, iar semnele se vor citi ca în manual. La un stâlp definit de jos în sus, axa locală z este orientată spre dreapta, deci întinderea pe fața din dreapta dă un moment pozitiv. [Exemplul de cadru](/ro/solver/frames#things-to-notice) arată acest lucru.
::
