---
description: "EduBeam berechnet ebene Balken, Rahmen und Fachwerke kostenlos im Browser: Möglichkeiten und Grenzen, Zielgruppe und Aufbau der Anleitung."
source: site
---

# Einführung

[EduBeam]{.edubeam} ist ein kostenloses Programm zur Berechnung von **Balken, Rahmen und Fachwerken**, das direkt im Browser läuft. Sie zeichnen ein Tragwerk, lagern und belasten es, und der Finite-Elemente-Solver berechnet Schnittgrößenverläufe, Auflagerreaktionen und Durchbiegungen bei jeder Änderung neu. Es gibt keine Schaltfläche *Berechnen*, nichts zu installieren und kein Konto anzulegen.

::div{.actions}
[EduBeam starten ↗](https://run.edubeam.app/?lang=de){target="_blank"} [Schnellstart in 10 Minuten](/de/guide/quick-start)
::

![Ein Dreigelenkrahmen in EduBeam: Lasten in Orange, Auflagerreaktionen in Violett, das Biegemoment in Rot und die Verformungsfigur in Grau](/screenshots/de/hero.webp)

:span{#your-first-visit}

## Was EduBeam kann {#what-it-does}

::card-grid{cols="2"}
:::card{title="Tragwerke" icon="lucide:triangle" to="/de/essentials/elements"}
Balken, Durchlaufträger, Rahmen und Fachwerke in der x-z-Ebene, aufgebaut aus Timoshenko-Balkenelementen. Mit Endgelenken wird aus einem Stab ein Fachwerkstab.
:::
:::card{title="Lager" icon="lucide:anchor" to="/de/essentials/nodes-supports#supports"}
Festlager, Loslager, Einspannung, Parallelführung oder jede Kombination der gehaltenen Freiheitsgrade `Dx`, `Dz` und `Ry`, ausgewählt über das Symbol. Dazu schräge Lager und Auflagersenkungen.
:::
:::card{title="Lasten" icon="lucide:arrow-down-to-line" to="/de/essentials/loads"}
Kräfte und Momente an Knoten oder an beliebiger Stelle eines Stabs, Gleich- und Trapezlasten, Temperaturlasten und vorgegebene Verschiebungen.
:::
:::card{title="Querschnitte" icon="lucide:shapes" to="/de/essentials/elements#cross-sections"}
Europäische und US-amerikanische Bibliotheken oder ein beliebiges selbst gezeichnetes Polygon; EduBeam berechnet $A$, $I_y$, $I_z$, $I_{yz}$, Hauptachsen und Trägheitsradien.
:::
:::card{title="Ergebnisse" icon="lucide:chart-spline" to="/de/essentials/results"}
Verläufe von **N**, **V** und **M**, Verformungsfigur, Auflagerreaktionen, Knotenverschiebungen, Stabendkräfte und Elementsteifigkeitsmatrizen.
:::
:::card{title="Berechnung" icon="lucide:calculator" to="/de/elements/analysis"}
Lineare Statik, für das lineare Modell exakt: Es gibt kein Netz, das verfeinert werden müsste. Ist ein Tragwerk kinematisch verschieblich, erklärt EduBeam, warum, und animiert die mögliche Bewegung.
:::
:::card{title="Dateien" icon="lucide:folder-open" to="/de/essentials/import-export"}
Projekte als JSON, ganze Modelle als Links, Zeichnungen als PNG oder SVG, Ergebnisse als CSV. Ersetzte Modelle bleiben erhalten, und nichts verlässt Ihr Gerät.
:::
:::card{title="Einheiten" icon="lucide:ruler" to="/de/essentials/units-settings"}
SI oder US-Einheiten mit einem Klick oder jede Größe einzeln. Die z-Achse nach unten oder, wie im Lehrbuch, die y-Achse nach oben.
:::
::

## Was EduBeam (noch) nicht kann {#what-it-does-not-do-yet}

Wer die Grenzen vorab kennt, spart Zeit:

::div{.limits}
- **Nur 2D.** Kein Verhalten aus der Ebene heraus, keine räumlichen Rahmen.
- **Nur lineare Statik.** Keine Theorie II. Ordnung (P–Δ), kein Knicken, keine Dynamik, keine Plastizität.
- **Ein Lastfall.** Keine Lastfallkombinationen oder Umhüllenden: Speichern Sie jeden Lastfall als eigene Datei oder eigenen Link.
- **Kein Eigengewicht.** Setzen Sie es als Streckenlast an.
- **Keine Nachweise.** EduBeam liefert Schnittgrößen und Verformungen; die Bemessung nach Norm bleibt Ihre Aufgabe.
::

Wenn Ihnen eine Funktion wichtig ist, die noch fehlt, [melden Sie es auf GitHub](https://github.com/janvorisek/edubeam/issues).

::elementarium-promo{placement="introduction"}
::

## Für wen ist EduBeam gedacht? {#who-is-it-for}

::card-grid{cols="2"}
:::card{title="Studierende" icon="lucide:graduation-cap" to="/de/practice"}
Sofortige Rückmeldung zu Ihren Handrechnungen und Übungsaufgaben, die Ihre Ergebnisse gleich bei der Eingabe prüfen.
:::
:::card{title="Lehrende" icon="lucide:presentation" to="/de/guide/teaching"}
Zeigen Sie live am Beamer und in 22 Sprachen, wie Lager, Gelenke und Lasten die Schnittgrößen verändern, und drucken Sie für jede Studentin und jeden Studenten eine eigene Klausurvariante.
:::
:::card{title="Ingenieurinnen und Ingenieure" icon="lucide:hard-hat" to="/de/elements/analysis"}
Eine schnelle Plausibilitätskontrolle, bevor Sie ein umfangreiches Desktop-Programm öffnen, bei der jeder Rechenschritt dokumentiert ist.
:::
:::card{title="Entwicklerinnen und Entwickler" icon="lucide:code-xml" to="#libraries"}
Der Solver und die Zeichnungen hinter EduBeam als Open-Source-Bibliotheken für Ihren eigenen Code.
:::
::

## So finden Sie sich in der Anleitung zurecht {#how-this-guide-is-organised}

Die Seitenleiste ordnet die Seiten in diese Gruppen: Die **?**-Schaltflächen in der App öffnen die passende Seite dieser Anleitung in Ihrer Sprache.

::card-grid{cols="2"}
:::card{title="Erste Schritte" icon="lucide:flag" to="/de/guide/quick-start"}
Diese Seite und der Schnellstart: ein erster Balken in zehn Minuten.
:::
:::card{title="Modell erstellen" icon="lucide:pencil-ruler" to="/de/essentials/user-interface"}
Die Oberfläche, Knoten und Lager, Elemente, Materialien und Querschnitte, Lasten, Einheiten und Einstellungen.
:::
:::card{title="Ergebnisse auswerten" icon="lucide:chart-spline" to="/de/essentials/results"}
Die Verläufe und Ergebnistabellen und wie Sie sie von Hand prüfen.
:::
:::card{title="Teilen & Lehren" icon="lucide:share-2" to="/de/essentials/import-export"}
Projektdateien, Links zum Modell, Bild- und CSV-Export und EduBeam in der Lehre.
:::
:::card{title="Tutorials" icon="lucide:triangle" to="/de/tutorials/inclined-beam"}
Ein geneigter Träger, ein Dreigelenkrahmen, ein ebenes Fachwerk und ein Durchlaufträger mit Auflagersenkung, jeweils Schritt für Schritt aufgebaut und von Hand geprüft.
:::
:::card{title="Beispiele" icon="lucide:library" to="/de/examples/"}
Sechs fertige Modelle, die sich mit einem Klick öffnen, mit Übungsaufgaben und Lösungen.
:::
:::card{title="Theoriehandbuch" icon="lucide:sigma" to="/de/elements/conventions"}
Achsen und Vorzeichenkonventionen, das Balken- und das Fachwerkelement und wie EduBeam ein Modell berechnet.
:::
:::card{title="Hilfe" icon="lucide:life-buoy" to="/de/reference/shortcuts"}
Tastatur, Maus und Touch, Fehlerbehebung und die FAQ.
:::
::

## Eigene Werkzeuge bauen {#libraries}

EduBeam baut auf zwei Open-Source-Bibliotheken auf, die auf dieser Website dokumentiert sind. Mit ihnen berechnen Sie Tragwerke in einem Skript, erzeugen für alle Studierenden eine eigene Aufgabe oder zeichnen Abbildungen für Folien und Skripte.

::card-grid{cols="2"}
:::card{title="@edubeam/fem" icon="lucide:package" to="/de/solver"}
Der Finite-Elemente-Solver hinter EduBeam, in TypeScript: Ein Balken ist in einem Dutzend Zeilen modelliert, berechnet und ausgewertet, im Browser oder in Node.
:::
:::card{title="@edubeam/plot" icon="lucide:spline" to="/de/plot"}
Vue-3-Komponenten, die ein berechnetes Tragwerk als SVG zeichnen, mit Lasten, Auflagerreaktionen und den Verläufen von N, V und M.
:::
::

## Sprachen {#languages}

EduBeam spricht 22 Sprachen und startet in der Sprache Ihres Browsers. Umschalten können Sie unter **Einstellungen → Sprache & Region**, oder Sie wählen hier eine aus:

::div{.chips}
- [:icon{name="circle-flags:lang-en"} English](https://run.edubeam.app/?lang=en){target="_blank"}
- [:icon{name="circle-flags:lang-id"} Bahasa Indonesia](https://run.edubeam.app/?lang=id){target="_blank"}
- [:icon{name="circle-flags:lang-cs"} Čeština](https://run.edubeam.app/?lang=cs){target="_blank"}
- [:icon{name="circle-flags:lang-de"} Deutsch](https://run.edubeam.app/?lang=de){target="_blank"}
- [:icon{name="circle-flags:lang-es"} Español](https://run.edubeam.app/?lang=es){target="_blank"}
- [:icon{name="circle-flags:lang-fr"} Français](https://run.edubeam.app/?lang=fr){target="_blank"}
- [:icon{name="circle-flags:lang-it"} Italiano](https://run.edubeam.app/?lang=it){target="_blank"}
- [:icon{name="circle-flags:lang-hu"} Magyar](https://run.edubeam.app/?lang=hu){target="_blank"}
- [:icon{name="circle-flags:lang-pl"} Polski](https://run.edubeam.app/?lang=pl){target="_blank"}
- [:icon{name="circle-flags:lang-pt-br"} Português](https://run.edubeam.app/?lang=pt){target="_blank"}
- [:icon{name="circle-flags:lang-ro"} Română](https://run.edubeam.app/?lang=ro){target="_blank"}
- [:icon{name="circle-flags:lang-sk"} Slovenčina](https://run.edubeam.app/?lang=sk){target="_blank"}
- [:icon{name="circle-flags:lang-vi"} Tiếng Việt](https://run.edubeam.app/?lang=vi){target="_blank"}
- [:icon{name="circle-flags:lang-el"} Ελληνικά](https://run.edubeam.app/?lang=el){target="_blank"}
- [:icon{name="circle-flags:lang-ru"} Русский](https://run.edubeam.app/?lang=ru){target="_blank"}
- [:icon{name="circle-flags:lang-tr"} Türkçe](https://run.edubeam.app/?lang=tr){target="_blank"}
- [:icon{name="circle-flags:lang-uk"} Українська](https://run.edubeam.app/?lang=uk){target="_blank"}
- [:icon{name="circle-flags:lang-hi"} हिन्दी](https://run.edubeam.app/?lang=hi){target="_blank"}
- [:icon{name="circle-flags:lang-ja"} 日本語](https://run.edubeam.app/?lang=ja){target="_blank"}
- [:icon{name="circle-flags:lang-ko"} 한국어](https://run.edubeam.app/?lang=ko){target="_blank"}
- [:icon{name="circle-flags:lang-th"} ไทย](https://run.edubeam.app/?lang=th){target="_blank"}
- [:icon{name="circle-flags:lang-zh"} 中文](https://run.edubeam.app/?lang=cn){target="_blank"}
::

Auch ein Link kann die Sprache für die Leserin oder den Leser festlegen: `run.edubeam.app/?lang=de` öffnet die App auf Deutsch.

## Autoren & Danksagung {#authors-credits}

[EduBeam]{.edubeam} wird von [Jan Voříšek](https://github.com/janvorisek) als unabhängiges Projekt entwickelt. Es tritt in die Fußstapfen des Desktop-EduBeam für Windows und Linux, das [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) und [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) am Lehrstuhl für Mechanik der [Fakultät für Bauingenieurwesen der Tschechischen Technischen Universität in Prag (ČVUT)](https://www.fsv.cvut.cz/en) entwickelt haben, und öffnet bis heute dessen Sitzungsdateien. Der Solver [@edubeam/fem](/de/solver) ist aus der ersten Version von Bořek Patzák hervorgegangen. Die App und der Solver sind beide Open Source unter der GPL-3.0.

::team-members{size="small" :members='[{"avatar":"https://www.github.com/janvorisek.png","name":"Jan Voříšek","title":"Leitender Entwickler & Produktdesigner","links":[{"icon":"github","link":"https://github.com/janvorisek"},{"icon":"twitter","link":"https://twitter.com/janvorisekdev"}]},{"avatar":"https://www.github.com/kelidas.png","name":"Václav Sadílek","title":"Entwickler: Touch-Bedienung, Darstellungsgeschwindigkeit, Lasten und Lager","links":[{"icon":"web","link":"https://www.stm.fce.vutbr.cz/sadilek/"},{"icon":"github","link":"https://github.com/kelidas"}]},{"avatar":"https://www.github.com/bpatzak.png","name":"Bořek Patzák","title":"Ursprüngliches EduBeam und der erste FEM-Solver","links":[{"icon":"github","link":"https://github.com/bpatzak"}]}]'}
::

## Mitmachen {#contribute}

::card-grid{cols="3"}
:::card{title="Problem melden" icon="lucide:bug" to="https://github.com/janvorisek/edubeam/issues"}
Etwas ist unklar, falsch oder funktioniert nicht? Ein Issue auf GitHub erreicht das Team.
:::
:::card{title="Übersetzung verbessern" icon="lucide:languages" to="https://github.com/janvorisek/edubeam/tree/main/src/locales"}
Die Texte der App liegen in einer Datei pro Sprache; über einen Pull Request freuen wir uns.
:::
:::card{title="Weitersagen" icon="lucide:share-2"}
Empfehlen Sie EduBeam Ihren Kommilitoninnen und Kommilitonen oder Kolleginnen und Kollegen, oder setzen Sie einen Link zum Modell in Ihr Skript.
:::
::
