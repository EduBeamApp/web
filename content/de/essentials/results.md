---
description: "Ergebnisse in EduBeam ablesen: N-, V- und M-Verläufe, Verformungsfigur, Auflagerreaktionen, Vorzeichen, Tooltips, Tabellen, CSV-Export und Steifigkeitsmatrix."
source: site
---

# Ergebnisse & Diagramme

[EduBeam]{.edubeam} berechnet das Modell nach jeder Änderung neu, die Verläufe, Auflagerreaktionen und Tabellen auf dem Bildschirm gehören also immer zu dem Modell, das Sie sehen. Eine Schaltfläche *Berechnen* gibt es nicht. Wird nichts gezeichnet, lässt sich das Modell noch nicht berechnen: Die Meldung oben links in der Ansicht sagt, warum, und die [Fehlerbehebung](/de/reference/troubleshooting) erklärt jede Meldung.

## Darstellungen in der Ansicht {#overlays-in-the-viewer}

Die Ergebnisse werden über das Modell gezeichnet. Schalten Sie sie in den **Anzeigeoptionen** oben rechts in der Ansicht ein und aus; die Schaltfläche ⚙ darüber blendet das Panel ein oder aus.

::model-figure{caption="Dreigelenkrahmen unter 10 kN/m: Schalten Sie zwischen M, V, N und der Verformungsfigur um"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, V, N, w]
show: [nodeLabels]
height: 300
---
::

| Schalter | Zeichnet | Farbe | Zu Beginn an |
| --- | --- | --- | --- |
| **Verformte Form** | das verformte Tragwerk, überhöht dargestellt, damit die Verformung sichtbar ist | grau | ja |
| **N (x)** | Normalkraft | blau | |
| **V<sub>z</sub> (x)** | Querkraft | grün | |
| **M<sub>y</sub> (x)** | Biegemoment | rot | ja |
| **Auflagerreaktionen** | einen Pfeil und einen Wert für jede gehaltene Richtung | violett | ja |

