---
description: "Einfeldträger aus Stahl in zehn Minuten: Material, Querschnitt, Knoten, Lager und Last eingeben, Auflagerreaktionen und Verläufe ablesen und von Hand prüfen."
source: site
---

# Schnellstart

In etwa zehn Minuten bauen Sie einen Einfeldträger aus Stahl auf, lesen Auflagerreaktionen, Querkraft, Biegemoment und Durchbiegung ab und prüfen jede Zahl von Hand. Öffnen Sie EduBeam in einem zweiten Tab oder neben dieser Seite und arbeiten Sie parallel mit.

::div{.actions}
[EduBeam öffnen ↗](https://run.edubeam.app/?lang=de){target="_blank"} [Direkt zur Handrechnung](#_8-check-by-hand)
::

## Die Aufgabe {#the-problem}

Ein Träger von 6 m Länge liegt in Knoten 1 auf einem Festlager und in Knoten 2 auf einem Loslager und trägt über die ganze Länge eine Gleichlast von 12 kN/m. Es ist ein Stahlträger IPE 200: $E = 210$ GPa, $G = 81$ GPa, $A = 28{,}48\ \text{cm}^2$ und $I_y = 1943\ \text{cm}^4$. Alle vier Werte stammen aus den Bibliotheken von EduBeam, Sie müssen also nichts nachschlagen.

::model-figure{caption="Der Träger, den Sie aufbauen: 6 m Spannweite von Knoten 1 bis Knoten 2, belastet mit 12 kN/m"}
---
nodes: { 1: [0, 0], 2: [6, 0] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 12 }
results: []
show: [nodeLabels, dimensions]
---
::

## Modell aufbauen {#build-the-model}

::div{.steps}

### Mit einem leeren Modell beginnen {#start-from-an-empty-model}

Beim ersten Besuch fragt ein Willkommensdialog, wie Sie beginnen möchten. Wählen Sie unter **Einheitensystem** die Option **SI (metrisch)**, behalten Sie unter **Koordinatensystem** die Einstellung **x nach rechts, z nach unten** bei und klicken Sie auf **Vorerst überspringen**. Die App zeigt dann einen kleinen Beispielrahmen.

1. Klicken Sie in der Kopfleiste auf **Modell löschen** (auf dem Smartphone finden Sie es im Menü **☰**).
2. Haken Sie **Materialien löschen** und **Querschnitte löschen** an und klicken Sie auf **Bestätigen**.

Die Zeichenfläche ist jetzt leer, und zwei rote Meldungen weisen darauf hin, dass es noch kein Material und keinen Querschnitt gibt. Das ändern die nächsten Schritte. Verloren ist nichts: <kbd>Strg</kbd>+<kbd>Z</kbd> holt den Rahmen zurück, und er bleibt außerdem unter **☰ → Zuletzt verwendete Modelle** erhalten.

### Einheiten prüfen {#_1-check-the-units}

Der Chip unten rechts in der Ansicht zeigt die Einheiten, in denen alle Eingabefelder und Ergebnisse angegeben sind. Diese Seite arbeitet mit SI-Einheiten, die der Chip als `m m² kN kNm MPa` anzeigt, und mit einer nach unten zeigenden z-Achse. Zeigt der Chip Fuß und Kips an, klicken Sie darauf und stellen Sie **Einheitensystem** auf **SI (metrisch)**. An derselben Stelle muss **Koordinatensystem** auf **x nach rechts, z nach unten** stehen: Mit der y-Achse nach oben zeigt eine positive Last nach oben, und die Vorzeichen auf dieser Seite würden nicht mehr passen.

![Die Schalter für Raster (G) und Fangen (S), das Fadenkreuz und der Einheiten-Chip](/screenshots/de/ui-grid-units.webp){.shot-sm}

### Material und Querschnitt anlegen {#_2-add-the-material-and-cross-section}

Jedes Element braucht ein Material und einen Querschnitt. Legen Sie beide deshalb zuerst an, und zwar aus den Bibliotheken.

1. Öffnen Sie in der unteren Leiste den Reiter **Materialien** und klicken Sie auf **Materialbibliothek**.
2. Klicken Sie in der Zeile **Stahl (S235)** auf **+** ($E = 210\,000$ MPa, $G = 81\,000$ MPa). Die Bibliothek bleibt für weitere Einträge offen; schließen Sie sie mit **Abbrechen**.
3. Öffnen Sie den Reiter **Querschnitte** und klicken Sie auf **Querschnittsbibliothek**.
4. Scrollen Sie zur Zeile **IPE 200 (ca.)**, klicken Sie auf **+** und schließen Sie die Bibliothek mit **Abbrechen**.

Beide roten Meldungen sind verschwunden, und der Reiter **Querschnitte** führt den IPE 200 auf:

![Der IPE 200 im Reiter Querschnitte: Fläche, Iy, Höhe und Schubkoeffizient](/screenshots/de/a-qs-cross-sections.webp)

Wenn Sie lieber eigene Werte eingeben, verwenden Sie **Material hinzufügen** und **Querschnitt hinzufügen**. Der Schubkoeffizient, hier 0,3933, taucht in der [Handrechnung](#_8-check-by-hand) wieder auf.

### Knoten hinzufügen {#_3-add-the-nodes}

1. Öffnen Sie den Reiter **Knoten**. Er hat zwei Schaltflächen **Knoten hinzufügen**: **+** öffnet einen Dialog, die Schaltfläche mit dem Mauszeiger-Symbol setzt Knoten mit der Maus. Klicken Sie auf **+ Knoten hinzufügen**.
2. Lassen Sie **X-Koordinate** und **Z-Koordinate** auf `0` und klicken Sie auf **Knoten hinzufügen**. Der Dialog schließt sich, und Knoten `1` erscheint.
3. Klicken Sie erneut auf **+ Knoten hinzufügen**, geben Sie bei **X-Koordinate** `6` ein und klicken Sie auf **Knoten hinzufügen**. Das ist Knoten `2`.

![Der Dialog Neuen Knoten hinzufügen. Darin lassen sich auch gleich die Lager festlegen.](/screenshots/de/qs-node.webp){.shot-md}

### Mit einem Element verbinden {#_4-connect-them-with-an-element}

Öffnen Sie den Reiter **Elemente** und klicken Sie auf **+ Element hinzufügen**. Der Dialog schlägt bereits **Anfangsknoten** `1`, **Endknoten** `2` sowie Ihr Material und Ihren Querschnitt vor. Klicken Sie auf **Element hinzufügen**.

![Neues Element hinzufügen: die beiden Endknoten, ein optionales Gelenk an jedem Ende, das Material und der Querschnitt](/screenshots/de/a-qs-element.webp){.shot-md}

Zwischen den Knoten erscheint ein Balken. Drücken Sie <kbd>F</kbd>, um ihn an den Bildschirm anzupassen. Ein blauer Chip **Lager fehlen** oben links in der Ansicht sagt Ihnen, warum es noch keine Ergebnisse gibt.

### Lager setzen {#_5-add-the-supports}

Zurück im Reiter **Knoten**: Jede Zeile hat am Anfang der Spalte **Gelagerte Freiheitsgrade** eine Lagerauswahl.

- Knoten `1`: Wählen Sie **Festlager**. Damit sind `Dx` und `Dz` angehakt.
- Knoten `2`: Wählen Sie **Loslager**. Damit ist nur `Dz` angehakt.

![Die Lagerauswahl in der Knotentabelle](/screenshots/de/a-qs-support-picker.webp){.shot-lg}

Der Chip **Lager fehlen** verschwindet. Sie können auch in der Ansicht auf einen Knoten klicken und **Knotenlagerung** wählen. Unter [Knoten & Lager](/de/essentials/nodes-supports#supports) sind alle Lagertypen aufgeführt.

### Last aufbringen {#_6-add-the-load}

1. Öffnen Sie den Reiter **Lasten** und klicken Sie auf **Elementlast hinzufügen**.
2. Behalten Sie **Lasttyp** *Gleichmäßig verteilte Last* und **Element** `1` bei.
3. Geben Sie bei **fz** `12` ein, lassen Sie **fx** auf `0` und klicken Sie auf **Elementlast hinzufügen**.

![Der Dialog zeigt eine Vorschau der Last am Element](/screenshots/de/a-qs-load.webp){.shot-md}

Ein positives `fz` zeigt in +z-Richtung, also **nach unten**: Ein positiver Wert wirkt wie das Eigengewicht in Richtung der Schwerkraft. Das angehakte Kästchen **LCS** bedeutet, dass die Last den Achsen des Elements folgt, also dem lokalen Koordinatensystem (LKS). Bei einem waagerechten, von links nach rechts gezeichneten Balken fallen diese mit den globalen Achsen zusammen. Mehr dazu unter [Koordinatensystem & Vorzeichenkonventionen](/de/elements/conventions#loads).

::

## Ergebnisse ablesen {#_7-read-the-results}

EduBeam berechnet den Träger, sobald die Last gesetzt ist, und danach nach jeder weiteren Änderung erneut: Eine Schaltfläche *Berechnen* gibt es nicht. Mit dem Panel oben rechts in der Ansicht schalten Sie die Darstellungen ein und aus. **Verformte Form**, **M<sub>y</sub>(x)** und **Auflagerreaktionen** sind von Anfang an eingeschaltet. Haken Sie **V<sub>z</sub>(x)** an, um die Querkraft hinzuzufügen.

![Die Anzeigeoptionen mit eingeschalteter Querkraft](/screenshots/de/a-qs-display.webp){.shot-md}

Ihr Bildschirm sollte jetzt dieser Abbildung entsprechen. Wechseln Sie zwischen Biegemoment und Querkraft:

::model-figure{caption="Der fertige Träger: Auflagerreaktionen von 36 kN und 54 kNm in Feldmitte"}
---
nodes: { 1: [0, 0], 2: [6, 0] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 12 }
results: [M, V]
show: [nodeLabels]
---
::

| Darstellung | Was Sie sehen sollten |
| --- | --- |
| **Auflagerreaktionen** | Zwei nach oben gerichtete Pfeile von **36 kN**, einer an jedem Lager. |
| **V<sub>z</sub>(x)** | Eine Gerade von **+36 kN** in Knoten `1` bis **−36 kN** in Knoten `2` mit Nulldurchgang in Feldmitte. |
| **M<sub>y</sub>(x)** | Eine Parabel mit dem Größtwert **54 kNm** in Feldmitte, auf der Zugseite gezeichnet, also unter dem Balken. |
| **Verformte Form** | Eine symmetrische Durchbiegung, überhöht dargestellt. |

Die Zahlen finden Sie im Reiter **Ergebnisse**. **Knotenergebnisse** listet die Verschiebungen `Dx`, `Dz` und die Verdrehung `Ry` jedes Knotens auf, **Elementergebnisse** die Stabendkräfte jedes Elements in seinen eigenen Achsen. Knoten `1` verdreht sich um $R_y = -2{,}6469 \cdot 10^{-2}$ rad, Knoten `2` um denselben Betrag in die Gegenrichtung. Unter [Ergebnisse & Diagramme](/de/essentials/results) sind alle Tabellen und Vorzeichen erklärt.

Wirken die Verläufe zu groß oder zu klein, ändern Sie die **Ergebnisskalierung** unter **Einstellungen → Anzeigeeinstellungen**.

## Von Hand prüfen {#_8-check-by-hand}

Mit $q = 12$ kN/m und $L = 6$ m liefern die Lehrbuchformeln:

| Größe | Formel | Handrechnung | EduBeam |
| --- | --- | --- | --- |
| Auflagerreaktionen | $qL/2$ | 36 kN | 36 kN |
| Größte Querkraft | $qL/2$ | 36 kN | 36 kN |
| Größtes Moment | $qL^2/8$ | 54 kNm | 54 kNm |
| Endverdrehung | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Durchbiegung in Feldmitte | $w_b + w_s$ | 49,63 + 0,60 = 50,22 mm | 50,22 mm |

Die Durchbiegung setzt sich aus zwei Anteilen zusammen, und die meisten Lehrbücher nennen nur den ersten:

- **Biegung:** $w_b = 5qL^4/(384EI) = 49{,}63$ mm, mit $EI = 4080$ kNm² aus $E = 210$ GPa und $I_y = 1943\ \text{cm}^4$.
- **Schub:** $w_s = qL^2/(8kGA) = 0{,}60$ mm, mit $kGA \approx 90\,700$ kN aus $k = 0{,}3933$, $G = 81$ GPa und $A = 28{,}48\ \text{cm}^2$.

In Feldmitte gibt es noch keinen Knoten. Fügen Sie einen hinzu, um dort die Durchbiegung abzulesen:

1. Klicken Sie im Reiter **Knoten** auf die zweite Schaltfläche **Knoten hinzufügen**, die mit dem Mauszeiger-Symbol.
2. Klicken Sie bei `x = 3` auf den Balken; bei eingeschaltetem Fangen landet der Knoten auf dem Raster. EduBeam fragt, was mit dem Knoten geschehen soll: Klicken Sie auf **Mit Struktur verbinden**. Das Element wird mitsamt seiner Last in `1a` und `1b` geteilt, und das Setzen von Knoten endet. Liegt Knoten `3` im Reiter **Knoten** nicht bei X = `3`, tragen Sie dort `3` ein.
3. Unter **Ergebnisse → Knotenergebnisse** zeigt Knoten `3` jetzt $D_z = 5{,}0224 \cdot 10^{-2}$ m, also 50,22 mm.

![Knotenergebnisse nach dem Teilen: Knoten 3 verschiebt sich um 50,22 mm nach unten](/screenshots/de/a-qs-nodal-results.webp){.shot-lg}

Das Teilen des Balkens ändert kein Ergebnis, denn das Element ist für diese Lasten exakt: Es gibt kein Netz, das verfeinert werden müsste.

::callout{type="details" title="Wozu der Schubkoeffizient?"}
EduBeam verwendet Timoshenko-Balkenelemente, die die Schubverformung berücksichtigen. Der Schubkoeffizient $k$ skaliert die schubtragende Fläche, $kGA$ ist also die Schubsteifigkeit. Bei den I-Profilen der Bibliothek ist $k$ der Flächenanteil des Stegs, $h t_w / A$: für den IPE 200 $0{,}2 \cdot 0{,}0056 / 0{,}002848 = 0{,}3933$. Der Schubanteil der Durchbiegung, $w_s = qL^2/(8kGA)$, ist das Integral von $V/(kGA)$ vom Lager bis zur Feldmitte.

Bei diesem schlanken Träger beträgt der Schubanteil 0,60 mm, etwa 1 % der Gesamtdurchbiegung. Bei einem kurzen, hohen Träger ist er deutlich größer. Setzen Sie im Reiter **Querschnitte** den Schubkoeffizienten auf eine sehr große Zahl (etwa `1e10`), und EduBeam liefert die reine Biegedurchbiegung von 49,63 mm. Die Theorie steht auf der Seite [Balkenelement](/de/elements/beam).
::

Weitere Vergleichsrechnungen von Hand (Kragträger, beidseitig eingespannter Träger, Fachwerk, Temperatur, Auflagersenkung) finden Sie unter [Ergebnisse von Hand prüfen](/de/guide/verification).

## Experimentieren {#_9-experiment}

Ändern Sie das Modell und beobachten Sie, wie die Verläufe folgen. Probieren Sie jede Änderung einzeln aus und machen Sie sie mit <kbd>Strg</kbd>+<kbd>Z</kbd> rückgängig, bevor Sie die nächste versuchen. Knoten `3` ist der Knoten in Feldmitte, den Sie eben hinzugefügt haben.

- **Ziehen Sie Knoten `2`** nach rechts. Das Moment wächst mit $L^2$, die Durchbiegung mit $L^4$.
- **Haken Sie `Ry` an Knoten `1` an**, um dieses Ende einzuspannen. An der Einspannung entsteht ein negatives Moment (Zug oben): nach der Lehrbuchformel $qL^2/8 = 54$ kNm, in EduBeam 53,8 kNm. In einem statisch unbestimmten Träger verändert die Schubsteifigkeit auch die Schnittgrößen.
- **Haken Sie `Dz` an Knoten `3` an**, um ein Mittellager hinzuzufügen und einen Zweifeldträger zu erhalten. Über dem Mittellager entsteht ein negatives Stützmoment: von Hand $q(L/2)^2/8 = 13{,}5$ kNm, in EduBeam aus demselben Grund 13,3 kNm.
- **Haken Sie `Dz` an Knoten `3` an und im Reiter Elemente bei Element `1a` das zweite Kästchen der Spalte *Endgelenke* an**, also sein Ende an Knoten `3`. Aus dem Träger werden zwei Einfeldträger von je 3 m. Entfernen Sie nun den Haken bei `Dz` an Knoten `3`: Der Träger wird zum Mechanismus, und EduBeam zeigt, wie er sich bewegen kann.

Um Spannweite und Last zu verändern, ohne etwas aufzubauen, verschieben Sie die Regler unten. Wechseln Sie zwischen den Ergebnissen, um zu sehen, wie jede Größe mit der Spannweite wächst.

::example-structure
::

## Speichern oder teilen {#_10-save-or-share}

- **Jemandem schicken.** Klicken Sie in der Kopfleiste auf **Modell teilen** und dann auf **Kopieren**. Der Link enthält das ganze Modell, und wer ihn öffnet, erhält eine eigene Kopie zum Bearbeiten.
- **Als Datei aufbewahren.** **☰ → Projekt speichern** (<kbd>Strg</kbd>+<kbd>S</kbd>) lädt die Datei `project.json` herunter. Öffnen Sie sie wieder mit **☰ → Projekt öffnen** (<kbd>Strg</kbd>+<kbd>O</kbd>) oder indem Sie sie auf die App ziehen.
- **Die Zeichnung in einen Bericht übernehmen.** **☰ → Bild exportieren** (<kbd>Strg</kbd>+<kbd>P</kbd>) speichert sie als PNG oder SVG.

Das Modell bleibt außerdem in Ihrem Browser gespeichert, sodass es beim Neuladen der Seite nicht verloren geht. Einzelheiten unter [Dateien, Links & Export](/de/essentials/import-export).

## Wie geht es weiter? {#where-next}

::card-grid{cols="2"}
:::card{title="Tutorials" icon="lucide:graduation-cap" to="/de/tutorials/inclined-beam"}
Vier Modelle, Schritt für Schritt aufgebaut und von Hand geprüft, vom geneigten Träger bis zum Durchlaufträger mit Auflagersenkung.
:::
:::card{title="Beispiele" icon="lucide:library" to="/de/examples/"}
Fertige Balken, Rahmen und Fachwerke, die sich mit einem Klick öffnen, mit Übungsaufgaben und Lösungen.
:::
:::card{title="Lasten" icon="lucide:arrow-down-to-line" to="/de/essentials/loads"}
Trapez-, Einzel- und Temperaturlasten, Knotenkräfte und Auflagersenkungen.
:::
:::card{title="Tastatur, Maus & Touch" icon="lucide:keyboard" to="/de/reference/shortcuts"}
Knoten und Elemente direkt auf der Zeichenfläche zeichnen und schneller bearbeiten.
:::
::
