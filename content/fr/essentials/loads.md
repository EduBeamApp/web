---
description: "Forces, moments, tassements, charges réparties, ponctuelles et thermiques dans EduBeam, et leur convention de signes : z vers le bas, moments antihoraires positifs."
source: site
---

# Charges

Les charges agissent sur les nœuds ou le long des éléments. Elles appartiennent toutes à un **seul cas de charge** et agissent ensemble ; pour comparer des scénarios, enregistrez chacun dans un [fichier de projet ou un lien de partage](/fr/essentials/import-export).

| Charge | Agit sur | Où l’ajouter |
| --- | --- | --- |
| [Force ou moment](#nodal-loads) | un nœud | onglet *Charges* → **Ajouter une charge nodale**, ou cliquez sur le nœud → **Ajouter une charge** |
| [Déplacement imposé](#prescribed-displacements-support-settlements) (tassement) | un nœud avec appui | la même boîte de dialogue, ou cliquez sur le nœud → **Imposer un déplacement** |
| Charge [uniformément répartie](#uniformly-distributed-load), [trapézoïdale](#trapezoidal-load), [ponctuelle](#concentrated-load) ou [thermique](#temperature-load) | un élément | onglet *Charges* → **Ajouter une charge d’élément**, ou cliquez sur l’élément → **Ajouter une charge** |

## Convention de signes {#sign-convention-in-one-line}

x pointe vers la **droite**, z vers le **bas**, et les moments sont positifs dans le **sens antihoraire**. Un `Fz` ou un `fz` positif est donc une charge dirigée vers le bas, comme la pesanteur, et une charge dirigée vers le haut est négative.

::model-figure{caption="Toutes les charges sont ici positives : Fx = +10 kN vers la droite, Fz = +10 kN vers le bas, My = +10 kNm dans le sens antihoraire"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0] }
supports: { A: pin, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: A, fx: 10 }
  - { node: B, fz: 10 }
  - { node: C, my: 10 }
results: []
---
::

| Positif | Axes par défaut (z vers le bas) | [Axes y vers le haut](/fr/elements/conventions#y-up-axes) |
| --- | --- | --- |
| Force horizontale `Fx`, `fx` | vers la droite | vers la droite |
| Force verticale | `Fz`, `fz` : **vers le bas** | `Fy`, `fy` : **vers le haut** |
| Moment | `My` : sens antihoraire | `Mz` : sens antihoraire |
| Tassement vertical | `Dz` : vers le bas | `Dy` : vers le haut |

Les charges données dans les **axes locaux** d’un élément (case LCS cochée) suivent l’élément : l’axe x local va de son nœud initial à son nœud final, et l’axe z local est l’axe x local tourné de 90° dans le sens horaire, vers la ligne en pointillés tracée le long de l’élément. Voir [Orientation de l’élément](/fr/essentials/elements#element-direction). La convention complète, efforts internes compris, se trouve dans [Repère et conventions de signes](/fr/elements/conventions#loads).

## Charges nodales {#nodal-loads}

Onglet *Charges* → **Ajouter une charge nodale**, ou cliquez sur un nœud → **Ajouter une charge**, et laissez **Force/Moment** sélectionné. Saisissez les forces `Fx`, `Fz` (kN) et le moment `My` (kNm), avec les signes [ci-dessus](#sign-convention-in-one-line) ; l’aperçu dessine la charge pendant la saisie.

![Ajouter une charge nodale : l’aperçu montre la direction pendant la saisie](/screenshots/fr/loads-nodal.webp){.shot-md}

- Les composantes sont exprimées dans les axes **globaux**. Sur un nœud dont les axes sont tournés (un [appui incliné](/fr/essentials/nodes-supports#inclined-skewed-supports)), la boîte de dialogue ajoute un sélecteur **Axes globaux** / **Axes du nœud**. Dans les axes du nœud, les composantes, affichées `Fx′` et `Fz′`, agissent selon les axes propres du nœud et tournent avec eux si l’angle change ensuite. Changer d’axes recalcule les valeurs, de sorte que la charge reste là où elle est.
- Un nœud peut porter plusieurs charges nodales ; elles s’additionnent.

### Déplacements imposés (tassements d’appui) {#prescribed-displacements-support-settlements}

Pour déplacer un appui d’une valeur donnée, choisissez **Déplacement imposé** dans la même boîte de dialogue, ou cliquez sur un nœud avec appui → **Imposer un déplacement**. Saisissez les déplacements `Dx`, `Dz` (positifs vers la droite et vers le bas, dans l’[unité de déplacement](/fr/essentials/units-settings#units), le mètre par défaut) et la rotation `Ry` (en rad, positive dans le sens antihoraire).

- Seuls les DDL **bloqués** peuvent être imposés : les autres champs sont grisés, et un nœud sans appui ne peut pas avoir de tassement du tout.
- Un nœud porte au plus un déplacement imposé. Pour le changer, modifiez-le plutôt que d’en ajouter un second.
- Sur un appui incliné, les champs s’appellent `Dx′` et `Dz′` : le tassement agit selon les axes propres de l’appui.

Qu’un tassement provoque ou non des efforts internes dépend de la structure. Le même tassement de 10 mm de l’appui B, sans aucune autre charge :

::div{.shots}

:::model-figure{caption="Poutre sur deux appuis : elle bascule simplement ; aucune réaction, M = 0"}
---
nodes: { A: [0, 0], B: [5, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

:::model-figure{caption="Poutre continue sur B : elle fléchit, M = 21,06 kNm sur l’appui B"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

::

Une structure isostatique suit l’appui sans résister. La poutre continue, elle, doit fléchir : l’appui B la tire vers le bas de $\delta = 10\ \text{mm}$, comme une charge ponctuelle au milieu d’une travée de 10 m sur deux appuis. Avec $L = 5\ \text{m}$ et le $EI = 17\,548\ \text{kNm}^2$ de l’acier de l’exemple, cette charge vaut $P = 6EI\delta/L^3 = 8{,}423\ \text{kN}$, c’est la réaction en B, et $M_B = PL/2 = 3EI\delta/L^2 = 21{,}06\ \text{kNm}$. Le [tutoriel sur la poutre continue](/fr/tutorials/continuous-beam) combine un tassement avec des charges.

## Charges d’élément {#element-loads}

Onglet *Charges* → **Ajouter une charge d’élément**, ou cliquez sur un élément → **Ajouter une charge**. Choisissez le **Type de charge** ; l’aperçu montre la charge sur l’élément pendant la saisie. Les forces sont en kN et les charges linéiques en kN/m, ou dans les [unités](/fr/essentials/units-settings#units) que vous avez choisies.

![Ajouter une charge d’élément, ici une charge uniformément répartie](/screenshots/fr/loads-udl.webp){.shot-md}

### Charge uniformément répartie {#uniformly-distributed-load}

Une charge constante par unité de longueur, `fx` et `fz`, sur tout l’élément. Avec la case **LCS** cochée (par défaut), ces composantes agissent selon les axes locaux de l’élément ; décochée, selon les axes globaux. Sur un élément horizontal dessiné de gauche à droite, c’est la même chose ; sur une barre inclinée, non :

| Vous voulez | Saisissez |
| --- | --- |
| une charge **perpendiculaire** à la barre (vent sur un arbalétrier) | `fz` avec LCS **cochée** |
| une charge **verticale** par mètre de barre (poids propre) | `fz` avec LCS **décochée** |
| une charge **verticale** par mètre en plan, c’est-à-dire de projection horizontale (neige) | pas disponible directement : multipliez-la par $\cos\alpha$, où $\alpha$ est la pente de la barre, et saisissez-la comme charge verticale |

Les mêmes 10 kN/m sur un arbalétrier de 4 m de portée et 3 m de hauteur, long de 5 m :

::div{.shots}

:::model-figure{caption="LCS décochée : charge verticale, 50 kN au total ; M = 25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [M]
---
:::

:::model-figure{caption="LCS cochée : charge perpendiculaire à la barre ; M = 31,25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10, local: true }
results: [M]
---
:::

::

À la main : charge perpendiculaire, $M = qL^2/8 = 10 \cdot 5^2/8 = 31{,}25\ \text{kNm}$ ; charge verticale, les 50 kN répartis sur les 4 m de portée font 12,5 kN/m en projection, donc $M = 12{,}5 \cdot 4^2/8 = 25\ \text{kNm}$.

### Charge trapézoïdale {#trapezoidal-load}

Une charge qui varie linéairement le long de l’élément : `f1x`, `f1z` au nœud **initial**, `f2x`, `f2z` au nœud **final**. Mettez une extrémité à zéro pour obtenir une charge triangulaire.

::model-figure{caption="Charge triangulaire de 0 à 10 kN/m : réactions de 10 et 20 kN, M maximal = 23,09 kNm à 3,46 m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: [0, 10] }
results: [M, V]
show: [nodeLabels]
---
::

À la main : la charge totale $qL/2 = 30\ \text{kN}$ agit à $2L/3$, donc $R_A = 10\ \text{kN}$ et $R_B = 20\ \text{kN}$ ; l’effort tranchant s’annule, et le moment est maximal, en $x = L/\sqrt{3} = 3{,}46\ \text{m}$, où $M = qL^2/(9\sqrt{3}) = 23{,}09\ \text{kNm}$.

Les charges trapézoïdales agissent selon les **axes locaux** de l’élément (la case LCS est verrouillée). Sur un élément horizontal dessiné de gauche à droite, cela revient aux axes globaux ; sur un élément incliné, `f1z` et `f2z` sont perpendiculaires à la barre et `f1x`, `f2x` dirigés selon elle.

Une charge **verticale** variable sur une barre de pente $\alpha$ reste exacte : saisissez ses deux composantes locales à chaque extrémité, $f_z = q\cos\alpha$ et $f_x = q\sin\alpha$, dirigée vers le bas de la pente, donc négative quand l’élément monte depuis son nœud initial. Pour l’arbalétrier ci-dessus, de 4 m de portée et 3 m de hauteur, dessiné depuis le bas, une charge verticale qui croît de 0 à 10 kN/m de barre s’écrit `f1x` = `f1z` = 0, `f2x` = −6 et `f2z` = 8 kN/m.

::model-figure{caption="Charge verticale de 0 à 10 kN/m de barre, saisie par ses composantes locales : réactions de 8,333 et 16,67 kN, M maximal = 12,83 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qx: [0, -6], qz: [0, 8], local: true }
results: [M]
show: [nodeLabels]
---
::

À la main : la résultante de 25 kN agit aux deux tiers de la portée, à 2,67 m, donc $R_B = 25 \cdot 2{,}667/4 = 16{,}67\ \text{kN}$. Sur les 4 m de projection, la charge est un triangle qui monte jusqu’à 12,5 kN/m ; comme plus haut, $M = 12{,}5 \cdot 4^2/(9\sqrt{3}) = 12{,}83\ \text{kNm}$.

### Charge ponctuelle {#concentrated-load}

Une force ponctuelle `Fx`, `Fz` ou un moment `My` n’importe où **le long** d’un élément, sans nœud supplémentaire. Le champ **Position de la charge depuis le nœud initial** donne sa distance $a$ au nœud initial, $0 \le a \le L$. Par défaut, il vaut la moitié de la longueur arrondie au mètre inférieur, et au plus 5 m (en pieds entiers et au plus 15 ft en unités américaines) : réglez-le donc sur la position réelle de votre charge. **LCS** fonctionne comme pour les charges uniformes.

::model-figure{caption="20 kN à 2 m sur une travée de 6 m : V saute de 13,33 à −6,667 kN, M = 26,67 kNm sous la charge"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M]
show: [nodeLabels]
---
::

Le diagramme de l’effort tranchant fait un saut égal à `Fz` au droit de la charge, et le diagramme des moments y forme un angle : $R_A = 20 \cdot 4/6 = 13{,}33\ \text{kN}$, $M = 13{,}33 \cdot 2 = 26{,}67\ \text{kNm}$. Un `My` ponctuel fait au contraire sauter le diagramme des moments.

### Charge thermique {#temperature-load}

| Champ | Signification | Effet |
| --- | --- | --- |
| **ΔT<sub>c</sub>**, variation uniforme de température | la même variation sur toute la section | allongement $\alpha\,\Delta T_c\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>** | variation de la fibre inférieure moins celle de la fibre supérieure | courbure $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

Ce sont toutes deux des *variations* de température depuis l’état sans contrainte, en °C par défaut ; une variation de 1 °C vaut 1 K. Les charges thermiques utilisent le **α** du matériau et la **hauteur h** de la section. La fibre **inférieure** est du côté de la ligne en pointillés. Un ΔT<sub>b</sub> − ΔT<sub>t</sub> positif (plus chaud en bas) allonge la fibre inférieure : l’élément fléchit vers le bas, comme une poutre sous charge gravitaire.

Dans une structure isostatique, la température ne provoque que des déplacements. Les liaisons (encastrements, continuité, barres surabondantes) la transforment en efforts internes. La même poutre en acier de 6 m, haute de 0,3 m, 20 K plus chaude en bas qu’en haut :

::div{.shots}

:::model-figure{caption="Poutre sur deux appuis : flèche de 3,6 mm à mi-portée, M = 0"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [w, M]
---
:::

:::model-figure{caption="Poutre bi-encastrée : elle reste droite, M = −14,04 kNm sur toute la longueur"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [M, w]
---
:::

::

À la main : la courbure libre vaut $\kappa = \alpha\,\Delta T/h = 12 \times 10^{-6} \cdot 20/0{,}3 = 8 \times 10^{-4}\ \text{1/m}$. Sur deux appuis, la poutre prend cette courbure librement et fléchit de $\kappa L^2/8 = 3{,}6\ \text{mm}$. Avec des extrémités encastrées, un moment constant doit l’annuler : $M = -EI\kappa = -17\,548 \cdot 8 \times 10^{-4} = -14{,}04\ \text{kNm}$. La page [Vérifier les résultats à la main](/fr/guide/verification#temperature-gradient-on-a-simply-supported-beam) détaille un autre cas.

## Modifier et supprimer des charges {#editing-and-removing-loads}

| Pour | Faites ceci |
| --- | --- |
| Changer rapidement les valeurs | Modifiez les composantes (et la case LCS) directement dans l’onglet *Charges*. |
| Ouvrir la boîte de dialogue de modification | Double-cliquez sur la charge dans la vue, ou cliquez dessus → **Modifier la charge**. Les charges apparaissent aussi sous forme de pastilles dans les tableaux *Nœuds* et *Éléments* ; cliquez sur l’une d’elles pour la modifier. |
| La supprimer | Sélectionnez-la et appuyez sur <kbd>Suppr</kbd>, cliquez dessus → **Supprimer**, ou utilisez le × de l’onglet *Charges*. |

Les charges appartiennent à leur nœud ou à leur élément : supprimer le nœud ou l’élément les supprime, et le copier avec ses charges sélectionnées les copie aussi.

![L’onglet Charges : une ligne par charge, avec ses composantes modifiables sur place](/screenshots/fr/loads-table.webp)

## Ce qui n’est pas disponible {#what-is-not-available}

::div{.limits}
- **Un seul cas de charge.** Pas de combinaisons : enregistrez chaque cas dans son propre fichier ou lien.
- **Pas de poids propre.** Ajoutez-le comme charge uniforme, LCS décochée : $f_z = \rho\,g\,A$, p. ex. $\approx 0{,}22\ \text{kN/m}$ pour un IPE 200.
- **Charges trapézoïdales en axes locaux uniquement.** Pour une charge verticale variable sur une barre inclinée, saisissez ses [composantes locales](#trapezoidal-load).
- **Pas de charges linéiques partielles.** Une charge linéique couvre tout l’élément : ajoutez un nœud là où elle commence ou s’arrête.
::
