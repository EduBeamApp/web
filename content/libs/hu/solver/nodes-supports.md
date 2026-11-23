---
title: Csomópontok és támaszok
description: "Egy @edubeam/fem modell csomópontjainak létrehozása, megtámasztásuk szabadságfokok gátlásával, a támasz tengelyeinek elforgatása ferde görgős támaszhoz, és a csomópontok későbbi módosítása."
order: 3
group: Modellezés
source: site
---

# Csomópontok és támaszok {#nodes-and-supports}

A csomópontok azok a pontok, amelyekben a rudak kapcsolódnak. A támasz nem külön objektum: azoknak a szabadságfokoknak a listája, amelyeket a csomópont gátol. Az oldalon lévő kódrészletek egy olyan program részei, mint az [Első lépések](/hu/solver/getting-started) oldalon lévő, és annak `solver`, `domain` és `lc` változóját használják.

## Csomópont létrehozása {#create-a-node}

```ts
domain.createNode(label, [x, y, z], bcs)
```

| Argumentum | Típus | Jelentés |
| --- | --- | --- |
| `label` | `string \| number` | A csomópont neve, szövegként tárolva: az `1` és az `'1'` ugyanaz a csomópont |
| `coords` | `number[]` | `[x, y, z]` méterben, ahol `y = 0`. A z lefelé mutat. |
| `bcs` | `DofID[]` | A támasz által gátolt szabadságfokok. Szabad csomópontnál hagyd el. |

A metódus a `Node` objektumot adja vissza; a `domain.getNode(label)` később is megtalálja. Ha a jelölés már foglalt, az új csomópont lecseréli a régit.

```ts
import { DofID } from '@edubeam/fem'

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [0, 0, -4]) // szabad: egy 4 m-es oszlop teteje
```

## Támaszok {#supports}

Az EduBeam alkalmazás minden támasza gátolt szabadságfokok egy halmaza:

| Támasz | `bcs` | Gátolja |
| --- | --- | --- |
| Befogás | `[DofID.Dx, DofID.Dz, DofID.Ry]` | mindent |
| Csuklós támasz | `[DofID.Dx, DofID.Dz]` | mindkét elmozdulást, szabadon elfordulhat |
| Görgős támasz | `[DofID.Dz]` | a függőleges elmozdulást, x mentén gördül |
| Függőleges görgős támasz | `[DofID.Dx]` | a vízszintes elmozdulást, z mentén gördül |
| Görgős befogás | `[DofID.Dz, DofID.Ry]` | a függőleges elmozdulást és az elfordulást, x mentén csúszik |
| Függőleges görgős befogás | `[DofID.Dx, DofID.Ry]` | a vízszintes elmozdulást és az elfordulást, z mentén csúszik |
| Gátolt elfordulás | `[DofID.Ry]` | az elfordulást |

Amilyen sorrendben megadod őket, olyan sorrendben kapod vissza a [támaszerőket](/hu/solver/results#reactions). A szerkezethez legalább három gátolt szabadságfok kell, úgy elrendezve, hogy ne mozdulhasson el mechanizmusként: lásd [Ha a megoldás nem sikerül](/hu/solver/solving#when-solving-fails).

Egy gátolt szabadságfok adott értékkel el is mozdítható, ez a támaszsüllyedés: lásd [Előírt elmozdulások](/hu/solver/temperature-settlements#prescribed-displacements).

## Ferde támaszok {#inclined-supports}

A lejtőn álló görgős támasz a csomópontot a lejtőre merőlegesen tartja meg, nem függőlegesen. Forgasd el a csomópont tengelyeit az `updateLcs` metódussal; ekkor a `bcs` az elforgatott tengelyekre vonatkozik. Az Első lépések programjában B-t így hozd létre:

```ts
const b = domain.createNode('B', [6, 0, 0], [DofID.Dz]) // a saját z tengelye mentén gátol
const a = (30 * Math.PI) / 180 // 30°, x-től z felé: a képernyőn az óramutató járásával megegyezően
b.updateLcs({ locx: [Math.cos(a), 0, Math.sin(a)], locy: [0, 1, 0] })
```

A `locx` a csomópont saját x tengelye globális tengelyekben felírt vektorként, a `locy` pedig az y tengelye, amely `[0, 1, 0]` marad. Az EduBeam alkalmazásban ugyanez a szög a csomópont *Csomóponti koordináta-rendszer szöge* mezője, 30°.

A `solve()` után B a lejtőre merőlegesen nyom, a vízszintes komponenst pedig az A-beli csuklós támasz veszi fel:

```ts
b.getReactions(lc).values // [-41569]: N, B saját z tengelye mentén, 36 kN / cos 30°
b.getReactions(lc, true).values // [20785, -36000, 0]: x mentén, z mentén, nyomaték
```

::model-figure{caption="30°-kal elforgatott görgős támasz: a támaszereje merőleges a lejtőre, a tartó húzott"}
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

A függőleges komponens továbbra is $qL/2 = 36$ kN; a vízszintes, $36 \tan 30° = 20{,}8$ kN, mindkét végén húzza a tartót. A nyomaték nem változik.

Elforgatott csomópontnál az elmozdulások és a támaszerők a csomópont saját tengelyeiben értendők, hacsak nem adsz meg `true`-t a globális tengelyekhez. A rá ható csomóponti terhek globálisak, hacsak másként nem rendelkezel: lásd [Csomóponti terhek](/hu/solver/loads#nodal-loads). Az argumentum nélküli `node.updateLcs()` visszaforgatja a tengelyeket.

## Csomópont módosítása {#change-a-node}

A csomópont egyszerű objektum: a `node.coords` módosításával áthelyezheted, a `node.bcs` (egy `Set<DofID>`) cseréjével pedig megváltoztathatod a támaszát.

```ts
domain.getNode('B').coords = [8, 0, 0] // hosszabb támaszköz: elég a solve()
domain.getNode('A').bcs = new Set(fixed) // új támasz: előbb számozz újra
solver.codeNumberGenerated = false
solver.solve()
```

A támaszok módosítása, illetve csomópontok hozzáadása vagy törlése megváltoztatja az egyenletrendszert: `codeNumberGenerated = false` nélkül a számítómag **szó nélkül megtartja a régi támaszokat**. Az [Újbóli megoldás módosítás után](/hu/solver/solving#solving-again-after-a-change) rész felsorolja, mely módosítások igénylik ezt.
