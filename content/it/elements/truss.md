---
description: "L’asta reticolare in EduBeam: un elemento trave incernierato alle due estremità, perché coincide con il classico elemento reticolare, rigidezza e trasformazione."
source: site
---

# Elemento reticolare

Un’asta reticolare porta solo sforzo normale. EduBeam non ha un elemento reticolare a parte: un’asta reticolare è un [elemento trave](/it/elements/beam) con **entrambe le cerniere di estremità** spuntate. Questa pagina mostra perché coincide esattamente con il classico elemento reticolare a due nodi, ne riporta la matrice di rigidezza e la matrice di trasformazione e spiega che cosa sa fare un’asta incernierata che l’asta reticolare dei libri di testo non sa fare.

::model-figure{caption="Tutte le aste incernierate alle due estremità: le aste inclinate portano N = −7,071 kN, il tirante +5 kN, e nessuna asta si inflette"}
---
nodes: { A: [0, 0], B: [6, 0], C: [3, -3] }
supports: { A: pin, B: roller }
members:
  - { nodes: [A, C], hinges: [true, true] }
  - { nodes: [C, B], hinges: [true, true] }
  - { nodes: [A, B], hinges: [true, true] }
loads:
  - { node: C, fz: 10 }
results: [N]
show: [nodeLabels]
---
::

