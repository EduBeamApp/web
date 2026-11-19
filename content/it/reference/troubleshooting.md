---
description: "Perché EduBeam non mostra risultati e come rimediare: i messaggi di errore e avviso spiegati, risultati che sembrano sbagliati, file o link che non si aprono."
source: site
---

# Risoluzione dei problemi

Quando un modello non si può risolvere, [EduBeam]{.edubeam} ne spiega il motivo in un messaggio in alto a sinistra nella vista, e **Mostra dettagli** elenca per esteso ogni problema. Scegli il titolo della finestra che hai visto: per ogni messaggio qui sotto trovi che cosa significa e come rimediare.

::card-grid{cols="2"}
:::card{title="Non ancora pronto per il calcolo" icon="lucide:circle-dashed" to="#still-needed"}
Un indicatore blu **Servono vincoli**. Non c’è nulla di sbagliato: la struttura semplicemente non è ancora vincolata.
:::
:::card{title="Impossibile eseguire il calcolo" icon="lucide:circle-x" to="#errors"}
Un messaggio rosso. Vincoli che non trattengono la struttura, cerniere che formano un meccanismo, un elemento di lunghezza nulla.
:::
:::card{title="Avvisi del modello" icon="lucide:triangle-alert" to="#warnings"}
Un messaggio giallo. Il modello è risolto, ma probabilmente qualcosa non è come intendevi.
:::
:::card{title="I risultati sembrano sbagliati" icon="lucide:scale" to="#results-look-wrong"}
Carichi rivolti verso l’alto, frecce sbagliate di qualche ordine di grandezza, un segno che sembra invertito.
:::
::

## Messaggi {#messages}

### Che cosa significano i colori {#read-the-message}

| Che cosa vedi | Che cosa significa |
| --- | --- |
| Un indicatore blu **Servono vincoli** | Il modello non è finito. Aggiungi i vincoli. Passa il mouse sull’indicatore per vedere, come contorno tratteggiato, in che modo la struttura può ancora muoversi. |
| Un messaggio **rosso** | Qualcosa impedisce il calcolo. Il messaggio indica il problema, oppure riporta *Errori nel modello: n* quando ce ne sono diversi. I nodi coinvolti sono cerchiati nel disegno. |
| Un messaggio **giallo** | Avvisi. Il modello è stato risolto comunque. Se sono diversi, il messaggio riporta *Avvisi nel modello: n*. |
| *Nessun materiale definito.* / *Nessuna sezione definita.* | Gli elementi hanno bisogno di entrambi. Aggiungine uno con il pulsante **Aggiungi** accanto al messaggio. |

**Mostra dettagli** apre la finestra, intitolata *Non ancora pronto per il calcolo*, *Impossibile eseguire il calcolo* o *Avvisi del modello*. Il suo interruttore mostra o nasconde il modo in cui la struttura può muoversi, e il suo link **Risoluzione dei problemi** porta a questa pagina.

![La finestra Impossibile eseguire il calcolo, con l’interruttore che mostra come può muoversi la struttura](/screenshots/it/ui-diagnostics.webp){.shot-lg}

Nel disegno:

- Il pulsante **✕** su un messaggio rosso lo riduce a un piccolo indicatore *Impossibile eseguire il calcolo*, per fare spazio su uno schermo piccolo. Fai clic sull’indicatore per riaprirlo.
- Il pulsante con l’**occhio** su un messaggio rosso mostra o nasconde il contorno tratteggiato del moto. **Impostazioni → Impostazioni della vista → Controlli del modello** disattiva definitivamente il contorno e la sua animazione.
- Il pulsante **✕** su un messaggio giallo nasconde gli avvisi.

### Ancora da fare {#still-needed}

Il modello non è sbagliato, solo incompleto. Passa il mouse sull’indicatore per il testo breve; la finestra mostra quello esteso.

| Messaggio | Significato e soluzione |
| --- | --- |
| *La struttura va vincolata prima di poter essere risolta.* <br> *Per essere stabile in un’analisi 2D, il modello richiede almeno 3 GdL vincolati.* | In tutto ci sono meno di tre direzioni vincolate. Aggiungi i vincoli. |
| *La parte con i nodi … va vincolata.* <br> *Una parte separata della struttura (nodi …) ha meno di 3 GdL vincolati e può muoversi liberamente.* | Il modello è diviso in più parti e una di esse non è vincolata. Collegala al resto, oppure vincolala. |
| *n parti della struttura vanno vincolate.* | Diverse parti non sono vincolate. **Mostra dettagli** le elenca. |

