---
description: "EduBeam-Projekte speichern und öffnen, Desktop-Sitzungen laden, Links teilen, Viewer einbetten, URL-Parameter, Bild- und Tabellenexport. Alles bleibt im Browser."
source: site
---

# Dateien, Links & Export

Speichern Sie Ihr Modell als Datei, verschicken Sie es als Link, betten Sie es in eine Webseite ein oder exportieren Sie ein Bild oder eine Tabelle davon. Alles in [EduBeam]{.edubeam} geschieht in Ihrem Browser, und nichts wird hochgeladen: Ein Link enthält buchstäblich das Modell.

::card-grid{cols="3"}
:::card{title="Projektdatei" icon="lucide:file-json" to="#save-a-project"}
`project.json` zum Aufbewahren, Abgeben oder späteren Öffnen.
:::
:::card{title="Link" icon="lucide:link" to="#share-a-link"}
Das ganze Modell in einer URL, für Skripte, Folien und Nachrichten.
:::
:::card{title="Bild oder Tabelle" icon="lucide:image" to="#export-an-image"}
PNG oder SVG für Berichte, CSV für Tabellenkalkulationen.
:::
::

## Projekt speichern {#save-a-project}

**☰ → Projekt speichern** oder <kbd>Strg</kbd>+<kbd>S</kbd> (auf dem Mac <kbd>⌘</kbd>+<kbd>S</kbd>, wie bei allen Tastenkürzeln auf dieser Seite) lädt `project.json` herunter. Die Datei enthält die Knoten, Elemente, Materialien, Querschnitte (mit gezeichneten Formen), Lasten, Bemaßungslinien und die Version der App, die sie geschrieben hat. Sie können die Datei beliebig umbenennen.

## Projekt öffnen {#open-a-project}

**☰ → Projekt öffnen** oder <kbd>Strg</kbd>+<kbd>O</kbd> und dann die Datei wählen – oder **die Datei an eine beliebige Stelle des App-Fensters ziehen**. EduBeam öffnet:

- Dateien `project.json` aus allen Versionen von EduBeam;
- Sitzungen im Format `.xml` aus dem **ursprünglichen Desktop-EduBeam** 2.x bis 3.5. Ihre Werte haben keine Einheiten, deshalb werden sie als kN, kPa und m gelesen, die Einheiten aus dessen Handbuch. EduBeam öffnet jeweils einen Lastfall: Bei einer Sitzung mit mehreren Lastfällen öffnet es den ersten und nennt die, die es ausgelassen hat.

