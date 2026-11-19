---
description: "Tutorial: trave continua a due campate in EduBeam, confronto con due travi appoggiate, cedimento dell’appoggio centrale e metodo delle forze. Circa 25 minuti."
source: site
---

# Tutorial: trave continua e cedimento vincolare

Modella una trave continua su due campate, confrontala con due travi semplicemente appoggiate e poi fai cedere di 10 mm l’appoggio centrale. Il solo equilibrio non basta a ricavare le reazioni di questa trave, quindi le verificherai con il metodo delle forze.

- **Tempo:** circa 25 minuti. È l’ultimo e il più ricco dei quattro tutorial.
- **Ti serve:** EduBeam aperto in un’altra scheda del browser, su un computer con mouse e tastiera. Se non hai mai usato EduBeam, fai prima l’[Avvio rapido](/it/guide/quick-start) o uno dei tutorial precedenti.
- **Prerequisiti:** il metodo delle forze con un’incognita iperstatica e le frecce in mezzeria di una trave appoggiata, $5qL^4/(384EI)$ con un carico uniforme e $FL^3/(48EI)$ con un carico concentrato.
- **Unità:** SI. L’indicatore delle unità in basso a destra nella vista deve mostrare `m m² kN kNm MPa`. Se mostra piedi e kip, fai clic sull’indicatore e imposta **Sistema di unità** su **SI (metrico)**.

**Imparerai a**

- vedere che cosa si guadagna con la continuità: momenti e frecce minori che in campate semplicemente appoggiate,
- imporre un cedimento vincolare e leggere le forze che provoca da solo,
- verificare una trave iperstatica con il metodo delle forze e capire perché una trave più rigida risente di più di un cedimento.

