---
description: "Kurze Antworten zu EduBeam: Kosten, Offline-Nutzung, Datenschutz, Genauigkeit, Rechenverfahren, Zitieren, Übungsaufgaben, Teilen und Code."
source: site
---

# Häufig gestellte Fragen

Kurze Antworten, jeweils mit einem Link auf die Seite, die das Thema ausführlich behandelt. Ihre Frage ist nicht dabei? Sehen Sie in der [Fehlerbehebung](/de/reference/troubleshooting) nach oder [fragen Sie auf GitHub](https://github.com/janvorisek/edubeam/issues).

## Allgemein {#general}

### Was ist EduBeam? {#what-is-edubeam}

Ein kostenloses Open-Source-Programm für die lineare statische Berechnung ebener Balken, Rahmen und Fachwerke, gemacht für Studierende, Lehrende sowie Ingenieurinnen und Ingenieure, die sofortige Rückmeldung wollen. Es läuft im Browser. Die [Einführung](/de/guide/introduction) zeigt, was es kann und was nicht.

### Ist es wirklich kostenlos? Brauche ich ein Konto? {#is-it-really-free-do-i-need-an-account}

Ja, es ist kostenlos, und nein, Sie brauchen kein Konto. Öffnen Sie [run.edubeam.app](https://run.edubeam.app/?lang=de){target="_blank"} und beginnen Sie zu modellieren: Es gibt nichts zu installieren und keine Nutzungsgrenze. Der Quellcode liegt unter der Lizenz GPL-3.0 auf [GitHub](https://github.com/janvorisek/edubeam).

### Welche Browser und Geräte funktionieren? {#which-browsers-and-devices-work}

Jede aktuelle Version von Chrome, Edge, Firefox oder Safari, auf dem Computer, Tablet oder Smartphone. Auf einem Touchscreen wählen Sie durch Tippen aus, ziehen einen Knoten, um ihn zu verschieben, ziehen an anderer Stelle, um die Ansicht zu verschieben, zoomen mit zwei Fingern und öffnen das Menü der Zeichenfläche durch langes Drücken. Mit Maus und Tastatur modellieren Sie trotzdem schneller. Siehe [Tastatur, Maus & Touch](/de/reference/shortcuts#touch).

### Ich habe mein Modell verloren. Kann ich es zurückholen? {#i-lost-my-model-can-i-get-it-back}

Wahrscheinlich. Wird ein Modell gelöscht oder durch einen Link, eine Datei oder ein Beispiel ersetzt, bewahrt EduBeam es unter **☰ → Zuletzt verwendete Modelle** auf (die letzten 10), und <kbd>Strg</kbd>+<kbd>Z</kbd> macht das Ersetzen rückgängig. Beides gibt es nur in diesem Browser; ein Modell von einem anderen Rechner oder aus einem anderen Browserprofil finden Sie dort also nicht. Siehe [Zuletzt verwendete Modelle](/de/essentials/import-export#recent-structures).

### Kann ich EduBeam offline nutzen? {#can-i-use-it-offline}

Ja. EduBeam ist eine Progressive Web App: Hat Ihr Browser sie einmal geladen, funktioniert sie auch ohne Verbindung weiter, und der Browser bietet unter Umständen an, sie zu installieren. Steht eine neue Version bereit, fragt ein Dialog vor dem Update.

### Wo werden meine Daten gespeichert? {#where-is-my-data-stored}

In Ihrem Browser. Es gibt keine Konten und keinen Cloud-Speicher: Die App speichert Ihr Modell und Ihre Einstellungen in diesem Browser, und ein Link zum Modell enthält das Modell selbst. Siehe [Was in Ihrem Browser gespeichert wird](/de/essentials/units-settings#what-is-stored-in-your-browser).

Die App unter run.edubeam.app erfasst allerdings Nutzungsstatistiken (Google Analytics) und Fehlerberichte (Sentry). Ein Fehlerbericht und die Aufzeichnung, die Sentry von einem Teil der Sitzungen anfertigt, können enthalten, was auf dem Bildschirm zu sehen war, also auch Ihr Modell.

### Wo kann ich Statikaufgaben üben? {#practice}

Auf der Seite [Übungsaufgaben](/de/practice). Sie erhalten dort einen Balken, einen Rahmen oder ein Fachwerk, jedes Mal mit neuen Zahlen: Berechnen Sie auf Papier die Auflagerreaktionen und das größte Biegemoment oder eine Stabkraft, geben Sie die Werte ein, und jeder Wert wird sofort geprüft. Auch die [Beispiele](/de/examples/) enthalten Fragen und Lösungen. Lehrende können mit dem [Klausurgenerator](/de/exam) für jede Studentin und jeden Studenten eine eigene Klausurvariante mit Lösungsblatt drucken; siehe [Übungsaufgaben und Klausuren](/de/guide/teaching#practice-and-test-papers).

### Wie zitiere ich EduBeam? {#cite}

Als Software, mit der Version und dem Datum, an dem Sie es verwendet haben. Die Version steht unten im Menü **☰**. Zum Beispiel:

> Voříšek, J. und Mitwirkende. *EduBeam*, Version 1.3.4 \[Software\]. https://edubeam.app (abgerufen am 18. November 2026).

Um auf ein bestimmtes Modell zu verweisen, fügen Sie seinen [Link](/de/essentials/import-export#share-a-link) hinzu: Er öffnet für alle Leserinnen und Leser dasselbe Modell.

## Modellierung {#modelling}

### Wie erzeuge ich eine Einspannung, ein Festlager oder ein Loslager? {#how-do-i-make-a-fixed-pinned-roller-support}

Klicken Sie auf den Knoten, wählen Sie **Knotenlagerung** und dann das Symbol: Festlager, Loslager, Einspannung, Parallelführung und weitere. Oder haken Sie im Reiter **Knoten** die gehaltenen Freiheitsgrade an: `Dx` + `Dz` + `Ry` ist eine Einspannung, `Dx` + `Dz` ein Festlager, `Dz` allein ein Loslager. Unter [Knoten & Lager](/de/essentials/nodes-supports#supports) sind alle Typen aufgeführt.

### Wie modelliere ich ein Fachwerk? {#how-do-i-make-a-truss}

Zeichnen Sie die Stäbe als gewöhnliche Elemente und geben Sie beide Enden jedes Stabs frei: Haken Sie im Reiter **Elemente** beide **Endgelenke** an, oder haken Sie vor dem Zeichnen der Stäbe mit der Maus im Banner **Gelenk am Anfang** und **Gelenk am Ende** an. Bringen Sie die Lasten in den Knoten auf. Das Tutorial [Ebenes Fachwerk](/de/tutorials/truss) baut ein Fachwerk Schritt für Schritt auf.

### Wie setze ich ein Gelenk in einen Rahmen? {#how-do-i-put-a-hinge-in-a-frame}

Geben Sie das Moment an dem Elementende frei, das sich frei drehen soll: Haken Sie das zugehörige Endgelenk im Reiter **Elemente** an. Ein Gelenk gehört zu einem Elementende. Treffen sich in einem Knoten mehrere Elemente und geben Sie nur eines davon frei, bleiben die übrigen biegesteif verbunden. Siehe [Endgelenke](/de/essentials/elements#end-hinges).

### Wie füge ich ein Lager oder eine Einzellast mitten im Balken ein? {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

Für ein Lager setzen Sie mit der Maus einen Knoten auf den Balken (die Schaltfläche **Knoten hinzufügen** mit dem Mauszeiger-Symbol) und wählen **Mit Struktur verbinden**: Der Balken wird an diesem Knoten geteilt, und Sie können ihn dort lagern. Eine Einzellast braucht keinen Knoten: Bringen Sie auf das Element eine **Einzellast** auf und geben Sie ihre Position ab dem Anfangsknoten an. Siehe [Knoten auf ein bestehendes Element setzen](/de/essentials/nodes-supports#placing-a-node-on-an-existing-element) und [Einzellast](/de/essentials/loads#concentrated-load).

### Kann ich Eigengewicht ansetzen? {#can-i-apply-self-weight}

Nicht automatisch: Die Dichte des Materials geht in die statische Berechnung nicht ein. Setzen Sie das Eigengewicht als Gleichlast $f_z = \rho g A$ an, für einen IPE 200 zum Beispiel $7850 \cdot 9{,}81 \cdot 28{,}48 \cdot 10^{-4} = 219$ N/m, also 0,22 kN/m.

### Kann ich schräge Lager modellieren? {#can-i-model-inclined-supports}

Ja. Geben Sie dem Knoten einen **Knoten-LKS-Winkel**; seine Lager wirken dann in Richtung der gedrehten Achsen. Siehe [Schräge Lager](/de/essentials/nodes-supports#inclined-skewed-supports).

### Kann ich mit US-Einheiten arbeiten? {#can-i-work-in-us-customary-units}

Ja. Klicken Sie auf den Einheiten-Chip unten rechts in der Ansicht, der **Einstellungen → Sprache & Region** öffnet, und stellen Sie **Einheitensystem** für Fuß und Kips auf **US-amerikanisch (imperial)**, oder wählen Sie jede Einheit einzeln. Das Modell wird in SI gespeichert; ein Wechsel der Einheiten rechnet also nur die Anzeige um und ändert nie das Modell. Siehe [Einheiten & Einstellungen](/de/essentials/units-settings).

### Gibt es Lastfälle oder Kombinationen? {#are-there-load-cases-or-combinations}

Nein, ein Modell hat einen Lastfall. Speichern Sie jeden Lastfall als eigene Datei oder eigenen Link und kombinieren Sie die Ergebnisse selbst. Eine Sitzung aus dem Desktop-EduBeam mit mehreren Lastfällen öffnet sich mit dem ersten, und eine Meldung nennt die nicht geöffneten.

### Warum zeigen meine Lasten nach oben? {#why-do-my-loads-point-up}

Wahrscheinlich, weil Sie einen negativen Wert eingegeben haben. In EduBeam zeigt die globale z-Achse **nach unten**, ein positives `fz` oder `Fz` wirkt also nach unten, in Richtung der Schwerkraft: 12 kN/m nach unten ist `fz = 12`. Siehe [Koordinatensystem & Vorzeichenkonventionen](/de/elements/conventions#loads). Arbeitet Ihre Lehrveranstaltung mit einer nach oben zeigenden vertikalen Achse, wählen Sie unter **Einstellungen → Sprache & Region → Koordinatensystem** die Option **x nach rechts, y nach oben**: Eingaben und Ergebnisse folgen dann dieser Achse.

## Ergebnisse {#results}

### Warum gibt es keine Schaltfläche „Berechnen“? {#why-is-there-no-solve-button}

Weil das Modell nach jeder Änderung neu berechnet wird. Erscheinen keine Ergebnisse, lässt sich das Modell noch nicht berechnen, und eine Meldung auf der Zeichenfläche sagt, warum. Die [Fehlerbehebung](/de/reference/troubleshooting#no-results-are-drawn) listet auf, was zu prüfen ist.

### Warum weicht meine Durchbiegung leicht von der Formel ab? {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam verwendet Timoshenko-Balkenelemente; eine Durchbiegung enthält also die Schubverformung, die Lehrbuchformeln meist weglassen. Bei einem schlanken Balken liegt der Unterschied bei etwa 1 %, und der [Schnellstart](/de/guide/quick-start#_8-check-by-hand) rechnet ihn von Hand nach. In einem statisch unbestimmten Tragwerk verschiebt die Schubsteifigkeit auch die Schnittgrößen leicht. Mehr unter [Ergebnisse von Hand prüfen](/de/guide/verification).

### Wie genau sind die Ergebnisse? Brauche ich mehr Elemente? {#how-accurate-are-the-results-do-i-need-more-elements}

In der linearen Statik ist das Balkenelement für jede Lastart, die EduBeam anbietet, exakt. Ein Element je Stab genügt also, und es gibt kein Netz zu verfeinern. Zusätzliche Knoten brauchen Sie nur dort, wo Sie ein Lager, ein Gelenk, einen Querschnittswechsel, eine Knotenlast oder eine abzulesende Verschiebung haben. Siehe [Genauigkeit](/de/essentials/results#precision-and-accuracy).

### Wie berechnet EduBeam die Ergebnisse? {#how-does-edubeam-compute-the-results}

Mit dem Weggrößenverfahren der Finite-Elemente-Methode, wie es in der Baustatik gelehrt wird, direkt in Ihrem Browser. [Wie EduBeam ein Modell berechnet](/de/elements/analysis) geht jeden Schritt an einem kleinen Beispiel durch, das Sie von Hand nachrechnen können, und der Solver selbst ist als [@edubeam/fem](/de/solver) Open Source.

### Kann ich die Steifigkeitsmatrizen sehen? {#can-i-see-the-stiffness-matrices}

Ja. Im Reiter **Elemente** öffnet die Matrix-Schaltfläche in der Zeile eines Elements seine 6 × 6-Steifigkeitsmatrix in globalen Achsen und SI-Einheiten (N, m). Auch ein Klick auf ein Element in der Ansicht bietet **Steifigkeitsmatrix** an. Die Seite [Balkenelement](/de/elements/beam#global-stiffness-matrix) leitet sie her.

### Wo stehen die Auflagerreaktionen? {#where-are-the-reactions-listed}

In der Ansicht, als Pfeile mit ihren Werten: **Auflagerreaktionen** in den Anzeigeoptionen, standardmäßig eingeschaltet. Sie stehen auch in der Datei aus **Ergebnisse → CSV exportieren** und in dem, was **Kopieren** in die Zwischenablage legt. Der Reiter **Ergebnisse** listet Knotenverschiebungen und Stabendkräfte auf. Siehe [Ergebnisse & Diagramme](/de/essentials/results).

## Dateien & Teilen {#files-sharing}

### Wie teile ich ein Modell? {#how-do-i-share-a-model}

Klicken Sie auf **Modell teilen** und dann auf **Kopieren**. Der Link enthält das ganze Modell, und wer ihn öffnet, erhält eine eigene Kopie zum Bearbeiten: Eine Live-Zusammenarbeit gibt es nicht. Schalten Sie **Zeigen, was ich sehe** ein, damit der Link mit Ihren Verläufen und Beschriftungen öffnet. Siehe [Per Link teilen](/de/essentials/import-export#share-a-link) und, für Lehrveranstaltungen, [Lehren mit EduBeam](/de/guide/teaching#in-lecture-notes-and-assignments).

### Kann ich ein Modell in meine Website oder in Folien einbetten? {#can-i-embed-a-model-on-my-website-or-in-slides}

Ja. Hängen Sie `&viewer=1` an einen Link an und setzen Sie ihn in einen `<iframe>`: siehe [Viewer einbetten](/de/essentials/import-export#embed-a-read-only-viewer). Für eine statische Abbildung auf einer Website, einer Folie oder in gedruckten Unterlagen exportieren Sie ein SVG oder zeichnen es per Code mit [@edubeam/plot](/de/plot).

### Kann ich Bilder oder Tabellen exportieren? {#can-i-export-images-or-tables}

Ja. **☰ → Bild exportieren** (<kbd>Strg</kbd>+<kbd>P</kbd>) speichert die Zeichnung als PNG oder SVG in der Größe oder dem Maßstab Ihrer Wahl. **Ergebnisse → CSV exportieren** speichert beide Ergebnistabellen, und **Kopieren** legt sie für eine Tabellenkalkulation in die Zwischenablage. Siehe [Bild exportieren](/de/essentials/import-export#export-an-image).

### Kann ich Dateien aus dem Desktop-EduBeam öffnen? {#can-i-open-files-from-the-desktop-edubeam}

Ja. Sitzungen, die mit dem Desktop-EduBeam 2.x bis 3.5 gespeichert wurden (`.xml`), öffnen Sie mit **☰ → Projekt öffnen** oder indem Sie sie auf die App ziehen, genau wie eine `project.json`. Ihre Werte werden als kN, kPa und m interpretiert. Siehe [Projekt öffnen](/de/essentials/import-export#open-a-project).

### Kann ich Modelle per Programm erzeugen? {#can-i-generate-models-programmatically}

Ja, auf zwei Wegen:

- **Die Datei schreiben.** Eine `project.json` ist einfaches JSON in SI-Einheiten, ein Skript in jeder Sprache kann sie also schreiben, und EduBeam öffnet sie mit **Projekt öffnen** oder per Drag & Drop. Siehe [Format der Projektdatei](/de/essentials/import-export#project-file-format).
- **Im Code berechnen.** [@edubeam/fem](/de/solver) ist der Finite-Elemente-Solver hinter EduBeam, als Bibliothek für JavaScript und TypeScript. [@edubeam/plot](/de/plot) zeichnet dann das Ergebnis, zum Beispiel als [generiertes Übungsblatt](/de/plot/exercises).

Der Träger aus dem [Schnellstart](/de/guide/quick-start) in SI-Einheiten:

```ts
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial('steel', { e: 210e9, g: 81e9 }) // Pa
const section = { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 } // m², m⁴, m
domain.createCrossSection('IPE200', section)
domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]) // pin
domain.createNode('2', [6, 0, 0], [DofID.Dz]) // roller
const beam = domain.createBeam2D('1', ['1', '2'], 'steel', 'IPE200')
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad('1', [0, 12e3], true) // 12 kN/m, downward

solver.solve()
beam.computeBendingMomentAt(lc, 3) // 54000 N·m at mid-span
beam.computeLocalDefl(lc, 2).w[1] // 0.0502 m at mid-span
```

## Hilfe {#support}

### Wie melde ich einen Fehler oder schlage eine Funktion vor? {#how-do-i-report-a-bug-or-request-a-feature}

Eröffnen Sie ein Issue auf [GitHub](https://github.com/janvorisek/edubeam/issues) und hängen Sie einen Link oder eine Projektdatei an, die das Problem zeigt. Für Fragen, die nicht öffentlich sein sollen, schreiben Sie an [support@edubeam.app](mailto:support@edubeam.app).
