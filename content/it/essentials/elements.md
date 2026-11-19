---
description: "Disegnare elementi trave in EduBeam, svincolarne le estremità per cerniere interne e aste reticolari, definire materiali e sezioni da libreria o da un poligono."
source: site
---

# Elementi, materiali e sezioni

In [EduBeam]{.edubeam} ogni elemento è una trave tra due nodi, con un materiale e una sezione. Disegna gli elementi tra i nodi, metti le cerniere di estremità dove la struttura ha cerniere interne, e scegli materiali e sezioni dalle librerie oppure definiscine di tuoi.

## L’elemento trave {#the-beam-element}

C’è un solo tipo di elemento: una **trave di Timoshenko 2D** nel piano x–z, con tre gradi di libertà a ciascuna estremità (`Dx`, `Dz`, `Ry`). Trasmette sforzo normale, taglio e momento flettente, e tiene conto della [deformazione a taglio](#shear-deformation). Un’asta reticolare è lo stesso elemento con [entrambe le estremità incernierate](#end-hinges). La formulazione è nel [manuale teorico](/it/elements/beam).

Per il modello lineare i risultati lungo un elemento sono esatti, quindi **basta un elemento per asta**. Aggiungi un nodo all’interno di un’asta solo dove ti serve un vincolo, una cerniera, un cambio di sezione o un punto in cui leggere gli spostamenti. Non serve nemmeno per una forza concentrata: il [carico concentrato](/it/essentials/loads#concentrated-load) si può applicare in qualsiasi punto dell’elemento.

## Aggiungere elementi {#adding-elements}

Un elemento ha bisogno di un materiale e di una sezione, quindi aggiungi prima quelli (vedi [Materiali](#materials) e [Sezioni](#cross-sections)). Finché mancano, la vista mostra *Nessun materiale definito* o *Nessuna sezione definita*, con un pulsante **Aggiungi**.

- **Scegliendo i nodi.** Scheda *Elementi* → **Aggiungi elemento** (il pulsante con l’icona **+**), oppure clic destro nell’area di disegno → *Aggiungi elemento*. Scegli il **Nodo iniziale** e il **Nodo finale**, spunta se serve **Cerniera** sotto l’uno o l’altro, e scegli il **Materiale** e la **Sezione**. Servono almeno due nodi.
- **Con un clic.** Scheda *Elementi* → **Aggiungi elemento** (il pulsante con l’icona del cursore), oppure tieni premuto <kbd>Ctrl</kbd> mentre scegli *Aggiungi elemento* nel menu dell’area di disegno. Fai clic su un nodo (o su un’area vuota, che ne crea uno), poi sul successivo; continua a fare clic per disegnare una catena di elementi e premi <kbd>Esc</kbd> o **Annulla** per terminare. La fascia in alto imposta **Cerniera iniziale** e **Cerniera finale** per ogni elemento che disegni. Gli elementi ricevono il primo materiale e la prima sezione del modello.

![La finestra Aggiungi elemento](/screenshots/it/qs-element.webp){.shot-md}

## Verso dell’elemento {#element-direction}

Ogni elemento ha i propri **assi locali**. L’asse x locale va dal **nodo iniziale** al **nodo finale**; l’asse z locale è l’asse x locale ruotato di 90° in senso orario sullo schermo. In un elemento disegnato da sinistra a destra, gli assi locali coincidono con quelli globali. La **linea tratteggiata** disegnata lungo ogni elemento indica il suo lato +z locale, le «fibre inferiori».

![Un telaio a portale disegnato A → B → C → D: le linee tratteggiate di tutti e tre gli elementi stanno all’interno del telaio](/screenshots/it/p2b-element-direction.webp){.shot-md}

In questo telaio l’elemento 1 sale da A a B, quindi il suo asse z locale, e con esso la linea tratteggiata, punta verso destra; l’elemento 3 scende da C a D, quindi la sua linea tratteggiata è a sinistra. Disegnate così, le linee tratteggiate di un telaio a portale stanno tutte all’interno.

Il verso conta per:

- i carichi assegnati negli assi locali (**LCS** spuntato), vedi [Carichi su elemento](/it/essentials/loads#element-loads);
- la **Posizione del carico dal nodo iniziale** di un carico concentrato;
- l’ordine delle [forze di estremità](/it/elements/conventions#end-forces-element-results-table) nei risultati: `X12, Z12, M12` nel nodo iniziale, `X21, Z21, M21` nel nodo finale;
- quale lato è il «lato tratteggiato» nelle [impostazioni dei diagrammi](/it/essentials/units-settings#viewer-settings).

Per invertire un elemento premi **Scambia nodi** (le frecce tra i due nodi nella tabella *Elementi*).

## Cerniere di estremità {#end-hinges}

Una cerniera di estremità svincola il momento flettente a un’estremità dell’elemento: lì il momento è nullo e l’estremità può ruotare indipendentemente dal nodo.

- **Una cerniera** crea una cerniera interna in una trave o in un telaio.
- **Due cerniere** creano un’**asta reticolare**, che trasmette solo sforzo normale.

Puoi spuntarle in ciascuno di questi punti:

- nella colonna **Cerniere di estremità** della tabella *Elementi*, una casella per estremità;
- nelle caselle **Cerniera** della finestra **Aggiungi elemento**, oppure nel pannello dell’elemento → **Modifica elemento**;
- in **Cerniera iniziale** e **Cerniera finale** nella fascia in alto, mentre disegni con il mouse.

![La tabella Elementi di un telaio a tre cerniere: l’elemento 2 ha una cerniera alla sua estremità finale, nel nodo C](/screenshots/it/elements-table.webp)

### Una sola cerniera: cerniera interna nella struttura {#one-hinge-a-pin-inside-the-structure}

La stessa trave continua a due campate di 5 m, con 10 kN/m. Nella figura di destra l’elemento 1 ha una cerniera di estremità in B: il momento sull’appoggio si annulla e ogni campata porta il proprio carico come una trave semplicemente appoggiata.

::div{.shots}

:::model-figure{caption="Trave continua: M = −31,25 kNm sull’appoggio B"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M]
show: [nodeLabels]
---
:::

:::model-figure{caption="Cerniera in B: M = 0 sull’appoggio B, 31,25 kNm in ogni campata"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [{ nodes: [A, B], hinges: [false, true] }, [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M]
show: [nodeLabels]
---
:::

::

A mano: per la trave continua $M_B = -qL^2/8 = -31{,}25\ \text{kNm}$ e al massimo $9qL^2/128 = 17{,}58\ \text{kNm}$ in ogni campata; con la cerniera $M_B = 0$ e $M_{max} = qL^2/8 = 31{,}25\ \text{kNm}$ in ogni mezzeria. La cerniera scarica l’appoggio, ma quasi raddoppia i momenti in campata. Per risolvere a mano una trave con una cerniera interna, con le risposte verificate mentre le scrivi, prova l’[esercizio G2048](/it/practice?p=G2048).

### Due cerniere: asta reticolare {#both-hinges-a-truss-bar}

Una mensola a muro formata da due aste, entrambe incernierate alle due estremità, che porta 20 kN in B. Le aste trasmettono solo sforzo normale e il diagramma del momento flettente resta vuoto.

::model-figure{caption="Tirante AB: N = +26,67 kN (trazione); puntone CB: N = −33,33 kN (compressione)"}
---
nodes: { A: [0, 0], B: [4, 0], C: [0, 3] }
supports: { A: pin, C: pin }
members: [{ nodes: [A, B], hinges: [true, true] }, { nodes: [C, B], hinges: [true, true] }]
loads:
  - { node: B, fz: 20 }
results: [N, M]
show: [nodeLabels]
---
::

A mano: il puntone è lungo 5 m e sale di 3 m, quindi $N_{CB} = -20 \cdot 5/3 = -33{,}33\ \text{kN}$, e il tirante ne equilibra la componente orizzontale, $N_{AB} = 33{,}33 \cdot 4/5 = 26{,}67\ \text{kN}$. Il [tutorial sulla travatura reticolare](/it/tutorials/truss) costruisce così un’intera travatura, e nella pagina [Esercizi di statica](/it/practice?p=T2048) trovi travature da risolvere a mano.

### Incernierare l’elemento, non il nodo {#hinge-the-element-not-the-node}

Una cerniera appartiene a un’estremità di un solo elemento: lascia ruotare liberamente quell’estremità, mentre tutti gli altri elementi che arrivano nel nodo restano collegati rigidamente al nodo. Dove si incontrano due aste, quindi, una cerniera basta a creare un collegamento a cerniera; dove se ne incontrano diverse, incernierale tutte tranne una. In un nodo di una travatura reticolare, dove ogni asta è un’asta reticolare, sono incernierate tutte.

Un nodo in cui tutti gli elementi sono incernierati non ha rigidezza rotazionale. EduBeam lo accetta e ne riporta la rotazione come 0. Se le cerniere rendono la struttura un meccanismo, EduBeam le cerchia e mostra come si muove; vedi [Risoluzione dei problemi](/it/reference/troubleshooting#messages).

## Modificare ed eliminare {#editing-and-deleting}

| Operazione | Come fare |
| --- | --- |
| Cambiare nodi, cerniere, materiale o sezione | Fai clic sull’elemento → **Modifica elemento**, oppure modificalo nella tabella *Elementi*. |
| Invertirlo | **Scambia nodi** nella tabella *Elementi*. |
| Rinominarlo | Digita una nuova etichetta nella colonna *Elemento*. |
| Vederne la matrice di rigidezza | Fai clic sull’elemento → **Matrice di rigidezza**, oppure usa il pulsante della matrice nella colonna *Azioni*. Una finestra mostra la matrice 6 × 6 dell’elemento negli assi globali, in unità SI (N e m) qualunque siano le unità visualizzate, con le cerniere di estremità già condensate. È comoda per controllare un assemblaggio fatto a mano. |
| Eliminarlo | Fai clic sull’elemento → **Elimina**, la × nella tabella, oppure selezionalo e premi <kbd>Canc</kbd>. Con l’elemento si eliminano anche i suoi carichi. |

![Il pannello di un elemento](/screenshots/it/ui-element-menu.webp){.shot-xs}

## Materiali {#materials}

Scheda *Materiali* → **Aggiungi materiale**, oppure **Libreria materiali** per un materiale già pronto. Più elementi possono condividere lo stesso materiale; se lo modifichi, si aggiornano tutti.

| Campo | Unità | A che cosa serve |
| --- | --- | --- |
| Modulo elastico $E$ | MPa | Rigidezza assiale e flessionale, $EA$ ed $EI_y$. Acciaio 210 000 MPa, calcestruzzo circa 30 000 MPa, legno circa 11 000 MPa. |
| Modulo di taglio $G$ | MPa | Rigidezza a taglio $kGA$. A meno che il $k$ della sezione non sia enorme, aggiunge la [deformazione a taglio](#shear-deformation): frecce maggiori e, in una struttura iperstatica, forze interne diverse. $G = E/(2(1+\nu))$: acciaio circa 81 000 MPa. |
| Densità $\rho$ | kg/m³ | Salvata con il materiale, ma non usata: EduBeam non ha un carico da peso proprio. |
| Coefficiente di dilatazione termica $\alpha$ | 1/K | Usato dai [carichi termici](/it/essentials/loads#temperature-load). Acciaio $12 \times 10^{-6}$ 1/K. |

Le unità indicate sono quelle SI predefinite; seguono le tue [impostazioni](/it/essentials/units-settings#units), quindi nelle unità USA E e G sono in ksi, la densità in lb/ft³ e α in 1/°F.

Un nuovo materiale parte da $E$ = 210 000 MPa, $G$ = 87 500 MPa ($E/2{,}4$, cioè $\nu = 0{,}2$), $\rho$ = 1000 kg/m³ e $\alpha = 12 \times 10^{-6}$ 1/K; nelle unità USA parte come acciaio ASTM A992. Per l’acciaio porta $G$ a 81 000 MPa, oppure scegli un acciaio dalla libreria.

![La finestra Aggiungi materiale](/screenshots/it/qs-material.webp){.shot-md}

La **Libreria materiali** (anche *Oppure scegli dalla libreria* nella finestra Aggiungi materiale) elenca per primi i materiali metrici (EN), oppure quelli statunitensi (acciai ASTM, calcestruzzo ACI) quando le lunghezze sono in piedi o pollici. Il **+** su una riga aggiunge quel materiale, con il nome della libreria:

| Famiglia | Materiali |
| --- | --- |
| Metalli | Acciaio S235, S275, S355; acciaio inossidabile 304, 316; ghisa; alluminio 6061-T6, 7075-T6, 5083; rame, ottone, bronzo; titanio Grade 2 e Ti-6Al-4V; acciai USA ASTM A992, A36, A572 Gr. 50 e HSS A500 Gr. C |
| Calcestruzzo | C25/30, C30/37, C40/50, calcestruzzo leggero; USA $f'_c$ = 4 ksi e 5 ksi |
| Legno | C24, GL24h, GL32h |
| Altro | Vetro, GFRP, CFRP, HDPE, PVC, PMMA, policarbonato |

Un materiale ancora usato da qualche elemento non si può eliminare: prima assegna a quegli elementi un altro materiale.

## Sezioni {#cross-sections}

Scheda *Sezioni* → **Aggiungi sezione**, **Libreria sezioni**, oppure **Sezione poligonale** per disegnare una forma tua. Come i materiali, anche le sezioni possono essere condivise da più elementi.

| Campo | Unità | A che cosa serve |
| --- | --- | --- |
| Area $A$ | m² | Rigidezza assiale $EA$ e area a taglio $kA$. |
| Momento d’inerzia $I_y$ | m⁴ | Rigidezza flessionale $EI_y$, rispetto all’asse perpendicolare al disegno. |
| Altezza $h$ | m | Usata solo dai carichi termici: la curvatura è $\alpha\,(\Delta T_b - \Delta T_t)/h$. |
| Coefficiente di taglio $k$ | – | L’area efficace a taglio è $kA$, quindi la rigidezza a taglio è $kGA$. Circa 0,83 per un rettangolo, $A_{web}/A$ per una sezione a I. È l’inverso del fattore di taglio χ dei testi di Scienza delle costruzioni (χ = 1,2 per il rettangolo). |

Una nuova sezione parte da $A$ = 1 m², $I_y = 10^{-4}$ m⁴, $h$ = 1 m e $k$ = 1 (nelle unità USA, un W12×26 con $k$ = 1). Sostituisci questi valori con quelli della tua sezione, oppure scegline una dalla libreria.

::callout{type="tip" title="Confrontare con un testo che trascura la deformazione a taglio"}
La maggior parte dei calcoli a mano usa travi di Eulero–Bernoulli, senza deformazione a taglio. Per ottenere gli stessi risultati assegna a $k$ un valore molto grande, ad esempio `1e10`; gli esempi dell’app e le figure di questo sito usano `1e32`. Una nuova sezione ($k = 1$), la libreria e l’editor dei poligoni tengono tutti conto della deformazione a taglio; [più sotto](#shear-deformation) vedi quanto cambia.
::

La **Libreria sezioni** fornisce valori approssimati per:

| Famiglia | Sezioni | $k$ |
| --- | --- | --- |
| Piene | Rettangoli, quadrati, cerchi | 0,833 (rettangolo), 0,9 (cerchio) |
| Profili a I | IPE 100, IPE 200, HEA 100, HEA 200; profili AISC W da W8×31 a W36×150 | $h\,t_w/A$, l’anima |
| Tubi rettangolari | RHS 100×50×3, 150×100×5; AISC HSS | $2ht/A$, entrambe le anime |
| Tubi circolari | CHS Ø60×3, Ø114×5; AISC HSS circolari | 0,5 |

Prima di farvi affidamento, confronta i valori della libreria con un sagomario.

![La Libreria sezioni](/screenshots/it/sections-library.webp){.shot-lg}

Per un rapido controllo a mano: un rettangolo $b \times h$ ha $A = bh$ e $I_y = bh^3/12$; un cerchio pieno di diametro $d$ ha $A = \pi d^2/4$ e $I_y = \pi d^4/64$.

### Deformazione a taglio: quando contano G e k {#shear-deformation}

La rigidezza a taglio $kGA$ entra nell’elemento attraverso il [parametro di taglio](/it/elements/beam#timoshenko-or-euler-bernoulli) $\Phi = 12EI_y/(kGAL^2)$. Con un $k$ molto grande $\Phi = 0$ e l’elemento è una trave di Eulero–Bernoulli, quindi $G$ non ha alcun effetto. Con un $k$ realistico la deformazione a taglio aumenta sempre gli spostamenti. In una struttura isostatica le forze interne restano le stesse; in una iperstatica cambiano anch’esse, perché le incognite iperstatiche dipendono dalla rigidezza.

Quanto, dipende da quanto è tozza l’asta. Un IPE 200 della libreria ($k = h\,t_w/A = 0{,}393$) in acciaio S235 ($G$ = 81 000 MPa), con 10 kN/m, confrontato con la stessa trave con $k$ = `1e32`:

| Trave | Con deformazione a taglio | Eulero–Bernoulli |
| --- | --- | --- |
| Semplicemente appoggiata, $L$ = 2 m ($L/h$ = 10): freccia in mezzeria | 0,566 mm | 0,511 mm |
| Incastro–carrello, $L$ = 2 m: momento all’incastro | −4,84 kNm | −5,00 kNm |
| Semplicemente appoggiata, $L$ = 6 m ($L/h$ = 30): freccia in mezzeria | 41,85 mm | 41,36 mm |

A mano: la parte della freccia in mezzeria dovuta al taglio è $qL^2/(8kGA)$, cioè 0,055 mm per la trave corta, l’11 % in più rispetto alla parte flessionale $5qL^4/(384EI_y)$. Nella trave incastro–carrello il momento d’incastro scende da $qL^2/8$ a $(qL^2/8)/(1 + \Phi/4)$. Con $L/h$ = 30 entrambi gli effetti sono dell’ordine dell’1 % o meno: per questo nei telai snelli i risultati coincidono con quelli dei testi qualunque sia $k$.

### Sezioni poligonali {#polygonal-sections}

Scheda *Sezioni* → **Sezione poligonale**, oppure *Oppure definisci una forma poligonale* nella finestra Aggiungi sezione: si apre un editor della forma che calcola per te le proprietà della sezione.

![L’editor delle sezioni poligonali con una forma predefinita a I, i suoi assi principali e l’ellisse d’inerzia](/screenshots/it/sections-polygon.webp)

::div{.steps}

### Parti da una forma predefinita {#start-from-a-preset}

Scegli una **Forma predefinita** (rettangolo, sezione a I, a T, a L, a U, rettangolare cava, cerchio, circolare cava), imposta le sue dimensioni e premi **Applica**.

### Modifica la forma {#adjust-the-shape}

Trascina i vertici (si agganciano al **Passo dello snap**), fai clic sul punto medio di un lato per inserire un vertice, oppure fai doppio clic su un vertice per rimuoverlo. Puoi anche digitare le coordinate nella tabella **Vertici**. **Aggiungi foro** aggiunge un contorno interno, e **Centra sul baricentro** sposta la forma in modo che il suo baricentro cada nell’origine.

### Leggi le proprietà {#read-the-properties}

La scheda **Proprietà della sezione** mostra $A$, il baricentro, $I_y$, $I_z$, $I_{yz}$ rispetto al baricentro, i momenti principali $I_1$, $I_2$ con l’**Angolo degli assi principali** $\alpha$ (da $y$ all’asse 1) e i raggi d’inerzia. Il disegno mostra gli assi principali e l’ellisse d’inerzia.

### Aggiungi la sezione {#add-it}

Controlla l’**Etichetta** e il **Coefficiente di taglio** $k$: parte da 0,833, il valore giusto per un rettangolo; una sezione a I richiede circa $A_{web}/A$. Poi premi **Aggiungi sezione** (**Salva** quando modifichi una forma esistente). $A$, $I_y$ e $h$ derivano dalla forma e nella tabella sono in sola lettura; per cambiarli, modifica di nuovo la forma con il pulsante del poligono nella colonna *Azioni*.

::

Le coordinate della sezione sono locali e destrorse: $x$ uscente dallo schermo, $y$ verso sinistra, $z$ verso il basso.

Se la forma non è simmetrica rispetto al piano del telaio (un angolare a L, ad esempio), l’editor ti avverte: un’analisi 2D è esatta solo se l’asta è trattenuta contro l’inflessione laterale e la torsione lungo tutta la sua lunghezza, ad esempio da un solaio. Quando $I_{yz}$ è significativo, scegli tu la rigidezza flessionale: **trattenuta lateralmente e contro la torsione lungo la lunghezza** ($I_y$), oppure **libera di inflettersi lateralmente**, che è minore. In entrambi i casi la torsione non è considerata.
