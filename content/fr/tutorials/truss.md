---
description: "Tutoriel : un treillis plan dans EduBeam, ses efforts vérifiés par la méthode des nœuds et des sections, une barre à effort nul et le contrôle d’une flèche."
source: site
---

# Tutoriel : treillis plan

Construisez un petit treillis isostatique à barres articulées, vérifiez les efforts dans ses barres par la méthode des nœuds et par la méthode des sections, puis contrôlez une flèche par les travaux virtuels.

- **Durée :** environ 20 minutes.
- **Il vous faut :** EduBeam ouvert dans un second onglet, sur un ordinateur avec souris et clavier. Si vous n’avez jamais utilisé EduBeam, commencez par le [Démarrage rapide](/fr/guide/quick-start) ou par l’un des tutoriels précédents.
- **Prérequis :** la méthode des nœuds et la méthode des sections. La vérification facultative de la flèche utilise la méthode de la charge unité (travaux virtuels).
- **Unités :** SI. La pastille des unités, en bas à droite de la vue, doit afficher `m m² kN kNm MPa`. Si elle indique des pieds et des kips, cliquez dessus et réglez **Système d’unités** sur **SI (métrique)**.

**Vous apprendrez à**

- modéliser les barres d’un treillis comme des éléments poutre avec leurs deux rotules d’extrémité, dessinés à la souris,
- vérifier les efforts dans les barres par la méthode des nœuds et par la méthode des sections,
- repérer une barre à effort nul, et comprendre pourquoi un modèle à nœuds articulés convient à un treillis.

::div{.actions}
[Ouvrir EduBeam ↗](https://run.edubeam.app/?lang=fr){target="_blank"} [Aller à la vérification à la main](#_5-check-by-hand)
::

::model-figure{caption="Le treillis terminé : 30 kN aux nœuds 2 et 3, efforts dans les barres, traction positive"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: roller }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 30 }
  - { node: 3, fz: 30 }
results: [N, w]
show: [nodeLabels, dimensions]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

## Énoncé {#the-problem}

- Une portée de 12 m en trois panneaux de 4 m, hauteur 3 m : nœuds 1 à 4 sur la membrure inférieure, nœuds 5 et 6 sur la membrure supérieure.
- Une articulation au nœud 1 et un appui simple au nœud 4.
- Deux charges de 30 kN, aux nœuds 2 et 3 de la membrure inférieure.
- Barres en acier, $E = 210$ GPa, $A = 20$ cm².

| Éléments | Barres (par leurs nœuds) | |
| --- | --- | --- |
| 1, 2, 3 | 1–2, 2–3, 3–4 | membrure inférieure |
| 4, 5, 6 | 1–5, 5–6, 6–4 | diagonale d’extrémité, membrure supérieure, diagonale d’extrémité |
| 7, 8, 9 | 2–5, 5–3, 3–6 | montant, diagonale centrale, montant |

**Le treillis est-il isostatique ?** Avec $m = 9$ barres, $r = 3$ réactions et $j = 6$ nœuds, $m + r = 12 = 2j$. Chaque nœud fournit deux équations d’équilibre : les efforts dans les barres découlent donc de la statique seule.

## Construisez le modèle {#model-it}

::div{.steps}

### Matériau et section {#_1-material-and-section}

1. Dans la barre de l’application, cliquez sur **Effacer la structure**, cochez **Supprimer les matériaux** et **Supprimer les sections**, puis cliquez sur **Confirmer**. La numérotation des nœuds et des éléments repart de 1.
2. Onglet **Matériaux** → **Bibliothèque de matériaux** → **+** sur la ligne **Acier (S235)**, puis **Annuler** pour fermer la bibliothèque.
3. Onglet **Sections** → **Ajouter une section**. Saisissez `0,002` dans **Aire** et `1e-6` dans **Iy**, laissez **Hauteur** et **Coefficient de cisaillement** à `1`, et cliquez sur **Ajouter une section**.

Pour des barres articulées, seule l’aire compte ; $I_y$ doit simplement être positif.

### Dessinez les barres avec leurs rotules {#_2-draw-the-bars-with-hinges}

Dans EduBeam, une barre de treillis est un élément poutre dont les **deux rotules d’extrémité** sont cochées. L’outil de dessin à la souris peut les cocher pour vous, et l’ordre dans lequel vous dessinez donne la numérotation du tableau ci-dessus.

