---
description: "Dreigelenkrahmen unter Gleichlast in EduBeam: Auflagerkräfte, Horizontalschub und Schnittgrößen ablesen und bis zur Durchbiegung des Gelenks von Hand prüfen."
---

# Tutorial: Dreigelenkrahmen

Sie modellieren einen Portalrahmen mit einem Gelenk in Feldmitte, lesen seine Auflagerreaktionen und Schnittgrößenverläufe ab und prüfen jede Zahl von Hand, bis hin zur Durchbiegung des Gelenks.

- **Zeit:** etwa 15 Minuten.
- **Sie brauchen:** EduBeam in einem zweiten Tab, an einem Computer mit Maus und Tastatur. Wenn Sie EduBeam noch nicht kennen, zuerst den [Schnellstart](/de/guide/quick-start) oder das Tutorial [geneigter Träger](/de/tutorials/inclined-beam).
- **Vorkenntnisse:** Gleichgewicht am Rahmen und Freikörperbilder. Die optionale Prüfung der Durchbiegung verwendet den Arbeitssatz mit einer virtuellen Einslast (Prinzip der virtuellen Kräfte).
- **Einheiten:** SI. Der Einheiten-Chip unten rechts in der Ansicht sollte `m m² kN kNm MPa` zeigen. Zeigt er Fuß und Kips, klicken Sie darauf und stellen Sie **Einheitensystem** auf **SI (metrisch)**.

**In diesem Tutorial lernen Sie,**

- einen Rahmen mit der Maus als einen einzigen Polygonzug zu zeichnen,
- mit den Kästchen **Endgelenke** ein Gelenk in einen Stab zu setzen,
- den Horizontalschub aus der Bedingung $M = 0$ im Gelenk zu bestimmen und das Vorzeichen von $V$ in Stäben abzulesen, die in verschiedene Richtungen gezeichnet sind.

