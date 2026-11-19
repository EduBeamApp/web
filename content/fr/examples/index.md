---
description: "Six poutres, portiques et treillis déjà calculés, à ouvrir dans EduBeam en un clic, avec exercices, points à observer et solutions pour vérifier vos calculs."
source: site
---

# Exemples

Chaque vignette ci-dessous est un modèle interactif, déjà calculé. Cliquez sur l’une d’elles pour l’ouvrir dans [EduBeam]{.edubeam}, prêt à être modifié : déplacez un nœud, changez une charge ou cochez une rotule, et regardez les diagrammes se mettre à jour. Plus bas, des exercices font de chaque modèle une courte étude, avec les solutions pour vérifier votre calcul à la main.

::feature-structures
::

Les mêmes modèles se trouvent dans l’application sous **☰ → Exemples**, et le lien [run.edubeam.app/?panel=examples&lang=fr](https://run.edubeam.app/?panel=examples&lang=fr){target="_blank"} ouvre directement cette galerie.

::callout{type="info" title="Une même barre pour les six exemples"}
Tous les exemples utilisent la même barre en acier : $E = 210$ GPa, $I_y = 8356\ \text{cm}^4$ (donc $EI = 17\,548$ kNm²), une aire de $1\ \text{m}^2$ et une rigidité à l’effort tranchant si grande que les déformations d’effort normal et d’effort tranchant sont négligeables. Les formules des manuels pour les poutres élancées concordent donc avec l’application sur tous les chiffres affichés. La hauteur de section vaut $1$ m, ce qui ne compte que pour la charge thermique.
::

## Exercices proposés {#suggested-exercises}

Faites d’abord le calcul à la main, puis vérifiez-le dans l’application : ouvrez le modèle depuis sa vignette ci-dessus ou avec **Ouvrir dans EduBeam** sous sa figure. Ouvrir un modèle remplace celui que vous avez ; <kbd>Ctrl</kbd>+<kbd>Z</kbd> vous rend le vôtre, qui est aussi conservé dans **☰ → Structures récentes**.

### Poutre hyperstatique {#exercise-indeterminate-beam}

Une poutre de 3 m, encastrée en A et sur un appui simple en B, sous 10 kN/m.

::model-figure{caption="Encastrement en A, appui simple en B, 10 kN/m"}
---
nodes: { A: [0, 0], B: [3, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Déterminer à la main les réactions et le moment d’encastrement, par la méthode des forces ou avec une table des moments d’encastrement parfait.
2. Décocher `Ry` en A pour obtenir une poutre sur deux appuis. Comment le plus grand moment évolue-t-il ?
3. Cocher de nouveau `Ry` en A, et aussi en B, pour encastrer les deux extrémités.

**Observez** où le diagramme des moments change de signe, et comment l’encastrement reprend une plus grande part de la charge que l’appui simple.

::callout{type="details" title="Solutions"}
- Encastrée-appuyée : $R_A = 5qL/8 = 18{,}75$ kN, $R_B = 3qL/8 = 11{,}25$ kN, $M_A = qL^2/8 = 11{,}25$ kNm, moment négatif. Le plus grand moment positif vaut $9qL^2/128 = 6{,}33$ kNm, à 1,125 m de B, là où l’effort tranchant s’annule.
- Sur deux appuis : $qL^2/8 = 11{,}25$ kNm à mi-portée, la valeur que reprenait l’encastrement auparavant.
- Bi-encastrée : moment négatif de $qL^2/12 = 7{,}5$ kNm aux extrémités, moment positif de $qL^2/24 = 3{,}75$ kNm à mi-portée.
::

### Console {#exercise-cantilever}

Une console de 4 m, encastrée en A, avec 18 kN vers le bas à l’extrémité libre B.

::model-figure{caption="Console, 18 kN à l’extrémité libre"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Déterminer le moment d’encastrement, la flèche et la rotation en bout. Les comparer avec le nœud B dans **Résultats → Résultats nodaux**.
2. Diviser $I_y$ par deux dans l’onglet **Sections**. Qu’est-ce qui change, et qu’est-ce qui ne change pas ?
3. Remplacer la charge ponctuelle par une charge uniformément répartie de 4,5 kN/m, soit les mêmes 18 kN au total : supprimer la charge nodale dans l’onglet **Charges**, puis utiliser **Ajouter une charge d’élément**.

**Observez** la forme du diagramme des moments : une droite sous la charge ponctuelle, une parabole sous la charge répartie.

::callout{type="details" title="Solutions"}
- $M_A = FL = 72$ kNm, $w_B = FL^3/(3EI) = 21{,}88$ mm, $\varphi_B = FL^2/(2EI) = 8{,}21$ mrad.
- Diviser $I_y$ par deux double la flèche, qui passe à 43,77 mm. Le moment reste de 72 kNm : la console est isostatique, ses efforts ne dépendent donc pas de la rigidité.
- Charge répartie : $M_A = qL^2/2 = 36$ kNm et $w_B = qL^4/(8EI) = 8{,}21$ mm. La même charge totale donne la moitié du moment et les trois huitièmes de la flèche.
::

### Treillis Warren {#exercise-pratt-truss}

Un treillis de 9 m de portée et 1,8 m de hauteur, avec 8 kN à chacun des trois nœuds supérieurs E, F et G. Cochez **N(x)** dans les options d’affichage pour voir les efforts normaux. (Avec ses diagonales alternées et sans montants, sa disposition est celle que la plupart des manuels appellent un treillis Warren.)

::model-figure{caption="Nœuds A à G, 8 kN en E, F et G"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D], [E, F], [F, G], [A, E], [E, B], [B, F], [F, C], [C, G], [G, D]]
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: []
show: [nodeLabels]
---
::

1. Déterminer les réactions, puis les efforts dans la diagonale d’extrémité A–E et dans la membrure inférieure A–B par la méthode des nœuds.
2. Déterminer l’effort dans la membrure supérieure du panneau central et l’effort dans la membrure inférieure B–C par la méthode des sections.
3. Les nœuds de ce modèle sont rigides. Cocher les deux rotules d’extrémité de chaque barre dans l’onglet **Éléments** pour en faire un treillis articulé, et comparer les efforts normaux.
4. Supprimer la diagonale B–F, d’abord avec des nœuds rigides, puis avec des rotules. Le treillis tient-il encore ?

**Observez** la répartition des signes : la membrure supérieure comprimée, la membrure inférieure tendue, et les diagonales qui alternent.

::callout{type="details" title="Solutions"}
- Réactions : 12 kN en A et en D.
- Diagonales d’extrémité : 15,62 kN en compression. Membrures inférieures A–B et C–D : 10,00 kN en traction.
- Membrures supérieures E–F et F–G : 13,33 kN en compression (moments par rapport à B : $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$). Membrure inférieure B–C : 16,67 kN en traction (moments par rapport à F : $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$). Diagonales intérieures : 5,21 kN, en traction de E et G vers la membrure inférieure, en compression vers F.
- Nœuds rigides et nœuds articulés donnent les mêmes efforts normaux à 0,1 % près. Dans un treillis triangulé, la flexion est négligeable : c’est pourquoi le modèle articulé fonctionne.
- Sans B–F, le treillis à nœuds rigides tient encore par effet de portique, avec des moments fléchissants d’environ 3 kNm. Avec des rotules, il lui manque une barre : il devient un mécanisme, et EduBeam montre comment il peut bouger.
::

### Poutre continue à trois travées {#exercise-three-span-continuous-beam}

Une poutre de 16 m à travées de 5 + 6 + 5 m : 8 kN/m sur la première travée, 20 kN en C et 6 kN/m sur la dernière travée. À l’ouverture, seuls A et D sont appuyés.

::model-figure{caption="À l’ouverture : appuyée seulement en A et D"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: []
show: [nodeLabels, dimensions]
---
::

1. À l’ouverture, c’est une seule poutre de 16 m sur deux appuis. Déterminer les réactions et les moments en B et C.
2. Cocher `Dz` en B et en C pour en faire une poutre continue sur quatre appuis.
3. Déterminer les moments sur appuis en B et C par l’équation des trois moments (Clapeyron), puis les réactions.

**Observez** les moments négatifs qui apparaissent sur les appuis intérieurs, à quel point tous les moments diminuent, et ce que devient la charge de 20 kN dès que C est un appui.

::callout{type="details" title="Solutions"}
- Sur deux appuis : $R_A = 44{,}69$ kN, $R_D = 45{,}31$ kN, $M_B = 123{,}4$ kNm et $M_C = 151{,}6$ kNm, tous deux positifs.
- Poutre continue, avec $M_A = M_D = 0$ :
  $$22 M_B + 6 M_C = -\tfrac{8 \cdot 5^3}{4}$$
  $$6 M_B + 22 M_C = -\tfrac{6 \cdot 5^3}{4}$$
  donnent $M_B = -9{,}766$ kNm et $M_C = -5{,}859$ kNm, moments négatifs. Les 20 kN en C descendent directement dans l’appui et ne font rien fléchir.
- Réactions : A 18,05 kN, B 22,60 kN, C 35,52 kN (y compris les 20 kN), D 13,83 kN. Leur somme est égale aux 90 kN de charge.

::model-figure{caption="La poutre continue sur quatre appuis"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, B: roller, C: roller, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: [M, V]
---
::
::

### Portique {#exercise-portal-frame}

Une traverse de 8 m sur deux poteaux de 6 m, encastrée en A et sur un appui simple en D. La traverse porte 10 kN/m, et l’angle supérieur C reçoit 8 kN vers la gauche et 10 kN vers le bas.

::model-figure{caption="Encastrement en A, appui simple en D : 10 kN/m sur la traverse, 8 kN et 10 kN en C"}
---
nodes: { A: [0, 0], B: [0, -6], C: [8, -6], D: [8, 0] }
supports: { A: fixed, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
  - { node: C, fx: -8 }
  - { node: C, fz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Quel est le degré d’hyperstaticité du portique ?
2. Décocher `Ry` en A pour faire de A une articulation. Le portique est maintenant isostatique : déterminer à la main les réactions et les moments aux angles B et C.
3. Cocher de nouveau `Ry` en A, puis cocher `Dx` en D pour en faire une articulation. Observer le déplacement latéral de la traverse sur la déformée.

**Observez** dans quel sens se déplace le haut du portique. Dans le portique tel qu’il s’ouvre, il se déplace vers la droite, contre la charge de 8 kN. Pourquoi ?

::callout{type="details" title="Solutions"}
- Quatre réactions (trois à l’encastrement, une à l’appui simple) et trois équations d’équilibre : hyperstatique de degré 1. Avec D articulé lui aussi, de degré 2.
- Articulation en A : $V_D = (10 \cdot 8 \cdot 4 + 10 \cdot 8 - 8 \cdot 6)/8 = 44$ kN, $V_A = 46$ kN, $H_A = 8$ kN vers la droite. Le moment à l’angle B vaut $8 \cdot 6 = 48$ kNm. En C, il est nul : sans réaction horizontale en D, le poteau droit ne reprend qu’un effort normal de 44 kN.
- Tel qu’il s’ouvre, le haut se déplace de 9,5 mm vers la droite : le moment dû à la traverse chargée fait fléchir le poteau encastré plus que les 8 kN. Avec D articulé, D reprend 4,9 kN horizontalement, et le haut se déplace de 4,8 mm vers la gauche.
::

### Charge thermique {#exercise-temperature-load}

Une poutre de 8 m sur deux appuis, dont l’axe s’échauffe de $\Delta T_c = 20$ K, et dont la face inférieure est plus froide de 10 K que la face supérieure ($\Delta T_b - \Delta T_t = -10$ K).

::model-figure{caption="Poutre de 8 m sur deux appuis, échauffée de 20 K, face inférieure plus froide de 10 K que la face supérieure"}
---
nodes: { A: [0, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 20, bottom: -10, top: 0 } }
results: []
show: [nodeLabels, dimensions]
---
::

1. Avant de regarder : quels efforts internes la température provoque-t-elle, et comment la poutre se déplace-t-elle ?
2. Cocher `Dx` en B pour empêcher la poutre de s’allonger.
3. Cocher en plus `Ry` aux deux extrémités.

**Observez** la déformée et les valeurs dans **Résultats → Résultats nodaux** : la poutre se déplace sans aucun effort interne tant que vous ne la bloquez pas.

::callout{type="details" title="Solutions"}
- Une poutre isostatique peut librement s’allonger et fléchir : il n’y a donc aucun effort interne. B glisse vers l’extérieur de $\alpha \Delta T_c L = 12 \cdot 10^{-6} \cdot 20 \cdot 8 = 1{,}92$ mm. La face inférieure, plus froide, se raccourcit : la poutre se cintre vers le haut avec une courbure $\kappa = \alpha (\Delta T_b - \Delta T_t)/h = -1{,}2 \cdot 10^{-4}$ 1/m ; les extrémités tournent de $\kappa L/2 = 0{,}48$ mrad et le milieu de la portée monte de $\kappa L^2/8 = 0{,}96$ mm.
- Avec les deux extrémités bloquées selon x : $N = -EA\alpha\Delta T_c = -50\,400$ kN, compression. Cette valeur vient de l’aire fictive de 1 m² ; un IPE 200 de 28,48 cm² reprendrait 143,5 kN.
- Avec les deux extrémités encastrées : un moment constant $EI\alpha(\Delta T_b - \Delta T_t)/h = 2{,}11$ kNm sur toute la poutre.
::

## Tutoriels détaillés {#worked-tutorials}

Des modèles plus complets, construits pas à pas et vérifiés à la main :

::card-grid{cols="2"}
:::card{title="Poutre inclinée" icon="lucide:move-diagonal" to="/fr/tutorials/inclined-beam"}
Un arbalétrier sous la neige : charges par mètre en plan, efforts normal et tranchant le long de la pente, et un appui simple incliné.
:::
:::card{title="Portique à trois articulations" icon="lucide:triangle" to="/fr/tutorials/three-hinged-frame"}
Réactions, N, V et M d’un portique avec une rotule intérieure.
:::
:::card{title="Treillis plan" icon="lucide:git-fork" to="/fr/tutorials/truss"}
La méthode des nœuds, la méthode des sections, une barre à effort nul et une flèche par le principe des travaux virtuels.
:::
:::card{title="Poutre continue et tassement d’appui" icon="lucide:spline" to="/fr/tutorials/continuous-beam"}
Une poutre à deux travées résolue par la méthode des forces, puis avec un tassement de 10 mm de son appui central.
:::
::

Pour d’autres vérifications par des solutions analytiques, voir [Vérifier les résultats à la main](/fr/guide/verification).

## Plus d’exercices {#more-problems}

La page [Exercices d’entraînement](/fr/practice) vous propose à la demande une nouvelle poutre, un nouveau portique ou un nouveau treillis avec d’autres valeurs, et vérifie aussitôt vos réactions et le plus grand moment ou effort dans une barre. Pour un cours, le [générateur d’examens](/fr/exam) imprime un sujet différent pour chaque étudiant, avec le corrigé, et [@edubeam/plot](/fr/guide/teaching#exercise-sheets-tests-and-slides-from-code) produit des feuilles d’exercices à partir de code.

## Proposer un exemple {#contribute-an-example}

Vous avez un bon modèle pédagogique ? Partagez son lien sur [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions) et nous l’ajouterons peut-être à la galerie.
