---
title: Fonctions
description: "Fonctions, constantes et types de @edubeam/plot hors composants : structureSvg pour les fichiers SVG, lecture exacte, unités, lignes de poutre, mise en page."
order: 10
source: site
---

# Fonctions

Tout ce que dessinent les composants provient de fonctions pures, sans Vue. Elles écrivent une figure dans un fichier SVG, lisent les résultats exactement, préparent les données à l’avance et permettent de construire vos propres figures. Avec des imports nommés, le bundle reste léger : une page qui n’importe que `modelFromSolver` ne reçoit aucun code de composant.

Toutes les valeurs sont en SI, sauf si une unité indique le contraire ; les positions le long d’une barre sont en mètres depuis son nœud initial.

## Un fichier SVG autonome {#a-standalone-svg-file}

Une figure dans une page prend ses couleurs dans les propriétés personnalisées CSS de la page : un `<svg>` copié depuis la page n’en a donc aucune. `structureSvg` écrit plutôt la figure comme le texte d’un fichier `.svg` autonome : couleurs fixes, sans feuille de style ni script, mis en page par la même routine que `StructurePlot`. Word, PowerPoint, Inkscape, CairoSVG et les chaînes d’outils LaTeX l’affichent comme la page.

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts' // () => un LinearStaticSolver calculé, comme sur la page Diapositives

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![Le portique en fichier SVG autonome, rendu par CairoSVG : les charges, les réactions, 20 et 40 vers le haut et 2,3 et 12,7 horizontalement, et le moment fléchissant de −50,7 en C à 29,3 dans la traverse](/screenshots/fr/p2p-plot-frame-svg.webp){.shot-lg}

