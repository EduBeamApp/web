---
description: "Knoten in EduBeam setzen, am Raster fangen, Elemente teilen und das passende Lager wählen: Festlager, Loslager, Einspannung, Parallelführung, auch vertikal oder schräg."
source: site
---

# Knoten & Lager

Knoten sind die Punkte Ihres Modells: Elemente verbinden sie, und an ihnen sitzen Lager und Knotenlasten. Setzen Sie Knoten, indem Sie Koordinaten eingeben oder klicken, und geben Sie den gelagerten Knoten dann das Lager, das Ihrer Skizze entspricht.

## Koordinaten {#coordinates}

Jeder Knoten hat eine **X**- und eine **Z**-Koordinate in der aktuellen [Längeneinheit](/de/essentials/units-settings#units). X zeigt nach rechts und **Z nach unten**, alles oberhalb des Bodens hat also ein negatives Z: Eine 4 m hohe Stütze verläuft von `Z = 0` bis `Z = −4`.

::model-figure{caption="Ein Portalrahmen, 6 m breit und 4 m hoch: A und D liegen bei Z = 0, B und C bei Z = −4"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: fixed, D: fixed }
members: [[A, B], [B, C], [C, D]]
results: []
show: [nodeLabels, dimensions]
---
::

Ist Ihnen eine nach oben zeigende vertikale Achse lieber, wechseln Sie in den Einstellungen zu [Achsen mit y nach oben](/de/elements/conventions#y-up-axes). Dabei ändert sich nur die Darstellung; das Modell und seine Dateien bleiben gleich.

## Knoten hinzufügen {#adding-nodes}

- **Per Eingabe.** Reiter *Knoten* → **Knoten hinzufügen** (die Schaltfläche mit dem **+**-Symbol) oder Rechtsklick auf die Zeichenfläche → *Knoten hinzufügen*. Geben Sie X und Z ein, auf Wunsch auch die Lager und den Lagerwinkel.
- **Per Klick.** Reiter *Knoten* → **Knoten hinzufügen** (die Schaltfläche mit dem Mauszeiger-Symbol) oder <kbd>Strg</kbd> gedrückt halten, während Sie im Menü der Zeichenfläche *Knoten hinzufügen* wählen. Jeder Klick setzt einen Knoten; mit <kbd>Esc</kbd>, **Abbrechen** oder einem erneuten Klick auf die Schaltfläche hören Sie auf.
- **Beim Zeichnen von Elementen.** Wenn Sie [Elemente mit der Maus zeichnen](/de/essentials/elements#adding-elements), entsteht bei einem Klick auf leere Zeichenfläche dort ein Knoten.
- **Durch Kopieren.** Wählen Sie Knoten (und Elemente) aus, drücken Sie <kbd>Strg</kbd>+<kbd>C</kbd>, <kbd>Strg</kbd>+<kbd>V</kbd> und klicken Sie dorthin, wo die Kopie hin soll – oder geben Sie in der eingeblendeten Leiste einen Versatz Δx, Δz ein und drücken Sie **Einfügen**.

::div{.shots}

![Der Dialog Knoten hinzufügen](/screenshots/de/qs-node.webp)

![Im Mausmodus legt die Leiste oben die Lager und den Winkel jedes gesetzten Knotens fest](/screenshots/de/nodes-add-banner.webp)

::

Neue Knoten erhalten die nächste freie Nummer, `1`, `2`, `3`, …. In der Spalte *Knoten* der Tabelle können Sie jeden umbenennen, zum Beispiel in `A`, `B`, `C`.

### Fangen {#snapping}

Ist **Am Raster ausrichten** eingeschaltet (<kbd>S</kbd> oder der Chip **S** unten rechts in der Ansicht), landen Knoten, die Sie setzen oder ziehen, auf dem Raster. Die Schrittweite beträgt standardmäßig 0,1 m, in US-Einheiten 0,5 ft; ändern können Sie sie unter [Einstellungen → Anzeigeeinstellungen → Raster](/de/essentials/units-settings#viewer-settings). Für jede andere Position tragen Sie die genauen Koordinaten in der Tabelle ein.

### Knoten auf ein bestehendes Element setzen {#placing-a-node-on-an-existing-element}

Klicken Sie beim Setzen von Knoten mit der Maus auf ein Element (oder ganz in seine Nähe), fragt EduBeam nach, was Sie meinen:

- **Mit Struktur verbinden** teilt das Element in zwei Elemente `1a` und `1b`, die im neuen Knoten zusammenhängen. So kommen Sie am schnellsten zu einem Zwischenauflager oder einem Punkt, an dem eine Last angreifen soll. Gelenke an den äußeren Enden bleiben, wo sie waren. Gleich- und Trapezlasten werden auf die beiden Hälften aufgeteilt. Einzel- und Temperaturlasten gehen alle an die erste Hälfte `1a`: Verschieben Sie in der Tabelle *Lasten* eine Einzellast, die hinter dem neuen Knoten lag, auf `1b` (ihre Position zählt jetzt vom neuen Knoten aus), und geben Sie `1b` eine eigene Temperaturlast.
- **Einzelnen Knoten platzieren** setzt den Knoten auf das Element, ohne ihn damit zu verbinden.

In beiden Fällen endet das Setzen von Knoten an dieser Stelle; klicken Sie erneut auf die Mauszeiger-Schaltfläche, um weitere zu setzen.

## Knoten bearbeiten {#editing-nodes}

| Ziel | So geht's |
| --- | --- |
| Knoten verschieben | Ziehen Sie ihn in der Ansicht (auf dem Touchscreen drücken und ziehen) oder tragen Sie X und Z in der Tabelle *Knoten* ein. Angeschlossene Elemente, ihre Lasten und Bemaßungslinien folgen. |
| Umbenennen | Geben Sie in der Spalte *Knoten* eine neue Bezeichnung ein. |
| Lager ändern | Klicken Sie auf den Knoten → **Knotenlagerung** oder nutzen Sie die Spalte *Gelagerte Freiheitsgrade*. Siehe [Lager](#supports). |
| Alles auf einmal bearbeiten | Der Stift in der Spalte *Aktionen* öffnet **Knoten bearbeiten**: Koordinaten, Lager und Lagerwinkel, mit einer Vorschau des Symbols. |
| Löschen | Das × in der Tabelle, **Löschen** im Panel des Knotens oder Knoten auswählen und <kbd>Entf</kbd> drücken. Die angeschlossenen Elemente, Lasten und Bemaßungslinien verschwinden mit. |

Jede Änderung lässt sich mit <kbd>Strg</kbd>+<kbd>Z</kbd> rückgängig machen.

## Lager {#supports}

Jeder Knoten kann sich auf drei Arten bewegen, seine **Freiheitsgrade**: `Dx` in x-Richtung, `Dz` in z-Richtung und `Ry`, eine Verdrehung in der Zeichenebene. Ein Lager **hält** einige davon.

Die acht Lager sind die acht möglichen Kombinationen dieser drei. Lesen Sie die Tabelle zeilenweise: In der mittleren Spalte kann sich der Knoten frei verdrehen, in der rechten ist zusätzlich die Verdrehung gehalten.

| Gehaltene Verschiebungen | Frei drehbar | Zusätzlich gegen Verdrehung gehalten |
| --- | --- | --- |
| **Beide** (`Dx` und `Dz`) | ![](/screenshots/b-support-pin.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Festlager** | ![](/screenshots/b-support-fixed.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Einspannung** |
| **Nur vertikal** (`Dz`): horizontal verschieblich | ![](/screenshots/b-support-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Loslager** | ![](/screenshots/b-support-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Parallelführung** |
| **Nur horizontal** (`Dx`): vertikal verschieblich | ![](/screenshots/b-support-vertical-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Vertikales Loslager** | ![](/screenshots/b-support-vertical-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Vertikale Parallelführung** |
| **Keine**: in beide Richtungen verschieblich | ![](/screenshots/b-support-free.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Frei** (kein Lager) | ![](/screenshots/b-support-rotation-only.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Nur Verdrehung gehalten** |

Für jeden gehaltenen Freiheitsgrad berechnet EduBeam eine **Auflagerreaktion**: `Dx` liefert eine horizontale Kraft $R_x$, `Dz` eine vertikale Kraft $R_z$, `Ry` ein Moment $M$. Ein Festlager hat also $R_x$ und $R_z$, ein Loslager nur $R_z$, eine Parallelführung $R_z$ und $M$ und eine Einspannung alle drei.

### Lager festlegen {#setting-a-support}

Wählen Sie das Symbol oder haken Sie die Freiheitsgrade einzeln an; beides stimmt immer überein. Sie finden beides an drei Stellen:

- im Panel des Knotens (Klick auf den Knoten) → **Knotenlagerung**, zusammen mit dem **Knoten-LKS-Winkel**, wie unten abgebildet;
- in den Dialogen **Knoten hinzufügen** und **Knoten bearbeiten**;
- in der Spalte *Gelagerte Freiheitsgrade* der Tabelle *Knoten*, wo das Symbol ein kleines Menü ist und `Dx`, `Dz`, `Ry` Kontrollkästchen sind.

![Knotenlagerung im Panel des Knotens: die Symbole, die Kontrollkästchen der Freiheitsgrade und der Lagerwinkel](/screenshots/de/nodes-support-picker.webp){.shot-lg}

Zeigen Sie auf ein Symbol, um seinen Namen zu sehen.

### Loslager oder Parallelführung? {#roller-or-slider}

Beide sitzen auf Schienen und gleiten an ihnen entlang. Der Unterschied liegt in der Verdrehung:

- Ein **Loslager** ist ein Festlager auf Schienen: Das Ende **verdreht sich frei**, dort wirkt also kein Moment.
- Eine **Parallelführung** ist eine Einspannung auf Schienen: Das Ende **kann sich nicht verdrehen**, das Lager nimmt also ein Moment auf.

Derselbe Träger, 6 m lang, unter 10 kN/m; geändert ist nur das rechte Lager. Schalten Sie zwischen Verformungsfigur und Biegemoment um:

::div{.shots}

:::model-figure{caption="Festlager und Loslager: Das rechte Ende verdreht sich frei; dort ist M = 0, an jedem Lager 30 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

:::model-figure{caption="Festlager und Parallelführung: Das rechte Ende bleibt waagerecht; dort ist M = −45 kNm, an der Parallelführung 37,5 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: slider }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

::

Der erste ist ein Einfeldträger ($M_{max} = qL^2/8 = 45\ \text{kNm}$ in Feldmitte). Unter vertikaler Last wirkt die Parallelführung genau wie eine Einspannung, der zweite ist also ein einseitig eingespannter Träger ($R_B = 5qL/8 = 37{,}5\ \text{kN}$, $M_B = -qL^2/8 = -45\ \text{kNm}$). Weil das Ende waagerecht bleibt, wird der Träger auch steifer: Die größte Durchbiegung sinkt von 9,617 mm auf 4 mm. Von einer Einspannung unterscheidet sich die Parallelführung erst, wenn etwas entlang ihrer Schiene drückt.

### Gedrehte (schräge) Lager {#inclined-skewed-supports}

Ein Lager auf einer Schräge hält den Knoten in gedrehten Achsen. Legen Sie den **Knoten-LKS-Winkel** α in Grad zwischen −180 und 180 fest: im Panel des Knotens unter *Knotenlagerung*, in den Dialogen **Knoten hinzufügen** und **Knoten bearbeiten** oder im Feld **α** der Tabelle *Knoten*.

Die Achsen des Knotens drehen sich um α, und die angehakten Freiheitsgrade wirken in diesen Achsen. α dreht x in Richtung z, auf dem Bildschirm also **im Uhrzeigersinn** (bei Achsen mit y nach oben dreht α x in Richtung y, also gegen den Uhrzeigersinn). Ein Loslager auf einer Fläche, die nach rechts um 30° abfällt, ist somit ein Loslager mit α = 30°. Das Symbol dreht sich mit den Achsen, und die Auflagerreaktion wird in diesen Achsen ausgegeben.

::model-figure{caption="Loslager in B, um α = 30° gedreht: Seine Auflagerreaktion von 34,64 kN steht senkrecht zur Schräge, und der Träger erhält N = +17,32 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [N, M]
show: [nodeLabels]
---
::

Es ist derselbe Träger wie oben, 6 m unter 10 kN/m, doch sein Loslager steht jetzt auf einer 30°-Schräge. Der vertikale Anteil der Auflagerreaktion in B beträgt weiterhin $qL/2 = 30\ \text{kN}$, die Auflagerreaktion selbst also $30/\cos 30° = 34{,}64\ \text{kN}$, und ihr horizontaler Anteil $30 \tan 30° = 17{,}32\ \text{kN}$ drückt B nach rechts. Das Festlager in A hält dagegen, deshalb steht der Träger unter Zug. Das Biegemoment ändert sich nicht.

[Knotenlasten](/de/essentials/loads#nodal-loads) an einem gedrehten Knoten lassen sich in globalen Achsen oder in den Knotenachsen angeben; eine [vorgegebene Verschiebung](/de/essentials/loads#prescribed-displacements-support-settlements) wirkt immer in den Achsen des Lagers selbst.

### Stabilität {#stability}

Ein ebenes Tragwerk braucht mindestens **drei gehaltene Freiheitsgrade**, und zwar so angeordnet, dass sie es tatsächlich festhalten. Solange Lager fehlen, zeigt die Ansicht einen blauen Chip **Lager fehlen**. Sind genug Lager vorhanden, halten sie das Tragwerk aber nicht (alle parallel oder alle mit Wirkungslinien durch einen Punkt), oder lassen Gelenke Stäbe gegeneinander drehen, benennt eine rote Meldung das Problem, und eine gestrichelte Kontur zeigt, wie sich das Tragwerk bewegt. Die [Fehlerbehebung](/de/reference/troubleshooting#messages) erklärt jede Meldung.

## Knotenlasten und Auflagersenkungen {#nodal-loads-and-settlements}

Klicken Sie auf einen Knoten → **Last hinzufügen** für eine Kraft oder ein Moment oder → **Verschiebung vorgeben**, um ein Lager um einen bestimmten Betrag zu verschieben (eine Auflagersenkung). Beides erklärt der Abschnitt [Knotenlasten](/de/essentials/loads#nodal-loads).

## Bemaßungslinien {#dimension-lines}

Bemaßungslinien beschriften Längen in der Zeichnung. Auf die Berechnung haben sie keinen Einfluss, aber sie werden mit dem Projekt gespeichert, sind in geteilten Links enthalten und erscheinen in [exportierten Bildern](/de/essentials/import-export#export-an-image).

| Ziel | So geht's |
| --- | --- |
| Bemaßung hinzufügen | Rechtsklick auf die Zeichenfläche → **Bemaßung hinzufügen**, dann auf die beiden Endpunkte klicken. Ein Punkt in der Nähe eines Knotens rastet an ihm ein. |
| Element bemaßen | Rechtsklick auf das Element → **Element … bemaßen**. |
| Bearbeiten oder umkehren | Klick auf die Linie → **Bearbeiten**, um ihre Koordinaten einzugeben, oder **Bemaßung umkehren**, um die Beschriftung auf die andere Seite zu legen. |
| Verschieben | Ziehen Sie die Linie oder einen ihrer Endpunkte. Ein Endpunkt an einem Knoten bleibt mit ihm verbunden und folgt ihm. |
