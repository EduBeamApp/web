---
title: Modèle de dessin
description: "Le PlotModel sérialisable en JSON que modelFromSolver tire d’un modèle @edubeam/fem calculé, ses polynômes par morceaux et la lecture exacte des valeurs."
order: 9
source: site
---

# Modèle de dessin

Tout ce que dessine @edubeam/plot provient d’un `PlotModel` : des données simples que `modelFromSolver` extrait d’un modèle @edubeam/fem calculé. Il contient la géométrie, les appuis, les charges, les réactions d’appui et les résultats de chaque barre sous forme de polynômes exacts. Il est sérialisable en JSON : on peut donc le produire au moment du build et le livrer à la place du solveur, et c’est le moyen le plus simple de lire les valeurs exactes et les extremums d’une structure calculée.

```ts
import { modelFromSolver } from '@edubeam/plot'

const model = modelFromSolver(solver) // ou modelFromSolver(solver, { loadCase: 1 })
```

`results` n’est présent que si le cas de charge est calculé. Sans lui, les composants dessinent le modèle seul et, avec [`reactionLabels: 'names'`](/fr/plot/structure-plot#reactions-as-unknowns), dessinent quand même les réactions inconnues : un modèle non calculé peut servir d’énoncé d’exercice.

## Le format {#the-format}

Tout est en unités SI (m, N, N·m, N/m, K, rad) et dans les axes du solveur : x vers la droite, z vers le bas, rotations positives dans le sens trigonométrique à l’écran.

```ts
interface PlotModel {
  readonly nodes: readonly PlotNode[]
  readonly members: readonly PlotMember[]
  readonly loads: readonly PlotLoad[]
  readonly results?: PlotResults // seulement pour un cas de charge calculé
}

interface PlotNode {
  readonly id: string
  readonly x: number
  readonly z: number
  readonly fixity: { readonly dx: boolean; readonly dz: boolean; readonly ry: boolean } // DDL bloqués
  readonly angle: number // rotation des axes d’un appui tourné, rad, sens horaire à l’écran
}

interface PlotMember {
  readonly id: string
  readonly start: string // identifiants des nœuds
  readonly end: string
  readonly hinges: readonly [boolean, boolean]
}

interface PlotResults {
  readonly members: Readonly<Record<string, MemberResults>> // par identifiant de barre
  readonly reactions: readonly PlotReaction[]
}

interface MemberResults {
  readonly N: Piecewise // effort normal, positif en traction
  readonly V: Piecewise // effort tranchant
  readonly M: Piecewise // moment fléchissant, positif quand la fibre côté +z local est tendue
  readonly u: Piecewise // déplacement selon x local
  readonly w: Piecewise // déplacement selon z local
}

interface PlotReaction {
  readonly node: string
  readonly dof: 'dx' | 'dz' | 'ry'
  readonly value: number // force exercée sur la structure selon l’axe du nœud, N (N·m pour ry)
}
```

Une charge est de l’un des sept types, distingués par `kind` :

| `kind` | Champs | Représente |
| --- | --- | --- |
| `'nodalForce'` | `node`, `fx`, `fz` | une force en un nœud, composantes globales, N |
| `'nodalMoment'` | `node`, `my` | un moment en un nœud, N·m |
| `'distributed'` | `member`, `start`, `end`, `local` | une charge linéique à variation linéaire, `{ fx, fz }` à chaque extrémité, N/m ; uniforme si les deux sont égales |
| `'pointForce'` | `member`, `at`, `fx`, `fz`, `local` | une force à `at` mètres du début de la barre |
| `'pointMoment'` | `member`, `at`, `my` | un moment ponctuel sur une barre |
| `'temperature'` | `member`, `uniform`, `gradient` | K : la variation au centre de gravité, et la différence fibre inférieure moins fibre supérieure |
| `'prescribed'` | `node`, `dx?`, `dz?`, `ry?` | un déplacement d’appui dans les axes du nœud, m et rad |

`local` vaut `true` lorsque les composantes sont exprimées selon les axes locaux x et z de la barre plutôt que selon les axes globaux.

## Polynômes par morceaux {#piecewise-polynomials}

Le résultat d’une barre est un `Piecewise` : une liste de morceaux, chacun étant un polynôme sur une partie de la barre. Un nouveau morceau commence partout où une force ou un moment ponctuel provoque une discontinuité du résultat.

```ts
interface Piece {
  readonly x0: number // m depuis le début de la barre
  readonly x1: number
  readonly c: readonly number[] // valeur = Σ c[k]·sᵏ, avec s = (x − x0)/(x1 − x0)
}
type Piecewise = readonly Piece[]
```

N, V et M sont au plus cubiques, et la flèche au plus de degré cinq : quelques coefficients suffisent à contenir exactement la réponse du solveur. L’effort tranchant d’une poutre de 6 m avec 20 kN à 2 m se compose de deux morceaux constants :

```json
[{ "x0": 0, "x1": 2, "c": [13333.33] }, { "x0": 2, "x1": 6, "c": [-6666.67] }]
```

## Lire les valeurs soi-même {#reading-values-yourself}

Les fonctions qui dessinent les diagrammes savent aussi les lire, exactement et sans échantillonnage :

```ts
import { extremes, innerBreaks, modelFromSolver, valueAt } from '@edubeam/plot'

// 6 m sur deux appuis, 20 kN à 2 m de A, IPE 200 sans déformation d’effort tranchant
const model = modelFromSolver(solver)
const { V, M, w } = model.results!.members['1']

innerBreaks(V) // [2] : les morceaux se rejoignent sous la charge
valueAt(V, 2, 'left') // 13333.3 N, juste avant la charge
valueAt(V, 2, 'right') // -6666.7 N, juste après
extremes(M) // max 26666.7 N·m en x = 2
extremes(w) // max 0.018973 m en x = 2.734
```

`extremes` renvoie `{ max, min }`, chacun de la forme `{ x, value, side }`, ou `null` pour une liste vide. La flèche maximale ne se trouve pas sous la charge : elle est en $x = L - \sqrt{(L^2 - a^2)/3} = 2{,}734$ m et vaut $P\,a\,(L^2 - a^2)^{3/2}/9\sqrt{3}\,EIL = 18{,}97$ mm, comme le donne la formule d’une charge excentrée.

C’est ainsi que le [générateur d’exercices](/fr/plot/exercises#the-generator) trouve les moments extrêmes de son corrigé. La page [Fonctions](/fr/plot/functions#piecewise-polynomials) présente le reste : pentes, extremums à l’intérieur d’un morceau, degrés et courbes de Bézier.

## Le livrer en JSON {#ship-it-as-json}

`JSON.stringify(model)` suffit, et `JSON.parse` redonne un modèle qui se dessine exactement comme avec le solveur. Un portique avec une charge linéique et une charge ponctuelle tient en moins de 2 ko. Voir [Intégration](/fr/plot/embedding#ship-the-drawing-not-the-solver). Un modèle alimente aussi [`structureSvg`](/fr/plot/functions#a-standalone-svg-file), qui l’écrit dans un fichier SVG.
