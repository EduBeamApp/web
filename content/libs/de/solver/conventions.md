---
title: Einheiten und Vorzeichen
description: "Einheiten, Achsen, Freiheitsgrade und Vorzeichenkonventionen von @edubeam/fem, und wie die Richtung eines Stabs das Vorzeichen seiner Ergebnisse ändert."
order: 2
---

# Einheiten und Vorzeichen {#units-and-signs}

Der Solver hat kein eigenes Einheitensystem: Er rechnet mit den Zahlen, die Sie ihm geben. Geben Sie ihm SI-Einheiten, kommt jedes Ergebnis in SI-Einheiten zurück. Die Beispiele auf diesen Seiten und die EduBeam-App tun das immer. Auch die Vorzeichen sind die der App; das Theoriehandbuch erklärt sie mit Abbildungen unter [Koordinatensystem und Vorzeichenkonventionen](/de/elements/conventions).

## Einheiten {#units}

| Größe | Einheit | Beispiel |
| --- | --- | --- |
| Koordinaten, Längen, Positionen entlang eines Stabs | m | `[6, 0, 0]` |
| Kräfte | N | `20e3` für 20 kN |
| Momente | N·m | `10e3` für 10 kNm |
| Streckenlasten | N/m | `12e3` für 12 kN/m |
| Elastizitäts- und Schubmodul | Pa | `210e9` |
| Fläche | m² | `28.5e-4` für 28,5 cm² |
| Flächenträgheitsmoment | m⁴ | `1943e-8` für 1943 cm⁴ |
| Temperaturänderung | K | `20` |
| Wärmeausdehnungskoeffizient | 1/K | `12e-6` |
| Verschiebungen, Verdrehungen | m, rad | `0.01` für 10 mm |

Jedes konsistente Einheitensystem funktioniert, etwa kN, m und kPa; die Ergebnisse sind dann in kN und kNm. Mit SI-Einheiten müssen Sie nichts nachprüfen.

## Achsen {#axes}

- **x** zeigt nach rechts, **z zeigt nach unten**, und das Modell liegt in der x-z-Ebene. Koordinaten sind `[x, y, z]` mit `y = 0`.
- **y** zeigt aus dem Bildschirm heraus zu Ihnen. Verdrehungen und Momente wirken um y, eine positive Drehung ist daher auf dem Bildschirm **gegen den Uhrzeigersinn** gerichtet.
- Die **lokale x-Achse** eines Stabs verläuft von seinem ersten zu seinem zweiten Knoten. Seine **lokale z-Achse** ist die lokale x-Achse, auf dem Bildschirm um 90° im Uhrzeigersinn gedreht: Bei einem von links nach rechts gezeichneten Stab zeigt sie nach unten.

Weil z nach unten zeigt, ist eine Last infolge Schwerkraft ein positives `fz`, und der Kopf einer 4 m hohen Stütze, die bei $z = 0$ steht, liegt bei $z = -4$.

## Freiheitsgrade {#degrees-of-freedom}

Jeder Knoten eines `Beam2D`-Modells hat drei Freiheitsgrade, benannt durch das Enum `DofID`:

| `DofID` | Wert | Bedeutung |
| --- | --- | --- |
| `DofID.Dx` | 0 | Verschiebung in x-Richtung |
| `DofID.Dz` | 2 | Verschiebung in z-Richtung, nach unten |
| `DofID.Ry` | 4 | Verdrehung um y, gegen den Uhrzeigersinn |

`Dy`, `Rx` und `Rz` (1, 3, 5) gibt es im Enum, ebene Stäbe verwenden sie aber nicht.

## Vorzeichen der Ergebnisse {#signs-of-the-results}

| Ergebnis | Positiv bedeutet | Auslesen mit |
| --- | --- | --- |
| Normalkraft N | Zug | `computeNormalForceAt` |
| Biegemoment M | Zug auf der Seite der lokalen +z-Achse: bei einem von links nach rechts definierten Träger Zug unten | `computeBendingMomentAt` |
| Querkraft V | M wächst entlang der lokalen x-Achse, $V = dM/dx$; bei einem von links nach rechts definierten Träger dreht sie ein Stabstück im Uhrzeigersinn: $+qL/2$ am linken Lager eines Einfeldträgers | `computeShearForceAt` |
| Durchbiegung w | in Richtung der lokalen +z-Achse: bei einem von links nach rechts definierten Träger nach unten | `computeLocalDefl` |
| Knotenverschiebung | in +x, +z (nach unten), gegen den Uhrzeigersinn | `node.getUnknowns` |
| Auflagerreaktion | die Kraft, die das Lager auf das Tragwerk ausübt, in +x, +z (nach unten), gegen den Uhrzeigersinn | `node.getReactions` |
| Stabendkräfte | die Kräfte, die die Knoten auf den Stab ausüben, in seinen lokalen Achsen | `computeEndForces` |

Das Festlager eines nach unten belasteten Trägers meldet also eine Auflagerreaktion von −36 000 N in z-Richtung, also 36 kN nach oben.

## Positionen entlang eines Stabs {#positions-along-a-member}

Jede Methode `…At(lc, x)` erwartet `x` in Metern ab dem ersten Knoten des Stabs, nicht als Bruchteil seiner Länge. Einzellasten auf einem Stab werden genauso positioniert.

## Stabrichtung {#member-direction}

M und w werden in den Achsen des Stabs gemessen, deshalb kommt es auf die Reihenfolge seiner beiden Knoten an. Die Tabelle zeigt den Träger mit 12 kN/m aus [Erste Schritte](/de/solver/getting-started), einmal in jeder Richtung definiert. Die Last ist in globalen Achsen angegeben, `[0, 12e3], false`, damit sie beide Male nach unten wirkt; ausgelesen wird mit `computeBendingMomentAt(lc, 3)`, `computeLocalDefl(lc, 2).w[1]` und `computeShearForceAt`:

| Stab | M in Feldmitte | w in Feldmitte | V in A |
| --- | --- | --- | --- |
| `['A', 'B']`, von links nach rechts | +54 000 N·m | +0,0499 m | +36 000 N, bei `x = 0` |
| `['B', 'A']`, von rechts nach links | −54 000 N·m | −0,0499 m | +36 000 N, bei `x = 6` |

Ist der Stab von rechts nach links definiert, zeigt seine lokale z-Achse nach oben: Derselbe Träger mit Zug unten meldet dann ein negatives Moment und eine Durchbiegung nach oben. N und V behalten an jeder Stelle des Trägers ihr Vorzeichen; nur `x` läuft vom anderen Ende aus. Eine Last in lokalen Achsen (`true`) dreht sich mit dem Stab mit: Beim Träger von rechts nach links wirkt `[0, 12e3], true` nach oben.

::callout{type="tip" title="Definieren Sie Stäbe so, wie Sie sie zeichnen"}
Träger von links nach rechts, Stützen von unten nach oben, dann stimmen die Vorzeichen mit dem Lehrbuch überein. Bei einer Stütze von unten nach oben zeigt die lokale z-Achse nach rechts, Zug an der rechten Seite ist also ein positives Moment. Das [Rahmenbeispiel](/de/solver/frames#things-to-notice) zeigt es.
::
