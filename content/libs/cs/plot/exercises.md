---
title: Příklady a písemky
description: "Pro každého studenta jiný příklad ze statiky generovaný ze seedu s @edubeam/fem a @edubeam/plot, vždy se správným klíčem řešení: na webu, v tisku i jako SVG."
order: 5
group: Použití
---

# Příklady a písemky

Napište konstrukci jednou jako funkci seedu (počáteční hodnoty generátoru náhodných čísel) a máte příklad pro každého studenta na každý týden, ke každému s klíčem řešení, který je vždy správný: @edubeam/fem příklad spočte a @edubeam/plot nakreslí zadání i klíč z téhož modelu.

Klikněte níže na **Nový příklad**. Každé kliknutí znamená nový seed: příklad se vygeneruje, spočte a vykreslí přímo ve vašem prohlížeči.

::exercise-generator
::

Ukázka kreslí úlohy ze dvou stránek tohoto webu, které jsou obě postavené z částí popsaných níže. Na stránce [Procvičování](/cs/practice) student zadá reakce a největší moment nebo sílu v prutu a hned se dozví, jestli je má správně. [Generátor písemek](/cs/exam) vytiskne pro každého studenta jinou variantu písemky s klíčem řešení a uloží obrázky jako soubory SVG a výsledky jako CSV. Než začnete psát vlastní, vyzkoušejte je.

## Jak to funguje {#how-it-works}

1. **Seed určí čísla.** Generátor náhodných čísel dá pro stejný seed vždy stejný příklad, takže podle seedu vytištěného na zadání najdete i jeho klíč řešení.
2. **Klíč řešení spočte řešič.** @edubeam/fem vyřeší každou konstrukci, takže reakce a momenty pocházejí z řešiče, ne ze vzorce, ve kterém se můžete splést.
3. **@edubeam/plot nakreslí obojí.** Zadání ukazuje konstrukci s popisy uzlů, s kótami a s neznámými reakcemi označenými jménem; klíč uvádí hodnoty reakcí a přidává průběh.

