---
title: Riferimento API
description: "Tutte le classi, i metodi e gli argomenti di @edubeam/fem 0.3, con unità, valori predefiniti e la forma di ciò che ogni metodo restituisce."
order: 16
group: Riferimento
source: site
---

# Riferimento API {#api-reference}

Ciò che `@edubeam/fem` 0.3 esporta, raggruppato per uso. Le unità sono SI ovunque: m, N, N·m, N/m, Pa, K e rad. Le etichette (`LabelType`) sono `string | number`, memorizzate come stringhe. I metodi non elencati qui sono interni: sono pubblici in TypeScript solo perché le classi del solutore li chiamano.

## Export {#exports}

| Export | Tipo | Dove |
| --- | --- | --- |
| `LinearStaticSolver` | classe | [Analisi](#analyses) |
| `Solver` | classe astratta | [Analisi](#analyses) |
| `Domain` | classe | [Domain](#domain) |
| `Node` | classe | [Node](#node) |
| `Beam2D`, `Element` | classi | [Elementi](#elements) |
| `Material`, `CrossSection` | classi | [Materiali e sezioni](#materials-and-sections) |
| `LoadCase` | classe | [Carichi](#loads) |
| `NodalLoad`, `BeamConcentratedLoad`, `BeamElementUniformEdgeLoad`, `BeamElementTrapezoidalEdgeLoad`, `BeamTemperatureLoad`, `PrescribedDisplacement`, `Load`, `BeamElementLoad` | classi | [Carichi](#loads) |
| `DofID` | enum | [DofID](#dofid) |
| `LabelType`, `EnumDictionary`, `MaterialParameters`, `CrossSectionParameters` | tipi | |

## Analisi {#analyses}

### `LinearStaticSolver` {#linearstaticsolver}

```ts
const solver = new LinearStaticSolver()
```

| Nome | Tipo | Descrizione |
| --- | --- | --- |
| `domain` | `Domain` | Il modello |
| `loadCases` | `LoadCase[]` | Parte con un caso, `'DefaultLC'`. Aggiungine altri con `new LoadCase(label, solver.domain)`: [Casi di carico](/it/solver/load-cases). |
| `solve()` | `void` | Numera le equazioni se serve, assembla e risolve ogni caso di carico. Può lanciare un errore in presenza di un [meccanismo](/it/solver/solving#when-solving-fails), ma non sempre lo fa. Silenzioso dalla 0.3.1; la 0.3.0 stampava il tempo impiegato. |
| `codeNumberGenerated` | `boolean` | Impostalo a `false` dopo aver aggiunto o rimosso nodi o aste, o modificato i vincoli: [perché](/it/solver/solving#solving-again-after-a-change) |
| `neq`, `pneq` | `number` | Numero di GdL liberi e di GdL vincolati, dopo il calcolo |
| `k` | mathjs `Matrix` | La matrice di rigidezza globale assemblata, dopo il calcolo |
| `getNodeDofIDs(label)` | `number[]` | I GdL di un nodo, dopo il calcolo |

`EigenValueDynamicSolver` esiste nel sorgente, ma non è esportato.

## Domain {#domain}

`solver.domain` contiene il modello in quattro `Map` che hanno come chiave l’etichetta in forma di stringa: `nodes`, `elements`, `materials`, `crossSections`. Non esistono metodi di rimozione: `domain.nodes.delete(label)` e `domain.elements.delete(label)` rimuovono un nodo o un’asta, e poi serve la [rinumerazione](/it/solver/solving#solving-again-after-a-change).

| Metodo | Restituisce | Descrizione |
| --- | --- | --- |
| `createNode(label, coords?, bcs?)` | `Node` | `coords` `[x, y, z]` in m (predefinito `[0, 0, 0]`), `bcs` i `DofID` vincolati (predefinito nessuno) |
| `createBeam2D(label, nodes, mat, cs, hinges?)` | `Beam2D` | `nodes` `[first, second]`, `hinges` `[atFirst, atSecond]` (predefinito `[false, false]`) |
| `createMaterial(label, params?)` | `Material` | Vedi [Materiali e sezioni](#materials-and-sections) |
| `createCrossSection(label, params?)` | `CrossSection` | Vedi [Materiali e sezioni](#materials-and-sections) |
| `getNode(label)`, `getElement(label)`, `getMaterial(label)`, `getCS(label)` | l’oggetto | Lancia un `RangeError` per un’etichetta sconosciuta. `getElement` ha il tipo `Element`: scrivi `as Beam2D` per leggerne i risultati. |

Creare un oggetto con un’etichetta già in uso sostituisce quello precedente.

## Node {#node}

| Nome | Tipo | Descrizione |
| --- | --- | --- |
| `label` | `string` | |
| `coords` | `number[]` | `[x, y, z]`, m. Cambialo per spostare il nodo. |
| `bcs` | `Set<DofID>` | GdL vincolati. Sostituiscilo per cambiare il vincolo. |
| `lcs` | `number[][] \| undefined` | Gli assi ruotati del nodo, se presenti |
| `updateLcs({ locx, locy }?)` | `void` | Ruota gli assi del nodo: `locx` è il suo asse x in componenti globali, `locy` è `[0, 1, 0]`. Senza argomenti li ripristina. |
| `hasLcs()` | `boolean` | Se gli assi sono ruotati |
| `getUnknowns(lc, dofs)` | `Matrix`, o un `number` per un solo GdL | Spostamenti (m) e rotazioni (rad), negli assi del nodo |
| `getReactions(lc, global?)` | `{ dofs, values }` | Reazioni nei GdL vincolati, nell’ordine di `bcs`: N, N·m. `values` è una `Matrix` di mathjs se le reazioni sono più di una, un array di un elemento se è una sola, `[]` per un nodo libero. Con `global` `true` su un nodo ruotato: tutti e tre i GdL negli assi globali, `dofs` `[0, 2, 4]`, `values` un array con 0 dove nulla è bloccato. [Come leggerle](/it/solver/results#reactions). |

## Elementi {#elements}

### `Beam2D` {#beam2d}

Una trave di Timoshenko a due nodi nel piano x–z, con tre GdL per nodo (`Dx`, `Dz`, `Ry`). `x` è in metri dal primo nodo; `n` è un numero di segmenti, che dà n + 1 punti.

| Nome | Restituisce | Descrizione |
| --- | --- | --- |
| `label`, `nodes`, `mat`, `cs` | `string`, `string[]`, `string`, `string` | |
| `hinges` | `[boolean, boolean]` | Svincoli del momento al primo e al secondo nodo |
| `computeNormalForceAt(lc, x)` | `number` | N, positivo se di trazione |
| `computeShearForceAt(lc, x)` | `number` | V, positivo dove M cresce lungo la x locale |
| `computeBendingMomentAt(lc, x)` | `number` | M, positivo con trazione sul lato +z locale |
| `computeNormalForce(lc, n)` | `{ x, N }` | N in n + 1 punti |
| `computeShearForce(lc, n)` | `{ x, V }` | V in n + 1 punti |
| `computeBendingMoment(lc, n)` | `{ x, M }` | M in n + 1 punti |
| `computeLocalDefl(lc, n)` | `{ u, w }` | Spostamenti lungo l’asta e trasversali, negli assi locali, m |
| `computeGlobalDefl(lc, n)` | `{ u, w }` | Gli stessi in x e z globali |
| `computeEndForces(lc)` | `Matrix` | `[X12, Z12, M12, X21, Z21, M21]`, le forze che i nodi esercitano sull’asta, negli assi locali |
| `computeEndDisplacement(lc)` | `Matrix` | Spostamenti di estremità negli assi locali, comprese le rotazioni delle cerniere |
| `computeGeo()` | `{ l, dx, dz }` | Lunghezza e proiezioni, m |
| `computeT()` | `Matrix` | Trasformazione 6 × 6, da globale a locale |
| `computeLocalStiffnessMtrx()` | `{ answer }` | `answer`: rigidezza locale 6 × 6, con le cerniere condensate |
| `computeStiffness()` | `Matrix` | Rigidezza globale 6 × 6 |
| `computeShearFactor()` | `number` | $\Phi = 12EI_y/kGAL^2$ |
| `getMaterial()`, `getCS()` | `Material`, `CrossSection` | |

In corrispondenza di un carico concentrato, i metodi `…At` restituiscono il valore subito dopo il carico. `Element` è la classe base astratta di `Beam2D`; è il tipo usato da `domain.elements` e da `getElement`.

## Materiali e sezioni {#materials-and-sections}

| `MaterialParameters` | Unità | Predefinito | Serve per |
| --- | --- | --- | --- |
| `e` | Pa | 1 | rigidezza |
| `g` | Pa | 1 | rigidezza a taglio |
| `alpha` | 1/K | 1 | carichi termici |
| `d` | kg/m³ | 1 | niente, in statica |

| `CrossSectionParameters` | Unità | Predefinito | Serve per |
| --- | --- | --- | --- |
| `a` | m² | nessuno, obbligatorio | rigidezza assiale e a taglio |
| `iy` | m⁴ | nessuno, obbligatorio | rigidezza flessionale |
| `k` | – | nessuno, obbligatorio | rigidezza a taglio $kGA$; `1e32` per escluderla |
| `h` | m | nessuno | gradienti termici (`NaN` senza) |
| `iz`, `dyz`, `j` | m⁴ | nessuno | non usati da `Beam2D` |

Un parametro del materiale mancante vale 1, non un valore tipico; un `a`, `iy` o `k` mancante rende `NaN` ogni risultato. In nessuno dei due casi compare un errore. Entrambe le classi hanno un metodo `change(params)` che imposta i parametri forniti, e li conservano come proprietà con gli stessi nomi.

## Carichi {#loads}

### `LoadCase` {#loadcase}

| Metodo | Restituisce | Valori |
| --- | --- | --- |
| `createNodalLoad(node, values, lcs?)` | `NodalLoad` | `{ [DofID.Dx]: N, [DofID.Dz]: N, [DofID.Ry]: N·m }`; `lcs` (predefinito `false`) `true`: negli assi ruotati del nodo |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | `BeamElementUniformEdgeLoad` | N/m su tutta l’asta |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | `BeamElementTrapezoidalEdgeLoad` | N/m al primo e al secondo nodo, lineare tra i due |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | `BeamConcentratedLoad` | N, N, N·m, a `a` m dal primo nodo |
| `createBeamTemperatureLoad(el, [dTc, dTb, dTt])` | `BeamTemperatureLoad` | K: baricentro, fibra inferiore, fibra superiore |
| `createPrescribedDisplacement(node, values)` | `PrescribedDisplacement` | `{ [DofID.Dz]: m, … }` sui GdL vincolati, negli assi del nodo; ignorato sui GdL liberi |

Per i carichi sulle aste, `lcs` `true` significa assi locali (x lungo l’asta, z trasversale), `false` assi globali. I carichi distribuiti sono per metro di lunghezza dell’asta. La pagina [Carichi](/it/solver/loads) contiene degli esempi.

| Nome | Tipo | Descrizione |
| --- | --- | --- |
| `label` | `string` | |
| `nodalLoadList` | `NodalLoad[]` | |
| `elementLoadList` | `BeamElementLoad[]` | Carichi sulle aste e carichi termici |
| `prescribedBC` | `PrescribedDisplacement[]` | |
| `solved` | `boolean` | `true` dopo un calcolo riuscito |
| `getElementLoadsOnElement(el)` | `BeamElementLoad[]` | I carichi su un’asta |

Gli oggetti carico conservano i valori in proprietà pubbliche, che puoi modificare prima di risolvere di nuovo: `values` (e `lcs`) su `NodalLoad`, `BeamElementUniformEdgeLoad`, `BeamConcentratedLoad` e `BeamTemperatureLoad`; `startValues` ed `endValues` su `BeamElementTrapezoidalEdgeLoad`; `prescribedValues` su `PrescribedDisplacement`. Ognuno ha un `target`, l’etichetta dell’oggetto su cui agisce.

## DofID {#dofid}

| Nome | Valore | Usato da `Beam2D` |
| --- | --- | --- |
| `Dx` | 0 | sì |
| `Dy` | 1 | no |
| `Dz` | 2 | sì |
| `Rx` | 3 | no |
| `Ry` | 4 | sì |
| `Rz` | 5 | no |

## Risultati {#results}

I risultati si leggono da un `Beam2D` (forze interne, frecce, forze di estremità) e da un `Node` (spostamenti, reazioni), sempre per un dato `LoadCase`, dopo `solve()`: vedi le due tabelle qui sopra e, per esempi e segni, [Lettura dei risultati](/it/solver/results). In breve:

| Per ottenere | Chiamata |
| --- | --- |
| Reazioni, N e N·m | `node.getReactions(lc)` |
| Spostamenti, m, e rotazioni, rad | `node.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])` |
| N, V o M in un punto, N e N·m | `beam.computeNormalForceAt(lc, x)`, `computeShearForceAt`, `computeBendingMomentAt` |
| N, V o M lungo un’asta | `beam.computeNormalForce(lc, n)`, `computeShearForce`, `computeBendingMoment` |
| Deformata, m | `beam.computeLocalDefl(lc, n)`, `computeGlobalDefl` |
| Forze di estremità, N e N·m | `beam.computeEndForces(lc)` |
| Una figura di tutto questo | `StructurePlot` o `structureSvg` di [@edubeam/plot](/it/solver/drawing) |
