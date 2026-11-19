---
description: "Kostenlose Stabwerksberechnung im Browser: Balken, Rahmen und Fachwerke zeichnen, belasten und sofort N, V, M, Auflagerreaktionen und Durchbiegungen sehen."
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "EduBeam"
  text: "Kostenlose Stabwerksberechnung online"
  tagline: Zeichnen Sie einen Balken, einen Rahmen oder ein Fachwerk, bringen Sie Lasten auf und sehen Sie zu, wie die Verläufe jeder Änderung folgen. Vollständige FEM-Ergebnisse im Browser – ohne Installation, ohne Konto, ohne Kosten.
  image:
    src: /screenshots/de/hero.webp
    alt: EduBeam mit einem berechneten Rahmen
  actions:
    - theme: brand
      text: App starten
      link: https://run.edubeam.app/?lang=de
    - theme: alt
      text: Anleitung lesen
      link: /de/guide/introduction
    - theme: alt
      text: Beispiele ansehen
      link: /de/examples/

features:
  - icon: ⚡
    title: Ergebnisse schon beim Zeichnen
    details: Eine Schaltfläche „Berechnen“ gibt es nicht. Ziehen Sie einen Knoten, haken Sie ein Gelenk an oder ändern Sie eine Last – N, V, M, Auflagerreaktionen und Verformungsfigur folgen sofort.
    link: /de/essentials/results
    linkText: Ergebnisse & Diagramme
  - icon: 🧑‍🏫
    title: Für die Lehre gemacht
    details: Geführte erste Schritte, Werte beim Überfahren mit der Maus, ein Solver, der erklärt, warum ein Tragwerk ein Mechanismus ist, und Links zum Modell, die Sie in Ihr Skript setzen können.
    link: /de/guide/teaching
    linkText: Lehren mit EduBeam
  - icon: 🌍
    title: Ihre Sprache, Ihre Einheiten
    details: 18 Oberflächensprachen, SI- oder US-Einheiten und wahlweise die z-Achse nach unten oder die aus Lehrbüchern bekannte y-Achse nach oben.
    link: /de/essentials/units-settings
    linkText: Einheiten & Einstellungen
  - icon: 🔗
    title: Teilen, exportieren, einbetten
    details: Senden Sie ein ganzes Modell als Link, speichern Sie es als Datei, exportieren Sie die Zeichnung als PNG oder SVG und die Ergebnistabellen als CSV.
    link: /de/essentials/import-export
    linkText: Dateien, Links & Export
---

## Einstieg {#start-here}

::div{.start-grid}

**Neu bei EduBeam?** Folgen Sie dem [Schnellstart in 10 Minuten](/de/guide/quick-start). Sie modellieren Schritt für Schritt einen Einfeldträger und prüfen jedes Ergebnis von Hand.

**Sie wissen schon, was Sie modellieren möchten?** Springen Sie direkt zu einem [Tutorial](/de/tutorials/three-hinged-frame) oder öffnen Sie ein fertiges [Beispiel](/de/examples/) und passen Sie es an.

**Sie unterrichten?** Unter [Lehren mit EduBeam](/de/guide/teaching) finden Sie Links zum Modell für Übungsblätter, eine einbettbare Ansicht für Folien und Übungsaufgaben.

::

::div{.shots}

![Ein Fachwerk: Normalkräfte, Zug positiv](/screenshots/de/tut-truss.webp)

![Ein Mechanismus wird sichtbar: EduBeam zeigt, warum sich das Tragwerk nicht berechnen lässt](/screenshots/de/ui-mechanism.webp)

::

## Was Sie modellieren können {#what-you-can-model}

- **Balken, Rahmen und Fachwerke** in der Ebene: Durchlaufträger, Portalrahmen, Dreigelenkbögen, Fachwerke mit gelenkigen Knoten.
- **Beliebige Lager**: Festlager, Loslager, Einspannung, Parallelführung, gedrehte Lager und Auflagersenkungen.
- **Lasten**: Einzelkräfte und Einzelmomente, Gleich- und Trapezlasten, Einzellasten an beliebiger Stelle eines Stabs und Temperaturlasten.
- **Beliebige Querschnitte**: aus der Bibliothek (IPE, HEA, AISC W, HSS, Rechtecke, Rohre) oder als Polygon gezeichnet; die Querschnittswerte berechnet EduBeam selbst.

Mehr dazu in der [Einführung](/de/guide/introduction).

::elementarium-promo
::
