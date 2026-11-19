---
description: "La méthode des déplacements d’EduBeam, déroulée à la main sur une poutre encastrée-appuyée : numérotation des DDL, assemblage, appuis, réactions, résultats."
source: site
---

# Comment EduBeam résout un modèle

À chaque modification du modèle, EduBeam le recalcule par la **méthode des déplacements** (méthode directe des rigidités), dans votre navigateur, en quelques millisecondes. Cette page suit pas à pas le solveur [@edubeam/fem](/fr/solver) sur un petit exemple : vous pourrez refaire chaque calcul à la main et comprendre pourquoi les résultats sont fiables.

L’exemple est une poutre encastrée-appuyée : un IPE 300 en acier de 4 m de long, encastré en A, sur un appui simple en B, sous 10 kN/m. Sa rigidité vaut $EI = 210 \text{ GPa} \times 8356 \text{ cm}^4 = 17\,548$ kNm² et, sans déformation d’effort tranchant, les formules classiques donnent $M_A = -qL^2/8 = -20$ kNm, $R_B = 3qL/8 = 15$ kN et $\varphi_B = qL^3/(48EI)$.

::model-figure{caption="Poutre encastrée-appuyée, IPE 300, 10 kN/m : M = −20 kNm en A et +11,25 kNm à 2,5 m, réactions de 25 kN et 15 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
section: { a: 53.8e-4, iy: 8.356e-5, h: 0.3 }
results: [M, V, w]
show: [nodeLabels]
---
::

## Du modèle aux déplacements {#from-model-to-displacements}

::div{.steps}
### Numéroter les degrés de liberté {#number-the-degrees-of-freedom}

Chaque nœud reçoit les DDL dont ses éléments ont besoin. Tous les éléments sont des [éléments poutre](/fr/elements/beam) : chaque nœud a donc `Dx`, `Dz` et `Ry`. Le solveur numérote d’abord les DDL **libres**, puis les DDL **bloqués**, nœud par nœud. Ici, A est encastré et B n’est retenu que verticalement : deux DDL sont libres.

$$
\begin{gathered}
\mathbf{r} = \begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix},
\qquad
\mathbf{r}_u = \begin{bmatrix} u_B \\ \varphi_B \end{bmatrix}, \\[1ex]
\mathbf{r}_p = \begin{bmatrix} u_A & w_A & \varphi_A & w_B \end{bmatrix}^\mathsf{T}.
\end{gathered}
$$

