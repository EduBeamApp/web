---
description: "Elementul de bară Timoshenko cu două noduri din EduBeam: matricea de rigiditate exactă, deformația din forfecare, articulații prin condensare statică, forțe de încastrare perfectă, transformare."
source: site
---

# Elementul de bară

Fiecare bară din EduBeam, fie că este grindă, stâlp sau bară de grindă cu zăbrele, este același element: o **bară Timoshenko** dreaptă, cu două noduri, în planul x–z, cu secțiune transversală constantă. Această pagină prezintă formularea lui exact așa cum o calculează programul, ca să poți reface de mână orice matrice de element sau vector de încărcare și să-l compari cu aplicația. Semnele sunt cele din [Axe și convenții de semne](/ro/elements/conventions), codul este `Beam2D.ts` din [@edubeam/fem](/ro/solver), iar [Cum calculează EduBeam modelul](/ro/elements/analysis) arată cum se combină elementele într-o soluție.

## Grade de libertate {#degrees-of-freedom}

Fiecare nod are trei grade de libertate, deci elementul are șase. În [axele locale](/ro/elements/conventions#element-local-axes) ale elementului, fiecărei deplasări de la capăt îi corespunde o [forță la capăt](/ro/elements/conventions#end-forces-element-results-table), adică o coloană din tabelul *Rezultate pe elemente*:

::element-sketch{mode="dofs" caption="Cele șase grade de libertate ale elementului de bară, fiecare desenat pozitiv; linia punctată marchează fibra inferioară (+z local)"}
::

| Direcție | Nodul inițial (1) | Nodul final (2) |
| --- | --- | --- |
| după x local | $u_1$ și `X12` | $u_2$ și `X21` |
| după z local, în jos la un element desenat de la stânga la dreapta | $w_1$ și `Z12` | $w_2$ și `Z21` |
| rotire, în sens antiorar | $\varphi_1$ și `M12` | $\varphi_2$ și `M21` |

În această ordine formează vectorii deplasărilor și forțelor elementului:

$$
\begin{aligned}
\mathbf{d}_l &= \begin{bmatrix} u_1 & w_1 & \varphi_1 & u_2 & w_2 & \varphi_2 \end{bmatrix}^\mathsf{T}, \\
\mathbf{f} &= \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}.
\end{aligned}
$$

Deoarece z este orientată în jos, iar rotirile sunt pozitive în sens antiorar, axa unei bare fără deformație din forfecare se rotește cu $\varphi = -\,\mathrm{d}w/\mathrm{d}x$.

## Matricea de rigiditate locală {#local-stiffness-matrix}

Forțele de la capete ale unui element fără încărcări pe element sunt $\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l$, cu

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

și

$$
\begin{aligned}
k_N &= \frac{EA}{L}, & k_1 &= \frac{12\,EI_y}{(1+\Phi)\,L^3}, \\[1ex]
k_2 &= \frac{6\,EI_y}{(1+\Phi)\,L^2}, & k_3 &= \frac{(4+\Phi)\,EI_y}{(1+\Phi)\,L}, \\[1ex]
k_4 &= \frac{(2-\Phi)\,EI_y}{(1+\Phi)\,L}, & \Phi &= \frac{12\,EI_y}{k\,GA\,L^2}.
\end{aligned}
$$

$E$ și $G$ sunt modulul de elasticitate longitudinal și cel transversal ale materialului, $A$ aria, $I_y$ momentul de inerție față de y, $k$ **Coeficientul de forfecare** al secțiunii transversale, iar $L$ lungimea elementului. $\Phi$ este **parametrul de forfecare**: măsoară cât de deformabilă la forfecare este bara în comparație cu încovoierea și crește pe măsură ce bara devine scurtă și înaltă. Cu $\Phi = 0$, termenii devin binecunoscuții $12EI/L^3$, $6EI/L^2$, $4EI/L$ și $2EI/L$ ai barei Euler–Bernoulli. Comportarea axială și cea la încovoiere sunt decuplate: $u_1$ și $u_2$ intervin doar împreună cu $k_N$.

