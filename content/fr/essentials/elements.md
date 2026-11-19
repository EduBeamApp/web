---
description: "Dessiner des éléments dans EduBeam, libérer leurs extrémités par des rotules pour modéliser articulations et barres de treillis, définir matériaux et sections."
source: site
---

# Éléments, matériaux et sections

Dans [EduBeam]{.edubeam}, chaque élément est une poutre entre deux nœuds, avec un matériau et une section. Dessinez les éléments entre les nœuds, libérez leurs extrémités par des rotules là où la structure est articulée, et choisissez matériaux et sections dans les bibliothèques ou définissez les vôtres.

## L’élément poutre {#the-beam-element}

Il n’existe qu’un type d’élément : une **poutre de Timoshenko 2D** dans le plan x–z, avec trois degrés de liberté à chaque extrémité (`Dx`, `Dz`, `Ry`). Il reprend l’effort normal, l’effort tranchant et le moment fléchissant, et tient compte de la [déformation d’effort tranchant](#shear-deformation). Une barre de treillis est ce même élément avec [ses deux extrémités articulées](#end-hinges). La formulation se trouve dans le [manuel théorique](/fr/elements/beam).

Les résultats le long d’un élément sont exacts pour le modèle linéaire : **un seul élément par barre suffit**. N’ajoutez un nœud à l’intérieur d’une barre que là où il vous faut un appui, une rotule, un changement de section ou un point où lire les déplacements. Une force concentrée n’en a pas besoin : une [charge ponctuelle](/fr/essentials/loads#concentrated-load) peut se placer n’importe où le long d’un élément.

## Ajouter des éléments {#adding-elements}

Un élément a besoin d’un matériau et d’une section : ajoutez-les d’abord (voir [Matériaux](#materials) et [Sections](#cross-sections)). Tant qu’il n’y en a pas, la vue affiche *Aucun matériau défini.* ou *Aucune section définie.*, avec un bouton **Ajouter**.

- **En choisissant les nœuds.** Onglet *Éléments* → **Ajouter un élément** (le bouton à l’icône **+**), ou clic droit sur la zone de dessin → *Ajouter un élément*. Choisissez le **Nœud initial** et le **Nœud final**, cochez si besoin **Rotule** sous l’un ou l’autre, et choisissez le **Matériau** et la **Section**. Il faut au moins deux nœuds.
- **D’un clic.** Onglet *Éléments* → **Ajouter un élément** (le bouton à l’icône de curseur), ou maintenez <kbd>Ctrl</kbd> enfoncée en choisissant *Ajouter un élément* dans le menu contextuel. Cliquez sur un nœud (ou sur une zone vide, ce qui en crée un), puis sur le suivant ; continuez à cliquer pour dessiner une chaîne d’éléments, et appuyez sur <kbd>Échap</kbd> ou sur **Annuler** pour terminer. Le bandeau en haut définit **Rotule au début** et **Rotule à la fin** pour chaque élément que vous dessinez. Les éléments reçoivent le premier matériau et la première section du modèle.

![La boîte de dialogue Ajouter un élément](/screenshots/fr/qs-element.webp){.shot-md}

## Orientation de l’élément {#element-direction}

Chaque élément a ses propres **axes locaux**. L’axe x local va du **nœud initial** au **nœud final** ; l’axe z local est l’axe x local tourné de 90° dans le sens horaire à l’écran. Sur un élément dessiné de gauche à droite, les axes locaux sont les axes globaux. La **ligne en pointillés** tracée le long de chaque élément marque son côté +z local, la « fibre inférieure ».

![Un portique dessiné A → B → C → D : les lignes en pointillés des trois éléments sont toutes à l’intérieur du portique](/screenshots/fr/p2b-element-direction.webp){.shot-md}

Dans ce portique, l’élément 1 monte de A vers B : son axe z local, et donc sa ligne en pointillés, pointe vers la droite ; l’élément 3 descend de C vers D : sa ligne en pointillés est à gauche. Dessinées ainsi, les lignes en pointillés d’un portique tombent toutes à l’intérieur.

L’orientation compte pour :

- les charges données dans le repère local (case **LCS** cochée), voir [Charges d’élément](/fr/essentials/loads#element-loads) ;
- la **Position de la charge depuis le nœud initial** d’une charge ponctuelle ;
- l’ordre des [efforts aux extrémités](/fr/elements/conventions#end-forces-element-results-table) dans les résultats : `X12, Z12, M12` au nœud initial, `X21, Z21, M21` au nœud final ;
- le côté considéré comme « côté pointillé » dans les [paramètres des diagrammes](/fr/essentials/units-settings#viewer-settings).

Pour inverser un élément, appuyez sur **Inverser les nœuds** (les flèches entre les deux nœuds dans le tableau *Éléments*).

## Rotules d’extrémité {#end-hinges}

Une rotule d’extrémité libère le moment fléchissant à une extrémité d’un élément : le moment y est nul, et l’extrémité peut tourner indépendamment du nœud.

- **Une rotule** crée une articulation à l’intérieur d’une poutre ou d’un portique.
- **Deux rotules** font une **barre de treillis**, qui ne reprend que l’effort normal.

Cochez-les à l’un de ces endroits :

- la colonne **Rotules d’extrémité** du tableau *Éléments*, une case pour chaque extrémité ;
- les cases **Rotule** de la boîte de dialogue **Ajouter un élément**, ou dans le panneau de l’élément → **Modifier l’élément** ;
- **Rotule au début** et **Rotule à la fin** dans le bandeau, quand vous dessinez à la souris.

![Le tableau Éléments d’un portique à trois articulations : l’élément 2 a une rotule à son nœud final, C](/screenshots/fr/elements-table.webp)

### Une rotule : une articulation dans la structure {#one-hinge-a-pin-inside-the-structure}

La même poutre continue, deux travées de 5 m sous 10 kN/m. À droite, l’élément 1 a une rotule d’extrémité en B : le moment sur appui tombe à zéro, et chaque travée porte sa charge comme une poutre sur deux appuis.

::div{.shots}

:::model-figure{caption="Poutre continue : M = −31,25 kNm sur l’appui B"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M]
show: [nodeLabels]
---
:::

:::model-figure{caption="Rotule en B : M = 0 sur l’appui B, 31,25 kNm dans chaque travée"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [{ nodes: [A, B], hinges: [false, true] }, [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M]
show: [nodeLabels]
---
:::

::

À la main : pour la poutre continue, $M_B = -qL^2/8 = -31{,}25\ \text{kNm}$ et au plus $9qL^2/128 = 17{,}58\ \text{kNm}$ dans chaque travée ; avec la rotule, $M_B = 0$ et $M_{max} = qL^2/8 = 31{,}25\ \text{kNm}$ à chaque mi-travée. La rotule soulage l’appui, mais double presque les moments en travée. Pour calculer à la main une poutre avec une rotule intérieure, avec vérification de vos réponses au fil de la saisie, essayez l’[exercice G2048](/fr/practice?p=G2048).

### Deux rotules : une barre de treillis {#both-hinges-a-truss-bar}

Une potence murale formée de deux barres, articulées chacune à ses deux extrémités, porte 20 kN en B. Les barres ne reprennent que l’effort normal, et le diagramme des moments est vide.

::model-figure{caption="Tirant AB : N = +26,67 kN (traction) ; barre comprimée CB : N = −33,33 kN (compression)"}
---
nodes: { A: [0, 0], B: [4, 0], C: [0, 3] }
supports: { A: pin, C: pin }
members: [{ nodes: [A, B], hinges: [true, true] }, { nodes: [C, B], hinges: [true, true] }]
loads:
  - { node: B, fz: 20 }
results: [N, M]
show: [nodeLabels]
---
::

À la main : la barre comprimée mesure 5 m et s’élève de 3 m, donc $N_{CB} = -20 \cdot 5/3 = -33{,}33\ \text{kN}$, et le tirant équilibre sa composante horizontale, $N_{AB} = 33{,}33 \cdot 4/5 = 26{,}67\ \text{kN}$. Le [tutoriel sur le treillis plan](/fr/tutorials/truss) construit tout un treillis de cette façon, et la page [Exercices d’entraînement](/fr/practice?p=T2048) propose des treillis à calculer à la main.

### Articulez l’élément, pas le nœud {#hinge-the-element-not-the-node}

Une rotule appartient à une extrémité d’un élément : elle laisse cette extrémité tourner seule, tandis que tous les autres éléments du nœud y restent liés rigidement. Là où deux barres se rejoignent, une seule rotule suffit donc à faire une articulation ; là où plusieurs se rejoignent, articulez-les toutes sauf une. Dans un nœud de treillis, où toutes les barres sont des barres de treillis, elles sont toutes articulées.

Un nœud où tous les éléments sont articulés n’a aucune rigidité en rotation. EduBeam l’accepte et indique une rotation nulle. Si des rotules font de la structure un mécanisme, EduBeam les entoure et montre comment elle se déplace ; voir [Dépannage](/fr/reference/troubleshooting#messages).

## Modifier et supprimer {#editing-and-deleting}

| Pour | Faites ceci |
| --- | --- |
| Changer les nœuds, les rotules, le matériau ou la section | Cliquez sur l’élément → **Modifier l’élément**, ou modifiez-le dans le tableau *Éléments*. |
| L’inverser | **Inverser les nœuds** dans le tableau *Éléments*. |
| Le renommer | Saisissez une nouvelle étiquette dans la colonne *Élément*. |
| Voir sa matrice de rigidité | Cliquez dessus → **Matrice de rigidité**, ou le bouton de la matrice dans la colonne *Actions*. Une fenêtre affiche la matrice 6 × 6 de l’élément en axes globaux, en unités SI (N et m) quelles que soient les unités affichées, avec les rotules d’extrémité déjà condensées. Pratique pour vérifier un assemblage fait à la main. |
| Le supprimer | Cliquez dessus → **Supprimer**, le × du tableau, ou sélectionnez-le et appuyez sur <kbd>Suppr</kbd>. Ses charges disparaissent avec lui. |

![Le panneau d’un élément](/screenshots/fr/ui-element-menu.webp){.shot-xs}

## Matériaux {#materials}

Onglet *Matériaux* → **Ajouter un matériau**, ou **Bibliothèque de matériaux** pour un matériau prêt à l’emploi. Plusieurs éléments peuvent partager un même matériau ; le modifier les met tous à jour.

| Champ | Unité | Rôle |
| --- | --- | --- |
| Module d’Young $E$ | MPa | Rigidité axiale et rigidité en flexion, $EA$ et $EI_y$. Acier 210 000 MPa, béton environ 30 000 MPa, bois environ 11 000 MPa. |
| Module de cisaillement $G$ | MPa | Rigidité à l’effort tranchant $kGA$. Sauf si le $k$ de la section est énorme, il ajoute la [déformation d’effort tranchant](#shear-deformation) : des flèches plus grandes et, dans une structure hyperstatique, d’autres efforts internes. $G = E/(2(1+\nu))$ : acier environ 81 000 MPa. |
| Masse volumique $\rho$ (champ *Densité*) | kg/m³ | Enregistrée avec le matériau, mais pas utilisée : il n’y a pas de charge de poids propre. |
| Coefficient de dilatation thermique $\alpha$ | 1/K | Utilisé par les [charges thermiques](/fr/essentials/loads#temperature-load). Acier $12 \times 10^{-6}$ 1/K. |

Ces unités sont les unités SI par défaut ; elles suivent vos [paramètres](/fr/essentials/units-settings#units), si bien qu’en unités américaines E et G sont en ksi, la masse volumique en lb/ft³ et α en 1/°F.

Un nouveau matériau reçoit par défaut $E$ = 210 000 MPa, $G$ = 87 500 MPa ($E/2{,}4$, soit $\nu = 0{,}2$), $\rho$ = 1000 kg/m³ et $\alpha = 12 \times 10^{-6}$ 1/K ; en unités américaines, c’est un acier ASTM A992. Pour de l’acier, ramenez $G$ à 81 000 MPa ou choisissez un acier dans la bibliothèque.

![La boîte de dialogue Ajouter un matériau](/screenshots/fr/qs-material.webp){.shot-md}

La **Bibliothèque de matériaux** (aussi *Ou choisir dans la bibliothèque* dans la boîte de dialogue Ajouter un matériau) liste d’abord les matériaux métriques (EN), ou d’abord les matériaux américains (aciers ASTM, bétons ACI) quand vos longueurs sont en pieds ou en pouces. Le **+** d’une ligne ajoute ce matériau, sous son nom :

| Famille | Matériaux |
| --- | --- |
| Métaux | Acier S235, S275, S355 ; acier inoxydable 304, 316 ; fonte ; aluminium 6061-T6, 7075-T6, 5083 ; cuivre, laiton, bronze ; titane Grade 2 et Ti-6Al-4V ; aciers américains ASTM A992, A36, A572 Gr. 50 et HSS A500 Gr. C |
| Béton | C25/30, C30/37, C40/50, béton léger ; bétons américains $f'_c$ = 4 ksi et 5 ksi |
| Bois | C24, GL24h, GL32h |
| Autres | Verre, GFRP, CFRP, HDPE, PVC, PMMA, polycarbonate |

Un matériau encore utilisé par des éléments ne peut pas être supprimé : affectez d’abord un autre matériau à ces éléments.

## Sections {#cross-sections}

Onglet *Sections* → **Ajouter une section**, **Bibliothèque de sections**, ou **Section polygonale** pour dessiner votre propre forme. Comme les matériaux, les sections peuvent être partagées par plusieurs éléments.

| Champ | Unité | Rôle |
| --- | --- | --- |
| Aire $A$ | m² | Rigidité axiale $EA$, et aire de cisaillement $kA$. |
| Moment quadratique $I_y$ | m⁴ | Rigidité en flexion $EI_y$, autour de l’axe perpendiculaire au dessin. |
| Hauteur $h$ | m | Utilisée seulement par les charges thermiques : la courbure vaut $\alpha\,(\Delta T_b - \Delta T_t)/h$. |
| Coefficient de cisaillement $k$ | – | L’aire de cisaillement effective vaut $kA$, la rigidité à l’effort tranchant est donc $kGA$. Environ 0,83 pour un rectangle, $A_{\text{âme}}/A$ pour un profilé en I. |

Une nouvelle section reçoit par défaut $A$ = 1 m², $I_y = 10^{-4}$ m⁴, $h$ = 1 m et $k$ = 1 (en unités américaines, un W12×26 avec $k$ = 1). Remplacez ces valeurs par celles de votre section, ou choisissez-en une dans la bibliothèque.

::callout{type="tip" title="Retrouver les résultats d’un manuel qui néglige la déformation d’effort tranchant"}
La plupart des calculs à la main utilisent des poutres d’Euler–Bernoulli, sans déformation d’effort tranchant. Pour retrouver leurs résultats, donnez à $k$ une très grande valeur, par exemple `1e10` ; les exemples de l’application et les figures de ce site utilisent `1e32`. Une nouvelle section ($k = 1$), la bibliothèque et l’éditeur de polygones tiennent tous compte de la déformation d’effort tranchant ; [plus bas](#shear-deformation), vous verrez de combien elle change les résultats.
::

La **Bibliothèque de sections** donne des valeurs approchées pour :

| Famille | Sections | $k$ |
| --- | --- | --- |
| Pleines | Rectangles, carrés, cercles | 0,833 (rectangle), 0,9 (cercle) |
| Profilés en I | IPE 100, IPE 200, HEA 100, HEA 200 ; profilés AISC W8×31 à W36×150 | $h\,t_w/A$, l’âme |
| Tubes rectangulaires | RHS 100×50×3, 150×100×5 ; AISC HSS | $2ht/A$, les deux âmes |
| Tubes ronds | CHS Ø60×3, Ø114×5 ; AISC HSS ronds | 0,5 |

Vérifiez les valeurs de la bibliothèque dans un catalogue de profilés avant de vous y fier.

![La Bibliothèque de sections](/screenshots/fr/sections-library.webp){.shot-lg}

Pour un contrôle rapide à la main : un rectangle $b \times h$ a $A = bh$ et $I_y = bh^3/12$ ; un cercle plein de diamètre $d$ a $A = \pi d^2/4$ et $I_y = \pi d^4/64$.

### Déformation d’effort tranchant : quand G et k comptent {#shear-deformation}

La rigidité à l’effort tranchant $kGA$ entre dans l’élément par le [paramètre de cisaillement](/fr/elements/beam#timoshenko-or-euler-bernoulli) $\Phi = 12EI_y/(kGAL^2)$. Avec un $k$ très grand, $\Phi = 0$ et l’élément est une poutre d’Euler–Bernoulli : $G$ n’a alors aucun effet. Avec un $k$ réel, la déformation d’effort tranchant augmente toujours les flèches. Dans une structure isostatique, les efforts internes restent les mêmes ; dans une structure hyperstatique, ils changent aussi, car les inconnues hyperstatiques dépendent de la rigidité.

L’ampleur de l’effet dépend de l’élancement de la barre. Un IPE 200 de la bibliothèque ($k = h\,t_w/A = 0{,}393$) en acier S235 ($G$ = 81 000 MPa), sous 10 kN/m, comparé à la même poutre avec $k$ = `1e32` :

| Poutre | Avec déformation d’effort tranchant | Euler–Bernoulli |
| --- | --- | --- |
| Sur deux appuis, $L$ = 2 m ($L/h$ = 10) : flèche à mi-portée | 0,566 mm | 0,511 mm |
| Encastrée-appuyée, $L$ = 2 m : moment à l’encastrement | −4,84 kNm | −5,00 kNm |
| Sur deux appuis, $L$ = 6 m ($L/h$ = 30) : flèche à mi-portée | 41,85 mm | 41,36 mm |

À la main : la part de l’effort tranchant dans la flèche à mi-portée vaut $qL^2/(8kGA)$, soit 0,055 mm pour la poutre courte, 11 % de plus que la part due à la flexion, $5qL^4/(384EI_y)$. Dans la poutre encastrée-appuyée, le moment d’encastrement passe de $qL^2/8$ à $(qL^2/8)/(1 + \Phi/4)$. Pour $L/h$ = 30, les deux effets restent de l’ordre de 1 % ou moins : c’est pourquoi, pour des portiques élancés, les résultats concordent avec ceux des manuels quel que soit $k$.

### Sections polygonales {#polygonal-sections}

Onglet *Sections* → **Section polygonale**, ou *Ou définir une forme polygonale* dans la boîte de dialogue Ajouter une section, ouvre un éditeur de forme qui calcule pour vous les caractéristiques de la section.

![L’éditeur de section polygonale avec un profilé en I prédéfini, ses axes principaux et son ellipse d’inertie](/screenshots/fr/sections-polygon.webp)

::div{.steps}

### Partez d’une forme prédéfinie {#start-from-a-preset}

Choisissez un **Modèle** (rectangle, profilé en I, en T, cornière, profilé en U, tube rectangulaire, cercle, tube circulaire), réglez ses dimensions et appuyez sur **Appliquer**.

### Ajustez la forme {#adjust-the-shape}

Faites glisser les sommets (ils s’accrochent au **Pas de magnétisme**), cliquez au milieu d’une arête pour insérer un sommet, ou double-cliquez sur un sommet pour le supprimer. Vous pouvez aussi saisir les coordonnées dans le tableau **Sommets**. **Ajouter un évidement** ajoute un contour intérieur, et **Centrer sur le centre de gravité** déplace la forme pour que son centre de gravité soit à l’origine.

### Lisez les caractéristiques {#read-the-properties}

L’onglet **Caractéristiques de la section** affiche $A$, le centre de gravité, $I_y$, $I_z$, $I_{yz}$ par rapport au centre de gravité, les moments principaux $I_1$, $I_2$ avec l’**Angle des axes principaux** $\alpha$ (de $y$ vers l’axe 1), et les rayons de giration. Le dessin montre les axes principaux et l’ellipse d’inertie.

### Ajoutez-la {#add-it}

Vérifiez le **Libellé** et le **Coefficient de cisaillement** $k$ : il démarre à 0,833, la bonne valeur pour un rectangle ; un profilé en I demande environ $A_{\text{âme}}/A$. Appuyez ensuite sur **Ajouter une section** (**Enregistrer** quand vous modifiez une forme existante). $A$, $I_y$ et $h$ proviennent de la forme et sont en lecture seule dans le tableau ; pour les changer, modifiez à nouveau la forme avec le bouton polygone de la colonne *Actions*.

::

Les coordonnées de la section sont exprimées dans un repère local direct : $x$ sort de l’écran, $y$ pointe vers la gauche, $z$ vers le bas.

Si la forme n’est pas symétrique par rapport au plan du portique (une cornière, par exemple), l’éditeur vous avertit : une analyse 2D n’est exacte que si la barre est maintenue contre le déplacement latéral et la torsion sur toute sa longueur, par une dalle par exemple. Quand $I_{yz}$ est significatif, vous choisissez la rigidité en flexion : **maintenue latéralement et en torsion sur toute sa longueur** ($I_y$), ou **libre de se déplacer latéralement**, qui est plus faible. La torsion n’est prise en compte dans aucun des deux cas.
