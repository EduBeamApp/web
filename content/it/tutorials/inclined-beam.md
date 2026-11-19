---
description: "Tutorial: trave inclinata (trave di falda, rampa di scale) in EduBeam: carico per metro in pianta, N e V lungo la falda e direzione del carrello. 15 minuti."
source: site
---

# Tutorial: trave inclinata

Modella una trave di falda caricata dalla neve, leggi lo sforzo normale e il taglio lungo la falda e verificali a mano.

- **Tempo:** circa 15 minuti. È il primo e il più breve dei quattro tutorial.
- **Ti serve:** EduBeam aperto in un’altra scheda del browser, su un computer con mouse e tastiera. Se non hai mai usato EduBeam, fai prima l’[Avvio rapido](/it/guide/quick-start): mostra le schede e le finestre che usa questo tutorial.
- **Prerequisiti:** l’equilibrio di una trave semplicemente appoggiata e la scomposizione di una forza in due componenti.
- **Unità:** SI. L’indicatore delle unità in basso a destra nella vista deve mostrare `m m² kN kNm MPa`. Se mostra piedi e kip, fai clic sull’indicatore e imposta **Sistema di unità** su **SI (metrico)**.

**Imparerai a**

- trasformare un carico dato per metro in pianta nel carico per metro di lunghezza dell’asta, quello che EduBeam richiede,
- orientare un carico distribuito in verticale o perpendicolarmente all’asta con la casella **LCS**,
- ruotare un carrello e vedere che cambia lo sforzo normale ma non il momento flettente.

