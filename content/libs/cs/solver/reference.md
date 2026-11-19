---
title: Reference API
description: "Všechny třídy, metody a argumenty @edubeam/fem 0.3, s jednotkami, výchozími hodnotami a podobou toho, co která metoda vrací."
order: 16
group: Reference
---

# Reference API {#api-reference}

Přehled toho, co `@edubeam/fem` 0.3 exportuje, seřazený podle toho, k čemu to použijete. Všude se používají jednotky SI: m, N, N·m, N/m, Pa, K a rad. Označení (`LabelType`) jsou `string | number` a ukládají se jako řetězce. Metody, které tu nejsou uvedené, jsou interní: v TypeScriptu jsou veřejné jen proto, že je volají vlastní třídy řešiče.

## Exporty {#exports}

| Export | Druh | Oddíl |
| --- | --- | --- |
| `LinearStaticSolver` | třída | [Výpočty](#analyses) |
| `Solver` | abstraktní třída | [Výpočty](#analyses) |
| `Domain` | třída | [Domain](#domain) |
| `Node` | třída | [Node](#node) |
| `Beam2D`, `Element` | třídy | [Prvky](#elements) |
| `Material`, `CrossSection` | třídy | [Materiály a průřezy](#materials-and-sections) |
| `LoadCase` | třída | [Zatížení](#loads) |
| `NodalLoad`, `BeamConcentratedLoad`, `BeamElementUniformEdgeLoad`, `BeamElementTrapezoidalEdgeLoad`, `BeamTemperatureLoad`, `PrescribedDisplacement`, `Load`, `BeamElementLoad` | třídy | [Zatížení](#loads) |
| `DofID` | enum | [DofID](#dofid) |
| `LabelType`, `EnumDictionary`, `MaterialParameters`, `CrossSectionParameters` | typy | |

## Výpočty {#analyses}

### `LinearStaticSolver` {#linearstaticsolver}

```ts
const solver = new LinearStaticSolver()
```

| Člen | Typ | Popis |
| --- | --- | --- |
| `domain` | `Domain` | Model |
| `loadCases` | `LoadCase[]` | Na začátku obsahuje jeden stav, `'DefaultLC'`. Další přidáte pomocí `new LoadCase(label, solver.domain)`: [Zatěžovací stavy](/cs/solver/load-cases). |
| `solve()` | `void` | V případě potřeby očísluje rovnice, sestaví a vyřeší všechny zatěžovací stavy. U [mechanismu](/cs/solver/solving#when-solving-fails) může vyhodit chybu, ale ne vždy. Od verze 0.3.1 nic nevypisuje; verze 0.3.0 vypisovala dobu výpočtu. |
| `codeNumberGenerated` | `boolean` | Po přidání nebo odebrání uzlů či prvků nebo po změně podpor ho nastavte na `false`: [proč](/cs/solver/solving#solving-again-after-a-change) |
| `neq`, `pneq` | `number` | Počet volných a podepřených stupňů volnosti, po výpočtu |
| `k` | mathjs `Matrix` | Sestavená globální matice tuhosti, po výpočtu |
| `getNodeDofIDs(label)` | `number[]` | Stupně volnosti uzlu, po výpočtu |

`EigenValueDynamicSolver` ve zdrojovém kódu existuje, ale exportovaný není.

## Domain {#domain}

`solver.domain` uchovává model ve čtyřech objektech `Map` s klíčem, kterým je označení převedené na řetězec: `nodes`, `elements`, `materials`, `crossSections`. Metody pro odebrání nemá: uzel nebo prvek odeberete pomocí `domain.nodes.delete(label)` a `domain.elements.delete(label)` a poté [znovu očíslujete](/cs/solver/solving#solving-again-after-a-change).

| Metoda | Vrací | Popis |
| --- | --- | --- |
| `createNode(label, coords?, bcs?)` | `Node` | `coords` `[x, y, z]` v m (výchozí `[0, 0, 0]`), `bcs` podepřené `DofID` (výchozí žádné) |
| `createBeam2D(label, nodes, mat, cs, hinges?)` | `Beam2D` | `nodes` `[first, second]`, `hinges` `[atFirst, atSecond]` (výchozí `[false, false]`) |
| `createMaterial(label, params?)` | `Material` | Viz [Materiály a průřezy](#materials-and-sections) |
| `createCrossSection(label, params?)` | `CrossSection` | Viz [Materiály a průřezy](#materials-and-sections) |
| `getNode(label)`, `getElement(label)`, `getMaterial(label)`, `getCS(label)` | objekt | Pro neznámé označení vyhodí `RangeError`. `getElement` má typ `Element`: chcete-li číst výsledky, napište `as Beam2D`. |

Vytvoření objektu s označením, které už je použité, nahradí původní objekt.

## Node {#node}

| Člen | Typ | Popis |
| --- | --- | --- |
| `label` | `string` | |
| `coords` | `number[]` | `[x, y, z]`, m. Jeho změnou uzel posunete. |
| `bcs` | `Set<DofID>` | Podepřené stupně volnosti. Jeho nahrazením změníte podporu. |
| `lcs` | `number[][] \| undefined` | Pootočené osy uzlu, pokud nějaké má |
| `updateLcs({ locx, locy }?)` | `void` | Pootočí osy uzlu: `locx` je jeho osa x v globálních složkách, `locy` `[0, 1, 0]`. Bez argumentu osy vrátí do výchozí polohy. |
| `hasLcs()` | `boolean` | Zda jsou osy pootočené |
| `getUnknowns(lc, dofs)` | `Matrix`, nebo `number` pro jeden stupeň volnosti | Posuny (m) a pootočení (rad) v osách uzlu |
| `getReactions(lc, global?)` | `{ dofs, values }` | Reakce v podepřených stupních volnosti v pořadí `bcs`: N, N·m. `values` je pro více reakcí matice mathjs `Matrix`, pro jednu jednoprvkové pole, pro volný uzel `[]`. S `global` `true` u pootočeného uzlu: všechny tři stupně volnosti v globálních osách, `dofs` `[0, 2, 4]`, `values` pole s nulou tam, kde podpora nic nedrží. [Jak je číst](/cs/solver/results#reactions). |

## Prvky {#elements}

### `Beam2D` {#beam2d}

Dvouuzlový Timošenkův nosníkový prvek v rovině x–z se třemi stupni volnosti v každém uzlu (`Dx`, `Dz`, `Ry`). `x` je vzdálenost v metrech od prvního uzlu; `n` je počet úseků, bodů je tedy n + 1.

| Člen | Vrací | Popis |
| --- | --- | --- |
| `label`, `nodes`, `mat`, `cs` | `string`, `string[]`, `string`, `string` | |
| `hinges` | `[boolean, boolean]` | Uvolnění momentu v prvním a druhém uzlu |
| `computeNormalForceAt(lc, x)` | `number` | N, tah kladný |
| `computeShearForceAt(lc, x)` | `number` | V, kladná tam, kde M roste ve směru lokální osy x |
| `computeBendingMomentAt(lc, x)` | `number` | M, kladný při tahu na straně lokální +z |
| `computeNormalForce(lc, n)` | `{ x, N }` | N v n + 1 bodech |
| `computeShearForce(lc, n)` | `{ x, V }` | V v n + 1 bodech |
| `computeBendingMoment(lc, n)` | `{ x, M }` | M v n + 1 bodech |
| `computeLocalDefl(lc, n)` | `{ u, w }` | Posuny ve směru prvku a kolmo na něj, v lokálních osách, m |
| `computeGlobalDefl(lc, n)` | `{ u, w }` | Totéž v globálních osách x a z |
| `computeEndForces(lc)` | `Matrix` | `[X12, Z12, M12, X21, Z21, M21]`, síly, kterými uzly působí na prvek, v lokálních osách |
| `computeEndDisplacement(lc)` | `Matrix` | Koncové posuny v lokálních osách, včetně pootočení v kloubech |
| `computeGeo()` | `{ l, dx, dz }` | Délka a průměty, m |
| `computeT()` | `Matrix` | Transformační matice 6 × 6 z globálních do lokálních os |
| `computeLocalStiffnessMtrx()` | `{ answer }` | `answer`: lokální matice tuhosti 6 × 6 s kondenzovanými klouby |
| `computeStiffness()` | `Matrix` | Globální matice tuhosti 6 × 6 |
| `computeShearFactor()` | `number` | $\Phi = 12EI_y/kGAL^2$ |
| `getMaterial()`, `getCS()` | `Material`, `CrossSection` | |

V místě osamělé síly vracejí metody `…At` hodnotu těsně za ní. `Element` je abstraktní základní třída `Beam2D`; tento typ používají `domain.elements` a `getElement`.

## Materiály a průřezy {#materials-and-sections}

| `MaterialParameters` | Jednotka | Výchozí | K čemu slouží |
| --- | --- | --- | --- |
| `e` | Pa | 1 | tuhost |
| `g` | Pa | 1 | smyková tuhost |
| `alpha` | 1/K | 1 | změna teploty |
| `d` | kg/m³ | 1 | ve statice se nepoužívá |

| `CrossSectionParameters` | Jednotka | Výchozí | K čemu slouží |
| --- | --- | --- | --- |
| `a` | m² | není, povinný | osová a smyková tuhost |
| `iy` | m⁴ | není, povinný | ohybová tuhost |
| `k` | – | není, povinný | smyková tuhost $kGA$; `1e32` smykovou deformaci vypne |
| `h` | m | není | nerovnoměrné oteplení (bez něj `NaN`) |
| `iz`, `dyz`, `j` | m⁴ | není | `Beam2D` je nepoužívá |

Chybějící parametr materiálu má hodnotu 1, ne nějakou typickou hodnotu; chybějící `a`, `iy` nebo `k` způsobí, že všechny výsledky jsou `NaN`. Ani v jednom případě nevznikne chyba. Obě třídy mají metodu `change(params)`, která nastaví zadané parametry, a uchovávají je ve vlastnostech se stejnými názvy.

## Zatížení {#loads}

### `LoadCase` {#loadcase}

| Metoda | Vrací | Hodnoty |
| --- | --- | --- |
| `createNodalLoad(node, values, lcs?)` | `NodalLoad` | `{ [DofID.Dx]: N, [DofID.Dz]: N, [DofID.Ry]: N·m }`; `lcs` (výchozí `false`) `true`: v pootočených osách uzlu |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | `BeamElementUniformEdgeLoad` | N/m po celém prvku |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | `BeamElementTrapezoidalEdgeLoad` | N/m v prvním a druhém uzlu, mezi nimi lineárně |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | `BeamConcentratedLoad` | N, N, N·m, ve vzdálenosti `a` m od prvního uzlu |
| `createBeamTemperatureLoad(el, [dTc, dTb, dTt])` | `BeamTemperatureLoad` | K: těžiště, dolní vlákna, horní vlákna |
| `createPrescribedDisplacement(node, values)` | `PrescribedDisplacement` | `{ [DofID.Dz]: m, … }` v podepřených stupních volnosti, v osách uzlu; ve volných stupních volnosti se ignoruje |

U prvkových zatížení znamená `lcs` `true` lokální osy (x ve směru prvku, z kolmo na něj) a `false` globální osy. Spojitá zatížení se vztahují na metr délky prvku. Příklady najdete na stránce [Uzlová a prvková zatížení](/cs/solver/loads).

| Člen | Typ | Popis |
| --- | --- | --- |
| `label` | `string` | |
| `nodalLoadList` | `NodalLoad[]` | |
| `elementLoadList` | `BeamElementLoad[]` | Prvková a teplotní zatížení |
| `prescribedBC` | `PrescribedDisplacement[]` | |
| `solved` | `boolean` | `true` po úspěšném výpočtu |
| `getElementLoadsOnElement(el)` | `BeamElementLoad[]` | Zatížení na jednom prvku |

Objekty zatížení uchovávají své hodnoty ve veřejných vlastnostech, které můžete před dalším výpočtem změnit: `values` (a `lcs`) u `NodalLoad`, `BeamElementUniformEdgeLoad`, `BeamConcentratedLoad` a `BeamTemperatureLoad`; `startValues` a `endValues` u `BeamElementTrapezoidalEdgeLoad`; `prescribedValues` u `PrescribedDisplacement`. Každý má `target`, označení objektu, na který působí.

## DofID {#dofid}

| Název | Hodnota | Používá `Beam2D` |
| --- | --- | --- |
| `Dx` | 0 | ano |
| `Dy` | 1 | ne |
| `Dz` | 2 | ano |
| `Rx` | 3 | ne |
| `Ry` | 4 | ano |
| `Rz` | 5 | ne |

## Výsledky {#results}

Výsledky se čtou z `Beam2D` (vnitřní síly, průhyby, koncové síly) a z `Node` (posuny, reakce), vždy pro zvolený `LoadCase` a po `solve()`: viz obě tabulky výše a stránku [Čtení výsledků](/cs/solver/results), kde jsou příklady a znaménka. Ve zkratce:

| Co chcete získat | Volání |
| --- | --- |
| Reakce, N a N·m | `node.getReactions(lc)` |
| Posuny, m, a pootočení, rad | `node.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])` |
| N, V nebo M v bodě, N a N·m | `beam.computeNormalForceAt(lc, x)`, `computeShearForceAt`, `computeBendingMomentAt` |
| N, V nebo M podél prvku | `beam.computeNormalForce(lc, n)`, `computeShearForce`, `computeBendingMoment` |
| Deformovaný tvar, m | `beam.computeLocalDefl(lc, n)`, `computeGlobalDefl` |
| Koncové síly, N a N·m | `beam.computeEndForces(lc)` |
| Obrázek toho všeho | `StructurePlot` nebo `structureSvg` z [@edubeam/plot](/cs/solver/drawing) |
