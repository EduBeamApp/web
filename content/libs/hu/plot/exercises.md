---
title: Feladatok és dolgozatok
description: "Minden hallgatónak más statikafeladat egy kezdőértékből (seed), mindig helyes megoldókulccsal: weboldalon, nyomtatott dolgozatban vagy SVG-ábrákként."
order: 5
group: Felhasználási területek
source: site
---

# Feladatok és dolgozatok

Írd meg egyszer a szerkezetet egy kezdőérték (seed) függvényeként, és máris van feladatod minden hallgatónak, minden hétre, mindegyikhez olyan megoldókulccsal, amely mindig helyes: az @edubeam/fem kiszámítja, az @edubeam/plot pedig ugyanabból a modellből rajzolja meg a feladatot és a megoldókulcsot.

Kattints lent az **Új feladat** gombra. Minden kattintás új seedet jelent: a feladat a böngésződben generálódik, számítódik ki és rajzolódik meg.

::exercise-generator
::

A bemutató ennek a webhelynek két oldaláról rajzolja a feladatokat, és mindkettő az itt leírt részekből épül fel. A [gyakorló feladatok](/hu/practice) oldalán a hallgató beírja a támaszerőket és a legnagyobb nyomatékot vagy rúderőt, és azonnal ellenőrizheti őket. A [dolgozatkészítő](/hu/exam) minden hallgatónak más változatot nyomtat a dolgozatból megoldókulccsal, az ábrákat SVG-fájlokba, a válaszokat CSV-be menti. Próbáld ki őket, mielőtt megírod a sajátodat.

## Hogyan működik {#how-it-works}

1. **A seed választja ki a számokat.** A seedelt véletlenszám-generátor ugyanahhoz a seedhez mindig ugyanazt a feladatot adja, így a lapra nyomtatott seedből a megoldókulcs bármikor újra előáll.
2. **A számítómag készíti a megoldókulcsot.** Minden szerkezetet az @edubeam/fem számít ki, így a támaszerők és a nyomatékok a számítómagtól származnak, nem egy képletből, amelyet könnyű elrontani.
3. **A rajz mindkettőt megrajzolja.** A feladatlap a szerkezetet mutatja csomópont-jelölésekkel, méretvonalakkal és az ismeretlen támaszerők neveivel; a megoldókulcs megadja a támaszerők értékét, és hozzáteszi az ábrát.

