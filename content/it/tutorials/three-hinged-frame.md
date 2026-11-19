---
description: "Tutorial: telaio a tre cerniere con carico uniforme in EduBeam, con reazioni, spinta, forze interne e abbassamento della cerniera verificati a mano."
source: site
---

# Tutorial: telaio a tre cerniere

Modella un telaio a portale con una cerniera in mezzeria, leggi le reazioni e i diagrammi e verifica a mano ogni numero, fino all’abbassamento della cerniera.

- **Tempo:** circa 15 minuti.
- **Ti serve:** EduBeam aperto in un’altra scheda del browser, su un computer con mouse e tastiera. Se non hai mai usato EduBeam, fai prima l’[Avvio rapido](/it/guide/quick-start) o il tutorial sulla [trave inclinata](/it/tutorials/inclined-beam).
- **Prerequisiti:** l’equilibrio di un telaio e gli schemi di corpo libero. La verifica facoltativa dell’abbassamento usa il metodo del carico unitario (principio dei lavori virtuali).
- **Unità:** SI. L’indicatore delle unità in basso a destra nella vista deve mostrare `m m² kN kNm MPa`. Se mostra piedi e kip, fai clic sull’indicatore e imposta **Sistema di unità** su **SI (metrico)**.

**Imparerai a**

- disegnare un telaio con il mouse come un’unica polilinea,
- inserire una cerniera all’interno di un’asta con le caselle **Cerniere di estremità**,
- ricavare la spinta orizzontale dalla condizione $M = 0$ nella cerniera e leggere il segno di $V$ in aste disegnate in versi diversi.

