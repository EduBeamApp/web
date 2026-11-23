---
description: "Deformačná metóda tak, ako ju počíta EduBeam, ručne na jednostranne votknutom nosníku: kódové čísla, zostavenie sústavy, podpery, reakcie a výsledky na prvkoch."
source: site
---

# Ako EduBeam rieši model

Kedykoľvek model zmeníte, EduBeam ho v priebehu niekoľkých milisekúnd znova vyrieši **deformačnou metódou** v maticovom tvare (priamou metódou tuhosti), a to priamo vo vašom prehliadači. Na tejto stránke prejdeme krok za krokom postup riešiča [@edubeam/fem](/sk/solver) na malom príklade. Každé číslo si tak môžete prepočítať ručne a uvidíte, prečo sa výsledkom dá veriť.

Príkladom je jednostranne votknutý nosník: oceľový IPE 300 s dĺžkou 4 m, v bode A votknutý, v bode B uložený na posuvnom kĺbe a zaťažený rovnomerným spojitým zaťažením 10 kN/m. Jeho ohybová tuhosť je $EI = 210 \text{ GPa} \times 8356 \text{ cm}^4 = 17\,548$ kNm² a bez vplyvu šmykových deformácií dávajú učebnicové vzorce $M_A = -qL^2/8 = -20$ kNm, $R_B = 3qL/8 = 15$ kN a $\varphi_B = qL^3/(48EI)$.

::model-figure{caption="Jednostranne votknutý nosník, IPE 300, 10 kN/m: M = −20 kNm v A a +11,25 kNm vo vzdialenosti 2,5 m, reakcie 25 kN a 15 kN"}
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

## Od modelu k posunutiam {#from-model-to-displacements}

::div{.steps}
### Očíslovanie stupňov voľnosti {#number-the-degrees-of-freedom}

Každý uzol dostane tie stupne voľnosti, ktoré potrebujú prvky pripojené k nemu. Všetky prvky sú [nosníkové](/sk/elements/beam), takže každý uzol má `Dx`, `Dz` a `Ry`. Riešič čísluje uzol po uzle najprv **voľné** stupne voľnosti a až po nich **podopreté**. Uzol A je votknutý a uzol B je podopretý len zvislo, voľné sú teda dva:

$$
\begin{gathered}
\mathbf{r} = \begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix},
\qquad
\mathbf{r}_u = \begin{bmatrix} u_B \\ \varphi_B \end{bmatrix}, \\[1ex]
\mathbf{r}_p = \begin{bmatrix} u_A & w_A & \varphi_A & w_B \end{bmatrix}^\mathsf{T}.
\end{gathered}
$$

