---
title: Uzly a podpery
description: "Vytvorte uzly modelu v @edubeam/fem, podoprite ich zabránením stupňov voľnosti, pootočte osi podpery pre šikmý posuvný kĺb a meňte uzly po výpočte."
order: 3
group: Modelovanie
source: site
---

# Uzly a podpery {#nodes-and-supports}

Uzly sú body, v ktorých sa spájajú prvky. Podpera nie je samostatný objekt: je to zoznam stupňov voľnosti, ktoré má uzol zabránené. Úryvky kódu na tejto stránke sú časťami programu, ako je ten na stránke [Začíname](/sk/solver/getting-started), a používajú jeho `solver`, `domain` a `lc`.

## Vytvorenie uzla {#create-a-node}

```ts
domain.createNode(label, [x, y, z], bcs)
```

| Argument | Typ | Význam |
| --- | --- | --- |
| `label` | `string \| number` | Označenie uzla, uložené ako reťazec: `1` a `'1'` je ten istý uzol |
| `coords` | `number[]` | `[x, y, z]` v metroch, s `y = 0`. Os z smeruje nadol. |
| `bcs` | `DofID[]` | Stupne voľnosti, ktoré podpera drží. Pri voľnom uzle argument vynechajte. |

Metóda vracia `Node`; `domain.getNode(label)` ho nájde znova. Ak je označenie už použité, nový uzol nahradí starý.

```ts
import { DofID } from '@edubeam/fem'

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [0, 0, -4]) // voľný: hlava stĺpa vysokého 4 m
```

## Podpery {#supports}

Každá podpera z aplikácie EduBeam zodpovedá určitej sade zabránených stupňov voľnosti:

| Podpera | `bcs` | Drží |
| --- | --- | --- |
| Votknutie | `[DofID.Dx, DofID.Dz, DofID.Ry]` | všetko |
| Pevný kĺb | `[DofID.Dx, DofID.Dz]` | obe posunutia, môže sa pootáčať |
| Posuvný kĺb | `[DofID.Dz]` | zvislé posunutie, posúva sa v smere x |
| Zvislý posuvný kĺb | `[DofID.Dx]` | vodorovné posunutie, posúva sa v smere z |
| Posuvné votknutie | `[DofID.Dz, DofID.Ry]` | zvislé posunutie a pootočenie, posúva sa v smere x |
| Zvislé posuvné votknutie | `[DofID.Dx, DofID.Ry]` | vodorovné posunutie a pootočenie, posúva sa v smere z |
| Zabránené pootočenie | `[DofID.Ry]` | pootočenie |

V rovnakom poradí, v akom ich uvediete, sa vracajú aj [reakcie](/sk/solver/results#reactions). Konštrukcia potrebuje aspoň tri zabránené stupne voľnosti, rozmiestnené tak, aby sa nemohla pohybovať ako mechanizmus: pozrite [Keď výpočet zlyhá](/sk/solver/solving#when-solving-fails).

Zabránený stupeň voľnosti možno aj posunúť o zadanú hodnotu a modelovať tak pokles podpery: pozrite [Predpísané posunutia](/sk/solver/temperature-settlements#prescribed-displacements).

## Šikmé podpery {#inclined-supports}

Posuvný kĺb na svahu drží uzol kolmo na svah, nie zvislo. Pootočte osi uzla pomocou `updateLcs` a jeho `bcs` sa potom vzťahujú na pootočené osi. V programe zo stránky Začíname vytvorte uzol B takto:

```ts
const b = domain.createNode('B', [6, 0, 0], [DofID.Dz]) // drží posunutie vo svojej vlastnej osi z
const a = (30 * Math.PI) / 180 // 30°, od x k z: na obrazovke v smere hodinových ručičiek
b.updateLcs({ locx: [Math.cos(a), 0, Math.sin(a)], locy: [0, 1, 0] })
```

`locx` je vlastná os x uzla, zapísaná ako vektor v globálnych osiach, a `locy` jeho os y, ktorá zostáva `[0, 1, 0]`. V aplikácii EduBeam je ten istý uhol *Pootočenie súradného systému* uzla, 30°.

Po `solve()` tlačí B kolmo na svah a vodorovnú zložku prevezme pevný kĺb v A:

```ts
b.getReactions(lc).values // [-41569]: N vo vlastnej osi z uzla B, 36 kN / cos 30°
b.getReactions(lc, true).values // [20785, -36000, 0]: v smere x, v smere z, moment
```

::model-figure{caption="Posuvný kĺb pootočený o 30°: reakcia pôsobí kolmo na svah a nosník je ťahaný"}
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

Zvislá zložka je stále $qL/2 = 36$ kN; vodorovná, $36 \tan 30° = 20{,}8$ kN, ťahá nosník z oboch koncov. Moment sa nezmení.

Pri pootočenom uzle sú posunutia a reakcie vo vlastných osiach uzla, ak pre globálne osi neodovzdáte `true`. Uzlové zaťaženie na ňom je naopak globálne, ak neurčíte inak: pozrite [Uzlové zaťaženie](/sk/solver/loads#nodal-loads). `node.updateLcs()` bez argumentu vráti osi späť.

## Zmena uzla {#change-a-node}

Uzol je obyčajný objekt: ak ho chcete posunúť, zmeňte `node.coords`, a ak chcete zmeniť jeho podperu, nahraďte `node.bcs`, čo je `Set<DofID>`.

```ts
domain.getNode('B').coords = [8, 0, 0] // dlhšie rozpätie: stačí solve()
domain.getNode('A').bcs = new Set(fixed) // nová podpera: najprv prečíslovať
solver.codeNumberGenerated = false
solver.solve()
```

Zmena podpier alebo pridanie a odobratie uzlov mení sústavu rovníc: bez `codeNumberGenerated = false` riešič **potichu ponechá staré podpery**. Ktoré zmeny to vyžadujú, uvádza [Nový výpočet po zmene](/sk/solver/solving#solving-again-after-a-change).
