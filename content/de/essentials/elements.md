---
description: "Balkenelemente in EduBeam zeichnen, Enden mit Gelenken freigeben (bis zum Fachwerkstab), Materialien und Querschnitte aus Bibliotheken wählen oder als Polygon anlegen."
source: site
---

# Elemente, Materialien & Querschnitte

Jedes Element in [EduBeam]{.edubeam} ist ein Balken zwischen zwei Knoten, mit einem Material und einem Querschnitt. Zeichnen Sie Elemente zwischen Knoten, geben Sie ihre Enden dort mit Gelenken frei, wo das Tragwerk Gelenke hat, und wählen Sie Materialien und Querschnitte aus den Bibliotheken oder legen Sie eigene an.

## Das Balkenelement {#the-beam-element}

Es gibt einen einzigen Elementtyp: einen **ebenen Timoshenko-Balken** in der x–z-Ebene mit drei Freiheitsgraden an jedem Ende (`Dx`, `Dz`, `Ry`). Er überträgt Normalkraft, Querkraft und Biegemoment und berücksichtigt die [Schubverformung](#shear-deformation). Ein Fachwerkstab ist dasselbe Element mit [Gelenken an beiden Enden](#end-hinges). Die Formulierung steht im [Theoriehandbuch](/de/elements/beam).

Die Ergebnisse entlang eines Elements sind für das lineare Modell exakt, **ein Element je Stab genügt also**. Einen Knoten innerhalb eines Stabs brauchen Sie nur dort, wo ein Lager, ein Gelenk, ein Querschnittswechsel oder ein Punkt liegt, an dem Sie Verschiebungen ablesen wollen. Eine Einzellast braucht keinen: Sie kann an beliebiger Stelle eines Elements [angreifen](/de/essentials/loads#concentrated-load).

## Elemente hinzufügen {#adding-elements}

Ein Element braucht ein Material und einen Querschnitt, legen Sie diese also zuerst an (siehe [Materialien](#materials) und [Querschnitte](#cross-sections)). Solange es keine gibt, zeigt die Ansicht *Keine Materialien definiert.* oder *Keine Querschnitte definiert.* mit einer Schaltfläche **Neu hinzufügen**.

- **Durch Wahl der Knoten.** Reiter *Elemente* → **Element hinzufügen** (die Schaltfläche mit dem **+**-Symbol) oder Rechtsklick auf die Zeichenfläche → *Element hinzufügen*. Wählen Sie **Anfangsknoten** und **Endknoten**, haken Sie bei Bedarf darunter **Gelenk** an und wählen Sie **Material** und **Querschnitt**. Dafür braucht das Modell mindestens zwei Knoten.
- **Per Klick.** Reiter *Elemente* → **Element hinzufügen** (die Schaltfläche mit dem Mauszeiger-Symbol) oder <kbd>Strg</kbd> gedrückt halten, während Sie im Menü der Zeichenfläche *Element hinzufügen* wählen. Klicken Sie auf einen Knoten (oder auf leere Zeichenfläche, dann entsteht dort einer) und danach auf den nächsten; klicken Sie weiter, um einen Zug aus mehreren Elementen zu zeichnen, und beenden Sie mit <kbd>Esc</kbd> oder **Abbrechen**. Die Leiste oben legt **Gelenk am Anfang** und **Gelenk am Ende** für jedes gezeichnete Element fest. Die Elemente erhalten das erste Material und den ersten Querschnitt des Modells.

![Der Dialog Element hinzufügen](/screenshots/de/qs-element.webp){.shot-md}

## Elementrichtung {#element-direction}

Jedes Element hat seine eigenen **lokalen Achsen**. Die lokale x-Achse verläuft vom **Anfangsknoten** zum **Endknoten**; die lokale z-Achse ist die lokale x-Achse, auf dem Bildschirm um 90° im Uhrzeigersinn gedreht. Bei einem von links nach rechts gezeichneten Element fallen die lokalen Achsen mit den globalen zusammen. Die **gestrichelte Linie** entlang jedes Elements markiert seine lokale +z-Seite, die „untere Faser“.

![Ein Portalrahmen, gezeichnet A → B → C → D: Die gestrichelten Linien aller drei Elemente liegen innen](/screenshots/de/p2b-element-direction.webp){.shot-md}

In diesem Rahmen verläuft Element 1 von A nach oben zu B, seine lokale z-Achse und damit seine gestrichelte Linie zeigen also nach rechts; Element 3 verläuft von C nach unten zu D, seine gestrichelte Linie liegt deshalb links. So gezeichnet liegen alle gestrichelten Linien eines Portalrahmens innen.

Die Richtung ist wichtig für:

- Lasten in lokalen Achsen (**LCS** angehakt), siehe [Elementlasten](/de/essentials/loads#element-loads);
- die **Lastposition vom Anfangsknoten** einer Einzellast;
- die Reihenfolge der [Stabendkräfte](/de/elements/conventions#end-forces-element-results-table) in den Ergebnissen: `X12, Z12, M12` am Anfangsknoten, `X21, Z21, M21` am Endknoten;
- welche Seite in den [Einstellungen der Schnittgrößenverläufe](/de/essentials/units-settings#viewer-settings) die „gestrichelte Seite“ ist.

Um ein Element umzukehren, drücken Sie **Knotenreihenfolge tauschen** (die Pfeile zwischen den beiden Knoten in der Tabelle *Elemente*).

## Endgelenke {#end-hinges}

Ein Endgelenk gibt das Biegemoment an einem Ende eines Elements frei: Das Moment ist dort null, und das Ende kann sich unabhängig vom Knoten verdrehen.

- **Ein Gelenk** setzt ein Zwischengelenk in einen Träger oder Rahmen.
- **Zwei Gelenke** machen das Element zu einem **Fachwerkstab**, der nur Normalkraft überträgt.

Anhaken können Sie sie an jeder dieser Stellen:

- in der Spalte **Endgelenke** der Tabelle *Elemente*, ein Kontrollkästchen für jedes Ende;
- in den Kästchen **Gelenk** im Dialog **Element hinzufügen** oder im Panel des Elements → **Element bearbeiten**;
- über **Gelenk am Anfang** und **Gelenk am Ende** in der Leiste beim Zeichnen mit der Maus.

![Die Tabelle Elemente eines Dreigelenkrahmens: Element 2 hat an seinem Ende, im Knoten C, ein Gelenk](/screenshots/de/elements-table.webp)

### Ein Gelenk: ein Zwischengelenk im Tragwerk {#one-hinge-a-pin-inside-the-structure}

Derselbe Durchlaufträger, zwei Felder von je 5 m unter 10 kN/m. Rechts hat Element 1 ein Endgelenk in B: Das Stützmoment fällt auf null, und jedes Feld trägt seine Last wie ein Einfeldträger.

::div{.shots}

:::model-figure{caption="Durchlaufend: M = −31,25 kNm über B"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M]
show: [nodeLabels]
---
:::

:::model-figure{caption="Gelenk in B: M = 0 über B, 31,25 kNm in jedem Feld"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [{ nodes: [A, B], hinges: [false, true] }, [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M]
show: [nodeLabels]
---
:::

::

Von Hand: durchlaufend $M_B = -qL^2/8 = -31{,}25\ \text{kNm}$ und höchstens $9qL^2/128 = 17{,}58\ \text{kNm}$ in jedem Feld; mit Gelenk $M_B = 0$ und $M_{max} = qL^2/8 = 31{,}25\ \text{kNm}$ in jeder Feldmitte. Das Gelenk baut das Stützmoment ab, verdoppelt aber fast die Feldmomente. Einen Träger mit Zwischengelenk zum Lösen von Hand, bei dem Ihre Antworten schon während der Eingabe geprüft werden, finden Sie in der [Übungsaufgabe G2048](/de/practice?p=G2048).

### Zwei Gelenke: ein Fachwerkstab {#both-hinges-a-truss-bar}

Eine Wandkonsole aus zwei Stäben, beide an beiden Enden gelenkig, trägt 20 kN in B. Die Stäbe übertragen nur Normalkraft, und der Momentenverlauf bleibt leer.

::model-figure{caption="Zugstab AB: N = +26,67 kN (Zug); Druckstab CB: N = −33,33 kN (Druck)"}
---
nodes: { A: [0, 0], B: [4, 0], C: [0, 3] }
supports: { A: pin, C: pin }
members: [{ nodes: [A, B], hinges: [true, true] }, { nodes: [C, B], hinges: [true, true] }]
loads:
  - { node: B, fz: 20 }
results: [N, M]
show: [nodeLabels]
---
::

Von Hand: Der Druckstab ist 5 m lang und steigt um 3 m an, also $N_{CB} = -20 \cdot 5/3 = -33{,}33\ \text{kN}$, und der Zugstab gleicht seinen horizontalen Anteil aus, $N_{AB} = 33{,}33 \cdot 4/5 = 26{,}67\ \text{kN}$. Das Tutorial [Ebenes Fachwerk](/de/tutorials/truss) baut auf diese Weise ein ganzes Fachwerk auf, und auf der Seite [Übungsaufgaben](/de/practice?p=T2048) finden Sie Fachwerke zum Lösen von Hand.

### Das Element gelenkig anschließen, nicht den Knoten {#hinge-the-element-not-the-node}

Ein Gelenk gehört zu einem Ende eines Elements: Dieses Ende kann sich dann selbstständig verdrehen, während alle anderen Elemente am Knoten biegesteif mit ihm verbunden bleiben. Wo zwei Stäbe zusammentreffen, ergibt also ein Gelenk einen gelenkigen Anschluss; wo mehrere zusammentreffen, schließen Sie alle bis auf einen gelenkig an. An einem Fachwerkknoten, an dem jeder Stab ein Fachwerkstab ist, sind alle gelenkig angeschlossen.

Ein Knoten, an dem jedes Element gelenkig angeschlossen ist, hat keine Drehsteifigkeit. EduBeam akzeptiert ihn und gibt seine Verdrehung mit 0 aus. Machen Gelenke das Tragwerk zum Mechanismus, markiert EduBeam sie mit einem Kreis und zeigt, wie es sich bewegt; siehe [Fehlerbehebung](/de/reference/troubleshooting#messages).

## Bearbeiten und Löschen {#editing-and-deleting}

| Ziel | So geht's |
| --- | --- |
| Knoten, Gelenke, Material oder Querschnitt ändern | Klicken Sie auf das Element → **Element bearbeiten** oder bearbeiten Sie es in der Tabelle *Elemente*. |
| Umkehren | **Knotenreihenfolge tauschen** in der Tabelle *Elemente*. |
| Umbenennen | Geben Sie in der Spalte *Element* eine neue Bezeichnung ein. |
| Steifigkeitsmatrix ansehen | Klicken Sie auf das Element → **Steifigkeitsmatrix** oder auf die Matrix-Schaltfläche in der Spalte *Aktionen*. Ein Fenster zeigt die Matrix des Elements (6 × 6) in globalen Achsen, in SI-Einheiten (N und m), gleich welche Einheiten Sie anzeigen, mit bereits auskondensierten Endgelenken. Praktisch, um eine Assemblierung von Hand zu prüfen. |
| Löschen | Klicken Sie auf das Element → **Löschen**, das × in der Tabelle, oder Element auswählen und <kbd>Entf</kbd> drücken. Seine Lasten verschwinden mit. |

![Das Panel eines Elements](/screenshots/de/ui-element-menu.webp){.shot-xs}

## Materialien {#materials}

Reiter *Materialien* → **Material hinzufügen** oder **Materialbibliothek** für ein fertiges Material. Ein Material kann von vielen Elementen gemeinsam genutzt werden; eine Änderung wirkt sich auf alle aus.

| Feld | Einheit | Wirkung |
| --- | --- | --- |
| Elastizitätsmodul $E$ | MPa | Dehn- und Biegesteifigkeit, $EA$ und $EI_y$. Stahl 210 000 MPa, Beton etwa 30 000 MPa, Holz etwa 11 000 MPa. |
| Schubmodul $G$ | MPa | Schubsteifigkeit $kGA$. Sofern $k$ des Querschnitts nicht extrem groß ist, kommt die [Schubverformung](#shear-deformation) hinzu: größere Durchbiegungen und in einem statisch unbestimmten Tragwerk andere Schnittgrößen. $G = E/(2(1+\nu))$: Stahl etwa 81 000 MPa. |
| Dichte $\rho$ | kg/m³ | Wird mit dem Material gespeichert, aber nicht verwendet: Eine Eigengewichtslast gibt es nicht. |
| Wärmeausdehnungskoeffizient $\alpha$ | 1/K | Wird von [Temperaturlasten](/de/essentials/loads#temperature-load) verwendet. Stahl $12 \times 10^{-6}$ 1/K. |

Die Einheiten sind die SI-Vorgaben; sie folgen Ihren [Einstellungen](/de/essentials/units-settings#units), in US-Einheiten stehen E und G also in ksi, die Dichte in lb/ft³ und α in 1/°F.

Ein neues Material beginnt mit $E$ = 210 000 MPa, $G$ = 87 500 MPa ($E/2{,}4$, also $\nu = 0{,}2$), $\rho$ = 1000 kg/m³ und $\alpha = 12 \times 10^{-6}$ 1/K; in US-Einheiten beginnt es als Stahl ASTM A992. Für Stahl ändern Sie $G$ auf 81 000 MPa oder wählen einen Stahl aus der Bibliothek.

![Der Dialog Material hinzufügen](/screenshots/de/qs-material.webp){.shot-md}

Die **Materialbibliothek** (auch über *Oder aus der Bibliothek auswählen* im Dialog **Material hinzufügen**) listet zuerst die metrischen Materialien (EN) auf, oder zuerst die US-amerikanischen (ASTM-Stähle, ACI-Beton), wenn Ihre Längen in Fuß oder Zoll angegeben sind. Das **+** in einer Zeile fügt das Material unter seinem Namen hinzu:

| Gruppe | Materialien |
| --- | --- |
| Metalle | Stahl S235, S275, S355; Edelstahl 304, 316; Gusseisen; Aluminium 6061-T6, 7075-T6, 5083; Kupfer, Messing, Bronze; Titan Grade 2 und Ti-6Al-4V; US-Stähle ASTM A992, A36, A572 Gr. 50 und HSS A500 Gr. C |
| Beton | C25/30, C30/37, C40/50, Leichtbeton; US $f'_c$ = 4 ksi und 5 ksi |
| Holz | C24, GL24h, GL32h |
| Sonstige | Glas, GFK, CFK, HDPE, PVC, PMMA, Polycarbonat |

Ein Material, das noch von Elementen verwendet wird, lässt sich nicht löschen: Weisen Sie diesen Elementen zuerst ein anderes Material zu.

## Querschnitte {#cross-sections}

Reiter *Querschnitte* → **Querschnitt hinzufügen**, **Querschnittsbibliothek** oder **Polygonaler Querschnitt**, um eine eigene Form zu zeichnen. Wie ein Material kann auch ein Querschnitt von vielen Elementen gemeinsam genutzt werden.

| Feld | Einheit | Wirkung |
| --- | --- | --- |
| Fläche $A$ | m² | Dehnsteifigkeit $EA$ und Schubfläche $kA$. |
| Flächenträgheitsmoment $I_y$ | m⁴ | Biegesteifigkeit $EI_y$, um die Achse senkrecht zur Zeichenebene. |
| Höhe $h$ | m | Nur für Temperaturlasten: Die Krümmung ist $\alpha\,(\Delta T_b - \Delta T_t)/h$. |
| Schubkoeffizient $k$ | – | Die wirksame Schubfläche ist $kA$, die Schubsteifigkeit also $kGA$. Etwa 0,83 für ein Rechteck, $A_{Steg}/A$ für ein I-Profil. |

Ein neuer Querschnitt beginnt mit $A$ = 1 m², $I_y = 10^{-4}$ m⁴, $h$ = 1 m und $k$ = 1 (in US-Einheiten ein W12×26 mit $k$ = 1). Ersetzen Sie diese Werte durch die Ihres Querschnitts oder wählen Sie einen aus der Bibliothek.

::callout{type="tip" title="Abgleich mit einem Lehrbuch ohne Schubverformung"}
Die meisten Handrechnungen verwenden Euler-Bernoulli-Balken, also ohne Schubverformung. Um mit ihnen übereinzustimmen, geben Sie $k$ einen sehr großen Wert wie `1e10`; die Beispiele in der App und die Abbildungen auf dieser Website verwenden `1e32`. Ein neuer Querschnitt ($k = 1$), die Bibliothek und der Polygoneditor berücksichtigen alle die Schubverformung; wie viel sie ausmacht, steht [weiter unten](#shear-deformation).
::

Die **Querschnittsbibliothek** liefert Näherungswerte für:

| Gruppe | Querschnitte | $k$ |
| --- | --- | --- |
| Vollquerschnitte | Rechtecke, Quadrate, Kreise | 0,833 (Rechteck), 0,9 (Kreis) |
| I-Profile | IPE 100, IPE 200, HEA 100, HEA 200; AISC-W-Profile W8×31 bis W36×150 | $h\,t_w/A$, der Steg |
| Rechteckhohlprofile | RHS 100×50×3, 150×100×5; AISC HSS | $2ht/A$, beide Stege |
| Kreishohlprofile | CHS Ø60×3, Ø114×5; AISC HSS rund | 0,5 |

Prüfen Sie die Werte aus der Bibliothek anhand einer Profiltabelle, bevor Sie sich auf sie verlassen.

![Die Querschnittsbibliothek](/screenshots/de/sections-library.webp){.shot-lg}

Für eine schnelle Handkontrolle: Ein Rechteck $b \times h$ hat $A = bh$ und $I_y = bh^3/12$, ein Vollkreis mit Durchmesser $d$ hat $A = \pi d^2/4$ und $I_y = \pi d^4/64$.

### Schubverformung: wann G und k eine Rolle spielen {#shear-deformation}

Die Schubsteifigkeit $kGA$ geht über den [Schubparameter](/de/elements/beam#timoshenko-or-euler-bernoulli) $\Phi = 12EI_y/(kGAL^2)$ in das Element ein. Bei sehr großem $k$ ist $\Phi = 0$ und das Element ein Euler-Bernoulli-Balken, $G$ hat dann keinen Einfluss. Mit einem realistischen $k$ vergrößert die Schubverformung stets die Durchbiegungen. In einem statisch bestimmten Tragwerk bleiben die Schnittgrößen gleich; in einem statisch unbestimmten ändern sie sich ebenfalls, weil die statisch Überzähligen von der Steifigkeit abhängen.

Wie viel das ausmacht, hängt davon ab, wie gedrungen der Stab ist. Ein IPE 200 aus der Bibliothek ($k = h\,t_w/A = 0{,}393$) aus Stahl S235 ($G$ = 81 000 MPa) unter 10 kN/m, verglichen mit demselben Träger mit $k$ = `1e32`:

| Träger | Mit Schubverformung | Euler-Bernoulli |
| --- | --- | --- |
| Einfeldträger, $L$ = 2 m ($L/h$ = 10): Durchbiegung in Feldmitte | 0,566 mm | 0,511 mm |
| Einseitig eingespannt, $L$ = 2 m: Moment an der Einspannung | −4,84 kNm | −5,00 kNm |
| Einfeldträger, $L$ = 6 m ($L/h$ = 30): Durchbiegung in Feldmitte | 41,85 mm | 41,36 mm |

Von Hand: Der Schubanteil der Durchbiegung in Feldmitte ist $qL^2/(8kGA)$, beim kurzen Träger 0,055 mm, also 11 % zusätzlich zum Biegeanteil $5qL^4/(384EI_y)$. Beim einseitig eingespannten Träger sinkt das Einspannmoment von $qL^2/8$ auf $(qL^2/8)/(1 + \Phi/4)$. Bei $L/h$ = 30 betragen beide Effekte etwa 1 % oder weniger; deshalb stimmen schlanke Rahmen und Lehrbuchergebnisse überein, gleich welches $k$ Sie wählen.

### Polygonale Querschnitte {#polygonal-sections}

Reiter *Querschnitte* → **Polygonaler Querschnitt** oder *Oder eine polygonale Form definieren* im Dialog **Querschnitt hinzufügen** öffnet einen Formeditor, der die Querschnittswerte für Sie berechnet.

![Der Editor für polygonale Querschnitte mit der Vorlage I-Profil, ihren Hauptachsen und der Trägheitsellipse](/screenshots/de/sections-polygon.webp)

::div{.steps}

### Mit einer Vorlage beginnen {#start-from-a-preset}

Wählen Sie eine **Vorlage** (Rechteck, I-Profil, T-Profil, L-Profil, U-Profil, Rechteckhohlprofil, Kreis, Kreishohlprofil), legen Sie ihre Abmessungen fest und drücken Sie **Übernehmen**.

### Die Form anpassen {#adjust-the-shape}

Ziehen Sie Eckpunkte (sie rasten am **Rasterschritt** ein), klicken Sie auf die Mitte einer Kante, um einen Eckpunkt einzufügen, oder doppelklicken Sie auf einen Eckpunkt, um ihn zu entfernen. Sie können Koordinaten auch in der Tabelle **Eckpunkte** eingeben. **Öffnung hinzufügen** fügt eine innere Kontur hinzu, und **Auf Schwerpunkt zentrieren** verschiebt die Form so, dass ihr Schwerpunkt im Ursprung liegt.

### Die Querschnittswerte ablesen {#read-the-properties}

Der Reiter **Querschnittswerte** zeigt $A$, den Schwerpunkt, die auf den Schwerpunkt bezogenen Werte $I_y$, $I_z$, $I_{yz}$, die Hauptträgheitsmomente $I_1$, $I_2$ mit dem **Hauptachsenwinkel** $\alpha$ (von $y$ zur Achse 1) und die Trägheitsradien. Die Zeichnung zeigt die Hauptachsen und die Trägheitsellipse.

### Den Querschnitt hinzufügen {#add-it}

Prüfen Sie die **Bezeichnung** und den **Schubkoeffizienten** $k$: Er beginnt bei 0,833, was für ein Rechteck stimmt; ein I-Profil braucht etwa $A_{Steg}/A$. Drücken Sie dann **Querschnitt hinzufügen** (**Speichern**, wenn Sie eine bestehende Form bearbeiten). $A$, $I_y$ und $h$ ergeben sich aus der Form und sind in der Tabelle schreibgeschützt; um sie zu ändern, bearbeiten Sie die Form erneut mit der Polygon-Schaltfläche in der Spalte *Aktionen*.

::

Die Querschnittskoordinaten bilden ein lokales Rechtssystem: $x$ zeigt aus dem Bildschirm heraus, $y$ nach links, $z$ nach unten.

Ist die Form nicht symmetrisch zur Rahmenebene (zum Beispiel ein L-Winkel), warnt Sie der Editor: Eine 2D-Berechnung ist nur dann exakt, wenn der Stab über seine ganze Länge gegen seitliches Ausweichen und Verdrehen gehalten ist, etwa durch eine Platte. Ist $I_{yz}$ nennenswert, wählen Sie die Biegesteifigkeit: **Über die Länge seitlich und gegen Verdrehen gehalten** ($I_y$) oder **Seitlich frei verformbar**, was einen kleineren Wert ergibt. Die Verdrehung ist in keinem der beiden Fälle berücksichtigt.
