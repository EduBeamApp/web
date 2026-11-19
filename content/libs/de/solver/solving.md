---
title: Berechnung
description: "Was solve() in @edubeam/fem macht, wann Sie nach einer Änderung neu nummerieren, wie Sie einen Mechanismus erkennen und wie groß ein Modell sein darf."
order: 9
group: Berechnung und Ergebnisse
---

# Berechnung {#solving}

```ts
solver.solve()
```

`solve()` nummeriert die Gleichungen, assembliert die globale Steifigkeitsmatrix und die Lastvektoren aller Lastfälle und löst nach den Verschiebungen und den Auflagerreaktionen auf. Danach lässt sich jedes [Ergebnis](/de/solver/results) auslesen; davor wirft jeder Leseversuch einen `TypeError`. Die Schritte sind dieselben wie in [Wie EduBeam ein Modell berechnet](/de/elements/analysis) im Theoriehandbuch.

Die Lösung ist für das lineare Modell exakt: Biegelinie und Schnittgrößen entlang jedes Stabs stammen aus geschlossenen Lösungen des Timoshenko-Balkens. Es gibt also kein Netz, das verfeinert werden müsste, und keinen Grund, Stäbe für genaue Verläufe zu unterteilen.

Ab Version 0.3.1 schreibt `solve()` nichts mehr in die Konsole; 0.3.0 gab bei jedem Aufruf eine Zeile wie `Solution took 9 [ms]` aus.

## Erneut berechnen nach einer Änderung {#solving-again-after-a-change}

Ändern sich nur Zahlen im Modell, genügt ein weiteres `solve()`. Ändert sich, welche Gleichungen es gibt, braucht es vorher eine Zeile mehr:

```ts
domain.createNode('C', [10, 0, 0], [DofID.Dz])
domain.createBeam2D(2, ['B', 'C'], 1, 1)
solver.codeNumberGenerated = false // die Freiheitsgrade haben sich geändert: neu nummerieren
solver.solve()
```

| Änderung | Dann |
| --- | --- |
| Lastwerte, neue oder entfernte Lasten | `solve()` |
| Knotenkoordinaten, Materialien, Querschnitte, Gelenke | `solve()` |
| Knoten oder Stäbe hinzufügen | `codeNumberGenerated = false`, dann `solve()` |
| Knoten oder Stäbe entfernen: `domain.nodes.delete(label)`, `domain.elements.delete(label)` | `codeNumberGenerated = false`, dann `solve()` |
| Lager eines Knotens ändern, `node.bcs` | `codeNumberGenerated = false`, dann `solve()` |

Fehlt diese Zeile nach dem Hinzufügen eines Knotens, wirft `solve()` einen `TypeError`. Fehlt sie nach dem Ändern eines Lagers, rechnet der Solver **stillschweigend** mit den alten Lagern. Setzen Sie `codeNumberGenerated` im Zweifel zurück: Das Nummerieren kostet so gut wie nichts. Wer einen Stab entfernt, muss auch seine Lasten aus `lc.elementLoadList` entfernen, sonst wirft `solve()` einen `RangeError` für den fehlenden Stab.

Für viele Varianten eines Modells, etwa in einer Parameterstudie, ist ein neuer Solver für jede Variante einfacher und genauso schnell: siehe das [Beispiel zur Einflusslinie](/de/solver/scripts#an-influence-line-as-csv).

## Wenn die Berechnung scheitert {#when-solving-fails}

Ein Tragwerk, das sich ohne Verformung bewegen kann (ein Mechanismus), hat eine singuläre Steifigkeitsmatrix. Manchmal bemerkt `solve()` das und wirft einen Fehler:

```text
Error: Linear system cannot be solved since matrix is singular
```

Oft aber nicht: Rundungsfehler lassen die Matrix lösbar erscheinen, und Sie erhalten Verschiebungen von $10^{12}$ m oder vernünftig aussehende Zahlen für ein Tragwerk, das frei verschieblich ist. Ein Träger auf zwei Loslagern zum Beispiel wird klaglos berechnet, solange ihn nichts seitlich schiebt. Prüfen Sie die Lager deshalb selbst, und werten Sie riesige Verschiebungen als Zeichen eines Mechanismus.

Typische Ursachen:

- zu wenige Lager, etwa ein Träger auf zwei Loslagern;
- Lager, die das Tragwerk nicht halten können: Ihre Wirkungslinien sind alle parallel oder schneiden sich alle in einem Punkt;
- ein Gelenk zu viel, etwa drei in einer Reihe;
- ein Moment an einem Knoten, an dem jedes Stabende gelenkig angeschlossen ist.

Die Fehlermeldung sagt nicht, wo das Problem liegt. Die EduBeam-App sucht vor der Berechnung nach Mechanismen, findet die mögliche Bewegung und animiert sie; dasselbe Modell dort aufzubauen ist oft der schnellste Weg, sie zu sehen. Die [Fehlerbehebung](/de/reference/troubleshooting) listet die üblichen Ursachen auf.

Ein fehlender Knoten, ein fehlendes Material oder ein fehlender Querschnitt führt zu einem `RangeError`, der das fehlende Objekt benennt. Fehlende Querschnittsparameter führen zu gar keinem Fehler: Jedes Ergebnis ist `NaN`. Siehe [Materialien und Querschnitte](/de/solver/materials-sections#cross-section).

## Modellgröße {#model-size}

Der Solver arbeitet mit vollbesetzten Matrizen und ist für Modelle in der Größe von Lehrbeispielen gebaut. Auf einem Laptop in Node wird eine gerade Reihe von Stäben ungefähr in dieser Zeit berechnet:

| Stäbe | Freiheitsgrade | Zeit |
| --- | --- | --- |
| 50 | 150 | 0,1 s |
| 100 | 300 | 0,2 s |
| 200 | 600 | 1 s |
| 400 | 1200 | 10 s |

Jede Verdopplung des Modells kostet sechs- bis neunmal so viel Zeit.

Jede Aufgabe, jeder Rahmen und jedes Fachwerk einer Statikvorlesung passt problemlos hinein. Für Modelle mit Tausenden von Stäben ist der Solver nicht gedacht.

## Keine weiteren Berechnungsarten {#no-other-analyses}

Diese Version berechnet nur lineare Statik. Der Quellcode enthält einen Eigenwertlöser für Eigenfrequenzen, er gehört aber nicht zum veröffentlichten Paket: `EigenValueDynamicSolver` lässt sich nicht aus `@edubeam/fem` importieren.
