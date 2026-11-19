---
description: "Tutoriel : une poutre continue à deux travées dans EduBeam, comparée à deux travées isostatiques, puis un tassement d’appui, le tout vérifié par la méthode des forces. Environ 25 minutes."
source: site
---

# Tutoriel : poutre continue et tassement d’appui

Modélisez une poutre continue sur deux travées, comparez-la à deux poutres sur deux appuis, puis faites tasser son appui central de 10 mm. L’équilibre seul ne suffit pas à donner les réactions de cette poutre : vous les vérifierez par la méthode des forces.

- **Durée :** environ 25 minutes. C’est le dernier et le plus riche des quatre tutoriels.
- **Il vous faut :** EduBeam ouvert dans un second onglet, sur un ordinateur avec souris et clavier. Si vous n’avez jamais utilisé EduBeam, commencez par le [Démarrage rapide](/fr/guide/quick-start) ou par l’un des tutoriels précédents.
- **Prérequis :** la méthode des forces pour une inconnue hyperstatique, et les flèches à mi-portée d’une poutre sur deux appuis, $5qL^4/(384EI)$ sous charge uniforme et $FL^3/(48EI)$ sous charge ponctuelle.
- **Unités :** SI. La pastille des unités, en bas à droite de la vue, doit afficher `m m² kN kNm MPa`. Si elle indique des pieds et des kips, cliquez dessus et réglez **Système d’unités** sur **SI (métrique)**.

**Vous apprendrez à**

- voir ce qu’apporte la continuité : des moments et des flèches plus faibles que dans des travées isostatiques,
- imposer un tassement d’appui, et lire les efforts qu’il provoque à lui seul,
- vérifier une poutre hyperstatique par la méthode des forces, et comprendre pourquoi une poutre plus rigide souffre davantage d’un tassement.

