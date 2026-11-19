---
description: "Die Oberfläche von EduBeam: Kopfleiste und Menü ☰, Ansicht mit Anzeigeoptionen, Auswählen und Bearbeiten, Tabellen der unteren Leiste, Werteingabe."
source: site
---

# Benutzeroberfläche

[EduBeam]{.edubeam} besteht aus drei Bereichen: der **Kopfleiste** oben, der **Ansicht** in der Mitte, in der Sie zeichnen, und der **unteren Leiste** mit einer Tabelle für jede Objektart. Alles, was Sie in der Ansicht tun können, geht auch in den Tabellen – und umgekehrt.

![Die Bereiche der Oberfläche, nummeriert wie in der Liste unten](/screenshots/de/ui-overview.webp)

1. **Menü ☰**: öffnen, speichern, teilen und exportieren; Beispiele und geführte Touren.
2. **Modell löschen** und **Modell teilen**.
3. **Rückgängig** und **Wiederholen**.
4. **Schaltflächen der Ansicht**: zentrieren, an den Bildschirm anpassen und die Anzeigeoptionen.
5. **Anzeigeoptionen**: welche Ergebnisse und Modellteile gezeichnet werden.
6. **Raster, Fangen, Fadenkreuz und Einheiten.**
7. **Reiter der unteren Leiste**: Knoten, Elemente, Lasten, Materialien, Querschnitte, Ergebnisse.
8. **Die Tabelle** des geöffneten Reiters, in der sich jeder Wert bearbeiten lässt.

::callout{type="tip" title="Machen Sie den Rundgang"}
**☰ → Rundgang starten** zeigt Ihnen diese Bereiche direkt in der App, einen nach dem anderen.
::

## Kopfleiste {#app-bar}

