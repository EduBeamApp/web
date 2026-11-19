---
description: "Geneigter Träger (Sparren, Treppenlauf) in EduBeam: Last je Meter Grundriss eingeben, Normal- und Querkraft ablesen, das Loslager drehen. Etwa 15 Minuten."
---

# Tutorial: geneigter Träger

Sie modellieren einen Dachsparren unter Schnee, lesen Normal- und Querkraft entlang der Neigung ab und prüfen sie von Hand.

- **Zeit:** etwa 15 Minuten. Dies ist das erste und kürzeste der vier Tutorials.
- **Sie brauchen:** EduBeam in einem zweiten Tab, an einem Computer mit Maus und Tastatur. Wenn Sie EduBeam noch nicht kennen, gehen Sie zuerst den [Schnellstart](/de/guide/quick-start) durch: Er zeigt die Reiter und Dialoge, die dieses Tutorial verwendet.
- **Vorkenntnisse:** Gleichgewicht am Einfeldträger und die Zerlegung einer Kraft in zwei Komponenten.
- **Einheiten:** SI. Der Einheiten-Chip unten rechts in der Ansicht sollte `m m² kN kNm MPa` zeigen. Zeigt er Fuß und Kips, klicken Sie darauf und stellen Sie **Einheitensystem** auf **SI (metrisch)**.

**In diesem Tutorial lernen Sie,**

- eine Last je Meter Grundriss in die Last entlang des Stabes umzurechnen, die EduBeam erwartet,
- eine Streckenlast mit dem Kästchen **LCS** vertikal oder senkrecht zum Stab wirken zu lassen,
- ein Loslager zu drehen und zu sehen, dass sich dadurch die Normalkraft ändert, das Biegemoment aber nicht.

