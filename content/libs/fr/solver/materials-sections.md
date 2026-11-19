---
title: Matériaux et sections
description: "Les paramètres de matériau et de section de @edubeam/fem, ceux qu’exige chaque calcul, l’effet d’un oubli et comment négliger la déformation d’effort tranchant."
order: 4
source: site
---

# Matériaux et sections {#materials-and-sections}

Les barres tirent leur rigidité d’un matériau et d’une section, créés chacun une seule fois et désignés par leur étiquette.

```ts
domain.createMaterial('steel', { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection('IPE200', {
  a: 28.5e-4, // m²
  iy: 1943e-8, // m⁴
  h: 0.2, // m
  k: 5 / 6,
})
```

## Matériau {#material}

| Paramètre | Signification | Unité | Nécessaire pour |
| --- | --- | --- | --- |
| `e` | Module d’Young $E$ | Pa | toujours |
| `g` | Module de cisaillement $G$ | Pa | toujours, sauf si `k` est énorme (pas de déformation d’effort tranchant) |
| `alpha` | Coefficient de dilatation thermique $\alpha$ | 1/K | les charges thermiques |
| `d` | Masse volumique $\rho$ | kg/m³ | rien en calcul statique |

Un paramètre omis vaut **1**, et non une valeur courante, sans le moindre avertissement. Oubliez `g` sur la poutre de Premiers pas, et sa flèche atteint 22 700 km.

## Section {#cross-section}

| Paramètre | Signification | Unité | Nécessaire pour |
| --- | --- | --- | --- |
| `a` | Aire $A$ | m² | toujours : rigidités axiale et à l’effort tranchant |
| `iy` | Moment quadratique $I_y$ | m⁴ | toujours : rigidité en flexion |
| `k` | Coefficient de cisaillement $k$ | – | toujours : rigidité à l’effort tranchant $kGA$ |
| `h` | Hauteur $h$ | m | les différences de température |
| `iz`, `dyz`, `j` | $I_z$, $I_{yz}$, constante de torsion | m⁴ | rien dans un modèle plan |

Une section n’a pas de valeurs par défaut. Omettez `a`, `iy` ou `k`, et tous les résultats valent `NaN` ; omettez `h`, et une différence de température donne `NaN`. Aucun des deux cas ne lève d’erreur : un résultat `NaN` signale donc presque toujours un paramètre manquant.

## Déformation d’effort tranchant {#shear-deformation}

La barre est une poutre de Timoshenko : elle se déforme non seulement en flexion, mais aussi sous l’effort tranchant. L’importance de cette déformation dépend de

$$
\Phi = \frac{12\,EI_y}{k\,G\,A\,L^2},
$$

que renvoie `beam.computeShearFactor()`. Pour les barres élancées, $\Phi$ est minuscule et les flèches n’augmentent que d’une fraction de pour cent. Pour les barres courtes et hautes, l’effet devient sensible.

Pour retrouver la poutre d’Euler–Bernoulli des tables des manuels, rendez la rigidité à l’effort tranchant pratiquement infinie avec un coefficient de cisaillement énorme, comme le font les exemples de l’application EduBeam :

```ts
domain.createCrossSection('IPE200-EB', { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
```

C’est ce que font les exemples complets de ces pages : leurs valeurs correspondent ainsi exactement aux formules. Pour un coefficient de cisaillement réaliste, $k = 5/6$ convient à une section rectangulaire. La page [Vérifier les résultats à la main](/fr/guide/verification#shear-deformation) montre l’ampleur de l’effet.

## Barres axialement rigides {#rigid-in-axial-direction}

Une grande aire rend les barres pratiquement inextensibles, comme le suppose en général le calcul à la main. Les efforts internes d’un portique ne dépendent que faiblement de l’aire ; les déplacements d’un treillis en dépendent entièrement. Les efforts internes d’une structure isostatique ne dépendent d’aucune rigidité.

## Les modifier ensuite {#change-them-later}

```ts
domain.getMaterial('steel').change({ e: 200e9 })
domain.getCS('IPE200').change({ iy: 2000e-8 })
solver.solve()
```

Chaque barre lit son matériau et sa section au moment où le solveur assemble : un nouveau `solve()` suffit donc. Des barres différentes peuvent utiliser des sections différentes : donnez à chacune sa propre étiquette.