Eine zweite Reihe schaltet Teile der Zeichnung selbst ein und aus: **Lager**, **Lasten**, **Knotenbeschriftung** und **Elementbeschriftung**. **Weitere Einstellungen** unter dem Panel öffnet die [Anzeigeeinstellungen](/de/essentials/units-settings#viewer-settings), in denen Sie die Größe der Verläufe (*Ergebnisskalierung*), die Farben, die Ausrichtung der Beschriftungen und die Darstellung der Verläufe festlegen.

Die Werte stehen dort, wo es darauf ankommt: an den Enden jedes Stabs, auf beiden Seiten eines Sprungs unter einer Einzellast oder über einem Lager und an jedem Extremwert des Verlaufs, etwa am Scheitel einer Parabel, wo $V = 0$ ist. Die Abbildung oben zeigt den [Dreigelenkrahmen](/de/tutorials/three-hinged-frame), den Sie von Hand nachrechnen können: 40 kN Druck in jeder Stütze, 20 kN im Riegel und −80 kNm in beiden Ecken. Die Darstellung *w* zeigt, dass sich das Gelenk in C um 42,55 mm senkt.

### Das Vorzeichen ablesen {#reading-the-sign}

Lesen Sie das Vorzeichen am **Wert** ab, nicht an der Seite des Stabs, auf der ein Verlauf gezeichnet ist. Die Konventionen sind die der meisten Lehrbücher:

| Ergebnis | Positiv bedeutet |
| --- | --- |
| **N** | Zug |
| **V<sub>z</sub>** | Die Querkraft dreht ein kurzes Stabstück im Uhrzeigersinn. Wegen $V = \mathrm{d}M/\mathrm{d}x$ ist sie bei einem Einfeldträger unter Schwerkraftlast am linken Lager positiv und am rechten negativ |
| **M<sub>y</sub>** | positives Moment: Zug in der unteren Faser, auf der Seite der **gestrichelten Linie** entlang jedes Stabs |

Ein Einfeldträger mit Kragarm zeigt beide Vorzeichen auf einmal. Zwischen den Lagern ist das Moment positiv (+13,5 kNm); über dem rechten Lager ist es negativ (−24 kNm), mit Zug oben. Die Querkraft springt um die Auflagerreaktion von 54 kN in B, von −30 auf +24 kN:

::model-figure{caption="Einfeldträger mit Kragarm unter 12 kN/m: positives Feldmoment zwischen den Lagern, negatives Stützmoment über B"}
---
nodes: { A: [0, 0], B: [4, 0], C: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

Standardmäßig wird das Biegemoment auf der **Zugseite** gezeichnet, positive Normal- und Querkräfte auf der Seite, die der gestrichelten Linie gegenüberliegt. Das handhaben Hochschulen unterschiedlich, deshalb lässt sich jede Seite unter **Einstellungen → Anzeigeeinstellungen → Schnittgrößenverläufe** umkehren; dort können Sie die Verläufe auch wie von Hand schraffieren und jeden Abschnitt mit seinem Polynomgrad beschriften. Das Umkehren einer Seite ändert nur die Zeichnung, nie die Werte. Die vollständigen Vorzeichenkonventionen, auch zu den lokalen Achsen des Elements, stehen im [Theoriehandbuch](/de/elements/conventions#internal-forces).

## Tooltips beim Überfahren {#hover-tooltips}

Zeigen Sie mit der Maus auf ein Objekt, um seine Werte abzulesen:

- **Knoten**: die Verschiebungen $u_x$, $u_z$ (in der Verschiebungseinheit) und die Verdrehung $\varphi_y$ (in Radiant).
- **Element**: seine Bezeichnung, sein Querschnitt und sein Material.
- **Last**: ihre Komponenten.

Auf einem Touchscreen tippen Sie stattdessen auf das Objekt: Sein Panel zeigt dieselben Details.

![Tooltip an Knoten 2 des Trägers aus dem Schnellstart](/screenshots/de/ui-hover.webp){.shot-sm}

## Reiter Ergebnisse {#results-tab}

Der Reiter **Ergebnisse** in der unteren Leiste enthält zwei Tabellen, zwischen denen Sie mit **Knotenergebnisse** und **Elementergebnisse** umschalten.

### Knotenergebnisse {#nodal-results}

Eine Zeile je Knoten mit seinen Verschiebungen **D<sub>x</sub>** und **D<sub>z</sub>** (in der Verschiebungseinheit) und seiner Verdrehung **R<sub>y</sub>** (in Radiant), in globalen Achsen: Ein positives D<sub>z</sub> zeigt nach unten, ein positives R<sub>y</sub> dreht auf dem Bildschirm gegen den Uhrzeigersinn. Eine gelagerte Richtung zeigt 0 oder die vorgegebene Auflagersenkung. Die Auflagerreaktionen stehen nicht in dieser Tabelle: Lesen Sie sie in der Zeichnung ab oder im [CSV-Export](#export-csv-and-copy).

![Knotenergebnisse des Dreigelenkrahmens von oben, mit Zahlenformat Automatisch](/screenshots/de/p2c-results-nodal.webp){.shot-lg}

### Elementergebnisse {#element-results}

Eine Zeile je Element mit seinen **Stabendkräften im lokalen Koordinatensystem des Elements**:

| Spalte | Bedeutung |
| --- | --- |
| X<sub>12</sub>, Z<sub>12</sub>, M<sub>12</sub> | Normalkraft, Querkraft und Moment, die am **Anfangsknoten** auf das Element wirken |
| X<sub>21</sub>, Z<sub>21</sub>, M<sub>21</sub> | dasselbe am **Endknoten** |

![Elementergebnisse des Dreigelenkrahmens: die Stabendkräfte seiner vier Stäbe](/screenshots/de/p2c-results-element.webp)

Stabendkräfte sind die Kräfte, die die Knoten auf das Element ausüben. Sie folgen den lokalen Achsen, nicht der N-V-M-Konvention der Verläufe, deshalb haben sie andere Vorzeichen:

- **Einfeldträger** (6 m, 12 kN/m, aus dem [Schnellstart](/de/guide/quick-start)): Z<sub>12</sub> = Z<sub>21</sub> = −36 kN. Beide Lager drücken den Träger nach oben, also in −z.
- **Kragträger**, am Anfangsknoten eingespannt, mit 18 kN nach unten am Kragende: Z<sub>12</sub> = −18 kN, M<sub>12</sub> = +72 kNm, Z<sub>21</sub> = +18 kN, M<sub>21</sub> = 0.
- **Stütze 1 des Rahmens** (A unten, B oben): X<sub>12</sub> = +40 kN drückt entlang der lokalen x-Achse in das Element hinein, das sind 40 kN Druck.

Mehr zu dieser Tabelle steht im [Theoriehandbuch](/de/elements/conventions#end-forces-element-results-table).

### CSV exportieren und Kopieren {#export-csv-and-copy}

**CSV exportieren** lädt `edubeam-results.csv` mit beiden Tabellen herunter, in den auf dem Bildschirm angezeigten Einheiten und bereit für eine Tabellenkalkulation. **Kopieren** legt dieselben Tabellen als tabulatorgetrennten Text in die Zwischenablage, der sich direkt in Excel, LibreOffice oder Google Sheets einfügen lässt.

| Tabelle | Spalten |
| --- | --- |
| Knoten | Node, x, z, Dx, Dz, Ry und die **Auflagerreaktionen** Rx, Rz, My |
| Elemente | Element, Node 1, Node 2 und die Stabendkräfte N1, V1, M1, N2, V2, M2 |

Jede Spaltenüberschrift trägt ihre Einheit, zum Beispiel `Dz [mm]`. Die Stabendkräfte sind dieselben lokalen Werte wie X<sub>12</sub> … M<sub>21</sub> auf dem Bildschirm.

### Steifigkeitsmatrix {#stiffness-matrix}

Wählen Sie **Steifigkeitsmatrix** im Panel eines Elements oder über die Schaltfläche in seiner Zeile der Tabelle *Elemente*, um die Steifigkeitsmatrix des Elements (6 × 6) in **globalen Koordinaten** und SI-Einheiten (N, m) zu öffnen. Das ist praktisch, um in einer Lehrveranstaltung zum Weggrößenverfahren die Assemblierung von Hand zu prüfen; die Formeln stehen im [Theoriehandbuch](/de/elements/beam).

## Zahlenformat {#number-format}

Die Tabellen und Tooltips zeigen Ergebnisse mit fünf signifikanten Stellen. **Einstellungen → Sprache & Region → Zahlenformat** bestimmt, wie sie geschrieben werden:

| Format | 40 000 wird geschrieben als | Geeignet für |
| --- | --- | --- |
| **Wissenschaftlich** (Standard) | 4 · 10⁴ | Werte über viele Größenordnungen |
| **Technisch** | 40 · 10³ | Ablesen der Vorsätze Kilo und Mega |
| **Automatisch** | 40.000 | alltägliche Zahlen in der Lehre |

*Automatisch* schreibt Werte von 0,001 bis 100 000 als gewöhnliche Zahlen. Außerhalb dieses Bereichs schreibt es sie wie *Technisch*, mit Zehnerpotenzen in Dreierschritten, etwa 380,95 · 10⁻⁹ in den Knotenergebnissen oben. Das Dezimaltrennzeichen folgt der Sprache.

Die Beschriftungen in der Zeichnung (Werte der Verläufe und Auflagerreaktionen) haben unabhängig vom Zahlenformat immer zwei Nachkommastellen: Aus 6,6667 kN wird 6,67. Brauchen Sie mehr Stellen, lesen Sie die Tabellen oder Tooltips.

## Genauigkeit {#precision-and-accuracy}

- Das Balkenelement ist für das lineare Timoshenko-Modell unter Knoten-, Gleich-, Trapez-, Einzel- und Temperaturlasten exakt. Die Ergebnisse hängen **nicht** von der Anzahl der Elemente ab, und es gibt kein Netz zu verfeinern.
- Gerechnet wird in doppelter Genauigkeit. Ein Wert, der kleiner ist als ein Billionstel des größten Werts seiner Art, ist ein Rundungsfehler, und die Tabellen zeigen ihn als 0.
- Durchbiegungen enthalten die **Schubverformung**, und in einem statisch unbestimmten Tragwerk verschiebt sie auch die Kräfte geringfügig. Bei schlanken Stäben erhöht sie die Durchbiegung nach Euler-Bernoulli um einen Bruchteil eines Prozents, bei kurzen, hohen Stäben können es zehn Prozent und mehr sein. Die Seite [Ergebnisse von Hand prüfen](/de/guide/verification#shear-deformation) zeigt, wie groß sie ist und wie Sie sie für einen Vergleich mit Lehrbuchformeln abschalten.

## Ergebnisse in einem Bericht {#results-in-a-report}

- **☰ → Bild exportieren** (<kbd>Strg</kbd>+<kbd>P</kbd>) speichert die Zeichnung mit den gewählten Verläufen als PNG oder SVG. Siehe [Bild exportieren](/de/essentials/import-export#export-an-image).
- **CSV exportieren** oder **Kopieren** im Reiter Ergebnisse liefert die Zahlen.
- **Modell teilen** liefert einen Link, mit dem Leserinnen und Leser das Modell selbst öffnen können.
- Für Skripte und Übungsblätter zeichnet die Zeichenbibliothek [`@edubeam/plot`](/de/plot) dieselben Verläufe aus Code.
