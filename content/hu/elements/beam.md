---
description: "Az EduBeam kétcsomópontos Timoshenko-gerendaeleme: pontos merevségi mátrix, nyírási alakváltozás, rúdvégi csuklók statikus kondenzációval, befogási erők, transzformáció."
source: site
---

# Gerendaelem

Az EduBeamben minden rúd, legyen az gerenda, oszlop vagy rácsrúd, ugyanaz az elem: egyenes, kétcsomópontos, állandó keresztmetszetű **Timoshenko-gerenda** az x–z síkban. Ez az oldal pontosan úgy írja le az elemet, ahogy a számítómag számol vele, így bármely elemmátrixot vagy tehervektort kézzel is felépíthetsz, és összevetheted az alkalmazással. Az előjelek a [Tengelyek és előjelszabály](/hu/elements/conventions) oldal szerintiek, a kód az [@edubeam/fem](/hu/solver) `Beam2D.ts` fájlja, a [Hogyan számít az EduBeam](/hu/elements/analysis) oldal pedig azt mutatja be, hogyan áll össze az elemekből a megoldás.

## Szabadságfokok {#degrees-of-freedom}

Minden csomópontnak három szabadságfoka van, így az elemnek hat. Az elem [lokális tengelyeiben](/hu/elements/conventions#element-local-axes) minden rúdvégi elmozdulásnak megfelel egy [rúdvégi erő](/hu/elements/conventions#end-forces-element-results-table), vagyis az *Elemek eredményei* táblázat egy oszlopa:

::element-sketch{mode="dofs" caption="A gerendaelem hat szabadságfoka, mindegyik pozitív irányban rajzolva; a szaggatott vonal az alsó szálat jelöli (lokális +z)"}
::

| Irány | Kezdő csomópont (1) | Végcsomópont (2) |
| --- | --- | --- |
| a lokális x mentén | $u_1$ és `X12` | $u_2$ és `X21` |
| a lokális z mentén, balról jobbra rajzolt elemnél lefelé | $w_1$ és `Z12` | $w_2$ és `Z21` |
| elfordulás, az óramutató járásával ellentétesen | $\varphi_1$ és `M12` | $\varphi_2$ és `M21` |

Ebben a sorrendben alkotják az elem elmozdulás- és erővektorát:

$$
\begin{aligned}
\mathbf{d}_l &= \begin{bmatrix} u_1 & w_1 & \varphi_1 & u_2 & w_2 & \varphi_2 \end{bmatrix}^\mathsf{T}, \\
\mathbf{f} &= \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}.
\end{aligned}
$$

Mivel a z tengely lefelé mutat, az elfordulás pedig az óramutató járásával ellentétesen pozitív, a nyírási alakváltozás nélküli gerenda tengelye $\varphi = -\,\mathrm{d}w/\mathrm{d}x$ szöggel fordul el.

## Lokális merevségi mátrix {#local-stiffness-matrix}

Rúdteher nélküli elem rúdvégi erői $\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l$, ahol

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

és

$$
\begin{aligned}
k_N &= \frac{EA}{L}, & k_1 &= \frac{12\,EI_y}{(1+\Phi)\,L^3}, \\[1ex]
k_2 &= \frac{6\,EI_y}{(1+\Phi)\,L^2}, & k_3 &= \frac{(4+\Phi)\,EI_y}{(1+\Phi)\,L}, \\[1ex]
k_4 &= \frac{(2-\Phi)\,EI_y}{(1+\Phi)\,L}, & \Phi &= \frac{12\,EI_y}{k\,GA\,L^2}.
\end{aligned}
$$

$E$ az anyag rugalmassági modulusa, $G$ a nyírási rugalmassági modulusa, $A$ a keresztmetszeti terület, $I_y$ az y tengelyre számított inercianyomaték, $k$ a keresztmetszet **Nyírási tényező** értéke, $L$ pedig az elem hossza. $\Phi$ a **nyírási paraméter**: azt méri, mennyire hajlékony a rúd nyírásra a hajlításhoz képest, és annál nagyobb, minél rövidebb és magasabb a rúd. $\Phi = 0$ esetén az Euler–Bernoulli-gerenda jól ismert $12EI/L^3$, $6EI/L^2$, $4EI/L$ és $2EI/L$ tagjait kapod. A húzás-nyomás és a hajlítás nem csatolt: $u_1$ és $u_2$ csak $k_N$-nel szerepel együtt.

