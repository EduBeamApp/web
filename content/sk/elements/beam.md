---
description: "Dvojuzlový Timošenkov nosníkový prvok v EduBeame: presná matica tuhosti, šmykové deformácie, koncové kĺby statickou kondenzáciou, primárne sily a transformácia."
source: site
---

# Nosníkový prvok

Každý prút v EduBeame, či už je to nosník, stĺp alebo priehradový prút, je ten istý prvok: priamy dvojuzlový **Timošenkov nosník** v rovine x–z s konštantným prierezom. Táto stránka uvádza jeho formuláciu presne tak, ako ju počíta riešič, takže si ktorúkoľvek maticu prvku alebo vektor zaťaženia môžete zostaviť ručne a porovnať s aplikáciou. Znamienka zodpovedajú stránke [Súradný systém a znamienková konvencia](/sk/elements/conventions), kód nájdete v súbore `Beam2D.ts` knižnice [@edubeam/fem](/sk/solver) a stránka [Ako EduBeam rieši model](/sk/elements/analysis) ukazuje, ako sa z prvkov poskladá riešenie.

## Stupne voľnosti {#degrees-of-freedom}

Každý uzol má tri stupne voľnosti, prvok ich teda má šesť. V [lokálnych osiach](/sk/elements/conventions#element-local-axes) prvku zodpovedá každému koncovému posunutiu jedna [koncová sila](/sk/elements/conventions#end-forces-element-results-table), teda jeden stĺpec tabuľky *Výsledky na prvkoch*:

::element-sketch{mode="dofs" caption="Šesť stupňov voľnosti nosníkového prvku, všetky nakreslené v kladnom zmysle; čiarkovaná čiara označuje dolné vlákna (lokálna +z)"}
::

| Smer | Počiatočný uzol (1) | Koncový uzol (2) |
| --- | --- | --- |
| v smere lokálnej osi x | $u_1$ a `X12` | $u_2$ a `X21` |
| v smere lokálnej osi z, pri prvku nakreslenom zľava doprava nadol | $w_1$ a `Z12` | $w_2$ a `Z21` |
| pootočenie, proti smeru hodinových ručičiek | $\varphi_1$ a `M12` | $\varphi_2$ a `M21` |

V tomto poradí tvoria vektor koncových posunutí a vektor koncových síl prvku:

$$
\begin{aligned}
\mathbf{d}_l &= \begin{bmatrix} u_1 & w_1 & \varphi_1 & u_2 & w_2 & \varphi_2 \end{bmatrix}^\mathsf{T}, \\
\mathbf{f} &= \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}.
\end{aligned}
$$

Keďže os z smeruje nadol a pootočenie je kladné proti smeru hodinových ručičiek, pootočí sa os nosníka bez šmykových deformácií o $\varphi = -\,\mathrm{d}w/\mathrm{d}x$.

## Lokálna matica tuhosti {#local-stiffness-matrix}

Koncové sily prvku bez prvkového zaťaženia sú $\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l$, kde

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

$E$ je modul pružnosti a $G$ šmykový modul materiálu, $A$ plocha prierezu, $I_y$ moment zotrvačnosti k osi y, $k$ šmykový súčiniteľ prierezu (**Šmykový súčiniteľ**) a $L$ dĺžka prvku. $\Phi$ je **parameter šmykovej poddajnosti**: vyjadruje, aký poddajný je prút v šmyku v porovnaní s ohybom, a je tým väčší, čím je prút kratší a vyšší. Pre $\Phi = 0$ dostanete známe členy $12EI/L^3$, $6EI/L^2$, $4EI/L$ a $2EI/L$ nosníka podľa Bernoulliho–Navierovej teórie. Osové a ohybové správanie od seba nezávisia: $u_1$ a $u_2$ sú zviazané len cez $k_N$.

V učebniciach s osou y nahor nájdete $+6EI/L^2$ tam, kde je v tejto matici $-k_2$. Obe matice opisujú tú istú tuhosť, líši sa len kladný smer priečneho posunutia.

::callout{type="details" title="Odkiaľ matica pochádza: presné tvarové funkcie"}
Pre prizmatický Timošenkov prút bez zaťaženia majú rovnice rovnováhy presné riešenie: $u$ je lineárnou funkciou $x$, $w$ kubickou a $\varphi$ kvadratickou. Vyjadrený pomocou koncových posunutí a s $\xi = x/L$ je priehyb

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

