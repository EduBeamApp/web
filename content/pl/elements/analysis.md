---
description: "Macierzowa metoda przemieszczeń tak, jak liczy ją EduBeam, ręcznie na belce jednostronnie utwierdzonej: numeracja, agregacja, podpory, reakcje i wyniki."
source: site
---

# Jak EduBeam rozwiązuje model

Po każdej zmianie modelu EduBeam rozwiązuje go od nowa **metodą przemieszczeń** w ujęciu macierzowym (bezpośrednią metodą sztywności), w Twojej przeglądarce, w ciągu kilku milisekund. Na tej stronie przechodzimy krok po kroku przez działanie solvera [@edubeam/fem](/pl/solver) na małym przykładzie, więc każdą liczbę możesz odtworzyć ręcznie i zobaczyć, dlaczego wynikom można ufać.

Przykładem jest belka jednostronnie utwierdzona ze stalowego dwuteownika IPE 300 o długości 4 m, utwierdzona w A, oparta na podporze przesuwnej w B i obciążona równomiernie 10 kN/m. Jej sztywność na zginanie to $EI = 210 \text{ GPa} \times 8356 \text{ cm}^4 = 17\,548$ kNm², a bez odkształcenia postaciowego podręcznikowe wyniki to $M_A = -qL^2/8 = -20$ kNm, $R_B = 3qL/8 = 15$ kN i $\varphi_B = qL^3/(48EI)$.

::model-figure{caption="Belka jednostronnie utwierdzona, IPE 300, 10 kN/m: M = −20 kNm w A i +11,25 kNm w odległości 2,5 m, reakcje 25 kN i 15 kN"}
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

## Od modelu do przemieszczeń {#from-model-to-displacements}

::div{.steps}
### Numeracja stopni swobody {#number-the-degrees-of-freedom}

Każdy węzeł dostaje te stopnie swobody, których potrzebują jego elementy. Wszystkie elementy są [elementami belkowymi](/pl/elements/beam), więc każdy węzeł ma `Dx`, `Dz` i `Ry`. Solver numeruje węzeł po węźle najpierw **swobodne** stopnie swobody, a po nich **podparte**. Tutaj A jest utwierdzony, a B podparty tylko w pionie, więc swobodne są dwa:

$$
\begin{gathered}
\mathbf{r} = \begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix},
\qquad
\mathbf{r}_u = \begin{bmatrix} u_B \\ \varphi_B \end{bmatrix}, \\[1ex]
\mathbf{r}_p = \begin{bmatrix} u_A & w_A & \varphi_A & w_B \end{bmatrix}^\mathsf{T}.
\end{gathered}
$$

