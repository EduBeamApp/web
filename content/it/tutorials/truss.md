---
description: "Tutorial: una travatura reticolare piana in EduBeam, sforzi con il metodo dei nodi e delle sezioni, un’asta scarica e la freccia con il PLV. Circa 20 minuti."
source: site
---

# Tutorial: travatura reticolare piana

Costruisci una piccola travatura reticolare isostatica con aste incernierate, verifica gli sforzi nelle aste con il metodo dei nodi e con il metodo delle sezioni e controlla una freccia con il principio dei lavori virtuali.

- **Tempo:** circa 20 minuti.
- **Ti serve:** EduBeam aperto in un’altra scheda del browser, su un computer con mouse e tastiera. Se non hai mai usato EduBeam, fai prima l’[Avvio rapido](/it/guide/quick-start) o uno dei tutorial precedenti.
- **Prerequisiti:** il metodo dei nodi e il metodo delle sezioni. La verifica facoltativa della freccia usa il metodo del carico unitario (principio dei lavori virtuali).
- **Unità:** SI. L’indicatore delle unità in basso a destra nella vista deve mostrare `m m² kN kNm MPa`. Se mostra piedi e kip, fai clic sull’indicatore e imposta **Sistema di unità** su **SI (metrico)**.

**Imparerai a**

- modellare le aste di una travatura come elementi trave con entrambe le cerniere di estremità, disegnandole con il mouse,
- verificare gli sforzi nelle aste con il metodo dei nodi e con il metodo delle sezioni,
- riconoscere un’asta scarica e capire perché per una travatura funziona un modello a nodi incernierati.

::div{.actions}
[Apri EduBeam ↗](https://run.edubeam.app/?lang=it){target="_blank"} [Vai alla verifica a mano](#_5-check-by-hand)
::

::model-figure{caption="La travatura completata: 30 kN nei nodi 2 e 3, sforzi nelle aste con la trazione positiva"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: roller }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 30 }
  - { node: 3, fz: 30 }
results: [N, w]
show: [nodeLabels, dimensions]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

## Il problema {#the-problem}

- Una luce di 12 m divisa in tre campi da 4 m, altezza 3 m: nodi del corrente inferiore da 1 a 4, nodi del corrente superiore 5 e 6.
- Una cerniera nel nodo 1 e un carrello nel nodo 4.
- Due carichi da 30 kN nei nodi 2 e 3 del corrente inferiore.
- Aste in acciaio, $E = 210$ GPa, $A = 20$ cm².

| Elementi | Aste, indicate dai loro nodi | |
| --- | --- | --- |
| 1, 2, 3 | 1–2, 2–3, 3–4 | corrente inferiore |
| 4, 5, 6 | 1–5, 5–6, 6–4 | diagonale d’estremità, corrente superiore, diagonale d’estremità |
| 7, 8, 9 | 2–5, 5–3, 3–6 | montante, diagonale centrale, montante |

**È isostatica?** Con $m = 9$ aste, $r = 3$ reazioni e $j = 6$ nodi si ha $m + r = 12 = 2j$. Ogni nodo fornisce due equazioni di equilibrio, quindi gli sforzi nelle aste si ricavano dal solo equilibrio.

## Costruisci il modello {#model-it}

::div{.steps}

### Materiale e sezione {#_1-material-and-section}

1. Nella barra dell’app fai clic su **Cancella struttura**, spunta **Elimina materiali** ed **Elimina sezioni** e fai clic su **Conferma**. Nodi ed elementi ripartono dal numero 1.
2. Scheda **Materiali** → **Libreria materiali** → **+** nella riga **Acciaio (S235)**, poi **Annulla** per chiudere la libreria.
3. Scheda **Sezioni** → **Aggiungi sezione**. Inserisci `0,002` in **Area** e `1e-6` in **Iy**, lascia **Altezza** e **Coefficiente di taglio** a `1` e fai clic su **Aggiungi sezione**.

Con aste incernierate conta solo l’area; $I_y$ deve soltanto essere positivo.

### Disegna le aste con le cerniere {#_2-draw-the-bars-with-hinges}

In EduBeam un’asta reticolare è un elemento trave con **entrambe le cerniere di estremità** spuntate. Lo strumento di disegno può spuntarle per te, e l’ordine in cui disegni le aste determina la numerazione della tabella qui sopra.

