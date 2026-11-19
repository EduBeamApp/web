---
description: "Deformační metoda tak, jak ji počítá EduBeam, ručně na jednostranně vetknutém nosníku: kódová čísla, sestavení soustavy, podpory, reakce a výsledky po délce prvků."
source: site
---

# Jak EduBeam řeší model

Kdykoli model změníte, EduBeam ho během několika milisekund znovu vyřeší **deformační metodou** v maticovém tvaru (přímou metodou tuhosti), a to přímo ve vašem prohlížeči. Na této stránce projdeme řešič [@edubeam/fem](/cs/solver) krok za krokem na malém příkladu. Každé číslo si tak můžete přepočítat ručně a uvidíte, proč se výsledkům dá věřit.

Příkladem je jednostranně vetknutý nosník: ocelový IPE 300 o délce 4 m, v bodě A vetknutý, v bodě B uložený na posuvném kloubu a zatížený rovnoměrným spojitým zatížením 10 kN/m. Jeho ohybová tuhost je $EI = 210 \text{ GPa} \times 8356 \text{ cm}^4 = 17\,548$ kNm² a bez vlivu smykové deformace dávají učebnicové vzorce $M_A = -qL^2/8 = -20$ kNm, $R_B = 3qL/8 = 15$ kN a $\varphi_B = qL^3/(48EI)$.

::model-figure{caption="Jednostranně vetknutý nosník, IPE 300, 10 kN/m: M = −20 kNm v A a +11,25 kNm ve vzdálenosti 2,5 m, reakce 25 kN a 15 kN"}
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

## Od modelu k posunům {#from-model-to-displacements}

::div{.steps}
### Očíslování stupňů volnosti {#number-the-degrees-of-freedom}

Každý uzel dostane ty stupně volnosti, které potřebují prvky, jež se v něm stýkají. Všechny prvky jsou [nosníkové](/cs/elements/beam), takže každý uzel má `Dx`, `Dz` a `Ry`. Řešič čísluje uzel po uzlu nejprve **volné** stupně volnosti a teprve po nich **podepřené**. Uzel A je vetknutý a uzel B je podepřen jen svisle, volné jsou tedy dva:

$$
\begin{gathered}
\mathbf{r} = \begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix},
\qquad
\mathbf{r}_u = \begin{bmatrix} u_B \\ \varphi_B \end{bmatrix}, \\[1ex]
\mathbf{r}_p = \begin{bmatrix} u_A & w_A & \varphi_A & w_B \end{bmatrix}^\mathsf{T}.
\end{gathered}
$$