Pre $\Phi = 0$ ide o kubické Hermitove polynómy, $N_1 = 1 - 3\xi^2 + 2\xi^3$ a $N_2 = -L\,\xi(1-\xi)^2$, kde znamienko mínus pochádza z $\varphi = -w'$. Matica tuhosti obsahuje práve tie koncové sily, ktoré tieto presné tvary vyžadujú, a je teda presnou tuhosťou prúta, nie aproximáciou, ktorá sa s počtom prvkov zlepšuje. Rovnakými funkciami riešič kreslí aj deformovaný tvar.
::

## Šmykové deformácie: Timošenkov nosník, alebo Bernoulliho–Navierova teória? {#timoshenko-or-euler-bernoulli}

Či sa prvok deformuje šmykom, závisí len od $\Phi$, a teda od šmykového súčiniteľa prierezu $k$: $kA$ je plocha, ktorá prenáša šmyk. Každý druh prierezu začína s vlastnou hodnotou $k$:

| Prierez | Šmykový súčiniteľ $k$ |
| --- | --- |
| Úvodný model a vstavané príklady | $10^{32}$, takže $\Phi \approx 0$: Bernoulliho–Navierova teória |
| Prierezy I, H a širokopásnicové prierezy z knižnice | $h\,t_w / A$: šmyk prenáša stojina |
| Obdĺžnikové rúry z knižnice | $2\,h\,t / A$: obe bočné steny |
| Obdĺžniky a štvorce z knižnice | 0,833 |
| Kruhy z knižnice | 0,9 |
| Kruhové rúry z knižnice | 0,5 |
| Polygonálne prierezy | na začiatku 0,833 |
| Dialóg **Pridať prierez** | na začiatku 1 |

Pri štíhlom prúte je rozdiel malý. Pri prostom nosníku s rovnomerným zaťažením zväčší šmyk priehyb od ohybu v strede rozpätia pomerne o $0{,}8\,\Phi$. Pri oceľovom IPE 200 to pri rozpätí 6 m robí 1,2 %, pri 2 m však už 11 %. Šmykové deformácie vypnete tak, že $k$ nastavíte na veľmi veľké číslo, napríklad `1e32`. Ak nie je uvedené inak, používajú živé obrázky na tomto webe šmykovo tuhý prierez z príkladov, takže zodpovedajú ručnému výpočtu podľa Bernoulliho–Navierovej teórie. Nasledujúci obrázok je výnimkou:

::model-figure{caption="IPE 200 s rozpätím 2 m a k = h·tw/A = 0,393: w = 0,5657 mm v strede rozpätia, o 11 % viac ako 0,5106 mm podľa Bernoulliho–Navierovej teórie (Φ = 0,135)"}
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

## Koncové kĺby {#end-hinges}

