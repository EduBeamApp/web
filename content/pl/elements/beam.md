---
description: "Element belkowy Timoszenki w EduBeamie: dokładna macierz sztywności, ścinanie, przeguby przez kondensację statyczną, siły utwierdzenia i transformacja."
source: site
---

# Element belkowy

Każdy pręt w EduBeamie, czy to belka, słup, czy pręt kratownicy, jest tym samym elementem: prostym dwuwęzłowym elementem **belki Timoszenki** w płaszczyźnie x–z o stałym przekroju. Ta strona podaje jego sformułowanie dokładnie tak, jak liczy je solver, więc każdą macierz elementu i każdy wektor obciążeń możesz zbudować ręcznie i porównać z aplikacją. Znaki są zgodne ze stroną [Układ współrzędnych i konwencje znaków](/pl/elements/conventions), kod znajdziesz w pliku `Beam2D.ts` biblioteki [@edubeam/fem](/pl/solver), a strona [Jak EduBeam rozwiązuje model](/pl/elements/analysis) pokazuje, jak z elementów powstaje rozwiązanie.

## Stopnie swobody {#degrees-of-freedom}

Każdy węzeł ma trzy stopnie swobody, element ma ich więc sześć. W [osiach lokalnych](/pl/elements/conventions#element-local-axes) elementu każdemu przemieszczeniu końca odpowiada jedna [siła przywęzłowa](/pl/elements/conventions#end-forces-element-results-table), czyli jedna kolumna tabeli *Wyniki elementów*:

::element-sketch{mode="dofs" caption="Sześć stopni swobody elementu belkowego, każdy narysowany jako dodatni; linia przerywana oznacza włókna dolne (lokalna oś +z)"}
::

| Kierunek | Węzeł początkowy (1) | Węzeł końcowy (2) |
| --- | --- | --- |
| wzdłuż lokalnej osi x | $u_1$ i `X12` | $u_2$ i `X21` |
| wzdłuż lokalnej osi z, w dół dla elementu narysowanego od lewej do prawej | $w_1$ i `Z12` | $w_2$ i `Z21` |
| obrót, przeciwnie do ruchu wskazówek zegara | $\varphi_1$ i `M12` | $\varphi_2$ i `M21` |

W tej kolejności tworzą wektor przemieszczeń i wektor sił elementu:

$$
\begin{aligned}
\mathbf{d}_l &= \begin{bmatrix} u_1 & w_1 & \varphi_1 & u_2 & w_2 & \varphi_2 \end{bmatrix}^\mathsf{T}, \\
\mathbf{f} &= \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}.
\end{aligned}
$$

Ponieważ oś z jest skierowana w dół, a obroty są dodatnie przeciwnie do ruchu wskazówek zegara, oś belki bez odkształcenia postaciowego obraca się o $\varphi = -\,\mathrm{d}w/\mathrm{d}x$.

## Lokalna macierz sztywności {#local-stiffness-matrix}

Siły przywęzłowe nieobciążonego elementu wynoszą $\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l$, gdzie

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

oraz

$$
\begin{aligned}
k_N &= \frac{EA}{L}, & k_1 &= \frac{12\,EI_y}{(1+\Phi)\,L^3}, \\[1ex]
k_2 &= \frac{6\,EI_y}{(1+\Phi)\,L^2}, & k_3 &= \frac{(4+\Phi)\,EI_y}{(1+\Phi)\,L}, \\[1ex]
k_4 &= \frac{(2-\Phi)\,EI_y}{(1+\Phi)\,L}, & \Phi &= \frac{12\,EI_y}{k\,GA\,L^2}.
\end{aligned}
$$

