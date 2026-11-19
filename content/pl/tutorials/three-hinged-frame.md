---
description: "Samouczek: rama trójprzegubowa z obciążeniem równomiernym w EduBeamie – reakcje, rozpór i siły przekrojowe sprawdzone ręcznie, aż po ugięcie przegubu."
source: site
---

# Samouczek: rama trójprzegubowa

Zamodelujesz ramę portalową z przegubem w środku rygla, odczytasz reakcje i wykresy, a potem sprawdzisz ręcznie każdą liczbę, łącznie z ugięciem przegubu.

- **Czas:** około 15 minut.
- **Przygotuj:** EduBeam otwarty w drugiej karcie przeglądarki, na komputerze z myszą i klawiaturą. Jeśli jeszcze nie pracowałeś w EduBeamie, zacznij od [Szybkiego startu](/pl/guide/quick-start) albo samouczka [Belka pochyła](/pl/tutorials/inclined-beam).
- **Wymagana wiedza:** równowaga ramy i rozpatrywanie części odciętych. Nieobowiązkowe sprawdzenie ugięcia korzysta z metody obciążenia jednostkowego (zasady prac wirtualnych).
- **Jednostki:** SI. Plakietka jednostek w prawym dolnym rogu widoku powinna pokazywać `m m² kN kNm MPa`. Jeśli widzisz na niej stopy i kipy, kliknij ją i w polu **Układ jednostek** wybierz **SI (metryczny)**.

**Czego się nauczysz**

- rysować ramę myszą jako jedną linię łamaną,
- wstawiać przegub wewnątrz pręta za pomocą pól **Przeguby końcowe**,
- wyznaczać rozpór z warunku $M = 0$ w przegubie i odczytywać znak $V$ w prętach narysowanych w różnych kierunkach.

