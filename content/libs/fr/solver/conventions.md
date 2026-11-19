---
title: Unités et signes
description: "Les unités, les axes, les degrés de liberté et les conventions de signes de @edubeam/fem, et comment le sens d’une barre change le signe de ses résultats."
order: 2
source: site
---

# Unités et signes {#units-and-signs}

Le solveur n’a pas de système d’unités propre : il calcule avec les nombres que vous lui donnez. Donnez-lui du SI, et chaque résultat revient en SI. C’est ce que font toujours les exemples de ces pages, comme l’application EduBeam. Les signes sont, eux aussi, ceux de l’application ; son manuel théorique les explique avec des figures dans [Repère et conventions de signes](/fr/elements/conventions).

## Unités {#units}

| Grandeur | Unité | Exemple |
| --- | --- | --- |
| Coordonnées, longueurs, positions le long d’une barre | m | `[6, 0, 0]` |
| Forces | N | `20e3` pour 20 kN |
| Moments | N·m | `10e3` pour 10 kNm |
| Charges linéiques | N/m | `12e3` pour 12 kN/m |
| Module d’Young et module de cisaillement | Pa | `210e9` |
| Aire | m² | `28.5e-4` pour 28,5 cm² |
| Moment quadratique | m⁴ | `1943e-8` pour 1943 cm⁴ |
| Variation de température | K | `20` |
| Coefficient de dilatation thermique | 1/K | `12e-6` |
| Déplacements, rotations | m, rad | `0.01` pour 10 mm |

Tout système cohérent convient, par exemple kN, m et kPa, qui donne des résultats en kN et en kNm. Le SI vous évite d’avoir à le vérifier.

## Axes {#axes}

- **x** est dirigé vers la droite, **z vers le bas**, et le modèle se trouve dans le plan x–z. Les coordonnées s’écrivent `[x, y, z]`, avec `y = 0`.
- **y** est dirigé vers vous, hors de l’écran. Les rotations et les moments sont pris autour de y : une valeur positive tourne donc dans le **sens trigonométrique** (antihoraire) à l’écran.
- L’**axe x local** d’une barre va de son premier nœud à son second. Son **axe z local** est l’axe x local tourné de 90° dans le sens horaire à l’écran : sur une barre dessinée de gauche à droite, il est dirigé vers le bas.

Comme z est dirigé vers le bas, une charge de pesanteur est un `fz` positif, et la tête d’un poteau de 4 m dont le pied est en $z = 0$ se trouve en $z = -4$.

## Degrés de liberté {#degrees-of-freedom}

Chaque nœud d’un modèle `Beam2D` a trois degrés de liberté, nommés par l’énumération `DofID` :

| `DofID` | Valeur | Signification |
| --- | --- | --- |
| `DofID.Dx` | 0 | Déplacement selon x |
| `DofID.Dz` | 2 | Déplacement selon z, vers le bas |
| `DofID.Ry` | 4 | Rotation autour de y, sens trigonométrique |

`Dy`, `Rx` et `Rz` (1, 3, 5) existent dans l’énumération, mais les barres planes ne les utilisent pas.

## Signes des résultats {#signs-of-the-results}

| Résultat | Positif signifie | Se lit avec |
| --- | --- | --- |
| Effort normal N | traction | `computeNormalForceAt` |
| Moment fléchissant M | côté +z local tendu : fibre inférieure tendue, sur une poutre dessinée de gauche à droite | `computeBendingMomentAt` |
| Effort tranchant V | M croît le long de x local, $V = dM/dx$ ; sur une poutre dessinée de gauche à droite, il fait tourner un tronçon dans le sens horaire : $+qL/2$ à l’appui gauche d’une poutre sur deux appuis | `computeShearForceAt` |
| Flèche w | selon +z local : vers le bas, sur une poutre dessinée de gauche à droite | `computeLocalDefl` |
| Déplacement nodal | selon +x, +z (vers le bas), sens trigonométrique | `node.getUnknowns` |
| Réaction d’appui | la force que l’appui exerce sur la structure, selon +x, +z (vers le bas), sens trigonométrique | `node.getReactions` |
| Efforts d’extrémité | les forces que les nœuds exercent sur la barre, dans ses axes locaux | `computeEndForces` |

L’articulation d’une poutre chargée vers le bas renvoie donc une réaction de −36 000 N selon z : 36 kN dirigés vers le haut.

## Positions le long d’une barre {#positions-along-a-member}

Toutes les méthodes `…At(lc, x)` prennent `x` en mètres depuis le premier nœud de la barre, et non en fraction de sa longueur. Les charges ponctuelles sur une barre se placent de la même façon.

## Sens de la barre {#member-direction}

M et w se mesurent dans les axes propres de la barre : l’ordre de ses deux nœuds compte donc. Reprenons la poutre sous 12 kN/m de [Premiers pas](/fr/solver/getting-started), définie dans les deux sens, avec la charge en axes globaux, `[0, 12e3], false`, pour qu’elle pousse vers le bas dans les deux cas, et lue avec `computeBendingMomentAt(lc, 3)`, `computeLocalDefl(lc, 2).w[1]` et `computeShearForceAt` :

| Barre | M à mi-portée | w à mi-portée | V en A |
| --- | --- | --- | --- |
| `['A', 'B']`, de gauche à droite | +54 000 N·m | +0,0499 m | +36 000 N, en `x = 0` |
| `['B', 'A']`, de droite à gauche | −54 000 N·m | −0,0499 m | +36 000 N, en `x = 6` |

Définie de droite à gauche, la barre a son axe z local dirigé vers le haut : la même poutre, dont la fibre inférieure est tendue, renvoie alors un moment négatif et une flèche vers le haut. N et V gardent leur signe en tout point de la poutre ; seul `x` part de l’autre extrémité. Une charge donnée en axes locaux (`true`) tourne avec la barre : sur la poutre définie de droite à gauche, `[0, 12e3], true` pousse vers le haut.

::callout{type="tip" title="Définissez les barres comme vous les dessinez"}
Les poutres de gauche à droite, les poteaux de bas en haut, et les signes se lisent comme dans un manuel. Pour un poteau défini de bas en haut, l’axe z local est dirigé vers la droite : une face droite tendue correspond donc à un moment positif. L’[exemple du portique](/fr/solver/frames#things-to-notice) le montre.
::