$E$ to moduł Younga, a $G$ moduł Kirchhoffa materiału, $A$ pole przekroju, $I_y$ moment bezwładności względem osi y, $k$ **Współczynnik ścinania** przekroju, a $L$ długość elementu. $\Phi$ to **parametr podatności na ścinanie**: mówi, jak podatny jest pręt na ścinanie w porównaniu ze zginaniem, i rośnie dla prętów krótkich o wysokim przekroju. Dla $\Phi = 0$ otrzymujesz dobrze znane wyrazy $12EI/L^3$, $6EI/L^2$, $4EI/L$ i $2EI/L$ belki Eulera–Bernoulliego. Rozciąganie lub ściskanie osiowe i zginanie nie są ze sobą sprzężone: $u_1$ i $u_2$ występują tylko przy $k_N$.

Podręczniki z osią y skierowaną w górę mają $+6EI/L^2$ tam, gdzie w tej macierzy stoi $-k_2$. Obie macierze opisują tę samą sztywność, różni się tylko zwrot przemieszczenia poprzecznego.

::callout{type="details" title="Skąd się bierze ta macierz: dokładne funkcje kształtu"}
Dla pryzmatycznego pręta Timoszenki bez obciążenia równania równowagi mają rozwiązanie dokładne: $u$ jest liniową funkcją $x$, $w$ funkcją trzeciego stopnia, a $\varphi$ funkcją kwadratową. Po wyrażeniu przez przemieszczenia końców, z $\xi = x/L$, ugięcie wynosi

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

Dla $\Phi = 0$ są to wielomiany Hermite'a trzeciego stopnia, $N_1 = 1 - 3\xi^2 + 2\xi^3$ i $N_2 = -L\,\xi(1-\xi)^2$, przy czym znak minus wynika z $\varphi = -w'$. Macierz sztywności zawiera dokładnie te siły przywęzłowe, których wymagają te dokładne kształty, jest więc dokładną sztywnością pręta, a nie przybliżeniem, które poprawia się wraz z liczbą elementów. Tymi samymi funkcjami solver rysuje postać odkształconą.
::

## Odkształcenie postaciowe: Timoszenko czy Euler–Bernoulli? {#timoshenko-or-euler-bernoulli}

To, czy element odkształca się od ścinania, zależy tylko od $\Phi$, a więc od współczynnika ścinania przekroju $k$: $kA$ to pole, które przenosi ścinanie. Każdy rodzaj przekroju ma na początku własną wartość $k$:

| Przekrój | Współczynnik ścinania $k$ |
| --- | --- |
| Model startowy i wbudowane przykłady | $10^{32}$, co daje $\Phi \approx 0$: Euler–Bernoulli |
| Dwuteowniki I, H i szerokostopowe z biblioteki | $h\,t_w / A$: ścinanie przenosi środnik |
| Rury prostokątne z biblioteki | $2\,h\,t / A$: obie ścianki boczne |
| Prostokąty i kwadraty z biblioteki | 0,833 |
| Koła z biblioteki | 0,9 |
| Rury okrągłe z biblioteki | 0,5 |
| Przekroje wielokątne | na początku 0,833 |
| Okno **Dodaj przekrój** | na początku 1 |

W smukłym pręcie różnica jest niewielka. W belce swobodnie podpartej pod obciążeniem równomiernym ścinanie zwiększa ugięcie od zginania w środku rozpiętości względnie o $0{,}8\,\Phi$. Dla stalowego IPE 200 to 1,2 % przy rozpiętości 6 m, ale już 11 % przy 2 m. Aby wyłączyć odkształcenie postaciowe, ustaw $k$ na bardzo dużą liczbę, np. `1e32`. Jeśli nie zaznaczono inaczej, interaktywne rysunki w tym serwisie używają sztywnego na ścinanie przekroju z przykładów, więc zgadzają się z obliczeniami ręcznymi według teorii Eulera–Bernoulliego. Rysunek poniżej jest wyjątkiem:

::model-figure{caption="IPE 200 o rozpiętości 2 m, k = h·tw/A = 0,393: w = 0,5657 mm w środku rozpiętości, o 11 % więcej niż 0,5106 mm według teorii Eulera–Bernoulliego (Φ = 0,135)"}
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

