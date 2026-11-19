---
title: API-Referenz
description: "Alle Klassen, Methoden und Argumente von @edubeam/fem 0.3, mit Einheiten, Standardwerten und der Form dessen, was sie jeweils zurückgeben."
order: 16
group: Referenz
---

# API-Referenz {#api-reference}

Was `@edubeam/fem` 0.3 exportiert, gruppiert nach dem Zweck. Die Einheiten sind durchgehend SI: m, N, N·m, N/m, Pa, K und rad. Bezeichnungen (`LabelType`) sind `string | number` und werden als Strings gespeichert. Methoden, die hier nicht aufgeführt sind, sind intern: Sie sind in TypeScript nur deshalb öffentlich, weil die Klassen des Solvers sie untereinander aufrufen.

## Exporte {#exports}

| Export | Art | Abschnitt |
| --- | --- | --- |
| `LinearStaticSolver` | Klasse | [Berechnungen](#analyses) |
| `Solver` | abstrakte Klasse | [Berechnungen](#analyses) |
| `Domain` | Klasse | [Domain](#domain) |
| `Node` | Klasse | [Node](#node) |
| `Beam2D`, `Element` | Klassen | [Elemente](#elements) |
| `Material`, `CrossSection` | Klassen | [Materialien und Querschnitte](#materials-and-sections) |
| `LoadCase` | Klasse | [Lasten](#loads) |
| `NodalLoad`, `BeamConcentratedLoad`, `BeamElementUniformEdgeLoad`, `BeamElementTrapezoidalEdgeLoad`, `BeamTemperatureLoad`, `PrescribedDisplacement`, `Load`, `BeamElementLoad` | Klassen | [Lasten](#loads) |
| `DofID` | Enum | [DofID](#dofid) |
| `LabelType`, `EnumDictionary`, `MaterialParameters`, `CrossSectionParameters` | Typen | |

## Berechnungen {#analyses}

### `LinearStaticSolver` {#linearstaticsolver}

```ts
const solver = new LinearStaticSolver()
```

| Eigenschaft/Methode | Typ | Beschreibung |
| --- | --- | --- |
| `domain` | `Domain` | Das Modell |
| `loadCases` | `LoadCase[]` | Enthält anfangs einen Lastfall, `'DefaultLC'`. Weitere fügen Sie mit `new LoadCase(label, solver.domain)` hinzu: [Lastfälle](/de/solver/load-cases). |
| `solve()` | `void` | Nummeriert die Gleichungen, falls nötig, assembliert und löst alle Lastfälle. Kann bei einem [Mechanismus](/de/solver/solving#when-solving-fails) einen Fehler werfen, tut es aber nicht immer. Ab 0.3.1 ohne Konsolenausgabe; 0.3.0 protokollierte die Rechenzeit. |
| `codeNumberGenerated` | `boolean` | Auf `false` setzen, nachdem Knoten oder Stäbe hinzugefügt oder entfernt oder Lager geändert wurden: [warum](/de/solver/solving#solving-again-after-a-change) |
| `neq`, `pneq` | `number` | Anzahl der freien und der gelagerten Freiheitsgrade, nach einer Berechnung |
| `k` | mathjs-`Matrix` | Die assemblierte globale Steifigkeitsmatrix, nach einer Berechnung |
| `getNodeDofIDs(label)` | `number[]` | Die Freiheitsgrade eines Knotens, nach einer Berechnung |

`EigenValueDynamicSolver` existiert im Quellcode, wird aber nicht exportiert.

## Domain {#domain}

`solver.domain` hält das Modell in vier `Map`s, deren Schlüssel die Bezeichnung als String ist: `nodes`, `elements`, `materials`, `crossSections`. Methoden zum Entfernen gibt es nicht: `domain.nodes.delete(label)` und `domain.elements.delete(label)` entfernen einen Knoten oder einen Stab, danach muss [neu nummeriert](/de/solver/solving#solving-again-after-a-change) werden.

| Methode | Rückgabe | Beschreibung |
| --- | --- | --- |
| `createNode(label, coords?, bcs?)` | `Node` | `coords` `[x, y, z]` in m (Standard `[0, 0, 0]`), `bcs` die gelagerten `DofID`s (Standard: keine) |
| `createBeam2D(label, nodes, mat, cs, hinges?)` | `Beam2D` | `nodes` `[first, second]`, `hinges` `[atFirst, atSecond]` (Standard `[false, false]`) |
| `createMaterial(label, params?)` | `Material` | Siehe [Materialien und Querschnitte](#materials-and-sections) |
| `createCrossSection(label, params?)` | `CrossSection` | Siehe [Materialien und Querschnitte](#materials-and-sections) |
| `getNode(label)`, `getElement(label)`, `getMaterial(label)`, `getCS(label)` | das Objekt | Wirft bei einer unbekannten Bezeichnung einen `RangeError`. `getElement` hat den Typ `Element`: Schreiben Sie `as Beam2D`, um Ergebnisse auszulesen. |

Ein Objekt mit einer bereits vergebenen Bezeichnung ersetzt das alte.

## Node {#node}

| Eigenschaft/Methode | Typ | Beschreibung |
| --- | --- | --- |
| `label` | `string` | |
| `coords` | `number[]` | `[x, y, z]`, m. Ändern Sie den Wert, um den Knoten zu verschieben. |
| `bcs` | `Set<DofID>` | Gelagerte Freiheitsgrade. Ersetzen Sie das Set, um das Lager zu ändern. |
| `lcs` | `number[][] \| undefined` | Die gedrehten Achsen des Knotens, falls vorhanden |
| `updateLcs({ locx, locy }?)` | `void` | Dreht die Achsen des Knotens: `locx` seine x-Achse in globalen Komponenten, `locy` `[0, 1, 0]`. Ohne Argument werden sie zurückgesetzt. |
| `hasLcs()` | `boolean` | Ob die Achsen gedreht sind |
| `getUnknowns(lc, dofs)` | `Matrix`, oder `number` für einen Freiheitsgrad | Verschiebungen (m) und Verdrehungen (rad), in den Achsen des Knotens |
| `getReactions(lc, global?)` | `{ dofs, values }` | Auflagerreaktionen an den gelagerten Freiheitsgraden, in der Reihenfolge von `bcs`: N, N·m. `values` ist eine mathjs-`Matrix` bei mehreren, ein Array mit einem Element bei einem, `[]` bei einem freien Knoten. Mit `global` `true` an einem gedrehten Knoten: alle drei Freiheitsgrade in globalen Achsen, `dofs` `[0, 2, 4]`, `values` ein Array mit 0, wo nichts gehalten wird. [Mehr zum Auslesen](/de/solver/results#reactions). |

## Elemente {#elements}

### `Beam2D` {#beam2d}

Ein Timoshenko-Balken mit zwei Knoten in der x-z-Ebene, drei Freiheitsgrade pro Knoten (`Dx`, `Dz`, `Ry`). `x` ist in Metern ab dem ersten Knoten angegeben; `n` ist eine Anzahl von Abschnitten und ergibt n + 1 Punkte.

| Eigenschaft/Methode | Rückgabe | Beschreibung |
| --- | --- | --- |
| `label`, `nodes`, `mat`, `cs` | `string`, `string[]`, `string`, `string` | |
| `hinges` | `[boolean, boolean]` | Momentenfreigaben am ersten und zweiten Knoten |
| `computeNormalForceAt(lc, x)` | `number` | N, Zug positiv |
| `computeShearForceAt(lc, x)` | `number` | V, positiv, wo M entlang der lokalen x-Achse wächst |
| `computeBendingMomentAt(lc, x)` | `number` | M, positiv bei Zug auf der Seite der lokalen +z-Achse |
| `computeNormalForce(lc, n)` | `{ x, N }` | N an n + 1 Punkten |
| `computeShearForce(lc, n)` | `{ x, V }` | V an n + 1 Punkten |
| `computeBendingMoment(lc, n)` | `{ x, M }` | M an n + 1 Punkten |
| `computeLocalDefl(lc, n)` | `{ u, w }` | Verschiebungen entlang und quer zum Stab, lokale Achsen, m |
| `computeGlobalDefl(lc, n)` | `{ u, w }` | Dasselbe in globalem x und z |
| `computeEndForces(lc)` | `Matrix` | `[X12, Z12, M12, X21, Z21, M21]`, die Kräfte, die die Knoten auf den Stab ausüben, lokale Achsen |
| `computeEndDisplacement(lc)` | `Matrix` | Stabendverschiebungen in lokalen Achsen, einschließlich der Gelenkverdrehungen |
| `computeGeo()` | `{ l, dx, dz }` | Länge und Projektionen, m |
| `computeT()` | `Matrix` | 6 × 6 Transformationsmatrix, global nach lokal |
| `computeLocalStiffnessMtrx()` | `{ answer }` | `answer`: 6 × 6 lokale Steifigkeitsmatrix, Gelenke herauskondensiert |
| `computeStiffness()` | `Matrix` | 6 × 6 globale Steifigkeitsmatrix |
| `computeShearFactor()` | `number` | $\Phi = 12EI_y/kGAL^2$ |
| `getMaterial()`, `getCS()` | `Material`, `CrossSection` | |

An einer Einzellast liefern die Methoden `…At` den Wert direkt dahinter. `Element` ist die abstrakte Basisklasse von `Beam2D`; diesen Typ verwenden `domain.elements` und `getElement`.

## Materialien und Querschnitte {#materials-and-sections}

| `MaterialParameters` | Einheit | Standard | Verwendet für |
| --- | --- | --- | --- |
| `e` | Pa | 1 | Steifigkeit |
| `g` | Pa | 1 | Schubsteifigkeit |
| `alpha` | 1/K | 1 | Temperaturlasten |
| `d` | kg/m³ | 1 | nichts in der Statik |

| `CrossSectionParameters` | Einheit | Standard | Verwendet für |
| --- | --- | --- | --- |
| `a` | m² | keiner, erforderlich | Dehn- und Schubsteifigkeit |
| `iy` | m⁴ | keiner, erforderlich | Biegesteifigkeit |
| `k` | – | keiner, erforderlich | Schubsteifigkeit $kGA$; `1e32` für keine Schubverformung |
| `h` | m | keiner | Temperaturunterschiede (`NaN` ohne ihn) |
| `iz`, `dyz`, `j` | m⁴ | keiner | von `Beam2D` nicht verwendet |

Ein fehlender Materialparameter ist 1, kein typischer Wert; ein fehlendes `a`, `iy` oder `k` macht jedes Ergebnis zu `NaN`. In keinem Fall wird ein Fehler geworfen. Beide Klassen haben eine Methode `change(params)`, die die übergebenen Parameter setzt, und speichern die Parameter als gleichnamige Eigenschaften.

## Lasten {#loads}

### `LoadCase` {#loadcase}

| Methode | Rückgabe | Werte |
| --- | --- | --- |
| `createNodalLoad(node, values, lcs?)` | `NodalLoad` | `{ [DofID.Dx]: N, [DofID.Dz]: N, [DofID.Ry]: N·m }`; `lcs` (Standard `false`) `true`: in den gedrehten Achsen des Knotens |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | `BeamElementUniformEdgeLoad` | N/m über den ganzen Stab |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | `BeamElementTrapezoidalEdgeLoad` | N/m am ersten und zweiten Knoten, linear dazwischen |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | `BeamConcentratedLoad` | N, N, N·m, in `a` m Abstand vom ersten Knoten |
| `createBeamTemperatureLoad(el, [dTc, dTb, dTt])` | `BeamTemperatureLoad` | K: Schwerpunkt, untere Faser, obere Faser |
| `createPrescribedDisplacement(node, values)` | `PrescribedDisplacement` | `{ [DofID.Dz]: m, … }` an gelagerten Freiheitsgraden, in den Achsen des Knotens; an freien Freiheitsgraden ignoriert |

Bei Stablasten bedeutet `lcs` `true` lokale Achsen (x entlang des Stabs, z quer dazu), `false` globale Achsen. Streckenlasten gelten pro Meter Stablänge. Beispiele finden Sie unter [Knoten- und Stablasten](/de/solver/loads).

| Eigenschaft/Methode | Typ | Beschreibung |
| --- | --- | --- |
| `label` | `string` | |
| `nodalLoadList` | `NodalLoad[]` | |
| `elementLoadList` | `BeamElementLoad[]` | Stab- und Temperaturlasten |
| `prescribedBC` | `PrescribedDisplacement[]` | |
| `solved` | `boolean` | `true` nach einer erfolgreichen Berechnung |
| `getElementLoadsOnElement(el)` | `BeamElementLoad[]` | Die Lasten auf einem Stab |

Die Lastobjekte halten ihre Werte in öffentlichen Eigenschaften, die Sie vor einer erneuten Berechnung ändern können: `values` (und `lcs`) bei `NodalLoad`, `BeamElementUniformEdgeLoad`, `BeamConcentratedLoad` und `BeamTemperatureLoad`; `startValues` und `endValues` bei `BeamElementTrapezoidalEdgeLoad`; `prescribedValues` bei `PrescribedDisplacement`. Jedes hat ein `target`, die Bezeichnung dessen, worauf es wirkt.

## DofID {#dofid}

| Name | Wert | Von `Beam2D` verwendet |
| --- | --- | --- |
| `Dx` | 0 | ja |
| `Dy` | 1 | nein |
| `Dz` | 2 | ja |
| `Rx` | 3 | nein |
| `Ry` | 4 | ja |
| `Rz` | 5 | nein |

## Ergebnisse {#results}

Ergebnisse werden an einem `Beam2D` (Schnittgrößen, Durchbiegungen, Stabendkräfte) und an einem `Node` (Verschiebungen, Auflagerreaktionen) ausgelesen, immer für einen bestimmten `LoadCase` und nach `solve()`: siehe die beiden Tabellen oben und [Ergebnisse auslesen](/de/solver/results) für Beispiele und Vorzeichen. Kurz gefasst:

| Gesucht | Aufruf |
| --- | --- |
| Auflagerreaktionen, N und N·m | `node.getReactions(lc)` |
| Verschiebungen, m, und Verdrehungen, rad | `node.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])` |
| N, V oder M an einer Stelle, N und N·m | `beam.computeNormalForceAt(lc, x)`, `computeShearForceAt`, `computeBendingMomentAt` |
| N, V oder M entlang eines Stabs | `beam.computeNormalForce(lc, n)`, `computeShearForce`, `computeBendingMoment` |
| Biegelinie, m | `beam.computeLocalDefl(lc, n)`, `computeGlobalDefl` |
| Stabendkräfte, N und N·m | `beam.computeEndForces(lc)` |
| Eine Abbildung von allem | `StructurePlot` oder `structureSvg` aus [@edubeam/plot](/de/solver/drawing) |