::div{.actions}
[EduBeam öffnen ↗](https://run.edubeam.app/?lang=de){target="_blank"} [Zur Handrechnung](#_6-check-by-hand)
::

::model-figure{caption="Der fertige Rahmen: 10 kN/m auf dem Riegel, Festlager in den Knoten 1 und 5, ein Gelenk in Knoten 3"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], { nodes: [2, 3], hinges: [false, true] }, [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## Die Aufgabe {#the-problem}

- Zwei 4 m hohe Stützen, an ihren Fußpunkten (Knoten 1 und 5) gelenkig gelagert, im Abstand von 8 m.
- Obenauf ein horizontaler Riegel von Knoten 2 bis Knoten 4 mit einem Gelenk in Feldmitte, Knoten 3.
- Eine Gleichlast $q = 10$ kN/m auf dem ganzen Riegel.
- Stahl, $E = 210$ GPa, und $I_y = 8{,}356 \times 10^{-5}$ m⁴ (ein IPE 300) für alle Stäbe.

| Knoten | x (m) | z (m) | |
| --- | --- | --- | --- |
| 1 | 0 | 0 | Festlager |
| 2 | 0 | −4 | Rahmenecke |
| 3 | 4 | −4 | Gelenk im Riegel |
| 4 | 8 | −4 | Rahmenecke |
| 5 | 8 | 0 | Festlager |

Die z-Achse zeigt **nach unten**, die Stützenköpfe liegen also bei $z = -4$.

**Ist es statisch bestimmt?** Zwei Festlager liefern vier Auflagerreaktionen. Drei Gleichgewichtsbedingungen und $M_3 = 0$ im Gelenk ergeben vier Gleichungen: ja.

## Das Modell aufbauen {#model-it}

::div{.steps}

### Material und Querschnitt {#_1-material-and-section}

1. Klicken Sie in der oberen Leiste auf **Modell löschen**, haken Sie **Materialien löschen** und **Querschnitte löschen** an und klicken Sie auf **Bestätigen**. Knoten und Elemente werden dann wieder ab 1 nummeriert.
2. Reiter **Materialien** → **Materialbibliothek** → **+** in der Zeile **Stahl (S235)**; schließen Sie die Bibliothek dann mit **Abbrechen**.
3. Reiter **Querschnitte** → **Querschnitt hinzufügen**. Geben Sie in **Iy** `8,356e-5` ein, lassen Sie **Fläche**, **Höhe** und **Schubkoeffizient** auf `1` und klicken Sie auf **Querschnitt hinzufügen**.

Mit einer Fläche von 1 m² verkürzen sich die Stäbe praktisch nicht und verformen sich kaum durch Schub, so wie es die Handrechnung der Durchbiegung voraussetzt. Die Schnittgrößen eines statisch bestimmten Rahmens hängen überhaupt nicht von $E$, $A$ oder $I_y$ ab.

### Den Rahmen zeichnen {#_2-draw-the-frame}

1. Reiter **Elemente** → die zweite Schaltfläche **Element hinzufügen**, die mit dem Mauszeiger-Symbol.
2. Klicken Sie auf (0, 0), (0, −4), (4, −4), (8, −4) und (8, 0). Jeder Klick fügt den nächsten Knoten hinzu und verbindet ihn mit dem vorherigen; die Klicks rasten am Raster ein.
3. Drücken Sie <kbd>Esc</kbd>, um das Zeichnen zu beenden, und dann <kbd>F</kbd>, um die Ansicht anzupassen.

Sie haben jetzt die Knoten 1 bis 5 und die Elemente 1 bis 4, nummeriert in der Reihenfolge, in der Sie gezeichnet haben, wie in den Bildern hier. Vergleichen Sie die Tabelle **Knoten** mit der Tabelle oben und überschreiben Sie jede Koordinate, die danebenliegt.

### Lager und Gelenk {#_3-supports-and-the-hinge}

1. Klicken Sie auf Knoten 1 → **Knotenlagerung** → das Symbol **Festlager**. Ebenso für Knoten 5.
2. Suchen Sie in der Tabelle **Elemente** das Element 2 (von Knoten 2 nach Knoten 3) und haken Sie das zweite seiner Kästchen unter **Endgelenke** an: das Gelenk an seinem Ende, in Knoten 3.

![Die Tabelle Elemente: Bei Element 2 ist das Gelenk am Ende angehakt, in Knoten 3](/screenshots/de/p2t-frame-elements-table.webp)

Ein Gelenk genügt. Element 3 ist dann der einzige Stab, der biegesteif an Knoten 3 angeschlossen ist, also kann dort kein Moment in ihn übergehen. Wenn Sie zusätzlich das Gelenk am Anfang von Element 3 anhaken, ändert sich nichts.

### Last {#_4-load}

1. Reiter **Lasten** → **Elementlast hinzufügen**.
2. **Lasttyp** *Gleichmäßig verteilte Last*, **Element** `2`, `fz = 10`. Klicken Sie auf **Elementlast hinzufügen**.
3. Wiederholen Sie das für Element 3.

`fz` ist nach unten positiv. Der Riegel ist horizontal, deshalb spielt das Kästchen **LCS** (lokales Koordinatensystem) hier keine Rolle.

::

## Ergebnisse {#_5-results}

In den Anzeigeoptionen oben rechts in der Ansicht (das Zahnrad blendet sie ein und aus) sind **Verformte Form**, **M<sub>y</sub> (x)** und **Auflagerreaktionen** von Anfang an eingeschaltet. Haken Sie für den Rest **N (x)** und **V<sub>z</sub> (x)** an, oder entfernen Sie einzelne Haken, um jeweils nur einen Verlauf zu sehen. EduBeam beschriftet sie in kN und kNm mit zwei Nachkommastellen.

- Jeder Fußpunkt zeigt `40,00` nach oben und `20,00` nach innen.
- Das Biegemoment zeigt `-80,00` in beiden Rahmenecken und hat im Gelenk, wo es null ist, keine Beschriftung. EduBeam zeichnet es auf der Zugseite, hier außen am Rahmen.
- Die Normalkraft ist überall negativ: `-40,00` in den Stützen, `-20,00` im Riegel. Alle vier Stäbe stehen unter Druck.
- Reiter **Ergebnisse** → **Knotenergebnisse**: Das Gelenk, Knoten 3, verschiebt sich um $D_z$ = `4,2554 · 10⁻² m` nach unten, also um 42,55 mm – der Wert am Gelenk in der Ansicht $w(x)$ des Bildes oben.

## Von Hand prüfen {#_6-check-by-hand}

**Vertikale Auflagerkräfte.** Aus Symmetrie nimmt jeder Fußpunkt die Hälfte der 80 kN auf:

$$
V_1 = V_5 = \frac{q \cdot 8}{2} = 40\ \text{kN}
$$

**Horizontale Auflagerkräfte.** Schneiden Sie den Rahmen im Gelenk und bilden Sie für die linke Hälfte das Momentengleichgewicht um Knoten 3, wo das Moment null ist:

$$
V_1 \cdot 4 - H_1 \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_1 = \frac{160 - 80}{4} = 20\ \text{kN}
$$

Beide Fußpunkte drücken mit 20 kN nach innen. Ohne diesen Horizontalschub aus Festlagern, die nicht auseinanderrutschen können, könnte der Rahmen nicht stehen: Die Stützen würden nach außen kippen und das Gelenk würde absacken.

| Größe | Formel | Handrechnung | EduBeam |
| --- | --- | --- | --- |
| Vertikale Auflagerkräfte | $q \cdot 8/2$ | 40 kN | 40,00 |
| Horizontale Auflagerkräfte | aus $M_3 = 0$ | 20 kN | 20,00 |
| Momente in den Rahmenecken, Knoten 2 und 4 | $H_1 \cdot 4$ | 80 kNm, Zug außen | −80,00 |
| Moment im Gelenk, Knoten 3 | | 0 | keine Beschriftung |
| $N$ in den Stützen | $-V_1$ | −40 kN | −40,00 |
| $N$ im Riegel | $-H_1$ | −20 kN | −20,00 |
| $V$ in den Stützen | $\pm H_1$ | ±20 kN | −20,00 und 20,00 |
| $V$ im Riegel in den Knoten 2, 3, 4 | $V_1 - q\,x$ | 40; 0; −40 kN | 40,00; keine Beschriftung; −40,00 |

Die beiden Stützen tragen dieselbe Querkraft mit entgegengesetztem Vorzeichen, −20 kN in Element 1 und +20 kN in Element 4, weil die lokalen Achsen jedes Elements der Richtung folgen, in der es gezeichnet wurde: Element 1 nach oben, Element 4 nach unten. Tauschen Sie die Knoten einer Stütze, und ihr Vorzeichen kehrt sich um. Warum, erklären die [Vorzeichenkonventionen](/de/elements/conventions#internal-forces).

Im Riegel gilt $M(x) = -80 + 40x - 5x^2$ kNm, mit $x$ ab Knoten 2. Das Moment ist im Gelenk null und nirgends positiv: Der ganze Riegel hat Zug oben. Die Querkraft $V(x) = 40 - 10x$ ist genau im Gelenk null, dort hat das Moment also sein Extremum.

::callout{type="details" title="Die Durchbiegung des Gelenks mit dem Prinzip der virtuellen Kräfte"}
Setzen Sie in Knoten 3 eine Einslast nach unten an. Sie erzeugt die Auflagerreaktionen $\bar V = \bar H = 1/2$ und ein Moment $\bar m$, das von 0 am Fußpunkt auf 2 in der Rahmenecke anwächst und bis zum Gelenk wieder auf 0 abfällt, mit Zug außen wie das wirkliche Moment $M$. Integrieren Sie $M \bar m$ über die vier Stäbe:

$$
\text{Stützen: } 2\int_0^4 (20\,y)(0{,}5\,y)\,dy = 426{,}7
$$

$$
\text{Riegel: } 2\int_0^4 (80 - 40x + 5x^2)(2 - 0{,}5x)\,dx = 320
$$

Mit $EI = 210 \times 10^6 \cdot 8{,}356 \times 10^{-5} = 17\,548$ kNm²:

$$
\delta_3 = \frac{1}{EI}\int M \bar m\,dx = \frac{746{,}7}{17\,548} = 0{,}04255\ \text{m}
$$

Das sind die 42,55 mm, die EduBeam als `4,2554 · 10⁻²` m ausgibt. Die 4 in der letzten Stelle stammt von der winzigen Verkürzung und Schubverformung, die eine Fläche von 1 m² noch zulässt und die die Handrechnung vernachlässigt. Mit der wirklichen Fläche eines IPE 300, $A = 53{,}8$ cm², und seinem Steg als Schubfläche (Schubkoeffizient 0,40) verkürzen sich die Stäbe stärker und verformen sich mehr durch Schub, und das Gelenk senkt sich um 43,7 mm, etwa 3 % mehr.
::

## Experimentieren {#_7-experiment}

Ändern Sie jeweils nur eine Sache, sagen Sie das Ergebnis voraus und schauen Sie erst dann nach. <kbd>Strg</kbd>+<kbd>Z</kbd> nimmt jede Änderung zurück.

**Das Gelenk entfernen.** Nehmen Sie den Haken beim Gelenk weg. Der Rahmen wird einfach statisch unbestimmt. Der Horizontalschub halbiert sich auf 10 kN, die Eckmomente sinken auf −40 kNm, und in Feldmitte entsteht ein positives Feldmoment von 40 kNm. Knoten 3 senkt sich jetzt nur noch um 12,16 mm statt um 42,55 mm. Nun spielen auch die Querschnitte eine Rolle: Geben Sie dem Riegel einen steiferen Querschnitt als den Stützen, und die Eckmomente wachsen.

::model-figure{caption="Ohne Gelenk: weniger Horizontalschub, halb so große Eckmomente und ein positives Feldmoment in Feldmitte"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], [2, 3], [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, w]
show: [nodeLabels]
---
::

**Die Fußpunkte einspannen.** Geben Sie den Knoten 1 und 5 das Symbol **Einspannung**. Der Horizontalschub steigt auf 30 kN, und an den Fußpunkten entstehen Momente von 40 kNm (EduBeam zeigt `39,99`, weil sich die Stützen ganz leicht verkürzen); die Eckmomente bleiben aber bei 80 kNm. Aus Symmetrie ist die Querkraft im Gelenk null, also wirkt jede Riegelhälfte weiterhin wie ein Kragträger von 4 m Länge, der in seiner Rahmenecke eingespannt ist: $q \cdot 4^2/2 = 80$ kNm.

**Seitlich drücken.** Zurück auf Festlagern: Fügen Sie in Knoten 2 eine Knotenlast `Fx = 10` kN hinzu. Die Auflagerreaktionen verlieren ihre Symmetrie: 35 kN und 45 kN nach oben, 15 kN und 25 kN horizontal. Prüfen Sie sie mit denselben drei Gleichungen und $M_3 = 0$; die Last in Knoten 2 hat um Knoten 3 keinen Hebelarm. Die linke Rahmenecke geht auf −60 kNm zurück, und die linke Riegelhälfte hat jetzt ein kleines positives Moment, 1,25 kNm in 0,5 m Abstand vom Gelenk.

::model-figure{caption="Eine Horizontallast von 10 kN in Knoten 2: Die rechte Rahmenecke nimmt jetzt 100 kNm auf"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], { nodes: [2, 3], hinges: [false, true] }, [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
  - { node: 2, fx: 10 }
results: [M, N]
show: [nodeLabels]
---
::

**Ein zweites Gelenk setzen.** Haken Sie bei Element 2 auch das Gelenk am Anfang an, in Knoten 2. Zwei Gelenke im Riegel auf zwei gelenkig gelagerten Stützen ergeben einen Mechanismus. EduBeam zeigt keine Ergebnisse, meldet *Die Gelenke an den Knoten 2, 3 lassen die Struktur sich bewegen.* und animiert die Bewegung.

## Nächste Schritte {#next-steps}

::card-grid{cols="2"}
:::card{title="Üben: Dreigelenkrahmen" icon="lucide:dices" to="/de/practice?p=H2048"}
Derselbe Rahmen unter neuen Lasten, darunter eine Horizontallast; Ihre Antworten werden sofort geprüft. Beginnen Sie mit H2048; für weitere Aufgaben lassen Sie nur **Dreigelenkrahmen** ausgewählt und klicken auf **Neue Aufgabe**.
:::
:::card{title="Weiter: ebenes Fachwerk" icon="lucide:git-fork" to="/de/tutorials/truss"}
Neun gelenkig angeschlossene Stäbe: Knotenpunktverfahren, Ritterschnitt, ein Nullstab und eine Durchbiegung mit dem Prinzip der virtuellen Kräfte.
:::
::
