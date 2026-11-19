---
description: "Salvare e aprire progetti e sessioni dell’EduBeam desktop, condividere link, incorporare il modello, esportare immagini e tabelle, tutto nel browser."
source: site
---

# File, link ed esportazione

:span{#importazione-esportazione-e-condivisione}

Salva il modello in un file, invialo come link, incorporalo in una pagina web, oppure esportane un’immagine o una tabella. In [EduBeam]{.edubeam} tutto avviene nel tuo browser e nulla viene caricato su un server: un link condiviso contiene letteralmente il modello.

::card-grid{cols="3"}
:::card{title="File di progetto" icon="lucide:file-json" to="#save-a-project"}
`project.json` da conservare, consegnare o aprire più tardi.
:::
:::card{title="Link condiviso" icon="lucide:link" to="#share-a-link"}
L’intero modello in un solo URL, per dispense, slide e messaggi.
:::
:::card{title="Immagine o tabella" icon="lucide:image" to="#export-an-image"}
PNG o SVG per le relazioni, CSV per i fogli di calcolo.
:::
::

## Salvare un progetto {#save-a-project}

**☰ → Salva progetto** o <kbd>Ctrl</kbd>+<kbd>S</kbd> (<kbd>⌘</kbd>+<kbd>S</kbd> sul Mac, come per tutte le scorciatoie di questa pagina) scarica `project.json`. Il file contiene i nodi, gli elementi, i materiali, le sezioni (con le forme disegnate), i carichi, le quote e la versione dell’app che lo ha scritto. Puoi rinominarlo liberamente.

## Aprire un progetto {#open-a-project}

**☰ → Apri progetto** o <kbd>Ctrl</kbd>+<kbd>O</kbd>, poi scegli il file, oppure **trascina il file in un punto qualsiasi della finestra dell’app**. EduBeam apre:

- i file `project.json` salvati da qualsiasi versione di EduBeam;
- le sessioni `.xml` salvate dall’**EduBeam desktop** dalla 2.x alla 3.5. I loro valori non hanno unità, quindi EduBeam li legge in kN, kPa e m, le unità usate dal suo manuale. EduBeam apre un caso di carico alla volta: da una sessione che ne contiene diversi apre il primo e indica per nome quelli che ha tralasciato.

L’apertura sostituisce il modello corrente, compresi materiali e sezioni. Il modello che avevi non va perso: <kbd>Ctrl</kbd>+<kbd>Z</kbd> lo riporta indietro, e resta conservato in [Strutture recenti](#recent-structures). EduBeam rifiuta con un messaggio un file che non riesce a leggere, e il tuo modello resta com’era.

## Condividere un link {#share-a-link}

**Condividi modello**, nella barra dell’app o nel menu ☰, apre la finestra *Condividi il modello tramite URL*:

![La finestra Condividi il modello tramite URL](/screenshots/it/c1-share.webp){.shot-lg}

- **Copia**, oppure un clic in un punto qualsiasi del campo, copia il link.
- **Apri link** lo apre in una nuova scheda del browser, così vedi quello che vedrà chi lo riceve.
- **Condividi tramite il sistema** passa il link al menu di condivisione del dispositivo, se il browser lo supporta.
- **Link più corto** (attivo per impostazione predefinita) scrive lo stesso modello con circa metà dei caratteri. Le copie di EduBeam precedenti alla versione 1.3.2 (novembre 2026) non riescono a leggerlo finché non vengono aggiornate, quindi disattivalo quando un link deve aprirsi subito ovunque.
- **Mostra ciò che vedo** (disattivato per impostazione predefinita) fa aprire il link con i diagrammi, i carichi e le etichette che hai attivato tu, invece che con le opzioni di visualizzazione di chi lo riceve.

Il link ha la forma `https://run.edubeam.app/?model=…` e codifica l’intero modello. Chi lo apre ottiene una propria copia da modificare; le modifiche **non** vengono sincronizzate all’indietro, quindi quando il modello cambia invia un nuovo link. Modelli molto grandi producono link molto lunghi; in questi casi condividi piuttosto il file di progetto.

Quando qualcuno apre un link, il suo modello precedente finisce in Strutture recenti, e un messaggio gli dice dove trovarlo. I link non scadono mai: un link nelle dispense dell’anno scorso apre oggi lo stesso modello.

## Incorporare un visualizzatore {#embed-a-read-only-viewer}

Aggiungi `&viewer=1` a un link condiviso per aprire il modello in **modalità visualizzatore**: la barra dell’app, la barra inferiore, Annulla e Ripeti, gli indicatori della griglia e delle unità e il mirino sono nascosti; restano il disegno, i pulsanti per adattare e centrare e le opzioni di visualizzazione. Non si aprono nemmeno la finestra di benvenuto e le note di versione. Inserisci quell’URL in un `<iframe>` per incorporare un modello interattivo, con lo zoom, nelle dispense, nella pagina di un corso o in una slide:

```html
<iframe
  src="https://run.edubeam.app/?viewer=1&show=MRLS&model=…"
  width="100%"
  height="400"
></iframe>
```

![Il telaio a tre cerniere in modalità visualizzatore](/screenshots/it/viewer-mode.webp){.shot-lg}

La modalità visualizzatore serve per guardare, ma non è bloccata: i visitatori possono comunque trascinare i nodi e cambiare diagramma. Aperto da solo, un link in modalità visualizzatore sostituisce il modello del visitatore come qualsiasi altro link, e il suo modello lo aspetta in Strutture recenti. Quando è incorporato in una pagina di un altro sito, la maggior parte dei browser attuali dà all’iframe una memoria separata, che non tocca il modello del visitatore, ma non tutti i browser lo fanno.

Per una figura che non ha bisogno dell’app, ad esempio un diagramma statico in una pagina, in una slide o in un foglio di esercizi, la libreria di disegno [@edubeam/plot](/it/plot) disegna le strutture e i loro diagrammi a partire dal codice. Le figure interattive di questo sito sono disegnate con essa.

## Parametri URL {#url-parameters}

| Parametro | Effetto |
| --- | --- |
| `model=<data>` | Carica il modello codificato e lo adatta allo schermo. Lo scrive **Condividi modello**. |
| `viewer=1` | [Modalità visualizzatore](#embed-a-read-only-viewer). |
| `show=<letters>` | Apre con attivi esattamente questi livelli, una lettera ciascuno: `N` sforzo normale, `V` taglio, `M` momento flettente, `U` deformata, `R` reazioni, `L` carichi, `S` vincoli, `n` etichette dei nodi, `e` etichette degli elementi. `show=MRLS` mostra il momento flettente, le reazioni, i carichi e i vincoli. Lo scrive **Mostra ciò che vedo**. |
| `lang=<code>` | Cambia la lingua dell’interfaccia: `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn` (cinese), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`. |
| `panel=examples` | Apre subito la galleria degli esempi. |

I parametri si combinano con `&`, come in `?lang=it&viewer=1&model=…`. Dopo averli letti, EduBeam li rimuove dalla barra degli indirizzi. `lang` e `show` restano come impostazioni del visitatore, come se le avesse scelte nell’app.

## Esportare un’immagine {#export-an-image}

**☰ → Esporta immagine** o <kbd>Ctrl</kbd>+<kbd>P</kbd> apre l’esportazione dell’immagine. EduBeam ricompone il disegno per la dimensione che scegli, quindi linee ed etichette mantengono il loro spessore reale.

![Esporta immagine: scegli i livelli, l’inquadratura e la dimensione, poi scarica o copia](/screenshots/it/export-image.webp)

::div{.steps}

### Scegli i livelli {#choose-the-layers}

Gli indicatori in alto scelgono che cosa disegnare: la deformata, N, V, M e le reazioni, poi i vincoli, i carichi, le etichette dei nodi e quelle degli elementi. All’inizio corrispondono alle opzioni di visualizzazione della vista, e cambiarli qui lascia la vista com’è.

### Inquadra il disegno {#frame-the-drawing}

Scegli un rapporto d’aspetto (16:9, 4:3, 3:2 o 1:1), **Adatta tutto**, oppure **Finestra…** per trascinare un rettangolo sul disegno. Puoi anche trascinare i bordi dell’anteprima.

### Imposta la dimensione {#set-the-size}

Larghezza e altezza in pixel, oppure una **Scala** come 1 : 50 per un disegno in scala su carta (a 96 DPI). **Altezza dei diagrammi** imposta la dimensione dei diagrammi dei risultati, e **Sfondo trasparente** elimina il bianco. Se i diagrammi o le etichette non ci stanno, la finestra lo segnala e propone di ridurre i diagrammi o di ingrandire l’area di disegno.

### Salva l’immagine {#save-it}

**Scarica PNG**, **Scarica SVG** oppure, dove il browser lo consente, **Copia negli appunti**. I file prendono il nome dalla loro dimensione, ad esempio `edubeam-512x512.svg`. Su uno schermo ad alta risoluzione il PNG ha più pixel della larghezza e dell’altezza che hai impostato, in proporzione alla densità di pixel dello schermo, così è nitido quanto l’app; la sua dimensione in pixel è indicata accanto ai pulsanti.

::

L’SVG resta nitido a qualsiasi dimensione e funziona in Word, Inkscape e LaTeX su Overleaf: è quindi la scelta migliore per relazioni e tesi. La stessa dimensione inquadra sempre la struttura nello stesso modo, quindi N, V e M esportati uno dopo l’altro, messi affiancati, risultano allineati.

Per creare figure di questo tipo dal codice, ad esempio una per ogni esercizio di un foglio, @edubeam/plot scrive [un file SVG autonomo](/it/plot/functions#a-standalone-svg-file) che si apre negli stessi programmi.

## Esportare i risultati {#export-the-results}

**Esporta CSV** nella scheda **Risultati** scarica entrambe le tabelle dei risultati, reazioni comprese, e **Copia** le mette negli appunti per un foglio di calcolo. Vedi [Esporta CSV e Copia](/it/essentials/results#export-csv-and-copy).

## Strutture recenti {#recent-structures}

**☰ → Strutture recenti** conserva le ultime 10 strutture che sono state cancellate, oppure sostituite da un link, da un file, da un esempio, dall’esercizio guidato *Disegna la tua prima trave* o da un altro ripristino. Per ciascuna vedi una miniatura, che cosa l’ha sostituita e il numero di nodi e di elementi. **Ripristina** ne riporta indietro una: il modello che avevi in quel momento entra a sua volta nell’elenco, e <kbd>Ctrl</kbd>+<kbd>Z</kbd> annulla il ripristino. **Rimuovi** elimina una voce.

![Strutture recenti](/screenshots/it/recent.webp){.shot-lg}

L’elenco è salvato solo in questo browser.

## Esempi {#examples}

**☰ → Esempi** apre una galleria di modelli didattici già pronti. Aprirne uno sostituisce il tuo modello, e <kbd>Ctrl</kbd>+<kbd>Z</kbd> lo riporta indietro. Gli stessi modelli, con esercizi, si trovano nella pagina [Esempi](/it/examples/) di questa guida.

![La galleria degli esempi](/screenshots/it/examples.webp){.shot-lg}

## Salvataggio automatico {#automatic-persistence}

EduBeam salva il modello e le impostazioni nella memoria locale del browser dopo ogni modifica e li ripristina quando torni, anche dopo aver chiuso il browser. È una comodità, non un backup: appartiene a un solo profilo del browser su un solo dispositivo, una finestra privata lo dimentica e cancellare i dati del sito lo elimina. Salva il lavoro importante come file di progetto. [Cosa viene salvato nel browser](/it/essentials/units-settings#what-is-stored-in-your-browser) elenca tutto.

## Formato del file di progetto {#project-file-format}

`project.json` è un JSON semplice e leggibile. Questa è la trave dell’[Avvio rapido](/it/guide/quick-start), con l’acciaio e l’IPE 200 delle librerie:

```json [project.json]
{
  "edubeam": true,
  "version": "1.3.4",
  "domain": {
    "materials": [
      {
        "label": "Steel (S235)",
        "d": 7850,
        "e": 210000000000,
        "g": 81000000000,
        "alpha": 0.000012
      }
    ],
    "crossSections": [
      {
        "label": "IPE 200 (approx)",
        "a": 0.002848,
        "iy": 0.00001943,
        "h": 0.2,
        "k": 0.3932584269662922
      }
    ],
    "nodes": [
      { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] },
      { "label": "2", "coords": [6, 0, 0], "bcs": [2] }
    ],
    "elements": [
      {
        "label": "1",
        "nodes": ["1", "2"],
        "mat": "Steel (S235)",
        "cs": "IPE 200 (approx)",
        "hinges": [false, false]
      }
    ],
    "loadCases": [
      {
        "label": "DefaultLC",
        "nodalLoads": [],
        "elementLoads": [
          { "type": "udl", "target": "1", "lcs": true, "values": [0, 12000] }
        ],
        "prescribedBC": []
      }
    ]
  },
  "dimensions": []
}
```

Tutti i valori sono in **unità SI** (m, N, Pa, rad), qualunque siano le unità visualizzate nell’app. Le coordinate sono `[x, y, z]`, con $y = 0$ e $z$ verso il basso. I vincoli e le componenti dei carichi usano gli id dei GdL `0 = Dx`, `2 = Dz`, `4 = Ry`.

| `type` del carico su elemento | Valori |
| --- | --- |
| `udl` | `values: [fx, fz]` in N/m |
| `trapezoidal` | `startValues: [f1x, f1z]`, `endValues: [f2x, f2z]` in N/m |
| `concentrated` | `values: [Fx, Fz, My, a]` in N, N·m e m dal nodo iniziale |
| `temperature` | `values: [ΔTc, ΔTb, ΔTt]` in K; il gradiente è ΔTb − ΔTt |

`lcs: true`, oppure l’assenza di `lcs`, mette un carico su elemento negli assi locali dell’elemento; `false` in quelli globali. Le altre voci:

- **Carichi nodali**: `{ "target": "2", "values": { "0": Fx, "2": Fz, "4": My } }`, più `"lcs": true` per un carico negli assi di un vincolo ruotato.
- **Spostamenti imposti**: `{ "target": "2", "prescribedValues": { "0": Dx, "2": Dz, "4": Ry } }`; una componente omessa vale 0.
- I file scritti dall’app contengono anche una `date`, un `commit`, gli assi dei vincoli ruotati (`lcs` su un nodo) e le forme `shape` delle sezioni disegnate.

Dato che il formato è semplice, puoi generare modelli con uno script o con un foglio di calcolo e aprirli con **Apri progetto**. Per costruire e risolvere modelli interamente da codice, usa il solutore che sta dietro l’app, la libreria di calcolo [@edubeam/fem](/it/solver).
