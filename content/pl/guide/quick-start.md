---
description: "W ok. 10 minut zamodelujesz w EduBeamie stalową belkę swobodnie podpartą (materiał, przekrój, węzły, podpory, obciążenie), odczytasz wyniki i sprawdzisz je ręcznie."
source: site
---

# Szybki start

W ciągu mniej więcej dziesięciu minut zbudujesz stalową belkę swobodnie podpartą, odczytasz jej reakcje, siłę tnącą, moment zginający i ugięcie, a każdą liczbę sprawdzisz ręcznie. Otwórz EduBeam w drugiej karcie przeglądarki albo obok tej strony i wykonuj kolejne kroki na bieżąco.

::div{.actions}
[Otwórz EduBeam ↗](https://run.edubeam.app/?lang=pl){target="_blank"} [Przejdź do sprawdzenia ręcznego](#_8-check-by-hand)
::

## Zadanie {#the-problem}

Belka o rozpiętości 6 m spoczywa na podporze przegubowej nieprzesuwnej w węźle 1 i przesuwnej w węźle 2. Na całej długości działa na nią obciążenie równomierne 12 kN/m. Belka jest stalowa, z dwuteownika IPE 200: $E = 210$ GPa, $G = 81$ GPa, $A = 28{,}48\ \text{cm}^2$ i $I_y = 1943\ \text{cm}^4$. Wszystkie cztery wartości są w bibliotekach EduBeamu, więc niczego nie musisz szukać.

::model-figure{caption="Belka, którą zbudujesz: rozpiętość 6 m od węzła 1 do węzła 2, obciążenie 12 kN/m"}
---
nodes: { 1: [0, 0], 2: [6, 0] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 12 }
results: []
show: [nodeLabels, dimensions]
---
::

## Zbuduj model {#build-the-model}

::div{.steps}

### Zacznij od pustego modelu {#start-from-an-empty-model}

Przy pierwszej wizycie okno powitalne pyta, jak chcesz zacząć. W sekcji **Układ jednostek** wybierz **SI (metryczny)**, w sekcji **Układ współrzędnych** pozostaw **x w prawo, z w dół** i naciśnij **Pomiń na razie**. Aplikacja pokaże wtedy małą przykładową ramę.

1. Naciśnij **Wyczyść model** na pasku aplikacji (na telefonie ten przycisk jest w menu **☰**).
2. Zaznacz **Usuń materiały** i **Usuń przekroje**, a potem naciśnij **Potwierdź**.

Płótno jest teraz puste, a dwa czerwone komunikaty informują, że nie ma jeszcze materiału ani przekroju. Naprawisz to w kolejnych krokach. Nic nie przepada: <kbd>Ctrl</kbd>+<kbd>Z</kbd> przywraca ramę, a poza tym zostaje ona zachowana w **☰ → Ostatnie modele**.

### Sprawdź jednostki {#_1-check-the-units}

Plakietka w prawym dolnym rogu widoku pokazuje jednostki używane we wszystkich polach i wynikach. Ta strona używa jednostek SI, które plakietka pokazuje jako `m m² kN kNm MPa`, oraz osi z skierowanej w dół. Jeśli plakietka pokazuje stopy i kipy, kliknij ją i ustaw **Układ jednostek** na **SI (metryczny)**. W tym samym miejscu **Układ współrzędnych** musi być ustawiony na **x w prawo, z w dół**: przy osi y w górę dodatnie obciążenie działa w górę i znaki na tej stronie by się nie zgadzały.

![Przełączniki siatki (G) i przyciągania (S), celownik i plakietka jednostek](/screenshots/pl/ui-grid-units.webp){.shot-sm}

### Dodaj materiał i przekrój {#_2-add-the-material-and-cross-section}

Każdy element potrzebuje materiału i przekroju, dlatego najpierw dodaj je z bibliotek.

1. Otwórz zakładkę **Materiały** na dolnym pasku i kliknij **Biblioteka materiałów**.
2. Naciśnij **+** w wierszu **Stal (S235)** ($E = 210\,000$ MPa, $G = 81\,000$ MPa). Biblioteka zostaje otwarta, żeby można było dodać kolejne pozycje, więc zamknij ją przyciskiem **Anuluj**.
3. Otwórz zakładkę **Przekroje** i kliknij **Biblioteka przekrojów**.
4. Przewiń do wiersza **IPE 200 (przybl.)**, naciśnij **+** i zamknij bibliotekę przyciskiem **Anuluj**.

Oba czerwone komunikaty zniknęły, a zakładka **Przekroje** zawiera IPE 200:

![IPE 200 w zakładce Przekroje: pole, Iy, wysokość i współczynnik ścinania](/screenshots/pl/a-qs-cross-sections.webp)

Jeśli wolisz wpisać własne wartości, użyj przycisków **Dodaj materiał** i **Dodaj przekrój**. Współczynnik ścinania, tutaj 0,3933, wróci jeszcze w [sprawdzeniu ręcznym](#_8-check-by-hand).

### Dodaj węzły {#_3-add-the-nodes}

1. Otwórz zakładkę **Węzły**. Są w niej dwa przyciski **Dodaj węzeł**: **+** otwiera okno dialogowe, a ten z ikoną kursora wstawia węzły myszą. Kliknij **+ Dodaj węzeł**.
2. Pozostaw w polach **Współrzędna X** i **Współrzędna Z** wartość `0` i naciśnij **Dodaj węzeł**. Okno się zamyka i pojawia się węzeł `1`.
3. Ponownie kliknij **+ Dodaj węzeł**, wpisz `6` w polu **Współrzędna X** i naciśnij **Dodaj węzeł**. To węzeł `2`.

![Okno Dodaj nowy węzeł. Od razu można w nim ustawić także podpory.](/screenshots/pl/qs-node.webp){.shot-md}

### Połącz je elementem {#_4-connect-them-with-an-element}

Otwórz zakładkę **Elementy** i kliknij **+ Dodaj element**. Okno od razu proponuje **Węzeł początkowy** `1`, **Węzeł końcowy** `2` oraz Twój materiał i przekrój. Naciśnij **Dodaj element**.

![Dodaj nowy element: dwa węzły końcowe, opcjonalny przegub na każdym końcu, materiał i przekrój](/screenshots/pl/a-qs-element.webp){.shot-md}

Między węzłami pojawia się belka. Naciśnij <kbd>F</kbd>, aby dopasować ją do ekranu. Niebieska plakietka **Brak podpór** w lewym górnym rogu widoku wyjaśnia, dlaczego nie ma jeszcze wyników.

### Dodaj podpory {#_5-add-the-supports}

Wróć do zakładki **Węzły**. Na początku kolumny **Podparte stopnie swobody** każdy wiersz ma menu wyboru podpory.

- Węzeł `1`: wybierz **Przegub**. Zaznacza to `Dx` i `Dz`.
- Węzeł `2`: wybierz **Przegub przesuwny**. Zaznacza to tylko `Dz`.

![Wybór podpory w tabeli Węzły](/screenshots/pl/a-qs-support-picker.webp){.shot-lg}

Plakietka **Brak podpór** znika. Podporę możesz też ustawić, klikając węzeł w widoku i wybierając **Podpory węzła**. Wszystkie typy podpór opisuje strona [Węzły i podpory](/pl/essentials/nodes-supports#supports).

### Dodaj obciążenie {#_6-add-the-load}

1. Otwórz zakładkę **Obciążenia** i kliknij **Dodaj obciążenie elementu**.
2. Pozostaw **Typ obciążenia** ustawiony na *Obciążenie równomiernie rozłożone* i **Element** `1`.
3. Wpisz `12` w polu **fz**, w polu **fx** pozostaw `0` i naciśnij **Dodaj obciążenie elementu**.

![Okno dialogowe pokazuje podgląd obciążenia na elemencie](/screenshots/pl/a-qs-load.webp){.shot-md}

Dodatnie `fz` działa w kierunku +z, czyli **w dół**, więc wartość dodatnia oznacza obciążenie grawitacyjne. Zaznaczone pole **LCS** (lokalny układ współrzędnych) oznacza, że obciążenie jest określone w osiach lokalnych elementu; w belce poziomej narysowanej od lewej do prawej pokrywają się one z osiami globalnymi. Zobacz [konwencje znaków](/pl/elements/conventions#loads).

::

## Odczytaj wyniki {#_7-read-the-results}

EduBeam rozwiązuje belkę w chwili dodania obciążenia i ponownie po każdej zmianie: nie ma przycisku *Oblicz*. Panel w prawym górnym rogu widoku włącza i wyłącza poszczególne rysunki. **Kształt odkształcony**, **M<sub>y</sub>(x)** i **Reakcje** są włączone od początku. Zaznacz **V<sub>z</sub>(x)**, aby dodać siłę tnącą.

![Opcje wyświetlania z włączoną siłą tnącą](/screenshots/pl/a-qs-display.webp){.shot-md}

Ekran powinien teraz wyglądać tak jak na rysunku poniżej. Przełączaj się między momentem zginającym a siłą tnącą:

::model-figure{caption="Gotowa belka: reakcje 36 kN i moment 54 kNm w środku rozpiętości"}
---
nodes: { 1: [0, 0], 2: [6, 0] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 12 }
results: [M, V]
show: [nodeLabels]
---
::

| Rysunek | Na co zwrócić uwagę |
| --- | --- |
| **Reakcje** | Dwie strzałki skierowane w górę, po **36 kN**, po jednej na każdej podporze. |
| **V<sub>z</sub>(x)** | Prosta od **+36 kN** w węźle `1` do **−36 kN** w węźle `2`, przechodząca przez zero w środku rozpiętości. |
| **M<sub>y</sub>(x)** | Parabola z maksimum **54 kNm** w środku rozpiętości, narysowana po stronie rozciąganej, pod belką. |
| **Kształt odkształcony** | Symetryczne ugięcie, narysowane w powiększeniu. |

Liczby znajdziesz w zakładce **Wyniki**. **Wyniki węzłowe** podają przemieszczenia `Dx`, `Dz` i kąt obrotu `Ry` każdego węzła, a **Wyniki elementów** – siły przywęzłowe każdego elementu w jego osiach lokalnych. Węzeł `1` obraca się o $R_y = -2{,}6469 \cdot 10^{-2}$ rad, a węzeł `2` o tyle samo w przeciwną stronę. Wszystkie tabele i znaki wyjaśnia strona [Wyniki i wykresy](/pl/essentials/results).

Jeśli wykresy są za duże lub za małe, zmień ustawienie **Skala wyników** (**Ustawienia → Ustawienia widoku**).

## Sprawdź ręcznie {#_8-check-by-hand}

Dla $q = 12$ kN/m i $L = 6$ m wzory z podręcznika dają:

| Wielkość | Wzór | Ręcznie | EduBeam |
| --- | --- | --- | --- |
| Reakcje | $qL/2$ | 36 kN | 36 kN |
| Największa siła tnąca | $qL/2$ | 36 kN | 36 kN |
| Największy moment | $qL^2/8$ | 54 kNm | 54 kNm |
| Kąt obrotu na podporze | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Ugięcie w środku rozpiętości | $w_b + w_s$ | 49,63 + 0,60 = 50,22 mm | 50,22 mm |

Ugięcie składa się z dwóch części, a większość podręczników podaje tylko pierwszą:

- **Od zginania:** $w_b = 5qL^4/(384EI) = 49{,}63$ mm, przy czym $EI = 4080$ kNm² wynika z $E = 210$ GPa i $I_y = 1943\ \text{cm}^4$.
- **Od ścinania:** $w_s = qL^2/(8kGA) = 0{,}60$ mm, przy czym $kGA \approx 90\,700$ kN wynika z $k = 0{,}3933$, $G = 81$ GPa i $A = 28{,}48\ \text{cm}^2$.

W środku rozpiętości nie ma jeszcze węzła, więc dodaj go, aby odczytać tam ugięcie:

1. W zakładce **Węzły** kliknij drugi przycisk **Dodaj węzeł**, ten z ikoną kursora.
2. Kliknij belkę w punkcie `x = 3`; przy włączonym przyciąganiu węzeł trafi dokładnie w punkt siatki. EduBeam zapyta, co zrobić z węzłem: naciśnij **Połącz z konstrukcją**. EduBeam dzieli element na `1a` i `1b` razem z jego obciążeniem i kończy wstawianie węzłów. Jeśli węzeł `3` w zakładce **Węzły** nie ma współrzędnej X = `3`, wpisz tam `3`.
3. W zakładce **Wyniki → Wyniki węzłowe** węzeł `3` ma teraz $D_z = 5{,}0224 \cdot 10^{-2}$ m, czyli 50,22 mm.

![Wyniki węzłowe po podziale: węzeł 3 przemieszcza się w dół o 50,22 mm](/screenshots/pl/a-qs-nodal-results.webp){.shot-lg}

Podział belki nie zmienia żadnego wyniku, bo dla tych obciążeń element jest dokładny: nie ma siatki do zagęszczania.

::callout{type="details" title="Dlaczego współczynnik ścinania ma znaczenie"}
EduBeam używa elementów belkowych Timoszenki, które uwzględniają odkształcenie postaciowe. Współczynnik ścinania $k$ skaluje pole przenoszące ścinanie, więc sztywność na ścinanie wynosi $kGA$. Dla dwuteowników z biblioteki $k$ to udział środnika w polu przekroju, $h t_w / A$: dla IPE 200 $0{,}2 \cdot 0{,}0056 / 0{,}002848 = 0{,}3933$. Część ugięcia od ścinania, $w_s = qL^2/(8kGA)$, to całka z $V/(kGA)$ od podpory do środka rozpiętości.

W tej smukłej belce część od ścinania wynosi 0,60 mm, około 1 % całości. W krótkiej, wysokiej belce jest znacznie większa. Ustaw w zakładce **Przekroje** współczynnik ścinania na bardzo dużą liczbę (np. `1e10`), a EduBeam zwróci samo ugięcie od zginania, 49,63 mm. Teorię znajdziesz na stronie [Element belkowy](/pl/elements/beam).
::

Więcej sposobów sprawdzania ręcznego (wspornik, belka obustronnie utwierdzona, kratownica, temperatura, osiadanie podpory) znajdziesz na stronie [Sprawdzanie wyników ręcznie](/pl/guide/verification).

## Eksperymentuj {#_9-experiment}

Zmieniaj model i obserwuj, jak zmieniają się wykresy. Wypróbuj każdą zmianę osobno i przed następną cofnij ją skrótem <kbd>Ctrl</kbd>+<kbd>Z</kbd>. Węzeł `3` to węzeł w środku rozpiętości, który właśnie dodałeś.

- **Przeciągnij węzeł `2`** w prawo. Moment rośnie proporcjonalnie do $L^2$, a ugięcie do $L^4$.
- **Zaznacz `Ry` w węźle `1`**, aby utwierdzić ten koniec. W utwierdzeniu pojawia się moment ujemny: $qL^2/8 = 54$ kNm według wzoru z podręcznika, 53,8 kNm w EduBeamie. W belce statycznie niewyznaczalnej sztywność na ścinanie zmienia także siły przekrojowe.
- **Zaznacz `Dz` w węźle `3`**, aby dodać podporę pośrednią i otrzymać belkę ciągłą dwuprzęsłową. Moment nad podporą pośrednią staje się ujemny: ręcznie $q(L/2)^2/8 = 13{,}5$ kNm, w EduBeamie 13,3 kNm, z tego samego powodu.
- **Zaznacz `Dz` w węźle `3` oraz drugie pole w kolumnie *Przeguby końcowe* elementu `1a`** (jego koniec w węźle `3`) w zakładce **Elementy**. Belka zamienia się w dwie belki swobodnie podparte o rozpiętości 3 m. Teraz odznacz `Dz` w węźle `3`: belka staje się mechanizmem, a EduBeam pokazuje, jak może się poruszać.

Aby sprawdzić wpływ rozpiętości i obciążenia bez budowania czegokolwiek, przesuwaj poniższe suwaki i przełączaj się między wynikami: zobaczysz, jak każdy z nich rośnie wraz z rozpiętością.

::example-structure
::

## Zapisz lub udostępnij {#_10-save-or-share}

- **Wyślij komuś.** Naciśnij **Udostępnij model** na pasku aplikacji, a potem **Kopiuj**. Link zawiera cały model, a każdy, kto go otworzy, dostaje własną kopię do edycji.
- **Zachowaj w pliku.** **☰ → Zapisz projekt** (<kbd>Ctrl</kbd>+<kbd>S</kbd>) pobiera plik `project.json`. Otworzysz go ponownie przez **☰ → Otwórz projekt** (<kbd>Ctrl</kbd>+<kbd>O</kbd>) albo przeciągając plik do okna aplikacji.
- **Wstaw rysunek do sprawozdania.** **☰ → Eksportuj obraz** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) zapisuje go jako PNG lub SVG.

Model jest też przechowywany w przeglądarce, więc po odświeżeniu strony nie zniknie. Szczegóły znajdziesz na stronie [Pliki, linki i eksport](/pl/essentials/import-export).

## Co dalej {#where-next}

::card-grid{cols="2"}
:::card{title="Samouczki" icon="lucide:graduation-cap" to="/pl/tutorials/inclined-beam"}
Cztery modele zbudowane krok po kroku i sprawdzone ręcznie, od belki pochyłej po belkę ciągłą z osiadającą podporą.
:::
:::card{title="Przykłady" icon="lucide:library" to="/pl/examples/"}
Gotowe belki, ramy i kratownice otwierane jednym kliknięciem, z ćwiczeniami i odpowiedziami.
:::
:::card{title="Obciążenia" icon="lucide:arrow-down-to-line" to="/pl/essentials/loads"}
Obciążenia trapezowe, skupione i termiczne, siły węzłowe i osiadanie podpór.
:::
:::card{title="Klawiatura, mysz i dotyk" icon="lucide:keyboard" to="/pl/reference/shortcuts"}
Rysuj węzły i elementy bezpośrednio na płótnie i edytuj szybciej.
:::
::