::div{.actions}
[EduBeam öffnen ↗](https://run.edubeam.app/?lang=de){target="_blank"} [Zur Handrechnung](#check-by-hand)
::

::model-figure{caption="Der fertige Sparren: 3 kN/m Schnee je Meter Grundriss, eingegeben als 2,4 kN/m entlang des Stabes, mit einem Festlager an der Traufe (Knoten 1) und einem Loslager am First (Knoten 2)"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## Die Aufgabe {#the-problem}

- Ein gerader Sparren von Knoten 1 bei (0, 0) hinauf zu Knoten 2 bei (4, −3): 4 m im Grundriss und 3 m hoch, also $L = 5$ m lang, mit $\cos\alpha = 4/5$ und $\sin\alpha = 3/5$.
- Ein Festlager in Knoten 1, an der Traufe. In Knoten 2, am First, ein Loslager, das horizontal rollt; seine Auflagerreaktion ist also vertikal.
- Schnee $s = 3$ kN/m, so wie ihn die Normen angeben: **je Meter Grundriss** (bezogen auf die horizontale Projektion).
- Stahl, $E = 210$ GPa, und $I_y = 8{,}356 \times 10^{-5}$ m⁴, das Flächenträgheitsmoment eines IPE 300.

**Ist es statisch bestimmt?** Drei Auflagerreaktionen und drei Gleichgewichtsbedingungen: ja. Die Kräfte folgen allein aus dem Gleichgewicht; $E$ und $I_y$ spielen nur für die Durchbiegung eine Rolle.

## Das Modell aufbauen {#model-it}

::div{.steps}

### Material und Querschnitt {#material-and-section}

1. Klicken Sie in der oberen Leiste auf **Modell löschen**, haken Sie **Materialien löschen** und **Querschnitte löschen** an und klicken Sie auf **Bestätigen**. Knoten und Elemente werden dann wieder ab 1 nummeriert.
2. Reiter **Materialien** → **Materialbibliothek** → **+** in der Zeile **Stahl (S235)**; schließen Sie die Bibliothek dann mit **Abbrechen**.
3. Reiter **Querschnitte** → **Querschnitt hinzufügen**. Geben Sie in **Iy** `8,356e-5` ein, lassen Sie **Fläche**, **Höhe** und **Schubkoeffizient** auf `1` und klicken Sie auf **Querschnitt hinzufügen**.

Mit einer Fläche von 1 m² verkürzt sich der Stab praktisch nicht und verformt sich kaum durch Schub, so wie es die Handrechnung voraussetzt.

### Den Stab zeichnen {#draw-the-member}

1. Reiter **Elemente** → die zweite Schaltfläche **Element hinzufügen**, die mit dem Mauszeiger-Symbol.
2. Klicken Sie auf (0, 0) und dann auf (4, −3). Lineale und Fadenkreuz zeigen, wo Sie sind, und die Klicks rasten am Raster ein.
3. Drücken Sie <kbd>Esc</kbd>, um das Zeichnen zu beenden, und dann <kbd>F</kbd>, um die Ansicht anzupassen.

Die z-Achse zeigt nach unten, deshalb liegt Knoten 2, der 3 m **über** Knoten 1 liegt, bei $z = -3$. Prüfen Sie beide Knoten in der Tabelle **Knoten** und überschreiben Sie jede Koordinate, die danebenliegt.

### Lager {#supports}

Klicken Sie auf Knoten 1 → **Knotenlagerung** → das Symbol **Festlager**. Geben Sie Knoten 2 auf dieselbe Weise das **Loslager**.

### Last {#load}

Auf dem Sparren liegen insgesamt $3 \cdot 4 = 12$ kN Schnee. EduBeam verteilt eine Gleichlast über die **Länge** des Stabes; dieselben 12 kN auf 5 m ergeben also

$$
f_z = s \cdot \frac{4}{5} = s\cos\alpha = 3 \cdot 0{,}8 = 2{,}4\ \text{kN/m}
$$

1. Reiter **Lasten** → **Elementlast hinzufügen**.
2. **Lasttyp** *Gleichmäßig verteilte Last*, **Element** `1`, `fz = 2,4`.
3. **Entfernen Sie den Haken bei LCS**, damit `fz` vertikal wirkt, und klicken Sie auf **Elementlast hinzufügen**.

::callout{type="warning" title="LCS ist standardmäßig angehakt"}
**LCS** steht für das lokale Koordinatensystem (LKS) des Elements. Ist es angehakt, wirkt `fz` entlang der lokalen z-Achse des Elements, also senkrecht zur Neigung: wie Wind auf einem Dach, nicht wie Schnee. Bei einem horizontalen Träger ist beides dasselbe, deshalb bleibt der Unterschied leicht unbemerkt. Die Lastpfeile zeigen, in welche Richtung die Last wirkt; Einzelheiten finden Sie unter [Lasten](/de/essentials/loads#uniformly-distributed-load).
::

::

## Ergebnisse {#results}

Der Träger wird berechnet, sobald die Last eingegeben ist. In den Anzeigeoptionen oben rechts in der Ansicht (das Zahnrad blendet sie ein und aus) sind **Verformte Form**, **M<sub>y</sub> (x)** und **Auflagerreaktionen** von Anfang an eingeschaltet; haken Sie zusätzlich **N (x)** und **V<sub>z</sub> (x)** an. Der Umschalter unter dem Bild oben zeigt dieselben Verläufe.

EduBeam beschriftet Verläufe und Auflagerreaktionen in kN und kNm mit zwei Nachkommastellen. Sie sollten also Folgendes sehen:

- `6,00` an jedem Lager, nach oben. Horizontal steht am Festlager höchstens `0,00`: Es nimmt keine Horizontalkraft auf.
- `6,00` kNm, den Größtwert des Biegemoments, in Feldmitte.
- `4,80` kN Querkraft in Knoten 1 und `-4,80` in Knoten 2.
- `-3,60` kN Normalkraft in Knoten 1 (Druck) und `3,60` in Knoten 2 (Zug), mit dem Nulldurchgang in Feldmitte.

## Von Hand prüfen {#check-by-hand}

**Auflagerreaktionen.** Die Resultierende von 12 kN greift im Grundriss 2 m von Knoten 1 entfernt an, das Momentengleichgewicht um eines der beiden Enden ergibt also $V_1 = V_2 = 6$ kN. Es wirkt keine Horizontalkraft, also ist $H_1 = 0$.

**Biegemoment.** Für vertikale Kräfte zählen nur die horizontalen Hebelarme. Im Grundrissabstand $x$ von Knoten 1 gilt

$$
M(x) = V_1\,x - \frac{s\,x^2}{2}, \qquad M_{\max} = \frac{s\,a^2}{8} = \frac{3 \cdot 4^2}{8} = 6\ \text{kNm}
$$

genau wie bei einem horizontalen Träger mit der Spannweite $a = 4$ m unter derselben Last je Meter Grundriss.

**Querkraft und Normalkraft.** Die Kräfte links eines Schnitts bei $x$ ergeben zusammen eine Vertikalkraft $T(x) = V_1 - s\,x$. Zerlegen Sie sie in ihre Anteile senkrecht zum Stab und entlang des Stabes:

$$
V = T\cos\alpha, \qquad N = -T\sin\alpha
$$

| | Knoten 1, $T = +6$ kN | Feldmitte, $T = 0$ | Knoten 2, $T = -6$ kN |
| --- | --- | --- | --- |
| $V$ | $6 \cdot 0{,}8 = 4{,}8$ kN | 0 | −4,8 kN |
| $N$ | $-6 \cdot 0{,}6 = -3{,}6$ kN | 0 | +3,6 kN |
| $M$ | 0 | 6 kNm | 0 |

Alles wie in EduBeam. Die nach oben gerichtete Auflagerreaktion in Knoten 1 schiebt das untere Ende die Neigung hinauf, in den Stab hinein: Druck. Die nach oben gerichtete Auflagerreaktion in Knoten 2 zieht das obere Ende weiter die Neigung hinauf, vom Stab weg: Zug. Die Vorzeichen folgen der Richtung des Elements, von Knoten 1 nach Knoten 2, wie die [Vorzeichenkonventionen](/de/elements/conventions#internal-forces) erklären.

## Experimentieren {#experiment}

Ändern Sie jeweils nur eine Sache, sagen Sie das Ergebnis voraus und schauen Sie erst dann nach. <kbd>Strg</kbd>+<kbd>Z</kbd> nimmt jede Änderung zurück.

**Den Kosinus vergessen.** Geben Sie `fz = 3` statt 2,4 ein. Das sind 3 kN je Meter Schräglänge, insgesamt 15 kN, und jedes Ergebnis fällt um 25 % zu groß aus: Auflagerreaktionen von 7,5 kN und ein Moment von 7,5 kNm. Bei einem Dach mit 30° Neigung betrüge der Fehler 15 %, bei 45° 41 %.

**LCS angehakt lassen.** Haken Sie bei der Last von 2,4 kN/m **LCS** an. Sie drückt jetzt senkrecht zur Neigung, wie Wind, mit einem horizontalen Anteil von 7,2 kN, den nur das Festlager aufnehmen kann. Das Moment steigt auf $2{,}4 \cdot 5^2/8 = 7{,}5$ kNm, und die Normalkraft wird zu einem konstanten Zug von 4,5 kN.

::model-figure{caption="Dieselben 2,4 kN/m mit angehaktem LCS: senkrecht zur Neigung, das Festlager nimmt also 7,2 kN seitlich auf"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4, local: true }
results: [M, N]
show: [nodeLabels]
---
::

**Das Loslager drehen.** Entfernen Sie den Haken bei **LCS** wieder und ändern Sie nur die Richtung, in die das Loslager in Knoten 2 rollt. Klicken Sie auf Knoten 2 → **Knotenlagerung**, geben Sie in **Knoten-LKS-Winkel** `-36,87` ein und drücken Sie <kbd>Enter</kbd> (oder tragen Sie den Wert im Feld **α** seiner Zeile in der Tabelle **Knoten** ein).

![Das Menü Knotenlagerung von Knoten 2: die Lagersymbole, die gehaltenen Richtungen und der Knoten-LKS-Winkel](/screenshots/de/p2t-node-supports-angle.webp){.shot-md}

Der Winkel dreht die eigenen Achsen des Knotens. In den Standardachsen, x nach rechts und z nach unten, dreht ein negativer Winkel sie auf dem Bildschirm gegen den Uhrzeigersinn. Mehr dazu unter [Gedrehte (schräge) Lager](/de/essentials/nodes-supports#inclined-skewed-supports).

Das Loslager rollt jetzt entlang der Neigung, seine Auflagerreaktion steht also senkrecht auf dem Stab: $12 \cdot 2 / 5 = 4{,}8$ kN, aus dem Momentengleichgewicht um Knoten 1. Den Rest nimmt das Festlager auf und mit ihm die ganze Normalkraft: −7,2 kN in Knoten 1, null in Knoten 2.

::model-figure{caption="Das Loslager in Knoten 2 um −36,87° gedreht, sodass es entlang der Neigung rollt: Die Normalkraft verläuft von −7,2 kN bis null"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
angles: { 2: -36.87 }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

**Ein vertikales Loslager wählen.** Setzen Sie den Winkel auf 0 zurück und wählen Sie für Knoten 2 das **Vertikale Loslager**. Es rollt vertikal und kann deshalb nur seitlich drücken: Das Momentengleichgewicht um Knoten 1, $H_2 \cdot 3 = 12 \cdot 2$, ergibt 8 kN, und das Festlager hält den Sparren gegen diesen Horizontalschub. Der ganze Stab steht unter Druck.

::model-figure{caption="Ein vertikales Loslager in Knoten 2: ein Horizontalschub von 8 kN, und der ganze Sparren steht unter Druck"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: verticalRoller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

Die drei Loslager im Vergleich:

| Loslager in Knoten 2 | Auflagerreaktion in Knoten 2 | Auflagerreaktion in Knoten 1 | $N$ von Knoten 1 bis 2 |
| --- | --- | --- | --- |
| Horizontal | 6 kN ↑ | 6 kN ↑ | −3,6 bis +3,6 kN |
| Entlang der Neigung | 4,8 kN ⊥ Stab | 2,88 kN →, 8,16 kN ↑ | −7,2 bis 0 kN |
| Vertikal | 8 kN ← | 8 kN →, 12 kN ↑ | −13,6 bis −6,4 kN |

**Das Biegemoment ändert sich nie**, und die Querkraft ebenso wenig: 6 kNm und ±4,8 kN in allen drei Fällen. Knoten 1, Knoten 2 und jeder Schnitt liegen auf einer Geraden, der Stabachse. Der Anteil der Auflagerreaktion in Knoten 2, der entlang dieser Geraden wirkt, hat um keinen dieser Punkte ein Moment und erzeugt deshalb nur Normalkraft. Der Anteil senkrecht zum Stab ist durch das Momentengleichgewicht um Knoten 1 auf 4,8 kN festgelegt, egal in welche Richtung das Loslager zeigt. Die Richtung des Loslagers entscheidet nur darüber, wohin der Horizontalschub geht – und das ist wichtig für die Wand oder das Treppenpodest, das ihn aufnehmen muss.

## Nächste Schritte {#next-steps}

::card-grid{cols="2"}
:::card{title="Üben: Einfeldträger mit Kragarm" icon="lucide:dices" to="/de/practice?p=O2048"}
Auflagerreaktionen und das größte Moment eines Trägers unter einer Streckenlast; Ihre Antworten werden sofort geprüft. Beginnen Sie mit O2048; für weitere Aufgaben lassen Sie nur **Einfeldträger mit Kragarm** ausgewählt und klicken auf **Neue Aufgabe**.
:::
:::card{title="Weiter: Dreigelenkrahmen" icon="lucide:triangle" to="/de/tutorials/three-hinged-frame"}
Vier Stäbe, ein Zwischengelenk und ein Horizontalschub: ein Rahmen, den Sie noch allein mit den Gleichgewichtsbedingungen lösen können.
:::
::