Zaškrtnutý [koncový kĺb](/sk/essentials/elements#end-hinges) vynuluje moment na danom konci prvku. Koncové pootočenie prvku je potom voľné a riešič ho odstráni **statickou kondenzáciou**. Šesť stupňov voľnosti rozdelíme na ponechané, $a$, a na uvoľnené koncové pootočenia, $b$:

$$
\begin{bmatrix} \mathbf{f}_a \\ \mathbf{0} \end{bmatrix}
=
\begin{bmatrix} \mathbf{K}_{aa} & \mathbf{K}_{ab} \\ \mathbf{K}_{ba} & \mathbf{K}_{bb} \end{bmatrix}
\begin{bmatrix} \mathbf{d}_a \\ \mathbf{d}_b \end{bmatrix}
+
\begin{bmatrix} \mathbf{f}_{\mathrm{fix},a} \\ \mathbf{f}_{\mathrm{fix},b} \end{bmatrix}.
$$

Tu sú $\mathbf{f}_\mathrm{fix}$ primárne koncové sily od [prvkových zaťažení](#element-loads). Druhý riadok dáva pootočenie v kĺbe,

$$
\mathbf{d}_b = -\mathbf{K}_{bb}^{-1}\left(\mathbf{K}_{ba}\,\mathbf{d}_a + \mathbf{f}_{\mathrm{fix},b}\right),
$$

a po dosadení do prvého riadku zostane skondenzovaná matica tuhosti a skondenzované primárne sily

$$
\begin{aligned}
\mathbf{K}^{*} &= \mathbf{K}_{aa} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}, \\
\mathbf{f}^{*}_\mathrm{fix} &= \mathbf{f}_{\mathrm{fix},a} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{f}_{\mathrm{fix},b}.
\end{aligned}
$$

Riešič zapíše $\mathbf{K}^{*}$ späť do matice 6 × 6 s nulovými riadkami a stĺpcami pre uvoľnené pootočenia, takže sa prvok s kĺbom zostavuje do sústavy úplne rovnako ako každý iný. Po vyriešení dopočíta $\mathbf{d}_b$ z uvedeného vzorca a deformovaný tvar ukáže v kĺbe zlom.

S kĺbom v koncovom uzle má ohybová časť pre $(w_1, \varphi_1, w_2)$ tvar

$$
\mathbf{K}^{*}_{w} = \frac{12\,EI_y}{(4+\Phi)\,L^3}
\begin{bmatrix} 1 & -L & -1 \\ -L & L^2 & L \\ -1 & L & 1 \end{bmatrix},
$$

čo je pre $\Phi = 0$ klasická tuhosť $3EI/L^3$ prúta na jednom konci votknutého a na druhom kĺbovo uloženého. S kĺbmi na **oboch** koncoch z ohybových členov nezostane nič a zostane len $EA/L$: prvok je [priehradový prút](/sk/elements/truss).

Kĺb patrí ku koncu prvku, nie k uzlu. Ak sú kĺbovo pripojené všetky prvky, ktoré sa v uzle stretávajú, nie je k vlastnému pootočeniu uzla pripojené nič. Riešič ho ponechá nulové, čo neprekáža, ale uzlový moment zadaný v takom uzle nemá na čo pôsobiť a sústava je singulárna.

## Zaťaženie prvku {#element-loads}

Zaťaženia po dĺžke prvku vstupujú do riešenia ako **ekvivalentné uzlové zaťaženia**, $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. **Primárne koncové sily** $\mathbf{f}_\mathrm{fix}$ sú sily, ktorými na zaťažený prvok pôsobí votknutie na oboch jeho koncoch.

Všetky vzorce nižšie platia v lokálnych osiach. Zaťaženie zadané v globálnych osiach (s nezaškrtnutým **LCS**) sa najprv rozloží na lokálne zložky pomocou $c = \cos\theta$ a $s = \sin\theta$ [uhla](#transformation-matrix) prvku,

$$
q_x = c\,\bar q_x + s\,\bar q_z, \qquad q_z = -s\,\bar q_x + c\,\bar q_z,
$$

kde pruh označuje globálne zložky. Spojité zaťaženia pôsobia na meter vlastnej dĺžky prvku. Napríklad krokva z bodu $(0, 0)$ do bodu $(3, -4)$ má $L = 5$ m, $c = 0{,}6$ a $s = -0{,}8$ (stúpa, takže $z$ klesá). Tiažové zaťaženie $\bar q_z = 10$ kN/m na nej má zložky $q_x = -8$ kN/m nadol po spáde a $q_z = 6$ kN/m kolmo na ňu. Krokva nesie celkom $10 \times 5 = 50$ kN, nie $10 \times 3$.

V tabuľkách:

- $q_z$, $q_x$: rovnomerné zaťaženie; $q_1 \to q_2$: lichobežníkové zaťaženie, $q_1$ v počiatočnom a $q_2$ v koncovom uzle.
- $F_z$, $F_x$, $M_y$: sila alebo moment vo vzdialenosti $a$ od počiatočného uzla, pričom $b = L - a$.
- $\Delta T = \Delta T_b - \Delta T_t$: dolné vlákna teplejšie ako horné (v aplikácii ΔT<sub>d</sub> − ΔT<sub>h</sub>); $\Delta T_c$: oteplenie strednice (v aplikácii ΔT<sub>s</sub>). $\alpha$ je súčiniteľ teplotnej rozťažnosti materiálu a $h$ výška prierezu (**Výška**).

Kolmo na os (zložky z) a pre $\Phi = 0$ v počiatočnom uzle:

$$
\begin{array}{l|cc}
\text{Zaťaženie} & Z_{12} & M_{12} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & \dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(7q_1+3q_2)}{20} & \dfrac{L^2\,(3q_1+2q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,b^2\,(3a+b)}{L^3} & \dfrac{F_z\,a\,b^2}{L^2} \\[3ex]
M_y & -\dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,b\,(b-2a)}{L^2} \\[3ex]
\Delta T & 0 & \dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

V koncovom uzle:

$$
\begin{array}{l|cc}
\text{Zaťaženie} & Z_{21} & M_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & -\dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(3q_1+7q_2)}{20} & -\dfrac{L^2\,(2q_1+3q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,a^2\,(a+3b)}{L^3} & -\dfrac{F_z\,a^2\,b}{L^2} \\[3ex]
M_y & \dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,a\,(a-2b)}{L^2} \\[3ex]
\Delta T & 0 & -\dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

V smere osi (zložky x) pre ľubovoľné $\Phi$:

$$
\begin{array}{l|cc}
\text{Zaťaženie} & X_{12} & X_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_x & -\dfrac{q_x L}{2} & -\dfrac{q_x L}{2} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(2q_1+q_2)}{6} & -\dfrac{L\,(q_1+2q_2)}{6} \\[3ex]
F_x & -\dfrac{F_x\,b}{L} & -\dfrac{F_x\,a}{L} \\[3ex]
\Delta T_c & EA\,\alpha\,\Delta T_c & -EA\,\alpha\,\Delta T_c
\end{array}
$$