Innen néhány rövid fájl vezet el a kinyomtatott dolgozatig: [a generátor](#the-generator), [egy komponens](#the-exercise-in-a-page) weboldalhoz és [egy szkript](#print-a-test), amely dolgozatot nyomtat, vagy [ábrákat ír ki](#figures-for-latex-and-word) LaTeX-hez és Wordhöz. Másold őket egy olyan projektbe, amelyben [telepítve vannak a könyvtárak](/hu/plot/getting-started#install); a szkriptek a Node 22.18-as verziójától kezdve a `node` paranccsal futnak, régebbi verziókon az `npx tsx` paranccsal.

## A generátor {#the-generator}

Egyetlen modul, az `exercise.ts` alakít egy seedet feladattá: egy csuklós és egy görgős támaszon álló tartóvá, az esetek felében konzollal, amelynek a végén koncentrált erő hat. Mindkét változat statikailag határozott, így minden seed kézzel is ugyanúgy megoldható, mint a számítómaggal.

```ts [exercise.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { extremes, modelFromSolver, type PlotModel } from '@edubeam/plot'

export interface Exercise {
  readonly seed: number
  readonly statement: string
  /** A kiszámított szerkezet egyszerű adatként: ebből rajzolódik a feladat és a megoldókulcs is */
  readonly model: PlotModel
  /** A felfelé pozitív támaszerők, N, és a szélső hajlítónyomatékok, N·m */
  readonly key: { RA: number; RB: number; mMax: number; mMin: number }
}

/** mulberry32: apró seedelt generátor, így egy seed mindig ugyanazt a feladatot jelenti */
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

  // Egy támaszköz csuklós és görgős támaszon, az esetek felében konzollal: statikailag határozott, így mindig megoldható
  const L = pick([4, 5, 6]) // m
  const c = pick([0, 0, 1, 1.5, 2]) // m, a konzol hossza
  const q = int(4, 12) // kN/m a támaszközön
  const F = int(2, 6) * 5 // kN a konzol végén, konzol nélkül A-tól `a` távolságra
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

  // A megoldókulcs a kiszámított modellből: támaszerők (z lefelé mutat, így a felfelé irány negatív) és M pontos szélső értékei
  const model = modelFromSolver(solver)
  const { reactions, members } = model.results!
  const up = (node: string) => -(reactions.find((x) => x.node === node && x.dof === 'dz')?.value ?? 0)
  const m = Object.values(members).flatMap((member) => extremes(member.M) ?? [])
  const mMax = Math.max(...m.map((e) => e.max.value))
  const mMin = Math.min(...m.map((e) => e.min.value))

  return { seed, statement, model, key: { RA: up('A'), RB: up('B'), mMax, mMin } }
}
```

A `modelFromSolver` a kiszámított szerkezetet [a rajz modelljévé](/hu/plot/model) alakítja: egyszerű adatokká, amelyekben a támaszerők és minden rúd eredményei pontos polinomként szerepelnek, így az `extremes` mintavételezés nélkül találja meg a legnagyobb nyomatékokat. A feladat csak ezt a modellt tartja meg; a számítómagra már nincs szükség.

Az 5-ös seed ezt adja: *„Span L = 6 m with an overhang c = 1.5 m. q = 5 kN/m on the span, F = 25 kN at the tip C.”* A megoldókulcsa: $R_A = (5 \cdot 6 \cdot 3 - 25 \cdot 1{,}5)/6 = 8{,}75$ kN, $R_B = 5 \cdot 6 + 25 - 8{,}75 = 46{,}25$ kN, a támasz fölött $M_B = -25 \cdot 1{,}5 = -37{,}5$ kNm, a támaszközben pedig, ahol a nyíróerő nulla, $M = 8{,}75^2/(2 \cdot 5) = 7{,}66$ kNm. A számítómag az utolsó jegyig egyezik.

## Weboldalon {#the-exercise-in-a-page}

Az `ExerciseCard.vue` komponens a feladatot, az `answers` megadásával pedig a megoldókulcsot rajzolja meg:

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

A második kártya így végződik: *R<sub>A</sub> = 8.75 kN, R<sub>B</sub> = 46.25 kN, M from −37.5 kNm to 7.66 kNm*. A `formatQuantity` hozzáírja a mértékegységet és a valódi mínuszjelet, ahogy a rajz is.

A feladatlapon a `reaction-labels="names"` ismeretlenként rajzolja meg a támaszerőket: minden irányhoz, amelyet a támasz gátol, egy nyilat, amely a pozitív irányba mutat (jobbra, felfelé, az óramutató járásával ellentétesen), és érték helyett a nevét viseli: *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>*. Így minden válasz előjele a rajzon definiált: az ellenkező irányban ható támaszerő negatív. A megoldókulcs az értékeket írja ki.

A `reserve` kezdettől mindkét nézet rétegeinek helyet hagy, így ha bekapcsolod az `answers` propot, például egy *Megoldás megjelenítése* gombbal önálló tanuláshoz, az ábra a helyén úszik be ([Fokozatosan felépülő rajzok](/hu/plot/structure-plot#figures-that-build-up)). A `reserve-reaction-labels` ugyanezt teszi a támaszerőkkel, így a tartó nem mozdul el, miközben a nevekből értékek lesznek: lásd [Támaszerők mint ismeretlenek](/hu/plot/structure-plot#reactions-as-unknowns).

## Nyomtatott dolgozat {#print-a-test}

Írásbeli dolgozathoz egy Node-szkript, a `print-test.ts`, hallgatónként egy oldalt ír ki, utánuk pedig a megoldókulcsokat. A `structureSvg` minden modellt SVG-szöveggé alakít, így a szkriptnek sem Vue-ra, sem böngészőre nincs szüksége:

```ts [print-test.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const students = ['Ada', 'Ben', 'Cleo']
const exercises = students.map((_, i) => makeExercise(1000 + i)) // seedek: 1000, 1001, …

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

Nyisd meg a `test.html` fájlt egy böngészőben, és nyomtasd ki, vagy mentsd PDF-be: minden hallgató feladata és minden megoldókulcs külön oldalra kerül. Ada oldala és a hozzá tartozó megoldókulcs:

![1000-es feladat: 6 m-es támaszköz 2 m-es konzollal, a támaszközön 10 kN/m, a konzol végén 30 kN, az ismeretlen támaszerők A_x, A_z és B_z néven, láncméretezés 6 m-rel és 2 m-rel, 8 m teljes hosszal; alatta a megoldókulcs 20 és 70 támaszerővel és a támasz fölötti −60-tól a támaszközbeli 20-ig terjedő hajlítónyomatékkal](/screenshots/hu/p2p-plot-exercise-sheet.webp){.shot-lg}

A `dimensions` réteg megadja az egyes szakaszok és a teljes hossz méretét, ahogy egy feladatlapon szokás, a `reactionLabels: 'names'` pedig megnevezi az ismeretleneket, és mindegyik nyíl abba az irányba mutat, amerre a válasz pozitívnak számít. A megoldókulcsban a támaszerők és az ábraértékek puszta számok kN-ban és kNm-ben, ahogy az EduBeam alkalmazásban: ha a hallgatóidnak szükségük van rá, írd ezt bele a megoldókulcs fejlécébe. Fekete-fehér fénymásolóhoz add meg a `colors` propot úgy, hogy minden tónus fekete legyen: lásd [Fekete-fehér](/hu/plot/theming#black-and-white).

## Ábrák LaTeX-hez és Wordhöz {#figures-for-latex-and-word}

Ha a dolgozataidat LaTeX-ben vagy Wordben írod, inkább fájlként írd ki az ábrákat, és tartsd meg a saját sablonodat. A `figures.ts` 30 seed feladatlapját és megoldókulcsát írja ki:

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

Futtasd a `node figures.ts` paranccsal: ez 30 hallgatóhoz 60 fájl, mindegyik egyszerű SVG rögzített színekkel, CSS és szkriptek nélkül.

- A **Word** (2019 és Microsoft 365) átalakítás nélkül beszúrja az SVG-t: *Beszúrás › Képek*.
- A **LaTeX** SVG helyett PDF-et illeszt be. Alakítsd át egyszer a [CairoSVG](https://cairosvg.org) (`cairosvg exercise-1000.svg -o exercise-1000.pdf`) vagy az Inkscape segítségével, majd használd az `\includegraphics[width=\linewidth]{exercise-1000.pdf}` parancsot. Az `svg` csomag `\includesvg` parancsa elvégzi helyetted az átalakítást, ha az Inkscape telepítve van.

Egy rajz 640 egység széles, a szövege 13 egység magas, így egy A4-es szövegoszlop szélességén, körülbelül 16 cm-en a feliratai 9 pt-osak. A `fontFamily` beállításban add meg a dokumentumodban használt betűtípust: az összes beállítást az [Önálló SVG-fájl](/hu/plot/functions#a-standalone-svg-file) szakasz ismerteti.

## Szabd a saját igényeidre {#make-it-your-own}

- **Többféle szerkezet.** Adj hozzá további eseteket: konzolt, kéttámaszközű többtámaszú tartót, keretet, rácsos tartót. Az oldal tetején lévő élő bemutató nyolcféle szerkezet közül választ, a kéttámaszú tartótól a háromcsuklós kereten és a Warren-rendszerű rácsos tartón át a keretig.
- **Statikailag határozatlan feladatok.** A számítómag ezeket ugyanolyan jól kezeli; csak a kézi megoldás lesz hosszabb.
- **Kerek számok.** A terheket és a hosszakat rövid listákból sorsold, ahogy fent, így a megoldókulcs olyan kerek lesz, amilyet szeretnél. Ciklusban menj végig néhány száz seeden, és hagyd ki azokat, amelyek megoldókulcsában több tizedesjegy van, mint szeretnéd.
- **Védelem a mechanizmusok ellen.** Egy generátor, amely rosszul is elhelyezheti a támaszokat, `try` blokkban számoljon, és hagyja ki azokat a seedeket, amelyeknél kivétel keletkezik: lásd [Ha a megoldás nem sikerül](/hu/solver/solving#when-solving-fails).
- **Kérdezz többet.** Rajzold meg a nyíróerőt (`'V'`), a lehajlást (`'w'`, a [`getUnknowns`](/hu/solver/results#displacements) értékeivel) vagy a normálerőt egy ferde rúdban.