Manualele cu y în sus scriu $+6EI/L^2$ acolo unde această matrice are $-k_2$. Ambele descriu aceeași rigiditate; diferă doar sensul deplasării transversale.

::callout{type="details" title="De unde vine matricea: funcțiile de formă exacte"}
Pentru o bară prismatică Timoshenko fără încărcare, ecuațiile de echilibru au o soluție exactă: $u$ liniară în $x$, $w$ cubică și $\varphi$ pătratică. Exprimată prin deplasările de la capete, cu $\xi = x/L$, săgeata este

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

Pentru $\Phi = 0$ acestea sunt polinoamele Hermite cubice, $N_1 = 1 - 3\xi^2 + 2\xi^3$ și $N_2 = -L\,\xi(1-\xi)^2$, unde semnul minus provine din $\varphi = -w'$. Matricea de rigiditate conține forțele de la capete necesare acestor forme exacte, deci este rigiditatea exactă a barei, nu o aproximație care se îmbunătățește cu mai multe elemente. Programul desenează deformata cu aceleași funcții.
::

## Deformația din forfecare: Timoshenko sau Euler–Bernoulli? {#timoshenko-or-euler-bernoulli}

Dacă elementul se deformează din forfecare depinde doar de $\Phi$, deci de coeficientul de forfecare $k$ al secțiunii: $kA$ este aria care preia forfecarea. Fiecare tip de secțiune pornește cu propriul $k$:

| Secțiune transversală | Coeficientul de forfecare $k$ |
| --- | --- |
| Modelul inițial și exemplele incluse | $10^{32}$, ceea ce face $\Phi \approx 0$: Euler–Bernoulli |
| Profile I, H și cu tălpi late din bibliotecă | $h\,t_w / A$: inima preia forfecarea |
| Țevi rectangulare din bibliotecă | $2\,h\,t / A$: cei doi pereți laterali |
| Dreptunghiuri și pătrate din bibliotecă | 0,833 |
| Cercuri din bibliotecă | 0,9 |
| Țevi rotunde din bibliotecă | 0,5 |
| Secțiuni poligonale | inițial 0,833 |
| Fereastra **Adaugă secțiune** | inițial 1 |

La o bară zveltă diferența este mică. Sub o încărcare uniform distribuită, forfecarea adaugă $0{,}8\,\Phi$ la săgeata din încovoiere de la mijlocul deschiderii unei grinzi simplu rezemate. La un IPE 200 din oțel, asta înseamnă 1,2 % pentru o deschidere de 6 m, dar 11 % pentru 2 m. Ca să dezactivezi deformația din forfecare, dă-i lui $k$ o valoare foarte mare, de exemplu `1e32`. Dacă nu se precizează altfel, figurile interactive de pe acest site folosesc secțiunea din exemple, rigidă la forfecare, deci coincid cu calculele de mână după teoria Euler–Bernoulli. Figura de mai jos este o excepție:

::model-figure{caption="IPE 200 cu deschiderea de 2 m și k = h·tw/A = 0,393: w = 0,5657 mm la mijlocul deschiderii, cu 11 % mai mult decât 0,5106 mm după teoria Euler–Bernoulli (Φ = 0,135)"}
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

## Articulații la capete {#end-hinges}

