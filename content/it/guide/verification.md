---
description: "EduBeam e le formule dei manuali: travi, una travatura, temperatura, un cedimento e dove la trave di Timoshenko differisce da quella di Eulero–Bernoulli."
source: site
---

# Verificare i risultati a mano

Non fidarti mai di un numero che non sai riprodurre almeno a grandi linee. Questa pagina risolve a mano i casi classici dei manuali e li confronta con [EduBeam]{.edubeam}, che coincide in tutte le cifre riportate. Le tabelle riportano cinque cifre significative, come la scheda *Risultati* dell’app; le etichette delle figure sono arrotondate a quattro. Ogni figura è calcolata al momento nel tuo browser; **Apri in EduBeam** carica lo stesso modello nell’app, dove puoi leggere le tabelle, cambiare un valore e vedere che cosa succede.

::div{.chips}
- [Trave semplicemente appoggiata](#simply-supported-beam-uniform-load)
- [Mensola](#cantilever-tip-load)
- [Trave doppiamente incastrata](#fixed–fixed-beam-uniform-load)
- [Trave incastrata-appoggiata](#propped-cantilever-uniform-load)
- [Travatura a due aste](#two-bar-truss)
- [Carico termico](#temperature-gradient-on-a-simply-supported-beam)
- [Cedimento vincolare](#prescribed-displacement)
- [Deformazione a taglio](#shear-deformation)
::

Per strutture complete svolte dall’inizio alla fine, vedi i tutorial sul [telaio a tre cerniere](/it/tutorials/three-hinged-frame) e sulla [travatura reticolare piana](/it/tutorials/truss). Per nuovi esercizi da risolvere a mano, con le risposte verificate mentre le inserisci, prova la pagina [Esercizi di statica](/it/practice).

## La sezione usata in questa pagina {#the-section-used-here}

Salvo indicazione contraria, tutti i casi usano la trave in acciaio degli esempi dell’app: $E = 210$ GPa e $I_y = 8356$ cm⁴ (una IPE 300), quindi

$$
EI = 210 \times 10^9 \cdot 8{,}356 \times 10^{-5} = 17\,547{,}6\ \text{kNm}^2
$$

L’area ($A = 1$ m²) e il coefficiente di taglio ($k = 10^{32}$) sono così grandi che la deformazione assiale e quella a taglio si annullano, e i risultati seguono esattamente le formule di Eulero–Bernoulli del tuo libro di testo.

::callout{type="info" title="Le travi di EduBeam sono travi di Timoshenko"}
Con una sezione reale, ad esempio una presa dalla libreria sezioni, le aste si deformano anche a taglio. Le frecce risultano allora leggermente maggiori di quelle date dalle formule di Eulero–Bernoulli, e in una struttura iperstatica cambiano leggermente anche le forze interne. La sezione [Deformazione a taglio](#shear-deformation) in fondo a questa pagina mostra di quanto, e come escluderla.
::

Nella scheda *Risultati* spostamenti e rotazioni seguono gli [assi globali](/it/elements/conventions#global-axes): un D<sub>z</sub> positivo è verso il basso, una R<sub>y</sub> positiva è antioraria, e gli spostamenti sono in metri, a meno che tu non cambi l’unità nelle [Impostazioni](/it/essentials/units-settings).

## Trave semplicemente appoggiata, carico uniforme {#simply-supported-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, cerniera in A e carrello in B. Il nodo C in mezzeria permette di leggere lì la freccia; dividere un’asta con un nodo non cambia alcun risultato.

::model-figure{caption="Trave semplicemente appoggiata, 12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Grandezza | Formula | Valore |
| --- | --- | --- |
| Reazioni | $qL/2$ | 36 kN |
| Taglio sugli appoggi | $\pm qL/2$ | +36 kN in A, −36 kN in B |
| Momento in mezzeria | $qL^2/8$ | 54 kNm |
| Rotazione in A | $qL^3/(24EI)$ | 0,0061547 rad, oraria |
| Freccia in C | $5qL^4/(384EI)$ | 11,540 mm, verso il basso |

EduBeam mostra gli stessi valori. Nella scheda *Risultati* il nodo A ha R<sub>y</sub> = −0,0061547 rad (negativa: oraria) e il nodo C ha D<sub>z</sub> = 0,01154 m (positivo: verso il basso).

## Mensola, carico all’estremità {#cantilever-tip-load}

$L = 4$ m, incastro in A, $F = 18$ kN verso il basso all’estremità libera B.

::model-figure{caption="Mensola, 18 kN all’estremità"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Grandezza | Formula | Valore |
| --- | --- | --- |
| Reazione verticale | $F$ | 18 kN |
| Momento d’incastro | $FL$ | 72 kNm, negativo: M = −72 kNm |
| Rotazione all’estremità | $FL^2/(2EI)$ | 0,0082063 rad, oraria |
| Freccia all’estremità | $FL^3/(3EI)$ | 21,883 mm, verso il basso |

Nella scheda *Risultati* il nodo B ha R<sub>y</sub> = −0,0082063 rad e D<sub>z</sub> = 0,021883 m.

## Trave doppiamente incastrata, carico uniforme {#fixed–fixed-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, entrambe le estremità incastrate. Questa trave è iperstatica, quindi la soluzione dipende dalla rigidezza; le formule vengono dalla condizione di congruenza, cioè che entrambe le rotazioni di estremità siano nulle.

::model-figure{caption="Trave doppiamente incastrata, 12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Grandezza | Formula | Valore |
| --- | --- | --- |
| Reazioni | $qL/2$ | 36 kN |
| Momenti d’incastro | $qL^2/12$ | 36 kNm, negativo: M = −36 kNm |
| Momento in mezzeria | $qL^2/24$ | 18 kNm, positivo |
| Freccia in C | $qL^4/(384EI)$ | 2,3080 mm, verso il basso |

Incastrare le estremità solleva l’intero diagramma del momento di $qL^2/12$: la differenza totale tra appoggio e mezzeria resta $qL^2/8 = 54$ kNm, come nella trave semplicemente appoggiata. Per vederlo nell’app, parti dal modello della trave appoggiata e cambia entrambi i vincoli in **Incastro**.

## Trave incastrata-appoggiata, carico uniforme {#propped-cantilever-uniform-load}

$L = 6$ m, $q = 12$ kN/m, incastro in A e carrello in B.

::model-figure{caption="Trave incastrata-appoggiata, 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Grandezza | Formula | Valore |
| --- | --- | --- |
| Reazione all’incastro | $5qL/8$ | 45 kN |
| Reazione al carrello | $3qL/8$ | 27 kN |
| Momento d’incastro | $qL^2/8$ | 54 kNm, negativo: M = −54 kNm |
| Momento positivo massimo | $9qL^2/128$ | 30,375 kNm |
| … dove $V = 0$ | $x = 5L/8$ | a 3,75 m da A |
| Rotazione in B | $qL^3/(48EI)$ | 0,0030773 rad, antioraria |

EduBeam indica il valore di ogni estremo di un diagramma, quindi il massimo positivo compare nel punto in cui si trova. Per trovarne la posizione, guarda dove il taglio si annulla: $V(x) = 45 - 12x = 0$ dà $x = 3{,}75$ m.

## Travatura a due aste {#two-bar-truss}

Due aste salgono dalle cerniere in A $(0, 0)$ e B $(4, 0)$ fino al vertice C $(2, -2)$, 2 m più in alto. Ciascuna asta ha una cerniera a entrambe le estremità (**cerniere di estremità**), quindi le aste lavorano solo a sforzo normale. In C agisce un carico verticale $F = 20$ kN verso il basso.

::model-figure{caption="Travatura a due aste, 20 kN nel vertice"}
---
nodes: { A: [0, 0], C: [2, -2], B: [4, 0] }
supports: { A: pin, B: pin }
members: [{ nodes: [A, C], hinges: [true, true] }, { nodes: [C, B], hinges: [true, true] }]
loads:
  - { node: C, fz: 20 }
results: [N]
show: [nodeLabels]
---
::

Ogni asta è inclinata di 45°. L’equilibrio alla traslazione verticale del nodo C, con le due aste che per simmetria portano lo stesso sforzo, dà:

$$
\begin{aligned}
2N \sin 45^\circ + F &= 0 \\
N = -\frac{F}{\sqrt{2}} &= -14{,}142\ \text{kN}
\end{aligned}
$$

Entrambe le aste sono **compresse**. Ogni vincolo assorbe 10 kN in verticale e 10 kN in orizzontale, diretti verso l’interno: le aste spingono i vincoli verso l’esterno. Il diagramma **N (x)** e le reazioni mostrano lo stesso.

## Gradiente termico su una trave semplicemente appoggiata {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m, $h = 0{,}3$ m, $\alpha = 12 \times 10^{-6}$ 1/K. La faccia superiore si riscalda di 5 K e quella inferiore si raffredda di 5 K, quindi $\Delta T_b - \Delta T_t = -10$ K e l’asse mantiene la sua temperatura ($\Delta T_c = 0$). Una trave semplicemente appoggiata è libera di incurvarsi, quindi **non nascono forze interne**, ma solo una curvatura:

$$
\begin{aligned}
\kappa &= \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} \\
&= \frac{12 \times 10^{-6} \cdot (-10)}{0{,}3} = -4 \times 10^{-4}\ \text{m}^{-1}
\end{aligned}
$$

Le fibre superiori si allungano e quelle inferiori si accorciano, quindi la trave si inarca **verso l’alto**:

::model-figure{caption="Faccia superiore 10 K più calda di quella inferiore: la trave si inarca di 3,2 mm verso l’alto, senza forze interne"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [w]
show: [nodeLabels]
section: { h: 0.3 }
---
::

| Grandezza | Formula | Valore |
| --- | --- | --- |
| Freccia in C | $\kappa L^2/8$ | 3,2 mm, verso l’alto: D<sub>z</sub> = −0,0032 m |
| Rotazione in A | $\kappa L/2$ | 0,0016 rad, antioraria |
| Momento flettente |  | 0 |

Una variazione termica uniforme $\Delta T_c$ allungherebbe soltanto la trave, cosa che il carrello consente: nemmeno questa genera forze interne.

Ora blocca la rotazione a entrambe le estremità (un **Incastro** in A e un **Pattino** in B, che lascia ancora allungare la trave). La curvatura è impedita, e al suo posto nasce un momento costante lungo tutta la campata:

$$
\begin{aligned}
M &= -EI\kappa \\
&= -17\,547{,}6 \cdot (-4 \times 10^{-4}) = 7{,}019\ \text{kNm}
\end{aligned}
$$

È positivo: le fibre superiori vorrebbero allungarsi ma ne sono impedite, quindi risultano compresse.

::model-figure{caption="La stessa trave con entrambe le rotazioni bloccate: un momento costante di 7,019 kNm"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: fixed, B: slider }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [M]
show: [nodeLabels]
section: { h: 0.3 }
---
::

I carichi termici si inseriscono come descritto nella pagina [Carichi](/it/essentials/loads#temperature-load); l’altezza $h$ si imposta tra le proprietà della [sezione](/it/essentials/elements#cross-sections).

## Cedimento vincolare {#prescribed-displacement}

Prendi la [trave incastrata-appoggiata](#propped-cantilever-uniform-load) senza carico e fai cedere il carrello in B di $w = 10$ mm. In EduBeam è uno **spostamento imposto** D<sub>z</sub> = 0,01 m in B. Per seguirlo, il carrello deve tirare verso il basso l’estremità della mensola, e questo inflette la trave:

::model-figure{caption="Trave incastrata-appoggiata, B cede di 10 mm: il carrello tira verso il basso con 2,437 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

| Grandezza | Formula | Valore |
| --- | --- | --- |
| Forza nel carrello | $R = 3EIw/L^3$ | 2,4372 kN, tira verso il basso |
| Momento d’incastro | $RL$ | 14,623 kNm, negativo: M = −14,623 kNm |
| Rotazione in B | $3w/(2L)$ | 0,0025 rad, oraria |

A differenza di un carico, un cedimento genera forze solo dove la struttura vi si oppone: qui, più la trave è rigida, più $R$ è grande. Una trave semplicemente appoggiata seguirebbe lo stesso cedimento come un corpo rigido, senza alcuna forza.

Rimetti il carico di 12 kN/m e, per la sovrapposizione degli effetti, i risultati si sommano: l’incastro assorbe ora $45 + 2{,}4372 = 47{,}437$ kN e $54 + 14{,}623 = 68{,}623$ kNm, il carrello $27 - 2{,}4372 = 24{,}563$ kN. Come inserire un cedimento è descritto nella pagina [Carichi](/it/essentials/loads#prescribed-displacements-support-settlements).

## Deformazione a taglio {#shear-deformation}

Gli elementi trave di EduBeam sono travi di **Timoshenko**: oltre alla freccia flessionale hanno una freccia dovuta al taglio, la cui entità dipende dalla rigidezza a taglio $kGA$ della sezione. Che cosa cambia dipende dalla struttura:

- **Isostatica**: reazioni e forze interne derivano dal solo equilibrio, quindi restano esattamente quelle di prima. Crescono solo gli spostamenti. In una trave semplicemente appoggiata e in una mensola restano invariate anche le rotazioni delle sezioni; altrove, ad esempio all’estremità di uno sbalzo, cambiano anch’esse di poco.
- **Iperstatica**: le forze interne dipendono dalla rigidezza, quindi cambiano anch’esse leggermente.

### Una trave semplicemente appoggiata {#shear-simply-supported}

La trave dell’[Avvio rapido](/it/guide/quick-start#_8-check-by-hand) mostra di quanto. È la trave semplicemente appoggiata vista sopra, con una sezione reale, la **IPE 200 (appross.)** della libreria sezioni: $I_y = 1943$ cm⁴, $A = 28{,}48$ cm² e un coefficiente di taglio $k = 0{,}3933$ (la quota dell’area che spetta all’anima), con $G = 81$ GPa. Quindi $EI = 4080{,}3$ kNm² e $kGA = 90\,720$ kN.

| Grandezza | Formula | Valore |
| --- | --- | --- |
| Rotazione all’estremità | $qL^3/(24EI)$ | 0,026469 rad |
| Freccia in mezzeria, flessione | $5qL^4/(384EI)$ | 49,629 mm |
| Freccia in mezzeria, taglio | $qL^2/(8kGA)$ | 0,59524 mm |
| Freccia in mezzeria, totale | somma | 50,224 mm, come mostra EduBeam |

Il contributo del taglio è l’1,2 % del totale. La rotazione all’estremità è quella di Eulero–Bernoulli, come le reazioni e i momenti.

### Una mensola: aste corte {#shear-cantilever}

In una mensola con un carico $F$ all’estremità, la freccia all’estremità vale $FL^3/(3EI)$ per flessione e $FL/(kGA)$ per taglio. Il loro rapporto è

$$
\frac{\text{taglio}}{\text{flessione}} = \frac{3EI}{kGA\,L^2}
$$

Con la stessa IPE 200 vale lo 0,84 % per una mensola di 4 m, ma il 13,5 % per una di 1 m: la deformazione a taglio conta nelle aste corte e alte.

### Una trave incastrata-appoggiata: cambiano le forze {#shear-propped-cantilever}

La [trave incastrata-appoggiata](#propped-cantilever-uniform-load) realizzata con la IPE 200 è iperstatica, e ora il carrello porta un po’ di più. Con $\beta = 3EI/(kGA\,L^2) = 0{,}0037481$ per $L = 6$ m, la congruenza nel carrello dà

$$
R_B = \frac{3qL}{8} \cdot \frac{1 + 4\beta/3}{1 + \beta} = 27{,}034\ \text{kN}
$$

invece di 27 kN, e il momento d’incastro scende da 54 a $qL^2/2 - R_B L = 53{,}798$ kNm. Qui la differenza è piccola, ma cresce con $\beta$, cioè nelle aste corte e alte.

### Confronto con Eulero–Bernoulli {#shear-switch-off}

Per confrontare con le formule di Eulero–Bernoulli, imposta il **Coefficiente di taglio** della sezione a un valore molto grande, ad esempio `1e10`. Il contributo del taglio scompare e tutti i casi di questa pagina tornano a coincidere. La formulazione dell’elemento è nella pagina [Elemento trave](/it/elements/beam) del manuale teorico.

## Consigli per le tue verifiche {#tips-for-your-own-checks}

- Tieni d’occhio l’**indicatore delle unità** in basso a destra nella vista: la maggior parte delle discrepanze nasce da un errore di unità.
- Leggi i valori esatti nella scheda **Risultati** e nei tooltip al passaggio del mouse, non nelle etichette dei diagrammi. **Esporta CSV** o **Copia** ti danno anche le reazioni, pronte per un foglio di calcolo. Vedi [Risultati e diagrammi](/it/essentials/results#results-tab).
- Imposta **Formato dei numeri** su *Automatico* nelle Impostazioni per leggere `40` invece di `4 · 10¹`.
- Usa la finestra **Matrice di rigidezza** per confrontare un singolo elemento con la pagina [Elemento trave](/it/elements/beam) del manuale teorico mentre studi il metodo diretto della rigidezza.
- Usa **Condividi modello** per passare un modello verificato a un collega o al docente.
- Per verificare molti casi in una volta, o per generare esercizi con soluzioni note, usa lo stesso solutore dal codice: [@edubeam/fem](/it/solver) è la libreria che calcola ogni numero dell’app.