Das Öffnen ersetzt das aktuelle Modell, einschließlich seiner Materialien und Querschnitte. Ihr bisheriges Modell geht dabei nicht verloren: <kbd>Strg</kbd>+<kbd>Z</kbd> holt es zurück, und es bleibt unter [Zuletzt verwendete Modelle](#recent-structures) erhalten. Eine Datei, die EduBeam nicht lesen kann, wird mit einer Meldung abgelehnt, und Ihr Modell bleibt, wie es war.

## Per Link teilen {#share-a-link}

**Modell teilen**, in der Kopfleiste oder im Menü ☰, öffnet den Dialog *Modell per URL teilen*:

![Der Dialog Modell per URL teilen](/screenshots/de/c1-share.webp){.shot-lg}

- **Kopieren** oder ein Klick an eine beliebige Stelle im Feld kopiert den Link.
- **Link öffnen** öffnet ihn in einem neuen Tab, sodass Sie sehen, was die Empfängerin oder der Empfänger sehen wird.
- **Über Systemdialog teilen** übergibt den Link an die Teilen-Funktion Ihres Geräts, sofern der Browser das unterstützt.
- **Kürzerer Link** (standardmäßig eingeschaltet) schreibt dasselbe Modell in etwa der Hälfte der Zeichen. EduBeam-Versionen vor 1.3.2 (November 2026) können ihn erst nach einem Update lesen; schalten Sie die Option also aus, wenn ein Link sofort überall funktionieren muss.
- **Zeigen, was ich sehe** (standardmäßig ausgeschaltet) lässt den Link mit den Verläufen, Lasten und Beschriftungen öffnen, die Sie eingeschaltet haben, statt mit den eigenen Anzeigeoptionen der Empfangenden.

Der Link hat die Form `https://run.edubeam.app/?model=…` und kodiert das gesamte Modell. Wer ihn öffnet, erhält eine eigene Kopie zum Bearbeiten; Änderungen werden **nicht** zurückübertragen, schicken Sie also einen neuen Link, wenn sich das Modell ändert. Sehr große Modelle ergeben sehr lange Links; teilen Sie dann besser die Projektdatei.

Öffnet jemand einen Link, landet das bisherige Modell unter *Zuletzt verwendete Modelle*, und eine Meldung sagt, wo es zu finden ist. Links verfallen nie: Ein Link im Vorlesungsskript vom letzten Jahr öffnet heute dasselbe Modell.

## Viewer einbetten {#embed-a-read-only-viewer}

Hängen Sie `&viewer=1` an einen Link an, um das Modell im **Viewer-Modus** zu öffnen: Kopfleiste, untere Leiste, Rückgängig und Wiederholen, die Chips für Raster und Einheiten und das Fadenkreuz sind ausgeblendet; es bleiben die Zeichnung, die Schaltflächen zum Anpassen und Zentrieren und die Anzeigeoptionen. Auch der Willkommensdialog und die Versionshinweise öffnen sich nicht. Setzen Sie diese URL in einen `<iframe>`, um ein interaktives, zoombares Modell in Vorlesungsunterlagen, eine Kursseite oder eine Folie einzubetten:

```html
<iframe
  src="https://run.edubeam.app/?viewer=1&show=MRLS&model=…"
  width="100%"
  height="400"
></iframe>
```

![Der Dreigelenkrahmen im Viewer-Modus](/screenshots/de/viewer-mode.webp){.shot-lg}

Der Viewer-Modus ist zum Anschauen gedacht, aber nicht gesperrt: Besucherinnen und Besucher können weiterhin Knoten ziehen und Verläufe umschalten. Für sich allein geöffnet, ersetzt ein Viewer-Link wie jeder Link das eigene Modell der Besuchenden, das dann unter *Zuletzt verwendete Modelle* wartet. In eine Seite einer anderen Website eingebettet, geben die meisten aktuellen Browser dem Frame einen eigenen Speicher, sodass das Modell der Besuchenden unberührt bleibt – aber nicht jeder Browser tut das.

Für eine Abbildung, die die App gar nicht braucht, etwa einen statischen Verlauf auf einer Webseite, einer Folie oder einem Übungsblatt, zeichnet die Zeichenbibliothek [`@edubeam/plot`](/de/plot) Tragwerke und ihre Verläufe aus Code. Die interaktiven Abbildungen auf dieser Website sind damit gezeichnet.

## URL-Parameter {#url-parameters}

| Parameter | Wirkung |
| --- | --- |
| `model=<data>` | Lädt das kodierte Modell und passt es an den Bildschirm an. Wird von **Modell teilen** geschrieben. |
| `viewer=1` | [Viewer-Modus](#embed-a-read-only-viewer). |
| `show=<letters>` | Öffnet mit genau diesen eingeschalteten Ebenen, je ein Buchstabe: `N` Normalkraft, `V` Querkraft, `M` Biegemoment, `U` Verformungsfigur, `R` Auflagerreaktionen, `L` Lasten, `S` Lager, `n` Knotenbeschriftung, `e` Elementbeschriftung. `show=MRLS` zeigt Biegemoment, Auflagerreaktionen, Lasten und Lager. Wird von **Zeigen, was ich sehe** geschrieben. |
| `lang=<code>` | Schaltet die Sprache der Oberfläche um: `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn` (Chinesisch), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`. |
| `panel=examples` | Öffnet sofort die Beispielgalerie. |

Parameter werden mit `&` verknüpft, etwa `?lang=de&viewer=1&model=…`. Sobald EduBeam sie gelesen hat, entfernt es sie aus der Adresszeile. `lang` und `show` bleiben als Einstellungen der Besuchenden erhalten, so als hätten sie sie selbst in der App gewählt.

## Bild exportieren {#export-an-image}

**☰ → Bild exportieren** oder <kbd>Strg</kbd>+<kbd>P</kbd> öffnet den Bildexport. Die Zeichnung wird für die gewählte Größe neu aufgebaut, sodass Linien und Beschriftungen ihre tatsächliche Stärke behalten.

![Bild exportieren: Ebenen, Ausschnitt und Größe wählen, dann herunterladen oder kopieren](/screenshots/de/export-image.webp)

::div{.steps}

### Ebenen wählen {#choose-the-layers}

Die Chips oben bestimmen, was gezeichnet wird: Verformungsfigur, N, V, M und Auflagerreaktionen, dann Lager, Lasten, Knotenbeschriftung und Elementbeschriftung. Sie übernehmen zunächst die Anzeigeoptionen der Ansicht, und Änderungen hier lassen die Ansicht unverändert.

### Ausschnitt festlegen {#frame-the-drawing}

Wählen Sie ein Seitenverhältnis (16:9, 4:3, 3:2 oder 1:1), **Alles einpassen** oder **Ausschnitt…**, um ein Rechteck über die Zeichnung zu ziehen. Sie können auch die Ränder der Vorschau ziehen.

### Größe einstellen {#set-the-size}

Breite und Höhe in Pixeln oder ein **Maßstab** wie 1 : 50 für eine maßstäbliche Zeichnung auf Papier (bei 96 DPI). **Diagrammhöhe** legt die Größe der Ergebnisverläufe fest, und **Transparenter Hintergrund** lässt das Weiß weg. Passen die Verläufe oder Beschriftungen nicht hinein, sagt der Dialog das und bietet an, die Verläufe zu verkleinern oder die Zeichenfläche zu vergrößern.

### Speichern {#save-it}

**PNG herunterladen**, **SVG herunterladen** oder, wo der Browser es erlaubt, **In Zwischenablage kopieren**. Die Dateien werden nach ihrer Größe benannt, etwa `edubeam-512x512.svg`. Auf einem hochauflösenden Bildschirm hat das PNG mehr Pixel als die eingestellte Breite und Höhe, im Verhältnis zur Pixeldichte des Bildschirms, damit es so scharf ist wie die App; seine Größe in Pixeln steht neben den Schaltflächen.

::

SVG bleibt in jeder Größe scharf und funktioniert in Word, Inkscape und LaTeX auf Overleaf; damit ist es die beste Wahl für Berichte und Abschlussarbeiten. Dieselbe Größe rahmt das Tragwerk immer gleich ein, sodass nacheinander exportierte Bilder von N, V und M nebeneinander genau zusammenpassen.

Um solche Abbildungen aus Code zu erzeugen, zum Beispiel eine für jede Aufgabe eines Übungsblatts, schreibt `@edubeam/plot` [eine eigenständige SVG-Datei](/de/plot/functions#a-standalone-svg-file), die sich in denselben Programmen öffnen lässt.

## Ergebnisse exportieren {#export-the-results}

**CSV exportieren** im Reiter **Ergebnisse** lädt beide Ergebnistabellen herunter, einschließlich der Auflagerreaktionen, und **Kopieren** legt sie für eine Tabellenkalkulation in die Zwischenablage. Siehe [CSV exportieren und Kopieren](/de/essentials/results#export-csv-and-copy).

## Zuletzt verwendete Modelle {#recent-structures}

**☰ → Zuletzt verwendete Modelle** bewahrt die letzten 10 Modelle auf, die gelöscht oder durch einen Link, eine Datei, ein Beispiel, die geführte Aufgabe *Ersten Balken zeichnen* oder eine andere Wiederherstellung ersetzt wurden. Jeder Eintrag zeigt ein Vorschaubild, wodurch das Modell ersetzt wurde, und die Anzahl seiner Knoten und Elemente. **Wiederherstellen** holt ein Modell zurück: Das Modell, das Sie gerade hatten, kommt dann seinerseits in die Liste, und <kbd>Strg</kbd>+<kbd>Z</kbd> macht die Wiederherstellung rückgängig. **Entfernen** löscht einen Eintrag.

![Zuletzt verwendete Modelle](/screenshots/de/recent.webp){.shot-lg}

Die Liste wird nur in diesem Browser gespeichert.

## Beispiele {#examples}

**☰ → Beispiele** öffnet eine Galerie fertiger Lehrmodelle. Das Öffnen eines Beispiels ersetzt Ihr Modell, und <kbd>Strg</kbd>+<kbd>Z</kbd> holt Ihres zurück. Dieselben Modelle finden Sie mit Übungen auf der Seite [Beispiele](/de/examples/) dieser Anleitung.

![Die Beispielgalerie](/screenshots/de/examples.webp){.shot-lg}

## Automatisches Speichern {#automatic-persistence}

Ihr Modell und Ihre Einstellungen werden nach jeder Änderung im lokalen Speicher des Browsers abgelegt und wiederhergestellt, wenn Sie zurückkommen, auch nach dem Schließen des Browsers. Das ist eine Annehmlichkeit, keine Sicherung: Der Speicher gehört zu einem Browserprofil auf einem Gerät, ein privates Fenster vergisst ihn, und das Löschen der Websitedaten entfernt ihn. Speichern Sie wichtige Arbeit als Projektdatei. Der Abschnitt [Was in Ihrem Browser gespeichert wird](/de/essentials/units-settings#what-is-stored-in-your-browser) zählt alles auf.

## Format der Projektdatei {#project-file-format}

`project.json` ist einfaches, lesbares JSON. Das hier ist der Träger aus dem [Schnellstart](/de/guide/quick-start), mit dem Stahl und dem IPE 200 aus den Bibliotheken:

```json [project.json]
{
  "edubeam": true,
  "version": "1.3.4",
  "domain": {
    "materials": [
      {
        "label": "Steel (S235)",
        "d": 7850,
        "e": 210000000000,
        "g": 81000000000,
        "alpha": 0.000012
      }
    ],
    "crossSections": [
      {
        "label": "IPE 200 (approx)",
        "a": 0.002848,
        "iy": 0.00001943,
        "h": 0.2,
        "k": 0.3932584269662922
      }
    ],
    "nodes": [
      { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] },
      { "label": "2", "coords": [6, 0, 0], "bcs": [2] }
    ],
    "elements": [
      {
        "label": "1",
        "nodes": ["1", "2"],
        "mat": "Steel (S235)",
        "cs": "IPE 200 (approx)",
        "hinges": [false, false]
      }
    ],
    "loadCases": [
      {
        "label": "DefaultLC",
        "nodalLoads": [],
        "elementLoads": [
          { "type": "udl", "target": "1", "lcs": true, "values": [0, 12000] }
        ],
        "prescribedBC": []
      }
    ]
  },
  "dimensions": []
}
```

Alle Werte stehen in **SI-Einheiten** (m, N, Pa, rad), gleich welche Einheiten die App anzeigt. Koordinaten sind `[x, y, z]` mit $y = 0$ und nach unten zeigendem $z$. Lager und Lastkomponenten verwenden die Freiheitsgrad-IDs `0 = Dx`, `2 = Dz`, `4 = Ry`.

| Elementlast `type` | Werte |
| --- | --- |
| `udl` | `values: [fx, fz]` in N/m |
| `trapezoidal` | `startValues: [f1x, f1z]`, `endValues: [f2x, f2z]` in N/m |
| `concentrated` | `values: [Fx, Fz, My, a]` in N, N·m und m ab dem Anfangsknoten |
| `temperature` | `values: [ΔTc, ΔTb, ΔTt]` in K; der Temperaturunterschied ist ΔTb − ΔTt |

`lcs: true` oder gar kein `lcs` legt eine Elementlast in die lokalen Achsen des Elements, `false` in die globalen. Die übrigen Einträge:

- **Knotenlasten**: `{ "target": "2", "values": { "0": Fx, "2": Fz, "4": My } }`, dazu `"lcs": true` für eine Last in den Achsen eines gedrehten Lagers.
- **Vorgegebene Verschiebungen**: `{ "target": "2", "prescribedValues": { "0": Dx, "2": Dz, "4": Ry } }`; eine weggelassene Komponente ist 0.
- Von der App geschriebene Dateien enthalten außerdem ein `date`, einen `commit`, die Achsen gedrehter Lager (`lcs` an einem Knoten) und gezeichnete Querschnittsformen `shape`.

Weil das Format einfach ist, können Sie Modelle mit einem Skript oder einer Tabellenkalkulation schreiben und mit **Projekt öffnen** laden. Um Modelle ganz in Code aufzubauen und zu berechnen, nutzen Sie die Solver-Bibliothek [`@edubeam/fem`](/de/solver), auf der die App aufbaut.
