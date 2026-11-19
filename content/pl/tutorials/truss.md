---
description: "Samouczek: kratownica płaska w EduBeamie – siły w prętach metodą równoważenia węzłów i metodą Rittera, pręt zerowy i ugięcie z zasady prac wirtualnych."
source: site
---

# Samouczek: kratownica płaska

Zbudujesz małą, statycznie wyznaczalną kratownicę z prętów połączonych przegubowo, sprawdzisz siły w prętach metodą równoważenia węzłów i metodą Rittera, a ugięcie – zasadą prac wirtualnych.

- **Czas:** około 20 minut.
- **Przygotuj:** EduBeam otwarty w drugiej karcie przeglądarki, na komputerze z myszą i klawiaturą. Jeśli jeszcze nie pracowałeś w EduBeamie, zacznij od [Szybkiego startu](/pl/guide/quick-start) albo jednego z wcześniejszych samouczków.
- **Wymagana wiedza:** metoda równoważenia węzłów i metoda Rittera. Nieobowiązkowe sprawdzenie ugięcia korzysta z metody obciążenia jednostkowego (zasady prac wirtualnych).
- **Jednostki:** SI. Plakietka jednostek w prawym dolnym rogu widoku powinna pokazywać `m m² kN kNm MPa`. Jeśli widzisz na niej stopy i kipy, kliknij ją i w polu **Układ jednostek** wybierz **SI (metryczny)**.

**Czego się nauczysz**

- modelować pręty kratownicy jako elementy belkowe z przegubami na obu końcach i rysować je myszą,
- sprawdzać siły w prętach metodą równoważenia węzłów i metodą Rittera,
- rozpoznawać pręt zerowy i rozumieć, dlaczego model z węzłami przegubowymi dobrze opisuje kratownicę.

::div{.actions}
[Otwórz EduBeam ↗](https://run.edubeam.app/?lang=pl){target="_blank"} [Przejdź do obliczeń ręcznych](#_5-check-by-hand)
::

::model-figure{caption="Gotowa kratownica: 30 kN w węzłach 2 i 3, siły w prętach (rozciąganie dodatnie)"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: roller }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 30 }
  - { node: 3, fz: 30 }
results: [N, w]
show: [nodeLabels, dimensions]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

## Zadanie {#the-problem}

- Rozpiętość 12 m podzielona na trzy przedziały po 4 m, wysokość 3 m: węzły pasa dolnego od 1 do 4, węzły pasa górnego 5 i 6.
- Podpora przegubowa nieprzesuwna w węźle 1 i przesuwna w węźle 4.
- Dwie siły po 30 kN w węzłach pasa dolnego 2 i 3.
- Pręty stalowe, $E = 210$ GPa, $A = 20$ cm².

| Elementy | Pręty (według węzłów) | |
| --- | --- | --- |
| 1, 2, 3 | 1–2, 2–3, 3–4 | pas dolny |
| 4, 5, 6 | 1–5, 5–6, 6–4 | krzyżulec skrajny, pas górny, krzyżulec skrajny |
| 7, 8, 9 | 2–5, 5–3, 3–6 | słupek, krzyżulec środkowy, słupek |

**Czy jest statycznie wyznaczalna?** Mamy $m = 9$ prętów, $r = 3$ reakcje i $j = 6$ węzłów, więc $m + r = 12 = 2j$. Każdy węzeł daje dwa równania równowagi, zatem siły w prętach wynikają z samych warunków równowagi.

## Zbuduj model {#model-it}

::div{.steps}

### Materiał i przekrój {#_1-material-and-section}

1. Na pasku aplikacji kliknij **Wyczyść model**, zaznacz **Usuń materiały** i **Usuń przekroje** i kliknij **Potwierdź**. Węzły i elementy będą znów numerowane od 1.
2. Zakładka **Materiały** → **Biblioteka materiałów** → **+** w wierszu **Stal (S235)**, a potem **Anuluj**, aby zamknąć bibliotekę.
3. Zakładka **Przekroje** → **Dodaj przekrój**. Jako **Pole** wpisz `0,002`, jako **Iy** `1e-6`, w polach **Wysokość** i **Współczynnik ścinania** zostaw `1` i kliknij **Dodaj przekrój**.

W prętach z przegubami na obu końcach liczy się tylko pole przekroju; $I_y$ musi być po prostu dodatnie.

### Narysuj pręty z przegubami {#_2-draw-the-bars-with-hinges}

Pręt kratownicy to w EduBeamie element belkowy z zaznaczonymi **oboma przegubami końcowymi**. Narzędzie do rysowania myszą może je zaznaczyć za Ciebie, a kolejność rysowania nada prętom numery z tabeli powyżej.