1. Scheda **Elementi** → il secondo pulsante **Aggiungi elemento**, quello con l’icona del cursore.
2. Nella fascia in alto nella vista, spunta **Cerniera iniziale** e **Cerniera finale**. Ogni asta che disegni da ora in poi le avrà entrambe.
3. Corrente inferiore: fai clic in (0, 0), (4, 0), (8, 0) e (12, 0), poi premi <kbd>Esc</kbd>.
4. Parte superiore: fai di nuovo clic sul pulsante **Aggiungi elemento**, poi sul nodo 1 in (0, 0), in (4, −3), in (8, −3) e sul nodo 4 in (12, 0). Facendo clic su un nodo esistente colleghi l’asta a quel nodo invece di aggiungerne uno nuovo. Premi <kbd>Esc</kbd>.
5. Aste di parete: ancora una volta **Aggiungi elemento**, poi fai clic sul nodo 2 in (4, 0), sul nodo 5 in (4, −3), sul nodo 3 in (8, 0) e sul nodo 6 in (8, −3). Premi <kbd>Esc</kbd>, poi <kbd>F</kbd> per adattare la vista.

Ora la tabella **Elementi** deve elencare i nove elementi della tabella qui sopra, ciascuno con entrambe le **Cerniere di estremità** spuntate. <kbd>Esc</kbd> chiude la modalità di disegno, ma le caselle delle cerniere nella fascia restano spuntate per la volta successiva.

### Vincoli e carichi {#_3-supports-and-loads}

1. Fai clic sul nodo 1 → **Vincoli del nodo** → il simbolo **Cerniera**. Al nodo 4 assegna il **Carrello**.
2. Fai clic sul nodo 2 → **Aggiungi carico** → `Fz = 30` → **Aggiungi carico nodale**. Fai lo stesso nel nodo 3.

Un `Fz` positivo punta verso il basso. In ogni nodo tutte le aste sono incernierate, quindi nulla impedisce al nodo di ruotare; EduBeam lo accetta e per un nodo così riporta una rotazione pari a 0.

::

## Risultati {#_4-results}

Nelle opzioni di visualizzazione in alto a destra nella vista (l’icona dell’ingranaggio le mostra e le nasconde), togli la spunta a **Deformata** e a **M<sub>y</sub> (x)**, perché in una travatura non c’è flessione, e spunta **N (x)**. La trazione è positiva, ed EduBeam indica le forze in kN con due decimali.

- Entrambi i vincoli mostrano `30,00` verso l’alto; la reazione orizzontale della cerniera mostra `0,00`, perché non agisce alcun carico orizzontale.
- Il corrente inferiore mostra `40,00` in tutte e tre le aste, cioè trazione; il corrente superiore `-40,00`, cioè compressione.
- La diagonale centrale, 5–3, è scarica, quindi non ha etichetta, come nella figura in alto.
- Scheda **Risultati** → **Risultati nodali**: il nodo 2 si abbassa di $D_z$ = `2,2937 · 10⁻³ m`, cioè 2,294 mm.

## Verifica a mano {#_5-check-by-hand}

**Reazioni.** I carichi sono simmetrici, quindi $R_1 = R_4 = 30$ kN verso l’alto, e senza carichi orizzontali la reazione orizzontale della cerniera è nulla.

**Nodo 1** (metodo dei nodi). La diagonale d’estremità 1–5 è lunga 5 m, quindi $\sin\alpha = 3/5$ e $\cos\alpha = 4/5$:

$$
\textstyle\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \ \Rightarrow\ N_{15} = -50\ \text{kN}
$$

$$
\textstyle\sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}
$$

**Nodo 2.** Il montante 2–5 è l’unica asta che può riportare verso l’alto il carico di 30 kN: $N_{25} = +30$ kN, e $N_{23} = N_{12} = 40$ kN.

**Sezione nel campo centrale** (metodo delle sezioni). Taglia le aste 5–6, 5–3 e 2–3 e considera la parte sinistra:

- Momenti rispetto al nodo 3: $R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN.
- Forze verticali: il taglio nel campo è $R_1 - 30 = 0$, quindi la diagonale centrale **5–3 è scarica**: $N_{53} = 0$.

| Aste | A mano | EduBeam |
| --- | --- | --- |
| Corrente inferiore 1–2, 2–3, 3–4 | +40 kN, trazione | 40,00 |
| Corrente superiore 5–6 | −40 kN, compressione | −40,00 |
| Diagonali d’estremità 1–5, 6–4 | −50 kN | −50,00 |
| Montanti 2–5, 3–6 | +30 kN | 30,00 |
| Diagonale centrale 5–3 | 0 | nessuna etichetta |

Un’asta scarica non è un’asta inutile: sotto *questo* carico non porta nulla, ma se la togli la travatura crolla, come mostrano gli esperimenti più avanti.

