---
title: Čítanie výsledkov
description: "Reakcie, posunutia uzlov, vnútorné sily kdekoľvek na prvku, deformovaný tvar a koncové sily z vyriešeného modelu @edubeam/fem a čo jednotlivé volania vracajú."
order: 10
source: site
---

# Čítanie výsledkov {#reading-results}

Po `solve()` sa výsledky čítajú z uzlov a z prvkov, vždy pre zvolený zaťažovací stav. Všetky príklady na tejto stránke čítajú jeden model: prostý nosník s rozpätím 6 m, šmykovo tuhý IPE 200, so silou 20 kN vo vzdialenosti 2 m od A:

```ts [results.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 }) // šmykovo tuhý

const A = domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
const B = domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
const lc = solver.loadCases[0]
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], true)
solver.solve()
```

::model-figure{caption="20 kN vo vzdialenosti 2 m na rozpätí 6 m"}
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

## Čo sa kde číta {#what-to-read-where}

| Výsledok | Volanie | Vracia |
| --- | --- | --- |
| Reakcie | `node.getReactions(lc)` | `{ dofs, values }`: N, N·m |
| Posunutia | `node.getUnknowns(lc, dofs)` | m, rad |
| N, V alebo M v bode | `beam.computeBendingMomentAt(lc, x)` | číslo: N, N·m |
| N, V alebo M pozdĺž prvku | `beam.computeBendingMoment(lc, n)` | `{ x, M }`, n + 1 bodov |
| Deformovaný tvar | `beam.computeLocalDefl(lc, n)` | `{ u, w }`, n + 1 bodov, m |
| Koncové sily | `beam.computeEndForces(lc)` | matica mathjs so 6 hodnotami |

Pre N a V slúžia metódy `computeNormalForceAt` a `computeShearForceAt`, `computeNormalForce` a `computeShearForce`, ktoré vracajú `{ x, N }` a `{ x, V }`. Znamienka opisuje stránka [Jednotky a znamienka](/sk/solver/conventions#signs-of-the-results).

## Reakcie {#reactions}

`getReactions` vracia jednu reakciu pre každý stupeň voľnosti, ktorý podpera drží: `dofs` ich vymenuje v poradí, v akom boli zadané do `createNode`, a `values` obsahuje reakcie v rovnakom poradí. Keď je reakcií viac, je `values` **matica mathjs**, keď je len jedna, je to obyčajné pole. Malá pomocná funkcia z oboch urobí pole:

```ts
/** Z matice mathjs, poľa alebo čísla urobí obyčajné pole. */
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

Ak chcete jednu reakciu bez ohľadu na poradie, vyhľadajte jej stupeň voľnosti: `list(values)[dofs.indexOf(DofID.Dz)]`, ako to robí postup [Spojitý nosník](/sk/solver/beams#a-continuous-beam).

Reakcia je sila, ktorou podpera pôsobí na konštrukciu: −13 333 N v smere z znamená 13,3 kN smerom nahor, $P\,b/L = 20 \cdot 4/6$. V uzle s [pootočenými osami](/sk/solver/nodes-supports#inclined-supports) sú reakcie v týchto osiach; `getReactions(lc, true)` ich prevedie do globálnych osí a vráti všetky tri stupne voľnosti, s nulou tam, kde podpera nič nedrží. Uzol bez podpery vracia `{ dofs: [], values: [] }`.

## Posunutia {#displacements}

`getUnknowns` prečíta ľubovoľné stupne voľnosti uzla, podopretého aj voľného:

```ts
list(A.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])) // [0, 0, -0.0108924]
```

Uzol A sa pootočí v smere hodinových ručičiek o 0,010892 rad, $P\,b\,(L^2 - b^2)/6EIL$. Keď sa pýtate na jeden stupeň voľnosti, vráti `getUnknowns` obyčajné číslo, hoci TypeScript deklaruje maticu: aj to `list` zvládne.

## Vnútorné sily pozdĺž prvku {#internal-forces-along-a-member}

Metódy `…At` vracajú hodnotu vo vzdialenosti `x` metrov od prvého uzla prvku:

```ts
beam.computeShearForceAt(lc, 1) // 13333.3 N
beam.computeShearForceAt(lc, 2) // -6666.7 N: v mieste sily vracia hodnotu za ňou
beam.computeBendingMomentAt(lc, 2) // 26666.7 N·m: R_A · 2
```

Tam, kde osamelá sila vytvorí skok, vracia metóda presne v mieste sily hodnotu za ňou. Hodnotu pred silou odčítate kúsok pred ňou, napríklad v `x - 1e-9`.

Metódy vracajúce pole vzorkujú prvok v n + 1 rovnomerne rozmiestnených bodoch, vrátane koncov:

```ts
beam.computeBendingMoment(lc, 3)
// { x: [0, 2, 4, 6], M: [0, 26666.7, 13333.3, 0] }, až na zaokrúhlenie
```

Počítajte so zaokrúhľovacími chybami, ako je `-3.6e-12` tam, kde je presná hodnota 0: čísla pred výpisom formátujte pomocou `toFixed`. Najväčšiu hodnotu pozdĺž prvku nájdete ako maximum z jemného vzorkovania, napríklad `computeBendingMoment(lc, 500)`, ako v postupe [Spojitý nosník](/sk/solver/beams#a-continuous-beam). Pri spojitom zaťažení je M polynóm, takže presný extrém leží tam, kde V prechádza nulou; [@edubeam/plot](/sk/plot/model#reading-values-yourself) ho nájde presne.

## Deformovaný tvar {#deflected-shape}

```ts
beam.computeLocalDefl(lc, 3)
// { u: [0, 0, 0, 0], w: [0, 0.0174279, 0.0152494, 0] }
```

`computeLocalDefl` vracia posunutia v smere prvku a kolmo naň, `u` a `w`, v jeho lokálnych osiach; `computeGlobalDefl` tie isté body v globálnych osiach x a z. Priehyb pod silou, 17,43 mm, je $P\,a^2 b^2/3EIL$. Tvar medzi uzlami je presný, nie interpolovaný z hodnôt na koncoch. Ako ho vykresliť, opisuje stránka [Vykreslenie výsledkov](/sk/solver/drawing).

## Koncové sily {#end-forces}

```ts
beam.computeEndForces(lc).toArray()
// [0, -13333.3, 0, 0, -6666.7, 0]: X12, Z12, M12, X21, Z21, M21
```

Sily, ktorými oba uzly pôsobia na prvok, v jeho lokálnych osiach: tie isté čísla, aké ukazuje tabuľka *Výsledky na prvkoch* v aplikácii, vysvetlená v časti [Koncové sily](/sk/elements/conventions#end-forces-element-results-table).

## Výsledky ako čísla na kontrolu {#results-as-numbers-to-check}

Každá hodnota vyššie zodpovedá svojmu vzorcu v uzavretom tvare. Stránka [Ručné overenie výsledkov](/sk/guide/verification) prechádza mnoho ďalších učebnicových prípadov, ktoré ten istý riešič vypočíta priamo vo vašom prehliadači.
