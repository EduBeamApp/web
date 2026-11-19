---
description: "Placer et modifier des nœuds dans EduBeam, scinder des éléments et choisir l’appui : articulation, appui simple, encastrement, glissière, appui incliné."
source: site
---

# Nœuds et appuis

Les nœuds sont les points du modèle : les éléments les relient, et les appuis et les charges nodales s’y appliquent. Placez-les en saisissant leurs coordonnées ou d’un clic, puis donnez aux nœuds d’appui le type d’appui qui correspond à votre schéma.

## Coordonnées {#coordinates}

Chaque nœud a une coordonnée **X** et une coordonnée **Z** dans l’[unité de longueur](/fr/essentials/units-settings#units) courante. L’axe x pointe vers la droite et l’**axe z vers le bas** : tout ce qui se trouve au-dessus du sol a donc un Z négatif. Un poteau de 4 m de haut va de `Z = 0` à `Z = −4`.

::model-figure{caption="Un portique de 6 m de large et 4 m de haut : A et D sont à Z = 0, B et C à Z = −4"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: fixed, D: fixed }
members: [[A, B], [B, C], [C, D]]
results: []
show: [nodeLabels, dimensions]
---
::

Si vous préférez un axe vertical orienté vers le haut, passez aux [axes y vers le haut](/fr/elements/conventions#y-up-axes) dans les Paramètres. Seul l’affichage change ; le modèle et ses fichiers restent les mêmes.

## Ajouter des nœuds {#adding-nodes}

- **Par saisie.** Onglet *Nœuds* → **Ajouter un nœud** (le bouton à l’icône **+**), ou clic droit sur la zone de dessin → *Ajouter un nœud*. Saisissez X et Z, et si besoin les appuis et l’angle d’appui.
- **D’un clic.** Onglet *Nœuds* → **Ajouter un nœud** (le bouton à l’icône de curseur), ou maintenez <kbd>Ctrl</kbd> enfoncée en choisissant *Ajouter un nœud* dans le menu contextuel. Chaque clic place un nœud ; appuyez sur <kbd>Échap</kbd>, sur **Annuler** ou à nouveau sur le bouton pour arrêter.
- **En dessinant des éléments.** Quand vous [dessinez des éléments à la souris](/fr/essentials/elements#adding-elements), un clic sur une zone vide y crée un nœud.
- **Par copie.** Sélectionnez des nœuds (et des éléments), appuyez sur <kbd>Ctrl</kbd>+<kbd>C</kbd> puis <kbd>Ctrl</kbd>+<kbd>V</kbd>, et cliquez là où la copie doit aller, ou saisissez un décalage Δx, Δz dans le bandeau et appuyez sur **Coller**.

::div{.shots}

![La boîte de dialogue Ajouter un nœud](/screenshots/fr/qs-node.webp)

![En mode souris, le bandeau en haut définit les appuis et l’angle de chaque nœud que vous placez](/screenshots/fr/nodes-add-banner.webp)

::

Chaque nouveau nœud reçoit le premier numéro libre : `1`, `2`, `3`, etc. Vous pouvez renommer n’importe lequel dans la colonne *Nœud* du tableau, par exemple en `A`, `B`, `C`.

### Magnétisme {#snapping}

Lorsque le **Magnétisme à la grille** est activé (touche <kbd>S</kbd>, ou la pastille **S** en bas à droite de la vue), les nœuds que vous placez ou faites glisser s’accrochent à la grille. Le pas vaut 0,1 m par défaut, ou 0,5 ft en unités américaines ; modifiez-le dans [Paramètres → Paramètres d’affichage → Grille](/fr/essentials/units-settings#viewer-settings). Pour toute autre position, saisissez les coordonnées exactes dans le tableau.

### Placer un nœud sur un élément existant {#placing-a-node-on-an-existing-element}

Si vous cliquez sur un élément (ou tout près) en ajoutant des nœuds à la souris, EduBeam vous demande ce que vous voulez faire :

- **Connecter à la structure** scinde l’élément en deux, `1a` et `1b`, qui se rejoignent au nouveau nœud. C’est le moyen le plus rapide d’ajouter un appui intermédiaire ou un point où appliquer une charge. Les rotules des extrémités extérieures restent en place. Les charges uniformes et trapézoïdales sont réparties entre les deux moitiés. Les charges ponctuelles et thermiques vont toutes à la première moitié, `1a` : dans le tableau *Charges*, reportez sur `1b` une charge ponctuelle qui se trouvait au-delà du nouveau nœud (sa position se compte désormais depuis ce nœud), et donnez à `1b` sa propre charge thermique.
- **Placer un nœud isolé** pose le nœud par-dessus l’élément sans le relier.

Dans les deux cas, le placement des nœuds s’arrête là ; cliquez de nouveau sur le bouton à l’icône de curseur pour en placer d’autres.

## Modifier les nœuds {#editing-nodes}

| Pour | Faites ceci |
| --- | --- |
| Déplacer un nœud | Faites-le glisser dans la vue (sur écran tactile, appuyez dessus et faites glisser), ou saisissez X et Z dans le tableau *Nœuds*. Les éléments reliés, leurs charges et les lignes de cote suivent. |
| Le renommer | Saisissez une nouvelle étiquette dans la colonne *Nœud*. |
| Changer ses appuis | Cliquez dessus → **Appuis du nœud**, ou utilisez la colonne *DDL bloqués*. Voir [Appuis](#supports). |
| Tout modifier d’un coup | Le crayon de la colonne *Actions* ouvre **Modifier le nœud** : coordonnées, appuis et angle d’appui, avec un aperçu du symbole. |
| Le supprimer | Le × du tableau, **Supprimer** dans le panneau du nœud, ou sélectionnez-le et appuyez sur <kbd>Suppr</kbd>. Les éléments, les charges et les lignes de cote qui y sont attachés disparaissent avec lui. |

Toute modification s’annule avec <kbd>Ctrl</kbd>+<kbd>Z</kbd>.

## Appuis {#supports}

Chaque nœud peut bouger de trois façons, ses **degrés de liberté** (DDL) : `Dx` selon x, `Dz` selon z, et `Ry`, une rotation dans le plan du dessin. Un appui en **bloque** certains.

Les huit appuis sont les huit combinaisons possibles de ces trois DDL. Lisez le tableau ligne par ligne : dans la colonne du milieu, le nœud tourne librement ; dans celle de droite, sa rotation est aussi bloquée.

| Translations bloquées | Rotation libre | Rotation bloquée aussi |
| --- | --- | --- |
| **Les deux** (`Dx` et `Dz`) | ![](/screenshots/fr/b-support-pin.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Rotule** | ![](/screenshots/fr/b-support-fixed.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Encastrement** |
| **Verticale seule** (`Dz`) : glisse horizontalement | ![](/screenshots/fr/b-support-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Appui simple** | ![](/screenshots/fr/b-support-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Glissière** |
| **Horizontale seule** (`Dx`) : glisse verticalement | ![](/screenshots/fr/b-support-vertical-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Appui simple vertical** | ![](/screenshots/fr/b-support-vertical-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Glissière verticale** |
| **Aucune** : glisse dans les deux directions | ![](/screenshots/fr/b-support-free.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Libre** (pas d’appui) | ![](/screenshots/fr/b-support-rotation-only.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Rotation bloquée seule** |

Pour chaque DDL bloqué, EduBeam calcule une **réaction d’appui** : `Dx` donne une force horizontale $R_x$, `Dz` une force verticale $R_z$, `Ry` un moment $M$. Une articulation donne donc $R_x$ et $R_z$, un appui simple seulement $R_z$, une glissière $R_z$ et $M$, et un encastrement les trois.

### Définir un appui {#setting-a-support}

Choisissez le symbole, ou cochez les DDL un par un ; les deux restent toujours synchronisés. Vous les trouverez à trois endroits :

- dans le panneau du nœud (cliquez sur le nœud) → **Appuis du nœud**, avec l’**Angle du SCL nodal**, comme ci-dessous ;
- dans les boîtes de dialogue **Ajouter un nœud** et **Modifier le nœud** ;
- dans la colonne *DDL bloqués* du tableau *Nœuds*, où le symbole est un petit menu et `Dx`, `Dz`, `Ry` des cases à cocher.

![Appuis du nœud dans le panneau du nœud : les symboles, les cases des DDL et l’angle d’appui](/screenshots/fr/nodes-support-picker.webp){.shot-lg}

Pointez un symbole pour voir son nom.

### Appui simple ou glissière ? {#roller-or-slider}

Tous deux reposent sur des rails et glissent le long de ceux-ci. La différence tient à la rotation :

- un **appui simple** est une articulation sur rails : l’extrémité **tourne librement**, il n’y a donc pas de moment à cet endroit ;
- une **glissière** est un encastrement sur rails : l’extrémité **ne peut pas tourner**, l’appui reprend donc un moment.

La même poutre de 6 m sous 10 kN/m, dont seul l’appui de droite change. Basculez entre la déformée et le moment fléchissant :

::div{.shots}

:::model-figure{caption="Articulation et appui simple : l’extrémité droite tourne librement ; M = 0 à cet endroit, 30 kN à chaque appui"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

:::model-figure{caption="Articulation et glissière : l’extrémité droite reste horizontale ; M = −45 kNm à cet endroit, 37,5 kN à la glissière"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: slider }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

::

La première est une poutre sur deux appuis ($M_{max} = qL^2/8 = 45\ \text{kNm}$ à mi-portée). Sous charge verticale, la glissière se comporte exactement comme un encastrement, si bien que la seconde est une poutre encastrée-appuyée ($R_B = 5qL/8 = 37{,}5\ \text{kN}$, $M_B = -qL^2/8 = -45\ \text{kNm}$). Maintenir l’extrémité horizontale rend aussi la poutre plus rigide : la flèche maximale passe de 9,617 mm à 4 mm. La glissière ne se distingue d’un encastrement que si quelque chose pousse le long de ses rails.

### Appuis inclinés {#inclined-skewed-supports}

Un appui sur une pente bloque le nœud selon des axes tournés. Définissez l’**Angle du SCL nodal** α, en degrés de −180 à 180, dans le panneau du nœud sous *Appuis du nœud*, dans les boîtes de dialogue d’ajout et de modification du nœud, ou dans le champ **α** du tableau *Nœuds*.

Les axes du nœud tournent de α, et les DDL cochés agissent selon ces axes. α fait tourner x vers z, c’est-à-dire dans le **sens horaire** à l’écran (avec les axes y vers le haut, il fait tourner x vers y, dans le sens antihoraire). Un appui simple sur une surface qui descend de 30° vers la droite est donc un appui simple avec α = 30°. Le symbole tourne avec les axes, et la réaction est donnée selon ces axes.

::model-figure{caption="Appui simple en B tourné de α = 30° : sa réaction de 34,64 kN est perpendiculaire à la pente, et la poutre reprend N = +17,32 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [N, M]
show: [nodeLabels]
---
::

C’est la même poutre que plus haut, 6 m sous 10 kN/m, mais son appui simple repose maintenant sur une pente de 30°. La composante verticale de la réaction en B vaut toujours $qL/2 = 30\ \text{kN}$ ; la réaction elle-même vaut donc $30/\cos 30° = 34{,}64\ \text{kN}$, et sa composante horizontale, $30 \tan 30° = 17{,}32\ \text{kN}$, pousse B vers la droite. L’articulation en A le retient, si bien que la poutre est tendue. Le moment fléchissant ne change pas.

Les [charges nodales](/fr/essentials/loads#nodal-loads) sur un nœud tourné peuvent être données dans les axes globaux ou dans les axes du nœud ; un [déplacement imposé](/fr/essentials/loads#prescribed-displacements-support-settlements) agit toujours selon les axes propres de l’appui.

### Stabilité {#stability}

Une structure plane a besoin d’au moins **trois DDL bloqués**, disposés de façon à la tenir réellement. Tant qu’il manque des appuis, la vue affiche une pastille bleue **Appuis manquants**. S’ils sont assez nombreux mais ne peuvent pas tenir la structure (tous parallèles, ou tous concourants en un point), ou si des rotules permettent à des barres de tourner les unes par rapport aux autres, un message rouge nomme le problème et un contour en pointillés montre comment la structure se déplace. La page [Dépannage](/fr/reference/troubleshooting#messages) explique chaque message.

## Charges nodales et tassements {#nodal-loads-and-settlements}

Cliquez sur un nœud → **Ajouter une charge** pour une force ou un moment, ou → **Imposer un déplacement** pour déplacer un appui d’une valeur donnée (un tassement d’appui). Les deux sont expliqués dans [Charges nodales](/fr/essentials/loads#nodal-loads).

## Lignes de cote {#dimension-lines}

Les lignes de cote indiquent des longueurs sur le dessin. Elles n’influent pas sur le calcul, mais elles sont enregistrées avec le projet, transmises dans les liens de partage et reprises dans les [images exportées](/fr/essentials/import-export#export-an-image).

| Pour | Faites ceci |
| --- | --- |
| En ajouter une | Clic droit sur la zone de dessin → **Ajouter une cote**, puis cliquez sur les deux extrémités. Un point proche d’un nœud s’y accroche. |
| Coter un élément | Clic droit sur l’élément → **Coter l’élément**. |
| La modifier ou l’inverser | Cliquez sur la ligne → **Modifier** pour saisir ses coordonnées, ou **Inverser la cote** pour placer l’étiquette de l’autre côté. |
| La déplacer | Faites-la glisser, ou faites glisser une extrémité. Une extrémité posée sur un nœud y reste attachée et le suit. |
