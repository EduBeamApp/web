---
description: "Poutre de Timoshenko à deux nœuds : rigidité exacte, déformation d’effort tranchant, rotules par condensation, efforts d’encastrement, matrice de passage."
source: site
---

# Élément poutre

Dans EduBeam, chaque barre, qu’il s’agisse d’une poutre, d’un poteau ou d’une barre de treillis, est le même élément : une **poutre de Timoshenko** droite à deux nœuds, dans le plan x–z, de section constante. Cette page donne sa formulation exactement telle que le solveur la calcule ; vous pouvez ainsi reconstruire à la main n’importe quelle matrice d’élément ou vecteur de charges et la comparer avec l’application. Les signes sont ceux de la page [Repère et conventions de signes](/fr/elements/conventions), le code se trouve dans `Beam2D.ts` de [@edubeam/fem](/fr/solver), et la page [Comment EduBeam résout un modèle](/fr/elements/analysis) montre comment les éléments s’assemblent pour donner la solution.

## Degrés de liberté {#degrees-of-freedom}

Chaque nœud possède trois degrés de liberté (DDL), l’élément en a donc six. Dans les [axes locaux](/fr/elements/conventions#element-local-axes) de l’élément, à chaque déplacement d’extrémité correspond un [effort d’extrémité](/fr/elements/conventions#end-forces-element-results-table), c’est-à-dire une colonne du tableau *Résultats par élément* :

::element-sketch{mode="dofs" caption="Les six degrés de liberté de l’élément poutre, tous dessinés dans le sens positif ; la ligne en pointillés repère la fibre inférieure (z local positif)"}
::

| Direction | Nœud initial (1) | Nœud final (2) |
| --- | --- | --- |
| selon x local | $u_1$ et `X12` | $u_2$ et `X21` |
| selon z local, vers le bas pour un élément dessiné de gauche à droite | $w_1$ et `Z12` | $w_2$ et `Z21` |
| rotation, sens antihoraire | $\varphi_1$ et `M12` | $\varphi_2$ et `M21` |

Dans cet ordre, ils forment les vecteurs des déplacements et des efforts de l’élément :

$$
\begin{aligned}
\mathbf{d}_l &= \begin{bmatrix} u_1 & w_1 & \varphi_1 & u_2 & w_2 & \varphi_2 \end{bmatrix}^\mathsf{T}, \\
\mathbf{f} &= \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}.
\end{aligned}
$$

Comme z est dirigé vers le bas et que les rotations sont comptées dans le sens antihoraire, l’axe d’une poutre sans déformation d’effort tranchant tourne de $\varphi = -\,\mathrm{d}w/\mathrm{d}x$.

## Matrice de rigidité locale {#local-stiffness-matrix}

Pour un élément sans charge d’élément, les efforts d’extrémité valent $\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l$, avec

$$
\mathbf{K}_l =
\begin{bmatrix}
 k_N & 0 & 0 & -k_N & 0 & 0 \\
 0 & k_1 & -k_2 & 0 & -k_1 & -k_2 \\
 0 & -k_2 & k_3 & 0 & k_2 & k_4 \\
 -k_N & 0 & 0 & k_N & 0 & 0 \\
 0 & -k_1 & k_2 & 0 & k_1 & k_2 \\
 0 & -k_2 & k_4 & 0 & k_2 & k_3
\end{bmatrix}
$$

et

$$
\begin{aligned}
k_N &= \frac{EA}{L}, & k_1 &= \frac{12\,EI_y}{(1+\Phi)\,L^3}, \\[1ex]
k_2 &= \frac{6\,EI_y}{(1+\Phi)\,L^2}, & k_3 &= \frac{(4+\Phi)\,EI_y}{(1+\Phi)\,L}, \\[1ex]
k_4 &= \frac{(2-\Phi)\,EI_y}{(1+\Phi)\,L}, & \Phi &= \frac{12\,EI_y}{k\,GA\,L^2}.
\end{aligned}
$$

