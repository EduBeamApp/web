---
title: Čtení výsledků
description: "Reakce, posuny uzlů, vnitřní síly kdekoli na prvku, deformovaný tvar a koncové síly z vyřešeného modelu @edubeam/fem, i s podobou dat, která jednotlivá volání vracejí."
order: 10
---

# Čtení výsledků {#reading-results}

Po `solve()` se výsledky čtou z uzlů a z prvků, vždy pro zvolený zatěžovací stav. Všechny příklady na této stránce čtou jeden model: prostý nosník o rozpětí 6 m, smykově tuhý IPE 200, se silou 20 kN ve vzdálenosti 2 m od A:

```ts [results.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 }) // smykově tuhý

const A = domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
const B = domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
const lc = solver.loadCases[0]
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], true)
solver.solve()
```

::model-figure{caption="20 kN ve vzdálenosti 2 m na rozpětí 6 m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M, w]
show: [nodeLabels]
---
::

## Co se kde čte {#what-to-read-where}

| Výsledek | Volání | Vrací |
| --- | --- | --- |
| Reakce | `node.getReactions(lc)` | `{ dofs, values }`: N, N·m |
| Posuny | `node.getUnknowns(lc, dofs)` | m, rad |
| N, V nebo M v bodě | `beam.computeBendingMomentAt(lc, x)` | číslo: N, N·m |
| N, V nebo M podél prvku | `beam.computeBendingMoment(lc, n)` | `{ x, M }`, n + 1 bodů |
| Deformovaný tvar | `beam.computeLocalDefl(lc, n)` | `{ u, w }`, n + 1 bodů, m |
| Koncové síly | `beam.computeEndForces(lc)` | matice mathjs se 6 hodnotami |

Pro N a V slouží metody `computeNormalForceAt` a `computeShearForceAt`, `computeNormalForce` a `computeShearForce`, které vracejí `{ x, N }` a `{ x, V }`. Znaménka popisuje stránka [Jednotky a znaménka](/cs/solver/conventions#signs-of-the-results).

## Reakce {#reactions}

`getReactions` vrací jednu reakci pro každý stupeň volnosti, který podpora drží: `dofs` je vyjmenuje v pořadí, v jakém byly zadány do `createNode`, a `values` obsahuje reakce ve stejném pořadí. Když je reakcí víc, je `values` **matice mathjs**, když je jen jedna, je to obyčejné pole. Malá pomocná funkce z obojího udělá pole:

```ts
/** Z matice mathjs, pole nebo čísla udělá obyčejné pole. */
const list = (v: unknown): number[] =>
  typeof v === 'number'
    ? [v]
    : Array.isArray(v)
      ? v
      : (v as { toArray(): number[] }).toArray()

A.getReactions(lc).dofs // [0, 2]: DofID.Dx, DofID.Dz
list(A.getReactions(lc).values) // [0, -13333.3]
list(B.getReactions(lc).values) // [-6666.7]
```

Chcete-li jednu reakci bez ohledu na pořadí, vyhledejte její stupeň volnosti: `list(values)[dofs.indexOf(DofID.Dz)]`, jak to dělá [postup pro spojitý nosník](/cs/solver/beams#a-continuous-beam).

Reakce je síla, kterou podpora působí na konstrukci: −13 333 N ve směru z znamená 13,3 kN směrem nahoru, $P\,b/L = 20 \cdot 4/6$. V uzlu s [pootočenými osami](/cs/solver/nodes-supports#inclined-supports) jsou reakce v těchto osách; `getReactions(lc, true)` je převede do globálních os a vrátí všechny tři stupně volnosti, s nulou tam, kde podpora nic nedrží. Uzel bez podpory vrací `{ dofs: [], values: [] }`.

## Posuny {#displacements}

`getUnknowns` přečte libovolné stupně volnosti uzlu, podepřeného i volného:

```ts
list(A.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])) // [0, 0, -0.0108924]
```

Uzel A se pootočí ve směru hodinových ručiček o 0,010892 rad, $P\,b\,(L^2 - b^2)/6EIL$. Když se ptáte na jeden stupeň volnosti, vrátí `getUnknowns` obyčejné číslo, přestože TypeScript deklaruje matici: i to `list` zvládne.

## Vnitřní síly podél prvku {#internal-forces-along-a-member}

Metody `…At` vracejí hodnotu ve vzdálenosti `x` metrů od prvního uzlu prvku:

```ts
beam.computeShearForceAt(lc, 1) // 13333.3 N
beam.computeShearForceAt(lc, 2) // -6666.7 N: v místě síly vrací hodnotu za ní
beam.computeBendingMomentAt(lc, 2) // 26666.7 N·m: R_A · 2
```

Tam, kde osamělá síla vytvoří skok, vrací metoda přesně v místě síly hodnotu za ní. Hodnotu před silou odečtete kousek před ní, třeba v `x - 1e-9`.

Metody vracející pole vzorkují prvek v n + 1 rovnoměrně rozmístěných bodech, včetně konců:

```ts
beam.computeBendingMoment(lc, 3)
// { x: [0, 2, 4, 6], M: [0, 26666.7, 13333.3, 0] }, až na zaokrouhlení
```

Počítejte se zaokrouhlovacími chybami, jako je `-3.6e-12` tam, kde je přesná hodnota 0: čísla před výpisem formátujte pomocí `toFixed`. Největší hodnotu podél prvku najdete jako maximum z jemného vzorkování, třeba `computeBendingMoment(lc, 500)`, jako v [postupu pro spojitý nosník](/cs/solver/beams#a-continuous-beam). Pod spojitým zatížením je M polynom, takže přesný extrém leží tam, kde V prochází nulou; [@edubeam/plot](/cs/plot/model#reading-values-yourself) ho najde přesně.

## Deformovaný tvar {#deflected-shape}

```ts
beam.computeLocalDefl(lc, 3)
// { u: [0, 0, 0, 0], w: [0, 0.0174279, 0.0152494, 0] }
```

`computeLocalDefl` vrací posuny ve směru prvku a kolmo na něj, `u` a `w`, v jeho lokálních osách; `computeGlobalDefl` tytéž body v globálních osách x a z. Průhyb pod silou, 17,43 mm, je $P\,a^2 b^2/3EIL$. Tvar mezi uzly je přesný, nikoli interpolovaný z hodnot na koncích. Jak ho vykreslit, popisuje stránka [Vykreslení výsledků](/cs/solver/drawing).

## Koncové síly {#end-forces}

```ts
beam.computeEndForces(lc).toArray()
// [0, -13333.3, 0, 0, -6666.7, 0]: X12, Z12, M12, X21, Z21, M21
```

Síly, kterými oba uzly působí na prvek, v jeho lokálních osách: tatáž čísla, jaká ukazuje tabulka *Výsledky na prvcích* v aplikaci, vysvětlená v oddílu [Koncové síly](/cs/elements/conventions#end-forces-element-results-table).

## Výsledky jako čísla ke kontrole {#results-as-numbers-to-check}

Každá hodnota výše odpovídá svému vzorci v uzavřeném tvaru. Stránka [Ověření výsledků ručně](/cs/guide/verification) prochází mnoho dalších učebnicových případů, které tentýž řešič spočítá přímo ve vašem prohlížeči.
