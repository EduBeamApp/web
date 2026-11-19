---
description: "Samouczek: belka pochyła (krokiew, bieg schodów) w EduBeamie – obciążenie na metr rzutu, siły N i V wzdłuż pochylenia i wpływ kierunku podpory przesuwnej. Około 15 minut."
source: site
---

# Samouczek: belka pochyła

Zamodelujesz krokiew obciążoną śniegiem, odczytasz siły normalne i tnące wzdłuż jej pochylenia i sprawdzisz je ręcznie.

- **Czas:** około 15 minut. To pierwszy i najkrótszy z czterech samouczków.
- **Przygotuj:** EduBeam otwarty w drugiej karcie przeglądarki, na komputerze z myszą i klawiaturą. Jeśli jeszcze nie pracowałeś w EduBeamie, najpierw przejdź [Szybki start](/pl/guide/quick-start): pokazuje zakładki i okna, z których korzysta ten samouczek.
- **Wymagana wiedza:** równowaga belki swobodnie podpartej i rozkład siły na dwie składowe.
- **Jednostki:** SI. Plakietka jednostek w prawym dolnym rogu widoku powinna pokazywać `m m² kN kNm MPa`. Jeśli widzisz na niej stopy i kipy, kliknij ją i w polu **Układ jednostek** wybierz **SI (metryczny)**.

**Czego się nauczysz**

- przeliczać obciążenie podane na metr rzutu poziomego na obciążenie wzdłuż pręta, którego oczekuje EduBeam,
- kierować obciążenie liniowe pionowo albo prostopadle do pręta za pomocą pola **LCS**,
- obracać podporę przesuwną i przekonać się, że zmienia to siłę normalną, ale nie moment zginający.