::div{.actions}
[Apri EduBeam ↗](https://run.edubeam.app/?lang=it){target="_blank"} [Vai alla verifica a mano](#_6-check-by-hand)
::

::model-figure{caption="Il telaio completato: 10 kN/m sulla trave, cerniere nei nodi 1 e 5, una cerniera interna nel nodo 3"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], { nodes: [2, 3], hinges: [false, true] }, [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## Il problema {#the-problem}

- Due colonne di 4 m, incernierate alla base nei nodi 1 e 5, a 8 m di distanza.
- In sommità una trave orizzontale dal nodo 2 al nodo 4, con una cerniera in mezzeria, nel nodo 3.
- Un carico uniforme $q = 10$ kN/m su tutta la trave.
- Acciaio, $E = 210$ GPa, e $I_y = 8{,}356 \times 10^{-5}$ m⁴ (un IPE 300) per tutte le aste.

| Nodo | x (m) | z (m) | |
| --- | --- | --- | --- |
| 1 | 0 | 0 | cerniera |
| 2 | 0 | −4 | nodo d’angolo |
| 3 | 4 | −4 | cerniera nella trave |
| 4 | 8 | −4 | nodo d’angolo |
| 5 | 8 | 0 | cerniera |

L’asse z punta **verso il basso**, quindi la sommità delle colonne è a $z = -4$.

**È isostatico?** Due cerniere danno quattro reazioni. Le tre equazioni di equilibrio più $M_3 = 0$ nella cerniera fanno quattro equazioni: sì.

## Costruisci il modello {#model-it}

::div{.steps}

### Materiale e sezione {#_1-material-and-section}

1. Nella barra dell’app fai clic su **Cancella struttura**, spunta **Elimina materiali** ed **Elimina sezioni** e fai clic su **Conferma**. Nodi ed elementi ripartono dal numero 1.
2. Scheda **Materiali** → **Libreria materiali** → **+** nella riga **Acciaio (S235)**, poi **Annulla** per chiudere la libreria.
3. Scheda **Sezioni** → **Aggiungi sezione**. Inserisci `8,356e-5` in **Iy**, lascia **Area**, **Altezza** e **Coefficiente di taglio** a `1` e fai clic su **Aggiungi sezione**.

Con un’area di 1 m² le aste non si accorciano e non si deformano a taglio in modo apprezzabile, come presuppone il calcolo a mano dell’abbassamento. Le forze interne di un telaio isostatico non dipendono affatto da $E$, $A$ o $I_y$.

### Disegna il telaio {#_2-draw-the-frame}

1. Scheda **Elementi** → il secondo pulsante **Aggiungi elemento**, quello con l’icona del cursore.
2. Fai clic in (0, 0), (0, −4), (4, −4), (8, −4) e (8, 0). Ogni clic aggiunge il nodo successivo e lo collega al precedente; i clic si agganciano alla griglia.
3. Premi <kbd>Esc</kbd> per smettere di disegnare, poi <kbd>F</kbd> per adattare la vista.

Ora hai i nodi da 1 a 5 e gli elementi da 1 a 4, numerati nell’ordine in cui li hai disegnati, come nelle figure di questa pagina. Confronta la tabella **Nodi** con la tabella qui sopra e correggi direttamente nella tabella ogni coordinata sbagliata.

### Vincoli e cerniera {#_3-supports-and-the-hinge}

1. Fai clic sul nodo 1 → **Vincoli del nodo** → il simbolo **Cerniera**. Fai lo stesso per il nodo 5.
2. Nella tabella **Elementi** trova l’elemento 2, dal nodo 2 al nodo 3, e spunta la seconda delle sue caselle **Cerniere di estremità**: la cerniera all’estremità finale, nel nodo 3.

![La tabella Elementi: l’elemento 2 ha la cerniera finale spuntata, nel nodo 3](/screenshots/it/p2t-frame-elements-table.webp)

Basta una cerniera. L’elemento 3 resta l’unica asta collegata rigidamente al nodo 3, quindi lì non può ricevere alcun momento. Spuntare anche l’inizio dell’elemento 3 non cambia nulla.

### Carico {#_4-load}

1. Scheda **Carichi** → **Aggiungi carico su elemento**.
2. **Tipo di carico** *Carico uniforme*, **Elemento** `2`, `fz = 10`. Fai clic su **Aggiungi carico su elemento**.
3. Ripeti per l’elemento 3.

`fz` è positivo verso il basso. La trave è orizzontale, quindi qui la casella **LCS** non fa differenza.

::

## Risultati {#_5-results}

Nelle opzioni di visualizzazione in alto a destra nella vista (l’icona dell’ingranaggio le mostra e le nasconde), **Deformata**, **M<sub>y</sub> (x)** e **Reazioni** sono attivi fin dall’inizio. Spunta **N (x)** e **V<sub>z</sub> (x)** per il resto, oppure togli qualche spunta per vedere un diagramma alla volta. EduBeam li etichetta in kN e kNm con due decimali.

- Ogni base mostra `40,00` verso l’alto e `20,00` verso l’interno.
- Il momento flettente mostra `-80,00` in entrambi i nodi d’angolo; nella cerniera è nullo e non ha etichetta. EduBeam lo disegna dal lato teso, qui all’esterno del telaio.
- Lo sforzo normale è negativo ovunque: `-40,00` nelle colonne, `-20,00` nella trave. Tutte e quattro le aste sono compresse.
- Scheda **Risultati** → **Risultati nodali**: la cerniera, nodo 3, si abbassa di $D_z$ = `4,2554 · 10⁻² m`, cioè 42,55 mm, lo stesso valore che la vista $w(x)$ della figura in alto indica nella cerniera.

## Verifica a mano {#_6-check-by-hand}

**Reazioni verticali.** Per simmetria ogni base porta metà degli 80 kN:

$$
V_1 = V_5 = \frac{q \cdot 8}{2} = 40\ \text{kN}
$$

**Reazioni orizzontali.** Taglia il telaio nella cerniera e scrivi l’equilibrio alla rotazione della metà sinistra attorno al nodo 3, dove il momento è nullo:

$$
V_1 \cdot 4 - H_1 \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_1 = \frac{160 - 80}{4} = 20\ \text{kN}
$$

Entrambe le basi spingono verso l’interno con 20 kN. Senza questa spinta, data da cerniere che non possono allontanarsi, il telaio non starebbe in piedi: le colonne si aprirebbero e la cerniera scenderebbe.

| Grandezza | Formula | A mano | EduBeam |
| --- | --- | --- | --- |
| Reazioni verticali | $q \cdot 8/2$ | 40 kN | 40,00 |
| Reazioni orizzontali | da $M_3 = 0$ | 20 kN | 20,00 |
| Momenti nei nodi d’angolo 2 e 4 | $H_1 \cdot 4$ | 80 kNm, fibre esterne tese | −80,00 |
| Momento nella cerniera, nodo 3 | | 0 | nessuna etichetta |
| $N$ nelle colonne | $-V_1$ | −40 kN | −40,00 |
| $N$ nella trave | $-H_1$ | −20 kN | −20,00 |
| $V$ nelle colonne | $\pm H_1$ | ±20 kN | −20,00; 20,00 |
| $V$ nella trave nei nodi 2, 3, 4 | $V_1 - q\,x$ | 40; 0; −40 kN | 40,00; nessuna etichetta; −40,00 |

Le due colonne portano lo stesso taglio con segni opposti, −20 kN nell’elemento 1 e +20 kN nell’elemento 4, perché gli assi locali di ogni elemento seguono il verso in cui è stato disegnato: l’elemento 1 verso l’alto, l’elemento 4 verso il basso. Scambia i nodi di una colonna e il suo segno si inverte. Il perché è spiegato nelle [convenzioni dei segni](/it/elements/conventions#internal-forces).

Nella trave $M(x) = -80 + 40x - 5x^2$ kNm, con $x$ misurato dal nodo 2. Il momento si annulla nella cerniera e non è mai positivo: in tutta la trave le fibre tese sono quelle superiori. Il taglio $V(x) = 40 - 10x$ si annulla proprio nella cerniera, quindi è lì che il momento ha il suo estremo.

::callout{type="details" title="L’abbassamento della cerniera con il principio dei lavori virtuali"}
Applica un carico unitario verso il basso nel nodo 3. Dà le reazioni $\bar V = \bar H = 1/2$ e un momento $\bar m$ che cresce da 0 alla base a 2 nel nodo d’angolo e torna a 0 nella cerniera, con le fibre esterne tese, come il momento reale $M$. Integra $M \bar m$ sulle quattro aste:

$$
\text{colonne: } 2\int_0^4 (20\,y)(0{,}5\,y)\,dy = 426{,}7
$$

$$
\text{trave: } 2\int_0^4 (80 - 40x + 5x^2)(2 - 0{,}5x)\,dx = 320
$$

Con $EI = 210 \times 10^6 \cdot 8{,}356 \times 10^{-5} = 17\,548$ kNm²:

$$
\delta_3 = \frac{1}{EI}\int M \bar m\,dx = \frac{746{,}7}{17\,548} = 0{,}04255\ \text{m}
$$

Sono i 42,55 mm che EduBeam riporta come `4,2554 · 10⁻²` m. Il 4 dell’ultima cifra viene dal minimo accorciamento e dalla minima deformazione a taglio che un’area di 1 m² consente ancora, e che il calcolo a mano trascura. Con l’area reale di un IPE 300, $A = 53{,}8$ cm², e con l’anima come area a taglio (un coefficiente di taglio di 0,40), le aste si accorciano e si deformano a taglio di più, e la cerniera si abbassa di 43,7 mm, circa il 3 % in più.
::

## Sperimenta {#_7-experiment}

Cambia una cosa alla volta, prevedi il risultato e solo dopo guarda. <kbd>Ctrl</kbd>+<kbd>Z</kbd> annulla ogni modifica.

**Togli la spunta alla cerniera.** Il telaio diventa una volta iperstatico. La spinta si dimezza a 10 kN, i momenti nei nodi d’angolo scendono a −40 kNm e in mezzeria la trave ha un momento positivo di 40 kNm. Ora il nodo 3 si abbassa solo di 12,16 mm invece di 42,55 mm. Adesso contano anche le sezioni: dai alla trave una sezione più rigida di quella delle colonne e i momenti nei nodi d’angolo crescono.

::model-figure{caption="Senza la cerniera: meno spinta, momenti d’angolo dimezzati e un momento positivo in mezzeria"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], [2, 3], [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, w]
show: [nodeLabels]
---
::

**Incastra le basi.** Assegna ai nodi 1 e 5 il simbolo **Incastro**. La spinta sale a 30 kN e alle basi compaiono momenti di 40 kNm (EduBeam mostra `39,99`, perché le colonne si accorciano di pochissimo), ma i momenti nei nodi d’angolo restano di 80 kNm. Per simmetria il taglio nella cerniera è nullo, quindi ogni metà della trave lavora ancora come una mensola di 4 m incastrata nel nodo d’angolo: $q \cdot 4^2/2 = 80$ kNm.

**Spingi di lato.** Torna alle cerniere e aggiungi un carico nodale `Fx = 10` kN nel nodo 2. Le reazioni perdono la simmetria: 35 kN e 45 kN verso l’alto, 15 kN e 25 kN in orizzontale. Verificale con le stesse tre equazioni e $M_3 = 0$; il carico nel nodo 2 non ha braccio rispetto al nodo 3. Il momento nel nodo d’angolo sinistro scende a −60 kNm, e ora la metà sinistra della trave ha un piccolo momento positivo, 1,25 kNm a 0,5 m dalla cerniera.

::model-figure{caption="Un carico orizzontale di 10 kN nel nodo 2: ora il nodo d’angolo destro porta 100 kNm"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], { nodes: [2, 3], hinges: [false, true] }, [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
  - { node: 2, fx: 10 }
results: [M, N]
show: [nodeLabels]
---
::

**Aggiungi una seconda cerniera.** Spunta anche la cerniera iniziale dell’elemento 2, nel nodo 2. Due cerniere nella trave su due colonne incernierate formano un meccanismo. EduBeam non mostra risultati, segnala *Le cerniere in 2, 3 permettono alla struttura di muoversi.* e anima il movimento.

## Prossimi passi {#next-steps}

::card-grid{cols="2"}
:::card{title="Esercizi: telai a tre cerniere" icon="lucide:dices" to="/it/practice?p=H2048"}
Lo stesso telaio con carichi nuovi, tra cui una spinta orizzontale, con le tue risposte verificate subito. Inizia con H2048; per altri esercizi, lascia selezionato solo **Telaio a tre cerniere** e premi **Nuovo esercizio**.
:::
:::card{title="Prossimo: travatura reticolare piana" icon="lucide:git-fork" to="/it/tutorials/truss"}
Nove aste incernierate: il metodo dei nodi, il metodo delle sezioni, un’asta scarica e una freccia con il principio dei lavori virtuali.
:::
::
