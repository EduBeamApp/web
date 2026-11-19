---
description: "Dvouuzlový Timošenkův nosníkový prvek v EduBeamu: přesná matice tuhosti, smyková deformace, koncové klouby statickou kondenzací, primární síly a transformace."
source: site
---

# Nosníkový prvek

Každý prut v EduBeamu, ať je to nosník, sloup, nebo příhradový prut, je tentýž prvek: přímý dvouuzlový **Timošenkův nosník** v rovině x–z s konstantním průřezem. Tato stránka uvádí jeho formulaci přesně tak, jak ji počítá řešič, takže si kteroukoli matici prvku nebo vektor zatížení můžete sestavit ručně a porovnat s aplikací. Znaménka odpovídají stránce [Souřadný systém a znaménková konvence](/cs/elements/conventions), kód najdete v souboru `Beam2D.ts` knihovny [@edubeam/fem](/cs/solver) a stránka [Jak EduBeam řeší model](/cs/elements/analysis) ukazuje, jak se z prvků poskládá řešení.

## Stupně volnosti {#degrees-of-freedom}

Každý uzel má tři stupně volnosti, prvek jich tedy má šest. V [lokálních osách](/cs/elements/conventions#element-local-axes) prvku odpovídá každému koncovému posunu jedna [koncová síla](/cs/elements/conventions#end-forces-element-results-table), tedy jeden sloupec tabulky *Výsledky na prvcích*:

::element-sketch{mode="dofs" caption="Šest stupňů volnosti nosníkového prvku, všechny nakreslené v kladném smyslu; čárkovaná čára označuje dolní vlákna (lokální +z)"}
::

| Směr | Počáteční uzel (1) | Koncový uzel (2) |
| --- | --- | --- |
| ve směru lokální osy x | $u_1$ a `X12` | $u_2$ a `X21` |
| ve směru lokální osy z, u prvku nakresleného zleva doprava dolů | $w_1$ a `Z12` | $w_2$ a `Z21` |
| pootočení, proti směru hodinových ručiček | $\varphi_1$ a `M12` | $\varphi_2$ a `M21` |

V tomto pořadí tvoří vektor koncových posunů a vektor koncových sil prvku:

$$
\begin{aligned}
\mathbf{d}_l &= \begin{bmatrix} u_1 & w_1 & \varphi_1 & u_2 & w_2 & \varphi_2 \end{bmatrix}^\mathsf{T}, \\
\mathbf{f} &= \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}.
\end{aligned}
$$

Protože osa z míří dolů a pootočení je kladné proti směru hodinových ručiček, pootočí se osa nosníku bez smykové deformace o $\varphi = -\,\mathrm{d}w/\mathrm{d}x$.

## Lokální matice tuhosti {#local-stiffness-matrix}

Koncové síly prvku bez prvkového zatížení jsou $\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l$, kde

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

a

$$
\begin{aligned}
k_N &= \frac{EA}{L}, & k_1 &= \frac{12\,EI_y}{(1+\Phi)\,L^3}, \\[1ex]
k_2 &= \frac{6\,EI_y}{(1+\Phi)\,L^2}, & k_3 &= \frac{(4+\Phi)\,EI_y}{(1+\Phi)\,L}, \\[1ex]
k_4 &= \frac{(2-\Phi)\,EI_y}{(1+\Phi)\,L}, & \Phi &= \frac{12\,EI_y}{k\,GA\,L^2}.
\end{aligned}
$$

$E$ a $G$ jsou moduly pružnosti materiálu v tahu a ve smyku, $A$ plocha průřezu, $I_y$ moment setrvačnosti k ose y, $k$ **Smykový součinitel** průřezu a $L$ délka prvku. $\Phi$ je **parametr smykové poddajnosti**: vyjadřuje, jak poddajný je prut ve smyku ve srovnání s ohybem, a roste, čím je prut kratší a vyšší. Pro $\Phi = 0$ dostanete známé členy $12EI/L^3$, $6EI/L^2$, $4EI/L$ a $2EI/L$ nosníku podle Bernoulliho–Navierovy teorie. Osové a ohybové chování na sobě nezávisejí: $u_1$ a $u_2$ jsou svázány jen přes $k_N$.

V učebnicích s osou y nahoru najdete $+6EI/L^2$ tam, kde je v této matici $-k_2$. Obě matice popisují tutéž tuhost, liší se jen kladný směr příčného posunu.

::callout{type="details" title="Odkud matice pochází: přesné tvarové funkce"}
Pro prizmatický Timošenkův prut bez zatížení mají rovnice rovnováhy přesné řešení: $u$ je lineární funkcí $x$, $w$ kubickou a $\varphi$ kvadratickou. Vyjádřený pomocí koncových posunů a s $\xi = x/L$ je průhyb

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

