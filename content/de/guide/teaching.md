---
description: "Lehren mit EduBeam: Live-Modelle am Beamer, Links im Skript, selbst geprüfte Hausaufgaben, generierte Übungsaufgaben und druckbare Klausuren mit Lösungsblatt."
source: site
---

# Lehren mit EduBeam

[EduBeam]{.edubeam} ist in einem Hörsaal entstanden, und dort funktioniert es noch immer am besten: ein Modell am Beamer, das sofort reagiert, wenn Sie es ändern, und dasselbe Modell per Link auf dem Laptop jeder Studentin und jedes Studenten. Diese Seite fasst zusammen, was Lehrende am häufigsten nutzen, von der ersten Vorlesung bis zur Klausur.

::card-grid{cols="2"}
:::card{title="In der Vorlesung" icon="lucide:presentation" to="#in-the-lecture"}
Das Modell auch in der letzten Reihe lesbar machen und live verändern.
:::
:::card{title="In der ersten Übung" icon="lucide:graduation-cap" to="#getting-students-started"}
In zehn Minuten vom leeren Bildschirm zum von Hand geprüften Balken.
:::
:::card{title="In Skript und Übungsblatt" icon="lucide:link" to="#in-lecture-notes-and-assignments"}
Ein Link in einem PDF oder auf einer Folie öffnet das ganze Modell, auch noch nach Jahren.
:::
:::card{title="Aufgaben zur Selbstkontrolle" icon="lucide:list-checks" to="#assignments-students-can-check-themselves"}
Erst die Handrechnung, dann das Modell als Kontrolle.
:::
:::card{title="Übungsaufgaben und Klausuren" icon="lucide:file-check" to="#practice-and-test-papers"}
Generierte Aufgaben mit sofortiger Kontrolle und druckbare Klausuren mit Lösungsblatt.
:::
:::card{title="Übungsblätter und Folien aus Code" icon="lucide:dices" to="#exercise-sheets-tests-and-slides-from-code"}
Eigene Aufgabengeneratoren und Abbildungen für Folien, geschrieben mit @edubeam/plot.
:::
::

## In der Vorlesung {#in-the-lecture}

- **Auch in der letzten Reihe lesbar.** Erhöhen Sie unter **Einstellungen → Anzeigeeinstellungen** die **Schriftgröße** auf 18 oder 20 px (20 px ist das Maximum) und die **Lagergröße** auf 130–150 %. Wirken die Verläufe dann noch zu klein, erhöhen Sie die **Ergebnisskalierung**.
- **Eins nach dem anderen zeigen.** Schalten Sie in den Anzeigeoptionen oben rechts in der Ansicht alles aus außer der Größe, über die Sie gerade sprechen, und nehmen Sie die übrigen dann nacheinander hinzu.
- **Das Modell live ändern.** Verschieben Sie ein Lager, haken Sie `Ry` an, fügen Sie ein Gelenk hinzu. Die Studierenden sehen Ursache und Wirkung sofort, und <kbd>Strg</kbd>+<kbd>Z</kbd> bringt Sie zurück.
- **Den Solver Mechanismen erklären lassen.** Bauen Sie ein Gelenk zu viel ein, und EduBeam zeichnet, wie sich das Tragwerk bewegen kann, animiert die Bewegung und markiert die verantwortlichen Gelenke mit einem Kreis. Ein guter Moment, um über Stabilität zu sprechen. Beide Schalter finden Sie unter **Einstellungen → Anzeigeeinstellungen → Modellprüfung**.
- **Sprache und Achsen Ihrer Studierenden verwenden.** EduBeam spricht 18 Sprachen, und in den Einstellungen wechseln Sie passend zu Ihrem Skript zwischen SI- und US-Einheiten und zwischen der z-Achse nach unten und der y-Achse nach oben (siehe [Einheiten & Einstellungen](/de/essentials/units-settings)).

![Ein Mechanismus wird sichtbar: Die Gelenke bei B und C lassen den Rahmen seitlich ausweichen](/screenshots/de/ui-mechanism.webp)

## In der ersten Übung {#getting-students-started}

Beim ersten Besuch fragt EduBeam die Studierenden, wie sie beginnen möchten und welche Einheiten und Achsen sie verwenden wollen. Sagen Sie ihnen vorher, mit welchen Einheiten und Achsen Ihre Lehrveranstaltung arbeitet. Der Rundgang (**Rundgang starten**), die geführte Aufgabe **Ersten Balken zeichnen** und die **Beispiele** bleiben für später im Menü **☰**.

Ein guter Einstieg in die erste Übung: „Öffnen Sie run.edubeam.app und wählen Sie *Ersten Balken zeichnen*“, danach der [Schnellstart](/de/guide/quick-start), etwa zehn Minuten mit einer Handrechnung zum Schluss.

### Rechner im PC-Pool und Offline-Nutzung {#offline-and-lab-computers}

