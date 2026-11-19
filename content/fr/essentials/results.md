---
description: "Lire les résultats d’EduBeam : diagrammes N, V, M, déformée, réactions et leurs signes, infobulles, tableaux, export CSV, matrice de rigidité."
source: site
---

# Résultats et diagrammes

[EduBeam]{.edubeam} calcule le modèle après chaque modification : les diagrammes, les réactions et les tableaux affichés correspondent donc toujours au modèle que vous voyez. Il n’y a pas de bouton *Calculer*. Si rien n’est dessiné, c’est que le modèle ne peut pas encore être calculé : le message en haut à gauche de la vue indique pourquoi, et la page [Dépannage](/fr/reference/troubleshooting) explique chaque message.

## Couches dans la vue {#overlays-in-the-viewer}

Les résultats sont dessinés par-dessus le modèle. Activez-les ou désactivez-les dans les **options d’affichage**, en haut à droite de la vue ; le bouton ⚙ placé au-dessus affiche ou masque ce panneau.

::model-figure{caption="Portique à trois articulations, 10 kN/m : basculez entre M, V, N et la déformée"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, V, N, w]
show: [nodeLabels]
height: 300
---
::

| Case | Dessine | Couleur | Cochée au départ |
| --- | --- | --- | --- |
| **Déformée** | la structure déplacée, amplifiée pour être visible | gris | oui |
| **N (x)** | l’effort normal | bleu | |
| **V<sub>z</sub> (x)** | l’effort tranchant | vert | |
| **M<sub>y</sub> (x)** | le moment fléchissant | rouge | oui |
| **Réactions** | une flèche et une valeur pour chaque direction bloquée | violet | oui |

