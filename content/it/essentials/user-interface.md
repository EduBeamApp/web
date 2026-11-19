---
description: "La mappa dell’interfaccia di EduBeam: barra dell’app e menu ☰, la vista con pulsanti e opzioni, selezione e modifica, le tabelle e l’inserimento dei valori."
source: site
---

# Interfaccia utente

[EduBeam]{.edubeam} ha tre zone: la **barra dell’app** in alto, la **vista** al centro, dove disegni, e la **barra inferiore**, con una tabella per ogni tipo di oggetto. Tutto ciò che fai nella vista puoi farlo anche nelle tabelle, e viceversa.

![Le parti dell’interfaccia, numerate come nell’elenco qui sotto](/screenshots/it/ui-overview.webp)

1. **Menu ☰**: apri, salva, condividi ed esporta; esempi e tour guidati.
2. **Cancella struttura** e **Condividi modello**.
3. **Annulla** e **Ripeti**.
4. **Pulsanti della vista**: centra, adatta allo schermo e le opzioni di visualizzazione.
5. **Opzioni di visualizzazione**: quali risultati e quali parti del modello disegnare.
6. **Griglia, snap, mirino e unità.**
7. **Schede della barra inferiore**: Nodi, Elementi, Carichi, Materiali, Sezioni, Risultati.
8. **La tabella** della scheda aperta, in cui puoi modificare ogni valore.

::callout{type="tip" title="Fai il tour"}
**☰ → Fammi fare un giro** ti mostra queste parti direttamente nell’app, una alla volta.
::

## Barra dell’app {#app-bar}