::div{.actions}
[Apri EduBeam ↗](https://run.edubeam.app/?lang=it){target="_blank"} [Vai alla verifica a mano](#check-by-hand)
::

::model-figure{caption="La trave completata: due campate di 6 m con 10 kN/m, prima del cedimento"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels, dimensions]
---
::

## Il problema {#the-problem}

- Due campate di luce $L = 6$ m: una cerniera nel nodo 1, carrelli nei nodi 2 e 3.
- Un carico uniforme $q = 10$ kN/m su entrambe le campate.
- Acciaio, $E = 210$ GPa, e $I_y = 8{,}356 \times 10^{-5}$ m⁴ (un IPE 300), quindi $EI = 17\,547{,}6$ kNm².
- Nella seconda parte l’appoggio centrale, nodo 2, cede di $\Delta = 10$ mm.

**È isostatica?** Quattro reazioni (due nel nodo 1, una ciascuna nei nodi 2 e 3) contro tre equazioni di equilibrio: la trave è una volta iperstatica. L’equazione mancante viene dalla deformazione: il nodo 2 non si sposta, oppure si sposta esattamente di $\Delta$.

## Costruisci il modello {#model-it}

::div{.steps}

### Materiale e sezione {#material-and-section}

1. Nella barra dell’app fai clic su **Cancella struttura**, spunta **Elimina materiali** ed **Elimina sezioni** e fai clic su **Conferma**. Nodi ed elementi ripartono dal numero 1.
2. Scheda **Materiali** → **Libreria materiali** → **+** nella riga **Acciaio (S235)**, poi **Annulla** per chiudere la libreria.
3. Scheda **Sezioni** → **Aggiungi sezione**. Inserisci `8,356e-5` in **Iy**, lascia **Area**, **Altezza** e **Coefficiente di taglio** a `1` e fai clic su **Aggiungi sezione**.

Con un’area di 1 m² la trave non si deforma a taglio in modo apprezzabile, come presuppone il calcolo a mano. Questa volta $I_y$ conta anche per le forze: vedrai dove.

### Disegna la trave {#draw-the-beam}

1. Scheda **Elementi** → il secondo pulsante **Aggiungi elemento**, quello con l’icona del cursore.
2. Fai clic in (0, 0), (6, 0) e (12, 0).
3. Premi <kbd>Esc</kbd> per smettere di disegnare, poi <kbd>F</kbd> per adattare la vista.

Tre nodi e due elementi. Controlla le coordinate nella tabella **Nodi**.

### Vincoli {#supports}

Fai clic sul nodo 1 → **Vincoli del nodo** → il simbolo **Cerniera**. Ai nodi 2 e 3 assegna il **Carrello**.

### Carico {#load}

Scheda **Carichi** → **Aggiungi carico su elemento** → *Carico uniforme*, **Elemento** `1`, `fz = 10` → **Aggiungi carico su elemento**. Ripeti per l’elemento 2.

::

## Risultati {#results}

Il momento flettente, le reazioni e la deformata sono attivi fin dall’inizio. Per il taglio spunta **V<sub>z</sub> (x)** nelle opzioni di visualizzazione in alto a destra nella vista (l’icona dell’ingranaggio le mostra e le nasconde). EduBeam etichetta diagrammi e reazioni in kN e kNm con due decimali.

- Le reazioni mostrano `22,50` nei nodi 1 e 3 e `75,00` nel nodo 2: l’appoggio centrale porta più della metà dei 120 kN.
- Il momento sul nodo 2 mostra `-45,00`: sull’appoggio sono tese le fibre superiori. In campata il momento positivo arriva al massimo a `25,31` kNm, a 2,25 m dagli appoggi di estremità.
- Il taglio salta da `-37,50` a `37,50` sul nodo 2.

### Confronto con due travi appoggiate {#compare-with-two-simple-spans}

Che cosa si guadagna con la continuità? Interrompila: nella tabella **Elementi** spunta la cerniera **finale** dell’elemento 1, nel nodo 2. La trave diventa due campate semplicemente appoggiate di 6 m, una struttura isostatica.

::model-figure{caption="Con una cerniera sul nodo 2: due travi appoggiate, ciascuna con qL²/8 = 45 kNm"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [{ nodes: [1, 2], hinges: [false, true] }, [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, w]
show: [nodeLabels]
---
::

| | Trave continua | Due travi appoggiate |
| --- | --- | --- |
| Reazioni nei nodi 1, 2, 3 | 22,5; 75; 22,5 kN | 30; 60; 30 kN |
| Momento sul nodo 2 | −45 kNm | 0 |
| Massimo momento positivo | 25,31 kNm | 45 kNm |
| Freccia massima, nella vista $w(x)$ delle figure | 4,000 mm | 9,617 mm |

Il momento massimo resta di 45 kNm, ma nella trave continua si sposta sull’appoggio, e in campata il momento positivo è molto minore. Ogni campata è anche 2,4 volte più rigida: la sua estremità sul nodo 2 non può ruotare, quasi come se fosse incastrata. Prima di proseguire togli di nuovo la spunta alla cerniera.

## Il cedimento dell’appoggio centrale {#settle-the-middle-support}

Ora fai abbassare il nodo 2 di 10 mm, come potrebbe fare un plinto su un terreno cedevole.

::div{.steps}

### Imponi il cedimento {#prescribe-the-settlement}

Fai clic sul nodo 2 → **Imponi spostamento**. Nella finestra è già scelto **Spostamento imposto**; inserisci `0,01` in **Dz** e fai clic su **Aggiungi carico nodale**.

![La finestra dello spostamento imposto: si può impostare solo Dz, la direzione bloccata dal carrello](/screenshots/it/p2t-prescribe-displacement.webp){.shot-sm}

Nelle unità SI predefinite gli spostamenti sono in metri, quindi 10 mm diventano `0,01`; il verso positivo è verso il basso. Si possono impostare solo le direzioni vincolate: un carrello si può abbassare, ma non spostare di lato. Maggiori dettagli in [Spostamenti imposti](/it/essentials/loads#prescribed-displacements-support-settlements).

### Leggi i nuovi risultati {#read-the-new-results}

La reazione centrale scende a `70,13` kN e quelle di estremità salgono a `24,94` kN. Il momento sul nodo 2 si riduce a `-30,38` kNm, e il momento positivo in campata cresce, fino a `31,09` kNm.

::model-figure{caption="Il nodo 2 cede di 10 mm: il momento negativo sull’appoggio si riduce e le campate ne prendono di più"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
  - { node: 2, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

### Il cedimento da solo {#look-at-the-settlement-alone}

Elimina i due carichi su elemento: seleziona ciascuno e premi <kbd>Canc</kbd>, oppure usa la × nella sua riga della tabella **Carichi**. Quello che resta è l’effetto del solo cedimento: un momento triangolare di `14,62` kNm sul nodo 2, positivo, e reazioni che tirano il nodo 2 **verso il basso** con `4,87` kN, mentre nei nodi 1 e 3 spingono verso l’alto con `2,44` kN ciascuna. La trave si oppone a essere inflessa secondo la forma imposta dal cedimento, ed è solo questa resistenza a sollecitarla.

::model-figure{caption="Il cedimento da solo: nessun carico, eppure la trave è inflessa e i vincoli reagiscono"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { node: 2, settlement: { dz: 0.01 } }
results: [M, w]
show: [nodeLabels]
---
::

Somma questi valori ai risultati del solo carico e ottieni la trave sotto carico con il cedimento: 75 − 4,87 = 70,13 kN, −45 + 14,62 = −30,38 kNm. L’analisi è lineare, quindi vale la sovrapposizione degli effetti.

### Interrompi di nuovo la continuità {#cut-the-continuity-again}

Ripristina i carichi con <kbd>Ctrl</kbd>+<kbd>Z</kbd>, una volta per ogni carico eliminato, e spunta di nuovo la cerniera finale dell’elemento 1. Ora le campate, sull’appoggio abbassato, ruotano semplicemente: reazioni e momenti sono esattamente quelli di due travi appoggiate, qualunque sia il cedimento, e senza carichi sarebbero nulli. **Un cedimento provoca forze interne solo in una struttura iperstatica.** Prima di proseguire togli la spunta alla cerniera.

::

## Verifica a mano {#check-by-hand}

Usa il metodo delle forze. Togli l’appoggio nel nodo 2 e sostituiscilo con la sua reazione incognita $R_2$, diretta verso l’alto, su una trave semplicemente appoggiata di luce $2L = 12$ m.

**Frecce della trave svincolata nel nodo 2.** Sotto il carico e sotto una forza unitaria verso l’alto nel nodo 2:

$$
\delta_q = \frac{5q\,(2L)^4}{384\,EI} = \frac{5 \cdot 10 \cdot 12^4}{384 \cdot 17\,547{,}6} = 0{,}15387\ \text{m}
$$

$$
\delta_{1} = \frac{(2L)^3}{48\,EI} = \frac{12^3}{48 \cdot 17\,547{,}6} = 0{,}0020516\ \text{m/kN}
$$

**Congruenza.** $R_2$ deve riportare in alto il nodo 2 finché non si trova dove sta l’appoggio: a zero, oppure $\Delta$ più in basso.

$$
R_2\,\delta_1 = \delta_q - \Delta \quad\Rightarrow\quad R_2 = \frac{\delta_q - \Delta}{\delta_1}
$$

**Tutto il resto** segue dall’equilibrio; il massimo momento positivo si trova dove il taglio $R_1 - qx$ si annulla.

| | Formula | Senza cedimento | Nodo 2 abbassato di 10 mm |
| --- | --- | --- | --- |
| $R_2$ | $(\delta_q - \Delta)/\delta_1$ | 75,00 kN | 70,13 kN |
| $R_1 = R_3$ | $(2qL - R_2)/2$ | 22,50 kN | 24,94 kN |
| $M_2$ | $R_1 L - qL^2/2$ | −45,00 kNm | −30,38 kNm |
| $M_{\max}$ | $R_1^2/(2q)$ | 25,31 kNm | 31,09 kNm |

EduBeam mostra gli stessi valori fino all’ultima cifra.

Senza cedimento questi sono i valori dei manuali, $R_2 = 10qL/8$, $M_2 = -qL^2/8$ e $M_{\max} = 9qL^2/128$. Il cedimento da solo cambia le reazioni di $\Delta/\delta_1 = 4{,}874$ kN e il momento sul nodo 2 di

$$
\Delta M_2 = \frac{\Delta}{\delta_1} \cdot \frac{2L}{4} = \frac{3\,EI\,\Delta}{L^2} = \frac{3 \cdot 17\,547{,}6 \cdot 0{,}01}{36} = 14{,}62\ \text{kNm}
$$

Nota che compare $EI$. Le forze provocate da un carico dipendono solo da quanto le aste sono rigide *l’una rispetto all’altra*; le forze provocate da uno spostamento imposto crescono con la rigidezza stessa. Su un appoggio che cede, una trave più rigida richiama momenti maggiori.

## Sperimenta {#experiment}

Parti dalla trave sotto carico con il cedimento, cambia una cosa alla volta, prevedi il risultato e solo dopo guarda. <kbd>Ctrl</kbd>+<kbd>Z</kbd> annulla ogni modifica.

**Raddoppia la rigidezza.** Nella tabella **Sezioni** imposta **Iy** a `1,6712e-4`. L’effetto del cedimento sul momento nel nodo 2 raddoppia, a 29,25 kNm, e $M_2$ si riduce a −15,75 kNm. Con il solo carico non cambierebbe nulla, tranne le frecce, che si dimezzerebbero.

**Trova il cedimento che libera il nodo 2.** Per quale $\Delta$ il momento sul nodo 2 è nullo? $\Delta M_2 = 45$ kNm richiede $\Delta = 45 L^2/(3EI) = qL^4/(24EI) = 0{,}0308$ m. Cambia il cedimento in `0,0308`, nella tabella **Carichi** oppure con un doppio clic su di esso nella vista: le reazioni diventano 30, 60 e 30 kN, quelle di due travi appoggiate, a meno dell’arrotondamento di $\Delta$. $qL^4/(24EI)$ è la rotazione di estremità di una trave appoggiata moltiplicata per $L$: il cedimento inclina ogni campata quanto basta a chiudere l’angolo sul nodo 2, e alla continuità non resta più niente da fare.

**Lascia andare il nodo 2.** Cambia il cedimento in `0,1539`, la freccia $\delta_q$ della trave svincolata di 12 m. La reazione nel nodo 2 scende praticamente a zero, e la trave porta il carico come un’unica campata appoggiata: 180 kNm in mezzeria. Un appoggio che cede così tanto non è più un appoggio.

**Solleva invece il nodo 2.** Cambia il cedimento in `-0,01`, cioè 10 mm verso l’alto. Ogni variazione dovuta al cedimento cambia segno: ora il nodo 2 porta 79,87 kN e il momento negativo cresce a −59,62 kNm.

Altre verifiche in forma chiusa, tra cui il cedimento di una trave incastrata-appoggiata, sono in [Verificare i risultati a mano](/it/guide/verification#prescribed-displacement).

## Prossimi passi {#next-steps}

::card-grid{cols="2"}
:::card{title="Esercizi: travi continue" icon="lucide:dices" to="/it/practice?p=K2049"}
Travi a due campate caricate su una campata o su entrambe, da risolvere con il metodo delle forze, con le tue risposte verificate subito. Inizia con K2049; per altri esercizi, seleziona solo **Trave continua a due campate** e premi **Nuovo esercizio**.
:::
:::card{title="Galleria degli esempi" icon="lucide:library" to="/it/examples/"}
Questo era l’ultimo tutorial. Nella galleria degli esempi trovi altri modelli da aprire, modificare e verificare, ed esercizi da assegnare.
:::
::
