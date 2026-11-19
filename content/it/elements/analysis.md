---
description: "Metodo diretto della rigidezza in EduBeam, svolto a mano su una trave incastrata-appoggiata: numerazione dei GdL, assemblaggio, vincoli, reazioni e risultati."
source: site
---

# Come EduBeam risolve un modello

Ogni volta che modifichi il modello, EduBeam lo risolve di nuovo con il **metodo diretto della rigidezza**, nel tuo browser, in pochi millisecondi. Questa pagina segue passo per passo il solutore [@edubeam/fem](/it/solver) su un piccolo esempio, così puoi riprodurre a mano ogni numero e capire perché puoi fidarti dei risultati.

L’esempio è una trave incastrata-appoggiata: un IPE 300 in acciaio, lungo 4 m, incastrato in A, su un carrello in B, con un carico di 10 kN/m. La sua rigidezza flessionale è $EI = 210 \text{ GPa} \times 8356 \text{ cm}^4 = 17\,548$ kNm² e, senza deformazione a taglio, le soluzioni classiche sono $M_A = -qL^2/8 = -20$ kNm, $R_B = 3qL/8 = 15$ kN e $\varphi_B = qL^3/(48EI)$.

::model-figure{caption="Trave incastrata-appoggiata, IPE 300, 10 kN/m: M = −20 kNm in A e +11,25 kNm a 2,5 m, reazioni 25 kN e 15 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
section: { a: 53.8e-4, iy: 8.356e-5, h: 0.3 }
results: [M, V, w]
show: [nodeLabels]
---
::

## Dal modello agli spostamenti {#from-model-to-displacements}

::div{.steps}
### Numerare i gradi di libertà {#number-the-degrees-of-freedom}

Ogni nodo riceve i GdL di cui hanno bisogno i suoi elementi. Tutti gli elementi sono [elementi trave](/it/elements/beam), quindi ogni nodo ha `Dx`, `Dz` e `Ry`. Il solutore numera prima i GdL **liberi** e poi quelli **vincolati**, nodo per nodo. Qui A è incastrato e B è trattenuto solo in verticale, quindi i GdL liberi sono due:

$$
\begin{gathered}
\mathbf{r} = \begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix},
\qquad
\mathbf{r}_u = \begin{bmatrix} u_B \\ \varphi_B \end{bmatrix}, \\[1ex]
\mathbf{r}_p = \begin{bmatrix} u_A & w_A & \varphi_A & w_B \end{bmatrix}^\mathsf{T}.
\end{gathered}
$$

