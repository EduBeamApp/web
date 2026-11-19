---
description: "Convention de signes d’EduBeam : x à droite, z vers le bas, charges, déplacements, axes locaux, N, V, M, efforts d’extrémité, réactions, option y vers le haut."
source: site
---

# Repère et conventions de signes

:span{#repere-et-conventions-de-signe}

Chaque nombre qu’affiche EduBeam a un signe. Cette page précise ce que *positif* veut dire pour les coordonnées, les charges, les déplacements, les efforts internes, les efforts d’extrémité et les réactions, pour que vous puissiez comparer l’application avec vos propres calculs. La plupart des résultats qui semblent faux s’expliquent en fait par une convention de signes.

| Grandeur | Positif |
| --- | --- |
| `x`, `Dx`, `Fx` | vers la droite |
| `z`, `Dz`, `Fz` | **vers le bas** |
| `Ry`, `My` | sens antihoraire à l’écran |
| $N$ | traction |
| $V$ | fait tourner un court tronçon de barre dans le sens horaire |
| $M$ | moment positif : fibre inférieure tendue, du côté de la ligne en pointillés |
| Réactions | la force que l’appui exerce sur la structure, signée comme une charge |

## Axes globaux {#global-axes}

Le modèle se trouve dans le plan x–z :

- **x** est horizontal, positif vers la **droite**.
- **z** est vertical, positif **vers le bas**.
- **y** sort de l’écran, vers vous, ce qui rend le repère direct. Les rotations et les moments sont comptés autour de y : le **sens antihoraire est positif**.

L’indicateur d’axes, dans le coin de la zone de dessin, montre x en rouge et z en vert. Comme z est dirigé vers le bas, le nœud en tête d’un poteau de 3 m dont le pied est en `Z = 0` a `Z = −3`. Les angles, comme celui d’un appui incliné, sont mesurés de x vers z, c’est-à-dire dans le sens horaire à l’écran.

Si vous préférez y vers le haut, changez la [convention d’affichage](#y-up-axes) : le modèle reste le même, seuls les nombres que vous lisez et saisissez changent.

## Degrés de liberté {#degrees-of-freedom}

Chaque nœud possède trois degrés de liberté (DDL) :

| DDL | Signification | Positif | Unité |
| --- | --- | --- | --- |
| `Dx` | déplacement horizontal | vers la droite | m |
| `Dz` | déplacement vertical | vers le bas | m |
| `Ry` | rotation | sens antihoraire | rad |

Les mêmes signes valent pour les [déplacements imposés](/fr/essentials/loads#prescribed-displacements-support-settlements), pour le tableau *Résultats nodaux* et pour les valeurs affichées au survol d’un nœud.

## Charges {#loads}

Les charges sont positives dans le sens des axes positifs. **Fx**, **Fz** et **My** sont les composantes d’une charge nodale ou ponctuelle, **fx** et **fz** celles d’une charge uniformément répartie, et **f₁x**, **f₂x**, **f₁z**, **f₂z** celles d’une charge trapézoïdale au début et à la fin de l’élément.

| Charge | Sens positif |
| --- | --- |
| `Fx`, `fx`, `f₁x`, `f₂x` | +x, vers la droite ; selon le x local de l’élément quand la case **LCS** est cochée |
| `Fz`, `fz`, `f₁z`, `f₂z` | +z, **vers le bas** ; selon le z local de l’élément quand la case **LCS** est cochée |
| `My` | sens antihoraire |
| `ΔTc` | échauffement de l’axe de la barre, qui l’allonge |
| `ΔTb − ΔTt` | fibre inférieure plus chaude que la fibre supérieure |

Une charge de pesanteur est donc un `fz` **positif**, et un vent qui pousse un poteau de gauche vers la droite est un `fx` positif. Une charge linéique s’applique toujours par mètre de longueur propre de la barre, même lorsqu’elle est donnée dans les axes globaux sur une barre inclinée. La page [Charges](/fr/essentials/loads#element-loads) montre comment saisir chaque type.

::model-figure{caption="Toutes les charges sont ici positives : fz = 5 kN/m sur A–B, Fz = 10 kN en B, My = 10 kNm en C et Fx = 10 kN en D"}
---
nodes: { A: [0, 0], B: [3, 0], C: [4.5, 0], D: [6, 0] }
supports: { A: fixed }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 5 }
  - { node: B, fz: 10 }
  - { node: C, my: 10 }
  - { node: D, fx: 10 }
results: []
reactions: false
show: [nodeLabels]
---
::

## Axes locaux de l’élément {#element-local-axes}

Chaque élément a ses propres axes :

- le **x local** va du nœud initial de l’élément à son nœud final ;
- le **z local** est le x local tourné de 90° **dans le sens horaire à l’écran**, la même rotation qui amène le x global sur le z global. Si vous marchez du nœud initial vers le nœud final, le z local est à votre droite.

| Élément dessiné | Le z local pointe |
| --- | --- |
| de gauche à droite | vers le bas : axes locaux et globaux confondus |
| de droite à gauche | vers le haut |
| de bas en haut | vers la droite |
| de haut en bas | vers la gauche |

L’orientation de l’élément est donnée par son angle $\theta$, mesuré de l’axe x global vers l’axe z global (dans le sens horaire à l’écran). La [matrice de passage](/fr/elements/beam#transformation-matrix) transforme les déplacements d’extrémité d’un repère à l’autre à l’aide de $\cos\theta$ et $\sin\theta$.

Dans la vue, une ligne en pointillés le long de chaque élément repère le côté de son z local positif : sa **fibre inférieure**. Les charges d’élément avec la case **LCS** cochée, la position d’une charge ponctuelle et les efforts d’extrémité suivent tous les axes locaux. Pour retourner un élément, utilisez **Inverser les nœuds** dans le tableau *Éléments* (voir [orientation de l’élément](/fr/essentials/elements#element-direction)).

## Efforts internes {#internal-forces}

Coupez une barre à la distance $x$ de son nœud initial. Sur la face de la partie située **avant** la coupure, dont la normale extérieure est dirigée selon le x local positif, les efforts internes sont positifs lorsqu’ils sont dirigés selon le x local positif, selon le z local positif et dans le sens antihoraire. Sur l’autre face, ils agissent en sens inverse.

::element-sketch{mode="internal-forces" caption="N, V et M positifs sur un court tronçon de barre : traction, couple d’efforts tranchants tournant dans le sens horaire, moment positif (fibre inférieure en pointillés tendue)"}
::

Autrement dit :

| Grandeur | Positif signifie |
| --- | --- |
| $N$ | traction |
| $V$ | il fait tourner un court tronçon de barre dans le sens horaire : pour une barre dessinée de gauche à droite, vers le haut sur la face gauche du tronçon et vers le bas sur sa face droite |
| $M$ | **moment positif** : fibre inférieure tendue, du côté des pointillés |

Avec $q_x$ et $q_z$ la charge linéique dans les axes locaux, ils vérifient

$$
\frac{\mathrm{d}N}{\mathrm{d}x} = -q_x, \qquad \frac{\mathrm{d}V}{\mathrm{d}x} = -q_z, \qquad \frac{\mathrm{d}M}{\mathrm{d}x} = V.
$$

Au droit d’une charge ponctuelle $F_x$, $F_z$ ou $M_y$ (dans les axes locaux), ils subissent un saut $\Delta N = -F_x$, $\Delta V = -F_z$ et $\Delta M = -M_y$ : une force dirigée selon le z local positif fait baisser $V$, et un moment antihoraire fait baisser $M$.

Une poutre sur deux appuis sous charge de pesanteur a donc un moment positif, un effort tranchant positif à son appui gauche et négatif à son appui droit. La poutre ci-dessous est en outre tirée au niveau de l’appui simple : son effort normal est positif.

::model-figure{caption="Poutre sur deux appuis, 10 kN/m et une traction de 20 kN : M = +45 kNm à mi-portée, V = +30 kN à l’appui gauche et −30 kN à l’appui droit, N = +20 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
  - { node: B, fx: 20 }
results: [M, V, N]
---
::

Dans une console, le moment change de signe : il est négatif, fibre supérieure tendue. Une poussée selon son axe la comprime.

::model-figure{caption="Console avec une charge de 10 kN en bout et une poussée de 15 kN : M = −40 kNm à l’encastrement, V = +10 kN, N = −15 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 10 }
  - { member: 1, px: -15, at: 4 }
results: [M, V, N]
---
::

Dans un portique, le côté inférieur de chaque barre est le côté de son z local positif : l’ordre dans lequel vous dessinez un poteau décide donc lequel de ses côtés est le « bas ». Ce portique est dessiné A → B → C → D, ce qui place le z local de chaque barre à l’intérieur : un moment positif signifie que l’intérieur du portique est tendu, et les moments négatifs aux angles signifient que l’extérieur est tendu.

::model-figure{caption="Portique dessiné A → B → C → D : le z local des trois barres pointe vers l’intérieur du portique"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: pin, D: pin }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

Les diagrammes sont tracés comme dans la plupart des cours européens : $M$ du côté tendu, $N$ et $V$ positifs du côté opposé à la ligne en pointillés. **Paramètres → Paramètres d’affichage → Diagrammes des efforts internes** permet de tracer $M$ du côté comprimé et $N$ ou $V$ du côté des pointillés. Cela change le dessin, jamais les valeurs : lisez le signe sur l’étiquette, et non d’après le côté du tracé.

## Efforts d’extrémité (tableau Résultats par élément) {#end-forces-element-results-table}

Le tableau *Résultats par élément* donne six **efforts d’extrémité** par élément, dans ses axes **locaux** :

::element-sketch{mode="end-forces" caption="Les six efforts d’extrémité, tous dessinés dans le sens positif : selon les x et z locaux, et dans le sens antihoraire"}
::

| Colonne | Agit sur l’élément à | Positif selon |
| --- | --- | --- |
| `X12`, `Z12`, `M12` | son nœud initial | x local positif, z local positif, sens antihoraire |
| `X21`, `Z21`, `M21` | son nœud final | x local positif, z local positif, sens antihoraire |

Ce sont les efforts que les nœuds exercent sur l’élément : sa matrice de rigidité multipliée par ses déplacements d’extrémité, plus les efforts qui retiendraient ses charges d’élément si ses deux extrémités étaient encastrées,

$$
\begin{gathered}
\mathbf{f} = \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}, \\[1ex]
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix} = \mathbf{K}_l\,\mathbf{d}_l - \mathbf{f}_\mathrm{eq},
\end{gathered}
$$

où $\mathbf{d}_l$ sont les déplacements d’extrémité de l’élément dans les axes locaux et $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$ les charges nodales équivalentes de ses [charges d’élément](/fr/elements/beam#element-loads).

Les efforts d’extrémité suivent les axes, et non la convention $N$–$V$–$M$ : au nœud initial, leurs signes sont donc inversés.

$$
\begin{aligned}
N(0) &= -X_{12}, & N(L) &= X_{21}, \\
V(0) &= -Z_{12}, & V(L) &= Z_{21}, \\
M(0) &= -M_{12}, & M(L) &= M_{21}.
\end{aligned}
$$

Pour la poutre sur deux appuis ci-dessus : `X12 = −20 kN` et `X21 = +20 kN` (traction), `Z12 = Z21 = −30 kN` (les deux appuis poussent vers le haut, c’est-à-dire selon −z) et `M12 = M21 = 0`.

En chaque nœud, les efforts d’extrémité des éléments qui y concourent, ramenés dans les axes globaux, ont pour somme la charge nodale plus la réaction. C’est une vérification rapide de l’équilibre d’un nœud.

## Réactions {#reactions}

Une réaction est la force ou le moment qu’un appui exerce **sur la structure**, une par DDL bloqué. Elle est signée comme une charge : positive selon +x, selon +z (vers le bas) et dans le sens antihoraire. Un appui qui porte une charge de pesanteur a donc un `Rz` **négatif**.

Les réactions sont données dans les axes globaux, ou dans les axes propres du nœud lorsque celui-ci a un **Angle du SCL nodal** (un [appui incliné](/fr/essentials/nodes-supports#inclined-skewed-supports)). Dans la vue, chaque réaction est une flèche orientée dans le sens où l’appui pousse, avec sa valeur absolue en étiquette. Les valeurs signées figurent dans l’export CSV, sous `Rx`, `Rz` et `My`.

## Axes y vers le haut {#y-up-axes}

**Paramètres → Langue et paramètres régionaux → Système de coordonnées → x vers la droite, y vers le haut** fait passer tout ce que vous saisissez et lisez au repère des manuels : **x** vers la droite, **y** vers le haut et **z** vers vous. Le modèle, les fichiers enregistrés et les dessins restent exactement les mêmes ; seuls les nombres et les lettres changent :

| Grandeur | x vers la droite, z vers le bas (par défaut) | x vers la droite, y vers le haut |
| --- | --- | --- |
| Coordonnée verticale | `Z` | `Y`, signe opposé |
| Charges, déplacements, réactions et efforts d’extrémité verticaux | `Fz`, `fz`, `Dz`, `Rz`, `Z12`… | `Fy`, `fy`, `Dy`, `Ry`, `Y12`…, signe opposé |
| Rotations et moments | `Ry`, `My` | `Rz`, `Mz`, même signe (positif dans le sens antihoraire) |
| Angle d’appui | mesuré dans le sens horaire | mesuré dans le sens antihoraire, signe opposé |
| Efforts internes | $N$, $V$, $M$ | identiques, avec les mêmes signes, tracés de la même façon |

Avec y vers le haut, une charge de pesanteur est donc un `fy` **négatif**, et la tête d’un poteau de 3 m a `Y = 3`.

## Unités {#units}

Le solveur travaille partout en SI : m, N, Pa, rad, et K pour les variations de température. Les unités d’affichage de la page [Unités et paramètres](/fr/essentials/units-settings) ne changent que ce que vous saisissez et lisez, jamais le modèle.
