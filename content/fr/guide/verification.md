---
description: "EduBeam comparé aux formules des manuels : poutres, treillis, température, tassement d’appui, et l’écart entre poutre de Timoshenko et d’Euler–Bernoulli."
source: site
---

# Vérifier les résultats à la main

Ne vous fiez jamais à un nombre que vous ne savez pas retrouver, au moins approximativement. Cette page traite à la main les cas classiques des manuels et les compare à [EduBeam]{.edubeam}, qui concorde sur tous les chiffres affichés. Les tableaux donnent cinq chiffres significatifs, comme l’onglet *Résultats* de l’application ; les étiquettes des figures sont arrondies à quatre. Chaque figure est calculée en direct dans votre navigateur ; **Ouvrir dans EduBeam** charge le même modèle dans l’application, où vous pouvez lire les tableaux, modifier une valeur et observer ce qui se passe.

::div{.chips}
- [Poutre sur deux appuis](#simply-supported-beam-uniform-load)
- [Console](#cantilever-tip-load)
- [Poutre bi-encastrée](#fixed–fixed-beam-uniform-load)
- [Poutre encastrée-appuyée](#propped-cantilever-uniform-load)
- [Treillis à deux barres](#two-bar-truss)
- [Température](#temperature-gradient-on-a-simply-supported-beam)
- [Tassement d’appui](#prescribed-displacement)
- [Déformation d’effort tranchant](#shear-deformation)
::

Pour des structures complètes traitées de bout en bout, voir les tutoriels du [portique à trois articulations](/fr/tutorials/three-hinged-frame) et du [treillis plan](/fr/tutorials/truss). Pour de nouveaux exercices à résoudre à la main, avec des réponses vérifiées au fur et à mesure de la saisie, essayez la page [Exercices d’entraînement](/fr/practice).

## La section utilisée {#the-section-used-here}

Sauf indication contraire, tous les cas utilisent la poutre en acier des exemples de l’application : $E = 210$ GPa et $I_y = 8356$ cm⁴ (un IPE 300), donc

$$
EI = 210 \times 10^9 \cdot 8{,}356 \times 10^{-5} = 17\,547{,}6\ \text{kNm}^2
$$

Son aire ($A = 1$ m²) et son coefficient de cisaillement ($k = 10^{32}$) sont si grands que les déformations d’effort normal et d’effort tranchant disparaissent : les résultats suivent donc exactement les formules d’Euler–Bernoulli de votre manuel.

::callout{type="info" title="Les poutres d’EduBeam sont des poutres de Timoshenko"}
Avec une vraie section, par exemple tirée de la bibliothèque de sections, les barres se déforment aussi sous l’effort tranchant. Les flèches sont alors légèrement plus grandes que celles des formules d’Euler–Bernoulli, et dans une structure hyperstatique les efforts se redistribuent légèrement. La section [Déformation d’effort tranchant](#shear-deformation), à la fin de cette page, montre de combien et comment la neutraliser.
::

Dans l’onglet *Résultats*, les déplacements et les rotations suivent les [axes globaux](/fr/elements/conventions#global-axes) : un D<sub>z</sub> positif est dirigé vers le bas, une R<sub>y</sub> positive tourne dans le sens antihoraire, et les déplacements sont en mètres, sauf si vous changez l’unité dans les paramètres (voir [Unités et paramètres](/fr/essentials/units-settings)).

## Poutre sur deux appuis, charge uniforme {#simply-supported-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, articulation en A et appui simple en B. Le nœud C, à mi-portée, permet d’y lire la flèche ; scinder une barre par un nœud ne change aucun résultat.

::model-figure{caption="Poutre sur deux appuis, 12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Grandeur | Formule | Valeur |
| --- | --- | --- |
| Réactions | $qL/2$ | 36 kN |
| Effort tranchant sur appuis | $\pm qL/2$ | +36 kN en A, −36 kN en B |
| Moment à mi-portée | $qL^2/8$ | 54 kNm |
| Rotation en A | $qL^3/(24EI)$ | 0,0061547 rad, sens horaire |
| Flèche en C | $5qL^4/(384EI)$ | 11,540 mm, vers le bas |

EduBeam affiche les mêmes valeurs. Dans l’onglet *Résultats*, le nœud A affiche R<sub>y</sub> = −0,0061547 rad (négatif : sens horaire) et le nœud C, D<sub>z</sub> = 0,01154 m (positif : vers le bas).

## Console, charge à l’extrémité {#cantilever-tip-load}

$L = 4$ m, encastrement en A, $F = 18$ kN vers le bas à l’extrémité libre B.

::model-figure{caption="Console, 18 kN en bout"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Grandeur | Formule | Valeur |
| --- | --- | --- |
| Réaction verticale | $F$ | 18 kN |
| Moment d’encastrement | $FL$ | 72 kNm, fibre supérieure tendue : M = −72 kNm |
| Rotation en bout | $FL^2/(2EI)$ | 0,0082063 rad, sens horaire |
| Flèche en bout | $FL^3/(3EI)$ | 21,883 mm, vers le bas |

Dans l’onglet *Résultats*, le nœud B affiche R<sub>y</sub> = −0,0082063 rad et D<sub>z</sub> = 0,021883 m.

## Poutre bi-encastrée, charge uniforme {#fixed–fixed-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, les deux extrémités encastrées. Cette poutre est hyperstatique : la solution dépend donc de la rigidité, et les formules viennent de la condition de compatibilité, qui impose des rotations nulles aux deux extrémités.

::model-figure{caption="Poutre bi-encastrée, 12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Grandeur | Formule | Valeur |
| --- | --- | --- |
| Réactions | $qL/2$ | 36 kN |
| Moments sur appuis | $qL^2/12$ | 36 kNm, fibre supérieure tendue : M = −36 kNm |
| Moment à mi-portée | $qL^2/24$ | 18 kNm, fibre inférieure tendue |
| Flèche en C | $qL^4/(384EI)$ | 2,3080 mm, vers le bas |

Encastrer les extrémités relève tout le diagramme des moments de $qL^2/12$ : l’écart total entre l’appui et la mi-portée reste $qL^2/8 = 54$ kNm, comme pour la poutre sur deux appuis. Dans l’application, partez du modèle sur deux appuis et changez les deux appuis en **Encastrement** pour le voir.

## Poutre encastrée-appuyée, charge uniforme {#propped-cantilever-uniform-load}

$L = 6$ m, $q = 12$ kN/m, encastrement en A et appui simple en B.

::model-figure{caption="Poutre encastrée-appuyée, 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Grandeur | Formule | Valeur |
| --- | --- | --- |
| Réaction à l’encastrement | $5qL/8$ | 45 kN |
| Réaction à l’appui simple | $3qL/8$ | 27 kN |
| Moment d’encastrement | $qL^2/8$ | 54 kNm, fibre supérieure tendue : M = −54 kNm |
| Moment positif maximal | $9qL^2/128$ | 30,375 kNm |
| … là où $V = 0$ | $x = 5L/8$ | 3,75 m depuis A |
| Rotation en B | $qL^3/(48EI)$ | 0,0030773 rad, sens antihoraire |

EduBeam étiquette chaque extremum d’un diagramme : le maximum en travée est donc repéré là où il se produit. Pour trouver sa position, cherchez où l’effort tranchant s’annule : $V(x) = 45 - 12x = 0$ donne $x = 3{,}75$ m.

## Treillis à deux barres {#two-bar-truss}

Deux barres partent d’articulations en A $(0, 0)$ et B $(4, 0)$ et se rejoignent au sommet C $(2, -2)$, 2 m plus haut. Les deux barres ont leurs deux **rotules d’extrémité** cochées : les barres ne reprennent donc que de l’effort normal. Une charge verticale $F = 20$ kN agit vers le bas en C.

::model-figure{caption="Treillis à deux barres, 20 kN au sommet"}
---
nodes: { A: [0, 0], C: [2, -2], B: [4, 0] }
supports: { A: pin, B: pin }
members: [{ nodes: [A, C], hinges: [true, true] }, { nodes: [C, B], hinges: [true, true] }]
loads:
  - { node: C, fz: 20 }
results: [N]
show: [nodeLabels]
---
::

Chaque barre est inclinée à 45°. L’équilibre vertical du nœud C, où les deux barres portent le même effort par symétrie, donne :

$$
\begin{aligned}
2N \sin 45^\circ + F &= 0 \\
N = -\frac{F}{\sqrt{2}} &= -14{,}142\ \text{kN}
\end{aligned}
$$

Les deux barres sont **comprimées**. Chaque appui reprend 10 kN verticalement et 10 kN horizontalement, dirigés vers l’intérieur : les barres écartent les appuis. La couche **N (x)** et les réactions montrent la même chose.

## Gradient thermique dans une poutre sur deux appuis {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m, $h = 0{,}3$ m, $\alpha = 12 \times 10^{-6}$ 1/K. La face supérieure se réchauffe de 5 K et la face inférieure se refroidit de 5 K : $\Delta T_b - \Delta T_t = -10$ K, et l’axe garde sa température ($\Delta T_c = 0$). Une poutre sur deux appuis est libre de se courber : il n’y a donc **aucun effort interne**, seulement une courbure :

$$
\begin{aligned}
\kappa &= \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} \\
&= \frac{12 \times 10^{-6} \cdot (-10)}{0{,}3} = -4 \times 10^{-4}\ \text{m}^{-1}
\end{aligned}
$$

La fibre supérieure s’allonge et la fibre inférieure se raccourcit : la poutre se bombe **vers le haut**.

::model-figure{caption="Face supérieure 10 K plus chaude que la face inférieure : la poutre se soulève de 3,2 mm, sans efforts internes"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [w]
show: [nodeLabels]
section: { h: 0.3 }
---
::

| Grandeur | Formule | Valeur |
| --- | --- | --- |
| Flèche en C | $\kappa L^2/8$ | 3,2 mm, vers le haut : D<sub>z</sub> = −0,0032 m |
| Rotation en A | $\kappa L/2$ | 0,0016 rad, sens antihoraire |
| Moment fléchissant |  | 0 |

Une variation uniforme $\Delta T_c$ ne ferait qu’allonger la poutre, ce que l’appui simple permet : elle n’ajouterait pas d’efforts non plus.

Bloquez maintenant la rotation aux deux extrémités (un **Encastrement** en A et une **Glissière** en B, qui laisse encore la poutre s’allonger). La courbure est empêchée, et un moment constant apparaît à sa place sur toute la portée :

$$
\begin{aligned}
M &= -EI\kappa \\
&= -17\,547{,}6 \cdot (-4 \times 10^{-4}) = 7{,}019\ \text{kNm}
\end{aligned}
$$

Ce moment est positif (fibre inférieure tendue) : la fibre supérieure, qui voudrait s’allonger et en est empêchée, se retrouve comprimée.

::model-figure{caption="La même poutre avec les deux rotations bloquées : un moment constant de 7,019 kNm"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: fixed, B: slider }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [M]
show: [nodeLabels]
section: { h: 0.3 }
---
::

Les charges thermiques se saisissent comme décrit dans [Charges](/fr/essentials/loads#temperature-load) ; la hauteur $h$ fait partie des données de la [section](/fr/essentials/elements#cross-sections).

## Tassement d’appui {#prescribed-displacement}

Reprenez la [poutre encastrée-appuyée](#propped-cantilever-uniform-load) sans sa charge et laissez l’appui simple B tasser de $w = 10$ mm. Dans EduBeam, c’est un **déplacement imposé** D<sub>z</sub> = 0,01 m en B. Pour le suivre, l’appui doit tirer vers le bas l’extrémité de la console, ce qui fléchit la poutre :

::model-figure{caption="Poutre encastrée-appuyée, B tasse de 10 mm : l’appui simple tire vers le bas avec une force de 2,437 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

| Grandeur | Formule | Valeur |
| --- | --- | --- |
| Force à l’appui simple | $R = 3EIw/L^3$ | 2,4372 kN, vers le bas |
| Moment d’encastrement | $RL$ | 14,623 kNm, fibre supérieure tendue : M = −14,623 kNm |
| Rotation en B | $3w/(2L)$ | 0,0025 rad, sens horaire |

Contrairement à une charge, un tassement ne crée des efforts que là où la structure s’y oppose : ici, plus la poutre est rigide, plus $R$ est grand. Une poutre sur deux appuis suivrait le même tassement comme un corps rigide, sans aucun effort.

Remettez la charge de 12 kN/m et les résultats se superposent : l’encastrement reprend maintenant $45 + 2{,}4372 = 47{,}437$ kN et $54 + 14{,}623 = 68{,}623$ kNm, et l’appui simple $27 - 2{,}4372 = 24{,}563$ kN. La saisie d’un tassement est décrite dans [Charges](/fr/essentials/loads#prescribed-displacements-support-settlements).

## Déformation d’effort tranchant {#shear-deformation}

Les éléments poutre d’EduBeam sont des poutres de **Timoshenko** : en plus de la flèche de flexion, ils se déforment par effort tranchant, d’une quantité fixée par la rigidité au cisaillement $kGA$ de la section. Ce que cela change dépend de la structure :

- **Isostatique** : les réactions et les efforts internes découlent de l’équilibre seul ; ils restent donc exactement les mêmes. Seuls les déplacements augmentent. Dans une poutre sur deux appuis et dans une console, les rotations des sections ne changent pas non plus ; ailleurs, par exemple à l’extrémité d’un porte-à-faux, elles changent un peu elles aussi.
- **Hyperstatique** : les efforts dépendent de la rigidité ; ils se redistribuent donc légèrement eux aussi.

### Une poutre sur deux appuis {#shear-simply-supported}

La poutre du [Démarrage rapide](/fr/guide/quick-start#_8-check-by-hand) donne l’ordre de grandeur. C’est la poutre sur deux appuis ci-dessus avec une vraie section, l’**IPE 200 (approx.)** de la bibliothèque de sections : $I_y = 1943$ cm⁴, $A = 28{,}48$ cm² et un coefficient de cisaillement $k = 0{,}3933$ (la part de l’âme dans l’aire), avec $G = 81$ GPa. D’où $EI = 4080{,}3$ kNm² et $kGA = 90\,720$ kN.

| Grandeur | Formule | Valeur |
| --- | --- | --- |
| Rotation sur appui | $qL^3/(24EI)$ | 0,026469 rad |
| Flèche à mi-portée, flexion | $5qL^4/(384EI)$ | 49,629 mm |
| Flèche à mi-portée, effort tranchant | $qL^2/(8kGA)$ | 0,59524 mm |
| Flèche à mi-portée, totale | somme | 50,224 mm, comme l’affiche EduBeam |

La part d’effort tranchant représente 1,2 % du total. La rotation sur appui est celle d’Euler–Bernoulli, tout comme les réactions et les moments.

### Une console : les barres courtes {#shear-cantilever}

Pour une console chargée en bout par $F$, l’extrémité fléchit de $FL^3/(3EI)$ par flexion et de $FL/(kGA)$ par effort tranchant. Leur rapport vaut

$$
\frac{\text{effort tranchant}}{\text{flexion}} = \frac{3EI}{kGA\,L^2}
$$

Avec le même IPE 200, cela fait 0,84 % pour une console de 4 m, mais 13,5 % pour une console de 1 m : la déformation d’effort tranchant compte pour les barres courtes et hautes.

### Une poutre encastrée-appuyée : les efforts se redistribuent {#shear-propped-cantilever}

La [poutre encastrée-appuyée](#propped-cantilever-uniform-load) en IPE 200 est hyperstatique, et l’appui simple reprend maintenant un peu plus. Avec $\beta = 3EI/(kGA\,L^2) = 0{,}0037481$ pour $L = 6$ m, la compatibilité à l’appui simple donne

$$
R_B = \frac{3qL}{8} \cdot \frac{1 + 4\beta/3}{1 + \beta} = 27{,}034\ \text{kN}
$$

au lieu de 27 kN, et le moment d’encastrement passe de 54 à $qL^2/2 - R_B L = 53{,}798$ kNm. C’est peu ici, mais l’écart croît avec $\beta$, donc pour les barres courtes et hautes.

### Comparer avec Euler–Bernoulli {#shear-switch-off}

Pour comparer avec les formules d’Euler–Bernoulli, donnez au **Coefficient de cisaillement** de la section une très grande valeur, par exemple `1e10`. La part d’effort tranchant disparaît alors, et tous les cas de cette page concordent de nouveau. La formulation de l’élément est présentée dans le manuel théorique, à la page [Élément poutre](/fr/elements/beam).

## Conseils pour vos propres vérifications {#tips-for-your-own-checks}

- Gardez en vue la **pastille des unités**, en bas à droite de la vue ; la plupart des écarts sont des erreurs d’unités.
- Lisez les valeurs exactes dans l’onglet **Résultats** et dans les infobulles au survol plutôt que sur les étiquettes des diagrammes. **Exporter en CSV** ou **Copier** vous donne aussi les réactions, prêtes pour un tableur. Voir [Résultats et diagrammes](/fr/essentials/results#results-tab).
- Réglez **Format des nombres** sur *Automatique* dans les Paramètres pour lire `40` au lieu de `4 · 10¹`.
- Utilisez la fenêtre **Matrice de rigidité** pour comparer un élément isolé au manuel théorique ([Élément poutre](/fr/elements/beam)) quand vous apprenez la méthode des déplacements.
- Utilisez **Partager le modèle** pour transmettre un modèle vérifié à un collègue ou à un enseignant.
- Pour vérifier de nombreux cas à la fois, ou générer des exercices aux réponses connues, lancez le même solveur depuis votre code : [@edubeam/fem](/fr/solver) est la bibliothèque qui calcule chaque valeur de l’application.
