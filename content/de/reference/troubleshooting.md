---
description: "Warum EduBeam keine Ergebnisse zeigt und was hilft: alle Meldungen erklärt, unplausible Ergebnisse, Dateien und Links, die sich nicht öffnen lassen."
source: site
---

# Fehlerbehebung

Lässt sich ein Modell nicht berechnen, sagt [EduBeam]{.edubeam} in einer Meldung oben links in der Ansicht, warum, und **Details anzeigen** listet jedes Problem ausführlich auf. Wählen Sie den Titel des Dialogs, den Sie gesehen haben: Zu jeder Meldung unten steht, was sie bedeutet und wie Sie das Problem beheben.

::card-grid{cols="2"}
:::card{title="Noch nicht berechenbar" icon="lucide:circle-dashed" to="#still-needed"}
Ein blauer Chip **Lager fehlen**. Es ist nichts falsch: Das Tragwerk wird nur noch nicht gehalten.
:::
:::card{title="Modell kann nicht berechnet werden" icon="lucide:circle-x" to="#errors"}
Eine rote Meldung. Lager, die nicht halten, Gelenke, die einen Mechanismus ergeben, ein Element der Länge null.
:::
:::card{title="Warnungen zum Modell" icon="lucide:triangle-alert" to="#warnings"}
Eine gelbe Meldung. Das Modell ist berechnet, aber etwas ist wahrscheinlich nicht so, wie Sie es gemeint haben.
:::
:::card{title="Ergebnisse sehen falsch aus" icon="lucide:scale" to="#results-look-wrong"}
Lasten, die nach oben wirken, Durchbiegungen, die um Zehnerpotenzen danebenliegen, ein scheinbar vertauschtes Vorzeichen.
:::
::

## Meldungen {#messages}

### Was die Farben bedeuten {#read-the-message}

| Sie sehen | Das bedeutet |
| --- | --- |
| Einen blauen Chip **Lager fehlen** | Das Modell ist noch nicht fertig. Fügen Sie Lager hinzu. Zeigen Sie mit der Maus auf den Chip, um als gestrichelte Kontur zu sehen, wie sich das Tragwerk noch bewegen kann. |
| Eine **rote** Meldung | Etwas verhindert die Berechnung. Die Meldung benennt das Problem oder lautet bei mehreren Problemen *Fehler im Modell: n*. Die betroffenen Knoten sind in der Zeichnung eingekreist. |
| Eine **gelbe** Meldung | Warnungen. Das Modell wurde trotzdem berechnet. Bei mehreren lautet sie *Warnungen im Modell: n*. |
| *Keine Materialien definiert.* / *Keine Querschnitte definiert.* | Elemente brauchen beides. Legen Sie mit der Schaltfläche **Neu hinzufügen** neben der Meldung eines an. |

**Details anzeigen** öffnet den Dialog mit dem Titel *Noch nicht berechenbar*, *Modell kann nicht berechnet werden* oder *Warnungen zum Modell*. Sein Schalter blendet ein oder aus, wie sich das Tragwerk bewegen kann, und sein Link **Fehlerbehebung** führt hierher.

![Der Dialog Modell kann nicht berechnet werden mit dem Schalter, der zeigt, wie sich das Tragwerk bewegen kann](/screenshots/de/ui-diagnostics.webp){.shot-lg}

In der Zeichnung:

- Das **✕** an einer roten Meldung klappt sie zu einem kleinen Chip *Modell kann nicht berechnet werden* zusammen, um auf einem kleinen Bildschirm Platz zu schaffen. Ein Klick auf den Chip klappt sie wieder auf.
- Die Schaltfläche mit dem **Auge** an einer roten Meldung blendet die gestrichelte Kontur der Bewegung ein oder aus. Unter **Einstellungen → Anzeigeeinstellungen → Modellprüfung** schalten Sie die Kontur und ihre Animation dauerhaft aus.
- Das **✕** an einer gelben Meldung blendet die Warnungen aus.

### Noch erforderlich {#still-needed}

Das Modell ist nicht falsch, nur noch nicht fertig. Zeigen Sie auf den Chip, um den kurzen Text zu sehen; der Dialog zeigt den langen.