$u$, $w$ e $\varphi$ sono gli spostamenti lungo x e z e la rotazione, come nella [tabella dei GdL](/it/elements/conventions#degrees-of-freedom). Ogni elemento conserva un **vettore di localizzazione**: le posizioni dei suoi sei GdL in $\mathbf{r}$. Contando da 1, i GdL della trave $(u_A, w_A, \varphi_A, u_B, w_B, \varphi_B)$ occupano le posizioni $(3, 4, 5, 1, 6, 2)$.

### Calcolare le matrici degli elementi {#compute-the-element-matrices}

Per ogni elemento il solutore costruisce la [matrice di rigidezza locale](/it/elements/beam#local-stiffness-matrix), condensa le eventuali [cerniere di estremità](/it/elements/beam#end-hinges) e la porta in assi globali, $\mathbf{K}_g = \mathbf{T}^\mathsf{T}\mathbf{K}_l\,\mathbf{T}$. Ogni carico sull’elemento diventa un insieme di [carichi nodali equivalenti](/it/elements/beam#element-loads), $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. La nostra trave è orizzontale, quindi $\mathbf{T}$ è la matrice identità, e il carico uniforme dà, in kN e kNm,

$$
\mathbf{f}_\mathrm{eq} = \begin{bmatrix} 0 \\[0.5ex] qL/2 \\[0.5ex] -qL^2/12 \\[0.5ex] 0 \\[0.5ex] qL/2 \\[0.5ex] qL^2/12 \end{bmatrix}
= \begin{bmatrix} 0 \\[0.5ex] 20 \\[0.5ex] -13{,}33 \\[0.5ex] 0 \\[0.5ex] 20 \\[0.5ex] 13{,}33 \end{bmatrix}.
$$

### Assemblare {#assemble}

La matrice di rigidezza globale $\mathbf{K}$ parte piena di zeri. Ogni elemento somma il suo termine $(i, j)$ nella riga e nella colonna che il suo vettore di localizzazione indica per $i$ e $j$: dove più elementi concorrono in un nodo, le loro rigidezze relative ai GdL di quel nodo si sommano. Il vettore dei carichi $\mathbf{F}$ raccoglie allo stesso modo i carichi nodali e i carichi nodali equivalenti. Gli spostamenti imposti (cedimenti vincolari) entrano in $\mathbf{r}_p$. Con l’ordine prima liberi, poi vincolati, il sistema si divide in blocchi:

$$
\begin{bmatrix} \mathbf{K}_{uu} & \mathbf{K}_{up} \\ \mathbf{K}_{pu} & \mathbf{K}_{pp} \end{bmatrix}
\begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix}
=
\begin{bmatrix} \mathbf{F}_u \\ \mathbf{F}_p + \mathbf{R} \end{bmatrix},
$$

dove $\mathbf{R}$ sono le reazioni incognite. Nell’esempio, in $\mathbf{K}_{uu}$ finiscono solo le righe e le colonne della trave relative all’estremità B:

$$
\begin{aligned}
\mathbf{K}_{uu} &= \begin{bmatrix} EA/L & 0 \\ 0 & 4EI/L \end{bmatrix} \\[1ex]
&= \begin{bmatrix} 282\,450 \text{ kN/m} & 0 \\ 0 & 17\,548 \text{ kNm} \end{bmatrix}, \\[1ex]
\mathbf{F}_u &= \begin{bmatrix} 0 \\ 13{,}33 \text{ kNm} \end{bmatrix}.
\end{aligned}
$$

### Applicare i vincoli e risolvere {#apply-the-supports-and-solve}

I vincoli non sono molle né numeri grandi sulla diagonale: il solutore separa semplicemente i GdL vincolati. Gli spostamenti liberi si ricavano da

$$
\mathbf{K}_{uu}\,\mathbf{r}_u = \mathbf{F}_u - \mathbf{K}_{up}\,\mathbf{r}_p,
$$

sistema che il solutore risolve con la fattorizzazione LU. Senza cedimenti $\mathbf{r}_p = \mathbf{0}$, e qui

$$
\varphi_B = \frac{13{,}33}{17\,548} = 7{,}598 \times 10^{-4} \text{ rad},
$$

che è il valore classico $qL^3/(48EI)$, e $u_B = 0$.

### Calcolare le reazioni {#compute-the-reactions}

Noti tutti gli spostamenti, le righe vincolate danno le reazioni, cioè le forze che i vincoli esercitano sulla struttura:

$$
\mathbf{R} = \mathbf{K}_{pu}\,\mathbf{r}_u + \mathbf{K}_{pp}\,\mathbf{r}_p - \mathbf{F}_p.
$$

Per $w_A$ la riga di $\mathbf{K}_{pu}$ contiene $-6EI/L^2$ nella colonna di $\varphi_B$, e $\mathbf{F}_p$ contiene $qL/2$:

$$
\begin{aligned}
R_{wA} &= -\frac{6EI}{L^2}\,\varphi_B - \frac{qL}{2} \\
&= -5 - 20 = -25 \text{ kN},
\end{aligned}
$$

cioè 25 kN verso l’alto (z punta verso il basso). Allo stesso modo $R_{\varphi A} = +20$ kNm e $R_{wB} = -15$ kN: i valori classici $qL^2/8$ e $3qL/8$.
::

## Risultati lungo le aste {#results-along-the-members}

Per ogni elemento, il solutore estrae da $\mathbf{r}$ i suoi spostamenti di estremità, li porta in assi locali, $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, e calcola le [forze di estremità](/it/elements/conventions#end-forces-element-results-table)

$$
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix}.
$$

Nell’esempio, $\mathbf{d}_l = [0,\ 0,\ 0,\ 0,\ 0,\ \varphi_B]^\mathsf{T}$ dà $Z_{12} = -25$ kN, $M_{12} = 20$ kNm, $Z_{21} = -15$ kN e $M_{21} = 0$.

Le forze interne in qualsiasi punto $x$ si ricavano poi dall’equilibrio del tratto di elemento compreso tra l’inizio e $x$: le forze all’inizio più il carico su quel tratto.

$$
\begin{aligned}
N(x) &= -X_{12} + N_q(x), \\
V(x) &= -Z_{12} + V_q(x), \\
M(x) &= -M_{12} - Z_{12}\,x + M_q(x),
\end{aligned}
$$

dove $N_q$, $V_q$ e $M_q$ derivano dai carichi su quel tratto. Per un carico uniforme $q_z$, un carico trapezoidale da $q_1$ a $q_2$ (con $\Delta q = q_2 - q_1$) e una forza $F_z$ o un momento $M_y$ alla distanza $a$, che agiscono solo per $x \ge a$:

$$
\begin{array}{l|cc}
\text{Carico} & V_q(x) & M_q(x) \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -q_z\,x & -\dfrac{q_z\,x^2}{2} \\[3ex]
q_1 \to q_2 & -q_1 x - \dfrac{\Delta q\,x^2}{2L} & -\dfrac{q_1 x^2}{2} - \dfrac{\Delta q\,x^3}{6L} \\[3ex]
F_z,\ M_y & -F_z & -F_z\,(x-a) - M_y
\end{array}
$$

$N_q$ si ottiene come $V_q$, con le componenti assiali $q_x$ e $F_x$ al posto di $q_z$ e $F_z$.

Nell’esempio, $M(x) = -20 + 25\,x - 5\,x^2$ kNm, massimo in $x = 2{,}5$ m con $11{,}25$ kNm $= 9qL^2/128$. Un carico termico non ha un termine proprio: agisce solo attraverso le forze di estremità.

La freccia è data dalle [funzioni di forma](/it/elements/beam#local-stiffness-matrix) moltiplicate per gli spostamenti di estremità, più la freccia del carico sull’elemento con entrambe le estremità incastrate. Un’estremità incernierata recupera prima la propria rotazione dalla [condensazione](/it/elements/beam#end-hinges). I diagrammi e la deformata sono proprio queste funzioni, valutate lungo ogni asta.

## Perché i risultati sono esatti {#exact}

Ogni passo descritto sopra è esatto per il modello che risolve:

- La rigidezza dell’elemento deriva dalla **soluzione esatta** di un’asta prismatica di Timoshenko, non da forme polinomiali ipotizzate, quindi è la vera rigidezza dell’asta.
- Le forze di incastro perfetto sono le soluzioni esatte dell’asta incastrata per ogni tipo di carico, quindi i carichi nodali equivalenti non perdono nulla.
- Di conseguenza gli spostamenti nodali sono esatti, e le forze interne tra i nodi derivano dall’equilibrio del carico effettivo, quindi sono esatte anch’esse.

Per questo EduBeam non ti chiede mai di infittire la discretizzazione: un elemento per asta dà lo stesso risultato di cento. I nodi servono solo dove cambia l’asta stessa: in un vincolo, in una cerniera, in un nodo d’angolo o dove cambia la sezione. Un carico concentrato tra due nodi può restare un carico sull’elemento. L’unico errore che rimane è quello di arrotondamento; le tabelle dei risultati mostrano come 0 i valori inferiori a $10^{-12}$ volte il valore più grande dello stesso tipo.

«Esatto» si riferisce al modello, che ha i suoi limiti:

::div{.limits}
- **Materiale elastico lineare** e **piccoli spostamenti**: l’equilibrio è scritto sulla configurazione indeformata, quindi non ci sono effetti del secondo ordine (P–Δ) né fenomeni di instabilità.
- **Aste rettilinee e prismatiche**: una sola sezione per elemento. Un’asta a sezione variabile va approssimata con più elementi.
- **Flessione solo nel piano x–z**: niente torsione e nessun comportamento fuori dal piano.
::

## Quando la struttura non sta in piedi {#mechanisms}

Una struttura che può muoversi senza deformarsi ha una matrice di rigidezza singolare e nessuna soluzione unica. EduBeam lo verifica prima di risolvere e controlla il risultato dopo:

1. **Prima della soluzione**, EduBeam controlla ogni parte connessa della struttura in base alla sola geometria. I vincoli devono impedire i tre moti rigidi di un corpo piano: meno di tre vincoli semplici significa solo che il modello non è finito (*La struttura va vincolata prima di poter essere risolta.*), mentre tre o più vincoli che le permettono comunque di traslare o ruotare, come carrelli paralleli, sono un errore. Poi controlla le cerniere: se le aste possono ruotare attorno a esse mantenendo ciascuna la propria lunghezza, la struttura è un meccanismo, ed EduBeam cerchia le cerniere e mostra il moto.
2. **Durante la soluzione**, una matrice esattamente singolare blocca la fattorizzazione LU: *La struttura è un meccanismo: la matrice di rigidezza è singolare.*
3. **Dopo la soluzione**, uno spostamento o una rotazione maggiore di $10^6$ m o rad significa che la matrice era singolare a meno dell’errore di arrotondamento. EduBeam indica i nodi e le direzioni che si muovono: *La struttura è labile: … si muove praticamente senza resistenza.* Qui finisce anche un modello con un materiale o una sezione inseriti come zero, o nell’unità sbagliata.

Una rotazione a cui non è collegato nulla, in un nodo in cui tutte le aste sono incernierate, non è un meccanismo: il solutore la lascia nulla. La pagina [Risoluzione dei problemi](/it/reference/troubleshooting#no-results-are-drawn) spiega ogni messaggio e come risolvere il problema.

## Esegui tu il solutore {#library}

Il solutore è open source: [@edubeam/fem](/it/solver), scritto in TypeScript, per il browser e Node. La stessa trave incastrata-appoggiata:

```ts
import { DofID, LinearStaticSolver, type Beam2D } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]

// Unità SI: m, N, Pa. Acciaio, IPE 300; con k = 1e32 la sezione non si deforma a taglio.
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // incastro
domain.createNode('B', [4, 0, 0], [DofID.Dz]) // carrello
domain.createBeam2D('1', ['A', 'B'], 1, 1)
lc.createBeamElementUniformEdgeLoad('1', [0, 10_000], true) // 10 kN/m, verso il basso

solver.solve()

solver.neq // 2: Dx e Ry di B sono liberi
lc.r.toArray() // [0, 0.0007598, 0, 0, 0, 0]: GdL liberi, poi vincolati
lc.R.toArray() // [0, -25000, 20000, -15000]: A (Dx, Dz, Ry), poi B (Dz)

const beam = domain.getElement('1') as Beam2D
beam.computeEndForces(lc).toArray() // [0, -25000, 20000, 0, -15000, 0]
beam.computeBendingMomentAt(lc, 0) // -20000: N·m, momento negativo all'incastro
beam.computeBendingMomentAt(lc, 2.5) // 11250: il massimo momento positivo
```

Dopo `solve()`, `solver.k` contiene la matrice assemblata $\mathbf{K}$ e `solver.f` il vettore dei carichi $\mathbf{F}$, da confrontare con il tuo assemblaggio. I passi di questa pagina si trovano in `Solver.ts` (numerazione), `LinearStaticSolver.ts` (assemblaggio, soluzione, reazioni) e `Beam2D.ts` (matrici degli elementi e risultati).

::div{.actions}
[Per iniziare con @edubeam/fem](/it/solver/getting-started) [Che cosa contiene](/it/solver/reference) [Sorgente su GitHub ↗](https://github.com/EduBeamApp/fem){target="_blank"}
::
