---
description: "Zweifeldträger in EduBeam: mit zwei Einfeldträgern vergleichen, das Mittellager absenken und alles mit dem Kraftgrößenverfahren prüfen. Etwa 25 Minuten."
---

# Tutorial: Durchlaufträger und Auflagersenkung

Sie modellieren einen Träger, der über zwei Felder durchläuft, vergleichen ihn mit zwei Einfeldträgern und lassen dann sein Mittellager um 10 mm absinken. Die Auflagerreaktionen dieses Trägers folgen nicht allein aus dem Gleichgewicht, deshalb prüfen Sie sie mit dem Kraftgrößenverfahren.

- **Zeit:** etwa 25 Minuten. Dies ist das letzte und umfangreichste der vier Tutorials.
- **Sie brauchen:** EduBeam in einem zweiten Tab, an einem Computer mit Maus und Tastatur. Wenn Sie EduBeam noch nicht kennen, zuerst den [Schnellstart](/de/guide/quick-start) oder eines der vorherigen Tutorials.
- **Vorkenntnisse:** das Kraftgrößenverfahren mit einer statisch Überzähligen und die Durchbiegungen eines Einfeldträgers in Feldmitte, $5qL^4/(384EI)$ unter Gleichlast und $FL^3/(48EI)$ unter einer Einzellast.
- **Einheiten:** SI. Der Einheiten-Chip unten rechts in der Ansicht sollte `m m² kN kNm MPa` zeigen. Zeigt er Fuß und Kips, klicken Sie darauf und stellen Sie **Einheitensystem** auf **SI (metrisch)**.

**In diesem Tutorial lernen Sie,**

- zu sehen, was die Durchlaufwirkung bringt: kleinere Momente und Durchbiegungen als bei Einfeldträgern,
- eine Auflagersenkung vorzugeben und die Kräfte abzulesen, die sie für sich allein verursacht,
- einen statisch unbestimmten Träger mit dem Kraftgrößenverfahren zu prüfen und zu verstehen, warum ein steiferer Träger unter einer Auflagersenkung stärker leidet.

