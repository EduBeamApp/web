---
description: "La barre de treillis dans EduBeam : un élément poutre à deux rotules, pourquoi c’est l’élément de treillis classique, ses matrices de rigidité et de passage."
source: site
---

# Barre de treillis

Une barre de treillis ne reprend que l’effort normal. EduBeam n’a pas d’élément de treillis distinct : une barre de treillis est un [élément poutre](/fr/elements/beam) dont les **deux rotules d’extrémité** sont cochées. Cette page montre pourquoi c’est exactement l’élément de treillis classique à deux nœuds, donne ses matrices de rigidité et de passage, et explique ce qu’une barre à rotules sait faire de plus qu’une barre de treillis des manuels.

::model-figure{caption="Toutes les barres ont des rotules aux deux extrémités : les arbalétriers portent N = −7,071 kN, le tirant +5 kN, et aucune barre ne fléchit"}
---
nodes: { A: [0, 0], B: [6, 0], C: [3, -3] }
supports: { A: pin, B: roller }
members:
  - { nodes: [A, C], hinges: [true, true] }
  - { nodes: [C, B], hinges: [true, true] }
  - { nodes: [A, B], hinges: [true, true] }
loads:
  - { node: C, fz: 10 }
results: [N]
show: [nodeLabels]
---
::

