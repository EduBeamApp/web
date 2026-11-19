---
title: Erste Schritte
description: "Installieren Sie @edubeam/fem, den FEM-Solver hinter EduBeam, und berechnen Sie mit einem Dutzend Zeilen TypeScript einen Einfeldträger."
order: 1
group: Einführung
---

# Erste Schritte {#getting-started}

@edubeam/fem ist der Finite-Elemente-Solver hinter [EduBeam]{.edubeam}: Jeder Schnittgrößenverlauf, jede Auflagerreaktion und jede Durchbiegung, die die App anzeigt, stammt von ihm. Mit ihm berechnen Sie ebene Träger, Rahmen und Fachwerke aus Ihrem eigenen Code, im Browser oder in Node: Sie erzeugen Übungsaufgaben samt Lösungen, prüfen Hausaufgaben, führen Parameterstudien durch oder setzen einen Solver hinter eine Webseite.

::div{.actions}
[Ersten Träger berechnen](#a-simply-supported-beam) [Beispielprogramme ansehen](/de/solver/beams)
::

Die Bibliothek ist in TypeScript geschrieben, bringt ihre eigenen Typen mit und ist freie Software unter der GPL-3.0. Geschrieben hat sie Bořek Patzák; er entwickelt sie gemeinsam mit Jan Voříšek und weiteren Mitwirkenden weiter.

## Installation {#install}

```bash
npm install @edubeam/fem
```

Sie funktioniert mit `import` und `require`, im Browser und in Node 18 oder neuer, und hat genau eine Abhängigkeit, [mathjs](https://mathjs.org). Bis zur Version 0.3.0 wurde sie als `ts-fem` von GitHub installiert. Falls Sie sie so verwendet haben, ändern Sie Ihre Imports auf `@edubeam/fem`; sonst hat sich nichts geändert.

Um das Beispiel unten in einem leeren Ordner auszuprobieren, machen Sie daraus ein Projekt, das `import` verwendet, und installieren dann:

```bash
npm init -y
npm pkg set type=module
npm install @edubeam/fem
```

Ohne `"type": "module"` in der `package.json` läuft das Beispiel trotzdem, Node gibt aber zuerst eine Warnung aus.

## Ihr erster Träger {#a-simply-supported-beam}

Ein Stahlträger IPE 200 mit 6 m Spannweite auf einem Festlager und einem Loslager, belastet mit 12 kN/m:

```ts [beam.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver

// Durchgehend SI-Einheiten: m, N, Pa. Stahl und ein IPE 200.
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

// Knoten bei [x, y, z] in Metern, mit den Freiheitsgraden, die ihr Lager hält
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // Festlager
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // Loslager
const beam = domain.createBeam2D(1, ['A', 'B'], 'steel', 'IPE200')

// 12 kN/m in Richtung der lokalen z-Achse des Stabs: nach unten, wenn der Träger von links nach rechts definiert ist
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad(1, [0, 12e3], true)

solver.solve()

console.log(beam.computeBendingMomentAt(lc, 3)) // N·m in Feldmitte
console.log(beam.computeShearForceAt(lc, 0)) // N in A
console.log(beam.computeLocalDefl(lc, 2).w[1]) // m in Feldmitte
```

Speichern Sie es als `beam.ts` und starten Sie es mit `node beam.ts`: Node ab Version 22.18 führt TypeScript direkt aus. Die Datei enthält keine Typannotationen; mit einem älteren Node speichern Sie sie einfach als `beam.mjs`. Ausgegeben wird:

```text [Ausgabe]
54000
36000
0.04990940552616746
```

Das sind die Werte aus dem Lehrbuch, $M = qL^2/8 = 54$ kNm und $V = qL/2 = 36$ kN. Hier ist derselbe Träger, berechnet von demselben Solver direkt in Ihrem Browser:

::model-figure{caption="Der Träger aus dem Code oben: 6 m, IPE 200, 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9, g: 81e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 0.8333333 }
---
::

Die Durchbiegung von 49,91 mm liegt 0,28 mm über dem Euler-Bernoulli-Wert $5qL^4/384EI = 49{,}63$ mm. Das ist kein Fehler: Der Stab ist ein Timoshenko-Balken, und 0,28 mm sind $qL^2/8kGA$, die Schubverformung dieses Trägers. Setzen Sie `k` auf einen riesigen Wert wie `1e32`, und der Unterschied verschwindet: siehe [Schubverformung](/de/solver/materials-sections#shear-deformation).

## Was der Code macht {#what-the-code-does}

::div{.steps}
### Solver erzeugen {#make-a-solver}

`new LinearStaticSolver()` bringt eine leere `domain` mit, die das Modell aufnimmt, und einen Lastfall, `solver.loadCases[0]`.

### Modell beschreiben {#describe-the-model}

Materialien und Querschnitte, Knoten mit ihren Lagern, dann die Stäbe zwischen den Knoten. Alles hat eine Bezeichnung, einen String oder eine Zahl, über die der Rest des Modells darauf verweist. Siehe [Knoten und Lager](/de/solver/nodes-supports), [Materialien und Querschnitte](/de/solver/materials-sections) und [Stäbe und Gelenke](/de/solver/members-hinges).

### Belasten {#load-it}

Lasten gehören zu einem Lastfall: Kräfte an Knoten, Lasten entlang von Stäben, Temperatur und Auflagersenkungen. Siehe [Knoten- und Stablasten](/de/solver/loads).

### Berechnen {#solve}

`solver.solve()` assembliert und löst alle Lastfälle. Siehe [Berechnung](/de/solver/solving).

### Ergebnisse auslesen {#read-the-results}

Schnittgrößen an jeder Stelle eines Stabs, Durchbiegungen, Stabendkräfte, Knotenverschiebungen und Auflagerreaktionen. Siehe [Ergebnisse auslesen](/de/solver/results) und für Diagramme [Ergebnisse zeichnen](/de/solver/drawing).
::

## Einheiten und Vorzeichen in Kürze {#axes-and-signs}

SI-Einheiten hinein, SI-Einheiten heraus. Das Modell liegt in der x-z-Ebene, und **z zeigt nach unten**: Ein positives `fz` wirkt nach unten, und der Kopf einer 4 m hohen Stütze liegt bei $z = -4$. Positionen entlang eines Stabs werden in Metern ab seinem ersten Knoten gemessen. Ein Moment mit Zug unten ist positiv. Die vollständige Übersicht steht unter [Einheiten und Vorzeichen](/de/solver/conventions).

## Sechs typische Stolpersteine {#pitfalls}

1. **z zeigt nach unten.** Lasten infolge Schwerkraft sind positiv, und alles oberhalb der Lager hat ein negatives z. Siehe [Achsen](/de/solver/conventions#axes).
2. **Die Richtung eines Stabs bestimmt das Vorzeichen von M und w.** Definieren Sie Träger von links nach rechts und Stützen von unten nach oben, dann stimmen die Vorzeichen mit dem Lehrbuch überein. Siehe [Stabrichtung](/de/solver/conventions#member-direction).
3. **Ein fehlender Parameter ergibt `NaN` oder Unsinn, aber keinen Fehler.** Ein Querschnitt braucht `a`, `iy` und `k`; ein Material braucht `e` und außerdem `g`, sofern `k` nicht riesig ist. Siehe [Materialien und Querschnitte](/de/solver/materials-sections).
4. **Nachdem Sie Knoten oder Stäbe hinzugefügt oder Lager geändert haben,** setzen Sie vor der nächsten Berechnung `solver.codeNumberGenerated = false`. Siehe [Erneut berechnen nach einer Änderung](/de/solver/solving#solving-again-after-a-change).
5. **Auflagerreaktionen kommen als mathjs-Matrix oder als Array zurück,** in der Reihenfolge, in der die Freiheitsgrade des Lagers angegeben wurden. Siehe [Auflagerreaktionen](/de/solver/results#reactions).
6. **Ein Mechanismus führt nicht immer zu einem Fehler.** Eine Verschiebung von $10^{12}$ m bedeutet, dass sich das Tragwerk frei bewegen kann. Siehe [Wenn die Berechnung scheitert](/de/solver/solving#when-solving-fails).

## Wie es weitergeht {#next}

::card-grid{cols="2"}
:::card{title="Beispielprogramme" icon="lucide:book-open" to="/de/solver/beams"}
Vollständige, geprüfte Programme: Träger, Rahmen, Fachwerke, ein Übungsblatt mit Lösungsblatt und ein kleiner HTTP-Server.
:::
:::card{title="Ergebnisse zeichnen" icon="lucide:chart-spline" to="/de/solver/drawing"}
Übergeben Sie ein berechnetes Modell an @edubeam/plot und erhalten Sie seine Diagramme als SVG, in Vue oder aus einem Node-Skript.
:::
:::card{title="API-Referenz" icon="lucide:list-tree" to="/de/solver/reference"}
Alle Klassen, Methoden und Argumente, mit Einheiten und dem, was sie zurückgeben.
:::
:::card{title="Die Theorie" icon="lucide:sigma" to="/de/elements/beam"}
Das Balkenelement, seine Steifigkeitsmatrix und Transformation im Theoriehandbuch von EduBeam.
:::
::
