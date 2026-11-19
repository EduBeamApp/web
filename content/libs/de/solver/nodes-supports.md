---
title: Knoten und Lager
description: "Knoten eines @edubeam/fem-Modells anlegen, über gehaltene Freiheitsgrade lagern, Lagerachsen für ein schräges Loslager drehen und Knoten nachträglich ändern."
order: 3
group: Modellierung
---

# Knoten und Lager {#nodes-and-supports}

Knoten sind die Punkte, an denen Stäbe zusammentreffen. Ein Lager ist kein eigenes Objekt, sondern die Liste der Freiheitsgrade, die ein Knoten festhält. Die Codeausschnitte auf dieser Seite sind Teile eines Programms wie in [Erste Schritte](/de/solver/getting-started) und verwenden dessen `solver`, `domain` und `lc`.

## Knoten anlegen {#create-a-node}

```ts
domain.createNode(label, [x, y, z], bcs)
```

| Argument | Typ | Bedeutung |
| --- | --- | --- |
| `label` | `string \| number` | Seine Bezeichnung, als String gespeichert: `1` und `'1'` sind derselbe Knoten |
| `coords` | `number[]` | `[x, y, z]` in Metern, mit `y = 0`. z zeigt nach unten. |
| `bcs` | `DofID[]` | Die Freiheitsgrade, die das Lager hält. Für einen freien Knoten weglassen. |

Die Methode gibt den `Node` zurück; `domain.getNode(label)` findet ihn wieder. Eine bereits vergebene Bezeichnung ersetzt den alten Knoten.

```ts
import { DofID } from '@edubeam/fem'

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [0, 0, -4]) // frei: der Kopf einer 4 m hohen Stütze
```

## Lager {#supports}

Jedes Lager der EduBeam-App ist eine Menge gehaltener Freiheitsgrade:

| Lager | `bcs` | Hält |
| --- | --- | --- |
| Einspannung | `[DofID.Dx, DofID.Dz, DofID.Ry]` | alles |
| Festlager | `[DofID.Dx, DofID.Dz]` | beide Verschiebungen, frei drehbar |
| Loslager | `[DofID.Dz]` | die vertikale Verschiebung, verschieblich in x |
| Vertikales Loslager | `[DofID.Dx]` | die horizontale Verschiebung, verschieblich in z |
| Parallelführung | `[DofID.Dz, DofID.Ry]` | die vertikale Verschiebung und die Verdrehung, verschieblich in x |
| Vertikale Parallelführung | `[DofID.Dx, DofID.Ry]` | die horizontale Verschiebung und die Verdrehung, verschieblich in z |
| Nur Verdrehung gehalten | `[DofID.Ry]` | die Verdrehung |

In der Reihenfolge, in der Sie sie angeben, kommen auch die [Auflagerreaktionen](/de/solver/results#reactions) zurück. Ein Tragwerk braucht mindestens drei gehaltene Freiheitsgrade, und zwar so angeordnet, dass es sich nicht als Mechanismus bewegen kann: siehe [Wenn die Berechnung scheitert](/de/solver/solving#when-solving-fails).

Ein gehaltener Freiheitsgrad kann auch um einen vorgegebenen Betrag verschoben werden, als Auflagersenkung: siehe [Vorgegebene Verschiebungen](/de/solver/temperature-settlements#prescribed-displacements).

## Schräge Lager {#inclined-supports}

Ein Loslager auf einer schrägen Fläche hält den Knoten senkrecht zur Fläche, nicht vertikal. Drehen Sie die Achsen des Knotens mit `updateLcs`; seine `bcs` beziehen sich dann auf die gedrehten Achsen. Im Programm der Seite „Erste Schritte“ legen Sie B stattdessen so an:

```ts
const b = domain.createNode('B', [6, 0, 0], [DofID.Dz]) // hält seine eigene z-Richtung
const a = (30 * Math.PI) / 180 // 30°, von x nach z: auf dem Bildschirm im Uhrzeigersinn
b.updateLcs({ locx: [Math.cos(a), 0, Math.sin(a)], locy: [0, 1, 0] })
```

`locx` ist die eigene x-Achse des Knotens als Vektor in globalen Achsen, `locy` seine y-Achse, die `[0, 1, 0]` bleibt. In der EduBeam-App tragen Sie denselben Winkel als *Knoten-LKS-Winkel* des Knotens ein: 30°.

Nach `solve()` wirkt die Auflagerreaktion in B senkrecht zur schrägen Fläche, und das Festlager in A nimmt die horizontale Komponente auf:

```ts
b.getReactions(lc).values // [-41569]: N in der eigenen z-Richtung von B, 36 kN / cos 30°
b.getReactions(lc, true).values // [20785, -36000, 0]: in x, in z, Moment
```

::model-figure{caption="Ein um 30° gedrehtes Loslager: Seine Auflagerreaktion steht senkrecht zur schrägen Fläche, und der Träger steht unter Zug"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, N]
show: [nodeLabels]
---
::

Die vertikale Komponente ist weiterhin $qL/2 = 36$ kN; die horizontale, $36 \tan 30° = 20{,}8$ kN, zieht von beiden Enden am Träger. Das Moment ändert sich nicht.

An einem gedrehten Knoten werden Verschiebungen und Auflagerreaktionen in seinen eigenen Achsen angegeben, außer Sie übergeben `true` für globale Achsen. Knotenlasten an ihm sind global, sofern Sie nichts anderes angeben: siehe [Knotenlasten](/de/solver/loads#nodal-loads). `node.updateLcs()` ohne Argument dreht die Achsen zurück.

## Knoten ändern {#change-a-node}

Ein Knoten ist ein einfaches Objekt: Ändern Sie `node.coords`, um ihn zu verschieben, oder ersetzen Sie `node.bcs`, ein `Set<DofID>`, um sein Lager zu ändern.

```ts
domain.getNode('B').coords = [8, 0, 0] // größere Spannweite: solve() genügt
domain.getNode('A').bcs = new Set(fixed) // neues Lager: zuerst neu nummerieren
solver.codeNumberGenerated = false
solver.solve()
```

Neue Lager oder hinzugefügte und entfernte Knoten ändern das Gleichungssystem: Ohne `codeNumberGenerated = false` rechnet der Solver **stillschweigend mit den alten Lagern** weiter. [Erneut berechnen nach einer Änderung](/de/solver/solving#solving-again-after-a-change) listet auf, welche Änderungen das erfordern.