::div{.actions}
[Otwórz EduBeam ↗](https://run.edubeam.app/?lang=pl){target="_blank"} [Przejdź do obliczeń ręcznych](#check-by-hand)
::

::model-figure{caption="Gotowa krokiew: 3 kN/m śniegu na metr rzutu, wprowadzone jako 2,4 kN/m wzdłuż pręta, podpora przegubowa nieprzesuwna przy okapie (węzeł 1) i przesuwna przy kalenicy (węzeł 2)"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## Zadanie {#the-problem}

- Prosta krokiew od węzła 1 w (0, 0) do węzła 2 w (4, −3): 4 m w rzucie i 3 m wysokości, czyli długość $L = 5$ m, $\cos\alpha = 4/5$ i $\sin\alpha = 3/5$.
- Podpora przegubowa nieprzesuwna w węźle 1, przy okapie. W węźle 2, przy kalenicy, podpora przesuwna, która przesuwa się poziomo, więc jej reakcja jest pionowa.
- Śnieg $s = 3$ kN/m, podany tak jak w normach: **na metr rzutu** (poziomego).
- Stal, $E = 210$ GPa, i $I_y = 8{,}356 \times 10^{-5}$ m⁴, jak dla IPE 300.

**Czy jest statycznie wyznaczalna?** Trzy reakcje i trzy równania równowagi: tak. Siły wynikają z samych warunków równowagi; $E$ i $I_y$ mają znaczenie tylko dla ugięcia.

## Zbuduj model {#model-it}

::div{.steps}

### Materiał i przekrój {#material-and-section}

1. Na pasku aplikacji kliknij **Wyczyść model**, zaznacz **Usuń materiały** i **Usuń przekroje** i kliknij **Potwierdź**. Węzły i elementy będą znów numerowane od 1.
2. Zakładka **Materiały** → **Biblioteka materiałów** → **+** w wierszu **Stal (S235)**, a potem **Anuluj**, aby zamknąć bibliotekę.
3. Zakładka **Przekroje** → **Dodaj przekrój**. Jako **Iy** wpisz `8,356e-5`, w polach **Pole**, **Wysokość** i **Współczynnik ścinania** zostaw `1` i kliknij **Dodaj przekrój**.

Przy polu 1 m² pręt praktycznie się nie skraca ani nie odkształca postaciowo, co zakłada obliczenie ręczne.

### Narysuj pręt {#draw-the-member}

1. Zakładka **Elementy** → drugi przycisk **Dodaj element**, ten z ikoną kursora.
2. Kliknij (0, 0), a potem (4, −3). Linijki i celownik pokazują, gdzie jesteś, a kliknięcia są przyciągane do siatki.
3. Naciśnij <kbd>Esc</kbd>, aby zakończyć rysowanie, a potem <kbd>F</kbd>, aby dopasować widok.

Oś z jest skierowana w dół, więc węzeł 2, leżący 3 m **nad** węzłem 1, ma $z = -3$. Sprawdź oba węzły w tabeli **Węzły** i popraw współrzędne, które nie trafiły.

### Podpory {#supports}

Kliknij węzeł 1 → **Podpory węzła** → symbol **Przegub**. W ten sam sposób nadaj węzłowi 2 **Przegub przesuwny**.

### Obciążenie {#load}

Na krokiew przypada łącznie $3 \cdot 4 = 12$ kN śniegu. EduBeam rozkłada obciążenie równomierne wzdłuż **długości** pręta, więc te same 12 kN rozłożone na 5 m dają

$$
f_z = s \cdot \frac{4}{5} = s\cos\alpha = 3 \cdot 0{,}8 = 2{,}4\ \text{kN/m}
$$

1. Zakładka **Obciążenia** → **Dodaj obciążenie elementu**.
2. **Typ obciążenia** *Obciążenie równomiernie rozłożone*, **Element** `1`, `fz = 2,4`.
3. **Odznacz LCS** (lokalny układ współrzędnych), aby `fz` działało pionowo, i kliknij **Dodaj obciążenie elementu**.

::callout{type="warning" title="Pole LCS jest domyślnie zaznaczone"}
Przy zaznaczonym **LCS** `fz` działa wzdłuż lokalnej osi z elementu, czyli prostopadle do pochylenia: jak wiatr na dachu, a nie śnieg. W belce poziomej oba kierunki się pokrywają, dlatego łatwo to przeoczyć. Strzałki obciążenia pokazują, w którą stronę ono działa; szczegóły znajdziesz na stronie [Obciążenia](/pl/essentials/loads#uniformly-distributed-load).
::

::

## Wyniki {#results}

Belka jest rozwiązana, gdy tylko dodasz obciążenie. W opcjach wyświetlania w prawym górnym rogu widoku (pokazuje je i ukrywa ikona koła zębatego) od początku są włączone **Kształt odkształcony**, **M<sub>y</sub> (x)** i **Reakcje**; zaznacz jeszcze **N (x)** i **V<sub>z</sub> (x)**. Te same wykresy pokazuje przełącznik pod rysunkiem u góry.

EduBeam opisuje wykresy i reakcje w kN i kNm z dwoma miejscami po przecinku, więc powinieneś zobaczyć:

- `6,00` przy każdej podporze, w górę. Reakcja pozioma podpory nieprzesuwnej wynosi `0,00`: nie działa żadna siła pozioma.
- `6,00` kNm, czyli największy moment zginający, w środku rozpiętości.
- `4,80` kN siły tnącej w węźle 1 i `-4,80` w węźle 2.
- `-3,60` kN siły normalnej w węźle 1 (ściskanie) i `3,60` w węźle 2 (rozciąganie), z zerem w środku rozpiętości.

## Sprawdź ręcznie {#check-by-hand}

**Reakcje.** Wypadkowa 12 kN działa w odległości 2 m w rzucie od węzła 1, więc z sum momentów względem obu końców $V_1 = V_2 = 6$ kN. Nie działa żadna siła pozioma, zatem $H_1 = 0$.

**Moment zginający.** Dla sił pionowych liczą się tylko poziome ramiona. W odległości $x$ w rzucie od węzła 1

$$
M(x) = V_1\,x - \frac{s\,x^2}{2}, \qquad M_{\max} = \frac{s\,a^2}{8} = \frac{3 \cdot 4^2}{8} = 6\ \text{kNm}
$$

dokładnie tak jak w belce poziomej o rozpiętości $a = 4$ m pod tym samym obciążeniem na metr rzutu.

**Siła tnąca i normalna.** Siły na lewo od przekroju w punkcie $x$ sumują się do siły pionowej $T(x) = V_1 - s\,x$. Rozłóż ją na składową prostopadłą do pręta i składową wzdłuż niego:

$$
V = T\cos\alpha, \qquad N = -T\sin\alpha
$$

| | Węzeł 1, $T = +6$ kN | Środek rozpiętości, $T = 0$ | Węzeł 2, $T = -6$ kN |
| --- | --- | --- | --- |
| $V$ | $6 \cdot 0{,}8 = 4{,}8$ kN | 0 | −4,8 kN |
| $N$ | $-6 \cdot 0{,}6 = -3{,}6$ kN | 0 | +3,6 kN |
| $M$ | 0 | 6 kNm | 0 |

Wszystko zgadza się z EduBeamem. Skierowana w górę reakcja w węźle 1 pcha dolny koniec w górę pochylenia, w pręt: ściskanie. Skierowana w górę reakcja w węźle 2 ciągnie górny koniec dalej w górę pochylenia, od pręta: rozciąganie. Znaki wynikają z kierunku elementu, od węzła 1 do węzła 2, co wyjaśnia strona [Układ współrzędnych i konwencje znaków](/pl/elements/conventions#internal-forces).

## Eksperymentuj {#experiment}

Zmieniaj jedną rzecz naraz, przewidź wynik i dopiero wtedy sprawdź. <kbd>Ctrl</kbd>+<kbd>Z</kbd> cofa każdą zmianę.

**Zapomnij o cosinusie.** Wpisz `fz = 3` zamiast 2,4. To 3 kN na metr długości krokwi, łącznie 15 kN, i każdy wynik wychodzi o 25 % za duży: reakcje 7,5 kN i moment 7,5 kNm. Przy dachu o nachyleniu 30° błąd wyniósłby 15 %, przy 45° – 41 %.

**Zostaw zaznaczone pole LCS.** Zaznacz **LCS** przy obciążeniu 2,4 kN/m. Teraz działa ono prostopadle do pochylenia, jak wiatr, i ma składową poziomą 7,2 kN, którą może przenieść tylko podpora nieprzesuwna. Moment rośnie do $2{,}4 \cdot 5^2/8 = 7{,}5$ kNm, a siła normalna staje się stałym rozciąganiem 4,5 kN.

::model-figure{caption="Te same 2,4 kN/m z zaznaczonym LCS: prostopadle do pochylenia, więc podpora nieprzesuwna przejmuje 7,2 kN w poziomie"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4, local: true }
results: [M, N]
show: [nodeLabels]
---
::

**Obróć podporę przesuwną.** Znów odznacz **LCS** i zmień tylko kierunek, w którym przesuwa się podpora w węźle 2. Kliknij węzeł 2 → **Podpory węzła**, w polu **Kąt lokalnego układu** wpisz `-36,87` i naciśnij <kbd>Enter</kbd> (albo wpisz tę wartość w polu **α** w wierszu węzła w tabeli **Węzły**).

![Menu Podpory węzła dla węzła 2: symbole podpór, zablokowane kierunki i Kąt lokalnego układu](/screenshots/pl/p2t-node-supports-angle.webp){.shot-md}

Kąt obraca własne osie węzła. W domyślnych osiach (x w prawo, z w dół) kąt ujemny obraca je na ekranie przeciwnie do ruchu wskazówek zegara. Więcej znajdziesz w części [Podpory ukośne](/pl/essentials/nodes-supports#inclined-skewed-supports).

Podpora przesuwa się teraz wzdłuż pochylenia, więc jej reakcja jest prostopadła do pręta i z sumy momentów względem węzła 1 wynosi $12 \cdot 2 / 5 = 4{,}8$ kN. Resztę przejmuje podpora nieprzesuwna, a wraz z nią całą siłę normalną: −7,2 kN w węźle 1, zero w węźle 2.

::model-figure{caption="Podpora przesuwna w węźle 2 obrócona o −36,87°, tak by przesuwała się wzdłuż pochylenia: siła normalna zmienia się od −7,2 kN do zera"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
angles: { 2: -36.87 }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

**Zamień ją na pionową podporę przesuwną.** Przywróć kąt 0 i wybierz dla węzła 2 **Przegub przesuwny pionowy**. Przesuwa się on pionowo, więc może tylko pchać w bok: z sumy momentów względem węzła 1, $H_2 \cdot 3 = 12 \cdot 2$, wynika 8 kN, a podpora nieprzesuwna równoważy ten rozpór. Cały pręt jest ściskany.

::model-figure{caption="Pionowa podpora przesuwna w węźle 2: poziomy rozpór 8 kN i cała krokiew ściskana"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: verticalRoller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

Trzy podpory przesuwne obok siebie:

| Podpora przesuwna w węźle 2 | Reakcja w węźle 2 | Reakcja w węźle 1 | $N$ od węzła 1 do 2 |
| --- | --- | --- | --- |
| Pozioma | 6 kN ↑ | 6 kN ↑ | od −3,6 do +3,6 kN |
| Wzdłuż pochylenia | 4,8 kN ⊥ do pręta | 2,88 kN →, 8,16 kN ↑ | od −7,2 do 0 kN |
| Pionowa | 8 kN ← | 8 kN →, 12 kN ↑ | od −13,6 do −6,4 kN |

**Moment zginający nigdy się nie zmienia**, podobnie jak siła tnąca: we wszystkich trzech przypadkach to 6 kNm i ±4,8 kN. Węzeł 1, węzeł 2 i każdy przekrój leżą na jednej prostej – osi pręta. Składowa reakcji w węźle 2 działająca wzdłuż tej prostej nie daje momentu względem żadnego z tych punktów, więc dokłada tylko siłę normalną. Składowa prostopadła do pręta wynika z sumy momentów względem węzła 1 i zawsze wynosi 4,8 kN, niezależnie od kierunku podpory przesuwnej. Kierunek podpory decyduje tylko o tym, dokąd trafia rozpór, a to ma znaczenie dla ściany albo spocznika schodów, które muszą go przejąć.

## Co dalej {#next-steps}

::card-grid{cols="2"}
:::card{title="Ćwicz: belki ze wspornikiem" icon="lucide:dices" to="/pl/practice?p=O2048"}
Reakcje i największy moment belki pod obciążeniem rozłożonym, z natychmiastowym sprawdzaniem odpowiedzi. Zacznij od zadania O2048; po kolejne zostaw zaznaczony tylko typ **Belka ze wspornikiem** i naciśnij **Nowe zadanie**.
:::
:::card{title="Dalej: rama trójprzegubowa" icon="lucide:triangle" to="/pl/tutorials/three-hinged-frame"}
Cztery pręty, przegub wewnętrzny i poziomy rozpór: rama, którą wciąż rozwiążesz z samych warunków równowagi.
:::
::