Pro $\Phi = 0$ jde o kubické Hermitovy polynomy, $N_1 = 1 - 3\xi^2 + 2\xi^3$ a $N_2 = -L\,\xi(1-\xi)^2$, kde znaménko minus pochází z $\varphi = -w'$. Matice tuhosti obsahuje právě ty koncové síly, které tyto přesné tvary vyžadují, a je tedy přesnou tuhostí prutu, nikoli aproximací, která se s počtem prvků zlepšuje. Stejnými funkcemi řešič kreslí i deformovaný tvar.
::

## Smyková deformace: Timošenkův nosník, nebo Bernoulliho–Navierova teorie? {#timoshenko-or-euler-bernoulli}

Zda se prvek deformuje smykem, závisí jen na $\Phi$, a tedy na smykovém součiniteli průřezu $k$: $kA$ je plocha, která přenáší smyk. Každý druh průřezu začíná s vlastní hodnotou $k$:

| Průřez | Smykový součinitel $k$ |
| --- | --- |
| Výchozí model a vestavěné příklady | $10^{32}$, takže $\Phi \approx 0$: Bernoulliho–Navierova teorie |
| Průřezy I, H a širokopřírubové průřezy z knihovny | $h\,t_w / A$: smyk přenáší stojina |
| Obdélníkové duté průřezy z knihovny | $2\,h\,t / A$: obě boční stěny |
| Obdélníky a čtverce z knihovny | 0,833 |
| Kruhy z knihovny | 0,9 |
| Kruhové duté průřezy z knihovny | 0,5 |
| Polygonální průřezy | na začátku 0,833 |
| Dialog **Přidat průřez** | na začátku 1 |

U štíhlého prutu je rozdíl malý. U prostého nosníku s rovnoměrným zatížením zvětší smyk průhyb od ohybu uprostřed rozpětí poměrně o $0{,}8\,\Phi$. U ocelového IPE 200 to při rozpětí 6 m dělá 1,2 %, při 2 m ale už 11 %. Smykovou deformaci vypnete tak, že $k$ nastavíte na velmi velké číslo, například `1e32`. Pokud není uvedeno jinak, používají živé obrázky na tomto webu smykově tuhý průřez z příkladů, takže odpovídají ručnímu výpočtu podle Bernoulliho–Navierovy teorie. Následující obrázek ne:

::model-figure{caption="IPE 200 o rozpětí 2 m s k = h·tw/A = 0,393: w = 0,5657 mm uprostřed rozpětí, o 11 % více než 0,5106 mm podle Bernoulliho–Navierovy teorie (Φ = 0,135)"}
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

## Koncové klouby {#end-hinges}

