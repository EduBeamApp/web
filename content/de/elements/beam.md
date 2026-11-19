---
description: "Das Timoshenko-Balkenelement in EduBeam: exakte Steifigkeitsmatrix, Schubverformung, Endgelenke per statischer Kondensation, Volleinspannkräfte, Transformation."
source: site
---

# Balkenelement

Jeder Stab in EduBeam, ob Träger, Stütze oder Fachwerkstab, ist dasselbe Element: ein gerader **Timoshenko-Balken** mit zwei Knoten in der x–z-Ebene und konstantem Querschnitt. Diese Seite gibt seine Formulierung genau so wieder, wie der Solver sie rechnet. So können Sie jede Elementmatrix und jeden Lastvektor von Hand aufstellen und mit der App vergleichen. Die Vorzeichen folgen der Seite [Koordinatensystem & Vorzeichenkonventionen](/de/elements/conventions), der Code steht in `Beam2D.ts` der Solver-Bibliothek [@edubeam/fem](/de/solver), und die Seite [Wie EduBeam ein Modell berechnet](/de/elements/analysis) zeigt, wie aus den Elementen eine Lösung entsteht.

## Freiheitsgrade {#degrees-of-freedom}

Jeder Knoten hat drei Freiheitsgrade, das Element also sechs. In den [lokalen Achsen](/de/elements/conventions#element-local-axes) des Elements gehört zu jeder Endverschiebung eine [Stabendkraft](/de/elements/conventions#end-forces-element-results-table), die als eigene Spalte in der Tabelle *Elementergebnisse* steht:

::element-sketch{mode="dofs" caption="Die sechs Freiheitsgrade des Balkenelements, alle positiv gezeichnet; die gestrichelte Linie markiert die untere Faser (lokal +z)"}
::

| Richtung | Anfangsknoten (1) | Endknoten (2) |
| --- | --- | --- |
| entlang der lokalen x-Achse | $u_1$ und `X12` | $u_2$ und `X21` |
| entlang der lokalen z-Achse, bei einem von links nach rechts gezeichneten Element nach unten | $w_1$ und `Z12` | $w_2$ und `Z21` |
| Verdrehung, gegen den Uhrzeigersinn | $\varphi_1$ und `M12` | $\varphi_2$ und `M21` |

In dieser Reihenfolge bilden sie den Verschiebungs- und den Kraftvektor des Elements:

$$
\begin{aligned}
\mathbf{d}_l &= \begin{bmatrix} u_1 & w_1 & \varphi_1 & u_2 & w_2 & \varphi_2 \end{bmatrix}^\mathsf{T}, \\
\mathbf{f} &= \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}.
\end{aligned}
$$

Weil z nach unten zeigt und Verdrehungen gegen den Uhrzeigersinn positiv sind, dreht sich die Achse eines Balkens ohne Schubverformung um $\varphi = -\,\mathrm{d}w/\mathrm{d}x$.

## Lokale Steifigkeitsmatrix {#local-stiffness-matrix}

Für ein Element ohne Elementlasten gilt für die Stabendkräfte $\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l$ mit

$$
\mathbf{K}_l =
\begin{bmatrix}
 k_N & 0 & 0 & -k_N & 0 & 0 \\
 0 & k_1 & -k_2 & 0 & -k_1 & -k_2 \\
 0 & -k_2 & k_3 & 0 & k_2 & k_4 \\
 -k_N & 0 & 0 & k_N & 0 & 0 \\
 0 & -k_1 & k_2 & 0 & k_1 & k_2 \\
 0 & -k_2 & k_4 & 0 & k_2 & k_3
\end{bmatrix}
$$

und

$$
\begin{aligned}
k_N &= \frac{EA}{L}, & k_1 &= \frac{12\,EI_y}{(1+\Phi)\,L^3}, \\[1ex]
k_2 &= \frac{6\,EI_y}{(1+\Phi)\,L^2}, & k_3 &= \frac{(4+\Phi)\,EI_y}{(1+\Phi)\,L}, \\[1ex]
k_4 &= \frac{(2-\Phi)\,EI_y}{(1+\Phi)\,L}, & \Phi &= \frac{12\,EI_y}{k\,GA\,L^2}.
\end{aligned}
$$