## Przeguby końcowe {#end-hinges}

Zaznaczony [przegub końcowy](/pl/essentials/elements#end-hinges) zeruje moment na danym końcu elementu. Obrót tego końca elementu staje się wtedy swobodny, a solver usuwa go przez **kondensację statyczną**. Sześć stopni swobody dzielimy na zachowane, $a$, i zwolnione obroty końców, $b$:

$$
\begin{bmatrix} \mathbf{f}_a \\ \mathbf{0} \end{bmatrix}
=
\begin{bmatrix} \mathbf{K}_{aa} & \mathbf{K}_{ab} \\ \mathbf{K}_{ba} & \mathbf{K}_{bb} \end{bmatrix}
\begin{bmatrix} \mathbf{d}_a \\ \mathbf{d}_b \end{bmatrix}
+
\begin{bmatrix} \mathbf{f}_{\mathrm{fix},a} \\ \mathbf{f}_{\mathrm{fix},b} \end{bmatrix}.
$$

Tutaj $\mathbf{f}_\mathrm{fix}$ to siły utwierdzenia od [obciążeń elementu](#element-loads). Drugi wiersz daje obrót w przegubie,

$$
\mathbf{d}_b = -\mathbf{K}_{bb}^{-1}\left(\mathbf{K}_{ba}\,\mathbf{d}_a + \mathbf{f}_{\mathrm{fix},b}\right),
$$

a po podstawieniu do pierwszego wiersza zostają skondensowana macierz sztywności i skondensowane siły utwierdzenia

$$
\begin{aligned}
\mathbf{K}^{*} &= \mathbf{K}_{aa} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}, \\
\mathbf{f}^{*}_\mathrm{fix} &= \mathbf{f}_{\mathrm{fix},a} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{f}_{\mathrm{fix},b}.
\end{aligned}
$$

Solver wpisuje $\mathbf{K}^{*}$ z powrotem do macierzy 6 × 6 z zerowymi wierszami i kolumnami dla zwolnionych obrotów, więc element z przegubem agreguje się dokładnie tak jak każdy inny. Po rozwiązaniu odtwarza $\mathbf{d}_b$ z powyższego wzoru, a postać odkształcona pokazuje w przegubie załamanie.

Z przegubem w węźle końcowym część giętna dla $(w_1, \varphi_1, w_2)$ przyjmuje postać

$$
\mathbf{K}^{*}_{w} = \frac{12\,EI_y}{(4+\Phi)\,L^3}
\begin{bmatrix} 1 & -L & -1 \\ -L & L^2 & L \\ -1 & L & 1 \end{bmatrix},
$$

co dla $\Phi = 0$ jest klasyczną sztywnością $3EI/L^3$ pręta jednostronnie utwierdzonego. Z przegubami na **obu** końcach z wyrazów giętnych nie zostaje nic i pozostaje tylko $EA/L$: element staje się [prętem kratownicy](/pl/elements/truss).

Przegub należy do końca elementu, nie do węzła. Jeśli wszystkie elementy zbiegające się w węźle mają w nim przeguby, z obrotem samego węzła nic nie jest połączone. Solver pozostawia ten obrót równy zeru, co niczemu nie szkodzi, ale moment węzłowy przyłożony w takim węźle nie ma na co działać i układ równań staje się osobliwy.

## Obciążenia elementów {#element-loads}

Obciążenia działające wzdłuż elementu wchodzą do rozwiązania jako **zastępcze obciążenia węzłowe**, $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. **Siły utwierdzenia** $\mathbf{f}_\mathrm{fix}$ to siły przywęzłowe, jakie powstają w obciążonym elemencie, gdy oba jego końce są utwierdzone.

Wszystkie wzory poniżej obowiązują w osiach lokalnych. Obciążenie zadane w osiach globalnych (z odznaczonym **LCS**) solver najpierw rozkłada na składowe lokalne za pomocą $c = \cos\theta$ i $s = \sin\theta$ [kąta](#transformation-matrix) elementu,

$$
q_x = c\,\bar q_x + s\,\bar q_z, \qquad q_z = -s\,\bar q_x + c\,\bar q_z,
$$

gdzie kreska oznacza składowe globalne. Obciążenia liniowe działają na metr własnej długości elementu. Na przykład krokiew od punktu $(0, 0)$ do $(3, -4)$ ma $L = 5$ m, $c = 0{,}6$ i $s = -0{,}8$ (wznosi się, więc $z$ maleje). Obciążenie grawitacyjne $\bar q_z = 10$ kN/m ma na niej składowe $q_x = -8$ kN/m wzdłuż krokwi w dół i $q_z = 6$ kN/m prostopadle do niej, a krokiew przenosi łącznie $10 \times 5 = 50$ kN, a nie $10 \times 3$.

W tabelach:

- $q_z$, $q_x$: obciążenie równomierne; $q_1 \to q_2$: obciążenie trapezowe, $q_1$ w węźle początkowym, a $q_2$ w węźle końcowym.
- $F_z$, $F_x$, $M_y$: siła lub moment w odległości $a$ od węzła początkowego, przy czym $b = L - a$.
- $\Delta T = \Delta T_b - \Delta T_t$: włókna dolne cieplejsze od górnych; $\Delta T_c$: ogrzanie osi. $\alpha$ to współczynnik rozszerzalności cieplnej materiału, a $h$ **Wysokość** przekroju.

W poprzek osi (składowe z) i dla $\Phi = 0$, w węźle początkowym:

$$
\begin{array}{l|cc}
\text{Obciążenie} & Z_{12} & M_{12} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & \dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(7q_1+3q_2)}{20} & \dfrac{L^2\,(3q_1+2q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,b^2\,(3a+b)}{L^3} & \dfrac{F_z\,a\,b^2}{L^2} \\[3ex]
M_y & -\dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,b\,(b-2a)}{L^2} \\[3ex]
\Delta T & 0 & \dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

W węźle końcowym:

$$
\begin{array}{l|cc}
\text{Obciążenie} & Z_{21} & M_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & -\dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(3q_1+7q_2)}{20} & -\dfrac{L^2\,(2q_1+3q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,a^2\,(a+3b)}{L^3} & -\dfrac{F_z\,a^2\,b}{L^2} \\[3ex]
M_y & \dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,a\,(a-2b)}{L^2} \\[3ex]
\Delta T & 0 & -\dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

