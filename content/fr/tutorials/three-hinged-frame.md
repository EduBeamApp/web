---
description: "Tutoriel : un portique à trois articulations sous charge uniforme dans EduBeam. Réactions, poussée, efforts internes et flèche de la rotule, vérifiés à la main. Environ 15 minutes."
source: site
---

# Tutoriel : portique à trois articulations

Modélisez un portique avec une rotule à mi-portée, lisez ses réactions et ses diagrammes, et vérifiez chaque valeur à la main, jusqu’à la flèche de la rotule.

- **Durée :** environ 15 minutes.
- **Il vous faut :** EduBeam ouvert dans un second onglet, sur un ordinateur avec souris et clavier. Si vous n’avez jamais utilisé EduBeam, commencez par le [Démarrage rapide](/fr/guide/quick-start) ou par le tutoriel [poutre inclinée](/fr/tutorials/inclined-beam).
- **Prérequis :** l’équilibre d’un portique et le schéma des parties isolées. La vérification facultative de la flèche utilise la méthode de la charge unité (travaux virtuels).
- **Unités :** SI. La pastille des unités, en bas à droite de la vue, doit afficher `m m² kN kNm MPa`. Si elle indique des pieds et des kips, cliquez dessus et réglez **Système d’unités** sur **SI (métrique)**.

**Vous apprendrez à**

- dessiner un portique d’une seule polyligne à la souris,
- placer une rotule dans une barre avec les cases **Rotules d’extrémité**,
- trouver la poussée horizontale à partir de la condition $M = 0$ à la rotule, et interpréter le signe de $V$ dans des barres dessinées dans des sens différents.

