---
title: Exercices et examens
description: "Générer avec @edubeam/fem et @edubeam/plot un exercice de calcul des structures différent par étudiant, avec un corrigé toujours juste, en page web, imprimé ou en SVG."
order: 5
group: Cas d’utilisation
source: site
---

# Exercices et examens

Écrivez une structure une seule fois, comme fonction d’une graine (valeur initiale du générateur aléatoire), et vous obtenez un exercice pour chaque étudiant, chaque semaine, chacun avec un corrigé toujours juste : @edubeam/fem le calcule, et @edubeam/plot dessine l’énoncé et le corrigé à partir du même modèle.

Cliquez sur **Nouvel exercice** ci-dessous. Chaque clic donne une nouvelle graine : l’exercice est généré, calculé et dessiné dans votre navigateur.

::exercise-generator
::

La démonstration dessine les exercices de deux pages de ce site, toutes deux construites à partir des éléments décrits ici : les [exercices d’entraînement](/fr/practice), où l’étudiant saisit les réactions d’appui et le moment fléchissant ou l’effort maximal dans une barre et obtient aussitôt la vérification, et le [générateur d’examens](/fr/exam), qui imprime une version différente du sujet pour chaque étudiant, avec le corrigé, et enregistre les figures en fichiers SVG et les réponses en CSV. Essayez-les avant d’écrire le vôtre.

## Principe {#how-it-works}

1. **Une graine choisit les nombres.** Un générateur aléatoire initialisé par une graine donne le même exercice pour la même graine : la graine imprimée sur un sujet permet de retrouver son corrigé.
2. **Le solveur établit le corrigé.** @edubeam/fem calcule chaque structure : les réactions et les moments viennent du solveur, et non d’une formule où une erreur peut se glisser.
3. **La figure dessine les deux.** L’énoncé montre la structure avec les noms des nœuds, ses cotes et les réactions inconnues nommées ; le corrigé donne les valeurs des réactions et ajoute le diagramme.

