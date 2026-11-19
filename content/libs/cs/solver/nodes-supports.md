---
title: Uzly a podpory
description: "Vytvořte uzly modelu v @edubeam/fem, podepřete je zamezením stupňů volnosti, pootočte osy podpory pro šikmý posuvný kloub a měňte uzly po výpočtu."
order: 3
group: Modelování
---

# Uzly a podpory {#nodes-and-supports}

Uzly jsou body, ve kterých se spojují prvky. Podpora není samostatný objekt: je to seznam stupňů volnosti, které má uzel zamezené. Úryvky kódu na této stránce jsou částmi programu, jako je ten na stránce [Začínáme](/cs/solver/getting-started), a používají jeho `solver`, `domain` a `lc`.

## Vytvoření uzlu {#create-a-node}

```ts
domain.createNode(label, [x, y, z], bcs)
```

| Argument | Typ | Význam |
| --- | --- | --- |
| `label` | `string \| number` | Název uzlu, uložený jako řetězec: `1` a `'1'` je tentýž uzel |
| `coords` | `number[]` | `[x, y, z]` v metrech, s `y = 0`. Osa z míří dolů. |
| `bcs` | `DofID[]` | Stupně volnosti, které podpora drží. U volného uzlu argument vynechte. |

Metoda vrací `Node`; `domain.getNode(label)` ho najde znovu. Pokud je označení už použité, nový uzel nahradí starý.

```ts
import { DofID } from '@edubeam/fem'

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [0, 0, -4]) // volný: hlava sloupu vysokého 4 m
```

## Podpory {#supports}

Každá podpora aplikace EduBeam odpovídá určité sadě zamezených stupňů volnosti:

| Podpora | `bcs` | Drží |
| --- | --- | --- |
| Vetknutí | `[DofID.Dx, DofID.Dz, DofID.Ry]` | všechno |
| Kloub | `[DofID.Dx, DofID.Dz]` | oba posuny, může se pootáčet |
| Posuvný kloub | `[DofID.Dz]` | svislý posun, posouvá se ve směru x |
| Svislý posuvný kloub | `[DofID.Dx]` | vodorovný posun, posouvá se ve směru z |
| Posuvné vetknutí | `[DofID.Dz, DofID.Ry]` | svislý posun a pootočení, posouvá se ve směru x |
| Svislé posuvné vetknutí | `[DofID.Dx, DofID.Ry]` | vodorovný posun a pootočení, posouvá se ve směru z |
| Zamezené pootočení | `[DofID.Ry]` | pootočení |

Ve stejném pořadí, v jakém je uvedete, se vracejí i [reakce](/cs/solver/results#reactions). Konstrukce potřebuje alespoň tři zamezené stupně volnosti, rozmístěné tak, aby se nemohla pohybovat jako mechanismus: viz [Když výpočet selže](/cs/solver/solving#when-solving-fails).

Zamezený stupeň volnosti lze také posunout o zadanou hodnotu a modelovat tak pokles podpory: viz [Předepsaná posunutí](/cs/solver/temperature-settlements#prescribed-displacements).

## Šikmé podpory {#inclined-supports}

Posuvný kloub na svahu drží uzel kolmo ke svahu, ne svisle. Pootočte osy uzlu pomocí `updateLcs` a jeho `bcs` se pak vztahují k pootočeným osám. V programu ze stránky Začínáme vytvořte B místo toho takto:

```ts
const b = domain.createNode('B', [6, 0, 0], [DofID.Dz]) // drží posun ve své vlastní ose z
const a = (30 * Math.PI) / 180 // 30°, od x k z: na obrazovce po směru hodinových ručiček
b.updateLcs({ locx: [Math.cos(a), 0, Math.sin(a)], locy: [0, 1, 0] })
```

`locx` je vlastní osa x uzlu, zapsaná jako vektor v globálních osách, a `locy` jeho osa y, která zůstává `[0, 1, 0]`. V aplikaci EduBeam je tentýž úhel *Pootočení systému souřadnic* uzlu, 30°.

Po `solve()` tlačí B kolmo ke svahu a vodorovnou složku převezme kloub v A:

```ts
b.getReactions(lc).values // [-41569]: N ve vlastní ose z uzlu B, 36 kN / cos 30°
b.getReactions(lc, true).values // [20785, -36000, 0]: ve směru x, ve směru z, moment
```

::model-figure{caption="Posuvný kloub pootočený o 30°: reakce působí kolmo ke svahu a nosník je tažený"}
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

Svislá složka je stále $qL/2 = 36$ kN; vodorovná, $36 \tan 30° = 20{,}8$ kN, táhne nosník z obou konců. Moment se nezmění.

U pootočeného uzlu jsou posuny a reakce ve vlastních osách uzlu, pokud pro globální osy nepředáte `true`. Uzlová zatížení na něm jsou naopak globální, pokud neurčíte jinak: viz [Uzlová zatížení](/cs/solver/loads#nodal-loads). `node.updateLcs()` bez argumentu vrátí osy zpět.

## Změna uzlu {#change-a-node}

Uzel je obyčejný objekt: chcete-li ho posunout, změňte `node.coords`, a chcete-li změnit jeho podporu, nahraďte `node.bcs`, což je `Set<DofID>`.

```ts
domain.getNode('B').coords = [8, 0, 0] // delší rozpětí: stačí solve()
domain.getNode('A').bcs = new Set(fixed) // nová podpora: nejdřív přečíslovat
solver.codeNumberGenerated = false
solver.solve()
```

Změna podpor nebo přidání a odebrání uzlů mění soustavu rovnic: bez `codeNumberGenerated = false` řešič **potichu ponechá staré podpory**. Které změny to vyžadují, uvádí [Nový výpočet po změně](/cs/solver/solving#solving-again-after-a-change).
