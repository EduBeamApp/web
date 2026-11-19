---
description: "Pręt kratownicy w EduBeamie: element belkowy z przegubami na obu końcach, czyli klasyczny element kratownicowy, jego macierz sztywności i transformacji."
source: site
---

# Element kratownicy

Pręt kratownicy przenosi tylko siłę osiową. EduBeam nie ma osobnego elementu kratownicowego: pręt kratownicy to [element belkowy](/pl/elements/beam) z zaznaczonymi **oboma przegubami końcowymi**. Na tej stronie pokazujemy, dlaczego jest to dokładnie klasyczny dwuwęzłowy element kratownicowy, podajemy jego macierz sztywności i macierz transformacji oraz wyjaśniamy, co pręt z przegubami potrafi więcej niż podręcznikowy pręt kratownicy.

::model-figure{caption="Wszystkie pręty mają przeguby na obu końcach: krokwie przenoszą N = −7,071 kN, ściąg +5 kN i żaden pręt się nie zgina"}
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

Aby zamodelować kratownicę w aplikacji, zaznacz dla każdego pręta **Przegub na początku** i **Przegub na końcu** albo zaznacz oba na pasku u góry widoku, zanim narysujesz pręty myszą ([przeguby końcowe](/pl/essentials/elements#end-hinges)). [Samouczek: kratownica płaska](/pl/tutorials/truss) buduje taką konstrukcję krok po kroku.

## Stopnie swobody {#degrees-of-freedom}

Pręt kratownicy pracuje z dwoma przesunięciami na każdym końcu, wyrażonymi w jego [osiach lokalnych](/pl/elements/conventions#element-local-axes):

::element-sketch{mode="dofs" :hinges='[true,true]' :rotations='false' caption="Pręt kratownicy: przeguby na obu końcach, na każdym końcu dwa przesunięcia"}
::

| Kierunek | Węzeł początkowy (1) | Węzeł końcowy (2) |
| --- | --- | --- |
| wzdłuż lokalnej osi x | $u_1$ i `X12` | $u_2$ i `X21` |
| wzdłuż lokalnej osi z | $w_1$ i `Z12` | $w_2$ i `Z21` |

$$
\mathbf{d}_l = \begin{bmatrix} u_1 & w_1 & u_2 & w_2 \end{bmatrix}^\mathsf{T}.
$$

Węzły zachowują obrót `Ry`, bo każdy pręt jest elementem belkowym, ale pręt z przegubami na obu końcach ani go nie odczuwa, ani nie przenosi: jego momenty przywęzłowe `M12` i `M21` są zawsze równe zeru. W węźle, w którym wszystkie pręty mają przeguby, nic tego obrotu nie utrzymuje. Solver pozostawia go równym zeru, ale moment węzłowy przyłożony w takim węźle nie ma na co działać i przerywa obliczenia komunikatem *Konstrukcja jest mechanizmem: macierz sztywności jest osobliwa.*

## Lokalna macierz sztywności {#local-stiffness-matrix}

$$
\mathbf{K}_l = \frac{EA}{L}
\begin{bmatrix}
 1 & 0 & -1 & 0 \\
 0 & 0 & 0 & 0 \\
 -1 & 0 & 1 & 0 \\
 0 & 0 & 0 & 0
\end{bmatrix},
$$

gdzie $E$ to moduł Younga, $A$ pole przekroju, a $L$ długość pręta. Energię odkształcenia gromadzi tylko wydłużenie lub skrócenie pręta, dlatego siła normalna w pręcie bez obciążeń elementu jest stała:

$$
N = \frac{EA}{L}\,(u_2 - u_1).
$$

### Dlaczego belka z dwoma przegubami jest prętem kratownicy {#why-a-beam-with-two-hinges-is-a-truss-bar}

Wyeliminuj przez kondensację oba obroty końców z [macierzy sztywności belki](/pl/elements/beam#local-stiffness-matrix), tak jak przy każdym [przegubie końcowym](/pl/elements/beam#end-hinges). Wyrazy osiowe nie zależą od obrotów i pozostają bez zmian. Wyrazy giętne znikają całkowicie: gdy oba obroty są swobodne, dowolna para przemieszczeń końców $w_1$, $w_2$ tylko obraca pręt jak ciało sztywne wokół jego przegubów, a przy tym nie powstaje żadna energia odkształcenia. Solver wykonuje tę kondensację numerycznie, dla dowolnego współczynnika ścinania, i otrzymuje powyższą macierz z dokładnością do błędów zaokrągleń.

::callout{type="details" title="Kondensacja krok po kroku"}
W części giętnej uporządkuj stopnie swobody na zachowane, $a = (w_1, w_2)$, i zwolnione, $b = (\varphi_1, \varphi_2)$. Z macierzy belki, z $k_1$ do $k_4$ i parametrem podatności na ścinanie $\Phi$ zdefiniowanymi [na stronie elementu belkowego](/pl/elements/beam#local-stiffness-matrix), otrzymujesz

$$
\begin{aligned}
\mathbf{K}_{aa} &= k_1 \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{ab} &= k_2 \begin{bmatrix} -1 & -1 \\ 1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{bb} &= \begin{bmatrix} k_3 & k_4 \\ k_4 & k_3 \end{bmatrix}.
\end{aligned}
$$

Ponieważ $\mathbf{K}_{ab}$ ma dwie jednakowe kolumny, liczy się tylko suma wyrazów macierzy $\mathbf{K}_{bb}^{-1}$, równa $2/(k_3 + k_4)$:

$$
\mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}
= \frac{2\,k_2^2}{k_3 + k_4} \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}.
$$

Przy $k_3 + k_4 = 6EI_y / ((1+\Phi)L)$ współczynnik ten wynosi $\dfrac{12\,EI_y}{(1+\Phi)L^3} = k_1$, więc iloczyn jest dokładnie równy $\mathbf{K}_{aa}$, a skondensowana sztywność na zginanie $\mathbf{K}_{aa} - \mathbf{K}_{ab}\mathbf{K}_{bb}^{-1}\mathbf{K}_{ba}$ jest zerowa.
::

## Macierz transformacji {#transformation-matrix}

Dla pręta nachylonego pod kątem $\theta$ od globalnej osi x w stronę globalnej osi z, z $c = \cos\theta = (x_2 - x_1)/L$ i $s = \sin\theta = (z_2 - z_1)/L$, przemieszczenia lokalne wynoszą $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, gdzie

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 \\
 -s & c & 0 & 0 \\
 0 & 0 & c & s \\
 0 & 0 & -s & c
\end{bmatrix}:
$$

są to wiersze i kolumny przesunięć z [macierzy transformacji belki](/pl/elements/beam#transformation-matrix). Uważaj na znak $s$, gdy oś z jest skierowana w dół: krokiew A → C kratownicy powyżej wznosi się, więc $z_2 - z_1 = -3$ m, $c = 0{,}7071$ i $s = -0{,}7071$.

## Globalna macierz sztywności {#global-stiffness-matrix}

Po wymnożeniu $\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T}$ otrzymujesz

$$
\mathbf{K}_g = \frac{EA}{L}
\begin{bmatrix}
 c^2 & cs & -c^2 & -cs \\
 cs & s^2 & -cs & -s^2 \\
 -c^2 & -cs & c^2 & cs \\
 -cs & -s^2 & cs & s^2
\end{bmatrix}.
$$

Okno **Macierz sztywności** pokazuje dla pręta z przegubami te liczby w wierszach i kolumnach przesunięć, a dla obrotów zera.

## Co belka z przegubami potrafi więcej niż pręt kratownicy {#where-a-hinged-beam-does-more}

Ponieważ pręt kratownicy w EduBeamie jest nadal elementem belkowym, potrafi dwie rzeczy, których podręcznikowy pręt kratownicy nie potrafi:

- **Przenosić obciążenia na swojej długości.** Obciążenie liniowe pręta, np. jego ciężar własny, zgina pręt między węzłami jak belkę swobodnie podpartą i przekazuje do każdego węzła $qL/2$. Pozostałe pręty przenoszą siły normalne kratownicy od tych obciążeń węzłowych. W samym obciążonym pręcie składowa obciążenia wzdłuż pręta powoduje liniową zmienność $N$, a siła, którą dałoby obliczenie kratownicy, to wartość $N$ w połowie długości pręta.
- **Łączyć się z belkami.** Rama może zawierać pręty z przegubami, np. ściąg lub stężenie ukośne, bez żadnego specjalnego typu elementu.

Dodaj obciążenie 5 kN/m na ściągu kratownicy powyżej:

::model-figure{caption="Ta sama kratownica z obciążeniem 5 kN/m na ściągu: siły normalne się nie zmieniają, a ściąg zgina się momentem M = qL²/8 = 22,5 kNm"}
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

Sprawdzenie ręczne: w węźle C pionowe równanie równowagi $2\,N \sin 45^\circ + 10 = 0$ daje $N = -7{,}071$ kN w każdej krokwi. W węźle A poziomą składową siły w krokwi, $7{,}071 \cos 45^\circ = 5$ kN, równoważy ściąg, rozciągany siłą $N = +5$ kN. Obciążenie ściągu trafia wprost do podpór na jego końcach: do każdej reakcji dodaje $qL/2 = 15$ kN, ale do sił normalnych nic.

Kratownica musi być geometrycznie niezmienna jako układ przegubowy. Na przykład kwadratowy przedział bez krzyżulca jest mechanizmem: EduBeam wskazuje przeguby i pokazuje możliwy ruch (zob. [Rozwiązywanie problemów](/pl/reference/troubleshooting#no-results-are-drawn)).