$E$ et $G$ sont le module d’Young et le module de cisaillement du matériau, $A$ l’aire de la section, $I_y$ son moment quadratique par rapport à y, $k$ le **Coefficient de cisaillement** de la section et $L$ la longueur de l’élément. $\Phi$ est le **paramètre de cisaillement** : il mesure la souplesse de la barre à l’effort tranchant par rapport à sa souplesse en flexion, et il augmente quand la barre devient courte et haute. Avec $\Phi = 0$, on retrouve les termes bien connus $12EI/L^3$, $6EI/L^2$, $4EI/L$ et $2EI/L$ de la poutre d’Euler–Bernoulli. Les comportements axial et en flexion sont découplés : $u_1$ et $u_2$ ne font intervenir que $k_N$.

Les manuels qui orientent y vers le haut écrivent $+6EI/L^2$ là où cette matrice contient $-k_2$. Les deux décrivent la même rigidité ; seul le sens du déplacement transversal diffère.

::callout{type="details" title="D’où vient la matrice : les fonctions de forme exactes"}
Pour une barre prismatique de Timoshenko non chargée, les équations d’équilibre ont une solution exacte : $u$ est linéaire en $x$, $w$ cubique et $\varphi$ quadratique. Exprimée en fonction des déplacements d’extrémité, avec $\xi = x/L$, la flèche s’écrit

$$
w(\xi) = N_1\,w_1 + N_2\,\varphi_1 + N_3\,w_2 + N_4\,\varphi_2,
$$

$$
\begin{aligned}
N_1 &= \frac{(1-\xi)\,(1+\Phi+\xi-2\xi^2)}{1+\Phi}, \\[1ex]
N_2 &= -\frac{L\,\xi\,(1-\xi)\,(2+\Phi-2\xi)}{2\,(1+\Phi)}, \\[1ex]
N_3 &= \frac{\xi\,(\Phi+3\xi-2\xi^2)}{1+\Phi}, \\[1ex]
N_4 &= \frac{L\,\xi\,(1-\xi)\,(\Phi+2\xi)}{2\,(1+\Phi)}.
\end{aligned}
$$

Pour $\Phi = 0$, ce sont les polynômes cubiques d’Hermite, $N_1 = 1 - 3\xi^2 + 2\xi^3$ et $N_2 = -L\,\xi(1-\xi)^2$, le signe moins venant de $\varphi = -w'$. La matrice de rigidité contient les efforts d’extrémité qu’exigent ces formes exactes : c’est donc la rigidité exacte de la barre, et non une approximation qui s’améliore quand on multiplie les éléments. Le solveur dessine la déformée avec ces mêmes fonctions.
::

## Déformation d’effort tranchant : Timoshenko ou Euler–Bernoulli ? {#timoshenko-or-euler-bernoulli}

La déformation d’effort tranchant de l’élément ne dépend que de $\Phi$, donc du coefficient de cisaillement $k$ de la section : $kA$ est l’aire qui reprend l’effort tranchant (aire réduite). Chaque type de section a sa propre valeur initiale de $k$ :

| Section | Coefficient de cisaillement $k$ |
| --- | --- |
| Le modèle de départ et les exemples intégrés | $10^{32}$, ce qui donne $\Phi \approx 0$ : Euler–Bernoulli |
| Profilés I, H et à larges ailes de la bibliothèque | $h\,t_w / A$ : l’âme reprend l’effort tranchant |
| Profilés creux rectangulaires de la bibliothèque | $2\,h\,t / A$ : les deux parois latérales |
| Rectangles et carrés de la bibliothèque | 0,833 |
| Cercles de la bibliothèque | 0,9 |
| Profilés creux circulaires de la bibliothèque | 0,5 |
| Sections polygonales | 0,833 au départ |
| Boîte de dialogue **Ajouter une section** | 1 au départ |

Pour une barre élancée, l’écart est faible. Sous une charge uniformément répartie, l’effort tranchant ajoute $0{,}8\,\Phi$ à la flèche de flexion à mi-portée d’une poutre sur deux appuis. Pour un IPE 200 en acier, cela fait 1,2 % sur 6 m, mais 11 % sur 2 m. Pour supprimer la déformation d’effort tranchant, donnez à $k$ une très grande valeur, par exemple `1e32`. Sauf mention contraire, les figures interactives de ce site utilisent la section des exemples, rigide à l’effort tranchant, et concordent donc avec un calcul à la main selon la théorie d’Euler–Bernoulli. Celle ci-dessous fait exception :