O [articulație la capăt](/ro/essentials/elements#end-hinges) bifată anulează momentul de la acel capăt al elementului. Rotirea capătului elementului devine astfel liberă, iar programul o elimină prin **condensare statică**. Împarte cele șase grade de libertate în cele păstrate, $a$, și rotirile eliberate de la capete, $b$:

$$
\begin{bmatrix} \mathbf{f}_a \\ \mathbf{0} \end{bmatrix}
=
\begin{bmatrix} \mathbf{K}_{aa} & \mathbf{K}_{ab} \\ \mathbf{K}_{ba} & \mathbf{K}_{bb} \end{bmatrix}
\begin{bmatrix} \mathbf{d}_a \\ \mathbf{d}_b \end{bmatrix}
+
\begin{bmatrix} \mathbf{f}_{\mathrm{fix},a} \\ \mathbf{f}_{\mathrm{fix},b} \end{bmatrix}.
$$

Aici $\mathbf{f}_\mathrm{fix}$ sunt forțele de încastrare perfectă ale [încărcărilor pe element](#element-loads). Al doilea rând dă rotirea din articulație,

$$
\mathbf{d}_b = -\mathbf{K}_{bb}^{-1}\left(\mathbf{K}_{ba}\,\mathbf{d}_a + \mathbf{f}_{\mathrm{fix},b}\right),
$$

iar introducerea ei în primul rând lasă rigiditatea și forțele de încastrare perfectă condensate

$$
\begin{aligned}
\mathbf{K}^{*} &= \mathbf{K}_{aa} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}, \\
\mathbf{f}^{*}_\mathrm{fix} &= \mathbf{f}_{\mathrm{fix},a} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{f}_{\mathrm{fix},b}.
\end{aligned}
$$

Programul scrie $\mathbf{K}^{*}$ înapoi într-o matrice 6 × 6, cu rânduri și coloane nule pentru rotirile eliberate, astfel încât un element articulat se asamblează exact ca oricare altul. După rezolvare, recuperează $\mathbf{d}_b$ din formula de mai sus, iar deformata arată frântura din articulație.

Cu o articulație în nodul final, partea de încovoiere pentru $(w_1, \varphi_1, w_2)$ devine

$$
\mathbf{K}^{*}_{w} = \frac{12\,EI_y}{(4+\Phi)\,L^3}
\begin{bmatrix} 1 & -L & -1 \\ -L & L^2 & L \\ -1 & L & 1 \end{bmatrix},
$$

care pentru $\Phi = 0$ este rigiditatea clasică $3EI/L^3$ a unei bare încastrate și simplu rezemate. Cu articulații la **ambele** capete nu mai rămâne nimic din termenii de încovoiere, ci doar $EA/L$: elementul este o [bară de grindă cu zăbrele](/ro/elements/truss).

O articulație aparține capătului unui element, nu nodului. Dacă toate elementele care se întâlnesc într-un nod sunt articulate acolo, nimic nu este legat de rotirea proprie a nodului. Programul o lasă egală cu zero, ceea ce nu deranjează, dar un moment nodal aplicat într-un astfel de nod nu are pe ce să acționeze și face sistemul singular.

## Încărcări pe element {#element-loads}

Încărcările în lungul unui element intră în calcul ca **încărcări nodale echivalente**, $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. **Forțele de încastrare perfectă** $\mathbf{f}_\mathrm{fix}$ sunt forțele de la capete care țin în echilibru elementul încărcat, cu ambele capete încastrate.

Toate formulele de mai jos sunt în axe locale. O încărcare introdusă în axe globale (cu **LCS** nebifat) este mai întâi descompusă în componente locale cu $c = \cos\theta$ și $s = \sin\theta$ ale [unghiului](#transformation-matrix) elementului,

$$
q_x = c\,\bar q_x + s\,\bar q_z, \qquad q_z = -s\,\bar q_x + c\,\bar q_z,
$$

unde bara de deasupra marchează componentele globale. Încărcările distribuite acționează pe metru din lungimea proprie a elementului. De exemplu, un căprior de la $(0, 0)$ la $(3, -4)$ are $L = 5$ m, $c = 0{,}6$ și $s = -0{,}8$ (urcă, deci $z$ scade). O încărcare gravitațională $\bar q_z = 10$ kN/m pe el are $q_x = -8$ kN/m, în josul pantei, și $q_z = 6$ kN/m perpendicular pe el, iar căpriorul preia în total $10 \times 5 = 50$ kN, nu $10 \times 3$.

În tabele:

- $q_z$, $q_x$: o încărcare uniform distribuită; $q_1 \to q_2$: o încărcare trapezoidală, $q_1$ în nodul inițial și $q_2$ în nodul final.
- $F_z$, $F_x$, $M_y$: o forță sau un moment la distanța $a$ de nodul inițial, cu $b = L - a$.
- $\Delta T = \Delta T_b - \Delta T_t$: fibra inferioară mai caldă decât cea superioară; $\Delta T_c$: axa mai caldă. $\alpha$ este coeficientul de dilatare termică al materialului, iar $h$ **Înălțimea** secțiunii.

Perpendicular pe axă (componentele z) și pentru $\Phi = 0$, în nodul inițial:

$$
\begin{array}{l|cc}
\text{Încărcare} & Z_{12} & M_{12} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & \dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(7q_1+3q_2)}{20} & \dfrac{L^2\,(3q_1+2q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,b^2\,(3a+b)}{L^3} & \dfrac{F_z\,a\,b^2}{L^2} \\[3ex]
M_y & -\dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,b\,(b-2a)}{L^2} \\[3ex]
\Delta T & 0 & \dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

În nodul final:

$$
\begin{array}{l|cc}
\text{Încărcare} & Z_{21} & M_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & -\dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(3q_1+7q_2)}{20} & -\dfrac{L^2\,(2q_1+3q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,a^2\,(a+3b)}{L^3} & -\dfrac{F_z\,a^2\,b}{L^2} \\[3ex]
M_y & \dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,a\,(a-2b)}{L^2} \\[3ex]
\Delta T & 0 & -\dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

