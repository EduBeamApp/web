---
title: Referencia API
description: "Všetky triedy, metódy a argumenty @edubeam/fem 0.3, s jednotkami, predvolenými hodnotami a podobou toho, čo ktorá metóda vracia."
order: 16
group: Referencia
source: site
---

# Referencia API {#api-reference}

Prehľad toho, čo `@edubeam/fem` 0.3 exportuje, zoradený podľa toho, na čo to použijete. Všade sa používajú jednotky SI: m, N, N·m, N/m, Pa, K a rad. Označenia (`LabelType`) sú `string | number` a ukladajú sa ako reťazce. Metódy, ktoré tu nie sú uvedené, sú interné: v TypeScripte sú verejné len preto, že ich volajú vlastné triedy riešiča.

## Exporty {#exports}

| Export | Druh | Časť |
| --- | --- | --- |
| `LinearStaticSolver` | trieda | [Výpočty](#analyses) |
| `Solver` | abstraktná trieda | [Výpočty](#analyses) |
| `Domain` | trieda | [Domain](#domain) |
| `Node` | trieda | [Node](#node) |
| `Beam2D`, `Element` | triedy | [Prvky](#elements) |
| `Material`, `CrossSection` | triedy | [Materiály a prierezy](#materials-and-sections) |
| `LoadCase` | trieda | [Zaťaženie](#loads) |
| `NodalLoad`, `BeamConcentratedLoad`, `BeamElementUniformEdgeLoad`, `BeamElementTrapezoidalEdgeLoad`, `BeamTemperatureLoad`, `PrescribedDisplacement`, `Load`, `BeamElementLoad` | triedy | [Zaťaženie](#loads) |
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
| `loadCases` | `LoadCase[]` | Na začiatku obsahuje jeden stav, `'DefaultLC'`. Ďalšie pridáte pomocou `new LoadCase(label, solver.domain)`: [Zaťažovacie stavy](/sk/solver/load-cases). |
| `solve()` | `void` | V prípade potreby očísluje rovnice, zostaví a vyrieši všetky zaťažovacie stavy. Pri [mechanizme](/sk/solver/solving#when-solving-fails) môže vyhodiť chybu, ale nie vždy. Od verzie 0.3.1 nič nevypisuje; verzia 0.3.0 vypisovala čas výpočtu. |
| `codeNumberGenerated` | `boolean` | Po pridaní alebo odobratí uzlov či prvkov alebo po zmene podpier ho nastavte na `false`: [prečo](/sk/solver/solving#solving-again-after-a-change) |
| `neq`, `pneq` | `number` | Počet voľných a podopretých stupňov voľnosti, po výpočte |
| `k` | mathjs `Matrix` | Zostavená globálna matica tuhosti, po výpočte |
| `getNodeDofIDs(label)` | `number[]` | Stupne voľnosti uzla, po výpočte |

`EigenValueDynamicSolver` v zdrojovom kóde existuje, ale exportovaný nie je.

## Domain {#domain}

`solver.domain` uchováva model v štyroch objektoch `Map` s kľúčom, ktorým je označenie prevedené na reťazec: `nodes`, `elements`, `materials`, `crossSections`. Metódy na odobratie nemá: uzol alebo prvok odoberiete pomocou `domain.nodes.delete(label)` a `domain.elements.delete(label)` a potom [znova očíslujete](/sk/solver/solving#solving-again-after-a-change).

| Metóda | Vracia | Popis |
| --- | --- | --- |
| `createNode(label, coords?, bcs?)` | `Node` | `coords` `[x, y, z]` v m (predvolené `[0, 0, 0]`), `bcs` podopreté `DofID` (predvolene žiadne) |
| `createBeam2D(label, nodes, mat, cs, hinges?)` | `Beam2D` | `nodes` `[first, second]`, `hinges` `[atFirst, atSecond]` (predvolené `[false, false]`) |
| `createMaterial(label, params?)` | `Material` | Pozrite [Materiály a prierezy](#materials-and-sections) |
| `createCrossSection(label, params?)` | `CrossSection` | Pozrite [Materiály a prierezy](#materials-and-sections) |
| `getNode(label)`, `getElement(label)`, `getMaterial(label)`, `getCS(label)` | objekt | Pre neznáme označenie vyhodí `RangeError`. `getElement` má typ `Element`: ak chcete čítať výsledky, napíšte `as Beam2D`. |

Vytvorenie objektu s označením, ktoré je už použité, nahradí pôvodný objekt.

## Node {#node}

| Člen | Typ | Popis |
| --- | --- | --- |
| `label` | `string` | |
| `coords` | `number[]` | `[x, y, z]`, m. Jeho zmenou uzol posuniete. |
| `bcs` | `Set<DofID>` | Podopreté stupne voľnosti. Jeho nahradením zmeníte podperu. |
| `lcs` | `number[][] \| undefined` | Pootočené osi uzla, ak nejaké má |
| `updateLcs({ locx, locy }?)` | `void` | Pootočí osi uzla: `locx` je jeho os x v globálnych zložkách, `locy` `[0, 1, 0]`. Bez argumentu vráti osi do východiskovej polohy. |
| `hasLcs()` | `boolean` | Či sú osi pootočené |
| `getUnknowns(lc, dofs)` | `Matrix` alebo `number` pre jeden stupeň voľnosti | Posunutia (m) a pootočenia (rad) v osiach uzla |
| `getReactions(lc, global?)` | `{ dofs, values }` | Reakcie v podopretých stupňoch voľnosti v poradí `bcs`: N, N·m. `values` je pre viac reakcií matica mathjs `Matrix`, pre jednu jednoprvkové pole, pre voľný uzol `[]`. S `global` `true` pri pootočenom uzle: všetky tri stupne voľnosti v globálnych osiach, `dofs` `[0, 2, 4]`, `values` pole s nulou tam, kde podpera nič nedrží. [Ako ich čítať](/sk/solver/results#reactions). |

## Prvky {#elements}

### `Beam2D` {#beam2d}

Dvojuzlový Timošenkov nosníkový prvok v rovine x–z s tromi stupňami voľnosti v každom uzle (`Dx`, `Dz`, `Ry`). `x` je vzdialenosť v metroch od prvého uzla; `n` je počet úsekov, bodov je teda n + 1.

| Člen | Vracia | Popis |
| --- | --- | --- |
| `label`, `nodes`, `mat`, `cs` | `string`, `string[]`, `string`, `string` | |
| `hinges` | `[boolean, boolean]` | Uvoľnenie momentu v prvom a druhom uzle |
| `computeNormalForceAt(lc, x)` | `number` | N, ťah kladný |
| `computeShearForceAt(lc, x)` | `number` | V, kladná tam, kde M rastie v smere lokálnej osi x |
| `computeBendingMomentAt(lc, x)` | `number` | M, kladný pri ťahu na strane lokálnej +z |
| `computeNormalForce(lc, n)` | `{ x, N }` | N v n + 1 bodoch |
| `computeShearForce(lc, n)` | `{ x, V }` | V v n + 1 bodoch |
| `computeBendingMoment(lc, n)` | `{ x, M }` | M v n + 1 bodoch |
| `computeLocalDefl(lc, n)` | `{ u, w }` | Posunutia v smere prvku a kolmo naň, v lokálnych osiach, m |
| `computeGlobalDefl(lc, n)` | `{ u, w }` | To isté v globálnych osiach x a z |
| `computeEndForces(lc)` | `Matrix` | `[X12, Z12, M12, X21, Z21, M21]`, sily, ktorými uzly pôsobia na prvok, v lokálnych osiach |
| `computeEndDisplacement(lc)` | `Matrix` | Koncové posunutia v lokálnych osiach, vrátane pootočení v kĺboch |
| `computeGeo()` | `{ l, dx, dz }` | Dĺžka a priemety, m |
| `computeT()` | `Matrix` | Transformačná matica 6 × 6 z globálnych do lokálnych osí |
| `computeLocalStiffnessMtrx()` | `{ answer }` | `answer`: lokálna matica tuhosti 6 × 6 s kĺbmi odstránenými statickou kondenzáciou |
| `computeStiffness()` | `Matrix` | Globálna matica tuhosti 6 × 6 |
| `computeShearFactor()` | `number` | $\Phi = 12EI_y/kGAL^2$ |
| `getMaterial()`, `getCS()` | `Material`, `CrossSection` | |

V mieste osamelej sily vracajú metódy `…At` hodnotu tesne za ňou. `Element` je abstraktná základná trieda `Beam2D`; tento typ používajú `domain.elements` a `getElement`.

## Materiály a prierezy {#materials-and-sections}

| `MaterialParameters` | Jednotka | Predvolená | Na čo slúži |
| --- | --- | --- | --- |
| `e` | Pa | 1 | tuhosť |
| `g` | Pa | 1 | šmyková tuhosť |
| `alpha` | 1/K | 1 | zmena teploty |
| `d` | kg/m³ | 1 | v statike sa nepoužíva |

| `CrossSectionParameters` | Jednotka | Predvolená | Na čo slúži |
| --- | --- | --- | --- |
| `a` | m² | žiadna, povinný | osová a šmyková tuhosť |
| `iy` | m⁴ | žiadna, povinný | ohybová tuhosť |
| `k` | – | žiadna, povinný | šmyková tuhosť $kGA$; `1e32` šmykové deformácie vypne |
| `h` | m | žiadna | nerovnomerné oteplenie (bez neho `NaN`) |
| `iz`, `dyz`, `j` | m⁴ | žiadna | `Beam2D` ich nepoužíva |

Chýbajúci parameter materiálu má hodnotu 1, nie nejakú typickú hodnotu; chýbajúce `a`, `iy` alebo `k` spôsobí, že všetky výsledky sú `NaN`. Ani v jednom prípade nevznikne chyba. Obe triedy majú metódu `change(params)`, ktorá nastaví zadané parametre, a uchovávajú ich vo vlastnostiach s rovnakými názvami.

## Zaťaženie {#loads}

### `LoadCase` {#loadcase}

| Metóda | Vracia | Hodnoty |
| --- | --- | --- |
| `createNodalLoad(node, values, lcs?)` | `NodalLoad` | `{ [DofID.Dx]: N, [DofID.Dz]: N, [DofID.Ry]: N·m }`; `lcs` (predvolené `false`) `true`: v pootočených osiach uzla |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | `BeamElementUniformEdgeLoad` | N/m po celom prvku |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | `BeamElementTrapezoidalEdgeLoad` | N/m v prvom a druhom uzle, medzi nimi lineárne |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | `BeamConcentratedLoad` | N, N, N·m, vo vzdialenosti `a` m od prvého uzla |
| `createBeamTemperatureLoad(el, [dTc, dTb, dTt])` | `BeamTemperatureLoad` | K: ťažisko, dolné vlákna, horné vlákna |
| `createPrescribedDisplacement(node, values)` | `PrescribedDisplacement` | `{ [DofID.Dz]: m, … }` v podopretých stupňoch voľnosti, v osiach uzla; vo voľných stupňoch voľnosti sa ignoruje |

Pri prvkovom zaťažení znamená `lcs` `true` lokálne osi (x v smere prvku, z kolmo naň) a `false` globálne osi. Spojité zaťaženie sa vzťahuje na meter dĺžky prvku. Príklady nájdete na stránke [Uzlové a prvkové zaťaženie](/sk/solver/loads).

| Člen | Typ | Popis |
| --- | --- | --- |
| `label` | `string` | |
| `nodalLoadList` | `NodalLoad[]` | |
| `elementLoadList` | `BeamElementLoad[]` | Prvkové a teplotné zaťaženie |
| `prescribedBC` | `PrescribedDisplacement[]` | |
| `solved` | `boolean` | `true` po úspešnom výpočte |
| `getElementLoadsOnElement(el)` | `BeamElementLoad[]` | Zaťaženia na jednom prvku |

Objekty zaťaženia uchovávajú svoje hodnoty vo verejných vlastnostiach, ktoré môžete pred ďalším výpočtom zmeniť: `values` (a `lcs`) pri `NodalLoad`, `BeamElementUniformEdgeLoad`, `BeamConcentratedLoad` a `BeamTemperatureLoad`; `startValues` a `endValues` pri `BeamElementTrapezoidalEdgeLoad`; `prescribedValues` pri `PrescribedDisplacement`. Každý má `target`, označenie objektu, na ktorý pôsobí.

## DofID {#dofid}

| Názov | Hodnota | Používa `Beam2D` |
| --- | --- | --- |
| `Dx` | 0 | áno |
| `Dy` | 1 | nie |
| `Dz` | 2 | áno |
| `Rx` | 3 | nie |
| `Ry` | 4 | áno |
| `Rz` | 5 | nie |

## Výsledky {#results}

Výsledky sa čítajú z `Beam2D` (vnútorné sily, priehyby, koncové sily) a z `Node` (posunutia, reakcie), vždy pre zvolený `LoadCase` a po `solve()`: pozrite obe tabuľky vyššie a stránku [Čítanie výsledkov](/sk/solver/results), kde sú príklady a znamienka. V skratke:

| Čo chcete získať | Volanie |
| --- | --- |
| Reakcie, N a N·m | `node.getReactions(lc)` |
| Posunutia, m, a pootočenia, rad | `node.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])` |
| N, V alebo M v bode, N a N·m | `beam.computeNormalForceAt(lc, x)`, `computeShearForceAt`, `computeBendingMomentAt` |
| N, V alebo M pozdĺž prvku | `beam.computeNormalForce(lc, n)`, `computeShearForce`, `computeBendingMoment` |
| Deformovaný tvar, m | `beam.computeLocalDefl(lc, n)`, `computeGlobalDefl` |
| Koncové sily, N a N·m | `beam.computeEndForces(lc)` |
| Obrázok toho všetkého | `StructurePlot` alebo `structureSvg` z [@edubeam/plot](/sk/solver/drawing) |