::div{.actions}
[Ouvrir EduBeam ↗](https://run.edubeam.app/?lang=fr){target="_blank"} [Aller à la vérification à la main](#_6-check-by-hand)
::

::model-figure{caption="Le portique terminé : 10 kN/m sur la traverse, articulations aux nœuds 1 et 5, rotule au nœud 3"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], { nodes: [2, 3], hinges: [false, true] }, [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## Énoncé {#the-problem}

- Deux poteaux de 4 m, articulés en pied aux nœuds 1 et 5, distants de 8 m.
- En tête, une traverse horizontale du nœud 2 au nœud 4, avec une rotule à mi-portée, au nœud 3.
- Une charge uniforme $q = 10$ kN/m sur toute la traverse.
- Acier, $E = 210$ GPa, et $I_y = 8{,}356 \times 10^{-5}$ m⁴ (un IPE 300) pour toutes les barres.

| Nœud | x (m) | z (m) | |
| --- | --- | --- | --- |
| 1 | 0 | 0 | articulation |
| 2 | 0 | −4 | angle |
| 3 | 4 | −4 | rotule dans la traverse |
| 4 | 8 | −4 | angle |
| 5 | 8 | 0 | articulation |

L’axe z pointe **vers le bas** : la tête des poteaux est donc en $z = -4$.

**Le portique est-il isostatique ?** Deux articulations donnent quatre réactions. Les trois équations d’équilibre et la condition $M_3 = 0$ à la rotule font quatre équations : oui.

## Construisez le modèle {#model-it}

::div{.steps}

### Matériau et section {#_1-material-and-section}

1. Dans la barre de l’application, cliquez sur **Effacer la structure**, cochez **Supprimer les matériaux** et **Supprimer les sections**, puis cliquez sur **Confirmer**. La numérotation des nœuds et des éléments repart de 1.
2. Onglet **Matériaux** → **Bibliothèque de matériaux** → **+** sur la ligne **Acier (S235)**, puis **Annuler** pour fermer la bibliothèque.
3. Onglet **Sections** → **Ajouter une section**. Saisissez `8,356e-5` dans **Iy**, laissez **Aire**, **Hauteur** et **Coefficient de cisaillement** à `1`, et cliquez sur **Ajouter une section**.

Avec une aire de 1 m², les barres ne se raccourcissent pas et ne se déforment pas sensiblement par effort tranchant, comme le suppose le calcul de la flèche à la main. Les efforts internes d’un portique isostatique ne dépendent d’ailleurs pas du tout de $E$, $A$ ou $I_y$.

### Dessinez le portique {#_2-draw-the-frame}

1. Onglet **Éléments** → le second bouton **Ajouter un élément**, celui avec l’icône du curseur.
2. Cliquez en (0, 0), (0, −4), (4, −4), (8, −4) et (8, 0). Chaque clic ajoute le nœud suivant et le relie au précédent ; les clics s’accrochent à la grille.
3. Appuyez sur <kbd>Échap</kbd> pour arrêter le dessin, puis sur <kbd>F</kbd> pour ajuster la vue.

Vous avez maintenant les nœuds 1 à 5 et les éléments 1 à 4, numérotés dans l’ordre du dessin, comme sur les figures de cette page. Comparez le tableau **Nœuds** avec le tableau ci-dessus et corrigez toute coordonnée qui a manqué la grille en saisissant la bonne valeur.

### Appuis et rotule {#_3-supports-and-the-hinge}

1. Cliquez sur le nœud 1 → **Appuis du nœud** → le symbole **Rotule**. Faites de même pour le nœud 5.
2. Dans le tableau **Éléments**, trouvez l’élément 2, qui va du nœud 2 au nœud 3, et cochez la seconde de ses cases **Rotules d’extrémité** : la rotule à sa fin, au nœud 3.

![Le tableau Éléments : l’élément 2 a sa rotule de fin cochée, au nœud 3](/screenshots/fr/p2t-frame-elements-table.webp)

Une seule rotule suffit. L’élément 3 est alors la seule barre liée rigidement au nœud 3, si bien qu’aucun moment ne peut lui être transmis en ce point. Cocher aussi le début de l’élément 3 ne change rien.

### Charge {#_4-load}

1. Onglet **Charges** → **Ajouter une charge d’élément**.
2. **Type de charge** *Charge uniformément répartie*, **Élément** `2`, `fz = 10`. Cliquez sur **Ajouter une charge d’élément**.
3. Recommencez pour l’élément 3.

`fz` est positif vers le bas. La traverse est horizontale, donc la case **LCS** (repère local, SCL) ne change rien ici.

::

## Résultats {#_5-results}

Dans les options d’affichage, en haut à droite de la vue (la roue dentée les affiche et les masque), **Déformée**, **M<sub>y</sub> (x)** et **Réactions** sont activés d’emblée. Cochez **N (x)** et **V<sub>z</sub> (x)** pour voir le reste, ou décochez-en quelques-uns pour n’afficher qu’un diagramme à la fois. EduBeam les étiquette en kN et en kNm avec deux décimales.

- Chaque pied affiche `40,00` vers le haut et `20,00` vers l’intérieur.
- Le moment fléchissant affiche `-80,00` aux deux angles et n’a pas d’étiquette à la rotule, où il est nul. EduBeam le dessine du côté tendu, ici à l’extérieur du portique.
- L’effort normal est négatif partout : `-40,00` dans les poteaux, `-20,00` dans la traverse. Les quatre barres sont comprimées.
- Onglet **Résultats** → **Résultats nodaux** : la rotule, au nœud 3, descend de $D_z$ = `4,2554 · 10⁻² m`, soit 42,55 mm, la valeur lue à la rotule dans la vue $w(x)$ de la figure ci-dessus.

## Vérifiez à la main {#_6-check-by-hand}

**Réactions verticales.** Par symétrie, chaque pied reprend la moitié des 80 kN :

$$
V_1 = V_5 = \frac{q \cdot 8}{2} = 40\ \text{kN}
$$

**Réactions horizontales.** Coupez le portique à la rotule et écrivez l’équilibre des moments de la moitié gauche par rapport au nœud 3, où le moment est nul :

$$
V_1 \cdot 4 - H_1 \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_1 = \frac{160 - 80}{4} = 20\ \text{kN}
$$

Aux deux pieds, la réaction horizontale pousse vers l’intérieur avec 20 kN. Sans cette poussée, que fournissent des articulations incapables de s’écarter, le portique ne tiendrait pas : les poteaux s’ouvriraient et la rotule s’affaisserait.

| Grandeur | Formule | À la main | EduBeam |
| --- | --- | --- | --- |
| Réactions verticales | $q \cdot 8/2$ | 40 kN | 40,00 |
| Réactions horizontales | d’après $M_3 = 0$ | 20 kN | 20,00 |
| Moments aux angles, nœuds 2 et 4 | $H_1 \cdot 4$ | 80 kNm, côté extérieur | −80,00 |
| Moment à la rotule, nœud 3 | | 0 | pas d’étiquette |
| $N$ dans les poteaux | $-V_1$ | −40 kN | −40,00 |
| $N$ dans la traverse | $-H_1$ | −20 kN | −20,00 |
| $V$ dans les poteaux | $\pm H_1$ | ±20 kN | −20,00 ; 20,00 |
| $V$ dans la traverse aux nœuds 2, 3, 4 | $V_1 - q\,x$ | 40 ; 0 ; −40 kN | 40,00 ; pas d’étiquette ; −40,00 |

Les deux poteaux portent le même effort tranchant avec des signes opposés, −20 kN dans l’élément 1 et +20 kN dans l’élément 4, parce que les axes locaux de chaque élément suivent le sens dans lequel il a été dessiné : l’élément 1 vers le haut, l’élément 4 vers le bas. Inversez les nœuds d’un poteau et son signe s’inverse. Les [conventions de signes](/fr/elements/conventions#internal-forces) expliquent pourquoi.

Dans la traverse, $M(x) = -80 + 40x - 5x^2$ kNm, avec $x$ mesuré depuis le nœud 2. Il s’annule à la rotule et n’est jamais positif : toute la traverse est en moment négatif, fibre supérieure tendue. L’effort tranchant $V(x) = 40 - 10x$ s’annule exactement à la rotule ; c’est donc là que le moment atteint son extremum.

::callout{type="details" title="La flèche de la rotule par les travaux virtuels"}
Placez une charge unité dirigée vers le bas au nœud 3. Elle donne les réactions $\bar V = \bar H = 1/2$ et un moment $\bar m$ qui croît de 0 en pied de poteau jusqu’à 2 à l’angle, puis redescend à 0 à la rotule, fibre extérieure tendue, comme le moment réel $M$. Intégrez $M \bar m$ sur les quatre barres :

$$
\text{poteaux : } 2\int_0^4 (20\,y)(0{,}5\,y)\,dy = 426{,}7
$$

$$
\text{traverse : } 2\int_0^4 (80 - 40x + 5x^2)(2 - 0{,}5x)\,dx = 320
$$

Avec $EI = 210 \times 10^6 \cdot 8{,}356 \times 10^{-5} = 17\,548$ kNm² :

$$
\delta_3 = \frac{1}{EI}\int M \bar m\,dx = \frac{746{,}7}{17\,548} = 0{,}04255\ \text{m}
$$

Ce sont les 42,55 mm qu’EduBeam affiche sous la forme `4,2554 · 10⁻²` m. Le 4 du dernier chiffre vient du très léger raccourcissement et de la petite déformation d’effort tranchant qu’une aire de 1 m² permet encore, et que le calcul à la main néglige. Avec l’aire réelle d’un IPE 300, $A = 53{,}8$ cm², et son âme comme aire de cisaillement (un coefficient de cisaillement de 0,40), les barres se raccourcissent et se déforment davantage par effort tranchant, et la rotule descend de 43,7 mm, environ 3 % de plus.
::

## Expérimentez {#_7-experiment}

Changez une seule chose à la fois, prévoyez le résultat, puis regardez. <kbd>Ctrl</kbd>+<kbd>Z</kbd> annule chaque modification.

**Décochez la rotule.** Le portique devient hyperstatique de degré 1. La poussée diminue de moitié, à 10 kN, les moments aux angles tombent à −40 kNm, et la traverse présente un moment positif de 40 kNm à mi-portée. Le nœud 3 ne descend plus que de 12,16 mm au lieu de 42,55 mm. Les sections comptent désormais elles aussi : donnez à la traverse une section plus rigide que celle des poteaux, et les moments aux angles augmentent.

::model-figure{caption="Sans la rotule : moins de poussée, des moments aux angles divisés par deux et un moment positif à mi-portée"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], [2, 3], [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, w]
show: [nodeLabels]
---
::

**Encastrez les pieds.** Donnez aux nœuds 1 et 5 le symbole **Encastrement**. La poussée monte à 30 kN et des moments de 40 kNm apparaissent en pied (EduBeam affiche `39,99`, car les poteaux se raccourcissent très légèrement), mais les moments aux angles restent à 80 kNm. Par symétrie, l’effort tranchant à la rotule est nul, donc chaque moitié de traverse travaille toujours comme une console de 4 m encastrée à son angle : $q \cdot 4^2/2 = 80$ kNm.

**Poussez latéralement.** Remettez les articulations en pied et ajoutez une charge nodale `Fx = 10` kN au nœud 2. Les réactions perdent leur symétrie : 35 kN et 45 kN vers le haut, 15 kN et 25 kN horizontalement. Vérifiez-les avec les trois mêmes équations et $M_3 = 0$ ; la charge au nœud 2 n’a pas de bras de levier par rapport au nœud 3. Le moment à l’angle gauche tombe à −60 kNm, et la moitié gauche de la traverse présente maintenant un léger moment positif, 1,25 kNm à 0,5 m de la rotule.

::model-figure{caption="Une charge horizontale de 10 kN au nœud 2 : l’angle droit reprend maintenant 100 kNm"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], { nodes: [2, 3], hinges: [false, true] }, [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
  - { node: 2, fx: 10 }
results: [M, N]
show: [nodeLabels]
---
::

**Ajoutez une seconde rotule.** Cochez aussi la rotule au début de l’élément 2, au nœud 2. Deux rotules dans la traverse, sur deux poteaux articulés en pied, forment un mécanisme. EduBeam n’affiche aucun résultat, indique *Les articulations des nœuds 2, 3 laissent la structure bouger.* et anime le mouvement.

## Pour aller plus loin {#next-steps}

::card-grid{cols="2"}
:::card{title="S’entraîner : portiques à trois articulations" icon="lucide:dices" to="/fr/practice?p=H2048"}
Le même portique sous de nouvelles charges, dont une poussée horizontale, avec vérification immédiate de vos réponses. Commencez par H2048 ; pour d’autres exercices, ne laissez sélectionné que **Portique à trois articulations** et appuyez sur **Nouvel exercice**.
:::
:::card{title="Suite : treillis plan" icon="lucide:git-fork" to="/fr/tutorials/truss"}
Neuf barres articulées : la méthode des nœuds, la méthode des sections, une barre à effort nul et une flèche par les travaux virtuels.
:::
::