::div{.actions}
[EduBeam öffnen ↗](https://run.edubeam.app/?lang=de){target="_blank"} [Zur Handrechnung](#check-by-hand)
::

::model-figure{caption="Der fertige Träger: zwei Felder von 6 m unter 10 kN/m, vor der Auflagersenkung"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels, dimensions]
---
::

## Die Aufgabe {#the-problem}

- Zwei Felder mit $L = 6$ m: ein Festlager in Knoten 1, Loslager in den Knoten 2 und 3.
- Eine Gleichlast $q = 10$ kN/m auf beiden Feldern.
- Stahl, $E = 210$ GPa, und $I_y = 8{,}356 \times 10^{-5}$ m⁴ (ein IPE 300), also $EI = 17\,547{,}6$ kNm².
- Im zweiten Teil senkt sich das Mittellager, Knoten 2, um $\Delta = 10$ mm.

**Ist es statisch bestimmt?** Vier Auflagerreaktionen (zwei in Knoten 1, je eine in den Knoten 2 und 3) stehen drei Gleichgewichtsbedingungen gegenüber: Der Träger ist einfach statisch unbestimmt. Die fehlende Gleichung liefert die Verformung: Knoten 2 verschiebt sich nicht oder genau um $\Delta$.

## Das Modell aufbauen {#model-it}

::div{.steps}

### Material und Querschnitt {#material-and-section}

1. Klicken Sie in der oberen Leiste auf **Modell löschen**, haken Sie **Materialien löschen** und **Querschnitte löschen** an und klicken Sie auf **Bestätigen**. Knoten und Elemente werden dann wieder ab 1 nummeriert.
2. Reiter **Materialien** → **Materialbibliothek** → **+** in der Zeile **Stahl (S235)**; schließen Sie die Bibliothek dann mit **Abbrechen**.
3. Reiter **Querschnitte** → **Querschnitt hinzufügen**. Geben Sie in **Iy** `8,356e-5` ein, lassen Sie **Fläche**, **Höhe** und **Schubkoeffizient** auf `1` und klicken Sie auf **Querschnitt hinzufügen**.

Mit einer Fläche von 1 m² verformt sich der Träger kaum durch Schub, so wie es die Handrechnung voraussetzt. Diesmal beeinflusst $I_y$ auch die Kräfte – Sie werden sehen, wo.

### Den Träger zeichnen {#draw-the-beam}

1. Reiter **Elemente** → die zweite Schaltfläche **Element hinzufügen**, die mit dem Mauszeiger-Symbol.
2. Klicken Sie auf (0, 0), (6, 0) und (12, 0).
3. Drücken Sie <kbd>Esc</kbd>, um das Zeichnen zu beenden, und dann <kbd>F</kbd>, um die Ansicht anzupassen.

Drei Knoten und zwei Elemente. Prüfen Sie die Koordinaten in der Tabelle **Knoten**.

### Lager {#supports}

Klicken Sie auf Knoten 1 → **Knotenlagerung** → das Symbol **Festlager**. Geben Sie den Knoten 2 und 3 das **Loslager**.

### Last {#load}

Reiter **Lasten** → **Elementlast hinzufügen** → *Gleichmäßig verteilte Last* auf **Element** `1`, `fz = 10` → **Elementlast hinzufügen**. Wiederholen Sie das für Element 2.

::

## Ergebnisse {#results}

Biegemoment, Auflagerreaktionen und Verformungsfigur sind von Anfang an eingeschaltet. Für die Querkraft haken Sie in den Anzeigeoptionen oben rechts in der Ansicht (das Zahnrad blendet sie ein und aus) **V<sub>z</sub> (x)** an. EduBeam beschriftet Verläufe und Auflagerreaktionen in kN und kNm mit zwei Nachkommastellen.

- Die Auflagerreaktionen zeigen `22,50` in den Knoten 1 und 3 und `75,00` in Knoten 2: Das Mittellager trägt mehr als die Hälfte der 120 kN.
- Das Moment über Knoten 2 zeigt `-45,00`, ein negatives Stützmoment. Die Feldmomente sind positiv und erreichen höchstens `25,31` kNm, 2,25 m von den Endauflagern entfernt.
- Die Querkraft springt über Knoten 2 von `-37,50` auf `37,50`.

### Vergleich mit zwei Einfeldträgern {#compare-with-two-simple-spans}

Was bringt die Durchlaufwirkung? Unterbrechen Sie sie: Haken Sie in der Tabelle **Elemente** das Gelenk am **Ende** von Element 1 an, in Knoten 2. Aus dem Träger werden zwei Einfeldträger von je 6 m, ein statisch bestimmtes Tragwerk.

::model-figure{caption="Mit einem Gelenk über Knoten 2: zwei Einfeldträger mit je qL²/8 = 45 kNm"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [{ nodes: [1, 2], hinges: [false, true] }, [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, w]
show: [nodeLabels]
---
::

| | Durchlaufträger | Zwei Einfeldträger |
| --- | --- | --- |
| Auflagerreaktionen in den Knoten 1, 2, 3 | 22,5; 75; 22,5 kN | 30; 60; 30 kN |
| Moment über Knoten 2 | −45 kNm | 0 |
| Größtes positives Moment | 25,31 kNm | 45 kNm |
| Größte Durchbiegung, in der Ansicht $w(x)$ der Bilder | 4,000 mm | 9,617 mm |

Das betragsmäßig größte Moment ist in beiden Fällen 45 kNm, beim Durchlaufträger wandert es aber über das Lager, und die Feldmomente sind viel kleiner. Jedes Feld ist außerdem 2,4-mal so steif: Sein Ende über Knoten 2 kann sich nicht verdrehen, fast als wäre es eingespannt. Nehmen Sie den Haken beim Gelenk wieder weg, bevor Sie weitermachen.

## Das Mittellager absenken {#settle-the-middle-support}

Lassen Sie Knoten 2 jetzt um 10 mm absinken, wie es ein Fundament auf weichem Baugrund tun könnte.

::div{.steps}

### Die Auflagersenkung vorgeben {#prescribe-the-settlement}

Klicken Sie auf Knoten 2 → **Verschiebung vorgeben**. Im Dialog ist **Vorgegebene Verschiebung** bereits ausgewählt; geben Sie in **Dz** `0,01` ein und klicken Sie auf **Knotenlast hinzufügen**.

![Der Dialog für eine vorgegebene Verschiebung: Nur Dz, die Richtung, die das Loslager hält, lässt sich einstellen](/screenshots/de/p2t-prescribe-displacement.webp){.shot-sm}

In den voreingestellten SI-Einheiten werden Verschiebungen in Metern eingegeben, 10 mm sind also `0,01`; positiv ist nach unten. Nur die gehaltenen Richtungen lassen sich vorgeben: Ein Loslager lässt sich nach unten verschieben, aber nicht zur Seite. Mehr dazu unter [Vorgegebene Verschiebungen](/de/essentials/loads#prescribed-displacements-support-settlements).

### Die neuen Ergebnisse ablesen {#read-the-new-results}

Die mittlere Auflagerreaktion sinkt auf `70,13` kN, die äußeren steigen auf `24,94` kN. Das Moment über Knoten 2 geht auf `-30,38` kNm zurück, und die Feldmomente wachsen auf bis zu `31,09` kNm.

::model-figure{caption="Knoten 2 um 10 mm abgesenkt: Das negative Stützmoment wird kleiner, die Felder übernehmen mehr"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
  - { node: 2, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

### Die Auflagersenkung allein {#look-at-the-settlement-alone}

Löschen Sie die beiden Elementlasten: Wählen Sie jede aus und drücken Sie <kbd>Entf</kbd>, oder verwenden Sie das × in ihrer Zeile der Tabelle **Lasten**. Was bleibt, ist die Wirkung der Auflagersenkung allein: ein dreieckförmiger Momentenverlauf mit positiven `14,62` kNm über Knoten 2 und Auflagerreaktionen, die Knoten 2 mit `4,87` kN **nach unten** ziehen, während die Knoten 1 und 3 mit je `2,44` kN nach oben drücken. Der Träger wehrt sich dagegen, in die abgesenkte Form gebogen zu werden, und dieser Widerstand ist das Einzige, was ihn belastet.

::model-figure{caption="Die Auflagersenkung allein: keine Last, und doch ist der Träger verbogen und die Lager reagieren"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { node: 2, settlement: { dz: 0.01 } }
results: [M, w]
show: [nodeLabels]
---
::

Addieren Sie das zu den Ergebnissen unter der Last allein, und Sie erhalten den abgesenkten Träger unter Last: 75 − 4,87 = 70,13 kN, −45 + 14,62 = −30,38 kNm. Die Berechnung ist linear, die Wirkungen überlagern sich also.

### Die Durchlaufwirkung noch einmal unterbrechen {#cut-the-continuity-again}

Holen Sie die Lasten mit <kbd>Strg</kbd>+<kbd>Z</kbd> zurück, einmal pro gelöschter Last, und haken Sie das Gelenk am Ende von Element 1 wieder an. Die abgesenkten Felder neigen sich jetzt nur noch: Auflagerreaktionen und Momente sind genau die von zwei Einfeldträgern, egal wie groß die Auflagersenkung ist, und ohne die Lasten wären sie null. **Eine Auflagersenkung erzeugt nur in einem statisch unbestimmten Tragwerk Schnittgrößen.** Nehmen Sie den Haken beim Gelenk wieder weg, bevor Sie weitermachen.

::

## Von Hand prüfen {#check-by-hand}

Verwenden Sie das Kraftgrößenverfahren. Entfernen Sie das Lager in Knoten 2 und ersetzen Sie es durch seine unbekannte Auflagerreaktion $R_2$, die nach oben auf einen Einfeldträger mit der Spannweite $2L = 12$ m wirkt.

**Durchbiegungen des statisch bestimmten Grundsystems in Knoten 2.** Unter der Last und unter einer Einslast nach oben in Knoten 2:

$$
\delta_q = \frac{5q\,(2L)^4}{384\,EI} = \frac{5 \cdot 10 \cdot 12^4}{384 \cdot 17\,547{,}6} = 0{,}15387\ \text{m}
$$

$$
\delta_{1} = \frac{(2L)^3}{48\,EI} = \frac{12^3}{48 \cdot 17\,547{,}6} = 0{,}0020516\ \text{m/kN}
$$

**Verträglichkeit.** $R_2$ muss Knoten 2 so weit zurück nach oben drücken, bis er dort sitzt, wo das Lager ist: bei null oder um $\Delta$ tiefer.

$$
R_2\,\delta_1 = \delta_q - \Delta \quad\Rightarrow\quad R_2 = \frac{\delta_q - \Delta}{\delta_1}
$$

**Alles Übrige** folgt aus dem Gleichgewicht; das größte positive Moment liegt dort, wo die Querkraft $R_1 - qx$ null ist.

| | Formel | Ohne Auflagersenkung | Knoten 2 um 10 mm abgesenkt |
| --- | --- | --- | --- |
| $R_2$ | $(\delta_q - \Delta)/\delta_1$ | 75,00 kN | 70,13 kN |
| $R_1 = R_3$ | $(2qL - R_2)/2$ | 22,50 kN | 24,94 kN |
| $M_2$ | $R_1 L - qL^2/2$ | −45,00 kNm | −30,38 kNm |
| $M_{\max}$ | $R_1^2/(2q)$ | 25,31 kNm | 31,09 kNm |

EduBeam zeigt dieselben Werte bis auf die letzte Stelle.

Ohne Auflagersenkung sind das die bekannten Tabellenwerte $R_2 = 10qL/8$, $M_2 = -qL^2/8$ und $M_{\max} = 9qL^2/128$. Die Auflagersenkung allein ändert die Auflagerreaktionen um $\Delta/\delta_1 = 4{,}874$ kN und das Moment über Knoten 2 um

$$
\Delta M_2 = \frac{\Delta}{\delta_1} \cdot \frac{2L}{4} = \frac{3\,EI\,\Delta}{L^2} = \frac{3 \cdot 17\,547{,}6 \cdot 0{,}01}{36} = 14{,}62\ \text{kNm}
$$

Beachten Sie das $EI$ darin. Die Kräfte aus einer Last hängen nur davon ab, wie steif die Stäbe *im Verhältnis zueinander* sind; die Kräfte aus einer aufgezwungenen Verschiebung wachsen mit der Steifigkeit selbst. Über einem Lager, das sich senkt, zieht ein steiferer Träger größere Momente an.

## Experimentieren {#experiment}

Beginnen Sie mit dem abgesenkten Träger unter Last, ändern Sie jeweils nur eine Sache, sagen Sie das Ergebnis voraus und schauen Sie erst dann nach. <kbd>Strg</kbd>+<kbd>Z</kbd> nimmt jede Änderung zurück.

**Die Steifigkeit verdoppeln.** Setzen Sie in der Tabelle **Querschnitte** den Wert **Iy** auf `1,6712e-4`. Die Wirkung der Auflagersenkung auf das Moment über Knoten 2 verdoppelt sich auf 29,25 kNm, und $M_2$ geht auf −15,75 kNm zurück. Unter der Last allein würde sich nichts ändern außer den Durchbiegungen, die sich halbieren würden.

**Die Senkung finden, die Knoten 2 freigibt.** Für welches $\Delta$ ist das Moment über Knoten 2 null? $\Delta M_2 = 45$ kNm erfordert $\Delta = 45 L^2/(3EI) = qL^4/(24EI) = 0{,}0308$ m. Ändern Sie die Auflagersenkung auf `0,0308`, in der Tabelle **Lasten** oder per Doppelklick in der Ansicht: Die Auflagerreaktionen werden bis auf die Rundung von $\Delta$ zu 30, 60 und 30 kN, denen von zwei Einfeldträgern. $qL^4/(24EI)$ ist die Endverdrehung eines Einfeldträgers mal $L$: Die Auflagersenkung neigt jedes Feld gerade so weit, dass sich der Knick über Knoten 2 schließt, und die Durchlaufwirkung hat nichts mehr zu tun.

**Knoten 2 loslassen.** Ändern Sie die Auflagersenkung auf `0,1539`, die Durchbiegung $\delta_q$ des Grundsystems mit 12 m Spannweite. Die Auflagerreaktion in Knoten 2 sinkt praktisch auf null, und der Träger trägt die Last als ein einziger Einfeldträger: 180 kNm in Feldmitte. Ein Lager, das sich so weit senkt, ist kein Lager mehr.

**Knoten 2 stattdessen anheben.** Ändern Sie die Auflagersenkung auf `-0,01`, also 10 mm nach oben. Jede Änderung, die von der Auflagersenkung herrührt, kehrt ihr Vorzeichen um: Knoten 2 nimmt jetzt 79,87 kN auf, und das negative Stützmoment wächst auf −59,62 kNm.

Weitere geschlossene Lösungen zum Prüfen, darunter die Auflagersenkung eines einseitig eingespannten Trägers, finden Sie unter [Ergebnisse von Hand prüfen](/de/guide/verification#prescribed-displacement).

## Nächste Schritte {#next-steps}

::card-grid{cols="2"}
:::card{title="Üben: Zweifeldträger" icon="lucide:dices" to="/de/practice?p=K2049"}
Zweifeldträger, auf einem oder beiden Feldern belastet und mit dem Kraftgrößenverfahren gelöst; Ihre Antworten werden sofort geprüft. Beginnen Sie mit K2049; für weitere Aufgaben wählen Sie nur **Zweifeldträger** aus und klicken auf **Neue Aufgabe**.
:::
:::card{title="Beispiele" icon="lucide:library" to="/de/examples/"}
Das war das letzte Tutorial. Unter den Beispielen finden Sie weitere Modelle zum Öffnen, Verändern und Prüfen sowie Übungsaufgaben, die Sie stellen können.
:::
::
