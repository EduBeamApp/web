---
description: "Plan de l’interface d’EduBeam : barre de l’application et menu ☰, vue et options d’affichage, sélection, tableaux de la barre inférieure, saisie des valeurs."
source: site
---

# Interface utilisateur

[EduBeam]{.edubeam} comporte trois zones : la **barre de l’application** en haut, la **vue** au milieu, où vous dessinez, et la **barre inférieure**, avec un tableau pour chaque type d’objet. Tout ce que vous faites dans la vue, vous pouvez aussi le faire dans les tableaux, et inversement.

![Les parties de l’interface, numérotées comme dans la liste ci-dessous](/screenshots/fr/ui-overview.webp)

1. **Menu ☰** : ouvrir, enregistrer, partager et exporter ; exemples et visites guidées.
2. **Effacer la structure** et **Partager le modèle**.
3. **Annuler** et **Rétablir**.
4. **Boutons de la vue** : centrer, ajuster à l’écran et options d’affichage.
5. **Options d’affichage** : quels résultats et quelles parties du modèle sont dessinés.
6. **Grille, magnétisme, réticule et unités.**
7. **Onglets de la barre inférieure** : Nœuds, Éléments, Charges, Matériaux, Sections, Résultats.
8. **Le tableau** de l’onglet ouvert, où chaque valeur peut être modifiée.

::callout{type="tip" title="Faites le tour"}
**☰ → Faire le tour** vous présente ces parties directement dans l’application, une à une.
::

## Barre de l’application {#app-bar}

