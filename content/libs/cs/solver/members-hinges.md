---
title: Prvky a klouby
description: "Spojte uzly prvky Beam2D, uvolněte momenty koncovými klouby, modelujte příhradové pruty a získejte z @edubeam/fem matici tuhosti a transformační matici prvku."
order: 5
---

# Prvky a klouby {#members-and-hinges}

Každý prvek je `Beam2D`: přímý dvouuzlový Timošenkův nosník v rovině x–z, který přenáší normálovou sílu, posouvající sílu a ohybový moment. Klouby na koncích prvku v daném místě uvolňují moment. Úryvky používají `solver`, `domain` a `lc` programu, jako je ten na stránce [Začínáme](/cs/solver/getting-started), s jeho materiálem `'steel'` a průřezem `'IPE200'`.

## Vytvoření prvku {#create-a-member}

```ts
domain.createBeam2D(label, [startNode, endNode], material, crossSection, hinges)
```

| Argument | Typ | Význam |
| --- | --- | --- |
| `label` | `string \| number` | Název prvku, uložený jako řetězec |
| `nodes` | `[label, label]` | První a druhý uzel. Lokální osa x vede od prvního k druhému: viz [Orientace prvku](/cs/solver/conventions#member-direction). |
| `mat`, `cs` | `string \| number` | Označení materiálu a průřezu |
| `hinges` | `[boolean, boolean]` | Kloub u prvního uzlu, u druhého. Nepovinné; výchozí je `[false, false]`, tedy tuhé konce. |

Metoda vrací `Beam2D`: uložte si ho, budete z něj číst výsledky. `domain.getElement(label)` ho najde znovu, ale s obecným typem `Element`, takže TypeScript před čtením výsledků vyžaduje `as Beam2D`.

Prvky, které se stýkají v uzlu bez kloubů, jsou spojené tuhě: pootáčejí se společně. Uzly, materiál a průřez lze vytvořit v libovolném pořadí, jen musí při výpočtu všechny existovat; pokud některý chybí, `solve()` vyhodí `RangeError` s jeho názvem.

## Koncové klouby {#end-hinges}

Kloub patří ke konci prvku, ne k uzlu. Tady prvek 2 začíná kloubem v C, takže C přenáší z pole C–D na konzolu A–C posouvající sílu, ale žádný moment:

```ts [hinge.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry])
domain.createNode('C', [2, 0, 0])
domain.createNode('D', [6, 0, 0], [DofID.Dz])
const ac = domain.createBeam2D(1, ['A', 'C'], 'steel', 'IPE200')
const cd = domain.createBeam2D(2, ['C', 'D'], 'steel', 'IPE200', [true, false])

lc.createBeamElementUniformEdgeLoad(2, [0, 10e3], true)
solver.solve()

cd.computeBendingMomentAt(lc, 0) // 0 v kloubu
cd.computeBendingMomentAt(lc, 2) // 20000 N·m: qL²/8 pole délky 4 m
ac.computeBendingMomentAt(lc, 0) // -40000 N·m: 20 kN z pole C–D na rameni 2 m
```

::model-figure{caption="Konzola nesoucí kloubově připojené pole: v C není žádný moment"}
---
nodes: { A: [0, 0], C: [2, 0], D: [6, 0] }
supports: { A: fixed, D: roller }
members: [[A, C], { nodes: [C, D], hinges: [true, false] }]
loads:
  - { member: 2, qz: 10 }
results: [M, V]
show: [nodeLabels]
---
::

Kde se v kloubovém styčníku stýká více prvků, stačí kloub na koncích všech prvků kromě jednoho. Funguje i kloub na všech koncích: styčník pak nic nepootáčí a řešič vrátí jeho pootočení 0. Moment zadaný do takového styčníku ale nemá nic, co by ho přeneslo, a [výpočet selže](/cs/solver/solving#when-solving-fails).

## Příhradové pruty {#truss-bars}

Dejte prvku klouby na oba konce a bude přenášet jen normálovou sílu, pokud je zatížený pouze v uzlech: vznikne příhradový prut.

```ts
domain.createBeam2D('AE', ['A', 'E'], 'steel', 'bar', [true, true])
```

Celou příhradovou konstrukci takto řeší [postup pro příhradovou konstrukci](/cs/solver/trusses). Příklad příhradové konstrukce v aplikaci EduBeam místo toho používá tuhé styčníky s tak velkou plochou, že ohybové momenty jsou vedle osových sil zanedbatelné. Oba modely jsou správné; liší se jen v těchto malých momentech. Matici tuhosti samotného prutu odvozuje stránka [Příhradový prut](/cs/elements/truss) teoretického manuálu.

## Matice prvku {#the-element-s-matrices}

Pro výuku samotné metody dává `Beam2D` své matice jako matice [mathjs](https://mathjs.org); `.toArray()` z nich udělá `number[][]`:

| Metoda | Vrací |
| --- | --- |
| `computeGeo()` | `{ l, dx, dz }`: délku a průměty, m |
| `computeLocalStiffnessMtrx().answer` | matici tuhosti 6 × 6 v lokálních osách, s kondenzovanými klouby |
| `computeT()` | transformační matici 6 × 6 z globálních do lokálních os |
| `computeStiffness()` | matici tuhosti 6 × 6 v globálních osách, $T^T K_l T$ |
| `computeShearFactor()` | $\Phi = 12EI_y/kGAL^2$ |

```ts
ac.computeStiffness().toArray() // number[][], N/m, N a N·m
```

Stupně volnosti jsou seřazené $u_1, w_1, \varphi_1, u_2, w_2, \varphi_2$. Stránka [Nosníkový prvek](/cs/elements/beam) teoretického manuálu tyto matice odvozuje a stránka [Jak EduBeam řeší model](/cs/elements/analysis) ukazuje, jak se sestavují.