::div{.actions}
[Ouvrir EduBeam ↗](https://run.edubeam.app/?lang=fr){target="_blank"} [Aller à la vérification à la main](#check-by-hand)
::

::model-figure{caption="La poutre terminée : deux travées de 6 m sous 10 kN/m, avant le tassement"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels, dimensions]
---
::

## Énoncé {#the-problem}

- Deux travées de $L = 6$ m : une articulation au nœud 1, des appuis simples aux nœuds 2 et 3.
- Une charge uniforme $q = 10$ kN/m sur les deux travées.
- Acier, $E = 210$ GPa, et $I_y = 8{,}356 \times 10^{-5}$ m⁴ (un IPE 300), d’où $EI = 17\,547{,}6$ kNm².
- Dans la seconde partie, l’appui central, au nœud 2, tasse de $\Delta = 10$ mm.

**La poutre est-elle isostatique ?** Quatre réactions (deux au nœud 1, une à chacun des nœuds 2 et 3) pour trois équations d’équilibre : la poutre est hyperstatique de degré 1. L’équation manquante vient de la déformation : le nœud 2 ne bouge pas, ou se déplace exactement de $\Delta$.

## Construisez le modèle {#model-it}

::div{.steps}

### Matériau et section {#material-and-section}

1. Dans la barre de l’application, cliquez sur **Effacer la structure**, cochez **Supprimer les matériaux** et **Supprimer les sections**, puis cliquez sur **Confirmer**. La numérotation des nœuds et des éléments repart de 1.
2. Onglet **Matériaux** → **Bibliothèque de matériaux** → **+** sur la ligne **Acier (S235)**, puis **Annuler** pour fermer la bibliothèque.
3. Onglet **Sections** → **Ajouter une section**. Saisissez `8,356e-5` dans **Iy**, laissez **Aire**, **Hauteur** et **Coefficient de cisaillement** à `1`, et cliquez sur **Ajouter une section**.

Avec une aire de 1 m², la poutre ne se déforme pas sensiblement par effort tranchant, comme le suppose le calcul à la main. Cette fois, $I_y$ compte aussi pour les efforts : vous verrez où.

### Dessinez la poutre {#draw-the-beam}

1. Onglet **Éléments** → le second bouton **Ajouter un élément**, celui avec l’icône du curseur.
2. Cliquez en (0, 0), (6, 0) et (12, 0).
3. Appuyez sur <kbd>Échap</kbd> pour arrêter le dessin, puis sur <kbd>F</kbd> pour ajuster la vue.

Trois nœuds et deux éléments. Vérifiez les coordonnées dans le tableau **Nœuds**.

### Appuis {#supports}

Cliquez sur le nœud 1 → **Appuis du nœud** → le symbole **Rotule**. Donnez aux nœuds 2 et 3 le symbole **Appui simple**.

### Charge {#load}

Onglet **Charges** → **Ajouter une charge d’élément** → *Charge uniformément répartie* sur l’**Élément** `1`, `fz = 10` → **Ajouter une charge d’élément**. Recommencez pour l’élément 2.

::

## Résultats {#results}

Le moment fléchissant, les réactions et la déformée sont affichés d’emblée. Pour l’effort tranchant, cochez **V<sub>z</sub> (x)** dans les options d’affichage, en haut à droite de la vue (la roue dentée les affiche et les masque). EduBeam étiquette les diagrammes et les réactions en kN et en kNm avec deux décimales.

- Les réactions affichent `22,50` aux nœuds 1 et 3, et `75,00` au nœud 2 : l’appui central reprend plus de la moitié des 120 kN.
- Le moment sur l’appui 2 affiche `-45,00` : c’est un moment négatif. En travée, le moment positif atteint au plus `25,31` kNm, à 2,25 m des appuis d’extrémité.
- L’effort tranchant saute de `-37,50` à `37,50` au droit du nœud 2.

### Comparez avec deux travées isostatiques {#compare-with-two-simple-spans}

Qu’apporte la continuité ? Supprimez-la : dans le tableau **Éléments**, cochez la rotule de **fin** de l’élément 1, au nœud 2. La poutre devient deux poutres sur deux appuis de 6 m, une structure isostatique.

::model-figure{caption="Avec une rotule au nœud 2 : deux travées isostatiques, chacune avec qL²/8 = 45 kNm"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [{ nodes: [1, 2], hinges: [false, true] }, [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, w]
show: [nodeLabels]
---
::

| | Poutre continue | Deux travées isostatiques |
| --- | --- | --- |
| Réactions aux nœuds 1, 2, 3 | 22,5 ; 75 ; 22,5 kN | 30 ; 60 ; 30 kN |
| Moment sur l’appui 2 | −45 kNm | 0 |
| Moment positif maximal | 25,31 kNm | 45 kNm |
| Flèche maximale, dans la vue $w(x)$ des figures | 4,000 mm | 9,617 mm |

Le moment maximal reste de 45 kNm, mais dans la poutre continue il passe sur l’appui, et les travées fléchissent beaucoup moins. Chaque travée est aussi 2,4 fois plus rigide : son extrémité sur le nœud 2 ne peut pas tourner, presque comme si elle était encastrée. Décochez la rotule avant de continuer.

## Tassement de l’appui central {#settle-the-middle-support}

Faites maintenant descendre le nœud 2 de 10 mm, comme pourrait le faire une semelle sur un sol compressible.

::div{.steps}

### Imposez le tassement {#prescribe-the-settlement}

Cliquez sur le nœud 2 → **Imposer un déplacement**. Dans la boîte de dialogue, **Déplacement imposé** est déjà choisi ; saisissez `0,01` dans **Dz** et cliquez sur **Ajouter une charge nodale**.

![La boîte de dialogue du déplacement imposé : seul Dz, la direction que bloque l’appui simple, peut être défini](/screenshots/fr/p2t-prescribe-displacement.webp){.shot-sm}

Avec les unités SI par défaut, les déplacements sont en mètres : 10 mm s’écrivent donc `0,01`, positif vers le bas. Seules les directions bloquées peuvent recevoir un déplacement : un appui simple peut descendre, mais pas glisser latéralement. Pour en savoir plus, voir [Déplacements imposés](/fr/essentials/loads#prescribed-displacements-support-settlements).

### Lisez les nouveaux résultats {#read-the-new-results}

La réaction centrale tombe à `70,13` kN et les réactions d’extrémité montent à `24,94` kN. Le moment sur l’appui 2 diminue à `-30,38` kNm, et les travées fléchissent davantage, jusqu’à `31,09` kNm.

::model-figure{caption="Le nœud 2 tassé de 10 mm : le moment négatif sur l’appui diminue, et les travées en reprennent davantage"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
  - { node: 2, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

### Observez le tassement seul {#look-at-the-settlement-alone}

Supprimez les deux charges d’élément : sélectionnez chacune d’elles et appuyez sur <kbd>Suppr</kbd>, ou utilisez le × de sa ligne dans le tableau **Charges**. Il reste l’effet du tassement à lui seul : un moment triangulaire de `14,62` kNm sur le nœud 2, positif, et des réactions qui tirent le nœud 2 **vers le bas** avec `4,87` kN tandis que les nœuds 1 et 3 poussent vers le haut avec `2,44` kN chacun. La poutre résiste à la courbure que le tassement lui impose, et cette résistance est la seule chose qui la sollicite.

::model-figure{caption="Le tassement seul : aucune charge, et pourtant la poutre fléchit et les appuis réagissent"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { node: 2, settlement: { dz: 0.01 } }
results: [M, w]
show: [nodeLabels]
---
::

Ajoutez ces valeurs aux résultats sous la charge seule et vous obtenez la poutre tassée sous charge : 75 − 4,87 = 70,13 kN, −45 + 14,62 = −30,38 kNm. Le calcul est linéaire, donc les effets se superposent.

### Supprimez de nouveau la continuité {#cut-the-continuity-again}

Rétablissez les charges avec <kbd>Ctrl</kbd>+<kbd>Z</kbd>, une fois par charge supprimée, et cochez de nouveau la rotule de fin de l’élément 1. Les travées ne font plus que s’incliner avec le tassement : les réactions et les moments sont exactement ceux de deux travées isostatiques, quel que soit le tassement, et sans les charges ils seraient nuls. **Un tassement ne provoque d’efforts internes que dans une structure hyperstatique.** Décochez la rotule avant de continuer.

::

## Vérifiez à la main {#check-by-hand}

Appliquez la méthode des forces. Supprimez l’appui du nœud 2 et remplacez-le par sa réaction inconnue $R_2$, dirigée vers le haut, qui agit sur une poutre sur deux appuis de portée $2L = 12$ m.

**Flèches de la poutre libérée au nœud 2.** Sous la charge, puis sous une force unité dirigée vers le haut au nœud 2 :

$$
\delta_q = \frac{5q\,(2L)^4}{384\,EI} = \frac{5 \cdot 10 \cdot 12^4}{384 \cdot 17\,547{,}6} = 0{,}15387\ \text{m}
$$

$$
\delta_{1} = \frac{(2L)^3}{48\,EI} = \frac{12^3}{48 \cdot 17\,547{,}6} = 0{,}0020516\ \text{m/kN}
$$

**Compatibilité.** $R_2$ doit repousser le nœud 2 vers le haut jusqu’à ce qu’il se trouve au niveau de l’appui : à zéro, ou à $\Delta$ plus bas.

$$
R_2\,\delta_1 = \delta_q - \Delta \quad\Rightarrow\quad R_2 = \frac{\delta_q - \Delta}{\delta_1}
$$

**Tout le reste** découle de l’équilibre ; le moment positif maximal se trouve là où l’effort tranchant $R_1 - qx$ s’annule.

| | Formule | Sans tassement | Nœud 2 tassé de 10 mm |
| --- | --- | --- | --- |
| $R_2$ | $(\delta_q - \Delta)/\delta_1$ | 75,00 kN | 70,13 kN |
| $R_1 = R_3$ | $(2qL - R_2)/2$ | 22,50 kN | 24,94 kN |
| $M_2$ | $R_1 L - qL^2/2$ | −45,00 kNm | −30,38 kNm |
| $M_{\max}$ | $R_1^2/(2q)$ | 25,31 kNm | 31,09 kNm |

EduBeam affiche exactement les mêmes valeurs, jusqu’au dernier chiffre.

Sans tassement, ce sont les valeurs classiques des manuels : $R_2 = 10qL/8$, $M_2 = -qL^2/8$ et $M_{\max} = 9qL^2/128$. Le tassement seul modifie les réactions de $\Delta/\delta_1 = 4{,}874$ kN et le moment sur le nœud 2 de

$$
\Delta M_2 = \frac{\Delta}{\delta_1} \cdot \frac{2L}{4} = \frac{3\,EI\,\Delta}{L^2} = \frac{3 \cdot 17\,547{,}6 \cdot 0{,}01}{36} = 14{,}62\ \text{kNm}
$$

Notez la présence de $EI$ dans cette formule. Les efforts dus à une charge ne dépendent que de la rigidité des barres *les unes par rapport aux autres* ; les efforts dus à un déplacement imposé croissent avec la rigidité elle-même. Sur un appui qui tasse, une poutre plus rigide attire des moments plus grands.

## Expérimentez {#experiment}

Partez de la poutre tassée sous charge, changez une seule chose à la fois, prévoyez le résultat, puis regardez. <kbd>Ctrl</kbd>+<kbd>Z</kbd> annule chaque modification.

**Doublez la rigidité.** Dans le tableau **Sections**, mettez **Iy** à `1,6712e-4`. L’effet du tassement sur le moment au nœud 2 double, à 29,25 kNm, et $M_2$ tombe à −15,75 kNm. Sous la charge seule, seules les flèches changeraient : elles seraient divisées par deux.

**Trouvez le tassement qui libère le nœud 2.** Pour quel $\Delta$ le moment sur le nœud 2 s’annule-t-il ? $\Delta M_2 = 45$ kNm exige $\Delta = 45 L^2/(3EI) = qL^4/(24EI) = 0{,}0308$ m. Passez le tassement à `0,0308`, dans le tableau **Charges** ou par un double-clic dessus dans la vue : les réactions deviennent 30 kN, 60 kN et 30 kN, celles de deux travées isostatiques, à l’arrondi de $\Delta$ près. $qL^4/(24EI)$ est la rotation d’extrémité d’une travée isostatique multipliée par $L$ : le tassement incline chaque travée juste assez pour refermer l’angle au droit du nœud 2, et la continuité n’a plus aucun rôle à jouer.

**Lâchez le nœud 2.** Passez le tassement à `0,1539`, la flèche $\delta_q$ de la poutre libérée de 12 m. La réaction au nœud 2 tombe pratiquement à zéro, et la poutre porte la charge comme une seule travée isostatique : 180 kNm à mi-portée. Un appui qui tasse autant n’est plus un appui.

**Soulevez plutôt le nœud 2.** Passez le tassement à `-0,01`, soit 10 mm vers le haut. Tout ce que le tassement modifiait change de signe : le nœud 2 reprend maintenant 79,87 kN et le moment négatif atteint −59,62 kNm.

D’autres vérifications par des formules analytiques, dont le tassement d’appui d’une poutre encastrée-appuyée, se trouvent dans [Vérifier les résultats à la main](/fr/guide/verification#prescribed-displacement).

## Pour aller plus loin {#next-steps}

::card-grid{cols="2"}
:::card{title="S’entraîner : poutres continues à deux travées" icon="lucide:dices" to="/fr/practice?p=K2049"}
Des poutres à deux travées chargées sur une travée ou sur les deux, résolues par la méthode des forces, avec vérification immédiate de vos réponses. Commencez par K2049 ; pour d’autres exercices, ne sélectionnez que **Poutre continue à deux travées** et appuyez sur **Nouvel exercice**.
:::
:::card{title="Galerie d’exemples" icon="lucide:library" to="/fr/examples/"}
C’était le dernier tutoriel. La galerie d’exemples propose d’autres modèles à ouvrir, modifier et vérifier, ainsi que des exercices à donner aux étudiants.
:::
::
