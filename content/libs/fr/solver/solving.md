---
title: Résolution
description: "Ce que fait solve() dans @edubeam/fem, quand renuméroter les équations après modification, comment repérer un mécanisme et quelle taille de modèle il traite."
order: 9
group: Calcul et résultats
source: site
---

# Résolution {#solving}

```ts
solver.solve()
```

`solve()` numérote les équations, assemble la matrice de rigidité globale et les vecteurs de charge de chaque cas de charge, puis résout le système pour obtenir les déplacements et les réactions. Ensuite, tous les [résultats](/fr/solver/results) peuvent être lus ; avant, en lire un lève une `TypeError`. Les étapes sont celles de [Comment EduBeam résout un modèle](/fr/elements/analysis), dans le manuel théorique.

La solution est exacte pour le modèle linéaire : la déformée et les efforts internes le long de chaque barre proviennent de solutions analytiques de la poutre de Timoshenko. Il n’y a donc pas de maillage à affiner, ni besoin de découper les barres pour obtenir des diagrammes précis.

À partir de la version 0.3.1, `solve()` n’écrit plus rien dans la console ; la version 0.3.0 affichait à chaque appel une ligne comme `Solution took 9 [ms]`.

## Recalculer après une modification {#solving-again-after-a-change}

Modifier des valeurs dans un modèle ne demande qu’un nouveau `solve()`. Modifier le jeu d’équations demande d’abord une ligne de plus :

```ts
domain.createNode('C', [10, 0, 0], [DofID.Dz])
domain.createBeam2D(2, ['B', 'C'], 1, 1)
solver.codeNumberGenerated = false // les DDL ont changé : les renuméroter
solver.solve()
```

| Modification | Ensuite |
| --- | --- |
| Valeurs des charges, charges ajoutées ou supprimées | `solve()` |
| Coordonnées des nœuds, matériaux, sections, rotules | `solve()` |
| Ajout de nœuds ou de barres | `codeNumberGenerated = false`, puis `solve()` |
| Suppression de nœuds ou de barres : `domain.nodes.delete(label)`, `domain.elements.delete(label)` | `codeNumberGenerated = false`, puis `solve()` |
| Modification des appuis d’un nœud, `node.bcs` | `codeNumberGenerated = false`, puis `solve()` |

Oubliez cette ligne après avoir ajouté un nœud, et `solve()` lève une `TypeError`. Oubliez-la après avoir modifié un appui, et `solve()` calcule **sans prévenir** avec les anciens appuis. Dans le doute, remettez `codeNumberGenerated` à `false` : la numérotation ne coûte presque rien. Supprimer une barre implique aussi de retirer ses charges de `lc.elementLoadList`, sinon `solve()` lève une `RangeError` pour la barre manquante.

Pour de nombreuses variantes d’un même modèle, comme dans une étude paramétrique, un nouveau solveur pour chacune est plus simple et tout aussi rapide : voir l’[exemple de la ligne d’influence](/fr/solver/scripts#an-influence-line-as-csv).

## Quand le calcul échoue {#when-solving-fails}

Une structure qui peut se déplacer sans se déformer, un mécanisme, a une matrice de rigidité singulière. Parfois, `solve()` s’en aperçoit et lève une exception :

```text
Error: Linear system cannot be solved since matrix is singular
```

Souvent, il ne s’en aperçoit pas : les erreurs d’arrondi font paraître la matrice inversible, et vous obtenez des déplacements de $10^{12}$ m, ou des valeurs d’apparence raisonnable pour une structure libre de glisser. Une poutre sur deux appuis simples, par exemple, se calcule sans erreur tant que rien ne la pousse latéralement. Vérifiez donc vous-même les appuis, et considérez des déplacements énormes comme le signe d’un mécanisme.

Causes typiques :

- trop peu d’appuis, comme une poutre sur deux appuis simples ;
- des appuis incapables de tenir la structure : tous parallèles, ou tous dirigés vers un même point ;
- une rotule de trop, comme trois rotules alignées ;
- un moment appliqué à un nœud où toutes les extrémités de barres sont articulées.

Le message ne dit pas où se trouve le problème. L’application EduBeam détecte les mécanismes avant le calcul, puis en trouve le mouvement et l’anime ; construire le même modèle dans l’application est souvent le moyen le plus rapide de le voir. La page [Dépannage](/fr/reference/troubleshooting) liste les causes habituelles.

Un nœud, un matériau ou une section manquant lève une `RangeError` qui le nomme. Des paramètres de section manquants ne lèvent rien du tout : tous les résultats valent `NaN`. Voir [Matériaux et sections](/fr/solver/materials-sections#cross-section).

## Taille du modèle {#model-size}

Le solveur utilise des matrices pleines, conçues pour des modèles de taille pédagogique. Sur un ordinateur portable, dans Node, une suite de barres alignées se calcule en environ :

| Barres | DDL | Temps |
| --- | --- | --- |
| 50 | 150 | 0,1 s |
| 100 | 300 | 0,2 s |
| 200 | 600 | 1 s |
| 400 | 1200 | 10 s |

Chaque doublement de la taille du modèle multiplie le temps par six à neuf.

Tous les exercices, portiques et treillis d’un cours de calcul des structures restent largement dans ces limites. Le solveur n’est pas fait pour des modèles de milliers de barres.

## Pas d’autres types de calcul {#no-other-analyses}

Cette version ne traite que la statique linéaire. Le code source contient un solveur aux valeurs propres pour les fréquences propres, mais il ne fait pas partie du paquet publié : `EigenValueDynamicSolver` ne peut pas être importé depuis `@edubeam/fem`.
