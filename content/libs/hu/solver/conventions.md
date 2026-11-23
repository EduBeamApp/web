---
title: Mértékegységek és előjelek
description: "Az @edubeam/fem mértékegységei, tengelyei, szabadságfokai és előjelszabályai, valamint az, hogyan változtatja meg a rúd iránya az eredmények előjelét."
order: 2
source: site
---

# Mértékegységek és előjelek {#units-and-signs}

A számítómagnak nincs saját mértékegység-rendszere: azokkal a számokkal számol, amelyeket megadsz neki. Ha SI-ben adod meg az adatokat, minden eredményt SI-ben kapsz vissza. Az itteni példák és az EduBeam alkalmazás mindig így tesznek. Az előjelek is az alkalmazáséval egyeznek; az elméleti kézikönyv ábrákkal magyarázza őket a [Tengelyek és előjelszabály](/hu/elements/conventions) oldalon.

## Mértékegységek {#units}

| Mennyiség | Mértékegység | Példa |
| --- | --- | --- |
| Koordináták, hosszak, rúd menti helyzetek | m | `[6, 0, 0]` |
| Erők | N | `20e3` 20 kN-hoz |
| Nyomatékok | N·m | `10e3` 10 kNm-hez |
| Vonal mentén megoszló terhek | N/m | `12e3` 12 kN/m-hez |
| Rugalmassági és nyírási rugalmassági modulus | Pa | `210e9` |
| Keresztmetszeti terület | m² | `28.5e-4` 28,5 cm²-hez |
| Inercianyomaték | m⁴ | `1943e-8` 1943 cm⁴-hez |
| Hőmérséklet-változás | K | `20` |
| Hőtágulási együttható | 1/K | `12e-6` |
| Elmozdulások, elfordulások | m, rad | `0.01` 10 mm-hez |

Bármilyen konzisztens rendszer működik, például a kN, m és kPa, amelyekkel az eredmények kN-ban és kNm-ben jönnek ki. Az SI-vel viszont semmire sem kell figyelned.

## Tengelyek {#axes}

- Az **x** jobbra, a **z lefelé mutat**, a modell pedig az x–z síkban fekszik. A koordináták alakja `[x, y, z]`, ahol `y = 0`.
- Az **y** feléd, a képernyőből kifelé mutat. Az elfordulások és nyomatékok az y tengely körül értendők, így a pozitív irány a képernyőn az **óramutató járásával ellentétes**.
- A rúd **lokális x** tengelye az első csomóponttól a másodikig tart. A **lokális z** a lokális x tengely a képernyőn 90°-kal az óramutató járásával megegyezően elforgatva: egy balról jobbra rajzolt rúdon lefelé mutat.

Mivel a z lefelé mutat, a gravitációs teher pozitív `fz`, és egy $z = 0$-n álló 4 m-es oszlop teteje $z = -4$-nél van.

## Szabadságfokok {#degrees-of-freedom}

Egy `Beam2D` modell minden csomópontjának három szabadságfoka van, ezeket a `DofID` felsorolás nevezi meg:

| `DofID` | Érték | Jelentés |
| --- | --- | --- |
| `DofID.Dx` | 0 | Elmozdulás x irányban |
| `DofID.Dz` | 2 | Elmozdulás z irányban, lefelé |
| `DofID.Ry` | 4 | Elfordulás az y tengely körül, az óramutató járásával ellentétesen |

A `Dy`, `Rx` és `Rz` (1, 3, 5) létezik a felsorolásban, de a síkbeli rudak nem használják.

## Az eredmények előjele {#signs-of-the-results}

| Eredmény | Pozitív, ha | Kiolvasás |
| --- | --- | --- |
| N normálerő | húzás | `computeNormalForceAt` |
| M hajlítónyomaték | a lokális +z oldal húzott: balról jobbra rajzolt tartón alul húzott | `computeBendingMomentAt` |
| V nyíróerő | M a lokális x mentén nő, $V = dM/dx$; balról jobbra rajzolt tartón a tartódarabot az óramutató járásával megegyezően forgatja: kéttámaszú tartó bal támaszánál $+qL/2$ | `computeShearForceAt` |
| w lehajlás | a lokális +z irányába: balról jobbra rajzolt tartón lefelé | `computeLocalDefl` |
| Csomóponti elmozdulás | +x, +z (lefelé) irányban, az óramutató járásával ellentétesen | `node.getUnknowns` |
| Támaszerő | a támasz által a szerkezetre kifejtett erő, +x, +z (lefelé) irányban, az óramutató járásával ellentétesen | `node.getReactions` |
| Rúdvégi erők | a csomópontok által a rúdra kifejtett erők, a rúd lokális tengelyeiben | `computeEndForces` |

Ezért egy lefelé terhelt tartó csuklós támasza z irányban −36 000 N támaszerőt ad: ez 36 kN felfelé.

## Rúd menti helyzetek {#positions-along-a-member}

Minden `…At(lc, x)` metódus `x`-et a rúd első csomópontjától mért méterben várja, nem a hossz törtrészeként. A rúd menti koncentrált terheket is ugyanígy kell elhelyezni.

## A rúd iránya {#member-direction}

M és w a rúd saját tengelyeiben értendő, ezért számít a két csomópontjának sorrendje. Az [Első lépések](/hu/solver/getting-started) 12 kN/m-rel terhelt tartója mindkét irányban megadva, globális tengelyekben megadott teherrel (`[0, 12e3], false`), hogy mindkét esetben lefelé nyomjon, a `computeBendingMomentAt(lc, 3)`, a `computeLocalDefl(lc, 2).w[1]` és a `computeShearForceAt` metódussal kiolvasva:

| Rúd | M a támaszköz közepén | w a támaszköz közepén | V az A pontban |
| --- | --- | --- | --- |
| `['A', 'B']`, balról jobbra | +54 000 N·m | +0,0499 m | +36 000 N, `x = 0`-nál |
| `['B', 'A']`, jobbról balra | −54 000 N·m | −0,0499 m | +36 000 N, `x = 6`-nál |

Jobbról balra megadva a lokális z felfelé mutat, így ugyanaz az alul húzott tartó negatív nyomatékot és felfelé mutató lehajlást ad. N és V a tartó minden pontjában megtartja az előjelét; csak `x` számítódik a másik végtől. A lokális tengelyekben (`true`) megadott teher a rúddal együtt fordul: a jobbról balra megadott tartón a `[0, 12e3], true` felfelé nyom.

::callout{type="tip" title="Úgy add meg a rudakat, ahogy rajzolod őket"}
Tartókat balról jobbra, oszlopokat alulról felfelé, és az előjelek a tankönyvben megszokottak lesznek. Alulról felfelé megadott oszlopnál a lokális z jobbra mutat, így a jobb oldali szál húzása pozitív nyomaték. A [keretes példaprogram](/hu/solver/frames#things-to-notice) be is mutatja.
::
