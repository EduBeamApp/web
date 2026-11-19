---
description: "Ebenes Fachwerk in EduBeam: Stabkräfte mit Knotenpunktverfahren und Ritterschnitt prüfen, einen Nullstab finden, eine Durchbiegung nachrechnen. Etwa 20 Minuten."
---

# Tutorial: ebenes Fachwerk

Sie bauen ein kleines, statisch bestimmtes Fachwerk aus gelenkig angeschlossenen Stäben, prüfen seine Stabkräfte mit dem Knotenpunktverfahren und dem Ritterschnitt und rechnen eine Durchbiegung mit dem Prinzip der virtuellen Kräfte nach.

- **Zeit:** etwa 20 Minuten.
- **Sie brauchen:** EduBeam in einem zweiten Tab, an einem Computer mit Maus und Tastatur. Wenn Sie EduBeam noch nicht kennen, zuerst den [Schnellstart](/de/guide/quick-start) oder eines der vorherigen Tutorials.
- **Vorkenntnisse:** Knotenpunktverfahren und Ritterschnitt. Die optionale Prüfung der Durchbiegung verwendet den Arbeitssatz mit einer virtuellen Einslast (Prinzip der virtuellen Kräfte).
- **Einheiten:** SI. Der Einheiten-Chip unten rechts in der Ansicht sollte `m m² kN kNm MPa` zeigen. Zeigt er Fuß und Kips, klicken Sie darauf und stellen Sie **Einheitensystem** auf **SI (metrisch)**.

**In diesem Tutorial lernen Sie,**

- Fachwerkstäbe als Balkenelemente mit Gelenken an beiden Enden zu modellieren und mit der Maus zu zeichnen,
- Stabkräfte mit dem Knotenpunktverfahren und dem Ritterschnitt zu prüfen,
- einen Nullstab zu erkennen und zu verstehen, warum ein Modell mit gelenkigen Knoten für ein Fachwerk funktioniert.

::div{.actions}
[EduBeam öffnen ↗](https://run.edubeam.app/?lang=de){target="_blank"} [Zur Handrechnung](#_5-check-by-hand)
::

::model-figure{caption="Das fertige Fachwerk: je 30 kN in den Knoten 2 und 3, Stabkräfte mit Zug positiv"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: roller }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 30 }
  - { node: 3, fz: 30 }
results: [N, w]
show: [nodeLabels, dimensions]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

## Die Aufgabe {#the-problem}

- Spannweite 12 m in drei Feldern zu je 4 m, Höhe 3 m: Untergurtknoten 1 bis 4, Obergurtknoten 5 und 6.
- Ein Festlager in Knoten 1 und ein Loslager in Knoten 4.
- Zwei Lasten von je 30 kN in den Untergurtknoten 2 und 3.
- Stahlstäbe, $E = 210$ GPa, $A = 20$ cm².

| Elemente | Stäbe, nach ihren Knoten | |
| --- | --- | --- |
| 1, 2, 3 | 1–2, 2–3, 3–4 | Untergurt |
| 4, 5, 6 | 1–5, 5–6, 6–4 | Enddiagonale, Obergurt, Enddiagonale |
| 7, 8, 9 | 2–5, 5–3, 3–6 | Pfosten, mittlere Diagonale, Pfosten |

**Ist es statisch bestimmt?** Mit $m = 9$ Stäben, $r = 3$ Auflagerreaktionen und $j = 6$ Knoten gilt $m + r = 12 = 2j$. Jeder Knoten liefert zwei Gleichgewichtsbedingungen, die Stabkräfte folgen also allein aus dem Gleichgewicht.

## Das Modell aufbauen {#model-it}

::div{.steps}

### Material und Querschnitt {#_1-material-and-section}

