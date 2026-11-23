---
description: "A mátrixos elmozdulásmódszer úgy, ahogy az EduBeam futtatja, kézzel végigszámolva egy egyik végén befogott, másik végén görgős támaszú tartón: számozás, összeállítás, támaszok, támaszerők és rúderedmények."
source: site
---

# Hogyan számít az EduBeam

Az EduBeam a modell minden módosítása után újraszámítja a **mátrixos elmozdulásmódszerrel** (közvetlen merevségi módszerrel), a böngésződben, néhány ezredmásodperc alatt. Ez az oldal egy kis példán lépésről lépésre követi az [@edubeam/fem](/hu/solver) számítómag működését, így minden számot kézzel is előállíthatsz, és láthatod, miért lehet megbízni az eredményekben.

A példa egy egyik végén befogott, másik végén görgős támaszú tartó: 4 m hosszú acél IPE 300, A-ban befogva, B-ben görgős támaszon, 10 kN/m teherrel. Hajlítási merevsége $EI = 210 \text{ GPa} \times 8356 \text{ cm}^4 = 17\,548$ kNm², és nyírási alakváltozás nélkül a tankönyvi eredmények: $M_A = -qL^2/8 = -20$ kNm, $R_B = 3qL/8 = 15$ kN és $\varphi_B = qL^3/(48EI)$.

::model-figure{caption="Befogott–görgős tartó, IPE 300, 10 kN/m: M = −20 kNm A-ban és +11,25 kNm 2,5 m-nél, a támaszerők 25 kN és 15 kN"}
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

## A modelltől az elmozdulásokig {#from-model-to-displacements}

::div{.steps}
### A szabadságfokok számozása {#number-the-degrees-of-freedom}

Minden csomópont azokat a szabadságfokokat kapja, amelyekre az elemeinek szüksége van. Minden elem [gerendaelem](/hu/elements/beam), így minden csomópontnak van `Dx`, `Dz` és `Ry` szabadságfoka. A számítómag csomópontonként először a **szabad**, utánuk a **megtámasztott** szabadságfokokat számozza. Itt A befogott, B pedig csak függőlegesen van megtámasztva, így két szabadságfok szabad:

$$
\begin{gathered}
\mathbf{r} = \begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix},
\qquad
\mathbf{r}_u = \begin{bmatrix} u_B \\ \varphi_B \end{bmatrix}, \\[1ex]
\mathbf{r}_p = \begin{bmatrix} u_A & w_A & \varphi_A & w_B \end{bmatrix}^\mathsf{T}.
\end{gathered}
$$