::div{.actions}
[Otwórz EduBeam ↗](https://run.edubeam.app/?lang=pl){target="_blank"} [Przejdź do obliczeń ręcznych](#_6-check-by-hand)
::

::model-figure{caption="Gotowa rama: 10 kN/m na ryglu, podpory przegubowe w węzłach 1 i 5, przegub w węźle 3"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], { nodes: [2, 3], hinges: [false, true] }, [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## Zadanie {#the-problem}

- Dwa słupy o wysokości 4 m, podparte przegubowo u podstaw (węzły 1 i 5), w rozstawie 8 m.
- Na górze poziomy rygiel od węzła 2 do węzła 4, z przegubem w środku rozpiętości, w węźle 3.
- Obciążenie równomierne $q = 10$ kN/m na całym ryglu.
- Stal, $E = 210$ GPa, i $I_y = 8{,}356 \times 10^{-5}$ m⁴ (IPE 300) we wszystkich prętach.

| Węzeł | x (m) | z (m) | |
| --- | --- | --- | --- |
| 1 | 0 | 0 | podpora przegubowa |
| 2 | 0 | −4 | naroże |
| 3 | 4 | −4 | przegub w ryglu |
| 4 | 8 | −4 | naroże |
| 5 | 8 | 0 | podpora przegubowa |

Oś z jest skierowana **w dół**, więc głowice słupów są na poziomie $z = -4$.

**Czy jest statycznie wyznaczalna?** Dwie podpory przegubowe dają cztery reakcje. Trzy równania równowagi i warunek $M_3 = 0$ w przegubie to razem cztery równania: tak.

## Zbuduj model {#model-it}

::div{.steps}

### Materiał i przekrój {#_1-material-and-section}

1. Na pasku aplikacji kliknij **Wyczyść model**, zaznacz **Usuń materiały** i **Usuń przekroje** i kliknij **Potwierdź**. Węzły i elementy będą znów numerowane od 1.
2. Zakładka **Materiały** → **Biblioteka materiałów** → **+** w wierszu **Stal (S235)**, a potem **Anuluj**, aby zamknąć bibliotekę.
3. Zakładka **Przekroje** → **Dodaj przekrój**. Jako **Iy** wpisz `8,356e-5`, w polach **Pole**, **Wysokość** i **Współczynnik ścinania** zostaw `1` i kliknij **Dodaj przekrój**.

Przy polu 1 m² pręty praktycznie się nie skracają ani nie odkształcają postaciowo, co zakłada ręczne obliczenie ugięcia. Siły przekrojowe ramy statycznie wyznaczalnej w ogóle nie zależą od $E$, $A$ ani $I_y$.

### Narysuj ramę {#_2-draw-the-frame}

1. Zakładka **Elementy** → drugi przycisk **Dodaj element**, ten z ikoną kursora.
2. Kliknij (0, 0), (0, −4), (4, −4), (8, −4) i (8, 0). Każde kliknięcie dodaje kolejny węzeł i łączy go z poprzednim; kliknięcia są przyciągane do siatki.
3. Naciśnij <kbd>Esc</kbd>, aby zakończyć rysowanie, a potem <kbd>F</kbd>, aby dopasować widok.

Masz teraz węzły od 1 do 5 i elementy od 1 do 4, ponumerowane w kolejności rysowania, tak jak na rysunkach na tej stronie. Porównaj tabelę **Węzły** z tabelą powyżej i popraw współrzędne, które nie trafiły.

### Podpory i przegub {#_3-supports-and-the-hinge}

1. Kliknij węzeł 1 → **Podpory węzła** → symbol **Przegub**. To samo zrób z węzłem 5.
2. W tabeli **Elementy** znajdź element 2, od węzła 2 do węzła 3, i zaznacz drugie z jego pól **Przeguby końcowe**, czyli przegub na jego końcu, w węźle 3.

![Tabela Elementy: element 2 ma zaznaczony przegub na końcu, w węźle 3](/screenshots/pl/p2t-frame-elements-table.webp)

Jeden przegub wystarczy. Element 3 jest wtedy jedynym prętem połączonym sztywnie z węzłem 3, więc żaden moment nie może do niego w tym miejscu przejść. Zaznaczenie także początku elementu 3 niczego nie zmienia.

### Obciążenie {#_4-load}

1. Zakładka **Obciążenia** → **Dodaj obciążenie elementu**.
2. **Typ obciążenia** *Obciążenie równomiernie rozłożone*, **Element** `2`, `fz = 10`. Kliknij **Dodaj obciążenie elementu**.
3. Powtórz to dla elementu 3.

Dodatnie `fz` działa w dół. Rygiel jest poziomy, więc pole **LCS** (lokalny układ współrzędnych) nie ma tu znaczenia.

::

## Wyniki {#_5-results}

W opcjach wyświetlania w prawym górnym rogu widoku (pokazuje je i ukrywa ikona koła zębatego) od początku są włączone **Kształt odkształcony**, **M<sub>y</sub> (x)** i **Reakcje**. Zaznacz **N (x)** i **V<sub>z</sub> (x)**, aby zobaczyć resztę, albo odznacz niektóre, aby oglądać jeden wykres naraz. EduBeam opisuje je w kN i kNm z dwoma miejscami po przecinku.

- Przy każdej podstawie widać `40,00` w górę i `20,00` do środka.
- Moment zginający ma wartość `-80,00` w obu narożach i nie ma etykiety w przegubie, gdzie jest zerowy. EduBeam rysuje go po stronie rozciąganej, tu na zewnątrz ramy.
- Siła normalna jest wszędzie ujemna: `-40,00` w słupach, `-20,00` w ryglu. Wszystkie cztery pręty są ściskane.
- Zakładka **Wyniki** → **Wyniki węzłowe**: przegub (węzeł 3) przemieszcza się w dół o $D_z$ = `4,2554 · 10⁻² m`, czyli o 42,55 mm; tę samą wartość widać w przegubie w widoku $w(x)$ na rysunku u góry.

## Sprawdź ręcznie {#_6-check-by-hand}

**Reakcje pionowe.** Z symetrii każda podstawa przejmuje połowę z 80 kN:

$$
V_1 = V_5 = \frac{q \cdot 8}{2} = 40\ \text{kN}
$$

**Reakcje poziome.** Przetnij ramę w przegubie i dla lewej połowy zapisz sumę momentów względem węzła 3, w którym moment jest zerowy:

$$
V_1 \cdot 4 - H_1 \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_1 = \frac{160 - 80}{4} = 20\ \text{kN}
$$

Obie podpory pchają ramę do środka siłą 20 kN. Bez tego rozporu, który dają podpory nieprzesuwne, rama nie mogłaby stać: słupy rozjechałyby się na boki, a przegub by opadł.

| Wielkość | Wzór | Ręcznie | EduBeam |
| --- | --- | --- | --- |
| Reakcje pionowe | $q \cdot 8/2$ | 40 kN | 40,00 |
| Reakcje poziome | z $M_3 = 0$ | 20 kN | 20,00 |
| Momenty w narożach, węzły 2 i 4 | $H_1 \cdot 4$ | 80 kNm, rozciągane włókna zewnętrzne | −80,00 |
| Moment w przegubie, węzeł 3 | | 0 | brak etykiety |
| $N$ w słupach | $-V_1$ | −40 kN | −40,00 |
| $N$ w ryglu | $-H_1$ | −20 kN | −20,00 |
| $V$ w słupach | $\pm H_1$ | ±20 kN | −20,00; 20,00 |
| $V$ w ryglu w węzłach 2, 3, 4 | $V_1 - q\,x$ | 40; 0; −40 kN | 40,00; brak etykiety; −40,00 |

Oba słupy przenoszą tę samą siłę tnącą z przeciwnymi znakami, −20 kN w elemencie 1 i +20 kN w elemencie 4, ponieważ osie lokalne każdego elementu wynikają z kierunku, w którym go narysowano: element 1 w górę, element 4 w dół. Zamień węzły jednego słupa, a jego znak się odwróci. Dlaczego tak jest, wyjaśnia strona [Układ współrzędnych i konwencje znaków](/pl/elements/conventions#internal-forces).

W ryglu $M(x) = -80 + 40x - 5x^2$ kNm, gdzie $x$ mierzy się od węzła 2. Moment jest zerowy w przegubie i nigdzie nie jest dodatni: na całej długości rygla rozciągane są włókna górne. Siła tnąca $V(x) = 40 - 10x$ jest zerowa dokładnie w przegubie, więc właśnie tam moment osiąga ekstremum.

::callout{type="details" title="Ugięcie przegubu z zasady prac wirtualnych"}
Przyłóż w węźle 3 siłę jednostkową skierowaną w dół. Daje ona reakcje $\bar V = \bar H = 1/2$ i moment $\bar m$, który rośnie od 0 u podstawy do 2 w narożu i maleje z powrotem do 0 w przegubie, z rozciąganymi włóknami zewnętrznymi, tak jak rzeczywisty moment $M$. Scałkuj $M \bar m$ po czterech prętach:

$$
\text{słupy: } 2\int_0^4 (20\,y)(0{,}5\,y)\,dy = 426{,}7
$$

$$
\text{rygiel: } 2\int_0^4 (80 - 40x + 5x^2)(2 - 0{,}5x)\,dx = 320
$$

Przy $EI = 210 \times 10^6 \cdot 8{,}356 \times 10^{-5} = 17\,548$ kNm²:

$$
\delta_3 = \frac{1}{EI}\int M \bar m\,dx = \frac{746{,}7}{17\,548} = 0{,}04255\ \text{m}
$$

To 42,55 mm, które EduBeam podaje jako `4,2554 · 10⁻²` m. Czwórka na ostatnim miejscu to drobne skrócenie i odkształcenie postaciowe, na które pole 1 m² jeszcze pozwala, a których obliczenie ręczne nie uwzględnia. Przy rzeczywistym polu IPE 300, $A = 53{,}8$ cm², i środniku jako polu ścinania (współczynnik ścinania 0,40) pręty skracają się i odkształcają postaciowo bardziej, a przegub obniża się o 43,7 mm, czyli o około 3 % więcej.
::

## Eksperymentuj {#_7-experiment}

Zmieniaj jedną rzecz naraz, przewidź wynik i dopiero wtedy sprawdź. <kbd>Ctrl</kbd>+<kbd>Z</kbd> cofa każdą zmianę.

**Odznacz przegub.** Rama staje się jednokrotnie statycznie niewyznaczalna. Rozpór spada o połowę, do 10 kN, momenty w narożach maleją do −40 kNm, a w środku rozpiętości rygla pojawia się moment dodatni 40 kNm. Węzeł 3 obniża się teraz tylko o 12,16 mm zamiast o 42,55 mm. Teraz liczą się też przekroje: daj ryglowi sztywniejszy przekrój niż słupom, a momenty w narożach wzrosną.

::model-figure{caption="Bez przegubu: mniejszy rozpór, dwa razy mniejsze momenty w narożach i moment dodatni w środku rozpiętości"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], [2, 3], [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, w]
show: [nodeLabels]
---
::

**Utwierdź podstawy.** Nadaj węzłom 1 i 5 symbol **Utwierdzenie**. Rozpór rośnie do 30 kN, a u podstaw pojawiają się momenty 40 kNm (EduBeam pokazuje `39,99`, bo słupy minimalnie się skracają), ale momenty w narożach pozostają równe 80 kNm. Z symetrii siła tnąca w przegubie jest zerowa, więc każda połowa rygla nadal pracuje jak wspornik o długości 4 m wychodzący z naroża: $q \cdot 4^2/2 = 80$ kNm.

**Pchnij ramę w bok.** Wróć do podpór przegubowych i dodaj w węźle 2 obciążenie węzłowe `Fx = 10` kN. Reakcje tracą symetrię: 35 kN i 45 kN w górę, 15 kN i 25 kN poziomo. Sprawdź je tymi samymi trzema równaniami i warunkiem $M_3 = 0$; obciążenie w węźle 2 nie ma ramienia względem węzła 3. Moment w lewym narożu spada do −60 kNm, a w lewej połowie rygla pojawia się niewielki moment dodatni, 1,25 kNm w odległości 0,5 m od przegubu.

::model-figure{caption="Pozioma siła 10 kN w węźle 2: prawe naroże przejmuje teraz 100 kNm"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], { nodes: [2, 3], hinges: [false, true] }, [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
  - { node: 2, fx: 10 }
results: [M, N]
show: [nodeLabels]
---
::

**Dodaj drugi przegub.** Zaznacz także przegub na początku elementu 2, w węźle 2. Dwa przeguby w ryglu opartym na dwóch słupach podpartych przegubowo tworzą mechanizm. EduBeam nie pokazuje wyników, wyświetla komunikat *Przeguby w węzłach 2, 3 pozwalają konstrukcji się poruszać.* i animuje ruch.

## Co dalej {#next-steps}

::card-grid{cols="2"}
:::card{title="Ćwicz: ramy trójprzegubowe" icon="lucide:dices" to="/pl/practice?p=H2048"}
Ta sama rama pod nowymi obciążeniami, w tym pod siłą poziomą, z natychmiastowym sprawdzaniem odpowiedzi. Zacznij od zadania H2048; po kolejne zostaw zaznaczony tylko typ **Rama trójprzegubowa** i naciśnij **Nowe zadanie**.
:::
:::card{title="Dalej: kratownica płaska" icon="lucide:git-fork" to="/pl/tutorials/truss"}
Dziewięć prętów połączonych przegubowo: metoda równoważenia węzłów, metoda Rittera, pręt zerowy i ugięcie z zasady prac wirtualnych.
:::
::