- **☰** öffnet das Hauptmenü, siehe unten.
- **Modell löschen** löscht nach einer Bestätigung alle Knoten, Elemente und Lasten; mit **Materialien löschen** oder **Querschnitte löschen** entfernen Sie auch diese. <kbd>Strg</kbd>+<kbd>Z</kbd> holt das Modell zurück, außerdem bleibt es unter *Zuletzt verwendete Modelle* erhalten.
- **Modell teilen** öffnet den [Teilen-Dialog](/de/essentials/import-export#share-a-link) mit einem Link, der das ganze Modell enthält.
- **Was gibt's Neues?** zeigt die Versionshinweise. Nach einem Update öffnen sie sich auch einmal von selbst.
- **Dokumentation** öffnet diese Anleitung, das GitHub-Symbol den Quellcode.

Auf einem Smartphone passen nur ☰ und **Dokumentation** in die Leiste; **Modell löschen** und **Modell teilen** finden Sie dann im Menü.

### Das Menü ☰ {#the-☰-menu}

![Das Menü ☰](/screenshots/de/ui-app-menu.webp){.shot-xs}

- **Projekt öffnen** und **Projekt speichern** öffnen eine Datei `project.json` oder laden sie herunter (<kbd>Strg</kbd>+<kbd>O</kbd>, <kbd>Strg</kbd>+<kbd>S</kbd>).
- **Zuletzt verwendete Modelle** bewahrt die letzten 10 Modelle auf, die Sie gelöscht oder ersetzt haben, damit Sie sie wiederherstellen können.
- **Bild exportieren** speichert die Zeichnung als PNG oder SVG oder kopiert sie (<kbd>Strg</kbd>+<kbd>P</kbd>).
- **Beispiele** ist die Galerie fertiger Modelle, **Ersten Balken zeichnen** eine geführte Aufgabe in sieben Schritten und **Rundgang starten** der Rundgang durch die Oberfläche.
- **Modell teilen** und **Modell löschen** tun dasselbe wie die Schaltflächen in der Kopfleiste.

Unten im Menü stehen die App-Version und ihr Veröffentlichungsdatum. Öffnen, Speichern, Teilen und Exportieren beschreibt die Seite [Dateien, Links & Export](/de/essentials/import-export).

## Ansicht {#viewer}

Auf der Zeichenfläche zeichnen und untersuchen Sie das Modell. Die Ergebnisse werden bei jeder Änderung neu berechnet; eine Schaltfläche *Berechnen* gibt es deshalb nicht.

### Schaltflächen auf der Zeichenfläche {#buttons-on-the-canvas}

**Oben links: Rückgängig und Wiederholen** gehen durch jede Änderung am Modell zurück und wieder vor: Hinzufügen, Bearbeiten, Ziehen, Löschen und auch das Löschen des ganzen Modells (<kbd>Strg</kbd>+<kbd>Z</kbd>, <kbd>Strg</kbd>+<kbd>Umschalt</kbd>+<kbd>Z</kbd>).

**Oben rechts:**

- **Rechteckauswahl**, nur auf Geräten mit Touchscreen: Das nächste Ziehen mit dem Finger wählt ein Rechteck aus.
- **Inhalt zentrieren** rückt das Modell in die Mitte, ohne zu zoomen (<kbd>C</kbd>); **Inhalt an Bildschirm anpassen** zoomt so, dass das ganze Modell zu sehen ist (<kbd>F</kbd>).
- **⚙** blendet die [Anzeigeoptionen](#display-options) ein oder aus.

**Unten rechts:**

![Die Schaltflächen für Raster, Fangen, Fadenkreuz und Einheiten](/screenshots/de/ui-grid-units.webp){.shot-sm}

- **G** blendet Raster und Lineale ein oder aus (<kbd>G</kbd>); **S** schaltet das Fangen am Raster ein oder aus (<kbd>S</kbd>).
- Die Schaltfläche **Fadenkreuz** markiert die Position des Mauszeigers auf den Linealen (nur bei Bedienung mit der Maus).
- Der **Einheiten-Chip** öffnet die Einstellungen bei [Sprache & Region](/de/essentials/units-settings#language-locale).

### Anzeigeoptionen {#display-options}

Die Schaltfläche ⚙ öffnet zwei Reihen von Kontrollkästchen. Die erste legt fest, welche Ergebnisse über das Modell gezeichnet werden: *Verformte Form*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)* und *Auflagerreaktionen*; zu Beginn sind die Verformungsfigur, das Biegemoment und die Auflagerreaktionen eingeschaltet. Die zweite blendet Teile des Modells ein oder aus: *Lager*, *Lasten*, *Knotenbeschriftung* und *Elementbeschriftung*, zu Beginn alle eingeschaltet.

![Die Schaltflächen der Ansicht und die Anzeigeoptionen](/screenshots/de/ui-display-settings.webp){.shot-lg}

**Weitere Einstellungen** öffnet die [Anzeigeeinstellungen](/de/essentials/units-settings#viewer-settings): Größen, Farben und die Darstellung der Verläufe. Was jedes Ergebnis zeigt, erklärt die Seite [Ergebnisse & Diagramme](/de/essentials/results#overlays-in-the-viewer).

### Navigation {#navigating}

| Aktion | Maus und Tastatur | Touch |
| --- | --- | --- |
| Zoomen | Mausrad, zum Mauszeiger hin; auf dem Touchpad mit zwei Fingern auseinanderziehen oder scrollen | Zwei Finger auseinander- oder zusammenziehen |
| Verschieben | Ziehen mit der rechten Maustaste oder mit gedrücktem Mausrad; welche der beiden, legen Sie unter [Steuerung & Tastenkürzel](/de/essentials/units-settings#controls-shortcuts) fest | Ziehen mit einem Finger |
| Anpassen, zentrieren | <kbd>F</kbd>, <kbd>C</kbd> oder die Schaltflächen oben rechts | Die Schaltflächen oben rechts |

<kbd>Strg</kbd>+<kbd>+</kbd> und <kbd>Strg</kbd>+<kbd>-</kbd> vergrößern und verkleinern die Zeichnung um ihre Mitte, auf jeder Tastaturbelegung. Die ganze Oberfläche skalieren sie nie, wie es der Zoom des Browsers täte.

### Auswählen und Bearbeiten {#selecting-and-editing}

| Ziel | So geht's |
| --- | --- |
| Ein Objekt auswählen | Klicken Sie auf einen Knoten, ein Element, eine Last oder eine Bemaßungslinie. Daneben öffnet sich ein Panel mit den passenden Aktionen: Last hinzufügen, Lager festlegen, bearbeiten, Steifigkeitsmatrix anzeigen, löschen. Die untere Leiste wechselt zum zugehörigen Reiter. |
| Mehrere auswählen | Ziehen Sie auf leerer Zeichenfläche ein Rechteck auf (auf dem Touchscreen zuerst **Rechteckauswahl** antippen). Ausgewählt werden alle Knoten darin und alle Elemente, die es berührt, samt ihren Lasten und Bemaßungslinien. <kbd>Strg</kbd>+<kbd>A</kbd> wählt alles aus. |
| Löschen, kopieren, einfügen | <kbd>Entf</kbd>, <kbd>Strg</kbd>+<kbd>C</kbd>, <kbd>Strg</kbd>+<kbd>V</kbd>. Die eingefügte Kopie folgt dem Mauszeiger, bis Sie klicken; alternativ geben Sie in der eingeblendeten Leiste einen Versatz Δx, Δz ein. |
| Knoten verschieben | Ziehen Sie ihn. Mit eingeschaltetem Fangen landet er auf dem Raster; angeschlossene Elemente und Lasten folgen. |
| Last bearbeiten | Doppelklicken Sie auf sie. |
| Details sehen | Zeigen Sie mit der Maus auf ein Objekt, und ein Tooltip erscheint: bei einem Knoten seine Verschiebungen und Verdrehung, bei einem Element Material und Querschnitt, bei einer Last ihre Werte. Auf dem Touchscreen tippen Sie: Das Panel zeigt dasselbe. |
| Menü der Zeichenfläche öffnen | Rechtsklick auf die Zeichenfläche, auf dem Touchscreen gedrückt halten. |

::div{.shots}

![Das Panel eines Knotens: Last hinzufügen, Lager festlegen, Verschiebung vorgeben](/screenshots/de/ui-node-menu.webp)

![Der Tooltip eines Knotens zeigt seine Verschiebungen und seine Verdrehung](/screenshots/de/ui-hover.webp)

::

Das **Menü der Zeichenfläche** bietet *Knoten hinzufügen*, *Element hinzufügen*, *Bemaßung hinzufügen* (und über einem Element *Element … bemaßen*), dann *Bearbeiten*, *Kopieren*, *Einfügen* und *Löschen* für die aktuelle Auswahl. Halten Sie <kbd>Strg</kbd> gedrückt, während Sie *Knoten hinzufügen* oder *Element hinzufügen* wählen, um sie mit der Maus statt per Dialog zu platzieren.

![Das Menü der Zeichenfläche](/screenshots/de/ui-canvas-menu.webp){.shot-sm}

Alle Tastenkürzel und Gesten stehen auf der Seite [Tastatur, Maus & Touch](/de/reference/shortcuts).

### Wenn das Modell nicht berechnet werden kann {#when-the-model-cannot-be-solved}

Meldungen erscheinen oben links in der Ansicht:

| Meldung | Bedeutung |
| --- | --- |
| *Keine Materialien definiert.*, *Keine Querschnitte definiert.* | Legen Sie mit der Schaltfläche **Neu hinzufügen** daneben eines an. |
| Ein blauer Chip **Lager fehlen** | Das Modell ist einfach noch nicht fertig: Es braucht weitere Lager. |
| Eine rote Meldung mit **Details anzeigen** | Etwas stimmt nicht. Die Details listen jedes Problem auf, jeweils mit einem Hinweis. |
| Eine gelbe Meldung | Das Modell wurde berechnet, aber etwas erscheint ungewöhnlich, etwa ein Knoten, an den kein Element anschließt. |

Kann sich das Tragwerk noch bewegen, lässt EduBeam es als gestrichelte Kontur schwingen und markiert die verantwortlichen Knoten oder Gelenke mit einem Kreis. Zeigen Sie auf die Meldung, um die Bewegung erneut zu sehen; mit dem Augensymbol blenden Sie sie aus.

![Ein Rahmen mit Gelenken in B und C ist ein Mechanismus: EduBeam zeigt, wie er sich bewegt](/screenshots/de/ui-mechanism.webp)

Die [Fehlerbehebung](/de/reference/troubleshooting#messages) erklärt jede Meldung und was Sie dagegen tun können.

## Untere Leiste {#bottom-bar}

Sechs Reiter, jeweils mit Werkzeugleiste und editierbarer Tabelle. Die Beschriftung jedes Reiters zeigt, wie viele Objekte er enthält. Ziehen Sie die Reiterleiste nach oben oder unten, um die Höhe der Leiste zu ändern, oder klappen Sie sie mit der Schaltfläche rechts ein. Das **?** daneben erklärt den geöffneten Reiter, ebenso das **?** neben manchen Spaltenüberschriften.

| Reiter | Werkzeugleiste | Tabellenspalten |
| --- | --- | --- |
| **Knoten** | Knoten hinzufügen (Dialog), Knoten hinzufügen (Maus) | Knoten, Koordinaten, **Gelagerte Freiheitsgrade** (Lagersymbol, `Dx`, `Dz`, `Ry`, Winkel α), Lasten, Aktionen |
| **Elemente** | Element hinzufügen (Dialog), Element hinzufügen (Maus) | Element, Typ, Knoten (mit **Knotenreihenfolge tauschen**), Material, Querschnitt, **Endgelenke**, Lasten, Aktionen |
| **Lasten** | Knotenlast hinzufügen, Elementlast hinzufügen | Typ, Angriffspunkt, Komponenten, Aktionen |
| **Materialien** | Material hinzufügen, Materialbibliothek | Material, E, G, α<sub>T</sub>, Aktionen |
| **Querschnitte** | Querschnitt hinzufügen, Querschnittsbibliothek, Polygonaler Querschnitt | Form, Querschnitt, Fläche, I<sub>y</sub>, Höhe, Schubkoeffizient, Aktionen |
| **Ergebnisse** | Knotenergebnisse, Elementergebnisse, CSV exportieren, Kopieren | Verschiebungen je Knoten oder Stabendkräfte je Element; siehe [Ergebnisse](/de/essentials/results#results-tab) |

Die Reiter im Einzelnen beschreiben die Seiten [Knoten & Lager](/de/essentials/nodes-supports), [Elemente, Materialien & Querschnitte](/de/essentials/elements), [Lasten](/de/essentials/loads) und [Ergebnisse & Diagramme](/de/essentials/results#results-tab).

### Werte eingeben {#typing-values}

Alle Zahlenfelder, in den Tabellen wie in den Dialogen, funktionieren gleich:

- Sie geben Werte in den [aktuellen Einheiten](/de/essentials/units-settings#units) ein, die in der Spaltenüberschrift oder hinter dem Feld stehen.
- Dezimalpunkt und Dezimalkomma funktionieren beide: `2.5` und `2,5` sind dasselbe.
- Sie können auch Rechenausdrücke mit `+ - * / ^` und Klammern eingeben: `6/2`, `3*1.5`, `2^3` oder `(4+2)/3` werden für Sie ausgerechnet, und `1e-5` bedeutet $10^{-5}$.
- In einer Tabelle übernehmen <kbd>Enter</kbd>, <kbd>Esc</kbd>, <kbd>Tab</kbd> oder ein Klick an eine andere Stelle den Wert. <kbd>Strg</kbd>+<kbd>Z</kbd> nimmt ihn danach wieder zurück; solange Sie noch tippen, macht es nur das Getippte rückgängig.

## Reiter über der Ansicht {#tabs-above-the-viewer}

**Ansicht** zeigt die Zeichenfläche. **Einstellungen** zeigt an ihrer Stelle die [Einstellungen](/de/essentials/units-settings) in voller Größe, sodass Sie Farben oder Einheiten ändern und zurückschalten können, um die Wirkung zu sehen. Der Einheiten-Chip und *Weitere Einstellungen* öffnen dieselben Einstellungen als Dialog über dem Modell.

## Schwebende Fenster {#floating-windows}

**Steifigkeitsmatrix** (aus dem Panel eines Elements oder aus der Tabelle *Elemente*) öffnet ein Fenster mit der Steifigkeitsmatrix des Elements (6 × 6) in globalen Achsen. **Bearbeiten** im Menü der Zeichenfläche öffnet eine Tabelle der aktuellen Auswahl. Verschieben Sie ein Fenster an seiner Titelleiste und schließen Sie es mit dem ×.
