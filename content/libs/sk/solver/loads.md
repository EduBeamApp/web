---
title: Uzlové a prvkové zaťaženie
description: "Zadajte v @edubeam/fem uzlové sily a momenty, rovnomerné, lineárne sa meniace a osamelé zaťaženie prvkov v globálnych či lokálnych osiach, a potom ich meňte alebo odoberajte."
order: 6
group: Zaťaženie
source: site
---

# Uzlové a prvkové zaťaženie {#nodal-and-member-loads}

Zaťaženie patrí do zaťažovacieho stavu. Riešič začína s jedným, `solver.loadCases[0]`, a každá jeho metóda `create…` pridá zaťaženie a vráti ho. Viac zaťažovacích stavov a ich kombinácie opisuje stránka [Zaťažovacie stavy](/sk/solver/load-cases).

Hodnoty sú v N, N/m a N·m a riadia sa [osami](/sk/solver/conventions#axes): +z smeruje nadol a kladný moment pôsobí proti smeru hodinových ručičiek.

## Nosník so všetkými druhmi zaťaženia {#a-beam-with-every-kind}

Nosník s rozpätím 8 m na pevnom a posuvnom kĺbe, so spojitým zaťažením rastúcim zo 4 na 10 kN/m, osamelou silou 20 kN, osamelým momentom 10 kNm a vodorovnou silou v posuvnom kĺbe:

```ts [loads.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // pevný kĺb
domain.createNode('B', [8, 0, 0], [DofID.Dz]) // posuvný kĺb
domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
// 4 kN/m v A rastúce na 10 kN/m v B, nadol
lc.createBeamElementTrapezoidalEdgeLoad(1, [0, 4e3], [0, 10e3], false)
// [fx, fz, my, a]: 20 kN nadol, 2 m od A
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], false)
// moment 10 kNm proti smeru hodinových ručičiek, 6 m od A
lc.createBeamConcentratedLoad(1, [0, 0, 10e3, 6], false)
// 5 kN doprava v B
lc.createNodalLoad('B', { [DofID.Dx]: 5e3 })
solver.solve()

// getReactions vracia maticu mathjs alebo pole: prevedieme ju na pole
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

console.log(list(domain.getNode('A').getReactions(lc).values))
console.log(list(domain.getNode('B').getReactions(lc).values))
```

```text [Výstup]
[ -5000, -40250 ]
[ -35750 ]
```

Ručne: výslednica spojitého zaťaženia je 56 kN a pôsobí 4,571 m od A, takže z momentovej podmienky k bodu A vychádza $8R_B = 56 \cdot 4{,}571 + 20 \cdot 2 - 10 = 286$, $R_B = 35{,}75$ kN nahor a $R_A = 76 - 35{,}75 = 40{,}25$ kN nahor. Pevný kĺb navyše zachytí vodorovnú silu 5 kN, takže celý nosník je ťahaný silou 5 kN.

::model-figure{caption="To isté zaťaženie. Obrázok umiestňuje moment do uzla C vo vzdialenosti 6 m, čo dáva rovnaké výsledky."}
---
nodes: { A: [0, 0], C: [6, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: [4, 8.5] }
  - { member: 2, qz: [8.5, 10] }
  - { member: 1, pz: 20, at: 2 }
  - { node: C, my: 10 }
  - { node: B, fx: 5 }
results: [M]
show: [nodeLabels]
labels: horizontal
---
::

## Uzlové zaťaženie {#nodal-loads}

```ts
lc.createNodalLoad(node, { [DofID.Dx]: fx, [DofID.Dz]: fz, [DofID.Ry]: my }, lcs)
```

Zadajte len zložky, ktoré potrebujete. Hodnoty sú v globálnych osiach, alebo, ak nastavíte `lcs` na `true`, vo vlastných osiach uzla pootočeného pomocou [`updateLcs`](/sk/solver/nodes-supports#inclined-supports). Sila v stupni voľnosti, ktorý drží podpera, prejde rovno do reakcie a nič neohne.

## Prvkové zaťaženie {#member-loads}

| Metóda | Hodnoty | Zaťaženie |
| --- | --- | --- |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | N/m | rovnomerné po celom prvku |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | N/m | lineárne sa meniace, od prvého uzla k druhému |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | N, N·m, m | sila a moment vo vzdialenosti `a` metrov od prvého uzla |

Spojité zaťaženie vždy pokrýva celý prvok. Ak má zaťaženie pôsobiť len na časti poľa, rozdeľte prvok uzlom v mieste, kde zaťaženie začína: uzol navyše žiadny výsledok nezmení. Osamelá sila alebo moment môžu pôsobiť kdekoľvek na prvku.

### Globálne, alebo lokálne osi {#global-or-local-axes}

Posledný argument, `lcs`, určuje, v ktorých osiach sú zložky zadané:

- `false`: globálne x a z. `fz` pôsobí zvislo bez ohľadu na sklon prvku.
- `true`: lokálna os x prvku (pozdĺž neho) a z (kolmo naň). `fz` pôsobí kolmo na prvok.

Pri vodorovnom prvku zadanom zľava doprava vyjde oboje rovnako; pri prvku zadanom sprava doľava smeruje lokálne `fz` nahor.

::callout{type="info" title="Spojité zaťaženie je na meter dĺžky prvku"}
Oba druhy pôsobia na meter vlastnej dĺžky prvku. Na krokve dlhej 5 m s vodorovným priemetom 4 m dá `[0, 10e3]` v globálnych osiach spolu 50 kN. Zaťaženie snehom 10 kN/m vzťahované na vodorovný priemet zodpovedá $10 \cdot 4/5 = 8$ kN/m pozdĺž krokvy: zadajte `[0, 8e3]`.
::

## Zmena alebo odobratie zaťaženia {#change-or-remove-a-load}

Každá metóda `create…` vracia zaťaženie. Zmeňte jeho hodnoty a spustite výpočet znova:

```ts
const q = lc.createBeamElementUniformEdgeLoad(1, [0, 10e3], true)
solver.solve()
q.values = [0, 20e3] // dvojnásobné zaťaženie
solver.solve()
```

Zaťaženia sú uložené v obyčajných poliach `lc.nodalLoadList` a `lc.elementLoadList` (prvkové zaťaženie a zmeny teploty), takže jedno odoberiete pomocou `lc.elementLoadList.splice(index, 1)`. Názvy vlastností jednotlivých zaťažení nájdete v [referencii API](/sk/solver/reference#loads).

Zmeny teploty a poklesy podpier sú tiež zaťaženie: pozrite [Teplota a poklesy podpier](/sk/solver/temperature-settlements).