Une seconde rangée agit sur le dessin lui-même : **Appuis**, **Charges**, **Étiquettes des nœuds** et **Étiquettes des éléments**. **Plus de paramètres**, sous le panneau, ouvre les [paramètres d’affichage](/fr/essentials/units-settings#viewer-settings), où vous réglez la taille des diagrammes (*Échelle des résultats*), les couleurs, l’orientation des étiquettes et le style des diagrammes.

Les valeurs sont écrites là où elles comptent : aux extrémités de chaque barre, de part et d’autre d’un saut sous une charge ponctuelle ou sur un appui, et à chaque extremum du diagramme, comme le sommet d’une parabole, là où $V = 0$. La figure ci-dessus montre le [portique à trois articulations](/fr/tutorials/three-hinged-frame), que vous pouvez vérifier à la main : 40 kN de compression dans chaque poteau, 20 kN dans la traverse et −80 kNm aux deux angles. La vue *w* montre que la rotule C descend de 42,55 mm.

### Lire le signe {#reading-the-sign}

Lisez le signe sur la **valeur**, et non d’après le côté de la barre où le diagramme est dessiné. Les conventions sont celles de la plupart des manuels :

| Résultat | Positif signifie |
| --- | --- |
| **N** | traction |
| **V<sub>z</sub>** | il fait tourner un court tronçon de barre dans le sens horaire. Comme $V = \mathrm{d}M/\mathrm{d}x$, il est positif à l’appui de gauche d’une poutre sur deux appuis sous charge gravitaire, et négatif à droite |
| **M<sub>y</sub>** | moment positif : fibre inférieure tendue, du côté de la **ligne en pointillés** tracée le long de chaque barre |

Une poutre sur deux appuis avec porte-à-faux montre les deux signes à la fois. Entre les appuis, le moment est positif (+13,5 kNm) ; sur l’appui de droite, il est négatif (−24 kNm), avec la fibre supérieure tendue. En B, l’effort tranchant fait un saut égal à la réaction de 54 kN, de −30 à +24 kN :

::model-figure{caption="Poutre avec porte-à-faux, 12 kN/m : moment positif entre les appuis, moment négatif sur l’appui B"}
---
nodes: { A: [0, 0], B: [4, 0], C: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

Par défaut, le moment fléchissant est dessiné du **côté tendu**, et les efforts normal et tranchant positifs du côté opposé à la ligne en pointillés. Les écoles diffèrent sur ce point : chacun de ces côtés peut donc être inversé dans **Paramètres → Paramètres d’affichage → Diagrammes des efforts internes**, où vous pouvez aussi hachurer les diagrammes comme à la main et indiquer sur chaque tronçon le degré de son polynôme. Inverser un côté ne change que le dessin, jamais les valeurs. Les conventions de signes complètes, axes locaux de l’élément compris, se trouvent dans le [manuel théorique](/fr/elements/conventions#internal-forces).

## Infobulles au survol {#hover-tooltips}

Pointez un objet pour lire ses valeurs :

- **Nœud** : les déplacements $u_x$, $u_z$ (dans l’unité de déplacement) et la rotation $\varphi_y$ (en radians).
- **Élément** : son étiquette, sa section et son matériau.
- **Charge** : ses composantes.

Sur un écran tactile, touchez plutôt l’objet : son panneau affiche les mêmes détails.

![Pointer le nœud 2 de la poutre du Démarrage rapide](/screenshots/fr/ui-hover.webp){.shot-sm}

## Onglet Résultats {#results-tab}

L’onglet **Résultats** de la barre inférieure contient deux tableaux, entre lesquels vous basculez avec **Résultats nodaux** et **Résultats par élément**.

### Résultats nodaux {#nodal-results}

Une ligne par nœud, avec ses déplacements **D<sub>x</sub>** et **D<sub>z</sub>** (dans l’unité de déplacement) et sa rotation **R<sub>y</sub>** (en radians), dans les axes globaux : un D<sub>z</sub> positif est dirigé vers le bas, et un R<sub>y</sub> positif tourne dans le sens antihoraire à l’écran. Une direction bloquée affiche 0, ou le tassement que vous avez imposé. Les réactions ne figurent pas dans ce tableau : lisez-les sur le dessin ou dans l’[export CSV](#export-csv-and-copy).

![Résultats nodaux du portique à trois articulations ci-dessus, avec le format des nombres Automatique](/screenshots/fr/p2c-results-nodal.webp){.shot-lg}

### Résultats par élément {#element-results}

Une ligne par élément, avec ses **efforts aux extrémités dans le repère local de l’élément** :

| Colonne | Signification |
| --- | --- |
| X<sub>12</sub>, Z<sub>12</sub>, M<sub>12</sub> | effort normal, effort tranchant et moment agissant sur l’élément à son nœud **initial** |
| X<sub>21</sub>, Z<sub>21</sub>, M<sub>21</sub> | les mêmes à son nœud **final** |

![Résultats par élément du portique à trois articulations : les efforts aux extrémités de ses quatre barres](/screenshots/fr/p2c-results-element.webp)

Les efforts aux extrémités sont les forces que les nœuds exercent sur l’élément. Ils suivent les axes locaux, et non la convention N-V-M des diagrammes : leurs signes diffèrent donc.

- **Poutre sur deux appuis** (6 m, 12 kN/m, celle du [Démarrage rapide](/fr/guide/quick-start)) : Z<sub>12</sub> = Z<sub>21</sub> = −36 kN. Les deux appuis poussent la poutre vers le haut, c’est-à-dire selon −z.
- **Console** encastrée à son nœud initial, avec 18 kN vers le bas à son extrémité : Z<sub>12</sub> = −18 kN, M<sub>12</sub> = +72 kNm, Z<sub>21</sub> = +18 kN, M<sub>21</sub> = 0.
- **Poteau 1 du portique** (A en bas, B en haut) : X<sub>12</sub> = +40 kN pousse selon l’axe x local, vers l’intérieur de l’élément, soit 40 kN de compression.

Ce tableau est détaillé dans le [manuel théorique](/fr/elements/conventions#end-forces-element-results-table).

### Exporter en CSV et Copier {#export-csv-and-copy}

**Exporter en CSV** télécharge `edubeam-results.csv` avec les deux tableaux, dans les unités affichées à l’écran et prêt pour un tableur. **Copier** place les mêmes tableaux dans le presse-papiers sous forme de texte séparé par des tabulations, qui se colle directement dans Excel, LibreOffice ou Google Sheets.

| Tableau | Colonnes |
| --- | --- |
| Nœuds | Node, x, z, Dx, Dz, Ry, et les **réactions** Rx, Rz, My |
| Éléments | Element, Node 1, Node 2, et les efforts aux extrémités N1, V1, M1, N2, V2, M2 |

Chaque en-tête porte son unité, par exemple `Dz [mm]`. Les efforts aux extrémités des éléments sont les mêmes valeurs locales que X<sub>12</sub> … M<sub>21</sub> à l’écran.

### Matrice de rigidité {#stiffness-matrix}

Choisissez **Matrice de rigidité** dans le panneau d’un élément, ou avec le bouton de sa ligne dans le tableau *Éléments*, pour ouvrir la matrice de rigidité 6 × 6 de l’élément en **axes globaux** et en unités SI (N, m). Elle est pratique pour vérifier un assemblage fait à la main dans un cours sur la méthode des déplacements ; les formules se trouvent dans le [manuel théorique](/fr/elements/beam).

## Format des nombres {#number-format}

Les tableaux et les infobulles affichent les résultats avec cinq chiffres significatifs. **Paramètres → Langue et paramètres régionaux → Format des nombres** détermine leur écriture :

| Format | 40 000 s’écrit | À utiliser pour |
| --- | --- | --- |
| **Scientifique** (par défaut) | 4 · 10⁴ | des valeurs qui couvrent de nombreux ordres de grandeur |
| **Ingénierie** | 40 · 10³ | lire directement les préfixes kilo et méga |
| **Automatique** | 40 000 | les nombres courants de l’enseignement |

*Automatique* écrit les valeurs de 0,001 à 100 000 comme des nombres ordinaires. En dehors de cette plage, il les écrit comme *Ingénierie*, avec des puissances de dix par pas de trois, comme 380,95 · 10⁻⁹ dans les résultats nodaux ci-dessus. Le séparateur décimal suit la langue.

Les étiquettes du dessin (valeurs des diagrammes et réactions) ont toujours deux décimales, quel que soit le format des nombres : 6,6667 kN s’affiche 6,67. Lisez les tableaux ou les infobulles quand il vous faut plus de chiffres.

## Précision et exactitude {#precision-and-accuracy}

- L’élément poutre est exact pour le modèle linéaire de Timoshenko sous charges nodales, uniformes, trapézoïdales, ponctuelles et thermiques. Les résultats ne dépendent **pas** du nombre d’éléments, et il n’y a pas de maillage à raffiner.
- Le calcul se fait en double précision. Une valeur inférieure au millième de milliardième de la plus grande valeur de même nature est une erreur d’arrondi, et les tableaux l’affichent comme 0.
- Les flèches incluent la **déformation d’effort tranchant**, qui, dans une structure hyperstatique, modifie aussi légèrement les efforts. Pour les barres élancées, elle ajoute une fraction de pour cent à la flèche d’Euler–Bernoulli ; pour les barres courtes et hautes, elle peut atteindre dix pour cent ou plus. La page [Vérifier les résultats à la main](/fr/guide/verification#shear-deformation) montre son ampleur, et comment la supprimer pour comparer avec les formules des manuels.

## Résultats dans un rapport {#results-in-a-report}

- **☰ → Exporter une image** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) enregistre le dessin en PNG ou en SVG avec les diagrammes de votre choix. Voir [Exporter une image](/fr/essentials/import-export#export-an-image).
- **Exporter en CSV** ou **Copier**, dans l’onglet Résultats, fournit les valeurs.
- **Partager le modèle** fournit un lien, pour que le lecteur puisse ouvrir le modèle lui-même.
- Pour les supports de cours et les feuilles d’exercices, [@edubeam/plot](/fr/plot) dessine les mêmes diagrammes à partir de code.
