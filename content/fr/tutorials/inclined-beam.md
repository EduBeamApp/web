---
description: "Tutoriel : une poutre inclinée (arbalétrier, volée d’escalier) dans EduBeam, une charge par mètre en plan, N et V le long de la pente et l’effet de l’orientation de l’appui simple. Environ 15 minutes."
source: site
---

# Tutoriel : poutre inclinée

Modélisez un arbalétrier de toiture sous la neige, lisez l’effort normal et l’effort tranchant le long de sa pente, et vérifiez-les à la main.

- **Durée :** environ 15 minutes. C’est le premier et le plus court des quatre tutoriels.
- **Il vous faut :** EduBeam ouvert dans un second onglet, sur un ordinateur avec souris et clavier. Si vous n’avez jamais utilisé EduBeam, faites d’abord le [Démarrage rapide](/fr/guide/quick-start) : il présente les onglets et les boîtes de dialogue utilisés ici.
- **Prérequis :** l’équilibre d’une poutre sur deux appuis, et la décomposition d’une force en deux composantes.
- **Unités :** SI. La pastille des unités, en bas à droite de la vue, doit afficher `m m² kN kNm MPa`. Si elle indique des pieds et des kips, cliquez dessus et réglez **Système d’unités** sur **SI (métrique)**.

**Vous apprendrez à**

- convertir une charge donnée par mètre en plan en charge par mètre de barre, celle qu’attend EduBeam,
- orienter une charge linéique verticalement ou perpendiculairement à la barre avec la case **LCS** (repère local, SCL),
- tourner un appui simple, et constater que cela modifie l’effort normal mais pas le moment fléchissant.