$u$, $w$ i $\varphi$ to przemieszczenia wzdłuż osi x i z oraz obrót, jak w [tabeli stopni swobody](/pl/elements/conventions#degrees-of-freedom). Każdy element ma swój **wektor alokacji**: pozycje swoich sześciu stopni swobody w wektorze $\mathbf{r}$. Licząc od 1, stopnie swobody belki $(u_A, w_A, \varphi_A, u_B, w_B, \varphi_B)$ zajmują pozycje $(3, 4, 5, 1, 6, 2)$.

### Macierze elementów {#compute-the-element-matrices}

Dla każdego elementu solver buduje [lokalną macierz sztywności](/pl/elements/beam#local-stiffness-matrix), kondensuje ewentualne [przeguby końcowe](/pl/elements/beam#end-hinges) i przekształca ją do osi globalnych, $\mathbf{K}_g = \mathbf{T}^\mathsf{T}\mathbf{K}_l\,\mathbf{T}$. Każde obciążenie elementu zamienia na [zastępcze obciążenia węzłowe](/pl/elements/beam#element-loads), $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. Nasza belka jest pozioma, więc $\mathbf{T}$ jest macierzą jednostkową, a obciążenie równomierne daje (w kN i kNm)

$$
\mathbf{f}_\mathrm{eq} = \begin{bmatrix} 0 \\[0.5ex] qL/2 \\[0.5ex] -qL^2/12 \\[0.5ex] 0 \\[0.5ex] qL/2 \\[0.5ex] qL^2/12 \end{bmatrix}
= \begin{bmatrix} 0 \\[0.5ex] 20 \\[0.5ex] -13{,}33 \\[0.5ex] 0 \\[0.5ex] 20 \\[0.5ex] 13{,}33 \end{bmatrix}.
$$

### Agregacja {#assemble}

Globalna macierz sztywności $\mathbf{K}$ jest na początku zerowa. Każdy element dodaje swój wyraz $(i, j)$ do tego wiersza i tej kolumny, które jego wektor alokacji przypisuje indeksom $i$ oraz $j$. Tam, gdzie w węźle spotyka się kilka elementów, ich sztywności odpowiadające stopniom swobody tego węzła się sumują. Tak samo wektor obciążeń $\mathbf{F}$ zbiera obciążenia węzłowe i zastępcze obciążenia węzłowe. Zadane przemieszczenia (osiadania podpór) trafiają do $\mathbf{r}_p$. Przy kolejności „najpierw swobodne, potem podparte” układ rozpada się na bloki:

$$
\begin{bmatrix} \mathbf{K}_{uu} & \mathbf{K}_{up} \\ \mathbf{K}_{pu} & \mathbf{K}_{pp} \end{bmatrix}
\begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix}
=
\begin{bmatrix} \mathbf{F}_u \\ \mathbf{F}_p + \mathbf{R} \end{bmatrix},
$$

gdzie $\mathbf{R}$ to niewiadome reakcje. W przykładzie do $\mathbf{K}_{uu}$ trafiają tylko wiersze i kolumny belki należące do końca B:

$$
\begin{aligned}
\mathbf{K}_{uu} &= \begin{bmatrix} EA/L & 0 \\ 0 & 4EI/L \end{bmatrix} \\[1ex]
&= \begin{bmatrix} 282\,450 \text{ kN/m} & 0 \\ 0 & 17\,548 \text{ kNm} \end{bmatrix}, \\[1ex]
\mathbf{F}_u &= \begin{bmatrix} 0 \\ 13{,}33 \text{ kNm} \end{bmatrix}.
\end{aligned}
$$

### Podpory i rozwiązanie układu {#apply-the-supports-and-solve}

Podpory nie są sprężynami ani dużymi liczbami na przekątnej: podparte stopnie swobody po prostu się oddziela. Swobodne przemieszczenia wynikają z układu

$$
\mathbf{K}_{uu}\,\mathbf{r}_u = \mathbf{F}_u - \mathbf{K}_{up}\,\mathbf{r}_p,
$$

który solver rozwiązuje rozkładem LU. Bez osiadań $\mathbf{r}_p = \mathbf{0}$, a tutaj

$$
\varphi_B = \frac{13{,}33}{17\,548} = 7{,}598 \times 10^{-4} \text{ rad},
$$

czyli podręcznikowe $qL^3/(48EI)$, oraz $u_B = 0$.

### Obliczenie reakcji {#compute-the-reactions}

Gdy wszystkie przemieszczenia są znane, wiersze podpartych stopni swobody dają reakcje, czyli siły, którymi podpory działają na konstrukcję:

$$
\mathbf{R} = \mathbf{K}_{pu}\,\mathbf{r}_u + \mathbf{K}_{pp}\,\mathbf{r}_p - \mathbf{F}_p.
$$

Dla $w_A$ wiersz macierzy $\mathbf{K}_{pu}$ zawiera w kolumnie $\varphi_B$ wyraz $-6EI/L^2$, a $\mathbf{F}_p$ zawiera $qL/2$:

$$
\begin{aligned}
R_{wA} &= -\frac{6EI}{L^2}\,\varphi_B - \frac{qL}{2} \\
&= -5 - 20 = -25 \text{ kN},
\end{aligned}
$$

czyli 25 kN w górę (oś z jest skierowana w dół). Tak samo wychodzi $R_{\varphi A} = +20$ kNm i $R_{wB} = -15$ kN: podręcznikowe $qL^2/8$ i $3qL/8$.
::

## Wyniki wzdłuż prętów {#results-along-the-members}

Dla każdego elementu solver pobiera z wektora $\mathbf{r}$ przemieszczenia jego końców, przekształca je do osi lokalnych, $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, i oblicza [siły przywęzłowe](/pl/elements/conventions#end-forces-element-results-table)

$$
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix}.
$$

W przykładzie $\mathbf{d}_l = [0,\ 0,\ 0,\ 0,\ 0,\ \varphi_B]^\mathsf{T}$ daje $Z_{12} = -25$ kN, $M_{12} = 20$ kNm, $Z_{21} = -15$ kN i $M_{21} = 0$.

Siły przekrojowe w dowolnym miejscu $x$ wynikają następnie z równowagi części elementu między jego początkiem a punktem $x$: z sił na początku elementu i z obciążenia działającego na tę część.

$$
\begin{aligned}
N(x) &= -X_{12} + N_q(x), \\
V(x) &= -Z_{12} + V_q(x), \\
M(x) &= -M_{12} - Z_{12}\,x + M_q(x),
\end{aligned}
$$

gdzie $N_q$, $V_q$ i $M_q$ pochodzą od obciążeń na tej części. Dla obciążenia równomiernego $q_z$, obciążenia trapezowego od $q_1$ do $q_2$ (z $\Delta q = q_2 - q_1$) oraz siły $F_z$ lub momentu $M_y$ w odległości $a$, które działają tylko dla $x \ge a$:

$$
\begin{array}{l|cc}
\text{Obciążenie} & V_q(x) & M_q(x) \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -q_z\,x & -\dfrac{q_z\,x^2}{2} \\[3ex]
q_1 \to q_2 & -q_1 x - \dfrac{\Delta q\,x^2}{2L} & -\dfrac{q_1 x^2}{2} - \dfrac{\Delta q\,x^3}{6L} \\[3ex]
F_z,\ M_y & -F_z & -F_z\,(x-a) - M_y
\end{array}
$$

$N_q$ otrzymujesz tak jak $V_q$, tylko ze składowymi osiowymi $q_x$ i $F_x$ zamiast $q_z$ i $F_z$.

W przykładzie $M(x) = -20 + 25\,x - 5\,x^2$ kNm, z maksimum w $x = 2{,}5$ m równym $11{,}25$ kNm $= 9qL^2/128$. Obciążenie termiczne nie ma tu własnego wyrazu: działa tylko przez siły przywęzłowe.

Ugięcie to iloczyn [funkcji kształtu](/pl/elements/beam#local-stiffness-matrix) i przemieszczeń końców, do którego dochodzi ugięcie od obciążenia elementu obustronnie utwierdzonego. Koniec z przegubem najpierw odzyskuje własny obrót z [kondensacji](/pl/elements/beam#end-hinges). Wykresy i postać odkształcona to właśnie te funkcje, obliczone wzdłuż każdego pręta.

## Dlaczego wyniki są dokładne {#exact}

Każdy z powyższych kroków jest dokładny dla rozwiązywanego modelu:

- Sztywność elementu pochodzi z **rozwiązania dokładnego** pryzmatycznego pręta Timoszenki, a nie z założonych wielomianowych funkcji kształtu, jest więc rzeczywistą sztywnością pręta.
- Siły utwierdzenia to dokładne rozwiązania pręta obustronnie utwierdzonego dla każdego typu obciążenia, więc zastępcze obciążenia węzłowe niczego nie tracą.
- Przemieszczenia węzłów są zatem dokładne, a siły przekrojowe między węzłami wynikają z warunków równowagi przy rzeczywistym obciążeniu, więc też są dokładne.

Dlatego EduBeam nigdy nie każe zagęszczać siatki: jeden element na pręt daje ten sam wynik co sto. Węzły są potrzebne tylko tam, gdzie zmienia się sam pręt: w podporze, w przegubie, w narożu lub przy zmianie przekroju. Siła skupiona między nimi może pozostać obciążeniem elementu. Jedyny pozostały błąd to zaokrąglenia arytmetyki zmiennoprzecinkowej; tabele wyników pokazują jako 0 wartości mniejsze niż $10^{-12}$ największej wartości danego rodzaju.

„Dokładne” odnosi się do modelu, a model ma swoje ograniczenia:

::div{.limits}
- **Materiał liniowo sprężysty** i **małe przemieszczenia**: równowagę zapisuje się dla konstrukcji nieodkształconej, więc nie ma efektów drugiego rzędu (P–Δ) ani wyboczenia.
- **Pręty proste i pryzmatyczne**: jeden przekrój na element. Pręt o zmiennym przekroju trzeba przybliżyć kilkoma elementami.
- **Zginanie tylko w płaszczyźnie x–z**: bez skręcania i bez zachowania poza płaszczyzną.
::

## Gdy konstrukcja nie może przenieść obciążeń {#mechanisms}

Konstrukcja, która może się poruszać bez odkształcania, ma osobliwą macierz sztywności i nie ma jednoznacznego rozwiązania. EduBeam szuka takiej sytuacji przed obliczeniami, a po nich sprawdza wynik:

1. **Przed obliczeniami** każda spójna część konstrukcji jest sprawdzana wyłącznie na podstawie geometrii. Podpory muszą zablokować trzy ruchy tarczy sztywnej w płaszczyźnie: mniej niż trzy więzy oznaczają, że model po prostu nie jest jeszcze gotowy (*Konstrukcja potrzebuje podpór, aby można ją było obliczyć.*), natomiast trzy lub więcej więzów, które mimo to pozwalają jej przesunąć się lub obrócić, np. równoległe podpory przesuwne, to błąd. Następnie sprawdzane są przeguby: jeśli pręty mogą się wokół nich obracać, zachowując swoje długości, konstrukcja jest mechanizmem, a EduBeam zakreśla przeguby i pokazuje ruch.
2. **Podczas obliczeń** dokładnie osobliwa macierz zatrzymuje rozkład LU: *Konstrukcja jest mechanizmem: macierz sztywności jest osobliwa.*
3. **Po obliczeniach** przemieszczenie lub obrót większy niż $10^6$ m lub rad oznacza, że macierz była osobliwa z dokładnością do błędów zaokrągleń. EduBeam podaje węzły i kierunki, w których konstrukcja się przemieszcza: *Konstrukcja jest niestateczna – praktycznie bez oporu przemieszcza się: …* Tu trafisz też wtedy, gdy materiał lub przekrój zadasz jako zero albo w złych jednostkach.

Obrót, z którym nic nie jest połączone, w węźle, w którym wszystkie pręty mają przeguby, nie jest mechanizmem: solver pozostawia go równym zeru. Wszystkie komunikaty i sposoby ich usunięcia opisuje strona [Rozwiązywanie problemów](/pl/reference/troubleshooting#no-results-are-drawn).

## Uruchom solver samodzielnie {#library}

Solver ma otwarty kod źródłowy: [@edubeam/fem](/pl/solver), napisany w TypeScripcie, działa w przeglądarce i w Node. Ta sama belka jednostronnie utwierdzona:

```ts
import { DofID, LinearStaticSolver, type Beam2D } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]

// Jednostki SI: m, N, Pa. Stal, IPE 300; k = 1e32 czyni przekrój sztywnym na ścinanie.
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // utwierdzenie
domain.createNode('B', [4, 0, 0], [DofID.Dz]) // podpora przesuwna
domain.createBeam2D('1', ['A', 'B'], 1, 1)
lc.createBeamElementUniformEdgeLoad('1', [0, 10_000], true) // 10 kN/m, w dół

solver.solve()

solver.neq // 2: Dx i Ry węzła B są swobodne
lc.r.toArray() // [0, 0.0007598, 0, 0, 0, 0]: swobodne stopnie swobody, potem podparte
lc.R.toArray() // [0, -25000, 20000, -15000]: A (Dx, Dz, Ry), potem B (Dz)

const beam = domain.getElement('1') as Beam2D
beam.computeEndForces(lc).toArray() // [0, -25000, 20000, 0, -15000, 0]
beam.computeBendingMomentAt(lc, 0) // -20000: N·m, moment ujemny w utwierdzeniu
beam.computeBendingMomentAt(lc, 2.5) // 11250: największy moment dodatni
```

Po `solve()` pole `solver.k` zawiera zagregowaną macierz $\mathbf{K}$, a `solver.f` wektor obciążeń $\mathbf{F}$, które możesz porównać z własną agregacją. Kroki opisane na tej stronie znajdziesz w plikach `Solver.ts` (numeracja), `LinearStaticSolver.ts` (agregacja, rozwiązanie, reakcje) i `Beam2D.ts` (macierze elementu i wyniki).

::div{.actions}
[Pierwsze kroki z @edubeam/fem](/pl/solver/getting-started) [Co zawiera biblioteka](/pl/solver/reference) [Kod źródłowy na GitHubie ↗](https://github.com/EduBeamApp/fem){target="_blank"}
::
