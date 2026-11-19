---
description: "Leggere i risultati di EduBeam: diagrammi di N, V e M, deformata, reazioni e segni, tooltip, tabelle, CSV, matrice di rigidezza e formato dei numeri."
source: site
---

# Risultati e diagrammi

[EduBeam]{.edubeam} risolve il modello dopo ogni modifica, quindi i diagrammi, le reazioni e le tabelle sullo schermo si riferiscono sempre al modello che vedi. Non c’è nessun pulsante *Calcola*. Se non compare nessun disegno, il modello non si può ancora risolvere: il messaggio in alto a sinistra nella vista dice perché, e la pagina [Risoluzione dei problemi](/it/reference/troubleshooting) li spiega tutti.

## Diagrammi nella vista {#overlays-in-the-viewer}

EduBeam disegna i risultati sopra il modello. Li attivi e disattivi nelle **opzioni di visualizzazione** in alto a destra nella vista; il pulsante ⚙ sopra di esse mostra o nasconde il pannello.

::model-figure{caption="Telaio a tre cerniere, 10 kN/m: passa da M a V, a N e alla deformata"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, V, N, w]
show: [nodeLabels]
height: 300
---
::

| Casella | Disegna | Colore | Attiva all’inizio |
| --- | --- | --- | --- |
| **Deformata** | la struttura deformata, amplificata in modo che si veda | grigio | sì |
| **N (x)** | lo sforzo normale | blu | |
| **V<sub>z</sub> (x)** | il taglio | verde | |
| **M<sub>y</sub> (x)** | il momento flettente | rosso | sì |
| **Reazioni** | una freccia e un valore per ogni direzione vincolata | viola | sì |