K vytištěné písemce vás odsud dovede několik krátkých souborů: [generátor](#the-generator), [komponenta](#the-exercise-in-a-page) pro webovou stránku a [skript](#print-a-test), který vytiskne písemku nebo [zapíše obrázky](#figures-for-latex-and-word) pro LaTeX a Word. Zkopírujte je do projektu, kde máte [nainstalované knihovny](/cs/plot/getting-started#install); v Node 22.18 a novějším spustíte skripty příkazem `node`, ve starších verzích přes `npx tsx`.

## Generátor {#the-generator}

Jediný modul, `exercise.ts`, převede seed na příklad: nosník na kloubové a posuvné podpoře, v polovině případů s převislým koncem, na jehož konci působí osamělá síla. Obě varianty jsou staticky určité, takže každý seed lze vyřešit ručně stejně dobře jako řešičem.

```ts [exercise.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { extremes, modelFromSolver, type PlotModel } from '@edubeam/plot'

export interface Exercise {
  readonly seed: number
  readonly statement: string
  /** Spočtená konstrukce jako prostá data: kreslí se z ní zadání i klíč */
  readonly model: PlotModel
  /** Reakce v podporách, kladné nahoru, N, a extrémní ohybové momenty, N·m */
  readonly key: { RA: number; RB: number; mMax: number; mMin: number }
}

/** mulberry32: malý generátor se seedem, takže seed navždy označuje tentýž příklad */
const random = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), seed | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export const makeExercise = (seed: number): Exercise => {
  const r = random(seed)
  const pick = <T>(xs: readonly T[]): T => xs[Math.floor(r() * xs.length)]
  const int = (lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1))

  // Pole na kloubové a posuvné podpoře, v polovině případů s převislým koncem: staticky určité, takže vždy řešitelné
  const L = pick([4, 5, 6]) // m
  const c = pick([0, 0, 1, 1.5, 2]) // m, délka převislého konce
  const q = int(4, 12) // kN/m na poli
  const F = int(2, 6) * 5 // kN na konci, bez převislého konce ve vzdálenosti `a` od A
  const a = int(1, L - 1) // m

  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  if (c > 0) {
    domain.createNode('C', [L + c, 0, 0])
    domain.createBeam2D(2, ['B', 'C'], 1, 1)
    lc.createNodalLoad('C', { [DofID.Dz]: F * 1e3 })
  } else {
    lc.createBeamConcentratedLoad(1, [0, F * 1e3, 0, a], true)
  }
  solver.solve()

  const statement =
    c > 0
      ? `Span L = ${L} m with an overhang c = ${c} m. q = ${q} kN/m on the span, F = ${F} kN at the tip C.`
      : `Span L = ${L} m. q = ${q} kN/m over the span, F = ${F} kN at ${a} m from A.`

  // Klíč ze spočteného modelu: reakce (z míří dolů, takže nahoru je minus) a přesné extrémy M
  const model = modelFromSolver(solver)
  const { reactions, members } = model.results!
  const up = (node: string) => -(reactions.find((x) => x.node === node && x.dof === 'dz')?.value ?? 0)
  const m = Object.values(members).flatMap((member) => extremes(member.M) ?? [])
  const mMax = Math.max(...m.map((e) => e.max.value))
  const mMin = Math.min(...m.map((e) => e.min.value))

  return { seed, statement, model, key: { RA: up('A'), RB: up('B'), mMax, mMin } }
}
```

`modelFromSolver` převede spočtenou konstrukci na [model pro vykreslení](/cs/plot/model): prostá data s reakcemi a s výsledky všech prvků jako přesnými polynomy, takže `extremes` najde největší momenty bez vzorkování. Příklad si ponechá jen tento model; řešič už není potřeba.

Seed 5 dá zadání *„Span L = 6 m with an overhang c = 1.5 m. q = 5 kN/m on the span, F = 25 kN at the tip C.“* Jeho klíč: $R_A = (5 \cdot 6 \cdot 3 - 25 \cdot 1{,}5)/6 = 8{,}75$ kN, $R_B = 5 \cdot 6 + 25 - 8{,}75 = 46{,}25$ kN, nad podporou $M_B = -25 \cdot 1{,}5 = -37{,}5$ kNm a v poli, v místě nulové posouvající síly, $M = 8{,}75^2/(2 \cdot 5) = 7{,}66$ kNm. Řešič se shoduje do poslední číslice.

## Na webové stránce {#the-exercise-in-a-page}

Komponenta `ExerciseCard.vue` kreslí zadání, nebo s `answers` klíč řešení:

```vue [ExerciseCard.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { formatQuantity, KN_UNITS, StructurePlot, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise'

const props = defineProps<{ seed: number; answers?: boolean }>()
const exercise = computed(() => makeExercise(props.seed))

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']
const twoDecimals = new Intl.NumberFormat('en', { maximumFractionDigits: 2 })
const kN = (si: number) => formatQuantity(si, KN_UNITS.force, twoDecimals)
const kNm = (si: number) => formatQuantity(si, KN_UNITS.moment, twoDecimals)
</script>

<template>
  <article>
    <h3>Exercise {{ seed }}</h3>
    <p>{{ exercise.statement }} Find the reactions and draw the bending moment diagram.</p>
    <StructurePlot
      :model="exercise.model"
      :layers="answers ? key : sheet"
      :reserve="[...sheet, ...key]"
      :reaction-labels="answers ? 'values' : 'names'"
      :reserve-reaction-labels="['names', 'values']"
    />
    <p v-if="answers">
      R<sub>A</sub> = {{ kN(exercise.key.RA) }}, R<sub>B</sub> = {{ kN(exercise.key.RB) }},
      M from {{ kNm(exercise.key.mMin) }} to {{ kNm(exercise.key.mMax) }}
    </p>
  </article>
</template>
```

```vue
<ExerciseCard :seed="5" />
<ExerciseCard :seed="5" answers />
```

Druhá karta končí textem *R<sub>A</sub> = 8.75 kN, R<sub>B</sub> = 46.25 kN, M from −37.5 kNm to 7.66 kNm*. `formatQuantity` připíše jednotku a skutečné znaménko minus, stejně jako to dělá obrázek. Desetinnou tečku dává formát `'en'`; s `new Intl.NumberFormat('cs', …)` dostanete desetinnou čárku.

Na zadání kreslí `reaction-labels="names"` reakce jako neznámé: šipku pro každý směr, ve kterém podpora brání posunu, orientovanou ve směru, který se počítá jako kladný (doprava, nahoru, proti směru hodinových ručiček), a místo velikosti s názvem *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>*. Znaménko každého výsledku je tak dané výkresem: reakce, která působí opačně, je záporná. Klíč pak uvádí hodnoty.

`reserve` rozvrhne vrstvy obou pohledů hned od začátku, takže když `answers` zapnete, třeba tlačítkem *Ukázat řešení* pro samostudium, průběh se plynule objeví na svém místě ([Postupně přibývající obrázky](/cs/plot/structure-plot#figures-that-build-up)). `reserve-reaction-labels` totéž zajistí pro reakce, takže nosník zůstane na místě, zatímco se jejich názvy mění v hodnoty: viz [Reakce jako neznámé](/cs/plot/structure-plot#reactions-as-unknowns).

## Vytištěná písemka {#print-a-test}

Pro písemku na papíře zapíše skript v Node, `print-test.ts`, jednu stránku pro každého studenta a za ně klíče řešení. `structureSvg` převede každý model na text SVG, takže skript nepotřebuje Vue ani prohlížeč:

```ts [print-test.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const students = ['Ada', 'Ben', 'Cleo']
const exercises = students.map((_, i) => makeExercise(1000 + i)) // seedy 1000, 1001, …

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']
const task = 'Find the reactions and draw the bending moment diagram.'

const pages = [
  ...exercises.map((e, i) => `<h2>${students[i]}, exercise ${e.seed}</h2>
    <p>${e.statement} ${task}</p>${structureSvg(e.model, { layers: sheet, reactionLabels: 'names' })}`),
  ...exercises.map((e) => `<h2>Key, exercise ${e.seed}</h2>
    ${structureSvg(e.model, { layers: key })}`),
]

const style = `body { font: 15px/1.5 system-ui, sans-serif; max-width: 640px; margin: 2rem auto }
  section { break-after: page }`
writeFileSync('test.html', `<!doctype html><meta charset="utf-8"><title>Test</title>
  <style>${style}</style>${pages.map((page) => `<section>${page}</section>`).join('\n')}`)
```

```bash
node print-test.ts
```

Otevřete `test.html` v prohlížeči a vytiskněte ho, nebo ho uložte jako PDF: příklad každého studenta i každý klíč řešení dostane vlastní stránku. Stránka pro Adu a její klíč:

![Příklad 1000: pole 6 m s převislým koncem 2 m, 10 kN/m na poli a 30 kN na konci, neznámé reakce označené A_x, A_z a B_z a řetězové kóty 6 m a 2 m s celkovou délkou 8 m; pod ním klíč s reakcemi 20 a 70 a ohybovým momentem od −60 nad podporou po 20 v poli](/screenshots/cs/p2p-plot-exercise-sheet.webp){.shot-lg}

Vrstva `dimensions` okótuje každé pole i celkovou délku, jak to bývá na zadání, a `reactionLabels: 'names'` pojmenuje neznámé, přičemž každá šipka míří tam, kam je její výsledek kladný. V klíči jsou reakce a hodnoty průběhů holá čísla v kN a kNm, stejně jako v aplikaci EduBeam: pokud to studentům musíte říct, uveďte to v nadpisu klíče. Pro černobílou kopírku předejte `colors` se všemi tóny nastavenými na černou: viz [Černobíle](/cs/plot/theming#black-and-white).

## Obrázky pro LaTeX a Word {#figures-for-latex-and-word}

Píšete-li písemky v LaTeXu nebo ve Wordu, zapište obrázky raději jako soubory a zůstaňte u své šablony. `figures.ts` zapíše zadání a klíče pro 30 seedů:

```ts [figures.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']

for (let seed = 1000; seed < 1030; seed++) {
  const { model } = makeExercise(seed)
  writeFileSync(`exercise-${seed}.svg`, structureSvg(model, { layers: sheet, reactionLabels: 'names' }))
  writeFileSync(`exercise-${seed}-key.svg`, structureSvg(model, { layers: key }))
}
```

Spusťte ho příkazem `node figures.ts`: pro 30 studentů tak vznikne 60 souborů, každý jako čisté SVG s pevnými barvami, bez CSS a bez skriptů.

- **Word** (2019 a Microsoft 365) vloží SVG tak, jak je: *Vložení › Obrázky*.
- **LaTeX** místo SVG vkládá PDF. Převeďte soubory jednou pomocí [CairoSVG](https://cairosvg.org) (`cairosvg exercise-1000.svg -o exercise-1000.pdf`) nebo Inkscapu a pak použijte `\includegraphics[width=\linewidth]{exercise-1000.pdf}`. Pokud máte nainstalovaný Inkscape, převod za vás udělá `\includesvg` z balíčku `svg`.

Obrázek je široký 640 jednotek a text v něm má 13 jednotek, takže na šířce textového sloupce na A4, asi 16 cm, mají popisky 9 pt. Do `fontFamily` zadejte písmo, které používá váš dokument; všechny volby najdete v části [Samostatný soubor SVG](/cs/plot/functions#a-standalone-svg-file).

## Přizpůsobte si to {#make-it-your-own}

- **Další typy konstrukcí.** Přidejte další případy: konzolu, spojitý nosník o dvou polích, dvoukloubový rám, příhradovou konstrukci. Živá ukázka nahoře vybírá z osmi typů, od prostého nosníku po trojkloubový rám, Warrenův příhradový nosník a dvoukloubový rám.
- **Staticky neurčité příklady.** Řešič je zvládne stejně dobře; delší je jen ruční řešení.
- **Kulatá čísla.** Losujte zatížení a délky z krátkých seznamů, jako výše, a klíč bude vycházet tak kulatý, jak potřebujete. Projděte v cyklu pár set seedů a vynechte ty, jejichž klíč má víc desetinných míst, než chcete.
- **Pozor na mechanismy.** Generátor, který může podpory umístit nevhodně, by měl počítat uvnitř bloku `try` a seedy, které vyhodí výjimku, přeskočit: viz [Když výpočet selže](/cs/solver/solving#when-solving-fails).
- **Ptejte se na víc.** Nechte kreslit posouvající sílu (`'V'`), průhyb (`'w'`, s hodnotami z [`getUnknowns`](/cs/solver/results#displacements)) nebo normálovou sílu v šikmém prutu.