1. Zakładka **Elementy** → drugi przycisk **Dodaj element**, ten z ikoną kursora.
2. Na pasku u góry widoku zaznacz **Przegub na początku** i **Przegub na końcu**. Każdy pręt, który teraz narysujesz, dostanie oba przeguby.
3. Pas dolny: kliknij (0, 0), (4, 0), (8, 0) i (12, 0), a potem naciśnij <kbd>Esc</kbd>.
4. Góra: znów kliknij przycisk **Dodaj element**, a potem węzeł 1 w (0, 0), punkty (4, −3) i (8, −3) oraz węzeł 4 w (12, 0). Kliknięcie istniejącego węzła łączy z nim pręt, zamiast dodawać nowy węzeł. Naciśnij <kbd>Esc</kbd>.
5. Skratowanie: jeszcze raz kliknij **Dodaj element**, a potem węzeł 2 w (4, 0), węzeł 5 w (4, −3), węzeł 3 w (8, 0) i węzeł 6 w (8, −3). Naciśnij <kbd>Esc</kbd>, a potem <kbd>F</kbd>, aby dopasować widok.

Tabela **Elementy** powinna teraz zawierać dziewięć elementów z tabeli powyżej, każdy z zaznaczonymi oboma polami w kolumnie **Przeguby końcowe**. <kbd>Esc</kbd> kończy rysowanie, ale pola przegubów na pasku zostają zaznaczone na następny raz.

### Podpory i obciążenia {#_3-supports-and-loads}

1. Kliknij węzeł 1 → **Podpory węzła** → symbol **Przegub**. Węzłowi 4 nadaj **Przegub przesuwny**.
2. Kliknij węzeł 2 → **Dodaj obciążenie** → `Fz = 30` → **Dodaj obciążenie węzłowe**. To samo zrób w węźle 3.

Dodatnie `Fz` działa w dół. Wszystkie pręty schodzące się w węźle mają przeguby, więc nic nie blokuje jego obrotu; EduBeam to akceptuje i podaje obrót takiego węzła jako 0.

::

## Wyniki {#_4-results}

W opcjach wyświetlania w prawym górnym rogu widoku (pokazuje je i ukrywa ikona koła zębatego) odznacz **Kształt odkształcony** i **M<sub>y</sub> (x)**, bo w kratownicy nie ma zginania, i zaznacz **N (x)**. Rozciąganie jest dodatnie, a EduBeam opisuje siły w kN z dwoma miejscami po przecinku.

- Obie podpory pokazują `30,00` w górę; reakcja pozioma podpory nieprzesuwnej wynosi `0,00`, bo nie działa żadne obciążenie poziome.
- Wszystkie trzy pręty pasa dolnego mają etykietę `40,00` (rozciąganie), pas górny `-40,00` (ściskanie).
- Krzyżulec środkowy 5–3 nie przenosi żadnej siły, więc nie ma etykiety, tak jak na rysunku u góry.
- Zakładka **Wyniki** → **Wyniki węzłowe**: węzeł 2 przemieszcza się w dół o $D_z$ = `2,2937 · 10⁻³ m`, czyli o 2,294 mm.

## Sprawdź ręcznie {#_5-check-by-hand}

**Reakcje.** Obciążenie jest symetryczne, więc $R_1 = R_4 = 30$ kN w górę, a ponieważ nie działa żadne obciążenie poziome, reakcja pozioma podpory nieprzesuwnej jest zerowa.

**Węzeł 1** (metoda równoważenia węzłów). Krzyżulec skrajny 1–5 ma długość 5 m, więc $\sin\alpha = 3/5$ i $\cos\alpha = 4/5$:

$$
\textstyle\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \ \Rightarrow\ N_{15} = -50\ \text{kN}
$$

$$
\textstyle\sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}
$$

**Węzeł 2.** Słupek 2–5 jest jedynym prętem, który może przenieść obciążenie 30 kN w górę: $N_{25} = +30$ kN, a $N_{23} = N_{12} = 40$ kN.

**Przekrój przez środkowy przedział** (metoda Rittera). Przetnij pręty 5–6, 5–3 i 2–3 i rozważ lewą część:

- Suma momentów względem węzła 3: $R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN.
- Siły pionowe: siła tnąca w przedziale wynosi $R_1 - 30 = 0$, więc krzyżulec środkowy **5–3 nie przenosi żadnej siły**: $N_{53} = 0$.

| Pręty | Ręcznie | EduBeam |
| --- | --- | --- |
| Pas dolny 1–2, 2–3, 3–4 | +40 kN, rozciąganie | 40,00 |
| Pas górny 5–6 | −40 kN, ściskanie | −40,00 |
| Krzyżulce skrajne 1–5, 6–4 | −50 kN | −50,00 |
| Słupki 2–5, 3–6 | +30 kN | 30,00 |
| Krzyżulec środkowy 5–3 | 0 | brak etykiety |

Pręt zerowy nie jest prętem zbędnym: przy *tym* obciążeniu nie przenosi siły, ale gdy go usuniesz, kratownica się złoży, co pokazują eksperymenty poniżej.

