---
description: "Metoda deplasărilor în formă matriceală, așa cum o aplică EduBeam, rezolvată de mână pe o grindă încastrată și simplu rezemată: numerotarea gradelor de libertate, asamblarea, reazemele, reacțiunile și eforturile în bare."
source: site
---

# Cum calculează EduBeam modelul

De fiecare dată când modifici modelul, EduBeam îl calculează din nou cu **metoda deplasărilor în formă matriceală (metoda rigidității directe)**, în browserul tău, în câteva milisecunde. Această pagină urmărește pas cu pas programul de calcul [@edubeam/fem](/ro/solver) pe un exemplu mic, ca să poți reproduce de mână fiecare număr și să știi de ce te poți baza pe rezultate.

Exemplul este o grindă încastrată și simplu rezemată: un profil IPE 300 din oțel, lung de 4 m, încastrat în A, cu reazem simplu în B, încărcat cu 10 kN/m. Rigiditatea lui este $EI = 210 \text{ GPa} \times 8356 \text{ cm}^4 = 17\,548$ kNm², iar fără deformația din forfecare răspunsurile din manual sunt $M_A = -qL^2/8 = -20$ kNm, $R_B = 3qL/8 = 15$ kN și $\varphi_B = qL^3/(48EI)$.

::model-figure{caption="Grindă încastrată și simplu rezemată, IPE 300, 10 kN/m: M = −20 kNm în A și +11,25 kNm la 2,5 m, reacțiuni de 25 kN și 15 kN"}
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

## De la model la deplasări {#from-model-to-displacements}

::div{.steps}
### Numerotează gradele de libertate {#number-the-degrees-of-freedom}

Fiecare nod primește gradele de libertate de care au nevoie elementele lui. Toate elementele sunt [elemente de bară](/ro/elements/beam), deci fiecare nod are `Dx`, `Dz` și `Ry`. Programul numerotează mai întâi gradele de libertate **libere** și după ele pe cele **blocate**, nod cu nod. Aici A este încastrat, iar B este blocat doar pe verticală, deci două grade de libertate sunt libere:

$$
\begin{gathered}
\mathbf{r} = \begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix},
\qquad
\mathbf{r}_u = \begin{bmatrix} u_B \\ \varphi_B \end{bmatrix}, \\[1ex]
\mathbf{r}_p = \begin{bmatrix} u_A & w_A & \varphi_A & w_B \end{bmatrix}^\mathsf{T}.
\end{gathered}
$$

