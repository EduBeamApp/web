---
description: "Risposte brevi su EduBeam: costi, uso offline, privacy, accuratezza, come calcola i risultati, come citarlo, esercizi, condivisione e codice."
source: site
---

# Domande frequenti

Risposte brevi, ciascuna con il link alla pagina che tratta l’argomento per esteso. Non trovi la tua domanda? Consulta [Risoluzione dei problemi](/it/reference/troubleshooting) oppure [chiedi su GitHub](https://github.com/janvorisek/edubeam/issues).

## Generali {#general}

### Che cos’è EduBeam? {#what-is-edubeam}

Un’app gratuita e open source per l’analisi statica lineare di travi, telai e travature reticolari 2D, pensata per studenti, docenti e ingegneri che vogliono un riscontro immediato. Funziona nel browser. L’[Introduzione](/it/guide/introduction) elenca che cosa fa e che cosa non fa.

### È davvero gratuito? Serve un account? {#is-it-really-free-do-i-need-an-account}

Sì, è gratuito, e no, non serve un account. Apri [run.edubeam.app](https://run.edubeam.app/?lang=it){target="_blank"} e inizia a modellare: non c’è nulla da installare e nessun limite d’uso. Il codice sorgente è su [GitHub](https://github.com/janvorisek/edubeam), con licenza GPL-3.0.

### Con quali browser e dispositivi funziona? {#which-browsers-and-devices-work}

Con qualsiasi versione recente di Chrome, Edge, Firefox o Safari, su computer, tablet o smartphone. Su uno schermo touch, tocca per selezionare, trascina un nodo per spostarlo, trascina altrove per spostare la vista, avvicina o allontana due dita per lo zoom e tieni premuto per il menu dell’area di disegno. Con mouse e tastiera, però, si modella più in fretta. Vedi [Tastiera, mouse e touch](/it/reference/shortcuts#touch).

### Ho perso il mio modello. Posso recuperarlo? {#i-lost-my-model-can-i-get-it-back}

Probabilmente sì. Quando un modello viene cancellato, o sostituito da un link, da un file o da un esempio, EduBeam lo conserva in **☰ → Strutture recenti** (gli ultimi 10), e <kbd>Ctrl</kbd>+<kbd>Z</kbd> annulla la sostituzione. Entrambi valgono solo per questo browser, quindi un modello creato su un altro computer o in un altro profilo del browser lì non c’è. Vedi [Strutture recenti](/it/essentials/import-export#recent-structures).

### Posso usarlo offline? {#can-i-use-it-offline}

Sì. EduBeam è una progressive web app: una volta caricata nel browser, continua a funzionare senza connessione, e il browser può proporre di installarla. Quando esce una nuova versione, una finestra ti chiede conferma prima di aggiornare.

### Dove sono salvati i miei dati? {#where-is-my-data-stored}

Nel tuo browser. Non ci sono account né archiviazione in cloud: l’app conserva il modello e le impostazioni in questo browser, e un link condiviso porta il modello all’interno del link stesso. Vedi [Cosa viene salvato nel browser](/it/essentials/units-settings#what-is-stored-in-your-browser).

L’app su run.edubeam.app raccoglie però statistiche d’uso (Google Analytics) e segnalazioni di errore (Sentry). Una segnalazione di errore, e la registrazione che Sentry fa di un campione di sessioni, può includere ciò che era sullo schermo, compreso il tuo modello.

### Dove posso esercitarmi con la statica? {#practice}

Nella pagina [Esercizi di statica](/it/practice). Ogni volta ti propone una trave, un telaio o una travatura reticolare con valori nuovi: calcola su carta le reazioni e il momento flettente massimo o lo sforzo in un’asta, inseriscili, e ogni valore viene verificato subito. Anche gli [esempi](/it/examples/) hanno domande e soluzioni. I docenti possono stampare un compito diverso per ogni studente, con le soluzioni, dal [generatore di compiti](/it/exam); vedi [Esercizi e compiti scritti](/it/guide/teaching#practice-and-test-papers).

### Come si cita EduBeam? {#cite}

Come software, indicando la versione e la data in cui l’hai usato. La versione si trova in fondo al menu **☰**. Ad esempio:

> Voříšek, J. e collaboratori. *EduBeam*, versione 1.3.4 \[software\]. https://edubeam.app (consultato il 18 novembre 2026).

Per riferirti a un modello preciso, aggiungi il suo [link condiviso](/it/essentials/import-export#share-a-link): apre lo stesso modello per ogni lettore.

## Modellazione {#modelling}

### Come creo un incastro, una cerniera o un carrello? {#how-do-i-make-a-fixed-pinned-roller-support}

Fai clic sul nodo, scegli **Vincoli del nodo** e seleziona il simbolo: cerniera, carrello, incastro, pattino e altri. Oppure spunta i GdL vincolati nella scheda **Nodi**: `Dx` + `Dz` + `Ry` è un incastro, `Dx` + `Dz` una cerniera, solo `Dz` un carrello. [Nodi e vincoli](/it/essentials/nodes-supports#supports) elenca tutti i tipi.

### Come creo una travatura reticolare? {#how-do-i-make-a-truss}

Disegna le aste come normali elementi e svincola la rotazione a entrambe le estremità di ciascuna: spunta entrambe le **Cerniere di estremità** nella scheda **Elementi**, oppure spunta **Cerniera iniziale** e **Cerniera finale** nella fascia in alto prima di disegnare le aste con il mouse. Applica i carichi nei nodi. Il tutorial [Travatura reticolare piana](/it/tutorials/truss) ne costruisce una passo passo.

### Come inserisco una cerniera in un telaio? {#how-do-i-put-a-hinge-in-a-frame}

Svincola il momento all’estremità dell’elemento che deve ruotare liberamente: spunta la sua cerniera di estremità nella scheda **Elementi**. Una cerniera appartiene all’estremità di un solo elemento, quindi in un nodo in cui concorrono più elementi, svincolarne uno lascia gli altri collegati rigidamente. Vedi [Cerniere di estremità](/it/essentials/elements#end-hinges).

### Come aggiungo un vincolo o un carico concentrato in un punto intermedio di una trave? {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

Per un vincolo, aggiungi un nodo sulla trave con il mouse (il pulsante **Aggiungi nodo** con l’icona del cursore) e scegli **Collega alla struttura**: la trave viene divisa in due in quel nodo, e puoi vincolarlo. Un carico concentrato non ha bisogno di un nodo: aggiungi all’elemento un **Carico concentrato** e impostane la posizione dal nodo iniziale. Vedi [Posizionare un nodo su un elemento esistente](/it/essentials/nodes-supports#placing-a-node-on-an-existing-element) e [Carico concentrato](/it/essentials/loads#concentrated-load).

### Posso applicare il peso proprio? {#can-i-apply-self-weight}

Non automaticamente: l’analisi statica non usa la densità del materiale. Aggiungilo come carico uniforme $f_z = \rho g A$, ad esempio $7850 \cdot 9{,}81 \cdot 28{,}48 \cdot 10^{-4} = 219$ N/m, cioè 0,22 kN/m, per una IPE 200.

### Posso modellare vincoli inclinati? {#can-i-model-inclined-supports}

Sì. Assegna al nodo un **Angolo LCS nodale**: i suoi vincoli agiscono allora lungo gli assi ruotati. Vedi [Vincoli inclinati](/it/essentials/nodes-supports#inclined-skewed-supports).

### Posso lavorare con le unità statunitensi? {#can-i-work-in-us-customary-units}

Sì. Fai clic sull’indicatore delle unità in basso a destra nella vista, che apre **Impostazioni → Lingua e impostazioni locali**, e imposta **Sistema di unità** su **USA (imperiale)** per piedi e kip, oppure scegli ogni unità separatamente. Il modello è salvato in unità SI, quindi cambiare unità converte ciò che vedi e non modifica mai il modello. Vedi [Unità e impostazioni](/it/essentials/units-settings).

### Ci sono casi di carico o combinazioni? {#are-there-load-cases-or-combinations}

No, un modello ha un solo caso di carico. Salva ogni caso in un file o in un link a parte e combina tu i risultati. Una sessione dell’EduBeam desktop con più casi di carico si apre con il primo, e un messaggio indica quelli tralasciati.

### Perché i miei carichi puntano verso l’alto? {#why-do-my-loads-point-up}

Probabilmente perché hai inserito un valore negativo. In EduBeam l’asse z globale punta **verso il basso**, quindi un `fz` o un `Fz` positivo è un carico gravitazionale, diretto verso il basso: 12 kN/m verso il basso si scrive `fz = 12`. Vedi [Sistema di coordinate e convenzioni dei segni](/it/elements/conventions#loads). Se il tuo corso usa un asse verticale rivolto verso l’alto, passa a **x a destra, y in alto** in **Impostazioni → Lingua e impostazioni locali → Sistema di coordinate**: dati e risultati seguiranno quell’asse.

## Risultati {#results}

### Perché non c’è un pulsante «Calcola»? {#why-is-there-no-solve-button}

Perché EduBeam risolve di nuovo il modello dopo ogni modifica. Se non compaiono risultati, il modello non si può ancora risolvere, e un messaggio nell’area di disegno spiega perché. [Risoluzione dei problemi](/it/reference/troubleshooting#no-results-are-drawn) elenca che cosa controllare.

### Perché la mia freccia è leggermente diversa dalla formula? {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam usa elementi trave di Timoshenko, quindi la freccia include la deformazione a taglio che le formule dei manuali di solito trascurano. Per una trave snella la differenza è di circa l’1 %, e l’[Avvio rapido](/it/guide/quick-start#_8-check-by-hand) la calcola a mano. In una struttura iperstatica la rigidezza a taglio modifica leggermente anche le forze interne. Altri dettagli in [Verificare i risultati a mano](/it/guide/verification).

### Quanto sono accurati i risultati? Servono più elementi? {#how-accurate-are-the-results-do-i-need-more-elements}

Nell’analisi statica lineare l’elemento trave è esatto per tutti i tipi di carico di EduBeam, quindi basta un elemento per asta e non c’è una mesh da infittire. Aggiungi nodi solo dove ti servono un vincolo, una cerniera, un cambio di sezione, un carico nodale o uno spostamento da leggere. Vedi [Precisione e accuratezza](/it/essentials/results#precision-and-accuracy).

### Come calcola EduBeam i risultati? {#how-does-edubeam-compute-the-results}

Con il metodo degli elementi finiti, nella forma del metodo diretto della rigidezza che si insegna nei corsi di analisi strutturale, direttamente nel tuo browser. [Come EduBeam risolve un modello](/it/elements/analysis) segue ogni passo su un piccolo esempio che puoi ripetere a mano, e il solutore stesso è open source: [@edubeam/fem](/it/solver).

### Posso vedere le matrici di rigidezza? {#can-i-see-the-stiffness-matrices}

Sì. Nella scheda **Elementi**, il pulsante della matrice nella riga di un elemento apre la sua matrice di rigidezza 6 × 6, negli assi globali e in unità SI (N, m). Anche facendo clic su un elemento nella vista trovi **Matrice di rigidezza**. La pagina [Elemento trave](/it/elements/beam#global-stiffness-matrix) la ricava.

### Dove sono elencate le reazioni? {#where-are-the-reactions-listed}

Nella vista, come frecce con i loro valori: **Reazioni** nelle opzioni di visualizzazione, attive per impostazione predefinita. Si trovano anche nel file di **Risultati → Esporta CSV** e in ciò che **Copia** mette negli appunti. La scheda **Risultati** elenca gli spostamenti nodali e le forze di estremità degli elementi. Vedi [Risultati e diagrammi](/it/essentials/results).

## File e condivisione {#files-sharing}

### Come condivido un modello? {#how-do-i-share-a-model}

Premi **Condividi modello** e poi **Copia**. Il link contiene l’intero modello, e chi lo apre ne riceve una propria copia da modificare: non c’è collaborazione in tempo reale. Attiva **Mostra ciò che vedo** perché il link si apra con i tuoi diagrammi e le tue etichette. Vedi [Condividere un link](/it/essentials/import-export#share-a-link) e, per i corsi, [Insegnare con EduBeam](/it/guide/teaching#in-lecture-notes-and-assignments).

### Posso incorporare un modello nel mio sito o nelle slide? {#can-i-embed-a-model-on-my-website-or-in-slides}

Sì. Aggiungi `&viewer=1` a un link condiviso e inseriscilo in un `<iframe>`: vedi [Incorporare un visualizzatore](/it/essentials/import-export#embed-a-read-only-viewer). Per una figura statica in una pagina, in una slide o in dispense stampate, esporta un SVG oppure disegnala dal codice con [@edubeam/plot](/it/plot).

### Posso esportare immagini o tabelle? {#can-i-export-images-or-tables}

Sì. **☰ → Esporta immagine** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) salva il disegno in PNG o SVG, alla dimensione o alla scala che scegli. **Risultati → Esporta CSV** salva entrambe le tabelle dei risultati, e **Copia** le mette negli appunti per un foglio di calcolo. Vedi [Esportare un’immagine](/it/essentials/import-export#export-an-image).

### Posso aprire i file dell’EduBeam desktop? {#can-i-open-files-from-the-desktop-edubeam}

Sì. Le sessioni salvate dall’EduBeam desktop dalla 2.x alla 3.5 (`.xml`) si aprono con **☰ → Apri progetto** o trascinandole sull’app, proprio come un `project.json`. I loro valori vengono letti in kN, kPa e m. Vedi [Aprire un progetto](/it/essentials/import-export#open-a-project).

### Posso generare modelli da codice? {#can-i-generate-models-programmatically}

Sì, in due modi:

- **Scrivi il file.** Un `project.json` è un semplice JSON in unità SI, quindi uno script in qualsiasi linguaggio può scriverlo, ed EduBeam lo apre con **Apri progetto** o trascinandolo sull’app. Vedi il [formato del file di progetto](/it/essentials/import-export#project-file-format).
- **Risolvilo nel codice.** [@edubeam/fem](/it/solver) è il solutore agli elementi finiti di EduBeam, come libreria JavaScript e TypeScript. [@edubeam/plot](/it/plot) disegna poi il risultato, ad esempio come [foglio di esercizi generato](/it/plot/exercises).

La trave dell’[Avvio rapido](/it/guide/quick-start), in unità SI:

```ts
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial('steel', { e: 210e9, g: 81e9 }) // Pa
const section = { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 } // m², m⁴, m
domain.createCrossSection('IPE200', section)
domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]) // cerniera
domain.createNode('2', [6, 0, 0], [DofID.Dz]) // carrello
const beam = domain.createBeam2D('1', ['1', '2'], 'steel', 'IPE200')
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad('1', [0, 12e3], true) // 12 kN/m, verso il basso

solver.solve()
beam.computeBendingMomentAt(lc, 3) // 54000 N·m in mezzeria
beam.computeLocalDefl(lc, 2).w[1] // 0.0502 m in mezzeria
```

## Supporto {#support}

### Come segnalo un bug o chiedo una nuova funzione? {#how-do-i-report-a-bug-or-request-a-feature}

Apri una issue su [GitHub](https://github.com/janvorisek/edubeam/issues) e allega un link condiviso o un file di progetto che mostri il problema. Per domande private scrivi a [support@edubeam.app](mailto:support@edubeam.app).
