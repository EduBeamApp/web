---
description: "Trave di Timoshenko a due nodi in EduBeam: rigidezza esatta, deformazione a taglio, cerniere per condensazione statica, forze di incastro perfetto, trasformazione."
source: site
---

# Elemento trave

Ogni asta di EduBeam, che sia una trave, una colonna o un’asta di una travatura reticolare, è lo stesso elemento: una **trave di Timoshenko** rettilinea a due nodi nel piano x–z, a sezione costante. Questa pagina ne riporta la formulazione esattamente come la calcola il solutore, così puoi ricostruire a mano qualsiasi matrice dell’elemento o vettore dei carichi e confrontarlo con l’app. I segni sono quelli della pagina [Sistema di coordinate e convenzioni dei segni](/it/elements/conventions), il codice è il file `Beam2D.ts` della libreria [@edubeam/fem](/it/solver) e la pagina [Come EduBeam risolve un modello](/it/elements/analysis) mostra come dagli elementi si arriva alla soluzione.

## Gradi di libertà {#degrees-of-freedom}

Ogni nodo ha tre gradi di libertà (GdL), quindi l’elemento ne ha sei. Negli [assi locali](/it/elements/conventions#element-local-axes) dell’elemento, a ogni spostamento di estremità corrisponde una [forza di estremità](/it/elements/conventions#end-forces-element-results-table), cioè una colonna della tabella *Risultati degli elementi*:

::element-sketch{mode="dofs" caption="I sei gradi di libertà dell’elemento trave, ciascuno disegnato nel verso positivo; la linea tratteggiata indica le fibre inferiori (+z locale)"}
::

| Direzione | Nodo iniziale (1) | Nodo finale (2) |
| --- | --- | --- |
| lungo l’asse x locale | $u_1$ e `X12` | $u_2$ e `X21` |
| lungo l’asse z locale, verso il basso per un elemento disegnato da sinistra a destra | $w_1$ e `Z12` | $w_2$ e `Z21` |
| rotazione, antioraria | $\varphi_1$ e `M12` | $\varphi_2$ e `M21` |

In quest’ordine formano il vettore degli spostamenti e il vettore delle forze dell’elemento:

$$
\begin{aligned}
\mathbf{d}_l &= \begin{bmatrix} u_1 & w_1 & \varphi_1 & u_2 & w_2 & \varphi_2 \end{bmatrix}^\mathsf{T}, \\
\mathbf{f} &= \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}.
\end{aligned}
$$

Poiché z punta verso il basso e le rotazioni sono positive in senso antiorario, l’asse di una trave senza deformazione a taglio ruota di $\varphi = -\,\mathrm{d}w/\mathrm{d}x$.

## Matrice di rigidezza locale {#local-stiffness-matrix}

Le forze di estremità di un elemento privo di carichi sull’elemento sono $\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l$, con

$$
\mathbf{K}_l =
\begin{bmatrix}
 k_N & 0 & 0 & -k_N & 0 & 0 \\
 0 & k_1 & -k_2 & 0 & -k_1 & -k_2 \\
 0 & -k_2 & k_3 & 0 & k_2 & k_4 \\
 -k_N & 0 & 0 & k_N & 0 & 0 \\
 0 & -k_1 & k_2 & 0 & k_1 & k_2 \\
 0 & -k_2 & k_4 & 0 & k_2 & k_3
\end{bmatrix}
$$

e

$$
\begin{aligned}
k_N &= \frac{EA}{L}, & k_1 &= \frac{12\,EI_y}{(1+\Phi)\,L^3}, \\[1ex]
k_2 &= \frac{6\,EI_y}{(1+\Phi)\,L^2}, & k_3 &= \frac{(4+\Phi)\,EI_y}{(1+\Phi)\,L}, \\[1ex]
k_4 &= \frac{(2-\Phi)\,EI_y}{(1+\Phi)\,L}, & \Phi &= \frac{12\,EI_y}{k\,GA\,L^2}.
\end{aligned}
$$