Zaškrtnutý [koncový kloub](/cs/essentials/elements#end-hinges) vynuluje moment na daném konci prvku. Koncové pootočení prvku je pak volné a řešič ho odstraní **statickou kondenzací**. Šest stupňů volnosti rozdělíme na ponechané, $a$, a na uvolněná koncová pootočení, $b$:

$$
\begin{bmatrix} \mathbf{f}_a \\ \mathbf{0} \end{bmatrix}
=
\begin{bmatrix} \mathbf{K}_{aa} & \mathbf{K}_{ab} \\ \mathbf{K}_{ba} & \mathbf{K}_{bb} \end{bmatrix}
\begin{bmatrix} \mathbf{d}_a \\ \mathbf{d}_b \end{bmatrix}
+
\begin{bmatrix} \mathbf{f}_{\mathrm{fix},a} \\ \mathbf{f}_{\mathrm{fix},b} \end{bmatrix}.
$$

Zde $\mathbf{f}_\mathrm{fix}$ jsou primární koncové síly od [prvkových zatížení](#element-loads). Druhý řádek dává pootočení v kloubu,

$$
\mathbf{d}_b = -\mathbf{K}_{bb}^{-1}\left(\mathbf{K}_{ba}\,\mathbf{d}_a + \mathbf{f}_{\mathrm{fix},b}\right),
$$

a po dosazení do prvního řádku zbude kondenzovaná matice tuhosti a kondenzované primární síly

$$
\begin{aligned}
\mathbf{K}^{*} &= \mathbf{K}_{aa} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}, \\
\mathbf{f}^{*}_\mathrm{fix} &= \mathbf{f}_{\mathrm{fix},a} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{f}_{\mathrm{fix},b}.
\end{aligned}
$$

Řešič zapíše $\mathbf{K}^{*}$ zpět do matice 6 × 6 s nulovými řádky a sloupci pro uvolněná pootočení, takže se prvek s kloubem lokalizuje do soustavy úplně stejně jako každý jiný. Po vyřešení dopočítá $\mathbf{d}_b$ z výše uvedeného vzorce a deformovaný tvar ukáže v kloubu zlom.

S kloubem v koncovém uzlu má ohybová část pro $(w_1, \varphi_1, w_2)$ tvar

$$
\mathbf{K}^{*}_{w} = \frac{12\,EI_y}{(4+\Phi)\,L^3}
\begin{bmatrix} 1 & -L & -1 \\ -L & L^2 & L \\ -1 & L & 1 \end{bmatrix},
$$

což je pro $\Phi = 0$ klasická tuhost $3EI/L^3$ prutu na jednom konci vetknutého a na druhém kloubově uloženého. S klouby na **obou** koncích z ohybových členů nezbude nic a zůstane jen $EA/L$: prvek je [příhradový prut](/cs/elements/truss).

Kloub patří ke konci prvku, ne k uzlu. Pokud jsou kloubově připojeny všechny prvky, které se v uzlu stýkají, není k vlastnímu pootočení uzlu připojeno nic. Řešič ho ponechá nulové, což nevadí, ale uzlový moment zadaný v takovém uzlu nemá na co působit a soustava je singulární.

## Prvková zatížení {#element-loads}

Zatížení po délce prvku vstupují do řešení jako **ekvivalentní uzlová zatížení**, $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. **Primární koncové síly** $\mathbf{f}_\mathrm{fix}$ jsou síly, kterými na zatížený prvek působí vetknutí na obou jeho koncích.

Všechny vzorce níže platí v lokálních osách. Zatížení zadané v globálních osách (s nezaškrtnutým **LCS**) se nejprve rozloží na lokální složky pomocí $c = \cos\theta$ a $s = \sin\theta$ [úhlu](#transformation-matrix) prvku,

$$
q_x = c\,\bar q_x + s\,\bar q_z, \qquad q_z = -s\,\bar q_x + c\,\bar q_z,
$$

kde pruh označuje globální složky. Spojitá zatížení působí na metr vlastní délky prvku. Například krokev z bodu $(0, 0)$ do bodu $(3, -4)$ má $L = 5$ m, $c = 0{,}6$ a $s = -0{,}8$ (stoupá, takže $z$ klesá). Tíhové zatížení $\bar q_z = 10$ kN/m na ní má složky $q_x = -8$ kN/m dolů po spádu a $q_z = 6$ kN/m kolmo k ní. Krokev celkem nese $10 \times 5 = 50$ kN, nikoli $10 \times 3$.

V tabulkách:

- $q_z$, $q_x$: rovnoměrné zatížení; $q_1 \to q_2$: lichoběžníkové zatížení, $q_1$ v počátečním a $q_2$ v koncovém uzlu.
- $F_z$, $F_x$, $M_y$: síla nebo moment ve vzdálenosti $a$ od počátečního uzlu, přičemž $b = L - a$.
- $\Delta T = \Delta T_b - \Delta T_t$: dolní vlákna teplejší než horní (v aplikaci ΔT<sub>d</sub> − ΔT<sub>h</sub>); $\Delta T_c$: oteplení střednice (v aplikaci ΔT<sub>s</sub>). $\alpha$ je součinitel teplotní roztažnosti materiálu a $h$ **Výška** průřezu.

Kolmo k ose (složky z) a pro $\Phi = 0$ v počátečním uzlu:

$$
\begin{array}{l|cc}
\text{Zatížení} & Z_{12} & M_{12} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & \dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(7q_1+3q_2)}{20} & \dfrac{L^2\,(3q_1+2q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,b^2\,(3a+b)}{L^3} & \dfrac{F_z\,a\,b^2}{L^2} \\[3ex]
M_y & -\dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,b\,(b-2a)}{L^2} \\[3ex]
\Delta T & 0 & \dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

V koncovém uzlu:

$$
\begin{array}{l|cc}
\text{Zatížení} & Z_{21} & M_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & -\dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(3q_1+7q_2)}{20} & -\dfrac{L^2\,(2q_1+3q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,a^2\,(a+3b)}{L^3} & -\dfrac{F_z\,a^2\,b}{L^2} \\[3ex]
M_y & \dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,a\,(a-2b)}{L^2} \\[3ex]
\Delta T & 0 & -\dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

Ve směru osy (složky x) pro libovolné $\Phi$:

