---
title: Príklady a písomky
description: "Pre každého študenta iný príklad zo statiky generovaný zo seedu s @edubeam/fem a @edubeam/plot, vždy so správnym kľúčom riešení: na webe, v tlači aj ako SVG."
order: 5
group: Použitie
source: site
---

# Príklady a písomky

Zapíšte konštrukciu raz ako funkciu seedu (počiatočnej hodnoty generátora náhodných čísel) a máte príklad pre každého študenta na každý týždeň, každý s kľúčom riešení, ktorý je vždy správny: @edubeam/fem príklad vypočíta a @edubeam/plot nakreslí zadanie aj kľúč z toho istého modelu.

Kliknite nižšie na **Nový príklad**. Každé kliknutie znamená nový seed: príklad sa vygeneruje, vypočíta a vykreslí priamo vo vašom prehliadači.

::exercise-generator
::

Ukážka kreslí úlohy z dvoch stránok tohto webu; obe sú postavené z častí opísaných nižšie. Na stránke [Precvičovanie](/sk/practice) študent zadá reakcie a najväčší moment alebo silu v prúte a hneď sa dozvie, či ich má správne. [Generátor písomiek](/sk/exam) vytlačí pre každého študenta iný variant písomky s kľúčom riešení a uloží obrázky ako súbory SVG a výsledky ako CSV. Skôr ako začnete písať vlastný, vyskúšajte ich.

## Ako to funguje {#how-it-works}

1. **Seed určí čísla.** Generátor náhodných čísel dá pre ten istý seed vždy ten istý príklad, takže podľa seedu vytlačeného na zadaní nájdete aj jeho kľúč riešení.
2. **Kľúč riešení vypočíta riešič.** @edubeam/fem vyrieši každú konštrukciu, takže reakcie a momenty pochádzajú z riešiča, nie zo vzorca, v ktorom sa môžete pomýliť.
3. **@edubeam/plot nakreslí oboje.** Zadanie ukazuje konštrukciu s popismi uzlov, s kótami a s neznámymi reakciami označenými názvom; kľúč uvádza hodnoty reakcií a pridáva priebeh.

