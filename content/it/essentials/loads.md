---
description: "Forze, momenti, cedimenti, carichi uniformi, trapezoidali, concentrati e termici in EduBeam, con la convenzione dei segni: z positivo verso il basso, momenti antiorari."
source: site
---

# Carichi

I carichi agiscono sui nodi o lungo gli elementi. Appartengono tutti a un **unico caso di carico** e agiscono insieme; per confrontare più scenari, salva ciascuno come [file di progetto o link condiviso](/it/essentials/import-export).

| Carico | Agisce su | Dove si aggiunge |
| --- | --- | --- |
| [Forza o momento](#nodal-loads) | un nodo | Scheda *Carichi* → **Aggiungi carico nodale**, oppure fai clic sul nodo → **Aggiungi carico** |
| [Spostamento imposto](#prescribed-displacements-support-settlements) (cedimento) | un nodo vincolato | La stessa finestra, oppure fai clic sul nodo → **Imponi spostamento** |
| Carico [uniforme](#uniformly-distributed-load), [trapezoidale](#trapezoidal-load), [concentrato](#concentrated-load) o [termico](#temperature-load) | un elemento | Scheda *Carichi* → **Aggiungi carico su elemento**, oppure fai clic sull’elemento → **Aggiungi carico** |

## Convenzione dei segni {#sign-convention-in-one-line}

L’asse x punta **a destra**, l’asse z **verso il basso**, e i momenti sono positivi in senso **antiorario**. Un `Fz` o un `fz` positivo è quindi un carico diretto verso il basso, come la gravità, e un carico diretto verso l’alto è negativo.

::model-figure{caption="Tutti i carichi qui sono positivi: Fx = +10 kN verso destra, Fz = +10 kN verso il basso, My = +10 kNm in senso antiorario"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0] }
supports: { A: pin, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: A, fx: 10 }
  - { node: B, fz: 10 }
  - { node: C, my: 10 }
results: []
---
::

| Positivo | Assi predefiniti (z verso il basso) | [Assi con y verso l’alto](/it/elements/conventions#y-up-axes) |
| --- | --- | --- |
| Forza orizzontale `Fx`, `fx` | verso destra | verso destra |
| Forza verticale | `Fz`, `fz`: **verso il basso** | `Fy`, `fy`: **verso l’alto** |
| Momento | `My`: antiorario | `Mz`: antiorario |
| Cedimento verticale | `Dz`: verso il basso | `Dy`: verso l’alto |

I carichi negli **assi locali** di un elemento (LCS spuntato) seguono invece l’elemento: l’asse x locale va dal nodo iniziale al nodo finale, e l’asse z locale è l’asse x locale ruotato di 90° in senso orario, verso la linea tratteggiata disegnata lungo l’elemento. Vedi [Verso dell’elemento](/it/essentials/elements#element-direction). La convenzione completa, comprese le forze interne, è in [Sistema di coordinate e convenzioni dei segni](/it/elements/conventions#loads).

## Carichi nodali {#nodal-loads}

Scheda *Carichi* → **Aggiungi carico nodale**, oppure fai clic su un nodo → **Aggiungi carico**, e lascia selezionato **Forza/Momento**. Inserisci le forze `Fx`, `Fz` (kN) e il momento `My` (kNm), con i segni visti [sopra](#sign-convention-in-one-line); l’anteprima disegna il carico mentre digiti.

![Aggiungi carico nodale: l’anteprima mostra il verso mentre digiti](/screenshots/it/loads-nodal.webp){.shot-md}

- Le componenti sono negli assi **globali**. Su un nodo con gli assi ruotati (un [vincolo inclinato](/it/essentials/nodes-supports#inclined-skewed-supports)) la finestra aggiunge il selettore **Assi globali** / **Assi del nodo**. Negli assi del nodo le componenti, indicate come `Fx′` e `Fz′`, agiscono lungo gli assi propri del nodo e ruotano con essi se in seguito l’angolo cambia. Quando passi da un sistema all’altro, EduBeam ricalcola i valori in modo che il carico resti lo stesso.
- Un nodo può avere più carichi nodali, che si sommano.

### Spostamenti imposti (cedimenti vincolari) {#prescribed-displacements-support-settlements}

Per spostare un vincolo di una quantità assegnata, scegli **Spostamento imposto** nella stessa finestra, oppure fai clic su un nodo vincolato → **Imponi spostamento**. Inserisci gli spostamenti `Dx`, `Dz` (positivi verso destra e verso il basso, nell’[unità di spostamento](/it/essentials/units-settings#units), per impostazione predefinita m) e la rotazione `Ry` (rad, positiva in senso antiorario).

- Si possono imporre solo i GdL **vincolati**: gli altri campi sono disattivati, e un nodo senza vincoli non può avere alcun cedimento.
- Un nodo ha al massimo uno spostamento imposto. Per cambiarlo, modificalo invece di aggiungerne un secondo.
- Su un vincolo inclinato i campi si chiamano `Dx′` e `Dz′`: il cedimento agisce lungo gli assi propri del vincolo.

Che un cedimento produca o no forze interne dipende dalla struttura. Lo stesso cedimento di 10 mm dell’appoggio B, senza altri carichi:

::div{.shots}

:::model-figure{caption="Trave semplicemente appoggiata: la trave ruota rigidamente; nessuna reazione, M = 0"}
---
nodes: { A: [0, 0], B: [5, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

:::model-figure{caption="Trave continua su B: la trave si inflette, M = 21,06 kNm sull’appoggio B"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

::

Una struttura isostatica segue il vincolo senza opporre resistenza. La trave continua invece deve inflettersi: l’appoggio B la tira verso il basso di $\delta = 10\ \text{mm}$, come farebbe un carico concentrato in mezzeria di una campata semplicemente appoggiata di 10 m. Con $L = 5\ \text{m}$ e $EI = 17\,548\ \text{kNm}^2$ dell’acciaio dell’esempio, quel carico vale $P = 6EI\delta/L^3 = 8{,}423\ \text{kN}$, ed è la reazione in B, e $M_B = PL/2 = 3EI\delta/L^2 = 21{,}06\ \text{kNm}$. Il [tutorial sulla trave continua](/it/tutorials/continuous-beam) combina un cedimento con dei carichi.

## Carichi su elemento {#element-loads}

Scheda *Carichi* → **Aggiungi carico su elemento**, oppure fai clic su un elemento → **Aggiungi carico**. Scegli il **Tipo di carico**; l’anteprima mostra il carico sull’elemento mentre digiti. Le forze sono in kN e i carichi distribuiti in kN/m, oppure nelle [unità](/it/essentials/units-settings#units) che hai scelto.

![Aggiungi carico su elemento, con un carico uniforme](/screenshots/it/loads-udl.webp){.shot-md}

### Carico uniforme {#uniformly-distributed-load}

Un carico uniformemente distribuito: costante per unità di lunghezza, `fx` e `fz`, su tutto l’elemento. Con **LCS** spuntato (l’impostazione predefinita) le componenti agiscono lungo gli assi locali dell’elemento; senza spunta, lungo gli assi globali. Su un elemento orizzontale disegnato da sinistra a destra le due cose coincidono; su un’asta inclinata no:

| Vuoi | Inserisci |
| --- | --- |
| un carico **perpendicolare** all’asta (vento su una trave di falda) | `fz` con LCS **spuntato** |
| un carico **verticale** per metro di lunghezza dell’asta (peso proprio) | `fz` con LCS **non spuntato** |
| un carico **verticale** per metro in pianta (neve) | non disponibile direttamente: moltiplicalo per $\cos\alpha$, dove $\alpha$ è l’inclinazione dell’asta, e inseriscilo come carico verticale |

Gli stessi 10 kN/m su una trave di falda che copre 4 m in orizzontale e sale di 3 m, lunga 5 m:

::div{.shots}

:::model-figure{caption="LCS non spuntato: verticale, 50 kN in totale; M = 25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [M]
---
:::

:::model-figure{caption="LCS spuntato: perpendicolare all’asta; M = 31,25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10, local: true }
results: [M]
---
:::

::

A mano: perpendicolare, $M = qL^2/8 = 10 \cdot 5^2/8 = 31{,}25\ \text{kNm}$; verticale, i 50 kN distribuiti su 4 m di luce danno 12,5 kN/m in proiezione, quindi $M = 12{,}5 \cdot 4^2/8 = 25\ \text{kNm}$.

### Carico trapezoidale {#trapezoidal-load}

Un carico che varia linearmente lungo l’elemento: `f1x`, `f1z` nel nodo **iniziale**, `f2x`, `f2z` nel nodo **finale**. Per un carico triangolare imposta a zero una delle due estremità.

::model-figure{caption="Carico triangolare da 0 a 10 kN/m: reazioni 10 e 20 kN, M massimo = 23,09 kNm a 3,46 m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: [0, 10] }
results: [M, V]
show: [nodeLabels]
---
::

A mano: il carico totale $qL/2 = 30\ \text{kN}$ agisce a $2L/3$, quindi $R_A = 10\ \text{kN}$ e $R_B = 20\ \text{kN}$; il taglio si annulla, e il momento è massimo, in $x = L/\sqrt{3} = 3{,}46\ \text{m}$, dove $M = qL^2/(9\sqrt{3}) = 23{,}09\ \text{kNm}$.

I carichi trapezoidali agiscono lungo gli **assi locali** dell’elemento (la casella LCS è bloccata). Su un elemento orizzontale disegnato da sinistra a destra è come negli assi globali; su uno inclinato `f1z` e `f2z` sono perpendicolari all’asta e `f1x`, `f2x` diretti lungo di essa.

Anche un carico **verticale** variabile su un’asta inclinata di $\alpha$ si può dare in modo esatto: inserisci a ciascuna estremità le sue due componenti locali, $f_z = q\cos\alpha$ e $f_x = q\sin\alpha$ diretta verso valle lungo l’asta, quindi negativa quando l’elemento sale a partire dal nodo iniziale. Per la trave di falda di prima, 4 m in orizzontale e 3 m in altezza, disegnata dal basso, un carico verticale che cresce da 0 a 10 kN/m di lunghezza dell’asta diventa `f1x` = `f1z` = 0, `f2x` = −6 e `f2z` = 8 kN/m.

::model-figure{caption="Carico verticale da 0 a 10 kN/m di lunghezza dell’asta, inserito con le componenti locali: reazioni 8,333 e 16,67 kN, M massimo = 12,83 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qx: [0, -6], qz: [0, 8], local: true }
results: [M]
show: [nodeLabels]
---
::

A mano: la risultante di 25 kN agisce a due terzi della proiezione orizzontale, a 2,67 m, quindi $R_B = 25 \cdot 2{,}667/4 = 16{,}67\ \text{kN}$. Sulla proiezione di 4 m il carico è un triangolo che sale fino a 12,5 kN/m, quindi, come sopra, $M = 12{,}5 \cdot 4^2/(9\sqrt{3}) = 12{,}83\ \text{kNm}$.

### Carico concentrato {#concentrated-load}

Una forza concentrata `Fx`, `Fz` o un momento `My` in qualsiasi punto **lungo** un elemento, senza un nodo in più. **Posizione del carico dal nodo iniziale** è la sua distanza $a$ dal nodo iniziale, con $0 \le a \le L$. All’inizio vale metà della lunghezza, arrotondata per difetto al metro intero e al massimo 5 m (a piedi interi e al massimo 15 ft nelle unità USA): impostala quindi dove si trova il tuo carico. **LCS** funziona come per i carichi uniformi.

::model-figure{caption="20 kN a 2 m su una campata di 6 m: V salta da 13,33 a −6,667 kN, M = 26,67 kNm sotto il carico"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M]
show: [nodeLabels]
---
::

Nel punto del carico il diagramma del taglio ha un salto pari a `Fz` e quello del momento un punto angoloso: $R_A = 20 \cdot 4/6 = 13{,}33\ \text{kN}$, $M = 13{,}33 \cdot 2 = 26{,}67\ \text{kNm}$. Un `My` concentrato produce invece un salto nel diagramma del momento.

### Carico termico {#temperature-load}

| Campo | Significato | Effetto |
| --- | --- | --- |
| **ΔT<sub>c</sub>**, variazione di temperatura all’asse baricentrico | la stessa variazione su tutta la sezione | allungamento $\alpha\,\Delta T_c\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>** | variazione delle fibre inferiori meno quella delle fibre superiori | curvatura $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

Entrambe sono *variazioni* di temperatura rispetto allo stato privo di tensioni, per impostazione predefinita in °C; una variazione di 1 °C equivale a 1 K. I carichi termici usano l’**α** del materiale e l’**altezza h** della sezione. Le fibre **inferiori** sono quelle dal lato della linea tratteggiata. Un ΔT<sub>b</sub> − ΔT<sub>t</sub> positivo (più caldo in basso) allunga le fibre inferiori, quindi l’elemento si inflette verso il basso come una trave sotto carichi gravitazionali.

In una struttura isostatica la temperatura produce solo spostamenti. Sono i vincoli sovrabbondanti (estremità incastrate, continuità, aste in più) a trasformarla in forze interne. La stessa trave d’acciaio di 6 m, alta 0,3 m, più calda di 20 K in basso che in alto:

::div{.shots}

:::model-figure{caption="Semplicemente appoggiata: si abbassa di 3,6 mm in mezzeria, M = 0"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [w, M]
---
:::

:::model-figure{caption="Doppiamente incastrata: resta rettilinea, M = −14,04 kNm su tutta la lunghezza"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [M, w]
---
:::

::

A mano: la curvatura libera vale $\kappa = \alpha\,\Delta T/h = 12 \times 10^{-6} \cdot 20/0{,}3 = 8 \times 10^{-4}\ \text{1/m}$. Se semplicemente appoggiata, la trave la assume liberamente e si abbassa di $\kappa L^2/8 = 3{,}6\ \text{mm}$. Con le estremità incastrate, un momento costante deve annullarla: $M = -EI\kappa = -17\,548 \cdot 8 \times 10^{-4} = -14{,}04\ \text{kNm}$. In [Verificare i risultati a mano](/it/guide/verification#temperature-gradient-on-a-simply-supported-beam) trovi un altro caso svolto.

## Modificare e rimuovere i carichi {#editing-and-removing-loads}

| Operazione | Come fare |
| --- | --- |
| Cambiare rapidamente i valori | Modifica le componenti (e la casella LCS) direttamente nella scheda *Carichi*. |
| Aprire la finestra di modifica | Fai doppio clic sul carico nella vista, oppure fai clic su di esso → **Modifica carico**. I carichi compaiono anche come etichette nelle tabelle *Nodi* ed *Elementi*: fai clic su una di esse per modificare il carico. |
| Eliminarlo | Selezionalo e premi <kbd>Canc</kbd>, fai clic su di esso → **Elimina**, oppure usa la × nella scheda *Carichi*. |

I carichi appartengono al loro nodo o elemento: se elimini il nodo o l’elemento, spariscono anche loro, e se lo copi con i carichi selezionati, li copi insieme.

![La scheda Carichi: una riga per carico, con le componenti modificabili direttamente](/screenshots/it/loads-table.webp)

## Cosa non è disponibile {#what-is-not-available}

::div{.limits}
- **Un solo caso di carico.** Niente combinazioni: salva ogni caso in un file o in un link a sé.
- **Niente peso proprio.** Aggiungilo come carico uniforme con LCS non spuntato: $f_z = \rho\,g\,A$, ad esempio $\approx 0{,}22\ \text{kN/m}$ per un IPE 200.
- **Carichi trapezoidali solo negli assi locali.** Per un carico verticale variabile su un’asta inclinata, inserisci le sue [componenti locali](#trapezoidal-load).
- **Niente carichi distribuiti parziali.** Un carico distribuito copre l’intero elemento: aggiungi un nodo dove inizia o finisce.
::