::callout{type="details" title="Primárne koncové sily so šmykovými deformáciami"}
Rovnomerné a teplotné zaťaženie dávajú pre ľubovoľné $\Phi$ rovnaké primárne sily. Pre ostatné zaťaženia platí, s $D = 1 + \Phi$ a $\Delta q = q_2 - q_1$ (zložky z):

$$
\begin{aligned}
&\text{Lichobežníkové zaťaženie:} \\
Z_{12} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(9+10\Phi)}{60\,D}, \\[1ex]
M_{12} &= \frac{q_1 L^2}{12} + \frac{\Delta q\,L^2\,(4+5\Phi)}{120\,D}, \\[1ex]
Z_{21} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(21+20\Phi)}{60\,D}, \\[1ex]
M_{21} &= -\frac{q_1 L^2}{12} - \frac{\Delta q\,L^2\,(6+5\Phi)}{120\,D}; \\[3ex]
&\text{Sila } F_z\text{:} \\
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

Sú to presné riešenia obojstranne votknutého Timošenkovho prúta, rovnako ako priehyb, ktorý riešič pre každé zaťaženie pripočítava medzi uzlami.
::

Pri prvku s kĺbom sa primárne sily kondenzujú na $\mathbf{f}^{*}_\mathrm{fix}$ ako v časti [Koncové kĺby](#end-hinges). Napríklad rovnomerné zaťaženie prvku s kĺbom v koncovom uzle dáva $Z_{12} = -5q_zL/8$, $M_{12} = q_zL^2/8$, $Z_{21} = -3q_zL/8$ a $M_{21} = 0$ (pre $\Phi = 0$): primárne sily jednostranne votknutého nosníka.

Po vyriešení vyplývajú vnútorné sily po dĺžke prvku z jeho koncových síl a zo statiky zaťaženia, ktoré naň pôsobí, a priehyb z tvarových funkcií a z priehybu obojstranne votknutého prvku od zaťaženia: pozrite [Výsledky po dĺžke prvkov](/sk/elements/analysis#results-along-the-members).

## Transformačná matica {#transformation-matrix}

Prvok sklonený o uhol $\theta$, meraný od globálnej osi x ku globálnej osi z (na obrazovke v smere hodinových ručičiek), má

$$
c = \cos\theta = \frac{x_2 - x_1}{L}, \qquad s = \sin\theta = \frac{z_2 - z_1}{L},
$$

a jeho lokálne koncové posunutia vyplývajú z globálnych ako $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, kde

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

Pootočenia sú v oboch systémoch rovnaké. Ak má uzol zadané **Pootočenie súradného systému** $\beta$ ([šikmá podpera](/sk/essentials/nodes-supports#inclined-skewed-supports)), sú jeho neznáme $\mathbf{d}_n$ vyjadrené vo vlastných osiach uzla, pootočených o $\beta$ od globálnej osi x ku globálnej osi z. Ich globálne zložky sú

$$
\mathbf{d}_g = \mathbf{T}_n\,\mathbf{d}_n, \qquad
\mathbf{T}_n = \begin{bmatrix} \cos\beta & -\sin\beta & 0 \\ \sin\beta & \cos\beta & 0 \\ 0 & 0 & 1 \end{bmatrix}
$$

pre tri stupne voľnosti tohto uzla. Riešič násobí $\mathbf{T}$ sprava blokovo diagonálnou maticou zloženou z matíc $\mathbf{T}_n$ oboch koncových uzlov (pri uzle bez vlastných osí je to jednotková matica), takže sa prvok ku každému uzlu pripája v osiach tohto uzla.

## Globálna matica tuhosti {#global-stiffness-matrix}

V globálnych osiach sú matica tuhosti prvku a jeho ekvivalentné uzlové zaťaženia

$$
\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T},
\qquad
\mathbf{f}_{\mathrm{eq},g} = \mathbf{T}^\mathsf{T}\,\mathbf{f}_\mathrm{eq},
$$

kde $\mathbf{K}_l$ a $\mathbf{f}_\mathrm{eq}$ sú pri prvku s kĺbmi už skondenzované. Práve $\mathbf{K}_g$ ukazuje pre prvok okno **Matica tuhosti** (otvoríte ho z tabuľky *Prvky* alebo z kontextovej ponuky prvku), a to v jednotkách SI: N/m, N a N·m. Stránka [Ako EduBeam rieši model](/sk/elements/analysis) tieto matice zostaví do sústavy a ručne vyrieši malý príklad.