::model-figure{caption="IPE 200 sur 2 m avec k = h·tw/A = 0,393 : w = 0,5657 mm à mi-portée, soit 11 % de plus que les 0,5106 mm de la théorie d’Euler–Bernoulli (Φ = 0,135)"}
---
nodes: { A: [0, 0], B: [2, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
material: { e: 210e9, g: 81e9 }
section: { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 }
results: [w, M]
---
::

## Rotules d’extrémité {#end-hinges}

Une [rotule d’extrémité](/fr/essentials/elements#end-hinges) cochée annule le moment à cette extrémité de l’élément. La rotation d’extrémité de l’élément devient alors libre, et le solveur l’élimine par **condensation statique**. Répartissons les six DDL entre les DDL conservés, $a$, et les rotations d’extrémité libérées, $b$ :

$$
\begin{bmatrix} \mathbf{f}_a \\ \mathbf{0} \end{bmatrix}
=
\begin{bmatrix} \mathbf{K}_{aa} & \mathbf{K}_{ab} \\ \mathbf{K}_{ba} & \mathbf{K}_{bb} \end{bmatrix}
\begin{bmatrix} \mathbf{d}_a \\ \mathbf{d}_b \end{bmatrix}
+
\begin{bmatrix} \mathbf{f}_{\mathrm{fix},a} \\ \mathbf{f}_{\mathrm{fix},b} \end{bmatrix}.
$$

Ici, $\mathbf{f}_\mathrm{fix}$ désigne les efforts d’encastrement parfait dus aux [charges d’élément](#element-loads). La deuxième ligne donne la rotation à la rotule,

$$
\mathbf{d}_b = -\mathbf{K}_{bb}^{-1}\left(\mathbf{K}_{ba}\,\mathbf{d}_a + \mathbf{f}_{\mathrm{fix},b}\right),
$$

et en la reportant dans la première ligne, il reste la rigidité et les efforts d’encastrement condensés

$$
\begin{aligned}
\mathbf{K}^{*} &= \mathbf{K}_{aa} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}, \\
\mathbf{f}^{*}_\mathrm{fix} &= \mathbf{f}_{\mathrm{fix},a} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{f}_{\mathrm{fix},b}.
\end{aligned}
$$

Le solveur réécrit $\mathbf{K}^{*}$ dans une matrice 6 × 6, avec des lignes et des colonnes nulles pour les rotations libérées : un élément muni de rotules s’assemble donc exactement comme les autres. Après la résolution, le solveur retrouve $\mathbf{d}_b$ par la formule ci-dessus, et la déformée montre le changement de pente à la rotule.

Avec une rotule au nœud final, la partie de flexion pour $(w_1, \varphi_1, w_2)$ devient

$$
\mathbf{K}^{*}_{w} = \frac{12\,EI_y}{(4+\Phi)\,L^3}
\begin{bmatrix} 1 & -L & -1 \\ -L & L^2 & L \\ -1 & L & 1 \end{bmatrix},
$$

ce qui donne pour $\Phi = 0$ la rigidité classique $3EI/L^3$ d’une barre encastrée-appuyée. Avec des rotules aux **deux** extrémités, il ne reste rien des termes de flexion, seulement $EA/L$ : l’élément est une [barre de treillis](/fr/elements/truss).

Une rotule appartient à une extrémité d’élément, pas au nœud. Si tous les éléments qui concourent en un nœud y sont munis d’une rotule, rien n’est relié à la rotation propre du nœud. Le solveur la laisse nulle, ce qui est sans conséquence, mais un moment nodal appliqué en un tel nœud n’a rien sur quoi agir et rend le système singulier.

## Charges d’élément {#element-loads}

Les charges appliquées le long d’un élément entrent dans la résolution sous forme de **charges nodales équivalentes**, $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. Les **efforts d’encastrement parfait** $\mathbf{f}_\mathrm{fix}$ sont les efforts d’extrémité qui maintiennent l’élément chargé lorsque ses deux extrémités sont encastrées.

Toutes les formules ci-dessous sont écrites dans les axes locaux. Une charge saisie dans les axes globaux (case **LCS** décochée) est d’abord décomposée en composantes locales à l’aide de $c = \cos\theta$ et $s = \sin\theta$, où $\theta$ est l’[angle](#transformation-matrix) de l’élément :

$$
q_x = c\,\bar q_x + s\,\bar q_z, \qquad q_z = -s\,\bar q_x + c\,\bar q_z,
$$

les composantes globales étant surmontées d’un trait. Les charges linéiques s’appliquent par mètre de longueur propre de l’élément. Un arbalétrier allant de $(0, 0)$ à $(3, -4)$, par exemple, a $L = 5$ m, $c = 0{,}6$ et $s = -0{,}8$ (il monte, donc $z$ diminue). Une charge de pesanteur $\bar q_z = 10$ kN/m s’y décompose en $q_x = -8$ kN/m, vers le bas de la pente, et $q_z = 6$ kN/m perpendiculairement à l’arbalétrier, qui porte au total $10 \times 5 = 50$ kN, et non $10 \times 3$.

Dans les tableaux :

- $q_z$, $q_x$ : charge uniformément répartie ; $q_1 \to q_2$ : charge trapézoïdale, $q_1$ au nœud initial et $q_2$ au nœud final.
- $F_z$, $F_x$, $M_y$ : force ou moment à la distance $a$ du nœud initial, avec $b = L - a$.
- $\Delta T = \Delta T_b - \Delta T_t$ : fibre inférieure plus chaude que la fibre supérieure ; $\Delta T_c$ : échauffement de l’axe. $\alpha$ est le coefficient de dilatation thermique du matériau et $h$ la **Hauteur** de la section.

Perpendiculairement à l’axe (composantes z) et pour $\Phi = 0$, au nœud initial :

$$
\begin{array}{l|cc}
\text{Charge} & Z_{12} & M_{12} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & \dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(7q_1+3q_2)}{20} & \dfrac{L^2\,(3q_1+2q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,b^2\,(3a+b)}{L^3} & \dfrac{F_z\,a\,b^2}{L^2} \\[3ex]
M_y & -\dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,b\,(b-2a)}{L^2} \\[3ex]
\Delta T & 0 & \dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

Au nœud final :

$$
\begin{array}{l|cc}
\text{Charge} & Z_{21} & M_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & -\dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(3q_1+7q_2)}{20} & -\dfrac{L^2\,(2q_1+3q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,a^2\,(a+3b)}{L^3} & -\dfrac{F_z\,a^2\,b}{L^2} \\[3ex]
M_y & \dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,a\,(a-2b)}{L^2} \\[3ex]
\Delta T & 0 & -\dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

Selon l’axe (composantes x), pour toute valeur de $\Phi$ :

$$
\begin{array}{l|cc}
\text{Charge} & X_{12} & X_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_x & -\dfrac{q_x L}{2} & -\dfrac{q_x L}{2} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(2q_1+q_2)}{6} & -\dfrac{L\,(q_1+2q_2)}{6} \\[3ex]
F_x & -\dfrac{F_x\,b}{L} & -\dfrac{F_x\,a}{L} \\[3ex]
\Delta T_c & EA\,\alpha\,\Delta T_c & -EA\,\alpha\,\Delta T_c
\end{array}
$$

::callout{type="details" title="Efforts d’encastrement parfait avec déformation d’effort tranchant"}
La charge uniformément répartie et la charge thermique donnent les mêmes efforts d’encastrement quel que soit $\Phi$. Pour les autres, avec $D = 1 + \Phi$ et $\Delta q = q_2 - q_1$ (composantes z) :

$$
\begin{aligned}
&\text{Charge trapézoïdale~:} \\
Z_{12} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(9+10\Phi)}{60\,D}, \\[1ex]
M_{12} &= \frac{q_1 L^2}{12} + \frac{\Delta q\,L^2\,(4+5\Phi)}{120\,D}, \\[1ex]
Z_{21} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(21+20\Phi)}{60\,D}, \\[1ex]
M_{21} &= -\frac{q_1 L^2}{12} - \frac{\Delta q\,L^2\,(6+5\Phi)}{120\,D}; \\[3ex]
&\text{Force } F_z\text{~:} \\
Z_{12} &= -\frac{F_z\,b\,(\Phi L^2 + 3ab + b^2)}{D\,L^3}, \\[1ex]
M_{12} &= \frac{F_z\,a\,b\,(\Phi L + 2b)}{2\,D\,L^2}, \\[1ex]
Z_{21} &= -\frac{F_z\,a\,(\Phi L^2 + a^2 + 3ab)}{D\,L^3}, \\[1ex]
M_{21} &= -\frac{F_z\,a\,b\,(\Phi L + 2a)}{2\,D\,L^2}; \\[3ex]
&\text{Moment } M_y\text{~:} \\
Z_{12} &= -\frac{6\,a\,b\,M_y}{D\,L^3}, \qquad Z_{21} = \frac{6\,a\,b\,M_y}{D\,L^3}, \\[1ex]
M_{12} &= -\frac{M_y\,b\,(\Phi L - 2a + b)}{D\,L^2}, \\[1ex]
M_{21} &= -\frac{M_y\,a\,(\Phi L + a - 2b)}{D\,L^2}.
\end{aligned}
$$