În lungul axei (componentele x), pentru orice $\Phi$:

$$
\begin{array}{l|cc}
\text{Încărcare} & X_{12} & X_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_x & -\dfrac{q_x L}{2} & -\dfrac{q_x L}{2} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(2q_1+q_2)}{6} & -\dfrac{L\,(q_1+2q_2)}{6} \\[3ex]
F_x & -\dfrac{F_x\,b}{L} & -\dfrac{F_x\,a}{L} \\[3ex]
\Delta T_c & EA\,\alpha\,\Delta T_c & -EA\,\alpha\,\Delta T_c
\end{array}
$$

::callout{type="details" title="Forțe de încastrare perfectă cu deformația din forfecare"}
Încărcarea uniform distribuită și variația de temperatură dau aceleași forțe de încastrare perfectă pentru orice $\Phi$. Pentru celelalte, cu $D = 1 + \Phi$ și $\Delta q = q_2 - q_1$ (componentele z):

$$
\begin{aligned}
&\text{Încărcare trapezoidală:} \\
Z_{12} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(9+10\Phi)}{60\,D}, \\[1ex]
M_{12} &= \frac{q_1 L^2}{12} + \frac{\Delta q\,L^2\,(4+5\Phi)}{120\,D}, \\[1ex]
Z_{21} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(21+20\Phi)}{60\,D}, \\[1ex]
M_{21} &= -\frac{q_1 L^2}{12} - \frac{\Delta q\,L^2\,(6+5\Phi)}{120\,D}; \\[3ex]
&\text{Forța } F_z\text{:} \\
Z_{12} &= -\frac{F_z\,b\,(\Phi L^2 + 3ab + b^2)}{D\,L^3}, \\[1ex]
M_{12} &= \frac{F_z\,a\,b\,(\Phi L + 2b)}{2\,D\,L^2}, \\[1ex]
Z_{21} &= -\frac{F_z\,a\,(\Phi L^2 + a^2 + 3ab)}{D\,L^3}, \\[1ex]
M_{21} &= -\frac{F_z\,a\,b\,(\Phi L + 2a)}{2\,D\,L^2}; \\[3ex]
&\text{Moment } M_y\text{:} \\
Z_{12} &= -\frac{6\,a\,b\,M_y}{D\,L^3}, \qquad Z_{21} = \frac{6\,a\,b\,M_y}{D\,L^3}, \\[1ex]
M_{12} &= -\frac{M_y\,b\,(\Phi L - 2a + b)}{D\,L^2}, \\[1ex]
M_{21} &= -\frac{M_y\,a\,(\Phi L + a - 2b)}{D\,L^2}.
\end{aligned}
$$