K vytlačenej písomke vás odtiaľto dovedie niekoľko krátkych súborov: [generátor](#the-generator), [komponent](#the-exercise-in-a-page) pre webovú stránku a [skript](#print-a-test), ktorý vytlačí písomku alebo [zapíše obrázky](#figures-for-latex-and-word) pre LaTeX a Word. Skopírujte ich do projektu, v ktorom máte [nainštalované knižnice](/sk/plot/getting-started#install); v Node 22.18 a novšom spustíte skripty príkazom `node`, v starších verziách cez `npx tsx`.

## Generátor {#the-generator}

Jediný modul, `exercise.ts`, prevedie seed na príklad: nosník na pevnej a posuvnej kĺbovej podpere, v polovici prípadov s previslým koncom, na ktorého konci pôsobí osamelá sila. Oba varianty sú staticky určité, takže každý seed sa dá vyriešiť ručne rovnako dobre ako riešičom.

```ts [exercise.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { extremes, modelFromSolver, type PlotModel } from '@edubeam/plot'

export interface Exercise {
  readonly seed: number
  readonly statement: string
  /** Vypočítaná konštrukcia ako jednoduché dáta: kreslí sa z nej zadanie aj kľúč */
  readonly model: PlotModel
  /** Reakcie v podperách, kladné nahor, N, a extrémne ohybové momenty, N·m */
  readonly key: { RA: number; RB: number; mMax: number; mMin: number }
}

/** mulberry32: malý generátor so seedom, takže seed navždy označuje ten istý príklad */
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

  // Pole na pevnej a posuvnej kĺbovej podpere, v polovici prípadov s previslým koncom: staticky určité, takže vždy riešiteľné
  const L = pick([4, 5, 6]) // m
  const c = pick([0, 0, 1, 1.5, 2]) // m, dĺžka previslého konca
  const q = int(4, 12) // kN/m na poli
  const F = int(2, 6) * 5 // kN na konci, bez previslého konca vo vzdialenosti `a` od A
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

  // Kľúč z vypočítaného modelu: reakcie (z smeruje nadol, takže nahor je mínus) a presné extrémy M
  const model = modelFromSolver(solver)
  const { reactions, members } = model.results!
  const up = (node: string) => -(reactions.find((x) => x.node === node && x.dof === 'dz')?.value ?? 0)
  const m = Object.values(members).flatMap((member) => extremes(member.M) ?? [])
  const mMax = Math.max(...m.map((e) => e.max.value))
  const mMin = Math.min(...m.map((e) => e.min.value))

  return { seed, statement, model, key: { RA: up('A'), RB: up('B'), mMax, mMin } }
}
```

`modelFromSolver` prevedie vypočítanú konštrukciu na [model na vykreslenie](/sk/plot/model): jednoduché dáta s reakciami a s výsledkami všetkých prvkov ako presnými polynómami, takže `extremes` nájde najväčšie momenty bez vzorkovania. Príklad si ponechá iba tento model; riešič už nie je potrebný.

Seed 5 dá zadanie *„Span L = 6 m with an overhang c = 1.5 m. q = 5 kN/m on the span, F = 25 kN at the tip C.“* Jeho kľúč: $R_A = (5 \cdot 6 \cdot 3 - 25 \cdot 1{,}5)/6 = 8{,}75$ kN, $R_B = 5 \cdot 6 + 25 - 8{,}75 = 46{,}25$ kN, nad podperou $M_B = -25 \cdot 1{,}5 = -37{,}5$ kNm a v poli, v mieste nulovej priečnej sily, $M = 8{,}75^2/(2 \cdot 5) = 7{,}66$ kNm. Výsledok riešiča sa zhoduje na poslednú číslicu.

## Na webovej stránke {#the-exercise-in-a-page}

Komponent `ExerciseCard.vue` kreslí zadanie a s `answers` kľúč riešení:

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

Druhá karta končí textom *R<sub>A</sub> = 8.75 kN, R<sub>B</sub> = 46.25 kN, M from −37.5 kNm to 7.66 kNm*. `formatQuantity` pripíše jednotku a skutočné znamienko mínus, rovnako ako to robí obrázok. Desatinnú bodku dáva formát `'en'`; s `new Intl.NumberFormat('sk', …)` dostanete desatinnú čiarku.

Na zadaní kreslí `reaction-labels="names"` reakcie ako neznáme: šípku pre každý smer, v ktorom podpera bráni posunutiu, orientovanú v smere, ktorý sa počíta ako kladný (doprava, nahor, proti smeru hodinových ručičiek), a namiesto veľkosti s názvom *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>*. Znamienko každého výsledku je tak dané výkresom: reakcia, ktorá pôsobí opačne, je záporná. Kľúč potom uvádza hodnoty.

`reserve` rozloží vrstvy oboch pohľadov hneď od začiatku, takže keď `answers` zapnete, napríklad tlačidlom *Ukázať riešenie* na samoštúdium, priebeh sa plynulo objaví na svojom mieste ([Postupne pribúdajúce obrázky](/sk/plot/structure-plot#figures-that-build-up)). `reserve-reaction-labels` to isté zabezpečí pre reakcie, takže nosník zostane na mieste, zatiaľ čo sa ich názvy menia na hodnoty: pozrite [Reakcie ako neznáme](/sk/plot/structure-plot#reactions-as-unknowns).

## Vytlačená písomka {#print-a-test}

Pre písomku na papieri zapíše skript v Node, `print-test.ts`, jednu stránku pre každého študenta a za nimi kľúče riešení. `structureSvg` prevedie každý model na text SVG, takže skript nepotrebuje Vue ani prehliadač:

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

Otvorte `test.html` v prehliadači a vytlačte ho alebo ho uložte ako PDF: príklad každého študenta aj každý kľúč riešení dostane vlastnú stránku. Stránka pre Adu a jej kľúč:

![Príklad 1000: pole 6 m s previslým koncom 2 m, 10 kN/m na poli a 30 kN na konci, neznáme reakcie označené A_x, A_z a B_z a reťazové kóty 6 m a 2 m s celkovou dĺžkou 8 m; pod ním kľúč s reakciami 20 a 70 a ohybovým momentom od −60 nad podperou po 20 v poli](/screenshots/sk/p2p-plot-exercise-sheet.webp){.shot-lg}

Vrstva `dimensions` okótuje každé pole aj celkovú dĺžku, ako to býva na zadaní, a `reactionLabels: 'names'` pomenuje neznáme, pričom každá šípka smeruje tam, kam je jej výsledok kladný. V kľúči sú reakcie a hodnoty priebehov holé čísla v kN a kNm, rovnako ako v aplikácii EduBeam: ak to študentom treba povedať, uveďte to v nadpise kľúča. Pre čiernobielu kopírku odovzdajte `colors` so všetkými tónmi nastavenými na čiernu: pozrite [Čiernobielo](/sk/plot/theming#black-and-white).

## Obrázky pre LaTeX a Word {#figures-for-latex-and-word}

Ak píšete písomky v LaTeXe alebo vo Worde, zapíšte obrázky radšej ako súbory a zostaňte pri svojej šablóne. `figures.ts` zapíše zadania a kľúče pre 30 seedov:

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

Spustite ho príkazom `node figures.ts`: pre 30 študentov tak vznikne 60 súborov, každý ako čisté SVG s pevnými farbami, bez CSS a bez skriptov.

- **Word** (2019 a Microsoft 365) vloží SVG tak, ako je: *Vložiť › Obrázky*.
- **LaTeX** namiesto SVG vkladá PDF. Preveďte súbory raz pomocou [CairoSVG](https://cairosvg.org) (`cairosvg exercise-1000.svg -o exercise-1000.pdf`) alebo Inkscapu a potom použite `\includegraphics[width=\linewidth]{exercise-1000.pdf}`. Ak máte nainštalovaný Inkscape, prevod za vás urobí `\includesvg` z balíka `svg`.

Obrázok je široký 640 jednotiek a text v ňom má 13 jednotiek, takže na šírke textového stĺpca na A4, približne 16 cm, majú popisy 9 pt. Do `fontFamily` zadajte písmo, ktoré používa váš dokument; všetky voľby nájdete v časti [Samostatný súbor SVG](/sk/plot/functions#a-standalone-svg-file).

## Prispôsobte si to {#make-it-your-own}

- **Ďalšie typy konštrukcií.** Pridajte ďalšie prípady: konzolu, spojitý nosník s dvoma poľami, dvojkĺbový rám, priehradovú konštrukciu. Živá ukážka hore vyberá z ôsmich typov, od prostého nosníka po trojkĺbový rám, Warrenov priehradový nosník a dvojkĺbový rám.
- **Staticky neurčité príklady.** Riešič ich zvládne rovnako dobre; dlhšie je iba ručné riešenie.
- **Okrúhle čísla.** Losujte zaťaženia a dĺžky z krátkych zoznamov, ako vyššie, a kľúč bude vychádzať taký okrúhly, ako potrebujete. Prejdite v cykle niekoľko sto seedov a vynechajte tie, ktorých kľúč má viac desatinných miest, než chcete.
- **Pozor na mechanizmy.** Generátor, ktorý môže podpery umiestniť nevhodne, by mal počítať vnútri bloku `try` a seedy, ktoré vyhodia výnimku, preskočiť: pozrite [Keď výpočet zlyhá](/sk/solver/solving#when-solving-fails).
- **Pýtajte sa na viac.** Nechajte kresliť priečnu silu (`'V'`), priehyb (`'w'`, s hodnotami z [`getUnknowns`](/sk/solver/results#displacements)) alebo normálovú silu v šikmom prúte.