1. Onglet **Éléments** → le second bouton **Ajouter un élément**, celui avec l’icône du curseur.
2. Dans le bandeau en haut de la vue, cochez **Rotule au début** et **Rotule à la fin**. Toutes les barres que vous dessinerez ensuite les recevront.
3. Membrure inférieure : cliquez en (0, 0), (4, 0), (8, 0) et (12, 0), puis appuyez sur <kbd>Échap</kbd>.
4. Partie supérieure : cliquez de nouveau sur le bouton **Ajouter un élément**, puis sur le nœud 1 en (0, 0), en (4, −3), en (8, −3) et sur le nœud 4 en (12, 0). Si vous cliquez sur un nœud existant, la barre s’y raccorde au lieu de créer un nouveau nœud. Appuyez sur <kbd>Échap</kbd>.
5. Barres intérieures : une dernière fois, cliquez sur **Ajouter un élément**, puis sur le nœud 2 en (4, 0), le nœud 5 en (4, −3), le nœud 3 en (8, 0) et le nœud 6 en (8, −3). Appuyez sur <kbd>Échap</kbd>, puis sur <kbd>F</kbd> pour ajuster la vue.

Le tableau **Éléments** doit maintenant contenir les neuf éléments du tableau ci-dessus, chacun avec ses deux cases **Rotules d’extrémité** cochées. <kbd>Échap</kbd> quitte le mode dessin, mais les cases des rotules restent cochées dans le bandeau pour la prochaine fois.

### Appuis et charges {#_3-supports-and-loads}

1. Cliquez sur le nœud 1 → **Appuis du nœud** → le symbole **Rotule**. Donnez au nœud 4 le symbole **Appui simple**.
2. Cliquez sur le nœud 2 → **Ajouter une charge** → `Fz = 30` → **Ajouter une charge nodale**. Faites de même au nœud 3.

Un `Fz` positif est orienté vers le bas. Toutes les barres qui arrivent à un nœud y sont articulées, si bien que rien ne s’oppose à la rotation du nœud ; EduBeam l’accepte et indique une rotation nulle pour un tel nœud.

::

## Résultats {#_4-results}

Dans les options d’affichage, en haut à droite de la vue (la roue dentée les affiche et les masque), décochez **Déformée** et **M<sub>y</sub> (x)**, puisqu’il n’y a pas de flexion dans un treillis, et cochez **N (x)**. La traction est positive, et EduBeam indique les efforts en kN avec deux décimales.

- Les deux appuis affichent `30,00` vers le haut ; la réaction horizontale de l’articulation affiche `0,00`, car aucune charge horizontale n’agit.
- La membrure inférieure affiche `40,00` dans ses trois barres, en traction ; la membrure supérieure `-40,00`, en compression.
- La diagonale centrale 5–3 ne reprend rien : elle n’a donc pas d’étiquette, comme sur la figure en haut de la page.
- Onglet **Résultats** → **Résultats nodaux** : le nœud 2 descend de $D_z$ = `2,2937 · 10⁻³ m`, soit 2,294 mm.

## Vérifiez à la main {#_5-check-by-hand}

**Réactions.** Les charges sont symétriques, donc $R_1 = R_4 = 30$ kN vers le haut, et comme aucune charge horizontale n’agit, la réaction horizontale de l’articulation est nulle.

**Nœud 1** (méthode des nœuds). La diagonale d’extrémité 1–5 mesure 5 m, donc $\sin\alpha = 3/5$ et $\cos\alpha = 4/5$ :

$$
\textstyle\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \ \Rightarrow\ N_{15} = -50\ \text{kN}
$$

$$
\textstyle\sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}
$$

**Nœud 2.** Le montant 2–5 est la seule barre qui puisse transmettre la charge de 30 kN vers le haut : $N_{25} = +30$ kN, et $N_{23} = N_{12} = 40$ kN.

**Coupe dans le panneau central** (méthode des sections). Coupez les barres 5–6, 5–3 et 2–3 et isolez la partie gauche :

- Moments par rapport au nœud 3 : $R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN.
- Forces verticales : l’effort tranchant du panneau vaut $R_1 - 30 = 0$, donc la diagonale centrale **5–3 ne reprend rien** : $N_{53} = 0$.

| Barres | À la main | EduBeam |
| --- | --- | --- |
| Membrure inférieure 1–2, 2–3, 3–4 | +40 kN, traction | 40,00 |
| Membrure supérieure 5–6 | −40 kN, compression | −40,00 |
| Diagonales d’extrémité 1–5, 6–4 | −50 kN | −50,00 |
| Montants 2–5, 3–6 | +30 kN | 30,00 |
| Diagonale centrale 5–3 | 0 | pas d’étiquette |

Une barre à effort nul n’est pas une barre inutile : elle ne reprend rien sous *ce* chargement, mais retirez-la et le treillis s’effondre, comme le montrent les expériences ci-dessous.