$u$, $w$ a $\varphi$ sú posunutia v smere osí x a z a pootočenie, rovnako ako v [tabuľke stupňov voľnosti](/sk/elements/conventions#degrees-of-freedom). Každý prvok má svoje **kódové čísla**: pozície svojich šiestich stupňov voľnosti vo vektore $\mathbf{r}$. Pri číslovaní od 1 ležia stupne voľnosti nosníka $(u_A, w_A, \varphi_A, u_B, w_B, \varphi_B)$ na pozíciách $(3, 4, 5, 1, 6, 2)$.

### Matice prvkov {#compute-the-element-matrices}

Pre každý prvok riešič zostaví [lokálnu maticu tuhosti](/sk/elements/beam#local-stiffness-matrix), staticky skondenzuje prípadné [koncové kĺby](/sk/elements/beam#end-hinges) a maticu transformuje do globálnych osí, $\mathbf{K}_g = \mathbf{T}^\mathsf{T}\mathbf{K}_l\,\mathbf{T}$. Každé prvkové zaťaženie prevedie na [ekvivalentné uzlové zaťaženie](/sk/elements/beam#element-loads), $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. Náš nosník je vodorovný, takže $\mathbf{T}$ je jednotková matica a rovnomerné zaťaženie dáva (v kN a kNm)

$$
\mathbf{f}_\mathrm{eq} = \begin{bmatrix} 0 \\[0.5ex] qL/2 \\[0.5ex] -qL^2/12 \\[0.5ex] 0 \\[0.5ex] qL/2 \\[0.5ex] qL^2/12 \end{bmatrix}
= \begin{bmatrix} 0 \\[0.5ex] 20 \\[0.5ex] -13{,}33 \\[0.5ex] 0 \\[0.5ex] 20 \\[0.5ex] 13{,}33 \end{bmatrix}.
$$

### Zostavenie sústavy {#assemble}

Globálna matica tuhosti $\mathbf{K}$ je na začiatku nulová. Každý prvok pripočíta svoj člen $(i, j)$ do toho riadku a stĺpca, ktoré jeho kódové čísla priraďujú indexom $i$ a $j$. Kde sa v uzle stretáva viac prvkov, sčítajú sa tak ich tuhosti prislúchajúce stupňom voľnosti tohto uzla. Rovnako sa do vektora zaťaženia $\mathbf{F}$ sčítavajú uzlové zaťaženia aj ekvivalentné uzlové zaťaženia. Predpísané posunutia (poklesy podpier) patria do $\mathbf{r}_p$. Pri poradí „najprv voľné, potom podopreté“ sa sústava rozpadne na bloky:

$$
\begin{bmatrix} \mathbf{K}_{uu} & \mathbf{K}_{up} \\ \mathbf{K}_{pu} & \mathbf{K}_{pp} \end{bmatrix}
\begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix}
=
\begin{bmatrix} \mathbf{F}_u \\ \mathbf{F}_p + \mathbf{R} \end{bmatrix},
$$

kde $\mathbf{R}$ sú neznáme reakcie. V príklade pripadnú do $\mathbf{K}_{uu}$ len tie riadky a stĺpce matice nosníka, ktoré patria koncu B:

$$
\begin{aligned}
\mathbf{K}_{uu} &= \begin{bmatrix} EA/L & 0 \\ 0 & 4EI/L \end{bmatrix} \\[1ex]
&= \begin{bmatrix} 282\,450 \text{ kN/m} & 0 \\ 0 & 17\,548 \text{ kNm} \end{bmatrix}, \\[1ex]
\mathbf{F}_u &= \begin{bmatrix} 0 \\ 13{,}33 \text{ kNm} \end{bmatrix}.
\end{aligned}
$$

### Podpery a riešenie sústavy {#apply-the-supports-and-solve}

Podpery sa nemodelujú pružinami ani veľkými číslami na diagonále: podopreté stupne voľnosti sa jednoducho oddelia. Voľné posunutia vyplývajú zo sústavy

$$
\mathbf{K}_{uu}\,\mathbf{r}_u = \mathbf{F}_u - \mathbf{K}_{up}\,\mathbf{r}_p,
$$

ktorú riešič vyrieši LU rozkladom. Bez poklesov podpier je $\mathbf{r}_p = \mathbf{0}$ a tu vychádza

$$
\varphi_B = \frac{13{,}33}{17\,548} = 7{,}598 \times 10^{-4} \text{ rad},
$$

čo je učebnicové $qL^3/(48EI)$, a $u_B = 0$.

### Výpočet reakcií {#compute-the-reactions}

Keď sú známe všetky posunutia, dajú riadky podopretých stupňov voľnosti reakcie, teda sily, ktorými podpery pôsobia na konštrukciu:

$$
\mathbf{R} = \mathbf{K}_{pu}\,\mathbf{r}_u + \mathbf{K}_{pp}\,\mathbf{r}_p - \mathbf{F}_p.
$$

Pre $w_A$ obsahuje riadok matice $\mathbf{K}_{pu}$ v stĺpci $\varphi_B$ člen $-6EI/L^2$ a vektor $\mathbf{F}_p$ obsahuje $qL/2$:

$$
\begin{aligned}
R_{wA} &= -\frac{6EI}{L^2}\,\varphi_B - \frac{qL}{2} \\
&= -5 - 20 = -25 \text{ kN},
\end{aligned}
$$

teda 25 kN smerom nahor (os z smeruje nadol). Rovnako vyjde $R_{\varphi A} = +20$ kNm a $R_{wB} = -15$ kN, teda učebnicové $qL^2/8$ a $3qL/8$.
::

## Výsledky po dĺžke prvkov {#results-along-the-members}

Pre každý prvok riešič vyberie z vektora $\mathbf{r}$ jeho koncové posunutia, transformuje ich do lokálnych osí, $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, a vypočíta [koncové sily](/sk/elements/conventions#end-forces-element-results-table)

$$
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix}.
$$

V príklade dáva $\mathbf{d}_l = [0,\ 0,\ 0,\ 0,\ 0,\ \varphi_B]^\mathsf{T}$ hodnoty $Z_{12} = -25$ kN, $M_{12} = 20$ kNm, $Z_{21} = -15$ kN a $M_{21} = 0$.

Vnútorné sily v ľubovoľnom mieste $x$ potom vyplývajú z rovnováhy časti prvku medzi jeho začiatkom a miestom $x$: zo síl na začiatku prvku a zo zaťaženia, ktoré na túto časť pôsobí.

$$
\begin{aligned}
N(x) &= -X_{12} + N_q(x), \\
V(x) &= -Z_{12} + V_q(x), \\
M(x) &= -M_{12} - Z_{12}\,x + M_q(x),
\end{aligned}
$$

kde $N_q$, $V_q$ a $M_q$ sú príspevky zaťaženia na tejto časti. Pre rovnomerné zaťaženie $q_z$, lichobežníkové zaťaženie od $q_1$ do $q_2$ (s $\Delta q = q_2 - q_1$) a pre silu $F_z$ alebo moment $M_y$ vo vzdialenosti $a$, ktoré sa uplatnia len pre $x \ge a$, platí:

$$
\begin{array}{l|cc}
\text{Zaťaženie} & V_q(x) & M_q(x) \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -q_z\,x & -\dfrac{q_z\,x^2}{2} \\[3ex]
q_1 \to q_2 & -q_1 x - \dfrac{\Delta q\,x^2}{2L} & -\dfrac{q_1 x^2}{2} - \dfrac{\Delta q\,x^3}{6L} \\[3ex]
F_z,\ M_y & -F_z & -F_z\,(x-a) - M_y
\end{array}
$$

$N_q$ dostanete rovnako ako $V_q$, len s osovými zložkami $q_x$ a $F_x$ namiesto $q_z$ a $F_z$.

V príklade je $M(x) = -20 + 25\,x - 5\,x^2$ kNm, najväčší v $x = 2{,}5$ m, kde dosahuje $11{,}25$ kNm $= 9qL^2/128$. Teplotné zaťaženie tu žiadny vlastný člen nemá: pôsobí len prostredníctvom koncových síl.

Priehyb je súčin [tvarových funkcií](/sk/elements/beam#local-stiffness-matrix) a koncových posunutí, ku ktorému sa pripočíta priehyb od zaťaženia na obojstranne votknutom prvku. Pri kĺbovom konci sa najprv z [kondenzácie](/sk/elements/beam#end-hinges) spätne dopočíta jeho vlastné pootočenie. Priebehy vnútorných síl aj deformovaný tvar sú práve tieto funkcie, vyčíslené po dĺžke každého prvku.

## Prečo sú výsledky presné {#exact}

Každý z krokov vyššie je pre riešený model presný:

- Matica tuhosti prvku vychádza z **presného riešenia** prizmatického Timošenkovho prúta, nie z predpokladaných polynomických priebehov, takže ide o skutočnú tuhosť prúta.
- Primárne koncové sily sú presné riešenia obojstranne votknutého prúta pre každý typ zaťaženia, takže sa prevodom na ekvivalentné uzlové zaťaženia nič nestratí.
- Uzlové posunutia sú teda presné, a keďže vnútorné sily medzi uzlami vyplývajú z rovnováhy so skutočným zaťažením, sú presné aj ony.

Preto od vás EduBeam nikdy nežiada zjemňovať sieť: jeden prvok na prút dá rovnaký výsledok ako sto prvkov. Uzly potrebujete len tam, kde sa mení samotný prút: v podpere, v kĺbe, v rohu alebo pri zmene prierezu. Osamelá sila medzi nimi môže zostať prvkovým zaťažením. Zostávajú len chyby zaokrúhlenia pri počítaní s pohyblivou desatinnou čiarkou; tabuľky výsledkov preto zobrazujú ako 0 hodnoty menšie ako $10^{-12}$ najväčšej hodnoty toho istého druhu.

„Presné“ sa však vzťahuje na model a ten má svoje hranice:

::div{.limits}
- **Lineárne pružný materiál** a **malé posunutia**: podmienky rovnováhy sa zostavujú na nedeformovanej konštrukcii, takže výpočet nezahŕňa účinky druhého rádu (P–Δ) ani stratu stability.
- **Priame prizmatické prúty**: jeden prierez na prvok. Prút s premenným prierezom treba nahradiť niekoľkými prvkami.
- **Ohyb iba v rovine x–z**: žiadne krútenie ani správanie mimo roviny.
::

## Keď konštrukcia nemôže stáť {#mechanisms}

Konštrukcia, ktorá sa môže pohybovať bez toho, aby sa deformovala, má singulárnu maticu tuhosti a nemá jednoznačné riešenie. EduBeam to zisťuje už pred výpočtom a po výpočte ešte skontroluje výsledok:

1. **Pred výpočtom** sa každá súvislá časť konštrukcie preverí čisto geometricky. Podpery musia zabrániť všetkým trom pohybom tuhej dosky v rovine: menej ako tri väzby znamenajú, že model ešte jednoducho nie je hotový (*Konštrukcia potrebuje podpery, inak ju nemožno vypočítať.*), zatiaľ čo tri a viac väzieb, ktoré ju napriek tomu nechajú posunúť alebo otočiť, ako napríklad rovnobežné posuvné kĺby, sú chybou. Potom prídu na rad kĺby: ak sa prúty môžu okolo nich otáčať a pritom si všetky zachovajú svoju dĺžku, je konštrukcia mechanizmus a EduBeam kĺby zakrúžkuje a pohyb ukáže.
2. **Počas výpočtu** presne singulárna matica zastaví LU rozklad: *Konštrukcia je mechanizmus: matica tuhosti je singulárna.*
3. **Po výpočte** znamená posunutie alebo pootočenie väčšie ako $10^6$ m alebo rad, že matica bola až na chyby zaokrúhlenia singulárna. EduBeam vypíše uzly a smery, v ktorých sa konštrukcia pohybuje: *Konštrukcia je nestabilná – tieto pohyby nemajú prakticky žiadny odpor: …* Sem sa dostanete aj vtedy, keď zadáte materiál alebo prierez ako nulu alebo v nesprávnej jednotke.

Pootočenie, ku ktorému nie je nič pripojené, pretože v uzle sú všetky prúty pripojené kĺbovo, mechanizmus nie je: riešič ho ponechá nulové. Všetky hlásenia a postup, ako ich odstrániť, vysvetľuje stránka [Riešenie problémov](/sk/reference/troubleshooting#no-results-are-drawn).

## Spustite riešič sami {#library}

Riešič je open source: [@edubeam/fem](/sk/solver), napísaný v TypeScripte, pre prehliadač aj Node. Ten istý jednostranne votknutý nosník:

```ts
import { DofID, LinearStaticSolver, type Beam2D } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]

// Jednotky SI: m, N, Pa. Oceľ, IPE 300; s k = 1e32 je prierez šmykovo tuhý.
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // votknutie
domain.createNode('B', [4, 0, 0], [DofID.Dz]) // posuvný kĺb
domain.createBeam2D('1', ['A', 'B'], 1, 1)
lc.createBeamElementUniformEdgeLoad('1', [0, 10_000], true) // 10 kN/m, nadol

solver.solve()

solver.neq // 2: Dx a Ry uzla B sú voľné
lc.r.toArray() // [0, 0.0007598, 0, 0, 0, 0]: voľné stupne voľnosti, potom podopreté
lc.R.toArray() // [0, -25000, 20000, -15000]: A (Dx, Dz, Ry), potom B (Dz)

const beam = domain.getElement('1') as Beam2D
beam.computeEndForces(lc).toArray() // [0, -25000, 20000, 0, -15000, 0]
beam.computeBendingMomentAt(lc, 0) // -20000: N·m, záporný moment vo votknutí
beam.computeBendingMomentAt(lc, 2.5) // 11250: najväčší kladný moment
```

Po `solve()` obsahuje `solver.k` zostavenú maticu $\mathbf{K}$ a `solver.f` vektor zaťaženia $\mathbf{F}$, takže ich môžete porovnať s vlastným zostavením. Kroky z tejto stránky nájdete v súboroch `Solver.ts` (číslovanie), `LinearStaticSolver.ts` (zostavenie, riešenie, reakcie) a `Beam2D.ts` (matica prvku a výsledky).

::div{.actions}
[Začíname s @edubeam/fem](/sk/solver/getting-started) [Čo knižnica obsahuje](/sk/solver/reference) [Zdrojový kód na GitHube ↗](https://github.com/EduBeamApp/fem){target="_blank"}
::