$u$, $w$ és $\varphi$ az x és z irányú elmozdulás, illetve az elfordulás, ahogy a [szabadságfokok táblázatában](/hu/elements/conventions#degrees-of-freedom). Minden elemnek van egy **kódvektora**: hat szabadságfokának helye az $\mathbf{r}$ vektorban. 1-től számolva a tartó $(u_A, w_A, \varphi_A, u_B, w_B, \varphi_B)$ szabadságfokai a $(3, 4, 5, 1, 6, 2)$ helyeken állnak.

### Az elemmátrixok kiszámítása {#compute-the-element-matrices}

A számítómag minden elemre felépíti a [lokális merevségi mátrixot](/hu/elements/beam#local-stiffness-matrix), kondenzálja az esetleges [rúdvégi csuklókat](/hu/elements/beam#end-hinges), és globális tengelyekbe transzformálja: $\mathbf{K}_g = \mathbf{T}^\mathsf{T}\mathbf{K}_l\,\mathbf{T}$. Minden rúdteherből [egyenértékű csomóponti terhek](/hu/elements/beam#element-loads) lesznek: $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. A tartónk vízszintes, így $\mathbf{T}$ az egységmátrix, az egyenletesen megoszló teher pedig kN-ban és kNm-ben

$$
\mathbf{f}_\mathrm{eq} = \begin{bmatrix} 0 \\[0.5ex] qL/2 \\[0.5ex] -qL^2/12 \\[0.5ex] 0 \\[0.5ex] qL/2 \\[0.5ex] qL^2/12 \end{bmatrix}
= \begin{bmatrix} 0 \\[0.5ex] 20 \\[0.5ex] -13{,}33 \\[0.5ex] 0 \\[0.5ex] 20 \\[0.5ex] 13{,}33 \end{bmatrix}.
$$

### Összeállítás {#assemble}

A globális merevségi mátrix, $\mathbf{K}$, kezdetben csupa nulla. Minden elem az $(i, j)$ elemét abba a sorba és oszlopba adja hozzá, amelyet a kódvektora $i$-hez és $j$-hez rendel, így ahol egy csomópontban több elem találkozik, a csomópont szabadságfokaihoz tartozó merevségeik összeadódnak. Az $\mathbf{F}$ tehervektor ugyanígy gyűjti össze a csomóponti terheket és az egyenértékű csomóponti terheket. Az előírt elmozdulások (támaszsüllyedések) az $\mathbf{r}_p$ vektorba kerülnek. „Előbb a szabadok, aztán a megtámasztottak” sorrendben a rendszer blokkokra bomlik:

$$
\begin{bmatrix} \mathbf{K}_{uu} & \mathbf{K}_{up} \\ \mathbf{K}_{pu} & \mathbf{K}_{pp} \end{bmatrix}
\begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix}
=
\begin{bmatrix} \mathbf{F}_u \\ \mathbf{F}_p + \mathbf{R} \end{bmatrix},
$$

ahol $\mathbf{R}$ az ismeretlen támaszerők vektora. A példában $\mathbf{K}_{uu}$-ba csak a tartó B véghez tartozó sorai és oszlopai kerülnek:

$$
\begin{aligned}
\mathbf{K}_{uu} &= \begin{bmatrix} EA/L & 0 \\ 0 & 4EI/L \end{bmatrix} \\[1ex]
&= \begin{bmatrix} 282\,450 \text{ kN/m} & 0 \\ 0 & 17\,548 \text{ kNm} \end{bmatrix}, \\[1ex]
\mathbf{F}_u &= \begin{bmatrix} 0 \\ 13{,}33 \text{ kNm} \end{bmatrix}.
\end{aligned}
$$

### A támaszok figyelembevétele és a megoldás {#apply-the-supports-and-solve}

A támaszok nem rugók, és nem is nagy számok a főátlóban: a megtámasztott szabadságfokokat egyszerűen leválasztjuk. A szabad elmozdulások a

$$
\mathbf{K}_{uu}\,\mathbf{r}_u = \mathbf{F}_u - \mathbf{K}_{up}\,\mathbf{r}_p
$$

egyenletrendszerből adódnak, amelyet a számítómag LU-felbontással old meg. Támaszsüllyedés nélkül $\mathbf{r}_p = \mathbf{0}$, és itt

$$
\varphi_B = \frac{13{,}33}{17\,548} = 7{,}598 \times 10^{-4} \text{ rad},
$$

ami a tankönyvi $qL^3/(48EI)$, valamint $u_B = 0$.

### A támaszerők kiszámítása {#compute-the-reactions}

Ha minden elmozdulás ismert, a megtámasztott szabadságfokok sorai adják a támaszerőket, vagyis azokat az erőket, amelyekkel a támaszok a szerkezetre hatnak:

$$
\mathbf{R} = \mathbf{K}_{pu}\,\mathbf{r}_u + \mathbf{K}_{pp}\,\mathbf{r}_p - \mathbf{F}_p.
$$

$w_A$-ra a $\mathbf{K}_{pu}$ sorában a $\varphi_B$ oszlopában $-6EI/L^2$ áll, $\mathbf{F}_p$-ben pedig $qL/2$:

$$
\begin{aligned}
R_{wA} &= -\frac{6EI}{L^2}\,\varphi_B - \frac{qL}{2} \\
&= -5 - 20 = -25 \text{ kN},
\end{aligned}
$$

ami 25 kN felfelé (a z tengely lefelé mutat). Ugyanígy $R_{\varphi A} = +20$ kNm és $R_{wB} = -15$ kN: a tankönyvi $qL^2/8$ és $3qL/8$.
::

## Eredmények a rudak mentén {#results-along-the-members}

A számítómag minden elemre kiveszi az $\mathbf{r}$ vektorból a rúdvégi elmozdulásokat, lokális tengelyekbe transzformálja őket, $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, és kiszámítja a [rúdvégi erőket](/hu/elements/conventions#end-forces-element-results-table):

$$
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix}.
$$

A példában $\mathbf{d}_l = [0,\ 0,\ 0,\ 0,\ 0,\ \varphi_B]^\mathsf{T}$ alapján $Z_{12} = -25$ kN, $M_{12} = 20$ kNm, $Z_{21} = -15$ kN és $M_{21} = 0$.

Az igénybevételek bármely $x$ helyen ezután az elem kezdete és az $x$ hely közötti darab egyensúlyából adódnak: a kezdőponton ható erőkből és a darabra ható teherből.

$$
\begin{aligned}
N(x) &= -X_{12} + N_q(x), \\
V(x) &= -Z_{12} + V_q(x), \\
M(x) &= -M_{12} - Z_{12}\,x + M_q(x),
\end{aligned}
$$

ahol $N_q$, $V_q$ és $M_q$ a darabra ható terhekből származik. Egyenletesen megoszló $q_z$ teherre, $q_1$-től $q_2$-ig változó trapéz alakú teherre ($\Delta q = q_2 - q_1$), valamint $a$ távolságban ható $F_z$ erőre vagy $M_y$ nyomatékra, amelyek csak $x \ge a$ esetén hatnak:

$$
\begin{array}{l|cc}
\text{Teher} & V_q(x) & M_q(x) \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -q_z\,x & -\dfrac{q_z\,x^2}{2} \\[3ex]
q_1 \to q_2 & -q_1 x - \dfrac{\Delta q\,x^2}{2L} & -\dfrac{q_1 x^2}{2} - \dfrac{\Delta q\,x^3}{6L} \\[3ex]
F_z,\ M_y & -F_z & -F_z\,(x-a) - M_y
\end{array}
$$

$N_q$ ugyanúgy számítható, mint $V_q$, csak $q_z$ és $F_z$ helyett a $q_x$ és $F_x$ tengelyirányú összetevőkkel.

A példában $M(x) = -20 + 25\,x - 5\,x^2$ kNm, amelynek maximuma $x = 2{,}5$ m-nél $11{,}25$ kNm $= 9qL^2/128$. A hőmérsékleti tehernek itt nincs saját tagja: csak a rúdvégi erőkön keresztül hat.

A lehajlás az [alakfüggvények](/hu/elements/beam#local-stiffness-matrix) és a rúdvégi elmozdulások szorzata, plusz a teher által a mindkét végén befogott elemen okozott lehajlás. A csuklós rúdvég előbb a [kondenzációból](/hu/elements/beam#end-hinges) kapja vissza saját elfordulását. Az ábrák és a deformált alak éppen ezek a függvények, minden rúd mentén kiértékelve.

## Miért pontosak az eredmények {#exact}

A fenti lépések mindegyike pontos a megoldott modellre:

- Az elem merevsége a prizmatikus Timoshenko-rúd **pontos megoldásából** származik, nem feltételezett polinomiális alakokból, így az a rúd valódi merevsége.
- A befogási erők minden tehertípusra a befogott rúd pontos megoldásai, így az egyenértékű csomóponti terhek semmit sem veszítenek.
- A csomóponti elmozdulások ezért pontosak, a csomópontok közötti igénybevételek pedig a tényleges teher egyensúlyából adódnak, így ezek is pontosak.

Ezért az EduBeam sosem kéri, hogy finomítsd a hálót: rudanként egy elem ugyanazt az eredményt adja, mint száz. Csomópont csak ott kell, ahol maga a rúd változik: támasznál, csuklónál, saroknál vagy keresztmetszet-váltásnál. A közöttük ható koncentrált erő maradhat rúdteher. Az egyetlen megmaradó hiba a lebegőpontos kerekítés; az eredménytáblázatok 0-nak mutatják azokat az értékeket, amelyek az azonos fajtájú legnagyobb érték $10^{-12}$-szeresénél kisebbek.

A „pontos” a modellre vonatkozik, a modellnek pedig megvannak a korlátai:

::div{.limits}
- **Lineárisan rugalmas anyag** és **kis elmozdulások**: az egyensúlyt az alakváltozás előtti alakon írjuk fel, így nincsenek másodrendű (P–Δ) hatások, és nincs kihajlás.
- **Egyenes, prizmatikus rudak**: elemenként egy keresztmetszet. A változó keresztmetszetű rudat több elemmel kell közelíteni.
- **Hajlítás csak az x–z síkban**: nincs csavarás, és nincs síkból kilépő viselkedés.
::

## Ha a szerkezet nem állékony {#mechanisms}

Az alakváltozás nélkül elmozdulni képes szerkezet merevségi mátrixa szinguláris, és nincs egyértelmű megoldása. Az EduBeam ezt a számítás előtt keresi, utána pedig ellenőrzi az eredményt:

1. **A számítás előtt** a szerkezet minden összefüggő részét pusztán a geometriája alapján ellenőrzi. A támaszainak meg kell akadályozniuk a síkbeli merev test három mozgását: háromnál kevesebb kényszer azt jelenti, hogy a modell egyszerűen még nincs kész (*A szerkezetet meg kell támasztani, mielőtt kiszámítható.*), a három vagy több kényszer viszont hiba, ha mégis engedi a szerkezet eltolódását vagy elfordulását (például párhuzamos görgős támaszoknál). Ezután a csuklókat ellenőrzi: ha a rudak a hosszuk megtartásával elfordulhatnak körülöttük, a szerkezet mechanizmus, és az EduBeam bekarikázza a csuklókat, és megmutatja a mozgást.
2. **A számítás közben** a pontosan szinguláris mátrix megállítja az LU-felbontást: *A szerkezet mechanizmus: a merevségi mátrix szinguláris.*
3. **A számítás után** a $10^6$ m-nél vagy rad-nál nagyobb elmozdulás vagy elfordulás azt jelzi, hogy a mátrix a kerekítéstől eltekintve szinguláris volt. Az EduBeam megnevezi az elmozduló csomópontokat és irányokat: *A szerkezet labilis, ezek a mozgások gyakorlatilag ellenállás nélkül jönnek létre: …* Ide jutsz akkor is, ha egy anyagot vagy keresztmetszetet nullával vagy rossz mértékegységben adtál meg.

Ha egy csomópontban minden rúd csuklósan csatlakozik, a csomópont elfordulásához semmi sem kapcsolódik. Ez nem mechanizmus: a számítómag ezt az elfordulást nullának veszi. Minden üzenetet és a javításuk módját a [Hibaelhárítás](/hu/reference/troubleshooting#no-results-are-drawn) oldal magyarázza el.

## Futtasd magad a számítómagot {#library}

A számítómag nyílt forráskódú: az [@edubeam/fem](/hu/solver) TypeScriptben íródott, és böngészőben és Node-ban is fut. Ugyanez a befogott–görgős tartó:

```ts
import { DofID, LinearStaticSolver, type Beam2D } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]

// SI-egységek: m, N, Pa. Acél, IPE 300; a k = 1e32 nyírásra merevvé teszi.
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // befogás
domain.createNode('B', [4, 0, 0], [DofID.Dz]) // görgős támasz
domain.createBeam2D('1', ['A', 'B'], 1, 1)
lc.createBeamElementUniformEdgeLoad('1', [0, 10_000], true) // 10 kN/m, lefelé

solver.solve()

solver.neq // 2: B Dx és Ry szabadságfoka szabad
lc.r.toArray() // [0, 0.0007598, 0, 0, 0, 0]: a szabad szabadságfokok, utána a megtámasztottak
lc.R.toArray() // [0, -25000, 20000, -15000]: A (Dx, Dz, Ry), utána B (Dz)

const beam = domain.getElement('1') as Beam2D
beam.computeEndForces(lc).toArray() // [0, -25000, 20000, 0, -15000, 0]
beam.computeBendingMomentAt(lc, 0) // -20000: N·m, felül húzott a befogásnál
beam.computeBendingMomentAt(lc, 2.5) // 11250: a legnagyobb pozitív nyomaték
```

A `solve()` után a `solver.k` tartalmazza az összeállított $\mathbf{K}$ mátrixot, a `solver.f` pedig az $\mathbf{F}$ tehervektort, hogy összevethesd őket a saját összeállításoddal. Az oldalon leírt lépések a `Solver.ts` (számozás), a `LinearStaticSolver.ts` (összeállítás, megoldás, támaszerők) és a `Beam2D.ts` (elemmátrixok és eredmények) fájlban találhatók.

::div{.actions}
[Első lépések az @edubeam/fem könyvtárral](/hu/solver/getting-started) [Mit tartalmaz](/hu/solver/reference) [Forráskód a GitHubon ↗](https://github.com/EduBeamApp/fem){target="_blank"}
::