$u$, $w$ a $\varphi$ jsou posuny ve směru os x a z a pootočení, stejně jako v [tabulce stupňů volnosti](/cs/elements/conventions#degrees-of-freedom). Každý prvek má svá **kódová čísla**: pozice svých šesti stupňů volnosti ve vektoru $\mathbf{r}$. Při číslování od 1 leží stupně volnosti nosníku $(u_A, w_A, \varphi_A, u_B, w_B, \varphi_B)$ na pozicích $(3, 4, 5, 1, 6, 2)$.

### Matice prvků {#compute-the-element-matrices}

Pro každý prvek řešič sestaví [lokální matici tuhosti](/cs/elements/beam#local-stiffness-matrix), staticky zkondenzuje případné [koncové klouby](/cs/elements/beam#end-hinges) a matici transformuje do globálních os, $\mathbf{K}_g = \mathbf{T}^\mathsf{T}\mathbf{K}_l\,\mathbf{T}$. Každé prvkové zatížení převede na [ekvivalentní uzlové zatížení](/cs/elements/beam#element-loads), $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. Náš nosník je vodorovný, takže $\mathbf{T}$ je jednotková matice a rovnoměrné zatížení dává (v kN a kNm)

$$
\mathbf{f}_\mathrm{eq} = \begin{bmatrix} 0 \\[0.5ex] qL/2 \\[0.5ex] -qL^2/12 \\[0.5ex] 0 \\[0.5ex] qL/2 \\[0.5ex] qL^2/12 \end{bmatrix}
= \begin{bmatrix} 0 \\[0.5ex] 20 \\[0.5ex] -13{,}33 \\[0.5ex] 0 \\[0.5ex] 20 \\[0.5ex] 13{,}33 \end{bmatrix}.
$$

### Sestavení soustavy {#assemble}

Globální matice tuhosti $\mathbf{K}$ je na začátku nulová. Každý prvek přičte svůj člen $(i, j)$ do toho řádku a sloupce, které jeho kódová čísla přiřazují indexům $i$ a $j$. Kde se v uzlu stýká více prvků, sečtou se tak jejich tuhosti příslušné stupňům volnosti tohoto uzlu. Stejně se do vektoru zatížení $\mathbf{F}$ sčítají uzlová zatížení i ekvivalentní uzlová zatížení. Předepsaná posunutí (poklesy podpor) patří do $\mathbf{r}_p$. Při pořadí „nejprve volné, pak podepřené“ se soustava rozpadne na bloky:

$$
\begin{bmatrix} \mathbf{K}_{uu} & \mathbf{K}_{up} \\ \mathbf{K}_{pu} & \mathbf{K}_{pp} \end{bmatrix}
\begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix}
=
\begin{bmatrix} \mathbf{F}_u \\ \mathbf{F}_p + \mathbf{R} \end{bmatrix},
$$

kde $\mathbf{R}$ jsou neznámé reakce. V příkladu připadnou do $\mathbf{K}_{uu}$ jen ty řádky a sloupce matice nosníku, které patří konci B:

$$
\begin{aligned}
\mathbf{K}_{uu} &= \begin{bmatrix} EA/L & 0 \\ 0 & 4EI/L \end{bmatrix} \\[1ex]
&= \begin{bmatrix} 282\,450 \text{ kN/m} & 0 \\ 0 & 17\,548 \text{ kNm} \end{bmatrix}, \\[1ex]
\mathbf{F}_u &= \begin{bmatrix} 0 \\ 13{,}33 \text{ kNm} \end{bmatrix}.
\end{aligned}
$$

### Podpory a řešení soustavy {#apply-the-supports-and-solve}

Podpory se nemodelují pružinami ani velkými čísly na diagonále: podepřené stupně volnosti se jednoduše oddělí. Volné posuny plynou ze soustavy

$$
\mathbf{K}_{uu}\,\mathbf{r}_u = \mathbf{F}_u - \mathbf{K}_{up}\,\mathbf{r}_p,
$$

kterou řešič vyřeší LU rozkladem. Bez poklesů podpor je $\mathbf{r}_p = \mathbf{0}$ a zde vychází

$$
\varphi_B = \frac{13{,}33}{17\,548} = 7{,}598 \times 10^{-4} \text{ rad},
$$

což je učebnicové $qL^3/(48EI)$, a $u_B = 0$.

### Výpočet reakcí {#compute-the-reactions}

Když jsou známy všechny posuny, dají řádky podepřených stupňů volnosti reakce, tedy síly, kterými podpory působí na konstrukci:

$$
\mathbf{R} = \mathbf{K}_{pu}\,\mathbf{r}_u + \mathbf{K}_{pp}\,\mathbf{r}_p - \mathbf{F}_p.
$$

Pro $w_A$ obsahuje řádek matice $\mathbf{K}_{pu}$ ve sloupci $\varphi_B$ člen $-6EI/L^2$ a vektor $\mathbf{F}_p$ obsahuje $qL/2$:

$$
\begin{aligned}
R_{wA} &= -\frac{6EI}{L^2}\,\varphi_B - \frac{qL}{2} \\
&= -5 - 20 = -25 \text{ kN},
\end{aligned}
$$

tedy 25 kN směrem nahoru (osa z míří dolů). Stejně vyjde $R_{\varphi A} = +20$ kNm a $R_{wB} = -15$ kN, tedy učebnicové $qL^2/8$ a $3qL/8$.
::

## Výsledky po délce prvků {#results-along-the-members}

Pro každý prvek řešič vybere z vektoru $\mathbf{r}$ jeho koncové posuny, transformuje je do lokálních os, $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, a spočítá [koncové síly](/cs/elements/conventions#end-forces-element-results-table)

$$
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix}.
$$

V příkladu dává $\mathbf{d}_l = [0,\ 0,\ 0,\ 0,\ 0,\ \varphi_B]^\mathsf{T}$ hodnoty $Z_{12} = -25$ kN, $M_{12} = 20$ kNm, $Z_{21} = -15$ kN a $M_{21} = 0$.

Vnitřní síly v libovolném místě $x$ pak plynou z rovnováhy části prvku mezi jeho počátkem a místem $x$: ze sil na začátku prvku a ze zatížení, které na tuto část působí.

$$
\begin{aligned}
N(x) &= -X_{12} + N_q(x), \\
V(x) &= -Z_{12} + V_q(x), \\
M(x) &= -M_{12} - Z_{12}\,x + M_q(x),
\end{aligned}
$$

kde $N_q$, $V_q$ a $M_q$ jsou příspěvky zatížení na této části. Pro rovnoměrné zatížení $q_z$, lichoběžníkové zatížení od $q_1$ do $q_2$ (s $\Delta q = q_2 - q_1$) a pro sílu $F_z$ nebo moment $M_y$ ve vzdálenosti $a$, které se uplatní jen pro $x \ge a$, platí:

$$
\begin{array}{l|cc}
\text{Zatížení} & V_q(x) & M_q(x) \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -q_z\,x & -\dfrac{q_z\,x^2}{2} \\[3ex]
q_1 \to q_2 & -q_1 x - \dfrac{\Delta q\,x^2}{2L} & -\dfrac{q_1 x^2}{2} - \dfrac{\Delta q\,x^3}{6L} \\[3ex]
F_z,\ M_y & -F_z & -F_z\,(x-a) - M_y
\end{array}
$$

$N_q$ dostanete stejně jako $V_q$, jen s osovými složkami $q_x$ a $F_x$ místo $q_z$ a $F_z$.

V příkladu je $M(x) = -20 + 25\,x - 5\,x^2$ kNm, největší v $x = 2{,}5$ m, kde dosahuje $11{,}25$ kNm $= 9qL^2/128$. Teplotní zatížení tu žádný vlastní člen nemá: působí jen prostřednictvím koncových sil.

Průhyb je součin [tvarových funkcí](/cs/elements/beam#local-stiffness-matrix) a koncových posunů, k němuž se přičte průhyb od zatížení na oboustranně vetknutém prvku. U kloubového konce se nejprve z [kondenzace](/cs/elements/beam#end-hinges) zpětně dopočítá jeho vlastní pootočení. Průběhy vnitřních sil i deformovaný tvar jsou právě tyto funkce, vyčíslené po délce každého prvku.

## Proč jsou výsledky přesné {#exact}

Každý z kroků výše je pro řešený model přesný:

- Matice tuhosti prvku vychází z **přesného řešení** prizmatického Timošenkova prutu, ne z předpokládaných polynomických průběhů, takže jde o skutečnou tuhost prutu.
- Primární koncové síly jsou přesná řešení oboustranně vetknutého prutu pro každý typ zatížení, takže se převodem na ekvivalentní uzlová zatížení nic neztratí.
- Uzlové posuny jsou tedy přesné, a protože vnitřní síly mezi uzly plynou z rovnováhy se skutečným zatížením, jsou přesné i ony.

Proto po vás EduBeam nikdy nechce zjemňovat síť: jeden prvek na prut dá stejný výsledek jako sto prvků. Uzly potřebujete jen tam, kde se mění samotný prut: v podpoře, v kloubu, v rohu nebo při změně průřezu. Osamělá síla mezi nimi může zůstat prvkovým zatížením. Zbývají jen zaokrouhlovací chyby aritmetiky s pohyblivou řádovou čárkou; tabulky výsledků proto zobrazují jako 0 hodnoty menší než $10^{-12}$ největší hodnoty téhož druhu.

„Přesné“ se ovšem vztahuje k modelu a ten má své meze:

::div{.limits}
- **Lineárně pružný materiál** a **malé posuny**: podmínky rovnováhy se sestavují na nedeformované konstrukci, takže výpočet nezahrnuje účinky druhého řádu (P–Δ) ani ztrátu stability.
- **Přímé prizmatické pruty**: jeden průřez na prvek. Prut s proměnným průřezem je třeba nahradit několika prvky.
- **Ohyb jen v rovině x–z**: žádné kroucení ani chování mimo rovinu.
::

## Když konstrukce nemůže stát {#mechanisms}

Konstrukce, která se může pohybovat, aniž by se deformovala, má singulární matici tuhosti a nemá jednoznačné řešení. EduBeam to zjišťuje už před výpočtem a po výpočtu ještě kontroluje výsledek:

1. **Před výpočtem** se každá souvislá část konstrukce prověří čistě geometricky. Podpory musí zabránit všem třem pohybům tuhé desky v rovině: méně než tři vazby znamenají, že model jen ještě není hotový (*Konstrukce potřebuje podpory, jinak ji nelze vypočítat.*), zatímco tři a více vazeb, které ji přesto nechají posunout nebo otočit, jako třeba rovnoběžné posuvné klouby, jsou chybou. Pak přijdou na řadu klouby: pokud se pruty mohou kolem nich otáčet a přitom si všechny zachovají svou délku, je konstrukce mechanismus a EduBeam klouby zakroužkuje a pohyb ukáže.
2. **Během výpočtu** přesně singulární matice zastaví LU rozklad: *Konstrukce je mechanismus: matice tuhosti je singulární.*
3. **Po výpočtu** znamená posun nebo pootočení větší než $10^6$ m nebo rad, že matice byla až na zaokrouhlovací chyby singulární. EduBeam vypíše uzly a směry, ve kterých se konstrukce pohybuje: *Konstrukce je nestabilní – tyto pohyby nemají prakticky žádný odpor: …* Sem se dostanete i tehdy, když zadáte materiál nebo průřez jako nulu nebo ve špatné jednotce.

Pootočení, ke kterému není nic připojeno, protože v uzlu jsou všechny pruty připojené kloubově, mechanismus není: řešič ho ponechá nulové. Všechna hlášení a postup, jak je odstranit, vysvětluje stránka [Řešení potíží](/cs/reference/troubleshooting#no-results-are-drawn).

## Spusťte řešič sami {#library}

Řešič je open source: [@edubeam/fem](/cs/solver), napsaný v TypeScriptu, pro prohlížeč i Node. Tentýž jednostranně vetknutý nosník:

```ts
import { DofID, LinearStaticSolver, type Beam2D } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]

// Jednotky SI: m, N, Pa. Ocel, IPE 300; s k = 1e32 je průřez smykově tuhý.
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // vetknutí
domain.createNode('B', [4, 0, 0], [DofID.Dz]) // posuvný kloub
domain.createBeam2D('1', ['A', 'B'], 1, 1)
lc.createBeamElementUniformEdgeLoad('1', [0, 10_000], true) // 10 kN/m, dolů

solver.solve()

solver.neq // 2: Dx a Ry uzlu B jsou volné
lc.r.toArray() // [0, 0.0007598, 0, 0, 0, 0]: volné stupně volnosti, pak podepřené
lc.R.toArray() // [0, -25000, 20000, -15000]: A (Dx, Dz, Ry), pak B (Dz)

const beam = domain.getElement('1') as Beam2D
beam.computeEndForces(lc).toArray() // [0, -25000, 20000, 0, -15000, 0]
beam.computeBendingMomentAt(lc, 0) // -20000: N·m, záporný moment ve vetknutí
beam.computeBendingMomentAt(lc, 2.5) // 11250: největší kladný moment
```

Po `solve()` obsahuje `solver.k` sestavenou matici $\mathbf{K}$ a `solver.f` vektor zatížení $\mathbf{F}$, takže je můžete porovnat s vlastním sestavením. Kroky z této stránky najdete v souborech `Solver.ts` (číslování), `LinearStaticSolver.ts` (sestavení, řešení, reakce) a `Beam2D.ts` (matice prvku a výsledky).

::div{.actions}
[Začínáme s @edubeam/fem](/cs/solver/getting-started) [Co knihovna obsahuje](/cs/solver/reference) [Zdrojový kód na GitHubu ↗](https://github.com/EduBeamApp/fem){target="_blank"}
::