A felfelé mutató y tengelyt használó tankönyvekben $+6EI/L^2$ áll ott, ahol ebben a mátrixban $-k_2$. Mindkettő ugyanazt a merevséget írja le; csak a keresztirányú elmozdulás iránya más.

::callout{type="details" title="Honnan származik a mátrix: a pontos alakfüggvények"}
Terheletlen, prizmatikus Timoshenko-rúd egyensúlyi egyenleteinek van pontos megoldása: $u$ lineáris $x$-ben, $w$ harmadfokú, $\varphi$ pedig másodfokú. A rúdvégi elmozdulásokkal kifejezve, $\xi = x/L$ jelöléssel a lehajlás

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

$\Phi = 0$ esetén ezek a harmadfokú Hermite-polinomok, $N_1 = 1 - 3\xi^2 + 2\xi^3$ és $N_2 = -L\,\xi(1-\xi)^2$, ahol a mínuszjel a $\varphi = -w'$ összefüggésből ered. A merevségi mátrix éppen azokat a rúdvégi erőket tartalmazza, amelyeket ezek a pontos alakok megkövetelnek, így ez a rúd pontos merevsége, nem pedig az elemszám növelésével javuló közelítés. A számítómag ugyanezekkel a függvényekkel rajzolja meg a deformált alakot.
::

## Nyírási alakváltozás: Timoshenko vagy Euler–Bernoulli? {#timoshenko-or-euler-bernoulli}

Hogy az elemnek van-e nyírási alakváltozása, az csak $\Phi$-től, vagyis a keresztmetszet $k$ nyírási tényezőjétől függ: $kA$ a nyírást viselő terület. Minden keresztmetszetfajta saját $k$ értékkel indul:

| Keresztmetszet | Nyírási tényező $k$ |
| --- | --- |
| Az induló modell és a beépített példák | $10^{32}$, amivel $\Phi \approx 0$: Euler–Bernoulli |
| I-, H- és széles övű szelvények a könyvtárból | $h\,t_w / A$: a nyírást a gerinc viseli |
| Négyszög zártszelvények a könyvtárból | $2\,h\,t / A$: a két oldalfal |
| Téglalapok és négyzetek a könyvtárból | 0,833 |
| Körök a könyvtárból | 0,9 |
| Kör zártszelvények a könyvtárból | 0,5 |
| Sokszög keresztmetszetek | kezdetben 0,833 |
| **Keresztmetszet hozzáadása** párbeszédablak | kezdetben 1 |

Karcsú rúdnál a különbség kicsi. Egyenletesen megoszló teherrel terhelt kéttámaszú tartóban a nyírás a támaszköz közepén $0{,}8\,\Phi$ arányban növeli a hajlításból származó lehajlást. Egy acél IPE 200-nál ez 6 m-en 1,2 %, 2 m-en viszont már 11 %. A nyírási alakváltozás kikapcsolásához adj $k$-nak nagyon nagy értéket, például `1e32`-t. Ha nincs másként jelezve, az oldal élő ábrái a példák nyírásra merev keresztmetszetét használják, így egyeznek az Euler–Bernoulli-elmélet szerinti kézi számításokkal. Az alábbi ábra kivétel:

::model-figure{caption="IPE 200, 2 m-es támaszköz, k = h·tw/A = 0,393: w = 0,5657 mm a támaszköz közepén, 11 %-kal több, mint az Euler–Bernoulli-elmélet szerinti 0,5106 mm (Φ = 0,135)"}
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

## Rúdvégi csuklók {#end-hinges}