Per modellare una travatura reticolare nell’app, spunta **Cerniera iniziale** e **Cerniera finale** per ogni asta, oppure spuntale entrambe nella fascia in alto prima di disegnare le aste con il mouse ([cerniere di estremità](/it/essentials/elements#end-hinges)). Il [tutorial sulla travatura reticolare piana](/it/tutorials/truss) ne costruisce una passo per passo.

## Gradi di libertà {#degrees-of-freedom}

Un’asta reticolare lavora con le due traslazioni di ciascuna estremità, nei suoi [assi locali](/it/elements/conventions#element-local-axes):

::element-sketch{mode="dofs" :hinges='[true,true]' :rotations='false' caption="Un’asta reticolare: incernierata alle due estremità, con due traslazioni in ciascuna"}
::

| Direzione | Nodo iniziale (1) | Nodo finale (2) |
| --- | --- | --- |
| lungo l’asse x locale | $u_1$ e `X12` | $u_2$ e `X21` |
| lungo l’asse z locale | $w_1$ e `Z12` | $w_2$ e `Z21` |

$$
\mathbf{d}_l = \begin{bmatrix} u_1 & w_1 & u_2 & w_2 \end{bmatrix}^\mathsf{T}.
$$

I nodi conservano la rotazione `Ry`, perché ogni asta è un elemento trave, ma un’asta incernierata alle due estremità non la avverte né la trasmette: i suoi momenti di estremità `M12` e `M21` sono sempre nulli. In un nodo in cui tutte le aste sono incernierate, nulla trattiene quella rotazione. Il solutore la lascia nulla, ma un momento nodale applicato in un nodo del genere non ha nulla su cui agire e interrompe il calcolo con il messaggio *La struttura è un meccanismo: la matrice di rigidezza è singolare.*

## Matrice di rigidezza locale {#local-stiffness-matrix}

$$
\mathbf{K}_l = \frac{EA}{L}
\begin{bmatrix}
 1 & 0 & -1 & 0 \\
 0 & 0 & 0 & 0 \\
 -1 & 0 & 1 & 0 \\
 0 & 0 & 0 & 0
\end{bmatrix},
$$

dove $E$ è il modulo elastico, $A$ l’area della sezione e $L$ la lunghezza. Solo l’allungamento dell’asta richiede energia, quindi lo sforzo normale di un’asta senza carichi sull’elemento è costante:

$$
N = \frac{EA}{L}\,(u_2 - u_1).
$$

### Perché una trave con due cerniere è un’asta reticolare {#why-a-beam-with-two-hinges-is-a-truss-bar}

Condensa entrambe le rotazioni di estremità dalla [matrice di rigidezza della trave](/it/elements/beam#local-stiffness-matrix), come per qualsiasi [cerniera di estremità](/it/elements/beam#end-hinges). I termini assiali non coinvolgono le rotazioni e restano invariati. I termini flessionali si annullano del tutto: una volta libere entrambe le rotazioni, qualsiasi coppia di spostamenti di estremità $w_1$, $w_2$ fa soltanto ruotare l’asta come un corpo rigido attorno alle cerniere, e questo non richiede energia. Il solutore esegue la condensazione numericamente, per qualsiasi coefficiente di taglio, e ottiene la matrice qui sopra a meno dell’errore di arrotondamento.

::callout{type="details" title="La condensazione, passo per passo"}
Per la parte flessionale, ordina i GdL in quelli che restano, $a = (w_1, w_2)$, e quelli svincolati, $b = (\varphi_1, \varphi_2)$. Dalla matrice della trave, con i coefficienti da $k_1$ a $k_4$ e il parametro di deformabilità a taglio $\Phi$ definiti [nella pagina dell’elemento trave](/it/elements/beam#local-stiffness-matrix), si ha

$$
\begin{aligned}
\mathbf{K}_{aa} &= k_1 \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{ab} &= k_2 \begin{bmatrix} -1 & -1 \\ 1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{bb} &= \begin{bmatrix} k_3 & k_4 \\ k_4 & k_3 \end{bmatrix}.
\end{aligned}
$$

Poiché $\mathbf{K}_{ab}$ ha due colonne uguali, conta solo la somma dei termini di $\mathbf{K}_{bb}^{-1}$, che vale $2/(k_3 + k_4)$:

$$
\mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}
= \frac{2\,k_2^2}{k_3 + k_4} \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}.
$$

Con $k_3 + k_4 = 6EI_y / ((1+\Phi)L)$ il fattore vale $\dfrac{12\,EI_y}{(1+\Phi)L^3} = k_1$, quindi il prodotto coincide esattamente con $\mathbf{K}_{aa}$ e la rigidezza flessionale condensata $\mathbf{K}_{aa} - \mathbf{K}_{ab}\mathbf{K}_{bb}^{-1}\mathbf{K}_{ba}$ è nulla.
::

## Matrice di trasformazione {#transformation-matrix}

Per un’asta inclinata dell’angolo $\theta$ dall’asse x globale verso l’asse z globale, con $c = \cos\theta = (x_2 - x_1)/L$ e $s = \sin\theta = (z_2 - z_1)/L$, gli spostamenti locali sono $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$ con

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 \\
 -s & c & 0 & 0 \\
 0 & 0 & c & s \\
 0 & 0 & -s & c
\end{bmatrix}:
$$

sono le righe e le colonne di traslazione della [matrice di trasformazione della trave](/it/elements/beam#transformation-matrix). Attenzione al segno di $s$, con z rivolto verso il basso: l’asta inclinata A → C della travatura qui sopra sale, quindi $z_2 - z_1 = -3$ m, $c = 0{,}7071$ e $s = -0{,}7071$.

## Matrice di rigidezza globale {#global-stiffness-matrix}

Svolgendo il prodotto $\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T}$ si ottiene

$$
\mathbf{K}_g = \frac{EA}{L}
\begin{bmatrix}
 c^2 & cs & -c^2 & -cs \\
 cs & s^2 & -cs & -s^2 \\
 -c^2 & -cs & c^2 & cs \\
 -cs & -s^2 & cs & s^2
\end{bmatrix}.
$$

La finestra **Matrice di rigidezza** di un’asta incernierata mostra questi valori nelle righe e nelle colonne di traslazione, e zeri in quelle delle rotazioni.

## Che cosa fa una trave incernierata in più di un’asta reticolare {#where-a-hinged-beam-does-more}

In EduBeam un’asta reticolare resta un elemento trave, quindi sa fare due cose che l’asta reticolare dei libri di testo non sa fare:

- **Portare carichi lungo la sua lunghezza.** Un carico distribuito su un’asta, come il peso proprio, inflette l’asta tra i suoi nodi come una trave semplicemente appoggiata e trasmette $qL/2$ a ciascun nodo. Le altre aste portano gli sforzi normali della travatura dovuti a questi carichi nodali. Nell’asta caricata, la componente del carico parallela all’asta fa variare $N$ linearmente, e lo sforzo che l’asta ha nella travatura è il suo valore a metà lunghezza.
- **Combinarsi con le travi.** Un telaio può contenere aste incernierate, come un tirante o una diagonale di controvento, senza alcun tipo di elemento speciale.

Aggiungi 5 kN/m sul tirante della travatura qui sopra:

::model-figure{caption="La stessa travatura con 5 kN/m sul tirante: gli sforzi normali non cambiano, e il tirante si inflette con M = qL²/8 = 22,5 kNm"}
---
nodes: { A: [0, 0], B: [6, 0], C: [3, -3] }
supports: { A: pin, B: roller }
members:
  - { nodes: [A, C], hinges: [true, true] }
  - { nodes: [C, B], hinges: [true, true] }
  - { nodes: [A, B], hinges: [true, true] }
loads:
  - { node: C, fz: 10 }
  - { member: 3, qz: 5 }
results: [M, N]
show: [nodeLabels]
---
::

La verifica a mano: nel nodo C, l’equilibrio alla traslazione verticale $2\,N \sin 45^\circ + 10 = 0$ dà $N = -7{,}071$ kN in ciascuna asta inclinata. Nel nodo A, la componente orizzontale dell’asta inclinata, $7{,}071 \cos 45^\circ = 5$ kN, è equilibrata dal tirante, teso con $N = +5$ kN. Il carico sul tirante va direttamente ai vincoli alle sue estremità: aggiunge $qL/2 = 15$ kN a ciascuna reazione, ma nulla agli sforzi normali.

Una travatura reticolare non deve essere labile come struttura a nodi incernierati. Un campo quadrato senza diagonale, per esempio, è un meccanismo: EduBeam indica le cerniere e mostra il moto ([Risoluzione dei problemi](/it/reference/troubleshooting#no-results-are-drawn)).
