---
description: "Rácsrúd az EduBeamben: mindkét végén csuklós gerendaelem, miért azonos pontosan a klasszikus rácsrúdelemmel, merevségi és transzformációs mátrixa."
source: site
---

# Rácsrúdelem

A rácsrúd csak tengelyirányú erőt visel. Az EduBeamben nincs külön rácsrúdelem: a rácsrúd egy [gerendaelem](/hu/elements/beam), amelynek **mindkét rúdvégi csuklója** be van jelölve. Ez az oldal megmutatja, miért azonos ez pontosan a klasszikus kétcsomópontos rácsrúdelemmel, megadja a merevségi és a transzformációs mátrixát, és elmagyarázza, mire képes a csuklós rúd, amire a tankönyvi rácsrúd nem.

::model-figure{caption="Minden rúd mindkét végén csuklós: a ferde rudakban N = −7,071 kN, a vonórúdban +5 kN, és egyik rúd sem hajlik"}
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

Ha az alkalmazásban rácsos tartót akarsz modellezni, minden rúdnál jelöld be a **Csukló a kezdőpontban** és a **Csukló a végpontban** mezőt, vagy jelöld be mindkettőt a felső sávban, mielőtt egérrel megrajzolod a rudakat ([rúdvégi csuklók](/hu/essentials/elements#end-hinges)). A [Síkbeli rácsos tartó](/hu/tutorials/truss) oktatóanyag lépésről lépésre felépít egyet.

## Szabadságfokok {#degrees-of-freedom}

A rácsrúd mindkét végén a két eltolódással dolgozik, a [lokális tengelyeiben](/hu/elements/conventions#element-local-axes):

::element-sketch{mode="dofs" :hinges='[true,true]' :rotations='false' caption="Rácsrúd: mindkét végén csuklós, mindkét végén két eltolódással"}
::

| Irány | Kezdő csomópont (1) | Végcsomópont (2) |
| --- | --- | --- |
| a lokális x mentén | $u_1$ és `X12` | $u_2$ és `X21` |
| a lokális z mentén | $w_1$ és `Z12` | $w_2$ és `Z21` |

$$
\mathbf{d}_l = \begin{bmatrix} u_1 & w_1 & u_2 & w_2 \end{bmatrix}^\mathsf{T}.
$$

A csomópontok megtartják az `Ry` elfordulásukat, mert minden rúd gerendaelem, de a mindkét végén csuklós rúd ezt sem nem érzékeli, sem nem adja tovább: az `M12` és `M21` rúdvégi nyomatéka mindig nulla. Abban a csomópontban, ahol minden rúd csuklós, semmi sem rögzíti ezt az elfordulást. A számítómag ezt az elfordulást nullának veszi, de az ilyen csomópontra működtetett csomóponti nyomatéknak nincs mire hatnia, és a számítás *A szerkezet mechanizmus: a merevségi mátrix szinguláris.* üzenettel leáll.

## Lokális merevségi mátrix {#local-stiffness-matrix}

$$
\mathbf{K}_l = \frac{EA}{L}
\begin{bmatrix}
 1 & 0 & -1 & 0 \\
 0 & 0 & 0 & 0 \\
 -1 & 0 & 1 & 0 \\
 0 & 0 & 0 & 0
\end{bmatrix},
$$

ahol $E$ a rugalmassági modulus, $A$ a keresztmetszeti terület, $L$ pedig a hossz. Alakváltozási energiát csak a rúd megnyúlása vagy rövidülése tárol, ezért a rúdteher nélküli rúd normálereje állandó:

$$
N = \frac{EA}{L}\,(u_2 - u_1).
$$

### Miért rácsrúd a két csuklóval ellátott gerenda {#why-a-beam-with-two-hinges-is-a-truss-bar}

Kondenzáld ki mindkét rúdvégi elfordulást a [gerenda merevségi mátrixából](/hu/elements/beam#local-stiffness-matrix), ahogy bármely [rúdvégi csuklónál](/hu/elements/beam#end-hinges). A tengelyirányú tagok nem függenek az elfordulásoktól, így változatlanok maradnak. A hajlítási tagok teljesen eltűnnek: ha mindkét elfordulás szabad, a $w_1$, $w_2$ rúdvégi elmozdulások bármely párja csak merev testként forgatja el a rudat a csuklói körül, ami nem jár alakváltozási energiával. A számítómag ezt a kondenzációt numerikusan, tetszőleges nyírási tényezőre elvégzi, és a kerekítési hibáktól eltekintve a fenti mátrixot kapja.

::callout{type="details" title="A kondenzáció lépésről lépésre"}
A hajlítási részben rendezd a szabadságfokokat megtartottakra, $a = (w_1, w_2)$, és felszabadítottakra, $b = (\varphi_1, \varphi_2)$. A gerenda mátrixából, az [ott](/hu/elements/beam#local-stiffness-matrix) definiált $k_1$–$k_4$ tagokkal és $\Phi$ nyírási paraméterrel

$$
\begin{aligned}
\mathbf{K}_{aa} &= k_1 \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{ab} &= k_2 \begin{bmatrix} -1 & -1 \\ 1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{bb} &= \begin{bmatrix} k_3 & k_4 \\ k_4 & k_3 \end{bmatrix}.
\end{aligned}
$$

Mivel $\mathbf{K}_{ab}$ két oszlopa egyenlő, csak a $\mathbf{K}_{bb}^{-1}$ elemeinek összege számít, ami $2/(k_3 + k_4)$:

$$
\mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}
= \frac{2\,k_2^2}{k_3 + k_4} \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}.
$$

$k_3 + k_4 = 6EI_y / ((1+\Phi)L)$ mellett a szorzó $\dfrac{12\,EI_y}{(1+\Phi)L^3} = k_1$, így ez pontosan $\mathbf{K}_{aa}$, a kondenzált hajlítási merevség, $\mathbf{K}_{aa} - \mathbf{K}_{ab}\mathbf{K}_{bb}^{-1}\mathbf{K}_{ba}$ pedig nulla.
::

## Transzformációs mátrix {#transformation-matrix}

A globális x-től a globális z felé mért $\theta$ szögű rúdra, $c = \cos\theta = (x_2 - x_1)/L$ és $s = \sin\theta = (z_2 - z_1)/L$ jelöléssel, a lokális elmozdulások $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, ahol

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 \\
 -s & c & 0 & 0 \\
 0 & 0 & c & s \\
 0 & 0 & -s & c
\end{bmatrix}:
$$

ezek a [gerenda transzformációs mátrixának](/hu/elements/beam#transformation-matrix) eltolódásokhoz tartozó sorai és oszlopai. Lefelé mutató z tengelynél figyelj $s$ előjelére: a fenti rácsos tartó A → C ferde rúdja emelkedik, így $z_2 - z_1 = -3$ m, $c = 0{,}7071$ és $s = -0{,}7071$.

## Globális merevségi mátrix {#global-stiffness-matrix}

A $\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T}$ szorzat kifejtve

$$
\mathbf{K}_g = \frac{EA}{L}
\begin{bmatrix}
 c^2 & cs & -c^2 & -cs \\
 cs & s^2 & -cs & -s^2 \\
 -c^2 & -cs & c^2 & cs \\
 -cs & -s^2 & cs & s^2
\end{bmatrix}.
$$

Csuklós rúdnál a **Merevségi mátrix** ablak ezeket a számokat mutatja az eltolódások soraiban és oszlopaiban, az elfordulásoknál pedig nullákat.

## Mire képes a csuklós gerenda a rácsrúdon túl {#where-a-hinged-beam-does-more}

Mivel az EduBeamben a rácsrúd továbbra is gerendaelem, két olyan dologra képes, amire a tankönyvi rácsrúd nem:

- **A hossza mentén terhet visel.** A rúdra ható vonal menti teher, például az önsúlya, a csomópontok között kéttámaszú tartóként hajlítja a rudat, és mindkét csomópontra $qL/2$-t ad át. Ezekből a csomóponti terhekből a többi rúdban a rácsos tartó szokásos normálerői keletkeznek. Magában a terhelt rúdban a teher rúdirányú összetevője miatt $N$ lineárisan változik, és a rácsos tartóként számított rúderő ennek a rúd felezőpontjában vett értéke.
- **Gerendákkal együtt használható.** Egy keretben csuklós rudak is lehetnek, például vonórúd vagy ferde merevítés, külön elemtípus nélkül.

Tegyél 5 kN/m terhet a fenti rácsos tartó vonórúdjára:

::model-figure{caption="Ugyanaz a rácsos tartó 5 kN/m teherrel a vonórúdon: a normálerők nem változnak, a vonórúd pedig M = qL²/8 = 22,5 kNm nyomatékkal hajlik"}
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

Kézi ellenőrzés: C-ben a függőleges egyensúlyi egyenlet, $2\,N \sin 45^\circ + 10 = 0$, mindkét ferde rúdban $N = -7{,}071$ kN-t ad. A-ban a ferde rúd vízszintes összetevőjét, $7{,}071 \cos 45^\circ = 5$ kN-t, a vonórúd egyensúlyozza, amelyben $N = +5$ kN húzóerő ébred. A vonórúd terhe közvetlenül a végein lévő támaszokba jut: mindkét támaszerőhöz $qL/2 = 15$ kN-t ad, a normálerőkhöz viszont semmit.

A rácsos tartónak csuklós szerkezetként is stabilnak kell lennie. Egy ferde rácsrúd nélküli, négyzet alakú mező például mechanizmus: az EduBeam megnevezi a csuklókat, és megmutatja a mozgást ([Hibaelhárítás](/hu/reference/troubleshooting#no-results-are-drawn)).
