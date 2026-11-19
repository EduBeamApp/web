---
description: "Fachwerkstab in EduBeam: ein Balkenelement mit zwei Endgelenken, warum das genau das klassische Fachwerkelement ist, Steifigkeits- und Transformationsmatrix."
source: site
---

# Fachwerkstab

Ein Fachwerkstab überträgt nur Normalkraft. EduBeam hat kein eigenes Fachwerkelement: Ein Fachwerkstab ist ein [Balkenelement](/de/elements/beam), bei dem **beide Endgelenke** angehakt sind. Diese Seite zeigt, warum das genau das klassische Fachwerkelement mit zwei Knoten ist, gibt seine Steifigkeits- und Transformationsmatrix an und erklärt, was ein gelenkig angeschlossener Stab kann, was ein Fachwerkstab aus dem Lehrbuch nicht kann.

::model-figure{caption="Jeder Stab an beiden Enden gelenkig: Die Sparren tragen N = −7,071 kN, das Zugband +5 kN, und kein Stab wird gebogen"}
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

Um in der App ein Fachwerk zu modellieren, haken Sie bei jedem Stab **Gelenk am Anfang** und **Gelenk am Ende** an, oder Sie haken beide im Banner an, bevor Sie die Stäbe mit der Maus zeichnen ([Endgelenke](/de/essentials/elements#end-hinges)). Das [Tutorial zum ebenen Fachwerk](/de/tutorials/truss) baut ein solches Fachwerk Schritt für Schritt auf.

## Freiheitsgrade {#degrees-of-freedom}

Ein Fachwerkstab arbeitet mit den beiden Verschiebungen an jedem Ende, ausgedrückt in seinen [lokalen Achsen](/de/elements/conventions#element-local-axes):

::element-sketch{mode="dofs" :hinges='[true,true]' :rotations='false' caption="Ein Fachwerkstab: an beiden Enden gelenkig, an jedem Ende zwei Verschiebungen"}
::

| Richtung | Anfangsknoten (1) | Endknoten (2) |
| --- | --- | --- |
| entlang der lokalen x-Achse | $u_1$ und `X12` | $u_2$ und `X21` |
| entlang der lokalen z-Achse | $w_1$ und `Z12` | $w_2$ und `Z21` |

$$
\mathbf{d}_l = \begin{bmatrix} u_1 & w_1 & u_2 & w_2 \end{bmatrix}^\mathsf{T}.
$$

Die Knoten behalten ihre Verdrehung `Ry`, weil jeder Stab ein Balkenelement ist. Ein an beiden Enden gelenkiger Stab spürt sie aber nicht und überträgt sie nicht: Seine Endmomente `M12` und `M21` sind immer null. An einem Knoten, an dem alle Stäbe gelenkig angeschlossen sind, hält nichts diese Verdrehung. Der Solver setzt sie zu null; ein Knotenmoment an einem solchen Knoten hat aber nichts, worauf es wirken kann, und bricht die Berechnung mit *Die Struktur ist kinematisch: Die Steifigkeitsmatrix ist singulär.* ab.

## Lokale Steifigkeitsmatrix {#local-stiffness-matrix}

$$
\mathbf{K}_l = \frac{EA}{L}
\begin{bmatrix}
 1 & 0 & -1 & 0 \\
 0 & 0 & 0 & 0 \\
 -1 & 0 & 1 & 0 \\
 0 & 0 & 0 & 0
\end{bmatrix},
$$

mit dem Elastizitätsmodul $E$, der Querschnittsfläche $A$ und der Länge $L$. Formänderungsarbeit entsteht nur, wenn der Stab gedehnt wird. Die Normalkraft eines Stabs ohne Elementlasten ist deshalb konstant:

$$
N = \frac{EA}{L}\,(u_2 - u_1).
$$

### Warum ein Balken mit zwei Gelenken ein Fachwerkstab ist {#why-a-beam-with-two-hinges-is-a-truss-bar}

Kondensieren Sie beide Endverdrehungen aus der [Steifigkeitsmatrix des Balkens](/de/elements/beam#local-stiffness-matrix) heraus, wie bei jedem [Endgelenk](/de/elements/beam#end-hinges). Die Längsterme enthalten keine Verdrehungen und bleiben unverändert. Die Biegeterme verschwinden vollständig: Sind beide Verdrehungen frei, dreht jedes Paar von Endverschiebungen $w_1$, $w_2$ den Stab nur als starren Körper um seine Gelenke, und das kostet keine Formänderungsarbeit. Der Solver führt diese Kondensation numerisch durch, für jeden Schubkoeffizienten, und erhält die Matrix oben bis auf Rundungsfehler.

::callout{type="details" title="Die Kondensation Schritt für Schritt"}
Ordnen Sie die Freiheitsgrade des Biegeanteils in beibehaltene, $a = (w_1, w_2)$, und freigegebene, $b = (\varphi_1, \varphi_2)$. Aus der Balkenmatrix folgt mit $k_1$ bis $k_4$ und dem Schubparameter $\Phi$, wie [auf der Seite zum Balkenelement](/de/elements/beam#local-stiffness-matrix) definiert,

$$
\begin{aligned}
\mathbf{K}_{aa} &= k_1 \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{ab} &= k_2 \begin{bmatrix} -1 & -1 \\ 1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{bb} &= \begin{bmatrix} k_3 & k_4 \\ k_4 & k_3 \end{bmatrix}.
\end{aligned}
$$

Da $\mathbf{K}_{ab}$ zwei gleiche Spalten hat, kommt es nur auf die Summe der Einträge von $\mathbf{K}_{bb}^{-1}$ an, und die beträgt $2/(k_3 + k_4)$:

$$
\mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}
= \frac{2\,k_2^2}{k_3 + k_4} \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}.
$$

Mit $k_3 + k_4 = 6EI_y / ((1+\Phi)L)$ ist der Faktor $\dfrac{12\,EI_y}{(1+\Phi)L^3} = k_1$. Das Produkt ist also genau $\mathbf{K}_{aa}$, und die kondensierte Biegesteifigkeit $\mathbf{K}_{aa} - \mathbf{K}_{ab}\mathbf{K}_{bb}^{-1}\mathbf{K}_{ba}$ ist null.
::

## Transformationsmatrix {#transformation-matrix}

Für einen Stab unter dem Winkel $\theta$ von der globalen x-Achse zur globalen z-Achse, mit $c = \cos\theta = (x_2 - x_1)/L$ und $s = \sin\theta = (z_2 - z_1)/L$, sind die lokalen Verschiebungen $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$ mit

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 \\
 -s & c & 0 & 0 \\
 0 & 0 & c & s \\
 0 & 0 & -s & c
\end{bmatrix}:
$$

das sind die Verschiebungszeilen und -spalten der [Transformationsmatrix des Balkens](/de/elements/beam#transformation-matrix). Achten Sie auf das Vorzeichen von $s$, weil z nach unten zeigt: Der Sparren A → C des Fachwerks oben steigt an, also ist $z_2 - z_1 = -3$ m, $c = 0{,}7071$ und $s = -0{,}7071$.

## Globale Steifigkeitsmatrix {#global-stiffness-matrix}

Das Produkt $\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T}$ lautet ausmultipliziert

$$
\mathbf{K}_g = \frac{EA}{L}
\begin{bmatrix}
 c^2 & cs & -c^2 & -cs \\
 cs & s^2 & -cs & -s^2 \\
 -c^2 & -cs & c^2 & cs \\
 -cs & -s^2 & cs & s^2
\end{bmatrix}.
$$

Das Fenster **Steifigkeitsmatrix** eines gelenkig angeschlossenen Stabs zeigt diese Zahlen in den Verschiebungszeilen und -spalten und Nullen für die Verdrehungen.

## Was ein gelenkiger Balken mehr kann als ein Fachwerkstab {#where-a-hinged-beam-does-more}

Weil ein Fachwerkstab in EduBeam immer noch ein Balkenelement ist, kann er zwei Dinge, die ein Fachwerkstab aus dem Lehrbuch nicht kann:

- **Lasten entlang seiner Länge tragen.** Eine Streckenlast auf einem Stab, etwa sein Eigengewicht, biegt den Stab zwischen seinen Knoten wie einen Einfeldträger und gibt an jeden Knoten $qL/2$ ab. Die übrigen Stäbe tragen die Normalkräfte des Fachwerks unter diesen Knotenlasten. Im belasteten Stab selbst lässt die Lastkomponente in Stabrichtung $N$ linear verlaufen, und die Fachwerkstabkraft ist ihr Wert in Stabmitte.
- **Mit Balken kombiniert werden.** Ein Rahmen kann gelenkig angeschlossene Stäbe enthalten, etwa ein Zugband oder eine Aussteifungsdiagonale, ganz ohne besonderen Elementtyp.

Belasten Sie das Zugband des Fachwerks oben mit 5 kN/m:

::model-figure{caption="Dasselbe Fachwerk mit 5 kN/m auf dem Zugband: Die Normalkräfte ändern sich nicht, und das Zugband wird mit M = qL²/8 = 22,5 kNm gebogen"}
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

Die Handrechnung: Am Knoten C liefert das vertikale Gleichgewicht $2\,N \sin 45^\circ + 10 = 0$ in jedem Sparren $N = -7{,}071$ kN. Am Knoten A hält das Zugband der Horizontalkomponente des Sparrens, $7{,}071 \cos 45^\circ = 5$ kN, das Gleichgewicht und ist mit $N = +5$ kN auf Zug beansprucht. Die Last auf dem Zugband geht direkt in die Lager an seinen Enden: Sie erhöht jede Auflagerreaktion um $qL/2 = 15$ kN, die Normalkräfte aber nicht.

Ein Fachwerk muss als gelenkiges System stabil sein. Ein quadratisches Feld ohne Diagonale ist zum Beispiel ein Mechanismus: EduBeam nennt die Gelenke und zeigt die Bewegung ([Fehlerbehebung](/de/reference/troubleshooting#no-results-are-drawn)).