A bejelölt [rúdvégi csukló](/hu/essentials/elements#end-hinges) az elem adott végén nullává teszi a nyomatékot. Az elem rúdvégi elfordulása ekkor szabad, és a számítómag **statikus kondenzációval** kiküszöböli. Osszuk a hat szabadságfokot a megtartottakra ($a$) és a felszabadított rúdvégi elfordulásokra ($b$):

$$
\begin{bmatrix} \mathbf{f}_a \\ \mathbf{0} \end{bmatrix}
=
\begin{bmatrix} \mathbf{K}_{aa} & \mathbf{K}_{ab} \\ \mathbf{K}_{ba} & \mathbf{K}_{bb} \end{bmatrix}
\begin{bmatrix} \mathbf{d}_a \\ \mathbf{d}_b \end{bmatrix}
+
\begin{bmatrix} \mathbf{f}_{\mathrm{fix},a} \\ \mathbf{f}_{\mathrm{fix},b} \end{bmatrix}.
$$

Itt $\mathbf{f}_\mathrm{fix}$ a [rúdterhekből](#element-loads) származó befogási erők. A második sorból adódik a csuklónál az elfordulás,

$$
\mathbf{d}_b = -\mathbf{K}_{bb}^{-1}\left(\mathbf{K}_{ba}\,\mathbf{d}_a + \mathbf{f}_{\mathrm{fix},b}\right),
$$

és ezt az első sorba helyettesítve megmarad a kondenzált merevség és a kondenzált befogási erők:

$$
\begin{aligned}
\mathbf{K}^{*} &= \mathbf{K}_{aa} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}, \\
\mathbf{f}^{*}_\mathrm{fix} &= \mathbf{f}_{\mathrm{fix},a} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{f}_{\mathrm{fix},b}.
\end{aligned}
$$

A számítómag a $\mathbf{K}^{*}$ mátrixot visszaírja egy 6 × 6-os mátrixba, a felszabadított elfordulások sorait és oszlopait nullával kitöltve, így a csuklós elem pontosan úgy épül be, mint bármely más. A megoldás után a fenti képletből visszaszámítja $\mathbf{d}_b$-t, és a deformált alakon a csuklónál törés látszik.

Ha a végcsomópontban van csukló, a $(w_1, \varphi_1, w_2)$ szabadságfokokhoz tartozó hajlítási rész

$$
\mathbf{K}^{*}_{w} = \frac{12\,EI_y}{(4+\Phi)\,L^3}
\begin{bmatrix} 1 & -L & -1 \\ -L & L^2 & L \\ -1 & L & 1 \end{bmatrix},
$$

ami $\Phi = 0$ esetén az egyik végén befogott, másik végén csuklós rúd klasszikus $3EI/L^3$ merevsége. Ha **mindkét** végén csukló van, a hajlítási tagokból semmi sem marad, csak az $EA/L$: az elem [rácsrúd](/hu/elements/truss).

A csukló az elem végéhez tartozik, nem a csomóponthoz. Ha egy csomópontban minden ott találkozó elem csuklós, a csomópont saját elfordulásához semmi sem kapcsolódik. A számítómag ezt az elfordulást nullának veszi, ami nem okoz gondot, de az ilyen csomópontra működtetett csomóponti nyomatéknak nincs mire hatnia, és az egyenletrendszer szingulárissá válik.

## Rúdterhek {#element-loads}

Az elem mentén ható terhek **egyenértékű csomóponti terhekként** kerülnek a megoldásba: $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. A **befogási erők** ($\mathbf{f}_\mathrm{fix}$) azok a rúdvégi erők, amelyek a mindkét végén befogott, terhelt elemet egyensúlyban tartják.

Az alábbi képletek mind lokális tengelyekre vonatkoznak. A globális tengelyekben (**LCS** bejelölés nélkül) megadott terhet a számítómag előbb lokális összetevőkre bontja az elem [szögének](#transformation-matrix) $c = \cos\theta$ és $s = \sin\theta$ értékével:

$$
q_x = c\,\bar q_x + s\,\bar q_z, \qquad q_z = -s\,\bar q_x + c\,\bar q_z,
$$

ahol a felülvonás a globális összetevőket jelöli. A vonal menti terhek az elem saját hosszának egy méterére hatnak. Egy $(0, 0)$-tól $(3, -4)$-ig tartó szarufára például $L = 5$ m, $c = 0{,}6$ és $s = -0{,}8$ (emelkedik, tehát $z$ csökken). A rá ható $\bar q_z = 10$ kN/m gravitációs teher összetevői $q_x = -8$ kN/m a lejtőn lefelé és $q_z = 6$ kN/m arra merőlegesen, a szarufa pedig összesen $10 \times 5 = 50$ kN-t visel, nem $10 \times 3$-at.

A táblázatokban:

- $q_z$, $q_x$: egyenletesen megoszló teher; $q_1 \to q_2$: trapéz alakú teher, $q_1$ a kezdő, $q_2$ a végcsomópontban.
- $F_z$, $F_x$, $M_y$: erő vagy nyomaték a kezdő csomóponttól $a$ távolságban, $b = L - a$.
- $\Delta T = \Delta T_b - \Delta T_t$: az alsó szál melegebb a felsőnél; $\Delta T_c$: a rúdtengely felmelegedése. $\alpha$ az anyag hőtágulási együtthatója, $h$ a keresztmetszet **Magasság** értéke.

A tengelyre merőlegesen (z összetevők), $\Phi = 0$ esetén, a kezdő csomópontban:

$$
\begin{array}{l|cc}
\text{Teher} & Z_{12} & M_{12} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & \dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(7q_1+3q_2)}{20} & \dfrac{L^2\,(3q_1+2q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,b^2\,(3a+b)}{L^3} & \dfrac{F_z\,a\,b^2}{L^2} \\[3ex]
M_y & -\dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,b\,(b-2a)}{L^2} \\[3ex]
\Delta T & 0 & \dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

A végcsomópontban:

$$
\begin{array}{l|cc}
\text{Teher} & Z_{21} & M_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & -\dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(3q_1+7q_2)}{20} & -\dfrac{L^2\,(2q_1+3q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,a^2\,(a+3b)}{L^3} & -\dfrac{F_z\,a^2\,b}{L^2} \\[3ex]
M_y & \dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,a\,(a-2b)}{L^2} \\[3ex]
\Delta T & 0 & -\dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

