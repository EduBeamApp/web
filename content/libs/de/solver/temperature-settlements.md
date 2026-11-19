---
title: Temperatur und Auflagersenkungen
description: "Stäbe in @edubeam/fem mit Temperaturänderung und Temperaturunterschied belasten und Lager um eine vorgegebene Verschiebung bewegen, mit geprüften Beispielen."
order: 7
---

# Temperatur und Auflagersenkungen {#temperature-and-settlements}

Zwei Lasten, die keine Kräfte sind: ein Stab, der seine Länge oder Krümmung ändern will, und ein Lager, das sich bewegt. Beide erzeugen Schnittgrößen nur dort, wo das Tragwerk sie daran hindert. Deshalb eignen sie sich gut für Aufgaben zu statisch unbestimmten Tragwerken. Die Theorie zu beiden steht im Theoriehandbuch unter [Elementlasten](/de/elements/beam#element-loads).

## Temperatur {#temperature}

```ts
lc.createBeamTemperatureLoad(member, [dTc, dTb, dTt])
```

| Wert | Bedeutung | Wirkung auf einen frei verformbaren Stab |
| --- | --- | --- |
| `dTc` | Änderung im Schwerpunkt, K | verlängert sich um $\alpha\,\Delta T_c\,L$ |
| `dTb` | Änderung an der unteren Faser (Seite der lokalen +z-Achse), K | zusammen mit `dTt` krümmt er sich um $\kappa = \alpha\,(\Delta T_b - \Delta T_t)/h$ |
| `dTt` | Änderung an der oberen Faser, K | |

Nur die Differenz `dTb - dTt` biegt den Stab; `[30, 20, 0]` und `[30, 10, -10]` sind also dieselbe Last. Die Last braucht das `alpha` des Materials und das `h` des Querschnitts; ohne `h` sind die Momente `NaN`.

Ein beidseitig eingespannter Träger kann sich weder verlängern noch krümmen. Stattdessen erhält er Druck und Biegung: $N = -EA\,\alpha\,\Delta T_c$ und $M = -EI\,\alpha\,(\Delta T_b - \Delta T_t)/h$.

```ts [temperature.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial(1, { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [6, 0, 0], fixed)
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

// Schwerpunkt 30 K wärmer, Unterseite 20 K wärmer als Oberseite
lc.createBeamTemperatureLoad(1, [30, 20, 0])
solver.solve()

beam.computeNormalForceAt(lc, 3) // -215460 N: EA · 12e-6 · 30
beam.computeBendingMomentAt(lc, 3) // -4896.4 N·m: EI · 12e-6 · 20 / 0.2
```

Mit dem IPE 200 ist $EA = 598{,}5$ MN und $EI = 4{,}0803$ MNm². Eine wärmere untere Faser biegt die Enden eines frei verformbaren Trägers nach oben; die Einspannung biegt ihn deshalb in die Gegenrichtung: ein negatives Moment mit Zug in der oberen Faser.

::model-figure{caption="Ein beidseitig eingespannter Träger, im Schwerpunkt 30 K wärmer und unten 20 K wärmer als oben"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 30, bottom: 20, top: 0 } }
results: [M, N]
show: [nodeLabels]
material: { e: 210e9, alpha: 12e-6 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

Bei einem Einfeldträger erzeugt dieselbe Last überhaupt keine Schnittgrößen, nur Bewegung: Das Loslager verschiebt sich um $\alpha\,\Delta T_c\,L = 2{,}16$ mm nach außen, und die Feldmitte senkt sich um $\kappa L^2/8 = 5{,}4$ mm.

## Vorgegebene Verschiebungen {#prescribed-displacements}

```ts
lc.createPrescribedDisplacement(node, { [DofID.Dz]: 0.01 })
```

Verschiebt ein Lager um einen vorgegebenen Betrag: in Metern für `Dx` und `Dz`, in Radiant für `Ry`, in den eigenen Achsen des Knotens. Der Freiheitsgrad muss einer sein, den das Lager des Knotens hält; an einem freien Freiheitsgrad wird der Wert ohne Warnung ignoriert.

Ein einseitig eingespannter Träger, dessen Loslager sich um 10 mm senkt, in einem neuen Solver mit Material und Querschnitt des Temperaturbeispiels:

```ts
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // Einspannung
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // Loslager
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

lc.createPrescribedDisplacement('B', { [DofID.Dz]: 0.01 }) // 10 mm nach unten
solver.solve()

domain.getNode('B').getReactions(lc).values // [566.7] N: 3EIw/L³
beam.computeBendingMomentAt(lc, 0) // -3400.2 N·m in A: 3EIw/L²
```

Das Loslager muss den Träger nach unten ziehen, damit er folgt; seine Auflagerreaktion ist deshalb positiv, in +z-Richtung: $3EIw/L^3 = 3 \cdot 4{,}0803 \times 10^6 \cdot 0{,}01 / 216 = 566{,}7$ N.

::model-figure{caption="Das Loslager eines einseitig eingespannten Trägers senkt sich um 10 mm: −3,4 kNm an der Einspannung"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

Wie die App beide Lasten darstellt, steht unter [Lasten](/de/essentials/loads).