EduBeam ist eine Progressive Web App: Hat ein Browser sie einmal geladen, funktioniert sie auch ohne Verbindung weiter, und der Browser bietet unter Umständen an, sie wie ein Desktop-Programm zu installieren. Modell und Einstellungen werden je Browserprofil gespeichert. Auf gemeinsam genutzten Rechnern im PC-Pool sollten die Studierenden ihre Arbeit daher als Datei oder Link mitnehmen. Einzelheiten unter [Was in Ihrem Browser gespeichert wird](/de/essentials/units-settings#what-is-stored-in-your-browser).

## In Skript und Übungsblatt {#in-lecture-notes-and-assignments}

Ein Link enthält das ganze Modell und funktioniert daher überall, wo ein Link funktioniert: in einem PDF, auf einer Folie, auf einer Seite der Lernplattform, in einer E-Mail.

::div{.steps}

### Modell aufbauen {#share-build}

Richten Sie es so ein, wie die Studierenden es zuerst sehen sollen: mit den Lasten, Beschriftungen und Verläufen, die eingeschaltet sein sollen.

### Link kopieren {#share-copy}

Klicken Sie in der Kopfleiste auf **Modell teilen**. Schalten Sie **Zeigen, was ich sehe** ein, wenn der Link mit Ihren Verläufen, Lasten und Beschriftungen öffnen soll, und klicken Sie dann auf **Kopieren**.

### In die Unterlagen einfügen {#share-paste}

Wer den Link öffnet, erhält eine eigene Kopie zum Ausprobieren. Was die Studierenden daran ändern, erreicht weder Sie noch andere. Links funktionieren über alle EduBeam-Versionen hinweg, Ihre Unterlagen bleiben also Jahr für Jahr gültig.

::

Lassen Sie **Kürzerer Link** für Lehrmaterial ausgeschaltet: Eine im Browser gespeicherte EduBeam-Version, die älter ist als diese Option, kann die kürzere Form erst nach einem Update öffnen.

| Link | Öffnet |
| --- | --- |
| `run.edubeam.app/?model=…` | das Modell, bereit zum Bearbeiten |
| `run.edubeam.app/?viewer=1&model=…` | das Modell im [Viewer-Modus](/de/essentials/import-export#embed-a-read-only-viewer), zum Einbetten per `<iframe>` |
| `run.edubeam.app/?panel=examples` | die [Beispielgalerie](/de/examples/) |
| `run.edubeam.app/?lang=cs` | die App auf Tschechisch oder in einer [anderen Sprache](/de/essentials/import-export#url-parameters) |

::callout{type="warning" title="Ein Link ersetzt das eigene Modell der Studierenden"}
Beim Öffnen eines Links, in manchen Browsern auch beim Öffnen einer Seite mit eingebetteter Ansicht, landet das bisherige Modell unter **☰ → Zuletzt verwendete Modelle** und lässt sich von dort wiederherstellen. Bitten Sie die Studierenden trotzdem, wichtige Arbeit mit **☰ → Projekt speichern** zu sichern, bevor sie Links aus der Lehrveranstaltung öffnen.
::

## Aufgaben, die Studierende selbst prüfen können {#assignments-students-can-check-themselves}

EduBeam gibt Studierenden sofortige Rückmeldung zu ihrer Handrechnung, ohne ihnen den Lösungsweg abzunehmen.

- **Erst rechnen, dann prüfen.** Lassen Sie Auflagerreaktionen, Schnittgrößen und eine Verschiebung von Hand berechnen und die Studierenden anschließend das Modell aufbauen und vergleichen. [Ergebnisse von Hand prüfen](/de/guide/verification) enthält die Formeln, und der [Schnellstart](/de/guide/quick-start#_8-check-by-hand) zeigt den Ablauf.
- **Fragen, warum ein Ergebnis abweicht.** Schubverformung, ein fehlendes Gelenk, eine Last in lokalen statt globalen Achsen: Jede dieser Ursachen erklärt eine kleine oder große Abweichung, und wer sie findet, lernt mehr als aus der bloßen Übereinstimmung.
- **Das Modell mit der Rechnung einsammeln.** Lassen Sie zusammen mit der Rechnung einen Link oder eine `project.json` abgeben. Sie können sie öffnen und genau sehen, was modelliert wurde.
- **Berichte, die sich sehen lassen können.** Studierende können die Zeichnung als **SVG** exportieren, das in Word und LaTeX scharf bleibt, und die Ergebnisse als **CSV**. Siehe [Bild exportieren](/de/essentials/import-export#export-an-image).

## Fertige Übungen {#ready-made-exercises}

- **[Beispiele](/de/examples/):** sechs Modelle, die sich mit einem Klick öffnen, jeweils mit Fragen, Hinweisen, worauf Sie achten sollten, und den Lösungen.
- **[Übungsaufgaben](/de/practice):** generierte Balken, Rahmen und Fachwerke, die die Antworten der Studierenden prüfen, und ein [Klausurgenerator](/de/exam), der sie als Klausuren druckt. Siehe [unten](#practice-and-test-papers).
- **[Tutorials](/de/tutorials/inclined-beam):** ein geneigter Träger, ein Dreigelenkrahmen, ein ebenes Fachwerk und ein Durchlaufträger mit Auflagersenkung, jeweils Schritt für Schritt modelliert und von Hand geprüft. Sie eignen sich als Arbeitsblätter für 15 bis 20 Minuten in der Übung.
- **[Ergebnisse von Hand prüfen](/de/guide/verification):** die Fälle mit geschlossener Lösung, vom Kragträger bis zur Auflagersenkung, als kurze Kontrollaufgaben.

## Übungsaufgaben und Klausuren {#practice-and-test-papers}

Zwei Seiten dieser Website erstellen Statikaufgaben für Sie, ohne Installation und ohne Programmieren:

- **Die Seite [Übungsaufgaben](/de/practice)** gibt den Studierenden auf Wunsch jederzeit eine neue Aufgabe. Sie lösen sie auf Papier, geben die Auflagerreaktionen und das größte Biegemoment oder eine Stabkraft ein, und die Seite prüft jeden Wert gegen die exakte Lösung: Eine Abweichung bis 1 % gilt als richtig, und ein Wert mit richtigem Betrag, aber falscher Richtung wird markiert. Ein Hinweis zeigt den ersten Schritt, und die Verläufe erscheinen, sobald die Aufgabe gelöst ist. Jede Aufgabe hat einen Aufgabencode wie `H2048`, der immer dieselbe Aufgabe bezeichnet: Schreiben Sie einen Code auf ein Übungsblatt, und alle rechnen mit denselben Zahlen.
- **Der [Klausurgenerator](/de/exam)** druckt Klausuren: Wählen Sie die Tragwerksarten, bis zu 6 Aufgaben pro Klausur und bis zu 40 Varianten, und jede Studentin und jeder Student erhält eine eigene Variante. Jede Variante enthält dieselben Tragwerksarten in derselben Reihenfolge, die Klausuren sind also gleich schwer. Der Generator fügt eine Zeile für den Namen, Platz für den Rechenweg und ein Lösungsblatt hinzu, und **Drucken oder als PDF speichern** druckt alles. **.zip herunterladen** liefert jede Abbildung als SVG-Datei für LaTeX und Word und die Lösungen als CSV-Tabelle für die Korrektur.

Beide bieten dieselben acht Tragwerksarten: sechs statisch bestimmte (Einfeldträger, Kragträger, Einfeldträger mit Kragarm, Gerberträger, Dreigelenkrahmen und Warren-Fachwerk) und zwei statisch unbestimmte (Zweifeldträger und Portalrahmen).

Der Klausurgenerator speichert seine Einstellungen, auch die **Klausurnummer**, die die Zahlenwerte bestimmt, in der Adresse der Seite. Setzen Sie ein Lesezeichen, und im nächsten Jahr erhalten Sie dieselben Klausuren und dasselbe Lösungsblatt. Aufgabencodes sind auf Klausuren standardmäßig ausgeschaltet: Die Seite Übungsaufgaben zeigt die Lösung, Codes gehören also auf Hausaufgaben, bei denen die Studierenden ihre Arbeit hinterher selbst prüfen.

## Übungsblätter, Klausuren und Folien aus Code {#exercise-sheets-tests-and-slides-from-code}

Die Abbildungen auf dieser Website zeichnet die Zeichenbibliothek [@edubeam/plot](/de/plot): Vue-Komponenten, die jedes ebene Tragwerk darstellen, ob Balken, Rahmen oder Fachwerk, sobald es [@edubeam/fem](/de/solver), der Solver hinter EduBeam, berechnet hat. Wenn Sie ein wenig JavaScript schreiben können, machen Sie damit aus wenigen Codezeilen Lehrmaterial:

- **Eigene Aufgabentypen.** Wenn die Tragwerke des Klausurgenerators nicht die sind, die Sie unterrichten, schreiben Sie Ihre eigenen: Ein Seed (Startwert des Zufallsgenerators) wählt das Tragwerk und seine Zahlenwerte, derselbe Seed ergibt also immer dieselbe Aufgabe, und das Lösungsblatt entsteht aus demselben Seed.
- **Folien, die sich schrittweise aufbauen.** Zeigen Sie erst das Tragwerk, dann Lager und Lasten, dann die Auflagerreaktionen, dann den Momentenverlauf, ohne dass die Zeichnung zwischen den Schritten springt.
- **Abbildungen für Skripte und Kursseiten.** Scharfes SVG, das dem hellen oder dunklen Farbschema der Seite folgt und, anders als eine eingebettete App, das eigene Modell der Studierenden nie berührt.

Probieren Sie es aus. Jeder Klick auf **Neue Aufgabe** zeichnet eine neue Aufgabe mit Lösungsblatt:

::exercise-generator
::

::card-grid{cols="2"}
:::card{title="Übungsaufgaben und Klausuren" icon="lucide:file-check" to="/de/plot/exercises"}
Übungsblätter und ihre Lösungsblätter aus einem Seed erzeugen.
:::
:::card{title="Folien und Skripte" icon="lucide:presentation" to="/de/plot/slides"}
Abbildungen, die sich Schicht für Schicht aufbauen, für Folien und Skripte.
:::
::
