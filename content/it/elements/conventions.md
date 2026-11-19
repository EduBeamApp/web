---
description: "Convenzioni dei segni di EduBeam: x a destra, z in basso, carichi e spostamenti positivi, assi locali, N, V, M, forze di estremità, reazioni, opzione y in alto."
source: site
---

# Sistema di coordinate e convenzioni dei segni

Ogni numero che EduBeam mostra ha un segno. Questa pagina spiega che cosa significa *positivo* per coordinate, carichi, spostamenti, forze interne, forze di estremità e reazioni, così puoi confrontare l’app con i tuoi calcoli. La maggior parte dei risultati che sembrano sbagliati si rivela una questione di convenzione dei segni.

| Grandezza | Positivo |
| --- | --- |
| `x`, `Dx`, `Fx` | verso destra |
| `z`, `Dz`, `Fz` | **verso il basso** |
| `Ry`, `My` | antiorario sullo schermo |
| $N$ | trazione |
| $V$ | fa ruotare in senso orario un breve concio dell’asta |
| $M$ | momento positivo: fibre inferiori tese, dal lato della linea tratteggiata |
| Reazioni | la forza che il vincolo esercita sulla struttura, con il segno di un carico |

## Assi globali {#global-axes}

Il modello giace nel piano x–z:

- **x** è orizzontale, positivo verso **destra**.
- **z** è verticale, positivo **verso il basso**.
- **y** esce dallo schermo verso di te, e così la terna è destrorsa. Rotazioni e momenti sono attorno a y, quindi il **verso antiorario è positivo**.

Il simbolo degli assi nell’angolo dell’area di disegno mostra x in rosso e z in verde. Poiché z punta verso il basso, il nodo in sommità di una colonna di 3 m che parte da `Z = 0` ha `Z = −3`. Gli angoli, come quello di un vincolo inclinato, si misurano da x verso z, cioè in senso orario sullo schermo.

