---
title: Per iniziare
description: "Installa @edubeam/fem, il solutore agli elementi finiti di EduBeam, e calcola, verifica e leggi una trave appoggiata in una dozzina di righe di TypeScript."
order: 1
group: Introduzione
source: site
---

# Per iniziare {#getting-started}

@edubeam/fem è il solutore agli elementi finiti su cui si basa [EduBeam]{.edubeam}: tutti i diagrammi, le reazioni e le frecce che l’app mostra vengono da questa libreria. Con essa puoi risolvere travi, telai e travature reticolari piane dal tuo codice, nel browser o in Node: generare esercizi con le soluzioni, correggere gli esercizi per casa, svolgere studi parametrici o usarla come motore di calcolo di una pagina web.

::div{.actions}
[Calcola la tua prima trave](#a-simply-supported-beam) [Sfoglia i programmi di esempio](/it/solver/beams)
::

È scritta in TypeScript, include le proprie definizioni dei tipi ed è software libero con licenza GPL-3.0. L’ha creata Bořek Patzák, e la sviluppa insieme a Jan Voříšek e ad altri collaboratori.

## Installazione {#install}

```bash
npm install @edubeam/fem
```

Funziona sia con `import` sia con `require`, nel browser e in Node 18 o successivi, e porta con sé una sola dipendenza, [mathjs](https://mathjs.org). Fino alla versione 0.3.0 si installava da GitHub con il nome `ts-fem`: se la usavi così, cambia gli import in `@edubeam/fem`. Nient’altro è cambiato.

Per provare l’esempio qui sotto partendo da una cartella vuota, trasformala in un progetto che usa `import`, poi installa la libreria:

```bash
npm init -y
npm pkg set type=module
npm install @edubeam/fem
```

Senza `"type": "module"` in `package.json` l’esempio funziona lo stesso, ma prima Node stampa un avviso.

## La tua prima trave {#a-simply-supported-beam}

Una trave in acciaio di 6 m, un IPE 200, su una cerniera e un carrello, con un carico di 12 kN/m:

```ts [beam.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver

// Unità SI ovunque: m, N, Pa. Acciaio e un IPE 200.
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

// Nodi in [x, y, z], in metri, con i GdL bloccati dal loro vincolo
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // cerniera
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // carrello
const beam = domain.createBeam2D(1, ['A', 'B'], 'steel', 'IPE200')

// 12 kN/m lungo la z locale dell'asta: verso il basso su una trave disegnata da sinistra a destra
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad(1, [0, 12e3], true)

solver.solve()

console.log(beam.computeBendingMomentAt(lc, 3)) // N·m in mezzeria
console.log(beam.computeShearForceAt(lc, 0)) // N in A
console.log(beam.computeLocalDefl(lc, 2).w[1]) // m in mezzeria
```

Salvalo come `beam.ts` ed eseguilo con `node beam.ts`: Node 22.18 e successivi eseguono TypeScript così com’è. Il file non contiene annotazioni di tipo, quindi con un Node più vecchio salvalo invece come `beam.mjs`. Il programma stampa:

```text [Output]
54000
36000
0.04990940552616746
```

Sono i valori del libro di testo, $M = qL^2/8 = 54$ kNm e $V = qL/2 = 36$ kN. Ecco la stessa trave, calcolata nel tuo browser dallo stesso solutore:

::model-figure{caption="La trave qui sopra: 6 m, IPE 200, 12 kN/m"}
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

La freccia, 49,91 mm, supera di 0,28 mm quella di Eulero–Bernoulli, $5qL^4/384EI = 49{,}63$ mm. Non è un errore: l’asta è una trave di Timoshenko, e 0,28 mm è $qL^2/8kGA$, la deformazione a taglio di questa trave. Assegna a `k` un valore enorme, ad esempio `1e32`, e la differenza scompare: vedi [Deformazione a taglio](/it/solver/materials-sections#shear-deformation).

## Che cosa fa il codice {#what-the-code-does}

::div{.steps}
### Crea un solutore {#make-a-solver}

`new LinearStaticSolver()` nasce con un `domain` vuoto, che contiene il modello, e con un caso di carico, `solver.loadCases[0]`.

### Descrivi il modello {#describe-the-model}

Materiali e sezioni, nodi con i loro vincoli, poi le aste tra i nodi. Ogni oggetto ha un’etichetta, una stringa o un numero, con cui il resto del modello vi fa riferimento. Vedi [Nodi e vincoli](/it/solver/nodes-supports), [Materiali e sezioni](/it/solver/materials-sections) e [Aste e cerniere](/it/solver/members-hinges).

### Applica i carichi {#load-it}

I carichi appartengono a un caso di carico: forze nei nodi, carichi lungo le aste, variazioni di temperatura e cedimenti. Vedi [Carichi](/it/solver/loads).

### Risolvi {#solve}

`solver.solve()` assembla e risolve tutti i casi di carico. Vedi [Calcolo](/it/solver/solving).

### Leggi i risultati {#read-the-results}

Forze interne in qualsiasi punto di un’asta, frecce, forze di estremità, spostamenti nodali e reazioni. Vedi [Lettura dei risultati](/it/solver/results) e, per i diagrammi, [Disegnare i risultati](/it/solver/drawing).
::

## Unità e segni in breve {#axes-and-signs}

Unità SI in ingresso, unità SI in uscita. Il modello giace nel piano x–z con **z rivolto verso il basso**: un `fz` positivo spinge verso il basso e la testa di una colonna alta 4 m si trova a $z = -4$. Le posizioni lungo un’asta si misurano in metri dal suo primo nodo. Un momento che tende le fibre inferiori è positivo. La pagina [Unità e segni](/it/solver/conventions) riporta l’elenco completo.

## Sei errori frequenti {#pitfalls}

1. **z è rivolto verso il basso.** I carichi gravitazionali sono positivi, e tutto ciò che sta sopra i vincoli ha coordinata z negativa. Vedi [Assi](/it/solver/conventions#axes).
2. **Il verso di un’asta decide il segno di M e w.** Definisci le travi da sinistra a destra e le colonne dal basso verso l’alto: i segni si leggono allora come sul libro di testo. Vedi [Verso dell’asta](/it/solver/conventions#member-direction).
3. **Un parametro mancante dà `NaN` o valori assurdi, non un errore.** Una sezione richiede `a`, `iy` e `k`; un materiale richiede `e`, e anche `g` a meno che `k` sia enorme. Vedi [Materiali e sezioni](/it/solver/materials-sections).
4. **Dopo aver aggiunto nodi o aste, o modificato i vincoli,** imposta `solver.codeNumberGenerated = false` prima di risolvere di nuovo. Vedi [Risolvere di nuovo dopo una modifica](/it/solver/solving#solving-again-after-a-change).
5. **Le reazioni tornano come matrice mathjs o come array,** nell’ordine in cui sono stati indicati i GdL del vincolo. Vedi [Reazioni](/it/solver/results#reactions).
6. **Un meccanismo non sempre genera un errore.** Uno spostamento di $10^{12}$ m significa che la struttura può muoversi liberamente. Vedi [Quando il calcolo non riesce](/it/solver/solving#when-solving-fails).

## Per proseguire {#next}

::card-grid{cols="2"}
:::card{title="Programmi di esempio" icon="lucide:book-open" to="/it/solver/beams"}
Programmi completi e verificati: travi, telai, travature reticolari, un foglio di esercizi con le soluzioni, un piccolo server HTTP.
:::
:::card{title="Disegna i risultati" icon="lucide:chart-spline" to="/it/solver/drawing"}
Passa un modello risolto a @edubeam/plot e ottieni i suoi diagrammi in SVG, in Vue o da uno script Node.
:::
:::card{title="Riferimento API" icon="lucide:list-tree" to="/it/solver/reference"}
Ogni classe, metodo e argomento, con le unità e ciò che restituisce.
:::
:::card{title="La teoria" icon="lucide:sigma" to="/it/elements/beam"}
L’elemento trave, la sua matrice di rigidezza e la trasformazione, nel manuale teorico di EduBeam.
:::
::
