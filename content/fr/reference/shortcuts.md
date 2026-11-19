---
description: "Raccourcis clavier, souris et gestes tactiles d’EduBeam : annuler, enregistrer, exporter, copier-coller, ajuster, zoomer, sélectionner, déplacer la vue."
source: site
---

# Clavier, souris et tactile

EduBeam s’utilise au clavier et à la souris, au pavé tactile ou du bout du doigt. Cette page liste tous les raccourcis et tous les gestes. Sur un Mac, utilisez <kbd>Cmd</kbd> partout où <kbd>Ctrl</kbd> est indiqué ; les menus de l’application y affichent ⌘.

## Clavier {#keyboard}

Les raccourcis de dessin (<kbd>F</kbd>, <kbd>C</kbd>, <kbd>G</kbd>, <kbd>S</kbd>, <kbd>Suppr</kbd> et <kbd>Ctrl</kbd>+<kbd>A</kbd>, <kbd>C</kbd>, <kbd>V</kbd>) sont sans effet tant qu’un champ de texte a le focus : taper un `f` ou un `s` dans un champ ne les déclenche donc jamais. Cliquez d’abord sur le dessin.

### Fichiers et historique {#files-and-history}

| Raccourci | Action |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>Z</kbd> | Annuler la dernière modification du modèle |
| <kbd>Ctrl</kbd>+<kbd>Maj</kbd>+<kbd>Z</kbd> | Rétablir |
| <kbd>Ctrl</kbd>+<kbd>S</kbd> | Enregistrer le projet (télécharge `project.json`) |
| <kbd>Ctrl</kbd>+<kbd>O</kbd> | Ouvrir le projet |
| <kbd>Ctrl</kbd>+<kbd>P</kbd> | Exporter une image |

L’annulation porte aussi sur l’effacement du modèle, l’ouverture d’un fichier, d’un lien ou d’un exemple, et la restauration d’une structure récente. Tant que vous êtes encore en train de taper dans une cellule de tableau, <kbd>Ctrl</kbd>+<kbd>Z</kbd> annule la saisie ; une fois la cellule validée, il annule la modification du modèle. Dans les champs d’une boîte de dialogue, il annule toujours la saisie.

### Dessin {#drawing}

| Raccourci | Action |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>A</kbd> | Tout sélectionner |
| <kbd>Ctrl</kbd>+<kbd>C</kbd> | Copier les nœuds, éléments et charges sélectionnés |
| <kbd>Ctrl</kbd>+<kbd>V</kbd> | Coller. Un fantôme de la copie suit le pointeur : cliquez pour la placer, ou saisissez un décalage Δx, Δz dans le bandeau et cliquez sur **Coller** ou appuyez sur <kbd>Entrée</kbd> |
| <kbd>Suppr</kbd> | Supprimer la sélection (sur un portable Mac, <kbd>Fn</kbd>+<kbd>⌫</kbd>) |
| <kbd>Échap</kbd> | Quitter le mode en cours (ajout de nœuds, d’éléments ou de cotes, collage, choix d’une fenêtre pour une image) et vider la sélection ; ferme aussi le menu ☰ et termine la visite guidée |
| <kbd>F</kbd> | Ajuster à l’écran |
| <kbd>C</kbd> | Centrer le contenu |
| <kbd>G</kbd> | Afficher ou masquer la grille |
| <kbd>S</kbd> | Activer ou désactiver le magnétisme à la grille |
| <kbd>Ctrl</kbd>+<kbd>+</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd> | Zoom avant / arrière sur le dessin, autour de son centre |

Dans EduBeam, <kbd>Ctrl</kbd>+<kbd>+</kbd> et <kbd>Ctrl</kbd>+<kbd>-</kbd> zooment sur le dessin, jamais sur toute l’interface comme sur d’autres sites. Ils fonctionnent avec toutes les dispositions de clavier : la touche marquée + ou −, où que votre clavier la place (sur un clavier AZERTY, la touche = + à gauche de <kbd>Retour arrière</kbd> et la touche 6), et le + et le − du pavé numérique.

### Tableaux et boîtes de dialogue {#tables-and-dialogs}