::callout{type="details" title="La flèche du nœud 2 par les travaux virtuels"}
Placez une charge unité dirigée vers le bas au nœud 2 et recalculez le treillis à la main : $R_1 = 2/3$, $R_4 = 1/3$, et les efforts $n$ du tableau ci-dessous. La flèche vaut $\delta = \sum N\,n\,L / (EA)$ :

| Barre | $N$ (kN) | $n$ | $L$ (m) | $N\,n\,L$ |
| --- | --- | --- | --- | --- |
| 1–2 | 40 | 8/9 | 4 | 142,2 |
| 2–3 | 40 | 8/9 | 4 | 142,2 |
| 3–4 | 40 | 4/9 | 4 | 71,1 |
| 1–5 | −50 | −10/9 | 5 | 277,8 |
| 5–6 | −40 | −4/9 | 4 | 71,1 |
| 6–4 | −50 | −5/9 | 5 | 138,9 |
| 2–5 | 30 | 1 | 3 | 90,0 |
| 5–3 | 0 | −5/9 | 5 | 0 |
| 3–6 | 30 | 1/3 | 3 | 30,0 |
| | | | somme | 963,3 |

$$
\delta_2 = \frac{963{,}3}{EA} = \frac{963{,}3}{210 \times 10^6 \cdot 0{,}002} = 0{,}002294\ \text{m}
$$

Soit 2,294 mm, la même valeur que le $D_z$ du nœud 2 dans EduBeam, `2,2937 · 10⁻³` m.
::

## Expérimentez {#_6-experiment}

Changez une seule chose à la fois, prévoyez le résultat, puis regardez. <kbd>Ctrl</kbd>+<kbd>Z</kbd> annule chaque modification.

**Déplacez une charge.** Placez les deux charges au nœud 2 : supprimez la charge du nœud 3 et passez l’autre à `Fz = 60`. Désormais $R_1 = 40$ kN, l’effort tranchant du panneau central vaut $40 - 60 = -20$ kN, et la diagonale centrale doit le reprendre : $N_{53} = -20 \cdot 5/3 = -33{,}33$ kN, en compression.

::model-figure{caption="60 kN au nœud 2 : la diagonale centrale 5–3 reprend maintenant l’effort tranchant du panneau"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: roller }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 60 }
results: [N]
show: [nodeLabels]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

**Supprimez la diagonale centrale.** Supprimez l’élément 8. Le panneau central devient un rectangle articulé qui peut se déformer latéralement en parallélogramme. EduBeam n’affiche aucun résultat, indique *Les articulations des nœuds 2, 3, 5, 6 laissent la structure bouger.* (ce sont les quatre coins de ce panneau) et anime le mouvement.

**Décochez toutes les rotules** dans le tableau **Éléments**. Le treillis devient un portique à nœuds rigides. Cochez **M<sub>y</sub> (x)** : les moments fléchissants restent inférieurs à 0,1 kNm et les efforts normaux varient de moins de 0,1 %. Voilà pourquoi l’idéalisation à nœuds articulés fonctionne pour un treillis triangulé.

**Articulez les deux appuis.** Une quatrième réaction rend le treillis hyperstatique de degré 1, et le résultat peut surprendre : la membrure inférieure ne reprend plus **rien**, et chaque appui pousse à la place vers l’intérieur avec une force de 40 kN. Les nœuds 1 et 4 ne peuvent pas s’écarter, donc les trois barres alignées de la membrure qui les relient doivent avoir un allongement total nul. Comme elles portent toutes le même effort, cet effort est nul, et ses 40 kN passent dans les appuis. Cela vaut quelles que soient les aires des barres.

::model-figure{caption="Deux appuis articulés : les appuis reprennent le rôle de la membrure inférieure"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: pin }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 30 }
  - { node: 3, fz: 30 }
results: [N]
show: [nodeLabels]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

## Pour aller plus loin {#next-steps}

La théorie de l’élément barre se trouve dans [Barre de treillis](/fr/elements/truss).

::card-grid{cols="2"}
:::card{title="S’entraîner : treillis Warren" icon="lucide:dices" to="/fr/practice?p=T2048"}
Les réactions et l’effort dans une barre d’un treillis plus grand, avec vérification immédiate de vos réponses. Commencez par T2048 ; pour d’autres exercices, ne laissez sélectionné que **Treillis Warren** et appuyez sur **Nouvel exercice**.
:::
:::card{title="Suite : poutre continue et tassement d’appui" icon="lucide:spline" to="/fr/tutorials/continuous-beam"}
Une poutre hyperstatique : ce qu’apporte la continuité, ce que lui fait un tassement d’appui, et la méthode des forces pour vérifier les deux.
:::
::