1. Klicken Sie in der oberen Leiste auf **Modell löschen**, haken Sie **Materialien löschen** und **Querschnitte löschen** an und klicken Sie auf **Bestätigen**. Knoten und Elemente werden dann wieder ab 1 nummeriert.
2. Reiter **Materialien** → **Materialbibliothek** → **+** in der Zeile **Stahl (S235)**; schließen Sie die Bibliothek dann mit **Abbrechen**.
3. Reiter **Querschnitte** → **Querschnitt hinzufügen**. Geben Sie in **Fläche** `0,002` und in **Iy** `1e-6` ein, lassen Sie **Höhe** und **Schubkoeffizient** auf `1` und klicken Sie auf **Querschnitt hinzufügen**.

Bei gelenkig angeschlossenen Stäben zählt nur die Fläche; $I_y$ muss lediglich positiv sein.

### Stäbe mit Gelenken zeichnen {#_2-draw-the-bars-with-hinges}

Ein Fachwerkstab ist in EduBeam ein Balkenelement, bei dem **beide Endgelenke** angehakt sind. Beim Zeichnen mit der Maus lassen sie sich gleich mit setzen, und die Reihenfolge, in der Sie zeichnen, ergibt die Nummern aus der Tabelle oben.

1. Reiter **Elemente** → die zweite Schaltfläche **Element hinzufügen**, die mit dem Mauszeiger-Symbol.
2. Haken Sie im Banner oben in der Ansicht **Gelenk am Anfang** und **Gelenk am Ende** an. Jeder Stab, den Sie jetzt zeichnen, erhält beide.
3. Untergurt: Klicken Sie auf (0, 0), (4, 0), (8, 0) und (12, 0) und drücken Sie dann <kbd>Esc</kbd>.
4. Obergurt und Enddiagonalen: Klicken Sie erneut auf **Element hinzufügen**, dann auf Knoten 1 bei (0, 0), auf (4, −3), (8, −3) und auf Knoten 4 bei (12, 0). Ein Klick auf einen vorhandenen Knoten schließt den Stab dort an, statt einen neuen Knoten anzulegen. Drücken Sie <kbd>Esc</kbd>.
5. Füllstäbe: Klicken Sie noch einmal auf **Element hinzufügen** und dann auf Knoten 2 bei (4, 0), Knoten 5 bei (4, −3), Knoten 3 bei (8, 0) und Knoten 6 bei (8, −3). Drücken Sie <kbd>Esc</kbd> und dann <kbd>F</kbd>, um die Ansicht anzupassen.

Die Tabelle **Elemente** sollte jetzt die neun Elemente aus der Tabelle oben enthalten, bei jedem beide Kästchen unter **Endgelenke** angehakt. <kbd>Esc</kbd> beendet das Zeichnen, die Gelenk-Kästchen im Banner bleiben aber für das nächste Mal angehakt.

### Lager und Lasten {#_3-supports-and-loads}

1. Klicken Sie auf Knoten 1 → **Knotenlagerung** → das Symbol **Festlager**. Geben Sie Knoten 4 das **Loslager**.
2. Klicken Sie auf Knoten 2 → **Last hinzufügen** → `Fz = 30` → **Knotenlast hinzufügen**. Wiederholen Sie das in Knoten 3.

Ein positives `Fz` zeigt nach unten. An jedem Knoten sind alle Stäbe gelenkig angeschlossen, nichts hält den Knoten also gegen Verdrehung. EduBeam akzeptiert das und gibt die Verdrehung eines solchen Knotens mit 0 aus.

::

## Ergebnisse {#_4-results}

Entfernen Sie in den Anzeigeoptionen oben rechts in der Ansicht (das Zahnrad blendet sie ein und aus) die Haken bei **Verformte Form** und **M<sub>y</sub> (x)**, denn in einem Fachwerk gibt es keine Biegung, und haken Sie **N (x)** an. Zug ist positiv; EduBeam beschriftet die Kräfte in kN mit zwei Nachkommastellen.

