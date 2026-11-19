---
description: "Posizionare e modificare i nodi in EduBeam, lo snap alla griglia, dividere gli elementi e scegliere il vincolo: cerniera, carrello, incastro, pattino, anche inclinati."
source: site
---

# Nodi e vincoli

I nodi sono i punti del modello: gli elementi li collegano, e su di essi stanno i vincoli e i carichi nodali. Posizionali digitando le coordinate o con un clic, poi assegna ai nodi vincolati il vincolo che corrisponde al tuo schema.

## Coordinate {#coordinates}

Ogni nodo ha una coordinata **X** e una **Z** nell’[unità di lunghezza](/it/essentials/units-settings#units) corrente. L’asse x punta a destra e l’**asse z punta verso il basso**, quindi tutto ciò che sta sopra il terreno ha Z negativa: una colonna alta 4 m va da `Z = 0` a `Z = −4`.

::model-figure{caption="Un telaio a portale largo 6 m e alto 4 m: A e D sono a Z = 0, B e C a Z = −4"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: fixed, D: fixed }
members: [[A, B], [B, C], [C, D]]
results: []
show: [nodeLabels, dimensions]
---
::

Se preferisci l’asse verticale rivolto verso l’alto, passa nelle Impostazioni agli [assi con y verso l’alto](/it/elements/conventions#y-up-axes). Cambia solo la visualizzazione: il modello e i suoi file restano gli stessi.

## Aggiungere nodi {#adding-nodes}

- **Digitando le coordinate.** Scheda *Nodi* → **Aggiungi nodo** (il pulsante con l’icona **+**), oppure clic destro nell’area di disegno → *Aggiungi nodo*. Inserisci X e Z e, se vuoi, i vincoli e l’angolo del vincolo.
- **Con un clic.** Scheda *Nodi* → **Aggiungi nodo** (il pulsante con l’icona del cursore), oppure tieni premuto <kbd>Ctrl</kbd> mentre scegli *Aggiungi nodo* nel menu dell’area di disegno. Ogni clic posiziona un nodo; per terminare premi <kbd>Esc</kbd>, **Annulla** o di nuovo lo stesso pulsante.
- **Mentre disegni gli elementi.** Quando [disegni gli elementi con il mouse](/it/essentials/elements#adding-elements), un clic su un’area vuota crea lì un nodo.
- **Copiando.** Seleziona i nodi (e gli elementi), premi <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd>, poi fai clic dove deve andare la copia, oppure digita uno scostamento Δx, Δz nella fascia in alto e premi **Incolla**.

::div{.shots}

![La finestra Aggiungi nodo](/screenshots/it/qs-node.webp)

![In modalità mouse, la fascia in alto imposta i vincoli e l’angolo di ogni nodo che posizioni](/screenshots/it/nodes-add-banner.webp)

::

I nuovi nodi prendono il primo numero libero, `1`, `2`, `3`, …. Puoi rinominarli nella colonna *Nodo* della tabella, ad esempio in `A`, `B`, `C`.

### Snap {#snapping}

Con **Snap alla griglia** attivo (premi <kbd>S</kbd>, oppure l’indicatore **S** in basso a destra nella vista), i nodi che posizioni o trascini si agganciano alla griglia. Il passo predefinito è 0,1 m, oppure 0,5 ft nelle unità USA; lo cambi in [Impostazioni → Impostazioni della vista → Griglia](/it/essentials/units-settings#viewer-settings). Per qualsiasi altra posizione, digita le coordinate esatte nella tabella.

### Posizionare un nodo su un elemento esistente {#placing-a-node-on-an-existing-element}

Se, mentre aggiungi nodi con il mouse, fai clic su un elemento (o molto vicino), EduBeam ti chiede che cosa intendi:

- **Collega alla struttura** divide l’elemento in due, `1a` e `1b`, uniti nel nuovo nodo. È il modo più rapido per aggiungere un appoggio intermedio o un punto in cui applicare un carico. Le cerniere alle estremità esterne restano dove erano. I carichi uniformi e trapezoidali vengono suddivisi tra le due parti. I carichi concentrati e termici vanno invece tutti alla prima parte, `1a`: nella tabella *Carichi* sposta su `1b` un carico concentrato che si trovava oltre il nuovo nodo (la sua posizione ora si misura dal nuovo nodo) e assegna a `1b` un proprio carico termico.
- **Posiziona nodo isolato** mette il nodo sopra l’elemento, senza collegarlo.

In entrambi i casi il posizionamento dei nodi si ferma lì; per posizionarne altri fai di nuovo clic sul pulsante con il cursore.

## Modificare i nodi {#editing-nodes}

| Operazione | Come fare |
| --- | --- |
| Spostare un nodo | Trascinalo nella vista (su uno schermo touch tienilo premuto e trascinalo), oppure digita X e Z nella tabella *Nodi*. Gli elementi collegati, i loro carichi e le quote lo seguono. |
| Rinominarlo | Digita una nuova etichetta nella colonna *Nodo*. |
| Cambiarne i vincoli | Fai clic sul nodo → **Vincoli del nodo**, oppure usa la colonna *GdL vincolati*. Vedi [Vincoli](#supports). |
| Modificare tutto insieme | La matita nella colonna *Azioni* apre **Modifica nodo**: coordinate, vincoli e angolo del vincolo, con un’anteprima del simbolo. |
| Eliminarlo | La × nella tabella, **Elimina** nel pannello del nodo, oppure selezionalo e premi <kbd>Canc</kbd>. Con il nodo spariscono anche gli elementi, i carichi e le quote collegati. |

Ogni modifica si può annullare con <kbd>Ctrl</kbd>+<kbd>Z</kbd>.

## Vincoli {#supports}

Ogni nodo può muoversi in tre modi, i suoi **gradi di libertà** (GdL): `Dx` lungo x, `Dz` lungo z e `Ry`, una rotazione nel piano del disegno. Un vincolo ne **blocca** alcuni.

Gli otto vincoli sono gli otto modi di combinare questi tre GdL. Leggi la tabella per righe: nella colonna centrale il nodo ruota liberamente, in quella di destra è bloccata anche la rotazione.

| Traslazioni bloccate | Rotazione libera | Anche la rotazione bloccata |
| --- | --- | --- |
| **Entrambe** (`Dx` e `Dz`) | ![](/screenshots/it/b-support-pin.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Cerniera** | ![](/screenshots/it/b-support-fixed.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Incastro** |
| **Solo la verticale** (`Dz`): scorre in orizzontale | ![](/screenshots/it/b-support-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Carrello** | ![](/screenshots/it/b-support-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Pattino** |
| **Solo l’orizzontale** (`Dx`): scorre in verticale | ![](/screenshots/it/b-support-vertical-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Carrello verticale** | ![](/screenshots/it/b-support-vertical-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Pattino verticale** |
| **Nessuna**: scorre in entrambe le direzioni | ![](/screenshots/it/b-support-free.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Libero** (nessun vincolo) | ![](/screenshots/it/b-support-rotation-only.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Solo rotazione bloccata** |

Per ogni GdL bloccato EduBeam calcola una **reazione vincolare**: `Dx` dà una forza orizzontale $R_x$, `Dz` una forza verticale $R_z$, `Ry` un momento $M$. Una cerniera dà quindi $R_x$ e $R_z$, un carrello solo $R_z$, un pattino $R_z$ e $M$, un incastro tutte e tre.

### Assegnare un vincolo {#setting-a-support}

Scegli il simbolo oppure spunta i GdL uno per uno: simbolo e caselle restano sempre coerenti. Le trovi entrambe in tre punti:

- nel pannello del nodo (fai clic sul nodo) → **Vincoli del nodo**, insieme all’**Angolo LCS nodale**, come nella figura;
- nelle finestre **Aggiungi nodo** e **Modifica nodo**;
- nella colonna *GdL vincolati* della tabella *Nodi*, dove il simbolo è un piccolo menu e `Dx`, `Dz`, `Ry` sono caselle.

![Vincoli del nodo nel pannello del nodo: i simboli, le caselle dei GdL e l’angolo del vincolo](/screenshots/it/nodes-support-picker.webp){.shot-lg}

Passa il mouse su un simbolo per vederne il nome.

### Carrello o pattino? {#roller-or-slider}

Entrambi poggiano su una guida e scorrono lungo di essa. La differenza sta nella rotazione:

- il **carrello** è una cerniera su una guida: l’estremità **ruota liberamente**, quindi lì il momento è nullo;
- il **pattino** è un incastro su una guida: l’estremità **non può ruotare**, quindi il vincolo assorbe un momento.

La stessa trave di 6 m con 10 kN/m; cambia solo il vincolo di destra. Passa dalla deformata al momento flettente e viceversa:

::div{.shots}

:::model-figure{caption="Cerniera e carrello: l’estremità destra ruota liberamente; lì M = 0, 30 kN su ciascun appoggio"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

:::model-figure{caption="Cerniera e pattino: l’estremità destra resta orizzontale; lì M = −45 kNm, 37,5 kN sul pattino"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: slider }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

::

La prima è una trave semplicemente appoggiata ($M_{max} = qL^2/8 = 45\ \text{kNm}$ in mezzeria). Sotto carichi verticali il pattino si comporta proprio come un incastro, quindi la seconda è una trave incastrata-appoggiata ($R_B = 5qL/8 = 37{,}5\ \text{kN}$, $M_B = -qL^2/8 = -45\ \text{kNm}$). Tenere orizzontale l’estremità aumenta anche la rigidezza della trave: la freccia massima scende da 9,617 mm a 4 mm. Il pattino si distingue dall’incastro solo quando qualcosa spinge lungo la sua guida.

### Vincoli inclinati {#inclined-skewed-supports}

Un vincolo su un piano inclinato blocca il nodo lungo assi ruotati. Imposta l’**Angolo LCS nodale** α, in gradi da −180 a 180, nel pannello del nodo sotto *Vincoli del nodo*, nelle finestre Aggiungi nodo e Modifica nodo, oppure nel campo **α** della tabella *Nodi*.

Gli assi del nodo ruotano di α e i GdL spuntati agiscono lungo di essi. α ruota x verso z, cioè in senso **orario** sullo schermo (con gli assi y verso l’alto ruota x verso y, in senso antiorario). Un carrello su una superficie che scende di 30° verso destra è quindi un carrello con α = 30°. Il simbolo ruota insieme agli assi, ed EduBeam riporta la reazione lungo di essi.

::model-figure{caption="Carrello in B ruotato di α = 30°: la sua reazione di 34,64 kN è perpendicolare al piano inclinato e la trave ha N = +17,32 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [N, M]
show: [nodeLabels]
---
::

È la stessa trave di prima, 6 m con 10 kN/m, ma ora il carrello poggia su un piano inclinato di 30°. La componente verticale della reazione in B vale ancora $qL/2 = 30\ \text{kN}$, quindi la reazione stessa vale $30/\cos 30° = 34{,}64\ \text{kN}$ e la sua componente orizzontale, $30 \tan 30° = 17{,}32\ \text{kN}$, spinge B verso destra. La cerniera in A lo trattiene, quindi la trave è tesa. Il momento flettente non cambia.

I [carichi nodali](/it/essentials/loads#nodal-loads) su un nodo ruotato si possono assegnare negli assi globali o negli assi del nodo; uno [spostamento imposto](/it/essentials/loads#prescribed-displacements-support-settlements) agisce sempre lungo gli assi propri del vincolo.

### Stabilità {#stability}

Una struttura piana ha bisogno di almeno **tre GdL vincolati**, disposti in modo da trattenerla davvero. Finché mancano vincoli, la vista mostra l’indicatore blu **Servono vincoli**. Se i vincoli sono sufficienti di numero ma non trattengono la struttura (tutti paralleli, oppure tutti concorrenti in un punto), o se le cerniere lasciano ruotare le aste l’una rispetto all’altra, un messaggio rosso indica il problema e un contorno tratteggiato mostra come si muove la struttura. [Risoluzione dei problemi](/it/reference/troubleshooting#messages) spiega ogni messaggio.

## Carichi nodali e cedimenti {#nodal-loads-and-settlements}

Fai clic su un nodo → **Aggiungi carico** per una forza o un momento, oppure → **Imponi spostamento** per spostare un vincolo di una quantità assegnata (un cedimento vincolare). Entrambi sono spiegati in [Carichi nodali](/it/essentials/loads#nodal-loads).

## Quote {#dimension-lines}

Le quote indicano le lunghezze nel disegno. Non influiscono sul calcolo, ma si salvano con il progetto, viaggiano nei link condivisi e compaiono nelle [immagini esportate](/it/essentials/import-export#export-an-image).

| Operazione | Come fare |
| --- | --- |
| Aggiungerne una | Clic destro nell’area di disegno → **Aggiungi quota**, poi fai clic sui due estremi. Un punto vicino a un nodo si aggancia al nodo. |
| Quotare un elemento | Clic destro sull’elemento → **Quota l’elemento**. |
| Modificarla o invertirla | Fai clic sulla quota → **Modifica** per digitarne le coordinate, oppure **Inverti quota** per spostare l’etichetta dall’altro lato. |
| Spostarla | Trascinala, oppure trascina uno dei suoi estremi. Un estremo su un nodo resta legato al nodo e lo segue. |