| Option | Défaut | Rôle |
| --- | --- | --- |
| `layers` | barres, appuis, charges, réactions et le résultat que choisirait `StructurePlot` | Ce qu’il faut dessiner |
| `width` | `640` | Largeur en px, les unités utilisateur du SVG |
| `height` | suit le dessin | Une hauteur fixe, px |
| `maxHeight` | max(320, 0.75 × width) | La limite supérieure de la hauteur automatique |
| `padding` | `6` | Espace autour du dessin, px |
| `fontSize` | `13`, compact `11.5` | Taille du texte, px |
| `fontFamily` | `Helvetica, Arial, sans-serif` | Une liste de polices dont dispose le programme qui ouvre le fichier |
| `colors` | `PRINT_COLORS` | N’importe quelle teinte, en couleurs fixes |
| `background` | `true` | Peint le fond de la couleur `paper` ; `false` le laisse transparent |
| `title` | aucun | Écrit comme `<title>` du SVG |
| `reserve`, `reserveLabelModes`, `reserveReactionLabels` | aucun | Couches, styles d’étiquettes et styles d’étiquettes de réaction dont la place est réservée en plus de ceux qui sont dessinés, pour que les fichiers d’une figure progressive se superposent : [Une figure progressive dans Beamer](/fr/plot/slides#a-build-up-in-beamer) |
| `units`, `numberFormat`, `compact`, `diagramSize`, `deformedSize`, `momentOnTensionSide`, `resultLabelMode`, `reactionLabels` | comme `StructurePlot` | Le même sens que les props du composant |

`PRINT_COLORS` correspond aux couleurs de l’application EduBeam sur fond blanc : encre `#16182b`, effort normal `#2222ff`, effort tranchant `#00af00`, moment fléchissant `#ff2222`, charges `#ff8700`, réactions `#a020f0`. Chaque étiquette est écrite deux fois, avec un halo de la couleur du fond sous le texte, car tous les programmes SVG ne comprennent pas `paint-order` ; un indice, comme dans les noms de réaction *A<sub>x</sub>*, est un `tspan` aux valeurs numériques simples que Word et Inkscape savent lire. Sans `reserve`, un fichier est ajusté aux couches qu’il dessine.

Pour utiliser le fichier :

- **Word et PowerPoint** (2019 et Microsoft 365) : *Insertion › Images*.
- **LaTeX** : convertissez-le en PDF avec [CairoSVG](https://cairosvg.org) (`cairosvg frame.svg -o frame.pdf`) ou Inkscape, puis utilisez `\includegraphics` ; ou bien `\includesvg` du paquet `svg`, qui appelle Inkscape pour vous. Avec 640 unités de large, une figure placée dans une colonne de texte de 16 cm a des étiquettes de 9 pt.
- **Une page web sans Vue** : collez le texte dans le HTML. Voir [Sans Vue](/fr/plot/embedding#plain-html-from-node).

La page [Exercices et examens](/fr/plot/exercises#figures-for-latex-and-word) écrit un fichier pour l’énoncé et le corrigé de chaque étudiant.

## À partir d’un solveur {#from-a-solver}

| Export | Signature | Rôle |
| --- | --- | --- |
| `modelFromSolver` | `(solver: Solver, options?: FromSolverOptions) => PlotModel` | Transforme un solveur en [modèle de dessin](/fr/plot/model) simple ; les résultats seulement pour un cas de charge calculé |
| `FromSolverOptions` | type | `{ loadCase?: number }`, un indice dans `solver.loadCases` |

## Polynômes par morceaux {#piecewise-polynomials}

Les résultats d’une barre sont des valeurs `Piecewise` : des listes de morceaux `{ x0, x1, c }`, décrites dans [Modèle de dessin](/fr/plot/model#piecewise-polynomials). `side` choisit la valeur juste avant (`'left'`) ou juste après (`'right'`, par défaut) un point où deux morceaux se rejoignent.

| Export | Signature | Rôle |
| --- | --- | --- |
| `valueAt` | `(pw, x, side?) => number` | La valeur en `x` ; au-delà des extrémités, la valeur de l’extrémité la plus proche |
| `slopeAt` | `(pw, x, side?) => number` | La dérivée, en unités de la valeur par mètre |
| `extremes` | `(pw) => { max: Extreme; min: Extreme } \| null` | La plus grande et la plus petite valeur, exactes, chacune `{ x, value, side }` |
| `maxAbs` | `(pw) => number` | La plus grande valeur absolue |
| `innerBreaks` | `(pw) => number[]` | Les points où les morceaux se rejoignent, sans les deux extrémités |
| `isZero` | `(pw) => boolean` | Indique si le résultat est nul partout |
| `evalPiece` | `(piece, x) => number` | La valeur d’un morceau |
| `evalPieceSlope` | `(piece, x) => number` | La pente d’un morceau |
| `pieceExtrema` | `(piece) => number[]` | Les points où la pente d’un morceau s’annule, m |
| `pieceDegree` | `(piece) => number \| null` | Le degré d’un morceau ; `null` s’il est nul |
| `cleanPiecewise` | `(pw, tolerance) => Piecewise` | Supprime les coefficients inférieurs à `tolerance`, les erreurs d’arrondi d’un modèle calculé |
| `fitPiece` | `(f, x0, x1, degree) => Piece` | Le polynôme d’un degré donné qui passe par une fonction sur `(x0, x1)` |
| `pieceToBeziers` | `(piece, segments?) => CubicSegment[]` | Le morceau sous forme de courbes de Bézier cubiques dans (x, valeur) : exact jusqu’au degré trois, sinon `segments` courbes, 4 par défaut |

Types : `Piece`, `Piecewise`, `Side` (`'left' \| 'right'`), `Extreme`, `CubicSegment`.

## Unités et nombres {#units-and-numbers}

| Export | Signature | Rôle |
| --- | --- | --- |
| `KN_UNITS` | `Units` | kN, kNm, kN/m, m, mm, mrad, K : les unités par défaut |
| `SI_UNITS` | `Units` | N, N·m, N/m, m, m, rad, K |
| `resolveUnits` | `(units?: Partial<Units>) => Units` | `KN_UNITS` avec vos remplacements |
| `DEFAULT_NUMBER_FORMAT` | `Intl.NumberFormat` | Anglais, au plus une décimale |
| `formatNumber` | `(value, format?) => string` | Le nombre avec un vrai signe moins, jamais −0 |
| `formatQuantity` | `(si, unit, format?) => string` | `"36 kN"` : une valeur SI dans une unité, avec une espace fine insécable |

Une `Unit` est `{ symbol, scale }`, avec valeur affichée = valeur SI × `scale`. `Units` en contient une pour chaque `UnitKind` : `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` et `temperature`.

```ts
import { formatQuantity, KN_UNITS } from '@edubeam/plot'

formatQuantity(-37500, KN_UNITS.moment) // "−37.5 kNm"
```

## Lecture des valeurs {#reading-values}

| Export | Signature | Rôle |
| --- | --- | --- |
| `readMember` | `(results: MemberResults, x, snap?) => { x, u, values }` | N, V, M et w en `x`, chacun `{ left, right }`, et le déplacement axial `u` ; s’accroche à un saut situé à moins de `snap` m |
| `readoutAt` | `(model, transform, px, py, reach) => Readout \| null` | La barre la plus proche d’un point de l’écran, à moins de `reach` px, et ses résultats en ce point |
| `readoutMarks` | `(model, transform, readout, shown, k, side) => ReadoutMark[]` | Où les valeurs lues sont dessinées : l’extrémité de l’ordonnée de chaque diagramme affiché (les deux dans un saut), le point sur la déformée |
| `formatReadout` | `(readout, quantity, units, format?) => string` | `"M = 54 kNm"`, ou `"V = 13.3 → −6.7 kN"` dans un saut |

`k` est l’échelle en px par unité SI de chaque résultat et `side` le côté où chaque diagramme est dessiné, donnés par `diagramScales` et `diagramSide` ci-dessous. Types : `Readout`, `ReadoutMark` (`{ tone, from, to }` en px), `ReadoutQuantity` (`'N' \| 'V' \| 'M' \| 'w'`), `SidedValue`.

## Lignes de poutre {#beam-lines}

Les briques de [DiagramStack](/fr/plot/diagram-stack), pour construire votre propre figure en colonne.

| Export | Signature | Rôle |
| --- | --- | --- |
| `beamLine` | `(model, ids?) => BeamLine` | Les barres sous forme d’une seule ligne horizontale, de gauche à droite ; lève une exception dans tout autre cas |
| `lineDiagram` | `(model, line, row) => Piecewise` | Un résultat le long de toute la ligne, dans l’abscisse x de la ligne |
| `rowRange` | `(pw) => [number, number]` | La plage à laquelle une ligne est mise à l’échelle, zéro toujours compris |
| `rowPeaks` | `(pw) => RowPeak[]` | Les extremums qui méritent d’être écrits sur une ligne |
| `rowBreaks` | `(pw) => number[]` | Les points où le résultat présente une discontinuité : appuis, jonctions et charges ponctuelles |
| `rowOutline` | `(pw, sx, sy, close) => string` | Les données de chemin SVG du contour d’une ligne, à partir des conversions des m et des valeurs en px |
| `rowOrdinates` | `(pw, sx, sy, spacing) => string` | Les données de chemin SVG des ordonnées de hachure, espacées de `spacing` px |
| `lineModel` | `(model, line, omit?) => PlotModel` | Le modèle réduit à la ligne, éventuellement sans une des charges |
| `pointLoadAt` | `(model, line, at) => PlotLoad \| undefined` | La force ponctuelle à la position `at` de la ligne |

Types : `BeamLine`, `LineMember`, `RowPeak`, `StackRow`.

La page [DiagramStack](/fr/plot/diagram-stack#a-load-the-reader-can-drag) utilise `beamLine`, `lineDiagram` et `rowRange` pour garder l’échelle de chaque ligne sur toutes les positions d’une charge mobile.

## Géométrie et appuis {#geometry-and-supports}

| Export | Signature | Rôle |
| --- | --- | --- |
| `nodeMap` | `(model) => ReadonlyMap<string, PlotNode>` | Les nœuds par identifiant |
| `memberFrame` | `(model, member, nodes?) => MemberFrame` | Le début d’une barre, sa tangente unitaire, son axe z local unitaire et sa longueur |
| `memberFrames` | `(model) => Map<string, MemberFrame>` | La même chose pour toutes les barres, par identifiant |
| `pointAlong` | `(frame, at) => { x, z }` | Le point situé à `at` mètres le long d’une barre |
| `supportKind` | `(fixity) => SupportKind` | `'fixed'`, `'pin'`, `'roller'`, `'slider'`, `'rotation'` ou `'none'` |
| `supportPlacement` | `(model, node) => SupportPlacement` | Le symbole d’un nœud et sa rotation dans le sens horaire, en degrés |
| `supportGlyph` | `(kind) => readonly GlyphPart[]` | Les traits du symbole, en px |
| `glyphReach` | `(kind, rotation, x, z) => number` | Jusqu’où un symbole tourné s’étend dans une direction, px |

## Dessin {#drawing}

Le dessin se fait en trois étapes. `buildStructureScene` transforme un modèle en éléments de scène : des points du modèle avec des décalages en pixels d’écran. `fitScene` trouve l’échelle et le décalage qui les font tenir dans un cadre. `resolveScene` les transforme en données de chemin SVG, en cercles et en étiquettes qui ont la place de s’afficher. `layoutStructure` enchaîne les trois comme le font `StructurePlot` et `structureSvg` : votre propre figure est ainsi mise en page comme les leurs.

| Export | Signature | Rôle |
| --- | --- | --- |
| `layoutStructure` | `(model, options, box, shown?, labelModes?) => StructureLayout` | Toute la mise en page : ajustement avec toutes les étiquettes, suppression des étiquettes trop serrées, nouvel ajustement. Renvoie `{ fit, items, resolved }` |
| `structureSvg` | `(model, options?) => string` | Un fichier `.svg` autonome : [voir plus haut](#a-standalone-svg-file) |
| `buildStructureScene` | `(model, options: StructureSceneOptions) => SceneItem[]` | Le dessin des couches choisies à une échelle donnée, en px par mètre |
| `fitScene` | `(items, box: FitBox) => Fit` | Échelle et décalage pour tenir dans un cadre `{ width, height?, maxHeight?, padding, fontSize }` |
| `resolveScene` | `(items, transform, options: ResolveOptions) => ResolvedScene` | `{ paths, circles, texts }` en px, avec les étiquettes qui tiennent |
| `placeLabels` | `(items, transform, options: ResolveOptions) => Map<SceneText, SceneText>` | Quelles étiquettes garder, et où |
| `alternativeResultGroups` | `(shown) => ReadonlySet<string>` | Les couches de résultats affichées une à la fois, dont les étiquettes cèdent la place aux autres mais pas entre elles |
| `sceneBounds` | `(items, scale, fontSize) => Bounds` | L’étendue d’une scène, px |
| `project` | `(transform, anchor) => [number, number]` | Un point de la scène à l’écran, px |
| `defaultResultLayer` | `(model) => ResultLayer \| null` | Le résultat qu’affiche une figure quand aucun n’est demandé |
| `diagramScales` | `(model, options) => Record<ResultLayer, number>` | L’échelle en px par unité SI de chaque résultat |
| `diagramSide` | `(q, momentOnTensionSide) => 1 \| -1` | Le côté de la barre où une valeur positive est dessinée |
| `isBarStructure` | `(model, memberResults) => boolean` | Indique si N est écrit en nombres le long des barres (un treillis) plutôt que dessiné en diagramme |
| `tipPlacements` | `(tip, out, mode, gaps?) => TextPlacement[]` | Les emplacements possibles d’une valeur au-delà de l’extrémité d’une ordonnée |
| `PLOT_LAYERS` | `readonly PlotLayer[]` | Toutes les couches, dans l’ordre où elles sont peintes |
| `RESULT_LAYERS` | `['N', 'V', 'M', 'w']` | Les couches de résultats |
| `HATCH_SPACING_PX` | `7` | L’espacement des ordonnées des diagrammes, px |
| `DEFAULT_COLORS` | `PlotColors` | La couleur par défaut de chaque teinte, en CSS : [Thèmes et couleurs](/fr/plot/theming) |
| `PRINT_COLORS` | `Record<Tone \| 'paper', string>` | Des couleurs fixes pour un fichier, celles de l’application sur fond blanc |
| `toneVars` | `(colors?) => Record<string, string>` | Les propriétés personnalisées qu’une figure définit sur sa racine |
| `PLOT_CSS` | `string` | Les règles CSS intégrées à chaque figure |

`ResolveOptions` vaut `{ fontSize, viewport?, exclude?, alternativeGroups?, shields? }` : `shields` désigne les groupes dont les traits écartent les étiquettes (les diagrammes affichés), tous les groupes si l’option est omise. Dans `layoutStructure`, `options.layers` donne les couches à mettre en page (tout ce qui peut être affiché, comme `reserve`), `shown` celles qui sont affichées, et `labelModes` les styles d’étiquettes dont la place est réservée.

Types : `StructureSceneOptions`, `StructureLayout`, `StructureSvgOptions`, `SceneItem`, `SceneText`, `TextPlacement`, `ResolvedScene`, `ResolvedPath`, `ResolvedText`, `ResolvedCircle`, `ResolveOptions`, `Bounds`, `Anchor`, `Transform`, `Fit`, `FitBox`, `Tone`, `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `SupportKind`, `SupportPlacement`, `GlyphPart`, et les types du modèle décrits dans [Modèle de dessin](/fr/plot/model).