- **☰** ouvre le menu principal, décrit ci-dessous.
- **Effacer la structure** supprime tous les nœuds, éléments et charges après confirmation ; cochez **Supprimer les matériaux** ou **Supprimer les sections** pour les supprimer aussi. <kbd>Ctrl</kbd>+<kbd>Z</kbd> rétablit le modèle, qui est aussi conservé dans *Structures récentes*.
- **Partager le modèle** ouvre la [boîte de dialogue de partage](/fr/essentials/import-export#share-a-link), avec un lien qui contient tout le modèle.
- **Quoi de neuf ?** affiche les notes de version. Elles s’ouvrent aussi d’elles-mêmes une fois après chaque mise à jour.
- **Documentation** ouvre ce guide, et l’icône GitHub le code source.

Sur un téléphone, seuls ☰ et **Documentation** tiennent dans la barre ; **Effacer la structure** et **Partager le modèle** se trouvent dans le menu.

### Le menu ☰ {#the-☰-menu}

![Le menu ☰](/screenshots/fr/ui-app-menu.webp){.shot-xs}

- **Ouvrir le projet** et **Enregistrer le projet** ouvrent ou téléchargent un fichier `project.json` (<kbd>Ctrl</kbd>+<kbd>O</kbd>, <kbd>Ctrl</kbd>+<kbd>S</kbd>).
- **Structures récentes** conserve les 10 derniers modèles que vous avez effacés ou remplacés, prêts à être restaurés.
- **Exporter une image** enregistre le dessin en PNG ou en SVG, ou le copie (<kbd>Ctrl</kbd>+<kbd>P</kbd>).
- **Exemples** est la galerie de modèles prêts à l’emploi ; **Dessiner votre première poutre** est un exercice guidé en sept étapes ; **Faire le tour** est la visite de l’interface.
- **Partager le modèle** et **Effacer la structure** font la même chose que les boutons de la barre de l’application.

Le bas du menu indique la version de l’application et sa date de publication. L’ouverture, l’enregistrement, le partage et l’export sont décrits dans [Fichiers, liens et export](/fr/essentials/import-export).

## Vue {#viewer}

La zone de dessin, où vous construisez et examinez le modèle. Les résultats sont recalculés à chaque modification : il n’y a pas de bouton *Calculer*.

### Boutons sur la zone de dessin {#buttons-on-the-canvas}

**En haut à gauche : Annuler et Rétablir** défont ou refont, une à une, toutes les modifications du modèle : ajout, modification, déplacement, suppression, effacement (<kbd>Ctrl</kbd>+<kbd>Z</kbd>, <kbd>Ctrl</kbd>+<kbd>Maj</kbd>+<kbd>Z</kbd>).

**En haut à droite :**

- **Sélection par rectangle**, sur un appareil à écran tactile : le prochain glissement du doigt trace un rectangle de sélection.
- **Centrer le contenu** centre le modèle sans changer le zoom (<kbd>C</kbd>) ; **Ajuster à l’écran** zoome pour faire tenir tout le modèle (<kbd>F</kbd>).
- **⚙** affiche ou masque les [options d’affichage](#display-options).

**En bas à droite :**

![Les boutons de la grille, du magnétisme, du réticule et des unités](/screenshots/fr/ui-grid-units.webp){.shot-sm}

- **G** affiche ou masque la grille et les règles (<kbd>G</kbd>) ; **S** active ou désactive le magnétisme à la grille (<kbd>S</kbd>).
- Le bouton du **réticule** reporte la position du pointeur sur les règles (à la souris uniquement).
- La **pastille des unités** ouvre les paramètres sur [Langue et paramètres régionaux](/fr/essentials/units-settings#language-locale).

### Options d’affichage {#display-options}

Le bouton ⚙ ouvre deux rangées de cases à cocher. La première choisit les résultats dessinés par-dessus le modèle : *Déformée*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)* et *Réactions* ; la déformée, le moment fléchissant et les réactions sont cochés au départ. La seconde affiche ou masque des parties du modèle : *Appuis*, *Charges*, *Étiquettes des nœuds* et *Étiquettes des éléments*, toutes cochées au départ.

![Les boutons de la vue et les options d’affichage](/screenshots/fr/ui-display-settings.webp){.shot-lg}

**Plus de paramètres** ouvre les [paramètres d’affichage](/fr/essentials/units-settings#viewer-settings) : tailles, couleurs et manière de dessiner les diagrammes. [Résultats et diagrammes](/fr/essentials/results#overlays-in-the-viewer) explique ce que montre chaque résultat.

### Navigation {#navigating}

| Action | Souris et clavier | Tactile |
| --- | --- | --- |
| Zoom | Molette de la souris, vers le pointeur ; sur un pavé tactile, pincez ou faites défiler avec deux doigts | Pincement |
| Panoramique | Glisser avec le bouton droit ou la molette enfoncée ; choisissez lequel dans [Commandes et raccourcis](/fr/essentials/units-settings#controls-shortcuts) | Glisser avec un doigt |
| Ajuster, centrer | <kbd>F</kbd>, <kbd>C</kbd> ou les boutons en haut à droite | Les boutons en haut à droite |

<kbd>Ctrl</kbd>+<kbd>+</kbd> et <kbd>Ctrl</kbd>+<kbd>-</kbd> agrandissent et réduisent le dessin autour de son centre, quelle que soit la disposition du clavier. Ils ne redimensionnent jamais toute l’interface, comme le ferait le zoom du navigateur.

### Sélection et modification {#selecting-and-editing}

| Pour | Faites ceci |
| --- | --- |
| Sélectionner un objet | Cliquez sur un nœud, un élément, une charge ou une ligne de cote. Un panneau s’ouvre à côté, avec ses actions : ajouter une charge, définir les appuis, modifier, afficher la matrice de rigidité, supprimer. La barre inférieure passe sur l’onglet correspondant. |
| Sélectionner plusieurs objets | Tracez un rectangle sur une zone vide (sur écran tactile, appuyez d’abord sur **Sélection par rectangle**). Il sélectionne tous les nœuds qu’il contient et tous les éléments qu’il touche, avec leurs charges et leurs lignes de cote. <kbd>Ctrl</kbd>+<kbd>A</kbd> sélectionne tout. |
| Supprimer, copier, coller | <kbd>Suppr</kbd>, <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd>. L’objet collé suit le pointeur jusqu’à ce que vous cliquiez ; vous pouvez aussi saisir un décalage Δx, Δz dans le bandeau. |
| Déplacer un nœud | Faites-le glisser. Avec le magnétisme activé, il se place sur la grille ; les éléments reliés et les charges suivent. |
| Modifier une charge | Double-cliquez dessus. |
| Voir les détails | Pointez n’importe quel objet pour afficher une infobulle : les déplacements et la rotation d’un nœud, le matériau et la section d’un élément, les valeurs d’une charge. Sur écran tactile, touchez l’objet : le panneau affiche les mêmes informations. |
| Ouvrir le menu contextuel | Faites un clic droit sur la zone de dessin, ou un appui long sur écran tactile. |

::div{.shots}

![Le panneau d’un nœud : ajouter une charge, définir les appuis, imposer un déplacement](/screenshots/fr/ui-node-menu.webp)

![Pointer un nœud affiche ses déplacements et sa rotation](/screenshots/fr/ui-hover.webp)

::

Le **menu contextuel** propose *Ajouter un nœud*, *Ajouter un élément*, *Ajouter une cote* (et *Coter l’élément* au-dessus d’un élément), puis *Modifier*, *Copier*, *Coller* et *Supprimer* pour la sélection courante. Maintenez <kbd>Ctrl</kbd> enfoncée en choisissant *Ajouter un nœud* ou *Ajouter un élément* pour les placer à la souris au lieu de passer par une boîte de dialogue.

![Le menu contextuel de la zone de dessin](/screenshots/fr/ui-canvas-menu.webp){.shot-sm}

La page [Clavier, souris et tactile](/fr/reference/shortcuts) liste tous les raccourcis et tous les gestes.

### Quand le modèle ne peut pas être calculé {#when-the-model-cannot-be-solved}

Des messages apparaissent en haut à gauche de la vue :

| Message | Signification |
| --- | --- |
| *Aucun matériau défini.*, *Aucune section définie.* | Créez-en avec le bouton **Ajouter** affiché à côté du message. |
| Une pastille bleue **Appuis manquants** | Le modèle est simplement inachevé : il lui faut d’autres appuis. |
| Un message rouge, avec **Afficher les détails** | Quelque chose ne va pas. Les détails listent chaque problème, avec une indication pour le corriger. |
| Un message jaune | Le modèle a été calculé, mais quelque chose semble anormal, par exemple un nœud auquel aucun élément n’est relié. |

Quand la structure peut encore bouger, EduBeam la fait osciller sous forme de contour en pointillés et entoure les nœuds ou les rotules en cause. Pointez le message pour revoir le mouvement ; son bouton en forme d’œil le masque.

![Un portique avec des rotules en B et C est un mécanisme : EduBeam montre comment il se déplace](/screenshots/fr/ui-mechanism.webp)

La page [Dépannage](/fr/reference/troubleshooting#messages) explique chaque message et la manière d’y remédier.

## Barre inférieure {#bottom-bar}

Six onglets, chacun avec une barre d’outils et un tableau modifiable. L’étiquette d’un onglet indique combien d’objets il contient. Faites glisser la bande des onglets vers le haut ou vers le bas pour redimensionner la barre, ou repliez-la avec le bouton situé à droite. Le **?** à côté explique l’onglet ouvert, tout comme le **?** placé à côté de certains en-têtes de colonnes.

| Onglet | Barre d’outils | Colonnes du tableau |
| --- | --- | --- |
| **Nœuds** | Ajouter un nœud (boîte de dialogue), Ajouter un nœud (souris) | Nœud, Coordonnées, **DDL bloqués** (symbole d’appui, `Dx`, `Dz`, `Ry`, angle α), Charges, Actions |
| **Éléments** | Ajouter un élément (boîte de dialogue), Ajouter un élément (souris) | Élément, Type, Nœuds (avec **Inverser les nœuds**), Matériau, Section, **Rotules d’extrémité**, Charges, Actions |
| **Charges** | Ajouter une charge nodale, Ajouter une charge d’élément | Type, Point d’application, Composantes, Actions |
| **Matériaux** | Ajouter un matériau, Bibliothèque de matériaux | Matériau, E, G, α<sub>T</sub>, Actions |
| **Sections** | Ajouter une section, Bibliothèque de sections, Section polygonale | Forme, Section, Aire, I<sub>y</sub>, Hauteur, Coefficient de cisaillement, Actions |
| **Résultats** | Résultats nodaux, Résultats par élément, Exporter en CSV, Copier | Déplacements par nœud, ou efforts aux extrémités par élément ; voir [Résultats et diagrammes](/fr/essentials/results#results-tab) |

Les onglets sont décrits en détail dans [Nœuds et appuis](/fr/essentials/nodes-supports), [Éléments, matériaux et sections](/fr/essentials/elements), [Charges](/fr/essentials/loads) et [Résultats et diagrammes](/fr/essentials/results#results-tab).

### Saisie des valeurs {#typing-values}

Tous les champs numériques, dans les tableaux comme dans les boîtes de dialogue, fonctionnent de la même façon :

- Les valeurs sont dans les [unités courantes](/fr/essentials/units-settings#units), indiquées dans l’en-tête de colonne ou après le champ.
- Le point et la virgule décimale fonctionnent tous les deux : `2.5` et `2,5` donnent la même valeur.
- Vous pouvez saisir des expressions avec `+ - * / ^` et des parenthèses : `6/2`, `3*1.5`, `2^3` ou `(4+2)/3` sont calculés pour vous, et `1e-5` vaut $10^{-5}$.
- Dans un tableau, <kbd>Entrée</kbd>, <kbd>Échap</kbd>, <kbd>Tab</kbd> ou un clic ailleurs valide la valeur. <kbd>Ctrl</kbd>+<kbd>Z</kbd> l’annule ensuite ; tant que vous êtes encore en train de saisir, il annule plutôt la frappe.

## Onglets au-dessus de la vue {#tabs-above-the-viewer}

**Structure** affiche la zone de dessin. **Paramètres** affiche à sa place les [paramètres](/fr/essentials/units-settings) en pleine taille : vous pouvez changer des couleurs ou des unités, puis revenir voir l’effet. La pastille des unités et *Plus de paramètres* ouvrent les mêmes paramètres dans une boîte de dialogue par-dessus le modèle.

## Fenêtres flottantes {#floating-windows}

**Matrice de rigidité** (depuis le panneau d’un élément ou le tableau *Éléments*) ouvre une fenêtre avec la matrice de rigidité 6 × 6 de l’élément en axes globaux. **Modifier**, dans le menu contextuel, ouvre un tableau de la sélection courante. Déplacez une fenêtre en faisant glisser sa barre de titre, et fermez-la avec le ×.
