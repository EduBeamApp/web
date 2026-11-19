---
description: "Sechs berechnete Träger, Rahmen und Fachwerke, die sich mit einem Klick in EduBeam öffnen, jeweils mit Übungen, Hinweisen und Lösungen für Ihre Handrechnung."
source: site
---

# Beispiele

Jede Kachel unten ist ein interaktives, fertig berechnetes Modell. Ein Klick öffnet es in [EduBeam]{.edubeam}, bereit zum Bearbeiten: Ziehen Sie einen Knoten, ändern Sie eine Last oder haken Sie ein Gelenk an, und sehen Sie zu, wie sich die Verläufe mitändern. Die Übungen weiter unten machen aus jedem Modell eine kurze Aufgabe, mit Lösungen, an denen Sie Ihre Handrechnung prüfen können.

::feature-structures
::

Dieselben Modelle finden Sie in der App unter **☰ → Beispiele**, und [run.edubeam.app/?panel=examples&lang=de](https://run.edubeam.app/?panel=examples&lang=de){target="_blank"} öffnet diese Galerie direkt.

::callout{type="info" title="Ein Stabtyp für alle sechs"}
Alle Beispiele verwenden denselben Stahlstab: $E = 210$ GPa, $I_y = 8356\ \text{cm}^4$ (also $EI = 17\,548$ kNm²), eine Querschnittsfläche von $1\ \text{m}^2$ und eine so große Schubsteifigkeit, dass Längs- und Schubverformung vernachlässigbar sind. Die Lehrbuchformeln für schlanke Träger stimmen deshalb in jeder angezeigten Stelle mit der App überein. Die Querschnittshöhe beträgt $1$ m; sie spielt nur bei der Temperaturlast eine Rolle.
::

## Übungsvorschläge {#suggested-exercises}

Rechnen Sie das Ergebnis zuerst von Hand und prüfen Sie es dann in der App: Öffnen Sie das Modell über seine Kachel oben oder mit **In EduBeam öffnen** unter seiner Abbildung. Ein geöffnetes Modell ersetzt Ihr aktuelles; <kbd>Strg</kbd>+<kbd>Z</kbd> holt Ihres zurück, und es bleibt außerdem unter **☰ → Zuletzt verwendete Modelle** erhalten.

### Statisch unbestimmter Träger {#exercise-indeterminate-beam}

Ein Träger von 3 m Länge, bei A eingespannt und bei B auf einem Loslager, unter 10 kN/m.

::model-figure{caption="Eingespannt bei A, Loslager bei B, 10 kN/m"}
---
nodes: { A: [0, 0], B: [3, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Bestimmen Sie die Auflagerreaktionen und das Einspannmoment von Hand, mit dem Kraftgrößenverfahren oder einer Tabelle der Volleinspannmomente.
2. Entfernen Sie den Haken bei `Ry` in A, sodass ein Einfeldträger entsteht. Wie ändert sich das größte Moment?
3. Haken Sie `Ry` in A wieder an und zusätzlich in B, um beide Enden einzuspannen.

**Achten Sie darauf,** wo der Momentenverlauf sein Vorzeichen wechselt und wie die Einspannung mehr Last aufnimmt als das Loslager.

::callout{type="details" title="Lösungen"}
- Einseitig eingespannt: $R_A = 5qL/8 = 18{,}75$ kN, $R_B = 3qL/8 = 11{,}25$ kN, $M_A = qL^2/8 = 11{,}25$ kNm als negatives Moment (Zug oben). Das größte positive Moment beträgt $9qL^2/128 = 6{,}33$ kNm, 1,125 m von B entfernt, wo die Querkraft null ist.
- Einfeldträger: $qL^2/8 = 11{,}25$ kNm in Feldmitte, derselbe Wert, den vorher die Einspannung aufgenommen hat.
- Beidseitig eingespannt: $qL^2/12 = 7{,}5$ kNm negatives Moment an den Enden, $qL^2/24 = 3{,}75$ kNm positives Moment in Feldmitte.
::

### Kragträger {#exercise-cantilever}

Ein Kragträger von 4 m Länge, bei A eingespannt, mit 18 kN nach unten am freien Ende B.

::model-figure{caption="Kragträger, 18 kN am freien Ende"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Bestimmen Sie das Einspannmoment sowie die Durchbiegung und die Verdrehung am Kragende. Vergleichen Sie sie mit Knoten B unter **Ergebnisse → Knotenergebnisse**.
2. Halbieren Sie $I_y$ im Reiter **Querschnitte**. Was ändert sich, was nicht?
3. Ersetzen Sie die Einzellast durch eine Gleichlast von 4,5 kN/m, also ebenfalls 18 kN insgesamt: Löschen Sie die Knotenlast im Reiter **Lasten**, dann **Elementlast hinzufügen**.

**Achten Sie auf** die Form des Momentenverlaufs: eine Gerade unter der Einzellast, eine Parabel unter der Gleichlast.

::callout{type="details" title="Lösungen"}
- $M_A = FL = 72$ kNm, $w_B = FL^3/(3EI) = 21{,}88$ mm, $\varphi_B = FL^2/(2EI) = 8{,}21$ mrad.
- Mit halbem $I_y$ verdoppelt sich die Durchbiegung auf 43,77 mm. Das Moment bleibt bei 72 kNm: Der Kragträger ist statisch bestimmt, seine Schnittgrößen hängen also nicht von der Steifigkeit ab.
- Gleichlast: $M_A = qL^2/2 = 36$ kNm und $w_B = qL^4/(8EI) = 8{,}21$ mm. Dieselbe Gesamtlast ergibt das halbe Moment und drei Achtel der Durchbiegung.
::

### Warren-Fachwerk {#exercise-pratt-truss}

Ein Fachwerk mit 9 m Spannweite und 1,8 m Höhe, mit 8 kN an jedem der drei oberen Knoten E, F und G. Haken Sie **N(x)** in den Anzeigeoptionen an, um die Normalkräfte zu sehen. (Mit wechselnd geneigten Diagonalen und ohne Pfosten entspricht es dem, was die meisten Lehrbücher ein Warren-Fachwerk oder Strebenfachwerk nennen.)

::model-figure{caption="Knoten A bis G, 8 kN in E, F und G"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D], [E, F], [F, G], [A, E], [E, B], [B, F], [F, C], [C, G], [G, D]]
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: []
show: [nodeLabels]
---
::

1. Bestimmen Sie die Auflagerreaktionen und dann mit dem Knotenpunktverfahren die Kräfte in der Enddiagonale A–E und im Untergurt A–B.
2. Bestimmen Sie mit dem Ritterschnitt die Obergurtkraft im mittleren Feld und die Untergurtkraft B–C.
3. Die Knoten in diesem Modell sind biegesteif. Haken Sie im Reiter **Elemente** bei jedem Stab beide Endgelenke an, um ein gelenkiges Fachwerk zu erhalten, und vergleichen Sie die Normalkräfte.
4. Löschen Sie die Diagonale B–F, zuerst mit biegesteifen Knoten, dann mit Gelenken. Steht das Fachwerk noch?

**Achten Sie auf** das Muster der Vorzeichen: Obergurt auf Druck, Untergurt auf Zug, und die Diagonalen wechseln sich ab.

::callout{type="details" title="Lösungen"}
- Auflagerreaktionen: 12 kN in A und in D.
- Enddiagonalen: 15,62 kN Druck. Untergurte A–B und C–D: 10,00 kN Zug.
- Obergurte E–F und F–G: 13,33 kN Druck (Momente um B: $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$). Untergurt B–C: 16,67 kN Zug (Momente um F: $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$). Innere Diagonalen: 5,21 kN, auf Zug von E und G hinunter zum Untergurt, auf Druck hinauf zu F.
- Biegesteife und gelenkige Knoten ergeben bis auf 0,1 % dieselben Normalkräfte. Die Biegung in einem aus Dreiecken aufgebauten Fachwerk ist vernachlässigbar; deshalb funktioniert das gelenkige Modell.
- Ohne B–F steht das Fachwerk mit biegesteifen Knoten dank der Rahmenwirkung noch, mit Biegemomenten von etwa 3 kNm. Mit Gelenken fehlt ihm ein Stab: Es wird zum Mechanismus, und EduBeam zeigt, wie es sich bewegen kann.
::

### Durchlaufträger über drei Felder {#exercise-three-span-continuous-beam}

Ein Träger von 16 m Länge mit den Feldern 5 + 6 + 5 m: 8 kN/m im ersten Feld, 20 kN in C und 6 kN/m im letzten Feld. Beim Öffnen ist er nur in A und D gelagert.

::model-figure{caption="Beim Öffnen: nur in A und D gelagert"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Im geöffneten Zustand ist er ein einziger Einfeldträger mit 16 m Spannweite. Bestimmen Sie die Auflagerreaktionen und die Momente in B und C.
2. Haken Sie `Dz` in B und in C an, um einen Durchlaufträger über vier Lager zu erhalten.
3. Bestimmen Sie die Stützmomente über B und C mit der Dreimomentengleichung und danach die Auflagerreaktionen.

**Achten Sie auf** die negativen Stützmomente, die über den Innenstützen entstehen, darauf, wie viel kleiner alle Momente werden, und darauf, was mit der Last von 20 kN geschieht, sobald C ein Lager ist.

::callout{type="details" title="Lösungen"}
- Einfeldträger: $R_A = 44{,}69$ kN, $R_D = 45{,}31$ kN, $M_B = 123{,}4$ kNm und $M_C = 151{,}6$ kNm, beide positiv.
- Durchlaufträger, mit $M_A = M_D = 0$:
  $$22 M_B + 6 M_C = -\tfrac{8 \cdot 5^3}{4}$$
  $$6 M_B + 22 M_C = -\tfrac{6 \cdot 5^3}{4}$$
  ergeben $M_B = -9{,}766$ kNm und $M_C = -5{,}859$ kNm, beide negativ. Die 20 kN in C gehen direkt ins Lager und erzeugen keine Biegung.
- Auflagerreaktionen: A 18,05 kN, B 22,60 kN, C 35,52 kN (einschließlich der 20 kN), D 13,83 kN. Zusammen ergeben sie die 90 kN Gesamtlast.

::model-figure{caption="Der Durchlaufträger über vier Lager"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, B: roller, C: roller, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: [M, V]
---
::
::

### Portalrahmen {#exercise-portal-frame}

Ein Riegel von 8 m Länge auf zwei 6 m hohen Stützen, bei A eingespannt und bei D auf einem Loslager. Der Riegel trägt 10 kN/m, und an der oberen Ecke C greifen 8 kN nach links und 10 kN nach unten an.

::model-figure{caption="Eingespannt bei A, Loslager bei D: 10 kN/m auf dem Riegel, 8 kN und 10 kN in C"}
---
nodes: { A: [0, 0], B: [0, -6], C: [8, -6], D: [8, 0] }
supports: { A: fixed, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
  - { node: C, fx: -8 }
  - { node: C, fz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Wie oft ist der Rahmen statisch unbestimmt?
2. Entfernen Sie den Haken bei `Ry` in A, sodass A ein Festlager wird. Der Rahmen ist jetzt statisch bestimmt: Bestimmen Sie die Auflagerreaktionen und die Momente in den Ecken B und C von Hand.
3. Haken Sie `Ry` in A wieder an und dann `Dx` in D, sodass D ein Festlager wird. Beobachten Sie in der Verformungsfigur die Seitenverschiebung des Riegels.

**Achten Sie darauf,** in welche Richtung sich der Riegel verschiebt. Im Ausgangsmodell verschiebt er sich nach rechts, entgegen der Last von 8 kN. Warum?

::callout{type="details" title="Lösungen"}
- Vier Auflagerreaktionen (drei an der Einspannung, eine am Loslager) und drei Gleichgewichtsbedingungen: einfach statisch unbestimmt. Ist auch D ein Festlager, zweifach.
- Festlager in A: $V_D = (10 \cdot 8 \cdot 4 + 10 \cdot 8 - 8 \cdot 6)/8 = 44$ kN, $V_A = 46$ kN, $H_A = 8$ kN nach rechts. Das Eckmoment in B beträgt $8 \cdot 6 = 48$ kNm. In C ist es null: Ohne horizontale Auflagerreaktion in D trägt die rechte Stütze nur eine Normalkraft von 44 kN.
- Im Ausgangsmodell verschiebt sich der Riegel um 9,5 mm nach rechts: Das Moment aus dem belasteten Riegel biegt die eingespannte Stütze stärker als die 8 kN. Mit einem Festlager in D nimmt D horizontal 4,9 kN auf, und der Riegel verschiebt sich um 4,8 mm nach links.
::

### Temperaturlast {#exercise-temperature-load}

Ein Einfeldträger mit 8 m Spannweite, dessen Achse um $\Delta T_c = 20$ K erwärmt wird und dessen Unterseite 10 K kälter ist als seine Oberseite ($\Delta T_b - \Delta T_t = -10$ K).

::model-figure{caption="Einfeldträger mit 8 m Spannweite, um 20 K erwärmt, die Unterseite 10 K kälter als die Oberseite"}
---
nodes: { A: [0, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 20, bottom: -10, top: 0 } }
results: []
show: [nodeLabels, dimensions]
---
::

1. Bevor Sie hinsehen: Welche Schnittgrößen ruft die Temperatur hervor, und wie bewegt sich der Träger?
2. Haken Sie `Dx` in B an, damit sich der Träger nicht verlängern kann.
3. Haken Sie zusätzlich `Ry` an beiden Enden an.

**Achten Sie auf** die Verformungsfigur und die Zahlen unter **Ergebnisse → Knotenergebnisse**: Der Träger bewegt sich ganz ohne Schnittgrößen, bis Sie ihn festhalten.

::callout{type="details" title="Lösungen"}
- Ein statisch bestimmter Träger kann sich frei ausdehnen und verbiegen, es entstehen also keine Schnittgrößen. B gleitet um $\alpha \Delta T_c L = 12 \cdot 10^{-6} \cdot 20 \cdot 8 = 1{,}92$ mm nach außen. Die kältere Unterseite verkürzt sich, deshalb wölbt sich der Träger mit der Krümmung $\kappa = \alpha (\Delta T_b - \Delta T_t)/h = -1{,}2 \cdot 10^{-4}$ 1/m nach oben: Die Enden verdrehen sich um $\kappa L/2 = 0{,}48$ mrad, und die Feldmitte hebt sich um $\kappa L^2/8 = 0{,}96$ mm.
- Mit beiden Enden in x-Richtung gehalten: $N = -EA\alpha\Delta T_c = -50\,400$ kN, Druck. Der große Betrag rührt von der Platzhalterfläche von 1 m² her; ein IPE 200 mit 28,48 cm² hätte 143,5 kN aufzunehmen.
- Mit beiden Enden eingespannt: ein konstantes Moment $EI\alpha(\Delta T_b - \Delta T_t)/h = 2{,}11$ kNm über den ganzen Träger.
::

## Durchgerechnete Tutorials {#worked-tutorials}

Größere Modelle, Schritt für Schritt aufgebaut und von Hand geprüft:

::card-grid{cols="2"}
:::card{title="Geneigter Träger" icon="lucide:move-diagonal" to="/de/tutorials/inclined-beam"}
Ein Sparren unter Schnee: Lasten je Meter Grundrisslänge, Normal- und Querkräfte entlang der Neigung und ein gedrehtes Loslager.
:::
:::card{title="Dreigelenkrahmen" icon="lucide:triangle" to="/de/tutorials/three-hinged-frame"}
Auflagerreaktionen, N, V und M eines Rahmens mit Zwischengelenk.
:::
:::card{title="Ebenes Fachwerk" icon="lucide:git-fork" to="/de/tutorials/truss"}
Knotenpunktverfahren, Ritterschnitt, ein Nullstab und eine Durchbiegung mit dem Prinzip der virtuellen Kräfte.
:::
:::card{title="Durchlaufträger & Auflagersenkung" icon="lucide:spline" to="/de/tutorials/continuous-beam"}
Ein Zweifeldträger, mit dem Kraftgrößenverfahren berechnet, dann mit einer Senkung des Mittellagers um 10 mm.
:::
::

Weitere geschlossene Lösungen zum Vergleichen finden Sie unter [Ergebnisse von Hand prüfen](/de/guide/verification).

## Weitere Aufgaben {#more-problems}

Die Seite [Übungsaufgaben](/de/practice) erzeugt auf Wunsch jederzeit einen neuen Träger, einen neuen Rahmen oder ein neues Fachwerk mit neuen Zahlen und prüft Ihre Auflagerreaktionen und das größte Moment oder die größte Stabkraft sofort. Für eine Lehrveranstaltung druckt der [Klausurgenerator](/de/exam) Klausuren, für jede Studentin und jeden Studenten eine eigene Variante, mit Lösungsblatt, und die Zeichenbibliothek [@edubeam/plot](/de/guide/teaching#exercise-sheets-tests-and-slides-from-code) erstellt Übungsblätter aus Code.

## Ein Beispiel beisteuern {#contribute-an-example}

Sie haben ein gutes Lehrmodell? Teilen Sie seinen Link in den [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions), und vielleicht nehmen wir es in die Galerie auf.