| Raccourci | Action |
| --- | --- |
| <kbd>Entrée</kbd> | Dans une cellule de tableau : valide la valeur. Dans un champ de texte d’une boîte de dialogue : valide la boîte de dialogue, comme son bouton principal |
| <kbd>Échap</kbd> | Dans une cellule de tableau : la quitte en gardant la valeur. Dans une boîte de dialogue : la ferme sans enregistrer |
| <kbd>Tab</kbd> | Passe au champ suivant ; une cellule de tableau garde ce que vous avez tapé |

Les champs numériques acceptent les calculs tels que vous les poseriez : `6/2`, `3*1.5`, `2^3`, `(4+2)/3`, ainsi que `1e3` et la virgule décimale.

## Souris {#mouse}

| Action | Résultat |
| --- | --- |
| Clic | Sélectionne un nœud, un élément, une charge ou une ligne de cote et ouvre son panneau |
| Faire glisser sur une zone vide | Rectangle de sélection |
| Faire glisser un nœud | Le déplace ; il s’accroche à la grille quand le magnétisme est activé |
| Clic pendant un ajout | Place un nœud, ou commence ou prolonge une polyligne d’éléments |
| Double-clic sur une charge | Modifie la charge (y compris un déplacement imposé) |
| Clic droit | Menu contextuel : Ajouter un nœud, Ajouter un élément, Ajouter une cote, Coter l’élément (au-dessus d’un élément), Modifier, Copier, Coller, Supprimer |
| <kbd>Ctrl</kbd> + **Ajouter un nœud** ou **Ajouter un élément** dans le menu contextuel | Place l’objet à la souris au lieu d’ouvrir une boîte de dialogue |
| Glisser avec le bouton central ou droit | Déplace la vue. Choisissez le bouton dans **Paramètres → Commandes et raccourcis → Déplacer la vue avec** |
| Molette | Zoom vers le pointeur |
| Survol d’un objet | Infobulle avec ses déplacements, ses propriétés ou ses valeurs de charge |

Sur un pavé tactile, le pincement et le défilement à deux doigts zooment tous les deux. Pour déplacer la vue, cliquez et faites glisser avec deux doigts, ce qui revient à faire glisser avec le bouton droit.

## Tactile {#touch}

| Geste | Résultat |
| --- | --- |
| Toucher | Sélectionne un objet et affiche ses détails et ses actions |
| Toucher pendant un ajout | Place un nœud ou prolonge un élément |
| Appuyer sur un nœud et glisser | Déplace le nœud |
| Glisser à un doigt ailleurs | Déplace la vue |
| Pincer | Zoom |
| Appui long sur la zone de dessin | Menu contextuel |
| Bouton **Sélection par rectangle** (en haut à droite), puis glisser | Rectangle de sélection ; le menu contextuel, avec Copier et Supprimer, s’ouvre là où vous levez le doigt |

Pendant que vous ajoutez des nœuds, des éléments ou des cotes, que vous collez ou que vous choisissez une fenêtre pour une image, un bandeau en haut du dessin indique le mode et propose un bouton **Annuler**. Sans touche <kbd>Échap</kbd>, c’est ainsi que vous quittez le mode sur un écran tactile.

## Panneaux des objets {#object-panels}

Cliquer sur un objet ou le toucher ouvre à côté de lui un panneau avec ses détails et les actions suivantes :

| Objet | Actions |
| --- | --- |
| Nœud | Ajouter une charge · Appuis du nœud (symbole d’appui, Dx, Dz, Ry) · Angle du SCL nodal · Imposer un déplacement (sur un nœud avec appui) · Supprimer |
| Élément | Modifier l’élément (nœuds d’extrémité et rotules, matériau, section) · Ajouter une charge · Matrice de rigidité · Supprimer |
| Charge nodale ou d’élément | Modifier la charge · Supprimer |
| Ligne de cote | Modifier · Inverser la cote · Supprimer |

La page [Interface utilisateur](/fr/essentials/user-interface) fait le tour de l’écran, et la rubrique [Commandes et raccourcis](/fr/essentials/units-settings#controls-shortcuts) des paramètres permet de choisir le bouton qui déplace la vue.
