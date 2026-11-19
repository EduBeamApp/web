---
title: DiagramStack
description: "Nosník nad průběhy V(x), M(x) a w(x) na společné ose x s DiagramStack, odečet všech řádků kurzorem a osamělá síla, kterou čtenář posouvá po nosníku."
order: 3
---

# DiagramStack

`DiagramStack` kreslí obrázek, který najdete v každé učebnici statiky: přímý nosník s podporami, zatížením a reakcemi a pod ním na stejné ose x průběh posouvající síly V(x), ohybového momentu M(x) a průhybu w(x). Kurzor odečítá hodnoty ve všech řádcích najednou a volitelnou osamělou sílu může čtenář posouvat po nosníku.

```vue
<DiagramStack :solver="solver" />
```

![DiagramStack: prostý nosník o rozpětí 6 m se silou 20 kN, kterou může čtenář posouvat, zde 4,3 m od levé podpory; reakce 5,7 kN a 14,3 kN, posouvající síla skáče pod silou z 5,7 kN na −14,3 kN, ohybový moment tam dosahuje maxima 24,4 kNm a největší průhyb je 17 mm](/screenshots/cs/p2p-plot-diagram-stack.webp){.shot-lg}

Prvky musí tvořit jednu vodorovnou přímku zadanou zleva doprava. Cokoli jiného – šikmou nebo lomenou čáru či prvek zadaný zprava doleva – komponenta odmítne s chybou, místo aby to nakreslila špatně, protože osa x obrázku je osou nosníku. Všechny props najdete v [API komponent](/cs/plot/components#diagramstack).

## Řádky {#rows}

| Prop | Výchozí | Nastavuje |
| --- | --- | --- |
| `rows` | `['V', 'M', 'w']` | průběhy shora dolů; k dispozici je i `'N'` |
| `loadRow` | `true` | nosník s podporami, zatížením a reakcemi nad řádky |
| `members` | všechny prvky | prvky nosníku, pokud model obsahuje i jiné |
| `rowHeights` | N 100, V 116, M 128, w 76 px | výšky řádků; při šířce pod 560 px o něco menší |
| `maxHeight` | žádná | řádky se zmenší, nejvýše na 60 %, aby se obrázek vešel; text si velikost drží |
| `ranges` | vlastní rozsah každého řádku | pevné rozsahy hodnot pro jednotlivé řádky, v jednotkách SI |

V a N se kreslí kladné nahoru, M a w kladné dolů, jak je kreslí většina učebnic: kladný moment a průhyb dolů leží pod osou. Každý řádek vypisuje své extrémní hodnoty.

## Kurzor pro odečítání {#the-reading-cursor}

`hover` je ve výchozím stavu zapnutý. Při pohybu ukazatele nad obrázkem se přes všechny řádky zobrazí svislý kurzor s hodnotou každého řádku ve štítku. Ve vzdálenosti do 8 px od skoku, u osamělé síly nebo podpory, kurzor na skok přeskočí a V ukáže obě strany, jako `5.7 → −14.3 kN` pod silou na obrázku výše. Komponenta hodnoty také emituje:

```vue
<DiagramStack :solver="solver" @readout="(r) => (reading = r)" />
```

Odečet má tvar `{ x, values }`: `x` v metrech podél nosníku a `{ left, right }` pro každý řádek v jednotkách SI; když ukazatel z obrázku odjede, je `null`.

## Síla, kterou čtenář posouvá {#a-load-the-reader-can-drag}

Předejte `v-model:load-at` polohu osamělé síly a síla dostane úchyt: čtenář ji táhne ukazatelem, nebo na ni přejde klávesnicí a posouvá ji šipkami. Komponenta jen oznámí novou polohu. Spočtěte nosník znovu se silou v nové poloze a předejte nový řešič zpět, jak to dělá `MovingLoad.vue`:

```vue [MovingLoad.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { beamLine, DiagramStack, lineDiagram, modelFromSolver, rowRange, type StackRow } from '@edubeam/plot'

const L = 6 // m
const P = 20e3 // N

/** Spočtený nosník s osamělou silou ve vzdálenosti `at` metrů od A. */
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

/** Rozsah každého řádku přes všechny polohy síly, aby průběhy rostly a klesaly, místo aby se přeškálovaly. */
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

Se silou ve vzdálenosti 4,3 m ukazuje obrázek reakce 5,7 kN a 14,3 kN, skok posouvající síly z 5,7 na −14,3 kN pod silou a v tomtéž místě $M = 5{,}67 \cdot 4{,}3 = 24{,}4$ kNm. Bez `ranges` by se každý řádek při posunu síly přeškáloval na vlastní extrémy a průběhy by se zdánlivě vůbec neměnily.

| Prop | Výchozí | Nastavuje |
| --- | --- | --- |
| `loadAt` | žádná | polohu síly, m od začátku přímky; s `v-model:load-at` |
| `loadLabel` | `P = …` | text vedle úchytu |
| `loadStep` | 0.05 | krok, na který se tažení zaokrouhluje, m; o tento krok posouvají sílu šipky |

Úchyt je fokusovatelný prvek `role="slider"`, který čtečkám obrazovky sděluje svůj rozsah a polohu. Šipky ho posouvají o `loadStep`, Page Up a Page Down o 1 m a Home a End na konce nosníku. Na dotykovém displeji ho lze táhnout prstem a nad obrázkem přitom dál funguje svislé posouvání.

Úchyt zastupuje osamělou sílu, kterou má spočtený model v místě `loadAt`: tato síla se vykreslí jako úchyt s popiskem její velikosti, pokud nezadáte `loadLabel`. Sílu proto do modelu vložte ve stejné poloze, jak to dělá `solveWithLoadAt`.

## Velikost a vykreslení na serveru {#size-and-server-rendering}

Obrázek změří svůj kontejner a rozvrhne se na jeho šířku, nejméně však na 320 px. Dokud nemůže měřit, použije `width`, ve výchozím stavu 720 px. Text má 12,5 px (`fontSize`) a s obrázkem se nikdy nezmenšuje.
