---
description: "Das Weggrößenverfahren in EduBeam, von Hand am einseitig eingespannten Träger: Nummerierung, Assemblierung, Lager, Auflagerreaktionen und Stabergebnisse."
source: site
---

# Wie EduBeam ein Modell berechnet

Bei jeder Änderung am Modell berechnet EduBeam es neu, mit dem **Weggrößenverfahren** in Matrizenform (der direkten Steifigkeitsmethode), in Ihrem Browser und in wenigen Millisekunden. Diese Seite verfolgt den Solver [@edubeam/fem](/de/solver) Schritt für Schritt an einem kleinen Beispiel. So können Sie jede Zahl von Hand nachrechnen und sehen, warum Sie den Ergebnissen vertrauen können.

Das Beispiel ist ein einseitig eingespannter Träger: ein IPE 300 aus Stahl, 4 m lang, bei A eingespannt, bei B auf einem Loslager, unter 10 kN/m. Seine Biegesteifigkeit ist $EI = 210 \text{ GPa} \times 8356 \text{ cm}^4 = 17\,548$ kNm², und ohne Schubverformung lauten die Lehrbuchergebnisse $M_A = -qL^2/8 = -20$ kNm, $R_B = 3qL/8 = 15$ kN und $\varphi_B = qL^3/(48EI)$.

::model-figure{caption="Einseitig eingespannter Träger, IPE 300, 10 kN/m: M = −20 kNm bei A und +11,25 kNm bei 2,5 m, Auflagerreaktionen 25 kN und 15 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
section: { a: 53.8e-4, iy: 8.356e-5, h: 0.3 }
results: [M, V, w]
show: [nodeLabels]
---
::

## Vom Modell zu den Verschiebungen {#from-model-to-displacements}

::div{.steps}
### Freiheitsgrade nummerieren {#number-the-degrees-of-freedom}

Jeder Knoten erhält die Freiheitsgrade, die seine Elemente brauchen. Alle Elemente sind [Balkenelemente](/de/elements/beam), also hat jeder Knoten `Dx`, `Dz` und `Ry`. Der Solver nummeriert Knoten für Knoten zuerst die **freien** Freiheitsgrade und danach die **gelagerten**. Hier ist A eingespannt und B nur vertikal gehalten, frei sind also zwei:

$$
\begin{gathered}
\mathbf{r} = \begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix},
\qquad
\mathbf{r}_u = \begin{bmatrix} u_B \\ \varphi_B \end{bmatrix}, \\[1ex]
\mathbf{r}_p = \begin{bmatrix} u_A & w_A & \varphi_A & w_B \end{bmatrix}^\mathsf{T}.
\end{gathered}
$$