Dabei sind $E$ und $G$ der Elastizitäts- und der Schubmodul des Materials, $A$ die Querschnittsfläche, $I_y$ das Flächenträgheitsmoment um die y-Achse, $k$ der **Schubkoeffizient** des Querschnitts und $L$ die Elementlänge. $\Phi$ ist der **Schubparameter**: Er gibt an, wie nachgiebig der Stab auf Schub im Vergleich zur Biegung ist, und wächst, je kürzer und höher der Stab ist. Mit $\Phi = 0$ ergeben sich die bekannten Terme $12EI/L^3$, $6EI/L^2$, $4EI/L$ und $2EI/L$ des Euler-Bernoulli-Balkens. Längs- und Biegetragwirkung sind entkoppelt: $u_1$ und $u_2$ kommen nur in $k_N$ vor.

Lehrbücher mit nach oben zeigender y-Achse schreiben $+6EI/L^2$, wo diese Matrix $-k_2$ hat. Beide beschreiben dieselbe Steifigkeit; nur die positive Richtung der Querverschiebung ist eine andere.

::callout{type="details" title="Woher die Matrix kommt: die exakten Formfunktionen"}
Für einen prismatischen, unbelasteten Timoshenko-Stab haben die Gleichgewichtsgleichungen eine exakte Lösung: $u$ ist linear in $x$, $w$ kubisch und $\varphi$ quadratisch. Durch die Endverschiebungen ausgedrückt lautet die Durchbiegung mit $\xi = x/L$

$$
w(\xi) = N_1\,w_1 + N_2\,\varphi_1 + N_3\,w_2 + N_4\,\varphi_2,
$$

$$
\begin{aligned}
N_1 &= \frac{(1-\xi)\,(1+\Phi+\xi-2\xi^2)}{1+\Phi}, \\[1ex]
N_2 &= -\frac{L\,\xi\,(1-\xi)\,(2+\Phi-2\xi)}{2\,(1+\Phi)}, \\[1ex]
N_3 &= \frac{\xi\,(\Phi+3\xi-2\xi^2)}{1+\Phi}, \\[1ex]
N_4 &= \frac{L\,\xi\,(1-\xi)\,(\Phi+2\xi)}{2\,(1+\Phi)}.
\end{aligned}
$$

Für $\Phi = 0$ sind das die kubischen Hermite-Polynome, $N_1 = 1 - 3\xi^2 + 2\xi^3$ und $N_2 = -L\,\xi(1-\xi)^2$; das Minuszeichen stammt aus $\varphi = -w'$. Die Steifigkeitsmatrix enthält genau die Stabendkräfte, die diese exakten Verformungen erfordern. Sie ist also die exakte Steifigkeit des Stabs und keine Näherung, die erst mit mehr Elementen besser wird. Mit denselben Funktionen zeichnet der Solver auch die Verformungsfigur.
::

## Schubverformung: Timoshenko oder Euler-Bernoulli? {#timoshenko-or-euler-bernoulli}

Ob sich das Element durch Schub verformt, hängt allein von $\Phi$ ab und damit vom Schubkoeffizienten $k$ des Querschnitts: $kA$ ist die Fläche, die den Schub abträgt. Jede Querschnittsart erhält zunächst ihren eigenen Wert von $k$:

| Querschnitt | Schubkoeffizient $k$ |
| --- | --- |
| Startmodell und mitgelieferte Beispiele | $10^{32}$, sodass $\Phi \approx 0$: Euler-Bernoulli |
| I-, H- und Breitflanschprofile aus der Bibliothek | $h\,t_w / A$: der Steg trägt den Schub |
| Rechteckige Hohlprofile aus der Bibliothek | $2\,h\,t / A$: die beiden Seitenwände |
| Rechtecke und Quadrate aus der Bibliothek | 0,833 |
| Kreise aus der Bibliothek | 0,9 |
| Runde Hohlprofile aus der Bibliothek | 0,5 |
| Polygonale Querschnitte | anfangs 0,833 |
| Dialog **Querschnitt hinzufügen** | anfangs 1 |

Bei einem schlanken Stab ist der Unterschied klein. Beim Einfeldträger unter Gleichlast vergrößert der Schub die Biegedurchbiegung in Feldmitte um den Anteil $0{,}8\,\Phi$. Bei einem IPE 200 aus Stahl sind das 1,2 % bei 6 m Spannweite, aber 11 % bei 2 m. Um die Schubverformung abzuschalten, setzen Sie $k$ auf eine sehr große Zahl wie `1e32`. Sofern nicht anders angegeben, verwenden die interaktiven Abbildungen auf dieser Website den schubstarren Querschnitt der Beispiele und stimmen deshalb mit Handrechnungen nach der Euler-Bernoulli-Theorie überein. Die folgende nicht:

::model-figure{caption="IPE 200 über 2 m mit k = h·tw/A = 0,393: w = 0,5657 mm in Feldmitte, 11 % mehr als die 0,5106 mm nach Euler-Bernoulli-Theorie (Φ = 0,135)"}
---
nodes: { A: [0, 0], B: [2, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
material: { e: 210e9, g: 81e9 }
section: { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 }
results: [w, M]
---
::

## Endgelenke {#end-hinges}

Ein angehaktes [Endgelenk](/de/essentials/elements#end-hinges) setzt das Moment an diesem Elementende zu null. Die Endverdrehung des Elements ist dann frei, und der Solver eliminiert sie durch **statische Kondensation**. Dazu werden die sechs Freiheitsgrade in die beibehaltenen, $a$, und die freigegebenen Endverdrehungen, $b$, aufgeteilt:

$$
\begin{bmatrix} \mathbf{f}_a \\ \mathbf{0} \end{bmatrix}
=
\begin{bmatrix} \mathbf{K}_{aa} & \mathbf{K}_{ab} \\ \mathbf{K}_{ba} & \mathbf{K}_{bb} \end{bmatrix}
\begin{bmatrix} \mathbf{d}_a \\ \mathbf{d}_b \end{bmatrix}
+
\begin{bmatrix} \mathbf{f}_{\mathrm{fix},a} \\ \mathbf{f}_{\mathrm{fix},b} \end{bmatrix}.
$$

Hier sind $\mathbf{f}_\mathrm{fix}$ die Volleinspannkräfte aus den [Elementlasten](#element-loads). Die zweite Zeile liefert die Verdrehung am Gelenk,

$$
\mathbf{d}_b = -\mathbf{K}_{bb}^{-1}\left(\mathbf{K}_{ba}\,\mathbf{d}_a + \mathbf{f}_{\mathrm{fix},b}\right),
$$

und eingesetzt in die erste Zeile bleiben die kondensierte Steifigkeit und die kondensierten Volleinspannkräfte

$$
\begin{aligned}
\mathbf{K}^{*} &= \mathbf{K}_{aa} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}, \\
\mathbf{f}^{*}_\mathrm{fix} &= \mathbf{f}_{\mathrm{fix},a} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{f}_{\mathrm{fix},b}.
\end{aligned}
$$

Der Solver schreibt $\mathbf{K}^{*}$ in eine 6 × 6-Matrix zurück, mit Nullzeilen und -spalten für die freigegebenen Verdrehungen. Ein Element mit Gelenk wird also genauso assembliert wie jedes andere. Nach der Lösung berechnet der Solver $\mathbf{d}_b$ mit der Formel oben, und die Verformungsfigur zeigt den Knick am Gelenk.

Mit einem Gelenk am Endknoten wird der Biegeanteil für $(w_1, \varphi_1, w_2)$ zu

$$
\mathbf{K}^{*}_{w} = \frac{12\,EI_y}{(4+\Phi)\,L^3}
\begin{bmatrix} 1 & -L & -1 \\ -L & L^2 & L \\ -1 & L & 1 \end{bmatrix},
$$

für $\Phi = 0$ also die klassische Steifigkeit $3EI/L^3$ eines einseitig eingespannten Stabs. Mit Gelenken an **beiden** Enden bleibt von den Biegetermen nichts übrig, nur noch $EA/L$: Das Element ist ein [Fachwerkstab](/de/elements/truss).

Ein Gelenk gehört zu einem Elementende, nicht zum Knoten. Sind alle Elemente, die an einem Knoten zusammentreffen, dort gelenkig angeschlossen, ist mit der Verdrehung des Knotens selbst nichts verbunden. Der Solver setzt sie zu null, was unschädlich ist; ein Knotenmoment an einem solchen Knoten hat aber nichts, worauf es wirken kann, und macht das Gleichungssystem singulär.

## Elementlasten {#element-loads}

Lasten entlang eines Elements gehen als **äquivalente Knotenlasten** $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$ in die Lösung ein. Die **Volleinspannkräfte** $\mathbf{f}_\mathrm{fix}$ sind die Stabendkräfte, die das belastete Element bei beidseitiger Einspannung festhalten.

Alle Formeln unten gelten in lokalen Achsen. Eine Last in globalen Achsen (**LCS** nicht angehakt) wird zuerst mit $c = \cos\theta$ und $s = \sin\theta$ des [Elementwinkels](#transformation-matrix) in lokale Komponenten zerlegt,

$$
q_x = c\,\bar q_x + s\,\bar q_z, \qquad q_z = -s\,\bar q_x + c\,\bar q_z,
$$

wobei der Querstrich die globalen Komponenten kennzeichnet. Streckenlasten wirken je Meter der Elementlänge selbst. Ein Sparren von $(0, 0)$ nach $(3, -4)$ hat zum Beispiel $L = 5$ m, $c = 0{,}6$ und $s = -0{,}8$ (er steigt an, also nimmt $z$ ab). Eine lotrechte Last wie das Eigengewicht, $\bar q_z = 10$ kN/m, hat auf ihm die Komponenten $q_x = -8$ kN/m hangabwärts und $q_z = 6$ kN/m quer zum Sparren, und der Sparren trägt insgesamt $10 \times 5 = 50$ kN, nicht $10 \times 3$.

In den Tabellen bedeuten:

- $q_z$, $q_x$: eine Gleichlast; $q_1 \to q_2$: eine Trapezlast, $q_1$ am Anfangsknoten und $q_2$ am Endknoten.
- $F_z$, $F_x$, $M_y$: eine Kraft oder ein Moment im Abstand $a$ vom Anfangsknoten, mit $b = L - a$.
- $\Delta T = \Delta T_b - \Delta T_t$: untere Faser wärmer als die obere; $\Delta T_c$: Erwärmung der Stabachse. $\alpha$ ist die Wärmedehnzahl des Materials und $h$ die **Höhe** des Querschnitts.

Quer zur Achse (z-Komponenten) und für $\Phi = 0$, am Anfangsknoten:

$$
\begin{array}{l|cc}
\text{Last} & Z_{12} & M_{12} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & \dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(7q_1+3q_2)}{20} & \dfrac{L^2\,(3q_1+2q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,b^2\,(3a+b)}{L^3} & \dfrac{F_z\,a\,b^2}{L^2} \\[3ex]
M_y & -\dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,b\,(b-2a)}{L^2} \\[3ex]
\Delta T & 0 & \dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

Am Endknoten:

$$
\begin{array}{l|cc}
\text{Last} & Z_{21} & M_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & -\dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(3q_1+7q_2)}{20} & -\dfrac{L^2\,(2q_1+3q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,a^2\,(a+3b)}{L^3} & -\dfrac{F_z\,a^2\,b}{L^2} \\[3ex]
M_y & \dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,a\,(a-2b)}{L^2} \\[3ex]
\Delta T & 0 & -\dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

Entlang der Achse (x-Komponenten), für beliebiges $\Phi$:

$$
\begin{array}{l|cc}
\text{Last} & X_{12} & X_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_x & -\dfrac{q_x L}{2} & -\dfrac{q_x L}{2} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(2q_1+q_2)}{6} & -\dfrac{L\,(q_1+2q_2)}{6} \\[3ex]
F_x & -\dfrac{F_x\,b}{L} & -\dfrac{F_x\,a}{L} \\[3ex]
\Delta T_c & EA\,\alpha\,\Delta T_c & -EA\,\alpha\,\Delta T_c
\end{array}
$$

::callout{type="details" title="Volleinspannkräfte mit Schubverformung"}
Gleichlast und Temperaturlast ergeben für jedes $\Phi$ dieselben Volleinspannkräfte. Für die übrigen Lasten gilt mit $D = 1 + \Phi$ und $\Delta q = q_2 - q_1$ (z-Komponenten):

$$
\begin{aligned}
&\text{Trapezlast:} \\
Z_{12} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(9+10\Phi)}{60\,D}, \\[1ex]
M_{12} &= \frac{q_1 L^2}{12} + \frac{\Delta q\,L^2\,(4+5\Phi)}{120\,D}, \\[1ex]
Z_{21} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(21+20\Phi)}{60\,D}, \\[1ex]
M_{21} &= -\frac{q_1 L^2}{12} - \frac{\Delta q\,L^2\,(6+5\Phi)}{120\,D}; \\[3ex]
&\text{Kraft } F_z\text{:} \\
Z_{12} &= -\frac{F_z\,b\,(\Phi L^2 + 3ab + b^2)}{D\,L^3}, \\[1ex]
M_{12} &= \frac{F_z\,a\,b\,(\Phi L + 2b)}{2\,D\,L^2}, \\[1ex]
Z_{21} &= -\frac{F_z\,a\,(\Phi L^2 + a^2 + 3ab)}{D\,L^3}, \\[1ex]
M_{21} &= -\frac{F_z\,a\,b\,(\Phi L + 2a)}{2\,D\,L^2}; \\[3ex]
&\text{Moment } M_y\text{:} \\
Z_{12} &= -\frac{6\,a\,b\,M_y}{D\,L^3}, \qquad Z_{21} = \frac{6\,a\,b\,M_y}{D\,L^3}, \\[1ex]
M_{12} &= -\frac{M_y\,b\,(\Phi L - 2a + b)}{D\,L^2}, \\[1ex]
M_{21} &= -\frac{M_y\,a\,(\Phi L + a - 2b)}{D\,L^2}.
\end{aligned}
$$