Wzdłuż osi (składowe x), dla dowolnego $\Phi$:

$$
\begin{array}{l|cc}
\text{Obciążenie} & X_{12} & X_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_x & -\dfrac{q_x L}{2} & -\dfrac{q_x L}{2} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(2q_1+q_2)}{6} & -\dfrac{L\,(q_1+2q_2)}{6} \\[3ex]
F_x & -\dfrac{F_x\,b}{L} & -\dfrac{F_x\,a}{L} \\[3ex]
\Delta T_c & EA\,\alpha\,\Delta T_c & -EA\,\alpha\,\Delta T_c
\end{array}
$$

::callout{type="details" title="Siły utwierdzenia z uwzględnieniem odkształcenia postaciowego"}
Obciążenie równomierne i obciążenie termiczne dają te same siły utwierdzenia dla dowolnego $\Phi$. Dla pozostałych, z $D = 1 + \Phi$ i $\Delta q = q_2 - q_1$ (składowe z):

$$
\begin{aligned}
&\text{Obciążenie trapezowe:} \\
Z_{12} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(9+10\Phi)}{60\,D}, \\[1ex]
M_{12} &= \frac{q_1 L^2}{12} + \frac{\Delta q\,L^2\,(4+5\Phi)}{120\,D}, \\[1ex]
Z_{21} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(21+20\Phi)}{60\,D}, \\[1ex]
M_{21} &= -\frac{q_1 L^2}{12} - \frac{\Delta q\,L^2\,(6+5\Phi)}{120\,D}; \\[3ex]
&\text{Siła } F_z\text{:} \\
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

