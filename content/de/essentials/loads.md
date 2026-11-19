---
description: "Kräfte, Momente, Auflagersenkungen, Gleich-, Trapez-, Einzel- und Temperaturlasten in EduBeam mit Vorzeichen: z nach unten, Momente gegen den Uhrzeigersinn."
source: site
---

# Lasten

Lasten greifen an Knoten oder entlang von Elementen an. Alle gehören zu einem **einzigen Lastfall** und wirken gleichzeitig; um verschiedene Situationen zu vergleichen, speichern Sie jede als eigene [Projektdatei oder als eigenen Link](/de/essentials/import-export).

| Last | Wirkt auf | Hinzufügen über |
| --- | --- | --- |
| [Kraft oder Moment](#nodal-loads) | einen Knoten | Reiter *Lasten* → **Knotenlast hinzufügen** oder Klick auf den Knoten → **Last hinzufügen** |
| [Vorgegebene Verschiebung](#prescribed-displacements-support-settlements) (Auflagersenkung) | einen gelagerten Knoten | denselben Dialog oder Klick auf den Knoten → **Verschiebung vorgeben** |
| [Gleichlast](#uniformly-distributed-load), [Trapezlast](#trapezoidal-load), [Einzellast](#concentrated-load) oder [Temperaturlast](#temperature-load) | ein Element | Reiter *Lasten* → **Elementlast hinzufügen** oder Klick auf das Element → **Last hinzufügen** |

## Vorzeichenkonvention {#sign-convention-in-one-line}

x zeigt **nach rechts**, z **nach unten**, und Momente sind **gegen den Uhrzeigersinn** positiv. Ein positives `Fz` oder `fz` ist also eine nach unten gerichtete Last wie die Schwerkraft, eine nach oben gerichtete Last ist negativ.

::model-figure{caption="Jede Last hier ist positiv: Fx = +10 kN nach rechts, Fz = +10 kN nach unten, My = +10 kNm gegen den Uhrzeigersinn"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0] }
supports: { A: pin, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: A, fx: 10 }
  - { node: B, fz: 10 }
  - { node: C, my: 10 }
results: []
---
::

| Positiv | Standardachsen (z nach unten) | [Achsen mit y nach oben](/de/elements/conventions#y-up-axes) |
| --- | --- | --- |
| Horizontale Kraft `Fx`, `fx` | nach rechts | nach rechts |
| Vertikale Kraft | `Fz`, `fz`: **nach unten** | `Fy`, `fy`: **nach oben** |
| Moment | `My`: gegen den Uhrzeigersinn | `Mz`: gegen den Uhrzeigersinn |
| Vertikale Auflagersenkung | `Dz`: nach unten | `Dy`: nach oben |

Lasten in den **lokalen Achsen** eines Elements (**LCS** angehakt) richten sich dagegen nach dem Element: Die lokale x-Achse verläuft vom Anfangsknoten zum Endknoten, die lokale z-Achse ist die lokale x-Achse um 90° im Uhrzeigersinn gedreht und zeigt zur gestrichelten Linie entlang des Elements. Siehe [Elementrichtung](/de/essentials/elements#element-direction). Die vollständige Konvention, auch für die Schnittgrößen, steht unter [Koordinatensystem & Vorzeichenkonventionen](/de/elements/conventions#loads).

## Knotenlasten {#nodal-loads}

Reiter *Lasten* → **Knotenlast hinzufügen** oder Klick auf einen Knoten → **Last hinzufügen**, und **Kraft/Moment** ausgewählt lassen. Geben Sie die Kräfte `Fx`, `Fz` (kN) und das Moment `My` (kNm) mit den [oben](#sign-convention-in-one-line) beschriebenen Vorzeichen ein; die Vorschau zeichnet die Last schon während der Eingabe.

![Knotenlast hinzufügen: Die Vorschau zeigt schon beim Tippen die Richtung](/screenshots/de/loads-nodal.webp){.shot-md}

- Die Komponenten beziehen sich auf die **globalen** Achsen. An einem Knoten mit gedrehten Achsen (einem [schrägen Lager](/de/essentials/nodes-supports#inclined-skewed-supports)) zeigt der Dialog zusätzlich den Schalter **Globale Achsen** / **Knotenachsen**. In Knotenachsen wirken die Komponenten, angezeigt als `Fx′` und `Fz′`, in den eigenen Achsen des Knotens und drehen sich mit, wenn sich der Winkel später ändert. Beim Umschalten werden die Zahlen umgerechnet, sodass die Last bleibt, wie sie ist.
- Ein Knoten kann mehrere Knotenlasten tragen; sie addieren sich.

### Vorgegebene Verschiebungen (Auflagersenkungen) {#prescribed-displacements-support-settlements}

Um ein Lager um einen bestimmten Betrag zu verschieben, wählen Sie im selben Dialog **Vorgegebene Verschiebung** oder klicken auf einen gelagerten Knoten → **Verschiebung vorgeben**. Geben Sie die Verschiebungen `Dx`, `Dz` (positiv nach rechts und nach unten, in der [Verschiebungseinheit](/de/essentials/units-settings#units), standardmäßig m) und die Verdrehung `Ry` (rad, positiv gegen den Uhrzeigersinn) ein.

- Vorgeben lassen sich nur **gehaltene** Freiheitsgrade: Die übrigen Felder sind ausgegraut, und ein Knoten ohne Lager kann überhaupt keine Auflagersenkung haben.
- Ein Knoten hat höchstens eine vorgegebene Verschiebung. Um sie zu ändern, bearbeiten Sie sie, statt eine zweite hinzuzufügen.
- An einem schrägen Lager heißen die Felder `Dx′` und `Dz′`: Die Auflagersenkung wirkt in den eigenen Achsen des Lagers.

Ob eine Auflagersenkung Schnittgrößen hervorruft, hängt vom Tragwerk ab. Dieselbe Senkung des Lagers B um 10 mm, ohne weitere Last:

::div{.shots}

:::model-figure{caption="Einfeldträger: Der Träger neigt sich nur; keine Auflagerreaktionen, M = 0"}
---
nodes: { A: [0, 0], B: [5, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

:::model-figure{caption="Durchlaufend über B: Der Träger verbiegt sich, M = 21,06 kNm über B"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

::

Ein statisch bestimmtes Tragwerk folgt dem Lager ohne Widerstand. Der Durchlaufträger muss sich dagegen verbiegen: Lager B zieht ihn um $\delta = 10\ \text{mm}$ nach unten, wie eine Einzellast in der Mitte eines Einfeldträgers von 10 m Spannweite. Mit $L = 5\ \text{m}$ und $EI = 17\,548\ \text{kNm}^2$ des Beispielstahls ist diese Last $P = 6EI\delta/L^3 = 8{,}423\ \text{kN}$, die Auflagerreaktion in B, und $M_B = PL/2 = 3EI\delta/L^2 = 21{,}06\ \text{kNm}$. Das Tutorial [Durchlaufträger und Auflagersenkung](/de/tutorials/continuous-beam) kombiniert eine Auflagersenkung mit Lasten.

## Elementlasten {#element-loads}

Reiter *Lasten* → **Elementlast hinzufügen** oder Klick auf ein Element → **Last hinzufügen**. Wählen Sie den **Lasttyp**; die Vorschau zeigt die Last am Element schon während der Eingabe. Kräfte geben Sie in kN und Streckenlasten in kN/m ein, oder in den [Einheiten](/de/essentials/units-settings#units), die Sie gewählt haben.

![Elementlast hinzufügen, mit einer gleichmäßig verteilten Last](/screenshots/de/loads-udl.webp){.shot-md}

### Gleichmäßig verteilte Last {#uniformly-distributed-load}

Eine konstante Last je Längeneinheit, `fx` und `fz`, über das ganze Element. Mit angehaktem **LCS** (Standard) wirken sie in den lokalen Achsen des Elements, ohne Haken in den globalen Achsen. Bei einem horizontalen, von links nach rechts gezeichneten Element ist beides dasselbe, bei einem geneigten Stab nicht:

| Gewünscht | Eingabe |
| --- | --- |
| eine Last **senkrecht** zum Stab (Wind auf einen Sparren) | `fz` mit **angehaktem** LCS |
| eine **vertikale** Last je Meter Stablänge (Eigengewicht) | `fz` **ohne** Haken bei LCS |
| eine **vertikale** Last je Meter Grundrissprojektion (Schnee) | nicht direkt möglich: mit $\cos\alpha$ multiplizieren, wobei $\alpha$ die Neigung des Stabs ist, und als vertikale Last eingeben |

Dieselben 10 kN/m auf einem 5 m langen Sparren mit 4 m Grundrisslänge und 3 m Höhe:

::div{.shots}

:::model-figure{caption="LCS nicht angehakt: vertikal, insgesamt 50 kN; M = 25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [M]
---
:::

:::model-figure{caption="LCS angehakt: senkrecht zum Stab; M = 31,25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10, local: true }
results: [M]
---
:::

::

Von Hand: senkrecht $M = qL^2/8 = 10 \cdot 5^2/8 = 31{,}25\ \text{kNm}$; vertikal ergeben die 50 kN, verteilt auf 4 m Spannweite, 12,5 kN/m in der Projektion, also $M = 12{,}5 \cdot 4^2/8 = 25\ \text{kNm}$.

### Trapezlast {#trapezoidal-load}

Eine Last, die sich linear entlang des Elements ändert: `f1x`, `f1z` am **Anfangsknoten**, `f2x`, `f2z` am **Endknoten**. Setzen Sie ein Ende auf null, erhalten Sie eine Dreieckslast.

::model-figure{caption="Dreieckslast von 0 bis 10 kN/m: Auflagerreaktionen 10 und 20 kN, größtes M = 23,09 kNm bei 3,46 m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: [0, 10] }
results: [M, V]
show: [nodeLabels]
---
::

Von Hand: Die Gesamtlast $qL/2 = 30\ \text{kN}$ greift bei $2L/3$ an, also $R_A = 10\ \text{kN}$ und $R_B = 20\ \text{kN}$; die Querkraft ist null und das Moment am größten bei $x = L/\sqrt{3} = 3{,}46\ \text{m}$, wo $M = qL^2/(9\sqrt{3}) = 23{,}09\ \text{kNm}$.

Trapezlasten wirken in den **lokalen Achsen** des Elements (das Kästchen LCS ist gesperrt). Bei einem horizontalen, von links nach rechts gezeichneten Element ist das dasselbe wie global; bei einem geneigten stehen `f1z` und `f2z` senkrecht zum Stab und `f1x`, `f2x` in seiner Richtung.

Auch eine veränderliche **vertikale** Last auf einem Stab mit der Neigung $\alpha$ lässt sich exakt eingeben: Geben Sie an jedem Ende ihre beiden lokalen Komponenten ein, $f_z = q\cos\alpha$ und $f_x = q\sin\alpha$ hangabwärts gerichtet, was negativ ist, wenn das Element von seinem Anfangsknoten aus ansteigt. Für den Sparren oben (4 m Grundrisslänge, 3 m Höhe, von unten gezeichnet) ergibt eine vertikale Last, die von 0 auf 10 kN/m Stablänge anwächst, `f1x` = `f1z` = 0, `f2x` = −6 und `f2z` = 8 kN/m.

::model-figure{caption="Vertikale Last von 0 bis 10 kN/m Stablänge, eingegeben als lokale Komponenten: Auflagerreaktionen 8,333 und 16,67 kN, größtes M = 12,83 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qx: [0, -6], qz: [0, 8], local: true }
results: [M]
show: [nodeLabels]
---
::

Von Hand: Die Resultierende von 25 kN greift bei zwei Dritteln der Grundrisslänge an, also bei 2,67 m, somit $R_B = 25 \cdot 2{,}667/4 = 16{,}67\ \text{kN}$. Über die Projektion von 4 m ist die Last ein Dreieck, das auf 12,5 kN/m ansteigt, also wie oben $M = 12{,}5 \cdot 4^2/(9\sqrt{3}) = 12{,}83\ \text{kNm}$.

### Einzellast {#concentrated-load}

Eine Einzelkraft `Fx`, `Fz` oder ein Einzelmoment `My` an beliebiger Stelle **entlang** eines Elements, ohne zusätzlichen Knoten. **Lastposition vom Anfangsknoten** ist ihr Abstand $a$ vom Anfangsknoten, $0 \le a \le L$. Voreingestellt ist die halbe Elementlänge, abgerundet auf ganze Meter und höchstens 5 m (in US-Einheiten ganze Fuß und höchstens 15 ft); tragen Sie also die Stelle ein, an der Ihre Last tatsächlich steht. **LCS** funktioniert wie bei der Gleichlast.

::model-figure{caption="20 kN bei 2 m auf 6 m Spannweite: V springt von 13,33 auf −6,667 kN, M = 26,67 kNm unter der Last"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M]
show: [nodeLabels]
---
::

Der Querkraftverlauf springt an der Laststelle um `Fz`, und der Momentenverlauf hat dort einen Knick: $R_A = 20 \cdot 4/6 = 13{,}33\ \text{kN}$, $M = 13{,}33 \cdot 2 = 26{,}67\ \text{kNm}$. Ein Einzelmoment `My` lässt stattdessen den Momentenverlauf springen.

### Temperaturlast {#temperature-load}

| Feld | Bedeutung | Wirkung |
| --- | --- | --- |
| **ΔT<sub>c</sub>**, axiale Temperaturänderung | dieselbe Änderung über den ganzen Querschnitt | Verlängerung $\alpha\,\Delta T_c\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>** | Änderung an der unteren Faser minus Änderung an der oberen Faser | Krümmung $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

Beides sind Temperatur*änderungen* gegenüber dem spannungsfreien Zustand, standardmäßig in °C; eine Änderung um 1 °C entspricht 1 K. Temperaturlasten verwenden das **α** des Materials und die **Höhe h** des Querschnitts. Die **untere** Faser liegt auf der Seite der gestrichelten Linie. Ein positives ΔT<sub>b</sub> − ΔT<sub>t</sub> (unten wärmer) verlängert die untere Faser, sodass sich das Element wie ein Balken unter Schwerkraftlast nach unten durchbiegt.

In einem statisch bestimmten Tragwerk erzeugt Temperatur nur Verschiebungen. Erst eine Zwängung (eingespannte Enden, Durchlaufwirkung, überzählige Stäbe) macht daraus Schnittgrößen. Derselbe Stahlträger, 6 m lang und 0,3 m hoch, unten um 20 K wärmer als oben:

::div{.shots}

:::model-figure{caption="Einfeldträger: Er biegt sich in Feldmitte um 3,6 mm durch, M = 0"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [w, M]
---
:::

:::model-figure{caption="Beidseitig eingespannt: Er bleibt gerade, M = −14,04 kNm auf ganzer Länge"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [M, w]
---
:::

::

Von Hand: Die freie Krümmung ist $\kappa = \alpha\,\Delta T/h = 12 \times 10^{-6} \cdot 20/0{,}3 = 8 \times 10^{-4}\ \text{1/m}$. Der Einfeldträger kann sich frei krümmen und biegt sich um $\kappa L^2/8 = 3{,}6\ \text{mm}$ durch. Bei eingespannten Enden muss ein konstantes Moment diese Krümmung aufheben: $M = -EI\kappa = -17\,548 \cdot 8 \times 10^{-4} = -14{,}04\ \text{kNm}$. Die Seite [Ergebnisse von Hand prüfen](/de/guide/verification#temperature-gradient-on-a-simply-supported-beam) rechnet einen weiteren Fall durch.

## Lasten bearbeiten und entfernen {#editing-and-removing-loads}

| Ziel | So geht's |
| --- | --- |
| Werte schnell ändern | Bearbeiten Sie die Komponenten (und das Kästchen LCS) direkt im Reiter *Lasten*. |
| Bearbeitungsdialog öffnen | Doppelklicken Sie in der Ansicht auf die Last oder klicken Sie auf sie → **Last bearbeiten**. Die Lasten erscheinen auch als Chips in den Tabellen *Knoten* und *Elemente*; ein Klick auf einen Chip öffnet die Last zum Bearbeiten. |
| Löschen | Last auswählen und <kbd>Entf</kbd> drücken, auf sie klicken → **Löschen** oder das × im Reiter *Lasten* nutzen. |

Lasten gehören zu ihrem Knoten oder Element: Löschen Sie den Knoten oder das Element, verschwinden auch die Lasten; kopieren Sie Knoten oder Element samt den ausgewählten Lasten, werden die Lasten mitkopiert.

![Der Reiter Lasten: eine Zeile je Last, die Komponenten direkt bearbeitbar](/screenshots/de/loads-table.webp)

## Was nicht verfügbar ist {#what-is-not-available}

::div{.limits}
- **Ein Lastfall.** Keine Lastfallkombinationen: Speichern Sie jeden Lastfall als eigene Datei oder als eigenen Link.
- **Kein Eigengewicht.** Geben Sie es als Gleichlast ohne Haken bei LCS ein: $f_z = \rho\,g\,A$, z. B. $\approx 0{,}22\ \text{kN/m}$ für ein IPE 200.
- **Trapezlasten nur in lokalen Achsen.** Eine veränderliche vertikale Last auf einem geneigten Stab geben Sie über ihre [lokalen Komponenten](#trapezoidal-load) ein.
- **Keine Teilstreckenlasten.** Eine Streckenlast wirkt immer auf dem ganzen Element: Setzen Sie dort einen Knoten, wo sie beginnt oder endet.
::
