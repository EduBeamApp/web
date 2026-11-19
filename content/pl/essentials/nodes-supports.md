---
description: "Wstawianie i edycja węzłów w EduBeamie, przyciąganie do siatki, dzielenie elementów i dobór podpory: przegubowej, przesuwnej, utwierdzenia i ich odmian pionowych i ukośnych."
source: site
---

# Węzły i podpory

Węzły to punkty modelu: łączą je elementy, a w nich umieszczasz podpory i przykładasz obciążenia węzłowe. Wstawiasz je, wpisując współrzędne albo klikając na płótnie, a potem w węzłach podporowych ustawiasz podpory zgodne ze schematem.

## Współrzędne {#coordinates}

Każdy węzeł ma współrzędne **X** i **Z** w bieżącej [jednostce długości](/pl/essentials/units-settings#units). Oś x jest skierowana w prawo, a **oś z w dół**, więc wszystko, co leży nad gruntem, ma ujemną współrzędną Z: słup o wysokości 4 m biegnie od `Z = 0` do `Z = −4`.

::model-figure{caption="Rama portalowa o szerokości 6 m i wysokości 4 m: A i D mają Z = 0, a B i C mają Z = −4"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: fixed, D: fixed }
members: [[A, B], [B, C], [C, D]]
results: []
show: [nodeLabels, dimensions]
---
::

Jeśli wolisz oś pionową skierowaną w górę, przełącz w Ustawieniach układ współrzędnych na [oś y w górę](/pl/elements/conventions#y-up-axes). Zmienia się tylko sposób wyświetlania; model i jego pliki pozostają takie same.

## Dodawanie węzłów {#adding-nodes}

- **Wpisując współrzędne.** Zakładka *Węzły* → **Dodaj węzeł** (przycisk z ikoną **+**) albo prawy przycisk myszy na płótnie → *Dodaj węzeł*. Wpisz X i Z, a jeśli chcesz, także podpory i kąt podpory.
- **Klikając.** Zakładka *Węzły* → **Dodaj węzeł** (przycisk z ikoną kursora) albo przytrzymaj <kbd>Ctrl</kbd> przy wyborze *Dodaj węzeł* w menu płótna. Każde kliknięcie wstawia węzeł; aby skończyć, naciśnij <kbd>Esc</kbd>, **Anuluj** albo ponownie ten sam przycisk.
- **Podczas rysowania elementów.** Gdy [rysujesz elementy myszą](/pl/essentials/elements#adding-elements), kliknięcie pustego płótna tworzy w tym miejscu węzeł.
- **Kopiując.** Zaznacz węzły (i elementy), naciśnij <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd>, a potem kliknij, gdzie ma się znaleźć kopia, albo wpisz przesunięcie Δx, Δz w pasku u góry i naciśnij **Wklej**.

::div{.shots}

![Okno Dodaj węzeł](/screenshots/pl/qs-node.webp)

![W trybie myszy pasek u góry ustawia podpory i kąt każdego wstawianego węzła](/screenshots/pl/nodes-add-banner.webp)

::

Nowe węzły dostają kolejne wolne numery: `1`, `2`, `3`, …. Nazwę każdego z nich możesz zmienić w kolumnie *Węzeł* tabeli, np. na `A`, `B`, `C`.

### Przyciąganie {#snapping}

Gdy opcja **Przyciągaj do siatki** jest włączona (naciśnij <kbd>S</kbd> albo kliknij plakietkę **S** w prawym dolnym rogu widoku), wstawiane i przeciągane węzły trafiają w punkty siatki. Krok wynosi domyślnie 0,1 m, a w jednostkach amerykańskich 0,5 ft; zmienisz go w [Ustawienia → Ustawienia widoku → Siatka](/pl/essentials/units-settings#viewer-settings). Każde inne położenie uzyskasz, wpisując dokładne współrzędne w tabeli.

### Wstawianie węzła na istniejącym elemencie {#placing-a-node-on-an-existing-element}

Jeśli podczas wstawiania węzłów myszą klikniesz element (lub punkt bardzo blisko niego), EduBeam zapyta, co chcesz zrobić:

- **Połącz z konstrukcją** dzieli element na dwa, `1a` i `1b`, połączone w nowym węźle. To najszybszy sposób, aby dodać podporę pośrednią albo punkt przyłożenia obciążenia. Przeguby na zewnętrznych końcach zostają tam, gdzie były. Obciążenia równomierne i trapezowe są dzielone między obie części. Obciążenia skupione i termiczne trafiają w całości do pierwszej części, `1a`: w tabeli *Obciążenia* przenieś na `1b` obciążenie skupione, które leżało za nowym węzłem (jego położenie liczy się teraz od nowego węzła), i nadaj `1b` własne obciążenie termiczne.
- **Umieść pojedynczy węzeł** stawia węzeł na elemencie bez łączenia go z nim.

W obu przypadkach wstawianie węzłów na tym się kończy; aby wstawić kolejne, kliknij ponownie przycisk z kursorem.

## Edycja węzłów {#editing-nodes}

| Aby | Zrób tak |
| --- | --- |
| Przesunąć węzeł | Przeciągnij go w widoku (na ekranie dotykowym dotknij i przeciągnij) albo wpisz X i Z w tabeli *Węzły*. Połączone elementy, ich obciążenia i linie wymiarowe podążają za nim. |
| Zmienić jego nazwę | Wpisz nową etykietę w kolumnie *Węzeł*. |
| Zmienić jego podpory | Kliknij go → **Podpory węzła** albo użyj kolumny *Podparte stopnie swobody*. Zob. [Podpory](#supports). |
| Edytować wszystko naraz | Ołówek w kolumnie *Akcje* otwiera okno **Edytuj węzeł**: współrzędne, podpory i kąt podpory, z podglądem symbolu. |
| Usunąć go | × w tabeli, **Usuń** w panelu węzła albo zaznacz go i naciśnij <kbd>Delete</kbd>. Razem z nim znikają przyłączone elementy, obciążenia i linie wymiarowe. |

Każdą zmianę cofniesz klawiszami <kbd>Ctrl</kbd>+<kbd>Z</kbd>.

## Podpory {#supports}

Każdy węzeł może się przemieszczać na trzy sposoby – ma trzy **stopnie swobody**: `Dx` to przesunięcie wzdłuż x, `Dz` przesunięcie wzdłuż z, a `Ry` obrót w płaszczyźnie rysunku. Podpora **blokuje** niektóre z nich.

Osiem rodzajów podpór to osiem kombinacji tych trzech stopni swobody. Czytaj tabelę wierszami: w środkowej kolumnie węzeł obraca się swobodnie, w prawej ma zablokowany także obrót.

| Zablokowane przesunięcia | Obrót swobodny | Zablokowany także obrót |
| --- | --- | --- |
| **Oba** (`Dx` i `Dz`) | ![](/screenshots/pl/b-support-pin.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Przegub** | ![](/screenshots/pl/b-support-fixed.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Utwierdzenie** |
| **Tylko pionowe** (`Dz`): przesuwa się poziomo | ![](/screenshots/pl/b-support-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Przegub przesuwny** | ![](/screenshots/pl/b-support-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Utwierdzenie przesuwne** |
| **Tylko poziome** (`Dx`): przesuwa się pionowo | ![](/screenshots/pl/b-support-vertical-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Przegub przesuwny pionowy** | ![](/screenshots/pl/b-support-vertical-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Utwierdzenie przesuwne pionowe** |
| **Żadne**: przesuwa się w obu kierunkach | ![](/screenshots/pl/b-support-free.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Swobodny** (bez podpory) | ![](/screenshots/pl/b-support-rotation-only.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Tylko obrót zablokowany** |

Dla każdego zablokowanego stopnia swobody EduBeam oblicza **reakcję**: `Dx` daje siłę poziomą $R_x$, `Dz` siłę pionową $R_z$, a `Ry` moment $M$. Podpora przegubowa nieprzesuwna daje więc $R_x$ i $R_z$, przesuwna tylko $R_z$, utwierdzenie przesuwne $R_z$ i $M$, a utwierdzenie wszystkie trzy.

### Ustawianie podpory {#setting-a-support}

Wybierz symbol albo zaznacz stopnie swobody pojedynczo; oba wybory są zawsze ze sobą zgodne. Oba sposoby znajdziesz w trzech miejscach:

- w panelu węzła (kliknij węzeł) → **Podpory węzła**, razem z polem **Kąt lokalnego układu**, jak poniżej;
- w oknach **Dodaj węzeł** i **Edytuj węzeł**;
- w kolumnie *Podparte stopnie swobody* tabeli *Węzły*, gdzie symbol jest małym menu, a `Dx`, `Dz`, `Ry` to pola wyboru.

![Podpory węzła w panelu węzła: symbole, pola wyboru stopni swobody i kąt podpory](/screenshots/pl/nodes-support-picker.webp){.shot-lg}

Najedź kursorem na symbol, aby zobaczyć jego nazwę.

### Podpora przesuwna czy utwierdzenie przesuwne? {#roller-or-slider}

Każda z tych podpór stoi na prowadnicy i może się po niej przesuwać. Różni je obrót:

- **podpora przesuwna** to przegub na prowadnicy: koniec **obraca się swobodnie**, więc moment jest w nim zerowy;
- **utwierdzenie przesuwne** to utwierdzenie na prowadnicy: koniec **nie może się obrócić**, więc podpora przenosi moment.

Ta sama belka o rozpiętości 6 m obciążona 10 kN/m; zmienia się tylko prawa podpora. Przełączaj między postacią odkształconą a momentem zginającym:

::div{.shots}

:::model-figure{caption="Podpora przegubowa nieprzesuwna i przesuwna: prawy koniec obraca się swobodnie, M = 0 na końcu, w każdej podporze reakcja 30 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

:::model-figure{caption="Podpora przegubowa i utwierdzenie przesuwne: prawy koniec się nie obraca, M = −45 kNm na końcu, reakcja w utwierdzeniu przesuwnym 37,5 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: slider }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

::

Pierwsza to belka swobodnie podparta ($M_{max} = qL^2/8 = 45\ \text{kNm}$ w środku rozpiętości). Pod obciążeniem pionowym utwierdzenie przesuwne działa dokładnie jak utwierdzenie, więc druga to belka jednostronnie utwierdzona ($R_B = 5qL/8 = 37{,}5\ \text{kN}$, $M_B = -qL^2/8 = -45\ \text{kNm}$). Utrzymanie końca w poziomie usztywnia też belkę: największe ugięcie spada z 9,617 mm do 4 mm. Utwierdzenie przesuwne różni się od utwierdzenia dopiero wtedy, gdy coś działa wzdłuż jego prowadnicy.

### Podpory ukośne {#inclined-skewed-supports}

Podpora na pochyłej płaszczyźnie blokuje ruch węzła wzdłuż obróconych osi. Ustaw **Kąt lokalnego układu** α, w stopniach od −180 do 180, w panelu węzła pod *Podpory węzła*, w oknach dodawania i edycji węzła albo w polu **α** tabeli *Węzły*.

Osie węzła obracają się o α, a zaznaczone stopnie swobody działają wzdłuż nich. Kąt α obraca oś x w stronę osi z, czyli na ekranie **zgodnie z ruchem wskazówek zegara** (przy osiach z y w górę obraca x w stronę y, przeciwnie do ruchu wskazówek zegara). Podpora przesuwna na powierzchni opadającej w prawo pod kątem 30° to zatem podpora przesuwna z α = 30°. Symbol obraca się razem z osiami i w tych osiach podawana jest reakcja.

::model-figure{caption="Podpora przesuwna w B obrócona o α = 30°: jej reakcja 34,64 kN jest prostopadła do płaszczyzny przesuwu, a belka przenosi N = +17,32 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [N, M]
show: [nodeLabels]
---
::

To ta sama belka co wyżej, 6 m pod obciążeniem 10 kN/m, ale jej podpora przesuwna stoi teraz na płaszczyźnie nachylonej pod kątem 30°. Pionowa składowa reakcji w B nadal wynosi $qL/2 = 30\ \text{kN}$, więc sama reakcja ma wartość $30/\cos 30° = 34{,}64\ \text{kN}$, a jej składowa pozioma, $30 \tan 30° = 17{,}32\ \text{kN}$, wypycha węzeł B w prawo. Podpora przegubowa w A go przytrzymuje, więc belka jest rozciągana. Moment zginający się nie zmienia.

[Obciążenia węzłowe](/pl/essentials/loads#nodal-loads) w węźle z obróconymi osiami można podać w osiach globalnych albo w osiach węzła; [zadane przemieszczenie](/pl/essentials/loads#prescribed-displacements-support-settlements) działa zawsze w osiach własnych podpory.

### Stateczność {#stability}

Konstrukcja płaska potrzebuje co najmniej **trzech zablokowanych stopni swobody**, rozmieszczonych tak, aby rzeczywiście ją utrzymały. Dopóki brakuje podpór, widok pokazuje niebieską plakietkę **Brak podpór**. Jeśli podpór jest dość, ale nie mogą utrzymać konstrukcji (wszystkie są równoległe albo przecinają się w jednym punkcie) lub przeguby pozwalają prętom obracać się względem siebie, czerwony komunikat nazywa problem, a przerywany zarys pokazuje, jak konstrukcja się porusza. Wszystkie komunikaty objaśnia strona [Rozwiązywanie problemów](/pl/reference/troubleshooting#messages).

## Obciążenia węzłowe i osiadania {#nodal-loads-and-settlements}

Kliknij węzeł → **Dodaj obciążenie**, aby przyłożyć siłę lub moment, albo → **Zadaj przemieszczenie**, aby przesunąć podporę o zadaną wartość (osiadanie podpory). Oba przypadki opisuje sekcja [Obciążenia węzłowe](/pl/essentials/loads#nodal-loads).

## Linie wymiarowe {#dimension-lines}

Linie wymiarowe opisują długości na rysunku. Nie wpływają na obliczenia, ale zapisują się w projekcie, są przenoszone w linkach do udostępniania i pojawiają się na [eksportowanych obrazach](/pl/essentials/import-export#export-an-image).

| Aby | Zrób tak |
| --- | --- |
| Dodać wymiar | Prawy przycisk myszy na płótnie → **Dodaj wymiar**, a potem kliknij oba punkty końcowe. Punkt w pobliżu węzła przyciąga się do niego. |
| Zwymiarować element | Prawy przycisk myszy na elemencie → **Wymiaruj element**. |
| Edytować lub odwrócić wymiar | Kliknij linię → **Edytuj**, aby wpisać jej współrzędne, albo → **Odwróć wymiar**, aby przenieść opis na drugą stronę. |
| Przesunąć go | Przeciągnij linię albo jej punkt końcowy. Koniec leżący w węźle pozostaje z nim związany i podąża za nim. |
