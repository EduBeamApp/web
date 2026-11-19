---
description: "Modella in dieci minuti una trave in acciaio semplicemente appoggiata: materiale, sezione, nodi, vincoli e carico, poi leggi i risultati e verificali a mano."
source: site
---

# Avvio rapido

In circa dieci minuti costruirai una trave in acciaio semplicemente appoggiata, ne leggerai reazioni, taglio, momento flettente e freccia, e verificherai a mano ogni numero. Apri EduBeam in una seconda scheda, o accanto a questa pagina, e segui i passi.

::div{.actions}
[Apri EduBeam ↗](https://run.edubeam.app/?lang=it){target="_blank"} [Vai alla verifica a mano](#_8-check-by-hand)
::

## L’esercizio {#the-problem}

Una trave di 6 m poggia su una cerniera nel nodo 1 e su un carrello nel nodo 2 e porta su tutta la lunghezza un carico uniformemente distribuito di 12 kN/m. È un profilo in acciaio IPE 200: $E = 210$ GPa, $G = 81$ GPa, $A = 28{,}48\ \text{cm}^2$ e $I_y = 1943\ \text{cm}^4$. Tutti e quattro i valori vengono dalle librerie di EduBeam, quindi non devi cercare nulla.

::model-figure{caption="La trave che costruirai: una campata di 6 m dal nodo 1 al nodo 2, con 12 kN/m"}
---
nodes: { 1: [0, 0], 2: [6, 0] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 12 }
results: []
show: [nodeLabels, dimensions]
---
::

## Costruisci il modello {#build-the-model}

::div{.steps}

### Parti da un modello vuoto {#start-from-an-empty-model}

Alla prima visita, una finestra di benvenuto ti chiede come vuoi iniziare. Scegli **SI (metrico)** in **Sistema di unità**, lascia **x a destra, z in basso** in **Sistema di coordinate** e premi **Salta per ora**. L’app mostra allora un piccolo telaio di esempio.

1. Premi **Cancella struttura** nella barra dell’app (sullo smartphone si trova nel menu **☰**).
2. Spunta **Elimina materiali** ed **Elimina sezioni**, poi premi **Conferma**.

L’area di disegno ora è vuota e due messaggi in rosso avvisano che mancano ancora un materiale e una sezione. Li aggiungerai nei prossimi passi. Non perdi nulla: <kbd>Ctrl</kbd>+<kbd>Z</kbd> riporta indietro il telaio, che resta comunque anche in **☰ → Strutture recenti**.

### Controlla le unità {#_1-check-the-units}

L’indicatore in basso a destra nella vista elenca le unità usate da tutti i campi e da tutti i risultati. Questa pagina usa le unità SI, che l’indicatore mostra come `m m² kN kNm MPa`, e l’asse z rivolto verso il basso. Se l’indicatore mostra piedi e kip, fai clic su di esso e imposta **Sistema di unità** su **SI (metrico)**. Nello stesso punto, **Sistema di coordinate** deve essere **x a destra, z in basso**: con y verso l’alto un carico positivo punta verso l’alto e i segni di questa pagina non corrisponderebbero.

![I pulsanti di griglia (G) e snap (S), il mirino e l’indicatore delle unità](/screenshots/it/ui-grid-units.webp){.shot-sm}

### Aggiungi il materiale e la sezione {#_2-add-the-material-and-cross-section}

Ogni elemento ha bisogno di un materiale e di una sezione, quindi aggiungili per primi, prendendoli dalle librerie.

1. Apri la scheda **Materiali** nella barra inferiore e fai clic su **Libreria materiali**.
2. Premi **+** sulla riga **Acciaio (S235)** ($E = 210\,000$ MPa, $G = 81\,000$ MPa). La libreria resta aperta per aggiungerne altri: chiudila con **Annulla**.
3. Apri la scheda **Sezioni** e fai clic su **Libreria sezioni**.
4. Scorri fino alla riga **IPE 200 (appross.)**, premi **+** e chiudi la libreria con **Annulla**.

I due messaggi in rosso sono spariti e la scheda **Sezioni** elenca l’IPE 200:

![L’IPE 200 nella scheda Sezioni: area, Iy, altezza e coefficiente di taglio](/screenshots/it/a-qs-cross-sections.webp)

Se preferisci inserire valori tuoi, usa **Aggiungi materiale** e **Aggiungi sezione**. Il coefficiente di taglio, qui 0,3933, ricompare nella [verifica a mano](#_8-check-by-hand).

### Aggiungi i nodi {#_3-add-the-nodes}

1. Apri la scheda **Nodi**. Ci sono due pulsanti **Aggiungi nodo**: **+** apre una finestra di dialogo, quello con l’icona del cursore posiziona i nodi con il mouse. Fai clic su **+ Aggiungi nodo**.
2. Lascia **Coordinata X** e **Coordinata Z** a `0` e premi **Aggiungi nodo**. La finestra si chiude e compare il nodo `1`.
3. Fai di nuovo clic su **+ Aggiungi nodo**, inserisci `6` in **Coordinata X** e premi **Aggiungi nodo**. Questo è il nodo `2`.

![La finestra Aggiungi nuovo nodo, in cui puoi assegnare subito anche i vincoli](/screenshots/it/qs-node.webp){.shot-md}

### Collegali con un elemento {#_4-connect-them-with-an-element}

Apri la scheda **Elementi** e fai clic su **+ Aggiungi elemento**. La finestra propone già **Nodo iniziale** `1`, **Nodo finale** `2`, il tuo materiale e la tua sezione. Premi **Aggiungi elemento**.

![Aggiungi nuovo elemento: i due nodi di estremità, una cerniera facoltativa a ciascuna estremità, il materiale e la sezione](/screenshots/it/a-qs-element.webp){.shot-md}

Tra i nodi compare una trave. Premi <kbd>F</kbd> per adattarla allo schermo. L’indicatore blu **Servono vincoli**, in alto a sinistra nella vista, spiega perché non ci sono ancora risultati.

### Aggiungi i vincoli {#_5-add-the-supports}

Torna alla scheda **Nodi**: all’inizio della colonna **GdL vincolati**, ogni riga ha un selettore del vincolo.

- Nodo `1`: scegli **Cerniera**. Vengono spuntati `Dx` e `Dz`.
- Nodo `2`: scegli **Carrello**. Viene spuntato solo `Dz`.

![Il selettore del vincolo nella tabella Nodi](/screenshots/it/a-qs-support-picker.webp){.shot-lg}

L’indicatore **Servono vincoli** scompare. Puoi anche fare clic su un nodo nella vista e scegliere **Vincoli del nodo**. La pagina [Nodi e vincoli](/it/essentials/nodes-supports#supports) elenca tutti i tipi di vincolo.

### Aggiungi il carico {#_6-add-the-load}

1. Apri la scheda **Carichi** e fai clic su **Aggiungi carico su elemento**.
2. Lascia **Tipo di carico** su *Carico uniforme* ed **Elemento** su `1`.
3. Inserisci `12` in **fz**, lascia **fx** a `0` e premi **Aggiungi carico su elemento**.

![La finestra mostra un’anteprima del carico sull’elemento](/screenshots/it/a-qs-load.webp){.shot-md}

Un `fz` positivo punta nel verso +z, cioè **verso il basso**, quindi un valore positivo è un carico gravitazionale. La casella **LCS** spuntata indica che il carico segue gli assi propri dell’elemento, cioè il suo sistema di coordinate locale (LCS); per una trave orizzontale disegnata da sinistra a destra coincidono con gli assi globali. Vedi le [convenzioni dei segni](/it/elements/conventions#loads).

::

## Leggi i risultati {#_7-read-the-results}

EduBeam risolve la trave nel momento in cui inserisci il carico, e di nuovo dopo ogni modifica: non c’è un pulsante *Calcola*. Il pannello in alto a destra nella vista attiva e disattiva i disegni. **Deformata**, **M<sub>y</sub>(x)** e **Reazioni** sono attivi fin dall’inizio. Spunta **V<sub>z</sub>(x)** per aggiungere il taglio.

![Le opzioni di visualizzazione, con il taglio attivato](/screenshots/it/a-qs-display.webp){.shot-md}

Lo schermo dovrebbe ora corrispondere a questa figura. Passa dal momento flettente al taglio e viceversa:

::model-figure{caption="La trave finita: reazioni di 36 kN e 54 kNm in mezzeria"}
---
nodes: { 1: [0, 0], 2: [6, 0] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 12 }
results: [M, V]
show: [nodeLabels]
---
::

| Disegno | Cosa dovresti vedere |
| --- | --- |
| **Reazioni** | Due frecce verso l’alto da **36 kN**, una su ciascun appoggio. |
| **V<sub>z</sub>(x)** | Una retta da **+36 kN** nel nodo `1` a **−36 kN** nel nodo `2`, che si annulla in mezzeria. |
| **M<sub>y</sub>(x)** | Una parabola con il massimo di **54 kNm** in mezzeria, disegnata dal lato teso, sotto la trave. |
| **Deformata** | Un abbassamento simmetrico, disegnato amplificato. |

Per i valori numerici apri la scheda **Risultati**. **Risultati nodali** elenca gli spostamenti `Dx`, `Dz` e la rotazione `Ry` di ogni nodo; **Risultati degli elementi** elenca le forze di estremità di ogni elemento nei suoi assi locali. Il nodo `1` ruota di $R_y = -2{,}6469 \cdot 10^{-2}$ rad, il nodo `2` della stessa quantità in verso opposto. La pagina [Risultati e diagrammi](/it/essentials/results) spiega ogni tabella e ogni segno.

Se i diagrammi sembrano troppo grandi o troppo piccoli, cambia **Scala dei risultati** in **Impostazioni → Impostazioni della vista**.

## Verifica a mano {#_8-check-by-hand}

Con $q = 12$ kN/m e $L = 6$ m, le formule dei manuali danno:

| Grandezza | Formula | A mano | EduBeam |
| --- | --- | --- | --- |
| Reazioni | $qL/2$ | 36 kN | 36 kN |
| Taglio massimo | $qL/2$ | 36 kN | 36 kN |
| Momento massimo | $qL^2/8$ | 54 kNm | 54 kNm |
| Rotazione all’estremità | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Freccia in mezzeria | $w_b + w_s$ | 49,63 + 0,60 = 50,22 mm | 50,22 mm |

La freccia ha due contributi, e la maggior parte dei manuali riporta solo il primo:

- **Flessione:** $w_b = 5qL^4/(384EI) = 49{,}63$ mm, con $EI = 4080$ kNm² da $E = 210$ GPa e $I_y = 1943\ \text{cm}^4$.
- **Taglio:** $w_s = qL^2/(8kGA) = 0{,}60$ mm, con $kGA \approx 90\,700$ kN da $k = 0{,}3933$, $G = 81$ GPa e $A = 28{,}48\ \text{cm}^2$.

In mezzeria non c’è ancora un nodo, quindi aggiungine uno per leggere lì la freccia:

1. Nella scheda **Nodi**, fai clic sul secondo pulsante **Aggiungi nodo**, quello con l’icona del cursore.
2. Fai clic sulla trave in `x = 3`; con lo snap attivo il nodo cade sulla griglia. EduBeam chiede che cosa fare del nodo: premi **Collega alla struttura**. L’elemento viene diviso in `1a` e `1b`, insieme al suo carico, e il posizionamento dei nodi termina. Se nella scheda **Nodi** il nodo `3` non si trova in X = `3`, scrivi lì `3`.
3. In **Risultati → Risultati nodali** il nodo `3` mostra ora $D_z = 5{,}0224 \cdot 10^{-2}$ m, cioè 50,22 mm.

![Risultati nodali dopo la divisione: il nodo 3 si abbassa di 50,22 mm](/screenshots/it/a-qs-nodal-results.webp){.shot-lg}

Dividere la trave non cambia alcun risultato, perché per questi carichi l’elemento è esatto: non c’è una mesh da infittire.

::callout{type="details" title="Perché conta il coefficiente di taglio"}
EduBeam usa elementi trave di Timoshenko, che includono la deformazione a taglio. Il coefficiente di taglio $k$ definisce l’area resistente a taglio $kA$, quindi $kGA$ è la rigidezza a taglio ($k$ è l’inverso del fattore di taglio χ dei testi italiani). Per le sezioni a I della libreria $k$ è la quota dell’area che spetta all’anima, $h t_w / A$: per l’IPE 200, $0{,}2 \cdot 0{,}0056 / 0{,}002848 = 0{,}3933$. Il contributo del taglio alla freccia, $w_s = qL^2/(8kGA)$, è l’integrale di $V/(kGA)$ dall’appoggio alla mezzeria.

Per questa trave snella il contributo del taglio è 0,60 mm, circa l’1 % del totale. In una trave tozza, corta e alta, pesa molto di più. Imposta il coefficiente di taglio a un numero molto grande (ad esempio `1e10`) nella scheda **Sezioni**, ed EduBeam restituisce i 49,63 mm della sola flessione. La teoria è nella pagina [Elemento trave](/it/elements/beam).
::

Altri casi da verificare a mano (mensola, trave doppiamente incastrata, travatura reticolare, carico termico, cedimento) sono nella pagina [Verificare i risultati a mano](/it/guide/verification).

## Sperimenta {#_9-experiment}

Modifica il modello e osserva come cambiano i diagrammi. Prova una modifica alla volta e annullala con <kbd>Ctrl</kbd>+<kbd>Z</kbd> prima di passare alla successiva. Il nodo `3` è il nodo di mezzeria che hai appena aggiunto.

- **Trascina il nodo `2`** verso destra. Il momento cresce con $L^2$ e la freccia con $L^4$.
- **Spunta `Ry` nel nodo `1`** per incastrare quell’estremità. Sull’incastro compare un momento negativo: $qL^2/8 = 54$ kNm secondo la formula dei manuali, 53,8 kNm in EduBeam. In una trave iperstatica la rigidezza a taglio cambia anche le forze interne.
- **Spunta `Dz` nel nodo `3`** per aggiungere un appoggio intermedio e ottenere una trave continua a due campate. Il momento sull’appoggio intermedio diventa negativo: $q(L/2)^2/8 = 13{,}5$ kNm a mano, 13,3 kNm in EduBeam, per lo stesso motivo.
- **Spunta `Dz` nel nodo `3` e la seconda casella della colonna *Cerniere di estremità* dell’elemento `1a`** (la sua estremità nel nodo `3`) nella scheda **Elementi**. La trave diventa due campate semplicemente appoggiate di 3 m. Ora togli la spunta a `Dz` nel nodo `3`: la trave diventa un meccanismo, ed EduBeam mostra come può muoversi.

Per variare luce e carico senza costruire nulla, trascina i cursori qui sotto e passa da un risultato all’altro per vedere come ciascuno cresce con la luce.

::example-structure
::

## Salva o condividi {#_10-save-or-share}

- **Invialo a qualcuno.** Premi **Condividi modello** nella barra dell’app, poi **Copia**. Il link contiene l’intero modello, e chi lo apre ne riceve una propria copia da modificare.
- **Conservalo in un file.** **☰ → Salva progetto** (<kbd>Ctrl</kbd>+<kbd>S</kbd>) scarica un file `project.json`. Lo riapri con **☰ → Apri progetto** (<kbd>Ctrl</kbd>+<kbd>O</kbd>) o trascinandolo sull’app.
- **Metti il disegno in una relazione.** **☰ → Esporta immagine** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) lo salva in PNG o SVG.

Il modello resta salvato anche nel browser, quindi ricaricare la pagina non lo fa perdere. I dettagli sono nella pagina [File, link ed esportazione](/it/essentials/import-export).

## E ora? {#where-next}

::card-grid{cols="2"}
:::card{title="Tutorial" icon="lucide:graduation-cap" to="/it/tutorials/inclined-beam"}
Quattro modelli costruiti passo passo e verificati a mano, da una trave inclinata a una trave continua con il cedimento di un appoggio.
:::
:::card{title="Esempi" icon="lucide:library" to="/it/examples/"}
Travi, telai e travature reticolari già pronti che si aprono con un clic, con esercizi e soluzioni.
:::
:::card{title="Carichi" icon="lucide:arrow-down-to-line" to="/it/essentials/loads"}
Carichi trapezoidali, concentrati e termici, forze nodali e cedimenti vincolari.
:::
:::card{title="Tastiera, mouse e touch" icon="lucide:keyboard" to="/it/reference/shortcuts"}
Disegna nodi ed elementi direttamente nell’area di disegno e modifica il modello più in fretta.
:::
::