::callout{type="details" title="Ugięcie węzła 2 z zasady prac wirtualnych"}
Przyłóż w węźle 2 siłę jednostkową skierowaną w dół i jeszcze raz rozwiąż kratownicę ręcznie: $R_1 = 2/3$, $R_4 = 1/3$, a siły w prętach $n$ podaje tabela poniżej. Ugięcie wynosi $\delta = \sum N\,n\,L / (EA)$:

| Pręt | $N$ (kN) | $n$ | $L$ (m) | $N\,n\,L$ |
| --- | --- | --- | --- | --- |
| 1–2 | 40 | 8/9 | 4 | 142,2 |
| 2–3 | 40 | 8/9 | 4 | 142,2 |
| 3–4 | 40 | 4/9 | 4 | 71,1 |
| 1–5 | −50 | −10/9 | 5 | 277,8 |
| 5–6 | −40 | −4/9 | 4 | 71,1 |
| 6–4 | −50 | −5/9 | 5 | 138,9 |
| 2–5 | 30 | 1 | 3 | 90,0 |
| 5–3 | 0 | −5/9 | 5 | 0 |
| 3–6 | 30 | 1/3 | 3 | 30,0 |
| | | | suma | 963,3 |

$$
\delta_2 = \frac{963{,}3}{EA} = \frac{963{,}3}{210 \times 10^6 \cdot 0{,}002} = 0{,}002294\ \text{m}
$$

To 2,294 mm, tyle samo, ile wynosi $D_z$ węzła 2 w EduBeamie: `2,2937 · 10⁻³` m.
::

## Eksperymentuj {#_6-experiment}

Zmieniaj jedną rzecz naraz, przewidź wynik i dopiero wtedy sprawdź. <kbd>Ctrl</kbd>+<kbd>Z</kbd> cofa każdą zmianę.

**Przesuń jedno obciążenie.** Przyłóż oba obciążenia w węźle 2: usuń obciążenie w węźle 3, a drugie zmień na `Fz = 60`. Teraz $R_1 = 40$ kN, siła tnąca w środkowym przedziale wynosi $40 - 60 = -20$ kN i musi ją przenieść krzyżulec środkowy: $N_{53} = -20 \cdot 5/3 = -33{,}33$ kN, czyli ściskanie.

::model-figure{caption="60 kN w węźle 2: krzyżulec środkowy 5–3 przenosi teraz siłę tnącą przedziału"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: roller }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 60 }
results: [N]
show: [nodeLabels]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

**Usuń krzyżulec środkowy.** Usuń element 8. Środkowy przedział staje się przegubowym prostokątem, który może się przekosić na bok. EduBeam nie pokazuje wyników, wyświetla komunikat *Przeguby w węzłach 2, 3, 5, 6 pozwalają konstrukcji się poruszać.*, wskazując cztery narożniki tego przedziału, i animuje ruch.

**Odznacz wszystkie przeguby** w tabeli **Elementy**. Kratownica staje się ramą o sztywnych węzłach. Zaznacz **M<sub>y</sub> (x)**: momenty zginające nie przekraczają 0,1 kNm, a siły normalne zmieniają się o mniej niż 0,1 %. Dlatego w kratownicy złożonej z trójkątów idealizacja węzłów przegubowych się sprawdza.

**Zamień obie podpory na nieprzesuwne.** Czwarta reakcja sprawia, że kratownica staje się jednokrotnie statycznie niewyznaczalna, a wynik może Cię zaskoczyć: pas dolny nie przenosi teraz **żadnej siły**, a zamiast niego każda podpora pcha do środka siłą 40 kN. Węzły 1 i 4 nie mogą się od siebie oddalić, więc trzy leżące między nimi na jednej prostej pręty pasa muszą mieć łączne wydłużenie równe zeru. Wszystkie przenoszą tę samą siłę, więc ta siła jest zerowa, a jej 40 kN przejmują podpory. Zachodzi to niezależnie od pól przekrojów prętów.

::model-figure{caption="Obie podpory nieprzesuwne: podpory przejmują zadanie pasa dolnego"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: pin }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 30 }
  - { node: 3, fz: 30 }
results: [N]
show: [nodeLabels]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

## Co dalej {#next-steps}

Teorię pręta kratownicy znajdziesz na stronie [Element kratownicy](/pl/elements/truss).

::card-grid{cols="2"}
:::card{title="Ćwicz: kratownice Warrena" icon="lucide:dices" to="/pl/practice?p=T2048"}
Reakcje i siła w jednym pręcie większej kratownicy, z natychmiastowym sprawdzaniem odpowiedzi. Zacznij od zadania T2048; po kolejne zostaw zaznaczony tylko typ **Kratownica Warrena** i naciśnij **Nowe zadanie**.
:::
:::card{title="Dalej: belka ciągła i osiadanie podpory" icon="lucide:spline" to="/pl/tutorials/continuous-beam"}
Belka statycznie niewyznaczalna: co daje ciągłość, jak działa na nią osiadanie podpory i jak oba efekty sprawdzić metodą sił.
:::
::
