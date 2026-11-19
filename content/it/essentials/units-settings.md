---
description: "Impostazioni di EduBeam: lingua, unità SI o USA, formato dei numeri, assi z in basso o y in alto, griglia, diagrammi, colori, tasto per spostare la vista, dati nel browser."
source: site
---

# Unità e impostazioni

Scegli la lingua, le unità e gli assi con cui lavori, e l’aspetto del disegno. Le impostazioni cambiano solo il modo in cui il modello viene mostrato e inserito: EduBeam salva il modello sempre in unità SI, con l’asse z verso il basso, quindi un progetto o un link si apre allo stesso modo con qualsiasi impostazione.

Alle impostazioni si arriva in tre modi:

- la scheda **Impostazioni** sopra la vista le mostra a piena grandezza al posto del modello, su *Lingua e impostazioni locali*; la scheda **Vista** ti riporta indietro;
- l’**indicatore delle unità** in basso a destra nella vista (`m m² kN kNm MPa`) le apre in una finestra su *Lingua e impostazioni locali*;
- **Altre impostazioni** sotto le [opzioni di visualizzazione](/it/essentials/user-interface#display-options) apre la finestra su *Impostazioni della vista*.

Le impostazioni si salvano nel browser e restano anche quando ricarichi la pagina. **Ripristina impostazioni**, sotto l’elenco delle pagine, riporta i valori predefiniti: formato dei numeri, assi, tasto per spostare la vista, le unità della tua area geografica e tutte le impostazioni della vista e le opzioni di visualizzazione. La lingua resta quella scelta. Il ripristino non si può annullare.

## Lingua e impostazioni locali {#language-locale}

![Impostazioni → Lingua e impostazioni locali](/screenshots/it/settings-language.webp)

**Lingua.** 18 lingue; la prima volta EduBeam segue la lingua del browser. Il separatore decimale segue la lingua. Un link può scegliere la lingua per chi lo apre: aggiungi `?lang=` con uno dei codici `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn` (cinese), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`.

**Formato dei numeri.** Come vengono scritti i risultati nelle tabelle e nei tooltip: *Scientifico* (1,5 · 10⁴, il predefinito), *Ingegneristico* (15 · 10³) oppure *Automatico*. Vedi [Formato dei numeri](/it/essentials/results#number-format).

**Sistema di coordinate.** *x a destra, z in basso* (il predefinito) oppure *x a destra, y in alto*. Con *x a destra, y in alto* l’asse verticale si chiama y e punta verso l’alto, e i momenti sono attorno a z. Coordinate verticali, forze, spostamenti, reazioni e angoli dei vincoli cambiano segno, e ogni campo, tabella, tooltip ed esportazione usa i nuovi nomi. Il modello, il disegno e i file salvati restano esattamente gli stessi. Vedi [Assi con y verso l’alto](/it/elements/conventions#y-up-axes).

![Il telaio a tre cerniere con gli assi y verso l’alto: l’indicatore degli assi nell’angolo punta y verso l’alto](/screenshots/it/settings-y-up.webp){.shot-lg}

**Sistema di unità.** *SI (metrico)* o *USA (imperiale)* imposta tutte le unità in un colpo solo. Alla prima visita scegli nella finestra di benvenuto. EduBeam propone le unità USA solo quando il browser usa le impostazioni locali degli Stati Uniti *e* il computer è in un fuso orario degli Stati Uniti; in tutti gli altri casi propone il SI. Se poi cambi una singola unità, il sistema risulta *Personalizzato*.

### Unità {#units}

Ogni grandezza ha la propria unità. I campi di inserimento (che la mostrano alla fine del campo), le tabelle, i tooltip e le etichette dei diagrammi la usano tutti, e cambiare un’unità converte ciò che è mostrato. Nel modello non cambia nulla, quindi passare avanti e indietro non fa perdere niente.

| Grandezza | Scelte | SI | USA |
| --- | --- | --- | --- |
| Lunghezza (geometria, posizione dei carichi) | m, cm, mm, ft, in | m | ft |
| Dimensioni della sezione | m, cm, mm, ft, in | m | in |
| Spostamento (risultati, cedimenti imposti) | m, cm, mm, ft, in | m | in |
| Area | m², cm², mm², ft², in² | m² | in² |
| Momento d’inerzia | m⁴, cm⁴, mm⁴, ft⁴, in⁴ | m⁴ | in⁴ |
| Massa | kg, lb | kg | lb |
| Forza | N, kN, MN, kgf, Tonf, lbf, kip | kN | kip |
| Momento flettente | Nmm, Nm, kNm, MNm, Tonf·m, lbf·in, lbf·ft, kip·in, kip·ft | kNm | kip·ft |
| Pressione (E, G) | Pa, kPa, MPa, GPa, ksc, psi, ksi, psf, ksf | MPa | ksi |
| Temperatura | °C, °F | °C | °F |

Alcune unità derivano dalle altre:

- I **carichi distribuiti** sono una forza per unità di lunghezza: kN/m nel SI, kip/ft nelle unità USA.
- La **densità** è una massa per lunghezza³: kg/m³ o lb/ft³.
- La **dilatazione termica** segue la temperatura: 1/K o 1/°F. I carichi termici sono *variazioni* di temperatura, quindi 10 °C corrispondono a 18 °F.
- Le **rotazioni** sono sempre in radianti, gli angoli dei vincoli in gradi.

Tonf è la tonnellata-forza metrica (1000 kgf), non la short ton statunitense. Le unità USA usano le loro definizioni esatte: 1 ft = 0,3048 m, 1 kip = 4448,2216 N. Inserisci i piedi come numeri decimali, ad esempio `5,5`; i righelli e il mirino indicano piedi e pollici (5′-6″).

## Impostazioni della vista {#viewer-settings}

Qui decidi l’aspetto del disegno. L’**Anteprima della vista** a destra è una piccola trave inclinata che mostra subito ogni modifica; i pulsanti sotto di essa scelgono quale risultato mostrare, e quando cambi un’impostazione dei diagrammi o un colore l’anteprima passa a quel risultato.

![Impostazioni → Impostazioni della vista, con l’anteprima dal vivo e le impostazioni dei diagrammi a destra](/screenshots/it/b-settings-viewer.webp)

La colonna di sinistra, dall’alto:

- *Griglia*: **Mostra griglia** (<kbd>G</kbd>) disegna la griglia e i righelli; **Snap alla griglia** (<kbd>S</kbd>) aggancia alla griglia i nodi che posizioni o trascini; **Mostra mirino** segna sui righelli la posizione del puntatore, quando usi il mouse. All’inizio sono attivi tutti e tre. **Passo dello snap** vale 0,1 m, oppure 0,5 ft nelle unità USA. Quando passi dalle unità metriche a quelle USA o viceversa, un passo rimasto al valore predefinito diventa il predefinito dell’altro sistema; un passo impostato da te resta invariato.
- *Dimensioni*: **Scala dei risultati**, da 8 a 120 px (all’inizio 48 px), è l’altezza con cui EduBeam disegna l’ordinata più grande di un diagramma, o la freccia più grande; è un’impostazione puramente visiva, perché ogni diagramma è scalato sul proprio valore massimo. **Dimensione dei vincoli** va da 50 a 150 % (100 %) e **Dimensione del carattere** da 10 a 20 px (14 px); valori più grandi aiutano con il proiettore.
- *Orientamento delle etichette dei risultati*: i valori scritti lungo l’ordinata, *Perpendicolari al diagramma* (il predefinito), oppure *Sempre orizzontali*.
- *Controlli del modello*: **Mostra come può muoversi una struttura labile** disegna il contorno tratteggiato del meccanismo, e **Anima il movimento** lo fa oscillare avanti e indietro. All’inizio sono attivi entrambi.

### Diagrammi delle forze interne {#internal-force-diagrams}

Ogni scuola disegna i diagrammi a modo suo, quindi EduBeam ti lascia scegliere. Queste impostazioni cambiano solo il disegno, mai i valori. La **linea tratteggiata** lungo ogni elemento indica le sue fibre inferiori, il lato verso cui punta il suo asse z locale (vedi [Verso dell’elemento](/it/essentials/elements#element-direction)).

| Impostazione | Scelte | Predefinito |
| --- | --- | --- |
| **Momento flettente** | disegnato dal *Lato teso* o dal *Lato compresso* | *Lato teso* |
| **Taglio positivo** | disegnato dal *Lato opposto* alla linea tratteggiata, o dal *Lato tratteggiato* | *Lato opposto* |
| **Sforzo normale positivo** | *Lato opposto* o *Lato tratteggiato* | *Lato opposto* |
| **Riempimento** | *Pieno*, *Tratteggiato* (linee trasversali all’asta, come nei disegni a mano) o *Nessuno* | *Pieno* |
| **Grado di ogni tratto** | scrive il grado del polinomio, da 0° a 3°, su ogni tratto di un diagramma | disattivato |

[Risultati e diagrammi](/it/essentials/results#reading-the-sign) spiega come leggere i segni.

### Colori {#colors}

Colori distinti per nodi, elementi, carichi, deformata, sforzo normale, taglio, momento flettente e reazioni. Fai clic su un campione per scegliere un colore. Colori predefiniti: carichi arancione, deformata grigia, N blu, V verde, M rosso, reazioni viola, nodi ed elementi neri.

## Comandi e scorciatoie {#controls-shortcuts}

**Sposta la vista con** stabilisce con quale tasto del mouse trascini l’area di disegno: *Rotellina o tasto destro* (il predefinito), *Rotellina del mouse* (premi la rotellina e trascina) oppure *Tasto destro*. Tutte le scorciatoie sono nella pagina [Tastiera, mouse e touch](/it/reference/shortcuts).

## Cosa viene salvato nel browser {#what-is-stored-in-your-browser}

Oltre alle impostazioni, EduBeam conserva nella memoria locale del browser:

- il **modello corrente**, salvato dopo ogni modifica, così ricaricando la scheda o riaprendo l’app lo ritrovi;
- **Strutture recenti**: gli ultimi 10 modelli che hai cancellato o sostituito, pronti da ripristinare dal menu ☰.

Entrambi restano legati a questo browser su questo dispositivo, e spariscono se cancelli i dati del sito. Per conservare un modello o spostarlo su un altro dispositivo, usa [Salva progetto o Condividi modello](/it/essentials/import-export).
