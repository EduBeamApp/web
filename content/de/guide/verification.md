---
description: "EduBeam im Vergleich mit Lehrbuchformeln: Träger, ein Fachwerk, Temperatur, eine Auflagersenkung und wo der Timoshenko-Balken von Euler-Bernoulli abweicht."
source: site
---

# Ergebnisse von Hand prüfen

Trauen Sie keiner Zahl, die Sie nicht wenigstens überschlägig nachvollziehen können. Diese Seite rechnet die klassischen Lehrbuchfälle von Hand durch und vergleicht sie mit [EduBeam]{.edubeam}; die Ergebnisse stimmen in allen angezeigten Stellen überein. Die Tabellen geben wie der Reiter *Ergebnisse* der App fünf signifikante Stellen an, die Beschriftungen in den Abbildungen sind auf vier Stellen gerundet. Jede Abbildung wird live in Ihrem Browser berechnet. **In EduBeam öffnen** lädt dasselbe Modell in die App, wo Sie die Tabellen lesen, einen Wert ändern und beobachten können, was passiert.

::div{.chips}
- [Einfeldträger](#simply-supported-beam-uniform-load)
- [Kragträger](#cantilever-tip-load)
- [Beidseitig eingespannter Träger](#fixed–fixed-beam-uniform-load)
- [Einseitig eingespannter Träger](#propped-cantilever-uniform-load)
- [Zweistab-Fachwerk](#two-bar-truss)
- [Temperatur](#temperature-gradient-on-a-simply-supported-beam)
- [Auflagersenkung](#prescribed-displacement)
- [Schubverformung](#shear-deformation)
::

Vollständig durchgerechnete Tragwerke finden Sie in den Tutorials [Dreigelenkrahmen](/de/tutorials/three-hinged-frame) und [Ebenes Fachwerk](/de/tutorials/truss). Neue Aufgaben zum Rechnen von Hand, deren Ergebnisse schon bei der Eingabe geprüft werden, bietet die Seite [Übungsaufgaben](/de/practice).

## Der hier verwendete Querschnitt {#the-section-used-here}

Sofern nicht anders angegeben, verwenden alle Fälle den Stahlträger aus den Beispielen der App: $E = 210$ GPa und $I_y = 8356$ cm⁴ (ein IPE 300), also

$$
EI = 210 \times 10^9 \cdot 8{,}356 \times 10^{-5} = 17\,547{,}6\ \text{kNm}^2
$$

Seine Fläche ($A = 1$ m²) und sein Schubkoeffizient ($k = 10^{32}$) sind so groß, dass Längs- und Schubverformung verschwinden. Die Ergebnisse entsprechen daher exakt den Euler-Bernoulli-Formeln Ihres Lehrbuchs.

::callout{type="info" title="Die Balken in EduBeam sind Timoshenko-Balken"}
Mit einem realen Querschnitt, etwa aus der Querschnittsbibliothek, verformen sich die Stäbe auch durch Schub. Die Durchbiegungen fallen dann etwas größer aus als nach den Euler-Bernoulli-Formeln, und in einem statisch unbestimmten Tragwerk verschieben sich auch die Schnittgrößen leicht. Der Abschnitt [Schubverformung](#shear-deformation) am Ende dieser Seite zeigt, wie stark, und wie Sie sie ausschalten.
::

Im Reiter *Ergebnisse* beziehen sich Verschiebungen und Verdrehungen auf die [globalen Achsen](/de/elements/conventions#global-axes): Ein positives D<sub>z</sub> zeigt nach unten, ein positives R<sub>y</sub> dreht gegen den Uhrzeigersinn, und Verschiebungen sind in Metern angegeben, sofern Sie die Einheit in den Einstellungen nicht ändern (siehe [Einheiten & Einstellungen](/de/essentials/units-settings)).

## Einfeldträger unter Gleichlast {#simply-supported-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, Festlager in A, Loslager in B. Am Knoten C in Feldmitte lesen Sie die Durchbiegung ab; das Teilen eines Stabs an einem Knoten ändert kein Ergebnis.

::model-figure{caption="Einfeldträger, 12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Größe | Formel | Wert |
| --- | --- | --- |
| Auflagerreaktionen | $qL/2$ | 36 kN |
| Querkraft an den Lagern | $\pm qL/2$ | +36 kN in A, −36 kN in B |
| Moment in Feldmitte | $qL^2/8$ | 54 kNm |
| Verdrehung in A | $qL^3/(24EI)$ | 0,0061547 rad, im Uhrzeigersinn |
| Durchbiegung in C | $5qL^4/(384EI)$ | 11,540 mm, nach unten |

EduBeam zeigt dieselben Werte. Im Reiter *Ergebnisse* hat Knoten A R<sub>y</sub> = −0,0061547 rad (negativ: im Uhrzeigersinn) und Knoten C D<sub>z</sub> = 0,01154 m (positiv: nach unten).

## Kragträger mit Einzellast am Kragende {#cantilever-tip-load}

$L = 4$ m, eingespannt in A, $F = 18$ kN nach unten am freien Ende B.

::model-figure{caption="Kragträger, 18 kN am Kragende"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Größe | Formel | Wert |
| --- | --- | --- |
| Vertikale Auflagerkraft | $F$ | 18 kN |
| Einspannmoment | $FL$ | 72 kNm, Zug oben: M = −72 kNm |
| Verdrehung am Kragende | $FL^2/(2EI)$ | 0,0082063 rad, im Uhrzeigersinn |
| Durchbiegung am Kragende | $FL^3/(3EI)$ | 21,883 mm, nach unten |

Im Reiter *Ergebnisse* hat Knoten B R<sub>y</sub> = −0,0082063 rad und D<sub>z</sub> = 0,021883 m.

## Beidseitig eingespannter Träger unter Gleichlast {#fixed–fixed-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, beide Enden eingespannt. Dieser Träger ist statisch unbestimmt, die Lösung hängt also von der Steifigkeit ab; die Formeln folgen aus der Verträglichkeitsbedingung, dass beide Endverdrehungen null sind.

::model-figure{caption="Beidseitig eingespannter Träger, 12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Größe | Formel | Wert |
| --- | --- | --- |
| Auflagerreaktionen | $qL/2$ | 36 kN |
| Stützmomente | $qL^2/12$ | 36 kNm, Zug oben: M = −36 kNm |
| Moment in Feldmitte | $qL^2/24$ | 18 kNm, Zug unten |
| Durchbiegung in C | $qL^4/(384EI)$ | 2,3080 mm, nach unten |

Die Einspannung verschiebt den ganzen Momentenverlauf um $qL^2/12$ zur negativen Seite: Der Unterschied zwischen Stütze und Feldmitte beträgt weiterhin $qL^2/8 = 54$ kNm, wie beim Einfeldträger. Um das zu beobachten, beginnen Sie in der App mit dem Einfeldträger und stellen beide Lager auf **Einspannung** um.

## Einseitig eingespannter Träger unter Gleichlast {#propped-cantilever-uniform-load}

$L = 6$ m, $q = 12$ kN/m, eingespannt in A, Loslager in B.

::model-figure{caption="Einseitig eingespannter Träger, 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Größe | Formel | Wert |
| --- | --- | --- |
| Auflagerkraft an der Einspannung | $5qL/8$ | 45 kN |
| Auflagerkraft am Loslager | $3qL/8$ | 27 kN |
| Einspannmoment | $qL^2/8$ | 54 kNm, Zug oben: M = −54 kNm |
| Größtes Feldmoment | $9qL^2/128$ | 30,375 kNm |
| … an der Stelle $V = 0$ | $x = 5L/8$ | 3,75 m von A |
| Verdrehung in B | $qL^3/(48EI)$ | 0,0030773 rad, gegen den Uhrzeigersinn |

EduBeam beschriftet jedes Extremum eines Verlaufs, das größte Feldmoment ist also dort markiert, wo es auftritt. Seine Lage finden Sie am Nulldurchgang der Querkraft: $V(x) = 45 - 12x = 0$ ergibt $x = 3{,}75$ m.

## Zweistab-Fachwerk {#two-bar-truss}

Zwei Stäbe steigen von Festlagern in A $(0, 0)$ und B $(4, 0)$ zur Spitze C $(2, -2)$ an, die 2 m höher liegt. Beide Enden beider Stäbe haben **Endgelenke**, die Stäbe tragen also nur Normalkraft. In C wirkt eine vertikale Last $F = 20$ kN nach unten.

::model-figure{caption="Zweistab-Fachwerk, 20 kN an der Spitze"}
---
nodes: { A: [0, 0], C: [2, -2], B: [4, 0] }
supports: { A: pin, B: pin }
members: [{ nodes: [A, C], hinges: [true, true] }, { nodes: [C, B], hinges: [true, true] }]
loads:
  - { node: C, fz: 20 }
results: [N]
show: [nodeLabels]
---
::

Jeder Stab ist um 45° geneigt. Aus Symmetriegründen tragen beide Stäbe dieselbe Kraft, und das vertikale Gleichgewicht am Knoten C liefert:

$$
\begin{aligned}
2N \sin 45^\circ + F &= 0 \\
N = -\frac{F}{\sqrt{2}} &= -14{,}142\ \text{kN}
\end{aligned}
$$

Beide Stäbe stehen unter **Druck**. Jedes Lager nimmt 10 kN vertikal und 10 kN horizontal auf, nach innen gerichtet: Die Stäbe drücken die Lager auseinander. Die Darstellung **N (x)** und die Auflagerreaktionen zeigen dasselbe.

## Temperaturunterschied am Einfeldträger {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m, $h = 0{,}3$ m, $\alpha = 12 \times 10^{-6}$ 1/K. Die Oberseite erwärmt sich um 5 K, die Unterseite kühlt sich um 5 K ab, also ist $\Delta T_b - \Delta T_t = -10$ K, und die Stabachse behält ihre Temperatur ($\Delta T_c = 0$). Ein Einfeldträger kann sich frei krümmen, es entstehen also **keine Schnittgrößen**, nur eine Krümmung:

$$
\begin{aligned}
\kappa &= \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} \\
&= \frac{12 \times 10^{-6} \cdot (-10)}{0{,}3} = -4 \times 10^{-4}\ \text{m}^{-1}
\end{aligned}
$$

Die Oberseite verlängert sich und die Unterseite verkürzt sich, der Träger wölbt sich also **nach oben**:

::model-figure{caption="Oberseite 10 K wärmer als die Unterseite: Der Träger wölbt sich um 3,2 mm nach oben, ohne Schnittgrößen"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [w]
show: [nodeLabels]
section: { h: 0.3 }
---
::

| Größe | Formel | Wert |
| --- | --- | --- |
| Durchbiegung in C | $\kappa L^2/8$ | 3,2 mm, nach oben: D<sub>z</sub> = −0,0032 m |
| Verdrehung in A | $\kappa L/2$ | 0,0016 rad, gegen den Uhrzeigersinn |
| Biegemoment |  | 0 |

Eine gleichmäßige Temperaturänderung $\Delta T_c$ würde den Träger nur verlängern, was das Loslager zulässt: Auch sie erzeugt keine Kräfte.

Halten Sie nun die Verdrehung an beiden Enden fest (eine **Einspannung** in A und eine **Parallelführung** in B, die dem Träger weiterhin erlaubt, sich zu verlängern). Die Krümmung wird verhindert, und an ihre Stelle tritt über die ganze Spannweite ein konstantes Moment:

$$
\begin{aligned}
M &= -EI\kappa \\
&= -17\,547{,}6 \cdot (-4 \times 10^{-4}) = 7{,}019\ \text{kNm}
\end{aligned}
$$

Das Moment ist positiv (Zug unten): Die festgehaltene Oberseite will sich verlängern und steht deshalb unter Druck.

::model-figure{caption="Derselbe Träger mit an beiden Enden festgehaltener Verdrehung: konstant 7,019 kNm"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: fixed, B: slider }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [M]
show: [nodeLabels]
section: { h: 0.3 }
---
::

Wie Sie Temperaturlasten eingeben, steht unter [Lasten](/de/essentials/loads#temperature-load); die Querschnittshöhe $h$ gehört zum [Querschnitt](/de/essentials/elements#cross-sections).

## Auflagersenkung {#prescribed-displacement}

Nehmen Sie den [einseitig eingespannten Träger](#propped-cantilever-uniform-load) ohne Last und lassen Sie das Loslager in B um $w = 10$ mm absinken. In EduBeam ist das eine **vorgegebene Verschiebung** D<sub>z</sub> = 0,01 m in B. Damit der Träger der Senkung folgt, muss das Loslager das Ende des Kragträgers nach unten ziehen, und das biegt den Träger:

::model-figure{caption="Einseitig eingespannter Träger, B senkt sich um 10 mm: Das Loslager zieht mit 2,437 kN nach unten"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

| Größe | Formel | Wert |
| --- | --- | --- |
| Kraft am Loslager | $R = 3EIw/L^3$ | 2,4372 kN, nach unten ziehend |
| Einspannmoment | $RL$ | 14,623 kNm, Zug oben: M = −14,623 kNm |
| Verdrehung in B | $3w/(2L)$ | 0,0025 rad, im Uhrzeigersinn |

Anders als eine Last erzeugt eine Senkung nur dort Kräfte, wo sich das Tragwerk ihr widersetzt: Hier gilt: Je steifer der Träger, desto größer $R$. Ein Einfeldträger würde derselben Senkung als starrer Körper folgen, ganz ohne Kräfte.

Bringen Sie die Last von 12 kN/m wieder auf, und die Ergebnisse überlagern sich: Die Einspannung nimmt jetzt $45 + 2{,}4372 = 47{,}437$ kN und $54 + 14{,}623 = 68{,}623$ kNm auf, das Loslager $27 - 2{,}4372 = 24{,}563$ kN. Wie Sie eine Auflagersenkung eingeben, steht unter [Lasten](/de/essentials/loads#prescribed-displacements-support-settlements).

## Schubverformung {#shear-deformation}

Die Balkenelemente von EduBeam sind **Timoshenko**-Balken: Zusätzlich zur Biegedurchbiegung verformen sie sich durch Schub, und zwar um einen Betrag, den die Schubsteifigkeit $kGA$ des Querschnitts bestimmt. Was sich dadurch ändert, hängt vom Tragwerk ab:

- **Statisch bestimmt**: Auflagerreaktionen und Schnittgrößen folgen allein aus dem Gleichgewicht und bleiben daher exakt gleich. Nur die Verschiebungen werden größer. Beim Einfeldträger und beim Kragträger bleiben auch die Querschnittsverdrehungen gleich; an anderen Stellen, etwa am Ende eines Kragarms, ändern auch sie sich ein wenig.
- **Statisch unbestimmt**: Die Schnittgrößen hängen von der Steifigkeit ab und verschieben sich daher ebenfalls leicht.

### Ein Einfeldträger {#shear-simply-supported}

Der Träger aus dem [Schnellstart](/de/guide/quick-start#_8-check-by-hand) zeigt, wie viel das ausmacht. Es ist der Einfeldträger von oben mit einem realen Querschnitt, dem **IPE 200 (ca.)** aus der Querschnittsbibliothek: $I_y = 1943$ cm⁴, $A = 28{,}48$ cm² und ein Schubkoeffizient $k = 0{,}3933$ (der Flächenanteil des Stegs), mit $G = 81$ GPa. Damit ist $EI = 4080{,}3$ kNm² und $kGA = 90\,720$ kN.

| Größe | Formel | Wert |
| --- | --- | --- |
| Endverdrehung | $qL^3/(24EI)$ | 0,026469 rad |
| Durchbiegung in Feldmitte, Biegung | $5qL^4/(384EI)$ | 49,629 mm |
| Durchbiegung in Feldmitte, Schub | $qL^2/(8kGA)$ | 0,59524 mm |
| Durchbiegung in Feldmitte, gesamt | Summe | 50,224 mm, wie in EduBeam |

Der Schubanteil beträgt 1,2 % der Gesamtdurchbiegung. Die Endverdrehung ist der Wert nach Euler-Bernoulli, ebenso die Auflagerreaktionen und die Momente.

### Ein Kragträger: kurze Stäbe {#shear-cantilever}

Bei einem Kragträger mit einer Einzellast $F$ am Ende beträgt die Durchbiegung des Kragendes $FL^3/(3EI)$ aus Biegung und $FL/(kGA)$ aus Schub. Das Verhältnis der beiden Anteile ist

$$
\frac{\text{Schub}}{\text{Biegung}} = \frac{3EI}{kGA\,L^2}
$$

Mit demselben IPE 200 sind das 0,84 % bei einem Kragträger von 4 m Länge, aber 13,5 % bei einem von 1 m: Bei kurzen, hohen Stäben ist die Schubverformung nicht mehr vernachlässigbar.

### Ein einseitig eingespannter Träger: Die Kräfte verschieben sich {#shear-propped-cantilever}

Der [einseitig eingespannte Träger](#propped-cantilever-uniform-load) aus dem IPE 200 ist statisch unbestimmt, und das Loslager nimmt jetzt etwas mehr auf. Mit $\beta = 3EI/(kGA\,L^2) = 0{,}0037481$ für $L = 6$ m liefert die Verträglichkeit am Loslager

$$
R_B = \frac{3qL}{8} \cdot \frac{1 + 4\beta/3}{1 + \beta} = 27{,}034\ \text{kN}
$$

statt 27 kN, und das Einspannmoment sinkt von 54 auf $qL^2/2 - R_B L = 53{,}798$ kNm. Hier ist das wenig, aber der Effekt wächst mit $\beta$, also bei kurzen, hohen Stäben.

### Vergleich mit Euler-Bernoulli {#shear-switch-off}

Um mit den Euler-Bernoulli-Formeln zu vergleichen, setzen Sie den **Schubkoeffizienten** des Querschnitts auf einen sehr großen Wert, etwa `1e10`. Der Schubanteil verschwindet dann, und alle Fälle dieser Seite stimmen wieder überein. Die Elementformulierung steht im Theoriehandbuch unter [Balkenelement](/de/elements/beam).

## Tipps für eigene Kontrollen {#tips-for-your-own-checks}

- Behalten Sie den **Einheiten-Chip** unten rechts in der Ansicht im Blick; die meisten Abweichungen sind Einheitenfehler.
- Lesen Sie exakte Zahlen im Reiter **Ergebnisse** und in den Tooltips ab statt an den Beschriftungen der Verläufe. **CSV exportieren** oder **Kopieren** liefert Ihnen auch die Auflagerreaktionen, bereit für eine Tabellenkalkulation. Siehe [Ergebnisse & Diagramme](/de/essentials/results#results-tab).
- Stellen Sie in den Einstellungen das **Zahlenformat** auf *Automatisch*, um `40` statt `4 · 10¹` zu lesen.
- Nutzen Sie das Fenster **Steifigkeitsmatrix**, um ein einzelnes Element mit der Seite [Balkenelement](/de/elements/beam) im Theoriehandbuch zu vergleichen, wenn Sie das Weggrößenverfahren lernen.
- Geben Sie ein geprüftes Modell mit **Modell teilen** an Kolleginnen, Kollegen oder Lehrende weiter.
- Um viele Fälle auf einmal zu prüfen oder Aufgaben mit bekannten Lösungen zu erzeugen, rufen Sie denselben Solver aus Code auf: [@edubeam/fem](/de/solver) ist die Bibliothek hinter jeder Zahl in der App.
