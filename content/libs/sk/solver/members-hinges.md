---
title: Prvky a kĺby
description: "Spojte uzly prvkami Beam2D, uvoľnite momenty koncovými kĺbmi, modelujte priehradové prúty a získajte z @edubeam/fem maticu tuhosti a transformačnú maticu prvku."
order: 5
source: site
---

# Prvky a kĺby {#members-and-hinges}

Každý prvok je `Beam2D`: priamy dvojuzlový Timošenkov nosník v rovine x–z, ktorý prenáša normálovú silu, priečnu silu a ohybový moment. Kĺby na koncoch prvku v danom mieste uvoľňujú moment. Úryvky kódu používajú `solver`, `domain` a `lc` z programu, ako je ten na stránke [Začíname](/sk/solver/getting-started), s jeho materiálom `'steel'` a prierezom `'IPE200'`.

## Vytvorenie prvku {#create-a-member}

```ts
domain.createBeam2D(label, [startNode, endNode], material, crossSection, hinges)
```

| Argument | Typ | Význam |
| --- | --- | --- |
| `label` | `string \| number` | Označenie prvku, uložené ako reťazec |
| `nodes` | `[label, label]` | Prvý a druhý uzol. Lokálna os x vedie od prvého k druhému: pozrite [Orientácia prvku](/sk/solver/conventions#member-direction). |
| `mat`, `cs` | `string \| number` | Označenie materiálu a prierezu |
| `hinges` | `[boolean, boolean]` | Kĺb pri prvom a pri druhom uzle. Nepovinné; predvolené je `[false, false]`, teda tuhé konce. |

Metóda vracia `Beam2D`: uložte si ho, budete z neho čítať výsledky. `domain.getElement(label)` ho nájde znova, ale so všeobecným typom `Element`, takže TypeScript pred čítaním výsledkov vyžaduje `as Beam2D`.

Prvky, ktoré sa stretávajú v uzle bez kĺbov, sú spojené tuho: pootáčajú sa spoločne. Uzly, materiál a prierez možno vytvoriť v ľubovoľnom poradí, len musia pri výpočte všetky existovať; ak niektorý chýba, `solve()` vyhodí `RangeError` s jeho označením.

## Koncové kĺby {#end-hinges}

Kĺb patrí ku koncu prvku, nie k uzlu. Tu prvok 2 začína kĺbom v C, takže C prenáša z poľa C–D na konzolu A–C priečnu silu, ale žiadny moment:

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

cd.computeBendingMomentAt(lc, 0) // 0 v kĺbe
cd.computeBendingMomentAt(lc, 2) // 20000 N·m: qL²/8 poľa dĺžky 4 m
ac.computeBendingMomentAt(lc, 0) // -40000 N·m: 20 kN z poľa C–D na ramene 2 m
```

::model-figure{caption="Konzola nesúca kĺbovo pripojené pole: v C nie je žiadny moment"}
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

Ak sa v kĺbovom uzle stretáva viac prvkov, stačí kĺb na koncoch všetkých prvkov okrem jedného. Funguje aj kĺb na všetkých koncoch: uzol potom nič nepootočí a riešič vráti jeho pootočenie 0. Moment zadaný do takého uzla však nemá nič, čo by ho prenieslo, a [výpočet zlyhá](/sk/solver/solving#when-solving-fails).

## Priehradové prúty {#truss-bars}

Dajte prvku kĺby na oba konce a bude prenášať len normálovú silu, ak je zaťažený iba v uzloch: vznikne priehradový prút.

```ts
domain.createBeam2D('AE', ['A', 'E'], 'steel', 'bar', [true, true])
```

Celú priehradovú konštrukciu takto rieši postup [Priehradové konštrukcie](/sk/solver/trusses). Príklad priehradovej konštrukcie v aplikácii EduBeam namiesto toho používa tuhé uzly s takou veľkou plochou, že ohybové momenty sú popri osových silách zanedbateľné. Oba modely sú správne; líšia sa len v týchto malých momentoch. Maticu tuhosti samotného prúta odvodzuje stránka [Priehradový prút](/sk/elements/truss) v teoretickej príručke.

## Matice prvku {#the-element-s-matrices}

Na výučbu samotnej metódy sprístupňuje `Beam2D` svoje matice ako matice [mathjs](https://mathjs.org); `.toArray()` z nich urobí `number[][]`:

| Metóda | Vracia |
| --- | --- |
| `computeGeo()` | `{ l, dx, dz }`: dĺžku a priemety, m |
| `computeLocalStiffnessMtrx().answer` | maticu tuhosti 6 × 6 v lokálnych osiach, s kĺbmi odstránenými statickou kondenzáciou |
| `computeT()` | transformačnú maticu 6 × 6 z globálnych do lokálnych osí |
| `computeStiffness()` | maticu tuhosti 6 × 6 v globálnych osiach, $T^T K_l T$ |
| `computeShearFactor()` | $\Phi = 12EI_y/kGAL^2$ |

```ts
ac.computeStiffness().toArray() // number[][], N/m, N a N·m
```

Stupne voľnosti sú zoradené $u_1, w_1, \varphi_1, u_2, w_2, \varphi_2$. Stránka [Nosníkový prvok](/sk/elements/beam) v teoretickej príručke tieto matice odvodzuje a stránka [Ako EduBeam rieši model](/sk/elements/analysis) ukazuje, ako sa zostavujú.