Są to dokładne rozwiązania obustronnie utwierdzonego pręta Timoszenki, podobnie jak ugięcie, które solver dla każdego obciążenia dodaje między węzłami.
::

W elemencie z przegubem siły utwierdzenia są kondensowane do $\mathbf{f}^{*}_\mathrm{fix}$, jak w punkcie [Przeguby końcowe](#end-hinges). Na przykład obciążenie równomierne elementu z przegubem w węźle końcowym daje $Z_{12} = -5q_zL/8$, $M_{12} = q_zL^2/8$, $Z_{21} = -3q_zL/8$ i $M_{21} = 0$ (dla $\Phi = 0$): siły utwierdzenia belki jednostronnie utwierdzonej.

Po rozwiązaniu siły przekrojowe wzdłuż elementu wynikają z jego sił przywęzłowych i ze statyki działającego na niego obciążenia, a ugięcie z funkcji kształtu, do których dochodzi ugięcie od obciążenia w elemencie obustronnie utwierdzonym: zob. [Wyniki wzdłuż prętów](/pl/elements/analysis#results-along-the-members).

## Macierz transformacji {#transformation-matrix}

Element nachylony pod kątem $\theta$, mierzonym od globalnej osi x w stronę globalnej osi z (na ekranie zgodnie z ruchem wskazówek zegara), ma

$$
c = \cos\theta = \frac{x_2 - x_1}{L}, \qquad s = \sin\theta = \frac{z_2 - z_1}{L},
$$

a jego lokalne przemieszczenia końców wynikają z globalnych jako $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, gdzie

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

Obroty są w obu układach takie same. Jeśli węzeł ma ustawiony **Kąt lokalnego układu** $\beta$ ([podpora ukośna](/pl/essentials/nodes-supports#inclined-skewed-supports)), jego niewiadome $\mathbf{d}_n$ są wyrażone we własnych osiach węzła, obróconych o $\beta$ od globalnej osi x w stronę globalnej osi z. Ich składowe globalne to

$$
\mathbf{d}_g = \mathbf{T}_n\,\mathbf{d}_n, \qquad
\mathbf{T}_n = \begin{bmatrix} \cos\beta & -\sin\beta & 0 \\ \sin\beta & \cos\beta & 0 \\ 0 & 0 & 1 \end{bmatrix}
$$

dla trzech stopni swobody tego węzła. Solver mnoży $\mathbf{T}$ z prawej strony przez macierz blokowo-diagonalną złożoną z macierzy $\mathbf{T}_n$ obu węzłów końcowych (dla węzła bez własnych osi jest to macierz jednostkowa), dzięki czemu element łączy się z każdym węzłem w osiach tego węzła.

## Globalna macierz sztywności {#global-stiffness-matrix}

W osiach globalnych macierz sztywności elementu i jego zastępcze obciążenia węzłowe wynoszą

$$
\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T},
\qquad
\mathbf{f}_{\mathrm{eq},g} = \mathbf{T}^\mathsf{T}\,\mathbf{f}_\mathrm{eq},
$$

przy czym $\mathbf{K}_l$ i $\mathbf{f}_\mathrm{eq}$ elementu z przegubami są już skondensowane. Właśnie $\mathbf{K}_g$ pokazuje dla elementu okno **Macierz sztywności** (otworzysz je z tabeli *Elementy* lub z menu kontekstowego elementu), w jednostkach SI: N/m, N i N·m. Strona [Jak EduBeam rozwiązuje model](/pl/elements/analysis) agreguje te macierze i rozwiązuje ręcznie mały przykład.