- **☰** apre il menu principale, descritto qui sotto.
- **Cancella struttura** elimina, dopo una conferma, tutti i nodi, gli elementi e i carichi; spunta **Elimina materiali** o **Elimina sezioni** per eliminare anche quelli. <kbd>Ctrl</kbd>+<kbd>Z</kbd> riporta indietro il modello, che resta comunque anche in *Strutture recenti*.
- **Condividi modello** apre la [finestra di condivisione](/it/essentials/import-export#share-a-link) con un link che contiene l’intero modello.
- **Novità** mostra le note di versione, che si aprono anche da sole, una volta, dopo ogni aggiornamento.
- **Documentazione** apre questa guida; l’icona di GitHub apre il codice sorgente.

Su uno smartphone c’è posto solo per ☰ e **Documentazione**: **Cancella struttura** e **Condividi modello** si trovano nel menu.

### Il menu ☰ {#the-☰-menu}

![Il menu ☰](/screenshots/it/ui-app-menu.webp){.shot-xs}

- **Apri progetto** e **Salva progetto** aprono o scaricano un file `project.json` (<kbd>Ctrl</kbd>+<kbd>O</kbd>, <kbd>Ctrl</kbd>+<kbd>S</kbd>).
- **Strutture recenti** conserva gli ultimi 10 modelli che hai cancellato o sostituito, pronti da ripristinare.
- **Esporta immagine** salva il disegno in PNG o SVG, oppure lo copia (<kbd>Ctrl</kbd>+<kbd>P</kbd>).
- **Esempi** è la galleria dei modelli già pronti; **Disegna la tua prima trave** è un esercizio guidato in sette passi; **Fammi fare un giro** è il tour dell’interfaccia.
- **Condividi modello** e **Cancella struttura** funzionano come i pulsanti della barra dell’app.

In fondo al menu trovi la versione dell’app e la sua data di pubblicazione. Come aprire, salvare, condividere ed esportare è spiegato in [File, link ed esportazione](/it/essentials/import-export).

## Vista {#viewer}

È l’area di disegno, dove disegni ed esamini il modello. EduBeam ricalcola i risultati a ogni modifica: non c’è nessun pulsante *Calcola* da premere.

### Pulsanti nell’area di disegno {#buttons-on-the-canvas}

**In alto a sinistra: Annulla e Ripeti** ti portano indietro e avanti tra tutte le modifiche al modello: aggiunte, modifiche, trascinamenti, eliminazioni, cancellazioni (<kbd>Ctrl</kbd>+<kbd>Z</kbd>, <kbd>Ctrl</kbd>+<kbd>Maiusc</kbd>+<kbd>Z</kbd>).

**In alto a destra:**

- **Selezione con riquadro**, sui dispositivi con schermo touch: il trascinamento successivo con il dito seleziona un rettangolo.
- **Centra il modello** porta il modello al centro senza cambiare lo zoom (<kbd>C</kbd>); **Adatta allo schermo** regola lo zoom in modo che il modello si veda per intero (<kbd>F</kbd>).
- **⚙** mostra o nasconde le [opzioni di visualizzazione](#display-options).

**In basso a destra:**

![I pulsanti di griglia, snap, mirino e unità](/screenshots/it/ui-grid-units.webp){.shot-sm}

- **G** mostra o nasconde la griglia e i righelli (<kbd>G</kbd>); **S** attiva o disattiva lo snap alla griglia (<kbd>S</kbd>).
- Il pulsante del **mirino** segna sui righelli la posizione del puntatore; funziona solo con il mouse.
- L’**indicatore delle unità** apre le impostazioni su [Lingua e impostazioni locali](/it/essentials/units-settings#language-locale).

### Opzioni di visualizzazione {#display-options}

Il pulsante ⚙ apre due righe di caselle. La prima sceglie i risultati disegnati sopra il modello: *Deformata*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)* e *Reazioni*; all’inizio sono attivi la deformata, il momento flettente e le reazioni. La seconda mostra o nasconde parti del modello: *Vincoli*, *Carichi*, *Etichette dei nodi* ed *Etichette degli elementi*, tutte attive all’inizio.

![I pulsanti della vista e le opzioni di visualizzazione](/screenshots/it/ui-display-settings.webp){.shot-lg}

**Altre impostazioni** apre le [impostazioni della vista](/it/essentials/units-settings#viewer-settings): dimensioni, colori e il modo in cui vengono disegnati i diagrammi. Che cosa mostra ciascun risultato lo spiega [Risultati e diagrammi](/it/essentials/results#overlays-in-the-viewer).

### Navigazione {#navigating}

| Azione | Mouse e tastiera | Touch |
| --- | --- | --- |
| Zoom | Rotellina del mouse, verso il puntatore; sul trackpad avvicina o allontana due dita, oppure scorri con due dita | Avvicina o allontana due dita |
| Spostamento della vista | Trascina con il tasto destro o con la rotellina premuta; scegli quale dei due in [Comandi e scorciatoie](/it/essentials/units-settings#controls-shortcuts) | Trascina con un dito |
| Adatta, centra | <kbd>F</kbd>, <kbd>C</kbd> o i pulsanti in alto a destra | I pulsanti in alto a destra |

<kbd>Ctrl</kbd>+<kbd>+</kbd> e <kbd>Ctrl</kbd>+<kbd>-</kbd> ingrandiscono e rimpiccioliscono il disegno attorno al suo centro, con qualsiasi layout di tastiera. Non ridimensionano mai l’intera interfaccia, come farebbe invece lo zoom del browser.

### Selezione e modifica {#selecting-and-editing}

| Operazione | Come fare |
| --- | --- |
| Selezionare un oggetto | Fai clic su un nodo, un elemento, un carico o una quota. Accanto si apre un pannello con le sue azioni: aggiungere un carico, assegnare i vincoli, modificare, mostrare la matrice di rigidezza, eliminare. La barra inferiore passa alla scheda corrispondente. |
| Selezionare più oggetti | Trascina un rettangolo su un’area vuota (su uno schermo touch premi prima **Selezione con riquadro**). Il rettangolo seleziona tutti i nodi al suo interno e tutti gli elementi che tocca, con i loro carichi e le loro quote. <kbd>Ctrl</kbd>+<kbd>A</kbd> seleziona tutto. |
| Eliminare, copiare, incollare | <kbd>Canc</kbd>, <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd>. La copia incollata segue il puntatore finché non fai clic, oppure si sposta dello scostamento Δx, Δz che digiti nella fascia in alto. |
| Spostare un nodo | Trascinalo. Con lo snap attivo finisce sulla griglia; gli elementi e i carichi collegati lo seguono. |
| Modificare un carico | Fai doppio clic sul carico. |
| Vedere i dettagli | Passa il mouse su qualsiasi oggetto per vedere un tooltip: gli spostamenti e la rotazione di un nodo, il materiale e la sezione di un elemento, i valori di un carico. Su uno schermo touch tocca l’oggetto: il pannello mostra gli stessi dati. |
| Aprire il menu dell’area di disegno | Fai clic destro nell’area di disegno, oppure tieni premuto sullo schermo touch. |

::div{.shots}

![Il pannello di un nodo: aggiungi un carico, assegna i vincoli, imponi uno spostamento](/screenshots/it/ui-node-menu.webp)

![Passando il mouse su un nodo se ne vedono gli spostamenti e la rotazione](/screenshots/it/ui-hover.webp)

::

Il **menu dell’area di disegno** offre *Aggiungi nodo*, *Aggiungi elemento*, *Aggiungi quota* (e, sopra un elemento, *Quota l’elemento*), poi *Modifica*, *Copia*, *Incolla* ed *Elimina* per la selezione corrente. Tieni premuto <kbd>Ctrl</kbd> mentre scegli *Aggiungi nodo* o *Aggiungi elemento* per posizionarli con il mouse invece che da una finestra.

![Il menu dell’area di disegno](/screenshots/it/ui-canvas-menu.webp){.shot-sm}

Tutte le scorciatoie e tutti i gesti sono elencati nella pagina [Tastiera, mouse e touch](/it/reference/shortcuts).

### Quando il modello non si può risolvere {#when-the-model-cannot-be-solved}

In alto a sinistra nella vista compaiono dei messaggi:

| Messaggio | Significato |
| --- | --- |
| *Nessun materiale definito*, *Nessuna sezione definita* | Aggiungi quello che manca con il pulsante **Aggiungi** accanto al messaggio. |
| Un indicatore blu **Servono vincoli** | Il modello è semplicemente incompleto: servono altri vincoli. |
| Un messaggio rosso, con **Mostra dettagli** | Qualcosa non va. I dettagli elencano ogni problema, ciascuno con un suggerimento. |
| Un messaggio giallo | EduBeam ha risolto il modello, ma qualcosa sembra strano, ad esempio un nodo a cui non è collegato nessun elemento. |

Quando la struttura può ancora muoversi, EduBeam ne mostra il movimento con un contorno tratteggiato che oscilla e cerchia i nodi o le cerniere responsabili. Passa il mouse sul messaggio per rivedere il movimento; il pulsante a forma di occhio lo nasconde.

![Un telaio con cerniere in B e C è un meccanismo: EduBeam mostra come si muove](/screenshots/it/ui-mechanism.webp)

[Risoluzione dei problemi](/it/reference/troubleshooting#messages) spiega ogni messaggio e come rimediare.

## Barra inferiore {#bottom-bar}

Sei schede, ciascuna con una barra degli strumenti e una tabella modificabile. L’etichetta di ogni scheda indica quanti oggetti contiene. Trascina la fila delle schede verso l’alto o verso il basso per ridimensionare la barra, oppure chiudila con il pulsante a destra. Il **?** lì accanto spiega la scheda aperta, e lo stesso fa il **?** accanto ad alcune intestazioni di colonna.

| Scheda | Barra degli strumenti | Colonne della tabella |
| --- | --- | --- |
| **Nodi** | Aggiungi nodo (finestra), Aggiungi nodo (mouse) | Nodo, Coordinate, **GdL vincolati** (simbolo del vincolo, `Dx`, `Dz`, `Ry`, angolo α), Carichi, Azioni |
| **Elementi** | Aggiungi elemento (finestra), Aggiungi elemento (mouse) | Elemento, Tipo, Nodi (con **Scambia nodi**), Materiale, Sezione, **Cerniere di estremità**, Carichi, Azioni |
| **Carichi** | Aggiungi carico nodale, Aggiungi carico su elemento | Tipo, Applicato a, Componenti, Azioni |
| **Materiali** | Aggiungi materiale, Libreria materiali | Materiale, E, G, α<sub>T</sub>, Azioni |
| **Sezioni** | Aggiungi sezione, Libreria sezioni, Sezione poligonale | Forma, Sezione, Area, I<sub>y</sub>, Altezza, Coefficiente di taglio, Azioni |
| **Risultati** | Risultati nodali, Risultati degli elementi, Esporta CSV, Copia | Spostamenti per nodo, oppure forze di estremità per elemento; vedi [Risultati](/it/essentials/results#results-tab) |

Le schede sono descritte in dettaglio nelle pagine [Nodi e vincoli](/it/essentials/nodes-supports), [Elementi, materiali e sezioni](/it/essentials/elements), [Carichi](/it/essentials/loads) e [Risultati e diagrammi](/it/essentials/results#results-tab).

### Inserire i valori {#typing-values}

Tutti i campi numerici, nelle tabelle e nelle finestre, funzionano allo stesso modo:

- I valori sono espressi nelle [unità correnti](/it/essentials/units-settings#units), indicate nell’intestazione della colonna o dopo il campo.
- Vanno bene sia la virgola sia il punto decimale: `2,5` e `2.5` sono la stessa cosa.
- Puoi scrivere operazioni con `+ - * / ^` e parentesi: `6/2`, `3*1,5`, `2^3` o `(4+2)/3` vengono calcolati per te, e `1e-5` vale $10^{-5}$.
- In una tabella il valore si applica con <kbd>Invio</kbd>, <kbd>Esc</kbd>, <kbd>Tab</kbd> o con un clic altrove. Dopo, <kbd>Ctrl</kbd>+<kbd>Z</kbd> lo annulla; mentre stai ancora scrivendo, annulla invece la digitazione.

## Schede sopra la vista {#tabs-above-the-viewer}

**Vista** mostra l’area di disegno. **Impostazioni** mostra al suo posto le [impostazioni](/it/essentials/units-settings) a piena grandezza, così puoi cambiare colori o unità e tornare indietro per vederne l’effetto. L’indicatore delle unità e *Altre impostazioni* aprono le stesse impostazioni in una finestra sopra il modello.

## Finestre mobili {#floating-windows}

**Matrice di rigidezza** (dal pannello di un elemento o dalla tabella *Elementi*) apre una finestra con la matrice di rigidezza 6 × 6 dell’elemento negli assi globali. **Modifica** nel menu dell’area di disegno apre una tabella con la selezione corrente. Sposta una finestra trascinandone la barra del titolo e chiudila con la ×.
