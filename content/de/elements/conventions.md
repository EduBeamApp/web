---
description: "Vorzeichen in EduBeam: x nach rechts, z nach unten, positive Lasten und Verschiebungen, lokale Achsen, N, V und M, Stabendkräfte, Reaktionen, y nach oben."
source: site
---

# Koordinatensystem & Vorzeichenkonventionen

Jede Zahl, die EduBeam anzeigt, hat ein Vorzeichen. Diese Seite legt fest, was *positiv* bei Koordinaten, Lasten, Verschiebungen, Schnittgrößen, Stabendkräften und Auflagerreaktionen bedeutet, damit Sie die App mit Ihrer eigenen Rechnung vergleichen können. Hinter den meisten Ergebnissen, die falsch aussehen, steckt am Ende eine Vorzeichenkonvention.

| Größe | Positiv |
| --- | --- |
| `x`, `Dx`, `Fx` | nach rechts |
| `z`, `Dz`, `Fz` | **nach unten** |
| `Ry`, `My` | gegen den Uhrzeigersinn auf dem Bildschirm |
| $N$ | Zug |
| $V$ | dreht ein kurzes Stabstück im Uhrzeigersinn |
| $M$ | Zug in der unteren Faser, auf der Seite der gestrichelten Linie |
| Auflagerreaktionen | die Kraft, die das Lager auf das Tragwerk ausübt, mit Vorzeichen wie eine Last |

## Globale Achsen {#global-axes}

Das Modell liegt in der x–z-Ebene:

- **x** ist horizontal, positiv nach **rechts**.
- **z** ist vertikal, positiv **nach unten**.
- **y** zeigt aus dem Bildschirm heraus auf Sie zu; damit ist das System ein Rechtssystem. Verdrehungen und Momente wirken um die y-Achse, deshalb ist **gegen den Uhrzeigersinn positiv**.

Das Achsenkreuz in der Ecke der Zeichenfläche zeigt x in Rot und z in Grün. Weil z nach unten zeigt, hat der Knoten am Kopf einer 3 m hohen Stütze mit dem Fußpunkt bei `Z = 0` die Koordinate `Z = −3`. Winkel, etwa der Winkel eines schrägen Lagers, werden von x nach z gemessen, also auf dem Bildschirm im Uhrzeigersinn.

