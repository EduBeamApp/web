---
description: "Insegnare con EduBeam: modelli dal vivo al proiettore, link nelle dispense, esercizi autoverificabili, esercizi generati e compiti stampabili con le soluzioni."
source: site
---

# Insegnare con EduBeam

[EduBeam]{.edubeam} è nato in un’aula universitaria, ed è ancora lì che rende al meglio: un modello sul proiettore che reagisce non appena lo modifichi, e lo stesso modello sul portatile di ogni studente grazie a un link. Questa pagina raccoglie ciò che i docenti usano di più, dalla prima lezione all’esame.

::card-grid{cols="2"}
:::card{title="A lezione" icon="lucide:presentation" to="#in-the-lecture"}
Rendi il modello leggibile dall’ultima fila e modificalo dal vivo.
:::
:::card{title="Alla prima esercitazione" icon="lucide:graduation-cap" to="#getting-students-started"}
Dieci minuti da uno schermo vuoto a una trave verificata a mano.
:::
:::card{title="Nelle dispense e negli esercizi per casa" icon="lucide:link" to="#in-lecture-notes-and-assignments"}
Un link in un PDF o in una slide apre l’intero modello, per anni.
:::
:::card{title="Esercizi che gli studenti verificano da soli" icon="lucide:list-checks" to="#assignments-students-can-check-themselves"}
Prima il calcolo a mano, poi il modello come verifica.
:::
:::card{title="Esercizi e compiti scritti" icon="lucide:file-check" to="#practice-and-test-papers"}
Esercizi generati con verifica immediata e compiti stampabili con le soluzioni.
:::
:::card{title="Fogli di esercizi e slide dal codice" icon="lucide:dices" to="#exercise-sheets-tests-and-slides-from-code"}
I tuoi generatori di esercizi e le figure per le slide, scritti con @edubeam/plot.
:::
::

## A lezione {#in-the-lecture}

- **Rendilo leggibile dall’ultima fila.** In **Impostazioni → Impostazioni della vista** porta la **Dimensione del carattere** a 18 o 20 px (20 px è il massimo) e la **Dimensione dei vincoli** al 130–150 %. Se i diagrammi sembrano ancora piccoli, aumenta la **Scala dei risultati**.
- **Mostra una cosa alla volta.** Nelle opzioni di visualizzazione in alto a destra nella vista, togli la spunta a tutto tranne la grandezza di cui stai parlando, poi aggiungi le altre una per una.
- **Modifica il modello dal vivo.** Trascina un vincolo, spunta `Ry`, aggiungi una cerniera. Gli studenti vedono subito causa ed effetto, e <kbd>Ctrl</kbd>+<kbd>Z</kbd> ti riporta indietro.
- **Lascia che sia il solutore a spiegare i meccanismi.** Inserisci una cerniera di troppo ed EduBeam disegna come può muoversi la struttura, ne anima il moto e cerchia le cerniere responsabili. È un buon momento per parlare di labilità. Entrambi gli interruttori si trovano in **Impostazioni → Impostazioni della vista → Controlli del modello**.
- **Usa la lingua e gli assi dei tuoi studenti.** EduBeam parla 18 lingue, e nelle [Impostazioni](/it/essentials/units-settings) puoi passare tra unità SI e statunitensi e tra assi con z verso il basso e y verso l’alto, in linea con le tue dispense.

![Un meccanismo reso visibile: le cerniere in B e C permettono al telaio di traslare lateralmente](/screenshots/it/ui-mechanism.webp)

## Alla prima esercitazione {#getting-students-started}

Alla prima visita, EduBeam chiede agli studenti come vogliono iniziare e quali unità e assi usare. Di’ loro in anticipo quali unità e quali assi usa il tuo corso. Il tour guidato (**Fammi fare un giro**), l’esercizio guidato **Disegna la tua prima trave** e gli **Esempi** restano poi disponibili nel menu **☰**.

Una buona prima esercitazione: «aprite run.edubeam.app e scegliete *Disegna la tua prima trave*», poi l’[Avvio rapido](/it/guide/quick-start), circa dieci minuti con una verifica a mano alla fine.

### Computer di laboratorio e uso offline {#offline-and-lab-computers}

