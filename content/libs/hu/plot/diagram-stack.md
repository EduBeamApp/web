---
title: DiagramStack
description: "Tartó a V(x), M(x) és w(x) ábrája fölött, közös tengelyen a DiagramStack komponenssel; a sorok leolvasása kurzorral, és koncentrált erő, amelyet az olvasó végighúzhat a tartón."
order: 3
source: site
---

# DiagramStack

A `DiagramStack` minden statikatankönyv jól ismert ábráját rajzolja meg: egy egyenes tartót a támaszaival, terheivel és támaszerőivel, alatta pedig ugyanazon az x tengelyen a V(x) nyíróerő-, az M(x) nyomatéki és a w(x) lehajlási ábrát. Egy kurzor egyszerre olvassa le az összes sort, és egy opcionális koncentrált erőt végig lehet húzni a tartón.

```vue
<DiagramStack :solver="solver" />
```

![DiagramStack: 6 m támaszközű kéttámaszú tartó 20 kN-os erővel, amelyet az olvasó húzhat, itt 4,3 m-re a bal oldali támasztól; a támaszerők 5,7 kN és 14,3 kN, a nyíróerő az erő alatt 5,7 kN-ról −14,3 kN-ra ugrik, a hajlítónyomaték ott éri el 24,4 kNm-es maximumát, a lehajlás legnagyobb értéke 17 mm](/screenshots/hu/p2p-plot-diagram-stack.webp){.shot-lg}

A rudaknak egyetlen vízszintes vonalat kell alkotniuk, balról jobbra megadva. Minden mást – ferde vagy tört vonalat, illetve jobbról balra megadott rudat – a komponens hibával elutasít ahelyett, hogy rosszul rajzolná meg, mert a rajz x tengelye a tartó tengelye. Az összes propot a [Komponens API](/hu/plot/components#diagramstack) oldal ismerteti.

## Sorok {#rows}

| Prop | Alapérték | Mit állít be |
| --- | --- | --- |
| `rows` | `['V', 'M', 'w']` | az ábrákat fentről lefelé; az `'N'` is elérhető |
| `loadRow` | `true` | a tartót a támaszokkal, terhekkel és támaszerőkkel a sorok fölött |
| `members` | minden rúd | a tartó vonalát alkotó rudakat, ha a modellben mások is vannak |
| `rowHeights` | N 100, V 116, M 128, w 76 px | a sorok magasságát; 560 px szélesség alatt valamivel kisebbek |
| `maxHeight` | nincs | a sorok legfeljebb 60%-ig zsugorodnak, hogy a rajz elférjen; a szöveg megtartja a méretét |
| `ranges` | minden sor saját tartománya | soronként rögzített értéktartományt, SI-egységekben |

A V és az N pozitív értékei felfelé, az M és a w pozitív értékei lefelé kerülnek, ahogy a legtöbb tankönyv rajzolja: a pozitív (alul húzott) nyomaték és a lefelé irányuló lehajlás a tengely alatt van. Minden sor kiírja a szélső értékeit.

## A leolvasó kurzor {#the-reading-cursor}

A `hover` alapértelmezés szerint be van kapcsolva. Ha a mutatót a rajz fölött mozgatod, az összes soron függőleges kurzor fut végig, és minden sor értéke egy címkében jelenik meg. Egy ugrástól – koncentrált erőtől vagy támasztól – 8 px-en belül a kurzor odaugrik, és a V mindkét oldali értéket mutatja, mint a fenti rajzon az erő alatti `5.7 → −14.3 kN`. Az értékeket esemény is kibocsátja:

```vue
<DiagramStack :solver="solver" @readout="(r) => (reading = r)" />
```

A leolvasás alakja `{ x, values }`: `x` méterben a tartó mentén, soronként pedig `{ left, right }` SI-egységekben; `null`, ha a mutató elhagyja a rajzot.

## Az olvasó által húzható erő {#a-load-the-reader-can-drag}

Kösd egy koncentrált erő helyét a `v-model:load-at` direktívához, és az erő fogantyút kap: az olvasó a mutatóval húzza, vagy fókuszba helyezi, és a nyílbillentyűkkel mozgatja. A komponens csak az új helyet jelenti. Számítsd ki újra a tartót az erővel az új helyen, és add vissza az új számítómagot, ahogy a `MovingLoad.vue` teszi:

```vue [MovingLoad.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { beamLine, DiagramStack, lineDiagram, modelFromSolver, rowRange, type StackRow } from '@edubeam/plot'

const L = 6 // m
const P = 20e3 // N

/** A kiszámított tartó, a koncentrált erő A-tól `at` méterre. */
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

/** Minden sor tartománya az erő összes helyzetére, hogy az ábrák nőjenek és csökkenjenek, ne átskálázódjanak. */
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

Ha az erő 4,3 m-nél van, a rajz az 5,7 kN-os és a 14,3 kN-os támaszerőt, az erő alatt a nyíróerő 5,7 kN-ról −14,3 kN-ra történő ugrását, ott pedig az $M = 5{,}67 \cdot 4{,}3 = 24{,}4$ kNm nyomatékot mutatja. `ranges` nélkül az erő mozgatásakor minden sor a saját szélső értékeihez skálázódna át, és az ábrák látszólag egyáltalán nem változnának.

| Prop | Alapérték | Mit állít be |
| --- | --- | --- |
| `loadAt` | nincs | az erő helyét, m a vonal kezdetétől; a `v-model:load-at` direktívával |
| `loadLabel` | `P = …` | a fogantyú melletti szöveget |
| `loadStep` | 0.05 | a lépésközt m-ben, amelyre a húzás kerekít; a nyílbillentyűk ennyivel mozgatják |

A fogantyú fókuszálható `role="slider"` elem, amely a képernyőolvasóknak megadja a tartományát és a helyzetét. A nyílbillentyűk `loadStep` lépésekben, a Page Up és a Page Down 1 m-rel mozgatja az erőt, a Home és az End pedig a tartó végeire viszi. Érintőképernyőn ujjal húzható, és a függőleges görgetés a rajz fölött továbbra is működik.

A fogantyú azt a koncentrált erőt helyettesíti, amely a kiszámított modellben a `loadAt` helyen van: ez az erő fogantyúként jelenik meg, a nagyságával feliratozva, hacsak nem adsz meg `loadLabel` értéket. Az erőt ugyanarra a helyre tedd a modellben, ahogy a `solveWithLoadAt` teszi.

## Méret és renderelés a szerveren {#size-and-server-rendering}

A rajz megméri a tárolóját, és annak szélességéhez igazítja az elrendezést, legalább 320 px-re. Amíg nem tudja megmérni, a `width` értékét használja, alapértelmezés szerint 720 px-et. A szöveg 12,5 px-es (`fontSize`), és a rajzzal együtt soha nem kicsinyül.