Acestea sunt soluțiile exacte pentru o bară Timoshenko dublu încastrată, la fel ca săgeata pe care programul o adaugă între noduri pentru fiecare încărcare.
::

La un element articulat, forțele de încastrare perfectă sunt condensate în $\mathbf{f}^{*}_\mathrm{fix}$, ca la [Articulații la capete](#end-hinges). De exemplu, o încărcare uniform distribuită pe un element cu articulație în nodul final dă $Z_{12} = -5q_zL/8$, $M_{12} = q_zL^2/8$, $Z_{21} = -3q_zL/8$ și $M_{21} = 0$ (pentru $\Phi = 0$): forțele de încastrare perfectă ale unei bare încastrate și simplu rezemate.

După rezolvare, eforturile în lungul elementului rezultă din forțele de la capete și din statica încărcării de pe el, iar săgeata din funcțiile de formă plus săgeata încărcării pe bara dublu încastrată: vezi [Rezultate în lungul barelor](/ro/elements/analysis#results-along-the-members).

## Matricea de transformare {#transformation-matrix}

Un element cu unghiul $\theta$, măsurat de la axa globală x spre axa globală z (în sens orar pe ecran), are

$$
c = \cos\theta = \frac{x_2 - x_1}{L}, \qquad s = \sin\theta = \frac{z_2 - z_1}{L},
$$

iar deplasările lui locale de la capete se obțin din cele globale ca $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, cu

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

Rotirile sunt aceleași în ambele sisteme. Dacă un nod are un **Unghiul sistemului local al nodului** $\beta$ (un [reazem înclinat](/ro/essentials/nodes-supports#inclined-skewed-supports)), necunoscutele lui $\mathbf{d}_n$ sunt în axele lui proprii, rotite cu $\beta$ de la axa globală x spre axa globală z. Componentele lor globale sunt

$$
\mathbf{d}_g = \mathbf{T}_n\,\mathbf{d}_n, \qquad
\mathbf{T}_n = \begin{bmatrix} \cos\beta & -\sin\beta & 0 \\ \sin\beta & \cos\beta & 0 \\ 0 & 0 & 1 \end{bmatrix}
$$

pentru cele trei grade de libertate ale nodului. Programul înmulțește $\mathbf{T}$ la dreapta cu matricea bloc-diagonală formată din $\mathbf{T}_n$ ale celor două noduri de capăt (matricea unitate pentru un nod fără axe proprii), astfel încât elementul se leagă de fiecare nod în axele acelui nod.

## Matricea de rigiditate globală {#global-stiffness-matrix}

În axe globale, matricea de rigiditate a elementului și încărcările nodale echivalente sunt

$$
\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T},
\qquad
\mathbf{f}_{\mathrm{eq},g} = \mathbf{T}^\mathsf{T}\,\mathbf{f}_\mathrm{eq},
$$

cu $\mathbf{K}_l$ și $\mathbf{f}_\mathrm{eq}$ deja condensate dacă elementul are articulații. $\mathbf{K}_g$ este ce afișează fereastra **Matrice de rigiditate** pentru un element (o deschizi din tabelul *Elemente* sau din meniul desenului, deschis pe element), în unități SI: N/m, N și N·m. [Cum calculează EduBeam modelul](/ro/elements/analysis) asamblează aceste matrice și rezolvă de mână un mic exemplu.
