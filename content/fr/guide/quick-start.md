---
description: "En dix minutes, une poutre en acier sur deux appuis dans EduBeam : matériau, section, nœuds, appuis et charge, puis réactions et diagrammes vérifiés à la main."
source: site
---

# Démarrage rapide

En une dizaine de minutes, vous allez construire une poutre en acier sur deux appuis, lire ses réactions, son effort tranchant, son moment fléchissant et sa flèche, puis vérifier chaque valeur à la main. Ouvrez EduBeam dans un second onglet, ou à côté de cette page, et suivez pas à pas.

::div{.actions}
[Ouvrir EduBeam ↗](https://run.edubeam.app/?lang=fr){target="_blank"} [Aller à la vérification à la main](#_8-check-by-hand)
::

## L’énoncé {#the-problem}

Une poutre de 6 m repose sur une articulation au nœud 1 et sur un appui simple au nœud 2, et porte une charge uniformément répartie de 12 kN/m sur toute sa longueur. C’est un IPE 200 en acier : $E = 210$ GPa, $G = 81$ GPa, $A = 28{,}48\ \text{cm}^2$ et $I_y = 1943\ \text{cm}^4$. Ces quatre valeurs viennent des bibliothèques d’EduBeam : vous n’avez rien à chercher.

::model-figure{caption="La poutre que vous allez construire : une portée de 6 m du nœud 1 au nœud 2, sous 12 kN/m"}
---
nodes: { 1: [0, 0], 2: [6, 0] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 12 }
results: []
show: [nodeLabels, dimensions]
---
::

## Construire le modèle {#build-the-model}

::div{.steps}

### Partir d’un modèle vide {#start-from-an-empty-model}

À votre première visite, une fenêtre d’accueil vous demande comment vous souhaitez commencer. Choisissez **SI (métrique)** sous **Système d’unités**, gardez **x vers la droite, z vers le bas** sous **Système de coordonnées**, puis cliquez sur **Passer pour l’instant**. L’application affiche alors un petit portique d’exemple.

1. Cliquez sur **Effacer la structure** dans la barre de l’application (sur un téléphone, ce bouton se trouve dans le menu **☰**).
2. Cochez **Supprimer les matériaux** et **Supprimer les sections**, puis cliquez sur **Confirmer**.

La zone de dessin est maintenant vide, et deux messages rouges indiquent qu’il n’y a encore ni matériau ni section. Les étapes suivantes y remédient. Rien n’est perdu : <kbd>Ctrl</kbd>+<kbd>Z</kbd> fait revenir le portique, qui reste aussi disponible dans **☰ → Structures récentes**.

### Vérifier les unités {#_1-check-the-units}

La pastille en bas à droite de la vue indique les unités de tous les champs et de tous les résultats. Cette page utilise les unités SI, que la pastille affiche sous la forme `m m² kN kNm MPa`, avec l’axe z dirigé vers le bas. Si la pastille affiche des pieds et des kips, cliquez dessus et réglez **Système d’unités** sur **SI (métrique)**. Au même endroit, **Système de coordonnées** doit être sur **x vers la droite, z vers le bas** : avec l’axe y vers le haut, une charge positive est dirigée vers le haut, et les signes de cette page ne correspondraient plus.

![Les boutons de grille (G) et de magnétisme (S), le réticule et la pastille des unités](/screenshots/fr/ui-grid-units.webp){.shot-sm}

### Ajouter le matériau et la section {#_2-add-the-material-and-cross-section}

Chaque élément a besoin d’un matériau et d’une section : ajoutez-les d’abord, depuis les bibliothèques.

1. Ouvrez l’onglet **Matériaux** dans la barre inférieure et cliquez sur **Bibliothèque de matériaux**.
2. Cliquez sur le **+** de la ligne **Acier (S235)** ($E = 210\,000$ MPa, $G = 81\,000$ MPa). La bibliothèque reste ouverte pour d’autres ajouts : fermez-la avec **Annuler**.
3. Ouvrez l’onglet **Sections** et cliquez sur **Bibliothèque de sections**.
4. Faites défiler jusqu’à la ligne **IPE 200 (approx.)**, cliquez sur **+**, puis fermez la bibliothèque avec **Annuler**.

Les deux messages rouges ont disparu, et l’onglet **Sections** affiche l’IPE 200 :

![L’IPE 200 dans l’onglet Sections : aire, Iy, hauteur et coefficient de cisaillement](/screenshots/fr/a-qs-cross-sections.webp)

Pour saisir vos propres valeurs, utilisez plutôt **Ajouter un matériau** et **Ajouter une section**. Le coefficient de cisaillement, ici 0,3933, revient dans la [vérification à la main](#_8-check-by-hand).

### Ajouter les nœuds {#_3-add-the-nodes}

1. Ouvrez l’onglet **Nœuds**. Il comporte deux boutons **Ajouter un nœud** : **+** ouvre une boîte de dialogue, et celui qui porte l’icône du curseur place les nœuds à la souris. Cliquez sur **+ Ajouter un nœud**.
2. Laissez **Coordonnée X** et **Coordonnée Z** à `0` et cliquez sur **Ajouter un nœud**. La boîte de dialogue se ferme et le nœud `1` apparaît.
3. Cliquez de nouveau sur **+ Ajouter un nœud**, saisissez `6` dans **Coordonnée X** et cliquez sur **Ajouter un nœud**. C’est le nœud `2`.

![La boîte de dialogue Ajouter un nouveau nœud. Elle permet aussi de définir directement les appuis.](/screenshots/fr/qs-node.webp){.shot-md}

### Les relier par un élément {#_4-connect-them-with-an-element}

Ouvrez l’onglet **Éléments** et cliquez sur **+ Ajouter un élément**. La boîte de dialogue propose déjà **Nœud initial** `1`, **Nœud final** `2`, ainsi que votre matériau et votre section. Cliquez sur **Ajouter un élément**.

![Ajouter un nouvel élément : les deux nœuds d’extrémité, une rotule facultative à chaque extrémité, le matériau et la section](/screenshots/fr/a-qs-element.webp){.shot-md}

Une poutre apparaît entre les nœuds. Appuyez sur <kbd>F</kbd> pour l’ajuster à l’écran. Une pastille bleue **Appuis manquants**, en haut à gauche de la vue, indique pourquoi il n’y a pas encore de résultats.

### Ajouter les appuis {#_5-add-the-supports}

De retour dans l’onglet **Nœuds**, chaque ligne commence, dans la colonne **DDL bloqués**, par un sélecteur d’appui.

- Nœud `1` : choisissez **Rotule** (l’appui articulé). Cela coche `Dx` et `Dz`.
- Nœud `2` : choisissez **Appui simple**. Cela coche seulement `Dz`.

![Le sélecteur d’appui dans le tableau des nœuds](/screenshots/fr/a-qs-support-picker.webp){.shot-lg}

La pastille **Appuis manquants** disparaît. Vous pouvez aussi cliquer sur un nœud dans la vue et choisir **Appuis du nœud**. La page [Nœuds et appuis](/fr/essentials/nodes-supports#supports) présente tous les types d’appuis.

### Ajouter la charge {#_6-add-the-load}

1. Ouvrez l’onglet **Charges** et cliquez sur **Ajouter une charge d’élément**.
2. Gardez **Type de charge** sur *Charge uniformément répartie* et **Élément** sur `1`.
3. Saisissez `12` dans **fz**, laissez **fx** à `0` et cliquez sur **Ajouter une charge d’élément**.

![La boîte de dialogue montre un aperçu de la charge sur l’élément](/screenshots/fr/a-qs-load.webp){.shot-md}

Un `fz` positif est orienté selon +z, c’est-à-dire **vers le bas** : une valeur positive correspond donc à une charge de pesanteur. La case **LCS** cochée signifie que la charge suit les axes propres de l’élément (son repère local, SCL) ; pour une poutre horizontale dessinée de gauche à droite, ils coïncident avec les axes globaux. Voir [Repère et conventions de signes](/fr/elements/conventions#loads).

::

## Lire les résultats {#_7-read-the-results}

La poutre est calculée dès que la charge est en place, puis de nouveau après chacune de vos modifications : il n’y a pas de bouton *Calculer*. Le panneau en haut à droite de la vue affiche ou masque les dessins. **Déformée**, **M<sub>y</sub>(x)** et **Réactions** sont activés dès le départ. Cochez **V<sub>z</sub>(x)** pour ajouter l’effort tranchant.

![Les options d’affichage, avec l’effort tranchant activé](/screenshots/fr/a-qs-display.webp){.shot-md}

Votre écran doit maintenant ressembler à cette figure. Passez du moment fléchissant à l’effort tranchant :

::model-figure{caption="La poutre terminée : réactions de 36 kN et 54 kNm à mi-portée"}
---
nodes: { 1: [0, 0], 2: [6, 0] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 12 }
results: [M, V]
show: [nodeLabels]
---
::

| Dessin | Ce que vous devez voir |
| --- | --- |
| **Réactions** | Deux flèches vers le haut de **36 kN**, une à chaque appui. |
| **V<sub>z</sub>(x)** | Une droite allant de **+36 kN** au nœud `1` à **−36 kN** au nœud `2`, qui s’annule à mi-portée. |
| **M<sub>y</sub>(x)** | Une parabole dont le maximum, **54 kNm**, est à mi-portée, dessinée du côté tendu, sous la poutre. |
| **Déformée** | Un fléchissement symétrique, dessiné à une échelle amplifiée. |

Pour les valeurs, ouvrez l’onglet **Résultats**. **Résultats nodaux** donne les déplacements `Dx`, `Dz` et la rotation `Ry` de chaque nœud, et **Résultats par élément** les efforts aux extrémités de chaque élément dans son repère local. Le nœud `1` tourne de $R_y = -2{,}6469 \cdot 10^{-2}$ rad, et le nœud `2` de la même valeur en sens inverse. La page [Résultats et diagrammes](/fr/essentials/results) explique chaque tableau et chaque signe.

Si les diagrammes paraissent trop grands ou trop petits, modifiez **Échelle des résultats** dans **Paramètres → Paramètres d’affichage**.

## Vérifier à la main {#_8-check-by-hand}

Avec $q = 12$ kN/m et $L = 6$ m, les formules des manuels donnent :

| Grandeur | Formule | À la main | EduBeam |
| --- | --- | --- | --- |
| Réactions | $qL/2$ | 36 kN | 36 kN |
| Effort tranchant maximal | $qL/2$ | 36 kN | 36 kN |
| Moment maximal | $qL^2/8$ | 54 kNm | 54 kNm |
| Rotation sur appui | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Flèche à mi-portée | $w_b + w_s$ | 49,63 + 0,60 = 50,22 mm | 50,22 mm |

La flèche a deux composantes, et la plupart des manuels ne donnent que la première :

- **Flexion :** $w_b = 5qL^4/(384EI) = 49{,}63$ mm, avec $EI = 4080$ kNm² obtenu à partir de $E = 210$ GPa et $I_y = 1943\ \text{cm}^4$.
- **Effort tranchant :** $w_s = qL^2/(8kGA) = 0{,}60$ mm, avec $kGA \approx 90\,700$ kN obtenu à partir de $k = 0{,}3933$, $G = 81$ GPa et $A = 28{,}48\ \text{cm}^2$.

Il n’y a pas encore de nœud à mi-portée : ajoutez-en un pour y lire la flèche.

1. Dans l’onglet **Nœuds**, cliquez sur le second bouton **Ajouter un nœud**, celui qui porte l’icône du curseur.
2. Cliquez sur la poutre en `x = 3` ; avec le magnétisme activé, le nœud se place sur la grille. EduBeam demande quoi faire de ce nœud : cliquez sur **Connecter à la structure**. L’élément est scindé en `1a` et `1b`, sa charge avec lui, et le placement de nœuds s’arrête. Si le nœud `3` n’est pas à X = `3` dans l’onglet **Nœuds**, saisissez-y `3`.
3. Dans **Résultats → Résultats nodaux**, le nœud `3` affiche maintenant $D_z = 5{,}0224 \cdot 10^{-2}$ m, soit 50,22 mm.

![Résultats nodaux après la scission : le nœud 3 descend de 50,22 mm](/screenshots/fr/a-qs-nodal-results.webp){.shot-lg}

Scinder la poutre ne change aucun résultat, car l’élément est exact pour ces charges : il n’y a pas de maillage à raffiner.

::callout{type="details" title="Pourquoi le coefficient de cisaillement compte-t-il ?"}
EduBeam utilise des éléments poutre de Timoshenko, qui prennent en compte la déformation d’effort tranchant. Le coefficient de cisaillement $k$ réduit l’aire qui reprend l’effort tranchant : $kGA$ est la rigidité au cisaillement. Pour les profilés en I de la bibliothèque, $k$ est la part de l’âme dans l’aire, $h t_w / A$ : pour l’IPE 200, $0{,}2 \cdot 0{,}0056 / 0{,}002848 = 0{,}3933$. La part d’effort tranchant de la flèche, $w_s = qL^2/(8kGA)$, est l’intégrale de $V/(kGA)$ entre un appui et la mi-portée.

Pour cette poutre élancée, la part d’effort tranchant vaut 0,60 mm, environ 1 % du total. Dans une poutre courte et haute, elle est bien plus grande. Donnez au coefficient de cisaillement une très grande valeur (`1e10`, par exemple) dans l’onglet **Sections**, et EduBeam renvoie les 49,63 mm de la flexion seule. La page [Élément poutre](/fr/elements/beam) présente la théorie.
::

D’autres méthodes de vérification à la main (console, poutre bi-encastrée, treillis, température, tassement d’appui) se trouvent dans [Vérifier les résultats à la main](/fr/guide/verification).

## Expérimenter {#_9-experiment}

Modifiez le modèle et regardez les diagrammes suivre. Essayez chaque modification séparément, et annulez-la avec <kbd>Ctrl</kbd>+<kbd>Z</kbd> avant la suivante. Le nœud `3` est le nœud de mi-portée que vous venez d’ajouter.

- **Faites glisser le nœud `2`** vers la droite. Le moment croît comme $L^2$ et la flèche comme $L^4$.
- **Cochez `Ry` au nœud `1`** pour encastrer cette extrémité. Un moment négatif apparaît à l’encastrement : $qL^2/8 = 54$ kNm d’après la formule du manuel, 53,8 kNm dans EduBeam. Dans une poutre hyperstatique, la rigidité au cisaillement modifie aussi les efforts.
- **Cochez `Dz` au nœud `3`** pour ajouter un appui intermédiaire et obtenir une poutre continue à deux travées. Le moment sur l’appui central devient négatif : $q(L/2)^2/8 = 13{,}5$ kNm à la main, 13,3 kNm dans EduBeam, pour la même raison.
- **Cochez `Dz` au nœud `3`, ainsi que la seconde case de la colonne *Rotules d’extrémité* de l’élément `1a`** (son extrémité au nœud `3`) dans l’onglet **Éléments**. La poutre se transforme en deux travées indépendantes de 3 m, chacune sur deux appuis. Décochez maintenant `Dz` au nœud `3` : la poutre devient un mécanisme, et EduBeam montre comment elle peut bouger.

Pour faire varier la portée et la charge sans rien construire, déplacez les curseurs ci-dessous, et passez d’un résultat à l’autre pour voir comment chacun croît avec la portée.

::example-structure
::

## Enregistrer ou partager {#_10-save-or-share}

- **L’envoyer à quelqu’un.** Cliquez sur **Partager le modèle** dans la barre de l’application, puis sur **Copier**. Le lien contient tout le modèle, et quiconque l’ouvre obtient sa propre copie modifiable.
- **Le garder dans un fichier.** **☰ → Enregistrer le projet** (<kbd>Ctrl</kbd>+<kbd>S</kbd>) télécharge un `project.json`. Rouvrez-le avec **☰ → Ouvrir le projet** (<kbd>Ctrl</kbd>+<kbd>O</kbd>) ou en le déposant sur l’application.
- **Mettre le dessin dans un rapport.** **☰ → Exporter une image** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) l’enregistre en PNG ou SVG.

Le modèle est aussi conservé dans votre navigateur : recharger la page ne le fait pas disparaître. Les détails sont dans [Fichiers, liens et export](/fr/essentials/import-export).

## Pour aller plus loin {#where-next}

::card-grid{cols="2"}
:::card{title="Tutoriels" icon="lucide:graduation-cap" to="/fr/tutorials/inclined-beam"}
Quatre modèles construits pas à pas et vérifiés à la main, de la poutre inclinée à la poutre continue avec tassement d’appui.
:::
:::card{title="Exemples" icon="lucide:library" to="/fr/examples/"}
Des poutres, portiques et treillis prêts à l’emploi qui s’ouvrent en un clic, avec exercices et réponses.
:::
:::card{title="Charges" icon="lucide:arrow-down-to-line" to="/fr/essentials/loads"}
Charges trapézoïdales, ponctuelles et thermiques, forces nodales et tassements d’appui.
:::
:::card{title="Clavier, souris et tactile" icon="lucide:keyboard" to="/fr/reference/shortcuts"}
Dessinez nœuds et éléments directement dans la zone de dessin, et travaillez plus vite.
:::
::