Una seconda riga controlla il disegno del modello: **Vincoli**, **Carichi**, **Etichette dei nodi** ed **Etichette degli elementi**. **Altre impostazioni** sotto il pannello apre le [impostazioni della vista](/it/essentials/units-settings#viewer-settings), dove imposti la dimensione dei diagrammi (*Scala dei risultati*), i colori, l’orientamento delle etichette e lo stile dei diagrammi.

I valori sono scritti dove servono: alle estremità di ogni asta, ai due lati di un salto sotto un carico concentrato o sopra un appoggio, e in ogni estremo del diagramma, come il vertice di una parabola dove $V = 0$. La figura qui sopra mostra il [telaio a tre cerniere](/it/tutorials/three-hinged-frame), che puoi verificare a mano: 40 kN di compressione in ciascuna colonna, 20 kN nella trave e −80 kNm in entrambi i nodi d’angolo. La vista *w* mostra la cerniera in C che si abbassa di 42,55 mm.

### Leggere il segno {#reading-the-sign}

Leggi il segno dal **valore**, non dal lato dell’asta su cui è disegnato il diagramma. Le convenzioni sono quelle della maggior parte dei testi:

| Risultato | Positivo significa |
| --- | --- |
| **N** | trazione |
| **V<sub>z</sub>** | fa ruotare in senso orario un piccolo tratto dell’asta. Poiché $V = \mathrm{d}M/\mathrm{d}x$, in una trave semplicemente appoggiata sotto carichi gravitazionali è positivo sull’appoggio di sinistra e negativo su quello di destra |
| **M<sub>y</sub>** | momento positivo: fibre inferiori tese, dal lato della **linea tratteggiata** disegnata lungo ogni asta |

Una trave appoggiata con sbalzo mostra entrambi i segni insieme. Tra gli appoggi il momento è positivo (+13,5 kNm); sull’appoggio di destra è negativo (−24 kNm), con le fibre superiori tese. Il taglio salta della reazione di 54 kN in B, da −30 a +24 kN:

::model-figure{caption="Trave appoggiata con sbalzo, 12 kN/m: momento positivo tra gli appoggi, negativo sull’appoggio B"}
---
nodes: { A: [0, 0], B: [4, 0], C: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

Per impostazione predefinita il momento flettente è disegnato dal **lato teso**, mentre lo sforzo normale e il taglio positivi dal lato opposto alla linea tratteggiata. Qui le scuole non sono tutte d’accordo, quindi ciascuno si può invertire in **Impostazioni → Impostazioni della vista → Diagrammi delle forze interne**, dove puoi anche tratteggiare i diagrammi come nei disegni a mano e scrivere su ogni tratto il grado del polinomio. Invertire un lato cambia solo il disegno, mai i valori. Le convenzioni dei segni complete, compresi gli assi locali dell’elemento, sono nel [manuale teorico](/it/elements/conventions#internal-forces).

## Tooltip al passaggio del mouse {#hover-tooltips}

Passa il mouse su un oggetto per leggerne i valori:

- **Nodo**: gli spostamenti $u_x$, $u_z$ (nell’unità di spostamento) e la rotazione $\varphi_y$ (in radianti).
- **Elemento**: la sua etichetta, la sezione e il materiale.
- **Carico**: le sue componenti.

Sullo schermo touch tocca invece l’oggetto: il suo pannello mostra gli stessi dati.

![Il puntatore sul nodo 2 della trave dell’Avvio rapido](/screenshots/it/ui-hover.webp){.shot-sm}

## Scheda Risultati {#results-tab}

La scheda **Risultati** nella barra inferiore contiene due tabelle, che si alternano con **Risultati nodali** e **Risultati degli elementi**.

### Risultati nodali {#nodal-results}

Una riga per nodo con gli spostamenti **D<sub>x</sub>** e **D<sub>z</sub>** (nell’unità di spostamento) e la rotazione **R<sub>y</sub>** (in radianti), negli assi globali: D<sub>z</sub> positivo è verso il basso e R<sub>y</sub> positivo è antiorario sullo schermo. Una direzione vincolata mostra 0, oppure il cedimento che hai imposto. Le reazioni non sono in questa tabella: leggile sul disegno o nell’[esportazione CSV](#export-csv-and-copy).

![Risultati nodali del telaio a tre cerniere qui sopra, con Formato dei numeri impostato su Automatico](/screenshots/it/p2c-results-nodal.webp){.shot-lg}

### Risultati degli elementi {#element-results}

Una riga per elemento con le sue **forze di estremità nel sistema di coordinate locale dell’elemento**:

| Colonna | Significato |
| --- | --- |
| X<sub>12</sub>, Z<sub>12</sub>, M<sub>12</sub> | forza assiale, forza di taglio e momento che agiscono sull’elemento nel suo nodo **iniziale** |
| X<sub>21</sub>, Z<sub>21</sub>, M<sub>21</sub> | le stesse nel nodo **finale** |

![Risultati degli elementi del telaio a tre cerniere: le forze di estremità delle sue quattro aste](/screenshots/it/p2c-results-element.webp)

Le forze di estremità sono le forze che i nodi esercitano sull’elemento. Seguono gli assi locali, non la convenzione N-V-M dei diagrammi, quindi i loro segni sono diversi:

- **Trave semplicemente appoggiata** (6 m, 12 kN/m, quella dell’[Avvio rapido](/it/guide/quick-start)): Z<sub>12</sub> = Z<sub>21</sub> = −36 kN. Entrambi gli appoggi spingono la trave verso l’alto, cioè verso −z.
- **Mensola** incastrata nel suo nodo iniziale, con 18 kN verso il basso all’estremità libera: Z<sub>12</sub> = −18 kN, M<sub>12</sub> = +72 kNm, Z<sub>21</sub> = +18 kN, M<sub>21</sub> = 0.
- **Colonna 1 del telaio** (A in basso, B in alto): X<sub>12</sub> = +40 kN spinge lungo l’asse x locale verso l’interno dell’elemento, cioè 40 kN di compressione.

Altri dettagli su questa tabella sono nel [manuale teorico](/it/elements/conventions#end-forces-element-results-table).

### Esporta CSV e Copia {#export-csv-and-copy}

**Esporta CSV** scarica `edubeam-results.csv` con entrambe le tabelle, nelle unità mostrate sullo schermo e pronto per un foglio di calcolo. **Copia** mette le stesse tabelle negli appunti come testo separato da tabulazioni, che si incolla direttamente in Excel, LibreOffice o Fogli Google.

| Tabella | Colonne |
| --- | --- |
| Nodi | Node, x, z, Dx, Dz, Ry e le **reazioni** Rx, Rz, My |
| Elementi | Element, Node 1, Node 2 e le forze di estremità N1, V1, M1, N2, V2, M2 |

Le intestazioni sono in inglese e ciascuna riporta la propria unità, ad esempio `Dz [mm]`. Le forze di estremità degli elementi sono gli stessi valori locali di X<sub>12</sub> … M<sub>21</sub> sullo schermo.

### Matrice di rigidezza {#stiffness-matrix}

Scegli **Matrice di rigidezza** nel pannello di un elemento, oppure con il pulsante nella sua riga della tabella *Elementi*, per aprire la matrice di rigidezza 6 × 6 dell’elemento in **coordinate globali** e in unità SI (N, m). È comoda per controllare un assemblaggio fatto a mano in un corso sul metodo degli spostamenti; le formule sono nel [manuale teorico](/it/elements/beam).

## Formato dei numeri {#number-format}

Le tabelle e i tooltip mostrano i risultati con cinque cifre significative. **Impostazioni → Lingua e impostazioni locali → Formato dei numeri** decide come vengono scritti:

| Formato | 40 000 si scrive | Usalo per |
| --- | --- | --- |
| **Scientifico** (predefinito) | 4 · 10⁴ | valori che spaziano su molti ordini di grandezza |
| **Ingegneristico** | 40 · 10³ | leggere direttamente i prefissi kilo e mega |
| **Automatico** | 40.000 | i numeri di tutti i giorni nella didattica |

*Automatico* scrive i valori da 0,001 fino a 100 000 come numeri semplici. Fuori da questo intervallo li scrive come *Ingegneristico*, con esponenti multipli di tre, ad esempio 380,95 · 10⁻⁹ nei risultati nodali qui sopra. Il separatore decimale segue la lingua.

Le etichette sul disegno (valori dei diagrammi e reazioni) hanno sempre due decimali, qualunque sia il formato dei numeri: 6,6667 kN diventa 6,67. Quando ti servono più cifre, leggi le tabelle o i tooltip.

## Precisione e accuratezza {#precision-and-accuracy}

- L’elemento trave è esatto per il modello lineare di Timoshenko sotto carichi nodali, uniformi, trapezoidali, concentrati e termici. I risultati **non** dipendono dal numero di elementi, e non c’è nessuna mesh da infittire.
- Il calcolo è in doppia precisione. Un valore più piccolo di 10⁻¹² volte il valore più grande dello stesso tipo è errore di arrotondamento, e le tabelle lo mostrano come 0.
- Le frecce includono la **deformazione a taglio**, che in una struttura iperstatica modifica leggermente anche le forze. Per aste snelle aggiunge una frazione di punto percentuale alla freccia di Eulero–Bernoulli; per aste corte e tozze può arrivare al dieci per cento o più. [Verificare i risultati a mano](/it/guide/verification#shear-deformation) mostra quanto vale e come escluderla per confrontare i risultati con le formule dei testi.

## Risultati in una relazione {#results-in-a-report}

- **☰ → Esporta immagine** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) salva il disegno in PNG o SVG con i diagrammi che scegli. Vedi [Esportare un’immagine](/it/essentials/import-export#export-an-image).
- **Esporta CSV** o **Copia** nella scheda *Risultati* forniscono i numeri.
- **Condividi modello** ti dà un link, così chi legge può aprire il modello stesso.
- Per dispense e fogli di esercizi, la libreria di disegno [@edubeam/plot](/it/plot) disegna gli stessi diagrammi a partire dal codice.