$E$ e $G$ sono il modulo elastico e il modulo di taglio del materiale, $A$ l’area, $I_y$ il momento d’inerzia rispetto all’asse y, $k$ il **Coefficiente di taglio** della sezione e $L$ la lunghezza dell’elemento. $\Phi$ è il **parametro di deformabilità a taglio**: misura quanto l’asta è deformabile a taglio rispetto alla flessione e cresce quanto più l’asta è corta e alta. Con $\Phi = 0$ si ritrovano i termini noti $12EI/L^3$, $6EI/L^2$, $4EI/L$ e $2EI/L$ della trave di Eulero–Bernoulli. Il comportamento assiale e quello flessionale sono disaccoppiati: $u_1$ e $u_2$ compaiono solo insieme a $k_N$.

Nei testi con l’asse y verso l’alto trovi $+6EI/L^2$ dove questa matrice ha $-k_2$. Le due matrici descrivono la stessa rigidezza; cambia solo il verso positivo dello spostamento trasversale.

::callout{type="details" title="Da dove viene la matrice: le funzioni di forma esatte"}
Per un’asta prismatica di Timoshenko senza carichi, le equazioni di equilibrio hanno una soluzione esatta: $u$ è lineare in $x$, $w$ cubica e $\varphi$ quadratica. Espresso tramite gli spostamenti di estremità, con $\xi = x/L$, lo spostamento trasversale vale

$$
w(\xi) = N_1\,w_1 + N_2\,\varphi_1 + N_3\,w_2 + N_4\,\varphi_2,
$$

$$
\begin{aligned}
N_1 &= \frac{(1-\xi)\,(1+\Phi+\xi-2\xi^2)}{1+\Phi}, \\[1ex]
N_2 &= -\frac{L\,\xi\,(1-\xi)\,(2+\Phi-2\xi)}{2\,(1+\Phi)}, \\[1ex]
N_3 &= \frac{\xi\,(\Phi+3\xi-2\xi^2)}{1+\Phi}, \\[1ex]
N_4 &= \frac{L\,\xi\,(1-\xi)\,(\Phi+2\xi)}{2\,(1+\Phi)}.
\end{aligned}
$$

Per $\Phi = 0$ sono i polinomi cubici di Hermite, $N_1 = 1 - 3\xi^2 + 2\xi^3$ e $N_2 = -L\,\xi(1-\xi)^2$, dove il segno meno deriva da $\varphi = -w'$. La matrice di rigidezza contiene proprio le forze di estremità richieste da queste forme esatte: è quindi la rigidezza esatta dell’asta, non un’approssimazione che migliora aumentando il numero di elementi. Il solutore disegna la deformata con le stesse funzioni.
::

## Deformazione a taglio: Timoshenko o Eulero–Bernoulli? {#timoshenko-or-euler-bernoulli}

Se l’elemento si deforma a taglio dipende solo da $\Phi$, quindi dal coefficiente di taglio $k$ della sezione: $kA$ è l’area che porta il taglio, l’area a taglio. (Molti testi italiani usano invece il fattore di taglio $\chi = 1/k$.) Ogni tipo di sezione parte con il proprio $k$:

| Sezione | Coefficiente di taglio $k$ |
| --- | --- |
| Il modello iniziale e gli esempi integrati | $10^{32}$, che rende $\Phi \approx 0$: Eulero–Bernoulli |
| Sezioni a I, ad H e ad ali larghe dalla libreria | $h\,t_w / A$: il taglio lo porta l’anima |
| Sezioni rettangolari cave dalla libreria | $2\,h\,t / A$: le due pareti laterali |
| Rettangoli e quadrati dalla libreria | 0,833 |
| Cerchi dalla libreria | 0,9 |
| Sezioni circolari cave dalla libreria | 0,5 |
| Sezioni poligonali | 0,833 come valore iniziale |
| Finestra **Aggiungi sezione** | 1 come valore iniziale |

Per un’asta snella la differenza è piccola. Sotto un carico uniforme, il taglio aumenta la freccia flessionale in mezzeria di una trave semplicemente appoggiata di una frazione pari a $0{,}8\,\Phi$. Per un IPE 200 in acciaio è l’1,2 % su una luce di 6 m, ma l’11 % su 2 m. Per escludere la deformazione a taglio, imposta $k$ a un numero molto grande, ad es. `1e32`. Salvo indicazione contraria, le figure interattive di questo sito usano la sezione indeformabile a taglio degli esempi, quindi coincidono con i calcoli a mano secondo la teoria di Eulero–Bernoulli. Quella qui sotto no:

::model-figure{caption="IPE 200 su 2 m con k = h·tw/A = 0,393: w = 0,5657 mm in mezzeria, l’11 % in più del valore di Eulero–Bernoulli, 0,5106 mm (Φ = 0,135)"}
---
nodes: { A: [0, 0], B: [2, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
material: { e: 210e9, g: 81e9 }
section: { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 }
results: [w, M]
---
::

## Cerniere di estremità {#end-hinges}

Una [cerniera di estremità](/it/essentials/elements#end-hinges) spuntata annulla il momento a quell’estremità dell’elemento. La rotazione di estremità dell’elemento diventa così libera, e il solutore la elimina per **condensazione statica**. Dividiamo i sei GdL in quelli che restano, $a$, e nelle rotazioni di estremità svincolate, $b$:

$$
\begin{bmatrix} \mathbf{f}_a \\ \mathbf{0} \end{bmatrix}
=
\begin{bmatrix} \mathbf{K}_{aa} & \mathbf{K}_{ab} \\ \mathbf{K}_{ba} & \mathbf{K}_{bb} \end{bmatrix}
\begin{bmatrix} \mathbf{d}_a \\ \mathbf{d}_b \end{bmatrix}
+
\begin{bmatrix} \mathbf{f}_{\mathrm{fix},a} \\ \mathbf{f}_{\mathrm{fix},b} \end{bmatrix}.
$$

Qui $\mathbf{f}_\mathrm{fix}$ sono le forze di incastro perfetto dei [carichi sull’elemento](#element-loads). La seconda riga dà la rotazione nella cerniera,

$$
\mathbf{d}_b = -\mathbf{K}_{bb}^{-1}\left(\mathbf{K}_{ba}\,\mathbf{d}_a + \mathbf{f}_{\mathrm{fix},b}\right),
$$

e sostituendola nella prima riga restano la rigidezza e le forze di incastro perfetto condensate

$$
\begin{aligned}
\mathbf{K}^{*} &= \mathbf{K}_{aa} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}, \\
\mathbf{f}^{*}_\mathrm{fix} &= \mathbf{f}_{\mathrm{fix},a} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{f}_{\mathrm{fix},b}.
\end{aligned}
$$

Il solutore riporta $\mathbf{K}^{*}$ in una matrice 6 × 6, con righe e colonne nulle per le rotazioni svincolate, quindi un elemento con cerniere si assembla esattamente come tutti gli altri. Dopo la soluzione ricava $\mathbf{d}_b$ con la formula precedente, e la deformata mostra il punto angoloso nella cerniera.

Con una cerniera nel nodo finale, la parte flessionale relativa a $(w_1, \varphi_1, w_2)$ diventa

$$
\mathbf{K}^{*}_{w} = \frac{12\,EI_y}{(4+\Phi)\,L^3}
\begin{bmatrix} 1 & -L & -1 \\ -L & L^2 & L \\ -1 & L & 1 \end{bmatrix},
$$

che per $\Phi = 0$ è la classica rigidezza $3EI/L^3$ di un’asta incastrata-appoggiata. Con le cerniere a **entrambe** le estremità i termini flessionali scompaiono del tutto e resta solo $EA/L$: l’elemento è un’[asta reticolare](/it/elements/truss).

Una cerniera appartiene all’estremità di un elemento, non al nodo. Se tutti gli elementi che concorrono in un nodo vi sono incernierati, alla rotazione propria del nodo non è collegato nulla. Il solutore la lascia nulla, e questo non crea problemi; un momento nodale applicato in un nodo del genere, però, non ha nulla su cui agire e rende il sistema singolare.

## Carichi sull’elemento {#element-loads}

I carichi lungo un elemento entrano nella soluzione come **carichi nodali equivalenti**, $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. Le **forze di incastro perfetto** $\mathbf{f}_\mathrm{fix}$ sono le forze di estremità che tengono in equilibrio l’elemento caricato con entrambe le estremità incastrate.

Tutte le formule che seguono sono in assi locali. Un carico assegnato in assi globali (con **LCS** senza spunta) si scompone prima nelle componenti locali, con $c = \cos\theta$ e $s = \sin\theta$ dell’[angolo](#transformation-matrix) dell’elemento:

$$
q_x = c\,\bar q_x + s\,\bar q_z, \qquad q_z = -s\,\bar q_x + c\,\bar q_z,
$$

dove la barra indica le componenti globali. I carichi distribuiti agiscono per metro di lunghezza propria dell’elemento. Una trave di falda da $(0, 0)$ a $(3, -4)$, per esempio, ha $L = 5$ m, $c = 0{,}6$ e $s = -0{,}8$ (sale, quindi $z$ diminuisce). Un carico gravitazionale $\bar q_z = 10$ kN/m su questa trave ha le componenti $q_x = -8$ kN/m, verso il basso lungo la falda, e $q_z = 6$ kN/m perpendicolare alla falda, e la trave porta in tutto $10 \times 5 = 50$ kN, non $10 \times 3$.

Nelle tabelle:

- $q_z$, $q_x$: carico uniforme; $q_1 \to q_2$: carico trapezoidale, con $q_1$ nel nodo iniziale e $q_2$ nel nodo finale.
- $F_z$, $F_x$, $M_y$: forza o momento concentrato alla distanza $a$ dal nodo iniziale, con $b = L - a$.
- $\Delta T = \Delta T_b - \Delta T_t$: fibre inferiori più calde di quelle superiori; $\Delta T_c$: asse più caldo. $\alpha$ è il coefficiente di dilatazione termica del materiale e $h$ l’**Altezza** della sezione.

Trasversalmente all’asse (componenti z) e per $\Phi = 0$, nel nodo iniziale:

$$
\begin{array}{l|cc}
\text{Carico} & Z_{12} & M_{12} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & \dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(7q_1+3q_2)}{20} & \dfrac{L^2\,(3q_1+2q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,b^2\,(3a+b)}{L^3} & \dfrac{F_z\,a\,b^2}{L^2} \\[3ex]
M_y & -\dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,b\,(b-2a)}{L^2} \\[3ex]
\Delta T & 0 & \dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

Nel nodo finale:

$$
\begin{array}{l|cc}
\text{Carico} & Z_{21} & M_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & -\dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(3q_1+7q_2)}{20} & -\dfrac{L^2\,(2q_1+3q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,a^2\,(a+3b)}{L^3} & -\dfrac{F_z\,a^2\,b}{L^2} \\[3ex]
M_y & \dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,a\,(a-2b)}{L^2} \\[3ex]
\Delta T & 0 & -\dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

Lungo l’asse (componenti x), per qualsiasi $\Phi$:

$$
\begin{array}{l|cc}
\text{Carico} & X_{12} & X_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_x & -\dfrac{q_x L}{2} & -\dfrac{q_x L}{2} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(2q_1+q_2)}{6} & -\dfrac{L\,(q_1+2q_2)}{6} \\[3ex]
F_x & -\dfrac{F_x\,b}{L} & -\dfrac{F_x\,a}{L} \\[3ex]
\Delta T_c & EA\,\alpha\,\Delta T_c & -EA\,\alpha\,\Delta T_c
\end{array}
$$

::callout{type="details" title="Forze di incastro perfetto con deformazione a taglio"}
Il carico uniforme e il carico termico danno le stesse forze di incastro perfetto per qualsiasi $\Phi$. Per gli altri carichi, con $D = 1 + \Phi$ e $\Delta q = q_2 - q_1$ (componenti z):

$$
\begin{aligned}
&\text{Carico trapezoidale:} \\
Z_{12} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(9+10\Phi)}{60\,D}, \\[1ex]
M_{12} &= \frac{q_1 L^2}{12} + \frac{\Delta q\,L^2\,(4+5\Phi)}{120\,D}, \\[1ex]
Z_{21} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(21+20\Phi)}{60\,D}, \\[1ex]
M_{21} &= -\frac{q_1 L^2}{12} - \frac{\Delta q\,L^2\,(6+5\Phi)}{120\,D}; \\[3ex]
&\text{Forza } F_z\text{:} \\
Z_{12} &= -\frac{F_z\,b\,(\Phi L^2 + 3ab + b^2)}{D\,L^3}, \\[1ex]
M_{12} &= \frac{F_z\,a\,b\,(\Phi L + 2b)}{2\,D\,L^2}, \\[1ex]
Z_{21} &= -\frac{F_z\,a\,(\Phi L^2 + a^2 + 3ab)}{D\,L^3}, \\[1ex]
M_{21} &= -\frac{F_z\,a\,b\,(\Phi L + 2a)}{2\,D\,L^2}; \\[3ex]
&\text{Momento } M_y\text{:} \\
Z_{12} &= -\frac{6\,a\,b\,M_y}{D\,L^3}, \qquad Z_{21} = \frac{6\,a\,b\,M_y}{D\,L^3}, \\[1ex]
M_{12} &= -\frac{M_y\,b\,(\Phi L - 2a + b)}{D\,L^2}, \\[1ex]
M_{21} &= -\frac{M_y\,a\,(\Phi L + a - 2b)}{D\,L^2}.
\end{aligned}
$$