Quelques fichiers courts mènent d’ici à un sujet imprimé : [le générateur](#the-generator), [un composant](#the-exercise-in-a-page) pour une page web, et [un script](#print-a-test) qui imprime un sujet ou [écrit les figures](#figures-for-latex-and-word) pour LaTeX et Word. Copiez-les dans un projet où [les bibliothèques sont installées](/fr/plot/getting-started#install) ; les scripts se lancent avec `node` à partir de la version 22.18, ou avec `npx tsx` sur les versions antérieures.

## Le générateur {#the-generator}

Un module, `exercise.ts`, transforme une graine en exercice : une poutre sur un appui articulé et un appui simple, une fois sur deux avec un porte-à-faux portant une charge ponctuelle à son extrémité. Les deux cas sont isostatiques : chaque graine se résout à la main aussi bien qu’avec le solveur.

```ts [exercise.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { extremes, modelFromSolver, type PlotModel } from '@edubeam/plot'

export interface Exercise {
  readonly seed: number
  readonly statement: string
  /** La structure calculée, en données simples : dessine à la fois l’énoncé et le corrigé */
  readonly model: PlotModel
  /** Réactions d’appui vers le haut, N, et moments fléchissants extrêmes, N·m */
  readonly key: { RA: number; RB: number; mMax: number; mMin: number }
}

/** mulberry32 : un petit générateur initialisé par une graine, pour qu’une graine désigne toujours le même exercice */
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

  // Une travée sur un appui articulé et un appui simple, avec un porte-à-faux une fois sur deux : isostatique, donc toujours calculable
  const L = pick([4, 5, 6]) // m
  const c = pick([0, 0, 1, 1.5, 2]) // m de porte-à-faux
  const q = int(4, 12) // kN/m sur la travée
  const F = int(2, 6) * 5 // kN en bout de porte-à-faux, ou à `a` de A sans porte-à-faux
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

  // Le corrigé, tiré du modèle calculé : réactions (z vers le bas, donc vers le haut = moins), extremums exacts de M
  const model = modelFromSolver(solver)
  const { reactions, members } = model.results!
  const up = (node: string) => -(reactions.find((x) => x.node === node && x.dof === 'dz')?.value ?? 0)
  const m = Object.values(members).flatMap((member) => extremes(member.M) ?? [])
  const mMax = Math.max(...m.map((e) => e.max.value))
  const mMin = Math.min(...m.map((e) => e.min.value))

  return { seed, statement, model, key: { RA: up('A'), RB: up('B'), mMax, mMin } }
}
```

`modelFromSolver` lit la structure calculée et en fait un [modèle de dessin](/fr/plot/model) : des données simples, avec les réactions et les résultats de chaque barre sous forme de polynômes exacts, si bien que `extremes` trouve les moments maximaux sans échantillonnage. L’exercice ne garde que ce modèle ; le solveur n’est plus nécessaire.

La graine 5 donne « Span L = 6 m with an overhang c = 1.5 m. q = 5 kN/m on the span, F = 25 kN at the tip C. » (une travée de 6 m avec un porte-à-faux de 1,5 m, 5 kN/m sur la travée et 25 kN à l’extrémité C). Son corrigé : $R_A = (5 \cdot 6 \cdot 3 - 25 \cdot 1{,}5)/6 = 8{,}75$ kN, $R_B = 5 \cdot 6 + 25 - 8{,}75 = 46{,}25$ kN, $M_B = -25 \cdot 1{,}5 = -37{,}5$ kNm sur appui, et $M = 8{,}75^2/(2 \cdot 5) = 7{,}66$ kNm en travée, là où l’effort tranchant s’annule. Le solveur donne les mêmes valeurs jusqu’au dernier chiffre.

## Dans une page web {#the-exercise-in-a-page}

Un composant, `ExerciseCard.vue`, dessine l’énoncé ou, avec `answers`, le corrigé :

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

La seconde carte se termine par *R<sub>A</sub> = 8.75 kN, R<sub>B</sub> = 46.25 kN, M from −37.5 kNm to 7.66 kNm*. `formatQuantity` écrit l’unité et un vrai signe moins, comme le fait la figure.

Sur l’énoncé, `reaction-labels="names"` dessine les réactions comme des inconnues : une flèche pour chaque direction bloquée par un appui, orientée dans le sens compté comme positif (vers la droite, vers le haut, dans le sens trigonométrique), nommée *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>* au lieu d’être chiffrée. Le signe de chaque réponse est alors défini sur le dessin : une réaction qui agit dans l’autre sens est négative. Le corrigé écrit les valeurs.

`reserve` met en page dès le départ les couches des deux vues : activer `answers`, par exemple avec un bouton *Afficher la solution* pour le travail en autonomie, fait apparaître le diagramme en fondu à sa place ([Figures progressives](/fr/plot/structure-plot#figures-that-build-up)). `reserve-reaction-labels` fait de même pour les réactions : la poutre reste en place pendant que leurs noms deviennent des valeurs. Voir [Réactions inconnues](/fr/plot/structure-plot#reactions-as-unknowns).

## Un sujet imprimé {#print-a-test}

Pour un examen écrit, un script Node, `print-test.ts`, écrit une page par étudiant, puis les corrigés. `structureSvg` transforme chaque modèle en texte SVG : le script n’a besoin ni de Vue ni d’un navigateur.

```ts [print-test.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const students = ['Ada', 'Ben', 'Cleo']
const exercises = students.map((_, i) => makeExercise(1000 + i)) // graines 1000, 1001, …

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

Ouvrez `test.html` dans un navigateur et imprimez-le, ou enregistrez-le en PDF : l’exercice de chaque étudiant et chaque corrigé ont leur propre page. La page d’Ada et son corrigé :

![Exercice 1000 : une travée de 6 m avec un porte-à-faux de 2 m, 10 kN/m sur la travée et 30 kN à l’extrémité, les réactions inconnues nommées A_x, A_z et B_z, et des cotes en chaîne de 6 m et 2 m avec 8 m au total ; en dessous, le corrigé, avec des réactions de 20 et 70 et le moment fléchissant de −60 sur appui à 20 en travée](/screenshots/fr/p2p-plot-exercise-sheet.webp){.shot-lg}

La couche `dimensions` donne chaque portée et la longueur totale, comme un énoncé d’exercice, et `reactionLabels: 'names'` nomme les inconnues, chaque flèche orientée dans le sens où sa réponse compte comme positive. Dans le corrigé, les réactions et les valeurs des diagrammes sont des nombres sans unité, en kN et en kNm, comme dans l’application EduBeam : précisez-le dans le titre du corrigé si vos étudiants ont besoin de le savoir. Pour une photocopieuse noir et blanc, passez `colors` avec toutes les teintes en noir : voir [Noir et blanc](/fr/plot/theming#black-and-white).

## Figures pour LaTeX et Word {#figures-for-latex-and-word}

Si vos sujets sont rédigés dans LaTeX ou Word, écrivez plutôt les figures dans des fichiers et gardez votre propre modèle de document. `figures.ts` écrit l’énoncé et le corrigé de 30 graines :

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

Lancez-le avec `node figures.ts` : vous obtenez 60 fichiers pour 30 étudiants, chacun un SVG simple aux couleurs fixes, sans CSS ni script.

- **Word** (2019 et Microsoft 365) insère un SVG tel quel : *Insertion › Images*.
- **LaTeX** inclut du PDF plutôt que du SVG. Convertissez une fois, avec [CairoSVG](https://cairosvg.org) (`cairosvg exercise-1000.svg -o exercise-1000.pdf`) ou Inkscape, puis `\includegraphics[width=\linewidth]{exercise-1000.pdf}`. La commande `\includesvg` du paquet `svg` fait la conversion pour vous si Inkscape est installé.

Une figure fait 640 unités de large avec un texte de 13 unités : à la largeur d’une colonne de texte A4, environ 16 cm, ses étiquettes font 9 pt. Réglez `fontFamily` sur une police de votre document : toutes les options sont décrites dans [Un fichier SVG autonome](/fr/plot/functions#a-standalone-svg-file).

## L’adapter à vos besoins {#make-it-your-own}

- **D’autres types de structures.** Ajoutez des cas : une console, une poutre continue à deux travées, un portique, un treillis. La démonstration en haut de page choisit parmi huit types, de la poutre sur deux appuis au portique à trois articulations, en passant par le treillis Warren et le portique.
- **Exercices hyperstatiques.** Le solveur les traite tout aussi bien ; seule la solution à la main s’allonge.
- **Nombres ronds.** Tirez les charges et les longueurs de listes courtes, comme ci-dessus, pour que le corrigé soit aussi rond que vous le souhaitez. Parcourez quelques centaines de graines et écartez celles dont le corrigé a plus de décimales que vous n’en voulez.
- **Se prémunir contre les mécanismes.** Un générateur qui peut mal placer les appuis doit lancer le calcul dans un `try` et écarter les graines qui lèvent une exception : voir [Quand le calcul échoue](/fr/solver/solving#when-solving-fails).
- **Demander davantage.** Faites dessiner l’effort tranchant (`'V'`), la flèche (`'w'`, avec les valeurs de [`getUnknowns`](/fr/solver/results#displacements)) ou l’effort normal dans une barre inclinée.
