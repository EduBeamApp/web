---
title: API-referencia
description: "Az @edubeam/fem 0.3 minden osztálya, metódusa és argumentuma, mértékegységekkel, alapértékekkel és a visszatérési értékek felépítésével."
order: 16
group: Referencia
source: site
---

# API-referencia {#api-reference}

Amit az `@edubeam/fem` 0.3 exportál, felhasználás szerint csoportosítva. A mértékegységek mindenhol SI-egységek: m, N, N·m, N/m, Pa, K és rad. A jelölések (`LabelType`) típusa `string | number`, és szövegként tárolódnak. Az itt fel nem sorolt metódusok belsők: TypeScriptben csak azért nyilvánosak, mert a számítómag saját osztályai hívják őket.

## Exportok {#exports}

| Export | Fajta | Szakasz |
| --- | --- | --- |
| `LinearStaticSolver` | osztály | [Számítások](#analyses) |
| `Solver` | absztrakt osztály | [Számítások](#analyses) |
| `Domain` | osztály | [Domain](#domain) |
| `Node` | osztály | [Node](#node) |
| `Beam2D`, `Element` | osztályok | [Elemek](#elements) |
| `Material`, `CrossSection` | osztályok | [Anyagok és keresztmetszetek](#materials-and-sections) |
| `LoadCase` | osztály | [Terhek](#loads) |
| `NodalLoad`, `BeamConcentratedLoad`, `BeamElementUniformEdgeLoad`, `BeamElementTrapezoidalEdgeLoad`, `BeamTemperatureLoad`, `PrescribedDisplacement`, `Load`, `BeamElementLoad` | osztályok | [Terhek](#loads) |
| `DofID` | felsorolás (enum) | [DofID](#dofid) |
| `LabelType`, `EnumDictionary`, `MaterialParameters`, `CrossSectionParameters` | típusok | |

## Számítások {#analyses}

### `LinearStaticSolver` {#linearstaticsolver}

```ts
const solver = new LinearStaticSolver()
```

| Tag | Típus | Leírás |
| --- | --- | --- |
| `domain` | `Domain` | A modell |
| `loadCases` | `LoadCase[]` | Egy esettel indul, ez a `'DefaultLC'`. Továbbiakat a `new LoadCase(label, solver.domain)` segítségével adhatsz hozzá: [Terhelési esetek](/hu/solver/load-cases). |
| `solve()` | `void` | Szükség esetén megszámozza az egyenleteket, összeállítja és megoldja az összes terhelési esetet. [Mechanizmus](/hu/solver/solving#when-solving-fails) esetén kivételt dobhat, de nem mindig. A 0.3.1-es verziótól semmit sem ír ki; a 0.3.0 kiírta a számítási időt. |
| `codeNumberGenerated` | `boolean` | Állítsd `false`-ra csomópontok vagy rudak hozzáadása, illetve törlése vagy a támaszok módosítása után: [miért](/hu/solver/solving#solving-again-after-a-change) |
| `neq`, `pneq` | `number` | A szabad és a gátolt szabadságfokok száma, megoldás után |
| `k` | mathjs `Matrix` | Az összeállított globális merevségi mátrix, megoldás után |
| `getNodeDofIDs(label)` | `number[]` | Egy csomópont szabadságfokai, megoldás után |

Az `EigenValueDynamicSolver` létezik a forráskódban, de nincs exportálva.

## Domain {#domain}

A `solver.domain` négy `Map`-ben tárolja a modellt, amelyek kulcsa a szövegként tárolt jelölés: `nodes`, `elements`, `materials`, `crossSections`. Törlő metódusok nincsenek: a `domain.nodes.delete(label)` és a `domain.elements.delete(label)` töröl egy csomópontot vagy rudat, utána pedig [újra kell számozni](/hu/solver/solving#solving-again-after-a-change).

| Metódus | Visszatérési érték | Leírás |
| --- | --- | --- |
| `createNode(label, coords?, bcs?)` | `Node` | `coords`: `[x, y, z]` m-ben (alapérték `[0, 0, 0]`), `bcs`: a gátolt `DofID`-k (alapérték: egyik sem) |
| `createBeam2D(label, nodes, mat, cs, hinges?)` | `Beam2D` | `nodes`: `[first, second]`, `hinges`: `[atFirst, atSecond]` (alapérték `[false, false]`) |
| `createMaterial(label, params?)` | `Material` | Lásd [Anyagok és keresztmetszetek](#materials-and-sections) |
| `createCrossSection(label, params?)` | `CrossSection` | Lásd [Anyagok és keresztmetszetek](#materials-and-sections) |
| `getNode(label)`, `getElement(label)`, `getMaterial(label)`, `getCS(label)` | az objektum | Ismeretlen jelölésnél `RangeError` kivételt dob. A `getElement` típusa `Element`: az eredmények kiolvasásához írd hozzá: `as Beam2D`. |

Ha egy objektumot már foglalt jelöléssel hozol létre, az lecseréli a régit.

## Node {#node}

| Tag | Típus | Leírás |
| --- | --- | --- |
| `label` | `string` | |
| `coords` | `number[]` | `[x, y, z]`, m. Módosítsd a csomópont áthelyezéséhez. |
| `bcs` | `Set<DofID>` | Gátolt szabadságfokok. Cseréld le a támasz módosításához. |
| `lcs` | `number[][] \| undefined` | A csomópont elforgatott tengelyei, ha vannak |
| `updateLcs({ locx, locy }?)` | `void` | Elforgatja a csomópont tengelyeit: `locx` az x tengelye globális komponensekben, `locy` `[0, 1, 0]`. Argumentum nélkül visszaállítja őket. |
| `hasLcs()` | `boolean` | El vannak-e forgatva a tengelyek |
| `getUnknowns(lc, dofs)` | `Matrix`, egy szabadságfoknál `number` | Elmozdulások (m) és elfordulások (rad), a csomópont tengelyeiben |
| `getReactions(lc, global?)` | `{ dofs, values }` | Támaszerők a gátolt szabadságfokokban, a `bcs` sorrendjében: N, N·m. A `values` több támaszerőnél mathjs `Matrix`, egynél egyelemű tömb, szabad csomópontnál `[]`. Elforgatott csomópontnál `true` értékű `global` esetén: mindhárom szabadságfok globális tengelyekben, `dofs` `[0, 2, 4]`, a `values` pedig tömb, amelyben 0 áll ott, ahol nincs gátlás. [Kiolvasásuk](/hu/solver/results#reactions). |

## Elemek {#elements}

### `Beam2D` {#beam2d}

Kétcsomópontos Timoshenko-gerenda az x–z síkban, csomópontonként három szabadságfokkal (`Dx`, `Dz`, `Ry`). Az `x` az első csomóponttól mért méterben értendő; `n` a szakaszok száma, ami n + 1 pontot ad.

| Tag | Visszatérési érték | Leírás |
| --- | --- | --- |
| `label`, `nodes`, `mat`, `cs` | `string`, `string[]`, `string`, `string` | |
| `hinges` | `[boolean, boolean]` | Nyomatékfelszabadítás az első és a második csomópontnál |
| `computeNormalForceAt(lc, x)` | `number` | N, a húzás pozitív |
| `computeShearForceAt(lc, x)` | `number` | V, pozitív, ahol M a lokális x mentén nő |
| `computeBendingMomentAt(lc, x)` | `number` | M, pozitív, ha a lokális +z oldal húzott |
| `computeNormalForce(lc, n)` | `{ x, N }` | N n + 1 pontban |
| `computeShearForce(lc, n)` | `{ x, V }` | V n + 1 pontban |
| `computeBendingMoment(lc, n)` | `{ x, M }` | M n + 1 pontban |
| `computeLocalDefl(lc, n)` | `{ u, w }` | Rúdirányú és rúdra merőleges elmozdulások lokális tengelyekben, m |
| `computeGlobalDefl(lc, n)` | `{ u, w }` | Ugyanez globális x és z irányban |
| `computeEndForces(lc)` | `Matrix` | `[X12, Z12, M12, X21, Z21, M21]`, a csomópontok által a rúdra kifejtett erők, lokális tengelyekben |
| `computeEndDisplacement(lc)` | `Matrix` | Rúdvégi elmozdulások lokális tengelyekben, a csuklók elfordulásával együtt |
| `computeGeo()` | `{ l, dx, dz }` | Hossz és vetületek, m |
| `computeT()` | `Matrix` | 6 × 6-os transzformációs mátrix, globálisról lokálisra |
| `computeLocalStiffnessMtrx()` | `{ answer }` | `answer`: 6 × 6-os lokális merevségi mátrix, a csuklók kikondenzálva |
| `computeStiffness()` | `Matrix` | 6 × 6-os globális merevségi mátrix |
| `computeShearFactor()` | `number` | $\Phi = 12EI_y/kGAL^2$ |
| `getMaterial()`, `getCS()` | `Material`, `CrossSection` | |

Koncentrált erő helyén a `…At` metódusok a közvetlenül utána következő értéket adják vissza. Az `Element` a `Beam2D` absztrakt ősosztálya; a `domain.elements` és a `getElement` ezt a típust használja.

## Anyagok és keresztmetszetek {#materials-and-sections}

| `MaterialParameters` | Mértékegység | Alapérték | Felhasználás |
| --- | --- | --- | --- |
| `e` | Pa | 1 | merevség |
| `g` | Pa | 1 | nyírási merevség |
| `alpha` | 1/K | 1 | hőmérsékleti terhek |
| `d` | kg/m³ | 1 | statikában nincs szerepe |

| `CrossSectionParameters` | Mértékegység | Alapérték | Felhasználás |
| --- | --- | --- | --- |
| `a` | m² | nincs, kötelező | tengelyirányú és nyírási merevség |
| `iy` | m⁴ | nincs, kötelező | hajlítási merevség |
| `k` | – | nincs, kötelező | nyírási merevség, $kGA$; `1e32`, ha nem kell |
| `h` | m | nincs | hőmérséklet-különbség (nélküle `NaN`) |
| `iz`, `dyz`, `j` | m⁴ | nincs | a `Beam2D` nem használja |

A hiányzó anyagparaméter értéke 1, nem valamilyen szokásos érték; hiányzó `a`, `iy` vagy `k` esetén minden eredmény `NaN`. Egyik sem dob kivételt. Mindkét osztálynak van `change(params)` metódusa, amely beállítja a megadott paramétereket, és ugyanilyen nevű tulajdonságokként tárolja őket.

## Terhek {#loads}

### `LoadCase` {#loadcase}

| Metódus | Visszatérési érték | Értékek |
| --- | --- | --- |
| `createNodalLoad(node, values, lcs?)` | `NodalLoad` | `{ [DofID.Dx]: N, [DofID.Dz]: N, [DofID.Ry]: N·m }`; `lcs` (alapérték `false`) `true` értéke esetén: a csomópont elforgatott tengelyeiben |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | `BeamElementUniformEdgeLoad` | N/m a teljes rúdon |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | `BeamElementTrapezoidalEdgeLoad` | N/m az első és a második csomópontnál, köztük lineárisan |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | `BeamConcentratedLoad` | N, N, N·m, az első csomóponttól `a` m-re |
| `createBeamTemperatureLoad(el, [dTc, dTb, dTt])` | `BeamTemperatureLoad` | K: súlypont, alsó szál, felső szál |
| `createPrescribedDisplacement(node, values)` | `PrescribedDisplacement` | `{ [DofID.Dz]: m, … }` gátolt szabadságfokokon, a csomópont tengelyeiben; nem gátolt szabadságfokokon figyelmen kívül marad |

Rúdterheknél az `lcs` `true` értéke lokális tengelyeket jelent (x a rúd mentén, z rá merőlegesen), a `false` globálisakat. A megoszló terhek a rúd hosszának egy méterére vonatkoznak. Példák a [Csomóponti terhek és rúdterhek](/hu/solver/loads) oldalon találhatók.

| Tag | Típus | Leírás |
| --- | --- | --- |
| `label` | `string` | |
| `nodalLoadList` | `NodalLoad[]` | |
| `elementLoadList` | `BeamElementLoad[]` | Rúdterhek és hőmérsékleti terhek |
| `prescribedBC` | `PrescribedDisplacement[]` | |
| `solved` | `boolean` | Sikeres megoldás után `true` |
| `getElementLoadsOnElement(el)` | `BeamElementLoad[]` | Egy rúd terhei |

A teherobjektumok nyilvános tulajdonságokban tárolják az értékeiket, amelyeket újbóli megoldás előtt módosíthatsz: `values` (és `lcs`) a `NodalLoad`, a `BeamElementUniformEdgeLoad`, a `BeamConcentratedLoad` és a `BeamTemperatureLoad` esetében; `startValues` és `endValues` a `BeamElementTrapezoidalEdgeLoad` esetében; `prescribedValues` a `PrescribedDisplacement` esetében. Mindegyiknek van `target` tulajdonsága is: annak a jelölése, amire hat.

## DofID {#dofid}

| Név | Érték | A `Beam2D` használja |
| --- | --- | --- |
| `Dx` | 0 | igen |
| `Dy` | 1 | nem |
| `Dz` | 2 | igen |
| `Rx` | 3 | nem |
| `Ry` | 4 | igen |
| `Rz` | 5 | nem |

## Eredmények {#results}

Az eredményeket egy `Beam2D`-ből (igénybevételek, lehajlások, rúdvégi erők) és egy `Node`-ból (elmozdulások, támaszerők) lehet kiolvasni, mindig egy adott `LoadCase`-re, a `solve()` után: lásd a fenti két táblázatot, a példákat és az előjeleket pedig az [Eredmények kiolvasása](/hu/solver/results) oldalon. Röviden:

| Mit kapsz | Hívás |
| --- | --- |
| Támaszerők, N és N·m | `node.getReactions(lc)` |
| Elmozdulások, m, és elfordulások, rad | `node.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])` |
| N, V vagy M egy pontban, N és N·m | `beam.computeNormalForceAt(lc, x)`, `computeShearForceAt`, `computeBendingMomentAt` |
| N, V vagy M a rúd mentén | `beam.computeNormalForce(lc, n)`, `computeShearForce`, `computeBendingMoment` |
| Deformált alak, m | `beam.computeLocalDefl(lc, n)`, `computeGlobalDefl` |
| Rúdvégi erők, N és N·m | `beam.computeEndForces(lc)` |
| Ábra az egészről | `StructurePlot` vagy `structureSvg` az [@edubeam/plot](/hu/solver/drawing) csomagból |