A tengely mentén (x összetevők), tetszőleges $\Phi$ esetén:

$$
\begin{array}{l|cc}
\text{Teher} & X_{12} & X_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_x & -\dfrac{q_x L}{2} & -\dfrac{q_x L}{2} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(2q_1+q_2)}{6} & -\dfrac{L\,(q_1+2q_2)}{6} \\[3ex]
F_x & -\dfrac{F_x\,b}{L} & -\dfrac{F_x\,a}{L} \\[3ex]
\Delta T_c & EA\,\alpha\,\Delta T_c & -EA\,\alpha\,\Delta T_c
\end{array}
$$

::callout{type="details" title="Befogási erők nyírási alakváltozással"}
Az egyenletesen megoszló és a hőmérsékleti teher tetszőleges $\Phi$ mellett ugyanazokat a befogási erőket adja. A többinél, $D = 1 + \Phi$ és $\Delta q = q_2 - q_1$ jelöléssel (z összetevők):

$$
\begin{aligned}
&\text{Trapéz alakú teher:} \\
Z_{12} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(9+10\Phi)}{60\,D}, \\[1ex]
M_{12} &= \frac{q_1 L^2}{12} + \frac{\Delta q\,L^2\,(4+5\Phi)}{120\,D}, \\[1ex]
Z_{21} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(21+20\Phi)}{60\,D}, \\[1ex]
M_{21} &= -\frac{q_1 L^2}{12} - \frac{\Delta q\,L^2\,(6+5\Phi)}{120\,D}; \\[3ex]
&F_z\text{ erő:} \\
Z_{12} &= -\frac{F_z\,b\,(\Phi L^2 + 3ab + b^2)}{D\,L^3}, \\[1ex]
M_{12} &= \frac{F_z\,a\,b\,(\Phi L + 2b)}{2\,D\,L^2}, \\[1ex]
Z_{21} &= -\frac{F_z\,a\,(\Phi L^2 + a^2 + 3ab)}{D\,L^3}, \\[1ex]
M_{21} &= -\frac{F_z\,a\,b\,(\Phi L + 2a)}{2\,D\,L^2}; \\[3ex]
&M_y\text{ nyomaték:} \\
Z_{12} &= -\frac{6\,a\,b\,M_y}{D\,L^3}, \qquad Z_{21} = \frac{6\,a\,b\,M_y}{D\,L^3}, \\[1ex]
M_{12} &= -\frac{M_y\,b\,(\Phi L - 2a + b)}{D\,L^2}, \\[1ex]
M_{21} &= -\frac{M_y\,a\,(\Phi L + a - 2b)}{D\,L^2}.
\end{aligned}
$$

