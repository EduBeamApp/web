---
description: "Samouczek: statycznie niewyznaczalna belka dwuprzęsłowa w EduBeamie – porównanie z dwiema belkami swobodnie podpartymi, osiadanie podpory i metoda sił."
source: site
---

# Samouczek: belka ciągła i osiadanie podpory

Zamodelujesz belkę ciągłą o dwóch przęsłach, porównasz ją z dwiema belkami swobodnie podpartymi, a potem pozwolisz jej podporze środkowej osiąść o 10 mm. Reakcji tej belki nie da się wyznaczyć z samych warunków równowagi, więc sprawdzisz je metodą sił.

- **Czas:** około 25 minut. To ostatni i najbogatszy z czterech samouczków.
- **Przygotuj:** EduBeam otwarty w drugiej karcie przeglądarki, na komputerze z myszą i klawiaturą. Jeśli jeszcze nie pracowałeś w EduBeamie, zacznij od [Szybkiego startu](/pl/guide/quick-start) albo jednego z wcześniejszych samouczków.
- **Wymagana wiedza:** metoda sił dla układu jednokrotnie statycznie niewyznaczalnego oraz ugięcia w środku rozpiętości belki swobodnie podpartej: $5qL^4/(384EI)$ od obciążenia równomiernego i $FL^3/(48EI)$ od siły skupionej.
- **Jednostki:** SI. Plakietka jednostek w prawym dolnym rogu widoku powinna pokazywać `m m² kN kNm MPa`. Jeśli widzisz na niej stopy i kipy, kliknij ją i w polu **Układ jednostek** wybierz **SI (metryczny)**.

**Czego się nauczysz**

- oceniać, co daje ciągłość: mniejsze momenty i ugięcia niż w belkach swobodnie podpartych,
- zadawać osiadanie podpory i odczytywać siły, które wywołuje ono samo,
- sprawdzać belkę statycznie niewyznaczalną metodą sił i rozumieć, dlaczego sztywniejsza belka bardziej odczuwa osiadanie podpory.

