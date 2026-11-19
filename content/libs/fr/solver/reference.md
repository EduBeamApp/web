---
title: Référence de l’API
description: "Chaque classe, méthode et argument de @edubeam/fem 0.3, avec les unités, les valeurs par défaut et la forme de ce que chacun renvoie."
order: 16
group: Référence
source: site
---

# Référence de l’API {#api-reference}

Ce qu’exporte `@edubeam/fem` 0.3, regroupé par usage. Les unités sont partout celles du SI : m, N, N·m, N/m, Pa, K et rad. Les étiquettes (`LabelType`) sont de type `string | number` et stockées comme chaînes. Les méthodes absentes de cette page sont internes : elles ne sont publiques en TypeScript que parce que les classes du solveur les appellent entre elles.

## Exports {#exports}

| Export | Nature | Section |
| --- | --- | --- |
| `LinearStaticSolver` | classe | [Calculs](#analyses) |
| `Solver` | classe abstraite | [Calculs](#analyses) |
| `Domain` | classe | [Domain](#domain) |
| `Node` | classe | [Node](#node) |
| `Beam2D`, `Element` | classes | [Éléments](#elements) |
| `Material`, `CrossSection` | classes | [Matériaux et sections](#materials-and-sections) |
| `LoadCase` | classe | [Charges](#loads) |
| `NodalLoad`, `BeamConcentratedLoad`, `BeamElementUniformEdgeLoad`, `BeamElementTrapezoidalEdgeLoad`, `BeamTemperatureLoad`, `PrescribedDisplacement`, `Load`, `BeamElementLoad` | classes | [Charges](#loads) |
| `DofID` | enum | [DofID](#dofid) |
| `LabelType`, `EnumDictionary`, `MaterialParameters`, `CrossSectionParameters` | types | |

## Calculs {#analyses}

### `LinearStaticSolver` {#linearstaticsolver}

```ts
const solver = new LinearStaticSolver()
```

| Propriété ou méthode | Type | Description |
| --- | --- | --- |
| `domain` | `Domain` | Le modèle |
| `loadCases` | `LoadCase[]` | Contient au départ un cas, `'DefaultLC'`. Ajoutez-en d’autres avec `new LoadCase(label, solver.domain)` : [Cas de charge](/fr/solver/load-cases). |
| `solve()` | `void` | Numérote les équations si nécessaire, assemble et résout tous les cas de charge. Peut lever une exception sur un [mécanisme](/fr/solver/solving#when-solving-fails), mais pas toujours. Silencieux depuis la 0.3.1 ; la 0.3.0 affichait sa durée. |
| `codeNumberGenerated` | `boolean` | À mettre à `false` après l’ajout ou la suppression de nœuds ou de barres, ou une modification des appuis : [pourquoi](/fr/solver/solving#solving-again-after-a-change) |
| `neq`, `pneq` | `number` | Nombres de DDL libres et de DDL bloqués, après un calcul |
| `k` | `Matrix` mathjs | La matrice de rigidité globale assemblée, après un calcul |
| `getNodeDofIDs(label)` | `number[]` | Les DDL d’un nœud, après un calcul |

`EigenValueDynamicSolver` existe dans le code source, mais n’est pas exporté.

## Domain {#domain}

`solver.domain` contient le modèle dans quatre `Map` dont les clés sont les étiquettes sous forme de chaînes : `nodes`, `elements`, `materials`, `crossSections`. Il n’y a pas de méthode de suppression : `domain.nodes.delete(label)` et `domain.elements.delete(label)` suppriment un nœud ou une barre, ce qui impose ensuite une [renumérotation](/fr/solver/solving#solving-again-after-a-change).

| Méthode | Renvoie | Description |
| --- | --- | --- |
| `createNode(label, coords?, bcs?)` | `Node` | `coords` `[x, y, z]` en m (par défaut `[0, 0, 0]`), `bcs` les `DofID` bloqués (par défaut aucun) |
| `createBeam2D(label, nodes, mat, cs, hinges?)` | `Beam2D` | `nodes` `[first, second]`, `hinges` `[atFirst, atSecond]` (par défaut `[false, false]`) |
| `createMaterial(label, params?)` | `Material` | Voir [Matériaux et sections](#materials-and-sections) |
| `createCrossSection(label, params?)` | `CrossSection` | Voir [Matériaux et sections](#materials-and-sections) |
| `getNode(label)`, `getElement(label)`, `getMaterial(label)`, `getCS(label)` | l’objet | Lève une `RangeError` pour une étiquette inconnue. `getElement` est typé `Element` : écrivez `as Beam2D` pour lire des résultats. |

Créer un objet avec une étiquette déjà utilisée remplace l’ancien.

## Node {#node}

| Propriété ou méthode | Type | Description |
| --- | --- | --- |
| `label` | `string` | |
| `coords` | `number[]` | `[x, y, z]`, m. Modifiez-le pour déplacer le nœud. |
| `bcs` | `Set<DofID>` | DDL bloqués. Remplacez-le pour changer l’appui. |
| `lcs` | `number[][] \| undefined` | Les axes tournés du nœud, s’il y en a |
| `updateLcs({ locx, locy }?)` | `void` | Tourne les axes du nœud : `locx` son axe x en composantes globales, `locy` `[0, 1, 0]`. Sans argument, remet les axes d’origine. |
| `hasLcs()` | `boolean` | Indique si les axes sont tournés |
| `getUnknowns(lc, dofs)` | `Matrix`, ou un `number` pour un seul DDL | Déplacements (m) et rotations (rad), dans les axes du nœud |
| `getReactions(lc, global?)` | `{ dofs, values }` | Réactions sur les DDL bloqués, dans l’ordre de `bcs` : N, N·m. `values` est une `Matrix` mathjs s’il y en a plusieurs, un tableau à un élément s’il n’y en a qu’une, `[]` pour un nœud libre. Avec `global` à `true` sur un nœud tourné : les trois DDL en axes globaux, `dofs` `[0, 2, 4]`, `values` un tableau avec 0 là où rien n’est bloqué. [Comment les lire](/fr/solver/results#reactions). |

## Éléments {#elements}

### `Beam2D` {#beam2d}

Une poutre de Timoshenko à deux nœuds dans le plan x–z, avec trois DDL par nœud (`Dx`, `Dz`, `Ry`). `x` est en mètres depuis le premier nœud ; `n` est un nombre de segments, qui donne n + 1 points.

| Propriété ou méthode | Renvoie | Description |
| --- | --- | --- |
| `label`, `nodes`, `mat`, `cs` | `string`, `string[]`, `string`, `string` | |
| `hinges` | `[boolean, boolean]` | Libérations du moment au premier et au second nœud |
| `computeNormalForceAt(lc, x)` | `number` | N, positif en traction |
| `computeShearForceAt(lc, x)` | `number` | V, positif là où M croît le long de x local |
| `computeBendingMomentAt(lc, x)` | `number` | M, positif quand le côté +z local est tendu |
| `computeNormalForce(lc, n)` | `{ x, N }` | N en n + 1 points |
| `computeShearForce(lc, n)` | `{ x, V }` | V en n + 1 points |
| `computeBendingMoment(lc, n)` | `{ x, M }` | M en n + 1 points |
| `computeLocalDefl(lc, n)` | `{ u, w }` | Déplacements le long de la barre et perpendiculairement à elle, axes locaux, m |
| `computeGlobalDefl(lc, n)` | `{ u, w }` | Les mêmes en x et z globaux |
| `computeEndForces(lc)` | `Matrix` | `[X12, Z12, M12, X21, Z21, M21]`, les forces que les nœuds exercent sur la barre, axes locaux |
| `computeEndDisplacement(lc)` | `Matrix` | Déplacements d’extrémité en axes locaux, rotations des rotules comprises |
| `computeGeo()` | `{ l, dx, dz }` | Longueur et projections, m |
| `computeT()` | `Matrix` | Matrice de passage 6 × 6, des axes globaux aux axes locaux |
| `computeLocalStiffnessMtrx()` | `{ answer }` | `answer` : matrice de rigidité locale 6 × 6, rotules éliminées par condensation |
| `computeStiffness()` | `Matrix` | Matrice de rigidité globale 6 × 6 |
| `computeShearFactor()` | `number` | $\Phi = 12EI_y/kGAL^2$ |
| `getMaterial()`, `getCS()` | `Material`, `CrossSection` | |

Au droit d’une charge ponctuelle, les méthodes `…At` renvoient la valeur juste après celle-ci. `Element` est la classe de base abstraite de `Beam2D` ; c’est le type qu’utilisent `domain.elements` et `getElement`.

## Matériaux et sections {#materials-and-sections}

| `MaterialParameters` | Unité | Par défaut | Sert à |
| --- | --- | --- | --- |
| `e` | Pa | 1 | la rigidité |
| `g` | Pa | 1 | la rigidité à l’effort tranchant |
| `alpha` | 1/K | 1 | les charges thermiques |
| `d` | kg/m³ | 1 | rien en statique |

| `CrossSectionParameters` | Unité | Par défaut | Sert à |
| --- | --- | --- | --- |
| `a` | m² | aucune, obligatoire | les rigidités axiale et à l’effort tranchant |
| `iy` | m⁴ | aucune, obligatoire | la rigidité en flexion |
| `k` | – | aucune, obligatoire | la rigidité à l’effort tranchant $kGA$ ; `1e32` pour négliger la déformation d’effort tranchant |
| `h` | m | aucune | les différences de température (`NaN` sans ce paramètre) |
| `iz`, `dyz`, `j` | m⁴ | aucune | inutilisés par `Beam2D` |

Un paramètre de matériau manquant vaut 1, et non une valeur courante ; un `a`, un `iy` ou un `k` manquant donne `NaN` pour tous les résultats. Aucun des deux cas ne lève d’exception. Les deux classes ont une méthode `change(params)`, qui fixe les paramètres donnés, et conservent ceux-ci comme propriétés de mêmes noms.

## Charges {#loads}

### `LoadCase` {#loadcase}

| Méthode | Renvoie | Valeurs |
| --- | --- | --- |
| `createNodalLoad(node, values, lcs?)` | `NodalLoad` | `{ [DofID.Dx]: N, [DofID.Dz]: N, [DofID.Ry]: N·m }` ; `lcs` (par défaut `false`) à `true` : dans les axes tournés du nœud |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | `BeamElementUniformEdgeLoad` | N/m sur toute la barre |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | `BeamElementTrapezoidalEdgeLoad` | N/m au premier et au second nœud, linéaire entre les deux |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | `BeamConcentratedLoad` | N, N, N·m, à `a` m du premier nœud |
| `createBeamTemperatureLoad(el, [dTc, dTb, dTt])` | `BeamTemperatureLoad` | K : centre de gravité, fibre inférieure, fibre supérieure |
| `createPrescribedDisplacement(node, values)` | `PrescribedDisplacement` | `{ [DofID.Dz]: m, … }` sur des DDL bloqués, dans les axes du nœud ; ignoré sur les DDL libres |

Pour les charges sur barre, `lcs` à `true` signifie axes locaux (x le long de la barre, z perpendiculaire), `false` axes globaux. Les charges linéiques sont données par mètre de longueur de barre. La page [Charges nodales et charges sur barre](/fr/solver/loads) donne des exemples.

| Propriété ou méthode | Type | Description |
| --- | --- | --- |
| `label` | `string` | |
| `nodalLoadList` | `NodalLoad[]` | |
| `elementLoadList` | `BeamElementLoad[]` | Charges sur barre et charges thermiques |
| `prescribedBC` | `PrescribedDisplacement[]` | |
| `solved` | `boolean` | `true` après un calcul réussi |
| `getElementLoadsOnElement(el)` | `BeamElementLoad[]` | Les charges d’une barre |

Les objets de charge conservent leurs valeurs dans des propriétés publiques, que vous pouvez modifier avant de relancer le calcul : `values` (et `lcs`) pour `NodalLoad`, `BeamElementUniformEdgeLoad`, `BeamConcentratedLoad` et `BeamTemperatureLoad` ; `startValues` et `endValues` pour `BeamElementTrapezoidalEdgeLoad` ; `prescribedValues` pour `PrescribedDisplacement`. Chacun a une propriété `target`, l’étiquette de l’objet sur lequel il agit.

## DofID {#dofid}

| Nom | Valeur | Utilisé par `Beam2D` |
| --- | --- | --- |
| `Dx` | 0 | oui |
| `Dy` | 1 | non |
| `Dz` | 2 | oui |
| `Rx` | 3 | non |
| `Ry` | 4 | oui |
| `Rz` | 5 | non |

## Résultats {#results}

Les résultats se lisent sur un `Beam2D` (efforts internes, flèches, efforts d’extrémité) et sur un `Node` (déplacements, réactions), toujours pour un `LoadCase` donné, après `solve()` : voir les deux tableaux ci-dessus, et [Lire les résultats](/fr/solver/results) pour des exemples et les signes. En bref :

| Pour obtenir | Appel |
| --- | --- |
| Réactions, N et N·m | `node.getReactions(lc)` |
| Déplacements, m, et rotations, rad | `node.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])` |
| N, V ou M en un point, N et N·m | `beam.computeNormalForceAt(lc, x)`, `computeShearForceAt`, `computeBendingMomentAt` |
| N, V ou M le long d’une barre | `beam.computeNormalForce(lc, n)`, `computeShearForce`, `computeBendingMoment` |
| Déformée, m | `beam.computeLocalDefl(lc, n)`, `computeGlobalDefl` |
| Efforts d’extrémité, N et N·m | `beam.computeEndForces(lc)` |
| Une figure de l’ensemble | `StructurePlot` ou `structureSvg` de [@edubeam/plot](/fr/solver/drawing) |