Das sind die exakten Lösungen für einen beidseitig eingespannten Timoshenko-Stab, ebenso wie die Durchbiegung, die der Solver für jede Last zwischen den Knoten hinzufügt.
::

Bei einem Element mit Gelenk werden die Volleinspannkräfte zu $\mathbf{f}^{*}_\mathrm{fix}$ kondensiert, wie unter [Endgelenke](#end-hinges) beschrieben. Eine Gleichlast auf einem Element mit Gelenk am Endknoten ergibt zum Beispiel $Z_{12} = -5q_zL/8$, $M_{12} = q_zL^2/8$, $Z_{21} = -3q_zL/8$ und $M_{21} = 0$ (für $\Phi = 0$): die Volleinspannkräfte des einseitig eingespannten Trägers.

Nach der Lösung ergeben sich die Schnittgrößen entlang des Elements aus seinen Stabendkräften und der Statik der Last auf dem Element, die Durchbiegung aus den Formfunktionen plus der Durchbiegung des beidseitig eingespannten Elements unter dieser Last: siehe [Ergebnisse entlang der Stäbe](/de/elements/analysis#results-along-the-members).

## Transformationsmatrix {#transformation-matrix}

Ein Element unter dem Winkel $\theta$, gemessen von der globalen x-Achse zur globalen z-Achse (auf dem Bildschirm im Uhrzeigersinn), hat

$$
c = \cos\theta = \frac{x_2 - x_1}{L}, \qquad s = \sin\theta = \frac{z_2 - z_1}{L},
$$

und seine lokalen Endverschiebungen folgen aus den globalen als $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$ mit

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 & 0 & 0 \\
 -s & c & 0 & 0 & 0 & 0 \\
 0 & 0 & 1 & 0 & 0 & 0 \\
 0 & 0 & 0 & c & s & 0 \\
 0 & 0 & 0 & -s & c & 0 \\
 0 & 0 & 0 & 0 & 0 & 1
\end{bmatrix}.
$$

Verdrehungen sind in beiden Systemen gleich. Hat ein Knoten einen **Knoten-LKS-Winkel** $\beta$ (ein [schräges Lager](/de/essentials/nodes-supports#inclined-skewed-supports)), sind seine Unbekannten $\mathbf{d}_n$ in seinen eigenen Achsen ausgedrückt, die um $\beta$ von der globalen x-Achse zur globalen z-Achse gedreht sind. Ihre globalen Komponenten sind

$$
\mathbf{d}_g = \mathbf{T}_n\,\mathbf{d}_n, \qquad
\mathbf{T}_n = \begin{bmatrix} \cos\beta & -\sin\beta & 0 \\ \sin\beta & \cos\beta & 0 \\ 0 & 0 & 1 \end{bmatrix}
$$

für die drei Freiheitsgrade dieses Knotens. Der Solver multipliziert $\mathbf{T}$ von rechts mit der Blockdiagonalmatrix aus den $\mathbf{T}_n$ der beiden Endknoten (der Einheitsmatrix bei einem Knoten ohne eigene Achsen). So wird das Element an jeden Knoten in dessen Achsen angeschlossen.

## Globale Steifigkeitsmatrix {#global-stiffness-matrix}

In globalen Achsen lauten die Steifigkeitsmatrix und die äquivalenten Knotenlasten des Elements

$$
\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T},
\qquad
\mathbf{f}_{\mathrm{eq},g} = \mathbf{T}^\mathsf{T}\,\mathbf{f}_\mathrm{eq},
$$

wobei $\mathbf{K}_l$ und $\mathbf{f}_\mathrm{eq}$ bei einem Element mit Gelenken bereits kondensiert sind. Genau $\mathbf{K}_g$ zeigt das Fenster **Steifigkeitsmatrix** für ein Element (zu öffnen aus der Tabelle *Elemente* oder über das Kontextmenü des Elements), in SI-Einheiten: N/m, N und N·m. Die Seite [Wie EduBeam ein Modell berechnet](/de/elements/analysis) assembliert diese Matrizen und löst ein kleines Beispiel von Hand.