| Meldung | Bedeutung und Abhilfe |
| --- | --- |
| *Die Struktur braucht Lager, bevor sie berechnet werden kann.* <br> *Für die Stabilität in der ebenen Berechnung braucht das Modell mindestens 3 gelagerte Freiheitsgrade.* | Insgesamt weniger als drei gehaltene Richtungen. Fügen Sie Lager hinzu. |
| *Der Teil mit den Knoten … braucht Lager.* <br> *Ein separater Teil der Struktur (Knoten …) hat weniger als 3 gelagerte Freiheitsgrade und kann sich frei bewegen.* | Das Modell besteht aus mehreren Teilen, und einer davon ist frei beweglich. Verbinden Sie ihn mit dem Rest oder lagern Sie ihn. |
| *n Teile der Struktur brauchen Lager.* | Mehrere Teile sind frei beweglich. **Details anzeigen** listet sie auf. |

### Fehler {#errors}

Etwas verhindert die Berechnung. Die rote Meldung zeigt den kurzen Text, der Dialog den langen.

| Meldung | Bedeutung und Abhilfe |
| --- | --- |
| *Die Lager halten die Struktur nicht: Sie kann sich noch horizontal verschieben / vertikal verschieben / frei verdrehen / als starrer Körper bewegen.* <br> *Die Struktur hat genügend Lager, die sie aber nicht festhalten: Sie kann sich noch …* | Es gibt genügend Bindungen, aber sie sind alle parallel, oder ihre Wirkungslinien schneiden sich in einem Punkt, wie bei drei Loslagern unter einem waagerechten Balken. Die gestrichelte Kontur zeigt die Bewegung; drehen oder verschieben Sie ein Lager. |
| *Der Teil mit den Knoten … wird nicht gehalten: Er kann sich noch …* <br> *Ein separater Teil der Struktur (Knoten …) hat genügend Lager, die ihn aber nicht festhalten: Er kann sich noch …* | Dasselbe für einen Teil eines Modells, das aus mehreren Teilen besteht. |
| *Die Gelenke am Knoten … lassen die Struktur sich bewegen.* <br> *Die Lager halten die Struktur, sie ist aber trotzdem ein Mechanismus: Ihre Stäbe können sich um die Gelenke am Knoten … drehen.* | Durch die Gelenke können sich Stäbe gegeneinander verdrehen, wie bei einem Rahmen mit zwei Fußgelenken und je einem Gelenk am Kopf jeder Stütze oder bei einem Quadrat aus gelenkig verbundenen Stäben ohne Diagonale. Entfernen Sie ein Gelenk oder fügen Sie einen Stab oder ein Lager hinzu. |
| *Die Struktur ist instabil: Sie bewegt sich fast ohne Widerstand.* <br> *Die Struktur ist instabil. Praktisch ohne Widerstand beweglich: Knoten … horizontal (Dx) …* | Beinahe ein Mechanismus oder eine Steifigkeit nahe null. Die lange Meldung nennt die Knoten und Richtungen. Prüfen Sie die Lager, die Gelenke und die Werte von `E`, `A` und `Iy`. |
| *Die Struktur ist ein Mechanismus: Sie kann sich ohne Widerstand bewegen.* <br> *Die Struktur ist kinematisch: Die Steifigkeitsmatrix ist singulär.* | Etwas kann sich frei bewegen, das die Prüfungen oben nicht erkannt haben. Prüfen Sie, ob jeder Teil durch mindestens drei Bindungen gehalten wird und ob Endgelenke keinen Stab frei drehbar lassen. |
| *Element … hat die Länge null: Die Knoten … und … liegen im selben Punkt.* | Zwei Knoten eines Elements liegen übereinander. Verschieben Sie einen davon oder löschen Sie das Element. |
| *Element … referenziert an beiden Enden denselben Knoten.* | Löschen Sie das Element und zeichnen Sie es zwischen zwei verschiedenen Knoten neu. |
| *Element … referenziert den fehlenden Knoten / das fehlende Material / den fehlenden Querschnitt …* | Das verwendete Objekt wurde gelöscht, meist in einer von Hand bearbeiteten Projektdatei. Weisen Sie es in der Tabelle *Elemente* neu zu. |
| *Element … muss genau 2 Knoten referenzieren.* | Ein defektes Element in einer importierten Datei. Löschen Sie es und zeichnen Sie es neu. |
| *Knotenlast #n referenziert den fehlenden Knoten …* <br> *Vorgegebene Verschiebung #n referenziert den fehlenden Knoten …* | Löschen Sie die Last oder weisen Sie ihr einen vorhandenen Knoten zu. |
| *Elementlast #n referenziert das fehlende Element …* | Löschen Sie die Last. |
| *Die Berechnung ist wegen einer internen Inkonsistenz des Modells fehlgeschlagen.* | Ein allgemeiner Fehler. Machen Sie den letzten Schritt rückgängig, oder speichern Sie das Projekt und [melden Sie den Fehler](#reporting-a-bug). |

### Warnungen {#warnings}

Das Modell wird trotzdem berechnet, prüfen Sie aber Folgendes:

| Meldung | Bedeutung und Abhilfe |
| --- | --- |
| *Knoten … ist mit keinem Element verbunden und wird bei der Berechnung ignoriert.* | Ein verwaister Knoten. Löschen oder verbinden Sie ihn. |
| *Knoten … ist gelagert, aber mit keinem Element verbunden, daher trägt das Lager nichts.* | Ein Lager an einem verwaisten Knoten. |
| *Knotenlast #n enthält ungültige Werte.* <br> *Vorgegebene Verschiebung #n enthält ungültige Werte.* | Eine Komponente, die keine Zahl ist. Bearbeiten Sie die Last. |

### Beim Bearbeiten {#while-editing}

Diese Meldungen erscheinen während der Arbeit in einem Browser-Dialog, und das Modell bleibt unverändert:

| Meldung | Bedeutung und Abhilfe |
| --- | --- |
| *Bitte fügen Sie zuerst ein Material hinzu.* <br> *Bitte fügen Sie zuerst einen Querschnitt hinzu.* | Ein Element braucht beides. Legen Sie im Reiter *Materialien* oder *Querschnitte* eines an und zeichnen Sie das Element dann erneut. |
| *Bitte wählen Sie ein Material und einen Querschnitt aus.* | Im Dialog **Element hinzufügen** ist ein Feld leer. Wählen Sie beides aus. |
| *Die Bezeichnung … ist bereits vergeben.* | Zwei Knoten, Elemente, Materialien oder Querschnitte können nicht dieselbe Bezeichnung tragen. Wählen Sie eine andere. |
| *Für diesen Knoten ist bereits eine Verschiebung vorgegeben. Bitte entfernen Sie diese zuerst.* | Ein Knoten kann nur eine vorgegebene Verschiebung haben. Bearbeiten Sie die vorhandene oder löschen Sie sie zuerst. |

## Es wird nichts gezeichnet {#no-results-are-drawn}

Erscheint kein Verlauf, prüfen Sie in dieser Reihenfolge:

::div{.steps}

### Anzeigeoptionen prüfen {#check-the-display-options}

Gibt es überhaupt keine Meldung, ist das Modell berechnet: Der Verlauf ist vielleicht nur ausgeschaltet. Haken Sie in den Anzeigeoptionen oben rechts in der Ansicht **M<sub>y</sub>(x)** oder ein anderes Ergebnis an; die Schaltfläche ⚙ darüber blendet das Panel ein. Ein Modell ganz ohne Last hat überall Ergebnisse gleich null, dann gibt es ebenfalls nichts zu zeichnen.

### Lager prüfen {#check-the-supports}

Der Solver braucht mindestens drei gehaltene Richtungen, und zusammen müssen die Lager verhindern, dass sich das Tragwerk verschiebt oder verdreht. Ein Balken auf zwei Loslagern hat nur zwei und verschiebt sich seitlich: Machen Sie eines davon zum **Festlager**. Drei parallele Loslager oder Lager, deren Wirkungslinien sich in einem Punkt schneiden, halten das Tragwerk ebenfalls nicht. Siehe [Knoten & Lager](/de/essentials/nodes-supports#supports).

### Prüfen, ob die Elemente verbunden sind {#check-the-connections}

Zwei Knoten mit denselben Koordinaten sind trotzdem zwei getrennte Knoten, und ein Teil, der den Rest nur dort berührt, bleibt frei beweglich. Löschen Sie den überzähligen Knoten und verbinden Sie die Elemente neu. Wenn Sie einen Knoten auf ein Element setzen, antworten Sie mit **Mit Struktur verbinden**, damit das Element dort geteilt wird.

### Gelenke zählen {#count-the-hinges}

Ein Rahmen mit zwei Fußgelenken und je einem Gelenk am Kopf jeder Stütze oder ein Quadrat aus gelenkig verbundenen Stäben ohne Diagonale ist ein Mechanismus. EduBeam markiert die Gelenke mit einem Kreis und zeigt die Bewegung als animierte gestrichelte Kontur. Siehe [Endgelenke](/de/essentials/elements#end-hinges).

### Nach einer Steifigkeit von null suchen {#look-for-zero-stiffness}

Wurde `E`, `A` oder `Iy` als 0 oder in der falschen Einheit eingegeben, bewegt sich ein Teil des Tragwerks nahezu ohne Widerstand. EduBeam meldet das als *instabil*.

::

## Ergebnisse sehen falsch aus {#results-look-wrong}

| Symptom | Wahrscheinliche Ursache |
| --- | --- |
| Lasten wirken nach oben | Die globale **z-Achse zeigt nach unten**, ein positives `Fz` oder `fz` wirkt also nach unten; negative Werte zeigen nach oben. Mit der y-Achse nach oben ist es umgekehrt. Siehe [Lasten](/de/essentials/loads#sign-convention-in-one-line). |
| Durchbiegung liegt um Zehnerpotenzen daneben | Eine Einheitenverwechslung: `E` in Pa eingegeben, während das Feld MPa erwartet, oder `Iy` in cm⁴, während es m⁴ erwartet. Der Einheiten-Chip unten rechts in der Ansicht zeigt die Einheiten aller Felder. |
| Durchbiegung etwas größer als nach Lehrbuchformel | Schubverformung des Timoshenko-Balkens. Siehe [Ergebnisse von Hand prüfen](/de/guide/verification#shear-deformation). |
| Ein Vorzeichen wirkt falsch | Lesen Sie das Vorzeichen am Wert ab, nicht an der Seite, auf der der Verlauf gezeichnet ist: Ein positives M bedeutet Zug unten. Die Stabendkräfte unter *Elementergebnisse* folgen den lokalen Achsen des Elements, nicht der N-V-M-Konvention. Siehe [Das Vorzeichen ablesen](/de/essentials/results#reading-the-sign). |
| Ein Verlauf liegt auf der „falschen“ Seite | Die Seite ist eine Anzeigeeinstellung: das Biegemoment auf der Zug- oder der Druckseite, N und V auf einer der beiden Seiten der gestrichelten Linie. **Einstellungen → Anzeigeeinstellungen → Schnittgrößenverläufe**. |
| Zwei gleiche Stützen zeigen entgegengesetzte Querkraftvorzeichen | Das Vorzeichen von V folgt der Richtung jedes Elements. Tauschen Sie zum Vergleich die Knoten eines der beiden. |
| Zahlen wie `4 · 10¹` | Das wissenschaftliche Zahlenformat. Wählen Sie *Automatisch* unter **Einstellungen → Sprache & Region → Zahlenformat**. |
| Verläufe riesig oder winzig | Das betrifft nur die Zeichnung. Passen Sie die **Ergebnisskalierung** unter **Einstellungen → Anzeigeeinstellungen** an. |
| Eine Last in lokalen Achsen zeigt in die falsche Richtung | Die lokale x-Achse eines Elements verläuft von seinem *Anfangsknoten* zu seinem *Endknoten*. Tauschen Sie die Knoten oder kehren Sie das Vorzeichen um. |
| Eine Last auf einem geneigten Stab stimmt nicht | **LCS** (das lokale Koordinatensystem) ist standardmäßig angehakt, `fz` wirkt also senkrecht zum Stab. Entfernen Sie den Haken für eine vertikale Last. |
| Eine Temperaturlast bewirkt nichts | Ein statisch bestimmtes Tragwerk verformt sich unter Temperatur frei, ohne Schnittgrößen. Für eine Verformung prüfen Sie, ob α nicht 0 ist und, bei einem Temperaturunterschied, ob die Querschnittshöhe $h$ gesetzt ist. |

## Dateien und Links {#files-and-links}

| Symptom | Abhilfe |
| --- | --- |
| *Die Datei konnte nicht importiert werden. Bitte überprüfen Sie das Dateiformat.* | Die Datei ist weder ein EduBeam-Projekt noch eine Sitzung des Desktop-EduBeam. Ihr Modell bleibt unverändert. |
| *Diese EduBeam-Sitzung enthält mehrere Lastfälle, es kann aber nur einer geöffnet werden.* | Eine Sitzung des Desktop-EduBeam mit mehreren Lastfällen: EduBeam öffnet den ersten und nennt die nicht geöffneten. |
| Ein Link öffnet stattdessen Ihr altes Modell | Der Link wurde abgeschnitten oder verändert, etwa von einem E-Mail-Programm, das ihn umbricht. Einen Link, den EduBeam nicht lesen kann, ignoriert es und behält Ihr Modell. Kopieren Sie den ganzen Link noch einmal. |
| Ein kürzerer Link öffnet sich bei einer Kollegin oder einem Kollegen nicht | Die EduBeam-Version auf dem anderen Gerät ist älter als 1.3.2. Die App muss dort neu geladen werden, oder Sie teilen mit ausgeschaltetem **Kürzerer Link**. Siehe [Per Link teilen](/de/essentials/import-export#share-a-link). |

## Probleme mit der Oberfläche {#interface-issues}

| Symptom | Abhilfe |
| --- | --- |
| Tastenkürzel wirken nicht | Klicken Sie zuerst auf die Zeichnung: Einzelne Tasten werden ignoriert, solange ein Textfeld den Fokus hat. Auf einem Mac verwenden Sie <kbd>Cmd</kbd> statt <kbd>Strg</kbd>. Siehe [Tastatur, Maus & Touch](/de/reference/shortcuts). |
| <kbd>Entf</kbd> wirkt auf einem Mac nicht | Die Taste ⌫ (auf englischen Mac-Tastaturen *delete*) ist die Rücktaste. Drücken Sie <kbd>Fn</kbd>+<kbd>⌫</kbd>. |
| Verschieben nicht möglich | Verschoben wird mit der mittleren oder rechten Maustaste; welche, legen Sie unter **Einstellungen → Steuerung & Tastenkürzel** fest. Auf einem Trackpad klicken und ziehen Sie mit zwei Fingern, auf einem Touchscreen ziehen Sie mit einem Finger. |
| Mein Modell ist verschwunden | Beim Öffnen eines Links, einer Datei oder eines Beispiels und beim Löschen bleibt das alte Modell erhalten: **☰ → Zuletzt verwendete Modelle** oder <kbd>Strg</kbd>+<kbd>Z</kbd>. Ein Link meldet das beim Öffnen unten auf dem Bildschirm: *Geteiltes Modell geöffnet. Ihr vorheriges finden Sie unter „Zuletzt verwendete Modelle“.*, mit der Schaltfläche **Anzeigen**. |
| Falsche Sprache | **Einstellungen → Sprache & Region**, oder hängen Sie `?lang=de` an die Adresse an. |
| Änderungen an den Einstellungen bleiben nicht erhalten | Der lokale Speicher ist blockiert, etwa in einem privaten Fenster oder in einem strengen Datenschutzmodus. Die Einstellungen, das gespeicherte Modell und die zuletzt verwendeten Modelle brauchen ihn. |

## Fehler melden {#reporting-a-bug}

Eröffnen Sie ein [GitHub-Issue](https://github.com/janvorisek/edubeam/issues) mit Ihrem Browser und Betriebssystem, was Sie getan haben und was Sie erwartet hatten. Am hilfreichsten ist ein **Link** zum Modell oder die **Projektdatei**, die das Problem zeigt.