::div{.actions}
[Apri EduBeam ↗](https://run.edubeam.app/?lang=it){target="_blank"} [Vai alla verifica a mano](#check-by-hand)
::

::model-figure{caption="La trave di falda completata: 3 kN/m di neve per metro in pianta, inseriti come 2,4 kN/m lungo l’asta, con una cerniera in gronda (nodo 1) e un carrello al colmo (nodo 2)"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## Il problema {#the-problem}

- Una trave di falda rettilinea che sale dal nodo 1 in (0, 0) al nodo 2 in (4, −3): 4 m in pianta e 3 m di altezza, quindi lunga $L = 5$ m, con $\cos\alpha = 4/5$ e $\sin\alpha = 3/5$.
- Una cerniera nel nodo 1, in gronda. Nel nodo 2, al colmo, un carrello che scorre in orizzontale, quindi con reazione verticale.
- La neve $s = 3$ kN/m, data come la danno le norme, **per metro in pianta** (cioè di proiezione orizzontale).
- Acciaio, $E = 210$ GPa, e $I_y = 8{,}356 \times 10^{-5}$ m⁴, quello di un IPE 300.

**È isostatica?** Tre reazioni e tre equazioni di equilibrio: sì. Le sue forze si ricavano dal solo equilibrio; $E$ e $I_y$ contano solo per la freccia.

## Costruisci il modello {#model-it}

::div{.steps}

### Materiale e sezione {#material-and-section}

1. Nella barra dell’app fai clic su **Cancella struttura**, spunta **Elimina materiali** ed **Elimina sezioni** e fai clic su **Conferma**. Nodi ed elementi ripartono dal numero 1.
2. Scheda **Materiali** → **Libreria materiali** → **+** nella riga **Acciaio (S235)**, poi **Annulla** per chiudere la libreria.
3. Scheda **Sezioni** → **Aggiungi sezione**. Inserisci `8,356e-5` in **Iy**, lascia **Area**, **Altezza** e **Coefficiente di taglio** a `1` e fai clic su **Aggiungi sezione**.

Con un’area di 1 m² l’asta non si accorcia e non si deforma a taglio in modo apprezzabile, come presuppone il calcolo a mano.

### Disegna l’asta {#draw-the-member}

1. Scheda **Elementi** → il secondo pulsante **Aggiungi elemento**, quello con l’icona del cursore.
2. Fai clic in (0, 0), poi in (4, −3). I righelli e il mirino mostrano dove ti trovi, e i clic si agganciano alla griglia.
3. Premi <kbd>Esc</kbd> per smettere di disegnare, poi <kbd>F</kbd> per adattare la vista.

L’asse z punta verso il basso, quindi il nodo 2, 3 m **più in alto** del nodo 1, è a $z = -3$. Controlla entrambi i nodi nella tabella **Nodi** e correggi direttamente nella tabella ogni coordinata sbagliata.

### Vincoli {#supports}

Fai clic sul nodo 1 → **Vincoli del nodo** → il simbolo **Cerniera**. Allo stesso modo assegna al nodo 2 il **Carrello**.

### Carico {#load}

In tutto la neve sulla trave di falda vale $3 \cdot 4 = 12$ kN. EduBeam distribuisce un carico uniforme lungo la **lunghezza** dell’asta, quindi gli stessi 12 kN su 5 m danno

$$
f_z = s \cdot \frac{4}{5} = s\cos\alpha = 3 \cdot 0{,}8 = 2{,}4\ \text{kN/m}
$$

1. Scheda **Carichi** → **Aggiungi carico su elemento**.
2. **Tipo di carico** *Carico uniforme*, **Elemento** `1`, `fz = 2,4`.
3. **Togli la spunta a LCS**, così che `fz` agisca in verticale, e fai clic su **Aggiungi carico su elemento**.

::callout{type="warning" title="LCS è spuntato per impostazione predefinita"}
Con **LCS** spuntato, `fz` agisce lungo l’asse z locale dell’elemento, perpendicolare alla falda: come il vento su un tetto, non come la neve. Su una trave orizzontale le due direzioni coincidono, ed è per questo che è facile non accorgersene. Le frecce del carico mostrano in che direzione agisce; i dettagli sono nella pagina [Carichi](/it/essentials/loads#uniformly-distributed-load).
::

::

## Risultati {#results}

EduBeam risolve la trave appena inserisci il carico. Nelle opzioni di visualizzazione in alto a destra nella vista (l’icona dell’ingranaggio le mostra e le nasconde), **Deformata**, **M<sub>y</sub> (x)** e **Reazioni** sono attivi fin dall’inizio; spunta anche **N (x)** e **V<sub>z</sub> (x)**. Il selettore sotto la figura in alto mostra gli stessi diagrammi.

EduBeam etichetta diagrammi e reazioni in kN e kNm con due decimali, quindi dovresti leggere:

- `6,00` in ciascun vincolo, verso l’alto. La reazione orizzontale della cerniera mostra `0,00`: non agisce alcuna forza orizzontale.
- `6,00` kNm, il picco del momento flettente, in mezzeria.
- `4,80` kN di taglio nel nodo 1 e `-4,80` nel nodo 2.
- `-3,60` kN di sforzo normale nel nodo 1 (compressione) e `3,60` nel nodo 2 (trazione), con lo zero in mezzeria.

## Verifica a mano {#check-by-hand}

**Reazioni.** La risultante di 12 kN agisce a 2 m in pianta dal nodo 1, quindi l’equilibrio alla rotazione attorno a ciascuna estremità dà $V_1 = V_2 = 6$ kN. Non agisce alcuna forza orizzontale, quindi $H_1 = 0$.

**Momento flettente.** Per forze verticali contano solo i bracci orizzontali. A una distanza $x$ in pianta dal nodo 1,

$$
M(x) = V_1\,x - \frac{s\,x^2}{2}, \qquad M_{\max} = \frac{s\,a^2}{8} = \frac{3 \cdot 4^2}{8} = 6\ \text{kNm}
$$

esattamente come per una trave orizzontale di luce $a = 4$ m con lo stesso carico per metro in pianta.

**Taglio e sforzo normale.** Le forze a sinistra di una sezione in $x$ si sommano in una forza verticale $T(x) = V_1 - s\,x$. Scomponila in una componente perpendicolare all’asta e in una lungo l’asta:

$$
V = T\cos\alpha, \qquad N = -T\sin\alpha
$$

| | Nodo 1, $T = +6$ kN | Mezzeria, $T = 0$ | Nodo 2, $T = -6$ kN |
| --- | --- | --- | --- |
| $V$ | $6 \cdot 0{,}8 = 4{,}8$ kN | 0 | −4,8 kN |
| $N$ | $-6 \cdot 0{,}6 = -3{,}6$ kN | 0 | +3,6 kN |
| $M$ | 0 | 6 kNm | 0 |

Tutto come in EduBeam. La reazione verso l’alto nel nodo 1 spinge l’estremità inferiore in su lungo la falda, cioè contro l’asta: compressione. La reazione verso l’alto nel nodo 2 tira l’estremità superiore ancora più in su lungo la falda, cioè via dall’asta: trazione. I segni seguono il verso dell’elemento, dal nodo 1 al nodo 2, come spiegano le [convenzioni dei segni](/it/elements/conventions#internal-forces).

## Sperimenta {#experiment}

Cambia una cosa alla volta, prevedi il risultato e solo dopo guarda. <kbd>Ctrl</kbd>+<kbd>Z</kbd> annulla ogni modifica.

**Dimentica il coseno.** Inserisci `fz = 3` invece di 2,4. Sono 3 kN per metro di falda, 15 kN in tutto, e tutti i risultati escono più grandi del 25 %: reazioni di 7,5 kN e un momento di 7,5 kNm. Su un tetto inclinato di 30° l’errore sarebbe del 15 %, a 45° del 41 %.

**Lascia LCS spuntato.** Spunta **LCS** sul carico da 2,4 kN/m. Ora il carico spinge perpendicolarmente alla falda, come farebbe il vento, con una componente orizzontale di 7,2 kN che solo la cerniera può assorbire. Il momento sale a $2{,}4 \cdot 5^2/8 = 7{,}5$ kNm, e lo sforzo normale diventa una trazione costante di 4,5 kN.

::model-figure{caption="Gli stessi 2,4 kN/m con LCS spuntato: perpendicolari alla falda, quindi la cerniera prende 7,2 kN in orizzontale"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4, local: true }
results: [M, N]
show: [nodeLabels]
---
::

**Ruota il carrello.** Togli di nuovo la spunta a **LCS** e cambia solo la direzione in cui scorre il carrello nel nodo 2. Fai clic sul nodo 2 → **Vincoli del nodo**, inserisci `-36,87` in **Angolo LCS nodale** e premi <kbd>Invio</kbd> (oppure inserisci il valore nel campo **α** della sua riga nella tabella **Nodi**).

![Il menu Vincoli del nodo per il nodo 2: i simboli dei vincoli, le direzioni bloccate e l’Angolo LCS nodale](/screenshots/it/p2t-node-supports-angle.webp){.shot-md}

L’angolo ruota gli assi propri del nodo. Con gli assi predefiniti, x a destra e z in basso, un angolo negativo li ruota in senso antiorario sullo schermo. Altri dettagli in [Vincoli inclinati](/it/essentials/nodes-supports#inclined-skewed-supports).

Ora il carrello scorre lungo la falda, quindi la sua reazione è perpendicolare all’asta: $12 \cdot 2 / 5 = 4{,}8$ kN, dall’equilibrio alla rotazione attorno al nodo 1. La cerniera prende il resto, e con esso tutto lo sforzo normale: −7,2 kN nel nodo 1, zero nel nodo 2.

::model-figure{caption="Il carrello nel nodo 2 ruotato di −36,87° per scorrere lungo la falda: lo sforzo normale va da −7,2 kN a zero"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
angles: { 2: -36.87 }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

**Usa un carrello verticale.** Riporta l’angolo a 0 e scegli il **Carrello verticale** per il nodo 2. Scorre in verticale, quindi può solo spingere di lato: l’equilibrio alla rotazione attorno al nodo 1, $H_2 \cdot 3 = 12 \cdot 2$, dà 8 kN, e la cerniera trattiene la trave di falda contro questa spinta. Tutta l’asta è compressa.

::model-figure{caption="Un carrello verticale nel nodo 2: una spinta orizzontale di 8 kN e tutta la trave di falda compressa"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: verticalRoller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

I tre carrelli a confronto:

| Carrello nel nodo 2 | Reazione nel nodo 2 | Reazione nel nodo 1 | $N$ dal nodo 1 al nodo 2 |
| --- | --- | --- | --- |
| Orizzontale | 6 kN ↑ | 6 kN ↑ | da −3,6 a +3,6 kN |
| Lungo la falda | 4,8 kN ⊥ asta | 2,88 kN →; 8,16 kN ↑ | da −7,2 a 0 kN |
| Verticale | 8 kN ← | 8 kN →; 12 kN ↑ | da −13,6 a −6,4 kN |

**Il momento flettente non cambia mai**, e nemmeno il taglio: 6 kNm e ±4,8 kN in tutti e tre i casi. Il nodo 1, il nodo 2 e ogni sezione stanno su un’unica retta, l’asse dell’asta. La componente della reazione nel nodo 2 che agisce lungo questa retta non ha momento rispetto a nessuno di questi punti, quindi aggiunge solo sforzo normale. La componente perpendicolare all’asta è fissata a 4,8 kN dall’equilibrio alla rotazione attorno al nodo 1, comunque sia orientato il carrello. La direzione del carrello decide solo dove va la spinta, e questo conta per il muro o il pianerottolo che deve assorbirla.

## Prossimi passi {#next-steps}

::card-grid{cols="2"}
:::card{title="Esercizi: travi appoggiate con sbalzo" icon="lucide:dices" to="/it/practice?p=O2048"}
Le reazioni e il momento massimo di una trave con carico distribuito, con le tue risposte verificate subito. Inizia con O2048; per altri esercizi, lascia selezionata solo **Trave appoggiata con sbalzo** e premi **Nuovo esercizio**.
:::
:::card{title="Prossimo: telaio a tre cerniere" icon="lucide:triangle" to="/it/tutorials/three-hinged-frame"}
Quattro aste, una cerniera interna e una spinta orizzontale: un telaio che si risolve ancora con il solo equilibrio.
:::
::