::div{.actions}
[Otwórz EduBeam ↗](https://run.edubeam.app/?lang=pl){target="_blank"} [Przejdź do obliczeń ręcznych](#check-by-hand)
::

::model-figure{caption="Gotowa belka: dwa przęsła po 6 m obciążone 10 kN/m, przed osiadaniem podpory"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels, dimensions]
---
::

## Zadanie {#the-problem}

- Dwa przęsła o rozpiętości $L = 6$ m: podpora przegubowa nieprzesuwna w węźle 1, przesuwne w węzłach 2 i 3.
- Obciążenie równomierne $q = 10$ kN/m na obu przęsłach.
- Stal, $E = 210$ GPa, i $I_y = 8{,}356 \times 10^{-5}$ m⁴ (IPE 300), zatem $EI = 17\,547{,}6$ kNm².
- W drugiej części podpora środkowa, w węźle 2, osiada o $\Delta = 10$ mm.

**Czy jest statycznie wyznaczalna?** Cztery reakcje (dwie w węźle 1 i po jednej w węzłach 2 i 3), a tylko trzy równania równowagi: belka jest jednokrotnie statycznie niewyznaczalna. Brakujące równanie daje warunek przemieszczeniowy: węzeł 2 się nie przemieszcza albo przemieszcza się dokładnie o $\Delta$.

## Zbuduj model {#model-it}

::div{.steps}

### Materiał i przekrój {#material-and-section}

1. Na pasku aplikacji kliknij **Wyczyść model**, zaznacz **Usuń materiały** i **Usuń przekroje** i kliknij **Potwierdź**. Węzły i elementy będą znów numerowane od 1.
2. Zakładka **Materiały** → **Biblioteka materiałów** → **+** w wierszu **Stal (S235)**, a potem **Anuluj**, aby zamknąć bibliotekę.
3. Zakładka **Przekroje** → **Dodaj przekrój**. Jako **Iy** wpisz `8,356e-5`, w polach **Pole**, **Wysokość** i **Współczynnik ścinania** zostaw `1` i kliknij **Dodaj przekrój**.

Przy polu 1 m² belka praktycznie nie odkształca się postaciowo, co zakłada obliczenie ręczne. Tym razem $I_y$ wpływa także na siły: zobaczysz, w którym miejscu.

### Narysuj belkę {#draw-the-beam}

1. Zakładka **Elementy** → drugi przycisk **Dodaj element**, ten z ikoną kursora.
2. Kliknij (0, 0), (6, 0) i (12, 0).
3. Naciśnij <kbd>Esc</kbd>, aby zakończyć rysowanie, a potem <kbd>F</kbd>, aby dopasować widok.

Powstały trzy węzły i dwa elementy. Sprawdź współrzędne w tabeli **Węzły**.

### Podpory {#supports}

Kliknij węzeł 1 → **Podpory węzła** → symbol **Przegub**. Węzłom 2 i 3 nadaj **Przegub przesuwny**.

### Obciążenie {#load}

Zakładka **Obciążenia** → **Dodaj obciążenie elementu** → *Obciążenie równomiernie rozłożone* na **Element** `1`, `fz = 10` → **Dodaj obciążenie elementu**. Powtórz to dla elementu 2.

::

## Wyniki {#results}

Moment zginający, reakcje i postać odkształcona są włączone od początku. Aby zobaczyć siłę tnącą, zaznacz **V<sub>z</sub> (x)** w opcjach wyświetlania w prawym górnym rogu widoku (pokazuje je i ukrywa ikona koła zębatego). EduBeam opisuje wykresy i reakcje w kN i kNm z dwoma miejscami po przecinku.

- Reakcje mają wartości `22,50` w węzłach 1 i 3 oraz `75,00` w węźle 2: podpora środkowa przenosi ponad połowę ze 120 kN.
- Moment nad węzłem 2 wynosi `-45,00`, jest więc ujemny (rozciąga włókna górne). Największy moment przęsłowy, dodatni, to `25,31` kNm w odległości 2,25 m od podpór skrajnych.
- Siła tnąca nad węzłem 2 skacze z `-37,50` na `37,50`.

### Porównanie z dwiema belkami swobodnie podpartymi {#compare-with-two-simple-spans}

Co daje ciągłość? Przerwij ją: w tabeli **Elementy** zaznacz przegub na **końcu** elementu 1, w węźle 2. Belka zamienia się w dwie belki swobodnie podparte o rozpiętości 6 m, czyli w układ statycznie wyznaczalny.

::model-figure{caption="Z przegubem nad węzłem 2: dwie belki swobodnie podparte, każda z qL²/8 = 45 kNm"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [{ nodes: [1, 2], hinges: [false, true] }, [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, w]
show: [nodeLabels]
---
::

| | Belka ciągła | Dwie belki swobodnie podparte |
| --- | --- | --- |
| Reakcje w węzłach 1, 2, 3 | 22,5; 75; 22,5 kN | 30; 60; 30 kN |
| Moment nad węzłem 2 | −45 kNm | 0 |
| Największy moment przęsłowy | 25,31 kNm | 45 kNm |
| Największe ugięcie (w widoku $w(x)$ na rysunkach) | 4,000 mm | 9,617 mm |

Największy moment ma w obu przypadkach te same 45 kNm, ale w belce ciągłej przenosi się nad podporę, a przęsła uginają się znacznie mniej. Każde przęsło jest też 2,4 raza sztywniejsze: jego koniec nad węzłem 2 nie może się obrócić, prawie jakby był utwierdzony. Zanim przejdziesz dalej, znów odznacz przegub.

## Osiadanie podpory środkowej {#settle-the-middle-support}

Teraz pozwól węzłowi 2 obniżyć się o 10 mm, tak jak mógłby osiąść fundament na słabym gruncie.

::div{.steps}

### Zadaj osiadanie {#prescribe-the-settlement}

Kliknij węzeł 2 → **Zadaj przemieszczenie**. W oknie jest już wybrane **Zadane przemieszczenie**; w polu **Dz** wpisz `0,01` i kliknij **Dodaj obciążenie węzłowe**.

![Okno zadanego przemieszczenia: ustawić można tylko Dz, czyli kierunek, który blokuje podpora przesuwna](/screenshots/pl/p2t-prescribe-displacement.webp){.shot-sm}

W domyślnych jednostkach SI przemieszczenia podaje się w metrach, więc 10 mm to `0,01`; wartość dodatnia oznacza ruch w dół. Ustawić można tylko kierunki zablokowane: podporę przesuwną da się obniżyć, ale nie przesunąć w bok. Więcej znajdziesz w części [Zadane przemieszczenia](/pl/essentials/loads#prescribed-displacements-support-settlements).

### Odczytaj nowe wyniki {#read-the-new-results}

Reakcja środkowa spada do `70,13` kN, a reakcje skrajne rosną do `24,94` kN. Moment nad węzłem 2 maleje co do wartości do `-30,38` kNm, a momenty przęsłowe rosną, do `31,09` kNm.

::model-figure{caption="Węzeł 2 obniżony o 10 mm: moment podporowy nad nim maleje, a przęsła przejmują więcej"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
  - { node: 2, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

### Samo osiadanie {#look-at-the-settlement-alone}

Usuń oba obciążenia elementów: zaznacz każde z nich i naciśnij <kbd>Delete</kbd> albo kliknij × w jego wierszu tabeli **Obciążenia**. Zostaje sam wpływ osiadania: trójkątny wykres momentu dodatniego z wartością `14,62` kNm nad węzłem 2 oraz reakcje, które ciągną węzeł 2 **w dół** siłą `4,87` kN, a w węzłach 1 i 3 pchają w górę siłą `2,44` kN każda. Belka opiera się wygięciu w kształt narzucony przez osiadanie i tylko ten opór ją obciąża.

::model-figure{caption="Samo osiadanie podpory: brak obciążenia, a jednak belka jest zginana i podpory reagują"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { node: 2, settlement: { dz: 0.01 } }
results: [M, w]
show: [nodeLabels]
---
::

Dodaj te wartości do wyników od samego obciążenia, a otrzymasz wyniki obciążonej belki z osiadaniem podpory: 75 − 4,87 = 70,13 kN, −45 + 14,62 = −30,38 kNm. Obliczenia są liniowe, więc efekty się sumują.

### Znów przerwij ciągłość {#cut-the-continuity-again}

Przywróć obciążenia skrótem <kbd>Ctrl</kbd>+<kbd>Z</kbd>, raz dla każdego usuniętego obciążenia, i ponownie zaznacz przegub na końcu elementu 1. Przęsła po osiadaniu tylko się teraz pochylają: reakcje i momenty są dokładnie takie jak w dwóch belkach swobodnie podpartych, niezależnie od wielkości osiadania, a bez obciążenia byłyby zerowe. **Osiadanie podpory wywołuje siły przekrojowe tylko w układzie statycznie niewyznaczalnym.** Zanim przejdziesz dalej, odznacz przegub.

::

## Sprawdź ręcznie {#check-by-hand}

Zastosuj metodę sił. Usuń podporę w węźle 2 i zastąp ją niewiadomą reakcją $R_2$, która działa w górę na belkę swobodnie podpartą o rozpiętości $2L = 12$ m.

**Ugięcia układu podstawowego w węźle 2** od obciążenia oraz od siły jednostkowej przyłożonej w węźle 2 i skierowanej w górę:

$$
\delta_q = \frac{5q\,(2L)^4}{384\,EI} = \frac{5 \cdot 10 \cdot 12^4}{384 \cdot 17\,547{,}6} = 0{,}15387\ \text{m}
$$

$$
\delta_{1} = \frac{(2L)^3}{48\,EI} = \frac{12^3}{48 \cdot 17\,547{,}6} = 0{,}0020516\ \text{m/kN}
$$

**Warunek zgodności przemieszczeń.** Reakcja $R_2$ musi wypchnąć węzeł 2 z powrotem w górę, aż znajdzie się tam, gdzie jest podpora: na poziomie zero albo $\Delta$ niżej.

$$
R_2\,\delta_1 = \delta_q - \Delta \quad\Rightarrow\quad R_2 = \frac{\delta_q - \Delta}{\delta_1}
$$

**Wszystko pozostałe** wynika z warunków równowagi; największy moment przęsłowy występuje tam, gdzie siła tnąca $R_1 - qx$ jest zerowa.

| | Wzór | Bez osiadania | Węzeł 2 obniżony o 10 mm |
| --- | --- | --- | --- |
| $R_2$ | $(\delta_q - \Delta)/\delta_1$ | 75,00 kN | 70,13 kN |
| $R_1 = R_3$ | $(2qL - R_2)/2$ | 22,50 kN | 24,94 kN |
| $M_2$ | $R_1 L - qL^2/2$ | −45,00 kNm | −30,38 kNm |
| $M_{\max}$ | $R_1^2/(2q)$ | 25,31 kNm | 31,09 kNm |

EduBeam pokazuje te same wartości co do ostatniej cyfry.

Bez osiadania to znane z podręczników wartości $R_2 = 10qL/8$, $M_2 = -qL^2/8$ i $M_{\max} = 9qL^2/128$. Samo osiadanie zmienia reakcje o $\Delta/\delta_1 = 4{,}874$ kN, a moment nad węzłem 2 o

$$
\Delta M_2 = \frac{\Delta}{\delta_1} \cdot \frac{2L}{4} = \frac{3\,EI\,\Delta}{L^2} = \frac{3 \cdot 17\,547{,}6 \cdot 0{,}01}{36} = 14{,}62\ \text{kNm}
$$

Zwróć uwagę na $EI$ w tym wzorze. Siły wywołane obciążeniem zależą tylko od tego, jak sztywne są pręty *względem siebie*; siły wywołane wymuszonym przemieszczeniem rosną wraz z samą sztywnością. Nad osiadającą podporą sztywniejsza belka przyciąga większe momenty.

## Eksperymentuj {#experiment}

Zacznij od obciążonej belki z osiadaniem, zmieniaj jedną rzecz naraz, przewidź wynik i dopiero wtedy sprawdź. <kbd>Ctrl</kbd>+<kbd>Z</kbd> cofa każdą zmianę.

**Podwój sztywność.** W tabeli **Przekroje** ustaw **Iy** na `1,6712e-4`. Wpływ osiadania na moment nad węzłem 2 podwaja się do 29,25 kNm, a $M_2$ maleje co do wartości do −15,75 kNm. Przy samym obciążeniu nie zmieniłoby się nic oprócz ugięć, które zmalałyby o połowę.

**Znajdź osiadanie, które uwalnia węzeł 2.** Przy jakim $\Delta$ moment nad węzłem 2 jest zerowy? $\Delta M_2 = 45$ kNm wymaga $\Delta = 45 L^2/(3EI) = qL^4/(24EI) = 0{,}0308$ m. Zmień osiadanie na `0,0308` w tabeli **Obciążenia** albo klikając je dwukrotnie w widoku: reakcje wynoszą 30, 60 i 30 kN, jak w dwóch belkach swobodnie podpartych, z dokładnością do zaokrąglenia $\Delta$. Wyrażenie $qL^4/(24EI)$ to kąt obrotu końca belki swobodnie podpartej pomnożony przez $L$: osiadanie pochyla każde przęsło dokładnie o tyle, by zniknęło załamanie nad węzłem 2, więc ciągłość nie ma już czego przenosić.

**Puść węzeł 2.** Zmień osiadanie na `0,1539`, czyli na ugięcie $\delta_q$ układu podstawowego o rozpiętości 12 m. Reakcja w węźle 2 spada praktycznie do zera i belka przenosi obciążenie jak jedna belka swobodnie podparta: 180 kNm w środku rozpiętości. Podpora, która osiada aż tyle, przestaje być podporą.

**Unieś węzeł 2.** Zmień osiadanie na `-0,01`, czyli 10 mm w górę. Każda zmiana wywołana osiadaniem zmienia znak: węzeł 2 przejmuje teraz 79,87 kN, a moment podporowy rośnie co do wartości do −59,62 kNm.

Więcej sprawdzeń z rozwiązaniami analitycznymi, w tym osiadanie podpory belki jednostronnie utwierdzonej, znajdziesz na stronie [Sprawdzanie wyników ręcznie](/pl/guide/verification#prescribed-displacement).

## Co dalej {#next-steps}

::card-grid{cols="2"}
:::card{title="Ćwicz: belki ciągłe dwuprzęsłowe" icon="lucide:dices" to="/pl/practice?p=K2049"}
Belki dwuprzęsłowe obciążone na jednym lub obu przęsłach, rozwiązywane metodą sił, z natychmiastowym sprawdzaniem odpowiedzi. Zacznij od zadania K2049; po kolejne zaznacz tylko typ **Belka ciągła dwuprzęsłowa** i naciśnij **Nowe zadanie**.
:::
:::card{title="Przykłady" icon="lucide:library" to="/pl/examples/"}
To był ostatni samouczek. W galerii przykładów znajdziesz kolejne modele do otwarcia, zmieniania i sprawdzania oraz gotowe ćwiczenia dla studentów.
:::
::
