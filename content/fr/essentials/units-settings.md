---
description: "Paramètres d’EduBeam : langue, unités SI ou américaines, format des nombres, axes, grille, style des diagrammes, panoramique, données du navigateur."
source: site
---

# Unités et paramètres

Choisissez la langue, les unités et les axes avec lesquels vous travaillez, ainsi que l’aspect du dessin. Les paramètres ne changent que la façon dont le modèle est affiché et saisi : le modèle lui-même est toujours stocké en unités SI, avec z vers le bas. Un projet ou un lien s’ouvre donc de la même façon quels que soient les paramètres.

Il existe trois façons d’y accéder :

- l’onglet **Paramètres** au-dessus de la vue les affiche en pleine taille à la place du modèle, sur *Langue et paramètres régionaux* ; l’onglet **Structure** vous ramène au modèle ;
- la **pastille des unités** en bas à droite de la vue (`m m² kN kNm MPa`) les ouvre dans une boîte de dialogue, sur *Langue et paramètres régionaux* ;
- **Plus de paramètres**, sous les [options d’affichage](/fr/essentials/user-interface#display-options), ouvre la boîte de dialogue sur *Paramètres d’affichage*.

Les paramètres sont enregistrés dans votre navigateur et restent en place quand vous rechargez la page. **Réinitialiser les paramètres**, sous la liste des pages, rétablit les valeurs par défaut : format des nombres, axes, bouton de panoramique, unités de votre région, ainsi que tous les paramètres d’affichage et les options d’affichage du bouton ⚙. Votre langue est conservée. Une réinitialisation ne peut pas être annulée.

## Langue et paramètres régionaux {#language-locale}

![Paramètres → Langue et paramètres régionaux](/screenshots/fr/settings-language.webp)

**Langue.** 18 langues ; à la première ouverture, EduBeam suit la langue de votre navigateur. Le séparateur décimal suit la langue. Un lien peut imposer la langue à la personne qui l’ouvre : ajoutez `?lang=` suivi de l’un des codes `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn` (chinois), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`.

**Format des nombres.** La façon dont les valeurs des résultats sont écrites dans les tableaux et les infobulles : *Scientifique* (1,5 · 10⁴, par défaut), *Ingénierie* (15 · 10³) ou *Automatique*. Voir [Format des nombres](/fr/essentials/results#number-format).

**Système de coordonnées.** *x vers la droite, z vers le bas* (par défaut) ou *x vers la droite, y vers le haut*. Avec *x vers la droite, y vers le haut*, l’axe vertical s’appelle y et pointe vers le haut, et les moments sont pris autour de z. Les coordonnées verticales, les forces, les déplacements, les réactions et les angles d’appui changent de signe, et chaque champ, tableau, infobulle et export utilise les nouveaux noms. Le modèle, le dessin et les fichiers enregistrés restent exactement les mêmes. Voir [Axes y vers le haut](/fr/elements/conventions#y-up-axes).

![Le portique à trois articulations avec les axes y vers le haut : l’indicateur d’axes dans le coin pointe y vers le haut](/screenshots/fr/settings-y-up.webp){.shot-lg}

**Système d’unités.** *SI (métrique)* ou *Américain (impérial)* règle toutes les unités d’un coup. Lors de votre première visite, vous le choisissez dans la fenêtre d’accueil. EduBeam ne propose les unités américaines que si le navigateur est réglé sur des paramètres régionaux américains *et* que l’ordinateur est dans un fuseau horaire américain ; partout ailleurs, il propose le SI. Si vous modifiez ensuite une seule unité, le système affiche *Personnalisé*.

### Unités {#units}

Chaque grandeur a sa propre unité. Les champs de saisie (qui l’affichent à la fin du champ), les tableaux, les infobulles et les étiquettes des diagrammes l’utilisent tous, et changer d’unité convertit ce qui est affiché. Rien ne change dans le modèle : passer d’une unité à l’autre et revenir ne fait rien perdre.

| Grandeur | Choix | SI | Américain |
| --- | --- | --- | --- |
| Longueur (géométrie, position des charges) | m, cm, mm, ft, in | m | ft |
| Dimensions de section | m, cm, mm, ft, in | m | in |
| Déplacement (résultats, tassements imposés) | m, cm, mm, ft, in | m | in |
| Aire | m², cm², mm², ft², in² | m² | in² |
| Moment quadratique | m⁴, cm⁴, mm⁴, ft⁴, in⁴ | m⁴ | in⁴ |
| Masse | kg, lb | kg | lb |
| Force | N, kN, MN, kgf, Tonf, lbf, kip | kN | kip |
| Moment fléchissant | Nmm, Nm, kNm, MNm, Tonf·m, lbf·in, lbf·ft, kip·in, kip·ft | kNm | kip·ft |
| Contrainte (E, G) | Pa, kPa, MPa, GPa, ksc, psi, ksi, psf, ksf | MPa | ksi |
| Température | °C, °F | °C | °F |

Quelques unités découlent des autres :

- Les **charges linéiques** sont une force par unité de longueur : kN/m en SI, kip/ft en unités américaines.
- La **masse volumique** est une masse par unité de volume : kg/m³ ou lb/ft³.
- La **dilatation thermique** suit l’unité de température : 1/K ou 1/°F. Les charges thermiques sont des *variations* de température : une variation de 10 °C correspond donc à 18 °F.
- Les **rotations** sont toujours en radians, et les angles d’appui en degrés.

Tonf est la tonne-force métrique (1000 kgf), et non la *short ton* américaine. Les unités américaines utilisent leurs définitions exactes : 1 ft = 0,3048 m, 1 kip = 4448,2216 N. Saisissez les pieds en valeurs décimales, comme `5,5` ; les règles et le réticule affichent les valeurs en pieds et pouces (5′-6″).

## Paramètres d’affichage {#viewer-settings}

L’aspect du dessin. L’**Aperçu**, à droite, est une petite poutre inclinée qui montre aussitôt chaque modification ; les boutons placés dessous choisissent le résultat qu’il affiche, et modifier un paramètre de diagramme ou une couleur le fait passer sur le résultat correspondant.

![Paramètres → Paramètres d’affichage, avec l’aperçu en direct et les paramètres des diagrammes à droite](/screenshots/fr/b-settings-viewer.webp)

La colonne de gauche, de haut en bas :

- *Grille* : **Afficher la grille** (<kbd>G</kbd>) dessine la grille et les règles ; **Magnétisme à la grille** (<kbd>S</kbd>) fait s’accrocher à la grille les nœuds que vous placez ou faites glisser ; **Afficher le réticule** marque la position du pointeur sur les règles, à la souris. Les trois sont activés au départ. Le **Pas de magnétisme de la grille** vaut 0,1 m, ou 0,5 ft en unités américaines. Quand vous passez des unités métriques aux unités américaines ou inversement, un pas resté à sa valeur par défaut prend la valeur par défaut de l’autre système ; un pas que vous avez défini vous-même est conservé.
- *Tailles* : l’**Échelle des résultats**, de 8 à 120 px (48 px au départ), est la hauteur à laquelle est dessinée la plus grande ordonnée d’un diagramme, ou la plus grande flèche ; ce réglage est purement visuel, car chaque diagramme est mis à l’échelle de sa propre valeur maximale. La **Taille des appuis** va de 50 à 150 % (100 %), et la **Taille de police** de 10 à 20 px (14 px) ; des tailles plus grandes sont plus lisibles au vidéoprojecteur.
- *Orientation des étiquettes de résultats* : valeurs écrites le long de l’ordonnée, *Perpendiculaires au diagramme* (par défaut), ou *Toujours horizontales*.
- *Vérification du modèle* : **Montrer comment une structure instable peut bouger** dessine le contour en pointillés du mécanisme, et **Animer le mouvement** le fait osciller d’avant en arrière. Les deux sont activés au départ.

### Diagrammes des efforts internes {#internal-force-diagrams}

Les écoles ne dessinent pas toutes les diagrammes de la même façon : EduBeam vous laisse donc choisir. Ces paramètres ne changent que le dessin, jamais les valeurs. La **ligne en pointillés** le long de chaque élément repère sa fibre inférieure, du côté vers lequel pointe son axe z local (voir [Orientation de l’élément](/fr/essentials/elements#element-direction)).

| Paramètre | Choix | Par défaut |
| --- | --- | --- |
| **Moment fléchissant** | dessiné du *Côté tendu* ou du *Côté comprimé* | *Côté tendu* |
| **Effort tranchant positif** | dessiné du *Côté opposé* à la ligne en pointillés, ou du *Côté pointillé* | *Côté opposé* |
| **Effort normal positif** | *Côté opposé* ou *Côté pointillé* | *Côté opposé* |
| **Remplissage** | *Plein*, *Hachuré* (traits en travers de la barre, comme à la main) ou *Aucun* | *Plein* |
| **Degré de chaque tronçon** | écrit le degré du polynôme, de 0° à 3°, sur chaque tronçon d’un diagramme | désactivé |

[Résultats et diagrammes](/fr/essentials/results#reading-the-sign) explique comment lire les signes.

### Couleurs {#colors}

Des couleurs séparées pour les nœuds, les éléments, les charges, la déformée, l’effort normal, l’effort tranchant, le moment fléchissant et les réactions. Cliquez sur une pastille de couleur pour en choisir une autre. Par défaut : charges en orange, déformée en gris, N en bleu, V en vert, M en rouge, réactions en violet, nœuds et éléments en noir.

## Commandes et raccourcis {#controls-shortcuts}

**Déplacer la vue avec** définit le bouton de la souris qui sert à faire glisser la zone de dessin : *Molette ou bouton droit* (par défaut), *Molette de la souris* (appuyez sur la molette et faites glisser) ou *Bouton droit*. Tous les raccourcis se trouvent sur la page [Clavier, souris et tactile](/fr/reference/shortcuts).

## Ce qui est stocké dans votre navigateur {#what-is-stored-in-your-browser}

Outre les paramètres, EduBeam conserve dans le stockage local du navigateur :

- le **modèle courant**, enregistré après chaque modification : recharger l’onglet ou rouvrir l’application le fait revenir ;
- les **Structures récentes** : les 10 derniers modèles que vous avez effacés ou remplacés, prêts à être restaurés depuis le menu ☰.

Les deux sont propres à ce navigateur sur cet appareil, et effacer les données du site les supprime. Pour conserver un modèle ou le transférer sur un autre appareil, utilisez [Enregistrer le projet ou Partager le modèle](/fr/essentials/import-export).
