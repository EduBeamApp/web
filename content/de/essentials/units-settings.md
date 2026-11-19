---
description: "Einstellungen in EduBeam: Sprache, SI- oder US-Einheiten, Zahlenformat, z nach unten oder y nach oben, Raster, Verläufe, Farben und was im Browser bleibt."
source: site
---

# Einheiten & Einstellungen

Wählen Sie die Sprache, die Einheiten und die Achsen, mit denen Sie arbeiten, und wie die Zeichnung aussieht. Die Einstellungen ändern nur, wie das Modell angezeigt und eingegeben wird: Das Modell selbst wird immer in SI-Einheiten und mit nach unten zeigender z-Achse gespeichert, ein Projekt oder Link öffnet sich also bei allen Einstellungen gleich.

Es gibt drei Wege zu den Einstellungen:

- Der Reiter **Einstellungen** über der Ansicht zeigt sie in voller Größe anstelle des Modells, bei *Sprache & Region*; der Reiter **Ansicht** bringt Sie zurück.
- Der **Einheiten-Chip** unten rechts in der Ansicht (`m m² kN kNm MPa`) öffnet sie als Dialog bei *Sprache & Region*.
- **Weitere Einstellungen** unter den [Anzeigeoptionen](/de/essentials/user-interface#display-options) öffnet den Dialog bei *Anzeigeeinstellungen*.

Die Einstellungen werden in Ihrem Browser gespeichert und überstehen ein Neuladen. **Einstellungen zurücksetzen** unter der Liste der Seiten stellt die Standardwerte wieder her: Zahlenformat, Achsen, Maustaste zum Verschieben, die Einheiten Ihrer Region sowie alle Anzeigeeinstellungen und Anzeigeoptionen. Ihre Sprache bleibt erhalten. Das Zurücksetzen lässt sich nicht rückgängig machen.

## Sprache & Region {#language-locale}

![Einstellungen → Sprache & Region](/screenshots/de/settings-language.webp)

**Sprache.** 18 Sprachen; beim ersten Besuch richtet sich EduBeam nach Ihrem Browser. Das Dezimaltrennzeichen folgt der Sprache. Ein Link kann die Sprache für die Lesenden festlegen: Hängen Sie `?lang=` mit einem der Codes `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn` (Chinesisch), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko` an.

**Zahlenformat.** Wie Ergebniswerte in den Tabellen und Tooltips geschrieben werden: *Wissenschaftlich* (1,5 · 10⁴, Standard), *Technisch* (15 · 10³) oder *Automatisch*. Siehe [Zahlenformat](/de/essentials/results#number-format).

**Koordinatensystem.** *x nach rechts, z nach unten* (Standard) oder *x nach rechts, y nach oben*. Bei *x nach rechts, y nach oben* heißt die vertikale Achse y und zeigt nach oben, und Momente beziehen sich auf die z-Achse. Vertikale Koordinaten, Kräfte, Verschiebungen, Auflagerreaktionen und Lagerwinkel wechseln das Vorzeichen, und alle Eingaben, Tabellen, Tooltips und Exporte verwenden die neuen Bezeichnungen. Das Modell, die Zeichnung und gespeicherte Dateien bleiben genau gleich. Siehe [Achsen mit y nach oben](/de/elements/conventions#y-up-axes).

![Der Dreigelenkrahmen mit Achsen mit y nach oben: Der Achsenindikator in der Ecke zeigt y nach oben](/screenshots/de/settings-y-up.webp){.shot-lg}

**Einheitensystem.** *SI (metrisch)* oder *US-amerikanisch (imperial)* stellt alle Einheiten auf einmal ein. Beim ersten Besuch wählen Sie das System im Willkommensdialog. EduBeam schlägt US-Einheiten nur vor, wenn der Browser auf ein US-Gebietsschema eingestellt ist *und* der Computer in einer US-Zeitzone steht; überall sonst schlägt es SI vor. Ändern Sie danach eine einzelne Einheit, erscheint als System *Benutzerdefiniert*.

### Einheiten {#units}

Jede Größe hat ihre eigene Einheit. Eingaben (die sie am Ende des Feldes anzeigen), Tabellen, Tooltips und Beschriftungen der Verläufe verwenden sie alle, und ein Wechsel der Einheit rechnet die Anzeige um. Am Modell ändert sich nichts, durch Hin- und Herschalten geht also nichts verloren.

| Größe | Auswahl | SI | US-amerikanisch |
| --- | --- | --- | --- |
| Länge (Geometrie, Lastpositionen) | m, cm, mm, ft, in | m | ft |
| Querschnittsabmessungen | m, cm, mm, ft, in | m | in |
| Verschiebung (Ergebnisse, vorgegebene Auflagersenkungen) | m, cm, mm, ft, in | m | in |
| Fläche | m², cm², mm², ft², in² | m² | in² |
| Flächenträgheitsmoment | m⁴, cm⁴, mm⁴, ft⁴, in⁴ | m⁴ | in⁴ |
| Masse | kg, lb | kg | lb |
| Kraft | N, kN, MN, kgf, Tonf, lbf, kip | kN | kip |
| Biegemoment | Nmm, Nm, kNm, MNm, Tonf·m, lbf·in, lbf·ft, kip·in, kip·ft | kNm | kip·ft |
| Druck (E, G) | Pa, kPa, MPa, GPa, ksc, psi, ksi, psf, ksf | MPa | ksi |
| Temperatur | °C, °F | °C | °F |

Einige Einheiten ergeben sich aus den anderen:

- **Streckenlasten** sind Kraft je Länge: kN/m in SI, kip/ft in US-Einheiten.
- Die **Dichte** ist Masse je Länge³: kg/m³ oder lb/ft³.
- Die **Wärmeausdehnung** folgt der Temperatur: 1/K oder 1/°F. Temperaturlasten sind Temperatur*änderungen*, daher entsprechen 10 °C 18 °F.
- **Verdrehungen** stehen immer in Radiant, Lagerwinkel in Grad.

Tonf ist die metrische Tonne-Kraft (1000 kgf), nicht die US-amerikanische Short Ton. US-Einheiten werden mit ihren exakten Definitionen umgerechnet: 1 ft = 0,3048 m, 1 kip = 4448,2216 N. Fuß geben Sie als Dezimalzahl ein, etwa `5,5`; Lineale und Fadenkreuz zeigen Fuß und Zoll (5′-6″).

## Anzeigeeinstellungen {#viewer-settings}

Hier legen Sie fest, wie die Zeichnung aussieht. Die **Vorschau** rechts ist ein kleiner geneigter Träger, der jede Änderung sofort zeigt; mit den Schaltflächen darunter wählen Sie, welches Ergebnis sie zeigt, und wenn Sie eine Einstellung der Verläufe oder eine Farbe ändern, wechselt sie zu diesem Ergebnis.

![Einstellungen → Anzeigeeinstellungen, rechts die Live-Vorschau und die Einstellungen der Verläufe](/screenshots/de/b-settings-viewer.webp)

Die linke Spalte, von oben nach unten:

- *Raster*: **Raster anzeigen** (<kbd>G</kbd>) zeichnet das Raster und die Lineale; **Am Raster ausrichten** (<kbd>S</kbd>) lässt die Knoten, die Sie setzen oder ziehen, auf dem Raster landen; **Fadenkreuz anzeigen** markiert die Position des Mauszeigers auf den Linealen (bei Bedienung mit der Maus). Alle drei sind zu Beginn eingeschaltet. Die **Raster-Schrittweite** beträgt 0,1 m, in US-Einheiten 0,5 ft. Wechseln Sie zwischen metrischen und US-Einheiten, springt eine Schrittweite, die noch auf ihrem Standardwert steht, auf den Standardwert des anderen Systems; eine selbst gesetzte Schrittweite bleibt erhalten.
- *Größen*: **Ergebnisskalierung**, 8 bis 120 px (zu Beginn 48 px), gibt an, wie hoch die größte Ordinate eines Verlaufs oder die größte Durchbiegung gezeichnet wird; das ist rein optisch, denn jeder Verlauf wird auf seinen eigenen Größtwert skaliert. **Lagergröße** reicht von 50 bis 150 % (100 %), **Schriftgröße** von 10 bis 20 px (14 px); größere Werte helfen am Beamer.
- *Ausrichtung der Ergebnisbeschriftungen*: *Senkrecht zum Diagramm* (Standard; die Werte stehen entlang der Ordinate) oder *Immer horizontal*.
- *Modellprüfung*: **Zeigen, wie sich eine instabile Struktur bewegen kann** zeichnet eine gestrichelte Kontur des Mechanismus, und **Bewegung animieren** lässt sie hin und her schwingen. Beides ist zu Beginn eingeschaltet.

### Schnittgrößenverläufe {#internal-force-diagrams}

Nicht jede Hochschule zeichnet die Verläufe gleich, deshalb können Sie in EduBeam wählen. Diese Einstellungen ändern nur die Zeichnung, nie die Werte. Die **gestrichelte Linie** entlang jedes Elements markiert seine untere Faser, also die Seite, zu der seine lokale z-Achse zeigt (siehe [Elementrichtung](/de/essentials/elements#element-direction)).

| Einstellung | Auswahl | Standard |
| --- | --- | --- |
| **Biegemoment** | auf der *Zugseite* oder der *Druckseite* gezeichnet | *Zugseite* |
| **Positive Querkraft** | gezeichnet auf der *Gegenseite* (gegenüber der gestrichelten Linie) oder auf der Seite der Linie (*Gestrichelte Seite*) | *Gegenseite* |
| **Positive Normalkraft** | *Gegenseite* oder *Gestrichelte Seite* | *Gegenseite* |
| **Füllung** | *Flächig*, *Schraffiert* (Linien quer zum Stab, wie von Hand gezeichnet) oder *Keine* | *Flächig* |
| **Polynomgrad je Abschnitt** | schreibt den Polynomgrad, 0° bis 3°, an jeden Abschnitt eines Verlaufs | aus |

Wie Sie die Vorzeichen ablesen, erklärt die Seite [Ergebnisse & Diagramme](/de/essentials/results#reading-the-sign).

### Farben {#colors}

Getrennte Farben für Knoten, Elemente, Lasten, Verformungsfigur, Normalkraft, Querkraft, Biegemoment und Auflagerreaktionen. Klicken Sie auf ein Farbfeld, um eine Farbe zu wählen. Die Standardfarben: Lasten orange, Verformungsfigur grau, N blau, V grün, M rot, Auflagerreaktionen violett, Knoten und Elemente schwarz.

## Steuerung & Tastenkürzel {#controls-shortcuts}

**Verschieben mit** legt fest, mit welcher Maustaste Sie die Zeichenfläche verschieben: *Mausrad oder rechte Taste* (Standard), *Mausrad* (Rad drücken und ziehen) oder *Rechte Taste*. Alle Tastenkürzel stehen auf der Seite [Tastatur, Maus & Touch](/de/reference/shortcuts).

## Was in Ihrem Browser gespeichert wird {#what-is-stored-in-your-browser}

Neben den Einstellungen legt EduBeam im lokalen Speicher des Browsers ab:

- das **aktuelle Modell**, gespeichert nach jeder Änderung, sodass es nach einem Neuladen des Tabs oder beim erneuten Öffnen der App wieder da ist;
- **Zuletzt verwendete Modelle**: die letzten 10 Modelle, die Sie gelöscht oder ersetzt haben, bereit zum Wiederherstellen über das Menü ☰.

Beides ist an diesen Browser auf diesem Gerät gebunden; wenn Sie die Websitedaten löschen, geht es verloren. Um ein Modell aufzubewahren oder auf ein anderes Gerät zu bringen, nutzen Sie [Projekt speichern oder Modell teilen](/de/essentials/import-export).