Se preferisci y verso l’alto, cambia la [convenzione di visualizzazione](#y-up-axes): il modello resta lo stesso, cambiano solo i numeri che leggi e digiti.

## Gradi di libertà {#degrees-of-freedom}

Ogni nodo ha tre gradi di libertà (GdL):

| GdL | Significato | Positivo | Unità |
| --- | --- | --- | --- |
| `Dx` | spostamento orizzontale | verso destra | m |
| `Dz` | spostamento verticale | verso il basso | m |
| `Ry` | rotazione | antiorario | rad |

Gli stessi segni valgono per gli [spostamenti imposti](/it/essentials/loads#prescribed-displacements-support-settlements), per la tabella *Risultati nodali* e per i valori che compaiono al passaggio del mouse su un nodo.

## Carichi {#loads}

I carichi sono positivi nel verso positivo degli assi. **Fx**, **Fz** e **My** sono le componenti di un carico nodale o concentrato, **fx** e **fz** quelle di un carico uniforme, e **f₁x**, **f₂x**, **f₁z**, **f₂z** quelle di un carico trapezoidale all’inizio e alla fine dell’elemento.

| Carico | Verso positivo |
| --- | --- |
| `Fx`, `fx`, `f₁x`, `f₂x` | +x, verso destra; lungo l’asse x locale dell’elemento se **LCS** è spuntato |
| `Fz`, `fz`, `f₁z`, `f₂z` | +z, **verso il basso**; lungo l’asse z locale dell’elemento se **LCS** è spuntato |
| `My` | antiorario |
| `ΔTc` | riscaldamento dell’asse dell’asta, che la allunga |
| `ΔTb − ΔTt` | fibre inferiori più calde di quelle superiori |

Un carico gravitazionale è quindi un `fz` **positivo**, e il vento che spinge verso destra la colonna di sinistra è un `fx` positivo. Un carico distribuito agisce sempre per metro di lunghezza propria dell’asta, anche quando è assegnato in assi globali su un’asta inclinata. La pagina [Carichi](/it/essentials/loads#element-loads) mostra come inserire ciascun tipo.

::model-figure{caption="Tutti i carichi della figura sono positivi: fz = 5 kN/m su A–B, Fz = 10 kN in B, My = 10 kNm in C e Fx = 10 kN in D"}
---
nodes: { A: [0, 0], B: [3, 0], C: [4.5, 0], D: [6, 0] }
supports: { A: fixed }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 5 }
  - { node: B, fz: 10 }
  - { node: C, my: 10 }
  - { node: D, fx: 10 }
results: []
reactions: false
show: [nodeLabels]
---
::

## Assi locali dell’elemento {#element-local-axes}

Ogni elemento ha i propri assi:

- l’**asse x locale** va dal nodo iniziale al nodo finale dell’elemento;
- l’**asse z locale** è l’asse x locale ruotato di 90° **in senso orario sullo schermo**, la stessa rotazione che porta l’asse x globale sull’asse z globale. Se percorri l’elemento dal nodo iniziale al nodo finale, l’asse z locale è alla tua destra.

| Elemento disegnato | L’asse z locale punta |
| --- | --- |
| da sinistra a destra | verso il basso: assi locali e globali coincidono |
| da destra a sinistra | verso l’alto |
| dal basso verso l’alto | verso destra |
| dall’alto verso il basso | verso sinistra |

La direzione dell’elemento è data dal suo angolo $\theta$, misurato dall’asse x globale verso l’asse z globale (in senso orario sullo schermo). La [matrice di trasformazione](/it/elements/beam#transformation-matrix) converte gli spostamenti di estremità da un sistema all’altro tramite $\cos\theta$ e $\sin\theta$.

Nella vista, una linea tratteggiata lungo ogni elemento indica il suo lato +z locale: le sue **fibre inferiori**. I carichi sull’elemento con **LCS** spuntato, la posizione di un carico concentrato e le forze di estremità seguono tutti gli assi locali. Per invertire il verso di un elemento, usa **Scambia nodi** nella tabella *Elementi* (vedi [verso dell’elemento](/it/essentials/elements#element-direction)).

## Forze interne {#internal-forces}

Taglia un’asta alla distanza $x$ dal nodo iniziale. Sulla faccia della parte **prima** del taglio, la cui normale uscente è diretta come +x locale, le forze interne (le caratteristiche della sollecitazione) sono positive quando sono dirette lungo +x locale, lungo +z locale e in senso antiorario. Sull’altra faccia agiscono in verso opposto.

::element-sketch{mode="internal-forces" caption="N, V e M positivi su un breve concio di un’asta: trazione, una coppia di forze di taglio che ruota in senso orario, fibre inferiori (quelle tratteggiate) tese"}
::

In parole:

| Grandezza | Positivo significa |
| --- | --- |
| $N$ | trazione |
| $V$ | fa ruotare in senso orario un breve concio dell’asta: per un’asta disegnata da sinistra a destra, è diretto verso l’alto sulla faccia sinistra del concio e verso il basso sulla faccia destra |
| $M$ | **momento positivo**: fibre inferiori tese, dal lato tratteggiato |

Molti testi italiani indicano il taglio con $T$; EduBeam usa $V$.

Con $q_x$ e $q_z$ il carico distribuito in assi locali, valgono le relazioni

$$
\frac{\mathrm{d}N}{\mathrm{d}x} = -q_x, \qquad \frac{\mathrm{d}V}{\mathrm{d}x} = -q_z, \qquad \frac{\mathrm{d}M}{\mathrm{d}x} = V.
$$

In corrispondenza di un carico concentrato $F_x$, $F_z$ o $M_y$ (in assi locali) presentano i salti $\Delta N = -F_x$, $\Delta V = -F_z$ e $\Delta M = -M_y$: una forza diretta lungo +z locale fa diminuire $V$, e un momento antiorario fa diminuire $M$.

Una trave semplicemente appoggiata sotto carico gravitazionale ha quindi momento positivo, taglio positivo sull’appoggio sinistro e negativo su quello destro. La trave qui sotto è anche tirata nel carrello, quindi il suo sforzo normale è positivo.

::model-figure{caption="Trave semplicemente appoggiata, 10 kN/m e una trazione di 20 kN: M = +45 kNm in mezzeria, V = +30 kN sull’appoggio sinistro e −30 kN su quello destro, N = +20 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
  - { node: B, fx: 20 }
results: [M, V, N]
---
::

In una mensola il momento cambia segno: è negativo, con le fibre superiori tese. Una spinta lungo l’asse la comprime.

::model-figure{caption="Mensola con 10 kN all’estremità libera e una spinta di 15 kN: M = −40 kNm all’incastro, V = +10 kN, N = −15 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 10 }
  - { member: 1, px: -15, at: 4 }
results: [M, V, N]
---
::

In un telaio, le fibre inferiori di ogni asta stanno dal suo lato +z locale, quindi l’ordine in cui disegni una colonna decide quale dei suoi lati è quello inferiore. Questo telaio è disegnato A → B → C → D, e l’asse z locale di ogni asta punta verso l’interno: un momento positivo significa trazione all’interno del telaio, e i momenti negativi ai nodi d’angolo significano trazione all’esterno.

::model-figure{caption="Telaio a portale disegnato A → B → C → D: l’asse z locale di tutte e tre le aste punta verso l’interno del telaio"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: pin, D: pin }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

I diagrammi sono disegnati come nella maggior parte dei corsi europei: $M$ dal lato teso, $N$ e $V$ positivi dal lato opposto alla linea tratteggiata. In **Impostazioni → Impostazioni della vista → Diagrammi delle forze interne** puoi disegnare $M$ dal lato compresso e $N$ o $V$ dal lato tratteggiato. Questo cambia il disegno, mai i valori: leggi il segno nell’etichetta, non dal lato del diagramma.

## Forze di estremità (tabella Risultati degli elementi) {#end-forces-element-results-table}

La tabella *Risultati degli elementi* riporta per ogni elemento sei **forze di estremità**, nei suoi assi **locali**:

::element-sketch{mode="end-forces" caption="Le sei forze di estremità, ciascuna disegnata nel verso positivo: lungo x e z locali e in senso antiorario"}
::

| Colonna | Agisce sull’elemento nel | Positivo lungo |
| --- | --- | --- |
| `X12`, `Z12`, `M12` | nodo iniziale | +x locale, +z locale, verso antiorario |
| `X21`, `Z21`, `M21` | nodo finale | +x locale, +z locale, verso antiorario |

Sono le forze che i nodi esercitano sull’elemento: la sua matrice di rigidezza moltiplicata per i suoi spostamenti di estremità, più le forze che tratterrebbero i suoi carichi sull’elemento se entrambe le estremità fossero incastrate,

$$
\begin{gathered}
\mathbf{f} = \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}, \\[1ex]
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix} = \mathbf{K}_l\,\mathbf{d}_l - \mathbf{f}_\mathrm{eq},
\end{gathered}
$$

dove $\mathbf{d}_l$ sono gli spostamenti di estremità dell’elemento in assi locali e $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$ i carichi nodali equivalenti dei suoi [carichi sull’elemento](/it/elements/beam#element-loads).

Le forze di estremità seguono gli assi, non la convenzione di $N$–$V$–$M$, quindi nel nodo iniziale hanno segno opposto:

$$
\begin{aligned}
N(0) &= -X_{12}, & N(L) &= X_{21}, \\
V(0) &= -Z_{12}, & V(L) &= Z_{21}, \\
M(0) &= -M_{12}, & M(L) &= M_{21}.
\end{aligned}
$$

Per la trave semplicemente appoggiata vista sopra: `X12 = −20 kN` e `X21 = +20 kN` (trazione), `Z12 = Z21 = −30 kN` (entrambi gli appoggi spingono verso l’alto, cioè verso −z) e `M12 = M21 = 0`.

In ogni nodo, le forze di estremità degli elementi che vi concorrono, riportate in assi globali, hanno per somma il carico nodale più la reazione. È un modo rapido per verificare l’equilibrio di un nodo.

## Reazioni {#reactions}

Una reazione è la forza o il momento che un vincolo esercita **sulla struttura**, una per ogni GdL vincolato. Ha il segno di un carico: è positiva lungo +x, lungo +z (verso il basso) e in senso antiorario. Un vincolo che porta un carico gravitazionale ha quindi un `Rz` **negativo**.

Le reazioni sono in assi globali, oppure negli assi propri del nodo se il nodo ha un **Angolo LCS nodale** (un [vincolo inclinato](/it/essentials/nodes-supports#inclined-skewed-supports)). Nella vista ogni reazione è una freccia orientata nel verso in cui spinge il vincolo, con l’etichetta del suo valore assoluto. I valori con il segno si trovano nell’esportazione CSV, come `Rx`, `Rz` e `My`.

## Assi con y verso l’alto {#y-up-axes}

**Impostazioni → Lingua e impostazioni locali → Sistema di coordinate → x a destra, y in alto** porta tutto ciò che digiti e leggi nel sistema dei libri di testo: **x** verso destra, **y** verso l’alto e **z** verso di te. Il modello, i file salvati e i disegni restano esattamente gli stessi; cambiano solo i numeri e le lettere:

| Grandezza | x a destra, z in basso (predefinito) | x a destra, y in alto |
| --- | --- | --- |
| Coordinata verticale | `Z` | `Y`, segno opposto |
| Carichi, spostamenti, reazioni e forze di estremità verticali | `Fz`, `fz`, `Dz`, `Rz`, `Z12`… | `Fy`, `fy`, `Dy`, `Ry`, `Y12`…, segno opposto |
| Rotazioni e momenti | `Ry`, `My` | `Rz`, `Mz`, stesso segno (positivo in senso antiorario) |
| Angolo del vincolo | misurato in senso orario | misurato in senso antiorario, segno opposto |
| Forze interne | $N$, $V$, $M$ | le stesse, con gli stessi segni, disegnate allo stesso modo |

Con y verso l’alto, quindi, un carico gravitazionale è un `fy` **negativo**, e la sommità di una colonna di 3 m ha `Y = 3`.

## Unità {#units}

Il solutore lavora sempre in SI: m, N, Pa, rad, e K per le variazioni di temperatura. Le unità di visualizzazione in [Unità e impostazioni](/it/essentials/units-settings) cambiano solo ciò che digiti e leggi, mai il modello.