Ezek a mindkét végén befogott Timoshenko-rúd pontos megoldásai, csakúgy, mint az a lehajlás, amelyet a számítómag minden teherhez a csomópontok között hozzáad.
::

Csuklós elemen a befogási erők $\mathbf{f}^{*}_\mathrm{fix}$-re kondenzálódnak, ahogy a [Rúdvégi csuklók](#end-hinges) részben láttuk. A végcsomópontjánál csuklós elem egyenletesen megoszló terhe például $Z_{12} = -5q_zL/8$, $M_{12} = q_zL^2/8$, $Z_{21} = -3q_zL/8$ és $M_{21} = 0$ értéket ad ($\Phi = 0$ esetén): ezek az egyik végén befogott, másik végén csuklós támaszú tartó befogási erői.

A megoldás után az elem menti igénybevételek a rúdvégi erőkből és a rá ható teher statikájából, a lehajlás pedig az alakfüggvényekből és a teher befogott elemen okozott lehajlásából adódik: lásd [Eredmények a rudak mentén](/hu/elements/analysis#results-along-the-members).

## Transzformációs mátrix {#transformation-matrix}

A globális x-től a globális z felé (a képernyőn az óramutató járásával megegyezően) mért $\theta$ szögű elemre

$$
c = \cos\theta = \frac{x_2 - x_1}{L}, \qquad s = \sin\theta = \frac{z_2 - z_1}{L},
$$

lokális rúdvégi elmozdulásai pedig a globálisakból $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$ alakban adódnak, ahol

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

Az elfordulások mindkét rendszerben azonosak. Ha egy csomópontnak van **Csomóponti koordináta-rendszer szöge** ($\beta$, [ferde támasz](/hu/essentials/nodes-supports#inclined-skewed-supports)), a $\mathbf{d}_n$ ismeretlenjei a csomópont saját, a globális x-től a globális z felé $\beta$ szöggel elforgatott tengelyeiben értendők. Globális összetevőik

$$
\mathbf{d}_g = \mathbf{T}_n\,\mathbf{d}_n, \qquad
\mathbf{T}_n = \begin{bmatrix} \cos\beta & -\sin\beta & 0 \\ \sin\beta & \cos\beta & 0 \\ 0 & 0 & 1 \end{bmatrix}
$$

a csomópont három szabadságfokára. A számítómag a $\mathbf{T}$ mátrixot jobbról megszorozza a két végcsomópont $\mathbf{T}_n$ mátrixaiból álló blokkdiagonális mátrixszal (saját tengelyek nélküli csomópontnál ez az egységmátrix), így az elem minden csomóponthoz annak saját tengelyeiben kapcsolódik.

## Globális merevségi mátrix {#global-stiffness-matrix}

Globális tengelyekben az elem merevségi mátrixa és egyenértékű csomóponti terhei

$$
\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T},
\qquad
\mathbf{f}_{\mathrm{eq},g} = \mathbf{T}^\mathsf{T}\,\mathbf{f}_\mathrm{eq},
$$

ahol csuklós elemnél $\mathbf{K}_l$ és $\mathbf{f}_\mathrm{eq}$ már kondenzált. Egy elemre a **Merevségi mátrix** ablak (az *Elemek* táblázatból vagy az elem helyi menüjéből nyitható meg) éppen $\mathbf{K}_g$-t mutatja, SI-egységekben: N/m, N és N·m. A [Hogyan számít az EduBeam](/hu/elements/analysis) oldal összeállítja ezeket a mátrixokat, és kézzel megold egy kis példát.
