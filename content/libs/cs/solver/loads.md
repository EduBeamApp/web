---
title: Uzlová a prvková zatížení
description: "Zadejte v @edubeam/fem síly a momenty v uzlech a rovnoměrná, lineárně proměnná a osamělá zatížení na prvcích, v globálních nebo lokálních osách, a pak je měňte či odebírejte."
order: 6
group: Zatížení
---

# Uzlová a prvková zatížení {#nodal-and-member-loads}

Zatížení patří do zatěžovacího stavu. Řešič začíná s jedním, `solver.loadCases[0]`, a každá jeho metoda `create…` přidá zatížení a vrátí ho. Více zatěžovacích stavů a jejich kombinace popisuje stránka [Zatěžovací stavy](/cs/solver/load-cases).

Hodnoty jsou v N, N/m a N·m a řídí se [osami](/cs/solver/conventions#axes): +z míří dolů a kladný moment působí proti směru hodinových ručiček.

## Nosník se všemi druhy zatížení {#a-beam-with-every-kind}

Nosník o rozpětí 8 m na kloubu a posuvném kloubu, se spojitým zatížením rostoucím ze 4 na 10 kN/m, osamělou silou 20 kN, osamělým momentem 10 kNm a vodorovnou silou v posuvném kloubu:

```ts [loads.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // kloub
domain.createNode('B', [8, 0, 0], [DofID.Dz]) // posuvný kloub
domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
// 4 kN/m v A rostoucí na 10 kN/m v B, dolů
lc.createBeamElementTrapezoidalEdgeLoad(1, [0, 4e3], [0, 10e3], false)
// [fx, fz, my, a]: 20 kN dolů, 2 m od A
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], false)
// moment 10 kNm proti směru hodinových ručiček, 6 m od A
lc.createBeamConcentratedLoad(1, [0, 0, 10e3, 6], false)
// 5 kN doprava v B
lc.createNodalLoad('B', { [DofID.Dx]: 5e3 })
solver.solve()

// getReactions vrací matici mathjs nebo pole: převedeme ji na pole
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

console.log(list(domain.getNode('A').getReactions(lc).values))
console.log(list(domain.getNode('B').getReactions(lc).values))
```

```text [Výstup]
[ -5000, -40250 ]
[ -35750 ]
```

Ručně: výslednice spojitého zatížení je 56 kN a působí 4,571 m od A, takže z momentové podmínky k bodu A vychází $8R_B = 56 \cdot 4{,}571 + 20 \cdot 2 - 10 = 286$, $R_B = 35{,}75$ kN nahoru a $R_A = 76 - 35{,}75 = 40{,}25$ kN nahoru. Kloub navíc zachytí vodorovnou sílu 5 kN, takže je celý nosník tažený silou 5 kN.

::model-figure{caption="Stejná zatížení. Obrázek umisťuje moment do uzlu C ve vzdálenosti 6 m, což dává stejné výsledky."}
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

## Uzlová zatížení {#nodal-loads}

```ts
lc.createNodalLoad(node, { [DofID.Dx]: fx, [DofID.Dz]: fz, [DofID.Ry]: my }, lcs)
```

Zadejte jen složky, které potřebujete. Hodnoty jsou v globálních osách, nebo, když nastavíte `lcs` na `true`, ve vlastních osách uzlu pootočeného pomocí [`updateLcs`](/cs/solver/nodes-supports#inclined-supports). Síla ve stupni volnosti, který drží podpora, přejde rovnou do reakce a nic neohne.

## Prvková zatížení {#member-loads}

| Metoda | Hodnoty | Zatížení |
| --- | --- | --- |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | N/m | rovnoměrné po celém prvku |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | N/m | lineárně proměnné, od prvního uzlu ke druhému |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | N, N·m, m | síla a moment ve vzdálenosti `a` metrů od prvního uzlu |

Spojitá zatížení vždy pokrývají celý prvek. Pro zatížení na části pole rozdělte prvek uzlem v místě, kde zatížení začíná: uzel navíc žádný výsledek nezmění. Osamělá síla nebo moment mohou působit kdekoli na prvku.

### Globální, nebo lokální osy {#global-or-local-axes}

Poslední argument, `lcs`, určuje, ve kterých osách jsou složky zadané:

- `false`: globální x a z. `fz` působí svisle bez ohledu na sklon prvku.
- `true`: lokální osa x prvku (podél něj) a z (kolmo na něj). `fz` působí kolmo k prvku.

U vodorovného prvku zadaného zleva doprava vyjde obojí stejně; u prvku zadaného zprava doleva míří lokální `fz` nahoru.

::callout{type="info" title="Spojitá zatížení jsou na metr délky prvku"}
Oba druhy působí na metr vlastní délky prvku. Na krokvi dlouhé 5 m s vodorovným průmětem 4 m dá `[0, 10e3]` v globálních osách celkem 50 kN. Zatížení sněhem 10 kN/m vztažené na vodorovný průmět odpovídá $10 \cdot 4/5 = 8$ kN/m podél krokve: zadejte `[0, 8e3]`.
::

## Změna nebo odebrání zatížení {#change-or-remove-a-load}

Každá metoda `create…` vrací zatížení. Změňte jeho hodnoty a spusťte výpočet znovu:

```ts
const q = lc.createBeamElementUniformEdgeLoad(1, [0, 10e3], true)
solver.solve()
q.values = [0, 20e3] // dvojnásobné zatížení
solver.solve()
```

Zatížení jsou uložena v obyčejných polích `lc.nodalLoadList` a `lc.elementLoadList` (prvková zatížení a změny teploty), takže jedno odeberete pomocí `lc.elementLoadList.splice(index, 1)`. Názvy vlastností jednotlivých zatížení najdete v [referenci API](/cs/solver/reference#loads).

Změny teploty a poklesy podpor jsou také zatížení: viz [Teplota a poklesy podpor](/cs/solver/temperature-settlements).
