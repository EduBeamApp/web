---
description: "Priehradový prút v EduBeame: nosníkový prvok s kĺbmi na oboch koncoch, prečo ide presne o klasický priehradový prvok, jeho matica tuhosti a transformačná matica."
source: site
---

# Priehradový prút

Priehradový prút prenáša iba normálovú silu. EduBeam nemá samostatný priehradový prvok: priehradový prút je [nosníkový prvok](/sk/elements/beam) so zaškrtnutými **oboma koncovými kĺbmi**. Na tejto stránke ukážeme, prečo ide presne o klasický dvojuzlový priehradový prvok, uvedieme jeho maticu tuhosti a transformačnú maticu a vysvetlíme, čo prút s kĺbmi dokáže navyše oproti učebnicovému priehradovému prútu.

::model-figure{caption="Všetky prúty majú kĺby na oboch koncoch: šikmé prúty prenášajú N = −7,071 kN, ťahadlo +5 kN a žiadny prút sa neohýba"}
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

Ak chcete v aplikácii vymodelovať priehradovú konštrukciu, zaškrtnite pri každom prúte **Kĺb na začiatku** a **Kĺb na konci** alebo oboje zaškrtnite v lište ešte predtým, ako prúty nakreslíte myšou ([koncové kĺby](/sk/essentials/elements#end-hinges)). Návod [Rovinná priehradová konštrukcia](/sk/tutorials/truss) jednu takú zostaví krok za krokom.

## Stupne voľnosti {#degrees-of-freedom}

Priehradový prút pracuje s dvoma posunutiami na každom konci, vyjadrenými v [lokálnych osiach](/sk/elements/conventions#element-local-axes) prvku:

::element-sketch{mode="dofs" :hinges='[true,true]' :rotations='false' caption="Priehradový prút: kĺby na oboch koncoch, na každom konci dve posunutia"}
::

| Smer | Počiatočný uzol (1) | Koncový uzol (2) |
| --- | --- | --- |
| v smere lokálnej osi x | $u_1$ a `X12` | $u_2$ a `X21` |
| v smere lokálnej osi z | $w_1$ a `Z12` | $w_2$ a `Z21` |

$$
\mathbf{d}_l = \begin{bmatrix} u_1 & w_1 & u_2 & w_2 \end{bmatrix}^\mathsf{T}.
$$

Uzly si pootočenie `Ry` ponechávajú, pretože každý prút je nosníkový prvok, ale prút s kĺbmi na oboch koncoch na pootočenie nereaguje a neprenáša ho: jeho koncové momenty `M12` a `M21` sú vždy nulové. V uzle, kde sú kĺbovo pripojené všetky prúty, toto pootočenie nič nedrží. Riešič ho ponechá nulové, ale uzlový moment zadaný v takom uzle nemá na čo pôsobiť a výpočet zastaví hlásením *Konštrukcia je mechanizmus: matica tuhosti je singulárna.*

## Lokálna matica tuhosti {#local-stiffness-matrix}

$$
\mathbf{K}_l = \frac{EA}{L}
\begin{bmatrix}
 1 & 0 & -1 & 0 \\
 0 & 0 & 0 & 0 \\
 -1 & 0 & 1 & 0 \\
 0 & 0 & 0 & 0
\end{bmatrix},
$$

kde $E$ je modul pružnosti, $A$ plocha prierezu a $L$ dĺžka prúta. Deformačná energia vzniká len pri predĺžení prúta, takže normálová sila v prúte bez prvkového zaťaženia je konštantná:

$$
N = \frac{EA}{L}\,(u_2 - u_1).
$$

### Prečo je nosník s dvoma kĺbmi priehradový prút {#why-a-beam-with-two-hinges-is-a-truss-bar}

Skondenzujte z [matice tuhosti nosníka](/sk/elements/beam#local-stiffness-matrix) obe koncové pootočenia, rovnako ako pri každom [koncovom kĺbe](/sk/elements/beam#end-hinges). Osové členy od pootočení nezávisia a zostanú bez zmeny. Ohybové členy úplne vymiznú: len čo sú obe pootočenia voľné, ľubovoľná dvojica koncových posunutí $w_1$, $w_2$ prút iba pootočí ako tuhé teleso okolo kĺbov a žiadna deformačná energia pritom nevzniká. Riešič túto kondenzáciu vykonáva numericky, pre ľubovoľný šmykový súčiniteľ, a dostane uvedenú maticu až na chyby zaokrúhlenia.

::callout{type="details" title="Kondenzácia krok za krokom"}
Pri ohybovej časti rozdeľte stupne voľnosti na ponechané, $a = (w_1, w_2)$, a uvoľnené, $b = (\varphi_1, \varphi_2)$. Z matice nosníka, s $k_1$ až $k_4$ a parametrom šmykovej poddajnosti $\Phi$ definovanými [na stránke nosníkového prvku](/sk/elements/beam#local-stiffness-matrix), dostanete

$$
\begin{aligned}
\mathbf{K}_{aa} &= k_1 \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{ab} &= k_2 \begin{bmatrix} -1 & -1 \\ 1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{bb} &= \begin{bmatrix} k_3 & k_4 \\ k_4 & k_3 \end{bmatrix}.
\end{aligned}
$$

Keďže $\mathbf{K}_{ab}$ má dva rovnaké stĺpce, záleží len na súčte prvkov matice $\mathbf{K}_{bb}^{-1}$, ktorý sa rovná $2/(k_3 + k_4)$:

$$
\mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}
= \frac{2\,k_2^2}{k_3 + k_4} \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}.
$$

S $k_3 + k_4 = 6EI_y / ((1+\Phi)L)$ sa činiteľ rovná $\dfrac{12\,EI_y}{(1+\Phi)L^3} = k_1$, takže súčin je presne $\mathbf{K}_{aa}$ a skondenzovaná ohybová tuhosť $\mathbf{K}_{aa} - \mathbf{K}_{ab}\mathbf{K}_{bb}^{-1}\mathbf{K}_{ba}$ je nulová.
::

## Transformačná matica {#transformation-matrix}

Pre prút sklonený o uhol $\theta$ od globálnej osi x ku globálnej osi z, s $c = \cos\theta = (x_2 - x_1)/L$ a $s = \sin\theta = (z_2 - z_1)/L$, sú lokálne posunutia $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, kde

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 \\
 -s & c & 0 & 0 \\
 0 & 0 & c & s \\
 0 & 0 & -s & c
\end{bmatrix}:
$$

sú to riadky a stĺpce posunutí z [transformačnej matice nosníka](/sk/elements/beam#transformation-matrix). Pozor na znamienko $s$, keď os z smeruje nadol: šikmý prút A → C priehradovej konštrukcie vyššie stúpa, takže $z_2 - z_1 = -3$ m, $c = 0{,}7071$ a $s = -0{,}7071$.

## Globálna matica tuhosti {#global-stiffness-matrix}

$\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T}$ po roznásobení dáva

$$
\mathbf{K}_g = \frac{EA}{L}
\begin{bmatrix}
 c^2 & cs & -c^2 & -cs \\
 cs & s^2 & -cs & -s^2 \\
 -c^2 & -cs & c^2 & cs \\
 -cs & -s^2 & cs & s^2
\end{bmatrix}.
$$

Okno **Matica tuhosti** ukazuje pri prúte s kĺbmi tieto čísla v riadkoch a stĺpcoch posunutí a pre pootočenia nuly.

## Čo nosník s kĺbmi dokáže navyše oproti priehradovému prútu {#where-a-hinged-beam-does-more}

Keďže priehradový prút je v EduBeame stále nosníkový prvok, dokáže dve veci, ktoré učebnicový priehradový prút nedokáže:

- **Niesť zaťaženie po svojej dĺžke.** Spojité zaťaženie prúta, napríklad jeho vlastná tiaž, ohýba prút medzi uzlami ako prostý nosník a do každého uzla odovzdá $qL/2$. Ostatné prúty prenášajú normálové sily priehradovej konštrukcie od týchto uzlových zaťažení. V samotnom zaťaženom prúte spôsobí zložka zaťaženia v smere prúta lineárny priebeh $N$ a osová sila, ktorú by dal výpočet priehradovej konštrukcie, je hodnota $N$ v strede dĺžky prúta.
- **Kombinovať sa s nosníkmi.** Rám môže obsahovať prúty s kĺbmi, napríklad ťahadlo alebo stužujúcu diagonálu, bez toho, aby potreboval osobitný typ prvku.

Pridajte na ťahadlo priehradovej konštrukcie vyššie zaťaženie 5 kN/m:

::model-figure{caption="Tá istá priehradová konštrukcia s 5 kN/m na ťahadle: normálové sily sa nezmenia a ťahadlo sa ohýba momentom M = qL²/8 = 22,5 kNm"}
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

Ručná kontrola: v uzle C dáva zvislá podmienka rovnováhy $2\,N \sin 45^\circ + 10 = 0$ silu $N = -7{,}071$ kN v každom šikmom prúte. V uzle A vyrovnáva vodorovnú zložku sily v šikmom prúte, $7{,}071 \cos 45^\circ = 5$ kN, ťahadlo ťahané silou $N = +5$ kN. Zaťaženie ťahadla ide priamo do podpier na jeho koncoch: ku každej reakcii pridá $qL/2 = 15$ kN, k normálovým silám však nič.

Priehradová konštrukcia musí byť stabilná ako kĺbová sústava. Napríklad štvorcové pole bez diagonály je mechanizmus: EduBeam vymenuje kĺby a ukáže pohyb (pozrite [Riešenie problémov](/sk/reference/troubleshooting#no-results-are-drawn)).
