---
description: "Příhradový prut v EduBeamu: nosníkový prvek s klouby na obou koncích, proč jde přesně o klasický příhradový prvek, jeho matice tuhosti a transformační matice."
source: site
---

# Příhradový prut

Příhradový prut přenáší pouze normálovou sílu. EduBeam nemá samostatný příhradový prvek: příhradový prut je [nosníkový prvek](/cs/elements/beam) se zaškrtnutými **oběma koncovými klouby**. Na této stránce ukážeme, proč jde přesně o klasický dvouuzlový příhradový prvek, uvedeme jeho matici tuhosti a transformační matici a vysvětlíme, co prut s klouby dokáže navíc oproti učebnicovému příhradovému prutu.

::model-figure{caption="Všechny pruty mají klouby na obou koncích: šikmé pruty přenášejí N = −7,071 kN, táhlo +5 kN a žádný prut se neohýbá"}
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

Chcete-li v aplikaci vymodelovat příhradovou konstrukci, zaškrtněte u každého prutu **Kloub na začátku** a **Kloub na konci**, nebo obojí zaškrtněte v liště ještě předtím, než pruty nakreslíte myší ([koncové klouby](/cs/essentials/elements#end-hinges)). [Návod pro rovinnou příhradovou konstrukci](/cs/tutorials/truss) jednu takovou sestaví krok za krokem.

## Stupně volnosti {#degrees-of-freedom}

Příhradový prut pracuje se dvěma posuny na každém konci, vyjádřenými v [lokálních osách](/cs/elements/conventions#element-local-axes) prvku:

::element-sketch{mode="dofs" :hinges='[true,true]' :rotations='false' caption="Příhradový prut: klouby na obou koncích, na každém konci dva posuny"}
::

| Směr | Počáteční uzel (1) | Koncový uzel (2) |
| --- | --- | --- |
| ve směru lokální osy x | $u_1$ a `X12` | $u_2$ a `X21` |
| ve směru lokální osy z | $w_1$ a `Z12` | $w_2$ a `Z21` |

$$
\mathbf{d}_l = \begin{bmatrix} u_1 & w_1 & u_2 & w_2 \end{bmatrix}^\mathsf{T}.
$$

Uzly si pootočení `Ry` ponechávají, protože každý prut je nosníkový prvek, ale prut s klouby na obou koncích na pootočení nereaguje a nepřenáší ho: jeho koncové momenty `M12` a `M21` jsou vždy nulové. Ve styčníku, kde jsou kloubově připojeny všechny pruty, toto pootočení nic nedrží. Řešič ho ponechá nulové, ale uzlový moment zadaný v takovém styčníku nemá na co působit a výpočet zastaví hlášením *Konstrukce je mechanismus: matice tuhosti je singulární.*

## Lokální matice tuhosti {#local-stiffness-matrix}

$$
\mathbf{K}_l = \frac{EA}{L}
\begin{bmatrix}
 1 & 0 & -1 & 0 \\
 0 & 0 & 0 & 0 \\
 -1 & 0 & 1 & 0 \\
 0 & 0 & 0 & 0
\end{bmatrix},
$$

kde $E$ je modul pružnosti, $A$ plocha průřezu a $L$ délka prutu. Deformační energie vzniká jen při protažení prutu, takže normálová síla v prutu bez prvkového zatížení je konstantní:

$$
N = \frac{EA}{L}\,(u_2 - u_1).
$$

### Proč je nosník se dvěma klouby příhradový prut {#why-a-beam-with-two-hinges-is-a-truss-bar}

Zkondenzujte z [matice tuhosti nosníku](/cs/elements/beam#local-stiffness-matrix) obě koncová pootočení, stejně jako u každého [koncového kloubu](/cs/elements/beam#end-hinges). Osové členy na pootočení nezávisejí a zůstanou beze změny. Ohybové členy úplně vymizí: jakmile jsou obě pootočení volná, libovolná dvojice koncových posunů $w_1$, $w_2$ prut jen pootočí jako tuhé těleso kolem jeho kloubů a žádná deformační energie přitom nevzniká. Řešič tuto kondenzaci provádí numericky, pro libovolný smykový součinitel, a dostane výše uvedenou matici až na zaokrouhlovací chyby.

::callout{type="details" title="Kondenzace krok za krokem"}
U ohybové části seřaďte stupně volnosti na ponechané, $a = (w_1, w_2)$, a uvolněné, $b = (\varphi_1, \varphi_2)$. Z matice nosníku, s $k_1$ až $k_4$ a parametrem smykové poddajnosti $\Phi$ definovanými [na stránce nosníkového prvku](/cs/elements/beam#local-stiffness-matrix), dostanete

$$
\begin{aligned}
\mathbf{K}_{aa} &= k_1 \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{ab} &= k_2 \begin{bmatrix} -1 & -1 \\ 1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{bb} &= \begin{bmatrix} k_3 & k_4 \\ k_4 & k_3 \end{bmatrix}.
\end{aligned}
$$

Protože $\mathbf{K}_{ab}$ má dva stejné sloupce, záleží jen na součtu prvků matice $\mathbf{K}_{bb}^{-1}$, který je roven $2/(k_3 + k_4)$:

$$
\mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}
= \frac{2\,k_2^2}{k_3 + k_4} \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}.
$$

S $k_3 + k_4 = 6EI_y / ((1+\Phi)L)$ je činitel roven $\dfrac{12\,EI_y}{(1+\Phi)L^3} = k_1$, takže součin je přesně $\mathbf{K}_{aa}$ a kondenzovaná ohybová tuhost $\mathbf{K}_{aa} - \mathbf{K}_{ab}\mathbf{K}_{bb}^{-1}\mathbf{K}_{ba}$ je nulová.
::

## Transformační matice {#transformation-matrix}

Pro prut skloněný o úhel $\theta$ od globální osy x ke globální ose z, s $c = \cos\theta = (x_2 - x_1)/L$ a $s = \sin\theta = (z_2 - z_1)/L$, jsou lokální posuny $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, kde

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 \\
 -s & c & 0 & 0 \\
 0 & 0 & c & s \\
 0 & 0 & -s & c
\end{bmatrix}:
$$

jsou to řádky a sloupce posunů z [transformační matice nosníku](/cs/elements/beam#transformation-matrix). Pozor na znaménko $s$, když osa z míří dolů: šikmý prut A → C příhradové konstrukce výše stoupá, takže $z_2 - z_1 = -3$ m, $c = 0{,}7071$ a $s = -0{,}7071$.

## Globální matice tuhosti {#global-stiffness-matrix}

$\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T}$ po roznásobení dává

$$
\mathbf{K}_g = \frac{EA}{L}
\begin{bmatrix}
 c^2 & cs & -c^2 & -cs \\
 cs & s^2 & -cs & -s^2 \\
 -c^2 & -cs & c^2 & cs \\
 -cs & -s^2 & cs & s^2
\end{bmatrix}.
$$

Okno **Matice tuhosti** ukazuje u prutu s klouby tato čísla v řádcích a sloupcích posunů a pro pootočení nuly.

## Co nosník s klouby umí navíc oproti příhradovému prutu {#where-a-hinged-beam-does-more}

Protože je příhradový prut v EduBeamu pořád nosníkový prvek, dokáže dvě věci, které učebnicový příhradový prut neumí:

- **Nést zatížení po své délce.** Spojité zatížení prutu, například jeho vlastní tíha, ohýbá prut mezi styčníky jako prostý nosník a do každého styčníku předá $qL/2$. Ostatní pruty přenášejí normálové síly příhradové konstrukce od těchto styčníkových zatížení. V samotném zatíženém prutu způsobí složka zatížení ve směru prutu lineární průběh $N$ a osová síla, kterou by dal výpočet příhradové konstrukce, je hodnota $N$ uprostřed délky prutu.
- **Kombinovat se s nosníky.** Rám může obsahovat pruty s klouby, například táhlo nebo ztužující diagonálu, aniž by potřeboval zvláštní typ prvku.

Přidejte na táhlo příhradové konstrukce výše zatížení 5 kN/m:

::model-figure{caption="Tatáž příhradová konstrukce s 5 kN/m na táhle: normálové síly se nezmění a táhlo se ohýbá momentem M = qL²/8 = 22,5 kNm"}
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

Ruční kontrola: ve styčníku C dává svislá podmínka rovnováhy $2\,N \sin 45^\circ + 10 = 0$ sílu $N = -7{,}071$ kN v každém šikmém prutu. Ve styčníku A vyrovnává vodorovnou složku síly v šikmém prutu, $7{,}071 \cos 45^\circ = 5$ kN, táhlo tažené silou $N = +5$ kN. Zatížení táhla jde přímo do podpor na jeho koncích: ke každé reakci přidá $qL/2 = 15$ kN, k normálovým silám však nic.

Příhradová konstrukce musí být stabilní jako kloubová soustava. Například čtvercové pole bez diagonály je mechanismus: EduBeam vypíše klouby a ukáže pohyb ([řešení potíží](/cs/reference/troubleshooting#no-results-are-drawn)).