### Errori {#errors}

Qualcosa impedisce il calcolo. Il messaggio rosso mostra il testo breve, la finestra quello esteso.

| Messaggio | Significato e soluzione |
| --- | --- |
| *I vincoli non trattengono la struttura: può ancora traslare in orizzontale / traslare in verticale / ruotare liberamente / muoversi come corpo rigido.* <br> *La struttura ha abbastanza vincoli, ma questi non la trattengono: può ancora …* | I vincoli sono in numero sufficiente, ma sono tutti paralleli, oppure le loro rette d’azione passano per uno stesso punto, come per tre carrelli su una trave orizzontale. Il contorno tratteggiato mostra il moto; ruota o sposta uno dei vincoli. |
| *La parte con i nodi … non è trattenuta: può ancora …* <br> *Una parte separata della struttura (nodi …) ha abbastanza vincoli, ma questi non la trattengono: può ancora …* | Lo stesso, per una parte di un modello diviso in più parti. |
| *Le cerniere in … permettono alla struttura di muoversi.* <br> *I vincoli trattengono la struttura, ma questa è ancora un meccanismo: le sue aste possono ruotare attorno alle cerniere in …* | Le cerniere permettono alle aste di ruotare l’una rispetto all’altra, come in un telaio con le colonne incernierate al piede e una cerniera in testa a ciascuna colonna, o in un quadrato di aste incernierate senza diagonale. Togli una cerniera, oppure aggiungi un’asta o un vincolo. |
| *La struttura è labile: si muove quasi senza resistenza.* <br> *La struttura è labile: il nodo … in orizzontale (Dx) … si muove praticamente senza resistenza.* | Quasi un meccanismo, oppure una rigidezza prossima a zero. Il messaggio esteso indica i nodi e le direzioni. Controlla i vincoli, le cerniere e i valori di `E`, `A` e `Iy`. |
| *La struttura è un meccanismo: può muoversi senza resistenza.* <br> *La struttura è un meccanismo: la matrice di rigidezza è singolare.* | Qualcosa può muoversi liberamente senza che i controlli precedenti lo abbiano rilevato. Verifica che ogni parte sia trattenuta da almeno tre vincoli e che le cerniere di estremità non lascino un’asta libera di ruotare. |
| *L’elemento … ha lunghezza nulla: i nodi … e … sono nello stesso punto.* | Due nodi dello stesso elemento sono sovrapposti. Spostane uno, oppure elimina l’elemento. |
| *L’elemento … ha lo stesso nodo a entrambe le estremità.* | Elimina l’elemento e ridisegnalo tra due nodi diversi. |
| *L’elemento … fa riferimento al nodo / materiale / alla sezione inesistente …* | L’oggetto che usa è stato eliminato, di solito in un file di progetto modificato a mano. Riassegnalo nella tabella *Elementi*. |
| *L’elemento … deve avere esattamente 2 nodi.* | Un elemento danneggiato in un file importato. Eliminalo e ridisegnalo. |
| *Il carico nodale #n fa riferimento al nodo inesistente …* <br> *Lo spostamento imposto #n fa riferimento al nodo inesistente …* | Elimina il carico, oppure assegnagli un nodo esistente. |
| *Il carico su elemento #n fa riferimento all’elemento inesistente …* | Elimina il carico. |
| *Il solutore si è interrotto per un’incoerenza interna del modello.* | Un errore generico. Annulla l’ultimo passo, oppure salva il progetto e [segnalalo](#reporting-a-bug). |

### Avvisi {#warnings}

Il modello è risolto comunque, ma controlla questi punti:

| Messaggio | Significato e soluzione |
| --- | --- |
| *Il nodo … non è collegato a nessun elemento e il solutore lo ignora.* | Un nodo isolato. Eliminalo, oppure collegalo. |
| *Il nodo … è vincolato ma nessun elemento vi è collegato, quindi il vincolo non ha alcun effetto.* | Un vincolo su un nodo isolato. |
| *Il carico nodale #n contiene valori non validi.* <br> *Lo spostamento imposto #n contiene valori non validi.* | Una componente che non è un numero. Modifica il carico. |

### Durante la modifica {#while-editing}

Questi messaggi compaiono in una finestra del browser mentre lavori, e il modello resta com’era:

| Messaggio | Significato e soluzione |
| --- | --- |
| *Aggiungi prima un materiale.* <br> *Aggiungi prima una sezione.* | Un elemento ha bisogno di entrambi. Aggiungine uno nella scheda *Materiali* o *Sezioni*, poi ridisegna l’elemento. |
| *Seleziona un materiale e una sezione.* | Nella finestra **Aggiungi elemento** c’è un campo vuoto. Scegli entrambi. |
| *L’etichetta … è già in uso.* | Due nodi, elementi, materiali o sezioni non possono avere la stessa etichetta. Scegline un’altra. |
| *Per questo nodo esiste già uno spostamento imposto. Rimuovilo prima.* | Un nodo accetta un solo spostamento imposto. Modifica quello che ha, oppure eliminalo prima. |

## Non compare nessun disegno {#no-results-are-drawn}

Se non compare nessun diagramma, controlla in quest’ordine:

::div{.steps}

### Controlla le opzioni di visualizzazione {#check-the-display-options}

Se non c’è nessun messaggio, il modello è risolto: il diagramma potrebbe essere semplicemente disattivato. Spunta **M<sub>y</sub>(x)**, o un altro risultato, nelle opzioni di visualizzazione in alto a destra nella vista; il pulsante ⚙ sopra di esse mostra il pannello. Un modello senza alcun carico ha risultati nulli ovunque, quindi anche in quel caso non c’è nulla da disegnare.

### Controlla i vincoli {#check-the-supports}

Il solutore richiede almeno tre direzioni vincolate, e nel complesso i vincoli devono impedire alla struttura di traslare o di ruotare. Una trave su due carrelli ne ha solo due e scivola via: trasforma uno dei due in una **cerniera**. Neppure tre carrelli paralleli, o vincoli le cui rette d’azione passano per uno stesso punto, la trattengono. Vedi [Nodi e vincoli](/it/essentials/nodes-supports#supports).

### Controlla che gli elementi siano collegati {#check-the-connections}

Due nodi con le stesse coordinate restano due nodi separati, e una parte che tocca il resto solo lì resta libera. Elimina il nodo doppio e ricollega gli elementi. Quando posizioni un nodo su un elemento, rispondi **Collega alla struttura** per dividere lì l’elemento.

### Conta le cerniere {#count-the-hinges}

Un telaio con le colonne incernierate al piede e una cerniera in testa a ciascuna colonna, o un quadrato di aste incernierate senza diagonale, è un meccanismo. EduBeam cerchia le cerniere e anima un contorno tratteggiato che mostra il moto. Vedi [Cerniere di estremità](/it/essentials/elements#end-hinges).

### Cerca una rigidezza nulla {#look-for-zero-stiffness}

`E`, `A` o `Iy` inseriti come 0, o nell’unità sbagliata, fanno muovere parte della struttura quasi senza resistenza. EduBeam la segnala come *labile*.

::

## I risultati sembrano sbagliati {#results-look-wrong}

| Sintomo | Causa probabile |
| --- | --- |
| I carichi agiscono verso l’alto | L’asse globale **z punta verso il basso**, quindi un `Fz` o un `fz` positivo agisce verso il basso; i valori negativi puntano verso l’alto. Con gli assi y verso l’alto è il contrario. Vedi [Carichi](/it/essentials/loads#sign-convention-in-one-line). |
| La freccia è sbagliata di uno o più ordini di grandezza | Un errore di unità: `E` inserito in Pa mentre il campo si aspetta MPa, o `Iy` in cm⁴ mentre si aspetta m⁴. L’indicatore delle unità in basso a destra nella vista elenca le unità usate da ogni campo. |
| La freccia è leggermente maggiore della formula del manuale | La deformazione a taglio della trave di Timoshenko. Vedi [Verificare i risultati a mano](/it/guide/verification#shear-deformation). |
| Un segno sembra sbagliato | Leggi il segno dal valore, non dal lato su cui è disegnato il diagramma: un M positivo tende le fibre inferiori. Le forze di estremità in *Risultati degli elementi* seguono gli assi locali dell’elemento, non la convenzione N-V-M. Vedi [Leggere il segno](/it/essentials/results#reading-the-sign). |
| Un diagramma sta dal lato «sbagliato» | Il lato è un’impostazione di visualizzazione: il momento flettente dal lato teso o da quello compresso, N e V da una parte o dall’altra della linea tratteggiata. **Impostazioni → Impostazioni della vista → Diagrammi delle forze interne**. |
| Due colonne identiche mostrano tagli di segno opposto | Il segno di V segue il verso di ciascun elemento. Scambia i nodi di una delle due per confrontarle. |
| Numeri come `4 · 10¹` | Il formato scientifico. Scegli *Automatico* in **Impostazioni → Lingua e impostazioni locali → Formato dei numeri**. |
| I diagrammi sono enormi o minuscoli | Riguarda solo il disegno. Regola **Scala dei risultati** in **Impostazioni → Impostazioni della vista**. |
| Un carico negli assi locali punta dalla parte sbagliata | L’asse x locale di un elemento va dal nodo *iniziale* al nodo *finale*. Scambia i nodi, oppure inverti il segno. |
| Il carico su un’asta inclinata non torna | **LCS** è spuntato per impostazione predefinita, quindi `fz` agisce perpendicolarmente all’asta. Togli la spunta per un carico verticale. |
| Un carico termico non fa nulla | Una struttura isostatica si deforma liberamente per effetto della temperatura, senza forze interne. Per la deformazione, verifica che α non sia 0 e, per un gradiente, che l’altezza $h$ della sezione sia impostata. |

## File e link {#files-and-links}

| Sintomo | Soluzione |
| --- | --- |
| *Impossibile importare il file. Controlla il formato del file.* | Il file non è né un progetto EduBeam né una sessione dell’EduBeam desktop. Il tuo modello resta invariato. |
| *Questa sessione di EduBeam contiene più casi di carico, ma se ne può aprire solo uno.* | Una sessione dell’EduBeam desktop con più casi di carico: EduBeam apre il primo e indica quelli tralasciati. |
| Un link condiviso apre invece il tuo vecchio modello | Il link è stato troncato o modificato, ad esempio da un programma di posta che lo ha mandato a capo. EduBeam ignora un link che non riesce a leggere e conserva il tuo modello. Copia di nuovo il link per intero. |
| Un link più corto non si apre per un collega | La sua copia di EduBeam è precedente alla versione 1.3.2. Deve ricaricare l’app, oppure puoi condividere il link con **Link più corto** disattivato. Vedi [Condividere un link](/it/essentials/import-export#share-a-link). |

## Problemi di interfaccia {#interface-issues}

| Sintomo | Soluzione |
| --- | --- |
| Le scorciatoie non fanno nulla | Fai prima clic sul disegno: i tasti singoli vengono ignorati mentre un campo di testo ha il focus. Su un Mac usa <kbd>Cmd</kbd> al posto di <kbd>Ctrl</kbd>. Vedi [Tastiera, mouse e touch](/it/reference/shortcuts). |
| <kbd>Canc</kbd> non fa nulla su un Mac | Il tasto ⌫ della tastiera Mac cancella all’indietro, come Backspace. Premi <kbd>Fn</kbd>+<kbd>⌫</kbd>. |
| Non riesco a spostare la vista | La vista si sposta con il tasto centrale o destro del mouse; scegli quale in **Impostazioni → Comandi e scorciatoie**. Sul trackpad, fai clic e trascina con due dita. Su uno schermo touch, trascina con un dito. |
| Il mio modello è sparito | Aprire un link, un file o un esempio, o cancellare la struttura, conserva il vecchio modello: **☰ → Strutture recenti**, oppure <kbd>Ctrl</kbd>+<kbd>Z</kbd>. Quando si apre un link, un messaggio in basso lo segnala: *Hai aperto una struttura condivisa. Quella precedente è conservata in Strutture recenti.*, con un pulsante **Mostra**. |
| Lingua sbagliata | **Impostazioni → Lingua e impostazioni locali**, oppure aggiungi `?lang=it` all’indirizzo. |
| Le modifiche alle impostazioni non vengono mantenute | La memoria locale del browser è bloccata, ad esempio in una finestra di navigazione privata o in una modalità privacy rigorosa. Impostazioni, modello salvato e Strutture recenti ne hanno tutti bisogno. |

## Segnalare un bug {#reporting-a-bug}

Apri una [issue su GitHub](https://github.com/janvorisek/edubeam/issues) indicando browser e sistema operativo, che cosa hai fatto e che cosa ti aspettavi. La cosa più utile in assoluto è un **link condiviso** o il **file di progetto** che mostra il problema.