- Beide Lager zeigen `30,00` nach oben. Horizontal steht am Festlager höchstens `0,00`, denn es nimmt keine Horizontalkraft auf.
- Der Untergurt zeigt in allen drei Stäben `40,00`, also Zug, der Obergurt `-40,00`, also Druck.
- Die mittlere Diagonale 5–3 trägt nichts und hat deshalb keine Beschriftung, wie im Bild oben.
- Reiter **Ergebnisse** → **Knotenergebnisse**: Knoten 2 verschiebt sich um $D_z$ = `2,2937 · 10⁻³ m` nach unten, also um 2,294 mm.

## Von Hand prüfen {#_5-check-by-hand}

**Auflagerreaktionen.** Die Lasten sind symmetrisch, also $R_1 = R_4 = 30$ kN nach oben. Da keine Horizontallast wirkt, ist die horizontale Auflagerkraft am Festlager null.

**Knoten 1** (Knotenpunktverfahren). Die Enddiagonale 1–5 ist 5 m lang, also $\sin\alpha = 3/5$ und $\cos\alpha = 4/5$:

$$
\textstyle\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \ \Rightarrow\ N_{15} = -50\ \text{kN}
$$

$$
\textstyle\sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}
$$

**Knoten 2.** Nur der Pfosten 2–5 kann die Last von 30 kN nach oben abtragen: $N_{25} = +30$ kN, und $N_{23} = N_{12} = 40$ kN.

**Schnitt durch das mittlere Feld** (Ritterschnitt). Schneiden Sie die Stäbe 5–6, 5–3 und 2–3 und betrachten Sie den linken Teil:

- Momente um Knoten 3: $R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN.
- Vertikalkräfte: Die Querkraft im Feld beträgt $R_1 - 30 = 0$, die mittlere Diagonale **5–3 trägt also nichts**: $N_{53} = 0$.

| Stäbe | Handrechnung | EduBeam |
| --- | --- | --- |
| Untergurt 1–2, 2–3, 3–4 | +40 kN, Zug | 40,00 |
| Obergurt 5–6 | −40 kN, Druck | −40,00 |
| Enddiagonalen 1–5, 6–4 | −50 kN | −50,00 |
| Pfosten 2–5, 3–6 | +30 kN | 30,00 |
| Mittlere Diagonale 5–3 | 0 | keine Beschriftung |

Ein Nullstab ist nicht überflüssig: Unter *dieser* Belastung trägt er nichts, doch ohne ihn wird das Fachwerk verschieblich, wie die Experimente unten zeigen.

::callout{type="details" title="Die Durchbiegung von Knoten 2 mit dem Prinzip der virtuellen Kräfte"}
Setzen Sie in Knoten 2 eine Einslast nach unten an und berechnen Sie das Fachwerk noch einmal von Hand: $R_1 = 2/3$, $R_4 = 1/3$ und die Stabkräfte $n$ in der Tabelle unten. Die Durchbiegung ist $\delta = \sum N\,n\,L / (EA)$:

| Stab | $N$ (kN) | $n$ | $L$ (m) | $N\,n\,L$ |
| --- | --- | --- | --- | --- |
| 1–2 | 40 | 8/9 | 4 | 142,2 |
| 2–3 | 40 | 8/9 | 4 | 142,2 |
| 3–4 | 40 | 4/9 | 4 | 71,1 |
| 1–5 | −50 | −10/9 | 5 | 277,8 |
| 5–6 | −40 | −4/9 | 4 | 71,1 |
| 6–4 | −50 | −5/9 | 5 | 138,9 |
| 2–5 | 30 | 1 | 3 | 90,0 |
| 5–3 | 0 | −5/9 | 5 | 0 |
| 3–6 | 30 | 1/3 | 3 | 30,0 |
| | | | Summe | 963,3 |

$$
\delta_2 = \frac{963{,}3}{EA} = \frac{963{,}3}{210 \times 10^6 \cdot 0{,}002} = 0{,}002294\ \text{m}
$$