$u$, $w$ und $\varphi$ sind die Verschiebungen in x- und z-Richtung und die Verdrehung, wie in der [Tabelle der Freiheitsgrade](/de/elements/conventions#degrees-of-freedom). Jedes Element hat einen **Zuordnungsvektor**: die Positionen seiner sechs Freiheitsgrade in $\mathbf{r}$. Von 1 an gezählt stehen die Freiheitsgrade des Trägers $(u_A, w_A, \varphi_A, u_B, w_B, \varphi_B)$ an den Positionen $(3, 4, 5, 1, 6, 2)$.

### Elementmatrizen berechnen {#compute-the-element-matrices}

Für jedes Element stellt der Solver die [lokale Steifigkeitsmatrix](/de/elements/beam#local-stiffness-matrix) auf, kondensiert etwaige [Endgelenke](/de/elements/beam#end-hinges) heraus und transformiert sie in globale Achsen, $\mathbf{K}_g = \mathbf{T}^\mathsf{T}\mathbf{K}_l\,\mathbf{T}$. Jede Elementlast wird zu [äquivalenten Knotenlasten](/de/elements/beam#element-loads), $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. Unser Träger liegt horizontal, $\mathbf{T}$ ist also die Einheitsmatrix, und die Gleichlast ergibt in kN und kNm

$$
\mathbf{f}_\mathrm{eq} = \begin{bmatrix} 0 \\[0.5ex] qL/2 \\[0.5ex] -qL^2/12 \\[0.5ex] 0 \\[0.5ex] qL/2 \\[0.5ex] qL^2/12 \end{bmatrix}
= \begin{bmatrix} 0 \\[0.5ex] 20 \\[0.5ex] -13{,}33 \\[0.5ex] 0 \\[0.5ex] 20 \\[0.5ex] 13{,}33 \end{bmatrix}.
$$

### Assemblieren {#assemble}

Die globale Steifigkeitsmatrix $\mathbf{K}$ ist zu Beginn mit Nullen gefüllt. Jedes Element addiert seinen Eintrag $(i, j)$ in die Zeile und Spalte, die sein Zuordnungsvektor für $i$ und $j$ angibt. Wo mehrere Elemente an einem Knoten zusammentreffen, addieren sich so ihre Steifigkeiten für die Freiheitsgrade dieses Knotens. Der Lastvektor $\mathbf{F}$ sammelt die Knotenlasten und die äquivalenten Knotenlasten auf dieselbe Weise. Vorgegebene Verschiebungen (Auflagersenkungen) kommen in $\mathbf{r}_p$. In der Reihenfolge „erst frei, dann gelagert“ zerfällt das Gleichungssystem in Blöcke:

$$
\begin{bmatrix} \mathbf{K}_{uu} & \mathbf{K}_{up} \\ \mathbf{K}_{pu} & \mathbf{K}_{pp} \end{bmatrix}
\begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix}
=
\begin{bmatrix} \mathbf{F}_u \\ \mathbf{F}_p + \mathbf{R} \end{bmatrix},
$$

wobei $\mathbf{R}$ die unbekannten Auflagerreaktionen sind. Im Beispiel fallen nur die Zeilen und Spalten des Trägerendes B in $\mathbf{K}_{uu}$:

$$
\begin{aligned}
\mathbf{K}_{uu} &= \begin{bmatrix} EA/L & 0 \\ 0 & 4EI/L \end{bmatrix} \\[1ex]
&= \begin{bmatrix} 282\,450 \text{ kN/m} & 0 \\ 0 & 17\,548 \text{ kNm} \end{bmatrix}, \\[1ex]
\mathbf{F}_u &= \begin{bmatrix} 0 \\ 13{,}33 \text{ kNm} \end{bmatrix}.
\end{aligned}
$$

### Lager einführen und lösen {#apply-the-supports-and-solve}

Lager sind keine Federn und keine großen Zahlen auf der Diagonale: Die gelagerten Freiheitsgrade werden einfach abgetrennt. Die freien Verschiebungen folgen aus

$$
\mathbf{K}_{uu}\,\mathbf{r}_u = \mathbf{F}_u - \mathbf{K}_{up}\,\mathbf{r}_p,
$$

gelöst durch LU-Zerlegung. Ohne Auflagersenkungen ist $\mathbf{r}_p = \mathbf{0}$, und hier ergibt sich

$$
\varphi_B = \frac{13{,}33}{17\,548} = 7{,}598 \times 10^{-4} \text{ rad},
$$

also das Lehrbuchergebnis $qL^3/(48EI)$, und $u_B = 0$.

### Auflagerreaktionen berechnen {#compute-the-reactions}

Sind alle Verschiebungen bekannt, liefern die gelagerten Zeilen die Auflagerreaktionen, also die Kräfte, die die Lager auf das Tragwerk ausüben:

$$
\mathbf{R} = \mathbf{K}_{pu}\,\mathbf{r}_u + \mathbf{K}_{pp}\,\mathbf{r}_p - \mathbf{F}_p.
$$

Für $w_A$ steht in der Zeile von $\mathbf{K}_{pu}$ unter $\varphi_B$ der Wert $-6EI/L^2$, und $\mathbf{F}_p$ enthält $qL/2$:

$$
\begin{aligned}
R_{wA} &= -\frac{6EI}{L^2}\,\varphi_B - \frac{qL}{2} \\
&= -5 - 20 = -25 \text{ kN},
\end{aligned}
$$

also 25 kN nach oben (z zeigt nach unten). Ebenso ergeben sich $R_{\varphi A} = +20$ kNm und $R_{wB} = -15$ kN: die Lehrbuchwerte $qL^2/8$ und $3qL/8$.
::

## Ergebnisse entlang der Stäbe {#results-along-the-members}

Für jedes Element entnimmt der Solver seine Endverschiebungen aus $\mathbf{r}$, transformiert sie in lokale Achsen, $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, und berechnet die [Stabendkräfte](/de/elements/conventions#end-forces-element-results-table)

$$
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix}.
$$

Im Beispiel ergibt $\mathbf{d}_l = [0,\ 0,\ 0,\ 0,\ 0,\ \varphi_B]^\mathsf{T}$ die Werte $Z_{12} = -25$ kN, $M_{12} = 20$ kNm, $Z_{21} = -15$ kN und $M_{21} = 0$.

Die Schnittgrößen an einer beliebigen Stelle $x$ folgen dann aus dem Gleichgewicht des Elementstücks zwischen seinem Anfang und $x$: aus den Kräften an seinem Anfang und der Last auf diesem Stück.

$$
\begin{aligned}
N(x) &= -X_{12} + N_q(x), \\
V(x) &= -Z_{12} + V_q(x), \\
M(x) &= -M_{12} - Z_{12}\,x + M_q(x),
\end{aligned}
$$

wobei $N_q$, $V_q$ und $M_q$ von den Lasten auf diesem Stück herrühren. Für eine Gleichlast $q_z$, eine Trapezlast von $q_1$ bis $q_2$ (mit $\Delta q = q_2 - q_1$) sowie eine Kraft $F_z$ oder ein Moment $M_y$ im Abstand $a$, die nur für $x \ge a$ wirken, gilt:

$$
\begin{array}{l|cc}
\text{Last} & V_q(x) & M_q(x) \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -q_z\,x & -\dfrac{q_z\,x^2}{2} \\[3ex]
q_1 \to q_2 & -q_1 x - \dfrac{\Delta q\,x^2}{2L} & -\dfrac{q_1 x^2}{2} - \dfrac{\Delta q\,x^3}{6L} \\[3ex]
F_z,\ M_y & -F_z & -F_z\,(x-a) - M_y
\end{array}
$$

$N_q$ ergibt sich wie $V_q$, nur mit den Längskomponenten $q_x$ und $F_x$ anstelle von $q_z$ und $F_z$.

Im Beispiel ist $M(x) = -20 + 25\,x - 5\,x^2$ kNm, am größten bei $x = 2{,}5$ m mit $11{,}25$ kNm $= 9qL^2/128$. Eine Temperaturlast hat keinen eigenen Term: Sie wirkt nur über die Stabendkräfte.

Die Durchbiegung ergibt sich aus den [Formfunktionen](/de/elements/beam#local-stiffness-matrix) mal den Endverschiebungen, plus der Durchbiegung des beidseitig eingespannten Elements unter seiner Last. Ein gelenkiges Ende erhält zuvor seine eigene Verdrehung aus der [Kondensation](/de/elements/beam#end-hinges) zurück. Die Schnittgrößenverläufe und die Verformungsfigur sind genau diese Funktionen, ausgewertet entlang jedes Stabs.

## Warum die Ergebnisse exakt sind {#exact}

Jeder der Schritte oben ist für das berechnete Modell exakt:

- Die Elementsteifigkeit stammt aus der **exakten Lösung** für einen prismatischen Timoshenko-Stab, nicht aus angenommenen Polynomansätzen. Sie ist also die tatsächliche Steifigkeit des Stabs.
- Die Volleinspannkräfte sind für jeden Lasttyp die exakten Lösungen bei beidseitiger Einspannung, die äquivalenten Knotenlasten verlieren also nichts.
- Die Knotenverschiebungen sind deshalb exakt, und die Schnittgrößen zwischen den Knoten folgen aus dem Gleichgewicht mit der tatsächlichen Last, sind also ebenfalls exakt.

Deshalb verlangt EduBeam nie, dass Sie ein Netz verfeinern: Ein Element je Stab liefert dasselbe Ergebnis wie hundert. Knoten brauchen Sie nur dort, wo sich der Stab selbst ändert: an einem Lager, einem Gelenk, einer Ecke oder einem Querschnittswechsel. Eine Einzellast dazwischen kann eine Elementlast bleiben. Übrig bleiben nur Rundungsfehler der Gleitkommaarithmetik; die Ergebnistabellen zeigen Werte unter dem $10^{-12}$-Fachen des größten Werts derselben Art als 0 an.

„Exakt“ bezieht sich auf das Modell, und das hat seine Grenzen:

::div{.limits}
- **Linear-elastisches Material** und **kleine Verschiebungen**: Das Gleichgewicht wird am unverformten System aufgestellt, es gibt also keine Effekte nach Theorie II. Ordnung (P-Δ) und kein Knicken.
- **Gerade, prismatische Stäbe**: ein Querschnitt je Element. Ein gevouteter Stab muss durch mehrere Elemente angenähert werden.
- **Biegung nur in der x–z-Ebene**: keine Torsion und kein Tragverhalten aus der Ebene heraus.
::

## Wenn das Tragwerk nicht stehen kann {#mechanisms}

Ein Tragwerk, das sich bewegen kann, ohne sich zu verformen, hat eine singuläre Steifigkeitsmatrix und keine eindeutige Lösung. EduBeam prüft das schon vor der Berechnung und kontrolliert danach das Ergebnis:

1. **Vor der Berechnung** wird jeder zusammenhängende Teil des Tragwerks allein anhand seiner Geometrie geprüft. Seine Lager müssen die drei Starrkörperbewegungen einer ebenen Scheibe verhindern: Weniger als drei Lagerbindungen bedeuten, dass das Modell einfach noch nicht fertig ist (*Die Struktur braucht Lager, bevor sie berechnet werden kann.*), während drei oder mehr, die ihn trotzdem verschieben oder verdrehen lassen, etwa parallele Loslager, ein Fehler sind. Danach werden die Gelenke geprüft: Können sich die Stäbe um sie drehen, während jeder Stab seine Länge behält, ist das Tragwerk ein Mechanismus, und EduBeam kreist die Gelenke ein und zeigt die Bewegung.
2. **Während der Berechnung** bricht eine exakt singuläre Matrix die LU-Zerlegung ab: *Die Struktur ist kinematisch: Die Steifigkeitsmatrix ist singulär.*
3. **Nach der Berechnung** bedeutet eine Verschiebung oder Verdrehung größer als $10^6$ m bzw. rad, dass die Matrix bis auf Rundungsfehler singulär war. EduBeam nennt die Knoten und Richtungen, die sich bewegen: *Die Struktur ist instabil. Praktisch ohne Widerstand beweglich: …* Hier landen Sie auch, wenn ein Material oder Querschnitt mit null oder in der falschen Einheit eingegeben ist.

Sind an einem Knoten alle Stäbe gelenkig angeschlossen, ist mit seiner Verdrehung nichts verbunden. Das ist kein Mechanismus: Der Solver setzt diese Verdrehung zu null. Die Seite [Fehlerbehebung](/de/reference/troubleshooting#no-results-are-drawn) erklärt jede Meldung und wie Sie die Ursache beheben.

## Den Solver selbst ausführen {#library}

Der Solver ist Open Source: die Solver-Bibliothek [@edubeam/fem](/de/solver), in TypeScript geschrieben, für den Browser und Node. Derselbe einseitig eingespannte Träger:

```ts
import { DofID, LinearStaticSolver, type Beam2D } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]

// SI-Einheiten: m, N, Pa. Stahl, IPE 300; k = 1e32 macht den Querschnitt schubstarr.
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // Einspannung
domain.createNode('B', [4, 0, 0], [DofID.Dz]) // Loslager
domain.createBeam2D('1', ['A', 'B'], 1, 1)
lc.createBeamElementUniformEdgeLoad('1', [0, 10_000], true) // 10 kN/m, nach unten

solver.solve()

solver.neq // 2: Dx und Ry von B sind frei
lc.r.toArray() // [0, 0.0007598, 0, 0, 0, 0]: erst freie, dann gelagerte Freiheitsgrade
lc.R.toArray() // [0, -25000, 20000, -15000]: A (Dx, Dz, Ry), dann B (Dz)

const beam = domain.getElement('1') as Beam2D
beam.computeEndForces(lc).toArray() // [0, -25000, 20000, 0, -15000, 0]
beam.computeBendingMomentAt(lc, 0) // -20000: N·m, negatives Moment an der Einspannung
beam.computeBendingMomentAt(lc, 2.5) // 11250: das größte positive Moment
```

Nach `solve()` enthält `solver.k` die assemblierte Matrix $\mathbf{K}$ und `solver.f` den Lastvektor $\mathbf{F}$, zum Vergleich mit Ihrer eigenen Assemblierung. Die Schritte dieser Seite stecken in `Solver.ts` (Nummerierung), `LinearStaticSolver.ts` (Assemblierung, Lösung, Auflagerreaktionen) und `Beam2D.ts` (Elementmatrizen und Ergebnisse).

::div{.actions}
[Erste Schritte mit @edubeam/fem](/de/solver/getting-started) [Was die Bibliothek enthält](/de/solver/reference) [Quellcode auf GitHub ↗](https://github.com/EduBeamApp/fem){target="_blank"}
::