Ce sont les solutions exactes d’une barre de Timoshenko bi-encastrée, tout comme la flèche que le solveur ajoute entre les nœuds pour chaque charge.
::

Sur un élément muni de rotules, les efforts d’encastrement sont condensés en $\mathbf{f}^{*}_\mathrm{fix}$, comme dans [Rotules d’extrémité](#end-hinges). Une charge uniformément répartie sur un élément avec une rotule au nœud final donne par exemple $Z_{12} = -5q_zL/8$, $M_{12} = q_zL^2/8$, $Z_{21} = -3q_zL/8$ et $M_{21} = 0$ (pour $\Phi = 0$) : les efforts d’encastrement d’une poutre encastrée-appuyée.

Après la résolution, les efforts internes le long de l’élément se déduisent de ses efforts d’extrémité et de la statique de la charge qu’il porte ; la flèche s’obtient par les fonctions de forme, augmentées de la flèche de l’élément bi-encastré sous cette charge : voir [Résultats le long des barres](/fr/elements/analysis#results-along-the-members).

## Matrice de passage {#transformation-matrix}

Un élément incliné de l’angle $\theta$, mesuré de l’axe x global vers l’axe z global (dans le sens horaire à l’écran), a

$$
c = \cos\theta = \frac{x_2 - x_1}{L}, \qquad s = \sin\theta = \frac{z_2 - z_1}{L},
$$

et ses déplacements d’extrémité locaux se déduisent des déplacements globaux par $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, avec

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 & 0 & 0 \\
 -s & c & 0 & 0 & 0 & 0 \\
 0 & 0 & 1 & 0 & 0 & 0 \\
 0 & 0 & 0 & c & s & 0 \\
 0 & 0 & 0 & -s & c & 0 \\
 0 & 0 & 0 & 0 & 0 & 1
\end{bmatrix}.
$$

Les rotations sont les mêmes dans les deux repères. Si un nœud a un **Angle du SCL nodal** $\beta$ (un [appui incliné](/fr/essentials/nodes-supports#inclined-skewed-supports)), ses inconnues $\mathbf{d}_n$ sont exprimées dans ses propres axes, tournés de $\beta$ de l’axe x global vers l’axe z global. Leurs composantes globales sont

$$
\mathbf{d}_g = \mathbf{T}_n\,\mathbf{d}_n, \qquad
\mathbf{T}_n = \begin{bmatrix} \cos\beta & -\sin\beta & 0 \\ \sin\beta & \cos\beta & 0 \\ 0 & 0 & 1 \end{bmatrix}
$$

pour les trois DDL de ce nœud. Le solveur multiplie $\mathbf{T}$ à droite par la matrice diagonale par blocs formée des $\mathbf{T}_n$ des deux nœuds d’extrémité (la matrice identité pour un nœud sans axes propres) : l’élément se raccorde ainsi à chaque nœud dans les axes de ce nœud.

## Matrice de rigidité globale {#global-stiffness-matrix}

Dans les axes globaux, la matrice de rigidité de l’élément et ses charges nodales équivalentes s’écrivent

$$
\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T},
\qquad
\mathbf{f}_{\mathrm{eq},g} = \mathbf{T}^\mathsf{T}\,\mathbf{f}_\mathrm{eq},
$$

$\mathbf{K}_l$ et $\mathbf{f}_\mathrm{eq}$ étant déjà condensés si l’élément a des rotules. C’est $\mathbf{K}_g$ que montre la fenêtre **Matrice de rigidité** d’un élément (ouvrez-la depuis le tableau *Éléments* ou le menu contextuel de l’élément), en unités SI : N/m, N et N·m. La page [Comment EduBeam résout un modèle](/fr/elements/analysis) assemble ces matrices et résout un petit exemple à la main.