Sono le soluzioni esatte di un’asta di Timoshenko incastrata alle due estremità, come lo è lo spostamento che il solutore aggiunge tra i nodi per ciascun carico.
::

In un elemento con cerniere, il solutore condensa le forze di incastro perfetto in $\mathbf{f}^{*}_\mathrm{fix}$, come in [Cerniere di estremità](#end-hinges). Un carico uniforme su un elemento con una cerniera nel nodo finale, per esempio, dà $Z_{12} = -5q_zL/8$, $M_{12} = q_zL^2/8$, $Z_{21} = -3q_zL/8$ e $M_{21} = 0$ (per $\Phi = 0$): le forze di incastro perfetto di una trave incastrata-appoggiata.

Dopo la soluzione, le forze interne lungo l’elemento si ricavano dalle sue forze di estremità e dall’equilibrio del carico che vi agisce, la freccia dalle funzioni di forma più la freccia del carico sull’elemento incastrato alle due estremità: vedi [Risultati lungo le aste](/it/elements/analysis#results-along-the-members).

## Matrice di trasformazione {#transformation-matrix}

Un elemento inclinato dell’angolo $\theta$, misurato dall’asse x globale verso l’asse z globale (in senso orario sullo schermo), ha

$$
c = \cos\theta = \frac{x_2 - x_1}{L}, \qquad s = \sin\theta = \frac{z_2 - z_1}{L},
$$

e i suoi spostamenti di estremità locali si ottengono da quelli globali come $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, con

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 & 0 & 0 \\
 -s & c & 0 & 0 & 0 & 0 \\
 0 & 0 & 1 & 0 & 0 & 0 \\
 0 & 0 & 0 & c & s & 0 \\
 0 & 0 & 0 & -s & c & 0 \\
 0 & 0 & 0 & 0 & 0 & 1
\end{bmatrix}.
$$

Le rotazioni sono uguali nei due sistemi. Se un nodo ha un **Angolo LCS nodale** $\beta$ (un [vincolo inclinato](/it/essentials/nodes-supports#inclined-skewed-supports)), le sue incognite $\mathbf{d}_n$ sono espresse nei suoi assi, ruotati di $\beta$ dall’asse x globale verso l’asse z globale. Le loro componenti globali sono

$$
\mathbf{d}_g = \mathbf{T}_n\,\mathbf{d}_n, \qquad
\mathbf{T}_n = \begin{bmatrix} \cos\beta & -\sin\beta & 0 \\ \sin\beta & \cos\beta & 0 \\ 0 & 0 & 1 \end{bmatrix}
$$

per i tre GdL di quel nodo. Il solutore moltiplica $\mathbf{T}$ a destra per la matrice diagonale a blocchi formata dalle $\mathbf{T}_n$ dei due nodi di estremità (l’identità per un nodo senza assi propri), così l’elemento si collega a ciascun nodo negli assi di quel nodo.

## Matrice di rigidezza globale {#global-stiffness-matrix}

In assi globali, la matrice di rigidezza e i carichi nodali equivalenti dell’elemento sono

$$
\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T},
\qquad
\mathbf{f}_{\mathrm{eq},g} = \mathbf{T}^\mathsf{T}\,\mathbf{f}_\mathrm{eq},
$$

con $\mathbf{K}_l$ e $\mathbf{f}_\mathrm{eq}$ già condensati se l’elemento ha cerniere. È proprio $\mathbf{K}_g$ che la finestra **Matrice di rigidezza** mostra per un elemento (la apri dalla tabella *Elementi* o dal menu contestuale dell’elemento), in unità SI: N/m, N e N·m. La pagina [Come EduBeam risolve un modello](/it/elements/analysis) assembla queste matrici e risolve a mano un piccolo esempio.
