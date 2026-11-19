---
title: Calcolo
description: "Cosa fa solve() in @edubeam/fem, quando rinumerare le equazioni dopo una modifica, come riconoscere un meccanismo e quanto può essere grande un modello."
order: 9
group: Calcolo e risultati
source: site
---

# Calcolo {#solving}

```ts
solver.solve()
```

`solve()` numera le equazioni, assembla la matrice di rigidezza globale e i vettori dei carichi di ogni caso di carico, e ricava spostamenti e reazioni. Dopo la chiamata puoi leggere ogni [risultato](/it/solver/results); prima, la lettura di un risultato lancia un `TypeError`. I passi sono quelli descritti in [Come EduBeam risolve un modello](/it/elements/analysis) nel manuale teorico.

La soluzione è esatta per il modello lineare: la deformata e le forze interne lungo ogni asta vengono da soluzioni in forma chiusa della trave di Timoshenko, quindi non c’è nessuna discretizzazione da infittire e non serve dividere le aste per avere diagrammi accurati.

Dalla 0.3.1 in poi `solve()` non scrive nulla nella console; la 0.3.0 stampava a ogni chiamata una riga come `Solution took 9 [ms]`.

## Risolvere di nuovo dopo una modifica {#solving-again-after-a-change}

Se cambi dei numeri nel modello, basta un altro `solve()`. Se cambia l’insieme delle equazioni, prima serve una riga in più:

```ts
domain.createNode('C', [10, 0, 0], [DofID.Dz])
domain.createBeam2D(2, ['B', 'C'], 1, 1)
solver.codeNumberGenerated = false // i GdL sono cambiati: rinumerali
solver.solve()
```

| Modifica | Poi |
| --- | --- |
| Valori dei carichi, carichi nuovi o rimossi | `solve()` |
| Coordinate dei nodi, materiali, sezioni, cerniere | `solve()` |
| Aggiunta di nodi o aste | `codeNumberGenerated = false`, poi `solve()` |
| Rimozione di nodi o aste: `domain.nodes.delete(label)`, `domain.elements.delete(label)` | `codeNumberGenerated = false`, poi `solve()` |
| Modifica dei vincoli di un nodo, `node.bcs` | `codeNumberGenerated = false`, poi `solve()` |

Se te ne dimentichi dopo aver aggiunto un nodo, `solve()` lancia un `TypeError`. Se te ne dimentichi dopo aver cambiato un vincolo, risolve **in silenzio** il modello con i vecchi vincoli. Nel dubbio, reimpostalo: la numerazione non costa quasi nulla. Se rimuovi un’asta, devi rimuoverne anche i carichi da `lc.elementLoadList`, altrimenti `solve()` lancia un `RangeError` per l’asta mancante.

Per molte varianti dello stesso modello, come in uno studio parametrico, un nuovo solutore per ciascuna è più semplice e altrettanto veloce: vedi l’[esempio della linea d’influenza](/it/solver/scripts#an-influence-line-as-csv).

## Quando il calcolo non riesce {#when-solving-fails}

Una struttura che può muoversi senza deformarsi, cioè un meccanismo, ha una matrice di rigidezza singolare. A volte `solve()` se ne accorge e lancia un errore:

```text
Error: Linear system cannot be solved since matrix is singular
```

Spesso invece no: gli errori di arrotondamento fanno sembrare la matrice risolvibile, e ottieni spostamenti di $10^{12}$ m, oppure numeri dall’aspetto ragionevole per una struttura libera di scorrere. Una trave su due carrelli, per esempio, si risolve senza proteste finché nulla la spinge di lato. Controlla quindi tu stesso i vincoli, e prendi gli spostamenti enormi come il segnale di un meccanismo.

Cause tipiche:

- troppo pochi vincoli, come in una trave su due carrelli;
- vincoli che non riescono a trattenere la struttura: tutti paralleli, o tutti diretti verso uno stesso punto;
- una cerniera di troppo, come tre cerniere allineate;
- un momento applicato a un nodo in cui tutte le estremità delle aste sono incernierate.

Il messaggio non dice dove sta il problema. L’app EduBeam controlla i meccanismi prima del calcolo, li trova e ne anima il moto; costruire lì lo stesso modello è spesso il modo più rapido per vedere il meccanismo. La pagina [Risoluzione dei problemi](/it/reference/troubleshooting) elenca le cause più comuni.

Un nodo, un materiale o una sezione mancante lancia un `RangeError` che lo nomina. I parametri di sezione mancanti, invece, non generano alcun errore: ogni risultato è `NaN`. Vedi [Materiali e sezioni](/it/solver/materials-sections#cross-section).

## Dimensioni del modello {#model-size}

Il solutore usa matrici dense, pensate per modelli di dimensioni didattiche. Su un portatile, in Node, una fila di aste in linea retta si risolve in circa:

| Aste | GdL | Tempo |
| --- | --- | --- |
| 50 | 150 | 0,1 s |
| 100 | 300 | 0,2 s |
| 200 | 600 | 1 s |
| 400 | 1200 | 10 s |

Ogni raddoppio del modello richiede da sei a nove volte il tempo.

Ogni esercizio, telaio e travatura di un corso di analisi strutturale rientra senza problemi in questi limiti. Non è pensato per modelli con migliaia di aste.

## Nessun’altra analisi {#no-other-analyses}

Questa versione risolve solo la statica lineare. Il sorgente contiene un solutore agli autovalori per le frequenze proprie, ma non fa parte del pacchetto pubblicato: `EigenValueDynamicSolver` non si può importare da `@edubeam/fem`.