::div{.actions}
[Ouvrir EduBeam ↗](https://run.edubeam.app/?lang=fr){target="_blank"} [Aller à la vérification à la main](#check-by-hand)
::

::model-figure{caption="L’arbalétrier terminé : 3 kN/m de neige par mètre en plan, saisis comme 2,4 kN/m le long de la barre, avec une articulation à l’égout (nœud 1) et un appui simple au faîtage (nœud 2)"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## Énoncé {#the-problem}

- Un arbalétrier droit, du nœud 1 en (0, 0) au nœud 2 en (4, −3) : 4 m en plan et 3 m de hauteur, soit une longueur $L = 5$ m, avec $\cos\alpha = 4/5$ et $\sin\alpha = 3/5$.
- Une articulation au nœud 1, à l’égout. Au nœud 2, au faîtage, un appui simple qui roule horizontalement : sa réaction est donc verticale.
- La neige $s = 3$ kN/m, donnée comme dans les normes **par mètre en plan** (de projection horizontale).
- Acier, $E = 210$ GPa, et $I_y = 8{,}356 \times 10^{-5}$ m⁴, celui d’un IPE 300.

**La poutre est-elle isostatique ?** Trois réactions et trois équations d’équilibre : oui. Ses efforts découlent de la statique seule ; $E$ et $I_y$ n’interviennent que dans la flèche.

## Construisez le modèle {#model-it}

::div{.steps}

### Matériau et section {#material-and-section}

1. Dans la barre de l’application, cliquez sur **Effacer la structure**, cochez **Supprimer les matériaux** et **Supprimer les sections**, puis cliquez sur **Confirmer**. La numérotation des nœuds et des éléments repart de 1.
2. Onglet **Matériaux** → **Bibliothèque de matériaux** → **+** sur la ligne **Acier (S235)**, puis **Annuler** pour fermer la bibliothèque.
3. Onglet **Sections** → **Ajouter une section**. Saisissez `8,356e-5` dans **Iy**, laissez **Aire**, **Hauteur** et **Coefficient de cisaillement** à `1`, et cliquez sur **Ajouter une section**.

Avec une aire de 1 m², la barre ne se raccourcit pas et ne se déforme pas sensiblement par effort tranchant, comme le suppose le calcul à la main.

### Dessinez la barre {#draw-the-member}

1. Onglet **Éléments** → le second bouton **Ajouter un élément**, celui avec l’icône du curseur.
2. Cliquez en (0, 0), puis en (4, −3). Les règles et le réticule indiquent où vous êtes, et les clics s’accrochent à la grille.
3. Appuyez sur <kbd>Échap</kbd> pour arrêter le dessin, puis sur <kbd>F</kbd> pour ajuster la vue.

L’axe z pointe vers le bas : le nœud 2, situé 3 m **au-dessus** du nœud 1, est donc en $z = -3$. Vérifiez les deux nœuds dans le tableau **Nœuds** et corrigez toute coordonnée qui a manqué la grille en saisissant la bonne valeur.

### Appuis {#supports}

Cliquez sur le nœud 1 → **Appuis du nœud** → le symbole **Rotule**. Donnez de la même façon le symbole **Appui simple** au nœud 2.

### Charge {#load}

La neige sur l’arbalétrier représente $3 \cdot 4 = 12$ kN au total. EduBeam répartit une charge uniforme sur la **longueur** de la barre ; les mêmes 12 kN répartis sur 5 m donnent donc

$$
f_z = s \cdot \frac{4}{5} = s\cos\alpha = 3 \cdot 0{,}8 = 2{,}4\ \text{kN/m}
$$

1. Onglet **Charges** → **Ajouter une charge d’élément**.
2. **Type de charge** *Charge uniformément répartie*, **Élément** `1`, `fz = 2,4`.
3. **Décochez LCS**, pour que `fz` agisse verticalement, et cliquez sur **Ajouter une charge d’élément**.

::callout{type="warning" title="LCS est coché par défaut"}
Avec **LCS** coché, `fz` agit selon l’axe z local de l’élément, perpendiculairement à la pente : c’est le cas du vent sur une toiture, pas celui de la neige. Sur une poutre horizontale, les deux coïncident, d’où le risque de ne pas s’en apercevoir. Les flèches dessinées sur la charge montrent dans quel sens elle agit ; la page [Charges](/fr/essentials/loads#uniformly-distributed-load) donne les détails.
::

::

## Résultats {#results}

La poutre est calculée dès que la charge est saisie. Dans les options d’affichage, en haut à droite de la vue (la roue dentée les affiche et les masque), **Déformée**, **M<sub>y</sub> (x)** et **Réactions** sont activés d’emblée ; cochez aussi **N (x)** et **V<sub>z</sub> (x)**. Le sélecteur sous la figure en haut de cette page montre les mêmes diagrammes.

EduBeam étiquette les diagrammes et les réactions en kN et en kNm avec deux décimales ; vous devez lire :

- `6,00` à chaque appui, vers le haut. La réaction horizontale de l’articulation affiche `0,00` : aucune force horizontale n’agit.
- `6,00` kNm, le maximum du moment fléchissant, à mi-portée.
- `4,80` kN d’effort tranchant au nœud 1 et `-4,80` au nœud 2.
- `-3,60` kN d’effort normal au nœud 1 (compression) et `3,60` au nœud 2 (traction), en passant par zéro à mi-portée.

## Vérifiez à la main {#check-by-hand}

**Réactions.** La résultante de 12 kN agit à 2 m en plan du nœud 1 : l’équilibre des moments par rapport à l’une ou l’autre extrémité donne $V_1 = V_2 = 6$ kN. Aucune force horizontale n’agit, donc $H_1 = 0$.

**Moment fléchissant.** Pour des forces verticales, seuls les bras de levier horizontaux comptent. À une distance $x$ en plan du nœud 1,

$$
M(x) = V_1\,x - \frac{s\,x^2}{2}, \qquad M_{\max} = \frac{s\,a^2}{8} = \frac{3 \cdot 4^2}{8} = 6\ \text{kNm}
$$

exactement comme pour une poutre horizontale de portée $a = 4$ m sous la même charge par mètre en plan.

**Effort tranchant et effort normal.** Les forces à gauche d’une coupure en $x$ ont pour résultante une force verticale $T(x) = V_1 - s\,x$. Décomposez-la en une composante perpendiculaire à la barre et une composante selon la barre :

$$
V = T\cos\alpha, \qquad N = -T\sin\alpha
$$

| | Nœud 1, $T = +6$ kN | Mi-portée, $T = 0$ | Nœud 2, $T = -6$ kN |
| --- | --- | --- | --- |
| $V$ | $6 \cdot 0{,}8 = 4{,}8$ kN | 0 | −4,8 kN |
| $N$ | $-6 \cdot 0{,}6 = -3{,}6$ kN | 0 | +3,6 kN |
| $M$ | 0 | 6 kNm | 0 |

Toutes ces valeurs correspondent à celles d’EduBeam. La réaction verticale au nœud 1 pousse l’extrémité basse vers le haut de la pente, contre la barre : compression. La réaction verticale au nœud 2 tire l’extrémité haute encore plus haut sur la pente, en l’éloignant de la barre : traction. Les signes suivent le sens de l’élément, du nœud 1 au nœud 2, comme l’expliquent les [conventions de signes](/fr/elements/conventions#internal-forces).

## Expérimentez {#experiment}

Changez une seule chose à la fois, prévoyez le résultat, puis regardez. <kbd>Ctrl</kbd>+<kbd>Z</kbd> annule chaque modification.

**Oubliez le cosinus.** Saisissez `fz = 3` au lieu de 2,4. Cela fait 3 kN par mètre de pente, 15 kN au total, et tous les résultats sont 25 % trop grands : des réactions de 7,5 kN et un moment de 7,5 kNm. Sur une toiture inclinée à 30°, l’erreur serait de 15 %, et à 45° de 41 %.

**Laissez LCS coché.** Cochez **LCS** sur la charge de 2,4 kN/m. Elle pousse maintenant perpendiculairement à la pente, comme le vent, avec une composante horizontale de 7,2 kN que seule l’articulation peut reprendre. Le moment monte à $2{,}4 \cdot 5^2/8 = 7{,}5$ kNm, et l’effort normal devient une traction constante de 4,5 kN.

::model-figure{caption="Les mêmes 2,4 kN/m avec LCS coché : perpendiculaires à la pente, si bien que l’articulation reprend 7,2 kN horizontalement"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4, local: true }
results: [M, N]
show: [nodeLabels]
---
::

**Tournez l’appui simple.** Décochez de nouveau **LCS** et changez seulement la direction dans laquelle roule l’appui simple du nœud 2. Cliquez sur le nœud 2 → **Appuis du nœud**, saisissez `-36,87` dans **Angle du SCL nodal** et appuyez sur <kbd>Entrée</kbd> (ou utilisez le champ **α** de sa ligne dans le tableau **Nœuds**).

![Le menu Appuis du nœud pour le nœud 2 : les symboles d’appui, les directions bloquées et l’Angle du SCL nodal](/screenshots/fr/p2t-node-supports-angle.webp){.shot-md}

L’angle fait tourner les axes propres du nœud. Avec les axes par défaut, x vers la droite et z vers le bas, un angle négatif les fait tourner dans le sens antihoraire à l’écran. La page [Appuis inclinés](/fr/essentials/nodes-supports#inclined-skewed-supports) en dit plus.

L’appui simple roule maintenant le long de la pente : sa réaction est donc perpendiculaire à la barre et vaut $12 \cdot 2 / 5 = 4{,}8$ kN, d’après l’équilibre des moments par rapport au nœud 1. L’articulation reprend le reste, et avec lui tout l’effort normal : −7,2 kN au nœud 1, zéro au nœud 2.

::model-figure{caption="L’appui simple du nœud 2 tourné de −36,87° pour rouler le long de la pente : l’effort normal va de −7,2 kN à zéro"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
angles: { 2: -36.87 }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

**Passez à un appui simple vertical.** Remettez l’angle à 0 et choisissez le symbole **Appui simple vertical** pour le nœud 2. Il roule verticalement et ne peut donc pousser qu’horizontalement : l’équilibre des moments par rapport au nœud 1, $H_2 \cdot 3 = 12 \cdot 2$, donne 8 kN, et l’articulation retient l’arbalétrier contre cette poussée. Toute la barre est comprimée.

::model-figure{caption="Un appui simple vertical au nœud 2 : une poussée horizontale de 8 kN, et tout l’arbalétrier comprimé"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: verticalRoller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

Les trois appuis simples côte à côte :

| Appui simple au nœud 2 | Réaction au nœud 2 | Réaction au nœud 1 | $N$ du nœud 1 au nœud 2 |
| --- | --- | --- | --- |
| Horizontal | 6 kN ↑ | 6 kN ↑ | de −3,6 à +3,6 kN |
| Le long de la pente | 4,8 kN ⊥ barre | 2,88 kN → ; 8,16 kN ↑ | de −7,2 à 0 kN |
| Vertical | 8 kN ← | 8 kN → ; 12 kN ↑ | de −13,6 à −6,4 kN |

**Le moment fléchissant ne change jamais**, pas plus que l’effort tranchant : 6 kNm et ±4,8 kN dans les trois cas. Le nœud 1, le nœud 2 et chaque coupure se trouvent sur une même droite, l’axe de la barre. La composante de la réaction du nœud 2 dirigée selon cette droite n’a de moment par rapport à aucun de ces points : elle n’ajoute que de l’effort normal. La composante perpendiculaire à la barre est fixée à 4,8 kN par l’équilibre des moments par rapport au nœud 1, quelle que soit l’orientation de l’appui. Cette orientation détermine seulement où va la poussée, ce qui compte pour le mur ou le palier d’escalier qui doit la reprendre.

## Pour aller plus loin {#next-steps}

::card-grid{cols="2"}
:::card{title="S’entraîner : poutres sur deux appuis avec porte-à-faux" icon="lucide:dices" to="/fr/practice?p=O2048"}
Les réactions et le moment maximal d’une poutre sous charge répartie, avec vérification immédiate de vos réponses. Commencez par O2048 ; pour d’autres exercices, ne laissez sélectionné que **Poutre sur deux appuis avec porte-à-faux** et appuyez sur **Nouvel exercice**.
:::
:::card{title="Suite : portique à trois articulations" icon="lucide:triangle" to="/fr/tutorials/three-hinged-frame"}
Quatre barres, une rotule intérieure et une poussée horizontale : un portique que la statique seule permet encore de résoudre.
:::
::