Wenn Ihnen eine nach oben zeigende y-Achse lieber ist, stellen Sie die [Anzeigekonvention](#y-up-axes) um: Das Modell bleibt dasselbe, nur die Zahlen, die Sie ablesen und eingeben, ändern sich.

## Freiheitsgrade {#degrees-of-freedom}

Jeder Knoten hat drei Freiheitsgrade:

| Freiheitsgrad | Bedeutung | Positiv | Einheit |
| --- | --- | --- | --- |
| `Dx` | horizontale Verschiebung | nach rechts | m |
| `Dz` | vertikale Verschiebung | nach unten | m |
| `Ry` | Verdrehung | gegen den Uhrzeigersinn | rad |

Dieselben Vorzeichen gelten für [vorgegebene Verschiebungen](/de/essentials/loads#prescribed-displacements-support-settlements), für die Tabelle *Knotenergebnisse* und für die Werte, die erscheinen, wenn Sie mit der Maus auf einen Knoten zeigen.

## Lasten {#loads}

Lasten sind in Richtung der positiven Achsen positiv. **Fx**, **Fz** und **My** sind die Komponenten einer Knotenlast oder Einzellast, **fx** und **fz** die einer Gleichlast und **f₁x**, **f₂x**, **f₁z**, **f₂z** die einer Trapezlast am Anfang und am Ende des Elements.

| Last | Positive Richtung |
| --- | --- |
| `Fx`, `fx`, `f₁x`, `f₂x` | +x, nach rechts; entlang der lokalen x-Achse des Elements, wenn **LCS** angehakt ist |
| `Fz`, `fz`, `f₁z`, `f₂z` | +z, **nach unten**; entlang der lokalen z-Achse des Elements, wenn **LCS** angehakt ist |
| `My` | gegen den Uhrzeigersinn |
| `ΔTc` | Erwärmung der Stabachse, die den Stab verlängert |
| `ΔTb − ΔTt` | untere Faser wärmer als die obere |

Eigengewicht ist also ein **positives** `fz`, und Wind, der eine linke Stütze nach rechts drückt, ein positives `fx`. Eine Streckenlast wirkt immer je Meter der Länge des Stabs selbst, auch wenn sie auf einem geneigten Stab in globalen Achsen angegeben ist. Wie Sie die einzelnen Lasttypen eingeben, zeigt die Seite [Lasten](/de/essentials/loads#element-loads).

::model-figure{caption="Alle Lasten hier sind positiv: fz = 5 kN/m auf A–B, Fz = 10 kN in B, My = 10 kNm in C und Fx = 10 kN in D"}
---
nodes: { A: [0, 0], B: [3, 0], C: [4.5, 0], D: [6, 0] }
supports: { A: fixed }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 5 }
  - { node: B, fz: 10 }
  - { node: C, my: 10 }
  - { node: D, fx: 10 }
results: []
reactions: false
show: [nodeLabels]
---
::

## Lokale Achsen des Elements {#element-local-axes}

Jedes Element hat seine eigenen Achsen:

- Die **lokale x-Achse** verläuft vom Anfangsknoten des Elements zu seinem Endknoten.
- Die **lokale z-Achse** ist die lokale x-Achse, um 90° **im Uhrzeigersinn auf dem Bildschirm** gedreht, also dieselbe Drehung, die die globale x-Achse in die globale z-Achse überführt. Wenn Sie vom Anfangsknoten zum Endknoten gehen, liegt die lokale z-Achse rechts von Ihnen.

| Zeichenrichtung des Elements | Lokale z-Achse zeigt |
| --- | --- |
| von links nach rechts | nach unten: lokale und globale Achsen fallen zusammen |
| von rechts nach links | nach oben |
| von unten nach oben | nach rechts |
| von oben nach unten | nach links |

Die Richtung des Elements ist sein Winkel $\theta$, gemessen von der globalen x-Achse zur globalen z-Achse (auf dem Bildschirm im Uhrzeigersinn). Die [Transformationsmatrix](/de/elements/beam#transformation-matrix) rechnet Endverschiebungen mit $\cos\theta$ und $\sin\theta$ zwischen beiden Systemen um.

In der Ansicht markiert eine gestrichelte Linie entlang jedes Elements seine lokale +z-Seite: seine **untere Faser**. Elementlasten mit angehaktem **LCS**, die Position einer Einzellast und die Stabendkräfte richten sich alle nach den lokalen Achsen. Um ein Element umzudrehen, verwenden Sie **Knotenreihenfolge tauschen** in der Tabelle *Elemente* (siehe [Elementrichtung](/de/essentials/elements#element-direction)).

## Schnittgrößen {#internal-forces}

Schneiden Sie einen Stab im Abstand $x$ von seinem Anfangsknoten. Am Schnittufer des Teils **vor** dem Schnitt, dessen äußere Normale in Richtung der lokalen +x-Achse zeigt, sind die Schnittgrößen positiv, wenn sie in Richtung der lokalen +x-Achse, der lokalen +z-Achse und gegen den Uhrzeigersinn wirken. Am anderen Schnittufer wirken sie entgegengesetzt.

::element-sketch{mode="internal-forces" caption="Positive N, V und M an einem kurzen Stabstück: Zug, ein Querkraftpaar im Uhrzeigersinn, positives Moment (Zug in der gestrichelten unteren Faser)"}
::

In Worten:

| Größe | Positiv bedeutet |
| --- | --- |
| $N$ | Zug |
| $V$ | dreht ein kurzes Stabstück im Uhrzeigersinn: bei einem von links nach rechts gezeichneten Stab am linken Schnittufer des Stücks nach oben und am rechten nach unten |
| $M$ | **Zug unten**, also in der unteren Faser auf der gestrichelten Seite |

Mit den Komponenten $q_x$ und $q_z$ der Streckenlast in lokalen Achsen gelten die differentiellen Gleichgewichtsbeziehungen

$$
\frac{\mathrm{d}N}{\mathrm{d}x} = -q_x, \qquad \frac{\mathrm{d}V}{\mathrm{d}x} = -q_z, \qquad \frac{\mathrm{d}M}{\mathrm{d}x} = V.
$$

An einer Einzellast $F_x$, $F_z$ oder einem Einzelmoment $M_y$ (in lokalen Achsen) springen sie um $\Delta N = -F_x$, $\Delta V = -F_z$ und $\Delta M = -M_y$: Eine Kraft in Richtung der lokalen +z-Achse verringert $V$, und ein Moment gegen den Uhrzeigersinn verringert $M$.

Ein Einfeldträger unter Eigengewicht hat deshalb ein positives Moment, am linken Lager eine positive und am rechten Lager eine negative Querkraft. Der Träger unten wird außerdem am Loslager gezogen, seine Normalkraft ist also positiv.

::model-figure{caption="Einfeldträger, 10 kN/m und 20 kN Zug: M = +45 kNm in Feldmitte, V = +30 kN am linken Lager und −30 kN am rechten, N = +20 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
  - { node: B, fx: 20 }
results: [M, V, N]
---
::

Beim Kragträger kehrt sich das Moment um: Die Zugseite liegt oben. Eine Druckkraft in Achsrichtung staucht ihn.

::model-figure{caption="Kragträger mit 10 kN am Kragende und 15 kN Druck: M = −40 kNm an der Einspannung, V = +10 kN, N = −15 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 10 }
  - { member: 1, px: -15, at: 4 }
results: [M, V, N]
---
::

In einem Rahmen ist die Unterseite jedes Stabs seine lokale +z-Seite. Die Reihenfolge, in der Sie eine Stütze zeichnen, entscheidet also, welche ihrer Seiten unten ist. Dieser Rahmen ist A → B → C → D gezeichnet, dadurch liegt die lokale z-Achse aller Stäbe innen: Ein positives Moment bedeutet Zug an der Rahmeninnenseite, und die negativen Eckmomente bedeuten Zug an der Außenseite.

::model-figure{caption="Portalrahmen, gezeichnet A → B → C → D: Die lokale z-Achse aller drei Stäbe zeigt ins Rahmeninnere"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: pin, D: pin }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

Die Verläufe werden so gezeichnet, wie es die meisten europäischen Lehrveranstaltungen tun: $M$ auf der Zugseite, positive $N$ und $V$ auf der Seite gegenüber der gestrichelten Linie. Unter **Einstellungen → Anzeigeeinstellungen → Schnittgrößenverläufe** können Sie $M$ auf die Druckseite und $N$ oder $V$ auf die gestrichelte Seite legen. Das ändert die Zeichnung, nie die Werte: Lesen Sie das Vorzeichen an der Beschriftung ab, nicht an der Seite.

## Stabendkräfte (Tabelle Elementergebnisse) {#end-forces-element-results-table}

Die Tabelle *Elementergebnisse* listet für jedes Element sechs **Stabendkräfte** in seinen **lokalen** Achsen auf:

::element-sketch{mode="end-forces" caption="Die sechs Stabendkräfte, alle positiv gezeichnet: entlang der lokalen x- und z-Achse und gegen den Uhrzeigersinn"}
::

| Spalte | Wirkt auf das Element an | Positiv in Richtung |
| --- | --- | --- |
| `X12`, `Z12`, `M12` | seinem Anfangsknoten | lokal +x, lokal +z, gegen den Uhrzeigersinn |
| `X21`, `Z21`, `M21` | seinem Endknoten | lokal +x, lokal +z, gegen den Uhrzeigersinn |

Es sind die Kräfte, die die Knoten auf das Element ausüben: seine Steifigkeitsmatrix mal seine Endverschiebungen, plus die Kräfte, die seine Elementlasten bei beidseitiger Einspannung halten würden (Volleinspannkräfte),

$$
\begin{gathered}
\mathbf{f} = \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}, \\[1ex]
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix} = \mathbf{K}_l\,\mathbf{d}_l - \mathbf{f}_\mathrm{eq},
\end{gathered}
$$

wobei $\mathbf{d}_l$ die Endverschiebungen des Elements in lokalen Achsen sind und $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$ die äquivalenten Knotenlasten seiner [Elementlasten](/de/elements/beam#element-loads).

Stabendkräfte folgen den Achsen, nicht der $N$-$V$-$M$-Konvention. Am Anfangsknoten haben sie deshalb das umgekehrte Vorzeichen:

$$
\begin{aligned}
N(0) &= -X_{12}, & N(L) &= X_{21}, \\
V(0) &= -Z_{12}, & V(L) &= Z_{21}, \\
M(0) &= -M_{12}, & M(L) &= M_{21}.
\end{aligned}
$$

Für den Einfeldträger oben: `X12 = −20 kN` und `X21 = +20 kN` (Zug), `Z12 = Z21 = −30 kN` (beide Lager drücken nach oben, also in −z) und `M12 = M21 = 0`.

An jedem Knoten ergeben die Stabendkräfte der dort zusammentreffenden Elemente, in globale Achsen gedreht, zusammen die Knotenlast plus die Auflagerreaktion. Damit lässt sich das Gleichgewicht eines Knotens schnell prüfen.

## Auflagerreaktionen {#reactions}

Eine Auflagerreaktion ist die Kraft oder das Moment, das ein Lager **auf das Tragwerk** ausübt, eine für jeden gehaltenen Freiheitsgrad. Für ihr Vorzeichen gilt dieselbe Regel wie für Lasten: positiv in Richtung +x, +z (nach unten) und gegen den Uhrzeigersinn. Ein Lager, das Eigengewicht abträgt, hat deshalb ein **negatives** `Rz`.

Auflagerreaktionen stehen in globalen Achsen oder, wenn der Knoten einen **Knoten-LKS-Winkel** hat (ein [schräges Lager](/de/essentials/nodes-supports#inclined-skewed-supports)), in den eigenen Achsen des Knotens. In der Ansicht ist jede Auflagerreaktion ein Pfeil in die Richtung, in die das Lager drückt, beschriftet mit ihrem Betrag. Die Werte mit Vorzeichen stehen im CSV-Export als `Rx`, `Rz` und `My`.

## Achsen mit y nach oben {#y-up-axes}

**Einstellungen → Sprache & Region → Koordinatensystem → x nach rechts, y nach oben** stellt alles, was Sie eingeben und ablesen, auf das Lehrbuchsystem um: **x** nach rechts, **y** nach oben und **z** auf Sie zu. Das Modell, gespeicherte Dateien und Zeichnungen bleiben genau gleich; nur die Zahlen und die Buchstaben ändern sich:

| Größe | x nach rechts, z nach unten (Standard) | x nach rechts, y nach oben |
| --- | --- | --- |
| Vertikale Koordinate | `Z` | `Y`, umgekehrtes Vorzeichen |
| Vertikale Lasten, Verschiebungen, Auflagerreaktionen, Stabendkräfte | `Fz`, `fz`, `Dz`, `Rz`, `Z12`… | `Fy`, `fy`, `Dy`, `Ry`, `Y12`…, umgekehrtes Vorzeichen |
| Verdrehungen und Momente | `Ry`, `My` | `Rz`, `Mz`, gleiches Vorzeichen (gegen den Uhrzeigersinn positiv) |
| Lagerwinkel | im Uhrzeigersinn gemessen | gegen den Uhrzeigersinn gemessen, umgekehrtes Vorzeichen |
| Schnittgrößen | $N$, $V$, $M$ | dieselben, mit denselben Vorzeichen, gleich gezeichnet |

Mit y nach oben ist Eigengewicht also ein **negatives** `fy`, und der Kopf einer 3 m hohen Stütze hat `Y = 3`.

## Einheiten {#units}

Der Solver rechnet durchgehend in SI: m, N, Pa, rad und K für Temperaturänderungen. Die Anzeigeeinheiten unter [Einheiten & Einstellungen](/de/essentials/units-settings) ändern nur, was Sie eingeben und ablesen, nie das Modell.
