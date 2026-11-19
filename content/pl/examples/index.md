---
description: "Sześć rozwiązanych belek, ram i kratownic do otwarcia w EduBeamie jednym kliknięciem, z ćwiczeniami i odpowiedziami do sprawdzenia obliczeń ręcznych."
source: site
---

# Przykłady

Każdy kafelek poniżej to żywy, rozwiązany model. Kliknij go, aby otworzyć model w aplikacji [EduBeam]{.edubeam}, gotowy do edycji: przeciągnij węzeł, zmień obciążenie lub zaznacz przegub i obserwuj, jak zmieniają się wykresy. Ćwiczenia niżej zamieniają każdy model w krótkie zadanie, z odpowiedziami, z którymi porównasz własne obliczenia ręczne.

::feature-structures
::

Te same modele znajdziesz w aplikacji pod **☰ → Przykłady**, a link [run.edubeam.app/?panel=examples&lang=pl](https://run.edubeam.app/?panel=examples&lang=pl){target="_blank"} otwiera tę galerię bezpośrednio.

::callout{type="info" title="Jeden typ pręta we wszystkich sześciu przykładach"}
Wszystkie przykłady używają tego samego stalowego pręta: $E = 210$ GPa, $I_y = 8356\ \text{cm}^4$ (więc $EI = 17\,548$ kNm²), pole przekroju $1\ \text{m}^2$ i sztywność na ścinanie tak duża, że odkształcenia osiowe i postaciowe są pomijalne. Podręcznikowe wzory dla belek smukłych zgadzają się więc z aplikacją we wszystkich wyświetlanych cyfrach. Wysokość przekroju wynosi $1$ m, co ma znaczenie tylko dla obciążenia termicznego.
::

## Proponowane ćwiczenia {#suggested-exercises}

Najpierw policz wynik ręcznie, a potem sprawdź go w aplikacji: otwórz model z jego kafelka powyżej albo przyciskiem **Otwórz w EduBeamie** pod rysunkiem. Otwarcie modelu zastępuje ten, nad którym pracujesz; <kbd>Ctrl</kbd>+<kbd>Z</kbd> przywraca Twój model, a znajdziesz go też w **☰ → Ostatnie modele**.

### Belka statycznie niewyznaczalna {#exercise-indeterminate-beam}

Belka o rozpiętości 3 m, utwierdzona w A i oparta na podporze przesuwnej w B, obciążona równomiernie 10 kN/m.

::model-figure{caption="Utwierdzenie w A, podpora przesuwna w B, 10 kN/m"}
---
nodes: { A: [0, 0], B: [3, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Wyznacz ręcznie reakcje i moment w utwierdzeniu, metodą sił albo z tablic momentów przywęzłowych.
2. Odznacz `Ry` w A, aby belka stała się swobodnie podparta. Jak zmienia się największy moment?
3. Ponownie zaznacz `Ry` w A, a także w B, aby utwierdzić oba końce.

**Zwróć uwagę**, gdzie wykres momentów zmienia znak i jak utwierdzenie przejmuje większą część obciążenia niż podpora przesuwna.

::callout{type="details" title="Odpowiedzi"}
- Belka jednostronnie utwierdzona: $R_A = 5qL/8 = 18{,}75$ kN, $R_B = 3qL/8 = 11{,}25$ kN, $M_A = qL^2/8 = 11{,}25$ kNm, moment ujemny. Największy moment dodatni wynosi $9qL^2/128 = 6{,}33$ kNm w odległości 1,125 m od B, gdzie siła tnąca jest równa zeru.
- Belka swobodnie podparta: $qL^2/8 = 11{,}25$ kNm w środku rozpiętości, czyli ta sama wartość, którą wcześniej przenosiło utwierdzenie.
- Belka obustronnie utwierdzona: moment ujemny $qL^2/12 = 7{,}5$ kNm na końcach i moment dodatni $qL^2/24 = 3{,}75$ kNm w środku rozpiętości.
::

### Wspornik {#exercise-cantilever}

Wspornik o długości 4 m, utwierdzony w A, z siłą 18 kN skierowaną w dół na swobodnym końcu B.

::model-figure{caption="Wspornik, 18 kN na swobodnym końcu"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Wyznacz moment w utwierdzeniu, ugięcie i kąt obrotu swobodnego końca. Porównaj je z wynikami węzła B w **Wyniki → Wyniki węzłowe**.
2. Zmniejsz $I_y$ o połowę na zakładce **Przekroje**. Co się zmienia, a co nie?
3. Zastąp siłę skupioną obciążeniem równomiernym 4,5 kN/m, czyli tymi samymi 18 kN łącznie: usuń obciążenie węzłowe na zakładce **Obciążenia**, a potem użyj **Dodaj obciążenie elementu**.

**Zwróć uwagę** na kształt wykresu momentów: od siły skupionej jest to linia prosta, od obciążenia równomiernego parabola.

::callout{type="details" title="Odpowiedzi"}
- $M_A = FL = 72$ kNm, $w_B = FL^3/(3EI) = 21{,}88$ mm, $\varphi_B = FL^2/(2EI) = 8{,}21$ mrad.
- Połowa $I_y$ podwaja ugięcie do 43,77 mm. Moment pozostaje równy 72 kNm: wspornik jest statycznie wyznaczalny, więc jego siły przekrojowe nie zależą od sztywności.
- Obciążenie równomierne: $M_A = qL^2/2 = 36$ kNm i $w_B = qL^4/(8EI) = 8{,}21$ mm. To samo obciążenie całkowite daje połowę momentu i trzy ósme ugięcia.
::

### Kratownica Warrena {#exercise-pratt-truss}

Kratownica o rozpiętości 9 m i wysokości 1,8 m, z siłą 8 kN w każdym z trzech górnych węzłów E, F i G. Zaznacz **N(x)** w opcjach wyświetlania, aby zobaczyć siły osiowe. (Z krzyżulcami o naprzemiennym nachyleniu i bez słupków jest to układ, który większość podręczników nazywa kratownicą Warrena.)

::model-figure{caption="Węzły od A do G, 8 kN w E, F i G"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D], [E, F], [F, G], [A, E], [E, B], [B, F], [F, C], [C, G], [G, D]]
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: []
show: [nodeLabels]
---
::

1. Wyznacz reakcje, a następnie metodą równoważenia węzłów siły w skrajnym krzyżulcu A–E i w pasie dolnym A–B.
2. Metodą Rittera wyznacz siłę w pasie górnym w środkowym przedziale i siłę w pasie dolnym B–C.
3. Węzły w tym modelu są sztywne. Na zakładce **Elementy** zaznacz oba przeguby końcowe każdego pręta, aby otrzymać kratownicę o węzłach przegubowych, i porównaj siły osiowe.
4. Usuń krzyżulec B–F, najpierw przy węzłach sztywnych, potem przy przegubach. Czy kratownica nadal stoi?

**Zwróć uwagę** na układ znaków: pas górny jest ściskany, pas dolny rozciągany, a krzyżulce na przemian rozciągane i ściskane.

::callout{type="details" title="Odpowiedzi"}
- Reakcje: po 12 kN w A i w D.
- Skrajne krzyżulce: ściskanie 15,62 kN. Pas dolny A–B i C–D: rozciąganie 10,00 kN.
- Pas górny E–F i F–G: ściskanie 13,33 kN (momenty względem B: $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$). Pas dolny B–C: rozciąganie 16,67 kN (momenty względem F: $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$). Krzyżulce wewnętrzne: 5,21 kN, rozciągane te, które biegną od E i G w dół do pasa dolnego, ściskane te, które biegną w górę do F.
- Węzły sztywne i przegubowe dają te same siły osiowe z dokładnością do 0,1 %. Zginanie w kratownicy złożonej z trójkątów jest pomijalne i dlatego model z węzłami przegubowymi się sprawdza.
- Bez B–F kratownica o węzłach sztywnych nadal stoi dzięki pracy ramowej, z momentami zginającymi rzędu 3 kNm. Z przegubami brakuje jej jednego pręta: staje się mechanizmem, a EduBeam pokazuje, jak może się poruszać.
::

### Belka ciągła trzyprzęsłowa {#exercise-three-span-continuous-beam}

Belka o długości 16 m i przęsłach 5 + 6 + 5 m: 8 kN/m w pierwszym przęśle, 20 kN w C i 6 kN/m w ostatnim przęśle. Po otwarciu jest podparta tylko w A i D.

::model-figure{caption="Po otwarciu: podparcie tylko w A i D"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Po otwarciu jest to jedna belka swobodnie podparta o rozpiętości 16 m. Wyznacz reakcje oraz momenty w B i C.
2. Zaznacz `Dz` w B i w C, aby otrzymać belkę ciągłą na czterech podporach.
3. Wyznacz momenty nad podporami B i C z równania trzech momentów (Clapeyrona), a następnie reakcje.

**Zwróć uwagę** na momenty ujemne, które pojawiają się nad podporami pośrednimi, na to, o ile mniejsze stają się wszystkie momenty, i na to, co dzieje się z siłą 20 kN, gdy w C jest podpora.

::callout{type="details" title="Odpowiedzi"}
- Belka swobodnie podparta: $R_A = 44{,}69$ kN, $R_D = 45{,}31$ kN, $M_B = 123{,}4$ kNm i $M_C = 151{,}6$ kNm, oba dodatnie.
- Belka ciągła, z $M_A = M_D = 0$:
  $$22 M_B + 6 M_C = -\tfrac{8 \cdot 5^3}{4}$$
  $$6 M_B + 22 M_C = -\tfrac{6 \cdot 5^3}{4}$$
  dają $M_B = -9{,}766$ kNm i $M_C = -5{,}859$ kNm, oba ujemne. Siła 20 kN w C trafia wprost do podpory i niczego nie zgina.
- Reakcje: A 18,05 kN, B 22,60 kN, C 35,52 kN (łącznie z 20 kN), D 13,83 kN. Sumują się do 90 kN obciążenia.

::model-figure{caption="Belka ciągła na czterech podporach"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, B: roller, C: roller, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: [M, V]
---
::
::

### Rama portalowa {#exercise-portal-frame}

Rama z ryglem o rozpiętości 8 m na dwóch słupach o wysokości 6 m, utwierdzona w A i oparta na podporze przesuwnej w D. Rygiel jest obciążony równomiernie 10 kN/m, a w górnym narożu C działa siła 8 kN w lewo i 10 kN w dół.

::model-figure{caption="Utwierdzenie w A, podpora przesuwna w D: 10 kN/m na ryglu, 8 kN i 10 kN w C"}
---
nodes: { A: [0, 0], B: [0, -6], C: [8, -6], D: [8, 0] }
supports: { A: fixed, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
  - { node: C, fx: -8 }
  - { node: C, fz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Ile razy rama jest statycznie niewyznaczalna?
2. Odznacz `Ry` w A, aby zamienić utwierdzenie na podporę przegubową. Rama jest teraz statycznie wyznaczalna: wyznacz ręcznie reakcje i momenty w narożach B i C.
3. Ponownie zaznacz `Ry` w A, a potem zaznacz `Dx` w D, aby zamienić podporę przesuwną na nieprzesuwną. Obserwuj poziomy przesuw rygla w postaci odkształconej.

**Zwróć uwagę**, w którą stronę przesuwa się górna część ramy. W ramie w postaci wyjściowej przesuwa się w prawo, przeciwnie do siły 8 kN. Dlaczego?

::callout{type="details" title="Odpowiedzi"}
- Cztery reakcje (trzy w utwierdzeniu, jedna na podporze przesuwnej) i trzy równania równowagi: rama jest jednokrotnie statycznie niewyznaczalna. Z podporą nieprzesuwną także w D – dwukrotnie.
- Przegub w A: $V_D = (10 \cdot 8 \cdot 4 + 10 \cdot 8 - 8 \cdot 6)/8 = 44$ kN, $V_A = 46$ kN, $H_A = 8$ kN w prawo. Moment w narożu B wynosi $8 \cdot 6 = 48$ kNm. W C jest równy zeru: bez reakcji poziomej w D prawy słup przenosi tylko siłę osiową 44 kN.
- W postaci wyjściowej góra ramy przesuwa się o 9,5 mm w prawo: moment od obciążonego rygla zgina utwierdzony słup bardziej niż siła 8 kN. Gdy w D jest podpora nieprzesuwna, przejmuje ona poziomo 4,9 kN, a góra ramy przesuwa się o 4,8 mm w lewo.
::

### Obciążenie termiczne {#exercise-temperature-load}

Belka swobodnie podparta o rozpiętości 8 m, ogrzana w osi o $\Delta T_c = 20$ K, z włóknami dolnymi o 10 K chłodniejszymi od górnych ($\Delta T_b - \Delta T_t = -10$ K).

::model-figure{caption="Belka swobodnie podparta o rozpiętości 8 m, ogrzana o 20 K, z włóknami dolnymi o 10 K chłodniejszymi od górnych"}
---
nodes: { A: [0, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 20, bottom: -10, top: 0 } }
results: []
show: [nodeLabels, dimensions]
---
::

1. Zanim spojrzysz na wynik: jakie siły przekrojowe wywołuje temperatura i jak przemieszcza się belka?
2. Zaznacz `Dx` w B, aby zablokować wydłużenie belki.
3. Zaznacz dodatkowo `Ry` na obu końcach.

**Zwróć uwagę** na postać odkształconą i na liczby w **Wyniki → Wyniki węzłowe**: belka przemieszcza się bez żadnych sił przekrojowych, dopóki jej nie zablokujesz.

::callout{type="details" title="Odpowiedzi"}
- Belka statycznie wyznaczalna może się swobodnie wydłużać i wyginać, więc siły przekrojowe nie powstają. Punkt B przesuwa się na zewnątrz o $\alpha \Delta T_c L = 12 \cdot 10^{-6} \cdot 20 \cdot 8 = 1{,}92$ mm. Chłodniejsze włókna dolne się skracają, więc belka wygina się łukiem do góry z krzywizną $\kappa = \alpha (\Delta T_b - \Delta T_t)/h = -1{,}2 \cdot 10^{-4}$ 1/m: końce obracają się o $\kappa L/2 = 0{,}48$ mrad, a środek rozpiętości podnosi się o $\kappa L^2/8 = 0{,}96$ mm.
- Przy obu końcach zablokowanych w kierunku x: $N = -EA\alpha\Delta T_c = -50\,400$ kN, ściskanie. Tak duża wartość wynika z umownego pola 1 m²; w IPE 200 o polu 28,48 cm² siła wyniosłaby 143,5 kN.
- Przy obu końcach utwierdzonych: stały moment $EI\alpha(\Delta T_b - \Delta T_t)/h = 2{,}11$ kNm na całej długości belki.
::

## Rozwiązane samouczki {#worked-tutorials}

Większe modele, budowane krok po kroku i sprawdzane ręcznie:

::card-grid{cols="2"}
:::card{title="Belka pochyła" icon="lucide:move-diagonal" to="/pl/tutorials/inclined-beam"}
Krokiew pod śniegiem: obciążenie na metr rzutu poziomego, siły normalne i tnące wzdłuż spadku oraz obrócona podpora przesuwna.
:::
:::card{title="Rama trójprzegubowa" icon="lucide:triangle" to="/pl/tutorials/three-hinged-frame"}
Reakcje, N, V i M ramy z przegubem pośrednim.
:::
:::card{title="Kratownica płaska" icon="lucide:git-fork" to="/pl/tutorials/truss"}
Metoda równoważenia węzłów, metoda Rittera, pręt zerowy i przemieszczenie z zasady prac wirtualnych.
:::
:::card{title="Belka ciągła i osiadanie podpory" icon="lucide:spline" to="/pl/tutorials/continuous-beam"}
Belka dwuprzęsłowa rozwiązana metodą sił, a potem z osiadaniem podpory środkowej o 10 mm.
:::
::

Więcej sprawdzeń z rozwiązaniami analitycznymi znajdziesz na stronie [Sprawdzanie wyników ręcznie](/pl/guide/verification).

## Więcej zadań {#more-problems}

Strona [Zadania ze statyki](/pl/practice) na każde żądanie przygotuje Ci nową belkę, ramę lub kratownicę z nowymi liczbami i od razu sprawdzi Twoje reakcje oraz największy moment lub siłę w pręcie. Dla całej grupy [generator kolokwiów](/pl/exam) drukuje każdemu studentowi inną wersję kolokwium z kluczem odpowiedzi, a biblioteka [@edubeam/plot](/pl/guide/teaching#exercise-sheets-tests-and-slides-from-code) tworzy zestawy zadań z kodu.

## Dodaj własny przykład {#contribute-an-example}

Masz dobry model dydaktyczny? Udostępnij link do niego w [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions), a być może dodamy go do galerii.
