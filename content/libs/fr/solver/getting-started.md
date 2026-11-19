---
title: Premiers pas
description: "Installez @edubeam/fem, le solveur aux éléments finis d’EduBeam, puis calculez, vérifiez et lisez une poutre sur deux appuis en une douzaine de lignes de TypeScript."
order: 1
group: Introduction
source: site
---

# Premiers pas {#getting-started}

@edubeam/fem est le solveur aux éléments finis sur lequel repose [EduBeam]{.edubeam} : chaque diagramme, chaque réaction et chaque flèche affichés par l’application en proviennent. Il vous permet de calculer des poutres, des portiques et des treillis plans depuis votre propre code, dans le navigateur ou dans Node : générer des exercices avec leurs solutions, vérifier des devoirs, mener des études paramétriques ou placer un solveur derrière une page web.

::div{.actions}
[Calculer votre première poutre](#a-simply-supported-beam) [Parcourir les exemples complets](/fr/solver/beams)
::

La bibliothèque est écrite en TypeScript, fournit ses propres types et est un logiciel libre sous licence GPL-3.0. Créée par Bořek Patzák, elle est développée avec Jan Voříšek et d’autres contributeurs.

## Installation {#install}

```bash
npm install @edubeam/fem
```

La bibliothèque fonctionne avec `import` comme avec `require`, dans le navigateur et dans Node 18 ou plus récent, et n’apporte qu’une dépendance, [mathjs](https://mathjs.org). Jusqu’à la version 0.3.0, elle s’installait depuis GitHub sous le nom `ts-fem` : si vous l’utilisiez ainsi, remplacez vos imports par `@edubeam/fem`. Rien d’autre n’a changé.

Pour essayer l’exemple ci-dessous dans un dossier vide, faites-en un projet qui utilise `import`, puis installez la bibliothèque :

```bash
npm init -y
npm pkg set type=module
npm install @edubeam/fem
```

Sans `"type": "module"` dans `package.json`, l’exemple fonctionne quand même, mais Node affiche d’abord un avertissement.

## Votre première poutre {#a-simply-supported-beam}

Une poutre en acier de 6 m, un IPE 200, sur une articulation et un appui simple, sous 12 kN/m :

```ts [beam.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver

// Unités SI partout : m, N, Pa. De l'acier et un IPE 200.
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

// Nœuds en [x, y, z], en mètres, avec les DDL bloqués par leur appui
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // articulation
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // appui simple
const beam = domain.createBeam2D(1, ['A', 'B'], 'steel', 'IPE200')

// 12 kN/m selon l'axe z local de la barre : vers le bas sur une poutre dessinée de gauche à droite
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad(1, [0, 12e3], true)

solver.solve()

console.log(beam.computeBendingMomentAt(lc, 3)) // N·m à mi-portée
console.log(beam.computeShearForceAt(lc, 0)) // N en A
console.log(beam.computeLocalDefl(lc, 2).w[1]) // m à mi-portée
```

Enregistrez-le sous `beam.ts` et lancez `node beam.ts` : Node 22.18 et versions ultérieures exécutent le TypeScript tel quel. Le fichier ne contient aucune annotation de type ; avec un Node plus ancien, enregistrez-le donc plutôt sous `beam.mjs`. Il affiche :

```text [Sortie]
54000
36000
0.04990940552616746
```

Ce sont les valeurs des manuels, $M = qL^2/8 = 54$ kNm et $V = qL/2 = 36$ kN. Voici la même poutre, calculée dans votre navigateur par le même solveur :

::model-figure{caption="La poutre ci-dessus : 6 m, IPE 200, 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9, g: 81e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 0.8333333 }
---
::

La flèche, 49,91 mm, dépasse de 0,28 mm celle d’Euler–Bernoulli, $5qL^4/384EI = 49{,}63$ mm. Ce n’est pas une erreur : la barre est une poutre de Timoshenko, et ces 0,28 mm valent $qL^2/8kGA$, la déformation d’effort tranchant de cette poutre. Donnez à `k` une valeur énorme, par exemple `1e32`, et l’écart disparaît : voir [Déformation d’effort tranchant](/fr/solver/materials-sections#shear-deformation).

## Ce que fait le code {#what-the-code-does}

::div{.steps}
### Créer un solveur {#make-a-solver}

`new LinearStaticSolver()` crée un `domain` vide, qui contient le modèle, et un cas de charge, `solver.loadCases[0]`.

### Décrire le modèle {#describe-the-model}

Les matériaux et les sections, les nœuds avec leurs appuis, puis les barres entre les nœuds. Chaque objet porte une étiquette, une chaîne ou un nombre, par laquelle le reste du modèle y fait référence. Voir [Nœuds et appuis](/fr/solver/nodes-supports), [Matériaux et sections](/fr/solver/materials-sections) et [Barres et rotules](/fr/solver/members-hinges).

### Le charger {#load-it}

Les charges appartiennent à un cas de charge : forces aux nœuds, charges le long des barres, température et tassements. Voir [Charges nodales et charges sur barre](/fr/solver/loads).

### Le calculer {#solve}

`solver.solve()` assemble et résout tous les cas de charge. Voir [Résolution](/fr/solver/solving).

### Lire les résultats {#read-the-results}

Efforts internes en tout point d’une barre, flèches, efforts d’extrémité, déplacements nodaux et réactions. Voir [Lire les résultats](/fr/solver/results) et, pour les diagrammes, [Dessiner les résultats](/fr/solver/drawing).
::

## Unités et signes en bref {#axes-and-signs}

Unités SI en entrée, unités SI en sortie. Le modèle se trouve dans le plan x–z, avec **z dirigé vers le bas** : un `fz` positif pousse vers le bas, et la tête d’un poteau de 4 m se trouve en $z = -4$. Les positions le long d’une barre se mesurent en mètres depuis son premier nœud. Un moment qui tend la fibre inférieure est positif. La page [Unités et signes](/fr/solver/conventions) donne la liste complète.

## Six pièges fréquents {#pitfalls}

1. **z est dirigé vers le bas.** Les charges de pesanteur sont positives, et tout ce qui se trouve au-dessus des appuis a un z négatif. Voir [Axes](/fr/solver/conventions#axes).
2. **Le sens d’une barre fixe le signe de M et de w.** Définissez les poutres de gauche à droite et les poteaux de bas en haut : les signes se lisent alors comme dans un manuel. Voir [Sens de la barre](/fr/solver/conventions#member-direction).
3. **Un paramètre manquant donne `NaN` ou un résultat absurde, pas une erreur.** Une section a besoin de `a`, `iy` et `k` ; un matériau a besoin de `e`, et de `g` sauf si `k` est énorme. Voir [Matériaux et sections](/fr/solver/materials-sections).
4. **Après avoir ajouté des nœuds ou des barres, ou modifié des appuis,** mettez `solver.codeNumberGenerated = false` avant de relancer le calcul. Voir [Recalculer après une modification](/fr/solver/solving#solving-again-after-a-change).
5. **Les réactions sont renvoyées sous forme de matrice mathjs ou de tableau,** dans l’ordre où les DDL de l’appui ont été donnés. Voir [Réactions](/fr/solver/results#reactions).
6. **Un mécanisme ne lève pas toujours d’exception.** Un déplacement de $10^{12}$ m signifie que la structure peut se déplacer librement. Voir [Quand le calcul échoue](/fr/solver/solving#when-solving-fails).

## Pour aller plus loin {#next}

::card-grid{cols="2"}
:::card{title="Exemples complets" icon="lucide:book-open" to="/fr/solver/beams"}
Des programmes complets et vérifiés : poutres, portiques, treillis, une feuille d’exercices avec son corrigé, un petit serveur HTTP.
:::
:::card{title="Dessiner les résultats" icon="lucide:chart-spline" to="/fr/solver/drawing"}
Passez un modèle calculé à @edubeam/plot et obtenez ses diagrammes en SVG, dans Vue ou depuis un script Node.
:::
:::card{title="Référence de l’API" icon="lucide:list-tree" to="/fr/solver/reference"}
Chaque classe, méthode et argument, avec les unités et ce qui est renvoyé.
:::
:::card{title="La théorie" icon="lucide:sigma" to="/fr/elements/beam"}
L’élément poutre, sa matrice de rigidité et sa matrice de passage, dans le manuel théorique d’EduBeam.
:::
::
