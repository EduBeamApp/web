---
title: DiagramStack
description: "Nosník nad priebehmi V(x), M(x) a w(x) na spoločnej osi x s DiagramStack, odčítanie všetkých riadkov kurzorom a osamelá sila, ktorú čitateľ posúva po nosníku."
order: 3
source: site
---

# DiagramStack

`DiagramStack` kreslí obrázok, ktorý nájdete v každej učebnici statiky: priamy nosník s podperami, zaťažením a reakciami a pod ním na tej istej osi x priebeh priečnej sily V(x), ohybového momentu M(x) a priehybu w(x). Kurzor odčítava hodnoty vo všetkých riadkoch naraz a voliteľnú osamelú silu môže čitateľ posúvať po nosníku.

```vue
<DiagramStack :solver="solver" />
```

![DiagramStack: prostý nosník s rozpätím 6 m so silou 20 kN, ktorú môže čitateľ posúvať, tu 4,3 m od ľavej podpery; reakcie 5,7 kN a 14,3 kN, priečna sila pod silou skáče z 5,7 kN na −14,3 kN, ohybový moment tam dosahuje maximum 24,4 kNm a najväčší priehyb je 17 mm](/screenshots/sk/p2p-plot-diagram-stack.webp){.shot-lg}

Prvky musia tvoriť jednu vodorovnú priamku zadanú zľava doprava. Čokoľvek iné – šikmú alebo lomenú čiaru či prvok zadaný sprava doľava – komponent odmietne s chybou namiesto toho, aby to nakreslil zle, pretože os x obrázka je osou nosníka. Všetky props nájdete v [API komponentov](/sk/plot/components#diagramstack).

## Riadky {#rows}

| Prop | Predvolené | Nastavuje |
| --- | --- | --- |
| `rows` | `['V', 'M', 'w']` | priebehy zhora nadol; k dispozícii je aj `'N'` |
| `loadRow` | `true` | nosník s podperami, zaťažením a reakciami nad riadkami |
| `members` | všetky prvky | prvky nosníka, ak model obsahuje aj iné |
| `rowHeights` | N 100, V 116, M 128, w 76 px | výšky riadkov; pri šírke pod 560 px o niečo menšie |
| `maxHeight` | žiadna | riadky sa zmenšia, najviac na 60 %, aby sa obrázok zmestil; text si veľkosť zachová |
| `ranges` | vlastný rozsah každého riadku | pevné rozsahy hodnôt pre jednotlivé riadky, v jednotkách SI |

V a N sa kreslia kladné nahor, M a w kladné nadol, ako ich kreslí väčšina učebníc: kladný moment a priehyb nadol ležia pod osou. Každý riadok vypisuje svoje extrémne hodnoty.

## Kurzor na odčítanie {#the-reading-cursor}

`hover` je predvolene zapnutý. Pri pohybe ukazovateľa nad obrázkom sa cez všetky riadky zobrazí zvislý kurzor s hodnotou každého riadku v štítku. Vo vzdialenosti do 8 px od skoku, pri osamelej sile alebo podpere, kurzor na skok preskočí a V ukáže obe strany, ako `5.7 → −14.3 kN` pod silou na obrázku vyššie. Komponent tieto hodnoty posiela aj ako dáta:

```vue
<DiagramStack :solver="solver" @readout="(r) => (reading = r)" />
```

Odčítanie má tvar `{ x, values }`: `x` v metroch pozdĺž nosníka a `{ left, right }` pre každý riadok v jednotkách SI; keď ukazovateľ z obrázka odíde, je `null`.

## Sila, ktorú čitateľ posúva {#a-load-the-reader-can-drag}

Cez `v-model:load-at` odovzdajte polohu osamelej sily a sila dostane úchyt: čitateľ ju ťahá ukazovateľom alebo na ňu prejde klávesnicou a posúva ju šípkami. Komponent iba oznámi novú polohu. Vypočítajte nosník znova so silou v novej polohe a odovzdajte nový riešič späť, ako to robí `MovingLoad.vue`:

```vue [MovingLoad.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { beamLine, DiagramStack, lineDiagram, modelFromSolver, rowRange, type StackRow } from '@edubeam/plot'

const L = 6 // m
const P = 20e3 // N

/** Vypočítaný nosník s osamelou silou vo vzdialenosti `at` metrov od A. */
const solveWithLoadAt = (at: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamConcentratedLoad(1, [0, P, 0, at], true)
  solver.solve()
  return solver
}

/** Rozsah každého riadku cez všetky polohy sily, aby priebehy rástli a klesali namiesto toho, aby sa preškálovali. */
const rows: StackRow[] = ['V', 'M', 'w']
const envelope = (() => {
  const ranges: Partial<Record<StackRow, [number, number]>> = {}
  for (let at = 0.25; at < L; at += 0.25) {
    const model = modelFromSolver(solveWithLoadAt(at))
    const line = beamLine(model)
    for (const row of rows) {
      const [lo, hi] = rowRange(lineDiagram(model, line, row))
      const [min, max] = ranges[row] ?? [0, 0]
      ranges[row] = [Math.min(min, lo), Math.max(max, hi)]
    }
  }
  return ranges
})()

const at = ref(2)
const solver = computed(() => solveWithLoadAt(at.value))
</script>

<template>
  <DiagramStack v-model:load-at="at" :solver="solver" :rows="rows" :ranges="envelope" load-label="P = 20 kN" />
  <p>The load is {{ at.toFixed(2) }} m from A.</p>
</template>
```

Keď je sila 4,3 m od A, obrázok ukazuje reakcie 5,7 kN a 14,3 kN, skok priečnej sily z 5,7 na −14,3 kN pod silou a v tom istom mieste $M = 5{,}67 \cdot 4{,}3 = 24{,}4$ kNm. Bez `ranges` by sa každý riadok pri posune sily preškáloval na vlastné extrémy a priebehy by sa zdanlivo vôbec nemenili.

| Prop | Predvolené | Nastavuje |
| --- | --- | --- |
| `loadAt` | žiadna | polohu sily, m od začiatku priamky; s `v-model:load-at` |
| `loadLabel` | `P = …` | text vedľa úchytu |
| `loadStep` | 0.05 | krok, na ktorý sa ťahanie zaokrúhľuje, m; o tento krok posúvajú silu šípky |

Úchyt je fokusovateľný prvok `role="slider"`, ktorý čítačkám obrazovky oznamuje svoj rozsah a polohu. Šípky ho posúvajú o `loadStep`, Page Up a Page Down o 1 m a Home a End na konce nosníka. Na dotykovej obrazovke ho možno ťahať prstom a nad obrázkom pritom ďalej funguje zvislé posúvanie.

Úchyt zastupuje osamelú silu, ktorú má vypočítaný model v mieste `loadAt`: táto sila sa vykreslí ako úchyt s popisom svojej veľkosti, ak nezadáte `loadLabel`. Silu preto do modelu vložte v tej istej polohe, ako to robí `solveWithLoadAt`.

## Veľkosť a vykreslenie na serveri {#size-and-server-rendering}

Obrázok zmeria svoj kontajner a rozloží sa na jeho šírku, najmenej však na 320 px. Kým nemôže merať, použije `width`, predvolene 720 px. Text má 12,5 px (`fontSize`) a s obrázkom sa nikdy nezmenšuje.