EduBeam è una progressive web app: una volta caricata in un browser, continua a funzionare senza connessione, e il browser può proporre di installarla come un’applicazione desktop. Modello e impostazioni restano salvati nel singolo profilo del browser, quindi sui computer condivisi dell’aula informatica gli studenti devono portare via il lavoro come file o come link. I dettagli sono in [Cosa viene salvato nel browser](/it/essentials/units-settings#what-is-stored-in-your-browser).

## Nelle dispense e negli esercizi per casa {#in-lecture-notes-and-assignments}

Un link condiviso contiene l’intero modello, quindi funziona ovunque funzioni un link: un PDF, una slide, una pagina della piattaforma e-learning, un’e-mail.

::div{.steps}

### Costruisci il modello {#share-build}

Preparalo come gli studenti devono vederlo la prima volta: con i carichi, le etichette e i diagrammi che vuoi mostrare.

### Copia il link {#share-copy}

Premi **Condividi modello** nella barra dell’app. Attiva **Mostra ciò che vedo** se il link deve aprirsi con i tuoi diagrammi, carichi ed etichette, poi premi **Copia**.

### Incollalo nelle dispense {#share-paste}

Gli studenti che lo aprono ottengono una propria copia da esplorare. Nulla di ciò che cambiano arriva a te o ad altri. I link continuano a funzionare con le nuove versioni di EduBeam, quindi le dispense restano valide anno dopo anno.

::

Per il materiale del corso lascia disattivato **Link più corto**: una copia di EduBeam rimasta a una versione precedente a questa opzione non riesce ad aprire il formato più corto finché non si aggiorna.

| Link | Apre |
| --- | --- |
| `run.edubeam.app/?model=…` | il modello, pronto da modificare |
| `run.edubeam.app/?viewer=1&model=…` | il modello in [modalità visualizzatore](/it/essentials/import-export#embed-a-read-only-viewer), per un `<iframe>` |
| `run.edubeam.app/?panel=examples` | la [galleria degli esempi](/it/examples/) |
| `run.edubeam.app/?lang=it` | l’app in italiano, o in qualsiasi [altra lingua](/it/essentials/import-export#url-parameters) |

::callout{type="warning" title="Un link sostituisce il modello dello studente"}
Aprire un link, e in alcuni browser anche una pagina con un visualizzatore incorporato, sposta il modello che lo studente aveva in **☰ → Strutture recenti**, da dove si può ripristinare. Chiedi comunque agli studenti di salvare il lavoro a cui tengono con **☰ → Salva progetto** prima di aprire i link del corso.
::

## Esercizi che gli studenti verificano da soli {#assignments-students-can-check-themselves}

EduBeam dà agli studenti un riscontro immediato sul calcolo a mano senza svolgere il procedimento al posto loro.

- **Prima il calcolo, poi la verifica.** Chiedi di calcolare a mano le reazioni, le forze interne e uno spostamento, poi fai costruire il modello e confrontare i risultati. Le formule sono in [Verificare i risultati a mano](/it/guide/verification), e l’[Avvio rapido](/it/guide/quick-start#_8-check-by-hand) mostra il procedimento.
- **Chiedi perché un risultato è diverso.** La deformazione a taglio, una cerniera mancante, un carico negli assi locali anziché globali: ognuna spiega una differenza piccola o grande, e trovarla insegna più di un risultato che torna.
- **Fatti consegnare il modello insieme al calcolo.** Chiedi un link condiviso o un `project.json` accanto ai calcoli: puoi aprirlo e vedere esattamente che cosa è stato modellato.
- **Relazioni curate.** Gli studenti possono esportare il disegno in **SVG**, che resta nitido in Word e LaTeX, e i risultati in **CSV**. Vedi [Esportare un’immagine](/it/essentials/import-export#export-an-image).

## Esercizi pronti {#ready-made-exercises}

- **[Esempi](/it/examples/):** sei modelli che si aprono con un clic, ciascuno con domande, cosa osservare e le soluzioni.
- **[Esercizi di statica](/it/practice):** travi, telai e travature reticolari generati automaticamente, con la verifica delle risposte degli studenti, e un [generatore di compiti](/it/exam) che li stampa come compiti scritti. Vedi [più sotto](#practice-and-test-papers).
- **[Tutorial](/it/tutorials/inclined-beam):** una trave inclinata, un telaio a tre cerniere, una travatura reticolare piana e una trave continua con il cedimento di un appoggio, ciascuno modellato passo passo e verificato a mano. Funzionano come schede di laboratorio da 15–20 minuti.
- **[Verificare i risultati a mano](/it/guide/verification):** i casi in forma chiusa, dalla mensola al cedimento vincolare, da assegnare come verifiche rapide.

## Esercizi e compiti scritti {#practice-and-test-papers}

Due pagine di questo sito preparano esercizi di statica al posto tuo, senza installare né programmare nulla:

- **[Esercizi di statica](/it/practice)** propone agli studenti un nuovo esercizio ogni volta che lo chiedono. Lo risolvono su carta, inseriscono le reazioni e il momento flettente massimo o lo sforzo in un’asta, e la pagina confronta ogni valore con la soluzione esatta: uno scarto entro l’1 % è accettato, e un valore giusto in modulo ma con il verso sbagliato viene segnalato. Un suggerimento mostra come cominciare, e i diagrammi compaiono a esercizio concluso. Ogni esercizio ha un codice, ad esempio `H2048`, che identifica sempre lo stesso esercizio: mettilo in un foglio di esercizi per casa, e tutti confrontano i risultati con gli stessi valori.
- **Il [generatore di compiti](/it/exam)** stampa compiti scritti: scegli i tipi di struttura, fino a 6 esercizi per compito e fino a 40 versioni, e ogni studente riceve una versione diversa. Ogni versione ha gli stessi tipi di struttura nello stesso ordine, quindi i compiti sono ugualmente difficili. Aggiunge una riga per il nome, lo spazio per i calcoli e le soluzioni, e **Stampa o salva come PDF** li stampa. **Scarica .zip** fornisce ogni figura come file SVG per LaTeX e Word, e le soluzioni come tabella CSV per la correzione.

Entrambe offrono gli stessi otto tipi di struttura: sei isostatici (trave semplicemente appoggiata, mensola, trave appoggiata con sbalzo, trave Gerber, telaio a tre cerniere e travatura Warren) e due iperstatici (trave continua a due campate e telaio a portale).

Il generatore di compiti conserva le sue impostazioni, compreso il **Numero del compito** che sceglie i valori numerici, nell’indirizzo della pagina. Salvalo nei preferiti, e l’anno prossimo ritroverai gli stessi compiti e le stesse soluzioni. Nei compiti scritti i codici degli esercizi sono disattivati per impostazione predefinita: la pagina degli esercizi mostra la soluzione, quindi i codici servono negli esercizi per casa, dove gli studenti verificano da soli il proprio lavoro a posteriori.

## Fogli di esercizi, compiti e slide dal codice {#exercise-sheets-tests-and-slides-from-code}

I diagrammi di questo sito sono disegnati da [@edubeam/plot](/it/plot), una libreria di componenti Vue che disegna qualsiasi trave, telaio o travatura reticolare piana risolta da [@edubeam/fem](/it/solver), il solutore di EduBeam. Se sai scrivere un po’ di JavaScript, poche righe di codice diventano materiale per il corso:

- **I tuoi tipi di esercizio.** Se le strutture del generatore di compiti non sono quelle che insegni, scrivi le tue: un seme (valore iniziale del generatore casuale) sceglie la struttura e i suoi valori, quindi lo stesso seme dà sempre lo stesso esercizio, e le soluzioni si ricavano dallo stesso seme.
- **Slide che si costruiscono per passi.** Mostra la struttura, poi i vincoli e i carichi, poi le reazioni, poi il diagramma del momento, un passo alla volta, senza che il disegno si sposti tra un passo e l’altro.
- **Figure per dispense e pagine del corso.** SVG nitidi che seguono il tema chiaro o scuro della pagina e, a differenza di un’app incorporata, non toccano mai il modello dello studente.

Prova tu stesso. Ogni clic su **Nuovo esercizio** genera un nuovo esercizio con le sue soluzioni:

::exercise-generator
::

::card-grid{cols="2"}
:::card{title="Esercizi e compiti" icon="lucide:file-check" to="/it/plot/exercises"}
Genera fogli di esercizi e le relative soluzioni a partire da un seme.
:::
:::card{title="Slide e dispense" icon="lucide:presentation" to="/it/plot/slides"}
Figure che si costruiscono livello per livello, per slide e dispense.
:::
::