$u$, $w$ et $\varphi$ sont les déplacements selon x et z et la rotation, comme dans le [tableau des DDL](/fr/elements/conventions#degrees-of-freedom). Chaque élément garde un **vecteur de localisation** : les positions de ses six DDL dans $\mathbf{r}$. En comptant à partir de 1, les DDL de la poutre $(u_A, w_A, \varphi_A, u_B, w_B, \varphi_B)$ occupent les positions $(3, 4, 5, 1, 6, 2)$.

### Calculer les matrices des éléments {#compute-the-element-matrices}

Pour chaque élément, le solveur construit la [matrice de rigidité locale](/fr/elements/beam#local-stiffness-matrix), condense les éventuelles [rotules d’extrémité](/fr/elements/beam#end-hinges) et la ramène dans les axes globaux, $\mathbf{K}_g = \mathbf{T}^\mathsf{T}\mathbf{K}_l\,\mathbf{T}$. Chaque charge d’élément devient des [charges nodales équivalentes](/fr/elements/beam#element-loads), $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. Notre poutre est horizontale, donc $\mathbf{T}$ est la matrice identité, et la charge uniformément répartie donne, en kN et kNm,

$$
\mathbf{f}_\mathrm{eq} = \begin{bmatrix} 0 \\[0.5ex] qL/2 \\[0.5ex] -qL^2/12 \\[0.5ex] 0 \\[0.5ex] qL/2 \\[0.5ex] qL^2/12 \end{bmatrix}
= \begin{bmatrix} 0 \\[0.5ex] 20 \\[0.5ex] -13{,}33 \\[0.5ex] 0 \\[0.5ex] 20 \\[0.5ex] 13{,}33 \end{bmatrix}.
$$

### Assembler {#assemble}

La matrice de rigidité globale $\mathbf{K}$ part de zéro. Chaque élément ajoute son terme $(i, j)$ à la ligne et à la colonne que son vecteur de localisation indique pour $i$ et $j$ : là où plusieurs éléments se rejoignent en un nœud, leurs rigidités pour les DDL de ce nœud s’additionnent. Le vecteur des charges $\mathbf{F}$ rassemble de la même façon les charges nodales et les charges nodales équivalentes. Les déplacements imposés (tassements) vont dans $\mathbf{r}_p$. Avec l’ordre « libres d’abord, bloqués ensuite », le système se découpe en blocs :

$$
\begin{bmatrix} \mathbf{K}_{uu} & \mathbf{K}_{up} \\ \mathbf{K}_{pu} & \mathbf{K}_{pp} \end{bmatrix}
\begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix}
=
\begin{bmatrix} \mathbf{F}_u \\ \mathbf{F}_p + \mathbf{R} \end{bmatrix},
$$

où $\mathbf{R}$ sont les réactions inconnues. Dans l’exemple, seules les lignes et les colonnes de l’extrémité B de la poutre tombent dans $\mathbf{K}_{uu}$ :

$$
\begin{aligned}
\mathbf{K}_{uu} &= \begin{bmatrix} EA/L & 0 \\ 0 & 4EI/L \end{bmatrix} \\[1ex]
&= \begin{bmatrix} 282\,450 \text{ kN/m} & 0 \\ 0 & 17\,548 \text{ kNm} \end{bmatrix}, \\[1ex]
\mathbf{F}_u &= \begin{bmatrix} 0 \\ 13{,}33 \text{ kNm} \end{bmatrix}.
\end{aligned}
$$

### Appliquer les appuis et résoudre {#apply-the-supports-and-solve}

Les appuis ne sont ni des ressorts ni de grands nombres placés sur la diagonale : les DDL bloqués sont simplement séparés des autres. Les déplacements libres découlent de

$$
\mathbf{K}_{uu}\,\mathbf{r}_u = \mathbf{F}_u - \mathbf{K}_{up}\,\mathbf{r}_p,
$$

système résolu par décomposition LU. Sans tassement, $\mathbf{r}_p = \mathbf{0}$, et ici

$$
\varphi_B = \frac{13{,}33}{17\,548} = 7{,}598 \times 10^{-4} \text{ rad},
$$

ce qui correspond à la formule classique $qL^3/(48EI)$, et $u_B = 0$.

### Calculer les réactions {#compute-the-reactions}

Une fois tous les déplacements connus, les lignes des DDL bloqués donnent les réactions, c’est-à-dire les forces que les appuis exercent sur la structure :

$$
\mathbf{R} = \mathbf{K}_{pu}\,\mathbf{r}_u + \mathbf{K}_{pp}\,\mathbf{r}_p - \mathbf{F}_p.
$$

Pour $w_A$, la ligne de $\mathbf{K}_{pu}$ contient $-6EI/L^2$ dans la colonne de $\varphi_B$, et $\mathbf{F}_p$ contient $qL/2$ :

$$
\begin{aligned}
R_{wA} &= -\frac{6EI}{L^2}\,\varphi_B - \frac{qL}{2} \\
&= -5 - 20 = -25 \text{ kN},
\end{aligned}
$$

soit 25 kN vers le haut (z est dirigé vers le bas). De même, $R_{\varphi A} = +20$ kNm et $R_{wB} = -15$ kN : on retrouve les valeurs classiques $qL^2/8$ et $3qL/8$.
::

## Résultats le long des barres {#results-along-the-members}

Pour chaque élément, le solveur extrait de $\mathbf{r}$ ses déplacements d’extrémité, les ramène dans les axes locaux, $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, et calcule les [efforts d’extrémité](/fr/elements/conventions#end-forces-element-results-table)

$$
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix}.
$$

Dans l’exemple, $\mathbf{d}_l = [0,\ 0,\ 0,\ 0,\ 0,\ \varphi_B]^\mathsf{T}$ donne $Z_{12} = -25$ kN, $M_{12} = 20$ kNm, $Z_{21} = -15$ kN et $M_{21} = 0$.

Les efforts internes en une abscisse $x$ quelconque découlent ensuite de l’équilibre du tronçon d’élément compris entre son origine et $x$ : les efforts à son origine plus la charge appliquée sur ce tronçon.

$$
\begin{aligned}
N(x) &= -X_{12} + N_q(x), \\
V(x) &= -Z_{12} + V_q(x), \\
M(x) &= -M_{12} - Z_{12}\,x + M_q(x),
\end{aligned}
$$

où $N_q$, $V_q$ et $M_q$ proviennent des charges appliquées sur ce tronçon. Pour une charge uniformément répartie $q_z$, une charge trapézoïdale de $q_1$ à $q_2$ (avec $\Delta q = q_2 - q_1$), et une force $F_z$ ou un moment $M_y$ à la distance $a$, qui n’agissent que pour $x \ge a$ :

$$
\begin{array}{l|cc}
\text{Charge} & V_q(x) & M_q(x) \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -q_z\,x & -\dfrac{q_z\,x^2}{2} \\[3ex]
q_1 \to q_2 & -q_1 x - \dfrac{\Delta q\,x^2}{2L} & -\dfrac{q_1 x^2}{2} - \dfrac{\Delta q\,x^3}{6L} \\[3ex]
F_z,\ M_y & -F_z & -F_z\,(x-a) - M_y
\end{array}
$$

$N_q$ s’obtient comme $V_q$, avec les composantes axiales $q_x$ et $F_x$ à la place de $q_z$ et $F_z$.

Dans l’exemple, $M(x) = -20 + 25\,x - 5\,x^2$ kNm, maximal en $x = 2{,}5$ m avec $11{,}25$ kNm $= 9qL^2/128$. Une charge thermique n’a pas de terme propre : elle n’agit qu’à travers les efforts d’extrémité.

La flèche est le produit des [fonctions de forme](/fr/elements/beam#local-stiffness-matrix) par les déplacements d’extrémité, plus la flèche de l’élément bi-encastré sous la charge qu’il porte. Une extrémité munie d’une rotule récupère d’abord sa propre rotation grâce à la [condensation](/fr/elements/beam#end-hinges). Les diagrammes et la déformée sont ces fonctions, évaluées le long de chaque barre.

## Pourquoi les résultats sont exacts {#exact}

Chacune des étapes ci-dessus est exacte pour le modèle qu’elle résout :

- La rigidité de l’élément provient de la **solution exacte** d’une barre prismatique de Timoshenko, et non de formes polynomiales supposées : c’est la vraie rigidité de la barre.
- Les efforts d’encastrement parfait sont les solutions exactes de la barre bi-encastrée pour chaque type de charge : les charges nodales équivalentes ne perdent donc rien.
- Les déplacements nodaux sont par conséquent exacts, et les efforts internes entre les nœuds découlent de l’équilibre sous la charge réelle : ils sont donc exacts eux aussi.

C’est pourquoi EduBeam ne vous demande jamais de raffiner un maillage : un élément par barre donne le même résultat que cent. Il ne faut des nœuds que là où la barre elle-même change : à un appui, une rotule, un angle ou un changement de section. Une charge ponctuelle entre deux nœuds peut rester une charge d’élément. La seule erreur restante est l’arrondi des calculs en virgule flottante ; les tableaux de résultats affichent 0 pour les valeurs inférieures à $10^{-12}$ fois la plus grande valeur de même nature.

« Exact » se rapporte au modèle, qui a ses limites :

::div{.limits}
- **Matériau élastique linéaire** et **petits déplacements** : l’équilibre est écrit sur la géométrie non déformée, il n’y a donc ni effets du second ordre (P–Δ) ni flambement.
- **Barres droites et prismatiques** : une seule section par élément. Une barre à inertie variable doit être approchée par plusieurs éléments.
- **Flexion dans le plan x–z uniquement** : ni torsion, ni comportement hors plan.
::

## Quand la structure ne tient pas {#mechanisms}

Une structure qui peut bouger sans se déformer a une matrice de rigidité singulière et pas de solution unique. EduBeam le recherche avant le calcul et contrôle le résultat ensuite :

1. **Avant le calcul**, chaque partie connexe de la structure est examinée sur sa seule géométrie. Ses appuis doivent empêcher les trois mouvements de corps rigide d’un solide plan : moins de trois liaisons signifie simplement que le modèle n’est pas terminé (*La structure a besoin d’appuis pour pouvoir être calculée.*), tandis que trois liaisons ou plus qui la laissent encore glisser ou tourner, comme des appuis simples parallèles, constituent une erreur. Viennent ensuite les rotules : si les barres peuvent tourner autour d’elles sans qu’aucune ne change de longueur, la structure est un mécanisme, et EduBeam entoure les rotules et montre le mouvement.
2. **Pendant le calcul**, une matrice exactement singulière arrête la décomposition LU : *La structure est un mécanisme : la matrice de rigidité est singulière.*
3. **Après le calcul**, un déplacement ou une rotation supérieur à $10^6$ m ou rad signifie que la matrice était singulière aux erreurs d’arrondi près. EduBeam indique les nœuds et les directions qui bougent : *La structure est instable. Déplacement pratiquement sans résistance : …* Un matériau ou une section saisis à zéro, ou dans une mauvaise unité, aboutissent aussi à ce message.

Une rotation à laquelle rien n’est relié, en un nœud où toutes les barres ont une rotule, n’est pas un mécanisme : le solveur la laisse nulle. La page [Dépannage](/fr/reference/troubleshooting#no-results-are-drawn) explique chaque message et comment y remédier.

## Lancer le solveur vous-même {#library}

Le solveur est open source : [@edubeam/fem](/fr/solver), en TypeScript, pour le navigateur et Node. La même poutre encastrée-appuyée :

```ts
import { DofID, LinearStaticSolver, type Beam2D } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]

// Unités SI : m, N, Pa. Acier, IPE 300 ; k = 1e32 la rend rigide à l'effort tranchant.
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // encastrement
domain.createNode('B', [4, 0, 0], [DofID.Dz]) // appui simple
domain.createBeam2D('1', ['A', 'B'], 1, 1)
lc.createBeamElementUniformEdgeLoad('1', [0, 10_000], true) // 10 kN/m, vers le bas

solver.solve()

solver.neq // 2 : Dx et Ry de B sont libres
lc.r.toArray() // [0, 0.0007598, 0, 0, 0, 0] : DDL libres, puis bloqués
lc.R.toArray() // [0, -25000, 20000, -15000] : A (Dx, Dz, Ry), puis B (Dz)

const beam = domain.getElement('1') as Beam2D
beam.computeEndForces(lc).toArray() // [0, -25000, 20000, 0, -15000, 0]
beam.computeBendingMomentAt(lc, 0) // -20000 : N·m, moment négatif à l'encastrement
beam.computeBendingMomentAt(lc, 2.5) // 11250 : le plus grand moment positif
```

Après `solve()`, `solver.k` contient la matrice assemblée $\mathbf{K}$ et `solver.f` le vecteur des charges $\mathbf{F}$, à comparer avec votre propre assemblage. Les étapes de cette page se trouvent dans `Solver.ts` (numérotation), `LinearStaticSolver.ts` (assemblage, résolution, réactions) et `Beam2D.ts` (matrices d’élément et résultats).

::div{.actions}
[Démarrer avec @edubeam/fem](/fr/solver/getting-started) [Contenu de la bibliothèque](/fr/solver/reference) [Code source sur GitHub ↗](https://github.com/EduBeamApp/fem){target="_blank"}
::