$$
\begin{array}{l|cc}
\text{Zatížení} & X_{12} & X_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_x & -\dfrac{q_x L}{2} & -\dfrac{q_x L}{2} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(2q_1+q_2)}{6} & -\dfrac{L\,(q_1+2q_2)}{6} \\[3ex]
F_x & -\dfrac{F_x\,b}{L} & -\dfrac{F_x\,a}{L} \\[3ex]
\Delta T_c & EA\,\alpha\,\Delta T_c & -EA\,\alpha\,\Delta T_c
\end{array}
$$

::callout{type="details" title="Primární koncové síly se smykovou deformací"}
Rovnoměrné a teplotní zatížení dávají pro libovolné $\Phi$ stejné primární síly. Pro ostatní zatížení platí, s $D = 1 + \Phi$ a $\Delta q = q_2 - q_1$ (složky z):

$$
\begin{aligned}
&\text{Lichoběžníkové zatížení:} \\
Z_{12} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(9+10\Phi)}{60\,D}, \\[1ex]
M_{12} &= \frac{q_1 L^2}{12} + \frac{\Delta q\,L^2\,(4+5\Phi)}{120\,D}, \\[1ex]
Z_{21} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(21+20\Phi)}{60\,D}, \\[1ex]
M_{21} &= -\frac{q_1 L^2}{12} - \frac{\Delta q\,L^2\,(6+5\Phi)}{120\,D}; \\[3ex]
&\text{Síla } F_z\text{:} \\
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

Jsou to přesná řešení oboustranně vetknutého Timošenkova prutu, stejně jako průhyb, který řešič pro každé zatížení přičítá mezi uzly.
::

U prvku s kloubem se primární síly kondenzují na $\mathbf{f}^{*}_\mathrm{fix}$ jako v odstavci [Koncové klouby](#end-hinges). Například rovnoměrné zatížení prvku s kloubem v koncovém uzlu dává $Z_{12} = -5q_zL/8$, $M_{12} = q_zL^2/8$, $Z_{21} = -3q_zL/8$ a $M_{21} = 0$ (pro $\Phi = 0$): primární síly jednostranně vetknutého nosníku.

Po vyřešení plynou vnitřní síly po délce prvku z jeho koncových sil a ze statiky zatížení, které na něm působí, a průhyb z tvarových funkcí a z průhybu oboustranně vetknutého prvku od zatížení: viz [Výsledky po délce prvků](/cs/elements/analysis#results-along-the-members).

## Transformační matice {#transformation-matrix}

Prvek skloněný o úhel $\theta$, měřený od globální osy x ke globální ose z (na obrazovce po směru hodinových ručiček), má

$$
c = \cos\theta = \frac{x_2 - x_1}{L}, \qquad s = \sin\theta = \frac{z_2 - z_1}{L},
$$

a jeho lokální koncové posuny plynou z globálních jako $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, kde

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

Pootočení jsou v obou systémech stejná. Má-li uzel zadané **Pootočení systému souřadnic** $\beta$ ([šikmá podpora](/cs/essentials/nodes-supports#inclined-skewed-supports)), jsou jeho neznámé $\mathbf{d}_n$ vyjádřeny ve vlastních osách uzlu, pootočených o $\beta$ od globální osy x ke globální ose z. Jejich globální složky jsou

$$
\mathbf{d}_g = \mathbf{T}_n\,\mathbf{d}_n, \qquad
\mathbf{T}_n = \begin{bmatrix} \cos\beta & -\sin\beta & 0 \\ \sin\beta & \cos\beta & 0 \\ 0 & 0 & 1 \end{bmatrix}
$$

pro tři stupně volnosti tohoto uzlu. Řešič násobí $\mathbf{T}$ zprava blokově diagonální maticí složenou z matic $\mathbf{T}_n$ obou koncových uzlů (u uzlu bez vlastních os je to jednotková matice), takže se prvek ke každému uzlu připojuje v osách tohoto uzlu.

## Globální matice tuhosti {#global-stiffness-matrix}

V globálních osách jsou matice tuhosti prvku a jeho ekvivalentní uzlová zatížení

$$
\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T},
\qquad
\mathbf{f}_{\mathrm{eq},g} = \mathbf{T}^\mathsf{T}\,\mathbf{f}_\mathrm{eq},
$$

kde $\mathbf{K}_l$ a $\mathbf{f}_\mathrm{eq}$ jsou u prvku s klouby už kondenzované. Právě $\mathbf{K}_g$ ukazuje pro prvek okno **Matice tuhosti** (otevřete ho z tabulky *Prvky* nebo z kontextové nabídky prvku), a to v jednotkách SI: N/m, N a N·m. Stránka [Jak EduBeam řeší model](/cs/elements/analysis) tyto matice sestaví do soustavy a ručně vyřeší malý příklad.
