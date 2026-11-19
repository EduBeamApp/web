---
title: Materialien und Querschnitte
description: "Die Material- und Querschnittsparameter von @edubeam/fem: welche jede Berechnung braucht, was passiert, wenn einer fehlt, und wie Sie die Schubverformung abschalten."
order: 4
---

# Materialien und Querschnitte {#materials-and-sections}

Stäbe beziehen ihre Steifigkeit aus einem Material und einem Querschnitt. Beide legen Sie einmal an und verweisen dann über ihre Bezeichnung darauf.

```ts
domain.createMaterial('steel', { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection('IPE200', {
  a: 28.5e-4, // m²
  iy: 1943e-8, // m⁴
  h: 0.2, // m
  k: 5 / 6,
})
```

## Material {#material}

| Parameter | Bedeutung | Einheit | Benötigt für |
| --- | --- | --- | --- |
| `e` | Elastizitätsmodul $E$ | Pa | immer |
| `g` | Schubmodul $G$ | Pa | immer, außer `k` ist riesig (keine Schubverformung) |
| `alpha` | Wärmeausdehnungskoeffizient $\alpha$ | 1/K | Temperaturlasten |
| `d` | Dichte $\rho$ | kg/m³ | nichts in einer statischen Berechnung |

Ein weggelassener Parameter erhält den Wert **1**, keinen typischen Wert, und es gibt keine Warnung. Vergessen Sie `g` beim Träger aus „Erste Schritte“, beträgt seine Durchbiegung 22 700 km.

## Querschnitt {#cross-section}

| Parameter | Bedeutung | Einheit | Benötigt für |
| --- | --- | --- | --- |
| `a` | Fläche $A$ | m² | immer: Dehn- und Schubsteifigkeit |
| `iy` | Flächenträgheitsmoment $I_y$ | m⁴ | immer: Biegesteifigkeit |
| `k` | Schubkoeffizient $k$ | – | immer: Schubsteifigkeit $kGA$ |
| `h` | Höhe $h$ | m | Temperaturunterschiede |
| `iz`, `dyz`, `j` | $I_z$, $I_{yz}$, Torsionsträgheitsmoment | m⁴ | nichts in einem ebenen Modell |

Ein Querschnitt hat keine Standardwerte. Fehlt `a`, `iy` oder `k`, ist jedes Ergebnis `NaN`; fehlt `h`, ergibt ein Temperaturunterschied `NaN`. In keinem der Fälle wird ein Fehler geworfen, ein `NaN` im Ergebnis bedeutet also fast immer einen fehlenden Parameter.

## Schubverformung {#shear-deformation}

Der Stab ist ein Timoshenko-Balken: Er verformt sich durch Schub ebenso wie durch Biegung. Wie groß der Schubanteil ist, bestimmt der Schubparameter

$$
\Phi = \frac{12\,EI_y}{k\,G\,A\,L^2},
$$

den `beam.computeShearFactor()` zurückgibt. Bei schlanken Stäben ist $\Phi$ winzig, und die Durchbiegungen wachsen um Bruchteile eines Prozents. Bei kurzen, hohen Stäben fällt er ins Gewicht.

Für den Euler-Bernoulli-Balken der Tabellenwerke machen Sie die Schubsteifigkeit mit einem riesigen Schubkoeffizienten praktisch unendlich groß, wie es auch die Beispiele der EduBeam-App tun:

```ts
domain.createCrossSection('IPE200-EB', { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
```

Die Beispielprogramme auf diesen Seiten tun das, damit ihre Zahlen exakt mit den Formeln übereinstimmen. Ein realistischer Schubkoeffizient für einen Rechteckquerschnitt ist $k = 5/6$. Die Seite [Ergebnisse von Hand prüfen](/de/guide/verification#shear-deformation) zeigt, wie groß der Effekt ist.

## Dehnstarre Stäbe {#rigid-in-axial-direction}

Eine große Fläche macht Stäbe praktisch undehnbar, wie es Handrechnungen meist annehmen. Die Schnittgrößen eines Rahmens hängen nur wenig von der Fläche ab, die Verschiebungen eines Fachwerks dagegen vollständig. Die Schnittgrößen eines statisch bestimmten Tragwerks hängen von überhaupt keiner Steifigkeit ab.

## Nachträglich ändern {#change-them-later}

```ts
domain.getMaterial('steel').change({ e: 200e9 })
domain.getCS('IPE200').change({ iy: 2000e-8 })
solver.solve()
```

Jeder Stab liest Material und Querschnitt erst, wenn der Solver assembliert; ein neues `solve()` genügt also. Verschiedene Stäbe können verschiedene Querschnitte haben: Geben Sie jedem eine eigene Bezeichnung.
