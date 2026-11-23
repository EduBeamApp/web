---
description: "Bara de grindă cu zăbrele în EduBeam: un element de bară articulat la ambele capete, de ce este exact elementul clasic de grindă cu zăbrele, matricele lui de rigiditate și de transformare."
source: site
---

# Elementul de bară articulată

O bară de grindă cu zăbrele preia doar forță axială. EduBeam nu are un element separat pentru grinzi cu zăbrele: o astfel de bară este un [element de bară](/ro/elements/beam) cu **ambele articulații la capete** bifate. Această pagină arată de ce este exact elementul clasic de grindă cu zăbrele cu două noduri, dă matricele lui de rigiditate și de transformare și explică ce poate face o bară articulată, dar nu poate face o bară de grindă cu zăbrele din manual.

::model-figure{caption="Toate barele sunt articulate la ambele capete: căpriorii preiau N = −7,071 kN, tirantul +5 kN și nicio bară nu se încovoaie"}
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

Ca să modelezi o grindă cu zăbrele în aplicație, bifează **Articulație la început** și **Articulație la sfârșit** pentru fiecare bară sau bifează-le pe amândouă în banda de sus înainte să desenezi barele cu mouse-ul ([articulații la capete](/ro/essentials/elements#end-hinges)). Tutorialul [Grindă cu zăbrele plană](/ro/tutorials/truss) construiește una pas cu pas.

## Grade de libertate {#degrees-of-freedom}

O bară de grindă cu zăbrele lucrează cu cele două translații de la fiecare capăt, în [axele ei locale](/ro/elements/conventions#element-local-axes):

::element-sketch{mode="dofs" :hinges='[true,true]' :rotations='false' caption="O bară de grindă cu zăbrele: articulată la ambele capete, cu două translații la fiecare"}
::

| Direcție | Nodul inițial (1) | Nodul final (2) |
| --- | --- | --- |
| după x local | $u_1$ și `X12` | $u_2$ și `X21` |
| după z local | $w_1$ și `Z12` | $w_2$ și `Z21` |

$$
\mathbf{d}_l = \begin{bmatrix} u_1 & w_1 & u_2 & w_2 \end{bmatrix}^\mathsf{T}.
$$

Nodurile își păstrează rotirea `Ry`, pentru că fiecare bară este un element de bară, dar o bară articulată la ambele capete nici nu o simte, nici nu o transmite: momentele ei de la capete `M12` și `M21` sunt întotdeauna zero. Într-un nod în care toate barele sunt articulate, nimic nu blochează această rotire. Programul o lasă egală cu zero, dar un moment nodal aplicat într-un astfel de nod nu are pe ce să acționeze și oprește calculul cu mesajul *Structura este un mecanism: matricea de rigiditate este singulară.*

## Matricea de rigiditate locală {#local-stiffness-matrix}

$$
\mathbf{K}_l = \frac{EA}{L}
\begin{bmatrix}
 1 & 0 & -1 & 0 \\
 0 & 0 & 0 & 0 \\
 -1 & 0 & 1 & 0 \\
 0 & 0 & 0 & 0
\end{bmatrix},
$$

unde $E$ este modulul de elasticitate longitudinal, $A$ aria secțiunii transversale și $L$ lungimea. Doar alungirea barei necesită energie de deformație, deci forța axială a unei bare fără încărcări pe element este constantă:

$$
N = \frac{EA}{L}\,(u_2 - u_1).
$$

### De ce o bară cu două articulații este o bară de grindă cu zăbrele {#why-a-beam-with-two-hinges-is-a-truss-bar}

Condensează ambele rotiri de la capete din [matricea de rigiditate a barei](/ro/elements/beam#local-stiffness-matrix), ca la orice [articulație la capăt](/ro/elements/beam#end-hinges). Termenii axiali nu implică rotiri și rămân neschimbați. Termenii de încovoiere dispar complet: odată ce ambele rotiri sunt libere, orice pereche de deplasări de la capete $w_1$, $w_2$ doar rotește bara ca un corp rigid în jurul articulațiilor, ceea ce nu necesită energie. Programul face această condensare numeric, pentru orice coeficient de forfecare, și obține matricea de mai sus până la erorile de rotunjire.

::callout{type="details" title="Condensarea, pas cu pas"}
Pentru partea de încovoiere, ordonează gradele de libertate în păstrate, $a = (w_1, w_2)$, și eliberate, $b = (\varphi_1, \varphi_2)$. Din matricea barei, cu $k_1$ până la $k_4$ și parametrul de forfecare $\Phi$ definite [acolo](/ro/elements/beam#local-stiffness-matrix),

$$
\begin{aligned}
\mathbf{K}_{aa} &= k_1 \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{ab} &= k_2 \begin{bmatrix} -1 & -1 \\ 1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{bb} &= \begin{bmatrix} k_3 & k_4 \\ k_4 & k_3 \end{bmatrix}.
\end{aligned}
$$

Deoarece $\mathbf{K}_{ab}$ are două coloane egale, contează doar suma elementelor lui $\mathbf{K}_{bb}^{-1}$, care este $2/(k_3 + k_4)$:

$$
\mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}
= \frac{2\,k_2^2}{k_3 + k_4} \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}.
$$

Cu $k_3 + k_4 = 6EI_y / ((1+\Phi)L)$, factorul este $\dfrac{12\,EI_y}{(1+\Phi)L^3} = k_1$, deci aceasta este exact $\mathbf{K}_{aa}$, iar rigiditatea la încovoiere condensată $\mathbf{K}_{aa} - \mathbf{K}_{ab}\mathbf{K}_{bb}^{-1}\mathbf{K}_{ba}$ este zero.
::

## Matricea de transformare {#transformation-matrix}

Pentru o bară cu unghiul $\theta$ de la axa globală x spre axa globală z, cu $c = \cos\theta = (x_2 - x_1)/L$ și $s = \sin\theta = (z_2 - z_1)/L$, deplasările locale sunt $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, cu

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 \\
 -s & c & 0 & 0 \\
 0 & 0 & c & s \\
 0 & 0 & -s & c
\end{bmatrix}:
$$

adică rândurile și coloanele de translație din [matricea de transformare a barei](/ro/elements/beam#transformation-matrix). Atenție la semnul lui $s$ când z este orientată în jos: căpriorul A → C al grinzii cu zăbrele de mai sus urcă, deci $z_2 - z_1 = -3$ m, $c = 0{,}7071$ și $s = -0{,}7071$.

## Matricea de rigiditate globală {#global-stiffness-matrix}

Prin efectuarea produsului, $\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T}$ devine

$$
\mathbf{K}_g = \frac{EA}{L}
\begin{bmatrix}
 c^2 & cs & -c^2 & -cs \\
 cs & s^2 & -cs & -s^2 \\
 -c^2 & -cs & c^2 & cs \\
 -cs & -s^2 & cs & s^2
\end{bmatrix}.
$$

Fereastra **Matrice de rigiditate** a unei bare articulate arată aceste valori în rândurile și coloanele de translație și zerouri pentru rotiri.

## Ce face în plus o bară articulată față de o bară de grindă cu zăbrele {#where-a-hinged-beam-does-more}

Pentru că o bară de grindă cu zăbrele din EduBeam este tot un element de bară, ea poate face două lucruri pe care o bară de grindă cu zăbrele din manual nu le poate face:

- **Preia încărcări în lungul ei.** O încărcare distribuită pe o bară, de exemplu greutatea ei proprie, încovoaie bara între noduri ca pe o grindă simplu rezemată și transmite $qL/2$ fiecărui nod. Celelalte bare preiau forțele axiale ale grinzii cu zăbrele sub aceste încărcări nodale. În bara încărcată, componenta încărcării în lungul barei face ca $N$ să varieze liniar, iar forța din grinda cu zăbrele este valoarea de la jumătatea lungimii.
- **Se combină cu grinzi.** Un cadru poate conține bare articulate, de exemplu un tirant sau o diagonală de contravântuire, fără vreun tip special de element.

Adaugă 5 kN/m pe tirantul grinzii cu zăbrele de mai sus:

::model-figure{caption="Aceeași grindă cu zăbrele cu 5 kN/m pe tirant: forțele axiale nu se schimbă, iar tirantul se încovoaie cu M = qL²/8 = 22,5 kNm"}
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

Verificarea de mână: în C, echilibrul pe verticală $2\,N \sin 45^\circ + 10 = 0$ dă $N = -7{,}071$ kN în fiecare căprior. În A, componenta orizontală a căpriorului, $7{,}071 \cos 45^\circ = 5$ kN, este echilibrată de tirant, care este întins cu $N = +5$ kN. Încărcarea de pe tirant ajunge direct în reazemele de la capetele lui: adaugă $qL/2 = 15$ kN la fiecare reacțiune, dar nimic la forțele axiale.

O grindă cu zăbrele trebuie să fie stabilă ca structură cu noduri articulate. De exemplu, un panou pătrat fără diagonală este un mecanism: EduBeam numește articulațiile și arată mișcarea ([depanare](/ro/reference/troubleshooting#no-results-are-drawn)).