::callout{type="details" title="La freccia del nodo 2 con il principio dei lavori virtuali"}
Applica un carico unitario verso il basso nel nodo 2 e risolvi di nuovo a mano la travatura: $R_1 = 2/3$, $R_4 = 1/3$ e gli sforzi $n$ riportati qui sotto. La freccia è $\delta = \sum N\,n\,L / (EA)$:

| Asta | $N$ (kN) | $n$ | $L$ (m) | $N\,n\,L$ |
| --- | --- | --- | --- | --- |
| 1–2 | 40 | 8/9 | 4 | 142,2 |
| 2–3 | 40 | 8/9 | 4 | 142,2 |
| 3–4 | 40 | 4/9 | 4 | 71,1 |
| 1–5 | −50 | −10/9 | 5 | 277,8 |
| 5–6 | −40 | −4/9 | 4 | 71,1 |
| 6–4 | −50 | −5/9 | 5 | 138,9 |
| 2–5 | 30 | 1 | 3 | 90,0 |
| 5–3 | 0 | −5/9 | 5 | 0 |
| 3–6 | 30 | 1/3 | 3 | 30,0 |
| | | | somma | 963,3 |

$$
\delta_2 = \frac{963{,}3}{EA} = \frac{963{,}3}{210 \times 10^6 \cdot 0{,}002} = 0{,}002294\ \text{m}
$$

Sono 2,294 mm, lo stesso valore di $D_z$ del nodo 2 in EduBeam, `2,2937 · 10⁻³` m.
::

## Sperimenta {#_6-experiment}

Cambia una cosa alla volta, prevedi il risultato e solo dopo guarda. <kbd>Ctrl</kbd>+<kbd>Z</kbd> annulla ogni modifica.

**Sposta un carico.** Metti entrambi i carichi nel nodo 2: elimina il carico nel nodo 3 e cambia l’altro in `Fz = 60`. Ora $R_1 = 40$ kN, il taglio nel campo centrale è $40 - 60 = -20$ kN e la diagonale centrale deve portarlo: $N_{53} = -20 \cdot 5/3 = -33{,}33$ kN, di compressione.

::model-figure{caption="60 kN nel nodo 2: ora la diagonale centrale 5–3 porta il taglio del campo"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: roller }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 60 }
results: [N]
show: [nodeLabels]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

**Togli la diagonale centrale.** Elimina l’elemento 8. Il campo centrale diventa un quadrilatero articolato, libero di deformarsi in un parallelogramma. EduBeam non mostra risultati, segnala *Le cerniere in 2, 3, 5, 6 permettono alla struttura di muoversi.* (i quattro vertici di quel campo) e anima il movimento.

**Togli la spunta a tutte le cerniere** nella tabella **Elementi**. La travatura diventa un telaio a nodi rigidi. Spunta **M<sub>y</sub> (x)**: i momenti flettenti restano sotto 0,1 kNm e gli sforzi normali cambiano di meno dello 0,1 %. Ecco perché per una travatura triangolata funziona l’idealizzazione a nodi incernierati.

**Vincola entrambi gli appoggi con una cerniera.** Una quarta reazione rende la travatura una volta iperstatica, e il risultato può sorprenderti: ora il corrente inferiore è **scarico**, e al suo posto ciascun vincolo spinge verso l’interno con 40 kN. I nodi 1 e 4 non possono allontanarsi, quindi le tre aste allineate del corrente compreso tra loro devono avere un allungamento totale nullo. Portano tutte lo stesso sforzo, quindi quello sforzo è nullo, e i suoi 40 kN passano ai vincoli. Questo vale qualunque siano le aree delle aste.

::model-figure{caption="Entrambi i vincoli a cerniera: i vincoli prendono il posto del corrente inferiore"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: pin }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 30 }
  - { node: 3, fz: 30 }
results: [N]
show: [nodeLabels]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

## Prossimi passi {#next-steps}

La teoria dell’asta reticolare è nella pagina [Elemento reticolare](/it/elements/truss).

::card-grid{cols="2"}
:::card{title="Esercizi: travature Warren" icon="lucide:dices" to="/it/practice?p=T2048"}
Le reazioni e lo sforzo in un’asta di una travatura più grande, con le tue risposte verificate subito. Inizia con T2048; per altri esercizi, lascia selezionata solo **Travatura Warren** e premi **Nuovo esercizio**.
:::
:::card{title="Prossimo: trave continua e cedimento vincolare" icon="lucide:spline" to="/it/tutorials/continuous-beam"}
Una trave iperstatica: che cosa si guadagna con la continuità, che cosa le fa un appoggio che cede e come verificare entrambe le cose con il metodo delle forze.
:::
::