Pour modéliser un treillis dans l’application, cochez **Rotule au début** et **Rotule à la fin** pour chaque barre, ou cochez les deux dans le bandeau avant de dessiner les barres à la souris ([rotules d’extrémité](/fr/essentials/elements#end-hinges)). Le [tutoriel du treillis plan](/fr/tutorials/truss) en construit un pas à pas.

## Degrés de liberté {#degrees-of-freedom}

Une barre de treillis travaille avec les deux translations de chacune de ses extrémités, exprimées dans ses [axes locaux](/fr/elements/conventions#element-local-axes) :

::element-sketch{mode="dofs" :hinges='[true,true]' :rotations='false' caption="Une barre de treillis : des rotules aux deux extrémités, deux translations à chacune"}
::

| Direction | Nœud initial (1) | Nœud final (2) |
| --- | --- | --- |
| selon x local | $u_1$ et `X12` | $u_2$ et `X21` |
| selon z local | $w_1$ et `Z12` | $w_2$ et `Z21` |

$$
\mathbf{d}_l = \begin{bmatrix} u_1 & w_1 & u_2 & w_2 \end{bmatrix}^\mathsf{T}.
$$

Les nœuds conservent leur rotation `Ry`, puisque chaque barre est un élément poutre, mais une barre munie de rotules aux deux extrémités ne la ressent pas et ne la transmet pas : ses moments d’extrémité `M12` et `M21` sont toujours nuls. Dans un nœud où toutes les barres ont une rotule, rien ne retient cette rotation. Le solveur la laisse nulle, mais un moment nodal appliqué en un tel nœud n’a rien sur quoi agir, et le calcul s’arrête sur le message *La structure est un mécanisme : la matrice de rigidité est singulière.*

## Matrice de rigidité locale {#local-stiffness-matrix}

$$
\mathbf{K}_l = \frac{EA}{L}
\begin{bmatrix}
 1 & 0 & -1 & 0 \\
 0 & 0 & 0 & 0 \\
 -1 & 0 & 1 & 0 \\
 0 & 0 & 0 & 0
\end{bmatrix},
$$

où $E$ est le module d’Young, $A$ l’aire de la section et $L$ la longueur. Seul l’allongement de la barre demande de l’énergie ; l’effort normal d’une barre sans charge d’élément est donc constant :

$$
N = \frac{EA}{L}\,(u_2 - u_1).
$$

### Pourquoi une poutre à deux rotules est une barre de treillis {#why-a-beam-with-two-hinges-is-a-truss-bar}

Éliminez par condensation les deux rotations d’extrémité de la [matrice de rigidité de la poutre](/fr/elements/beam#local-stiffness-matrix), comme pour toute [rotule d’extrémité](/fr/elements/beam#end-hinges). Les termes axiaux ne font pas intervenir les rotations et restent inchangés. Les termes de flexion disparaissent entièrement : dès que les deux rotations sont libres, n’importe quel couple de déplacements d’extrémité $w_1$, $w_2$ ne fait que tourner la barre en bloc, comme un corps rigide, autour de ses rotules, ce qui ne demande aucune énergie. Le solveur effectue cette condensation numériquement, pour n’importe quel coefficient de cisaillement, et obtient la matrice ci-dessus aux erreurs d’arrondi près.

::callout{type="details" title="La condensation pas à pas"}
Pour la partie de flexion, rangez les DDL en DDL conservés, $a = (w_1, w_2)$, et libérés, $b = (\varphi_1, \varphi_2)$. À partir de la matrice de la poutre, avec $k_1$ à $k_4$ et le paramètre de cisaillement $\Phi$ définis [sur la page de l’élément poutre](/fr/elements/beam#local-stiffness-matrix),

$$
\begin{aligned}
\mathbf{K}_{aa} &= k_1 \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{ab} &= k_2 \begin{bmatrix} -1 & -1 \\ 1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{bb} &= \begin{bmatrix} k_3 & k_4 \\ k_4 & k_3 \end{bmatrix}.
\end{aligned}
$$

Comme les deux colonnes de $\mathbf{K}_{ab}$ sont égales, seule compte la somme des termes de $\mathbf{K}_{bb}^{-1}$, qui vaut $2/(k_3 + k_4)$ :

$$
\mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}
= \frac{2\,k_2^2}{k_3 + k_4} \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}.
$$

Avec $k_3 + k_4 = 6EI_y / ((1+\Phi)L)$, le facteur vaut $\dfrac{12\,EI_y}{(1+\Phi)L^3} = k_1$ : ce produit est donc exactement $\mathbf{K}_{aa}$, et la rigidité de flexion condensée $\mathbf{K}_{aa} - \mathbf{K}_{ab}\mathbf{K}_{bb}^{-1}\mathbf{K}_{ba}$ est nulle.
::

## Matrice de passage {#transformation-matrix}

Pour une barre inclinée de l’angle $\theta$ de l’axe x global vers l’axe z global, avec $c = \cos\theta = (x_2 - x_1)/L$ et $s = \sin\theta = (z_2 - z_1)/L$, les déplacements locaux valent $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, avec

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 \\
 -s & c & 0 & 0 \\
 0 & 0 & c & s \\
 0 & 0 & -s & c
\end{bmatrix}:
$$

ce sont les lignes et les colonnes des translations de la [matrice de passage de la poutre](/fr/elements/beam#transformation-matrix). Attention au signe de $s$ avec z dirigé vers le bas : l’arbalétrier A → C du treillis ci-dessus monte, donc $z_2 - z_1 = -3$ m, $c = 0{,}7071$ et $s = -0{,}7071$.

## Matrice de rigidité globale {#global-stiffness-matrix}

En développant $\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T}$, on obtient

$$
\mathbf{K}_g = \frac{EA}{L}
\begin{bmatrix}
 c^2 & cs & -c^2 & -cs \\
 cs & s^2 & -cs & -s^2 \\
 -c^2 & -cs & c^2 & cs \\
 -cs & -s^2 & cs & s^2
\end{bmatrix}.
$$

Pour une barre à rotules, la fenêtre **Matrice de rigidité** affiche ces valeurs dans les lignes et les colonnes des translations, et des zéros pour les rotations.

## Ce qu’une poutre à rotules fait de plus qu’une barre de treillis {#where-a-hinged-beam-does-more}

Comme une barre de treillis reste un élément poutre dans EduBeam, elle sait faire deux choses dont une barre de treillis des manuels est incapable :

- **Porter des charges sur sa longueur.** Une charge linéique sur une barre, son poids propre par exemple, la fait fléchir entre ses nœuds comme une poutre sur deux appuis et transmet $qL/2$ à chaque nœud. Les autres barres reprennent les efforts normaux du treillis sous ces charges nodales. Dans la barre chargée elle-même, la composante de la charge parallèle à la barre fait varier $N$ linéairement, et l’effort de treillis est sa valeur à mi-longueur.
- **Se combiner avec des poutres.** Un portique peut contenir des barres à rotules, un tirant ou une diagonale de contreventement par exemple, sans type d’élément particulier.

Ajoutez 5 kN/m sur le tirant du treillis ci-dessus :

::model-figure{caption="Le même treillis avec 5 kN/m sur le tirant : les efforts normaux ne changent pas, et le tirant fléchit avec M = qL²/8 = 22,5 kNm"}
---
nodes: { A: [0, 0], B: [6, 0], C: [3, -3] }
supports: { A: pin, B: roller }
members:
  - { nodes: [A, C], hinges: [true, true] }
  - { nodes: [C, B], hinges: [true, true] }
  - { nodes: [A, B], hinges: [true, true] }
loads:
  - { node: C, fz: 10 }
  - { member: 3, qz: 5 }
results: [M, N]
show: [nodeLabels]
---
::

La vérification à la main : en C, l’équilibre vertical $2\,N \sin 45^\circ + 10 = 0$ donne $N = -7{,}071$ kN dans chaque arbalétrier. En A, la composante horizontale de l’effort dans l’arbalétrier, $7{,}071 \cos 45^\circ = 5$ kN, est équilibrée par le tirant, tendu avec $N = +5$ kN. La charge sur le tirant descend directement dans les appuis situés à ses extrémités : elle ajoute $qL/2 = 15$ kN à chaque réaction, mais rien aux efforts normaux.

Un treillis doit être stable en tant que système articulé. Un panneau carré sans diagonale, par exemple, est un mécanisme : EduBeam désigne les rotules et montre le mouvement ([dépannage](/fr/reference/troubleshooting#no-results-are-drawn)).
