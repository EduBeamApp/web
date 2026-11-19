---
description: "Sei travi, telai e travature già risolti, da aprire in EduBeam con un clic, ognuno con esercizi, cosa osservare e soluzioni per verificare il calcolo a mano."
source: site
---

# Esempi

Ogni riquadro qui sotto è un modello risolto e interattivo. Fai clic su un riquadro per aprirlo in [EduBeam]{.edubeam}, pronto da modificare: trascina un nodo, cambia un carico o spunta una cerniera e guarda i diagrammi aggiornarsi. Gli esercizi più in basso trasformano ogni modello in una breve esercitazione, con le soluzioni per verificare il tuo calcolo a mano.

::feature-structures
::

Gli stessi modelli si trovano nell’app in **☰ → Esempi**, e [run.edubeam.app/?panel=examples](https://run.edubeam.app/?panel=examples&lang=it){target="_blank"} apre direttamente quella galleria.

::callout{type="info" title="Un solo tipo di asta per tutti e sei"}
Tutti gli esempi usano la stessa asta in acciaio: $E = 210$ GPa, $I_y = 8356\ \text{cm}^4$ (quindi $EI = 17\,548$ kNm²), un’area di $1\ \text{m}^2$ e una rigidezza a taglio così grande che la deformazione assiale e quella a taglio sono trascurabili. Le formule dei manuali per le travi snelle coincidono quindi con l’app in tutte le cifre mostrate. L’altezza della sezione è $1$ m, e conta solo per il carico termico.
::

## Esercizi suggeriti {#suggested-exercises}

Risolvi prima l’esercizio a mano, poi verifica il risultato nell’app: apri il modello dal suo riquadro qui sopra o con **Apri in EduBeam** sotto la sua figura. Il modello aperto sostituisce quello su cui stai lavorando; <kbd>Ctrl</kbd>+<kbd>Z</kbd> riporta il tuo, che trovi anche in **☰ → Strutture recenti**.

### Trave iperstatica {#exercise-indeterminate-beam}

Una trave di 3 m, incastrata in A e su un carrello in B, con un carico di 10 kN/m.

::model-figure{caption="Incastro in A, carrello in B, 10 kN/m"}
---
nodes: { A: [0, 0], B: [3, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Determinare a mano le reazioni e il momento all’incastro, con il metodo delle forze o con una tabella dei momenti di incastro perfetto.
2. Togliere la spunta a `Ry` in A per rendere la trave semplicemente appoggiata. Come cambia il momento massimo?
3. Spuntare di nuovo `Ry` in A, e anche in B, per incastrare entrambe le estremità.

**Osserva** dove il diagramma del momento cambia segno, e come l’incastro assorbe una quota del carico maggiore di quella del carrello.

::callout{type="details" title="Soluzioni"}
- Incastro e carrello: $R_A = 5qL/8 = 18{,}75$ kN, $R_B = 3qL/8 = 11{,}25$ kN, $M_A = qL^2/8 = 11{,}25$ kNm, negativo. Il momento positivo massimo è $9qL^2/128 = 6{,}33$ kNm, a 1,125 m da B, dove il taglio è nullo.
- Semplicemente appoggiata: $qL^2/8 = 11{,}25$ kNm in mezzeria, lo stesso valore che prima portava l’incastro.
- Doppiamente incastrata: $qL^2/12 = 7{,}5$ kNm, negativo, alle estremità e $qL^2/24 = 3{,}75$ kNm, positivo, in mezzeria.
::

### Mensola {#exercise-cantilever}

Una mensola di 4 m, incastrata in A, con 18 kN verso il basso all’estremità libera B.

::model-figure{caption="Mensola, 18 kN all’estremità libera"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Determinare il momento all’incastro, la freccia e la rotazione all’estremità libera. Confrontarli con il nodo B in **Risultati → Risultati nodali**.
2. Dimezzare $I_y$ nella scheda **Sezioni**. Che cosa cambia e che cosa no?
3. Sostituire il carico concentrato con un carico uniforme di 4,5 kN/m, per lo stesso totale di 18 kN: eliminare il carico nodale nella scheda **Carichi**, poi usare **Aggiungi carico su elemento**.

**Osserva** la forma del diagramma del momento: una retta sotto il carico concentrato, una parabola sotto il carico uniforme.

::callout{type="details" title="Soluzioni"}
- $M_A = FL = 72$ kNm, $w_B = FL^3/(3EI) = 21{,}88$ mm, $\varphi_B = FL^2/(2EI) = 8{,}21$ mrad.
- Con metà $I_y$ la freccia raddoppia, a 43,77 mm. Il momento resta 72 kNm: la mensola è isostatica, quindi le sue forze interne non dipendono dalla rigidezza.
- Carico uniforme: $M_A = qL^2/2 = 36$ kNm e $w_B = qL^4/(8EI) = 8{,}21$ mm. Lo stesso carico totale dà metà del momento e tre ottavi della freccia.
::

### Travatura Warren {#exercise-pratt-truss}

Una travatura di 9 m, alta 1,8 m, con 8 kN in ciascuno dei tre nodi superiori E, F e G. Spunta **N(x)** nelle opzioni di visualizzazione per vedere gli sforzi normali. (Con diagonali alternate e senza montanti, la sua geometria è quella che la maggior parte dei manuali chiama travatura Warren.)

::model-figure{caption="Nodi da A a G, 8 kN in E, F e G"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D], [E, F], [F, G], [A, E], [E, B], [B, F], [F, C], [C, G], [G, D]]
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: []
show: [nodeLabels]
---
::

1. Determinare le reazioni, poi gli sforzi nella diagonale di estremità A–E e nel corrente inferiore A–B con il metodo dei nodi.
2. Determinare lo sforzo nel corrente superiore del campo centrale e quello nel corrente inferiore B–C con il metodo delle sezioni.
3. In questo modello i nodi sono rigidi. Spuntare entrambe le cerniere di estremità di ogni asta nella scheda **Elementi** per ottenere una travatura a nodi incernierati, e confrontare gli sforzi normali.
4. Eliminare la diagonale B–F, prima con i nodi rigidi, poi con le cerniere. La travatura sta ancora in piedi?

**Osserva** la distribuzione dei segni: il corrente superiore è compresso, quello inferiore teso, e le diagonali si alternano.

::callout{type="details" title="Soluzioni"}
- Reazioni: 12 kN in A e in D.
- Diagonali di estremità: 15,62 kN di compressione. Correnti inferiori A–B e C–D: 10,00 kN di trazione.
- Correnti superiori E–F e F–G: 13,33 kN di compressione (momenti rispetto a B: $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$). Corrente inferiore B–C: 16,67 kN di trazione (momenti rispetto a F: $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$). Diagonali interne: 5,21 kN, tese quelle che scendono da E e da G verso il corrente inferiore, compresse quelle che salgono verso F.
- Nodi rigidi e nodi incernierati danno gli stessi sforzi normali a meno dello 0,1 %. In una travatura triangolata la flessione è trascurabile, ed è per questo che il modello a nodi incernierati funziona.
- Senza B–F, la travatura a nodi rigidi sta ancora in piedi grazie al comportamento a telaio, con momenti flettenti di circa 3 kNm. Con le cerniere le manca un’asta: diventa un meccanismo, ed EduBeam mostra come può muoversi.
::

### Trave continua a tre campate {#exercise-three-span-continuous-beam}

Una trave di 16 m con campate di 5 + 6 + 5 m: 8 kN/m sulla prima campata, 20 kN in C e 6 kN/m sull’ultima campata. All’apertura sono vincolati solo A e D.

::model-figure{caption="All’apertura: vincolata solo in A e D"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Così come si apre, è un’unica trave semplicemente appoggiata di 16 m. Determinare le reazioni e i momenti in B e C.
2. Spuntare `Dz` in B e in C per ottenere una trave continua su quattro appoggi.
3. Determinare i momenti sugli appoggi B e C con l’equazione dei tre momenti, poi le reazioni.

**Osserva** i momenti negativi che compaiono sugli appoggi intermedi, quanto si riducono tutti i momenti, e che fine fa il carico di 20 kN quando C diventa un appoggio.

::callout{type="details" title="Soluzioni"}
- Semplicemente appoggiata: $R_A = 44{,}69$ kN, $R_D = 45{,}31$ kN, $M_B = 123{,}4$ kNm e $M_C = 151{,}6$ kNm, entrambi positivi.
- Continua, con $M_A = M_D = 0$:
  $$22 M_B + 6 M_C = -\tfrac{8 \cdot 5^3}{4}$$
  $$6 M_B + 22 M_C = -\tfrac{6 \cdot 5^3}{4}$$
  danno $M_B = -9{,}766$ kNm e $M_C = -5{,}859$ kNm, negativi. I 20 kN in C vanno direttamente nell’appoggio e non inflettono nulla.
- Reazioni: A 18,05 kN, B 22,60 kN, C 35,52 kN (compresi i 20 kN), D 13,83 kN. La loro somma è pari ai 90 kN di carico.

::model-figure{caption="La trave continua su quattro appoggi"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, B: roller, C: roller, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: [M, V]
---
::
::

### Telaio a portale {#exercise-portal-frame}

Una trave di 8 m su due colonne di 6 m, con un incastro in A e un carrello in D. La trave porta 10 kN/m, e il nodo d’angolo superiore C riceve 8 kN verso sinistra e 10 kN verso il basso.

::model-figure{caption="Incastro in A, carrello in D: 10 kN/m sulla trave, 8 kN e 10 kN in C"}
---
nodes: { A: [0, 0], B: [0, -6], C: [8, -6], D: [8, 0] }
supports: { A: fixed, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
  - { node: C, fx: -8 }
  - { node: C, fz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Determinare il grado di iperstaticità del telaio.
2. Togliere la spunta a `Ry` in A, così che A diventi una cerniera. Il telaio ora è isostatico: determinare a mano le reazioni e i momenti nei nodi d’angolo B e C.
3. Spuntare di nuovo `Ry` in A, poi spuntare `Dx` in D per trasformare il carrello in una cerniera. Osservare lo spostamento laterale della trave nella deformata.

**Osserva** in che verso si sposta la sommità del telaio. Nel telaio così come si apre si sposta verso destra, contro il carico di 8 kN. Perché?

::callout{type="details" title="Soluzioni"}
- Quattro reazioni (tre all’incastro, una nel carrello) e tre equazioni di equilibrio: il telaio è una volta iperstatico. Con una cerniera anche in D, due volte.
- Cerniera in A: $V_D = (10 \cdot 8 \cdot 4 + 10 \cdot 8 - 8 \cdot 6)/8 = 44$ kN, $V_A = 46$ kN, $H_A = 8$ kN verso destra. Il momento nel nodo d’angolo B vale $8 \cdot 6 = 48$ kNm. In C è nullo: senza reazione orizzontale in D, la colonna destra porta solo uno sforzo normale di 44 kN.
- Così come si apre, la sommità si sposta di 9,5 mm verso destra: il momento della trave caricata inflette la colonna incastrata più di quanto faccia il carico di 8 kN. Con la cerniera in D, D assorbe 4,9 kN in orizzontale e la sommità si sposta di 4,8 mm verso sinistra.
::

### Carico termico {#exercise-temperature-load}

Una trave semplicemente appoggiata di 8 m, riscaldata di $\Delta T_c = 20$ K lungo l’asse, con il lembo inferiore 10 K più freddo di quello superiore ($\Delta T_b - \Delta T_t = -10$ K).

::model-figure{caption="Trave semplicemente appoggiata di 8 m, riscaldata di 20 K, con il lembo inferiore 10 K più freddo di quello superiore"}
---
nodes: { A: [0, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 20, bottom: -10, top: 0 } }
results: []
show: [nodeLabels, dimensions]
---
::

1. Prima di guardare: quali forze interne provoca la temperatura, e come si muove la trave?
2. Spuntare `Dx` in B per impedire alla trave di allungarsi.
3. Spuntare anche `Ry` a entrambe le estremità.

**Osserva** la deformata e i valori in **Risultati → Risultati nodali**: la trave si muove senza alcuna forza interna finché non la vincoli.

::callout{type="details" title="Soluzioni"}
- Una trave isostatica è libera di dilatarsi e di inflettersi, quindi non nascono forze interne. B scorre verso l’esterno di $\alpha \Delta T_c L = 12 \cdot 10^{-6} \cdot 20 \cdot 8 = 1{,}92$ mm. Il lembo inferiore, più freddo, si accorcia, quindi la trave si inarca verso l’alto con curvatura $\kappa = \alpha (\Delta T_b - \Delta T_t)/h = -1{,}2 \cdot 10^{-4}$ 1/m: le estremità ruotano di $\kappa L/2 = 0{,}48$ mrad e la mezzeria si alza di $\kappa L^2/8 = 0{,}96$ mm.
- Con entrambe le estremità bloccate in x: $N = -EA\alpha\Delta T_c = -50\,400$ kN, di compressione. Il valore è così grande per via dell’area fittizia di 1 m²; un IPE 200 con 28,48 cm² porterebbe 143,5 kN.
- Con entrambe le estremità incastrate: un momento costante $EI\alpha(\Delta T_b - \Delta T_t)/h = 2{,}11$ kNm lungo tutta la trave.
::

## Tutorial svolti {#worked-tutorials}

Modelli più ampi, costruiti passo per passo e verificati a mano:

::card-grid{cols="2"}
:::card{title="Trave inclinata" icon="lucide:move-diagonal" to="/it/tutorials/inclined-beam"}
Una trave di falda sotto la neve: carichi per metro in pianta, sforzo normale e taglio lungo la falda e un carrello ruotato.
:::
:::card{title="Telaio a tre cerniere" icon="lucide:triangle" to="/it/tutorials/three-hinged-frame"}
Reazioni, N, V e M di un telaio con una cerniera interna.
:::
:::card{title="Travatura reticolare piana" icon="lucide:git-fork" to="/it/tutorials/truss"}
Il metodo dei nodi, il metodo delle sezioni, un’asta scarica e uno spostamento calcolato con il principio dei lavori virtuali.
:::
:::card{title="Trave continua e cedimento vincolare" icon="lucide:spline" to="/it/tutorials/continuous-beam"}
Una trave a due campate risolta con il metodo delle forze, poi con un cedimento di 10 mm dell’appoggio intermedio.
:::
::

Per altre verifiche in forma chiusa, vedi [Verificare i risultati a mano](/it/guide/verification).

## Altri esercizi {#more-problems}

La pagina [Esercizi di statica](/it/practice) ti propone, ogni volta che vuoi, una nuova trave, un nuovo telaio o una nuova travatura con valori sempre diversi, e controlla subito le tue reazioni e il momento massimo o lo sforzo massimo nelle aste. Per una classe, il [generatore di compiti](/it/exam) stampa un compito diverso per ogni studente, con le soluzioni, e [@edubeam/plot](/it/guide/teaching#exercise-sheets-tests-and-slides-from-code) crea fogli di esercizi a partire dal codice.

## Proponi un esempio {#contribute-an-example}

Hai un buon modello per la didattica? Condividi il suo link nelle [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions) e potremmo aggiungerlo alla galleria.