$u$, $w$ și $\varphi$ sunt deplasările după x și z și rotirea, ca în [tabelul gradelor de libertate](/ro/elements/conventions#degrees-of-freedom). Fiecare element are un **vector de localizare**: pozițiile celor șase grade de libertate ale lui în $\mathbf{r}$. Numărând de la 1, gradele de libertate ale barei $(u_A, w_A, \varphi_A, u_B, w_B, \varphi_B)$ se află pe pozițiile $(3, 4, 5, 1, 6, 2)$.

### Calculează matricele elementelor {#compute-the-element-matrices}

Pentru fiecare element, programul construiește [matricea de rigiditate locală](/ro/elements/beam#local-stiffness-matrix), condensează eventualele [articulații la capete](/ro/elements/beam#end-hinges) și o trece în axe globale, $\mathbf{K}_g = \mathbf{T}^\mathsf{T}\mathbf{K}_l\,\mathbf{T}$. Fiecare încărcare pe element devine [încărcări nodale echivalente](/ro/elements/beam#element-loads), $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. Grinda noastră este orizontală, deci $\mathbf{T}$ este matricea unitate, iar încărcarea uniform distribuită dă, în kN și kNm,

$$
\mathbf{f}_\mathrm{eq} = \begin{bmatrix} 0 \\[0.5ex] qL/2 \\[0.5ex] -qL^2/12 \\[0.5ex] 0 \\[0.5ex] qL/2 \\[0.5ex] qL^2/12 \end{bmatrix}
= \begin{bmatrix} 0 \\[0.5ex] 20 \\[0.5ex] -13{,}33 \\[0.5ex] 0 \\[0.5ex] 20 \\[0.5ex] 13{,}33 \end{bmatrix}.
$$

### Asamblează {#assemble}

Matricea de rigiditate globală $\mathbf{K}$ este la început nulă. Fiecare element adaugă termenul său $(i, j)$ în rândul și coloana pe care vectorul de localizare le indică pentru $i$ și $j$, așa că acolo unde mai multe elemente se întâlnesc într-un nod, rigiditățile lor pentru gradele de libertate ale acelui nod se însumează. Vectorul încărcărilor $\mathbf{F}$ adună în același fel încărcările nodale și încărcările nodale echivalente. Deplasările impuse (cedările de reazem) intră în $\mathbf{r}_p$. Cu ordinea libere, apoi blocate, sistemul se împarte în blocuri:

$$
\begin{bmatrix} \mathbf{K}_{uu} & \mathbf{K}_{up} \\ \mathbf{K}_{pu} & \mathbf{K}_{pp} \end{bmatrix}
\begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix}
=
\begin{bmatrix} \mathbf{F}_u \\ \mathbf{F}_p + \mathbf{R} \end{bmatrix},
$$

unde $\mathbf{R}$ sunt reacțiunile necunoscute. În exemplu, doar rândurile și coloanele capătului B al barei ajung în $\mathbf{K}_{uu}$:

$$
\begin{aligned}
\mathbf{K}_{uu} &= \begin{bmatrix} EA/L & 0 \\ 0 & 4EI/L \end{bmatrix} \\[1ex]
&= \begin{bmatrix} 282\,450 \text{ kN/m} & 0 \\ 0 & 17\,548 \text{ kNm} \end{bmatrix}, \\[1ex]
\mathbf{F}_u &= \begin{bmatrix} 0 \\ 13{,}33 \text{ kNm} \end{bmatrix}.
\end{aligned}
$$

### Aplică reazemele și rezolvă {#apply-the-supports-and-solve}

Reazemele nu sunt modelate prin resorturi și nici prin numere mari pe diagonală: gradele de libertate blocate sunt pur și simplu separate. Deplasările libere rezultă din

$$
\mathbf{K}_{uu}\,\mathbf{r}_u = \mathbf{F}_u - \mathbf{K}_{up}\,\mathbf{r}_p,
$$

sistem rezolvat prin descompunere LU. Fără cedări de reazem, $\mathbf{r}_p = \mathbf{0}$, iar aici

$$
\varphi_B = \frac{13{,}33}{17\,548} = 7{,}598 \times 10^{-4} \text{ rad},
$$

adică $qL^3/(48EI)$ din manual, iar $u_B = 0$.

### Calculează reacțiunile {#compute-the-reactions}

Când toate deplasările sunt cunoscute, rândurile gradelor de libertate blocate dau reacțiunile, adică forțele cu care reazemele acționează asupra structurii:

$$
\mathbf{R} = \mathbf{K}_{pu}\,\mathbf{r}_u + \mathbf{K}_{pp}\,\mathbf{r}_p - \mathbf{F}_p.
$$

Pentru $w_A$, rândul din $\mathbf{K}_{pu}$ conține $-6EI/L^2$ în dreptul lui $\varphi_B$, iar $\mathbf{F}_p$ conține $qL/2$:

$$
\begin{aligned}
R_{wA} &= -\frac{6EI}{L^2}\,\varphi_B - \frac{qL}{2} \\
&= -5 - 20 = -25 \text{ kN},
\end{aligned}
$$

adică 25 kN în sus (z este orientată în jos). La fel, $R_{\varphi A} = +20$ kNm și $R_{wB} = -15$ kN: valorile $qL^2/8$ și $3qL/8$ din manual.
::

## Rezultate în lungul barelor {#results-along-the-members}

Pentru fiecare element, programul ia deplasările de la capete din $\mathbf{r}$, le trece în axe locale, $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, și calculează [forțele de la capete](/ro/elements/conventions#end-forces-element-results-table)

$$
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix}.
$$

Pentru exemplu, $\mathbf{d}_l = [0,\ 0,\ 0,\ 0,\ 0,\ \varphi_B]^\mathsf{T}$ dă $Z_{12} = -25$ kN, $M_{12} = 20$ kNm, $Z_{21} = -15$ kN și $M_{21} = 0$.

Eforturile în orice punct $x$ rezultă apoi din echilibrul porțiunii de element dintre începutul lui și $x$: forțele de la început plus încărcarea de pe acea porțiune.

$$
\begin{aligned}
N(x) &= -X_{12} + N_q(x), \\
V(x) &= -Z_{12} + V_q(x), \\
M(x) &= -M_{12} - Z_{12}\,x + M_q(x),
\end{aligned}
$$

unde $N_q$, $V_q$ și $M_q$ provin din încărcările de pe acea porțiune. Pentru o încărcare uniform distribuită $q_z$, o încărcare trapezoidală de la $q_1$ la $q_2$ (cu $\Delta q = q_2 - q_1$) și o forță $F_z$ sau un moment $M_y$ la distanța $a$, care acționează doar pentru $x \ge a$:

$$
\begin{array}{l|cc}
\text{Încărcare} & V_q(x) & M_q(x) \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -q_z\,x & -\dfrac{q_z\,x^2}{2} \\[3ex]
q_1 \to q_2 & -q_1 x - \dfrac{\Delta q\,x^2}{2L} & -\dfrac{q_1 x^2}{2} - \dfrac{\Delta q\,x^3}{6L} \\[3ex]
F_z,\ M_y & -F_z & -F_z\,(x-a) - M_y
\end{array}
$$

$N_q$ este $V_q$ cu componentele axiale $q_x$ și $F_x$ în locul lui $q_z$ și $F_z$.

Pentru exemplu, $M(x) = -20 + 25\,x - 5\,x^2$ kNm, maxim la $x = 2{,}5$ m, cu valoarea $11{,}25$ kNm $= 9qL^2/128$. Variația de temperatură nu are un termen propriu: acționează doar prin forțele de la capete.

Săgeata este produsul dintre [funcțiile de formă](/ro/elements/beam#local-stiffness-matrix) și deplasările de la capete, plus săgeata încărcării de pe element cu ambele capete încastrate. Un capăt articulat își primește mai întâi înapoi propria rotire din [condensare](/ro/elements/beam#end-hinges). Diagramele și deformata sunt aceste funcții, evaluate în lungul fiecărei bare.

## De ce rezultatele sunt exacte {#exact}

Fiecare pas de mai sus este exact pentru modelul pe care îl rezolvă:

- Rigiditatea elementului provine din **soluția exactă** a unei bare prismatice Timoshenko, nu din forme polinomiale presupuse, deci este rigiditatea reală a barei.
- Forțele de încastrare perfectă sunt soluțiile exacte pentru bara dublu încastrată, pentru fiecare tip de încărcare, deci încărcările nodale echivalente nu pierd nimic.
- Deplasările nodurilor sunt prin urmare exacte, iar eforturile dintre noduri provin din echilibrul încărcării reale, deci sunt și ele exacte.

De aceea EduBeam nu îți cere niciodată să rafinezi o rețea de discretizare: un element pe bară dă același răspuns ca o sută. Nodurile sunt necesare doar acolo unde se schimbă bara însăși: la un reazem, la o articulație, la un colț sau la o schimbare de secțiune. O forță concentrată între ele poate rămâne o încărcare pe element. Singura eroare rămasă este cea de rotunjire; tabelele de rezultate arată ca 0 valorile mai mici de $10^{-12}$ ori cea mai mare valoare de același fel.

„Exact” se referă la model, care are limitele lui:

::div{.limits}
- **Material liniar elastic** și **deplasări mici**: echilibrul se scrie pe forma nedeformată, deci nu există efecte de ordinul al doilea (P–Δ) și nici flambaj.
- **Bare drepte, prismatice**: o singură secțiune transversală pe element. O bară cu secțiune variabilă trebuie aproximată prin mai multe elemente.
- **Încovoiere doar în planul x–z**: fără torsiune și fără comportare în afara planului.
::

## Când structura nu se poate menține {#mechanisms}

O structură care se poate mișca fără să se deformeze are matricea de rigiditate singulară și nu are o soluție unică. EduBeam verifică acest lucru înainte de calcul, iar după calcul controlează rezultatul:

1. **Înainte de calcul**, fiecare parte conexă a structurii este verificată doar pe baza geometriei. Reazemele ei trebuie să împiedice cele trei mișcări de corp rigid ale unui corp plan: mai puțin de trei legături înseamnă că modelul pur și simplu nu este terminat (*Structura are nevoie de reazeme înainte de a putea fi calculată.*), în timp ce trei sau mai multe legături care totuși o lasă să lunece sau să se rotească, de exemplu reazeme simple paralele, reprezintă o eroare. Apoi se verifică articulațiile: dacă barele se pot roti în jurul lor în timp ce fiecare bară își păstrează lungimea, structura este un mecanism, iar EduBeam încercuiește articulațiile și arată mișcarea.
2. **În timpul calculului**, o matrice exact singulară oprește descompunerea LU: *Structura este un mecanism: matricea de rigiditate este singulară.*
3. **După calcul**, o deplasare sau o rotire mai mare de $10^6$ m sau rad înseamnă că matricea era singulară, până la erorile de rotunjire. EduBeam numește nodurile și direcțiile care se mișcă: *Structura este instabilă: … se deplasează practic fără rezistență.* Tot aici ajunge și un material sau o secțiune introduse cu valoarea zero sau în unitatea greșită.

O rotire de care nu este legat nimic, într-un nod în care toate barele sunt articulate, nu este un mecanism: programul o lasă egală cu zero. [Depanare](/ro/reference/troubleshooting#no-results-are-drawn) explică fiecare mesaj și cum rezolvi problema.

## Rulează singur programul de calcul {#library}

Programul de calcul are cod sursă deschis: [@edubeam/fem](/ro/solver), în TypeScript, pentru browser și Node. Aceeași grindă încastrată și simplu rezemată:

```ts
import { DofID, LinearStaticSolver, type Beam2D } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]

// Unități SI: m, N, Pa. Oțel, IPE 300; k = 1e32 face secțiunea rigidă la forfecare.
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // încastrare
domain.createNode('B', [4, 0, 0], [DofID.Dz]) // reazem simplu
domain.createBeam2D('1', ['A', 'B'], 1, 1)
lc.createBeamElementUniformEdgeLoad('1', [0, 10_000], true) // 10 kN/m, în jos

solver.solve()

solver.neq // 2: Dx și Ry ale nodului B sunt libere
lc.r.toArray() // [0, 0.0007598, 0, 0, 0, 0]: gradele de libertate libere, apoi cele blocate
lc.R.toArray() // [0, -25000, 20000, -15000]: A (Dx, Dz, Ry), apoi B (Dz)

const beam = domain.getElement('1') as Beam2D
beam.computeEndForces(lc).toArray() // [0, -25000, 20000, 0, -15000, 0]
beam.computeBendingMomentAt(lc, 0) // -20000: N·m, moment negativ în încastrare
beam.computeBendingMomentAt(lc, 2.5) // 11250: cel mai mare moment pozitiv
```

După `solve()`, `solver.k` conține matricea asamblată $\mathbf{K}$, iar `solver.f` vectorul încărcărilor $\mathbf{F}$, ca să le compari cu propria asamblare. Pașii de pe această pagină se află în `Solver.ts` (numerotarea), `LinearStaticSolver.ts` (asamblarea, rezolvarea, reacțiunile) și `Beam2D.ts` (matricele elementului și rezultatele).

::div{.actions}
[Primii pași cu @edubeam/fem](/ro/solver/getting-started) [Referință API](/ro/solver/reference) [Codul sursă pe GitHub ↗](https://github.com/EduBeamApp/fem){target="_blank"}
::