Das sind 2,294 mm, genau das $D_z$ von Knoten 2 in EduBeam, `2,2937 · 10⁻³` m.
::

## Experimentieren {#_6-experiment}

Ändern Sie jeweils nur eine Sache, sagen Sie das Ergebnis voraus und schauen Sie erst dann nach. <kbd>Strg</kbd>+<kbd>Z</kbd> nimmt jede Änderung zurück.

**Eine Last verschieben.** Setzen Sie beide Lasten in Knoten 2: Löschen Sie die Last in Knoten 3 und ändern Sie die andere auf `Fz = 60`. Jetzt ist $R_1 = 40$ kN, die Querkraft im mittleren Feld beträgt $40 - 60 = -20$ kN, und die mittlere Diagonale muss sie übernehmen: $N_{53} = -20 \cdot 5/3 = -33{,}33$ kN, also Druck.

::model-figure{caption="60 kN in Knoten 2: Die mittlere Diagonale 5–3 trägt jetzt die Querkraft des Feldes"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: roller }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 60 }
results: [N]
show: [nodeLabels]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

**Die mittlere Diagonale entfernen.** Löschen Sie Element 8. Das mittlere Feld wird zu einem gelenkigen Rechteck, das sich seitlich verschieben kann. EduBeam zeigt keine Ergebnisse, meldet *Die Gelenke an den Knoten 2, 3, 5, 6 lassen die Struktur sich bewegen.* – das sind die vier Ecken dieses Feldes – und animiert die Bewegung.

**Alle Gelenke entfernen.** Nehmen Sie in der Tabelle **Elemente** alle Gelenk-Haken weg. Aus dem Fachwerk wird ein Rahmen mit biegesteifen Knoten. Haken Sie **M<sub>y</sub> (x)** an: Die Biegemomente bleiben unter 0,1 kNm, und die Normalkräfte ändern sich um weniger als 0,1 %. Deshalb funktioniert die Idealisierung mit gelenkigen Knoten bei einem Fachwerk, das aus Dreiecken aufgebaut ist.

**Beide Lager als Festlager.** Eine vierte Auflagerreaktion macht das Fachwerk einfach statisch unbestimmt, und das Ergebnis überrascht Sie vielleicht: Der Untergurt trägt jetzt **nichts**, stattdessen drückt jedes Lager mit 40 kN nach innen. Die Knoten 1 und 4 können sich nicht voneinander entfernen, also muss die Gesamtverlängerung der drei Untergurtstäbe dazwischen, die auf einer Linie liegen, null sein. Alle drei tragen dieselbe Kraft, diese Kraft ist also null, und ihre 40 kN übernehmen die Lager. Das gilt unabhängig von den Stabquerschnitten.

::model-figure{caption="Beide Lager als Festlager: Die Lager übernehmen die Aufgabe des Untergurts"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: pin }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 30 }
  - { node: 3, fz: 30 }
results: [N]
show: [nodeLabels]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

## Nächste Schritte {#next-steps}

Die Theorie zum Fachwerkstab finden Sie unter [Fachwerkstab](/de/elements/truss).

::card-grid{cols="2"}
:::card{title="Üben: Warren-Fachwerke" icon="lucide:dices" to="/de/practice?p=T2048"}
Auflagerreaktionen und die Kraft in einem Stab eines größeren Warren-Fachwerks (Strebenfachwerk); Ihre Antworten werden sofort geprüft. Beginnen Sie mit T2048; für weitere Aufgaben lassen Sie nur **Warren-Fachwerk** ausgewählt und klicken auf **Neue Aufgabe**.
:::
:::card{title="Weiter: Durchlaufträger und Auflagersenkung" icon="lucide:spline" to="/de/tutorials/continuous-beam"}
Ein statisch unbestimmter Träger: was die Durchlaufwirkung bringt, was eine Auflagersenkung mit ihm macht und wie Sie beides mit dem Kraftgrößenverfahren prüfen.
:::
::
